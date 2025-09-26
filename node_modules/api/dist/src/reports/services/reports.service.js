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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ReportsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reports_entity_1 = require("../entities/reports.entity");
const dimensions_entity_1 = require("../entities/dimensions.entity");
const facts_entity_1 = require("../entities/facts.entity");
let ReportsService = ReportsService_1 = class ReportsService {
    reportConfigRepo;
    reportScheduleRepo;
    savedReportRepo;
    dimDateRepo;
    dimFacilityRepo;
    dimProviderRepo;
    dimServiceRepo;
    dimPayerRepo;
    factBillingRepo;
    factVisitsRepo;
    factLabsRepo;
    logger = new common_1.Logger(ReportsService_1.name);
    constructor(reportConfigRepo, reportScheduleRepo, savedReportRepo, dimDateRepo, dimFacilityRepo, dimProviderRepo, dimServiceRepo, dimPayerRepo, factBillingRepo, factVisitsRepo, factLabsRepo) {
        this.reportConfigRepo = reportConfigRepo;
        this.reportScheduleRepo = reportScheduleRepo;
        this.savedReportRepo = savedReportRepo;
        this.dimDateRepo = dimDateRepo;
        this.dimFacilityRepo = dimFacilityRepo;
        this.dimProviderRepo = dimProviderRepo;
        this.dimServiceRepo = dimServiceRepo;
        this.dimPayerRepo = dimPayerRepo;
        this.factBillingRepo = factBillingRepo;
        this.factVisitsRepo = factVisitsRepo;
        this.factLabsRepo = factLabsRepo;
    }
    async createReport(tenantId, userId, createReportDto) {
        try {
            const report = this.reportConfigRepo.create({
                tenantId,
                ...createReportDto,
                createdBy: userId,
                updatedBy: userId,
                usageCount: 0,
                lastUsedAt: null,
            });
            const savedReport = await this.reportConfigRepo.save(report);
            this.logger.log(`Report created: ${savedReport.id} for tenant: ${tenantId}`);
            return savedReport;
        }
        catch (error) {
            this.logger.error(`Failed to create report: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Failed to create report');
        }
    }
    async getReports(tenantId, options) {
        const { category, type, search, page, limit } = options;
        const skip = (page - 1) * limit;
        const queryBuilder = this.reportConfigRepo.createQueryBuilder('report')
            .where('report.tenantId = :tenantId', { tenantId })
            .andWhere('report.isActive = :isActive', { isActive: true });
        if (category) {
            queryBuilder.andWhere('report.category = :category', { category });
        }
        if (type) {
            queryBuilder.andWhere('report.type = :type', { type });
        }
        if (search) {
            queryBuilder.andWhere('(report.name ILIKE :search OR report.description ILIKE :search)', { search: `%${search}%` });
        }
        queryBuilder.orderBy('report.createdAt', 'DESC');
        queryBuilder.skip(skip).take(limit);
        const [reports, total] = await queryBuilder.getManyAndCount();
        return {
            reports,
            total,
            page,
            limit,
        };
    }
    async getReportById(tenantId, id) {
        const report = await this.reportConfigRepo.findOne({
            where: { id, tenantId, isActive: true },
            relations: ['schedules', 'savedReports'],
        });
        if (!report) {
            throw new common_1.NotFoundException('Report not found');
        }
        return report;
    }
    async updateReport(tenantId, id, userId, updateReportDto) {
        const report = await this.getReportById(tenantId, id);
        Object.assign(report, updateReportDto, { updatedBy: userId });
        const updatedReport = await this.reportConfigRepo.save(report);
        this.logger.log(`Report updated: ${id} for tenant: ${tenantId}`);
        return updatedReport;
    }
    async deleteReport(tenantId, id) {
        const report = await this.getReportById(tenantId, id);
        report.isActive = false;
        await this.reportConfigRepo.save(report);
        this.logger.log(`Report soft deleted: ${id} for tenant: ${tenantId}`);
    }
    async executeReport(tenantId, reportId, filters) {
        const report = await this.getReportById(tenantId, reportId);
        await this.reportConfigRepo.update({ id: reportId }, {
            usageCount: () => 'usageCount + 1',
            lastUsedAt: new Date(),
        });
        const result = await this.executeReportQuery(report, filters);
        await this.saveReportExecution(tenantId, report, result, filters);
        return result;
    }
    async executeReportQuery(report, filters) {
        const { configuration } = report;
        switch (configuration.dataSource) {
            case 'BILLING':
                return this.executeBillingQuery(configuration, filters);
            case 'VISITS':
                return this.executeVisitsQuery(configuration, filters);
            case 'LABS':
                return this.executeLabsQuery(configuration, filters);
            case 'PATIENTS':
                return this.executePatientsQuery(configuration, filters);
            case 'STAFF':
                return this.executeStaffQuery(configuration, filters);
            case 'INVENTORY':
                return this.executeInventoryQuery(configuration, filters);
            default:
                throw new common_1.BadRequestException('Invalid data source');
        }
    }
    async executeBillingQuery(config, filters) {
        const queryBuilder = this.factBillingRepo.createQueryBuilder('billing')
            .leftJoinAndSelect('billing.date', 'date')
            .leftJoinAndSelect('billing.facility', 'facility')
            .leftJoinAndSelect('billing.provider', 'provider')
            .leftJoinAndSelect('billing.service', 'service')
            .leftJoinAndSelect('billing.payer', 'payer');
        if (filters.startDate) {
            queryBuilder.andWhere('date.date >= :startDate', { startDate: filters.startDate });
        }
        if (filters.endDate) {
            queryBuilder.andWhere('date.date <= :endDate', { endDate: filters.endDate });
        }
        if (filters.facilityId) {
            queryBuilder.andWhere('billing.facilityId = :facilityId', { facilityId: filters.facilityId });
        }
        if (filters.providerId) {
            queryBuilder.andWhere('billing.providerId = :providerId', { providerId: filters.providerId });
        }
        const selectFields = this.buildSelectFields(config.aggregations, 'billing');
        queryBuilder.select(selectFields);
        if (config.groupBy && config.groupBy.length > 0) {
            config.groupBy.forEach(field => {
                switch (field) {
                    case 'date':
                        queryBuilder.addGroupBy('date.date');
                        break;
                    case 'facility':
                        queryBuilder.addGroupBy('facility.name');
                        break;
                    case 'provider':
                        queryBuilder.addGroupBy('provider.firstName, provider.lastName');
                        break;
                    case 'service':
                        queryBuilder.addGroupBy('service.name');
                        break;
                    case 'payer':
                        queryBuilder.addGroupBy('payer.name');
                        break;
                }
            });
        }
        if (config.orderBy) {
            Object.entries(config.orderBy).forEach(([field, direction]) => {
                queryBuilder.orderBy(field, direction);
            });
        }
        if (config.limit) {
            queryBuilder.limit(config.limit);
        }
        return queryBuilder.getRawMany();
    }
    async executeVisitsQuery(config, filters) {
        const queryBuilder = this.factVisitsRepo.createQueryBuilder('visit')
            .leftJoinAndSelect('visit.date', 'date')
            .leftJoinAndSelect('visit.facility', 'facility')
            .leftJoinAndSelect('visit.provider', 'provider')
            .leftJoinAndSelect('visit.service', 'service');
        return queryBuilder.getRawMany();
    }
    async executeLabsQuery(config, filters) {
        const queryBuilder = this.factLabsRepo.createQueryBuilder('lab')
            .leftJoinAndSelect('lab.date', 'date')
            .leftJoinAndSelect('lab.facility', 'facility')
            .leftJoinAndSelect('lab.orderingProvider', 'orderingProvider')
            .leftJoinAndSelect('lab.performingProvider', 'performingProvider')
            .leftJoinAndSelect('lab.service', 'service')
            .leftJoinAndSelect('lab.payer', 'payer');
        return queryBuilder.getRawMany();
    }
    async executePatientsQuery(config, filters) {
        return [];
    }
    async executeStaffQuery(config, filters) {
        return [];
    }
    async executeInventoryQuery(config, filters) {
        return [];
    }
    buildSelectFields(aggregations, tableAlias) {
        const selects = [];
        Object.entries(aggregations).forEach(([field, aggregation]) => {
            switch (aggregation) {
                case 'SUM':
                    selects.push(`SUM(${tableAlias}.${field}) as ${field}_sum`);
                    break;
                case 'AVG':
                    selects.push(`AVG(${tableAlias}.${field}) as ${field}_avg`);
                    break;
                case 'COUNT':
                    selects.push(`COUNT(${tableAlias}.${field}) as ${field}_count`);
                    break;
                case 'MIN':
                    selects.push(`MIN(${tableAlias}.${field}) as ${field}_min`);
                    break;
                case 'MAX':
                    selects.push(`MAX(${tableAlias}.${field}) as ${field}_max`);
                    break;
            }
        });
        return selects;
    }
    async saveReportExecution(tenantId, report, data, filters) {
        const savedReport = this.savedReportRepo.create({
            tenantId,
            reportId: report.id,
            name: `${report.name} - ${new Date().toISOString().split('T')[0]}`,
            configuration: report.configuration,
            data,
            status: 'GENERATED',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
        await this.savedReportRepo.save(savedReport);
    }
    async scheduleReport(tenantId, reportId, userId, scheduleDto) {
        const report = await this.getReportById(tenantId, reportId);
        const schedule = this.reportScheduleRepo.create({
            tenantId,
            reportId,
            ...scheduleDto,
            createdBy: userId,
            nextRunAt: this.calculateNextRunAt(scheduleDto),
        });
        const savedSchedule = await this.reportScheduleRepo.save(schedule);
        this.logger.log(`Report scheduled: ${savedSchedule.id} for report: ${reportId}`);
        return savedSchedule;
    }
    async getReportSchedules(tenantId, reportId) {
        return this.reportScheduleRepo.find({
            where: { tenantId, reportId, isActive: true },
            order: { createdAt: 'DESC' },
        });
    }
    async deleteSchedule(tenantId, scheduleId) {
        const schedule = await this.reportScheduleRepo.findOne({
            where: { id: scheduleId, tenantId },
        });
        if (!schedule) {
            throw new common_1.NotFoundException('Schedule not found');
        }
        await this.reportScheduleRepo.remove(schedule);
        this.logger.log(`Report schedule deleted: ${scheduleId}`);
    }
    calculateNextRunAt(scheduleDto) {
        const now = new Date();
        const [hours, minutes] = scheduleDto.scheduledTime.split(':').map(Number);
        let nextRun = new Date(now);
        nextRun.setHours(hours, minutes, 0, 0);
        if (nextRun <= now) {
            nextRun.setDate(nextRun.getDate() + 1);
        }
        switch (scheduleDto.frequency) {
            case 'WEEKLY':
                const daysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
                const targetDay = daysOfWeek.indexOf(scheduleDto.dayOfWeek);
                while (nextRun.getDay() !== targetDay) {
                    nextRun.setDate(nextRun.getDate() + 1);
                }
                break;
            case 'MONTHLY':
                if (scheduleDto.dayOfMonth) {
                    nextRun.setDate(scheduleDto.dayOfMonth);
                    if (nextRun.getDate() !== scheduleDto.dayOfMonth) {
                        nextRun.setDate(0);
                    }
                }
                break;
        }
        return nextRun;
    }
    async getReportMetrics(tenantId) {
        const totalReports = await this.reportConfigRepo.count({
            where: { tenantId, isActive: true },
        });
        const scheduledReports = await this.reportScheduleRepo.count({
            where: { tenantId, isActive: true },
        });
        const totalExecutions = await this.savedReportRepo.count({
            where: { tenantId },
        });
        return {
            totalReports,
            scheduledReports,
            totalExecutions,
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = ReportsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reports_entity_1.ReportConfig)),
    __param(1, (0, typeorm_1.InjectRepository)(reports_entity_1.ReportSchedule)),
    __param(2, (0, typeorm_1.InjectRepository)(reports_entity_1.SavedReport)),
    __param(3, (0, typeorm_1.InjectRepository)(dimensions_entity_1.DimDate)),
    __param(4, (0, typeorm_1.InjectRepository)(dimensions_entity_1.DimFacility)),
    __param(5, (0, typeorm_1.InjectRepository)(dimensions_entity_1.DimProvider)),
    __param(6, (0, typeorm_1.InjectRepository)(dimensions_entity_1.DimService)),
    __param(7, (0, typeorm_1.InjectRepository)(dimensions_entity_1.DimPayer)),
    __param(8, (0, typeorm_1.InjectRepository)(facts_entity_1.FactBilling)),
    __param(9, (0, typeorm_1.InjectRepository)(facts_entity_1.FactVisits)),
    __param(10, (0, typeorm_1.InjectRepository)(facts_entity_1.FactLabs)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map