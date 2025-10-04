import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import {
  CreateScheduleDto, UpdateScheduleDto, CreateBookingDto, UpdateBookingDto,
  CreateTokenDto, UpdateTokenDto, CreateCounterDto, UpdateCounterDto,
  CreateReminderDto, UpdateReminderDto, CheckInDto, KioskCheckInDto,
  SearchSlotsDto, BulkRescheduleDto, BookAppointmentDto, RescheduleBookingDto,
  ScheduleQueryDto, BookingQueryDto, TokenQueryDto
} from './appointments.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly svc: AppointmentsService) {}

  // ==================== SCHEDULE MANAGEMENT ====================

  @Post('schedules')
  @Roles(Role.HOSPITAL_ADMIN, Role.DOCTOR, Role.RECEPTIONIST)
  async createSchedule(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateScheduleDto) {
    return this.svc.createSchedule(tenantId, dto);
  }

  @Get('schedules')
  @Roles(Role.HOSPITAL_ADMIN, Role.DOCTOR, Role.RECEPTIONIST, Role.PATIENT)
  async getSchedules(
    @Headers('x-tenant-id') tenantId: string,
    @Query() query: ScheduleQueryDto
  ) {
    return this.svc.getSchedules(tenantId, query.providerId, query.dayOfWeek, query.isActive);
  }

  @Get('schedules/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.DOCTOR, Role.RECEPTIONIST, Role.PATIENT)
  async getScheduleById(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.getScheduleById(tenantId, id);
  }

  @Put('schedules/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.DOCTOR, Role.RECEPTIONIST)
  async updateSchedule(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateScheduleDto
  ) {
    return this.svc.updateSchedule(tenantId, id, dto);
  }

  @Delete('schedules/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.DOCTOR, Role.RECEPTIONIST)
  async deleteSchedule(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.deleteSchedule(tenantId, id);
  }

  // ==================== SLOT MANAGEMENT ====================

  @Get('slots/search')
  @Roles(Role.HOSPITAL_ADMIN, Role.DOCTOR, Role.RECEPTIONIST, Role.PATIENT)
  async getAvailableSlots(
    @Headers('x-tenant-id') tenantId: string,
    @Query() query: SearchSlotsDto
  ) {
    return this.svc.getAvailableSlots(tenantId, query);
  }

  // ==================== BOOKING MANAGEMENT ====================

  @Post('bookings')
  @Roles(Role.HOSPITAL_ADMIN, Role.DOCTOR, Role.RECEPTIONIST, Role.PATIENT)
  async createBooking(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateBookingDto) {
    return this.svc.createBooking(tenantId, dto);
  }

  @Post('book')
  @Roles(Role.HOSPITAL_ADMIN, Role.DOCTOR, Role.RECEPTIONIST, Role.PATIENT)
  async bookAppointment(@Headers('x-tenant-id') tenantId: string, @Body() dto: BookAppointmentDto) {
    return this.svc.bookAppointment(tenantId, dto);
  }

  @Get('bookings')
  @Roles(Role.HOSPITAL_ADMIN, Role.DOCTOR, Role.RECEPTIONIST, Role.PATIENT)
  async getBookings(
    @Headers('x-tenant-id') tenantId: string,
    @Query() query: BookingQueryDto
  ) {
    return this.svc.getBookings(
      tenantId,
      query.patientId,
      query.providerId,
      query.status,
      query.fromDate,
      query.toDate,
      query.channel
    );
  }

  @Get('bookings/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.DOCTOR, Role.RECEPTIONIST, Role.PATIENT)
  async getBookingById(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.getBookingById(tenantId, id);
  }

  @Put('bookings/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.DOCTOR, Role.RECEPTIONIST, Role.PATIENT)
  async updateBooking(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateBookingDto
  ) {
    return this.svc.updateBooking(tenantId, id, dto);
  }

  @Post('bookings/:id/reschedule')
  @Roles(Role.HOSPITAL_ADMIN, Role.DOCTOR, Role.RECEPTIONIST, Role.PATIENT)
  async rescheduleBooking(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: RescheduleBookingDto
  ) {
    return this.svc.rescheduleBooking(tenantId, { ...dto, bookingId: id });
  }

  @Delete('bookings/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.DOCTOR, Role.RECEPTIONIST, Role.PATIENT)
  async cancelBooking(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Query('reason') reason?: string) {
    return this.svc.cancelBooking(tenantId, id, reason);
  }

  // ==================== TOKEN MANAGEMENT ====================

  @Post('tokens')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async createToken(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateTokenDto) {
    return this.svc.createToken(tenantId, dto);
  }

  @Get('tokens')
  @Roles(Role.HOSPITAL_ADMIN, Role.DOCTOR, Role.RECEPTIONIST)
  async getTokens(
    @Headers('x-tenant-id') tenantId: string,
    @Query() query: TokenQueryDto
  ) {
    return this.svc.getTokens(tenantId, query.bookingId, query.counterId, query.state, query.tokenNumber);
  }

  @Put('tokens/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async updateToken(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTokenDto
  ) {
    return this.svc.updateToken(tenantId, id, dto);
  }

  @Post('counters/:counterId/call-next')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async callNextToken(@Headers('x-tenant-id') tenantId: string, @Param('counterId') counterId: string) {
    return this.svc.callNextToken(tenantId, counterId);
  }

  // ==================== COUNTER MANAGEMENT ====================

  @Post('counters')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async createCounter(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateCounterDto) {
    return this.svc.createCounter(tenantId, dto);
  }

  @Get('counters')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async getCounters(@Headers('x-tenant-id') tenantId: string, @Query('isActive') isActive?: boolean) {
    return this.svc.getCounters(tenantId, isActive);
  }

  @Put('counters/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async updateCounter(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCounterDto
  ) {
    return this.svc.updateCounter(tenantId, id, dto);
  }

  // ==================== REMINDER MANAGEMENT ====================

  @Post('reminders')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async createReminder(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateReminderDto) {
    return this.svc.createReminder(tenantId, dto);
  }

  @Get('reminders')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async getReminders(
    @Headers('x-tenant-id') tenantId: string,
    @Query('bookingId') bookingId?: string,
    @Query('status') status?: string
  ) {
    return this.svc.getReminders(tenantId, bookingId, status);
  }

  @Put('reminders/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async updateReminder(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateReminderDto
  ) {
    return this.svc.updateReminder(tenantId, id, dto);
  }

  // ==================== WORKFLOWS ====================

  @Post('check-in')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST, Role.PATIENT)
  async checkIn(@Headers('x-tenant-id') tenantId: string, @Body() dto: CheckInDto) {
    return this.svc.checkIn(tenantId, dto);
  }

  @Post('kiosk-check-in')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST, Role.PATIENT)
  async kioskCheckIn(@Headers('x-tenant-id') tenantId: string, @Body() dto: KioskCheckInDto) {
    return this.svc.kioskCheckIn(tenantId, dto);
  }

  @Post('bulk-reschedule')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async bulkReschedule(@Headers('x-tenant-id') tenantId: string, @Body() dto: BulkRescheduleDto) {
    return this.svc.bulkReschedule(tenantId, dto);
  }

  // ==================== CONFIGURATION ====================

  @Post('configs')
  @Roles(Role.HOSPITAL_ADMIN)
  async createConfig(@Headers('x-tenant-id') tenantId: string, @Body() dto: any) {
    return this.svc.createConfig(tenantId, dto);
  }

  @Get('configs')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async getConfigs(@Headers('x-tenant-id') tenantId: string) {
    return this.svc.getConfigs(tenantId);
  }

  @Put('configs/:id')
  @Roles(Role.HOSPITAL_ADMIN)
  async updateConfig(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: any) {
    return this.svc.updateConfig(tenantId, id, dto);
  }

  // ==================== REPORTING ====================

  @Post('process-no-shows')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async processNoShows(@Headers('x-tenant-id') tenantId: string) {
    return this.svc.processNoShows(tenantId);
  }

  @Post('priority-rules')
  @Roles(Role.HOSPITAL_ADMIN)
  async setPriorityRules(@Headers('x-tenant-id') tenantId: string, @Body() rules: any) {
    return this.svc.setPriorityRules(tenantId, rules);
  }

  @Get('priority-rules')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async getPriorityRules(@Headers('x-tenant-id') tenantId: string) {
    return this.svc.getPriorityRules(tenantId);
  }

  @Get('reports/no-shows')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async getNoShowHistory(
    @Headers('x-tenant-id') tenantId: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string
  ) {
    return this.svc.getNoShowHistory(
      tenantId,
      fromDate ? new Date(fromDate) : undefined,
      toDate ? new Date(toDate) : undefined
    );
  }

  @Post('payments/:bookingId/process')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST, Role.PATIENT)
  async processPayment(
    @Headers('x-tenant-id') tenantId: string,
    @Param('bookingId') bookingId: string,
    @Body() paymentData: any
  ) {
    return this.svc.processPayment(tenantId, bookingId, paymentData);
  }

  @Post('payments/:bookingId/refund')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async refundPayment(
    @Headers('x-tenant-id') tenantId: string,
    @Param('bookingId') bookingId: string,
    @Body('reason') reason: string
  ) {
    return this.svc.refundPayment(tenantId, bookingId, reason);
  }

  @Post('walk-in')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST, Role.PATIENT)
  async createWalkInAppointment(@Headers('x-tenant-id') tenantId: string, @Body() dto: any) {
    return this.svc.createWalkInAppointment(tenantId, dto);
  }

  @Post('qr-code/scan')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST, Role.PATIENT)
  async scanQrCode(@Headers('x-tenant-id') tenantId: string, @Body() dto: any) {
    return this.svc.scanQrCode(tenantId, dto);
  }
}
