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
exports.ReportTemplatesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ReportTemplatesService = class ReportTemplatesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getReportTemplate(modalityType, templateType) {
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
            throw new common_1.NotFoundException(`Template not found for ${modalityType} - ${templateType}`);
        }
        return template;
    }
    async getBIRADSTemplate() {
        return this.getReportTemplate('MG', 'BI_RADS');
    }
    async getLungRADSTemplate() {
        return this.getReportTemplate('CT', 'LUNG_RADS');
    }
    async createStructuredReport(studyId, templateData, userId) {
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
            throw new common_1.NotFoundException('Study not found');
        }
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
    async updateStructuredReport(reportId, templateData) {
        const report = await this.prisma.radReport.findUnique({
            where: { id: reportId },
        });
        if (!report) {
            throw new common_1.NotFoundException('Report not found');
        }
        if (report.status === 'SIGNED') {
            throw new common_1.BadRequestException('Cannot update signed report');
        }
        return this.prisma.radReport.update({
            where: { id: reportId },
            data: {
                structuredData: templateData,
                updatedAt: new Date(),
            },
        });
    }
    async generateReportText(reportId) {
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
            throw new common_1.NotFoundException('Report not found');
        }
        return this.generateTextFromStructuredData(report);
    }
    async getAvailableTemplates(modalityType) {
        const where = { isActive: true };
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
    async createReportTemplate(templateData) {
        const { name, templateType, modalityType, description, sections } = templateData;
        return this.prisma.reportTemplate.create({
            data: {
                name,
                templateType,
                modalityType,
                description,
                isActive: true,
                sections: {
                    create: sections.map((section, sectionIndex) => ({
                        name: section.name,
                        description: section.description,
                        order: sectionIndex,
                        fields: {
                            create: section.fields.map((field, fieldIndex) => ({
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
    async getTemplateStatistics(tenantId) {
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
            templatesByType: Object.fromEntries(templates.map(t => [t.templateType, t._count.reports])),
            reportsByType: Object.fromEntries(reportsByTemplate.map(r => [r.reportType, r._count.id])),
            recentReports,
        };
    }
    generateTextFromStructuredData(report) {
        let text = '';
        text += `RADIOLOGY REPORT\n`;
        text += `================\n\n`;
        text += `Patient: ${report.study.order.patient.firstName} ${report.study.order.patient.lastName}\n`;
        text += `Study Date: ${report.study.studyDate.toDateString()}\n`;
        text += `Modality: ${report.study.modalityType}\n`;
        text += `Accession Number: ${report.study.accessionNumber}\n\n`;
        if (report.structuredData && report.structuredData.sections) {
            report.structuredData.sections.forEach((section) => {
                text += `${section.name.toUpperCase()}\n`;
                text += `${'-'.repeat(section.name.length)}\n\n`;
                section.fields.forEach((field) => {
                    if (field.value) {
                        text += `${field.name}: ${field.value}\n`;
                    }
                });
                text += '\n';
            });
        }
        if (report.impression) {
            text += `IMPRESSION\n`;
            text += `==========\n\n`;
            text += `${report.impression}\n\n`;
        }
        if (report.recommendations) {
            text += `RECOMMENDATIONS\n`;
            text += `===============\n\n`;
            text += `${report.recommendations}\n\n`;
        }
        return text;
    }
    async validateStructuredData(templateId, data) {
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
            throw new common_1.NotFoundException('Template not found');
        }
        for (const section of template.sections) {
            for (const field of section.fields) {
                if (field.required) {
                    const fieldData = this.findFieldInData(data, section.name, field.name);
                    if (!fieldData || !fieldData.value) {
                        throw new common_1.BadRequestException(`Required field '${field.name}' in section '${section.name}' is missing`);
                    }
                }
            }
        }
        return true;
    }
    findFieldInData(data, sectionName, fieldName) {
        if (!data.sections)
            return null;
        const section = data.sections.find((s) => s.name === sectionName);
        if (!section)
            return null;
        return section.fields.find((f) => f.name === fieldName);
    }
    async getDefaultTemplate(modalityType) {
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
};
exports.ReportTemplatesService = ReportTemplatesService;
exports.ReportTemplatesService = ReportTemplatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportTemplatesService);
//# sourceMappingURL=report-templates.service.js.map