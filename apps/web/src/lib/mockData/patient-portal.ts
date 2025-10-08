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
      dosage: '1 tablet twice daily',
      duration: '5 days',
      prescribedBy: 'Dr. Sarah Johnson',
      date: '2024-01-15',
      status: 'active'
    },
    {
      id: '2',
      medication: 'Amoxicillin 250mg',
      dosage: '1 capsule three times daily',
      duration: '7 days',
      prescribedBy: 'Dr. Michael Chen',
      date: '2024-01-10',
      status: 'completed'
    }
  ],
  testResults: [
    {
      id: '1',
      testName: 'Complete Blood Count',
      date: '2024-01-16',
      status: 'completed',
      results: 'Normal',
      doctor: 'Dr. Sarah Johnson'
    },
    {
      id: '2',
      testName: 'Chest X-Ray',
      date: '2024-01-12',
      status: 'completed',
      results: 'Clear',
      doctor: 'Dr. Michael Chen'
    }
  ],
  medicalRecords: [
    {
      id: '1',
      date: '2024-01-15',
      type: 'Consultation',
      doctor: 'Dr. Sarah Johnson',
      diagnosis: 'Hypertension',
      notes: 'Blood pressure monitoring required'
    },
    {
      id: '2',
      date: '2024-01-10',
      type: 'Emergency',
      doctor: 'Dr. Michael Chen',
      diagnosis: 'Acute respiratory infection',
      notes: 'Prescribed antibiotics, follow-up in 1 week'
    }
  ],
  notifications: [
    {
      id: '1',
      type: 'appointment',
      message: 'Appointment reminder: Tomorrow at 10:00 AM with Dr. Sarah Johnson',
      date: '2024-01-17',
      read: false
    },
    {
      id: '2',
      type: 'test_result',
      message: 'Your test results are now available',
      date: '2024-01-16',
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
export const mockCommunications: any[] = [];
