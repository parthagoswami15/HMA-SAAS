import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async uploadFile(file: Express.Multer.File, fileUploadDto: any, user: any) {
    this.logger.log(`Uploading file for consultation ${fileUploadDto.consultationId}`);

    const consultation = await this.prisma.telemedicineConsultation.findUnique({
      where: { id: fileUploadDto.consultationId },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    // Validate file type and size
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'audio/mpeg', 'audio/wav', 'audio/mp4',
      'video/mp4', 'video/webm', 'video/quicktime',
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('File type not supported');
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 50MB limit');
    }

    // In production, upload to cloud storage (AWS S3, Google Cloud Storage, etc.)
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

    // Log the file upload
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

  async getConsultationFiles(consultationId: string, user: any) {
    const consultation = await this.prisma.telemedicineConsultation.findUnique({
      where: { id: consultationId },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    const files = await this.prisma.consultationFile.findMany({
      where: { consultationId },
      orderBy: { uploadedAt: 'desc' },
    });

    return files;
  }

  async downloadFile(fileId: string, user: any) {
    const file = await this.prisma.consultationFile.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    // Check if user has permission to download
    const consultation = await this.prisma.telemedicineConsultation.findUnique({
      where: { id: file.consultationId },
    });

    const isAuthorized = consultation.patientId === user.id ||
                        consultation.doctorId === user.id ||
                        user.roles?.includes('ADMIN');

    if (!isAuthorized) {
      throw new BadRequestException('User not authorized to download this file');
    }

    // Log the file download
    await this.auditService.logActivity({
      action: 'FILE_DOWNLOADED',
      entityType: 'CONSULTATION_FILE',
      entityId: fileId,
      userId: user.id,
      details: { fileName: file.fileName },
    });

    // In production, get file from cloud storage
    const fileBuffer = await this.downloadFromStorage(file.fileUrl);

    return fileBuffer;
  }

  async deleteFile(fileId: string, user: any) {
    const file = await this.prisma.consultationFile.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    // Check if user has permission to delete
    const consultation = await this.prisma.telemedicineConsultation.findUnique({
      where: { id: file.consultationId },
    });

    const isAuthorized = consultation.doctorId === user.id ||
                        user.roles?.includes('ADMIN');

    if (!isAuthorized) {
      throw new BadRequestException('User not authorized to delete this file');
    }

    // Delete from storage first
    await this.deleteFromStorage(file.fileUrl);

    // Delete record
    await this.prisma.consultationFile.delete({
      where: { id: fileId },
    });

    // Log the file deletion
    await this.auditService.logActivity({
      action: 'FILE_DELETED',
      entityType: 'CONSULTATION_FILE',
      entityId: fileId,
      userId: user.id,
      details: { fileName: file.fileName },
    });

    return { success: true };
  }

  async shareFile(fileId: string, shareDto: any, user: any) {
    this.logger.log(`Sharing file ${fileId}`);

    const file = await this.prisma.consultationFile.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    // Check if user has permission to share
    const consultation = await this.prisma.telemedicineConsultation.findUnique({
      where: { id: file.consultationId },
    });

    const isAuthorized = consultation.patientId === user.id ||
                        consultation.doctorId === user.id ||
                        user.roles?.includes('ADMIN');

    if (!isAuthorized) {
      throw new BadRequestException('User not authorized to share this file');
    }

    // Generate shareable link
    const shareLink = await this.generateShareableLink(file, shareDto);

    // Log the file sharing
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

  async getFileMetadata(fileId: string, user: any) {
    const file = await this.prisma.consultationFile.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
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

  async searchFiles(query: string, user: any) {
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

  private async uploadToStorage(file: Express.Multer.File, consultationId: string): Promise<string> {
    // In production, upload to cloud storage
    this.logger.log(`Uploading file to storage: ${file.originalname}`);

    // Mock implementation - return a mock URL
    return `https://storage.example.com/telemedicine/${consultationId}/${Date.now()}_${file.originalname}`;
  }

  private async downloadFromStorage(fileUrl: string): Promise<Buffer> {
    // In production, download from cloud storage
    this.logger.log(`Downloading file from storage: ${fileUrl}`);

    // Mock implementation - return empty buffer
    return Buffer.from('');
  }

  private async deleteFromStorage(fileUrl: string): Promise<void> {
    // In production, delete from cloud storage
    this.logger.log(`Deleting file from storage: ${fileUrl}`);
  }

  private async generateShareableLink(file: any, shareDto: any): Promise<string> {
    // Generate a secure shareable link
    const shareToken = `share_${file.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return `https://telemedicine.example.com/shared/${shareToken}`;
  }

  async getStorageUsage(user: any) {
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

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async compressFile(fileId: string, user: any) {
    const file = await this.prisma.consultationFile.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    // Check if user has permission
    const consultation = await this.prisma.telemedicineConsultation.findUnique({
      where: { id: file.consultationId },
    });

    const isAuthorized = consultation.doctorId === user.id ||
                        user.roles?.includes('ADMIN');

    if (!isAuthorized) {
      throw new BadRequestException('User not authorized to compress this file');
    }

    // In production, compress the file
    const compressedFile = await this.compressFileInStorage(file);

    const updatedFile = await this.prisma.consultationFile.update({
      where: { id: fileId },
      data: {
        fileSize: compressedFile.size,
        updatedAt: new Date(),
      },
    });

    // Log the compression
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

  private async compressFileInStorage(file: any): Promise<{ size: number }> {
    // In production, compress the file in cloud storage
    this.logger.log(`Compressing file: ${file.fileName}`);

    // Mock implementation - return reduced size
    return { size: Math.floor(file.fileSize * 0.7) }; // 30% compression
  }
}
