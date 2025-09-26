import {
  Controller,
  Get,
  Post,
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
import { PACSService } from '../services/pacs.service';
import {
  StoreDicomDto,
  QueryDicomDto,
  RetrieveDicomDto,
  DicomQueryLevel,
} from '../dto/pacs.dto';

@ApiTags('Radiology - PACS')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('radiology/pacs')
export class PACSController {
  constructor(private readonly pacsService: PACSService) {}

  @Post('store')
  @ApiOperation({ summary: 'Store DICOM object' })
  @ApiResponse({ status: 201, description: 'DICOM object stored successfully' })
  @ApiResponse({ status: 400, description: 'Invalid DICOM data' })
  async storeDicom(@Body() storeDto: StoreDicomDto) {
    return this.pacsService.storeDicom(storeDto);
  }

  @Post('query')
  @ApiOperation({ summary: 'Query DICOM objects' })
  @ApiResponse({ status: 200, description: 'Query results retrieved successfully' })
  async queryDicom(@Body() queryDto: QueryDicomDto) {
    return this.pacsService.queryDicom(queryDto);
  }

  @Post('retrieve')
  @ApiOperation({ summary: 'Retrieve DICOM object' })
  @ApiResponse({ status: 200, description: 'DICOM object retrieved successfully' })
  @ApiResponse({ status: 404, description: 'DICOM object not found' })
  async retrieveDicom(@Body() retrieveDto: RetrieveDicomDto) {
    return this.pacsService.retrieveDicom(retrieveDto);
  }

  @Get('study/:studyInstanceUID/hierarchy')
  @ApiOperation({ summary: 'Get study hierarchy' })
  @ApiResponse({ status: 200, description: 'Study hierarchy retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Study not found' })
  async getStudyHierarchy(@Param('studyInstanceUID') studyInstanceUID: string) {
    return this.pacsService.getStudyHierarchy(studyInstanceUID);
  }

  @Get('patient/:patientId/studies')
  @ApiOperation({ summary: 'Get patient studies' })
  @ApiResponse({ status: 200, description: 'Patient studies retrieved successfully' })
  async getPatientStudies(@Param('patientId') patientId: string) {
    return this.pacsService.getPatientStudies(patientId);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search studies' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  async searchStudies(@Query('q') searchTerm: string) {
    return this.pacsService.searchStudies(searchTerm);
  }

  @Get('stats/storage')
  @ApiOperation({ summary: 'Get storage statistics' })
  @ApiResponse({ status: 200, description: 'Storage statistics retrieved successfully' })
  async getStorageStats(@Request() req) {
    return this.pacsService.getStorageStats(req.user.tenantId);
  }

  @Post('cleanup/orphaned')
  @ApiOperation({ summary: 'Clean up orphaned DICOM data' })
  @ApiResponse({ status: 200, description: 'Cleanup completed successfully' })
  async cleanupOrphanedData() {
    return this.pacsService.cleanupOrphanedData();
  }

  @Get('viewer/study/:studyInstanceUID')
  @ApiOperation({ summary: 'Get study for viewer' })
  @ApiResponse({ status: 200, description: 'Study data for viewer retrieved successfully' })
  async getStudyForViewer(@Param('studyInstanceUID') studyInstanceUID: string) {
    return this.pacsService.getStudyHierarchy(studyInstanceUID);
  }

  @Get('viewer/series/:seriesInstanceUID/images')
  @ApiOperation({ summary: 'Get series images for viewer' })
  @ApiResponse({ status: 200, description: 'Series images retrieved successfully' })
  async getSeriesImages(@Param('seriesInstanceUID') seriesInstanceUID: string) {
    // This would return image metadata for the viewer
    return { seriesInstanceUID, images: [] };
  }
}
