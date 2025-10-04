import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseBaseRepository } from '../../common/repositories/supabase-base.repository';
import { EmergencyContactDto } from '../dto/patient-registration.dto';

@Injectable()
export class PatientRepository extends SupabaseBaseRepository<any> {
  protected tableName = 'patients';

  constructor(@Inject('SUPABASE_CLIENT') protected readonly supabase: SupabaseClient) {
    super(supabase);
  }

  // Patient-specific methods
  async findByPhoneNumber(phoneNumber: string): Promise<any> {
    const { data, error } = await this.table
      .select('*')
      .eq('phoneNumber', phoneNumber)
      .single();

    if (error && error.code !== 'PGRST116') {
      this.logger.error(`Error finding patient by phone number`, error);
      throw error;
    }

    return data;
  }

  async searchByName(name: string, limit = 10): Promise<any[]> {
    const { data, error } = await this.table
      .select('*')
      .or(`firstName.ilike.%${name}%,lastName.ilike.%${name}%`)
      .limit(limit);

    if (error) {
      this.logger.error(`Error searching patients by name`, error);
      throw error;
    }

    return data || [];
  }

  // Emergency Contacts
  async findEmergencyContacts(patientId: string): Promise<EmergencyContactDto[]> {
    const { data, error } = await this.supabase
      .from('emergency_contacts')
      .select('*')
      .eq('patientId', patientId);

    if (error) {
      this.logger.error(`Error finding emergency contacts`, error);
      throw error;
    }

    return data || [];
  }

  async addEmergencyContact(patientId: string, contact: Omit<EmergencyContactDto, 'id'>): Promise<EmergencyContactDto> {
    const { data, error } = await this.supabase
      .from('emergency_contacts')
      .insert([{ ...contact, patientId }])
      .select()
      .single();

    if (error) {
      this.logger.error(`Error adding emergency contact`, error);
      throw error;
    }

    return data;
  }

  async updateEmergencyContact(contactId: string, updates: Partial<EmergencyContactDto>): Promise<EmergencyContactDto> {
    const { data, error } = await this.supabase
      .from('emergency_contacts')
      .update(updates)
      .eq('id', contactId)
      .select()
      .single();

    if (error) {
      this.logger.error(`Error updating emergency contact`, error);
      throw error;
    }

    return data;
  }

  async removeEmergencyContact(contactId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('emergency_contacts')
      .delete()
      .eq('id', contactId);

    if (error) {
      this.logger.error(`Error removing emergency contact`, error);
      throw error;
    }

    return true;
  }

  // Patient Documents
  async findDocuments(patientId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('patient_documents')
      .select('*')
      .eq('patientId', patientId);

    if (error) {
      this.logger.error(`Error finding patient documents`, error);
      throw error;
    }

    return data || [];
  }

  async addDocument(patientId: string, documentData: {
    name: string;
    type: string;
    url: string;
    mimeType: string;
    size: number;
    uploadedBy: string;
  }): Promise<any> {
    const { data, error } = await this.supabase
      .from('patient_documents')
      .insert([{ ...documentData, patientId }])
      .select()
      .single();

    if (error) {
      this.logger.error(`Error adding document`, error);
      throw error;
    }

    return data;
  }

  async removeDocument(documentId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('patient_documents')
      .delete()
      .eq('id', documentId);

    if (error) {
      this.logger.error(`Error removing document`, error);
      throw error;
    }

    return true;
  }
}
