import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { StaffService } from './staff.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateStaffDto, UpdateStaffDto, StaffQueryDto } from './dto/staff.dto';

@Controller('staff')
@UseGuards(JwtAuthGuard)
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  async create(@Body() createStaffDto: CreateStaffDto, @Request() req) {
    return this.staffService.create(createStaffDto, req.user.tenantId);
  }

  @Get()
  async findAll(@Request() req, @Query() query: StaffQueryDto) {
    return this.staffService.findAll(req.user.tenantId, query);
  }

  @Get('search')
  async search(@Request() req, @Query('q') query: string) {
    return this.staffService.search(req.user.tenantId, query);
  }

  @Get('stats')
  async getStats(@Request() req) {
    return this.staffService.getStats(req.user.tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.staffService.findOne(id, req.user.tenantId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto, @Request() req) {
    return this.staffService.update(id, updateStaffDto, req.user.tenantId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.staffService.remove(id, req.user.tenantId);
  }
}
