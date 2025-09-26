const { Pool } = require('pg');
require('dotenv').config();

async function verifyDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const client = await pool.connect();
  
  try {
    console.log('🔍 Testing database connection...');
    await client.query('SELECT 1');
    console.log('✅ Database connection successful');

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

    console.log('\n🔍 Checking if patients table exists...');
    const patientsTable = tablesRes.rows.some(row => 
      row.table_name === 'patients' || row.table_name === 'Patients'
    );
    
    console.log(`Patients table exists: ${patientsTable ? '✅' : '❌'}`);
    
    if (patientsTable) {
      console.log('\n📋 Patients table structure:');
      const columnsRes = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name IN ('patients', 'Patients')
        ORDER BY ordinal_position;
      `);
      
      if (columnsRes.rows.length > 0) {
        console.table(columnsRes.rows);
      } else {
        console.log('ℹ️ Could not retrieve column information for patients table');
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

verifyDatabase().catch(console.error);
