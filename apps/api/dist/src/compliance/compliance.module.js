"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceModule = void 0;
const common_1 = require("@nestjs/common");
const compliance_controller_1 = require("./compliance.controller");
const compliance_service_1 = require("./compliance.service");
const aadhaar_service_1 = require("./services/aadhaar.service");
const audit_service_1 = require("./services/audit.service");
const birth_death_service_1 = require("./services/birth-death.service");
const pcpndt_service_1 = require("./services/pcpndt.service");
const prescription_service_1 = require("./services/prescription.service");
const data_localization_service_1 = require("./services/data-localization.service");
const compliance_guard_1 = require("./guards/compliance.guard");
const pcpndt_guard_1 = require("./guards/pcpndt.guard");
const prescription_guard_1 = require("./guards/prescription.guard");
const prisma_module_1 = require("../prisma/prisma.module");
const audit_module_1 = require("../audit/audit.module");
let ComplianceModule = class ComplianceModule {
};
exports.ComplianceModule = ComplianceModule;
exports.ComplianceModule = ComplianceModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, audit_module_1.AuditModule],
        controllers: [compliance_controller_1.ComplianceController],
        providers: [
            compliance_service_1.ComplianceService,
            aadhaar_service_1.AadhaarService,
            audit_service_1.AuditService,
            birth_death_service_1.BirthDeathService,
            pcpndt_service_1.PcpndtService,
            prescription_service_1.PrescriptionService,
            data_localization_service_1.DataLocalizationService,
            compliance_guard_1.ComplianceGuard,
            pcpndt_guard_1.PcpndtGuard,
            prescription_guard_1.PrescriptionGuard,
        ],
        exports: [
            compliance_service_1.ComplianceService,
            aadhaar_service_1.AadhaarService,
            audit_service_1.AuditService,
            birth_death_service_1.BirthDeathService,
            pcpndt_service_1.PcpndtService,
            prescription_service_1.PrescriptionService,
            data_localization_service_1.DataLocalizationService,
        ],
    })
], ComplianceModule);
//# sourceMappingURL=compliance.module.js.map