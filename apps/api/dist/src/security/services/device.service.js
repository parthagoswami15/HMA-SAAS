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
var DeviceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("./audit.service");
let DeviceService = DeviceService_1 = class DeviceService {
    prisma;
    auditService;
    logger = new common_1.Logger(DeviceService_1.name);
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async getUserDevices(user) {
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
    async trustDevice(trustDto, user) {
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
        await this.auditService.logActivity({
            action: 'DEVICE_TRUSTED',
            entityType: 'TRUSTED_DEVICE',
            entityId: trustedDevice.id,
            userId: user.id,
        });
        return trustedDevice;
    }
    async revokeDevice(deviceId, user) {
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
        await this.auditService.logActivity({
            action: 'DEVICE_REVOKED',
            entityType: 'TRUSTED_DEVICE',
            entityId: device.id,
            userId: user.id,
        });
        return { success: true };
    }
    async updateDeviceActivity(userId, deviceId) {
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
    async isDeviceTrusted(userId, deviceId) {
        const device = await this.prisma.trustedDevice.findFirst({
            where: {
                deviceId,
                userId,
                isActive: true,
            },
        });
        return !!device;
    }
    async getDeviceStats(user) {
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
};
exports.DeviceService = DeviceService;
exports.DeviceService = DeviceService = DeviceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], DeviceService);
//# sourceMappingURL=device.service.js.map