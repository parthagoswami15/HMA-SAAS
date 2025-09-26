import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function verifyDatabase() {
  console.log('🔍 Verifying database connection and schema...');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const client = await pool.connect();
  
  try {
    // 1. Test connection
    console.log('\n🔌 Testing database connection...');
    await client.query('SELECT 1');
    console.log('✅ Database connection successful');

    // 2. List all tables
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

    // 3. Check if patients table exists
    const patientsTable = tablesRes.rows.find(
      row => row.table_name.toLowerCase() === 'patients'
    );
    
    console.log(`\n🔍 Patients table exists: ${patientsTable ? '✅' : '❌'}`);

    // 4. If patients table exists, show its structure
    if (patientsTable) {
      console.log('\n📋 Patients table structure:');
      const columnsRes = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'patients'
        ORDER BY ordinal_position;
      `);
      
      if (columnsRes.rows.length > 0) {
        console.table(columnsRes.rows);
      } else {
        console.log('ℹ️ Could not retrieve column information for patients table');
      }
    }

    // 5. Check for any existing data in patients table
    if (patientsTable) {
      console.log('\n🔍 Checking for existing patient records...');
      try {
        const countRes = await client.query('SELECT COUNT(*) FROM patients');
        console.log(`ℹ️ Found ${countRes.rows[0].count} patient records`);
        
        if (parseInt(countRes.rows[0].count) > 0) {
          const sampleRes = await client.query('SELECT * FROM patients LIMIT 3');
          console.log('\nSample patient records:');
          console.table(sampleRes.rows);
        }
      } catch (error) {
        console.error('❌ Error querying patients table:', error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
    console.log('\n✅ Database verification complete');
  }
}

verifyDatabase()
  .catch(console.error)
  .finally(() => process.exit(0));
