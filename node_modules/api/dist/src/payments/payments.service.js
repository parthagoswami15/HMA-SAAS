"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const razorpay_1 = __importDefault(require("razorpay"));
const crypto = __importStar(require("crypto"));
let PaymentsService = class PaymentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    listActivePlans() {
        return this.prisma.plan.findMany({ where: { active: true }, orderBy: { priceCents: 'asc' } });
    }
    async getSubscription(tenantId) {
        return this.prisma.subscription.findFirst({
            where: { tenantId },
            include: { plan: true },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async changePlan(tenantId, planCode) {
        const plan = await this.prisma.plan.findUnique({ where: { code: planCode } });
        if (!plan)
            throw new Error('Plan not found');
        return this.prisma.subscription.upsert({
            where: { id: `${tenantId}-${plan.id}` },
            update: { planId: plan.id, status: 'inactive' },
            create: { id: `${tenantId}-${plan.id}`, tenantId, planId: plan.id, status: 'inactive' },
        });
    }
    async cancelSubscription(tenantId) {
        const sub = await this.getSubscription(tenantId);
        if (!sub)
            return { ok: true };
        await this.prisma.subscription.update({ where: { id: sub.id }, data: { status: 'canceled' } });
        return { ok: true };
    }
    async createCheckoutSession(tenantId, planCode) {
        const plan = await this.prisma.plan.findUnique({ where: { code: planCode } });
        if (!plan)
            throw new Error('Plan not found');
        const instance = new razorpay_1.default({ key_id: process.env.RAZORPAY_KEY_ID || '', key_secret: process.env.RAZORPAY_KEY_SECRET || '' });
        const order = await instance.orders.create({
            amount: plan.priceCents,
            currency: plan.currency || 'INR',
            receipt: `${tenantId}-${plan.code}-${Date.now()}`,
            notes: { tenantId, planCode },
        });
        return { provider: 'razorpay', order };
    }
    async verifyWebhook(signature, bodyRaw) {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
        const expected = crypto.createHmac('sha256', secret).update(bodyRaw).digest('hex');
        return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
    }
    async handleWebhookParsed(event) {
        if (event?.event === 'payment.captured') {
            const payment = event?.payload?.payment?.entity;
            const notes = payment?.notes || {};
            const tenantId = notes.tenantId;
            const planCode = notes.planCode;
            if (tenantId && planCode) {
                const plan = await this.prisma.plan.findUnique({ where: { code: planCode } });
                if (plan) {
                    await this.prisma.subscription.upsert({
                        where: { id: `${tenantId}-${plan.id}` },
                        update: { status: 'active', metadata: { paymentId: payment?.id, orderId: payment?.order_id } },
                        create: { id: `${tenantId}-${plan.id}`, tenantId, planId: plan.id, status: 'active', metadata: { paymentId: payment?.id, orderId: payment?.order_id } },
                    });
                }
            }
        }
        return { ok: true };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map