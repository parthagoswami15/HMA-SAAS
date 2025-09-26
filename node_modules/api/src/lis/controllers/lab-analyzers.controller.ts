import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LabAnalyzersService } from '../services/lab-analyzers.service';
import { LabQcService } from '../services/lab-qc.service';
import { CreateAnalyzerDto, UpdateAnalyzerDto, AnalyzerResponseDto, CreateQcRunDto, QcRunResponseDto } from '../dto/lab-analyzer.dto';
import { LabAuthGuard } from '../guards/lab-auth.guard';

@ApiTags('Laboratory Analyzers')
@Controller('lab/analyzers')
@UseGuards(LabAuthGuard)
@ApiBearerAuth()
export class LabAnalyzersController {
  constructor(private readonly labAnalyzersService: LabAnalyzersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new analyzer' })
  @ApiResponse({ status: 201, description: 'Analyzer created successfully' })
  async createAnalyzer(@Body() createAnalyzerDto: CreateAnalyzerDto): Promise<AnalyzerResponseDto> {
    return this.labAnalyzersService.createAnalyzer(createAnalyzerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all analyzers' })
  @ApiResponse({ status: 200, description: 'Analyzers retrieved successfully' })
  async getAllAnalyzers(
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('isActive') isActive?: boolean,
    @Query('location') location?: string,
  ): Promise<AnalyzerResponseDto[]> {
    return this.labAnalyzersService.getAllAnalyzers({
      type,
      status,
      isActive: isActive !== undefined ? isActive : undefined,
      location,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get analyzer by ID' })
  @ApiResponse({ status: 200, description: 'Analyzer retrieved successfully' })
  async getAnalyzerById(@Param('id') id: string): Promise<AnalyzerResponseDto> {
    return this.labAnalyzersService.getAnalyzerById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update analyzer' })
  @ApiResponse({ status: 200, description: 'Analyzer updated successfully' })
  async updateAnalyzer(
    @Param('id') id: string,
    @Body() updateAnalyzerDto: UpdateAnalyzerDto,
  ): Promise<AnalyzerResponseDto> {
    return this.labAnalyzersService.updateAnalyzer(id, updateAnalyzerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete analyzer' })
  @ApiResponse({ status: 200, description: 'Analyzer deleted successfully' })
  async deleteAnalyzer(@Param('id') id: string): Promise<{ message: string }> {
    return this.labAnalyzersService.deleteAnalyzer(id);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update analyzer status' })
  @ApiResponse({ status: 200, description: 'Analyzer status updated successfully' })
  async updateAnalyzerStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ): Promise<AnalyzerResponseDto> {
    return this.labAnalyzersService.updateAnalyzerStatus(id, status);
  }

  @Put(':id/communication')
  @ApiOperation({ summary: 'Update analyzer communication timestamp' })
  @ApiResponse({ status: 200, description: 'Analyzer communication updated successfully' })
  async updateAnalyzerCommunication(@Param('id') id: string): Promise<AnalyzerResponseDto> {
    return this.labAnalyzersService.updateAnalyzerCommunication(id);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get analyzers by type' })
  @ApiResponse({ status: 200, description: 'Analyzers retrieved successfully' })
  async getAnalyzersByType(@Param('type') type: string): Promise<AnalyzerResponseDto[]> {
    return this.labAnalyzersService.getAnalyzersByType(type);
  }

  @Get('active/all')
  @ApiOperation({ summary: 'Get all active analyzers' })
  @ApiResponse({ status: 200, description: 'Active analyzers retrieved successfully' })
  async getActiveAnalyzers(): Promise<AnalyzerResponseDto[]> {
    return this.labAnalyzersService.getActiveAnalyzers();
  }

  @Get('online/all')
  @ApiOperation({ summary: 'Get all online analyzers' })
  @ApiResponse({ status: 200, description: 'Online analyzers retrieved successfully' })
  async getOnlineAnalyzers(): Promise<AnalyzerResponseDto[]> {
    return this.labAnalyzersService.getOnlineAnalyzers();
  }
}
