"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const API_BASE_URL = 'http://localhost:3000/api/v1';
async function testPatientApi() {
    console.log('🚀 Testing Patient API Endpoints\n');
    try {
        console.log('🔑 Getting access token...');
        const authResponse = await axios_1.default.post(`${API_BASE_URL}/auth/login`, {
            email: 'admin@example.com',
            password: 'password123',
        });
        const { accessToken } = authResponse.data;
        console.log('✅ Successfully authenticated\n');
        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'x-tenant-id': 'test-tenant-1',
        };
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
        const createResponse = await axios_1.default.post(`${API_BASE_URL}/patients`, testPatient, { headers });
        const createdPatient = createResponse.data;
        console.log('✅ Patient created successfully:');
        console.log(createdPatient);
        console.log('\n🔍 Retrieving the created patient...');
        const getResponse = await axios_1.default.get(`${API_BASE_URL}/patients/${createdPatient.id}`, { headers });
        console.log('✅ Retrieved patient:');
        console.log(getResponse.data);
        console.log('\n📋 Listing all patients...');
        const listResponse = await axios_1.default.get(`${API_BASE_URL}/patients`, { headers });
        console.log(`✅ Found ${listResponse.data.length} patients`);
        console.table(listResponse.data.map((p) => ({
            id: p.id,
            name: `${p.firstName} ${p.lastName}`,
            email: p.email,
            phone: p.phone,
            mrn: p.medicalRecordNumber,
        })));
    }
    catch (error) {
        if (error.response) {
            console.error('❌ API Error:', {
                status: error.response.status,
                data: error.response.data,
            });
        }
        else {
            console.error('❌ Error:', error.message);
        }
    }
}
testPatientApi()
    .catch(console.error)
    .finally(() => process.exit(0));
//# sourceMappingURL=test-api.js.map