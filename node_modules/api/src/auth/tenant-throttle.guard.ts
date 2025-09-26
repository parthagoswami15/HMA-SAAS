import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { TENANT_ID_HEADER } from './constants/auth.constants';

@Injectable()
export class TenantThrottleGuard extends ThrottlerGuard {
  /**
   * Get a unique identifier for rate limiting
   * Combines tenant ID with IP for more granular control
   */
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const tenantId = req.headers[TENANT_ID_HEADER]?.toLowerCase();
    const ip = req.ip;
    
    // If we have a tenant ID, use it in the tracker
    if (tenantId) {
      return `tenant:${tenantId}:${ip}`;
    }
    
    // Fall back to IP-based rate limiting
    return `ip:${ip}`;
  }
  
  /**
   * Override error message to be more descriptive
   */
  protected throwThrottlingException(context: ExecutionContext): void {
    const { req } = this.getRequestResponse(context);
    const tenantId = req.headers[TENANT_ID_HEADER]?.toLowerCase();
    
    const message = tenantId 
      ? 'Too many requests for this tenant. Please try again later.'
      : 'Too many requests from this IP. Please try again later.';
      
    throw new ThrottlerException(message);
  }
  
  /**
   * Helper to get request and response from context
   */
  private getRequestResponse(context: ExecutionContext) {
    const httpContext = context.switchToHttp();
    return {
      req: httpContext.getRequest(),
      res: httpContext.getResponse(),
    };
  }
}


