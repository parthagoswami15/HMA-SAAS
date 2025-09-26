"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let TransformInterceptor = class TransformInterceptor {
    intercept(context, next) {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const now = new Date();
        return next.handle().pipe((0, operators_1.map)((data) => {
            const statusCode = response.statusCode;
            const isError = statusCode >= 400;
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
        }));
    }
};
exports.TransformInterceptor = TransformInterceptor;
exports.TransformInterceptor = TransformInterceptor = __decorate([
    (0, common_1.Injectable)()
], TransformInterceptor);
//# sourceMappingURL=transform.interceptor.js.map