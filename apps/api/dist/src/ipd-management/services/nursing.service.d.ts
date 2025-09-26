import { Repository } from 'typeorm';
import { NursingChart } from '../entities/nursing-chart.entity';
import { MedicationAdministration } from '../entities/medication-administration.entity';
import { Patient } from '../../patients/entities/patient.entity';
import { Staff } from '../../staff/entities/staff.entity';
import { Admission } from '../entities/admission.entity';
import { MedicationStatus } from '../enums/medication-status.enum';
import { VitalSigns } from '../entities/nursing-chart.entity';
export declare class NursingService {
    private readonly nursingChartRepository;
    private readonly medicationAdminRepository;
    private readonly patientRepository;
    private readonly staffRepository;
    private readonly admissionRepository;
    constructor(nursingChartRepository: Repository<NursingChart>, medicationAdminRepository: Repository<MedicationAdministration>, patientRepository: Repository<Patient>, staffRepository: Repository<Staff>, admissionRepository: Repository<Admission>);
    recordVitalSigns(patientId: string, recordedById: string, vitalSigns: Array<{
        vitalSign: VitalSigns;
        value: string;
        unit?: string;
        notes?: string;
    }>): Promise<(NursingChart & NursingChart[])[]>;
    getVitalSigns(patientId: string, filters?: {
        startDate?: Date;
        endDate?: Date;
        vitalSign?: VitalSigns;
        limit?: number;
    }): Promise<NursingChart[]>;
    scheduleMedication(createMedicationDto: {
        patientId: string;
        medicationOrderId: string;
        medicationName: string;
        dosage: string;
        route?: string;
        frequency: string;
        scheduledTime: Date;
        isPRN?: boolean;
        prnReason?: string;
        isStat?: boolean;
        notes?: string;
        scheduledById: string;
    }): Promise<MedicationAdministration[]>;
    administerMedication(medicationId: string, administeredById: string, data?: {
        administeredAt?: Date;
        notes?: string;
        vitalSigns?: {
            bloodPressure?: string;
            pulse?: number;
            temperature?: number;
            respiration?: number;
        };
    }): Promise<MedicationAdministration>;
    updateMedicationStatus(medicationId: string, status: MedicationStatus, updatedById: string, notes?: string): Promise<MedicationAdministration>;
    getMedicationAdministrations(patientId: string, filters?: {
        startDate?: Date;
        endDate?: Date;
        status?: MedicationStatus;
        isPRN?: boolean;
        medicationName?: string;
        limit?: number;
    }): Promise<MedicationAdministration[]>;
    getMedicationAdministration(id: string): Promise<MedicationAdministration>;
    getMedicationAdherenceReport(patientId: string, startDate: Date, endDate: Date): Promise<{
        totalScheduled: number;
        administered: number;
        missed: number;
        refused: number;
        onHold: number;
        pending: number;
        adherenceRate: number;
        medications: MedicationAdministration[];
    }>;
}
