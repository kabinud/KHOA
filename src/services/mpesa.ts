// M-Pesa integration service for KenyaHOA Pro
import type { CloudflareBindings, MpesaSTKPushRequest, MpesaSTKPushResponse, MpesaCallbackRequest } from '../types';

export class MpesaService {
  private businessCode: string;
  private consumerKey: string;
  private consumerSecret: string;
  private passkey: string;
  private environment: 'sandbox' | 'production';

  constructor(env: CloudflareBindings) {
    // These would be set as environment variables in production
    this.businessCode = env.MPESA_BUSINESS_CODE || '174379';
    this.consumerKey = env.MPESA_CONSUMER_KEY || 'your-consumer-key';
    this.consumerSecret = env.MPESA_CONSUMER_SECRET || 'your-consumer-secret';
    this.passkey = env.MPESA_PASSKEY || 'your-passkey';
    this.environment = (env.ENVIRONMENT as 'sandbox' | 'production') || 'sandbox';
  }

  private getBaseUrl(): string {
    return this.environment === 'production' 
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';
  }

  // Generate access token for M-Pesa API
  private async getAccessToken(): Promise<string> {
    const credentials = btoa(`${this.consumerKey}:${this.consumerSecret}`);
    
    const response = await fetch(`${this.getBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get M-Pesa access token: ${response.statusText}`);
    }

    const data = await response.json() as any;
    return data.access_token;
  }

  // Generate timestamp for M-Pesa requests
  private generateTimestamp(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}${hour}${minute}${second}`;
  }

  // Generate password for STK Push
  private generatePassword(timestamp: string): string {
    const rawPassword = `${this.businessCode}${this.passkey}${timestamp}`;
    return btoa(rawPassword);
  }

  // Format phone number to required format
  private formatPhoneNumber(phone: string): string {
    // Remove all spaces and special characters
    let cleaned = phone.replace(/\s/g, '').replace(/[^\d+]/g, '');
    
    // Convert to international format
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1);
    } else if (cleaned.startsWith('+254')) {
      cleaned = cleaned.substring(1);
    } else if (!cleaned.startsWith('254')) {
      cleaned = '254' + cleaned;
    }
    
    return cleaned;
  }

  // Initiate STK Push payment request
  async initiateSTKPush(request: MpesaSTKPushRequest): Promise<MpesaSTKPushResponse> {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword(timestamp);
      const formattedPhone = this.formatPhoneNumber(request.phone_number);

      const payload = {
        BusinessShortCode: this.businessCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(request.amount), // Ensure amount is integer
        PartyA: formattedPhone,
        PartyB: this.businessCode,
        PhoneNumber: formattedPhone,
        CallBackURL: `https://your-domain.com/api/payments/mpesa/callback`, // This should be your actual callback URL
        AccountReference: request.account_reference,
        TransactionDesc: request.transaction_desc
      };

      const response = await fetch(`${this.getBaseUrl()}/mpesa/stkpush/v1/processrequest`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json() as any;

      if (!response.ok) {
        console.error('M-Pesa STK Push error:', responseData);
        return {
          success: false,
          response_code: responseData.errorCode || 'ERROR',
          response_description: responseData.errorMessage || 'Payment request failed',
          customer_message: 'Unable to process payment request. Please try again.'
        };
      }

      return {
        success: responseData.ResponseCode === '0',
        checkout_request_id: responseData.CheckoutRequestID,
        response_code: responseData.ResponseCode,
        response_description: responseData.ResponseDescription,
        customer_message: responseData.CustomerMessage
      };

    } catch (error) {
      console.error('M-Pesa STK Push error:', error);
      return {
        success: false,
        response_code: 'NETWORK_ERROR',
        response_description: 'Network error occurred',
        customer_message: 'Unable to connect to payment service. Please check your internet connection.'
      };
    }
  }

  // Query STK Push transaction status
  async querySTKPushStatus(checkoutRequestId: string): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword(timestamp);

      const payload = {
        BusinessShortCode: this.businessCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId
      };

      const response = await fetch(`${this.getBaseUrl()}/mpesa/stkpushquery/v1/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      return await response.json();

    } catch (error) {
      console.error('M-Pesa query error:', error);
      throw error;
    }
  }

  // Process M-Pesa callback
  processCallback(callbackData: any): MpesaCallbackRequest {
    const stkCallback = callbackData.Body?.stkCallback;
    
    if (!stkCallback) {
      throw new Error('Invalid callback data format');
    }

    const result: MpesaCallbackRequest = {
      checkout_request_id: stkCallback.CheckoutRequestID,
      result_code: stkCallback.ResultCode,
      result_desc: stkCallback.ResultDesc
    };

    // If payment was successful, extract additional details
    if (stkCallback.ResultCode === 0 && stkCallback.CallbackMetadata?.Item) {
      const metadata = stkCallback.CallbackMetadata.Item;
      
      metadata.forEach((item: any) => {
        switch (item.Name) {
          case 'Amount':
            result.amount = item.Value;
            break;
          case 'MpesaReceiptNumber':
            result.mpesa_receipt_number = item.Value;
            break;
          case 'TransactionDate':
            result.transaction_date = this.formatMpesaDate(item.Value);
            break;
          case 'PhoneNumber':
            result.phone_number = item.Value;
            break;
        }
      });
    }

    return result;
  }

  // Format M-Pesa date to ISO string
  private formatMpesaDate(mpesaDate: number): string {
    const dateStr = mpesaDate.toString();
    // M-Pesa date format: YYYYMMDDHHMMSS
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const hour = dateStr.substring(8, 10);
    const minute = dateStr.substring(10, 12);
    const second = dateStr.substring(12, 14);
    
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}+03:00`).toISOString();
  }

  // Validate callback authenticity (implement signature verification in production)
  validateCallback(callbackData: any, signature?: string): boolean {
    // In production, you should verify the callback signature
    // For now, we'll do basic validation
    return !!(callbackData?.Body?.stkCallback?.CheckoutRequestID);
  }

  // Generate payment description for different transaction types
  generatePaymentDescription(type: string, propertyUnit?: string, month?: string): string {
    switch (type) {
      case 'monthly_dues':
        return `Monthly dues payment ${propertyUnit ? `for ${propertyUnit}` : ''} ${month ? `- ${month}` : ''}`.trim();
      case 'special_assessment':
        return `Special assessment payment ${propertyUnit ? `for ${propertyUnit}` : ''}`.trim();
      case 'fine':
        return `Fine payment ${propertyUnit ? `for ${propertyUnit}` : ''}`.trim();
      case 'amenity_booking':
        return `Amenity booking fee ${propertyUnit ? `for ${propertyUnit}` : ''}`.trim();
      default:
        return `HOA payment ${propertyUnit ? `for ${propertyUnit}` : ''}`.trim();
    }
  }

  // Generate account reference for tracking
  generateAccountReference(tenantSlug: string, propertyUnit: string, transactionId: string): string {
    return `${tenantSlug.toUpperCase()}-${propertyUnit}-${transactionId.substring(0, 8)}`;
  }
}

// Utility functions for M-Pesa integration
export class MpesaUtils {
  // Validate M-Pesa phone number
  static isValidMpesaPhone(phone: string): boolean {
    const cleaned = phone.replace(/\s/g, '');
    const kenyanMobile = /^(\+254|254|0)[17]\d{8}$/;
    return kenyanMobile.test(cleaned);
  }

  // Format amount for display
  static formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2
    }).format(amount);
  }

  // Generate unique transaction reference
  static generateTransactionRef(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TXN${timestamp.substring(-6)}-${random}`;
  }

  // Get M-Pesa error message in user-friendly format
  static getErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      '1': 'Insufficient funds in your M-Pesa account.',
      '2': 'Transaction failed. Please try again.',
      '17': 'Invalid phone number format.',
      '20': 'Invalid phone number.',
      '21': 'Invalid amount.',
      '22': 'Invalid account reference.',
      '23': 'Transaction expired.',
      '24': 'You cancelled the transaction.',
      '25': 'PIN mismatch. Please check your M-Pesa PIN.',
      '26': 'Invalid PIN format.',
      '1032': 'Transaction was cancelled by user.',
      '1037': 'Transaction timeout.',
      'NETWORK_ERROR': 'Network connection failed. Please check your internet connection.',
      'ERROR': 'An error occurred while processing your payment.'
    };

    return errorMessages[errorCode] || 'Payment failed. Please try again or contact support.';
  }

  // Check if transaction should be retried
  static canRetry(errorCode: string): boolean {
    const retryableCodes = ['2', '23', '1037', 'NETWORK_ERROR', 'ERROR'];
    return retryableCodes.includes(errorCode);
  }
}

// Mock M-Pesa service for development/testing
export class MockMpesaService extends MpesaService {
  private mockDelay = 2000; // 2 second delay to simulate network

  async initiateSTKPush(request: MpesaSTKPushRequest): Promise<MpesaSTKPushResponse> {
    console.log('Mock M-Pesa STK Push:', request);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, this.mockDelay));
    
    // Simulate success/failure based on amount (for testing)
    const shouldSucceed = request.amount < 100000; // Fail for amounts >= 100,000
    
    if (shouldSucceed) {
      return {
        success: true,
        checkout_request_id: `ws_CO_${Date.now()}${Math.random().toString(36).substring(2, 8)}`,
        response_code: '0',
        response_description: 'Success. Request accepted for processing',
        customer_message: 'Success. Request accepted for processing'
      };
    } else {
      return {
        success: false,
        response_code: '1',
        response_description: 'Insufficient funds',
        customer_message: 'Insufficient funds in your M-Pesa account'
      };
    }
  }

  async querySTKPushStatus(checkoutRequestId: string): Promise<any> {
    console.log('Mock M-Pesa query:', checkoutRequestId);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      ResponseCode: '0',
      ResponseDescription: 'The service request has been accepted successfully',
      ResultCode: '0',
      ResultDesc: 'The service request is processed successfully'
    };
  }

  processCallback(callbackData: any): MpesaCallbackRequest {
    // For mock service, generate fake callback data
    return {
      checkout_request_id: callbackData.checkout_request_id || 'mock_checkout_id',
      result_code: 0,
      result_desc: 'The service request is processed successfully.',
      amount: callbackData.amount || 1000,
      mpesa_receipt_number: `P${Date.now()}`,
      transaction_date: new Date().toISOString(),
      phone_number: callbackData.phone_number || '254700000000'
    };
  }
}