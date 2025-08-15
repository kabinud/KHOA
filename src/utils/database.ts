// Database utility functions for KenyaHOA Pro
import type { CloudflareBindings } from '../types';

export class DatabaseError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class Database {
  constructor(private db: D1Database) {}

  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    try {
      const result = await this.db.prepare(sql).bind(...params).all();
      return result.results as T[];
    } catch (error) {
      console.error('Database query error:', error);
      throw new DatabaseError(`Query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async queryFirst<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    try {
      const result = await this.db.prepare(sql).bind(...params).first();
      return result as T | null;
    } catch (error) {
      console.error('Database query error:', error);
      throw new DatabaseError(`Query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async execute(sql: string, params: any[] = []): Promise<D1Result> {
    try {
      return await this.db.prepare(sql).bind(...params).run();
    } catch (error) {
      console.error('Database execute error:', error);
      throw new DatabaseError(`Execute failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async batch(statements: Array<{ sql: string; params?: any[] }>): Promise<D1Result[]> {
    try {
      const prepared = statements.map(stmt => 
        this.db.prepare(stmt.sql).bind(...(stmt.params || []))
      );
      return await this.db.batch(prepared);
    } catch (error) {
      console.error('Database batch error:', error);
      throw new DatabaseError(`Batch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Tenant-aware query methods
  async queryTenant<T = any>(tenantId: string, sql: string, params: any[] = []): Promise<T[]> {
    const tenantSql = sql.includes('WHERE') 
      ? sql.replace('WHERE', 'WHERE tenant_id = ? AND')
      : sql + ' WHERE tenant_id = ?';
    
    return this.query<T>(tenantSql, [tenantId, ...params]);
  }

  async queryTenantFirst<T = any>(tenantId: string, sql: string, params: any[] = []): Promise<T | null> {
    const tenantSql = sql.includes('WHERE') 
      ? sql.replace('WHERE', 'WHERE tenant_id = ? AND')
      : sql + ' WHERE tenant_id = ?';
    
    return this.queryFirst<T>(tenantSql, [tenantId, ...params]);
  }

  // Utility methods for common operations
  async findById<T>(table: string, id: string, tenantId?: string): Promise<T | null> {
    if (tenantId) {
      return this.queryFirst<T>(`SELECT * FROM ${table} WHERE id = ? AND tenant_id = ?`, [id, tenantId]);
    }
    return this.queryFirst<T>(`SELECT * FROM ${table} WHERE id = ?`, [id]);
  }

  async findByField<T>(table: string, field: string, value: any, tenantId?: string): Promise<T[]> {
    if (tenantId) {
      return this.query<T>(`SELECT * FROM ${table} WHERE ${field} = ? AND tenant_id = ?`, [value, tenantId]);
    }
    return this.query<T>(`SELECT * FROM ${table} WHERE ${field} = ?`, [value]);
  }

  async insert(table: string, data: Record<string, any>): Promise<string> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map(() => '?').join(', ');
    
    const sql = `INSERT INTO ${table} (${fields.join(', ')}) VALUES (${placeholders})`;
    const result = await this.execute(sql, values);
    
    if (!result.success) {
      throw new DatabaseError(`Insert failed: ${result.error}`);
    }
    
    return result.meta?.last_row_id?.toString() || '';
  }

  async update(table: string, id: string, data: Record<string, any>, tenantId?: string): Promise<boolean> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    
    let sql = `UPDATE ${table} SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    let params = [...values, id];
    
    if (tenantId) {
      sql += ' AND tenant_id = ?';
      params.push(tenantId);
    }
    
    const result = await this.execute(sql, params);
    return result.success && (result.meta?.changes || 0) > 0;
  }

  async delete(table: string, id: string, tenantId?: string): Promise<boolean> {
    let sql = `DELETE FROM ${table} WHERE id = ?`;
    let params = [id];
    
    if (tenantId) {
      sql += ' AND tenant_id = ?';
      params.push(tenantId);
    }
    
    const result = await this.execute(sql, params);
    return result.success && (result.meta?.changes || 0) > 0;
  }

  // Pagination helper
  async paginate<T>(
    baseQuery: string,
    params: any[],
    page: number = 1,
    limit: number = 20,
    tenantId?: string
  ): Promise<{
    data: T[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_items: number;
      items_per_page: number;
      has_next: boolean;
      has_prev: boolean;
    };
  }> {
    // Get total count
    let countQuery = baseQuery.replace(/SELECT .+ FROM/, 'SELECT COUNT(*) as count FROM');
    if (tenantId && !countQuery.includes('tenant_id')) {
      countQuery = countQuery.includes('WHERE') 
        ? countQuery.replace('WHERE', 'WHERE tenant_id = ? AND')
        : countQuery + ' WHERE tenant_id = ?';
      params = [tenantId, ...params];
    }
    
    const countResult = await this.queryFirst<{ count: number }>(countQuery, params);
    const totalItems = countResult?.count || 0;
    const totalPages = Math.ceil(totalItems / limit);
    const offset = (page - 1) * limit;
    
    // Get paginated data
    let dataQuery = baseQuery;
    if (tenantId && !dataQuery.includes('tenant_id')) {
      dataQuery = dataQuery.includes('WHERE') 
        ? dataQuery.replace('WHERE', 'WHERE tenant_id = ? AND')
        : dataQuery + ' WHERE tenant_id = ?';
    }
    dataQuery += ` LIMIT ${limit} OFFSET ${offset}`;
    
    const data = await this.query<T>(dataQuery, params);
    
    return {
      data,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_items: totalItems,
        items_per_page: limit,
        has_next: page < totalPages,
        has_prev: page > 1
      }
    };
  }
}