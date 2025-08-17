// KenyaHOA Pro - Fully Translated Dashboard JavaScript

class TranslatedDashboard {
  constructor() {
    this.currentLanguage = localStorage.getItem('kenyahoa_language') || 'en';
    this.apiBaseUrl = '/api';
    this.user = null;
    this.tenant = null;
    this.token = null;
    
    // Translation dictionary
    this.translations = {
      en: {
        // Modal titles
        'property_overview': 'Property Overview',
        'occupancy_status': 'Occupancy Status',
        'resident_information': 'Resident Information',
        'revenue_overview': 'Revenue Overview',
        'activity_details': 'Activity Details',
        'user_profile': 'User Profile',
        'make_payment': 'Make Payment',
        'report_issue': 'Report Issue',
        'coming_soon': 'Coming Soon',
        
        // Property modal
        'total_properties': 'Total Properties',
        'residential_units': 'Residential Units',
        'commercial_units': 'Commercial Units',
        'property_types': 'Property Types',
        'apartments_offices': 'Apartments, Offices',
        
        // Occupancy modal
        'occupancy_rate': 'Occupancy Rate',
        'occupied_units': 'Occupied Units',
        'vacant_units': 'Vacant Units',
        'total_units': 'Total Units',
        
        // Residents modal
        'total_residents': 'Total Residents',
        'property_owners': 'Property Owners',
        'tenants': 'Tenants',
        'average_per_unit': 'Average per Unit',
        'people': 'people',
        
        // Revenue modal
        'monthly_revenue': 'Monthly Revenue',
        'monthly_dues': 'Monthly Dues',
        'parking_fees': 'Parking Fees',
        'other_fees': 'Other Fees',
        'last_updated': 'Last updated',
        
        // Activity modal
        'activity_type': 'Activity Type',
        'status': 'Status',
        'completed': 'Completed',
        'amount': 'Amount',
        
        // Profile modal
        'first_name': 'First Name',
        'last_name': 'Last Name',
        'email': 'Email',
        'role': 'Role',
        'community': 'Community',
        
        // Payment modal
        'payment_type': 'Payment Type',
        'payment_method': 'Payment Method',
        'bank_transfer': 'Bank Transfer',
        
        // Issue report modal
        'issue_type': 'Issue Type',
        'priority': 'Priority',
        'description': 'Description',
        'maintenance_request': 'Maintenance Request',
        'noise_complaint': 'Noise Complaint',
        'security_issue': 'Security Issue',
        'facility_problem': 'Facility Problem',
        'other': 'Other',
        'low': 'Low',
        'medium': 'Medium',
        'high': 'High',
        'emergency': 'Emergency',
        'describe_issue': 'Please describe the issue in detail...',
        
        // Buttons
        'close': 'Close',
        'cancel': 'Cancel',
        'ok': 'OK',
        'manage_properties': 'Manage Properties',
        'manage_occupancy': 'Manage Occupancy',
        'manage_residents': 'Manage Residents',
        'view_reports': 'View Reports',
        'view_all_activities': 'View All Activities',
        'edit_profile': 'Edit Profile',
        'pay_now': 'Pay Now',
        'submit_report': 'Submit Report',
        
        // Feature descriptions
        'resident_management_desc': 'Manage all residents, their properties, and contact information.',
        'financial_reports_desc': 'View detailed financial reports, payment history, and revenue analytics.',
        'maintenance_desc': 'Track maintenance requests, schedule repairs, and manage service providers.',
        'property_management_desc': 'Manage property details, units, and occupancy information.',
        'activity_history_desc': 'View complete history of all community activities and events.',
        'feature_development': 'This feature is currently under development.',
        'feature_available_soon': 'This feature is currently under development and will be available soon.',
        
        // Coming soon alerts
        'profile_editing_soon': 'Profile editing coming soon!',
        'mpesa_integration_soon': 'M-Pesa payment integration coming soon!',
        'issue_reporting_soon': 'Issue reporting system coming soon!',
        
        // Payment options
        'monthly_dues_option': 'Monthly Dues',
        'parking_fee_option': 'Parking Fee',
        'maintenance_fee_option': 'Maintenance Fee',
        'special_assessment': 'Special Assessment',
        
        // Role names
        'hoa_admin': 'HOA Admin',
        'property_manager': 'Property Manager',
        'resident_owner': 'Resident Owner',
        'resident_tenant': 'Resident Tenant'
      },
      sw: {
        // Modal titles
        'property_overview': 'Muhtasari wa Mali',
        'occupancy_status': 'Hali ya Ukaaji',
        'resident_information': 'Maelezo ya Wakazi',
        'revenue_overview': 'Muhtasari wa Mapato',
        'activity_details': 'Maelezo ya Shughuli',
        'user_profile': 'Wasifu wa Mtumiaji',
        'make_payment': 'Fanya Malipo',
        'report_issue': 'Ripoti Tatizo',
        'coming_soon': 'Inakuja Hivi Karibuni',
        
        // Property modal
        'total_properties': 'Jumla ya Mali',
        'residential_units': 'Vipimo vya Makazi',
        'commercial_units': 'Vipimo vya Kibiashara',
        'property_types': 'Aina za Mali',
        'apartments_offices': 'Vyumba, Ofisi',
        
        // Occupancy modal
        'occupancy_rate': 'Kiwango cha Ukaaji',
        'occupied_units': 'Vipimo Vilivyokalika',
        'vacant_units': 'Vipimo Tupu',
        'total_units': 'Jumla ya Vipimo',
        
        // Residents modal
        'total_residents': 'Jumla ya Wakazi',
        'property_owners': 'Wamiliki wa Mali',
        'tenants': 'Wapangaji',
        'average_per_unit': 'Wastani kwa Kipimo',
        'people': 'watu',
        
        // Revenue modal
        'monthly_revenue': 'Mapato ya Mwezi',
        'monthly_dues': 'Ada za Kila Mwezi',
        'parking_fees': 'Ada za Maegesho',
        'other_fees': 'Ada Nyingine',
        'last_updated': 'Ilisasishwa mwisho',
        
        // Activity modal
        'activity_type': 'Aina ya Shughuli',
        'status': 'Hali',
        'completed': 'Imekamilika',
        'amount': 'Kiasi',
        
        // Profile modal
        'first_name': 'Jina la Kwanza',
        'last_name': 'Jina la Mwisho',
        'email': 'Barua Pepe',
        'role': 'Jukumu',
        'community': 'Jamii',
        
        // Payment modal
        'payment_type': 'Aina ya Malipo',
        'payment_method': 'Njia ya Malipo',
        'bank_transfer': 'Uhamisho wa Benki',
        
        // Issue report modal
        'issue_type': 'Aina ya Tatizo',
        'priority': 'Kipaumbele',
        'description': 'Maelezo',
        'maintenance_request': 'Ombi la Matengenezo',
        'noise_complaint': 'Malalamiko ya Kelele',
        'security_issue': 'Tatizo la Usalama',
        'facility_problem': 'Tatizo la Vifaa',
        'other': 'Nyingine',
        'low': 'Chini',
        'medium': 'Kati',
        'high': 'Juu',
        'emergency': 'Dharura',
        'describe_issue': 'Tafadhali eleza tatizo kwa undani...',
        
        // Buttons
        'close': 'Funga',
        'cancel': 'Ghairi',
        'ok': 'Sawa',
        'manage_properties': 'Simamia Mali',
        'manage_occupancy': 'Simamia Ukaaji',
        'manage_residents': 'Simamia Wakazi',
        'view_reports': 'Ona Ripoti',
        'view_all_activities': 'Ona Shughuli Zote',
        'edit_profile': 'Hariri Wasifu',
        'pay_now': 'Lipa Sasa',
        'submit_report': 'Wasilisha Ripoti',
        
        // Feature descriptions
        'resident_management_desc': 'Simamia wakazi wote, mali zao, na maelezo ya mawasiliano.',
        'financial_reports_desc': 'Ona ripoti za kina za kifedha, historia ya malipo, na uchambuzi wa mapato.',
        'maintenance_desc': 'Fuatilia maombi ya matengenezo, panga marekebisho, na simamia watoa huduma.',
        'property_management_desc': 'Simamia maelezo ya mali, vipimo, na maelezo ya ukaaji.',
        'activity_history_desc': 'Ona historia kamili ya shughuli zote za jamii na matukio.',
        'feature_development': 'Kipengele hiki kipo katika maendeleo kwa sasa.',
        'feature_available_soon': 'Kipengele hiki kipo katika maendeleo na kitapatikana hivi karibuni.',
        
        // Coming soon alerts
        'profile_editing_soon': 'Uhariri wa wasifu unakuja hivi karibuni!',
        'mpesa_integration_soon': 'Mchanganyiko wa malipo ya M-Pesa unakuja hivi karibuni!',
        'issue_reporting_soon': 'Mfumo wa kuripoti matatizo unakuja hivi karibuni!',
        
        // Payment options
        'monthly_dues_option': 'Ada za Kila Mwezi',
        'parking_fee_option': 'Ada ya Maegesho',
        'maintenance_fee_option': 'Ada ya Matengenezo',
        'special_assessment': 'Tathmini Maalum',
        
        // Role names
        'hoa_admin': 'Msimamizi wa HOA',
        'property_manager': 'Msimamizi wa Mali',
        'resident_owner': 'Mwenyeji Mwenye Mali',
        'resident_tenant': 'Mwenyeji Mpangaji'
      }
    };
    
    this.init();
  }

  t(key) {
    return this.translations[this.currentLanguage][key] || this.translations['en'][key] || key;
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
    // Update main HOA name in header (instead of "KenyaHOA Pro")
    const hoaMainNameEl = document.getElementById('hoa-main-name');
    if (hoaMainNameEl) {
      hoaMainNameEl.textContent = this.tenant.name;
    }

    // Update HOA location
    const hoaLocationEl = document.getElementById('hoa-location');
    if (hoaLocationEl) {
      hoaLocationEl.textContent = this.tenant.location || '';
    }

    // Update legacy tenant name element (if exists)
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

      // Load user-specific data if user is a resident
      if (['resident_owner', 'resident_tenant'].includes(this.user.role)) {
        await this.loadUserSpecificData();
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

  async loadUserSpecificData() {
    try {
      const response = await fetch('/api/dashboard/my-data', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          this.userSpecificData = result.data;
          console.log('User-specific data loaded:', this.userSpecificData);
        }
      } else {
        console.warn('Failed to load user-specific data:', response.status);
      }
    } catch (error) {
      console.warn('Error loading user-specific data:', error);
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
        <span class="text-sm font-medium text-gray-900" data-sw="${action.titleSw}" data-en="${action.titleEn}">${this.t(action.titleKey)}</span>
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
        titleKey: 'user_profile',
        titleEn: this.t('user_profile'),
        titleSw: 'Wasifu',
        color: 'blue'
      },
      {
        type: 'notifications',
        icon: 'bell',
        titleKey: 'notifications',
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
          titleKey: 'manage_residents',
          titleEn: 'Manage Residents',
          titleSw: 'Simamia Wakazi',
          color: 'green'
        },
        {
          type: 'financial_reports',
          icon: 'coins',
          titleKey: 'view_reports',
          titleEn: 'Financial Reports',
          titleSw: 'Ripoti za Kifedha',
          color: 'purple'
        }
      ],
      'property_manager': [
        {
          type: 'maintenance',
          icon: 'wrench',
          titleKey: 'maintenance',
          titleEn: 'Maintenance',
          titleSw: 'Matengenezo',
          color: 'orange'
        },
        {
          type: 'properties',
          icon: 'building',
          titleKey: 'manage_properties',
          titleEn: 'Properties',
          titleSw: 'Mali',
          color: 'indigo'
        }
      ],
      'resident_owner': [
        {
          type: 'pay_dues',
          icon: 'credit-card',
          titleKey: 'make_payment',
          titleEn: 'Pay Dues',
          titleSw: 'Lipa Ada',
          color: 'green'
        },
        {
          type: 'report_issue',
          icon: 'tools',
          titleKey: 'report_issue',
          titleEn: 'Report Issue',
          titleSw: 'Ripoti Tatizo',
          color: 'red'
        }
      ]
    };

    return [...baseActions, ...(roleSpecificActions[role] || [])];
  }

  // Interactive Modal Functions with translations
  showPropertiesModal(totalProperties) {
    const modal = document.getElementById('modal-content');
    modal.innerHTML = `
      <div class="p-6">
        <div class="flex items-center mb-4">
          <i class="fas fa-building text-2xl text-blue-600 mr-3"></i>
          <h3 class="text-lg font-semibold">${this.t('property_overview')}</h3>
        </div>
        <div class="space-y-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-blue-600">${totalProperties}</div>
            <div class="text-sm text-gray-600">${this.t('total_properties')}</div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span>${this.t('residential_units')}:</span>
              <span class="font-medium">${Math.floor(totalProperties * 0.85)}</span>
            </div>
            <div class="flex justify-between">
              <span>${this.t('commercial_units')}:</span>
              <span class="font-medium">${Math.floor(totalProperties * 0.15)}</span>
            </div>
            <div class="flex justify-between">
              <span>${this.t('property_types')}:</span>
              <span class="font-medium">${this.t('apartments_offices')}</span>
            </div>
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button onclick="window.dashboardApp.closeModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">${this.t('close')}</button>
          <button onclick="window.dashboardApp.executeAction('properties')" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">${this.t('manage_properties')}</button>
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
          <h3 class="text-lg font-semibold">${this.t('occupancy_status')}</h3>
        </div>
        <div class="space-y-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-green-600">${occupancyRate}%</div>
            <div class="text-sm text-gray-600">${this.t('occupancy_rate')}</div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span>${this.t('occupied_units')}:</span>
              <span class="font-medium text-green-600">${occupied}</span>
            </div>
            <div class="flex justify-between">
              <span>${this.t('vacant_units')}:</span>
              <span class="font-medium text-orange-600">${total - occupied}</span>
            </div>
            <div class="flex justify-between">
              <span>${this.t('total_units')}:</span>
              <span class="font-medium">${total}</span>
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-green-600 h-2 rounded-full" style="width: ${occupancyRate}%"></div>
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button onclick="window.dashboardApp.closeModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">${this.t('close')}</button>
          <button onclick="window.dashboardApp.executeAction('manage_residents')" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">${this.t('manage_occupancy')}</button>
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
          <h3 class="text-lg font-semibold">${this.t('resident_information')}</h3>
        </div>
        <div class="space-y-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-purple-600">${totalResidents}</div>
            <div class="text-sm text-gray-600">${this.t('total_residents')}</div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span>${this.t('property_owners')}:</span>
              <span class="font-medium">${Math.floor(totalResidents * 0.45)}</span>
            </div>
            <div class="flex justify-between">
              <span>${this.t('tenants')}:</span>
              <span class="font-medium">${Math.floor(totalResidents * 0.55)}</span>
            </div>
            <div class="flex justify-between">
              <span>${this.t('average_per_unit')}:</span>
              <span class="font-medium">1.9 ${this.t('people')}</span>
            </div>
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button onclick="window.dashboardApp.closeModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">${this.t('close')}</button>
          <button onclick="window.dashboardApp.executeAction('manage_residents')" class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">${this.t('manage_residents')}</button>
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
          <h3 class="text-lg font-semibold">${this.t('revenue_overview')}</h3>
        </div>
        <div class="space-y-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-yellow-600">${this.formatCurrency(revenue)}</div>
            <div class="text-sm text-gray-600">${this.t('monthly_revenue')}</div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span>${this.t('monthly_dues')}:</span>
              <span class="font-medium">${this.formatCurrency(revenue * 0.75)}</span>
            </div>
            <div class="flex justify-between">
              <span>${this.t('parking_fees')}:</span>
              <span class="font-medium">${this.formatCurrency(revenue * 0.15)}</span>
            </div>
            <div class="flex justify-between">
              <span>${this.t('other_fees')}:</span>
              <span class="font-medium">${this.formatCurrency(revenue * 0.10)}</span>
            </div>
          </div>
          <div class="text-xs text-gray-500 mt-2">
            ${this.t('last_updated')}: ${new Date().toLocaleDateString()}
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button onclick="window.dashboardApp.closeModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">${this.t('close')}</button>
          <button onclick="window.dashboardApp.executeAction('financial_reports')" class="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">${this.t('view_reports')}</button>
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
          <h3 class="text-lg font-semibold">${this.t('activity_details')}</h3>
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
              <span>${this.t('activity_type')}:</span>
              <span class="font-medium capitalize">${activity.type}</span>
            </div>
            <div class="flex justify-between">
              <span>${this.t('status')}:</span>
              <span class="font-medium text-green-600">${this.t('completed')}</span>
            </div>
            ${activity.type === 'payment' ? `
              <div class="flex justify-between">
                <span>${this.t('amount')}:</span>
                <span class="font-medium">KES 12,000</span>
              </div>
            ` : ''}
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button onclick="window.dashboardApp.closeModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">${this.t('close')}</button>
          <button onclick="window.dashboardApp.executeAction('view_all_activities')" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">${this.t('view_all_activities')}</button>
        </div>
      </div>
    `;
    this.showModal();
  }

  executeAction(actionType) {
    const actions = {
      'profile': () => this.showProfileModal(),
      'notifications': () => this.showNotificationsModal(),
      'manage_residents': () => this.showFeatureModal(this.t('manage_residents'), this.t('resident_management_desc')),
      'financial_reports': () => this.showFeatureModal(this.t('view_reports'), this.t('financial_reports_desc')),
      'maintenance': () => this.showFeatureModal(this.t('maintenance'), this.t('maintenance_desc')),
      'properties': () => this.showFeatureModal(this.t('manage_properties'), this.t('property_management_desc')),
      'pay_dues': () => this.showPaymentModal(),
      'report_issue': () => this.showReportIssueModal(),
      'view_all_activities': () => this.showFeatureModal(this.t('view_all_activities'), this.t('activity_history_desc'))
    };

    if (actions[actionType]) {
      actions[actionType]();
    } else {
      this.showFeatureModal(this.t('coming_soon'), this.t('feature_available_soon'));
    }
  }

  showProfileModal() {
    const modal = document.getElementById('modal-content');
    modal.innerHTML = `
      <div class="p-6">
        <div class="flex items-center mb-4">
          <i class="fas fa-user-circle text-2xl text-blue-600 mr-3"></i>
          <h3 class="text-lg font-semibold">${this.t('user_profile')}</h3>
        </div>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">${this.t('first_name')}</label>
              <input type="text" value="${this.user.first_name}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" readonly>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">${this.t('last_name')}</label>
              <input type="text" value="${this.user.last_name}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" readonly>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">${this.t('email')}</label>
            <input type="email" value="${this.user.email}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" readonly>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">${this.t('role')}</label>
            <input type="text" value="${this.t(this.user.role)}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" readonly>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">${this.t('community')}</label>
            <input type="text" value="${this.tenant.name}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" readonly>
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button onclick="window.dashboardApp.closeModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">${this.t('close')}</button>
          <button onclick="alert('${this.t('profile_editing_soon')}')" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">${this.t('edit_profile')}</button>
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
          <h3 class="text-lg font-semibold">${this.t('make_payment')}</h3>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">${this.t('payment_type')}</label>
            <select class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option>${this.t('monthly_dues_option')}</option>
              <option>${this.t('parking_fee_option')}</option>
              <option>${this.t('maintenance_fee_option')}</option>
              <option>${this.t('special_assessment')}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">${this.t('amount')} (KES)</label>
            <input type="number" value="12000" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">${this.t('payment_method')}</label>
            <div class="mt-2 space-y-2">
              <label class="flex items-center">
                <input type="radio" name="payment_method" value="mpesa" class="mr-2" checked>
                <span>M-Pesa</span>
              </label>
              <label class="flex items-center">
                <input type="radio" name="payment_method" value="bank" class="mr-2">
                <span>${this.t('bank_transfer')}</span>
              </label>
            </div>
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button onclick="window.dashboardApp.closeModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">${this.t('cancel')}</button>
          <button onclick="alert('${this.t('mpesa_integration_soon')}')" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">${this.t('pay_now')}</button>
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
          <h3 class="text-lg font-semibold">${this.t('report_issue')}</h3>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">${this.t('issue_type')}</label>
            <select class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option>${this.t('maintenance_request')}</option>
              <option>${this.t('noise_complaint')}</option>
              <option>${this.t('security_issue')}</option>
              <option>${this.t('facility_problem')}</option>
              <option>${this.t('other')}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">${this.t('priority')}</label>
            <select class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option>${this.t('low')}</option>
              <option>${this.t('medium')}</option>
              <option>${this.t('high')}</option>
              <option>${this.t('emergency')}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">${this.t('description')}</label>
            <textarea rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="${this.t('describe_issue')}"></textarea>
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button onclick="window.dashboardApp.closeModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">${this.t('cancel')}</button>
          <button onclick="alert('${this.t('issue_reporting_soon')}')" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">${this.t('submit_report')}</button>
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
              <span class="text-sm text-blue-800">${this.t('feature_development')}</span>
            </div>
          </div>
        </div>
        <div class="mt-6 flex justify-end">
          <button onclick="window.dashboardApp.closeModal()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">${this.t('ok')}</button>
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
  console.log('DOM loaded, initializing translated dashboard...');
  window.dashboardApp = new TranslatedDashboard();
});

// Fallback initialization
if (document.readyState !== 'loading') {
  console.log('DOM already loaded, initializing translated dashboard immediately...');
  window.dashboardApp = new TranslatedDashboard();
}