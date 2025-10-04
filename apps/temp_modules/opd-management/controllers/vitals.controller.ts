import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  ParseUUIDPipe,
  Delete,
  Patch
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiQuery
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/enums/user-role.enum';
import { VitalsService } from '../services/vitals.service';
import { CreateVitalsDto } from '../dto/vitals/create-vitals.dto';
import { UpdateVitalsDto } from '../dto/vitals/update-vitals.dto';
import { Vitals } from '../entities/vitals.entity';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';

@ApiTags('OPD - Vitals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('opd/vitals')
export class VitalsController {
  constructor(private readonly vitalsService: VitalsService) {}

  @Post()
  @Roles(UserRole.NURSE, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Record new vitals' })
  @ApiResponse({ status: 201, description: 'Vitals recorded successfully', type: Vitals })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Patient or visit not found' })
  create(
    @Body() createVitalsDto: CreateVitalsDto,
    @CurrentUser() user: User
  ): Promise<Vitals> {
    return this.vitalsService.create(createVitalsDto, user.id);
  }

  @Get()
  @Roles(UserRole.NURSE, UserRole.DOCTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all vitals with optional filters' })
  @ApiQuery({ name: 'patientId', required: false, type: String })
  @ApiQuery({ name: 'visitId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of vitals', type: [Vitals] })
  findAll(
    @Query('patientId') patientId?: string,
    @Query('visitId') visitId?: string,
  ): Promise<Vitals[]> {
    return this.vitalsService.findAll({ patientId, visitId });
  }

  @Get(':id')
  @Roles(UserRole.NURSE, UserRole.DOCTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get vitals by ID' })
  @ApiResponse({ status: 200, description: 'Vitals details', type: Vitals })
  @ApiResponse({ status: 404, description: 'Vitals not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Vitals> {
    return this.vitalsService.findOne(id);
  }

  @Get('patient/:patientId/latest')
  @Roles(UserRole.NURSE, UserRole.DOCTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get the most recent vitals for a patient' })
  @ApiResponse({ status: 200, description: 'Latest vitals', type: Vitals })
  @ApiResponse({ status: 404, description: 'No vitals found for patient' })
  getLastVitals(@Param('patientId', ParseUUIDPipe) patientId: string): Promise<Partial<Vitals>> {
    return this.vitalsService.getLastVitals(patientId);
  }

  @Get('patient/:patientId/trends')
  @Roles(UserRole.DOCTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get vitals trends for a patient' })
  @ApiQuery({ name: 'metric', required: true, enum: ['temperature', 'heartRate', 'bloodPressure', 'oxygenSaturation', 'weight', 'bmi'] })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Number of days to look back (default: 30)' })
  @ApiResponse({ status: 200, description: 'Vitals trends data' })
  getVitalsTrends(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('metric') metric: keyof Vitals,
    @Query('days') days = 30
  ) {
    return this.vitalsService.getPatientVitalsTrends(patientId, metric, Number(days));
  }

  @Patch(':id')
  @Roles(UserRole.NURSE, UserRole.DOCTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update vitals' })
  @ApiResponse({ status: 200, description: 'Vitals updated successfully', type: Vitals })
  @ApiResponse({ status: 404, description: 'Vitals not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVitalsDto: UpdateVitalsDto
  ): Promise<Vitals> {
    return this.vitalsService.update(id, updateVitalsDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Delete vitals' })
  @ApiResponse({ status: 200, description: 'Vitals deleted successfully' })
  @ApiResponse({ status: 404, description: 'Vitals not found' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.vitalsService.remove(id);
  }

  @Get('visit/:visitId')
  @Roles(UserRole.NURSE, UserRole.DOCTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all vitals for a specific visit' })
  @ApiResponse({ status: 200, description: 'List of vitals for the visit', type: [Vitals] })
  getVitalsByVisit(@Param('visitId', ParseUUIDPipe) visitId: string): Promise<Vitals[]> {
    return this.vitalsService.getVitalsByVisit(visitId);
  }
}
