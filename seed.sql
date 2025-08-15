-- KenyaHOA Pro - Sample Data for Development and Testing

-- Sample platform tenant (HOA)
INSERT OR IGNORE INTO platform_tenants (id, name, slug, domain, status, subscription_plan, billing_email) VALUES 
  ('tenant-001', 'Westlands Garden Estate', 'westlands-garden', 'westlands.kenyahoapro.com', 'active', 'professional', 'admin@westlandsgardens.co.ke'),
  ('tenant-002', 'Karen Ridge Apartments', 'karen-ridge', 'karen.kenyahoapro.com', 'active', 'starter', 'manager@karenridge.co.ke'),
  ('tenant-003', 'Nairobi Heights Premium', 'nairobi-heights', 'heights.kenyahoapro.com', 'active', 'enterprise', 'board@nairobiheights.co.ke');

-- Sample subscriptions
INSERT OR IGNORE INTO platform_subscriptions (id, tenant_id, plan_type, units_count, monthly_fee, billing_cycle, next_billing_date, status) VALUES 
  ('sub-001', 'tenant-001', 'professional', 60, 7200.00, 'monthly', '2025-09-15', 'active'),
  ('sub-002', 'tenant-002', 'starter', 25, 3750.00, 'monthly', '2025-09-20', 'active'),
  ('sub-003', 'tenant-003', 'enterprise', 150, 15000.00, 'annual', '2026-01-15', 'active');

-- Sample HOA information
INSERT OR IGNORE INTO hoas (id, tenant_id, name, address, city, postal_code, total_units, established_date, registration_number) VALUES 
  ('hoa-001', 'tenant-001', 'Westlands Garden Estate', 'Waiyaki Way, Westlands', 'Nairobi', '00100', 60, '2018-03-15', 'HOA/2018/001'),
  ('hoa-002', 'tenant-002', 'Karen Ridge Apartments', 'Karen Road, Karen', 'Nairobi', '00502', 25, '2020-07-10', 'HOA/2020/045'),
  ('hoa-003', 'tenant-003', 'Nairobi Heights Premium', 'Kileleshwa Road', 'Nairobi', '00800', 150, '2015-12-01', 'HOA/2015/078');

-- Sample users with different roles
INSERT OR IGNORE INTO users (id, tenant_id, email, phone, password_hash, first_name, last_name, role, email_verified, phone_verified) VALUES 
  -- Westlands Garden Estate Users
  ('user-001', 'tenant-001', 'admin@westlandsgardens.co.ke', '+254701234567', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'Sarah', 'Kimani', 'hoa_admin', TRUE, TRUE),
  ('user-002', 'tenant-001', 'board@westlandsgardens.co.ke', '+254702345678', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'John', 'Mwangi', 'board_president', TRUE, TRUE),
  ('user-003', 'tenant-001', 'finance@westlandsgardens.co.ke', '+254703456789', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'Grace', 'Wanjiku', 'financial_officer', TRUE, TRUE),
  ('user-004', 'tenant-001', 'maintenance@westlandsgardens.co.ke', '+254704567890', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'Peter', 'Ochieng', 'maintenance_supervisor', TRUE, TRUE),
  ('user-005', 'tenant-001', 'resident1@example.com', '+254705678901', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'Mary', 'Njeri', 'resident_owner', TRUE, TRUE),
  ('user-006', 'tenant-001', 'resident2@example.com', '+254706789012', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'David', 'Kiprop', 'resident_owner', TRUE, TRUE),
  
  -- Karen Ridge Apartments Users
  ('user-007', 'tenant-002', 'manager@karenridge.co.ke', '+254707890123', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'Jane', 'Muthoni', 'hoa_admin', TRUE, TRUE),
  ('user-008', 'tenant-002', 'resident3@example.com', '+254708901234', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'James', 'Karanja', 'resident_owner', TRUE, TRUE),
  
  -- Nairobi Heights Premium Users
  ('user-009', 'tenant-003', 'board@nairobiheights.co.ke', '+254709012345', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'Elizabeth', 'Wambui', 'board_president', TRUE, TRUE),
  ('user-010', 'tenant-003', 'resident4@example.com', '+254710123456', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'Michael', 'Otieno', 'resident_owner', TRUE, FALSE);

-- Sample properties
INSERT OR IGNORE INTO properties (id, tenant_id, unit_number, property_type, bedrooms, bathrooms, square_footage, floor_number, monthly_dues) VALUES 
  -- Westlands Garden Estate Properties
  ('prop-001', 'tenant-001', 'A101', 'apartment', 2, 2, 850.50, 1, 8500.00),
  ('prop-002', 'tenant-001', 'A102', 'apartment', 2, 2, 850.50, 1, 8500.00),
  ('prop-003', 'tenant-001', 'A201', 'apartment', 3, 2, 1200.75, 2, 12000.00),
  ('prop-004', 'tenant-001', 'B101', 'apartment', 2, 2, 900.00, 1, 9000.00),
  ('prop-005', 'tenant-001', 'C301', 'apartment', 4, 3, 1500.25, 3, 15000.00),
  
  -- Karen Ridge Apartments Properties
  ('prop-006', 'tenant-002', '1A', 'townhouse', 3, 3, 1400.00, 0, 11000.00),
  ('prop-007', 'tenant-002', '1B', 'townhouse', 3, 3, 1400.00, 0, 11000.00),
  ('prop-008', 'tenant-002', '2A', 'townhouse', 4, 4, 1800.50, 0, 14000.00),
  
  -- Nairobi Heights Premium Properties
  ('prop-009', 'tenant-003', 'PH-01', 'apartment', 4, 4, 2200.00, 25, 25000.00),
  ('prop-010', 'tenant-003', 'T-101', 'apartment', 2, 2, 1100.00, 1, 18000.00);

-- Sample residents
INSERT OR IGNORE INTO residents (id, tenant_id, user_id, property_id, relationship_type, move_in_date, emergency_contact_name, emergency_contact_phone, vehicle_info) VALUES 
  ('res-001', 'tenant-001', 'user-005', 'prop-001', 'owner', '2021-06-15', 'Paul Njeri', '+254711223344', '[{"plate": "KCA 123A", "make": "Toyota", "model": "Camry"}]'),
  ('res-002', 'tenant-001', 'user-006', 'prop-003', 'owner', '2020-01-10', 'Susan Kiprop', '+254722334455', '[{"plate": "KBA 456B", "make": "Nissan", "model": "X-Trail"}]'),
  ('res-003', 'tenant-002', 'user-008', 'prop-006', 'owner', '2022-03-20', 'Alice Karanja', '+254733445566', '[{"plate": "KCC 789C", "make": "Honda", "model": "CRV"}]'),
  ('res-004', 'tenant-003', 'user-010', 'prop-009', 'owner', '2023-01-05', 'Grace Otieno', '+254744556677', '[{"plate": "KDA 012D", "make": "Mercedes", "model": "C-Class"}]');

-- Sample financial transactions
INSERT OR IGNORE INTO financial_transactions (id, tenant_id, property_id, resident_id, transaction_type, category, amount, description, due_date, payment_date, payment_method, payment_reference, status, created_by) VALUES 
  ('trans-001', 'tenant-001', 'prop-001', 'res-001', 'dues', 'monthly_dues', 8500.00, 'Monthly dues - August 2025', '2025-08-01', '2025-07-30', 'mpesa', 'PH75G9K2L1', 'paid', 'user-001'),
  ('trans-002', 'tenant-001', 'prop-001', 'res-001', 'dues', 'monthly_dues', 8500.00, 'Monthly dues - September 2025', '2025-09-01', NULL, NULL, NULL, 'pending', 'user-001'),
  ('trans-003', 'tenant-001', 'prop-003', 'res-002', 'dues', 'monthly_dues', 12000.00, 'Monthly dues - August 2025', '2025-08-01', '2025-08-02', 'mpesa', 'PH75G9K2L2', 'paid', 'user-001'),
  ('trans-004', 'tenant-002', 'prop-006', 'res-003', 'assessment', 'maintenance', 5000.00, 'Special assessment - Roof repairs', '2025-08-15', NULL, NULL, NULL, 'pending', 'user-007'),
  ('trans-005', 'tenant-003', 'prop-009', 'res-004', 'dues', 'monthly_dues', 25000.00, 'Monthly dues - August 2025', '2025-08-01', '2025-07-28', 'bank_transfer', 'BT123456789', 'paid', 'user-009');

-- Sample maintenance requests
INSERT OR IGNORE INTO maintenance_requests (id, tenant_id, property_id, resident_id, title, description, category, priority, status, estimated_cost, submitted_at, created_at) VALUES 
  ('maint-001', 'tenant-001', 'prop-001', 'res-001', 'Kitchen Sink Leak', 'Water is dripping from the kitchen sink tap continuously', 'plumbing', 'medium', 'acknowledged', 2500.00, '2025-08-10 09:30:00', '2025-08-10 09:30:00'),
  ('maint-002', 'tenant-001', 'prop-003', 'res-002', 'Air Conditioner Not Working', 'AC unit in master bedroom stopped cooling', 'hvac', 'high', 'in_progress', 8000.00, '2025-08-12 14:15:00', '2025-08-12 14:15:00'),
  ('maint-003', 'tenant-002', 'prop-006', 'res-003', 'Broken Gate Lock', 'Main entrance gate lock is jammed', 'general', 'high', 'submitted', 1500.00, '2025-08-14 08:45:00', '2025-08-14 08:45:00'),
  ('maint-004', 'tenant-003', 'prop-009', 'res-004', 'Elevator Button Malfunction', 'Button for floor 25 not responding', 'electrical', 'medium', 'completed', 3500.00, '2025-08-08 16:20:00', '2025-08-08 16:20:00');

-- Sample vendors
INSERT OR IGNORE INTO vendors (id, tenant_id, name, category, contact_person, phone, email, rating, total_jobs, status) VALUES 
  ('vendor-001', 'tenant-001', 'Nairobi Plumbing Solutions', 'plumbing', 'Joseph Maina', '+254720111222', 'info@nairobiplumbing.co.ke', 4.5, 15, 'active'),
  ('vendor-002', 'tenant-001', 'CoolAir HVAC Services', 'hvac', 'Susan Akinyi', '+254731222333', 'service@coolair.co.ke', 4.8, 28, 'active'),
  ('vendor-003', 'tenant-002', 'Karen Security Systems', 'security', 'Daniel Kiprotich', '+254742333444', 'support@karensecurity.co.ke', 4.2, 12, 'active'),
  ('vendor-004', 'tenant-003', 'Premium Maintenance Co.', 'electrical', 'Margaret Wanjiru', '+254753444555', 'repairs@premiummaint.co.ke', 4.7, 35, 'active');

-- Sample announcements
INSERT OR IGNORE INTO announcements (id, tenant_id, title, content, category, priority, target_audience, published_at, created_by, created_at) VALUES 
  ('ann-001', 'tenant-001', 'Water Interruption Notice', 'Dear Residents, There will be a planned water interruption on Saturday, August 17th from 8:00 AM to 2:00 PM for maintenance works. Please store adequate water. Thank you for your understanding.', 'maintenance', 'high', 'all', '2025-08-15 10:00:00', 'user-001', '2025-08-15 10:00:00'),
  ('ann-002', 'tenant-001', 'Monthly Board Meeting', 'The monthly board meeting is scheduled for August 25th, 2025 at 6:00 PM in the community hall. All residents are welcome to attend. Agenda items include budget review and new security measures.', 'general', 'normal', 'all', '2025-08-14 15:30:00', 'user-002', '2025-08-14 15:30:00'),
  ('ann-003', 'tenant-002', 'Pool Maintenance Schedule', 'The swimming pool will be closed for cleaning and maintenance every Tuesday from 9:00 AM to 12:00 PM. Please plan your swimming activities accordingly.', 'maintenance', 'normal', 'all', '2025-08-13 12:00:00', 'user-007', '2025-08-13 12:00:00'),
  ('ann-004', 'tenant-003', 'New Visitor Registration Process', 'Starting September 1st, all visitors must register at the main gate and provide valid ID. Residents will receive a unique visitor code via SMS for each approved visitor. This enhances our security measures.', 'general', 'high', 'all', '2025-08-16 09:00:00', 'user-009', '2025-08-16 09:00:00');

-- Sample documents
INSERT OR IGNORE INTO documents (id, tenant_id, name, category, file_path, file_type, access_level, uploaded_by, created_at) VALUES 
  ('doc-001', 'tenant-001', 'HOA Bylaws 2025', 'bylaws', '/documents/westlands-bylaws-2025.pdf', 'application/pdf', 'residents', 'user-001', '2025-01-15 10:00:00'),
  ('doc-002', 'tenant-001', 'Board Meeting Minutes - July 2025', 'minutes', '/documents/board-minutes-july-2025.pdf', 'application/pdf', 'residents', 'user-002', '2025-07-26 11:30:00'),
  ('doc-003', 'tenant-002', 'Swimming Pool Rules', 'policies', '/documents/pool-rules.pdf', 'application/pdf', 'residents', 'user-007', '2025-06-01 14:00:00'),
  ('doc-004', 'tenant-003', 'Architectural Guidelines', 'policies', '/documents/architectural-guidelines.pdf', 'application/pdf', 'residents', 'user-009', '2025-03-10 16:45:00');

-- Sample violations
INSERT OR IGNORE INTO violations (id, tenant_id, property_id, resident_id, violation_type, description, reported_by, fine_amount, due_date, status, created_at) VALUES 
  ('viol-001', 'tenant-001', 'prop-003', 'res-002', 'parking', 'Vehicle parked in visitor parking overnight without authorization', 'user-004', 1500.00, '2025-08-20', 'notice_sent', '2025-08-13 18:30:00'),
  ('viol-002', 'tenant-002', 'prop-006', 'res-003', 'noise', 'Loud music after 10 PM reported by multiple neighbors', 'user-007', 2000.00, '2025-08-25', 'reported', '2025-08-15 22:15:00'),
  ('viol-003', 'tenant-003', 'prop-009', 'res-004', 'architectural', 'Unauthorized balcony modification without board approval', 'user-009', 5000.00, '2025-09-01', 'notice_sent', '2025-08-12 14:20:00');

-- Sample votes
INSERT OR IGNORE INTO votes (id, tenant_id, title, description, options, voting_type, eligible_voters, start_date, end_date, status, created_by, created_at) VALUES 
  ('vote-001', 'tenant-001', 'Gym Equipment Upgrade', 'Should we proceed with upgrading the gym equipment as proposed?', '["Yes - Approve KES 150,000 budget", "No - Maintain current equipment", "Yes - But reduce budget to KES 100,000"]', 'simple', '["resident_owner", "board_member"]', '2025-08-20 00:00:00', '2025-08-27 23:59:59', 'active', 'user-002', '2025-08-16 12:00:00'),
  ('vote-002', 'tenant-002', 'Board Member Election', 'Election for new board treasurer position', '["Candidate A: John Doe", "Candidate B: Jane Smith", "Abstain"]', 'simple', '["resident_owner"]', '2025-09-01 00:00:00', '2025-09-07 23:59:59', 'draft', 'user-007', '2025-08-15 16:30:00');

-- Sample amenity bookings
INSERT OR IGNORE INTO amenity_bookings (id, tenant_id, amenity_name, resident_id, booking_date, start_time, end_time, guests_count, purpose, booking_fee, status, created_at) VALUES 
  ('book-001', 'tenant-001', 'Community Hall', 'res-001', '2025-08-25', '18:00', '22:00', 15, 'Birthday party celebration', 2500.00, 'confirmed', '2025-08-10 14:30:00'),
  ('book-002', 'tenant-001', 'Swimming Pool', 'res-002', '2025-08-20', '16:00', '18:00', 5, 'Family swimming session', 0.00, 'confirmed', '2025-08-12 10:15:00'),
  ('book-003', 'tenant-002', 'BBQ Area', 'res-003', '2025-08-18', '12:00', '16:00', 8, 'Weekend family BBQ', 1000.00, 'confirmed', '2025-08-14 09:45:00'),
  ('book-004', 'tenant-003', 'Conference Room', 'res-004', '2025-08-22', '10:00', '12:00', 3, 'Business meeting', 1500.00, 'pending', '2025-08-16 15:20:00');