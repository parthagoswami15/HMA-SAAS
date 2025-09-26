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
exports.LabSamplesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const lab_order_dto_1 = require("../dto/lab-order.dto");
let LabSamplesService = class LabSamplesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createSample(createSampleDto) {
        try {
            const sample = await this.prisma.labSample.create({
                data: {
                    ...createSampleDto,
                    status: createSampleDto.status || lab_order_dto_1.SampleStatus.PENDING,
                },
                include: {
                    order: true,
                },
            });
            return this.mapToResponseDto(sample);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to create sample');
        }
    }
    async getAllSamples(filters) {
        const samples = await this.prisma.labSample.findMany({
            where: {
                ...(filters?.orderId && { orderId: filters.orderId }),
                ...(filters?.sampleType && { sampleType: filters.sampleType }),
                ...(filters?.status && { status: filters.status }),
                ...(filters?.barcode && { barcode: filters.barcode }),
                ...(filters?.dateFrom && filters?.dateTo && {
                    collectedAt: {
                        gte: filters.dateFrom,
                        lte: filters.dateTo,
                    },
                }),
            },
            include: {
                order: {
                    include: {
                        patient: true,
                    },
                },
            },
            orderBy: {
                collectedAt: 'desc',
            },
        });
        return samples.map(sample => this.mapToResponseDto(sample));
    }
    async getSampleById(id) {
        const sample = await this.prisma.labSample.findUnique({
            where: { id },
            include: {
                order: {
                    include: {
                        patient: true,
                    },
                },
            },
        });
        if (!sample) {
            throw new common_1.NotFoundException('Sample not found');
        }
        return this.mapToResponseDto(sample);
    }
    async updateSample(id, updateData) {
        try {
            const sample = await this.prisma.labSample.update({
                where: { id },
                data: updateData,
                include: {
                    order: {
                        include: {
                            patient: true,
                        },
                    },
                },
            });
            return this.mapToResponseDto(sample);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to update sample');
        }
    }
    async deleteSample(id) {
        try {
            await this.prisma.labSample.delete({
                where: { id },
            });
            return { message: 'Sample deleted successfully' };
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to delete sample');
        }
    }
    async collectSample(id, collectedAt) {
        const sample = await this.prisma.labSample.update({
            where: { id },
            data: {
                status: lab_order_dto_1.SampleStatus.COLLECTED,
                collectedAt: collectedAt || new Date(),
            },
            include: {
                order: {
                    include: {
                        patient: true,
                    },
                },
            },
        });
        return this.mapToResponseDto(sample);
    }
    async receiveSample(id) {
        const sample = await this.prisma.labSample.update({
            where: { id },
            data: {
                status: lab_order_dto_1.SampleStatus.RECEIVED,
            },
            include: {
                order: {
                    include: {
                        patient: true,
                    },
                },
            },
        });
        return this.mapToResponseDto(sample);
    }
    async processSample(id) {
        const sample = await this.prisma.labSample.update({
            where: { id },
            data: {
                status: lab_order_dto_1.SampleStatus.PROCESSED,
            },
            include: {
                order: {
                    include: {
                        patient: true,
                    },
                },
            },
        });
        return this.mapToResponseDto(sample);
    }
    async storeSample(id) {
        const sample = await this.prisma.labSample.update({
            where: { id },
            data: {
                status: lab_order_dto_1.SampleStatus.STORED,
            },
            include: {
                order: {
                    include: {
                        patient: true,
                    },
                },
            },
        });
        return this.mapToResponseDto(sample);
    }
    async disposeSample(id) {
        const sample = await this.prisma.labSample.update({
            where: { id },
            data: {
                status: lab_order_dto_1.SampleStatus.DISPOSED,
            },
            include: {
                order: {
                    include: {
                        patient: true,
                    },
                },
            },
        });
        return this.mapToResponseDto(sample);
    }
    async getSamplesByOrder(orderId) {
        const samples = await this.prisma.labSample.findMany({
            where: { orderId },
            include: {
                order: {
                    include: {
                        patient: true,
                    },
                },
            },
            orderBy: {
                collectedAt: 'desc',
            },
        });
        return samples.map(sample => this.mapToResponseDto(sample));
    }
    async getSamplesByStatus(status) {
        const samples = await this.prisma.labSample.findMany({
            where: { status },
            include: {
                order: {
                    include: {
                        patient: true,
                    },
                },
            },
            orderBy: {
                collectedAt: 'desc',
            },
        });
        return samples.map(sample => this.mapToResponseDto(sample));
    }
    async getSamplesByType(sampleType) {
        const samples = await this.prisma.labSample.findMany({
            where: { sampleType },
            include: {
                order: {
                    include: {
                        patient: true,
                    },
                },
            },
            orderBy: {
                collectedAt: 'desc',
            },
        });
        return samples.map(sample => this.mapToResponseDto(sample));
    }
    async getExpiredSamples() {
        const samples = await this.prisma.labSample.findMany({
            where: {
                stabilityExpiresAt: {
                    lt: new Date(),
                },
                status: {
                    not: lab_order_dto_1.SampleStatus.DISPOSED,
                },
            },
            include: {
                order: {
                    include: {
                        patient: true,
                    },
                },
            },
            orderBy: {
                stabilityExpiresAt: 'asc',
            },
        });
        return samples.map(sample => this.mapToResponseDto(sample));
    }
    async generateBarcode(id) {
        const barcode = `SMP-${Date.now()}-${id.slice(-6).toUpperCase()}`;
        await this.prisma.labSample.update({
            where: { id },
            data: { barcode },
        });
        return { barcode };
    }
    mapToResponseDto(sample) {
        return {
            id: sample.id,
            orderId: sample.orderId,
            sampleType: sample.sampleType,
            containerType: sample.containerType,
            volume: sample.volume,
            collectionNotes: sample.collectionNotes,
            collectedAt: sample.collectedAt,
            stabilityExpiresAt: sample.stabilityExpiresAt,
            status: sample.status,
            barcode: sample.barcode,
            createdAt: sample.createdAt,
            updatedAt: sample.updatedAt,
        };
    }
};
exports.LabSamplesService = LabSamplesService;
exports.LabSamplesService = LabSamplesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LabSamplesService);
//# sourceMappingURL=lab-samples.service.js.map