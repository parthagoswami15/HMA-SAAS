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
exports.IpdService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let IpdService = class IpdService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    createRoom(tenantId, data) {
        return this.prisma.room.create({ data: { tenantId, occupied: 0, capacity: data.capacity ?? 1, code: data.code, type: data.type } });
    }
    listRooms(tenantId) {
        return this.prisma.room.findMany({ where: { tenantId }, orderBy: { code: 'asc' } });
    }
    async admit(tenantId, data) {
        const room = await this.prisma.room.findFirst({ where: { id: data.roomId, tenantId } });
        if (!room)
            throw new common_1.NotFoundException('Room not found');
        if (room.occupied >= room.capacity)
            throw new Error('Room full');
        const admission = await this.prisma.admission.create({ data: { tenantId, ...data } });
        await this.prisma.room.update({ where: { id: room.id }, data: { occupied: { increment: 1 } } });
        return admission;
    }
    listAdmissions(tenantId) {
        return this.prisma.admission.findMany({ where: { tenantId }, orderBy: { admittedAt: 'desc' } });
    }
    async discharge(tenantId, id) {
        const adm = await this.prisma.admission.findFirst({ where: { id, tenantId } });
        if (!adm)
            throw new common_1.NotFoundException('Admission not found');
        const updated = await this.prisma.admission.update({ where: { id }, data: { dischargedAt: new Date() } });
        await this.prisma.room.update({ where: { id: adm.roomId }, data: { occupied: { decrement: 1 } } });
        return updated;
    }
};
exports.IpdService = IpdService;
exports.IpdService = IpdService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], IpdService);
//# sourceMappingURL=ipd.service.js.map