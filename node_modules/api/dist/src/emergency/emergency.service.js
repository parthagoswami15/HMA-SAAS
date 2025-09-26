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
exports.EmergencyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EmergencyService = class EmergencyService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createEmergencyCase(tenantId, data) {
        return this.prisma.emergencyCase.create({
            data: {
                tenantId,
                patientId: data.patientId,
                triageLevel: data.triageLevel,
                chiefComplaint: data.chiefComplaint,
                vitals: data.vitals,
                assignedTo: data.assignedTo,
                notes: data.notes,
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        dob: true,
                        phone: true,
                    },
                },
            },
        });
    }
    async getEmergencyCases(tenantId, status) {
        const where = { tenantId };
        if (status) {
            where.status = status;
        }
        return this.prisma.emergencyCase.findMany({
            where,
            orderBy: [
                { triageLevel: 'asc' },
                { arrivalTime: 'asc' },
            ],
            include: {
                patient: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        dob: true,
                        phone: true,
                    },
                },
            },
        });
    }
    async getEmergencyCaseById(tenantId, id) {
        const emergencyCase = await this.prisma.emergencyCase.findFirst({
            where: { id, tenantId },
            include: {
                patient: true,
            },
        });
        if (!emergencyCase) {
            throw new common_1.NotFoundException('Emergency case not found');
        }
        return emergencyCase;
    }
    async updateEmergencyCase(tenantId, id, data) {
        const emergencyCase = await this.prisma.emergencyCase.findFirst({
            where: { id, tenantId },
        });
        if (!emergencyCase) {
            throw new common_1.NotFoundException('Emergency case not found');
        }
        return this.prisma.emergencyCase.update({
            where: { id },
            data,
            include: {
                patient: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        phone: true,
                    },
                },
            },
        });
    }
    async dischargeEmergencyCase(tenantId, id, notes) {
        return this.updateEmergencyCase(tenantId, id, {
            status: 'DISCHARGED',
            dischargeTime: new Date(),
            notes,
        });
    }
    async admitEmergencyCase(tenantId, id, roomId) {
        const updateData = {
            status: 'ADMITTED',
            dischargeTime: new Date(),
        };
        if (roomId) {
            const emergencyCase = await this.getEmergencyCaseById(tenantId, id);
            await this.prisma.admission.create({
                data: {
                    tenantId,
                    patientId: emergencyCase.patientId,
                    roomId,
                    diagnosis: emergencyCase.chiefComplaint,
                    notes: `Admitted from emergency department. Triage: ${emergencyCase.triageLevel}`,
                },
            });
        }
        return this.updateEmergencyCase(tenantId, id, updateData);
    }
    async getTriageStats(tenantId) {
        const stats = await this.prisma.emergencyCase.groupBy({
            by: ['triageLevel', 'status'],
            where: { tenantId },
            _count: true,
        });
        return stats.reduce((acc, stat) => {
            if (!acc[stat.triageLevel]) {
                acc[stat.triageLevel] = {};
            }
            acc[stat.triageLevel][stat.status] = stat._count;
            return acc;
        }, {});
    }
};
exports.EmergencyService = EmergencyService;
exports.EmergencyService = EmergencyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmergencyService);
//# sourceMappingURL=emergency.service.js.map