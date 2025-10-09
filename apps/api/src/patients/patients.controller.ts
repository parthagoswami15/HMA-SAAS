import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

export interface CreatePatientDto {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth?: Date;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  bloodType?: string;
  maritalStatus?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  allergies?: any;
  chronicConditions?: any;
  currentMedications?: any;
  insuranceProvider?: string;
  insuranceId?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
}

export interface UpdatePatientDto extends Partial<CreatePatientDto> {}

@Controller('patients')
@UseGuards(JwtAuthGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  async create(@Body() createPatientDto: CreatePatientDto, @Request() req) {
    return this.patientsService.create(createPatientDto, req.user.tenantId);
  }

  @Get()
  async findAll(@Request() req, @Query() query: any) {
    return this.patientsService.findAll(req.user.tenantId, query);
  }

  @Get('search')
  async search(@Request() req, @Query('q') query: string) {
    return this.patientsService.search(req.user.tenantId, query);
  }

  @Get('stats')
  async getStats(@Request() req) {
    return this.patientsService.getStats(req.user.tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.patientsService.findOne(id, req.user.tenantId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto, @Request() req) {
    return this.patientsService.update(id, updatePatientDto, req.user.tenantId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.patientsService.remove(id, req.user.tenantId);
  }
}