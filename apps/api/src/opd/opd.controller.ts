import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OpdService } from './opd.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

export interface CreateOpdVisitDto {
  patientId: string;
  doctorId: string;
  departmentId?: string;
  chiefComplaint: string;
  symptoms?: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  followUpDate?: Date;
  status?: 'WAITING' | 'IN_CONSULTATION' | 'COMPLETED' | 'CANCELLED';
}

export interface UpdateOpdVisitDto extends Partial<CreateOpdVisitDto> {}

@Controller('opd')
@UseGuards(JwtAuthGuard)
export class OpdController {
  constructor(private readonly opdService: OpdService) {}

  @Post('visits')
  async createVisit(
    @Body() createOpdVisitDto: CreateOpdVisitDto,
    @Request() req,
  ) {
    return this.opdService.createVisit(createOpdVisitDto, req.user.tenantId);
  }

  @Get('visits')
  async findAllVisits(@Request() req, @Query() query: any) {
    return this.opdService.findAllVisits(req.user.tenantId, query);
  }

  @Get('visits/:id')
  async findOneVisit(@Param('id') id: string, @Request() req) {
    return this.opdService.findOneVisit(id, req.user.tenantId);
  }

  @Patch('visits/:id')
  async updateVisit(
    @Param('id') id: string,
    @Body() updateOpdVisitDto: UpdateOpdVisitDto,
    @Request() req,
  ) {
    return this.opdService.updateVisit(
      id,
      updateOpdVisitDto,
      req.user.tenantId,
    );
  }

  @Delete('visits/:id')
  async removeVisit(@Param('id') id: string, @Request() req) {
    return this.opdService.removeVisit(id, req.user.tenantId);
  }

  @Get('queue')
  async getQueue(@Request() req, @Query('doctorId') doctorId?: string) {
    return this.opdService.getQueue(req.user.tenantId, doctorId);
  }

  @Get('stats')
  async getStats(@Request() req) {
    return this.opdService.getStats(req.user.tenantId);
  }
}
