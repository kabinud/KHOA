// KenyaHOA Pro - TypeScript Type Definitions

// Cloudflare Workers environment bindings
export interface CloudflareBindings {
  DB: D1Database;
  KV: KVNamespace;
  R2: R2Bucket;
  APP_NAME: string;
  APP_VERSION: string;
  ENVIRONMENT: string;
}

// User roles enum
export enum UserRole {
  // Platform Level
  SUPER_ADMIN = 'super_admin',
  SUPPORT_AGENT = 'support_agent',
  SALES_AGENT = 'sales_agent',
  BILLING_ADMIN = 'billing_admin',
  
  // HOA Level - Management Tier
  HOA_ADMIN = 'hoa_admin',
  BOARD_PRESIDENT = 'board_president',
  BOARD_MEMBER = 'board_member',
  PROPERTY_MANAGER = 'property_manager',
  
  // HOA Level - Operations Tier
  FINANCIAL_OFFICER = 'financial_officer',
  MAINTENANCE_SUPERVISOR = 'maintenance_supervisor',
  SECURITY_COORDINATOR = 'security_coordinator',
  
  // HOA Level - Community Tier
  RESIDENT_OWNER = 'resident_owner',
  RESIDENT_TENANT = 'resident_tenant',
  COMMITTEE_MEMBER = 'committee_member',
  
  // HOA Level - Service Tier
  VENDOR = 'vendor',
  SECURITY_GUARD = 'security_guard',
  GUEST = 'guest'
}

// Subscription plans
export enum SubscriptionPlan {
  STARTER = 'starter',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise'
}

// Database Models
export interface PlatformTenant {
  id: string;
  name: string;  
  slug: string;
  domain?: string;
  status: 'active' | 'suspended' | 'inactive';
  subscription_plan: SubscriptionPlan;
  billing_email: string;
  created_at: string;
  updated_at: string;
}

export interface PlatformSubscription {
  id: string;
  tenant_id: string;
  plan_type: SubscriptionPlan;
  units_count: number;
  monthly_fee: number;
  billing_cycle: 'monthly' | 'quarterly' | 'annual';
  next_billing_date: string;
  status: 'active' | 'past_due' | 'canceled';
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  tenant_id: string;
  email: string;
  phone?: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'suspended';
  email_verified: boolean;
  phone_verified: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface HOA {
  id: string;
  tenant_id: string;
  name: string;
  address?: string;
  city: string;
  postal_code?: string;
  total_units: number;
  established_date?: string;
  registration_number?: string;
  management_company?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  tenant_id: string;
  unit_number: string;
  property_type: 'apartment' | 'townhouse' | 'standalone';
  bedrooms?: number;
  bathrooms?: number;
  square_footage?: number;
  floor_number?: number;
  building_section?: string;
  parking_spaces: number;
  balcony: boolean;
  garden: boolean;
  status: 'occupied' | 'vacant' | 'maintenance';
  monthly_dues: number;
  created_at: string;
  updated_at: string;
}

export interface Resident {
  id: string;
  tenant_id: string;
  user_id: string;
  property_id: string;
  relationship_type: 'owner' | 'tenant' | 'family_member';
  move_in_date?: string;
  move_out_date?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  vehicle_info?: string; // JSON string
  status: 'active' | 'moved_out' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface FinancialTransaction {
  id: string;
  tenant_id: string;
  property_id?: string;
  resident_id?: string;
  transaction_type: 'dues' | 'fee' | 'fine' | 'refund' | 'expense' | 'assessment';
  category: string;
  amount: number;
  currency: string;
  description?: string;
  due_date?: string;
  payment_date?: string;
  payment_method?: 'mpesa' | 'airtel_money' | 'bank_transfer' | 'cash' | 'card';
  payment_reference?: string;
  status: 'pending' | 'paid' | 'overdue' | 'canceled';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceRequest {
  id: string;
  tenant_id: string;
  property_id: string;
  resident_id: string;
  title: string;
  description: string;
  category: 'plumbing' | 'electrical' | 'hvac' | 'general' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'emergency';
  location?: string;
  photos?: string; // JSON array
  estimated_cost?: number;
  actual_cost?: number;
  vendor_id?: string;
  assigned_to?: string;
  status: 'submitted' | 'acknowledged' | 'in_progress' | 'completed' | 'canceled';
  submitted_at: string;
  acknowledged_at?: string;
  started_at?: string;
  completed_at?: string;
  resident_rating?: number;
  resident_feedback?: string;
  created_at: string;
  updated_at: string;
}

export interface Vendor {
  id: string;
  tenant_id: string;
  name: string;
  category: 'plumbing' | 'electrical' | 'security' | 'cleaning' | 'landscaping' | 'hvac' | 'general';
  contact_person?: string;
  phone: string;
  email?: string;
  address?: string;
  license_number?: string;
  insurance_valid_until?: string;
  rating?: number;
  total_jobs: number;
  status: 'active' | 'inactive' | 'blocked';
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  tenant_id: string;
  title: string;
  content: string;
  category: 'general' | 'maintenance' | 'financial' | 'emergency' | 'event';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  target_audience: 'all' | 'owners' | 'tenants' | 'board_members';
  attachments?: string; // JSON array
  published_at?: string;
  expires_at?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  tenant_id: string;
  name: string;
  category: 'bylaws' | 'minutes' | 'policies' | 'forms' | 'contracts';
  file_path: string;
  file_size?: number;
  file_type?: string;
  access_level: 'public' | 'residents' | 'board_only' | 'admin_only';
  version: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

export interface Violation {
  id: string;
  tenant_id: string;
  property_id: string;
  resident_id: string;
  violation_type: 'noise' | 'parking' | 'pet' | 'architectural' | 'other';
  description: string;
  reported_by: string;
  photos?: string; // JSON array
  fine_amount?: number;
  due_date?: string;
  status: 'reported' | 'notice_sent' | 'resolved' | 'appealed';
  resolution_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Vote {
  id: string;
  tenant_id: string;
  title: string;
  description?: string;
  options: string; // JSON array
  voting_type: 'simple' | 'multiple_choice' | 'ranked';
  eligible_voters: string; // JSON array of roles
  start_date: string;
  end_date: string;
  results?: string; // JSON object
  status: 'draft' | 'active' | 'completed' | 'canceled';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface VoteRecord {
  id: string;
  tenant_id: string;
  vote_id: string;
  user_id: string;
  choice: string;
  cast_at: string;
}

export interface AmenityBooking {
  id: string;
  tenant_id: string;
  amenity_name: string;
  resident_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  guests_count: number;
  purpose?: string;
  special_requirements?: string;
  booking_fee: number;
  status: 'pending' | 'confirmed' | 'completed' | 'canceled';
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  tenant_id: string;
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  old_values?: string; // JSON
  new_values?: string; // JSON
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// API Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
  tenant_slug?: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: Omit<User, 'password_hash'>;
  tenant?: PlatformTenant;
  expires_at?: string;
  message?: string;
}

export interface RegisterRequest {
  tenant_slug: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  property_unit?: string;
}

export interface CreateMaintenanceRequest {
  title: string;
  description: string;
  category: MaintenanceRequest['category'];
  priority: MaintenanceRequest['priority'];
  location?: string;
  photos?: string[];
}

export interface CreateFinancialTransaction {
  transaction_type: FinancialTransaction['transaction_type'];
  category: string;
  amount: number;
  description?: string;
  due_date?: string;
  property_ids?: string[]; // For bulk transactions
  resident_ids?: string[]; // For specific residents
}

export interface CreateAnnouncement {
  title: string;
  content: string;
  category: Announcement['category'];
  priority: Announcement['priority'];
  target_audience: Announcement['target_audience'];
  expires_at?: string;
}

export interface DashboardStats {
  total_properties: number;
  occupied_properties: number;
  total_residents: number;
  pending_maintenance: number;
  overdue_payments: number;
  monthly_revenue: number;
  recent_activities: Array<{
    type: string;
    message: string;
    timestamp: string;
    user?: string;
  }>;
}

// M-Pesa Integration Types
export interface MpesaSTKPushRequest {
  phone_number: string;
  amount: number;
  account_reference: string;
  transaction_desc: string;
}

export interface MpesaSTKPushResponse {
  success: boolean;
  checkout_request_id?: string;
  response_code?: string;
  response_description?: string;
  customer_message?: string;
}

export interface MpesaCallbackRequest {
  checkout_request_id: string;
  result_code: number;
  result_desc: string;
  amount?: number;
  mpesa_receipt_number?: string;
  transaction_date?: string;
  phone_number?: string;
}

// Localization Types
export interface LocalizedContent {
  en: string;
  sw?: string; // Swahili
}

export interface AppConfig {
  supported_languages: string[];
  default_language: string;
  currency: string;
  timezone: string;
  date_format: string;
  payment_methods: string[];
}

// Error Types
export interface APIError {
  error: string;
  message: string;
  details?: any;
  code?: string;
}

// Utility Types
export type CreateUserInput = Omit<User, 'id' | 'created_at' | 'updated_at'>;
export type UpdateUserInput = Partial<Omit<User, 'id' | 'tenant_id' | 'created_at' | 'updated_at'>>;

export type CreatePropertyInput = Omit<Property, 'id' | 'created_at' | 'updated_at'>;
export type UpdatePropertyInput = Partial<Omit<Property, 'id' | 'tenant_id' | 'created_at' | 'updated_at'>>;

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// Permission Types
export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  condition?: any;
}

export interface RolePermissions {
  [key: string]: Permission[];
}