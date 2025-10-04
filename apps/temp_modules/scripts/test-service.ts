import { PrismaClient } from '@prisma/client';
import { PatientsService } from '../patients/patients.service';

async function testPatientService() {
  console.log('🚀 Testing Patient Service\n');
  
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  
  const patientsService = new PatientsService(prisma as any);
  
  try {
    await prisma.$connect();
    console.log('✅ Connected to database\n');
    
    // 1. Create a test tenant if it doesn't exist
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
    
    // 2. Test creating a patient
    console.log('🔄 Creating test patient...');
    const testPatient = {
      firstName: 'John',
      lastName: 'Doe',
      email: `john.doe.${Date.now()}@example.com`,
      phone: '+1234567890',
      gender: 'MALE',
      dob: new Date('1990-01-01'),
      address: '123 Test St, Test City',
    };
    
    const createdPatient = await patientsService.create(tenant.id, testPatient);
    console.log('✅ Patient created successfully:');
    console.log(createdPatient);
    
    // 3. Get the created patient
    console.log('\n🔍 Retrieving the created patient...');
    const foundPatient = await patientsService.findOne(tenant.id, createdPatient.id);
    console.log('✅ Retrieved patient:');
    console.log(foundPatient);
    
    // 4. List all patients
    console.log('\n📋 Listing all patients...');
    const patients = await patientsService.findAll(tenant.id);
    console.log(`✅ Found ${patients.length} patients`);
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
