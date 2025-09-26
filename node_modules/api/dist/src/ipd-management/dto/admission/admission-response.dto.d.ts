import { Admission } from '../../entities/admission.entity';
import { BedResponseDto } from '../../bed-ward/dto/bed-response.dto';
import { PatientResponseDto } from '../../../patients/dto/patient-response.dto';
import { StaffResponseDto } from '../../../staff/dto/staff-response.dto';
export declare class AdmissionResponseDto {
    id: string;
    admissionNumber: string;
    patient: PatientResponseDto;
    admittingDoctor: StaffResponseDto;
    bed: BedResponseDto;
    admissionType: string;
    status: string;
    admissionDate: Date;
    dischargeDate?: Date;
    diagnosis?: string;
    admissionNotes?: string;
    dischargeNotes?: string;
    isSelfDischarge: boolean;
    selfDischargeReason?: string;
    insuranceInfo?: Record<string, any>;
    documents?: Array<{
        type: string;
        url: string;
        notes?: string;
    }>;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<Admission>);
}
