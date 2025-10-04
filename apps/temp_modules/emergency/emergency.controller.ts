import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { Role } from '@prisma/client';
import { EmergencyService } from './emergency.service';
import { CreateEmergencyCaseDto, UpdateEmergencyCaseDto } from './dto/emergency.dto';

@Controller('emergency')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class EmergencyController {
  constructor(private emergencyService: EmergencyService) {}

  @Post('cases')
  @Roles(Role.DOCTOR, Role.NURSE, Role.HOSPITAL_ADMIN, Role.OWNER)
  async createEmergencyCase(
    @CurrentTenant() tenant: any,
    @Body() createEmergencyCaseDto: CreateEmergencyCaseDto,
  ) {
    return this.emergencyService.createEmergencyCase(tenant.id, createEmergencyCaseDto);
  }

  @Get('cases')
  @Roles(Role.DOCTOR, Role.NURSE, Role.HOSPITAL_ADMIN, Role.OWNER)
  async getEmergencyCases(
    @CurrentTenant() tenant: any,
    @Query('status') status?: string,
  ) {
    return this.emergencyService.getEmergencyCases(tenant.id, status);
  }

  @Get('cases/:id')
  @Roles(Role.DOCTOR, Role.NURSE, Role.HOSPITAL_ADMIN, Role.OWNER)
  async getEmergencyCaseById(
    @CurrentTenant() tenant: any,
    @Param('id') id: string,
  ) {
    return this.emergencyService.getEmergencyCaseById(tenant.id, id);
  }

  @Put('cases/:id')
  @Roles(Role.DOCTOR, Role.NURSE, Role.HOSPITAL_ADMIN, Role.OWNER)
  async updateEmergencyCase(
    @CurrentTenant() tenant: any,
    @Param('id') id: string,
    @Body() updateEmergencyCaseDto: UpdateEmergencyCaseDto,
  ) {
    return this.emergencyService.updateEmergencyCase(tenant.id, id, updateEmergencyCaseDto);
  }

  @Put('cases/:id/discharge')
  @Roles(Role.DOCTOR, Role.HOSPITAL_ADMIN, Role.OWNER)
  async dischargeEmergencyCase(
    @CurrentTenant() tenant: any,
    @Param('id') id: string,
    @Body('notes') notes?: string,
  ) {
    return this.emergencyService.dischargeEmergencyCase(tenant.id, id, notes);
  }

  @Put('cases/:id/admit')
  @Roles(Role.DOCTOR, Role.HOSPITAL_ADMIN, Role.OWNER)
  async admitEmergencyCase(
    @CurrentTenant() tenant: any,
    @Param('id') id: string,
    @Body('roomId') roomId?: string,
  ) {
    return this.emergencyService.admitEmergencyCase(tenant.id, id, roomId);
  }

  @Get('stats/triage')
  @Roles(Role.DOCTOR, Role.NURSE, Role.HOSPITAL_ADMIN, Role.OWNER)
  async getTriageStats(@CurrentTenant() tenant: any) {
    return this.emergencyService.getTriageStats(tenant.id);
  }
}
