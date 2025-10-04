import {
  Controller,
  Get,
  Post,
  Put,
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
import { StudiesService } from '../services/studies.service';
import { CreateStudyDto, UpdateStudyDto, StudyFilterDto, StudyListDto } from '../dto/studies.dto';

@ApiTags('Radiology - Studies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('radiology/studies')
export class StudiesController {
  constructor(private readonly studiesService: StudiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new study' })
  @ApiResponse({ status: 201, description: 'Study created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async create(@Body() createDto: CreateStudyDto) {
    return this.studiesService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all studies with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Studies retrieved successfully' })
  async findAll(
    @Query() filterDto: StudyFilterDto,
    @Query() listDto: StudyListDto,
  ) {
    return this.studiesService.findAll(filterDto, listDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get study by ID' })
  @ApiResponse({ status: 200, description: 'Study retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Study not found' })
  async findOne(@Param('id') id: string) {
    return this.studiesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update study' })
  @ApiResponse({ status: 200, description: 'Study updated successfully' })
  @ApiResponse({ status: 404, description: 'Study not found' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateStudyDto) {
    return this.studiesService.update(id, updateDto);
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start study acquisition' })
  @ApiResponse({ status: 200, description: 'Study started successfully' })
  @ApiResponse({ status: 400, description: 'Study cannot be started' })
  @ApiResponse({ status: 404, description: 'Study not found' })
  async startStudy(@Param('id') id: string) {
    return this.studiesService.startStudy(id);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete study acquisition' })
  @ApiResponse({ status: 200, description: 'Study completed successfully' })
  @ApiResponse({ status: 400, description: 'Study cannot be completed' })
  @ApiResponse({ status: 404, description: 'Study not found' })
  async completeStudy(@Param('id') id: string) {
    return this.studiesService.completeStudy(id);
  }

  @Get('uid/:studyInstanceUID')
  @ApiOperation({ summary: 'Get study by DICOM Study Instance UID' })
  @ApiResponse({ status: 200, description: 'Study retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Study not found' })
  async getStudyByUID(@Param('studyInstanceUID') studyInstanceUID: string) {
    return this.studiesService.getStudyByUID(studyInstanceUID);
  }

  @Get('order/:orderId/all')
  @ApiOperation({ summary: 'Get all studies for an imaging order' })
  @ApiResponse({ status: 200, description: 'Studies retrieved successfully' })
  async getStudiesByOrder(@Param('orderId') orderId: string) {
    return this.studiesService.getStudiesByOrder(orderId);
  }

  @Get(':id/images')
  @ApiOperation({ summary: 'Get all images for a study' })
  @ApiResponse({ status: 200, description: 'Study images retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Study not found' })
  async getStudyImages(@Param('id') studyId: string) {
    return this.studiesService.getStudyImages(studyId);
  }

  @Put(':id/dicom-metadata')
  @ApiOperation({ summary: 'Update DICOM metadata for study' })
  @ApiResponse({ status: 200, description: 'DICOM metadata updated successfully' })
  @ApiResponse({ status: 404, description: 'Study not found' })
  async updateDicomMetadata(
    @Param('id') id: string,
    @Body() dicomMetadata: Record<string, any>,
  ) {
    return this.studiesService.updateDicomMetadata(id, dicomMetadata);
  }

  @Get('stats/overview')
  @ApiOperation({ summary: 'Get studies statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStats(@Request() req) {
    return this.studiesService.getStats(req.user.tenantId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete study' })
  @ApiResponse({ status: 204, description: 'Study deleted successfully' })
  @ApiResponse({ status: 404, description: 'Study not found' })
  async remove(@Param('id') id: string) {
    // Implementation would depend on business rules
    // For now, we'll just return success
    throw new Error('Delete functionality not implemented');
  }
}
