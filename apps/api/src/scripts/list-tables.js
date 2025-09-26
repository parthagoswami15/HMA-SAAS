const { Pool } = require('pg');
require('dotenv').config();

async function listTables() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres@localhost:5432/hms_saas',
  });

  const client = await pool.connect();
  
  try {
    console.log('🔍 Listing all tables in the database...');
    
    // List all tables
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('\n📋 Tables in the database:');
    console.table(tablesRes.rows);

    // For each table, show structure and sample data
    for (const table of tablesRes.rows) {
      console.log(`\n🔍 Structure of table: ${table.table_name}`);
      try {
        const structure = await client.query({
          text: `
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = $1
            ORDER BY ordinal_position;
          `,
          values: [table.table_name]
        });
        
        console.table(structure.rows);
        
        // Show sample data (first 2 rows)
        console.log(`\n📋 Sample data from ${table.table_name}:`);
        const sampleData = await client.query({
          text: `SELECT * FROM "${table.table_name}" LIMIT 2;`
        });
        
        if (sampleData.rows.length > 0) {
          console.table(sampleData.rows);
        } else {
          console.log('  No data found');
        }
        
      } catch (error) {
        console.error(`  Error getting structure for ${table.table_name}:`, error.message);
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

listTables().catch(console.error);
