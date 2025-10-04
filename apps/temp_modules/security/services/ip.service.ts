import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from './audit.service';

@Injectable()
export class IpService {
  private readonly logger = new Logger(IpService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async getIpAllowlist(tenantId: string) {
    const allowlist = await this.prisma.ipAllowlist.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    return allowlist.map(ip => ({
      id: ip.id,
      ipAddress: ip.ipAddress,
      description: ip.description,
      isActive: ip.isActive,
      createdAt: ip.createdAt,
      createdBy: ip.createdBy,
    }));
  }

  async addIpToAllowlist(ipDto: any, user: any) {
    this.logger.log(`Adding IP to allowlist for tenant: ${user.tenantId}`);

    const { ipAddress, description } = ipDto;

    // Validate IP address
    if (!this.isValidIpAddress(ipAddress)) {
      throw new Error('Invalid IP address format');
    }

    const ipEntry = await this.prisma.ipAllowlist.create({
      data: {
        tenantId: user.tenantId,
        ipAddress,
        description,
        createdBy: user.id,
        isActive: true,
      },
    });

    // Log IP allowlist addition
    await this.auditService.logActivity({
      action: 'IP_ADDED_TO_ALLOWLIST',
      entityType: 'IP_ALLOWLIST',
      entityId: ipEntry.id,
      userId: user.id,
      details: { ipAddress },
    });

    return ipEntry;
  }

  async removeIpFromAllowlist(ipId: string, user: any) {
    this.logger.log(`Removing IP from allowlist for tenant: ${user.tenantId}`);

    const ipEntry = await this.prisma.ipAllowlist.findFirst({
      where: {
        id: ipId,
        tenantId: user.tenantId,
      },
    });

    if (!ipEntry) {
      throw new Error('IP entry not found');
    }

    await this.prisma.ipAllowlist.update({
      where: { id: ipId },
      data: {
        isActive: false,
        deactivatedAt: new Date(),
      },
    });

    // Log IP allowlist removal
    await this.auditService.logActivity({
      action: 'IP_REMOVED_FROM_ALLOWLIST',
      entityType: 'IP_ALLOWLIST',
      entityId: ipId,
      userId: user.id,
      details: { ipAddress: ipEntry.ipAddress },
    });

    return { success: true };
  }

  async isIpAllowed(ipAddress: string, tenantId: string): Promise<boolean> {
    const ipEntry = await this.prisma.ipAllowlist.findFirst({
      where: {
        tenantId,
        ipAddress,
        isActive: true,
      },
    });

    return !!ipEntry;
  }

  async getIpStats(tenantId: string) {
    const totalIps = await this.prisma.ipAllowlist.count({
      where: { tenantId },
    });

    const activeIps = await this.prisma.ipAllowlist.count({
      where: {
        tenantId,
        isActive: true,
      },
    });

    return {
      tenantId,
      totalIps,
      activeIps,
      inactiveIps: totalIps - activeIps,
    };
  }

  private isValidIpAddress(ipAddress: string): boolean {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

    return ipv4Regex.test(ipAddress) || ipv6Regex.test(ipAddress);
  }
}
