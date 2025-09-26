import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuditService } from '../../audit/audit.service';
export declare class LoggingInterceptor implements NestInterceptor {
    private readonly auditService;
    private readonly logger;
    constructor(auditService: AuditService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private shouldAuditEndpoint;
}
