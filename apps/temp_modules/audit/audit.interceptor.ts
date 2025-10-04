import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const startedAt = Date.now();
    return next.handle().pipe(
      tap(async () => {
        try {
          const tenantId: string | undefined = req.headers['x-tenant-id'];
          await this.prisma.auditLog.create({
            data: {
              tenantId: tenantId || 'unknown',
              userId: req.user?.userId,
              action: `${req.method} ${req.route?.path || req.url}`,
              resource: req.route?.path,
              method: req.method,
              path: req.url,
              ip: req.ip,
              statusCode: req.res?.statusCode,
              metadata: { durationMs: Date.now() - startedAt, requestId: req.requestId } as any,
            } as any,
          });
        } catch {}
      }),
    );
  }
}


