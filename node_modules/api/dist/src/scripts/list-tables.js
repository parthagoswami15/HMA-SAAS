"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
async function listTables() {
    const prisma = new client_1.PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
    });
    try {
        console.log('🔍 Connecting to database...');
        await prisma.$connect();
        console.log('✅ Successfully connected to the database\n');
        const result = await prisma.$queryRaw `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
        console.log('📋 Tables in the database:');
        console.table(result);
    }
    catch (error) {
        console.error('❌ Error:', error);
    }
    finally {
        await prisma.$disconnect();
        console.log('\nDisconnected from database');
    }
}
listTables()
    .catch(console.error)
    .finally(() => process.exit(0));
//# sourceMappingURL=list-tables.js.map