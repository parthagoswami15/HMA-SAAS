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
  Stack,
  SimpleGrid,
  ScrollArea,
  ThemeIcon,
  Alert,
  Progress,
  NumberInput,
  Textarea,
  Timeline,
  RingProgress,
  List,
  MultiSelect,
  Center,
  Divider,
  Stepper
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { DonutChart, BarChart, AreaChart, LineChart } from '@mantine/charts';
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconEye,
  IconTrash,
  IconCalendar,
  IconUrgent,
  IconChartBar,
  IconPhone,
  IconMail,
  IconAlertCircle,
  IconCheck,
  IconX,
  IconDotsVertical,
  IconAlertTriangle,
  IconHeartbeat,
  IconClipboardList,
  IconFileText,
  IconDownload,
  IconPrinter,
  IconShare,
  IconActivity,
  IconExclamationMark,
  IconClockHour4,
  IconTrendingUp,
  IconTrendingDown,
  IconUsers,
  IconCalculator,
  IconSettings,
  IconRefresh,
  IconFilter,
  IconBarcode,
  IconTemperature,
  IconShieldCheck,
  IconCircleCheck,
  IconClipboard,
  IconReportMedical,
  IconVital,
  IconLungs,
  IconHeart,
  IconBrain,
  IconBone,
  IconStethoscope,
  IconMedicalCross,
  IconPackage,
  IconTruck,
  IconCash,
  IconReceipt,
  IconNotes,
  IconClock,
  IconTag,
  IconAlarm,
  IconInfoCircle,
  IconBed,
  IconAmbulance,
  IconBell,
  IconFlask,
  IconDroplet,
  IconNurse,
  IconBandage,
  IconPill,
  IconSyringe
} from '@tabler/icons-react';

// Import types and mock data
import {
  EmergencyCase,
  Triage,
  TriageLevel,
  CaseStatus,
  ICUBed,
  BedStatus,
  VitalSigns,
  CriticalCareEquipment,
  EquipmentStatus,
  EmergencyProtocol,
  EmergencyStats,
  EmergencyFilters
} from '../../../types/emergency';
import {
  mockEmergencyCases,
  mockICUBeds,
  mockCriticalCareEquipment,
  mockEmergencyProtocols,
  mockEmergencyStats,
  mockTriageQueue
} from '../../../lib/mockData/emergency';
import { mockPatients } from '../../../lib/mockData/patients';
import { mockStaff } from '../../../lib/mockData/staff';

const EmergencyManagement = () => {
  // State management
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTriage, setSelectedTriage] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedBedStatus, setSelectedBedStatus] = useState<string>('');
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [selectedBed, setSelectedBed] = useState<ICUBed | null>(null);

  // Modal states
  const [caseDetailOpened, { open: openCaseDetail, close: closeCaseDetail }] = useDisclosure(false);
  const [addCaseOpened, { open: openAddCase, close: closeAddCase }] = useDisclosure(false);
  const [bedDetailOpened, { open: openBedDetail, close: closeBedDetail }] = useDisclosure(false);
  const [triageOpened, { open: openTriage, close: closeTriage }] = useDisclosure(false);
  const [protocolOpened, { open: openProtocol, close: closeProtocol }] = useDisclosure(false);

  // Filter emergency cases
  const filteredCases = useMemo(() => {
    return mockEmergencyCases.filter((emergencyCase) => {
      const matchesSearch = 
        emergencyCase.patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emergencyCase.patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emergencyCase.caseNumber.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTriage = !selectedTriage || emergencyCase.triageLevel === selectedTriage;
      const matchesStatus = !selectedStatus || emergencyCase.status === selectedStatus;

      return matchesSearch && matchesTriage && matchesStatus;
    });
  }, [searchQuery, selectedTriage, selectedStatus]);

  // Filter ICU beds
  const filteredBeds = useMemo(() => {
    return mockICUBeds.filter((bed) => {
      const matchesSearch = 
        bed.bedNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (bed.patient && 
         (bed.patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bed.patient.lastName.toLowerCase().includes(searchQuery.toLowerCase())));
      
      const matchesStatus = !selectedBedStatus || bed.status === selectedBedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedBedStatus]);

  // Helper functions
  const getTriageColor = (level: number | TriageLevel) => {
    switch (level) {
      case 1:
      case 'immediate': return 'red';    // Resuscitation/Immediate
      case 2:
      case 'urgent': return 'orange'; // Emergency/Urgent
      case 3:
      case 'less_urgent': return 'yellow'; // Urgent/Less Urgent
      case 4:
      case 'non_urgent': return 'green';  // Less Urgent/Non-urgent
      case 5: return 'blue';   // Non-urgent
      default: return 'gray';
    }
  };

  const getStatusColor = (status: CaseStatus | BedStatus | EquipmentStatus) => {
    switch (status) {
      case 'waiting':
      case 'available':
      case 'operational': return 'green';
      case 'in_progress':
      case 'occupied':
      case 'maintenance': return 'orange';
      case 'completed':
      case 'discharged':
      case 'cleaned': return 'blue';
      case 'cancelled':
      case 'out_of_service': return 'red';
      case 'transferred': return 'purple';
      default: return 'gray';
    }
  };

  const getTriageLabel = (level: number | TriageLevel) => {
    switch (level) {
      case 1: return 'Resuscitation';
      case 2: return 'Emergency';
      case 3: return 'Urgent';
      case 4: return 'Less Urgent';
      case 5: return 'Non-urgent';
      case 'immediate': return 'Immediate';
      case 'urgent': return 'Urgent';
      case 'less_urgent': return 'Less Urgent';
      case 'non_urgent': return 'Non-urgent';
      default: return 'Unknown';
    }
  };

  const handleViewCase = (emergencyCase: any) => {
    setSelectedCase(emergencyCase);
    openCaseDetail();
  };

  const handleViewBed = (bed: ICUBed) => {
    setSelectedBed(bed);
    openBedDetail();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTriage('');
    setSelectedStatus('');
    setSelectedBedStatus('');
  };

  const getVitalStatus = (value: number, normal: { min: number; max: number }) => {
    if (value < normal.min || value > normal.max) return 'critical';
    if (value < normal.min * 1.1 || value > normal.max * 0.9) return 'warning';
    return 'normal';
  };

  const getVitalColor = (status: string) => {
    switch (status) {
      case 'critical': return 'red';
      case 'warning': return 'orange';
      case 'normal': return 'green';
      default: return 'gray';
    }
  };

  // Statistics cards
  const statsCards = [
    {
      title: 'Active Cases',
      value: mockEmergencyStats?.activeCases || 24,
      icon: IconUrgent,
      color: 'red',
      trend: '+5'
    },
    {
      title: 'ICU Beds',
      value: `${mockEmergencyStats?.occupiedICUBeds || 17}/${mockEmergencyStats?.totalICUBeds || 20}`,
      icon: IconBed,
      color: 'blue',
      trend: '85% occupied'
    },
    {
      title: 'Average Wait Time',
      value: `${mockEmergencyStats?.averageWaitTime || 23}min`,
      icon: IconClockHour4,
      color: 'orange',
      trend: '-12min'
    },
    {
      title: 'Code Blue Today',
      value: mockEmergencyStats?.codeBlueToday || 2,
      icon: IconAlertTriangle,
      color: 'purple',
      trend: '+2'
    }
  ];

  // Chart data
  const triageDistribution = Object.entries(mockEmergencyStats?.triageDistribution || {
    1: 3,
    2: 8,
    3: 15,
    4: 22,
    5: 12
  }).map(([level, count]) => ({
    name: getTriageLabel(parseInt(level)),
    value: count,
    color: getTriageColor(parseInt(level))
  }));

  const hourlyAdmissions = mockEmergencyStats?.hourlyAdmissions || [
    { hour: '00:00', admissions: 2 },
    { hour: '01:00', admissions: 1 },
    { hour: '02:00', admissions: 0 },
    { hour: '03:00', admissions: 1 },
    { hour: '04:00', admissions: 3 },
    { hour: '05:00', admissions: 2 },
    { hour: '06:00', admissions: 5 },
    { hour: '07:00', admissions: 8 },
    { hour: '08:00', admissions: 12 },
    { hour: '09:00', admissions: 15 },
    { hour: '10:00', admissions: 18 },
    { hour: '11:00', admissions: 14 }
  ];
  const bedOccupancy = mockEmergencyStats?.bedOccupancyTrend || [
    { date: 'Mon', occupied: 15, available: 5 },
    { date: 'Tue', occupied: 17, available: 3 },
    { date: 'Wed', occupied: 16, available: 4 },
    { date: 'Thu', occupied: 18, available: 2 },
    { date: 'Fri', occupied: 19, available: 1 },
    { date: 'Sat', occupied: 14, available: 6 },
    { date: 'Sun', occupied: 13, available: 7 }
  ];

  return (
    <Container size="xl" py="md">
      {/* Header */}
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={1}>Emergency Management & Disaster Response</Title>
          <Text c="dimmed" size="sm">
            Manage emergency incidents, resources, evacuation procedures, and disaster recovery
          </Text>
        </div>
        <Group>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={openAddCase}
            color="red"
          >
            Emergency Case
          </Button>
          <Button
            variant="light"
            leftSection={<IconBell size={16} />}
            color="red"
            onClick={openProtocol}
          >
            Code Blue
          </Button>
        </Group>
      </Group>

      {/* Critical Alerts */}
      <Alert 
        variant="light" 
        color="red" 
        title="Critical Alerts" 
        icon={<IconAlertTriangle size={16} />}
        mb="lg"
      >
        <Stack gap="xs">
          <Text size="sm">• 3 patients waiting in resuscitation bay</Text>
          <Text size="sm">• ICU Bed #7 - Equipment malfunction</Text>
          <Text size="sm">• Code Blue - Room 204 (5 minutes ago)</Text>
        </Stack>
      </Alert>

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
                  color={stat.trend.includes('+') || stat.trend.includes('-') ? 
                    (stat.trend.startsWith('+') ? 'red' : 'green') : 'blue'} 
                  variant="light"
                  size="sm"
                >
                  {stat.trend}
                </Badge>
                <Text size="xs" c="dimmed">real-time</Text>
              </Group>
            </Card>
          );
        })}
      </SimpleGrid>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="dashboard" leftSection={<IconChartBar size={16} />}>
            Dashboard
          </Tabs.Tab>
          <Tabs.Tab value="triage" leftSection={<IconUrgent size={16} />}>
            Triage Queue
          </Tabs.Tab>
          <Tabs.Tab value="cases" leftSection={<IconAlertTriangle size={16} />}>
            Emergency Cases
          </Tabs.Tab>
          <Tabs.Tab value="icu" leftSection={<IconBed size={16} />}>
            ICU Management
          </Tabs.Tab>
          <Tabs.Tab value="equipment" leftSection={<IconSettings size={16} />}>
            Equipment
          </Tabs.Tab>
          <Tabs.Tab value="protocols" leftSection={<IconClipboardList size={16} />}>
            Protocols
          </Tabs.Tab>
        </Tabs.List>

        {/* Dashboard Tab */}
        <Tabs.Panel value="dashboard">
          <Paper p="md" radius="md" withBorder mt="md">
            <Title order={3} mb="lg">Emergency Department Overview</Title>
            
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
              {/* Triage Distribution */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Triage Distribution</Title>
                <DonutChart
                  data={triageDistribution}
                  size={160}
                  thickness={30}
                  withLabels
                />
              </Card>
              
              {/* Hourly Admissions */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Hourly Admissions</Title>
                <AreaChart
                  h={200}
                  data={hourlyAdmissions}
                  dataKey="hour"
                  series={[{ name: 'admissions', color: 'red.6' }]}
                  curveType="linear"
                />
              </Card>
              
              {/* ICU Bed Occupancy */}
              <Card padding="lg" radius="md" withBorder style={{ gridColumn: '1 / -1' }}>
                <Title order={4} mb="md">ICU Bed Occupancy Trend</Title>
                <LineChart
                  h={300}
                  data={bedOccupancy}
                  dataKey="date"
                  series={[
                    { name: 'occupied', color: 'blue.6', label: 'Occupied' },
                    { name: 'available', color: 'green.6', label: 'Available' }
                  ]}
                  curveType="linear"
                />
              </Card>
              
              {/* Quick Stats */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Quick Statistics</Title>
                <Stack gap="md">
                  <Group justify="space-between" p="sm" 
                         style={{ backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                    <Text size="sm" fw={500}>Mortality Rate</Text>
                    <Text size="sm" fw={600} c="red">
                      {mockEmergencyStats.mortalityRate}%
                    </Text>
                  </Group>
                  <Group justify="space-between" p="sm" 
                         style={{ backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                    <Text size="sm" fw={500}>Left Without Being Seen</Text>
                    <Text size="sm" fw={600} c="orange">
                      {mockEmergencyStats.lwbsRate}%
                    </Text>
                  </Group>
                  <Group justify="space-between" p="sm" 
                         style={{ backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                    <Text size="sm" fw={500}>Door-to-Doc Time</Text>
                    <Text size="sm" fw={600}>
                      {mockEmergencyStats.doorToDocTime}min
                    </Text>
                  </Group>
                  <Group justify="space-between" p="sm" 
                         style={{ backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                    <Text size="sm" fw={500}>Return Rate (72h)</Text>
                    <Text size="sm" fw={600} c="yellow">
                      {mockEmergencyStats.returnRate72h}%
                    </Text>
                  </Group>
                </Stack>
              </Card>
              
              {/* Emergency Protocols */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Active Protocols</Title>
                <Stack gap="sm">
                  <Button 
                    fullWidth 
                    leftSection={<IconAlertTriangle size={16} />}
                    variant="light" 
                    color="red"
                  >
                    Code Blue Protocol
                  </Button>
                  <Button 
                    fullWidth 
                    leftSection={<IconHeart size={16} />} 
                    variant="light" 
                    color="purple"
                  >
                    Cardiac Arrest
                  </Button>
                  <Button 
                    fullWidth 
                    leftSection={<IconBrain size={16} />} 
                    variant="light" 
                    color="orange"
                  >
                    Stroke Protocol
                  </Button>
                  <Button 
                    fullWidth 
                    leftSection={<IconLungs size={16} />} 
                    variant="light" 
                    color="blue"
                  >
                    Respiratory Distress
                  </Button>
                </Stack>
              </Card>
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>

        {/* Triage Queue Tab */}
        <Tabs.Panel value="triage">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Triage Queue</Title>
              <Button leftSection={<IconPlus size={16} />} onClick={openTriage}>
                Add to Triage
              </Button>
            </Group>

            {/* Triage Queue Display */}
            <Stack gap="md">
              {mockTriageQueue.map((patient, index) => (
                <Card key={patient.id} padding="lg" radius="md" withBorder>
                  <Group justify="space-between">
                    <Group>
                      <ThemeIcon 
                        color={getTriageColor(patient.triageLevel)} 
                        size="xl" 
                        radius="md"
                      >
                        <Text fw={700} c="white">
                          {patient.triageLevel}
                        </Text>
                      </ThemeIcon>
                      <div>
                        <Text fw={600} size="lg">
                          {patient.patientName}
                        </Text>
                        <Text size="sm" c="dimmed">
                          {patient.complaint}
                        </Text>
                      </div>
                    </Group>
                    
                    <Group>
                      <div style={{ textAlign: 'right' }}>
                        <Text size="sm" fw={500}>
                          Wait Time: {patient.waitTime}min
                        </Text>
                        <Text size="xs" c="dimmed">
                          Priority: {getTriageLabel(patient.triageLevel)}
                        </Text>
                      </div>
                      <Badge 
                        color={getTriageColor(patient.triageLevel)} 
                        variant="light" 
                        size="lg"
                      >
                        #{index + 1}
                      </Badge>
                    </Group>
                  </Group>
                  
                  <Group justify="space-between" mt="md">
                    <Text size="sm" c="dimmed">
                      Assigned: {patient.assignedNurse}
                    </Text>
                    <Group>
                      <ActionIcon variant="subtle" color="blue">
                        <IconEye size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="green">
                        <IconCheck size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Paper>
        </Tabs.Panel>

        {/* Emergency Cases Tab */}
        <Tabs.Panel value="cases">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Emergency Cases</Title>
              <Button leftSection={<IconPlus size={16} />} onClick={openAddCase} color="red">
                New Emergency Case
              </Button>
            </Group>

            {/* Case Filters */}
            <Group mb="md">
              <TextInput
                placeholder="Search cases..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                style={{ flex: 1 }}
              />
              <Select
                placeholder="Triage Level"
                data={[
                  { value: '1', label: 'Level 1 - Resuscitation' },
                  { value: '2', label: 'Level 2 - Emergency' },
                  { value: '3', label: 'Level 3 - Urgent' },
                  { value: '4', label: 'Level 4 - Less Urgent' },
                  { value: '5', label: 'Level 5 - Non-urgent' }
                ]}
                value={selectedTriage}
                onChange={setSelectedTriage}
                clearable
              />
              <Select
                placeholder="Status"
                data={[
                  { value: 'waiting', label: 'Waiting' },
                  { value: 'in_progress', label: 'In Progress' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'transferred', label: 'Transferred' },
                  { value: 'discharged', label: 'Discharged' }
                ]}
                value={selectedStatus}
                onChange={setSelectedStatus}
                clearable
              />
              <Button variant="light" onClick={clearFilters}>
                Clear Filters
              </Button>
            </Group>

            {/* Cases Table */}
            <ScrollArea>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Case #</Table.Th>
                    <Table.Th>Patient</Table.Th>
                    <Table.Th>Triage</Table.Th>
                    <Table.Th>Chief Complaint</Table.Th>
                    <Table.Th>Arrival Time</Table.Th>
                    <Table.Th>Assigned Staff</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredCases.map((emergencyCase) => (
                    <Table.Tr key={emergencyCase.id}>
                      <Table.Td>
                        <Text fw={500}>{emergencyCase.caseNumber}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Group>
                          <Avatar color="red" radius="xl" size="sm">
                            {emergencyCase.patient.firstName[0]}{emergencyCase.patient.lastName[0]}
                          </Avatar>
                          <div>
                            <Text size="sm" fw={500}>
                              {emergencyCase.patient.firstName} {emergencyCase.patient.lastName}
                            </Text>
                            <Text size="xs" c="dimmed">
                              DOB: {new Date(emergencyCase.patient.dateOfBirth).toLocaleDateString()}
                            </Text>
                          </div>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Group>
                          <ThemeIcon 
                            color={getTriageColor(emergencyCase.triageLevel)} 
                            size="md" 
                            radius="md"
                          >
                            <Text fw={700} c="white" size="xs">
                              {emergencyCase.triageLevel}
                            </Text>
                          </ThemeIcon>
                          <div>
                            <Text size="sm" fw={500}>
                              {getTriageLabel(emergencyCase.triageLevel)}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {emergencyCase.assignedTo}
                            </Text>
                          </div>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" lineClamp={2} style={{ maxWidth: 200 }}>
                          {emergencyCase.chiefComplaint}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {new Date(emergencyCase.arrivalTime).toLocaleTimeString()}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <div>
                          <Text size="sm" fw={500}>
                            {emergencyCase.assignedTo || 'Not Assigned'}
                          </Text>
                          <Text size="xs" c="dimmed">
                            Priority: {emergencyCase.priority}
                          </Text>
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getStatusColor(emergencyCase.status)} variant="light">
                          {emergencyCase.status.replace('_', ' ')}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => handleViewCase(emergencyCase)}
                          >
                            <IconEye size={16} />
                          </ActionIcon>
                          <ActionIcon variant="subtle" color="green">
                            <IconEdit size={16} />
                          </ActionIcon>
                          <ActionIcon variant="subtle" color="orange">
                            <IconActivity size={16} />
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

        {/* ICU Management Tab */}
        <Tabs.Panel value="icu">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>ICU Bed Management</Title>
              <Group>
                <Button leftSection={<IconBed size={16} />} variant="light">
                  Bed Assignment
                </Button>
                <Button leftSection={<IconActivity size={16} />}>
                  Monitor Vitals
                </Button>
              </Group>
            </Group>

            {/* Bed Filters */}
            <Group mb="md">
              <TextInput
                placeholder="Search beds..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                style={{ flex: 1 }}
              />
              <Select
                placeholder="Bed Status"
                data={[
                  { value: 'available', label: 'Available' },
                  { value: 'occupied', label: 'Occupied' },
                  { value: 'cleaned', label: 'Cleaned' },
                  { value: 'maintenance', label: 'Maintenance' }
                ]}
                value={selectedBedStatus}
                onChange={setSelectedBedStatus}
                clearable
              />
            </Group>

            {/* ICU Beds Grid */}
            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
              {filteredBeds.map((bed) => (
                <Card key={bed.id} padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Text fw={600} size="lg">Bed {bed.bedNumber}</Text>
                      <Text size="sm" c="dimmed">{bed.ward} - {bed.roomNumber}</Text>
                    </div>
                    <Badge color={getStatusColor(bed.status)} variant="light">
                      {bed.status}
                    </Badge>
                  </Group>

                  {bed.patient && (
                    <>
                      <Group mb="md">
                        <Avatar color="blue" radius="xl">
                          {bed.patient.firstName[0]}{bed.patient.lastName[0]}
                        </Avatar>
                        <div>
                          <Text fw={500}>
                            {bed.patient.firstName} {bed.patient.lastName}
                          </Text>
                          <Text size="sm" c="dimmed">
                            Age: {bed.patient.age} | ID: {bed.patient.patientId}
                          </Text>
                        </div>
                      </Group>

                      <Text size="sm" fw={500} mb="sm">Current Vitals</Text>
                      <Stack gap="xs" mb="md">
                        <Group justify="space-between" p="xs" 
                               style={{ backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                          <Group gap="xs">
                            <IconHeart size={16} color="red" />
                            <Text size="sm">Heart Rate</Text>
                          </Group>
                          <Text size="sm" fw={600}>{bed.currentVitals?.heartRate} bpm</Text>
                        </Group>
                        <Group justify="space-between" p="xs" 
                               style={{ backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                          <Group gap="xs">
                            <IconActivity size={16} color="blue" />
                            <Text size="sm">Blood Pressure</Text>
                          </Group>
                          <Text size="sm" fw={600}>
                            {bed.currentVitals?.bloodPressure.systolic}/{bed.currentVitals?.bloodPressure.diastolic}
                          </Text>
                        </Group>
                        <Group justify="space-between" p="xs" 
                               style={{ backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                          <Group gap="xs">
                            <IconLungs size={16} color="green" />
                            <Text size="sm">Oxygen</Text>
                          </Group>
                          <Text size="sm" fw={600}>{bed.currentVitals?.oxygenSaturation}%</Text>
                        </Group>
                      </Stack>
                    </>
                  )}

                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">
                      Last Updated: {bed.lastUpdated ? new Date(bed.lastUpdated).toLocaleTimeString() : 'N/A'}
                    </Text>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleViewBed(bed)}
                      >
                        <IconEye size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="green">
                        <IconActivity size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="orange">
                        <IconSettings size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>

        {/* Equipment Tab */}
        <Tabs.Panel value="equipment">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Critical Care Equipment</Title>
              <Button leftSection={<IconSettings size={16} />}>
                Equipment Check
              </Button>
            </Group>

            {/* Equipment Grid */}
            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
              {mockCriticalCareEquipment.map((equipment) => (
                <Card key={equipment.id} padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Text fw={600} size="lg">{equipment.equipmentName}</Text>
                      <Text size="sm" c="dimmed">{equipment.location}</Text>
                    </div>
                    <Badge color={getStatusColor(equipment.status)} variant="light">
                      {equipment.status.replace('_', ' ')}
                    </Badge>
                  </Group>

                  <Stack gap="sm" mb="md">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Model</Text>
                      <Text size="sm" fw={500}>{equipment.model}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Serial</Text>
                      <Text size="sm" fw={500}>{equipment.serialNumber}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Last Maintenance</Text>
                      <Text size="sm">
                        {new Date(equipment.lastMaintenanceDate).toLocaleDateString()}
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Next Due</Text>
                      <Text 
                        size="sm" 
                        c={new Date(equipment.nextMaintenanceDate) < new Date() ? 'red' : 'dimmed'}
                      >
                        {new Date(equipment.nextMaintenanceDate).toLocaleDateString()}
                      </Text>
                    </Group>
                  </Stack>

                  {equipment.currentReadings && (
                    <Alert variant="light" color="blue" mb="md">
                      <Text size="sm">
                        <strong>Current Reading:</strong> {equipment.currentReadings}
                      </Text>
                    </Alert>
                  )}

                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">
                      Technician: {equipment.assignedTechnician}
                    </Text>
                    <Group gap="xs">
                      <ActionIcon variant="subtle" color="blue">
                        <IconEye size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="green">
                        <IconSettings size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="orange">
                        <IconClipboard size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>

        {/* Protocols Tab */}
        <Tabs.Panel value="protocols">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Emergency Protocols</Title>
              <Button leftSection={<IconPlus size={16} />}>
                Add Protocol
              </Button>
            </Group>

            {/* Emergency Protocols */}
            <Stack gap="lg">
              {mockEmergencyProtocols.map((protocol) => (
                <Card key={protocol.id} padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Text fw={600} size="lg">{protocol.name}</Text>
                      <Text size="sm" c="dimmed">{protocol.category}</Text>
                    </div>
                    <Group>
                      <Badge color="blue" variant="light">
                        Version {protocol.version}
                      </Badge>
                      <Badge color="green" variant="light">
                        Active
                      </Badge>
                    </Group>
                  </Group>

                  <Text size="sm" mb="md">{protocol.description}</Text>

                  <div>
                    <Text size="sm" fw={500} mb="sm">Protocol Steps</Text>
                    <Stepper active={-1} breakpoint="sm">
                      {protocol.steps.map((step, index) => (
                        <Stepper.Step 
                          key={index} 
                          label={`Step ${index + 1}`} 
                          description={step}
                        />
                      ))}
                    </Stepper>
                  </div>

                  <Group justify="space-between" mt="md">
                    <Text size="xs" c="dimmed">
                      Last Updated: {new Date(protocol.lastUpdated).toLocaleDateString()}
                    </Text>
                    <Group gap="xs">
                      <ActionIcon variant="subtle" color="blue">
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
            </Stack>
          </Paper>
        </Tabs.Panel>
      </Tabs>

      {/* Case Detail Modal */}
      <Modal
        opened={caseDetailOpened}
        onClose={closeCaseDetail}
        title="Emergency Case Details"
        size="xl"
      >
        {selectedCase && (
          <ScrollArea h={600}>
            <Stack gap="md">
              <Group>
                <Avatar color="red" size="xl" radius="xl">
                  {selectedCase.patient.firstName[0]}{selectedCase.patient.lastName[0]}
                </Avatar>
                <div>
                  <Title order={3}>
                    {selectedCase.patient.firstName} {selectedCase.patient.lastName}
                  </Title>
                  <Text c="dimmed">Case: {selectedCase.caseNumber}</Text>
                  <Badge color={getStatusColor(selectedCase.status)} variant="light" mt="xs">
                    {selectedCase.status.replace('_', ' ')}
                  </Badge>
                </div>
              </Group>

              <Divider />

              <SimpleGrid cols={2}>
                <div>
                  <Text size="sm" fw={500}>Triage Level</Text>
                  <Group>
                      <ThemeIcon 
                        color={getTriageColor(selectedCase.triageLevel)} 
                        size="sm" 
                        radius="md"
                      >
                        <Text fw={700} c="white" size="xs">
                          {selectedCase.triageLevel}
                        </Text>
                      </ThemeIcon>
                      <Text size="sm">{getTriageLabel(selectedCase.triageLevel)}</Text>
                  </Group>
                </div>
                <div>
                  <Text size="sm" fw={500}>Arrival Time</Text>
                  <Text size="sm" c="dimmed">
                    {new Date(selectedCase.arrivalTime).toLocaleString()}
                  </Text>
                </div>
                <div>
                  <Text size="sm" fw={500}>Chief Complaint</Text>
                  <Text size="sm" c="dimmed">{selectedCase.chiefComplaint}</Text>
                </div>
                <div>
                  <Text size="sm" fw={500}>Assigned To</Text>
                  <Text size="sm" c="dimmed">{selectedCase.assignedTo || 'Not Assigned'}</Text>
                </div>
              </SimpleGrid>

              {/* Vitals not available in simplified mock; display basic info instead */}
              <Divider />
              <div>
                <Text size="sm" fw={500} mb="sm">Summary</Text>
                <SimpleGrid cols={2}>
                  <Group justify="space-between" p="sm" style={{ backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                    <Text size="sm">Bed</Text>
                    <Text size="sm" fw={600}>{selectedCase.bedNumber || '—'}</Text>
                  </Group>
                  <Group justify="space-between" p="sm" style={{ backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                    <Text size="sm">Priority</Text>
                    <Text size="sm" fw={600}>{selectedCase.priority ?? '—'}</Text>
                  </Group>
                </SimpleGrid>
              </div>

              <Group justify="flex-end">
                <Button variant="light" onClick={closeCaseDetail}>
                  Close
                </Button>
                <Button>
                  Update Case
                </Button>
              </Group>
            </Stack>
          </ScrollArea>
        )}
      </Modal>

      {/* Add Case Modal */}
      <Modal
        opened={addCaseOpened}
        onClose={closeAddCase}
        title="New Emergency Case"
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
            <Select
              label="Triage Level"
              placeholder="Select triage level"
              data={[
                { value: '1', label: 'Level 1 - Resuscitation' },
                { value: '2', label: 'Level 2 - Emergency' },
                { value: '3', label: 'Level 3 - Urgent' },
                { value: '4', label: 'Level 4 - Less Urgent' },
                { value: '5', label: 'Level 5 - Non-urgent' }
              ]}
              required
            />
          </SimpleGrid>
          
          <Textarea
            label="Chief Complaint"
            placeholder="Enter chief complaint"
            rows={3}
            required
          />
          
          <Select
            label="Mode of Arrival"
            placeholder="Select mode of arrival"
            data={[
              { value: 'ambulance', label: 'Ambulance' },
              { value: 'walk_in', label: 'Walk-in' },
              { value: 'police', label: 'Police' },
              { value: 'helicopter', label: 'Helicopter' }
            ]}
            required
          />
          
          <Text size="sm" fw={500} mt="md">Initial Vital Signs</Text>
          <SimpleGrid cols={3}>
            <NumberInput
              label="Heart Rate (bpm)"
              placeholder="72"
            />
            <TextInput
              label="Blood Pressure"
              placeholder="120/80"
            />
            <NumberInput
              label="Temperature (°F)"
              placeholder="98.6"
            />
            <NumberInput
              label="Oxygen Saturation (%)"
              placeholder="98"
            />
            <NumberInput
              label="Respiratory Rate"
              placeholder="16"
            />
            <NumberInput
              label="Pain Scale (0-10)"
              placeholder="0"
              min={0}
              max={10}
            />
          </SimpleGrid>
          
          <Group justify="flex-end">
            <Button variant="light" onClick={closeAddCase}>
              Cancel
            </Button>
            <Button color="red" onClick={() => {
              notifications.show({
                title: 'Emergency Case Created',
                message: 'New emergency case has been added to the system',
                color: 'green',
              });
              closeAddCase();
            }}>
              Create Case
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default EmergencyManagement;