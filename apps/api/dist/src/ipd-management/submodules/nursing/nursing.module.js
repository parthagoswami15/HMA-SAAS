"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NursingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nursing_chart_entity_1 = require("../../entities/nursing-chart.entity");
const medication_administration_entity_1 = require("../../entities/medication-administration.entity");
const patient_entity_1 = require("../../../patients/entities/patient.entity");
const staff_entity_1 = require("../../../staff/entities/staff.entity");
const admission_entity_1 = require("../../entities/admission.entity");
const nursing_controller_1 = require("../controllers/nursing.controller");
const nursing_service_1 = require("../../services/nursing.service");
let NursingModule = class NursingModule {
};
exports.NursingModule = NursingModule;
exports.NursingModule = NursingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                nursing_chart_entity_1.NursingChart,
                medication_administration_entity_1.MedicationAdministration,
                patient_entity_1.Patient,
                staff_entity_1.Staff,
                admission_entity_1.Admission,
            ]),
        ],
        controllers: [nursing_controller_1.NursingController],
        providers: [nursing_service_1.NursingService],
        exports: [nursing_service_1.NursingService],
    })
], NursingModule);
//# sourceMappingURL=nursing.module.js.map