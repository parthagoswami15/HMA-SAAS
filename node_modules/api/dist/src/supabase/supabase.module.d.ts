import { OnModuleDestroy } from '@nestjs/common';
import { SupabaseClient } from '../config/supabase.config';
export declare const SUPABASE_CLIENT = "SUPABASE_CLIENT";
export declare const InjectSupabase: () => PropertyDecorator & ParameterDecorator;
export declare class SupabaseModule implements OnModuleDestroy {
    private readonly supabase;
    constructor(supabase: SupabaseClient);
    onModuleDestroy(): Promise<void>;
}
