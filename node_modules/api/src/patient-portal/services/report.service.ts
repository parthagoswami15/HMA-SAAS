import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async getReports(query: any, user: any) {
    this.logger.log(`Getting reports for user: ${user.id}`);

    const {
      reportType,
      fromDate,
      toDate,
      status,
      page = 1,
      limit = 10,
    } = query;

    const where: any = { patientId: user.id };
    if (reportType) where.reportType = reportType;
    if (status) where.status = status;
    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt.gte = new Date(fromDate);
      if (toDate) where.createdAt.lte = new Date(toDate);
    }

    const reports = await this.prisma.medicalReport.findMany({
      where,
      include: {
        doctor: { select: { name: true, specialization: true } },
        appointment: { select: { id: true, appointmentType: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await this.prisma.medicalReport.count({ where });

    return {
      reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getReport(reportId: string, user: any) {
    this.logger.log(`Getting report: ${reportId}`);

    const report = await this.prisma.medicalReport.findFirst({
      where: {
        id: reportId,
        patientId: user.id,
      },
      include: {
        doctor: { select: { name: true, specialization: true } },
        appointment: { select: { id: true, appointmentType: true } },
      },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return report;
  }

  async downloadReport(reportId: string, user: any) {
    this.logger.log(`Downloading report: ${reportId}`);

    const report = await this.prisma.medicalReport.findFirst({
      where: {
        id: reportId,
        patientId: user.id,
      },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    if (report.status !== 'COMPLETED') {
      throw new BadRequestException('Report is not ready for download');
    }

    // In production, get file from storage
    const fileContent = await this.getReportFile(report.fileUrl);

    // Log report download
    await this.auditService.logActivity({
      action: 'REPORT_DOWNLOADED',
      entityType: 'MEDICAL_REPORT',
      entityId: reportId,
      userId: user.id,
    });

    return {
      reportId,
      fileName: report.fileName,
      fileType: report.fileType,
      content: fileContent,
    };
  }

  async getPrescriptions(query: any, user: any) {
    this.logger.log(`Getting prescriptions for user: ${user.id}`);

    const {
      fromDate,
      toDate,
      doctorId,
      page = 1,
      limit = 10,
    } = query;

    const where: any = { patientId: user.id };
    if (doctorId) where.doctorId = doctorId;
    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt.gte = new Date(fromDate);
      if (toDate) where.createdAt.lte = new Date(toDate);
    }

    const prescriptions = await this.prisma.prescription.findMany({
      where,
      include: {
        doctor: { select: { name: true, specialization: true } },
        appointment: { select: { id: true, appointmentType: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await this.prisma.prescription.count({ where });

    return {
      prescriptions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getPrescription(prescriptionId: string, user: any) {
    this.logger.log(`Getting prescription: ${prescriptionId}`);

    const prescription = await this.prisma.prescription.findFirst({
      where: {
        id: prescriptionId,
        patientId: user.id,
      },
      include: {
        doctor: { select: { name: true, specialization: true } },
        appointment: { select: { id: true, appointmentType: true } },
        medications: true,
      },
    });

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    return prescription;
  }

  async downloadPrescription(prescriptionId: string, user: any) {
    this.logger.log(`Downloading prescription: ${prescriptionId}`);

    const prescription = await this.prisma.prescription.findFirst({
      where: {
        id: prescriptionId,
        patientId: user.id,
      },
    });

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    // In production, generate PDF from prescription data
    const pdfContent = await this.generatePrescriptionPdf(prescription);

    // Log prescription download
    await this.auditService.logActivity({
      action: 'PRESCRIPTION_DOWNLOADED',
      entityType: 'PRESCRIPTION',
      entityId: prescriptionId,
      userId: user.id,
    });

    return {
      prescriptionId,
      fileName: `prescription_${prescription.id}.pdf`,
      content: pdfContent,
    };
  }

  async shareDocument(shareDto: any, user: any) {
    this.logger.log(`Sharing document for user: ${user.id}`);

    const { documentId, documentType, recipientEmail, recipientPhone, message } = shareDto;

    // Verify document ownership
    let document;
    if (documentType === 'REPORT') {
      document = await this.prisma.medicalReport.findFirst({
        where: { id: documentId, patientId: user.id },
      });
    } else if (documentType === 'PRESCRIPTION') {
      document = await this.prisma.prescription.findFirst({
        where: { id: documentId, patientId: user.id },
      });
    }

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // Create share record
    const share = await this.prisma.documentShare.create({
      data: {
        documentId,
        documentType,
        sharedBy: user.id,
        recipientEmail,
        recipientPhone,
        message,
        shareToken: this.generateShareToken(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        isActive: true,
      },
    });

    // In production, send notification to recipient
    await this.sendShareNotification(share);

    // Log document share
    await this.auditService.logActivity({
      action: 'DOCUMENT_SHARED',
      entityType: 'DOCUMENT_SHARE',
      entityId: share.id,
      userId: user.id,
      details: { documentType, recipientEmail },
    });

    return {
      shareId: share.id,
      shareToken: share.shareToken,
      expiresAt: share.expiresAt,
    };
  }

  async requestDocumentAccess(accessDto: any, user: any) {
    this.logger.log(`Requesting document access for user: ${user.id}`);

    const { documentId, documentType, requestMessage } = accessDto;

    // Create access request
    const accessRequest = await this.prisma.documentAccessRequest.create({
      data: {
        documentId,
        documentType,
        requestedBy: user.id,
        requestMessage,
        status: 'PENDING',
      },
    });

    // In production, notify document owner
    await this.notifyDocumentOwner(accessRequest);

    // Log access request
    await this.auditService.logActivity({
      action: 'DOCUMENT_ACCESS_REQUESTED',
      entityType: 'DOCUMENT_ACCESS_REQUEST',
      entityId: accessRequest.id,
      userId: user.id,
      details: { documentType },
    });

    return {
      requestId: accessRequest.id,
      status: 'PENDING',
      message: 'Access request submitted successfully',
    };
  }

  async getReportStats(user: any) {
    const totalReports = await this.prisma.medicalReport.count({
      where: { patientId: user.id },
    });

    const reportsByType = await this.prisma.medicalReport.groupBy({
      by: ['reportType'],
      where: { patientId: user.id },
      _count: { reportType: true },
    });

    const reportsByStatus = await this.prisma.medicalReport.groupBy({
      by: ['status'],
      where: { patientId: user.id },
      _count: { status: true },
    });

    const totalPrescriptions = await this.prisma.prescription.count({
      where: { patientId: user.id },
    });

    return {
      userId: user.id,
      totalReports,
      reportsByType,
      reportsByStatus,
      totalPrescriptions,
    };
  }

  private async getReportFile(fileUrl: string) {
    // In production, download from cloud storage
    this.logger.log(`Getting report file: ${fileUrl}`);
    return Buffer.from('Mock report content');
  }

  private async generatePrescriptionPdf(prescription: any) {
    // In production, generate PDF from prescription data
    this.logger.log(`Generating PDF for prescription: ${prescription.id}`);
    return Buffer.from('Mock prescription PDF content');
  }

  private generateShareToken(): string {
    return `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async sendShareNotification(share: any) {
    // In production, send email/SMS to recipient
    console.log(`Share notification sent for share ${share.id}`);
  }

  private async notifyDocumentOwner(accessRequest: any) {
    // In production, notify document owner about access request
    console.log(`Access request notification sent for request ${accessRequest.id}`);
  }
}
