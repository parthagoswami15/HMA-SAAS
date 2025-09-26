import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  Query, 
  UseGuards, 
  Request,
  NotFoundException,
  BadRequestException,
  ForbiddenException
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiBody
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/enums/user-role.enum';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { DiagnosisService } from '../services/diagnosis.service';
import { 
  Diagnosis, 
  DiagnosisStatus, 
  DiagnosisType 
} from '../entities/diagnosis.entity';
import { 
  CreatePatientDiagnosisDto, 
  CreateEncounterDiagnosisDto, 
  UpdateDiagnosisDto, 
  ResolveDiagnosisDto, 
  ReactivateDiagnosisDto 
} from '../dto/diagnosis';
import { PaginationParams } from '../../common/dto/pagination-params.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@ApiTags('OPD - Diagnoses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('opd/diagnoses')
export class DiagnosisController {
  constructor(private readonly diagnosisService: DiagnosisService) {}

  @Post('patient')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new patient diagnosis' })
  @ApiResponse({ status: 201, description: 'Diagnosis created successfully', type: Diagnosis })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Patient or ICD-10 code not found' })
  async createPatientDiagnosis(
    @Body() createDiagnosisDto: CreatePatientDiagnosisDto,
    @Request() req: RequestWithUser,
  ): Promise<Diagnosis> {
    return this.diagnosisService.createPatientDiagnosis(
      createDiagnosisDto,
      req.user.id,
    );
  }

  @Post('encounter')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new diagnosis for an encounter' })
  @ApiResponse({ status: 201, description: 'Diagnosis created successfully', type: Diagnosis })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Encounter or ICD-10 code not found' })
  async createEncounterDiagnosis(
    @Body() createDiagnosisDto: CreateEncounterDiagnosisDto,
    @Request() req: RequestWithUser,
  ): Promise<Diagnosis> {
    return this.diagnosisService.createEncounterDiagnosis(
      createDiagnosisDto,
      req.user.id,
    );
  }

  @Get('patient/:patientId')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Get all diagnoses for a patient' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiQuery({ name: 'status', required: false, enum: DiagnosisStatus, isArray: true })
  @ApiQuery({ name: 'type', required: false, enum: DiagnosisType })
  @ApiQuery({ name: 'isPrimary', required: false, type: Boolean })
  @ApiQuery({ name: 'fromDate', required: false, type: Date })
  @ApiQuery({ name: 'toDate', required: false, type: Date })
  @ApiQuery({ name: 'searchTerm', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of patient diagnoses', type: PaginatedResult<Diagnosis> })
  async getPatientDiagnoses(
    @Param('patientId') patientId: string,
    @Query('status') status?: DiagnosisStatus | DiagnosisStatus[],
    @Query('type') type?: DiagnosisType,
    @Query('isPrimary') isPrimary?: boolean,
    @Query('fromDate') fromDate?: Date,
    @Query('toDate') toDate?: Date,
    @Query('searchTerm') searchTerm?: string,
    @Query() pagination: PaginationParams = { page: 1, limit: 20 },
  ): Promise<PaginatedResult<Diagnosis>> {
    return this.diagnosisService.getPatientDiagnoses(
      patientId,
      {
        status,
        type,
        isPrimary: isPrimary !== undefined ? isPrimary === true : undefined,
        fromDate: fromDate ? new Date(fromDate) : undefined,
        toDate: toDate ? new Date(toDate) : undefined,
        searchTerm,
      },
      pagination,
    );
  }

  @Get('encounter/:encounterId')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Get all diagnoses for an encounter' })
  @ApiParam({ name: 'encounterId', description: 'Encounter ID' })
  @ApiResponse({ status: 200, description: 'List of encounter diagnoses', type: [Diagnosis] })
  @ApiResponse({ status: 404, description: 'Encounter not found' })
  async getEncounterDiagnoses(
    @Param('encounterId') encounterId: string,
  ): Promise<Diagnosis[]> {
    return this.diagnosisService.getEncounterDiagnoses(encounterId);
  }

  @Get('active/patient/:patientId')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Get active diagnoses for a patient' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'List of active diagnoses', type: [Diagnosis] })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async getActiveDiagnoses(
    @Param('patientId') patientId: string,
  ): Promise<Diagnosis[]> {
    return this.diagnosisService.getActiveDiagnoses(patientId);
  }

  @Get('chronic/patient/:patientId')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Get chronic conditions for a patient' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'List of chronic conditions', type: [Diagnosis] })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async getChronicConditions(
    @Param('patientId') patientId: string,
  ): Promise<Diagnosis[]> {
    return this.diagnosisService.getChronicConditions(patientId);
  }

  @Get('stats/patient/:patientId')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Get diagnosis statistics for a patient' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Diagnosis statistics' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async getDiagnosisStats(
    @Param('patientId') patientId: string,
  ) {
    return this.diagnosisService.getDiagnosisStats(patientId);
  }

  @Get('timeline/patient/:patientId')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Get diagnosis timeline for a patient' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Diagnosis timeline' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async getDiagnosisTimeline(
    @Param('patientId') patientId: string,
  ) {
    return this.diagnosisService.getDiagnosisTimeline(patientId);
  }

  @Get(':id')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Get diagnosis by ID' })
  @ApiParam({ name: 'id', description: 'Diagnosis ID' })
  @ApiResponse({ status: 200, description: 'Diagnosis details', type: Diagnosis })
  @ApiResponse({ status: 404, description: 'Diagnosis not found' })
  async getDiagnosis(
    @Param('id') id: string,
  ): Promise<Diagnosis> {
    return this.diagnosisService.getDiagnosisById(id);
  }

  @Put(':id')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a diagnosis' })
  @ApiParam({ name: 'id', description: 'Diagnosis ID' })
  @ApiResponse({ status: 200, description: 'Diagnosis updated successfully', type: Diagnosis })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Diagnosis not found' })
  async updateDiagnosis(
    @Param('id') id: string,
    @Body() updateDiagnosisDto: UpdateDiagnosisDto,
    @Request() req: RequestWithUser,
  ): Promise<Diagnosis> {
    return this.diagnosisService.updateDiagnosis(
      id,
      updateDiagnosisDto,
      req.user.id,
    );
  }

  @Post(':id/resolve')
  @Roles(UserRole.DOCTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Mark a diagnosis as resolved' })
  @ApiParam({ name: 'id', description: 'Diagnosis ID' })
  @ApiResponse({ status: 200, description: 'Diagnosis resolved successfully', type: Diagnosis })
  @ApiResponse({ status: 400, description: 'Diagnosis already resolved' })
  @ApiResponse({ status: 404, description: 'Diagnosis not found' })
  async resolveDiagnosis(
    @Param('id') id: string,
    @Body() resolveDto: ResolveDiagnosisDto,
    @Request() req: RequestWithUser,
  ): Promise<Diagnosis> {
    return this.diagnosisService.resolveDiagnosis(
      id,
      resolveDto,
      req.user.id,
    );
  }

  @Post(':id/reactivate')
  @Roles(UserRole.DOCTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Reactivate a resolved diagnosis' })
  @ApiParam({ name: 'id', description: 'Diagnosis ID' })
  @ApiResponse({ status: 200, description: 'Diagnosis reactivated successfully', type: Diagnosis })
  @ApiResponse({ status: 400, description: 'Diagnosis is not resolved' })
  @ApiResponse({ status: 404, description: 'Diagnosis not found' })
  async reactivateDiagnosis(
    @Param('id') id: string,
    @Body() reactivateDto: ReactivateDiagnosisDto,
    @Request() req: RequestWithUser,
  ): Promise<Diagnosis> {
    return this.diagnosisService.reactivateDiagnosis(
      id,
      reactivateDto,
      req.user.id,
    );
  }

  @Delete(':id')
  @Roles(UserRole.DOCTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a diagnosis' })
  @ApiParam({ name: 'id', description: 'Diagnosis ID' })
  @ApiResponse({ status: 200, description: 'Diagnosis deleted successfully' })
  @ApiResponse({ status: 404, description: 'Diagnosis not found' })
  async deleteDiagnosis(
    @Param('id') id: string,
  ): Promise<void> {
    return this.diagnosisService.deleteDiagnosis(id);
  }

  @Get('common')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get most common diagnoses' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of common diagnoses' })
  async getCommonDiagnoses(
    @Query('limit') limit = 10,
  ) {
    return this.diagnosisService.getCommonDiagnoses(Number(limit) || 10);
  }
}
