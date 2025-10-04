import { PrismaClient } from '@prisma/client';

async function directQuery() {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    console.log('🔍 Connecting to database...');
    await prisma.$connect();
    console.log('✅ Successfully connected to the database\n');

    // 1. Create enum types if they don't exist
    console.log('🔄 Creating enum types if they don\'t exist...');
    await prisma.$executeRaw`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Gender') THEN
          CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'UNKNOWN', 'NOT_SPECIFIED');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'BloodType') THEN
          CREATE TYPE "public"."BloodType" AS ENUM ('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE', 'UNKNOWN');
        END IF;
      END
      $$;
    `;
    console.log('✅ Created enum types');

    // 2. List all tables in the public schema
    console.log('\n📋 Listing all tables in the public schema...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    console.log('\n📋 Tables in the database:');
    console.table(tables);

    // 3. Create patients table if it doesn't exist
    if (!tables.some((t: any) => t.table_name === 'patients')) {
      console.log('\n🔄 Creating patients table...');
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "public"."patients" (
          "id" TEXT NOT NULL,
          "firstName" TEXT NOT NULL,
          "lastName" TEXT NOT NULL,
          "dob" TIMESTAMP(3),
          "gender" "public"."Gender" NOT NULL DEFAULT 'UNKNOWN',
          "phone" TEXT,
          "email" TEXT,
          "address" TEXT,
          "medicalRecordNumber" TEXT NOT NULL,
          "bloodType" "public"."BloodType" DEFAULT 'UNKNOWN',
          "allergies" TEXT,
          "notes" TEXT,
          "tenantId" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          "deletedAt" TIMESTAMP(3),
          CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
        );
      `;
      console.log('✅ Created patients table');
      
      // Add indexes
      await prisma.$executeRaw`
        CREATE UNIQUE INDEX IF NOT EXISTS "patients_email_key" ON "public"."patients"("email");
        CREATE UNIQUE INDEX IF NOT EXISTS "patients_medicalRecordNumber_key" ON "public"."patients"("medicalRecordNumber");
        CREATE INDEX IF NOT EXISTS "patients_tenantId_idx" ON "public"."patients"("tenantId");
        CREATE INDEX IF NOT EXISTS "patients_lastName_firstName_idx" ON "public"."patients"("lastName", "firstName");
      `;
      console.log('✅ Created indexes');
      
      // Add foreign key
      await prisma.$executeRaw`
        ALTER TABLE "public"."patients" 
        ADD CONSTRAINT "patients_tenantId_fkey" 
        FOREIGN KEY ("tenantId") 
        REFERENCES "public"."tenants"("id") 
        ON DELETE RESTRICT ON UPDATE CASCADE;
      `;
      console.log('✅ Added foreign key');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\nDisconnected from database');
  }
}

directQuery()
  .catch(console.error)
  .finally(() => process.exit(0));
