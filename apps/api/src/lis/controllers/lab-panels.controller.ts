import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LabPanelsService } from '../services/lab-panels.service';
import { CreateLabPanelDto, UpdateLabPanelDto, LabPanelResponseDto } from '../dto/lab-panel.dto';
import { LabAuthGuard } from '../guards/lab-auth.guard';

@ApiTags('Laboratory Panels')
@Controller('lab/panels')
@UseGuards(LabAuthGuard)
@ApiBearerAuth()
export class LabPanelsController {
  constructor(private readonly labPanelsService: LabPanelsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lab panel' })
  @ApiResponse({ status: 201, description: 'Panel created successfully' })
  async createPanel(@Body() createPanelDto: CreateLabPanelDto): Promise<LabPanelResponseDto> {
    return this.labPanelsService.createPanel(createPanelDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all lab panels' })
  @ApiResponse({ status: 200, description: 'Panels retrieved successfully' })
  async getAllPanels(
    @Query('category') category?: string,
    @Query('isActive') isActive?: boolean,
    @Query('search') search?: string,
  ): Promise<LabPanelResponseDto[]> {
    return this.labPanelsService.getAllPanels({
      category,
      isActive: isActive !== undefined ? isActive : undefined,
      search,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lab panel by ID' })
  @ApiResponse({ status: 200, description: 'Panel retrieved successfully' })
  async getPanelById(@Param('id') id: string): Promise<LabPanelResponseDto> {
    return this.labPanelsService.getPanelById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update lab panel' })
  @ApiResponse({ status: 200, description: 'Panel updated successfully' })
  async updatePanel(
    @Param('id') id: string,
    @Body() updatePanelDto: UpdateLabPanelDto,
  ): Promise<LabPanelResponseDto> {
    return this.labPanelsService.updatePanel(id, updatePanelDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete lab panel' })
  @ApiResponse({ status: 200, description: 'Panel deleted successfully' })
  async deletePanel(@Param('id') id: string): Promise<{ message: string }> {
    return this.labPanelsService.deletePanel(id);
  }

  @Post(':id/tests/:testId')
  @ApiOperation({ summary: 'Add test to panel' })
  @ApiResponse({ status: 200, description: 'Test added to panel successfully' })
  async addTestToPanel(
    @Param('id') panelId: string,
    @Param('testId') testId: string,
  ): Promise<LabPanelResponseDto> {
    return this.labPanelsService.addTestToPanel(panelId, testId);
  }

  @Delete(':id/tests/:testId')
  @ApiOperation({ summary: 'Remove test from panel' })
  @ApiResponse({ status: 200, description: 'Test removed from panel successfully' })
  async removeTestFromPanel(
    @Param('id') panelId: string,
    @Param('testId') testId: string,
  ): Promise<LabPanelResponseDto> {
    return this.labPanelsService.removeTestFromPanel(panelId, testId);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get panels by category' })
  @ApiResponse({ status: 200, description: 'Panels retrieved successfully' })
  async getPanelsByCategory(@Param('category') category: string): Promise<LabPanelResponseDto[]> {
    return this.labPanelsService.getPanelsByCategory(category);
  }

  @Get('active/all')
  @ApiOperation({ summary: 'Get all active panels' })
  @ApiResponse({ status: 200, description: 'Active panels retrieved successfully' })
  async getActivePanels(): Promise<LabPanelResponseDto[]> {
    return this.labPanelsService.getActivePanels();
  }
}
