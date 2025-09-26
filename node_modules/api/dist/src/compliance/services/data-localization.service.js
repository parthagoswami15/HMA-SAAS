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
var DataLocalizationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataLocalizationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("./audit.service");
let DataLocalizationService = DataLocalizationService_1 = class DataLocalizationService {
    prisma;
    auditService;
    logger = new common_1.Logger(DataLocalizationService_1.name);
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async getLocalizationStatus(user) {
        this.logger.log(`Retrieving data localization status for user ${user.id}`);
        const [totalPatients, localizedPatients, totalRecords, localizedRecords, dataCenters,] = await Promise.all([
            this.prisma.patient.count(),
            this.prisma.patient.count({ where: { dataLocalized: true } }),
            this.prisma.patientRecord.count(),
            this.prisma.patientRecord.count({ where: { dataLocalized: true } }),
            this.prisma.dataCenter.findMany({
                where: { isActive: true },
                select: { id: true, name: true, location: true, complianceLevel: true },
            }),
        ]);
        const complianceScore = this.calculateComplianceScore(totalPatients, localizedPatients, totalRecords, localizedRecords);
        await this.auditService.logActivity({
            action: 'DATA_LOCALIZATION_STATUS_ACCESSED',
            entityType: 'DATA_LOCALIZATION',
            userId: user.id,
            details: { complianceScore },
        });
        return {
            complianceScore,
            summary: {
                totalPatients,
                localizedPatients,
                localizationPercentage: totalPatients > 0 ? (localizedPatients / totalPatients) * 100 : 100,
                totalRecords,
                localizedRecords,
                recordLocalizationPercentage: totalRecords > 0 ? (localizedRecords / totalRecords) * 100 : 100,
            },
            dataCenters,
            lastUpdated: new Date(),
        };
    }
    async ensureCompliance(complianceDto, user) {
        this.logger.log(`Ensuring data localization compliance for user ${user.id}`);
        const { entityType, entityIds, targetDataCenter, reason } = complianceDto;
        if (!entityIds || entityIds.length === 0) {
            throw new common_1.BadRequestException('Entity IDs are required');
        }
        const results = [];
        const errors = [];
        for (const entityId of entityIds) {
            try {
                if (entityType === 'PATIENT') {
                    await this.localizePatientData(entityId, targetDataCenter, user);
                    results.push({ entityId, status: 'SUCCESS' });
                }
                else if (entityType === 'RECORD') {
                    await this.localizeRecordData(entityId, targetDataCenter, user);
                    results.push({ entityId, status: 'SUCCESS' });
                }
                else {
                    errors.push({ entityId, error: 'Invalid entity type' });
                }
            }
            catch (error) {
                errors.push({ entityId, error: error.message });
            }
        }
        await this.auditService.logActivity({
            action: 'DATA_LOCALIZATION_ENFORCED',
            entityType: 'DATA_LOCALIZATION',
            userId: user.id,
            details: {
                entityType,
                entityIds,
                targetDataCenter,
                reason,
                results,
                errors,
            },
        });
        return {
            totalRequested: entityIds.length,
            successful: results.length,
            failed: errors.length,
            results,
            errors,
        };
    }
    async validateCompliance(entityId) {
        const [patient, record] = await Promise.all([
            this.prisma.patient.findUnique({
                where: { id: entityId },
                select: { dataLocalized: true, sensitiveDataLevel: true },
            }),
            this.prisma.patientRecord.findUnique({
                where: { id: entityId },
                select: { dataLocalized: true, sensitivityLevel: true },
            }),
        ]);
        const entity = patient || record;
        if (!entity) {
            return {
                isCompliant: false,
                issues: ['Entity not found'],
            };
        }
        const issues = [];
        if (!entity.dataLocalized) {
            issues.push('Data not localized to India');
        }
        if (entity.sensitiveDataLevel === 'HIGH' || entity.sensitivityLevel === 'HIGH') {
            const highSensitivityCheck = await this.validateHighSensitivityData(entityId);
            if (!highSensitivityCheck.isCompliant) {
                issues.push(...highSensitivityCheck.issues);
            }
        }
        return {
            isCompliant: issues.length === 0,
            issues,
        };
    }
    async localizePatientData(patientId, targetDataCenter, user) {
        this.logger.log(`Localizing patient data ${patientId} to ${targetDataCenter}`);
        const dataCenter = await this.prisma.dataCenter.findUnique({
            where: { id: targetDataCenter },
        });
        if (!dataCenter) {
            throw new common_1.BadRequestException('Invalid data center');
        }
        if (!dataCenter.isInIndia) {
            throw new common_1.BadRequestException('Data must be localized to India');
        }
        await this.prisma.patient.update({
            where: { id: patientId },
            data: {
                dataLocalized: true,
                dataCenterId: targetDataCenter,
                localizedAt: new Date(),
                localizedBy: user.id,
            },
        });
        await this.prisma.patientRecord.updateMany({
            where: { patientId },
            data: {
                dataLocalized: true,
                dataCenterId: targetDataCenter,
            },
        });
        await this.auditService.logActivity({
            action: 'PATIENT_DATA_LOCALIZED',
            entityType: 'PATIENT',
            entityId: patientId,
            userId: user.id,
            details: { dataCenter: targetDataCenter },
        });
    }
    async localizeRecordData(recordId, targetDataCenter, user) {
        this.logger.log(`Localizing record data ${recordId} to ${targetDataCenter}`);
        const dataCenter = await this.prisma.dataCenter.findUnique({
            where: { id: targetDataCenter },
        });
        if (!dataCenter) {
            throw new common_1.BadRequestException('Invalid data center');
        }
        if (!dataCenter.isInIndia) {
            throw new common_1.BadRequestException('Data must be localized to India');
        }
        await this.prisma.patientRecord.update({
            where: { id: recordId },
            data: {
                dataLocalized: true,
                dataCenterId: targetDataCenter,
                localizedAt: new Date(),
                localizedBy: user.id,
            },
        });
        await this.auditService.logActivity({
            action: 'RECORD_DATA_LOCALIZED',
            entityType: 'PATIENT_RECORD',
            entityId: recordId,
            userId: user.id,
            details: { dataCenter: targetDataCenter },
        });
    }
    async validateHighSensitivityData(entityId) {
        const encryptionCheck = await this.prisma.dataEncryption.findFirst({
            where: {
                entityId,
                status: 'ACTIVE',
            },
        });
        if (!encryptionCheck) {
            return {
                isCompliant: false,
                issues: ['High sensitivity data must be encrypted at rest'],
            };
        }
        const accessControls = await this.prisma.accessControl.findMany({
            where: { entityId },
        });
        if (accessControls.length === 0) {
            return {
                isCompliant: false,
                issues: ['Access controls required for high sensitivity data'],
            };
        }
        return {
            isCompliant: true,
            issues: [],
        };
    }
    calculateComplianceScore(totalPatients, localizedPatients, totalRecords, localizedRecords) {
        if (totalPatients === 0 && totalRecords === 0)
            return 100;
        const patientScore = totalPatients > 0 ? (localizedPatients / totalPatients) * 100 : 100;
        const recordScore = totalRecords > 0 ? (localizedRecords / totalRecords) * 100 : 100;
        return Math.round((patientScore * 0.6) + (recordScore * 0.4));
    }
    async getDataCenters(user) {
        this.logger.log(`Retrieving data centers for user ${user.id}`);
        const dataCenters = await this.prisma.dataCenter.findMany({
            select: {
                id: true,
                name: true,
                location: true,
                isInIndia: true,
                complianceLevel: true,
                isActive: true,
                capacity: true,
                currentLoad: true,
            },
        });
        await this.auditService.logActivity({
            action: 'DATA_CENTERS_ACCESSED',
            entityType: 'DATA_CENTER',
            userId: user.id,
        });
        return dataCenters;
    }
    async getLocalizationReports(query, user) {
        const { fromDate, toDate, dataCenterId, entityType } = query;
        const where = {};
        if (fromDate)
            where.localizedAt = { ...where.localizedAt, gte: new Date(fromDate) };
        if (toDate)
            where.localizedAt = { ...where.localizedAt, lte: new Date(toDate) };
        if (dataCenterId)
            where.dataCenterId = dataCenterId;
        let localizationData;
        if (entityType === 'PATIENT') {
            localizationData = await this.prisma.patient.findMany({
                where,
                select: {
                    id: true,
                    localizedAt: true,
                    dataCenterId: true,
                    dataLocalized: true,
                },
            });
        }
        else {
            localizationData = await this.prisma.patientRecord.findMany({
                where,
                select: {
                    id: true,
                    localizedAt: true,
                    dataCenterId: true,
                    dataLocalized: true,
                },
            });
        }
        await this.auditService.logActivity({
            action: 'LOCALIZATION_REPORTS_ACCESSED',
            entityType: 'DATA_LOCALIZATION',
            userId: user.id,
            details: { filters: query, count: localizationData.length },
        });
        return {
            data: localizationData,
            total: localizationData.length,
            period: { from: fromDate, to: toDate },
        };
    }
    async checkComplianceRequirements(entityType, sensitivityLevel, user) {
        const requirements = {
            dataLocalization: true,
            encryption: sensitivityLevel === 'HIGH',
            accessControl: sensitivityLevel === 'HIGH' || sensitivityLevel === 'MEDIUM',
            auditLogging: true,
            backupRetention: true,
        };
        await this.auditService.logActivity({
            action: 'COMPLIANCE_REQUIREMENTS_CHECKED',
            entityType,
            userId: user.id,
            details: { sensitivityLevel, requirements },
        });
        return requirements;
    }
};
exports.DataLocalizationService = DataLocalizationService;
exports.DataLocalizationService = DataLocalizationService = DataLocalizationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], DataLocalizationService);
//# sourceMappingURL=data-localization.service.js.map