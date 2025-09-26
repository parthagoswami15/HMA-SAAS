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
async function listTables() {
    const pool = new pg_1.Pool({
        connectionString: process.env.DATABASE_URL,
    });
    const client = await pool.connect();
    try {
        console.log('🔍 Querying database for tables...');
        const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
        console.log('\n📋 Tables in the database:');
        console.table(tablesRes.rows);
        console.log('\n🔍 Checking if patients table exists...');
        const patientsTableExists = tablesRes.rows.some(row => row.table_name === 'patients' || row.table_name === 'Patients');
        console.log(`Patients table exists: ${patientsTableExists ? '✅' : '❌'}`);
        if (patientsTableExists) {
            console.log('\n📋 Patients table structure:');
            const columnsRes = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name IN ('patients', 'Patients')
        ORDER BY ordinal_position;
      `);
            console.table(columnsRes.rows);
        }
    }
    catch (error) {
        console.error('❌ Error:', error);
    }
    finally {
        client.release();
        await pool.end();
        console.log('\nDisconnected from database');
    }
}
listTables()
    .catch(console.error)
    .finally(() => process.exit(0));
//# sourceMappingURL=list-tables-direct.js.map