// Validation utilities for KenyaHOA Pro
import { z } from 'zod';
import type { UserRole } from '../types';

// Custom validation functions
export function isValidKenyanPhone(phone: string): boolean {
  const phoneRegex = /^(\+254|254|0)[17]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function isValidKenyanPostalCode(code: string): boolean {
  const postalCodeRegex = /^\d{5}$/;
  return postalCodeRegex.test(code);
}

// Zod schemas for API validation
export const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  tenant_slug: z.string().optional()
});

export const RegisterSchema = z.object({
  tenant_slug: z.string().min(1, 'Tenant slug is required'),
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  first_name: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  last_name: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  phone: z.string().refine(isValidKenyanPhone, 'Invalid Kenyan phone number format').optional(),
  property_unit: z.string().max(20, 'Property unit too long').optional()
});

export const UserCreateSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  first_name: z.string().min(1, 'First name is required').max(50),
  last_name: z.string().min(1, 'Last name is required').max(50),
  phone: z.string().refine(isValidKenyanPhone, 'Invalid phone number').optional(),
  role: z.enum([
    'hoa_admin', 'board_president', 'board_member', 'property_manager',
    'financial_officer', 'maintenance_supervisor', 'security_coordinator',
    'resident_owner', 'resident_tenant', 'committee_member',
    'vendor', 'security_guard', 'guest'
  ] as const),
  status: z.enum(['active', 'inactive', 'suspended']).default('active')
});

export const UserUpdateSchema = UserCreateSchema.partial().omit({ password: true });

export const PropertyCreateSchema = z.object({
  unit_number: z.string().min(1, 'Unit number is required').max(20),
  property_type: z.enum(['apartment', 'townhouse', 'standalone']),
  bedrooms: z.number().int().min(0).max(20).optional(),
  bathrooms: z.number().int().min(0).max(20).optional(),
  square_footage: z.number().positive().optional(),
  floor_number: z.number().int().min(0).max(100).optional(),
  building_section: z.string().max(50).optional(),
  parking_spaces: z.number().int().min(0).max(10).default(0),
  balcony: z.boolean().default(false),
  garden: z.boolean().default(false),
  status: z.enum(['occupied', 'vacant', 'maintenance']).default('vacant'),
  monthly_dues: z.number().min(0, 'Monthly dues cannot be negative')
});

export const PropertyUpdateSchema = PropertyCreateSchema.partial();

export const ResidentCreateSchema = z.object({
  user_id: z.string().uuid('Invalid user ID'),
  property_id: z.string().uuid('Invalid property ID'),
  relationship_type: z.enum(['owner', 'tenant', 'family_member']),
  move_in_date: z.string().date().optional(),
  emergency_contact_name: z.string().max(100).optional(),
  emergency_contact_phone: z.string().refine(isValidKenyanPhone, 'Invalid phone number').optional(),
  emergency_contact_relationship: z.string().max(50).optional(),
  vehicle_info: z.string().optional(), // JSON string validation handled in business logic
  status: z.enum(['active', 'moved_out', 'suspended']).default('active')
});

export const ResidentUpdateSchema = ResidentCreateSchema.partial().omit({ user_id: true, property_id: true });

export const MaintenanceRequestCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required').max(2000),
  category: z.enum(['plumbing', 'electrical', 'hvac', 'general', 'emergency']),
  priority: z.enum(['low', 'medium', 'high', 'emergency']),
  location: z.string().max(200).optional(),
  photos: z.array(z.string().url()).max(10, 'Maximum 10 photos allowed').optional()
});

export const MaintenanceRequestUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(2000).optional(),
  category: z.enum(['plumbing', 'electrical', 'hvac', 'general', 'emergency']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'emergency']).optional(),
  location: z.string().max(200).optional(),
  photos: z.array(z.string().url()).max(10).optional(),
  estimated_cost: z.number().min(0).optional(),
  actual_cost: z.number().min(0).optional(),
  vendor_id: z.string().uuid().optional(),
  assigned_to: z.string().uuid().optional(),
  status: z.enum(['submitted', 'acknowledged', 'in_progress', 'completed', 'canceled']).optional(),
  resident_rating: z.number().int().min(1).max(5).optional(),
  resident_feedback: z.string().max(1000).optional()
});

export const FinancialTransactionCreateSchema = z.object({
  transaction_type: z.enum(['dues', 'fee', 'fine', 'refund', 'expense', 'assessment']),
  category: z.string().min(1, 'Category is required').max(100),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be 3 characters').default('KES'),
  description: z.string().max(500).optional(),
  due_date: z.string().date().optional(),
  payment_method: z.enum(['mpesa', 'airtel_money', 'bank_transfer', 'cash', 'card']).optional(),
  payment_reference: z.string().max(100).optional(),
  status: z.enum(['pending', 'paid', 'overdue', 'canceled']).default('pending'),
  property_ids: z.array(z.string().uuid()).optional(),
  resident_ids: z.array(z.string().uuid()).optional()
});

export const FinancialTransactionUpdateSchema = z.object({
  payment_date: z.string().date().optional(),
  payment_method: z.enum(['mpesa', 'airtel_money', 'bank_transfer', 'cash', 'card']).optional(),
  payment_reference: z.string().max(100).optional(),
  status: z.enum(['pending', 'paid', 'overdue', 'canceled']).optional()
});

export const VendorCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  category: z.enum(['plumbing', 'electrical', 'security', 'cleaning', 'landscaping', 'hvac', 'general']),
  contact_person: z.string().max(100).optional(),
  phone: z.string().refine(isValidKenyanPhone, 'Invalid phone number'),
  email: z.string().email().optional(),
  address: z.string().max(500).optional(),
  license_number: z.string().max(100).optional(),
  insurance_valid_until: z.string().date().optional(),
  status: z.enum(['active', 'inactive', 'blocked']).default('active')
});

export const VendorUpdateSchema = VendorCreateSchema.partial();

export const AnnouncementCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().min(1, 'Content is required').max(5000),
  category: z.enum(['general', 'maintenance', 'financial', 'emergency', 'event']),
  priority: z.enum(['low', 'normal', 'high', 'urgent']),
  target_audience: z.enum(['all', 'owners', 'tenants', 'board_members']),
  expires_at: z.string().date().optional(),
  attachments: z.array(z.string().url()).max(5, 'Maximum 5 attachments allowed').optional()
});

export const AnnouncementUpdateSchema = AnnouncementCreateSchema.partial();

export const DocumentCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  category: z.enum(['bylaws', 'minutes', 'policies', 'forms', 'contracts']),
  file_path: z.string().min(1, 'File path is required'),
  file_size: z.number().int().min(0).optional(),
  file_type: z.string().max(100).optional(),
  access_level: z.enum(['public', 'residents', 'board_only', 'admin_only']),
  version: z.string().max(20).default('1.0')
});

export const DocumentUpdateSchema = DocumentCreateSchema.partial().omit({ file_path: true });

export const ViolationCreateSchema = z.object({
  property_id: z.string().uuid('Invalid property ID'),
  resident_id: z.string().uuid('Invalid resident ID'),
  violation_type: z.enum(['noise', 'parking', 'pet', 'architectural', 'other']),
  description: z.string().min(1, 'Description is required').max(2000),
  photos: z.array(z.string().url()).max(10, 'Maximum 10 photos allowed').optional(),
  fine_amount: z.number().min(0).optional(),
  due_date: z.string().date().optional()
});

export const ViolationUpdateSchema = z.object({
  status: z.enum(['reported', 'notice_sent', 'resolved', 'appealed']).optional(),
  resolution_notes: z.string().max(2000).optional()
});

export const VoteCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional(),
  options: z.array(z.string().min(1).max(200)).min(2, 'At least 2 options required').max(10, 'Maximum 10 options allowed'),
  voting_type: z.enum(['simple', 'multiple_choice', 'ranked']),
  eligible_voters: z.array(z.string()).min(1, 'At least one voter type required'),
  start_date: z.string().datetime('Invalid start date format'),
  end_date: z.string().datetime('Invalid end date format')
});

export const VoteUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  status: z.enum(['draft', 'active', 'completed', 'canceled']).optional()
});

export const VoteCastSchema = z.object({
  choice: z.string().min(1, 'Choice is required')
});

export const AmenityBookingCreateSchema = z.object({
  amenity_name: z.string().min(1, 'Amenity name is required').max(100),
  booking_date: z.string().date('Invalid date format'),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  guests_count: z.number().int().min(0).max(100).default(0),
  purpose: z.string().max(200).optional(),
  special_requirements: z.string().max(500).optional(),
  booking_fee: z.number().min(0).default(0)
});

export const AmenityBookingUpdateSchema = z.object({
  booking_date: z.string().date().optional(),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  guests_count: z.number().int().min(0).max(100).optional(),
  purpose: z.string().max(200).optional(),
  special_requirements: z.string().max(500).optional(),
  status: z.enum(['pending', 'confirmed', 'completed', 'canceled']).optional()
});

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort_by: z.string().max(50).optional(),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().max(100).optional()
});

export const TenantCreateSchema = z.object({
  name: z.string().min(1, 'HOA name is required').max(200),
  slug: z.string()
    .min(3, 'Slug must be at least 3 characters')
    .max(50, 'Slug too long')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  billing_email: z.string().email('Invalid billing email'),
  subscription_plan: z.enum(['starter', 'professional', 'enterprise']),
  address: z.string().max(500).optional(),
  city: z.string().max(100).default('Nairobi'),
  postal_code: z.string().refine(isValidKenyanPostalCode, 'Invalid postal code').optional(),
  total_units: z.number().int().min(1, 'Must have at least 1 unit'),
  established_date: z.string().date().optional(),
  registration_number: z.string().max(100).optional()
});

export const TenantUpdateSchema = TenantCreateSchema.partial().omit({ slug: true });

// M-Pesa validation schemas
export const MpesaSTKPushSchema = z.object({
  phone_number: z.string().refine(isValidKenyanPhone, 'Invalid Kenyan phone number'),
  amount: z.number().positive('Amount must be positive').max(999999, 'Amount too large'),
  account_reference: z.string().min(1, 'Account reference is required').max(50),
  transaction_desc: z.string().min(1, 'Transaction description is required').max(100)
});

export const MpesaCallbackSchema = z.object({
  checkout_request_id: z.string().min(1),
  result_code: z.number().int(),
  result_desc: z.string(),
  amount: z.number().positive().optional(),
  mpesa_receipt_number: z.string().optional(),
  transaction_date: z.string().optional(),
  phone_number: z.string().optional()
});

// Validation helper functions
export function validateAndSanitize<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return { success: false, errors };
    }
    return { success: false, errors: ['Validation failed'] };
  }
}

export function sanitizeString(str: string): string {
  return str.trim().replace(/\s+/g, ' ');
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function sanitizePhone(phone: string): string {
  return phone.replace(/\s/g, '');
}