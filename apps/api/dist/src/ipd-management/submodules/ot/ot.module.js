"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const surgery_entity_1 = require("../../entities/surgery.entity");
const patient_entity_1 = require("../../../patients/entities/patient.entity");
const staff_entity_1 = require("../../../staff/entities/staff.entity");
const admission_entity_1 = require("../../entities/admission.entity");
const ot_controller_1 = require("../controllers/ot.controller");
const ot_service_1 = require("../../services/ot.service");
const ot_theater_entity_1 = require("../../entities/ot-theater.entity");
const bed_entity_1 = require("../../entities/bed.entity");
let OTModule = class OTModule {
};
exports.OTModule = OTModule;
exports.OTModule = OTModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                surgery_entity_1.Surgery,
                ot_theater_entity_1.OTTheater,
                patient_entity_1.Patient,
                staff_entity_1.Staff,
                admission_entity_1.Admission,
                bed_entity_1.Bed,
            ]),
        ],
        controllers: [ot_controller_1.OTController],
        providers: [ot_service_1.OTService],
        exports: [ot_service_1.OTService],
    })
], OTModule);
//# sourceMappingURL=ot.module.js.map