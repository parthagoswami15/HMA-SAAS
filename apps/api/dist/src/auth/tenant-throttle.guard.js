"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantThrottleGuard = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const auth_constants_1 = require("./constants/auth.constants");
let TenantThrottleGuard = class TenantThrottleGuard extends throttler_1.ThrottlerGuard {
    async getTracker(req) {
        const tenantId = req.headers[auth_constants_1.TENANT_ID_HEADER]?.toLowerCase();
        const ip = req.ip;
        if (tenantId) {
            return `tenant:${tenantId}:${ip}`;
        }
        return `ip:${ip}`;
    }
    throwThrottlingException(context) {
        const { req } = this.getRequestResponse(context);
        const tenantId = req.headers[auth_constants_1.TENANT_ID_HEADER]?.toLowerCase();
        const message = tenantId
            ? 'Too many requests for this tenant. Please try again later.'
            : 'Too many requests from this IP. Please try again later.';
        throw new ThrottlerException(message);
    }
    getRequestResponse(context) {
        const httpContext = context.switchToHttp();
        return {
            req: httpContext.getRequest(),
            res: httpContext.getResponse(),
        };
    }
};
exports.TenantThrottleGuard = TenantThrottleGuard;
exports.TenantThrottleGuard = TenantThrottleGuard = __decorate([
    (0, common_1.Injectable)()
], TenantThrottleGuard);
//# sourceMappingURL=tenant-throttle.guard.js.map