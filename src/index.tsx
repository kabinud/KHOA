// KenyaHOA Pro - Main Application Entry Point
import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
import { 
  corsMiddleware, 
  loggingMiddleware, 
  rateLimitMiddleware, 
  tenantResolutionMiddleware 
} from './middleware/auth';

// Import routes
import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import propertiesRoutes from './routes/properties';
import paymentsRoutes from './routes/payments';

import type { CloudflareBindings } from './types';

// Create main Hono app with CloudflareBindings type
const app = new Hono<{ Bindings: CloudflareBindings }>();

// Global middleware
app.use('*', loggingMiddleware);
app.use('/api/*', corsMiddleware);
app.use('/api/*', rateLimitMiddleware(200, 15 * 60 * 1000)); // 200 requests per 15 minutes
app.use('*', tenantResolutionMiddleware);

// API Routes
app.route('/api/auth', authRoutes);
app.route('/api/dashboard', dashboardRoutes);
app.route('/api/properties', propertiesRoutes);
app.route('/api/payments', paymentsRoutes);

// Serve static files from public directory
app.use('/static/*', serveStatic({ root: './public' }));
app.use('/favicon.ico', serveStatic({ path: './public/favicon.ico' }));

// API Health check
app.get('/api/health', async (c) => {
  try {
    // Test database connection
    const result = await c.env.DB.prepare('SELECT 1 as test').first();
    
    return c.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: c.env.APP_VERSION || '1.0.0',
      environment: c.env.ENVIRONMENT || 'development',
      database: result ? 'connected' : 'disconnected'
    });
  } catch (error) {
    return c.json({
      success: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed'
    }, 500);
  }
});

// Main application routes (frontend)
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>KenyaHOA Pro - Modern HOA Management for Kenya</title>
        <meta name="description" content="Comprehensive HOA management platform designed specifically for Kenyan homeowner associations. Manage properties, collect payments via M-Pesa, track maintenance, and more.">
        
        <!-- Favicon -->
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
        
        <!-- Tailwind CSS -->
        <script src="https://cdn.tailwindcss.com"></script>
        
        <!-- Font Awesome Icons -->
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
        
        <!-- Custom CSS -->
        <link href="/static/styles.css" rel="stylesheet">
        
        <!-- Tailwind Configuration -->
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  primary: {
                    50: '#f0f9ff',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                  },
                  kenya: {
                    green: '#006633',
                    red: '#cc0000',
                    orange: '#ff6600'
                  }
                }
              }
            }
          }
        </script>
    </head>
    <body class="bg-gray-50 font-sans">
        <!-- Navigation -->
        <nav class="bg-white shadow-lg border-b-2 border-kenya-green">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <h1 class="text-2xl font-bold text-kenya-green">
                                <i class="fas fa-building mr-2"></i>
                                KenyaHOA Pro
                            </h1>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <button id="loginBtn" class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition duration-200">
                            <i class="fas fa-sign-in-alt mr-2"></i>Login
                        </button>
                        <div class="flex space-x-2">
                            <button id="langEn" class="px-2 py-1 rounded text-sm bg-gray-200 hover:bg-gray-300">EN</button>
                            <button id="langSw" class="px-2 py-1 rounded text-sm hover:bg-gray-200">SW</button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <section class="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 class="text-4xl md:text-6xl font-bold mb-6" data-en="Modern HOA Management for Kenya" data-sw="Usimamizi wa Kisasa wa HOA kwa Kenya">
                    Modern HOA Management for Kenya
                </h1>
                <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" data-en="Streamline your homeowner association with M-Pesa payments, maintenance tracking, and resident communication." data-sw="Rahisisha jumuiya yako ya wenyemalezi wa nyumba kwa malipo ya M-Pesa, ufuatiliaji wa matengenezo, na mawasiliano ya wakazi.">
                    Streamline your homeowner association with M-Pesa payments, maintenance tracking, and resident communication.
                </p>
                <div class="space-x-4">
                    <button id="getStartedBtn" class="bg-kenya-orange hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition duration-200">
                        <i class="fas fa-rocket mr-2"></i>
                        <span data-en="Get Started Free" data-sw="Anza Bila Malipo">Get Started Free</span>
                    </button>
                    <button id="learnMoreBtn" class="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg font-semibold text-lg transition duration-200">
                        <i class="fas fa-info-circle mr-2"></i>
                        <span data-en="Learn More" data-sw="Jifunze Zaidi">Learn More</span>
                    </button>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="py-20 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-en="Everything You Need to Manage Your HOA" data-sw="Kila Kitu Unachohitaji Kusimamia HOA Yako">
                        Everything You Need to Manage Your HOA
                    </h2>
                    <p class="text-xl text-gray-600 max-w-2xl mx-auto" data-en="Built specifically for Kenyan communities with local payment methods and Swahili language support." data-sw="Imejengwa maalum kwa jamii za Kikenya na njia za malipo za ndani na msaada wa lugha ya Kiswahili.">
                        Built specifically for Kenyan communities with local payment methods and Swahili language support.
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <!-- M-Pesa Payments -->
                    <div class="bg-gray-50 rounded-lg p-8 text-center hover:shadow-lg transition duration-200">
                        <div class="w-16 h-16 bg-kenya-green rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-mobile-alt text-white text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-3" data-en="M-Pesa Integration" data-sw="Muungano wa M-Pesa">M-Pesa Integration</h3>
                        <p class="text-gray-600" data-en="Collect HOA dues and fees directly through M-Pesa. Automated receipts and tracking." data-sw="Kusanya ada za HOA na ada moja kwa moja kupitia M-Pesa. Risiti za kiotomatiki na ufuatiliaji.">
                            Collect HOA dues and fees directly through M-Pesa. Automated receipts and tracking.
                        </p>
                    </div>

                    <!-- Property Management -->
                    <div class="bg-gray-50 rounded-lg p-8 text-center hover:shadow-lg transition duration-200">
                        <div class="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-building text-white text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-3" data-en="Property Management" data-sw="Usimamizi wa Mali">Property Management</h3>
                        <p class="text-gray-600" data-en="Track properties, residents, and maintenance requests in one place." data-sw="Fuatilia mali, wakazi, na maombi ya matengenezo katika mahali pamoja.">
                            Track properties, residents, and maintenance requests in one place.
                        </p>
                    </div>

                    <!-- Maintenance Tracking -->
                    <div class="bg-gray-50 rounded-lg p-8 text-center hover:shadow-lg transition duration-200">
                        <div class="w-16 h-16 bg-kenya-orange rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-wrench text-white text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-3" data-en="Maintenance Tracking" data-sw="Ufuatiliaji wa Matengenezo">Maintenance Tracking</h3>
                        <p class="text-gray-600" data-en="Streamline maintenance requests from submission to completion." data-sw="Rahisisha maombi ya matengenezo kutoka uwasilishaji hadi ukamilishaji.">
                            Streamline maintenance requests from submission to completion.
                        </p>
                    </div>

                    <!-- Communication -->
                    <div class="bg-gray-50 rounded-lg p-8 text-center hover:shadow-lg transition duration-200">
                        <div class="w-16 h-16 bg-kenya-red rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-bullhorn text-white text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-3" data-en="Community Communication" data-sw="Mawasiliano ya Jamii">Community Communication</h3>
                        <p class="text-gray-600" data-en="Send announcements, notices, and updates to all residents instantly." data-sw="Tuma matangazo, notisi, na masasisho kwa wakazi wote papo hapo.">
                            Send announcements, notices, and updates to all residents instantly.
                        </p>
                    </div>

                    <!-- Financial Reports -->
                    <div class="bg-gray-50 rounded-lg p-8 text-center hover:shadow-lg transition duration-200">
                        <div class="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-chart-bar text-white text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-3" data-en="Financial Reports" data-sw="Ripoti za Fedha">Financial Reports</h3>
                        <p class="text-gray-600" data-en="Generate comprehensive financial reports and budget tracking." data-sw="Tengeneza ripoti kamili za kifedha na ufuatiliaji wa bajeti.">
                            Generate comprehensive financial reports and budget tracking.
                        </p>
                    </div>

                    <!-- Document Management -->
                    <div class="bg-gray-50 rounded-lg p-8 text-center hover:shadow-lg transition duration-200">
                        <div class="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-file-text text-white text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-3" data-en="Document Management" data-sw="Usimamizi wa Hati">Document Management</h3>
                        <p class="text-gray-600" data-en="Store and share HOA documents, bylaws, and meeting minutes." data-sw="Hifadhi na shiriki hati za HOA, sheria, na kumbuka za mikutano.">
                            Store and share HOA documents, bylaws, and meeting minutes.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Pricing Section -->
        <section class="py-20 bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-en="Simple, Transparent Pricing" data-sw="Bei Rahisi na Uwazi">
                        Simple, Transparent Pricing
                    </h2>
                    <p class="text-xl text-gray-600" data-en="Pay only for the units you manage. No hidden fees." data-sw="Lipa tu kwa units unazosimamia. Hakuna ada zilizofichwa.">
                        Pay only for the units you manage. No hidden fees.
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <!-- Starter Plan -->
                    <div class="bg-white rounded-lg p-8 border-2 border-gray-200 hover:border-primary-300 transition duration-200">
                        <div class="text-center">
                            <h3 class="text-2xl font-bold text-gray-900 mb-2" data-en="Starter" data-sw="Mwanzo">Starter</h3>
                            <div class="text-4xl font-bold text-primary-600 mb-2">KES 150</div>
                            <div class="text-gray-600 mb-6" data-en="per unit/month" data-sw="kwa kipimo/mwezi">per unit/month</div>
                            <div class="text-sm text-gray-500 mb-6" data-en="1-25 units" data-sw="vipimo 1-25">1-25 units</div>
                        </div>
                        <ul class="space-y-3 mb-8">
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-check text-green-500 mr-3"></i>
                                <span data-en="Property & Resident Management" data-sw="Usimamizi wa Mali na Wakazi">Property & Resident Management</span>
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-check text-green-500 mr-3"></i>
                                <span data-en="M-Pesa Payment Collection" data-sw="Ukusanyaji wa Malipo ya M-Pesa">M-Pesa Payment Collection</span>
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-check text-green-500 mr-3"></i>
                                <span data-en="Basic Reporting" data-sw="Ripoti za Kimsingi">Basic Reporting</span>
                            </li>
                        </ul>
                        <button class="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-semibold transition duration-200">
                            <span data-en="Start Free Trial" data-sw="Anza Majaribio ya Bure">Start Free Trial</span>
                        </button>
                    </div>

                    <!-- Professional Plan -->
                    <div class="bg-white rounded-lg p-8 border-2 border-primary-500 relative hover:shadow-xl transition duration-200">
                        <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <span class="bg-primary-500 text-white px-6 py-2 rounded-full text-sm font-semibold" data-en="Most Popular" data-sw="Maarufu Zaidi">Most Popular</span>
                        </div>
                        <div class="text-center">
                            <h3 class="text-2xl font-bold text-gray-900 mb-2" data-en="Professional" data-sw="Kitaalamu">Professional</h3>
                            <div class="text-4xl font-bold text-primary-600 mb-2">KES 120</div>
                            <div class="text-gray-600 mb-6" data-en="per unit/month" data-sw="kwa kipimo/mwezi">per unit/month</div>
                            <div class="text-sm text-gray-500 mb-6" data-en="26-100 units" data-sw="vipimo 26-100">26-100 units</div>
                        </div>
                        <ul class="space-y-3 mb-8">
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-check text-green-500 mr-3"></i>
                                <span data-en="Everything in Starter" data-sw="Kila Kitu katika Mwanzo">Everything in Starter</span>
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-check text-green-500 mr-3"></i>
                                <span data-en="Advanced Maintenance Management" data-sw="Usimamizi wa Juu wa Matengenezo">Advanced Maintenance Management</span>
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-check text-green-500 mr-3"></i>
                                <span data-en="Financial Reports & Analytics" data-sw="Ripoti za Kifedha na Uchambuzi">Financial Reports & Analytics</span>
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-check text-green-500 mr-3"></i>
                                <span data-en="Document Management" data-sw="Usimamizi wa Hati">Document Management</span>
                            </li>
                        </ul>
                        <button class="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-semibold transition duration-200">
                            <span data-en="Start Free Trial" data-sw="Anza Majaribio ya Bure">Start Free Trial</span>
                        </button>
                    </div>

                    <!-- Enterprise Plan -->
                    <div class="bg-white rounded-lg p-8 border-2 border-gray-200 hover:border-primary-300 transition duration-200">
                        <div class="text-center">
                            <h3 class="text-2xl font-bold text-gray-900 mb-2" data-en="Enterprise" data-sw="Biashara">Enterprise</h3>
                            <div class="text-4xl font-bold text-primary-600 mb-2">KES 100</div>
                            <div class="text-gray-600 mb-6" data-en="per unit/month" data-sw="kwa kipimo/mwezi">per unit/month</div>
                            <div class="text-sm text-gray-500 mb-6" data-en="100+ units" data-sw="vipimo 100+">100+ units</div>
                        </div>
                        <ul class="space-y-3 mb-8">
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-check text-green-500 mr-3"></i>
                                <span data-en="Everything in Professional" data-sw="Kila Kitu katika Kitaalamu">Everything in Professional</span>
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-check text-green-500 mr-3"></i>
                                <span data-en="Custom Integrations" data-sw="Muunganisho wa Kibinafsi">Custom Integrations</span>
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-check text-green-500 mr-3"></i>
                                <span data-en="Dedicated Account Manager" data-sw="Meneja wa Akaunti wa Pekee">Dedicated Account Manager</span>
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-check text-green-500 mr-3"></i>
                                <span data-en="Priority Support" data-sw="Msaada wa Kipaumbele">Priority Support</span>
                            </li>
                        </ul>
                        <button class="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-semibold transition duration-200">
                            <span data-en="Contact Sales" data-sw="Wasiliana na Mauzo">Contact Sales</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="bg-gray-900 text-white py-16">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 class="text-2xl font-bold text-kenya-orange mb-4">KenyaHOA Pro</h3>
                        <p class="text-gray-400 mb-4" data-en="Modern HOA management designed for Kenyan communities." data-sw="Usimamizi wa kisasa wa HOA uliobuniwa kwa jamii za Kikenya.">
                            Modern HOA management designed for Kenyan communities.
                        </p>
                        <div class="flex space-x-4">
                            <i class="fab fa-twitter text-primary-400 text-xl cursor-pointer hover:text-primary-300"></i>
                            <i class="fab fa-facebook text-primary-400 text-xl cursor-pointer hover:text-primary-300"></i>
                            <i class="fab fa-linkedin text-primary-400 text-xl cursor-pointer hover:text-primary-300"></i>
                        </div>
                    </div>
                    
                    <div>
                        <h4 class="text-lg font-semibold mb-4" data-en="Features" data-sw="Vipengele">Features</h4>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="#" class="hover:text-white transition duration-200" data-en="Property Management" data-sw="Usimamizi wa Mali">Property Management</a></li>
                            <li><a href="#" class="hover:text-white transition duration-200" data-en="M-Pesa Payments" data-sw="Malipo ya M-Pesa">M-Pesa Payments</a></li>
                            <li><a href="#" class="hover:text-white transition duration-200" data-en="Maintenance Tracking" data-sw="Ufuatiliaji wa Matengenezo">Maintenance Tracking</a></li>
                            <li><a href="#" class="hover:text-white transition duration-200" data-en="Financial Reports" data-sw="Ripoti za Kifedha">Financial Reports</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 class="text-lg font-semibold mb-4" data-en="Support" data-sw="Msaada">Support</h4>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="#" class="hover:text-white transition duration-200" data-en="Help Center" data-sw="Kituo cha Msaada">Help Center</a></li>
                            <li><a href="#" class="hover:text-white transition duration-200" data-en="Contact Us" data-sw="Wasiliana Nasi">Contact Us</a></li>
                            <li><a href="#" class="hover:text-white transition duration-200" data-en="API Documentation" data-sw="Hati za API">API Documentation</a></li>
                            <li><a href="#" class="hover:text-white transition duration-200" data-en="System Status" data-sw="Hali ya Mfumo">System Status</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 class="text-lg font-semibold mb-4" data-en="Company" data-sw="Kampuni">Company</h4>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="#" class="hover:text-white transition duration-200" data-en="About Us" data-sw="Kuhusu Sisi">About Us</a></li>
                            <li><a href="#" class="hover:text-white transition duration-200" data-en="Privacy Policy" data-sw="Sera ya Faragha">Privacy Policy</a></li>
                            <li><a href="#" class="hover:text-white transition duration-200" data-en="Terms of Service" data-sw="Masharti ya Huduma">Terms of Service</a></li>
                            <li><a href="#" class="hover:text-white transition duration-200" data-en="Careers" data-sw="Kazi">Careers</a></li>
                        </ul>
                    </div>
                </div>
                
                <div class="border-t border-gray-700 mt-12 pt-8 text-center">
                    <p class="text-gray-400">
                        &copy; 2025 KenyaHOA Pro. 
                        <span data-en="All rights reserved." data-sw="Haki zote zimehifadhiwa.">All rights reserved.</span>
                    </p>
                </div>
            </div>
        </footer>

        <!-- Axios for API calls -->
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        
        <!-- Custom JavaScript -->
        <script src="/static/app.js"></script>
    </body>
    </html>
  `);
});

// Dashboard route (requires authentication)
app.get('/dashboard', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dashboard - KenyaHOA Pro</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/styles.css" rel="stylesheet">
    </head>
    <body class="bg-gray-100">
        <div id="dashboard-app"></div>
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/dashboard.js"></script>
    </body>
    </html>
  `);
});

// Login page
app.get('/login', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login - KenyaHOA Pro</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/styles.css" rel="stylesheet">
    </head>
    <body class="bg-gray-100">
        <div id="login-app"></div>
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/login.js"></script>
    </body>
    </html>
  `);
});

// 404 handler
app.notFound((c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Page Not Found - KenyaHOA Pro</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-100 flex items-center justify-center min-h-screen">
        <div class="text-center">
            <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <p class="text-xl text-gray-600 mb-8">Page not found</p>
            <a href="/" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
                Go Home
            </a>
        </div>
    </body>
    </html>
  `, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Application error:', err);
  return c.json({ 
    error: 'Internal server error', 
    message: 'An unexpected error occurred' 
  }, 500);
});

export default app;
