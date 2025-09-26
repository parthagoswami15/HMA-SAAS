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
const pg_1 = require("pg");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
async function checkDatabase() {
    const pool = new pg_1.Pool({
        connectionString: process.env.DATABASE_URL,
    });
    const client = await pool.connect();
    try {
        console.log('🔍 Testing database connection...');
        await client.query('SELECT 1');
        console.log('✅ Database connection successful');
        console.log('\n📋 Listing all tables in the public schema:');
        const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
        if (tablesRes.rows.length === 0) {
            console.log('ℹ️ No tables found in the public schema');
        }
        else {
            console.table(tablesRes.rows);
        }
    }
    catch (error) {
        console.error('❌ Error:', error.message);
    }
    finally {
        client.release();
        await pool.end();
        console.log('\n✅ Database check complete');
    }
}
checkDatabase()
    .catch(console.error)
    .finally(() => process.exit(0));
//# sourceMappingURL=db-check.js.map