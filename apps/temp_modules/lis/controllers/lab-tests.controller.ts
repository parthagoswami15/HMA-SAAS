import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LabTestsService } from '../services/lab-tests.service';
import { CreateLabTestDto, UpdateLabTestDto, LabTestResponseDto } from '../dto/lab-test.dto';
import { LabAuthGuard } from '../guards/lab-auth.guard';

@ApiTags('Laboratory Tests')
@Controller('lab/tests')
@UseGuards(LabAuthGuard)
@ApiBearerAuth()
export class LabTestsController {
  constructor(private readonly labTestsService: LabTestsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lab test' })
  @ApiResponse({ status: 201, description: 'Test created successfully' })
  async createTest(@Body() createTestDto: CreateLabTestDto): Promise<LabTestResponseDto> {
    return this.labTestsService.createTest(createTestDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all lab tests' })
  @ApiResponse({ status: 200, description: 'Tests retrieved successfully' })
  async getAllTests(
    @Query('category') category?: string,
    @Query('active') active?: boolean,
  ): Promise<LabTestResponseDto[]> {
    return this.labTestsService.getAllTests(category, active);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lab test by ID' })
  @ApiResponse({ status: 200, description: 'Test retrieved successfully' })
  async getTestById(@Param('id') id: string): Promise<LabTestResponseDto> {
    return this.labTestsService.getTestById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update lab test' })
  @ApiResponse({ status: 200, description: 'Test updated successfully' })
  async updateTest(
    @Param('id') id: string,
    @Body() updateTestDto: UpdateLabTestDto,
  ): Promise<LabTestResponseDto> {
    return this.labTestsService.updateTest(id, updateTestDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete lab test' })
  @ApiResponse({ status: 200, description: 'Test deleted successfully' })
  async deleteTest(@Param('id') id: string): Promise<{ message: string }> {
    return this.labTestsService.deleteTest(id);
  }

  @Get('panels/:panelId')
  @ApiOperation({ summary: 'Get tests by panel' })
  @ApiResponse({ status: 200, description: 'Tests retrieved successfully' })
  async getTestsByPanel(@Param('panelId') panelId: string): Promise<LabTestResponseDto[]> {
    return this.labTestsService.getTestsByPanel(panelId);
  }
}
