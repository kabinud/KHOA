// Setup script to create super admin user
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

async function createSuperAdmin() {
  // Hash the password
  const password = 'demo123'; // Default demo password
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  
  // Create super admin tenant (platform administration)
  const tenantId = 'platform-admin';
  const superAdminId = 'super-admin-001';
  
  const tenantSQL = `INSERT OR IGNORE INTO platform_tenants (id, name, slug, domain, status, subscription_plan, billing_email) VALUES 
    ('${tenantId}', 'Platform Administration', 'platform', null, 'active', 'enterprise', 'admin@kenyahoa.com');`;
  
  const userSQL = `INSERT OR IGNORE INTO users (id, tenant_id, email, phone, password_hash, first_name, last_name, role, status, email_verified, phone_verified, created_at, updated_at) VALUES 
    ('${superAdminId}', '${tenantId}', 'superadmin@kenyahoa.com', '+254700000000', '${passwordHash}', 'Super', 'Admin', 'super_admin', 'active', true, true, datetime('now'), datetime('now'));`;
  
  console.log('-- Super Admin Setup SQL');
  console.log('-- Run these SQL commands to create super admin user:');
  console.log('');
  console.log(tenantSQL);
  console.log('');
  console.log(userSQL);
  console.log('');
  console.log('-- Super Admin Login Credentials:');
  console.log('-- Email: superadmin@kenyahoa.com');
  console.log('-- Password: demo123');
  console.log('-- Tenant: platform (or leave empty for platform access)');
  
  return {
    tenantSQL,
    userSQL,
    email: 'superadmin@kenyahoa.com',
    password: password,
    tenant_slug: 'platform'
  };
}

// Run if called directly  
createSuperAdmin().catch(console.error);

export { createSuperAdmin };