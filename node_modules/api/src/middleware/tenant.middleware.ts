import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../prisma/prisma.service';

export interface TenantRequest extends Request {
  tenant?: {
    id: string;
    name: string;
    slug: string;
  };
  user?: any;
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: TenantRequest, res: Response, next: NextFunction) {
    const tenantId = req.headers['x-tenant-id'] as string;
    const tenantSlug = req.headers['x-tenant-slug'] as string;

    if (!tenantId && !tenantSlug) {
      throw new BadRequestException('Tenant ID or slug is required');
    }

    let tenant;
    if (tenantId) {
      tenant = await this.prisma.tenant.findUnique({
        where: { id: tenantId },
        select: { id: true, name: true, slug: true }
      });
    } else if (tenantSlug) {
      tenant = await this.prisma.tenant.findUnique({
        where: { slug: tenantSlug },
        select: { id: true, name: true, slug: true }
      });
    }

    if (!tenant) {
      throw new BadRequestException('Invalid tenant');
    }

    req.tenant = tenant;
    next();
  }
}
