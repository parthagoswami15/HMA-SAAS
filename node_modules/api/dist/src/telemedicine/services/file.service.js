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
var FileService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../../audit/audit.service");
let FileService = FileService_1 = class FileService {
    prisma;
    auditService;
    logger = new common_1.Logger(FileService_1.name);
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async uploadFile(file, fileUploadDto, user) {
        this.logger.log(`Uploading file for consultation ${fileUploadDto.consultationId}`);
        const consultation = await this.prisma.telemedicineConsultation.findUnique({
            where: { id: fileUploadDto.consultationId },
        });
        if (!consultation) {
            throw new common_1.NotFoundException('Consultation not found');
        }
        const allowedTypes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp',
            'application/pdf',
            'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'audio/mpeg', 'audio/wav', 'audio/mp4',
            'video/mp4', 'video/webm', 'video/quicktime',
        ];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('File type not supported');
        }
        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new common_1.BadRequestException('File size exceeds 50MB limit');
        }
        const fileUrl = await this.uploadToStorage(file, fileUploadDto.consultationId);
        const fileRecord = await this.prisma.consultationFile.create({
            data: {
                consultationId: fileUploadDto.consultationId,
                fileName: file.originalname,
                fileUrl,
                fileType: fileUploadDto.fileType,
                mimeType: file.mimetype,
                fileSize: file.size,
                description: fileUploadDto.description,
                isPrivate: fileUploadDto.isPrivate || false,
                uploadedBy: user.id,
            },
        });
        await this.auditService.logActivity({
            action: 'FILE_UPLOADED',
            entityType: 'CONSULTATION_FILE',
            entityId: fileRecord.id,
            userId: user.id,
            details: {
                consultationId: fileUploadDto.consultationId,
                fileName: file.originalname,
                fileType: fileUploadDto.fileType,
                fileSize: file.size,
            },
        });
        return fileRecord;
    }
    async getConsultationFiles(consultationId, user) {
        const consultation = await this.prisma.telemedicineConsultation.findUnique({
            where: { id: consultationId },
        });
        if (!consultation) {
            throw new common_1.NotFoundException('Consultation not found');
        }
        const files = await this.prisma.consultationFile.findMany({
            where: { consultationId },
            orderBy: { uploadedAt: 'desc' },
        });
        return files;
    }
    async downloadFile(fileId, user) {
        const file = await this.prisma.consultationFile.findUnique({
            where: { id: fileId },
        });
        if (!file) {
            throw new common_1.NotFoundException('File not found');
        }
        const consultation = await this.prisma.telemedicineConsultation.findUnique({
            where: { id: file.consultationId },
        });
        const isAuthorized = consultation.patientId === user.id ||
            consultation.doctorId === user.id ||
            user.roles?.includes('ADMIN');
        if (!isAuthorized) {
            throw new common_1.BadRequestException('User not authorized to download this file');
        }
        await this.auditService.logActivity({
            action: 'FILE_DOWNLOADED',
            entityType: 'CONSULTATION_FILE',
            entityId: fileId,
            userId: user.id,
            details: { fileName: file.fileName },
        });
        const fileBuffer = await this.downloadFromStorage(file.fileUrl);
        return fileBuffer;
    }
    async deleteFile(fileId, user) {
        const file = await this.prisma.consultationFile.findUnique({
            where: { id: fileId },
        });
        if (!file) {
            throw new common_1.NotFoundException('File not found');
        }
        const consultation = await this.prisma.telemedicineConsultation.findUnique({
            where: { id: file.consultationId },
        });
        const isAuthorized = consultation.doctorId === user.id ||
            user.roles?.includes('ADMIN');
        if (!isAuthorized) {
            throw new common_1.BadRequestException('User not authorized to delete this file');
        }
        await this.deleteFromStorage(file.fileUrl);
        await this.prisma.consultationFile.delete({
            where: { id: fileId },
        });
        await this.auditService.logActivity({
            action: 'FILE_DELETED',
            entityType: 'CONSULTATION_FILE',
            entityId: fileId,
            userId: user.id,
            details: { fileName: file.fileName },
        });
        return { success: true };
    }
    async shareFile(fileId, shareDto, user) {
        this.logger.log(`Sharing file ${fileId}`);
        const file = await this.prisma.consultationFile.findUnique({
            where: { id: fileId },
        });
        if (!file) {
            throw new common_1.NotFoundException('File not found');
        }
        const consultation = await this.prisma.telemedicineConsultation.findUnique({
            where: { id: file.consultationId },
        });
        const isAuthorized = consultation.patientId === user.id ||
            consultation.doctorId === user.id ||
            user.roles?.includes('ADMIN');
        if (!isAuthorized) {
            throw new common_1.BadRequestException('User not authorized to share this file');
        }
        const shareLink = await this.generateShareableLink(file, shareDto);
        await this.auditService.logActivity({
            action: 'FILE_SHARED',
            entityType: 'CONSULTATION_FILE',
            entityId: fileId,
            userId: user.id,
            details: {
                shareMethod: shareDto.method,
                recipient: shareDto.recipient,
            },
        });
        return {
            fileId,
            shareLink,
            expiresAt: shareDto.expiresAt ? new Date(shareDto.expiresAt) : null,
        };
    }
    async getFileMetadata(fileId, user) {
        const file = await this.prisma.consultationFile.findUnique({
            where: { id: fileId },
        });
        if (!file) {
            throw new common_1.NotFoundException('File not found');
        }
        return {
            id: file.id,
            fileName: file.fileName,
            fileType: file.fileType,
            mimeType: file.mimeType,
            fileSize: file.fileSize,
            description: file.description,
            isPrivate: file.isPrivate,
            uploadedAt: file.uploadedAt,
            uploadedBy: file.uploadedBy,
        };
    }
    async searchFiles(query, user) {
        const files = await this.prisma.consultationFile.findMany({
            where: {
                OR: [
                    { fileName: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                ],
                consultation: {
                    OR: [
                        { patientId: user.id },
                        { doctorId: user.id },
                    ],
                },
            },
            include: {
                consultation: {
                    select: {
                        id: true,
                        consultationType: true,
                        scheduledAt: true,
                        patient: { select: { id: true, name: true } },
                        doctor: { select: { id: true, name: true } },
                    },
                },
            },
            orderBy: { uploadedAt: 'desc' },
        });
        return files;
    }
    async uploadToStorage(file, consultationId) {
        this.logger.log(`Uploading file to storage: ${file.originalname}`);
        return `https://storage.example.com/telemedicine/${consultationId}/${Date.now()}_${file.originalname}`;
    }
    async downloadFromStorage(fileUrl) {
        this.logger.log(`Downloading file from storage: ${fileUrl}`);
        return Buffer.from('');
    }
    async deleteFromStorage(fileUrl) {
        this.logger.log(`Deleting file from storage: ${fileUrl}`);
    }
    async generateShareableLink(file, shareDto) {
        const shareToken = `share_${file.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return `https://telemedicine.example.com/shared/${shareToken}`;
    }
    async getStorageUsage(user) {
        const files = await this.prisma.consultationFile.findMany({
            where: {
                consultation: {
                    OR: [
                        { patientId: user.id },
                        { doctorId: user.id },
                    ],
                },
            },
            select: { fileSize: true },
        });
        const totalSize = files.reduce((sum, file) => sum + file.fileSize, 0);
        return {
            totalFiles: files.length,
            totalSize,
            totalSizeFormatted: this.formatBytes(totalSize),
        };
    }
    formatBytes(bytes) {
        if (bytes === 0)
            return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    async compressFile(fileId, user) {
        const file = await this.prisma.consultationFile.findUnique({
            where: { id: fileId },
        });
        if (!file) {
            throw new common_1.NotFoundException('File not found');
        }
        const consultation = await this.prisma.telemedicineConsultation.findUnique({
            where: { id: file.consultationId },
        });
        const isAuthorized = consultation.doctorId === user.id ||
            user.roles?.includes('ADMIN');
        if (!isAuthorized) {
            throw new common_1.BadRequestException('User not authorized to compress this file');
        }
        const compressedFile = await this.compressFileInStorage(file);
        const updatedFile = await this.prisma.consultationFile.update({
            where: { id: fileId },
            data: {
                fileSize: compressedFile.size,
                updatedAt: new Date(),
            },
        });
        await this.auditService.logActivity({
            action: 'FILE_COMPRESSED',
            entityType: 'CONSULTATION_FILE',
            entityId: fileId,
            userId: user.id,
            details: {
                originalSize: file.fileSize,
                compressedSize: compressedFile.size,
                compressionRatio: ((file.fileSize - compressedFile.size) / file.fileSize * 100).toFixed(2) + '%',
            },
        });
        return updatedFile;
    }
    async compressFileInStorage(file) {
        this.logger.log(`Compressing file: ${file.fileName}`);
        return { size: Math.floor(file.fileSize * 0.7) };
    }
};
exports.FileService = FileService;
exports.FileService = FileService = FileService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], FileService);
//# sourceMappingURL=file.service.js.map