const { Pool } = require('pg');
require('dotenv').config();

async function createTestPatient() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const client = await pool.connect();
  
  try {
    console.log('🔍 Connecting to database...');
    
    // Get or create a test tenant
    const tenantRes = await client.query(
      'SELECT id FROM tenants LIMIT 1'
    );
    
    let tenantId;
    if (tenantRes.rows.length === 0) {
      console.log('ℹ️ Creating test tenant...');
      const newTenant = await client.query(
        'INSERT INTO tenants (name, slug) VALUES ($1, $2) RETURNING id',
        ['Test Hospital', 'test-hospital']
      );
      tenantId = newTenant.rows[0].id;
      console.log(`✅ Created tenant with ID: ${tenantId}`);
    } else {
      tenantId = tenantRes.rows[0].id;
      console.log(`ℹ️ Using existing tenant ID: ${tenantId}`);
    }

    // Create a test patient
    const patientData = {
      firstName: 'Test',
      lastName: 'Patient',
      email: `test.patient.${Date.now()}@example.com`,
      phone: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      gender: 'MALE',
      dob: new Date('1990-01-01'),
      address: '123 Test St, Test City',
      medicalRecordNumber: `MRN-${Date.now()}`,
      tenantId,
    };

    console.log('\n🔄 Creating test patient...');
    const result = await client.query(
      `INSERT INTO patients (
        "firstName", "lastName", email, phone, gender, 
        dob, address, "medicalRecordNumber", "tenantId"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        patientData.firstName,
        patientData.lastName,
        patientData.email,
        patientData.phone,
        patientData.gender,
        patientData.dob,
        patientData.address,
        patientData.medicalRecordNumber,
        patientData.tenantId
      ]
    );

    const createdPatient = result.rows[0];
    console.log('✅ Patient created successfully:');
    console.log({
      id: createdPatient.id,
      name: `${createdPatient.firstName} ${createdPatient.lastName}`,
      email: createdPatient.email,
      mrn: createdPatient.medicalRecordNumber,
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
    console.log('\nDisconnected from database');
  }
}

createTestPatient().catch(console.error);
