import { Module, Global, Inject, OnModuleDestroy } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getSupabaseConfig, SupabaseClient } from '../config/supabase.config';

export const SUPABASE_CLIENT = 'SUPABASE_CLIENT';

export const InjectSupabase = () => Inject(SUPABASE_CLIENT);

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: SUPABASE_CLIENT,
      useFactory: (configService: ConfigService) => {
        return getSupabaseConfig(configService);
      },
      inject: [ConfigService],
    },
    {
      provide: 'SUPABASE_AUTH',
      useFactory: (supabase: SupabaseClient) => {
        return supabase.auth;
      },
      inject: [SUPABASE_CLIENT],
    },
  ],
  exports: [SUPABASE_CLIENT, 'SUPABASE_AUTH'],
})
export class SupabaseModule implements OnModuleDestroy {
  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabase: SupabaseClient,
  ) {}

  async onModuleDestroy() {
    // Clean up any resources when the module is destroyed
    await this.supabase.auth.signOut();
  }
}
