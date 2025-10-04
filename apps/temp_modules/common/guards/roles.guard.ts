import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { TENANT_ID_HEADER } from '../../auth/constants/auth.constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required, allow access
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // SUPER_ADMIN has access to everything across all tenants
    if (user.role === Role.SUPER_ADMIN) {
      return true;
    }

    // HOSPITAL_ADMIN has access to their own tenant
    if (user.role === Role.HOSPITAL_ADMIN) {
      const tenantId = request.headers[TENANT_ID_HEADER]?.toLowerCase();
      if (tenantId && user.tenantId !== tenantId) {
        throw new ForbiddenException('Not authorized to access this tenant');
      }
      return true;
    }

    // Check if user's role is in the required roles
    const hasRole = requiredRoles.some((role) => user.role === role);
    
    if (!hasRole) {
      throw new ForbiddenException(
        `User with role ${user.role} does not have access to this resource`
      );
    }

    // For regular users, ensure they can only access their own tenant's data
    const tenantId = request.headers[TENANT_ID_HEADER]?.toLowerCase();
    if (tenantId && user.tenantId !== tenantId) {
      throw new ForbiddenException('Not authorized to access this tenant');
    }

    return true;
  }
}
