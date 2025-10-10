import { apiClient } from './api-client';

/**
 * Staff Management API Service
 */

export interface CreateStaffDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  designation?: string;
  specialization?: string;
  departmentId?: string;
  licenseNumber?: string;
  qualification?: string;
  experience?: string;
  joiningDate?: string;
  phone?: string;
  address?: string;
}

export interface StaffFilters {
  role?: string;
  departmentId?: string;
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

const staffService = {
  /**
   * Create new staff member
   */
  createStaff: async (data: CreateStaffDto) => {
    return apiClient.post('/staff', data);
  },

  /**
   * Get all staff members with filters
   */
  getStaff: async (filters?: StaffFilters) => {
    return apiClient.get('/staff', filters);
  },

  /**
   * Get staff by ID
   */
  getStaffById: async (id: string) => {
    return apiClient.get(`/staff/${id}`);
  },

  /**
   * Update staff member
   */
  updateStaff: async (id: string, data: Partial<CreateStaffDto>) => {
    return apiClient.patch(`/staff/${id}`, data);
  },

  /**
   * Delete staff member (soft delete)
   */
  deleteStaff: async (id: string) => {
    return apiClient.delete(`/staff/${id}`);
  },

  /**
   * Search staff members
   */
  searchStaff: async (query: string) => {
    return apiClient.get('/staff/search', { q: query });
  },

  /**
   * Get staff statistics
   */
  getStaffStats: async () => {
    return apiClient.get('/staff/stats');
  },
};

export default staffService;
