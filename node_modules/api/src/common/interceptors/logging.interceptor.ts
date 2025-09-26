import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, ip } = request;
    const userAgent = request.get('User-Agent') || '';
    const startTime = Date.now();

    this.logger.log(`${method} ${url} - ${ip} - ${userAgent}`);

    return next.handle().pipe(
      tap(() => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        const { statusCode } = response;

        this.logger.log(
          `${method} ${url} - ${statusCode} - ${duration}ms - ${ip}`,
        );

        // Log API access to audit service for authenticated requests
        if ((request as any).user && this.shouldAuditEndpoint(url)) {
          this.auditService.log({
            tenantId: (request as any).user.tenantId,
            userId: (request as any).user.userId,
            action: `api_access_${method.toLowerCase()}`,
            resource: 'system',
            ipAddress: ip,
            userAgent: userAgent,
            metadata: {
              category: 'api_access',
              endpoint: url,
              statusCode,
              duration,
            },
          }).catch((err: any) => {
            this.logger.error('Failed to log API access to audit service', err);
          });
        }
      }),
      catchError((error) => {
        const endTime = Date.now();
        const duration = endTime - startTime;

        this.logger.error(
          `${method} ${url} - ERROR - ${duration}ms - ${ip}`,
          error.stack,
        );

        throw error;
      }),
    );
  }

  private shouldAuditEndpoint(url: string): boolean {
    const auditableEndpoints = [
      '/patients',
      '/lab',
      '/pharmacy',
      '/billing',
      '/export',
      '/audit',
      '/admin',
    ];

    return auditableEndpoints.some(endpoint => url.includes(endpoint));
  }
}
