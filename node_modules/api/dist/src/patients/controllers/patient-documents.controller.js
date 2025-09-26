"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientDocumentsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const current_user_decorator_1 = require("../../auth/current-user.decorator");
const file_storage_service_1 = require("../../file-storage/file-storage.service");
const patient_document_dto_1 = require("../dto/patient-document.dto");
const file_upload_dto_1 = require("../../common/dto/file-upload.dto");
const patients_service_1 = require("../patients.service");
const prisma_service_1 = require("../../prisma/prisma.service");
class UploadDocumentBodyDto {
    file;
    documentType;
    notes;
    issueDate;
    expiryDate;
}
__decorate([
    ApiProperty({ required: true, type: () => file_upload_dto_1.FileUploadDto }),
    __metadata("design:type", file_upload_dto_1.FileUploadDto)
], UploadDocumentBodyDto.prototype, "file", void 0);
__decorate([
    ApiProperty({ required: true, enum: ['REPORT', 'PRESCRIPTION', 'SCAN', 'OTHER'] }),
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
], UploadDocumentBodyDto.prototype, "documentType", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UploadDocumentBodyDto.prototype, "notes", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], UploadDocumentBodyDto.prototype, "issueDate", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], UploadDocumentBodyDto.prototype, "expiryDate", void 0);
class DocumentResponseDto extends patient_document_dto_1.PatientDocumentDto {
    id;
}
__decorate([
    ApiProperty({ example: 'doc-123' }),
    __metadata("design:type", String)
], DocumentResponseDto.prototype, "id", void 0);
class PaginatedDocumentsResponseDto extends PaginatedResponseDto {
    data;
}
__decorate([
    ApiProperty({ type: [DocumentResponseDto] }),
    __metadata("design:type", Array)
], PaginatedDocumentsResponseDto.prototype, "data", void 0);
let PatientDocumentsController = class PatientDocumentsController {
    patientsService;
    prisma;
    fileStorageService;
    constructor(patientsService, prisma, fileStorageService) {
        this.patientsService = patientsService;
        this.prisma = prisma;
        this.fileStorageService = fileStorageService;
    }
    async uploadDocument(patientId, file, createDto, user) {
        const patient = await this.prisma.patient.findUnique({
            where: { id: patientId, tenantId: user.tenantId },
            select: { id: true },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found');
        }
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
        return new patient_document_dto_1.PatientDocumentDto({
            ...document,
            fileUrl: uploadResult.url,
        });
    }
    async getPatientDocuments(patientId, query, user) {
        const patient = await this.prisma.patient.findUnique({
            where: { id: patientId, tenantId: user.tenantId },
            select: { id: true },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found');
        }
        const where = { patientId, tenantId: user.tenantId };
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
            data: documents.map(doc => new patient_document_dto_1.PatientDocumentDto(doc)),
            total,
        };
    }
    async getDocument(patientId, documentId, user) {
        const document = await this.prisma.patientDocument.findUnique({
            where: {
                id: documentId,
                patientId,
                tenantId: user.tenantId,
            },
        });
        if (!document) {
            throw new common_1.NotFoundException('Document not found');
        }
        return new patient_document_dto_1.PatientDocumentDto(document);
    }
    async updateDocument(patientId, documentId, updateDto, user) {
        const document = await this.prisma.patientDocument.findUnique({
            where: {
                id: documentId,
                patientId,
                tenantId: user.tenantId,
            },
        });
        if (!document) {
            throw new common_1.NotFoundException('Document not found');
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
        return new patient_document_dto_1.PatientDocumentDto(updatedDoc);
    }
    async deleteDocument(patientId, documentId, user) {
        const document = await this.prisma.patientDocument.findUnique({
            where: {
                id: documentId,
                patientId,
                tenantId: user.tenantId,
            },
        });
        if (!document) {
            throw new common_1.NotFoundException('Document not found');
        }
        try {
            await this.fileStorageService.deleteFile(document.filePath);
            await this.prisma.patientDocument.delete({
                where: { id: documentId },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to delete document');
        }
    }
};
exports.PatientDocumentsController = PatientDocumentsController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: 'Upload a document for a patient',
        type: file_upload_dto_1.FileUploadDto,
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a document for a patient' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, type: patient_document_dto_1.PatientDocumentDto }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid file or data' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Patient not found' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [
            new common_1.MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
            new common_1.FileTypeValidator({ fileType: /(jpg|jpeg|png|pdf|doc|docx)$/ }),
        ],
    }))),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof Express !== "undefined" && (_a = Express.Multer) !== void 0 && _a.File) === "function" ? _b : Object, patient_document_dto_1.CreatePatientDocumentDto, Object]),
    __metadata("design:returntype", Promise)
], PatientDocumentsController.prototype, "uploadDocument", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all documents for a patient' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, type: [patient_document_dto_1.PatientDocumentDto] }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, patient_document_dto_1.PatientDocumentQueryDto, Object]),
    __metadata("design:returntype", Promise)
], PatientDocumentsController.prototype, "getPatientDocuments", null);
__decorate([
    (0, common_1.Get)(':documentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific document' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, type: patient_document_dto_1.PatientDocumentDto }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Document not found' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Param)('documentId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PatientDocumentsController.prototype, "getDocument", null);
__decorate([
    (0, common_1.Put)(':documentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update document metadata' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, type: patient_document_dto_1.PatientDocumentDto }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Document not found' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Param)('documentId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, patient_document_dto_1.UpdatePatientDocumentDto, Object]),
    __metadata("design:returntype", Promise)
], PatientDocumentsController.prototype, "updateDocument", null);
__decorate([
    (0, common_1.Delete)(':documentId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a document' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NO_CONTENT }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Document not found' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Param)('documentId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PatientDocumentsController.prototype, "deleteDocument", null);
exports.PatientDocumentsController = PatientDocumentsController = __decorate([
    (0, swagger_1.ApiTags)('Patient Documents'),
    (0, common_1.Controller)('patients/:patientId/documents'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __metadata("design:paramtypes", [patients_service_1.PatientsService,
        prisma_service_1.PrismaService,
        file_storage_service_1.FileStorageService])
], PatientDocumentsController);
//# sourceMappingURL=patient-documents.controller.js.map