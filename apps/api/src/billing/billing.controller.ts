import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards,
  Request,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { 
  CreateInvoiceDto, 
  UpdateInvoiceDto, 
  CreatePaymentDto, 
  UpdatePaymentDto,
  InvoiceFilterDto,
  PaymentFilterDto
} from './dto/billing.dto';

@Controller('billing')
@UseGuards(JwtAuthGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  // ==================== INVOICE ENDPOINTS ====================

  /**
   * Create a new invoice
   * POST /billing/invoices
   */
  @Post('invoices')
  @HttpCode(HttpStatus.CREATED)
  async createInvoice(@Body() dto: CreateInvoiceDto, @Request() req) {
    const invoice = await this.billingService.createInvoice(dto, req.user.tenantId);
    return {
      success: true,
      message: 'Invoice created successfully',
      data: invoice,
    };
  }

  /**
   * Get all invoices with filters
   * GET /billing/invoices
   */
  @Get('invoices')
  async getInvoices(@Query() filters: InvoiceFilterDto, @Request() req) {
    const result = await this.billingService.getInvoices(filters, req.user.tenantId);
    return {
      success: true,
      message: 'Invoices retrieved successfully',
      ...result,
    };
  }

  /**
   * Get billing statistics
   * GET /billing/invoices/stats
   */
  @Get('invoices/stats')
  async getBillingStats(@Request() req) {
    const stats = await this.billingService.getBillingStats(req.user.tenantId);
    return {
      success: true,
      message: 'Billing statistics retrieved successfully',
      data: stats,
    };
  }

  /**
   * Get revenue report
   * GET /billing/invoices/reports/revenue
   */
  @Get('invoices/reports/revenue')
  async getRevenueReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Request() req
  ) {
    const report = await this.billingService.getRevenueReport(
      startDate, 
      endDate, 
      req.user.tenantId
    );
    return {
      success: true,
      message: 'Revenue report generated successfully',
      data: report,
    };
  }

  /**
   * Get invoice by ID
   * GET /billing/invoices/:id
   */
  @Get('invoices/:id')
  async getInvoiceById(@Param('id') id: string, @Request() req) {
    const invoice = await this.billingService.getInvoiceById(id, req.user.tenantId);
    return {
      success: true,
      message: 'Invoice retrieved successfully',
      data: invoice,
    };
  }

  /**
   * Update invoice
   * PATCH /billing/invoices/:id
   */
  @Patch('invoices/:id')
  async updateInvoice(
    @Param('id') id: string,
    @Body() dto: UpdateInvoiceDto,
    @Request() req
  ) {
    const invoice = await this.billingService.updateInvoice(id, dto, req.user.tenantId);
    return {
      success: true,
      message: 'Invoice updated successfully',
      data: invoice,
    };
  }

  /**
   * Cancel invoice
   * DELETE /billing/invoices/:id
   */
  @Delete('invoices/:id')
  async deleteInvoice(@Param('id') id: string, @Request() req) {
    const invoice = await this.billingService.deleteInvoice(id, req.user.tenantId);
    return {
      success: true,
      message: 'Invoice cancelled successfully',
      data: invoice,
    };
  }

  // ==================== PAYMENT ENDPOINTS ====================

  /**
   * Create a payment
   * POST /billing/payments
   */
  @Post('payments')
  @HttpCode(HttpStatus.CREATED)
  async createPayment(@Body() dto: CreatePaymentDto, @Request() req) {
    const payment = await this.billingService.createPayment(dto, req.user.tenantId);
    return {
      success: true,
      message: 'Payment recorded successfully',
      data: payment,
    };
  }

  /**
   * Get all payments with filters
   * GET /billing/payments
   */
  @Get('payments')
  async getPayments(@Query() filters: PaymentFilterDto, @Request() req) {
    const result = await this.billingService.getPayments(filters, req.user.tenantId);
    return {
      success: true,
      message: 'Payments retrieved successfully',
      ...result,
    };
  }

  /**
   * Get payment by ID
   * GET /billing/payments/:id
   */
  @Get('payments/:id')
  async getPaymentById(@Param('id') id: string, @Request() req) {
    const payment = await this.billingService.getPaymentById(id, req.user.tenantId);
    return {
      success: true,
      message: 'Payment retrieved successfully',
      data: payment,
    };
  }

  /**
   * Update payment
   * PATCH /billing/payments/:id
   */
  @Patch('payments/:id')
  async updatePayment(
    @Param('id') id: string,
    @Body() dto: UpdatePaymentDto,
    @Request() req
  ) {
    const payment = await this.billingService.updatePayment(id, dto, req.user.tenantId);
    return {
      success: true,
      message: 'Payment updated successfully',
      data: payment,
    };
  }
}
