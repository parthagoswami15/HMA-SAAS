'use client';

import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Text,
  Group,
  Badge,
  Card,
  SimpleGrid,
  Progress,
  RingProgress,
  Center,
  Stack,
  Flex,
  ActionIcon,
  Menu,
  Tabs,
  Alert,
  Button
} from '@mantine/core';
import {
  IconUsers,
  IconStethoscope,
  IconBed,
  IconTestPipe,
  IconPill,
  IconCurrencyDollar,
  IconCalendar,
  IconChartBar,
  IconBell,
  IconTrendingUp,
  IconTrendingDown,
  IconAlertCircle,
  IconRefresh,
  IconMoreVertical,
  IconAmbulance,
  IconVideo,
  IconMessage,
  IconRobot,
  IconDatabase,
  IconScan
} from '@tabler/icons-react';
import Layout from '../../components/shared/Layout';
import { useAppStore } from '../../stores/appStore';
import { UserRole, MetricCard, ChartDataPoint } from '../../types/common';
import { formatCurrency, getRelativeTime } from '../../lib/utils';

// Mock data for demonstration
const mockUser = {
  id: '1',
  name: 'Dr. Sarah Johnson',
  email: 'sarah.johnson@hospital.com',
  role: UserRole.DOCTOR,
  avatar: ''
};

const dashboardMetrics: MetricCard[] = [
  {
    title: 'Total Patients',
    value: '2,847',
    change: { value: 12.5, type: 'increase', period: 'vs last month' },
    icon: <IconUsers size="2rem" />,
    color: 'blue'
  },
  {
    title: 'Daily Revenue',
    value: '₹8,45,230',
    change: { value: 8.2, type: 'increase', period: 'vs yesterday' },
    icon: <IconCurrencyDollar size="2rem" />,
    color: 'green'
  },
  {
    title: 'Bed Occupancy',
    value: '87%',
    change: { value: 3.1, type: 'decrease', period: 'vs last week' },
    icon: <IconBed size="2rem" />,
    color: 'orange'
  },
  {
    title: 'Active Staff',
    value: '145',
    change: { value: 5.7, type: 'increase', period: 'vs last month' },
    icon: <IconStethoscope size="2rem" />,
    color: 'cyan'
  }
];

const moduleCards = [
  {
    title: 'Patient Management',
    description: 'Complete patient lifecycle management',
    icon: <IconUsers size="2rem" />,
    color: 'blue',
    stats: '2,847 Active Patients',
    href: '/patients',
    urgent: false
  },
  {
    title: 'Staff Management',
    description: 'Doctor & staff scheduling system',
    icon: <IconStethoscope size="2rem" />,
    color: 'teal',
    stats: '145 Active Staff',
    href: '/staff',
    urgent: false
  },
  {
    title: 'OPD Management',
    description: 'Outpatient consultation system',
    icon: <IconStethoscope size="2rem" />,
    color: 'indigo',
    stats: '45 Consultations Today',
    href: '/opd',
    urgent: false
  },
  {
    title: 'IPD Management',
    description: 'Inpatient care & bed management',
    icon: <IconBed size="2rem" />,
    color: 'orange',
    stats: '87% Bed Occupancy',
    href: '/ipd',
    urgent: false
  },
  {
    title: 'Laboratory',
    description: 'Lab tests & sample management',
    icon: <IconTestPipe size="2rem" />,
    color: 'purple',
    stats: '234 Tests Pending',
    href: '/laboratory',
    urgent: true
  },
  {
    title: 'Radiology & PACS',
    description: 'Imaging & diagnostic reports',
    icon: <IconScan size="2rem" />,
    color: 'gray',
    stats: '18 Scans Scheduled',
    href: '/radiology',
    urgent: false
  },
  {
    title: 'Pharmacy',
    description: 'Drug inventory & dispensing',
    icon: <IconPill size="2rem" />,
    color: 'green',
    stats: '89% Stock Available',
    href: '/pharmacy',
    urgent: false
  },
  {
    title: 'Billing & Revenue',
    description: 'Financial management system',
    icon: <IconCurrencyDollar size="2rem" />,
    color: 'yellow',
    stats: '₹8.45L Today',
    href: '/billing',
    urgent: false
  },
  {
    title: 'Insurance/TPA',
    description: 'Cashless claim management',
    icon: <IconDatabase size="2rem" />,
    color: 'lime',
    stats: '12 Claims Pending',
    href: '/insurance',
    urgent: false
  },
  {
    title: 'Appointments',
    description: 'Scheduling & queue management',
    icon: <IconCalendar size="2rem" />,
    color: 'red',
    stats: '67 Appointments Today',
    href: '/appointments',
    urgent: false
  },
  {
    title: 'Telemedicine',
    description: 'Virtual consultation platform',
    icon: <IconVideo size="2rem" />,
    color: 'pink',
    stats: '8 Video Calls Active',
    href: '/telemedicine',
    urgent: false
  },
  {
    title: 'Emergency',
    description: 'Critical care & triage system',
    icon: <IconAmbulance size="2rem" />,
    color: 'red',
    stats: '3 Critical Patients',
    href: '/emergency',
    urgent: true
  },
  {
    title: 'Reports & Analytics',
    description: 'Data insights & reporting',
    icon: <IconChartBar size="2rem" />,
    color: 'violet',
    stats: '24 Reports Generated',
    href: '/reports',
    urgent: false
  },
  {
    title: 'Communications',
    description: 'SMS, WhatsApp & notifications',
    icon: <IconMessage size="2rem" />,
    color: 'cyan',
    stats: '156 Messages Sent',
    href: '/communications',
    urgent: false
  },
  {
    title: 'AI Assistant',
    description: 'Clinical decision support',
    icon: <IconRobot size="2rem" />,
    color: 'grape',
    stats: '23 Recommendations',
    href: '/ai-assistant',
    urgent: false,
    beta: true
  }
];

const recentActivities = [
  {
    id: '1',
    title: 'New Patient Registration',
    description: 'John Doe registered for OPD consultation',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    type: 'patient',
    urgent: false
  },
  {
    id: '2',
    title: 'Emergency Alert',
    description: 'Critical patient admitted to ICU',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    type: 'emergency',
    urgent: true
  },
  {
    id: '3',
    title: 'Lab Results Ready',
    description: 'Blood test results for Patient ID: P12345',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    type: 'lab',
    urgent: false
  },
  {
    id: '4',
    title: 'Insurance Claim Approved',
    description: 'Claim ID: C98765 approved for ₹25,000',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    type: 'billing',
    urgent: false
  },
  {
    id: '5',
    title: 'Staff Check-in',
    description: 'Dr. Michael Smith checked in for morning shift',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    type: 'staff',
    urgent: false
  }
];

export default function DashboardPage() {
  const { user, setUser, notifications } = useAppStore();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Set mock user if not already set
    if (!user) {
      setUser(mockUser);
    }
  }, [user, setUser]);

  const MetricCard = ({ metric }: { metric: MetricCard }) => (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Flex justify="space-between" align="flex-start" mb="md">
        <div style={{ color: `var(--mantine-color-${metric.color}-6)` }}>
          {metric.icon}
        </div>
        <ActionIcon variant="subtle" color="gray">
          <IconMoreVertical size="1rem" />
        </ActionIcon>
      </Flex>
      
      <Text size="xl" fw={700} mb="xs">
        {metric.value}
      </Text>
      
      <Text size="sm" c="dimmed" mb="sm">
        {metric.title}
      </Text>
      
      {metric.change && (
        <Group gap="xs">
          {metric.change.type === 'increase' ? (
            <IconTrendingUp size="1rem" color="green" />
          ) : (
            <IconTrendingDown size="1rem" color="red" />
          )}
          <Text 
            size="sm" 
            c={metric.change.type === 'increase' ? 'green' : 'red'}
            fw={500}
          >
            {metric.change.value}% {metric.change.period}
          </Text>
        </Group>
      )}
    </Card>
  );

  const ModuleCard = ({ module }: { module: typeof moduleCards[0] }) => (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder 
      style={{ 
        cursor: 'pointer',
        transition: 'transform 0.2s',
        ':hover': { transform: 'translateY(-2px)' }
      }}
    >
      <Flex justify="space-between" align="flex-start" mb="md">
        <div style={{ color: `var(--mantine-color-${module.color}-6)` }}>
          {module.icon}
        </div>
        <Group gap="xs">
          {module.beta && (
            <Badge size="xs" variant="filled" color="grape">
              BETA
            </Badge>
          )}
          {module.urgent && (
            <Badge size="xs" variant="filled" color="red">
              URGENT
            </Badge>
          )}
        </Group>
      </Flex>
      
      <Text fw={600} size="lg" mb="xs">
        {module.title}
      </Text>
      
      <Text size="sm" c="dimmed" mb="md" lineClamp={2}>
        {module.description}
      </Text>
      
      <Text size="sm" fw={500} c={module.color}>
        {module.stats}
      </Text>
    </Card>
  );

  return (
    <Layout user={user} notifications={notifications.length} onLogout={() => setUser(null)}>
      <Container fluid>
        <Stack gap="lg">
          {/* Header */}
          <Group justify="space-between">
            <div>
              <Text size="xl" fw={700}>
                Hospital Management Dashboard
              </Text>
              <Text size="sm" c="dimmed">
                Welcome back, {user?.name || 'User'}! Here's what's happening at your hospital today.
              </Text>
            </div>
            <Button leftSection={<IconRefresh size="1rem" />} variant="light">
              Refresh
            </Button>
          </Group>

          {/* Metrics Cards */}
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
            {dashboardMetrics.map((metric, index) => (
              <MetricCard key={index} metric={metric} />
            ))}
          </SimpleGrid>

          {/* Tabs for different views */}
          <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'overview')}>
            <Tabs.List>
              <Tabs.Tab value="overview">Overview</Tabs.Tab>
              <Tabs.Tab value="modules">All Modules</Tabs.Tab>
              <Tabs.Tab value="activities">Recent Activities</Tabs.Tab>
              <Tabs.Tab value="alerts">Alerts</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="overview" pt="md">
              <Grid>
                <Grid.Col span={{ base: 12, md: 8 }}>
                  <Paper p="lg" shadow="sm" radius="md" withBorder>
                    <Text fw={600} size="lg" mb="md">
                      Quick Access Modules
                    </Text>
                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                      {moduleCards.slice(0, 9).map((module, index) => (
                        <ModuleCard key={index} module={module} />
                      ))}
                    </SimpleGrid>
                  </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Stack gap="md">
                    {/* Bed Occupancy */}
                    <Paper p="lg" shadow="sm" radius="md" withBorder>
                      <Text fw={600} size="md" mb="md">
                        Bed Occupancy
                      </Text>
                      <Center>
                        <RingProgress
                          size={120}
                          thickness={16}
                          sections={[
                            { value: 87, color: 'orange', tooltip: 'Occupied: 87%' },
                            { value: 13, color: 'gray', tooltip: 'Available: 13%' }
                          ]}
                          label={
                            <Center>
                              <Text fw={700} size="lg">87%</Text>
                            </Center>
                          }
                        />
                      </Center>
                      <Text ta="center" size="sm" c="dimmed" mt="md">
                        174 of 200 beds occupied
                      </Text>
                    </Paper>

                    {/* Recent Activities */}
                    <Paper p="lg" shadow="sm" radius="md" withBorder>
                      <Text fw={600} size="md" mb="md">
                        Recent Activities
                      </Text>
                      <Stack gap="sm">
                        {recentActivities.slice(0, 5).map((activity) => (
                          <div key={activity.id}>
                            <Group justify="space-between" align="flex-start">
                              <div style={{ flex: 1 }}>
                                <Text size="sm" fw={500} lineClamp={1}>
                                  {activity.title}
                                </Text>
                                <Text size="xs" c="dimmed" lineClamp={2}>
                                  {activity.description}
                                </Text>
                                <Text size="xs" c="dimmed">
                                  {getRelativeTime(activity.timestamp)}
                                </Text>
                              </div>
                              {activity.urgent && (
                                <Badge size="xs" color="red">
                                  Urgent
                                </Badge>
                              )}
                            </Group>
                            {recentActivities.indexOf(activity) < recentActivities.length - 1 && (
                              <div style={{ height: 1, backgroundColor: '#e9ecef', margin: '8px 0' }} />
                            )}
                          </div>
                        ))}
                      </Stack>
                    </Paper>
                  </Stack>
                </Grid.Col>
              </Grid>
            </Tabs.Panel>

            <Tabs.Panel value="modules" pt="md">
              <Paper p="lg" shadow="sm" radius="md" withBorder>
                <Text fw={600} size="lg" mb="md">
                  All Hospital Management Modules (20 Modules)
                </Text>
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
                  {moduleCards.map((module, index) => (
                    <ModuleCard key={index} module={module} />
                  ))}
                </SimpleGrid>
              </Paper>
            </Tabs.Panel>

            <Tabs.Panel value="activities" pt="md">
              <Paper p="lg" shadow="sm" radius="md" withBorder>
                <Text fw={600} size="lg" mb="md">
                  Recent Activities & Events
                </Text>
                <Stack gap="md">
                  {recentActivities.map((activity) => (
                    <Card key={activity.id} padding="md" withBorder>
                      <Group justify="space-between" align="flex-start">
                        <div style={{ flex: 1 }}>
                          <Group gap="xs" mb="xs">
                            <Text fw={500}>{activity.title}</Text>
                            {activity.urgent && (
                              <Badge size="xs" color="red">
                                Urgent
                              </Badge>
                            )}
                          </Group>
                          <Text size="sm" c="dimmed" mb="xs">
                            {activity.description}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {getRelativeTime(activity.timestamp)}
                          </Text>
                        </div>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              </Paper>
            </Tabs.Panel>

            <Tabs.Panel value="alerts" pt="md">
              <Paper p="lg" shadow="sm" radius="md" withBorder>
                <Text fw={600} size="lg" mb="md">
                  System Alerts & Notifications
                </Text>
                <Stack gap="md">
                  <Alert icon={<IconAlertCircle size="1rem" />} color="red">
                    <strong>Critical:</strong> 3 patients in emergency requiring immediate attention
                  </Alert>
                  <Alert icon={<IconAlertCircle size="1rem" />} color="orange">
                    <strong>Warning:</strong> Laboratory has 234 pending test results
                  </Alert>
                  <Alert icon={<IconBell size="1rem" />} color="blue">
                    <strong>Info:</strong> Staff shift change at 2:00 PM today
                  </Alert>
                  <Alert icon={<IconDatabase size="1rem" />} color="yellow">
                    <strong>Maintenance:</strong> Scheduled system backup at 11:00 PM
                  </Alert>
                </Stack>
              </Paper>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Container>
    </Layout>
  );
}
