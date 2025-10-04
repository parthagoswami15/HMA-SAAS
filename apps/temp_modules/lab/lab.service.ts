import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLabTestDto, CreateLabOrderDto, CreateLabSampleDto, CreateLabResultDto } from './dto/lab.dto';

@Injectable()
export class LabService {
  constructor(private prisma: PrismaService) {}

  // Lab Tests
  async createTest(tenantId: string, data: CreateLabTestDto) {
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

  async listTests(tenantId: string) {
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

  async getTestById(tenantId: string, testId: string) {
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
      throw new NotFoundException('Lab test not found');
    }

    return test;
  }

  // Lab Orders
  async orderTest(tenantId: string, data: CreateLabOrderDto) {
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

  async listOrders(tenantId: string, status?: string) {
    const where: any = { tenantId };
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

  async getOrderById(tenantId: string, orderId: string) {
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
      throw new NotFoundException('Lab order not found');
    }

    return order;
  }

  async updateOrderStatus(tenantId: string, orderId: string, status: string, resultUrl?: string) {
    const order = await this.prisma.labOrder.findFirst({
      where: { id: orderId, tenantId }
    });

    if (!order) {
      throw new NotFoundException('Lab order not found');
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

  // Lab Samples
  async createSample(tenantId: string, data: CreateLabSampleDto) {
    // Get the order to extract testId
    const order = await this.prisma.labOrder.findFirst({
      where: { id: data.orderId, tenantId }
    });

    if (!order) {
      throw new NotFoundException('Lab order not found');
    }

    // Generate unique barcode
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

  async getSamples(tenantId: string, status?: string) {
    const where: any = { tenantId };
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

  async updateSampleStatus(tenantId: string, sampleId: string, status: string, location?: string) {
    const sample = await this.prisma.labSample.findFirst({
      where: { id: sampleId, tenantId }
    });

    if (!sample) {
      throw new NotFoundException('Lab sample not found');
    }

    return this.prisma.labSample.update({
      where: { id: sampleId },
      data: { status, location }
    });
  }

  // Lab Results
  async createResult(tenantId: string, data: CreateLabResultDto) {
    // Get the order to extract testId
    const order = await this.prisma.labOrder.findFirst({
      where: { id: data.orderId, tenantId }
    });

    if (!order) {
      throw new NotFoundException('Lab order not found');
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

  async verifyResult(tenantId: string, resultId: string, verifiedBy: string) {
    const result = await this.prisma.labResult.findFirst({
      where: { id: resultId, tenantId }
    });

    if (!result) {
      throw new NotFoundException('Lab result not found');
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

  async getResults(tenantId: string, orderId?: string) {
    const where: any = { tenantId };
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

  // Analytics
  async getLabStats(tenantId: string) {
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
      orders: orderStats.reduce((acc: Record<string, number>, stat) => {
        acc[stat.status] = stat._count;
        return acc;
      }, {}),
      samples: sampleStats.reduce((acc: Record<string, number>, stat) => {
        acc[stat.status] = stat._count;
        return acc;
      }, {}),
      pendingResults
    };
  }
}


