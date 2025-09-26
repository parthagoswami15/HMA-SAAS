import { ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
export declare class PatientRateLimiterGuard extends ThrottlerGuard {
    protected readonly options: any;
    protected readonly reflector: Reflector;
    protected readonly configService: ConfigService;
    constructor(options: any, reflector: Reflector, configService: ConfigService);
    protected getTracker(req: Record<string, any>): Promise<string>;
    protected handleRequest(context: ExecutionContext, limit: number, ttl: number, throttler: any): Promise<boolean>;
}
