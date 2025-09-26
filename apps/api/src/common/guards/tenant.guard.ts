import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { TenantRequest } from '../../middleware/tenant.middleware';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<TenantRequest>();
    const user = request.user;
    const tenant = request.tenant;

    if (!user || !tenant) {
      throw new ForbiddenException('User and tenant context required');
    }

    // OWNER role can access any tenant
    if (user.role === 'OWNER') {
      return true;
    }

    // Other roles must belong to the same tenant
    if (user.tenantId !== tenant.id) {
      throw new ForbiddenException('Access denied to this tenant');
    }

    return true;
  }
}
