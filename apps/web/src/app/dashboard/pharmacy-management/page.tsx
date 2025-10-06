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
  ThemeIcon
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DonutChart, BarChart, LineChart } from '@mantine/charts';
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconEye,
  IconTrash,
  IconPill,
  IconAlertTriangle,
  IconX,
  IconDotsVertical,
  IconChartBar,
  IconDownload,
  IconBarcode,
  IconSyringe,
  IconShieldAlert,
  IconFileText,
  IconPackage,
  IconCash,
  IconActivity
} from '@tabler/icons-react';

// Import types (simplified for now)
interface Medication {
  id: string;
  name: string;
  genericName?: string;
  manufacturer?: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  unitPrice: number;
  status: string;
  batchNumber?: string;
  expiryDate?: string;
  location?: string;
}

interface Prescription {
  id: string;
  prescriptionId: string;
  patientName: string;
  doctorName: string;
  date: string;
  status: string;
  totalAmount: number;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
  }>;
}

// Mock data (simplified for now)
const mockMedications: Medication[] = [
  {
    id: '1',
    name: 'Paracetamol',
    genericName: 'Acetaminophen',
    manufacturer: 'Abbott',
    category: 'Analgesic',
    currentStock: 500,
    minimumStock: 50,
    unitPrice: 2.5,
    status: 'in_stock',
    batchNumber: 'PAR001',
    expiryDate: '2025-12-31',
    location: 'A1-B2'
  },
  {
    id: '2',
    name: 'Amoxicillin',
    genericName: 'Amoxicillin',
    manufacturer: 'GSK',
    category: 'Antibiotic',
    currentStock: 25,
    minimumStock: 30,
    unitPrice: 15.0,
    status: 'low_stock',
    batchNumber: 'AMX001',
    expiryDate: '2025-08-15',
    location: 'A2-B1'
  }
];

const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    prescriptionId: 'RX-001',
    patientName: 'John Doe',
    doctorName: 'Dr. Smith',
    date: '2024-01-15',
    status: 'pending',
    totalAmount: 150.0,
    medications: [
      {
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '5 days',
        quantity: 10
      }
    ]
  }
];

const mockPharmacyStats = {
  totalMedications: 1500,
  inStockItems: 1200,
  lowStockItems: 50,
  outOfStockItems: 25,
  totalPrescriptions: 2500,
  monthlyRevenue: 500000,
  medicationsByCategory: [
    { category: 'Analgesic', count: 300 },
    { category: 'Antibiotic', count: 250 },
    { category: 'Cardiovascular', count: 200 },
    { category: 'Antidiabetic', count: 150 }
  ],
  expiringMedications: [
    { name: 'Aspirin', expiryDate: '2024-02-15', quantity: 50 },
    { name: 'Metformin', expiryDate: '2024-03-10', quantity: 30 }
  ]
};

const PharmacyManagement = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'overview' | 'medications' | 'prescriptions' | 'inventory' | 'dispensing' | 'interactions' | 'analytics'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedMedication, setSelectedMedication] = useState<any>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);

  // Modal states
  const [medicationDetailOpened, { open: openMedicationDetail, close: closeMedicationDetail }] = useDisclosure(false);
  const [prescriptionDetailOpened, { open: openPrescriptionDetail, close: closePrescriptionDetail }] = useDisclosure(false);
  const [dispenseMedicationOpened, { open: openDispenseMedication, close: closeDispenseMedication }] = useDisclosure(false);

  // Filter medications
  const filteredMedications = useMemo(() => {
    return mockMedications.filter((med) => {
      const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.genericName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || med.category === selectedCategory;
      const matchesStatus = !selectedStatus || med.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchQuery, selectedCategory, selectedStatus]);

  // Filter prescriptions
  const filteredPrescriptions = useMemo(() => {
    return mockPrescriptions.filter((prescription) => {
      const matchesSearch = prescription.prescriptionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prescription.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prescription.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !selectedStatus || prescription.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedStatus]);

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock':
      case 'dispensed':
      case 'completed':
      case 'paid':
        return 'green';
      case 'low_stock':
      case 'pending':
      case 'verified':
        return 'orange';
      case 'out_of_stock':
      case 'cancelled':
      case 'expired':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Analgesic': 'blue',
      'Antibiotic': 'green',
      'Cardiovascular': 'red',
      'Antidiabetic': 'purple',
      'Respiratory': 'cyan',
      'Neurological': 'pink'
    };
    return colors[category as keyof typeof colors] || 'gray';
  };

  const handleViewMedication = (medication: any) => {
    setSelectedMedication(medication);
    openMedicationDetail();
  };

  const handleViewPrescription = (prescription: any) => {
    setSelectedPrescription(prescription);
    openPrescriptionDetail();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedStatus('');
  };

  // Statistics cards data
  const statsCards = [
    {
      title: 'Total Medications',
      value: mockPharmacyStats.totalMedications,
      icon: IconPill,
      color: 'blue',
      trend: '+5.2%'
    },
    {
      title: 'In Stock Items',
      value: mockPharmacyStats.inStockItems,
      icon: IconPackage,
      color: 'green',
      trend: '+2.1%'
    },
    {
      title: 'Low Stock Alerts',
      value: mockPharmacyStats.lowStockItems,
      icon: IconAlertTriangle,
      color: 'orange',
      trend: '-8.5%'
    },
    {
      title: 'Out of Stock',
      value: mockPharmacyStats.outOfStockItems,
      icon: IconX,
      color: 'red',
      trend: '-15.3%'
    },
    {
      title: 'Total Prescriptions',
      value: mockPharmacyStats.totalPrescriptions,
      icon: IconFileText,
      color: 'indigo',
      trend: '+7.8%'
    },
    {
      title: 'Monthly Revenue',
      value: `₹${(mockPharmacyStats.monthlyRevenue / 100000).toFixed(1)}L`,
      icon: IconCash,
      color: 'teal',
      trend: '+12.4%'
    }
  ];

  return (
    <Container size="xl" py="md">
      {/* Header */}
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={1}>Pharmacy Management</Title>
          <Text c="dimmed" size="sm">
            Manage medications, prescriptions, inventory, and dispensing operations
          </Text>
        </div>
        <Group>
          <Button leftSection={<IconPlus size={16} />}>
            Add Medication
          </Button>
          <Button variant="light" leftSection={<IconFileText size={16} />}>
            New Prescription
          </Button>
        </Group>
      </Group>

      {/* Statistics Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 6 }} mb="lg">
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

      {/* Main Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="overview" leftSection={<IconChartBar size={16} />}>
            Overview
          </Tabs.Tab>
          <Tabs.Tab value="medications" leftSection={<IconPill size={16} />}>
            Medications
          </Tabs.Tab>
          <Tabs.Tab value="prescriptions" leftSection={<IconFileText size={16} />}>
            Prescriptions
          </Tabs.Tab>
          <Tabs.Tab value="inventory" leftSection={<IconPackage size={16} />}>
            Inventory
          </Tabs.Tab>
          <Tabs.Tab value="dispensing" leftSection={<IconSyringe size={16} />}>
            Dispensing
          </Tabs.Tab>
          <Tabs.Tab value="interactions" leftSection={<IconShieldAlert size={16} />}>
            Drug Interactions
          </Tabs.Tab>
          <Tabs.Tab value="analytics" leftSection={<IconActivity size={16} />}>
            Analytics
          </Tabs.Tab>
        </Tabs.List>

        {/* Overview Tab */}
        <Tabs.Panel value="overview">
          <Paper p="md" radius="md" withBorder mt="md">
            <Title order={3} mb="lg">Pharmacy Dashboard</Title>
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Medications by Category</Title>
                <DonutChart
                  data={mockPharmacyStats.medicationsByCategory.map(item => ({
                    name: item.category,
                    value: item.count,
                    color: getCategoryColor(item.category)
                  }))}
                  size={160}
                  thickness={30}
                  withLabels
                />
              </Card>
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Expiring Medications</Title>
                <Stack gap="sm">
                  {mockPharmacyStats.expiringMedications.map((med, index) => (
                    <Group key={index} justify="space-between" p="sm" style={{ backgroundColor: '#fff3cd', borderRadius: '6px' }}>
                      <div>
                        <Text size="sm" fw={500}>{med.name}</Text>
                        <Text size="xs" c="dimmed">Expires: {med.expiryDate}</Text>
                      </div>
                      <Badge color="orange" size="sm">{med.quantity} units</Badge>
                    </Group>
                  ))}
                </Stack>
              </Card>
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>

        {/* Medications Tab */}
        <Tabs.Panel value="medications">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group mb="md">
              <TextInput
                placeholder="Search medications..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                style={{ flex: 1 }}
              />
              <Select
                placeholder="Category"
                data={[
                  { value: 'Analgesic', label: 'Analgesic' },
                  { value: 'Antibiotic', label: 'Antibiotic' },
                  { value: 'Cardiovascular', label: 'Cardiovascular' },
                  { value: 'Antidiabetic', label: 'Antidiabetic' }
                ]}
                value={selectedCategory}
                onChange={setSelectedCategory}
                clearable
              />
              <Select
                placeholder="Status"
                data={[
                  { value: 'in_stock', label: 'In Stock' },
                  { value: 'low_stock', label: 'Low Stock' },
                  { value: 'out_of_stock', label: 'Out of Stock' }
                ]}
                value={selectedStatus}
                onChange={setSelectedStatus}
                clearable
              />
              <Button variant="light" onClick={clearFilters}>
                Clear Filters
              </Button>
            </Group>

            <ScrollArea>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Medication</Table.Th>
                    <Table.Th>Generic Name</Table.Th>
                    <Table.Th>Category</Table.Th>
                    <Table.Th>Stock</Table.Th>
                    <Table.Th>Price</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredMedications.map((medication) => (
                    <Table.Tr key={medication.id}>
                      <Table.Td>
                        <Group>
                          <ThemeIcon color={getCategoryColor(medication.category)} variant="light">
                            <IconPill size={16} />
                          </ThemeIcon>
                          <div>
                            <Text fw={500}>{medication.name}</Text>
                            <Text size="xs" c="dimmed">{medication.manufacturer}</Text>
                          </div>
                        </Group>
                      </Table.Td>
                      <Table.Td>{medication.genericName || 'N/A'}</Table.Td>
                      <Table.Td>
                        <Badge color={getCategoryColor(medication.category)} variant="light">
                          {medication.category}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={medication.currentStock <= medication.minimumStock ? 700 : 500} 
                              c={medication.currentStock <= medication.minimumStock ? 'red' : undefined}>
                          {medication.currentStock}
                        </Text>
                        <Text size="xs" c="dimmed">Min: {medication.minimumStock}</Text>
                      </Table.Td>
                      <Table.Td>₹{medication.unitPrice}</Table.Td>
                      <Table.Td>
                        <Badge color={getStatusColor(medication.status)} variant="light">
                          {medication.status.replace('_', ' ')}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon color="blue" variant="subtle" onClick={() => handleViewMedication(medication)}>
                            <IconEye size={16} />
                          </ActionIcon>
                          <ActionIcon color="green" variant="subtle">
                            <IconEdit size={16} />
                          </ActionIcon>
                          <Menu>
                            <Menu.Target>
                              <ActionIcon color="gray" variant="subtle">
                                <IconDotsVertical size={16} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item leftSection={<IconBarcode size={14} />}>Print Barcode</Menu.Item>
                              <Menu.Item leftSection={<IconDownload size={14} />}>Export Details</Menu.Item>
                              <Menu.Divider />
                              <Menu.Item leftSection={<IconTrash size={14} />} color="red">Delete</Menu.Item>
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

        {/* Analytics Tab */}
        <Tabs.Panel value="analytics">
          <Paper p="md" radius="md" withBorder mt="md">
            <Title order={3} mb="lg">Pharmacy Analytics</Title>
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Revenue Trend</Title>
                <LineChart
                  h={200}
                  data={[
                    { month: 'Jan', revenue: 280000 },
                    { month: 'Feb', revenue: 295000 },
                    { month: 'Mar', revenue: 320000 },
                    { month: 'Apr', revenue: 315000 },
                    { month: 'May', revenue: 340000 },
                    { month: 'Jun', revenue: 325000 }
                  ]}
                  dataKey="month"
                  series={[{ name: 'revenue', color: 'blue.6' }]}
                  curveType="linear"
                />
              </Card>
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Top Selling Medications</Title>
                <BarChart
                  h={200}
                  data={[
                    { medication: 'Paracetamol', sales: 1500 },
                    { medication: 'Amoxicillin', sales: 1200 },
                    { medication: 'Metformin', sales: 800 },
                    { medication: 'Amlodipine', sales: 600 },
                    { medication: 'Omeprazole', sales: 500 }
                  ]}
                  dataKey="medication"
                  series={[{ name: 'sales', color: 'teal.6' }]}
                />
              </Card>
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>

        {/* Other tabs simplified for now */}
        <Tabs.Panel value="prescriptions">
          <Paper p="md" radius="md" withBorder mt="md">
            <Title order={3}>Prescriptions</Title>
            <Text c="dimmed" mt="sm">Prescription management will be implemented here.</Text>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="inventory">
          <Paper p="md" radius="md" withBorder mt="md">
            <Title order={3}>Inventory Management</Title>
            <Text c="dimmed" mt="sm">Inventory tracking will be implemented here.</Text>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="dispensing">
          <Paper p="md" radius="md" withBorder mt="md">
            <Title order={3}>Dispensing</Title>
            <Text c="dimmed" mt="sm">Medication dispensing interface will be implemented here.</Text>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="interactions">
          <Paper p="md" radius="md" withBorder mt="md">
            <Title order={3}>Drug Interactions</Title>
            <Text c="dimmed" mt="sm">Drug interaction checking will be implemented here.</Text>
          </Paper>
        </Tabs.Panel>
      </Tabs>

      {/* Modals */}
      <Modal opened={medicationDetailOpened} onClose={closeMedicationDetail} title="Medication Details" size="lg">
        {selectedMedication && (
          <Stack gap="md">
            <Group>
              <ThemeIcon color={getCategoryColor(selectedMedication.category)} size="xl" variant="light">
                <IconPill size={24} />
              </ThemeIcon>
              <div>
                <Title order={3}>{selectedMedication.name}</Title>
                <Text c="dimmed">{selectedMedication.genericName}</Text>
                <Badge color={getStatusColor(selectedMedication.status)} variant="light" mt="xs">
                  {selectedMedication.status.replace('_', ' ')}
                </Badge>
              </div>
            </Group>
            <Divider />
            <SimpleGrid cols={2}>
              <Text size="sm"><strong>Manufacturer:</strong> {selectedMedication.manufacturer}</Text>
              <Text size="sm"><strong>Category:</strong> {selectedMedication.category}</Text>
              <Text size="sm"><strong>Unit Price:</strong> ₹{selectedMedication.unitPrice}</Text>
              <Text size="sm"><strong>Current Stock:</strong> {selectedMedication.currentStock}</Text>
              <Text size="sm"><strong>Min Stock:</strong> {selectedMedication.minimumStock}</Text>
              <Text size="sm"><strong>Batch:</strong> {selectedMedication.batchNumber}</Text>
              <Text size="sm"><strong>Expiry:</strong> {selectedMedication.expiryDate}</Text>
              <Text size="sm"><strong>Location:</strong> {selectedMedication.location}</Text>
            </SimpleGrid>
            <Group justify="flex-end">
              <Button variant="light" onClick={closeMedicationDetail}>Close</Button>
              <Button>Edit Medication</Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Container>
  );
};

export default PharmacyManagement;