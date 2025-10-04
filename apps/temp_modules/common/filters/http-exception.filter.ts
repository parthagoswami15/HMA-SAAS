import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuditService } from '../../audit/audit.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private readonly auditService?: AuditService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: typeof message === 'string' ? message : (message as any).message || 'Unknown error',
      ...(process.env.NODE_ENV === 'development' && {
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    };

    // Log error details
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${errorResponse.message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    // Log to audit service for critical errors
    if (status >= 500 && this.auditService && (request as any).user) {
      this.auditService.log({
        tenantId: (request as any).user.tenantId,
        userId: (request as any).user.userId,
        action: 'error',
        resource: 'system',
        ipAddress: request.ip,
        userAgent: request.get('User-Agent'),
        metadata: {
          error: errorResponse,
          category: 'system_error',
        },
      }).catch(err => {
        this.logger.error('Failed to log error to audit service', err);
      });
    }

    response.status(status).json(errorResponse);
  }
}
