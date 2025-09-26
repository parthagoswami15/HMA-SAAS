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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContrastAllergyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ContrastAllergyService = class ContrastAllergyService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async recordContrastAllergy(allergyData) {
        const { patientId, contrastType, reactionType, severity, requiresAlert, notes } = allergyData;
        const patient = await this.prisma.patient.findUnique({
            where: { id: patientId },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found');
        }
        const allergy = await this.prisma.contrastAllergy.create({
            data: {
                patientId,
                contrastType,
                reactionType,
                severity,
                requiresAlert: requiresAlert ?? true,
                notes,
                recordedAt: new Date(),
                tenantId: patient.tenantId,
            },
        });
        return allergy;
    }
    async getPatientAllergies(patientId) {
        const allergies = await this.prisma.contrastAllergy.findMany({
            where: { patientId },
            orderBy: { recordedAt: 'desc' },
        });
        return allergies;
    }
    async checkContrastAllergy(patientId, contrastType) {
        const allergy = await this.prisma.contrastAllergy.findFirst({
            where: {
                patientId,
                contrastType,
                requiresAlert: true,
            },
        });
        if (allergy) {
            return {
                hasAllergy: true,
                allergy,
                recommendation: this.getContrastRecommendation(allergy.severity, contrastType),
            };
        }
        return {
            hasAllergy: false,
            recommendation: 'Proceed with standard contrast protocol',
        };
    }
    async updateAllergy(allergyId, updateData) {
        const allergy = await this.prisma.contrastAllergy.findUnique({
            where: { id: allergyId },
        });
        if (!allergy) {
            throw new common_1.NotFoundException('Contrast allergy record not found');
        }
        return this.prisma.contrastAllergy.update({
            where: { id: allergyId },
            data: updateData,
        });
    }
    async getAllergyAlerts(patientId) {
        const alerts = await this.prisma.contrastAllergy.findMany({
            where: {
                patientId,
                requiresAlert: true,
            },
        });
        return alerts.map(allergy => ({
            id: allergy.id,
            contrastType: allergy.contrastType,
            severity: allergy.severity,
            reactionType: allergy.reactionType,
            recordedAt: allergy.recordedAt,
            alertLevel: this.getAlertLevel(allergy.severity),
            message: `Patient has ${allergy.severity.toLowerCase()} ${allergy.contrastType} contrast allergy`,
        }));
    }
    async getContrastProtocol(patientId, contrastType) {
        const allergyCheck = await this.checkContrastAllergy(patientId, contrastType);
        if (allergyCheck.hasAllergy) {
            return {
                canProceed: false,
                protocol: 'PREMEDICATION_REQUIRED',
                instructions: this.getPremedicationInstructions(allergyCheck.allergy.severity),
                alternativeContrast: this.getAlternativeContrast(contrastType),
                monitoring: this.getMonitoringRequirements(allergyCheck.allergy.severity),
            };
        }
        return {
            canProceed: true,
            protocol: 'STANDARD',
            instructions: 'Standard contrast administration protocol',
            monitoring: 'Standard monitoring (blood pressure, heart rate)',
        };
    }
    async getAllergyStatistics(tenantId) {
        const totalPatients = await this.prisma.patient.count({ where: { tenantId } });
        const allergyStats = await this.prisma.contrastAllergy.groupBy({
            by: ['contrastType', 'severity'],
            where: { tenantId },
            _count: { id: true },
        });
        const patientsWithAllergies = await this.prisma.contrastAllergy.findMany({
            where: { tenantId },
            select: { patientId: true },
            distinct: ['patientId'],
        });
        const recentAllergies = await this.prisma.contrastAllergy.findMany({
            where: {
                tenantId,
                recordedAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                },
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: { recordedAt: 'desc' },
        });
        return {
            totalPatients,
            patientsWithAllergies: patientsWithAllergies.length,
            allergyPrevalence: totalPatients > 0 ? (patientsWithAllergies.length / totalPatients) * 100 : 0,
            allergiesByType: this.groupAllergiesByType(allergyStats),
            recentAllergies,
        };
    }
    getContrastRecommendation(severity, contrastType) {
        switch (severity) {
            case 'MILD':
                return 'Premedication recommended. Use alternative contrast if possible.';
            case 'MODERATE':
                return 'Premedication required. Consider alternative imaging modality.';
            case 'SEVERE':
                return 'Contraindicated. Use alternative imaging modality.';
            default:
                return 'Proceed with caution and appropriate premedication.';
        }
    }
    getPremedicationInstructions(severity) {
        switch (severity) {
            case 'MILD':
                return 'Prednisone 50mg PO 13h, 7h, and 1h before contrast. Diphenhydramine 50mg PO 1h before contrast.';
            case 'MODERATE':
                return 'Prednisone 50mg PO 13h, 7h, and 1h before contrast. Diphenhydramine 50mg PO 1h before contrast. Consider IV corticosteroids.';
            case 'SEVERE':
                return 'Contraindicated. Alternative imaging required.';
            default:
                return 'Standard premedication protocol with corticosteroids and antihistamines.';
        }
    }
    getAlternativeContrast(contrastType) {
        switch (contrastType) {
            case 'IODINATED':
                return 'Gadolinium-based (if MRI compatible)';
            case 'GADOLINIUM':
                return 'Iodinated (if CT compatible)';
            default:
                return 'Consider non-contrast imaging or alternative modality';
        }
    }
    getMonitoringRequirements(severity) {
        switch (severity) {
            case 'MILD':
                return 'Monitor vital signs every 15 minutes for 30 minutes post-contrast';
            case 'MODERATE':
                return 'Monitor vital signs continuously during and 30 minutes post-contrast. Emergency equipment ready.';
            case 'SEVERE':
                return 'Contraindicated. Alternative imaging required.';
            default:
                return 'Standard monitoring protocol';
        }
    }
    getAlertLevel(severity) {
        switch (severity) {
            case 'MILD':
                return 'WARNING';
            case 'MODERATE':
                return 'CRITICAL';
            case 'SEVERE':
                return 'CRITICAL';
            default:
                return 'WARNING';
        }
    }
    groupAllergiesByType(allergyStats) {
        const grouped = {};
        allergyStats.forEach(stat => {
            if (!grouped[stat.contrastType]) {
                grouped[stat.contrastType] = {};
            }
            grouped[stat.contrastType][stat.severity.toLowerCase()] = stat._count.id;
        });
        return grouped;
    }
    async createAllergyAlert(patientId, contrastType) {
        const allergyCheck = await this.checkContrastAllergy(patientId, contrastType);
        if (allergyCheck.hasAllergy) {
            return this.prisma.notification.create({
                data: {
                    type: 'ALERT',
                    title: 'Contrast Allergy Alert',
                    message: `Patient has known ${contrastType} contrast allergy. ${allergyCheck.recommendation}`,
                    userId: patientId,
                    metadata: {
                        patientId,
                        contrastType,
                        allergyId: allergyCheck.allergy.id,
                        severity: allergyCheck.allergy.severity,
                    },
                },
            });
        }
        return null;
    }
};
exports.ContrastAllergyService = ContrastAllergyService;
exports.ContrastAllergyService = ContrastAllergyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContrastAllergyService);
//# sourceMappingURL=contrast-allergy.service.js.map