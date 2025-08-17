// KenyaHOA Pro - Interactive Dashboard JavaScript

class InteractiveDashboard {
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

    // Add modal container to body
    this.addModalContainer();
    
    // Update UI with user data
    this.updateUserInterface();
    
    // Load dashboard data
    await this.loadDashboardData();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Add click animations
    this.addClickAnimations();
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

  addModalContainer() {
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-container';
    modalContainer.innerHTML = `
      <div id="modal-backdrop" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50" onclick="this.closeModal()">
        <div class="flex items-center justify-center min-h-screen p-4">
          <div id="modal-content" class="bg-white rounded-lg shadow-xl max-w-md w-full" onclick="event.stopPropagation()">
            <!-- Modal content will be inserted here -->
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modalContainer);
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
    // Update statistics cards with click handlers
    const totalPropsEl = document.getElementById('total-properties');
    if (totalPropsEl) {
      totalPropsEl.textContent = stats.total_properties || 0;
      // Make card clickable
      const cardEl = totalPropsEl.closest('.bg-white');
      if (cardEl) {
        cardEl.style.cursor = 'pointer';
        cardEl.onclick = () => this.showPropertiesModal(stats.total_properties);
      }
    }

    const occupiedPropsEl = document.getElementById('occupied-properties');
    if (occupiedPropsEl) {
      occupiedPropsEl.textContent = stats.occupied_properties || 0;
      const cardEl = occupiedPropsEl.closest('.bg-white');
      if (cardEl) {
        cardEl.style.cursor = 'pointer';
        cardEl.onclick = () => this.showOccupancyModal(stats.occupied_properties, stats.total_properties);
      }
    }

    const totalResidentsEl = document.getElementById('total-residents');
    if (totalResidentsEl) {
      totalResidentsEl.textContent = stats.total_residents || 0;
      const cardEl = totalResidentsEl.closest('.bg-white');
      if (cardEl) {
        cardEl.style.cursor = 'pointer';
        cardEl.onclick = () => this.showResidentsModal(stats.total_residents);
      }
    }

    const monthlyRevenueEl = document.getElementById('monthly-revenue');
    if (monthlyRevenueEl) {
      monthlyRevenueEl.textContent = this.formatCurrency(stats.monthly_revenue || 0);
      const cardEl = monthlyRevenueEl.closest('.bg-white');
      if (cardEl) {
        cardEl.style.cursor = 'pointer';
        cardEl.onclick = () => this.showRevenueModal(stats.monthly_revenue);
      }
    }

    // Update recent activities with click handlers
    const activitiesContainer = document.getElementById('recent-activities');
    if (activitiesContainer && stats.recent_activities) {
      activitiesContainer.innerHTML = stats.recent_activities.slice(0, 5).map((activity, index) => `
        <div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors" 
             onclick="window.dashboardApp.showActivityDetail(${index})">
          <div class="flex-shrink-0">
            <i class="fas ${this.getActivityIcon(activity.type)} text-blue-500"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-900">${activity.message}</p>
            <p class="text-xs text-gray-500">${this.formatDate(activity.timestamp)} - ${activity.user}</p>
          </div>
          <div class="flex-shrink-0">
            <i class="fas fa-chevron-right text-gray-400 text-xs"></i>
          </div>
        </div>
      `).join('');
      
      // Store activities for modal display
      this.recentActivities = stats.recent_activities;
    }
  }

  updateQuickActions() {
    const quickActionsContainer = document.getElementById('quick-actions');
    if (!quickActionsContainer) return;

    // Generate actions based on user role
    const actions = this.getQuickActionsForRole(this.user.role);
    
    quickActionsContainer.innerHTML = actions.map((action, index) => `
      <button class="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all transform hover:scale-105 border border-gray-200" 
              onclick="window.dashboardApp.executeAction('${action.type}')">
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
        type: 'profile',
        icon: 'user-cog',
        titleEn: 'Profile',
        titleSw: 'Wasifu',
        color: 'blue'
      },
      {
        type: 'notifications',
        icon: 'bell',
        titleEn: 'Notifications',
        titleSw: 'Arifa',
        color: 'yellow'
      }
    ];

    const roleSpecificActions = {
      'hoa_admin': [
        {
          type: 'manage_residents',
          icon: 'users',
          titleEn: 'Manage Residents',
          titleSw: 'Simamia Wakazi',
          color: 'green'
        },
        {
          type: 'financial_reports',
          icon: 'coins',
          titleEn: 'Financial Reports',
          titleSw: 'Ripoti za Kifedha',
          color: 'purple'
        }
      ],
      'property_manager': [
        {
          type: 'maintenance',
          icon: 'wrench',
          titleEn: 'Maintenance',
          titleSw: 'Matengenezo',
          color: 'orange'
        },
        {
          type: 'properties',
          icon: 'building',
          titleEn: 'Properties',
          titleSw: 'Mali',
          color: 'indigo'
        }
      ],
      'resident_owner': [
        {
          type: 'pay_dues',
          icon: 'credit-card',
          titleEn: 'Pay Dues',
          titleSw: 'Lipa Ada',
          color: 'green'
        },
        {
          type: 'report_issue',
          icon: 'tools',
          titleEn: 'Report Issue',
          titleSw: 'Ripoti Tatizo',
          color: 'red'
        }
      ]
    };

    return [...baseActions, ...(roleSpecificActions[role] || [])];
  }

  // Interactive Modal Functions
  showPropertiesModal(totalProperties) {
    const modal = document.getElementById('modal-content');
    modal.innerHTML = `
      <div class="p-6">
        <div class="flex items-center mb-4">
          <i class="fas fa-building text-2xl text-blue-600 mr-3"></i>
          <h3 class="text-lg font-semibold">Property Overview</h3>
        </div>
        <div class="space-y-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-blue-600">${totalProperties}</div>
            <div class="text-sm text-gray-600">Total Properties</div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span>Residential Units:</span>
              <span class="font-medium">${Math.floor(totalProperties * 0.85)}</span>
            </div>
            <div class="flex justify-between">
              <span>Commercial Units:</span>
              <span class="font-medium">${Math.floor(totalProperties * 0.15)}</span>
            </div>
            <div class="flex justify-between">
              <span>Property Types:</span>
              <span class="font-medium">Apartments, Offices</span>
            </div>
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button onclick="window.dashboardApp.closeModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">Close</button>
          <button onclick="window.dashboardApp.executeAction('properties')" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Manage Properties</button>
        </div>
      </div>
    `;
    this.showModal();
  }

  showOccupancyModal(occupied, total) {
    const occupancyRate = Math.round((occupied / total) * 100);
    const modal = document.getElementById('modal-content');
    modal.innerHTML = `
      <div class="p-6">
        <div class="flex items-center mb-4">
          <i class="fas fa-home text-2xl text-green-600 mr-3"></i>
          <h3 class="text-lg font-semibold">Occupancy Status</h3>
        </div>
        <div class="space-y-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-green-600">${occupancyRate}%</div>
            <div class="text-sm text-gray-600">Occupancy Rate</div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span>Occupied Units:</span>
              <span class="font-medium text-green-600">${occupied}</span>
            </div>
            <div class="flex justify-between">
              <span>Vacant Units:</span>
              <span class="font-medium text-orange-600">${total - occupied}</span>
            </div>
            <div class="flex justify-between">
              <span>Total Units:</span>
              <span class="font-medium">${total}</span>
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-green-600 h-2 rounded-full" style="width: ${occupancyRate}%"></div>
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button onclick="window.dashboardApp.closeModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">Close</button>
          <button onclick="window.dashboardApp.executeAction('manage_residents')" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Manage Occupancy</button>
        </div>
      </div>
    `;
    this.showModal();
  }

  showResidentsModal(totalResidents) {
    const modal = document.getElementById('modal-content');
    modal.innerHTML = `
      <div class="p-6">
        <div class="flex items-center mb-4">
          <i class="fas fa-users text-2xl text-purple-600 mr-3"></i>
          <h3 class="text-lg font-semibold">Resident Information</h3>
        </div>
        <div class="space-y-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-purple-600">${totalResidents}</div>
            <div class="text-sm text-gray-600">Total Residents</div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span>Property Owners:</span>
              <span class="font-medium">${Math.floor(totalResidents * 0.45)}</span>
            </div>
            <div class="flex justify-between">
              <span>Tenants:</span>
              <span class="font-medium">${Math.floor(totalResidents * 0.55)}</span>
            </div>
            <div class="flex justify-between">
              <span>Average per Unit:</span>
              <span class="font-medium">1.9 people</span>
            </div>
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button onclick="window.dashboardApp.closeModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">Close</button>
          <button onclick="window.dashboardApp.executeAction('manage_residents')" class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Manage Residents</button>
        </div>
      </div>
    `;
    this.showModal();
  }

  showRevenueModal(revenue) {
    const modal = document.getElementById('modal-content');
    modal.innerHTML = `
      <div class="p-6">
        <div class="flex items-center mb-4">
          <i class="fas fa-coins text-2xl text-yellow-600 mr-3"></i>
          <h3 class="text-lg font-semibold">Revenue Overview</h3>
        </div>
        <div class="space-y-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-yellow-600">${this.formatCurrency(revenue)}</div>
            <div class="text-sm text-gray-600">Monthly Revenue</div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span>Monthly Dues:</span>
              <span class="font-medium">${this.formatCurrency(revenue * 0.75)}</span>
            </div>
            <div class="flex justify-between">
              <span>Parking Fees:</span>
              <span class="font-medium">${this.formatCurrency(revenue * 0.15)}</span>
            </div>
            <div class="flex justify-between">
              <span>Other Fees:</span>
              <span class="font-medium">${this.formatCurrency(revenue * 0.10)}</span>
            </div>
          </div>
          <div class="text-xs text-gray-500 mt-2">
            Last updated: ${new Date().toLocaleDateString()}
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button onclick="window.dashboardApp.closeModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">Close</button>
          <button onclick="window.dashboardApp.executeAction('financial_reports')" class="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">View Reports</button>
        </div>
      </div>
    `;
    this.showModal();
  }

  showActivityDetail(activityIndex) {
    if (!this.recentActivities || !this.recentActivities[activityIndex]) return;
    
    const activity = this.recentActivities[activityIndex];
    const modal = document.getElementById('modal-content');
    modal.innerHTML = `
      <div class="p-6">
        <div class="flex items-center mb-4">
          <i class="fas ${this.getActivityIcon(activity.type)} text-2xl text-blue-600 mr-3"></i>
          <h3 class="text-lg font-semibold">Activity Details</h3>
        </div>
        <div class="space-y-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="font-medium text-gray-900">${activity.message}</div>
            <div class="text-sm text-gray-600 mt-1">
              ${this.formatDate(activity.timestamp)} by ${activity.user}
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span>Activity Type:</span>
              <span class="font-medium capitalize">${activity.type}</span>
            </div>
            <div class="flex justify-between">
              <span>Status:</span>
              <span class="font-medium text-green-600">Completed</span>
            </div>
            ${activity.type === 'payment' ? `
              <div class="flex justify-between">
                <span>Amount:</span>
                <span class="font-medium">KES 12,000</span>
              </div>
            ` : ''}
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button onclick="window.dashboardApp.closeModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">Close</button>
          <button onclick="window.dashboardApp.executeAction('view_all_activities')" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">View All Activities</button>
        </div>
      </div>
    `;
    this.showModal();
  }

  executeAction(actionType) {
    const actions = {
      'profile': () => this.showProfileModal(),
      'notifications': () => this.showNotificationsModal(),
      'manage_residents': () => this.showFeatureModal('Resident Management', 'Manage all residents, their properties, and contact information.'),
      'financial_reports': () => this.showFeatureModal('Financial Reports', 'View detailed financial reports, payment history, and revenue analytics.'),
      'maintenance': () => this.showFeatureModal('Maintenance Management', 'Track maintenance requests, schedule repairs, and manage service providers.'),
      'properties': () => this.showFeatureModal('Property Management', 'Manage property details, units, and occupancy information.'),
      'pay_dues': () => this.showPaymentModal(),
      'report_issue': () => this.showReportIssueModal(),
      'view_all_activities': () => this.showFeatureModal('Activity History', 'View complete history of all community activities and events.')
    };

    if (actions[actionType]) {
      actions[actionType]();
    } else {
      this.showFeatureModal('Coming Soon', 'This feature is currently under development and will be available soon.');
    }
  }

  showProfileModal() {
    const modal = document.getElementById('modal-content');
    modal.innerHTML = `
      <div class="p-6">
        <div class="flex items-center mb-4">
          <i class="fas fa-user-circle text-2xl text-blue-600 mr-3"></i>
          <h3 class="text-lg font-semibold">User Profile</h3>
        </div>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">First Name</label>
              <input type="text" value="${this.user.first_name}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" readonly>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Last Name</label>
              <input type="text" value="${this.user.last_name}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" readonly>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" value="${this.user.email}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" readonly>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Role</label>
            <input type="text" value="${this.user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" readonly>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Community</label>
            <input type="text" value="${this.tenant.name}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" readonly>
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button onclick="window.dashboardApp.closeModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">Close</button>
          <button onclick="alert('Profile editing coming soon!')" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Edit Profile</button>
        </div>
      </div>
    `;
    this.showModal();
  }

  showPaymentModal() {
    const modal = document.getElementById('modal-content');
    modal.innerHTML = `
      <div class="p-6">
        <div class="flex items-center mb-4">
          <i class="fas fa-credit-card text-2xl text-green-600 mr-3"></i>
          <h3 class="text-lg font-semibold">Make Payment</h3>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Payment Type</label>
            <select class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option>Monthly Dues</option>
              <option>Parking Fee</option>
              <option>Maintenance Fee</option>
              <option>Special Assessment</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Amount (KES)</label>
            <input type="number" value="12000" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Payment Method</label>
            <div class="mt-2 space-y-2">
              <label class="flex items-center">
                <input type="radio" name="payment_method" value="mpesa" class="mr-2" checked>
                <span>M-Pesa</span>
              </label>
              <label class="flex items-center">
                <input type="radio" name="payment_method" value="bank" class="mr-2">
                <span>Bank Transfer</span>
              </label>
            </div>
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button onclick="window.dashboardApp.closeModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
          <button onclick="alert('M-Pesa payment integration coming soon!')" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Pay Now</button>
        </div>
      </div>
    `;
    this.showModal();
  }

  showReportIssueModal() {
    const modal = document.getElementById('modal-content');
    modal.innerHTML = `
      <div class="p-6">
        <div class="flex items-center mb-4">
          <i class="fas fa-tools text-2xl text-red-600 mr-3"></i>
          <h3 class="text-lg font-semibold">Report Issue</h3>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Issue Type</label>
            <select class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option>Maintenance Request</option>
              <option>Noise Complaint</option>
              <option>Security Issue</option>
              <option>Facility Problem</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Priority</label>
            <select class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Emergency</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <textarea rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="Please describe the issue in detail..."></textarea>
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button onclick="window.dashboardApp.closeModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
          <button onclick="alert('Issue reporting system coming soon!')" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Submit Report</button>
        </div>
      </div>
    `;
    this.showModal();
  }

  showFeatureModal(title, description) {
    const modal = document.getElementById('modal-content');
    modal.innerHTML = `
      <div class="p-6">
        <div class="flex items-center mb-4">
          <i class="fas fa-cog text-2xl text-gray-600 mr-3"></i>
          <h3 class="text-lg font-semibold">${title}</h3>
        </div>
        <div class="space-y-4">
          <p class="text-gray-600">${description}</p>
          <div class="bg-blue-50 p-4 rounded-lg">
            <div class="flex items-center">
              <i class="fas fa-info-circle text-blue-600 mr-2"></i>
              <span class="text-sm text-blue-800">This feature is currently under development.</span>
            </div>
          </div>
        </div>
        <div class="mt-6 flex justify-end">
          <button onclick="window.dashboardApp.closeModal()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">OK</button>
        </div>
      </div>
    `;
    this.showModal();
  }

  showModal() {
    document.getElementById('modal-backdrop').classList.remove('hidden');
  }

  closeModal() {
    document.getElementById('modal-backdrop').classList.add('hidden');
  }

  addClickAnimations() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.bg-white');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-2px)';
        card.style.transition = 'transform 0.2s ease';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
      });
    });
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
    // Make functions globally available
    window.switchLanguage = (lang) => this.switchLanguage(lang);
    window.toggleUserMenu = () => this.toggleUserMenu();
    window.logout = () => this.logout();
    
    // Modal backdrop click to close
    document.addEventListener('click', (e) => {
      if (e.target.id === 'modal-backdrop') {
        this.closeModal();
      }
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });
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
  console.log('DOM loaded, initializing interactive dashboard...');
  window.dashboardApp = new InteractiveDashboard();
});

// Fallback initialization
if (document.readyState !== 'loading') {
  console.log('DOM already loaded, initializing interactive dashboard immediately...');
  window.dashboardApp = new InteractiveDashboard();
}