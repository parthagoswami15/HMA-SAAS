import { ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
export declare class TenantThrottleGuard extends ThrottlerGuard {
    protected getTracker(req: Record<string, any>): Promise<string>;
    protected throwThrottlingException(context: ExecutionContext): void;
    private getRequestResponse;
}
