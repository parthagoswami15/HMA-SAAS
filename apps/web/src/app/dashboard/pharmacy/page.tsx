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
  List,
  Spotlight,
  Tooltip,
  Image,
  Checkbox
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
  IconPill,
  IconChartBar,
  IconPhone,
  IconMail,
  IconAlertCircle,
  IconCheck,
  IconX,
  IconDotsVertical,
  IconMedicineSyrup,
  IconBottle,
  IconClipboardList,
  IconFileText,
  IconDownload,
  IconPrinter,
  IconShare,
  IconFlask,
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
  IconReportMedical,
  IconVial,
  IconAtom,
  IconHeartbeat,
  IconBrain,
  IconBone,
  IconActivity,
  IconMedicalCross,
  IconPackage,
  IconTruck,
  IconCash,
  IconReceipt,
  IconStethoscope,
  IconNotes,
  IconClock,
  IconTag,
  IconAlarm,
  IconInfoCircle
} from '@tabler/icons-react';

// Import types and mock data
import {
  Medication,
  MedicationCategory,
  MedicationStatus,
  DrugInteraction,
  InteractionSeverity,
  Prescription as PharmacyPrescription,
  PrescriptionStatus,
  Dispensation,
  PharmacyInventory,
  PharmacySupplier,
  PharmacyStats,
  PharmacyFilters
} from '../../../types/pharmacy';
import {
  mockMedications,
  mockDrugInteractions,
  mockPharmacyPrescriptions,
  mockDispensations,
  mockPharmacyInventory,
  mockPharmacySuppliers,
  mockPharmacyStats
} from '../../../lib/mockData/pharmacy';
import { mockPatients } from '../../../lib/mockData/patients';
import { mockStaff } from '../../../lib/mockData/staff';

const PharmacyManagement = () => {
  // State management
  const [activeTab, setActiveTab] = useState<string>('medications');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<PharmacyPrescription | null>(null);
  const [selectedDispensation, setSelectedDispensation] = useState<Dispensation | null>(null);

  // Modal states
  const [medicationDetailOpened, { open: openMedicationDetail, close: closeMedicationDetail }] = useDisclosure(false);
  const [addMedicationOpened, { open: openAddMedication, close: closeAddMedication }] = useDisclosure(false);
  const [prescriptionDetailOpened, { open: openPrescriptionDetail, close: closePrescriptionDetail }] = useDisclosure(false);
  const [dispensationOpened, { open: openDispensation, close: closeDispensation }] = useDisclosure(false);
  const [interactionCheckOpened, { open: openInteractionCheck, close: closeInteractionCheck }] = useDisclosure(false);

  // Filter medications
  const filteredMedications = useMemo(() => {
    return mockMedications.filter((medication) => {
      const matchesSearch = 
        medication.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medication.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medication.drugCode.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || medication.category === selectedCategory;
      const matchesStatus = !selectedStatus || medication.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchQuery, selectedCategory, selectedStatus]);

  // Filter prescriptions
  const filteredPrescriptions = useMemo(() => {
    return mockPharmacyPrescriptions.filter((prescription) => {
      const matchesSearch = 
        prescription.prescriptionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prescription.patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prescription.patient.lastName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = !selectedStatus || prescription.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedStatus]);

  // Filter dispensations
  const filteredDispensations = useMemo(() => {
    return mockDispensations.filter((dispensation) => {
      const matchesSearch = 
        dispensation.dispensationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dispensation.prescriptionNumber.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [searchQuery]);

  // Helper functions
  const getStatusColor = (status: MedicationStatus | PrescriptionStatus) => {
    switch (status) {
      case 'available':
      case 'dispensed':
      case 'completed': return 'green';
      case 'low_stock':
      case 'pending':
      case 'partial': return 'orange';
      case 'out_of_stock':
      case 'cancelled':
      case 'rejected': return 'red';
      case 'expired':
      case 'on_hold': return 'yellow';
      case 'discontinued': return 'dark';
      default: return 'gray';
    }
  };

  const getCategoryColor = (category: MedicationCategory) => {
    switch (category) {
      case 'antibiotic': return 'green';
      case 'analgesic': return 'blue';
      case 'cardiovascular': return 'red';
      case 'diabetes': return 'purple';
      case 'respiratory': return 'cyan';
      case 'gastrointestinal': return 'orange';
      case 'neurological': return 'pink';
      case 'dermatological': return 'yellow';
      case 'hormonal': return 'indigo';
      case 'oncology': return 'dark';
      case 'psychiatric': return 'teal';
      case 'ophthalmology': return 'lime';
      case 'immunosuppressant': return 'violet';
      default: return 'gray';
    }
  };

  const getSeverityColor = (severity: InteractionSeverity) => {
    switch (severity) {
      case 'mild': return 'green';
      case 'moderate': return 'yellow';
      case 'severe': return 'orange';
      case 'contraindicated': return 'red';
      default: return 'gray';
    }
  };

  const handleViewMedication = (medication: Medication) => {
    setSelectedMedication(medication);
    openMedicationDetail();
  };

  const handleViewPrescription = (prescription: PharmacyPrescription) => {
    setSelectedPrescription(prescription);
    openPrescriptionDetail();
  };

  const handleDispenseMedication = (dispensation: Dispensation) => {
    setSelectedDispensation(dispensation);
    openDispensation();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedStatus('');
    setSelectedSupplier('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStockLevel = (current: number, minimum: number) => {
    if (current === 0) return { level: 'Out of Stock', color: 'red', percentage: 0 };
    if (current <= minimum) return { level: 'Low Stock', color: 'orange', percentage: 30 };
    if (current <= minimum * 2) return { level: 'Normal', color: 'blue', percentage: 70 };
    return { level: 'Well Stocked', color: 'green', percentage: 100 };
  };

  // Statistics cards
  const statsCards = [
    {
      title: 'Total Medications',
      value: mockPharmacyStats.totalMedications,
      icon: IconPill,
      color: 'blue',
      trend: '+3.2%'
    },
    {
      title: 'Low Stock Items',
      value: mockPharmacyStats.lowStockMedications,
      icon: IconAlertCircle,
      color: 'orange',
      trend: '-8%'
    },
    {
      title: 'Prescriptions Today',
      value: 234,
      icon: IconReceipt,
      color: 'green',
      trend: '+12.5%'
    },
    {
      title: 'Revenue Today',
      value: formatCurrency(mockPharmacyStats.dailyRevenue),
      icon: IconCash,
      color: 'purple',
      trend: '+18.3%'
    }
  ];

  // Chart data
  const categoryDistribution = Object.entries(mockPharmacyStats.medicationsByCategory)
    .map(([category, count]) => ({
      name: category.replace('_', ' ').toUpperCase(),
      value: count,
      color: getCategoryColor(category as MedicationCategory)
    }));

  const prescriptionTrends = mockPharmacyStats.prescriptionTrends;
  const revenueData = mockPharmacyStats.monthlyRevenue;

  return (
    <Container size="xl" py="md">
      {/* Header */}
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={1}>Pharmacy Management</Title>
          <Text c="dimmed" size="sm">
            Manage medications, prescriptions, dispensing, and drug interactions
          </Text>
        </div>
        <Group>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={openAddMedication}
          >
            Add Medication
          </Button>
          <Button
            variant="light"
            leftSection={<IconShieldCheck size={16} />}
            onClick={openInteractionCheck}
          >
            Check Interactions
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
                <Text size="xs" c="dimmed">vs yesterday</Text>
              </Group>
            </Card>
          );
        })}
      </SimpleGrid>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="medications" leftSection={<IconPill size={16} />}>
            Medications
          </Tabs.Tab>
          <Tabs.Tab value="prescriptions" leftSection={<IconReceipt size={16} />}>
            Prescriptions
          </Tabs.Tab>
          <Tabs.Tab value="dispensing" leftSection={<IconBottle size={16} />}>
            Dispensing
          </Tabs.Tab>
          <Tabs.Tab value="inventory" leftSection={<IconPackage size={16} />}>
            Inventory
          </Tabs.Tab>
          <Tabs.Tab value="interactions" leftSection={<IconAlertTriangle size={16} />}>
            Drug Interactions
          </Tabs.Tab>
          <Tabs.Tab value="reports" leftSection={<IconChartBar size={16} />}>
            Reports
          </Tabs.Tab>
        </Tabs.List>

        {/* Medications Tab */}
        <Tabs.Panel value="medications">
          <Paper p="md" radius="md" withBorder mt="md">
            {/* Search and Filters */}
            <Group mb="md">
              <TextInput
                placeholder="Search medications..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                style={{ flex: 1 }}
              />
              <Select
                placeholder="Category"
                data={[
                  { value: 'antibiotic', label: 'Antibiotic' },
                  { value: 'analgesic', label: 'Analgesic' },
                  { value: 'cardiovascular', label: 'Cardiovascular' },
                  { value: 'diabetes', label: 'Diabetes' },
                  { value: 'respiratory', label: 'Respiratory' },
                  { value: 'gastrointestinal', label: 'Gastrointestinal' },
                  { value: 'neurological', label: 'Neurological' }
                ]}
                value={selectedCategory}
                onChange={setSelectedCategory}
                clearable
              />
              <Select
                placeholder="Status"
                data={[
                  { value: 'available', label: 'Available' },
                  { value: 'low_stock', label: 'Low Stock' },
                  { value: 'out_of_stock', label: 'Out of Stock' },
                  { value: 'expired', label: 'Expired' },
                  { value: 'discontinued', label: 'Discontinued' }
                ]}
                value={selectedStatus}
                onChange={setSelectedStatus}
                clearable
              />
              <Button variant="light" onClick={clearFilters}>
                Clear Filters
              </Button>
            </Group>

            {/* Medications Grid */}
            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
              {filteredMedications.map((medication) => {
                const stockInfo = getStockLevel(medication.quantityInStock, medication.minimumStockLevel);
                
                return (
                  <Card key={medication.id} padding="lg" radius="md" withBorder>
                    <Group justify="space-between" mb="md">
                      <div style={{ flex: 1 }}>
                        <Group>
                          <ThemeIcon 
                            color={getCategoryColor(medication.category)} 
                            variant="light" 
                            size="lg"
                          >
                            <IconPill size={20} />
                          </ThemeIcon>
                          <div>
                            <Text fw={600} size="sm" lineClamp={1}>
                              {medication.brandName}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {medication.genericName}
                            </Text>
                          </div>
                        </Group>
                      </div>
                      <Badge color={getStatusColor(medication.status)} variant="light" size="sm">
                        {medication.status.replace('_', ' ')}
                      </Badge>
                    </Group>

                    <Stack gap="sm" mb="md">
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Drug Code</Text>
                        <Text size="sm" fw={500}>{medication.drugCode}</Text>
                      </Group>

                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Strength</Text>
                        <Text size="sm" fw={500}>{medication.strength}</Text>
                      </Group>

                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Form</Text>
                        <Text size="sm">{medication.dosageForm}</Text>
                      </Group>

                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Price</Text>
                        <Text size="sm" fw={600}>{formatCurrency(medication.unitPrice)}</Text>
                      </Group>

                      <div>
                        <Group justify="space-between" mb="xs">
                          <Text size="sm" c="dimmed">Stock Level</Text>
                          <Text size="xs" c={stockInfo.color} fw={500}>
                            {stockInfo.level}
                          </Text>
                        </Group>
                        <Group justify="space-between" mb="xs">
                          <Text size="xs" c="dimmed">Available: {medication.quantityInStock}</Text>
                          <Text size="xs" c="dimmed">Min: {medication.minimumStockLevel}</Text>
                        </Group>
                        <Progress value={stockInfo.percentage} color={stockInfo.color} size="sm" />
                      </div>

                      {medication.expiryDate && (
                        <Group justify="space-between">
                          <Text size="sm" c="dimmed">Expires</Text>
                          <Text 
                            size="sm" 
                            c={new Date(medication.expiryDate) < new Date() ? 'red' : 'dimmed'}
                          >
                            {new Date(medication.expiryDate).toLocaleDateString()}
                          </Text>
                        </Group>
                      )}
                    </Stack>

                    <Group justify="space-between">
                      <Badge color={getCategoryColor(medication.category)} variant="light" size="xs">
                        {medication.category.replace('_', ' ')}
                      </Badge>
                      <Group gap="xs">
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          onClick={() => handleViewMedication(medication)}
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
                            <Menu.Item leftSection={<IconBarcode size={14} />}>
                              Print Barcode
                            </Menu.Item>
                            <Menu.Item leftSection={<IconPackage size={14} />}>
                              Restock
                            </Menu.Item>
                            <Menu.Item leftSection={<IconShieldCheck size={14} />}>
                              Check Interactions
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item 
                              leftSection={<IconTrash size={14} />}
                              color="red"
                            >
                              Delete
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    </Group>
                  </Card>
                );
              })}
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>

        {/* Prescriptions Tab */}
        <Tabs.Panel value="prescriptions">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Prescriptions</Title>
              <Group>
                <Button leftSection={<IconBarcode size={16} />} variant="light">
                  Scan Prescription
                </Button>
                <Button leftSection={<IconPlus size={16} />}>
                  Manual Entry
                </Button>
              </Group>
            </Group>

            {/* Prescription Filters */}
            <Group mb="md">
              <TextInput
                placeholder="Search prescriptions..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                style={{ flex: 1 }}
              />
              <Select
                placeholder="Status"
                data={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'partial', label: 'Partial' },
                  { value: 'dispensed', label: 'Dispensed' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'cancelled', label: 'Cancelled' }
                ]}
                value={selectedStatus}
                onChange={setSelectedStatus}
                clearable
              />
            </Group>

            {/* Prescriptions Table */}
            <ScrollArea>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Prescription #</Table.Th>
                    <Table.Th>Patient</Table.Th>
                    <Table.Th>Doctor</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Medications</Table.Th>
                    <Table.Th>Total</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredPrescriptions.map((prescription) => (
                    <Table.Tr key={prescription.id}>
                      <Table.Td>
                        <Text fw={500}>{prescription.prescriptionNumber}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Group>
                          <Avatar color="blue" radius="xl" size="sm">
                            {prescription.patient.firstName[0]}{prescription.patient.lastName[0]}
                          </Avatar>
                          <div>
                            <Text size="sm" fw={500}>
                              {prescription.patient.firstName} {prescription.patient.lastName}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {prescription.patient.patientId}
                            </Text>
                          </div>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <div>
                          <Text size="sm" fw={500}>
                            {prescription.prescribingDoctor.firstName} {prescription.prescribingDoctor.lastName}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {prescription.prescribingDoctor.department?.name}
                          </Text>
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {new Date(prescription.prescriptionDate).toLocaleDateString()}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{prescription.medications.length} items</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={600}>
                          {formatCurrency(prescription.medications.reduce((sum, med) => sum + (med.cost || 0), 0))}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getStatusColor(prescription.status)} variant="light">
                          {prescription.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => handleViewPrescription(prescription)}
                          >
                            <IconEye size={16} />
                          </ActionIcon>
                          <ActionIcon variant="subtle" color="green">
                            <IconBottle size={16} />
                          </ActionIcon>
                          <ActionIcon variant="subtle" color="orange">
                            <IconPrinter size={16} />
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

        {/* Dispensing Tab */}
        <Tabs.Panel value="dispensing">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Medication Dispensing</Title>
              <Button leftSection={<IconBottle size={16} />}>
                New Dispensation
              </Button>
            </Group>

            {/* Dispensing Queue */}
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
              {filteredDispensations.map((dispensation) => (
                <Card key={dispensation.id} padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Text fw={600} size="lg">{dispensation.dispensationId}</Text>
                      <Text size="sm" c="dimmed">
                        Prescription: {dispensation.prescriptionNumber}
                      </Text>
                    </div>
                    <Badge 
                      color={dispensation.isCompleted ? 'green' : 'orange'} 
                      variant="light"
                    >
                      {dispensation.isCompleted ? 'Completed' : 'Pending'}
                    </Badge>
                  </Group>

                  <Stack gap="sm" mb="md">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Patient</Text>
                      <Text size="sm" fw={500}>{dispensation.patientName}</Text>
                    </Group>

                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Dispensed By</Text>
                      <Text size="sm">{dispensation.dispensedBy}</Text>
                    </Group>

                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Date</Text>
                      <Text size="sm">
                        {new Date(dispensation.dispensationDate).toLocaleDateString()}
                      </Text>
                    </Group>

                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Total Amount</Text>
                      <Text size="sm" fw={600}>{formatCurrency(dispensation.totalAmount)}</Text>
                    </Group>
                  </Stack>

                  <div>
                    <Text size="sm" fw={500} mb="sm">Medications</Text>
                    <Stack gap="xs">
                      {dispensation.medications.slice(0, 3).map((med, index) => (
                        <Group key={index} justify="space-between" p="xs" 
                               style={{ backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                          <Text size="sm">{med.medicationName}</Text>
                          <Text size="sm" fw={500}>Qty: {med.quantityDispensed}</Text>
                        </Group>
                      ))}
                      {dispensation.medications.length > 3 && (
                        <Text size="xs" c="dimmed" ta="center">
                          +{dispensation.medications.length - 3} more medications
                        </Text>
                      )}
                    </Stack>
                  </div>

                  {dispensation.notes && (
                    <Alert variant="light" color="blue" mt="md">
                      <Text size="sm">{dispensation.notes}</Text>
                    </Alert>
                  )}

                  <Group justify="space-between" mt="md">
                    <Text size="xs" c="dimmed">
                      Payment: {dispensation.paymentMethod}
                    </Text>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleDispenseMedication(dispensation)}
                      >
                        <IconEye size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="orange">
                        <IconReceipt size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="green">
                        <IconPrinter size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>

        {/* Inventory Tab */}
        <Tabs.Panel value="inventory">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Pharmacy Inventory</Title>
              <Group>
                <Button leftSection={<IconTruck size={16} />} variant="light">
                  Stock Arrival
                </Button>
                <Button leftSection={<IconPackage size={16} />}>
                  Stock Adjustment
                </Button>
              </Group>
            </Group>

            {/* Inventory Overview */}
            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
              {mockPharmacyInventory.map((item) => {
                const stockInfo = getStockLevel(item.currentStock, item.minimumStock);
                
                return (
                  <Card key={item.id} padding="md" radius="md" withBorder>
                    <Group justify="space-between" mb="sm">
                      <Text fw={600} size="sm" lineClamp={1}>
                        {item.medicationName}
                      </Text>
                      <Badge color={stockInfo.color} variant="light" size="xs">
                        {stockInfo.level}
                      </Badge>
                    </Group>

                    <Stack gap="xs" mb="sm">
                      <Group justify="space-between">
                        <Text size="xs" c="dimmed">Current Stock</Text>
                        <Text size="xs" fw={500}>{item.currentStock} {item.unit}</Text>
                      </Group>
                      
                      <Group justify="space-between">
                        <Text size="xs" c="dimmed">Min Stock</Text>
                        <Text size="xs" c="orange">{item.minimumStock}</Text>
                      </Group>
                      
                      <Group justify="space-between">
                        <Text size="xs" c="dimmed">Max Stock</Text>
                        <Text size="xs" c="green">{item.maximumStock}</Text>
                      </Group>

                      <Progress value={stockInfo.percentage} color={stockInfo.color} size="sm" />
                    </Stack>

                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">{item.location}</Text>
                      <Group gap="xs">
                        <ActionIcon variant="subtle" color="blue" size="sm">
                          <IconEye size={12} />
                        </ActionIcon>
                        <ActionIcon variant="subtle" color="green" size="sm">
                          <IconPackage size={12} />
                        </ActionIcon>
                      </Group>
                    </Group>
                  </Card>
                );
              })}
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>

        {/* Drug Interactions Tab */}
        <Tabs.Panel value="interactions">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Drug Interactions</Title>
              <Button leftSection={<IconShieldCheck size={16} />} onClick={openInteractionCheck}>
                Check Interaction
              </Button>
            </Group>

            {/* Critical Interactions Alert */}
            <Alert 
              variant="light" 
              color="red" 
              title="Critical Drug Interactions" 
              icon={<IconAlertTriangle size={16} />}
              mb="lg"
            >
              <Text size="sm">
                {mockDrugInteractions.filter(i => i.severity === 'contraindicated').length} contraindicated interactions found in current prescriptions.
              </Text>
            </Alert>

            {/* Interactions List */}
            <Stack gap="md">
              {mockDrugInteractions.map((interaction) => (
                <Card key={interaction.id} padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Text fw={600} size="lg">
                        {interaction.drug1} + {interaction.drug2}
                      </Text>
                      <Text size="sm" c="dimmed">
                        Interaction Type: {interaction.interactionType}
                      </Text>
                    </div>
                    <Badge color={getSeverityColor(interaction.severity)} variant="light" size="lg">
                      {interaction.severity.toUpperCase()}
                    </Badge>
                  </Group>

                  <Text size="sm" mb="md">
                    <strong>Description:</strong> {interaction.description}
                  </Text>

                  {interaction.clinicalSignificance && (
                    <Alert variant="light" color="orange" mb="md">
                      <Text size="sm">
                        <strong>Clinical Significance:</strong> {interaction.clinicalSignificance}
                      </Text>
                    </Alert>
                  )}

                  {interaction.management && (
                    <div>
                      <Text size="sm" fw={500} mb="xs">Management:</Text>
                      <Text size="sm" c="dimmed">
                        {interaction.management}
                      </Text>
                    </div>
                  )}
                </Card>
              ))}
            </Stack>
          </Paper>
        </Tabs.Panel>

        {/* Reports Tab */}
        <Tabs.Panel value="reports">
          <Paper p="md" radius="md" withBorder mt="md">
            <Title order={3} mb="lg">Pharmacy Reports & Analytics</Title>
            
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
              {/* Medication Distribution */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Medications by Category</Title>
                <DonutChart
                  data={categoryDistribution}
                  size={160}
                  thickness={30}
                  withLabels
                />
              </Card>
              
              {/* Prescription Trends */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Daily Prescription Volume</Title>
                <AreaChart
                  h={200}
                  data={prescriptionTrends}
                  dataKey="date"
                  series={[{ name: 'prescriptions', color: 'blue.6' }]}
                  curveType="linear"
                />
              </Card>
              
              {/* Monthly Revenue */}
              <Card padding="lg" radius="md" withBorder style={{ gridColumn: '1 / -1' }}>
                <Title order={4} mb="md">Monthly Pharmacy Revenue</Title>
                <LineChart
                  h={300}
                  data={revenueData}
                  dataKey="month"
                  series={[
                    { name: 'revenue', color: 'green.6', label: 'Revenue' },
                    { name: 'profit', color: 'blue.6', label: 'Profit' }
                  ]}
                  curveType="linear"
                />
              </Card>
              
              {/* Key Performance Indicators */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Key Performance Indicators</Title>
                <Stack gap="md">
                  <Group justify="space-between" p="sm" 
                         style={{ backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                    <Text size="sm" fw={500}>Dispensing Accuracy</Text>
                    <Text size="sm" fw={600} c="green">
                      {mockPharmacyStats.dispensingAccuracy}%
                    </Text>
                  </Group>
                  <Group justify="space-between" p="sm" 
                         style={{ backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                    <Text size="sm" fw={500}>Average Wait Time</Text>
                    <Text size="sm" fw={600}>
                      {mockPharmacyStats.averageWaitTime} min
                    </Text>
                  </Group>
                  <Group justify="space-between" p="sm" 
                         style={{ backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                    <Text size="sm" fw={500}>Inventory Turnover</Text>
                    <Text size="sm" fw={600}>
                      {mockPharmacyStats.inventoryTurnover}x
                    </Text>
                  </Group>
                  <Group justify="space-between" p="sm" 
                         style={{ backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                    <Text size="sm" fw={500}>Customer Satisfaction</Text>
                    <Text size="sm" fw={600} c="green">
                      {mockPharmacyStats.customerSatisfaction}%
                    </Text>
                  </Group>
                </Stack>
              </Card>
              
              {/* Quick Actions */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Quick Reports</Title>
                <Stack gap="sm">
                  <Button fullWidth leftSection={<IconDownload size={16} />} variant="light">
                    Export Sales Report
                  </Button>
                  <Button fullWidth leftSection={<IconFileText size={16} />} variant="light">
                    Inventory Aging Report
                  </Button>
                  <Button fullWidth leftSection={<IconAlertTriangle size={16} />} variant="light">
                    Drug Interaction Report
                  </Button>
                  <Button fullWidth leftSection={<IconChartBar size={16} />} variant="light">
                    Performance Analytics
                  </Button>
                </Stack>
              </Card>
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>
      </Tabs>

      {/* Medication Detail Modal */}
      <Modal
        opened={medicationDetailOpened}
        onClose={closeMedicationDetail}
        title="Medication Details"
        size="lg"
      >
        {selectedMedication && (
          <ScrollArea h={500}>
            <Stack gap="md">
              <Group>
                <ThemeIcon 
                  color={getCategoryColor(selectedMedication.category)} 
                  size="xl" 
                  variant="light"
                >
                  <IconPill size={24} />
                </ThemeIcon>
                <div>
                  <Title order={3}>{selectedMedication.brandName}</Title>
                  <Text c="dimmed">{selectedMedication.genericName}</Text>
                  <Badge color={getStatusColor(selectedMedication.status)} variant="light" mt="xs">
                    {selectedMedication.status.replace('_', ' ')}
                  </Badge>
                </div>
              </Group>

              <Divider />

              <SimpleGrid cols={2}>
                <div>
                  <Text size="sm" fw={500}>Drug Code</Text>
                  <Text size="sm" c="dimmed">{selectedMedication.drugCode}</Text>
                </div>
                <div>
                  <Text size="sm" fw={500}>Category</Text>
                  <Text size="sm" c="dimmed">{selectedMedication.category}</Text>
                </div>
                <div>
                  <Text size="sm" fw={500}>Strength</Text>
                  <Text size="sm" c="dimmed">{selectedMedication.strength}</Text>
                </div>
                <div>
                  <Text size="sm" fw={500}>Form</Text>
                  <Text size="sm" c="dimmed">{selectedMedication.dosageForm}</Text>
                </div>
                <div>
                  <Text size="sm" fw={500}>Unit Price</Text>
                  <Text size="sm" fw={600}>{formatCurrency(selectedMedication.unitPrice)}</Text>
                </div>
                <div>
                  <Text size="sm" fw={500}>Stock</Text>
                  <Text size="sm" fw={600}>{selectedMedication.quantityInStock}</Text>
                </div>
              </SimpleGrid>

              <div>
                <Text size="sm" fw={500} mb="sm">Description</Text>
                <Text size="sm">{selectedMedication.description}</Text>
              </div>

              {selectedMedication.sideEffects && selectedMedication.sideEffects.length > 0 && (
                <div>
                  <Text size="sm" fw={500} mb="sm">Side Effects</Text>
                  <List size="sm">
                    {selectedMedication.sideEffects.map((effect, index) => (
                      <List.Item key={index}>{effect}</List.Item>
                    ))}
                  </List>
                </div>
              )}

              {selectedMedication.contraindications && selectedMedication.contraindications.length > 0 && (
                <div>
                  <Text size="sm" fw={500} mb="sm">Contraindications</Text>
                  <List size="sm">
                    {selectedMedication.contraindications.map((contraindication, index) => (
                      <List.Item key={index}>{contraindication}</List.Item>
                    ))}
                  </List>
                </div>
              )}

              <Group justify="flex-end">
                <Button variant="light" onClick={closeMedicationDetail}>
                  Close
                </Button>
                <Button>
                  Edit Medication
                </Button>
              </Group>
            </Stack>
          </ScrollArea>
        )}
      </Modal>

      {/* Add Medication Modal */}
      <Modal
        opened={addMedicationOpened}
        onClose={closeAddMedication}
        title="Add New Medication"
        size="lg"
      >
        <Stack gap="md">
          <SimpleGrid cols={2}>
            <TextInput
              label="Brand Name"
              placeholder="Enter brand name"
              required
            />
            <TextInput
              label="Generic Name"
              placeholder="Enter generic name"
              required
            />
          </SimpleGrid>
          
          <SimpleGrid cols={2}>
            <TextInput
              label="Drug Code"
              placeholder="Enter drug code"
              required
            />
            <Select
              label="Category"
              placeholder="Select category"
              data={[
                { value: 'antibiotic', label: 'Antibiotic' },
                { value: 'analgesic', label: 'Analgesic' },
                { value: 'cardiovascular', label: 'Cardiovascular' },
                { value: 'diabetes', label: 'Diabetes' }
              ]}
              required
            />
          </SimpleGrid>
          
          <SimpleGrid cols={3}>
            <TextInput
              label="Strength"
              placeholder="e.g., 500mg"
              required
            />
            <Select
              label="Dosage Form"
              placeholder="Select form"
              data={[
                { value: 'tablet', label: 'Tablet' },
                { value: 'capsule', label: 'Capsule' },
                { value: 'syrup', label: 'Syrup' },
                { value: 'injection', label: 'Injection' }
              ]}
              required
            />
            <NumberInput
              label="Unit Price"
              placeholder="Enter price"
              leftSection="₹"
              min={0}
              required
            />
          </SimpleGrid>
          
          <SimpleGrid cols={2}>
            <NumberInput
              label="Initial Stock"
              placeholder="Enter quantity"
              min={0}
              required
            />
            <NumberInput
              label="Minimum Stock Level"
              placeholder="Min stock alert"
              min={0}
              required
            />
          </SimpleGrid>
          
          <Textarea
            label="Description"
            placeholder="Enter medication description"
            rows={3}
          />
          
          <Group justify="flex-end">
            <Button variant="light" onClick={closeAddMedication}>
              Cancel
            </Button>
            <Button onClick={() => {
              notifications.show({
                title: 'Success',
                message: 'Medication added successfully',
                color: 'green',
              });
              closeAddMedication();
            }}>
              Add Medication
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Interaction Check Modal */}
      <Modal
        opened={interactionCheckOpened}
        onClose={closeInteractionCheck}
        title="Drug Interaction Checker"
        size="md"
      >
        <Stack gap="md">
          <Alert variant="light" color="blue" icon={<IconInfoCircle size={16} />}>
            Select medications to check for potential interactions
          </Alert>
          
          <Select
            label="First Medication"
            placeholder="Select medication"
            data={mockMedications.map(med => ({ 
              value: med.id, 
              label: `${med.brandName} (${med.genericName})` 
            }))}
            searchable
          />
          
          <Select
            label="Second Medication"
            placeholder="Select medication"
            data={mockMedications.map(med => ({ 
              value: med.id, 
              label: `${med.brandName} (${med.genericName})` 
            }))}
            searchable
          />
          
          <Button fullWidth>
            Check Interactions
          </Button>
          
          <Group justify="flex-end">
            <Button variant="light" onClick={closeInteractionCheck}>
              Close
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default PharmacyManagement;