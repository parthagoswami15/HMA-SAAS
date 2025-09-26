"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DischargeModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const discharge_entity_1 = require("../../entities/discharge.entity");
const admission_entity_1 = require("../../entities/admission.entity");
const patient_entity_1 = require("../../../patients/entities/patient.entity");
const staff_entity_1 = require("../../../staff/entities/staff.entity");
const bed_entity_1 = require("../../entities/bed.entity");
const discharge_controller_1 = require("../controllers/discharge.controller");
const discharge_service_1 = require("../../services/discharge.service");
let DischargeModule = class DischargeModule {
};
exports.DischargeModule = DischargeModule;
exports.DischargeModule = DischargeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                discharge_entity_1.Discharge,
                admission_entity_1.Admission,
                patient_entity_1.Patient,
                staff_entity_1.Staff,
                bed_entity_1.Bed,
            ]),
        ],
        controllers: [discharge_controller_1.DischargeController],
        providers: [discharge_service_1.DischargeService],
        exports: [discharge_service_1.DischargeService],
    })
], DischargeModule);
//# sourceMappingURL=discharge.module.js.map