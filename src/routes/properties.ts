// Property management routes for KenyaHOA Pro
import { Hono } from 'hono';
import { v4 as uuidv4 } from 'uuid';
import { Database } from '../utils/database';
import { validateAndSanitize, PropertyCreateSchema, PropertyUpdateSchema, PaginationSchema } from '../utils/validation';
import { 
  authMiddleware, 
  getCurrentUser, 
  getCurrentTenant, 
  requirePermission,
  requireManagement,
  hasPermission
} from '../middleware/auth';
import type { CloudflareBindings, Property, Resident, User } from '../types';

const properties = new Hono<{ Bindings: CloudflareBindings }>();

// Apply authentication middleware
properties.use('*', authMiddleware);

// Get all properties (with pagination and search)
properties.get('/', async (c) => {
  try {
    const user = getCurrentUser(c)!;
    const tenant = getCurrentTenant(c)!;
    const db = new Database(c.env.DB);

    // Validate query parameters
    const queryParams = validateAndSanitize(PaginationSchema, {
      page: c.req.query('page'),
      limit: c.req.query('limit'),
      sort_by: c.req.query('sort_by') || 'unit_number',
      sort_order: c.req.query('sort_order') || 'asc',
      search: c.req.query('search')
    });

    if (!queryParams.success) {
      return c.json({ error: 'Invalid parameters', message: queryParams.errors.join(', ') }, 400);
    }

    const { page, limit, sort_by, sort_order, search } = queryParams.data;

    // Build query based on user permissions
    let baseQuery = `
      SELECT 
        p.*,
        COUNT(r.id) as resident_count,
        GROUP_CONCAT(u.first_name || ' ' || u.last_name) as resident_names
      FROM properties p
      LEFT JOIN residents r ON p.id = r.property_id AND r.status = 'active'
      LEFT JOIN users u ON r.user_id = u.id
    `;

    let params: any[] = [];

    // If user is a resident, only show their own properties
    if (['resident_owner', 'resident_tenant'].includes(user.role)) {
      baseQuery += `
        JOIN residents ur ON p.id = ur.property_id 
        WHERE ur.user_id = ? AND p.tenant_id = ?
      `;
      params = [user.id, tenant.id];
    } else {
      baseQuery += ' WHERE p.tenant_id = ?';
      params = [tenant.id];
    }

    // Add search functionality
    if (search) {
      baseQuery += ` AND (
        p.unit_number LIKE ? OR 
        p.property_type LIKE ? OR 
        p.building_section LIKE ?
      )`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    baseQuery += ` GROUP BY p.id`;

    // Add sorting
    const validSortFields = ['unit_number', 'property_type', 'bedrooms', 'monthly_dues', 'status', 'created_at'];
    const sortField = validSortFields.includes(sort_by) ? sort_by : 'unit_number';
    baseQuery += ` ORDER BY p.${sortField} ${sort_order.toUpperCase()}`;

    // Get paginated results
    const result = await db.paginate<any>(baseQuery, params, page, limit);

    return c.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });

  } catch (error) {
    console.error('Get properties error:', error);
    return c.json({ error: 'Request failed', message: 'Unable to fetch properties' }, 500);
  }
});

// Get single property details
properties.get('/:id', async (c) => {
  try {
    const propertyId = c.req.param('id');
    const user = getCurrentUser(c)!;
    const tenant = getCurrentTenant(c)!;
    const db = new Database(c.env.DB);

    // Get property details
    const property = await db.findById<Property>('properties', propertyId, tenant.id);
    if (!property) {
      return c.json({ error: 'Not found', message: 'Property not found' }, 404);
    }

    // Check if user has permission to view this property
    const canViewAll = hasPermission(c, 'properties', 'read');
    if (!canViewAll) {
      // Check if user is a resident of this property
      const userResidentRecord = await db.query<Resident>(
        'SELECT * FROM residents WHERE user_id = ? AND property_id = ? AND status = "active"',
        [user.id, propertyId]
      );
      
      if (userResidentRecord.length === 0) {
        return c.json({ error: 'Access denied', message: 'You can only view your own properties' }, 403);
      }
    }

    // Get residents of this property
    const residents = await db.query<any>(
      `SELECT 
        r.*,
        u.first_name,
        u.last_name,
        u.email,
        u.phone
       FROM residents r
       JOIN users u ON r.user_id = u.id
       WHERE r.property_id = ? AND r.status = 'active'
       ORDER BY r.relationship_type, u.first_name`,
      [propertyId]
    );

    // Get recent maintenance requests
    const maintenanceRequests = await db.query<any>(
      `SELECT 
        mr.*,
        u.first_name || ' ' || u.last_name as resident_name
       FROM maintenance_requests mr
       JOIN residents r ON mr.resident_id = r.id
       JOIN users u ON r.user_id = u.id
       WHERE mr.property_id = ?
       ORDER BY mr.submitted_at DESC
       LIMIT 5`,
      [propertyId]
    );

    // Get financial transactions
    const transactions = await db.query<any>(
      `SELECT 
        ft.*,
        u.first_name || ' ' || u.last_name as resident_name
       FROM financial_transactions ft
       LEFT JOIN residents r ON ft.resident_id = r.id
       LEFT JOIN users u ON r.user_id = u.id
       WHERE ft.property_id = ?
       ORDER BY ft.created_at DESC
       LIMIT 10`,
      [propertyId]
    );

    return c.json({
      success: true,
      data: {
        property,
        residents,
        maintenance_requests: maintenanceRequests,
        transactions
      }
    });

  } catch (error) {
    console.error('Get property details error:', error);
    return c.json({ error: 'Request failed', message: 'Unable to fetch property details' }, 500);
  }
});

// Create new property (management only)
properties.post('/', requireManagement, async (c) => {
  try {
    const body = await c.req.json();
    const validation = validateAndSanitize(PropertyCreateSchema, body);
    
    if (!validation.success) {
      return c.json({ error: 'Validation failed', message: validation.errors.join(', ') }, 400);
    }

    const tenant = getCurrentTenant(c)!;
    const user = getCurrentUser(c)!;
    const db = new Database(c.env.DB);

    // Check if unit number already exists
    const existingProperty = await db.query<Property>(
      'SELECT id FROM properties WHERE unit_number = ? AND tenant_id = ?',
      [validation.data.unit_number, tenant.id]
    );

    if (existingProperty.length > 0) {
      return c.json({ error: 'Conflict', message: 'A property with this unit number already exists' }, 409);
    }

    // Create property
    const propertyId = uuidv4();
    const propertyData = {
      id: propertyId,
      tenant_id: tenant.id,
      ...validation.data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await db.insert('properties', propertyData);

    // Create audit log
    await db.insert('audit_logs', {
      id: uuidv4(),
      tenant_id: tenant.id,
      user_id: user.id,
      action: 'CREATE',
      entity_type: 'property',
      entity_id: propertyId,
      new_values: JSON.stringify(propertyData),
      ip_address: c.req.header('CF-Connecting-IP'),
      created_at: new Date().toISOString()
    });

    return c.json({
      success: true,
      data: propertyData,
      message: 'Property created successfully'
    }, 201);

  } catch (error) {
    console.error('Create property error:', error);
    return c.json({ error: 'Request failed', message: 'Unable to create property' }, 500);
  }
});

// Update property (management only)
properties.put('/:id', requireManagement, async (c) => {
  try {
    const propertyId = c.req.param('id');
    const body = await c.req.json();
    const validation = validateAndSanitize(PropertyUpdateSchema, body);
    
    if (!validation.success) {
      return c.json({ error: 'Validation failed', message: validation.errors.join(', ') }, 400);
    }

    const tenant = getCurrentTenant(c)!;
    const user = getCurrentUser(c)!;
    const db = new Database(c.env.DB);

    // Get existing property
    const existingProperty = await db.findById<Property>('properties', propertyId, tenant.id);
    if (!existingProperty) {
      return c.json({ error: 'Not found', message: 'Property not found' }, 404);
    }

    // Check if unit number conflicts (if being changed)
    if (validation.data.unit_number && validation.data.unit_number !== existingProperty.unit_number) {
      const conflictingProperty = await db.query<Property>(
        'SELECT id FROM properties WHERE unit_number = ? AND tenant_id = ? AND id != ?',
        [validation.data.unit_number, tenant.id, propertyId]
      );

      if (conflictingProperty.length > 0) {
        return c.json({ error: 'Conflict', message: 'A property with this unit number already exists' }, 409);
      }
    }

    // Update property
    const updateData = {
      ...validation.data,
      updated_at: new Date().toISOString()
    };

    const success = await db.update('properties', propertyId, updateData, tenant.id);
    if (!success) {
      return c.json({ error: 'Update failed', message: 'Unable to update property' }, 500);
    }

    // Create audit log
    await db.insert('audit_logs', {
      id: uuidv4(),
      tenant_id: tenant.id,
      user_id: user.id,
      action: 'UPDATE',
      entity_type: 'property',
      entity_id: propertyId,
      old_values: JSON.stringify(existingProperty),
      new_values: JSON.stringify({ ...existingProperty, ...updateData }),
      ip_address: c.req.header('CF-Connecting-IP'),
      created_at: new Date().toISOString()
    });

    // Get updated property
    const updatedProperty = await db.findById<Property>('properties', propertyId, tenant.id);

    return c.json({
      success: true,
      data: updatedProperty,
      message: 'Property updated successfully'
    });

  } catch (error) {
    console.error('Update property error:', error);
    return c.json({ error: 'Request failed', message: 'Unable to update property' }, 500);
  }
});

// Delete property (admin only)
properties.delete('/:id', requirePermission('properties', 'delete'), async (c) => {
  try {
    const propertyId = c.req.param('id');
    const tenant = getCurrentTenant(c)!;
    const user = getCurrentUser(c)!;
    const db = new Database(c.env.DB);

    // Get existing property
    const existingProperty = await db.findById<Property>('properties', propertyId, tenant.id);
    if (!existingProperty) {
      return c.json({ error: 'Not found', message: 'Property not found' }, 404);
    }

    // Check if property has active residents
    const activeResidents = await db.query<Resident>(
      'SELECT id FROM residents WHERE property_id = ? AND status = "active"',
      [propertyId]
    );

    if (activeResidents.length > 0) {
      return c.json({ 
        error: 'Conflict', 
        message: 'Cannot delete property with active residents. Please move residents first.' 
      }, 409);
    }

    // Soft delete by updating status (preserve historical data)
    const success = await db.update('properties', propertyId, {
      status: 'deleted',
      updated_at: new Date().toISOString()
    }, tenant.id);

    if (!success) {
      return c.json({ error: 'Delete failed', message: 'Unable to delete property' }, 500);
    }

    // Create audit log
    await db.insert('audit_logs', {
      id: uuidv4(),
      tenant_id: tenant.id,
      user_id: user.id,
      action: 'DELETE',
      entity_type: 'property',
      entity_id: propertyId,
      old_values: JSON.stringify(existingProperty),
      ip_address: c.req.header('CF-Connecting-IP'),
      created_at: new Date().toISOString()
    });

    return c.json({
      success: true,
      message: 'Property deleted successfully'
    });

  } catch (error) {
    console.error('Delete property error:', error);
    return c.json({ error: 'Request failed', message: 'Unable to delete property' }, 500);
  }
});

// Get property statistics
properties.get('/stats/overview', requireManagement, async (c) => {
  try {
    const tenant = getCurrentTenant(c)!;
    const db = new Database(c.env.DB);

    const stats = await db.query<any>(
      `SELECT 
        COUNT(*) as total_properties,
        SUM(CASE WHEN status = 'occupied' THEN 1 ELSE 0 END) as occupied,
        SUM(CASE WHEN status = 'vacant' THEN 1 ELSE 0 END) as vacant,
        SUM(CASE WHEN status = 'maintenance' THEN 1 ELSE 0 END) as maintenance,
        AVG(monthly_dues) as avg_monthly_dues,
        SUM(monthly_dues) as total_monthly_dues,
        COUNT(DISTINCT property_type) as property_types,
        AVG(bedrooms) as avg_bedrooms,
        AVG(bathrooms) as avg_bathrooms,
        AVG(square_footage) as avg_square_footage
       FROM properties 
       WHERE tenant_id = ? AND status != 'deleted'`,
      [tenant.id]
    );

    const propertyTypeBreakdown = await db.query<any>(
      `SELECT 
        property_type,
        COUNT(*) as count,
        AVG(monthly_dues) as avg_dues
       FROM properties 
       WHERE tenant_id = ? AND status != 'deleted'
       GROUP BY property_type`,
      [tenant.id]
    );

    const monthlyDuesDistribution = await db.query<any>(
      `SELECT 
        CASE 
          WHEN monthly_dues < 5000 THEN 'Under 5K'
          WHEN monthly_dues < 10000 THEN '5K-10K'
          WHEN monthly_dues < 20000 THEN '10K-20K'
          WHEN monthly_dues < 30000 THEN '20K-30K'
          ELSE 'Over 30K'
        END as dues_range,
        COUNT(*) as count
       FROM properties 
       WHERE tenant_id = ? AND status != 'deleted'
       GROUP BY dues_range
       ORDER BY MIN(monthly_dues)`,
      [tenant.id]
    );

    return c.json({
      success: true,
      data: {
        overview: stats[0] || {},
        property_type_breakdown: propertyTypeBreakdown,
        dues_distribution: monthlyDuesDistribution
      }
    });

  } catch (error) {
    console.error('Property stats error:', error);
    return c.json({ error: 'Request failed', message: 'Unable to fetch property statistics' }, 500);
  }
});

export default properties;