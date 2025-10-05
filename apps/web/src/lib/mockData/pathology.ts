// Mock data for Pathology Management

export const mockPathologyTests = [
  {
    id: '1',
    testId: 'PATH-001',
    patientName: 'John Doe',
    testName: 'Complete Blood Count',
    category: 'Hematology',
    status: 'completed',
    requestDate: '2024-01-15',
    reportDate: '2024-01-16',
    doctor: 'Dr. Sarah Johnson',
    priority: 'routine'
  },
  {
    id: '2',
    testId: 'PATH-002',
    patientName: 'Jane Smith',
    testName: 'Liver Function Test',
    category: 'Biochemistry',
    status: 'pending',
    requestDate: '2024-01-14',
    reportDate: null,
    doctor: 'Dr. Michael Chen',
    priority: 'urgent'
  }
];

export const mockPathologyStats = {
  totalTests: 1250,
  completedTests: 1100,
  pendingTests: 120,
  urgentTests: 30,
  averageReportTime: 24, // hours
  testsByCategory: [
    { category: 'Hematology', count: 450, percentage: 36 },
    { category: 'Biochemistry', count: 380, percentage: 30.4 },
    { category: 'Microbiology', count: 280, percentage: 22.4 },
    { category: 'Histopathology', count: 140, percentage: 11.2 }
  ]
};