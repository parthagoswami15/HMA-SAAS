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
var ComplianceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceService = void 0;
const common_1 = require("@nestjs/common");
const aadhaar_service_1 = require("./services/aadhaar.service");
const audit_service_1 = require("./services/audit.service");
const birth_death_service_1 = require("./services/birth-death.service");
const pcpndt_service_1 = require("./services/pcpndt.service");
const prescription_service_1 = require("./services/prescription.service");
const data_localization_service_1 = require("./services/data-localization.service");
let ComplianceService = ComplianceService_1 = class ComplianceService {
    aadhaarService;
    auditService;
    birthDeathService;
    pcpndtService;
    prescriptionService;
    dataLocalizationService;
    logger = new common_1.Logger(ComplianceService_1.name);
    constructor(aadhaarService, auditService, birthDeathService, pcpndtService, prescriptionService, dataLocalizationService) {
        this.aadhaarService = aadhaarService;
        this.auditService = auditService;
        this.birthDeathService = birthDeathService;
        this.pcpndtService = pcpndtService;
        this.prescriptionService = prescriptionService;
        this.dataLocalizationService = dataLocalizationService;
    }
    async generateComplianceReport(query, user) {
        this.logger.log(`Generating compliance report for user ${user.id}`);
        const report = {
            timestamp: new Date(),
            generatedBy: user.id,
            period: query.period || 'monthly',
            components: {
                aadhaar: await this.aadhaarService.getComplianceStatus(),
                audit: await this.auditService.getComplianceStatus(),
                birthDeath: await this.birthDeathService.getComplianceStatus(),
                pcpndt: await this.pcpndtService.getComplianceStatus(),
                prescription: await this.prescriptionService.getComplianceStatus(),
                dataLocalization: await this.dataLocalizationService.getComplianceStatus(),
            },
            summary: {
                totalRecords: 0,
                compliantRecords: 0,
                nonCompliantRecords: 0,
                compliancePercentage: 0,
            },
        };
        const total = Object.values(report.components).reduce((sum, component) => sum + (component.totalRecords || 0), 0);
        const compliant = Object.values(report.components).reduce((sum, component) => sum + (component.compliantRecords || 0), 0);
        report.summary = {
            totalRecords: total,
            compliantRecords: compliant,
            nonCompliantRecords: total - compliant,
            compliancePercentage: total > 0 ? (compliant / total) * 100 : 100,
        };
        await this.auditService.logActivity({
            action: 'COMPLIANCE_REPORT_GENERATED',
            entityType: 'COMPLIANCE',
            entityId: null,
            userId: user.id,
            details: { reportType: query.type, period: query.period },
        });
        return report;
    }
    async getOverallComplianceStatus(user) {
        const report = await this.generateComplianceReport({}, user);
        return {
            status: report.summary.compliancePercentage >= 95 ? 'COMPLIANT' : 'NEEDS_ATTENTION',
            percentage: report.summary.compliancePercentage,
            lastUpdated: new Date(),
        };
    }
    async validateCompliance(entityType, entityId, user) {
        this.logger.log(`Validating compliance for ${entityType}:${entityId}`);
        const validations = {
            aadhaar: await this.aadhaarService.validateCompliance(entityId),
            audit: await this.auditService.validateCompliance(entityId),
            pcpndt: await this.pcpndtService.validateCompliance(entityId),
            prescription: await this.prescriptionService.validateCompliance(entityId),
            dataLocalization: await this.dataLocalizationService.validateCompliance(entityId),
        };
        const isCompliant = Object.values(validations).every(v => v.isCompliant);
        await this.auditService.logActivity({
            action: 'COMPLIANCE_VALIDATION',
            entityType,
            entityId,
            userId: user.id,
            details: { validations, isCompliant },
        });
        return {
            isCompliant,
            validations,
            timestamp: new Date(),
        };
    }
};
exports.ComplianceService = ComplianceService;
exports.ComplianceService = ComplianceService = ComplianceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [aadhaar_service_1.AadhaarService,
        audit_service_1.AuditService,
        birth_death_service_1.BirthDeathService,
        pcpndt_service_1.PcpndtService,
        prescription_service_1.PrescriptionService,
        data_localization_service_1.DataLocalizationService])
], ComplianceService);
//# sourceMappingURL=compliance.service.js.map