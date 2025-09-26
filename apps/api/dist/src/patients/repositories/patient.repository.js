"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientRepository = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase_base_repository_1 = require("../../common/repositories/supabase-base.repository");
let PatientRepository = class PatientRepository extends supabase_base_repository_1.SupabaseBaseRepository {
    supabase;
    tableName = 'patients';
    constructor(supabase) {
        super(supabase);
        this.supabase = supabase;
    }
    async findByPhoneNumber(phoneNumber) {
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
    async searchByName(name, limit = 10) {
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
    async findEmergencyContacts(patientId) {
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
    async addEmergencyContact(patientId, contact) {
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
    async updateEmergencyContact(contactId, updates) {
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
    async removeEmergencyContact(contactId) {
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
    async findDocuments(patientId) {
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
    async addDocument(patientId, documentData) {
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
    async removeDocument(documentId) {
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
};
exports.PatientRepository = PatientRepository;
exports.PatientRepository = PatientRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)('SUPABASE_CLIENT')),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient])
], PatientRepository);
//# sourceMappingURL=patient.repository.js.map