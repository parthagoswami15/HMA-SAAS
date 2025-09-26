import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LabSamplesService } from '../services/lab-samples.service';
import { CreateSampleDto, SampleResponseDto, SampleStatus } from '../dto/lab-order.dto';
import { LabAuthGuard } from '../guards/lab-auth.guard';

@ApiTags('Laboratory Samples')
@Controller('lab/samples')
@UseGuards(LabAuthGuard)
@ApiBearerAuth()
export class LabSamplesController {
  constructor(private readonly labSamplesService: LabSamplesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sample' })
  @ApiResponse({ status: 201, description: 'Sample created successfully' })
  async createSample(@Body() createSampleDto: CreateSampleDto): Promise<SampleResponseDto> {
    return this.labSamplesService.createSample(createSampleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all samples' })
  @ApiResponse({ status: 200, description: 'Samples retrieved successfully' })
  async getAllSamples(
    @Query('orderId') orderId?: string,
    @Query('sampleType') sampleType?: string,
    @Query('status') status?: SampleStatus,
    @Query('barcode') barcode?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ): Promise<SampleResponseDto[]> {
    return this.labSamplesService.getAllSamples({
      orderId,
      sampleType,
      status,
      barcode,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get sample by ID' })
  @ApiResponse({ status: 200, description: 'Sample retrieved successfully' })
  async getSampleById(@Param('id') id: string): Promise<SampleResponseDto> {
    return this.labSamplesService.getSampleById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update sample' })
  @ApiResponse({ status: 200, description: 'Sample updated successfully' })
  async updateSample(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateSampleDto>,
  ): Promise<SampleResponseDto> {
    return this.labSamplesService.updateSample(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete sample' })
  @ApiResponse({ status: 200, description: 'Sample deleted successfully' })
  async deleteSample(@Param('id') id: string): Promise<{ message: string }> {
    return this.labSamplesService.deleteSample(id);
  }

  @Post(':id/collect')
  @ApiOperation({ summary: 'Mark sample as collected' })
  @ApiResponse({ status: 200, description: 'Sample marked as collected' })
  async collectSample(
    @Param('id') id: string,
    @Body('collectedAt') collectedAt?: Date,
  ): Promise<SampleResponseDto> {
    return this.labSamplesService.collectSample(id, collectedAt);
  }

  @Post(':id/receive')
  @ApiOperation({ summary: 'Mark sample as received' })
  @ApiResponse({ status: 200, description: 'Sample marked as received' })
  async receiveSample(@Param('id') id: string): Promise<SampleResponseDto> {
    return this.labSamplesService.receiveSample(id);
  }

  @Post(':id/process')
  @ApiOperation({ summary: 'Mark sample as processed' })
  @ApiResponse({ status: 200, description: 'Sample marked as processed' })
  async processSample(@Param('id') id: string): Promise<SampleResponseDto> {
    return this.labSamplesService.processSample(id);
  }

  @Post(':id/store')
  @ApiOperation({ summary: 'Mark sample as stored' })
  @ApiResponse({ status: 200, description: 'Sample marked as stored' })
  async storeSample(@Param('id') id: string): Promise<SampleResponseDto> {
    return this.labSamplesService.storeSample(id);
  }

  @Post(':id/dispose')
  @ApiOperation({ summary: 'Mark sample as disposed' })
  @ApiResponse({ status: 200, description: 'Sample marked as disposed' })
  async disposeSample(@Param('id') id: string): Promise<SampleResponseDto> {
    return this.labSamplesService.disposeSample(id);
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Get samples by order ID' })
  @ApiResponse({ status: 200, description: 'Samples retrieved successfully' })
  async getSamplesByOrder(@Param('orderId') orderId: string): Promise<SampleResponseDto[]> {
    return this.labSamplesService.getSamplesByOrder(orderId);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get samples by status' })
  @ApiResponse({ status: 200, description: 'Samples retrieved successfully' })
  async getSamplesByStatus(@Param('status') status: SampleStatus): Promise<SampleResponseDto[]> {
    return this.labSamplesService.getSamplesByStatus(status);
  }

  @Get('type/:sampleType')
  @ApiOperation({ summary: 'Get samples by type' })
  @ApiResponse({ status: 200, description: 'Samples retrieved successfully' })
  async getSamplesByType(@Param('sampleType') sampleType: string): Promise<SampleResponseDto[]> {
    return this.labSamplesService.getSamplesByType(sampleType);
  }

  @Get('expired/all')
  @ApiOperation({ summary: 'Get all expired samples' })
  @ApiResponse({ status: 200, description: 'Expired samples retrieved successfully' })
  async getExpiredSamples(): Promise<SampleResponseDto[]> {
    return this.labSamplesService.getExpiredSamples();
  }

  @Get(':id/barcode')
  @ApiOperation({ summary: 'Generate barcode for sample' })
  @ApiResponse({ status: 200, description: 'Barcode generated successfully' })
  async generateBarcode(@Param('id') id: string): Promise<{ barcode: string }> {
    return this.labSamplesService.generateBarcode(id);
  }
}
