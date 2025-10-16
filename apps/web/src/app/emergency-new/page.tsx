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
  Title,
  Card,
  TextInput,
  Select,
  LoadingOverlay,
  Alert,
  Tabs,
  ActionIcon,
  Menu,
  Avatar,
  Progress
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconPlus,
  IconSearch,
  IconAlertTriangle,
  IconClock,
  IconActivity,
  IconEdit,
  IconEye,
  IconDotsVertical,
  IconAlertCircle,
  IconUrgent,
  IconStethoscope,
  IconAmbulance
} from '@tabler/icons-react';
import Layout from '../../components/shared/Layout';
import DataTable from '../../components/shared/DataTable';
import EmergencyCaseForm from '../../components/emergency/EmergencyCaseForm';
import TriageForm from '../../components/emergency/TriageForm';
import EmergencyCaseDetails from '../../components/emergency/EmergencyCaseDetails';
import { useAppStore } from '../../stores/appStore';
import { User, UserRole, TableColumn } from '../../types/common';
import emergencyService from '../../services/emergency.service';
import patientsService from '../../services/patients.service';
import type { CreateEmergencyCaseDto, UpdateEmergencyCaseDto, UpdateTriageDto, EmergencyFilters } from '../../services/emergency.service';

const mockUser: User = {
  id: '1',
  username: 'admin',
  email: 'admin@hospital.com',
  firstName: 'Admin',
  lastName: 'User',
  role: UserRole.ADMIN,
  permissions: [],
  isActive: true,
  tenantInfo: {
    tenantId: 'T001',
    tenantName: 'Main Hospital',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

function EmergencyPage() {
  const { user, setUser } = useAppStore();
  const [activeTab, setActiveTab] = useState('cases');
  const [cases, setCases] = useState<any[]>([]);
  const [queue, setQueue] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [triageFilter, setTriageFilter] = useState('');

  const [caseFormOpened, { open: openCaseForm, close: closeCaseForm }] = useDisclosure(false);
  const [triageFormOpened, { open: openTriageForm, close: closeTriageForm }] = useDisclosure(false);
  const [detailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false);

  useEffect(() => {
    if (!user) {
      setUser(mockUser);
    }
    fetchCases();
    fetchQueue();
    fetchStats();
    fetchPatients();
    fetchDoctors();
  }, [user, setUser]);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const filters: EmergencyFilters = {};
      if (searchQuery) filters.search = searchQuery;
      if (statusFilter) filters.status = statusFilter;
      if (triageFilter) filters.triageLevel = triageFilter;

      const response = await emergencyService.getCases(filters);
      if (response.success && response.data) {
        setCases(response.data.items || []);
      }
    } catch (error: any) {
      console.error('Error fetching cases:', error);
      notifications.show({
        title: 'Error',
        message: error?.message || 'Failed to fetch emergency cases',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchQueue = async () => {
    try {
      const response = await emergencyService.getQueue();
      if (response.success && response.data) {
        setQueue(response.data || []);
      }
    } catch (error: any) {
      console.error('Error fetching queue:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await emergencyService.getStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await patientsService.getPatients();
      if (response.success && response.data) {
        setPatients(response.data.patients || []);
      }
    } catch (error: any) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      // Mock doctors - in production, fetch from staff API
      setDoctors([
        { id: '1', firstName: 'John', lastName: 'Smith', specialization: 'Emergency Medicine' },
        { id: '2', firstName: 'Sarah', lastName: 'Johnson', specialization: 'Trauma Surgery' },
      ]);
    } catch (error: any) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleCreateCase = async (data: CreateEmergencyCaseDto) => {
    try {
      const response = await emergencyService.createCase(data);
      if (response.success) {
        notifications.show({
          title: 'Success',
          message: 'Emergency case registered successfully',
          color: 'green',
        });
        fetchCases();
        fetchQueue();
        fetchStats();
        closeCaseForm();
      }
    } catch (error: any) {
      console.error('Error creating case:', error);
      notifications.show({
        title: 'Error',
        message: error?.message || 'Failed to register emergency case',
        color: 'red',
      });
      throw error;
    }
  };

  const handleUpdateCase = async (data: UpdateEmergencyCaseDto) => {
    if (!selectedCase) return;

    try {
      const response = await emergencyService.updateCase(selectedCase.id, data);
      if (response.success) {
        notifications.show({
          title: 'Success',
          message: 'Emergency case updated successfully',
          color: 'green',
        });
        fetchCases();
        fetchQueue();
        fetchStats();
        closeCaseForm();
        setSelectedCase(null);
      }
    } catch (error: any) {
      console.error('Error updating case:', error);
      notifications.show({
        title: 'Error',
        message: error?.message || 'Failed to update emergency case',
        color: 'red',
      });
      throw error;
    }
  };

  const handleUpdateTriage = async (data: UpdateTriageDto) => {
    if (!selectedCase) return;

    try {
      const response = await emergencyService.updateTriage(selectedCase.id, data);
      if (response.success) {
        notifications.show({
          title: 'Success',
          message: 'Triage level updated successfully',
          color: 'green',
        });
        fetchCases();
        fetchQueue();
        fetchStats();
        closeTriageForm();
        setSelectedCase(null);
      }
    } catch (error: any) {
      console.error('Error updating triage:', error);
      notifications.show({
        title: 'Error',
        message: error?.message || 'Failed to update triage level',
        color: 'red',
      });
      throw error;
    }
  };

  const handleViewCase = (emergencyCase: any) => {
    setSelectedCase(emergencyCase);
    openDetails();
  };

  const handleEditCase = (emergencyCase: any) => {
    setSelectedCase(emergencyCase);
    openCaseForm();
  };

  const handleUpdateTriageClick = (emergencyCase: any) => {
    setSelectedCase(emergencyCase);
    openTriageForm();
  };

  const handleNewCase = () => {
    setSelectedCase(null);
    openCaseForm();
  };

  const getTriageColor = (level: string) => {
    const colors: Record<string, string> = {
      CRITICAL: 'red',
      URGENT: 'orange',
      SEMI_URGENT: 'yellow',
      NON_URGENT: 'green'
    };
    return colors[level] || 'gray';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      WAITING: 'blue',
      IN_TREATMENT: 'yellow',
      DISCHARGED: 'green',
      ADMITTED: 'cyan',
      TRANSFERRED: 'grape'
    };
    return colors[status] || 'gray';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const calculateWaitTime = (arrivalTime: string) => {
    const arrival = new Date(arrivalTime);
    const now = new Date();
    const diff = now.getTime() - arrival.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const caseColumns: TableColumn[] = [
    {
      key: 'triageLevel',
      label: 'Triage',
      sortable: true,
      render: (emergencyCase: any) => (
        <Badge color={getTriageColor(emergencyCase.triageLevel)} size="lg">
          {emergencyCase.triageLevel}
        </Badge>
      )
    },
    {
      key: 'patient',
      label: 'Patient',
      sortable: true,
      render: (emergencyCase: any) => (
        <Group gap="xs">
          <Avatar size="sm" radius="xl" color="blue">
            {emergencyCase.patient?.firstName?.[0]}{emergencyCase.patient?.lastName?.[0]}
          </Avatar>
          <div>
            <Text fw={500} size="sm">
              {emergencyCase.patient?.firstName} {emergencyCase.patient?.lastName}
            </Text>
            <Text size="xs" c="dimmed">
              {emergencyCase.patient?.medicalRecordNumber || emergencyCase.patient?.id}
            </Text>
          </div>
        </Group>
      )
    },
    {
      key: 'chiefComplaint',
      label: 'Chief Complaint',
      render: (emergencyCase: any) => (
        <Text lineClamp={2}>{emergencyCase.chiefComplaint}</Text>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (emergencyCase: any) => (
        <Badge color={getStatusColor(emergencyCase.status)}>
          {emergencyCase.status}
        </Badge>
      )
    },
    {
      key: 'arrivalTime',
      label: 'Arrival',
      sortable: true,
      render: (emergencyCase: any) => (
        <div>
          <Text size="sm">{formatDate(emergencyCase.arrivalTime)}</Text>
          <Text size="xs" c="dimmed">
            Wait: {calculateWaitTime(emergencyCase.arrivalTime)}
          </Text>
        </div>
      )
    },
    {
      key: 'assignedDoctor',
      label: 'Doctor',
      render: (emergencyCase: any) => (
        emergencyCase.assignedDoctor ? (
          <Text size="sm">
            Dr. {emergencyCase.assignedDoctor.firstName} {emergencyCase.assignedDoctor.lastName}
          </Text>
        ) : (
          <Text size="sm" c="dimmed">Not assigned</Text>
        )
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (emergencyCase: any) => (
        <Group gap="xs">
          <ActionIcon
            variant="subtle"
            onClick={() => handleViewCase(emergencyCase)}
          >
            <IconEye size={16} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            onClick={() => handleEditCase(emergencyCase)}
          >
            <IconEdit size={16} />
          </ActionIcon>
          <Menu position="bottom-end">
            <Menu.Target>
              <ActionIcon variant="subtle">
                <IconDotsVertical size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconEye size={14} />}
                onClick={() => handleViewCase(emergencyCase)}
              >
                View Details
              </Menu.Item>
              <Menu.Item
                leftSection={<IconEdit size={14} />}
                onClick={() => handleEditCase(emergencyCase)}
              >
                Edit Case
              </Menu.Item>
              <Menu.Item
                leftSection={<IconAlertTriangle size={14} />}
                onClick={() => handleUpdateTriageClick(emergencyCase)}
              >
                Update Triage
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      )
    }
  ];

  return (
    <Layout user={user || mockUser} notifications={0} onLogout={() => {}}>
      <Container size="xl" py="xl">
        <Stack gap="lg">
          {/* Header */}
          <Group justify="space-between">
            <div>
              <Title order={2}>Emergency Department</Title>
              <Text c="dimmed" size="sm">
                Manage emergency cases and triage
              </Text>
            </div>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={handleNewCase}
              color="red"
            >
              Register Emergency Case
            </Button>
          </Group>

          {/* Statistics Cards */}
          {stats && (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
              <Card withBorder padding="lg">
                <Group justify="space-between">
                  <div>
                    <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                      Critical Cases
                    </Text>
                    <Text fw={700} size="xl" c="red">
                      {stats.criticalCases}
                    </Text>
                  </div>
                  <IconUrgent size={32} color="#fa5252" />
                </Group>
              </Card>

              <Card withBorder padding="lg">
                <Group justify="space-between">
                  <div>
                    <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                      Waiting
                    </Text>
                    <Text fw={700} size="xl">
                      {stats.waiting}
                    </Text>
                  </div>
                  <IconClock size={32} color="#228be6" />
                </Group>
              </Card>

              <Card withBorder padding="lg">
                <Group justify="space-between">
                  <div>
                    <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                      In Treatment
                    </Text>
                    <Text fw={700} size="xl">
                      {stats.inTreatment}
                    </Text>
                  </div>
                  <IconStethoscope size={32} color="#fab005" />
                </Group>
              </Card>

              <Card withBorder padding="lg">
                <Group justify="space-between">
                  <div>
                    <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                      Total Cases
                    </Text>
                    <Text fw={700} size="xl">
                      {stats.total}
                    </Text>
                  </div>
                  <IconAmbulance size={32} color="#40c057" />
                </Group>
              </Card>
            </SimpleGrid>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'cases')}>
            <Tabs.List>
              <Tabs.Tab value="cases" leftSection={<IconActivity size={16} />}>
                All Cases
              </Tabs.Tab>
              <Tabs.Tab value="queue" leftSection={<IconClock size={16} />}>
                Emergency Queue
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="cases" pt="md">
              {/* Filters */}
              <Paper withBorder p="md" mb="md">
                <Grid>
                  <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    <TextInput
                      placeholder="Search cases..."
                      leftSection={<IconSearch size={16} />}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    <Select
                      placeholder="Filter by status"
                      data={[
                        { value: '', label: 'All Statuses' },
                        { value: 'WAITING', label: 'Waiting' },
                        { value: 'IN_TREATMENT', label: 'In Treatment' },
                        { value: 'DISCHARGED', label: 'Discharged' },
                        { value: 'ADMITTED', label: 'Admitted' }
                      ]}
                      value={statusFilter}
                      onChange={(value) => setStatusFilter(value || '')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    <Select
                      placeholder="Filter by triage"
                      data={[
                        { value: '', label: 'All Levels' },
                        { value: 'CRITICAL', label: 'Critical' },
                        { value: 'URGENT', label: 'Urgent' },
                        { value: 'SEMI_URGENT', label: 'Semi-Urgent' },
                        { value: 'NON_URGENT', label: 'Non-Urgent' }
                      ]}
                      value={triageFilter}
                      onChange={(value) => setTriageFilter(value || '')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    <Button fullWidth onClick={fetchCases}>
                      Apply Filters
                    </Button>
                  </Grid.Col>
                </Grid>
              </Paper>

              {/* Cases Table */}
              <Paper withBorder>
                <LoadingOverlay visible={loading} />
                {cases.length === 0 && !loading ? (
                  <Alert icon={<IconAlertCircle size={16} />} title="No cases found" color="blue">
                    No emergency cases match your current filters.
                  </Alert>
                ) : (
                  <DataTable
                    columns={caseColumns}
                    data={cases}
                    loading={loading}
                  />
                )}
              </Paper>
            </Tabs.Panel>

            <Tabs.Panel value="queue" pt="md">
              {/* Emergency Queue */}
              <Stack gap="md">
                {queue.length === 0 ? (
                  <Alert icon={<IconAlertCircle size={16} />} title="Queue is empty" color="green">
                    No patients currently waiting in the emergency queue.
                  </Alert>
                ) : (
                  queue.map((emergencyCase) => (
                    <Card key={emergencyCase.id} withBorder padding="md">
                      <Group justify="space-between" wrap="nowrap">
                        <Group>
                          <Badge color={getTriageColor(emergencyCase.triageLevel)} size="xl">
                            {emergencyCase.triageLevel}
                          </Badge>
                          <div>
                            <Text fw={600}>
                              {emergencyCase.patient?.firstName} {emergencyCase.patient?.lastName}
                            </Text>
                            <Text size="sm" c="dimmed">
                              {emergencyCase.chiefComplaint}
                            </Text>
                            <Text size="xs" c="dimmed">
                              Waiting: {calculateWaitTime(emergencyCase.arrivalTime)}
                            </Text>
                          </div>
                        </Group>
                        <Group>
                          <Badge color={getStatusColor(emergencyCase.status)}>
                            {emergencyCase.status}
                          </Badge>
                          <Button
                            size="xs"
                            onClick={() => handleViewCase(emergencyCase)}
                          >
                            View
                          </Button>
                        </Group>
                      </Group>
                    </Card>
                  ))
                )}
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Container>

      {/* Emergency Case Form Modal */}
      <EmergencyCaseForm
        opened={caseFormOpened}
        onClose={closeCaseForm}
        emergencyCase={selectedCase}
        onSubmit={selectedCase ? handleUpdateCase : handleCreateCase}
        patients={patients}
        doctors={doctors}
      />

      {/* Triage Form Modal */}
      {selectedCase && (
        <TriageForm
          opened={triageFormOpened}
          onClose={closeTriageForm}
          emergencyCase={selectedCase}
          onSubmit={handleUpdateTriage}
        />
      )}

      {/* Emergency Case Details Modal */}
      {selectedCase && (
        <EmergencyCaseDetails
          opened={detailsOpened}
          onClose={closeDetails}
          emergencyCase={selectedCase}
          onEdit={handleEditCase}
          onUpdateTriage={handleUpdateTriageClick}
        />
      )}
    </Layout>
  );
}

export default EmergencyPage;
