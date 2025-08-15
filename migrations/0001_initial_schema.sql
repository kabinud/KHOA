-- KenyaHOA Pro - Initial Database Schema
-- Multi-tenant architecture with complete data isolation

-- Platform-level tables (shared across all tenants)
CREATE TABLE IF NOT EXISTS platform_tenants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  domain TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'active', -- active, suspended, inactive
  subscription_plan TEXT NOT NULL DEFAULT 'starter', -- starter, professional, enterprise
  billing_email TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Subscription management
CREATE TABLE IF NOT EXISTS platform_subscriptions (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  plan_type TEXT NOT NULL, -- starter, professional, enterprise
  units_count INTEGER NOT NULL DEFAULT 0,
  monthly_fee DECIMAL(10,2) NOT NULL,
  billing_cycle TEXT NOT NULL DEFAULT 'monthly', -- monthly, quarterly, annual
  next_billing_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- active, past_due, canceled
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES platform_tenants(id)
);

-- User accounts (multi-tenant aware)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'resident_owner', -- Super admin, HOA admin, board member, etc.
  status TEXT NOT NULL DEFAULT 'active', -- active, inactive, suspended
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(tenant_id, email),
  FOREIGN KEY (tenant_id) REFERENCES platform_tenants(id)
);

-- HOA/Estate information
CREATE TABLE IF NOT EXISTS hoas (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT NOT NULL DEFAULT 'Nairobi',
  postal_code TEXT,
  total_units INTEGER NOT NULL DEFAULT 0,
  established_date DATE,
  registration_number TEXT,
  management_company TEXT,
  website TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES platform_tenants(id)
);

-- Property/Unit management
CREATE TABLE IF NOT EXISTS properties (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  unit_number TEXT NOT NULL,
  property_type TEXT NOT NULL DEFAULT 'apartment', -- apartment, townhouse, standalone
  bedrooms INTEGER,
  bathrooms INTEGER,
  square_footage DECIMAL(8,2),
  floor_number INTEGER,
  building_section TEXT,
  parking_spaces INTEGER DEFAULT 0,
  balcony BOOLEAN DEFAULT FALSE,
  garden BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'occupied', -- occupied, vacant, maintenance
  monthly_dues DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(tenant_id, unit_number),
  FOREIGN KEY (tenant_id) REFERENCES platform_tenants(id)
);

-- Residents (property owners and tenants)
CREATE TABLE IF NOT EXISTS residents (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  property_id TEXT NOT NULL,
  relationship_type TEXT NOT NULL DEFAULT 'owner', -- owner, tenant, family_member
  move_in_date DATE,
  move_out_date DATE,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relationship TEXT,
  vehicle_info TEXT, -- JSON: [{plate: "KCA 123A", make: "Toyota", model: "Camry"}]
  status TEXT NOT NULL DEFAULT 'active', -- active, moved_out, suspended
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES platform_tenants(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (property_id) REFERENCES properties(id)
);

-- Financial transactions
CREATE TABLE IF NOT EXISTS financial_transactions (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  property_id TEXT,
  resident_id TEXT,
  transaction_type TEXT NOT NULL, -- dues, fee, fine, refund, expense
  category TEXT NOT NULL, -- monthly_dues, special_assessment, maintenance, utilities
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'KES',
  description TEXT,
  due_date DATE,
  payment_date DATE,
  payment_method TEXT, -- mpesa, airtel_money, bank_transfer, cash, card
  payment_reference TEXT, -- M-Pesa transaction ID, etc.
  status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, overdue, canceled
  created_by TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES platform_tenants(id),
  FOREIGN KEY (property_id) REFERENCES properties(id),
  FOREIGN KEY (resident_id) REFERENCES residents(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Maintenance requests and work orders
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  property_id TEXT NOT NULL,
  resident_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- plumbing, electrical, hvac, general, emergency
  priority TEXT NOT NULL DEFAULT 'medium', -- low, medium, high, emergency
  location TEXT, -- specific location within property
  photos TEXT, -- JSON array of photo URLs
  estimated_cost DECIMAL(10,2),
  actual_cost DECIMAL(10,2),
  vendor_id TEXT,
  assigned_to TEXT,
  status TEXT NOT NULL DEFAULT 'submitted', -- submitted, acknowledged, in_progress, completed, canceled
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  acknowledged_at DATETIME,
  started_at DATETIME,
  completed_at DATETIME,
  resident_rating INTEGER, -- 1-5 stars
  resident_feedback TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES platform_tenants(id),
  FOREIGN KEY (property_id) REFERENCES properties(id),
  FOREIGN KEY (resident_id) REFERENCES residents(id),
  FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- Vendors and service providers
CREATE TABLE IF NOT EXISTS vendors (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- plumbing, electrical, security, cleaning, landscaping
  contact_person TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  license_number TEXT,
  insurance_valid_until DATE,
  rating DECIMAL(3,2), -- Average rating 0.00-5.00
  total_jobs INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active', -- active, inactive, blocked
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES platform_tenants(id)
);

-- Community communications
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general', -- general, maintenance, financial, emergency, event
  priority TEXT NOT NULL DEFAULT 'normal', -- low, normal, high, urgent
  target_audience TEXT NOT NULL DEFAULT 'all', -- all, owners, tenants, board_members
  attachments TEXT, -- JSON array of file URLs
  published_at DATETIME,
  expires_at DATETIME,
  created_by TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES platform_tenants(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Document management
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- bylaws, minutes, policies, forms, contracts
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  access_level TEXT NOT NULL DEFAULT 'residents', -- public, residents, board_only, admin_only
  version TEXT DEFAULT '1.0',
  uploaded_by TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES platform_tenants(id),
  FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- Violations and compliance
CREATE TABLE IF NOT EXISTS violations (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  property_id TEXT NOT NULL,
  resident_id TEXT NOT NULL,
  violation_type TEXT NOT NULL, -- noise, parking, pet, architectural, other
  description TEXT NOT NULL,
  reported_by TEXT NOT NULL,
  photos TEXT, -- JSON array of photo URLs
  fine_amount DECIMAL(10,2),
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'reported', -- reported, notice_sent, resolved, appealed
  resolution_notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES platform_tenants(id),
  FOREIGN KEY (property_id) REFERENCES properties(id),
  FOREIGN KEY (resident_id) REFERENCES residents(id),
  FOREIGN KEY (reported_by) REFERENCES users(id)
);

-- Voting and elections
CREATE TABLE IF NOT EXISTS votes (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  options TEXT NOT NULL, -- JSON array of voting options
  voting_type TEXT NOT NULL DEFAULT 'simple', -- simple, multiple_choice, ranked
  eligible_voters TEXT NOT NULL, -- JSON array of user roles eligible to vote
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  results TEXT, -- JSON object with vote counts
  status TEXT NOT NULL DEFAULT 'draft', -- draft, active, completed, canceled
  created_by TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES platform_tenants(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Individual vote records
CREATE TABLE IF NOT EXISTS vote_records (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  vote_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  choice TEXT NOT NULL, -- The selected option(s)
  cast_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(vote_id, user_id),
  FOREIGN KEY (tenant_id) REFERENCES platform_tenants(id),
  FOREIGN KEY (vote_id) REFERENCES votes(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Amenity bookings (gym, pool, hall, etc.)
CREATE TABLE IF NOT EXISTS amenity_bookings (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  amenity_name TEXT NOT NULL,
  resident_id TEXT NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  guests_count INTEGER DEFAULT 0,
  purpose TEXT,
  special_requirements TEXT,
  booking_fee DECIMAL(10,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, completed, canceled
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES platform_tenants(id),
  FOREIGN KEY (resident_id) REFERENCES residents(id)
);

-- System audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL, -- user, property, transaction, etc.
  entity_id TEXT,
  old_values TEXT, -- JSON
  new_values TEXT, -- JSON
  ip_address TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES platform_tenants(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_tenant_email ON users(tenant_id, email);
CREATE INDEX IF NOT EXISTS idx_users_tenant_role ON users(tenant_id, role);
CREATE INDEX IF NOT EXISTS idx_properties_tenant_unit ON properties(tenant_id, unit_number);
CREATE INDEX IF NOT EXISTS idx_residents_tenant_user ON residents(tenant_id, user_id);
CREATE INDEX IF NOT EXISTS idx_residents_property ON residents(property_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_tenant ON financial_transactions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_property ON financial_transactions(property_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_status ON financial_transactions(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_tenant ON maintenance_requests(tenant_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_property ON maintenance_requests(property_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_status ON maintenance_requests(status);
CREATE INDEX IF NOT EXISTS idx_announcements_tenant ON announcements(tenant_id);
CREATE INDEX IF NOT EXISTS idx_documents_tenant ON documents(tenant_id);
CREATE INDEX IF NOT EXISTS idx_violations_tenant_property ON violations(tenant_id, property_id);
CREATE INDEX IF NOT EXISTS idx_votes_tenant_status ON votes(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_amenity_bookings_tenant_date ON amenity_bookings(tenant_id, booking_date);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_created ON audit_logs(tenant_id, created_at);