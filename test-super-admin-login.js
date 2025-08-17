// Super Admin Login Test Script
// Run this in browser console to test the login functionality

async function testSuperAdminLogin() {
  console.log('🔍 Testing Super Admin Login...');
  
  try {
    // Step 1: Check if demo accounts are loaded
    console.log('📋 Checking available accounts...');
    const accounts = window.kenyaHOAApp?.availableAccounts || [];
    const superAdmin = accounts.find(acc => acc.role === 'Super Admin');
    
    if (!superAdmin) {
      console.error('❌ Super Admin account not found in availableAccounts');
      return false;
    }
    
    console.log('✅ Super Admin account found:', superAdmin);
    
    // Step 2: Test API login directly
    console.log('🔌 Testing API login...');
    const apiResponse = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: superAdmin.email,
        password: superAdmin.password
      })
    });
    
    const apiData = await apiResponse.json();
    console.log('API Response:', apiData);
    
    if (!apiData.success) {
      console.error('❌ API login failed:', apiData.message);
      return false;
    }
    
    console.log('✅ API login successful');
    
    // Step 3: Test frontend login method
    console.log('🎯 Testing frontend loginWithAccount method...');
    
    if (!window.kenyaHOAApp) {
      console.error('❌ window.kenyaHOAApp not available');
      return false;
    }
    
    if (!window.kenyaHOAApp.loginWithAccount) {
      console.error('❌ loginWithAccount method not available');
      return false;
    }
    
    console.log('✅ Frontend method available');
    
    // Step 4: Call the login method
    console.log('🚀 Calling loginWithAccount...');
    await window.kenyaHOAApp.loginWithAccount(superAdmin.email);
    
    // Check if login data was stored
    setTimeout(() => {
      const token = localStorage.getItem('kenyahoa_token');
      const user = localStorage.getItem('kenyahoa_user');
      const tenant = localStorage.getItem('kenyahoa_tenant');
      
      console.log('💾 Local Storage Check:');
      console.log('Token:', token);
      console.log('User:', user);
      console.log('Tenant:', tenant);
      
      if (token && user) {
        console.log('✅ Super Admin login test PASSED!');
      } else {
        console.log('❌ Super Admin login test FAILED - data not stored');
      }
    }, 1000);
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return false;
  }
}

// Auto-run test
testSuperAdminLogin();