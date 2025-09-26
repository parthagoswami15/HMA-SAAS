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
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const notifications_service_1 = require("./notifications.service");
const template_service_1 = require("./services/template.service");
const thread_service_1 = require("./services/thread.service");
const scheduler_service_1 = require("./services/scheduler.service");
const notification_dto_1 = require("./dto/notification.dto");
const template_dto_1 = require("./dto/template.dto");
const thread_dto_1 = require("./dto/thread.dto");
let NotificationsController = class NotificationsController {
    notificationsService;
    templateService;
    threadService;
    schedulerService;
    constructor(notificationsService, templateService, threadService, schedulerService) {
        this.notificationsService = notificationsService;
        this.templateService = templateService;
        this.threadService = threadService;
        this.schedulerService = schedulerService;
    }
    async createNotification(createDto, req) {
        return this.notificationsService.createNotification(createDto, req.user);
    }
    async getNotifications(query, req) {
        return this.notificationsService.getNotifications(query, req.user);
    }
    async getNotification(id, req) {
        return this.notificationsService.getNotification(id, req.user);
    }
    async updateNotification(id, updateDto, req) {
        return this.notificationsService.updateNotification(id, updateDto, req.user);
    }
    async deleteNotification(id, req) {
        await this.notificationsService.deleteNotification(id, req.user);
    }
    async sendBulkNotification(bulkDto, req) {
        return this.notificationsService.sendBulkNotification(bulkDto, req.user);
    }
    async scheduleBulkNotification(bulkDto, req) {
        return this.schedulerService.scheduleBulkNotification(bulkDto, req.user);
    }
    async createTemplate(createDto, req) {
        return this.templateService.createTemplate(createDto, req.user);
    }
    async getTemplates(query, req) {
        return this.templateService.getTemplates(query, req.user);
    }
    async getTemplate(id, req) {
        return this.templateService.getTemplate(id, req.user);
    }
    async updateTemplate(id, updateDto, req) {
        return this.templateService.updateTemplate(id, updateDto, req.user);
    }
    async deleteTemplate(id, req) {
        await this.templateService.deleteTemplate(id, req.user);
    }
    async createThread(threadDto, req) {
        return this.threadService.createThread(threadDto, req.user);
    }
    async getThreads(query, req) {
        return this.threadService.getThreads(query, req.user);
    }
    async getThread(id, req) {
        return this.threadService.getThread(id, req.user);
    }
    async sendMessage(threadId, messageDto, req) {
        return this.threadService.sendMessage(threadId, messageDto, req.user);
    }
    async closeThread(id, req) {
        return this.threadService.closeThread(id, req.user);
    }
    async sendSms(smsDto, req) {
        return this.notificationsService.sendSms(smsDto, req.user);
    }
    async sendEmail(emailDto, req) {
        return this.notificationsService.sendEmail(emailDto, req.user);
    }
    async sendWhatsApp(whatsappDto, req) {
        return this.notificationsService.sendWhatsApp(whatsappDto, req.user);
    }
    async makeIvrCall(ivrDto, req) {
        return this.notificationsService.makeIvrCall(ivrDto, req.user);
    }
    async getNotificationPreferences(userId, req) {
        return this.notificationsService.getNotificationPreferences(userId, req.user);
    }
    async updateNotificationPreferences(userId, preferencesDto, req) {
        return this.notificationsService.updateNotificationPreferences(userId, preferencesDto, req.user);
    }
    async getNotificationSummary(query, req) {
        return this.notificationsService.getNotificationSummary(query, req.user);
    }
    async getDeliveryReport(query, req) {
        return this.notificationsService.getDeliveryReport(query, req.user);
    }
    async getChannelPerformance(query, req) {
        return this.notificationsService.getChannelPerformance(query, req.user);
    }
    async getScheduledNotifications(query, req) {
        return this.schedulerService.getScheduledNotifications(query, req.user);
    }
    async cancelScheduledNotification(id, req) {
        return this.schedulerService.cancelScheduledNotification(id, req.user);
    }
    async testSms(testDto, req) {
        return this.notificationsService.testSms(testDto, req.user);
    }
    async testEmail(testDto, req) {
        return this.notificationsService.testEmail(testDto, req.user);
    }
    async testWhatsApp(testDto, req) {
        return this.notificationsService.testWhatsApp(testDto, req.user);
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notification_dto_1.CreateNotificationDto, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "createNotification", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notification_dto_1.NotificationQueryDto, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getNotification", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, notification_dto_1.UpdateNotificationDto, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "updateNotification", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "deleteNotification", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notification_dto_1.BulkNotificationDto, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendBulkNotification", null);
__decorate([
    (0, common_1.Post)('bulk/schedule'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notification_dto_1.BulkNotificationDto, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "scheduleBulkNotification", null);
__decorate([
    (0, common_1.Post)('templates'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof template_dto_1.CreateTemplateDto !== "undefined" && template_dto_1.CreateTemplateDto) === "function" ? _a : Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Get)('templates'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof template_dto_1.TemplateQueryDto !== "undefined" && template_dto_1.TemplateQueryDto) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getTemplates", null);
__decorate([
    (0, common_1.Get)('templates/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getTemplate", null);
__decorate([
    (0, common_1.Put)('templates/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof template_dto_1.UpdateTemplateDto !== "undefined" && template_dto_1.UpdateTemplateDto) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "updateTemplate", null);
__decorate([
    (0, common_1.Delete)('templates/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "deleteTemplate", null);
__decorate([
    (0, common_1.Post)('threads'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof thread_dto_1.MessageThreadDto !== "undefined" && thread_dto_1.MessageThreadDto) === "function" ? _d : Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "createThread", null);
__decorate([
    (0, common_1.Get)('threads'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof thread_dto_1.ThreadQueryDto !== "undefined" && thread_dto_1.ThreadQueryDto) === "function" ? _e : Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getThreads", null);
__decorate([
    (0, common_1.Get)('threads/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getThread", null);
__decorate([
    (0, common_1.Post)('threads/:id/messages'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_f = typeof thread_dto_1.SendMessageDto !== "undefined" && thread_dto_1.SendMessageDto) === "function" ? _f : Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Put)('threads/:id/close'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "closeThread", null);
__decorate([
    (0, common_1.Post)('sms/send'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendSms", null);
__decorate([
    (0, common_1.Post)('email/send'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendEmail", null);
__decorate([
    (0, common_1.Post)('whatsapp/send'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendWhatsApp", null);
__decorate([
    (0, common_1.Post)('ivr/call'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "makeIvrCall", null);
__decorate([
    (0, common_1.Get)('preferences/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getNotificationPreferences", null);
__decorate([
    (0, common_1.Put)('preferences/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "updateNotificationPreferences", null);
__decorate([
    (0, common_1.Get)('reports/summary'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getNotificationSummary", null);
__decorate([
    (0, common_1.Get)('reports/delivery'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getDeliveryReport", null);
__decorate([
    (0, common_1.Get)('reports/channel-performance'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getChannelPerformance", null);
__decorate([
    (0, common_1.Get)('scheduled'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getScheduledNotifications", null);
__decorate([
    (0, common_1.Put)('scheduled/:id/cancel'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "cancelScheduledNotification", null);
__decorate([
    (0, common_1.Post)('test/sms'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "testSms", null);
__decorate([
    (0, common_1.Post)('test/email'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "testEmail", null);
__decorate([
    (0, common_1.Post)('test/whatsapp'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "testWhatsApp", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService,
        template_service_1.NotificationTemplateService,
        thread_service_1.NotificationThreadService,
        scheduler_service_1.NotificationSchedulerService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map