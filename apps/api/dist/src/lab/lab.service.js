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
exports.LabService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LabService = class LabService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTest(tenantId, data) {
        return this.prisma.labTest.create({
            data: {
                tenantId,
                name: data.name,
                code: data.code,
                description: data.description,
                priceCents: data.priceCents || 0,
                currency: data.currency || 'USD'
            }
        });
    }
    async listTests(tenantId) {
        return this.prisma.labTest.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { labOrders: true }
                }
            }
        });
    }
    async getTestById(tenantId, testId) {
        const test = await this.prisma.labTest.findFirst({
            where: { id: testId, tenantId },
            include: {
                labOrders: {
                    include: {
                        patient: {
                            select: { firstName: true, lastName: true, phone: true }
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10
                }
            }
        });
        if (!test) {
            throw new common_1.NotFoundException('Lab test not found');
        }
        return test;
    }
    async orderTest(tenantId, data) {
        return this.prisma.labOrder.create({
            data: {
                tenantId,
                patientId: data.patientId,
                testId: data.testId,
                status: 'ordered'
            },
            include: {
                test: true,
                patient: {
                    select: { firstName: true, lastName: true, phone: true }
                }
            }
        });
    }
    async listOrders(tenantId, status) {
        const where = { tenantId };
        if (status) {
            where.status = status;
        }
        return this.prisma.labOrder.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                test: true,
                patient: {
                    select: { firstName: true, lastName: true, phone: true }
                },
                labSamples: true,
                labResults: true
            }
        });
    }
    async getOrderById(tenantId, orderId) {
        const order = await this.prisma.labOrder.findFirst({
            where: { id: orderId, tenantId },
            include: {
                test: true,
                patient: true,
                labSamples: true,
                labResults: {
                    orderBy: { reportedAt: 'desc' }
                }
            }
        });
        if (!order) {
            throw new common_1.NotFoundException('Lab order not found');
        }
        return order;
    }
    async updateOrderStatus(tenantId, orderId, status, resultUrl) {
        const order = await this.prisma.labOrder.findFirst({
            where: { id: orderId, tenantId }
        });
        if (!order) {
            throw new common_1.NotFoundException('Lab order not found');
        }
        return this.prisma.labOrder.update({
            where: { id: orderId },
            data: { status, resultUrl },
            include: {
                test: true,
                patient: {
                    select: { firstName: true, lastName: true, phone: true }
                }
            }
        });
    }
    async createSample(tenantId, data) {
        const order = await this.prisma.labOrder.findFirst({
            where: { id: data.orderId, tenantId }
        });
        if (!order) {
            throw new common_1.NotFoundException('Lab order not found');
        }
        const barcode = `${tenantId.slice(-4)}${Date.now().toString().slice(-6)}`;
        return this.prisma.labSample.create({
            data: {
                tenantId,
                orderId: data.orderId,
                testId: order.testId,
                sampleType: data.sampleType,
                collectedAt: data.collectedAt,
                collectedBy: data.collectedBy,
                barcode,
                location: data.location,
                notes: data.notes
            },
            include: {
                order: {
                    include: {
                        test: true,
                        patient: {
                            select: { firstName: true, lastName: true }
                        }
                    }
                }
            }
        });
    }
    async getSamples(tenantId, status) {
        const where = { tenantId };
        if (status) {
            where.status = status;
        }
        return this.prisma.labSample.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                order: {
                    include: {
                        test: true,
                        patient: {
                            select: { firstName: true, lastName: true }
                        }
                    }
                }
            }
        });
    }
    async updateSampleStatus(tenantId, sampleId, status, location) {
        const sample = await this.prisma.labSample.findFirst({
            where: { id: sampleId, tenantId }
        });
        if (!sample) {
            throw new common_1.NotFoundException('Lab sample not found');
        }
        return this.prisma.labSample.update({
            where: { id: sampleId },
            data: { status, location }
        });
    }
    async createResult(tenantId, data) {
        const order = await this.prisma.labOrder.findFirst({
            where: { id: data.orderId, tenantId }
        });
        if (!order) {
            throw new common_1.NotFoundException('Lab order not found');
        }
        return this.prisma.labResult.create({
            data: {
                tenantId,
                orderId: data.orderId,
                testId: order.testId,
                testName: data.testName,
                value: data.value,
                unit: data.unit,
                referenceRange: data.referenceRange,
                status: data.status || 'NORMAL',
                reportedBy: data.reportedBy,
                notes: data.notes
            },
            include: {
                order: {
                    include: {
                        test: true,
                        patient: {
                            select: { firstName: true, lastName: true }
                        }
                    }
                }
            }
        });
    }
    async verifyResult(tenantId, resultId, verifiedBy) {
        const result = await this.prisma.labResult.findFirst({
            where: { id: resultId, tenantId }
        });
        if (!result) {
            throw new common_1.NotFoundException('Lab result not found');
        }
        return this.prisma.labResult.update({
            where: { id: resultId },
            data: {
                verified: true,
                verifiedBy,
                verifiedAt: new Date()
            }
        });
    }
    async getResults(tenantId, orderId) {
        const where = { tenantId };
        if (orderId) {
            where.orderId = orderId;
        }
        return this.prisma.labResult.findMany({
            where,
            orderBy: { reportedAt: 'desc' },
            include: {
                order: {
                    include: {
                        test: true,
                        patient: {
                            select: { firstName: true, lastName: true }
                        }
                    }
                }
            }
        });
    }
    async getLabStats(tenantId) {
        const [orderStats, sampleStats, pendingResults] = await Promise.all([
            this.prisma.labOrder.groupBy({
                by: ['status'],
                where: { tenantId },
                _count: true
            }),
            this.prisma.labSample.groupBy({
                by: ['status'],
                where: { tenantId },
                _count: true
            }),
            this.prisma.labResult.count({
                where: { tenantId, verified: false }
            })
        ]);
        return {
            orders: orderStats.reduce((acc, stat) => {
                acc[stat.status] = stat._count;
                return acc;
            }, {}),
            samples: sampleStats.reduce((acc, stat) => {
                acc[stat.status] = stat._count;
                return acc;
            }, {}),
            pendingResults
        };
    }
};
exports.LabService = LabService;
exports.LabService = LabService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LabService);
//# sourceMappingURL=lab.service.js.map