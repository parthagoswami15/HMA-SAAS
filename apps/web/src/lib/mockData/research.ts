// Mock data for Medical Research & Clinical Trials

export const mockClinicalTrials = [
  {
    id: '1',
    trialId: 'TRIAL-2024-001',
    title: 'Phase II Study of Novel Cardiac Drug',
    phase: 'phase_ii',
    status: 'recruiting',
    type: 'interventional',
    investigator: 'Dr. Sarah Johnson',
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    targetEnrollment: 200,
    currentEnrollment: 45,
    description: 'A randomized controlled trial to evaluate the efficacy of a novel cardiac medication',
    eligibilityCriteria: ['Age 18-75', 'Diagnosed heart failure', 'No major comorbidities'],
    primaryOutcome: 'Reduction in cardiac events at 12 months',
    secondaryOutcomes: ['Quality of life improvement', 'Biomarker changes'],
    sponsor: 'CardioPharm Inc.',
    budget: 5000000,
    sites: ['Mumbai Hospital', 'Delhi Medical Center'],
    ethicsApprovalDate: '2023-12-15',
    regulatoryApprovalDate: '2023-12-20'
  },
  {
    id: '2',
    trialId: 'TRIAL-2024-002',
    title: 'Observational Study of Diabetes Management',
    phase: 'na',
    status: 'active',
    type: 'observational',
    investigator: 'Dr. Michael Chen',
    startDate: '2023-06-01',
    endDate: '2024-06-01',
    targetEnrollment: 500,
    currentEnrollment: 425,
    description: 'Long-term observational study of diabetes management strategies',
    eligibilityCriteria: ['Type 2 diabetes diagnosis', 'Age 35-70', 'On stable medication'],
    primaryOutcome: 'HbA1c levels over 12 months',
    secondaryOutcomes: ['Weight changes', 'Medication adherence'],
    sponsor: 'National Health Institute',
    budget: 2000000,
    sites: ['Chennai Research Center', 'Bangalore Clinic'],
    ethicsApprovalDate: '2023-04-10',
    regulatoryApprovalDate: '2023-04-15'
  }
];

export const mockStudyProtocols = [
  {
    id: '1',
    protocolId: 'PROT-2024-001',
    trialId: 'TRIAL-2024-001',
    version: '2.1',
    title: 'Cardiac Drug Study Protocol',
    lastModified: '2024-01-10',
    status: 'approved',
    approvedBy: 'Ethics Committee',
    approvalDate: '2024-01-12',
    sections: [
      { title: 'Study Objectives', completed: true },
      { title: 'Study Design', completed: true },
      { title: 'Patient Population', completed: true },
      { title: 'Treatment Plan', completed: false },
      { title: 'Safety Monitoring', completed: false }
    ],
    amendments: [
      { date: '2024-01-05', description: 'Updated inclusion criteria' },
      { date: '2023-12-20', description: 'Added secondary endpoints' }
    ]
  }
];

export const mockPatientRecruitment = [
  {
    id: '1',
    trialId: 'TRIAL-2024-001',
    patientId: 'P001',
    patientName: 'John Doe',
    screeningDate: '2024-01-15',
    status: 'enrolled',
    eligibilityScore: 95,
    consentDate: '2024-01-16',
    enrollmentDate: '2024-01-17',
    randomizationDate: '2024-01-18',
    studyArm: 'Treatment Group A',
    site: 'Mumbai Hospital',
    investigator: 'Dr. Sarah Johnson'
  },
  {
    id: '2',
    trialId: 'TRIAL-2024-001',
    patientId: 'P002',
    patientName: 'Jane Smith',
    screeningDate: '2024-01-14',
    status: 'screen_failed',
    eligibilityScore: 65,
    consentDate: null,
    enrollmentDate: null,
    randomizationDate: null,
    studyArm: null,
    site: 'Delhi Medical Center',
    investigator: 'Dr. Michael Chen'
  }
];

export const mockDataCollection = [
  {
    id: '1',
    collectionId: 'DC-2024-001',
    trialId: 'TRIAL-2024-001',
    patientId: 'P001',
    visitType: 'baseline',
    scheduledDate: '2024-01-17',
    actualDate: '2024-01-17',
    status: 'completed',
    formsRequired: 12,
    formsCompleted: 12,
    qualityScore: 98,
    dataPoints: [
      { field: 'Blood Pressure', value: '120/80', unit: 'mmHg' },
      { field: 'Heart Rate', value: '72', unit: 'bpm' },
      { field: 'Weight', value: '70', unit: 'kg' }
    ],
    lastModified: '2024-01-17T15:30:00',
    reviewer: 'Dr. Data Reviewer',
    reviewDate: '2024-01-18'
  }
];

export const mockRegulatoryCompliance = [
  {
    id: '1',
    trialId: 'TRIAL-2024-001',
    requirementType: 'ethics_approval',
    status: 'submitted',
    submissionDate: '2024-01-10',
    reviewDate: null,
    dueDate: '2024-02-10',
    reviewer: null,
    documents: ['ethics_application.pdf', 'protocol_v2.1.pdf'],
    comments: null
  },
  {
    id: '2',
    trialId: 'TRIAL-2024-002',
    requirementType: 'regulatory_filing',
    status: 'approved',
    submissionDate: '2023-11-15',
    reviewDate: '2023-12-01',
    dueDate: '2023-12-31',
    reviewer: 'Regulatory Authority',
    documents: ['cta_application.pdf', 'investigator_brochure.pdf'],
    comments: 'Approved with minor conditions'
  }
];

export const mockResearchProjects = [
  {
    id: '1',
    projectId: 'PROJ-2024-001',
    title: 'AI-Powered Diagnostic Tools in Radiology',
    status: 'active',
    principalInvestigator: 'Dr. Tech Researcher',
    startDate: '2023-09-01',
    endDate: '2025-08-31',
    budget: 3000000,
    fundingSource: 'Government Grant',
    department: 'Radiology',
    collaborators: ['Tech University', 'AI Research Lab'],
    objectives: [
      'Develop machine learning algorithms for image analysis',
      'Validate AI tools in clinical setting',
      'Train radiologists on new technology'
    ],
    milestones: [
      { milestone: 'Algorithm Development', completed: true, date: '2024-01-15' },
      { milestone: 'Clinical Validation', completed: false, date: '2024-06-30' },
      { milestone: 'Training Program', completed: false, date: '2024-12-31' }
    ],
    publicationsPlan: 2,
    publicationsCompleted: 0
  }
];

export const mockEthicsApprovals = [
  {
    id: '1',
    trialId: 'TRIAL-2024-001',
    committeeType: 'institutional_ethics',
    submissionDate: '2023-11-20',
    reviewDate: '2023-12-15',
    approvalDate: '2023-12-15',
    status: 'approved',
    conditions: ['Submit quarterly safety reports', 'Notify of protocol amendments'],
    validUntil: '2024-12-15',
    renewalRequired: true,
    chairperson: 'Dr. Ethics Chair'
  }
];

export const mockTrialParticipants = [
  {
    id: '1',
    participantId: 'P001',
    trialId: 'TRIAL-2024-001',
    patientName: 'John Doe',
    age: 65,
    gender: 'male',
    enrollmentDate: '2024-01-17',
    status: 'active',
    studyArm: 'Treatment Group A',
    completedVisits: 3,
    scheduledVisits: 8,
    adherenceRate: 95,
    lastVisitDate: '2024-01-15',
    nextVisitDate: '2024-02-15',
    adverseEvents: 0,
    consentStatus: 'signed',
    withdrawalReason: null
  }
];

export const mockAdverseEvents = [
  {
    id: '1',
    eventId: 'AE-2024-001',
    trialId: 'TRIAL-2024-001',
    participantId: 'P001',
    eventType: 'mild_nausea',
    severity: 'mild',
    startDate: '2024-01-20',
    endDate: '2024-01-22',
    ongoing: false,
    serious: false,
    related: 'possibly',
    action: 'no_action',
    outcome: 'resolved',
    reportedBy: 'Dr. Sarah Johnson',
    reportDate: '2024-01-20',
    description: 'Patient reported mild nausea after taking study medication',
    treatment: 'Symptomatic treatment with antacid'
  }
];

export const mockStudyVisits = [
  {
    id: '1',
    visitId: 'V-2024-001',
    trialId: 'TRIAL-2024-001',
    participantId: 'P001',
    visitType: 'screening',
    scheduledDate: '2024-01-15',
    actualDate: '2024-01-15',
    status: 'completed',
    windowStart: '2024-01-13',
    windowEnd: '2024-01-17',
    procedures: ['Vital Signs', 'ECG', 'Blood Draw', 'Consent'],
    completedProcedures: ['Vital Signs', 'ECG', 'Blood Draw', 'Consent'],
    notes: 'Patient completed all procedures without issues'
  }
];

export const mockConsentForms = [
  {
    id: '1',
    formId: 'ICF-2024-001',
    trialId: 'TRIAL-2024-001',
    participantId: 'P001',
    version: '2.0',
    language: 'English',
    consentDate: '2024-01-16',
    witnessName: 'Nurse Mary Wilson',
    status: 'signed',
    reconsent: false,
    withdrawalDate: null
  }
];

export const mockProtocolDeviations = [
  {
    id: '1',
    deviationId: 'PD-2024-001',
    trialId: 'TRIAL-2024-001',
    participantId: 'P001',
    type: 'visit_window',
    severity: 'minor',
    description: 'Visit conducted 2 days outside the visit window',
    reportedDate: '2024-01-20',
    reportedBy: 'Study Coordinator',
    rootCause: 'Patient scheduling conflict',
    correctiveAction: 'Rescheduled future visits to maintain protocol compliance',
    status: 'resolved'
  }
];

export const mockResearchStats = {
  totalTrials: 15,
  activeTrials: 8,
  completedTrials: 5,
  suspendedTrials: 2,
  totalParticipants: 1250,
  enrolledParticipants: 980,
  screenFailures: 270,
  completedParticipants: 750,
  adverseEventsReported: 45,
  seriousAdverseEvents: 3,
  protocolDeviations: 28,
  majorDeviations: 5,
  trialsByPhase: [
    { phase: 'Phase I', count: 3, percentage: 20 },
    { phase: 'Phase II', count: 6, percentage: 40 },
    { phase: 'Phase III', count: 4, percentage: 26.7 },
    { phase: 'Phase IV', count: 2, percentage: 13.3 }
  ],
  trialsByStatus: [
    { status: 'Active', count: 8, percentage: 53.3 },
    { status: 'Recruiting', count: 3, percentage: 20 },
    { status: 'Completed', count: 3, percentage: 20 },
    { status: 'Suspended', count: 1, percentage: 6.7 }
  ],
  enrollmentTrends: [
    { month: 'Oct', enrollment: 85 },
    { month: 'Nov', enrollment: 92 },
    { month: 'Dec', enrollment: 78 },
    { month: 'Jan', enrollment: 105 }
  ],
  complianceMetrics: {
    protocolCompliance: 94.5,
    dataQuality: 97.2,
    timelyReporting: 89.3,
    documentCompleteness: 96.8
  }
};