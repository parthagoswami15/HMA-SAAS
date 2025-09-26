import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LabQcService } from '../services/lab-qc.service';
import { CreateQcRunDto, QcRunResponseDto } from '../dto/lab-analyzer.dto';
import { LabAuthGuard } from '../guards/lab-auth.guard';

@ApiTags('Laboratory Quality Control')
@Controller('lab/qc')
@UseGuards(LabAuthGuard)
@ApiBearerAuth()
export class LabQcController {
  constructor(private readonly labQcService: LabQcService) {}

  @Post('runs')
  @ApiOperation({ summary: 'Create a new QC run' })
  @ApiResponse({ status: 201, description: 'QC run created successfully' })
  async createQcRun(@Body() createQcRunDto: CreateQcRunDto): Promise<QcRunResponseDto> {
    return this.labQcService.createQcRun(createQcRunDto);
  }

  @Get('runs')
  @ApiOperation({ summary: 'Get all QC runs' })
  @ApiResponse({ status: 200, description: 'QC runs retrieved successfully' })
  async getAllQcRuns(
    @Query('analyzerId') analyzerId?: string,
    @Query('isPassed') isPassed?: boolean,
    @Query('operator') operator?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ): Promise<QcRunResponseDto[]> {
    return this.labQcService.getAllQcRuns({
      analyzerId,
      isPassed: isPassed !== undefined ? isPassed : undefined,
      operator,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
    });
  }

  @Get('runs/:id')
  @ApiOperation({ summary: 'Get QC run by ID' })
  @ApiResponse({ status: 200, description: 'QC run retrieved successfully' })
  async getQcRunById(@Param('id') id: string): Promise<QcRunResponseDto> {
    return this.labQcService.getQcRunById(id);
  }

  @Put('runs/:id')
  @ApiOperation({ summary: 'Update QC run' })
  @ApiResponse({ status: 200, description: 'QC run updated successfully' })
  async updateQcRun(
    @Param('id') id: string,
    @Body() updateData: any,
  ): Promise<QcRunResponseDto> {
    return this.labQcService.updateQcRun(id, updateData);
  }

  @Delete('runs/:id')
  @ApiOperation({ summary: 'Delete QC run' })
  @ApiResponse({ status: 200, description: 'QC run deleted successfully' })
  async deleteQcRun(@Param('id') id: string): Promise<{ message: string }> {
    return this.labQcService.deleteQcRun(id);
  }

  @Post('runs/:id/evaluate')
  @ApiOperation({ summary: 'Evaluate QC run results' })
  @ApiResponse({ status: 200, description: 'QC run evaluated successfully' })
  async evaluateQcRun(@Param('id') id: string): Promise<QcRunResponseDto> {
    return this.labQcService.evaluateQcRun(id);
  }

  @Get('runs/analyzer/:analyzerId')
  @ApiOperation({ summary: 'Get QC runs by analyzer' })
  @ApiResponse({ status: 200, description: 'QC runs retrieved successfully' })
  async getQcRunsByAnalyzer(@Param('analyzerId') analyzerId: string): Promise<QcRunResponseDto[]> {
    return this.labQcService.getQcRunsByAnalyzer(analyzerId);
  }

  @Get('runs/date-range')
  @ApiOperation({ summary: 'Get QC runs by date range' })
  @ApiResponse({ status: 200, description: 'QC runs retrieved successfully' })
  async getQcRunsByDateRange(
    @Query('dateFrom') dateFrom: string,
    @Query('dateTo') dateTo: string,
  ): Promise<QcRunResponseDto[]> {
    return this.labQcService.getQcRunsByDateRange(new Date(dateFrom), new Date(dateTo));
  }

  @Get('runs/failed/all')
  @ApiOperation({ summary: 'Get all failed QC runs' })
  @ApiResponse({ status: 200, description: 'Failed QC runs retrieved successfully' })
  async getFailedQcRuns(): Promise<QcRunResponseDto[]> {
    return this.labQcService.getFailedQcRuns();
  }

  @Get('runs/recent/:days')
  @ApiOperation({ summary: 'Get recent QC runs' })
  @ApiResponse({ status: 200, description: 'Recent QC runs retrieved successfully' })
  async getRecentQcRuns(@Param('days') days: number): Promise<QcRunResponseDto[]> {
    return this.labQcService.getRecentQcRuns(days);
  }
}
