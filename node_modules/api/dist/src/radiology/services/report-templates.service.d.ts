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
export declare class ReportTemplatesService {
    private prisma;
    constructor(prisma: PrismaService);
    getReportTemplate(modalityType: string, templateType: string): Promise<any>;
    getBIRADSTemplate(): Promise<any>;
    getLungRADSTemplate(): Promise<any>;
    createStructuredReport(studyId: string, templateData: any, userId: string): Promise<any>;
    updateStructuredReport(reportId: string, templateData: any): Promise<any>;
    generateReportText(reportId: string): Promise<string>;
    getAvailableTemplates(modalityType?: string): Promise<any[]>;
    createReportTemplate(templateData: any): Promise<any>;
    getTemplateStatistics(tenantId: string): Promise<any>;
    private generateTextFromStructuredData;
    validateStructuredData(templateId: string, data: any): Promise<boolean>;
    private findFieldInData;
    getDefaultTemplate(modalityType: string): Promise<any>;
}
