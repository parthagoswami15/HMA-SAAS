import { Controller, Get, Post, Body, Param, Query, UseGuards, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { LabReportsService, LabReport } from '../services/lab-reports.service';
import { LabReportDto, GeneratePatientReportDto, GenerateCumulativeReportDto, GenerateWorkloadReportDto, GenerateQCReportDto, ExportReportDto, WorkloadReportDto, QCReportDto } from '../dto/lab-reports.dto';
import { LabAuthGuard } from '../guards/lab-auth.guard';

@ApiTags('Laboratory Reports')
@Controller('lab/reports')
@UseGuards(LabAuthGuard)
@ApiBearerAuth()
export class LabReportsController {
  constructor(private readonly labReportsService: LabReportsService) {}

  @Post('patient')
  @ApiOperation({ summary: 'Generate patient lab report' })
  @ApiResponse({ status: 200, description: 'Patient report generated successfully' })
  async generatePatientReport(
    @Body() dto: GeneratePatientReportDto,
  ): Promise<LabReportDto> {
    const report = await this.labReportsService.generatePatientReport(dto.orderId);
    return {
      ...report,
      generatedAt: new Date(),
    };
  }

  @Post('cumulative')
  @ApiOperation({ summary: 'Generate cumulative lab report for patient' })
  @ApiResponse({ status: 200, description: 'Cumulative report generated successfully' })
  async generateCumulativeReport(
    @Body() dto: GenerateCumulativeReportDto,
  ): Promise<LabReportDto> {
    const report = await this.labReportsService.generateCumulativeReport(
      dto.patientId,
      dto.startDate,
      dto.endDate
    );
    return {
      ...report,
      generatedAt: new Date(),
    };
  }

  @Post('workload')
  @ApiOperation({ summary: 'Generate workload report' })
  @ApiResponse({ status: 200, description: 'Workload report generated successfully' })
  async generateWorkloadReport(
    @Body() dto: GenerateWorkloadReportDto,
  ): Promise<WorkloadReportDto> {
    return this.labReportsService.generateWorkloadReport(
      dto.tenantId,
      dto.startDate,
      dto.endDate
    );
  }

  @Post('qc')
  @ApiOperation({ summary: 'Generate QC report' })
  @ApiResponse({ status: 200, description: 'QC report generated successfully' })
  async generateQCReport(
    @Body() dto: GenerateQCReportDto,
  ): Promise<QCReportDto> {
    return this.labReportsService.generateQCReport(
      dto.analyzerId,
      dto.startDate,
      dto.endDate
    );
  }

  @Post('export/:format')
  @ApiOperation({ summary: 'Export report to specified format' })
  @ApiResponse({ status: 200, description: 'Report exported successfully' })
  async exportReport(
    @Param('format') format: 'PDF' | 'CSV' | 'EXCEL',
    @Body() dto: ExportReportDto,
    @Res() res: Response,
  ): Promise<void> {
    const buffer = await this.labReportsService.exportReportToPDF(dto.reportId, format);

    res.set({
      'Content-Type': this.getContentType(format),
      'Content-Disposition': `attachment; filename="lab-report-${dto.reportId}.${format.toLowerCase()}"`,
    });

    res.send(buffer);
  }

  @Get('patient/:orderId')
  @ApiOperation({ summary: 'Get patient report by order ID' })
  @ApiResponse({ status: 200, description: 'Patient report retrieved successfully' })
  async getPatientReport(@Param('orderId') orderId: string): Promise<LabReportDto> {
    const report = await this.labReportsService.generatePatientReport(orderId);
    return {
      ...report,
      generatedAt: new Date(),
    };
  }

  @Get('cumulative/:patientId')
  @ApiOperation({ summary: 'Get cumulative report for patient' })
  @ApiResponse({ status: 200, description: 'Cumulative report retrieved successfully' })
  async getCumulativeReport(
    @Param('patientId') patientId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<LabReportDto> {
    const report = await this.labReportsService.generateCumulativeReport(
      patientId,
      new Date(startDate),
      new Date(endDate)
    );
    return {
      ...report,
      generatedAt: new Date(),
    };
  }

  @Get('workload/:tenantId')
  @ApiOperation({ summary: 'Get workload report for tenant' })
  @ApiResponse({ status: 200, description: 'Workload report retrieved successfully' })
  async getWorkloadReport(
    @Param('tenantId') tenantId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<WorkloadReportDto> {
    return this.labReportsService.generateWorkloadReport(
      tenantId,
      new Date(startDate),
      new Date(endDate)
    );
  }

  @Get('qc/:analyzerId')
  @ApiOperation({ summary: 'Get QC report for analyzer' })
  @ApiResponse({ status: 200, description: 'QC report retrieved successfully' })
  async getQCReport(
    @Param('analyzerId') analyzerId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<QCReportDto> {
    return this.labReportsService.generateQCReport(
      analyzerId,
      new Date(startDate),
      new Date(endDate)
    );
  }

  @Get('types')
  @ApiOperation({ summary: 'Get available report types' })
  @ApiResponse({ status: 200, description: 'Report types retrieved successfully' })
  async getReportTypes(): Promise<{ types: string[] }> {
    return {
      types: [
        'Patient Report',
        'Cumulative Report',
        'Workload Report',
        'QC Report',
        'TAT Report',
        'Panic Alert Report',
      ],
    };
  }

  private getContentType(format: string): string {
    switch (format) {
      case 'PDF':
        return 'application/pdf';
      case 'CSV':
        return 'text/csv';
      case 'EXCEL':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      default:
        return 'application/pdf';
    }
  }
}
