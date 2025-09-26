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
import { AdmissionService } from '../services/admission.service';
import { CreateAdmissionDto } from '../dto/create-admission.dto';
import { UpdateAdmissionDto } from '../dto/update-admission.dto';
import { AdmissionFilterDto } from '../dto/admission-filter.dto';

@Controller('ipd/admissions')
@ApiTags('IPD - Admissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class AdmissionController {
  constructor(private readonly admissionService: AdmissionService) {}

  @Post()
  @ApiOperation({ summary: 'Admit a patient to IPD' })
  @ApiResponse({ status: 201, description: 'Patient admitted successfully' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  async createAdmission(@Body() createAdmissionDto: CreateAdmissionDto) {
    return this.admissionService.createAdmission(createAdmissionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all admissions with optional filters' })
  @ApiResponse({ status: 200, description: 'List of admissions' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async getAdmissions(@Query() filterDto: AdmissionFilterDto) {
    return this.admissionService.getAdmissions(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get admission details by ID' })
  @ApiResponse({ status: 200, description: 'Admission details' })
  @ApiResponse({ status: 404, description: 'Admission not found' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async getAdmissionById(@Param('id', ParseUUIDPipe) id: string) {
    const admission = await this.admissionService.getAdmissionById(id);
    if (!admission) {
      throw new BadRequestException('Admission not found');
    }
    return admission;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update admission details' })
  @ApiResponse({ status: 200, description: 'Admission updated successfully' })
  @ApiResponse({ status: 404, description: 'Admission not found' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  async updateAdmission(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAdmissionDto: UpdateAdmissionDto,
  ) {
    return this.admissionService.updateAdmission(id, updateAdmissionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel an admission' })
  @ApiResponse({ status: 200, description: 'Admission cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Admission not found' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  async cancelAdmission(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('cancellationReason') cancellationReason: string,
    @Body('cancelledById') cancelledById: string,
  ) {
    if (!cancellationReason) {
      throw new BadRequestException('Cancellation reason is required');
    }
    return this.admissionService.cancelAdmission(id, cancellationReason, cancelledById);
  }

  @Post(':id/transfer-bed')
  @ApiOperation({ summary: 'Transfer patient to a different bed' })
  @ApiResponse({ status: 200, description: 'Bed transfer successful' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  async transferBed(
    @Param('id', ParseUUIDPipe) admissionId: string,
    @Body('newBedId', ParseUUIDPipe) newBedId: string,
    @Body('transferredById') transferredById: string,
    @Body('reason') reason?: string,
  ) {
    return this.admissionService.transferBed(admissionId, newBedId, transferredById, reason);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get admission history for a patient' })
  @ApiResponse({ status: 200, description: 'List of patient admissions' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async getPatientAdmissions(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('status') status?: string,
    @Query('limit') limit?: number,
  ) {
    return this.admissionService.getPatientAdmissions(patientId, { status, limit });
  }

  @Get('stats/occupancy')
  @ApiOperation({ summary: 'Get bed occupancy statistics' })
  @ApiResponse({ status: 200, description: 'Occupancy statistics' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async getOccupancyStats() {
    return this.admissionService.getOccupancyStats();
  }

  @Get('stats/admissions')
  @ApiOperation({ summary: 'Get admission statistics' })
  @ApiResponse({ status: 200, description: 'Admission statistics' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST)
  async getAdmissionStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.admissionService.getAdmissionStats(startDate, endDate);
  }
}
