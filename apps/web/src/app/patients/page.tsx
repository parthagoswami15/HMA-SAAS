'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Text,
  Group,
  Badge,
  SimpleGrid,
  Stack,
  Flex,
  ActionIcon,
  Button,
  Tabs,
  Card,
  Progress,
  Avatar,
  Menu,
  Modal,
  Title,
  Divider,
  Alert,
  Select,
  TextInput,
  NumberInput
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconUsers,
  IconPlus,
  IconSearch,
  IconFilter,
  IconDownload,
  IconEye,
  IconEdit,
  IconTrash,
  IconPhone,
  IconMail,
  IconCalendar,
  IconStethoscope,
  IconHeart,
  IconAlertCircle,
  IconUser,
  IconId,
  IconShield,
  IconFileText,
  IconTrendingUp,
  IconUserPlus
} from '@tabler/icons-react';
import Layout from '../../components/shared/Layout';
import DataTable from '../../components/shared/DataTable';
import { useAppStore } from '../../stores/appStore';
import { UserRole, TableColumn, FilterOption } from '../../types/common';
import { Patient, PatientStats, PatientListItem } from '../../types/patient';
import { mockPatients, mockPatientStats } from '../../lib/mockData/patients';
import { formatDate, formatPhoneNumber, calculateAge } from '../../lib/utils';

// Mock user
const mockUser = {
  id: '1',
  name: 'Dr. Sarah Johnson',
  email: 'sarah.johnson@hospital.com',
  role: UserRole.DOCTOR,
  avatar: ''
};

export default function PatientsPage() {
  const { user, setUser, notifications } = useAppStore();
  const [activeTab, setActiveTab] = useState('list');
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [patientStats, setPatientStats] = useState<PatientStats>(mockPatientStats);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const [opened, { open, close }] = useDisclosure(false);
  const [viewModalOpened, { open: openView, close: closeView }] = useDisclosure(false);

  useEffect(() => {
    if (!user) {
      setUser(mockUser);
    }
  }, [user, setUser]);

  // Convert patients to list items for table
  const patientListItems: PatientListItem[] = patients.map(patient => ({
    id: patient.id,
    patientId: patient.patientId,
    fullName: `${patient.firstName} ${patient.lastName}`,
    age: patient.age,
    gender: patient.gender,
    phoneNumber: patient.contactInfo.phone,
    lastVisitDate: patient.lastVisitDate,
    totalVisits: patient.totalVisits,
    status: patient.status,
    hasInsurance: !!patient.insuranceInfo?.isActive,
    emergencyFlag: patient.chronicDiseases.length > 0
  }));

  // Table columns configuration
  const columns: TableColumn[] = [
    {
      key: 'patientId',
      title: 'Patient ID',
      sortable: true,
      width: '120px',
      render: (value) => (
        <Text fw={500} c="blue">
          {value}
        </Text>
      )
    },
    {
      key: 'fullName',
      title: 'Patient Name',
      sortable: true,
      render: (value, record) => (
        <Group gap="sm">
          <Avatar size="sm" name={value} color="blue" />
          <div>
            <Text fw={500}>{value}</Text>
            <Text size="xs" c="dimmed">
              {record.age} years • {record.gender}
            </Text>
          </div>
        </Group>
      )
    },
    {
      key: 'phoneNumber',
      title: 'Contact',
      render: (value, record) => (
        <div>
          <Group gap="xs">
            <IconPhone size="1rem" />
            <Text size="sm">{formatPhoneNumber(value)}</Text>
          </Group>
        </div>
      )
    },
    {
      key: 'lastVisitDate',
      title: 'Last Visit',
      sortable: true,
      render: (value) => value ? formatDate(value) : 'Never'
    },
    {
      key: 'totalVisits',
      title: 'Visits',
      sortable: true,
      width: '80px',
      render: (value) => (
        <Badge variant="light" color="blue">
          {value}
        </Badge>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => (
        <Badge 
          color={value === 'active' ? 'green' : 'red'}
          variant="light"
        >
          {value}
        </Badge>
      )
    },
    {
      key: 'hasInsurance',
      title: 'Insurance',
      render: (value, record) => (
        <Group gap="xs">
          {value ? (
            <Badge color="green" variant="light" leftSection={<IconShield size="0.8rem" />}>
              Insured
            </Badge>
          ) : (
            <Badge color="gray" variant="light">
              Self Pay
            </Badge>
          )}
          {record.emergencyFlag && (
            <IconAlertCircle size="1rem" color="red" />
          )}
        </Group>
      )
    }
  ];

  // Filter options
  const filterOptions: FilterOption[] = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    },
    {
      key: 'gender',
      label: 'Gender',
      type: 'select',
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      key: 'hasInsurance',
      label: 'Insurance',
      type: 'select',
      options: [
        { value: 'true', label: 'Insured' },
        { value: 'false', label: 'Self Pay' }
      ]
    }
  ];

  // Handle patient actions
  const handleViewPatient = (patient: PatientListItem) => {
    const fullPatient = patients.find(p => p.id === patient.id);
    if (fullPatient) {
      setSelectedPatient(fullPatient);
      openView();
    }
  };

  const handleEditPatient = (patient: PatientListItem) => {
    const fullPatient = patients.find(p => p.id === patient.id);
    if (fullPatient) {
      setSelectedPatient(fullPatient);
      open();
    }
  };

  const handleDeletePatient = (patient: PatientListItem) => {
    // In real implementation, show confirmation modal
    console.log('Delete patient:', patient.patientId);
  };

  // Statistics cards
  const StatCard = ({ title, value, icon, color, subtitle }: { title: string; value: string; icon: React.ReactNode; color: string; subtitle?: string }) => (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <div style={{ color: `var(--mantine-color-${color}-6)` }}>
          {icon}
        </div>
      </Group>
      
      <Text size="xl" fw={700} mb="xs">
        {value}
      </Text>
      
      <Text size="sm" c="dimmed" mb="sm">
        {title}
      </Text>
      
      {subtitle && (
        <Text size="xs" c="dimmed">
          {subtitle}
        </Text>
      )}
    </Card>
  );

  return (
    <Layout user={user} notifications={notifications.length} onLogout={() => setUser(null)}>
      <Container fluid>
        <Stack gap="lg">
          {/* Header */}
          <Group justify="space-between">
            <div>
              <Title order={2}>Patient Management</Title>
              <Text c="dimmed">
                Manage patient registration, medical records, and healthcare information
              </Text>
            </div>
            <Group>
              <Button
                leftSection={<IconUserPlus size="1rem" />}
                onClick={open}
              >
                New Patient
              </Button>
              <Button
                variant="outline"
                leftSection={<IconDownload size="1rem" />}
              >
                Export
              </Button>
            </Group>
          </Group>

          {/* Statistics Cards */}
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
            <StatCard
              title="Total Patients"
              value={patientStats.totalPatients.toLocaleString()}
              icon={<IconUsers size="2rem" />}
              color="blue"
              subtitle={`+${patientStats.newPatientsThisMonth} this month`}
            />
            <StatCard
              title="New Today"
              value={patientStats.newPatientsToday}
              icon={<IconUserPlus size="2rem" />}
              color="green"
              subtitle="New registrations today"
            />
            <StatCard
              title="Active Patients"
              value={patientStats.activePatients.toLocaleString()}
              icon={<IconHeart size="2rem" />}
              color="red"
              subtitle="Currently under care"
            />
            <StatCard
              title="Average Age"
              value={`${patientStats.averageAge} years`}
              icon={<IconCalendar size="2rem" />}
              color="purple"
              subtitle="Patient demographics"
            />
          </SimpleGrid>

          {/* Tabs */}
          <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'list')}>
            <Tabs.List>
              <Tabs.Tab value="list">Patient List</Tabs.Tab>
              <Tabs.Tab value="analytics">Analytics</Tabs.Tab>
              <Tabs.Tab value="demographics">Demographics</Tabs.Tab>
              <Tabs.Tab value="insurance">Insurance</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="list" pt="md">
              <DataTable
                data={patientListItems}
                columns={columns}
                loading={loading}
                searchable={true}
                filterable={true}
                sortable={true}
                filters={filterOptions}
                onSearch={(query) => setSearchQuery(query)}
                onFilter={(filters) => setFilters(filters)}
                pagination={{
                  page: 1,
                  limit: 10,
                  total: patientListItems.length,
                  onPageChange: (page) => console.log('Page:', page),
                  onLimitChange: (limit) => console.log('Limit:', limit)
                }}
                actions={{
                  view: handleViewPatient,
                  edit: handleEditPatient,
                  delete: handleDeletePatient
                }}
                emptyMessage="No patients found"
              />
            </Tabs.Panel>

            <Tabs.Panel value="analytics" pt="md">
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Paper p="lg" shadow="sm" radius="md" withBorder>
                    <Text fw={600} size="lg" mb="md">
                      Visit Trends (Last 7 Days)
                    </Text>
                    <Stack gap="sm">
                      {patientStats.visitTrends.map((trend, index) => (
                        <Group key={index} justify="space-between">
                          <Text size="sm">{formatDate(new Date(trend.date))}</Text>
                          <Group gap="sm">
                            <Progress 
                              value={(trend.count / 200) * 100} 
                              size="sm" 
                              w={100}
                              color="blue"
                            />
                            <Text size="sm" fw={500}>{trend.count}</Text>
                          </Group>
                        </Group>
                      ))}
                    </Stack>
                  </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Paper p="lg" shadow="sm" radius="md" withBorder>
                    <Text fw={600} size="lg" mb="md">
                      Quick Stats
                    </Text>
                    <Stack gap="md">
                      <Group justify="space-between">
                        <Text size="sm">Male Patients</Text>
                        <Text size="sm" fw={500}>
                          {patientStats.genderDistribution.male} ({Math.round((patientStats.genderDistribution.male / patientStats.totalPatients) * 100)}%)
                        </Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm">Female Patients</Text>
                        <Text size="sm" fw={500}>
                          {patientStats.genderDistribution.female} ({Math.round((patientStats.genderDistribution.female / patientStats.totalPatients) * 100)}%)
                        </Text>
                      </Group>
                      <Divider />
                      <Group justify="space-between">
                        <Text size="sm">Insured Patients</Text>
                        <Text size="sm" fw={500} c="green">
                          {patientStats.insuranceDistribution.insured} ({Math.round((patientStats.insuranceDistribution.insured / patientStats.totalPatients) * 100)}%)
                        </Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm">Self-Pay Patients</Text>
                        <Text size="sm" fw={500} c="orange">
                          {patientStats.insuranceDistribution.uninsured} ({Math.round((patientStats.insuranceDistribution.uninsured / patientStats.totalPatients) * 100)}%)
                        </Text>
                      </Group>
                    </Stack>
                  </Paper>
                </Grid.Col>
              </Grid>
            </Tabs.Panel>

            <Tabs.Panel value="demographics" pt="md">
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Paper p="lg" shadow="sm" radius="md" withBorder>
                    <Text fw={600} size="lg" mb="md">
                      Blood Group Distribution
                    </Text>
                    <Stack gap="sm">
                      {Object.entries(patientStats.bloodGroupDistribution).map(([bloodGroup, count]) => (
                        <Group key={bloodGroup} justify="space-between">
                          <Text size="sm">{bloodGroup}</Text>
                          <Group gap="sm">
                            <Progress 
                              value={(count / patientStats.totalPatients) * 100} 
                              size="sm" 
                              w={100}
                              color="red"
                            />
                            <Text size="sm" fw={500}>{count}</Text>
                          </Group>
                        </Group>
                      ))}
                    </Stack>
                  </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Paper p="lg" shadow="sm" radius="md" withBorder>
                    <Text fw={600} size="lg" mb="md">
                      Age Distribution
                    </Text>
                    <Alert icon={<IconAlertCircle size="1rem" />} color="blue">
                      Age analytics feature will show detailed age group breakdowns, 
                      pediatric vs adult ratios, and senior citizen statistics.
                    </Alert>
                  </Paper>
                </Grid.Col>
              </Grid>
            </Tabs.Panel>

            <Tabs.Panel value="insurance" pt="md">
              <Paper p="lg" shadow="sm" radius="md" withBorder>
                <Text fw={600} size="lg" mb="md">
                  Insurance Coverage Analysis
                </Text>
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                  <div>
                    <Text size="sm" c="dimmed" mb="sm">Coverage Distribution</Text>
                    <Group gap="lg">
                      <div>
                        <Text size="xl" fw={700} c="green">
                          {Math.round((patientStats.insuranceDistribution.insured / patientStats.totalPatients) * 100)}%
                        </Text>
                        <Text size="sm" c="dimmed">Insured</Text>
                      </div>
                      <div>
                        <Text size="xl" fw={700} c="orange">
                          {Math.round((patientStats.insuranceDistribution.uninsured / patientStats.totalPatients) * 100)}%
                        </Text>
                        <Text size="sm" c="dimmed">Self-Pay</Text>
                      </div>
                    </Group>
                  </div>
                  <div>
                    <Text size="sm" c="dimmed" mb="sm">Insurance Types</Text>
                    <Alert icon={<IconShield size="1rem" />} color="blue">
                      Government: 45% • Private: 35% • Corporate: 20%
                    </Alert>
                  </div>
                </SimpleGrid>
              </Paper>
            </Tabs.Panel>
          </Tabs>

          {/* Patient Details Modal */}
          <Modal
            opened={viewModalOpened}
            onClose={closeView}
            title="Patient Details"
            size="xl"
          >
            {selectedPatient && (
              <Stack gap="md">
                <Group>
                  <Avatar size="lg" name={`${selectedPatient.firstName} ${selectedPatient.lastName}`} color="blue" />
                  <div>
                    <Text size="lg" fw={600}>
                      {selectedPatient.firstName} {selectedPatient.lastName}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {selectedPatient.patientId} • {selectedPatient.age} years • {selectedPatient.gender}
                    </Text>
                  </div>
                </Group>

                <Divider />

                <SimpleGrid cols={2} spacing="md">
                  <div>
                    <Text size="sm" fw={500} mb="xs">Contact Information</Text>
                    <Stack gap="xs">
                      <Group gap="xs">
                        <IconPhone size="1rem" />
                        <Text size="sm">{formatPhoneNumber(selectedPatient.contactInfo.phone)}</Text>
                      </Group>
                      {selectedPatient.contactInfo.email && (
                        <Group gap="xs">
                          <IconMail size="1rem" />
                          <Text size="sm">{selectedPatient.contactInfo.email}</Text>
                        </Group>
                      )}
                    </Stack>
                  </div>

                  <div>
                    <Text size="sm" fw={500} mb="xs">Medical Information</Text>
                    <Stack gap="xs">
                      <Text size="sm">
                        <strong>Blood Group:</strong> {selectedPatient.bloodGroup || 'Not specified'}
                      </Text>
                      <Text size="sm">
                        <strong>Total Visits:</strong> {selectedPatient.totalVisits}
                      </Text>
                      {selectedPatient.lastVisitDate && (
                        <Text size="sm">
                          <strong>Last Visit:</strong> {formatDate(selectedPatient.lastVisitDate)}
                        </Text>
                      )}
                    </Stack>
                  </div>
                </SimpleGrid>

                {selectedPatient.allergies.length > 0 && (
                  <>
                    <Divider />
                    <div>
                      <Text size="sm" fw={500} mb="xs" c="red">Allergies</Text>
                      <Group gap="xs">
                        {selectedPatient.allergies.map((allergy, index) => (
                          <Badge key={index} color="red" variant="light">
                            {allergy}
                          </Badge>
                        ))}
                      </Group>
                    </div>
                  </>
                )}

                {selectedPatient.chronicDiseases.length > 0 && (
                  <>
                    <Divider />
                    <div>
                      <Text size="sm" fw={500} mb="xs" c="orange">Chronic Diseases</Text>
                      <Group gap="xs">
                        {selectedPatient.chronicDiseases.map((disease, index) => (
                          <Badge key={index} color="orange" variant="light">
                            {disease}
                          </Badge>
                        ))}
                      </Group>
                    </div>
                  </>
                )}

                {selectedPatient.insuranceInfo && (
                  <>
                    <Divider />
                    <div>
                      <Text size="sm" fw={500} mb="xs" c="green">Insurance Information</Text>
                      <Stack gap="xs">
                        <Text size="sm">
                          <strong>Provider:</strong> {selectedPatient.insuranceInfo.insuranceProvider}
                        </Text>
                        <Text size="sm">
                          <strong>Policy Number:</strong> {selectedPatient.insuranceInfo.policyNumber}
                        </Text>
                        <Text size="sm">
                          <strong>Coverage:</strong> ₹{selectedPatient.insuranceInfo.coverageAmount.toLocaleString()}
                        </Text>
                      </Stack>
                    </div>
                  </>
                )}
              </Stack>
            )}
          </Modal>

          {/* Add/Edit Patient Modal */}
          <Modal
            opened={opened}
            onClose={close}
            title={selectedPatient ? "Edit Patient" : "Add New Patient"}
            size="xl"
          >
            <Alert icon={<IconAlertCircle size="1rem" />} color="blue" mb="md">
              Patient registration form will be implemented with all required fields including 
              demographics, contact info, medical history, insurance details, and document uploads.
            </Alert>
          </Modal>
        </Stack>
      </Container>
    </Layout>
  );
}

