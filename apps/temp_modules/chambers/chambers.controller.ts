import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { Role } from '@prisma/client';
import { ChambersService } from './chambers.service';
import { CreateChamberDto, UpdateChamberDto } from './dto/chamber.dto';

@Controller('chambers')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class ChambersController {
  constructor(private chambersService: ChambersService) {}

  @Post()
  @Roles(Role.DOCTOR, Role.HOSPITAL_ADMIN, Role.OWNER)
  async createChamber(
    @CurrentTenant() tenant: any,
    @CurrentUser() user: any,
    @Body() createChamberDto: CreateChamberDto,
  ) {
    return this.chambersService.createChamber(tenant.id, user.id, createChamberDto);
  }

  @Get()
  @Roles(Role.DOCTOR, Role.HOSPITAL_ADMIN, Role.OWNER, Role.RECEPTIONIST)
  async getChambers(
    @CurrentTenant() tenant: any,
    @Query('doctorId') doctorId?: string,
  ) {
    return this.chambersService.getChambers(tenant.id, doctorId);
  }

  @Get(':id')
  @Roles(Role.DOCTOR, Role.HOSPITAL_ADMIN, Role.OWNER, Role.RECEPTIONIST)
  async getChamberById(
    @CurrentTenant() tenant: any,
    @Param('id') id: string,
  ) {
    return this.chambersService.getChamberById(tenant.id, id);
  }

  @Put(':id')
  @Roles(Role.DOCTOR, Role.HOSPITAL_ADMIN, Role.OWNER)
  async updateChamber(
    @CurrentTenant() tenant: any,
    @Param('id') id: string,
    @Body() updateChamberDto: UpdateChamberDto,
  ) {
    return this.chambersService.updateChamber(tenant.id, id, updateChamberDto);
  }

  @Delete(':id')
  @Roles(Role.DOCTOR, Role.HOSPITAL_ADMIN, Role.OWNER)
  async deleteChamber(
    @CurrentTenant() tenant: any,
    @Param('id') id: string,
  ) {
    return this.chambersService.deleteChamber(tenant.id, id);
  }

  @Post(':id/appointments')
  @Roles(Role.DOCTOR, Role.HOSPITAL_ADMIN, Role.OWNER, Role.RECEPTIONIST)
  async bookAppointment(
    @CurrentTenant() tenant: any,
    @Param('id') chamberId: string,
    @Body() appointmentData: any,
  ) {
    return this.chambersService.bookAppointment(tenant.id, chamberId, appointmentData);
  }
}
