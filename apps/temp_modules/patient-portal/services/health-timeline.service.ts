import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class HealthTimelineService {
  private readonly logger = new Logger(HealthTimelineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async getHealthTimeline(query: any, user: any) {
    this.logger.log(`Getting health timeline for user: ${user.id}`);

    const {
      type,
      fromDate,
      toDate,
      page = 1,
      limit = 20,
    } = query;

    const where: any = { userId: user.id };
    if (type) where.entryType = type;
    if (fromDate || toDate) {
      where.entryDate = {};
      if (fromDate) where.entryDate.gte = new Date(fromDate);
      if (toDate) where.entryDate.lte = new Date(toDate);
    }

    const timelineEntries = await this.prisma.healthTimeline.findMany({
      where,
      include: {
        doctor: { select: { name: true, specialization: true } },
        appointment: { select: { id: true, appointmentType: true } },
        prescription: { select: { id: true, medications: true } },
        report: { select: { id: true, reportType: true } },
      },
      orderBy: { entryDate: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await this.prisma.healthTimeline.count({ where });

    return {
      entries: timelineEntries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getTimelineSummary(user: any) {
    this.logger.log(`Getting timeline summary for user: ${user.id}`);

    const totalEntries = await this.prisma.healthTimeline.count({
      where: { userId: user.id },
    });

    const entriesByType = await this.prisma.healthTimeline.groupBy({
      by: ['entryType'],
      where: { userId: user.id },
      _count: { entryType: true },
    });

    const recentEntries = await this.prisma.healthTimeline.findMany({
      where: { userId: user.id },
      orderBy: { entryDate: 'desc' },
      take: 5,
      include: {
        doctor: { select: { name: true } },
      },
    });

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const monthlyEntries = await this.prisma.healthTimeline.count({
      where: {
        userId: user.id,
        entryDate: { gte: thisMonth },
      },
    });

    return {
      userId: user.id,
      totalEntries,
      entriesByType,
      recentEntries,
      monthlyEntries,
    };
  }

  async addTimelineEntry(entryDto: any, user: any) {
    this.logger.log(`Adding timeline entry for user: ${user.id}`);

    const {
      entryType,
      title,
      description,
      entryDate,
      doctorId,
      appointmentId,
      prescriptionId,
      reportId,
      metadata,
    } = entryDto;

    const timelineEntry = await this.prisma.healthTimeline.create({
      data: {
        userId: user.id,
        entryType,
        title,
        description,
        entryDate: new Date(entryDate),
        doctorId,
        appointmentId,
        prescriptionId,
        reportId,
        metadata: JSON.stringify(metadata || {}),
        isVisible: true,
      },
      include: {
        doctor: { select: { name: true, specialization: true } },
        appointment: { select: { id: true, appointmentType: true } },
        prescription: { select: { id: true, medications: true } },
        report: { select: { id: true, reportType: true } },
      },
    });

    // Log timeline entry creation
    await this.auditService.logActivity({
      action: 'TIMELINE_ENTRY_ADDED',
      entityType: 'HEALTH_TIMELINE',
      entityId: timelineEntry.id,
      userId: user.id,
      details: { entryType, title },
    });

    return timelineEntry;
  }

  async updateTimelineEntry(entryId: string, updateDto: any, user: any) {
    this.logger.log(`Updating timeline entry: ${entryId}`);

    const timelineEntry = await this.prisma.healthTimeline.findFirst({
      where: {
        id: entryId,
        userId: user.id,
      },
    });

    if (!timelineEntry) {
      throw new NotFoundException('Timeline entry not found');
    }

    const updatedEntry = await this.prisma.healthTimeline.update({
      where: { id: entryId },
      data: {
        ...updateDto,
        updatedAt: new Date(),
      },
      include: {
        doctor: { select: { name: true, specialization: true } },
        appointment: { select: { id: true, appointmentType: true } },
        prescription: { select: { id: true, medications: true } },
        report: { select: { id: true, reportType: true } },
      },
    });

    // Log timeline entry update
    await this.auditService.logActivity({
      action: 'TIMELINE_ENTRY_UPDATED',
      entityType: 'HEALTH_TIMELINE',
      entityId: entryId,
      userId: user.id,
      details: updateDto,
    });

    return updatedEntry;
  }

  async deleteTimelineEntry(entryId: string, user: any) {
    this.logger.log(`Deleting timeline entry: ${entryId}`);

    const timelineEntry = await this.prisma.healthTimeline.findFirst({
      where: {
        id: entryId,
        userId: user.id,
      },
    });

    if (!timelineEntry) {
      throw new NotFoundException('Timeline entry not found');
    }

    await this.prisma.healthTimeline.delete({
      where: { id: entryId },
    });

    // Log timeline entry deletion
    await this.auditService.logActivity({
      action: 'TIMELINE_ENTRY_DELETED',
      entityType: 'HEALTH_TIMELINE',
      entityId: entryId,
      userId: user.id,
    });
  }

  async getRecentTimeline(user: any) {
    this.logger.log(`Getting recent timeline for user: ${user.id}`);

    const recentEntries = await this.prisma.healthTimeline.findMany({
      where: {
        userId: user.id,
        isVisible: true,
      },
      include: {
        doctor: { select: { name: true, specialization: true } },
      },
      orderBy: { entryDate: 'desc' },
      take: 10,
    });

    return recentEntries;
  }

  async getTimelineByType(type: string, user: any) {
    this.logger.log(`Getting timeline by type: ${type} for user: ${user.id}`);

    const entries = await this.prisma.healthTimeline.findMany({
      where: {
        userId: user.id,
        entryType: type,
        isVisible: true,
      },
      include: {
        doctor: { select: { name: true, specialization: true } },
        appointment: { select: { id: true, appointmentType: true } },
        prescription: { select: { id: true, medications: true } },
        report: { select: { id: true, reportType: true } },
      },
      orderBy: { entryDate: 'desc' },
    });

    return entries;
  }

  async hideTimelineEntry(entryId: string, user: any) {
    this.logger.log(`Hiding timeline entry: ${entryId}`);

    const timelineEntry = await this.prisma.healthTimeline.findFirst({
      where: {
        id: entryId,
        userId: user.id,
      },
    });

    if (!timelineEntry) {
      throw new NotFoundException('Timeline entry not found');
    }

    const updatedEntry = await this.prisma.healthTimeline.update({
      where: { id: entryId },
      data: {
        isVisible: false,
        hiddenAt: new Date(),
      },
    });

    // Log timeline entry hiding
    await this.auditService.logActivity({
      action: 'TIMELINE_ENTRY_HIDDEN',
      entityType: 'HEALTH_TIMELINE',
      entityId: entryId,
      userId: user.id,
    });

    return updatedEntry;
  }

  async getTimelineStats(user: any) {
    const totalEntries = await this.prisma.healthTimeline.count({
      where: { userId: user.id },
    });

    const visibleEntries = await this.prisma.healthTimeline.count({
      where: {
        userId: user.id,
        isVisible: true,
      },
    });

    const entriesByType = await this.prisma.healthTimeline.groupBy({
      by: ['entryType'],
      where: { userId: user.id },
      _count: { entryType: true },
    });

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const monthlyEntries = await this.prisma.healthTimeline.count({
      where: {
        userId: user.id,
        entryDate: { gte: thisMonth },
      },
    });

    return {
      userId: user.id,
      totalEntries,
      visibleEntries,
      hiddenEntries: totalEntries - visibleEntries,
      entriesByType,
      monthlyEntries,
    };
  }
}
