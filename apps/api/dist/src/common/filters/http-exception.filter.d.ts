import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { AuditService } from '../../audit/audit.service';
export declare class HttpExceptionFilter implements ExceptionFilter {
    private readonly auditService?;
    private readonly logger;
    constructor(auditService?: AuditService | undefined);
    catch(exception: unknown, host: ArgumentsHost): void;
}
