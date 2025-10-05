// Mock data for HR Management

import {
  Employee,
  Department,
  Attendance,
  LeaveRequest,
  Payroll,
  Performance,
  Training,
  HRStats
} from '../../types/hr';

export const mockEmployees: Employee[] = [
  {
    id: '1',
    employeeId: 'EMP-001',
    firstName: 'Dr. Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@hospital.com',
    phone: '+91-9876543210',
    position: 'Senior Cardiologist',
    department: 'Cardiology',
    dateOfJoining: '2020-03-15',
    status: 'active',
    salary: 150000,
    address: '123 Medical Street, Mumbai, Maharashtra 400001',
    emergencyContact: {
      name: 'Michael Johnson',
      relationship: 'Spouse',
      phone: '+91-9876543211'
    },
    qualifications: ['MBBS', 'MD Cardiology', 'Fellowship in Interventional Cardiology'],
    experience: 12,
    licenseNumber: 'MH/001/2020'
  },
  {
    id: '2',
    employeeId: 'EMP-002',
    firstName: 'Nurse Mary',
    lastName: 'Wilson',
    email: 'mary.wilson@hospital.com',
    phone: '+91-9876543212',
    position: 'Senior Nurse',
    department: 'Emergency',
    dateOfJoining: '2019-08-20',
    status: 'active',
    salary: 45000,
    address: '456 Care Avenue, Mumbai, Maharashtra 400002',
    emergencyContact: {
      name: 'John Wilson',
      relationship: 'Husband',
      phone: '+91-9876543213'
    },
    qualifications: ['BSc Nursing', 'Critical Care Certification'],
    experience: 8,
    licenseNumber: 'RN/002/2019'
  },
  {
    id: '3',
    employeeId: 'EMP-003',
    firstName: 'Dr. Michael',
    lastName: 'Chen',
    email: 'michael.chen@hospital.com',
    phone: '+91-9876543214',
    position: 'Radiologist',
    department: 'Radiology',
    dateOfJoining: '2021-01-10',
    status: 'active',
    salary: 120000,
    address: '789 Health Boulevard, Mumbai, Maharashtra 400003',
    emergencyContact: {
      name: 'Lisa Chen',
      relationship: 'Wife',
      phone: '+91-9876543215'
    },
    qualifications: ['MBBS', 'MD Radiology', 'Fellowship in Interventional Radiology'],
    experience: 10,
    licenseNumber: 'MH/003/2021'
  }
];

export const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Cardiology',
    description: 'Heart and cardiovascular care',
    headOfDepartment: 'Dr. Sarah Johnson',
    employeeCount: 12,
    budget: 2500000,
    location: 'Floor 3, Wing A'
  },
  {
    id: '2',
    name: 'Emergency',
    description: 'Emergency and trauma care',
    headOfDepartment: 'Dr. Robert Martinez',
    employeeCount: 25,
    budget: 3200000,
    location: 'Ground Floor, Wing B'
  },
  {
    id: '3',
    name: 'Radiology',
    description: 'Medical imaging and diagnostics',
    headOfDepartment: 'Dr. Michael Chen',
    employeeCount: 8,
    budget: 1800000,
    location: 'Floor 2, Wing C'
  }
];

export const mockAttendance: Attendance[] = [
  {
    id: '1',
    employeeId: '1',
    employee: mockEmployees[0],
    date: '2024-01-15',
    checkIn: '08:00',
    checkOut: '17:30',
    hoursWorked: 8.5,
    status: 'present',
    overtime: 0.5,
    notes: 'Regular shift with extra consultation'
  },
  {
    id: '2',
    employeeId: '2',
    employee: mockEmployees[1],
    date: '2024-01-15',
    checkIn: '06:00',
    checkOut: '14:00',
    hoursWorked: 8,
    status: 'present',
    overtime: 0,
    notes: 'Morning shift'
  },
  {
    id: '3',
    employeeId: '3',
    employee: mockEmployees[2],
    date: '2024-01-15',
    checkIn: null,
    checkOut: null,
    hoursWorked: 0,
    status: 'sick_leave',
    overtime: 0,
    notes: 'Approved sick leave'
  }
];

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: '1',
    employee: mockEmployees[0],
    leaveType: 'annual',
    startDate: '2024-02-01',
    endDate: '2024-02-05',
    days: 5,
    reason: 'Family vacation',
    status: 'approved',
    appliedDate: '2024-01-10',
    approvedBy: 'HR Manager',
    approvedDate: '2024-01-12',
    notes: 'Approved for annual leave'
  },
  {
    id: '2',
    employeeId: '2',
    employee: mockEmployees[1],
    leaveType: 'sick',
    startDate: '2024-01-15',
    endDate: '2024-01-15',
    days: 1,
    reason: 'Fever and flu symptoms',
    status: 'approved',
    appliedDate: '2024-01-14',
    approvedBy: 'Department Head',
    approvedDate: '2024-01-14',
    notes: 'Medical certificate required'
  },
  {
    id: '3',
    employeeId: '3',
    employee: mockEmployees[2],
    leaveType: 'personal',
    startDate: '2024-02-10',
    endDate: '2024-02-12',
    days: 3,
    reason: 'Personal matters',
    status: 'pending',
    appliedDate: '2024-01-15',
    approvedBy: null,
    approvedDate: null,
    notes: 'Waiting for approval'
  }
];

export const mockPayroll: Payroll[] = [
  {
    id: '1',
    employeeId: '1',
    employee: mockEmployees[0],
    month: 'January',
    year: 2024,
    basicSalary: 150000,
    allowances: 25000,
    overtime: 5000,
    deductions: 15000,
    netSalary: 165000,
    tax: 12000,
    pf: 3000,
    status: 'processed',
    payDate: '2024-01-31'
  },
  {
    id: '2',
    employeeId: '2',
    employee: mockEmployees[1],
    month: 'January',
    year: 2024,
    basicSalary: 45000,
    allowances: 8000,
    overtime: 2000,
    deductions: 5500,
    netSalary: 49500,
    tax: 3500,
    pf: 2000,
    status: 'processed',
    payDate: '2024-01-31'
  }
];

export const mockPerformance: Performance[] = [
  {
    id: '1',
    employeeId: '1',
    employee: mockEmployees[0],
    reviewPeriod: 'Q4 2023',
    overallRating: 4.5,
    kpis: [
      { name: 'Patient Satisfaction', score: 4.8, weight: 30 },
      { name: 'Clinical Excellence', score: 4.7, weight: 40 },
      { name: 'Teamwork', score: 4.2, weight: 20 },
      { name: 'Professional Development', score: 4.3, weight: 10 }
    ],
    strengths: ['Excellent patient care', 'Strong clinical skills', 'Leadership qualities'],
    areasForImprovement: ['Time management', 'Administrative tasks'],
    goals: ['Complete advanced cardiac surgery course', 'Mentor junior doctors'],
    reviewDate: '2024-01-15',
    reviewedBy: 'Chief Medical Officer',
    status: 'completed'
  }
];

export const mockTraining: Training[] = [
  {
    id: '1',
    title: 'Advanced Cardiac Life Support (ACLS)',
    description: 'Certification in advanced cardiac life support procedures',
    type: 'certification',
    duration: 16,
    startDate: '2024-02-15',
    endDate: '2024-02-16',
    instructor: 'Dr. Emergency Training Institute',
    maxParticipants: 20,
    enrolledCount: 15,
    status: 'scheduled',
    department: 'All Departments',
    cost: 15000,
    location: 'Training Room A',
    mandatory: true,
    materials: ['ACLS Provider Manual', 'CPR Manikins', 'AED Trainers']
  },
  {
    id: '2',
    title: 'Hospital Information System Training',
    description: 'Training on new hospital management software',
    type: 'skill_development',
    duration: 8,
    startDate: '2024-02-20',
    endDate: '2024-02-20',
    instructor: 'IT Department',
    maxParticipants: 50,
    enrolledCount: 45,
    status: 'scheduled',
    department: 'All Departments',
    cost: 0,
    location: 'Conference Hall',
    mandatory: true,
    materials: ['User Manual', 'System Access Codes']
  }
];

export const mockHRStats: HRStats = {
  totalEmployees: 245,
  activeEmployees: 238,
  onLeave: 7,
  newHires: 12,
  resignations: 3,
  averageSalary: 75000,
  attendanceRate: 94.5,
  turnoverRate: 8.2,
  employeesByDepartment: [
    { department: 'Nursing', count: 85, percentage: 34.7 },
    { department: 'Medical', count: 65, percentage: 26.5 },
    { department: 'Administration', count: 35, percentage: 14.3 },
    { department: 'Support Staff', count: 30, percentage: 12.2 },
    { department: 'Technical', count: 20, percentage: 8.2 },
    { department: 'Others', count: 10, percentage: 4.1 }
  ],
  leaveStats: {
    totalRequests: 45,
    approved: 38,
    pending: 5,
    rejected: 2
  },
  trainingStats: {
    totalPrograms: 24,
    completed: 18,
    ongoing: 4,
    scheduled: 2
  },
  performanceDistribution: [
    { rating: '5.0', count: 15, percentage: 6.1 },
    { rating: '4.0-4.9', count: 125, percentage: 51.0 },
    { rating: '3.0-3.9', count: 85, percentage: 34.7 },
    { rating: '2.0-2.9', count: 18, percentage: 7.3 },
    { rating: '< 2.0', count: 2, percentage: 0.8 }
  ]
};