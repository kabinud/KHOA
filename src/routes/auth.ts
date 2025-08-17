// Authentication routes for KenyaHOA Pro
import { Hono } from 'hono';
import { v4 as uuidv4 } from 'uuid';
import { AuthService, AuthError } from '../utils/auth';
import { Database, DatabaseError } from '../utils/database';
import { validateAndSanitize, LoginSchema, RegisterSchema, sanitizeEmail, sanitizePhone } from '../utils/validation';
import { corsMiddleware, rateLimitMiddleware } from '../middleware/auth';
import type { CloudflareBindings, User, PlatformTenant, LoginRequest, RegisterRequest } from '../types';

const auth = new Hono<{ Bindings: CloudflareBindings }>();

// Apply middleware
auth.use('*', corsMiddleware);
auth.use('*', rateLimitMiddleware(10, 5 * 60 * 1000)); // 10 requests per 5 minutes for auth routes

// Login endpoint
auth.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const validation = validateAndSanitize(LoginSchema, body);
    
    if (!validation.success) {
      return c.json({ error: 'Validation failed', message: validation.errors.join(', ') }, 400);
    }

    const { email, password, tenant_slug } = validation.data;
    const db = new Database(c.env.DB);

    // Find user by email
    let user: User | null = null;
    let tenant: PlatformTenant | null = null;

    if (tenant_slug) {
      // Login with specific tenant
      const tenants = await db.findByField<PlatformTenant>('platform_tenants', 'slug', tenant_slug);
      if (tenants.length === 0) {
        return c.json({ error: 'Login failed', message: 'Invalid HOA or credentials' }, 401);
      }
      
      tenant = tenants[0];
      const users = await db.query<User>(
        'SELECT * FROM users WHERE email = ? AND tenant_id = ?',
        [sanitizeEmail(email), tenant.id]
      );
      
      if (users.length > 0) {
        user = users[0];
      }
    } else {
      // Login without tenant slug - find user across all tenants
      const users = await db.findByField<User>('users', 'email', sanitizeEmail(email));
      
      if (users.length === 1) {
        user = users[0];
        tenant = await db.findById<PlatformTenant>('platform_tenants', user.tenant_id);
      } else if (users.length > 1) {
        return c.json({ 
          error: 'Multiple accounts found', 
          message: 'Multiple accounts found with this email. Please specify your HOA subdomain.' 
        }, 400);
      }
    }

    if (!user || !tenant) {
      return c.json({ error: 'Login failed', message: 'Invalid credentials' }, 401);
    }

    // Check if user account is active
    if (user.status !== 'active') {
      return c.json({ error: 'Account suspended', message: 'Your account has been suspended' }, 403);
    }

    // Check if tenant is active
    if (tenant.status !== 'active') {
      return c.json({ error: 'HOA suspended', message: 'This HOA account has been suspended' }, 403);
    }

    // Verify password
    const isValidPassword = await AuthService.verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return c.json({ error: 'Login failed', message: 'Invalid credentials' }, 401);
    }

    // Update last login
    await db.update('users', user.id, { last_login: new Date().toISOString() }, user.tenant_id);

    // Generate JWT token
    const token = await AuthService.generateToken(user);

    // Return success response (exclude password hash)
    const { password_hash, ...safeUser } = user;
    
    return c.json({
      success: true,
      token,
      user: safeUser,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        subscription_plan: tenant.subscription_plan
      },
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    });

  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof DatabaseError) {
      return c.json({ error: 'Database error', message: 'Unable to process login' }, 500);
    }
    
    return c.json({ error: 'Login failed', message: 'An unexpected error occurred' }, 500);
  }
});

// Register endpoint
auth.post('/register', async (c) => {
  try {
    const body = await c.req.json();
    const validation = validateAndSanitize(RegisterSchema, body);
    
    if (!validation.success) {
      return c.json({ error: 'Validation failed', message: validation.errors.join(', ') }, 400);
    }

    const { tenant_slug, email, password, first_name, last_name, phone, property_unit } = validation.data;
    const db = new Database(c.env.DB);

    // Find tenant
    const tenants = await db.findByField<PlatformTenant>('platform_tenants', 'slug', tenant_slug);
    if (tenants.length === 0) {
      return c.json({ error: 'Registration failed', message: 'HOA not found' }, 404);
    }

    const tenant = tenants[0];
    if (tenant.status !== 'active') {
      return c.json({ error: 'Registration failed', message: 'HOA registration is currently disabled' }, 403);
    }

    const sanitizedEmail = sanitizeEmail(email);

    // Check if user already exists
    const existingUsers = await db.query<User>(
      'SELECT id FROM users WHERE email = ? AND tenant_id = ?',
      [sanitizedEmail, tenant.id]
    );

    if (existingUsers.length > 0) {
      return c.json({ error: 'Registration failed', message: 'An account with this email already exists' }, 409);
    }

    // Hash password
    const passwordHash = await AuthService.hashPassword(password);

    // Create user
    const userId = uuidv4();
    const userData = {
      id: userId,
      tenant_id: tenant.id,
      email: sanitizedEmail,
      phone: phone ? sanitizePhone(phone) : null,
      password_hash: passwordHash,
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      role: 'resident_owner', // Default role for new registrations
      status: 'active',
      email_verified: false,
      phone_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await db.insert('users', userData);

    // If property unit is provided, try to link user to property
    if (property_unit) {
      const properties = await db.query<any>(
        'SELECT id FROM properties WHERE unit_number = ? AND tenant_id = ?',
        [property_unit.trim(), tenant.id]
      );

      if (properties.length > 0) {
        // Create resident record
        const residentData = {
          id: uuidv4(),
          tenant_id: tenant.id,
          user_id: userId,
          property_id: properties[0].id,
          relationship_type: 'owner',
          move_in_date: new Date().toISOString().split('T')[0], // Today's date
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        await db.insert('residents', residentData);
      }
    }

    // Generate JWT token
    const newUser: User = { ...userData, phone: userData.phone || undefined } as User;
    const token = await AuthService.generateToken(newUser);

    // Return success response (exclude password hash)
    const { password_hash, ...safeUser } = newUser;
    
    return c.json({
      success: true,
      token,
      user: safeUser,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        subscription_plan: tenant.subscription_plan
      },
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      message: 'Account created successfully'
    }, 201);

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof DatabaseError) {
      return c.json({ error: 'Database error', message: 'Unable to create account' }, 500);
    }
    
    return c.json({ error: 'Registration failed', message: 'An unexpected error occurred' }, 500);
  }
});

// Verify token endpoint
auth.post('/verify', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return c.json({ error: 'Token required', message: 'No token provided' }, 400);
    }

    const payload = await AuthService.verifyToken(token);
    const db = new Database(c.env.DB);

    // Load user and tenant data
    const user = await db.findById<User>('users', payload.user_id, payload.tenant_id);
    const tenant = await db.findById<PlatformTenant>('platform_tenants', payload.tenant_id);

    if (!user || !tenant) {
      return c.json({ error: 'Invalid token', message: 'User or HOA not found' }, 401);
    }

    if (user.status !== 'active' || tenant.status !== 'active') {
      return c.json({ error: 'Account suspended', message: 'Account or HOA has been suspended' }, 403);
    }

    // Return user and tenant info (exclude password hash)
    const { password_hash, ...safeUser } = user;
    
    return c.json({
      success: true,
      user: safeUser,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        subscription_plan: tenant.subscription_plan
      },
      expires_at: new Date(payload.exp * 1000).toISOString()
    });

  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error instanceof AuthError) {
      return c.json({ error: 'Invalid token', message: error.message }, 401);
    }
    
    return c.json({ error: 'Token verification failed', message: 'Unable to verify token' }, 500);
  }
});

// Refresh token endpoint
auth.post('/refresh', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return c.json({ error: 'Token required', message: 'No token provided' }, 400);
    }

    const payload = await AuthService.verifyToken(token);
    const db = new Database(c.env.DB);

    // Load user data
    const user = await db.findById<User>('users', payload.user_id, payload.tenant_id);
    if (!user || user.status !== 'active') {
      return c.json({ error: 'Invalid token', message: 'User not found or inactive' }, 401);
    }

    // Generate new token
    const newToken = await AuthService.generateToken(user);
    
    return c.json({
      success: true,
      token: newToken,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    
    if (error instanceof AuthError) {
      return c.json({ error: 'Token refresh failed', message: error.message }, 401);
    }
    
    return c.json({ error: 'Token refresh failed', message: 'Unable to refresh token' }, 500);
  }
});

// Logout endpoint (client-side token invalidation)
auth.post('/logout', async (c) => {
  // In a stateless JWT system, logout is typically handled client-side
  // by removing the token. Server-side blacklisting could be implemented
  // using KV store for enhanced security.
  
  return c.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Password reset request endpoint
auth.post('/password-reset-request', async (c) => {
  try {
    const { email, tenant_slug } = await c.req.json();
    
    if (!email) {
      return c.json({ error: 'Validation failed', message: 'Email is required' }, 400);
    }

    const db = new Database(c.env.DB);
    const sanitizedEmail = sanitizeEmail(email);

    // Find user and tenant
    let user: User | null = null;
    
    if (tenant_slug) {
      const tenants = await db.findByField<PlatformTenant>('platform_tenants', 'slug', tenant_slug);
      if (tenants.length > 0) {
        const users = await db.query<User>(
          'SELECT * FROM users WHERE email = ? AND tenant_id = ?',
          [sanitizedEmail, tenants[0].id]
        );
        if (users.length > 0) {
          user = users[0];
        }
      }
    } else {
      const users = await db.findByField<User>('users', 'email', sanitizedEmail);
      if (users.length === 1) {
        user = users[0];
      }
    }

    // Always return success to prevent email enumeration
    // In a real implementation, you would send a password reset email here
    return c.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    });

  } catch (error) {
    console.error('Password reset request error:', error);
    return c.json({ error: 'Request failed', message: 'Unable to process password reset request' }, 500);
  }
});

// Get available tenants for an email (for multi-tenant login)
auth.post('/tenants', async (c) => {
  try {
    const { email } = await c.req.json();
    
    if (!email) {
      return c.json({ error: 'Validation failed', message: 'Email is required' }, 400);
    }

    const db = new Database(c.env.DB);
    const sanitizedEmail = sanitizeEmail(email);

    // Find all tenants associated with this email
    const results = await db.query<any>(
      `SELECT t.id, t.name, t.slug 
       FROM users u 
       JOIN platform_tenants t ON u.tenant_id = t.id 
       WHERE u.email = ? AND u.status = 'active' AND t.status = 'active'`,
      [sanitizedEmail]
    );

    const tenants = results.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug
    }));

    return c.json({
      success: true,
      tenants
    });

  } catch (error) {
    console.error('Get tenants error:', error);
    return c.json({ error: 'Request failed', message: 'Unable to fetch HOA list' }, 500);
  }
});

// Demo accounts endpoint for testing (development/demo purposes)
auth.get('/demo-accounts', async (c) => {
  try {
    const demoAccounts = [
      {
        name: 'Garden Estate Admin',
        email: 'admin.garden@kenyahoa.com',
        password: 'demo123',
        tenant_slug: 'garden-estate',
        hoa_name: 'Garden Estate Homeowners Association',
        role: 'HOA Admin',
        description: 'Full administrative access to Garden Estate'
      },
      {
        name: 'Riverside Towers Admin', 
        email: 'admin.riverside@kenyahoa.com',
        password: 'demo123',
        tenant_slug: 'riverside-towers',
        hoa_name: 'Riverside Towers Residents Association',
        role: 'HOA Admin',
        description: 'Full administrative access to Riverside Towers'
      },
      {
        name: 'Kileleshwa Villas Admin',
        email: 'admin.kileleshwa@kenyahoa.com', 
        password: 'demo123',
        tenant_slug: 'kileleshwa-villas',
        hoa_name: 'Kileleshwa Villas Community',
        role: 'HOA Admin',
        description: 'Full administrative access to Kileleshwa Villas'
      },
      {
        name: 'Mombasa Beach Admin',
        email: 'admin.mombasa@kenyahoa.com',
        password: 'demo123', 
        tenant_slug: 'mombasa-beach',
        hoa_name: 'Mombasa Beach Resort Owners',
        role: 'HOA Admin',
        description: 'Full administrative access to Mombasa Beach'
      },
      {
        name: 'Garden Estate Maintenance',
        email: 'maintenance.garden@kenyahoa.com',
        password: 'demo123',
        tenant_slug: 'garden-estate',
        hoa_name: 'Garden Estate Homeowners Association',
        role: 'Maintenance Manager',
        description: 'Maintenance management for Garden Estate'
      },
      {
        name: 'Riverside Towers Maintenance',
        email: 'maintenance.riverside@kenyahoa.com',
        password: 'demo123',
        tenant_slug: 'riverside-towers',
        hoa_name: 'Riverside Towers Residents Association', 
        role: 'Maintenance Manager',
        description: 'Maintenance management for Riverside Towers'
      },
      {
        name: 'Garden Estate Resident',
        email: 'owner.garden@kenyahoa.com',
        password: 'demo123',
        tenant_slug: 'garden-estate',
        hoa_name: 'Garden Estate Homeowners Association',
        role: 'Property Owner',
        description: 'Property owner in Garden Estate (Unit A-15)'
      },
      {
        name: 'Riverside Towers Resident', 
        email: 'owner.riverside@kenyahoa.com',
        password: 'demo123',
        tenant_slug: 'riverside-towers',
        hoa_name: 'Riverside Towers Residents Association',
        role: 'Property Owner',
        description: 'Property owner in Riverside Towers (Unit 15A)'
      },
      {
        name: 'Platform Super Admin',
        email: 'superadmin@kenyahoa.com',
        password: 'demo123',
        tenant_slug: null,
        hoa_name: 'Platform Administration',
        role: 'Super Admin',
        description: 'Full platform administration access'
      }
    ];
    
    return c.json({
      success: true,
      accounts: demoAccounts,
      total_accounts: demoAccounts.length,
      message: 'Demo accounts available for testing different roles and HOAs'
    });

  } catch (error) {
    console.error('Demo accounts error:', error);
    return c.json({ error: 'Request failed', message: 'Unable to fetch demo accounts' }, 500);
  }
});

export default auth;