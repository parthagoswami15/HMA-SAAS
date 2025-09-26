import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  try {
    // 1. Test database connection
    console.log('🔍 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Successfully connected to the database');

    // 2. Get or create a test tenant
    let tenant = await prisma.tenant.findFirst();
    
    if (!tenant) {
      console.log('ℹ️ No tenant found, creating a test tenant...');
      tenant = await prisma.tenant.create({
        data: {
          name: 'Test Hospital',
          slug: 'test-hospital',
        },
      });
      console.log(`✅ Created test tenant: ${tenant.name} (${tenant.id})`);
    } else {
      console.log(`ℹ️ Using existing tenant: ${tenant.name} (${tenant.id})`);
    }

    // 3. Test creating a patient
    console.log('\n🔄 Creating test patient...');
    const patient = await prisma.patient.create({
      data: {
        firstName: 'Test',
        lastName: 'Patient',
        email: `test.patient.${Date.now()}@example.com`,
        medicalRecordNumber: `MRN-${Date.now()}`,
        tenantId: tenant.id,
      },
    });
    console.log('✅ Created patient:', patient);

    // 4. List patients
    const patients = await prisma.patient.findMany({
      where: { tenantId: tenant.id },
      take: 5,
    });
    console.log('\n📋 Patients in the database:');
    console.table(patients);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\nDisconnected from database');
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
