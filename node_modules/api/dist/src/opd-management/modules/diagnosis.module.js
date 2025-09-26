"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagnosisModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const diagnosis_entity_1 = require("../entities/diagnosis.entity");
const icd10_code_entity_1 = require("../entities/icd10-code.entity");
const patient_entity_1 = require("../../patient/entities/patient.entity");
const staff_entity_1 = require("../../staff-management/entities/staff.entity");
const encounter_entity_1 = require("../entities/encounter.entity");
const diagnosis_controller_1 = require("../controllers/diagnosis.controller");
const diagnosis_service_1 = require("../services/diagnosis.service");
const icd10_service_1 = require("../services/icd10.service");
const diagnosis_repository_1 = require("../repositories/diagnosis.repository");
const icd10_repository_1 = require("../repositories/icd10.repository");
const patient_module_1 = require("../../patient/patient.module");
const staff_module_1 = require("../../staff-management/staff.module");
const encounter_module_1 = require("./encounter.module");
let DiagnosisModule = class DiagnosisModule {
};
exports.DiagnosisModule = DiagnosisModule;
exports.DiagnosisModule = DiagnosisModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                diagnosis_entity_1.Diagnosis,
                icd10_code_entity_1.Icd10Code,
                patient_entity_1.Patient,
                staff_entity_1.Staff,
                encounter_entity_1.Encounter,
                diagnosis_repository_1.DiagnosisRepository,
                icd10_repository_1.Icd10Repository,
            ]),
            patient_module_1.PatientModule,
            staff_module_1.StaffModule,
            encounter_module_1.EncounterModule,
        ],
        controllers: [diagnosis_controller_1.DiagnosisController],
        providers: [diagnosis_service_1.DiagnosisService, icd10_service_1.Icd10Service],
        exports: [diagnosis_service_1.DiagnosisService],
    })
], DiagnosisModule);
//# sourceMappingURL=diagnosis.module.js.map