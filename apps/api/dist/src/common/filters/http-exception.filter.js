"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var HttpExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const audit_service_1 = require("../../audit/audit.service");
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    auditService;
    logger = new common_1.Logger(HttpExceptionFilter_1.name);
    constructor(auditService) {
        this.auditService = auditService;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception instanceof common_1.HttpException
            ? exception.getResponse()
            : 'Internal server error';
        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: typeof message === 'string' ? message : message.message || 'Unknown error',
            ...(process.env.NODE_ENV === 'development' && {
                stack: exception instanceof Error ? exception.stack : undefined,
            }),
        };
        this.logger.error(`${request.method} ${request.url} - ${status} - ${errorResponse.message}`, exception instanceof Error ? exception.stack : undefined);
        if (status >= 500 && this.auditService && request.user) {
            this.auditService.log({
                tenantId: request.user.tenantId,
                userId: request.user.userId,
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
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [audit_service_1.AuditService])
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map