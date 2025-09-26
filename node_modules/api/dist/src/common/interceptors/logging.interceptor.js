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
var LoggingInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const audit_service_1 = require("../../audit/audit.service");
let LoggingInterceptor = LoggingInterceptor_1 = class LoggingInterceptor {
    auditService;
    logger = new common_1.Logger(LoggingInterceptor_1.name);
    constructor(auditService) {
        this.auditService = auditService;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const { method, url, ip } = request;
        const userAgent = request.get('User-Agent') || '';
        const startTime = Date.now();
        this.logger.log(`${method} ${url} - ${ip} - ${userAgent}`);
        return next.handle().pipe((0, operators_1.tap)(() => {
            const endTime = Date.now();
            const duration = endTime - startTime;
            const { statusCode } = response;
            this.logger.log(`${method} ${url} - ${statusCode} - ${duration}ms - ${ip}`);
            if (request.user && this.shouldAuditEndpoint(url)) {
                this.auditService.log({
                    tenantId: request.user.tenantId,
                    userId: request.user.userId,
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
                }).catch((err) => {
                    this.logger.error('Failed to log API access to audit service', err);
                });
            }
        }), (0, operators_1.catchError)((error) => {
            const endTime = Date.now();
            const duration = endTime - startTime;
            this.logger.error(`${method} ${url} - ERROR - ${duration}ms - ${ip}`, error.stack);
            throw error;
        }));
    }
    shouldAuditEndpoint(url) {
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
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = LoggingInterceptor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_service_1.AuditService])
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map