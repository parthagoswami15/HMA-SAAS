import { apiClient } from './api-client';

/**
 * Billing and Invoice API Service
 * Handles all billing-related API calls
 */

// Types
export interface CreateInvoiceDto {
  patientId: string;
  date?: string;
  dueDate: string;
  items: {
    itemType: string;
    itemId: string;
    description: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    taxRate?: number;
  }[];
  discountAmount?: number;
  taxAmount?: number;
  notes?: string;
}

export interface CreatePaymentDto {
  invoiceId: string;
  amount: number;
  paymentMethod: string;
  paymentDate?: string;
  referenceNumber?: string;
  notes?: string;
}

export interface InvoiceFilters {
  patientId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaymentFilters {
  invoiceId?: string;
  paymentMethod?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

const billingService = {
  // ==================== INVOICE OPERATIONS ====================
  
  /**
   * Create a new invoice
   */
  createInvoice: async (data: CreateInvoiceDto) => {
    return apiClient.post('/billing/invoices', data);
  },

  /**
   * Get all invoices with filters
   */
  getInvoices: async (filters?: InvoiceFilters) => {
    return apiClient.get('/billing/invoices', filters);
  },

  /**
   * Get invoice by ID
   */
  getInvoiceById: async (id: string) => {
    return apiClient.get(`/billing/invoices/${id}`);
  },

  /**
   * Update invoice
   */
  updateInvoice: async (id: string, data: any) => {
    return apiClient.patch(`/billing/invoices/${id}`, data);
  },

  /**
   * Cancel invoice
   */
  cancelInvoice: async (id: string) => {
    return apiClient.delete(`/billing/invoices/${id}`);
  },

  /**
   * Get billing statistics
   */
  getBillingStats: async () => {
    return apiClient.get('/billing/invoices/stats');
  },

  /**
   * Get revenue report
   */
  getRevenueReport: async (startDate: string, endDate: string) => {
    return apiClient.get('/billing/invoices/reports/revenue', {
      startDate,
      endDate,
    });
  },

  // ==================== PAYMENT OPERATIONS ====================

  /**
   * Create a payment
   */
  createPayment: async (data: CreatePaymentDto) => {
    return apiClient.post('/billing/payments', data);
  },

  /**
   * Get all payments with filters
   */
  getPayments: async (filters?: PaymentFilters) => {
    return apiClient.get('/billing/payments', filters);
  },

  /**
   * Get payment by ID
   */
  getPaymentById: async (id: string) => {
    return apiClient.get(`/billing/payments/${id}`);
  },

  /**
   * Update payment
   */
  updatePayment: async (id: string, data: any) => {
    return apiClient.patch(`/billing/payments/${id}`, data);
  },
};

export default billingService;
