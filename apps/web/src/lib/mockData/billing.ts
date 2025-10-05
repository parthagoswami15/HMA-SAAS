// Mock data for Billing & Insurance Management

import { 
  Invoice,
  Payment,
  InsuranceClaim,
  InsurancePolicy,
  InsuranceProvider,
  BillingStats,
  BillingFilters
} from '../../types/billing';

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    patientId: '1',
    patient: {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1985-05-15',
      phone: '+91-9876543210',
      email: 'john.doe@email.com'
    },
    amount: 15000,
    paidAmount: 12000,
    balanceAmount: 3000,
    status: 'partially_paid',
    issueDate: '2024-01-15',
    dueDate: '2024-02-15',
    services: [
      { description: 'Consultation Fee', quantity: 1, rate: 1500, amount: 1500 },
      { description: 'Blood Test', quantity: 1, rate: 2500, amount: 2500 },
      { description: 'X-Ray', quantity: 1, rate: 1000, amount: 1000 },
      { description: 'MRI Scan', quantity: 1, rate: 10000, amount: 10000 }
    ],
    paymentMethod: 'card',
    notes: 'Regular checkup and diagnostic tests'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    patientId: '2',
    patient: {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: '1990-08-22',
      phone: '+91-9876543211',
      email: 'jane.smith@email.com'
    },
    amount: 8500,
    paidAmount: 8500,
    balanceAmount: 0,
    status: 'paid',
    issueDate: '2024-01-14',
    dueDate: '2024-02-14',
    services: [
      { description: 'Emergency Consultation', quantity: 1, rate: 2000, amount: 2000 },
      { description: 'CT Scan', quantity: 1, rate: 6500, amount: 6500 }
    ],
    paymentMethod: 'cash',
    notes: 'Emergency visit'
  }
];

export const mockPayments: Payment[] = [
  {
    id: '1',
    paymentId: 'PAY-001',
    invoiceId: '1',
    amount: 12000,
    paymentDate: '2024-01-20',
    paymentMethod: 'card',
    status: 'completed',
    transactionId: 'TXN-001',
    notes: 'Partial payment via credit card'
  },
  {
    id: '2',
    paymentId: 'PAY-002',
    invoiceId: '2',
    amount: 8500,
    paymentDate: '2024-01-14',
    paymentMethod: 'cash',
    status: 'completed',
    transactionId: 'TXN-002',
    notes: 'Full payment in cash'
  }
];

export const mockInsuranceClaims: InsuranceClaim[] = [
  {
    id: '1',
    claimNumber: 'CLM-2024-001',
    patientId: '1',
    patient: {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1985-05-15',
      phone: '+91-9876543210',
      email: 'john.doe@email.com'
    },
    policyNumber: 'POL-123456',
    claimAmount: 15000,
    approvedAmount: 12000,
    status: 'approved',
    claimDate: '2024-01-16',
    processedDate: '2024-01-25',
    providerId: '1',
    provider: {
      id: '1',
      name: 'Star Health Insurance',
      type: 'health_insurance',
      contactEmail: 'claims@starhealth.in',
      contactPhone: '+91-1800-123-4567'
    },
    services: [
      { description: 'MRI Scan', amount: 10000, approved: true },
      { description: 'Consultation', amount: 1500, approved: true },
      { description: 'Blood Test', amount: 2500, approved: false },
      { description: 'X-Ray', amount: 1000, approved: true }
    ]
  }
];

export const mockInsurancePolicies: InsurancePolicy[] = [
  {
    id: '1',
    policyNumber: 'POL-123456',
    patientId: '1',
    patient: {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1985-05-15',
      phone: '+91-9876543210',
      email: 'john.doe@email.com'
    },
    providerId: '1',
    provider: {
      id: '1',
      name: 'Star Health Insurance',
      type: 'health_insurance',
      contactEmail: 'claims@starhealth.in',
      contactPhone: '+91-1800-123-4567'
    },
    policyType: 'individual',
    coverageAmount: 500000,
    usedAmount: 25000,
    remainingAmount: 475000,
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    premium: 15000,
    deductible: 5000
  }
];

export const mockInsuranceProviders: InsuranceProvider[] = [
  {
    id: '1',
    name: 'Star Health Insurance',
    type: 'health_insurance',
    contactEmail: 'claims@starhealth.in',
    contactPhone: '+91-1800-123-4567',
    address: '1st Floor, Star House, Mumbai, Maharashtra 400001',
    website: 'https://starhealth.in',
    approvalRate: 85,
    averageProcessingTime: 7,
    totalClaims: 156,
    approvedClaims: 133,
    rejectedClaims: 23
  },
  {
    id: '2',
    name: 'ICICI Lombard General Insurance',
    type: 'general_insurance',
    contactEmail: 'health@icicilombard.com',
    contactPhone: '+91-1800-266-7766',
    address: 'ICICI Lombard House, 414, Veer Savarkar Marg, Mumbai 400025',
    website: 'https://icicilombard.com',
    approvalRate: 78,
    averageProcessingTime: 9,
    totalClaims: 89,
    approvedClaims: 69,
    rejectedClaims: 20
  }
];

export const mockBillingStats: BillingStats = {
  totalRevenue: 2500000,
  monthlyRevenue: 450000,
  pendingAmount: 125000,
  totalClaims: 245,
  approvedClaims: 202,
  rejectedClaims: 43,
  pendingClaims: 15,
  averageClaimAmount: 18500,
  claimApprovalRate: 82.4,
  averageProcessingTime: 8,
  revenueByMonth: [
    { month: 'Jan', revenue: 420000 },
    { month: 'Feb', revenue: 380000 },
    { month: 'Mar', revenue: 450000 },
    { month: 'Apr', revenue: 410000 },
    { month: 'May', revenue: 470000 },
    { month: 'Jun', revenue: 430000 }
  ],
  claimsByStatus: [
    { status: 'approved', count: 202 },
    { status: 'rejected', count: 43 },
    { status: 'pending', count: 15 }
  ],
  revenueByService: [
    { service: 'Consultations', revenue: 580000 },
    { service: 'Diagnostics', revenue: 750000 },
    { service: 'Surgery', revenue: 920000 },
    { service: 'Emergency', revenue: 250000 }
  ]
};

export const mockBillingReports = [
  {
    id: '1',
    name: 'Monthly Revenue Report',
    type: 'revenue',
    period: 'monthly',
    createdDate: '2024-01-31',
    totalRevenue: 450000,
    pendingAmount: 12500,
    paidAmount: 437500
  },
  {
    id: '2',
    name: 'Insurance Claims Summary',
    type: 'claims',
    period: 'monthly',
    createdDate: '2024-01-31',
    totalClaims: 45,
    approvedClaims: 38,
    rejectedClaims: 7
  },
  {
    id: '3',
    name: 'Outstanding Payments',
    type: 'outstanding',
    period: 'current',
    createdDate: '2024-01-31',
    totalOutstanding: 125000,
    overdueAmount: 35000
  }
];
