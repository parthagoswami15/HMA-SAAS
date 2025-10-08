'use client';

import React, { useState, useMemo } from 'react';
import {
  Container,
  Paper,
  Title,
  Group,
  Button,
  TextInput,
  Select,
  Badge,
  Table,
  Modal,
  Text,
  Tabs,
  Card,
  Avatar,
  ActionIcon,
  Menu,
  Stack,
  Divider,
  SimpleGrid,
  ScrollArea,
  ThemeIcon,
  Alert,
  Progress,
  NumberInput,
  Textarea,
  Timeline,
  Stepper,
  RingProgress,
  Tooltip,
  List,
  Image,
  Loader,
  Highlight,
  Accordion,
  FileButton,
  ColorSwatch,
  Code,
  Spoiler,
  Mark,
  Rating,
  Switch,
  Checkbox,
  Radio,
  PasswordInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { DatePicker } from '@mantine/dates';
import { AreaChart, BarChart, DonutChart, LineChart } from '@mantine/charts';
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconEye,
  IconDownload,
  IconChartBar,
  IconReceipt,
  IconBuildingBank,
  IconFileInvoice,
  IconReportAnalytics,
  IconTrendingUp,
  IconTrendingDown,
  IconArrowUp,
  IconArrowDown,
  IconCash,
  IconCashBanknote,
  IconFileSpreadsheet,
  IconPercentage,
  IconChartLine,
  IconChartPie,
  IconShare,
  IconWallet,
  IconBriefcase
} from '@tabler/icons-react';
import {
  Transaction,
  TransactionType,
  TransactionStatus,
  Account,
  AccountType,
  Budget,
  BudgetStatus,
  Invoice,
  InvoiceStatus,
  PaymentMethod,
  ExpenseCategory,
  FinancialReport,
  ReportType,
  FinancialStats,
  FinancialFilters
} from '../../../types/finance';
import {
  mockTransactions,
  mockAccounts,
  mockBudgets,
  mockInvoices,
  mockFinancialReports,
  mockFinancialStats
} from '../../../lib/mockData/finance';
import { mockPatients } from '../../../lib/mockData/patients';

const FinanceManagement = () => {
  // State management
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedReport, setSelectedReport] = useState<FinancialReport | null>(null);

  // Modal states
  const [transactionDetailOpened, { open: openTransactionDetail, close: closeTransactionDetail }] = useDisclosure(false);
  const [addTransactionOpened, { open: openAddTransaction, close: closeAddTransaction }] = useDisclosure(false);
  const [budgetDetailOpened, { open: openBudgetDetail, close: closeBudgetDetail }] = useDisclosure(false);
  const [invoiceDetailOpened, { open: openInvoiceDetail, close: closeInvoiceDetail }] = useDisclosure(false);
  const [reportDetailOpened, { open: openReportDetail, close: closeReportDetail }] = useDisclosure(false);
  const [addBudgetOpened, { open: openAddBudget, close: closeAddBudget }] = useDisclosure(false);
  const [createInvoiceOpened, { open: openCreateInvoice, close: closeCreateInvoice }] = useDisclosure(false);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter((transaction) => {
      const matchesSearch = 
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.reference?.toLowerCase().includes(searchQuery.toLowerCase() || '');
      
      const matchesType = !selectedType || transaction.type === selectedType;
      const matchesStatus = !selectedStatus || transaction.status === selectedStatus;
      const matchesCategory = !selectedCategory || transaction.category === selectedCategory;
      const matchesAccount = !selectedAccount || transaction.account.name === selectedAccount;

      return matchesSearch && matchesType && matchesStatus && matchesCategory && matchesAccount;
    });
  }, [searchQuery, selectedType, selectedStatus, selectedCategory, selectedAccount]);

  // Helper functions
  const getTransactionTypeColor = (type: TransactionType) => {
    switch (type) {
      case 'income': return 'green';
      case 'expense': return 'red';
      case 'transfer': return 'blue';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: TransactionStatus | BudgetStatus | InvoiceStatus) => {
    switch (status) {
      case 'completed':
      case 'paid':
      case 'active': return 'green';
      case 'pending':
      case 'draft': return 'orange';
      case 'failed':
      case 'overdue':
      case 'cancelled':
      case 'expired': return 'red';
      case 'processing': return 'blue';
      default: return 'gray';
    }
  };

  const getAccountTypeColor = (type: AccountType) => {
    switch (type) {
      case 'checking': return 'blue';
      case 'savings': return 'green';
      case 'revenue': return 'teal';
      case 'expense': return 'red';
      case 'asset': return 'purple';
      case 'liability': return 'orange';
      default: return 'gray';
    }
  };

  const getCategoryColor = (category: ExpenseCategory) => {
    switch (category) {
      case 'medical_supplies': return 'blue';
      case 'equipment': return 'purple';
      case 'salaries': return 'green';
      case 'utilities': return 'orange';
      case 'maintenance': return 'yellow';
      case 'marketing': return 'pink';
      case 'insurance': return 'cyan';
      case 'other': return 'gray';
      default: return 'gray';
    }
  };

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    openTransactionDetail();
  };

  const handleViewBudget = (budget: Budget) => {
    setSelectedBudget(budget);
    openBudgetDetail();
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    openInvoiceDetail();
  };

  const handleViewReport = (report: FinancialReport) => {
    setSelectedReport(report);
    openReportDetail();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('');
    setSelectedStatus('');
    setSelectedCategory('');
    setSelectedAccount('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Statistics cards
  const statsCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(mockFinancialStats.totalRevenue),
      icon: IconTrendingUp,
      color: 'green',
      trend: '+12.5%'
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(mockFinancialStats.totalExpenses),
      icon: IconTrendingDown,
      color: 'red',
      trend: '+8.3%'
    },
    {
      title: 'Net Profit',
      value: formatCurrency(mockFinancialStats.netProfit),
      icon: IconWallet,
      color: 'blue',
      trend: '+18.7%'
    },
    {
      title: 'Cash Flow',
      value: formatCurrency(mockFinancialStats.cashFlow),
      icon: IconCash,
      color: 'purple',
      trend: '+5.2%'
    }
  ];

  // Chart data
  const revenueExpenseData = [
    { name: 'Revenue', value: mockFinancialStats.totalRevenue, color: 'green' },
    { name: 'Expenses', value: mockFinancialStats.totalExpenses, color: 'red' }
  ];

  const monthlyRevenueData = mockFinancialStats.monthlyRevenue;
  const expenseCategoryData = mockFinancialStats.expenseByCategory.map(item => ({
    ...item,
    color: getCategoryColor(item.category as ExpenseCategory)
  }));
  const cashFlowData = mockFinancialStats.cashFlow;

  return (
    <Container size="xl" py="md">
      {/* Header */}
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={1}>Financial Management & Accounting</Title>
          <Text c="dimmed" size="sm">
            Manage finances, accounting, budgets, and financial reporting
          </Text>
        </div>
        <Group>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={openAddTransaction}
            color="blue"
          >
            New Transaction
          </Button>
          <Button
            variant="light"
            leftSection={<IconFileInvoice size={16} />}
            color="green"
            onClick={openCreateInvoice}
          >
            Create Invoice
          </Button>
        </Group>
      </Group>

      {/* Statistics Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="lg">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <div>
                  <Text c="dimmed" size="sm" fw={500}>
                    {stat.title}
                  </Text>
                  <Text fw={700} size="xl">
                    {stat.value}
                  </Text>
                </div>
                <ThemeIcon color={stat.color} size="xl" radius="md" variant="light">
                  <Icon size={24} />
                </ThemeIcon>
              </Group>
              <Group justify="space-between" mt="sm">
                <Badge 
                  color={stat.trend.includes('+') ? 'green' : stat.trend.includes('-') ? 'red' : 'blue'} 
                  variant="light"
                  size="sm"
                >
                  {stat.trend}
                </Badge>
                <Text size="xs" c="dimmed">vs last month</Text>
              </Group>
            </Card>
          );
        })}
      </SimpleGrid>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="overview" leftSection={<IconChartBar size={16} />}>
            Overview
          </Tabs.Tab>
          <Tabs.Tab value="transactions" leftSection={<IconReceipt size={16} />}>
            Transactions
          </Tabs.Tab>
          <Tabs.Tab value="accounts" leftSection={<IconBuildingBank size={16} />}>
            Accounts
          </Tabs.Tab>
          <Tabs.Tab value="budgets" leftSection={<IconBriefcase size={16} />}>
            Budgets
          </Tabs.Tab>
          <Tabs.Tab value="invoices" leftSection={<IconFileInvoice size={16} />}>
            Invoices
          </Tabs.Tab>
          <Tabs.Tab value="reports" leftSection={<IconReportAnalytics size={16} />}>
            Reports
          </Tabs.Tab>
        </Tabs.List>

        {/* Overview Tab */}
        <Tabs.Panel value="overview">
          <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg" mt="md">
            {/* Revenue vs Expenses */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">Revenue vs Expenses</Title>
              <DonutChart
                data={revenueExpenseData}
                size={200}
                thickness={40}
                withLabels
                withTooltip
              />
            </Card>
            
            {/* Monthly Revenue Trend */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">Monthly Revenue Trend</Title>
              <AreaChart
                h={250}
                data={monthlyRevenueData}
                dataKey="month"
                series={[
                  { name: 'revenue', color: 'green.6' },
                  { name: 'expenses', color: 'red.6' }
                ]}
                curveType="linear"
              />
            </Card>
            
            {/* Expense Categories */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">Expenses by Category</Title>
              <DonutChart
                data={expenseCategoryData}
                size={200}
                thickness={30}
                withLabels
              />
            </Card>
            
            {/* Cash Flow */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">Cash Flow Analysis</Title>
              <BarChart
                h={250}
                data={cashFlowData}
                dataKey="month"
                series={[
                  { name: 'inflow', color: 'green.6', label: 'Cash Inflow' },
                  { name: 'outflow', color: 'red.6', label: 'Cash Outflow' }
                ]}
              />
            </Card>
          </SimpleGrid>

          {/* Quick Financial Summary */}
          <Card padding="lg" radius="md" withBorder mt="lg">
            <Title order={4} mb="md">Financial Summary</Title>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
              <div style={{ textAlign: 'center' }}>
                <RingProgress
                  size={100}
                  thickness={8}
                  sections={[{ 
                    value: (mockFinancialStats.profitMargin / 100) * 100, 
                    color: mockFinancialStats.profitMargin > 0 ? 'green' : 'red' 
                  }]}
                  label={
                    <Text size="sm" fw={700} ta="center">
                      {formatPercentage(mockFinancialStats.profitMargin)}
                    </Text>
                  }
                />
                <Text size="xs" c="dimmed" mt="xs">Profit Margin</Text>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <Text size="xl" fw={700} c="green">
                  {formatCurrency(mockFinancialStats.accountsReceivable)}
                </Text>
                <Text size="xs" c="dimmed">Accounts Receivable</Text>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <Text size="xl" fw={700} c="red">
                  {formatCurrency(mockFinancialStats.accountsPayable)}
                </Text>
                <Text size="xs" c="dimmed">Accounts Payable</Text>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <Text size="xl" fw={700} c="blue">
                  {formatCurrency(mockFinancialStats.totalAssets)}
                </Text>
                <Text size="xs" c="dimmed">Total Assets</Text>
              </div>
            </SimpleGrid>
          </Card>
        </Tabs.Panel>

        {/* Transactions Tab */}
        <Tabs.Panel value="transactions">
          <Paper p="md" radius="md" withBorder mt="md">
            {/* Search and Filters */}
            <Group mb="md">
              <TextInput
                placeholder="Search transactions..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                style={{ flex: 1 }}
              />
              <Select
                placeholder="Type"
                data={[
                  { value: 'income', label: 'Income' },
                  { value: 'expense', label: 'Expense' },
                  { value: 'transfer', label: 'Transfer' }
                ]}
                value={selectedType}
                onChange={setSelectedType}
                clearable
              />
              <Select
                placeholder="Status"
                data={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'failed', label: 'Failed' },
                  { value: 'cancelled', label: 'Cancelled' }
                ]}
                value={selectedStatus}
                onChange={setSelectedStatus}
                clearable
              />
              <Select
                placeholder="Category"
                data={[
                  { value: 'medical_supplies', label: 'Medical Supplies' },
                  { value: 'equipment', label: 'Equipment' },
                  { value: 'salaries', label: 'Salaries' },
                  { value: 'utilities', label: 'Utilities' },
                  { value: 'maintenance', label: 'Maintenance' },
                  { value: 'marketing', label: 'Marketing' },
                  { value: 'insurance', label: 'Insurance' },
                  { value: 'other', label: 'Other' }
                ]}
                value={selectedCategory}
                onChange={setSelectedCategory}
                clearable
              />
              <Button variant="light" onClick={clearFilters}>
                Clear Filters
              </Button>
            </Group>

            {/* Transactions Table */}
            <ScrollArea>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Transaction ID</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Description</Table.Th>
                    <Table.Th>Type</Table.Th>
                    <Table.Th>Category</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>Account</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredTransactions.map((transaction) => (
                    <Table.Tr key={transaction.id}>
                      <Table.Td>
                        <Text fw={500}>{transaction.transactionId}</Text>
                      </Table.Td>
                      <Table.Td>
                        <div>
                          <Text size="sm" fw={500}>
                            {new Date(transaction.date).toLocaleDateString()}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {new Date(transaction.date).toLocaleTimeString()}
                          </Text>
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <div>
                          <Text size="sm" fw={500} lineClamp={1}>
                            {transaction.description}
                          </Text>
                          {transaction.reference && (
                            <Text size="xs" c="dimmed">
                              Ref: {transaction.reference}
                            </Text>
                          )}
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getTransactionTypeColor(transaction.type)} variant="light">
                          {transaction.type.toUpperCase()}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getCategoryColor(transaction.category)} variant="light" size="sm">
                          {transaction.category.replace('_', ' ')}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text 
                          size="sm" 
                          fw={600} 
                          c={transaction.type === 'income' ? 'green' : transaction.type === 'expense' ? 'red' : 'blue'}
                        >
                          {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
                          {formatCurrency(transaction.amount)}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <div>
                          <Text size="sm" fw={500}>{transaction.account.name}</Text>
                          <Badge color={getAccountTypeColor(transaction.account.type)} variant="light" size="xs">
                            {transaction.account.type}
                          </Badge>
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getStatusColor(transaction.status)} variant="light">
                          {transaction.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => handleViewTransaction(transaction)}
                          >
                            <IconEye size={16} />
                          </ActionIcon>
                          <ActionIcon variant="subtle" color="green">
                            <IconEdit size={16} />
                          </ActionIcon>
                          <ActionIcon variant="subtle" color="orange">
                            <IconDownload size={16} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </Paper>
        </Tabs.Panel>

        {/* Accounts Tab */}
        <Tabs.Panel value="accounts">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Chart of Accounts</Title>
              <Button leftSection={<IconPlus size={16} />}>
                Add Account
              </Button>
            </Group>

            {/* Accounts Grid */}
            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
              {mockAccounts.map((account) => (
                <Card key={account.id} padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Text fw={600} size="lg">{account.name}</Text>
                      <Text size="sm" c="dimmed">{account.code}</Text>
                    </div>
                    <Badge color={getAccountTypeColor(account.type)} variant="light">
                      {account.type.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </Group>

                  <Stack gap="sm" mb="md">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Current Balance</Text>
                      <Text size="lg" fw={700} c={account.balance >= 0 ? 'green' : 'red'}>
                        {formatCurrency(account.balance)}
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Account Number</Text>
                      <Text size="sm" fw={500}>{account.accountNumber}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Bank/Institution</Text>
                      <Text size="sm">{account.bankName || 'N/A'}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Status</Text>
                      <Badge color={account.isActive ? 'green' : 'red'} variant="light">
                        {account.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </Group>
                  </Stack>

                  {account.description && (
                    <Text size="sm" c="dimmed" lineClamp={2} mb="md">
                      {account.description}
                    </Text>
                  )}

                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">
                      Opened: {new Date(account.createdDate).toLocaleDateString()}
                    </Text>
                    <Group gap="xs">
                      <ActionIcon variant="subtle" color="blue">
                        <IconEye size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="green">
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="orange">
                        <IconFileSpreadsheet size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>

        {/* Budgets Tab */}
        <Tabs.Panel value="budgets">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Budget Management</Title>
              <Group>
                <Button leftSection={<IconPlus size={16} />} onClick={openAddBudget}>
                  Create Budget
                </Button>
                <Button variant="light" leftSection={<IconReportAnalytics size={16} />}>
                  Budget Report
                </Button>
              </Group>
            </Group>

            {/* Budgets Grid */}
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
              {mockBudgets.map((budget) => (
                <Card key={budget.id} padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Text fw={600} size="lg">{budget.name}</Text>
                      <Text size="sm" c="dimmed">{budget.department}</Text>
                    </div>
                    <Badge color={getStatusColor(budget.status)} variant="light">
                      {budget.status}
                    </Badge>
                  </Group>

                  <Stack gap="sm" mb="md">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Budget Period</Text>
                      <Text size="sm" fw={500}>
                        {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Allocated Amount</Text>
                      <Text size="sm" fw={600} c="blue">
                        {formatCurrency(budget.allocatedAmount)}
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Spent Amount</Text>
                      <Text size="sm" fw={600} c={budget.spentAmount > budget.allocatedAmount ? 'red' : 'green'}>
                        {formatCurrency(budget.spentAmount)}
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Remaining</Text>
                      <Text size="sm" fw={600} c={budget.remainingAmount < 0 ? 'red' : 'green'}>
                        {formatCurrency(budget.remainingAmount)}
                      </Text>
                    </Group>
                  </Stack>

                  <div mb="md">
                    <Group justify="space-between" mb="xs">
                      <Text size="sm" c="dimmed">Budget Utilization</Text>
                      <Text size="sm" fw={500}>
                        {formatPercentage(budget.utilizationPercentage)}
                      </Text>
                    </Group>
                    <Progress 
                      value={budget.utilizationPercentage} 
                      size="md" 
                      color={
                        budget.utilizationPercentage > 100 ? 'red' : 
                        budget.utilizationPercentage > 80 ? 'orange' : 
                        'green'
                      }
                    />
                  </div>

                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">
                      Category: {budget.category.replace('_', ' ')}
                    </Text>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleViewBudget(budget)}
                      >
                        <IconEye size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="green">
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="orange">
                        <IconDownload size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>

        {/* Invoices Tab */}
        <Tabs.Panel value="invoices">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Invoice Management</Title>
              <Group>
                <Button leftSection={<IconPlus size={16} />} onClick={openCreateInvoice}>
                  Create Invoice
                </Button>
                <Button variant="light" leftSection={<IconDownload size={16} />}>
                  Export Invoices
                </Button>
              </Group>
            </Group>

            {/* Invoices Grid */}
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
              {mockInvoices.map((invoice) => (
                <Card key={invoice.id} padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Text fw={600} size="lg">{invoice.invoiceNumber}</Text>
                      <Text size="sm" c="dimmed">
                        {invoice.patient?.firstName} {invoice.patient?.lastName || 'Corporate Client'}
                      </Text>
                    </div>
                    <Badge color={getStatusColor(invoice.status)} variant="light">
                      {invoice.status}
                    </Badge>
                  </Group>

                  <Stack gap="sm" mb="md">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Invoice Date</Text>
                      <Text size="sm" fw={500}>
                        {new Date(invoice.invoiceDate).toLocaleDateString()}
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Due Date</Text>
                      <Text size="sm" fw={500} c={new Date(invoice.dueDate) < new Date() && invoice.status !== 'paid' ? 'red' : undefined}>
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Subtotal</Text>
                      <Text size="sm" fw={500}>
                        {formatCurrency(invoice.subtotal)}
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Tax ({formatPercentage(invoice.taxRate)})</Text>
                      <Text size="sm">
                        {formatCurrency(invoice.taxAmount)}
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Discount</Text>
                      <Text size="sm" c="green">
                        -{formatCurrency(invoice.discountAmount)}
                      </Text>
                    </Group>
                    <Divider />
                    <Group justify="space-between">
                      <Text size="sm" fw={600}>Total Amount</Text>
                      <Text size="lg" fw={700} c="blue">
                        {formatCurrency(invoice.totalAmount)}
                      </Text>
                    </Group>
                  </Stack>

                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">
                      Payment Method: {invoice.paymentMethod}
                    </Text>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleViewInvoice(invoice)}
                      >
                        <IconEye size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="green">
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="orange">
                        <IconDownload size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>

        {/* Reports Tab */}
        <Tabs.Panel value="reports">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Financial Reports</Title>
              <Group>
                <Button leftSection={<IconPlus size={16} />}>
                  Generate Report
                </Button>
                <Button variant="light" leftSection={<IconDownload size={16} />}>
                  Export All
                </Button>
              </Group>
            </Group>

            {/* Reports Grid */}
            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
              {mockFinancialReports.map((report) => (
                <Card key={report.id} padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Text fw={600} size="lg">{report.title}</Text>
                      <Text size="sm" c="dimmed">{report.reportType.replace('_', ' ').toUpperCase()}</Text>
                    </div>
                    <ThemeIcon color="blue" variant="light">
                      <IconReportAnalytics size={20} />
                    </ThemeIcon>
                  </Group>

                  <Stack gap="sm" mb="md">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Period</Text>
                      <Text size="sm" fw={500}>
                        {new Date(report.startDate).toLocaleDateString()} - {new Date(report.endDate).toLocaleDateString()}
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Generated</Text>
                      <Text size="sm">
                        {new Date(report.generatedDate).toLocaleDateString()}
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Generated By</Text>
                      <Text size="sm">{report.generatedBy}</Text>
                    </Group>
                  </Stack>

                  {report.summary && (
                    <Text size="sm" c="dimmed" lineClamp={3} mb="md">
                      {report.summary}
                    </Text>
                  )}

                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">
                      File Size: {(report.fileSize / 1024).toFixed(0)} KB
                    </Text>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleViewReport(report)}
                      >
                        <IconEye size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="green">
                        <IconDownload size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="orange">
                        <IconShare size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>
      </Tabs>

      {/* Transaction Detail Modal */}
      <Modal
        opened={transactionDetailOpened}
        onClose={closeTransactionDetail}
        title="Transaction Details"
        size="lg"
      >
        {selectedTransaction && (
          <Stack gap="md">
            <Group>
              <ThemeIcon color={getTransactionTypeColor(selectedTransaction.type)} size="xl" variant="light">
                <IconReceipt size={24} />
              </ThemeIcon>
              <div>
                <Title order={3}>{selectedTransaction.description}</Title>
                <Text c="dimmed">Transaction ID: {selectedTransaction.transactionId}</Text>
                <Badge color={getStatusColor(selectedTransaction.status)} variant="light" mt="xs">
                  {selectedTransaction.status}
                </Badge>
              </div>
            </Group>

            <Divider />

            <SimpleGrid cols={2}>
              <div>
                <Text size="sm" fw={500}>Amount</Text>
                <Text size="lg" fw={700} c={getTransactionTypeColor(selectedTransaction.type)}>
                  {selectedTransaction.type === 'income' ? '+' : selectedTransaction.type === 'expense' ? '-' : ''}
                  {formatCurrency(selectedTransaction.amount)}
                </Text>
              </div>
              <div>
                <Text size="sm" fw={500}>Type</Text>
                <Badge color={getTransactionTypeColor(selectedTransaction.type)} variant="light">
                  {selectedTransaction.type.toUpperCase()}
                </Badge>
              </div>
              <div>
                <Text size="sm" fw={500}>Date</Text>
                <Text size="sm" c="dimmed">
                  {new Date(selectedTransaction.date).toLocaleString()}
                </Text>
              </div>
              <div>
                <Text size="sm" fw={500}>Category</Text>
                <Badge color={getCategoryColor(selectedTransaction.category)} variant="light">
                  {selectedTransaction.category.replace('_', ' ')}
                </Badge>
              </div>
              <div>
                <Text size="sm" fw={500}>Account</Text>
                <Text size="sm" c="dimmed">{selectedTransaction.account.name}</Text>
              </div>
              <div>
                <Text size="sm" fw={500}>Payment Method</Text>
                <Text size="sm" c="dimmed">{selectedTransaction.paymentMethod}</Text>
              </div>
            </SimpleGrid>

            {selectedTransaction.reference && (
              <>
                <Divider />
                <div>
                  <Text size="sm" fw={500} mb="sm">Reference</Text>
                  <Text size="sm">{selectedTransaction.reference}</Text>
                </div>
              </>
            )}

            {selectedTransaction.notes && (
              <>
                <Divider />
                <div>
                  <Text size="sm" fw={500} mb="sm">Notes</Text>
                  <Text size="sm">{selectedTransaction.notes}</Text>
                </div>
              </>
            )}

            <Group justify="flex-end">
              <Button variant="light" onClick={closeTransactionDetail}>
                Close
              </Button>
              <Button leftSection={<IconDownload size={16} />}>
                Download Receipt
              </Button>
              <Button leftSection={<IconEdit size={16} />}>
                Edit Transaction
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Add Transaction Modal */}
      <Modal
        opened={addTransactionOpened}
        onClose={closeAddTransaction}
        title="Add New Transaction"
        size="lg"
      >
        <Stack gap="md">
          <SimpleGrid cols={2}>
            <Select
              label="Transaction Type"
              placeholder="Select type"
              data={[
                { value: 'income', label: 'Income' },
                { value: 'expense', label: 'Expense' },
                { value: 'transfer', label: 'Transfer' }
              ]}
              required
            />
            <Select
              label="Category"
              placeholder="Select category"
              data={[
                { value: 'medical_supplies', label: 'Medical Supplies' },
                { value: 'equipment', label: 'Equipment' },
                { value: 'salaries', label: 'Salaries' },
                { value: 'utilities', label: 'Utilities' },
                { value: 'maintenance', label: 'Maintenance' },
                { value: 'marketing', label: 'Marketing' },
                { value: 'insurance', label: 'Insurance' },
                { value: 'other', label: 'Other' }
              ]}
              required
            />
          </SimpleGrid>
          
          <TextInput
            label="Description"
            placeholder="Enter transaction description"
            required
          />
          
          <SimpleGrid cols={2}>
            <NumberInput
              label="Amount"
              placeholder="Enter amount"
              min={0}
              required
            />
            <Select
              label="Account"
              placeholder="Select account"
              data={mockAccounts.map(account => ({
                value: account.id,
                label: account.name
              }))}
              onChange={(value) => value || ''}
              required
            />
          </SimpleGrid>
          
          <SimpleGrid cols={2}>
            <DatePicker
              label="Transaction Date"
              placeholder="Select date"
              onChange={(date) => {}}
              required
            />
            <Select
              label="Payment Method"
              placeholder="Select payment method"
              data={[
                { value: 'cash', label: 'Cash' },
                { value: 'bank_transfer', label: 'Bank Transfer' },
                { value: 'card', label: 'Card' },
                { value: 'check', label: 'Check' },
                { value: 'upi', label: 'UPI' }
              ]}
              onChange={(value) => value || ''}
              required
            />
          </SimpleGrid>
          
          <TextInput
            label="Reference"
            placeholder="Enter reference number (optional)"
          />
          
          <Textarea
            label="Notes"
            placeholder="Enter additional notes (optional)"
            rows={3}
          />
          
          <Group justify="flex-end">
            <Button variant="light" onClick={closeAddTransaction}>
              Cancel
            </Button>
            <Button onClick={() => {
              notifications.show({
                title: 'Transaction Added',
                message: 'Financial transaction has been successfully recorded',
                color: 'green',
              });
              closeAddTransaction();
            }}>
              Add Transaction
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Create Invoice Modal */}
      <Modal
        opened={createInvoiceOpened}
        onClose={closeCreateInvoice}
        title="Create New Invoice"
        size="lg"
      >
        <Stack gap="md">
          <SimpleGrid cols={2}>
            <Select
              label="Patient/Client"
              placeholder="Select patient or client"
              data={mockPatients.map(patient => ({
                value: patient.id,
                label: `${patient.firstName} ${patient.lastName}`
              }))}
              required
            />
            <TextInput
              label="Invoice Number"
              placeholder="Auto-generated"
              disabled
            />
          </SimpleGrid>
          
          <SimpleGrid cols={2}>
            <DatePicker
              label="Invoice Date"
              placeholder="Select invoice date"
              required
            />
            <DatePicker
              label="Due Date"
              placeholder="Select due date"
              required
            />
          </SimpleGrid>
          
          <Divider label="Invoice Items" labelPosition="left" />
          
          <Card withBorder p="md">
            <Stack gap="sm">
              <SimpleGrid cols={4}>
                <TextInput placeholder="Service/Item" />
                <NumberInput placeholder="Quantity" min={1} />
                <NumberInput placeholder="Rate" min={0} />
                <NumberInput placeholder="Amount" disabled />
              </SimpleGrid>
              <Button variant="light" size="sm" leftSection={<IconPlus size={14} />}>
                Add Item
              </Button>
            </Stack>
          </Card>
          
          <SimpleGrid cols={3}>
            <NumberInput
              label="Subtotal"
              placeholder="Calculated automatically"
              disabled
            />
            <NumberInput
              label="Tax Rate (%)"
              placeholder="Enter tax rate"
              min={0}
              max={100}
            />
            <NumberInput
              label="Discount"
              placeholder="Enter discount amount"
              min={0}
            />
          </SimpleGrid>
          
          <Group justify="space-between">
            <Text fw={600}>Total Amount:</Text>
            <Text size="xl" fw={700} c="blue">₹0.00</Text>
          </Group>
          
          <Select
            label="Payment Method"
            placeholder="Select payment method"
            data={[
              { value: 'cash', label: 'Cash' },
              { value: 'card', label: 'Card' },
              { value: 'upi', label: 'UPI' },
              { value: 'bank_transfer', label: 'Bank Transfer' },
              { value: 'insurance', label: 'Insurance' }
            ]}
            required
          />
          
          <Textarea
            label="Notes"
            placeholder="Additional notes or terms"
            rows={3}
          />
          
          <Group justify="flex-end">
            <Button variant="light" onClick={closeCreateInvoice}>
              Cancel
            </Button>
            <Button onClick={() => {
              notifications.show({
                title: 'Invoice Created',
                message: 'Invoice has been successfully created',
                color: 'green',
              });
              closeCreateInvoice();
            }}>
              Create Invoice
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default FinanceManagement;