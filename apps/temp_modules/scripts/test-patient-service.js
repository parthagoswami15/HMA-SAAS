const { Pool } = require('pg');
require('dotenv').config();

async function testPatientService() {
  const pool = new Pool({
    connectionString: 'postgresql://postgres:Partha%40123@localhost:5432/hms_saas',
  });

  const client = await pool.connect();
  
  try {
    console.log('🚀 Testing Patient Service\n');
    
    // 1. Get or create a test tenant
    let tenant = await client.query('SELECT id, name FROM tenants LIMIT 1');
    
    if (tenant.rows.length === 0) {
      console.log('ℹ️ Creating test tenant...');
      const newTenant = await client.query(
        'INSERT INTO tenants (name, slug, "isActive") VALUES ($1, $2, $3) RETURNING *',
        ['Test Hospital', 'test-hospital', true]
      );
      tenant = newTenant.rows[0];
      console.log(`✅ Created tenant: ${tenant.name} (${tenant.id})`);
    } else {
      tenant = tenant.rows[0];
      console.log(`ℹ️ Using existing tenant: ${tenant.name} (${tenant.id})`);
    }

    // 2. Test creating a patient
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

    console.log('\n🔄 Creating test patient...');
    const createRes = await client.query(
      `INSERT INTO patients (
        "id", "firstName", "lastName", "email", "phone", 
        "gender", "dob", "address", "medicalRecordNumber", "tenantId",
        "createdAt", "updatedAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
      RETURNING *`,
      [
        testPatient.id,
        testPatient.firstName,
        testPatient.lastName,
        testPatient.email,
        testPatient.phone,
        testPatient.gender,
        testPatient.dob,
        testPatient.address,
        testPatient.medicalRecordNumber,
        testPatient.tenantId
      ]
    );

    const createdPatient = createRes.rows[0];
    console.log('✅ Patient created successfully:');
    console.log({
      id: createdPatient.id,
      name: `${createdPatient.firstName} ${createdPatient.lastName}`,
      email: createdPatient.email,
      mrn: createdPatient.medicalRecordNumber,
      tenantId: createdPatient.tenantId,
    });

    // 3. List all patients
    console.log('\n📋 Listing all patients...');
    const listRes = await client.query(
      'SELECT id, "firstName", "lastName", email, "medicalRecordNumber" FROM patients WHERE "tenantId" = $1 ORDER BY "createdAt" DESC LIMIT 5',
      [tenant.id]
    );
    
    console.log(`✅ Found ${listRes.rows.length} patients:`);
    console.table(listRes.rows);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
    console.log('\nDisconnected from database');
  }
}

testPatientService().catch(console.error);
