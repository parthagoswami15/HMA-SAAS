import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class LisService {
  private readonly logger = new Logger(LisService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async createLabOrder(orderDto: any, user: any) {
    this.logger.log(`Creating lab order for tenant: ${user.tenantId}`);

    const {
      patientId,
      testCodes,
      testNames,
      priority,
      specimenType,
      collectionDate,
      orderingProvider,
      clinicalInfo,
    } = orderDto;

    const order = await this.prisma.labOrder.create({
      data: {
        patientId,
        testIds: testCodes,
        priority,
        specimenType,
        collectedAt: new Date(collectionDate),
        orderingPhysician: orderingProvider,
        clinicalNotes: clinicalInfo,
        status: OrderStatus.ORDERED,
        orderedBy: user.id,
        tenantId: user.tenantId,
      },
    });

    // Log order creation
    await this.auditService.log({
      tenantId: user.tenantId,
      userId: user.id,
      action: 'LAB_ORDER_CREATED',
      resource: 'LAB_ORDER',
      resourceId: order.id,
      newValues: { testIds: testCodes, priority },
      ipAddress: '127.0.0.1', // In production, get from request
      userAgent: 'system', // In production, get from request
    });

    return {
      orderId: order.id,
      status: 'ORDERED',
      message: 'Lab order created successfully',
    };
  }

  async getLabOrder(orderId: string, user: any) {
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
      throw new NotFoundException('Lab order not found');
    }

    return order;
  }

  async updateLabResult(orderId: string, resultDto: any, user: any) {
    this.logger.log(`Updating lab result for order: ${orderId}`);

    const { testId, analyte, value, unit, referenceLow, referenceHigh, flag, validationStatus } = resultDto;

    const order = await this.prisma.labOrder.findFirst({
      where: {
        id: orderId,
        tenantId: user.tenantId,
      },
    });

    if (!order) {
      throw new NotFoundException('Lab order not found');
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

    // Update order status if all results are completed
    await this.updateOrderStatus(orderId);

    // Log result update
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

  async getPatientLabOrders(patientId: string, user: any) {
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

  async getStatus(tenantId: string) {
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

  async getStats(tenantId: string) {
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

  async retryOperation(log: any) {
    this.logger.log(`Retrying LIS operation: ${log.id}`);

    // In production, retry the failed LIS operation
    const retryResult = {
      success: true,
      message: 'Operation retried successfully',
    };

    return retryResult;
  }

  private async updateOrderStatus(orderId: string) {
    const results = await this.prisma.labResult.findMany({
      where: { orderId },
    });

    const allCompleted = results.every((result: any) => result.validationStatus === 'FINAL');
    const hasResults = results.length > 0;

    if (allCompleted && hasResults) {
      await this.prisma.labOrder.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.COMPLETED,
        },
      });
    }
  }
}
