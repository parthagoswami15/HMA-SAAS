import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseBaseRepository } from '../../common/repositories/supabase-base.repository';
import { EmergencyContactDto } from '../dto/patient-registration.dto';
export declare class PatientRepository extends SupabaseBaseRepository<any> {
    protected readonly supabase: SupabaseClient;
    protected tableName: string;
    constructor(supabase: SupabaseClient);
    findByPhoneNumber(phoneNumber: string): Promise<any>;
    searchByName(name: string, limit?: number): Promise<any[]>;
    findEmergencyContacts(patientId: string): Promise<EmergencyContactDto[]>;
    addEmergencyContact(patientId: string, contact: Omit<EmergencyContactDto, 'id'>): Promise<EmergencyContactDto>;
    updateEmergencyContact(contactId: string, updates: Partial<EmergencyContactDto>): Promise<EmergencyContactDto>;
    removeEmergencyContact(contactId: string): Promise<boolean>;
    findDocuments(patientId: string): Promise<any[]>;
    addDocument(patientId: string, documentData: {
        name: string;
        type: string;
        url: string;
        mimeType: string;
        size: number;
        uploadedBy: string;
    }): Promise<any>;
    removeDocument(documentId: string): Promise<boolean>;
}
