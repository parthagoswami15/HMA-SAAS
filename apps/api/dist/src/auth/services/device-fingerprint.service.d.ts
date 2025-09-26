import { Request } from 'express';
export declare class DeviceFingerprintService {
    generateFingerprint(req: Request): string;
    getDeviceInfo(req: Request): any;
    private parseUserAgent;
    private detectOS;
    private detectDeviceType;
}
