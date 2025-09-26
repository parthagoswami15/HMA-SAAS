const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function listTables() {
  try {
    console.log('Listing all tables in hms_saas database...');
    
    // Query to list all tables in the public schema
    const result = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    if (result.length === 0) {
      console.log('No tables found in the database.');
    } else {
      console.log('\nTables in hms_saas database:');
      result.forEach(row => {
        console.log(`- ${row.table_name}`);
      });
    }
    
  } catch (error) {
    console.error('Error listing tables:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listTables();
