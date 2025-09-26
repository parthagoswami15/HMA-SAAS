import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
  StreamableFile,
  Header,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ReportsService } from '../services/reports.service';
import { AnalyticsService } from '../services/analytics.service';
import { ExportService } from '../services/export.service';
import { DashboardService } from '../services/dashboard.service';
import {
  CreateReportDto,
  UpdateReportDto,
  ReportScheduleDto,
  CreateDashboardDto,
  UpdateDashboardDto,
  FinancialReportDto,
  ClinicalReportDto,
  OperationalReportDto,
  PatientReportDto,
  ExportRequestDto,
} from '../dto/reports.dto';

@ApiTags('Reports & Analytics')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly analyticsService: AnalyticsService,
    private readonly exportService: ExportService,
    private readonly dashboardService: DashboardService,
  ) {}

  // ==================== REPORT MANAGEMENT ====================

  @Post()
  @Roles('ADMIN', 'MANAGER', 'DOCTOR')
  @ApiOperation({ summary: 'Create a new report configuration' })
  @ApiResponse({ status: 201, description: 'Report created successfully' })
  @HttpCode(HttpStatus.CREATED)
  async createReport(@Body() createReportDto: CreateReportDto, @Request() req) {
    const tenantId = req.user.tenantId;
    const userId = req.user.id;

    return this.reportsService.createReport(tenantId, userId, createReportDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reports for tenant' })
  @ApiQuery({ name: 'category', required: false, enum: ['FINANCIAL', 'CLINICAL', 'OPERATIONAL', 'PATIENT', 'CUSTOM'] })
  @ApiQuery({ name: 'type', required: false, enum: ['TABULAR', 'CHART', 'DASHBOARD', 'KPI', 'TREND'] })
  @ApiQuery({ name: 'search', required: false })
  async getReports(@Query() query, @Request() req) {
    const tenantId = req.user.tenantId;
    const { category, type, search, page = 1, limit = 10 } = query;

    return this.reportsService.getReports(tenantId, {
      category,
      type,
      search,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get report by ID' })
  @ApiResponse({ status: 200, description: 'Report retrieved successfully' })
  async getReport(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    const tenantId = req.user.tenantId;
    return this.reportsService.getReportById(tenantId, id);
  }

  @Put(':id')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Update report configuration' })
  @ApiResponse({ status: 200, description: 'Report updated successfully' })
  async updateReport(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReportDto: UpdateReportDto,
    @Request() req,
  ) {
    const tenantId = req.user.tenantId;
    const userId = req.user.id;

    return this.reportsService.updateReport(tenantId, id, userId, updateReportDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete report configuration' })
  @ApiResponse({ status: 204, description: 'Report deleted successfully' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteReport(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    const tenantId = req.user.tenantId;
    await this.reportsService.deleteReport(tenantId, id);
  }

  // ==================== REPORT EXECUTION ====================

  @Post(':id/execute')
  @ApiOperation({ summary: 'Execute report and get data' })
  @ApiResponse({ status: 200, description: 'Report executed successfully' })
  async executeReport(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() filters: Record<string, any>,
    @Request() req,
  ) {
    const tenantId = req.user.tenantId;
    return this.reportsService.executeReport(tenantId, id, filters);
  }

  @Post(':id/schedule')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Schedule report for email delivery' })
  @ApiResponse({ status: 201, description: 'Report scheduled successfully' })
  @HttpCode(HttpStatus.CREATED)
  async scheduleReport(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() scheduleDto: ReportScheduleDto,
    @Request() req,
  ) {
    const tenantId = req.user.tenantId;
    const userId = req.user.id;

    return this.reportsService.scheduleReport(tenantId, id, userId, scheduleDto);
  }

  @Get(':id/schedules')
  @ApiOperation({ summary: 'Get report schedules' })
  async getReportSchedules(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    const tenantId = req.user.tenantId;
    return this.reportsService.getReportSchedules(tenantId, id);
  }

  @Delete('schedule/:scheduleId')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Delete report schedule' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSchedule(@Param('scheduleId', ParseUUIDPipe) scheduleId: string, @Request() req) {
    const tenantId = req.user.tenantId;
    await this.reportsService.deleteSchedule(tenantId, scheduleId);
  }

  // ==================== FINANCIAL REPORTS ====================

  @Get('financial/daily-collections')
  @ApiOperation({ summary: 'Get daily collections report' })
  async getDailyCollections(@Query() query: FinancialReportDto, @Request() req) {
    const tenantId = req.user.tenantId;
    return this.analyticsService.getDailyCollections(tenantId, query);
  }

  @Get('financial/revenue-analysis')
  @ApiOperation({ summary: 'Get revenue analysis report' })
  async getRevenueAnalysis(@Query() query: FinancialReportDto, @Request() req) {
    const tenantId = req.user.tenantId;
    return this.analyticsService.getRevenueAnalysis(tenantId, query);
  }

  @Get('financial/gst-report')
  @ApiOperation({ summary: 'Get GST report' })
  async getGSTReport(@Query() query: FinancialReportDto, @Request() req) {
    const tenantId = req.user.tenantId;
    return this.analyticsService.getGSTReport(tenantId, query);
  }

  @Get('financial/aging-analysis')
  @ApiOperation({ summary: 'Get aging analysis report' })
  async getAgingAnalysis(@Query() query: FinancialReportDto, @Request() req) {
    const tenantId = req.user.tenantId;
    return this.analyticsService.getAgingAnalysis(tenantId, query);
  }

  // ==================== CLINICAL REPORTS ====================

  @Get('clinical/case-mix')
  @ApiOperation({ summary: 'Get case mix analysis' })
  async getCaseMix(@Query() query: ClinicalReportDto, @Request() req) {
    const tenantId = req.user.tenantId;
    return this.analyticsService.getCaseMixAnalysis(tenantId, query);
  }

  @Get('clinical/infection-rates')
  @ApiOperation({ summary: 'Get infection rates report' })
  async getInfectionRates(@Query() query: ClinicalReportDto, @Request() req) {
    const tenantId = req.user.tenantId;
    return this.analyticsService.getInfectionRates(tenantId, query);
  }

  @Get('clinical/readmissions')
  @ApiOperation({ summary: 'Get readmissions report' })
  async getReadmissions(@Query() query: ClinicalReportDto, @Request() req) {
    const tenantId = req.user.tenantId;
    return this.analyticsService.getReadmissionsAnalysis(tenantId, query);
  }

  @Get('clinical/turnaround-times')
  @ApiOperation({ summary: 'Get turnaround times report' })
  async getTurnaroundTimes(@Query() query: ClinicalReportDto, @Request() req) {
    const tenantId = req.user.tenantId;
    return this.analyticsService.getTurnaroundTimes(tenantId, query);
  }

  // ==================== OPERATIONAL REPORTS ====================

  @Get('operational/occupancy')
  @ApiOperation({ summary: 'Get occupancy report' })
  async getOccupancy(@Query() query: OperationalReportDto, @Request() req) {
    const tenantId = req.user.tenantId;
    return this.analyticsService.getOccupancyReport(tenantId, query);
  }

  @Get('operational/length-of-stay')
  @ApiOperation({ summary: 'Get length of stay report' })
  async getLengthOfStay(@Query() query: OperationalReportDto, @Request() req) {
    const tenantId = req.user.tenantId;
    return this.analyticsService.getLengthOfStayAnalysis(tenantId, query);
  }

  @Get('operational/bed-turnover')
  @ApiOperation({ summary: 'Get bed turnover report' })
  async getBedTurnover(@Query() query: OperationalReportDto, @Request() req) {
    const tenantId = req.user.tenantId;
    return this.analyticsService.getBedTurnoverAnalysis(tenantId, query);
  }

  @Get('operational/pharmacy-expiry')
  @ApiOperation({ summary: 'Get pharmacy expiry report' })
  async getPharmacyExpiry(@Query() query: OperationalReportDto, @Request() req) {
    const tenantId = req.user.tenantId;
    return this.analyticsService.getPharmacyExpiryReport(tenantId, query);
  }

  // ==================== PATIENT REPORTS ====================

  @Get('patient/acquisition')
  @ApiOperation({ summary: 'Get patient acquisition report' })
  async getPatientAcquisition(@Query() query: PatientReportDto, @Request() req) {
    const tenantId = req.user.tenantId;
    return this.analyticsService.getPatientAcquisition(tenantId, query);
  }

  @Get('patient/retention')
  @ApiOperation({ summary: 'Get patient retention report' })
  async getPatientRetention(@Query() query: PatientReportDto, @Request() req) {
    const tenantId = req.user.tenantId;
    return this.analyticsService.getPatientRetention(tenantId, query);
  }

  @Get('patient/nps')
  @ApiOperation({ summary: 'Get NPS report' })
  async getNPS(@Query() query: PatientReportDto, @Request() req) {
    const tenantId = req.user.tenantId;
    return this.analyticsService.getNPSAnalysis(tenantId, query);
  }

  @Get('patient/referrals')
  @ApiOperation({ summary: 'Get referral sources report' })
  async getReferralSources(@Query() query: PatientReportDto, @Request() req) {
    const tenantId = req.user.tenantId;
    return this.analyticsService.getReferralSourcesAnalysis(tenantId, query);
  }

  // ==================== DASHBOARDS ====================

  @Post('dashboards')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Create dashboard' })
  @HttpCode(HttpStatus.CREATED)
  async createDashboard(@Body() createDashboardDto: CreateDashboardDto, @Request() req) {
    const tenantId = req.user.tenantId;
    const userId = req.user.id;

    return this.dashboardService.createDashboard(tenantId, userId, createDashboardDto);
  }

  @Get('dashboards')
  @ApiOperation({ summary: 'Get all dashboards' })
  async getDashboards(@Query() query, @Request() req) {
    const tenantId = req.user.tenantId;
    const { search, page = 1, limit = 10 } = query;

    return this.dashboardService.getDashboards(tenantId, {
      search,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  }

  @Get('dashboards/:id')
  @ApiOperation({ summary: 'Get dashboard by ID' })
  async getDashboard(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    const tenantId = req.user.tenantId;
    return this.dashboardService.getDashboard(tenantId, id);
  }

  @Put('dashboards/:id')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Update dashboard' })
  async updateDashboard(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDashboardDto: UpdateDashboardDto,
    @Request() req,
  ) {
    const tenantId = req.user.tenantId;
    const userId = req.user.id;

    return this.dashboardService.updateDashboard(tenantId, id, userId, updateDashboardDto);
  }

  @Delete('dashboards/:id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete dashboard' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDashboard(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    const tenantId = req.user.tenantId;
    await this.dashboardService.deleteDashboard(tenantId, id);
  }

  // ==================== EXPORTS ====================

  @Post('export')
  @ApiOperation({ summary: 'Export report data' })
  @ApiResponse({ status: 200, description: 'Export initiated successfully' })
  async exportReport(@Body() exportRequest: ExportRequestDto, @Request() req) {
    const tenantId = req.user.tenantId;
    const userId = req.user.id;

    return this.exportService.exportReport(tenantId, userId, exportRequest);
  }

  @Get('export/:exportId')
  @ApiOperation({ summary: 'Download exported file' })
  async downloadExport(
    @Param('exportId', ParseUUIDPipe) exportId: string,
    @Request() req,
  ): Promise<StreamableFile> {
    const tenantId = req.user.tenantId;
    const file = await this.exportService.downloadExport(tenantId, exportId);

    return new StreamableFile(file.buffer, {
      disposition: `attachment; filename="${file.fileName}"`,
      type: file.mimeType,
    });
  }

  @Get('export/:exportId/status')
  @ApiOperation({ summary: 'Get export status' })
  async getExportStatus(@Param('exportId', ParseUUIDPipe) exportId: string, @Request() req) {
    const tenantId = req.user.tenantId;
    return this.exportService.getExportStatus(tenantId, exportId);
  }

  // ==================== ANALYTICS ====================

  @Get('analytics/summary')
  @ApiOperation({ summary: 'Get analytics summary' })
  async getAnalyticsSummary(@Query() query, @Request() req) {
    const tenantId = req.user.tenantId;
    const { dateRange, metrics } = query;

    return this.analyticsService.getAnalyticsSummary(tenantId, {
      dateRange,
      metrics: metrics ? metrics.split(',') : undefined,
    });
  }

  @Get('analytics/trends')
  @ApiOperation({ summary: 'Get trend analysis' })
  async getTrendAnalysis(@Query() query, @Request() req) {
    const tenantId = req.user.tenantId;
    const { metric, period, groupBy } = query;

    return this.analyticsService.getTrendAnalysis(tenantId, metric, period, groupBy);
  }

  @Get('analytics/kpi')
  @ApiOperation({ summary: 'Get KPI dashboard' })
  async getKPIDashboard(@Query() query, @Request() req) {
    const tenantId = req.user.tenantId;
    const { category } = query;

    return this.analyticsService.getKPIDashboard(tenantId, category);
  }
}
