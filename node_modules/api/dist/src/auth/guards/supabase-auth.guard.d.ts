import { ExecutionContext } from '@nestjs/common';
declare const SupabaseAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class SupabaseAuthGuard extends SupabaseAuthGuard_base {
    getRequest(context: ExecutionContext): any;
}
export {};
