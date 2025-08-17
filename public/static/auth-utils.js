// KenyaHOA Pro - Authentication Utilities
class AuthUtils {
  static TOKEN_KEY = 'kenyahoa_token';
  static USER_KEY = 'kenyahoa_user';
  static TENANT_KEY = 'kenyahoa_tenant';
  static LANGUAGE_KEY = 'kenyahoa_language';

  /**
   * Check if user is authenticated
   * @returns {Object|null} Authentication data or null if not authenticated
   */
  static checkAuthentication() {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userStr = localStorage.getItem(this.USER_KEY);
    const tenantStr = localStorage.getItem(this.TENANT_KEY);

    if (!token || !userStr) {
      console.log('Missing authentication data');
      return null;
    }

    try {
      const user = JSON.parse(userStr);
      let tenant = null;
      
      // Handle tenant data - super admin has no tenant (platform-level access)
      if (tenantStr && tenantStr !== 'null' && tenantStr !== 'undefined') {
        tenant = JSON.parse(tenantStr);
      }
      
      console.log('Auth check passed:', { 
        user: user.first_name, 
        tenant: tenant ? tenant.name : 'Platform Level', 
        role: user.role 
      });
      
      return { token, user, tenant };
    } catch (error) {
      console.error('Error parsing stored authentication data:', error);
      return null;
    }
  }

  /**
   * Store authentication data
   * @param {string} token - JWT token
   * @param {Object} user - User object
   * @param {Object|null} tenant - Tenant object (null for super admin)
   */
  static storeAuthData(token, user, tenant = null) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.TENANT_KEY, tenant ? JSON.stringify(tenant) : 'null');
  }

  /**
   * Clear all authentication data
   */
  static clearAuthData() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TENANT_KEY);
  }

  /**
   * Get user's preferred language
   * @returns {string} Language code ('en' or 'sw')
   */
  static getLanguage() {
    return localStorage.getItem(this.LANGUAGE_KEY) || 'en';
  }

  /**
   * Set user's preferred language
   * @param {string} lang - Language code ('en' or 'sw')
   */
  static setLanguage(lang) {
    localStorage.setItem(this.LANGUAGE_KEY, lang);
  }

  /**
   * Check if user has specific role
   * @param {Object} user - User object
   * @param {string} role - Role to check
   * @returns {boolean}
   */
  static hasRole(user, role) {
    return user && user.role === role;
  }

  /**
   * Check if user is super admin
   * @param {Object} user - User object
   * @returns {boolean}
   */
  static isSuperAdmin(user) {
    return this.hasRole(user, 'super_admin');
  }

  /**
   * Get dashboard path for user role
   * @param {string} role - User role
   * @returns {string} Dashboard path
   */
  static getDashboardPath(role) {
    const roleConfig = {
      'super_admin': 'dashboard-super-admin.html',
      'hoa_admin': 'dashboard-admin.html',
      'property_manager': 'dashboard-admin.html',
      'finance_manager': 'dashboard-admin.html',
      'maintenance_manager': 'dashboard-maintenance.html',
      'resident_owner': 'dashboard-resident.html',
      'resident_tenant': 'dashboard-resident.html'
    };
    
    return roleConfig[role] || 'dashboard.html';
  }

  /**
   * Redirect to login page
   */
  static redirectToLogin() {
    window.location.href = '/index.html';
  }

  /**
   * Redirect to appropriate dashboard based on user role
   * @param {string} role - User role
   */
  static redirectToDashboard(role) {
    const dashboardPath = this.getDashboardPath(role);
    window.location.href = `/${dashboardPath}`;
  }

  /**
   * Logout user and redirect to login
   */
  static logout() {
    this.clearAuthData();
    this.redirectToLogin();
  }
}

// Make available globally
if (typeof window !== 'undefined') {
  window.AuthUtils = AuthUtils;
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthUtils;
}