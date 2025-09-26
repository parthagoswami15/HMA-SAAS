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
exports.ChambersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ChambersService = class ChambersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createChamber(tenantId, doctorId, data) {
        return this.prisma.chamber.create({
            data: {
                tenantId,
                doctorId,
                name: data.name,
                address: data.address,
                phone: data.phone,
                email: data.email,
                consultationFee: data.consultationFee,
                currency: data.currency || 'USD',
                workingHours: data.workingHours,
                isActive: true,
            },
        });
    }
    async getChambers(tenantId, doctorId) {
        const where = { tenantId };
        if (doctorId) {
            where.doctorId = doctorId;
        }
        return this.prisma.chamber.findMany({
            where,
            include: {
                appointments: {
                    where: {
                        startsAt: {
                            gte: new Date(),
                        },
                    },
                    orderBy: { startsAt: 'asc' },
                    take: 5,
                },
            },
        });
    }
    async getChamberById(tenantId, id) {
        const chamber = await this.prisma.chamber.findFirst({
            where: { id, tenantId },
            include: {
                appointments: {
                    orderBy: { startsAt: 'desc' },
                    take: 10,
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
                },
            },
        });
        if (!chamber) {
            throw new common_1.NotFoundException('Chamber not found');
        }
        return chamber;
    }
    async updateChamber(tenantId, id, data) {
        const chamber = await this.prisma.chamber.findFirst({
            where: { id, tenantId },
        });
        if (!chamber) {
            throw new common_1.NotFoundException('Chamber not found');
        }
        return this.prisma.chamber.update({
            where: { id },
            data,
        });
    }
    async deleteChamber(tenantId, id) {
        const chamber = await this.prisma.chamber.findFirst({
            where: { id, tenantId },
        });
        if (!chamber) {
            throw new common_1.NotFoundException('Chamber not found');
        }
        return this.prisma.chamber.delete({
            where: { id },
        });
    }
    async bookAppointment(tenantId, chamberId, appointmentData) {
        const chamber = await this.prisma.chamber.findFirst({
            where: { id: chamberId, tenantId },
        });
        if (!chamber) {
            throw new common_1.NotFoundException('Chamber not found');
        }
        return this.prisma.appointment.create({
            data: {
                tenantId,
                patientId: appointmentData.patientId,
                doctorId: chamber.doctorId,
                chamberId,
                startsAt: appointmentData.startsAt,
                endsAt: appointmentData.endsAt,
                notes: appointmentData.notes,
                status: 'scheduled',
            },
        });
    }
};
exports.ChambersService = ChambersService;
exports.ChambersService = ChambersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChambersService);
//# sourceMappingURL=chambers.service.js.map