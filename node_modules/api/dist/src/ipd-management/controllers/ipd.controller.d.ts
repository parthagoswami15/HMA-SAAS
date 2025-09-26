import { IPDService } from '../services/ipd.service';
export declare class IPDController {
    private readonly ipdService;
    constructor(ipdService: IPDService);
    admitPatient(admissionData: any): Promise<any>;
    getAdmission(admissionId: string): Promise<any>;
    getAvailableBeds(wardId?: string, bedClass?: string): Promise<any>;
    transferBed(admissionId: string, newBedId: string, reason: string): Promise<any>;
    recordNursingChart(patientId: string, chartData: any): Promise<any>;
    getNursingCharts(patientId: string, date?: Date): Promise<any>;
    recordMedication(marData: any): Promise<any>;
    scheduleSurgery(surgeryData: any): Promise<any>;
    updateSurgeryStatus(surgeryId: string, status: string, notes?: string): Promise<any>;
    initiateDischarge(admissionId: string, dischargeData: any): Promise<any>;
    completeDischarge(dischargeId: string): Promise<any>;
    getBedOccupancyReport(): Promise<any>;
    getPatientSummary(patientId: string): Promise<{
        admission: null;
        bedInfo?: undefined;
        nursingCharts?: undefined;
        medications?: undefined;
        procedures?: undefined;
    } | {
        admission: any;
        bedInfo: any;
        nursingCharts: any;
        medications: any;
        procedures: any;
    }>;
}
