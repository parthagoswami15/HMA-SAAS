import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationTemplateService } from './services/template.service';
import { NotificationThreadService } from './services/thread.service';
import { NotificationSchedulerService } from './services/scheduler.service';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
  NotificationQueryDto,
  BulkNotificationDto,
  NotificationResponseDto,
} from './dto/notification.dto';
import {
  CreateTemplateDto,
  UpdateTemplateDto,
  TemplateQueryDto,
} from './dto/template.dto';
import {
  SendMessageDto,
  MessageThreadDto,
  ThreadQueryDto,
} from './dto/thread.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly templateService: NotificationTemplateService,
    private readonly threadService: NotificationThreadService,
    private readonly schedulerService: NotificationSchedulerService,
  ) {}

  // Notification Management
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createNotification(
    @Body() createDto: CreateNotificationDto,
    @Request() req,
  ) {
    return this.notificationsService.createNotification(createDto, req.user);
  }

  @Get()
  async getNotifications(@Query() query: NotificationQueryDto, @Request() req) {
    return this.notificationsService.getNotifications(query, req.user);
  }

  @Get(':id')
  async getNotification(@Param('id') id: string, @Request() req) {
    return this.notificationsService.getNotification(id, req.user);
  }

  @Put(':id')
  async updateNotification(
    @Param('id') id: string,
    @Body() updateDto: UpdateNotificationDto,
    @Request() req,
  ) {
    return this.notificationsService.updateNotification(id, updateDto, req.user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteNotification(@Param('id') id: string, @Request() req) {
    await this.notificationsService.deleteNotification(id, req.user);
  }

  // Bulk Operations
  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  async sendBulkNotification(
    @Body() bulkDto: BulkNotificationDto,
    @Request() req,
  ) {
    return this.notificationsService.sendBulkNotification(bulkDto, req.user);
  }

  @Post('bulk/schedule')
  @HttpCode(HttpStatus.CREATED)
  async scheduleBulkNotification(
    @Body() bulkDto: BulkNotificationDto,
    @Request() req,
  ) {
    return this.schedulerService.scheduleBulkNotification(bulkDto, req.user);
  }

  // Template Management
  @Post('templates')
  @HttpCode(HttpStatus.CREATED)
  async createTemplate(@Body() createDto: CreateTemplateDto, @Request() req) {
    return this.templateService.createTemplate(createDto, req.user);
  }

  @Get('templates')
  async getTemplates(@Query() query: TemplateQueryDto, @Request() req) {
    return this.templateService.getTemplates(query, req.user);
  }

  @Get('templates/:id')
  async getTemplate(@Param('id') id: string, @Request() req) {
    return this.templateService.getTemplate(id, req.user);
  }

  @Put('templates/:id')
  async updateTemplate(
    @Param('id') id: string,
    @Body() updateDto: UpdateTemplateDto,
    @Request() req,
  ) {
    return this.templateService.updateTemplate(id, updateDto, req.user);
  }

  @Delete('templates/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTemplate(@Param('id') id: string, @Request() req) {
    await this.templateService.deleteTemplate(id, req.user);
  }

  // Message Threads
  @Post('threads')
  @HttpCode(HttpStatus.CREATED)
  async createThread(@Body() threadDto: MessageThreadDto, @Request() req) {
    return this.threadService.createThread(threadDto, req.user);
  }

  @Get('threads')
  async getThreads(@Query() query: ThreadQueryDto, @Request() req) {
    return this.threadService.getThreads(query, req.user);
  }

  @Get('threads/:id')
  async getThread(@Param('id') id: string, @Request() req) {
    return this.threadService.getThread(id, req.user);
  }

  @Post('threads/:id/messages')
  @HttpCode(HttpStatus.CREATED)
  async sendMessage(
    @Param('id') threadId: string,
    @Body() messageDto: SendMessageDto,
    @Request() req,
  ) {
    return this.threadService.sendMessage(threadId, messageDto, req.user);
  }

  @Put('threads/:id/close')
  async closeThread(@Param('id') id: string, @Request() req) {
    return this.threadService.closeThread(id, req.user);
  }

  // Communication Channels
  @Post('sms/send')
  @HttpCode(HttpStatus.CREATED)
  async sendSms(@Body() smsDto: any, @Request() req) {
    return this.notificationsService.sendSms(smsDto, req.user);
  }

  @Post('email/send')
  @HttpCode(HttpStatus.CREATED)
  async sendEmail(@Body() emailDto: any, @Request() req) {
    return this.notificationsService.sendEmail(emailDto, req.user);
  }

  @Post('whatsapp/send')
  @HttpCode(HttpStatus.CREATED)
  async sendWhatsApp(@Body() whatsappDto: any, @Request() req) {
    return this.notificationsService.sendWhatsApp(whatsappDto, req.user);
  }

  @Post('ivr/call')
  @HttpCode(HttpStatus.CREATED)
  async makeIvrCall(@Body() ivrDto: any, @Request() req) {
    return this.notificationsService.makeIvrCall(ivrDto, req.user);
  }

  // Preferences and Opt-in/Opt-out
  @Get('preferences/:userId')
  async getNotificationPreferences(@Param('userId') userId: string, @Request() req) {
    return this.notificationsService.getNotificationPreferences(userId, req.user);
  }

  @Put('preferences/:userId')
  async updateNotificationPreferences(
    @Param('userId') userId: string,
    @Body() preferencesDto: any,
    @Request() req,
  ) {
    return this.notificationsService.updateNotificationPreferences(
      userId,
      preferencesDto,
      req.user,
    );
  }

  // Reports and Analytics
  @Get('reports/summary')
  async getNotificationSummary(@Query() query: any, @Request() req) {
    return this.notificationsService.getNotificationSummary(query, req.user);
  }

  @Get('reports/delivery')
  async getDeliveryReport(@Query() query: any, @Request() req) {
    return this.notificationsService.getDeliveryReport(query, req.user);
  }

  @Get('reports/channel-performance')
  async getChannelPerformance(@Query() query: any, @Request() req) {
    return this.notificationsService.getChannelPerformance(query, req.user);
  }

  // Scheduled Notifications
  @Get('scheduled')
  async getScheduledNotifications(@Query() query: any, @Request() req) {
    return this.schedulerService.getScheduledNotifications(query, req.user);
  }

  @Put('scheduled/:id/cancel')
  async cancelScheduledNotification(@Param('id') id: string, @Request() req) {
    return this.schedulerService.cancelScheduledNotification(id, req.user);
  }

  // Test and Debug
  @Post('test/sms')
  @HttpCode(HttpStatus.OK)
  async testSms(@Body() testDto: any, @Request() req) {
    return this.notificationsService.testSms(testDto, req.user);
  }

  @Post('test/email')
  @HttpCode(HttpStatus.OK)
  async testEmail(@Body() testDto: any, @Request() req) {
    return this.notificationsService.testEmail(testDto, req.user);
  }

  @Post('test/whatsapp')
  @HttpCode(HttpStatus.OK)
  async testWhatsApp(@Body() testDto: any, @Request() req) {
    return this.notificationsService.testWhatsApp(testDto, req.user);
  }
}

