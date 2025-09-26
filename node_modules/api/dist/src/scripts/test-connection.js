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
const dotenv = __importStar(require("dotenv"));
dotenv.config();
async function testConnection() {
    console.log('Environment Variables:');
    console.log(`- DATABASE_URL: ${process.env.DATABASE_URL ? 'Set' : 'Not set'}`);
    const prisma = new client_1.PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
        datasourceUrl: process.env.DATABASE_URL,
    });
    try {
        console.log('\nAttempting to connect to database...');
        await prisma.$connect();
        console.log('✅ Successfully connected to the database');
        console.log('\nTesting raw SQL query...');
        try {
            const result = await prisma.$queryRaw `SELECT 1 as test`;
            console.log('✅ Test query result:', result);
        }
        catch (error) {
            console.error('❌ Error executing test query:', error);
        }
        try {
            const version = await prisma.$queryRaw `SELECT version()`;
            console.log('\nDatabase version:', version);
        }
        catch (error) {
            console.error('❌ Error getting database version:', error);
        }
        console.log('\nChecking for tables...');
        try {
            const tables = await prisma.$queryRaw `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;
            console.log('\n📋 Available tables:');
            console.table(tables);
            if (tables.some((t) => t.table_name === 'patients')) {
                console.log('\nQuerying patients table...');
                try {
                    const patients = await prisma.patient.findMany({ take: 5 });
                    console.log('\nSample patients:', patients);
                }
                catch (error) {
                    console.error('❌ Error querying patients table:', error);
                }
            }
            else {
                console.log('\n❌ Patients table does not exist');
            }
        }
        catch (error) {
            console.error('❌ Error listing tables:', error);
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                console.error('Prisma error code:', error.code);
                console.error('Error meta:', error.meta);
            }
        }
    }
    catch (error) {
        console.error('\n❌ Database connection error:');
        console.error(error);
        if (error instanceof Error) {
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Stack:', error.stack?.split('\n').slice(0, 5).join('\n'));
        }
        try {
            const url = new URL(process.env.DATABASE_URL || '');
            console.log('\nDatabase connection details:');
            console.log('- Protocol:', url.protocol);
            console.log('- Hostname:', url.hostname);
            console.log('- Port:', url.port);
            console.log('- Database:', url.pathname.replace(/^\//, ''));
        }
        catch (e) {
            console.error('\nError parsing DATABASE_URL:', e);
        }
    }
    finally {
        try {
            await prisma.$disconnect();
            console.log('\nDisconnected from database');
        }
        catch (error) {
            console.error('Error disconnecting from database:', error);
        }
    }
}
testConnection()
    .catch((error) => {
    console.error('Unhandled error in testConnection:', error);
    process.exit(1);
})
    .finally(() => {
    console.log('\nTest completed');
    process.exit(0);
});
//# sourceMappingURL=test-connection.js.map