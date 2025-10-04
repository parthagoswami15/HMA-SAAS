import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LabDeltaCheckService, DeltaCheck, DeltaCheckConfig } from '../services/lab-delta-check.service';
import { DeltaCheckDto, DeltaCheckConfigDto, CreateDeltaCheckConfigDto, UpdateDeltaCheckConfigDto, DeltaCheckAlertDto } from '../dto/lab-delta-check.dto';
import { LabAuthGuard } from '../guards/lab-auth.guard';

@ApiTags('Laboratory Delta Checks')
@Controller('lab/delta-checks')
@UseGuards(LabAuthGuard)
@ApiBearerAuth()
export class LabDeltaCheckController {
  constructor(private readonly labDeltaCheckService: LabDeltaCheckService) {}

  @Post('evaluate/:patientId')
  @ApiOperation({ summary: 'Perform delta checks for a patient' })
  @ApiResponse({ status: 200, description: 'Delta checks performed successfully' })
  async performDeltaChecks(
    @Param('patientId') patientId: string,
    @Body('results') results: any[],
  ): Promise<DeltaCheckDto[]> {
    return this.labDeltaCheckService.performDeltaChecks(patientId, results);
  }

  @Get('history/:patientId/:analyte')
  @ApiOperation({ summary: 'Get delta check history for an analyte' })
  @ApiResponse({ status: 200, description: 'Delta check history retrieved successfully' })
  async getDeltaCheckHistory(
    @Param('patientId') patientId: string,
    @Param('analyte') analyte: string,
    @Query('limit') limit?: number,
  ): Promise<any[]> {
    return this.labDeltaCheckService.getDeltaCheckHistory(patientId, analyte, limit);
  }

  @Post('alerts')
  @ApiOperation({ summary: 'Create a delta check alert' })
  @ApiResponse({ status: 201, description: 'Delta check alert created successfully' })
  async createDeltaCheckAlert(@Body() alertDto: DeltaCheckAlertDto): Promise<{ message: string }> {
    await this.labDeltaCheckService.createDeltaCheckAlert(
      alertDto.patientId,
      {
        analyte: alertDto.analyte,
        currentValue: alertDto.currentValue,
        previousValue: alertDto.previousValue,
        delta: alertDto.currentValue - alertDto.previousValue,
        deltaPercentage: alertDto.deltaPercentage,
        threshold: 20,
        isSignificant: alertDto.deltaPercentage > 20,
        previousDate: new Date(),
        currentDate: new Date(),
      }
    );

    return { message: 'Delta check alert created successfully' };
  }

  @Get('configs')
  @ApiOperation({ summary: 'Get all delta check configurations' })
  @ApiResponse({ status: 200, description: 'Delta check configurations retrieved successfully' })
  async getDeltaCheckConfigs(): Promise<DeltaCheckConfigDto[]> {
    return this.labDeltaCheckService.getDeltaCheckConfigs();
  }

  @Put('configs/:analyte')
  @ApiOperation({ summary: 'Update delta check configuration' })
  @ApiResponse({ status: 200, description: 'Delta check configuration updated successfully' })
  async updateDeltaCheckConfig(
    @Param('analyte') analyte: string,
    @Body() configDto: UpdateDeltaCheckConfigDto,
  ): Promise<DeltaCheckConfigDto> {
    return this.labDeltaCheckService.updateDeltaCheckConfig(analyte, configDto);
  }

  @Get('significant/:patientId')
  @ApiOperation({ summary: 'Get significant delta checks for a patient' })
  @ApiResponse({ status: 200, description: 'Significant delta checks retrieved successfully' })
  async getSignificantDeltaChecks(
    @Param('patientId') patientId: string,
    @Query('days') days?: number,
  ): Promise<DeltaCheckDto[]> {
    return this.labDeltaCheckService.getSignificantDeltaChecks(patientId, days);
  }

  @Post('evaluate-order/:orderId')
  @ApiOperation({ summary: 'Perform delta checks for an order' })
  @ApiResponse({ status: 200, description: 'Delta checks for order completed successfully' })
  async performDeltaChecksForOrder(
    @Param('orderId') orderId: string,
  ): Promise<{ message: string; deltaChecks: DeltaCheckDto[] }> {
    // Get the order and patient
    const order = await this.labDeltaCheckService['prisma'].labOrder.findUnique({
      where: { id: orderId },
      include: { patient: true, results: true },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Get current results for this order
    const currentResults = await this.labDeltaCheckService['prisma'].labResult.findMany({
      where: { orderId },
    });

    // Perform delta checks
    const deltaChecks = await this.labDeltaCheckService.performDeltaChecks(
      order.patientId,
      currentResults
    );

    // Create alerts for significant changes
    for (const deltaCheck of deltaChecks) {
      await this.labDeltaCheckService.createDeltaCheckAlert(order.patientId, deltaCheck);
    }

    return {
      message: `Delta checks completed. Found ${deltaChecks.length} significant changes.`,
      deltaChecks,
    };
  }
}
