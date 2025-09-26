import { PrismaClient } from '@prisma/client';

async function testPatient() {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    console.log('🔍 Connecting to database...');
    await prisma.$connect();
    console.log('✅ Successfully connected to the database\n');

    // Get or create a test tenant
    let tenant = await prisma.tenant.findFirst();
    
    if (!tenant) {
      console.log('ℹ️ No tenant found, creating a test tenant...');
      tenant = await prisma.tenant.create({
        data: {
          name: 'Test Hospital',
          slug: 'test-hospital',
        },
      });
      console.log(`✅ Created test tenant: ${tenant.name} (${tenant.id})\n`);
    } else {
      console.log(`ℹ️ Using existing tenant: ${tenant.name} (${tenant.id})\n`);
    }

    // Test creating a patient
    console.log('🔄 Creating test patient...');
    const timestamp = Date.now();
    const patientData = {
      firstName: 'John',
      lastName: 'Doe',
      email: `john.doe.${timestamp}@example.com`,
      medicalRecordNumber: `MRN-${timestamp}`,
      gender: 'MALE',
      phone: `+1${timestamp.toString().slice(0, 10)}`,
      tenantId: tenant.id,
    };

    // Create patient using raw SQL to avoid Prisma model issues
    const result = await prisma.$executeRaw`
      INSERT INTO "public"."patients" (
        "id", "firstName", "lastName", "email", 
        "medicalRecordNumber", "gender", "phone", 
        "tenantId", "createdAt", "updatedAt"
      ) VALUES (
        gen_random_uuid()::text, 
        ${patientData.firstName}, 
        ${patientData.lastName}, 
        ${patientData.email},
        ${patientData.medicalRecordNumber},
        ${patientData.gender}::"public"."Gender",
        ${patientData.phone},
        ${patientData.tenantId},
        NOW(),
        NOW()
      )
      RETURNING *;
    `;

    console.log('✅ Patient created successfully');
    console.log(result);

    // List all patients using raw SQL
    const patients = await prisma.$queryRaw`
      SELECT p.id, p."firstName", p."lastName", p.email, 
             p."medicalRecordNumber" as mrn, t.name as "tenantName"
      FROM "public".patients p
      JOIN "public".tenants t ON p."tenantId" = t.id
      WHERE p."deletedAt" IS NULL
      LIMIT 10;
    `;

    console.log('\n📋 Patients in the database:');
    console.table(patients);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\nDisconnected from database');
  }
}

testPatient()
  .catch(console.error)
  .finally(() => process.exit(0));
