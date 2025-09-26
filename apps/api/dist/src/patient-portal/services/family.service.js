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
var FamilyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FamilyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../../audit/audit.service");
let FamilyService = FamilyService_1 = class FamilyService {
    prisma;
    auditService;
    logger = new common_1.Logger(FamilyService_1.name);
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async getFamilyMembers(user) {
        this.logger.log(`Getting family members for user: ${user.id}`);
        const familyMembers = await this.prisma.familyMember.findMany({
            where: { primaryUserId: user.id },
            include: {
                profile: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                        dateOfBirth: true,
                        gender: true,
                        bloodGroup: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return familyMembers.map(member => ({
            id: member.id,
            relation: member.relation,
            profile: member.profile,
            isActive: member.isActive,
            addedAt: member.createdAt,
        }));
    }
    async addFamilyMember(familyDto, user) {
        this.logger.log(`Adding family member for user: ${user.id}`);
        const { relation, name, email, phone, dateOfBirth, gender, bloodGroup, aadhaarNumber, } = familyDto;
        const existingMember = await this.prisma.familyMember.findFirst({
            where: {
                primaryUserId: user.id,
                profile: {
                    OR: [
                        { email },
                        { phone },
                        ...(aadhaarNumber ? [{ aadhaarNumber }] : []),
                    ],
                },
            },
        });
        if (existingMember) {
            throw new common_1.BadRequestException('Family member already exists');
        }
        const profile = await this.prisma.patientProfile.create({
            data: {
                name,
                email,
                phone,
                dateOfBirth: new Date(dateOfBirth),
                gender,
                bloodGroup,
                aadhaarNumber,
                tenantId: user.tenantId,
                profileCompleted: true,
            },
        });
        const familyMember = await this.prisma.familyMember.create({
            data: {
                primaryUserId: user.id,
                profileId: profile.id,
                relation,
                isActive: true,
            },
            include: {
                profile: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                        dateOfBirth: true,
                        gender: true,
                        bloodGroup: true,
                    },
                },
            },
        });
        await this.auditService.logActivity({
            action: 'FAMILY_MEMBER_ADDED',
            entityType: 'FAMILY_MEMBER',
            entityId: familyMember.id,
            userId: user.id,
            details: { relation, name },
        });
        return familyMember;
    }
    async updateFamilyMember(memberId, updateDto, user) {
        this.logger.log(`Updating family member: ${memberId}`);
        const familyMember = await this.prisma.familyMember.findFirst({
            where: {
                id: memberId,
                primaryUserId: user.id,
            },
        });
        if (!familyMember) {
            throw new common_1.NotFoundException('Family member not found');
        }
        const updatedMember = await this.prisma.familyMember.update({
            where: { id: memberId },
            data: {
                relation: updateDto.relation,
                isActive: updateDto.isActive,
                updatedAt: new Date(),
            },
            include: {
                profile: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                        dateOfBirth: true,
                        gender: true,
                        bloodGroup: true,
                    },
                },
            },
        });
        await this.auditService.logActivity({
            action: 'FAMILY_MEMBER_UPDATED',
            entityType: 'FAMILY_MEMBER',
            entityId: memberId,
            userId: user.id,
            details: updateDto,
        });
        return updatedMember;
    }
    async removeFamilyMember(memberId, user) {
        this.logger.log(`Removing family member: ${memberId}`);
        const familyMember = await this.prisma.familyMember.findFirst({
            where: {
                id: memberId,
                primaryUserId: user.id,
            },
        });
        if (!familyMember) {
            throw new common_1.NotFoundException('Family member not found');
        }
        await this.prisma.familyMember.update({
            where: { id: memberId },
            data: {
                isActive: false,
                deactivatedAt: new Date(),
            },
        });
        await this.auditService.logActivity({
            action: 'FAMILY_MEMBER_REMOVED',
            entityType: 'FAMILY_MEMBER',
            entityId: memberId,
            userId: user.id,
        });
    }
    async switchToFamilyMember(memberId, user) {
        this.logger.log(`Switching to family member: ${memberId}`);
        const familyMember = await this.prisma.familyMember.findFirst({
            where: {
                id: memberId,
                primaryUserId: user.id,
                isActive: true,
            },
        });
        if (!familyMember) {
            throw new common_1.NotFoundException('Family member not found or inactive');
        }
        const sessionContext = {
            primaryUserId: user.id,
            familyMemberId: memberId,
            profileId: familyMember.profileId,
            switchedAt: new Date(),
        };
        await this.auditService.logActivity({
            action: 'FAMILY_MEMBER_SWITCHED',
            entityType: 'FAMILY_MEMBER',
            entityId: memberId,
            userId: user.id,
        });
        return {
            switchedTo: memberId,
            context: sessionContext,
        };
    }
    async getFamilyHealthSummary(user) {
        this.logger.log(`Getting family health summary for user: ${user.id}`);
        const familyMembers = await this.prisma.familyMember.findMany({
            where: {
                primaryUserId: user.id,
                isActive: true,
            },
            include: {
                profile: {
                    select: {
                        name: true,
                        dateOfBirth: true,
                        gender: true,
                        bloodGroup: true,
                    },
                },
            },
        });
        const familySummary = await Promise.all(familyMembers.map(async (member) => {
            const appointmentCount = await this.prisma.appointment.count({
                where: { patientId: member.profileId },
            });
            const reportCount = await this.prisma.medicalReport.count({
                where: { patientId: member.profileId },
            });
            const prescriptionCount = await this.prisma.prescription.count({
                where: { patientId: member.profileId },
            });
            return {
                memberId: member.id,
                relation: member.relation,
                profile: member.profile,
                stats: {
                    appointments: appointmentCount,
                    reports: reportCount,
                    prescriptions: prescriptionCount,
                },
            };
        }));
        return familySummary;
    }
    async getFamilyMemberProfile(memberId, user) {
        this.logger.log(`Getting family member profile: ${memberId}`);
        const familyMember = await this.prisma.familyMember.findFirst({
            where: {
                id: memberId,
                primaryUserId: user.id,
            },
            include: {
                profile: true,
            },
        });
        if (!familyMember) {
            throw new common_1.NotFoundException('Family member not found');
        }
        return familyMember.profile;
    }
    async getFamilyStats(user) {
        const totalMembers = await this.prisma.familyMember.count({
            where: {
                primaryUserId: user.id,
                isActive: true,
            },
        });
        const membersByRelation = await this.prisma.familyMember.groupBy({
            by: ['relation'],
            where: {
                primaryUserId: user.id,
                isActive: true,
            },
            _count: { relation: true },
        });
        const totalAppointments = await this.prisma.appointment.count({
            where: {
                OR: [
                    { patientId: user.id },
                    {
                        patientId: {
                            in: (await this.prisma.familyMember.findMany({
                                where: { primaryUserId: user.id },
                                select: { profileId: true },
                            })).map(m => m.profileId),
                        },
                    },
                ],
            },
        });
        return {
            userId: user.id,
            totalMembers,
            membersByRelation,
            totalAppointments,
        };
    }
};
exports.FamilyService = FamilyService;
exports.FamilyService = FamilyService = FamilyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], FamilyService);
//# sourceMappingURL=family.service.js.map