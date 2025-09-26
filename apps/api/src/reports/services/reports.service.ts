import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportConfig, ReportSchedule, SavedReport } from '../entities/reports.entity';
import { DimDate, DimFacility, DimProvider, DimService, DimPayer } from '../entities/dimensions.entity';
import { FactBilling, FactVisits, FactLabs } from '../entities/facts.entity';
import {
  CreateReportDto,
  UpdateReportDto,
  ReportScheduleDto,
} from '../dto/reports.dto';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    @InjectRepository(ReportConfig)
    private readonly reportConfigRepo: Repository<ReportConfig>,
    @InjectRepository(ReportSchedule)
    private readonly reportScheduleRepo: Repository<ReportSchedule>,
    @InjectRepository(SavedReport)
    private readonly savedReportRepo: Repository<SavedReport>,
    @InjectRepository(DimDate)
    private readonly dimDateRepo: Repository<DimDate>,
    @InjectRepository(DimFacility)
    private readonly dimFacilityRepo: Repository<DimFacility>,
    @InjectRepository(DimProvider)
    private readonly dimProviderRepo: Repository<DimProvider>,
    @InjectRepository(DimService)
    private readonly dimServiceRepo: Repository<DimService>,
    @InjectRepository(DimPayer)
    private readonly dimPayerRepo: Repository<DimPayer>,
    @InjectRepository(FactBilling)
    private readonly factBillingRepo: Repository<FactBilling>,
    @InjectRepository(FactVisits)
    private readonly factVisitsRepo: Repository<FactVisits>,
    @InjectRepository(FactLabs)
    private readonly factLabsRepo: Repository<FactLabs>,
  ) {}

  // ==================== REPORT CONFIGURATION ====================

  async createReport(tenantId: string, userId: string, createReportDto: CreateReportDto): Promise<ReportConfig> {
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
    } catch (error) {
      this.logger.error(`Failed to create report: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to create report');
    }
  }

  async getReports(tenantId: string, options: {
    category?: string;
    type?: string;
    search?: string;
    page: number;
    limit: number;
  }): Promise<{ reports: ReportConfig[]; total: number; page: number; limit: number }> {
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
      queryBuilder.andWhere('(report.name ILIKE :search OR report.description ILIKE :search)',
        { search: `%${search}%` });
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

  async getReportById(tenantId: string, id: string): Promise<ReportConfig> {
    const report = await this.reportConfigRepo.findOne({
      where: { id, tenantId, isActive: true },
      relations: ['schedules', 'savedReports'],
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return report;
  }

  async updateReport(
    tenantId: string,
    id: string,
    userId: string,
    updateReportDto: UpdateReportDto,
  ): Promise<ReportConfig> {
    const report = await this.getReportById(tenantId, id);

    Object.assign(report, updateReportDto, { updatedBy: userId });

    const updatedReport = await this.reportConfigRepo.save(report);
    this.logger.log(`Report updated: ${id} for tenant: ${tenantId}`);
    return updatedReport;
  }

  async deleteReport(tenantId: string, id: string): Promise<void> {
    const report = await this.getReportById(tenantId, id);

    report.isActive = false;
    await this.reportConfigRepo.save(report);

    // Soft delete - don't actually remove from database
    this.logger.log(`Report soft deleted: ${id} for tenant: ${tenantId}`);
  }

  // ==================== REPORT EXECUTION ====================

  async executeReport(tenantId: string, reportId: string, filters: Record<string, any>): Promise<any> {
    const report = await this.getReportById(tenantId, reportId);

    // Update usage statistics
    await this.reportConfigRepo.update(
      { id: reportId },
      {
        usageCount: () => 'usageCount + 1',
        lastUsedAt: new Date(),
      }
    );

    // Execute report based on configuration
    const result = await this.executeReportQuery(report, filters);

    // Save execution result if needed
    await this.saveReportExecution(tenantId, report, result, filters);

    return result;
  }

  private async executeReportQuery(report: ReportConfig, filters: Record<string, any>): Promise<any> {
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
        throw new BadRequestException('Invalid data source');
    }
  }

  private async executeBillingQuery(config: any, filters: Record<string, any>): Promise<any> {
    const queryBuilder = this.factBillingRepo.createQueryBuilder('billing')
      .leftJoinAndSelect('billing.date', 'date')
      .leftJoinAndSelect('billing.facility', 'facility')
      .leftJoinAndSelect('billing.provider', 'provider')
      .leftJoinAndSelect('billing.service', 'service')
      .leftJoinAndSelect('billing.payer', 'payer');

    // Apply filters
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

    // Apply aggregations
    const selectFields = this.buildSelectFields(config.aggregations, 'billing');

    queryBuilder.select(selectFields);

    // Apply grouping
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

    // Apply ordering
    if (config.orderBy) {
      Object.entries(config.orderBy).forEach(([field, direction]) => {
        queryBuilder.orderBy(field, direction);
      });
    }

    // Apply limit
    if (config.limit) {
      queryBuilder.limit(config.limit);
    }

    return queryBuilder.getRawMany();
  }

  private async executeVisitsQuery(config: any, filters: Record<string, any>): Promise<any> {
    // Similar implementation for visits
    const queryBuilder = this.factVisitsRepo.createQueryBuilder('visit')
      .leftJoinAndSelect('visit.date', 'date')
      .leftJoinAndSelect('visit.facility', 'facility')
      .leftJoinAndSelect('visit.provider', 'provider')
      .leftJoinAndSelect('visit.service', 'service');

    // Apply filters and aggregations similar to billing
    return queryBuilder.getRawMany();
  }

  private async executeLabsQuery(config: any, filters: Record<string, any>): Promise<any> {
    // Similar implementation for labs
    const queryBuilder = this.factLabsRepo.createQueryBuilder('lab')
      .leftJoinAndSelect('lab.date', 'date')
      .leftJoinAndSelect('lab.facility', 'facility')
      .leftJoinAndSelect('lab.orderingProvider', 'orderingProvider')
      .leftJoinAndSelect('lab.performingProvider', 'performingProvider')
      .leftJoinAndSelect('lab.service', 'service')
      .leftJoinAndSelect('lab.payer', 'payer');

    // Apply filters and aggregations similar to billing
    return queryBuilder.getRawMany();
  }

  private async executePatientsQuery(config: any, filters: Record<string, any>): Promise<any> {
    // Implementation for patient data
    return [];
  }

  private async executeStaffQuery(config: any, filters: Record<string, any>): Promise<any> {
    // Implementation for staff data
    return [];
  }

  private async executeInventoryQuery(config: any, filters: Record<string, any>): Promise<any> {
    // Implementation for inventory data
    return [];
  }

  private buildSelectFields(aggregations: Record<string, string>, tableAlias: string): string[] {
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

  private async saveReportExecution(
    tenantId: string,
    report: ReportConfig,
    data: any,
    filters: Record<string, any>,
  ): Promise<void> {
    // Save execution result to saved_reports table
    const savedReport = this.savedReportRepo.create({
      tenantId,
      reportId: report.id,
      name: `${report.name} - ${new Date().toISOString().split('T')[0]}`,
      configuration: report.configuration,
      data,
      status: 'GENERATED',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    await this.savedReportRepo.save(savedReport);
  }

  // ==================== REPORT SCHEDULING ====================

  async scheduleReport(
    tenantId: string,
    reportId: string,
    userId: string,
    scheduleDto: ReportScheduleDto,
  ): Promise<ReportSchedule> {
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

  async getReportSchedules(tenantId: string, reportId: string): Promise<ReportSchedule[]> {
    return this.reportScheduleRepo.find({
      where: { tenantId, reportId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async deleteSchedule(tenantId: string, scheduleId: string): Promise<void> {
    const schedule = await this.reportScheduleRepo.findOne({
      where: { id: scheduleId, tenantId },
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    await this.reportScheduleRepo.remove(schedule);
    this.logger.log(`Report schedule deleted: ${scheduleId}`);
  }

  private calculateNextRunAt(scheduleDto: ReportScheduleDto): Date {
    const now = new Date();
    const [hours, minutes] = scheduleDto.scheduledTime.split(':').map(Number);

    let nextRun = new Date(now);
    nextRun.setHours(hours, minutes, 0, 0);

    // If the time has already passed today, schedule for tomorrow
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
          // If day is beyond current month, set to last day of month
          if (nextRun.getDate() !== scheduleDto.dayOfMonth) {
            nextRun.setDate(0); // Last day of previous month
          }
        }
        break;
    }

    return nextRun;
  }

  // ==================== UTILITY METHODS ====================

  async getReportMetrics(tenantId: string): Promise<any> {
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
}
