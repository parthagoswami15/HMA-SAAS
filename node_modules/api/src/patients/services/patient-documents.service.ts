import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FileStorageService } from '../../file-storage/file-storage.service';
import { FileUpload } from '../../file-storage/interfaces/file-upload.interface';
import { CreatePatientDocumentDto } from '../dto/create-patient-document.dto';
import { UpdatePatientDocumentDto } from '../dto/update-patient-document.dto';
import { PatientDocument, Prisma } from '@prisma/client';
import { PaginatedResponse } from '../../common/interfaces/paginated-response.interface';

@Injectable()
export class PatientDocumentsService {
  constructor(
    private prisma: PrismaService,
    private fileStorageService: FileStorageService,
  ) {}

  async uploadDocument(
    patientId: string,
    createDocumentDto: CreatePatientDocumentDto,
    file: FileUpload,
    userId: string,
    tenantId: string,
  ): Promise<PatientDocument> {
    // Upload the file to storage
    const uploadedFile = await this.fileStorageService.uploadPatientDocument(
      patientId,
      file,
      tenantId,
    );

    // Create the document record
    return this.prisma.patientDocument.create({
      data: {
        ...createDocumentDto,
        patient: { connect: { id: patientId } },
        uploadedBy: { connect: { id: userId } },
        tenant: { connect: { id: tenantId } },
        filename: uploadedFile.filename,
        fileUrl: uploadedFile.url,
        fileSize: uploadedFile.size,
        mimeType: uploadedFile.mimeType,
      },
      include: {
        patient: true,
        uploadedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(
    patientId: string,
    query: any,
    tenantId: string,
  ): Promise<PaginatedResponse<PatientDocument>> {
    const { page = 1, limit = 10, documentType } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.PatientDocumentWhereInput = {
      patientId,
      tenantId,
      ...(documentType && { documentType }),
    };

    const [items, total] = await Promise.all([
      this.prisma.patientDocument.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          uploadedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.patientDocument.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, tenantId: string): Promise<PatientDocument> {
    const document = await this.prisma.patientDocument.findUnique({
      where: { id, tenantId },
      include: {
        uploadedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async update(
    id: string,
    updateDocumentDto: UpdatePatientDocumentDto,
    tenantId: string,
  ): Promise<PatientDocument> {
    // Check if document exists and belongs to tenant
    await this.findOne(id, tenantId);

    return this.prisma.patientDocument.update({
      where: { id },
      data: updateDocumentDto,
      include: {
        uploadedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: string, tenantId: string): Promise<void> {
    // Check if document exists and belongs to tenant
    const document = await this.findOne(id, tenantId);

    // Delete the file from storage
    await this.fileStorageService.deleteFile(document.fileUrl);

    // Delete the document record
    await this.prisma.patientDocument.delete({
      where: { id },
    });
  }

  async getDocumentFileStream(id: string, tenantId: string) {
    const document = await this.findOne(id, tenantId);
    return this.fileStorageService.getFileStream(document.fileUrl);
  }
}
