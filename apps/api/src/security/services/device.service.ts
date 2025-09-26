import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from './audit.service';
import * as crypto from 'crypto';

@Injectable()
export class DeviceService {
  private readonly logger = new Logger(DeviceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async getUserDevices(user: any) {
    const devices = await this.prisma.trustedDevice.findMany({
      where: { userId: user.id },
      orderBy: { lastUsedAt: 'desc' },
    });

    return devices.map(device => ({
      id: device.id,
      deviceId: device.deviceId,
      deviceName: device.deviceName,
      deviceType: device.deviceType,
      browserInfo: JSON.parse(device.browserInfo || '{}'),
      osInfo: JSON.parse(device.osInfo || '{}'),
      lastUsedAt: device.lastUsedAt,
      isActive: device.isActive,
    }));
  }

  async trustDevice(trustDto: any, user: any) {
    this.logger.log(`Trusting device for user: ${user.id}`);

    const { deviceId, deviceName, deviceType, browserInfo, osInfo } = trustDto;

    const trustedDevice = await this.prisma.trustedDevice.upsert({
      where: { deviceId_userId: { deviceId, userId: user.id } },
      update: {
        deviceName,
        deviceType,
        browserInfo: JSON.stringify(browserInfo),
        osInfo: JSON.stringify(osInfo),
        lastUsedAt: new Date(),
        isActive: true,
      },
      create: {
        userId: user.id,
        deviceId,
        deviceName,
        deviceType,
        browserInfo: JSON.stringify(browserInfo),
        osInfo: JSON.stringify(osInfo),
        lastUsedAt: new Date(),
        isActive: true,
      },
    });

    // Log device trust
    await this.auditService.logActivity({
      action: 'DEVICE_TRUSTED',
      entityType: 'TRUSTED_DEVICE',
      entityId: trustedDevice.id,
      userId: user.id,
    });

    return trustedDevice;
  }

  async revokeDevice(deviceId: string, user: any) {
    this.logger.log(`Revoking device for user: ${user.id}`);

    const device = await this.prisma.trustedDevice.findFirst({
      where: {
        deviceId,
        userId: user.id,
      },
    });

    if (!device) {
      throw new Error('Device not found');
    }

    await this.prisma.trustedDevice.update({
      where: { id: device.id },
      data: {
        isActive: false,
        revokedAt: new Date(),
      },
    });

    // Log device revocation
    await this.auditService.logActivity({
      action: 'DEVICE_REVOKED',
      entityType: 'TRUSTED_DEVICE',
      entityId: device.id,
      userId: user.id,
    });

    return { success: true };
  }

  async updateDeviceActivity(userId: string, deviceId: string) {
    await this.prisma.trustedDevice.updateMany({
      where: {
        deviceId,
        userId,
      },
      data: {
        lastUsedAt: new Date(),
      },
    });
  }

  async isDeviceTrusted(userId: string, deviceId: string): Promise<boolean> {
    const device = await this.prisma.trustedDevice.findFirst({
      where: {
        deviceId,
        userId,
        isActive: true,
      },
    });

    return !!device;
  }

  async getDeviceStats(user: any) {
    const totalDevices = await this.prisma.trustedDevice.count({
      where: { userId: user.id },
    });

    const activeDevices = await this.prisma.trustedDevice.count({
      where: {
        userId: user.id,
        isActive: true,
      },
    });

    const devicesByType = await this.prisma.trustedDevice.groupBy({
      by: ['deviceType'],
      where: { userId: user.id },
      _count: { deviceType: true },
    });

    return {
      userId: user.id,
      totalDevices,
      activeDevices,
      inactiveDevices: totalDevices - activeDevices,
      devicesByType,
    };
  }
}
