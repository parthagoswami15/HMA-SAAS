import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationTemplateService {
  private readonly logger = new Logger(NotificationTemplateService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createTemplate(createDto: any, user: any) {
    this.logger.log(`Creating notification template: ${createDto.name}`);

    // Validate template variables
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

  async updateTemplate(id: string, updateDto: any, user: any) {
    this.logger.log(`Updating notification template ${id}`);

    const existingTemplate = await this.prisma.notificationTemplate.findUnique({
      where: { id },
    });

    if (!existingTemplate) {
      throw new NotFoundException('Template not found');
    }

    // Validate new variables if content changed
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

  async deleteTemplate(id: string, user: any) {
    this.logger.log(`Deleting notification template ${id}`);

    const template = await this.prisma.notificationTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    // Check if template is being used
    const usageCount = await this.prisma.notification.count({
      where: { templateId: id },
    });

    if (usageCount > 0) {
      throw new BadRequestException('Cannot delete template that is being used');
    }

    await this.prisma.notificationTemplate.delete({
      where: { id },
    });
  }

  async getTemplates(query: any, user: any) {
    const { type, language, isActive, page = '1', limit = '20' } = query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (type) where.type = type;
    if (language) where.language = language;
    if (isActive !== undefined) where.isActive = isActive === 'true';

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

  async getTemplate(id: string, user: any) {
    const template = await this.prisma.notificationTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return template;
  }

  async processTemplate(templateId: string, variables: Record<string, string>, user: any) {
    this.logger.log(`Processing template ${templateId}`);

    const template = await this.prisma.notificationTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    // Replace variables in subject and content
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

  private extractVariables(text: string): string[] {
    const variableRegex = /\{\{(\w+)\}\}/g;
    const variables = new Set<string>();

    let match;
    while ((match = variableRegex.exec(text)) !== null) {
      variables.add(match[1]);
    }

    return Array.from(variables);
  }

  async getTemplateByType(type: string, language: string = 'en') {
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

  async cloneTemplate(templateId: string, newName: string, user: any) {
    this.logger.log(`Cloning template ${templateId} as ${newName}`);

    const originalTemplate = await this.prisma.notificationTemplate.findUnique({
      where: { id: templateId },
    });

    if (!originalTemplate) {
      throw new NotFoundException('Template not found');
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
        isActive: false, // New templates are inactive by default
        createdBy: user.id,
      },
    });

    return clonedTemplate;
  }

  async getTemplateUsage(templateId: string) {
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
}
