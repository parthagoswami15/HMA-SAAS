'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  Box,
  FileInput,
  JsonInput,
  SegmentedControl,
  SimpleGrid
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import EmptyState from '../../../components/EmptyState';
import { notifications } from '@mantine/notifications';
import { DatePickerInput } from '@mantine/dates';
import { MantineDonutChart, SimpleAreaChart, SimpleBarChart, SimpleLineChart } from '../../../components/MantineChart';
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
  IconFlask,
  IconDroplet,
  IconNurse,
  IconBandage,
  IconPill,
  IconMask,
  IconBolt,
  IconZoomIn as IconZoom,
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
  IconTestPipe,
  IconMicroscope,
  IconAtom,
  IconFlask2,
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
  IconFlag,
  IconFlag2,
  IconFlag3,
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
  IconVolumeOff,
  IconVolume2,
  IconShield,
  IconLock,
  IconKey,
  IconFingerprint,
  IconLicense,
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
  IconYoga,
  IconStretching,
  IconBarbell,
  IconWeight,
  IconBooks,
  IconBook,
  IconBookmark,
  IconNotebook,
  IconNews,
  IconArticle,
  IconWriting,
  IconPencil,
  IconHighlight,
  IconEraser,
  IconRuler2,
  IconRuler3,
  IconTriangle,
  IconSquare,
  IconCircle,
  IconDiamond,
  IconHexagon,
  IconOctagon,
  IconStars,
  IconSparkles,
  IconFlame,
  IconSun,
  IconMoon,
  IconCloud,
  IconCloudCheck,
  IconCloudDownload,
  IconCloudUp,
  IconWind,
  IconTornado
} from '@tabler/icons-react';

// Import types and mock data (using any for now due to type mismatches)
type QualityMetric = any;
type MetricStatus = any;
type MetricType = any;
type Audit = any;
type AuditStatus = any;
type AuditType = any;
type Accreditation = any;
type AccreditationStatus = any;
type Policy = any;
type PolicyStatus = any;
type ComplianceItem = any;
type ComplianceStatus = any;
type QualityIncident = any;
type IncidentSeverity = any;
type CorrectiveAction = any;
type ActionStatus = any;
type QualityStats = any;
type RiskAssessment = any;
type RiskLevel = any;
type PolicyCategory = any;
type AuditFinding = any;
type FindingSeverity = any;
type QualityIndicator = any;
// Mock data imports removed
import qualityService from '../../../services/quality.service';

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

  // API state
  const [qualityMetrics, setQualityMetrics] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [qualityStats, setQualityStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([fetchMetrics(), fetchIncidents(), fetchStats()]);
    } catch (err: any) {
      console.error('Error loading quality data:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load quality data');
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await qualityService.getMetrics();
      setQualityMetrics(response.data || []);
    } catch (err: any) {
      console.error('Error fetching quality metrics:', err);
      setQualityMetrics([] /* TODO: Fetch from API */);
    }
  };

  const fetchIncidents = async () => {
    try {
      const response = await qualityService.getIncidents();
      setIncidents(response.data || []);
    } catch (err: any) {
      console.error('Error fetching incidents:', err);
      setIncidents([] /* TODO: Fetch from API */);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await qualityService.getStats();
      setQualityStats(response.data);
    } catch (err: any) {
      console.error('Error fetching quality stats:', err);
      setQualityStats([] /* TODO: Fetch from API */);
    }
  };

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
    return [].filter /* TODO: Fetch from API */((metric) => {
      const matchesSearch = 
        metric.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        metric.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = !selectedMetricStatus || metric.status === selectedMetricStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedMetricStatus]);

  const filteredAudits = useMemo(() => {
    return [].filter /* TODO: Fetch from API */((audit) => {
      const matchesSearch = 
        ((audit as any).auditType || (audit as any).title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        ((audit as any).auditor || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        ((audit as any).department || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = !selectedAuditStatus || (audit as any).status === selectedAuditStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedAuditStatus]);

  const filteredPolicies = useMemo(() => {
    return [].filter /* TODO: Fetch from API */((policy) => {
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
      value: `${0 /* TODO: Fetch from API */}%`,
      icon: IconShieldCheck,
      color: 'green'
    },
    {
      title: 'Active Audits',
      value: 0 /* TODO: Fetch from API */,
      icon: IconClipboardList,
      color: 'blue'
    },
    {
      title: 'Quality Incidents',
      value: 0 /* TODO: Fetch from API */,
      icon: IconAlertTriangle,
      color: 'orange'
    },
    {
      title: 'Policy Updates',
      value: 0 /* TODO: Fetch from API */,
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
          <Tabs.Tab value="audits" leftSection={<IconClipboardList size={16} />}>
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
                    { value: 0 /* TODO: Fetch from API */, color: 'green' }
                  ]}
                  label={
                    <div style={{ textAlign: 'center' }}>
                      <Text size="xl" fw={700}>
                        {0 /* TODO: Fetch from API */}%
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
              <MantineDonutChart
                data={[]}
              />
            </Card>

            {/* Audit Timeline */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">Recent Audit Activity</Title>
              <Timeline active={3} bulletSize={24} lineWidth={2}>
                {[].map((audit, index) => (
                  <Timeline.Item
                    key={audit.id}
                    bullet={
                      <ThemeIcon color={getStatusColor(audit.status)} size={24} radius="xl">
                        <IconClipboardList size={12} />
                      </ThemeIcon>
                    }
                    title={(audit as any).auditType || (audit as any).title || 'Audit'}
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
                  const count = [].filter /* TODO: Fetch from API */(r => (r as any).level === level || (r as any).riskLevel === level).length;
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
                {[].map((acc) => (
                  <Group key={acc.id} justify="space-between">
                    <div>
                      <Text size="sm" fw={500}>{(acc as any).issuingBody || (acc as any).accreditingBody}</Text>
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
                {[].map((incident) => (
                  <Alert
                    key={incident.id}
                    variant="light"
                    color={getSeverityColor(incident.severity)}
                    icon={<IconAlertTriangle size={16} />}
                  >
                    <Group justify="space-between">
                      <div>
                        <Text size="sm" fw={500}>{(incident as any).incidentType || (incident as any).title}</Text>
                        <Text size="xs" c="dimmed">
                          {(incident as any).department} • {formatDate((incident as any).reportDate || (incident as any).dateReported)}
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
              {filteredMetrics.length === 0 ? (
                <div style={{ gridColumn: '1 / -1' }}>
                  <EmptyState
                    icon={<IconChartBar size={48} />}
                    title="No quality metrics"
                    description="Quality metrics will appear here"
                    size="sm"
                  />
                </div>
              ) : (
                filteredMetrics.map((metric) => (
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
                        {(metric as any).current || (metric as any).currentValue}{(metric as any).unit || '%'}
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Target</Text>
                      <Text size="sm" fw={500}>{(metric as any).target || (metric as any).targetValue}{(metric as any).unit || '%'}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Performance</Text>
                      <Group gap="xs">
                        <Progress
                          value={((metric as any).current || (metric as any).currentValue) / ((metric as any).target || (metric as any).targetValue) * 100}
                          size="sm"
                          color={getStatusColor(metric.status)}
                          style={{ width: '100px' }}
                        />
                        <Text size="sm" fw={500}>
                          {(((metric as any).current || (metric as any).currentValue) / ((metric as any).target || (metric as any).targetValue) * 100).toFixed(0)}%
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
                      Category: {(metric as any).category}
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
              ))
              )}
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
                      <Text fw={600} size="lg" lineClamp={1}>{(audit as any).auditType || (audit as any).title || 'Audit'}</Text>
                      <Text size="sm" c="dimmed">{((audit as any).auditType || (audit as any).type || 'audit').replace('_', ' ').toUpperCase()}</Text>
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
              {[].map /* TODO: Fetch from API */((item) => (
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
                      <Text size="sm">N/A</Text>
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
              {[].map /* TODO: Fetch from API */((accreditation) => (
                <Card key={accreditation.id} padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Text fw={600} size="lg">{(accreditation as any).issuingBody || (accreditation as any).accreditingBody || accreditation.name}</Text>
                      <Text size="sm" c="dimmed">{(accreditation as any).accreditationType || 'Accreditation'}</Text>
                    </div>
                    <Badge color={getStatusColor(accreditation.status)} variant="light">
                      {accreditation.status.toUpperCase()}
                    </Badge>
                  </Group>

                  <Stack gap="sm" mb="md">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Certificate Number</Text>
                      <Text size="sm" fw={500}>{(accreditation as any).certificate || (accreditation as any).certificateNumber || 'N/A'}</Text>
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
                        {(accreditation as any).renewalDue ? formatDate((accreditation as any).renewalDue) : ((accreditation as any).nextAssessmentDate ? formatDate((accreditation as any).nextAssessmentDate) : 'TBD')}
                      </Text>
                    </Group>
                  </Stack>

                  {(accreditation as any).scope && (
                    <>
                      <Text size="sm" c="dimmed" mb="xs">Scope:</Text>
                      <Text size="sm" mb="md">{(accreditation as any).scope}</Text>
                    </>
                  )}

                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">
                      Accreditation ID: {accreditation.id}
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
                      <Text size="sm" c="dimmed">{(policy as any).category || 'Policy'}</Text>
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
                      <Text size="sm">{formatDate((policy as any).lastReviewDate || new Date().toISOString())}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Review Date</Text>
                      <Text size="sm" c={new Date((policy as any).nextReviewDate) < new Date() ? 'red' : undefined}>
                        {formatDate((policy as any).nextReviewDate)}
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Owner</Text>
                      <Text size="sm">{(policy as any).responsiblePerson || 'N/A'}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Approver</Text>
                      <Text size="sm">{(policy as any).responsiblePerson || 'N/A'}</Text>
                    </Group>
                  </Stack>

                  <Text size="sm" c="dimmed" lineClamp={2} mb="md">
                    {policy.description}
                  </Text>

                  <Group justify="space-between">
                    <Group gap="xs">
                      <Badge variant="outline" size="xs" color="blue">
                        {(policy as any).priority || 'Normal'}
                      </Badge>
                      <Badge variant="outline" size="xs" color="green">
                        Score: {(policy as any).complianceScore || 0}%
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
              {[].map /* TODO: Fetch from API */((incident) => (
                <Card key={incident.id} padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Text fw={600} size="lg" lineClamp={1}>{(incident as any).incidentType || (incident as any).title}</Text>
                      <Text size="sm" c="dimmed">ID: {incident.id}</Text>
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
                      <Text size="sm">{formatDate((incident as any).reportDate || (incident as any).dateReported)}</Text>
                    </Group>
                    {(incident as any).status === 'resolved' && (
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Status</Text>
                        <Text size="sm">Resolved</Text>
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
                      Type: {(incident as any).incidentType || 'Incident'}
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
              {[].map /* TODO: Fetch from API */((risk) => (
                <Card key={risk.id} padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Text fw={600} size="lg" lineClamp={1}>{(risk as any).risk || (risk as any).riskTitle}</Text>
                      <Text size="sm" c="dimmed">{(risk as any).area || (risk as any).category}</Text>
                    </div>
                    <Badge color={getRiskLevelColor((risk as any).level || (risk as any).riskLevel)} variant="light">
                      {((risk as any).level || (risk as any).riskLevel || 'unknown').toUpperCase()} RISK
                    </Badge>
                  </Group>

                  <Stack gap="sm" mb="md">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Risk Score</Text>
                      <Group gap="xs">
                        <Progress
                          value={50}
                          size="sm"
                          color={getRiskLevelColor((risk as any).level || (risk as any).riskLevel)}
                          style={{ width: '80px' }}
                        />
                        <Text size="sm" fw={500}>N/A</Text>
                      </Group>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Probability</Text>
                      <Text size="sm">N/A</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Impact</Text>
                      <Text size="sm">N/A</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Department</Text>
                      <Text size="sm">{(risk as any).area || 'N/A'}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Last Review</Text>
                      <Text size="sm">N/A</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Risk Owner</Text>
                      <Text size="sm">N/A</Text>
                    </Group>
                  </Stack>

                  <Text size="sm" c="dimmed" lineClamp={2} mb="md">
                    Risk: {(risk as any).risk} in {(risk as any).area}
                  </Text>

                  <Text size="sm" c="dimmed" mb="xs">Status:</Text>
                  <Text size="sm" mb="md">{(risk as any).status}</Text>

                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">
                      Next Review: N/A
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
              data={[].map /* TODO: Fetch from API */(doctor => ({
                value: doctor.id,
                label: doctor.name || `Dr. ${(doctor as any).firstName || ''} ${(doctor as any).lastName || ''}`
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
            <DatePickerInput
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
            <DatePickerInput
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