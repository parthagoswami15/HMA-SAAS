import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class DeviceFingerprintService {
  /**
   * Generate a unique device fingerprint based on request headers
   * @param req The HTTP request object
   * @returns A unique device fingerprint string
   */
  generateFingerprint(req: Request): string {
    const fingerprintData = {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      accept: req.headers['accept'],
      acceptLanguage: req.headers['accept-language'],
      acceptEncoding: req.headers['accept-encoding'],
      connection: req.headers['connection'],
      // Add more headers as needed
    };

    // Create a hash of the fingerprint data
    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(fingerprintData));
    return hash.digest('hex');
  }

  /**
   * Get device information from the request
   * @param req The HTTP request object
   * @returns Device information object
   */
  getDeviceInfo(req: Request): any {
    const userAgent = req.headers['user-agent'] || '';
    
    // Parse user agent string to extract browser and OS info
    const deviceInfo: any = {
      ip: req.ip,
      userAgent,
      browser: this.parseUserAgent(userAgent),
      os: this.detectOS(userAgent),
      deviceType: this.detectDeviceType(userAgent),
    };

    return deviceInfo;
  }

  private parseUserAgent(userAgent: string): string {
    // Simple user agent parsing (can be enhanced with a library like ua-parser-js)
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    return 'Unknown';
  }

  private detectOS(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac OS')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS') || /iPad|iPhone|iPod/.test(userAgent)) return 'iOS';
    return 'Unknown';
  }

  private detectDeviceType(userAgent: string): string {
    if (/Mobile|Android|iP(ad|hone|od)/i.test(userAgent)) {
      return 'Mobile';
    }
    if (/Tablet|iPad/i.test(userAgent)) {
      return 'Tablet';
    }
    return 'Desktop';
  }
}
