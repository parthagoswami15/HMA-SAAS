import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LabResultsService } from '../services/lab-results.service';
import { CreateLabResultDto, UpdateLabResultDto, LabResultResponseDto, ValidationStatus } from '../dto/lab-result.dto';
import { LabAuthGuard } from '../guards/lab-auth.guard';

@ApiTags('Laboratory Results')
@Controller('lab/results')
@UseGuards(LabAuthGuard)
@ApiBearerAuth()
export class LabResultsController {
  constructor(private readonly labResultsService: LabResultsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lab result' })
  @ApiResponse({ status: 201, description: 'Result created successfully' })
  async createResult(@Body() createResultDto: CreateLabResultDto): Promise<LabResultResponseDto> {
    return this.labResultsService.createResult(createResultDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all lab results' })
  @ApiResponse({ status: 200, description: 'Results retrieved successfully' })
  async getAllResults(
    @Query('orderId') orderId?: string,
    @Query('testId') testId?: string,
    @Query('validationStatus') validationStatus?: ValidationStatus,
    @Query('flag') flag?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ): Promise<LabResultResponseDto[]> {
    return this.labResultsService.getAllResults({
      orderId,
      testId,
      validationStatus,
      flag,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lab result by ID' })
  @ApiResponse({ status: 200, description: 'Result retrieved successfully' })
  async getResultById(@Param('id') id: string): Promise<LabResultResponseDto> {
    return this.labResultsService.getResultById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update lab result' })
  @ApiResponse({ status: 200, description: 'Result updated successfully' })
  async updateResult(
    @Param('id') id: string,
    @Body() updateResultDto: UpdateLabResultDto,
  ): Promise<LabResultResponseDto> {
    return this.labResultsService.updateResult(id, updateResultDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete lab result' })
  @ApiResponse({ status: 200, description: 'Result deleted successfully' })
  async deleteResult(@Param('id') id: string): Promise<{ message: string }> {
    return this.labResultsService.deleteResult(id);
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Get results by order ID' })
  @ApiResponse({ status: 200, description: 'Results retrieved successfully' })
  async getResultsByOrder(@Param('orderId') orderId: string): Promise<LabResultResponseDto[]> {
    return this.labResultsService.getResultsByOrder(orderId);
  }

  @Get('test/:testId')
  @ApiOperation({ summary: 'Get results by test ID' })
  @ApiResponse({ status: 200, description: 'Results retrieved successfully' })
  async getResultsByTest(
    @Param('testId') testId: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ): Promise<LabResultResponseDto[]> {
    return this.labResultsService.getResultsByTest(
      testId,
      dateFrom ? new Date(dateFrom) : undefined,
      dateTo ? new Date(dateTo) : undefined,
    );
  }

  @Post(':id/validate')
  @ApiOperation({ summary: 'Validate lab result' })
  @ApiResponse({ status: 200, description: 'Result validated successfully' })
  async validateResult(
    @Param('id') id: string,
    @Body('validatedBy') validatedBy: string,
  ): Promise<LabResultResponseDto> {
    return this.labResultsService.validateResult(id, validatedBy);
  }

  @Post(':id/review')
  @ApiOperation({ summary: 'Review lab result' })
  @ApiResponse({ status: 200, description: 'Result reviewed successfully' })
  async reviewResult(
    @Param('id') id: string,
    @Body('reviewedBy') reviewedBy: string,
  ): Promise<LabResultResponseDto> {
    return this.labResultsService.reviewResult(id, reviewedBy);
  }

  @Post(':id/finalize')
  @ApiOperation({ summary: 'Finalize lab result' })
  @ApiResponse({ status: 200, description: 'Result finalized successfully' })
  async finalizeResult(
    @Param('id') id: string,
    @Body('finalizedBy') finalizedBy: string,
  ): Promise<LabResultResponseDto> {
    return this.labResultsService.finalizeResult(id, finalizedBy);
  }

  @Get('critical/all')
  @ApiOperation({ summary: 'Get all critical results' })
  @ApiResponse({ status: 200, description: 'Critical results retrieved successfully' })
  async getCriticalResults(): Promise<LabResultResponseDto[]> {
    return this.labResultsService.getCriticalResults();
  }
}
