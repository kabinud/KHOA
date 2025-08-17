# 🏘️ KenyaHOA Pro - Comprehensive HOA Management Platform

> Modern HOA management designed specifically for Kenyan homeowner associations

## 🌟 Project Overview

**KenyaHOA Pro** is a comprehensive, multi-tenant HOA (Homeowner Association) management platform built specifically for the Kenyan market. It combines modern web technologies with local payment methods and cultural considerations to provide the ultimate solution for managing residential communities across Kenya.

### 🎯 Key Goals
- **Kenya-First Design**: Built around M-Pesa, Swahili language, and local business practices
- **Multi-Tenant Architecture**: Secure data isolation for multiple HOAs on one platform
- **Subscription-Based Revenue**: Scalable pricing model based on number of units managed
- **Mobile-First Experience**: Progressive Web App optimized for smartphones
- **Edge Performance**: Sub-50ms response times across Kenya using Cloudflare Workers

## 🚀 Currently Implemented Features

### ✅ **Authentication & Authorization**
- JWT-based authentication with secure token management
- Comprehensive role-based access control (RBAC) system
- Multi-tenant user isolation and security
- Password validation and hashing with bcrypt
- **Super Admin Account**: Platform-level administration access

### ✅ **Property Management**
- Complete property registry with unit details
- Resident management and relationships
- Move-in/move-out tracking
- Property status management (occupied, vacant, maintenance)

### ✅ **Financial Management**
- Transaction recording and tracking
- M-Pesa payment integration (with mock service for development)
- Outstanding payment tracking
- Payment history and receipts

### ✅ **Dashboard & Analytics**
- Real-time statistics and metrics
- User-specific dashboard data
- Recent activities and notifications
- Quick action buttons based on user roles

### ✅ **Multi-Language Support**
- English and Swahili language switching
- Localized content and date/currency formatting
- Cultural adaptations for Kenyan users

### ✅ **Modern Frontend**
- Responsive design with TailwindCSS
- Kenya flag color scheme
- Progressive Web App capabilities

## 🔧 Installation & Setup

### Prerequisites

- **Node.js** (v18 or later)
- **npm** or **yarn**
- **Git**
- **Cloudflare Account** (for deployment)

### 🏠 Local Development Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/kabinud/KHOA.git
   cd KHOA
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build the Project**
   ```bash
   npm run build
   ```

4. **Start Development Server**
   ```bash
   # Option 1: Using PM2 (Recommended for sandbox environments)
   pm2 start ecosystem.config.cjs
   
   # Option 2: Direct start (for local machines)
   npm run dev
   ```

5. **Access the Application**
   - **Local**: http://localhost:3000
   - **Health Check**: http://localhost:3000/api/health

### 🎭 Demo Accounts

The application comes pre-loaded with demo accounts for testing:

| Role | Email | Password | HOA |
|------|-------|----------|-----|
| **Super Admin** | `superadmin@kenyahoa.com` | `demo123` | Platform Admin |
| HOA Admin | `admin.garden@kenyahoa.com` | `demo123` | Garden Estate |
| HOA Admin | `admin.riverside@kenyahoa.com` | `demo123` | Riverside Towers |
| Maintenance | `maintenance.garden@kenyahoa.com` | `demo123` | Garden Estate |
| Resident | `owner.garden@kenyahoa.com` | `demo123` | Garden Estate |

**🔑 Super Admin Login:**
- **Email**: `superadmin@kenyahoa.com`
- **Password**: `demo123`
- **Access Level**: Full platform administration

### 📊 Testing Platform

Use the built-in test pages for functionality verification:
- **Demo Accounts**: Click "Try Demo HOAs" on homepage
- **Super Admin Test**: `/test-super-admin.html`
- **Maintenance Test**: `/test-maintenance-login.html`

## 🌐 Deployment to Cloudflare Pages

### 🔑 Prerequisites Setup

1. **Cloudflare API Token Setup**
   - Go to [Cloudflare API Tokens](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)
   - Create a token with permissions:
     - `Zone:Zone:Read`
     - `Zone:Zone Settings:Edit`
     - `Account:Cloudflare Workers:Edit`
     - `Account:Page:Edit`

2. **GitHub Repository Setup**
   - Ensure your code is pushed to GitHub
   - Repository should be public or accessible to Cloudflare

### 🚀 Deployment Steps

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Install Wrangler CLI** (if not already installed)
   ```bash
   npm install -g wrangler
   ```

3. **Authenticate with Cloudflare**
   ```bash
   wrangler login
   # OR set environment variable
   export CLOUDFLARE_API_TOKEN=your_token_here
   ```

4. **Create Cloudflare Pages Project**
   ```bash
   # Replace 'your-project-name' with desired name
   npx wrangler pages project create your-project-name \
     --production-branch main \
     --compatibility-date 2025-08-17
   ```

5. **Deploy to Cloudflare Pages**
   ```bash
   npm run deploy:prod
   # OR manually:
   npx wrangler pages deploy dist --project-name your-project-name
   ```

6. **Configure Environment Variables** (Optional)
   ```bash
   # Set production environment variables
   npx wrangler pages secret put APP_ENV --project-name your-project-name
   # Enter 'production' when prompted
   
   npx wrangler pages secret put JWT_SECRET --project-name your-project-name
   # Enter a strong secret key when prompted
   ```

### 🗄️ Database Setup (D1)

For production with persistent data storage:

1. **Create D1 Database**
   ```bash
   npx wrangler d1 create kenyahoa-production
   ```

2. **Update wrangler.jsonc**
   ```jsonc
   {
     "d1_databases": [
       {
         "binding": "DB",
         "database_name": "kenyahoa-production",
         "database_id": "your-database-id-from-step-1"
       }
     ]
   }
   ```

3. **Apply Migrations**
   ```bash
   npx wrangler d1 migrations apply kenyahoa-production
   ```

4. **Seed Database** (Optional)
   ```bash
   npx wrangler d1 execute kenyahoa-production --file=./seed.sql
   ```

### 🔐 Custom Domain Setup (Optional)

1. **Add Custom Domain**
   ```bash
   npx wrangler pages domain add yourdomain.com --project-name your-project-name
   ```

2. **Update DNS Records**
   - Add CNAME record pointing to `your-project-name.pages.dev`

## 📁 Project Structure

```
kenyahoa-pro/
├── 📂 src/                    # Backend source code
│   ├── 📄 index.tsx          # Main Hono application
│   ├── 📂 routes/            # API route handlers
│   ├── 📂 middleware/        # Authentication & logging
│   ├── 📂 services/          # Business logic services
│   ├── 📂 utils/             # Utilities & helpers
│   └── 📂 types/             # TypeScript definitions
├── 📂 public/                # Static frontend assets
│   └── 📂 static/            # CSS, JS, and images
├── 📂 migrations/            # Database schema migrations
├── 📄 package.json           # Dependencies & scripts
├── 📄 wrangler.jsonc         # Cloudflare configuration
├── 📄 vite.config.ts         # Build configuration
└── 📄 ecosystem.config.cjs   # PM2 configuration
```

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build |
| `npm run deploy` | Deploy to Cloudflare Pages |
| `npm run deploy:prod` | Build and deploy to production |
| `npm run test` | Test API endpoints |
| `npm run clean-port` | Kill processes on port 3000 |

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds for security
- **Role-Based Access**: Granular permission system
- **Multi-Tenant Isolation**: Complete data separation
- **Rate Limiting**: API endpoint protection
- **Input Validation**: Comprehensive request sanitization

## 🚪 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/verify` - Token verification
- `GET /api/auth/demo-accounts` - Get demo accounts

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/my-data` - User-specific data

### System
- `GET /api/health` - Health check endpoint

## 🌍 Live URLs

- **Production**: https://kenyahoa-pro.pages.dev
- **GitHub Repository**: https://github.com/kabinud/KHOA
- **API Health Check**: https://kenyahoa-pro.pages.dev/api/health

## 🔄 Database Architecture

### 📊 Data Models Used
- **Platform Tenants**: Multi-tenant HOA instances
- **Users**: Authentication and role management
- **Properties**: Unit and property information
- **Residents**: Property-resident relationships
- **Financial Transactions**: Payment and fee tracking
- **Maintenance Requests**: Facility maintenance tracking
- **Announcements**: Community communications

### 💾 Storage Services
- **Primary Database**: Cloudflare D1 (SQLite-based)
- **Session Storage**: JWT tokens with local storage
- **File Storage**: Cloudflare R2 (when needed)

## 👤 User Guide

### 🔐 Logging In
1. Visit the application homepage
2. Click "Try Demo HOAs" for quick access
3. Select from available demo accounts
4. Or use manual login with credentials above

### 🏠 For HOA Admins
- **Dashboard**: View property statistics and recent activities
- **Property Management**: Add/edit units and resident information
- **Financial Tracking**: Record payments and generate reports
- **Maintenance**: Track and assign maintenance requests
- **Communications**: Send announcements to residents

### 👑 For Super Admins
- **Platform Overview**: Monitor all HOAs and users
- **HOA Management**: Create and configure new HOAs
- **User Administration**: Manage platform users and roles
- **System Analytics**: View platform-wide statistics

## 🔧 Development Status

- **Platform**: ✅ Active
- **Database**: ✅ Functional (Mock/Contextual for development)
- **Authentication**: ✅ Working (Including Super Admin)
- **Frontend**: ✅ Responsive and functional
- **API**: ✅ RESTful endpoints operational
- **Deployment**: ✅ Cloudflare Pages ready

## 🚀 Recommended Next Steps

1. **Production Database**: Set up D1 database for persistent storage
2. **M-Pesa Integration**: Implement live payment processing
3. **Email Notifications**: Add email service for communications
4. **Mobile App**: Develop React Native companion app
5. **Advanced Analytics**: Implement detailed reporting features

## 📞 Support & Contact

- **Repository Issues**: https://github.com/kabinud/KHOA/issues
- **Email**: admin@kenyahoa.com
- **Documentation**: See inline code comments and API docs

---

**🇰🇪 Built with ❤️ for Kenyan Communities**

*Last Updated: August 17, 2025*