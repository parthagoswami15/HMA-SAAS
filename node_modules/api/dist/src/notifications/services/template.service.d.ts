import { PrismaService } from '../../prisma/prisma.service';
export declare class NotificationTemplateService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createTemplate(createDto: any, user: any): Promise<any>;
    updateTemplate(id: string, updateDto: any, user: any): Promise<any>;
    deleteTemplate(id: string, user: any): Promise<void>;
    getTemplates(query: any, user: any): Promise<{
        templates: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
    }>;
    getTemplate(id: string, user: any): Promise<any>;
    processTemplate(templateId: string, variables: Record<string, string>, user: any): Promise<{
        subject: any;
        content: any;
        originalTemplate: any;
    }>;
    private extractVariables;
    getTemplateByType(type: string, language?: string): Promise<any>;
    cloneTemplate(templateId: string, newName: string, user: any): Promise<any>;
    getTemplateUsage(templateId: string): Promise<{
        templateId: string;
        total: any;
        byStatus: any;
    }>;
}
