"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsController = void 0;
const common_1 = require("@nestjs/common");
const appointments_service_1 = require("./appointments.service");
const appointments_dto_1 = require("./appointments.dto");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let AppointmentsController = class AppointmentsController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    async createSchedule(tenantId, dto) {
        return this.svc.createSchedule(tenantId, dto);
    }
    async getSchedules(tenantId, query) {
        return this.svc.getSchedules(tenantId, query.providerId, query.dayOfWeek, query.isActive);
    }
    async getScheduleById(tenantId, id) {
        return this.svc.getScheduleById(tenantId, id);
    }
    async updateSchedule(tenantId, id, dto) {
        return this.svc.updateSchedule(tenantId, id, dto);
    }
    async deleteSchedule(tenantId, id) {
        return this.svc.deleteSchedule(tenantId, id);
    }
    async getAvailableSlots(tenantId, query) {
        return this.svc.getAvailableSlots(tenantId, query);
    }
    async createBooking(tenantId, dto) {
        return this.svc.createBooking(tenantId, dto);
    }
    async bookAppointment(tenantId, dto) {
        return this.svc.bookAppointment(tenantId, dto);
    }
    async getBookings(tenantId, query) {
        return this.svc.getBookings(tenantId, query.patientId, query.providerId, query.status, query.fromDate, query.toDate, query.channel);
    }
    async getBookingById(tenantId, id) {
        return this.svc.getBookingById(tenantId, id);
    }
    async updateBooking(tenantId, id, dto) {
        return this.svc.updateBooking(tenantId, id, dto);
    }
    async rescheduleBooking(tenantId, id, dto) {
        return this.svc.rescheduleBooking(tenantId, { ...dto, bookingId: id });
    }
    async cancelBooking(tenantId, id, reason) {
        return this.svc.cancelBooking(tenantId, id, reason);
    }
    async createToken(tenantId, dto) {
        return this.svc.createToken(tenantId, dto);
    }
    async getTokens(tenantId, query) {
        return this.svc.getTokens(tenantId, query.bookingId, query.counterId, query.state, query.tokenNumber);
    }
    async updateToken(tenantId, id, dto) {
        return this.svc.updateToken(tenantId, id, dto);
    }
    async callNextToken(tenantId, counterId) {
        return this.svc.callNextToken(tenantId, counterId);
    }
    async createCounter(tenantId, dto) {
        return this.svc.createCounter(tenantId, dto);
    }
    async getCounters(tenantId, isActive) {
        return this.svc.getCounters(tenantId, isActive);
    }
    async updateCounter(tenantId, id, dto) {
        return this.svc.updateCounter(tenantId, id, dto);
    }
    async createReminder(tenantId, dto) {
        return this.svc.createReminder(tenantId, dto);
    }
    async getReminders(tenantId, bookingId, status) {
        return this.svc.getReminders(tenantId, bookingId, status);
    }
    async updateReminder(tenantId, id, dto) {
        return this.svc.updateReminder(tenantId, id, dto);
    }
    async checkIn(tenantId, dto) {
        return this.svc.checkIn(tenantId, dto);
    }
    async kioskCheckIn(tenantId, dto) {
        return this.svc.kioskCheckIn(tenantId, dto);
    }
    async bulkReschedule(tenantId, dto) {
        return this.svc.bulkReschedule(tenantId, dto);
    }
    async createConfig(tenantId, dto) {
        return this.svc.createConfig(tenantId, dto);
    }
    async getConfigs(tenantId) {
        return this.svc.getConfigs(tenantId);
    }
    async updateConfig(tenantId, id, dto) {
        return this.svc.updateConfig(tenantId, id, dto);
    }
    async processNoShows(tenantId) {
        return this.svc.processNoShows(tenantId);
    }
    async setPriorityRules(tenantId, rules) {
        return this.svc.setPriorityRules(tenantId, rules);
    }
    async getPriorityRules(tenantId) {
        return this.svc.getPriorityRules(tenantId);
    }
    async getNoShowHistory(tenantId, fromDate, toDate) {
        return this.svc.getNoShowHistory(tenantId, fromDate ? new Date(fromDate) : undefined, toDate ? new Date(toDate) : undefined);
    }
    async processPayment(tenantId, bookingId, paymentData) {
        return this.svc.processPayment(tenantId, bookingId, paymentData);
    }
    async refundPayment(tenantId, bookingId, reason) {
        return this.svc.refundPayment(tenantId, bookingId, reason);
    }
    async createWalkInAppointment(tenantId, dto) {
        return this.svc.createWalkInAppointment(tenantId, dto);
    }
    async scanQrCode(tenantId, dto) {
        return this.svc.scanQrCode(tenantId, dto);
    }
};
exports.AppointmentsController = AppointmentsController;
__decorate([
    (0, common_1.Post)('schedules'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.DOCTOR, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, appointments_dto_1.CreateScheduleDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "createSchedule", null);
__decorate([
    (0, common_1.Get)('schedules'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.DOCTOR, client_1.Role.RECEPTIONIST, client_1.Role.PATIENT),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, appointments_dto_1.ScheduleQueryDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getSchedules", null);
__decorate([
    (0, common_1.Get)('schedules/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.DOCTOR, client_1.Role.RECEPTIONIST, client_1.Role.PATIENT),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getScheduleById", null);
__decorate([
    (0, common_1.Put)('schedules/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.DOCTOR, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, appointments_dto_1.UpdateScheduleDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "updateSchedule", null);
__decorate([
    (0, common_1.Delete)('schedules/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.DOCTOR, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "deleteSchedule", null);
__decorate([
    (0, common_1.Get)('slots/search'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.DOCTOR, client_1.Role.RECEPTIONIST, client_1.Role.PATIENT),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, appointments_dto_1.SearchSlotsDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getAvailableSlots", null);
__decorate([
    (0, common_1.Post)('bookings'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.DOCTOR, client_1.Role.RECEPTIONIST, client_1.Role.PATIENT),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, appointments_dto_1.CreateBookingDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "createBooking", null);
__decorate([
    (0, common_1.Post)('book'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.DOCTOR, client_1.Role.RECEPTIONIST, client_1.Role.PATIENT),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, appointments_dto_1.BookAppointmentDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "bookAppointment", null);
__decorate([
    (0, common_1.Get)('bookings'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.DOCTOR, client_1.Role.RECEPTIONIST, client_1.Role.PATIENT),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, appointments_dto_1.BookingQueryDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getBookings", null);
__decorate([
    (0, common_1.Get)('bookings/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.DOCTOR, client_1.Role.RECEPTIONIST, client_1.Role.PATIENT),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getBookingById", null);
__decorate([
    (0, common_1.Put)('bookings/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.DOCTOR, client_1.Role.RECEPTIONIST, client_1.Role.PATIENT),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, appointments_dto_1.UpdateBookingDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "updateBooking", null);
__decorate([
    (0, common_1.Post)('bookings/:id/reschedule'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.DOCTOR, client_1.Role.RECEPTIONIST, client_1.Role.PATIENT),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, appointments_dto_1.RescheduleBookingDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "rescheduleBooking", null);
__decorate([
    (0, common_1.Delete)('bookings/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.DOCTOR, client_1.Role.RECEPTIONIST, client_1.Role.PATIENT),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "cancelBooking", null);
__decorate([
    (0, common_1.Post)('tokens'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, appointments_dto_1.CreateTokenDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "createToken", null);
__decorate([
    (0, common_1.Get)('tokens'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.DOCTOR, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, appointments_dto_1.TokenQueryDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getTokens", null);
__decorate([
    (0, common_1.Put)('tokens/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, appointments_dto_1.UpdateTokenDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "updateToken", null);
__decorate([
    (0, common_1.Post)('counters/:counterId/call-next'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('counterId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "callNextToken", null);
__decorate([
    (0, common_1.Post)('counters'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, appointments_dto_1.CreateCounterDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "createCounter", null);
__decorate([
    (0, common_1.Get)('counters'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getCounters", null);
__decorate([
    (0, common_1.Put)('counters/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, appointments_dto_1.UpdateCounterDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "updateCounter", null);
__decorate([
    (0, common_1.Post)('reminders'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, appointments_dto_1.CreateReminderDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "createReminder", null);
__decorate([
    (0, common_1.Get)('reminders'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('bookingId')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getReminders", null);
__decorate([
    (0, common_1.Put)('reminders/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, appointments_dto_1.UpdateReminderDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "updateReminder", null);
__decorate([
    (0, common_1.Post)('check-in'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST, client_1.Role.PATIENT),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, appointments_dto_1.CheckInDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "checkIn", null);
__decorate([
    (0, common_1.Post)('kiosk-check-in'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST, client_1.Role.PATIENT),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, appointments_dto_1.KioskCheckInDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "kioskCheckIn", null);
__decorate([
    (0, common_1.Post)('bulk-reschedule'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, appointments_dto_1.BulkRescheduleDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "bulkReschedule", null);
__decorate([
    (0, common_1.Post)('configs'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "createConfig", null);
__decorate([
    (0, common_1.Get)('configs'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getConfigs", null);
__decorate([
    (0, common_1.Put)('configs/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "updateConfig", null);
__decorate([
    (0, common_1.Post)('process-no-shows'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "processNoShows", null);
__decorate([
    (0, common_1.Post)('priority-rules'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "setPriorityRules", null);
__decorate([
    (0, common_1.Get)('priority-rules'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getPriorityRules", null);
__decorate([
    (0, common_1.Get)('reports/no-shows'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Query)('fromDate')),
    __param(2, (0, common_1.Query)('toDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getNoShowHistory", null);
__decorate([
    (0, common_1.Post)('payments/:bookingId/process'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST, client_1.Role.PATIENT),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('bookingId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "processPayment", null);
__decorate([
    (0, common_1.Post)('payments/:bookingId/refund'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Param)('bookingId')),
    __param(2, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "refundPayment", null);
__decorate([
    (0, common_1.Post)('walk-in'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST, client_1.Role.PATIENT),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "createWalkInAppointment", null);
__decorate([
    (0, common_1.Post)('qr-code/scan'),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.RECEPTIONIST, client_1.Role.PATIENT),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "scanQrCode", null);
exports.AppointmentsController = AppointmentsController = __decorate([
    (0, common_1.Controller)('appointments'),
    __metadata("design:paramtypes", [appointments_service_1.AppointmentsService])
], AppointmentsController);
//# sourceMappingURL=appointments.controller.js.map