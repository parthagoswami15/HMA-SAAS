import {
  Transaction,
  Account,
  Budget,
  Invoice,
  FinancialReport,
  FinancialStats
} from '../../types/finance';

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    transactionId: 'TXN-2024-001',
    type: 'income',
    category: 'other',
    description: 'Patient consultation fees',
    amount: 125000,
    date: new Date('2024-01-15'),
    account: {
      name: 'Operating Account',
      type: 'checking'
    },
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
    date: new Date('2024-01-14'),
    account: {
      name: 'Operating Account',
      type: 'checking'
    },
    paymentMethod: 'bank_transfer',
    status: 'completed',
    reference: 'PO-2024-008',
    notes: 'Monthly medical supplies procurement'
  },
  {
    id: '3',
    transactionId: 'TXN-2024-003',
    type: 'income',
    category: 'other',
    description: 'Insurance claim reimbursement',
    amount: 85000,
    date: new Date('2024-01-13'),
    account: {
      name: 'Operating Account',
      type: 'checking'
    },
    paymentMethod: 'bank_transfer',
    status: 'completed',
    reference: 'CLM-2024-001',
    notes: 'Reimbursement for approved claims'
  },
  {
    id: '4',
    transactionId: 'TXN-2024-004',
    type: 'expense',
    category: 'salaries',
    description: 'Staff salary payment',
    amount: 1200000,
    date: new Date('2024-01-10'),
    account: {
      name: 'Operating Account',
      type: 'checking'
    },
    paymentMethod: 'bank_transfer',
    status: 'completed',
    reference: 'SAL-2024-001'
  },
  {
    id: '5',
    transactionId: 'TXN-2024-005',
    type: 'expense',
    category: 'utilities',
    description: 'Electricity and water bills',
    amount: 35000,
    date: new Date('2024-01-08'),
    account: {
      name: 'Operating Account',
      type: 'checking'
    },
    paymentMethod: 'online',
    status: 'completed',
    reference: 'UTIL-2024-001'
  }
];

export const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'Operating Account',
    code: 'ACC-001',
    type: 'checking',
    balance: 2450000,
    accountNumber: '****7890',
    bankName: 'HDFC Bank',
    isActive: true,
    description: 'Main operating account for daily transactions',
    createdDate: new Date('2023-01-01')
  },
  {
    id: '2',
    name: 'Savings Account',
    code: 'ACC-002',
    type: 'savings',
    balance: 5200000,
    accountNumber: '****4567',
    bankName: 'ICICI Bank',
    isActive: true,
    description: 'Long-term savings and reserve funds',
    createdDate: new Date('2023-01-01')
  },
  {
    id: '3',
    name: 'Petty Cash',
    code: 'ACC-003',
    type: 'asset',
    balance: 25000,
    accountNumber: 'CASH-001',
    bankName: 'Cash on Hand',
    isActive: true,
    description: 'Petty cash for small expenses',
    createdDate: new Date('2023-01-01')
  },
  {
    id: '4',
    name: 'Revenue Account',
    code: 'ACC-004',
    type: 'revenue',
    balance: 3200000,
    accountNumber: 'REV-001',
    isActive: true,
    description: 'Patient services revenue',
    createdDate: new Date('2023-01-01')
  }
];

export const mockBudgets: Budget[] = [
  {
    id: '1',
    name: 'Medical Supplies Budget',
    category: 'medical_supplies',
    allocatedAmount: 500000,
    spentAmount: 245000,
    remainingAmount: 255000,
    utilizationPercentage: 49,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31'),
    status: 'active',
    department: 'General',
    description: 'Budget for monthly medical supplies procurement'
  },
  {
    id: '2',
    name: 'Staff Salaries Budget',
    category: 'salaries',
    allocatedAmount: 1200000,
    spentAmount: 1200000,
    remainingAmount: 0,
    utilizationPercentage: 100,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31'),
    status: 'active',
    department: 'HR',
    description: 'Monthly staff salary disbursement'
  },
  {
    id: '3',
    name: 'Equipment Maintenance',
    category: 'maintenance',
    allocatedAmount: 150000,
    spentAmount: 75000,
    remainingAmount: 75000,
    utilizationPercentage: 50,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-03-31'),
    status: 'active',
    department: 'Technical',
    description: 'Quarterly equipment maintenance budget'
  },
  {
    id: '4',
    name: 'Marketing Budget',
    category: 'marketing',
    allocatedAmount: 100000,
    spentAmount: 35000,
    remainingAmount: 65000,
    utilizationPercentage: 35,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-03-31'),
    status: 'active',
    department: 'Marketing',
    description: 'Quarterly marketing and outreach budget'
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    date: new Date('2024-01-15'),
    dueDate: new Date('2024-01-30'),
    amount: 125000,
    status: 'paid',
    patientName: 'John Doe',
    description: 'Consultation and diagnostic services',
    totalAmount: 125000
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    date: new Date('2024-01-14'),
    dueDate: new Date('2024-01-29'),
    amount: 85000,
    status: 'pending',
    patientName: 'Jane Smith',
    description: 'Laboratory tests and imaging',
    totalAmount: 85000
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    date: new Date('2024-01-10'),
    dueDate: new Date('2024-01-25'),
    amount: 45000,
    status: 'overdue',
    patientName: 'Robert Johnson',
    description: 'Surgical procedure',
    totalAmount: 45000
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-004',
    date: new Date('2024-01-12'),
    dueDate: new Date('2024-01-27'),
    amount: 32000,
    status: 'draft',
    patientName: 'Mary Williams',
    description: 'Physiotherapy sessions',
    totalAmount: 32000
  }
];

export const mockFinancialReports: FinancialReport[] = [
  {
    id: '1',
    reportType: 'income_statement',
    title: 'Monthly P&L Statement',
    generatedDate: new Date('2024-02-01'),
    period: 'January 2024',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31')
  },
  {
    id: '2',
    reportType: 'cash_flow',
    title: 'Cash Flow Statement',
    generatedDate: new Date('2024-02-01'),
    period: 'January 2024',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31')
  },
  {
    id: '3',
    reportType: 'balance_sheet',
    title: 'Balance Sheet',
    generatedDate: new Date('2024-02-01'),
    period: 'January 2024',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31')
  },
  {
    id: '4',
    reportType: 'budget_variance',
    title: 'Budget Variance Analysis',
    generatedDate: new Date('2024-02-01'),
    period: 'Q1 2024',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-03-31')
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
  totalAssets: 7675000,
  monthlyRevenue: [
    { month: 'Oct', revenue: 2800000, expenses: 1950000 },
    { month: 'Nov', revenue: 2950000, expenses: 2000000 },
    { month: 'Dec', revenue: 3100000, expenses: 2050000 },
    { month: 'Jan', revenue: 3200000, expenses: 2100000 }
  ],
  expenseByCategory: [
    { category: 'Salaries', value: 1200000, name: 'Staff Salaries', color: 'green' },
    { category: 'Medical Supplies', value: 450000, name: 'Medical Supplies', color: 'blue' },
    { category: 'Equipment', value: 250000, name: 'Equipment & Maintenance', color: 'purple' },
    { category: 'Utilities', value: 200000, name: 'Utilities & Overhead', color: 'orange' }
  ],
  cashFlowData: [
    { month: 'Oct', inflow: 2800000, outflow: 1950000 },
    { month: 'Nov', inflow: 2950000, outflow: 2000000 },
    { month: 'Dec', inflow: 3100000, outflow: 2050000 },
    { month: 'Jan', inflow: 3200000, outflow: 2100000 }
  ]
};