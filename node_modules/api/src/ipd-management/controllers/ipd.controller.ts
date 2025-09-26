import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { IPDService } from '../services/ipd.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/enums/user-role.enum';

@Controller('ipd')
@ApiTags('IPD Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
export class IPDController {
  constructor(private readonly ipdService: IPDService) {}

  // Admission Endpoints
  @Post('admissions')
  @ApiOperation({ summary: 'Admit a patient to IPD' })
  @ApiResponse({ status: 201, description: 'Patient admitted successfully' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  async admitPatient(@Body() admissionData: any) {
    return this.ipdService.admitPatient(admissionData);
  }

  @Get('admissions/:admissionId')
  @ApiOperation({ summary: 'Get admission details' })
  @ApiResponse({ status: 200, description: 'Admission details retrieved' })
  async getAdmission(@Param('admissionId') admissionId: string) {
    return this.ipdService.getAdmissionDetails(admissionId);
  }

  // Bed/Ward Management
  @Get('beds/available')
  @ApiOperation({ summary: 'Get available beds' })
  @ApiQuery({ name: 'wardId', required: false })
  @ApiQuery({ name: 'bedClass', required: false })
  @ApiResponse({ status: 200, description: 'Available beds retrieved' })
  async getAvailableBeds(
    @Query('wardId') wardId?: string,
    @Query('bedClass') bedClass?: string,
  ) {
    return this.ipdService.getAvailableBeds(wardId, bedClass);
  }

  @Post('beds/transfer')
  @ApiOperation({ summary: 'Transfer patient to another bed' })
  @ApiResponse({ status: 200, description: 'Patient transferred successfully' })
  @Roles(UserRole.ADMIN, UserRole.NURSE, UserRole.RECEPTIONIST)
  async transferBed(
    @Body('admissionId') admissionId: string,
    @Body('newBedId') newBedId: string,
    @Body('reason') reason: string,
  ) {
    return this.ipdService.transferPatientBed(admissionId, newBedId, reason);
  }

  // Nursing Charts
  @Post('nursing/charts')
  @ApiOperation({ summary: 'Record nursing chart' })
  @ApiResponse({ status: 201, description: 'Nursing chart recorded' })
  @Roles(UserRole.ADMIN, UserRole.NURSE, UserRole.DOCTOR)
  async recordNursingChart(
    @Body('patientId') patientId: string,
    @Body() chartData: any,
  ) {
    return this.ipdService.recordNursingChart(patientId, chartData);
  }

  @Get('patients/:patientId/nursing-charts')
  @ApiOperation({ summary: 'Get patient nursing charts' })
  @ApiQuery({ name: 'date', required: false })
  @ApiResponse({ status: 200, description: 'Nursing charts retrieved' })
  async getNursingCharts(
    @Param('patientId') patientId: string,
    @Query('date') date?: Date,
  ) {
    return this.ipdService.getPatientNursingCharts(patientId, date);
  }

  // Medication Administration Record (MAR)
  @Post('medication/administration')
  @ApiOperation({ summary: 'Record medication administration' })
  @ApiResponse({ status: 201, description: 'Medication administration recorded' })
  @Roles(UserRole.ADMIN, UserRole.NURSE)
  async recordMedication(@Body() marData: any) {
    return this.ipdService.recordMedicationAdministration(marData);
  }

  // OT/Surgery
  @Post('surgeries')
  @ApiOperation({ summary: 'Schedule a surgery' })
  @ApiResponse({ status: 201, description: 'Surgery scheduled' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async scheduleSurgery(@Body() surgeryData: any) {
    return this.ipdService.scheduleSurgery(surgeryData);
  }

  @Put('surgeries/:surgeryId/status')
  @ApiOperation({ summary: 'Update surgery status' })
  @ApiResponse({ status: 200, description: 'Surgery status updated' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  async updateSurgeryStatus(
    @Param('surgeryId') surgeryId: string,
    @Body('status') status: string,
    @Body('notes') notes?: string,
  ) {
    return this.ipdService.updateSurgeryStatus(surgeryId, status, notes);
  }

  // Discharge
  @Post('discharge/initiate')
  @ApiOperation({ summary: 'Initiate patient discharge' })
  @ApiResponse({ status: 201, description: 'Discharge initiated' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async initiateDischarge(
    @Body('admissionId') admissionId: string,
    @Body() dischargeData: any,
  ) {
    return this.ipdService.initiateDischarge(admissionId, dischargeData);
  }

  @Post('discharge/:dischargeId/complete')
  @ApiOperation({ summary: 'Complete patient discharge' })
  @ApiResponse({ status: 200, description: 'Discharge completed' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  async completeDischarge(@Param('dischargeId') dischargeId: string) {
    return this.ipdService.completeDischarge(dischargeId);
  }

  // Dashboard/Reports
  @Get('reports/bed-occupancy')
  @ApiOperation({ summary: 'Get bed occupancy report' })
  @ApiResponse({ status: 200, description: 'Bed occupancy report' })
  @Roles(UserRole.ADMIN, UserRole.NURSE, UserRole.RECEPTIONIST)
  async getBedOccupancyReport() {
    return this.ipdService.getBedOccupancyReport();
  }

  @Get('patients/:patientId/summary')
  @ApiOperation({ summary: 'Get patient summary' })
  @ApiResponse({ status: 200, description: 'Patient summary retrieved' })
  async getPatientSummary(@Param('patientId') patientId: string) {
    return this.ipdService.getPatientSummary(patientId);
  }
}
