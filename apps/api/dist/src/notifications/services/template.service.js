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
var NotificationTemplateService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTemplateService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let NotificationTemplateService = NotificationTemplateService_1 = class NotificationTemplateService {
    prisma;
    logger = new common_1.Logger(NotificationTemplateService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTemplate(createDto, user) {
        this.logger.log(`Creating notification template: ${createDto.name}`);
        const variables = this.extractVariables(createDto.content);
        const subjectVariables = createDto.subject ? this.extractVariables(createDto.subject) : [];
        const template = await this.prisma.notificationTemplate.create({
            data: {
                name: createDto.name,
                type: createDto.type,
                subject: createDto.subject,
                content: createDto.content,
                variables: variables,
                subjectVariables: subjectVariables,
                channels: createDto.channels,
                language: createDto.language || 'en',
                isActive: createDto.isActive !== false,
                createdBy: user.id,
            },
        });
        return template;
    }
    async updateTemplate(id, updateDto, user) {
        this.logger.log(`Updating notification template ${id}`);
        const existingTemplate = await this.prisma.notificationTemplate.findUnique({
            where: { id },
        });
        if (!existingTemplate) {
            throw new common_1.NotFoundException('Template not found');
        }
        let variables = existingTemplate.variables;
        let subjectVariables = existingTemplate.subjectVariables;
        if (updateDto.content) {
            variables = this.extractVariables(updateDto.content);
        }
        if (updateDto.subject) {
            subjectVariables = this.extractVariables(updateDto.subject);
        }
        const updatedTemplate = await this.prisma.notificationTemplate.update({
            where: { id },
            data: {
                ...updateDto,
                variables,
                subjectVariables,
                updatedBy: user.id,
                updatedAt: new Date(),
            },
        });
        return updatedTemplate;
    }
    async deleteTemplate(id, user) {
        this.logger.log(`Deleting notification template ${id}`);
        const template = await this.prisma.notificationTemplate.findUnique({
            where: { id },
        });
        if (!template) {
            throw new common_1.NotFoundException('Template not found');
        }
        const usageCount = await this.prisma.notification.count({
            where: { templateId: id },
        });
        if (usageCount > 0) {
            throw new common_1.BadRequestException('Cannot delete template that is being used');
        }
        await this.prisma.notificationTemplate.delete({
            where: { id },
        });
    }
    async getTemplates(query, user) {
        const { type, language, isActive, page = '1', limit = '20' } = query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        const where = {};
        if (type)
            where.type = type;
        if (language)
            where.language = language;
        if (isActive !== undefined)
            where.isActive = isActive === 'true';
        const [templates, total] = await Promise.all([
            this.prisma.notificationTemplate.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limitNum,
            }),
            this.prisma.notificationTemplate.count({ where }),
        ]);
        return {
            templates,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        };
    }
    async getTemplate(id, user) {
        const template = await this.prisma.notificationTemplate.findUnique({
            where: { id },
        });
        if (!template) {
            throw new common_1.NotFoundException('Template not found');
        }
        return template;
    }
    async processTemplate(templateId, variables, user) {
        this.logger.log(`Processing template ${templateId}`);
        const template = await this.prisma.notificationTemplate.findUnique({
            where: { id: templateId },
        });
        if (!template) {
            throw new common_1.NotFoundException('Template not found');
        }
        let subject = template.subject || '';
        let content = template.content;
        for (const [key, value] of Object.entries(variables)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            subject = subject.replace(regex, value);
            content = content.replace(regex, value);
        }
        return {
            subject,
            content,
            originalTemplate: template,
        };
    }
    extractVariables(text) {
        const variableRegex = /\{\{(\w+)\}\}/g;
        const variables = new Set();
        let match;
        while ((match = variableRegex.exec(text)) !== null) {
            variables.add(match[1]);
        }
        return Array.from(variables);
    }
    async getTemplateByType(type, language = 'en') {
        const template = await this.prisma.notificationTemplate.findFirst({
            where: {
                type,
                language,
                isActive: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return template;
    }
    async cloneTemplate(templateId, newName, user) {
        this.logger.log(`Cloning template ${templateId} as ${newName}`);
        const originalTemplate = await this.prisma.notificationTemplate.findUnique({
            where: { id: templateId },
        });
        if (!originalTemplate) {
            throw new common_1.NotFoundException('Template not found');
        }
        const clonedTemplate = await this.prisma.notificationTemplate.create({
            data: {
                name: newName,
                type: originalTemplate.type,
                subject: originalTemplate.subject,
                content: originalTemplate.content,
                variables: originalTemplate.variables,
                subjectVariables: originalTemplate.subjectVariables,
                channels: originalTemplate.channels,
                language: originalTemplate.language,
                isActive: false,
                createdBy: user.id,
            },
        });
        return clonedTemplate;
    }
    async getTemplateUsage(templateId) {
        const usage = await this.prisma.notification.groupBy({
            by: ['status'],
            where: { templateId },
            _count: { status: true },
        });
        const total = await this.prisma.notification.count({
            where: { templateId },
        });
        return {
            templateId,
            total,
            byStatus: usage,
        };
    }
};
exports.NotificationTemplateService = NotificationTemplateService;
exports.NotificationTemplateService = NotificationTemplateService = NotificationTemplateService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationTemplateService);
//# sourceMappingURL=template.service.js.map