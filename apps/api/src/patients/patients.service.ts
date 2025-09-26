import {
  ConflictException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  Logger,
  forwardRef,
  Inject,
  OnModuleInit
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationService } from '../notifications/notification.service';
import {
  Gender,
  BloodType,
  MaritalStatus,
  RegistrationType,
  InsuranceType,
} from '../common/enums/patient.enums';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientResponseDto } from './dto/patient-response.dto';
import { PatientRegistrationDto, EmergencyContactDto } from './dto/patient-registration.dto';
import { PaginatedResponseDto, PaginatedMetaDto } from '../common/dto/paginated-response.dto';
import { Request } from 'express';
import { FileStorageService } from '../file-storage/file-storage.service';
import moment from 'moment';
import { SupabaseClient } from '@supabase/supabase-js';
import { PatientRepository } from './repositories/patient.repository';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

// Define the Patient interface
export interface Patient {
  id: string;
  tenantId: string;
  registrationNumber: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: Date;
  gender: Gender;
  bloodType?: BloodType;
  maritalStatus?: MaritalStatus;
  registrationType: RegistrationType;
  insuranceType?: InsuranceType;
  insuranceNumber?: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  emergencyContacts?: EmergencyContactDto[];
  medicalHistory?: string;
  allergies?: string[];
  currentMedications?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

@Injectable()
export class PatientsService {
  private readonly logger = new Logger(PatientsService.name);

  constructor(
    private readonly patientRepository: PatientRepository,
    private eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,
    private fileStorageService: FileStorageService,
    private prisma: PrismaService
  ) {}

  /**
   * Register a new patient with comprehensive details
   */
  async registerPatient(
    tenantId: string,
    data: PatientRegistrationDto,
    createdById?: string
  ): Promise<PatientResponseDto> {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      try {
        // 1. Validate input data
        await this.validatePatientData(tenantId, data);

        // 2. Generate unique identifiers
        const medicalRecordNumber = await this.generateMedicalRecordNumber(tenantId);
        const registrationNumber = await this.generateRegistrationNumber(tenantId);

        // 3. Handle file uploads (e.g., photo)
        let photoUrl: string | undefined;
        if (data.photoUrl) {
          const uploadResult = await this.fileStorageService.uploadPatientPhotoFromUrl({
            photoUrl: data.photoUrl,
            patientId: medicalRecordNumber
          });
          photoUrl = uploadResult.url;
        }

        // 5. Prepare patient data
        const patientData = {
          medicalRecordNumber,
          registrationNumber,
          dateOfBirth: data.dob ? new Date(data.dob) : null,
          insuranceValidUntil: data.insuranceValidUntil ? new Date(data.insuranceValidUntil) : null,
          tenant: { connect: { id: tenantId } },
          createdBy: createdById,
          updatedBy: createdById,
          isVerified: data.autoVerify || false,
          verificationDate: (data.autoVerify || false) ? new Date() : null,
        } as Prisma.PatientCreateInput;

        // 6. Create patient record
        const patient = await tx.patient.create({
          data: patientData,
          include: {
            tenant: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            },
            emergencyContacts: true
          }
        });

        // 7. Handle emergency contacts if provided
        if (data.emergencyContacts?.length) {
          await this.addEmergencyContacts(
            tx, 
            patient.id, 
            data.emergencyContacts
          );
        }

        // 8. Emit patient registered event
        this.eventEmitter.emit('patient.registered', {
          patientId: patient.id,
          tenantId,
          registrationType: data.registrationType,
          createdById
        });

        // 9. Send welcome/verification notifications if needed
        if (data.email || data.phone) {
          this.notificationService.sendPatientWelcome({
            patientId: patient.id,
            email: data.email,
            phone: data.phone,
            name: `${data.firstName} ${data.lastName}`.trim(),
            mrn: medicalRecordNumber,
            registrationType: data.registrationType || RegistrationType.WALK_IN,
            tenantId
          });
        }

        return new PatientResponseDto(patient);
      } catch (error: any) {
        this.logger.error(`Patient registration failed: ${error.message}`, error.stack);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            const target = (error.meta?.target as string[])?.[0];
            throw new ConflictException(
              target
                ? `A patient with this ${target} already exists`
                : 'A patient with these details already exists'
            );
          }
        }

        if (error instanceof BadRequestException || error instanceof ConflictException) {
          throw error;
        }

        throw new InternalServerErrorException('Failed to register patient');
      }
    });
  }

  /**
   * Validate patient data before registration
   */
  async getTenantBySlug(slug: string) {
    return this.prisma.tenant.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
      },
    });
  }

  async checkPatientExists(params: {
    email?: string;
    phone?: string;
    aadhaarNumber?: string;
  }) {
    const { email, phone, aadhaarNumber } = params;
    
    if (!email && !phone && !aadhaarNumber) {
      throw new BadRequestException('At least one of email, phone, or Aadhaar number must be provided');
    }

    const whereClause: any = {
      OR: [],
    };

    if (email) {
      whereClause.OR.push({ email: { equals: email, mode: 'insensitive' } });
    }
    
    if (phone) {
      whereClause.OR.push({ phone });
    }
    
    if (aadhaarNumber) {
      whereClause.OR.push({ aadhaarNumber });
    }

    return this.prisma.patient.findFirst({
      where: whereClause,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        aadhaarNumber: true,
        medicalRecordNumber: true,
        registrationNumber: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
      },
    });
  }

  async uploadPatientDocument(params: {
    patientId: string;
    file: any;
    documentType: string;
    uploadedBy: string;
    tenantId: string;
  }) {
    const { patientId, file, documentType, uploadedBy, tenantId } = params;
    
    // Verify patient exists and belongs to the tenant
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId, tenantId },
      select: { id: true },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // In a real app, you would upload the file to a storage service (S3, etc.)
    // For this example, we'll just store the file metadata
    const document = await this.prisma.patientDocument.create({
      data: {
        patientId,
        title: file?.originalname || 'Document',
        description: `Document of type: ${documentType}`,
        fileUrl: `/uploads/patients/${patientId}/documents/${file?.filename || file?.originalname}`,
        fileType: file?.mimetype,
        fileSize: file?.size,
        category: documentType,
        uploadedBy,
      },
    });

    return {
      id: document.id,
      documentType: document.category,
      fileName: document.title,
      fileUrl: document.fileUrl,
      uploadedAt: document.uploadedAt,
    };
  }

  private async validatePatientData(tenantId: string, data: PatientRegistrationDto): Promise<void> {
    // Validate date of birth
    if (data.dob) {
      const dob = moment(new Date(data.dob));
      if (!dob.isValid() || dob.isAfter(moment(new Date()))) {
        throw new BadRequestException('Invalid date of birth');
      }
    }

    // Check for duplicate email
    if (data.email) {
      const existingPatient = await this.prisma.patient.findFirst({
        where: { 
          email: data.email, 
          tenantId,
          deletedAt: null
        }
      });
      
      if (existingPatient) {
        throw new ConflictException('A patient with this email already exists');
      }
    }

    // Check for duplicate phone
    if (data.phone) {
      const existingPatient = await this.prisma.patient.findFirst({
        where: { 
          phone: data.phone, 
          tenantId,
          deletedAt: null
        }
      });
      
      if (existingPatient) {
        throw new ConflictException('A patient with this phone number already exists');
      }
    }

    // Validate Aadhaar if provided
    if (data.aadhaarNumber) {
      if (!/^\d{12}$/.test(data.aadhaarNumber)) {
        throw new BadRequestException('Invalid Aadhaar number');
      }
      
      const existingAadhaar = await this.prisma.patient.findFirst({
        where: { 
          aadhaarNumber: data.aadhaarNumber,
          tenantId,
          deletedAt: null
        }
      });
      
      if (existingAadhaar) {
        throw new ConflictException('A patient with this Aadhaar number already exists');
      }
    }
  }

  /**
   * Generate a unique medical record number
   */
  private async generateMedicalRecordNumber(tenantId: string): Promise<string> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { slug: true }
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const prefix = tenant.slug.toUpperCase().substring(0, 3);
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random
    
    return `${prefix}-${timestamp}${random}`;
  }

  /**
   * Generate a unique registration number
   */
  private async generateRegistrationNumber(tenantId: string): Promise<string> {
    const year = new Date().getFullYear().toString().slice(-2);
    const count = await this.prisma.patient.count({
      where: {
        tenantId,
        createdAt: {
          gte: new Date(`${new Date().getFullYear()}-01-01T00:00:00.000Z`),
          lt: new Date(`${new Date().getFullYear() + 1}-01-01T00:00:00.000Z`)
        }
      }
    });

    return `REG-${year}-${(count + 1).toString().padStart(6, '0')}`;
  }

  /**
   * Calculate age from date of birth
   */
  private calculateAge(dob: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Add emergency contacts for a patient
   */
  private async addEmergencyContacts(
    tx: Prisma.TransactionClient,
    patientId: string,
    contacts: EmergencyContactDto[]
  ): Promise<void> {
    await Promise.all(
      contacts.map(contact => 
        tx.emergencyContact.create({
          data: {
            ...contact,
            patientId,
            isPrimary: contact.isPrimary || false
          }
        })
      )
    );
  }

  /**
   * Create a new patient (legacy method, prefer registerPatient)
   */
  async create(tenantId: string, data: CreatePatientDto, createdById?: string): Promise<PatientResponseDto> {
    const registrationData: PatientRegistrationDto = {
      ...data,
      registrationNumber: await this.generateRegistrationNumber(tenantId),
      registrationType: RegistrationType.WALK_IN,
      autoVerify: true, // Legacy create is typically for staff
      tenantId: tenantId,
      gender: data.gender as Gender | undefined,
      bloodType: data.bloodType as any,
      maritalStatus: data.maritalStatus as any,
      phone: data.phone || '',
    };

    return this.registerPatient(tenantId, registrationData, createdById);
  }

  async findOne(tenantId: string, id: string, includeDeleted: boolean = false): Promise<PatientResponseDto> {
    try {
      const where: any = { tenantId, id };
      if (!includeDeleted) {
        where.deletedAt = null;
      }

      const patient = await this.prisma.patient.findUnique({
        where: where,
        include: {
          tenant: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        }
      });

      if (!patient) {
        throw new NotFoundException(`Patient with ID ${id} not found`);
      }

      // Fetch related data if needed
      // const emergencyContacts = await this.patientRepository.findEmergencyContacts(id);
      // const documents = await this.patientRepository.findDocuments(id);

      return this.mapToDto({
        ...patient,
        // emergencyContacts,
        // documents
      });
    } catch (error: any) {
      this.logger.error(`Error finding patient: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error finding patient');
    }
  }

  /**
   * Map patient data to DTO
   */
  private mapToDto(patient: any): PatientResponseDto {
    return new PatientResponseDto(patient);
  }

  async list(
    tenantId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    status: 'active' | 'inactive' | 'all' = 'active',
    filters?: Record<string, any>
  ): Promise<PaginatedResponseDto<PatientResponseDto>> {
    try {
      const skip = (page - 1) * limit;
      const take = Math.min(limit, 100); // Enforce max limit of 100
      
      // Build where clause
      const where: Prisma.PatientWhereInput = { 
        tenantId,
        ...(status === 'active' && { deletedAt: null }),
        ...(status === 'inactive' && { deletedAt: { not: null } })
      };

      // Add search conditions if search term is provided
      if (search) {
        where.OR = [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } },
          { medicalRecordNumber: { contains: search, mode: 'insensitive' } }
        ];
      }

      // Apply additional filters if provided
      if (filters) {
        if (filters.bloodType) where.bloodType = filters.bloodType;
        if (filters.gender) where.gender = filters.gender;
        if (filters.dob) where.dateOfBirth = { equals: new Date(filters.dob) };
      }

      // Execute the query
      const [patients, total] = await Promise.all([
        this.prisma.patient.findMany({
          where,
          include: {
            tenant: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            }
          },
          skip,
          take,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.patient.count({ where })
      ]);

      // Calculate pagination metadata
      const totalPages = Math.ceil(total / take);

      const meta: PaginatedMetaDto = {
        totalItems: total,
        itemCount: patients.length,
        itemsPerPage: take,
        totalPages,
        currentPage: page,
      };

      return {
        items: patients.map((patient: any) => new PatientResponseDto(patient)),
        meta,
      };
    } catch (error: any) {
      this.logger.error(`Error listing patients: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve patients');
    }
  }

  async update(
    tenantId: string, 
    id: string, 
    data: UpdatePatientDto
  ): Promise<PatientResponseDto> {
    try {
      // Check if patient exists and belongs to the tenant
      const existingPatient = await this.prisma.patient.findUnique({
        where: { id, tenantId }
      });

      if (!existingPatient) {
        throw new NotFoundException(`Patient with ID ${id} not found`);
      }

      // Check for email uniqueness if being updated
      if (data.email && data.email !== existingPatient.email) {
        const emailExists = await this.prisma.patient.findFirst({
          where: {
            email: data.email,
            tenantId,
            NOT: { id },
            deletedAt: null
          }
        });

        if (emailExists) {
          throw new ConflictException('A patient with this email already exists');
        }
      }

      // Prepare update data
      const { emergencyContacts, ...updateData } = data;
      if (data.dob) {
        const dob = moment(data.dob);
        if (!dob.isValid() || dob.isAfter(moment())) {
          throw new BadRequestException('Invalid date of birth');
        }
        (updateData as any).dateOfBirth = new Date(data.dob);
      }

      // Update the patient
      const updatedPatient = await this.prisma.patient.update({
        where: { id },
        data: updateData,
        include: {
          tenant: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        }
      });

      return new PatientResponseDto(updatedPatient);
    } catch (error: any) {
      this.logger.error(`Error updating patient ${id}: ${error.message}`, error.stack);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = (error.meta?.target as string[])?.[0];
          throw new ConflictException(
            target
              ? `A patient with this ${target} already exists`
              : 'A patient with these details already exists'
          );
        }
      }

      if (error instanceof NotFoundException ||
          error instanceof BadRequestException ||
          error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to update patient');
    }
  }


  async remove(
    tenantId: string,
    id: string,
    hardDelete: boolean = false
  ): Promise<{ success: boolean }> {
    try {
      const patient = await this.prisma.patient.findUnique({
        where: { id, tenantId },
      });

      if (!patient) {
        throw new NotFoundException(`Patient with ID ${id} not found`);
      }

      if (hardDelete) {
        // Hard delete - permanently remove the record
        await this.prisma.patient.delete({
          where: { id },
        });
        
        // Emit patient deleted event
        this.eventEmitter.emit('patient.deleted', {
          patientId: id,
          tenantId,
          hardDelete: true,
        });
      } else {
        // Soft delete - mark as deleted
        await this.prisma.patient.update({
          where: { id, tenantId },
          data: {
            isActive: false,
            deletedAt: new Date(),
            email: patient.email ? `deleted-${Date.now()}-${patient.email}` : null,
            medicalRecordNumber: `DELETED-${Date.now()}-${id}`,
          },
        });
        
        // Emit patient deactivated event
        this.eventEmitter.emit('patient.deactivated', {
          patientId: id,
          tenantId,
        });
      }

      return { success: true };
    } catch (error: any) {
      this.logger.error(`Failed to ${hardDelete ? 'delete' : 'deactivate'} patient: ${error.message}`, error.stack);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(`Failed to ${hardDelete ? 'delete' : 'deactivate'} patient`);
    }
  }

}
