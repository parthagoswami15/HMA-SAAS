import { Request, Response } from 'express';
import { SupabaseAuthService, SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from '../services/supabase-auth.service';
export declare class SupabaseAuthController {
    private readonly supabaseAuthService;
    constructor(supabaseAuthService: SupabaseAuthService);
    signIn(credentials: SignInWithPasswordCredentials): Promise<{
        user: import("@supabase/auth-js").User;
        session: import("@supabase/auth-js").Session;
        weakPassword?: import("@supabase/auth-js").WeakPassword;
    }>;
    signUp(credentials: SignUpWithPasswordCredentials): Promise<{
        user: import("@supabase/auth-js").User | null;
        session: import("@supabase/auth-js").Session | null;
    }>;
    signOut(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    refreshToken(refreshToken: string): Promise<{
        user: import("@supabase/auth-js").User | null;
        session: import("@supabase/auth-js").Session | null;
    }>;
    getProfile(req: Request): Express.User | undefined;
}
