// Simple development server for KenyaHOA Pro
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  
  // Mock API responses
  const mockResponse = getMockResponse(req.url, req.method);
  
  res.writeHead(mockResponse.status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(mockResponse.data));
}

function getMockResponse(url, method) {
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
        database: 'mock'
      }
    };
  }
  
  // Auth endpoints
  if (url === '/api/auth/login' && method === 'POST') {
    return {
      status: 200,
      data: {
        success: true,
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: 'user-001',
          first_name: 'Demo',
          last_name: 'User',
          email: 'demo@example.com',
          role: 'hoa_admin'
        },
        tenant: {
          id: 'tenant-001',
          name: 'Demo HOA',
          slug: 'demo-hoa',
          subscription_plan: 'professional'
        },
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }
    };
  }
  
  // Dashboard stats
  if (url === '/api/dashboard/stats') {
    return {
      status: 200,
      data: {
        total_properties: 45,
        occupied_properties: 42,
        total_residents: 87,
        pending_maintenance: 8,
        overdue_payments: 3,
        monthly_revenue: 156000,
        recent_activities: [
          {
            type: 'payment',
            message: 'Payment received: KES 12,000 for Monthly dues - Unit A101',
            timestamp: new Date().toISOString(),
            user: 'Mary Njeri'
          },
          {
            type: 'maintenance',
            message: 'New maintenance request: Kitchen Sink Leak',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            user: 'David Kiprop'
          }
        ]
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
  console.log(`🚀 KenyaHOA Pro development server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🏠 Dashboard: http://localhost:${PORT}/dashboard`);
  console.log('');
  console.log('📝 Available mock API endpoints:');
  console.log('   - POST /api/auth/login');
  console.log('   - GET  /api/dashboard/stats');
  console.log('   - GET  /api/health');
});