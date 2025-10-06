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
  DateInput,
  Switch,
  Divider,
  Alert,
  Timeline,
  MultiSelect,
  FileInput
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { DatePickerInput } from '@mantine/dates';
import { LineChart, BarChart, DonutChart } from '@mantine/charts';
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconEye,
  IconTrash,
  IconUser,
  IconPhone,
  IconMail,
  IconCalendar,
  IconHeart,
  IconStethoscope,
  IconPill,
  IconFileText,
  IconDownload,
  IconUpload,
  IconChartBar,
  IconUsers,
  IconUserCheck,
  IconUserX,
  IconMapPin,
  IconGenderFemale,
  IconGenderMale,
  IconId,
  IconEmergencyBed,
  IconClock,
  IconActivity,
  IconAlertCircle,
  IconCheck,
  IconX,
  IconRefresh,
  IconFilter,
  IconUserPlus,
  IconUserCircle,
  IconClipboard,
  IconMedicalCross,
  IconBed,
  IconNurse,
  IconReportMedical,
  IconPrinter,
  IconShare
} from '@tabler/icons-react';

// Types
interface Patient {
  id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bloodGroup: string;
  phone: string;
  email?: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  insurance?: {
    provider: string;
    policyNumber: string;
    validUntil: string;
  };
  status: 'active' | 'inactive' | 'deceased';
  registrationDate: string;
  lastVisit?: string;
  medicalHistory: string[];
  allergies: string[];
  currentMedications: string[];
  vitalSigns?: {
    height: number;
    weight: number;
    bmi: number;
    bloodPressure: string;
    heartRate: number;
    temperature: number;
  };
  assignedDoctor?: string;
  totalVisits: number;
  totalBills: number;
  outstandingAmount: number;
}

// Mock data
const mockPatients: Patient[] = [
  {
    id: '1',
    patientId: 'P2024001',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    dateOfBirth: '1985-03-15',
    age: 39,
    gender: 'male',
    bloodGroup: 'O+',
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@email.com',
    address: '123, MG Road, Bangalore, Karnataka - 560001',
    emergencyContact: {
      name: 'Priya Kumar',
      phone: '+91 98765 43211',
      relationship: 'Wife'
    },
    insurance: {
      provider: 'Max Bupa Health Insurance',
      policyNumber: 'MB123456789',
      validUntil: '2024-12-31'
    },
    status: 'active',
    registrationDate: '2023-01-15T09:30:00Z',
    lastVisit: '2024-01-10T14:30:00Z',
    medicalHistory: ['Hypertension', 'Diabetes Type 2'],
    allergies: ['Penicillin', 'Dust'],
    currentMedications: ['Metformin 500mg', 'Lisinopril 10mg'],
    vitalSigns: {
      height: 175,
      weight: 78,
      bmi: 25.5,
      bloodPressure: '140/90',
      heartRate: 72,
      temperature: 98.6
    },
    assignedDoctor: 'Dr. Sharma',
    totalVisits: 12,
    totalBills: 45000,
    outstandingAmount: 2500
  },
  {
    id: '2',
    patientId: 'P2024002',
    firstName: 'Sunita',
    lastName: 'Patel',
    dateOfBirth: '1992-07-22',
    age: 32,
    gender: 'female',
    bloodGroup: 'A+',
    phone: '+91 87654 32109',
    email: 'sunita.patel@email.com',
    address: '456, Brigade Road, Bangalore, Karnataka - 560025',
    emergencyContact: {
      name: 'Amit Patel',
      phone: '+91 87654 32108',
      relationship: 'Husband'
    },
    status: 'active',
    registrationDate: '2023-03-20T11:00:00Z',
    lastVisit: '2024-01-08T10:15:00Z',
    medicalHistory: ['Thyroid Disorder'],
    allergies: ['Shellfish'],
    currentMedications: ['Levothyroxine 50mcg'],
    vitalSigns: {
      height: 162,
      weight: 58,
      bmi: 22.1,
      bloodPressure: '120/80',
      heartRate: 68,
      temperature: 98.4
    },
    assignedDoctor: 'Dr. Reddy',
    totalVisits: 8,
    totalBills: 28000,
    outstandingAmount: 0
  },
  {
    id: '3',
    patientId: 'P2024003',
    firstName: 'Mohammed',
    lastName: 'Ali',
    dateOfBirth: '1978-11-05',
    age: 46,
    gender: 'male',
    bloodGroup: 'B+',
    phone: '+91 76543 21098',
    address: '789, Commercial Street, Bangalore, Karnataka - 560001',
    emergencyContact: {
      name: 'Fatima Ali',
      phone: '+91 76543 21097',
      relationship: 'Wife'
    },
    insurance: {
      provider: 'Star Health Insurance',
      policyNumber: 'SH987654321',
      validUntil: '2024-08-15'
    },
    status: 'active',
    registrationDate: '2023-06-10T16:45:00Z',
    lastVisit: '2024-01-12T09:20:00Z',
    medicalHistory: ['Heart Disease', 'Kidney Stones'],
    allergies: ['Aspirin'],
    currentMedications: ['Atorvastatin 20mg', 'Metoprolol 50mg'],
    assignedDoctor: 'Dr. Singh',
    totalVisits: 15,
    totalBills: 78000,
    outstandingAmount: 5200
  }
];

const PatientManagement = () => {
  // State management
  const [activeTab, setActiveTab] = useState<string>('all-patients');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Modal states
  const [patientDetailOpened, { open: openPatientDetail, close: closePatientDetail }] = useDisclosure(false);
  const [addPatientOpened, { open: openAddPatient, close: closeAddPatient }] = useDisclosure(false);
  const [editPatientOpened, { open: openEditPatient, close: closeEditPatient }] = useDisclosure(false);

  // Filter patients
  const filteredPatients = useMemo(() => {
    return mockPatients.filter((patient) => {
      const matchesSearch = 
        patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.phone.includes(searchQuery);
      
      const matchesGender = !selectedGender || patient.gender === selectedGender;
      const matchesStatus = !selectedStatus || patient.status === selectedStatus;
      const matchesBloodGroup = !selectedBloodGroup || patient.bloodGroup === selectedBloodGroup;

      return matchesSearch && matchesGender && matchesStatus && matchesBloodGroup;
    });
  }, [searchQuery, selectedGender, selectedStatus, selectedBloodGroup]);

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    openPatientDetail();
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    openEditPatient();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'gray';
      case 'deceased': return 'red';
      default: return 'gray';
    }
  };

  // Quick stats
  const patientStats = {
    total: mockPatients.length,
    active: mockPatients.filter(p => p.status === 'active').length,
    inactive: mockPatients.filter(p => p.status === 'inactive').length,
    newThisMonth: mockPatients.filter(p => 
      new Date(p.registrationDate).getMonth() === new Date().getMonth()
    ).length
  };

  return (
    <Container size="xl" py="md">
      {/* Header */}
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={1}>Patient Management</Title>
          <Text c="dimmed" size="sm">
            Comprehensive patient lifecycle management system
          </Text>
        </div>
        <Group>
          <Button variant="light" leftSection={<IconDownload size={16} />}>
            Export Data
          </Button>
          <Button leftSection={<IconUserPlus size={16} />} onClick={openAddPatient}>
            Add New Patient
          </Button>
        </Group>
      </Group>

      {/* Quick Stats */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="lg">
        <Card padding="lg" radius="md" withBorder>
          <Group justify="space-between">
            <div>
              <Text c="dimmed" size="sm" fw={500}>Total Patients</Text>
              <Text fw={700} size="xl">{patientStats.total}</Text>
            </div>
            <ThemeIcon color="blue" size="xl" radius="md" variant="light">
              <IconUsers size={24} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card padding="lg" radius="md" withBorder>
          <Group justify="space-between">
            <div>
              <Text c="dimmed" size="sm" fw={500}>Active Patients</Text>
              <Text fw={700} size="xl">{patientStats.active}</Text>
            </div>
            <ThemeIcon color="green" size="xl" radius="md" variant="light">
              <IconUserCheck size={24} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card padding="lg" radius="md" withBorder>
          <Group justify="space-between">
            <div>
              <Text c="dimmed" size="sm" fw={500}>Inactive Patients</Text>
              <Text fw={700} size="xl">{patientStats.inactive}</Text>
            </div>
            <ThemeIcon color="gray" size="xl" radius="md" variant="light">
              <IconUserX size={24} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card padding="lg" radius="md" withBorder>
          <Group justify="space-between">
            <div>
              <Text c="dimmed" size="sm" fw={500}>New This Month</Text>
              <Text fw={700} size="xl">{patientStats.newThisMonth}</Text>
            </div>
            <ThemeIcon color="violet" size="xl" radius="md" variant="light">
              <IconUserPlus size={24} />
            </ThemeIcon>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="all-patients" leftSection={<IconUsers size={16} />}>
            All Patients
          </Tabs.Tab>
          <Tabs.Tab value="analytics" leftSection={<IconChartBar size={16} />}>
            Analytics
          </Tabs.Tab>
        </Tabs.List>

        {/* All Patients Tab */}
        <Tabs.Panel value="all-patients">
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
                placeholder="Gender"
                data={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' }
                ]}
                value={selectedGender}
                onChange={setSelectedGender}
                clearable
              />
              <Select
                placeholder="Status"
                data={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'deceased', label: 'Deceased' }
                ]}
                value={selectedStatus}
                onChange={setSelectedStatus}
                clearable
              />
              <Select
                placeholder="Blood Group"
                data={[
                  { value: 'A+', label: 'A+' },
                  { value: 'A-', label: 'A-' },
                  { value: 'B+', label: 'B+' },
                  { value: 'B-', label: 'B-' },
                  { value: 'AB+', label: 'AB+' },
                  { value: 'AB-', label: 'AB-' },
                  { value: 'O+', label: 'O+' },
                  { value: 'O-', label: 'O-' }
                ]}
                value={selectedBloodGroup}
                onChange={setSelectedBloodGroup}
                clearable
              />
            </Group>

            {/* Patients Table */}
            <ScrollArea>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Patient ID</Table.Th>
                    <Table.Th>Patient Name</Table.Th>
                    <Table.Th>Age/Gender</Table.Th>
                    <Table.Th>Contact</Table.Th>
                    <Table.Th>Blood Group</Table.Th>
                    <Table.Th>Last Visit</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredPatients.map((patient) => (
                    <Table.Tr key={patient.id}>
                      <Table.Td>
                        <Text fw={500}>{patient.patientId}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Group>
                          <Avatar color="blue" radius="xl" size="sm">
                            {patient.firstName[0]}{patient.lastName[0]}
                          </Avatar>
                          <div>
                            <Text size="sm" fw={500}>
                              {patient.firstName} {patient.lastName}
                            </Text>
                            <Text size="xs" c="dimmed">
                              ID: {patient.patientId}
                            </Text>
                          </div>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Text size="sm">{patient.age}Y</Text>
                          <ThemeIcon size="sm" color="gray" variant="light">
                            {patient.gender === 'male' ? 
                              <IconGenderMale size={12} /> : 
                              <IconGenderFemale size={12} />
                            }
                          </ThemeIcon>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <div>
                          <Text size="sm">{patient.phone}</Text>
                          {patient.email && (
                            <Text size="xs" c="dimmed">{patient.email}</Text>
                          )}
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <Badge variant="light" color="red">
                          {patient.bloodGroup}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {patient.lastVisit ? formatDate(patient.lastVisit) : 'Never'}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getStatusColor(patient.status)} variant="light">
                          {patient.status.toUpperCase()}
                        </Badge>
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
                          <ActionIcon
                            variant="subtle"
                            color="green"
                            onClick={() => handleEditPatient(patient)}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                          <ActionIcon variant="subtle" color="red">
                            <IconTrash size={16} />
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
            {/* Gender Distribution */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">Gender Distribution</Title>
              <DonutChart
                data={[
                  { name: 'Male', value: mockPatients.filter(p => p.gender === 'male').length, color: 'blue' },
                  { name: 'Female', value: mockPatients.filter(p => p.gender === 'female').length, color: 'pink' },
                  { name: 'Other', value: mockPatients.filter(p => p.gender === 'other').length, color: 'gray' }
                ]}
                size={200}
                thickness={40}
                withLabels
              />
            </Card>

            {/* Age Distribution */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">Age Group Distribution</Title>
              <BarChart
                h={200}
                data={[
                  { ageGroup: '0-18', patients: 5 },
                  { ageGroup: '19-30', patients: 15 },
                  { ageGroup: '31-45', patients: 25 },
                  { ageGroup: '46-60', patients: 18 },
                  { ageGroup: '60+', patients: 12 }
                ]}
                dataKey="ageGroup"
                series={[{ name: 'patients', color: 'teal.6' }]}
              />
            </Card>

            {/* Blood Group Distribution */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">Blood Group Distribution</Title>
              <Stack gap="sm">
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => {
                  const count = mockPatients.filter(p => p.bloodGroup === bg).length;
                  const percentage = (count / mockPatients.length) * 100;
                  return (
                    <div key={bg}>
                      <Group justify="space-between" mb="xs">
                        <Text size="sm" fw={500}>{bg}</Text>
                        <Text size="sm">{count} ({percentage.toFixed(1)}%)</Text>
                      </Group>
                      <Progress value={percentage} size="md" />
                    </div>
                  );
                })}
              </Stack>
            </Card>

            {/* Registration Trends */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">Registration Trends (Last 6 Months)</Title>
              <LineChart
                h={200}
                data={[
                  { month: 'Aug', registrations: 45 },
                  { month: 'Sep', registrations: 52 },
                  { month: 'Oct', registrations: 38 },
                  { month: 'Nov', registrations: 61 },
                  { month: 'Dec', registrations: 48 },
                  { month: 'Jan', registrations: 55 }
                ]}
                dataKey="month"
                series={[{ name: 'registrations', color: 'violet.6' }]}
                curveType="linear"
              />
            </Card>
          </SimpleGrid>
        </Tabs.Panel>
      </Tabs>

      {/* Patient Detail Modal */}
      <Modal
        opened={patientDetailOpened}
        onClose={closePatientDetail}
        title="Patient Details"
        size="xl"
      >
        {selectedPatient && (
          <ScrollArea h={600}>
            <Stack gap="md">
              {/* Basic Info */}
              <Card padding="lg" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                  <Group>
                    <Avatar color="blue" size="xl" radius="xl">
                      {selectedPatient.firstName[0]}{selectedPatient.lastName[0]}
                    </Avatar>
                    <div>
                      <Title order={3}>
                        {selectedPatient.firstName} {selectedPatient.lastName}
                      </Title>
                      <Text c="dimmed">Patient ID: {selectedPatient.patientId}</Text>
                      <Badge color={getStatusColor(selectedPatient.status)} variant="light">
                        {selectedPatient.status.toUpperCase()}
                      </Badge>
                    </div>
                  </Group>
                  <Group>
                    <Button variant="light" leftSection={<IconEdit size={16} />}>
                      Edit
                    </Button>
                    <Button variant="light" leftSection={<IconPrinter size={16} />}>
                      Print
                    </Button>
                  </Group>
                </Group>

                <SimpleGrid cols={3} spacing="md">
                  <div>
                    <Text size="sm" c="dimmed">Age & Gender</Text>
                    <Text fw={500}>{selectedPatient.age} Years, {selectedPatient.gender}</Text>
                  </div>
                  <div>
                    <Text size="sm" c="dimmed">Blood Group</Text>
                    <Text fw={500}>{selectedPatient.bloodGroup}</Text>
                  </div>
                  <div>
                    <Text size="sm" c="dimmed">Registration Date</Text>
                    <Text fw={500}>{formatDate(selectedPatient.registrationDate)}</Text>
                  </div>
                </SimpleGrid>
              </Card>

              {/* Contact & Emergency Contact */}
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                <Card padding="lg" radius="md" withBorder>
                  <Title order={5} mb="md">Contact Information</Title>
                  <Stack gap="sm">
                    <Group>
                      <IconPhone size={16} />
                      <Text size="sm">{selectedPatient.phone}</Text>
                    </Group>
                    {selectedPatient.email && (
                      <Group>
                        <IconMail size={16} />
                        <Text size="sm">{selectedPatient.email}</Text>
                      </Group>
                    )}
                    <Group>
                      <IconMapPin size={16} />
                      <Text size="sm">{selectedPatient.address}</Text>
                    </Group>
                  </Stack>
                </Card>

                <Card padding="lg" radius="md" withBorder>
                  <Title order={5} mb="md">Emergency Contact</Title>
                  <Stack gap="sm">
                    <Group>
                      <IconUser size={16} />
                      <Text size="sm">{selectedPatient.emergencyContact.name}</Text>
                    </Group>
                    <Group>
                      <IconPhone size={16} />
                      <Text size="sm">{selectedPatient.emergencyContact.phone}</Text>
                    </Group>
                    <Group>
                      <IconHeart size={16} />
                      <Text size="sm">{selectedPatient.emergencyContact.relationship}</Text>
                    </Group>
                  </Stack>
                </Card>
              </SimpleGrid>

              {/* Medical Information */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={5} mb="md">Medical Information</Title>
                <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
                  <div>
                    <Text size="sm" c="dimmed" fw={500} mb="xs">Medical History</Text>
                    <Stack gap="xs">
                      {selectedPatient.medicalHistory.map((condition, index) => (
                        <Badge key={index} variant="outline" size="sm">
                          {condition}
                        </Badge>
                      ))}
                    </Stack>
                  </div>
                  <div>
                    <Text size="sm" c="dimmed" fw={500} mb="xs">Allergies</Text>
                    <Stack gap="xs">
                      {selectedPatient.allergies.map((allergy, index) => (
                        <Badge key={index} variant="outline" color="red" size="sm">
                          {allergy}
                        </Badge>
                      ))}
                    </Stack>
                  </div>
                  <div>
                    <Text size="sm" c="dimmed" fw={500} mb="xs">Current Medications</Text>
                    <Stack gap="xs">
                      {selectedPatient.currentMedications.map((medication, index) => (
                        <Badge key={index} variant="outline" color="blue" size="sm">
                          {medication}
                        </Badge>
                      ))}
                    </Stack>
                  </div>
                </SimpleGrid>
              </Card>

              {/* Vital Signs */}
              {selectedPatient.vitalSigns && (
                <Card padding="lg" radius="md" withBorder>
                  <Title order={5} mb="md">Latest Vital Signs</Title>
                  <SimpleGrid cols={{ base: 2, md: 6 }} spacing="md">
                    <div style={{ textAlign: 'center' }}>
                      <Text size="xs" c="dimmed">Height</Text>
                      <Text fw={600}>{selectedPatient.vitalSigns.height} cm</Text>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <Text size="xs" c="dimmed">Weight</Text>
                      <Text fw={600}>{selectedPatient.vitalSigns.weight} kg</Text>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <Text size="xs" c="dimmed">BMI</Text>
                      <Text fw={600}>{selectedPatient.vitalSigns.bmi}</Text>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <Text size="xs" c="dimmed">BP</Text>
                      <Text fw={600}>{selectedPatient.vitalSigns.bloodPressure}</Text>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <Text size="xs" c="dimmed">Heart Rate</Text>
                      <Text fw={600}>{selectedPatient.vitalSigns.heartRate} bpm</Text>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <Text size="xs" c="dimmed">Temperature</Text>
                      <Text fw={600}>{selectedPatient.vitalSigns.temperature}°F</Text>
                    </div>
                  </SimpleGrid>
                </Card>
              )}

              {/* Insurance Info */}
              {selectedPatient.insurance && (
                <Card padding="lg" radius="md" withBorder>
                  <Title order={5} mb="md">Insurance Information</Title>
                  <SimpleGrid cols={3} spacing="md">
                    <div>
                      <Text size="sm" c="dimmed">Provider</Text>
                      <Text fw={500}>{selectedPatient.insurance.provider}</Text>
                    </div>
                    <div>
                      <Text size="sm" c="dimmed">Policy Number</Text>
                      <Text fw={500}>{selectedPatient.insurance.policyNumber}</Text>
                    </div>
                    <div>
                      <Text size="sm" c="dimmed">Valid Until</Text>
                      <Text fw={500}>{formatDate(selectedPatient.insurance.validUntil)}</Text>
                    </div>
                  </SimpleGrid>
                </Card>
              )}

              {/* Summary Statistics */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={5} mb="md">Summary Statistics</Title>
                <SimpleGrid cols={3} spacing="md">
                  <div style={{ textAlign: 'center' }}>
                    <Text size="xl" fw={700} c="blue">{selectedPatient.totalVisits}</Text>
                    <Text size="sm" c="dimmed">Total Visits</Text>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Text size="xl" fw={700} c="green">₹{selectedPatient.totalBills.toLocaleString()}</Text>
                    <Text size="sm" c="dimmed">Total Bills</Text>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Text size="xl" fw={700} c="red">₹{selectedPatient.outstandingAmount.toLocaleString()}</Text>
                    <Text size="sm" c="dimmed">Outstanding</Text>
                  </div>
                </SimpleGrid>
              </Card>
            </Stack>
          </ScrollArea>
        )}
      </Modal>

      {/* Add Patient Modal */}
      <Modal
        opened={addPatientOpened}
        onClose={closeAddPatient}
        title="Add New Patient"
        size="xl"
      >
        <ScrollArea h={600}>
          <Stack gap="md">
            {/* Basic Information */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={5} mb="md">Basic Information</Title>
              <SimpleGrid cols={2} spacing="md">
                <TextInput
                  label="First Name"
                  placeholder="Enter first name"
                  required
                />
                <TextInput
                  label="Last Name"
                  placeholder="Enter last name"
                  required
                />
                <DatePickerInput
                  label="Date of Birth"
                  placeholder="Select date of birth"
                  required
                />
                <Select
                  label="Gender"
                  placeholder="Select gender"
                  data={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' }
                  ]}
                  required
                />
                <Select
                  label="Blood Group"
                  placeholder="Select blood group"
                  data={[
                    { value: 'A+', label: 'A+' },
                    { value: 'A-', label: 'A-' },
                    { value: 'B+', label: 'B+' },
                    { value: 'B-', label: 'B-' },
                    { value: 'AB+', label: 'AB+' },
                    { value: 'AB-', label: 'AB-' },
                    { value: 'O+', label: 'O+' },
                    { value: 'O-', label: 'O-' }
                  ]}
                  required
                />
                <TextInput
                  label="Phone Number"
                  placeholder="Enter phone number"
                  required
                />
                <TextInput
                  label="Email Address"
                  placeholder="Enter email address"
                />
              </SimpleGrid>
              <Textarea
                label="Address"
                placeholder="Enter full address"
                rows={3}
                mt="md"
                required
              />
            </Card>

            {/* Emergency Contact */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={5} mb="md">Emergency Contact</Title>
              <SimpleGrid cols={3} spacing="md">
                <TextInput
                  label="Contact Name"
                  placeholder="Enter contact name"
                  required
                />
                <TextInput
                  label="Contact Phone"
                  placeholder="Enter contact phone"
                  required
                />
                <TextInput
                  label="Relationship"
                  placeholder="e.g., Spouse, Parent"
                  required
                />
              </SimpleGrid>
            </Card>

            {/* Medical Information */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={5} mb="md">Medical Information</Title>
              <SimpleGrid cols={1} spacing="md">
                <MultiSelect
                  label="Medical History"
                  placeholder="Select or add medical conditions"
                  data={[
                    { value: 'hypertension', label: 'Hypertension' },
                    { value: 'diabetes', label: 'Diabetes' },
                    { value: 'heart_disease', label: 'Heart Disease' },
                    { value: 'asthma', label: 'Asthma' },
                    { value: 'arthritis', label: 'Arthritis' }
                  ]}
                  searchable
                  creatable
                  getCreateLabel={(query) => `+ Create ${query}`}
                />
                <MultiSelect
                  label="Allergies"
                  placeholder="Select or add allergies"
                  data={[
                    { value: 'penicillin', label: 'Penicillin' },
                    { value: 'aspirin', label: 'Aspirin' },
                    { value: 'dust', label: 'Dust' },
                    { value: 'pollen', label: 'Pollen' },
                    { value: 'shellfish', label: 'Shellfish' }
                  ]}
                  searchable
                  creatable
                  getCreateLabel={(query) => `+ Create ${query}`}
                />
                <MultiSelect
                  label="Current Medications"
                  placeholder="Select or add current medications"
                  data={[
                    { value: 'metformin', label: 'Metformin' },
                    { value: 'lisinopril', label: 'Lisinopril' },
                    { value: 'atorvastatin', label: 'Atorvastatin' },
                    { value: 'levothyroxine', label: 'Levothyroxine' }
                  ]}
                  searchable
                  creatable
                  getCreateLabel={(query) => `+ Create ${query}`}
                />
              </SimpleGrid>
            </Card>

            {/* Insurance Information */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={5} mb="md">Insurance Information (Optional)</Title>
              <SimpleGrid cols={3} spacing="md">
                <TextInput
                  label="Insurance Provider"
                  placeholder="Enter insurance provider"
                />
                <TextInput
                  label="Policy Number"
                  placeholder="Enter policy number"
                />
                <DatePickerInput
                  label="Valid Until"
                  placeholder="Select expiry date"
                />
              </SimpleGrid>
            </Card>

            <Group justify="flex-end">
              <Button variant="light" onClick={closeAddPatient}>
                Cancel
              </Button>
              <Button onClick={() => {
                notifications.show({
                  title: 'Patient Added',
                  message: 'New patient has been successfully registered',
                  color: 'green',
                });
                closeAddPatient();
              }}>
                Add Patient
              </Button>
            </Group>
          </Stack>
        </ScrollArea>
      </Modal>
    </Container>
  );
};

export default PatientManagement;