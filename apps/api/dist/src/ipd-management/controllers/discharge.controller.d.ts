import { DischargeService } from '../services/discharge.service';
import { DischargeStatus } from '../enums/discharge-status.enum';
import { DischargeType } from '../enums/discharge-type.enum';
export declare class DischargeController {
    private readonly dischargeService;
    constructor(dischargeService: DischargeService);
    initiateDischarge(admissionId: string, dischargedById: string, dischargeType: DischargeType): Promise<import("../entities/discharge.entity").Discharge[]>;
    updateDischargeStatus(dischargeId: string, status: DischargeStatus, updatedById: string): Promise<import("../entities/discharge.entity").Discharge>;
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
    }, updatedById: string): Promise<import("../entities/discharge.entity").Discharge>;
    getDischargeById(dischargeId: string): Promise<import("../entities/discharge.entity").Discharge>;
    getDischarges(patientId?: string, doctorId?: string, wardId?: string, status?: DischargeStatus, dischargeType?: DischargeType, startDate?: string, endDate?: string, page?: number, limit?: number): Promise<{
        data: import("../entities/discharge.entity").Discharge[];
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
    printDischargeSummary(dischargeId: string, printedById: string): Promise<{
        message: string;
    }>;
    getDailyDischargeStats(date?: string): Promise<any>;
    getMonthlyDischargeStats(year?: number, month?: number): Promise<any>;
    getReadmissionRateStats(days?: number): Promise<any>;
    cancelDischarge(dischargeId: string, cancelledById: string, reason: string): Promise<any>;
    getPatientDischargeHistory(patientId: string, limit?: number): Promise<any>;
}
