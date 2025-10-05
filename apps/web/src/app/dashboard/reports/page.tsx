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
  ActionIcon,
  Stack,
  SimpleGrid,
  ScrollArea,
  ThemeIcon,
  Progress,
  DatePickerInput,
  MultiSelect,
  Divider,
  Alert,
  Timeline,
  Switch,
  NumberInput
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { LineChart, BarChart, DonutChart, AreaChart } from '@mantine/charts';
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconEye,
  IconTrash,
  IconDownload,
  IconChartBar,
  IconReportAnalytics,
  IconFileText,
  IconCalendar,
  IconUsers,
  IconCurrencyDollar,
  IconBed,
  IconStethoscope,
  IconActivity,
  IconTrendingUp,
  IconTrendingDown,
  IconClipboard,
  IconPrinter,
  IconShare,
  IconFilter,
  IconRefresh,
  IconFileSpreadsheet,
  IconFilePdf,
  IconMail,
  IconClock,
  IconCheck,
  IconX,
  IconAlertCircle,
  IconChartLine,
  IconChartPie,
  IconDatabase,
  IconSettings,
  IconCalendarEvent,
  IconTarget,
  IconDeviceAnalytics
} from '@tabler/icons-react';

// Types
interface Report {
  id: string;
  name: string;
  description: string;
  category: string;
  type: 'financial' | 'operational' | 'clinical' | 'quality' | 'administrative';
  format: 'PDF' | 'Excel' | 'CSV' | 'Dashboard';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'on-demand';
  status: 'active' | 'inactive' | 'scheduled' | 'running' | 'completed' | 'failed';
  lastGenerated: string;
  nextRun?: string;
  createdBy: string;
  createdAt: string;
  parameters: Array<{
    name: string;
    type: string;
    value: any;
  }>;
  recipients: string[];
  size?: string;
  executionTime?: number;
}

interface Analytics {
  id: string;
  title: string;
  description: string;
  category: string;
  metrics: Array<{
    name: string;
    value: number | string;
    change?: {
      value: number;
      type: 'increase' | 'decrease';
      period: string;
    };
  }>;
  chartType: 'line' | 'bar' | 'pie' | 'area';
  chartData: any[];
  lastUpdated: string;
}

// Mock data
const mockReports: Report[] = [
  {
    id: '1',
    name: 'Monthly Revenue Report',
    description: 'Comprehensive revenue analysis for the month',
    category: 'Financial Reports',
    type: 'financial',
    format: 'PDF',
    frequency: 'monthly',
    status: 'completed',
    lastGenerated: '2024-01-01T09:00:00Z',
    nextRun: '2024-02-01T09:00:00Z',
    createdBy: 'Finance Team',
    createdAt: '2023-12-01T10:00:00Z',
    parameters: [
      { name: 'month', type: 'date', value: '2024-01' },
      { name: 'department', type: 'string', value: 'all' }
    ],
    recipients: ['finance@hospital.com', 'admin@hospital.com'],
    size: '2.3 MB',
    executionTime: 45
  },
  {
    id: '2',
    name: 'Patient Satisfaction Survey',
    description: 'Weekly patient feedback and satisfaction metrics',
    category: 'Quality Reports',
    type: 'quality',
    format: 'Excel',
    frequency: 'weekly',
    status: 'active',
    lastGenerated: '2024-01-08T10:00:00Z',
    nextRun: '2024-01-15T10:00:00Z',
    createdBy: 'Quality Team',
    createdAt: '2023-11-15T14:30:00Z',
    parameters: [
      { name: 'week', type: 'date', value: '2024-W02' },
      { name: 'rating_threshold', type: 'number', value: 4 }
    ],
    recipients: ['quality@hospital.com', 'nursing@hospital.com'],
    size: '1.8 MB',
    executionTime: 25
  },
  {
    id: '3',
    name: 'Daily Census Report',
    description: 'Daily patient census and bed occupancy',
    category: 'Operational Reports',
    type: 'operational',
    format: 'Dashboard',
    frequency: 'daily',
    status: 'running',
    lastGenerated: '2024-01-15T06:00:00Z',
    nextRun: '2024-01-16T06:00:00Z',
    createdBy: 'Operations Team',
    createdAt: '2023-10-01T08:00:00Z',
    parameters: [
      { name: 'date', type: 'date', value: '2024-01-15' },
      { name: 'include_icu', type: 'boolean', value: true }
    ],
    recipients: ['operations@hospital.com', 'nursing@hospital.com'],
    size: '0.5 MB',
    executionTime: 10
  },
  {
    id: '4',
    name: 'Clinical Outcomes Report',
    description: 'Monthly clinical performance and outcomes analysis',
    category: 'Clinical Reports',
    type: 'clinical',
    format: 'PDF',
    frequency: 'monthly',
    status: 'scheduled',
    lastGenerated: '2023-12-31T23:00:00Z',
    nextRun: '2024-01-31T23:00:00Z',
    createdBy: 'Clinical Team',
    createdAt: '2023-09-15T11:00:00Z',
    parameters: [
      { name: 'month', type: 'date', value: '2024-01' },
      { name: 'specialty', type: 'string', value: 'all' }
    ],
    recipients: ['clinical@hospital.com', 'doctors@hospital.com'],
    size: '3.1 MB',
    executionTime: 60
  }
];

const mockAnalytics: Analytics[] = [
  {
    id: '1',
    title: 'Patient Flow Trends',
    description: 'Daily patient admissions and discharges',
    category: 'Operational Analytics',
    metrics: [
      { name: 'Admissions Today', value: 45, change: { value: 12, type: 'increase', period: 'vs yesterday' } },
      { name: 'Discharges Today', value: 38, change: { value: 5, type: 'decrease', period: 'vs yesterday' } },
      { name: 'Average LOS', value: '3.2 days', change: { value: 8, type: 'decrease', period: 'vs last month' } }
    ],
    chartType: 'line',
    chartData: [
      { date: 'Jan 10', admissions: 42, discharges: 35 },
      { date: 'Jan 11', admissions: 38, discharges: 41 },
      { date: 'Jan 12', admissions: 45, discharges: 39 },
      { date: 'Jan 13', admissions: 41, discharges: 36 },
      { date: 'Jan 14', admissions: 48, discharges: 42 },
      { date: 'Jan 15', admissions: 45, discharges: 38 }
    ],
    lastUpdated: '2024-01-15T14:30:00Z'
  },
  {
    id: '2',
    title: 'Revenue Analysis',
    description: 'Monthly revenue breakdown by department',
    category: 'Financial Analytics',
    metrics: [
      { name: 'Total Revenue', value: '₹8,45,000', change: { value: 15, type: 'increase', period: 'vs last month' } },
      { name: 'Insurance Claims', value: '₹5,20,000', change: { value: 8, type: 'increase', period: 'vs last month' } },
      { name: 'Outstanding Amount', value: '₹1,25,000', change: { value: 5, type: 'decrease', period: 'vs last month' } }
    ],
    chartType: 'bar',
    chartData: [
      { department: 'Cardiology', revenue: 150000 },
      { department: 'Orthopedics', revenue: 120000 },
      { department: 'General Medicine', revenue: 100000 },
      { department: 'Surgery', revenue: 180000 },
      { department: 'Emergency', revenue: 90000 }
    ],
    lastUpdated: '2024-01-15T14:25:00Z'
  }
];

const ReportsAnalytics = () => {
  // State management
  const [activeTab, setActiveTab] = useState<string>('reports');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Modal states
  const [reportDetailOpened, { open: openReportDetail, close: closeReportDetail }] = useDisclosure(false);
  const [createReportOpened, { open: openCreateReport, close: closeCreateReport }] = useDisclosure(false);
  const [scheduleReportOpened, { open: openScheduleReport, close: closeScheduleReport }] = useDisclosure(false);

  // Filter reports
  const filteredReports = useMemo(() => {
    return mockReports.filter((report) => {
      const matchesSearch = 
        report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || report.category === selectedCategory;
      const matchesStatus = !selectedStatus || report.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchQuery, selectedCategory, selectedStatus]);

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    openReportDetail();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'active': return 'blue';
      case 'running': return 'orange';
      case 'scheduled': return 'cyan';
      case 'failed': return 'red';
      case 'inactive': return 'gray';
      default: return 'gray';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'PDF': return <IconFilePdf size={16} />;
      case 'Excel': return <IconFileSpreadsheet size={16} />;
      case 'CSV': return <IconFileText size={16} />;
      case 'Dashboard': return <IconChartBar size={16} />;
      default: return <IconFileText size={16} />;
    }
  };

  // Quick stats
  const reportStats = {
    total: mockReports.length,
    active: mockReports.filter(r => r.status === 'active' || r.status === 'scheduled').length,
    completed: mockReports.filter(r => r.status === 'completed').length,
    failed: mockReports.filter(r => r.status === 'failed').length
  };

  return (
    <Container size="xl" py="md">
      {/* Header */}
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={1}>Reports & Analytics</Title>
          <Text c="dimmed" size="sm">
            Comprehensive reporting and business intelligence dashboard
          </Text>
        </div>
        <Group>
          <Button variant="light" leftSection={<IconRefresh size={16} />}>
            Refresh All
          </Button>
          <Button leftSection={<IconPlus size={16} />} onClick={openCreateReport}>
            Create Report
          </Button>
        </Group>
      </Group>

      {/* Quick Stats */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="lg">
        <Card padding="lg" radius="md" withBorder>
          <Group justify="space-between">
            <div>
              <Text c="dimmed" size="sm" fw={500}>Total Reports</Text>
              <Text fw={700} size="xl">{reportStats.total}</Text>
            </div>
            <ThemeIcon color="blue" size="xl" radius="md" variant="light">
              <IconFileText size={24} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card padding="lg" radius="md" withBorder>
          <Group justify="space-between">
            <div>
              <Text c="dimmed" size="sm" fw={500}>Active Reports</Text>
              <Text fw={700} size="xl">{reportStats.active}</Text>
            </div>
            <ThemeIcon color="green" size="xl" radius="md" variant="light">
              <IconActivity size={24} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card padding="lg" radius="md" withBorder>
          <Group justify="space-between">
            <div>
              <Text c="dimmed" size="sm" fw={500}>Completed Today</Text>
              <Text fw={700} size="xl">{reportStats.completed}</Text>
            </div>
            <ThemeIcon color="cyan" size="xl" radius="md" variant="light">
              <IconCheck size={24} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card padding="lg" radius="md" withBorder>
          <Group justify="space-between">
            <div>
              <Text c="dimmed" size="sm" fw={500}>Failed Reports</Text>
              <Text fw={700} size="xl">{reportStats.failed}</Text>
            </div>
            <ThemeIcon color="red" size="xl" radius="md" variant="light">
              <IconAlertCircle size={24} />
            </ThemeIcon>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="reports" leftSection={<IconFileText size={16} />}>
            All Reports
          </Tabs.Tab>
          <Tabs.Tab value="analytics" leftSection={<IconChartBar size={16} />}>
            Analytics
          </Tabs.Tab>
          <Tabs.Tab value="dashboards" leftSection={<IconDeviceAnalytics size={16} />}>
            Dashboards
          </Tabs.Tab>
        </Tabs.List>

        {/* Reports Tab */}
        <Tabs.Panel value="reports">
          <Paper p="md" radius="md" withBorder mt="md">
            {/* Filters */}
            <Group mb="md">
              <TextInput
                placeholder="Search reports..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                style={{ flex: 1 }}
              />
              <Select
                placeholder="Category"
                data={[
                  { value: 'Financial Reports', label: 'Financial Reports' },
                  { value: 'Operational Reports', label: 'Operational Reports' },
                  { value: 'Clinical Reports', label: 'Clinical Reports' },
                  { value: 'Quality Reports', label: 'Quality Reports' }
                ]}
                value={selectedCategory}
                onChange={setSelectedCategory}
                clearable
              />
              <Select
                placeholder="Status"
                data={[
                  { value: 'active', label: 'Active' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'running', label: 'Running' },
                  { value: 'scheduled', label: 'Scheduled' },
                  { value: 'failed', label: 'Failed' },
                  { value: 'inactive', label: 'Inactive' }
                ]}
                value={selectedStatus}
                onChange={setSelectedStatus}
                clearable
              />
            </Group>

            {/* Reports Table */}
            <ScrollArea>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Report Name</Table.Th>
                    <Table.Th>Category</Table.Th>
                    <Table.Th>Format</Table.Th>
                    <Table.Th>Frequency</Table.Th>
                    <Table.Th>Last Generated</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredReports.map((report) => (
                    <Table.Tr key={report.id}>
                      <Table.Td>
                        <div>
                          <Text fw={500} size="sm">{report.name}</Text>
                          <Text size="xs" c="dimmed" lineClamp={1}>{report.description}</Text>
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <Badge variant="light" size="sm">
                          {report.category}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          {getFormatIcon(report.format)}
                          <Text size="sm">{report.format}</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" tt="capitalize">{report.frequency}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{formatDate(report.lastGenerated)}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getStatusColor(report.status)} variant="light">
                          {report.status.toUpperCase()}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
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
                            <IconEdit size={16} />
                          </ActionIcon>
                          <ActionIcon variant="subtle" color="purple">
                            <IconCalendarEvent size={16} />
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

        {/* Analytics Tab */}
        <Tabs.Panel value="analytics">
          <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg" mt="md">
            {mockAnalytics.map((analytics) => (
              <Card key={analytics.id} padding="lg" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                  <div>
                    <Title order={4}>{analytics.title}</Title>
                    <Text size="sm" c="dimmed">{analytics.description}</Text>
                  </div>
                  <Badge variant="light">{analytics.category}</Badge>
                </Group>

                {/* Metrics */}
                <SimpleGrid cols={3} spacing="md" mb="md">
                  {analytics.metrics.map((metric, index) => (
                    <div key={index} style={{ textAlign: 'center' }}>
                      <Text size="xl" fw={700} mb="xs">{metric.value}</Text>
                      <Text size="xs" c="dimmed" mb="xs">{metric.name}</Text>
                      {metric.change && (
                        <Group justify="center" gap="xs">
                          {metric.change.type === 'increase' ? 
                            <IconTrendingUp size={14} color="green" /> : 
                            <IconTrendingDown size={14} color="red" />
                          }
                          <Text 
                            size="xs" 
                            c={metric.change.type === 'increase' ? 'green' : 'red'}
                            fw={500}
                          >
                            {metric.change.value}%
                          </Text>
                        </Group>
                      )}
                    </div>
                  ))}
                </SimpleGrid>

                {/* Chart */}
                {analytics.chartType === 'line' && (
                  <LineChart
                    h={200}
                    data={analytics.chartData}
                    dataKey="date"
                    series={[
                      { name: 'admissions', color: 'blue.6' },
                      { name: 'discharges', color: 'red.6' }
                    ]}
                    curveType="linear"
                  />
                )}

                {analytics.chartType === 'bar' && (
                  <BarChart
                    h={200}
                    data={analytics.chartData}
                    dataKey="department"
                    series={[{ name: 'revenue', color: 'green.6' }]}
                  />
                )}

                <Text size="xs" c="dimmed" ta="right" mt="sm">
                  Last updated: {formatDate(analytics.lastUpdated)}
                </Text>
              </Card>
            ))}
          </SimpleGrid>
        </Tabs.Panel>

        {/* Dashboards Tab */}
        <Tabs.Panel value="dashboards">
          <Paper p="md" radius="md" withBorder mt="md">
            <Title order={3} mb="lg">Interactive Dashboards</Title>
            
            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
              {/* Executive Dashboard */}
              <Card padding="lg" radius="md" withBorder>
                <ThemeIcon size="xl" color="blue" mb="md">
                  <IconChartPie size={24} />
                </ThemeIcon>
                <Title order={5} mb="xs">Executive Dashboard</Title>
                <Text size="sm" c="dimmed" mb="md">
                  High-level KPIs and strategic metrics for leadership
                </Text>
                <Group justify="space-between">
                  <Badge variant="light" color="green">Live</Badge>
                  <Button size="xs" variant="light">Open Dashboard</Button>
                </Group>
              </Card>

              {/* Operations Dashboard */}
              <Card padding="lg" radius="md" withBorder>
                <ThemeIcon size="xl" color="orange" mb="md">
                  <IconActivity size={24} />
                </ThemeIcon>
                <Title order={5} mb="xs">Operations Dashboard</Title>
                <Text size="sm" c="dimmed" mb="md">
                  Real-time operational metrics and bed management
                </Text>
                <Group justify="space-between">
                  <Badge variant="light" color="green">Live</Badge>
                  <Button size="xs" variant="light">Open Dashboard</Button>
                </Group>
              </Card>

              {/* Financial Dashboard */}
              <Card padding="lg" radius="md" withBorder>
                <ThemeIcon size="xl" color="green" mb="md">
                  <IconCurrencyDollar size={24} />
                </ThemeIcon>
                <Title order={5} mb="xs">Financial Dashboard</Title>
                <Text size="sm" c="dimmed" mb="md">
                  Revenue, billing, and financial performance tracking
                </Text>
                <Group justify="space-between">
                  <Badge variant="light" color="green">Live</Badge>
                  <Button size="xs" variant="light">Open Dashboard</Button>
                </Group>
              </Card>

              {/* Quality Dashboard */}
              <Card padding="lg" radius="md" withBorder>
                <ThemeIcon size="xl" color="purple" mb="md">
                  <IconTarget size={24} />
                </ThemeIcon>
                <Title order={5} mb="xs">Quality Dashboard</Title>
                <Text size="sm" c="dimmed" mb="md">
                  Patient safety, satisfaction, and quality indicators
                </Text>
                <Group justify="space-between">
                  <Badge variant="light" color="green">Live</Badge>
                  <Button size="xs" variant="light">Open Dashboard</Button>
                </Group>
              </Card>

              {/* Clinical Dashboard */}
              <Card padding="lg" radius="md" withBorder>
                <ThemeIcon size="xl" color="red" mb="md">
                  <IconStethoscope size={24} />
                </ThemeIcon>
                <Title order={5} mb="xs">Clinical Dashboard</Title>
                <Text size="sm" c="dimmed" mb="md">
                  Clinical outcomes, patient flow, and care metrics
                </Text>
                <Group justify="space-between">
                  <Badge variant="light" color="green">Live</Badge>
                  <Button size="xs" variant="light">Open Dashboard</Button>
                </Group>
              </Card>

              {/* Custom Dashboard */}
              <Card padding="lg" radius="md" withBorder style={{ border: '2px dashed #e9ecef' }}>
                <ThemeIcon size="xl" color="gray" mb="md">
                  <IconPlus size={24} />
                </ThemeIcon>
                <Title order={5} mb="xs">Create Custom Dashboard</Title>
                <Text size="sm" c="dimmed" mb="md">
                  Build your own dashboard with custom metrics
                </Text>
                <Button size="xs" variant="outline" fullWidth>
                  Create Dashboard
                </Button>
              </Card>
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>
      </Tabs>

      {/* Report Detail Modal */}
      <Modal
        opened={reportDetailOpened}
        onClose={closeReportDetail}
        title="Report Details"
        size="lg"
      >
        {selectedReport && (
          <Stack gap="md">
            <Group justify="space-between">
              <div>
                <Title order={3}>{selectedReport.name}</Title>
                <Text c="dimmed">{selectedReport.description}</Text>
              </div>
              <Badge color={getStatusColor(selectedReport.status)} variant="light">
                {selectedReport.status.toUpperCase()}
              </Badge>
            </Group>

            <Divider />

            <SimpleGrid cols={2} spacing="md">
              <div>
                <Text size="sm" c="dimmed" fw={500}>Category</Text>
                <Text>{selectedReport.category}</Text>
              </div>
              <div>
                <Text size="sm" c="dimmed" fw={500}>Format</Text>
                <Text>{selectedReport.format}</Text>
              </div>
              <div>
                <Text size="sm" c="dimmed" fw={500}>Frequency</Text>
                <Text tt="capitalize">{selectedReport.frequency}</Text>
              </div>
              <div>
                <Text size="sm" c="dimmed" fw={500}>Created By</Text>
                <Text>{selectedReport.createdBy}</Text>
              </div>
              <div>
                <Text size="sm" c="dimmed" fw={500}>Last Generated</Text>
                <Text>{formatDate(selectedReport.lastGenerated)}</Text>
              </div>
              {selectedReport.nextRun && (
                <div>
                  <Text size="sm" c="dimmed" fw={500}>Next Run</Text>
                  <Text>{formatDate(selectedReport.nextRun)}</Text>
                </div>
              )}
            </SimpleGrid>

            <div>
              <Text size="sm" c="dimmed" fw={500} mb="xs">Recipients</Text>
              <Group gap="xs">
                {selectedReport.recipients.map((recipient, index) => (
                  <Badge key={index} variant="outline" size="sm">
                    {recipient}
                  </Badge>
                ))}
              </Group>
            </div>

            <div>
              <Text size="sm" c="dimmed" fw={500} mb="xs">Parameters</Text>
              <Stack gap="xs">
                {selectedReport.parameters.map((param, index) => (
                  <Group key={index} justify="space-between" p="xs" style={{ backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                    <Text size="sm" fw={500}>{param.name}</Text>
                    <Text size="sm">{param.value}</Text>
                  </Group>
                ))}
              </Stack>
            </div>

            <Group justify="flex-end">
              <Button variant="light" onClick={closeReportDetail}>Close</Button>
              <Button variant="light" leftSection={<IconDownload size={16} />}>
                Download
              </Button>
              <Button leftSection={<IconShare size={16} />}>
                Share
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Create Report Modal */}
      <Modal
        opened={createReportOpened}
        onClose={closeCreateReport}
        title="Create New Report"
        size="lg"
      >
        <Stack gap="md">
          <SimpleGrid cols={2} spacing="md">
            <TextInput
              label="Report Name"
              placeholder="Enter report name"
              required
            />
            <Select
              label="Category"
              placeholder="Select category"
              data={[
                { value: 'financial', label: 'Financial' },
                { value: 'operational', label: 'Operational' },
                { value: 'clinical', label: 'Clinical' },
                { value: 'quality', label: 'Quality' }
              ]}
              required
            />
          </SimpleGrid>

          <TextInput
            label="Description"
            placeholder="Enter report description"
          />

          <SimpleGrid cols={2} spacing="md">
            <Select
              label="Format"
              placeholder="Select format"
              data={[
                { value: 'PDF', label: 'PDF' },
                { value: 'Excel', label: 'Excel' },
                { value: 'CSV', label: 'CSV' },
                { value: 'Dashboard', label: 'Dashboard' }
              ]}
              required
            />
            <Select
              label="Frequency"
              placeholder="Select frequency"
              data={[
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'quarterly', label: 'Quarterly' },
                { value: 'yearly', label: 'Yearly' },
                { value: 'on-demand', label: 'On Demand' }
              ]}
              required
            />
          </SimpleGrid>

          <MultiSelect
            label="Recipients"
            placeholder="Select recipients"
            data={[
              { value: 'finance@hospital.com', label: 'Finance Team' },
              { value: 'operations@hospital.com', label: 'Operations Team' },
              { value: 'clinical@hospital.com', label: 'Clinical Team' },
              { value: 'admin@hospital.com', label: 'Administration' }
            ]}
            searchable
          />

          <Group justify="flex-end">
            <Button variant="light" onClick={closeCreateReport}>
              Cancel
            </Button>
            <Button onClick={() => {
              notifications.show({
                title: 'Report Created',
                message: 'New report has been successfully created',
                color: 'green',
              });
              closeCreateReport();
            }}>
              Create Report
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default ReportsAnalytics;