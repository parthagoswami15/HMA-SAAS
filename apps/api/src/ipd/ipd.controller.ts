import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { IpdService } from './ipd.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ipd')
@UseGuards(JwtAuthGuard)
export class IpdController {
  constructor(private readonly service: IpdService) {}

  // Wards
  @Post('wards')
  createWard(@Body() createDto: any, @Req() req: any) {
    return this.service.createWard(createDto, req.user.tenantId);
  }

  @Get('wards')
  findAllWards(@Req() req: any, @Query() query: any) {
    return this.service.findAllWards(req.user.tenantId, query);
  }

  @Get('wards/:id')
  findOneWard(@Param('id') id: string, @Req() req: any) {
    return this.service.findOneWard(id, req.user.tenantId);
  }

  @Patch('wards/:id')
  updateWard(@Param('id') id: string, @Body() updateDto: any, @Req() req: any) {
    return this.service.updateWard(id, updateDto, req.user.tenantId);
  }

  // Beds
  @Post('beds')
  createBed(@Body() createDto: any, @Req() req: any) {
    return this.service.createBed(createDto, req.user.tenantId);
  }

  @Get('beds')
  findAllBeds(@Req() req: any, @Query() query: any) {
    return this.service.findAllBeds(req.user.tenantId, query);
  }

  @Get('beds/available')
  findAvailableBeds(@Req() req: any) {
    return this.service.findAvailableBeds(req.user.tenantId);
  }

  @Patch('beds/:id/status')
  updateBedStatus(@Param('id') id: string, @Body() statusDto: { status: string }, @Req() req: any) {
    return this.service.updateBedStatus(id, statusDto.status, req.user.tenantId);
  }

  @Get('stats')
  getStats(@Req() req: any) {
    return this.service.getStats(req.user.tenantId);
  }
}
