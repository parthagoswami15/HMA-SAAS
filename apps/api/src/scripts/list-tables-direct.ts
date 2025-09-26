import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function listTables() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const client = await pool.connect();
  
  try {
    console.log('🔍 Querying database for tables...');
    
    // List all tables
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('\n📋 Tables in the database:');
    console.table(tablesRes.rows);
    
    console.log('\n🔍 Checking if patients table exists...');
    const patientsTableExists = tablesRes.rows.some(row => 
      row.table_name === 'patients' || row.table_name === 'Patients'
    );
    
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
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    client.release();
    await pool.end();
    console.log('\nDisconnected from database');
  }
}

listTables()
  .catch(console.error)
  .finally(() => process.exit(0));
