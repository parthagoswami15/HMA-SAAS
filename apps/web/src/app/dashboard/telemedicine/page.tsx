'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  MultiSelect,
  Anchor,
  Notification,
  Indicator,
  UnstyledButton,
  rem,
  Slider,
  Center,
  Box
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { Calendar, DatePickerInput } from '@mantine/dates';
import { AreaChart, BarChart, DonutChart, LineChart } from '@mantine/charts';
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconEye,
  IconTrash,
  IconCalendar,
  IconUsers,
  IconUser,
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
  IconCloudUpload,
  IconMessage,
  IconMessageCircle,
  IconSend,
  IconBell,
  IconBellRinging,
  IconVideo,
  IconVideoOff,
  IconMicrophone,
  IconMicrophoneOff,
  IconDeviceMobile,
  IconDeviceTablet,
  IconDeviceLaptop,
  IconWifi,
  IconWifiOff,
  IconShield,
  IconLock,
  IconKey,
  IconFingerprint,
  IconSecurity,
  IconHistory,
  IconArchive,
  IconFolder,
  IconFolderOpen,
  IconFiles,
  IconFile,
  IconScreenShare,
  IconScreenShareOff,
  IconPhoneCall,
  IconPhoneOff,
  IconRecord,
  IconRecordOff,
  IconFullscreen,
  IconFullscreenOff,
  IconVolume2,
  IconVolumeOff,
  IconCalendarEvent,
  IconClockHour9,
  IconUserCheck,
  IconUserPlus,
  IconUserX,
  IconClipboardData,
  IconReportAnalytics,
  IconChartDots,
  IconChartLine,
  IconChartPie,
  IconDatabase,
  IconCloud,
  IconCloudCheck,
  IconCloudDownload,
  IconCloudUp,
  IconDeviceWatch,
  IconActivity2,
  IconHeartRateMonitor,
  IconThermometer,
  IconScale,
  IconDroplets,
  IconBrandZoom,
  IconMapPin,
  IconHome,
  IconBuilding,
  IconStethoscopeOff,
  IconFirstAid,
  IconEmergencyBed,
  IconHeartHandshake,
  IconMoodHappy,
  IconMoodSad,
  IconPrescription,
  IconReport2,
  IconReportSearch,
  IconTestPipe2,
  IconVaccine,
  IconWheelchair,
  IconZodiacCancer,
  IconAccessible,
  IconMedicalCrossOff,
  IconDeviceHeartMonitor
} from '@tabler/icons-react';

// Import types and mock data
import {
  TelemedicineSession,
  SessionStatus,
  SessionType,
  RemoteMonitoringData,
  VitalSigns,
  DigitalPrescription,
  TelemedicineStats,
  PatientMonitoring,
  VirtualConsultation,
  ConsultationStatus
} from '../../../types/telemedicine';
import {
  mockTelemedicineSessions,
  mockRemoteMonitoringData,
  mockDigitalPrescriptions,
  mockTelemedicineStats,
  mockPatientMonitoring,
  mockVirtualConsultations
} from '../../../lib/mockData/telemedicine';
import { mockDoctors } from '../../../lib/mockData/doctors';
import { mockPatients } from '../../../lib/mockData/patients';

const Telemedicine = () => {
  // State management
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSessionType, setSelectedSessionType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedSession, setSelectedSession] = useState<TelemedicineSession | null>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<DigitalPrescription | null>(null);
  const [selectedPatientMonitoring, setSelectedPatientMonitoring] = useState<PatientMonitoring | null>(null);
  const [isInCall, setIsInCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Modal states
  const [sessionDetailOpened, { open: openSessionDetail, close: closeSessionDetail }] = useDisclosure(false);
  const [startSessionOpened, { open: openStartSession, close: closeStartSession }] = useDisclosure(false);
  const [prescriptionDetailOpened, { open: openPrescriptionDetail, close: closePrescriptionDetail }] = useDisclosure(false);
  const [monitoringDetailOpened, { open: openMonitoringDetail, close: closeMonitoringDetail }] = useDisclosure(false);
  const [createPrescriptionOpened, { open: openCreatePrescription, close: closeCreatePrescription }] = useDisclosure(false);
  const [videoCallOpened, { open: openVideoCall, close: closeVideoCall }] = useDisclosure(false);

  // Timer effect for call duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInCall) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInCall]);

  // Filter sessions
  const filteredSessions = useMemo(() => {
    return mockTelemedicineSessions.filter((session) => {
      const matchesSearch = 
        session.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.sessionId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = !selectedSessionType || session.type === selectedSessionType;
      const matchesStatus = !selectedStatus || session.status === selectedStatus;
      const matchesDoctor = !selectedDoctor || session.doctorId === selectedDoctor;

      return matchesSearch && matchesType && matchesStatus && matchesDoctor;
    });
  }, [searchQuery, selectedSessionType, selectedStatus, selectedDoctor]);

  // Helper functions
  const getStatusColor = (status: SessionStatus | ConsultationStatus) => {
    switch (status) {
      case 'scheduled': return 'blue';
      case 'in_progress':
      case 'active': return 'green';
      case 'completed': return 'teal';
      case 'cancelled': return 'red';
      case 'no_show': return 'gray';
      case 'waiting': return 'orange';
      default: return 'gray';
    }
  };

  const getSessionTypeColor = (type: SessionType) => {
    switch (type) {
      case 'consultation': return 'blue';
      case 'follow_up': return 'green';
      case 'emergency': return 'red';
      case 'therapy': return 'purple';
      case 'monitoring': return 'orange';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'red';
      case 'high': return 'orange';
      case 'normal': return 'blue';
      case 'low': return 'gray';
      default: return 'gray';
    }
  };

  const handleViewSession = (session: TelemedicineSession) => {
    setSelectedSession(session);
    openSessionDetail();
  };

  const handleViewPrescription = (prescription: DigitalPrescription) => {
    setSelectedPrescription(prescription);
    openPrescriptionDetail();
  };

  const handleViewMonitoring = (monitoring: PatientMonitoring) => {
    setSelectedPatientMonitoring(monitoring);
    openMonitoringDetail();
  };

  const handleStartVideoCall = (session?: TelemedicineSession) => {
    setIsInCall(true);
    setCallDuration(0);
    openVideoCall();
    notifications.show({
      title: 'Call Started',
      message: 'Video consultation session has begun',
      color: 'green',
    });
  };

  const handleEndCall = () => {
    setIsInCall(false);
    setCallDuration(0);
    closeVideoCall();
    notifications.show({
      title: 'Call Ended',
      message: 'Video consultation session has ended',
      color: 'blue',
    });
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    notifications.show({
      title: isVideoEnabled ? 'Video Off' : 'Video On',
      message: `Camera has been turned ${isVideoEnabled ? 'off' : 'on'}`,
      color: 'blue',
    });
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    notifications.show({
      title: isAudioEnabled ? 'Audio Off' : 'Audio On',
      message: `Microphone has been turned ${isAudioEnabled ? 'off' : 'on'}`,
      color: 'blue',
    });
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    notifications.show({
      title: isScreenSharing ? 'Screen Share Stopped' : 'Screen Share Started',
      message: `Screen sharing has been ${isScreenSharing ? 'stopped' : 'started'}`,
      color: 'blue',
    });
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    notifications.show({
      title: isRecording ? 'Recording Stopped' : 'Recording Started',
      message: `Session recording has been ${isRecording ? 'stopped' : 'started'}`,
      color: isRecording ? 'red' : 'green',
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('en-IN');
  };

  // Quick stats for overview
  const quickStats = [
    {
      title: 'Active Sessions',
      value: mockTelemedicineStats.activeSessions,
      icon: IconVideo,
      color: 'green'
    },
    {
      title: 'Scheduled Sessions',
      value: mockTelemedicineStats.scheduledSessions,
      icon: IconCalendarEvent,
      color: 'blue'
    },
    {
      title: 'Monitored Patients',
      value: mockTelemedicineStats.monitoredPatients,
      icon: IconDeviceHeartMonitor,
      color: 'purple'
    },
    {
      title: 'Digital Prescriptions',
      value: mockTelemedicineStats.digitalPrescriptions,
      icon: IconPrescription,
      color: 'orange'
    }
  ];

  return (
    <Container size="xl" py="md">
      {/* Header */}
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={1}>Telemedicine & Virtual Care</Title>
          <Text c="dimmed" size="sm">
            Manage virtual consultations, remote monitoring, and digital healthcare delivery
          </Text>
        </div>
        <Group>
          <Button
            leftSection={<IconVideo size={16} />}
            onClick={() => handleStartVideoCall()}
            color="green"
          >
            Start Session
          </Button>
          <Button
            variant="light"
            leftSection={<IconCalendarEvent size={16} />}
            onClick={openStartSession}
          >
            Schedule Session
          </Button>
          <Button
            variant="light"
            leftSection={<IconPrescription size={16} />}
            onClick={openCreatePrescription}
          >
            Digital Prescription
          </Button>
        </Group>
      </Group>

      {/* Quick Stats */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="lg">
        {quickStats.map((stat) => {
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
          <Tabs.Tab value="sessions" leftSection={<IconVideo size={16} />}>
            Sessions
          </Tabs.Tab>
          <Tabs.Tab value="monitoring" leftSection={<IconDeviceHeartMonitor size={16} />}>
            Remote Monitoring
          </Tabs.Tab>
          <Tabs.Tab value="prescriptions" leftSection={<IconPrescription size={16} />}>
            Digital Prescriptions
          </Tabs.Tab>
          <Tabs.Tab value="consultations" leftSection={<IconStethoscope size={16} />}>
            Virtual Consultations
          </Tabs.Tab>
        </Tabs.List>

        {/* Overview Tab */}
        <Tabs.Panel value="overview">
          <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg" mt="md">
            {/* Session Analytics */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">Session Statistics</Title>
              <DonutChart
                data={[
                  { name: 'Completed', value: 45, color: 'green' },
                  { name: 'In Progress', value: 12, color: 'blue' },
                  { name: 'Scheduled', value: 28, color: 'orange' },
                  { name: 'Cancelled', value: 5, color: 'red' }
                ]}
                size={200}
                thickness={40}
                withLabels
              />
            </Card>

            {/* Active Monitoring Alerts */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">Monitoring Alerts</Title>
              <Stack gap="sm">
                <Alert variant="light" color="red" icon={<IconAlertTriangle size={16} />}>
                  <Text size="sm" fw={500}>High Blood Pressure Alert</Text>
                  <Text size="xs" c="dimmed">Patient: John Smith - 180/120 mmHg</Text>
                </Alert>
                <Alert variant="light" color="orange" icon={<IconHeart size={16} />}>
                  <Text size="sm" fw={500}>Irregular Heart Rate</Text>
                  <Text size="xs" c="dimmed">Patient: Sarah Johnson - 110 bpm</Text>
                </Alert>
                <Alert variant="light" color="yellow" icon={<IconThermometer size={16} />}>
                  <Text size="sm" fw={500}>Elevated Temperature</Text>
                  <Text size="xs" c="dimmed">Patient: Mike Wilson - 102.5°F</Text>
                </Alert>
              </Stack>
            </Card>

            {/* Today's Sessions */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">Today&apos;s Sessions</Title>
              <Stack gap="sm">
                {mockTelemedicineSessions.slice(0, 4).map((session) => (
                  <Card key={session.id} padding="sm" withBorder>
                    <Group justify="space-between">
                      <div>
                        <Text fw={500} size="sm">{session.patientName}</Text>
                        <Text size="xs" c="dimmed">Dr. {session.doctorName}</Text>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <Badge color={getStatusColor(session.status)} size="sm">
                          {session.status}
                        </Badge>
                        <Text size="xs" c="dimmed" mt="xs">
                          {session.scheduledTime}
                        </Text>
                      </div>
                    </Group>
                  </Card>
                ))}
              </Stack>
            </Card>

            {/* Equipment Status */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">System Status</Title>
              <Stack gap="sm">
                <Group justify="space-between">
                  <Group gap="xs">
                    <ThemeIcon color="green" size="sm" radius="xl">
                      <IconCheck size={12} />
                    </ThemeIcon>
                    <Text size="sm">Video Platform</Text>
                  </Group>
                  <Badge color="green" variant="light" size="sm">Online</Badge>
                </Group>
                <Group justify="space-between">
                  <Group gap="xs">
                    <ThemeIcon color="green" size="sm" radius="xl">
                      <IconCheck size={12} />
                    </ThemeIcon>
                    <Text size="sm">Monitoring Devices</Text>
                  </Group>
                  <Badge color="green" variant="light" size="sm">Connected</Badge>
                </Group>
                <Group justify="space-between">
                  <Group gap="xs">
                    <ThemeIcon color="orange" size="sm" radius="xl">
                      <IconAlertTriangle size={12} />
                    </ThemeIcon>
                    <Text size="sm">Network Quality</Text>
                  </Group>
                  <Badge color="orange" variant="light" size="sm">Fair</Badge>
                </Group>
                <Group justify="space-between">
                  <Group gap="xs">
                    <ThemeIcon color="green" size="sm" radius="xl">
                      <IconCheck size={12} />
                    </ThemeIcon>
                    <Text size="sm">Security</Text>
                  </Group>
                  <Badge color="green" variant="light" size="sm">Secure</Badge>
                </Group>
              </Stack>
            </Card>
          </SimpleGrid>
        </Tabs.Panel>

        {/* Sessions Tab */}
        <Tabs.Panel value="sessions">
          <Paper p="md" radius="md" withBorder mt="md">
            {/* Search and Filters */}
            <Group mb="md">
              <TextInput
                placeholder="Search sessions..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                style={{ flex: 1 }}
              />
              <Select
                placeholder="Type"
                data={[
                  { value: 'consultation', label: 'Consultation' },
                  { value: 'follow_up', label: 'Follow-up' },
                  { value: 'emergency', label: 'Emergency' },
                  { value: 'therapy', label: 'Therapy' },
                  { value: 'monitoring', label: 'Monitoring' }
                ]}
                value={selectedSessionType}
                onChange={setSelectedSessionType}
                clearable
              />
              <Select
                placeholder="Status"
                data={[
                  { value: 'scheduled', label: 'Scheduled' },
                  { value: 'in_progress', label: 'In Progress' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'cancelled', label: 'Cancelled' },
                  { value: 'no_show', label: 'No Show' },
                  { value: 'waiting', label: 'Waiting' }
                ]}
                value={selectedStatus}
                onChange={setSelectedStatus}
                clearable
              />
              <Select
                placeholder="Doctor"
                data={mockDoctors.map(doctor => ({
                  value: doctor.id,
                  label: `Dr. ${doctor.firstName} ${doctor.lastName}`
                }))}
                value={selectedDoctor}
                onChange={setSelectedDoctor}
                clearable
              />
            </Group>

            {/* Sessions Grid */}
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
              {filteredSessions.map((session) => (
                <Card key={session.id} padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Text fw={600} size="lg">{session.patientName}</Text>
                      <Text size="sm" c="dimmed">Dr. {session.doctorName}</Text>
                    </div>
                    <Badge color={getStatusColor(session.status)} variant="light">
                      {session.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </Group>

                  <Stack gap="sm" mb="md">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Session ID</Text>
                      <Text size="sm" fw={500}>{session.sessionId}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Type</Text>
                      <Badge color={getSessionTypeColor(session.type)} variant="light" size="sm">
                        {session.type}
                      </Badge>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Scheduled</Text>
                      <Text size="sm">{formatDateTime(session.scheduledDate)} at {session.scheduledTime}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Duration</Text>
                      <Text size="sm">{session.duration} minutes</Text>
                    </Group>
                    {session.actualDuration && (
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Actual Duration</Text>
                        <Text size="sm">{session.actualDuration} minutes</Text>
                      </Group>
                    )}
                  </Stack>

                  {session.notes && (
                    <Text size="sm" c="dimmed" lineClamp={2} mb="md">
                      Notes: {session.notes}
                    </Text>
                  )}

                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">
                      Platform: {session.platform}
                    </Text>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleViewSession(session)}
                      >
                        <IconEye size={16} />
                      </ActionIcon>
                      {session.status === 'scheduled' && (
                        <ActionIcon
                          variant="subtle"
                          color="green"
                          onClick={() => handleStartVideoCall(session)}
                        >
                          <IconVideo size={16} />
                        </ActionIcon>
                      )}
                      {session.status === 'in_progress' && (
                        <ActionIcon
                          variant="subtle"
                          color="orange"
                          onClick={() => openVideoCall()}
                        >
                          <IconBrandZoom size={16} />
                        </ActionIcon>
                      )}
                      <ActionIcon variant="subtle" color="teal">
                        <IconDownload size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>

        {/* Remote Monitoring Tab */}
        <Tabs.Panel value="monitoring">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Remote Patient Monitoring</Title>
              <Button leftSection={<IconPlus size={16} />} variant="light">
                Add Patient
              </Button>
            </Group>

            {/* Monitoring Grid */}
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
              {mockPatientMonitoring.map((monitoring) => (
                <Card key={monitoring.id} padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Group>
                        <Avatar color="blue" size="md">
                          {monitoring.patientName.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <div>
                          <Text fw={600} size="lg">{monitoring.patientName}</Text>
                          <Text size="sm" c="dimmed">ID: {monitoring.patientId}</Text>
                        </div>
                      </Group>
                    </div>
                    <Badge 
                      color={monitoring.isActive ? 'green' : 'gray'} 
                      variant={monitoring.isActive ? 'filled' : 'light'}
                    >
                      {monitoring.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </Badge>
                  </Group>

                  <Stack gap="sm" mb="md">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Device</Text>
                      <Group gap="xs">
                        <Text size="sm">{monitoring.deviceType}</Text>
                        <Badge 
                          color={monitoring.deviceStatus === 'connected' ? 'green' : 'red'} 
                          variant="light" 
                          size="xs"
                        >
                          {monitoring.deviceStatus}
                        </Badge>
                      </Group>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Last Reading</Text>
                      <Text size="sm">{formatDateTime(monitoring.lastReading)}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Monitoring Since</Text>
                      <Text size="sm">{formatDate(monitoring.startDate)}</Text>
                    </Group>
                  </Stack>

                  {/* Vital Signs */}
                  <Divider label="Current Vitals" labelPosition="center" mb="md" />
                  <SimpleGrid cols={2} spacing="sm" mb="md">
                    <div style={{ textAlign: 'center' }}>
                      <ThemeIcon color="red" variant="light" size="lg" mx="auto" mb="xs">
                        <IconHeart size={20} />
                      </ThemeIcon>
                      <Text size="lg" fw={600} c="red">
                        {monitoring.vitals.heartRate} bpm
                      </Text>
                      <Text size="xs" c="dimmed">Heart Rate</Text>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <ThemeIcon color="blue" variant="light" size="lg" mx="auto" mb="xs">
                        <IconActivity size={20} />
                      </ThemeIcon>
                      <Text size="lg" fw={600} c="blue">
                        {monitoring.vitals.bloodPressure}
                      </Text>
                      <Text size="xs" c="dimmed">Blood Pressure</Text>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <ThemeIcon color="orange" variant="light" size="lg" mx="auto" mb="xs">
                        <IconThermometer size={20} />
                      </ThemeIcon>
                      <Text size="lg" fw={600} c="orange">
                        {monitoring.vitals.temperature}°F
                      </Text>
                      <Text size="xs" c="dimmed">Temperature</Text>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <ThemeIcon color="cyan" variant="light" size="lg" mx="auto" mb="xs">
                        <IconLungs size={20} />
                      </ThemeIcon>
                      <Text size="lg" fw={600} c="cyan">
                        {monitoring.vitals.oxygenSaturation}%
                      </Text>
                      <Text size="xs" c="dimmed">O2 Saturation</Text>
                    </div>
                  </SimpleGrid>

                  {/* Alert Status */}
                  {monitoring.alerts && monitoring.alerts.length > 0 && (
                    <Alert variant="light" color="red" icon={<IconAlertTriangle size={16} />} mb="md">
                      <Text size="sm" fw={500}>Active Alerts: {monitoring.alerts.length}</Text>
                      <Text size="xs">Latest: {monitoring.alerts[0]}</Text>
                    </Alert>
                  )}

                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">
                      Battery: {monitoring.batteryLevel}%
                    </Text>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleViewMonitoring(monitoring)}
                      >
                        <IconEye size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="green">
                        <IconChartLine size={16} />
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

        {/* Digital Prescriptions Tab */}
        <Tabs.Panel value="prescriptions">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Digital Prescriptions</Title>
              <Group>
                <Button leftSection={<IconPlus size={16} />} onClick={openCreatePrescription}>
                  New Prescription
                </Button>
                <Button variant="light" leftSection={<IconDownload size={16} />}>
                  Export All
                </Button>
              </Group>
            </Group>

            {/* Prescriptions Grid */}
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
              {mockDigitalPrescriptions.map((prescription) => (
                <Card key={prescription.id} padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Text fw={600} size="lg">{prescription.patientName}</Text>
                      <Text size="sm" c="dimmed">ID: {prescription.prescriptionId}</Text>
                    </div>
                    <Badge 
                      color={
                        prescription.status === 'active' ? 'green' : 
                        prescription.status === 'pending' ? 'orange' : 
                        prescription.status === 'completed' ? 'blue' : 'red'
                      } 
                      variant="light"
                    >
                      {prescription.status.toUpperCase()}
                    </Badge>
                  </Group>

                  <Stack gap="sm" mb="md">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Prescribed by</Text>
                      <Text size="sm">Dr. {prescription.doctorName}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Date Issued</Text>
                      <Text size="sm">{formatDate(prescription.issuedDate)}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Valid Until</Text>
                      <Text size="sm" c={new Date(prescription.expiryDate) < new Date() ? 'red' : undefined}>
                        {formatDate(prescription.expiryDate)}
                      </Text>
                    </Group>
                  </Stack>

                  <Divider label="Medications" labelPosition="center" mb="md" />
                  
                  <Stack gap="xs" mb="md">
                    {prescription.medications.map((med, index) => (
                      <Card key={index} padding="xs" withBorder>
                        <Group justify="space-between">
                          <div>
                            <Text size="sm" fw={500}>{med.name}</Text>
                            <Text size="xs" c="dimmed">{med.dosage} - {med.frequency}</Text>
                          </div>
                          <Badge variant="light" size="xs">
                            {med.duration}
                          </Badge>
                        </Group>
                      </Card>
                    ))}
                  </Stack>

                  {prescription.pharmacyInfo && (
                    <Group justify="space-between" mb="md">
                      <Text size="sm" c="dimmed">Pharmacy</Text>
                      <Text size="sm">{prescription.pharmacyInfo}</Text>
                    </Group>
                  )}

                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">
                      Digital Signature: ✓ Verified
                    </Text>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleViewPrescription(prescription)}
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

        {/* Virtual Consultations Tab */}
        <Tabs.Panel value="consultations">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Virtual Consultations</Title>
              <Button leftSection={<IconCalendarEvent size={16} />} variant="light">
                Schedule Consultation
              </Button>
            </Group>

            {/* Consultations Grid */}
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
              {mockVirtualConsultations.map((consultation) => (
                <Card key={consultation.id} padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Group>
                        <Avatar color="teal" size="md">
                          {consultation.patientName.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <div>
                          <Text fw={600} size="lg">{consultation.patientName}</Text>
                          <Text size="sm" c="dimmed">with Dr. {consultation.doctorName}</Text>
                        </div>
                      </Group>
                    </div>
                    <Badge color={getStatusColor(consultation.status)} variant="light">
                      {consultation.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </Group>

                  <Stack gap="sm" mb="md">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Specialty</Text>
                      <Text size="sm">{consultation.specialty}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Appointment</Text>
                      <Text size="sm">{formatDateTime(consultation.appointmentDate)}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Duration</Text>
                      <Text size="sm">{consultation.estimatedDuration} minutes</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Consultation Fee</Text>
                      <Text size="sm" fw={500}>₹{consultation.consultationFee}</Text>
                    </Group>
                  </Stack>

                  {consultation.symptoms && (
                    <>
                      <Text size="sm" c="dimmed" mb="xs">Chief Complaints:</Text>
                      <Text size="sm" lineClamp={2} mb="md">
                        {consultation.symptoms}
                      </Text>
                    </>
                  )}

                  {consultation.followUpRequired && (
                    <Alert variant="light" color="blue" icon={<IconCalendarEvent size={16} />} mb="md">
                      <Text size="sm">Follow-up consultation recommended</Text>
                    </Alert>
                  )}

                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">
                      Session ID: {consultation.sessionId}
                    </Text>
                    <Group gap="xs">
                      <ActionIcon variant="subtle" color="blue">
                        <IconEye size={16} />
                      </ActionIcon>
                      {consultation.status === 'active' && (
                        <ActionIcon
                          variant="subtle"
                          color="green"
                          onClick={() => handleStartVideoCall()}
                        >
                          <IconVideo size={16} />
                        </ActionIcon>
                      )}
                      <ActionIcon variant="subtle" color="orange">
                        <IconMessage size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>
      </Tabs>

      {/* Video Call Modal */}
      <Modal
        opened={videoCallOpened}
        onClose={() => {
          if (isInCall) {
            handleEndCall();
          } else {
            closeVideoCall();
          }
        }}
        title="Video Consultation"
        size="xl"
        fullScreen
        withCloseButton={false}
      >
        <div style={{ position: 'relative', height: '100vh', backgroundColor: '#000' }}>
          {/* Main Video Area */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: 'calc(100vh - 120px)',
            position: 'relative'
          }}>
            {/* Doctor's Video (Main) */}
            <div style={{ 
              width: '70%', 
              height: '80%', 
              backgroundColor: '#1a1a1a', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              {isVideoEnabled ? (
                <div style={{ textAlign: 'center', color: 'white' }}>
                  <IconVideo size={80} />
                  <Text size="xl" mt="md">Dr. Smith</Text>
                  <Text size="sm" c="dimmed">Cardiology Consultation</Text>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: 'white' }}>
                  <IconVideoOff size={80} />
                  <Text size="xl" mt="md">Camera Off</Text>
                </div>
              )}
              
              {/* Screen Share Indicator */}
              {isScreenSharing && (
                <Badge 
                  style={{ position: 'absolute', top: 10, left: 10 }}
                  color="blue"
                  variant="filled"
                >
                  Screen Sharing
                </Badge>
              )}
              
              {/* Recording Indicator */}
              {isRecording && (
                <Badge 
                  style={{ position: 'absolute', top: 10, right: 10 }}
                  color="red"
                  variant="filled"
                >
                  ● Recording
                </Badge>
              )}
            </div>

            {/* Patient's Video (Picture in Picture) */}
            <div style={{ 
              position: 'absolute', 
              top: 20, 
              right: 20, 
              width: '200px', 
              height: '150px',
              backgroundColor: '#2a2a2a', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ textAlign: 'center', color: 'white' }}>
                <IconUser size={40} />
                <Text size="sm" mt="xs">You</Text>
              </div>
            </div>

            {/* Call Duration */}
            <div style={{ 
              position: 'absolute', 
              top: 20, 
              left: 20,
              backgroundColor: 'rgba(0,0,0,0.7)',
              padding: '8px 16px',
              borderRadius: '8px',
              color: 'white'
            }}>
              <Text size="lg" fw={600}>
                {formatDuration(callDuration)}
              </Text>
            </div>
          </div>

          {/* Control Bar */}
          <div style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: '20px',
            display: 'flex',
            justifyContent: 'center',
            gap: '16px'
          }}>
            <ActionIcon
              size="xl"
              variant={isAudioEnabled ? 'filled' : 'light'}
              color={isAudioEnabled ? 'blue' : 'red'}
              onClick={toggleAudio}
            >
              {isAudioEnabled ? <IconMicrophone size={24} /> : <IconMicrophoneOff size={24} />}
            </ActionIcon>
            
            <ActionIcon
              size="xl"
              variant={isVideoEnabled ? 'filled' : 'light'}
              color={isVideoEnabled ? 'blue' : 'red'}
              onClick={toggleVideo}
            >
              {isVideoEnabled ? <IconVideo size={24} /> : <IconVideoOff size={24} />}
            </ActionIcon>
            
            <ActionIcon
              size="xl"
              variant={isScreenSharing ? 'filled' : 'light'}
              color="green"
              onClick={toggleScreenShare}
            >
              {isScreenSharing ? <IconScreenShareOff size={24} /> : <IconScreenShare size={24} />}
            </ActionIcon>
            
            <ActionIcon
              size="xl"
              variant={isRecording ? 'filled' : 'light'}
              color="red"
              onClick={toggleRecording}
            >
              {isRecording ? <IconRecordOff size={24} /> : <IconRecord size={24} />}
            </ActionIcon>
            
            <ActionIcon
              size="xl"
              variant="light"
              color="gray"
            >
              <IconMessage size={24} />
            </ActionIcon>
            
            <ActionIcon
              size="xl"
              variant="filled"
              color="red"
              onClick={handleEndCall}
            >
              <IconPhoneOff size={24} />
            </ActionIcon>
          </div>
        </div>
      </Modal>

      {/* Start Session Modal */}
      <Modal
        opened={startSessionOpened}
        onClose={closeStartSession}
        title="Schedule Telemedicine Session"
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
              label="Doctor"
              placeholder="Select doctor"
              data={mockDoctors.map(doctor => ({
                value: doctor.id,
                label: `Dr. ${doctor.firstName} ${doctor.lastName} - ${doctor.specialty}`
              }))}
              required
            />
          </SimpleGrid>
          
          <SimpleGrid cols={2}>
            <Select
              label="Session Type"
              placeholder="Select type"
              data={[
                { value: 'consultation', label: 'Consultation' },
                { value: 'follow_up', label: 'Follow-up' },
                { value: 'emergency', label: 'Emergency' },
                { value: 'therapy', label: 'Therapy' },
                { value: 'monitoring', label: 'Monitoring' }
              ]}
              required
            />
            <NumberInput
              label="Duration (minutes)"
              placeholder="Enter duration"
              min={15}
              max={120}
              defaultValue={30}
              required
            />
          </SimpleGrid>
          
          <SimpleGrid cols={2}>
            <DatePickerInput
              label="Date"
              placeholder="Select date"
              minDate={new Date()}
              required
            />
            <Select
              label="Time"
              placeholder="Select time"
              data={[
                { value: '09:00', label: '9:00 AM' },
                { value: '10:00', label: '10:00 AM' },
                { value: '11:00', label: '11:00 AM' },
                { value: '14:00', label: '2:00 PM' },
                { value: '15:00', label: '3:00 PM' },
                { value: '16:00', label: '4:00 PM' }
              ]}
              required
            />
          </SimpleGrid>
          
          <Select
            label="Platform"
            placeholder="Select platform"
            data={[
              { value: 'zoom', label: 'Zoom' },
              { value: 'teams', label: 'Microsoft Teams' },
              { value: 'webex', label: 'Cisco Webex' },
              { value: 'custom', label: 'Custom Platform' }
            ]}
            defaultValue="zoom"
            required
          />
          
          <Textarea
            label="Session Notes"
            placeholder="Enter any special instructions or notes"
            rows={3}
          />
          
          <Group justify="flex-end">
            <Button variant="light" onClick={closeStartSession}>
              Cancel
            </Button>
            <Button onClick={() => {
              notifications.show({
                title: 'Session Scheduled',
                message: 'Telemedicine session has been scheduled successfully',
                color: 'green',
              });
              closeStartSession();
            }}>
              Schedule Session
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default Telemedicine;