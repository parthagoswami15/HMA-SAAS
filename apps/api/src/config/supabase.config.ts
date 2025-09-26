import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

interface SupabaseConfig {
  url: string;
  anonKey: string;
  jwtSecret?: string;
}

export const getSupabaseConfig = (configService: ConfigService): SupabaseClient => {
  const config: SupabaseConfig = {
    url: configService.get<string>('SUPABASE_URL'),
    anonKey: configService.get<string>('SUPABASE_ANON_KEY'),
    jwtSecret: configService.get<string>('JWT_SECRET'),
  };

  if (!config.url || !config.anonKey) {
    throw new Error('Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file.');
  }

  const options = {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
      detectSessionInUrl: true,
    },
    global: {
      headers: {}
    }
  };

  // Add JWT secret for service role operations if available
  if (config.jwtSecret) {
    options.global.headers['Authorization'] = `Bearer ${config.jwtSecret}`;
  }

  return createClient(config.url, config.anonKey, options);
};

export type { SupabaseClient };
