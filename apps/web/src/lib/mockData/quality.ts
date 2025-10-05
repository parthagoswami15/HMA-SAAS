// Mock data for Quality Assurance & Compliance

export const mockAudits = [
  {
    id: '1',
    auditType: 'Internal Quality Audit',
    department: 'Cardiology',
    auditor: 'Dr. Sarah Johnson',
    scheduledDate: '2024-01-20',
    completedDate: '2024-01-22',
    status: 'completed',
    score: 92,
    duration: 3,
    scope: 'Review of patient care protocols and documentation standards',
    findings: [
      { finding: 'Documentation gaps in patient records', severity: 'medium' },
      { finding: 'Equipment calibration overdue', severity: 'low' }
    ]
  },
  {
    id: '2',
    auditType: 'Regulatory Compliance Audit',
    department: 'Laboratory',
    auditor: 'Quality Team',
    scheduledDate: '2024-01-25',
    completedDate: null,
    status: 'in_progress',
    score: null,
    duration: 5,
    scope: 'Assessment of laboratory quality control procedures',
    findings: []
  }
];

export const mockComplianceItems = [
  {
    id: '1',
    title: 'HIPAA Privacy Compliance',
    category: 'Data Protection',
    status: 'compliant',
    complianceScore: 95,
    lastReviewDate: '2024-01-15',
    nextReviewDate: '2024-04-15',
    responsiblePerson: 'IT Security Manager',
    priority: 'high',
    description: 'Ensuring patient data privacy and security measures are in place'
  },
  {
    id: '2',
    title: 'Medical Device Safety',
    category: 'Equipment Safety',
    status: 'non_compliant',
    complianceScore: 65,
    lastReviewDate: '2024-01-10',
    nextReviewDate: '2024-02-10',
    responsiblePerson: 'Biomedical Engineer',
    priority: 'critical',
    description: 'Regular inspection and maintenance of medical devices'
  }
];

export const mockAccreditations = [
  {
    id: '1',
    name: 'NABH Hospital Accreditation',
    issuingBody: 'National Accreditation Board for Hospitals',
    status: 'active',
    issueDate: '2023-06-15',
    expiryDate: '2026-06-15',
    renewalDue: '2026-03-15',
    certificate: 'NABH-2023-001',
    scope: 'Full hospital accreditation covering all departments'
  },
  {
    id: '2',
    name: 'ISO 9001:2015 Quality Management',
    issuingBody: 'Bureau Veritas',
    status: 'active',
    issueDate: '2023-04-20',
    expiryDate: '2026-04-20',
    renewalDue: '2026-01-20',
    certificate: 'ISO-QMS-2023-002',
    scope: 'Quality management system for healthcare services'
  }
];

export const mockIncidents = [
  {
    id: '1',
    incidentType: 'Patient Safety',
    reportedBy: 'Nurse Mary Wilson',
    reportDate: '2024-01-16',
    description: 'Patient fall in Room 305',
    severity: 'medium',
    status: 'investigating',
    department: 'General Ward',
    assignedTo: 'Safety Officer',
    correctiveActions: ['Install additional bed rails', 'Review patient mobility assessment']
  },
  {
    id: '2',
    incidentType: 'Equipment Failure',
    reportedBy: 'Dr. Michael Chen',
    reportDate: '2024-01-14',
    description: 'MRI scanner malfunction during patient scan',
    severity: 'high',
    status: 'resolved',
    department: 'Radiology',
    assignedTo: 'Biomedical Engineer',
    correctiveActions: ['Emergency maintenance completed', 'Preventive maintenance schedule updated']
  }
];

export const mockQualityStats = {
  overallScore: 87,
  completedAudits: 24,
  pendingAudits: 6,
  complianceRate: 89,
  activeIncidents: 8,
  resolvedIncidents: 142,
  accreditationsActive: 5,
  accreditationsExpiring: 1,
  auditsByType: [
    { type: 'Internal Quality', count: 15, percentage: 50 },
    { type: 'Regulatory Compliance', count: 8, percentage: 26.7 },
    { type: 'Safety Audit', count: 7, percentage: 23.3 }
  ],
  incidentsByType: [
    { type: 'Patient Safety', count: 45, percentage: 30 },
    { type: 'Equipment Failure', count: 35, percentage: 23.3 },
    { type: 'Medication Error', count: 30, percentage: 20 },
    { type: 'Documentation', count: 25, percentage: 16.7 },
    { type: 'Others', count: 15, percentage: 10 }
  ],
  complianceTrends: [
    { month: 'Oct', score: 85 },
    { month: 'Nov', score: 87 },
    { month: 'Dec', score: 89 },
    { month: 'Jan', score: 87 }
  ]
};