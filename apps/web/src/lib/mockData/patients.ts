import { Patient, PatientVisit, PatientAppointment, MedicalHistory, PatientDocument, PatientStats } from '../../types/patient';
import { Gender, BloodGroup, MaritalStatus, Status } from '../../types/common';
import { generateId } from '../utils';

// Generate mock patients
export const mockPatients: Patient[] = [
  {
    id: generateId(),
    patientId: 'P001001',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    dateOfBirth: new Date('1985-03-15'),
    age: 39,
    gender: Gender.MALE,
    bloodGroup: BloodGroup.B_POSITIVE,
    maritalStatus: MaritalStatus.MARRIED,
    contactInfo: {
      phone: '+91 98765 43210',
      email: 'rajesh.kumar@email.com',
      alternatePhone: '+91 98765 43211',
      emergencyContact: {
        name: 'Priya Kumar',
        phone: '+91 98765 43212',
        relationship: 'Spouse'
      }
    },
    address: {
      street: '123, MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      postalCode: '560001',
      landmark: 'Near City Center Mall'
    },
    aadhaarNumber: '1234 5678 9012',
    allergies: ['Penicillin', 'Nuts'],
    chronicDiseases: ['Type 2 Diabetes'],
    currentMedications: ['Metformin 500mg'],
    insuranceInfo: {
      insuranceType: 'government',
      insuranceProvider: 'CGHS',
      policyNumber: 'CGHS001234',
      policyHolderName: 'Rajesh Kumar',
      relationshipToPatient: 'Self',
      validFrom: new Date('2024-01-01'),
      validTo: new Date('2024-12-31'),
      coverageAmount: 500000,
      isActive: true
    },
    status: Status.ACTIVE,
    registrationDate: new Date('2023-01-15'),
    lastVisitDate: new Date('2024-12-01'),
    totalVisits: 12,
    occupation: 'Software Engineer',
    religion: 'Hindu',
    language: 'English, Hindi, Kannada',
    notes: 'Regular follow-up required for diabetes management',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-12-01'),
    createdBy: 'system',
    updatedBy: 'Dr. Smith'
  },
  {
    id: generateId(),
    patientId: 'P001002',
    firstName: 'Priya',
    lastName: 'Sharma',
    dateOfBirth: new Date('1990-07-22'),
    age: 34,
    gender: Gender.FEMALE,
    bloodGroup: BloodGroup.O_POSITIVE,
    maritalStatus: MaritalStatus.SINGLE,
    contactInfo: {
      phone: '+91 87654 32109',
      email: 'priya.sharma@email.com',
      emergencyContact: {
        name: 'Ramesh Sharma',
        phone: '+91 87654 32108',
        relationship: 'Father'
      }
    },
    address: {
      street: '456, Brigade Road',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      postalCode: '560025',
      landmark: 'Opposite Forum Mall'
    },
    allergies: ['Sulfa drugs'],
    chronicDiseases: [],
    currentMedications: [],
    insuranceInfo: {
      insuranceType: 'private',
      insuranceProvider: 'Star Health Insurance',
      policyNumber: 'SHI987654',
      policyHolderName: 'Priya Sharma',
      relationshipToPatient: 'Self',
      validFrom: new Date('2024-01-01'),
      validTo: new Date('2024-12-31'),
      coverageAmount: 300000,
      isActive: true
    },
    status: Status.ACTIVE,
    registrationDate: new Date('2023-03-10'),
    lastVisitDate: new Date('2024-11-28'),
    totalVisits: 8,
    occupation: 'Marketing Manager',
    religion: 'Hindu',
    language: 'English, Hindi',
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2024-11-28'),
    createdBy: 'reception',
    updatedBy: 'Dr. Johnson'
  },
  {
    id: generateId(),
    patientId: 'P001003',
    firstName: 'Mohammed',
    lastName: 'Ali',
    dateOfBirth: new Date('1975-12-08'),
    age: 48,
    gender: Gender.MALE,
    bloodGroup: BloodGroup.A_NEGATIVE,
    maritalStatus: MaritalStatus.MARRIED,
    contactInfo: {
      phone: '+91 76543 21098',
      email: 'mohammed.ali@email.com',
      alternatePhone: '+91 76543 21099',
      emergencyContact: {
        name: 'Fatima Ali',
        phone: '+91 76543 21097',
        relationship: 'Spouse'
      }
    },
    address: {
      street: '789, Commercial Street',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      postalCode: '560002',
      landmark: 'Near Bangalore Central'
    },
    otherIdNumber: 'ABCDE1234F',
    otherIdType: 'pan',
    allergies: [],
    chronicDiseases: ['Hypertension'],
    currentMedications: ['Amlodipine 5mg', 'Atenolol 25mg'],
    insuranceInfo: {
      insuranceType: 'corporate',
      insuranceProvider: 'United India Insurance',
      policyNumber: 'UII456789',
      policyHolderName: 'Mohammed Ali',
      relationshipToPatient: 'Self',
      validFrom: new Date('2024-01-01'),
      validTo: new Date('2024-12-31'),
      coverageAmount: 1000000,
      isActive: true
    },
    status: Status.ACTIVE,
    registrationDate: new Date('2022-08-20'),
    lastVisitDate: new Date('2024-11-30'),
    totalVisits: 18,
    occupation: 'Business Owner',
    religion: 'Islam',
    language: 'English, Hindi, Urdu',
    notes: 'Blood pressure monitoring required',
    createdAt: new Date('2022-08-20'),
    updatedAt: new Date('2024-11-30'),
    createdBy: 'reception',
    updatedBy: 'Dr. Patel'
  },
  {
    id: generateId(),
    patientId: 'P001004',
    firstName: 'Lakshmi',
    lastName: 'Nair',
    dateOfBirth: new Date('1995-05-30'),
    age: 29,
    gender: Gender.FEMALE,
    bloodGroup: BloodGroup.AB_POSITIVE,
    maritalStatus: MaritalStatus.MARRIED,
    contactInfo: {
      phone: '+91 65432 10987',
      email: 'lakshmi.nair@email.com',
      emergencyContact: {
        name: 'Suresh Nair',
        phone: '+91 65432 10986',
        relationship: 'Spouse'
      }
    },
    address: {
      street: '321, Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      postalCode: '560034',
      landmark: 'Near Sony World'
    },
    allergies: ['Latex'],
    chronicDiseases: [],
    currentMedications: ['Folic Acid', 'Iron tablets'],
    status: Status.ACTIVE,
    registrationDate: new Date('2024-01-05'),
    lastVisitDate: new Date('2024-12-02'),
    totalVisits: 4,
    occupation: 'Teacher',
    religion: 'Hindu',
    language: 'English, Malayalam, Tamil',
    notes: 'Pregnant - Due date: March 2025',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-12-02'),
    createdBy: 'Dr. Williams',
    updatedBy: 'Dr. Williams'
  },
  {
    id: generateId(),
    patientId: 'P001005',
    firstName: 'Arjun',
    lastName: 'Singh',
    dateOfBirth: new Date('2010-11-12'),
    age: 13,
    gender: Gender.MALE,
    bloodGroup: BloodGroup.O_NEGATIVE,
    maritalStatus: MaritalStatus.SINGLE,
    contactInfo: {
      phone: '+91 54321 09876',
      emergencyContact: {
        name: 'Vikram Singh',
        phone: '+91 54321 09875',
        relationship: 'Father'
      }
    },
    address: {
      street: '654, Whitefield',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      postalCode: '560066',
      landmark: 'Near Phoenix Marketcity'
    },
    allergies: ['Dust mites'],
    chronicDiseases: ['Asthma'],
    currentMedications: ['Salbutamol inhaler'],
    status: Status.ACTIVE,
    registrationDate: new Date('2023-06-15'),
    lastVisitDate: new Date('2024-11-25'),
    totalVisits: 6,
    religion: 'Sikh',
    language: 'English, Hindi, Punjabi',
    notes: 'Pediatric patient - requires parental consent',
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2024-11-25'),
    createdBy: 'pediatric_nurse',
    updatedBy: 'Dr. Kumar'
  }
];

// Generate mock patient visits
export const mockPatientVisits: PatientVisit[] = [
  {
    id: generateId(),
    visitId: 'V001001',
    patientId: 'P001001',
    visitType: 'opd',
    visitDate: new Date('2024-12-01'),
    chiefComplaint: 'Routine diabetes check-up',
    status: 'completed',
    doctorId: 'D001',
    doctorName: 'Dr. Sarah Smith',
    departmentId: 'DEPT001',
    departmentName: 'Endocrinology',
    vitals: {
      temperature: 98.6,
      bloodPressureSystolic: 130,
      bloodPressureDiastolic: 80,
      heartRate: 72,
      respiratoryRate: 16,
      oxygenSaturation: 98,
      height: 175,
      weight: 78,
      bmi: 25.5,
      painScale: 0,
      recordedAt: new Date('2024-12-01T10:30:00'),
      recordedBy: 'Nurse Mary'
    },
    diagnosis: ['Type 2 Diabetes Mellitus - controlled'],
    treatmentPlan: 'Continue current medication, dietary counseling',
    prescriptions: [
      {
        medicationName: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '30 days',
        instructions: 'Take after meals',
        quantity: 60,
        isGeneric: true,
        isDispensed: true,
        dispensedDate: new Date('2024-12-01')
      }
    ],
    orders: [
      {
        orderType: 'lab',
        orderName: 'HbA1c',
        orderCode: 'LAB001',
        priority: 'routine',
        status: 'completed',
        orderedDate: new Date('2024-12-01'),
        completedDate: new Date('2024-12-02'),
        notes: 'Results: 6.8%'
      }
    ],
    followUpDate: new Date('2024-12-31'),
    followUpInstructions: 'Continue medication, check-up in 4 weeks',
    totalAmount: 1500,
    paidAmount: 1500,
    pendingAmount: 0,
    notes: 'Patient compliance good, diabetes well controlled',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
    createdBy: 'Dr. Smith',
    updatedBy: 'Dr. Smith'
  },
  {
    id: generateId(),
    visitId: 'V001002',
    patientId: 'P001002',
    visitType: 'opd',
    visitDate: new Date('2024-11-28'),
    chiefComplaint: 'Annual health check-up',
    status: 'completed',
    doctorId: 'D002',
    doctorName: 'Dr. Mike Johnson',
    departmentId: 'DEPT002',
    departmentName: 'General Medicine',
    vitals: {
      temperature: 98.4,
      bloodPressureSystolic: 118,
      bloodPressureDiastolic: 76,
      heartRate: 68,
      respiratoryRate: 14,
      oxygenSaturation: 99,
      height: 165,
      weight: 58,
      bmi: 21.3,
      painScale: 0,
      recordedAt: new Date('2024-11-28T11:00:00'),
      recordedBy: 'Nurse John'
    },
    diagnosis: ['Healthy adult'],
    treatmentPlan: 'Maintain healthy lifestyle',
    prescriptions: [],
    orders: [
      {
        orderType: 'lab',
        orderName: 'Complete Blood Count',
        orderCode: 'LAB002',
        priority: 'routine',
        status: 'completed',
        orderedDate: new Date('2024-11-28'),
        completedDate: new Date('2024-11-29'),
        notes: 'All parameters normal'
      }
    ],
    followUpDate: new Date('2025-11-28'),
    followUpInstructions: 'Next annual check-up',
    totalAmount: 2000,
    paidAmount: 2000,
    pendingAmount: 0,
    notes: 'Excellent health status',
    createdAt: new Date('2024-11-28'),
    updatedAt: new Date('2024-11-28'),
    createdBy: 'Dr. Johnson',
    updatedBy: 'Dr. Johnson'
  }
];

// Generate mock appointments
export const mockPatientAppointments: PatientAppointment[] = [
  {
    id: generateId(),
    appointmentId: 'A001001',
    patientId: 'P001001',
    doctorId: 'D001',
    departmentId: 'DEPT001',
    appointmentDate: new Date('2024-12-15'),
    appointmentTime: '10:00',
    duration: 30,
    appointmentType: 'follow_up',
    status: 'scheduled',
    chiefComplaint: 'Diabetes follow-up',
    notes: 'Regular check-up for diabetes management',
    reminderSent: true,
    reminderSentAt: new Date('2024-12-14'),
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
    createdBy: 'patient_portal',
    updatedBy: 'patient_portal'
  },
  {
    id: generateId(),
    appointmentId: 'A001002',
    patientId: 'P001004',
    doctorId: 'D003',
    departmentId: 'DEPT003',
    appointmentDate: new Date('2024-12-10'),
    appointmentTime: '14:30',
    duration: 45,
    appointmentType: 'consultation',
    status: 'confirmed',
    chiefComplaint: 'Prenatal check-up',
    notes: 'Regular prenatal examination',
    reminderSent: true,
    reminderSentAt: new Date('2024-12-09'),
    createdAt: new Date('2024-12-03'),
    updatedAt: new Date('2024-12-05'),
    createdBy: 'reception',
    updatedBy: 'patient'
  }
];

// Generate mock medical history
export const mockMedicalHistory: MedicalHistory[] = [
  {
    id: generateId(),
    patientId: 'P001001',
    historyType: 'medical',
    title: 'Type 2 Diabetes Mellitus',
    description: 'Diagnosed with diabetes in 2020, currently on medication',
    date: new Date('2020-05-15'),
    isActive: true,
    severity: 'moderate',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15'),
    createdBy: 'Dr. Smith'
  },
  {
    id: generateId(),
    patientId: 'P001003',
    historyType: 'family',
    title: 'Hypertension',
    description: 'Father had hypertension, diagnosed at age 45',
    isActive: true,
    severity: 'mild',
    createdAt: new Date('2022-08-20'),
    updatedAt: new Date('2022-08-20'),
    createdBy: 'Dr. Patel'
  },
  {
    id: generateId(),
    patientId: 'P001005',
    historyType: 'allergy',
    title: 'Dust Mite Allergy',
    description: 'Allergic reaction to dust mites causing asthma symptoms',
    date: new Date('2023-03-10'),
    isActive: true,
    severity: 'moderate',
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2023-06-15'),
    createdBy: 'Dr. Kumar'
  }
];

// Generate mock patient documents
export const mockPatientDocuments: PatientDocument[] = [
  {
    id: generateId(),
    patientId: 'P001001',
    documentType: 'id_proof',
    title: 'Aadhaar Card',
    description: 'Government issued identity card',
    fileName: 'aadhaar_p001001.pdf',
    filePath: '/documents/patients/p001001/aadhaar_p001001.pdf',
    fileSize: 245760,
    mimeType: 'application/pdf',
    uploadedBy: 'reception',
    uploadedAt: new Date('2023-01-15'),
    isActive: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: generateId(),
    patientId: 'P001001',
    documentType: 'lab_result',
    title: 'HbA1c Test Result',
    description: 'Latest diabetes monitoring test result',
    fileName: 'hba1c_result_20241201.pdf',
    filePath: '/documents/patients/p001001/hba1c_result_20241201.pdf',
    fileSize: 156432,
    mimeType: 'application/pdf',
    uploadedBy: 'Dr. Smith',
    uploadedAt: new Date('2024-12-02'),
    isActive: true,
    createdAt: new Date('2024-12-02'),
    updatedAt: new Date('2024-12-02')
  }
];

// Generate mock patient statistics
export const mockPatientStats: PatientStats = {
  totalPatients: 2847,
  newPatientsToday: 12,
  newPatientsThisMonth: 245,
  activePatients: 2634,
  averageAge: 42,
  genderDistribution: {
    male: 1423,
    female: 1401,
    other: 23
  },
  bloodGroupDistribution: {
    [BloodGroup.A_POSITIVE]: 645,
    [BloodGroup.A_NEGATIVE]: 89,
    [BloodGroup.B_POSITIVE]: 734,
    [BloodGroup.B_NEGATIVE]: 102,
    [BloodGroup.AB_POSITIVE]: 245,
    [BloodGroup.AB_NEGATIVE]: 34,
    [BloodGroup.O_POSITIVE]: 876,
    [BloodGroup.O_NEGATIVE]: 122
  },
  insuranceDistribution: {
    insured: 2134,
    uninsured: 713
  },
  visitTrends: [
    { date: '2024-11-25', count: 145 },
    { date: '2024-11-26', count: 167 },
    { date: '2024-11-27', count: 134 },
    { date: '2024-11-28', count: 189 },
    { date: '2024-11-29', count: 156 },
    { date: '2024-11-30', count: 178 },
    { date: '2024-12-01', count: 142 }
  ]
};