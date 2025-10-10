import { apiClient } from './api-client';

/**
 * Pharmacy Management API Service
 */

export interface CreateMedicationDto {
  genericName: string;
  brandName: string;
  drugCode: string;
  manufacturer?: string;
  category?: string;
  dosageForm?: string;
  strength?: string;
  unitPrice?: number;
  quantityInStock?: number;
  minimumStockLevel?: number;
  expiryDate?: string;
  isActive?: boolean;
}

export interface CreatePharmacyOrderDto {
  patientId: string;
  doctorId?: string;
  items: {
    medicationId: string;
    quantity: number;
    dosage?: string;
    frequency?: string;
    duration?: string;
    instructions?: string;
  }[];
  notes?: string;
}

export interface UpdatePharmacyOrderDto {
  status?: string;
  notes?: string;
}

export interface UpdateOrderItemDto {
  dispensedQuantity?: number;
  status?: string;
  notes?: string;
}

export interface MedicationFilters {
  category?: string;
  status?: string;
  search?: string;
  lowStock?: boolean;
  page?: number;
  limit?: number;
}

export interface PharmacyOrderFilters {
  patientId?: string;
  doctorId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

const pharmacyService = {
  // ==================== MEDICATIONS ====================
  
  /**
   * Create new medication
   */
  createMedication: async (data: CreateMedicationDto) => {
    return apiClient.post('/pharmacy/medications', data);
  },

  /**
   * Get all medications with filters
   */
  getMedications: async (filters?: MedicationFilters) => {
    return apiClient.get('/pharmacy/medications', filters);
  },

  /**
   * Get medication by ID
   */
  getMedicationById: async (id: string) => {
    return apiClient.get(`/pharmacy/medications/${id}`);
  },

  /**
   * Update medication
   */
  updateMedication: async (id: string, data: Partial<CreateMedicationDto>) => {
    return apiClient.patch(`/pharmacy/medications/${id}`, data);
  },

  /**
   * Delete medication (deactivate)
   */
  deleteMedication: async (id: string) => {
    return apiClient.delete(`/pharmacy/medications/${id}`);
  },

  // ==================== PHARMACY ORDERS ====================

  /**
   * Create new pharmacy order
   */
  createPharmacyOrder: async (data: CreatePharmacyOrderDto) => {
    return apiClient.post('/pharmacy/orders', data);
  },

  /**
   * Get all pharmacy orders with filters
   */
  getPharmacyOrders: async (filters?: PharmacyOrderFilters) => {
    return apiClient.get('/pharmacy/orders', filters);
  },

  /**
   * Get pharmacy order by ID
   */
  getPharmacyOrderById: async (id: string) => {
    return apiClient.get(`/pharmacy/orders/${id}`);
  },

  /**
   * Update pharmacy order
   */
  updatePharmacyOrder: async (id: string, data: UpdatePharmacyOrderDto) => {
    return apiClient.patch(`/pharmacy/orders/${id}`, data);
  },

  /**
   * Update order item status (dispensing)
   */
  updateOrderItem: async (orderId: string, itemId: string, data: UpdateOrderItemDto) => {
    return apiClient.patch(`/pharmacy/orders/${orderId}/items/${itemId}`, data);
  },

  /**
   * Cancel pharmacy order
   */
  cancelPharmacyOrder: async (id: string) => {
    return apiClient.delete(`/pharmacy/orders/${id}`);
  },

  /**
   * Get pharmacy statistics
   */
  getPharmacyStats: async () => {
    return apiClient.get('/pharmacy/orders/stats');
  },
};

export default pharmacyService;
