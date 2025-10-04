import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
import { InjectSupabase, SUPABASE_CLIENT } from '../../supabase/supabase.module';

export interface SignInWithPasswordCredentials {
  email: string;
  password: string;
}

export interface SignUpWithPasswordCredentials extends SignInWithPasswordCredentials {
  email: string;
  password: string;
  options?: {
    data?: Record<string, any>;
    emailRedirectTo?: string;
  };
}

@Injectable()
export class SupabaseAuthService {
  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabase: SupabaseClient,
    private readonly configService: ConfigService,
  ) {}

  async signInWithEmail(credentials: SignInWithPasswordCredentials) {
    const { email, password } = credentials;
    const { data, error } = await this.supabase.auth.signInWithPassword({
      options: {
        data: {
          // Add any additional user metadata here
          last_login: new Date().toISOString(),
        },
      },
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  }

  async signUp(credentials: SignUpWithPasswordCredentials) {
    const { email, password, options } = credentials;
    
    // Set default options if not provided
    const signUpOptions = {
      emailRedirectTo: this.configService.get<string>('APP_URL') + '/auth/confirm',
      data: {
        signup_date: new Date().toISOString(),
        ...options?.data,
      },
      ...options,
    };

    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: signUpOptions,
    });

    if (error) {
      throw error;
    }

    return data;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      throw error;
    }
    return { success: true };
  }

  async getUser(jwt: string) {
    const { data: { user }, error } = await this.supabase.auth.getUser(jwt);
    
    if (error) {
      throw error;
    }

    return user;
  }

  async refreshSession(refreshToken: string) {
    const { data, error } = await this.supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) {
      throw error;
    }

    return data;
  }
}
