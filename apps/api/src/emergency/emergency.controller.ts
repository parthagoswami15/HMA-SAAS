import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { EmergencyService } from './emergency.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('emergency')
@UseGuards(JwtAuthGuard)
export class EmergencyController {
  constructor(private readonly service: EmergencyService) {}

  @Post('cases')
  create(@Body() createDto: any, @Req() req: any) {
    return this.service.create(createDto, req.user.tenantId);
  }

  @Get('cases')
  findAll(@Req() req: any, @Query() query: any) {
    return this.service.findAll(req.user.tenantId, query);
  }

  @Get('cases/:id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.service.findOne(id, req.user.tenantId);
  }

  @Patch('cases/:id')
  update(@Param('id') id: string, @Body() updateDto: any, @Req() req: any) {
    return this.service.update(id, updateDto, req.user.tenantId);
  }

  @Patch('cases/:id/triage')
  updateTriage(@Param('id') id: string, @Body() triageDto: any, @Req() req: any) {
    return this.service.updateTriage(id, triageDto, req.user.tenantId);
  }

  @Get('queue')
  getQueue(@Req() req: any) {
    return this.service.getQueue(req.user.tenantId);
  }

  @Get('stats')
  getStats(@Req() req: any) {
    return this.service.getStats(req.user.tenantId);
  }
}
