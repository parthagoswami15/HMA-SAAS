import { NursingService } from '../services/nursing.service';
import { CreateNursingChartDto } from '../dto/create-nursing-chart.dto';
import { CreateMedicationAdministrationDto } from '../dto/create-medication-administration.dto';
import { MedicationStatus } from '../enums/medication-status.enum';
export declare class NursingController {
    private readonly nursingService;
    constructor(nursingService: NursingService);
    recordNursingChart(createNursingChartDto: CreateNursingChartDto): Promise<any>;
    getNursingCharts(patientId: string, admissionId?: string, startDate?: string, endDate?: string, limit?: number): Promise<any>;
    getNursingChartById(chartId: string): Promise<any>;
    recordMedicationAdministration(createMedicationDto: CreateMedicationAdministrationDto): Promise<any>;
    getMedicationAdministrations(patientId?: string, admissionId?: string, status?: MedicationStatus, startDate?: string, endDate?: string): Promise<import("../entities/medication-administration.entity").MedicationAdministration[]>;
    getMedicationAdministrationById(medicationId: string): Promise<any>;
    updateMedicationStatus(medicationId: string, status: MedicationStatus, administeredById: string, administeredAt?: string, notes?: string): Promise<import("../entities/medication-administration.entity").MedicationAdministration>;
    getPatientMedicationSchedule(patientId: string, admissionId?: string, date?: string): Promise<any>;
    getPatientVitalSigns(patientId: string, admissionId?: string, startDate?: string, endDate?: string, limit?: number): Promise<any>;
    getPatientIOChart(patientId: string, admissionId: string, date?: string): Promise<any>;
}
