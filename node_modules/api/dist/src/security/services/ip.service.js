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
var IpService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("./audit.service");
let IpService = IpService_1 = class IpService {
    prisma;
    auditService;
    logger = new common_1.Logger(IpService_1.name);
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async getIpAllowlist(tenantId) {
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
    async addIpToAllowlist(ipDto, user) {
        this.logger.log(`Adding IP to allowlist for tenant: ${user.tenantId}`);
        const { ipAddress, description } = ipDto;
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
        await this.auditService.logActivity({
            action: 'IP_ADDED_TO_ALLOWLIST',
            entityType: 'IP_ALLOWLIST',
            entityId: ipEntry.id,
            userId: user.id,
            details: { ipAddress },
        });
        return ipEntry;
    }
    async removeIpFromAllowlist(ipId, user) {
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
        await this.auditService.logActivity({
            action: 'IP_REMOVED_FROM_ALLOWLIST',
            entityType: 'IP_ALLOWLIST',
            entityId: ipId,
            userId: user.id,
            details: { ipAddress: ipEntry.ipAddress },
        });
        return { success: true };
    }
    async isIpAllowed(ipAddress, tenantId) {
        const ipEntry = await this.prisma.ipAllowlist.findFirst({
            where: {
                tenantId,
                ipAddress,
                isActive: true,
            },
        });
        return !!ipEntry;
    }
    async getIpStats(tenantId) {
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
    isValidIpAddress(ipAddress) {
        const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
        const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
        return ipv4Regex.test(ipAddress) || ipv6Regex.test(ipAddress);
    }
};
exports.IpService = IpService;
exports.IpService = IpService = IpService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], IpService);
//# sourceMappingURL=ip.service.js.map