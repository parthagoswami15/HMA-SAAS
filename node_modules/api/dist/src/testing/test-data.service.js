"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TestDataService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestDataService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const patients_service_1 = require("../patients/patients.service");
let TestDataService = TestDataService_1 = class TestDataService {
    prisma;
    patientsService;
    constructor(prisma, patientsService) {
        this.prisma = prisma;
        this.patientsService = patientsService;
    }
    logger = new common_1.Logger(TestDataService_1.name);
    async createTestData(tenantId) {
        try {
            const testPatients = [
                {
                    firstName: 'John',
                    lastName: 'Doe',
                    dob: '1985-05-15',
                    gender: client_1.Gender.MALE,
                    phone: '+1234567890',
                    email: `john.doe.${Date.now()}@example.com`,
                    address: '123 Main St',
                    city: 'New York',
                    state: 'NY',
                    postalCode: '10001',
                    country: 'USA',
                    bloodType: client_1.BloodType.A_POSITIVE,
                    allergies: 'Penicillin',
                    notes: 'Patient with hypertension',
                    insuranceProvider: 'Blue Cross',
                    insurancePolicyNumber: 'BCBS' + Math.floor(1000000000 + Math.random() * 9000000000).toString(),
                    emergencyContactName: 'Jane Doe',
                    emergencyContactPhone: '+1987654321'
                },
                {
                    firstName: 'Jane',
                    lastName: 'Smith',
                    dob: '1990-10-20',
                    gender: client_1.Gender.FEMALE,
                    phone: `+1${9876543210 + Math.floor(Math.random() * 1000)}`,
                    email: `jane.smith.${Date.now()}@example.com`,
                    address: '456 Oak Ave',
                    city: 'Los Angeles',
                    state: 'CA',
                    postalCode: '90001',
                    country: 'USA',
                    bloodType: client_1.BloodType.O_NEGATIVE,
                    allergies: 'Dust, Pollen',
                    notes: 'Patient with asthma',
                    insuranceProvider: 'Aetna',
                    insurancePolicyNumber: 'AETNA' + Math.floor(1000000000 + Math.random() * 9000000000).toString(),
                    emergencyContactName: 'John Smith',
                    emergencyContactPhone: `+1${1234567890 + Math.floor(Math.random() * 1000)}`
                },
                {
                    firstName: 'Robert',
                    lastName: 'Johnson',
                    dob: '1975-03-08',
                    gender: client_1.Gender.MALE,
                    phone: `+1${1122334455 + Math.floor(Math.random() * 1000)}`,
                    email: `robert.j.${Date.now()}@example.com`,
                    address: '789 Pine St',
                    city: 'Chicago',
                    state: 'IL',
                    postalCode: '60601',
                    country: 'USA',
                    bloodType: client_1.BloodType.B_POSITIVE,
                    allergies: 'Sulfa drugs',
                    notes: 'Patient with type 2 diabetes',
                    insuranceProvider: 'United Healthcare',
                    insurancePolicyNumber: 'UHC' + Math.floor(1000000000 + Math.random() * 9000000000).toString(),
                    emergencyContactName: 'Alice Johnson',
                    emergencyContactPhone: `+1${1234567893 + Math.floor(Math.random() * 1000)}`
                },
            ];
            const createdPatients = [];
            for (const patientData of testPatients) {
                try {
                    const patient = await this.patientsService.create(tenantId, patientData);
                    createdPatients.push(patient);
                }
                catch (error) {
                    this.logger.error(`Failed to create patient ${patientData.email}: ${error.message}`);
                    throw error;
                }
            }
            return {
                message: 'Test data created successfully',
                patients: createdPatients.length,
            };
        }
        catch (error) {
            this.logger.error('Failed to create test data', error);
            throw new Error(`Failed to create test data: ${error.message}`);
        }
    }
    async clearTestData(tenantId) {
        try {
            await this.prisma.oPDPrescription.deleteMany({ where: { tenantId } });
            await this.prisma.appointment.deleteMany({ where: { tenantId } });
            await this.prisma.patient.deleteMany({ where: { tenantId } });
            return { message: 'Test data cleared successfully' };
        }
        catch (error) {
            this.logger.error('Failed to clear test data', error);
            throw new Error(`Failed to clear test data: ${error.message}`);
        }
    }
};
exports.TestDataService = TestDataService;
exports.TestDataService = TestDataService = TestDataService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        patients_service_1.PatientsService])
], TestDataService);
//# sourceMappingURL=test-data.service.js.map