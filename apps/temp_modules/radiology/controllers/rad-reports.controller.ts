import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RadReportsService } from '../services/rad-reports.service';
import {
  CreateRadReportDto,
  UpdateRadReportDto,
  SignRadReportDto,
  RadReportFilterDto,
  RadReportListDto,
} from '../dto/rad-reports.dto';

@ApiTags('Radiology - Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('radiology/reports')
export class RadReportsController {
  constructor(private readonly radReportsService: RadReportsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new radiology report' })
  @ApiResponse({ status: 201, description: 'Report created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Study not found' })
  async create(@Body() createDto: CreateRadReportDto, @Request() req) {
    return this.radReportsService.create(createDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all radiology reports with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Reports retrieved successfully' })
  async findAll(
    @Query() filterDto: RadReportFilterDto,
    @Query() listDto: RadReportListDto,
  ) {
    return this.radReportsService.findAll(filterDto, listDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get radiology report by ID' })
  @ApiResponse({ status: 200, description: 'Report retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  async findOne(@Param('id') id: string) {
    return this.radReportsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update radiology report' })
  @ApiResponse({ status: 200, description: 'Report updated successfully' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateRadReportDto) {
    return this.radReportsService.update(id, updateDto);
  }

  @Post(':id/sign')
  @ApiOperation({ summary: 'Sign radiology report' })
  @ApiResponse({ status: 200, description: 'Report signed successfully' })
  @ApiResponse({ status: 400, description: 'Report cannot be signed' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  async signReport(@Param('id') id: string, @Body() signDto: SignRadReportDto, @Request() req) {
    return this.radReportsService.signReport(id, signDto, req.user.id);
  }

  @Get('study/:studyId/all')
  @ApiOperation({ summary: 'Get all reports for a study' })
  @ApiResponse({ status: 200, description: 'Reports retrieved successfully' })
  async getReportsByStudy(@Param('studyId') studyId: string) {
    return this.radReportsService.getReportsByStudy(studyId);
  }

  @Get('patient/:patientId/all')
  @ApiOperation({ summary: 'Get all reports for a patient' })
  @ApiResponse({ status: 200, description: 'Reports retrieved successfully' })
  async getReportsByPatient(@Param('patientId') patientId: string) {
    return this.radReportsService.getReportsByPatient(patientId);
  }

  @Get(':id/structured-data')
  @ApiOperation({ summary: 'Get structured report data' })
  @ApiResponse({ status: 200, description: 'Structured data retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  async getStructuredReportData(@Param('id') reportId: string) {
    return this.radReportsService.getStructuredReportData(reportId);
  }

  @Put(':id/structured-findings')
  @ApiOperation({ summary: 'Update structured findings' })
  @ApiResponse({ status: 200, description: 'Structured findings updated successfully' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  async updateStructuredFindings(
    @Param('id') id: string,
    @Body() findings: Record<string, any>,
  ) {
    return this.radReportsService.updateStructuredFindings(id, findings);
  }

  @Get('stats/overview')
  @ApiOperation({ summary: 'Get reports statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStats(@Request() req) {
    return this.radReportsService.getStats(req.user.tenantId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete radiology report' })
  @ApiResponse({ status: 204, description: 'Report deleted successfully' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  async remove(@Param('id') id: string) {
    // Implementation would depend on business rules
    // For now, we'll just return success
    throw new Error('Delete functionality not implemented');
  }
}
