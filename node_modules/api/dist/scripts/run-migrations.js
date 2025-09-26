"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const typeorm_1 = require("typeorm");
const path = __importStar(require("path"));
const pg = __importStar(require("pg"));
async function runMigrations() {
    console.log('Starting database migrations...');
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
    const dataSource = new typeorm_1.DataSource({
        type: 'postgres',
        host,
        port,
        username,
        password,
        database,
        entities: [path.join(__dirname, '../src/**/*.entity{.ts,.js}')],
        migrations: [path.join(__dirname, '../src/database/migrations/*{.ts,.js}')],
        migrationsRun: false,
        synchronize: false,
        logging: true,
    });
    try {
        await dataSource.initialize();
        console.log('Data Source has been initialized!');
        console.log('Running migrations...');
        await dataSource.runMigrations();
        console.log('Migrations have been run successfully!');
        const queryRunner = dataSource.createQueryRunner();
        const migrations = await queryRunner.query('SELECT * FROM migrations ORDER BY timestamp DESC;');
        console.log('\nApplied migrations:');
        if (migrations && migrations.length > 0) {
            console.table(migrations);
        }
        else {
            console.log('No migrations found in the migrations table.');
        }
    }
    catch (error) {
        console.error('Error during migration:', error);
        try {
            console.log('\nAttempting to connect to the database directly...');
            const client = new pg.Client({
                host,
                port,
                user: username,
                password,
                database,
            });
            await client.connect();
            console.log('Successfully connected to the database!');
            const dbCheck = await client.query('SELECT datname FROM pg_database WHERE datname = $1', [database]);
            if (dbCheck.rows.length === 0) {
                console.error(`\nError: Database '${database}' does not exist.`);
                console.log('Available databases:');
                const allDbs = await client.query('SELECT datname FROM pg_database WHERE datistemplate = false;');
                console.table(allDbs.rows);
            }
            else {
                console.log(`\nDatabase '${database}' exists.`);
                try {
                    const migrationsTable = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'migrations';");
                    if (migrationsTable.rows.length === 0) {
                        console.log("Migrations table does not exist. It will be created when you run your first migration.");
                    }
                    else {
                        console.log("Migrations table exists. Listing migrations:");
                        const migrations = await client.query('SELECT * FROM migrations ORDER BY timestamp DESC;');
                        console.table(migrations.rows);
                    }
                }
                catch (tableError) {
                    console.error('Error checking migrations table:', tableError);
                }
            }
            await client.end();
        }
        catch (dbError) {
            console.error('Failed to connect to database:', dbError);
        }
        process.exit(1);
    }
    finally {
        if (dataSource.isInitialized) {
            await dataSource.destroy();
            console.log('\nDatabase connection closed.');
        }
    }
}
runMigrations().catch(error => {
    console.error('Fatal error during migration:', error);
    process.exit(1);
});
//# sourceMappingURL=run-migrations.js.map