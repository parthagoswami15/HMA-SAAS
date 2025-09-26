import { Body, Controller, Get, Headers, Post, Req, Res, Delete } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { IsString } from 'class-validator';
import type { Request, Response } from 'express';

class CheckoutDto { @IsString() planCode: string }

@Controller('payments')
export class PaymentsController {
  constructor(private svc: PaymentsService) {}

  @Get('plans')
  listPlans() { return this.svc.listActivePlans(); }

  @Get('subscription')
  getSub(@Headers('x-tenant-id') tenantId: string) { return this.svc.getSubscription(tenantId); }

  @Post('subscription/change')
  change(@Headers('x-tenant-id') tenantId: string, @Body() dto: CheckoutDto) { return this.svc.changePlan(tenantId, dto.planCode); }

  @Delete('subscription')
  cancel(@Headers('x-tenant-id') tenantId: string) { return this.svc.cancelSubscription(tenantId); }

  @Post('checkout')
  checkout(@Headers('x-tenant-id') tenantId: string, @Body() dto: CheckoutDto) {
    return this.svc.createCheckoutSession(tenantId, dto.planCode);
  }

  @Post('webhook')
  async webhook(@Req() req: Request, @Res() res: Response) {
    const signature = req.headers['x-razorpay-signature'] as string;
    const raw = (req as any).rawBody?.toString() || JSON.stringify(req.body);
    const valid = await this.svc.verifyWebhook(signature, raw);
    if (!valid) return res.status(400).send('Invalid signature');
    await this.svc.handleWebhookParsed(req.body);
    return res.status(200).json({ received: true });
  }
}


