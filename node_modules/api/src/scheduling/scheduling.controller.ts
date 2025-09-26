import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { IsDateString, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

class CreateScheduleDto {
  @IsString() doctorId: string;
  @IsInt() @Min(0) @Max(6) dayOfWeek: number;
  @IsString() startTime: string;
  @IsString() endTime: string;
  @IsOptional() @IsString() location?: string;
}

class CreateAppointmentDto {
  @IsString() patientId: string;
  @IsString() doctorId: string;
  @IsDateString() startsAt: string;
  @IsDateString() endsAt: string;
  @IsOptional() @IsString() notes?: string;
}

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('scheduling')
export class SchedulingController {
  constructor(private svc: SchedulingService) {}

  @Post('schedules')
  @Roles(Role.HOSPITAL_ADMIN)
  createSchedule(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateScheduleDto) {
    return this.svc.createSchedule(tenantId, dto as any);
  }

  @Get('schedules')
  listSchedules(@Headers('x-tenant-id') tenantId: string) {
    return this.svc.listSchedules(tenantId);
  }

  @Post('appointments')
  @Roles(Role.RECEPTIONIST, Role.DOCTOR)
  createAppointment(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateAppointmentDto) {
    return this.svc.createAppointment(tenantId, { ...dto, startsAt: new Date(dto.startsAt), endsAt: new Date(dto.endsAt) });
  }

  @Get('appointments')
  listAppointments(@Headers('x-tenant-id') tenantId: string) {
    return this.svc.listAppointments(tenantId);
  }

  @Patch('appointments/:id')
  @Roles(Role.RECEPTIONIST, Role.DOCTOR)
  updateAppointment(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: Partial<CreateAppointmentDto>) {
    const payload: any = { ...dto };
    if (dto.startsAt) payload.startsAt = new Date(dto.startsAt);
    if (dto.endsAt) payload.endsAt = new Date(dto.endsAt);
    return this.svc.updateAppointment(tenantId, id, payload);
  }

  @Delete('appointments/:id')
  @Roles(Role.RECEPTIONIST, Role.DOCTOR)
  cancel(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.cancelAppointment(tenantId, id);
  }
}


