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
var ConsentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../../audit/audit.service");
let ConsentService = ConsentService_1 = class ConsentService {
    prisma;
    auditService;
    logger = new common_1.Logger(ConsentService_1.name);
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async getConsents(user) {
        this.logger.log(`Getting consents for user: ${user.id}`);
        const consents = await this.prisma.patientConsent.findMany({
            where: { userId: user.id },
            include: {
                givenBy: { select: { name: true, email: true } },
                givenFor: { select: { name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return consents.map(consent => ({
            id: consent.id,
            consentType: consent.consentType,
            purpose: consent.purpose,
            status: consent.status,
            givenBy: consent.givenBy,
            givenFor: consent.givenFor,
            validFrom: consent.validFrom,
            validUntil: consent.validUntil,
            isRevocable: consent.isRevocable,
            createdAt: consent.createdAt,
        }));
    }
    async createConsent(consentDto, user) {
        this.logger.log(`Creating consent for user: ${user.id}`);
        const { consentType, purpose, givenForId, validFrom, validUntil, isRevocable = true, termsAccepted, } = consentDto;
        if (!termsAccepted) {
            throw new common_1.BadRequestException('Terms must be accepted to give consent');
        }
        const consent = await this.prisma.patientConsent.create({
            data: {
                userId: user.id,
                consentType,
                purpose,
                givenById: user.id,
                givenForId,
                validFrom: validFrom ? new Date(validFrom) : new Date(),
                validUntil: validUntil ? new Date(validUntil) : null,
                isRevocable,
                status: 'ACTIVE',
                termsAccepted,
                metadata: JSON.stringify({}),
            },
            include: {
                givenBy: { select: { name: true, email: true } },
                givenFor: { select: { name: true, email: true } },
            },
        });
        await this.auditService.logActivity({
            action: 'CONSENT_GIVEN',
            entityType: 'PATIENT_CONSENT',
            entityId: consent.id,
            userId: user.id,
            details: { consentType, purpose },
        });
        return consent;
    }
    async updateConsent(consentId, updateDto, user) {
        this.logger.log(`Updating consent: ${consentId}`);
        const consent = await this.prisma.patientConsent.findFirst({
            where: {
                id: consentId,
                userId: user.id,
            },
        });
        if (!consent) {
            throw new common_1.NotFoundException('Consent not found');
        }
        if (consent.status === 'REVOKED') {
            throw new common_1.BadRequestException('Cannot update revoked consent');
        }
        const updatedConsent = await this.prisma.patientConsent.update({
            where: { id: consentId },
            data: {
                ...updateDto,
                updatedAt: new Date(),
            },
            include: {
                givenBy: { select: { name: true, email: true } },
                givenFor: { select: { name: true, email: true } },
            },
        });
        await this.auditService.logActivity({
            action: 'CONSENT_UPDATED',
            entityType: 'PATIENT_CONSENT',
            entityId: consentId,
            userId: user.id,
            details: updateDto,
        });
        return updatedConsent;
    }
    async revokeConsent(consentId, user) {
        this.logger.log(`Revoking consent: ${consentId}`);
        const consent = await this.prisma.patientConsent.findFirst({
            where: {
                id: consentId,
                userId: user.id,
            },
        });
        if (!consent) {
            throw new common_1.NotFoundException('Consent not found');
        }
        if (!consent.isRevocable) {
            throw new common_1.BadRequestException('This consent cannot be revoked');
        }
        if (consent.status === 'REVOKED') {
            throw new common_1.BadRequestException('Consent is already revoked');
        }
        const revokedConsent = await this.prisma.patientConsent.update({
            where: { id: consentId },
            data: {
                status: 'REVOKED',
                revokedAt: new Date(),
                revokedBy: user.id,
            },
        });
        await this.auditService.logActivity({
            action: 'CONSENT_REVOKED',
            entityType: 'PATIENT_CONSENT',
            entityId: consentId,
            userId: user.id,
        });
        return revokedConsent;
    }
    async getConsentStatus(consentId, user) {
        this.logger.log(`Getting consent status: ${consentId}`);
        const consent = await this.prisma.patientConsent.findFirst({
            where: {
                id: consentId,
                userId: user.id,
            },
        });
        if (!consent) {
            throw new common_1.NotFoundException('Consent not found');
        }
        const isValid = this.isConsentValid(consent);
        return {
            consentId,
            status: consent.status,
            isValid,
            validFrom: consent.validFrom,
            validUntil: consent.validUntil,
            daysUntilExpiry: consent.validUntil ? this.getDaysUntilExpiry(consent.validUntil) : null,
        };
    }
    async getActiveConsents(user) {
        this.logger.log(`Getting active consents for user: ${user.id}`);
        const consents = await this.prisma.patientConsent.findMany({
            where: {
                userId: user.id,
                status: 'ACTIVE',
                validUntil: {
                    OR: [
                        { gte: new Date() },
                        { equals: null },
                    ],
                },
            },
        });
        return consents.filter(consent => this.isConsentValid(consent));
    }
    async getConsentHistory(user) {
        this.logger.log(`Getting consent history for user: ${user.id}`);
        const consents = await this.prisma.patientConsent.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        });
        return consents.map(consent => ({
            id: consent.id,
            consentType: consent.consentType,
            purpose: consent.purpose,
            status: consent.status,
            validFrom: consent.validFrom,
            validUntil: consent.validUntil,
            revokedAt: consent.revokedAt,
            createdAt: consent.createdAt,
        }));
    }
    async getConsentStats(user) {
        const totalConsents = await this.prisma.patientConsent.count({
            where: { userId: user.id },
        });
        const activeConsents = await this.prisma.patientConsent.count({
            where: {
                userId: user.id,
                status: 'ACTIVE',
            },
        });
        const revokedConsents = await this.prisma.patientConsent.count({
            where: {
                userId: user.id,
                status: 'REVOKED',
            },
        });
        const consentsByType = await this.prisma.patientConsent.groupBy({
            by: ['consentType'],
            where: { userId: user.id },
            _count: { consentType: true },
        });
        return {
            userId: user.id,
            totalConsents,
            activeConsents,
            revokedConsents,
            consentsByType,
        };
    }
    isConsentValid(consent) {
        if (consent.status !== 'ACTIVE') {
            return false;
        }
        if (consent.validUntil) {
            return new Date() <= consent.validUntil;
        }
        return true;
    }
    getDaysUntilExpiry(validUntil) {
        const now = new Date();
        const expiry = new Date(validUntil);
        const diffTime = expiry.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    }
    async getConsentTemplate(consentType) {
        this.logger.log(`Getting consent template for type: ${consentType}`);
        const template = await this.prisma.consentTemplate.findFirst({
            where: { consentType },
        });
        if (!template) {
            throw new common_1.NotFoundException('Consent template not found');
        }
        return {
            consentType: template.consentType,
            title: template.title,
            content: template.content,
            version: template.version,
            isMandatory: template.isMandatory,
            validForDays: template.validForDays,
        };
    }
    async getAllConsentTemplates() {
        this.logger.log('Getting all consent templates');
        const templates = await this.prisma.consentTemplate.findMany({
            orderBy: { consentType: 'asc' },
        });
        return templates.map(template => ({
            consentType: template.consentType,
            title: template.title,
            version: template.version,
            isMandatory: template.isMandatory,
            validForDays: template.validForDays,
        }));
    }
};
exports.ConsentService = ConsentService;
exports.ConsentService = ConsentService = ConsentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], ConsentService);
//# sourceMappingURL=consent.service.js.map