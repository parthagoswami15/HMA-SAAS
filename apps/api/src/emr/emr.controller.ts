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
import { EmrService } from './emr.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

export interface CreateMedicalRecordDto {
  patientId: string;
  recordType: string;
  title: string;
  description?: string;
  date?: Date;
  doctorId?: string;
}

export interface UpdateMedicalRecordDto extends Partial<CreateMedicalRecordDto> {}

@Controller('emr')
@UseGuards(JwtAuthGuard)
export class EmrController {
  constructor(private readonly emrService: EmrService) {}

  @Post('records')
  create(@Body() createDto: CreateMedicalRecordDto, @Request() req) {
    return this.emrService.create(createDto, req.user.tenantId, req.user.id);
  }

  @Get('records')
  findAll(@Request() req, @Query() query: any) {
    return this.emrService.findAll(req.user.tenantId, query);
  }

  @Get('records/patient/:patientId')
  findByPatient(@Param('patientId') patientId: string, @Request() req) {
    return this.emrService.findByPatient(patientId, req.user.tenantId);
  }

  @Get('records/:id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.emrService.findOne(id, req.user.tenantId);
  }

  @Patch('records/:id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateMedicalRecordDto,
    @Request() req,
  ) {
    return this.emrService.update(id, updateDto, req.user.tenantId, req.user.id);
  }

  @Delete('records/:id')
  remove(@Param('id') id: string, @Request() req) {
    return this.emrService.remove(id, req.user.tenantId);
  }

  @Get('stats')
  getStats(@Request() req) {
    return this.emrService.getStats(req.user.tenantId);
  }
}
