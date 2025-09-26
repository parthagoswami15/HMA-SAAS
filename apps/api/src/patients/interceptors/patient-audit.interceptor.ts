import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class PatientAuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse();

    const { method, url, body, params, user, headers } = request;
    const tenantId = headers['x-tenant-id'] as string;
    const userId = user?.id || 'system';

    // Skip logging for GET requests
    if (method === 'GET') {
      return next.handle();
    }

    const action = this.getActionFromMethod(method);
    const resourceId = params?.id || body?.id;

    // Clone the request body to avoid reference issues
    let oldValues: any = null;
    let newValues: any = null;

    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      newValues = { ...body };
      // Remove sensitive data before logging
      delete newValues.password;
      delete newValues.token;
    }

    return next.handle().pipe(
      tap(async () => {
        try {
          await this.auditService.log({
            tenantId,
            userId,
            action,
            resource: 'Patient',
            resourceId,
            oldValues,
            newValues,
            ipAddress: request.ip,
            userAgent: headers['user-agent'] || '',
            timestamp: new Date(),
            statusCode: response.statusCode,
            metadata: {
              url,
              method,
              params,
            },
          });
        } catch (error) {
          console.error('Failed to log patient audit:', error);
        }
      }),
    );
  }

  private getActionFromMethod(method: string): string {
    switch (method) {
      case 'POST':
        return 'CREATE';
      case 'PATCH':
      case 'PUT':
        return 'UPDATE';
      case 'DELETE':
        return 'DELETE';
      default:
        return 'UNKNOWN';
    }
  }
}
