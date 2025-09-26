"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupabaseConfig = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const getSupabaseConfig = (configService) => {
    const config = {
        url: configService.get('SUPABASE_URL'),
        anonKey: configService.get('SUPABASE_ANON_KEY'),
        jwtSecret: configService.get('JWT_SECRET'),
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
    if (config.jwtSecret) {
        options.global.headers['Authorization'] = `Bearer ${config.jwtSecret}`;
    }
    return (0, supabase_js_1.createClient)(config.url, config.anonKey, options);
};
exports.getSupabaseConfig = getSupabaseConfig;
//# sourceMappingURL=supabase.config.js.map