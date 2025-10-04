import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp: string;
  path?: string;
  method?: string;
  statusCode?: number;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const now = new Date();
    
    return next.handle().pipe(
      map((data) => {
        const statusCode = response.statusCode;
        const isError = statusCode >= 400;
        
        // Handle paginated responses
        if (data && typeof data === 'object' && 'items' in data && 'meta' in data) {
          return {
            success: !isError,
            data: data.items,
            meta: data.meta,
            message: isError ? data.message || 'Error occurred' : 'Request successful',
            timestamp: now.toISOString(),
            path: request.url,
            method: request.method,
            statusCode,
          };
        }
        
        // Handle standard responses
        const responseData = data?.data !== undefined ? data.data : data;
        const message = data?.message || (isError ? 'Error occurred' : 'Request successful');
        
        return {
          success: !isError,
          data: responseData,
          message,
          timestamp: now.toISOString(),
          path: request.url,
          method: request.method,
          statusCode,
        };
      }),
    );
  }
}
