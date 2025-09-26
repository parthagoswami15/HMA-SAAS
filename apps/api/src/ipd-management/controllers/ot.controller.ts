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
import { OTService } from '../services/ot.service';
import { CreateSurgeryDto } from '../dto/create-surgery.dto';
import { UpdateSurgeryDto } from '../dto/update-surgery.dto';
import { SurgeryStatus } from '../enums/surgery-status.enum';
import { CreateOTTheaterDto } from '../dto/create-ot-theater.dto';
import { UpdateOTTheaterDto } from '../dto/update-ot-theater.dto';

@Controller('ipd/ot')
@ApiTags('IPD - Operation Theater')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class OTController {
  constructor(private readonly otService: OTService) {}

  // Surgery Endpoints
  @Post('surgeries')
  @ApiOperation({ summary: 'Schedule a new surgery' })
  @ApiResponse({ status: 201, description: 'Surgery scheduled successfully' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SURGEON)
  async scheduleSurgery(@Body() createSurgeryDto: CreateSurgeryDto) {
    return this.otService.scheduleSurgery(createSurgeryDto);
  }

  @Get('surgeries')
  @ApiOperation({ summary: 'Get all surgeries with filters' })
  @ApiResponse({ status: 200, description: 'List of surgeries' })
  @ApiQuery({ name: 'status', required: false, enum: SurgeryStatus })
  @ApiQuery({ name: 'surgeonId', required: false, type: String })
  @ApiQuery({ name: 'patientId', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SURGEON, UserRole.NURSE, UserRole.ANESTHETIST)
  async getSurgeries(
    @Query('status') status?: SurgeryStatus,
    @Query('surgeonId') surgeonId?: string,
    @Query('patientId') patientId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.otService.getSurgeries({
      status,
      surgeonId,
      patientId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Get('surgeries/:surgeryId')
  @ApiOperation({ summary: 'Get surgery details by ID' })
  @ApiResponse({ status: 200, description: 'Surgery details' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SURGEON, UserRole.NURSE, UserRole.ANESTHETIST)
  async getSurgeryById(@Param('surgeryId', ParseUUIDPipe) surgeryId: string) {
    return this.otService.getSurgeryById(surgeryId);
  }

  @Put('surgeries/:surgeryId')
  @ApiOperation({ summary: 'Update surgery details' })
  @ApiResponse({ status: 200, description: 'Surgery updated successfully' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SURGEON)
  async updateSurgery(
    @Param('surgeryId', ParseUUIDPipe) surgeryId: string,
    @Body() updateSurgeryDto: UpdateSurgeryDto,
  ) {
    return this.otService.updateSurgery(surgeryId, updateSurgeryDto);
  }

  @Put('surgeries/:surgeryId/status')
  @ApiOperation({ summary: 'Update surgery status' })
  @ApiResponse({ status: 200, description: 'Surgery status updated' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SURGEON, UserRole.NURSE, UserRole.ANESTHETIST)
  async updateSurgeryStatus(
    @Param('surgeryId', ParseUUIDPipe) surgeryId: string,
    @Body('status') status: SurgeryStatus,
    @Body('updatedById') updatedById: string,
    @Body('notes') notes?: string,
  ) {
    if (!Object.values(SurgeryStatus).includes(status)) {
      throw new BadRequestException('Invalid surgery status');
    }
    return this.otService.updateSurgeryStatus(surgeryId, status, updatedById, notes);
  }

  @Get('surgeries/patient/:patientId')
  @ApiOperation({ summary: 'Get patient\'s surgery history' })
  @ApiResponse({ status: 200, description: 'List of patient surgeries' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SURGEON, UserRole.NURSE)
  async getPatientSurgeries(@Param('patientId', ParseUUIDPipe) patientId: string) {
    return this.otService.getPatientSurgeries(patientId);
  }

  // OT Theater Endpoints
  @Post('theaters')
  @ApiOperation({ summary: 'Add a new operation theater' })
  @ApiResponse({ status: 201, description: 'Operation theater added successfully' })
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  async addTheater(@Body() createTheaterDto: CreateOTTheaterDto) {
    return this.otService.addTheater(createTheaterDto);
  }

  @Get('theaters')
  @ApiOperation({ summary: 'Get all operation theaters' })
  @ApiResponse({ status: 200, description: 'List of operation theaters' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SURGEON, UserRole.NURSE, UserRole.ANESTHETIST)
  async getTheaters(@Query('includeSchedule') includeSchedule: boolean = false) {
    return this.otService.getTheaters(includeSchedule);
  }

  @Get('theaters/:theaterId')
  @ApiOperation({ summary: 'Get operation theater by ID' })
  @ApiResponse({ status: 200, description: 'Operation theater details' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SURGEON, UserRole.NURSE, UserRole.ANESTHETIST)
  async getTheaterById(
    @Param('theaterId', ParseUUIDPipe) theaterId: string,
    @Query('includeSchedule') includeSchedule: boolean = true,
  ) {
    return this.otService.getTheaterById(theaterId, includeSchedule);
  }

  @Put('theaters/:theaterId')
  @ApiOperation({ summary: 'Update operation theater details' })
  @ApiResponse({ status: 200, description: 'Operation theater updated successfully' })
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  async updateTheater(
    @Param('theaterId', ParseUUIDPipe) theaterId: string,
    @Body() updateTheaterDto: UpdateOTTheaterDto,
  ) {
    return this.otService.updateTheater(theaterId, updateTheaterDto);
  }

  @Get('theaters/:theaterId/availability')
  @ApiOperation({ summary: 'Check theater availability' })
  @ApiResponse({ status: 200, description: 'Theater availability status' })
  @ApiQuery({ name: 'startTime', required: true, type: Date })
  @ApiQuery({ name: 'endTime', required: true, type: Date })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SURGEON, UserRole.NURSE, UserRole.ANESTHETIST)
  async checkTheaterAvailability(
    @Param('theaterId', ParseUUIDPipe) theaterId: string,
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
  ) {
    return this.otService.checkTheaterAvailability(
      theaterId,
      new Date(startTime),
      new Date(endTime),
    );
  }

  @Get('surgeries/upcoming')
  @ApiOperation({ summary: 'Get upcoming surgeries' })
  @ApiResponse({ status: 200, description: 'List of upcoming surgeries' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Number of days to look ahead (default: 7)' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SURGEON, UserRole.NURSE, UserRole.ANESTHETIST)
  async getUpcomingSurgeries(@Query('days') days: number = 7) {
    return this.otService.getUpcomingSurgeries(days);
  }

  @Get('surgeries/surgeon/:surgeonId')
  @ApiOperation({ summary: 'Get surgeon\'s schedule' })
  @ApiResponse({ status: 200, description: 'Surgeon\'s surgery schedule' })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SURGEON, UserRole.NURSE, UserRole.ANESTHETIST)
  async getSurgeonSchedule(
    @Param('surgeonId', ParseUUIDPipe) surgeonId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.otService.getSurgeonSchedule({
      surgeonId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Post('surgeries/:surgeryId/notes')
  @ApiOperation({ summary: 'Add notes to a surgery' })
  @ApiResponse({ status: 201, description: 'Notes added successfully' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SURGEON, UserRole.NURSE, UserRole.ANESTHETIST)
  async addSurgeryNotes(
    @Param('surgeryId', ParseUUIDPipe) surgeryId: string,
    @Body('notes') notes: string,
    @Body('addedById') addedById: string,
    @Body('isCritical') isCritical: boolean = false,
  ) {
    return this.otService.addSurgeryNotes(surgeryId, notes, addedById, isCritical);
  }

  @Post('surgeries/:surgeryId/complications')
  @ApiOperation({ summary: 'Record surgery complications' })
  @ApiResponse({ status: 201, description: 'Complications recorded successfully' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SURGEON)
  async recordComplications(
    @Param('surgeryId', ParseUUIDPipe) surgeryId: string,
    @Body('description') description: string,
    @Body('severity') severity: 'MILD' | 'MODERATE' | 'SEVERE',
    @Body('actionTaken') actionTaken: string,
    @Body('recordedById') recordedById: string,
  ) {
    return this.otService.recordComplications(
      surgeryId,
      description,
      severity,
      actionTaken,
      recordedById,
    );
  }

  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Get OT dashboard statistics' })
  @ApiResponse({ status: 200, description: 'OT dashboard statistics' })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SURGEON, UserRole.OT_MANAGER)
  async getOTDashboardStats() {
    return this.otService.getOTDashboardStats();
  }
}
