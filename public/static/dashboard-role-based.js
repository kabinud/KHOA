// KenyaHOA Pro - Role-Based Dashboard JavaScript

class RoleBasedDashboard {
  constructor(expectedRole = null) {
    this.currentLanguage = localStorage.getItem('kenyahoa_language') || 'en';
    this.apiBaseUrl = '/api';
    this.user = null;
    this.tenant = null;
    this.token = null;
    this.expectedRole = expectedRole;
    
    // Role definitions and their dashboard paths
    this.roleConfig = {
      'super_admin': { 
        dashboard: 'dashboard-super-admin.html',
        label: 'Super Admin',
        permissions: ['platform_admin', 'all_tenants', 'system_management']
      },
      'hoa_admin': { 
        dashboard: 'dashboard-admin.html',
        label: 'HOA Admin',
        permissions: ['all']
      },
      'property_manager': { 
        dashboard: 'dashboard-admin.html',
        label: 'Property Manager',
        permissions: ['properties', 'maintenance', 'residents'] 
      },
      'finance_manager': { 
        dashboard: 'dashboard-admin.html',
        label: 'Finance Manager',
        permissions: ['financial', 'payments', 'reports']
      },
      'maintenance_manager': { 
        dashboard: 'dashboard-maintenance.html',
        label: 'Maintenance Manager',
        permissions: ['maintenance', 'schedules', 'vendors', 'work_orders']
      },
      'resident_owner': { 
        dashboard: 'dashboard-resident.html',
        label: 'Property Owner',
        permissions: ['resident', 'owner_features']
      },
      'resident_tenant': { 
        dashboard: 'dashboard-resident.html',
        label: 'Tenant',
        permissions: ['resident']
      }
    };
    
    // Translation dictionary
    this.translations = {
      en: {
        // Admin Dashboard
        'admin_dashboard': 'Admin Dashboard',
        'admin_welcome': 'Welcome back',
        'property_management': 'Property Management',
        'resident_management': 'Resident Management',
        'financial_management': 'Financial Management',
        'maintenance_management': 'Maintenance Management',
        'manage_properties': 'Manage Properties',
        'manage_residents': 'Manage Residents',
        'manage_occupancy': 'Manage Occupancy',
        'financial_reports': 'Financial Reports',
        'payment_tracking': 'Payment Tracking',
        'maintenance_requests': 'Maintenance Requests',
        'maintenance_schedule': 'Maintenance Schedule',
        'communications': 'Communications',
        'property_management_desc': 'Add, edit, and track all properties',
        'occupancy_management': 'Occupancy Management',
        'occupancy_management_desc': 'Track vacant and occupied units',
        'resident_management_desc': 'Add, edit, and manage resident information',
        'communications_desc': 'Send announcements and notices',
        'financial_reports_desc': 'View revenue, expenses, and payment reports',
        'payment_tracking_desc': 'Track dues, payments, and overdue amounts',
        'maintenance_requests_desc': 'Review and manage maintenance requests',
        'maintenance_schedule_desc': 'Plan and schedule maintenance activities',
        'pending_issues': 'Pending Issues',
        
        // Super Admin Dashboard
        'super_admin_dashboard': 'Super Admin Dashboard',
        'platform_overview': 'Platform Overview',
        'hoa_management': 'HOA Management',
        'user_management': 'User Management',
        'system_analytics': 'System Analytics',
        'platform_settings': 'Platform Settings',
        'create_hoa': 'Create HOA',
        'manage_hoas': 'Manage HOAs',
        'total_hoas': 'Total HOAs',
        'active_hoas': 'Active HOAs',
        'total_platform_users': 'Total Platform Users',
        'total_platform_revenue': 'Total Platform Revenue',
        'monthly_growth': 'Monthly Growth',
        'system_health': 'System Health',
        'database_status': 'Database Status',
        'api_performance': 'API Performance',
        'hoa_details': 'HOA Details',
        'hoa_users': 'HOA Users',
        'hoa_analytics': 'HOA Analytics',
        'subscription_plans': 'Subscription Plans',
        'billing_management': 'Billing Management',
        'support_tickets': 'Support Tickets',
        'system_logs': 'System Logs',
        'backup_management': 'Backup Management',
        'security_settings': 'Security Settings',
        'api_keys': 'API Keys',
        'integrations': 'Integrations',
        'notification_settings': 'Notification Settings',
        'audit_logs': 'Audit Logs',
        'performance_metrics': 'Performance Metrics',
        'error_monitoring': 'Error Monitoring',
        
        // Maintenance Dashboard
        'maintenance_dashboard': 'Maintenance Dashboard',
        'maintenance_manager': 'Maintenance Manager',
        'welcome_back': 'Welcome back',
        'logout': 'Logout',
        'quick_actions': 'Quick Actions',
        'view_schedule': 'View Schedule',
        'work_orders': 'Work Orders',
        'vendors': 'Vendors',
        'inventory': 'Inventory',
        'todays_schedule': 'Today\'s Schedule',
        'urgent_work_orders': 'Urgent Work Orders',
        'vendor_performance': 'Vendor Performance',
        'monthly_costs': 'Monthly Costs',
        'recent_activity': 'Recent Activity',
        'view_all': 'View All',
        'manage': 'Manage',
        'reports': 'Reports',
        'scheduled_tasks': 'Scheduled Tasks',
        'overdue_tasks': 'Overdue Tasks',
        'completed_today': 'Completed Today',
        'total_cost': 'Total Cost',
        'pending_requests': 'Pending Requests',
        'in_progress': 'In Progress',
        'completed_requests': 'Completed Requests',
        'emergency_requests': 'Emergency Requests',
        'active_vendors': 'Active Vendors',
        'top_rated_vendor': 'Top Rated Vendor',
        'average_rating': 'Average Rating',
        'total_contracts': 'Total Contracts',
        
        // Resident Dashboard
        'resident_welcome': 'Welcome Home',
        'resident_greeting': 'Hello',
        'unit': 'Unit',
        'pay_dues': 'Pay Dues',
        'quick_payment': 'Quick Payment',
        'report_issue': 'Report Issue',
        'maintenance_request': 'Maintenance',
        'documents': 'Documents',
        'view_documents': 'View Library',
        'directory': 'Directory',
        'resident_directory': 'Residents',
        'my_account': 'My Account',
        'community_services': 'Community Services',
        'support_services': 'Support & Services',
        'document_library': 'Document Library',
        'community_announcements': 'Community Announcements',
        'payment_history': 'Payment History',
        'payment_history_desc': 'View your payment records and receipts',
        'account_balance': 'Account Balance',
        'account_balance_desc': 'Check dues and outstanding amounts',
        'personal_info': 'Personal Information',
        'personal_info_desc': 'Update your contact information',
        'directory_desc': 'Find neighbors and community contacts',
        'amenities': 'Amenities',
        'amenities_desc': 'Book facilities and view schedules',
        'community_events': 'Community Events',
        'events_desc': 'View upcoming community events',
        'report_issue_desc': 'Report maintenance or other issues',
        'my_requests': 'My Requests',
        'my_requests_desc': 'Track your maintenance requests',
        'contact_management': 'Contact Management',
        'contact_management_desc': 'Get help and support',
        'hoa_documents': 'HOA Documents',
        'hoa_documents_desc': 'Bylaws, rules, and regulations',
        'financial_statements': 'Financial Statements',
        'financial_statements_desc': 'Budget reports and financial updates',
        'forms': 'Forms & Applications',
        'forms_desc': 'Download common forms and applications',
        
        // Common
        'total_properties': 'Total Properties',
        'total_residents': 'Total Residents',
        'monthly_revenue': 'Monthly Revenue',
        'recent_activities': 'Recent Activities',
        'loading': 'Loading...',
        'user_profile': 'User Profile',
        'make_payment': 'Make Payment',
        'coming_soon': 'Coming Soon',
        'close': 'Close',
        'cancel': 'Cancel',
        'ok': 'OK'
      },
      sw: {
        // Admin Dashboard
        'admin_dashboard': 'Dashibodi ya Msimamizi',
        'admin_welcome': 'Karibu tena',
        'property_management': 'Usimamizi wa Mali',
        'resident_management': 'Usimamizi wa Wakazi',
        'financial_management': 'Usimamizi wa Kifedha',
        'maintenance_management': 'Usimamizi wa Matengenezo',
        'manage_properties': 'Simamia Mali',
        'manage_residents': 'Simamia Wakazi',
        'manage_occupancy': 'Simamia Makazi',
        'financial_reports': 'Ripoti za Kifedha',
        'payment_tracking': 'Kufuatilia Malipo',
        'maintenance_requests': 'Maombi ya Matengenezo',
        'maintenance_schedule': 'Ratiba ya Matengenezo',
        'communications': 'Mawasiliano',
        'property_management_desc': 'Ongeza, hariri na fuatilia mali zote',
        'occupancy_management': 'Usimamizi wa Makazi',
        'occupancy_management_desc': 'Fuatilia vyumba vilivyo wazi na vilivyo na wakazi',
        'resident_management_desc': 'Ongeza, hariri na simamia taarifa za wakazi',
        'communications_desc': 'Tuma matangazo na notisi',
        'financial_reports_desc': 'Ona mapato, matumizi na ripoti za malipo',
        'payment_tracking_desc': 'Fuatilia kodi, malipo na deni',
        'maintenance_requests_desc': 'Kagua na simamia maombi ya matengenezo',
        'maintenance_schedule_desc': 'Panga na ratibu shughuli za matengenezo',
        'pending_issues': 'Masuala Yanayosubiri',
        
        // Super Admin Dashboard
        'super_admin_dashboard': 'Dashibodi ya Msimamizi Mkuu',
        'platform_overview': 'Muhtasari wa Jukwaa',
        'hoa_management': 'Usimamizi wa HOA',
        'user_management': 'Usimamizi wa Watumiaji',
        'system_analytics': 'Uchambuzi wa Mfumo',
        'platform_settings': 'Mipangilio ya Jukwaa',
        'create_hoa': 'Unda HOA',
        'manage_hoas': 'Simamia HOA',
        'total_hoas': 'Jumla ya HOA',
        'active_hoas': 'HOA Zinazofanya Kazi',
        'total_platform_users': 'Jumla ya Watumiaji wa Jukwaa',
        'total_platform_revenue': 'Jumla ya Mapato ya Jukwaa',
        'monthly_growth': 'Ukuaji wa Kila Mwezi',
        'system_health': 'Afya ya Mfumo',
        'database_status': 'Hali ya Hifadhidata',
        'api_performance': 'Utendaji wa API',
        'hoa_details': 'Maelezo ya HOA',
        'hoa_users': 'Watumiaji wa HOA',
        'hoa_analytics': 'Uchambuzi wa HOA',
        'subscription_plans': 'Mipango ya Usajili',
        'billing_management': 'Usimamizi wa Malipo',
        'support_tickets': 'Tikiti za Msaada',
        'system_logs': 'Kumbuka za Mfumo',
        'backup_management': 'Usimamizi wa Nakala',
        'security_settings': 'Mipangilio ya Usalama',
        'api_keys': 'Funguo za API',
        'integrations': 'Muunganisho',
        'notification_settings': 'Mipangilio ya Arifa',
        'audit_logs': 'Kumbuka za Ukaguzi',
        'performance_metrics': 'Vipimo vya Utendaji',
        'error_monitoring': 'Ufuatiliaji wa Makosa',
        
        // Maintenance Dashboard
        'maintenance_dashboard': 'Dashibodi ya Matengenezo',
        'maintenance_manager': 'Meneja wa Matengenezo',
        'welcome_back': 'Karibu tena',
        'logout': 'Ondoka',
        'quick_actions': 'Vitendo vya Haraka',
        'view_schedule': 'Ona Ratiba',
        'work_orders': 'Maagizo ya Kazi',
        'vendors': 'Wauzaji',
        'inventory': 'Hesabu ya Vifaa',
        'todays_schedule': 'Ratiba ya Leo',
        'urgent_work_orders': 'Maagizo ya Kazi ya Haraka',
        'vendor_performance': 'Utendaji wa Wauzaji',
        'monthly_costs': 'Gharama za Kila Mwezi',
        'recent_activity': 'Shughuli za Hivi Karibuni',
        'view_all': 'Ona Yote',
        'manage': 'Simamia',
        'reports': 'Ripoti',
        'scheduled_tasks': 'Kazi Zilizopangwa',
        'overdue_tasks': 'Kazi Zilizochelewa',
        'completed_today': 'Zilizokamilika Leo',
        'total_cost': 'Jumla ya Gharama',
        'pending_requests': 'Maombi Yanayosubiri',
        'in_progress': 'Inafanyika',
        'completed_requests': 'Maombi Yaliyokamilika',
        'emergency_requests': 'Maombi ya Dharura',
        'active_vendors': 'Wauzaji Hai',
        'top_rated_vendor': 'Muuzaji Mzuri Zaidi',
        'average_rating': 'Kiwango cha Wastani',
        'total_contracts': 'Jumla ya Mikataba',
        
        // Resident Dashboard
        'resident_welcome': 'Karibu Nyumbani',
        'resident_greeting': 'Hujambo',
        'unit': 'Chumba',
        'pay_dues': 'Lipa Kodi',
        'quick_payment': 'Malipo ya Haraka',
        'report_issue': 'Ripoti Tatizo',
        'maintenance_request': 'Matengenezo',
        'documents': 'Hati',
        'view_documents': 'Ona Maktaba',
        'directory': 'Saraka',
        'resident_directory': 'Wakazi',
        'my_account': 'Akaunti Yangu',
        'community_services': 'Huduma za Kijamii',
        'support_services': 'Huduma za Msaada',
        'document_library': 'Maktaba ya Hati',
        'community_announcements': 'Matangazo ya Kijamii',
        'payment_history': 'Historia ya Malipo',
        'payment_history_desc': 'Ona rekodi za malipo na risiti',
        'account_balance': 'Salio la Akaunti',
        'account_balance_desc': 'Angalia kodi na deni',
        'personal_info': 'Taarifa za Kibinafsi',
        'personal_info_desc': 'Sasisha taarifa za mawasiliano',
        'directory_desc': 'Tafuta majirani na anwani za kijamii',
        'amenities': 'Vifaa',
        'amenities_desc': 'Weka nafasi na ona ratiba',
        'community_events': 'Matukio ya Kijamii',
        'events_desc': 'Ona matukio yanayokuja ya kijamii',
        'report_issue_desc': 'Ripoti matengenezo au masuala mengine',
        'my_requests': 'Maombi Yangu',
        'my_requests_desc': 'Fuatilia maombi yako ya matengenezo',
        'contact_management': 'Mawasiliano ya Usimamizi',
        'contact_management_desc': 'Pata msaada na huduma',
        'hoa_documents': 'Hati za HOA',
        'hoa_documents_desc': 'Sheria, kanuni na taratibu',
        'financial_statements': 'Taarifa za Kifedha',
        'financial_statements_desc': 'Ripoti za bajeti na masasisho ya kifedha',
        'forms': 'Fomu na Maombi',
        'forms_desc': 'Pakua fomu na maombi ya kawaida',
        
        // Common
        'total_properties': 'Jumla ya Mali',
        'total_residents': 'Jumla ya Wakazi',
        'monthly_revenue': 'Mapato ya Kila Mwezi',
        'recent_activities': 'Shughuli za Hivi Karibuni',
        'loading': 'Inapakia...',
        'user_profile': 'Wasifu wa Mtumiaji',
        'make_payment': 'Fanya Malipo',
        'coming_soon': 'Inakuja Hivi Karibuni',
        'close': 'Funga',
        'cancel': 'Ghairi',
        'ok': 'Sawa'
      }
    };
    
    this.init();
  }

  async init() {
    try {
      console.log('Initializing role-based dashboard...');
      
      // Show loading indicator
      this.showLoadingSpinner();
      
      // Check authentication first
      if (!this.checkAuth()) {
        console.log('Authentication failed, redirecting to login');
        AuthUtils.redirectToLogin();
        return;
      }

      // Check if user is on correct dashboard for their role
      if (!this.validateRoleDashboard()) {
        return; // Will redirect to correct dashboard
      }

      // Add modal container to body
      this.addModalContainer();
      
      // Update UI with user data
      this.updateUserInterface();
      
      // Load dashboard data based on role
      await this.loadRoleSpecificData();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Hide loading indicator
      this.hideLoadingSpinner();
      
      console.log(`Role-based dashboard initialized for ${this.user.role}`);
    } catch (error) {
      console.error('Failed to initialize dashboard:', error);
      this.hideLoadingSpinner();
      this.showErrorMessage('Failed to initialize dashboard. Please refresh the page.');
    }
  }

  checkAuth() {
    const authData = AuthUtils.checkAuthentication();
    
    if (!authData) {
      return false;
    }
    
    this.token = authData.token;
    this.user = authData.user;
    this.tenant = authData.tenant;
    
    return true;
  }

  validateRoleDashboard() {
    const userRole = this.user.role;
    const expectedDashboard = this.roleConfig[userRole]?.dashboard;
    const currentPage = window.location.pathname.split('/').pop();

    console.log('Validating role dashboard:', { userRole, expectedDashboard, currentPage });

    if (!expectedDashboard) {
      console.error('Unknown user role:', userRole);
      return false;
    }

    // If user is on wrong dashboard for their role, redirect
    if (currentPage !== expectedDashboard) {
      console.log(`Redirecting ${userRole} from ${currentPage} to ${expectedDashboard}`);
      window.location.href = `/${expectedDashboard}`;
      return false;
    }

    return true;
  }

  addModalContainer() {
    if (document.getElementById('modal-container')) return;
    
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-container';
    modalContainer.innerHTML = `
      <div id="modal-backdrop" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50" onclick="window.dashboard.closeModal()">
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
    // Update main HOA name in header
    const hoaMainNameEl = document.getElementById('hoa-main-name');
    if (hoaMainNameEl) {
      hoaMainNameEl.textContent = this.tenant ? this.tenant.name : 'KenyaHOA Pro Platform';
    }

    // Update HOA location
    const hoaLocationEl = document.getElementById('hoa-location');
    if (hoaLocationEl) {
      hoaLocationEl.textContent = this.tenant ? (this.tenant.location || '') : 'Platform Administration';
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

    // Update unit number for residents
    const userUnitEl = document.getElementById('user-unit');
    const welcomeUnitEl = document.getElementById('welcome-unit');
    if (this.user.unit_number) {
      if (userUnitEl) userUnitEl.textContent = this.user.unit_number;
      if (welcomeUnitEl) welcomeUnitEl.textContent = this.user.unit_number;
    }

    // Update language selection
    this.updateLanguageInterface();
  }

  async loadRoleSpecificData() {
    const userRole = this.user.role;
    
    if (userRole === 'super_admin') {
      // Load super admin/platform data
      await this.loadSuperAdminDashboardData();
    } else if (['hoa_admin', 'property_manager', 'finance_manager'].includes(userRole)) {
      // Load admin/management data
      await this.loadAdminDashboardData();
    } else if (['resident_owner', 'resident_tenant'].includes(userRole)) {
      // Load resident data
      await this.loadResidentDashboardData();
    } else if (userRole === 'maintenance_manager') {
      // Load maintenance dashboard data
      await this.loadMaintenanceDashboardData();
    }
  }

  async loadSuperAdminDashboardData() {
    try {
      console.log('Loading super admin dashboard data...');
      
      // Load platform analytics, HOAs, and user data
      const [analyticsResponse, hoasResponse, usersResponse] = await Promise.all([
        fetch('/api/platform/analytics', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('/api/platform/hoas', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('/api/platform/users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (analyticsResponse.ok && hoasResponse.ok && usersResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        const hoasData = await hoasResponse.json();
        const usersData = await usersResponse.json();
        
        console.log('Super admin dashboard data loaded:', { analyticsData, hoasData, usersData });
        this.updatePlatformStatistics(analyticsData);
        this.updateTopHoas(hoasData.hoas || []);
        this.updateSystemHealth(analyticsData.system_health);
        this.updateRecentPlatformActivity();
        this.renderRevenueChart(analyticsData.revenue_by_month || []);
        this.renderGrowthChart(analyticsData.user_growth || []);
      } else {
        console.error('Failed to load super admin dashboard data');
        this.showErrorMessage();
      }
    } catch (error) {
      console.error('Error loading super admin dashboard:', error);
      this.showErrorMessage();
    }
  }

  async loadAdminDashboardData() {
    try {
      console.log('Loading admin dashboard data...');
      
      const response = await fetch('/api/dashboard/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Admin dashboard stats loaded:', data);
        this.updateAdminStatistics(data);
        this.updateAdminActivities(data.recent_activities || []);
      } else {
        console.error('Failed to load admin dashboard stats:', response.status);
        this.showErrorMessage();
      }
    } catch (error) {
      console.error('Error loading admin dashboard:', error);
      this.showErrorMessage();
    }
  }

  async loadResidentDashboardData() {
    try {
      console.log('Loading resident dashboard data...');
      
      // Load community announcements and resident-specific data
      const response = await fetch('/api/dashboard/resident', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Resident dashboard data loaded:', data);
        this.updateResidentAnnouncements(data.announcements || []);
      } else {
        // Fallback to general stats if resident endpoint doesn't exist
        console.log('Resident endpoint not available, using general stats');
        const statsResponse = await fetch('/api/dashboard/stats', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          this.updateResidentAnnouncements(statsData.recent_activities || []);
        }
      }
    } catch (error) {
      console.error('Error loading resident dashboard:', error);
      this.showErrorMessage();
    }
  }

  async loadMaintenanceDashboardData() {
    try {
      console.log('Loading maintenance dashboard data...');
      
      // Load maintenance schedule and requests data
      const [scheduleResponse, requestsResponse] = await Promise.all([
        fetch('/api/maintenance/schedule', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('/api/maintenance/requests', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (scheduleResponse.ok && requestsResponse.ok) {
        const scheduleData = await scheduleResponse.json();
        const requestsData = await requestsResponse.json();
        
        console.log('Maintenance dashboard data loaded:', { scheduleData, requestsData });
        this.updateMaintenanceStatistics(scheduleData, requestsData);
        this.updateTodaySchedule(scheduleData.schedule || []);
        this.updateUrgentRequests(requestsData.requests || []);
        this.updateVendorPerformance(scheduleData.vendors || []);
        this.updateMaintenanceCosts(scheduleData, requestsData);
        this.updateMaintenanceActivity(scheduleData, requestsData);
      } else {
        console.error('Failed to load maintenance dashboard data');
        this.showErrorMessage();
      }
    } catch (error) {
      console.error('Error loading maintenance dashboard:', error);
      this.showErrorMessage();
    }
  }

  updateMaintenanceStatistics(scheduleData, requestsData) {
    const schedule = scheduleData.schedule || [];
    const requests = requestsData.requests || [];
    
    // Create statistics cards
    const statsContainer = document.getElementById('stats-cards');
    if (!statsContainer) return;

    const stats = {
      total_scheduled: schedule.length,
      urgent_requests: requests.filter(r => r.priority === 'High' && r.status !== 'Completed').length,
      completed_today: requests.filter(r => {
        const today = new Date().toDateString();
        return r.status === 'Completed' && new Date(r.submitted_date).toDateString() === today;
      }).length,
      active_vendors: scheduleData.vendors?.length || 0
    };

    statsContainer.innerHTML = `
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100">
            <i class="fas fa-calendar-check text-blue-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600" data-en="Scheduled Tasks" data-sw="Kazi Zilizopangwa">Scheduled Tasks</p>
            <p class="text-2xl font-semibold text-gray-900">${stats.total_scheduled}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-red-100">
            <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600" data-en="Urgent Requests" data-sw="Maombi ya Dharura">Urgent Requests</p>
            <p class="text-2xl font-semibold text-gray-900">${stats.urgent_requests}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100">
            <i class="fas fa-check-circle text-green-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600" data-en="Completed Today" data-sw="Zilizokamilika Leo">Completed Today</p>
            <p class="text-2xl font-semibold text-gray-900">${stats.completed_today}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100">
            <i class="fas fa-users-cog text-purple-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600" data-en="Active Vendors" data-sw="Wauzaji Hai">Active Vendors</p>
            <p class="text-2xl font-semibold text-gray-900">${stats.active_vendors}</p>
          </div>
        </div>
      </div>
    `;
    
    // Apply current language to the newly added elements
    this.updateLanguage();
  }

  updateTodaySchedule(schedule) {
    const container = document.getElementById('today-schedule');
    if (!container) return;

    const today = new Date();
    const todaySchedule = schedule.filter(item => {
      const scheduleDate = new Date(item.scheduled_date);
      return scheduleDate.toDateString() === today.toDateString();
    });

    if (todaySchedule.length === 0) {
      container.innerHTML = `
        <div class="text-center text-gray-500 py-6">
          <i class="fas fa-calendar-day text-2xl mb-2"></i>
          <p>No scheduled tasks for today</p>
        </div>
      `;
      return;
    }

    container.innerHTML = todaySchedule.map(item => `
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div class="flex-1">
          <h4 class="font-medium text-gray-900">${item.title}</h4>
          <p class="text-sm text-gray-600">${item.location}</p>
          <p class="text-xs text-gray-500">${new Date(item.scheduled_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
        </div>
        <div class="flex items-center space-x-2">
          <span class="px-2 py-1 text-xs rounded-full ${item.priority === 'High' ? 'bg-red-100 text-red-800' : item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}">
            ${item.priority}
          </span>
          <button class="text-blue-600 hover:text-blue-800 text-sm">
            <i class="fas fa-eye"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  updateUrgentRequests(requests) {
    const container = document.getElementById('urgent-requests');
    if (!container) return;

    const urgentRequests = requests.filter(r => 
      r.priority === 'High' && !['Completed'].includes(r.status)
    );

    if (urgentRequests.length === 0) {
      container.innerHTML = `
        <div class="text-center text-gray-500 py-6">
          <i class="fas fa-check-circle text-2xl mb-2"></i>
          <p>No urgent requests</p>
        </div>
      `;
      return;
    }

    container.innerHTML = urgentRequests.map(request => `
      <div class="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
        <div class="flex-1">
          <h4 class="font-medium text-gray-900">${request.title}</h4>
          <p class="text-sm text-gray-600">${request.unit_number} • ${request.category}</p>
          <p class="text-xs text-gray-500">${new Date(request.submitted_date).toLocaleDateString()}</p>
        </div>
        <div class="flex items-center space-x-2">
          <span class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
            ${request.status}
          </span>
          <button class="text-blue-600 hover:text-blue-800 text-sm">
            <i class="fas fa-edit"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  updateVendorPerformance(vendors) {
    const container = document.getElementById('vendor-performance');
    if (!container) return;

    if (vendors.length === 0) {
      container.innerHTML = `
        <div class="text-center text-gray-500 py-6">
          <i class="fas fa-users-cog text-2xl mb-2"></i>
          <p>No vendors registered</p>
        </div>
      `;
      return;
    }

    // Show top 3 vendors by rating
    const topVendors = vendors.sort((a, b) => b.rating - a.rating).slice(0, 3);

    container.innerHTML = topVendors.map(vendor => `
      <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
        <div class="flex-1">
          <h4 class="font-medium text-gray-900">${vendor.name}</h4>
          <p class="text-sm text-gray-600">${vendor.category}</p>
          <div class="flex items-center space-x-1 mt-1">
            ${Array.from({length: 5}, (_, i) => `
              <i class="fas fa-star text-xs ${i < Math.floor(vendor.rating) ? 'text-yellow-400' : 'text-gray-300'}"></i>
            `).join('')}
            <span class="text-xs text-gray-600 ml-1">${vendor.rating}</span>
          </div>
        </div>
        <div class="text-right">
          <div class="text-sm font-medium text-green-600">${vendor.active_contracts} contracts</div>
          <div class="text-xs text-gray-500">KES ${vendor.hourly_rate}/hour</div>
        </div>
      </div>
    `).join('');
  }

  updateMaintenanceCosts(scheduleData, requestsData) {
    const container = document.getElementById('maintenance-costs');
    if (!container) return;

    const schedule = scheduleData.schedule || [];
    const requests = requestsData.requests || [];

    const monthlyCosts = {
      scheduled: schedule.reduce((sum, item) => sum + (item.estimated_cost || 0), 0),
      requests: requests.reduce((sum, item) => sum + (item.estimated_cost || 0), 0)
    };

    const total = monthlyCosts.scheduled + monthlyCosts.requests;

    container.innerHTML = `
      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">Scheduled Maintenance</span>
          <span class="font-medium">KES ${monthlyCosts.scheduled.toLocaleString()}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">Work Orders</span>
          <span class="font-medium">KES ${monthlyCosts.requests.toLocaleString()}</span>
        </div>
        <div class="border-t pt-2">
          <div class="flex justify-between items-center">
            <span class="font-medium text-gray-900">Total Estimated</span>
            <span class="font-bold text-blue-600">KES ${total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    `;
  }

  updateMaintenanceActivity(scheduleData, requestsData) {
    const container = document.getElementById('recent-activity');
    if (!container) return;

    // Combine recent activities from schedule and requests
    const activities = [];
    
    // Add recent schedule items
    scheduleData.schedule?.forEach(item => {
      activities.push({
        type: 'schedule',
        message: `Scheduled: ${item.title} - ${item.location}`,
        timestamp: item.scheduled_date,
        user: item.assigned_vendor || 'System'
      });
    });

    // Add recent requests
    requestsData.requests?.forEach(request => {
      activities.push({
        type: 'request',
        message: `${request.status}: ${request.title} - ${request.unit_number}`,
        timestamp: request.submitted_date,
        user: request.resident_name
      });
    });

    // Sort by timestamp and take latest 5
    const recentActivities = activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);

    if (recentActivities.length === 0) {
      container.innerHTML = `
        <div class="text-center text-gray-500 py-6">
          <i class="fas fa-history text-2xl mb-2"></i>
          <p>No recent activity</p>
        </div>
      `;
      return;
    }

    container.innerHTML = recentActivities.map(activity => `
      <div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
        <div class="p-2 rounded-full ${activity.type === 'schedule' ? 'bg-blue-100' : 'bg-orange-100'}">
          <i class="fas ${activity.type === 'schedule' ? 'fa-calendar' : 'fa-wrench'} text-sm ${activity.type === 'schedule' ? 'text-blue-600' : 'text-orange-600'}"></i>
        </div>
        <div class="flex-1">
          <p class="text-sm text-gray-900">${activity.message}</p>
          <p class="text-xs text-gray-500">${activity.user} • ${new Date(activity.timestamp).toLocaleString()}</p>
        </div>
      </div>
    `).join('');
  }

  updateAdminStatistics(data) {
    // Update metrics
    this.updateElement('total-properties', data.total_properties || '--');
    this.updateElement('total-residents', data.total_residents || '--');
    this.updateElement('monthly-revenue', `KES ${(data.monthly_revenue || 0).toLocaleString()}`);
    this.updateElement('pending-issues', (data.pending_maintenance || 0) + (data.overdue_payments || 0));
  }

  updateAdminActivities(activities) {
    const activitiesContainer = document.getElementById('admin-activities');
    if (!activitiesContainer) return;

    if (!activities || activities.length === 0) {
      activitiesContainer.innerHTML = `
        <div class="text-center text-gray-500 py-4">
          <i class="fas fa-inbox text-2xl mb-2"></i>
          <p>No recent activities</p>
        </div>
      `;
      return;
    }

    activitiesContainer.innerHTML = activities.map(activity => `
      <div class="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="text-sm text-gray-900">${activity.message}</p>
            <p class="text-xs text-gray-500 mt-1">${activity.user} • ${new Date(activity.timestamp).toLocaleString()}</p>
          </div>
          <span class="px-2 py-1 text-xs rounded-full ${this.getActivityColor(activity.type)}">
            ${activity.type}
          </span>
        </div>
      </div>
    `).join('');
  }

  updateResidentAnnouncements(announcements) {
    const announcementsContainer = document.getElementById('resident-announcements');
    if (!announcementsContainer) return;

    if (!announcements || announcements.length === 0) {
      announcementsContainer.innerHTML = `
        <div class="text-center text-gray-500 py-4">
          <i class="fas fa-bullhorn text-2xl mb-2"></i>
          <p>No announcements at this time</p>
        </div>
      `;
      return;
    }

    announcementsContainer.innerHTML = announcements.map(announcement => `
      <div class="p-4 bg-teal-50 rounded-lg border-l-4 border-teal-500">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="text-sm text-gray-900">${announcement.message}</p>
            <p class="text-xs text-teal-600 mt-1">${announcement.user} • ${new Date(announcement.timestamp).toLocaleString()}</p>
          </div>
          <span class="px-2 py-1 text-xs bg-teal-100 text-teal-800 rounded-full">
            ${announcement.type || 'announcement'}
          </span>
        </div>
      </div>
    `).join('');
  }

  getActivityColor(type) {
    const colors = {
      'payment': 'bg-green-100 text-green-800',
      'maintenance': 'bg-orange-100 text-orange-800',
      'announcement': 'bg-blue-100 text-blue-800',
      'resident': 'bg-purple-100 text-purple-800',
      'document': 'bg-indigo-100 text-indigo-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  }

  updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  }

  // SUPER ADMIN UPDATE METHODS
  
  updatePlatformStatistics(analyticsData) {
    const statsContainer = document.getElementById('platform-stats');
    if (!statsContainer) return;

    const overview = analyticsData.platform_overview;
    const growth = overview.monthly_growth;

    statsContainer.innerHTML = `
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100">
            <i class="fas fa-building text-purple-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600" data-en="Total HOAs" data-sw="Jumla ya HOA">Total HOAs</p>
            <p class="text-2xl font-semibold text-gray-900">${overview.total_hoas}</p>
            <p class="text-xs text-green-600">+${growth.hoas}% this month</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100">
            <i class="fas fa-users text-blue-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600" data-en="Total Users" data-sw="Jumla ya Watumiaji">Total Users</p>
            <p class="text-2xl font-semibold text-gray-900">${overview.total_residents.toLocaleString()}</p>
            <p class="text-xs text-green-600">+${growth.users}% this month</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100">
            <i class="fas fa-money-bill-wave text-green-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600" data-en="Monthly Revenue" data-sw="Mapato ya Kila Mwezi">Monthly Revenue</p>
            <p class="text-2xl font-semibold text-gray-900">KES ${overview.total_revenue.toLocaleString()}</p>
            <p class="text-xs text-green-600">+${growth.revenue}% this month</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-orange-100">
            <i class="fas fa-home text-orange-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600" data-en="Total Properties" data-sw="Jumla ya Mali">Total Properties</p>
            <p class="text-2xl font-semibold text-gray-900">${overview.total_properties.toLocaleString()}</p>
            <p class="text-xs text-green-600">+${growth.properties}% this month</p>
          </div>
        </div>
      </div>
    `;
    
    // Apply current language to the newly added elements
    this.updateLanguage();
  }
  
  updateTopHoas(hoas) {
    const container = document.getElementById('top-hoas');
    if (!container) return;

    const topHoas = hoas.slice(0, 5); // Top 5 HOAs by revenue
    
    if (topHoas.length === 0) {
      container.innerHTML = `
        <div class="text-center text-gray-500 py-6">
          <i class="fas fa-building text-2xl mb-2"></i>
          <p>No HOAs available</p>
        </div>
      `;
      return;
    }

    container.innerHTML = topHoas.map((hoa, index) => {
      const rankColors = ['text-yellow-600', 'text-gray-600', 'text-orange-600', 'text-blue-600', 'text-green-600'];
      const rankIcons = ['fa-crown', 'fa-medal', 'fa-trophy', 'fa-star', 'fa-certificate'];
      
      return `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div class="flex items-center space-x-3">
            <div class="p-2 rounded-full bg-white">
              <i class="fas ${rankIcons[index]} ${rankColors[index]}"></i>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">${hoa.name}</p>
              <p class="text-xs text-gray-500">${hoa.location} • ${hoa.total_properties} units</p>
              <p class="text-xs text-green-600">${hoa.occupancy_rate}% occupancy</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm font-semibold text-gray-900">KES ${hoa.monthly_revenue.toLocaleString()}</p>
            <p class="text-xs text-gray-500">${hoa.subscription_plan}</p>
          </div>
        </div>
      `;
    }).join('');
  }
  
  updateSystemHealth(healthData) {
    const container = document.getElementById('system-health');
    if (!container) return;

    const getHealthColor = (status) => {
      if (status === 'Healthy' || status.includes('99.')) return 'text-green-600';
      if (status.includes('95.') || status.includes('98.')) return 'text-yellow-600';
      return 'text-red-600';
    };

    container.innerHTML = `
      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">Database</span>
          <span class="text-sm font-medium ${getHealthColor(healthData.database)}">${healthData.database}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">API Response Time</span>
          <span class="text-sm font-medium ${getHealthColor(healthData.api_response_time)}">${healthData.api_response_time}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">Uptime</span>
          <span class="text-sm font-medium ${getHealthColor(healthData.uptime)}">${healthData.uptime}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">Active Sessions</span>
          <span class="text-sm font-medium text-blue-600">${healthData.active_sessions}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">Error Rate</span>
          <span class="text-sm font-medium ${getHealthColor(healthData.error_rate)}">${healthData.error_rate}</span>
        </div>
      </div>
    `;
  }
  
  updateRecentPlatformActivity() {
    const container = document.getElementById('recent-activity');
    if (!container) return;

    // Mock recent platform activities
    const activities = [
      {
        type: 'hoa_created',
        message: 'New HOA "Lavington Heights" created',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        user: 'Super Admin'
      },
      {
        type: 'user_registered',
        message: 'New admin user registered in Riverside Towers',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        user: 'System'
      },
      {
        type: 'subscription_upgraded',
        message: 'Garden Estate upgraded to Premium plan',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        user: 'Billing System'
      },
      {
        type: 'support_ticket',
        message: 'New support ticket from Kileleshwa Villas',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        user: 'Support System'
      },
      {
        type: 'system_backup',
        message: 'Daily system backup completed successfully',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        user: 'System'
      }
    ];

    container.innerHTML = activities.map(activity => {
      const getActivityIcon = (type) => {
        const icons = {
          'hoa_created': 'fa-plus-circle text-green-600',
          'user_registered': 'fa-user-plus text-blue-600',
          'subscription_upgraded': 'fa-arrow-up text-purple-600',
          'support_ticket': 'fa-question-circle text-orange-600',
          'system_backup': 'fa-database text-gray-600'
        };
        return icons[type] || 'fa-info-circle text-gray-600';
      };
      
      return `
        <div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
          <div class="p-2 rounded-full bg-white">
            <i class="fas ${getActivityIcon(activity.type)}"></i>
          </div>
          <div class="flex-1">
            <p class="text-sm text-gray-900">${activity.message}</p>
            <p class="text-xs text-gray-500">${activity.user} • ${activity.timestamp.toLocaleString()}</p>
          </div>
        </div>
      `;
    }).join('');
  }
  
  renderRevenueChart(revenueData) {
    const canvas = document.getElementById('revenue-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: revenueData.map(item => item.month),
        datasets: [{
          label: 'Platform Revenue (KES)',
          data: revenueData.map(item => item.revenue),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return 'KES ' + value.toLocaleString();
              }
            }
          }
        }
      }
    });
  }
  
  renderGrowthChart(userData) {
    const canvas = document.getElementById('growth-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: userData.map(item => item.month),
        datasets: [{
          label: 'Platform Users',
          data: userData.map(item => item.users),
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  setupEventListeners() {
    // Language switching buttons
    const langEn = document.getElementById('lang-en');
    const langSw = document.getElementById('lang-sw');
    
    if (langEn) {
      langEn.addEventListener('click', () => this.switchLanguage('en'));
    }
    if (langSw) {
      langSw.addEventListener('click', () => this.switchLanguage('sw'));
    }

    // Language switching
    window.switchLanguage = (lang) => {
      this.switchLanguage(lang);
    };

    // Logout functionality
    window.logout = () => {
      AuthUtils.logout();
    };

    // Modal functionality
    window.openModal = (type) => {
      this.openModal(type);
    };
    
    // Initialize language interface
    this.updateLanguageButtons();
    this.updateLanguage();
  }
  
  switchLanguage(lang) {
    this.currentLanguage = lang;
    localStorage.setItem('kenyahoa_language', lang);
    this.updateLanguageButtons();
    this.updateLanguage();
  }
  
  updateLanguageButtons() {
    const langEn = document.getElementById('lang-en');
    const langSw = document.getElementById('lang-sw');
    
    if (langEn && langSw) {
      if (this.currentLanguage === 'en') {
        langEn.classList.add('bg-gray-300');
        langEn.classList.remove('hover:bg-gray-200');
        langSw.classList.remove('bg-gray-300');
        langSw.classList.add('hover:bg-gray-200');
      } else {
        langSw.classList.add('bg-gray-300');
        langSw.classList.remove('hover:bg-gray-200');
        langEn.classList.remove('bg-gray-300');
        langEn.classList.add('hover:bg-gray-200');
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
      } else if (englishText) {
        element.textContent = englishText;
      }
    });
  }

  updateLanguageInterface() {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
      const key = element.getAttribute('data-translate');
      const translation = this.translations[this.currentLanguage]?.[key] || key;
      element.textContent = translation;
    });

    // Also update data-en/data-sw elements
    this.updateLanguage();
    this.updateLanguageButtons();
  }

  async openModal(type) {
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalContent = document.getElementById('modal-content');
    
    if (!modalBackdrop || !modalContent) return;

    // Show loading first
    modalContent.innerHTML = `
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">${this.getModalTitle(type)}</h3>
          <button onclick="window.dashboard.closeModal()" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="text-center py-8">
          <i class="fas fa-spinner loading-spinner text-4xl text-gray-300 mb-4"></i>
          <p class="text-gray-600">Loading...</p>
        </div>
      </div>
    `;

    modalBackdrop.classList.remove('hidden');

    // Load actual data based on modal type
    try {
      const content = await this.getModalContent(type);
      modalContent.innerHTML = content;
    } catch (error) {
      console.error('Error loading modal content:', error);
      modalContent.innerHTML = `
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">${this.getModalTitle(type)}</h3>
            <button onclick="window.dashboard.closeModal()" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="text-center py-8">
            <i class="fas fa-exclamation-triangle text-4xl text-red-300 mb-4"></i>
            <p class="text-gray-600 mb-4">Error loading data</p>
            <p class="text-sm text-gray-500">Please try again later.</p>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button onclick="window.dashboard.closeModal()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors">
              Close
            </button>
          </div>
        </div>
      `;
    }
  }

  async getModalContent(type) {
    switch (type) {
      case 'maintenance-requests':
        return await this.getMaintenanceRequestsContent();
      case 'maintenance-schedule':
        return await this.getMaintenanceScheduleContent();
      case 'maintenance-vendors':
        return await this.getMaintenanceVendorsContent();
      case 'maintenance-inventory':
        return this.getComingSoonContent('maintenance-inventory');
      case 'maintenance-reports':
        return this.getComingSoonContent('maintenance-reports');
      case 'create-hoa':
        return await this.getCreateHoaContent();
      case 'manage-hoas':
        return await this.getManageHoasContent();
      case 'platform-users':
        return await this.getPlatformUsersContent();
      case 'system-settings':
        return this.getComingSoonContent('system-settings');
      case 'properties':
        return await this.getPropertiesManagementContent();
      case 'financial-reports':
        return await this.getFinancialReportsContent();
      case 'payment-tracking':
        return await this.getPaymentTrackingContent();
      case 'residents':
        return await this.getResidentDirectoryContent();
      case 'documents':
      case 'hoa-documents':
        return await this.getDocumentLibraryContent();
      case 'directory':
        return await this.getResidentDirectoryContent();
      case 'payment-history':
        return await this.getPaymentHistoryContent();
      case 'my-requests':
        return await this.getMyRequestsContent();
      case 'account-balance':
        return await this.getAccountBalanceContent();
      case 'events':
        return await this.getCommunityEventsContent();
      case 'occupancy':
        return await this.getOccupancyContent();
      case 'communications':
        return await this.getCommunicationsContent();
      default:
        return this.getComingSoonContent(type);
    }
  }

  async getMaintenanceRequestsContent() {
    const response = await fetch('/api/maintenance/requests', {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    const data = await response.json();

    if (!data.success) throw new Error('Failed to load maintenance requests');

    const requests = data.requests || [];
    const statusColors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800',
      'Scheduled': 'bg-purple-100 text-purple-800'
    };

    return `
      <div class="p-6 max-w-4xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900">Maintenance Requests</h3>
          <button onclick="window.dashboard.closeModal()" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-yellow-50 p-3 rounded-lg">
            <div class="text-2xl font-bold text-yellow-600">${data.by_status.pending}</div>
            <div class="text-sm text-yellow-600">Pending</div>
          </div>
          <div class="bg-blue-50 p-3 rounded-lg">
            <div class="text-2xl font-bold text-blue-600">${data.by_status.in_progress}</div>
            <div class="text-sm text-blue-600">In Progress</div>
          </div>
          <div class="bg-green-50 p-3 rounded-lg">
            <div class="text-2xl font-bold text-green-600">${data.by_status.completed}</div>
            <div class="text-sm text-green-600">Completed</div>
          </div>
          <div class="bg-purple-50 p-3 rounded-lg">
            <div class="text-2xl font-bold text-purple-600">${data.by_status.scheduled}</div>
            <div class="text-sm text-purple-600">Scheduled</div>
          </div>
        </div>

        <div class="max-h-96 overflow-y-auto space-y-4">
          ${requests.map(request => `
            <div class="border rounded-lg p-4 hover:bg-gray-50">
              <div class="flex items-start justify-between mb-2">
                <h4 class="font-semibold text-gray-900">${request.title}</h4>
                <span class="px-2 py-1 text-xs rounded-full ${statusColors[request.status] || 'bg-gray-100 text-gray-800'}">
                  ${request.status}
                </span>
              </div>
              <p class="text-gray-600 text-sm mb-2">${request.description}</p>
              <div class="grid grid-cols-2 gap-4 text-sm text-gray-500">
                <div><strong>Unit:</strong> ${request.unit_number}</div>
                <div><strong>Category:</strong> ${request.category}</div>
                <div><strong>Priority:</strong> ${request.priority}</div>
                <div><strong>Cost:</strong> KES ${request.estimated_cost?.toLocaleString() || 'TBD'}</div>
              </div>
              ${request.assigned_to ? `<div class="text-sm text-gray-500 mt-2"><strong>Assigned to:</strong> ${request.assigned_to}</div>` : ''}
              ${request.notes ? `<div class="text-sm text-blue-600 mt-2 italic">${request.notes}</div>` : ''}
            </div>
          `).join('')}
        </div>

        <div class="flex justify-end mt-6">
          <button onclick="window.dashboard.closeModal()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Close
          </button>
        </div>
      </div>
    `;
  }

  async getFinancialReportsContent() {
    const response = await fetch('/api/financial/reports', {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    const data = await response.json();

    if (!data.success) throw new Error('Failed to load financial reports');

    const financial = data.financial_summary;
    const expenses = data.expenses || [];
    
    // Calculate total expenses from the expenses array
    const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

    return `
      <div class="p-6 max-w-4xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900">Financial Reports</h3>
          <button onclick="window.dashboard.closeModal()" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-green-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-green-600">KES ${financial.monthly_revenue?.toLocaleString() || '0'}</div>
            <div class="text-sm text-green-600">Monthly Revenue</div>
          </div>
          <div class="bg-red-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-red-600">KES ${totalExpenses.toLocaleString()}</div>
            <div class="text-sm text-red-600">Monthly Expenses</div>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-blue-600">KES ${financial.net_income?.toLocaleString() || '0'}</div>
            <div class="text-sm text-blue-600">Net Income</div>
          </div>
          <div class="bg-orange-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-orange-600">KES ${financial.outstanding_dues?.toLocaleString() || '0'}</div>
            <div class="text-sm text-orange-600">Outstanding</div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- Expense Breakdown -->
          <div class="bg-white border rounded-lg p-4">
            <h4 class="text-lg font-semibold mb-4 flex items-center">
              <i class="fas fa-chart-pie text-red-600 mr-2"></i>
              Expense Breakdown
            </h4>
            <div class="space-y-3">
              ${expenses.map(expense => `
                <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <span class="font-medium text-gray-900">${expense.category}</span>
                    <span class="text-sm text-gray-600 block">${expense.vendor}</span>
                  </div>
                  <div class="text-right">
                    <div class="font-semibold text-red-600">KES ${expense.amount?.toLocaleString()}</div>
                    <div class="text-xs text-gray-500">${Math.round((expense.amount / totalExpenses) * 100)}%</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Recent Expenses -->
          <div class="bg-white border rounded-lg p-4">
            <h4 class="text-lg font-semibold mb-4 flex items-center">
              <i class="fas fa-receipt text-purple-600 mr-2"></i>
              Recent Expenses
            </h4>
            <div class="max-h-64 overflow-y-auto space-y-3">
              ${expenses.map(expense => `
                <div class="border rounded-lg p-3 hover:bg-gray-50">
                  <div class="flex justify-between items-start">
                    <div>
                      <h5 class="font-medium text-gray-900">${expense.description}</h5>
                      <p class="text-sm text-gray-600">${expense.vendor} • ${expense.category}</p>
                    </div>
                    <div class="text-right">
                      <div class="font-semibold text-red-600">KES ${expense.amount?.toLocaleString()}</div>
                      <div class="text-xs text-gray-500">${new Date(expense.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Financial Summary -->
        <div class="bg-white border rounded-lg p-4">
          <h4 class="text-lg font-semibold mb-4 flex items-center">
            <i class="fas fa-calculator text-blue-600 mr-2"></i>
            Financial Summary
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <div class="text-sm text-green-600 font-medium">Revenue</div>
              <div class="text-2xl font-bold text-green-700">KES ${financial.monthly_revenue?.toLocaleString() || '0'}</div>
            </div>
            <div class="text-center p-4 bg-red-50 rounded-lg">
              <div class="text-sm text-red-600 font-medium">Expenses</div>
              <div class="text-2xl font-bold text-red-700">KES ${totalExpenses.toLocaleString()}</div>
            </div>
            <div class="text-center p-4 ${financial.net_income >= 0 ? 'bg-blue-50' : 'bg-orange-50'} rounded-lg">
              <div class="text-sm ${financial.net_income >= 0 ? 'text-blue-600' : 'text-orange-600'} font-medium">Net Income</div>
              <div class="text-2xl font-bold ${financial.net_income >= 0 ? 'text-blue-700' : 'text-orange-700'}">
                KES ${financial.net_income?.toLocaleString() || '0'}
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end mt-6">
          <button onclick="window.dashboard.closeModal()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Close
          </button>
        </div>
      </div>
    `;
  }

  async getResidentDirectoryContent() {
    const response = await fetch('/api/residents/directory', {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    const data = await response.json();

    if (!data.success) throw new Error('Failed to load resident directory');

    const residents = data.residents || [];

    return `
      <div class="p-6 max-w-4xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900">Resident Directory</h3>
          <button onclick="window.dashboard.closeModal()" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-blue-600">${data.total_residents}</div>
            <div class="text-sm text-blue-600">Total Residents</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-green-600">${data.owners}</div>
            <div class="text-sm text-green-600">Owners</div>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-purple-600">${data.tenants}</div>
            <div class="text-sm text-purple-600">Tenants</div>
          </div>
        </div>

        <div class="max-h-96 overflow-y-auto">
          <div class="grid gap-4">
            ${residents.map(resident => `
              <div class="border rounded-lg p-4 hover:bg-gray-50">
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="font-semibold text-gray-900">${resident.name}</h4>
                    <p class="text-sm text-gray-600">Unit ${resident.unit} • ${resident.role}</p>
                    <p class="text-sm text-gray-500">
                      <i class="fas fa-phone mr-1"></i>${resident.phone}
                    </p>
                    <p class="text-sm text-gray-500">
                      <i class="fas fa-envelope mr-1"></i>${resident.email}
                    </p>
                  </div>
                  <div class="text-right text-sm text-gray-500">
                    <div>Family: ${resident.family} ${resident.family === 1 ? 'person' : 'people'}</div>
                    <div>Since: ${new Date(resident.moveInDate).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="flex justify-end mt-6">
          <button onclick="window.dashboard.closeModal()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Close
          </button>
        </div>
      </div>
    `;
  }

  async getDocumentLibraryContent() {
    const response = await fetch('/api/documents/library', {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    const data = await response.json();

    if (!data.success) throw new Error('Failed to load document library');

    const categories = data.document_categories || [];

    return `
      <div class="p-6 max-w-4xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900">Document Library</h3>
          <button onclick="window.dashboard.closeModal()" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div class="max-h-96 overflow-y-auto space-y-6">
          ${categories.map(category => `
            <div>
              <h4 class="text-lg font-semibold text-gray-900 mb-3">${category.category}</h4>
              <div class="space-y-2">
                ${category.documents.map(doc => `
                  <div class="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-3">
                        <i class="fas fa-file-pdf text-red-500"></i>
                        <div>
                          <h5 class="font-medium text-gray-900">${doc.name}</h5>
                          <p class="text-sm text-gray-500">${doc.description}</p>
                        </div>
                      </div>
                      <div class="text-right text-sm text-gray-500">
                        <div>${doc.size}</div>
                        <div>${new Date(doc.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        <div class="flex justify-end mt-6">
          <button onclick="window.dashboard.closeModal()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Close
          </button>
        </div>
      </div>
    `;
  }

  async getPaymentHistoryContent() {
    const response = await fetch('/api/residents/my-account', {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    const data = await response.json();

    if (!data.success) throw new Error('Failed to load payment history');

    const account = data.account_info;
    const payments = account.payment_history || [];

    return `
      <div class="p-6 max-w-3xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900">Payment History</h3>
          <button onclick="window.dashboard.closeModal()" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div class="bg-blue-50 p-4 rounded-lg mb-6">
          <h4 class="font-semibold text-blue-900">Account Summary</h4>
          <div class="grid grid-cols-2 gap-4 mt-2">
            <div>
              <span class="text-sm text-blue-700">Unit:</span>
              <span class="font-medium text-blue-900">${account.unit_number}</span>
            </div>
            <div>
              <span class="text-sm text-blue-700">Balance:</span>
              <span class="font-medium ${account.account_balance > 0 ? 'text-red-600' : 'text-green-600'}">
                KES ${Math.abs(account.account_balance || 0).toLocaleString()}
                ${account.account_balance > 0 ? ' (Overdue)' : ' (Paid Up)'}
              </span>
            </div>
          </div>
        </div>

        <div class="max-h-64 overflow-y-auto space-y-3">
          ${payments.length > 0 ? payments.map(payment => `
            <div class="border rounded-lg p-3 hover:bg-gray-50">
              <div class="flex justify-between items-start">
                <div>
                  <h5 class="font-medium text-gray-900">${payment.type}</h5>
                  <p class="text-sm text-gray-600">Unit ${payment.unit}</p>
                </div>
                <div class="text-right">
                  <div class="font-semibold text-green-600">KES ${payment.amount.toLocaleString()}</div>
                  <div class="text-xs text-gray-500">${new Date(payment.date).toLocaleDateString()}</div>
                  <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">${payment.status}</span>
                </div>
              </div>
            </div>
          `).join('') : '<div class="text-center text-gray-500 py-8">No payment history found</div>'}
        </div>

        <div class="flex justify-end mt-6">
          <button onclick="window.dashboard.closeModal()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Close
          </button>
        </div>
      </div>
    `;
  }

  async getPropertiesManagementContent() {
    const response = await fetch('/api/residents/directory', {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    const data = await response.json();

    if (!data.success) throw new Error('Failed to load properties data');

    const residents = data.residents || [];
    const totalUnits = Math.ceil(residents.length * 1.2); // Mock calculation
    const occupiedUnits = residents.length;
    const vacantUnits = totalUnits - occupiedUnits;

    // Group residents by unit for property overview
    const propertyTypes = {
      'Apartment': Math.floor(totalUnits * 0.6),
      'Townhouse': Math.floor(totalUnits * 0.3),
      'Villa': Math.floor(totalUnits * 0.1)
    };

    return `
      <div class="p-6 max-w-5xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900">Property Management</h3>
          <button onclick="window.dashboard.closeModal()" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-blue-600">${totalUnits}</div>
            <div class="text-sm text-blue-600">Total Properties</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-green-600">${occupiedUnits}</div>
            <div class="text-sm text-green-600">Occupied</div>
          </div>
          <div class="bg-orange-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-orange-600">${vacantUnits}</div>
            <div class="text-sm text-orange-600">Vacant</div>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-purple-600">${Math.round((occupiedUnits/totalUnits)*100)}%</div>
            <div class="text-sm text-purple-600">Occupancy</div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div class="bg-white border rounded-lg p-4">
            <h4 class="font-semibold text-gray-900 mb-4">Property Types</h4>
            <div class="space-y-3">
              ${Object.entries(propertyTypes).map(([type, count]) => `
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span class="font-medium">${type}</span>
                  <span class="text-gray-600">${count} units</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="bg-white border rounded-lg p-4">
            <h4 class="font-semibold text-gray-900 mb-4">Property Actions</h4>
            <div class="space-y-3">
              <button class="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
                <div class="flex items-center justify-between">
                  <div>
                    <h5 class="font-medium text-blue-800">Add New Property</h5>
                    <p class="text-sm text-blue-600">Register a new unit or property</p>
                  </div>
                  <i class="fas fa-plus text-blue-600"></i>
                </div>
              </button>
              <button class="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors">
                <div class="flex items-center justify-between">
                  <div>
                    <h5 class="font-medium text-green-800">Update Property Details</h5>
                    <p class="text-sm text-green-600">Edit property information and specs</p>
                  </div>
                  <i class="fas fa-edit text-green-600"></i>
                </div>
              </button>
              <button class="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
                <div class="flex items-center justify-between">
                  <div>
                    <h5 class="font-medium text-purple-800">Property Valuations</h5>
                    <p class="text-sm text-purple-600">View and update property values</p>
                  </div>
                  <i class="fas fa-chart-line text-purple-600"></i>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div class="bg-white border rounded-lg p-4">
          <h4 class="font-semibold text-gray-900 mb-4">Property Directory</h4>
          <div class="max-h-64 overflow-y-auto">
            <div class="grid gap-3">
              ${residents.map(resident => `
                <div class="border rounded-lg p-3 hover:bg-gray-50">
                  <div class="flex justify-between items-start">
                    <div>
                      <h5 class="font-semibold text-gray-900">Unit ${resident.unit}</h5>
                      <p class="text-sm text-gray-600">
                        <span class="inline-block w-2 h-2 rounded-full ${resident.role === 'Owner' ? 'bg-green-500' : 'bg-blue-500'} mr-1"></span>
                        ${resident.name} (${resident.role})
                      </p>
                      <p class="text-xs text-gray-500">Family size: ${resident.family} • Since: ${new Date(resident.moveInDate).toLocaleDateString()}</p>
                    </div>
                    <div class="text-right">
                      <span class="px-2 py-1 text-xs rounded-full ${resident.role === 'Owner' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}">
                        ${resident.role}
                      </span>
                      <div class="text-xs text-gray-500 mt-1">
                        ${resident.role === 'Owner' ? 'Owned' : 'Rented'}
                      </div>
                    </div>
                  </div>
                </div>
              `).join('')}
              ${vacantUnits > 0 ? Array.from({length: Math.min(vacantUnits, 3)}, (_, i) => `
                <div class="border rounded-lg p-3 bg-orange-50 border-orange-200">
                  <div class="flex justify-between items-center">
                    <div>
                      <h5 class="font-semibold text-orange-800">Unit ${String.fromCharCode(65 + Math.floor(Math.random() * 3))}-${String(10 + i).padStart(2, '0')}</h5>
                      <p class="text-sm text-orange-600">Available for occupancy</p>
                    </div>
                    <span class="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                      Vacant
                    </span>
                  </div>
                </div>
              `).join('') : ''}
            </div>
          </div>
        </div>

        <div class="flex justify-end mt-6">
          <button onclick="window.dashboard.closeModal()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Close
          </button>
        </div>
      </div>
    `;
  }

  async getOccupancyContent() {
    const response = await fetch('/api/residents/directory', {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    const data = await response.json();

    if (!data.success) throw new Error('Failed to load occupancy data');

    const totalUnits = Math.ceil(data.total_residents * 1.2); // Mock calculation
    const occupiedUnits = data.total_residents;
    const vacantUnits = totalUnits - occupiedUnits;
    const occupancyRate = Math.round((occupiedUnits / totalUnits) * 100);

    return `
      <div class="p-6 max-w-2xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900">Occupancy Management</h3>
          <button onclick="window.dashboard.closeModal()" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-blue-600">${totalUnits}</div>
            <div class="text-sm text-blue-600">Total Units</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-green-600">${occupiedUnits}</div>
            <div class="text-sm text-green-600">Occupied</div>
          </div>
          <div class="bg-orange-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-orange-600">${vacantUnits}</div>
            <div class="text-sm text-orange-600">Vacant</div>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-purple-600">${occupancyRate}%</div>
            <div class="text-sm text-purple-600">Occupancy Rate</div>
          </div>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-semibold mb-3">Occupancy Breakdown</h4>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span>Property Owners:</span>
              <span class="font-semibold">${data.owners} units</span>
            </div>
            <div class="flex justify-between">
              <span>Rental Units:</span>
              <span class="font-semibold">${data.tenants} units</span>
            </div>
            <div class="flex justify-between">
              <span>Vacant Units:</span>
              <span class="font-semibold text-orange-600">${vacantUnits} units</span>
            </div>
          </div>
        </div>

        <div class="flex justify-end mt-6">
          <button onclick="window.dashboard.closeModal()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Close
          </button>
        </div>
      </div>
    `;
  }

  async getPaymentTrackingContent() {
    const response = await fetch('/api/financial/payments', {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    const data = await response.json();

    if (!data.success) throw new Error('Failed to load payment tracking data');

    const payments = data.payment_history || [];
    const overduePayments = data.overdue_payments || [];
    const totalCollected = data.total_collected || 0;
    const totalOverdue = data.total_overdue || 0;

    return `
      <div class="p-6 max-w-5xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900">Payment Tracking</h3>
          <button onclick="window.dashboard.closeModal()" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-green-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-green-600">KES ${totalCollected.toLocaleString()}</div>
            <div class="text-sm text-green-600">Total Collected</div>
          </div>
          <div class="bg-red-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-red-600">KES ${totalOverdue.toLocaleString()}</div>
            <div class="text-sm text-red-600">Total Overdue</div>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-blue-600">${payments.length}</div>
            <div class="text-sm text-blue-600">Recent Payments</div>
          </div>
          <div class="bg-orange-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-orange-600">${overduePayments.length}</div>
            <div class="text-sm text-orange-600">Overdue Accounts</div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- Recent Payments -->
          <div class="bg-white border rounded-lg p-4">
            <h4 class="font-semibold text-gray-900 mb-4 flex items-center">
              <i class="fas fa-check-circle text-green-600 mr-2"></i>
              Recent Payments
            </h4>
            <div class="max-h-64 overflow-y-auto space-y-3">
              ${payments.slice(0, 8).map(payment => `
                <div class="border rounded-lg p-3 hover:bg-gray-50">
                  <div class="flex justify-between items-start">
                    <div>
                      <h5 class="font-medium text-gray-900">${payment.resident}</h5>
                      <p class="text-sm text-gray-600">Unit ${payment.unit} • ${payment.type}</p>
                      <p class="text-xs text-gray-500">${new Date(payment.date).toLocaleDateString()}</p>
                    </div>
                    <div class="text-right">
                      <div class="font-semibold text-green-600">KES ${payment.amount.toLocaleString()}</div>
                      <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">${payment.status}</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Overdue Payments -->
          <div class="bg-white border rounded-lg p-4">
            <h4 class="font-semibold text-gray-900 mb-4 flex items-center">
              <i class="fas fa-exclamation-triangle text-red-600 mr-2"></i>
              Overdue Accounts
            </h4>
            <div class="max-h-64 overflow-y-auto space-y-3">
              ${overduePayments.length > 0 ? overduePayments.map(payment => `
                <div class="border border-red-200 rounded-lg p-3 bg-red-50">
                  <div class="flex justify-between items-start">
                    <div>
                      <h5 class="font-medium text-red-900">${payment.resident}</h5>
                      <p class="text-sm text-red-700">Unit ${payment.unit} • ${payment.type}</p>
                      <p class="text-xs text-red-600">Due: ${new Date(payment.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div class="text-right">
                      <div class="font-semibold text-red-600">KES ${payment.amount.toLocaleString()}</div>
                      <span class="px-2 py-1 bg-red-200 text-red-800 text-xs rounded-full">
                        ${payment.daysOverdue} days overdue
                      </span>
                    </div>
                  </div>
                  <div class="mt-2 flex space-x-2">
                    <button class="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                      Send Reminder
                    </button>
                    <button class="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">
                      Payment Plan
                    </button>
                  </div>
                </div>
              `).join('') : '<div class="text-center text-gray-500 py-8">No overdue payments!</div>'}
            </div>
          </div>
        </div>

        <!-- Payment Management Actions -->
        <div class="bg-white border rounded-lg p-4">
          <h4 class="font-semibold text-gray-900 mb-4">Payment Management Actions</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button class="text-left p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
              <div class="flex items-center justify-between">
                <div>
                  <h5 class="font-medium text-blue-800">Record Payment</h5>
                  <p class="text-sm text-blue-600">Manually record a payment</p>
                </div>
                <i class="fas fa-plus text-blue-600"></i>
              </div>
            </button>
            <button class="text-left p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors">
              <div class="flex items-center justify-between">
                <div>
                  <h5 class="font-medium text-green-800">Generate Invoice</h5>
                  <p class="text-sm text-green-600">Create monthly invoices</p>
                </div>
                <i class="fas fa-file-invoice text-green-600"></i>
              </div>
            </button>
            <button class="text-left p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
              <div class="flex items-center justify-between">
                <div>
                  <h5 class="font-medium text-purple-800">Payment Report</h5>
                  <p class="text-sm text-purple-600">Export payment data</p>
                </div>
                <i class="fas fa-download text-purple-600"></i>
              </div>
            </button>
          </div>
        </div>

        <div class="flex justify-end mt-6">
          <button onclick="window.dashboard.closeModal()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Close
          </button>
        </div>
      </div>
    `;
  }

  getCommunicationsContent() {
    return `
      <div class="p-6 max-w-3xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900">Communications Center</h3>
          <button onclick="window.dashboard.closeModal()" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="border rounded-lg p-4">
            <h4 class="font-semibold text-gray-900 mb-3">
              <i class="fas fa-bullhorn text-blue-600 mr-2"></i>
              Send Announcement
            </h4>
            <textarea 
              class="w-full p-3 border rounded-lg mb-3" 
              rows="4" 
              placeholder="Type your announcement here..."
            ></textarea>
            <div class="flex justify-between items-center">
              <select class="border rounded px-3 py-2">
                <option>All Residents</option>
                <option>Property Owners Only</option>
                <option>Tenants Only</option>
              </select>
              <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Send
              </button>
            </div>
          </div>

          <div class="border rounded-lg p-4">
            <h4 class="font-semibold text-gray-900 mb-3">
              <i class="fas fa-envelope text-green-600 mr-2"></i>
              Email Templates
            </h4>
            <div class="space-y-2">
              <button class="w-full text-left p-2 bg-gray-50 hover:bg-gray-100 rounded">
                Payment Reminder
              </button>
              <button class="w-full text-left p-2 bg-gray-50 hover:bg-gray-100 rounded">
                Maintenance Notice
              </button>
              <button class="w-full text-left p-2 bg-gray-50 hover:bg-gray-100 rounded">
                Community Event
              </button>
              <button class="w-full text-left p-2 bg-gray-50 hover:bg-gray-100 rounded">
                Policy Update
              </button>
            </div>
          </div>
        </div>

        <div class="mt-6">
          <h4 class="font-semibold text-gray-900 mb-3">Recent Communications</h4>
          <div class="space-y-3">
            <div class="border rounded-lg p-3">
              <div class="flex justify-between items-start">
                <div>
                  <h5 class="font-medium">Monthly Board Meeting Reminder</h5>
                  <p class="text-sm text-gray-600">Sent to all residents</p>
                </div>
                <span class="text-xs text-gray-500">2 days ago</span>
              </div>
            </div>
            <div class="border rounded-lg p-3">
              <div class="flex justify-between items-start">
                <div>
                  <h5 class="font-medium">Pool Maintenance Schedule</h5>
                  <p class="text-sm text-gray-600">Sent to all residents</p>
                </div>
                <span class="text-xs text-gray-500">1 week ago</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end mt-6">
          <button onclick="window.dashboard.closeModal()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Close
          </button>
        </div>
      </div>
    `;
  }

  async getMyRequestsContent() {
    const response = await fetch('/api/maintenance/requests', {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    const data = await response.json();

    if (!data.success) throw new Error('Failed to load maintenance requests');

    // Filter requests for current user (if they have a unit)
    const userUnit = this.user.unit_number;
    const allRequests = data.requests || [];
    const userRequests = userUnit ? allRequests.filter(request => 
      request.unit_number === userUnit || request.resident_name.includes(this.user.first_name)
    ) : [];

    const statusColors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800',
      'Scheduled': 'bg-purple-100 text-purple-800'
    };

    return `
      <div class="p-6 max-w-4xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900">My Maintenance Requests</h3>
          <button onclick="window.dashboard.closeModal()" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div class="mb-6">
          <button class="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors">
            <i class="fas fa-plus mr-2"></i>Submit New Request
          </button>
        </div>

        <div class="space-y-4">
          ${userRequests.length > 0 ? userRequests.map(request => `
            <div class="border rounded-lg p-4 hover:bg-gray-50">
              <div class="flex items-start justify-between mb-3">
                <h4 class="font-semibold text-gray-900">${request.title}</h4>
                <span class="px-2 py-1 text-xs rounded-full ${statusColors[request.status] || 'bg-gray-100 text-gray-800'}">
                  ${request.status}
                </span>
              </div>
              <p class="text-gray-600 text-sm mb-3">${request.description}</p>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span class="font-medium text-gray-700">Category:</span>
                  <span class="text-gray-600 ml-1">${request.category}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Priority:</span>
                  <span class="text-gray-600 ml-1">${request.priority}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Submitted:</span>
                  <span class="text-gray-600 ml-1">${new Date(request.submitted_date).toLocaleDateString()}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Est. Cost:</span>
                  <span class="text-gray-600 ml-1">KES ${request.estimated_cost?.toLocaleString() || 'TBD'}</span>
                </div>
              </div>
              ${request.assigned_to ? `
                <div class="mt-2 text-sm">
                  <span class="font-medium text-gray-700">Assigned to:</span>
                  <span class="text-blue-600 ml-1">${request.assigned_to}</span>
                </div>
              ` : ''}
              ${request.notes ? `
                <div class="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
                  <strong>Update:</strong> ${request.notes}
                </div>
              ` : ''}
            </div>
          `).join('') : `
            <div class="text-center py-12">
              <i class="fas fa-tools text-4xl text-gray-300 mb-4"></i>
              <h4 class="text-lg font-medium text-gray-700 mb-2">No Maintenance Requests</h4>
              <p class="text-gray-500 mb-4">You haven't submitted any maintenance requests yet.</p>
              <button class="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors">
                <i class="fas fa-plus mr-2"></i>Submit Your First Request
              </button>
            </div>
          `}
        </div>

        <div class="flex justify-end mt-6">
          <button onclick="window.dashboard.closeModal()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Close
          </button>
        </div>
      </div>
    `;
  }

  async getAccountBalanceContent() {
    const response = await fetch('/api/residents/my-account', {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    const data = await response.json();

    if (!data.success) throw new Error('Failed to load account balance');

    const account = data.account_info;
    const isOverdue = account.account_balance > 0;

    return `
      <div class="p-6 max-w-3xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900">Account Balance</h3>
          <button onclick="window.dashboard.closeModal()" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div class="bg-gradient-to-r ${isOverdue ? 'from-red-50 to-orange-50 border-red-200' : 'from-green-50 to-blue-50 border-green-200'} border rounded-lg p-6 mb-6">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-lg font-semibold ${isOverdue ? 'text-red-900' : 'text-green-900'}">
                Unit ${account.unit_number} - ${account.resident_name}
              </h4>
              <p class="text-sm ${isOverdue ? 'text-red-700' : 'text-green-700'} capitalize">${account.role.replace('_', ' ')}</p>
            </div>
            <div class="text-right">
              <div class="text-3xl font-bold ${isOverdue ? 'text-red-600' : 'text-green-600'}">
                KES ${Math.abs(account.account_balance || 0).toLocaleString()}
              </div>
              <p class="text-sm ${isOverdue ? 'text-red-600' : 'text-green-600'}">
                ${isOverdue ? 'Amount Due' : 'Paid Up'}
              </p>
            </div>
          </div>
        </div>

        ${isOverdue && account.overdue_amounts?.length > 0 ? `
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h4 class="font-semibold text-red-900 mb-3 flex items-center">
              <i class="fas fa-exclamation-triangle text-red-600 mr-2"></i>
              Overdue Payments
            </h4>
            <div class="space-y-2">
              ${account.overdue_amounts.map(payment => `
                <div class="flex justify-between items-center p-2 bg-white rounded">
                  <div>
                    <span class="font-medium text-red-900">${payment.type}</span>
                    <span class="text-sm text-red-700 ml-2">Due: ${new Date(payment.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div class="text-right">
                    <div class="font-semibold text-red-600">KES ${payment.amount.toLocaleString()}</div>
                    <div class="text-xs text-red-500">${payment.daysOverdue} days overdue</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="border rounded-lg p-4">
            <h4 class="font-semibold text-gray-900 mb-3">Quick Actions</h4>
            <div class="space-y-3">
              <button class="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
                <div class="flex items-center justify-between">
                  <div>
                    <h5 class="font-medium text-blue-800">Make Payment</h5>
                    <p class="text-sm text-blue-600">Pay dues online via M-Pesa</p>
                  </div>
                  <i class="fas fa-credit-card text-blue-600"></i>
                </div>
              </button>
              <button class="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors">
                <div class="flex items-center justify-between">
                  <div>
                    <h5 class="font-medium text-green-800">View Statements</h5>
                    <p class="text-sm text-green-600">Download payment receipts</p>
                  </div>
                  <i class="fas fa-file-invoice text-green-600"></i>
                </div>
              </button>
              <button class="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
                <div class="flex items-center justify-between">
                  <div>
                    <h5 class="font-medium text-purple-800">Payment Plan</h5>
                    <p class="text-sm text-purple-600">Set up installment plan</p>
                  </div>
                  <i class="fas fa-calendar text-purple-600"></i>
                </div>
              </button>
            </div>
          </div>

          <div class="border rounded-lg p-4">
            <h4 class="font-semibold text-gray-900 mb-3">Account Information</h4>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Monthly Dues:</span>
                <span class="font-medium">KES 15,000</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Parking Fee:</span>
                <span class="font-medium">KES 2,500</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Service Charge:</span>
                <span class="font-medium">KES 3,000</span>
              </div>
              <hr class="my-2">
              <div class="flex justify-between font-semibold">
                <span>Total Monthly:</span>
                <span>KES 20,500</span>
              </div>
              ${account.last_payment ? `
                <div class="mt-4 p-2 bg-gray-50 rounded">
                  <div class="text-xs text-gray-500">Last Payment:</div>
                  <div class="font-medium">${new Date(account.last_payment.date).toLocaleDateString()}</div>
                  <div class="text-green-600">KES ${account.last_payment.amount.toLocaleString()}</div>
                </div>
              ` : ''}
            </div>
          </div>
        </div>

        <div class="flex justify-end mt-6">
          <button onclick="window.dashboard.closeModal()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Close
          </button>
        </div>
      </div>
    `;
  }

  async getCommunityEventsContent() {
    const response = await fetch('/api/community/events', {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    const data = await response.json();

    if (!data.success) throw new Error('Failed to load community events');

    const events = data.upcoming_events || [];

    const eventTypeColors = {
      'Meeting': 'bg-blue-100 text-blue-800',
      'Social': 'bg-green-100 text-green-800',
      'Entertainment': 'bg-purple-100 text-purple-800',
      'Fitness': 'bg-orange-100 text-orange-800',
      'Community Service': 'bg-teal-100 text-teal-800',
      'Wellness': 'bg-pink-100 text-pink-800'
    };

    return `
      <div class="p-6 max-w-4xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900">Community Events</h3>
          <button onclick="window.dashboard.closeModal()" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div class="space-y-4">
          ${events.length > 0 ? events.map(event => `
            <div class="border rounded-lg p-4 hover:bg-gray-50">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <h4 class="font-semibold text-gray-900">${event.title}</h4>
                  <p class="text-sm text-gray-600 flex items-center mt-1">
                    <i class="fas fa-calendar-alt mr-2"></i>
                    ${new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p class="text-sm text-gray-600 flex items-center mt-1">
                    <i class="fas fa-map-marker-alt mr-2"></i>
                    ${event.location}
                  </p>
                </div>
                <span class="px-2 py-1 text-xs rounded-full ${eventTypeColors[event.type] || 'bg-gray-100 text-gray-800'}">
                  ${event.type}
                </span>
              </div>
              <p class="text-gray-700 mb-3">${event.description}</p>
              <div class="flex justify-between items-center">
                <div class="text-sm text-gray-500">
                  ${event.rsvp_required ? 
                    '<i class="fas fa-user-check mr-1"></i>RSVP Required' : 
                    '<i class="fas fa-users mr-1"></i>Open to All'
                  }
                </div>
                <div class="space-x-2">
                  ${event.rsvp_required ? `
                    <button class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                      RSVP Yes
                    </button>
                    <button class="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                      Maybe
                    </button>
                  ` : `
                    <button class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                      Add to Calendar
                    </button>
                  `}
                </div>
              </div>
            </div>
          `).join('') : `
            <div class="text-center py-12">
              <i class="fas fa-calendar-times text-4xl text-gray-300 mb-4"></i>
              <h4 class="text-lg font-medium text-gray-700 mb-2">No Upcoming Events</h4>
              <p class="text-gray-500">Check back soon for community events and activities.</p>
            </div>
          `}
        </div>

        <div class="flex justify-end mt-6">
          <button onclick="window.dashboard.closeModal()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Close
          </button>
        </div>
      </div>
    `;
  }

  getComingSoonContent(type) {
    return `
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">${this.getModalTitle(type)}</h3>
          <button onclick="window.dashboard.closeModal()" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="text-center py-8">
          <i class="fas fa-cog text-4xl text-gray-300 mb-4"></i>
          <p class="text-gray-600 mb-4">${this.translations[this.currentLanguage]['coming_soon'] || 'Coming Soon'}</p>
          <p class="text-sm text-gray-500">This feature will be available in the next update.</p>
        </div>
        <div class="flex justify-end space-x-3 mt-6">
          <button onclick="window.dashboard.closeModal()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors">
            ${this.translations[this.currentLanguage]['close'] || 'Close'}
          </button>
        </div>
      </div>
    `;
  }

  async getMaintenanceScheduleContent() {
    const response = await fetch('/api/maintenance/schedule', {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    const data = await response.json();

    if (!data.success) throw new Error('Failed to load maintenance schedule');

    const schedule = data.schedule || [];
    const vendors = data.vendors || [];
    const stats = data.statistics || {};

    const statusColors = {
      'Scheduled': 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      'Completed': 'bg-green-100 text-green-800',
      'Overdue': 'bg-red-100 text-red-800'
    };

    const priorityColors = {
      'High': 'bg-red-100 text-red-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-green-100 text-green-800'
    };

    const categoryIcons = {
      'Pool Maintenance': 'fas fa-swimmer',
      'Landscaping': 'fas fa-seedling',
      'Security': 'fas fa-shield-alt',
      'Safety': 'fas fa-hard-hat',
      'Amenities': 'fas fa-dumbbell',
      'Elevator': 'fas fa-elevator',
      'HVAC': 'fas fa-snowflake',
      'Structural': 'fas fa-building',
      'Electrical': 'fas fa-bolt',
      'Plumbing': 'fas fa-wrench'
    };

    // Current date for overdue calculation
    const now = new Date();
    const enhancedSchedule = schedule.map(item => ({
      ...item,
      isOverdue: new Date(item.scheduled_date) < now && item.status === 'Scheduled'
    }));

    return `
      <div class="p-6 max-w-6xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900">Maintenance Scheduler</h3>
          <div class="flex space-x-3">
            <button class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
              <i class="fas fa-plus mr-2"></i>Schedule New
            </button>
            <button onclick="window.dashboard.closeModal()" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <!-- Statistics Cards -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-blue-600">${stats.total_scheduled || 0}</div>
            <div class="text-sm text-blue-600">Total Scheduled</div>
          </div>
          <div class="bg-orange-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-orange-600">${stats.this_week || 0}</div>
            <div class="text-sm text-orange-600">This Week</div>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-purple-600">${stats.this_month || 0}</div>
            <div class="text-sm text-purple-600">This Month</div>
          </div>
          <div class="bg-red-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-red-600">${stats.overdue || 0}</div>
            <div class="text-sm text-red-600">Overdue</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-green-600">${vendors.length || 0}</div>
            <div class="text-sm text-green-600">Active Vendors</div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="border-b border-gray-200 mb-6">
          <nav class="-mb-px flex space-x-8">
            <button id="tab-schedule" class="tab-btn border-b-2 border-blue-500 text-blue-600 py-2 px-1 text-sm font-medium" onclick="showScheduleTab()">
              <i class="fas fa-clock mr-2"></i>Schedule
            </button>
            <button id="tab-calendar" class="tab-btn border-b-2 border-transparent text-gray-500 hover:text-gray-700 py-2 px-1 text-sm font-medium" onclick="showCalendarTab()">
              <i class="fas fa-calendar-alt mr-2"></i>Calendar View
            </button>
            <button id="tab-vendors" class="tab-btn border-b-2 border-transparent text-gray-500 hover:text-gray-700 py-2 px-1 text-sm font-medium" onclick="showVendorsTab()">
              <i class="fas fa-users-cog mr-2"></i>Vendors
            </button>
          </nav>
        </div>

        <!-- Schedule Tab Content -->
        <div id="schedule-tab" class="tab-content">
          <div class="space-y-4 max-h-96 overflow-y-auto">
            ${enhancedSchedule.length > 0 ? enhancedSchedule.map(item => `
              <div class="border rounded-lg p-4 hover:bg-gray-50 ${item.isOverdue ? 'border-red-300 bg-red-50' : ''}">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-center space-x-3">
                    <div class="p-2 rounded-lg ${item.priority === 'High' ? 'bg-red-100' : item.priority === 'Medium' ? 'bg-yellow-100' : 'bg-green-100'}">
                      <i class="${categoryIcons[item.category] || 'fas fa-cog'} ${item.priority === 'High' ? 'text-red-600' : item.priority === 'Medium' ? 'text-yellow-600' : 'text-green-600'}"></i>
                    </div>
                    <div>
                      <h4 class="font-semibold text-gray-900">${item.title}</h4>
                      <p class="text-sm text-gray-600">${item.description}</p>
                    </div>
                  </div>
                  <div class="flex flex-col items-end space-y-2">
                    <span class="px-2 py-1 text-xs rounded-full ${statusColors[item.isOverdue ? 'Overdue' : item.status] || 'bg-gray-100 text-gray-800'}">
                      ${item.isOverdue ? 'Overdue' : item.status}
                    </span>
                    <span class="px-2 py-1 text-xs rounded-full ${priorityColors[item.priority] || 'bg-gray-100 text-gray-800'}">
                      ${item.priority}
                    </span>
                  </div>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                  <div>
                    <span class="font-medium text-gray-700">Scheduled:</span>
                    <div class="text-gray-600">${new Date(item.scheduled_date).toLocaleDateString()}</div>
                    <div class="text-gray-500 text-xs">${new Date(item.scheduled_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </div>
                  <div>
                    <span class="font-medium text-gray-700">Location:</span>
                    <div class="text-gray-600">${item.location}</div>
                  </div>
                  <div>
                    <span class="font-medium text-gray-700">Duration:</span>
                    <div class="text-gray-600">${item.estimated_duration}h</div>
                  </div>
                  <div>
                    <span class="font-medium text-gray-700">Cost:</span>
                    <div class="text-gray-600">KES ${item.estimated_cost?.toLocaleString()}</div>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <span class="font-medium text-gray-700">Vendor:</span>
                    <div class="text-blue-600">${item.assigned_vendor}</div>
                  </div>
                  <div>
                    <span class="font-medium text-gray-700">Frequency:</span>
                    <div class="text-gray-600 capitalize">${item.frequency}</div>
                    ${item.next_occurrence ? `<div class="text-xs text-gray-500">Next: ${new Date(item.next_occurrence).toLocaleDateString()}</div>` : ''}
                  </div>
                </div>

                ${item.checklist && item.checklist.length > 0 ? `
                  <div class="mb-3">
                    <span class="font-medium text-gray-700 text-sm">Checklist:</span>
                    <div class="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                      ${item.checklist.slice(0, 4).map(task => `
                        <div class="flex items-center text-sm text-gray-600">
                          <i class="fas fa-check-circle text-green-500 mr-2"></i>
                          ${task}
                        </div>
                      `).join('')}
                      ${item.checklist.length > 4 ? `
                        <div class="text-sm text-gray-500 md:col-span-2">
                          ... and ${item.checklist.length - 4} more items
                        </div>
                      ` : ''}
                    </div>
                  </div>
                ` : ''}

                ${item.notes ? `
                  <div class="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
                    <div class="font-medium text-blue-900 mb-1">Notes:</div>
                    <div class="text-blue-700">${item.notes}</div>
                  </div>
                ` : ''}

                <div class="flex justify-end space-x-2 mt-4">
                  <button class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                    <i class="fas fa-edit mr-1"></i>Edit
                  </button>
                  <button class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                    <i class="fas fa-check mr-1"></i>Mark Complete
                  </button>
                  <button class="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700">
                    <i class="fas fa-calendar-plus mr-1"></i>Reschedule
                  </button>
                </div>
              </div>
            `).join('') : `
              <div class="text-center py-12">
                <i class="fas fa-calendar-times text-4xl text-gray-300 mb-4"></i>
                <h4 class="text-lg font-medium text-gray-700 mb-2">No Scheduled Maintenance</h4>
                <p class="text-gray-500 mb-4">Start by scheduling regular maintenance tasks.</p>
                <button class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                  <i class="fas fa-plus mr-2"></i>Schedule First Task
                </button>
              </div>
            `}
          </div>
        </div>

        <!-- Calendar Tab Content -->
        <div id="calendar-tab" class="tab-content hidden">
          <div class="bg-gray-50 rounded-lg p-6 text-center">
            <i class="fas fa-calendar-alt text-4xl text-gray-400 mb-4"></i>
            <h4 class="text-lg font-medium text-gray-700 mb-2">Calendar View</h4>
            <p class="text-gray-500">Interactive calendar view coming soon.</p>
            <p class="text-sm text-gray-400 mt-2">This will show all scheduled maintenance in a monthly calendar format.</p>
          </div>
        </div>

        <!-- Vendors Tab Content -->
        <div id="vendors-tab" class="tab-content hidden">
          <div class="space-y-4 max-h-80 overflow-y-auto">
            ${vendors.length > 0 ? vendors.map(vendor => `
              <div class="border rounded-lg p-4 hover:bg-gray-50">
                <div class="flex items-start justify-between mb-3">
                  <div>
                    <h4 class="font-semibold text-gray-900">${vendor.name}</h4>
                    <p class="text-sm text-gray-600">${vendor.category}</p>
                  </div>
                  <div class="text-right">
                    <div class="flex items-center space-x-1 mb-1">
                      ${Array.from({length: 5}, (_, i) => `
                        <i class="fas fa-star text-xs ${i < Math.floor(vendor.rating) ? 'text-yellow-400' : 'text-gray-300'}"></i>
                      `).join('')}
                      <span class="text-sm text-gray-600 ml-1">${vendor.rating}</span>
                    </div>
                    <div class="text-sm text-gray-500">${vendor.active_contracts} active contracts</div>
                  </div>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-3">
                  <div>
                    <span class="font-medium text-gray-700">Contact:</span>
                    <div class="text-gray-600">${vendor.contact_person}</div>
                    <div class="text-blue-600">${vendor.phone}</div>
                  </div>
                  <div>
                    <span class="font-medium text-gray-700">Email:</span>
                    <div class="text-blue-600">${vendor.email}</div>
                  </div>
                  <div>
                    <span class="font-medium text-gray-700">Rate:</span>
                    <div class="text-gray-600">KES ${vendor.hourly_rate}/hour</div>
                  </div>
                </div>

                <div class="mb-3">
                  <span class="font-medium text-gray-700 text-sm">Services:</span>
                  <div class="mt-1 flex flex-wrap gap-1">
                    ${vendor.services.map(service => `
                      <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">${service}</span>
                    `).join('')}
                  </div>
                </div>

                <div class="text-sm text-gray-600 mb-3">
                  <span class="font-medium">Last Service:</span> ${new Date(vendor.last_service).toLocaleDateString()}
                </div>

                ${vendor.notes ? `
                  <div class="bg-gray-50 rounded p-2 text-sm text-gray-600">
                    <span class="font-medium">Notes:</span> ${vendor.notes}
                  </div>
                ` : ''}

                <div class="flex justify-end space-x-2 mt-3">
                  <button class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                    <i class="fas fa-phone mr-1"></i>Contact
                  </button>
                  <button class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                    <i class="fas fa-calendar-plus mr-1"></i>Schedule Service
                  </button>
                </div>
              </div>
            `).join('') : `
              <div class="text-center py-12">
                <i class="fas fa-users-cog text-4xl text-gray-300 mb-4"></i>
                <h4 class="text-lg font-medium text-gray-700 mb-2">No Vendors Registered</h4>
                <p class="text-gray-500 mb-4">Add vendors to streamline maintenance scheduling.</p>
                <button class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                  <i class="fas fa-plus mr-2"></i>Add Vendor
                </button>
              </div>
            `}
          </div>
        </div>

        <div class="flex justify-end mt-6">
          <button onclick="window.dashboard.closeModal()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Close
          </button>
        </div>
      </div>

      <script>
        // Tab switching functionality
        function showScheduleTab() {
          document.getElementById('schedule-tab').classList.remove('hidden');
          document.getElementById('calendar-tab').classList.add('hidden');
          document.getElementById('vendors-tab').classList.add('hidden');
          
          // Update tab styling
          document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('border-blue-500', 'text-blue-600');
            btn.classList.add('border-transparent', 'text-gray-500');
          });
          document.getElementById('tab-schedule').classList.remove('border-transparent', 'text-gray-500');
          document.getElementById('tab-schedule').classList.add('border-blue-500', 'text-blue-600');
        }

        function showCalendarTab() {
          document.getElementById('schedule-tab').classList.add('hidden');
          document.getElementById('calendar-tab').classList.remove('hidden');
          document.getElementById('vendors-tab').classList.add('hidden');
          
          // Update tab styling
          document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('border-blue-500', 'text-blue-600');
            btn.classList.add('border-transparent', 'text-gray-500');
          });
          document.getElementById('tab-calendar').classList.remove('border-transparent', 'text-gray-500');
          document.getElementById('tab-calendar').classList.add('border-blue-500', 'text-blue-600');
        }

        function showVendorsTab() {
          document.getElementById('schedule-tab').classList.add('hidden');
          document.getElementById('calendar-tab').classList.add('hidden');
          document.getElementById('vendors-tab').classList.remove('hidden');
          
          // Update tab styling
          document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('border-blue-500', 'text-blue-600');
            btn.classList.add('border-transparent', 'text-gray-500');
          });
          document.getElementById('tab-vendors').classList.remove('border-transparent', 'text-gray-500');
          document.getElementById('tab-vendors').classList.add('border-blue-500', 'text-blue-600');
        }
      </script>
    `;
  }

  async getMaintenanceVendorsContent() {
    const response = await fetch('/api/maintenance/schedule', {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    const data = await response.json();

    if (!data.success) throw new Error('Failed to load vendor data');

    const vendors = data.vendors || [];

    return `
      <div class="p-6 max-w-5xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900">Maintenance Vendors</h3>
          <div class="flex space-x-3">
            <button class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
              <i class="fas fa-plus mr-2"></i>Add Vendor
            </button>
            <button onclick="window.dashboard.closeModal()" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-blue-600">${vendors.length}</div>
            <div class="text-sm text-blue-600">Active Vendors</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-green-600">
              ${vendors.reduce((sum, v) => sum + (v.active_contracts || 0), 0)}
            </div>
            <div class="text-sm text-green-600">Active Contracts</div>
          </div>
        </div>

        <div class="space-y-4 max-h-96 overflow-y-auto">
          ${vendors.length > 0 ? vendors.map(vendor => `
            <div class="border rounded-lg p-4 hover:bg-gray-50">
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <h4 class="font-semibold text-gray-900">${vendor.name}</h4>
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">${vendor.category}</span>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span class="font-medium text-gray-700">Contact:</span>
                      <div class="text-gray-600">${vendor.contact_person}</div>
                      <div class="text-blue-600">${vendor.phone}</div>
                      <div class="text-blue-600 text-xs">${vendor.email}</div>
                    </div>
                    <div>
                      <span class="font-medium text-gray-700">Rate & Rating:</span>
                      <div class="text-gray-600">KES ${vendor.hourly_rate}/hour</div>
                      <div class="flex items-center space-x-1">
                        ${Array.from({length: 5}, (_, i) => `
                          <i class="fas fa-star text-xs ${i < Math.floor(vendor.rating) ? 'text-yellow-400' : 'text-gray-300'}"></i>
                        `).join('')}
                        <span class="text-gray-600 ml-1">${vendor.rating}</span>
                      </div>
                    </div>
                    <div>
                      <span class="font-medium text-gray-700">Status:</span>
                      <div class="text-gray-600">${vendor.active_contracts} active contracts</div>
                      <div class="text-gray-500 text-xs">Last: ${new Date(vendor.last_service).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <span class="font-medium text-gray-700 text-sm">Services:</span>
                <div class="mt-1 flex flex-wrap gap-1">
                  ${vendor.services.map(service => `
                    <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">${service}</span>
                  `).join('')}
                </div>
              </div>

              ${vendor.notes ? `
                <div class="bg-gray-50 rounded p-2 text-sm text-gray-600 mb-3">
                  <span class="font-medium">Notes:</span> ${vendor.notes}
                </div>
              ` : ''}

              <div class="flex justify-end space-x-2">
                <button class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                  <i class="fas fa-phone mr-1"></i>Contact
                </button>
                <button class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                  <i class="fas fa-calendar-plus mr-1"></i>Schedule Service
                </button>
                <button class="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                  <i class="fas fa-edit mr-1"></i>Edit
                </button>
              </div>
            </div>
          `).join('') : `
            <div class="text-center py-12">
              <i class="fas fa-users-cog text-4xl text-gray-300 mb-4"></i>
              <h4 class="text-lg font-medium text-gray-700 mb-2">No Vendors Registered</h4>
              <p class="text-gray-500 mb-4">Add vendors to streamline maintenance operations.</p>
              <button class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                <i class="fas fa-plus mr-2"></i>Add First Vendor
              </button>
            </div>
          `}
        </div>

        <div class="flex justify-end mt-6">
          <button onclick="window.dashboard.closeModal()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Close
          </button>
        </div>
      </div>
    `;
  }

  closeModal() {
    const modalBackdrop = document.getElementById('modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.classList.add('hidden');
    }
  }

  getModalTitle(type) {
    const titles = {
      'properties': this.translations[this.currentLanguage]['manage_properties'] || 'Manage Properties',
      'residents': this.translations[this.currentLanguage]['manage_residents'] || 'Manage Residents',
      'financial-reports': this.translations[this.currentLanguage]['financial_reports'] || 'Financial Reports',
      'maintenance-schedule': this.translations[this.currentLanguage]['maintenance_schedule'] || 'Maintenance Schedule',
      'maintenance-requests': this.translations[this.currentLanguage]['maintenance_requests'] || 'Maintenance Requests',
      'maintenance-vendors': this.translations[this.currentLanguage]['vendors'] || 'Vendors',
      'maintenance-inventory': this.translations[this.currentLanguage]['inventory'] || 'Inventory',
      'maintenance-reports': this.translations[this.currentLanguage]['reports'] || 'Reports',
      'create-hoa': this.translations[this.currentLanguage]['create_hoa'] || 'Create HOA',
      'manage-hoas': this.translations[this.currentLanguage]['manage_hoas'] || 'Manage HOAs',
      'platform-users': this.translations[this.currentLanguage]['user_management'] || 'User Management',
      'system-settings': this.translations[this.currentLanguage]['platform_settings'] || 'Platform Settings',
      'make-payment': this.translations[this.currentLanguage]['make_payment'] || 'Make Payment',
      'report-issue': this.translations[this.currentLanguage]['report_issue'] || 'Report Issue',
      'documents': this.translations[this.currentLanguage]['documents'] || 'Documents',
      'directory': this.translations[this.currentLanguage]['directory'] || 'Directory',
      'user-profile': this.translations[this.currentLanguage]['user_profile'] || 'User Profile'
    };
    return titles[type] || type;
  }

  // SUPER ADMIN MODAL CONTENT METHODS
  
  async getCreateHoaContent() {
    return `
      <div class="p-6 max-w-2xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900">Create New HOA</h3>
          <button onclick="window.dashboard.closeModal()" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <form id="create-hoa-form" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">HOA Name</label>
              <input type="text" id="hoa-name" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Westlands Heights" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input type="text" id="hoa-location" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Nairobi, Westlands" required>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Total Properties</label>
              <input type="number" id="hoa-properties" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., 150" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Subscription Plan</label>
              <select id="hoa-plan" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                <option value="">Select Plan</option>
                <option value="basic">Basic - KES 5,000/month</option>
                <option value="professional">Professional - KES 12,000/month</option>
                <option value="premium">Premium - KES 25,000/month</option>
              </select>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
            <input type="email" id="admin-email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="admin@example.com" required>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Admin First Name</label>
              <input type="text" id="admin-first-name" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Admin Last Name</label>
              <input type="text" id="admin-last-name" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Doe" required>
            </div>
          </div>
          
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 class="font-semibold text-blue-800 mb-2">HOA Creation Summary</h4>
            <ul class="text-sm text-blue-700 space-y-1">
              <li>✓ HOA tenant will be created with unique slug</li>
              <li>✓ Admin user account will be generated</li>
              <li>✓ Default payment settings will be configured</li>
              <li>✓ Basic property structure will be initialized</li>
              <li>✓ Subscription billing will be activated</li>
            </ul>
          </div>
        </form>
        
        <div class="flex justify-end space-x-3 mt-6">
          <button onclick="window.dashboard.closeModal()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors">
            Cancel
          </button>
          <button onclick="window.dashboard.createHoa()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            <i class="fas fa-plus mr-2"></i>Create HOA
          </button>
        </div>
      </div>
    `;
  }
  
  async getManageHoasContent() {
    const response = await fetch('/api/platform/hoas', {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    const data = await response.json();

    if (!data.success) throw new Error('Failed to load HOAs');

    const hoas = data.hoas || [];
    
    return `
      <div class="p-6 max-w-6xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900">Manage HOAs</h3>
          <button onclick="window.dashboard.closeModal()" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-blue-600">${data.total_hoas}</div>
            <div class="text-sm text-blue-600">Total HOAs</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-green-600">${data.active_hoas}</div>
            <div class="text-sm text-green-600">Active HOAs</div>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-purple-600">${data.subscription_breakdown.premium}</div>
            <div class="text-sm text-purple-600">Premium Plans</div>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HOA</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Properties</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              ${hoas.map(hoa => `
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-4">
                    <div class="flex items-center">
                      <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <i class="fas fa-building text-blue-600 text-sm"></i>
                      </div>
                      <div>
                        <div class="text-sm font-medium text-gray-900">${hoa.name}</div>
                        <div class="text-xs text-gray-500">${hoa.location}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-4">
                    <div class="text-sm text-gray-900">${hoa.total_properties}</div>
                    <div class="text-xs text-gray-500">${hoa.occupancy_rate}% occupied</div>
                  </td>
                  <td class="px-4 py-4">
                    <div class="text-sm font-medium text-gray-900">KES ${hoa.monthly_revenue.toLocaleString()}</div>
                    <div class="text-xs text-gray-500">monthly</div>
                  </td>
                  <td class="px-4 py-4">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      hoa.subscription_plan === 'premium' ? 'bg-purple-100 text-purple-800' :
                      hoa.subscription_plan === 'professional' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }">
                      ${hoa.subscription_plan}
                    </span>
                  </td>
                  <td class="px-4 py-4">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      hoa.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }">
                      ${hoa.status}
                    </span>
                  </td>
                  <td class="px-4 py-4">
                    <div class="flex space-x-2">
                      <button class="text-blue-600 hover:text-blue-800 text-sm" onclick="window.dashboard.viewHoaDetails('${hoa.slug}')">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="text-green-600 hover:text-green-800 text-sm" onclick="window.dashboard.editHoa('${hoa.slug}')">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="text-red-600 hover:text-red-800 text-sm" onclick="window.dashboard.toggleHoaStatus('${hoa.slug}')">
                        <i class="fas fa-${hoa.status === 'Active' ? 'pause' : 'play'}"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <button onclick="window.dashboard.closeModal()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors">
            Close
          </button>
          <button onclick="window.dashboard.openModal('create-hoa')" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            <i class="fas fa-plus mr-2"></i>Create New HOA
          </button>
        </div>
      </div>
    `;
  }
  
  async getPlatformUsersContent() {
    const response = await fetch('/api/platform/users', {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    const data = await response.json();

    if (!data.success) throw new Error('Failed to load users');

    const users = data.users || [];
    const usersByRole = data.users_by_role;
    
    return `
      <div class="p-6 max-w-6xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900">Platform Users</h3>
          <button onclick="window.dashboard.closeModal()" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-purple-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-purple-600">${usersByRole.super_admin}</div>
            <div class="text-sm text-purple-600">Super Admins</div>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-blue-600">${usersByRole.hoa_admin + usersByRole.property_manager + usersByRole.finance_manager}</div>
            <div class="text-sm text-blue-600">HOA Staff</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-green-600">${usersByRole.resident_owner + usersByRole.resident_tenant}</div>
            <div class="text-sm text-green-600">Residents</div>
          </div>
          <div class="bg-orange-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-orange-600">${usersByRole.maintenance_manager}</div>
            <div class="text-sm text-orange-600">Maintenance</div>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HOA</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              ${users.slice(0, 20).map(user => `
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-4">
                    <div class="flex items-center">
                      <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <i class="fas fa-user text-gray-600 text-sm"></i>
                      </div>
                      <div>
                        <div class="text-sm font-medium text-gray-900">${user.name}</div>
                        <div class="text-xs text-gray-500">${user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-4">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                      user.role.includes('admin') ? 'bg-blue-100 text-blue-800' :
                      user.role.includes('resident') ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }">
                      ${user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td class="px-4 py-4">
                    <div class="text-sm text-gray-900">${user.hoa_name}</div>
                    ${user.unit_number ? `<div class="text-xs text-gray-500">Unit ${user.unit_number}</div>` : ''}
                  </td>
                  <td class="px-4 py-4">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }">
                      ${user.status}
                    </span>
                  </td>
                  <td class="px-4 py-4">
                    <div class="text-sm text-gray-900">${new Date(user.last_login).toLocaleDateString()}</div>
                    <div class="text-xs text-gray-500">${new Date(user.last_login).toLocaleTimeString()}</div>
                  </td>
                  <td class="px-4 py-4">
                    <div class="flex space-x-2">
                      <button class="text-blue-600 hover:text-blue-800 text-sm" onclick="window.dashboard.viewUserDetails('${user.id}')">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="text-green-600 hover:text-green-800 text-sm" onclick="window.dashboard.editUser('${user.id}')">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="text-red-600 hover:text-red-800 text-sm" onclick="window.dashboard.toggleUserStatus('${user.id}')">
                        <i class="fas fa-${user.status === 'Active' ? 'ban' : 'check'}"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        ${users.length > 20 ? `<div class="text-center mt-4 text-sm text-gray-500">Showing first 20 of ${users.length} users</div>` : ''}
        
        <div class="flex justify-end space-x-3 mt-6">
          <button onclick="window.dashboard.closeModal()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors">
            Close
          </button>
          <button onclick="window.dashboard.exportUsers()" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
            <i class="fas fa-download mr-2"></i>Export Users
          </button>
        </div>
      </div>
    `;
  }
  
  // Placeholder methods for super admin actions
  createHoa() {
    alert('HOA creation functionality would be implemented here');
  }
  
  viewHoaDetails(slug) {
    alert(`View details for HOA: ${slug}`);
  }
  
  editHoa(slug) {
    alert(`Edit HOA: ${slug}`);
  }
  
  toggleHoaStatus(slug) {
    alert(`Toggle status for HOA: ${slug}`);
  }
  
  viewUserDetails(id) {
    alert(`View user details: ${id}`);
  }
  
  editUser(id) {
    alert(`Edit user: ${id}`);
  }
  
  toggleUserStatus(id) {
    alert(`Toggle user status: ${id}`);
  }
  
  exportUsers() {
    alert('User export functionality would be implemented here');
  }

  showErrorMessage(message = 'Failed to load dashboard data. Please try again later.') {
    console.error('Dashboard error:', message);
    
    // Show toast notification
    this.showToast(message, 'error');
  }

  showLoadingSpinner() {
    const existingSpinner = document.getElementById('dashboard-loading-spinner');
    if (existingSpinner) return;

    const spinner = document.createElement('div');
    spinner.id = 'dashboard-loading-spinner';
    spinner.className = 'fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50';
    spinner.innerHTML = `
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    `;
    document.body.appendChild(spinner);
  }

  hideLoadingSpinner() {
    const spinner = document.getElementById('dashboard-loading-spinner');
    if (spinner) {
      spinner.remove();
    }
  }

  showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container') || this.createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast-item transform transition-all duration-300 mb-4 p-4 rounded-lg shadow-lg max-w-sm w-full`;
    
    const colors = {
      'success': 'bg-green-100 border border-green-400 text-green-700',
      'error': 'bg-red-100 border border-red-400 text-red-700',
      'warning': 'bg-yellow-100 border border-yellow-400 text-yellow-700',
      'info': 'bg-blue-100 border border-blue-400 text-blue-700'
    };
    
    toast.className += ` ${colors[type] || colors.info}`;
    toast.innerHTML = `
      <div class="flex items-center justify-between">
        <p class="text-sm font-medium">${message}</p>
        <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-gray-500 hover:text-gray-700">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 5000);
  }

  createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed top-4 right-4 z-50';
    document.body.appendChild(container);
    return container;
  }
}

// Global functions for backward compatibility
window.switchLanguage = function(lang) {
  if (window.dashboard) {
    window.dashboard.switchLanguage(lang);
  }
};

window.logout = function() {
  if (window.dashboard) {
    window.dashboard.logout();
  }
};

window.openModal = function(type) {
  if (window.dashboard) {
    window.dashboard.openModal(type);
  }
};