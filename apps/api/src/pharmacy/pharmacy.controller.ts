import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreateMedicationDto,
  UpdateMedicationDto,
  CreatePharmacyOrderDto,
  UpdatePharmacyOrderDto,
  UpdatePharmacyOrderItemDto,
  PharmacyOrderQueryDto,
  MedicationQueryDto
} from './dto/pharmacy.dto';

@Controller('pharmacy')
@UseGuards(JwtAuthGuard)
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  // ==================== Medications Endpoints ====================

  @Post('medications')
  async createMedication(@Body() createMedicationDto: CreateMedicationDto, @Request() req) {
    return this.pharmacyService.createMedication(createMedicationDto, req.user.tenantId);
  }

  @Get('medications')
  async findAllMedications(@Request() req, @Query() query: MedicationQueryDto) {
    return this.pharmacyService.findAllMedications(req.user.tenantId, query);
  }

  @Get('medications/:id')
  async findOneMedication(@Param('id') id: string, @Request() req) {
    return this.pharmacyService.findOneMedication(id, req.user.tenantId);
  }

  @Patch('medications/:id')
  async updateMedication(@Param('id') id: string, @Body() updateMedicationDto: UpdateMedicationDto, @Request() req) {
    return this.pharmacyService.updateMedication(id, updateMedicationDto, req.user.tenantId);
  }

  @Delete('medications/:id')
  async removeMedication(@Param('id') id: string, @Request() req) {
    return this.pharmacyService.removeMedication(id, req.user.tenantId);
  }

  // ==================== Pharmacy Orders Endpoints ====================

  @Post('orders')
  async createPharmacyOrder(@Body() createPharmacyOrderDto: CreatePharmacyOrderDto, @Request() req) {
    return this.pharmacyService.createPharmacyOrder(createPharmacyOrderDto, req.user.tenantId);
  }

  @Get('orders')
  async findAllPharmacyOrders(@Request() req, @Query() query: PharmacyOrderQueryDto) {
    return this.pharmacyService.findAllPharmacyOrders(req.user.tenantId, query);
  }

  @Get('orders/stats')
  async getPharmacyStats(@Request() req) {
    return this.pharmacyService.getPharmacyStats(req.user.tenantId);
  }

  @Get('orders/:id')
  async findOnePharmacyOrder(@Param('id') id: string, @Request() req) {
    return this.pharmacyService.findOnePharmacyOrder(id, req.user.tenantId);
  }

  @Patch('orders/:id')
  async updatePharmacyOrder(@Param('id') id: string, @Body() updatePharmacyOrderDto: UpdatePharmacyOrderDto, @Request() req) {
    return this.pharmacyService.updatePharmacyOrder(id, updatePharmacyOrderDto, req.user.tenantId);
  }

  @Patch('orders/:orderId/items/:itemId')
  async updatePharmacyOrderItem(
    @Param('orderId') orderId: string,
    @Param('itemId') itemId: string,
    @Body() updateItemDto: UpdatePharmacyOrderItemDto,
    @Request() req
  ) {
    return this.pharmacyService.updatePharmacyOrderItem(orderId, itemId, updateItemDto, req.user.tenantId);
  }

  @Delete('orders/:id')
  async cancelPharmacyOrder(@Param('id') id: string, @Request() req) {
    return this.pharmacyService.cancelPharmacyOrder(id, req.user.tenantId);
  }
}
