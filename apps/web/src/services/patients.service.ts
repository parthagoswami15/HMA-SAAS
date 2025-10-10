import { apiClient } from './api-client';

/**
 * Patients Management API Service
 */

export interface CreatePatientDto {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodType?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  maritalStatus?: string;
}

export interface PatientFilters {
  search?: string;
  gender?: string;
  bloodType?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

const patientsService = {
  /**
   * Create new patient
   */
  createPatient: async (data: CreatePatientDto) => {
    return apiClient.post('/patients', data);
  },

  /**
   * Get all patients with filters
   */
  getPatients: async (filters?: PatientFilters) => {
    return apiClient.get('/patients', filters);
  },

  /**
   * Get patient by ID
   */
  getPatientById: async (id: string) => {
    return apiClient.get(`/patients/${id}`);
  },

  /**
   * Update patient
   */
  updatePatient: async (id: string, data: Partial<CreatePatientDto>) => {
    return apiClient.patch(`/patients/${id}`, data);
  },

  /**
   * Delete patient
   */
  deletePatient: async (id: string) => {
    return apiClient.delete(`/patients/${id}`);
  },

  /**
   * Search patients
   */
  searchPatients: async (query: string) => {
    return apiClient.get('/patients/search', { q: query });
  },

  /**
   * Get patient statistics
   */
  getPatientStats: async () => {
    return apiClient.get('/patients/stats');
  },
};

export default patientsService;
