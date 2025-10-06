import { 
  Invoice,
  Payment,
  InsuranceClaim,
  PatientInsurance as InsurancePolicy,
  InsuranceProvider,
  BillingStats,
  InvoiceItem,
  PaymentMethod,
  InvoiceStatus,
  PaymentStatus,
  ClaimStatus,
  InsuranceType,
  ProviderStatus,
  Relationship,
  VerificationStatus,
  CoverageLevel,
  ServiceClaimStatus
} from '../../types/billing';
import { mockPatients } from './patients';
import { mockStaff } from './staff';
import { generateId } from '../utils';

// Mock Insurance Providers
export const mockInsuranceProviders: InsuranceProvider[] = [
  {
    id: generateId(),
    insuranceId: 'INS001',
    providerName: 'Star Health Insurance',
    providerType: 'health_insurance' as InsuranceType,
    contactInfo: {
      address: { street: '1st Floor, Star House', city: 'Mumbai', state: 'Maharashtra', postalCode: '400001', country: 'India' },
      phone: '+91-1800-123-4567',
      email: 'claims@starhealth.in',
      website: 'https://starhealth.in'
    },
    taxId: 'STARHEALTH123',
    paymentTerms: 'Net 30',
    paymentMethods: ['bank_transfer' as PaymentMethod, 'check' as PaymentMethod],
    clearinghouseRequired: true,
    electronicSubmission: true,
    submissionFormat: 'edi_837',
    coverageTypes: ['inpatient', 'outpatient', 'emergency'],
    isActive: true,
    status: 'active' as ProviderStatus,
    averageProcessingTime: 7,
    averageApprovalRate: 85,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    insuranceId: 'INS002',
    providerName: 'ICICI Lombard General Insurance',
    providerType: 'general_insurance' as InsuranceType,
    contactInfo: {
      address: { street: 'ICICI Lombard House, 414, Veer Savarkar Marg', city: 'Mumbai', state: 'Maharashtra', postalCode: '400025', country: 'India' },
      phone: '+91-1800-266-7766',
      email: 'health@icicilombard.com',
      website: 'https://icicilombard.com'
    },
    taxId: 'ICICI123',
    paymentTerms: 'Net 45',
    paymentMethods: ['bank_transfer' as PaymentMethod],
    clearinghouseRequired: true,
    electronicSubmission: true,
    submissionFormat: 'cms_1500',
    coverageTypes: ['inpatient', 'outpatient'],
    isActive: true,
    status: 'active' as ProviderStatus,
    averageProcessingTime: 9,
    averageApprovalRate: 78,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

// Mock Invoices
export const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceId: 'INV001',
    invoiceNumber: 'INV-2024-001',
    patientId: mockPatients[0].id,
    patient: mockPatients[0],
    invoiceDate: new Date('2024-01-15'),
    dueDate: new Date('2024-02-15'),
    issueDate: new Date('2024-01-15'),
    billToAddress: mockPatients[0].address,
    items: [
        { id: '1', itemCode: 'C001', description: 'Consultation Fee', itemType: 'consultation', category: 'Doctor Fees', quantity: 1, unitPrice: 1500, totalPrice: 1500, taxRate: 0, taxAmount: 0, discountRate: 0, discountAmount: 0, serviceDate: new Date('2024-01-15'), isInsuranceCovered: true, insuranceCoverage: 1200, patientShare: 300, notes: '' },
        { id: '2', itemCode: 'L001', description: 'Blood Test', itemType: 'laboratory', category: 'Lab Tests', quantity: 1, unitPrice: 2500, totalPrice: 2500, taxRate: 0, taxAmount: 0, discountRate: 0, discountAmount: 0, serviceDate: new Date('2024-01-15'), isInsuranceCovered: true, insuranceCoverage: 2000, patientShare: 500, notes: '' },
    ],
    subtotal: 4000,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 4000,
    paidAmount: 3700,
    balanceAmount: 300,
    status: 'partially_paid' as InvoiceStatus,
    paymentStatus: 'partial' as PaymentStatus,
    priority: 'normal',
    payments: [],
    paymentTerms: 'Net 30',
    lateFeeApplied: false,
    isInsuranceBilled: true,
    insuranceAmount: 3200,
    patientResponsibility: 800,
    generatedBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

// Mock Payments
export const mockPayments: Payment[] = [
  {
    id: '1',
    paymentId: 'PAY001',
    paymentNumber: 'PAY-2024-001',
    invoiceId: mockInvoices[0].id,
    invoice: mockInvoices[0],
    patientId: mockPatients[0].id,
    patient: mockPatients[0],
    paymentDate: new Date('2024-01-20'),
    amount: 3700,
    currency: 'INR',
    paymentMethod: 'credit_card' as PaymentMethod,
    paymentType: 'partial_payment',
    status: 'completed',
    processingStatus: 'settled',
    isReconciled: true,
    refundable: false,
    receiptGenerated: true,
    processedBy: 'system',
    processedDate: new Date('2024-01-20'),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

// Mock Insurance Claims
export const mockInsuranceClaims: InsuranceClaim[] = [
  {
    id: '1',
    claimId: 'CLM001',
    claimNumber: 'CLM-2024-001',
    patientId: mockPatients[0].id,
    patient: mockPatients[0],
    insuranceId: mockInsuranceProviders[0].id,
    insurance: mockInsuranceProviders[0],
    claimDate: new Date('2024-01-16'),
    serviceDate: new Date('2024-01-15'),
    services: [
        { id: '1', serviceCode: 'C001', description: 'Consultation Fee', serviceDate: new Date('2024-01-15'), providerId: mockStaff[0].id, providerName: `${mockStaff[0].firstName} ${mockStaff[0].lastName}`, cptCode: '99213', units: 1, chargedAmount: 1500, allowedAmount: 1200, paidAmount: 1200, deductible: 0, copay: 0, coinsurance: 0, status: 'approved' as ServiceClaimStatus },
    ],
    diagnosis: [
        { id: '1', icdCode: 'I10', description: 'Essential (primary) hypertension', isPrimary: true }
    ],
    totalAmount: 1500,
    claimedAmount: 1500,
    approvedAmount: 1200,
    deniedAmount: 300,
    patientResponsibility: 300,
    status: 'approved' as ClaimStatus,
    priority: 'routine',
    submittedBy: 'system',
    paymentReceived: true,
    paymentAmount: 1200,
    paymentDate: new Date('2024-01-25'),
    eobReceived: true,
    resubmissionCount: 0,
    correspondences: [],
    appealable: false,
    appealed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

// Mock Insurance Policies
export const mockInsurancePolicies: InsurancePolicy[] = [
  {
    id: '1',
    patientInsuranceId: 'PI001',
    patientId: mockPatients[0].id,
    patient: mockPatients[0],
    insuranceId: mockInsuranceProviders[0].id,
    insurance: mockInsuranceProviders[0],
    policyNumber: 'POL-123456',
    effectiveDate: new Date('2024-01-01'),
    terminationDate: new Date('2024-12-31'),
    coverageLevel: 'family' as CoverageLevel,
    subscriberId: mockPatients[0].patientId,
    subscriberName: `${mockPatients[0].firstName} ${mockPatients[0].lastName}`,
    relationshipToPatient: 'self' as Relationship,
    subscriberDateOfBirth: mockPatients[0].dateOfBirth,
    subscriberGender: 'Male',
    deductible: 5000,
    deductibleMet: 1200,
    outOfPocketMax: 20000,
    outOfPocketMet: 1200,
    copay: 100,
    coinsurance: 20,
    requiresAuthorization: false,
    isPrimary: true,
    priority: 1,
    isActive: true,
    verificationStatus: 'verified' as VerificationStatus,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

// Mock Billing Stats
export const mockBillingStats: BillingStats = {
  totalRevenue: 2500000,
  totalOutstanding: 125000,
  totalCollected: 2375000,
  totalWriteOffs: 50000,
  currentPeriodRevenue: 450000,
  previousPeriodRevenue: 420000,
  revenueGrowth: 7.14,
  collectionRate: 95,
  averageCollectionTime: 15,
  accountsReceivableAging: [],
  totalInvoices: 100,
  paidInvoices: 95,
  unpaidInvoices: 5,
  overdueInvoices: 2,
  totalPayments: 150,
  averagePaymentAmount: 15833,
  paymentMethodDistribution: { 'credit_card': 100, 'cash': 50 },
  totalClaims: 50,
  approvedClaims: 45,
  deniedClaims: 5,
  pendingClaims: 0,
  averageClaimAmount: 18500,
  insuranceCollectionRate: 90,
  topPayingPatients: [],
  topRevenueServices: [],
  topInsuranceProviders: [],
  monthlyRevenueTrends: [],
  dailyCollections: [],
};
