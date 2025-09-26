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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const common_1 = require("@nestjs/common");
const prisma = new client_1.PrismaClient();
const logger = new common_1.Logger('SeedScript');
async function main() {
    logger.log('Starting database seeding...');
    try {
        const tenant = await prisma.tenant.upsert({
            where: { slug: 'demo-hospital' },
            update: {},
            create: {
                name: 'Demo Hospital',
                slug: 'demo-hospital',
                type: 'HOSPITAL',
                isActive: true
            },
        });
        logger.log(`Tenant created/updated: ${tenant.name} (${tenant.slug})`);
        const passwordHash = await bcrypt.hash('password123', 10);
        const adminUser = await prisma.user.upsert({
            where: { email: 'admin@demo.com' },
            update: {},
            create: {
                email: 'admin@demo.com',
                passwordHash,
                role: client_1.Role.HOSPITAL_ADMIN,
                tenantId: tenant.id,
                firstName: 'Demo',
                lastName: 'Admin',
                isActive: true,
                emailVerified: true
            },
        });
        logger.log(`Admin user created: ${adminUser.email}`);
        const patients = [
            {
                tenantId: tenant.id,
                firstName: 'John',
                lastName: 'Doe',
                dateOfBirth: new Date('1990-01-15'),
                gender: client_1.Gender.MALE,
                phone: '+1234567890',
                email: 'john@example.com',
                address: '123 Main St, City, State 12345',
                bloodGroup: 'A_POSITIVE',
                emergencyContactName: 'Jane Doe',
                emergencyContactPhone: '+1234567891',
                medicalHistory: 'No significant medical history',
                allergies: 'None',
                isActive: true
            },
            {
                tenantId: tenant.id,
                firstName: 'Jane',
                lastName: 'Smith',
                dateOfBirth: new Date('1985-05-20'),
                gender: client_1.Gender.FEMALE,
                phone: '+1234567891',
                email: 'jane@example.com',
                address: '456 Oak Ave, City, State 12345',
                bloodGroup: 'O_POSITIVE',
                emergencyContactName: 'John Smith',
                emergencyContactPhone: '+1234567890',
                medicalHistory: 'Hypertension',
                allergies: 'Penicillin',
                isActive: true
            },
        ];
        await prisma.$transaction(patients.map(patient => prisma.patient.upsert({
            where: { email: patient.email },
            update: {},
            create: patient,
        })));
        logger.log(`Created ${patients.length} sample patients`);
        logger.log('Database seeding completed successfully');
        console.log('\n=== Seeding Complete ===');
        console.log('Tenant Slug: demo-hospital');
        console.log('Admin Login: admin@demo.com / password123');
        console.log('=========================');
    }
    catch (error) {
        logger.error('Error during database seeding', error);
        throw error;
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map