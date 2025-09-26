import { PrismaClient } from '@prisma/client';

async function testPatientService() {
  console.log('🚀 Testing Patient Service\n');
  
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  
  try {
    // 1. Connect to the database
    await prisma.$connect();
    console.log('✅ Connected to database\n');
    
    // 2. Get or create a test tenant
    let tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      console.log('ℹ️ Creating test tenant...');
      tenant = await prisma.tenant.create({
        data: {
          name: 'Test Hospital',
          slug: 'test-hospital',
        },
      });
      console.log(`✅ Created tenant: ${tenant.name} (${tenant.id})\n`);
    } else {
      console.log(`ℹ️ Using existing tenant: ${tenant.name} (${tenant.id})\n`);
    }
    
    // 3. Test creating a patient using raw SQL
    console.log('🔄 Creating test patient using raw SQL...');
    const testPatient = {
      id: `pat_${Date.now()}`,
      firstName: 'John',
      lastName: 'Doe',
      email: `john.doe.${Date.now()}@example.com`,
      phone: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      gender: 'MALE',
      dob: new Date('1990-01-01'),
      address: '123 Test St, Test City',
      medicalRecordNumber: `MRN-${Date.now()}`,
      tenantId: tenant.id,
    };
    
    const createdPatient = await prisma.$executeRaw`
      INSERT INTO patients (
        "id", "firstName", "lastName", "email", "phone", 
        "gender", "dob", "address", "medicalRecordNumber", "tenantId"
      ) VALUES (
        ${testPatient.id}, 
        ${testPatient.firstName}, 
        ${testPatient.lastName}, 
        ${testPatient.email},
        ${testPatient.phone},
        ${testPatient.gender}::"public"."Gender",
        ${testPatient.dob},
        ${testPatient.address},
        ${testPatient.medicalRecordNumber},
        ${testPatient.tenantId}
      )
      RETURNING *;
    `;
    
    console.log('✅ Patient created successfully');
    console.log(createdPatient);
    
    // 4. List all patients
    console.log('\n📋 Listing all patients...');
    const patients = await prisma.$queryRaw`
      SELECT p.id, p."firstName", p."lastName", p.email, p.phone, p."medicalRecordNumber" as mrn
      FROM patients p
      WHERE p."tenantId" = ${tenant.id}
      ORDER BY p."createdAt" DESC
      LIMIT 5;
    `;
    
    console.log(`\n📋 Found ${patients.length} patients:`);
    console.table(patients);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\nDisconnected from database');
  }
}

testPatientService()
  .catch(console.error)
  .finally(() => process.exit(0));
