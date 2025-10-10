import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CustomPrismaService } from '../prisma/custom-prisma.service';
import {
  CreateLabTestDto,
  UpdateLabTestDto,
  CreateLabOrderDto,
  UpdateLabOrderDto,
  UpdateLabTestResultDto,
  LabOrderQueryDto,
  LabTestQueryDto
} from './dto/laboratory.dto';

@Injectable()
export class LaboratoryService {
  constructor(private prisma: CustomPrismaService) {}

  // ==================== Lab Tests Management ====================

  async createLabTest(createLabTestDto: CreateLabTestDto, tenantId: string) {
    try {
      // Check if test code already exists
      const existing = await this.prisma.labTest.findFirst({
        where: { code: createLabTestDto.code, tenantId }
      });

      if (existing) {
        throw new BadRequestException('Lab test with this code already exists');
      }

      const labTest = await this.prisma.labTest.create({
        data: {
          ...createLabTestDto,
          tenantId,
        },
      });

      return {
        success: true,
        message: 'Lab test created successfully',
        data: labTest,
      };
    } catch (error) {
      console.error('Error creating lab test:', error);
      throw new BadRequestException(error.message || 'Failed to create lab test');
    }
  }

  async findAllLabTests(tenantId: string, query: LabTestQueryDto = {}) {
    const { page = 1, limit = 10, search, category, isActive = true } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      tenantId,
      isActive,
    };

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [tests, total] = await Promise.all([
      this.prisma.labTest.findMany({
        where,
        skip,
        take: parseInt(limit as any),
        orderBy: { name: 'asc' },
      }),
      this.prisma.labTest.count({ where }),
    ]);

    return {
      success: true,
      data: {
        tests,
        pagination: {
          total,
          page: parseInt(page as any),
          limit: parseInt(limit as any),
          pages: Math.ceil(total / parseInt(limit as any)),
        },
      },
    };
  }

  async findOneLabTest(id: string, tenantId: string) {
    const test = await this.prisma.labTest.findFirst({
      where: { id, tenantId },
    });

    if (!test) {
      throw new NotFoundException('Lab test not found');
    }

    return {
      success: true,
      data: test,
    };
  }

  async updateLabTest(id: string, updateLabTestDto: UpdateLabTestDto, tenantId: string) {
    try {
      const test = await this.prisma.labTest.update({
        where: { id, tenantId },
        data: updateLabTestDto,
      });

      return {
        success: true,
        message: 'Lab test updated successfully',
        data: test,
      };
    } catch (error) {
      console.error('Error updating lab test:', error);
      throw new BadRequestException('Failed to update lab test');
    }
  }

  async removeLabTest(id: string, tenantId: string) {
    try {
      await this.prisma.labTest.update({
        where: { id, tenantId },
        data: { isActive: false },
      });

      return {
        success: true,
        message: 'Lab test deactivated successfully',
      };
    } catch (error) {
      console.error('Error removing lab test:', error);
      throw new BadRequestException('Failed to deactivate lab test');
    }
  }

  // ==================== Lab Orders Management ====================

  async createLabOrder(createLabOrderDto: CreateLabOrderDto, tenantId: string) {
    try {
      // Generate order number
      const orderNumber = await this.generateOrderNumber(tenantId);

      // Create lab order with tests
      const labOrder = await this.prisma.labOrder.create({
        data: {
          orderNumber,
          patientId: createLabOrderDto.patientId,
          doctorId: createLabOrderDto.doctorId,
          notes: createLabOrderDto.notes,
          status: 'PENDING',
          tenantId,
          tests: {
            create: createLabOrderDto.tests.map(testId => ({
              testId,
              status: 'PENDING',
              tenantId,
            })),
          },
        },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              medicalRecordNumber: true,
            },
          },
          doctor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              specialization: true,
            },
          },
          tests: {
            include: {
              test: true,
            },
          },
        },
      });

      return {
        success: true,
        message: 'Lab order created successfully',
        data: labOrder,
      };
    } catch (error) {
      console.error('Error creating lab order:', error);
      throw new BadRequestException(error.message || 'Failed to create lab order');
    }
  }

  async findAllLabOrders(tenantId: string, query: LabOrderQueryDto = {}) {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      status, 
      patientId, 
      doctorId,
      startDate,
      endDate 
    } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      tenantId,
    };

    if (status) {
      where.status = status;
    }

    if (patientId) {
      where.patientId = patientId;
    }

    if (doctorId) {
      where.doctorId = doctorId;
    }

    if (startDate || endDate) {
      where.orderDate = {};
      if (startDate) where.orderDate.gte = new Date(startDate);
      if (endDate) where.orderDate.lte = new Date(endDate);
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { patient: { firstName: { contains: search, mode: 'insensitive' } } },
        { patient: { lastName: { contains: search, mode: 'insensitive' } } },
        { patient: { medicalRecordNumber: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [orders, total] = await Promise.all([
      this.prisma.labOrder.findMany({
        where,
        skip,
        take: parseInt(limit as any),
        orderBy: { orderDate: 'desc' },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              medicalRecordNumber: true,
              dateOfBirth: true,
              gender: true,
            },
          },
          doctor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              specialization: true,
            },
          },
          tests: {
            include: {
              test: true,
            },
          },
        },
      }),
      this.prisma.labOrder.count({ where }),
    ]);

    return {
      success: true,
      data: {
        orders,
        pagination: {
          total,
          page: parseInt(page as any),
          limit: parseInt(limit as any),
          pages: Math.ceil(total / parseInt(limit as any)),
        },
      },
    };
  }

  async findOneLabOrder(id: string, tenantId: string) {
    const order = await this.prisma.labOrder.findFirst({
      where: { id, tenantId },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            medicalRecordNumber: true,
            dateOfBirth: true,
            gender: true,
            phone: true,
            email: true,
          },
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialization: true,
            licenseNumber: true,
          },
        },
        tests: {
          include: {
            test: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Lab order not found');
    }

    return {
      success: true,
      data: order,
    };
  }

  async updateLabOrder(id: string, updateLabOrderDto: UpdateLabOrderDto, tenantId: string) {
    try {
      const order = await this.prisma.labOrder.update({
        where: { id, tenantId },
        data: {
          ...updateLabOrderDto,
          completedDate: updateLabOrderDto.completedDate 
            ? new Date(updateLabOrderDto.completedDate) 
            : undefined,
        },
        include: {
          patient: true,
          doctor: true,
          tests: {
            include: {
              test: true,
            },
          },
        },
      });

      return {
        success: true,
        message: 'Lab order updated successfully',
        data: order,
      };
    } catch (error) {
      console.error('Error updating lab order:', error);
      throw new BadRequestException('Failed to update lab order');
    }
  }

  async updateLabTestResult(
    orderId: string,
    testId: string,
    updateResultDto: UpdateLabTestResultDto,
    tenantId: string
  ) {
    try {
      // Find the specific lab order test
      const labOrderTest = await this.prisma.labOrderTest.findFirst({
        where: {
          orderId,
          testId,
          tenantId,
        },
      });

      if (!labOrderTest) {
        throw new NotFoundException('Lab test in order not found');
      }

      // Update the test result
      const updatedTest = await this.prisma.labOrderTest.update({
        where: { id: labOrderTest.id },
        data: {
          result: updateResultDto.result,
          resultDate: updateResultDto.resultDate ? new Date(updateResultDto.resultDate) : new Date(),
          referenceRange: updateResultDto.referenceRange,
          notes: updateResultDto.notes,
          status: updateResultDto.status || 'COMPLETED',
        },
        include: {
          test: true,
        },
      });

      // Check if all tests in the order are completed
      const allTests = await this.prisma.labOrderTest.findMany({
        where: { orderId, tenantId },
      });

      const allCompleted = allTests.every(t => t.status === 'COMPLETED');

      // If all tests are completed, update the order status
      if (allCompleted) {
        await this.prisma.labOrder.update({
          where: { id: orderId },
          data: {
            status: 'COMPLETED',
            completedDate: new Date(),
          },
        });
      }

      return {
        success: true,
        message: 'Lab test result updated successfully',
        data: updatedTest,
      };
    } catch (error) {
      console.error('Error updating lab test result:', error);
      throw new BadRequestException(error.message || 'Failed to update lab test result');
    }
  }

  async cancelLabOrder(id: string, tenantId: string) {
    try {
      await this.prisma.labOrder.update({
        where: { id, tenantId },
        data: { status: 'CANCELLED' },
      });

      return {
        success: true,
        message: 'Lab order cancelled successfully',
      };
    } catch (error) {
      console.error('Error cancelling lab order:', error);
      throw new BadRequestException('Failed to cancel lab order');
    }
  }

  async getLabStats(tenantId: string) {
    const [
      totalOrders,
      pendingOrders,
      inProgressOrders,
      completedOrders,
      totalTests,
      activeTests,
      todayOrders,
    ] = await Promise.all([
      this.prisma.labOrder.count({ where: { tenantId } }),
      this.prisma.labOrder.count({ where: { tenantId, status: 'PENDING' } }),
      this.prisma.labOrder.count({ where: { tenantId, status: 'IN_PROGRESS' } }),
      this.prisma.labOrder.count({ where: { tenantId, status: 'COMPLETED' } }),
      this.prisma.labTest.count({ where: { tenantId } }),
      this.prisma.labTest.count({ where: { tenantId, isActive: true } }),
      this.prisma.labOrder.count({
        where: {
          tenantId,
          orderDate: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    return {
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        inProgressOrders,
        completedOrders,
        cancelledOrders: totalOrders - pendingOrders - inProgressOrders - completedOrders,
        totalTests,
        activeTests,
        todayOrders,
      },
    };
  }

  private async generateOrderNumber(tenantId: string): Promise<string> {
    const count = await this.prisma.labOrder.count({ where: { tenantId } });
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    return `LAB${year}${month}${String(count + 1).padStart(5, '0')}`;
  }
}
