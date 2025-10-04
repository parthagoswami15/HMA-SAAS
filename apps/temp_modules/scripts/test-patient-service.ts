import { PrismaClient } from '@prisma/client';

// Simple test to verify patient service functionality
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
    
    // 3. Test creating a patient
    console.log('🔄 Creating test patient...');
    const testPatient = {
      firstName: 'John',
      lastName: 'Doe',
      email: `john.doe.${Date.now()}@example.com`,
      phone: '+1234567890',
      gender: 'MALE',
      dob: new Date('1990-01-01'),
      address: '123 Test St, Test City',
      medicalRecordNumber: `MRN-${Date.now()}`,
      tenantId: tenant.id,
    };
    
    const createdPatient = await prisma.patient.create({
      data: testPatient,
    });
    
    console.log('✅ Patient created successfully:');
    console.log({
      id: createdPatient.id,
      name: `${createdPatient.firstName} ${createdPatient.lastName}`,
      email: createdPatient.email,
      mrn: createdPatient.medicalRecordNumber,
    });
    
    // 4. List all patients
    console.log('\n📋 Listing all patients...');
    const patients = await prisma.patient.findMany({
      where: { tenantId: tenant.id },
      take: 5,
    });
    
    console.log(`✅ Found ${patients.length} patients:`);
    console.table(patients.map(p => ({
      id: p.id,
      name: `${p.firstName} ${p.lastName}`,
      email: p.email,
      phone: p.phone,
      mrn: p.medicalRecordNumber,
    })));
    
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
