import { Body, Controller, Get, Headers, Param, Post, UseGuards } from '@nestjs/common';
import { IpdService } from './ipd.service';
import { IsOptional, IsString } from 'class-validator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

class CreateRoomDto { @IsString() code!: string; @IsString() type!: string; }
class AdmitDto { @IsString() patientId!: string; @IsString() roomId!: string; @IsOptional() @IsString() diagnosis?: string; @IsOptional() @IsString() notes?: string }

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('ipd')
export class IpdController {
  constructor(private svc: IpdService) {}

  @Post('rooms')
  @Roles(Role.HOSPITAL_ADMIN)
  createRoom(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateRoomDto) {
    return this.svc.createRoom(tenantId, dto);
  }

  @Get('rooms')
  listRooms(@Headers('x-tenant-id') tenantId: string) { return this.svc.listRooms(tenantId); }

  @Post('admissions')
  @Roles(Role.RECEPTIONIST, Role.DOCTOR)
  admit(@Headers('x-tenant-id') tenantId: string, @Body() dto: AdmitDto) {
    return this.svc.admit(tenantId, dto);
  }

  @Get('admissions')
  list(@Headers('x-tenant-id') tenantId: string) { return this.svc.listAdmissions(tenantId); }

  @Post('admissions/:id/discharge')
  @Roles(Role.RECEPTIONIST, Role.DOCTOR)
  discharge(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) { return this.svc.discharge(tenantId, id); }
}


