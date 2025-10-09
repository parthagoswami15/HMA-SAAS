import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAppointmentDto, UpdateAppointmentDto, AppointmentQueryDto } from './dto/appointment.dto';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto, @Request() req) {
    return this.appointmentsService.create(req.user.tenantId, createAppointmentDto);
  }

  @Get()
  async findAll(@Request() req, @Query() query: any) {
    return this.appointmentsService.findAll(req.user.tenantId, query);
  }

  @Get('calendar')
  async getCalendar(@Request() req, @Query() query: any) {
    return this.appointmentsService.getCalendar(req.user.tenantId, query);
  }

  @Get('availability')
  async checkAvailability(@Request() req, @Query() query: any) {
    return this.appointmentsService.checkAvailability(req.user.tenantId, query);
  }

  @Get('stats')
  async getStats(@Request() req) {
    return this.appointmentsService.getStats(req.user.tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.appointmentsService.findOne(req.user.tenantId, id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto, @Request() req) {
    return this.appointmentsService.update(req.user.tenantId, id, updateAppointmentDto);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() body: { status: string }, @Request() req) {
    return this.appointmentsService.updateStatus(id, body.status, req.user.tenantId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.appointmentsService.remove(req.user.tenantId, id);
  }
}