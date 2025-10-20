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
  Button,
  Tabs,
  Card,
  Progress,
  Avatar,
  Title,
  Divider,
  Alert,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconUsers,
  IconDownload,
  IconPhone,
  IconCalendar,
  IconHeart,
  IconAlertCircle,
  IconShieldX,
  IconUsers as IconUserPlus,
} from '@tabler/icons-react';
import Layout from '../../components/shared/Layout';
import DataTable from '../../components/shared/DataTable';
import PatientForm from '../../components/patients/PatientForm';
import PatientDetails from '../../components/patients/PatientDetails';
import MedicalHistoryManager from '../../components/patients/MedicalHistoryManager';
import DocumentManager from '../../components/patients/DocumentManager';
import { useAppStore } from '../../stores/appStore';
import { User, UserRole, TableColumn, FilterOption, Status } from '../../types/common';
import {
  Patient,
  PatientStats,
  PatientListItem,
  CreatePatientDto,
  UpdatePatientDto,
} from '../../types/patient';
import { patientsService } from '../../services';
import { formatDate, formatPhoneNumber } from '../../lib/utils';
import { notifications as notificationsService } from '@mantine/notifications';

const mockUser: User = {
  id: '1',
  username: 'sjohnson',
  email: 'sarah.johnson@hospital.com',
  firstName: 'Sarah',
  lastName: 'Johnson',
  role: UserRole.DOCTOR,
  permissions: [],
  isActive: true,
  tenantInfo: {
    tenantId: 'T001',
    tenantName: 'Main Hospital',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

function PatientsPage() {
  const { user, setUser } = useAppStore();
  const [activeTab, setActiveTab] = useState('list');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientStats, setPatientStats] = useState<PatientStats | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [_searchQuery, _setSearchQuery] = useState('');
  const [_filters, _setFilters] = useState<Record<string, unknown>>({});
  const [opened, { open, close }] = useDisclosure(false);
  const [viewModalOpened, { open: openView, close: closeView }] = useDisclosure(false);
  const [historyModalOpened, { open: openHistory, close: closeHistory }] = useDisclosure(false);
  const [documentsModalOpened, { open: openDocuments, close: closeDocuments }] =
    useDisclosure(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (!user) {
      setUser(mockUser);
    }
    fetchStats();
  }, [user, setUser]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await patientsService.getPatients();
      if (response.success && response.data) {
        setPatients(response.data.patients || []);
      } else {
        notificationsService.show({
          title: 'Error',
          message: 'Failed to fetch patients',
          color: 'red',
        });
      }
    } catch (error: any) {
      console.error('Error fetching patients:', error);
      notificationsService.show({
        title: 'Error',
        message: error?.message || 'Failed to fetch patients',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await patientsService.getPatientStats();
      if (response.success && response.data) {
        setPatientStats(response.data as unknown as PatientStats);
      }
    } catch (error: any) {
      console.error('Error fetching stats:', error);
    }
  };

  // Convert patients to list items for table
  const patientListItems: PatientListItem[] = patients.map((patient) => ({
    id: patient.id,
    patientId: (patient as any).medicalRecordNumber || patient.id,
    fullName: `${patient.firstName} ${patient.lastName}`,
    age: calculateAge(patient.dateOfBirth),
    gender: patient.gender,
    phoneNumber: (patient as any).phone || '',
    lastVisitDate: new Date(), // Placeholder - need to add to API
    totalVisits: 0, // Placeholder - need to add to API
    status: (patient as any).isActive ? Status.ACTIVE : Status.INACTIVE,
    hasInsurance: false, // Placeholder - need to add to API
    emergencyFlag: false, // Placeholder
  }));

  const calculateAge = (dateOfBirth: Date | string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Handle patient actions
  const handleViewPatient = (patient: PatientListItem) => {
    const fullPatient = patients.find((p) => p.id === patient.id);
    if (fullPatient) {
      setSelectedPatient(fullPatient);
      openView();
    }
  };

  const handleEditPatientForTable = (patient: PatientListItem) => {
    const fullPatient = patients.find((p) => p.id === patient.id);
    if (fullPatient) {
      setSelectedPatient(fullPatient);
      open();
    }
  };

  const handleEditPatientForModal = (patient: Patient) => {
    setSelectedPatient(patient);
    open();
  };

  const handleDeletePatient = async (patient: PatientListItem) => {
    if (window.confirm(`Are you sure you want to delete patient ${patient.fullName}?`)) {
      try {
        const response = await patientsService.deletePatient(patient.id);
        if (response.success) {
          notificationsService.show({
            title: 'Success',
            message: 'Patient deleted successfully',
            color: 'green',
          });
          fetchPatients();
          fetchStats();
        }
      } catch (error: any) {
        console.error('Error deleting patient:', error);
        notificationsService.show({
          title: 'Error',
          message: error?.message || 'Failed to delete patient',
          color: 'red',
        });
      }
    }
  };

  // Patient CRUD operations
  const handleCreatePatient = async (data: CreatePatientDto) => {
    try {
      // Convert Date to string for API
      const apiData = {
        ...data,
        dateOfBirth:
          data.dateOfBirth instanceof Date ? data.dateOfBirth.toISOString() : data.dateOfBirth,
      };
      const response = await patientsService.createPatient(apiData as any);
      if (response.success) {
        notificationsService.show({
          title: 'Success',
          message: 'Patient created successfully',
          color: 'green',
        });
        fetchPatients();
        fetchStats();
        close();
      }
    } catch (error: any) {
      console.error('Error creating patient:', error);
      notificationsService.show({
        title: 'Error',
        message: error?.message || 'Failed to create patient',
        color: 'red',
      });
      throw error;
    }
  };

  const handleUpdatePatient = async (data: UpdatePatientDto) => {
    try {
      // Convert Date to string for API
      const apiData = {
        ...data,
        dateOfBirth:
          data.dateOfBirth instanceof Date ? data.dateOfBirth.toISOString() : data.dateOfBirth,
      };
      const response = await patientsService.updatePatient(data.id, apiData as any);
      if (response.success) {
        notificationsService.show({
          title: 'Success',
          message: 'Patient updated successfully',
          color: 'green',
        });
        fetchPatients();
        fetchStats();
        close();
      }
    } catch (error: any) {
      console.error('Error updating patient:', error);
      notificationsService.show({
        title: 'Error',
        message: error?.message || 'Failed to update patient',
        color: 'red',
      });
      throw error;
    }
  };

  // Medical history operations
  const handleSaveMedicalHistory = async (history: any): Promise<void> => {
    console.log('Saving medical history:', history);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleUpdateMedicalHistory = async (id: string, history: any): Promise<void> => {
    console.log('Updating medical history:', id, history);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleDeleteMedicalHistory = async (id: string): Promise<void> => {
    console.log('Deleting medical history:', id);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  // Document operations
  const handleUploadDocument = async (document: any, file: File): Promise<void> => {
    console.log('Uploading document:', document, file);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleUpdateDocument = async (id: string, document: any): Promise<void> => {
    console.log('Updating document:', id, document);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleDeleteDocument = async (id: string): Promise<void> => {
    console.log('Deleting document:', id);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleDownloadDocument = async (document: any): Promise<void> => {
    console.log('Downloading document:', document);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleViewDocument = async (document: any): Promise<void> => {
    console.log('Viewing document:', document);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  // Additional handlers
  const handleScheduleAppointment = (patientId: string) => {
    console.log('Schedule appointment for patient:', patientId);
    // Would navigate to appointment scheduling
  };

  const __handleOpenHistory = (_patient: PatientListItem) => {
    const fullPatient = patients.find((p) => p.id === _patient.id);
    if (fullPatient) {
      setSelectedPatient(fullPatient);
      openHistory();
    }
  };

  const __handleOpenDocuments = (_patient: PatientListItem) => {
    const fullPatient = patients.find((p) => p.id === _patient.id);
    if (fullPatient) {
      setSelectedPatient(fullPatient);
      openDocuments();
    }
  };

  // Table columns configuration
  const columns: TableColumn[] = [
    {
      key: 'patientId',
      title: 'Patient ID',
      sortable: true,
      width: '120px',
      render: (value) => (
        <Text fw={500} c="blue">
          {value as string}
        </Text>
      ),
    },
    {
      key: 'fullName',
      title: 'Patient Name',
      sortable: true,
      render: (value, record) => (
        <Group gap="sm">
          <Avatar size="sm" name={value as string} color="blue" />
          <div>
            <Text fw={500}>{value as string}</Text>
            <Text size="xs" c="dimmed">
              {record.age as string} years • {record.gender as string}
            </Text>
          </div>
        </Group>
      ),
    },
    {
      key: 'phoneNumber',
      title: 'Contact',
      render: (value) => (
        <div>
          <Group gap="xs">
            <IconPhone size="1rem" />
            <Text size="sm">{formatPhoneNumber(value as string)}</Text>
          </Group>
        </div>
      ),
    },
    {
      key: 'lastVisitDate',
      title: 'Last Visit',
      sortable: true,
      render: (value) => (value ? formatDate(value as string | Date) : 'Never'),
    },
    {
      key: 'totalVisits',
      title: 'Visits',
      sortable: true,
      width: '80px',
      render: (value) => (
        <Badge variant="light" color="blue">
          {value as string}
        </Badge>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => (
        <Badge color={value === 'active' ? 'green' : 'red'} variant="light">
          {value as string}
        </Badge>
      ),
    },
    {
      key: 'hasInsurance',
      title: 'Insurance',
      render: (value, record) => (
        <Group gap="xs">
          {value ? (
            <Badge color="green" variant="light" leftSection={<IconShieldX size="0.8rem" />}>
              Insured
            </Badge>
          ) : (
            <Badge color="gray" variant="light">
              Self Pay
            </Badge>
          )}
          {record.emergencyFlag && <IconAlertCircle size="1rem" color="red" />}
        </Group>
      ),
    },
  ];

  // Filter options
  const filterOptions: FilterOption[] = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
    },
    {
      key: 'gender',
      label: 'Gender',
      type: 'select',
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
      ],
    },
    {
      key: 'hasInsurance',
      label: 'Insurance',
      type: 'select',
      options: [
        { value: 'true', label: 'Insured' },
        { value: 'false', label: 'Self Pay' },
      ],
    },
  ];

  // Statistics cards
  const StatCard = ({
    title,
    value,
    icon,
    color,
    subtitle,
  }: {
    title: string;
    value: string;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
  }) => (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <div style={{ color: `var(--mantine-color-${color}-6)` }}>{icon}</div>
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
    <Layout
      user={
        user
          ? {
              id: user.id,
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              role: user.role,
            }
          : undefined
      }
      notifications={0}
      onLogout={() => setUser(null)}
    >
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
              <Button leftSection={<IconUserPlus size="1rem" />} onClick={open}>
                New Patient
              </Button>
              <Button variant="outline" leftSection={<IconDownload size="1rem" />}>
                Export
              </Button>
            </Group>
          </Group>

          {/* Statistics Cards */}
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
            <StatCard
              title="Total Patients"
              value={patientStats ? patientStats.totalPatients.toLocaleString() : '0'}
              icon={<IconUsers size="2rem" />}
              color="blue"
              subtitle={patientStats ? `+${patientStats.newPatientsThisMonth} this month` : ''}
            />
            <StatCard
              title="New Today"
              value={patientStats ? patientStats.newPatientsToday.toString() : '0'}
              icon={<IconUserPlus size="2rem" />}
              color="green"
              subtitle="New registrations today"
            />
            <StatCard
              title="Active Patients"
              value={patientStats ? patientStats.activePatients.toLocaleString() : '0'}
              icon={<IconHeart size="2rem" />}
              color="red"
              subtitle="Currently under care"
            />
            <StatCard
              title="Average Age"
              value={patientStats ? `${patientStats.averageAge} years` : '0 years'}
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
                onSearch={(query) => _setSearchQuery(query)}
                onFilter={(filters) => _setFilters(filters)}
                pagination={{
                  page: 1,
                  limit: 10,
                  total: patientListItems.length,
                  onPageChange: (page) => console.log('Page:', page),
                  onLimitChange: (limit) => console.log('Limit:', limit),
                }}
                actions={{
                  view: handleViewPatient,
                  edit: handleEditPatientForTable,
                  delete: handleDeletePatient,
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
                      {patientStats?.visitTrends?.map((trend, index) => (
                        <Group key={index} justify="space-between">
                          <Text size="sm">{formatDate(new Date(trend.date))}</Text>
                          <Group gap="sm">
                            <Progress
                              value={(trend.count / 200) * 100}
                              size="sm"
                              w={100}
                              color="blue"
                            />
                            <Text size="sm" fw={500}>
                              {trend.count}
                            </Text>
                          </Group>
                        </Group>
                      )) || <Text>No data available</Text>}
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
                          {patientStats
                            ? `${patientStats.genderDistribution.male} (${Math.round((patientStats.genderDistribution.male / patientStats.totalPatients) * 100)}%)`
                            : '0 (0%)'}
                        </Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm">Female Patients</Text>
                        <Text size="sm" fw={500}>
                          {patientStats
                            ? `${patientStats.genderDistribution.female} (${Math.round((patientStats.genderDistribution.female / patientStats.totalPatients) * 100)}%)`
                            : '0 (0%)'}
                        </Text>
                      </Group>
                      <Divider />
                      <Group justify="space-between">
                        <Text size="sm">Insured Patients</Text>
                        <Text size="sm" fw={500} c="green">
                          {patientStats
                            ? `${patientStats.insuranceDistribution.insured} (${Math.round((patientStats.insuranceDistribution.insured / patientStats.totalPatients) * 100)}%)`
                            : '0 (0%)'}
                        </Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm">Self-Pay Patients</Text>
                        <Text size="sm" fw={500} c="orange">
                          {patientStats
                            ? `${patientStats.insuranceDistribution.uninsured} (${Math.round((patientStats.insuranceDistribution.uninsured / patientStats.totalPatients) * 100)}%)`
                            : '0 (0%)'}
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
                      {(patientStats?.bloodGroupDistribution &&
                        Object.entries(patientStats.bloodGroupDistribution).map(
                          ([bloodGroup, count]) => (
                            <Group key={bloodGroup} justify="space-between">
                              <Text size="sm">{bloodGroup}</Text>
                              <Group gap="sm">
                                <Progress
                                  value={(count / (patientStats.totalPatients || 1)) * 100}
                                  size="sm"
                                  w={100}
                                  color="red"
                                />
                                <Text size="sm" fw={500}>
                                  {count}
                                </Text>
                              </Group>
                            </Group>
                          )
                        )) || <Text>No data available</Text>}
                    </Stack>
                  </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Paper p="lg" shadow="sm" radius="md" withBorder>
                    <Text fw={600} size="lg" mb="md">
                      Age Distribution
                    </Text>
                    <Alert icon={<IconAlertCircle size="1rem" />} color="blue">
                      Age analytics feature will show detailed age group breakdowns, pediatric vs
                      adult ratios, and senior citizen statistics.
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
                    <Text size="sm" c="dimmed" mb="sm">
                      Coverage Distribution
                    </Text>
                    <Group gap="lg">
                      <div>
                        <Text size="xl" fw={700} c="green">
                          {patientStats
                            ? `${Math.round((patientStats.insuranceDistribution.insured / patientStats.totalPatients) * 100)}%`
                            : '0%'}
                        </Text>
                        <Text size="sm" c="dimmed">
                          Insured
                        </Text>
                      </div>
                      <div>
                        <Text size="xl" fw={700} c="orange">
                          {patientStats
                            ? `${Math.round((patientStats.insuranceDistribution.uninsured / patientStats.totalPatients) * 100)}%`
                            : '0%'}
                        </Text>
                        <Text size="sm" c="dimmed">
                          Self-Pay
                        </Text>
                      </div>
                    </Group>
                  </div>
                  <div>
                    <Text size="sm" c="dimmed" mb="sm">
                      Insurance Types
                    </Text>
                    <Alert icon={<IconShieldX size="1rem" />} color="blue">
                      Government: 45% • Private: 35% • Corporate: 20%
                    </Alert>
                  </div>
                </SimpleGrid>
              </Paper>
            </Tabs.Panel>
          </Tabs>

          {/* Enhanced Patient Details Modal */}
          <PatientDetails
            opened={viewModalOpened}
            onClose={closeView}
            patient={selectedPatient}
            visits={[]}
            documents={[]}
            medicalHistory={[]}
            appointments={[]}
            onEdit={handleEditPatientForModal}
            onScheduleAppointment={handleScheduleAppointment}
          />

          {/* Enhanced Patient Form Modal */}
          <PatientForm
            opened={opened}
            onClose={close}
            patient={selectedPatient}
            onSubmit={selectedPatient ? handleUpdatePatient : handleCreatePatient}
          />

          {/* Medical History Manager */}
          {selectedPatient && (
            <MedicalHistoryManager
              opened={historyModalOpened}
              onClose={closeHistory}
              patientId={selectedPatient.patientId}
              patientName={`${selectedPatient.firstName} ${selectedPatient.lastName}`}
              medicalHistory={[]}
              onSave={handleSaveMedicalHistory}
              onUpdate={handleUpdateMedicalHistory}
              onDelete={handleDeleteMedicalHistory}
            />
          )}

          {/* Document Manager */}
          {selectedPatient && (
            <DocumentManager
              opened={documentsModalOpened}
              onClose={closeDocuments}
              patientId={selectedPatient.patientId}
              patientName={`${selectedPatient.firstName} ${selectedPatient.lastName}`}
              documents={[]}
              onUpload={handleUploadDocument}
              onUpdate={handleUpdateDocument}
              onDelete={handleDeleteDocument}
              onDownload={handleDownloadDocument}
              onView={handleViewDocument}
            />
          )}
        </Stack>
      </Container>
    </Layout>
  );
}

export default PatientsPage;
