"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const patients_service_1 = require("../patients/patients.service");
async function testPatientService() {
    console.log('🚀 Testing Patient Service\n');
    const prisma = new client_1.PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
    });
    const patientsService = new patients_service_1.PatientsService(prisma);
    try {
        await prisma.$connect();
        console.log('✅ Connected to database\n');
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
        }
        else {
            console.log(`ℹ️ Using existing tenant: ${tenant.name} (${tenant.id})\n`);
        }
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
        console.log('\n🔍 Retrieving the created patient...');
        const foundPatient = await patientsService.findOne(tenant.id, createdPatient.id);
        console.log('✅ Retrieved patient:');
        console.log(foundPatient);
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
    }
    catch (error) {
        console.error('❌ Error:', error);
    }
    finally {
        await prisma.$disconnect();
        console.log('\nDisconnected from database');
    }
}
testPatientService()
    .catch(console.error)
    .finally(() => process.exit(0));
//# sourceMappingURL=test-service.js.map