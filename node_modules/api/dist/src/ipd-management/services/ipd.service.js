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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPDService = void 0;
const common_1 = require("@nestjs/common");
const admission_service_1 = require("../submodules/admission/services/admission.service");
const bed_ward_service_1 = require("../submodules/bed-ward/services/bed-ward.service");
const nursing_service_1 = require("../submodules/nursing/services/nursing.service");
const ot_service_1 = require("../submodules/ot/services/ot.service");
const discharge_service_1 = require("../submodules/discharge/services/discharge.service");
let IPDService = class IPDService {
    admissionService;
    bedWardService;
    nursingService;
    otService;
    dischargeService;
    constructor(admissionService, bedWardService, nursingService, otService, dischargeService) {
        this.admissionService = admissionService;
        this.bedWardService = bedWardService;
        this.nursingService = nursingService;
        this.otService = otService;
        this.dischargeService = dischargeService;
    }
    async admitPatient(admissionData) {
        return this.admissionService.createAdmission(admissionData);
    }
    async getAdmissionDetails(admissionId) {
        return this.admissionService.getAdmissionById(admissionId);
    }
    async getAvailableBeds(wardId, bedClass) {
        return this.bedWardService.getAvailableBeds(wardId, bedClass);
    }
    async transferPatientBed(admissionId, newBedId, reason) {
        return this.bedWardService.transferPatientBed(admissionId, newBedId, reason);
    }
    async recordNursingChart(patientId, chartData) {
        return this.nursingService.recordNursingChart(patientId, chartData);
    }
    async getPatientNursingCharts(patientId, date) {
        return this.nursingService.getPatientNursingCharts(patientId, date);
    }
    async recordMedicationAdministration(marData) {
        return this.nursingService.recordMedicationAdministration(marData);
    }
    async scheduleSurgery(surgeryData) {
        return this.otService.scheduleSurgery(surgeryData);
    }
    async updateSurgeryStatus(surgeryId, status, notes) {
        return this.otService.updateSurgeryStatus(surgeryId, status, notes);
    }
    async initiateDischarge(admissionId, dischargeData) {
        return this.dischargeService.initiateDischarge(admissionId, dischargeData);
    }
    async completeDischarge(dischargeId) {
        return this.dischargeService.completeDischarge(dischargeId);
    }
    async getBedOccupancyReport() {
        return this.bedWardService.getBedOccupancyReport();
    }
    async getPatientSummary(patientId) {
        const admission = await this.admissionService.getActiveAdmissionByPatient(patientId);
        if (!admission) {
            return { admission: null };
        }
        const bedInfo = await this.bedWardService.getBedDetails(admission.bedId);
        const nursingCharts = await this.nursingService.getPatientNursingCharts(patientId);
        const medications = await this.nursingService.getPatientMedicationSchedule(patientId);
        const procedures = await this.otService.getPatientScheduledProcedures(patientId);
        return {
            admission,
            bedInfo,
            nursingCharts,
            medications,
            procedures,
        };
    }
};
exports.IPDService = IPDService;
exports.IPDService = IPDService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => admission_service_1.AdmissionService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => bed_ward_service_1.BedWardService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => nursing_service_1.NursingService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => ot_service_1.OTService))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => discharge_service_1.DischargeService))),
    __metadata("design:paramtypes", [typeof (_a = typeof admission_service_1.AdmissionService !== "undefined" && admission_service_1.AdmissionService) === "function" ? _a : Object, typeof (_b = typeof bed_ward_service_1.BedWardService !== "undefined" && bed_ward_service_1.BedWardService) === "function" ? _b : Object, typeof (_c = typeof nursing_service_1.NursingService !== "undefined" && nursing_service_1.NursingService) === "function" ? _c : Object, typeof (_d = typeof ot_service_1.OTService !== "undefined" && ot_service_1.OTService) === "function" ? _d : Object, typeof (_e = typeof discharge_service_1.DischargeService !== "undefined" && discharge_service_1.DischargeService) === "function" ? _e : Object])
], IPDService);
//# sourceMappingURL=ipd.service.js.map