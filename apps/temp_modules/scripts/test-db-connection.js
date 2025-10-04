const { Pool } = require('pg');
require('dotenv').config();

async function testConnection() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const client = await pool.connect();
  
  try {
    console.log('🔍 Testing database connection...');
    
    // Test connection
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
      console.log('\n📋 Tables in the database:');
      console.table(tablesRes.rows);
      
      // Check each table's structure
      for (const table of tablesRes.rows) {
        console.log(`\n🔍 Structure of table: ${table.table_name}`);
        const columnsRes = await client.query({
          text: `
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = $1
            ORDER BY ordinal_position;
          `,
          values: [table.table_name]
        });
        
        if (columnsRes.rows.length > 0) {
          console.table(columnsRes.rows);
        } else {
          console.log('  No columns found or table does not exist');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
    console.log('\n✅ Database check complete');
  }
}

testConnection().catch(console.error);
