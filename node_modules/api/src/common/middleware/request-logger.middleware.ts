import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('User-Agent') || '';
    const startTime = Date.now();

    // Log request start
    this.logger.log(`Incoming ${method} ${originalUrl} from ${ip}`);

    // Override res.end to capture response details
    const originalEnd = res.end.bind(res);
    res.end = function(chunk?: any, encoding?: any, cb?: () => void) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      const { statusCode } = res;
      const contentLength = res.get('Content-Length') || 0;

      // Log response details
      const logger = new Logger(RequestLoggerMiddleware.name);
      logger.log(
        `${method} ${originalUrl} - ${statusCode} - ${duration}ms - ${contentLength} bytes - ${ip}`,
      );

      // Call original end method
      return originalEnd(chunk, encoding, cb);
    };

    next();
  }
}
