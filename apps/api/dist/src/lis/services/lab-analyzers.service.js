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
exports.LabAnalyzersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let LabAnalyzersService = class LabAnalyzersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createAnalyzer(createAnalyzerDto) {
        try {
            const analyzer = await this.prisma.labAnalyzer.create({
                data: {
                    ...createAnalyzerDto,
                    status: createAnalyzerDto.status || 'OFFLINE',
                    isActive: createAnalyzerDto.isActive ?? true,
                },
            });
            return this.mapToResponseDto(analyzer);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to create analyzer');
        }
    }
    async getAllAnalyzers(filters) {
        const analyzers = await this.prisma.labAnalyzer.findMany({
            where: {
                ...(filters?.type && { type: filters.type }),
                ...(filters?.status && { status: filters.status }),
                ...(filters?.isActive !== undefined && { isActive: filters.isActive }),
                ...(filters?.location && { location: { contains: filters.location, mode: 'insensitive' } }),
            },
            include: {
                qcRuns: {
                    take: 5,
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });
        return analyzers.map(analyzer => this.mapToResponseDto(analyzer));
    }
    async getAnalyzerById(id) {
        const analyzer = await this.prisma.labAnalyzer.findUnique({
            where: { id },
            include: {
                qcRuns: {
                    take: 10,
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });
        if (!analyzer) {
            throw new common_1.NotFoundException('Analyzer not found');
        }
        return this.mapToResponseDto(analyzer);
    }
    async updateAnalyzer(id, updateAnalyzerDto) {
        try {
            const analyzer = await this.prisma.labAnalyzer.update({
                where: { id },
                data: updateAnalyzerDto,
            });
            return this.mapToResponseDto(analyzer);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to update analyzer');
        }
    }
    async deleteAnalyzer(id) {
        try {
            await this.prisma.labAnalyzer.delete({
                where: { id },
            });
            return { message: 'Analyzer deleted successfully' };
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to delete analyzer');
        }
    }
    async updateAnalyzerStatus(id, status) {
        const analyzer = await this.prisma.labAnalyzer.update({
            where: { id },
            data: {
                status,
                lastCommunication: new Date(),
            },
        });
        return this.mapToResponseDto(analyzer);
    }
    async updateAnalyzerCommunication(id) {
        const analyzer = await this.prisma.labAnalyzer.update({
            where: { id },
            data: {
                lastCommunication: new Date(),
            },
        });
        return this.mapToResponseDto(analyzer);
    }
    async getAnalyzersByType(type) {
        const analyzers = await this.prisma.labAnalyzer.findMany({
            where: { type },
            include: {
                qcRuns: {
                    take: 5,
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });
        return analyzers.map(analyzer => this.mapToResponseDto(analyzer));
    }
    async getActiveAnalyzers() {
        const analyzers = await this.prisma.labAnalyzer.findMany({
            where: { isActive: true },
            include: {
                qcRuns: {
                    take: 5,
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });
        return analyzers.map(analyzer => this.mapToResponseDto(analyzer));
    }
    async getOnlineAnalyzers() {
        const analyzers = await this.prisma.labAnalyzer.findMany({
            where: { status: 'ONLINE' },
            include: {
                qcRuns: {
                    take: 5,
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });
        return analyzers.map(analyzer => this.mapToResponseDto(analyzer));
    }
    mapToResponseDto(analyzer) {
        return {
            id: analyzer.id,
            name: analyzer.name,
            model: analyzer.model,
            type: analyzer.type,
            serialNumber: analyzer.serialNumber,
            ipAddress: analyzer.ipAddress,
            port: analyzer.port,
            location: analyzer.location,
            direction: analyzer.direction,
            status: analyzer.status,
            isActive: analyzer.isActive,
            configuration: analyzer.configuration,
            supportedTests: analyzer.supportedTests,
            lastCommunication: analyzer.lastCommunication,
            createdAt: analyzer.createdAt,
            updatedAt: analyzer.updatedAt,
        };
    }
};
exports.LabAnalyzersService = LabAnalyzersService;
exports.LabAnalyzersService = LabAnalyzersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LabAnalyzersService);
//# sourceMappingURL=lab-analyzers.service.js.map