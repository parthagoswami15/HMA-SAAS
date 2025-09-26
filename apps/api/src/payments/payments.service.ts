import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  listActivePlans() {
    return this.prisma.plan.findMany({ where: { active: true }, orderBy: { priceCents: 'asc' } });
  }

  async getSubscription(tenantId: string) {
    return this.prisma.subscription.findFirst({
      where: { tenantId },
      include: { plan: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async changePlan(tenantId: string, planCode: string) {
    const plan = await this.prisma.plan.findUnique({ where: { code: planCode } });
    if (!plan) throw new Error('Plan not found');
    return this.prisma.subscription.upsert({
      where: { id: `${tenantId}-${plan.id}` },
      update: { planId: plan.id, status: 'inactive' },
      create: { id: `${tenantId}-${plan.id}`, tenantId, planId: plan.id, status: 'inactive' },
    });
  }

  async cancelSubscription(tenantId: string) {
    const sub = await this.getSubscription(tenantId);
    if (!sub) return { ok: true };
    await this.prisma.subscription.update({ where: { id: sub.id }, data: { status: 'canceled' } });
    return { ok: true };
  }

  async createCheckoutSession(tenantId: string, planCode: string) {
    const plan = await this.prisma.plan.findUnique({ where: { code: planCode } });
    if (!plan) throw new Error('Plan not found');
    const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID || '', key_secret: process.env.RAZORPAY_KEY_SECRET || '' });
    const order = await instance.orders.create({
      amount: plan.priceCents, // amount in paise
      currency: plan.currency || 'INR',
      receipt: `${tenantId}-${plan.code}-${Date.now()}`,
      notes: { tenantId, planCode },
    });
    return { provider: 'razorpay', order };
  }

  async verifyWebhook(signature: string, bodyRaw: string) {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
    const expected = crypto.createHmac('sha256', secret).update(bodyRaw).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  }

  async handleWebhookParsed(event: any) {
    // Minimal handling: activate subscription on payment captured
    if (event?.event === 'payment.captured') {
      const payment = event?.payload?.payment?.entity;
      const notes = payment?.notes || {};
      const tenantId = notes.tenantId as string | undefined;
      const planCode = notes.planCode as string | undefined;
      if (tenantId && planCode) {
        const plan = await this.prisma.plan.findUnique({ where: { code: planCode } });
        if (plan) {
          await this.prisma.subscription.upsert({
            where: { id: `${tenantId}-${plan.id}` },
            update: { status: 'active', metadata: { paymentId: payment?.id, orderId: payment?.order_id } as any },
            create: { id: `${tenantId}-${plan.id}`, tenantId, planId: plan.id, status: 'active', metadata: { paymentId: payment?.id, orderId: payment?.order_id } as any },
          });
        }
      }
    }
    return { ok: true };
  }
}


