import { PrismaClient, Prisma } from '@prisma/client';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testConnection() {
  console.log('Environment Variables:');
  console.log(`- DATABASE_URL: ${process.env.DATABASE_URL ? 'Set' : 'Not set'}`);
  
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    datasourceUrl: process.env.DATABASE_URL,
  });

  try {
    console.log('\nAttempting to connect to database...');
    await prisma.$connect();
    console.log('✅ Successfully connected to the database');
    
    // Test a simple query
    console.log('\nTesting raw SQL query...');
    try {
      const result = await prisma.$queryRaw`SELECT 1 as test`;
      console.log('✅ Test query result:', result);
    } catch (error) {
      console.error('❌ Error executing test query:', error);
    }
    
    // Check database version
    try {
      const version = await prisma.$queryRaw`SELECT version()`;
      console.log('\nDatabase version:', version);
    } catch (error) {
      console.error('❌ Error getting database version:', error);
    }
    
    // Check if patients table exists
    console.log('\nChecking for tables...');
    try {
      const tables = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;
      console.log('\n📋 Available tables:');
      console.table(tables);
      
      // If patients table exists, try to query it
      if (tables.some((t: any) => t.table_name === 'patients')) {
        console.log('\nQuerying patients table...');
        try {
          const patients = await prisma.patient.findMany({ take: 5 });
          console.log('\nSample patients:', patients);
        } catch (error) {
          console.error('❌ Error querying patients table:', error);
        }
      } else {
        console.log('\n❌ Patients table does not exist');
      }
      
    } catch (error) {
      console.error('❌ Error listing tables:', error);
      
      // Try to get error details
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error('Prisma error code:', error.code);
        console.error('Error meta:', error.meta);
      }
    }
    
  } catch (error) {
    console.error('\n❌ Database connection error:');
    console.error(error);
    
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Stack:', error.stack?.split('\n').slice(0, 5).join('\n'));
    }
    
    // Additional diagnostics
    try {
      const url = new URL(process.env.DATABASE_URL || '');
      console.log('\nDatabase connection details:');
      console.log('- Protocol:', url.protocol);
      console.log('- Hostname:', url.hostname);
      console.log('- Port:', url.port);
      console.log('- Database:', url.pathname.replace(/^\//, ''));
    } catch (e) {
      console.error('\nError parsing DATABASE_URL:', e);
    }
  } finally {
    try {
      await prisma.$disconnect();
      console.log('\nDisconnected from database');
    } catch (error) {
      console.error('Error disconnecting from database:', error);
    }
  }
}

// Run with error handling
testConnection()
  .catch((error) => {
    console.error('Unhandled error in testConnection:', error);
    process.exit(1);
  })
  .finally(() => {
    console.log('\nTest completed');
    process.exit(0);
  });
