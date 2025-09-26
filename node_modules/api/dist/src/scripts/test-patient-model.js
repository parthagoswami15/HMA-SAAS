"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
async function testPatientModel() {
    const prisma = new client_1.PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
    });
    try {
        console.log('Connecting to database...');
        await prisma.$connect();
        console.log('✅ Successfully connected to the database');
        const tableExists = await prisma.$queryRaw `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'patients'
      );
    `;
        console.log('\n🔍 Patients table exists:', tableExists);
        if (tableExists && tableExists[0]?.exists) {
            console.log('\n🔍 Checking patients table structure...');
            const columns = await prisma.$queryRaw `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'patients'
      `;
            console.table(columns);
            try {
                console.log('\nCreating a test patient...');
                const testPatient = await prisma.patient.create({
                    data: {
                        firstName: 'Test',
                        lastName: 'Patient',
                        medicalRecordNumber: `MRN-${Date.now()}`,
                        tenant: {
                            connect: {
                                id: (await prisma.tenant.findFirst()).id
                            }
                        }
                    }
                });
                console.log('✅ Test patient created:', testPatient);
                const patients = await prisma.patient.findMany({
                    include: { tenant: { select: { id: true, name: true } } },
                    take: 5
                });
                console.log('\n📋 Patients in the database:');
                console.table(patients);
            }
            catch (error) {
                console.error('❌ Error creating test patient:', error);
            }
        }
    }
    catch (error) {
        console.error('❌ Error:', error);
    }
    finally {
        await prisma.$disconnect();
        console.log('\nDisconnected from database');
    }
}
testPatientModel()
    .catch(console.error)
    .finally(() => process.exit(0));
//# sourceMappingURL=test-patient-model.js.map