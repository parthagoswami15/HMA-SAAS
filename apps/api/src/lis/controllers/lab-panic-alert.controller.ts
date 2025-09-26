import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LabPanicAlertService, PanicThreshold } from '../services/lab-panic-alert.service';
import { PanicAlertDto, PanicThresholdDto, CreatePanicAlertDto, AcknowledgePanicAlertDto, PanicAlertStatisticsDto, UpdatePanicThresholdDto } from '../dto/lab-panic-alert.dto';
import { LabAuthGuard } from '../guards/lab-auth.guard';

@ApiTags('Laboratory Panic Alerts')
@Controller('lab/panic-alerts')
@UseGuards(LabAuthGuard)
@ApiBearerAuth()
export class LabPanicAlertController {
  constructor(private readonly labPanicAlertService: LabPanicAlertService) {}

  @Post('check/:orderId')
  @ApiOperation({ summary: 'Check for panic alerts in order results' })
  @ApiResponse({ status: 200, description: 'Panic alerts checked successfully' })
  async checkForPanicAlerts(
    @Param('orderId') orderId: string,
    @Body('results') results: any[],
  ): Promise<{ message: string; alerts: PanicAlertDto[] }> {
    const alerts = await this.labPanicAlertService.checkForPanicAlerts(orderId, results);
    return {
      message: `Checked ${results.length} results. Found ${alerts.length} panic alerts.`,
      alerts,
    };
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active panic alerts' })
  @ApiResponse({ status: 200, description: 'Active panic alerts retrieved successfully' })
  async getActivePanicAlerts(@Query('tenantId') tenantId: string): Promise<PanicAlertDto[]> {
    return this.labPanicAlertService.getActivePanicAlerts(tenantId);
  }

  @Put(':id/acknowledge')
  @ApiOperation({ summary: 'Acknowledge a panic alert' })
  @ApiResponse({ status: 200, description: 'Panic alert acknowledged successfully' })
  async acknowledgePanicAlert(
    @Param('id') alertId: string,
    @Body() ackDto: AcknowledgePanicAlertDto,
  ): Promise<{ message: string }> {
    await this.labPanicAlertService.acknowledgePanicAlert(alertId, ackDto.acknowledgedBy);
    return { message: 'Panic alert acknowledged successfully' };
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get panic alerts for a patient' })
  @ApiResponse({ status: 200, description: 'Patient panic alerts retrieved successfully' })
  async getPanicAlertsByPatient(@Param('patientId') patientId: string): Promise<PanicAlertDto[]> {
    return this.labPanicAlertService.getPanicAlertsByPatient(patientId);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get panic alert statistics' })
  @ApiResponse({ status: 200, description: 'Panic alert statistics retrieved successfully' })
  async getPanicAlertStatistics(
    @Query('tenantId') tenantId: string,
    @Query('days') days?: number,
  ): Promise<PanicAlertStatisticsDto> {
    return this.labPanicAlertService.getPanicAlertStatistics(tenantId, days);
  }

  @Get('thresholds')
  @ApiOperation({ summary: 'Get panic thresholds' })
  @ApiResponse({ status: 200, description: 'Panic thresholds retrieved successfully' })
  async getPanicThresholds(): Promise<PanicThresholdDto[]> {
    return this.labPanicAlertService.getPanicThresholds();
  }

  @Put('thresholds/:analyte')
  @ApiOperation({ summary: 'Update panic threshold' })
  @ApiResponse({ status: 200, description: 'Panic threshold updated successfully' })
  async updatePanicThreshold(
    @Param('analyte') analyte: string,
    @Body() thresholdDto: UpdatePanicThresholdDto,
  ): Promise<PanicThresholdDto> {
    return this.labPanicAlertService.updatePanicThreshold(analyte, thresholdDto);
  }

  @Post('evaluate/:orderId')
  @ApiOperation({ summary: 'Evaluate order for panic alerts and send notifications' })
  @ApiResponse({ status: 200, description: 'Panic alert evaluation completed successfully' })
  async evaluatePanicAlerts(
    @Param('orderId') orderId: string,
    @Body('results') results: any[],
  ): Promise<{ message: string; alertsCreated: number }> {
    const alerts = await this.labPanicAlertService.checkForPanicAlerts(orderId, results);

    // This would automatically trigger notifications
    return {
      message: `Panic alert evaluation completed. Created ${alerts.length} alerts.`,
      alertsCreated: alerts.length,
    };
  }

  @Get('pending/count')
  @ApiOperation({ summary: 'Get count of pending panic alerts' })
  @ApiResponse({ status: 200, description: 'Pending panic alerts count retrieved successfully' })
  async getPendingPanicAlertsCount(@Query('tenantId') tenantId: string): Promise<{ count: number }> {
    const alerts = await this.labPanicAlertService.getActivePanicAlerts(tenantId);
    return { count: alerts.length };
  }
}
