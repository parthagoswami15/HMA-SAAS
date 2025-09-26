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
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: '.env' });
const typeorm_1 = require("typeorm");
const pg = __importStar(require("pg"));
async function listTables() {
    console.log('Connecting to database...');
    console.log('Database host:', process.env.DB_HOST);
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
        entities: ['src/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: true,
    });
    await dataSource.initialize();
    try {
        const queryRunner = dataSource.createQueryRunner();
        const tables = await queryRunner.query(`SELECT table_name 
       FROM information_schema.tables 
       WHERE table_schema = 'public' 
       AND table_type = 'BASE TABLE' 
       ORDER BY table_name;`);
        console.log('Database Tables:');
        if (tables && tables.length > 0) {
            console.table(tables);
        }
        else {
            console.log('No tables found in the database.');
        }
    }
    catch (error) {
        console.error('Error listing tables:');
        console.error(error);
        if (error instanceof Error) {
            console.error('Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack,
            });
        }
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
        }
        catch (dbError) {
            console.error('Failed to connect to database:');
            console.error(dbError);
        }
    }
    finally {
        if (dataSource.isInitialized) {
            await dataSource.destroy();
            console.log('Database connection closed.');
        }
        process.exit(0);
    }
}
listTables().catch(console.error);
//# sourceMappingURL=list-tables.js.map