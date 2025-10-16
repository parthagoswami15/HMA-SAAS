// Mock data for Patient Portal

export const mockPatientPortalData = {
  upcomingAppointments: [
    {
      id: '1',
      date: '2024-01-18',
      time: '10:00 AM',
      doctor: 'Dr. Sarah Johnson',
      department: 'Cardiology',
      type: 'Follow-up',
      status: 'arrived'
    },
    {
      id: '2',
      date: '2024-01-25',
      time: '2:00 PM',
      doctor: 'Dr. Michael Chen',
      department: 'Radiology',
      type: 'Consultation',
      status: 'pending'
    }
  ],
  prescriptions: [
    {
      id: '1',
      medication: 'Paracetamol 500mg',
      medicationName: 'Paracetamol 500mg',
      dosage: '1 tablet twice daily',
      frequency: 'Twice daily',
      duration: '5 days',
      prescribedBy: 'Dr. Sarah Johnson',
      doctorName: 'Sarah Johnson',
      date: '2024-01-15',
      prescribedDate: '2024-01-15',
      status: 'active',
      isActive: true,
      refillsLeft: 2,
      pharmacyName: 'City Pharmacy',
      instructions: 'Take with food'
    },
    {
      id: '2',
      medication: 'Amoxicillin 250mg',
      medicationName: 'Amoxicillin 250mg',
      dosage: '1 capsule three times daily',
      frequency: 'Three times daily',
      duration: '7 days',
      prescribedBy: 'Dr. Michael Chen',
      doctorName: 'Michael Chen',
      date: '2024-01-10',
      prescribedDate: '2024-01-10',
      status: 'completed',
      isActive: false,
      refillsLeft: 0,
      pharmacyName: 'Health Pharmacy',
      instructions: 'Complete full course'
    }
  ],
  testResults: [
    {
      id: '1',
      testName: 'Complete Blood Count',
      category: 'Hematology',
      testCode: 'CBC001',
      date: '2024-01-16',
      testDate: '2024-01-16',
      resultDate: '2024-01-17',
      status: 'completed',
      results: 'Normal',
      doctor: 'Dr. Sarah Johnson',
      orderedBy: 'Sarah Johnson',
      labName: 'Central Lab',
      priority: 'normal',
      notes: 'All values within normal range'
    },
    {
      id: '2',
      testName: 'Chest X-Ray',
      category: 'Radiology',
      testCode: 'XR002',
      date: '2024-01-12',
      testDate: '2024-01-12',
      resultDate: '2024-01-13',
      status: 'completed',
      results: 'Clear',
      doctor: 'Dr. Michael Chen',
      orderedBy: 'Michael Chen',
      labName: 'Imaging Center',
      priority: 'urgent',
      notes: 'No abnormalities detected'
    }
  ],
  medicalRecords: [
    {
      id: '1',
      date: '2024-01-15',
      type: 'consultation',
      title: 'Cardiology Consultation',
      doctor: 'Dr. Sarah Johnson',
      providerName: 'Sarah Johnson',
      department: 'Cardiology',
      diagnosis: 'Hypertension',
      treatment: 'Lifestyle modifications and medication',
      description: 'Regular blood pressure monitoring required. Patient advised on diet and exercise.',
      notes: 'Blood pressure monitoring required'
    },
    {
      id: '2',
      date: '2024-01-10',
      type: 'diagnosis',
      title: 'Emergency Visit',
      doctor: 'Dr. Michael Chen',
      providerName: 'Michael Chen',
      department: 'Emergency',
      diagnosis: 'Acute respiratory infection',
      treatment: 'Antibiotics prescribed',
      description: 'Patient presented with respiratory symptoms. Prescribed antibiotics and follow-up in 1 week.',
      notes: 'Prescribed antibiotics, follow-up in 1 week'
    }
  ],
  notifications: [
    {
      id: '1',
      type: 'appointment',
      title: 'Appointment Reminder',
      message: 'Appointment reminder: Tomorrow at 10:00 AM with Dr. Sarah Johnson',
      date: '2024-01-17',
      createdDate: '2024-01-17',
      priority: 'high',
      read: false
    },
    {
      id: '2',
      type: 'test_result',
      title: 'Test Results Available',
      message: 'Your test results are now available',
      date: '2024-01-16',
      createdDate: '2024-01-16',
      priority: 'normal',
      read: true
    }
  ]
};

export const mockPatientStats = {
  totalAppointments: 25,
  completedAppointments: 20,
  cancelledAppointments: 3,
  upcomingAppointments: 2,
  activePrescriptions: 3,
  completedPrescriptions: 12,
  testResults: 8,
  medicalRecords: 15
};

// Aliases expected by pages
export const mockAppointments = mockPatientPortalData.upcomingAppointments;
export const mockPrescriptions = mockPatientPortalData.prescriptions;
export const mockTestResults = mockPatientPortalData.testResults;
export const mockMedicalRecords = mockPatientPortalData.medicalRecords;
export const mockPatientNotifications = mockPatientPortalData.notifications;
export const mockPatientPortalStats = mockPatientStats;
export const mockCommunications: any[] = [
  {
    id: '1',
    senderType: 'doctor',
    senderName: 'Sarah Johnson',
    subject: 'Follow-up Required',
    message: 'Please schedule a follow-up appointment for your blood pressure check.',
    type: 'appointment',
    sentDate: '2024-01-16T10:30:00',
    isRead: false
  },
  {
    id: '2',
    senderType: 'patient',
    senderName: 'You',
    subject: 'Prescription Refill',
    message: 'I would like to request a refill for my blood pressure medication.',
    type: 'prescription',
    sentDate: '2024-01-15T14:20:00',
    isRead: true
  }
];
