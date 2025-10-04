import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateLabOrderDto,
  UpdateLabOrderDto,
  LabOrderResponseDto,
  OrderStatus,
  TestPriority,
  CreateSampleDto,
  SampleResponseDto,
  SampleStatus
} from '../dto/lab-order.dto';
import { LabBarcodeService } from './lab-barcode.service';

@Injectable()
export class LabOrdersService {
  constructor(
    private prisma: PrismaService,
    private barcodeService: LabBarcodeService,
  ) {}

  async createOrder(createOrderDto: CreateLabOrderDto): Promise<LabOrderResponseDto> {
    try {
      // Start transaction
      const result = await this.prisma.$transaction(async (tx) => {
        // Create the order
        const order = await tx.labOrder.create({
          data: {
            ...createOrderDto,
            status: OrderStatus.ORDERED,
            priority: createOrderDto.priority || TestPriority.ROUTINE,
            isStat: createOrderDto.isStat || false,
          },
          include: {
            patient: true,
            tests: true,
          },
        });

        // Generate barcode
        const barcode = this.barcodeService.generateBarcode(order.id);

        // Update order with barcode
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
    } catch (error) {
      throw new BadRequestException('Failed to create lab order');
    }
  }

  async getAllOrders(filters: any): Promise<LabOrderResponseDto[]> {
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

  async getOrderById(id: string): Promise<LabOrderResponseDto> {
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
      throw new NotFoundException('Lab order not found');
    }

    return this.mapToResponseDto(order);
  }

  async updateOrder(id: string, updateOrderDto: UpdateLabOrderDto): Promise<LabOrderResponseDto> {
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
    } catch (error) {
      throw new BadRequestException('Failed to update lab order');
    }
  }

  async cancelOrder(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.labOrder.update({
        where: { id },
        data: { status: OrderStatus.CANCELLED },
      });

      return { message: 'Lab order cancelled successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to cancel lab order');
    }
  }

  async collectOrder(id: string): Promise<LabOrderResponseDto> {
    try {
      const order = await this.prisma.labOrder.update({
        where: { id },
        data: { status: OrderStatus.COLLECTED },
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
    } catch (error) {
      throw new BadRequestException('Failed to collect lab order');
    }
  }

  async accessionOrder(id: string): Promise<LabOrderResponseDto> {
    try {
      const order = await this.prisma.$transaction(async (tx) => {
        // Update order status
        const order = await tx.labOrder.update({
          where: { id },
          data: { status: OrderStatus.ACCESSIONED },
          include: {
            tests: true,
          },
        });

        // Create samples for each test
        const samples = [];
        for (const test of order.tests) {
          const sample = await tx.labSample.create({
            data: {
              orderId: order.id,
              sampleType: test.sampleTypes[0] || 'BLOOD',
              containerType: test.containerTypes[0] || 'VACUTAINER',
              status: SampleStatus.RECEIVED,
            },
          });
          samples.push(sample);
        }

        return { ...order, samples };
      });

      return this.mapToResponseDto(order);
    } catch (error) {
      throw new BadRequestException('Failed to accession lab order');
    }
  }

  async generateBarcode(id: string): Promise<{ barcode: string }> {
    const barcode = this.barcodeService.generateBarcode(id);
    await this.prisma.labOrder.update({
      where: { id },
      data: { barcode },
    });

    return { barcode };
  }

  private mapToResponseDto(order: any): LabOrderResponseDto {
    return {
      id: order.id,
      visitId: order.visitId,
      patientId: order.patientId,
      panelId: order.panelId,
      testIds: order.testIds,
      testNames: order.tests?.map((test: any) => test.name) || [],
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
}
