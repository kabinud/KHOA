-- Allow NULL tenant_id for platform users (super admin, support agents, etc.)
-- This enables platform-level users who don't belong to specific HOAs

-- SQLite doesn't support ALTER COLUMN, so we need to recreate the table
-- First, create a backup of existing data
CREATE TABLE users_backup AS SELECT * FROM users;

-- Drop the existing table  
DROP TABLE users;

-- Recreate users table with nullable tenant_id
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  tenant_id TEXT, -- Changed to nullable for platform users
  email TEXT NOT NULL,
  phone TEXT,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'resident_owner',
  status TEXT NOT NULL DEFAULT 'active',
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(tenant_id, email), -- This still works with NULL values
  FOREIGN KEY (tenant_id) REFERENCES platform_tenants(id)
);

-- Restore existing data
INSERT INTO users SELECT * FROM users_backup;

-- Drop backup table
DROP TABLE users_backup;