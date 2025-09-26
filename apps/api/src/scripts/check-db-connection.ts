import { PrismaClient } from '@prisma/client';

async function checkDbConnection() {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    console.log('🔍 Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Successfully connected to the database');
    
    // List all tables using raw query
    console.log('\n📋 Listing all tables in the database:');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    console.table(tables);
    
    // Check if patients table exists
    const patientsTable = Array.isArray(tables) 
      ? tables.some((t: any) => t.table_name === 'patients') 
      : false;
    
    console.log(`\n🔍 Patients table exists: ${patientsTable ? '✅' : '❌'}`);
    
    if (patientsTable) {
      console.log('\n📋 Patients table structure:');
      const columns = await prisma.$queryRaw`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'patients'
        ORDER BY ordinal_position;
      `;
      console.table(columns);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\nDisconnected from database');
  }
}

checkDbConnection()
  .catch(console.error)
  .finally(() => process.exit(0));
