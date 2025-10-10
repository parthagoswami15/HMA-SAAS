import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { LaboratoryService } from './laboratory.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreateLabTestDto,
  UpdateLabTestDto,
  CreateLabOrderDto,
  UpdateLabOrderDto,
  UpdateLabTestResultDto,
  LabOrderQueryDto,
  LabTestQueryDto
} from './dto/laboratory.dto';

@Controller('laboratory')
@UseGuards(JwtAuthGuard)
export class LaboratoryController {
  constructor(private readonly laboratoryService: LaboratoryService) {}

  // ==================== Lab Tests Endpoints ====================

  @Post('tests')
  async createLabTest(@Body() createLabTestDto: CreateLabTestDto, @Request() req) {
    return this.laboratoryService.createLabTest(createLabTestDto, req.user.tenantId);
  }

  @Get('tests')
  async findAllLabTests(@Request() req, @Query() query: LabTestQueryDto) {
    return this.laboratoryService.findAllLabTests(req.user.tenantId, query);
  }

  @Get('tests/:id')
  async findOneLabTest(@Param('id') id: string, @Request() req) {
    return this.laboratoryService.findOneLabTest(id, req.user.tenantId);
  }

  @Patch('tests/:id')
  async updateLabTest(@Param('id') id: string, @Body() updateLabTestDto: UpdateLabTestDto, @Request() req) {
    return this.laboratoryService.updateLabTest(id, updateLabTestDto, req.user.tenantId);
  }

  @Delete('tests/:id')
  async removeLabTest(@Param('id') id: string, @Request() req) {
    return this.laboratoryService.removeLabTest(id, req.user.tenantId);
  }

  // ==================== Lab Orders Endpoints ====================

  @Post('orders')
  async createLabOrder(@Body() createLabOrderDto: CreateLabOrderDto, @Request() req) {
    return this.laboratoryService.createLabOrder(createLabOrderDto, req.user.tenantId);
  }

  @Get('orders')
  async findAllLabOrders(@Request() req, @Query() query: LabOrderQueryDto) {
    return this.laboratoryService.findAllLabOrders(req.user.tenantId, query);
  }

  @Get('orders/stats')
  async getLabStats(@Request() req) {
    return this.laboratoryService.getLabStats(req.user.tenantId);
  }

  @Get('orders/:id')
  async findOneLabOrder(@Param('id') id: string, @Request() req) {
    return this.laboratoryService.findOneLabOrder(id, req.user.tenantId);
  }

  @Patch('orders/:id')
  async updateLabOrder(@Param('id') id: string, @Body() updateLabOrderDto: UpdateLabOrderDto, @Request() req) {
    return this.laboratoryService.updateLabOrder(id, updateLabOrderDto, req.user.tenantId);
  }

  @Patch('orders/:orderId/tests/:testId/result')
  async updateLabTestResult(
    @Param('orderId') orderId: string,
    @Param('testId') testId: string,
    @Body() updateResultDto: UpdateLabTestResultDto,
    @Request() req
  ) {
    return this.laboratoryService.updateLabTestResult(orderId, testId, updateResultDto, req.user.tenantId);
  }

  @Delete('orders/:id')
  async cancelLabOrder(@Param('id') id: string, @Request() req) {
    return this.laboratoryService.cancelLabOrder(id, req.user.tenantId);
  }
}
