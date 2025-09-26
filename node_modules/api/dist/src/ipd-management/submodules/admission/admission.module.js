"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdmissionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const admission_entity_1 = require("../../entities/admission.entity");
const patient_entity_1 = require("../../../patients/entities/patient.entity");
const staff_entity_1 = require("../../../staff/entities/staff.entity");
const bed_entity_1 = require("../../entities/bed.entity");
const admission_service_1 = require("../services/admission.service");
const admission_controller_1 = require("../controllers/admission.controller");
const bed_ward_service_1 = require("../services/bed-ward.service");
const ward_entity_1 = require("../../entities/ward.entity");
let AdmissionModule = class AdmissionModule {
};
exports.AdmissionModule = AdmissionModule;
exports.AdmissionModule = AdmissionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                admission_entity_1.Admission,
                patient_entity_1.Patient,
                staff_entity_1.Staff,
                bed_entity_1.Bed,
                ward_entity_1.Ward,
            ]),
        ],
        controllers: [admission_controller_1.AdmissionController],
        providers: [admission_service_1.AdmissionService, bed_ward_service_1.BedWardService],
        exports: [admission_service_1.AdmissionService],
    })
], AdmissionModule);
//# sourceMappingURL=admission.module.js.map