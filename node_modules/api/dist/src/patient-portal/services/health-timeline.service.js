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
var HealthTimelineService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthTimelineService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../../audit/audit.service");
let HealthTimelineService = HealthTimelineService_1 = class HealthTimelineService {
    prisma;
    auditService;
    logger = new common_1.Logger(HealthTimelineService_1.name);
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async getHealthTimeline(query, user) {
        this.logger.log(`Getting health timeline for user: ${user.id}`);
        const { type, fromDate, toDate, page = 1, limit = 20, } = query;
        const where = { userId: user.id };
        if (type)
            where.entryType = type;
        if (fromDate || toDate) {
            where.entryDate = {};
            if (fromDate)
                where.entryDate.gte = new Date(fromDate);
            if (toDate)
                where.entryDate.lte = new Date(toDate);
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
    async getTimelineSummary(user) {
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
    async addTimelineEntry(entryDto, user) {
        this.logger.log(`Adding timeline entry for user: ${user.id}`);
        const { entryType, title, description, entryDate, doctorId, appointmentId, prescriptionId, reportId, metadata, } = entryDto;
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
        await this.auditService.logActivity({
            action: 'TIMELINE_ENTRY_ADDED',
            entityType: 'HEALTH_TIMELINE',
            entityId: timelineEntry.id,
            userId: user.id,
            details: { entryType, title },
        });
        return timelineEntry;
    }
    async updateTimelineEntry(entryId, updateDto, user) {
        this.logger.log(`Updating timeline entry: ${entryId}`);
        const timelineEntry = await this.prisma.healthTimeline.findFirst({
            where: {
                id: entryId,
                userId: user.id,
            },
        });
        if (!timelineEntry) {
            throw new common_1.NotFoundException('Timeline entry not found');
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
        await this.auditService.logActivity({
            action: 'TIMELINE_ENTRY_UPDATED',
            entityType: 'HEALTH_TIMELINE',
            entityId: entryId,
            userId: user.id,
            details: updateDto,
        });
        return updatedEntry;
    }
    async deleteTimelineEntry(entryId, user) {
        this.logger.log(`Deleting timeline entry: ${entryId}`);
        const timelineEntry = await this.prisma.healthTimeline.findFirst({
            where: {
                id: entryId,
                userId: user.id,
            },
        });
        if (!timelineEntry) {
            throw new common_1.NotFoundException('Timeline entry not found');
        }
        await this.prisma.healthTimeline.delete({
            where: { id: entryId },
        });
        await this.auditService.logActivity({
            action: 'TIMELINE_ENTRY_DELETED',
            entityType: 'HEALTH_TIMELINE',
            entityId: entryId,
            userId: user.id,
        });
    }
    async getRecentTimeline(user) {
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
    async getTimelineByType(type, user) {
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
    async hideTimelineEntry(entryId, user) {
        this.logger.log(`Hiding timeline entry: ${entryId}`);
        const timelineEntry = await this.prisma.healthTimeline.findFirst({
            where: {
                id: entryId,
                userId: user.id,
            },
        });
        if (!timelineEntry) {
            throw new common_1.NotFoundException('Timeline entry not found');
        }
        const updatedEntry = await this.prisma.healthTimeline.update({
            where: { id: entryId },
            data: {
                isVisible: false,
                hiddenAt: new Date(),
            },
        });
        await this.auditService.logActivity({
            action: 'TIMELINE_ENTRY_HIDDEN',
            entityType: 'HEALTH_TIMELINE',
            entityId: entryId,
            userId: user.id,
        });
        return updatedEntry;
    }
    async getTimelineStats(user) {
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
};
exports.HealthTimelineService = HealthTimelineService;
exports.HealthTimelineService = HealthTimelineService = HealthTimelineService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], HealthTimelineService);
//# sourceMappingURL=health-timeline.service.js.map