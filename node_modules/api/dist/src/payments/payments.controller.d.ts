import { PaymentsService } from './payments.service';
import type { Request, Response } from 'express';
declare class CheckoutDto {
    planCode: string;
}
export declare class PaymentsController {
    private svc;
    constructor(svc: PaymentsService);
    listPlans(): any;
    getSub(tenantId: string): Promise<any>;
    change(tenantId: string, dto: CheckoutDto): Promise<any>;
    cancel(tenantId: string): Promise<{
        ok: boolean;
    }>;
    checkout(tenantId: string, dto: CheckoutDto): Promise<{
        provider: string;
        order: import("razorpay/dist/types/orders").Orders.RazorpayOrder;
    }>;
    webhook(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
export {};
