export interface AuthUser {
    id: string;
    email: string;
    role?: string;
    app_metadata?: Record<string, any>;
    user_metadata?: Record<string, any>;
}
export declare const CurrentUser: (...dataOrPipes: (import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | keyof AuthUser | undefined)[]) => ParameterDecorator;
