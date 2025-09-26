"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});
async function testPatientCrud() {
    try {
        console.log('🔍 Testing Patient CRUD operations...');
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
        }
        else {
            console.log(`ℹ️ Using existing tenant: ${tenant.name} (${tenant.id})`);
        }
        const testPatient = {
            firstName: 'John',
            lastName: 'Doe',
            email: `john.doe.${Date.now()}@example.com`,
            phone: '+1234567890',
            gender: 'MALE',
            dob: new Date('1990-01-01'),
            address: '123 Test St, Test City',
            bloodType: 'O_POSITIVE',
            allergies: 'Peanuts',
            notes: 'Test patient',
        };
        console.log('\n🔄 Creating test patient...');
        const createdPatient = await prisma.patient.create({
            data: {
                ...testPatient,
                tenantId: tenant.id,
            },
        });
        console.log('✅ Created patient:', createdPatient);
        console.log('\n🔍 Retrieving patient by ID...');
        const foundPatient = await prisma.patient.findUnique({
            where: { id: createdPatient.id },
            include: { tenant: { select: { id: true, name: true } } },
        });
        console.log('✅ Found patient:', foundPatient);
        console.log('\n🔄 Updating patient...');
        const updatedPatient = await prisma.patient.update({
            where: { id: createdPatient.id },
            data: { phone: '+1987654321' },
        });
        console.log('✅ Updated patient phone number:', updatedPatient.phone);
        console.log('\n📋 Listing patients...');
        const patients = await prisma.patient.findMany({
            where: { tenantId: tenant.id },
            take: 5,
            orderBy: { lastName: 'asc' },
        });
        console.log(`✅ Found ${patients.length} patients:`);
        console.table(patients.map(p => ({
            id: p.id,
            name: `${p.firstName} ${p.lastName}`,
            email: p.email,
            phone: p.phone,
            mrn: p.medicalRecordNumber,
        })));
        console.log('\n🗑️  Soft deleting patient...');
        const deletedPatient = await prisma.patient.update({
            where: { id: createdPatient.id },
            data: { deletedAt: new Date() },
        });
        console.log('✅ Soft deleted patient. Deleted at:', deletedPatient.deletedAt);
        const shouldBeNull = await prisma.patient.findUnique({
            where: { id: createdPatient.id },
        });
        console.log('🔍 Verifying soft delete - should be null:', shouldBeNull === null);
        const withDeleted = await prisma.$queryRaw `
      SELECT * FROM "patients" 
      WHERE id = ${createdPatient.id}
    `;
        console.log('🔍 With deleted (raw query):', withDeleted);
    }
    catch (error) {
        console.error('❌ Error:', error);
    }
    finally {
        await prisma.$disconnect();
        console.log('\nDisconnected from database');
    }
}
testPatientCrud()
    .catch(console.error)
    .finally(() => process.exit(0));
//# sourceMappingURL=test-patient-crud.js.map