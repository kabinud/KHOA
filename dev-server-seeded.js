// KenyaHOA Pro - Development server with seeded data
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Seeded HOA and User Data
const seededData = {
  tenants: {
    'garden-estate': {
      id: 'tenant-001',
      name: 'Garden Estate Homeowners Association',
      slug: 'garden-estate',
      subscription_plan: 'professional',
      location: 'Nairobi, Karen',
      total_properties: 85,
      occupied_properties: 78,
      total_residents: 156,
      monthly_revenue: 425000
    },
    'riverside-towers': {
      id: 'tenant-002', 
      name: 'Riverside Towers Residents Association',
      slug: 'riverside-towers',
      subscription_plan: 'premium',
      location: 'Nairobi, Westlands',
      total_properties: 120,
      occupied_properties: 115,
      total_residents: 287,
      monthly_revenue: 890000
    },
    'kileleshwa-villas': {
      id: 'tenant-003',
      name: 'Kileleshwa Villas Community',
      slug: 'kileleshwa-villas',
      subscription_plan: 'basic',
      location: 'Nairobi, Kileleshwa',
      total_properties: 32,
      occupied_properties: 29,
      total_residents: 67,
      monthly_revenue: 185000
    },
    'mombasa-beach': {
      id: 'tenant-004',
      name: 'Mombasa Beach Resort Owners',
      slug: 'mombasa-beach',
      subscription_plan: 'professional',
      location: 'Mombasa, Nyali',
      total_properties: 64,
      occupied_properties: 58,
      total_residents: 134,
      monthly_revenue: 320000
    }
  },
  
  users: {
    // Garden Estate Users
    'admin.garden@kenyahoa.com': {
      id: 'user-001',
      first_name: 'Sarah',
      last_name: 'Wanjiku',
      email: 'admin.garden@kenyahoa.com',
      role: 'hoa_admin',
      tenant_slug: 'garden-estate',
      unit_number: null
    },
    'manager.garden@kenyahoa.com': {
      id: 'user-002',
      first_name: 'James',
      last_name: 'Mwangi',
      email: 'manager.garden@kenyahoa.com',
      role: 'property_manager',
      tenant_slug: 'garden-estate',
      unit_number: null
    },
    'owner.garden@kenyahoa.com': {
      id: 'user-003',
      first_name: 'Grace',
      last_name: 'Akinyi',
      email: 'owner.garden@kenyahoa.com',
      role: 'resident_owner',
      tenant_slug: 'garden-estate',
      unit_number: 'A-15'
    },
    'tenant.garden@kenyahoa.com': {
      id: 'user-004',
      first_name: 'Peter',
      last_name: 'Kiprotich',
      email: 'tenant.garden@kenyahoa.com',
      role: 'resident_tenant',
      tenant_slug: 'garden-estate',
      unit_number: 'B-22'
    },
    
    // Riverside Towers Users
    'admin.riverside@kenyahoa.com': {
      id: 'user-005',
      first_name: 'Michael',
      last_name: 'Ochieng',
      email: 'admin.riverside@kenyahoa.com',
      role: 'hoa_admin',
      tenant_slug: 'riverside-towers',
      unit_number: null
    },
    'finance.riverside@kenyahoa.com': {
      id: 'user-006',
      first_name: 'Catherine',
      last_name: 'Nduta',
      email: 'finance.riverside@kenyahoa.com',
      role: 'finance_manager',
      tenant_slug: 'riverside-towers',
      unit_number: null
    },
    'owner.riverside@kenyahoa.com': {
      id: 'user-007',
      first_name: 'Robert',
      last_name: 'Kamau',
      email: 'owner.riverside@kenyahoa.com',
      role: 'resident_owner',
      tenant_slug: 'riverside-towers',
      unit_number: '15A'
    },
    
    // Kileleshwa Villas Users
    'admin.kileleshwa@kenyahoa.com': {
      id: 'user-008',
      first_name: 'Mary',
      last_name: 'Njeri',
      email: 'admin.kileleshwa@kenyahoa.com',
      role: 'hoa_admin',
      tenant_slug: 'kileleshwa-villas',
      unit_number: null
    },
    'owner.kileleshwa@kenyahoa.com': {
      id: 'user-009',
      first_name: 'David',
      last_name: 'Mutua',
      email: 'owner.kileleshwa@kenyahoa.com',
      role: 'resident_owner',
      tenant_slug: 'kileleshwa-villas',
      unit_number: 'Villa-7'
    },
    
    // Mombasa Beach Users
    'admin.mombasa@kenyahoa.com': {
      id: 'user-010',
      first_name: 'Fatuma',
      last_name: 'Ali',
      email: 'admin.mombasa@kenyahoa.com',
      role: 'hoa_admin',
      tenant_slug: 'mombasa-beach',
      unit_number: null
    },
    'owner.mombasa@kenyahoa.com': {
      id: 'user-011',
      first_name: 'Ahmed',
      last_name: 'Hassan',
      email: 'owner.mombasa@kenyahoa.com',
      role: 'resident_owner',
      tenant_slug: 'mombasa-beach',
      unit_number: 'Beach-12'
    },
    
    // Demo user (keep for compatibility)
    'demo@example.com': {
      id: 'user-demo',
      first_name: 'Demo',
      last_name: 'User',
      email: 'demo@example.com',
      role: 'hoa_admin',
      tenant_slug: 'garden-estate',
      unit_number: null
    }
  }
};

// Activities by tenant
const tenantActivities = {
  'garden-estate': [
    {
      type: 'payment',
      message: 'Payment received: KES 15,000 for Monthly dues - Unit A-15',
      timestamp: new Date().toISOString(),
      user: 'Grace Akinyi'
    },
    {
      type: 'maintenance',
      message: 'Maintenance completed: Garden irrigation system fixed',
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
      user: 'James Mwangi'
    },
    {
      type: 'announcement',
      message: 'Community meeting scheduled for Saturday 2PM',
      timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
      user: 'Sarah Wanjiku'
    },
    {
      type: 'resident',
      message: 'New resident registered: Peter Kiprotich - Unit B-22',
      timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
      user: 'Sarah Wanjiku'
    }
  ],
  'riverside-towers': [
    {
      type: 'payment',
      message: 'Payment received: KES 25,000 for Monthly dues - Unit 15A',
      timestamp: new Date().toISOString(),
      user: 'Robert Kamau'
    },
    {
      type: 'maintenance',
      message: 'Elevator maintenance scheduled for next week',
      timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
      user: 'Michael Ochieng'
    },
    {
      type: 'document',
      message: 'Annual budget report published',
      timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
      user: 'Catherine Nduta'
    }
  ],
  'kileleshwa-villas': [
    {
      type: 'payment',
      message: 'Payment received: KES 12,000 for Monthly dues - Villa-7',
      timestamp: new Date().toISOString(),
      user: 'David Mutua'
    },
    {
      type: 'maintenance',
      message: 'Security gate repairs completed',
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
      user: 'Mary Njeri'
    }
  ],
  'mombasa-beach': [
    {
      type: 'payment',
      message: 'Payment received: KES 18,000 for Monthly dues - Beach-12',
      timestamp: new Date().toISOString(),
      user: 'Ahmed Hassan'
    },
    {
      type: 'maintenance',
      message: 'Beach cleanup and maintenance completed',
      timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
      user: 'Fatuma Ali'
    },
    {
      type: 'announcement',
      message: 'Beach volleyball tournament this weekend',
      timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
      user: 'Fatuma Ali'
    }
  ]
};

// Simple static file server
const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Handle API routes (mock responses)
  if (req.url.startsWith('/api/')) {
    handleApiRequest(req, res);
    return;
  }
  
  // Handle specific routes
  let filePath;
  
  if (req.url === '/') {
    filePath = path.join(__dirname, 'dist', 'index.html');
  } else if (req.url === '/dashboard' || req.url === '/dashboard/') {
    filePath = path.join(__dirname, 'dist', 'dashboard.html');
  } else if (req.url.startsWith('/static/')) {
    // Serve static files from public directory
    filePath = path.join(__dirname, 'public', req.url);
  } else {
    // Try to serve from dist directory
    filePath = path.join(__dirname, 'dist', req.url);
  }
  
  // If file doesn't exist, default to main page for SPA routing
  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, 'dist', 'index.html');
  }
  
  try {
    const content = fs.readFileSync(filePath);
    const ext = path.extname(filePath);
    const contentType = getContentType(ext);
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (error) {
    res.writeHead(404);
    res.end('Not Found');
  }
});

function handleApiRequest(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  // Handle POST requests (for login)
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const mockResponse = getMockResponse(req.url, req.method, body);
      res.writeHead(mockResponse.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(mockResponse.data));
    });
  } else {
    // Handle GET requests
    const mockResponse = getMockResponse(req.url, req.method);
    res.writeHead(mockResponse.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(mockResponse.data));
  }
}

function getMockResponse(url, method, body = null) {
  // Health check
  if (url === '/api/health') {
    return {
      status: 200,
      data: {
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: 'development',
        database: 'seeded_mock',
        available_hoas: Object.keys(seededData.tenants).length,
        available_users: Object.keys(seededData.users).length
      }
    };
  }
  
  // Login endpoint with seeded data
  if (url === '/api/auth/login' && method === 'POST') {
    try {
      const loginData = JSON.parse(body);
      const email = loginData.email;
      const password = loginData.password; // In real app, would verify password
      
      const user = seededData.users[email];
      if (user) {
        const tenant = seededData.tenants[user.tenant_slug];
        
        return {
          status: 200,
          data: {
            success: true,
            token: 'mock-jwt-token-' + Date.now(),
            user: user,
            tenant: tenant,
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          }
        };
      } else {
        return {
          status: 401,
          data: {
            success: false,
            message: 'Invalid credentials'
          }
        };
      }
    } catch (error) {
      return {
        status: 400,
        data: {
          success: false,
          message: 'Invalid request format'
        }
      };
    }
  }
  
  // List available accounts endpoint
  if (url === '/api/auth/demo-accounts') {
    const accounts = Object.values(seededData.users).map(user => {
      const tenant = seededData.tenants[user.tenant_slug];
      return {
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
        role: user.role,
        hoa_name: tenant.name,
        location: tenant.location,
        unit: user.unit_number
      };
    });
    
    return {
      status: 200,
      data: {
        success: true,
        accounts: accounts
      }
    };
  }
  
  // Dashboard stats - dynamic based on authentication
  if (url === '/api/dashboard/stats') {
    // In a real app, we'd get the user from the JWT token
    // For now, we'll use the most recent login or default to garden-estate
    const tenantSlug = 'garden-estate'; // This would come from token
    const tenant = seededData.tenants[tenantSlug];
    const activities = tenantActivities[tenantSlug] || [];
    
    return {
      status: 200,
      data: {
        total_properties: tenant.total_properties,
        occupied_properties: tenant.occupied_properties,
        total_residents: tenant.total_residents,
        pending_maintenance: Math.floor(Math.random() * 15) + 3,
        overdue_payments: Math.floor(Math.random() * 8) + 1,
        monthly_revenue: tenant.monthly_revenue,
        recent_activities: activities
      }
    };
  }
  
  // Default mock response
  return {
    status: 200,
    data: {
      success: true,
      message: 'Mock API response',
      data: []
    }
  };
}

function getContentType(ext) {
  const types = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml',
  };
  return types[ext] || 'text/plain';
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 KenyaHOA Pro development server with seeded data running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🏠 Dashboard: http://localhost:${PORT}/dashboard`);
  console.log(`👥 Demo accounts: http://localhost:${PORT}/api/auth/demo-accounts`);
  console.log('');
  console.log('🏘️ Available HOAs:');
  Object.values(seededData.tenants).forEach(tenant => {
    console.log(`   - ${tenant.name} (${tenant.location})`);
  });
  console.log('');
  console.log('👤 Sample Login Accounts:');
  console.log('   🔑 Garden Estate Admin: admin.garden@kenyahoa.com / password123');
  console.log('   🔑 Riverside Admin: admin.riverside@kenyahoa.com / password123');
  console.log('   🔑 Property Owner: owner.garden@kenyahoa.com / password123');
  console.log('   🔑 Demo Account: demo@example.com / demo123');
  console.log('');
  console.log('📝 API endpoints:');
  console.log('   - POST /api/auth/login');
  console.log('   - GET  /api/auth/demo-accounts');
  console.log('   - GET  /api/dashboard/stats');
  console.log('   - GET  /api/health');
});