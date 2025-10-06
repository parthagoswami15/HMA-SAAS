import {
  MedicalRecord,
  VitalSigns,
  PhysicalExamination,
  Allergy,
  Medication,
  Diagnosis,
  Prescription,
  PrescribedMedication,
  Referral,
  MedicalDocument,
  LabResult,
  TestResult,
  MedicalHistory,
  ChronicCondition,
  PastIllness,
  SurgicalHistory,
  Hospitalization,
  FamilyHistoryItem,
  SocialHistory,
  Immunization,
  ObGynHistory,
  MedicalRecordStats,
  DigitalSignature
} from '../../types/medical';
import { generateId } from '../utils';
import { mockPatients } from './patients';
import { mockStaff } from './staff';
// Mock Vital Signs
export const mockVitalSigns: VitalSigns[] = [
  {
    id: generateId(),
    recordedAt: new Date('2024-12-05T09:30:00'),
    recordedBy: 'Nurse Mary',
    temperature: 37.2,
    temperatureUnit: 'C',
    bloodPressure: {
      systolic: 140,
      diastolic: 90,
      unit: 'mmHg'
    },
    heartRate: 82,
    respiratoryRate: 18,
    oxygenSaturation: 98,
    height: 175,
    weight: 70,
    bmi: 22.9,
    painScore: 6,
    notes: 'Patient reports chest discomfort'
  },
  {
    id: generateId(),
    recordedAt: new Date('2024-12-05T14:00:00'),
    recordedBy: 'Emergency Nurse',
    temperature: 39.5,
    temperatureUnit: 'C',
    bloodPressure: {
      systolic: 160,
      diastolic: 100,
      unit: 'mmHg'
    },
    heartRate: 95,
    respiratoryRate: 22,
    oxygenSaturation: 96,
    height: 160,
    weight: 65,
    bmi: 25.4,
    painScore: 8,
    notes: 'High fever, patient appears distressed'
  }
];

// Mock Physical Examinations
export const mockPhysicalExaminations: PhysicalExamination[] = [
  {
    id: generateId(),
    generalAppearance: 'Well-developed, well-nourished male in mild distress',
    heent: 'Normocephalic, atraumatic. PERRLA. No lymphadenopathy.',
    cardiovascular: 'Regular rate and rhythm. No murmurs, rubs, or gallops.',
    respiratory: 'Clear to auscultation bilaterally. No wheezes or rales.',
    gastrointestinal: 'Soft, non-tender, non-distended. Normal bowel sounds.',
    genitourinary: 'Normal external genitalia. No costovertebral angle tenderness.',
    musculoskeletal: 'Full range of motion. No deformities.',
    neurological: 'Alert and oriented x3. Cranial nerves II-XII intact.',
    skin: 'Warm, dry, intact. No rashes or lesions.',
    psychiatric: 'Appropriate mood and affect.'
  }
];

// Mock Allergies
export const mockAllergies: Allergy[] = [
  {
    id: generateId(),
    allergen: 'Penicillin',
    allergenType: 'medication' as AllergenType,
    reaction: 'Hives, difficulty breathing',
    severity: 'severe' as AllergySeverity,
    onsetDate: new Date('2020-03-15'),
    notes: 'Patient developed severe allergic reaction during antibiotic treatment',
    isActive: true
  },
  {
    id: generateId(),
    allergen: 'Shellfish',
    allergenType: 'food' as AllergenType,
    reaction: 'Swelling of lips and throat',
    severity: 'moderate' as AllergySeverity,
    onsetDate: new Date('2018-07-22'),
    notes: 'Reaction occurred after eating shrimp',
    isActive: true
  }
];

// Mock Medications
export const mockMedications: Medication[] = [
  {
    id: generateId(),
    medicationName: 'Aspirin',
    genericName: 'Acetylsalicylic acid',
    brandName: 'Bayer Aspirin',
    dosage: '75mg',
    frequency: 'Once daily',
    route: 'oral' as MedicationRoute,
    startDate: new Date('2024-01-15'),
    prescribedBy: 'Dr. Sarah Johnson',
    indication: 'Cardiovascular protection',
    instructions: 'Take with food to reduce stomach irritation',
    isActive: true,
    sideEffects: ['Stomach irritation', 'Bleeding risk'],
    interactions: ['Warfarin', 'Ibuprofen']
  },
  {
    id: generateId(),
    medicationName: 'Amlodipine',
    genericName: 'Amlodipine besylate',
    brandName: 'Norvasc',
    dosage: '5mg',
    frequency: 'Once daily',
    route: 'oral' as MedicationRoute,
    startDate: new Date('2024-02-01'),
    prescribedBy: 'Dr. Sarah Johnson',
    indication: 'Hypertension',
    instructions: 'Take at the same time each day',
    isActive: true,
    sideEffects: ['Ankle swelling', 'Dizziness'],
    interactions: ['Grapefruit juice']
  }
];

// Mock Diagnoses
export const mockDiagnoses: Diagnosis[] = [
  {
    id: generateId(),
    diagnosisCode: 'I20.9',
    diagnosisName: 'Angina pectoris, unspecified',
    diagnosisType: 'primary' as DiagnosisType,
    certainty: 'probable' as DiagnosisCertainty,
    onsetDate: new Date('2024-12-05'),
    status: 'active' as DiagnosisStatus,
    notes: 'Chest pain consistent with angina, ECG pending'
  },
  {
    id: generateId(),
    diagnosisCode: 'I10',
    diagnosisName: 'Essential hypertension',
    diagnosisType: 'secondary' as DiagnosisType,
    certainty: 'confirmed' as DiagnosisCertainty,
    onsetDate: new Date('2024-01-15'),
    status: 'chronic' as DiagnosisStatus,
    notes: 'Well-controlled with medication'
  }
];

// Mock Prescribed Medications
export const mockPrescribedMedications: PrescribedMedication[] = [
  {
    medicationId: generateId(),
    medicationName: 'Nitroglycerin',
    dosage: '0.4mg',
    quantity: 25,
    unit: 'tablets',
    frequency: 'As needed',
    duration: '1 month',
    instructions: 'Take sublingually for chest pain. May repeat every 5 minutes up to 3 doses.',
    cost: 450
  },
  {
    medicationId: generateId(),
    medicationName: 'Metoprolol',
    dosage: '50mg',
    quantity: 30,
    unit: 'tablets',
    frequency: 'Twice daily',
    duration: '1 month',
    instructions: 'Take with meals. Do not stop abruptly.',
    cost: 280
  }
];

// Mock Prescriptions
export const mockPrescriptions: Prescription[] = [
  {
    id: generateId(),
    prescriptionNumber: 'RX2024001',
    prescriptionDate: new Date('2024-12-05'),
    prescribedBy: 'Dr. Sarah Johnson',
    patientId: mockPatients[0].id,
    medications: mockPrescribedMedications,
    instructions: 'Follow medication schedule strictly. Return if symptoms worsen.',
    refills: 2,
    refillsRemaining: 2,
    expiryDate: new Date('2025-12-05'),
    status: 'pending' as PrescriptionStatus,
    pharmacyInstructions: 'Counsel patient on sublingual nitroglycerin use',
    substitutionAllowed: true,
    priority: 'urgent' as PrescriptionPriority
  }
];

// Mock Referrals
export const mockReferrals: Referral[] = [
  {
    id: generateId(),
    referralNumber: 'REF2024001',
    referralDate: new Date('2024-12-05'),
    referringDoctor: mockStaff[0],
    referredToDepartment: 'Cardiothoracic Surgery',
    referredToFacility: 'Advanced Cardiac Care Center',
    reason: 'Evaluation for coronary artery disease',
    urgency: 'urgent' as ReferralUrgency,
    clinicalSummary: 'Patient with chest pain, abnormal stress test, requires surgical evaluation',
    requestedServices: ['Coronary angiography', 'Surgical consultation'],
    status: 'pending' as ReferralStatus,
    appointmentBooked: false
  }
];

// Mock Digital Signatures
export const mockDigitalSignatures: DigitalSignature[] = [
  {
    id: generateId(),
    signedBy: 'Dr. Sarah Johnson',
    signedDate: new Date('2024-12-05T10:30:00'),
    signatureData: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    certificateInfo: {
      issuer: 'Hospital Digital Certificate Authority',
      validFrom: new Date('2024-01-01'),
      validTo: new Date('2025-12-31'),
      fingerprint: 'SHA256:1234567890abcdef'
    },
    isValid: true
  }
];

// Mock Medical Documents
export const mockMedicalDocuments: MedicalDocument[] = [
  {
    id: generateId(),
    documentId: 'DOC2024001',
    documentNumber: 'HMS-DOC-001',
    patientId: mockPatients[0].id,
    documentType: 'medical_report' as DocumentType,
    title: 'Cardiology Consultation Report',
    description: 'Initial cardiology evaluation for chest pain',
    fileName: 'cardiology_report_001.pdf',
    filePath: '/medical_documents/2024/12/cardiology_report_001.pdf',
    fileSize: 2457600,
    mimeType: 'application/pdf',
    documentDate: new Date('2024-12-05'),
    uploadedBy: 'Dr. Sarah Johnson',
    uploadedDate: new Date('2024-12-05T10:45:00'),
    relatedRecordId: 'REC001',
    isConfidential: true,
    accessLevel: 'restricted' as AccessLevel,
    encryptionStatus: 'encrypted' as EncryptionStatus,
    version: 1,
    isLatestVersion: true,
    requiresApproval: false,
    approvalStatus: 'approved' as ApprovalStatus,
    approvedBy: 'Dr. Sarah Johnson',
    approvedDate: new Date('2024-12-05T10:45:00'),
    digitalSignature: mockDigitalSignatures[0],
    tags: ['cardiology', 'chest pain', 'consultation'],
    category: 'Clinical Reports',
    keywords: ['angina', 'ECG', 'stress test'],
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-05'),
    createdBy: 'Dr. Sarah Johnson',
    updatedBy: 'Dr. Sarah Johnson'
  },
  {
    id: generateId(),
    documentId: 'DOC2024002',
    documentNumber: 'HMS-DOC-002',
    patientId: mockPatients[1].id,
    documentType: 'lab_result' as DocumentType,
    title: 'Complete Blood Count Results',
    description: 'CBC with differential and platelet count',
    fileName: 'cbc_results_002.pdf',
    filePath: '/medical_documents/2024/12/cbc_results_002.pdf',
    fileSize: 1024000,
    mimeType: 'application/pdf',
    documentDate: new Date('2024-12-05'),
    uploadedBy: 'Lab Technician',
    uploadedDate: new Date('2024-12-05T15:30:00'),
    relatedTestId: 'TEST001',
    isConfidential: false,
    accessLevel: 'public' as AccessLevel,
    encryptionStatus: 'not_encrypted' as EncryptionStatus,
    version: 1,
    isLatestVersion: true,
    requiresApproval: true,
    approvalStatus: 'approved' as ApprovalStatus,
    approvedBy: 'Dr. Michael Brown',
    approvedDate: new Date('2024-12-05T16:00:00'),
    tags: ['lab', 'blood test', 'CBC'],
    category: 'Laboratory Results',
    keywords: ['hemoglobin', 'white blood cells', 'platelets'],
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-05'),
    createdBy: 'Lab Technician',
    updatedBy: 'Lab Technician'
  }
];

// Mock Test Results
export const mockTestResults: TestResult[] = [
  {
    id: generateId(),
    parameterName: 'Hemoglobin',
    parameterCode: 'HGB',
    value: 12.5,
    unit: 'g/dL',
    referenceRange: '12.0-15.5',
    abnormalFlag: undefined,
    status: 'completed' as TestResultStatus
  },
  {
    id: generateId(),
    parameterName: 'White Blood Cell Count',
    parameterCode: 'WBC',
    value: 11.2,
    unit: '10³/µL',
    referenceRange: '4.5-11.0',
    abnormalFlag: 'high' as AbnormalFlag,
    status: 'completed' as TestResultStatus
  },
  {
    id: generateId(),
    parameterName: 'Platelet Count',
    parameterCode: 'PLT',
    value: 350,
    unit: '10³/µL',
    referenceRange: '150-400',
    abnormalFlag: undefined,
    status: 'completed' as TestResultStatus
  }
];

// Mock Lab Results
export const mockLabResults: LabResult[] = [
  {
    id: generateId(),
    resultId: 'LAB2024001',
    testOrderId: 'ORDER001',
    patientId: mockPatients[1].id,
    patient: mockPatients[1],
    orderedBy: mockStaff[1],
    testType: 'hematology' as LabTestType,
    testName: 'Complete Blood Count',
    testCode: 'CBC',
    sampleType: 'blood' as SampleType,
    sampleId: 'SAMPLE001',
    collectionDate: new Date('2024-12-05'),
    collectionTime: '08:30',
    collectedBy: 'Phlebotomist',
    receivedDate: new Date('2024-12-05'),
    results: mockTestResults,
    overallResult: 'Slight elevation in WBC count',
    interpretation: 'Mild leukocytosis possibly due to infection or inflammation',
    abnormalFlags: ['high' as AbnormalFlag],
    referenceRange: 'See individual parameters',
    units: 'Various',
    methodology: 'Automated cell counter',
    status: 'verified' as LabResultStatus,
    reportDate: new Date('2024-12-05'),
    reportedBy: 'Lab Technician',
    verifiedBy: 'Dr. Lab Director',
    verifiedDate: new Date('2024-12-05T16:00:00'),
    qualityFlags: [],
    remarks: 'Sample quality good, no interference detected',
    technicalNotes: 'Analyzed on Sysmex XN-1000',
    instrumentId: 'SYSMEX001',
    batchNumber: 'BATCH20241205001',
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-05'),
    createdBy: 'Lab System',
    updatedBy: 'Lab Technician'
  }
];

// Mock Chronic Conditions
export const mockChronicConditions: ChronicCondition[] = [
  {
    id: generateId(),
    condition: 'Essential Hypertension',
    icdCode: 'I10',
    diagnosisDate: new Date('2022-03-15'),
    status: 'controlled',
    medications: ['Amlodipine 5mg daily', 'Lisinopril 10mg daily'],
    notes: 'Well controlled with current medication regimen'
  },
  {
    id: generateId(),
    condition: 'Type 2 Diabetes Mellitus',
    icdCode: 'E11.9',
    diagnosisDate: new Date('2021-08-22'),
    status: 'active',
    medications: ['Metformin 1000mg twice daily', 'Glipizide 5mg daily'],
    notes: 'HbA1c target <7%, last value 6.8%'
  }
];

// Mock Past Illnesses
export const mockPastIllnesses: PastIllness[] = [
  {
    id: generateId(),
    illness: 'Pneumonia',
    diagnosisDate: new Date('2023-02-10'),
    resolvedDate: new Date('2023-02-28'),
    treatment: 'Antibiotics (Azithromycin) and supportive care',
    complications: 'None',
    notes: 'Community-acquired pneumonia, responded well to treatment'
  },
  {
    id: generateId(),
    illness: 'Appendicitis',
    diagnosisDate: new Date('2015-06-12'),
    resolvedDate: new Date('2015-06-15'),
    treatment: 'Laparoscopic appendectomy',
    complications: 'None',
    notes: 'Uncomplicated appendicitis, smooth recovery'
  }
];

// Mock Surgical History
export const mockSurgicalHistory: SurgicalHistory[] = [
  {
    id: generateId(),
    procedure: 'Laparoscopic Appendectomy',
    procedureDate: new Date('2015-06-12'),
    surgeon: 'Dr. General Surgeon',
    hospital: 'City General Hospital',
    complications: 'None',
    notes: 'Uneventful procedure, patient recovered well'
  },
  {
    id: generateId(),
    procedure: 'Arthroscopic Knee Surgery',
    procedureDate: new Date('2020-09-05'),
    surgeon: 'Dr. Orthopedic Surgeon',
    hospital: 'Sports Medicine Center',
    complications: 'Mild infection treated with antibiotics',
    notes: 'Meniscus repair, good functional outcome'
  }
];

// Mock Hospitalizations
export const mockHospitalizations: Hospitalization[] = [
  {
    id: generateId(),
    admissionDate: new Date('2023-02-10'),
    dischargeDate: new Date('2023-02-15'),
    hospital: 'City General Hospital',
    reason: 'Pneumonia',
    diagnosis: 'Community-acquired pneumonia',
    treatment: 'IV antibiotics, oxygen therapy',
    complications: 'None',
    notes: '5-day stay, good recovery'
  }
];

// Mock Family History
export const mockFamilyHistory: FamilyHistoryItem[] = [
  {
    id: generateId(),
    relationship: 'father' as FamilyRelationship,
    condition: 'Myocardial Infarction',
    ageAtDiagnosis: 58,
    ageAtDeath: 65,
    causeOfDeath: 'Cardiac arrest',
    isAlive: false,
    notes: 'Had multiple heart attacks, died from sudden cardiac death'
  },
  {
    id: generateId(),
    relationship: 'mother' as FamilyRelationship,
    condition: 'Type 2 Diabetes',
    ageAtDiagnosis: 52,
    isAlive: true,
    notes: 'Well controlled with medication and diet'
  },
  {
    id: generateId(),
    relationship: 'brother' as FamilyRelationship,
    condition: 'Hypertension',
    ageAtDiagnosis: 45,
    isAlive: true,
    notes: 'Recently diagnosed, on medication'
  }
];

// Mock Social History
export const mockSocialHistory: SocialHistory = {
  smokingStatus: 'former_smoker' as SmokingStatus,
  smokingHistory: {
    packsPerDay: 1,
    yearsSmoked: 15,
    quitDate: new Date('2020-01-01')
  },
  alcoholConsumption: 'moderate' as AlcoholConsumption,
  alcoholHistory: {
    drinksPerWeek: 5,
    typeOfAlcohol: ['beer', 'wine'],
    quitDate: undefined
  },
  drugUse: 'never' as DrugUse,
  occupation: 'Software Engineer',
  occupationalHazards: ['Prolonged sitting', 'Eye strain'],
  exerciseHabits: 'Regular jogging 3x/week, gym 2x/week',
  dietaryHabits: 'Balanced diet, low sodium',
  maritalStatus: 'married' as MaritalStatus,
  livingArrangement: 'Lives with spouse and two children',
  education: 'Master\'s degree',
  stressLevel: 6,
  supportSystem: 'Good family support, close friends'
};

// Mock Immunizations
export const mockImmunizations: Immunization[] = [
  {
    id: generateId(),
    vaccine: 'Influenza vaccine',
    vaccineCode: 'FLU',
    administeredDate: new Date('2024-10-15'),
    administeredBy: 'Nurse Mary',
    dosage: '0.5ml',
    site: 'left_arm' as InjectionSite,
    lotNumber: 'FLU2024001',
    manufacturer: 'Pfizer',
    expiryDate: new Date('2025-10-15'),
    reactions: [],
    nextDueDate: new Date('2025-10-15'),
    notes: 'Annual flu shot, no adverse reactions'
  },
  {
    id: generateId(),
    vaccine: 'COVID-19 vaccine (mRNA)',
    vaccineCode: 'COVID19',
    administeredDate: new Date('2024-05-20'),
    administeredBy: 'Pharmacist',
    dosage: '0.3ml',
    site: 'right_arm' as InjectionSite,
    lotNumber: 'COVID2024001',
    manufacturer: 'Pfizer-BioNTech',
    expiryDate: new Date('2025-05-20'),
    reactions: ['Mild soreness at injection site'],
    nextDueDate: new Date('2025-05-20'),
    notes: 'Updated booster shot'
  }
];

// Mock ObGyn History
export const mockObGynHistory: ObGynHistory = {
  menarche: 13,
  menopause: undefined,
  lmp: new Date('2024-11-15'),
  pregnancies: 2,
  livebirths: 2,
  abortions: 0,
  miscarriages: 0,
  contraceptiveHistory: [
    {
      method: 'Combined oral contraceptive pill',
      startDate: new Date('2018-01-01'),
      endDate: new Date('2020-12-31'),
      complications: []
    },
    {
      method: 'IUD (Copper)',
      startDate: new Date('2021-06-15'),
      endDate: undefined,
      complications: []
    }
  ],
  pap_smear_history: [
    {
      date: new Date('2024-03-15'),
      result: 'Normal',
      followUpRequired: false,
      nextDueDate: new Date('2027-03-15')
    },
    {
      date: new Date('2021-03-10'),
      result: 'Normal',
      followUpRequired: false,
      nextDueDate: new Date('2024-03-10')
    }
  ],
  mammography_history: [
    {
      date: new Date('2024-08-20'),
      result: 'Normal',
      biradsScore: 'BI-RADS 1',
      followUpRequired: false,
      nextDueDate: new Date('2026-08-20')
    }
  ],
  gynecologic_surgeries: []
};

// Mock Medical History
export const mockMedicalHistory: MedicalHistory[] = [
  {
    id: generateId(),
    historyId: 'HIST001',
    patientId: mockPatients[0].id,
    patient: mockPatients[0],
    chronicConditions: mockChronicConditions,
    pastIllnesses: mockPastIllnesses,
    surgicalHistory: mockSurgicalHistory,
    hospitalizations: mockHospitalizations,
    familyHistory: mockFamilyHistory,
    socialHistory: mockSocialHistory,
    immunizations: mockImmunizations,
    obGynHistory: undefined, // Not applicable for male patient
    lastUpdated: new Date('2024-12-05'),
    updatedBy: 'Dr. Sarah Johnson',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-05'),
    createdBy: 'Dr. Sarah Johnson',
    updatedBy: 'Dr. Sarah Johnson'
  },
  {
    id: generateId(),
    historyId: 'HIST002',
    patientId: mockPatients[1].id,
    patient: mockPatients[1],
    chronicConditions: [],
    pastIllnesses: [],
    surgicalHistory: [],
    hospitalizations: [],
    familyHistory: [],
    socialHistory: {
      smokingStatus: 'never_smoked' as SmokingStatus,
      alcoholConsumption: 'never' as AlcoholConsumption,
      drugUse: 'never' as DrugUse,
      occupation: 'Teacher',
      occupationalHazards: [],
      exerciseHabits: 'Yoga 2x/week, walking daily',
      dietaryHabits: 'Vegetarian diet',
      maritalStatus: 'single' as MaritalStatus,
      livingArrangement: 'Lives alone',
      education: 'Bachelor\'s degree',
      stressLevel: 3,
      supportSystem: 'Close family, good friends'
    },
    immunizations: mockImmunizations,
    obGynHistory: mockObGynHistory,
    lastUpdated: new Date('2024-12-05'),
    updatedBy: 'Dr. Michael Brown',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-12-05'),
    createdBy: 'Dr. Michael Brown',
    updatedBy: 'Dr. Michael Brown'
  }
];

// Mock Medical Records
export const mockMedicalRecords: MedicalRecord[] = [
  {
    id: generateId(),
    recordId: 'REC001',
    patientId: mockPatients[0].id,
    patient: mockPatients[0],
    doctorId: mockStaff[0].staffId,
    doctor: mockStaff[0],
    recordType: 'consultation' as MedicalRecordType,
    recordDate: new Date('2024-12-05'),
    appointmentId: 'APT001',
    
    // Clinical Information
    chiefComplaint: 'Chest pain for the past week',
    historyOfPresentIllness: 'Patient reports substernal chest pain, worse with exertion, relieved by rest. Associated with shortness of breath. No radiation to arms or jaw.',
    pastMedicalHistory: 'Hypertension, hyperlipidemia',
    familyHistory: 'Father died of MI at age 65, mother with diabetes',
    socialHistory: 'Former smoker (quit 4 years ago), moderate alcohol use',
    allergies: mockAllergies,
    medications: mockMedications,
    
    // Physical Examination
    vitalSigns: mockVitalSigns[0],
    physicalExamination: mockPhysicalExaminations[0],
    
    // Assessment and Plan
    assessment: 'Likely angina pectoris, rule out acute coronary syndrome',
    diagnosis: mockDiagnoses,
    treatmentPlan: 'Start antianginal therapy, order stress test, cardiology referral',
    prescriptions: mockPrescriptions,
    
    // Follow-up and Instructions
    followUpInstructions: 'Return immediately if chest pain worsens. Follow up in 1 week or after stress test.',
    followUpDate: new Date('2024-12-12'),
    referrals: mockReferrals,
    
    // Documentation
    clinicalNotes: 'Patient is a 55-year-old male with chest pain concerning for angina. Physical exam notable for elevated BP. ECG shows no acute changes. Will start medical therapy and pursue further cardiac evaluation.',
    additionalNotes: 'Patient counseled on chest pain warning signs and when to seek emergency care.',
    attachments: mockMedicalDocuments,
    
    // Status and Workflow
    status: 'approved' as MedicalRecordStatus,
    isConfidential: false,
    accessLevel: 'restricted' as AccessLevel,
    
    // Signatures and Approval
    doctorSignature: mockDigitalSignatures[0],
    isApproved: true,
    approvedBy: 'Dr. Sarah Johnson',
    approvedDate: new Date('2024-12-05T10:45:00'),
    
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-05'),
    createdBy: 'Dr. Sarah Johnson',
    updatedBy: 'Dr. Sarah Johnson'
  },
  {
    id: generateId(),
    recordId: 'REC002',
    patientId: mockPatients[1].id,
    patient: mockPatients[1],
    doctorId: mockStaff[1].staffId,
    doctor: mockStaff[1],
    recordType: 'emergency' as MedicalRecordType,
    recordDate: new Date('2024-12-05'),
    appointmentId: 'APT002',
    
    // Clinical Information
    chiefComplaint: 'Severe headache and fever',
    historyOfPresentIllness: 'Patient presents with severe headache for 2 days, associated with high fever, nausea, and photophobia. No recent travel or sick contacts.',
    pastMedicalHistory: 'No significant past medical history',
    familyHistory: 'Non-contributory',
    socialHistory: 'Non-smoker, non-drinker, works as teacher',
    allergies: [],
    medications: [],
    
    // Physical Examination
    vitalSigns: mockVitalSigns[1],
    physicalExamination: {
      id: generateId(),
      generalAppearance: 'Ill-appearing female in moderate distress',
      heent: 'Nuchal rigidity present. Photophobia noted.',
      cardiovascular: 'Tachycardic but regular rhythm',
      respiratory: 'Clear bilaterally',
      gastrointestinal: 'Soft, non-tender',
      genitourinary: 'Normal',
      musculoskeletal: 'Normal',
      neurological: 'Alert but irritable. Neck stiffness present.',
      skin: 'Warm, flushed',
      psychiatric: 'Anxious'
    },
    
    // Assessment and Plan
    assessment: 'Possible meningitis, rule out bacterial vs viral etiology',
    diagnosis: [
      {
        id: generateId(),
        diagnosisCode: 'G03.9',
        diagnosisName: 'Meningitis, unspecified',
        diagnosisType: 'primary' as DiagnosisType,
        certainty: 'suspected' as DiagnosisCertainty,
        onsetDate: new Date('2024-12-05'),
        status: 'active' as DiagnosisStatus,
        notes: 'Clinical presentation consistent with meningitis'
      }
    ],
    treatmentPlan: 'Immediate lumbar puncture, blood cultures, empirical antibiotics',
    prescriptions: [
      {
        id: generateId(),
        prescriptionNumber: 'RX2024002',
        prescriptionDate: new Date('2024-12-05'),
        prescribedBy: 'Dr. Michael Brown',
        patientId: mockPatients[1].id,
        medications: [
          {
            medicationId: generateId(),
            medicationName: 'Ceftriaxone',
            dosage: '2g',
            quantity: 1,
            unit: 'vial',
            frequency: 'Every 12 hours',
            duration: 'Until culture results',
            instructions: 'IV administration',
            cost: 850
          }
        ],
        instructions: 'Continue until CSF culture results available',
        refills: 0,
        refillsRemaining: 0,
        expiryDate: new Date('2024-12-15'),
        status: 'dispensed' as PrescriptionStatus,
        pharmacyInstructions: 'IV preparation required',
        substitutionAllowed: false,
        priority: 'emergency' as PrescriptionPriority
      }
    ],
    
    // Follow-up and Instructions
    followUpInstructions: 'Admit for observation and IV antibiotics. Monitor neurological status closely.',
    followUpDate: new Date('2024-12-06'),
    referrals: [
      {
        id: generateId(),
        referralNumber: 'REF2024002',
        referralDate: new Date('2024-12-05'),
        referringDoctor: mockStaff[1],
        referredToDepartment: 'Infectious Disease',
        reason: 'Suspected meningitis management',
        urgency: 'stat' as ReferralUrgency,
        clinicalSummary: 'Young female with fever, headache, and neck stiffness',
        requestedServices: ['ID consultation', 'Antibiotic management'],
        status: 'pending' as ReferralStatus,
        appointmentBooked: true,
        appointmentDate: new Date('2024-12-05T18:00:00')
      }
    ],
    
    // Documentation
    clinicalNotes: 'Emergency presentation of possible meningitis. Patient requires immediate evaluation and treatment. Lumbar puncture performed, awaiting results. Started empirical antibiotics.',
    additionalNotes: 'Family notified of admission. Patient consent obtained for procedures.',
    attachments: [],
    
    // Status and Workflow
    status: 'approved' as MedicalRecordStatus,
    isConfidential: false,
    accessLevel: 'public' as AccessLevel,
    
    // Signatures and Approval
    doctorSignature: {
      id: generateId(),
      signedBy: 'Dr. Michael Brown',
      signedDate: new Date('2024-12-05T16:30:00'),
      signatureData: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      certificateInfo: {
        issuer: 'Hospital Digital Certificate Authority',
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2025-12-31'),
        fingerprint: 'SHA256:abcdef1234567890'
      },
      isValid: true
    },
    isApproved: true,
    approvedBy: 'Dr. Michael Brown',
    approvedDate: new Date('2024-12-05T16:30:00'),
    
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-05'),
    createdBy: 'Dr. Michael Brown',
    updatedBy: 'Dr. Michael Brown'
  }
];

// Mock Medical Record Statistics
export const mockMedicalRecordStats: MedicalRecordStats = {
  totalRecords: 15847,
  recordsByType: {
    consultation: 8924,
    follow_up: 3456,
    emergency: 1234,
    admission: 567,
    discharge: 543,
    surgery: 234,
    procedure: 345,
    lab_result: 1876,
    radiology: 987,
    pathology: 123,
    vaccination: 456,
    physical_exam: 102
  },
  recordsByStatus: {
    draft: 45,
    pending_review: 123,
    reviewed: 234,
    approved: 14987,
    amended: 345,
    archived: 113
  },
  recordsByDoctor: [
    {
      doctorId: 'STF001',
      doctorName: 'Dr. Sarah Johnson',
      recordCount: 2456
    },
    {
      doctorId: 'STF002',
      doctorName: 'Dr. Michael Brown',
      recordCount: 2134
    },
    {
      doctorId: 'STF003',
      doctorName: 'Dr. Priya Patel',
      recordCount: 1876
    }
  ],
  recentActivity: [
    { date: '2024-12-01', recordsCreated: 45, recordsUpdated: 23 },
    { date: '2024-12-02', recordsCreated: 52, recordsUpdated: 31 },
    { date: '2024-12-03', recordsCreated: 38, recordsUpdated: 19 },
    { date: '2024-12-04', recordsCreated: 61, recordsUpdated: 28 },
    { date: '2024-12-05', recordsCreated: 43, recordsUpdated: 15 }
  ],
  commonDiagnoses: [
    {
      diagnosis: 'Essential Hypertension',
      icdCode: 'I10',
      count: 1234
    },
    {
      diagnosis: 'Type 2 Diabetes Mellitus',
      icdCode: 'E11.9',
      count: 987
    },
    {
      diagnosis: 'Acute Upper Respiratory Infection',
      icdCode: 'J06.9',
      count: 856
    },
    {
      diagnosis: 'Hyperlipidemia',
      icdCode: 'E78.5',
      count: 743
    },
    {
      diagnosis: 'Angina Pectoris',
      icdCode: 'I20.9',
      count: 567
    }
  ],
  prescriptionTrends: [
    {
      medication: 'Amlodipine',
      prescriptionCount: 1456,
      trend: 15
    },
    {
      medication: 'Metformin',
      prescriptionCount: 1234,
      trend: 8
    },
    {
      medication: 'Lisinopril',
      prescriptionCount: 1098,
      trend: 12
    },
    {
      medication: 'Aspirin',
      prescriptionCount: 987,
      trend: -3
    },
    {
      medication: 'Simvastatin',
      prescriptionCount: 876,
      trend: 7
    }
  ]
};