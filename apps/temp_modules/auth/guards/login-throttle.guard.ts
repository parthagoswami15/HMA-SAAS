import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class LoginThrottleGuard extends ThrottlerGuard {
  protected getTracker(req: any): string {
    return req.body?.email || req.ip;
  }

  protected async handleRequest(
    context: ExecutionContext,
    limit: number,
    ttl: number,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const key = this.getTracker(request);
    const { totalHits } = await this.storageService.increment(key, ttl);

    if (totalHits > limit) {
      throw new Error('Too many login attempts. Please try again later.');
    }

    return true;
  }
}