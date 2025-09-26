"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const document_entity_1 = require("../entities/document.entity");
const document_service_1 = require("../services/document.service");
const document_controller_1 = require("../controllers/document.controller");
const document_repository_1 = require("../repositories/document.repository");
const patient_module_1 = require("../../patient/patient.module");
const staff_module_1 = require("../../staff-management/staff.module");
const encounter_module_1 = require("./encounter.module");
let DocumentModule = class DocumentModule {
};
exports.DocumentModule = DocumentModule;
exports.DocumentModule = DocumentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([document_entity_1.Document, document_repository_1.DocumentRepository]),
            patient_module_1.PatientModule,
            staff_module_1.StaffModule,
            encounter_module_1.EncounterModule,
        ],
        controllers: [document_controller_1.DocumentController],
        providers: [document_service_1.DocumentService],
        exports: [document_service_1.DocumentService],
    })
], DocumentModule);
//# sourceMappingURL=document.module.js.map