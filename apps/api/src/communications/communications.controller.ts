import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, Req } from '@nestjs/common';
import { CommunicationsService } from './communications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('communications')
@UseGuards(JwtAuthGuard)
export class CommunicationsController {
  constructor(private readonly service: CommunicationsService) {}

  // Messages
  @Post('messages')
  sendMessage(@Body() createDto: any, @Req() req: any) {
    return this.service.sendMessage(createDto, req.user.tenantId, req.user.id);
  }

  @Get('messages')
  getMessages(@Req() req: any, @Query() query: any) {
    return this.service.getMessages(req.user.tenantId, req.user.id, query);
  }

  @Patch('messages/:id/read')
  markAsRead(@Param('id') id: string, @Req() req: any) {
    return this.service.markAsRead(id, req.user.tenantId);
  }

  // Notifications
  @Post('notifications')
  createNotification(@Body() createDto: any, @Req() req: any) {
    return this.service.createNotification(createDto, req.user.tenantId);
  }

  @Get('notifications')
  getNotifications(@Req() req: any, @Query() query: any) {
    return this.service.getNotifications(req.user.tenantId, req.user.id, query);
  }

  @Patch('notifications/:id/read')
  markNotificationAsRead(@Param('id') id: string, @Req() req: any) {
    return this.service.markNotificationAsRead(id, req.user.tenantId);
  }

  @Get('stats')
  getStats(@Req() req: any) {
    return this.service.getStats(req.user.tenantId, req.user.id);
  }
}
