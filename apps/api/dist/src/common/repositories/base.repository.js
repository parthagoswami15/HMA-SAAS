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
exports.BaseRepository = void 0;
const prisma_service_1 = require("../../prisma/prisma.service");
const common_1 = require("@nestjs/common");
let BaseRepository = class BaseRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data, select) {
        return this.prismaDelegate.create({
            data,
            ...(select && { select }),
        });
    }
    async findUnique(where, select) {
        const result = await this.prismaDelegate.findUnique({
            where,
            ...(select && { select }),
        });
        if (!result) {
            throw new common_1.NotFoundException(`${this.modelName} not found`);
        }
        return result;
    }
    async findFirst(where, select) {
        return this.prismaDelegate.findFirst({
            where,
            ...(select && { select }),
        });
    }
    async findMany(where, select, skip, take, orderBy) {
        return this.prismaDelegate.findMany({
            where,
            ...(select && { select }),
            ...(skip !== undefined && { skip }),
            ...(take !== undefined && { take }),
            ...(orderBy && { orderBy }),
        });
    }
    async update(where, data, select) {
        return this.prismaDelegate.update({
            where,
            data,
            ...(select && { select }),
        });
    }
    async delete(where) {
        return this.prismaDelegate.delete({
            where,
        });
    }
    async count(where) {
        return this.prismaDelegate.count({
            where,
        });
    }
    async exists(where) {
        const count = await this.count(where);
        return count > 0;
    }
    withTransaction(prisma) {
        this.prismaDelegate = prisma[this.modelName.toLowerCase()];
        return this;
    }
};
exports.BaseRepository = BaseRepository;
exports.BaseRepository = BaseRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BaseRepository);
//# sourceMappingURL=base.repository.js.map