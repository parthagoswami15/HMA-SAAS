import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ComplianceGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check if user has compliance role
    const hasComplianceRole = user.roles?.some(role =>
      ['COMPLIANCE_OFFICER', 'ADMIN', 'SUPER_ADMIN'].includes(role)
    );

    if (hasComplianceRole) {
      return true;
    }

    // Check if user has compliance permissions
    const userPermissions = await this.prisma.userPermission.findMany({
      where: { userId: user.id },
      select: { permission: true },
    });

    const hasCompliancePermission = userPermissions.some(p =>
      p.permission.includes('COMPLIANCE') || p.permission.includes('AUDIT')
    );

    if (hasCompliancePermission) {
      return true;
    }

    throw new ForbiddenException('Insufficient permissions for compliance operations');
  }
}

@Injectable()
export class PcpndtGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check for PC-PNDT certification
    const certification = await this.prisma.userCertification.findFirst({
      where: {
        userId: user.id,
        certificationType: 'PCPNDT',
        status: 'ACTIVE',
        validTill: { gte: new Date() },
      },
    });

    if (!certification) {
      throw new ForbiddenException('PC-PNDT certification required');
    }

    // Check if user has radiology permissions
    const hasRadiologyPermission = user.roles?.includes('RADIOLOGIST') ||
      user.permissions?.some(permission =>
        permission.includes('RADIOLOGY') || permission.includes('PCPNDT')
      );

    if (!hasRadiologyPermission) {
      throw new ForbiddenException('Radiology permissions required for PC-PNDT operations');
    }

    return true;
  }
}

@Injectable()
export class PrescriptionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check if user has prescription permissions
    const hasPrescriptionRole = user.roles?.some(role =>
      ['DOCTOR', 'PHARMACIST', 'ADMIN', 'SUPER_ADMIN'].includes(role)
    );

    if (hasPrescriptionRole) {
      return true;
    }

    // Check for prescription permissions
    const userPermissions = await this.prisma.userPermission.findMany({
      where: { userId: user.id },
      select: { permission: true },
    });

    const hasPrescriptionPermission = userPermissions.some(p =>
      p.permission.includes('PRESCRIPTION') || p.permission.includes('PHARMACY')
    );

    if (hasPrescriptionPermission) {
      return true;
    }

    // Check for Schedule drug license if dealing with controlled substances
    const requestBody = request.body;
    const hasScheduledDrugs = requestBody?.medications?.some(
      medication => medication.isScheduledDrug
    );

    if (hasScheduledDrugs) {
      const scheduleLicense = await this.prisma.userCertification.findFirst({
        where: {
          userId: user.id,
          certificationType: 'SCHEDULE_DRUG_LICENSE',
          status: 'ACTIVE',
          validTill: { gte: new Date() },
        },
      });

      if (!scheduleLicense) {
        throw new ForbiddenException('Schedule drug license required for controlled substances');
      }
    }

    throw new ForbiddenException('Insufficient permissions for prescription operations');
  }
}
