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
var PrescriptionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("./audit.service");
let PrescriptionService = PrescriptionService_1 = class PrescriptionService {
    prisma;
    auditService;
    logger = new common_1.Logger(PrescriptionService_1.name);
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async createPrescription(createDto, user) {
        this.logger.log(`Creating prescription for patient ${createDto.patientId}`);
        for (const medication of createDto.medications) {
            if (medication.isScheduledDrug) {
                await this.validateScheduleDrugPrescription(medication, user.id);
            }
        }
        const prescription = await this.prisma.prescription.create({
            data: {
                patientId: createDto.patientId,
                doctorId: createDto.doctorId,
                medications: JSON.stringify(createDto.medications),
                diagnosis: createDto.diagnosis,
                isEmergency: createDto.isEmergency || false,
                validTill: createDto.validTill ? new Date(createDto.validTill) : null,
                status: 'ACTIVE',
                createdBy: user.id,
                updatedBy: user.id,
            },
        });
        for (const medication of createDto.medications) {
            await this.prisma.prescriptionMedication.create({
                data: {
                    prescriptionId: prescription.id,
                    drugName: medication.drugName,
                    genericName: medication.genericName,
                    strength: medication.strength,
                    dosage: medication.dosage,
                    frequency: medication.frequency,
                    duration: medication.duration,
                    quantity: medication.quantity,
                    instructions: medication.instructions,
                    isScheduledDrug: medication.isScheduledDrug,
                    scheduleCategory: medication.scheduleCategory,
                },
            });
        }
        await this.auditService.logActivity({
            action: 'PRESCRIPTION_CREATED',
            entityType: 'PRESCRIPTION',
            entityId: prescription.id,
            userId: user.id,
            details: {
                patientId: createDto.patientId,
                medicationCount: createDto.medications.length,
                hasScheduledDrugs: createDto.medications.some(m => m.isScheduledDrug),
            },
        });
        return {
            id: prescription.id,
            status: prescription.status,
            validTill: prescription.validTill,
            createdAt: prescription.createdAt,
        };
    }
    async updatePrescription(id, updateDto, user) {
        this.logger.log(`Updating prescription ${id}`);
        const existingPrescription = await this.prisma.prescription.findUnique({
            where: { id },
        });
        if (!existingPrescription) {
            throw new common_1.NotFoundException('Prescription not found');
        }
        if (existingPrescription.status === 'CANCELLED') {
            throw new common_1.BadRequestException('Cannot update cancelled prescription');
        }
        const oldValues = { ...existingPrescription };
        if (updateDto.medications) {
            for (const medication of updateDto.medications) {
                if (medication.isScheduledDrug) {
                    await this.validateScheduleDrugPrescription(medication, user.id);
                }
            }
        }
        const updatedPrescription = await this.prisma.prescription.update({
            where: { id },
            data: {
                ...updateDto,
                medications: updateDto.medications ? JSON.stringify(updateDto.medications) : existingPrescription.medications,
                diagnosis: updateDto.diagnosis ?? existingPrescription.diagnosis,
                isEmergency: updateDto.isEmergency ?? existingPrescription.isEmergency,
                validTill: updateDto.validTill ? new Date(updateDto.validTill) : existingPrescription.validTill,
                updatedBy: user.id,
                updatedAt: new Date(),
            },
        });
        if (updateDto.medications) {
            await this.prisma.prescriptionMedication.deleteMany({
                where: { prescriptionId: id },
            });
            for (const medication of updateDto.medications) {
                await this.prisma.prescriptionMedication.create({
                    data: {
                        prescriptionId: id,
                        drugName: medication.drugName,
                        genericName: medication.genericName,
                        strength: medication.strength,
                        dosage: medication.dosage,
                        frequency: medication.frequency,
                        duration: medication.duration,
                        quantity: medication.quantity,
                        instructions: medication.instructions,
                        isScheduledDrug: medication.isScheduledDrug,
                        scheduleCategory: medication.scheduleCategory,
                    },
                });
            }
        }
        await this.auditService.logActivity({
            action: 'PRESCRIPTION_UPDATED',
            entityType: 'PRESCRIPTION',
            entityId: id,
            userId: user.id,
            oldValues,
            newValues: updatedPrescription,
        });
        return {
            id: updatedPrescription.id,
            status: updatedPrescription.status,
            validTill: updatedPrescription.validTill,
            updatedAt: updatedPrescription.updatedAt,
        };
    }
    async recordNarcoticsDispense(registerDto, user) {
        this.logger.log(`Recording narcotics dispense for prescription ${registerDto.prescriptionId}`);
        const prescription = await this.prisma.prescription.findUnique({
            where: { id: registerDto.prescriptionId },
            include: { medications: true },
        });
        if (!prescription) {
            throw new common_1.NotFoundException('Prescription not found');
        }
        const narcoticsMedication = prescription.medications.find(m => m.drugName.toLowerCase().includes('narcotic') || m.isScheduledDrug);
        if (!narcoticsMedication) {
            throw new common_1.BadRequestException('Prescription does not contain narcotics');
        }
        const registerEntry = await this.prisma.narcoticsRegister.create({
            data: {
                prescriptionId: registerDto.prescriptionId,
                drugName: registerDto.drugName,
                batchNumber: registerDto.batchNumber,
                dispensedBy: registerDto.dispensedBy,
                witnessName: registerDto.witnessName,
                witnessSignature: registerDto.witnessSignature,
                patientSignature: registerDto.patientSignature,
                remarks: registerDto.remarks,
                dispensedAt: new Date(),
            },
        });
        await this.auditService.logActivity({
            action: 'NARCOTICS_DISPENSED',
            entityType: 'NARCOTICS_REGISTER',
            entityId: registerEntry.id,
            userId: user.id,
            details: {
                prescriptionId: registerDto.prescriptionId,
                drugName: registerDto.drugName,
                dispensedBy: registerDto.dispensedBy,
            },
        });
        return {
            id: registerEntry.id,
            dispensedAt: registerEntry.dispensedAt,
        };
    }
    async getComplianceStatus() {
        const totalPrescriptions = await this.prisma.prescription.count();
        const prescriptionsWithScheduledDrugs = await this.prisma.prescriptionMedication.count({
            where: { isScheduledDrug: true },
        });
        const narcoticsDispenses = await this.prisma.narcoticsRegister.count();
        const expiredPrescriptions = await this.prisma.prescription.count({
            where: {
                validTill: { lt: new Date() },
                status: 'ACTIVE',
            },
        });
        return {
            totalRecords: totalPrescriptions,
            compliantRecords: totalPrescriptions - expiredPrescriptions,
            nonCompliantRecords: expiredPrescriptions,
            compliancePercentage: totalPrescriptions > 0 ? ((totalPrescriptions - expiredPrescriptions) / totalPrescriptions) * 100 : 100,
            lastUpdated: new Date(),
            details: {
                totalPrescriptions,
                prescriptionsWithScheduledDrugs,
                narcoticsDispenses,
                expiredPrescriptions,
            },
        };
    }
    async validateCompliance(entityId) {
        const prescription = await this.prisma.prescription.findUnique({
            where: { id: entityId },
            include: { medications: true },
        });
        if (!prescription) {
            return {
                isCompliant: false,
                issues: ['Prescription not found'],
            };
        }
        const issues = [];
        if (prescription.status === 'CANCELLED') {
            issues.push('Prescription is cancelled');
        }
        if (prescription.validTill && prescription.validTill < new Date()) {
            issues.push('Prescription has expired');
        }
        const scheduledDrugs = prescription.medications.filter(m => m.isScheduledDrug);
        if (scheduledDrugs.length > 0 && !prescription.isEmergency) {
        }
        return {
            isCompliant: issues.length === 0,
            issues,
        };
    }
    async validateScheduleDrugPrescription(medication, doctorId) {
        const doctor = await this.prisma.user.findUnique({
            where: { id: doctorId },
            select: {
                qualifications: true,
                specializations: true,
                scheduleDrugLicense: true,
            },
        });
        if (!doctor?.scheduleDrugLicense) {
            throw new common_1.BadRequestException(`Schedule ${medication.scheduleCategory} drugs require special license`);
        }
        if (medication.scheduleCategory === 'H' || medication.scheduleCategory === 'X') {
            const existingPrescriptions = await this.prisma.prescriptionMedication.count({
                where: {
                    drugName: medication.drugName,
                    isScheduledDrug: true,
                    createdAt: {
                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    },
                },
            });
            if (existingPrescriptions >= 3) {
                throw new common_1.BadRequestException('Monthly limit exceeded for this narcotic drug');
            }
        }
    }
    async getPrescriptionHistory(patientId, user) {
        this.logger.log(`Retrieving prescription history for patient ${patientId}`);
        const prescriptions = await this.prisma.prescription.findMany({
            where: { patientId },
            include: {
                medications: true,
                doctor: {
                    select: { id: true, name: true, specialization: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        await this.auditService.logActivity({
            action: 'PRESCRIPTION_HISTORY_ACCESSED',
            entityType: 'PATIENT',
            entityId: patientId,
            userId: user.id,
        });
        return prescriptions;
    }
    async getNarcoticsRegister(query, user) {
        const { fromDate, toDate, drugName, dispensedBy, page = '1', limit = '50' } = query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        const where = {};
        if (drugName)
            where.drugName = { contains: drugName, mode: 'insensitive' };
        if (dispensedBy)
            where.dispensedBy = dispensedBy;
        if (fromDate || toDate) {
            where.dispensedAt = {};
            if (fromDate)
                where.dispensedAt.gte = new Date(fromDate);
            if (toDate)
                where.dispensedAt.lte = new Date(toDate);
        }
        const [registers, total] = await Promise.all([
            this.prisma.narcoticsRegister.findMany({
                where,
                orderBy: { dispensedAt: 'desc' },
                skip,
                take: limitNum,
            }),
            this.prisma.narcoticsRegister.count({ where }),
        ]);
        await this.auditService.logActivity({
            action: 'NARCOTICS_REGISTER_ACCESSED',
            entityType: 'NARCOTICS_REGISTER',
            userId: user.id,
            details: { filters: query, count: total },
        });
        return {
            registers,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        };
    }
    async cancelPrescription(id, reason, user) {
        this.logger.log(`Cancelling prescription ${id}`);
        const prescription = await this.prisma.prescription.findUnique({
            where: { id },
        });
        if (!prescription) {
            throw new common_1.NotFoundException('Prescription not found');
        }
        if (prescription.status === 'CANCELLED') {
            throw new common_1.BadRequestException('Prescription already cancelled');
        }
        const updatedPrescription = await this.prisma.prescription.update({
            where: { id },
            data: {
                status: 'CANCELLED',
                cancellationReason: reason,
                cancelledAt: new Date(),
                updatedBy: user.id,
                updatedAt: new Date(),
            },
        });
        await this.auditService.logActivity({
            action: 'PRESCRIPTION_CANCELLED',
            entityType: 'PRESCRIPTION',
            entityId: id,
            userId: user.id,
            details: { reason },
        });
        return updatedPrescription;
    }
};
exports.PrescriptionService = PrescriptionService;
exports.PrescriptionService = PrescriptionService = PrescriptionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], PrescriptionService);
//# sourceMappingURL=prescription.service.js.map