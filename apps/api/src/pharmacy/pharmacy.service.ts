import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CustomPrismaService } from '../prisma/custom-prisma.service';
import {
  CreateMedicationDto,
  UpdateMedicationDto,
  CreatePharmacyOrderDto,
  UpdatePharmacyOrderDto,
  UpdatePharmacyOrderItemDto,
  PharmacyOrderQueryDto,
  MedicationQueryDto
} from './dto/pharmacy.dto';

@Injectable()
export class PharmacyService {
  constructor(private prisma: CustomPrismaService) {}

  // ==================== Medication Management ====================

  async createMedication(createMedicationDto: CreateMedicationDto, tenantId: string) {
    try {
      const medication = await this.prisma.medication.create({
        data: {
          ...createMedicationDto,
          tenantId,
        },
      });

      return {
        success: true,
        message: 'Medication added successfully',
        data: medication,
      };
    } catch (error) {
      console.error('Error creating medication:', error);
      throw new BadRequestException(error.message || 'Failed to add medication');
    }
  }

  async findAllMedications(tenantId: string, query: MedicationQueryDto = {}) {
    const { page = 1, limit = 10, search, dosageForm, isActive = true } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      tenantId,
      isActive,
    };

    if (dosageForm) {
      where.dosageForm = dosageForm;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { genericName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [medications, total] = await Promise.all([
      this.prisma.medication.findMany({
        where,
        skip,
        take: parseInt(limit as any),
        orderBy: { name: 'asc' },
      }),
      this.prisma.medication.count({ where }),
    ]);

    return {
      success: true,
      data: {
        medications,
        pagination: {
          total,
          page: parseInt(page as any),
          limit: parseInt(limit as any),
          pages: Math.ceil(total / parseInt(limit as any)),
        },
      },
    };
  }

  async findOneMedication(id: string, tenantId: string) {
    const medication = await this.prisma.medication.findFirst({
      where: { id, tenantId },
    });

    if (!medication) {
      throw new NotFoundException('Medication not found');
    }

    return {
      success: true,
      data: medication,
    };
  }

  async updateMedication(id: string, updateMedicationDto: UpdateMedicationDto, tenantId: string) {
    try {
      const medication = await this.prisma.medication.update({
        where: { id, tenantId },
        data: updateMedicationDto,
      });

      return {
        success: true,
        message: 'Medication updated successfully',
        data: medication,
      };
    } catch (error) {
      console.error('Error updating medication:', error);
      throw new BadRequestException('Failed to update medication');
    }
  }

  async removeMedication(id: string, tenantId: string) {
    try {
      await this.prisma.medication.update({
        where: { id, tenantId },
        data: { isActive: false },
      });

      return {
        success: true,
        message: 'Medication deactivated successfully',
      };
    } catch (error) {
      console.error('Error removing medication:', error);
      throw new BadRequestException('Failed to deactivate medication');
    }
  }

  // ==================== Pharmacy Orders Management ====================

  async createPharmacyOrder(createPharmacyOrderDto: CreatePharmacyOrderDto, tenantId: string) {
    try {
      // Generate order number
      const orderNumber = await this.generateOrderNumber(tenantId);

      // Create pharmacy order with items
      const pharmacyOrder = await this.prisma.pharmacyOrder.create({
        data: {
          orderNumber,
          patientId: createPharmacyOrderDto.patientId,
          doctorId: createPharmacyOrderDto.doctorId,
          notes: createPharmacyOrderDto.notes,
          status: 'PENDING',
          tenantId,
          items: {
            create: createPharmacyOrderDto.items.map(item => ({
              medicationId: item.medicationId,
              quantity: item.quantity,
              dosage: item.dosage,
              frequency: item.frequency,
              duration: item.duration,
              instructions: item.instructions,
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
          items: {
            include: {
              medication: true,
            },
          },
        },
      });

      return {
        success: true,
        message: 'Pharmacy order created successfully',
        data: pharmacyOrder,
      };
    } catch (error) {
      console.error('Error creating pharmacy order:', error);
      throw new BadRequestException(error.message || 'Failed to create pharmacy order');
    }
  }

  async findAllPharmacyOrders(tenantId: string, query: PharmacyOrderQueryDto = {}) {
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
      this.prisma.pharmacyOrder.findMany({
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
          items: {
            include: {
              medication: true,
            },
          },
        },
      }),
      this.prisma.pharmacyOrder.count({ where }),
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

  async findOnePharmacyOrder(id: string, tenantId: string) {
    const order = await this.prisma.pharmacyOrder.findFirst({
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
        items: {
          include: {
            medication: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Pharmacy order not found');
    }

    return {
      success: true,
      data: order,
    };
  }

  async updatePharmacyOrder(id: string, updatePharmacyOrderDto: UpdatePharmacyOrderDto, tenantId: string) {
    try {
      const order = await this.prisma.pharmacyOrder.update({
        where: { id, tenantId },
        data: {
          ...updatePharmacyOrderDto,
          dispensedDate: updatePharmacyOrderDto.dispensedDate 
            ? new Date(updatePharmacyOrderDto.dispensedDate) 
            : undefined,
        },
        include: {
          patient: true,
          doctor: true,
          items: {
            include: {
              medication: true,
            },
          },
        },
      });

      return {
        success: true,
        message: 'Pharmacy order updated successfully',
        data: order,
      };
    } catch (error) {
      console.error('Error updating pharmacy order:', error);
      throw new BadRequestException('Failed to update pharmacy order');
    }
  }

  async updatePharmacyOrderItem(
    orderId: string,
    itemId: string,
    updateItemDto: UpdatePharmacyOrderItemDto,
    tenantId: string
  ) {
    try {
      // Find the specific pharmacy order item
      const item = await this.prisma.pharmacyOrderItem.findFirst({
        where: {
          id: itemId,
          orderId,
          tenantId,
        },
      });

      if (!item) {
        throw new NotFoundException('Pharmacy order item not found');
      }

      // Update the item
      const updatedItem = await this.prisma.pharmacyOrderItem.update({
        where: { id: itemId },
        data: updateItemDto,
        include: {
          medication: true,
        },
      });

      // Check if all items are dispensed
      const allItems = await this.prisma.pharmacyOrderItem.findMany({
        where: { orderId, tenantId },
      });

      const allDispensed = allItems.every(i => i.status === 'DISPENSED');
      const someDispensed = allItems.some(i => i.status === 'DISPENSED');

      // Update order status accordingly
      if (allDispensed) {
        await this.prisma.pharmacyOrder.update({
          where: { id: orderId },
          data: {
            status: 'DISPENSED',
            dispensedDate: new Date(),
          },
        });
      } else if (someDispensed) {
        await this.prisma.pharmacyOrder.update({
          where: { id: orderId },
          data: { status: 'PARTIALLY_DISPENSED' },
        });
      }

      return {
        success: true,
        message: 'Pharmacy order item updated successfully',
        data: updatedItem,
      };
    } catch (error) {
      console.error('Error updating pharmacy order item:', error);
      throw new BadRequestException(error.message || 'Failed to update pharmacy order item');
    }
  }

  async cancelPharmacyOrder(id: string, tenantId: string) {
    try {
      await this.prisma.pharmacyOrder.update({
        where: { id, tenantId },
        data: { status: 'CANCELLED' },
      });

      return {
        success: true,
        message: 'Pharmacy order cancelled successfully',
      };
    } catch (error) {
      console.error('Error cancelling pharmacy order:', error);
      throw new BadRequestException('Failed to cancel pharmacy order');
    }
  }

  async getPharmacyStats(tenantId: string) {
    const [
      totalOrders,
      pendingOrders,
      dispensedOrders,
      completedOrders,
      totalMedications,
      activeMedications,
      todayOrders,
    ] = await Promise.all([
      this.prisma.pharmacyOrder.count({ where: { tenantId } }),
      this.prisma.pharmacyOrder.count({ where: { tenantId, status: 'PENDING' } }),
      this.prisma.pharmacyOrder.count({ where: { tenantId, status: 'DISPENSED' } }),
      this.prisma.pharmacyOrder.count({ where: { tenantId, status: 'COMPLETED' } }),
      this.prisma.medication.count({ where: { tenantId } }),
      this.prisma.medication.count({ where: { tenantId, isActive: true } }),
      this.prisma.pharmacyOrder.count({
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
        dispensedOrders,
        completedOrders,
        cancelledOrders: totalOrders - pendingOrders - dispensedOrders - completedOrders,
        totalMedications,
        activeMedications,
        todayOrders,
      },
    };
  }

  private async generateOrderNumber(tenantId: string): Promise<string> {
    const count = await this.prisma.pharmacyOrder.count({ where: { tenantId } });
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    return `PH${year}${month}${String(count + 1).padStart(5, '0')}`;
  }
}
