// KenyaHOA Pro - Main Landing Page JavaScript with Seeded Data
class KenyaHOAApp {
  constructor() {
    this.currentLanguage = AuthUtils.getLanguage();
    this.apiBaseUrl = '/api';
    this.availableAccounts = [];
    this.init();
  }

  async init() {
    this.setupLanguage();
    this.setupEventListeners();
    await this.loadDemoAccounts();
  }

  async loadDemoAccounts() {
    try {
      const response = await fetch('/api/auth/demo-accounts');
      if (response.ok) {
        const data = await response.json();
        this.availableAccounts = data.accounts;
        console.log('Loaded demo accounts:', this.availableAccounts.length);
      }
    } catch (error) {
      console.error('Failed to load demo accounts:', error);
    }
  }

  setupLanguage() {
    // Update language buttons
    const langEn = document.getElementById('lang-en');
    const langSw = document.getElementById('lang-sw');
    
    if (langEn && langSw) {
      if (this.currentLanguage === 'en') {
        langEn.classList.add('active');
        langSw.classList.remove('active');
      } else {
        langSw.classList.add('active');
        langEn.classList.remove('active');
      }
    }
    
    this.updateLanguage();
  }

  setupEventListeners() {
    // Language switching
    const langEn = document.getElementById('lang-en');
    const langSw = document.getElementById('lang-sw');
    
    if (langEn) {
      langEn.addEventListener('click', () => this.switchLanguage('en'));
    }
    
    if (langSw) {
      langSw.addEventListener('click', () => this.switchLanguage('sw'));
    }

    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    // Signup form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => this.handleSignup(e));
    }

    // Demo login button
    const demoLoginBtn = document.getElementById('demo-login');
    if (demoLoginBtn) {
      demoLoginBtn.addEventListener('click', () => this.showDemoAccountSelector());
    }

    // Make functions globally available for onclick handlers
    window.showLogin = () => this.showLoginModal();
    window.showSignup = () => this.showSignupModal();
    window.closeModal = () => this.closeModal();
    window.switchLanguage = (lang) => this.switchLanguage(lang);
    
    // Make this instance globally available
    window.kenyaHOAApp = this;
  }

  switchLanguage(lang) {
    this.currentLanguage = lang;
    AuthUtils.setLanguage(lang);
    
    // Update UI
    const langEn = document.getElementById('lang-en');
    const langSw = document.getElementById('lang-sw');
    
    if (langEn && langSw) {
      if (lang === 'en') {
        langEn.classList.add('active');
        langSw.classList.remove('active');
      } else {
        langSw.classList.add('active');
        langEn.classList.remove('active');
      }
    }
    
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

  showLoginModal() {
    document.getElementById('login-modal').classList.remove('hidden');
  }

  showSignupModal() {
    document.getElementById('signup-modal').classList.remove('hidden');
  }

  showDemoAccountSelector() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900">
              <span data-en="Select Demo Account" data-sw="Chagua Akaunti ya Majaribio">Select Demo Account</span>
            </h3>
            <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
          
          <div class="mb-4">
            <p class="text-gray-600" data-en="Choose from the following seeded HOA accounts:" data-sw="Chagua kutoka kwa akaunti hizi za HOA:">
              Choose from the following seeded HOA accounts:
            </p>
          </div>
          
          <div class="space-y-3">
            ${this.availableAccounts.map((account, index) => `
              <div class="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors" 
                   onclick="window.kenyaHOAApp.loginWithAccount('${account.email}')">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <i class="fas ${this.getRoleIcon(account.role)} text-blue-600"></i>
                      </div>
                      <div>
                        <h4 class="font-semibold text-gray-900">${account.name}</h4>
                        <p class="text-sm text-gray-600">${account.email}</p>
                      </div>
                    </div>
                    <div class="mt-2 ml-13">
                      <div class="flex flex-wrap gap-2 text-xs">
                        <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          ${this.formatRole(account.role)}
                        </span>
                        <span class="bg-green-100 text-green-800 px-2 py-1 rounded">
                          ${account.hoa_name}
                        </span>
                        <span class="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          ${account.location}
                        </span>
                        ${account.unit ? `
                          <span class="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            Unit: ${account.unit}
                          </span>
                        ` : ''}
                      </div>
                    </div>
                  </div>
                  <div class="ml-4">
                    <i class="fas fa-chevron-right text-gray-400"></i>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          
          <div class="mt-6 pt-4 border-t border-gray-200">
            <p class="text-xs text-gray-500 mb-3">
              <span data-en="Or use manual login with any email above and password: " data-sw="Au tumia uingiaji wa mkono kwa barua pepe yoyote hapo juu na nywila: ">
                Or use manual login with any email above and password: 
              </span>
              <code class="bg-gray-100 px-1 rounded">demo123</code>
              <span class="text-gray-400"> (all demo accounts)</span>
            </p>
            <div class="flex space-x-3">
              <button onclick="this.closest('.fixed').remove(); window.showLogin()" 
                      class="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                <span data-en="Manual Login" data-sw="Uingiaji wa Mkono">Manual Login</span>
              </button>
              <button onclick="this.closest('.fixed').remove()" 
                      class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors">
                <span data-en="Cancel" data-sw="Ghairi">Cancel</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    this.updateLanguage(); // Update language for new elements
  }

  getRoleIcon(role) {
    const icons = {
      'hoa_admin': 'fa-user-shield',
      'property_manager': 'fa-building',
      'finance_manager': 'fa-calculator',
      'resident_owner': 'fa-home',
      'resident_tenant': 'fa-user'
    };
    return icons[role] || 'fa-user';
  }

  formatRole(role) {
    const roleNames = {
      'hoa_admin': 'HOA Admin',
      'property_manager': 'Property Manager', 
      'finance_manager': 'Finance Manager',
      'resident_owner': 'Property Owner',
      'resident_tenant': 'Tenant'
    };
    return roleNames[role] || role;
  }

  async loginWithAccount(email) {
    try {
      // Close the demo selector modal
      const modal = document.querySelector('.fixed.inset-0');
      if (modal) {
        modal.remove();
      }

      // Show loading state
      this.showToast('Logging in...', 'info');

      // Find the correct password for this account
      const account = this.availableAccounts.find(acc => acc.email === email);
      const password = account ? account.password : 'demo123';

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password // Use the correct password for each account
        })
      });

      const data = await response.json();

      if (data.success) {
        // Store token and user data
        AuthUtils.storeAuthData(data.token, data.user, data.tenant);
        
        const tenantName = data.tenant ? data.tenant.name : 'Platform Admin';
        this.showToast(`Welcome ${data.user.first_name}! Redirecting to ${tenantName} dashboard...`, 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        this.showToast('Login failed: ' + data.message, 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      this.showToast('Login failed. Please try again.', 'error');
    }
  }

  closeModal() {
    document.getElementById('login-modal').classList.add('hidden');
    document.getElementById('signup-modal').classList.add('hidden');
  }

  async handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const errorDiv = document.getElementById('login-error');
    
    // Clear previous errors
    errorDiv.textContent = '';
    this.setButtonLoading(submitBtn, true);

    const loginData = {
      email: formData.get('email'),
      password: formData.get('password')
    };

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (data.success) {
        // Store token and user data
        AuthUtils.storeAuthData(data.token, data.user, data.tenant);
        
        const tenantName = data.tenant ? data.tenant.name : 'Platform Admin';
        this.showToast(`Welcome ${data.user.first_name}! Redirecting to ${tenantName} dashboard...`, 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        this.showError(errorDiv, data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      this.showError(errorDiv, 'Login failed. Please try again.');
    } finally {
      this.setButtonLoading(submitBtn, false);
    }
  }

  async handleSignup(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const errorDiv = document.getElementById('signup-error');
    
    // Clear previous errors
    errorDiv.textContent = '';
    this.setButtonLoading(submitBtn, true);

    const signupData = {
      email: formData.get('email'),
      password: formData.get('password'),
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      phone: formData.get('phone') || undefined,
      property_unit: formData.get('property_unit') || undefined
    };

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupData)
      });

      const data = await response.json();

      if (data.success) {
        // Store token and user data
        AuthUtils.storeAuthData(data.token, data.user, data.tenant);
        
        this.showToast('Account created successfully! Welcome to KenyaHOA Pro!', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        this.showError(errorDiv, data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      this.showError(errorDiv, 'Registration failed. Please try again.');
    } finally {
      this.setButtonLoading(submitBtn, false);
    }
  }

  setButtonLoading(button, loading) {
    if (loading) {
      button.classList.add('btn-loading');
      button.disabled = true;
      const spinner = button.querySelector('.spinner') || document.createElement('div');
      spinner.className = 'spinner inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2';
      button.prepend(spinner);
    } else {
      button.classList.remove('btn-loading');
      button.disabled = false;
      const spinner = button.querySelector('.spinner');
      if (spinner) {
        spinner.remove();
      }
    }
  }

  showError(errorDiv, message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    const bgColors = {
      'success': 'bg-green-500',
      'error': 'bg-red-500',
      'info': 'bg-blue-500'
    };
    
    toast.className = `fixed top-4 right-4 ${bgColors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm`;
    toast.innerHTML = `
      <div class="flex items-center">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} mr-2"></i>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 5000);
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.kenyaHOA = new KenyaHOAApp();
});