import { PrismaClient, Role, Gender } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { Logger } from '@nestjs/common';

const prisma = new PrismaClient();
const logger = new Logger('SeedScript');

async function main() {
  logger.log('Starting database seeding...');
  
  try {
    // Create or update tenant
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

    // Create admin user
    const passwordHash = await bcrypt.hash('password123', 10);
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@demo.com' },
      update: {},
      create: { 
        email: 'admin@demo.com', 
        passwordHash, 
        role: Role.HOSPITAL_ADMIN, 
        tenantId: tenant.id, 
        firstName: 'Demo', 
        lastName: 'Admin',
        isActive: true,
        emailVerified: true
      },
    });

    logger.log(`Admin user created: ${adminUser.email}`);

    // Create sample patients with all required fields
    const patients = [
      {
        tenantId: tenant.id,
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-15'),
        gender: Gender.MALE,
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
        gender: Gender.FEMALE,
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

    // Create patients in a transaction
    await prisma.$transaction(
      patients.map(patient => 
        prisma.patient.upsert({
          where: { email: patient.email },
          update: {},
          create: patient,
        })
      )
    );

    logger.log(`Created ${patients.length} sample patients`);
    
    logger.log('Database seeding completed successfully');
    console.log('\n=== Seeding Complete ===');
    console.log('Tenant Slug: demo-hospital');
    console.log('Admin Login: admin@demo.com / password123');
    console.log('=========================');
  } catch (error) {
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


