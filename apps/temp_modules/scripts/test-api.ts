import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const API_BASE_URL = 'http://localhost:3000/api/v1';

async function testPatientApi() {
  console.log('🚀 Testing Patient API Endpoints\n');

  try {
    // 1. First, let's get an access token
    console.log('🔑 Getting access token...');
    const authResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@example.com',
      password: 'password123',
    });

    const { accessToken } = authResponse.data;
    console.log('✅ Successfully authenticated\n');

    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'x-tenant-id': 'test-tenant-1', // Replace with actual tenant ID if needed
    };

    // 2. Create a test patient
    console.log('🔄 Creating a test patient...');
    const testPatient = {
      firstName: 'John',
      lastName: 'Doe',
      email: `john.doe.${Date.now()}@example.com`,
      phone: '+1234567890',
      gender: 'MALE',
      dob: '1990-01-01',
      address: '123 Test St, Test City',
    };

    const createResponse = await axios.post(
      `${API_BASE_URL}/patients`,
      testPatient,
      { headers }
    );

    const createdPatient = createResponse.data;
    console.log('✅ Patient created successfully:');
    console.log(createdPatient);

    // 3. Get the created patient
    console.log('\n🔍 Retrieving the created patient...');
    const getResponse = await axios.get(
      `${API_BASE_URL}/patients/${createdPatient.id}`,
      { headers }
    );
    console.log('✅ Retrieved patient:');
    console.log(getResponse.data);

    // 4. List all patients
    console.log('\n📋 Listing all patients...');
    const listResponse = await axios.get(
      `${API_BASE_URL}/patients`,
      { headers }
    );
    console.log(`✅ Found ${listResponse.data.length} patients`);
    console.table(listResponse.data.map((p: any) => ({
      id: p.id,
      name: `${p.firstName} ${p.lastName}`,
      email: p.email,
      phone: p.phone,
      mrn: p.medicalRecordNumber,
    })));

  } catch (error: any) {
    if (error.response) {
      console.error('❌ API Error:', {
        status: error.response.status,
        data: error.response.data,
      });
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

testPatientApi()
  .catch(console.error)
  .finally(() => process.exit(0));
