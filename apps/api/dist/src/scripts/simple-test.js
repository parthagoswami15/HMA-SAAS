"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});
async function main() {
    try {
        console.log('🔍 Testing database connection...');
        await prisma.$connect();
        console.log('✅ Successfully connected to the database');
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
        const patients = await prisma.patient.findMany({
            where: { tenantId: tenant.id },
            take: 5,
        });
        console.log('\n📋 Patients in the database:');
        console.table(patients);
    }
    catch (error) {
        console.error('❌ Error:', error);
    }
    finally {
        await prisma.$disconnect();
        console.log('\nDisconnected from database');
    }
}
main()
    .catch(console.error)
    .finally(() => process.exit(0));
//# sourceMappingURL=simple-test.js.map