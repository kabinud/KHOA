// KenyaHOA Pro - Dashboard JavaScript (Fixed for existing HTML)

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

    // Update UI with user data
    this.updateUserInterface();
    
    // Load dashboard data
    await this.loadDashboardData();
    
    // Setup event listeners
    this.setupEventListeners();
  }

  checkAuth() {
    this.token = localStorage.getItem('kenyahoa_token');
    const userStr = localStorage.getItem('kenyahoa_user');
    const tenantStr = localStorage.getItem('kenyahoa_tenant');

    if (!this.token || !userStr || !tenantStr) {
      console.log('Missing authentication data');
      return false;
    }

    try {
      this.user = JSON.parse(userStr);
      this.tenant = JSON.parse(tenantStr);
      console.log('Auth check passed:', { user: this.user.first_name, tenant: this.tenant.name });
      return true;
    } catch (error) {
      console.error('Error parsing stored data:', error);
      return false;
    }
  }

  updateUserInterface() {
    // Update tenant name
    const tenantNameEl = document.getElementById('tenant-name');
    if (tenantNameEl) {
      tenantNameEl.textContent = this.tenant.name;
    }

    // Update welcome user name
    const welcomeUserEl = document.getElementById('welcome-user');
    if (welcomeUserEl) {
      welcomeUserEl.textContent = `${this.user.first_name} ${this.user.last_name}`;
    }

    // Update user name in nav
    const userNameEl = document.getElementById('user-name');
    if (userNameEl) {
      userNameEl.textContent = `${this.user.first_name} ${this.user.last_name}`;
    }

    // Update language selection
    this.updateLanguageInterface();
  }

  async loadDashboardData() {
    try {
      console.log('Loading dashboard data...');
      
      // Load dashboard statistics
      const response = await fetch('/api/dashboard/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Dashboard stats loaded:', data);
        this.updateStatistics(data);
      } else {
        console.error('Failed to load dashboard stats:', response.status);
        this.showErrorMessage();
      }

      // Generate quick actions based on user role
      this.updateQuickActions();

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      this.showErrorMessage();
    } finally {
      // Hide loading spinner and show dashboard content
      this.hideLoadingAndShowDashboard();
    }
  }

  updateStatistics(stats) {
    // Update statistics cards
    const totalPropsEl = document.getElementById('total-properties');
    if (totalPropsEl) {
      totalPropsEl.textContent = stats.total_properties || 0;
    }

    const occupiedPropsEl = document.getElementById('occupied-properties');
    if (occupiedPropsEl) {
      occupiedPropsEl.textContent = stats.occupied_properties || 0;
    }

    const totalResidentsEl = document.getElementById('total-residents');
    if (totalResidentsEl) {
      totalResidentsEl.textContent = stats.total_residents || 0;
    }

    const monthlyRevenueEl = document.getElementById('monthly-revenue');
    if (monthlyRevenueEl) {
      monthlyRevenueEl.textContent = this.formatCurrency(stats.monthly_revenue || 0);
    }

    // Update recent activities
    const activitiesContainer = document.getElementById('recent-activities');
    if (activitiesContainer && stats.recent_activities) {
      activitiesContainer.innerHTML = stats.recent_activities.slice(0, 5).map(activity => `
        <div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
          <div class="flex-shrink-0">
            <i class="fas ${this.getActivityIcon(activity.type)} text-blue-500"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-900">${activity.message}</p>
            <p class="text-xs text-gray-500">${this.formatDate(activity.timestamp)} - ${activity.user}</p>
          </div>
        </div>
      `).join('');
    }
  }

  updateQuickActions() {
    const quickActionsContainer = document.getElementById('quick-actions');
    if (!quickActionsContainer) return;

    // Generate actions based on user role
    const actions = this.getQuickActionsForRole(this.user.role);
    
    quickActionsContainer.innerHTML = actions.map(action => `
      <button class="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200" 
              onclick="${action.onclick}">
        <div class="w-12 h-12 bg-${action.color}-100 rounded-lg flex items-center justify-center mb-3">
          <i class="fas fa-${action.icon} text-${action.color}-600 text-xl"></i>
        </div>
        <span class="text-sm font-medium text-gray-900" data-sw="${action.titleSw}" data-en="${action.titleEn}">${action.titleEn}</span>
      </button>
    `).join('');

    // Update language for quick actions
    this.updateLanguage();
  }

  getQuickActionsForRole(role) {
    const baseActions = [
      {
        icon: 'user-cog',
        titleEn: 'Profile',
        titleSw: 'Wasifu',
        color: 'blue',
        onclick: 'alert("Profile management coming soon!")'
      },
      {
        icon: 'bell',
        titleEn: 'Notifications',
        titleSw: 'Arifa',
        color: 'yellow',
        onclick: 'alert("Notifications feature coming soon!")'
      }
    ];

    const roleSpecificActions = {
      'hoa_admin': [
        {
          icon: 'users',
          titleEn: 'Manage Residents',
          titleSw: 'Simamia Wakazi',
          color: 'green',
          onclick: 'alert("Resident management coming soon!")'
        },
        {
          icon: 'coins',
          titleEn: 'Financial Reports',
          titleSw: 'Ripoti za Kifedha',
          color: 'purple',
          onclick: 'alert("Financial reports coming soon!")'
        }
      ],
      'property_manager': [
        {
          icon: 'wrench',
          titleEn: 'Maintenance',
          titleSw: 'Matengenezo',
          color: 'orange',
          onclick: 'alert("Maintenance management coming soon!")'
        },
        {
          icon: 'building',
          titleEn: 'Properties',
          titleSw: 'Mali',
          color: 'indigo',
          onclick: 'alert("Property management coming soon!")'
        }
      ],
      'resident_owner': [
        {
          icon: 'credit-card',
          titleEn: 'Pay Dues',
          titleSw: 'Lipa Ada',
          color: 'green',
          onclick: 'alert("Payment system coming soon!")'
        },
        {
          icon: 'tools',
          titleEn: 'Report Issue',
          titleSw: 'Ripoti Tatizo',
          color: 'red',
          onclick: 'alert("Issue reporting coming soon!")'
        }
      ]
    };

    return [...baseActions, ...(roleSpecificActions[role] || [])];
  }

  hideLoadingAndShowDashboard() {
    const loadingEl = document.getElementById('loading');
    const dashboardEl = document.getElementById('dashboard-content');
    
    if (loadingEl) {
      loadingEl.classList.add('hidden');
    }
    
    if (dashboardEl) {
      dashboardEl.classList.remove('hidden');
      dashboardEl.classList.add('fade-in');
    }
  }

  showErrorMessage() {
    const dashboardEl = document.getElementById('dashboard-content');
    if (dashboardEl) {
      dashboardEl.innerHTML = `
        <div class="text-center py-12">
          <i class="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p class="text-gray-600 mb-4">There was a problem loading your dashboard data.</p>
          <button onclick="window.location.reload()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
            Try Again
          </button>
        </div>
      `;
      dashboardEl.classList.remove('hidden');
    }
    
    const loadingEl = document.getElementById('loading');
    if (loadingEl) {
      loadingEl.classList.add('hidden');
    }
  }

  setupEventListeners() {
    // Make functions globally available for onclick handlers
    window.switchLanguage = (lang) => this.switchLanguage(lang);
    window.toggleUserMenu = () => this.toggleUserMenu();
    window.logout = () => this.logout();
  }

  switchLanguage(lang) {
    this.currentLanguage = lang;
    localStorage.setItem('kenyahoa_language', lang);
    
    this.updateLanguageInterface();
    this.updateLanguage();
  }

  updateLanguageInterface() {
    const langSwBtn = document.getElementById('lang-sw');
    const langEnBtn = document.getElementById('lang-en');
    
    if (langSwBtn && langEnBtn) {
      if (this.currentLanguage === 'sw') {
        langSwBtn.classList.add('bg-white/30');
        langSwBtn.classList.remove('hover:bg-white/20');
        langEnBtn.classList.remove('bg-white/30');
        langEnBtn.classList.add('hover:bg-white/20');
      } else {
        langEnBtn.classList.add('bg-white/30');
        langEnBtn.classList.remove('hover:bg-white/20');
        langSwBtn.classList.remove('bg-white/30');
        langSwBtn.classList.add('hover:bg-white/20');
      }
    }
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

  toggleUserMenu() {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
      dropdown.classList.toggle('hidden');
    }
  }

  logout() {
    localStorage.removeItem('kenyahoa_token');
    localStorage.removeItem('kenyahoa_user');
    localStorage.removeItem('kenyahoa_tenant');
    
    window.location.href = '/';
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

  formatCurrency(amount, currency = 'KES') {
    if (amount >= 1000) {
      return `${currency} ${Math.round(amount / 1000)}K`;
    }
    return `${currency} ${amount}`;
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
      return date.toLocaleDateString();
    }
  }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing dashboard...');
  window.dashboardApp = new DashboardApp();
});

// Also try to initialize if DOM is already loaded
if (document.readyState === 'loading') {
  // Loading hasn't finished yet
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded (fallback), initializing dashboard...');
    window.dashboardApp = new DashboardApp();
  });
} else {
  // `DOMContentLoaded` has already fired
  console.log('DOM already loaded, initializing dashboard immediately...');
  window.dashboardApp = new DashboardApp();
}