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
  Notification,
  Loader,
  Anchor,
  Accordion,
  Tooltip,
  Rating,
  Spoiler
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
  IconBookmark,
  IconBrain,
  IconMoodSmile,
  IconFlask,
  IconDna,
  IconMicroscope,
  IconX_ray,
  IconHeartbeat,
  IconBone,
  IconVaccine,
  IconPrescription,
  IconMedicine,
  IconAmbulance,
  IconFirstAidKit,
  IconMoodCheck,
  IconZoom,
  IconQuestionMark,
  IconInfoCircle,
  IconShield,
  IconChartDots,
  IconTrendingUp3,
  IconSparkles,
  IconWand,
  IconMagic,
  IconCpu,
  IconChip,
  IconNetwork
} from '@/shims/tabler-icons';

// Types
interface AIInsight {
  id: string;
  type: 'diagnosis' | 'treatment' | 'drug-interaction' | 'risk-assessment' | 'recommendation' | 'alert';
  title: string;
  description: string;
  confidence: number; // 0-100
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'clinical' | 'medication' | 'diagnostic' | 'preventive' | 'emergency';
  patientId?: string;
  patientName?: string;
  generatedBy: string; // AI model name
  generatedDate: string;
  reviewedBy?: string;
  reviewedDate?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected' | 'implemented';
  evidence: Array<{
    source: string;
    relevance: number;
    description: string;
  }>;
  recommendations: Array<{
    action: string;
    priority: 'low' | 'medium' | 'high';
    timeframe: string;
  }>;
  metadata: {
    symptoms?: string[];
    vitals?: Record<string, any>;
    labResults?: Record<string, any>;
    medications?: string[];
    allergies?: string[];
  };
}

interface AIQuery {
  id: string;
  question: string;
  context: {
    patientId?: string;
    symptoms?: string[];
    vitals?: Record<string, any>;
    history?: string[];
  };
  response: string;
  confidence: number;
  model: string;
  timestamp: string;
  userId: string;
  userName: string;
  category: 'diagnosis' | 'treatment' | 'medication' | 'general' | 'emergency';
  feedback?: {
    rating: number;
    helpful: boolean;
    comments?: string;
  };
}

interface ClinicalGuideline {
  id: string;
  title: string;
  category: 'diagnosis' | 'treatment' | 'prevention' | 'emergency';
  condition: string;
  description: string;
  recommendations: Array<{
    level: 'A' | 'B' | 'C';
    strength: 'strong' | 'moderate' | 'weak';
    recommendation: string;
    evidence: string;
  }>;
  lastUpdated: string;
  source: string;
  version: string;
  applicability: string[];
}

interface DrugInteraction {
  id: string;
  drug1: string;
  drug2: string;
  interactionType: 'major' | 'moderate' | 'minor';
  mechanism: string;
  clinicalEffect: string;
  recommendation: string;
  frequency: 'common' | 'uncommon' | 'rare';
  onset: 'rapid' | 'delayed';
  severity: 'severe' | 'moderate' | 'mild';
  documentation: 'excellent' | 'good' | 'fair' | 'poor';
}

interface MedicalKnowledgeBase {
  id: string;
  title: string;
  category: 'disease' | 'symptom' | 'procedure' | 'medication' | 'anatomy';
  content: string;
  tags: string[];
  lastUpdated: string;
  references: Array<{
    title: string;
    authors: string[];
    journal: string;
    year: number;
    doi?: string;
  }>;
}

// Mock data
const mockAIInsights: AIInsight[] = [
  {
    id: '1',
    type: 'diagnosis',
    title: 'Possible Acute Coronary Syndrome',
    description: 'Based on presenting symptoms (chest pain, shortness of breath) and elevated troponin levels, there is a high probability of acute coronary syndrome. Immediate cardiology consultation recommended.',
    confidence: 87,
    severity: 'critical',
    category: 'clinical',
    patientId: 'P2024001',
    patientName: 'Rajesh Kumar',
    generatedBy: 'MedAI-Clinical v2.1',
    generatedDate: '2024-01-15T10:30:00Z',
    reviewedBy: 'Dr. Sharma',
    reviewedDate: '2024-01-15T10:45:00Z',
    status: 'accepted',
    evidence: [
      {
        source: 'Clinical symptoms analysis',
        relevance: 95,
        description: 'Typical chest pain presentation with radiation to left arm'
      },
      {
        source: 'Laboratory results',
        relevance: 88,
        description: 'Elevated troponin I levels (0.8 ng/mL, normal <0.04)'
      },
      {
        source: 'Vital signs assessment',
        relevance: 75,
        description: 'Elevated heart rate and blood pressure'
      }
    ],
    recommendations: [
      {
        action: 'Immediate cardiology consultation',
        priority: 'high',
        timeframe: 'Within 30 minutes'
      },
      {
        action: 'Serial ECG monitoring',
        priority: 'high',
        timeframe: 'Every 15 minutes'
      },
      {
        action: 'Antiplatelet therapy initiation',
        priority: 'medium',
        timeframe: 'After cardiology clearance'
      }
    ],
    metadata: {
      symptoms: ['chest pain', 'shortness of breath', 'left arm pain'],
      vitals: { bp: '150/95', hr: 110, temp: 98.6 },
      labResults: { troponinI: 0.8, ck_mb: 12.5 }
    }
  },
  {
    id: '2',
    type: 'drug-interaction',
    title: 'Major Drug Interaction Alert',
    description: 'Warfarin and Aspirin combination may significantly increase bleeding risk. Consider dose adjustment or alternative anticoagulation strategy.',
    confidence: 94,
    severity: 'high',
    category: 'medication',
    patientId: 'P2024002',
    patientName: 'Sunita Patel',
    generatedBy: 'DrugSafe-AI v1.8',
    generatedDate: '2024-01-15T14:20:00Z',
    status: 'pending',
    evidence: [
      {
        source: 'Drug interaction database',
        relevance: 98,
        description: 'Well-documented major interaction between warfarin and aspirin'
      },
      {
        source: 'Patient bleeding risk factors',
        relevance: 82,
        description: 'Age >65, history of GI bleeding'
      }
    ],
    recommendations: [
      {
        action: 'Review anticoagulation strategy',
        priority: 'high',
        timeframe: 'Before next dose'
      },
      {
        action: 'Monitor INR more frequently',
        priority: 'medium',
        timeframe: 'Every 3 days'
      }
    ],
    metadata: {
      medications: ['warfarin 5mg', 'aspirin 81mg'],
      allergies: []
    }
  },
  {
    id: '3',
    type: 'risk-assessment',
    title: 'High Fall Risk Identified',
    description: 'Patient presents multiple fall risk factors including advanced age, polypharmacy, and recent orthostatic hypotension. Fall prevention measures recommended.',
    confidence: 78,
    severity: 'medium',
    category: 'preventive',
    patientId: 'P2024003',
    patientName: 'Mohammed Ali',
    generatedBy: 'RiskAssess-AI v1.5',
    generatedDate: '2024-01-15T16:15:00Z',
    status: 'reviewed',
    evidence: [
      {
        source: 'MORSE Fall Scale assessment',
        relevance: 85,
        description: 'Score of 55 indicates high fall risk'
      },
      {
        source: 'Medication review',
        relevance: 72,
        description: 'Currently on 6 medications including sedatives'
      }
    ],
    recommendations: [
      {
        action: 'Implement fall precautions protocol',
        priority: 'high',
        timeframe: 'Immediately'
      },
      {
        action: 'Physical therapy consultation',
        priority: 'medium',
        timeframe: 'Within 24 hours'
      },
      {
        action: 'Medication review for dose optimization',
        priority: 'medium',
        timeframe: 'Within 48 hours'
      }
    ],
    metadata: {
      symptoms: ['dizziness', 'unsteady gait'],
      vitals: { bp_standing: '110/70', bp_sitting: '130/85' },
      medications: ['metformin', 'lisinopril', 'atorvastatin', 'tramadol', 'lorazepam', 'omeprazole']
    }
  }
];

const mockAIQueries: AIQuery[] = [
  {
    id: '1',
    question: 'What are the differential diagnoses for chest pain in a 45-year-old male with diabetes?',
    context: {
      patientId: 'P2024001',
      symptoms: ['chest pain', 'shortness of breath'],
      history: ['diabetes mellitus', 'hypertension']
    },
    response: 'For a 45-year-old diabetic male presenting with chest pain, the differential diagnoses should include:\n\n1. **Acute Coronary Syndrome** (highest priority)\n   - Myocardial infarction\n   - Unstable angina\n   - Diabetics may have atypical presentations\n\n2. **Pulmonary causes**\n   - Pulmonary embolism\n   - Pneumonia\n   - Pneumothorax\n\n3. **Gastrointestinal causes**\n   - GERD\n   - Esophageal spasm\n   - Peptic ulcer disease\n\n4. **Musculoskeletal causes**\n   - Costochondritis\n   - Muscle strain\n\nGiven the diabetes history, cardiac causes should be prioritized. Recommend immediate ECG, cardiac enzymes, and chest X-ray.',
    confidence: 92,
    model: 'MedAI-Clinical v2.1',
    timestamp: '2024-01-15T10:15:00Z',
    userId: 'D001',
    userName: 'Dr. Sharma',
    category: 'diagnosis',
    feedback: {
      rating: 5,
      helpful: true,
      comments: 'Very comprehensive and practical response'
    }
  },
  {
    id: '2',
    question: 'What is the recommended antibiotic for community-acquired pneumonia in elderly patients?',
    context: {},
    response: 'For community-acquired pneumonia (CAP) in elderly patients, the treatment approach should consider:\n\n**First-line treatments:**\n1. **Amoxicillin/Clavulanate** 875/125 mg BID for 7-10 days\n2. **Ceftriaxone** 1-2g IV daily (if hospitalized)\n\n**Alternative options:**\n- **Levofloxacin** 750mg daily for 5 days (respiratory fluoroquinolone)\n- **Azithromycin** + **Amoxicillin** (combination therapy)\n\n**Special considerations for elderly:**\n- Adjust doses for renal function\n- Consider drug interactions with existing medications\n- Monitor for C. difficile risk with broader spectrum antibiotics\n- Higher risk for atypical pathogens (Legionella, Mycoplasma)\n\n**Severity assessment:** Use CURB-65 or PSI to guide inpatient vs outpatient management.',
    confidence: 89,
    model: 'MedAI-Clinical v2.1',
    timestamp: '2024-01-15T11:30:00Z',
    userId: 'D002',
    userName: 'Dr. Reddy',
    category: 'treatment',
    feedback: {
      rating: 4,
      helpful: true
    }
  },
  {
    id: '3',
    question: 'Can metformin and contrast dye be given together safely?',
    context: {
      symptoms: ['scheduled for CT with contrast']
    },
    response: 'Metformin and iodinated contrast media interaction requires careful management:\n\n**Key Concerns:**\n- Risk of contrast-induced nephropathy (CIN)\n- Potential for lactic acidosis if kidney function deteriorates\n\n**Current Guidelines:**\n1. **eGFR ≥30 mL/min/1.73m²**: Continue metformin, no need to hold\n2. **eGFR <30 mL/min/1.73m²**: Hold metformin 48 hours before contrast\n\n**Post-contrast management:**\n- Check creatinine 48-72 hours post-contrast\n- Restart metformin only if creatinine stable/improved\n- Ensure adequate hydration\n\n**Important:** Recent guidelines (2020) are less restrictive than previous recommendations, focusing on actual kidney function rather than blanket holds.\n\n**Patient counseling:** Explain the rationale and importance of follow-up labs.',
    confidence: 94,
    model: 'DrugSafe-AI v1.8',
    timestamp: '2024-01-15T13:45:00Z',
    userId: 'D003',
    userName: 'Dr. Singh',
    category: 'medication'
  }
];

const mockClinicalGuidelines: ClinicalGuideline[] = [
  {
    id: '1',
    title: 'Management of Acute Coronary Syndromes',
    category: 'treatment',
    condition: 'Acute Coronary Syndrome',
    description: 'Evidence-based guidelines for the diagnosis and management of acute coronary syndromes including STEMI, NSTEMI, and unstable angina.',
    recommendations: [
      {
        level: 'A',
        strength: 'strong',
        recommendation: 'Administer dual antiplatelet therapy (aspirin + P2Y12 inhibitor) to all patients with ACS unless contraindicated',
        evidence: 'Multiple large randomized controlled trials demonstrate significant reduction in cardiovascular events'
      },
      {
        level: 'A',
        strength: 'strong',
        recommendation: 'Perform primary PCI within 90 minutes for STEMI patients presenting to PCI-capable centers',
        evidence: 'Time-dependent mortality benefit demonstrated in large registry studies'
      },
      {
        level: 'B',
        strength: 'moderate',
        recommendation: 'Consider high-intensity statin therapy in all ACS patients',
        evidence: 'Observational studies show improved outcomes with early statin initiation'
      }
    ],
    lastUpdated: '2024-01-01T00:00:00Z',
    source: 'American Heart Association',
    version: '2024.1',
    applicability: ['Emergency Medicine', 'Cardiology', 'Internal Medicine']
  },
  {
    id: '2',
    title: 'Antibiotic Stewardship in Community-Acquired Pneumonia',
    category: 'treatment',
    condition: 'Community-Acquired Pneumonia',
    description: 'Guidelines for appropriate antibiotic selection and duration in community-acquired pneumonia.',
    recommendations: [
      {
        level: 'A',
        strength: 'strong',
        recommendation: 'Use severity assessment tools (CURB-65, PSI) to guide treatment location and antibiotic choice',
        evidence: 'Validated prediction rules improve patient outcomes and resource utilization'
      },
      {
        level: 'A',
        strength: 'strong',
        recommendation: 'Limit antibiotic duration to 5-7 days for uncomplicated CAP with good clinical response',
        evidence: 'Non-inferiority trials show shorter courses are as effective as longer durations'
      }
    ],
    lastUpdated: '2023-12-15T00:00:00Z',
    source: 'Infectious Diseases Society of America',
    version: '2023.2',
    applicability: ['Internal Medicine', 'Emergency Medicine', 'Pulmonology']
  }
];

const mockDrugInteractions: DrugInteraction[] = [
  {
    id: '1',
    drug1: 'Warfarin',
    drug2: 'Aspirin',
    interactionType: 'major',
    mechanism: 'Pharmacodynamic synergism',
    clinicalEffect: 'Increased risk of bleeding due to additive antiplatelet and anticoagulant effects',
    recommendation: 'Monitor INR more frequently. Consider gastroprotection with PPI. Assess bleeding risk vs. thrombotic risk.',
    frequency: 'common',
    onset: 'delayed',
    severity: 'severe',
    documentation: 'excellent'
  },
  {
    id: '2',
    drug1: 'Metformin',
    drug2: 'Iodinated Contrast',
    interactionType: 'moderate',
    mechanism: 'Increased risk of lactic acidosis in presence of contrast-induced nephropathy',
    clinicalEffect: 'Potential for lactic acidosis if kidney function deteriorates after contrast exposure',
    recommendation: 'Hold metformin in patients with eGFR <30. Monitor renal function post-contrast. Resume metformin when creatinine stable.',
    frequency: 'uncommon',
    onset: 'delayed',
    severity: 'severe',
    documentation: 'good'
  },
  {
    id: '3',
    drug1: 'Digoxin',
    drug2: 'Amiodarone',
    interactionType: 'major',
    mechanism: 'Amiodarone inhibits P-glycoprotein, reducing digoxin clearance',
    clinicalEffect: 'Significantly increased digoxin levels leading to potential toxicity',
    recommendation: 'Reduce digoxin dose by 50% when starting amiodarone. Monitor digoxin levels closely.',
    frequency: 'common',
    onset: 'delayed',
    severity: 'severe',
    documentation: 'excellent'
  }
];

const AIAssistant = () => {
  // State management
  const [activeTab, setActiveTab] = useState<string>('insights');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('');
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [selectedQuery, setSelectedQuery] = useState<AIQuery | null>(null);
  const [newQuery, setNewQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Modal states
  const [insightDetailOpened, { open: openInsightDetail, close: closeInsightDetail }] = useDisclosure(false);
  const [queryDetailOpened, { open: openQueryDetail, close: closeQueryDetail }] = useDisclosure(false);
  const [askAIOpened, { open: openAskAI, close: closeAskAI }] = useDisclosure(false);
  const [guidelineOpened, { open: openGuideline, close: closeGuideline }] = useDisclosure(false);

  // Filter insights
  const filteredInsights = useMemo(() => {
    return mockAIInsights.filter((insight) => {
      const matchesSearch = 
        insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        insight.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (insight.patientName && insight.patientName.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = !selectedCategory || insight.category === selectedCategory;
      const matchesSeverity = !selectedSeverity || insight.severity === selectedSeverity;

      return matchesSearch && matchesCategory && matchesSeverity;
    });
  }, [searchQuery, selectedCategory, selectedSeverity]);

  // Filter queries
  const filteredQueries = useMemo(() => {
    return mockAIQueries.filter((query) => {
      const matchesSearch = 
        query.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        query.response.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    });
  }, [searchQuery]);

  const handleViewInsight = (insight: AIInsight) => {
    setSelectedInsight(insight);
    openInsightDetail();
  };

  const handleViewQuery = (query: AIQuery) => {
    setSelectedQuery(query);
    openQueryDetail();
  };

  const handleAskAI = async () => {
    if (!newQuery.trim()) return;

    setIsLoading(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsLoading(false);
      notifications.show({
        title: 'AI Response Generated',
        message: 'Your question has been processed and the response is ready',
        color: 'green',
      });
      closeAskAI();
      setNewQuery('');
    }, 3000);
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'diagnosis': return <IconStethoscope size={16} />;
      case 'treatment': return <IconMedicalCross size={16} />;
      case 'drug-interaction': return <IconPill size={16} />;
      case 'risk-assessment': return <IconShield size={16} />;
      case 'recommendation': return <IconBulb size={16} />;
      case 'alert': return <IconAlertTriangle size={16} />;
      default: return <IconBrain size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'green';
      case 'implemented': return 'teal';
      case 'reviewed': return 'blue';
      case 'rejected': return 'red';
      case 'pending': return 'yellow';
      default: return 'gray';
    }
  };

  // AI Assistant stats
  const aiStats = {
    totalInsights: mockAIInsights.length,
    pendingInsights: mockAIInsights.filter(i => i.status === 'pending').length,
    acceptedInsights: mockAIInsights.filter(i => i.status === 'accepted').length,
    criticalInsights: mockAIInsights.filter(i => i.severity === 'critical').length,
    totalQueries: mockAIQueries.length,
    avgConfidence: Math.round(mockAIInsights.reduce((acc, i) => acc + i.confidence, 0) / mockAIInsights.length),
    avgRating: mockAIQueries.filter(q => q.feedback?.rating).reduce((acc, q) => acc + (q.feedback?.rating || 0), 0) / mockAIQueries.filter(q => q.feedback?.rating).length,
    helpfulResponses: mockAIQueries.filter(q => q.feedback?.helpful).length
  };

  return (
    <Container size="xl" py="md">
      {/* Header */}
      <Group justify="space-between" mb="lg">
        <div>
          <Group mb="xs">
            <ThemeIcon color="blue" size="xl" variant="light">
              <IconBrain size={24} />
            </ThemeIcon>
            <div>
              <Title order={1}>AI Clinical Assistant</Title>
              <Text c="dimmed" size="sm">
                Intelligent clinical decision support and medical insights
              </Text>
            </div>
          </Group>
        </div>
        <Group>
          <Button variant="light" leftSection={<IconRefresh size={16} />}>
            Refresh Insights
          </Button>
          <Button leftSection={<IconMessageCircle size={16} />} onClick={openAskAI}>
            Ask AI
          </Button>
        </Group>
      </Group>

      {/* Quick Stats */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4, lg: 8 }} mb="lg" spacing="sm">
        <Card padding="md" radius="md" withBorder>
          <Group justify="center">
            <ThemeIcon color="blue" size="lg" radius="md" variant="light">
              <IconSparkles size={20} />
            </ThemeIcon>
            <div>
              <Text size="lg" fw={700}>{aiStats.totalInsights}</Text>
              <Text size="xs" c="dimmed">AI Insights</Text>
            </div>
          </Group>
        </Card>

        <Card padding="md" radius="md" withBorder>
          <Group justify="center">
            <ThemeIcon color="yellow" size="lg" radius="md" variant="light">
              <IconClockHour4 size={20} />
            </ThemeIcon>
            <div>
              <Text size="lg" fw={700}>{aiStats.pendingInsights}</Text>
              <Text size="xs" c="dimmed">Pending Review</Text>
            </div>
          </Group>
        </Card>

        <Card padding="md" radius="md" withBorder>
          <Group justify="center">
            <ThemeIcon color="green" size="lg" radius="md" variant="light">
              <IconCheck size={20} />
            </ThemeIcon>
            <div>
              <Text size="lg" fw={700}>{aiStats.acceptedInsights}</Text>
              <Text size="xs" c="dimmed">Accepted</Text>
            </div>
          </Group>
        </Card>

        <Card padding="md" radius="md" withBorder>
          <Group justify="center">
            <ThemeIcon color="red" size="lg" radius="md" variant="light">
              <IconAlertTriangle size={20} />
            </ThemeIcon>
            <div>
              <Text size="lg" fw={700}>{aiStats.criticalInsights}</Text>
              <Text size="xs" c="dimmed">Critical</Text>
            </div>
          </Group>
        </Card>

        <Card padding="md" radius="md" withBorder>
          <Group justify="center">
            <ThemeIcon color="purple" size="lg" radius="md" variant="light">
              <IconQuestionMark size={20} />
            </ThemeIcon>
            <div>
              <Text size="lg" fw={700}>{aiStats.totalQueries}</Text>
              <Text size="xs" c="dimmed">AI Queries</Text>
            </div>
          </Group>
        </Card>

        <Card padding="md" radius="md" withBorder>
          <Group justify="center">
            <ThemeIcon color="teal" size="lg" radius="md" variant="light">
              <IconTarget size={20} />
            </ThemeIcon>
            <div>
              <Text size="lg" fw={700}>{aiStats.avgConfidence}%</Text>
              <Text size="xs" c="dimmed">Avg Confidence</Text>
            </div>
          </Group>
        </Card>

        <Card padding="md" radius="md" withBorder>
          <Group justify="center">
            <ThemeIcon color="orange" size="lg" radius="md" variant="light">
              <IconStar size={20} />
            </ThemeIcon>
            <div>
              <Text size="lg" fw={700}>{aiStats.avgRating.toFixed(1)}</Text>
              <Text size="xs" c="dimmed">Avg Rating</Text>
            </div>
          </Group>
        </Card>

        <Card padding="md" radius="md" withBorder>
          <Group justify="center">
            <ThemeIcon color="lime" size="lg" radius="md" variant="light">
              <IconMoodCheck size={20} />
            </ThemeIcon>
            <div>
              <Text size="lg" fw={700}>{aiStats.helpfulResponses}</Text>
              <Text size="xs" c="dimmed">Helpful</Text>
            </div>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'insights')}>
        <Tabs.List>
          <Tabs.Tab value="insights" leftSection={<IconBulb size={16} />}>
            AI Insights
          </Tabs.Tab>
          <Tabs.Tab value="queries" leftSection={<IconMessageCircle size={16} />}>
            AI Queries
          </Tabs.Tab>
          <Tabs.Tab value="guidelines" leftSection={<IconFileText size={16} />}>
            Clinical Guidelines
          </Tabs.Tab>
          <Tabs.Tab value="interactions" leftSection={<IconPill size={16} />}>
            Drug Interactions
          </Tabs.Tab>
          <Tabs.Tab value="analytics" leftSection={<IconChartBar size={16} />}>
            Analytics
          </Tabs.Tab>
        </Tabs.List>

        {/* AI Insights Tab */}
        <Tabs.Panel value="insights">
          <Paper p="md" radius="md" withBorder mt="md">
            {/* Filters */}
            <Group mb="md">
              <TextInput
                placeholder="Search insights..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                style={{ flex: 1 }}
              />
              <Select
                placeholder="Category"
                data={[
                  { value: 'clinical', label: 'Clinical' },
                  { value: 'medication', label: 'Medication' },
                  { value: 'diagnostic', label: 'Diagnostic' },
                  { value: 'preventive', label: 'Preventive' },
                  { value: 'emergency', label: 'Emergency' },
                  { value: 'all', label: 'All' }
                ]}
                value={selectedCategory}
                onChange={(value) => setSelectedCategory(value || 'all')}
                clearable
              />
              <Select
                placeholder="Severity"
                data={[
                  { value: 'critical', label: 'Critical' },
                  { value: 'high', label: 'High' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'low', label: 'Low' }
                ]}
                value={selectedSeverity}
                onChange={(value) => setSelectedSeverity(value || '')}
                clearable
              />
            </Group>

            {/* Insights Cards */}
            <Stack gap="md">
              {filteredInsights.map((insight) => (
                <Card key={insight.id} padding="lg" radius="md" withBorder onClick={() => handleViewInsight(insight)} style={{ cursor: 'pointer' }}>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Group mb="xs">
                        <ThemeIcon size="sm" variant="light" color={getSeverityColor(insight.severity)}>
                          {getTypeIcon(insight.type)}
                        </ThemeIcon>
                        <Title order={4}>{insight.title}</Title>
                      </Group>
                      {insight.patientName && (
                        <Text c="dimmed" size="sm">Patient: {insight.patientName}</Text>
                      )}
                    </div>
                    <Group>
                      <Badge color={getSeverityColor(insight.severity)} variant="light" size="lg">
                        {insight.severity.toUpperCase()}
                      </Badge>
                      <Badge color={getStatusColor(insight.status)} variant="outline">
                        {insight.status.toUpperCase()}
                      </Badge>
                      <Group gap="xs">
                        <Text size="xs" c="dimmed">Confidence:</Text>
                        <Progress value={insight.confidence} size="sm" w={60} color="blue" />
                        <Text size="xs" fw={500}>{insight.confidence}%</Text>
                      </Group>
                    </Group>
                  </Group>

                  <Text size="sm" mb="md" lineClamp={2}>
                    {insight.description}
                  </Text>

                  <Group justify="space-between">
                    <div>
                      <Text size="xs" c="dimmed">
                        Generated by {insight.generatedBy} • {formatDateTime(insight.generatedDate)}
                      </Text>
                      {insight.reviewedBy && (
                        <Text size="xs" c="dimmed">
                          Reviewed by {insight.reviewedBy} • {formatDateTime(insight.reviewedDate!)}
                        </Text>
                      )}
                    </div>
                    <Group gap="xs">
                      <ActionIcon variant="subtle" color="blue">
                        <IconEye size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="green">
                        <IconCheck size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="red">
                        <IconX size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Paper>
        </Tabs.Panel>

        {/* AI Queries Tab */}
        <Tabs.Panel value="queries">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Recent AI Queries</Title>
              <Button leftSection={<IconPlus size={16} />} onClick={openAskAI}>
                Ask New Question
              </Button>
            </Group>
            
            <Stack gap="lg">
              {filteredQueries.map((query) => (
                <Card key={query.id} padding="lg" radius="md" withBorder onClick={() => handleViewQuery(query)} style={{ cursor: 'pointer' }}>
                  <Group justify="space-between" mb="md">
                    <div style={{ flex: 1 }}>
                      <Text fw={600} size="md" mb="xs" lineClamp={2}>
                        {query.question}
                      </Text>
                      <Group gap="sm">
                        <Badge variant="light" size="sm" tt="capitalize">
                          {query.category}
                        </Badge>
                        <Text size="xs" c="dimmed">
                          by {query.userName} • {formatDateTime(query.timestamp)}
                        </Text>
                      </Group>
                    </div>
                    <Group>
                      <Group gap="xs">
                        <Text size="xs" c="dimmed">Confidence:</Text>
                        <Progress value={query.confidence} size="sm" w={60} color="green" />
                        <Text size="xs" fw={500}>{query.confidence}%</Text>
                      </Group>
                      {query.feedback && (
                        <Group gap="xs">
                          <Rating value={query.feedback.rating} readOnly size="sm" />
                          <Text size="xs" c="dimmed">({query.feedback.rating})</Text>
                        </Group>
                      )}
                    </Group>
                  </Group>

                  <Spoiler maxHeight={60} showLabel="Show more" hideLabel="Hide">
                    <Text size="sm" c="dimmed">
                      {query.response}
                    </Text>
                  </Spoiler>

                  <Group justify="space-between" mt="md">
                    <Group gap="xs">
                      <ThemeIcon size="sm" variant="light" color="blue">
                        <IconRobot size={14} />
                      </ThemeIcon>
                      <Text size="xs" c="dimmed">
                        {query.model}
                      </Text>
                    </Group>
                    <Group gap="xs">
                      <ActionIcon variant="subtle" color="blue">
                        <IconEye size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="orange">
                        <IconBookmark size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="green">
                        <IconShare size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Paper>
        </Tabs.Panel>

        {/* Clinical Guidelines Tab */}
        <Tabs.Panel value="guidelines">
          <Paper p="md" radius="md" withBorder mt="md">
            <Title order={3} mb="lg">Evidence-Based Clinical Guidelines</Title>
            
            <Accordion variant="contained">
              {mockClinicalGuidelines.map((guideline) => (
                <Accordion.Item key={guideline.id} value={guideline.id}>
                  <Accordion.Control>
                    <Group justify="space-between">
                      <div>
                        <Text fw={600}>{guideline.title}</Text>
                        <Group gap="sm" mt="xs">
                          <Badge variant="light" size="sm" tt="capitalize">
                            {guideline.category}
                          </Badge>
                          <Text size="sm" c="dimmed">{guideline.condition}</Text>
                        </Group>
                      </div>
                      <Group gap="xs">
                        <Text size="xs" c="dimmed">
                          {guideline.source} • v{guideline.version}
                        </Text>
                      </Group>
                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="md">
                      <Text size="sm">
                        {guideline.description}
                      </Text>

                      <Divider />

                      <div>
                        <Text size="sm" fw={600} mb="md">Recommendations:</Text>
                        <Stack gap="sm">
                          {guideline.recommendations.map((rec, index) => (
                            <Card key={index} padding="sm" radius="sm" withBorder>
                              <Group justify="space-between" mb="xs">
                                <Group gap="xs">
                                  <Badge size="xs" color="blue" variant="filled">
                                    Level {rec.level}
                                  </Badge>
                                  <Badge size="xs" color="green" variant="outline">
                                    {rec.strength}
                                  </Badge>
                                </Group>
                              </Group>
                              <Text size="sm" mb="xs">
                                {rec.recommendation}
                              </Text>
                              <Text size="xs" c="dimmed">
                                <strong>Evidence:</strong> {rec.evidence}
                              </Text>
                            </Card>
                          ))}
                        </Stack>
                      </div>

                      <Group justify="space-between">
                        <Text size="xs" c="dimmed">
                          Applicable to: {guideline.applicability.join(', ')}
                        </Text>
                        <Text size="xs" c="dimmed">
                          Last updated: {formatDate(guideline.lastUpdated)}
                        </Text>
                      </Group>
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </Paper>
        </Tabs.Panel>

        {/* Drug Interactions Tab */}
        <Tabs.Panel value="interactions">
          <Paper p="md" radius="md" withBorder mt="md">
            <Title order={3} mb="lg">Drug Interaction Checker</Title>
            
            <Stack gap="md">
              {mockDrugInteractions.map((interaction) => (
                <Card key={interaction.id} padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Group mb="xs">
                        <Text fw={600} size="lg">
                          {interaction.drug1} + {interaction.drug2}
                        </Text>
                      </Group>
                      <Group gap="sm">
                        <Badge color={getSeverityColor(interaction.severity)} variant="light">
                          {interaction.interactionType.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" size="sm">
                          {interaction.severity}
                        </Badge>
                        <Badge variant="outline" size="sm" color="gray">
                          {interaction.frequency}
                        </Badge>
                      </Group>
                    </div>
                    <Group gap="xs">
                      <Text size="xs" c="dimmed">Documentation:</Text>
                      <Badge size="sm" color={interaction.documentation === 'excellent' ? 'green' : interaction.documentation === 'good' ? 'blue' : 'orange'}>
                        {interaction.documentation}
                      </Badge>
                    </Group>
                  </Group>

                  <Stack gap="sm">
                    <div>
                      <Text size="sm" fw={600} c="dimmed">Mechanism:</Text>
                      <Text size="sm">{interaction.mechanism}</Text>
                    </div>

                    <div>
                      <Text size="sm" fw={600} c="dimmed">Clinical Effect:</Text>
                      <Text size="sm">{interaction.clinicalEffect}</Text>
                    </div>

                    <div>
                      <Text size="sm" fw={600} c="dimmed">Recommendation:</Text>
                      <Text size="sm">{interaction.recommendation}</Text>
                    </div>
                  </Stack>

                  <Group justify="space-between" mt="md">
                    <Group gap="md">
                      <Group gap="xs">
                        <Text size="xs" c="dimmed">Onset:</Text>
                        <Text size="xs" fw={500}>{interaction.onset}</Text>
                      </Group>
                      <Group gap="xs">
                        <Text size="xs" c="dimmed">Severity:</Text>
                        <Text size="xs" fw={500}>{interaction.severity}</Text>
                      </Group>
                    </Group>
                    <Group gap="xs">
                      <ActionIcon variant="subtle" color="blue">
                        <IconInfoCircle size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="orange">
                        <IconBookmark size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Paper>
        </Tabs.Panel>

        {/* Analytics Tab */}
        <Tabs.Panel value="analytics">
          <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg" mt="md">
            {/* Insight Types Distribution */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">AI Insights by Type</Title>
              <PieChart
                data={[
                  { name: 'Diagnosis', value: 1, color: 'blue' },
                  { name: 'Drug Interaction', value: 1, color: 'red' },
                  { name: 'Risk Assessment', value: 1, color: 'orange' }
                ]}
                size={200}
                withLabels
              />
            </Card>

            {/* Confidence Levels */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">AI Confidence Distribution</Title>
              <BarChart
                h={200}
                data={[
                  { range: '90-100%', count: 2 },
                  { range: '80-89%', count: 1 },
                  { range: '70-79%', count: 0 },
                  { range: '60-69%', count: 0 }
                ]}
                dataKey="range"
                series={[{ name: 'count', color: 'teal.6' }]}
              />
            </Card>

            {/* Query Categories */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">AI Queries by Category</Title>
              <DonutChart
                data={[
                  { name: 'Diagnosis', value: 1, color: 'blue' },
                  { name: 'Treatment', value: 1, color: 'green' },
                  { name: 'Medication', value: 1, color: 'orange' }
                ]}
                size={200}
                thickness={40}
                withLabels
              />
            </Card>

            {/* User Satisfaction */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">User Satisfaction Trends</Title>
              <LineChart
                h={200}
                data={[
                  { week: 'W1', rating: 4.2, helpful: 85 },
                  { week: 'W2', rating: 4.5, helpful: 88 },
                  { week: 'W3', rating: 4.3, helpful: 82 },
                  { week: 'W4', rating: 4.7, helpful: 91 }
                ]}
                dataKey="week"
                series={[
                  { name: 'rating', color: 'blue.6' },
                  { name: 'helpful', color: 'green.6' }
                ]}
                curveType="linear"
              />
            </Card>
          </SimpleGrid>
        </Tabs.Panel>
      </Tabs>

      {/* Insight Detail Modal */}
      <Modal
        opened={insightDetailOpened}
        onClose={closeInsightDetail}
        title="AI Insight Details"
        size="xl"
      >
        {selectedInsight && (
          <ScrollArea h={600}>
            <Stack gap="md">
              {/* Insight Header */}
              <Card padding="lg" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                  <div>
                    <Group mb="xs">
                      <ThemeIcon variant="light" color={getSeverityColor(selectedInsight.severity)}>
                        {getTypeIcon(selectedInsight.type)}
                      </ThemeIcon>
                      <Title order={3}>{selectedInsight.title}</Title>
                    </Group>
                    {selectedInsight.patientName && (
                      <Text c="dimmed">Patient: {selectedInsight.patientName}</Text>
                    )}
                  </div>
                  <Group>
                    <Badge color={getSeverityColor(selectedInsight.severity)} variant="light" size="lg">
                      {selectedInsight.severity.toUpperCase()}
                    </Badge>
                    <Badge color={getStatusColor(selectedInsight.status)} variant="outline" size="lg">
                      {selectedInsight.status.toUpperCase()}
                    </Badge>
                  </Group>
                </Group>

                <Text mb="md">{selectedInsight.description}</Text>

                <Group gap="md">
                  <Group gap="xs">
                    <Text size="sm" c="dimmed">Confidence:</Text>
                    <Progress value={selectedInsight.confidence} size="lg" w={120} color="blue" />
                    <Text size="sm" fw={600}>{selectedInsight.confidence}%</Text>
                  </Group>
                  <Group gap="xs">
                    <Text size="sm" c="dimmed">Generated by:</Text>
                    <Text size="sm" fw={500}>{selectedInsight.generatedBy}</Text>
                  </Group>
                </Group>
              </Card>

              {/* Evidence */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={5} mb="md">Supporting Evidence</Title>
                <Stack gap="sm">
                  {selectedInsight.evidence.map((evidence, index) => (
                    <Card key={index} padding="sm" radius="sm" withBorder>
                      <Group justify="space-between" mb="xs">
                        <Text size="sm" fw={500}>{evidence.source}</Text>
                        <Group gap="xs">
                          <Text size="xs" c="dimmed">Relevance:</Text>
                          <Progress value={evidence.relevance} size="sm" w={60} color="green" />
                          <Text size="xs" fw={500}>{evidence.relevance}%</Text>
                        </Group>
                      </Group>
                      <Text size="sm" c="dimmed">{evidence.description}</Text>
                    </Card>
                  ))}
                </Stack>
              </Card>

              {/* Recommendations */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={5} mb="md">Recommendations</Title>
                <Stack gap="sm">
                  {selectedInsight.recommendations.map((rec, index) => (
                    <Card key={index} padding="sm" radius="sm" withBorder>
                      <Group justify="space-between" mb="xs">
                        <Text size="sm" fw={500}>{rec.action}</Text>
                        <Group gap="xs">
                          <Badge size="sm" color={getPriorityColor(rec.priority)} variant="light">
                            {rec.priority.toUpperCase()}
                          </Badge>
                          <Text size="xs" c="dimmed">{rec.timeframe}</Text>
                        </Group>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              </Card>

              {/* Clinical Context */}
              {selectedInsight.metadata && (
                <Card padding="lg" radius="md" withBorder>
                  <Title order={5} mb="md">Clinical Context</Title>
                  <SimpleGrid cols={2} spacing="md">
                    {selectedInsight.metadata.symptoms && (
                      <div>
                        <Text size="sm" fw={500} c="dimmed" mb="xs">Symptoms</Text>
                        <Group gap="xs">
                          {selectedInsight.metadata.symptoms.map((symptom, index) => (
                            <Chip key={index} size="sm" variant="light">
                              {symptom}
                            </Chip>
                          ))}
                        </Group>
                      </div>
                    )}
                    {selectedInsight.metadata.medications && (
                      <div>
                        <Text size="sm" fw={500} c="dimmed" mb="xs">Current Medications</Text>
                        <Group gap="xs">
                          {selectedInsight.metadata.medications.map((med, index) => (
                            <Chip key={index} size="sm" variant="light" color="blue">
                              {med}
                            </Chip>
                          ))}
                        </Group>
                      </div>
                    )}
                  </SimpleGrid>
                </Card>
              )}

              {/* Action Buttons */}
              <Group justify="flex-end">
                <Button variant="light" onClick={closeInsightDetail}>
                  Close
                </Button>
                <Button variant="light" color="red" leftSection={<IconX size={16} />}>
                  Reject
                </Button>
                <Button leftSection={<IconCheck size={16} />} color="green">
                  Accept & Implement
                </Button>
              </Group>
            </Stack>
          </ScrollArea>
        )}
      </Modal>

      {/* Ask AI Modal */}
      <Modal
        opened={askAIOpened}
        onClose={closeAskAI}
        title="Ask AI Assistant"
        size="lg"
      >
        <Stack gap="md">
          <Alert icon={<IconInfoCircle size="1rem" />} title="AI Assistant Guidelines" color="blue">
            Ask specific clinical questions for better responses. Include patient context when relevant.
          </Alert>

          <Textarea
            label="Your Question"
            placeholder="Ask about diagnosis, treatment, drug interactions, or any clinical topic..."
            minRows={4}
            value={newQuery}
            onChange={(event) => setNewQuery(event.currentTarget.value)}
            required
          />

          <SimpleGrid cols={2} spacing="md">
            <Select
              label="Question Category"
              placeholder="Select category"
              data={[
                { value: 'diagnosis', label: 'Diagnosis' },
                { value: 'treatment', label: 'Treatment' },
                { value: 'medication', label: 'Medication' },
                { value: 'general', label: 'General Medical' },
                { value: 'emergency', label: 'Emergency' }
              ]}
            />
            <Select
              label="Patient Context (Optional)"
              placeholder="Select patient"
              data={[
                { value: 'P001', label: 'Rajesh Kumar' },
                { value: 'P002', label: 'Sunita Patel' },
                { value: 'P003', label: 'Mohammed Ali' }
              ]}
            />
          </SimpleGrid>

          <Group justify="flex-end">
            <Button variant="light" onClick={closeAskAI}>
              Cancel
            </Button>
            <Button 
              leftSection={isLoading ? <Loader size={16} /> : <IconSend size={16} />}
              onClick={handleAskAI}
              disabled={!newQuery.trim() || isLoading}
            >
              {isLoading ? 'Processing...' : 'Ask AI'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'red';
    case 'medium': return 'yellow';
    case 'low': return 'green';
    default: return 'gray';
  }
};

export default AIAssistant;