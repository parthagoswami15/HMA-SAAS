import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LabTatService } from '../services/lab-tat.service';
import { TATConfigDto, TATMetricsDto, CreateTATConfigDto, UpdateTATConfigDto, TATPerformanceDto, SLAViolationDto, STATOrderAlertDto } from '../dto/lab-tat.dto';
import { LabAuthGuard } from '../guards/lab-auth.guard';

@ApiTags('Laboratory TAT Management')
@Controller('lab/tat')
@UseGuards(LabAuthGuard)
@ApiBearerAuth()
export class LabTatController {
  constructor(private readonly labTatService: LabTatService) {}

  @Get('calculate/:orderId')
  @ApiOperation({ summary: 'Calculate TAT for an order' })
  @ApiResponse({ status: 200, description: 'TAT calculated successfully' })
  async calculateTAT(@Param('orderId') orderId: string): Promise<TATMetricsDto[]> {
    return this.labTatService.calculateTAT(orderId);
  }

  @Get('performance')
  @ApiOperation({ summary: 'Get TAT performance metrics' })
  @ApiResponse({ status: 200, description: 'TAT performance retrieved successfully' })
  async getTATPerformance(
    @Query('tenantId') tenantId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<TATPerformanceDto> {
    return this.labTatService.getTATPerformance(
      tenantId,
      new Date(startDate),
      new Date(endDate)
    );
  }

  @Get('violations')
  @ApiOperation({ summary: 'Get SLA violations' })
  @ApiResponse({ status: 200, description: 'SLA violations retrieved successfully' })
  async checkSLAViolations(@Query('tenantId') tenantId: string): Promise<SLAViolationDto[]> {
    return this.labTatService.checkSLAViolations(tenantId);
  }

  @Get('configs')
  @ApiOperation({ summary: 'Get TAT configurations' })
  @ApiResponse({ status: 200, description: 'TAT configurations retrieved successfully' })
  async getTATConfigs(@Query('tenantId') tenantId: string): Promise<TATConfigDto[]> {
    return this.labTatService.getTATConfigs(tenantId);
  }

  @Put('configs/:id')
  @ApiOperation({ summary: 'Update TAT configuration' })
  @ApiResponse({ status: 200, description: 'TAT configuration updated successfully' })
  async updateTATConfig(
    @Param('id') id: string,
    @Body() configDto: UpdateTATConfigDto,
  ): Promise<TATConfigDto> {
    return this.labTatService.updateTATConfig(id, configDto);
  }

  @Get('stat/alerts')
  @ApiOperation({ summary: 'Get STAT orders requiring attention' })
  @ApiResponse({ status: 200, description: 'STAT orders retrieved successfully' })
  async getSTATOrdersRequiringAttention(): Promise<STATOrderAlertDto[]> {
    const orders = await this.labTatService.getSTATOrdersRequiringAttention();
    return orders.map(order => ({
      orderId: order.order.id,
      patientName: order.order.patient?.name || 'Unknown',
      testName: order.violation.testName,
      minutesOverdue: order.minutesOverdue,
      priority: order.order.priority,
      orderedAt: order.order.createdAt,
    }));
  }

  @Get('violations/count')
  @ApiOperation({ summary: 'Get count of SLA violations' })
  @ApiResponse({ status: 200, description: 'SLA violations count retrieved successfully' })
  async getSLAViolationsCount(@Query('tenantId') tenantId: string): Promise<{ count: number }> {
    const violations = await this.labTatService.checkSLAViolations(tenantId);
    return { count: violations.length };
  }

  @Get('performance/summary')
  @ApiOperation({ summary: 'Get TAT performance summary' })
  @ApiResponse({ status: 200, description: 'TAT performance summary retrieved successfully' })
  async getTATPerformanceSummary(
    @Query('tenantId') tenantId: string,
    @Query('days') days: number = 30,
  ): Promise<any> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const performance = await this.labTatService.getTATPerformance(tenantId, startDate, endDate);

    return {
      period: `${days} days`,
      summary: performance.summary,
      topPerformers: this.getTopPerformers(performance),
      areasForImprovement: this.getAreasForImprovement(performance),
    };
  }

  private getTopPerformers(performance: TATPerformanceDto): any[] {
    const performers = [];

    for (const [priority, metrics] of Object.entries(performance.priorityBreakdown)) {
      if (metrics.count > 0) {
        performers.push({
          priority,
          onTimePercentage: metrics.onTimePercentage,
          averageTAT: metrics.averageTAT,
        });
      }
    }

    return performers.sort((a, b) => b.onTimePercentage - a.onTimePercentage);
  }

  private getAreasForImprovement(performance: TATPerformanceDto): any[] {
    const areas = [];

    for (const [priority, metrics] of Object.entries(performance.priorityBreakdown)) {
      if (metrics.onTimePercentage < 80) {
        areas.push({
          priority,
          onTimePercentage: metrics.onTimePercentage,
          averageTAT: metrics.averageTAT,
          improvementNeeded: 80 - metrics.onTimePercentage,
        });
      }
    }

    return areas.sort((a, b) => a.onTimePercentage - b.onTimePercentage);
  }
}
