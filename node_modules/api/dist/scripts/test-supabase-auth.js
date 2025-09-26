"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const supabase_auth_service_1 = require("../src/auth/services/supabase-auth.service");
const dotenv = __importStar(require("dotenv"));
async function testSupabaseAuth() {
    dotenv.config();
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const supabaseAuth = app.get(supabase_auth_service_1.SupabaseAuthService);
    const testEmail = 'test@example.com';
    const testPassword = 'Test@123456';
    try {
        console.log('Starting Supabase Auth Test...');
        console.log('----------------------------------------');
        console.log('1. Testing user sign up...');
        const signUpData = await supabaseAuth.signUp({
            email: testEmail,
            password: testPassword,
            options: {
                data: {
                    full_name: 'Test User',
                    role: 'user',
                },
            },
        });
        console.log('✅ Sign up successful:', {
            userId: signUpData.user?.id,
            email: signUpData.user?.email,
            role: signUpData.user?.user_metadata?.role,
        });
        console.log('\n2. Testing user sign in...');
        const signInData = await supabaseAuth.signInWithEmail({
            email: testEmail,
            password: testPassword,
        });
        const accessToken = signInData.session?.access_token;
        const refreshToken = signInData.session?.refresh_token;
        console.log('✅ Sign in successful:', {
            userId: signInData.user?.id,
            accessToken: accessToken ? '***' + accessToken.slice(-8) : 'none',
            refreshToken: refreshToken ? '***' + refreshToken.slice(-8) : 'none',
        });
        console.log('\n3. Testing protected endpoint...');
        const baseUrl = configService.get('APP_URL') || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/auth/test/protected`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        const protectedData = await response.json();
        console.log('✅ Protected endpoint response:', {
            status: response.status,
            data: protectedData,
        });
        console.log('\n✅ All tests completed successfully!');
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('❌ Test failed:', errorMessage);
        if (error && typeof error === 'object' && 'response' in error) {
            const responseError = error;
            console.error('Error details:', responseError.response?.data || 'No additional details');
        }
        process.exit(1);
    }
    finally {
        try {
            console.log('\nCleaning up test user...');
            await supabaseAuth.signOut();
            console.log('✅ Cleanup completed');
        }
        catch (cleanupError) {
            const errorMessage = cleanupError instanceof Error ? cleanupError.message : 'Unknown error during cleanup';
            console.error('❌ Cleanup failed:', errorMessage);
        }
        await app.close();
        process.exit(0);
    }
}
testSupabaseAuth().catch(console.error);
//# sourceMappingURL=test-supabase-auth.js.map