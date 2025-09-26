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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabOrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const lab_order_dto_1 = require("../dto/lab-order.dto");
const lab_barcode_service_1 = require("./lab-barcode.service");
let LabOrdersService = class LabOrdersService {
    prisma;
    barcodeService;
    constructor(prisma, barcodeService) {
        this.prisma = prisma;
        this.barcodeService = barcodeService;
    }
    async createOrder(createOrderDto) {
        try {
            const result = await this.prisma.$transaction(async (tx) => {
                const order = await tx.labOrder.create({
                    data: {
                        ...createOrderDto,
                        status: lab_order_dto_1.OrderStatus.ORDERED,
                        priority: createOrderDto.priority || lab_order_dto_1.TestPriority.ROUTINE,
                        isStat: createOrderDto.isStat || false,
                    },
                    include: {
                        patient: true,
                        tests: true,
                    },
                });
                const barcode = this.barcodeService.generateBarcode(order.id);
                const orderWithBarcode = await tx.labOrder.update({
                    where: { id: order.id },
                    data: { barcode },
                    include: {
                        patient: true,
                        tests: {
                            include: {
                                referenceRanges: true,
                            },
                        },
                    },
                });
                return orderWithBarcode;
            });
            return this.mapToResponseDto(result);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to create lab order');
        }
    }
    async getAllOrders(filters) {
        const orders = await this.prisma.labOrder.findMany({
            where: {
                ...(filters.patientId && { patientId: filters.patientId }),
                ...(filters.status && { status: filters.status }),
                ...(filters.priority && { priority: filters.priority }),
                ...(filters.dateFrom && filters.dateTo && {
                    createdAt: {
                        gte: filters.dateFrom,
                        lte: filters.dateTo,
                    },
                }),
            },
            include: {
                patient: true,
                tests: {
                    include: {
                        referenceRanges: true,
                    },
                },
                samples: true,
                results: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return orders.map(order => this.mapToResponseDto(order));
    }
    async getOrderById(id) {
        const order = await this.prisma.labOrder.findUnique({
            where: { id },
            include: {
                patient: true,
                tests: {
                    include: {
                        referenceRanges: true,
                    },
                },
                samples: true,
                results: {
                    include: {
                        validatedBy: true,
                        reviewedBy: true,
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Lab order not found');
        }
        return this.mapToResponseDto(order);
    }
    async updateOrder(id, updateOrderDto) {
        try {
            const order = await this.prisma.labOrder.update({
                where: { id },
                data: updateOrderDto,
                include: {
                    patient: true,
                    tests: {
                        include: {
                            referenceRanges: true,
                        },
                    },
                    samples: true,
                    results: true,
                },
            });
            return this.mapToResponseDto(order);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to update lab order');
        }
    }
    async cancelOrder(id) {
        try {
            await this.prisma.labOrder.update({
                where: { id },
                data: { status: lab_order_dto_1.OrderStatus.CANCELLED },
            });
            return { message: 'Lab order cancelled successfully' };
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to cancel lab order');
        }
    }
    async collectOrder(id) {
        try {
            const order = await this.prisma.labOrder.update({
                where: { id },
                data: { status: lab_order_dto_1.OrderStatus.COLLECTED },
                include: {
                    patient: true,
                    tests: {
                        include: {
                            referenceRanges: true,
                        },
                    },
                    samples: true,
                    results: true,
                },
            });
            return this.mapToResponseDto(order);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to collect lab order');
        }
    }
    async accessionOrder(id) {
        try {
            const order = await this.prisma.$transaction(async (tx) => {
                const order = await tx.labOrder.update({
                    where: { id },
                    data: { status: lab_order_dto_1.OrderStatus.ACCESSIONED },
                    include: {
                        tests: true,
                    },
                });
                const samples = [];
                for (const test of order.tests) {
                    const sample = await tx.labSample.create({
                        data: {
                            orderId: order.id,
                            sampleType: test.sampleTypes[0] || 'BLOOD',
                            containerType: test.containerTypes[0] || 'VACUTAINER',
                            status: lab_order_dto_1.SampleStatus.RECEIVED,
                        },
                    });
                    samples.push(sample);
                }
                return { ...order, samples };
            });
            return this.mapToResponseDto(order);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to accession lab order');
        }
    }
    async generateBarcode(id) {
        const barcode = this.barcodeService.generateBarcode(id);
        await this.prisma.labOrder.update({
            where: { id },
            data: { barcode },
        });
        return { barcode };
    }
    mapToResponseDto(order) {
        return {
            id: order.id,
            visitId: order.visitId,
            patientId: order.patientId,
            panelId: order.panelId,
            testIds: order.testIds,
            testNames: order.tests?.map((test) => test.name) || [],
            panelName: order.panel?.name,
            priority: order.priority,
            status: order.status,
            orderingPhysician: order.orderingPhysician,
            clinicalNotes: order.clinicalNotes,
            requiredDateTime: order.requiredDateTime,
            isStat: order.isStat,
            diagnosis: order.diagnosis,
            barcode: order.barcode,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            samples: order.samples,
            results: order.results,
        };
    }
};
exports.LabOrdersService = LabOrdersService;
exports.LabOrdersService = LabOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, typeof (_a = typeof lab_barcode_service_1.LabBarcodeService !== "undefined" && lab_barcode_service_1.LabBarcodeService) === "function" ? _a : Object])
], LabOrdersService);
//# sourceMappingURL=lab-orders.service.js.map