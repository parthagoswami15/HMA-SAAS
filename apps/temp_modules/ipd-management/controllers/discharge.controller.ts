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
import { DischargeService } from '../services/discharge.service';
import { DischargeStatus } from '../enums/discharge-status.enum';
import { DischargeType } from '../enums/discharge-type.enum';

@Controller('ipd/discharges')
@ApiTags('IPD - Discharge Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class DischargeController {
  constructor(private readonly dischargeService: DischargeService) {}

  @Post('initiate')
  @ApiOperation({ summary: 'Initiate patient discharge process' })
  @ApiResponse({ status: 201, description: 'Discharge process initiated successfully' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE_IN_CHARGE)
  async initiateDischarge(
    @Body('admissionId', ParseUUIDPipe) admissionId: string,
    @Body('dischargedById') dischargedById: string,
    @Body('dischargeType') dischargeType: DischargeType,
  ) {
    return this.dischargeService.initiateDischarge(admissionId, dischargedById, dischargeType);
  }

  @Put(':dischargeId/status')
  @ApiOperation({ summary: 'Update discharge status' })
  @ApiResponse({ status: 200, description: 'Discharge status updated successfully' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.BILLING_STAFF)
  async updateDischargeStatus(
    @Param('dischargeId', ParseUUIDPipe) dischargeId: string,
    @Body('status') status: DischargeStatus,
    @Body('updatedById') updatedById: string,
  ) {
    return this.dischargeService.updateDischargeStatus(dischargeId, status, updatedById);
  }

  @Put(':dischargeId/summary')
  @ApiOperation({ summary: 'Update discharge summary' })
  @ApiResponse({ status: 200, description: 'Discharge summary updated successfully' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async updateDischargeSummary(
    @Param('dischargeId', ParseUUIDPipe) dischargeId: string,
    @Body() summaryData: {
      diagnosisAtDischarge?: string;
      proceduresPerformed?: string;
      hospitalCourse?: string;
      conditionAtDischarge?: string;
      followUpPlan?: string;
      patientEducation?: string;
      dischargeMedications?: Array<{
        medicationId: string;
        name: string;
        dosage: string;
        frequency: string;
        duration: string;
        instructions: string;
      }>;
      followUpAppointments?: Array<{
        date: Date;
        department: string;
        doctorId: string;
        notes: string;
      }>;
      billingNotes?: string;
    },
    @Body('updatedById') updatedById: string,
  ) {
    return this.dischargeService.updateDischargeSummary(dischargeId, summaryData, updatedById);
  }

  @Get(':dischargeId')
  @ApiOperation({ summary: 'Get discharge details by ID' })
  @ApiResponse({ status: 200, description: 'Discharge details' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.BILLING_STAFF, UserRole.RECEPTIONIST)
  async getDischargeById(@Param('dischargeId', ParseUUIDPipe) dischargeId: string) {
    return this.dischargeService.getDischargeById(dischargeId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all discharges with optional filters' })
  @ApiResponse({ status: 200, description: 'List of discharges' })
  @ApiQuery({ name: 'patientId', required: false, type: String })
  @ApiQuery({ name: 'doctorId', required: false, type: String })
  @ApiQuery({ name: 'wardId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: DischargeStatus })
  @ApiQuery({ name: 'dischargeType', required: false, enum: DischargeType })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.BILLING_STAFF, UserRole.RECEPTIONIST)
  async getDischarges(
    @Query('patientId') patientId?: string,
    @Query('doctorId') doctorId?: string,
    @Query('wardId') wardId?: string,
    @Query('status') status?: DischargeStatus,
    @Query('dischargeType') dischargeType?: DischargeType,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.dischargeService.getDischarges({
      patientId,
      doctorId,
      wardId,
      status,
      dischargeType,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Get(':dischargeId/summary')
  @ApiOperation({ summary: 'Get discharge summary' })
  @ApiResponse({ status: 200, description: 'Discharge summary' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.PATIENT)
  async getDischargeSummary(@Param('dischargeId', ParseUUIDPipe) dischargeId: string) {
    return this.dischargeService.getDischargeSummary(dischargeId);
  }

  @Post(':dischargeId/print')
  @ApiOperation({ summary: 'Generate discharge summary PDF' })
  @ApiResponse({ status: 200, description: 'Discharge summary PDF generated' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async printDischargeSummary(
    @Param('dischargeId', ParseUUIDPipe) dischargeId: string,
    @Body('printedById') printedById: string,
  ) {
    // In a real implementation, this would generate a PDF and return a download link
    // For now, we'll just return a success message
    await this.dischargeService.recordDischargePrint(dischargeId, printedById);
    return { message: 'Discharge summary marked as printed' };
  }

  @Get('stats/daily')
  @ApiOperation({ summary: 'Get daily discharge statistics' })
  @ApiResponse({ status: 200, description: 'Daily discharge statistics' })
  @ApiQuery({ name: 'date', required: false, type: Date })
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.DOCTOR_IN_CHARGE)
  async getDailyDischargeStats(@Query('date') date: string = new Date().toISOString().split('T')[0]) {
    return this.dischargeService.getDailyDischargeStats(new Date(date));
  }

  @Get('stats/monthly')
  @ApiOperation({ summary: 'Get monthly discharge statistics' })
  @ApiResponse({ status: 200, description: 'Monthly discharge statistics' })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'month', required: false, type: Number })
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.DOCTOR_IN_CHARGE)
  async getMonthlyDischargeStats(
    @Query('year') year: number = new Date().getFullYear(),
    @Query('month') month: number = new Date().getMonth() + 1,
  ) {
    return this.dischargeService.getMonthlyDischargeStats(Number(year), Number(month));
  }

  @Get('stats/readmission-rate')
  @ApiOperation({ summary: 'Get readmission rate statistics' })
  @ApiResponse({ status: 200, description: 'Readmission rate statistics' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Number of days to consider for readmission (default: 30)' })
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.DOCTOR_IN_CHARGE)
  async getReadmissionRateStats(@Query('days') days: number = 30) {
    return this.dischargeService.getReadmissionRateStats(Number(days));
  }

  @Post(':dischargeId/cancel')
  @ApiOperation({ summary: 'Cancel a discharge' })
  @ApiResponse({ status: 200, description: 'Discharge cancelled successfully' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR_IN_CHARGE)
  async cancelDischarge(
    @Param('dischargeId', ParseUUIDPipe) dischargeId: string,
    @Body('cancelledById') cancelledById: string,
    @Body('reason') reason: string,
  ) {
    if (!reason) {
      throw new BadRequestException('Cancellation reason is required');
    }
    return this.dischargeService.cancelDischarge(dischargeId, cancelledById, reason);
  }

  @Get('patients/:patientId/history')
  @ApiOperation({ summary: 'Get patient discharge history' })
  @ApiResponse({ status: 200, description: 'List of patient discharges' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.PATIENT)
  async getPatientDischargeHistory(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('limit') limit: number = 10,
  ) {
    return this.dischargeService.getPatientDischargeHistory(patientId, Number(limit));
  }
}
