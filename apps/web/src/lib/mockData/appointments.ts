import { 
  Appointment, 
  AppointmentStats, 
  DoctorAvailability, 
  AppointmentQueue,
  AppointmentReminder,
  TelemedicineAppointment,
  AppointmentType,
  AppointmentStatus,
  AppointmentPriority,
  NotificationPreference,
  TimeSlot,
  Calendar
} from '../../types/appointment';
import { generateId } from '../utils';
import { mockPatients } from './patients';
import { mockStaff } from './staff';

// Mock Appointments
export const mockAppointments: Appointment[] = [
  {
    id: generateId(),
    appointmentId: 'APT001',
    appointmentNumber: 'HMS-2024-001',
    patient: mockPatients[0],
    doctor: mockStaff[0], // Dr. Sarah Johnson - Cardiology
    appointmentDate: new Date('2024-12-05'),
    appointmentTime: '09:30',
    duration: 30,
    appointmentType: 'consultation' as AppointmentType,
    department: 'Cardiology',
    reason: 'Chest pain and irregular heartbeat',
    notes: 'Patient reports chest pain for the past week',
    status: 'scheduled' as AppointmentStatus,
    priority: 'high' as AppointmentPriority,
    
    scheduledBy: 'Receptionist',
    scheduledDate: new Date('2024-12-03'),
    
    followUpRequired: true,
    followUpDate: new Date('2024-12-19'),
    followUpNotes: 'ECG review needed',
    
    consultationFee: 1500,
    isPaid: false,
    
    reminderSent: false,
    patientNotified: true,
    notificationPreference: 'sms' as NotificationPreference,
    
    metadata: {
      symptoms: ['chest pain', 'irregular heartbeat', 'shortness of breath'],
      allergies: ['penicillin'],
      medications: ['aspirin 75mg daily'],
      vitalSigns: {
        bloodPressure: '140/90',
        heartRate: 82,
        temperature: 98.6,
        weight: 70,
        height: 175
      }
    },
    
    createdAt: new Date('2024-12-03'),
    updatedAt: new Date('2024-12-04'),
    createdBy: 'Receptionist',
    updatedBy: 'Receptionist'
  },
  {
    id: generateId(),
    appointmentId: 'APT002',
    appointmentNumber: 'HMS-2024-002',
    patient: mockPatients[1],
    doctor: mockStaff[1], // Dr. Michael Brown - Emergency Medicine
    appointmentDate: new Date('2024-12-05'),
    appointmentTime: '14:00',
    duration: 45,
    appointmentType: 'emergency' as AppointmentType,
    department: 'Emergency Medicine',
    reason: 'Severe headache and fever',
    status: 'confirmed' as AppointmentStatus,
    priority: 'urgent' as AppointmentPriority,
    
    scheduledBy: 'Emergency Nurse',
    scheduledDate: new Date('2024-12-05'),
    confirmedBy: 'Dr. Michael Brown',
    confirmedDate: new Date('2024-12-05'),
    
    followUpRequired: false,
    
    consultationFee: 2000,
    isPaid: true,
    paymentMethod: 'insurance',
    paymentReference: 'INS-2024-567',
    
    reminderSent: false,
    patientNotified: true,
    notificationPreference: 'phone' as NotificationPreference,
    
    metadata: {
      referredBy: 'Emergency Department',
      symptoms: ['severe headache', 'high fever', 'nausea'],
      vitalSigns: {
        bloodPressure: '160/100',
        heartRate: 95,
        temperature: 102.5,
        weight: 65,
        height: 160
      }
    },
    
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-05'),
    createdBy: 'Emergency Nurse',
    updatedBy: 'Emergency Nurse'
  },
  {
    id: generateId(),
    appointmentId: 'APT003',
    appointmentNumber: 'HMS-2024-003',
    patient: mockPatients[2],
    doctor: mockStaff[2], // Dr. Priya Patel - General Surgery
    appointmentDate: new Date('2024-12-06'),
    appointmentTime: '10:15',
    duration: 60,
    appointmentType: 'surgery_consultation' as AppointmentType,
    department: 'General Surgery',
    reason: 'Pre-operative consultation for gallbladder surgery',
    status: 'scheduled' as AppointmentStatus,
    priority: 'normal' as AppointmentPriority,
    
    scheduledBy: 'Surgical Coordinator',
    scheduledDate: new Date('2024-12-02'),
    
    followUpRequired: true,
    followUpDate: new Date('2024-12-20'),
    followUpNotes: 'Post-operative check-up',
    
    consultationFee: 2500,
    isPaid: false,
    
    reminderSent: true,
    reminderDate: new Date('2024-12-04'),
    patientNotified: true,
    notificationPreference: 'email' as NotificationPreference,
    
    metadata: {
      referredBy: 'Dr. Internal Medicine',
      symptoms: ['abdominal pain', 'nausea after meals'],
      medications: ['omeprazole 20mg daily'],
      vitalSigns: {
        bloodPressure: '125/80',
        heartRate: 76,
        temperature: 98.2,
        weight: 78,
        height: 170
      }
    },
    
    createdAt: new Date('2024-12-02'),
    updatedAt: new Date('2024-12-04'),
    createdBy: 'Surgical Coordinator',
    updatedBy: 'Surgical Coordinator'
  },
  {
    id: generateId(),
    appointmentId: 'APT004',
    appointmentNumber: 'HMS-2024-004',
    patient: mockPatients[3],
    doctor: mockStaff[0], // Dr. Sarah Johnson
    appointmentDate: new Date('2024-12-04'),
    appointmentTime: '11:30',
    duration: 30,
    appointmentType: 'follow_up' as AppointmentType,
    department: 'Cardiology',
    reason: 'Follow-up for hypertension management',
    status: 'completed' as AppointmentStatus,
    priority: 'normal' as AppointmentPriority,
    
    scheduledBy: 'Patient Portal',
    scheduledDate: new Date('2024-11-20'),
    confirmedBy: 'Auto-confirmed',
    confirmedDate: new Date('2024-11-21'),
    
    checkInTime: new Date('2024-12-04T11:25:00'),
    checkOutTime: new Date('2024-12-04T12:05:00'),
    waitingTime: 5,
    consultationTime: 35,
    
    followUpRequired: true,
    followUpDate: new Date('2025-01-04'),
    followUpNotes: 'Monthly BP monitoring',
    
    consultationFee: 1200,
    isPaid: true,
    paymentMethod: 'cash',
    
    reminderSent: true,
    reminderDate: new Date('2024-12-03'),
    patientNotified: true,
    notificationPreference: 'sms' as NotificationPreference,
    
    metadata: {
      medications: ['amlodipine 5mg daily', 'metoprolol 50mg twice daily'],
      vitalSigns: {
        bloodPressure: '132/84',
        heartRate: 68,
        temperature: 98.4,
        weight: 85,
        height: 180
      }
    },
    
    createdAt: new Date('2024-11-20'),
    updatedAt: new Date('2024-12-04'),
    createdBy: 'Patient Portal',
    updatedBy: 'Dr. Sarah Johnson'
  },
  {
    id: generateId(),
    appointmentId: 'APT005',
    appointmentNumber: 'HMS-2024-005',
    patient: mockPatients[4],
    doctor: mockStaff[0],
    appointmentDate: new Date('2024-12-07'),
    appointmentTime: '15:30',
    duration: 60,
    appointmentType: 'telemedicine' as AppointmentType,
    department: 'Cardiology',
    reason: 'Remote consultation for cardiac rehabilitation progress',
    status: 'scheduled' as AppointmentStatus,
    priority: 'normal' as AppointmentPriority,
    
    scheduledBy: 'Telemedicine Coordinator',
    scheduledDate: new Date('2024-12-05'),
    
    followUpRequired: true,
    followUpDate: new Date('2024-12-21'),
    
    consultationFee: 1000,
    isPaid: false,
    
    reminderSent: false,
    patientNotified: true,
    notificationPreference: 'email' as NotificationPreference,
    
    metadata: {
      symptoms: ['mild chest discomfort', 'fatigue during exercise'],
      medications: ['carvedilol 12.5mg twice daily', 'atorvastatin 40mg daily'],
      vitalSigns: {
        bloodPressure: '128/78',
        heartRate: 72,
        weight: 75,
        height: 168
      }
    },
    
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-05'),
    createdBy: 'Telemedicine Coordinator',
    updatedBy: 'Telemedicine Coordinator'
  }
];

// Doctor Availability
export const mockDoctorAvailability: DoctorAvailability[] = [
  {
    id: generateId(),
    doctorId: 'STF001',
    doctor: mockStaff[0],
    date: new Date('2024-12-05'),
    timeSlots: [
      {
        id: generateId(),
        startTime: '09:00',
        endTime: '09:30',
        duration: 30,
        isAvailable: false,
        appointmentId: 'APT001',
        slotType: 'consultation',
        maxBookings: 1,
        currentBookings: 1
      },
      {
        id: generateId(),
        startTime: '09:30',
        endTime: '10:00',
        duration: 30,
        isAvailable: true,
        slotType: 'consultation',
        maxBookings: 1,
        currentBookings: 0
      },
      {
        id: generateId(),
        startTime: '10:00',
        endTime: '10:30',
        duration: 30,
        isAvailable: true,
        slotType: 'consultation',
        maxBookings: 1,
        currentBookings: 0
      },
      {
        id: generateId(),
        startTime: '13:00',
        endTime: '14:00',
        duration: 60,
        isAvailable: false,
        slotType: 'break',
        maxBookings: 0,
        currentBookings: 0
      }
    ],
    isAvailable: true,
    maxAppointments: 16,
    currentAppointments: 8,
    breakTimes: [
      {
        id: generateId(),
        startTime: '13:00',
        endTime: '14:00',
        breakType: 'lunch',
        description: 'Lunch break'
      }
    ],
    specialNotes: 'Available for emergency consultations',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-04'),
    createdBy: 'Scheduling System',
    updatedBy: 'Dr. Sarah Johnson'
  }
];

// Appointment Queue
export const mockAppointmentQueue: AppointmentQueue[] = [
  {
    id: generateId(),
    doctorId: 'STF001',
    doctor: mockStaff[0],
    date: new Date('2024-12-05'),
    appointments: [
      {
        appointmentId: 'APT001',
        appointment: mockAppointments[0],
        queueNumber: 1,
        estimatedTime: '09:30',
        waitingTime: 0,
        status: 'waiting',
        priority: 3
      }
    ],
    currentAppointment: undefined,
    averageWaitTime: 15,
    estimatedDelay: 0
  }
];

// Appointment Statistics
export const mockAppointmentStats: AppointmentStats = {
  totalAppointments: 2847,
  todayAppointments: 45,
  upcomingAppointments: 234,
  completedAppointments: 2456,
  cancelledAppointments: 287,
  noShowAppointments: 104,
  
  appointmentsByType: {
    consultation: 1456,
    follow_up: 892,
    emergency: 234,
    routine_checkup: 156,
    diagnostic: 67,
    procedure: 23,
    vaccination: 12,
    surgery_consultation: 5,
    second_opinion: 2,
    telemedicine: 45
  },
  
  appointmentsByStatus: {
    scheduled: 234,
    confirmed: 156,
    checked_in: 23,
    in_progress: 12,
    completed: 2456,
    cancelled: 287,
    no_show: 104,
    rescheduled: 67
  },
  
  appointmentsByDepartment: {
    'Cardiology': 567,
    'Emergency Medicine': 423,
    'General Surgery': 345,
    'Pediatrics': 298,
    'Radiology': 234
  },
  
  appointmentsByDoctor: [
    {
      doctorId: 'STF001',
      doctorName: 'Dr. Sarah Johnson',
      appointmentCount: 456,
      completionRate: 92.5
    },
    {
      doctorId: 'STF002',
      doctorName: 'Dr. Michael Brown',
      appointmentCount: 389,
      completionRate: 88.2
    }
  ],
  
  averageWaitTime: 18,
  averageConsultationTime: 32,
  patientSatisfactionScore: 4.6,
  
  dailyAppointments: [
    { date: '2024-12-01', scheduled: 42, completed: 38, cancelled: 3, noShow: 1 },
    { date: '2024-12-02', scheduled: 45, completed: 41, cancelled: 2, noShow: 2 },
    { date: '2024-12-03', scheduled: 38, completed: 35, cancelled: 2, noShow: 1 },
    { date: '2024-12-04', scheduled: 47, completed: 43, cancelled: 3, noShow: 1 },
    { date: '2024-12-05', scheduled: 45, completed: 0, cancelled: 0, noShow: 0 }
  ],
  
  monthlyTrends: [
    { month: '2024-06', appointments: 1234, revenue: 1856000, completionRate: 89.2 },
    { month: '2024-07', appointments: 1456, revenue: 2184000, completionRate: 91.5 },
    { month: '2024-08', appointments: 1345, revenue: 2017500, completionRate: 88.7 },
    { month: '2024-09', appointments: 1567, revenue: 2350500, completionRate: 92.1 },
    { month: '2024-10', appointments: 1678, revenue: 2517000, completionRate: 90.8 },
    { month: '2024-11', appointments: 1543, revenue: 2314500, completionRate: 91.3 }
  ],
  
  peakHours: [
    { hour: 9, appointmentCount: 234 },
    { hour: 10, appointmentCount: 267 },
    { hour: 11, appointmentCount: 298 },
    { hour: 14, appointmentCount: 245 },
    { hour: 15, appointmentCount: 223 },
    { hour: 16, appointmentCount: 189 }
  ],
  
  revenueMetrics: {
    totalRevenue: 4275000,
    pendingPayments: 234500,
    averageConsultationFee: 1500,
    revenueByDepartment: {
      'Cardiology': 850500,
      'Emergency Medicine': 846000,
      'General Surgery': 862500,
      'Pediatrics': 447000,
      'Radiology': 351000
    }
  }
};

// Appointment Reminders
export const mockAppointmentReminders: AppointmentReminder[] = [
  {
    id: generateId(),
    appointmentId: 'APT001',
    patientId: mockPatients[0].id,
    reminderType: '24_hour',
    scheduledTime: new Date('2024-12-04T09:30:00'),
    message: 'Reminder: You have an appointment tomorrow at 9:30 AM with Dr. Sarah Johnson',
    status: 'scheduled',
    attempts: 0,
    deliveryMethod: 'sms'
  },
  {
    id: generateId(),
    appointmentId: 'APT003',
    patientId: mockPatients[2].id,
    reminderType: '2_hour',
    scheduledTime: new Date('2024-12-06T08:15:00'),
    message: 'Reminder: Your surgery consultation is in 2 hours with Dr. Priya Patel',
    status: 'sent',
    attempts: 1,
    lastAttempt: new Date('2024-12-06T08:15:00'),
    deliveryMethod: 'email'
  }
];

// Telemedicine Appointments
export const mockTelemedicineAppointments: TelemedicineAppointment[] = [
  {
    appointmentId: 'APT005',
    meetingLink: 'https://zoom.us/j/123456789',
    meetingId: '123456789',
    meetingPassword: 'health123',
    platform: 'zoom',
    recordingEnabled: true,
    technicalRequirements: [
      'Stable internet connection',
      'Camera and microphone',
      'Zoom app installed'
    ],
    connectionStatus: 'pending'
  }
];

// Calendar Data
export const mockCalendars: Calendar[] = [
  {
    id: generateId(),
    doctorId: 'STF001',
    doctor: mockStaff[0],
    date: new Date('2024-12-05'),
    appointments: [mockAppointments[0]],
    availability: mockDoctorAvailability[0],
    workingHours: {
      startTime: '09:00',
      endTime: '17:00'
    },
    blockedTimes: [
      {
        id: generateId(),
        startTime: '13:00',
        endTime: '14:00',
        reason: 'Lunch break',
        blockedBy: 'System',
        isRecurring: true,
        recurringPattern: {
          type: 'daily',
          interval: 1,
          daysOfWeek: [1, 2, 3, 4, 5] // Monday to Friday
        }
      }
    ],
    notes: 'Regular working day with lunch break'
  }
];