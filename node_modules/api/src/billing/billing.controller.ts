import { Body, Controller, Get, Headers, Post, Put, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { CreateChargeItemDto, UpdateChargeItemDto, CreatePriceListDto, UpdatePriceListDto, CreatePriceListItemDto, UpdatePriceListItemDto, CreatePackageDto, UpdatePackageDto, CreateInvoiceDto, UpdateInvoiceDto, CreatePaymentDto, UpdatePaymentDto, CreateAdjustmentDto, UpdateAdjustmentDto, CreatePayerDto, UpdatePayerDto, CreateLedgerDto, UpdateLedgerDto } from './billing.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('billing')
export class BillingController {
  constructor(private svc: BillingService) {}

  // ChargeItem Management
  @Post('charge-items')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async createChargeItem(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateChargeItemDto) {
    return this.svc.createChargeItem(tenantId, dto);
  }

  @Get('charge-items')
  async getChargeItems(@Headers('x-tenant-id') tenantId: string) {
    return this.svc.getChargeItems(tenantId);
  }

  @Get('charge-items/:id')
  async getChargeItem(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.getChargeItemById(tenantId, id);
  }

  @Put('charge-items/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async updateChargeItem(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: UpdateChargeItemDto) {
    return this.svc.updateChargeItem(tenantId, id, dto);
  }

  @Delete('charge-items/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async deleteChargeItem(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.deleteChargeItem(tenantId, id);
  }

  // PriceList Management
  @Post('price-lists')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async createPriceList(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreatePriceListDto) {
    return this.svc.createPriceList(tenantId, dto);
  }

  @Get('price-lists')
  async getPriceLists(@Headers('x-tenant-id') tenantId: string) {
    return this.svc.getPriceLists(tenantId);
  }

  @Put('price-lists/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async updatePriceList(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: UpdatePriceListDto) {
    return this.svc.updatePriceList(tenantId, id, dto);
  }

  @Delete('price-lists/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async deletePriceList(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.deletePriceList(tenantId, id);
  }

  // PriceListItem Management
  @Post('price-list-items')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async addItemToPriceList(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreatePriceListItemDto) {
    return this.svc.addItemToPriceList(tenantId, dto);
  }

  @Put('price-list-items/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async updatePriceListItem(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: UpdatePriceListItemDto) {
    return this.svc.updatePriceListItem(tenantId, id, dto);
  }

  @Delete('price-list-items/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async removeFromPriceList(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.removeFromPriceList(tenantId, id);
  }

  // Package Management
  @Post('packages')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async createPackage(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreatePackageDto) {
    return this.svc.createPackage(tenantId, dto);
  }

  @Get('packages')
  async getPackages(@Headers('x-tenant-id') tenantId: string) {
    return this.svc.getPackages(tenantId);
  }

  @Put('packages/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async updatePackage(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: UpdatePackageDto) {
    return this.svc.updatePackage(tenantId, id, dto);
  }

  @Delete('packages/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async deletePackage(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.deletePackage(tenantId, id);
  }

  // Invoice Management
  @Post('invoices')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async createInvoice(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateInvoiceDto) {
    return this.svc.createInvoice(tenantId, dto);
  }

  @Get('invoices')
  async getInvoices(@Headers('x-tenant-id') tenantId: string, @Query('patientId') patientId?: string) {
    return this.svc.getInvoices(tenantId, patientId);
  }

  @Put('invoices/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async updateInvoice(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: UpdateInvoiceDto) {
    return this.svc.updateInvoice(tenantId, id, dto);
  }

  @Delete('invoices/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async deleteInvoice(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.deleteInvoice(tenantId, id);
  }

  // Payment Management
  @Post('payments')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async createPayment(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreatePaymentDto) {
    return this.svc.createPayment(tenantId, dto);
  }

  @Get('payments')
  async getPayments(@Headers('x-tenant-id') tenantId: string) {
    return this.svc.getPayments(tenantId);
  }

  @Put('payments/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async updatePayment(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: UpdatePaymentDto) {
    return this.svc.updatePayment(tenantId, id, dto);
  }

  @Delete('payments/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async deletePayment(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.deletePayment(tenantId, id);
  }

  // Adjustment Management
  @Post('adjustments')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async createAdjustment(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateAdjustmentDto) {
    return this.svc.createAdjustment(tenantId, dto);
  }

  @Get('adjustments')
  async getAdjustments(@Headers('x-tenant-id') tenantId: string) {
    return this.svc.getAdjustments(tenantId);
  }

  @Put('adjustments/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async updateAdjustment(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: UpdateAdjustmentDto) {
    return this.svc.updateAdjustment(tenantId, id, dto);
  }

  @Delete('adjustments/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async deleteAdjustment(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.deleteAdjustment(tenantId, id);
  }

  // Payer Management
  @Post('payers')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async createPayer(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreatePayerDto) {
    return this.svc.createPayer(tenantId, dto);
  }

  @Get('payers')
  async getPayers(@Headers('x-tenant-id') tenantId: string) {
    return this.svc.getPayers(tenantId);
  }

  @Put('payers/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async updatePayer(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: UpdatePayerDto) {
    return this.svc.updatePayer(tenantId, id, dto);
  }

  @Delete('payers/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async deletePayer(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.deletePayer(tenantId, id);
  }

  // Ledger Management
  @Post('ledger')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async createLedgerEntry(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateLedgerDto) {
    return this.svc.createLedgerEntry(tenantId, dto);
  }

  @Get('ledger')
  async getLedgerEntries(@Headers('x-tenant-id') tenantId: string, @Query('entityId') entityId?: string) {
    return this.svc.getLedgerEntries(tenantId, entityId);
  }

  @Put('ledger/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async updateLedgerEntry(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: UpdateLedgerDto) {
    return this.svc.updateLedgerEntry(tenantId, id, dto);
  }

  @Delete('ledger/:id')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async deleteLedgerEntry(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.svc.deleteLedgerEntry(tenantId, id);
  }

  // Workflows and Business Logic
  @Post('accruals')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async postCharge(@Headers('x-tenant-id') tenantId: string, @Body() dto: { patientId: string, chargeItemId: string, qty: number, visitId?: string }) {
    return this.svc.postCharge(tenantId, dto);
  }

  @Post('generate-invoice')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async generateInvoice(@Headers('x-tenant-id') tenantId: string, @Body() { patientId, consolidated }: { patientId: string, consolidated?: boolean }) {
    return this.svc.generateInvoice(tenantId, patientId, consolidated);
  }

  @Post('process-payment')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async processPayment(@Headers('x-tenant-id') tenantId: string, @Body() dto: { invoiceId: string, amount: number, mode: string, payerId?: string }) {
    return this.svc.processPayment(tenantId, dto);
  }

  @Post('apply-discount')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async applyDiscount(@Headers('x-tenant-id') tenantId: string, @Body() dto: { invoiceId: string, amount: number, reason: string, approvedBy: string }) {
    return this.svc.applyDiscount(tenantId, dto);
  }

  @Get('patient-statement/:patientId')
  async getPatientStatement(@Headers('x-tenant-id') tenantId: string, @Param('patientId') patientId: string) {
    return this.svc.getPatientStatement(tenantId, patientId);
  }

  @Get('corporate-statement/:payerId')
  async getCorporateStatement(@Headers('x-tenant-id') tenantId: string, @Param('payerId') payerId: string) {
    return this.svc.getCorporateStatement(tenantId, payerId);
  }

  @Get('config')
  async getBillingConfig(@Headers('x-tenant-id') tenantId: string) {
    return this.svc.getBillingConfig(tenantId);
  }

  @Post('interim-bill')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async generateInterimBill(@Headers('x-tenant-id') tenantId: string, @Body() { admissionId }: { admissionId: string }) {
    return this.svc.generateInterimBill(tenantId, admissionId);
  }

  @Post('reverse-invoice/:invoiceId')
  @Roles(Role.HOSPITAL_ADMIN, Role.RECEPTIONIST)
  async reverseInvoice(@Headers('x-tenant-id') tenantId: string, @Param('invoiceId') invoiceId: string) {
    return this.svc.reverseInvoice(tenantId, invoiceId);
  }
}


