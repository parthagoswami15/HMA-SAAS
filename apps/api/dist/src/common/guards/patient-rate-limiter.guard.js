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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientRateLimiterGuard = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
let PatientRateLimiterGuard = class PatientRateLimiterGuard extends throttler_1.ThrottlerGuard {
    options;
    reflector;
    configService;
    constructor(options, reflector, configService) {
        super(options, reflector);
        this.options = options;
        this.reflector = reflector;
        this.configService = configService;
    }
    async getTracker(req) {
        const tenantId = req.headers['x-tenant-id'] || 'unknown-tenant';
        const ip = req.ip;
        return `${tenantId}:${ip}`;
    }
    async handleRequest(context, limit, ttl, throttler) {
        const { req, res } = this.getRequestResponse(context);
        const ttlValue = this.configService.get('THROTTLE_TTL', 60);
        const limitValue = this.configService.get('THROTTLE_LIMIT', 100);
        const isWriteOperation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
        const operationLimit = isWriteOperation ? Math.floor(limitValue / 2) : limitValue;
        try {
            const { totalHits, timeToExpire } = await throttler.increment(await this.getTracker(req), ttlValue);
            res.header('X-RateLimit-Limit', operationLimit.toString());
            res.header('X-RateLimit-Remaining', Math.max(0, operationLimit - totalHits).toString());
            res.header('X-RateLimit-Reset', new Date(Date.now() + timeToExpire * 1000).toISOString());
            if (totalHits > operationLimit) {
                res.header('Retry-After', timeToExpire.toString());
                this.throwThrottlingException(context);
            }
            return true;
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('ThrottlerException')) {
                throw error;
            }
            return true;
        }
    }
};
exports.PatientRateLimiterGuard = PatientRateLimiterGuard;
exports.PatientRateLimiterGuard = PatientRateLimiterGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object, core_1.Reflector,
        config_1.ConfigService])
], PatientRateLimiterGuard);
//# sourceMappingURL=patient-rate-limiter.guard.js.map