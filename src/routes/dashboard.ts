// Dashboard routes for KenyaHOA Pro
import { Hono } from 'hono';
import { Database } from '../utils/database';
import { authMiddleware, getCurrentUser, getCurrentTenant, requireResident } from '../middleware/auth';
import type { CloudflareBindings, DashboardStats } from '../types';

const dashboard = new Hono<{ Bindings: CloudflareBindings }>();

// Apply authentication middleware
dashboard.use('*', authMiddleware);
dashboard.use('*', requireResident);

// Get dashboard statistics
dashboard.get('/stats', async (c) => {
  try {
    const user = getCurrentUser(c)!;
    const tenant = getCurrentTenant(c)!;
    const db = new Database(c.env.DB);

    // Get basic statistics
    const [
      totalProperties,
      occupiedProperties,
      totalResidents,
      pendingMaintenance,
      overduePayments,
      monthlyRevenue
    ] = await Promise.all([
      // Total properties
      db.queryFirst<{ count: number }>(
        'SELECT COUNT(*) as count FROM properties WHERE tenant_id = ?',
        [tenant.id]
      ).then(result => result?.count || 0),

      // Occupied properties
      db.queryFirst<{ count: number }>(
        'SELECT COUNT(*) as count FROM properties WHERE tenant_id = ? AND status = "occupied"',
        [tenant.id]
      ).then(result => result?.count || 0),

      // Total residents
      db.queryFirst<{ count: number }>(
        'SELECT COUNT(*) as count FROM residents WHERE tenant_id = ? AND status = "active"',
        [tenant.id]
      ).then(result => result?.count || 0),

      // Pending maintenance requests
      db.queryFirst<{ count: number }>(
        'SELECT COUNT(*) as count FROM maintenance_requests WHERE tenant_id = ? AND status IN ("submitted", "acknowledged", "in_progress")',
        [tenant.id]
      ).then(result => result?.count || 0),

      // Overdue payments
      db.queryFirst<{ count: number }>(
        'SELECT COUNT(*) as count FROM financial_transactions WHERE tenant_id = ? AND status = "pending" AND due_date < date("now")',
        [tenant.id]
      ).then(result => result?.count || 0),

      // Monthly revenue (current month)
      db.queryFirst<{ total: number }>(
        `SELECT COALESCE(SUM(amount), 0) as total 
         FROM financial_transactions 
         WHERE tenant_id = ? 
         AND status = "paid" 
         AND strftime('%Y-%m', payment_date) = strftime('%Y-%m', 'now')`,
        [tenant.id]
      ).then(result => result?.total || 0)
    ]);

    // Get recent activities
    const recentActivities = await db.query<any>(
      `SELECT 
        'maintenance' as type,
        'New maintenance request: ' || title as message,
        submitted_at as timestamp,
        (SELECT first_name || ' ' || last_name FROM users WHERE id = 
          (SELECT user_id FROM residents WHERE id = maintenance_requests.resident_id)
        ) as user
       FROM maintenance_requests 
       WHERE tenant_id = ? 
       
       UNION ALL
       
       SELECT 
        'payment' as type,
        'Payment received: KES ' || amount || ' for ' || description as message,
        payment_date as timestamp,
        (SELECT first_name || ' ' || last_name FROM users WHERE id = 
          (SELECT user_id FROM residents WHERE id = financial_transactions.resident_id)
        ) as user
       FROM financial_transactions 
       WHERE tenant_id = ? AND status = 'paid' AND payment_date IS NOT NULL
       
       UNION ALL
       
       SELECT 
        'announcement' as type,
        'New announcement: ' || title as message,
        published_at as timestamp,
        (SELECT first_name || ' ' || last_name FROM users WHERE id = announcements.created_by) as user
       FROM announcements 
       WHERE tenant_id = ? AND published_at IS NOT NULL
       
       ORDER BY timestamp DESC 
       LIMIT 10`,
      [tenant.id, tenant.id, tenant.id]
    );

    const stats: DashboardStats = {
      total_properties: totalProperties,
      occupied_properties: occupiedProperties,
      total_residents: totalResidents,
      pending_maintenance: pendingMaintenance,
      overdue_payments: overduePayments,
      monthly_revenue: monthlyRevenue,
      recent_activities: recentActivities.map(activity => ({
        type: activity.type,
        message: activity.message,
        timestamp: activity.timestamp,
        user: activity.user || 'System'
      }))
    };

    return c.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return c.json({ error: 'Request failed', message: 'Unable to fetch dashboard statistics' }, 500);
  }
});

// Get user-specific dashboard data
dashboard.get('/my-data', async (c) => {
  try {
    const user = getCurrentUser(c)!;
    const tenant = getCurrentTenant(c)!;
    const db = new Database(c.env.DB);

    // Get user's properties and resident records
    const myProperties = await db.query<any>(
      `SELECT 
        p.id,
        p.unit_number,
        p.property_type,
        p.bedrooms,
        p.bathrooms,
        p.monthly_dues,
        p.status,
        r.relationship_type,
        r.move_in_date
       FROM properties p
       JOIN residents r ON p.id = r.property_id
       WHERE r.user_id = ? AND r.tenant_id = ? AND r.status = 'active'`,
      [user.id, tenant.id]
    );

    // Get user's maintenance requests
    const myMaintenanceRequests = await db.query<any>(
      `SELECT 
        mr.id,
        mr.title,
        mr.category,
        mr.priority,
        mr.status,
        mr.submitted_at,
        p.unit_number
       FROM maintenance_requests mr
       JOIN residents r ON mr.resident_id = r.id
       JOIN properties p ON mr.property_id = p.id
       WHERE r.user_id = ? AND mr.tenant_id = ?
       ORDER BY mr.submitted_at DESC
       LIMIT 5`,
      [user.id, tenant.id]
    );

    // Get user's financial transactions
    const myTransactions = await db.query<any>(
      `SELECT 
        ft.id,
        ft.transaction_type,
        ft.category,
        ft.amount,
        ft.due_date,
        ft.payment_date,
        ft.status,
        ft.description,
        p.unit_number
       FROM financial_transactions ft
       LEFT JOIN properties p ON ft.property_id = p.id
       JOIN residents r ON ft.resident_id = r.id
       WHERE r.user_id = ? AND ft.tenant_id = ?
       ORDER BY ft.created_at DESC
       LIMIT 5`,
      [user.id, tenant.id]
    );

    // Get outstanding payments
    const outstandingPayments = await db.query<any>(
      `SELECT 
        ft.id,
        ft.amount,
        ft.due_date,
        ft.description,
        p.unit_number
       FROM financial_transactions ft
       LEFT JOIN properties p ON ft.property_id = p.id
       JOIN residents r ON ft.resident_id = r.id
       WHERE r.user_id = ? AND ft.tenant_id = ? AND ft.status = 'pending'
       ORDER BY ft.due_date ASC`,
      [user.id, tenant.id]
    );

    return c.json({
      success: true,
      data: {
        properties: myProperties,
        maintenance_requests: myMaintenanceRequests,
        recent_transactions: myTransactions,
        outstanding_payments: outstandingPayments,
        user_info: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role,
          phone: user.phone
        }
      }
    });

  } catch (error) {
    console.error('User dashboard data error:', error);
    return c.json({ error: 'Request failed', message: 'Unable to fetch your dashboard data' }, 500);
  }
});

// Get quick actions available to user
dashboard.get('/quick-actions', async (c) => {
  try {
    const user = getCurrentUser(c)!;
    const tenant = getCurrentTenant(c)!;

    // Define quick actions based on user role
    const baseActions = [
      {
        id: 'view-announcements',
        title: 'View Announcements',
        description: 'Check latest HOA announcements',
        icon: 'bullhorn',
        url: '/announcements',
        available: true
      },
      {
        id: 'view-documents',
        title: 'HOA Documents',
        description: 'Access bylaws, policies, and forms',
        icon: 'file-text',
        url: '/documents',
        available: true
      }
    ];

    const residentActions = [
      {
        id: 'submit-maintenance',
        title: 'Submit Maintenance Request',
        description: 'Report maintenance issues',
        icon: 'wrench',
        url: '/maintenance/new',
        available: true
      },
      {
        id: 'view-payments',
        title: 'View Payments',
        description: 'Check payment history and dues',
        icon: 'credit-card',
        url: '/payments',
        available: true
      },
      {
        id: 'book-amenity',
        title: 'Book Amenities',
        description: 'Reserve community facilities',
        icon: 'calendar',
        url: '/amenities/book',
        available: true
      }
    ];

    const managementActions = [
      {
        id: 'manage-properties',
        title: 'Manage Properties',
        description: 'Add and edit property information',
        icon: 'building',
        url: '/admin/properties',
        available: true
      },
      {
        id: 'manage-residents',
        title: 'Manage Residents',
        description: 'View and edit resident information',
        icon: 'users',
        url: '/admin/residents',
        available: true
      },
      {
        id: 'financial-reports',
        title: 'Financial Reports',
        description: 'View financial statements and reports',
        icon: 'bar-chart',
        url: '/admin/financial-reports',
        available: true
      },
      {
        id: 'create-announcement',
        title: 'Create Announcement',
        description: 'Send notifications to residents',
        icon: 'megaphone',
        url: '/admin/announcements/new',
        available: true
      }
    ];

    const boardActions = [
      {
        id: 'create-vote',
        title: 'Create Vote',
        description: 'Set up community voting',
        icon: 'vote',
        url: '/admin/votes/new',
        available: true
      },
      {
        id: 'manage-vendors',
        title: 'Manage Vendors',
        description: 'Add and manage service providers',
        icon: 'briefcase',
        url: '/admin/vendors',
        available: true
      }
    ];

    // Combine actions based on user role
    let availableActions = [...baseActions];

    if (['resident_owner', 'resident_tenant'].includes(user.role)) {
      availableActions.push(...residentActions);
    }

    if (['hoa_admin', 'property_manager', 'financial_officer', 'maintenance_supervisor'].includes(user.role)) {
      availableActions.push(...managementActions);
    }

    if (['hoa_admin', 'board_president', 'board_member'].includes(user.role)) {
      availableActions.push(...boardActions);
    }

    // Super admin gets all actions
    if (user.role === 'super_admin') {
      availableActions.push(...residentActions, ...managementActions, ...boardActions);
    }

    return c.json({
      success: true,
      data: {
        actions: availableActions
      }
    });

  } catch (error) {
    console.error('Quick actions error:', error);
    return c.json({ error: 'Request failed', message: 'Unable to fetch quick actions' }, 500);
  }
});

// Get recent notifications for user
dashboard.get('/notifications', async (c) => {
  try {
    const user = getCurrentUser(c)!;
    const tenant = getCurrentTenant(c)!;
    const db = new Database(c.env.DB);

    // Get recent announcements relevant to user
    const announcements = await db.query<any>(
      `SELECT 
        id,
        title,
        category,
        priority,
        published_at as timestamp,
        'announcement' as type
       FROM announcements 
       WHERE tenant_id = ? 
       AND published_at IS NOT NULL 
       AND (expires_at IS NULL OR expires_at > datetime('now'))
       AND (target_audience = 'all' OR 
            (target_audience = 'owners' AND ? IN ('resident_owner', 'hoa_admin', 'board_president', 'board_member')) OR
            (target_audience = 'tenants' AND ? = 'resident_tenant') OR
            (target_audience = 'board_members' AND ? IN ('hoa_admin', 'board_president', 'board_member')))
       ORDER BY published_at DESC 
       LIMIT 5`,
      [tenant.id, user.role, user.role, user.role]
    );

    // Get maintenance request updates (for residents)
    let maintenanceUpdates: any[] = [];
    if (['resident_owner', 'resident_tenant'].includes(user.role)) {
      maintenanceUpdates = await db.query<any>(
        `SELECT 
          mr.id,
          'Maintenance request "' || mr.title || '" status: ' || mr.status as title,
          mr.category,
          'medium' as priority,
          mr.updated_at as timestamp,
          'maintenance' as type
         FROM maintenance_requests mr
         JOIN residents r ON mr.resident_id = r.id
         WHERE r.user_id = ? AND mr.tenant_id = ?
         AND mr.updated_at > datetime('now', '-7 days')
         ORDER BY mr.updated_at DESC 
         LIMIT 3`,
        [user.id, tenant.id]
      );
    }

    // Get payment reminders
    let paymentReminders: any[] = [];
    if (['resident_owner', 'resident_tenant'].includes(user.role)) {
      paymentReminders = await db.query<any>(
        `SELECT 
          ft.id,
          'Payment due: ' || ft.description as title,
          ft.category,
          CASE 
            WHEN ft.due_date < date('now') THEN 'urgent'
            WHEN ft.due_date <= date('now', '+3 days') THEN 'high'
            ELSE 'medium'
          END as priority,
          ft.due_date as timestamp,
          'payment' as type
         FROM financial_transactions ft
         JOIN residents r ON ft.resident_id = r.id
         WHERE r.user_id = ? AND ft.tenant_id = ? 
         AND ft.status = 'pending'
         AND ft.due_date <= date('now', '+7 days')
         ORDER BY ft.due_date ASC 
         LIMIT 3`,
        [user.id, tenant.id]
      );
    }

    // Combine all notifications
    const allNotifications = [
      ...announcements,
      ...maintenanceUpdates,
      ...paymentReminders
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return c.json({
      success: true,
      data: {
        notifications: allNotifications.slice(0, 10) // Limit to 10 most recent
      }
    });

  } catch (error) {
    console.error('Notifications error:', error);
    return c.json({ error: 'Request failed', message: 'Unable to fetch notifications' }, 500);
  }
});

export default dashboard;