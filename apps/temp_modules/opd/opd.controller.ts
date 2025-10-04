import { Body, Controller, Get, Headers, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { OpdService } from './opd.service';
import { IsOptional, IsString } from 'class-validator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

class CreateEncounterDto {
  @IsString() patientId!: string;
  @IsString() doctorId!: string;
  @IsString() type!: string; // OPD | IPD | EMERGENCY
  @IsOptional() @IsString() diagnosis?: string;
  @IsOptional() @IsString() notes?: string;
}

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('opd')
export class OpdController {
  constructor(private svc: OpdService) {}

  @Post('encounters')
  @Roles(Role.DOCTOR)
  create(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateEncounterDto) {
    return this.svc.createEncounter(tenantId, dto as any);
  }

  @Get('encounters')
  list(@Headers('x-tenant-id') tenantId: string) { return this.svc.listEncounters(tenantId); }

  @Patch('encounters/:id')
  @Roles(Role.DOCTOR)
  update(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: Partial<CreateEncounterDto>) {
    return this.svc.updateEncounter(tenantId, id, dto);
  }
}


