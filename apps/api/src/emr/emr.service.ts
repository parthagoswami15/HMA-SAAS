import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomPrismaService } from '../prisma/custom-prisma.service';
import { CreateMedicalRecordDto, UpdateMedicalRecordDto } from './emr.controller';

@Injectable()
export class EmrService {
  constructor(private prisma: CustomPrismaService) {}

  async create(createDto: CreateMedicalRecordDto, tenantId: string, userId: string) {
    try {
      const record = await this.prisma.medicalRecord.create({
        data: {
          patientId: createDto.patientId,
          recordType: createDto.recordType,
          title: createDto.title,
          description: createDto.description,
          date: createDto.date ? new Date(createDto.date) : new Date(),
          doctorId: createDto.doctorId || userId,
          tenantId,
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
        },
      });

      return {
        success: true,
        message: 'Medical record created successfully',
        data: record,
      };
    } catch (error) {
      console.error('Error creating medical record:', error);
      throw error;
    }
  }

  async findAll(tenantId: string, query: any = {}) {
    const { page = 1, limit = 10, patientId, recordType, doctorId } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      tenantId,
      isActive: true,
    };

    if (patientId) where.patientId = patientId;
    if (recordType) where.recordType = recordType;
    if (doctorId) where.doctorId = doctorId;

    const [records, total] = await Promise.all([
      this.prisma.medicalRecord.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { date: 'desc' },
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
            },
          },
        },
      }),
      this.prisma.medicalRecord.count({ where }),
    ]);

    return {
      success: true,
      data: {
        records,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        },
      },
    };
  }

  async findByPatient(patientId: string, tenantId: string) {
    const records = await this.prisma.medicalRecord.findMany({
      where: {
        patientId,
        tenantId,
        isActive: true,
      },
      orderBy: { date: 'desc' },
      include: {
        doctor: {
          select: {
            firstName: true,
            lastName: true,
            specialization: true,
          },
        },
      },
    });

    return {
      success: true,
      data: records,
    };
  }

  async findOne(id: string, tenantId: string) {
    const record = await this.prisma.medicalRecord.findFirst({
      where: { id, tenantId },
      include: {
        patient: true,
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialization: true,
            licenseNumber: true,
          },
        },
      },
    });

    if (!record) {
      throw new NotFoundException('Medical record not found');
    }

    return {
      success: true,
      data: record,
    };
  }

  async update(
    id: string,
    updateDto: UpdateMedicalRecordDto,
    tenantId: string,
    userId: string,
  ) {
    try {
      const record = await this.prisma.medicalRecord.update({
        where: { id, tenantId },
        data: {
          ...updateDto,
          date: updateDto.date ? new Date(updateDto.date) : undefined,
          updatedById: userId,
        },
        include: {
          patient: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      return {
        success: true,
        message: 'Medical record updated successfully',
        data: record,
      };
    } catch (error) {
      console.error('Error updating medical record:', error);
      throw error;
    }
  }

  async remove(id: string, tenantId: string) {
    try {
      await this.prisma.medicalRecord.update({
        where: { id, tenantId },
        data: { isActive: false },
      });

      return {
        success: true,
        message: 'Medical record deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting medical record:', error);
      throw error;
    }
  }

  async getStats(tenantId: string) {
    const [total, byType] = await Promise.all([
      this.prisma.medicalRecord.count({
        where: { tenantId, isActive: true },
      }),
      this.prisma.medicalRecord.groupBy({
        by: ['recordType'],
        where: { tenantId, isActive: true },
        _count: true,
      }),
    ]);

    return {
      success: true,
      data: {
        total,
        byType,
      },
    };
  }
}
