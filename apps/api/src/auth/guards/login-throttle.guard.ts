import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class LoginThrottleGuard extends ThrottlerGuard {
  protected getTracker(req: any): string {
    return req.ips?.length ? req.ips[0] : req.ip; // get IP from request
  }

  protected async handleRequest(context: ExecutionContext, limit: number, ttl: number): Promise<boolean> {
    // Use the parent class's handleRequest which will handle the rate limiting logic
    return super.handleRequest(context, limit, ttl);
  }
}
}
