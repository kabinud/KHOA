-- Demo seed data for KenyaHOA Pro - matches demo accounts API

-- Insert demo tenants that match the demo accounts API
INSERT OR IGNORE INTO platform_tenants (id, name, slug, domain, status, subscription_plan, billing_email) VALUES 
  ('tenant-garden', 'Garden Estate Homeowners Association', 'garden-estate', 'garden-estate.kenyahoapro.com', 'active', 'professional', 'admin.garden@kenyahoa.com'),
  ('tenant-riverside', 'Riverside Towers Residents Association', 'riverside-towers', 'riverside-towers.kenyahoapro.com', 'active', 'professional', 'admin.riverside@kenyahoa.com'),
  ('tenant-kileleshwa', 'Kileleshwa Villas Community', 'kileleshwa-villas', 'kileleshwa-villas.kenyahoapro.com', 'active', 'starter', 'admin.kileleshwa@kenyahoa.com'),
  ('tenant-mombasa', 'Mombasa Beach Resort Owners', 'mombasa-beach', 'mombasa-beach.kenyahoapro.com', 'active', 'starter', 'admin.mombasa@kenyahoa.com');

-- Insert demo HOAs
INSERT OR IGNORE INTO hoas (id, tenant_id, name, address, city, postal_code, total_units, established_date, registration_number) VALUES 
  ('hoa-garden', 'tenant-garden', 'Garden Estate Homeowners Association', 'Karen Road, Nairobi', 'Nairobi', '00502', 85, '2018-03-15', 'HOA/2018/001'),
  ('hoa-riverside', 'tenant-riverside', 'Riverside Towers Residents Association', 'Westlands, Nairobi', 'Nairobi', '00100', 120, '2019-07-10', 'HOA/2019/045'),
  ('hoa-kileleshwa', 'tenant-kileleshwa', 'Kileleshwa Villas Community', 'Kileleshwa Road, Nairobi', 'Nairobi', '00800', 32, '2020-12-01', 'HOA/2020/078'),
  ('hoa-mombasa', 'tenant-mombasa', 'Mombasa Beach Resort Owners', 'Nyali Beach, Mombasa', 'Mombasa', '80100', 64, '2017-05-15', 'HOA/2017/025');

-- Insert demo users that match the demo accounts API
-- Password hash for 'demo123' using bcrypt
INSERT OR IGNORE INTO users (id, tenant_id, email, phone, password_hash, first_name, last_name, role, email_verified, phone_verified) VALUES 
  -- Garden Estate users
  ('user-garden-admin', 'tenant-garden', 'admin.garden@kenyahoa.com', '+254701234567', '$2b$10$rZ3P7t5PK5BQfzJ4xMuaOuKOBKL8G7v5ZqhgH8qGcyT2nF9hJ8sX2', 'Sarah', 'Kimani', 'hoa_admin', TRUE, TRUE),
  ('user-garden-maint', 'tenant-garden', 'maintenance.garden@kenyahoa.com', '+254702345678', '$2b$10$rZ3P7t5PK5BQfzJ4xMuaOuKOBKL8G7v5ZqhgH8qGcyT2nF9hJ8sX2', 'John', 'Mwangi', 'maintenance_supervisor', TRUE, TRUE),
  ('user-garden-owner', 'tenant-garden', 'owner.garden@kenyahoa.com', '+254703456789', '$2b$10$rZ3P7t5PK5BQfzJ4xMuaOuKOBKL8G7v5ZqhgH8qGcyT2nF9hJ8sX2', 'Mary', 'Njeri', 'resident_owner', TRUE, TRUE),
  
  -- Riverside Towers users
  ('user-riverside-admin', 'tenant-riverside', 'admin.riverside@kenyahoa.com', '+254704567890', '$2b$10$rZ3P7t5PK5BQfzJ4xMuaOuKOBKL8G7v5ZqhgH8qGcyT2nF9hJ8sX2', 'Grace', 'Wanjiku', 'hoa_admin', TRUE, TRUE),
  ('user-riverside-maint', 'tenant-riverside', 'maintenance.riverside@kenyahoa.com', '+254705678901', '$2b$10$rZ3P7t5PK5BQfzJ4xMuaOuKOBKL8G7v5ZqhgH8qGcyT2nF9hJ8sX2', 'Peter', 'Ochieng', 'maintenance_supervisor', TRUE, TRUE),
  ('user-riverside-owner', 'tenant-riverside', 'owner.riverside@kenyahoa.com', '+254706789012', '$2b$10$rZ3P7t5PK5BQfzJ4xMuaOuKOBKL8G7v5ZqhgH8qGcyT2nF9hJ8sX2', 'David', 'Kiprop', 'resident_owner', TRUE, TRUE),
  
  -- Kileleshwa Villas users
  ('user-kileleshwa-admin', 'tenant-kileleshwa', 'admin.kileleshwa@kenyahoa.com', '+254707890123', '$2b$10$rZ3P7t5PK5BQfzJ4xMuaOuKOBKL8G7v5ZqhgH8qGcyT2nF9hJ8sX2', 'James', 'Mutua', 'hoa_admin', TRUE, TRUE),
  
  -- Mombasa Beach users
  ('user-mombasa-admin', 'tenant-mombasa', 'admin.mombasa@kenyahoa.com', '+254708901234', '$2b$10$rZ3P7t5PK5BQfzJ4xMuaOuKOBKL8G7v5ZqhgH8qGcyT2nF9hJ8sX2', 'Alice', 'Nyong', 'hoa_admin', TRUE, TRUE),
  
  -- Super admin (no tenant)
  ('user-super-admin', NULL, 'superadmin@kenyahoa.com', '+254709012345', '$2b$10$rZ3P7t5PK5BQfzJ4xMuaOuKOBKL8G7v5ZqhgH8qGcyT2nF9hJ8sX2', 'System', 'Admin', 'super_admin', TRUE, TRUE);

-- Insert some sample properties for demo purposes
INSERT OR IGNORE INTO properties (id, tenant_id, unit_number, property_type, bedrooms, bathrooms, square_footage) VALUES 
  ('prop-garden-1', 'tenant-garden', 'A-15', 'apartment', 3, 2, 1200.00),
  ('prop-riverside-1', 'tenant-riverside', '15A', 'apartment', 2, 2, 1000.00);

-- Insert demo subscriptions
INSERT OR IGNORE INTO platform_subscriptions (id, tenant_id, plan_type, units_count, monthly_fee, billing_cycle, next_billing_date, status) VALUES 
  ('sub-garden', 'tenant-garden', 'professional', 85, 8500.00, 'monthly', '2025-09-17', 'active'),
  ('sub-riverside', 'tenant-riverside', 'professional', 120, 12000.00, 'monthly', '2025-09-17', 'active'),
  ('sub-kileleshwa', 'tenant-kileleshwa', 'starter', 32, 3200.00, 'monthly', '2025-09-17', 'active'),
  ('sub-mombasa', 'tenant-mombasa', 'starter', 64, 6400.00, 'monthly', '2025-09-17', 'active');