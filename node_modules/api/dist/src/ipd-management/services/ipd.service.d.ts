import { AdmissionService } from '../submodules/admission/services/admission.service';
import { BedWardService } from '../submodules/bed-ward/services/bed-ward.service';
import { NursingService } from '../submodules/nursing/services/nursing.service';
import { OTService } from '../submodules/ot/services/ot.service';
import { DischargeService } from '../submodules/discharge/services/discharge.service';
export declare class IPDService {
    private readonly admissionService;
    private readonly bedWardService;
    private readonly nursingService;
    private readonly otService;
    private readonly dischargeService;
    constructor(admissionService: AdmissionService, bedWardService: BedWardService, nursingService: NursingService, otService: OTService, dischargeService: DischargeService);
    admitPatient(admissionData: any): Promise<any>;
    getAdmissionDetails(admissionId: string): Promise<any>;
    getAvailableBeds(wardId?: string, bedClass?: string): Promise<any>;
    transferPatientBed(admissionId: string, newBedId: string, reason: string): Promise<any>;
    recordNursingChart(patientId: string, chartData: any): Promise<any>;
    getPatientNursingCharts(patientId: string, date?: Date): Promise<any>;
    recordMedicationAdministration(marData: any): Promise<any>;
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
