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
  Grid,
  Card,
  Avatar,
  ActionIcon,
  Menu,
  Stack,
  Divider,
  NumberInput,
  Textarea,
  DatePicker,
  Switch,
  Progress,
  Alert,
  Timeline,
  SimpleGrid,
  RingProgress,
  Flex,
  ScrollArea,
  ThemeIcon,
  List,
  Anchor
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconPlus,
  IconSearch,
  IconFilter,
  IconEdit,
  IconEye,
  IconTrash,
  IconUsers,
  IconUserPlus,
  IconCalendar,
  IconClock,
  IconTrendingUp,
  IconTrendingDown,
  IconPhone,
  IconMail,
  IconMapPin,
  IconStethoscope,
  IconCertificate,
  IconSchool,
  IconBriefcase,
  IconCalendarEvent,
  IconClockHour3,
  IconChartBar,
  IconUserCheck,
  IconUserX,
  IconAlertCircle,
  IconCheck,
  IconX,
  IconDotsVertical,
  IconBuilding,
  IconMedicalCross,
  IconActivity,
  IconAward,
  IconCurrencyRupee,
  IconCalendarStats,
  IconUserCircle,
  IconShieldCheck
} from '@tabler/icons-react';
import { AreaChart, BarChart, DonutChart } from '@mantine/charts';

// Import types and mock data
import { Staff, StaffStats, Department, StaffSearchFilters, StaffListItem } from '../../../types/staff';
import { UserRole, Gender, Status } from '../../../types/common';
import { 
  mockStaff, 
  mockStaffStats, 
  mockDepartments,
  mockShifts,
  mockLeaveRequests,
  mockAttendance,
  mockTraining
} from '../../../lib/mockData/staff';

const StaffManagement = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [staffToEdit, setStaffToEdit] = useState<Staff | null>(null);
  const [activeTab, setActiveTab] = useState<string>('list');

  // Modal states
  const [staffDetailOpened, { open: openStaffDetail, close: closeStaffDetail }] = useDisclosure(false);
  const [addStaffOpened, { open: openAddStaff, close: closeAddStaff }] = useDisclosure(false);
  const [editStaffOpened, { open: openEditStaff, close: closeEditStaff }] = useDisclosure(false);

  // Filter and search logic
  const filteredStaff = useMemo(() => {
    return mockStaff.filter((staff) => {
      const matchesSearch = 
        staff.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.staffId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDepartment = !selectedDepartment || staff.department.name === selectedDepartment;
      const matchesRole = !selectedRole || staff.role === selectedRole;
      const matchesStatus = !selectedStatus || staff.status === selectedStatus;

      return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
    }).sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      switch (sortBy) {
        case 'name':
          aVal = `${a.firstName} ${a.lastName}`;
          bVal = `${b.firstName} ${b.lastName}`;
          break;
        case 'department':
          aVal = a.department.name;
          bVal = b.department.name;
          break;
        case 'experience':
          aVal = a.experience || 0;
          bVal = b.experience || 0;
          break;
        case 'joiningDate':
          aVal = new Date(a.joiningDate).getTime();
          bVal = new Date(b.joiningDate).getTime();
          break;
        default:
          aVal = `${a.firstName} ${a.lastName}`;
          bVal = `${b.firstName} ${b.lastName}`;
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }, [searchQuery, selectedDepartment, selectedRole, selectedStatus, sortBy, sortOrder]);

  // Helper functions
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.DOCTOR: return 'blue';
      case UserRole.NURSE: return 'green';
      case UserRole.TECHNICIAN: return 'orange';
      case UserRole.PHARMACIST: return 'purple';
      case UserRole.ADMIN: return 'red';
      default: return 'gray';
    }
  };

  const getStatusBadgeColor = (status: Status) => {
    switch (status) {
      case Status.ACTIVE: return 'green';
      case Status.INACTIVE: return 'red';
      case Status.PENDING: return 'yellow';
      default: return 'gray';
    }
  };

  const handleViewStaff = (staff: Staff) => {
    setSelectedStaff(staff);
    openStaffDetail();
  };

  const handleEditStaff = (staff: Staff) => {
    setStaffToEdit(staff);
    openEditStaff();
  };

  const handleDeleteStaff = (staff: Staff) => {
    notifications.show({
      title: 'Staff Deleted',
      message: `${staff.firstName} ${staff.lastName} has been removed from the system`,
      color: 'red',
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('');
    setSelectedRole('');
    setSelectedStatus('');
    setSortBy('name');
    setSortOrder('asc');
  };

  // Statistics cards data
  const statsCards = [
    {
      title: 'Total Staff',
      value: mockStaffStats.totalStaff,
      icon: IconUsers,
      color: 'blue',
      trend: '+5%'
    },
    {
      title: 'Active Staff',
      value: mockStaffStats.activeStaff,
      icon: IconUserCheck,
      color: 'green',
      trend: '+2%'
    },
    {
      title: 'On Leave',
      value: mockStaffStats.staffOnLeave,
      icon: IconCalendarEvent,
      color: 'orange',
      trend: '-1%'
    },
    {
      title: 'New Hires',
      value: mockStaffStats.newHiresThisMonth,
      icon: IconUserPlus,
      color: 'teal',
      trend: '+50%'
    }
  ];

  // Chart data
  const roleDistributionData = Object.entries(mockStaffStats.roleDistribution)
    .filter(([_, count]) => count > 0)
    .map(([role, count]) => ({
      name: role.replace('_', ' ').toUpperCase(),
      value: count,
      color: getRoleBadgeColor(role as UserRole)
    }));

  const departmentDistributionData = Object.entries(mockStaffStats.departmentDistribution).map(
    ([dept, count]) => ({ department: dept, count })
  );

  const hiringTrendsData = mockStaffStats.hiringTrends.map(trend => ({
    month: trend.month,
    hired: trend.hired,
    resigned: trend.resigned
  }));

  return (
    <Container size="xl" py="md">
      {/* Header */}
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={1}>Staff Management</Title>
          <Text c="dimmed" size="sm">
            Manage hospital staff, schedules, and performance
          </Text>
        </div>
        <Group>
          <Button
            leftSection={<IconUserPlus size={16} />}
            onClick={openAddStaff}
          >
            Add Staff
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
          <Tabs.Tab value="list" leftSection={<IconUsers size={16} />}>
            Staff List
          </Tabs.Tab>
          <Tabs.Tab value="departments" leftSection={<IconBuilding size={16} />}>
            Departments
          </Tabs.Tab>
          <Tabs.Tab value="shifts" leftSection={<IconClock size={16} />}>
            Shifts & Schedules
          </Tabs.Tab>
          <Tabs.Tab value="attendance" leftSection={<IconCalendarStats size={16} />}>
            Attendance
          </Tabs.Tab>
          <Tabs.Tab value="analytics" leftSection={<IconChartBar size={16} />}>
            Analytics
          </Tabs.Tab>
        </Tabs.List>

        {/* Staff List Tab */}
        <Tabs.Panel value="list">
          <Paper p="md" radius="md" withBorder mt="md">
            {/* Search and Filters */}
            <Group mb="md">
              <TextInput
                placeholder="Search staff..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                style={{ flex: 1 }}
              />
              <Select
                placeholder="Department"
                data={mockDepartments.map(dept => ({ value: dept.name, label: dept.name }))}
                value={selectedDepartment}
                onChange={setSelectedDepartment}
                clearable
              />
              <Select
                placeholder="Role"
                data={[
                  { value: UserRole.DOCTOR, label: 'Doctor' },
                  { value: UserRole.NURSE, label: 'Nurse' },
                  { value: UserRole.TECHNICIAN, label: 'Technician' },
                  { value: UserRole.PHARMACIST, label: 'Pharmacist' },
                  { value: UserRole.ADMIN, label: 'Admin' }
                ]}
                value={selectedRole}
                onChange={setSelectedRole}
                clearable
              />
              <Select
                placeholder="Status"
                data={[
                  { value: Status.ACTIVE, label: 'Active' },
                  { value: Status.INACTIVE, label: 'Inactive' },
                  { value: Status.PENDING, label: 'Pending' }
                ]}
                value={selectedStatus}
                onChange={setSelectedStatus}
                clearable
              />
              <Button variant="light" onClick={clearFilters}>
                Clear Filters
              </Button>
            </Group>

            {/* Sort Controls */}
            <Group mb="md">
              <Select
                label="Sort by"
                data={[
                  { value: 'name', label: 'Name' },
                  { value: 'department', label: 'Department' },
                  { value: 'experience', label: 'Experience' },
                  { value: 'joiningDate', label: 'Joining Date' }
                ]}
                value={sortBy}
                onChange={(value) => setSortBy(value || 'name')}
              />
              <Select
                label="Order"
                data={[
                  { value: 'asc', label: 'Ascending' },
                  { value: 'desc', label: 'Descending' }
                ]}
                value={sortOrder}
                onChange={(value) => setSortOrder(value as 'asc' | 'desc' || 'asc')}
              />
            </Group>

            {/* Staff Table */}
            <ScrollArea>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Staff</Table.Th>
                    <Table.Th>ID</Table.Th>
                    <Table.Th>Role</Table.Th>
                    <Table.Th>Department</Table.Th>
                    <Table.Th>Experience</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredStaff.map((staff) => (
                    <Table.Tr key={staff.id}>
                      <Table.Td>
                        <Group>
                          <Avatar color="blue" radius="xl">
                            {staff.firstName[0]}{staff.lastName[0]}
                          </Avatar>
                          <div>
                            <Text fw={500}>
                              {staff.firstName} {staff.lastName}
                            </Text>
                            <Text size="sm" c="dimmed">
                              {staff.contactInfo.email}
                            </Text>
                          </div>
                        </Group>
                      </Table.Td>
                      <Table.Td>{staff.staffId}</Table.Td>
                      <Table.Td>
                        <Badge color={getRoleBadgeColor(staff.role)} variant="light">
                          {staff.role.replace('_', ' ')}
                        </Badge>
                      </Table.Td>
                      <Table.Td>{staff.department.name}</Table.Td>
                      <Table.Td>{staff.experience} years</Table.Td>
                      <Table.Td>
                        <Badge color={getStatusBadgeColor(staff.status)} variant="light">
                          {staff.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => handleViewStaff(staff)}
                          >
                            <IconEye size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="subtle"
                            color="green"
                            onClick={() => handleEditStaff(staff)}
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
                                leftSection={<IconTrash size={14} />}
                                color="red"
                                onClick={() => handleDeleteStaff(staff)}
                              >
                                Delete
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

        {/* Departments Tab */}
        <Tabs.Panel value="departments">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Departments</Title>
              <Button leftSection={<IconPlus size={16} />}>
                Add Department
              </Button>
            </Group>
            
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
              {mockDepartments.map((dept) => (
                <Card key={dept.id} padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Text fw={600} size="lg">{dept.name}</Text>
                      <Text size="sm" c="dimmed">{dept.code}</Text>
                    </div>
                    <ThemeIcon size="lg" color="blue" variant="light">
                      <IconMedicalCross size={20} />
                    </ThemeIcon>
                  </Group>
                  
                  <Text size="sm" mb="md">{dept.description}</Text>
                  
                  <Stack gap="xs">
                    <Group>
                      <Text size="sm" fw={500}>Head:</Text>
                      <Text size="sm">{dept.headOfDepartment}</Text>
                    </Group>
                    <Group>
                      <Text size="sm" fw={500}>Location:</Text>
                      <Text size="sm">{dept.location}</Text>
                    </Group>
                    <Group>
                      <Text size="sm" fw={500}>Staff Count:</Text>
                      <Text size="sm">
                        {mockStaffStats.departmentDistribution[dept.name] || 0}
                      </Text>
                    </Group>
                  </Stack>
                  
                  <Group justify="flex-end" mt="md">
                    <ActionIcon variant="subtle" color="blue">
                      <IconEye size={16} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="green">
                      <IconEdit size={16} />
                    </ActionIcon>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>

        {/* Shifts & Schedules Tab */}
        <Tabs.Panel value="shifts">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Shifts & Schedules</Title>
              <Button leftSection={<IconCalendar size={16} />}>
                Schedule Shift
              </Button>
            </Group>
            
            <SimpleGrid cols={{ base: 1, lg: 2 }} mb="lg">
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Today&apos;s Shifts</Title>
                <Stack gap="md">
                  {mockShifts.map((shift) => {
                    const staff = mockStaff.find(s => s.staffId === shift.staffId);
                    return (
                      <Group key={shift.id} justify="space-between" p="sm" style={{ border: '1px solid #e9ecef', borderRadius: '8px' }}>
                        <div>
                          <Text fw={500}>
                            {staff ? `${staff.firstName} ${staff.lastName}` : 'Unknown Staff'}
                          </Text>
                          <Text size="sm" c="dimmed">
                            {shift.startTime} - {shift.endTime} | {shift.department}
                          </Text>
                        </div>
                        <Badge 
                          color={shift.status === 'scheduled' ? 'blue' : 
                                shift.status === 'in_progress' ? 'green' : 'gray'}
                          variant="light"
                        >
                          {shift.status.replace('_', ' ')}
                        </Badge>
                      </Group>
                    );
                  })}
                </Stack>
              </Card>
              
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Shift Statistics</Title>
                <Stack gap="md">
                  <Group justify="space-between">
                    <Text>Scheduled Shifts</Text>
                    <Badge color="blue" variant="light">8</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text>In Progress</Text>
                    <Badge color="green" variant="light">3</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text>Completed</Text>
                    <Badge color="gray" variant="light">12</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text>No Show</Text>
                    <Badge color="red" variant="light">1</Badge>
                  </Group>
                </Stack>
              </Card>
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>

        {/* Attendance Tab */}
        <Tabs.Panel value="attendance">
          <Paper p="md" radius="md" withBorder mt="md">
            <Title order={3} mb="lg">Attendance Overview</Title>
            
            <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} mb="lg">
              <Card padding="md" radius="md" withBorder>
                <Group justify="center">
                  <ThemeIcon size="xl" color="green" variant="light">
                    <IconUserCheck size={24} />
                  </ThemeIcon>
                </Group>
                <Text ta="center" fw={600} size="lg" mt="sm">
                  {mockStaffStats.attendanceMetrics.presentToday}
                </Text>
                <Text ta="center" size="sm" c="dimmed">Present Today</Text>
              </Card>
              
              <Card padding="md" radius="md" withBorder>
                <Group justify="center">
                  <ThemeIcon size="xl" color="red" variant="light">
                    <IconUserX size={24} />
                  </ThemeIcon>
                </Group>
                <Text ta="center" fw={600} size="lg" mt="sm">
                  {mockStaffStats.attendanceMetrics.absentToday}
                </Text>
                <Text ta="center" size="sm" c="dimmed">Absent Today</Text>
              </Card>
              
              <Card padding="md" radius="md" withBorder>
                <Group justify="center">
                  <ThemeIcon size="xl" color="orange" variant="light">
                    <IconClockHour3 size={24} />
                  </ThemeIcon>
                </Group>
                <Text ta="center" fw={600} size="lg" mt="sm">
                  {mockStaffStats.attendanceMetrics.lateToday}
                </Text>
                <Text ta="center" size="sm" c="dimmed">Late Today</Text>
              </Card>
              
              <Card padding="md" radius="md" withBorder>
                <Group justify="center">
                  <ThemeIcon size="xl" color="blue" variant="light">
                    <IconCalendarEvent size={24} />
                  </ThemeIcon>
                </Group>
                <Text ta="center" fw={600} size="lg" mt="sm">
                  {mockStaffStats.attendanceMetrics.onLeaveToday}
                </Text>
                <Text ta="center" size="sm" c="dimmed">On Leave</Text>
              </Card>
            </SimpleGrid>
            
            {/* Recent Attendance */}
            <Card padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">Recent Attendance Records</Title>
              <ScrollArea>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Staff</Table.Th>
                      <Table.Th>Date</Table.Th>
                      <Table.Th>Clock In</Table.Th>
                      <Table.Th>Clock Out</Table.Th>
                      <Table.Th>Hours</Table.Th>
                      <Table.Th>Status</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {mockAttendance.map((record) => {
                      const staff = mockStaff.find(s => s.staffId === record.staffId);
                      return (
                        <Table.Tr key={record.id}>
                          <Table.Td>
                            {staff ? `${staff.firstName} ${staff.lastName}` : 'Unknown'}
                          </Table.Td>
                          <Table.Td>
                            {new Date(record.date).toLocaleDateString()}
                          </Table.Td>
                          <Table.Td>
                            {record.clockIn ? new Date(record.clockIn).toLocaleTimeString() : '-'}
                          </Table.Td>
                          <Table.Td>
                            {record.clockOut ? new Date(record.clockOut).toLocaleTimeString() : '-'}
                          </Table.Td>
                          <Table.Td>{record.totalHours || 0}h</Table.Td>
                          <Table.Td>
                            <Badge 
                              color={record.status === 'present' ? 'green' : 
                                    record.status === 'on_leave' ? 'orange' : 'red'}
                              variant="light"
                            >
                              {record.status.replace('_', ' ')}
                            </Badge>
                          </Table.Td>
                        </Table.Tr>
                      );
                    })}
                  </Table.Tbody>
                </Table>
              </ScrollArea>
            </Card>
          </Paper>
        </Tabs.Panel>

        {/* Analytics Tab */}
        <Tabs.Panel value="analytics">
          <Paper p="md" radius="md" withBorder mt="md">
            <Title order={3} mb="lg">Staff Analytics</Title>
            
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
              {/* Role Distribution */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Staff by Role</Title>
                <DonutChart
                  data={roleDistributionData}
                  size={160}
                  thickness={30}
                  withLabels
                />
              </Card>
              
              {/* Department Distribution */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Staff by Department</Title>
                <BarChart
                  h={200}
                  data={departmentDistributionData}
                  dataKey="department"
                  series={[{ name: 'count', color: 'blue.6' }]}
                />
              </Card>
              
              {/* Hiring Trends */}
              <Card padding="lg" radius="md" withBorder style={{ gridColumn: '1 / -1' }}>
                <Title order={4} mb="md">Hiring Trends</Title>
                <AreaChart
                  h={300}
                  data={hiringTrendsData}
                  dataKey="month"
                  series={[
                    { name: 'hired', color: 'green.6' },
                    { name: 'resigned', color: 'red.6' }
                  ]}
                  curveType="linear"
                />
              </Card>
              
              {/* Performance Metrics */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Performance Overview</Title>
                <Stack gap="md">
                  <div>
                    <Group justify="space-between" mb="xs">
                      <Text size="sm">Average Rating</Text>
                      <Text size="sm" fw={500}>{mockStaffStats.performanceMetrics.averageRating}/5.0</Text>
                    </Group>
                    <Progress value={mockStaffStats.performanceMetrics.averageRating * 20} color="green" />
                  </div>
                  
                  <div>
                    <Group justify="space-between" mb="xs">
                      <Text size="sm">Training Completion</Text>
                      <Text size="sm" fw={500}>{mockStaffStats.performanceMetrics.trainingCompletionRate}%</Text>
                    </Group>
                    <Progress value={mockStaffStats.performanceMetrics.trainingCompletionRate} color="blue" />
                  </div>
                  
                  <div>
                    <Group justify="space-between" mb="xs">
                      <Text size="sm">Average Attendance</Text>
                      <Text size="sm" fw={500}>{mockStaffStats.attendanceMetrics.averageAttendance}%</Text>
                    </Group>
                    <Progress value={mockStaffStats.attendanceMetrics.averageAttendance} color="teal" />
                  </div>
                </Stack>
              </Card>
              
              {/* Top Performers */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Top Performers</Title>
                <Stack gap="sm">
                  {mockStaffStats.performanceMetrics.topPerformers.map((performer, index) => (
                    <Group key={performer} justify="space-between" p="sm" style={{ backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                      <Group>
                        <ThemeIcon size="sm" color="gold" variant="light">
                          <IconAward size={14} />
                        </ThemeIcon>
                        <Text size="sm" fw={500}>{performer}</Text>
                      </Group>
                      <Badge color="gold" variant="light" size="sm">
                        #{index + 1}
                      </Badge>
                    </Group>
                  ))}
                </Stack>
              </Card>
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>
      </Tabs>

      {/* Staff Detail Modal */}
      <Modal
        opened={staffDetailOpened}
        onClose={closeStaffDetail}
        title="Staff Details"
        size="lg"
      >
        {selectedStaff && (
          <Stack gap="md">
            {/* Basic Info */}
            <Group>
              <Avatar size="xl" color="blue" radius="xl">
                {selectedStaff.firstName[0]}{selectedStaff.lastName[0]}
              </Avatar>
              <div>
                <Title order={3}>
                  {selectedStaff.firstName} {selectedStaff.lastName}
                </Title>
                <Text c="dimmed">{selectedStaff.staffId} • {selectedStaff.department.name}</Text>
                <Badge color={getRoleBadgeColor(selectedStaff.role)} variant="light" mt="xs">
                  {selectedStaff.role.replace('_', ' ')}
                </Badge>
              </div>
            </Group>

            <Divider />

            {/* Contact Information */}
            <div>
              <Title order={4} mb="sm">Contact Information</Title>
              <SimpleGrid cols={2}>
                <Group>
                  <IconPhone size={16} />
                  <Text size="sm">{selectedStaff.contactInfo.phone}</Text>
                </Group>
                <Group>
                  <IconMail size={16} />
                  <Text size="sm">{selectedStaff.contactInfo.email}</Text>
                </Group>
              </SimpleGrid>
            </div>

            {/* Professional Info */}
            <div>
              <Title order={4} mb="sm">Professional Information</Title>
              <SimpleGrid cols={2}>
                <div>
                  <Text size="sm" fw={500}>Experience</Text>
                  <Text size="sm" c="dimmed">{selectedStaff.experience} years</Text>
                </div>
                <div>
                  <Text size="sm" fw={500}>Joining Date</Text>
                  <Text size="sm" c="dimmed">
                    {new Date(selectedStaff.joiningDate).toLocaleDateString()}
                  </Text>
                </div>
                <div>
                  <Text size="sm" fw={500}>Employment Type</Text>
                  <Text size="sm" c="dimmed">{selectedStaff.employmentType?.replace('_', ' ')}</Text>
                </div>
                <div>
                  <Text size="sm" fw={500}>Status</Text>
                  <Badge color={getStatusBadgeColor(selectedStaff.status)} variant="light" size="sm">
                    {selectedStaff.status}
                  </Badge>
                </div>
              </SimpleGrid>
            </div>

            {/* Performance Metrics */}
            {selectedStaff.performanceMetrics && (
              <div>
                <Title order={4} mb="sm">Performance Metrics</Title>
                <SimpleGrid cols={2}>
                  <div>
                    <Text size="sm" fw={500}>Patient Rating</Text>
                    <Text size="sm" c="dimmed">{selectedStaff.performanceMetrics.averagePatientRating}/5.0</Text>
                  </div>
                  <div>
                    <Text size="sm" fw={500}>Patients Handled</Text>
                    <Text size="sm" c="dimmed">{selectedStaff.performanceMetrics.totalPatientsHandled}</Text>
                  </div>
                  <div>
                    <Text size="sm" fw={500}>Attendance</Text>
                    <Text size="sm" c="dimmed">{selectedStaff.performanceMetrics.attendancePercentage}%</Text>
                  </div>
                  <div>
                    <Text size="sm" fw={500}>Punctuality</Text>
                    <Text size="sm" c="dimmed">{selectedStaff.performanceMetrics.punctualityScore}%</Text>
                  </div>
                </SimpleGrid>
              </div>
            )}

            <Group justify="flex-end">
              <Button variant="light" onClick={closeStaffDetail}>
                Close
              </Button>
              <Button onClick={() => handleEditStaff(selectedStaff)}>
                Edit Staff
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Add Staff Modal */}
      <Modal
        opened={addStaffOpened}
        onClose={closeAddStaff}
        title="Add New Staff"
        size="lg"
      >
        <Stack gap="md">
          <SimpleGrid cols={2}>
            <TextInput
              label="First Name"
              placeholder="Enter first name"
              required
            />
            <TextInput
              label="Last Name"
              placeholder="Enter last name"
              required
            />
          </SimpleGrid>
          
          <SimpleGrid cols={2}>
            <TextInput
              label="Email"
              placeholder="Enter email"
              required
            />
            <TextInput
              label="Phone"
              placeholder="Enter phone number"
              required
            />
          </SimpleGrid>
          
          <SimpleGrid cols={2}>
            <Select
              label="Role"
              placeholder="Select role"
              data={[
                { value: UserRole.DOCTOR, label: 'Doctor' },
                { value: UserRole.NURSE, label: 'Nurse' },
                { value: UserRole.TECHNICIAN, label: 'Technician' },
                { value: UserRole.PHARMACIST, label: 'Pharmacist' }
              ]}
              required
            />
            <Select
              label="Department"
              placeholder="Select department"
              data={mockDepartments.map(dept => ({ value: dept.name, label: dept.name }))}
              required
            />
          </SimpleGrid>
          
          <NumberInput
            label="Experience (years)"
            placeholder="Enter years of experience"
            min={0}
            max={50}
          />
          
          <Group justify="flex-end">
            <Button variant="light" onClick={closeAddStaff}>
              Cancel
            </Button>
            <Button onClick={() => {
              notifications.show({
                title: 'Success',
                message: 'New staff member added successfully',
                color: 'green',
              });
              closeAddStaff();
            }}>
              Add Staff
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default StaffManagement;