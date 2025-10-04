import { Body, Controller, Get, Headers, Post, Put, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { CreateItemDto, UpdateItemDto, CreateBatchDto, UpdateBatchDto, CreateVendorDto, UpdateVendorDto, CreateGrnDto, UpdateGrnDto, CreateFormularyDto, UpdateFormularyDto, CreateFormularyItemDto, UpdateFormularyItemDto, CreateReorderRuleDto, UpdateReorderRuleDto, CreateRxFillDto, UpdateRxFillDto, CreateSaleDto, UpdateSaleDto, CreateReturnDto, UpdateReturnDto, CreateInventoryTxDto, UpdateInventoryTxDto } from './dto/pharmacy.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('pharmacy')
export class PharmacyController {
  constructor(private svc: PharmacyService) {}

  // Item Management
  @Post('items')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async createItem(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateItemDto) {
    return this.svc.createItem(tenantId, dto);
  }

  @Get('items')
  async getItems(@Headers('x-tenant-id') tenantId: string) {
    return this.svc.getItems(tenantId);
  }

  @Get('items/:id')
  async getItem(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.getItemById(tenantId, id);
  }

  @Put('items/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async updateItem(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: UpdateItemDto) {
    return this.svc.updateItem(tenantId, id, dto);
  }

  @Delete('items/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async deleteItem(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.deleteItem(tenantId, id);
  }

  // Batch Management
  @Post('batches')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async createBatch(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateBatchDto) {
    return this.svc.createBatch(tenantId, dto);
  }

  @Get('batches')
  async getBatches(@Headers('x-tenant-id') tenantId: string) {
    return this.svc.getBatches(tenantId);
  }

  @Put('batches/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async updateBatch(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: UpdateBatchDto) {
    return this.svc.updateBatch(tenantId, id, dto);
  }

  @Delete('batches/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async deleteBatch(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.deleteBatch(tenantId, id);
  }

  // Vendor Management
  @Post('vendors')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async createVendor(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateVendorDto) {
    return this.svc.createVendor(tenantId, dto);
  }

  @Get('vendors')
  async getVendors(@Headers('x-tenant-id') tenantId: string) {
    return this.svc.getVendors(tenantId);
  }

  @Put('vendors/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async updateVendor(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: UpdateVendorDto) {
    return this.svc.updateVendor(tenantId, id, dto);
  }

  @Delete('vendors/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async deleteVendor(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.deleteVendor(tenantId, id);
  }

  // GRN Management
  @Post('grns')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async createGrn(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateGrnDto) {
    return this.svc.createGrn(tenantId, dto);
  }

  @Get('grns')
  async getGrns(@Headers('x-tenant-id') tenantId: string) {
    return this.svc.getGrns(tenantId);
  }

  @Put('grns/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async updateGrn(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: UpdateGrnDto) {
    return this.svc.updateGrn(tenantId, id, dto);
  }

  @Delete('grns/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async deleteGrn(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.deleteGrn(tenantId, id);
  }

  // Formulary Management
  @Post('formularies')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async createFormulary(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateFormularyDto) {
    return this.svc.createFormulary(tenantId, dto);
  }

  @Get('formularies')
  async getFormularies(@Headers('x-tenant-id') tenantId: string) {
    return this.svc.getFormularies(tenantId);
  }

  @Put('formularies/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async updateFormulary(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: UpdateFormularyDto) {
    return this.svc.updateFormulary(tenantId, id, dto);
  }

  @Delete('formularies/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async deleteFormulary(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.deleteFormulary(tenantId, id);
  }

  // FormularyItem Management
  @Post('formulary-items')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async addItemToFormulary(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateFormularyItemDto) {
    return this.svc.addItemToFormulary(tenantId, dto);
  }

  @Put('formulary-items/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async updateFormularyItem(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: UpdateFormularyItemDto) {
    return this.svc.updateFormularyItem(tenantId, id, dto);
  }

  @Delete('formulary-items/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async removeFromFormulary(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.removeFromFormulary(tenantId, id);
  }

  // ReorderRule Management
  @Post('reorder-rules')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async createReorderRule(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateReorderRuleDto) {
    return this.svc.createReorderRule(tenantId, dto);
  }

  @Get('reorder-rules')
  async getReorderRules(@Headers('x-tenant-id') tenantId: string) {
    return this.svc.getReorderRules(tenantId);
  }

  @Put('reorder-rules/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async updateReorderRule(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: UpdateReorderRuleDto) {
    return this.svc.updateReorderRule(tenantId, id, dto);
  }

  @Delete('reorder-rules/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async deleteReorderRule(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.deleteReorderRule(tenantId, id);
  }

  // RxFill Management
  @Post('rx-fills')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async createRxFill(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateRxFillDto) {
    return this.svc.createRxFill(tenantId, dto);
  }

  @Get('rx-fills')
  async getRxFills(@Headers('x-tenant-id') tenantId: string) {
    return this.svc.getRxFills(tenantId);
  }

  @Put('rx-fills/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async updateRxFill(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: UpdateRxFillDto) {
    return this.svc.updateRxFill(tenantId, id, dto);
  }

  @Delete('rx-fills/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async deleteRxFill(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.deleteRxFill(tenantId, id);
  }

  // Sale Management
  @Post('sales')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async createSale(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateSaleDto) {
    return this.svc.createSale(tenantId, dto);
  }

  @Get('sales')
  async getSales(@Headers('x-tenant-id') tenantId: string) {
    return this.svc.getSales(tenantId);
  }

  @Put('sales/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async updateSale(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: UpdateSaleDto) {
    return this.svc.updateSale(tenantId, id, dto);
  }

  @Delete('sales/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async deleteSale(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.deleteSale(tenantId, id);
  }

  // Return Management
  @Post('returns')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async createReturn(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateReturnDto) {
    return this.svc.createReturn(tenantId, dto);
  }

  @Get('returns')
  async getReturns(@Headers('x-tenant-id') tenantId: string) {
    return this.svc.getReturns(tenantId);
  }

  @Put('returns/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async updateReturn(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: UpdateReturnDto) {
    return this.svc.updateReturn(tenantId, id, dto);
  }

  @Delete('returns/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async deleteReturn(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.deleteReturn(tenantId, id);
  }

  // InventoryTx Management
  @Post('inventory-tx')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async createInventoryTx(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateInventoryTxDto) {
    return this.svc.createInventoryTx(tenantId, dto);
  }

  @Get('inventory-tx')
  async getInventoryTx(@Headers('x-tenant-id') tenantId: string) {
    return this.svc.getInventoryTx(tenantId);
  }

  // Workflows and Business Logic
  @Post('procurement')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async processProcurement(@Headers('x-tenant-id') tenantId: string, @Body() { grnData, batches }: { grnData: CreateGrnDto, batches: CreateBatchDto[] }) {
    return this.svc.processProcurement(tenantId, grnData, batches);
  }

  @Get('stock-alerts')
  async getStockAlerts(@Headers('x-tenant-id') tenantId: string) {
    return this.svc.getStockAlerts(tenantId);
  }

  @Post('dispense')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async dispensePrescription(@Headers('x-tenant-id') tenantId: string, @Body() { prescriptionId, items }: { prescriptionId: string, items: Array<{ itemId: string, qty: number, batchId?: string }> }) {
    return this.svc.dispensePrescription(tenantId, prescriptionId, items);
  }

  @Post('issue-ipd')
  @Roles(Role.HOSPITAL_ADMIN, Role.PHARMACIST)
  async issueToIpd(@Headers('x-tenant-id') tenantId: string, @Body() { patientId, items }: { patientId: string, items: Array<{ itemId: string, qty: number, batchId?: string }> }) {
    return this.svc.issueToIpd(tenantId, patientId, items);
  }
}


