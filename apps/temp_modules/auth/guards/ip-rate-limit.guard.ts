import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';
import { DeviceFingerprintService } from '../services/device-fingerprint.service';

@Injectable()
export class IpRateLimitGuard extends ThrottlerGuard {
  private readonly logger = new Logger(IpRateLimitGuard.name);

  constructor(
    protected readonly options: any,
    protected readonly tracker: any,
    protected readonly storageService: any,
    protected readonly deviceFingerprintService: DeviceFingerprintService,
  ) {
    super(options, tracker, storageService);
  }

  protected async handleRequest(
    context: ExecutionContext,
    limit: number,
    ttl: number,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse();

    // Get client IP and device fingerprint
    const ip = this.getIpAddress(request);
    const deviceFingerprint = this.deviceFingerprintService.generateFingerprint(request);
    const deviceInfo = this.deviceFingerprintService.getDeviceInfo(request);

    // Create a unique key based on IP and device fingerprint
    const key = this.generateKey(context, `${ip}:${deviceFingerprint}`);
    
    // Check rate limit
    const { totalHits, timeToExpire } = await this.storageService.increment(key, ttl);

    // Set rate limit headers
    response.setHeader('X-RateLimit-Limit', limit);
    response.setHeader('X-RateLimit-Remaining', Math.max(0, limit - totalHits));
    response.setHeader('X-RateLimit-Reset', Math.ceil(timeToExpire / 1000));

    // Log the request
    this.logRequest(request, ip, deviceInfo, totalHits);

    // Check if rate limit is exceeded
    if (totalHits > limit) {
      this.logger.warn(
        `Rate limit exceeded for IP: ${ip}, Path: ${request.path}, Device: ${JSON.stringify(deviceInfo)}`,
      );
      this.throwThrottlingException(context);
    }

    return true;
  }

  private getIpAddress(request: Request): string {
    // Try to get the real IP address behind proxies
    return (
      (request.headers['x-forwarded-for'] as string) ||
      (request.headers['x-real-ip'] as string) ||
      request.ip ||
      'unknown-ip'
    );
  }

  private logRequest(
    request: Request,
    ip: string,
    deviceInfo: any,
    hitCount: number,
  ): void {
    this.logger.debug(
      `Request from IP: ${ip}, ` +
        `Path: ${request.path}, ` +
        `Method: ${request.method}, ` +
        `Device: ${JSON.stringify(deviceInfo)}, ` +
        `Hits: ${hitCount}`,
    );
  }
}
