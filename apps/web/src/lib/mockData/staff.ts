import { 
  Staff, 
  StaffStats, 
  Department, 
  Specialization, 
  Shift, 
  LeaveRequest,
  Attendance,
  Training,
  StaffListItem
} from '../../types/staff';
import { Gender, Status, UserRole } from '../../types/common';
import { generateId } from '../utils';

// Departments
export const mockDepartments: Department[] = [
  {
    id: generateId(),
    name: 'Cardiology',
    code: 'CARD',
    description: 'Heart and cardiovascular system specialists',
    headOfDepartment: 'Dr. Sarah Johnson',
    location: 'Block A, 3rd Floor',
    isActive: true
  },
  {
    id: generateId(),
    name: 'Emergency Medicine',
    code: 'EM',
    description: '24/7 emergency medical services',
    headOfDepartment: 'Dr. Michael Brown',
    location: 'Block C, Ground Floor',
    isActive: true
  },
  {
    id: generateId(),
    name: 'General Surgery',
    code: 'GSURG',
    description: 'General surgical procedures',
    headOfDepartment: 'Dr. Priya Patel',
    location: 'Block B, 2nd Floor',
    isActive: true
  },
  {
    id: generateId(),
    name: 'Pediatrics',
    code: 'PEDS',
    description: 'Child healthcare specialists',
    headOfDepartment: 'Dr. James Wilson',
    location: 'Block D, 1st Floor',
    isActive: true
  },
  {
    id: generateId(),
    name: 'Radiology',
    code: 'RAD',
    description: 'Medical imaging and diagnostics',
    headOfDepartment: 'Dr. Lisa Chen',
    location: 'Block E, Basement',
    isActive: true
  }
];

// Specializations
export const mockSpecializations: Specialization[] = [
  {
    id: generateId(),
    name: 'Interventional Cardiology',
    code: 'INT-CARD',
    category: 'medical',
    description: 'Minimally invasive cardiac procedures'
  },
  {
    id: generateId(),
    name: 'Emergency Medicine',
    code: 'EM',
    category: 'medical',
    description: 'Critical care and emergency treatments'
  },
  {
    id: generateId(),
    name: 'Laparoscopic Surgery',
    code: 'LAP-SURG',
    category: 'surgical',
    description: 'Minimally invasive surgical procedures'
  },
  {
    id: generateId(),
    name: 'Pediatric Cardiology',
    code: 'PED-CARD',
    category: 'medical',
    description: 'Heart conditions in children'
  },
  {
    id: generateId(),
    name: 'CT & MRI',
    code: 'CT-MRI',
    category: 'diagnostic',
    description: 'Advanced medical imaging'
  }
];

// Staff Members
export const mockStaff: Staff[] = [
  {
    id: generateId(),
    staffId: 'STF001',
    employeeId: 'EMP001',
    firstName: 'Sarah',
    lastName: 'Johnson',
    dateOfBirth: new Date('1985-03-15'),
    age: 39,
    gender: Gender.FEMALE,
    contactInfo: {
      phone: '+91 98765 43210',
      email: 'sarah.johnson@hospital.com',
      alternatePhone: '+91 98765 43211',
      emergencyContact: {
        name: 'John Johnson',
        phone: '+91 98765 43212',
        relationship: 'Spouse'
      }
    },
    address: {
      street: '123, Park Avenue',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '400001',
      landmark: 'Near City Park'
    },
    role: UserRole.DOCTOR,
    department: mockDepartments[0],
    specializations: [mockSpecializations[0]],
    qualifications: [
      {
        id: generateId(),
        degree: 'MBBS',
        institution: 'All Institute of Medical Sciences',
        university: 'AIIMS University',
        year: 2008,
        grade: 'First Class',
        certificateNumber: 'AIIMS2008001',
        isVerified: true
      },
      {
        id: generateId(),
        degree: 'MD Cardiology',
        institution: 'Post Graduate Institute',
        university: 'PGI Chandigarh',
        year: 2011,
        grade: 'Distinction',
        certificateNumber: 'PGI2011023',
        isVerified: true
      }
    ],
    experience: 13,
    joiningDate: new Date('2011-07-01'),
    employmentType: 'full_time',
    status: Status.ACTIVE,
    isActive: true,
    medicalRegistration: {
      registrationNumber: 'MCI2011/STF001',
      council: 'Medical Council of India',
      issueDate: new Date('2011-06-15'),
      isActive: true,
      verificationStatus: 'verified'
    },
    privileges: [
      {
        id: generateId(),
        code: 'CARD-PROC',
        name: 'Cardiac Procedures',
        category: 'clinical',
        description: 'Authorized to perform cardiac interventions',
        scope: 'department',
        grantedDate: new Date('2011-07-01'),
        grantedBy: 'Dr. Chief Medical Officer',
        isActive: true
      }
    ],
    permissions: ['view_patient_records', 'edit_patient_records', 'prescribe_medication', 'order_tests'],
    workingHours: {
      monday: {
        isWorking: true,
        shifts: [{ startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00' }]
      },
      tuesday: {
        isWorking: true,
        shifts: [{ startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00' }]
      },
      wednesday: {
        isWorking: true,
        shifts: [{ startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00' }]
      },
      thursday: {
        isWorking: true,
        shifts: [{ startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00' }]
      },
      friday: {
        isWorking: true,
        shifts: [{ startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00' }]
      },
      saturday: {
        isWorking: true,
        shifts: [{ startTime: '09:00', endTime: '13:00' }]
      },
      sunday: {
        isWorking: false,
        shifts: []
      }
    },
    shifts: [],
    performanceMetrics: {
      totalPatientsHandled: 1247,
      averagePatientRating: 4.8,
      patientComplaintCount: 2,
      patientComplimentCount: 34,
      averageConsultationTime: 25,
      proceduresPerformed: 89,
      revenueGenerated: 2450000,
      diagnosisAccuracy: 96.5,
      treatmentSuccessRate: 94.2,
      complicationRate: 1.8,
      trainingHoursCompleted: 40,
      certificationsEarned: 2,
      researchPapersPublished: 3,
      attendancePercentage: 98.5,
      punctualityScore: 95.2,
      leaveDaysTaken: 15,
      peerRating: 4.7,
      supervisorRating: 4.9,
      evaluationPeriod: {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31')
      }
    },
    salaryInfo: {
      baseSalary: 180000,
      allowances: {
        hra: 54000,
        medical: 15000,
        transport: 12000,
        other: 8000
      },
      incentives: {
        performanceBonus: 25000,
        procedureBonus: 15000,
        overtimePay: 5000
      },
      deductions: {
        tax: 45000,
        pf: 21600,
        insurance: 3000,
        other: 2000
      },
      netSalary: 247400,
      payrollFrequency: 'monthly',
      currency: 'INR',
      lastUpdated: new Date('2024-01-01')
    },
    emergencyContact: {
      name: 'John Johnson',
      relationship: 'Spouse',
      phone: '+91 98765 43212'
    },
    bloodGroup: 'A+',
    languages: ['English', 'Hindi', 'Marathi'],
    notes: 'Head of Cardiology Department, excellent patient feedback',
    createdAt: new Date('2011-07-01'),
    updatedAt: new Date('2024-12-01'),
    createdBy: 'HR Admin',
    updatedBy: 'HR Admin'
  },
  {
    id: generateId(),
    staffId: 'STF002',
    employeeId: 'EMP002',
    firstName: 'Michael',
    lastName: 'Brown',
    dateOfBirth: new Date('1988-09-22'),
    age: 36,
    gender: Gender.MALE,
    contactInfo: {
      phone: '+91 87654 32109',
      email: 'michael.brown@hospital.com',
      emergencyContact: {
        name: 'Emma Brown',
        phone: '+91 87654 32108',
        relationship: 'Spouse'
      }
    },
    address: {
      street: '456, Marine Drive',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '400020',
      landmark: 'Near Queen\'s Necklace'
    },
    role: UserRole.DOCTOR,
    department: mockDepartments[1],
    specializations: [mockSpecializations[1]],
    qualifications: [
      {
        id: generateId(),
        degree: 'MBBS',
        institution: 'King Edward Memorial Hospital',
        university: 'University of Mumbai',
        year: 2010,
        grade: 'First Class',
        certificateNumber: 'KEM2010045',
        isVerified: true
      },
      {
        id: generateId(),
        degree: 'MD Emergency Medicine',
        institution: 'Tata Memorial Hospital',
        university: 'University of Mumbai',
        year: 2014,
        grade: 'Distinction',
        certificateNumber: 'TMH2014012',
        isVerified: true
      }
    ],
    experience: 10,
    joiningDate: new Date('2014-08-15'),
    employmentType: 'full_time',
    status: Status.ACTIVE,
    isActive: true,
    medicalRegistration: {
      registrationNumber: 'MCI2014/STF002',
      council: 'Maharashtra Medical Council',
      issueDate: new Date('2014-07-20'),
      isActive: true,
      verificationStatus: 'verified'
    },
    privileges: [
      {
        id: generateId(),
        code: 'EM-PROC',
        name: 'Emergency Procedures',
        category: 'clinical',
        description: 'Authorized to handle emergency cases',
        scope: 'hospital',
        grantedDate: new Date('2014-08-15'),
        grantedBy: 'Dr. Chief Medical Officer',
        isActive: true
      }
    ],
    permissions: ['view_patient_records', 'edit_patient_records', 'prescribe_medication', 'order_tests', 'emergency_override'],
    workingHours: {
      monday: { isWorking: true, shifts: [{ startTime: '08:00', endTime: '20:00', breakStart: '12:00', breakEnd: '13:00' }] },
      tuesday: { isWorking: false, shifts: [] },
      wednesday: { isWorking: true, shifts: [{ startTime: '08:00', endTime: '20:00', breakStart: '12:00', breakEnd: '13:00' }] },
      thursday: { isWorking: false, shifts: [] },
      friday: { isWorking: true, shifts: [{ startTime: '08:00', endTime: '20:00', breakStart: '12:00', breakEnd: '13:00' }] },
      saturday: { isWorking: true, shifts: [{ startTime: '08:00', endTime: '20:00', breakStart: '12:00', breakEnd: '13:00' }] },
      sunday: { isWorking: true, shifts: [{ startTime: '08:00', endTime: '20:00', breakStart: '12:00', breakEnd: '13:00' }] }
    },
    shifts: [],
    performanceMetrics: {
      totalPatientsHandled: 2156,
      averagePatientRating: 4.6,
      patientComplaintCount: 5,
      patientComplimentCount: 28,
      averageConsultationTime: 15,
      proceduresPerformed: 156,
      trainingHoursCompleted: 35,
      certificationsEarned: 1,
      attendancePercentage: 96.8,
      punctualityScore: 98.1,
      leaveDaysTaken: 12,
      peerRating: 4.5,
      supervisorRating: 4.7,
      evaluationPeriod: {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31')
      }
    },
    languages: ['English', 'Hindi'],
    notes: 'Emergency Medicine specialist, excellent in critical situations',
    createdAt: new Date('2014-08-15'),
    updatedAt: new Date('2024-12-01'),
    createdBy: 'HR Admin',
    updatedBy: 'HR Admin'
  },
  {
    id: generateId(),
    staffId: 'STF003',
    employeeId: 'EMP003',
    firstName: 'Priya',
    lastName: 'Patel',
    dateOfBirth: new Date('1990-11-08'),
    age: 34,
    gender: Gender.FEMALE,
    contactInfo: {
      phone: '+91 76543 21098',
      email: 'priya.patel@hospital.com',
      emergencyContact: {
        name: 'Raj Patel',
        phone: '+91 76543 21097',
        relationship: 'Spouse'
      }
    },
    address: {
      street: '789, Linking Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '400050',
      landmark: 'Near Bandra Station'
    },
    role: UserRole.DOCTOR,
    department: mockDepartments[2],
    specializations: [mockSpecializations[2]],
    qualifications: [
      {
        id: generateId(),
        degree: 'MBBS',
        institution: 'Grant Medical College',
        university: 'University of Mumbai',
        year: 2012,
        grade: 'First Class',
        certificateNumber: 'GMC2012089',
        isVerified: true
      },
      {
        id: generateId(),
        degree: 'MS General Surgery',
        institution: 'Seth GS Medical College',
        university: 'University of Mumbai',
        year: 2016,
        grade: 'Distinction',
        certificateNumber: 'SGSMC2016034',
        isVerified: true
      }
    ],
    experience: 8,
    joiningDate: new Date('2016-09-01'),
    employmentType: 'full_time',
    status: Status.ACTIVE,
    isActive: true,
    medicalRegistration: {
      registrationNumber: 'MCI2016/STF003',
      council: 'Maharashtra Medical Council',
      issueDate: new Date('2016-08-10'),
      isActive: true,
      verificationStatus: 'verified'
    },
    privileges: [
      {
        id: generateId(),
        code: 'SURG-PROC',
        name: 'Surgical Procedures',
        category: 'surgical',
        description: 'Authorized to perform general surgeries',
        scope: 'department',
        grantedDate: new Date('2016-09-01'),
        grantedBy: 'Dr. Chief Medical Officer',
        isActive: true
      }
    ],
    permissions: ['view_patient_records', 'edit_patient_records', 'prescribe_medication', 'order_tests', 'schedule_surgery'],
    workingHours: {
      monday: { isWorking: true, shifts: [{ startTime: '08:00', endTime: '16:00' }] },
      tuesday: { isWorking: true, shifts: [{ startTime: '08:00', endTime: '16:00' }] },
      wednesday: { isWorking: true, shifts: [{ startTime: '08:00', endTime: '16:00' }] },
      thursday: { isWorking: true, shifts: [{ startTime: '08:00', endTime: '16:00' }] },
      friday: { isWorking: true, shifts: [{ startTime: '08:00', endTime: '16:00' }] },
      saturday: { isWorking: false, shifts: [] },
      sunday: { isWorking: false, shifts: [] }
    },
    shifts: [],
    languages: ['English', 'Hindi', 'Gujarati'],
    notes: 'Skilled laparoscopic surgeon, excellent patient outcomes',
    createdAt: new Date('2016-09-01'),
    updatedAt: new Date('2024-12-01'),
    createdBy: 'HR Admin',
    updatedBy: 'HR Admin'
  },
  {
    id: generateId(),
    staffId: 'STF004',
    employeeId: 'EMP004',
    firstName: 'Nurse',
    lastName: 'Mary',
    dateOfBirth: new Date('1992-05-12'),
    age: 32,
    gender: Gender.FEMALE,
    contactInfo: {
      phone: '+91 65432 10987',
      email: 'mary.nurse@hospital.com',
      emergencyContact: {
        name: 'Peter Mary',
        phone: '+91 65432 10986',
        relationship: 'Father'
      }
    },
    address: {
      street: '321, Hill Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '400030',
      landmark: 'Near Holy Family Hospital'
    },
    role: UserRole.NURSE,
    department: mockDepartments[0],
    specializations: [],
    qualifications: [
      {
        id: generateId(),
        degree: 'BSc Nursing',
        institution: 'TN Medical College',
        university: 'University of Mumbai',
        year: 2014,
        grade: 'First Class',
        certificateNumber: 'TNMC2014156',
        isVerified: true
      }
    ],
    experience: 10,
    joiningDate: new Date('2014-10-01'),
    employmentType: 'full_time',
    status: Status.ACTIVE,
    isActive: true,
    privileges: [
      {
        id: generateId(),
        code: 'CARD-NURSING',
        name: 'Cardiac Nursing',
        category: 'clinical',
        description: 'Specialized cardiac patient care',
        scope: 'department',
        grantedDate: new Date('2015-10-01'),
        grantedBy: 'Dr. Sarah Johnson',
        isActive: true
      }
    ],
    permissions: ['view_patient_records', 'update_vitals', 'administer_medication', 'patient_care'],
    workingHours: {
      monday: { isWorking: true, shifts: [{ startTime: '07:00', endTime: '19:00', breakStart: '13:00', breakEnd: '14:00' }] },
      tuesday: { isWorking: false, shifts: [] },
      wednesday: { isWorking: true, shifts: [{ startTime: '07:00', endTime: '19:00', breakStart: '13:00', breakEnd: '14:00' }] },
      thursday: { isWorking: false, shifts: [] },
      friday: { isWorking: true, shifts: [{ startTime: '07:00', endTime: '19:00', breakStart: '13:00', breakEnd: '14:00' }] },
      saturday: { isWorking: true, shifts: [{ startTime: '07:00', endTime: '19:00', breakStart: '13:00', breakEnd: '14:00' }] },
      sunday: { isWorking: true, shifts: [{ startTime: '07:00', endTime: '19:00', breakStart: '13:00', breakEnd: '14:00' }] }
    },
    shifts: [],
    performanceMetrics: {
      totalPatientsHandled: 890,
      averagePatientRating: 4.9,
      patientComplaintCount: 1,
      patientComplimentCount: 45,
      averageConsultationTime: 0,
      proceduresPerformed: 0,
      trainingHoursCompleted: 25,
      certificationsEarned: 1,
      attendancePercentage: 99.2,
      punctualityScore: 97.8,
      leaveDaysTaken: 8,
      peerRating: 4.8,
      supervisorRating: 4.9,
      evaluationPeriod: {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31')
      }
    },
    languages: ['English', 'Hindi', 'Marathi'],
    notes: 'Senior cardiac nurse, excellent patient care skills',
    createdAt: new Date('2014-10-01'),
    updatedAt: new Date('2024-12-01'),
    createdBy: 'HR Admin',
    updatedBy: 'HR Admin'
  },
  {
    id: generateId(),
    staffId: 'STF005',
    employeeId: 'EMP005',
    firstName: 'Tech',
    lastName: 'Kumar',
    dateOfBirth: new Date('1995-08-18'),
    age: 29,
    gender: Gender.MALE,
    contactInfo: {
      phone: '+91 54321 09876',
      email: 'kumar.tech@hospital.com',
      emergencyContact: {
        name: 'Sunita Kumar',
        phone: '+91 54321 09875',
        relationship: 'Mother'
      }
    },
    address: {
      street: '654, LBS Marg',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '400070',
      landmark: 'Near Mulund Station'
    },
    role: UserRole.TECHNICIAN,
    department: mockDepartments[4],
    specializations: [mockSpecializations[4]],
    qualifications: [
      {
        id: generateId(),
        degree: 'Diploma in Medical Laboratory Technology',
        institution: 'Topiwala Medical College',
        university: 'University of Mumbai',
        year: 2016,
        grade: 'First Class',
        certificateNumber: 'TMC2016234',
        isVerified: true
      }
    ],
    experience: 8,
    joiningDate: new Date('2016-06-01'),
    employmentType: 'full_time',
    status: Status.ACTIVE,
    isActive: true,
    privileges: [
      {
        id: generateId(),
        code: 'RAD-TECH',
        name: 'Radiology Technology',
        category: 'diagnostic',
        description: 'Operate CT and MRI machines',
        scope: 'department',
        grantedDate: new Date('2017-06-01'),
        grantedBy: 'Dr. Lisa Chen',
        isActive: true
      }
    ],
    permissions: ['operate_equipment', 'view_imaging_orders', 'update_scan_status'],
    workingHours: {
      monday: { isWorking: true, shifts: [{ startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' }] },
      tuesday: { isWorking: true, shifts: [{ startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' }] },
      wednesday: { isWorking: true, shifts: [{ startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' }] },
      thursday: { isWorking: true, shifts: [{ startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' }] },
      friday: { isWorking: true, shifts: [{ startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' }] },
      saturday: { isWorking: true, shifts: [{ startTime: '09:00', endTime: '13:00' }] },
      sunday: { isWorking: false, shifts: [] }
    },
    shifts: [],
    languages: ['English', 'Hindi'],
    notes: 'Expert CT/MRI technician, good equipment maintenance record',
    createdAt: new Date('2016-06-01'),
    updatedAt: new Date('2024-12-01'),
    createdBy: 'HR Admin',
    updatedBy: 'HR Admin'
  }
];

// Staff Statistics
export const mockStaffStats: StaffStats = {
  totalStaff: 145,
  activeStaff: 138,
  staffOnLeave: 7,
  newHiresThisMonth: 3,
  averageExperience: 8.5,
  
  roleDistribution: {
    [UserRole.DOCTOR]: 45,
    [UserRole.NURSE]: 65,
    [UserRole.TECHNICIAN]: 20,
    [UserRole.PHARMACIST]: 8,
    [UserRole.RECEPTIONIST]: 5,
    [UserRole.ADMIN]: 2,
    [UserRole.SUPER_ADMIN]: 0,
    [UserRole.LAB_TECHNICIAN]: 0,
    [UserRole.RADIOLOGIST]: 0,
    [UserRole.PATIENT]: 0,
    [UserRole.BILLING_STAFF]: 0
  },
  
  departmentDistribution: {
    'Cardiology': 28,
    'Emergency Medicine': 35,
    'General Surgery': 25,
    'Pediatrics': 22,
    'Radiology': 18,
    'Administration': 17
  },
  
  employmentTypeDistribution: {
    full_time: 125,
    part_time: 12,
    contract: 5,
    consultant: 3,
    locum: 0
  },
  
  attendanceMetrics: {
    presentToday: 131,
    absentToday: 3,
    lateToday: 4,
    onLeaveToday: 7,
    averageAttendance: 96.8
  },
  
  performanceMetrics: {
    averageRating: 4.6,
    topPerformers: ['Sarah Johnson', 'Mary Nurse', 'Priya Patel'],
    trainingCompletionRate: 87.5
  },
  
  hiringTrends: [
    { month: '2024-06', hired: 5, resigned: 2 },
    { month: '2024-07', hired: 3, resigned: 1 },
    { month: '2024-08', hired: 7, resigned: 3 },
    { month: '2024-09', hired: 2, resigned: 1 },
    { month: '2024-10', hired: 4, resigned: 2 },
    { month: '2024-11', hired: 3, resigned: 1 },
    { month: '2024-12', hired: 3, resigned: 0 }
  ]
};

// Mock Shifts
export const mockShifts: Shift[] = [
  {
    id: generateId(),
    staffId: 'STF001',
    shiftType: 'morning',
    date: new Date('2024-12-05'),
    startTime: '09:00',
    endTime: '17:00',
    location: 'Block A, 3rd Floor',
    department: 'Cardiology',
    status: 'scheduled',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01')
  },
  {
    id: generateId(),
    staffId: 'STF002',
    shiftType: 'evening',
    date: new Date('2024-12-05'),
    startTime: '20:00',
    endTime: '08:00',
    location: 'Block C, Ground Floor',
    department: 'Emergency Medicine',
    status: 'in_progress',
    actualStartTime: '19:55',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-05')
  }
];

// Mock Leave Requests
export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: generateId(),
    staffId: 'STF001',
    leaveType: 'annual',
    startDate: new Date('2024-12-15'),
    endDate: new Date('2024-12-22'),
    totalDays: 8,
    reason: 'Family vacation',
    status: 'approved',
    appliedDate: new Date('2024-11-15'),
    approvedBy: 'HR Manager',
    approvedDate: new Date('2024-11-18'),
    isEmergency: false,
    handoverNotes: 'Patient cases handed over to Dr. Michael Brown',
    coveringStaff: ['STF002'],
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-11-18')
  },
  {
    id: generateId(),
    staffId: 'STF004',
    leaveType: 'sick',
    startDate: new Date('2024-12-03'),
    endDate: new Date('2024-12-05'),
    totalDays: 3,
    reason: 'Fever and flu symptoms',
    status: 'approved',
    appliedDate: new Date('2024-12-02'),
    approvedBy: 'Nursing Supervisor',
    approvedDate: new Date('2024-12-02'),
    isEmergency: true,
    documents: ['/uploads/medical_certificate_001.pdf'],
    createdAt: new Date('2024-12-02'),
    updatedAt: new Date('2024-12-02')
  }
];

// Mock Attendance
export const mockAttendance: Attendance[] = [
  {
    id: generateId(),
    staffId: 'STF001',
    date: new Date('2024-12-04'),
    clockIn: new Date('2024-12-04T08:55:00'),
    clockOut: new Date('2024-12-04T17:10:00'),
    totalHours: 8.25,
    breakDuration: 60,
    overtimeHours: 0.25,
    status: 'present',
    location: 'Block A, 3rd Floor',
    createdAt: new Date('2024-12-04'),
    updatedAt: new Date('2024-12-04')
  },
  {
    id: generateId(),
    staffId: 'STF002',
    date: new Date('2024-12-04'),
    clockIn: new Date('2024-12-04T08:15:00'),
    clockOut: new Date('2024-12-04T20:30:00'),
    totalHours: 12.25,
    breakDuration: 60,
    overtimeHours: 0.25,
    status: 'present',
    location: 'Block C, Ground Floor',
    createdAt: new Date('2024-12-04'),
    updatedAt: new Date('2024-12-04')
  },
  {
    id: generateId(),
    staffId: 'STF004',
    date: new Date('2024-12-04'),
    status: 'on_leave',
    notes: 'Approved sick leave',
    approvedBy: 'Nursing Supervisor',
    createdAt: new Date('2024-12-04'),
    updatedAt: new Date('2024-12-04')
  }
];

// Mock Training Programs
export const mockTraining: Training[] = [
  {
    id: generateId(),
    title: 'Advanced Cardiac Life Support (ACLS)',
    description: 'Certification course for advanced cardiac emergency procedures',
    category: 'certification',
    duration: 16,
    startDate: new Date('2024-12-15'),
    endDate: new Date('2024-12-16'),
    instructor: 'Dr. Robert Wilson',
    location: 'Training Center, Block F',
    maxParticipants: 20,
    currentParticipants: 15,
    status: 'scheduled',
    completionCriteria: 'Pass written exam and practical assessment',
    certificateAwarded: true,
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-12-01')
  },
  {
    id: generateId(),
    title: 'Hospital Infection Control',
    description: 'Mandatory training on infection prevention and control measures',
    category: 'mandatory',
    duration: 4,
    startDate: new Date('2024-12-10'),
    instructor: 'Infection Control Nurse',
    location: 'Conference Room A',
    maxParticipants: 50,
    currentParticipants: 48,
    status: 'ongoing',
    completionCriteria: 'Attend full session and pass quiz',
    certificateAwarded: false,
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-12-01')
  }
];