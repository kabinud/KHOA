// KenyaHOA Pro - Main Application JavaScript

class KenyaHOAApp {
  constructor() {
    this.currentLanguage = 'en';
    this.apiBaseUrl = '/api';
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadLanguagePreference();
    this.setupLocalization();
  }

  setupEventListeners() {
    // Language switching
    document.getElementById('langEn')?.addEventListener('click', () => this.switchLanguage('en'));
    document.getElementById('langSw')?.addEventListener('click', () => this.switchLanguage('sw'));

    // Navigation buttons
    document.getElementById('loginBtn')?.addEventListener('click', () => this.showLoginModal());
    document.getElementById('getStartedBtn')?.addEventListener('click', () => this.showSignupModal());
    document.getElementById('learnMoreBtn')?.addEventListener('click', () => this.scrollToFeatures());
  }

  loadLanguagePreference() {
    const savedLang = localStorage.getItem('kenyahoa_language') || 'en';
    this.switchLanguage(savedLang);
  }

  switchLanguage(lang) {
    this.currentLanguage = lang;
    localStorage.setItem('kenyahoa_language', lang);
    
    // Update UI language indicator
    document.getElementById('langEn')?.classList.toggle('bg-gray-300', lang === 'en');
    document.getElementById('langEn')?.classList.toggle('bg-gray-200', lang !== 'en');
    document.getElementById('langSw')?.classList.toggle('bg-gray-300', lang === 'sw');
    document.getElementById('langSw')?.classList.toggle('bg-gray-200', lang !== 'sw');
    
    this.updateTexts();
  }

  updateTexts() {
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

  setupLocalization() {
    this.updateTexts();
  }

  scrollToFeatures() {
    const featuresSection = document.querySelector('.py-20.bg-white');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  showLoginModal() {
    const modal = this.createModal('login');
    document.body.appendChild(modal);
  }

  showSignupModal() {
    const modal = this.createModal('signup');
    document.body.appendChild(modal);
  }

  createModal(type) {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.onclick = (e) => {
      if (e.target === modalOverlay) {
        this.closeModal(modalOverlay);
      }
    };

    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';

    if (type === 'login') {
      modalContainer.innerHTML = this.getLoginModalContent();
      this.setupLoginModalEvents(modalContainer);
    } else if (type === 'signup') {
      modalContainer.innerHTML = this.getSignupModalContent();
      this.setupSignupModalEvents(modalContainer);
    }

    modalOverlay.appendChild(modalContainer);
    return modalOverlay;
  }

  getLoginModalContent() {
    return `
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900">
          ${this.currentLanguage === 'sw' ? 'Ingia Akaunti Yako' : 'Login to Your Account'}
        </h2>
      </div>
      
      <form id="loginForm" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            ${this.currentLanguage === 'sw' ? 'Barua Pepe' : 'Email Address'}
          </label>
          <input type="email" id="loginEmail" name="email" required 
                 class="form-input" 
                 placeholder="${this.currentLanguage === 'sw' ? 'Ingiza barua pepe yako' : 'Enter your email address'}">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            ${this.currentLanguage === 'sw' ? 'Neno la Siri' : 'Password'}
          </label>
          <input type="password" id="loginPassword" name="password" required 
                 class="form-input" 
                 placeholder="${this.currentLanguage === 'sw' ? 'Ingiza neno la siri' : 'Enter your password'}">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            ${this.currentLanguage === 'sw' ? 'HOA (Hiari)' : 'HOA (Optional)'}
          </label>
          <input type="text" id="loginTenant" name="tenant_slug" 
                 class="form-input" 
                 placeholder="${this.currentLanguage === 'sw' ? 'jina-la-hoa' : 'your-hoa-name'}">
          <p class="text-xs text-gray-500 mt-1">
            ${this.currentLanguage === 'sw' ? 'Acha tupu ikiwa huna HOA moja' : 'Leave empty if you only have one HOA'}
          </p>
        </div>
        
        <div id="loginError" class="hidden form-error"></div>
        
        <button type="submit" id="loginSubmitBtn" 
                class="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition duration-200">
          ${this.currentLanguage === 'sw' ? 'Ingia' : 'Login'}
        </button>
      </form>
      
      <div class="mt-4 text-center">
        <a href="#" class="text-sm text-primary-600 hover:text-primary-500">
          ${this.currentLanguage === 'sw' ? 'Umesahau neno la siri?' : 'Forgot your password?'}
        </a>
      </div>
      
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          ${this.currentLanguage === 'sw' ? 'Huna akaunti?' : "Don't have an account?"} 
          <button id="switchToSignup" class="text-primary-600 hover:text-primary-500 font-medium">
            ${this.currentLanguage === 'sw' ? 'Jisajili' : 'Sign up'}
          </button>
        </p>
      </div>
      
      <button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onclick="this.closest('.modal-overlay').remove()">
        <i class="fas fa-times"></i>
      </button>
    `;
  }

  getSignupModalContent() {
    return `
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900">
          ${this.currentLanguage === 'sw' ? 'Fungua Akaunti Mpya' : 'Create Your Account'}
        </h2>
      </div>
      
      <form id="signupForm" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              ${this.currentLanguage === 'sw' ? 'Jina la Kwanza' : 'First Name'}
            </label>
            <input type="text" id="signupFirstName" name="first_name" required 
                   class="form-input" 
                   placeholder="${this.currentLanguage === 'sw' ? 'Jina lako la kwanza' : 'Your first name'}">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              ${this.currentLanguage === 'sw' ? 'Jina la Mwisho' : 'Last Name'}
            </label>
            <input type="text" id="signupLastName" name="last_name" required 
                   class="form-input" 
                   placeholder="${this.currentLanguage === 'sw' ? 'Jina lako la mwisho' : 'Your last name'}">
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            ${this.currentLanguage === 'sw' ? 'Barua Pepe' : 'Email Address'}
          </label>
          <input type="email" id="signupEmail" name="email" required 
                 class="form-input" 
                 placeholder="${this.currentLanguage === 'sw' ? 'mfano@email.com' : 'example@email.com'}">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            ${this.currentLanguage === 'sw' ? 'Nambari ya Simu' : 'Phone Number'}
          </label>
          <input type="tel" id="signupPhone" name="phone" 
                 class="form-input" 
                 placeholder="${this.currentLanguage === 'sw' ? '+254 700 000 000' : '+254 700 000 000'}">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            ${this.currentLanguage === 'sw' ? 'Neno la Siri' : 'Password'}
          </label>
          <input type="password" id="signupPassword" name="password" required 
                 class="form-input" 
                 placeholder="${this.currentLanguage === 'sw' ? 'Chagua neno la siri lililo salama' : 'Choose a secure password'}">
          <p class="text-xs text-gray-500 mt-1">
            ${this.currentLanguage === 'sw' ? 'Angalau herufi 8, na ishirikishe herufi kubwa, ndogo, na nambari' : 'At least 8 characters with uppercase, lowercase, and numbers'}
          </p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            ${this.currentLanguage === 'sw' ? 'Jina la HOA' : 'HOA Name'}
          </label>
          <input type="text" id="signupTenantSlug" name="tenant_slug" required 
                 class="form-input" 
                 placeholder="${this.currentLanguage === 'sw' ? 'westlands-garden' : 'westlands-garden'}">
          <p class="text-xs text-gray-500 mt-1">
            ${this.currentLanguage === 'sw' ? 'Jina fupi la HOA yako (kama ilivyo katika URL)' : 'Your HOA\'s short name (as it appears in the URL)'}
          </p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            ${this.currentLanguage === 'sw' ? 'Nambari ya Nyumba (Hiari)' : 'Property Unit (Optional)'}
          </label>
          <input type="text" id="signupPropertyUnit" name="property_unit" 
                 class="form-input" 
                 placeholder="${this.currentLanguage === 'sw' ? 'A101, B205, nk.' : 'A101, B205, etc.'}">
        </div>
        
        <div id="signupError" class="hidden form-error"></div>
        
        <button type="submit" id="signupSubmitBtn" 
                class="w-full bg-kenya-orange hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition duration-200">
          ${this.currentLanguage === 'sw' ? 'Fungua Akaunti' : 'Create Account'}
        </button>
      </form>
      
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          ${this.currentLanguage === 'sw' ? 'Tayari una akaunti?' : 'Already have an account?'} 
          <button id="switchToLogin" class="text-primary-600 hover:text-primary-500 font-medium">
            ${this.currentLanguage === 'sw' ? 'Ingia' : 'Login'}
          </button>
        </p>
      </div>
      
      <button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onclick="this.closest('.modal-overlay').remove()">
        <i class="fas fa-times"></i>
      </button>
    `;
  }

  setupLoginModalEvents(container) {
    const form = container.querySelector('#loginForm');
    const submitBtn = container.querySelector('#loginSubmitBtn');
    const errorDiv = container.querySelector('#loginError');
    const switchBtn = container.querySelector('#switchToSignup');

    form.addEventListener('submit', (e) => this.handleLogin(e, submitBtn, errorDiv));
    switchBtn?.addEventListener('click', () => {
      container.closest('.modal-overlay').remove();
      this.showSignupModal();
    });
  }

  setupSignupModalEvents(container) {
    const form = container.querySelector('#signupForm');
    const submitBtn = container.querySelector('#signupSubmitBtn');
    const errorDiv = container.querySelector('#signupError');
    const switchBtn = container.querySelector('#switchToLogin');

    form.addEventListener('submit', (e) => this.handleSignup(e, submitBtn, errorDiv));
    switchBtn?.addEventListener('click', () => {
      container.closest('.modal-overlay').remove();
      this.showLoginModal();
    });
  }

  async handleLogin(e, submitBtn, errorDiv) {
    e.preventDefault();
    this.setButtonLoading(submitBtn, true);
    this.hideError(errorDiv);

    const formData = new FormData(e.target);
    const loginData = {
      email: formData.get('email'),
      password: formData.get('password'),
      tenant_slug: formData.get('tenant_slug') || undefined
    };

    try {
      const response = await axios.post(`${this.apiBaseUrl}/auth/login`, loginData);
      
      if (response.data.success) {
        // Store token and user data
        localStorage.setItem('kenyahoa_token', response.data.token);
        localStorage.setItem('kenyahoa_user', JSON.stringify(response.data.user));
        localStorage.setItem('kenyahoa_tenant', JSON.stringify(response.data.tenant));
        
        this.showToast('Login successful! Redirecting...', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      }
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      this.showError(errorDiv, errorMessage);
    } finally {
      this.setButtonLoading(submitBtn, false);
    }
  }

  async handleSignup(e, submitBtn, errorDiv) {
    e.preventDefault();
    this.setButtonLoading(submitBtn, true);
    this.hideError(errorDiv);

    const formData = new FormData(e.target);
    const signupData = {
      tenant_slug: formData.get('tenant_slug'),
      email: formData.get('email'),
      password: formData.get('password'),
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      phone: formData.get('phone') || undefined,
      property_unit: formData.get('property_unit') || undefined
    };

    try {
      const response = await axios.post(`${this.apiBaseUrl}/auth/register`, signupData);
      
      if (response.data.success) {
        // Store token and user data
        localStorage.setItem('kenyahoa_token', response.data.token);
        localStorage.setItem('kenyahoa_user', JSON.stringify(response.data.user));
        localStorage.setItem('kenyahoa_tenant', JSON.stringify(response.data.tenant));
        
        this.showToast('Account created successfully! Welcome to KenyaHOA Pro!', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      }
    } catch (error) {
      console.error('Signup error:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      this.showError(errorDiv, errorMessage);
    } finally {
      this.setButtonLoading(submitBtn, false);
    }
  }

  setButtonLoading(button, loading) {
    if (loading) {
      button.classList.add('btn-loading');
      button.disabled = true;
    } else {
      button.classList.remove('btn-loading');
      button.disabled = false;
    }
  }

  showError(errorDiv, message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
  }

  hideError(errorDiv) {
    errorDiv.classList.add('hidden');
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

  closeModal(modal) {
    modal.remove();
  }

  // Utility method to format currency
  formatCurrency(amount, currency = 'KES') {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  }

  // Utility method to format dates
  formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.kenyaHOAApp = new KenyaHOAApp();
});