import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface BIRADSSection {
  category: string;
  description: string;
  fields: Array<{
    name: string;
    type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean';
    options?: string[];
    required: boolean;
  }>;
}

export interface LungRADSSection {
  category: string;
  description: string;
  fields: Array<{
    name: string;
    type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean';
    options?: string[];
    required: boolean;
  }>;
}

@Injectable()
export class ReportTemplatesService {
  constructor(private prisma: PrismaService) {}

  async getReportTemplate(modalityType: string, templateType: string): Promise<any> {
    const template = await this.prisma.reportTemplate.findFirst({
      where: {
        modalityType,
        templateType,
        isActive: true,
      },
      include: {
        sections: {
          include: {
            fields: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!template) {
      throw new NotFoundException(`Template not found for ${modalityType} - ${templateType}`);
    }

    return template;
  }

  async getBIRADSTemplate(): Promise<any> {
    return this.getReportTemplate('MG', 'BI_RADS');
  }

  async getLungRADSTemplate(): Promise<any> {
    return this.getReportTemplate('CT', 'LUNG_RADS');
  }

  async createStructuredReport(studyId: string, templateData: any, userId: string): Promise<any> {
    const study = await this.prisma.study.findUnique({
      where: { id: studyId },
      include: {
        order: {
          include: {
            patient: true,
          },
        },
      },
    });

    if (!study) {
      throw new NotFoundException('Study not found');
    }

    // Create structured report
    const report = await this.prisma.radReport.create({
      data: {
        studyId,
        patientId: study.order.patientId,
        reportType: 'STRUCTURED',
        status: 'DRAFT',
        structuredData: templateData,
        createdBy: userId,
        tenantId: study.tenantId,
      },
    });

    return report;
  }

  async updateStructuredReport(reportId: string, templateData: any): Promise<any> {
    const report = await this.prisma.radReport.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    if (report.status === 'SIGNED') {
      throw new BadRequestException('Cannot update signed report');
    }

    return this.prisma.radReport.update({
      where: { id: reportId },
      data: {
        structuredData: templateData,
        updatedAt: new Date(),
      },
    });
  }

  async generateReportText(reportId: string): Promise<string> {
    const report = await this.prisma.radReport.findUnique({
      where: { id: reportId },
      include: {
        study: {
          include: {
            order: {
              include: {
                patient: true,
              },
            },
          },
        },
        template: {
          include: {
            sections: {
              include: {
                fields: true,
              },
            },
          },
        },
      },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    // Generate text report from structured data
    return this.generateTextFromStructuredData(report);
  }

  async getAvailableTemplates(modalityType?: string): Promise<any[]> {
    const where: any = { isActive: true };

    if (modalityType) {
      where.modalityType = modalityType;
    }

    const templates = await this.prisma.reportTemplate.findMany({
      where,
      include: {
        _count: {
          select: {
            reports: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return templates.map(template => ({
      id: template.id,
      name: template.name,
      templateType: template.templateType,
      modalityType: template.modalityType,
      description: template.description,
      usageCount: template._count.reports,
    }));
  }

  async createReportTemplate(templateData: any): Promise<any> {
    const { name, templateType, modalityType, description, sections } = templateData;

    return this.prisma.reportTemplate.create({
      data: {
        name,
        templateType,
        modalityType,
        description,
        isActive: true,
        sections: {
          create: sections.map((section: any, sectionIndex: number) => ({
            name: section.name,
            description: section.description,
            order: sectionIndex,
            fields: {
              create: section.fields.map((field: any, fieldIndex: number) => ({
                name: field.name,
                type: field.type,
                options: field.options || [],
                required: field.required,
                order: fieldIndex,
              })),
            },
          })),
        },
      },
      include: {
        sections: {
          include: {
            fields: true,
          },
        },
      },
    });
  }

  async getTemplateStatistics(tenantId: string): Promise<any> {
    const templates = await this.prisma.reportTemplate.findMany({
      where: { tenantId },
      include: {
        _count: {
          select: {
            reports: true,
          },
        },
      },
    });

    const reportsByTemplate = await this.prisma.radReport.groupBy({
      by: ['reportType'],
      where: { tenantId },
      _count: { id: true },
    });

    const recentReports = await this.prisma.radReport.findMany({
      where: { tenantId },
      include: {
        study: {
          select: {
            modalityType: true,
          },
        },
        template: {
          select: {
            name: true,
            templateType: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return {
      totalTemplates: templates.length,
      templatesByType: Object.fromEntries(
        templates.map(t => [t.templateType, t._count.reports])
      ),
      reportsByType: Object.fromEntries(
        reportsByTemplate.map(r => [r.reportType, r._count.id])
      ),
      recentReports,
    };
  }

  private generateTextFromStructuredData(report: any): string {
    let text = '';

    // Header
    text += `RADIOLOGY REPORT\n`;
    text += `================\n\n`;
    text += `Patient: ${report.study.order.patient.firstName} ${report.study.order.patient.lastName}\n`;
    text += `Study Date: ${report.study.studyDate.toDateString()}\n`;
    text += `Modality: ${report.study.modalityType}\n`;
    text += `Accession Number: ${report.study.accessionNumber}\n\n`;

    // Structured findings
    if (report.structuredData && report.structuredData.sections) {
      report.structuredData.sections.forEach((section: any) => {
        text += `${section.name.toUpperCase()}\n`;
        text += `${'-'.repeat(section.name.length)}\n\n`;

        section.fields.forEach((field: any) => {
          if (field.value) {
            text += `${field.name}: ${field.value}\n`;
          }
        });

        text += '\n';
      });
    }

    // Impression
    if (report.impression) {
      text += `IMPRESSION\n`;
      text += `==========\n\n`;
      text += `${report.impression}\n\n`;
    }

    // Recommendations
    if (report.recommendations) {
      text += `RECOMMENDATIONS\n`;
      text += `===============\n\n`;
      text += `${report.recommendations}\n\n`;
    }

    return text;
  }

  async validateStructuredData(templateId: string, data: any): Promise<boolean> {
    const template = await this.prisma.reportTemplate.findUnique({
      where: { id: templateId },
      include: {
        sections: {
          include: {
            fields: true,
          },
        },
      },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    // Validate required fields
    for (const section of template.sections) {
      for (const field of section.fields) {
        if (field.required) {
          const fieldData = this.findFieldInData(data, section.name, field.name);
          if (!fieldData || !fieldData.value) {
            throw new BadRequestException(`Required field '${field.name}' in section '${section.name}' is missing`);
          }
        }
      }
    }

    return true;
  }

  private findFieldInData(data: any, sectionName: string, fieldName: string): any {
    if (!data.sections) return null;

    const section = data.sections.find((s: any) => s.name === sectionName);
    if (!section) return null;

    return section.fields.find((f: any) => f.name === fieldName);
  }

  async getDefaultTemplate(modalityType: string): Promise<any> {
    // Get the most used template for this modality
    const template = await this.prisma.reportTemplate.findFirst({
      where: {
        modalityType,
        isActive: true,
      },
      include: {
        sections: {
          include: {
            fields: true,
          },
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            reports: true,
          },
        },
      },
      orderBy: {
        reports: {
          _count: 'desc',
        },
      },
    });

    return template;
  }
}
