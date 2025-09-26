import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function checkDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const client = await pool.connect();
  
  try {
    // Test connection
    console.log('🔍 Testing database connection...');
    await client.query('SELECT 1');
    console.log('✅ Database connection successful');

    // List all tables
    console.log('\n📋 Listing all tables in the public schema:');
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    if (tablesRes.rows.length === 0) {
      console.log('ℹ️ No tables found in the public schema');
    } else {
      console.table(tablesRes.rows);
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
    console.log('\n✅ Database check complete');
  }
}

checkDatabase()
  .catch(console.error)
  .finally(() => process.exit(0));
