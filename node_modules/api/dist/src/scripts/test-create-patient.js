"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
async function testCreatePatient() {
    const prisma = new client_1.PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
    });
    try {
        console.log('🔍 Connecting to database...');
        await prisma.$connect();
        console.log('✅ Successfully connected to the database\n');
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
        }
        else {
            console.log(`ℹ️ Using existing tenant: ${tenant.name} (${tenant.id})\n`);
        }
        console.log('🔄 Creating test patient...');
        const timestamp = Date.now();
        const patient = await prisma.patient.create({
            data: {
                firstName: 'John',
                lastName: 'Doe',
                email: `john.doe.${timestamp}@example.com`,
                medicalRecordNumber: `MRN-${timestamp}`,
                tenant: {
                    connect: { id: tenant.id }
                }
            },
        });
        console.log('✅ Successfully created patient:');
        console.log(patient);
        console.log('\n📋 All patients in the database:');
        const patients = await prisma.patient.findMany({
            include: { tenant: { select: { id: true, name: true } } },
        });
        console.table(patients.map(p => ({
            id: p.id,
            name: `${p.firstName} ${p.lastName}`,
            email: p.email,
            mrn: p.medicalRecordNumber,
            tenant: p.tenant.name,
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
testCreatePatient()
    .catch(console.error)
    .finally(() => process.exit(0));
//# sourceMappingURL=test-create-patient.js.map