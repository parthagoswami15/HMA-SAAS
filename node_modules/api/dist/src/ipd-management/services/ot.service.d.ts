import { Repository } from 'typeorm';
import { Surgery } from '../entities/surgery.entity';
import { Patient } from '../../patients/entities/patient.entity';
import { Staff } from '../../staff/entities/staff.entity';
import { Admission } from '../entities/admission.entity';
import { SurgeryStatus } from '../enums/surgery-status.enum';
export declare class OtService {
    private readonly surgeryRepository;
    private readonly patientRepository;
    private readonly staffRepository;
    private readonly admissionRepository;
    constructor(surgeryRepository: Repository<Surgery>, patientRepository: Repository<Patient>, staffRepository: Repository<Staff>, admissionRepository: Repository<Admission>);
    scheduleSurgery(createSurgeryDto: {
        patientId: string;
        admissionId: string;
        procedureName: string;
        description?: string;
        type: string;
        scheduledDate: Date;
        estimatedDuration: number;
        surgeonId: string;
        anesthetistId?: string;
        assistantSurgeonId?: string;
        theaterRoom: string;
        preOpDiagnosis?: any;
        notes?: string;
        scheduledById: string;
    }): Promise<Surgery[]>;
    updateSurgeryStatus(surgeryId: string, status: SurgeryStatus, updatedById: string, notes?: string): Promise<Surgery>;
    updateSurgeryDetails(surgeryId: string, updateData: Partial<Surgery>, updatedById: string): Promise<Surgery>;
    getSurgeryById(surgeryId: string): Promise<Surgery>;
    getSurgeries(filters?: {
        patientId?: string;
        surgeonId?: string;
        anesthetistId?: string;
        status?: SurgeryStatus | SurgeryStatus[];
        startDate?: Date;
        endDate?: Date;
        theaterRoom?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: Surgery[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getSurgerySchedule(theaterRoom: string, date: Date): Promise<Surgery[]>;
    getSurgeonSchedule(surgeonId: string, startDate: Date, endDate: Date): Promise<Surgery[]>;
    addSurgeryNotes(surgeryId: string, notes: string, userId: string, type: 'preOp' | 'intraOp' | 'postOp' | 'anesthesia' | 'nursing' | 'other'): Promise<Surgery>;
    addSurgeryComplication(surgeryId: string, complication: string, severity: 'minor' | 'moderate' | 'severe', notes: string, userId: string): Promise<Surgery>;
    private isTheaterAvailable;
    private isStaffAvailable;
}
