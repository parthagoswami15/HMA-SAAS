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
  Box,
  FileInput,
  JsonInput,
  SegmentedControl
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { Calendar } from '@mantine/dates';
import { AreaChart, BarChart, DonutChart, LineChart } from '@mantine/charts';
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconEye,
  IconTrash,
  IconCalendar,
  IconUsers,
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
  IconDatabase,
  IconDna,
  IconMolecule,
  IconTestPipe,
  IconMicroscope,
  IconAtom,
  IconChemistry,
  IconFlask2,
  IconMicroscope2,
  IconScale,
  IconReportAnalytics,
  IconChartDots,
  IconChartLine,
  IconChartPie,
  IconFileDescription,
  IconFileReport,
  IconFileCheck,
  IconFileCertificate,
  IconFileExport,
  IconFileImport,
  IconFiles,
  IconFolder,
  IconFolderOpen,
  IconArchive,
  IconHistory,
  IconCalendarEvent,
  IconCalendarTime,
  IconClockHour9,
  IconUserCheck,
  IconUserPlus,
  IconUserX,
  IconUsersGroup,
  IconUser,
  IconIdBadge,
  IconBriefcase,
  IconSchool,
  IconCertificate,
  IconAward,
  IconTrophy,
  IconMedal,
  IconStar,
  IconStarFilled,
  IconRocket,
  IconTarget2,
  IconBullseye,
  IconFlag,
  IconFlag2,
  IconFlag3,
  IconClipboardCheck,
  IconCheckbox,
  IconSquareCheck,
  IconCircleDot,
  IconPoint,
  IconDots,
  IconMenu,
  IconList,
  IconListDetails,
  IconTable,
  IconCards,
  IconLayoutGrid,
  IconLayoutList,
  IconLayoutColumns,
  IconFilter2,
  IconSortAscending,
  IconSortDescending,
  IconArrowUp,
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconChevronUp,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconCaretUp,
  IconCaretDown,
  IconCaretLeft,
  IconCaretRight,
  IconPlaylistAdd,
  IconPlaylistX,
  IconPlayerRecord,
  IconPlayerStop,
  IconPause,
  IconStop,
  IconRecord,
  IconVolumeOff,
  IconVolume2,
  IconShield,
  IconLock,
  IconKey,
  IconFingerprint,
  IconSecurity,
  IconLicense,
  IconCertificate2,
  IconBuildingBank,
  IconBuilding,
  IconHome,
  IconMapPin,
  IconGps,
  IconMap,
  IconCompass,
  IconRoute,
  IconRoad,
  IconCar,
  IconTruckDelivery,
  IconPlane,
  IconShip,
  IconTrain,
  IconBus,
  IconBike,
  IconWalk,
  IconRun,
  IconSwimming,
  IconFitness,
  IconYoga,
  IconStretching,
  IconDumbbell,
  IconBarbell,
  IconWeight,
  IconMuscle,
  IconBooks,
  IconBook,
  IconBookmark,
  IconBookOpen,
  IconNotebook,
  IconNews,
  IconNewspaper,
  IconArticle,
  IconWriting,
  IconPencil,
  IconPen,
  IconMarker,
  IconHighlight,
  IconEraser,
  IconRuler,
  IconRuler2,
  IconRuler3,
  IconTriangle,
  IconSquare,
  IconCircle,
  IconDiamond,
  IconHexagon,
  IconOctagon,
  IconStarOutline,
  IconStars,
  IconSparkles,
  IconFlame,
  IconFire,
  IconSun,
  IconMoon,
  IconCloud,
  IconCloudCheck,
  IconCloudDownload,
  IconCloudUp,
  IconRain,
  IconSnow,
  IconWind,
  IconTornado,
  IconLightning,
  IconFlash,
  IconZap,
  IconBoltLightning
} from '@tabler/icons-react';

// Import types and mock data
import {
  QualityMetric,
  MetricStatus,
  MetricType,
  Audit,
  AuditStatus,
  AuditType,
  Accreditation,
  AccreditationStatus,
  Policy,
  PolicyStatus,
  ComplianceItem,
  ComplianceStatus,
  QualityIncident,
  IncidentSeverity,
  CorrectiveAction,
  ActionStatus,
  QualityStats,
  RiskAssessment,
  RiskLevel,
  PolicyCategory,
  AuditFinding,
  FindingSeverity,
  QualityIndicator
} from '../../../types/quality';
import {
  mockQualityMetrics,
  mockAudits,
  mockAccreditations,
  mockPolicies,
  mockComplianceItems,
  mockQualityIncidents,
  mockCorrectiveActions,
  mockQualityStats,
  mockRiskAssessments,
  mockAuditFindings,
  mockQualityIndicators
} from '../../../lib/mockData/quality';
import { mockDoctors } from '../../../lib/mockData/doctors';

const QualityAssurance = () => {
  // State management
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMetricStatus, setSelectedMetricStatus] = useState<string>('');
  const [selectedAuditStatus, setSelectedAuditStatus] = useState<string>('');
  const [selectedPolicyCategory, setSelectedPolicyCategory] = useState<string>('');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('');
  const [selectedMetric, setSelectedMetric] = useState<QualityMetric | null>(null);
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<QualityIncident | null>(null);
  const [selectedAccreditation, setSelectedAccreditation] = useState<Accreditation | null>(null);
  const [selectedRisk, setSelectedRisk] = useState<RiskAssessment | null>(null);

  // Modal states
  const [metricDetailOpened, { open: openMetricDetail, close: closeMetricDetail }] = useDisclosure(false);
  const [auditDetailOpened, { open: openAuditDetail, close: closeAuditDetail }] = useDisclosure(false);
  const [policyDetailOpened, { open: openPolicyDetail, close: closePolicyDetail }] = useDisclosure(false);
  const [incidentDetailOpened, { open: openIncidentDetail, close: closeIncidentDetail }] = useDisclosure(false);
  const [accreditationDetailOpened, { open: openAccreditationDetail, close: closeAccreditationDetail }] = useDisclosure(false);
  const [riskDetailOpened, { open: openRiskDetail, close: closeRiskDetail }] = useDisclosure(false);
  const [createAuditOpened, { open: openCreateAudit, close: closeCreateAudit }] = useDisclosure(false);
  const [reportIncidentOpened, { open: openReportIncident, close: closeReportIncident }] = useDisclosure(false);
  const [createPolicyOpened, { open: openCreatePolicy, close: closeCreatePolicy }] = useDisclosure(false);

  // Filter functions
  const filteredMetrics = useMemo(() => {
    return mockQualityMetrics.filter((metric) => {
      const matchesSearch = 
        metric.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        metric.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = !selectedMetricStatus || metric.status === selectedMetricStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedMetricStatus]);

  const filteredAudits = useMemo(() => {
    return mockAudits.filter((audit) => {
      const matchesSearch = 
        audit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        audit.auditor.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = !selectedAuditStatus || audit.status === selectedAuditStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedAuditStatus]);

  const filteredPolicies = useMemo(() => {
    return mockPolicies.filter((policy) => {
      const matchesSearch = 
        policy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        policy.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedPolicyCategory || policy.category === selectedPolicyCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedPolicyCategory]);

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'approved':
      case 'active':
      case 'completed':
      case 'closed': return 'green';
      case 'non_compliant':
      case 'rejected':
      case 'expired':
      case 'high':
      case 'critical': return 'red';
      case 'pending':
      case 'in_progress':
      case 'scheduled':
      case 'medium':
      case 'moderate': return 'orange';
      case 'draft':
      case 'planned':
      case 'low':
      case 'minor': return 'blue';
      default: return 'gray';
    }
  };

  const getRiskLevelColor = (level: RiskLevel) => {
    switch (level) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const getSeverityColor = (severity: IncidentSeverity | FindingSeverity) => {
    switch (severity) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const handleViewMetric = (metric: QualityMetric) => {
    setSelectedMetric(metric);
    openMetricDetail();
  };

  const handleViewAudit = (audit: Audit) => {
    setSelectedAudit(audit);
    openAuditDetail();
  };

  const handleViewPolicy = (policy: Policy) => {
    setSelectedPolicy(policy);
    openPolicyDetail();
  };

  const handleViewIncident = (incident: QualityIncident) => {
    setSelectedIncident(incident);
    openIncidentDetail();
  };

  const handleViewAccreditation = (accreditation: Accreditation) => {
    setSelectedAccreditation(accreditation);
    openAccreditationDetail();
  };

  const handleViewRisk = (risk: RiskAssessment) => {
    setSelectedRisk(risk);
    openRiskDetail();
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
      title: 'Overall Compliance',
      value: `${mockQualityStats.overallComplianceScore}%`,
      icon: IconShieldCheck,
      color: 'green'
    },
    {
      title: 'Active Audits',
      value: mockQualityStats.activeAudits,
      icon: IconClipboardCheck,
      color: 'blue'
    },
    {
      title: 'Quality Incidents',
      value: mockQualityStats.qualityIncidents,
      icon: IconAlertTriangle,
      color: 'orange'
    },
    {
      title: 'Policy Updates',
      value: mockQualityStats.policyUpdates,
      icon: IconFileText,
      color: 'purple'
    }
  ];

  return (
    <Container size="xl" py="md">
      {/* Header */}
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={1}>Quality Assurance & Compliance</Title>
          <Text c="dimmed" size="sm">
            Monitor compliance, manage audits, track quality metrics, and ensure regulatory adherence
          </Text>
        </div>
        <Group>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={openCreateAudit}
            color="blue"
          >
            Schedule Audit
          </Button>
          <Button
            variant="light"
            leftSection={<IconAlertTriangle size={16} />}
            onClick={openReportIncident}
          >
            Report Incident
          </Button>
          <Button
            variant="light"
            leftSection={<IconFileText size={16} />}
            onClick={openCreatePolicy}
          >
            Create Policy
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
          <Tabs.Tab value="metrics" leftSection={<IconTarget size={16} />}>
            Quality Metrics
          </Tabs.Tab>
          <Tabs.Tab value="audits" leftSection={<IconClipboardCheck size={16} />}>
            Audits
          </Tabs.Tab>
          <Tabs.Tab value="compliance" leftSection={<IconShieldCheck size={16} />}>
            Compliance
          </Tabs.Tab>
          <Tabs.Tab value="accreditation" leftSection={<IconCertificate size={16} />}>
            Accreditation
          </Tabs.Tab>
          <Tabs.Tab value="policies" leftSection={<IconFileText size={16} />}>
            Policies
          </Tabs.Tab>
          <Tabs.Tab value="incidents" leftSection={<IconAlertTriangle size={16} />}>
            Incidents
          </Tabs.Tab>
          <Tabs.Tab value="risk" leftSection={<IconAlertCircle size={16} />}>
            Risk Assessment
          </Tabs.Tab>
        </Tabs.List>

        {/* Overview Tab */}
        <Tabs.Panel value="overview">
          <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg" mt="md">
            {/* Compliance Score */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">Compliance Dashboard</Title>
              <Center>
                <RingProgress
                  size={180}
                  thickness={16}
                  sections={[
                    { value: mockQualityStats.overallComplianceScore, color: 'green' }
                  ]}
                  label={
                    <div style={{ textAlign: 'center' }}>
                      <Text size="xl" fw={700}>
                        {mockQualityStats.overallComplianceScore}%
                      </Text>
                      <Text size="sm" c="dimmed">
                        Overall Compliance
                      </Text>
                    </div>
                  }
                />
              </Center>
            </Card>

            {/* Quality Metrics Performance */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">Quality Metrics Performance</Title>
              <DonutChart
                data={[
                  { name: 'Excellent', value: 45, color: 'green' },
                  { name: 'Good', value: 30, color: 'blue' },
                  { name: 'Acceptable', value: 20, color: 'orange' },
                  { name: 'Poor', value: 5, color: 'red' }
                ]}
                size={200}
                thickness={30}
                withLabels
              />
            </Card>

            {/* Audit Timeline */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">Recent Audit Activity</Title>
              <Timeline active={3} bulletSize={24} lineWidth={2}>
                {mockAudits.slice(0, 4).map((audit, index) => (
                  <Timeline.Item
                    key={audit.id}
                    bullet={
                      <ThemeIcon color={getStatusColor(audit.status)} size={24} radius="xl">
                        <IconClipboardCheck size={12} />
                      </ThemeIcon>
                    }
                    title={audit.title}
                  >
                    <Text size="sm" c="dimmed">
                      Auditor: {audit.auditor}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {audit.status === 'completed' ? 'Completed' : 'Scheduled'}: {formatDate(audit.scheduledDate)}
                    </Text>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>

            {/* Risk Assessment Overview */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">Risk Assessment Status</Title>
              <Stack gap="md">
                {['critical', 'high', 'medium', 'low'].map((level) => {
                  const count = mockRiskAssessments.filter(r => r.riskLevel === level).length;
                  return (
                    <Group key={level} justify="space-between">
                      <Group gap="xs">
                        <ThemeIcon color={getRiskLevelColor(level as RiskLevel)} size="sm" radius="xl">
                          <IconCircleDot size={12} />
                        </ThemeIcon>
                        <Text size="sm" fw={500} tt="capitalize">
                          {level} Risk
                        </Text>
                      </Group>
                      <Badge color={getRiskLevelColor(level as RiskLevel)} variant="light">
                        {count}
                      </Badge>
                    </Group>
                  );
                })}
              </Stack>
            </Card>

            {/* Accreditation Status */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">Accreditation Status</Title>
              <Stack gap="sm">
                {mockAccreditations.slice(0, 4).map((acc) => (
                  <Group key={acc.id} justify="space-between">
                    <div>
                      <Text size="sm" fw={500}>{acc.accreditingBody}</Text>
                      <Text size="xs" c="dimmed">
                        Expires: {formatDate(acc.expiryDate)}
                      </Text>
                    </div>
                    <Badge color={getStatusColor(acc.status)} variant="light" size="sm">
                      {acc.status}
                    </Badge>
                  </Group>
                ))}
              </Stack>
            </Card>

            {/* Recent Incidents */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">Recent Quality Incidents</Title>
              <Stack gap="sm">
                {mockQualityIncidents.slice(0, 4).map((incident) => (
                  <Alert
                    key={incident.id}
                    variant="light"
                    color={getSeverityColor(incident.severity)}
                    icon={<IconAlertTriangle size={16} />}
                  >
                    <Group justify="space-between">
                      <div>
                        <Text size="sm" fw={500}>{incident.title}</Text>
                        <Text size="xs" c="dimmed">
                          {incident.department} • {formatDate(incident.dateReported)}
                        </Text>
                      </div>
                      <Badge color={getSeverityColor(incident.severity)} variant="light" size="sm">
                        {incident.severity}
                      </Badge>
                    </Group>
                  </Alert>
                ))}
              </Stack>
            </Card>
          </SimpleGrid>
        </Tabs.Panel>

        {/* Quality Metrics Tab */}
        <Tabs.Panel value="metrics">
          <Paper p="md" radius="md" withBorder mt="md">
            {/* Search and Filters */}
            <Group mb="md">
              <TextInput
                placeholder="Search metrics..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                style={{ flex: 1 }}
              />
              <Select
                placeholder="Status"
                data={[
                  { value: 'excellent', label: 'Excellent' },
                  { value: 'good', label: 'Good' },
                  { value: 'acceptable', label: 'Acceptable' },
                  { value: 'poor', label: 'Poor' }
                ]}
                value={selectedMetricStatus}
                onChange={setSelectedMetricStatus}
                clearable
              />
              <Button leftSection={<IconPlus size={16} />}>
                Add Metric
              </Button>
            </Group>

            {/* Quality Metrics Grid */}
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
              {filteredMetrics.map((metric) => (
                <Card key={metric.id} padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Text fw={600} size="lg">{metric.name}</Text>
                      <Text size="sm" c="dimmed">{metric.category}</Text>
                    </div>
                    <Badge color={getStatusColor(metric.status)} variant="light">
                      {metric.status.toUpperCase()}
                    </Badge>
                  </Group>

                  <Stack gap="sm" mb="md">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Current Value</Text>
                      <Text size="lg" fw={700} c={getStatusColor(metric.status)}>
                        {metric.currentValue}{metric.unit}
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Target</Text>
                      <Text size="sm" fw={500}>{metric.targetValue}{metric.unit}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Performance</Text>
                      <Group gap="xs">
                        <Progress
                          value={(metric.currentValue / metric.targetValue) * 100}
                          size="sm"
                          color={getStatusColor(metric.status)}
                          style={{ width: '100px' }}
                        />
                        <Text size="sm" fw={500}>
                          {((metric.currentValue / metric.targetValue) * 100).toFixed(0)}%
                        </Text>
                      </Group>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Last Updated</Text>
                      <Text size="sm">{formatDate(metric.lastUpdated)}</Text>
                    </Group>
                  </Stack>

                  <Text size="sm" c="dimmed" lineClamp={2} mb="md">
                    {metric.description}
                  </Text>

                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">
                      Frequency: {metric.measurementFrequency}
                    </Text>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleViewMetric(metric)}
                      >
                        <IconEye size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="green">
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="orange">
                        <IconChartLine size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>

        {/* Audits Tab */}
        <Tabs.Panel value="audits">
          <Paper p="md" radius="md" withBorder mt="md">
            {/* Search and Filters */}
            <Group mb="md">
              <TextInput
                placeholder="Search audits..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                style={{ flex: 1 }}
              />
              <Select
                placeholder="Status"
                data={[
                  { value: 'planned', label: 'Planned' },
                  { value: 'in_progress', label: 'In Progress' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'cancelled', label: 'Cancelled' }
                ]}
                value={selectedAuditStatus}
                onChange={setSelectedAuditStatus}
                clearable
              />
              <Button leftSection={<IconPlus size={16} />} onClick={openCreateAudit}>
                Schedule Audit
              </Button>
            </Group>

            {/* Audits Grid */}
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
              {filteredAudits.map((audit) => (
                <Card key={audit.id} padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Text fw={600} size="lg" lineClamp={1}>{audit.title}</Text>
                      <Text size="sm" c="dimmed">{audit.type.replace('_', ' ').toUpperCase()}</Text>
                    </div>
                    <Badge color={getStatusColor(audit.status)} variant="light">
                      {audit.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </Group>

                  <Stack gap="sm" mb="md">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Auditor</Text>
                      <Text size="sm" fw={500}>{audit.auditor}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Department</Text>
                      <Text size="sm">{audit.department}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Scheduled Date</Text>
                      <Text size="sm">{formatDate(audit.scheduledDate)}</Text>
                    </Group>
                    {audit.completedDate && (
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Completed Date</Text>
                        <Text size="sm">{formatDate(audit.completedDate)}</Text>
                      </Group>
                    )}
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Score</Text>
                      <Group gap="xs">
                        <Progress
                          value={audit.score || 0}
                          size="sm"
                          color={audit.score >= 80 ? 'green' : audit.score >= 60 ? 'orange' : 'red'}
                          style={{ width: '80px' }}
                        />
                        <Text size="sm" fw={500}>
                          {audit.score || 0}%
                        </Text>
                      </Group>
                    </Group>
                  </Stack>

                  {audit.scope && (
                    <Text size="sm" c="dimmed" lineClamp={2} mb="md">
                      Scope: {audit.scope}
                    </Text>
                  )}

                  <Group justify="space-between">
                    <Group gap="xs">
                      {audit.findings && (
                        <Badge variant="outline" size="xs" color="orange">
                          {audit.findings.length} Finding{audit.findings.length !== 1 ? 's' : ''}
                        </Badge>
                      )}
                      <Badge variant="outline" size="xs" color="blue">
                        {audit.duration} days
                      </Badge>
                    </Group>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleViewAudit(audit)}
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

        {/* Compliance Tab */}
        <Tabs.Panel value="compliance">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Compliance Monitoring</Title>
              <Button leftSection={<IconDownload size={16} />} variant="light">
                Export Report
              </Button>
            </Group>

            {/* Compliance Overview Cards */}
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mb="lg">
              <Card padding="md" radius="md" withBorder>
                <Group justify="space-between">
                  <div>
                    <Text size="sm" c="dimmed">Regulatory Compliance</Text>
                    <Text fw={700} size="lg">95%</Text>
                  </div>
                  <ThemeIcon color="green" variant="light">
                    <IconShieldCheck size={20} />
                  </ThemeIcon>
                </Group>
              </Card>
              <Card padding="md" radius="md" withBorder>
                <Group justify="space-between">
                  <div>
                    <Text size="sm" c="dimmed">Safety Standards</Text>
                    <Text fw={700} size="lg">88%</Text>
                  </div>
                  <ThemeIcon color="orange" variant="light">
                    <IconShield size={20} />
                  </ThemeIcon>
                </Group>
              </Card>
              <Card padding="md" radius="md" withBorder>
                <Group justify="space-between">
                  <div>
                    <Text size="sm" c="dimmed">Documentation</Text>
                    <Text fw={700} size="lg">92%</Text>
                  </div>
                  <ThemeIcon color="blue" variant="light">
                    <IconFileCheck size={20} />
                  </ThemeIcon>
                </Group>
              </Card>
              <Card padding="md" radius="md" withBorder>
                <Group justify="space-between">
                  <div>
                    <Text size="sm" c="dimmed">Training Compliance</Text>
                    <Text fw={700} size="lg">97%</Text>
                  </div>
                  <ThemeIcon color="teal" variant="light">
                    <IconSchool size={20} />
                  </ThemeIcon>
                </Group>
              </Card>
            </SimpleGrid>

            {/* Compliance Items */}
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
              {mockComplianceItems.map((item) => (
                <Card key={item.id} padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Text fw={600} size="lg">{item.title}</Text>
                      <Text size="sm" c="dimmed">{item.category}</Text>
                    </div>
                    <Badge color={getStatusColor(item.status)} variant="light">
                      {item.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </Group>

                  <Stack gap="sm" mb="md">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Compliance Score</Text>
                      <Group gap="xs">
                        <Progress
                          value={item.complianceScore}
                          size="sm"
                          color={item.complianceScore >= 90 ? 'green' : item.complianceScore >= 70 ? 'orange' : 'red'}
                          style={{ width: '100px' }}
                        />
                        <Text size="sm" fw={500}>{item.complianceScore}%</Text>
                      </Group>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Last Review</Text>
                      <Text size="sm">{formatDate(item.lastReviewDate)}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Next Review</Text>
                      <Text size="sm" c={new Date(item.nextReviewDate) < new Date() ? 'red' : undefined}>
                        {formatDate(item.nextReviewDate)}
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Responsible Person</Text>
                      <Text size="sm">{item.responsiblePerson}</Text>
                    </Group>
                  </Stack>

                  <Text size="sm" c="dimmed" lineClamp={2} mb="md">
                    {item.description}
                  </Text>

                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">
                      Priority: {item.priority}
                    </Text>
                    <Group gap="xs">
                      <ActionIcon variant="subtle" color="blue">
                        <IconEye size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="green">
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="orange">
                        <IconFileCheck size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>

        {/* Accreditation Tab */}
        <Tabs.Panel value="accreditation">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Accreditation Management</Title>
              <Button leftSection={<IconPlus size={16} />}>
                Add Accreditation
              </Button>
            </Group>

            {/* Accreditations Grid */}
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
              {mockAccreditations.map((accreditation) => (
                <Card key={accreditation.id} padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Text fw={600} size="lg">{accreditation.accreditingBody}</Text>
                      <Text size="sm" c="dimmed">{accreditation.accreditationType}</Text>
                    </div>
                    <Badge color={getStatusColor(accreditation.status)} variant="light">
                      {accreditation.status.toUpperCase()}
                    </Badge>
                  </Group>

                  <Stack gap="sm" mb="md">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Certificate Number</Text>
                      <Text size="sm" fw={500}>{accreditation.certificateNumber}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Issue Date</Text>
                      <Text size="sm">{formatDate(accreditation.issueDate)}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Expiry Date</Text>
                      <Text 
                        size="sm" 
                        c={new Date(accreditation.expiryDate) < new Date() ? 'red' : undefined}
                      >
                        {formatDate(accreditation.expiryDate)}
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Scope</Text>
                      <Text size="sm">{accreditation.scope}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Next Assessment</Text>
                      <Text size="sm">
                        {accreditation.nextAssessmentDate ? formatDate(accreditation.nextAssessmentDate) : 'TBD'}
                      </Text>
                    </Group>
                  </Stack>

                  {accreditation.requirements && (
                    <>
                      <Text size="sm" c="dimmed" mb="xs">Key Requirements:</Text>
                      <List size="sm" mb="md">
                        {accreditation.requirements.slice(0, 3).map((req, index) => (
                          <List.Item key={index}>{req}</List.Item>
                        ))}
                        {accreditation.requirements.length > 3 && (
                          <List.Item>
                            <Text size="sm" c="dimmed">+{accreditation.requirements.length - 3} more...</Text>
                          </List.Item>
                        )}
                      </List>
                    </>
                  )}

                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">
                      Contact: {accreditation.contactPerson}
                    </Text>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleViewAccreditation(accreditation)}
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

        {/* Policies Tab */}
        <Tabs.Panel value="policies">
          <Paper p="md" radius="md" withBorder mt="md">
            {/* Search and Filters */}
            <Group mb="md">
              <TextInput
                placeholder="Search policies..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                style={{ flex: 1 }}
              />
              <Select
                placeholder="Category"
                data={[
                  { value: 'safety', label: 'Safety' },
                  { value: 'quality', label: 'Quality' },
                  { value: 'privacy', label: 'Privacy' },
                  { value: 'clinical', label: 'Clinical' },
                  { value: 'administrative', label: 'Administrative' }
                ]}
                value={selectedPolicyCategory}
                onChange={setSelectedPolicyCategory}
                clearable
              />
              <Button leftSection={<IconPlus size={16} />} onClick={openCreatePolicy}>
                Create Policy
              </Button>
            </Group>

            {/* Policies Grid */}
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
              {filteredPolicies.map((policy) => (
                <Card key={policy.id} padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Text fw={600} size="lg" lineClamp={1}>{policy.title}</Text>
                      <Text size="sm" c="dimmed">Version {policy.version}</Text>
                    </div>
                    <Badge color={getStatusColor(policy.status)} variant="light">
                      {policy.status.toUpperCase()}
                    </Badge>
                  </Group>

                  <Stack gap="sm" mb="md">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Category</Text>
                      <Badge variant="outline" size="sm">
                        {policy.category.toUpperCase()}
                      </Badge>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Effective Date</Text>
                      <Text size="sm">{formatDate(policy.effectiveDate)}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Review Date</Text>
                      <Text size="sm" c={new Date(policy.reviewDate) < new Date() ? 'red' : undefined}>
                        {formatDate(policy.reviewDate)}
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Owner</Text>
                      <Text size="sm">{policy.owner}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Approver</Text>
                      <Text size="sm">{policy.approver}</Text>
                    </Group>
                  </Stack>

                  <Text size="sm" c="dimmed" lineClamp={2} mb="md">
                    {policy.description}
                  </Text>

                  <Group justify="space-between">
                    <Group gap="xs">
                      <Badge variant="outline" size="xs" color="blue">
                        {policy.applicableDepartments?.length || 0} Departments
                      </Badge>
                      <Badge variant="outline" size="xs" color="green">
                        Page {policy.documentPages || 1}
                      </Badge>
                    </Group>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleViewPolicy(policy)}
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

        {/* Incidents Tab */}
        <Tabs.Panel value="incidents">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Quality Incidents</Title>
              <Group>
                <Button leftSection={<IconPlus size={16} />} onClick={openReportIncident}>
                  Report Incident
                </Button>
                <Button variant="light" leftSection={<IconDownload size={16} />}>
                  Export Report
                </Button>
              </Group>
            </Group>

            {/* Incidents Grid */}
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
              {mockQualityIncidents.map((incident) => (
                <Card key={incident.id} padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Text fw={600} size="lg" lineClamp={1}>{incident.title}</Text>
                      <Text size="sm" c="dimmed">ID: {incident.incidentId}</Text>
                    </div>
                    <Group>
                      <Badge color={getSeverityColor(incident.severity)} variant="light">
                        {incident.severity.toUpperCase()}
                      </Badge>
                      <Badge color={getStatusColor(incident.status)} variant="light">
                        {incident.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </Group>
                  </Group>

                  <Stack gap="sm" mb="md">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Department</Text>
                      <Text size="sm" fw={500}>{incident.department}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Reported By</Text>
                      <Text size="sm">{incident.reportedBy}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Date Reported</Text>
                      <Text size="sm">{formatDate(incident.dateReported)}</Text>
                    </Group>
                    {incident.dateResolved && (
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Date Resolved</Text>
                        <Text size="sm">{formatDate(incident.dateResolved)}</Text>
                      </Group>
                    )}
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Assigned To</Text>
                      <Text size="sm">{incident.assignedTo}</Text>
                    </Group>
                  </Stack>

                  <Text size="sm" c="dimmed" lineClamp={2} mb="md">
                    {incident.description}
                  </Text>

                  {incident.correctiveActions && (
                    <Alert variant="light" color="blue" icon={<IconClipboardList size={16} />} mb="md">
                      <Text size="sm">
                        {incident.correctiveActions.length} corrective action{incident.correctiveActions.length !== 1 ? 's' : ''} planned
                      </Text>
                    </Alert>
                  )}

                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">
                      Priority: {incident.priority}
                    </Text>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleViewIncident(incident)}
                      >
                        <IconEye size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="green">
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="orange">
                        <IconClipboardList size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>

        {/* Risk Assessment Tab */}
        <Tabs.Panel value="risk">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Risk Assessment</Title>
              <Group>
                <Button leftSection={<IconPlus size={16} />}>
                  Add Risk Assessment
                </Button>
                <Button variant="light" leftSection={<IconDownload size={16} />}>
                  Risk Report
                </Button>
              </Group>
            </Group>

            {/* Risk Assessments Grid */}
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
              {mockRiskAssessments.map((risk) => (
                <Card key={risk.id} padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Text fw={600} size="lg" lineClamp={1}>{risk.riskTitle}</Text>
                      <Text size="sm" c="dimmed">{risk.category}</Text>
                    </div>
                    <Badge color={getRiskLevelColor(risk.riskLevel)} variant="light">
                      {risk.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </Group>

                  <Stack gap="sm" mb="md">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Risk Score</Text>
                      <Group gap="xs">
                        <Progress
                          value={(risk.riskScore / 25) * 100}
                          size="sm"
                          color={getRiskLevelColor(risk.riskLevel)}
                          style={{ width: '80px' }}
                        />
                        <Text size="sm" fw={500}>{risk.riskScore}/25</Text>
                      </Group>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Probability</Text>
                      <Text size="sm">{risk.probability}/5</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Impact</Text>
                      <Text size="sm">{risk.impact}/5</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Department</Text>
                      <Text size="sm">{risk.department}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Last Review</Text>
                      <Text size="sm">{formatDate(risk.lastReviewDate)}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Risk Owner</Text>
                      <Text size="sm">{risk.riskOwner}</Text>
                    </Group>
                  </Stack>

                  <Text size="sm" c="dimmed" lineClamp={2} mb="md">
                    {risk.description}
                  </Text>

                  {risk.mitigationStrategies && (
                    <>
                      <Text size="sm" c="dimmed" mb="xs">Mitigation Strategies:</Text>
                      <List size="sm" mb="md">
                        {risk.mitigationStrategies.slice(0, 2).map((strategy, index) => (
                          <List.Item key={index}>{strategy}</List.Item>
                        ))}
                        {risk.mitigationStrategies.length > 2 && (
                          <List.Item>
                            <Text size="sm" c="dimmed">+{risk.mitigationStrategies.length - 2} more...</Text>
                          </List.Item>
                        )}
                      </List>
                    </>
                  )}

                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">
                      Next Review: {formatDate(risk.nextReviewDate)}
                    </Text>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleViewRisk(risk)}
                      >
                        <IconEye size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="green">
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="orange">
                        <IconAlertTriangle size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>
      </Tabs>

      {/* Create Audit Modal */}
      <Modal
        opened={createAuditOpened}
        onClose={closeCreateAudit}
        title="Schedule New Audit"
        size="lg"
      >
        <Stack gap="md">
          <SimpleGrid cols={2}>
            <TextInput
              label="Audit Title"
              placeholder="Enter audit title"
              required
            />
            <Select
              label="Audit Type"
              placeholder="Select type"
              data={[
                { value: 'internal', label: 'Internal Audit' },
                { value: 'external', label: 'External Audit' },
                { value: 'compliance', label: 'Compliance Audit' },
                { value: 'quality', label: 'Quality Audit' }
              ]}
              required
            />
          </SimpleGrid>
          
          <SimpleGrid cols={2}>
            <Select
              label="Auditor"
              placeholder="Select auditor"
              data={mockDoctors.map(doctor => ({
                value: doctor.id,
                label: `Dr. ${doctor.firstName} ${doctor.lastName}`
              }))}
              required
            />
            <Select
              label="Department"
              placeholder="Select department"
              data={[
                { value: 'cardiology', label: 'Cardiology' },
                { value: 'emergency', label: 'Emergency' },
                { value: 'surgery', label: 'Surgery' },
                { value: 'pediatrics', label: 'Pediatrics' },
                { value: 'radiology', label: 'Radiology' }
              ]}
              required
            />
          </SimpleGrid>
          
          <SimpleGrid cols={2}>
            <DatePicker
              label="Scheduled Date"
              placeholder="Select date"
              minDate={new Date()}
              required
            />
            <NumberInput
              label="Duration (days)"
              placeholder="Enter duration"
              min={1}
              max={30}
              defaultValue={3}
              required
            />
          </SimpleGrid>
          
          <Textarea
            label="Audit Scope"
            placeholder="Describe the scope and objectives of this audit"
            rows={3}
            required
          />
          
          <Group justify="flex-end">
            <Button variant="light" onClick={closeCreateAudit}>
              Cancel
            </Button>
            <Button onClick={() => {
              notifications.show({
                title: 'Audit Scheduled',
                message: 'Quality audit has been successfully scheduled',
                color: 'green',
              });
              closeCreateAudit();
            }}>
              Schedule Audit
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Report Incident Modal */}
      <Modal
        opened={reportIncidentOpened}
        onClose={closeReportIncident}
        title="Report Quality Incident"
        size="lg"
      >
        <Stack gap="md">
          <SimpleGrid cols={2}>
            <TextInput
              label="Incident Title"
              placeholder="Brief incident title"
              required
            />
            <Select
              label="Severity"
              placeholder="Select severity"
              data={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'critical', label: 'Critical' }
              ]}
              required
            />
          </SimpleGrid>
          
          <SimpleGrid cols={2}>
            <Select
              label="Department"
              placeholder="Select department"
              data={[
                { value: 'cardiology', label: 'Cardiology' },
                { value: 'emergency', label: 'Emergency' },
                { value: 'surgery', label: 'Surgery' },
                { value: 'pediatrics', label: 'Pediatrics' },
                { value: 'radiology', label: 'Radiology' }
              ]}
              required
            />
            <Select
              label="Priority"
              placeholder="Select priority"
              data={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'urgent', label: 'Urgent' }
              ]}
              required
            />
          </SimpleGrid>
          
          <Textarea
            label="Incident Description"
            placeholder="Provide detailed description of the quality incident"
            rows={4}
            required
          />
          
          <Textarea
            label="Immediate Actions Taken"
            placeholder="Describe any immediate actions taken to address the incident"
            rows={3}
          />
          
          <Group justify="flex-end">
            <Button variant="light" onClick={closeReportIncident}>
              Cancel
            </Button>
            <Button onClick={() => {
              notifications.show({
                title: 'Incident Reported',
                message: 'Quality incident has been successfully reported',
                color: 'orange',
              });
              closeReportIncident();
            }}>
              Report Incident
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Create Policy Modal */}
      <Modal
        opened={createPolicyOpened}
        onClose={closeCreatePolicy}
        title="Create New Policy"
        size="lg"
      >
        <Stack gap="md">
          <SimpleGrid cols={2}>
            <TextInput
              label="Policy Title"
              placeholder="Enter policy title"
              required
            />
            <Select
              label="Category"
              placeholder="Select category"
              data={[
                { value: 'safety', label: 'Safety' },
                { value: 'quality', label: 'Quality' },
                { value: 'privacy', label: 'Privacy' },
                { value: 'clinical', label: 'Clinical' },
                { value: 'administrative', label: 'Administrative' }
              ]}
              required
            />
          </SimpleGrid>
          
          <SimpleGrid cols={2}>
            <TextInput
              label="Policy Owner"
              placeholder="Enter policy owner"
              required
            />
            <DatePicker
              label="Effective Date"
              placeholder="Select effective date"
              required
            />
          </SimpleGrid>
          
          <Textarea
            label="Policy Description"
            placeholder="Provide a brief description of the policy"
            rows={3}
            required
          />
          
          <MultiSelect
            label="Applicable Departments"
            placeholder="Select departments"
            data={[
              { value: 'all', label: 'All Departments' },
              { value: 'cardiology', label: 'Cardiology' },
              { value: 'emergency', label: 'Emergency' },
              { value: 'surgery', label: 'Surgery' },
              { value: 'pediatrics', label: 'Pediatrics' },
              { value: 'radiology', label: 'Radiology' }
            ]}
          />
          
          <Group justify="flex-end">
            <Button variant="light" onClick={closeCreatePolicy}>
              Cancel
            </Button>
            <Button onClick={() => {
              notifications.show({
                title: 'Policy Created',
                message: 'New policy has been successfully created',
                color: 'green',
              });
              closeCreatePolicy();
            }}>
              Create Policy
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default QualityAssurance;