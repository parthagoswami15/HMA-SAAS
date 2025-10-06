// Mock data for Telemedicine

export const mockTelemedicineConsultations = [
  {
    id: '1',
    consultationId: 'TM-2024-001',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Johnson',
    scheduledTime: '2024-01-18T10:00:00',
    status: 'scheduled',
    type: 'video',
    duration: 30, // minutes
    specialty: 'Cardiology',
    reason: 'Follow-up consultation'
  },
  {
    id: '2',
    consultationId: 'TM-2024-002',
    patientName: 'Jane Smith',
    doctorName: 'Dr. Michael Chen',
    scheduledTime: '2024-01-17T14:30:00',
    status: 'completed',
    type: 'video',
    duration: 45, // minutes
    specialty: 'Internal Medicine',
    reason: 'General consultation'
  }
];

export const mockVirtualWaitingRoom = [
  {
    id: '1',
    patientName: 'Alice Johnson',
    doctorName: 'Dr. Emily Rodriguez',
    appointmentTime: '2024-01-18T11:00:00',
    waitTime: 15, // minutes
    status: 'waiting'
  },
  {
    id: '2',
    patientName: 'Bob Wilson',
    doctorName: 'Dr. Lisa Wang',
    appointmentTime: '2024-01-18T11:30:00',
    waitTime: 5, // minutes
    status: 'ready'
  }
];

export const mockTelemedicineStats = {
  totalConsultations: 285,
  completedConsultations: 265,
  scheduledConsultations: 15,
  cancelledConsultations: 5,
  averageDuration: 32, // minutes
  patientSatisfaction: 4.7,
  activeConnections: 8,
  consultationsBySpecialty: [
    { specialty: 'General Medicine', count: 95, percentage: 33.3 },
    { specialty: 'Cardiology', count: 65, percentage: 22.8 },
    { specialty: 'Dermatology', count: 55, percentage: 19.3 },
    { specialty: 'Psychiatry', count: 40, percentage: 14.0 },
    { specialty: 'Others', count: 30, percentage: 10.5 }
  ]
};

// Aliases expected by pages
export const mockTelemedicineSessions = mockTelemedicineConsultations;
export const mockPatientMonitoring = [
  { id: 'm1', patientName: 'John Doe', metric: 'Heart Rate', value: 78, unit: 'bpm' }
];
export const mockDigitalPrescriptions = [
  { id: 'dp1', patientName: 'Jane Smith', medications: 2, date: '2024-01-12' }
];
export const mockVirtualConsultations = mockTelemedicineConsultations;