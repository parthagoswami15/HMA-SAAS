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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionGuard = exports.PcpndtGuard = exports.ComplianceGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const prisma_service_1 = require("../../prisma/prisma.service");
let ComplianceGuard = class ComplianceGuard {
    reflector;
    prisma;
    constructor(reflector, prisma) {
        this.reflector = reflector;
        this.prisma = prisma;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.ForbiddenException('User not authenticated');
        }
        const hasComplianceRole = user.roles?.some(role => ['COMPLIANCE_OFFICER', 'ADMIN', 'SUPER_ADMIN'].includes(role));
        if (hasComplianceRole) {
            return true;
        }
        const userPermissions = await this.prisma.userPermission.findMany({
            where: { userId: user.id },
            select: { permission: true },
        });
        const hasCompliancePermission = userPermissions.some(p => p.permission.includes('COMPLIANCE') || p.permission.includes('AUDIT'));
        if (hasCompliancePermission) {
            return true;
        }
        throw new common_1.ForbiddenException('Insufficient permissions for compliance operations');
    }
};
exports.ComplianceGuard = ComplianceGuard;
exports.ComplianceGuard = ComplianceGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        prisma_service_1.PrismaService])
], ComplianceGuard);
let PcpndtGuard = class PcpndtGuard {
    reflector;
    prisma;
    constructor(reflector, prisma) {
        this.reflector = reflector;
        this.prisma = prisma;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.ForbiddenException('User not authenticated');
        }
        const certification = await this.prisma.userCertification.findFirst({
            where: {
                userId: user.id,
                certificationType: 'PCPNDT',
                status: 'ACTIVE',
                validTill: { gte: new Date() },
            },
        });
        if (!certification) {
            throw new common_1.ForbiddenException('PC-PNDT certification required');
        }
        const hasRadiologyPermission = user.roles?.includes('RADIOLOGIST') ||
            user.permissions?.some(permission => permission.includes('RADIOLOGY') || permission.includes('PCPNDT'));
        if (!hasRadiologyPermission) {
            throw new common_1.ForbiddenException('Radiology permissions required for PC-PNDT operations');
        }
        return true;
    }
};
exports.PcpndtGuard = PcpndtGuard;
exports.PcpndtGuard = PcpndtGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        prisma_service_1.PrismaService])
], PcpndtGuard);
let PrescriptionGuard = class PrescriptionGuard {
    reflector;
    prisma;
    constructor(reflector, prisma) {
        this.reflector = reflector;
        this.prisma = prisma;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.ForbiddenException('User not authenticated');
        }
        const hasPrescriptionRole = user.roles?.some(role => ['DOCTOR', 'PHARMACIST', 'ADMIN', 'SUPER_ADMIN'].includes(role));
        if (hasPrescriptionRole) {
            return true;
        }
        const userPermissions = await this.prisma.userPermission.findMany({
            where: { userId: user.id },
            select: { permission: true },
        });
        const hasPrescriptionPermission = userPermissions.some(p => p.permission.includes('PRESCRIPTION') || p.permission.includes('PHARMACY'));
        if (hasPrescriptionPermission) {
            return true;
        }
        const requestBody = request.body;
        const hasScheduledDrugs = requestBody?.medications?.some(medication => medication.isScheduledDrug);
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
                throw new common_1.ForbiddenException('Schedule drug license required for controlled substances');
            }
        }
        throw new common_1.ForbiddenException('Insufficient permissions for prescription operations');
    }
};
exports.PrescriptionGuard = PrescriptionGuard;
exports.PrescriptionGuard = PrescriptionGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        prisma_service_1.PrismaService])
], PrescriptionGuard);
//# sourceMappingURL=compliance.guard.js.map