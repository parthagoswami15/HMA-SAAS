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
var BirthDeathService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BirthDeathService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("./audit.service");
let BirthDeathService = BirthDeathService_1 = class BirthDeathService {
    prisma;
    auditService;
    logger = new common_1.Logger(BirthDeathService_1.name);
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async createBirthRegistration(createDto, user) {
        this.logger.log(`Creating birth registration for patient ${createDto.patientId}`);
        const hospital = await this.prisma.hospital.findUnique({
            where: { id: createDto.hospitalId },
            select: { birthRegistrationEnabled: true },
        });
        if (!hospital?.birthRegistrationEnabled) {
            throw new common_1.BadRequestException('Birth registration not enabled for this hospital');
        }
        const registrationNumber = createDto.registrationNumber ||
            await this.generateRegistrationNumber('BIRTH', createDto.hospitalId);
        const birthRegistration = await this.prisma.birthRegistration.create({
            data: {
                patientId: createDto.patientId,
                hospitalId: createDto.hospitalId,
                registrationNumber,
                birthDetails: JSON.stringify(createDto.birthDetails),
                parentDetails: JSON.stringify(createDto.parentDetails),
                witnesses: createDto.witnesses ? JSON.stringify(createDto.witnesses) : null,
                status: 'PENDING',
                createdBy: user.id,
                updatedBy: user.id,
            },
        });
        await this.auditService.logActivity({
            action: 'BIRTH_REGISTRATION_CREATED',
            entityType: 'BIRTH_REGISTRATION',
            entityId: birthRegistration.id,
            userId: user.id,
            details: { patientId: createDto.patientId, registrationNumber },
        });
        return {
            id: birthRegistration.id,
            registrationNumber: birthRegistration.registrationNumber,
            status: birthRegistration.status,
            createdAt: birthRegistration.createdAt,
        };
    }
    async updateBirthRegistration(id, updateDto, user) {
        this.logger.log(`Updating birth registration ${id}`);
        const existingRegistration = await this.prisma.birthRegistration.findUnique({
            where: { id },
        });
        if (!existingRegistration) {
            throw new common_1.NotFoundException('Birth registration not found');
        }
        if (existingRegistration.status === 'APPROVED') {
            throw new common_1.BadRequestException('Cannot update approved registration');
        }
        const oldValues = { ...existingRegistration };
        const updatedRegistration = await this.prisma.birthRegistration.update({
            where: { id },
            data: {
                ...updateDto,
                birthDetails: updateDto.birthDetails ? JSON.stringify(updateDto.birthDetails) : existingRegistration.birthDetails,
                parentDetails: updateDto.parentDetails ? JSON.stringify(updateDto.parentDetails) : existingRegistration.parentDetails,
                witnesses: updateDto.witnesses ? JSON.stringify(updateDto.witnesses) : existingRegistration.witnesses,
                updatedBy: user.id,
                updatedAt: new Date(),
            },
        });
        await this.auditService.logActivity({
            action: 'BIRTH_REGISTRATION_UPDATED',
            entityType: 'BIRTH_REGISTRATION',
            entityId: id,
            userId: user.id,
            oldValues,
            newValues: updatedRegistration,
        });
        return {
            id: updatedRegistration.id,
            registrationNumber: updatedRegistration.registrationNumber,
            status: updatedRegistration.status,
            updatedAt: updatedRegistration.updatedAt,
        };
    }
    async approveBirthRegistration(id, approvalDto, user) {
        this.logger.log(`Approving birth registration ${id}`);
        const existingRegistration = await this.prisma.birthRegistration.findUnique({
            where: { id },
        });
        if (!existingRegistration) {
            throw new common_1.NotFoundException('Birth registration not found');
        }
        const oldValues = { ...existingRegistration };
        const updatedRegistration = await this.prisma.birthRegistration.update({
            where: { id },
            data: {
                status: approvalDto.status,
                approvalComments: approvalDto.approvalComments,
                approvedBy: user.id,
                approvedAt: new Date(),
                updatedBy: user.id,
                updatedAt: new Date(),
            },
        });
        if (approvalDto.status === 'APPROVED') {
            await this.createRegistryExport(updatedRegistration.id, 'BIRTH', user);
        }
        await this.auditService.logActivity({
            action: 'BIRTH_REGISTRATION_APPROVED',
            entityType: 'BIRTH_REGISTRATION',
            entityId: id,
            userId: user.id,
            oldValues,
            newValues: updatedRegistration,
            details: { approvalStatus: approvalDto.status, comments: approvalDto.approvalComments },
        });
        return {
            id: updatedRegistration.id,
            registrationNumber: updatedRegistration.registrationNumber,
            status: updatedRegistration.status,
            approvedAt: updatedRegistration.approvedAt,
        };
    }
    async createDeathRegistration(createDto, user) {
        this.logger.log(`Creating death registration for patient ${createDto.patientId}`);
        const hospital = await this.prisma.hospital.findUnique({
            where: { id: createDto.hospitalId },
            select: { deathRegistrationEnabled: true },
        });
        if (!hospital?.deathRegistrationEnabled) {
            throw new common_1.BadRequestException('Death registration not enabled for this hospital');
        }
        const registrationNumber = createDto.registrationNumber ||
            await this.generateRegistrationNumber('DEATH', createDto.hospitalId);
        const deathRegistration = await this.prisma.deathRegistration.create({
            data: {
                patientId: createDto.patientId,
                hospitalId: createDto.hospitalId,
                registrationNumber,
                deathDetails: JSON.stringify(createDto.deathDetails),
                deceasedDetails: JSON.stringify(createDto.deceasedDetails),
                informantDetails: JSON.stringify(createDto.informantDetails),
                witnesses: createDto.witnesses ? JSON.stringify(createDto.witnesses) : null,
                status: 'PENDING',
                createdBy: user.id,
                updatedBy: user.id,
            },
        });
        await this.auditService.logActivity({
            action: 'DEATH_REGISTRATION_CREATED',
            entityType: 'DEATH_REGISTRATION',
            entityId: deathRegistration.id,
            userId: user.id,
            details: { patientId: createDto.patientId, registrationNumber },
        });
        return {
            id: deathRegistration.id,
            registrationNumber: deathRegistration.registrationNumber,
            status: deathRegistration.status,
            createdAt: deathRegistration.createdAt,
        };
    }
    async updateDeathRegistration(id, updateDto, user) {
        this.logger.log(`Updating death registration ${id}`);
        const existingRegistration = await this.prisma.deathRegistration.findUnique({
            where: { id },
        });
        if (!existingRegistration) {
            throw new common_1.NotFoundException('Death registration not found');
        }
        if (existingRegistration.status === 'APPROVED') {
            throw new common_1.BadRequestException('Cannot update approved registration');
        }
        const oldValues = { ...existingRegistration };
        const updatedRegistration = await this.prisma.deathRegistration.update({
            where: { id },
            data: {
                ...updateDto,
                deathDetails: updateDto.deathDetails ? JSON.stringify(updateDto.deathDetails) : existingRegistration.deathDetails,
                deceasedDetails: updateDto.deceasedDetails ? JSON.stringify(updateDto.deceasedDetails) : existingRegistration.deceasedDetails,
                informantDetails: updateDto.informantDetails ? JSON.stringify(updateDto.informantDetails) : existingRegistration.informantDetails,
                witnesses: updateDto.witnesses ? JSON.stringify(updateDto.witnesses) : existingRegistration.witnesses,
                updatedBy: user.id,
                updatedAt: new Date(),
            },
        });
        await this.auditService.logActivity({
            action: 'DEATH_REGISTRATION_UPDATED',
            entityType: 'DEATH_REGISTRATION',
            entityId: id,
            userId: user.id,
            oldValues,
            newValues: updatedRegistration,
        });
        return {
            id: updatedRegistration.id,
            registrationNumber: updatedRegistration.registrationNumber,
            status: updatedRegistration.status,
            updatedAt: updatedRegistration.updatedAt,
        };
    }
    async approveDeathRegistration(id, approvalDto, user) {
        this.logger.log(`Approving death registration ${id}`);
        const existingRegistration = await this.prisma.deathRegistration.findUnique({
            where: { id },
        });
        if (!existingRegistration) {
            throw new common_1.NotFoundException('Death registration not found');
        }
        const oldValues = { ...existingRegistration };
        const updatedRegistration = await this.prisma.deathRegistration.update({
            where: { id },
            data: {
                status: approvalDto.status,
                approvalComments: approvalDto.approvalComments,
                approvedBy: user.id,
                approvedAt: new Date(),
                updatedBy: user.id,
                updatedAt: new Date(),
            },
        });
        if (approvalDto.status === 'APPROVED') {
            await this.createRegistryExport(updatedRegistration.id, 'DEATH', user);
        }
        await this.auditService.logActivity({
            action: 'DEATH_REGISTRATION_APPROVED',
            entityType: 'DEATH_REGISTRATION',
            entityId: id,
            userId: user.id,
            oldValues,
            newValues: updatedRegistration,
            details: { approvalStatus: approvalDto.status, comments: approvalDto.approvalComments },
        });
        return {
            id: updatedRegistration.id,
            registrationNumber: updatedRegistration.registrationNumber,
            status: updatedRegistration.status,
            approvedAt: updatedRegistration.approvedAt,
        };
    }
    async getComplianceStatus() {
        const [birthRegistrations, deathRegistrations] = await Promise.all([
            this.prisma.birthRegistration.count(),
            this.prisma.deathRegistration.count(),
        ]);
        const [approvedBirth, approvedDeath] = await Promise.all([
            this.prisma.birthRegistration.count({ where: { status: 'APPROVED' } }),
            this.prisma.deathRegistration.count({ where: { status: 'APPROVED' } }),
        ]);
        const total = birthRegistrations + deathRegistrations;
        const approved = approvedBirth + approvedDeath;
        return {
            totalRecords: total,
            compliantRecords: approved,
            nonCompliantRecords: total - approved,
            compliancePercentage: total > 0 ? (approved / total) * 100 : 100,
            lastUpdated: new Date(),
            details: {
                birthRegistrations: { total: birthRegistrations, approved: approvedBirth },
                deathRegistrations: { total: deathRegistrations, approved: approvedDeath },
            },
        };
    }
    async validateCompliance(entityId) {
        const [birthReg, deathReg] = await Promise.all([
            this.prisma.birthRegistration.findUnique({ where: { id: entityId } }),
            this.prisma.deathRegistration.findUnique({ where: { id: entityId } }),
        ]);
        const registration = birthReg || deathReg;
        if (!registration) {
            return {
                isCompliant: false,
                issues: ['Registration not found'],
            };
        }
        const issues = [];
        if (registration.status !== 'APPROVED') {
            issues.push('Registration not approved');
        }
        return {
            isCompliant: issues.length === 0,
            issues,
        };
    }
    async generateRegistrationNumber(type, hospitalId) {
        const prefix = type === 'BIRTH' ? 'B' : 'D';
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const hospital = await this.prisma.hospital.findUnique({
            where: { id: hospitalId },
            select: { registrationPrefix: true },
        });
        const hospitalPrefix = hospital?.registrationPrefix || hospitalId.slice(-3).toUpperCase();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const count = type === 'BIRTH'
            ? await this.prisma.birthRegistration.count({
                where: {
                    createdAt: { gte: today, lt: tomorrow },
                    hospitalId,
                },
            })
            : await this.prisma.deathRegistration.count({
                where: {
                    createdAt: { gte: today, lt: tomorrow },
                    hospitalId,
                },
            });
        const sequence = (count + 1).toString().padStart(4, '0');
        return `${prefix}${hospitalPrefix}${date}${sequence}`;
    }
    async createRegistryExport(registrationId, type, user) {
        const exportData = {
            registrationId,
            type,
            exportedAt: new Date(),
            exportedBy: user.id,
            status: 'PENDING',
        };
        this.logger.log(`Registry export created for ${type} registration ${registrationId}`);
    }
    async getBirthRegistrations(query, user) {
        const { status, hospitalId, fromDate, toDate, page = '1', limit = '20' } = query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        const where = {};
        if (status)
            where.status = status;
        if (hospitalId)
            where.hospitalId = hospitalId;
        if (fromDate || toDate) {
            where.createdAt = {};
            if (fromDate)
                where.createdAt.gte = new Date(fromDate);
            if (toDate)
                where.createdAt.lte = new Date(toDate);
        }
        const [registrations, total] = await Promise.all([
            this.prisma.birthRegistration.findMany({
                where,
                skip,
                take: limitNum,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.birthRegistration.count({ where }),
        ]);
        return {
            registrations,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        };
    }
    async getDeathRegistrations(query, user) {
        const { status, hospitalId, fromDate, toDate, page = '1', limit = '20' } = query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        const where = {};
        if (status)
            where.status = status;
        if (hospitalId)
            where.hospitalId = hospitalId;
        if (fromDate || toDate) {
            where.createdAt = {};
            if (fromDate)
                where.createdAt.gte = new Date(fromDate);
            if (toDate)
                where.createdAt.lte = new Date(toDate);
        }
        const [registrations, total] = await Promise.all([
            this.prisma.deathRegistration.findMany({
                where,
                skip,
                take: limitNum,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.deathRegistration.count({ where }),
        ]);
        return {
            registrations,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        };
    }
};
exports.BirthDeathService = BirthDeathService;
exports.BirthDeathService = BirthDeathService = BirthDeathService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], BirthDeathService);
//# sourceMappingURL=birth-death.service.js.map