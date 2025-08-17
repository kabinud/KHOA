// KenyaHOA Pro - Dashboard JavaScript

class DashboardApp {
  constructor() {
    this.currentLanguage = localStorage.getItem('kenyahoa_language') || 'en';
    this.apiBaseUrl = '/api';
    this.user = null;
    this.tenant = null;
    this.token = null;
    this.init();
  }

  async init() {
    // Check authentication
    if (!this.checkAuth()) {
      window.location.href = '/';
      return;
    }

    this.setupUI();
    await this.loadDashboardData();
    this.setupEventListeners();
  }

  checkAuth() {
    this.token = localStorage.getItem('kenyahoa_token');
    const userStr = localStorage.getItem('kenyahoa_user');
    const tenantStr = localStorage.getItem('kenyahoa_tenant');

    if (!this.token || !userStr || !tenantStr) {
      return false;
    }

    try {
      this.user = JSON.parse(userStr);
      this.tenant = JSON.parse(tenantStr);
      return true;
    } catch (error) {
      console.error('Error parsing stored data:', error);
      return false;
    }
  }

  setupUI() {
    const app = document.getElementById('dashboard-app');
    app.innerHTML = this.getDashboardHTML();
    this.updateLanguage();
  }

  getDashboardHTML() {
    return `
      <!-- Navigation -->
      <nav class="bg-white shadow-lg border-b-2 border-kenya-green">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-2xl font-bold text-kenya-green">
                <i class="fas fa-building mr-2"></i>
                ${this.tenant.name}
              </h1>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-gray-700">
                <span data-en="Welcome" data-sw="Karibu">Welcome</span>, 
                ${this.user.first_name} ${this.user.last_name}
              </span>
              <div class="flex space-x-2">
                <button id="langEn" class="px-2 py-1 rounded text-sm ${this.currentLanguage === 'en' ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-300'}">EN</button>
                <button id="langSw" class="px-2 py-1 rounded text-sm ${this.currentLanguage === 'sw' ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-300'}">SW</button>
              </div>
              <button id="logoutBtn" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-200">
                <i class="fas fa-sign-out-alt mr-2"></i>
                <span data-en="Logout" data-sw="Toka">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Dashboard Content -->
      <div class="min-h-screen bg-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <!-- Welcome Section -->
          <div class="mb-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-2">
              <span data-en="Dashboard" data-sw="Dashibodi">Dashboard</span>
            </h2>
            <p class="text-gray-600">
              <span data-en="Welcome to your HOA management dashboard" data-sw="Karibu kwenye dashibodi yako ya usimamizi wa HOA">
                Welcome to your HOA management dashboard
              </span>
            </p>
          </div>

          <!-- Statistics Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="dashboard-card">
              <div class="dashboard-stat">
                <div id="totalProperties" class="dashboard-stat-number">--</div>
                <div class="dashboard-stat-label" data-en="Total Properties" data-sw="Jumla ya Mali">Total Properties</div>
              </div>
            </div>
            
            <div class="dashboard-card">
              <div class="dashboard-stat">
                <div id="totalResidents" class="dashboard-stat-number">--</div>
                <div class="dashboard-stat-label" data-en="Total Residents" data-sw="Jumla ya Wakazi">Total Residents</div>
              </div>
            </div>
            
            <div class="dashboard-card">
              <div class="dashboard-stat">
                <div id="pendingMaintenance" class="dashboard-stat-number text-orange-600">--</div>
                <div class="dashboard-stat-label" data-en="Pending Maintenance" data-sw="Matengenezo Yanayosubiri">Pending Maintenance</div>
              </div>
            </div>
            
            <div class="dashboard-card">
              <div class="dashboard-stat">
                <div id="monthlyRevenue" class="dashboard-stat-number text-green-600">--</div>
                <div class="dashboard-stat-label" data-en="Monthly Revenue" data-sw="Mapato ya Mwezi">Monthly Revenue</div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <!-- Quick Actions Panel -->
            <div class="dashboard-card">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                <i class="fas fa-bolt text-yellow-500 mr-2"></i>
                <span data-en="Quick Actions" data-sw="Vitendo vya Haraka">Quick Actions</span>
              </h3>
              <div class="grid grid-cols-2 gap-4" id="quickActions">
                <!-- Quick actions will be populated here -->
              </div>
            </div>

            <!-- Recent Activities -->
            <div class="dashboard-card">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                <i class="fas fa-clock text-blue-500 mr-2"></i>
                <span data-en="Recent Activities" data-sw="Shughuli za Hivi Karibuni">Recent Activities</span>
              </h3>
              <div id="recentActivities" class="space-y-3">
                <!-- Recent activities will be populated here -->
              </div>
            </div>
          </div>

          <!-- User-Specific Content -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- My Properties / Outstanding Payments -->
            <div class="dashboard-card">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                <i class="fas fa-home text-green-500 mr-2"></i>
                <span data-en="My Information" data-sw="Maelezo Yangu">My Information</span>
              </h3>
              <div id="userInfo">
                <!-- User-specific info will be populated here -->
              </div>
            </div>

            <!-- Notifications -->
            <div class="dashboard-card">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                <i class="fas fa-bell text-purple-500 mr-2"></i>
                <span data-en="Notifications" data-sw="Arifa">Notifications</span>
              </h3>
              <div id="notifications">
                <!-- Notifications will be populated here -->
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Loading Overlay -->
      <div id="loadingOverlay" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 text-center">
          <div class="spinner"></div>
          <p class="mt-4 text-gray-700" data-en="Loading dashboard..." data-sw="Inapakia dashibodi...">Loading dashboard...</p>
        </div>
      </div>
    `;
  }

  async loadDashboardData() {
    try {
      // Load dashboard statistics
      const statsResponse = await this.makeAuthenticatedRequest('/dashboard/stats');
      if (statsResponse.success) {
        this.updateStatistics(statsResponse.data);
      }

      // Load user-specific data if user is a resident
      if (['resident_owner', 'resident_tenant'].includes(this.user.role)) {
        const userDataResponse = await this.makeAuthenticatedRequest('/dashboard/my-data');
        if (userDataResponse.success) {
          this.updateUserInfo(userDataResponse.data);
        }
      }

      // Load notifications
      const notificationsResponse = await this.makeAuthenticatedRequest('/dashboard/notifications');
      if (notificationsResponse.success) {
        this.updateNotifications(notificationsResponse.data.notifications);
      }

      // Load quick actions
      const actionsResponse = await this.makeAuthenticatedRequest('/dashboard/quick-actions');
      if (actionsResponse.success) {
        this.updateQuickActions(actionsResponse.data.actions);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      this.showToast('Failed to load dashboard data', 'error');
    } finally {
      // Hide loading overlay
      document.getElementById('loadingOverlay').style.display = 'none';
    }
  }

  updateStatistics(stats) {
    document.getElementById('totalProperties').textContent = stats.total_properties || 0;
    document.getElementById('totalResidents').textContent = stats.total_residents || 0;
    document.getElementById('pendingMaintenance').textContent = stats.pending_maintenance || 0;
    document.getElementById('monthlyRevenue').textContent = this.formatCurrency(stats.monthly_revenue || 0);

    // Update recent activities
    const activitiesContainer = document.getElementById('recentActivities');
    if (stats.recent_activities && stats.recent_activities.length > 0) {
      activitiesContainer.innerHTML = stats.recent_activities.slice(0, 5).map(activity => `
        <div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
          <div class="flex-shrink-0">
            <i class="fas ${this.getActivityIcon(activity.type)} text-gray-500"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-900">${activity.message}</p>
            <p class="text-xs text-gray-500">${this.formatDate(activity.timestamp)}</p>
          </div>
        </div>
      `).join('');
    } else {
      activitiesContainer.innerHTML = `
        <p class="text-gray-500 text-center py-4" data-en="No recent activities" data-sw="Hakuna shughuli za hivi karibuni">
          No recent activities
        </p>
      `;
    }
  }

  updateUserInfo(userData) {
    const userInfoContainer = document.getElementById('userInfo');
    
    if (userData.properties && userData.properties.length > 0) {
      userInfoContainer.innerHTML = `
        <div class="space-y-4">
          <div>
            <h4 class="font-medium text-gray-900 mb-2" data-en="My Properties" data-sw="Mali Zangu">My Properties</h4>
            <div class="space-y-2">
              ${userData.properties.map(property => `
                <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span class="font-medium">Unit ${property.unit_number}</span>
                  <span class="text-sm text-gray-600">${property.relationship_type}</span>
                </div>
              `).join('')}
            </div>
          </div>
          
          ${userData.outstanding_payments && userData.outstanding_payments.length > 0 ? `
            <div>
              <h4 class="font-medium text-gray-900 mb-2" data-en="Outstanding Payments" data-sw="Malipo Yanayobaki">Outstanding Payments</h4>
              <div class="space-y-2">
                ${userData.outstanding_payments.slice(0, 3).map(payment => `
                  <div class="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span class="text-sm">${payment.description}</span>
                    <span class="font-medium text-red-600">${this.formatCurrency(payment.amount)}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `;
    } else {
      userInfoContainer.innerHTML = `
        <div class="text-center py-4">
          <p class="text-gray-500" data-en="No property information available" data-sw="Hakuna maelezo ya mali yanayopatikana">
            No property information available
          </p>
        </div>
      `;
    }
  }

  updateQuickActions(actions) {
    const actionsContainer = document.getElementById('quickActions');
    
    if (actions && actions.length > 0) {
      actionsContainer.innerHTML = actions.slice(0, 4).map(action => `
        <button class="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition duration-200" 
                onclick="window.open('${action.url}', '_blank')">
          <i class="fas fa-${action.icon} text-2xl text-primary-600 mb-2"></i>
          <span class="text-sm font-medium text-center">${action.title}</span>
        </button>
      `).join('');
    } else {
      actionsContainer.innerHTML = `
        <div class="col-span-2 text-center py-4">
          <p class="text-gray-500" data-en="No quick actions available" data-sw="Hakuna vitendo vya haraka vinavyopatikana">
            No quick actions available
          </p>
        </div>
      `;
    }
  }

  updateNotifications(notifications) {
    const notificationsContainer = document.getElementById('notifications');
    
    if (notifications && notifications.length > 0) {
      notificationsContainer.innerHTML = notifications.slice(0, 5).map(notification => `
        <div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
          <div class="flex-shrink-0">
            <i class="fas ${this.getNotificationIcon(notification.type, notification.priority)} text-gray-500"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-900">${notification.title}</p>
            <p class="text-xs text-gray-500">${this.formatDate(notification.timestamp)}</p>
          </div>
        </div>
      `).join('');
    } else {
      notificationsContainer.innerHTML = `
        <p class="text-gray-500 text-center py-4" data-en="No new notifications" data-sw="Hakuna arifa mpya">
          No new notifications
        </p>
      `;
    }
  }

  setupEventListeners() {
    // Language switching
    document.getElementById('langEn')?.addEventListener('click', () => this.switchLanguage('en'));
    document.getElementById('langSw')?.addEventListener('click', () => this.switchLanguage('sw'));

    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());
  }

  switchLanguage(lang) {
    this.currentLanguage = lang;
    localStorage.setItem('kenyahoa_language', lang);
    
    // Update UI language indicator
    document.getElementById('langEn')?.classList.toggle('bg-gray-300', lang === 'en');
    document.getElementById('langEn')?.classList.toggle('bg-gray-200', lang !== 'en');
    document.getElementById('langSw')?.classList.toggle('bg-gray-300', lang === 'sw');
    document.getElementById('langSw')?.classList.toggle('bg-gray-200', lang !== 'sw');
    
    this.updateLanguage();
  }

  updateLanguage() {
    const elements = document.querySelectorAll('[data-en]');
    elements.forEach(element => {
      const englishText = element.getAttribute('data-en');
      const swahiliText = element.getAttribute('data-sw');
      
      if (this.currentLanguage === 'sw' && swahiliText) {
        element.textContent = swahiliText;
      } else {
        element.textContent = englishText;
      }
    });
  }

  logout() {
    localStorage.removeItem('kenyahoa_token');
    localStorage.removeItem('kenyahoa_user');
    localStorage.removeItem('kenyahoa_tenant');
    
    this.showToast('Logged out successfully', 'success');
    
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  }

  async makeAuthenticatedRequest(endpoint) {
    try {
      const response = await axios.get(`${this.apiBaseUrl}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      
      if (error.response?.status === 401) {
        // Token expired or invalid
        this.logout();
        return { success: false, message: 'Authentication expired' };
      }
      
      return { success: false, message: 'Request failed' };
    }
  }

  getActivityIcon(type) {
    const icons = {
      payment: 'fa-credit-card',
      maintenance: 'fa-wrench',
      announcement: 'fa-bullhorn',
      document: 'fa-file-text',
      resident: 'fa-user-plus'
    };
    return icons[type] || 'fa-info-circle';
  }

  getNotificationIcon(type, priority) {
    if (priority === 'urgent' || priority === 'high') {
      return 'fa-exclamation-triangle text-red-500';
    }
    
    const icons = {
      payment: 'fa-credit-card text-green-500',
      maintenance: 'fa-wrench text-orange-500',
      announcement: 'fa-bullhorn text-blue-500'
    };
    return icons[type] || 'fa-info-circle text-blue-500';
  }

  formatCurrency(amount, currency = 'KES') {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return this.currentLanguage === 'sw' ? 'Sasa hivi' : 'Just now';
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return this.currentLanguage === 'sw' 
        ? `Masaa ${hours} yaliyopita`
        : `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return new Intl.DateTimeFormat('en-KE', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    }
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 5000);
  }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.dashboardApp = new DashboardApp();
});