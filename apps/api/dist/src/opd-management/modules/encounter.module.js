"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncounterModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const encounter_entity_1 = require("../entities/encounter.entity");
const encounter_service_1 = require("../services/encounter.service");
const encounter_controller_1 = require("../controllers/encounter.controller");
const encounter_repository_1 = require("../repositories/encounter.repository");
const patient_module_1 = require("../../patient/patient.module");
const staff_module_1 = require("../../staff-management/staff.module");
const visit_module_1 = require("./visit.module");
let EncounterModule = class EncounterModule {
};
exports.EncounterModule = EncounterModule;
exports.EncounterModule = EncounterModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([encounter_entity_1.Encounter, encounter_repository_1.EncounterRepository]),
            patient_module_1.PatientModule,
            staff_module_1.StaffModule,
            visit_module_1.VisitModule,
        ],
        controllers: [encounter_controller_1.EncounterController],
        providers: [encounter_service_1.EncounterService],
        exports: [encounter_service_1.EncounterService],
    })
], EncounterModule);
//# sourceMappingURL=encounter.module.js.map