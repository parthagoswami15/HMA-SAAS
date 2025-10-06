// Mock data for Surgery Management

export const mockSurgeries = [
  {
    id: '1',
    surgeryId: 'SUR-2024-001',
    patientName: 'John Doe',
    surgeon: 'Dr. Sarah Johnson',
    procedure: 'Appendectomy',
    date: '2024-01-18',
    time: '10:00 AM',
    status: 'scheduled',
    duration: 120, // minutes
    operatingRoom: 'OR-1',
    assistants: ['Dr. Michael Chen', 'Nurse Mary Wilson'],
    anesthesiologist: 'Dr. Robert Martinez'
  },
  {
    id: '2',
    surgeryId: 'SUR-2024-002',
    patientName: 'Jane Smith',
    surgeon: 'Dr. Emily Rodriguez',
    procedure: 'Cholecystectomy',
    date: '2024-01-17',
    time: '2:00 PM',
    status: 'completed',
    duration: 180, // minutes
    operatingRoom: 'OR-2',
    assistants: ['Dr. David Wilson', 'Nurse Jennifer Adams'],
    anesthesiologist: 'Dr. Lisa Wang'
  }
];

export const mockOperatingRooms = [
  {
    id: '1',
    roomNumber: 'OR-1',
    status: 'available',
    equipment: ['Laparoscope', 'Electrocautery', 'Ventilator'],
    capacity: 8,
    lastCleaning: '2024-01-17T06:00:00',
    nextMaintenance: '2024-01-20',
    roomName: 'Main OR 1',
    location: 'Block A - Floor 2',
    specialties: ['General Surgery', 'Orthopedic']
  },
  {
    id: '2',
    roomNumber: 'OR-2',
    status: 'occupied',
    equipment: ['Microscope', 'C-arm', 'Anesthesia Machine'],
    capacity: 6,
    lastCleaning: '2024-01-17T07:00:00',
    nextMaintenance: '2024-01-22',
    roomName: 'Main OR 2',
    location: 'Block A - Floor 2',
    specialties: ['Neurosurgery']
  }
];

export const mockSurgeryStats = {
  totalSurgeries: 145,
  completedSurgeries: 132,
  scheduledSurgeries: 10,
  cancelledSurgeries: 3,
  averageDuration: 165, // minutes
  successRate: 98.5,
  operatingRoomsAvailable: 3,
  totalOperatingRooms: 5,
  surgeryTypes: [
    { type: 'General Surgery', count: 45, percentage: 31.0 },
    { type: 'Orthopedic', count: 35, percentage: 24.1 },
    { type: 'Cardiac', count: 25, percentage: 17.2 },
    { type: 'Neurosurgery', count: 20, percentage: 13.8 },
    { type: 'Others', count: 20, percentage: 13.8 }
  ],
  // Additional fields expected by UI components
  activeORs: 4,
  totalORs: 6,
  averageTurnoverTime: 35,
  onTimeStartRate: 92,
  complicationRate: 1.2,
  surgeryByType: {
    cardiac: 25,
    neurological: 20,
    orthopedic: 35,
    general: 45,
    plastic: 10,
    pediatric: 10
  },
  monthlySurgeryVolume: [
    { month: 'Oct', surgeries: 120 },
    { month: 'Nov', surgeries: 135 },
    { month: 'Dec', surgeries: 140 },
    { month: 'Jan', surgeries: 145 }
  ],
  orUtilization: [
    { or: 'OR-1', utilization: 85 },
    { or: 'OR-2', utilization: 78 },
    { or: 'OR-3', utilization: 72 },
    { or: 'OR-4', utilization: 90 }
  ]
};

// Minimal placeholders used by UI; kept empty to avoid rendering when not needed
export const mockSurgicalEquipment: any[] = [];
export const mockSurgicalTeams: any[] = [];