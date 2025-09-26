import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { DataSource } from 'typeorm';
import * as pg from 'pg';

async function listTables() {
  console.log('Connecting to database...');
  console.log('Database host:', process.env.DB_HOST);
  
  // Parse DATABASE_URL
  const dbUrl = new URL(process.env.DATABASE_URL || '');
  const username = dbUrl.username;
  const password = dbUrl.password;
  const database = dbUrl.pathname.replace(/^\//, '');
  const host = dbUrl.hostname;
  const port = parseInt(dbUrl.port || '5432', 10);

  console.log('Database connection details:', {
    host,
    port,
    database,
    username,
    password: password ? '***' : 'not set'
  });

  const dataSource = new DataSource({
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    entities: ['src/**/*.entity{.ts,.js}'],
    synchronize: false,
    logging: true,
  });

  await dataSource.initialize();
  
  try {
    const queryRunner = dataSource.createQueryRunner();
    const tables = await queryRunner.query(
      `SELECT table_name 
       FROM information_schema.tables 
       WHERE table_schema = 'public' 
       AND table_type = 'BASE TABLE' 
       ORDER BY table_name;`
    );
    
    console.log('Database Tables:');
    if (tables && tables.length > 0) {
      console.table(tables);
    } else {
      console.log('No tables found in the database.');
    }
  } catch (error) {
    console.error('Error listing tables:');
    console.error(error);
    
    // Try to get more detailed error information
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
    
    // Try to check database connection
    try {
      console.log('Testing database connection...');
      const client = new pg.Client({
        host,
        port,
        user: username,
        password,
        database,
      });
      
      await client.connect();
      console.log('Successfully connected to the database!');
      const result = await client.query("SELECT current_database(), current_user, version();");
      console.log('Database info:', result.rows[0]);
      await client.end();
    } catch (dbError) {
      console.error('Failed to connect to database:');
      console.error(dbError);
    }
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('Database connection closed.');
    }
    process.exit(0);
  }
}

listTables().catch(console.error);
