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
  Checkbox,
  List,
  Notification,
  LoadingOverlay,
  Anchor,
  rem
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { AreaChart, BarChart, DonutChart, LineChart } from '@mantine/charts';
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconEye,
  IconTrash,
  IconCalendar,
  IconCurrency,
  IconChartBar,
  IconPhone,
  IconMail,
  IconAlertCircle,
  IconCheck,
  IconX,
  IconDotsVertical,
  IconReceipt,
  IconCreditCard,
  IconBuildingBank,
  IconFileText,
  IconDownload,
  IconPrinter,
  IconShare,
  IconCash,
  IconShield,
  IconExclamationMark,
  IconClockHour4,
  IconTrendingUp,
  IconTrendingDown,
  IconUsers,
  IconReportMoney,
  IconCalculator,
  IconWallet,
  IconBrandPaypal,
  IconCurrencyDollar,
  IconFileInvoice,
  IconCopyright,
  IconFilter,
  IconRefresh
} from '@tabler/icons-react';

// Import types and mock data
import {
  Invoice,
  InvoiceStatus,
  Payment,
  PaymentMethod,
  PaymentStatus,
  InsuranceClaim,
  ClaimStatus,
  InsuranceProvider,
  PatientInsurance,
  BillingReport,
  BillingFilters
} from '../../../types/billing';
import {
  mockInvoices,
  mockPayments,
  mockInsuranceClaims,
  mockInsuranceProviders,
  mockPatientInsurance,
  mockBillingReports,
  mockBillingStats
} from '../../../lib/mockData/billing';
import { mockPatients } from '../../../lib/mockData/patients';

const BillingManagement = () => {
  // State management
  const [activeTab, setActiveTab] = useState<string>('invoices');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<InsuranceClaim | null>(null);

  // Modal states
  const [invoiceDetailOpened, { open: openInvoiceDetail, close: closeInvoiceDetail }] = useDisclosure(false);
  const [addInvoiceOpened, { open: openAddInvoice, close: closeAddInvoice }] = useDisclosure(false);
  const [addPaymentOpened, { open: openAddPayment, close: closeAddPayment }] = useDisclosure(false);
  const [claimDetailOpened, { open: openClaimDetail, close: closeClaimDetail }] = useDisclosure(false);

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    return mockInvoices.filter((invoice) => {
      const matchesSearch = 
        invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.patient.lastName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPatient = !selectedPatient || invoice.patientId === selectedPatient;
      const matchesStatus = !selectedStatus || invoice.status === selectedStatus;

      return matchesSearch && matchesPatient && matchesStatus;
    });
  }, [searchQuery, selectedPatient, selectedStatus]);

  // Filter payments
  const filteredPayments = useMemo(() => {
    return mockPayments.filter((payment) => {
      const matchesSearch = 
        payment.paymentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesMethod = !selectedPaymentMethod || payment.paymentMethod === selectedPaymentMethod;
      const matchesStatus = !selectedStatus || payment.status === selectedStatus;

      return matchesSearch && matchesMethod && matchesStatus;
    });
  }, [searchQuery, selectedPaymentMethod, selectedStatus]);

  // Filter claims
  const filteredClaims = useMemo(() => {
    return mockInsuranceClaims.filter((claim) => {
      const matchesSearch = 
        claim.claimNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.patient.lastName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = !selectedStatus || claim.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedStatus]);

  // Helper functions
  const getStatusColor = (status: InvoiceStatus | PaymentStatus | ClaimStatus) => {
    switch (status) {
      case 'draft':
      case 'pending': return 'orange';
      case 'sent':
      case 'submitted': return 'blue';
      case 'paid':
      case 'completed':
      case 'approved': return 'green';
      case 'overdue':
      case 'rejected': return 'red';
      case 'cancelled':
      case 'failed': return 'gray';
      case 'partial_payment': return 'yellow';
      case 'under_review': return 'cyan';
      default: return 'gray';
    }
  };

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'cash': return <IconCash size={16} />;
      case 'credit_card': return <IconCreditCard size={16} />;
      case 'debit_card': return <IconCreditCard size={16} />;
      case 'bank_transfer': return <IconBuildingBank size={16} />;
      case 'insurance': return <IconShield size={16} />;
      case 'online': return <IconBrandPaypal size={16} />;
      default: return <IconWallet size={16} />;
    }
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    openInvoiceDetail();
  };

  const handleViewClaim = (claim: InsuranceClaim) => {
    setSelectedClaim(claim);
    openClaimDetail();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedPatient('');
    setSelectedStatus('');
    setSelectedPaymentMethod('');
    setDateRange([null, null]);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Statistics cards
  const statsCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(mockBillingStats.totalRevenue),
      icon: IconCurrencyDollar,
      color: 'green',
      trend: '+15.3%'
    },
    {
      title: 'Outstanding Amount',
      value: formatCurrency(mockBillingStats.outstandingAmount),
      icon: IconAlertCircle,
      color: 'red',
      trend: '-8.2%'
    },
    {
      title: 'Insurance Claims',
      value: mockBillingStats.totalClaims,
      icon: IconShield,
      color: 'blue',
      trend: '+12%'
    },
    {
      title: 'Collection Rate',
      value: `${mockBillingStats.collectionRate}%`,
      icon: IconTrendingUp,
      color: 'purple',
      trend: '+2.1%'
    }
  ];

  // Chart data
  const revenueData = mockBillingReports.monthlyRevenue.map(item => ({
    month: item.month,
    revenue: item.totalRevenue,
    collections: item.collections
  }));

  const paymentMethodData = Object.entries(mockBillingStats.paymentMethodDistribution)
    .map(([method, amount]) => ({
      name: method.replace('_', ' ').toUpperCase(),
      value: amount,
      color: getStatusColor(method as PaymentMethod)
    }));

  const claimStatusData = Object.entries(mockBillingStats.claimStatusDistribution).map(
    ([status, count]) => ({ status: status.replace('_', ' '), count })
  );

  return (
    <Container size="xl" py="md">
      {/* Header */}
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={1}>Billing & Insurance Management</Title>
          <Text c="dimmed" size="sm">
            Manage invoices, payments, insurance claims, and financial reporting
          </Text>
        </div>
        <Group>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={openAddInvoice}
          >
            New Invoice
          </Button>
          <Button
            variant="light"
            leftSection={<IconCreditCard size={16} />}
            onClick={openAddPayment}
          >
            Record Payment
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
                  color={stat.trend.startsWith('+') ? 'green' : 'red'} 
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
          <Tabs.Tab value="invoices" leftSection={<IconFileInvoice size={16} />}>
            Invoices
          </Tabs.Tab>
          <Tabs.Tab value="payments" leftSection={<IconCreditCard size={16} />}>
            Payments
          </Tabs.Tab>
          <Tabs.Tab value="insurance" leftSection={<IconShield size={16} />}>
            Insurance Claims
          </Tabs.Tab>
          <Tabs.Tab value="reports" leftSection={<IconChartBar size={16} />}>
            Financial Reports
          </Tabs.Tab>
        </Tabs.List>

        {/* Invoices Tab */}
        <Tabs.Panel value="invoices">
          <Paper p="md" radius="md" withBorder mt="md">
            {/* Search and Filters */}
            <Group mb="md">
              <TextInput
                placeholder="Search invoices..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                style={{ flex: 1 }}
              />
              <Select
                placeholder="Patient"
                data={mockPatients.map(patient => ({ 
                  value: patient.id, 
                  label: `${patient.firstName} ${patient.lastName}` 
                }))}
                value={selectedPatient}
                onChange={setSelectedPatient}
                clearable
              />
              <Select
                placeholder="Status"
                data={[
                  { value: 'draft', label: 'Draft' },
                  { value: 'sent', label: 'Sent' },
                  { value: 'paid', label: 'Paid' },
                  { value: 'overdue', label: 'Overdue' },
                  { value: 'cancelled', label: 'Cancelled' }
                ]}
                value={selectedStatus}
                onChange={setSelectedStatus}
                clearable
              />
              <Button variant="light" onClick={clearFilters}>
                Clear Filters
              </Button>
            </Group>

            {/* Invoices Table */}
            <ScrollArea>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Invoice #</Table.Th>
                    <Table.Th>Patient</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Due Date</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Payment Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredInvoices.map((invoice) => (
                    <Table.Tr key={invoice.id}>
                      <Table.Td>
                        <Text fw={500}>{invoice.invoiceNumber}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Group>
                          <Avatar color="blue" radius="xl" size="sm">
                            {invoice.patient.firstName[0]}{invoice.patient.lastName[0]}
                          </Avatar>
                          <div>
                            <Text size="sm" fw={500}>
                              {invoice.patient.firstName} {invoice.patient.lastName}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {invoice.patient.patientId}
                            </Text>
                          </div>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {new Date(invoice.invoiceDate).toLocaleDateString()}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text 
                          size="sm" 
                          c={new Date(invoice.dueDate) < new Date() ? 'red' : 'dimmed'}
                        >
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={600}>{formatCurrency(invoice.totalAmount)}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getStatusColor(invoice.status)} variant="light">
                          {invoice.status.replace('_', ' ')}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Text size="sm">
                            {formatCurrency(invoice.paidAmount)} / {formatCurrency(invoice.totalAmount)}
                          </Text>
                          <Progress 
                            value={(invoice.paidAmount / invoice.totalAmount) * 100} 
                            size="xs" 
                            w={60}
                            color={invoice.paidAmount >= invoice.totalAmount ? 'green' : 'blue'}
                          />
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => handleViewInvoice(invoice)}
                          >
                            <IconEye size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="subtle"
                            color="green"
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                          <Menu>
                            <Menu.Target>
                              <ActionIcon variant="subtle" color="gray">
                                <IconDotsVertical size={16} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item leftSection={<IconDownload size={14} />}>
                                Download PDF
                              </Menu.Item>
                              <Menu.Item leftSection={<IconPrinter size={14} />}>
                                Print
                              </Menu.Item>
                              <Menu.Item leftSection={<IconMail size={14} />}>
                                Send Email
                              </Menu.Item>
                              <Menu.Divider />
                              <Menu.Item 
                                leftSection={<IconTrash size={14} />}
                                color="red"
                              >
                                Delete
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </Paper>
        </Tabs.Panel>

        {/* Payments Tab */}
        <Tabs.Panel value="payments">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Payment Records</Title>
              <Button leftSection={<IconPlus size={16} />} onClick={openAddPayment}>
                Record Payment
              </Button>
            </Group>

            {/* Payment Filters */}
            <Group mb="md">
              <TextInput
                placeholder="Search payments..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                style={{ flex: 1 }}
              />
              <Select
                placeholder="Payment Method"
                data={[
                  { value: 'cash', label: 'Cash' },
                  { value: 'credit_card', label: 'Credit Card' },
                  { value: 'debit_card', label: 'Debit Card' },
                  { value: 'bank_transfer', label: 'Bank Transfer' },
                  { value: 'insurance', label: 'Insurance' },
                  { value: 'online', label: 'Online Payment' }
                ]}
                value={selectedPaymentMethod}
                onChange={setSelectedPaymentMethod}
                clearable
              />
              <Select
                placeholder="Status"
                data={[
                  { value: 'completed', label: 'Completed' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'failed', label: 'Failed' }
                ]}
                value={selectedStatus}
                onChange={setSelectedStatus}
                clearable
              />
            </Group>

            {/* Payments Grid */}
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
              {filteredPayments.map((payment) => (
                <Card key={payment.id} padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Text fw={600} size="lg">{payment.paymentId}</Text>
                      <Text size="sm" c="dimmed">
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </Text>
                    </div>
                    <Badge color={getStatusColor(payment.status)} variant="light">
                      {payment.status}
                    </Badge>
                  </Group>

                  <Stack gap="sm" mb="md">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Amount</Text>
                      <Text fw={600} size="lg">{formatCurrency(payment.amount)}</Text>
                    </Group>
                    
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Payment Method</Text>
                      <Group gap="xs">
                        {getPaymentMethodIcon(payment.paymentMethod)}
                        <Text size="sm" fw={500}>
                          {payment.paymentMethod.replace('_', ' ').toUpperCase()}
                        </Text>
                      </Group>
                    </Group>

                    {payment.invoiceNumber && (
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Invoice</Text>
                        <Anchor size="sm" fw={500}>
                          {payment.invoiceNumber}
                        </Anchor>
                      </Group>
                    )}

                    {payment.transactionId && (
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Transaction ID</Text>
                        <Text size="sm" fw={500}>{payment.transactionId}</Text>
                      </Group>
                    )}
                  </Stack>

                  {payment.notes && (
                    <Text size="sm" c="dimmed" style={{ 
                      backgroundColor: '#f8f9fa', 
                      padding: '8px', 
                      borderRadius: '4px' 
                    }}>
                      <strong>Notes:</strong> {payment.notes}
                    </Text>
                  )}
                </Card>
              ))}
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>

        {/* Insurance Claims Tab */}
        <Tabs.Panel value="insurance">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Insurance Claims</Title>
              <Button leftSection={<IconPlus size={16} />}>
                Submit Claim
              </Button>
            </Group>

            {/* Claims Table */}
            <ScrollArea>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Claim #</Table.Th>
                    <Table.Th>Patient</Table.Th>
                    <Table.Th>Insurance Provider</Table.Th>
                    <Table.Th>Claim Amount</Table.Th>
                    <Table.Th>Approved Amount</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Date Submitted</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredClaims.map((claim) => (
                    <Table.Tr key={claim.id}>
                      <Table.Td>
                        <Text fw={500}>{claim.claimNumber}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Group>
                          <Avatar color="blue" radius="xl" size="sm">
                            {claim.patient.firstName[0]}{claim.patient.lastName[0]}
                          </Avatar>
                          <div>
                            <Text size="sm" fw={500}>
                              {claim.patient.firstName} {claim.patient.lastName}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {claim.patient.patientId}
                            </Text>
                          </div>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <div>
                          <Text size="sm" fw={500}>{claim.insuranceProvider.name}</Text>
                          <Text size="xs" c="dimmed">{claim.policyNumber}</Text>
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={600}>{formatCurrency(claim.claimAmount)}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={600} c={claim.approvedAmount ? 'green' : 'dimmed'}>
                          {claim.approvedAmount ? formatCurrency(claim.approvedAmount) : 'Pending'}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getStatusColor(claim.status)} variant="light">
                          {claim.status.replace('_', ' ')}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {new Date(claim.submissionDate).toLocaleDateString()}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => handleViewClaim(claim)}
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

        {/* Financial Reports Tab */}
        <Tabs.Panel value="reports">
          <Paper p="md" radius="md" withBorder mt="md">
            <Title order={3} mb="lg">Financial Reports & Analytics</Title>
            
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
              {/* Revenue Trends */}
              <Card padding="lg" radius="md" withBorder style={{ gridColumn: '1 / -1' }}>
                <Title order={4} mb="md">Monthly Revenue & Collections</Title>
                <AreaChart
                  h={300}
                  data={revenueData}
                  dataKey="month"
                  series={[
                    { name: 'revenue', color: 'blue.6', label: 'Revenue' },
                    { name: 'collections', color: 'green.6', label: 'Collections' }
                  ]}
                  curveType="linear"
                />
              </Card>
              
              {/* Payment Methods Distribution */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Payment Methods</Title>
                <DonutChart
                  data={paymentMethodData}
                  size={160}
                  thickness={30}
                  withLabels
                />
              </Card>
              
              {/* Claim Status Distribution */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Insurance Claims Status</Title>
                <BarChart
                  h={200}
                  data={claimStatusData}
                  dataKey="status"
                  series={[{ name: 'count', color: 'orange.6' }]}
                />
              </Card>
              
              {/* Key Metrics */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Key Financial Metrics</Title>
                <Stack gap="md">
                  <Group justify="space-between" p="sm" 
                         style={{ backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                    <Text size="sm" fw={500}>Average Invoice Amount</Text>
                    <Text size="sm" fw={600}>
                      {formatCurrency(mockBillingStats.averageInvoiceAmount)}
                    </Text>
                  </Group>
                  <Group justify="space-between" p="sm" 
                         style={{ backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                    <Text size="sm" fw={500}>Days Sales Outstanding</Text>
                    <Text size="sm" fw={600}>
                      {mockBillingStats.daysOutstanding} days
                    </Text>
                  </Group>
                  <Group justify="space-between" p="sm" 
                         style={{ backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                    <Text size="sm" fw={500}>Insurance Coverage Rate</Text>
                    <Text size="sm" fw={600}>
                      {mockBillingStats.insuranceCoverageRate}%
                    </Text>
                  </Group>
                  <Group justify="space-between" p="sm" 
                         style={{ backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                    <Text size="sm" fw={500}>Bad Debt Rate</Text>
                    <Text size="sm" fw={600} c="red">
                      {mockBillingStats.badDebtRate}%
                    </Text>
                  </Group>
                </Stack>
              </Card>
              
              {/* Quick Actions */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Quick Actions</Title>
                <Stack gap="sm">
                  <Button fullWidth leftSection={<IconDownload size={16} />} variant="light">
                    Export Revenue Report
                  </Button>
                  <Button fullWidth leftSection={<IconFileText size={16} />} variant="light">
                    Generate Aging Report
                  </Button>
                  <Button fullWidth leftSection={<IconCalculator size={16} />} variant="light">
                    Tax Summary Report
                  </Button>
                  <Button fullWidth leftSection={<IconChartBar size={16} />} variant="light">
                    Performance Analytics
                  </Button>
                </Stack>
              </Card>
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>
      </Tabs>

      {/* Invoice Detail Modal */}
      <Modal
        opened={invoiceDetailOpened}
        onClose={closeInvoiceDetail}
        title="Invoice Details"
        size="xl"
      >
        {selectedInvoice && (
          <ScrollArea h={600}>
            <Stack gap="md">
              {/* Invoice Header */}
              <Group justify="space-between">
                <div>
                  <Title order={3}>{selectedInvoice.invoiceNumber}</Title>
                  <Text c="dimmed">
                    {new Date(selectedInvoice.invoiceDate).toLocaleDateString()}
                  </Text>
                </div>
                <Badge color={getStatusColor(selectedInvoice.status)} variant="light" size="lg">
                  {selectedInvoice.status.replace('_', ' ')}
                </Badge>
              </Group>

              <Divider />

              {/* Patient & Billing Info */}
              <SimpleGrid cols={2}>
                <div>
                  <Text size="sm" fw={500} mb="sm">Bill To:</Text>
                  <Stack gap={4}>
                    <Text size="sm">
                      {selectedInvoice.patient.firstName} {selectedInvoice.patient.lastName}
                    </Text>
                    <Text size="sm" c="dimmed">{selectedInvoice.patient.patientId}</Text>
                    <Text size="sm" c="dimmed">{selectedInvoice.billingAddress.street}</Text>
                    <Text size="sm" c="dimmed">
                      {selectedInvoice.billingAddress.city}, {selectedInvoice.billingAddress.state}
                    </Text>
                  </Stack>
                </div>
                <div>
                  <Text size="sm" fw={500} mb="sm">Invoice Details:</Text>
                  <Stack gap={4}>
                    <Text size="sm">Due Date: {new Date(selectedInvoice.dueDate).toLocaleDateString()}</Text>
                    <Text size="sm">Terms: {selectedInvoice.paymentTerms} days</Text>
                    {selectedInvoice.insuranceClaim && (
                      <Text size="sm">Insurance Claim: {selectedInvoice.insuranceClaim.claimNumber}</Text>
                    )}
                  </Stack>
                </div>
              </SimpleGrid>

              <Divider />

              {/* Invoice Items */}
              <div>
                <Text size="sm" fw={500} mb="sm">Items & Services</Text>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Description</Table.Th>
                      <Table.Th>Quantity</Table.Th>
                      <Table.Th>Unit Price</Table.Th>
                      <Table.Th>Total</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {selectedInvoice.items.map((item) => (
                      <Table.Tr key={item.id}>
                        <Table.Td>
                          <div>
                            <Text size="sm" fw={500}>{item.description}</Text>
                            {item.itemCode && (
                              <Text size="xs" c="dimmed">Code: {item.itemCode}</Text>
                            )}
                          </div>
                        </Table.Td>
                        <Table.Td>{item.quantity}</Table.Td>
                        <Table.Td>{formatCurrency(item.unitPrice)}</Table.Td>
                        <Table.Td>{formatCurrency(item.totalAmount)}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>

              <Divider />

              {/* Totals */}
              <Group justify="flex-end">
                <Stack gap="xs" align="flex-end">
                  <Group>
                    <Text size="sm">Subtotal:</Text>
                    <Text size="sm" fw={600}>{formatCurrency(selectedInvoice.subtotal)}</Text>
                  </Group>
                  <Group>
                    <Text size="sm">Tax ({selectedInvoice.taxRate}%):</Text>
                    <Text size="sm" fw={600}>{formatCurrency(selectedInvoice.taxAmount)}</Text>
                  </Group>
                  <Group>
                    <Text fw={700}>Total Amount:</Text>
                    <Text fw={700} size="lg">{formatCurrency(selectedInvoice.totalAmount)}</Text>
                  </Group>
                  <Group>
                    <Text size="sm" c="green">Paid Amount:</Text>
                    <Text size="sm" fw={600} c="green">{formatCurrency(selectedInvoice.paidAmount)}</Text>
                  </Group>
                  <Group>
                    <Text size="sm" c="red">Outstanding:</Text>
                    <Text size="sm" fw={600} c="red">
                      {formatCurrency(selectedInvoice.totalAmount - selectedInvoice.paidAmount)}
                    </Text>
                  </Group>
                </Stack>
              </Group>

              <Group justify="flex-end" mt="lg">
                <Button variant="light" onClick={closeInvoiceDetail}>
                  Close
                </Button>
                <Button leftSection={<IconDownload size={16} />}>
                  Download PDF
                </Button>
                <Button leftSection={<IconMail size={16} />} variant="outline">
                  Send Email
                </Button>
              </Group>
            </Stack>
          </ScrollArea>
        )}
      </Modal>

      {/* Add Invoice Modal */}
      <Modal
        opened={addInvoiceOpened}
        onClose={closeAddInvoice}
        title="Create New Invoice"
        size="lg"
      >
        <Stack gap="md">
          <SimpleGrid cols={2}>
            <Select
              label="Patient"
              placeholder="Select patient"
              data={mockPatients.map(patient => ({ 
                value: patient.id, 
                label: `${patient.firstName} ${patient.lastName}` 
              }))}
              required
            />
            <DatePicker
              label="Due Date"
              placeholder="Select due date"
              required
            />
          </SimpleGrid>
          
          <NumberInput
            label="Payment Terms (Days)"
            placeholder="30"
            defaultValue={30}
            min={0}
            max={365}
          />
          
          <Divider label="Invoice Items" labelPosition="center" />
          
          <SimpleGrid cols={3}>
            <TextInput
              label="Service/Item"
              placeholder="Consultation fee"
              required
            />
            <NumberInput
              label="Quantity"
              placeholder="1"
              min={1}
              defaultValue={1}
            />
            <NumberInput
              label="Unit Price"
              placeholder="500"
              min={0}
              leftSection="₹"
            />
          </SimpleGrid>
          
          <Button variant="light" leftSection={<IconPlus size={16} />}>
            Add More Items
          </Button>
          
          <Divider />
          
          <SimpleGrid cols={2}>
            <NumberInput
              label="Tax Rate (%)"
              placeholder="18"
              min={0}
              max={100}
              defaultValue={18}
            />
            <NumberInput
              label="Discount Amount"
              placeholder="0"
              min={0}
              leftSection="₹"
            />
          </SimpleGrid>
          
          <Textarea
            label="Notes"
            placeholder="Additional notes or terms..."
            rows={3}
          />
          
          <Group justify="flex-end">
            <Button variant="light" onClick={closeAddInvoice}>
              Cancel
            </Button>
            <Button onClick={() => {
              notifications.show({
                title: 'Success',
                message: 'Invoice created successfully',
                color: 'green',
              });
              closeAddInvoice();
            }}>
              Create Invoice
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Add Payment Modal */}
      <Modal
        opened={addPaymentOpened}
        onClose={closeAddPayment}
        title="Record Payment"
        size="md"
      >
        <Stack gap="md">
          <Select
            label="Invoice"
            placeholder="Select invoice"
            data={mockInvoices.map(invoice => ({ 
              value: invoice.id, 
              label: `${invoice.invoiceNumber} - ${formatCurrency(invoice.totalAmount - invoice.paidAmount)}` 
            }))}
            required
          />
          
          <NumberInput
            label="Payment Amount"
            placeholder="Enter amount"
            leftSection="₹"
            min={0}
            required
          />
          
          <Select
            label="Payment Method"
            placeholder="Select method"
            data={[
              { value: 'cash', label: 'Cash' },
              { value: 'credit_card', label: 'Credit Card' },
              { value: 'debit_card', label: 'Debit Card' },
              { value: 'bank_transfer', label: 'Bank Transfer' },
              { value: 'online', label: 'Online Payment' }
            ]}
            required
          />
          
          <TextInput
            label="Transaction ID"
            placeholder="Enter transaction reference"
          />
          
          <DatePicker
            label="Payment Date"
            placeholder="Select date"
            defaultValue={new Date()}
          />
          
          <Textarea
            label="Notes"
            placeholder="Payment notes..."
            rows={3}
          />
          
          <Group justify="flex-end">
            <Button variant="light" onClick={closeAddPayment}>
              Cancel
            </Button>
            <Button onClick={() => {
              notifications.show({
                title: 'Success',
                message: 'Payment recorded successfully',
                color: 'green',
              });
              closeAddPayment();
            }}>
              Record Payment
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default BillingManagement;