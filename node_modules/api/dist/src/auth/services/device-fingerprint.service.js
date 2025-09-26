"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceFingerprintService = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
let DeviceFingerprintService = class DeviceFingerprintService {
    generateFingerprint(req) {
        const fingerprintData = {
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            accept: req.headers['accept'],
            acceptLanguage: req.headers['accept-language'],
            acceptEncoding: req.headers['accept-encoding'],
            connection: req.headers['connection'],
        };
        const hash = crypto.createHash('sha256');
        hash.update(JSON.stringify(fingerprintData));
        return hash.digest('hex');
    }
    getDeviceInfo(req) {
        const userAgent = req.headers['user-agent'] || '';
        const deviceInfo = {
            ip: req.ip,
            userAgent,
            browser: this.parseUserAgent(userAgent),
            os: this.detectOS(userAgent),
            deviceType: this.detectDeviceType(userAgent),
        };
        return deviceInfo;
    }
    parseUserAgent(userAgent) {
        if (userAgent.includes('Chrome'))
            return 'Chrome';
        if (userAgent.includes('Firefox'))
            return 'Firefox';
        if (userAgent.includes('Safari'))
            return 'Safari';
        if (userAgent.includes('Edge'))
            return 'Edge';
        if (userAgent.includes('Opera'))
            return 'Opera';
        return 'Unknown';
    }
    detectOS(userAgent) {
        if (userAgent.includes('Windows'))
            return 'Windows';
        if (userAgent.includes('Mac OS'))
            return 'macOS';
        if (userAgent.includes('Linux'))
            return 'Linux';
        if (userAgent.includes('Android'))
            return 'Android';
        if (userAgent.includes('iOS') || /iPad|iPhone|iPod/.test(userAgent))
            return 'iOS';
        return 'Unknown';
    }
    detectDeviceType(userAgent) {
        if (/Mobile|Android|iP(ad|hone|od)/i.test(userAgent)) {
            return 'Mobile';
        }
        if (/Tablet|iPad/i.test(userAgent)) {
            return 'Tablet';
        }
        return 'Desktop';
    }
};
exports.DeviceFingerprintService = DeviceFingerprintService;
exports.DeviceFingerprintService = DeviceFingerprintService = __decorate([
    (0, common_1.Injectable)()
], DeviceFingerprintService);
//# sourceMappingURL=device-fingerprint.service.js.map