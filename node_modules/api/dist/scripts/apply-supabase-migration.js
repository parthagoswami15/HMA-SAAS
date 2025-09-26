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
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv = __importStar(require("dotenv"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
async function runMigration() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file.');
        process.exit(1);
    }
    console.log('🔌 Connecting to Supabase...');
    const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
    try {
        console.log('📄 Reading migration file...');
        const migrationPath = path.join(__dirname, '../supabase/migrations/001_initial_schema.sql');
        if (!fs.existsSync(migrationPath)) {
            console.error(`❌ Migration file not found at: ${migrationPath}`);
            process.exit(1);
        }
        const migrationSql = fs.readFileSync(migrationPath, 'utf-8');
        if (!migrationSql) {
            console.error('❌ Migration file is empty');
            process.exit(1);
        }
        console.log('🚀 Running migration...');
        const statements = migrationSql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);
        for (const [index, statement] of statements.entries()) {
            try {
                console.log(`  🔄 Executing statement ${index + 1}/${statements.length}...`);
                const { data, error } = await supabase.rpc('pgmigrate', {
                    sql: statement + ';'
                });
                if (error) {
                    console.error(`❌ Error in statement ${index + 1}:`, error);
                    console.error('Failed statement:', statement);
                    process.exit(1);
                }
                console.log(`  ✅ Statement ${index + 1} executed successfully`);
            }
            catch (error) {
                console.error(`❌ Failed to execute statement ${index + 1}:`, error);
                process.exit(1);
            }
        }
        console.log('✨ Migration completed successfully!');
        console.log('✅ Database schema has been updated');
    }
    catch (error) {
        console.error('❌ Error running migration:', error);
        process.exit(1);
    }
}
runMigration().catch(console.error);
//# sourceMappingURL=apply-supabase-migration.js.map