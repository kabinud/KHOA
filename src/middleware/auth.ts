// Authentication middleware for KenyaHOA Pro
import { Context, Next } from 'hono';
import { AuthService, AuthError, extractToken, extractTenantSlug, RBACService } from '../utils/auth';
import { Database } from '../utils/database';
import type { CloudflareBindings, User, PlatformTenant, JWTPayload, UserRole } from '../types';

export interface AuthContext {
  user: User;
  tenant: PlatformTenant;
  payload: JWTPayload;
}

// Extend Hono's Context type to include auth data
declare module 'hono' {
  interface ContextVariableMap {
    auth?: AuthContext;
  }
}

// Authentication middleware - validates JWT and loads user/tenant data
export async function authMiddleware(c: Context<{ Bindings: CloudflareBindings }>, next: Next) {
  try {
    const authHeader = c.req.header('Authorization');
    const token = extractToken(authHeader);
    
    if (!token) {
      return c.json({ error: 'Authentication required', message: 'No token provided' }, 401);
    }

    // Verify JWT token
    const payload = await AuthService.verifyToken(token);
    
    // Get database instance
    const db = new Database(c.env.DB);
    
    // Load user data
    const user = await db.findById<User>('users', payload.user_id, payload.tenant_id);
    if (!user) {
      return c.json({ error: 'Authentication failed', message: 'User not found' }, 401);
    }

    // Check if user is active
    if (user.status !== 'active') {
      return c.json({ error: 'Account suspended', message: 'Your account has been suspended' }, 403);
    }

    // Load tenant data
    const tenant = await db.findById<PlatformTenant>('platform_tenants', payload.tenant_id);
    if (!tenant) {
      return c.json({ error: 'Authentication failed', message: 'Tenant not found' }, 401);
    }

    // Check if tenant is active
    if (tenant.status !== 'active') {
      return c.json({ error: 'Tenant suspended', message: 'This HOA account has been suspended' }, 403);
    }

    // Store auth context in Hono context
    c.set('auth', { user, tenant, payload });
    
    await next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error instanceof AuthError) {
      return c.json({ error: 'Authentication failed', message: error.message }, error.statusCode);
    }
    
    return c.json({ error: 'Authentication failed', message: 'Invalid token' }, 401);
  }
}

// Optional authentication middleware - doesn't require auth but loads user if token present
export async function optionalAuthMiddleware(c: Context<{ Bindings: CloudflareBindings }>, next: Next) {
  try {
    const authHeader = c.req.header('Authorization');
    const token = extractToken(authHeader);
    
    if (token) {
      const payload = await AuthService.verifyToken(token);
      const db = new Database(c.env.DB);
      
      const user = await db.findById<User>('users', payload.user_id, payload.tenant_id);
      const tenant = await db.findById<PlatformTenant>('platform_tenants', payload.tenant_id);
      
      if (user && tenant && user.status === 'active' && tenant.status === 'active') {
        c.set('auth', { user, tenant, payload });
      }
    }
    
    await next();
  } catch (error) {
    // Ignore auth errors in optional middleware
    console.warn('Optional auth middleware warning:', error);
    await next();
  }
}

// Role-based authorization middleware
export function requireRole(...requiredRoles: UserRole[]) {
  return async (c: Context<{ Bindings: CloudflareBindings }>, next: Next) => {
    const auth = c.get('auth');
    
    if (!auth) {
      return c.json({ error: 'Authorization required', message: 'Authentication required' }, 401);
    }

    const hasRequiredRole = requiredRoles.some(role => 
      RBACService.hasRole(auth.user.role, role)
    );

    if (!hasRequiredRole) {
      return c.json({ 
        error: 'Insufficient permissions', 
        message: `This action requires one of the following roles: ${requiredRoles.join(', ')}` 
      }, 403);
    }

    await next();
  };
}

// Resource permission middleware
export function requirePermission(resource: string, action: string) {
  return async (c: Context<{ Bindings: CloudflareBindings }>, next: Next) => {
    const auth = c.get('auth');
    
    if (!auth) {
      return c.json({ error: 'Authorization required', message: 'Authentication required' }, 401);
    }

    if (!RBACService.hasPermission(auth.user.role, resource, action)) {
      return c.json({ 
        error: 'Insufficient permissions', 
        message: `You don't have permission to ${action} ${resource}` 
      }, 403);
    }

    await next();
  };
}

// Tenant isolation middleware - ensures users can only access their tenant's data
export async function tenantIsolationMiddleware(c: Context<{ Bindings: CloudflareBindings }>, next: Next) {
  const auth = c.get('auth');
  
  if (!auth) {
    return c.json({ error: 'Authorization required', message: 'Authentication required' }, 401);
  }

  // Extract tenant from URL or request body
  const urlTenantId = c.req.param('tenant_id');
  const bodyTenantId = await c.req.json().then(body => body?.tenant_id).catch(() => null);
  const targetTenantId = urlTenantId || bodyTenantId;

  if (targetTenantId && !RBACService.canAccessTenant(auth.user.role, targetTenantId, auth.tenant.id)) {
    return c.json({ 
      error: 'Access denied', 
      message: 'You can only access data from your own HOA' 
    }, 403);
  }

  await next();
}

// Subdomain-based tenant resolution middleware
export async function tenantResolutionMiddleware(c: Context<{ Bindings: CloudflareBindings }>, next: Next) {
  try {
    const host = c.req.header('Host');
    const tenantSlug = extractTenantSlug(host);
    
    if (tenantSlug) {
      const db = new Database(c.env.DB);
      const tenant = await db.findByField<PlatformTenant>('platform_tenants', 'slug', tenantSlug);
      
      if (tenant.length > 0 && tenant[0].status === 'active') {
        // Store tenant info for use in subsequent middleware/handlers
        c.set('tenant_info', tenant[0]);
      }
    }
    
    await next();
  } catch (error) {
    console.error('Tenant resolution error:', error);
    await next();
  }
}

// Admin-only middleware
export const requireAdmin = requireRole(
  UserRole.SUPER_ADMIN, 
  UserRole.HOA_ADMIN
);

// Board member or higher middleware
export const requireBoardMember = requireRole(
  UserRole.SUPER_ADMIN,
  UserRole.HOA_ADMIN,
  UserRole.BOARD_PRESIDENT,
  UserRole.BOARD_MEMBER
);

// Management level middleware
export const requireManagement = requireRole(
  UserRole.SUPER_ADMIN,
  UserRole.HOA_ADMIN,
  UserRole.BOARD_PRESIDENT,
  UserRole.BOARD_MEMBER,
  UserRole.PROPERTY_MANAGER
);

// Resident or higher middleware
export const requireResident = requireRole(
  UserRole.SUPER_ADMIN,
  UserRole.HOA_ADMIN,
  UserRole.BOARD_PRESIDENT,
  UserRole.BOARD_MEMBER,
  UserRole.PROPERTY_MANAGER,
  UserRole.FINANCIAL_OFFICER,
  UserRole.MAINTENANCE_SUPERVISOR,
  UserRole.SECURITY_COORDINATOR,
  UserRole.COMMITTEE_MEMBER,
  UserRole.RESIDENT_OWNER,
  UserRole.RESIDENT_TENANT
);

// CORS middleware for API routes
export async function corsMiddleware(c: Context, next: Next) {
  // Handle preflight requests
  if (c.req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
      }
    });
  }

  // Set CORS headers for all API responses
  await next();
  
  c.header('Access-Control-Allow-Origin', '*');
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Rate limiting middleware (basic implementation)
export function rateLimitMiddleware(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
  return async (c: Context<{ Bindings: CloudflareBindings }>, next: Next) => {
    const clientIP = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown';
    const key = `rate_limit:${clientIP}`;
    
    try {
      // Get current count from KV
      const currentCount = await c.env.KV.get(key);
      const count = currentCount ? parseInt(currentCount) : 0;
      
      if (count >= maxRequests) {
        return c.json({ 
          error: 'Rate limit exceeded', 
          message: `Too many requests. Try again later.` 
        }, 429);
      }
      
      // Increment counter with expiration
      await c.env.KV.put(key, (count + 1).toString(), { expirationTtl: Math.ceil(windowMs / 1000) });
      
      // Add rate limit headers
      c.header('X-RateLimit-Limit', maxRequests.toString());
      c.header('X-RateLimit-Remaining', (maxRequests - count - 1).toString());
      c.header('X-RateLimit-Reset', new Date(Date.now() + windowMs).toISOString());
      
      await next();
    } catch (error) {
      console.error('Rate limit middleware error:', error);
      // Continue without rate limiting if KV fails
      await next();
    }
  };
}

// Request logging middleware
export async function loggingMiddleware(c: Context<{ Bindings: CloudflareBindings }>, next: Next) {
  const start = Date.now();
  const method = c.req.method;
  const url = c.req.url;
  const userAgent = c.req.header('User-Agent') || 'Unknown';
  const clientIP = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown';
  
  await next();
  
  const duration = Date.now() - start;
  const status = c.res.status;
  
  // Log request details
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    method,
    url,
    status,
    duration: `${duration}ms`,
    clientIP,
    userAgent: userAgent.substring(0, 100), // Truncate long user agents
    requestId: crypto.randomUUID()
  }));
}

// Helper function to get current user from context
export function getCurrentUser(c: Context): User | null {
  const auth = c.get('auth');
  return auth?.user || null;
}

// Helper function to get current tenant from context
export function getCurrentTenant(c: Context): PlatformTenant | null {
  const auth = c.get('auth');
  return auth?.tenant || null;
}

// Helper function to check if user has specific role
export function hasRole(c: Context, role: UserRole): boolean {
  const auth = c.get('auth');
  return auth ? RBACService.hasRole(auth.user.role, role) : false;
}

// Helper function to check if user has permission for resource/action
export function hasPermission(c: Context, resource: string, action: string): boolean {
  const auth = c.get('auth');
  return auth ? RBACService.hasPermission(auth.user.role, resource, action) : false;
}