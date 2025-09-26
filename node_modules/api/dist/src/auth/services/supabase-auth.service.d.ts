import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
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
export declare class SupabaseAuthService {
    private readonly supabase;
    private readonly configService;
    constructor(supabase: SupabaseClient, configService: ConfigService);
    signInWithEmail(credentials: SignInWithPasswordCredentials): Promise<{
        user: import("@supabase/supabase-js").AuthUser;
        session: import("@supabase/supabase-js").AuthSession;
        weakPassword?: import("@supabase/supabase-js").WeakPassword;
    }>;
    signUp(credentials: SignUpWithPasswordCredentials): Promise<{
        user: import("@supabase/supabase-js").AuthUser | null;
        session: import("@supabase/supabase-js").AuthSession | null;
    }>;
    signOut(): Promise<{
        success: boolean;
    }>;
    getUser(jwt: string): Promise<import("@supabase/supabase-js").AuthUser | null>;
    refreshSession(refreshToken: string): Promise<{
        user: import("@supabase/supabase-js").AuthUser | null;
        session: import("@supabase/supabase-js").AuthSession | null;
    }>;
}
