import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
  NotFoundException,
  ParseIntPipe,
  DefaultValuePipe,
  ClassSerializerInterceptor,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags, ApiParam, ApiOkResponse, ApiCreatedResponse, ApiNoContentResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../../auth/current-user.decorator';
import { FileStorageService } from '../../file-storage/file-storage.service';
import { PatientDocumentDto, CreatePatientDocumentDto, UpdatePatientDocumentDto, PatientDocumentQueryDto } from '../dto/patient-document.dto';
import { FileUploadDto } from '../../common/dto/file-upload.dto';
import { PatientsService } from '../patients.service';
import { PrismaService } from '../../prisma/prisma.service';

// Additional DTOs for Swagger documentation
class UploadDocumentBodyDto {
  @ApiProperty({ required: true, type: () => FileUploadDto })
  file: FileUploadDto;

  @ApiProperty({ required: true, enum: ['REPORT', 'PRESCRIPTION', 'SCAN', 'OTHER'] })
  @IsNotEmpty()
  @IsString()
  documentType: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;
}

class DocumentResponseDto extends PatientDocumentDto {
  @ApiProperty({ example: 'doc-123' })
  id: string;
}

class PaginatedDocumentsResponseDto extends PaginatedResponseDto<DocumentResponseDto> {
  @ApiProperty({ type: [DocumentResponseDto] })
  data: DocumentResponseDto[];
}

@ApiTags('Patient Documents')
@Controller('patients/:patientId/documents')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class PatientDocumentsController {
  constructor(
    private readonly patientsService: PatientsService,
    private readonly prisma: PrismaService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload a document for a patient',
    type: FileUploadDto,
  })
  @ApiOperation({ summary: 'Upload a document for a patient' })
  @ApiResponse({ status: HttpStatus.CREATED, type: PatientDocumentDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid file or data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Patient not found' })
  async uploadDocument(
    @Param('patientId') patientId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|pdf|doc|docx)$/ }),
        ],
      }),
    ) file: Express.Multer.File,
    @Body() createDto: CreatePatientDocumentDto,
    @CurrentUser() user: { id: string; tenantId: string },
  ): Promise<PatientDocumentDto> {
    // Verify patient exists and belongs to the tenant
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId, tenantId: user.tenantId },
      select: { id: true },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // Upload file to storage
    const uploadResult = await this.fileStorageService.uploadPatientDocument({
      file: {
        buffer: file.buffer,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      },
      patientId,
      documentType: createDto.documentType,
    });

    // Create document record in database
    const document = await this.prisma.patientDocument.create({
      data: {
        patientId,
        documentType: createDto.documentType,
        fileName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        filePath: uploadResult.filePath,
        fileUrl: uploadResult.url,
        notes: createDto.notes,
        issueDate: createDto.issueDate ? new Date(createDto.issueDate) : null,
        expiryDate: createDto.expiryDate ? new Date(createDto.expiryDate) : null,
        uploadedBy: user.id,
        tenantId: user.tenantId,
      },
    });

    return new PatientDocumentDto({
      ...document,
      fileUrl: uploadResult.url,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all documents for a patient' })
  @ApiResponse({ status: HttpStatus.OK, type: [PatientDocumentDto] })
  async getPatientDocuments(
    @Param('patientId') patientId: string,
    @Query() query: PatientDocumentQueryDto,
    @CurrentUser() user: { tenantId: string },
  ): Promise<{ data: PatientDocumentDto[]; total: number }> {
    // Verify patient exists and belongs to the tenant
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId, tenantId: user.tenantId },
      select: { id: true },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // Build where clause
    const where: any = { patientId, tenantId: user.tenantId };
    
    if (query.documentType) {
      where.documentType = query.documentType;
    }
    
    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) {
        where.createdAt.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        where.createdAt.lte = new Date(query.endDate);
      }
    }
    
    if (query.search) {
      where.OR = [
        { fileName: { contains: query.search, mode: 'insensitive' } },
        { notes: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [documents, total] = await Promise.all([
      this.prisma.patientDocument.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.patientDocument.count({ where }),
    ]);

    return {
      data: documents.map(doc => new PatientDocumentDto(doc)),
      total,
    };
  }

  @Get(':documentId')
  @ApiOperation({ summary: 'Get a specific document' })
  @ApiResponse({ status: HttpStatus.OK, type: PatientDocumentDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Document not found' })
  async getDocument(
    @Param('patientId') patientId: string,
    @Param('documentId') documentId: string,
    @CurrentUser() user: { tenantId: string },
  ): Promise<PatientDocumentDto> {
    const document = await this.prisma.patientDocument.findUnique({
      where: { 
        id: documentId,
        patientId,
        tenantId: user.tenantId,
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return new PatientDocumentDto(document);
  }

  @Put(':documentId')
  @ApiOperation({ summary: 'Update document metadata' })
  @ApiResponse({ status: HttpStatus.OK, type: PatientDocumentDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Document not found' })
  async updateDocument(
    @Param('patientId') patientId: string,
    @Param('documentId') documentId: string,
    @Body() updateDto: UpdatePatientDocumentDto,
    @CurrentUser() user: { tenantId: string },
  ): Promise<PatientDocumentDto> {
    // Verify document exists and belongs to the patient and tenant
    const document = await this.prisma.patientDocument.findUnique({
      where: { 
        id: documentId,
        patientId,
        tenantId: user.tenantId,
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    const updatedDoc = await this.prisma.patientDocument.update({
      where: { id: documentId },
      data: {
        documentType: updateDto.documentType || document.documentType,
        notes: updateDto.notes !== undefined ? updateDto.notes : document.notes,
        issueDate: updateDto.issueDate ? new Date(updateDto.issueDate) : document.issueDate,
        expiryDate: updateDto.expiryDate ? new Date(updateDto.expiryDate) : document.expiryDate,
      },
    });

    return new PatientDocumentDto(updatedDoc);
  }

  @Delete(':documentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a document' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Document not found' })
  async deleteDocument(
    @Param('patientId') patientId: string,
    @Param('documentId') documentId: string,
    @CurrentUser() user: { tenantId: string },
  ): Promise<void> {
    // Verify document exists and belongs to the patient and tenant
    const document = await this.prisma.patientDocument.findUnique({
      where: { 
        id: documentId,
        patientId,
        tenantId: user.tenantId,
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    try {
      // Delete file from storage
      await this.fileStorageService.deleteFile(document.filePath);
      
      // Delete document record
      await this.prisma.patientDocument.delete({
        where: { id: documentId },
      });
    } catch (error) {
      throw new BadRequestException('Failed to delete document');
    }
  }
}
