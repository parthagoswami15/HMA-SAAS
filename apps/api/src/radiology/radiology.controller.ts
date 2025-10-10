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
  Req,
} from '@nestjs/common';
import { RadiologyService } from './radiology.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface CreateStudyDto {
  patientId: string;
  modalityId: string;
  description?: string;
  notes?: string;
  priority?: 'STAT' | 'HIGH' | 'ROUTINE' | 'LOW';
}

interface CreateReportDto {
  studyId: string;
  findings?: string;
  impression?: string;
  conclusion?: string;
  reportTemplateId?: string;
}

interface CreateRadiologyOrderDto {
  consultationId: string;
  patientId: string;
  doctorId: string;
  modalityId: string;
  studyType: string;
  priority?: 'STAT' | 'HIGH' | 'ROUTINE' | 'LOW';
  reason?: string;
  clinicalHistory?: string;
  scheduledAt?: Date;
}

@Controller('radiology')
@UseGuards(JwtAuthGuard)
export class RadiologyController {
  constructor(private readonly radiologyService: RadiologyService) {}

  // Studies
  @Post('studies')
  createStudy(@Body() createDto: CreateStudyDto, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.radiologyService.createStudy(createDto, tenantId);
  }

  @Get('studies')
  findAllStudies(@Req() req: any, @Query() query: any) {
    const tenantId = req.user.tenantId;
    return this.radiologyService.findAllStudies(tenantId, query);
  }

  @Get('studies/:id')
  findOneStudy(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.radiologyService.findOneStudy(id, tenantId);
  }

  @Patch('studies/:id')
  updateStudy(
    @Param('id') id: string,
    @Body() updateDto: Partial<CreateStudyDto>,
    @Req() req: any,
  ) {
    const tenantId = req.user.tenantId;
    return this.radiologyService.updateStudy(id, updateDto, tenantId);
  }

  @Delete('studies/:id')
  removeStudy(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.radiologyService.removeStudy(id, tenantId);
  }

  // Reports
  @Post('reports')
  createReport(@Body() createDto: CreateReportDto, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.radiologyService.createReport(createDto, tenantId);
  }

  @Get('reports')
  findAllReports(@Req() req: any, @Query() query: any) {
    const tenantId = req.user.tenantId;
    return this.radiologyService.findAllReports(tenantId, query);
  }

  @Get('reports/:id')
  findOneReport(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.radiologyService.findOneReport(id, tenantId);
  }

  @Patch('reports/:id')
  updateReport(
    @Param('id') id: string,
    @Body() updateDto: Partial<CreateReportDto>,
    @Req() req: any,
  ) {
    const tenantId = req.user.tenantId;
    return this.radiologyService.updateReport(id, updateDto, tenantId);
  }

  // Orders
  @Post('orders')
  createOrder(@Body() createDto: CreateRadiologyOrderDto, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.radiologyService.createOrder(createDto, tenantId);
  }

  @Get('orders')
  findAllOrders(@Req() req: any, @Query() query: any) {
    const tenantId = req.user.tenantId;
    return this.radiologyService.findAllOrders(tenantId, query);
  }

  @Get('orders/:id')
  findOneOrder(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.radiologyService.findOneOrder(id, tenantId);
  }

  @Patch('orders/:id')
  updateOrder(
    @Param('id') id: string,
    @Body() updateDto: Partial<CreateRadiologyOrderDto>,
    @Req() req: any,
  ) {
    const tenantId = req.user.tenantId;
    return this.radiologyService.updateOrder(id, updateDto, tenantId);
  }

  @Get('stats')
  getStats(@Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.radiologyService.getStats(tenantId);
  }
}
