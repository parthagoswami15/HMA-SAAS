import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class PacsService {
  private readonly logger = new Logger(PacsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async uploadStudy(studyDto: any, user: any) {
    this.logger.log(`Uploading PACS study for tenant: ${user.tenantId}`);

    const {
      patientId,
      studyInstanceUid,
      seriesInstanceUid,
      sopInstanceUid,
      modality,
      studyDescription,
      studyDate,
      studyTime,
      dicomData,
    } = studyDto;

    // Check if study already exists
    const existingStudy = await this.prisma.pacsStudy.findFirst({
      where: {
        studyInstanceUid,
        tenantId: user.tenantId,
      },
    });

    if (existingStudy) {
      throw new BadRequestException('Study already exists');
    }

    // Create study record
    const study = await this.prisma.pacsStudy.create({
      data: {
        patientId,
        studyInstanceUid,
        seriesInstanceUid,
        sopInstanceUid,
        modality,
        studyDescription,
        studyDate: new Date(studyDate),
        studyTime,
        status: 'UPLOADED',
        uploadedBy: user.id,
        tenantId: user.tenantId,
        metadata: JSON.stringify(dicomData.metadata || {}),
      },
    });

    // Store DICOM data (in production, store in object storage)
    await this.storeDicomData(study.id, dicomData);

    // Log study upload
    await this.auditService.logActivity({
      action: 'PACS_STUDY_UPLOADED',
      entityType: 'PACS_STUDY',
      entityId: study.id,
      userId: user.id,
      details: { modality, studyDescription },
    });

    return {
      studyId: study.id,
      studyInstanceUid,
      status: 'UPLOADED',
    };
  }

  async getStudy(studyId: string, user: any) {
    this.logger.log(`Getting PACS study: ${studyId}`);

    const study = await this.prisma.pacsStudy.findFirst({
      where: {
        id: studyId,
        tenantId: user.tenantId,
      },
      include: {
        patient: { select: { id: true, name: true } },
        reports: {
          select: {
            id: true,
            reportType: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!study) {
      throw new NotFoundException('Study not found');
    }

    return {
      studyId: study.id,
      patient: study.patient,
      studyInstanceUid: study.studyInstanceUid,
      modality: study.modality,
      studyDescription: study.studyDescription,
      studyDate: study.studyDate,
      studyTime: study.studyTime,
      status: study.status,
      reports: study.reports,
      metadata: JSON.parse(study.metadata || '{}'),
    };
  }

  async getPatientStudies(patientId: string, user: any) {
    this.logger.log(`Getting PACS studies for patient: ${patientId}`);

    const studies = await this.prisma.pacsStudy.findMany({
      where: {
        patientId,
        tenantId: user.tenantId,
      },
      orderBy: { studyDate: 'desc' },
    });

    return studies.map(study => ({
      studyId: study.id,
      studyInstanceUid: study.studyInstanceUid,
      modality: study.modality,
      studyDescription: study.studyDescription,
      studyDate: study.studyDate,
      status: study.status,
    }));
  }

  async addStudyReport(studyId: string, reportDto: any, user: any) {
    this.logger.log(`Adding report to PACS study: ${studyId}`);

    const { reportType, reportContent, findings, impression } = reportDto;

    const study = await this.prisma.pacsStudy.findFirst({
      where: {
        id: studyId,
        tenantId: user.tenantId,
      },
    });

    if (!study) {
      throw new NotFoundException('Study not found');
    }

    const report = await this.prisma.pacsReport.create({
      data: {
        studyId,
        reportType,
        reportContent,
        findings,
        impression,
        status: 'COMPLETED',
        createdBy: user.id,
        createdAt: new Date(),
      },
    });

    // Update study status
    await this.prisma.pacsStudy.update({
      where: { id: studyId },
      data: {
        status: 'REPORTED',
        reportedAt: new Date(),
      },
    });

    // Log report creation
    await this.auditService.logActivity({
      action: 'PACS_REPORT_ADDED',
      entityType: 'PACS_REPORT',
      entityId: report.id,
      userId: user.id,
      details: { studyId, reportType },
    });

    return {
      reportId: report.id,
      studyId,
      status: 'COMPLETED',
    };
  }

  async getStatus(tenantId: string) {
    this.logger.log(`Getting PACS status for tenant: ${tenantId}`);

    const config = await this.prisma.integrationConfiguration.findFirst({
      where: {
        tenantId,
        integrationType: 'PACS',
      },
    });

    return {
      integrationType: 'PACS',
      status: config?.isActive ? 'HEALTHY' : 'ERROR',
      lastSyncAt: config?.lastSyncAt,
      isActive: config?.isActive || false,
    };
  }

  async getStats(tenantId: string) {
    this.logger.log(`Getting PACS stats for tenant: ${tenantId}`);

    const studyCount = await this.prisma.pacsStudy.count({ where: { tenantId } });
    const reportCount = await this.prisma.pacsReport.count({ where: { tenantId } });

    const studiesByModality = await this.prisma.pacsStudy.groupBy({
      by: ['modality'],
      where: { tenantId },
      _count: { modality: true },
    });

    const studiesByStatus = await this.prisma.pacsStudy.groupBy({
      by: ['status'],
      where: { tenantId },
      _count: { status: true },
    });

    return {
      totalStudies: studyCount,
      totalReports: reportCount,
      studiesByModality,
      studiesByStatus,
    };
  }

  async retryOperation(log: any) {
    this.logger.log(`Retrying PACS operation: ${log.id}`);

    // In production, retry the failed PACS operation
    const retryResult = {
      success: true,
      message: 'Operation retried successfully',
    };

    return retryResult;
  }

  private async storeDicomData(studyId: string, dicomData: any) {
    // In production, store DICOM files in object storage
    this.logger.log(`Storing DICOM data for study: ${studyId}`);

    // Mock storage
    await this.prisma.dicomStorage.create({
      data: {
        studyId,
        filePath: `dicom/${studyId}/`,
        fileSize: JSON.stringify(dicomData).length,
        storedAt: new Date(),
      },
    });
  }
}
