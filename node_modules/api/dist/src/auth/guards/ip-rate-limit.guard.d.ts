import { ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { DeviceFingerprintService } from '../services/device-fingerprint.service';
export declare class IpRateLimitGuard extends ThrottlerGuard {
    protected readonly options: any;
    protected readonly tracker: any;
    protected readonly storageService: any;
    protected readonly deviceFingerprintService: DeviceFingerprintService;
    private readonly logger;
    constructor(options: any, tracker: any, storageService: any, deviceFingerprintService: DeviceFingerprintService);
    protected handleRequest(context: ExecutionContext, limit: number, ttl: number): Promise<boolean>;
    private getIpAddress;
    private logRequest;
}
