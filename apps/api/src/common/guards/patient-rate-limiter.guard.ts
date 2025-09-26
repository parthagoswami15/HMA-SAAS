import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PatientRateLimiterGuard extends ThrottlerGuard {
  constructor(
    protected readonly options: any,
    protected readonly reflector: Reflector,
    protected readonly configService: ConfigService,
  ) {
    super(options, reflector);
  }

  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Use tenant ID + IP for rate limiting
    const tenantId = req.headers['x-tenant-id'] || 'unknown-tenant';
    const ip = req.ip;
    return `${tenantId}:${ip}`;
  }

  protected async handleRequest(
    context: ExecutionContext,
    limit: number,
    ttl: number,
    throttler: any,
  ): Promise<boolean> {
    const { req, res } = this.getRequestResponse(context);
    
    // Get rate limit values from config or use defaults
    const ttlValue = this.configService.get<number>('THROTTLE_TTL', 60);
    const limitValue = this.configService.get<number>('THROTTLE_LIMIT', 100);

    // Apply stricter limits for write operations
    const isWriteOperation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
    const operationLimit = isWriteOperation ? Math.floor(limitValue / 2) : limitValue;
    
    try {
      const { totalHits, timeToExpire } = await throttler.increment(
        await this.getTracker(req),
        ttlValue,
      );

      // Add rate limit headers
      res.header('X-RateLimit-Limit', operationLimit.toString());
      res.header('X-RateLimit-Remaining', Math.max(0, operationLimit - totalHits).toString());
      res.header('X-RateLimit-Reset', new Date(Date.now() + timeToExpire * 1000).toISOString());

      if (totalHits > operationLimit) {
        res.header('Retry-After', timeToExpire.toString());
        this.throwThrottlingException(context);
      }
      return true;
    } catch (error) {
      if (error instanceof Error && error.message.includes('ThrottlerException')) {
        throw error;
      }
      // In case of Redis or other errors, fail open
      return true;
    }
  }
}
