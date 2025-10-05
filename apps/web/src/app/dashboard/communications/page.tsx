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
  Indicator,
  RingProgress,
  Stepper,
  Chip,
  MultiSelect,
  JsonInput,
  Code,
  Notification
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { LineChart, BarChart, DonutChart, AreaChart, PieChart } from '@mantine/charts';
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconEye,
  IconTrash,
  IconMessage,
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
  IconEmergencyBed,
  IconBuildingBank,
  IconFileUpload,
  IconClockHour4,
  IconCheckbox,
  IconAlertTriangle,
  IconPhotoCheck,
  IconNotes,
  IconFilter,
  IconSortDescending,
  IconExternalLink,
  IconCalendarStats,
  IconCurrency,
  IconPercentage,
  IconShieldCheck,
  IconShieldX,
  IconClockPause,
  IconFileCheck,
  IconFileX,
  IconAlarm,
  IconSend,
  IconMessageCircle,
  IconBrandWhatsapp,
  IconDeviceMobile,
  IconBell,
  IconSettings,
  IconTemplate,
  IconBulb,
  IconRobot,
  IconMicrophone,
  IconVideo,
  IconPhoneCall,
  IconMessageDots,
  IconMailForward,
  IconBrandTelegram,
  IconVolume,
  IconHistory,
  IconTarget,
  IconUsersGroup,
  IconCalendarTime,
  IconCloudUpload,
  IconApi,
  IconDatabase,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTwitter,
  IconShare,
  IconLink,
  IconStar,
  IconBookmark
} from '@tabler/icons-react';

// Types
interface CommunicationTemplate {
  id: string;
  name: string;
  type: 'sms' | 'whatsapp' | 'email' | 'push' | 'voice';
  category: 'appointment' | 'reminder' | 'follow-up' | 'emergency' | 'marketing' | 'billing' | 'general';
  subject?: string;
  content: string;
  variables: string[];
  isActive: boolean;
  createdDate: string;
  lastUsed?: string;
  usageCount: number;
  language: string;
}

interface CommunicationMessage {
  id: string;
  templateId?: string;
  templateName?: string;
  type: 'sms' | 'whatsapp' | 'email' | 'push' | 'voice';
  recipient: {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    type: 'patient' | 'doctor' | 'staff' | 'group';
  };
  subject?: string;
  content: string;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed' | 'scheduled';
  priority: 'high' | 'medium' | 'low';
  scheduledTime?: string;
  sentTime?: string;
  deliveredTime?: string;
  readTime?: string;
  attempts: number;
  cost: number;
  errorMessage?: string;
  metadata: {
    patientId?: string;
    appointmentId?: string;
    billId?: string;
    campaignId?: string;
  };
}

interface CommunicationCampaign {
  id: string;
  name: string;
  description: string;
  type: 'sms' | 'whatsapp' | 'email' | 'multi-channel';
  templateId: string;
  templateName: string;
  targetAudience: {
    type: 'all-patients' | 'specific-patients' | 'department' | 'age-group' | 'custom';
    criteria: Record<string, any>;
    count: number;
  };
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused' | 'failed';
  scheduledTime?: string;
  startTime?: string;
  endTime?: string;
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
  totalCost: number;
  createdBy: string;
  createdDate: string;
}

interface NotificationSettings {
  id: string;
  userId: string;
  userType: 'patient' | 'doctor' | 'admin' | 'staff';
  channels: {
    sms: boolean;
    whatsapp: boolean;
    email: boolean;
    push: boolean;
    voice: boolean;
  };
  categories: {
    appointments: boolean;
    reminders: boolean;
    emergencies: boolean;
    billing: boolean;
    marketing: boolean;
    reports: boolean;
  };
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}

// Mock data
const mockTemplates: CommunicationTemplate[] = [
  {
    id: '1',
    name: 'Appointment Reminder',
    type: 'sms',
    category: 'reminder',
    content: 'Dear {{patientName}}, your appointment with Dr. {{doctorName}} is scheduled for {{appointmentDate}} at {{appointmentTime}}. Please arrive 15 minutes early. For any changes, call {{hospitalPhone}}.',
    variables: ['patientName', 'doctorName', 'appointmentDate', 'appointmentTime', 'hospitalPhone'],
    isActive: true,
    createdDate: '2024-01-01T00:00:00Z',
    lastUsed: '2024-01-15T10:30:00Z',
    usageCount: 245,
    language: 'English'
  },
  {
    id: '2',
    name: 'WhatsApp Appointment Confirmation',
    type: 'whatsapp',
    category: 'appointment',
    content: '🏥 *Appointment Confirmed* ✅\n\nHello {{patientName}},\n\nYour appointment has been confirmed:\n📅 Date: {{appointmentDate}}\n⏰ Time: {{appointmentTime}}\n👨‍⚕️ Doctor: Dr. {{doctorName}}\n🏢 Department: {{department}}\n\nPlease arrive 15 minutes before your appointment.\n\n📞 For any queries, call: {{hospitalPhone}}\n\nThank you for choosing our hospital! 🙏',
    variables: ['patientName', 'appointmentDate', 'appointmentTime', 'doctorName', 'department', 'hospitalPhone'],
    isActive: true,
    createdDate: '2024-01-01T00:00:00Z',
    lastUsed: '2024-01-15T14:20:00Z',
    usageCount: 189,
    language: 'English'
  },
  {
    id: '3',
    name: 'Bill Payment Reminder',
    type: 'email',
    category: 'billing',
    subject: 'Payment Reminder - Bill #{{billNumber}}',
    content: 'Dear {{patientName}},\n\nThis is a friendly reminder that your bill #{{billNumber}} of ₹{{amount}} is due for payment.\n\nDue Date: {{dueDate}}\nAmount: ₹{{amount}}\n\nYou can pay online at {{paymentLink}} or visit our billing counter.\n\nThank you for your prompt attention.\n\nBest regards,\nBilling Department\n{{hospitalName}}',
    variables: ['patientName', 'billNumber', 'amount', 'dueDate', 'paymentLink', 'hospitalName'],
    isActive: true,
    createdDate: '2024-01-02T00:00:00Z',
    lastUsed: '2024-01-14T16:45:00Z',
    usageCount: 78,
    language: 'English'
  },
  {
    id: '4',
    name: 'Emergency Alert',
    type: 'sms',
    category: 'emergency',
    content: '🚨 EMERGENCY ALERT: {{emergencyType}} reported at {{location}}. All available {{department}} staff please report immediately. Time: {{timestamp}}',
    variables: ['emergencyType', 'location', 'department', 'timestamp'],
    isActive: true,
    createdDate: '2024-01-03T00:00:00Z',
    lastUsed: '2024-01-10T22:15:00Z',
    usageCount: 12,
    language: 'English'
  },
  {
    id: '5',
    name: 'Lab Report Ready',
    type: 'whatsapp',
    category: 'follow-up',
    content: '🔬 *Lab Report Ready* 📋\n\nDear {{patientName}},\n\nYour lab report for tests conducted on {{testDate}} is now ready.\n\n📊 Report ID: {{reportId}}\n🏥 Collected at: {{hospitalName}}\n\nYou can:\n• Collect from reception\n• Download from patient portal: {{portalLink}}\n• Request home delivery\n\n📞 Contact: {{hospitalPhone}}\n\nThank you! 🙏',
    variables: ['patientName', 'testDate', 'reportId', 'hospitalName', 'portalLink', 'hospitalPhone'],
    isActive: true,
    createdDate: '2024-01-04T00:00:00Z',
    lastUsed: '2024-01-15T11:30:00Z',
    usageCount: 156,
    language: 'English'
  }
];

const mockMessages: CommunicationMessage[] = [
  {
    id: '1',
    templateId: '1',
    templateName: 'Appointment Reminder',
    type: 'sms',
    recipient: {
      id: 'P001',
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      type: 'patient'
    },
    content: 'Dear Rajesh Kumar, your appointment with Dr. Sharma is scheduled for 2024-01-16 at 10:30 AM. Please arrive 15 minutes early. For any changes, call +91 98765 00000.',
    status: 'delivered',
    priority: 'high',
    sentTime: '2024-01-15T10:30:00Z',
    deliveredTime: '2024-01-15T10:30:15Z',
    attempts: 1,
    cost: 0.25,
    metadata: {
      patientId: 'P001',
      appointmentId: 'APT001'
    }
  },
  {
    id: '2',
    templateId: '2',
    templateName: 'WhatsApp Appointment Confirmation',
    type: 'whatsapp',
    recipient: {
      id: 'P002',
      name: 'Sunita Patel',
      phone: '+91 87654 32109',
      type: 'patient'
    },
    content: '🏥 *Appointment Confirmed* ✅\n\nHello Sunita Patel,\n\nYour appointment has been confirmed:\n📅 Date: 2024-01-17\n⏰ Time: 02:30 PM\n👨‍⚕️ Doctor: Dr. Mehta\n🏢 Department: Gynecology\n\nPlease arrive 15 minutes before your appointment.\n\n📞 For any queries, call: +91 98765 00000\n\nThank you for choosing our hospital! 🙏',
    status: 'read',
    priority: 'medium',
    sentTime: '2024-01-15T14:20:00Z',
    deliveredTime: '2024-01-15T14:20:05Z',
    readTime: '2024-01-15T14:25:30Z',
    attempts: 1,
    cost: 0.15,
    metadata: {
      patientId: 'P002',
      appointmentId: 'APT002'
    }
  },
  {
    id: '3',
    templateId: '3',
    templateName: 'Bill Payment Reminder',
    type: 'email',
    recipient: {
      id: 'P003',
      name: 'Mohammed Ali',
      email: 'mohammed@example.com',
      type: 'patient'
    },
    subject: 'Payment Reminder - Bill #INV-2024-001',
    content: 'Dear Mohammed Ali,\n\nThis is a friendly reminder that your bill #INV-2024-001 of ₹15,500 is due for payment.\n\nDue Date: 2024-01-20\nAmount: ₹15,500\n\nYou can pay online at https://hospital.com/pay or visit our billing counter.\n\nThank you for your prompt attention.\n\nBest regards,\nBilling Department\nCity Hospital',
    status: 'sent',
    priority: 'medium',
    sentTime: '2024-01-14T16:45:00Z',
    attempts: 1,
    cost: 0.05,
    metadata: {
      patientId: 'P003',
      billId: 'INV-2024-001'
    }
  },
  {
    id: '4',
    templateId: '4',
    templateName: 'Emergency Alert',
    type: 'sms',
    recipient: {
      id: 'D001',
      name: 'All ICU Staff',
      type: 'group'
    },
    content: '🚨 EMERGENCY ALERT: Code Blue reported at ICU Room 5. All available ICU staff please report immediately. Time: 2024-01-10 22:15',
    status: 'delivered',
    priority: 'high',
    sentTime: '2024-01-10T22:15:00Z',
    deliveredTime: '2024-01-10T22:15:05Z',
    attempts: 1,
    cost: 2.50,
    metadata: {}
  },
  {
    id: '5',
    templateId: '5',
    templateName: 'Lab Report Ready',
    type: 'whatsapp',
    recipient: {
      id: 'P004',
      name: 'Priya Sharma',
      phone: '+91 76543 21098',
      type: 'patient'
    },
    content: '🔬 *Lab Report Ready* 📋\n\nDear Priya Sharma,\n\nYour lab report for tests conducted on 2024-01-12 is now ready.\n\n📊 Report ID: LAB-2024-045\n🏥 Collected at: City Hospital\n\nYou can:\n• Collect from reception\n• Download from patient portal: https://portal.hospital.com\n• Request home delivery\n\n📞 Contact: +91 98765 00000\n\nThank you! 🙏',
    status: 'pending',
    priority: 'medium',
    scheduledTime: '2024-01-16T09:00:00Z',
    attempts: 0,
    cost: 0.15,
    metadata: {
      patientId: 'P004'
    }
  }
];

const mockCampaigns: CommunicationCampaign[] = [
  {
    id: '1',
    name: 'Health Checkup Reminder Campaign',
    description: 'Annual health checkup reminders for patients above 40',
    type: 'multi-channel',
    templateId: '6',
    templateName: 'Annual Checkup Reminder',
    targetAudience: {
      type: 'age-group',
      criteria: { ageMin: 40, ageMax: 80 },
      count: 450
    },
    status: 'completed',
    scheduledTime: '2024-01-10T09:00:00Z',
    startTime: '2024-01-10T09:00:00Z',
    endTime: '2024-01-10T12:30:00Z',
    totalRecipients: 450,
    sentCount: 445,
    deliveredCount: 420,
    readCount: 320,
    failedCount: 5,
    totalCost: 67.50,
    createdBy: 'Marketing Team',
    createdDate: '2024-01-08T00:00:00Z'
  },
  {
    id: '2',
    name: 'Vaccination Drive Notification',
    description: 'COVID-19 booster vaccination drive announcement',
    type: 'whatsapp',
    templateId: '7',
    templateName: 'Vaccination Drive',
    targetAudience: {
      type: 'all-patients',
      criteria: {},
      count: 1200
    },
    status: 'running',
    scheduledTime: '2024-01-15T08:00:00Z',
    startTime: '2024-01-15T08:00:00Z',
    totalRecipients: 1200,
    sentCount: 856,
    deliveredCount: 834,
    readCount: 523,
    failedCount: 22,
    totalCost: 128.40,
    createdBy: 'Admin',
    createdDate: '2024-01-14T00:00:00Z'
  },
  {
    id: '3',
    name: 'Cardiology Department Promotion',
    description: 'New cardiology services and specialist announcement',
    type: 'email',
    templateId: '8',
    templateName: 'Cardiology Services',
    targetAudience: {
      type: 'department',
      criteria: { department: 'Cardiology', isExistingPatient: true },
      count: 180
    },
    status: 'scheduled',
    scheduledTime: '2024-01-18T10:00:00Z',
    totalRecipients: 180,
    sentCount: 0,
    deliveredCount: 0,
    readCount: 0,
    failedCount: 0,
    totalCost: 9.00,
    createdBy: 'Marketing Team',
    createdDate: '2024-01-15T00:00:00Z'
  }
];

const CommunicationsManagement = () => {
  // State management
  const [activeTab, setActiveTab] = useState<string>('messages');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<CommunicationTemplate | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<CommunicationMessage | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<CommunicationCampaign | null>(null);

  // Modal states
  const [messageDetailOpened, { open: openMessageDetail, close: closeMessageDetail }] = useDisclosure(false);
  const [newMessageOpened, { open: openNewMessage, close: closeNewMessage }] = useDisclosure(false);
  const [templateDetailOpened, { open: openTemplateDetail, close: closeTemplateDetail }] = useDisclosure(false);
  const [newTemplateOpened, { open: openNewTemplate, close: closeNewTemplate }] = useDisclosure(false);
  const [campaignDetailOpened, { open: openCampaignDetail, close: closeCampaignDetail }] = useDisclosure(false);
  const [newCampaignOpened, { open: openNewCampaign, close: closeNewCampaign }] = useDisclosure(false);

  // Filter messages
  const filteredMessages = useMemo(() => {
    return mockMessages.filter((message) => {
      const matchesSearch = 
        message.recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (message.templateName && message.templateName.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = !selectedType || message.type === selectedType;
      const matchesStatus = !selectedStatus || message.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchQuery, selectedType, selectedStatus]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return mockTemplates.filter((template) => {
      const matchesSearch = 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = !selectedType || template.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [searchQuery, selectedType]);

  const handleViewMessage = (message: CommunicationMessage) => {
    setSelectedMessage(message);
    openMessageDetail();
  };

  const handleViewTemplate = (template: CommunicationTemplate) => {
    setSelectedTemplate(template);
    openTemplateDetail();
  };

  const handleViewCampaign = (campaign: CommunicationCampaign) => {
    setSelectedCampaign(campaign);
    openCampaignDetail();
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
      case 'sent': return 'blue';
      case 'delivered': return 'green';
      case 'read': return 'teal';
      case 'pending': return 'yellow';
      case 'scheduled': return 'purple';
      case 'failed': return 'red';
      case 'running': return 'blue';
      case 'completed': return 'green';
      case 'paused': return 'orange';
      case 'draft': return 'gray';
      default: return 'gray';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sms': return <IconDeviceMobile size={16} />;
      case 'whatsapp': return <IconBrandWhatsapp size={16} />;
      case 'email': return <IconMail size={16} />;
      case 'push': return <IconBell size={16} />;
      case 'voice': return <IconPhoneCall size={16} />;
      default: return <IconMessage size={16} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  // Communication stats
  const communicationStats = {
    totalMessages: mockMessages.length,
    sentMessages: mockMessages.filter(m => m.status === 'sent' || m.status === 'delivered' || m.status === 'read').length,
    pendingMessages: mockMessages.filter(m => m.status === 'pending' || m.status === 'scheduled').length,
    failedMessages: mockMessages.filter(m => m.status === 'failed').length,
    totalTemplates: mockTemplates.length,
    activeTemplates: mockTemplates.filter(t => t.isActive).length,
    totalCampaigns: mockCampaigns.length,
    activeCampaigns: mockCampaigns.filter(c => c.status === 'running' || c.status === 'scheduled').length
  };

  return (
    <Container size="xl" py="md">
      {/* Header */}
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={1}>Communications Center</Title>
          <Text c="dimmed" size="sm">
            Manage SMS, WhatsApp, email, and push notifications
          </Text>
        </div>
        <Group>
          <Button variant="light" leftSection={<IconRefresh size={16} />}>
            Refresh Status
          </Button>
          <Button leftSection={<IconPlus size={16} />} onClick={openNewMessage}>
            Send Message
          </Button>
        </Group>
      </Group>

      {/* Quick Stats */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4, lg: 8 }} mb="lg" spacing="sm">
        <Card padding="md" radius="md" withBorder>
          <Group justify="center">
            <ThemeIcon color="blue" size="lg" radius="md" variant="light">
              <IconMessage size={20} />
            </ThemeIcon>
            <div>
              <Text size="lg" fw={700}>{communicationStats.totalMessages}</Text>
              <Text size="xs" c="dimmed">Total Messages</Text>
            </div>
          </Group>
        </Card>

        <Card padding="md" radius="md" withBorder>
          <Group justify="center">
            <ThemeIcon color="green" size="lg" radius="md" variant="light">
              <IconSend size={20} />
            </ThemeIcon>
            <div>
              <Text size="lg" fw={700}>{communicationStats.sentMessages}</Text>
              <Text size="xs" c="dimmed">Sent</Text>
            </div>
          </Group>
        </Card>

        <Card padding="md" radius="md" withBorder>
          <Group justify="center">
            <ThemeIcon color="yellow" size="lg" radius="md" variant="light">
              <IconClockHour4 size={20} />
            </ThemeIcon>
            <div>
              <Text size="lg" fw={700}>{communicationStats.pendingMessages}</Text>
              <Text size="xs" c="dimmed">Pending</Text>
            </div>
          </Group>
        </Card>

        <Card padding="md" radius="md" withBorder>
          <Group justify="center">
            <ThemeIcon color="red" size="lg" radius="md" variant="light">
              <IconX size={20} />
            </ThemeIcon>
            <div>
              <Text size="lg" fw={700}>{communicationStats.failedMessages}</Text>
              <Text size="xs" c="dimmed">Failed</Text>
            </div>
          </Group>
        </Card>

        <Card padding="md" radius="md" withBorder>
          <Group justify="center">
            <ThemeIcon color="purple" size="lg" radius="md" variant="light">
              <IconTemplate size={20} />
            </ThemeIcon>
            <div>
              <Text size="lg" fw={700}>{communicationStats.totalTemplates}</Text>
              <Text size="xs" c="dimmed">Templates</Text>
            </div>
          </Group>
        </Card>

        <Card padding="md" radius="md" withBorder>
          <Group justify="center">
            <ThemeIcon color="teal" size="lg" radius="md" variant="light">
              <IconCheckbox size={20} />
            </ThemeIcon>
            <div>
              <Text size="lg" fw={700}>{communicationStats.activeTemplates}</Text>
              <Text size="xs" c="dimmed">Active</Text>
            </div>
          </Group>
        </Card>

        <Card padding="md" radius="md" withBorder>
          <Group justify="center">
            <ThemeIcon color="cyan" size="lg" radius="md" variant="light">
              <IconTarget size={20} />
            </ThemeIcon>
            <div>
              <Text size="lg" fw={700}>{communicationStats.totalCampaigns}</Text>
              <Text size="xs" c="dimmed">Campaigns</Text>
            </div>
          </Group>
        </Card>

        <Card padding="md" radius="md" withBorder>
          <Group justify="center">
            <ThemeIcon color="orange" size="lg" radius="md" variant="light">
              <IconActivity size={20} />
            </ThemeIcon>
            <div>
              <Text size="lg" fw={700}>{communicationStats.activeCampaigns}</Text>
              <Text size="xs" c="dimmed">Running</Text>
            </div>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="messages" leftSection={<IconMessage size={16} />}>
            Messages
          </Tabs.Tab>
          <Tabs.Tab value="templates" leftSection={<IconTemplate size={16} />}>
            Templates
          </Tabs.Tab>
          <Tabs.Tab value="campaigns" leftSection={<IconTarget size={16} />}>
            Campaigns
          </Tabs.Tab>
          <Tabs.Tab value="settings" leftSection={<IconSettings size={16} />}>
            Settings
          </Tabs.Tab>
          <Tabs.Tab value="analytics" leftSection={<IconChartBar size={16} />}>
            Analytics
          </Tabs.Tab>
        </Tabs.List>

        {/* Messages Tab */}
        <Tabs.Panel value="messages">
          <Paper p="md" radius="md" withBorder mt="md">
            {/* Filters */}
            <Group mb="md">
              <TextInput
                placeholder="Search messages..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                style={{ flex: 1 }}
              />
              <Select
                placeholder="Type"
                data={[
                  { value: 'sms', label: 'SMS' },
                  { value: 'whatsapp', label: 'WhatsApp' },
                  { value: 'email', label: 'Email' },
                  { value: 'push', label: 'Push Notification' },
                  { value: 'voice', label: 'Voice Call' }
                ]}
                value={selectedType}
                onChange={setSelectedType}
                clearable
              />
              <Select
                placeholder="Status"
                data={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'sent', label: 'Sent' },
                  { value: 'delivered', label: 'Delivered' },
                  { value: 'read', label: 'Read' },
                  { value: 'failed', label: 'Failed' },
                  { value: 'scheduled', label: 'Scheduled' }
                ]}
                value={selectedStatus}
                onChange={setSelectedStatus}
                clearable
              />
            </Group>

            {/* Messages Table */}
            <ScrollArea>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Type</Table.Th>
                    <Table.Th>Recipient</Table.Th>
                    <Table.Th>Template</Table.Th>
                    <Table.Th>Content</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Priority</Table.Th>
                    <Table.Th>Sent Time</Table.Th>
                    <Table.Th>Cost</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredMessages.map((message) => (
                    <Table.Tr key={message.id}>
                      <Table.Td>
                        <Group gap="xs">
                          <ThemeIcon size="sm" variant="light">
                            {getTypeIcon(message.type)}
                          </ThemeIcon>
                          <Text size="sm" tt="uppercase">{message.type}</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <div>
                          <Text size="sm" fw={500}>{message.recipient.name}</Text>
                          <Text size="xs" c="dimmed">
                            {message.recipient.phone || message.recipient.email}
                          </Text>
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <div>
                          <Text size="sm" fw={500}>{message.templateName || 'Custom'}</Text>
                          {message.subject && (
                            <Text size="xs" c="dimmed">{message.subject}</Text>
                          )}
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" lineClamp={2} style={{ maxWidth: 200 }}>
                          {message.content}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Badge color={getStatusColor(message.status)} variant="light" size="sm">
                            {message.status.toUpperCase()}
                          </Badge>
                          {message.status === 'pending' && (
                            <Indicator color="orange" size={6} />
                          )}
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getPriorityColor(message.priority)} variant="outline" size="sm">
                          {message.priority.toUpperCase()}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {message.sentTime ? formatDateTime(message.sentTime) : 
                           message.scheduledTime ? `Scheduled: ${formatDateTime(message.scheduledTime)}` : '-'}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" fw={500}>₹{message.cost.toFixed(2)}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => handleViewMessage(message)}
                          >
                            <IconEye size={16} />
                          </ActionIcon>
                          <ActionIcon variant="subtle" color="green">
                            <IconSend size={16} />
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

        {/* Templates Tab */}
        <Tabs.Panel value="templates">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Message Templates</Title>
              <Button leftSection={<IconPlus size={16} />} onClick={openNewTemplate}>
                New Template
              </Button>
            </Group>
            
            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
              {filteredTemplates.map((template) => (
                <Card key={template.id} padding="lg" radius="md" withBorder onClick={() => handleViewTemplate(template)} style={{ cursor: 'pointer' }}>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Group mb="xs">
                        <ThemeIcon size="sm" variant="light">
                          {getTypeIcon(template.type)}
                        </ThemeIcon>
                        <Text fw={600} size="lg">{template.name}</Text>
                      </Group>
                      <Text size="sm" c="dimmed" tt="capitalize">{template.category}</Text>
                    </div>
                    <Group>
                      <Badge color={template.isActive ? 'green' : 'red'} variant="light">
                        {template.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </Badge>
                      <Badge variant="outline" size="sm" tt="uppercase">
                        {template.type}
                      </Badge>
                    </Group>
                  </Group>

                  <Text size="sm" lineClamp={3} mb="md">
                    {template.content}
                  </Text>

                  <Stack gap="xs" mb="md">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Usage Count</Text>
                      <Text size="sm" fw={500}>{template.usageCount}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Variables</Text>
                      <Text size="sm" fw={500}>{template.variables.length}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Last Used</Text>
                      <Text size="sm" fw={500}>
                        {template.lastUsed ? formatDate(template.lastUsed) : 'Never'}
                      </Text>
                    </Group>
                  </Stack>

                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">
                      Created: {formatDate(template.createdDate)}
                    </Text>
                    <Group gap="xs">
                      <ActionIcon variant="subtle" color="blue">
                        <IconEye size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="green">
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="orange">
                        <IconSend size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>

        {/* Campaigns Tab */}
        <Tabs.Panel value="campaigns">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Communication Campaigns</Title>
              <Button leftSection={<IconPlus size={16} />} onClick={openNewCampaign}>
                New Campaign
              </Button>
            </Group>
            
            <Stack gap="lg">
              {mockCampaigns.map((campaign) => (
                <Card key={campaign.id} padding="lg" radius="md" withBorder onClick={() => handleViewCampaign(campaign)} style={{ cursor: 'pointer' }}>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Title order={4}>{campaign.name}</Title>
                      <Text c="dimmed" size="sm">{campaign.description}</Text>
                    </div>
                    <Group>
                      <Badge color={getStatusColor(campaign.status)} variant="light" size="lg">
                        {campaign.status.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" tt="uppercase">
                        {campaign.type}
                      </Badge>
                    </Group>
                  </Group>

                  <SimpleGrid cols={6} spacing="md" mb="md">
                    <div style={{ textAlign: 'center' }}>
                      <Text size="xl" fw={700} c="blue">{campaign.totalRecipients}</Text>
                      <Text size="xs" c="dimmed">Total Recipients</Text>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <Text size="xl" fw={700} c="green">{campaign.sentCount}</Text>
                      <Text size="xs" c="dimmed">Sent</Text>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <Text size="xl" fw={700} c="teal">{campaign.deliveredCount}</Text>
                      <Text size="xs" c="dimmed">Delivered</Text>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <Text size="xl" fw={700} c="cyan">{campaign.readCount}</Text>
                      <Text size="xs" c="dimmed">Read</Text>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <Text size="xl" fw={700} c="red">{campaign.failedCount}</Text>
                      <Text size="xs" c="dimmed">Failed</Text>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <Text size="xl" fw={700} c="orange">₹{campaign.totalCost.toFixed(2)}</Text>
                      <Text size="xs" c="dimmed">Total Cost</Text>
                    </div>
                  </SimpleGrid>

                  {campaign.status === 'running' && campaign.sentCount > 0 && (
                    <div className="mb-md">
                      <Text size="sm" c="dimmed" mb="xs">Campaign Progress</Text>
                      <Progress 
                        value={(campaign.sentCount / campaign.totalRecipients) * 100} 
                        size="lg" 
                        color="blue"
                      />
                      <Group justify="space-between" mt="xs">
                        <Text size="xs" c="dimmed">
                          {Math.round((campaign.sentCount / campaign.totalRecipients) * 100)}% completed
                        </Text>
                        <Text size="xs" c="dimmed">
                          {campaign.totalRecipients - campaign.sentCount} remaining
                        </Text>
                      </Group>
                    </div>
                  )}

                  <Group justify="space-between">
                    <div>
                      <Text size="sm" c="dimmed">
                        Template: {campaign.templateName}
                      </Text>
                      <Text size="sm" c="dimmed">
                        Target: {campaign.targetAudience.type.replace('-', ' ')} ({campaign.targetAudience.count} recipients)
                      </Text>
                    </div>
                    <Group gap="xs">
                      <ActionIcon variant="subtle" color="blue">
                        <IconEye size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="green">
                        <IconEdit size={16} />
                      </ActionIcon>
                      {campaign.status === 'running' && (
                        <ActionIcon variant="subtle" color="orange">
                          <IconClockPause size={16} />
                        </ActionIcon>
                      )}
                    </Group>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Paper>
        </Tabs.Panel>

        {/* Settings Tab */}
        <Tabs.Panel value="settings">
          <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg" mt="md">
            {/* Channel Settings */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">Channel Configuration</Title>
              <Stack gap="md">
                <Group justify="space-between">
                  <Group>
                    <IconDeviceMobile size={20} />
                    <Text>SMS Service</Text>
                  </Group>
                  <Switch defaultChecked />
                </Group>
                <Group justify="space-between">
                  <Group>
                    <IconBrandWhatsapp size={20} />
                    <Text>WhatsApp Business</Text>
                  </Group>
                  <Switch defaultChecked />
                </Group>
                <Group justify="space-between">
                  <Group>
                    <IconMail size={20} />
                    <Text>Email Service</Text>
                  </Group>
                  <Switch defaultChecked />
                </Group>
                <Group justify="space-between">
                  <Group>
                    <IconBell size={20} />
                    <Text>Push Notifications</Text>
                  </Group>
                  <Switch />
                </Group>
                <Group justify="space-between">
                  <Group>
                    <IconPhoneCall size={20} />
                    <Text>Voice Calls</Text>
                  </Group>
                  <Switch />
                </Group>
              </Stack>
            </Card>

            {/* API Settings */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">API Configuration</Title>
              <Stack gap="md">
                <TextInput
                  label="SMS Gateway API Key"
                  placeholder="Enter API key"
                  type="password"
                />
                <TextInput
                  label="WhatsApp Business API Token"
                  placeholder="Enter API token"
                  type="password"
                />
                <TextInput
                  label="Email SMTP Server"
                  placeholder="smtp.gmail.com"
                />
                <Group grow>
                  <TextInput
                    label="SMTP Username"
                    placeholder="username@domain.com"
                  />
                  <TextInput
                    label="SMTP Password"
                    placeholder="Enter password"
                    type="password"
                  />
                </Group>
                <Button variant="light" fullWidth>
                  Test Configuration
                </Button>
              </Stack>
            </Card>

            {/* Rate Limiting */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">Rate Limiting</Title>
              <Stack gap="md">
                <NumberInput
                  label="SMS per minute"
                  placeholder="100"
                  defaultValue={100}
                  min={1}
                  max={1000}
                />
                <NumberInput
                  label="WhatsApp per minute"
                  placeholder="50"
                  defaultValue={50}
                  min={1}
                  max={500}
                />
                <NumberInput
                  label="Emails per minute"
                  placeholder="20"
                  defaultValue={20}
                  min={1}
                  max={100}
                />
                <Alert icon={<IconAlertCircle size="1rem" />} title="Rate Limiting Info">
                  Rate limits help prevent service provider restrictions and ensure reliable message delivery.
                </Alert>
              </Stack>
            </Card>

            {/* Notification Preferences */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">System Notifications</Title>
              <Stack gap="md">
                <Group justify="space-between">
                  <Text size="sm">Failed message alerts</Text>
                  <Switch defaultChecked />
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Campaign completion</Text>
                  <Switch defaultChecked />
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Template usage reports</Text>
                  <Switch />
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Cost threshold alerts</Text>
                  <Switch defaultChecked />
                </Group>
                <NumberInput
                  label="Daily cost limit (₹)"
                  placeholder="1000"
                  defaultValue={1000}
                  min={0}
                />
              </Stack>
            </Card>
          </SimpleGrid>
        </Tabs.Panel>

        {/* Analytics Tab */}
        <Tabs.Panel value="analytics">
          <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg" mt="md">
            {/* Message Type Distribution */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">Message Type Distribution</Title>
              <PieChart
                data={[
                  { name: 'SMS', value: 2, color: 'blue' },
                  { name: 'WhatsApp', value: 2, color: 'green' },
                  { name: 'Email', value: 1, color: 'orange' }
                ]}
                size={200}
                withLabels
              />
            </Card>

            {/* Delivery Status */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">Delivery Status Overview</Title>
              <DonutChart
                data={[
                  { name: 'Delivered', value: 2, color: 'green' },
                  { name: 'Read', value: 1, color: 'teal' },
                  { name: 'Sent', value: 1, color: 'blue' },
                  { name: 'Pending', value: 1, color: 'yellow' }
                ]}
                size={200}
                thickness={40}
                withLabels
              />
            </Card>

            {/* Daily Message Trends */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">Daily Message Volume</Title>
              <LineChart
                h={200}
                data={[
                  { date: 'Mon', sms: 45, whatsapp: 32, email: 18 },
                  { date: 'Tue', sms: 52, whatsapp: 41, email: 22 },
                  { date: 'Wed', sms: 38, whatsapp: 28, email: 15 },
                  { date: 'Thu', sms: 61, whatsapp: 48, email: 31 },
                  { date: 'Fri', sms: 55, whatsapp: 43, email: 28 },
                  { date: 'Sat', sms: 29, whatsapp: 22, email: 12 },
                  { date: 'Sun', sms: 33, whatsapp: 25, email: 14 }
                ]}
                dataKey="date"
                series={[
                  { name: 'sms', color: 'blue.6' },
                  { name: 'whatsapp', color: 'green.6' },
                  { name: 'email', color: 'orange.6' }
                ]}
                curveType="linear"
              />
            </Card>

            {/* Cost Analysis */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">Monthly Communication Costs</Title>
              <AreaChart
                h={200}
                data={[
                  { month: 'Jan', sms: 156.50, whatsapp: 89.30, email: 12.80 },
                  { month: 'Feb', sms: 178.20, whatsapp: 102.45, email: 15.60 },
                  { month: 'Mar', sms: 134.80, whatsapp: 76.20, email: 10.40 },
                  { month: 'Apr', sms: 201.30, whatsapp: 118.75, email: 18.90 },
                  { month: 'May', sms: 189.45, whatsapp: 112.30, email: 16.50 },
                  { month: 'Jun', sms: 167.90, whatsapp: 95.80, email: 14.20 }
                ]}
                dataKey="month"
                series={[
                  { name: 'sms', color: 'blue.6' },
                  { name: 'whatsapp', color: 'green.6' },
                  { name: 'email', color: 'orange.6' }
                ]}
                curveType="bump"
              />
            </Card>
          </SimpleGrid>
        </Tabs.Panel>
      </Tabs>

      {/* Message Detail Modal */}
      <Modal
        opened={messageDetailOpened}
        onClose={closeMessageDetail}
        title="Message Details"
        size="lg"
      >
        {selectedMessage && (
          <Stack gap="md">
            {/* Message Header */}
            <Group justify="space-between" mb="md">
              <div>
                <Group mb="xs">
                  <ThemeIcon variant="light">
                    {getTypeIcon(selectedMessage.type)}
                  </ThemeIcon>
                  <Title order={4}>{selectedMessage.type.toUpperCase()} Message</Title>
                </Group>
                <Text c="dimmed">To: {selectedMessage.recipient.name}</Text>
              </div>
              <Group>
                <Badge color={getStatusColor(selectedMessage.status)} variant="light" size="lg">
                  {selectedMessage.status.toUpperCase()}
                </Badge>
                <Badge color={getPriorityColor(selectedMessage.priority)} variant="outline">
                  {selectedMessage.priority.toUpperCase()}
                </Badge>
              </Group>
            </Group>

            {/* Message Content */}
            <Paper p="md" radius="md" withBorder>
              {selectedMessage.subject && (
                <div>
                  <Text size="sm" c="dimmed" fw={500}>Subject</Text>
                  <Text fw={600} mb="md">{selectedMessage.subject}</Text>
                </div>
              )}
              <Text size="sm" c="dimmed" fw={500}>Content</Text>
              <Text mt="xs">{selectedMessage.content}</Text>
            </Paper>

            {/* Message Timeline */}
            <Paper p="md" radius="md" withBorder>
              <Title order={5} mb="md">Message Timeline</Title>
              <Timeline bulletSize={20} lineWidth={2}>
                {selectedMessage.scheduledTime && (
                  <Timeline.Item bullet={<IconCalendar size={12} />} title="Scheduled">
                    <Text c="dimmed" size="sm">Message scheduled for delivery</Text>
                    <Text size="xs" mt={4}>{formatDateTime(selectedMessage.scheduledTime)}</Text>
                  </Timeline.Item>
                )}
                {selectedMessage.sentTime && (
                  <Timeline.Item bullet={<IconSend size={12} />} title="Sent" color="blue">
                    <Text c="dimmed" size="sm">Message sent to recipient</Text>
                    <Text size="xs" mt={4}>{formatDateTime(selectedMessage.sentTime)}</Text>
                  </Timeline.Item>
                )}
                {selectedMessage.deliveredTime && (
                  <Timeline.Item bullet={<IconCheck size={12} />} title="Delivered" color="green">
                    <Text c="dimmed" size="sm">Message delivered successfully</Text>
                    <Text size="xs" mt={4}>{formatDateTime(selectedMessage.deliveredTime)}</Text>
                  </Timeline.Item>
                )}
                {selectedMessage.readTime && (
                  <Timeline.Item bullet={<IconEye size={12} />} title="Read" color="teal">
                    <Text c="dimmed" size="sm">Message read by recipient</Text>
                    <Text size="xs" mt={4}>{formatDateTime(selectedMessage.readTime)}</Text>
                  </Timeline.Item>
                )}
              </Timeline>
            </Paper>

            {/* Message Stats */}
            <SimpleGrid cols={4} spacing="md">
              <div style={{ textAlign: 'center' }}>
                <Text size="lg" fw={700}>{selectedMessage.attempts}</Text>
                <Text size="sm" c="dimmed">Attempts</Text>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Text size="lg" fw={700}>₹{selectedMessage.cost.toFixed(2)}</Text>
                <Text size="sm" c="dimmed">Cost</Text>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Text size="lg" fw={700}>{selectedMessage.recipient.phone || selectedMessage.recipient.email}</Text>
                <Text size="sm" c="dimmed">Contact</Text>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Text size="lg" fw={700} tt="capitalize">{selectedMessage.recipient.type}</Text>
                <Text size="sm" c="dimmed">Recipient Type</Text>
              </div>
            </SimpleGrid>

            {/* Action Buttons */}
            <Group justify="flex-end">
              <Button variant="light" onClick={closeMessageDetail}>
                Close
              </Button>
              {selectedMessage.status === 'failed' && (
                <Button leftSection={<IconRefresh size={16} />}>
                  Retry Send
                </Button>
              )}
            </Group>
          </Stack>
        )}
      </Modal>

      {/* New Message Modal */}
      <Modal
        opened={newMessageOpened}
        onClose={closeNewMessage}
        title="Send New Message"
        size="lg"
      >
        <Stack gap="md">
          <SimpleGrid cols={2} spacing="md">
            <Select
              label="Message Type"
              placeholder="Select type"
              data={[
                { value: 'sms', label: 'SMS' },
                { value: 'whatsapp', label: 'WhatsApp' },
                { value: 'email', label: 'Email' },
                { value: 'push', label: 'Push Notification' }
              ]}
              required
            />
            <Select
              label="Template"
              placeholder="Select template (optional)"
              data={mockTemplates.map(t => ({ value: t.id, label: t.name }))}
              searchable
              clearable
            />
          </SimpleGrid>

          <MultiSelect
            label="Recipients"
            placeholder="Select recipients"
            data={[
              { value: 'P001', label: 'Rajesh Kumar - Patient' },
              { value: 'P002', label: 'Sunita Patel - Patient' },
              { value: 'D001', label: 'Dr. Sharma - Doctor' },
              { value: 'ALL_PATIENTS', label: 'All Patients' },
              { value: 'ICU_STAFF', label: 'ICU Staff' }
            ]}
            searchable
            required
          />

          <TextInput
            label="Subject (Email only)"
            placeholder="Enter subject"
          />

          <Textarea
            label="Message Content"
            placeholder="Enter your message..."
            minRows={4}
            required
          />

          <SimpleGrid cols={2} spacing="md">
            <Select
              label="Priority"
              placeholder="Select priority"
              data={[
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' }
              ]}
              defaultValue="medium"
              required
            />
            <DatePickerInput
              label="Schedule Send Time (Optional)"
              placeholder="Select date and time"
            />
          </SimpleGrid>

          <Group justify="flex-end">
            <Button variant="light" onClick={closeNewMessage}>
              Cancel
            </Button>
            <Button leftSection={<IconSend size={16} />} onClick={() => {
              notifications.show({
                title: 'Message Sent',
                message: 'Your message has been sent successfully',
                color: 'green',
              });
              closeNewMessage();
            }}>
              Send Message
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default CommunicationsManagement;