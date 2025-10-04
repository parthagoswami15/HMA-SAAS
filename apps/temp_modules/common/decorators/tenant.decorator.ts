import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TenantRequest } from '../../middleware/tenant.middleware';

export const CurrentTenant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<TenantRequest>();
    return request.tenant;
  },
);
