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
var LisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LisService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../../audit/audit.service");
const client_1 = require("@prisma/client");
let LisService = LisService_1 = class LisService {
    prisma;
    auditService;
    logger = new common_1.Logger(LisService_1.name);
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async createLabOrder(orderDto, user) {
        this.logger.log(`Creating lab order for tenant: ${user.tenantId}`);
        const { patientId, testCodes, testNames, priority, specimenType, collectionDate, orderingProvider, clinicalInfo, } = orderDto;
        const order = await this.prisma.labOrder.create({
            data: {
                patientId,
                testIds: testCodes,
                priority,
                specimenType,
                collectedAt: new Date(collectionDate),
                orderingPhysician: orderingProvider,
                clinicalNotes: clinicalInfo,
                status: client_1.OrderStatus.ORDERED,
                orderedBy: user.id,
                tenantId: user.tenantId,
            },
        });
        await this.auditService.log({
            tenantId: user.tenantId,
            userId: user.id,
            action: 'LAB_ORDER_CREATED',
            resource: 'LAB_ORDER',
            resourceId: order.id,
            newValues: { testIds: testCodes, priority },
            ipAddress: '127.0.0.1',
            userAgent: 'system',
        });
        return {
            orderId: order.id,
            status: 'ORDERED',
            message: 'Lab order created successfully',
        };
    }
    async getLabOrder(orderId, user) {
        this.logger.log(`Getting lab order: ${orderId}`);
        const order = await this.prisma.labOrder.findFirst({
            where: {
                id: orderId,
                tenantId: user.tenantId,
            },
            include: {
                patient: { select: { id: true, firstName: true, lastName: true } },
                results: {
                    select: {
                        id: true,
                        testId: true,
                        analyte: true,
                        value: true,
                        unit: true,
                        referenceLow: true,
                        referenceHigh: true,
                        flag: true,
                        validationStatus: true,
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Lab order not found');
        }
        return order;
    }
    async updateLabResult(orderId, resultDto, user) {
        this.logger.log(`Updating lab result for order: ${orderId}`);
        const { testId, analyte, value, unit, referenceLow, referenceHigh, flag, validationStatus } = resultDto;
        const order = await this.prisma.labOrder.findFirst({
            where: {
                id: orderId,
                tenantId: user.tenantId,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Lab order not found');
        }
        const labResult = await this.prisma.labResult.upsert({
            where: {
                orderId_testId: {
                    orderId,
                    testId,
                },
            },
            update: {
                analyte,
                value,
                unit,
                referenceLow,
                referenceHigh,
                flag,
                validationStatus,
                resultDateTime: new Date(),
                validatedAt: validationStatus === 'FINAL' ? new Date() : null,
                validatedBy: validationStatus === 'FINAL' ? user.id : null,
            },
            create: {
                orderId,
                testId,
                analyte,
                value,
                unit,
                referenceLow,
                referenceHigh,
                flag,
                validationStatus,
                resultDateTime: new Date(),
                validatedAt: validationStatus === 'FINAL' ? new Date() : null,
                validatedBy: validationStatus === 'FINAL' ? user.id : null,
            },
        });
        await this.updateOrderStatus(orderId);
        await this.auditService.log({
            tenantId: user.tenantId,
            userId: user.id,
            action: 'LAB_RESULT_UPDATED',
            resource: 'LAB_RESULT',
            resourceId: labResult.id,
            newValues: { orderId, testId, validationStatus },
            ipAddress: '127.0.0.1',
            userAgent: 'system',
        });
        return {
            resultId: labResult.id,
            orderId,
            testId,
            status: labResult.validationStatus,
        };
    }
    async getPatientLabOrders(patientId, user) {
        this.logger.log(`Getting lab orders for patient: ${patientId}`);
        const orders = await this.prisma.labOrder.findMany({
            where: {
                patientId,
                tenantId: user.tenantId,
            },
            include: {
                results: {
                    select: {
                        testId: true,
                        analyte: true,
                        value: true,
                        unit: true,
                        flag: true,
                        validationStatus: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return orders;
    }
    async getStatus(tenantId) {
        this.logger.log(`Getting LIS status for tenant: ${tenantId}`);
        const config = await this.prisma.integrationConfiguration.findFirst({
            where: {
                tenantId,
                integrationType: 'LIS',
            },
        });
        return {
            integrationType: 'LIS',
            status: config?.isActive ? 'HEALTHY' : 'ERROR',
            lastSyncAt: config?.lastSyncAt,
            isActive: config?.isActive || false,
        };
    }
    async getStats(tenantId) {
        this.logger.log(`Getting LIS stats for tenant: ${tenantId}`);
        const orderCount = await this.prisma.labOrder.count({ where: { tenantId } });
        const resultCount = await this.prisma.labResult.count({ where: { tenantId } });
        const ordersByStatus = await this.prisma.labOrder.groupBy({
            by: ['status'],
            where: { tenantId },
            _count: { status: true },
        });
        const resultsByStatus = await this.prisma.labResult.groupBy({
            by: ['validationStatus'],
            where: { tenantId },
            _count: { validationStatus: true },
        });
        return {
            totalOrders: orderCount,
            totalResults: resultCount,
            ordersByStatus,
            resultsByStatus,
        };
    }
    async retryOperation(log) {
        this.logger.log(`Retrying LIS operation: ${log.id}`);
        const retryResult = {
            success: true,
            message: 'Operation retried successfully',
        };
        return retryResult;
    }
    async updateOrderStatus(orderId) {
        const results = await this.prisma.labResult.findMany({
            where: { orderId },
        });
        const allCompleted = results.every((result) => result.validationStatus === 'FINAL');
        const hasResults = results.length > 0;
        if (allCompleted && hasResults) {
            await this.prisma.labOrder.update({
                where: { id: orderId },
                data: {
                    status: client_1.OrderStatus.COMPLETED,
                },
            });
        }
    }
};
exports.LisService = LisService;
exports.LisService = LisService = LisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], LisService);
//# sourceMappingURL=lis.service.js.map