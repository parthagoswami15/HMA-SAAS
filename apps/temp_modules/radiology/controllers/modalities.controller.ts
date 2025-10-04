import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ModalitiesService } from '../services/modalities.service';
import {
  CreateModalityDto,
  UpdateModalityDto,
  ModalityWorklistDto,
  TestModalityConnectionDto,
} from '../dto/modalities.dto';

@ApiTags('Radiology - Modalities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('radiology/modalities')
export class ModalitiesController {
  constructor(private readonly modalitiesService: ModalitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new modality' })
  @ApiResponse({ status: 201, description: 'Modality created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Modality with this AE Title already exists' })
  async create(@Body() createDto: CreateModalityDto, @Request() req) {
    return this.modalitiesService.create(createDto, req.user.tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all modalities with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Modalities retrieved successfully' })
  async findAll(
    @Query('modalityType') modalityType?: string,
    @Query('isActive') isActive?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const filterDto = { modalityType, isActive: isActive === 'true' };
    const listDto = { page: page || 1, limit: limit || 10 };
    return this.modalitiesService.findAll(filterDto, listDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get modality by ID' })
  @ApiResponse({ status: 200, description: 'Modality retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Modality not found' })
  async findOne(@Param('id') id: string) {
    return this.modalitiesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update modality' })
  @ApiResponse({ status: 200, description: 'Modality updated successfully' })
  @ApiResponse({ status: 404, description: 'Modality not found' })
  @ApiResponse({ status: 409, description: 'AE Title already exists' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateModalityDto) {
    return this.modalitiesService.update(id, updateDto);
  }

  @Get(':id/worklist')
  @ApiOperation({ summary: 'Get modality worklist' })
  @ApiResponse({ status: 200, description: 'Worklist retrieved successfully' })
  async getWorklist(@Param('id') modalityId: string) {
    return this.modalitiesService.getWorklist(modalityId);
  }

  @Post(':id/worklist')
  @ApiOperation({ summary: 'Send study to modality worklist' })
  @ApiResponse({ status: 200, description: 'Study sent to worklist successfully' })
  @ApiResponse({ status: 404, description: 'Modality or study not found' })
  async sendToWorklist(@Param('id') modalityId: string, @Body() worklistDto: ModalityWorklistDto) {
    return this.modalitiesService.sendToWorklist(modalityId, worklistDto);
  }

  @Post(':id/test-connection')
  @ApiOperation({ summary: 'Test connection to modality' })
  @ApiResponse({ status: 200, description: 'Connection test successful' })
  @ApiResponse({ status: 400, description: 'Test failed' })
  async testConnection(@Param('id') modalityId: string, @Body() testDto: TestModalityConnectionDto) {
    return this.modalitiesService.testConnection(modalityId, testDto);
  }

  @Get('stats/overview')
  @ApiOperation({ summary: 'Get modalities statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStats(@Request() req) {
    return this.modalitiesService.getStats(req.user.tenantId);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate modality' })
  @ApiResponse({ status: 200, description: 'Modality activated successfully' })
  @ApiResponse({ status: 404, description: 'Modality not found' })
  async activate(@Param('id') id: string) {
    return this.modalitiesService.updateStatus(id, true);
  }

  @Post(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate modality' })
  @ApiResponse({ status: 200, description: 'Modality deactivated successfully' })
  @ApiResponse({ status: 404, description: 'Modality not found' })
  async deactivate(@Param('id') id: string) {
    return this.modalitiesService.updateStatus(id, false);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete modality' })
  @ApiResponse({ status: 204, description: 'Modality deleted successfully' })
  @ApiResponse({ status: 404, description: 'Modality not found' })
  @ApiResponse({ status: 409, description: 'Cannot delete modality with active studies' })
  async remove(@Param('id') id: string) {
    await this.modalitiesService.remove(id);
  }
}
