import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
declare const SupabaseJwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class SupabaseJwtStrategy extends SupabaseJwtStrategy_base {
    private readonly supabase;
    private readonly configService;
    constructor(supabase: SupabaseClient, configService: ConfigService);
    validate(req: Request, payload: any): Promise<{
        id: string;
        email: string | undefined;
        role: string | undefined;
        app_metadata: import("@supabase/supabase-js").UserAppMetadata;
        user_metadata: import("@supabase/supabase-js").UserMetadata;
    }>;
}
export {};
