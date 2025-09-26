import { ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
export declare class LoginThrottleGuard extends ThrottlerGuard {
    protected getTracker(req: any): string;
    protected handleRequest(context: ExecutionContext, limit: number, ttl: number): Promise<boolean>;
}
