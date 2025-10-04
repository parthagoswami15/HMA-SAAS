import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class FamilyService {
  private readonly logger = new Logger(FamilyService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async getFamilyMembers(user: any) {
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

  async addFamilyMember(familyDto: any, user: any) {
    this.logger.log(`Adding family member for user: ${user.id}`);

    const {
      relation,
      name,
      email,
      phone,
      dateOfBirth,
      gender,
      bloodGroup,
      aadhaarNumber,
    } = familyDto;

    // Check if family member already exists
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
      throw new BadRequestException('Family member already exists');
    }

    // Create family member profile
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

    // Create family member record
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

    // Log family member addition
    await this.auditService.logActivity({
      action: 'FAMILY_MEMBER_ADDED',
      entityType: 'FAMILY_MEMBER',
      entityId: familyMember.id,
      userId: user.id,
      details: { relation, name },
    });

    return familyMember;
  }

  async updateFamilyMember(memberId: string, updateDto: any, user: any) {
    this.logger.log(`Updating family member: ${memberId}`);

    const familyMember = await this.prisma.familyMember.findFirst({
      where: {
        id: memberId,
        primaryUserId: user.id,
      },
    });

    if (!familyMember) {
      throw new NotFoundException('Family member not found');
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

    // Log family member update
    await this.auditService.logActivity({
      action: 'FAMILY_MEMBER_UPDATED',
      entityType: 'FAMILY_MEMBER',
      entityId: memberId,
      userId: user.id,
      details: updateDto,
    });

    return updatedMember;
  }

  async removeFamilyMember(memberId: string, user: any) {
    this.logger.log(`Removing family member: ${memberId}`);

    const familyMember = await this.prisma.familyMember.findFirst({
      where: {
        id: memberId,
        primaryUserId: user.id,
      },
    });

    if (!familyMember) {
      throw new NotFoundException('Family member not found');
    }

    // Soft delete by deactivating
    await this.prisma.familyMember.update({
      where: { id: memberId },
      data: {
        isActive: false,
        deactivatedAt: new Date(),
      },
    });

    // Log family member removal
    await this.auditService.logActivity({
      action: 'FAMILY_MEMBER_REMOVED',
      entityType: 'FAMILY_MEMBER',
      entityId: memberId,
      userId: user.id,
    });
  }

  async switchToFamilyMember(memberId: string, user: any) {
    this.logger.log(`Switching to family member: ${memberId}`);

    const familyMember = await this.prisma.familyMember.findFirst({
      where: {
        id: memberId,
        primaryUserId: user.id,
        isActive: true,
      },
    });

    if (!familyMember) {
      throw new NotFoundException('Family member not found or inactive');
    }

    // Create a session context for the family member
    const sessionContext = {
      primaryUserId: user.id,
      familyMemberId: memberId,
      profileId: familyMember.profileId,
      switchedAt: new Date(),
    };

    // Log family member switch
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

  async getFamilyHealthSummary(user: any) {
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

    const familySummary = await Promise.all(
      familyMembers.map(async (member) => {
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
      })
    );

    return familySummary;
  }

  async getFamilyMemberProfile(memberId: string, user: any) {
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
      throw new NotFoundException('Family member not found');
    }

    return familyMember.profile;
  }

  async getFamilyStats(user: any) {
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
              in: (
                await this.prisma.familyMember.findMany({
                  where: { primaryUserId: user.id },
                  select: { profileId: true },
                })
              ).map(m => m.profileId),
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
}
