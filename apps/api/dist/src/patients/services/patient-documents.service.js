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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientDocumentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const file_storage_service_1 = require("../../file-storage/file-storage.service");
let PatientDocumentsService = class PatientDocumentsService {
    prisma;
    fileStorageService;
    constructor(prisma, fileStorageService) {
        this.prisma = prisma;
        this.fileStorageService = fileStorageService;
    }
    async uploadDocument(patientId, createDocumentDto, file, userId, tenantId) {
        const uploadedFile = await this.fileStorageService.uploadPatientDocument(patientId, file, tenantId);
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
    async findAll(patientId, query, tenantId) {
        const { page = 1, limit = 10, documentType } = query;
        const skip = (page - 1) * limit;
        const where = {
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
    async findOne(id, tenantId) {
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
            throw new common_1.NotFoundException('Document not found');
        }
        return document;
    }
    async update(id, updateDocumentDto, tenantId) {
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
    async remove(id, tenantId) {
        const document = await this.findOne(id, tenantId);
        await this.fileStorageService.deleteFile(document.fileUrl);
        await this.prisma.patientDocument.delete({
            where: { id },
        });
    }
    async getDocumentFileStream(id, tenantId) {
        const document = await this.findOne(id, tenantId);
        return this.fileStorageService.getFileStream(document.fileUrl);
    }
};
exports.PatientDocumentsService = PatientDocumentsService;
exports.PatientDocumentsService = PatientDocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        file_storage_service_1.FileStorageService])
], PatientDocumentsService);
//# sourceMappingURL=patient-documents.service.js.map