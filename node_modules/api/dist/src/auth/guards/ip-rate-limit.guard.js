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
var IpRateLimitGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpRateLimitGuard = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const device_fingerprint_service_1 = require("../services/device-fingerprint.service");
let IpRateLimitGuard = IpRateLimitGuard_1 = class IpRateLimitGuard extends throttler_1.ThrottlerGuard {
    options;
    tracker;
    storageService;
    deviceFingerprintService;
    logger = new common_1.Logger(IpRateLimitGuard_1.name);
    constructor(options, tracker, storageService, deviceFingerprintService) {
        super(options, tracker, storageService);
        this.options = options;
        this.tracker = tracker;
        this.storageService = storageService;
        this.deviceFingerprintService = deviceFingerprintService;
    }
    async handleRequest(context, limit, ttl) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const ip = this.getIpAddress(request);
        const deviceFingerprint = this.deviceFingerprintService.generateFingerprint(request);
        const deviceInfo = this.deviceFingerprintService.getDeviceInfo(request);
        const key = this.generateKey(context, `${ip}:${deviceFingerprint}`);
        const { totalHits, timeToExpire } = await this.storageService.increment(key, ttl);
        response.setHeader('X-RateLimit-Limit', limit);
        response.setHeader('X-RateLimit-Remaining', Math.max(0, limit - totalHits));
        response.setHeader('X-RateLimit-Reset', Math.ceil(timeToExpire / 1000));
        this.logRequest(request, ip, deviceInfo, totalHits);
        if (totalHits > limit) {
            this.logger.warn(`Rate limit exceeded for IP: ${ip}, Path: ${request.path}, Device: ${JSON.stringify(deviceInfo)}`);
            this.throwThrottlingException(context);
        }
        return true;
    }
    getIpAddress(request) {
        return (request.headers['x-forwarded-for'] ||
            request.headers['x-real-ip'] ||
            request.ip ||
            'unknown-ip');
    }
    logRequest(request, ip, deviceInfo, hitCount) {
        this.logger.debug(`Request from IP: ${ip}, ` +
            `Path: ${request.path}, ` +
            `Method: ${request.method}, ` +
            `Device: ${JSON.stringify(deviceInfo)}, ` +
            `Hits: ${hitCount}`);
    }
};
exports.IpRateLimitGuard = IpRateLimitGuard;
exports.IpRateLimitGuard = IpRateLimitGuard = IpRateLimitGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object, Object, Object, device_fingerprint_service_1.DeviceFingerprintService])
], IpRateLimitGuard);
//# sourceMappingURL=ip-rate-limit.guard.js.map