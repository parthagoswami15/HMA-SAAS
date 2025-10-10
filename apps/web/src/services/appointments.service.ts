/**
 * Appointments API Service
 * Handles all appointment-related API operations
 */

import apiClient from './api-client';
import { Appointment, AppointmentStatus, AppointmentType, AppointmentPriority } from '../types/appointment';

export interface CreateAppointmentDto {
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: AppointmentType;
  priority?: AppointmentPriority;
  reason?: string;
  notes?: string;
  duration?: number;
}

export interface UpdateAppointmentDto {
  appointmentDate?: string;
  appointmentTime?: string;
  appointmentType?: AppointmentType;
  priority?: AppointmentPriority;
  status?: AppointmentStatus;
  reason?: string;
  notes?: string;
  duration?: number;
}

export interface AppointmentFilters {
  patientId?: string;
  doctorId?: string;
  status?: AppointmentStatus;
  appointmentType?: AppointmentType;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

class AppointmentsService {
  private baseUrl = '/appointments';

  /**
   * Get all appointments with optional filters
   */
  async getAppointments(filters?: AppointmentFilters) {
    const params = new URLSearchParams();
    
    if (filters?.patientId) params.append('patientId', filters.patientId);
    if (filters?.doctorId) params.append('doctorId', filters.doctorId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.appointmentType) params.append('appointmentType', filters.appointmentType);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
    
    return apiClient.get<{ data: Appointment[]; total: number; page: number; limit: number }>(url);
  }

  /**
   * Get a single appointment by ID
   */
  async getAppointmentById(id: string) {
    return apiClient.get<Appointment>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new appointment
   */
  async createAppointment(data: CreateAppointmentDto) {
    return apiClient.post<Appointment>(this.baseUrl, data);
  }

  /**
   * Update an existing appointment
   */
  async updateAppointment(id: string, data: UpdateAppointmentDto) {
    return apiClient.put<Appointment>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Update appointment status
   */
  async updateAppointmentStatus(id: string, status: AppointmentStatus) {
    return apiClient.patch<Appointment>(`${this.baseUrl}/${id}/status`, { status });
  }

  /**
   * Cancel an appointment
   */
  async cancelAppointment(id: string, reason?: string) {
    return apiClient.patch<Appointment>(`${this.baseUrl}/${id}/cancel`, { reason });
  }

  /**
   * Delete an appointment
   */
  async deleteAppointment(id: string) {
    return apiClient.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Get appointment statistics
   */
  async getAppointmentStats(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}/stats?${queryString}` : `${this.baseUrl}/stats`;
    
    return apiClient.get<any>(url);
  }

  /**
   * Get doctor availability
   */
  async getDoctorAvailability(doctorId: string, date: string) {
    return apiClient.get<any>(`${this.baseUrl}/availability/${doctorId}?date=${date}`);
  }

  /**
   * Get appointment queue for today
   */
  async getAppointmentQueue(doctorId?: string) {
    const params = doctorId ? `?doctorId=${doctorId}` : '';
    return apiClient.get<any>(`${this.baseUrl}/queue${params}`);
  }
}

const appointmentsService = new AppointmentsService();
export default appointmentsService;
