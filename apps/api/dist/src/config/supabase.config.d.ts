import { SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
export declare const getSupabaseConfig: (configService: ConfigService) => SupabaseClient;
export type { SupabaseClient };
