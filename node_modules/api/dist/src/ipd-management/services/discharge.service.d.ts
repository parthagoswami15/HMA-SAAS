import { Repository } from 'typeorm';
import { Discharge } from '../entities/discharge.entity';
import { Admission } from '../entities/admission.entity';
import { Patient } from '../../patients/entities/patient.entity';
import { Staff } from '../../staff/entities/staff.entity';
import { Bed } from '../entities/bed.entity';
import { DischargeStatus } from '../enums/discharge-status.enum';
import { DischargeType } from '../enums/discharge-type.enum';
export declare class DischargeService {
    private readonly dischargeRepository;
    private readonly admissionRepository;
    private readonly patientRepository;
    private readonly staffRepository;
    private readonly bedRepository;
    constructor(dischargeRepository: Repository<Discharge>, admissionRepository: Repository<Admission>, patientRepository: Repository<Patient>, staffRepository: Repository<Staff>, bedRepository: Repository<Bed>);
    initiateDischarge(admissionId: string, dischargedById: string, dischargeType: DischargeType): Promise<Discharge[]>;
    updateDischargeStatus(dischargeId: string, status: DischargeStatus, updatedById: string): Promise<Discharge>;
    updateDischargeSummary(dischargeId: string, summaryData: {
        diagnosisAtDischarge?: string;
        proceduresPerformed?: string;
        hospitalCourse?: string;
        conditionAtDischarge?: string;
        followUpPlan?: string;
        patientEducation?: string;
        dischargeMedications?: Array<{
            medicationId: string;
            name: string;
            dosage: string;
            frequency: string;
            duration: string;
            instructions: string;
        }>;
        followUpAppointments?: Array<{
            date: Date;
            department: string;
            doctorId: string;
            notes: string;
        }>;
        billingNotes?: string;
    }, updatedById: string): Promise<Discharge>;
    getDischargeById(dischargeId: string): Promise<Discharge>;
    getDischarges(filters?: {
        patientId?: string;
        doctorId?: string;
        wardId?: string;
        status?: DischargeStatus | DischargeStatus[];
        dischargeType?: DischargeType | DischargeType[];
        startDate?: Date;
        endDate?: Date;
        page?: number;
        limit?: number;
    }): Promise<{
        data: Discharge[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getDischargeSummary(dischargeId: string): Promise<{
        patient: {
            id: any;
            name: string;
            dateOfBirth: any;
            gender: any;
            bloodGroup: any;
            address: any;
            phone: any;
        };
        admission: {
            id: string;
            admissionDate: Date;
            admissionDiagnosis: string;
            admittingDoctor: string | null;
            ward: string;
            bed: string;
        };
        discharge: {
            id: string;
            dischargeDate: Date;
            dischargeType: import("../entities/discharge.entity").DischargeType;
            status: import("../entities/discharge.entity").DischargeStatus;
            dischargedBy: string | null;
            diagnosisAtDischarge: string;
            proceduresPerformed: string;
            hospitalCourse: string;
            conditionAtDischarge: string;
            followUpPlan: string;
            patientEducation: string;
            dischargeMedications: {
                medicationId: string;
                name: string;
                dosage: string;
                frequency: string;
                duration: string;
                instructions: string;
            }[];
            followUpAppointments: {
                date: Date;
                department: string;
                doctorId: string;
                notes: string;
            }[];
        };
    }>;
    getDischargeStatistics(startDate: Date, endDate: Date): Promise<{
        totalDischarges: number;
        dischargesByType: any;
        averageLengthOfStay: string;
        readmissionRate: string;
        timePeriod: {
            startDate: Date;
            endDate: Date;
        };
    }>;
}
