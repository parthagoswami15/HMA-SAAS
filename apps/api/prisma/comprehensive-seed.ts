import { PrismaClient, Role, Gender, MaritalStatus, BloodType } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seeding...');

  // Create a default tenant
  const tenant = await prisma.tenant.upsert({
    where: { id: 'default-tenant' },
    update: {},
    create: {
      id: 'default-tenant',
      name: 'Default Hospital',
      slug: 'default-hospital',
      isActive: true,
    },
  });

  // Create departments
  const departments = await Promise.all([
    prisma.department.upsert({
      where: { id: 'dept-1' },
      update: {},
      create: {
        id: 'dept-1',
        name: 'General Medicine',
        description: 'General medical consultations and treatments',
        isActive: true,
        tenantId: tenant.id,
      },
    }),
    prisma.department.upsert({
      where: { id: 'dept-2' },
      update: {},
      create: {
        id: 'dept-2',
        name: 'Cardiology',
        description: 'Heart and cardiovascular care',
        isActive: true,
        tenantId: tenant.id,
      },
    }),
    prisma.department.upsert({
      where: { id: 'dept-3' },
      update: {},
      create: {
        id: 'dept-3',
        name: 'Emergency',
        description: 'Emergency and critical care',
        isActive: true,
        tenantId: tenant.id,
      },
    }),
  ]);

  // Create admin user
  const hashedPassword = await hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hospital.com' },
    update: {},
    create: {
      email: 'admin@hospital.com',
      passwordHash: hashedPassword,
      firstName: 'Hospital',
      lastName: 'Admin',
      role: Role.ADMIN,
      isActive: true,
      tenantId: tenant.id,
    },
  });

  // Create doctors
  const doctorPassword = await hash('doctor123', 12);
  const doctors = await Promise.all([
    prisma.user.create({
      data: {
        email: 'dr.smith@hospital.com',
        passwordHash: doctorPassword,
        firstName: 'John',
        lastName: 'Smith',
        role: Role.DOCTOR,
        isActive: true,
        tenantId: tenant.id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'dr.johnson@hospital.com',
        passwordHash: doctorPassword,
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: Role.DOCTOR,
        isActive: true,
        tenantId: tenant.id,
      },
    }),
  ]);

  // Create sample patients
  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        medicalRecordNumber: 'MR001',
        firstName: 'Alice',
        lastName: 'Brown',
        dateOfBirth: new Date('1985-03-15'),
        gender: Gender.FEMALE,
        phone: '+1234567890',
        email: 'alice.brown@email.com',
        address: '123 Main St, City, State',
        bloodType: BloodType.O_POSITIVE,
        tenantId: tenant.id,
        createdBy: admin.id,
        isActive: true,
      },
    }),
    prisma.patient.create({
      data: {
        medicalRecordNumber: 'MR002',
        firstName: 'Bob',
        lastName: 'Wilson',
        dateOfBirth: new Date('1978-11-22'),
        gender: Gender.MALE,
        phone: '+1987654321',
        email: 'bob.wilson@email.com',
        address: '456 Oak Ave, City, State',
        bloodType: BloodType.A_POSITIVE,
        tenantId: tenant.id,
        createdBy: admin.id,
        isActive: true,
      },
    }),
  ]);

  // Create some medications
  const medications = await Promise.all([
    prisma.medication.create({
      data: {
        name: 'Paracetamol',
        genericName: 'Acetaminophen',
        description: 'Pain relief and fever reducer',
        strength: '500mg',
        unit: 'tablet',
        dosageForm: 'Tablet',
        isActive: true,
        tenantId: tenant.id,
      },
    }),
    prisma.medication.create({
      data: {
        name: 'Amoxicillin',
        genericName: 'Amoxicillin',
        description: 'Antibiotic medication',
        strength: '250mg',
        unit: 'capsule',
        dosageForm: 'Capsule',
        isActive: true,
        tenantId: tenant.id,
      },
    }),
  ]);

  console.log('✅ Comprehensive database seeded successfully!');
  console.log('👤 Admin:', admin.email, '(password: admin123)');
  console.log('👨‍⚕️ Doctors:', doctors.map(d => d.email).join(', '), '(password: doctor123)');
  console.log('🏥 Departments:', departments.length, 'created');
  console.log('👥 Patients:', patients.length, 'created');
  console.log('💊 Medications:', medications.length, 'created');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
