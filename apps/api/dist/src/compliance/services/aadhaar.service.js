"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AadhaarService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AadhaarService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("./audit.service");
const bcrypt = __importStar(require("bcrypt"));
let AadhaarService = AadhaarService_1 = class AadhaarService {
    prisma;
    auditService;
    logger = new common_1.Logger(AadhaarService_1.name);
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async createAadhaar(createAadhaarDto, user) {
        this.logger.log(`Creating Aadhaar record for patient ${createAadhaarDto.patientId}`);
        const saltRounds = 12;
        const hashedAadhaar = await bcrypt.hash(createAadhaarDto.aadhaarNumber, saltRounds);
        const maskedAadhaar = 'XXXX-XXXX-' + createAadhaarDto.aadhaarNumber.slice(-4);
        const aadhaarRecord = await this.prisma.aadhaarRecord.create({
            data: {
                patientId: createAadhaarDto.patientId,
                aadhaarNumber: createAadhaarDto.aadhaarNumber,
                maskedAadhaar,
                hashedAadhaar,
                consentGiven: createAadhaarDto.consentGiven,
                consentDetails: createAadhaarDto.consentDetails,
                consentDate: createAadhaarDto.consentDate ? new Date(createAadhaarDto.consentDate) : new Date(),
                createdBy: user.id,
                updatedBy: user.id,
            },
        });
        await this.auditService.logActivity({
            action: 'AADHAAR_CREATED',
            entityType: 'AADHAAR',
            entityId: aadhaarRecord.id,
            userId: user.id,
            details: { patientId: createAadhaarDto.patientId, consentGiven: createAadhaarDto.consentGiven },
        });
        return {
            id: aadhaarRecord.id,
            patientId: aadhaarRecord.patientId,
            maskedAadhaar: aadhaarRecord.maskedAadhaar,
            consentGiven: aadhaarRecord.consentGiven,
            consentDate: aadhaarRecord.consentDate,
            createdAt: aadhaarRecord.createdAt,
        };
    }
    async updateAadhaar(id, updateAadhaarDto, user) {
        this.logger.log(`Updating Aadhaar record ${id}`);
        const existingRecord = await this.prisma.aadhaarRecord.findUnique({
            where: { id },
        });
        if (!existingRecord) {
            throw new common_1.NotFoundException('Aadhaar record not found');
        }
        const oldValues = { ...existingRecord };
        let hashedAadhaar = existingRecord.hashedAadhaar;
        if (updateAadhaarDto.hashedAadhaar) {
            hashedAadhaar = updateAadhaarDto.hashedAadhaar;
        }
        let maskedAadhaar = existingRecord.maskedAadhaar;
        if (updateAadhaarDto.maskedAadhaar) {
            maskedAadhaar = updateAadhaarDto.maskedAadhaar;
        }
        const updatedRecord = await this.prisma.aadhaarRecord.update({
            where: { id },
            data: {
                ...updateAadhaarDto,
                hashedAadhaar,
                maskedAadhaar,
                updatedBy: user.id,
                updatedAt: new Date(),
            },
        });
        await this.auditService.logActivity({
            action: 'AADHAAR_UPDATED',
            entityType: 'AADHAAR',
            entityId: id,
            userId: user.id,
            oldValues,
            newValues: updatedRecord,
        });
        return {
            id: updatedRecord.id,
            patientId: updatedRecord.patientId,
            maskedAadhaar: updatedRecord.maskedAadhaar,
            consentGiven: updatedRecord.consentGiven,
            consentDate: updatedRecord.consentDate,
            updatedAt: updatedRecord.updatedAt,
        };
    }
    async recordConsent(id, consentDto, user) {
        this.logger.log(`Recording Aadhaar consent for record ${id}`);
        const existingRecord = await this.prisma.aadhaarRecord.findUnique({
            where: { id },
        });
        if (!existingRecord) {
            throw new common_1.NotFoundException('Aadhaar record not found');
        }
        const oldValues = { ...existingRecord };
        const updatedRecord = await this.prisma.aadhaarRecord.update({
            where: { id },
            data: {
                consentGiven: consentDto.consentGiven,
                consentDetails: consentDto.consentDetails,
                consentDate: new Date(),
                updatedBy: user.id,
                updatedAt: new Date(),
            },
        });
        await this.auditService.logActivity({
            action: 'AADHAAR_CONSENT_UPDATED',
            entityType: 'AADHAAR',
            entityId: id,
            userId: user.id,
            oldValues,
            newValues: updatedRecord,
            details: {
                ipAddress: consentDto.ipAddress,
                userAgent: consentDto.userAgent,
            },
        });
        return {
            id: updatedRecord.id,
            consentGiven: updatedRecord.consentGiven,
            consentDate: updatedRecord.consentDate,
        };
    }
    async getAadhaar(id, user) {
        this.logger.log(`Retrieving Aadhaar record ${id}`);
        const aadhaarRecord = await this.prisma.aadhaarRecord.findUnique({
            where: { id },
            select: {
                id: true,
                patientId: true,
                maskedAadhaar: true,
                consentGiven: true,
                consentDetails: true,
                consentDate: true,
                createdAt: true,
                updatedAt: true,
                createdBy: true,
                updatedBy: true,
            },
        });
        if (!aadhaarRecord) {
            throw new common_1.NotFoundException('Aadhaar record not found');
        }
        await this.auditService.logActivity({
            action: 'AADHAAR_ACCESSED',
            entityType: 'AADHAAR',
            entityId: id,
            userId: user.id,
            details: { patientId: aadhaarRecord.patientId },
        });
        return aadhaarRecord;
    }
    async getComplianceStatus() {
        const totalRecords = await this.prisma.aadhaarRecord.count();
        const recordsWithConsent = await this.prisma.aadhaarRecord.count({
            where: { consentGiven: true },
        });
        const recordsWithoutConsent = totalRecords - recordsWithConsent;
        return {
            totalRecords,
            compliantRecords: recordsWithConsent,
            nonCompliantRecords: recordsWithoutConsent,
            compliancePercentage: totalRecords > 0 ? (recordsWithConsent / totalRecords) * 100 : 100,
            lastUpdated: new Date(),
        };
    }
    async validateCompliance(entityId) {
        const record = await this.prisma.aadhaarRecord.findUnique({
            where: { id: entityId },
        });
        if (!record) {
            return {
                isCompliant: false,
                issues: ['Aadhaar record not found'],
            };
        }
        const issues = [];
        if (!record.consentGiven) {
            issues.push('Aadhaar consent not provided');
        }
        if (!record.maskedAadhaar) {
            issues.push('Aadhaar number not properly masked');
        }
        return {
            isCompliant: issues.length === 0,
            issues,
        };
    }
    async verifyAadhaar(aadhaarNumber, recordId) {
        const record = await this.prisma.aadhaarRecord.findUnique({
            where: { id: recordId },
            select: { hashedAadhaar: true },
        });
        if (!record || !record.hashedAadhaar) {
            return false;
        }
        return bcrypt.compare(aadhaarNumber, record.hashedAadhaar);
    }
    async getPatientAadhaar(patientId, user) {
        this.logger.log(`Retrieving Aadhaar records for patient ${patientId}`);
        const records = await this.prisma.aadhaarRecord.findMany({
            where: { patientId },
            select: {
                id: true,
                maskedAadhaar: true,
                consentGiven: true,
                consentDate: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        await this.auditService.logActivity({
            action: 'PATIENT_AADHAAR_ACCESSED',
            entityType: 'PATIENT',
            entityId: patientId,
            userId: user.id,
        });
        return records;
    }
};
exports.AadhaarService = AadhaarService;
exports.AadhaarService = AadhaarService = AadhaarService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], AadhaarService);
//# sourceMappingURL=aadhaar.service.js.map