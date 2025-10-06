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
  Progress,
  NumberInput,
  Textarea,
  DatePickerInput,
  Switch,
  Divider,
  Alert,
  Timeline,
  List,
  Indicator
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
  IconBed,
  IconUser,
  IconUsers,
  IconCalendar,
  IconClock,
  IconStethoscope,
  IconHeart,
  IconActivity,
  IconChartBar,
  IconTrendingUp,
  IconTrendingDown,
  IconMedicalCross,
  IconNurse,
  IconPill,
  IconDroplet,
  IconThermometer,
  IconLungs,
  IconFileText,
  IconPrinter,
  IconDownload,
  IconRefresh,
  IconUserCheck,
  IconBedFilled,
  IconClipboard,
  IconReport,
  IconCalendarEvent,
  IconPhone,
  IconMail,
  IconMapPin,
  IconCash,
  IconCreditCard,
  IconReceipt,
  IconCheck,
  IconX,
  IconAlertCircle,
  IconArrowUp,
  IconArrowDown,
  IconHome,
  IconTransfer,
  IconEmergencyBed
} from '@tabler/icons-react';

// Types
interface IPDPatient {
  id: string;
  admissionNumber: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientPhone: string;
  bedNumber: string;
  wardName: string;
  roomNumber: string;
  admissionDate: string;
  expectedDischargeDate?: string;
  actualDischargeDate?: string;
  admissionType: 'emergency' | 'elective' | 'transfer';
  status: 'admitted' | 'critical' | 'stable' | 'discharged' | 'transferred';
  primaryDoctor: string;
  consultingDoctors: string[];
  assignedNurse: string;
  diagnosis: string;
  procedure?: string;
  insurance: {
    provider: string;
    policyNumber: string;
    approvalAmount: number;
  } | null;
  lengthOfStay: number;
  dailyCharges: number;
  totalCharges: number;
  pendingAmount: number;
  vitalSigns: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    respiratoryRate: number;
    oxygenSaturation: number;
    painScale: number;
    lastUpdated: string;
  };
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    route: string;
    startDate: string;
    endDate?: string;
  }>;
  nursingNotes: Array<{
    timestamp: string;
    note: string;
    nurseName: string;
  }>;
}

interface Bed {
  id: string;
  bedNumber: string;
  wardName: string;
  roomNumber: string;
  bedType: 'general' | 'private' | 'icu' | 'hdu' | 'isolation';
  status: 'occupied' | 'vacant' | 'maintenance' | 'reserved';
  patientId?: string;
  patientName?: string;
  dailyRate: number;
  amenities: string[];
  lastCleaned?: string;
}

interface Ward {
  id: string;
  name: string;
  department: string;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  maintenanceBeds: number;
  nursesOnDuty: number;
  headNurse: string;
}

// Mock data
const mockIPDPatients: IPDPatient[] = [
  {
    id: '1',
    admissionNumber: 'IPD2024001',
    patientId: 'P2024001',
    patientName: 'Rajesh Kumar',
    patientAge: 45,
    patientGender: 'Male',
    patientPhone: '+91 98765 43210',
    bedNumber: 'ICU-01',
    wardName: 'ICU',
    roomNumber: 'R101',
    admissionDate: '2024-01-10T08:30:00Z',
    expectedDischargeDate: '2024-01-20T10:00:00Z',
    admissionType: 'emergency',
    status: 'critical',
    primaryDoctor: 'Dr. Sharma',
    consultingDoctors: ['Dr. Reddy', 'Dr. Singh'],
    assignedNurse: 'Nurse Priya',
    diagnosis: 'Acute Myocardial Infarction',
    procedure: 'Angioplasty',
    insurance: {
      provider: 'Max Bupa',
      policyNumber: 'MB123456',
      approvalAmount: 500000
    },
    lengthOfStay: 5,
    dailyCharges: 8500,
    totalCharges: 42500,
    pendingAmount: 12500,
    vitalSigns: {
      bloodPressure: '140/90',
      heartRate: 85,
      temperature: 99.2,
      respiratoryRate: 18,
      oxygenSaturation: 94,
      painScale: 6,
      lastUpdated: '2024-01-15T14:30:00Z'
    },
    medications: [
      {
        name: 'Aspirin',
        dosage: '75mg',
        frequency: 'Once daily',
        route: 'Oral',
        startDate: '2024-01-10T09:00:00Z'
      },
      {
        name: 'Metoprolol',
        dosage: '25mg',
        frequency: 'Twice daily',
        route: 'Oral',
        startDate: '2024-01-10T09:00:00Z'
      }
    ],
    nursingNotes: [
      {
        timestamp: '2024-01-15T14:00:00Z',
        note: 'Patient comfortable, vitals stable',
        nurseName: 'Nurse Priya'
      }
    ]
  },
  {
    id: '2',
    admissionNumber: 'IPD2024002',
    patientId: 'P2024002',
    patientName: 'Sunita Patel',
    patientAge: 38,
    patientGender: 'Female',
    patientPhone: '+91 87654 32109',
    bedNumber: 'GW-12',
    wardName: 'General Ward',
    roomNumber: 'R205',
    admissionDate: '2024-01-12T14:15:00Z',
    expectedDischargeDate: '2024-01-18T11:00:00Z',
    admissionType: 'elective',
    status: 'stable',
    primaryDoctor: 'Dr. Mehta',
    consultingDoctors: [],
    assignedNurse: 'Nurse Kavita',
    diagnosis: 'Elective Cholecystectomy',
    procedure: 'Laparoscopic Cholecystectomy',
    insurance: null,
    lengthOfStay: 3,
    dailyCharges: 3500,
    totalCharges: 10500,
    pendingAmount: 10500,
    vitalSigns: {
      bloodPressure: '120/80',
      heartRate: 72,
      temperature: 98.6,
      respiratoryRate: 16,
      oxygenSaturation: 99,
      painScale: 3,
      lastUpdated: '2024-01-15T14:00:00Z'
    },
    medications: [
      {
        name: 'Paracetamol',
        dosage: '650mg',
        frequency: 'Every 6 hours',
        route: 'Oral',
        startDate: '2024-01-12T15:00:00Z'
      }
    ],
    nursingNotes: [
      {
        timestamp: '2024-01-15T13:30:00Z',
        note: 'Post-operative recovery normal, wound healing well',
        nurseName: 'Nurse Kavita'
      }
    ]
  },
  {
    id: '3',
    admissionNumber: 'IPD2024003',
    patientId: 'P2024003',
    patientName: 'Mohammed Ali',
    patientAge: 62,
    patientGender: 'Male',
    patientPhone: '+91 76543 21098',
    bedNumber: 'PW-05',
    wardName: 'Private Ward',
    roomNumber: 'R301',
    admissionDate: '2024-01-13T10:45:00Z',
    expectedDischargeDate: '2024-01-17T09:00:00Z',
    admissionType: 'elective',
    status: 'stable',
    primaryDoctor: 'Dr. Singh',
    consultingDoctors: ['Dr. Gupta'],
    assignedNurse: 'Nurse Rekha',
    diagnosis: 'Total Knee Replacement',
    procedure: 'Total Knee Arthroplasty',
    insurance: {
      provider: 'Star Health',
      policyNumber: 'SH789012',
      approvalAmount: 350000
    },
    lengthOfStay: 2,
    dailyCharges: 6500,
    totalCharges: 13000,
    pendingAmount: 0,
    vitalSigns: {
      bloodPressure: '130/85',
      heartRate: 76,
      temperature: 98.4,
      respiratoryRate: 14,
      oxygenSaturation: 98,
      painScale: 4,
      lastUpdated: '2024-01-15T13:45:00Z'
    },
    medications: [
      {
        name: 'Tramadol',
        dosage: '50mg',
        frequency: 'Every 8 hours',
        route: 'Oral',
        startDate: '2024-01-13T11:00:00Z'
      }
    ],
    nursingNotes: [
      {
        timestamp: '2024-01-15T13:00:00Z',
        note: 'Physiotherapy started, patient responding well',
        nurseName: 'Nurse Rekha'
      }
    ]
  }
];

const mockBeds: Bed[] = [
  {
    id: '1',
    bedNumber: 'ICU-01',
    wardName: 'ICU',
    roomNumber: 'R101',
    bedType: 'icu',
    status: 'occupied',
    patientId: 'P2024001',
    patientName: 'Rajesh Kumar',
    dailyRate: 8500,
    amenities: ['Ventilator', 'Cardiac Monitor', 'IV Pump'],
    lastCleaned: '2024-01-15T06:00:00Z'
  },
  {
    id: '2',
    bedNumber: 'ICU-02',
    wardName: 'ICU',
    roomNumber: 'R102',
    bedType: 'icu',
    status: 'vacant',
    dailyRate: 8500,
    amenities: ['Ventilator', 'Cardiac Monitor', 'IV Pump'],
    lastCleaned: '2024-01-15T07:00:00Z'
  },
  {
    id: '3',
    bedNumber: 'GW-12',
    wardName: 'General Ward',
    roomNumber: 'R205',
    bedType: 'general',
    status: 'occupied',
    patientId: 'P2024002',
    patientName: 'Sunita Patel',
    dailyRate: 3500,
    amenities: ['Oxygen Point', 'Nurse Call'],
    lastCleaned: '2024-01-15T08:00:00Z'
  }
];

const mockWards: Ward[] = [
  {
    id: '1',
    name: 'ICU',
    department: 'Critical Care',
    totalBeds: 8,
    occupiedBeds: 5,
    availableBeds: 2,
    maintenanceBeds: 1,
    nursesOnDuty: 6,
    headNurse: 'Nurse Supervisor Sarah'
  },
  {
    id: '2',
    name: 'General Ward',
    department: 'General Medicine',
    totalBeds: 30,
    occupiedBeds: 22,
    availableBeds: 6,
    maintenanceBeds: 2,
    nursesOnDuty: 8,
    headNurse: 'Nurse Supervisor Meera'
  },
  {
    id: '3',
    name: 'Private Ward',
    department: 'VIP Services',
    totalBeds: 15,
    occupiedBeds: 8,
    availableBeds: 7,
    maintenanceBeds: 0,
    nursesOnDuty: 4,
    headNurse: 'Nurse Supervisor Asha'
  }
];

const IPDManagement = () => {
  // State management
  const [activeTab, setActiveTab] = useState<string>('patients');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedPatient, setSelectedPatient] = useState<IPDPatient | null>(null);
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);

  // Modal states
  const [patientDetailOpened, { open: openPatientDetail, close: closePatientDetail }] = useDisclosure(false);
  const [admissionOpened, { open: openAdmission, close: closeAdmission }] = useDisclosure(false);
  const [dischargeOpened, { open: openDischarge, close: closeDischarge }] = useDisclosure(false);
  const [bedDetailOpened, { open: openBedDetail, close: closeBedDetail }] = useDisclosure(false);
  const [transferOpened, { open: openTransfer, close: closeTransfer }] = useDisclosure(false);

  // Filter patients
  const filteredPatients = useMemo(() => {
    return mockIPDPatients.filter((patient) => {
      const matchesSearch = 
        patient.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.bedNumber.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesWard = !selectedWard || patient.wardName === selectedWard;
      const matchesStatus = !selectedStatus || patient.status === selectedStatus;

      return matchesSearch && matchesWard && matchesStatus;
    });
  }, [searchQuery, selectedWard, selectedStatus]);

  const handleViewPatient = (patient: IPDPatient) => {
    setSelectedPatient(patient);
    openPatientDetail();
  };

  const handleViewBed = (bed: Bed) => {
    setSelectedBed(bed);
    openBedDetail();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'red';
      case 'stable': return 'green';
      case 'admitted': return 'blue';
      case 'discharged': return 'gray';
      case 'transferred': return 'purple';
      default: return 'gray';
    }
  };

  const getBedStatusColor = (status: string) => {
    switch (status) {
      case 'occupied': return 'red';
      case 'vacant': return 'green';
      case 'maintenance': return 'orange';
      case 'reserved': return 'blue';
      default: return 'gray';
    }
  };

  // Quick stats
  const ipdStats = {
    totalPatients: mockIPDPatients.length,
    totalBeds: mockBeds.length,
    occupiedBeds: mockBeds.filter(b => b.status === 'occupied').length,
    availableBeds: mockBeds.filter(b => b.status === 'vacant').length,
    criticalPatients: mockIPDPatients.filter(p => p.status === 'critical').length,
    averageLOS: Math.round(mockIPDPatients.reduce((acc, p) => acc + p.lengthOfStay, 0) / mockIPDPatients.length),
    occupancyRate: Math.round((mockBeds.filter(b => b.status === 'occupied').length / mockBeds.length) * 100),
    totalRevenue: mockIPDPatients.reduce((acc, p) => acc + p.totalCharges, 0)
  };

  return (
    <Container size="xl" py="md">
      {/* Header */}
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={1}>IPD Management</Title>
          <Text c="dimmed" size="sm">
            Inpatient department care and bed management system
          </Text>
        </div>
        <Group>
          <Button variant="light" leftSection={<IconRefresh size={16} />}>
            Refresh Status
          </Button>
          <Button leftSection={<IconPlus size={16} />} onClick={openAdmission}>
            New Admission
          </Button>
        </Group>
      </Group>

      {/* Quick Stats */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4, lg: 8 }} mb="lg" spacing="sm">
        <Card padding="md" radius="md" withBorder>
          <Group justify="center">
            <ThemeIcon color="blue" size="lg" radius="md" variant="light">
              <IconUsers size={20} />
            </ThemeIcon>
            <div>
              <Text size="lg" fw={700}>{ipdStats.totalPatients}</Text>
              <Text size="xs" c="dimmed">Total Patients</Text>
            </div>
          </Group>
        </Card>

        <Card padding="md" radius="md" withBorder>
          <Group justify="center">
            <ThemeIcon color="green" size="lg" radius="md" variant="light">
              <IconBed size={20} />
            </ThemeIcon>
            <div>
              <Text size="lg" fw={700}>{ipdStats.totalBeds}</Text>
              <Text size="xs" c="dimmed">Total Beds</Text>
            </div>
          </Group>
        </Card>

        <Card padding="md" radius="md" withBorder>
          <Group justify="center">
            <ThemeIcon color="red" size="lg" radius="md" variant="light">
              <IconBedFilled size={20} />
            </ThemeIcon>
            <div>
              <Text size="lg" fw={700}>{ipdStats.occupiedBeds}</Text>
              <Text size="xs" c="dimmed">Occupied</Text>
            </div>
          </Group>
        </Card>

        <Card padding="md" radius="md" withBorder>
          <Group justify="center">
            <ThemeIcon color="lime" size="lg" radius="md" variant="light">
              <IconCheck size={20} />
            </ThemeIcon>
            <div>
              <Text size="lg" fw={700}>{ipdStats.availableBeds}</Text>
              <Text size="xs" c="dimmed">Available</Text>
            </div>
          </Group>
        </Card>

        <Card padding="md" radius="md" withBorder>
          <Group justify="center">
            <ThemeIcon color="orange" size="lg" radius="md" variant="light">
              <IconEmergencyBed size={20} />
            </ThemeIcon>
            <div>
              <Text size="lg" fw={700}>{ipdStats.criticalPatients}</Text>
              <Text size="xs" c="dimmed">Critical</Text>
            </div>
          </Group>
        </Card>

        <Card padding="md" radius="md" withBorder>
          <Group justify="center">
            <ThemeIcon color="purple" size="lg" radius="md" variant="light">
              <IconCalendar size={20} />
            </ThemeIcon>
            <div>
              <Text size="lg" fw={700}>{ipdStats.averageLOS}</Text>
              <Text size="xs" c="dimmed">Avg LOS</Text>
            </div>
          </Group>
        </Card>

        <Card padding="md" radius="md" withBorder>
          <Group justify="center">
            <ThemeIcon color="cyan" size="lg" radius="md" variant="light">
              <IconChartBar size={20} />
            </ThemeIcon>
            <div>
              <Text size="lg" fw={700}>{ipdStats.occupancyRate}%</Text>
              <Text size="xs" c="dimmed">Occupancy</Text>
            </div>
          </Group>
        </Card>

        <Card padding="md" radius="md" withBorder>
          <Group justify="center">
            <ThemeIcon color="teal" size="lg" radius="md" variant="light">
              <IconCash size={20} />
            </ThemeIcon>
            <div>
              <Text size="lg" fw={700}>₹{(ipdStats.totalRevenue / 100000).toFixed(1)}L</Text>
              <Text size="xs" c="dimmed">Revenue</Text>
            </div>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="patients" leftSection={<IconUsers size={16} />}>
            IPD Patients
          </Tabs.Tab>
          <Tabs.Tab value="beds" leftSection={<IconBed size={16} />}>
            Bed Status
          </Tabs.Tab>
          <Tabs.Tab value="wards" leftSection={<IconBedFilled size={16} />}>
            Ward Management
          </Tabs.Tab>
          <Tabs.Tab value="analytics" leftSection={<IconChartBar size={16} />}>
            Analytics
          </Tabs.Tab>
        </Tabs.List>

        {/* IPD Patients Tab */}
        <Tabs.Panel value="patients">
          <Paper p="md" radius="md" withBorder mt="md">
            {/* Filters */}
            <Group mb="md">
              <TextInput
                placeholder="Search patients..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                style={{ flex: 1 }}
              />
              <Select
                placeholder="Ward"
                data={[
                  { value: 'ICU', label: 'ICU' },
                  { value: 'General Ward', label: 'General Ward' },
                  { value: 'Private Ward', label: 'Private Ward' },
                  { value: 'HDU', label: 'HDU' }
                ]}
                value={selectedWard}
                onChange={setSelectedWard}
                clearable
              />
              <Select
                placeholder="Status"
                data={[
                  { value: 'critical', label: 'Critical' },
                  { value: 'stable', label: 'Stable' },
                  { value: 'admitted', label: 'Admitted' },
                  { value: 'discharged', label: 'Discharged' }
                ]}
                value={selectedStatus}
                onChange={setSelectedStatus}
                clearable
              />
            </Group>

            {/* Patients Table */}
            <ScrollArea>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Admission #</Table.Th>
                    <Table.Th>Patient</Table.Th>
                    <Table.Th>Bed/Ward</Table.Th>
                    <Table.Th>Doctor</Table.Th>
                    <Table.Th>Admission Date</Table.Th>
                    <Table.Th>LOS</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Charges</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredPatients.map((patient) => (
                    <Table.Tr key={patient.id}>
                      <Table.Td>
                        <Text fw={500} size="sm">{patient.admissionNumber}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Group>
                          <Avatar color="blue" radius="xl" size="sm">
                            {patient.patientName.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                          <div>
                            <Text size="sm" fw={500}>{patient.patientName}</Text>
                            <Text size="xs" c="dimmed">{patient.patientAge}Y, {patient.patientGender}</Text>
                          </div>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <div>
                          <Text size="sm" fw={500}>{patient.bedNumber}</Text>
                          <Text size="xs" c="dimmed">{patient.wardName}</Text>
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <div>
                          <Text size="sm" fw={500}>{patient.primaryDoctor}</Text>
                          <Text size="xs" c="dimmed">{patient.assignedNurse}</Text>
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{formatDate(patient.admissionDate)}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{patient.lengthOfStay} days</Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Badge color={getStatusColor(patient.status)} variant="light" size="sm">
                            {patient.status.toUpperCase()}
                          </Badge>
                          {patient.status === 'critical' && (
                            <Indicator color="red" size={8} />
                          )}
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <div>
                          <Text size="sm" fw={500}>₹{patient.totalCharges.toLocaleString()}</Text>
                          {patient.pendingAmount > 0 && (
                            <Text size="xs" c="red">Pending: ₹{patient.pendingAmount.toLocaleString()}</Text>
                          )}
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => handleViewPatient(patient)}
                          >
                            <IconEye size={16} />
                          </ActionIcon>
                          <ActionIcon variant="subtle" color="green">
                            <IconEdit size={16} />
                          </ActionIcon>
                          <ActionIcon variant="subtle" color="purple">
                            <IconTransfer size={16} />
                          </ActionIcon>
                          <ActionIcon variant="subtle" color="orange">
                            <IconHome size={16} />
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

        {/* Bed Status Tab */}
        <Tabs.Panel value="beds">
          <Paper p="md" radius="md" withBorder mt="md">
            <Title order={3} mb="lg">Bed Status Overview</Title>
            
            <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing="lg">
              {mockBeds.map((bed) => (
                <Card key={bed.id} padding="lg" radius="md" withBorder onClick={() => handleViewBed(bed)} style={{ cursor: 'pointer' }}>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Text fw={600} size="lg">{bed.bedNumber}</Text>
                      <Text size="sm" c="dimmed">{bed.wardName} - {bed.roomNumber}</Text>
                    </div>
                    <Badge color={getBedStatusColor(bed.status)} variant="light">
                      {bed.status.toUpperCase()}
                    </Badge>
                  </Group>

                  {bed.status === 'occupied' && bed.patientName && (
                    <Group mb="sm">
                      <Avatar color="blue" size="sm" radius="xl">
                        {bed.patientName.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Text size="sm" fw={500}>{bed.patientName}</Text>
                    </Group>
                  )}

                  <Stack gap="xs" mb="md">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Type</Text>
                      <Badge variant="outline" size="sm" tt="uppercase">
                        {bed.bedType}
                      </Badge>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Daily Rate</Text>
                      <Text size="sm" fw={500}>₹{bed.dailyRate}</Text>
                    </Group>
                  </Stack>

                  <Text size="xs" c="dimmed">
                    Amenities: {bed.amenities.join(', ')}
                  </Text>

                  {bed.lastCleaned && (
                    <Text size="xs" c="dimmed" mt="xs">
                      Last Cleaned: {formatDateTime(bed.lastCleaned)}
                    </Text>
                  )}
                </Card>
              ))}
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>

        {/* Ward Management Tab */}
        <Tabs.Panel value="wards">
          <Paper p="md" radius="md" withBorder mt="md">
            <Title order={3} mb="lg">Ward Overview</Title>
            
            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
              {mockWards.map((ward) => (
                <Card key={ward.id} padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Text fw={600} size="lg">{ward.name}</Text>
                      <Text size="sm" c="dimmed">{ward.department}</Text>
                    </div>
                    <ThemeIcon color="blue" size="xl" radius="xl" variant="light">
                      <IconBedFilled size={20} />
                    </ThemeIcon>
                  </Group>

                  <div className="mb-md">
                    <Text size="sm" c="dimmed" mb="xs">Bed Occupancy</Text>
                    <Progress 
                      value={(ward.occupiedBeds / ward.totalBeds) * 100} 
                      size="lg" 
                      color={ward.occupiedBeds > ward.totalBeds * 0.9 ? 'red' : 'blue'}
                    />
                    <Group justify="space-between" mt="xs">
                      <Text size="xs" c="dimmed">
                        {ward.occupiedBeds} / {ward.totalBeds} occupied
                      </Text>
                      <Text size="xs" c="dimmed">
                        {Math.round((ward.occupiedBeds / ward.totalBeds) * 100)}%
                      </Text>
                    </Group>
                  </div>

                  <SimpleGrid cols={2} spacing="sm" mb="md">
                    <div>
                      <Text size="xs" c="dimmed">Available</Text>
                      <Text size="sm" fw={500} c="green">{ward.availableBeds}</Text>
                    </div>
                    <div>
                      <Text size="xs" c="dimmed">Maintenance</Text>
                      <Text size="sm" fw={500} c="orange">{ward.maintenanceBeds}</Text>
                    </div>
                    <div>
                      <Text size="xs" c="dimmed">Nurses on Duty</Text>
                      <Text size="sm" fw={500}>{ward.nursesOnDuty}</Text>
                    </div>
                    <div>
                      <Text size="xs" c="dimmed">Head Nurse</Text>
                      <Text size="xs" c="dimmed">{ward.headNurse}</Text>
                    </div>
                  </SimpleGrid>

                  <Group justify="space-between">
                    <Button variant="light" size="xs">
                      View Details
                    </Button>
                    <Group gap="xs">
                      <ActionIcon variant="subtle" color="blue">
                        <IconBed size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="green">
                        <IconNurse size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>

        {/* Analytics Tab */}
        <Tabs.Panel value="analytics">
          <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg" mt="md">
            {/* Occupancy Trends */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">Daily Occupancy Trends</Title>
              <LineChart
                h={200}
                data={[
                  { date: 'Mon', occupancy: 85 },
                  { date: 'Tue', occupancy: 88 },
                  { date: 'Wed', occupancy: 82 },
                  { date: 'Thu', occupancy: 90 },
                  { date: 'Fri', occupancy: 87 },
                  { date: 'Sat', occupancy: 84 },
                  { date: 'Sun', occupancy: 86 }
                ]}
                dataKey="date"
                series={[{ name: 'occupancy', color: 'blue.6' }]}
                curveType="linear"
              />
            </Card>

            {/* Ward Distribution */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">Patient Distribution by Ward</Title>
              <DonutChart
                data={[
                  { name: 'General Ward', value: 22, color: 'blue' },
                  { name: 'ICU', value: 5, color: 'red' },
                  { name: 'Private Ward', value: 8, color: 'green' },
                  { name: 'HDU', value: 3, color: 'orange' }
                ]}
                size={200}
                thickness={40}
                withLabels
              />
            </Card>

            {/* Length of Stay */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">Average Length of Stay by Department</Title>
              <BarChart
                h={200}
                data={[
                  { department: 'Cardiology', los: 8.5 },
                  { department: 'Orthopedics', los: 6.2 },
                  { department: 'General Surgery', los: 4.8 },
                  { department: 'Internal Medicine', los: 5.5 },
                  { department: 'ICU', los: 12.3 }
                ]}
                dataKey="department"
                series={[{ name: 'los', color: 'teal.6' }]}
              />
            </Card>

            {/* Revenue Analysis */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">IPD Revenue Trends</Title>
              <AreaChart
                h={200}
                data={[
                  { month: 'Jan', revenue: 850000 },
                  { month: 'Feb', revenue: 920000 },
                  { month: 'Mar', revenue: 780000 },
                  { month: 'Apr', revenue: 1100000 },
                  { month: 'May', revenue: 950000 },
                  { month: 'Jun', revenue: 1050000 }
                ]}
                dataKey="month"
                series={[{ name: 'revenue', color: 'green.6' }]}
                curveType="bump"
              />
            </Card>
          </SimpleGrid>
        </Tabs.Panel>
      </Tabs>

      {/* Patient Detail Modal */}
      <Modal
        opened={patientDetailOpened}
        onClose={closePatientDetail}
        title="IPD Patient Details"
        size="xl"
      >
        {selectedPatient && (
          <ScrollArea h={600}>
            <Stack gap="md">
              {/* Patient Info Header */}
              <Card padding="lg" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                  <Group>
                    <Avatar color="blue" size="xl" radius="xl">
                      {selectedPatient.patientName.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <div>
                      <Title order={3}>{selectedPatient.patientName}</Title>
                      <Text c="dimmed">Admission: {selectedPatient.admissionNumber}</Text>
                      <Group gap="xs" mt="xs">
                        <Badge color={getStatusColor(selectedPatient.status)} variant="light">
                          {selectedPatient.status.toUpperCase()}
                        </Badge>
                        {selectedPatient.status === 'critical' && (
                          <Badge color="red" variant="filled">CRITICAL</Badge>
                        )}
                      </Group>
                    </div>
                  </Group>
                  <Group>
                    <Button variant="light" leftSection={<IconTransfer size={16} />}>
                      Transfer
                    </Button>
                    <Button variant="light" leftSection={<IconHome size={16} />}>
                      Discharge
                    </Button>
                  </Group>
                </Group>

                <SimpleGrid cols={4} spacing="md">
                  <div>
                    <Text size="sm" c="dimmed">Age & Gender</Text>
                    <Text fw={500}>{selectedPatient.patientAge}Y, {selectedPatient.patientGender}</Text>
                  </div>
                  <div>
                    <Text size="sm" c="dimmed">Bed Number</Text>
                    <Text fw={500}>{selectedPatient.bedNumber}</Text>
                  </div>
                  <div>
                    <Text size="sm" c="dimmed">Length of Stay</Text>
                    <Text fw={500}>{selectedPatient.lengthOfStay} days</Text>
                  </div>
                  <div>
                    <Text size="sm" c="dimmed">Primary Doctor</Text>
                    <Text fw={500}>{selectedPatient.primaryDoctor}</Text>
                  </div>
                </SimpleGrid>
              </Card>

              {/* Diagnosis & Treatment */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={5} mb="md">Diagnosis & Treatment</Title>
                <SimpleGrid cols={2} spacing="md">
                  <div>
                    <Text size="sm" c="dimmed" fw={500} mb="xs">Diagnosis</Text>
                    <Text>{selectedPatient.diagnosis}</Text>
                  </div>
                  {selectedPatient.procedure && (
                    <div>
                      <Text size="sm" c="dimmed" fw={500} mb="xs">Procedure</Text>
                      <Text>{selectedPatient.procedure}</Text>
                    </div>
                  )}
                </SimpleGrid>
              </Card>

              {/* Vital Signs */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={5} mb="md">Latest Vital Signs</Title>
                <SimpleGrid cols={3} spacing="md">
                  <div style={{ textAlign: 'center' }}>
                    <ThemeIcon color="red" mb="xs">
                      <IconHeart size={16} />
                    </ThemeIcon>
                    <Text size="lg" fw={700}>{selectedPatient.vitalSigns.heartRate}</Text>
                    <Text size="xs" c="dimmed">Heart Rate (bpm)</Text>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <ThemeIcon color="blue" mb="xs">
                      <IconDroplet size={16} />
                    </ThemeIcon>
                    <Text size="lg" fw={700}>{selectedPatient.vitalSigns.bloodPressure}</Text>
                    <Text size="xs" c="dimmed">Blood Pressure</Text>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <ThemeIcon color="orange" mb="xs">
                      <IconThermometer size={16} />
                    </ThemeIcon>
                    <Text size="lg" fw={700}>{selectedPatient.vitalSigns.temperature}°F</Text>
                    <Text size="xs" c="dimmed">Temperature</Text>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <ThemeIcon color="green" mb="xs">
                      <IconLungs size={16} />
                    </ThemeIcon>
                    <Text size="lg" fw={700}>{selectedPatient.vitalSigns.respiratoryRate}</Text>
                    <Text size="xs" c="dimmed">Respiratory Rate</Text>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <ThemeIcon color="cyan" mb="xs">
                      <IconDroplet size={16} />
                    </ThemeIcon>
                    <Text size="lg" fw={700}>{selectedPatient.vitalSigns.oxygenSaturation}%</Text>
                    <Text size="xs" c="dimmed">O2 Saturation</Text>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <ThemeIcon color="purple" mb="xs">
                      <IconActivity size={16} />
                    </ThemeIcon>
                    <Text size="lg" fw={700}>{selectedPatient.vitalSigns.painScale}/10</Text>
                    <Text size="xs" c="dimmed">Pain Scale</Text>
                  </div>
                </SimpleGrid>
                <Text size="xs" c="dimmed" ta="right" mt="md">
                  Last updated: {formatDateTime(selectedPatient.vitalSigns.lastUpdated)}
                </Text>
              </Card>

              {/* Current Medications */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={5} mb="md">Current Medications</Title>
                <Stack gap="sm">
                  {selectedPatient.medications.map((medication, index) => (
                    <Group key={index} justify="space-between" p="sm" style={{ backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                      <div>
                        <Text size="sm" fw={500}>{medication.name} {medication.dosage}</Text>
                        <Text size="xs" c="dimmed">{medication.frequency} - {medication.route}</Text>
                      </div>
                      <Text size="xs" c="dimmed">
                        Started: {formatDate(medication.startDate)}
                      </Text>
                    </Group>
                  ))}
                </Stack>
              </Card>

              {/* Billing Information */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={5} mb="md">Billing Information</Title>
                <SimpleGrid cols={3} spacing="md">
                  <div style={{ textAlign: 'center' }}>
                    <Text size="xl" fw={700} c="blue">₹{selectedPatient.dailyCharges.toLocaleString()}</Text>
                    <Text size="sm" c="dimmed">Daily Charges</Text>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Text size="xl" fw={700} c="green">₹{selectedPatient.totalCharges.toLocaleString()}</Text>
                    <Text size="sm" c="dimmed">Total Charges</Text>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Text size="xl" fw={700} c="red">₹{selectedPatient.pendingAmount.toLocaleString()}</Text>
                    <Text size="sm" c="dimmed">Pending Amount</Text>
                  </div>
                </SimpleGrid>
                
                {selectedPatient.insurance && (
                  <div className="mt-md">
                    <Text size="sm" c="dimmed" fw={500} mb="xs">Insurance Information</Text>
                    <Group justify="space-between">
                      <Text size="sm">{selectedPatient.insurance.provider}</Text>
                      <Text size="sm">Policy: {selectedPatient.insurance.policyNumber}</Text>
                      <Text size="sm">Approved: ₹{selectedPatient.insurance.approvalAmount.toLocaleString()}</Text>
                    </Group>
                  </div>
                )}
              </Card>

              {/* Action Buttons */}
              <Group justify="flex-end">
                <Button variant="light" onClick={closePatientDetail}>
                  Close
                </Button>
                <Button variant="light" leftSection={<IconPrinter size={16} />}>
                  Print Summary
                </Button>
                <Button leftSection={<IconEdit size={16} />}>
                  Update Record
                </Button>
              </Group>
            </Stack>
          </ScrollArea>
        )}
      </Modal>

      {/* New Admission Modal */}
      <Modal
        opened={admissionOpened}
        onClose={closeAdmission}
        title="New IPD Admission"
        size="lg"
      >
        <Stack gap="md">
          <SimpleGrid cols={2} spacing="md">
            <Select
              label="Patient"
              placeholder="Select patient"
              data={[
                { value: 'P001', label: 'Rajesh Kumar' },
                { value: 'P002', label: 'Sunita Patel' },
                { value: 'P003', label: 'Mohammed Ali' }
              ]}
              searchable
              required
            />
            <Select
              label="Admission Type"
              placeholder="Select type"
              data={[
                { value: 'emergency', label: 'Emergency' },
                { value: 'elective', label: 'Elective' },
                { value: 'transfer', label: 'Transfer' }
              ]}
              required
            />
          </SimpleGrid>

          <SimpleGrid cols={2} spacing="md">
            <Select
              label="Ward"
              placeholder="Select ward"
              data={[
                { value: 'icu', label: 'ICU' },
                { value: 'general', label: 'General Ward' },
                { value: 'private', label: 'Private Ward' }
              ]}
              required
            />
            <Select
              label="Primary Doctor"
              placeholder="Select doctor"
              data={[
                { value: 'D001', label: 'Dr. Sharma' },
                { value: 'D002', label: 'Dr. Reddy' },
                { value: 'D003', label: 'Dr. Singh' }
              ]}
              required
            />
          </SimpleGrid>

          <Textarea
            label="Diagnosis"
            placeholder="Enter primary diagnosis"
            required
          />

          <DatePickerInput
            label="Expected Discharge Date"
            placeholder="Select expected discharge date"
          />

          <Group justify="flex-end">
            <Button variant="light" onClick={closeAdmission}>
              Cancel
            </Button>
            <Button onClick={() => {
              notifications.show({
                title: 'Patient Admitted',
                message: 'New IPD admission has been successfully created',
                color: 'green',
              });
              closeAdmission();
            }}>
              Admit Patient
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default IPDManagement;