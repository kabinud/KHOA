// Payment routes for KenyaHOA Pro
import { Hono } from 'hono';
import { v4 as uuidv4 } from 'uuid';
import { Database } from '../utils/database';
import { validateAndSanitize, MpesaSTKPushSchema, PaginationSchema } from '../utils/validation';
import { MpesaService, MockMpesaService, MpesaUtils } from '../services/mpesa';
import { 
  authMiddleware, 
  optionalAuthMiddleware,
  getCurrentUser, 
  getCurrentTenant, 
  requireResident,
  corsMiddleware
} from '../middleware/auth';
import type { CloudflareBindings, FinancialTransaction, Property, Resident } from '../types';

const payments = new Hono<{ Bindings: CloudflareBindings }>();

// Apply CORS for callback endpoints
payments.use('/mpesa/callback', corsMiddleware);

// Authenticated routes
payments.use('/my/*', authMiddleware);
payments.use('/my/*', requireResident);

// Get user's payment history
payments.get('/my/history', async (c) => {
  try {
    const user = getCurrentUser(c)!;
    const tenant = getCurrentTenant(c)!;
    const db = new Database(c.env.DB);

    // Validate query parameters
    const queryParams = validateAndSanitize(PaginationSchema, {
      page: c.req.query('page'),
      limit: c.req.query('limit'),
      sort_by: c.req.query('sort_by') || 'created_at',
      sort_order: c.req.query('sort_order') || 'desc'
    });

    if (!queryParams.success) {
      return c.json({ error: 'Invalid parameters', message: queryParams.errors.join(', ') }, 400);
    }

    const { page, limit, sort_by, sort_order } = queryParams.data;

    // Get user's payment history
    const baseQuery = `
      SELECT 
        ft.*,
        p.unit_number
      FROM financial_transactions ft
      LEFT JOIN properties p ON ft.property_id = p.id
      JOIN residents r ON ft.resident_id = r.id
      WHERE r.user_id = ? AND ft.tenant_id = ?
    `;

    const result = await db.paginate<any>(
      baseQuery + ` ORDER BY ft.${sort_by} ${sort_order.toUpperCase()}`,
      [user.id, tenant.id],
      page,
      limit
    );

    return c.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });

  } catch (error) {
    console.error('Payment history error:', error);
    return c.json({ error: 'Request failed', message: 'Unable to fetch payment history' }, 500);
  }
});

// Get user's outstanding payments
payments.get('/my/outstanding', async (c) => {
  try {
    const user = getCurrentUser(c)!;
    const tenant = getCurrentTenant(c)!;
    const db = new Database(c.env.DB);

    const outstandingPayments = await db.query<any>(
      `SELECT 
        ft.*,
        p.unit_number,
        CASE 
          WHEN ft.due_date < date('now') THEN 'overdue'
          WHEN ft.due_date <= date('now', '+7 days') THEN 'due_soon'
          ELSE 'pending'
        END as urgency
       FROM financial_transactions ft
       LEFT JOIN properties p ON ft.property_id = p.id
       JOIN residents r ON ft.resident_id = r.id
       WHERE r.user_id = ? AND ft.tenant_id = ? AND ft.status = 'pending'
       ORDER BY ft.due_date ASC`,
      [user.id, tenant.id]
    );

    // Calculate totals
    const totalAmount = outstandingPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const overdueAmount = outstandingPayments
      .filter(payment => payment.urgency === 'overdue')
      .reduce((sum, payment) => sum + payment.amount, 0);

    return c.json({
      success: true,
      data: {
        payments: outstandingPayments,
        summary: {
          total_count: outstandingPayments.length,
          total_amount: totalAmount,
          overdue_count: outstandingPayments.filter(p => p.urgency === 'overdue').length,
          overdue_amount: overdueAmount
        }
      }
    });

  } catch (error) {
    console.error('Outstanding payments error:', error);
    return c.json({ error: 'Request failed', message: 'Unable to fetch outstanding payments' }, 500);
  }
});

// Initiate M-Pesa payment
payments.post('/mpesa/pay', async (c) => {
  try {
    const body = await c.req.json();
    const validation = validateAndSanitize(MpesaSTKPushSchema, body);
    
    if (!validation.success) {
      return c.json({ error: 'Validation failed', message: validation.errors.join(', ') }, 400);
    }

    const user = getCurrentUser(c)!;
    const tenant = getCurrentTenant(c)!;
    const db = new Database(c.env.DB);

    const { phone_number, amount, account_reference, transaction_desc } = validation.data;

    // Verify the transaction exists and belongs to the user
    const transaction = await db.queryFirst<any>(
      `SELECT 
        ft.*,
        p.unit_number
       FROM financial_transactions ft
       LEFT JOIN properties p ON ft.property_id = p.id
       JOIN residents r ON ft.resident_id = r.id
       WHERE ft.id = ? AND r.user_id = ? AND ft.tenant_id = ? AND ft.status = 'pending'`,
      [account_reference, user.id, tenant.id]
    );

    if (!transaction) {
      return c.json({ error: 'Transaction not found', message: 'Payment transaction not found or already paid' }, 404);
    }

    // Verify amount matches
    if (Math.abs(amount - transaction.amount) > 0.01) {
      return c.json({ error: 'Amount mismatch', message: 'Payment amount does not match the required amount' }, 400);
    }

    // Initialize M-Pesa service (use mock in development)
    const mpesaService = c.env.ENVIRONMENT === 'production' 
      ? new MpesaService(c.env)
      : new MockMpesaService(c.env);

    // Generate payment reference
    const paymentRef = MpesaUtils.generateTransactionRef();
    const accountRef = mpesaService.generateAccountReference(
      tenant.slug, 
      transaction.unit_number || 'GENERAL', 
      transaction.id
    );

    // Create payment request record
    const paymentRequestId = uuidv4();
    await db.insert('payment_requests', {
      id: paymentRequestId,
      tenant_id: tenant.id,
      transaction_id: transaction.id,
      user_id: user.id,
      payment_method: 'mpesa',
      phone_number: phone_number,
      amount: amount,
      reference: paymentRef,
      account_reference: accountRef,
      status: 'initiated',
      created_at: new Date().toISOString()
    });

    // Initiate M-Pesa STK Push
    const mpesaResponse = await mpesaService.initiateSTKPush({
      phone_number,
      amount,
      account_reference: accountRef,
      transaction_desc: transaction_desc || mpesaService.generatePaymentDescription(
        transaction.category,
        transaction.unit_number
      )
    });

    // Update payment request with M-Pesa response
    await db.update('payment_requests', paymentRequestId, {
      mpesa_checkout_id: mpesaResponse.checkout_request_id,
      mpesa_response_code: mpesaResponse.response_code,
      mpesa_response_desc: mpesaResponse.response_description,
      status: mpesaResponse.success ? 'pending' : 'failed',
      updated_at: new Date().toISOString()
    });

    if (mpesaResponse.success) {
      return c.json({
        success: true,
        payment_request_id: paymentRequestId,
        checkout_request_id: mpesaResponse.checkout_request_id,
        message: 'Payment request sent to your phone. Please enter your M-Pesa PIN to complete the payment.'
      });
    } else {
      return c.json({
        success: false,
        error: 'Payment failed',
        message: MpesaUtils.getErrorMessage(mpesaResponse.response_code || 'ERROR'),
        can_retry: MpesaUtils.canRetry(mpesaResponse.response_code || 'ERROR')
      }, 400);
    }

  } catch (error) {
    console.error('M-Pesa payment error:', error);
    return c.json({ error: 'Payment failed', message: 'Unable to process payment request' }, 500);
  }
});

// Check M-Pesa payment status
payments.get('/mpesa/status/:paymentRequestId', async (c) => {
  try {
    const paymentRequestId = c.req.param('paymentRequestId');
    const user = getCurrentUser(c)!;
    const tenant = getCurrentTenant(c)!;
    const db = new Database(c.env.DB);

    // Get payment request
    const paymentRequest = await db.queryFirst<any>(
      `SELECT * FROM payment_requests 
       WHERE id = ? AND user_id = ? AND tenant_id = ?`,
      [paymentRequestId, user.id, tenant.id]
    );

    if (!paymentRequest) {
      return c.json({ error: 'Not found', message: 'Payment request not found' }, 404);
    }

    // If already completed, return status
    if (paymentRequest.status === 'completed') {
      return c.json({
        success: true,
        status: 'completed',
        message: 'Payment completed successfully',
        mpesa_receipt: paymentRequest.mpesa_receipt_number
      });
    }

    // If failed, return failure status
    if (paymentRequest.status === 'failed') {
      return c.json({
        success: false,
        status: 'failed',
        message: MpesaUtils.getErrorMessage(paymentRequest.mpesa_response_code || 'ERROR'),
        can_retry: MpesaUtils.canRetry(paymentRequest.mpesa_response_code || 'ERROR')
      });
    }

    // Query M-Pesa for current status
    if (paymentRequest.mpesa_checkout_id) {
      const mpesaService = c.env.ENVIRONMENT === 'production' 
        ? new MpesaService(c.env)
        : new MockMpesaService(c.env);

      try {
        const statusResponse = await mpesaService.querySTKPushStatus(paymentRequest.mpesa_checkout_id);
        
        // Update payment request with latest status
        if (statusResponse.ResultCode === '0') {
          // Payment successful
          await db.update('payment_requests', paymentRequestId, {
            status: 'completed',
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

          return c.json({
            success: true,
            status: 'completed',
            message: 'Payment completed successfully'
          });
        } else if (statusResponse.ResultCode && statusResponse.ResultCode !== '1037') {
          // Payment failed (not timeout)
          await db.update('payment_requests', paymentRequestId, {
            status: 'failed',
            mpesa_response_code: statusResponse.ResultCode,
            mpesa_response_desc: statusResponse.ResultDesc,
            updated_at: new Date().toISOString()
          });

          return c.json({
            success: false,
            status: 'failed',
            message: MpesaUtils.getErrorMessage(statusResponse.ResultCode),
            can_retry: MpesaUtils.canRetry(statusResponse.ResultCode)
          });
        }
      } catch (error) {
        console.error('M-Pesa status query error:', error);
      }
    }

    // Still pending
    return c.json({
      success: true,
      status: 'pending',
      message: 'Payment is still being processed. Please wait...'
    });

  } catch (error) {
    console.error('Payment status error:', error);
    return c.json({ error: 'Request failed', message: 'Unable to check payment status' }, 500);
  }
});

// M-Pesa callback endpoint (public, no auth required)
payments.post('/mpesa/callback', async (c) => {
  try {
    const callbackData = await c.req.json();
    console.log('M-Pesa callback received:', JSON.stringify(callbackData, null, 2));

    const db = new Database(c.env.DB);
    const mpesaService = new MpesaService(c.env);

    // Validate callback
    if (!mpesaService.validateCallback(callbackData)) {
      console.error('Invalid M-Pesa callback data');
      return c.json({ error: 'Invalid callback data' }, 400);
    }

    // Process callback
    const callback = mpesaService.processCallback(callbackData);

    // Find payment request
    const paymentRequest = await db.queryFirst<any>(
      'SELECT * FROM payment_requests WHERE mpesa_checkout_id = ?',
      [callback.checkout_request_id]
    );

    if (!paymentRequest) {
      console.error('Payment request not found for checkout ID:', callback.checkout_request_id);
      return c.json({ error: 'Payment request not found' }, 404);
    }

    if (callback.result_code === 0) {
      // Payment successful
      await db.batch([
        // Update payment request
        {
          sql: `UPDATE payment_requests SET 
                status = 'completed', 
                mpesa_receipt_number = ?, 
                completed_at = ?, 
                updated_at = ?
                WHERE id = ?`,
          params: [
            callback.mpesa_receipt_number,
            new Date().toISOString(),
            new Date().toISOString(),
            paymentRequest.id
          ]
        },
        // Update financial transaction
        {
          sql: `UPDATE financial_transactions SET 
                status = 'paid', 
                payment_date = ?, 
                payment_method = 'mpesa', 
                payment_reference = ?, 
                updated_at = ?
                WHERE id = ?`,
          params: [
            callback.transaction_date || new Date().toISOString(),
            callback.mpesa_receipt_number,
            new Date().toISOString(),
            paymentRequest.transaction_id
          ]
        }
      ]);

      console.log('Payment completed successfully:', callback.mpesa_receipt_number);
    } else {
      // Payment failed
      await db.update('payment_requests', paymentRequest.id, {
        status: 'failed',
        mpesa_response_code: callback.result_code.toString(),
        mpesa_response_desc: callback.result_desc,
        updated_at: new Date().toISOString()
      });

      console.log('Payment failed:', callback.result_desc);
    }

    // Always return success to M-Pesa to acknowledge receipt of callback
    return c.json({ success: true });

  } catch (error) {
    console.error('M-Pesa callback error:', error);
    // Still return success to avoid M-Pesa retries
    return c.json({ success: true });
  }
});

// Get payment methods available
payments.get('/methods', optionalAuthMiddleware, async (c) => {
  const methods = [
    {
      id: 'mpesa',
      name: 'M-Pesa',
      description: 'Pay with M-Pesa mobile money',
      icon: 'mpesa',
      available: true,
      fees: 'No additional fees'
    },
    {
      id: 'airtel_money',
      name: 'Airtel Money',
      description: 'Pay with Airtel Money',
      icon: 'airtel',
      available: false, // Not implemented yet
      fees: 'No additional fees'
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'Direct bank transfer',
      icon: 'bank',
      available: false, // Not implemented yet
      fees: 'Bank charges may apply'
    },
    {
      id: 'card',
      name: 'Debit/Credit Card',
      description: 'Pay with your debit or credit card',
      icon: 'card',
      available: false, // Not implemented yet
      fees: '2.5% processing fee'
    }
  ];

  return c.json({
    success: true,
    data: { methods }
  });
});

export default payments;