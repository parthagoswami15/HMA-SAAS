const { Pool } = require('pg');
require('dotenv').config();

async function testPatientCrud() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const client = await pool.connect();
  
  try {
    console.log('🚀 Testing Patient CRUD operations\n');
    
    // 1. Get or create a test tenant
    let tenant = await client.query('SELECT id FROM tenants LIMIT 1');
    
    if (tenant.rows.length === 0) {
      console.log('ℹ️ Creating test tenant...');
      const newTenant = await client.query(
        'INSERT INTO tenants (name, slug) VALUES ($1, $2) RETURNING *',
        ['Test Hospital', 'test-hospital']
      );
      tenant = newTenant.rows[0];
      console.log(`✅ Created tenant: ${tenant.name} (${tenant.id})\n`);
    } else {
      tenant = tenant.rows[0];
      console.log(`ℹ️ Using existing tenant: ${tenant.name} (${tenant.id})\n`);
    }

    // 2. Test Create
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

    console.log('🔄 Creating test patient...');
    const createRes = await client.query(
      `INSERT INTO patients (
        "id", "firstName", "lastName", "email", "phone", 
        "gender", "dob", "address", "medicalRecordNumber", "tenantId",
        "updatedAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
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
    });

    // 3. Test Read
    console.log('\n🔍 Retrieving the created patient...');
    const getRes = await client.query(
      'SELECT * FROM patients WHERE id = $1',
      [createdPatient.id]
    );
    
    if (getRes.rows.length > 0) {
      console.log('✅ Retrieved patient:');
      const patient = getRes.rows[0];
      console.log({
        id: patient.id,
        name: `${patient.firstName} ${patient.lastName}`,
        email: patient.email,
        mrn: patient.medicalRecordNumber,
        tenantId: patient.tenantId,
      });
    } else {
      console.log('❌ Patient not found');
    }

    // 4. Test Update
    console.log('\n🔄 Updating patient phone number...');
    const newPhone = `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const updateRes = await client.query(
      'UPDATE patients SET phone = $1 WHERE id = $2 RETURNING *',
      [newPhone, createdPatient.id]
    );
    
    if (updateRes.rows.length > 0) {
      console.log('✅ Patient updated successfully');
      console.log(`New phone number: ${updateRes.rows[0].phone}`);
    } else {
      console.log('❌ Failed to update patient');
    }

    // 5. Test List
    console.log('\n📋 Listing all patients...');
    const listRes = await client.query(
      'SELECT id, "firstName", "lastName", email, phone, "medicalRecordNumber" FROM patients WHERE "tenantId" = $1 LIMIT 5',
      [tenant.id]
    );
    
    console.log(`✅ Found ${listRes.rows.length} patients:`);
    console.table(listRes.rows);

    // 6. Test Soft Delete
    console.log('\n🗑️  Soft deleting the test patient...');
    await client.query(
      'UPDATE patients SET "deletedAt" = NOW() WHERE id = $1',
      [createdPatient.id]
    );
    
    // Verify soft delete
    const deletedRes = await client.query(
      'SELECT * FROM patients WHERE id = $1',
      [createdPatient.id]
    );
    
    if (deletedRes.rows[0]?.deletedAt) {
      console.log('✅ Patient soft deleted successfully');
    } else {
      console.log('❌ Failed to soft delete patient');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
    console.log('\nDisconnected from database');
  }
}

testPatientCrud().catch(console.error);
