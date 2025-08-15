// Authentication and authorization utilities for KenyaHOA Pro
import * as bcrypt from 'bcryptjs';
import { sign, verify } from 'hono/jwt';
import type { User, UserRole, PlatformTenant } from '../types';

export class AuthError extends Error {
  constructor(message: string, public statusCode: number = 401) {
    super(message);
    this.name = 'AuthError';
  }
}

export interface JWTPayload {
  user_id: string;
  tenant_id: string;
  role: UserRole;
  email: string;
  exp: number;
  iat: number;
}

export class AuthService {
  private static readonly JWT_SECRET = 'your-super-secret-jwt-key-change-in-production';
  private static readonly JWT_EXPIRES_IN = 24 * 60 * 60; // 24 hours in seconds

  // Password hashing
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // JWT token operations
  static async generateToken(user: User): Promise<string> {
    const payload: JWTPayload = {
      user_id: user.id,
      tenant_id: user.tenant_id,
      role: user.role,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + this.JWT_EXPIRES_IN,
      iat: Math.floor(Date.now() / 1000)
    };

    return sign(payload, this.JWT_SECRET);
  }

  static async verifyToken(token: string): Promise<JWTPayload> {
    try {
      const payload = await verify(token, this.JWT_SECRET) as JWTPayload;
      
      // Check if token is expired
      if (payload.exp < Math.floor(Date.now() / 1000)) {
        throw new AuthError('Token expired', 401);
      }
      
      return payload;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError('Invalid token', 401);
    }
  }

  // Password validation
  static validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Email validation
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Phone validation (Kenyan format)
  static validateKenyanPhone(phone: string): boolean {
    // Kenyan phone number patterns: +254XXXXXXXXX, 254XXXXXXXXX, 0XXXXXXXXX
    const phoneRegex = /^(\+254|254|0)[17]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  // Normalize phone number to international format
  static normalizeKenyanPhone(phone: string): string {
    const cleaned = phone.replace(/\s/g, '');
    
    if (cleaned.startsWith('+254')) {
      return cleaned;
    } else if (cleaned.startsWith('254')) {
      return '+' + cleaned;
    } else if (cleaned.startsWith('0')) {
      return '+254' + cleaned.substring(1);
    }
    
    return cleaned;
  }
}

// Role-based access control
export class RBACService {
  // Define role hierarchy (higher number = more permissions)
  private static readonly ROLE_HIERARCHY: Record<UserRole, number> = {
    [UserRole.SUPER_ADMIN]: 1000,
    [UserRole.SUPPORT_AGENT]: 900,
    [UserRole.SALES_AGENT]: 800,
    [UserRole.BILLING_ADMIN]: 750,
    
    [UserRole.HOA_ADMIN]: 700,
    [UserRole.BOARD_PRESIDENT]: 650,
    [UserRole.PROPERTY_MANAGER]: 600,
    [UserRole.BOARD_MEMBER]: 550,
    
    [UserRole.FINANCIAL_OFFICER]: 500,
    [UserRole.MAINTENANCE_SUPERVISOR]: 450,
    [UserRole.SECURITY_COORDINATOR]: 400,
    [UserRole.COMMITTEE_MEMBER]: 350,
    
    [UserRole.RESIDENT_OWNER]: 300,
    [UserRole.RESIDENT_TENANT]: 250,
    
    [UserRole.VENDOR]: 200,
    [UserRole.SECURITY_GUARD]: 150,
    [UserRole.GUEST]: 100
  };

  // Resource permissions map
  private static readonly PERMISSIONS: Record<string, Record<UserRole, string[]>> = {
    users: {
      [UserRole.SUPER_ADMIN]: ['create', 'read', 'update', 'delete', 'manage'],
      [UserRole.HOA_ADMIN]: ['create', 'read', 'update', 'delete'],
      [UserRole.BOARD_PRESIDENT]: ['read', 'update'],
      [UserRole.PROPERTY_MANAGER]: ['read', 'update'],
      [UserRole.RESIDENT_OWNER]: ['read:own'],
      [UserRole.RESIDENT_TENANT]: ['read:own'],
      [UserRole.VENDOR]: ['read:own'],
      // Default: no permissions for other roles
    },
    
    properties: {
      [UserRole.SUPER_ADMIN]: ['create', 'read', 'update', 'delete', 'manage'],
      [UserRole.HOA_ADMIN]: ['create', 'read', 'update', 'delete'],
      [UserRole.BOARD_PRESIDENT]: ['read', 'update'],
      [UserRole.PROPERTY_MANAGER]: ['create', 'read', 'update'],
      [UserRole.FINANCIAL_OFFICER]: ['read'],
      [UserRole.MAINTENANCE_SUPERVISOR]: ['read'],
      [UserRole.RESIDENT_OWNER]: ['read:own'],
      [UserRole.RESIDENT_TENANT]: ['read:own'],
    },
    
    financial_transactions: {
      [UserRole.SUPER_ADMIN]: ['create', 'read', 'update', 'delete', 'manage'],
      [UserRole.HOA_ADMIN]: ['create', 'read', 'update', 'delete'],
      [UserRole.FINANCIAL_OFFICER]: ['create', 'read', 'update'],
      [UserRole.BOARD_PRESIDENT]: ['read', 'approve'],
      [UserRole.BOARD_MEMBER]: ['read'],
      [UserRole.PROPERTY_MANAGER]: ['create', 'read'],
      [UserRole.RESIDENT_OWNER]: ['read:own'],
      [UserRole.RESIDENT_TENANT]: ['read:own'],
    },
    
    maintenance_requests: {
      [UserRole.SUPER_ADMIN]: ['create', 'read', 'update', 'delete', 'manage'],
      [UserRole.HOA_ADMIN]: ['create', 'read', 'update', 'delete'],
      [UserRole.PROPERTY_MANAGER]: ['create', 'read', 'update', 'assign'],
      [UserRole.MAINTENANCE_SUPERVISOR]: ['read', 'update', 'assign'],
      [UserRole.BOARD_MEMBER]: ['read'],
      [UserRole.RESIDENT_OWNER]: ['create', 'read:own'],
      [UserRole.RESIDENT_TENANT]: ['create', 'read:own'],
      [UserRole.VENDOR]: ['read:assigned', 'update:assigned'],
    },
    
    announcements: {
      [UserRole.SUPER_ADMIN]: ['create', 'read', 'update', 'delete', 'manage'],
      [UserRole.HOA_ADMIN]: ['create', 'read', 'update', 'delete'],
      [UserRole.BOARD_PRESIDENT]: ['create', 'read', 'update', 'delete'],
      [UserRole.BOARD_MEMBER]: ['create', 'read', 'update'],
      [UserRole.PROPERTY_MANAGER]: ['create', 'read'],
      [UserRole.RESIDENT_OWNER]: ['read'],
      [UserRole.RESIDENT_TENANT]: ['read'],
    },
    
    documents: {
      [UserRole.SUPER_ADMIN]: ['create', 'read', 'update', 'delete', 'manage'],
      [UserRole.HOA_ADMIN]: ['create', 'read', 'update', 'delete'],
      [UserRole.BOARD_PRESIDENT]: ['create', 'read', 'update'],
      [UserRole.BOARD_MEMBER]: ['create', 'read', 'update'],
      [UserRole.PROPERTY_MANAGER]: ['create', 'read'],
      [UserRole.RESIDENT_OWNER]: ['read'],
      [UserRole.RESIDENT_TENANT]: ['read'],
    },
    
    votes: {
      [UserRole.SUPER_ADMIN]: ['create', 'read', 'update', 'delete', 'manage'],
      [UserRole.HOA_ADMIN]: ['create', 'read', 'update', 'delete'],
      [UserRole.BOARD_PRESIDENT]: ['create', 'read', 'update', 'delete'],
      [UserRole.BOARD_MEMBER]: ['create', 'read', 'update'],
      [UserRole.RESIDENT_OWNER]: ['read', 'vote'],
      [UserRole.RESIDENT_TENANT]: ['read'],
    }
  };

  static hasPermission(userRole: UserRole, resource: string, action: string): boolean {
    const resourcePermissions = this.PERMISSIONS[resource];
    if (!resourcePermissions) {
      return false;
    }

    const rolePermissions = resourcePermissions[userRole];
    if (!rolePermissions) {
      return false;
    }

    return rolePermissions.includes(action) || rolePermissions.includes('manage');
  }

  static hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
    return this.ROLE_HIERARCHY[userRole] >= this.ROLE_HIERARCHY[requiredRole];
  }

  static canAccessTenant(userRole: UserRole, targetTenantId: string, userTenantId: string): boolean {
    // Super admin can access all tenants
    if (userRole === UserRole.SUPER_ADMIN) {
      return true;
    }

    // All other roles can only access their own tenant
    return targetTenantId === userTenantId;
  }

  static getAccessibleRoles(userRole: UserRole): UserRole[] {
    const userLevel = this.ROLE_HIERARCHY[userRole];
    return Object.keys(this.ROLE_HIERARCHY)
      .filter(role => this.ROLE_HIERARCHY[role as UserRole] <= userLevel)
      .map(role => role as UserRole);
  }
}

// Middleware helper for authentication
export function extractToken(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

// Tenant resolution from subdomain
export function extractTenantSlug(host: string | undefined): string | null {
  if (!host) {
    return null;
  }

  // Extract subdomain from host (e.g., "westlands.kenyahoapro.com" -> "westlands")
  const parts = host.split('.');
  if (parts.length >= 3) {
    return parts[0];
  }

  return null;
}