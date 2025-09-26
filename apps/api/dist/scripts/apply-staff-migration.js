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
const client_1 = require("@prisma/client");
const child_process_1 = require("child_process");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
async function applyStaffMigration() {
    console.log('Starting staff management migration...');
    require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL environment variable is not set');
    }
    try {
        const prisma = new client_1.PrismaClient();
        await prisma.$connect();
        console.log('✅ Connected to the database');
        const migrationPath = path.join(__dirname, '../prisma/migrations/20240910_add_staff_management_models.sql');
        if (!fs.existsSync(migrationPath)) {
            throw new Error(`Migration file not found at ${migrationPath}`);
        }
        console.log('📄 Found migration file');
        console.log('🚀 Applying database migration...');
        const sql = fs.readFileSync(migrationPath, 'utf8');
        await prisma.$executeRawUnsafe(sql);
        console.log('✅ Database migration applied successfully');
        console.log('🔧 Generating Prisma client...');
        (0, child_process_1.execSync)('npx prisma generate', { stdio: 'inherit' });
        console.log('✨ Staff management setup completed successfully!');
    }
    catch (error) {
        console.error('❌ Error applying migration:', error);
        process.exit(1);
    }
    finally {
        await prisma.$disconnect();
    }
}
applyStaffMigration().catch(console.error);
//# sourceMappingURL=apply-staff-migration.js.map