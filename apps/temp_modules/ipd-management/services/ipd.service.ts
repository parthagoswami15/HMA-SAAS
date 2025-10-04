import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { AdmissionService } from '../submodules/admission/services/admission.service';
import { BedWardService } from '../submodules/bed-ward/services/bed-ward.service';
import { NursingService } from '../submodules/nursing/services/nursing.service';
import { OTService } from '../submodules/ot/services/ot.service';
import { DischargeService } from '../submodules/discharge/services/discharge.service';

@Injectable()
export class IPDService {
  constructor(
    @Inject(forwardRef(() => AdmissionService))
    private readonly admissionService: AdmissionService,
    @Inject(forwardRef(() => BedWardService))
    private readonly bedWardService: BedWardService,
    @Inject(forwardRef(() => NursingService))
    private readonly nursingService: NursingService,
    @Inject(forwardRef(() => OTService))
    private readonly otService: OTService,
    @Inject(forwardRef(() => DischargeService))
    private readonly dischargeService: DischargeService,
  ) {}

  // Admission related methods
  async admitPatient(admissionData: any) {
    return this.admissionService.createAdmission(admissionData);
  }

  async getAdmissionDetails(admissionId: string) {
    return this.admissionService.getAdmissionById(admissionId);
  }

  // Bed/Ward management
  async getAvailableBeds(wardId?: string, bedClass?: string) {
    return this.bedWardService.getAvailableBeds(wardId, bedClass);
  }

  async transferPatientBed(admissionId: string, newBedId: string, reason: string) {
    return this.bedWardService.transferPatientBed(admissionId, newBedId, reason);
  }

  // Nursing care
  async recordNursingChart(patientId: string, chartData: any) {
    return this.nursingService.recordNursingChart(patientId, chartData);
  }

  async getPatientNursingCharts(patientId: string, date?: Date) {
    return this.nursingService.getPatientNursingCharts(patientId, date);
  }

  // Medication Administration Record (MAR)
  async recordMedicationAdministration(marData: any) {
    return this.nursingService.recordMedicationAdministration(marData);
  }

  // OT/Surgery
  async scheduleSurgery(surgeryData: any) {
    return this.otService.scheduleSurgery(surgeryData);
  }

  async updateSurgeryStatus(surgeryId: string, status: string, notes?: string) {
    return this.otService.updateSurgeryStatus(surgeryId, status, notes);
  }

  // Discharge
  async initiateDischarge(admissionId: string, dischargeData: any) {
    return this.dischargeService.initiateDischarge(admissionId, dischargeData);
  }

  async completeDischarge(dischargeId: string) {
    return this.dischargeService.completeDischarge(dischargeId);
  }

  // Dashboard/Reporting
  async getBedOccupancyReport() {
    return this.bedWardService.getBedOccupancyReport();
  }

  async getPatientSummary(patientId: string) {
    // Get admission details
    const admission = await this.admissionService.getActiveAdmissionByPatient(patientId);
    if (!admission) {
      return { admission: null };
    }

    // Get bed/ward info
    const bedInfo = await this.bedWardService.getBedDetails(admission.bedId);
    
    // Get nursing charts
    const nursingCharts = await this.nursingService.getPatientNursingCharts(patientId);
    
    // Get scheduled medications
    const medications = await this.nursingService.getPatientMedicationSchedule(patientId);
    
    // Get upcoming procedures
    const procedures = await this.otService.getPatientScheduledProcedures(patientId);
    
    return {
      admission,
      bedInfo,
      nursingCharts,
      medications,
      procedures,
    };
  }
}
