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
var StateRestrictionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateRestrictionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../../audit/audit.service");
let StateRestrictionService = StateRestrictionService_1 = class StateRestrictionService {
    prisma;
    auditService;
    logger = new common_1.Logger(StateRestrictionService_1.name);
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async validatePrescriptionRestrictions(state, userId) {
        this.logger.log(`Validating prescription restrictions for state: ${state}`);
        const stateRestrictions = await this.prisma.statePrescriptionRestriction.findUnique({
            where: { state },
        });
        if (!stateRestrictions) {
            return { allowed: true };
        }
        const userLicenses = await this.prisma.userLicense.findMany({
            where: { userId },
            include: { license: true },
        });
        const requiredLicenses = stateRestrictions.requiredLicenses || [];
        const userLicenseTypes = userLicenses.map(ul => ul.license.type);
        const missingLicenses = requiredLicenses.filter(license => !userLicenseTypes.includes(license));
        if (missingLicenses.length > 0) {
            throw new common_1.BadRequestException(`Missing required licenses for prescribing in ${state}: ${missingLicenses.join(', ')}`);
        }
        const restrictedDrugs = stateRestrictions.restrictedDrugs || [];
        if (restrictedDrugs.length > 0) {
            this.logger.warn(`State ${state} has restrictions on: ${restrictedDrugs.join(', ')}`);
        }
        return {
            allowed: true,
            restrictions: {
                restrictedDrugs,
                requiredLicenses,
                specialConditions: stateRestrictions.specialConditions,
            },
        };
    }
    async validateScheduleDrugPrescription(medication, userId) {
        this.logger.log(`Validating Schedule drug prescription: ${medication.drugName}`);
        const doctor = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                licenses: {
                    include: { license: true },
                },
                state: true,
            },
        });
        if (!doctor) {
            throw new common_1.NotFoundException('Doctor not found');
        }
        const scheduleLicense = doctor.licenses.find(l => l.license.type === 'SCHEDULE_DRUG_LICENSE');
        if (!scheduleLicense) {
            throw new common_1.BadRequestException(`Schedule ${medication.scheduleCategory} drugs require special license`);
        }
        if (medication.scheduleCategory === 'H' || medication.scheduleCategory === 'X') {
            const existingPrescriptions = await this.prisma.prescriptionMedication.count({
                where: {
                    prescription: {
                        doctorId: userId,
                        createdAt: {
                            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                        },
                    },
                    drugName: medication.drugName,
                    isScheduledDrug: true,
                },
            });
            if (existingPrescriptions >= 3) {
                throw new common_1.BadRequestException('Monthly limit exceeded for this narcotic drug');
            }
        }
        return { allowed: true };
    }
    async getStateRestrictions(state, user) {
        const restrictions = await this.prisma.statePrescriptionRestriction.findUnique({
            where: { state },
        });
        if (!restrictions) {
            return {
                state,
                allowed: true,
                restrictions: {
                    restrictedDrugs: [],
                    requiredLicenses: [],
                    specialConditions: null,
                },
            };
        }
        return {
            state,
            allowed: true,
            restrictions: {
                restrictedDrugs: restrictions.restrictedDrugs,
                requiredLicenses: restrictions.requiredLicenses,
                specialConditions: restrictions.specialConditions,
                lastUpdated: restrictions.updatedAt,
            },
        };
    }
    async updateStateRestrictions(state, restrictionsDto, user) {
        this.logger.log(`Updating state restrictions for ${state}`);
        const updatedRestrictions = await this.prisma.statePrescriptionRestriction.upsert({
            where: { state },
            update: {
                restrictedDrugs: restrictionsDto.restrictedDrugs,
                requiredLicenses: restrictionsDto.requiredLicenses,
                specialConditions: restrictionsDto.specialConditions,
                updatedBy: user.id,
                updatedAt: new Date(),
            },
            create: {
                state,
                restrictedDrugs: restrictionsDto.restrictedDrugs,
                requiredLicenses: restrictionsDto.requiredLicenses,
                specialConditions: restrictionsDto.specialConditions,
                createdBy: user.id,
            },
        });
        await this.auditService.logActivity({
            action: 'STATE_RESTRICTIONS_UPDATED',
            entityType: 'STATE_PRESCRIPTION_RESTRICTION',
            entityId: updatedRestrictions.id,
            userId: user.id,
            details: { state, updatedFields: Object.keys(restrictionsDto) },
        });
        return updatedRestrictions;
    }
    async getAllStateRestrictions() {
        const restrictions = await this.prisma.statePrescriptionRestriction.findMany({
            orderBy: { state: 'asc' },
        });
        return restrictions;
    }
    async checkDrugAvailability(drugName, state) {
        this.logger.log(`Checking drug availability: ${drugName} in ${state}`);
        const stateRestrictions = await this.prisma.statePrescriptionRestriction.findUnique({
            where: { state },
        });
        if (!stateRestrictions) {
            return { available: true, restrictions: null };
        }
        const isRestricted = stateRestrictions.restrictedDrugs.includes(drugName);
        return {
            available: !isRestricted,
            restrictions: isRestricted ? 'Drug is restricted in this state' : null,
            state,
        };
    }
    async validateTelemedicinePrescription(state, userId) {
        this.logger.log(`Validating telemedicine prescription for state: ${state}`);
        const telemedicineRules = await this.prisma.telemedicineRegulation.findUnique({
            where: { state },
        });
        if (!telemedicineRules) {
            return { allowed: true };
        }
        if (!telemedicineRules.allowed) {
            throw new common_1.BadRequestException(`Telemedicine prescribing not allowed in ${state}`);
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                licenses: { include: { license: true } },
                experience: true,
                specialization: true,
            },
        });
        const requiredExperience = telemedicineRules.requiredExperience || 0;
        if (user.experience < requiredExperience) {
            throw new common_1.BadRequestException(`Minimum ${requiredExperience} years experience required for telemedicine in ${state}`);
        }
        const requiredSpecializations = telemedicineRules.requiredSpecializations || [];
        if (requiredSpecializations.length > 0 &&
            !requiredSpecializations.includes(user.specialization)) {
            throw new common_1.BadRequestException(`Required specialization for telemedicine in ${state}: ${requiredSpecializations.join(', ')}`);
        }
        return {
            allowed: true,
            rules: {
                requiredExperience,
                requiredSpecializations,
                maxPrescriptionsPerDay: telemedicineRules.maxPrescriptionsPerDay,
                allowedDrugCategories: telemedicineRules.allowedDrugCategories,
            },
        };
    }
    async getPrescriptionLimits(state, userId) {
        this.logger.log(`Getting prescription limits for state: ${state}`);
        const stateRestrictions = await this.prisma.statePrescriptionRestriction.findUnique({
            where: { state },
        });
        const telemedicineRules = await this.prisma.telemedicineRegulation.findUnique({
            where: { state },
        });
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const todaysPrescriptions = await this.prisma.prescription.count({
            where: {
                doctorId: userId,
                createdAt: {
                    gte: today,
                    lt: tomorrow,
                },
            },
        });
        return {
            state,
            dailyLimit: telemedicineRules?.maxPrescriptionsPerDay || 50,
            todaysCount: todaysPrescriptions,
            remaining: (telemedicineRules?.maxPrescriptionsPerDay || 50) - todaysPrescriptions,
            restrictions: stateRestrictions ? {
                restrictedDrugs: stateRestrictions.restrictedDrugs,
                requiredLicenses: stateRestrictions.requiredLicenses,
            } : null,
        };
    }
};
exports.StateRestrictionService = StateRestrictionService;
exports.StateRestrictionService = StateRestrictionService = StateRestrictionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], StateRestrictionService);
//# sourceMappingURL=state-restriction.service.js.map