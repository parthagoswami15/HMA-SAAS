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
  Timeline,
  Alert,
  Progress,
  Flex,
  Anchor,
  NumberInput,
  Textarea
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { Calendar, DatePicker } from '@mantine/dates';
import { AreaChart, BarChart, DonutChart, LineChart } from '@mantine/charts';
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconEye,
  IconTrash,
  IconCalendar,
  IconClock,
  IconUsers,
  IconChartBar,
  IconPhone,
  IconMail,
  IconAlertCircle,
  IconCheck,
  IconX,
  IconDotsVertical,
  IconCalendarEvent,
  IconStethoscope,
  IconActivity,
  IconTrendingUp,
  IconTrendingDown,
  IconClockHour3,
  IconUserCheck,
  IconUserX,
  IconCurrencyRupee,
  IconVideo,
  IconBell,
  IconHistory,
  IconCalendarStats,
  IconReport
} from '@tabler/icons-react';

// Import types and mock data
import { 
  Appointment, 
  AppointmentStatus, 
  AppointmentType, 
  AppointmentPriority,
  AppointmentSearchFilters,
  AppointmentStats
} from '../../../types/appointment';
import { 
  mockAppointments, 
  mockAppointmentStats,
  mockDoctorAvailability,
  mockAppointmentQueue,
  mockAppointmentReminders,
  mockCalendars
} from '../../../lib/mockData/appointments';
import { mockStaff } from '../../../lib/mockData/staff';
import { mockPatients } from '../../../lib/mockData/patients';

const AppointmentManagement = () => {
  // State management
  const [activeTab, setActiveTab] = useState<string>('appointments');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Modal states
  const [appointmentDetailOpened, { open: openAppointmentDetail, close: closeAppointmentDetail }] = useDisclosure(false);
  const [bookAppointmentOpened, { open: openBookAppointment, close: closeBookAppointment }] = useDisclosure(false);
  const [rescheduleOpened, { open: openReschedule, close: closeReschedule }] = useDisclosure(false);

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return mockAppointments.filter((appointment) => {
      const matchesSearch = 
        appointment.patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.appointmentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.doctor.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.doctor.lastName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDoctor = !selectedDoctor || appointment.doctor.staffId === selectedDoctor;
      const matchesStatus = !selectedStatus || appointment.status === selectedStatus;
      const matchesType = !selectedType || appointment.appointmentType === selectedType;
      const matchesDate = !selectedDate || 
        new Date(appointment.appointmentDate).toDateString() === selectedDate.toDateString();

      return matchesSearch && matchesDoctor && matchesStatus && matchesType && matchesDate;
    });
  }, [searchQuery, selectedDoctor, selectedStatus, selectedType, selectedDate]);

  // Helper functions
  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'scheduled': return 'blue';
      case 'confirmed': return 'green';
      case 'checked_in': return 'teal';
      case 'in_progress': return 'yellow';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      case 'no_show': return 'gray';
      case 'rescheduled': return 'orange';
      default: return 'gray';
    }
  };

  const getTypeColor = (type: AppointmentType) => {
    switch (type) {
      case 'emergency': return 'red';
      case 'consultation': return 'blue';
      case 'follow_up': return 'green';
      case 'surgery_consultation': return 'purple';
      case 'telemedicine': return 'cyan';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority: AppointmentPriority) => {
    switch (priority) {
      case 'emergency': return 'red';
      case 'urgent': return 'orange';
      case 'high': return 'yellow';
      case 'normal': return 'blue';
      case 'low': return 'gray';
      default: return 'gray';
    }
  };

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    openAppointmentDetail();
  };

  const handleStatusUpdate = (appointmentId: string, newStatus: AppointmentStatus) => {
    notifications.show({
      title: 'Appointment Updated',
      message: `Appointment status changed to ${newStatus}`,
      color: 'green',
    });
  };

  const handleCancelAppointment = (appointment: Appointment) => {
    notifications.show({
      title: 'Appointment Cancelled',
      message: `Appointment for ${appointment.patient.firstName} ${appointment.patient.lastName} has been cancelled`,
      color: 'red',
    });
  };

  // Statistics cards
  const statsCards = [
    {
      title: 'Today\'s Appointments',
      value: mockAppointmentStats.todayAppointments,
      icon: IconCalendarEvent,
      color: 'blue',
      trend: '+12%'
    },
    {
      title: 'Upcoming',
      value: mockAppointmentStats.upcomingAppointments,
      icon: IconClock,
      color: 'green',
      trend: '+8%'
    },
    {
      title: 'Completed',
      value: mockAppointmentStats.completedAppointments,
      icon: IconCheck,
      color: 'teal',
      trend: '+15%'
    },
    {
      title: 'Cancelled',
      value: mockAppointmentStats.cancelledAppointments,
      icon: IconX,
      color: 'red',
      trend: '-5%'
    }
  ];

  // Chart data
  const appointmentsByStatusData = Object.entries(mockAppointmentStats.appointmentsByStatus).map(
    ([status, count]) => ({
      name: status.replace('_', ' ').toUpperCase(),
      value: count,
      color: getStatusColor(status as AppointmentStatus)
    })
  );

  const appointmentsByTypeData = Object.entries(mockAppointmentStats.appointmentsByType)
    .filter(([_, count]) => count > 0)
    .map(([type, count]) => ({
      type: type.replace('_', ' ').toUpperCase(),
      count
    }));

  const dailyAppointmentsData = mockAppointmentStats.dailyAppointments;
  const peakHoursData = mockAppointmentStats.peakHours;

  return (
    <Container size="xl" py="md">
      {/* Header */}
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={1}>Appointment Management</Title>
          <Text c="dimmed" size="sm">
            Schedule, manage, and track patient appointments
          </Text>
        </div>
        <Group>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={openBookAppointment}
          >
            Book Appointment
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
                  color={stat.trend.startsWith('+') ? 'green' : 'red'} 
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
          <Tabs.Tab value="appointments" leftSection={<IconCalendarEvent size={16} />}>
            Appointments
          </Tabs.Tab>
          <Tabs.Tab value="calendar" leftSection={<IconCalendar size={16} />}>
            Calendar View
          </Tabs.Tab>
          <Tabs.Tab value="queue" leftSection={<IconUsers size={16} />}>
            Queue Management
          </Tabs.Tab>
          <Tabs.Tab value="reminders" leftSection={<IconBell size={16} />}>
            Reminders
          </Tabs.Tab>
          <Tabs.Tab value="analytics" leftSection={<IconChartBar size={16} />}>
            Analytics
          </Tabs.Tab>
        </Tabs.List>

        {/* Appointments Tab */}
        <Tabs.Panel value="appointments">
          <Paper p="md" radius="md" withBorder mt="md">
            {/* Search and Filters */}
            <Group mb="md">
              <TextInput
                placeholder="Search appointments..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                style={{ flex: 1 }}
              />
              <Select
                placeholder="Doctor"
                data={mockStaff.map(doctor => ({ 
                  value: doctor.staffId, 
                  label: `${doctor.firstName} ${doctor.lastName}` 
                }))}
                value={selectedDoctor}
                onChange={setSelectedDoctor}
                clearable
              />
              <Select
                placeholder="Status"
                data={[
                  { value: 'scheduled', label: 'Scheduled' },
                  { value: 'confirmed', label: 'Confirmed' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'cancelled', label: 'Cancelled' }
                ]}
                value={selectedStatus}
                onChange={setSelectedStatus}
                clearable
              />
              <Select
                placeholder="Type"
                data={[
                  { value: 'consultation', label: 'Consultation' },
                  { value: 'follow_up', label: 'Follow-up' },
                  { value: 'emergency', label: 'Emergency' },
                  { value: 'telemedicine', label: 'Telemedicine' }
                ]}
                value={selectedType}
                onChange={setSelectedType}
                clearable
              />
              <DatePicker
                placeholder="Select date"
                value={selectedDate}
                onChange={setSelectedDate}
                clearable
              />
            </Group>

            {/* Appointments Table */}
            <ScrollArea>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Patient</Table.Th>
                    <Table.Th>Doctor</Table.Th>
                    <Table.Th>Date & Time</Table.Th>
                    <Table.Th>Type</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Priority</Table.Th>
                    <Table.Th>Fee</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredAppointments.map((appointment) => (
                    <Table.Tr key={appointment.id}>
                      <Table.Td>
                        <Group>
                          <Avatar color="blue" radius="xl">
                            {appointment.patient.firstName[0]}{appointment.patient.lastName[0]}
                          </Avatar>
                          <div>
                            <Text fw={500}>
                              {appointment.patient.firstName} {appointment.patient.lastName}
                            </Text>
                            <Text size="sm" c="dimmed">
                              {appointment.appointmentNumber}
                            </Text>
                          </div>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <div>
                          <Text fw={500}>
                            {appointment.doctor.firstName} {appointment.doctor.lastName}
                          </Text>
                          <Text size="sm" c="dimmed">
                            {appointment.department}
                          </Text>
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <div>
                          <Text fw={500}>
                            {new Date(appointment.appointmentDate).toLocaleDateString()}
                          </Text>
                          <Text size="sm" c="dimmed">
                            {appointment.appointmentTime} ({appointment.duration} min)
                          </Text>
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getTypeColor(appointment.appointmentType)} variant="light">
                          {appointment.appointmentType.replace('_', ' ')}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getStatusColor(appointment.status)} variant="light">
                          {appointment.status.replace('_', ' ')}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getPriorityColor(appointment.priority)} variant="light" size="sm">
                          {appointment.priority}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <div>
                          <Text fw={500}>₹{appointment.consultationFee}</Text>
                          <Badge 
                            color={appointment.isPaid ? 'green' : 'red'} 
                            variant="light" 
                            size="xs"
                          >
                            {appointment.isPaid ? 'Paid' : 'Pending'}
                          </Badge>
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => handleViewAppointment(appointment)}
                          >
                            <IconEye size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="subtle"
                            color="green"
                            onClick={openReschedule}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                          <Menu>
                            <Menu.Target>
                              <ActionIcon variant="subtle" color="gray">
                                <IconDotsVertical size={16} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item 
                                leftSection={<IconCheck size={14} />}
                                onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                              >
                                Confirm
                              </Menu.Item>
                              <Menu.Item 
                                leftSection={<IconUserCheck size={14} />}
                                onClick={() => handleStatusUpdate(appointment.id, 'checked_in')}
                              >
                                Check In
                              </Menu.Item>
                              <Menu.Item 
                                leftSection={<IconX size={14} />}
                                color="red"
                                onClick={() => handleCancelAppointment(appointment)}
                              >
                                Cancel
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

        {/* Calendar Tab */}
        <Tabs.Panel value="calendar">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Appointment Calendar</Title>
              <Group>
                <Select
                  placeholder="Select Doctor"
                  data={mockStaff.map(doctor => ({ 
                    value: doctor.staffId, 
                    label: `${doctor.firstName} ${doctor.lastName}` 
                  }))}
                  value={selectedDoctor}
                  onChange={setSelectedDoctor}
                />
                <Button leftSection={<IconPlus size={16} />}>
                  Add Slot
                </Button>
              </Group>
            </Group>

            <SimpleGrid cols={{ base: 1, lg: 2 }}>
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Calendar</Title>
                <Calendar 
                  size="md"
                  static
                  renderDay={(date) => {
                    const hasAppointments = mockAppointments.some(apt => 
                      new Date(apt.appointmentDate).toDateString() === date.toDateString()
                    );
                    return (
                      <div style={{ 
                        width: '100%', 
                        height: '100%',
                        backgroundColor: hasAppointments ? '#e3f2fd' : 'transparent',
                        borderRadius: '4px'
                      }}>
                        {date.getDate()}
                      </div>
                    );
                  }}
                />
              </Card>

              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Today's Schedule</Title>
                <Stack gap="sm">
                  {mockAppointments
                    .filter(apt => 
                      new Date(apt.appointmentDate).toDateString() === new Date().toDateString()
                    )
                    .map((appointment) => (
                    <Group key={appointment.id} justify="space-between" p="sm" 
                           style={{ border: '1px solid #e9ecef', borderRadius: '8px' }}>
                      <div>
                        <Text fw={500}>{appointment.appointmentTime}</Text>
                        <Text size="sm" c="dimmed">
                          {appointment.patient.firstName} {appointment.patient.lastName}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {appointment.doctor.firstName} {appointment.doctor.lastName}
                        </Text>
                      </div>
                      <Badge color={getStatusColor(appointment.status)} variant="light" size="sm">
                        {appointment.status}
                      </Badge>
                    </Group>
                  ))}
                </Stack>
              </Card>
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>

        {/* Queue Management Tab */}
        <Tabs.Panel value="queue">
          <Paper p="md" radius="md" withBorder mt="md">
            <Title order={3} mb="lg">Queue Management</Title>
            
            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} mb="lg">
              <Card padding="md" radius="md" withBorder>
                <Group justify="center">
                  <ThemeIcon size="xl" color="blue" variant="light">
                    <IconUsers size={24} />
                  </ThemeIcon>
                </Group>
                <Text ta="center" fw={600} size="lg" mt="sm">8</Text>
                <Text ta="center" size="sm" c="dimmed">Waiting</Text>
              </Card>
              
              <Card padding="md" radius="md" withBorder>
                <Group justify="center">
                  <ThemeIcon size="xl" color="green" variant="light">
                    <IconStethoscope size={24} />
                  </ThemeIcon>
                </Group>
                <Text ta="center" fw={600} size="lg" mt="sm">3</Text>
                <Text ta="center" size="sm" c="dimmed">In Consultation</Text>
              </Card>
              
              <Card padding="md" radius="md" withBorder>
                <Group justify="center">
                  <ThemeIcon size="xl" color="orange" variant="light">
                    <IconClockHour3 size={24} />
                  </ThemeIcon>
                </Group>
                <Text ta="center" fw={600} size="lg" mt="sm">15 min</Text>
                <Text ta="center" size="sm" c="dimmed">Avg Wait Time</Text>
              </Card>
            </SimpleGrid>

            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">Current Queue</Title>
              {mockAppointmentQueue.map((queue) => (
                <Stack key={queue.id} gap="sm">
                  {queue.appointments.map((queuedAppointment, index) => (
                    <Group key={queuedAppointment.appointmentId} justify="space-between" 
                           p="md" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                      <Group>
                        <Badge color="blue" variant="light" size="lg">
                          {index + 1}
                        </Badge>
                        <div>
                          <Text fw={500}>
                            {queuedAppointment.appointment.patient.firstName} {queuedAppointment.appointment.patient.lastName}
                          </Text>
                          <Text size="sm" c="dimmed">
                            {queuedAppointment.appointment.reason}
                          </Text>
                        </div>
                      </Group>
                      <Group>
                        <Text size="sm" c="dimmed">
                          Est. {queuedAppointment.estimatedTime}
                        </Text>
                        <Badge color={queuedAppointment.status === 'waiting' ? 'blue' : 'green'} variant="light">
                          {queuedAppointment.status}
                        </Badge>
                      </Group>
                    </Group>
                  ))}
                </Stack>
              ))}
            </Card>
          </Paper>
        </Tabs.Panel>

        {/* Reminders Tab */}
        <Tabs.Panel value="reminders">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Appointment Reminders</Title>
              <Button leftSection={<IconBell size={16} />}>
                Configure Reminders
              </Button>
            </Group>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Reminder Settings</Title>
                <Stack gap="md">
                  <Group justify="space-between">
                    <Text>24-hour reminder</Text>
                    <Badge color="green" variant="light">Enabled</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text>2-hour reminder</Text>
                    <Badge color="green" variant="light">Enabled</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text>SMS notifications</Text>
                    <Badge color="blue" variant="light">Active</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text>Email notifications</Text>
                    <Badge color="blue" variant="light">Active</Badge>
                  </Group>
                </Stack>
              </Card>

              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Recent Reminders</Title>
                <Timeline>
                  {mockAppointmentReminders.map((reminder) => (
                    <Timeline.Item 
                      key={reminder.id}
                      bullet={<IconBell size={12} />}
                      title={reminder.reminderType.replace('_', ' ').toUpperCase()}
                    >
                      <Text size="sm" c="dimmed">
                        {reminder.message}
                      </Text>
                      <Text size="xs" c="dimmed" mt="xs">
                        {new Date(reminder.scheduledTime).toLocaleString()}
                      </Text>
                      <Badge 
                        color={reminder.status === 'sent' ? 'green' : 'blue'} 
                        variant="light" 
                        size="xs" 
                        mt="xs"
                      >
                        {reminder.status}
                      </Badge>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card>
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>

        {/* Analytics Tab */}
        <Tabs.Panel value="analytics">
          <Paper p="md" radius="md" withBorder mt="md">
            <Title order={3} mb="lg">Appointment Analytics</Title>
            
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
              {/* Appointments by Status */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Appointments by Status</Title>
                <DonutChart
                  data={appointmentsByStatusData}
                  size={160}
                  thickness={30}
                  withLabels
                />
              </Card>
              
              {/* Appointments by Type */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Appointments by Type</Title>
                <BarChart
                  h={200}
                  data={appointmentsByTypeData}
                  dataKey="type"
                  series={[{ name: 'count', color: 'blue.6' }]}
                />
              </Card>
              
              {/* Daily Appointments Trend */}
              <Card padding="lg" radius="md" withBorder style={{ gridColumn: '1 / -1' }}>
                <Title order={4} mb="md">Daily Appointments</Title>
                <AreaChart
                  h={300}
                  data={dailyAppointmentsData}
                  dataKey="date"
                  series={[
                    { name: 'scheduled', color: 'blue.6' },
                    { name: 'completed', color: 'green.6' },
                    { name: 'cancelled', color: 'red.6' }
                  ]}
                  curveType="linear"
                />
              </Card>
              
              {/* Peak Hours */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Peak Hours</Title>
                <LineChart
                  h={200}
                  data={peakHoursData}
                  dataKey="hour"
                  series={[{ name: 'appointmentCount', color: 'teal.6' }]}
                />
              </Card>
              
              {/* Revenue Metrics */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Revenue Overview</Title>
                <Stack gap="md">
                  <div>
                    <Group justify="space-between" mb="xs">
                      <Text size="sm">Total Revenue</Text>
                      <Text size="sm" fw={500}>₹{mockAppointmentStats.revenueMetrics.totalRevenue.toLocaleString()}</Text>
                    </Group>
                    <Progress value={85} color="green" />
                  </div>
                  
                  <div>
                    <Group justify="space-between" mb="xs">
                      <Text size="sm">Pending Payments</Text>
                      <Text size="sm" fw={500}>₹{mockAppointmentStats.revenueMetrics.pendingPayments.toLocaleString()}</Text>
                    </Group>
                    <Progress value={15} color="red" />
                  </div>
                  
                  <div>
                    <Group justify="space-between" mb="xs">
                      <Text size="sm">Average Fee</Text>
                      <Text size="sm" fw={500}>₹{mockAppointmentStats.revenueMetrics.averageConsultationFee}</Text>
                    </Group>
                    <Progress value={75} color="blue" />
                  </div>
                </Stack>
              </Card>
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>
      </Tabs>

      {/* Appointment Detail Modal */}
      <Modal
        opened={appointmentDetailOpened}
        onClose={closeAppointmentDetail}
        title="Appointment Details"
        size="lg"
      >
        {selectedAppointment && (
          <Stack gap="md">
            {/* Basic Info */}
            <Group>
              <Avatar size="xl" color="blue" radius="xl">
                {selectedAppointment.patient.firstName[0]}{selectedAppointment.patient.lastName[0]}
              </Avatar>
              <div>
                <Title order={3}>
                  {selectedAppointment.patient.firstName} {selectedAppointment.patient.lastName}
                </Title>
                <Text c="dimmed">{selectedAppointment.appointmentNumber}</Text>
                <Badge color={getStatusColor(selectedAppointment.status)} variant="light" mt="xs">
                  {selectedAppointment.status.replace('_', ' ')}
                </Badge>
              </div>
            </Group>

            <Divider />

            {/* Appointment Details */}
            <SimpleGrid cols={2}>
              <div>
                <Text size="sm" fw={500}>Doctor</Text>
                <Text size="sm" c="dimmed">
                  {selectedAppointment.doctor.firstName} {selectedAppointment.doctor.lastName}
                </Text>
              </div>
              <div>
                <Text size="sm" fw={500}>Department</Text>
                <Text size="sm" c="dimmed">{selectedAppointment.department}</Text>
              </div>
              <div>
                <Text size="sm" fw={500}>Date & Time</Text>
                <Text size="sm" c="dimmed">
                  {new Date(selectedAppointment.appointmentDate).toLocaleDateString()} at {selectedAppointment.appointmentTime}
                </Text>
              </div>
              <div>
                <Text size="sm" fw={500}>Duration</Text>
                <Text size="sm" c="dimmed">{selectedAppointment.duration} minutes</Text>
              </div>
              <div>
                <Text size="sm" fw={500}>Type</Text>
                <Badge color={getTypeColor(selectedAppointment.appointmentType)} variant="light" size="sm">
                  {selectedAppointment.appointmentType.replace('_', ' ')}
                </Badge>
              </div>
              <div>
                <Text size="sm" fw={500}>Priority</Text>
                <Badge color={getPriorityColor(selectedAppointment.priority)} variant="light" size="sm">
                  {selectedAppointment.priority}
                </Badge>
              </div>
            </SimpleGrid>

            {/* Reason and Notes */}
            <div>
              <Text size="sm" fw={500}>Reason for Visit</Text>
              <Text size="sm" c="dimmed">{selectedAppointment.reason}</Text>
            </div>

            {selectedAppointment.notes && (
              <div>
                <Text size="sm" fw={500}>Notes</Text>
                <Text size="sm" c="dimmed">{selectedAppointment.notes}</Text>
              </div>
            )}

            {/* Payment Info */}
            <div>
              <Text size="sm" fw={500}>Consultation Fee</Text>
              <Group>
                <Text size="sm" c="dimmed">₹{selectedAppointment.consultationFee}</Text>
                <Badge 
                  color={selectedAppointment.isPaid ? 'green' : 'red'} 
                  variant="light" 
                  size="sm"
                >
                  {selectedAppointment.isPaid ? 'Paid' : 'Pending'}
                </Badge>
              </Group>
            </div>

            <Group justify="flex-end">
              <Button variant="light" onClick={closeAppointmentDetail}>
                Close
              </Button>
              <Button onClick={openReschedule}>
                Reschedule
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Book Appointment Modal */}
      <Modal
        opened={bookAppointmentOpened}
        onClose={closeBookAppointment}
        title="Book New Appointment"
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
              data={mockStaff.map(doctor => ({ 
                value: doctor.staffId, 
                label: `${doctor.firstName} ${doctor.lastName}` 
              }))}
              required
            />
          </SimpleGrid>
          
          <SimpleGrid cols={2}>
            <DatePicker
              label="Appointment Date"
              placeholder="Select date"
              required
            />
            <Select
              label="Time Slot"
              placeholder="Select time"
              data={[
                { value: '09:00', label: '09:00 AM' },
                { value: '09:30', label: '09:30 AM' },
                { value: '10:00', label: '10:00 AM' },
                { value: '10:30', label: '10:30 AM' }
              ]}
              required
            />
          </SimpleGrid>
          
          <SimpleGrid cols={2}>
            <Select
              label="Appointment Type"
              placeholder="Select type"
              data={[
                { value: 'consultation', label: 'Consultation' },
                { value: 'follow_up', label: 'Follow-up' },
                { value: 'emergency', label: 'Emergency' },
                { value: 'routine_checkup', label: 'Routine Checkup' }
              ]}
              required
            />
            <Select
              label="Priority"
              placeholder="Select priority"
              data={[
                { value: 'normal', label: 'Normal' },
                { value: 'high', label: 'High' },
                { value: 'urgent', label: 'Urgent' },
                { value: 'emergency', label: 'Emergency' }
              ]}
              required
            />
          </SimpleGrid>
          
          <Textarea
            label="Reason for Visit"
            placeholder="Describe the reason for the appointment"
            required
          />
          
          <NumberInput
            label="Consultation Fee"
            placeholder="Enter fee amount"
            min={0}
            prefix="₹"
          />
          
          <Group justify="flex-end">
            <Button variant="light" onClick={closeBookAppointment}>
              Cancel
            </Button>
            <Button onClick={() => {
              notifications.show({
                title: 'Success',
                message: 'Appointment booked successfully',
                color: 'green',
              });
              closeBookAppointment();
            }}>
              Book Appointment
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default AppointmentManagement;