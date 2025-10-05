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
  DatePicker,
  Timeline,
  Stepper,
  RingProgress,
  Tooltip,
  List,
  Image,
  Loader,
  Highlight,
  Accordion,
  FileButton
} from '@mantine/core';
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
  IconRadioactive,
  IconChartBar,
  IconPhone,
  IconMail,
  IconAlertCircle,
  IconCheck,
  IconX,
  IconDotsVertical,
  IconReportMedical,
  IconClock,
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
  IconAlertTriangle,
  IconCircleCheck,
  IconClipboard,
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
  IconTag,
  IconAlarm,
  IconInfoCircle,
  IconBed,
  IconAmbulance,
  IconSiren,
  IconFlask,
  IconDroplet,
  IconNurse,
  IconBandage,
  IconPill,
  IconSyringe,
  IconMask,
  IconBolt,
  IconZoom,
  IconCut,
  IconTool,
  IconPhoto,
  IconScan,
  IconDeviceDesktop,
  IconCamera,
  IconUpload,
  IconMicroscope,
  IconTarget,
  IconFocus,
  IconColorPicker,
  IconRuler,
  IconRotate,
  IconContrast,
  IconBrightness,
  IconAdjustments,
  IconMaximize,
  IconMinimize,
  IconPlayerPlay,
  IconPlayerPause,
  IconVolume,
  IconFileUpload,
  IconCloudUpload
} from '@tabler/icons-react';

// Import types and mock data
import {
  ImagingRequest,
  ImagingRequestStatus,
  ImagingType,
  Priority,
  RadiologyReport,
  ReportStatus,
  ImagingEquipment,
  EquipmentStatus,
  ImagingStudy,
  StudyStatus,
  RadiologyStats,
  RadiologyFilters,
  Radiologist
} from '../../../types/radiology';
import {
  mockImagingRequests,
  mockRadiologyReports,
  mockImagingEquipment,
  mockImagingStudies,
  mockRadiologyStats,
  mockRadiologists
} from '../../../lib/mockData/radiology';
import { mockPatients } from '../../../lib/mockData/patients';
import { mockStaff } from '../../../lib/mockData/staff';

const RadiologyManagement = () => {
  // State management
  const [activeTab, setActiveTab] = useState<string>('requests');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('');
  const [selectedEquipmentStatus, setSelectedEquipmentStatus] = useState<string>('');
  const [selectedRequest, setSelectedRequest] = useState<ImagingRequest | null>(null);
  const [selectedReport, setSelectedReport] = useState<RadiologyReport | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<ImagingEquipment | null>(null);
  const [selectedStudy, setSelectedStudy] = useState<ImagingStudy | null>(null);

  // Modal states
  const [requestDetailOpened, { open: openRequestDetail, close: closeRequestDetail }] = useDisclosure(false);
  const [addRequestOpened, { open: openAddRequest, close: closeAddRequest }] = useDisclosure(false);
  const [reportDetailOpened, { open: openReportDetail, close: closeReportDetail }] = useDisclosure(false);
  const [equipmentDetailOpened, { open: openEquipmentDetail, close: closeEquipmentDetail }] = useDisclosure(false);
  const [studyViewerOpened, { open: openStudyViewer, close: closeStudyViewer }] = useDisclosure(false);
  const [createReportOpened, { open: openCreateReport, close: closeCreateReport }] = useDisclosure(false);

  // Filter imaging requests
  const filteredRequests = useMemo(() => {
    return mockImagingRequests.filter((request) => {
      const matchesSearch = 
        request.patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.examType.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = !selectedType || request.imagingType === selectedType;
      const matchesStatus = !selectedStatus || request.status === selectedStatus;
      const matchesPriority = !selectedPriority || request.priority === selectedPriority;

      return matchesSearch && matchesType && matchesStatus && matchesPriority;
    });
  }, [searchQuery, selectedType, selectedStatus, selectedPriority]);

  // Filter equipment
  const filteredEquipment = useMemo(() => {
    return mockImagingEquipment.filter((equipment) => {
      const matchesSearch = 
        equipment.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        equipment.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        equipment.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = !selectedEquipmentStatus || equipment.status === selectedEquipmentStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedEquipmentStatus]);

  // Helper functions
  const getStatusColor = (status: ImagingRequestStatus | ReportStatus | EquipmentStatus | StudyStatus) => {
    switch (status) {
      case 'pending':
      case 'scheduled':
      case 'draft':
      case 'operational': return 'blue';
      case 'in_progress':
      case 'scanning':
      case 'reviewing':
      case 'in_use': return 'orange';
      case 'completed':
      case 'finalized':
      case 'available': return 'green';
      case 'cancelled':
      case 'rejected':
      case 'out_of_service': return 'red';
      case 'on_hold':
      case 'maintenance': return 'yellow';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'emergency': return 'red';
      case 'urgent': return 'orange';
      case 'routine': return 'blue';
      case 'elective': return 'green';
      default: return 'gray';
    }
  };

  const getImagingTypeColor = (type: ImagingType) => {
    switch (type) {
      case 'xray': return 'blue';
      case 'ct': return 'green';
      case 'mri': return 'purple';
      case 'ultrasound': return 'cyan';
      case 'mammography': return 'pink';
      case 'nuclear_medicine': return 'orange';
      case 'fluoroscopy': return 'indigo';
      case 'pet': return 'red';
      default: return 'gray';
    }
  };

  const handleViewRequest = (request: ImagingRequest) => {
    setSelectedRequest(request);
    openRequestDetail();
  };

  const handleViewReport = (report: RadiologyReport) => {
    setSelectedReport(report);
    openReportDetail();
  };

  const handleViewEquipment = (equipment: ImagingEquipment) => {
    setSelectedEquipment(equipment);
    openEquipmentDetail();
  };

  const handleViewStudy = (study: ImagingStudy) => {
    setSelectedStudy(study);
    openStudyViewer();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('');
    setSelectedStatus('');
    setSelectedPriority('');
    setSelectedEquipmentStatus('');
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
      title: 'Total Requests',
      value: mockRadiologyStats.totalRequests,
      icon: IconClipboardList,
      color: 'blue',
      trend: '+12.5%'
    },
    {
      title: 'Today\'s Scans',
      value: 24,
      icon: IconScan,
      color: 'green',
      trend: '+8'
    },
    {
      title: 'Pending Reports',
      value: mockRadiologyStats.pendingReports,
      icon: IconReportMedical,
      color: 'orange',
      trend: '-3'
    },
    {
      title: 'Equipment Active',
      value: `${mockRadiologyStats.activeEquipment}/${mockRadiologyStats.totalEquipment}`,
      icon: IconDeviceDesktop,
      color: 'purple',
      trend: '95% uptime'
    }
  ];

  // Chart data
  const imagingTypeData = Object.entries(mockRadiologyStats.requestsByType)
    .map(([type, count]) => ({
      name: type.replace('_', ' ').toUpperCase(),
      value: count,
      color: getImagingTypeColor(type as ImagingType)
    }));

  const monthlyVolume = mockRadiologyStats.monthlyVolume;
  const equipmentUtilization = mockRadiologyStats.equipmentUtilization;
  const turnaroundTimes = mockRadiologyStats.turnaroundTimes;

  return (
    <Container size="xl" py="md">
      {/* Header */}
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={1}>Radiology & Imaging</Title>
          <Text c="dimmed" size="sm">
            Manage imaging requests, radiology reports, and imaging equipment
          </Text>
        </div>
        <Group>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={openAddRequest}
            color="blue"
          >
            New Request
          </Button>
          <Button
            variant="light"
            leftSection={<IconRadioactive size={16} />}
            color="red"
          >
            Emergency Scan
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
          <Tabs.Tab value="requests" leftSection={<IconClipboardList size={16} />}>
            Imaging Requests
          </Tabs.Tab>
          <Tabs.Tab value="reports" leftSection={<IconReportMedical size={16} />}>
            Radiology Reports
          </Tabs.Tab>
          <Tabs.Tab value="studies" leftSection={<IconPhoto size={16} />}>
            Image Studies
          </Tabs.Tab>
          <Tabs.Tab value="equipment" leftSection={<IconDeviceDesktop size={16} />}>
            Equipment
          </Tabs.Tab>
          <Tabs.Tab value="radiologists" leftSection={<IconUsers size={16} />}>
            Radiologists
          </Tabs.Tab>
          <Tabs.Tab value="analytics" leftSection={<IconChartBar size={16} />}>
            Analytics
          </Tabs.Tab>
        </Tabs.List>

        {/* Imaging Requests Tab */}
        <Tabs.Panel value="requests">
          <Paper p="md" radius="md" withBorder mt="md">
            {/* Search and Filters */}
            <Group mb="md">
              <TextInput
                placeholder="Search requests..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                style={{ flex: 1 }}
              />
              <Select
                placeholder="Imaging Type"
                data={[
                  { value: 'xray', label: 'X-Ray' },
                  { value: 'ct', label: 'CT Scan' },
                  { value: 'mri', label: 'MRI' },
                  { value: 'ultrasound', label: 'Ultrasound' },
                  { value: 'mammography', label: 'Mammography' },
                  { value: 'nuclear_medicine', label: 'Nuclear Medicine' },
                  { value: 'fluoroscopy', label: 'Fluoroscopy' },
                  { value: 'pet', label: 'PET Scan' }
                ]}
                value={selectedType}
                onChange={setSelectedType}
                clearable
              />
              <Select
                placeholder="Status"
                data={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'scheduled', label: 'Scheduled' },
                  { value: 'in_progress', label: 'In Progress' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'cancelled', label: 'Cancelled' }
                ]}
                value={selectedStatus}
                onChange={setSelectedStatus}
                clearable
              />
              <Select
                placeholder="Priority"
                data={[
                  { value: 'emergency', label: 'Emergency' },
                  { value: 'urgent', label: 'Urgent' },
                  { value: 'routine', label: 'Routine' },
                  { value: 'elective', label: 'Elective' }
                ]}
                value={selectedPriority}
                onChange={setSelectedPriority}
                clearable
              />
              <Button variant="light" onClick={clearFilters}>
                Clear Filters
              </Button>
            </Group>

            {/* Requests Table */}
            <ScrollArea>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Request ID</Table.Th>
                    <Table.Th>Patient</Table.Th>
                    <Table.Th>Exam Type</Table.Th>
                    <Table.Th>Imaging Type</Table.Th>
                    <Table.Th>Ordered By</Table.Th>
                    <Table.Th>Scheduled Date</Table.Th>
                    <Table.Th>Priority</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredRequests.map((request) => (
                    <Table.Tr key={request.id}>
                      <Table.Td>
                        <Text fw={500}>{request.requestId}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Group>
                          <Avatar color="blue" radius="xl" size="sm">
                            {request.patient.firstName[0]}{request.patient.lastName[0]}
                          </Avatar>
                          <div>
                            <Text size="sm" fw={500}>
                              {request.patient.firstName} {request.patient.lastName}
                            </Text>
                            <Text size="xs" c="dimmed">
                              MRN: {request.patient.medicalRecordNumber}
                            </Text>
                          </div>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <div>
                          <Text size="sm" fw={500} lineClamp={1}>
                            {request.examType}
                          </Text>
                          {request.bodyPart && (
                            <Text size="xs" c="dimmed">{request.bodyPart}</Text>
                          )}
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getImagingTypeColor(request.imagingType)} variant="light">
                          {request.imagingType.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <div>
                          <Text size="sm" fw={500}>
                            Dr. {request.orderingPhysician.lastName}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {request.orderingPhysician.department?.name}
                          </Text>
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <div>
                          <Text size="sm" fw={500}>
                            {request.scheduledDate ? new Date(request.scheduledDate).toLocaleDateString() : 'Not scheduled'}
                          </Text>
                          {request.scheduledDate && (
                            <Text size="xs" c="dimmed">
                              {new Date(request.scheduledDate).toLocaleTimeString()}
                            </Text>
                          )}
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getPriorityColor(request.priority)} variant="light">
                          {request.priority.toUpperCase()}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getStatusColor(request.status)} variant="light">
                          {request.status.replace('_', ' ')}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => handleViewRequest(request)}
                          >
                            <IconEye size={16} />
                          </ActionIcon>
                          <ActionIcon variant="subtle" color="green">
                            <IconEdit size={16} />
                          </ActionIcon>
                          <Menu>
                            <Menu.Target>
                              <ActionIcon variant="subtle" color="gray">
                                <IconDotsVertical size={16} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item leftSection={<IconCalendar size={14} />}>
                                Schedule Exam
                              </Menu.Item>
                              <Menu.Item leftSection={<IconScan size={14} />}>
                                Start Scan
                              </Menu.Item>
                              <Menu.Item leftSection={<IconReportMedical size={14} />}>
                                Create Report
                              </Menu.Item>
                              <Menu.Divider />
                              <Menu.Item 
                                leftSection={<IconX size={14} />}
                                color="red"
                              >
                                Cancel Request
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

        {/* Radiology Reports Tab */}
        <Tabs.Panel value="reports">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Radiology Reports</Title>
              <Group>
                <Button leftSection={<IconPlus size={16} />} onClick={openCreateReport}>
                  Create Report
                </Button>
                <Button variant="light" leftSection={<IconDownload size={16} />}>
                  Export Reports
                </Button>
              </Group>
            </Group>

            {/* Reports Grid */}
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
              {mockRadiologyReports.map((report) => (
                <Card key={report.id} padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Text fw={600} size="lg">{report.reportId}</Text>
                      <Text size="sm" c="dimmed">{report.examType}</Text>
                    </div>
                    <Badge color={getStatusColor(report.status)} variant="light">
                      {report.status}
                    </Badge>
                  </Group>

                  <Stack gap="sm" mb="md">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Patient</Text>
                      <Text size="sm" fw={500}>
                        {report.patient.firstName} {report.patient.lastName}
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Radiologist</Text>
                      <Text size="sm" fw={500}>
                        Dr. {report.radiologist.lastName}
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Exam Date</Text>
                      <Text size="sm">
                        {new Date(report.examDate).toLocaleDateString()}
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Report Date</Text>
                      <Text size="sm">
                        {report.reportDate ? new Date(report.reportDate).toLocaleDateString() : 'Pending'}
                      </Text>
                    </Group>
                  </Stack>

                  {report.findings && (
                    <div>
                      <Text size="sm" fw={500} mb="xs">Findings</Text>
                      <Text size="sm" lineClamp={3}>
                        {report.findings}
                      </Text>
                    </div>
                  )}

                  <Group justify="space-between" mt="md">
                    <Text size="xs" c="dimmed">
                      Priority: {report.priority.toUpperCase()}
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

        {/* Image Studies Tab */}
        <Tabs.Panel value="studies">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Image Studies</Title>
              <Group>
                <Button leftSection={<IconUpload size={16} />}>
                  Upload Images
                </Button>
                <Button variant="light" leftSection={<IconPhoto size={16} />}>
                  Image Viewer
                </Button>
              </Group>
            </Group>

            {/* Studies Grid */}
            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
              {mockImagingStudies.map((study) => (
                <Card key={study.id} padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Text fw={600} size="lg">{study.studyId}</Text>
                      <Text size="sm" c="dimmed">{study.studyDescription}</Text>
                    </div>
                    <Badge color={getStatusColor(study.status)} variant="light">
                      {study.status}
                    </Badge>
                  </Group>

                  {/* Study Thumbnail */}
                  <div
                    style={{
                      height: '120px',
                      backgroundColor: '#f1f3f4',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem'
                    }}
                  >
                    <IconPhoto size={48} color="#868e96" />
                  </div>

                  <Stack gap="sm" mb="md">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Patient</Text>
                      <Text size="sm" fw={500}>
                        {study.patient.firstName} {study.patient.lastName}
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Study Date</Text>
                      <Text size="sm">
                        {new Date(study.studyDate).toLocaleDateString()}
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Modality</Text>
                      <Badge color={getImagingTypeColor(study.modality)} variant="light" size="sm">
                        {study.modality.toUpperCase()}
                      </Badge>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Images</Text>
                      <Text size="sm" fw={500}>{study.numberOfImages}</Text>
                    </Group>
                  </Stack>

                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">
                      Size: {(study.studySize / (1024 * 1024)).toFixed(1)} MB
                    </Text>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleViewStudy(study)}
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

        {/* Equipment Tab */}
        <Tabs.Panel value="equipment">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Imaging Equipment</Title>
              <Group>
                <Button leftSection={<IconPlus size={16} />}>
                  Add Equipment
                </Button>
                <Button variant="light" leftSection={<IconSettings size={16} />}>
                  Maintenance Schedule
                </Button>
              </Group>
            </Group>

            {/* Equipment Filters */}
            <Group mb="md">
              <TextInput
                placeholder="Search equipment..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                style={{ flex: 1 }}
              />
              <Select
                placeholder="Status"
                data={[
                  { value: 'operational', label: 'Operational' },
                  { value: 'maintenance', label: 'Maintenance' },
                  { value: 'in_use', label: 'In Use' },
                  { value: 'out_of_service', label: 'Out of Service' }
                ]}
                value={selectedEquipmentStatus}
                onChange={setSelectedEquipmentStatus}
                clearable
              />
            </Group>

            {/* Equipment Grid */}
            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
              {filteredEquipment.map((equipment) => (
                <Card key={equipment.id} padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Text fw={600} size="lg">{equipment.equipmentName}</Text>
                      <Text size="sm" c="dimmed">{equipment.manufacturer}</Text>
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
                      <Text size="sm" c="dimmed">Location</Text>
                      <Text size="sm">{equipment.location}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Installed</Text>
                      <Text size="sm">
                        {new Date(equipment.installationDate).toLocaleDateString()}
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Last Maintenance</Text>
                      <Text size="sm">
                        {new Date(equipment.lastMaintenanceDate).toLocaleDateString()}
                      </Text>
                    </Group>
                  </Stack>

                  {equipment.utilizationRate && (
                    <div>
                      <Group justify="space-between" mb="xs">
                        <Text size="sm" c="dimmed">Utilization</Text>
                        <Text size="sm" fw={500}>{equipment.utilizationRate}%</Text>
                      </Group>
                      <Progress 
                        value={equipment.utilizationRate} 
                        size="sm" 
                        color={equipment.utilizationRate > 80 ? 'red' : equipment.utilizationRate > 60 ? 'yellow' : 'green'}
                      />
                    </div>
                  )}

                  <Group justify="space-between" mt="md">
                    <Text size="xs" c="dimmed">
                      Type: {equipment.equipmentType}
                    </Text>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleViewEquipment(equipment)}
                      >
                        <IconEye size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="green">
                        <IconSettings size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="orange">
                        <IconTool size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>

        {/* Radiologists Tab */}
        <Tabs.Panel value="radiologists">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Radiologists</Title>
              <Button leftSection={<IconPlus size={16} />}>
                Add Radiologist
              </Button>
            </Group>

            {/* Radiologists Grid */}
            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
              {mockRadiologists.map((radiologist) => (
                <Card key={radiologist.id} padding="lg" radius="md" withBorder>
                  <Group mb="md">
                    <Avatar size="lg" color="blue" radius="xl">
                      {radiologist.firstName[0]}{radiologist.lastName[0]}
                    </Avatar>
                    <div>
                      <Text fw={600} size="lg">
                        Dr. {radiologist.firstName} {radiologist.lastName}
                      </Text>
                      <Text size="sm" c="dimmed">{radiologist.specialization}</Text>
                      <Badge 
                        color={radiologist.isAvailable ? 'green' : 'red'} 
                        variant="light" 
                        size="sm"
                      >
                        {radiologist.isAvailable ? 'Available' : 'Busy'}
                      </Badge>
                    </div>
                  </Group>

                  <Stack gap="sm" mb="md">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">License</Text>
                      <Text size="sm" fw={500}>{radiologist.licenseNumber}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Experience</Text>
                      <Text size="sm">{radiologist.yearsOfExperience} years</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Reports (Month)</Text>
                      <Text size="sm" fw={500}>{radiologist.reportsThisMonth}</Text>
                    </Group>
                  </Stack>

                  <div>
                    <Text size="sm" fw={500} mb="xs">Specialties</Text>
                    <Group gap="xs">
                      {radiologist.subspecialties.slice(0, 3).map((specialty) => (
                        <Badge key={specialty} size="xs" variant="light">
                          {specialty}
                        </Badge>
                      ))}
                      {radiologist.subspecialties.length > 3 && (
                        <Badge size="xs" variant="light" color="gray">
                          +{radiologist.subspecialties.length - 3}
                        </Badge>
                      )}
                    </Group>
                  </div>

                  <Group justify="space-between" mt="md">
                    <Text size="xs" c="dimmed">
                      Avg Turnaround: {radiologist.averageTurnaroundTime}h
                    </Text>
                    <Group gap="xs">
                      <ActionIcon variant="subtle" color="blue">
                        <IconEye size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="green">
                        <IconMail size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="orange">
                        <IconPhone size={16} />
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
          <Paper p="md" radius="md" withBorder mt="md">
            <Title order={3} mb="lg">Radiology Analytics</Title>
            
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
              {/* Imaging Types Distribution */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Requests by Imaging Type</Title>
                <DonutChart
                  data={imagingTypeData}
                  size={160}
                  thickness={30}
                  withLabels
                />
              </Card>
              
              {/* Monthly Volume */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Monthly Imaging Volume</Title>
                <AreaChart
                  h={200}
                  data={monthlyVolume}
                  dataKey="month"
                  series={[{ name: 'requests', color: 'blue.6' }]}
                  curveType="linear"
                />
              </Card>
              
              {/* Turnaround Times */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Average Turnaround Times</Title>
                <BarChart
                  h={200}
                  data={turnaroundTimes}
                  dataKey="type"
                  series={[
                    { name: 'hours', color: 'orange.6', label: 'Hours' }
                  ]}
                />
              </Card>
              
              {/* Equipment Utilization */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Equipment Utilization</Title>
                <BarChart
                  h={200}
                  data={equipmentUtilization}
                  dataKey="equipment"
                  series={[
                    { name: 'utilization', color: 'green.6', label: 'Utilization %' }
                  ]}
                />
              </Card>
              
              {/* Key Metrics */}
              <Card padding="lg" radius="md" withBorder style={{ gridColumn: '1 / -1' }}>
                <Title order={4} mb="md">Key Performance Indicators</Title>
                <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
                  <div style={{ textAlign: 'center' }}>
                    <RingProgress
                      size={120}
                      thickness={12}
                      sections={[{ value: mockRadiologyStats.reportCompletionRate, color: 'green' }]}
                      label={
                        <Text size="lg" fw={700} ta="center">
                          {mockRadiologyStats.reportCompletionRate}%
                        </Text>
                      }
                    />
                    <Text size="sm" c="dimmed" mt="xs">Report Completion Rate</Text>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <RingProgress
                      size={120}
                      thickness={12}
                      sections={[{ value: 100 - mockRadiologyStats.averageReportTime, color: 'blue' }]}
                      label={
                        <Text size="lg" fw={700} ta="center">
                          {mockRadiologyStats.averageReportTime}h
                        </Text>
                      }
                    />
                    <Text size="sm" c="dimmed" mt="xs">Avg Report Time</Text>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <RingProgress
                      size={120}
                      thickness={12}
                      sections={[{ value: mockRadiologyStats.equipmentUptime, color: 'orange' }]}
                      label={
                        <Text size="lg" fw={700} ta="center">
                          {mockRadiologyStats.equipmentUptime}%
                        </Text>
                      }
                    />
                    <Text size="sm" c="dimmed" mt="xs">Equipment Uptime</Text>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <RingProgress
                      size={120}
                      thickness={12}
                      sections={[{ value: mockRadiologyStats.patientSatisfaction, color: 'purple' }]}
                      label={
                        <Text size="lg" fw={700} ta="center">
                          {mockRadiologyStats.patientSatisfaction}%
                        </Text>
                      }
                    />
                    <Text size="sm" c="dimmed" mt="xs">Patient Satisfaction</Text>
                  </div>
                </SimpleGrid>
              </Card>
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>
      </Tabs>

      {/* Request Detail Modal */}
      <Modal
        opened={requestDetailOpened}
        onClose={closeRequestDetail}
        title="Imaging Request Details"
        size="xl"
      >
        {selectedRequest && (
          <ScrollArea h={600}>
            <Stack gap="md">
              <Group>
                <ThemeIcon color="blue" size="xl" variant="light">
                  <IconClipboardList size={24} />
                </ThemeIcon>
                <div>
                  <Title order={3}>{selectedRequest.examType}</Title>
                  <Text c="dimmed">Request ID: {selectedRequest.requestId}</Text>
                  <Badge color={getStatusColor(selectedRequest.status)} variant="light" mt="xs">
                    {selectedRequest.status.replace('_', ' ')}
                  </Badge>
                </div>
              </Group>

              <Divider />

              <SimpleGrid cols={2}>
                <div>
                  <Text size="sm" fw={500}>Patient</Text>
                  <Text size="sm" c="dimmed">
                    {selectedRequest.patient.firstName} {selectedRequest.patient.lastName}
                  </Text>
                </div>
                <div>
                  <Text size="sm" fw={500}>Medical Record Number</Text>
                  <Text size="sm" c="dimmed">{selectedRequest.patient.medicalRecordNumber}</Text>
                </div>
                <div>
                  <Text size="sm" fw={500}>Imaging Type</Text>
                  <Badge color={getImagingTypeColor(selectedRequest.imagingType)} variant="light">
                    {selectedRequest.imagingType.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <Text size="sm" fw={500}>Body Part</Text>
                  <Text size="sm" c="dimmed">{selectedRequest.bodyPart || 'N/A'}</Text>
                </div>
                <div>
                  <Text size="sm" fw={500}>Ordering Physician</Text>
                  <Text size="sm" c="dimmed">
                    Dr. {selectedRequest.orderingPhysician.firstName} {selectedRequest.orderingPhysician.lastName}
                  </Text>
                </div>
                <div>
                  <Text size="sm" fw={500}>Priority</Text>
                  <Badge color={getPriorityColor(selectedRequest.priority)} variant="light">
                    {selectedRequest.priority.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <Text size="sm" fw={500}>Request Date</Text>
                  <Text size="sm" c="dimmed">
                    {new Date(selectedRequest.requestDate).toLocaleString()}
                  </Text>
                </div>
                <div>
                  <Text size="sm" fw={500}>Scheduled Date</Text>
                  <Text size="sm" c="dimmed">
                    {selectedRequest.scheduledDate ? 
                      new Date(selectedRequest.scheduledDate).toLocaleString() : 
                      'Not scheduled'
                    }
                  </Text>
                </div>
              </SimpleGrid>

              {selectedRequest.clinicalHistory && (
                <>
                  <Divider />
                  <div>
                    <Text size="sm" fw={500} mb="sm">Clinical History</Text>
                    <Text size="sm">{selectedRequest.clinicalHistory}</Text>
                  </div>
                </>
              )}

              {selectedRequest.specialInstructions && (
                <>
                  <Divider />
                  <div>
                    <Text size="sm" fw={500} mb="sm">Special Instructions</Text>
                    <Text size="sm">{selectedRequest.specialInstructions}</Text>
                  </div>
                </>
              )}

              <Group justify="flex-end">
                <Button variant="light" onClick={closeRequestDetail}>
                  Close
                </Button>
                <Button leftSection={<IconCalendar size={16} />}>
                  Schedule Exam
                </Button>
                <Button leftSection={<IconEdit size={16} />}>
                  Edit Request
                </Button>
              </Group>
            </Stack>
          </ScrollArea>
        )}
      </Modal>

      {/* Add Request Modal */}
      <Modal
        opened={addRequestOpened}
        onClose={closeAddRequest}
        title="New Imaging Request"
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
              label="Ordering Physician"
              placeholder="Select physician"
              data={mockStaff.filter(staff => staff.role === 'Doctor').map(doctor => ({ 
                value: doctor.staffId, 
                label: `Dr. ${doctor.firstName} ${doctor.lastName}` 
              }))}
              required
            />
          </SimpleGrid>
          
          <TextInput
            label="Exam Type"
            placeholder="Enter exam type"
            required
          />
          
          <SimpleGrid cols={2}>
            <Select
              label="Imaging Type"
              placeholder="Select imaging type"
              data={[
                { value: 'xray', label: 'X-Ray' },
                { value: 'ct', label: 'CT Scan' },
                { value: 'mri', label: 'MRI' },
                { value: 'ultrasound', label: 'Ultrasound' },
                { value: 'mammography', label: 'Mammography' },
                { value: 'nuclear_medicine', label: 'Nuclear Medicine' },
                { value: 'fluoroscopy', label: 'Fluoroscopy' },
                { value: 'pet', label: 'PET Scan' }
              ]}
              required
            />
            <Select
              label="Priority"
              placeholder="Select priority"
              data={[
                { value: 'emergency', label: 'Emergency' },
                { value: 'urgent', label: 'Urgent' },
                { value: 'routine', label: 'Routine' },
                { value: 'elective', label: 'Elective' }
              ]}
              required
            />
          </SimpleGrid>
          
          <TextInput
            label="Body Part"
            placeholder="Enter body part to be imaged"
          />
          
          <Textarea
            label="Clinical History"
            placeholder="Enter clinical history"
            rows={3}
            required
          />
          
          <Textarea
            label="Special Instructions"
            placeholder="Enter any special instructions"
            rows={2}
          />
          
          <Group justify="flex-end">
            <Button variant="light" onClick={closeAddRequest}>
              Cancel
            </Button>
            <Button onClick={() => {
              notifications.show({
                title: 'Request Created',
                message: 'Imaging request has been successfully created',
                color: 'green',
              });
              closeAddRequest();
            }}>
              Create Request
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Study Viewer Modal */}
      <Modal
        opened={studyViewerOpened}
        onClose={closeStudyViewer}
        title="Image Study Viewer"
        size="xl"
        fullScreen
      >
        {selectedStudy && (
          <div style={{ height: 'calc(100vh - 120px)' }}>
            <Group justify="space-between" mb="md">
              <div>
                <Text fw={600} size="lg">{selectedStudy.studyId}</Text>
                <Text size="sm" c="dimmed">
                  {selectedStudy.patient.firstName} {selectedStudy.patient.lastName} - {selectedStudy.studyDescription}
                </Text>
              </div>
              <Group>
                <Button variant="light" leftSection={<IconZoom size={16} />}>
                  Zoom
                </Button>
                <Button variant="light" leftSection={<IconAdjustments size={16} />}>
                  Adjust
                </Button>
                <Button variant="light" leftSection={<IconRuler size={16} />}>
                  Measure
                </Button>
                <Button variant="light" leftSection={<IconDownload size={16} />}>
                  Download
                </Button>
              </Group>
            </Group>
            
            <div
              style={{
                height: 'calc(100% - 60px)',
                backgroundColor: '#1a1b1e',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              <div style={{ textAlign: 'center', color: '#868e96' }}>
                <IconPhoto size={120} />
                <Text size="lg" mt="md">Medical Image Viewer</Text>
                <Text size="sm" c="dimmed">
                  {selectedStudy.numberOfImages} images available
                </Text>
              </div>
              
              {/* Image viewer controls */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: '10px'
                }}
              >
                <ActionIcon color="white" variant="filled">
                  <IconPlayerPlay size={16} />
                </ActionIcon>
                <ActionIcon color="white" variant="filled">
                  <IconPlayerPause size={16} />
                </ActionIcon>
                <ActionIcon color="white" variant="filled">
                  <IconRotate size={16} />
                </ActionIcon>
                <ActionIcon color="white" variant="filled">
                  <IconContrast size={16} />
                </ActionIcon>
                <ActionIcon color="white" variant="filled">
                  <IconBrightness size={16} />
                </ActionIcon>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Container>
  );
};

export default RadiologyManagement;