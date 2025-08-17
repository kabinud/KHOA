// Test complete browser login flow
const { chromium } = require('playwright');

async function testLoginFlow() {
  console.log('🚀 Starting browser login flow test...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listen for console logs and errors
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));
  
  try {
    // 1. Load main page
    console.log('📖 Loading main page...');
    await page.goto('https://3000-i9t4opu503bw4101dskwh-6532622b.e2b.dev', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // 2. Wait for demo login button and click it
    console.log('🔍 Looking for demo login button...');
    await page.waitForSelector('[onclick*="showDemoAccountSelector"]', { timeout: 10000 });
    
    console.log('👆 Clicking demo login button...');
    await page.click('[onclick*="showDemoAccountSelector"]');
    
    // 3. Wait for demo accounts modal and select first admin
    console.log('⏳ Waiting for demo accounts modal...');
    await page.waitForSelector('.demo-account-item', { timeout: 5000 });
    
    console.log('👆 Clicking first demo account...');
    await page.click('.demo-account-item:first-child');
    
    // 4. Wait for redirect to dashboard
    console.log('⏳ Waiting for dashboard redirect...');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    // 5. Check if dashboard content loads
    console.log('📊 Checking dashboard content...');
    await page.waitForTimeout(3000); // Give JavaScript time to load
    
    const dashboardContent = await page.textContent('body');
    console.log('📄 Dashboard content length:', dashboardContent.length);
    
    // 6. Check localStorage for auth data
    const authData = await page.evaluate(() => {
      return {
        token: localStorage.getItem('kenyahoa_token'),
        user: localStorage.getItem('kenyahoa_user'),
        tenant: localStorage.getItem('kenyahoa_tenant')
      };
    });
    
    console.log('🔑 Auth data in localStorage:');
    console.log('  Token:', authData.token ? 'Present' : 'Missing');
    console.log('  User:', authData.user ? 'Present' : 'Missing'); 
    console.log('  Tenant:', authData.tenant ? 'Present' : 'Missing');
    
    // 7. Check for any JavaScript errors
    const errorLogs = await page.evaluate(() => {
      return window.__errorLogs || [];
    });
    
    if (errorLogs.length > 0) {
      console.log('❌ JavaScript errors found:', errorLogs);
    } else {
      console.log('✅ No JavaScript errors detected');
    }
    
    console.log('✅ Test completed successfully');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the test
testLoginFlow().catch(console.error);