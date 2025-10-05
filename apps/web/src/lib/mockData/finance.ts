// Mock data for Financial Management & Accounting

import {
  FinancialTransaction,
  AccountBalance,
  Budget,
  FinancialReport,
  Invoice,
  FinancialStats,
  TransactionType,
  PaymentMethod
} from '../../types/finance';

export const mockFinancialTransactions: FinancialTransaction[] = [
  {
    id: '1',
    transactionId: 'TXN-2024-001',
    type: 'income',
    category: 'patient_services',
    description: 'Patient consultation fees',
    amount: 125000,
    date: '2024-01-15',
    accountFrom: 'Patient Revenue',
    accountTo: 'Operating Account',
    paymentMethod: 'card',
    status: 'completed',
    reference: 'INV-2024-001',
    notes: 'Consultation and diagnostic services'
  },
  {
    id: '2',
    transactionId: 'TXN-2024-002',
    type: 'expense',
    category: 'medical_supplies',
    description: 'Medical supplies purchase',
    amount: 45000,
    date: '2024-01-14',
    accountFrom: 'Operating Account',
    accountTo: 'Medical Supplies',
    paymentMethod: 'bank_transfer',
    status: 'completed',
    reference: 'PO-2024-008',
    notes: 'Monthly medical supplies procurement'
  },
  {
    id: '3',
    transactionId: 'TXN-2024-003',
    type: 'income',
    category: 'insurance_reimbursement',
    description: 'Insurance claim reimbursement',
    amount: 85000,
    date: '2024-01-13',
    accountFrom: 'Star Health Insurance',
    accountTo: 'Operating Account',
    paymentMethod: 'bank_transfer',
    status: 'completed',
    reference: 'CLM-2024-001',
    notes: 'Reimbursement for approved claims'
  }
];

export const mockAccountBalances: AccountBalance[] = [
  {
    id: '1',
    accountName: 'Operating Account',
    accountType: 'checking',
    balance: 2450000,
    currency: 'INR',
    lastUpdated: '2024-01-15T10:30:00',
    bankName: 'HDFC Bank',
    accountNumber: '****7890'
  },
  {
    id: '2',
    accountName: 'Savings Account',
    accountType: 'savings',
    balance: 5200000,
    currency: 'INR',
    lastUpdated: '2024-01-15T10:30:00',
    bankName: 'ICICI Bank',
    accountNumber: '****4567'
  },
  {
    id: '3',
    accountName: 'Petty Cash',
    accountType: 'cash',
    balance: 25000,
    currency: 'INR',
    lastUpdated: '2024-01-15T10:30:00',
    bankName: 'Cash on Hand',
    accountNumber: 'CASH-001'
  }
];

export const mockBudgets: Budget[] = [
  {
    id: '1',
    name: 'Medical Supplies Budget',
    category: 'medical_supplies',
    totalAmount: 500000,
    spentAmount: 245000,
    remainingAmount: 255000,
    period: 'monthly',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    status: 'active',
    department: 'General',
    notes: 'Budget for monthly medical supplies procurement'
  },
  {
    id: '2',
    name: 'Staff Salaries Budget',
    category: 'staff_salaries',
    totalAmount: 1200000,
    spentAmount: 1200000,
    remainingAmount: 0,
    period: 'monthly',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    status: 'completed',
    department: 'HR',
    notes: 'Monthly staff salary disbursement'
  },
  {
    id: '3',
    name: 'Equipment Maintenance',
    category: 'maintenance',
    totalAmount: 150000,
    spentAmount: 75000,
    remainingAmount: 75000,
    period: 'quarterly',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    status: 'active',
    department: 'Technical',
    notes: 'Quarterly equipment maintenance budget'
  }
];

export const mockFinancialReports: FinancialReport[] = [
  {
    id: '1',
    reportName: 'Monthly P&L Statement',
    reportType: 'profit_loss',
    period: 'monthly',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    generatedDate: '2024-02-01',
    totalRevenue: 3200000,
    totalExpenses: 2100000,
    netProfit: 1100000,
    profitMargin: 34.4,
    status: 'finalized'
  },
  {
    id: '2',
    reportName: 'Cash Flow Statement',
    reportType: 'cash_flow',
    period: 'monthly',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    generatedDate: '2024-02-01',
    totalRevenue: 3200000,
    totalExpenses: 2100000,
    netProfit: 1100000,
    profitMargin: 34.4,
    status: 'finalized'
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    patientName: 'John Doe',
    amount: 125000,
    issueDate: '2024-01-15',
    dueDate: '2024-02-15',
    status: 'paid',
    paymentMethod: 'card',
    services: [
      { description: 'Consultation', amount: 25000 },
      { description: 'MRI Scan', amount: 100000 }
    ]
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    patientName: 'Jane Smith',
    amount: 85000,
    issueDate: '2024-01-14',
    dueDate: '2024-02-14',
    status: 'pending',
    paymentMethod: 'bank_transfer',
    services: [
      { description: 'Emergency Consultation', amount: 35000 },
      { description: 'CT Scan', amount: 50000 }
    ]
  }
];

export const mockFinancialStats: FinancialStats = {
  totalRevenue: 3200000,
  totalExpenses: 2100000,
  netProfit: 1100000,
  profitMargin: 34.4,
  cashFlow: 1100000,
  accountsReceivable: 450000,
  accountsPayable: 280000,
  monthlyGrowth: 12.5,
  revenueByCategory: [
    { category: 'Patient Services', amount: 2100000, percentage: 65.6 },
    { category: 'Insurance Reimbursements', amount: 850000, percentage: 26.6 },
    { category: 'Other Income', amount: 250000, percentage: 7.8 }
  ],
  expensesByCategory: [
    { category: 'Staff Salaries', amount: 1200000, percentage: 57.1 },
    { category: 'Medical Supplies', amount: 450000, percentage: 21.4 },
    { category: 'Equipment & Maintenance', amount: 250000, percentage: 11.9 },
    { category: 'Utilities & Overhead', amount: 200000, percentage: 9.5 }
  ],
  monthlyRevenue: [
    { month: 'Oct', revenue: 2800000 },
    { month: 'Nov', revenue: 2950000 },
    { month: 'Dec', revenue: 3100000 },
    { month: 'Jan', revenue: 3200000 }
  ],
  budgetVsActual: [
    { category: 'Medical Supplies', budget: 500000, actual: 450000 },
    { category: 'Staff Salaries', budget: 1200000, actual: 1200000 },
    { category: 'Maintenance', budget: 150000, actual: 125000 },
    { category: 'Utilities', budget: 200000, actual: 185000 }
  ]
};