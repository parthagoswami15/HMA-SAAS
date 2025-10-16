import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { CustomPrismaService } from '../prisma/custom-prisma.service';
import { CreatePatientDto, UpdatePatientDto, PatientQueryDto } from './dto';

@Injectable()
export class PatientsService {
  private readonly logger = new Logger(PatientsService.name);

  constructor(private readonly prisma: CustomPrismaService) {}

  async create(createPatientDto: CreatePatientDto, tenantId: string) {
    try {
      const mrn = await this.generateMedicalRecordNumber(tenantId);

      const data = {
        ...createPatientDto,
        medicalRecordNumber: mrn,
        tenantId,
        country: createPatientDto.country || 'India',
        dateOfBirth: createPatientDto.dateOfBirth
          ? new Date(createPatientDto.dateOfBirth)
          : undefined,
      };

      const patient = await this.prisma.patient.create({ data });

      this.logger.log(`Patient created: ${patient.id} for tenant: ${tenantId}`);

      return {
        success: true,
        message: 'Patient created successfully',
        data: patient,
      };
    } catch (error) {
      this.logger.error(`Error creating patient: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to create patient');
    }
  }

  async findAll(tenantId: string, query: PatientQueryDto) {
    const { page = 1, limit = 10, search, status = 'active' } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      tenantId,
      isActive: status === 'active',
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { medicalRecordNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [patients, total] = await Promise.all([
      this.prisma.patient.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          medicalRecordNumber: true,
          firstName: true,
          middleName: true,
          lastName: true,
          dateOfBirth: true,
          gender: true,
          bloodType: true,
          phone: true,
          email: true,
          city: true,
          isActive: true,
          createdAt: true,
        },
      }),
      this.prisma.patient.count({ where }),
    ]);

    return {
      success: true,
      data: {
        patients,
        pagination: {
          total,
          page: page,
          limit: limit,
          pages: Math.ceil(total / limit),
        },
      },
    };
  }

  async search(tenantId: string, query: string) {
    if (!query || query.length < 2) {
      return { success: true, data: [] };
    }

    const patients = await this.prisma.patient.findMany({
      where: {
        tenantId,
        isActive: true,
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query } },
          { medicalRecordNumber: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
      select: {
        id: true,
        medicalRecordNumber: true,
        firstName: true,
        lastName: true,
        phone: true,
        dateOfBirth: true,
        gender: true,
      },
    });

    return {
      success: true,
      data: patients,
    };
  }

  async findOne(id: string, tenantId: string) {
    const patient = await this.prisma.patient.findFirst({
      where: { id, tenantId },
      include: {
        appointments: {
          take: 5,
          orderBy: { startTime: 'desc' },
          include: {
            doctor: {
              select: { firstName: true, lastName: true },
            },
          },
        },
        medicalRecords: {
          take: 5,
          orderBy: { date: 'desc' },
        },
        prescriptions: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            doctor: {
              select: { firstName: true, lastName: true },
            },
          },
        },
      },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return {
      success: true,
      data: patient,
    };
  }

  async update(
    id: string,
    updatePatientDto: UpdatePatientDto,
    tenantId: string,
  ) {
    try {
      const data = {
        ...updatePatientDto,
        dateOfBirth: updatePatientDto.dateOfBirth
          ? new Date(updatePatientDto.dateOfBirth)
          : undefined,
      };

      const patient = await this.prisma.patient.update({
        where: { id, tenantId },
        data,
      });

      this.logger.log(`Patient updated: ${id} for tenant: ${tenantId}`);

      return {
        success: true,
        message: 'Patient updated successfully',
        data: patient,
      };
    } catch (error) {
      this.logger.error(`Error updating patient: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to update patient');
    }
  }

  async remove(id: string, tenantId: string) {
    try {
      await this.prisma.patient.update({
        where: { id, tenantId },
        data: {
          isActive: false,
          deletedAt: new Date(),
        },
      });

      this.logger.log(`Patient soft deleted: ${id} for tenant: ${tenantId}`);

      return {
        success: true,
        message: 'Patient deleted successfully',
      };
    } catch (error) {
      this.logger.error(`Error deleting patient: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to delete patient');
    }
  }

  async getStats(tenantId: string) {
    const [totalPatients, activePatients, todaysPatients, weekPatients] =
      await Promise.all([
        this.prisma.patient.count({ where: { tenantId } }),
        this.prisma.patient.count({ where: { tenantId, isActive: true } }),
        this.prisma.patient.count({
          where: {
            tenantId,
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        }),
        this.prisma.patient.count({
          where: {
            tenantId,
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        }),
      ]);

    return {
      success: true,
      data: {
        totalPatients,
        activePatients,
        todaysPatients,
        weekPatients,
      },
    };
  }

  private async generateMedicalRecordNumber(tenantId: string): Promise<string> {
    const prefix = 'MRN';
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    // Get the count of patients for this tenant to generate sequential number
    const patientCount = await this.prisma.patient.count({
      where: { tenantId },
    });
    const sequence = (patientCount + 1).toString().padStart(6, '0');

    return `${prefix}${year}${month}${sequence}`;
  }
}
