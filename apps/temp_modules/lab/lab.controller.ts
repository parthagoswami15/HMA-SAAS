import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
import { LabService } from './lab.service';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '@prisma/client';

class CreateTestDto {
  @IsString() name: string;
  @IsString() code: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsNumber() priceCents?: number;
  @IsOptional() @IsString() currency?: string;
}

class OrderTestDto {
  @IsString() patientId: string;
  @IsString() testId: string;
}

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('lab')
export class LabController {
  constructor(private svc: LabService) {}

  @Post('tests')
  @Roles(Role.HOSPITAL_ADMIN)
  createTest(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateTestDto) {
    return this.svc.createTest(tenantId, dto);
  }

  @Get('tests')
  listTests(@Headers('x-tenant-id') tenantId: string) {
    return this.svc.listTests(tenantId);
  }

  @Post('orders')
  @Roles(Role.DOCTOR, Role.LAB_TECHNICIAN)
  order(@Headers('x-tenant-id') tenantId: string, @Body() dto: OrderTestDto) {
    return this.svc.orderTest(tenantId, dto);
  }

  @Get('orders')
  listOrders(@Headers('x-tenant-id') tenantId: string) {
    return this.svc.listOrders(tenantId);
  }
}


