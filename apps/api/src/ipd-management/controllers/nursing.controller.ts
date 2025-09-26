import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Put,
  ParseUUIDPipe,
  BadRequestException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/enums/user-role.enum';
import { NursingService } from '../services/nursing.service';
import { CreateNursingChartDto } from '../dto/create-nursing-chart.dto';
import { CreateMedicationAdministrationDto } from '../dto/create-medication-administration.dto';
import { MedicationStatus } from '../enums/medication-status.enum';

@Controller('ipd/nursing')
@ApiTags('IPD - Nursing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class NursingController {
  constructor(private readonly nursingService: NursingService) {}

  // Nursing Chart Endpoints
  @Post('charts')
  @ApiOperation({ summary: 'Record nursing chart/vital signs' })
  @ApiResponse({ status: 201, description: 'Nursing chart recorded successfully' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  async recordNursingChart(@Body() createNursingChartDto: CreateNursingChartDto) {
    return this.nursingService.recordNursingChart(createNursingChartDto);
  }

  @Get('charts')
  @ApiOperation({ summary: 'Get nursing charts for a patient' })
  @ApiResponse({ status: 200, description: 'List of nursing charts' })
  @ApiQuery({ name: 'patientId', required: true, type: String })
  @ApiQuery({ name: 'admissionId', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  async getNursingCharts(
    @Query('patientId', ParseUUIDPipe) patientId: string,
    @Query('admissionId') admissionId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit: number = 100,
  ) {
    return this.nursingService.getNursingCharts({
      patientId,
      admissionId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit,
    });
  }

  @Get('charts/:chartId')
  @ApiOperation({ summary: 'Get nursing chart by ID' })
  @ApiResponse({ status: 200, description: 'Nursing chart details' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  async getNursingChartById(@Param('chartId', ParseUUIDPipe) chartId: string) {
    return this.nursingService.getNursingChartById(chartId);
  }

  // Medication Administration Endpoints
  @Post('medications')
  @ApiOperation({ summary: 'Record medication administration' })
  @ApiResponse({ status: 201, description: 'Medication administration recorded' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  async recordMedicationAdministration(
    @Body() createMedicationDto: CreateMedicationAdministrationDto,
  ) {
    return this.nursingService.recordMedicationAdministration(createMedicationDto);
  }

  @Get('medications')
  @ApiOperation({ summary: 'Get medication administration records' })
  @ApiResponse({ status: 200, description: 'List of medication records' })
  @ApiQuery({ name: 'patientId', required: false, type: String })
  @ApiQuery({ name: 'admissionId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: MedicationStatus })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.PHARMACIST)
  async getMedicationAdministrations(
    @Query('patientId') patientId?: string,
    @Query('admissionId') admissionId?: string,
    @Query('status') status?: MedicationStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.nursingService.getMedicationAdministrations({
      patientId,
      admissionId,
      status,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Get('medications/:medicationId')
  @ApiOperation({ summary: 'Get medication administration by ID' })
  @ApiResponse({ status: 200, description: 'Medication administration details' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.PHARMACIST)
  async getMedicationAdministrationById(
    @Param('medicationId', ParseUUIDPipe) medicationId: string,
  ) {
    return this.nursingService.getMedicationAdministrationById(medicationId);
  }

  @Put('medications/:medicationId/status')
  @ApiOperation({ summary: 'Update medication administration status' })
  @ApiResponse({ status: 200, description: 'Medication status updated' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  async updateMedicationStatus(
    @Param('medicationId', ParseUUIDPipe) medicationId: string,
    @Body('status') status: MedicationStatus,
    @Body('administeredById') administeredById: string,
    @Body('administeredAt') administeredAt?: string,
    @Body('notes') notes?: string,
  ) {
    if (!Object.values(MedicationStatus).includes(status)) {
      throw new BadRequestException('Invalid medication status');
    }
    return this.nursingService.updateMedicationStatus(
      medicationId,
      status,
      administeredById,
      administeredAt ? new Date(administeredAt) : new Date(),
      notes,
    );
  }

  @Get('patients/:patientId/medication-schedule')
  @ApiOperation({ summary: 'Get patient\'s medication schedule' })
  @ApiResponse({ status: 200, description: 'Medication schedule' })
  @ApiQuery({ name: 'admissionId', required: false, type: String })
  @ApiQuery({ name: 'date', required: false, type: Date })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.PHARMACIST)
  async getPatientMedicationSchedule(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('admissionId') admissionId?: string,
    @Query('date') date?: string,
  ) {
    return this.nursingService.getPatientMedicationSchedule({
      patientId,
      admissionId,
      date: date ? new Date(date) : new Date(),
    });
  }

  @Get('patients/:patientId/vitals')
  @ApiOperation({ summary: 'Get patient\'s vital signs' })
  @ApiResponse({ status: 200, description: 'Vital signs data' })
  @ApiQuery({ name: 'admissionId', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  async getPatientVitalSigns(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('admissionId') admissionId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit: number = 100,
  ) {
    return this.nursingService.getPatientVitalSigns({
      patientId,
      admissionId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit,
    });
  }

  @Get('patients/:patientId/io-chart')
  @ApiOperation({ summary: 'Get patient\'s intake/output chart' })
  @ApiResponse({ status: 200, description: 'I/O chart data' })
  @ApiQuery({ name: 'admissionId', required: true, type: String })
  @ApiQuery({ name: 'date', required: false, type: Date })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  async getPatientIOChart(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('admissionId', ParseUUIDPipe) admissionId: string,
    @Query('date') date: string = new Date().toISOString().split('T')[0],
  ) {
    return this.nursingService.getPatientIOChart(patientId, admissionId, new Date(date));
  }
}
