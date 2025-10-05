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
  Checkbox,
  Image,
  Indicator,
  RingProgress,
  Box
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
  IconPackage,
  IconChartBar,
  IconPhone,
  IconMail,
  IconAlertCircle,
  IconCheck,
  IconX,
  IconDotsVertical,
  IconBox,
  IconTruck,
  IconClipboardList,
  IconFileText,
  IconDownload,
  IconPrinter,
  IconShare,
  IconFlask,
  IconStethoscope,
  IconExclamationMark,
  IconClockHour4,
  IconTrendingUp,
  IconTrendingDown,
  IconUsers,
  IconCalculator,
  IconWallet,
  IconSettings,
  IconBuildingWarehouse,
  IconShoppingCart,
  IconRefresh,
  IconFilter,
  IconBarcode,
  IconTemperature,
  IconShieldCheck,
  IconAlertTriangle,
  IconCircleCheck,
  IconClipboard
} from '@tabler/icons-react';

// Import types and mock data
import {
  InventoryItem,
  ItemCategory,
  ItemStatus,
  StockTransaction,
  TransactionType,
  PurchaseOrder,
  OrderStatus,
  Supplier,
  Requisition,
  Equipment,
  EquipmentStatus,
  MaintenanceRecord,
  MaintenanceType,
  InventoryAlert,
  AlertType,
  InventoryStats,
  InventoryFilters
} from '../../../types/inventory';
import {
  mockInventoryItems,
  mockStockTransactions,
  mockPurchaseOrders,
  mockSuppliers,
  mockRequisitions,
  mockEquipment,
  mockMaintenanceRecords,
  mockInventoryAlerts,
  mockInventoryStats
} from '../../../lib/mockData/inventory';

const InventoryManagement = () => {
  // State management
  const [activeTab, setActiveTab] = useState<string>('items');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  // Modal states
  const [itemDetailOpened, { open: openItemDetail, close: closeItemDetail }] = useDisclosure(false);
  const [addItemOpened, { open: openAddItem, close: closeAddItem }] = useDisclosure(false);
  const [orderDetailOpened, { open: openOrderDetail, close: closeOrderDetail }] = useDisclosure(false);
  const [addOrderOpened, { open: openAddOrder, close: closeAddOrder }] = useDisclosure(false);
  const [equipmentDetailOpened, { open: openEquipmentDetail, close: closeEquipmentDetail }] = useDisclosure(false);

  // Filter inventory items
  const filteredItems = useMemo(() => {
    return mockInventoryItems.filter((item) => {
      const matchesSearch = 
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const matchesStatus = !selectedStatus || item.status === selectedStatus;
      const matchesSupplier = !selectedSupplier || item.supplierId === selectedSupplier;

      return matchesSearch && matchesCategory && matchesStatus && matchesSupplier;
    });
  }, [searchQuery, selectedCategory, selectedStatus, selectedSupplier]);

  // Filter purchase orders
  const filteredOrders = useMemo(() => {
    return mockPurchaseOrders.filter((order) => {
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.supplier.companyName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = !selectedStatus || order.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedStatus]);

  // Filter equipment
  const filteredEquipment = useMemo(() => {
    return mockEquipment.filter((equipment) => {
      const matchesSearch = 
        equipment.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        equipment.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        equipment.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = !selectedStatus || equipment.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedStatus]);

  // Helper functions
  const getStatusColor = (status: ItemStatus | OrderStatus | EquipmentStatus) => {
    switch (status) {
      case 'in_stock':
      case 'delivered':
      case 'operational':
      case 'available': return 'green';
      case 'low_stock':
      case 'pending':
      case 'maintenance':
      case 'in_use': return 'orange';
      case 'out_of_stock':
      case 'cancelled':
      case 'out_of_service':
      case 'retired': return 'red';
      case 'expired':
      case 'ordered': return 'yellow';
      case 'damaged': return 'dark';
      default: return 'gray';
    }
  };

  const getCategoryColor = (category: ItemCategory) => {
    switch (category) {
      case 'medication': return 'blue';
      case 'medical_supplies': return 'green';
      case 'surgical_instruments': return 'purple';
      case 'laboratory': return 'orange';
      case 'radiology': return 'cyan';
      case 'consumables': return 'yellow';
      case 'equipment': return 'red';
      default: return 'gray';
    }
  };

  const getAlertColor = (type: AlertType) => {
    switch (type) {
      case 'low_stock': return 'orange';
      case 'expired': return 'red';
      case 'expiring_soon': return 'yellow';
      case 'out_of_stock': return 'red';
      case 'maintenance_due': return 'blue';
      case 'overdue_order': return 'red';
      default: return 'gray';
    }
  };

  const handleViewItem = (item: InventoryItem) => {
    setSelectedItem(item);
    openItemDetail();
  };

  const handleViewOrder = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    openOrderDetail();
  };

  const handleViewEquipment = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    openEquipmentDetail();
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

  const getStockLevel = (current: number, minimum: number, maximum: number) => {
    if (current === 0) return { level: 'Out of Stock', color: 'red', percentage: 0 };
    if (current <= minimum) return { level: 'Low Stock', color: 'orange', percentage: (current / maximum) * 100 };
    if (current >= maximum * 0.8) return { level: 'Well Stocked', color: 'green', percentage: (current / maximum) * 100 };
    return { level: 'Normal', color: 'blue', percentage: (current / maximum) * 100 };
  };

  // Statistics cards
  const statsCards = [
    {
      title: 'Total Items',
      value: mockInventoryStats.totalItems,
      icon: IconPackage,
      color: 'blue',
      trend: '+5.2%'
    },
    {
      title: 'Low Stock Alerts',
      value: mockInventoryStats.lowStockItems,
      icon: IconAlertCircle,
      color: 'orange',
      trend: '-12%'
    },
    {
      title: 'Total Value',
      value: formatCurrency(mockInventoryStats.totalValue),
      icon: IconCalculator,
      color: 'green',
      trend: '+8.7%'
    },
    {
      title: 'Equipment',
      value: mockInventoryStats.totalEquipment,
      icon: IconStethoscope,
      color: 'purple',
      trend: '+3.1%'
    }
  ];

  // Chart data
  const categoryDistribution = Object.entries(mockInventoryStats.categoryDistribution)
    .map(([category, count]) => ({
      name: category.replace('_', ' ').toUpperCase(),
      value: count,
      color: getCategoryColor(category as ItemCategory)
    }));

  const stockLevelsData = mockInventoryStats.stockLevels;
  const monthlyConsumption = mockInventoryStats.monthlyConsumption;

  return (
    <Container size="xl" py="md">
      {/* Header */}
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={1}>Inventory Management</Title>
          <Text c="dimmed" size="sm">
            Manage medical supplies, equipment, and procurement
          </Text>
        </div>
        <Group>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={openAddItem}
          >
            Add Item
          </Button>
          <Button
            variant="light"
            leftSection={<IconShoppingCart size={16} />}
            onClick={openAddOrder}
          >
            New Order
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

      {/* Alerts Section */}
      {mockInventoryAlerts.length > 0 && (
        <Alert
          variant="light"
          color="orange"
          title="Inventory Alerts"
          icon={<IconAlertTriangle size={16} />}
          mb="lg"
        >
          <Stack gap="xs">
            {mockInventoryAlerts.slice(0, 3).map((alert) => (
              <Group key={alert.id} justify="space-between">
                <Text size="sm">
                  <Badge size="xs" color={getAlertColor(alert.alertType)} mr="xs">
                    {alert.alertType.replace('_', ' ')}
                  </Badge>
                  {alert.message}
                </Text>
                <Text size="xs" c="dimmed">
                  {new Date(alert.createdAt).toLocaleDateString()}
                </Text>
              </Group>
            ))}
            {mockInventoryAlerts.length > 3 && (
              <Text size="xs" c="dimmed" ta="right">
                +{mockInventoryAlerts.length - 3} more alerts
              </Text>
            )}
          </Stack>
        </Alert>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="items" leftSection={<IconPackage size={16} />}>
            Inventory Items
          </Tabs.Tab>
          <Tabs.Tab value="orders" leftSection={<IconShoppingCart size={16} />}>
            Purchase Orders
          </Tabs.Tab>
          <Tabs.Tab value="equipment" leftSection={<IconStethoscope size={16} />}>
            Equipment
          </Tabs.Tab>
          <Tabs.Tab value="reports" leftSection={<IconChartBar size={16} />}>
            Reports & Analytics
          </Tabs.Tab>
        </Tabs.List>

        {/* Inventory Items Tab */}
        <Tabs.Panel value="items">
          <Paper p="md" radius="md" withBorder mt="md">
            {/* Search and Filters */}
            <Group mb="md">
              <TextInput
                placeholder="Search items..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                style={{ flex: 1 }}
              />
              <Select
                placeholder="Category"
                data={[
                  { value: 'medication', label: 'Medication' },
                  { value: 'medical_supplies', label: 'Medical Supplies' },
                  { value: 'surgical_instruments', label: 'Surgical Instruments' },
                  { value: 'laboratory', label: 'Laboratory' },
                  { value: 'radiology', label: 'Radiology' },
                  { value: 'consumables', label: 'Consumables' },
                  { value: 'equipment', label: 'Equipment' }
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
                  { value: 'out_of_stock', label: 'Out of Stock' },
                  { value: 'expired', label: 'Expired' }
                ]}
                value={selectedStatus}
                onChange={setSelectedStatus}
                clearable
              />
              <Select
                placeholder="Supplier"
                data={mockSuppliers.map(supplier => ({ 
                  value: supplier.id, 
                  label: supplier.companyName 
                }))}
                value={selectedSupplier}
                onChange={setSelectedSupplier}
                clearable
              />
              <Button variant="light" onClick={clearFilters}>
                Clear Filters
              </Button>
            </Group>

            {/* Items Grid */}
            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
              {filteredItems.map((item) => {
                const stockInfo = getStockLevel(
                  item.currentStock, 
                  item.minimumStock, 
                  item.maximumStock
                );
                
                return (
                  <Card key={item.id} padding="lg" radius="md" withBorder>
                    <Group justify="space-between" mb="md">
                      <div style={{ flex: 1 }}>
                        <Group>
                          <ThemeIcon 
                            color={getCategoryColor(item.category)} 
                            variant="light" 
                            size="lg"
                          >
                            <IconPackage size={20} />
                          </ThemeIcon>
                          <div>
                            <Text fw={600} size="sm" lineClamp={1}>
                              {item.itemName}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {item.itemCode}
                            </Text>
                          </div>
                        </Group>
                      </div>
                      <Badge color={getStatusColor(item.status)} variant="light" size="sm">
                        {item.status.replace('_', ' ')}
                      </Badge>
                    </Group>

                    <Stack gap="sm" mb="md">
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Current Stock</Text>
                        <Text size="sm" fw={600}>
                          {item.currentStock} {item.unit}
                        </Text>
                      </Group>
                      
                      <div>
                        <Group justify="space-between" mb="xs">
                          <Text size="xs" c="dimmed">Stock Level</Text>
                          <Text size="xs" c={stockInfo.color} fw={500}>
                            {stockInfo.level}
                          </Text>
                        </Group>
                        <Progress 
                          value={stockInfo.percentage} 
                          color={stockInfo.color} 
                          size="sm" 
                        />
                      </div>

                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Unit Price</Text>
                        <Text size="sm" fw={600}>
                          {formatCurrency(item.unitPrice)}
                        </Text>
                      </Group>

                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Total Value</Text>
                        <Text size="sm" fw={600} c="green">
                          {formatCurrency(item.currentStock * item.unitPrice)}
                        </Text>
                      </Group>

                      {item.expiryDate && (
                        <Group justify="space-between">
                          <Text size="sm" c="dimmed">Expiry Date</Text>
                          <Text 
                            size="sm" 
                            c={new Date(item.expiryDate) < new Date() ? 'red' : 'dimmed'}
                          >
                            {new Date(item.expiryDate).toLocaleDateString()}
                          </Text>
                        </Group>
                      )}
                    </Stack>

                    <Group justify="space-between">
                      <Badge color={getCategoryColor(item.category)} variant="light" size="xs">
                        {item.category.replace('_', ' ')}
                      </Badge>
                      <Group gap="xs">
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          onClick={() => handleViewItem(item)}
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
                            <Menu.Item leftSection={<IconClipboard size={14} />}>
                              Stock Adjustment
                            </Menu.Item>
                            <Menu.Item leftSection={<IconShoppingCart size={14} />}>
                              Reorder
                            </Menu.Item>
                            <Menu.Item leftSection={<IconDownload size={14} />}>
                              Export Data
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

        {/* Purchase Orders Tab */}
        <Tabs.Panel value="orders">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Purchase Orders</Title>
              <Button leftSection={<IconPlus size={16} />} onClick={openAddOrder}>
                Create Order
              </Button>
            </Group>

            {/* Order Filters */}
            <Group mb="md">
              <TextInput
                placeholder="Search orders..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                style={{ flex: 1 }}
              />
              <Select
                placeholder="Status"
                data={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'approved', label: 'Approved' },
                  { value: 'ordered', label: 'Ordered' },
                  { value: 'delivered', label: 'Delivered' },
                  { value: 'cancelled', label: 'Cancelled' }
                ]}
                value={selectedStatus}
                onChange={setSelectedStatus}
                clearable
              />
            </Group>

            {/* Orders Table */}
            <ScrollArea>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Order #</Table.Th>
                    <Table.Th>Supplier</Table.Th>
                    <Table.Th>Order Date</Table.Th>
                    <Table.Th>Expected Delivery</Table.Th>
                    <Table.Th>Items</Table.Th>
                    <Table.Th>Total Amount</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredOrders.map((order) => (
                    <Table.Tr key={order.id}>
                      <Table.Td>
                        <Text fw={500}>{order.orderNumber}</Text>
                      </Table.Td>
                      <Table.Td>
                        <div>
                          <Text size="sm" fw={500}>
                            {order.supplier.companyName}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {order.supplier.contactPerson}
                          </Text>
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {new Date(order.expectedDeliveryDate).toLocaleDateString()}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{order.items.length} items</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={600}>{formatCurrency(order.totalAmount)}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getStatusColor(order.status)} variant="light">
                          {order.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => handleViewOrder(order)}
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
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </Paper>
        </Tabs.Panel>

        {/* Equipment Tab */}
        <Tabs.Panel value="equipment">
          <Paper p="md" radius="md" withBorder mt="md">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Medical Equipment</Title>
              <Button leftSection={<IconPlus size={16} />}>
                Add Equipment
              </Button>
            </Group>

            {/* Equipment Grid */}
            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
              {filteredEquipment.map((equipment) => (
                <Card key={equipment.id} padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <div style={{ flex: 1 }}>
                      <Text fw={600} size="lg" lineClamp={1}>
                        {equipment.equipmentName}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {equipment.manufacturer} - {equipment.model}
                      </Text>
                    </div>
                    <Badge color={getStatusColor(equipment.status)} variant="light">
                      {equipment.status.replace('_', ' ')}
                    </Badge>
                  </Group>

                  <Stack gap="sm" mb="md">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Serial Number</Text>
                      <Text size="sm" fw={500}>{equipment.serialNumber}</Text>
                    </Group>

                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Location</Text>
                      <Text size="sm">{equipment.location}</Text>
                    </Group>

                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Purchase Date</Text>
                      <Text size="sm">
                        {new Date(equipment.purchaseDate).toLocaleDateString()}
                      </Text>
                    </Group>

                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Warranty</Text>
                      <Text 
                        size="sm" 
                        c={new Date(equipment.warrantyExpiry) < new Date() ? 'red' : 'green'}
                      >
                        {new Date(equipment.warrantyExpiry) < new Date() ? 'Expired' : 'Valid'}
                      </Text>
                    </Group>

                    {equipment.nextMaintenanceDate && (
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Next Maintenance</Text>
                        <Text 
                          size="sm" 
                          c={new Date(equipment.nextMaintenanceDate) < new Date() ? 'red' : 'dimmed'}
                        >
                          {new Date(equipment.nextMaintenanceDate).toLocaleDateString()}
                        </Text>
                      </Group>
                    )}
                  </Stack>

                  <Group justify="space-between">
                    <Text size="sm" fw={600} c="blue">
                      {formatCurrency(equipment.purchasePrice)}
                    </Text>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleViewEquipment(equipment)}
                      >
                        <IconEye size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="green">
                        <IconEdit size={16} />
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

        {/* Reports & Analytics Tab */}
        <Tabs.Panel value="reports">
          <Paper p="md" radius="md" withBorder mt="md">
            <Title order={3} mb="lg">Inventory Reports & Analytics</Title>
            
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
              {/* Category Distribution */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Items by Category</Title>
                <DonutChart
                  data={categoryDistribution}
                  size={160}
                  thickness={30}
                  withLabels
                />
              </Card>
              
              {/* Stock Levels */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Stock Level Distribution</Title>
                <BarChart
                  h={200}
                  data={stockLevelsData}
                  dataKey="level"
                  series={[{ name: 'count', color: 'blue.6' }]}
                />
              </Card>
              
              {/* Monthly Consumption */}
              <Card padding="lg" radius="md" withBorder style={{ gridColumn: '1 / -1' }}>
                <Title order={4} mb="md">Monthly Consumption Trends</Title>
                <LineChart
                  h={300}
                  data={monthlyConsumption}
                  dataKey="month"
                  series={[
                    { name: 'medication', color: 'blue.6' },
                    { name: 'supplies', color: 'green.6' },
                    { name: 'equipment', color: 'red.6' }
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
                    <Text size="sm" fw={500}>Inventory Turnover</Text>
                    <Text size="sm" fw={600}>
                      {mockInventoryStats.turnoverRate}x
                    </Text>
                  </Group>
                  <Group justify="space-between" p="sm" 
                         style={{ backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                    <Text size="sm" fw={500}>Stockout Rate</Text>
                    <Text size="sm" fw={600} c="red">
                      {mockInventoryStats.stockoutRate}%
                    </Text>
                  </Group>
                  <Group justify="space-between" p="sm" 
                         style={{ backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                    <Text size="sm" fw={500}>Order Accuracy</Text>
                    <Text size="sm" fw={600} c="green">
                      {mockInventoryStats.orderAccuracy}%
                    </Text>
                  </Group>
                  <Group justify="space-between" p="sm" 
                         style={{ backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                    <Text size="sm" fw={500}>Average Lead Time</Text>
                    <Text size="sm" fw={600}>
                      {mockInventoryStats.averageLeadTime} days
                    </Text>
                  </Group>
                </Stack>
              </Card>
              
              {/* Quick Actions */}
              <Card padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Quick Reports</Title>
                <Stack gap="sm">
                  <Button fullWidth leftSection={<IconDownload size={16} />} variant="light">
                    Export Inventory Report
                  </Button>
                  <Button fullWidth leftSection={<IconFileText size={16} />} variant="light">
                    Generate ABC Analysis
                  </Button>
                  <Button fullWidth leftSection={<IconClipboardList size={16} />} variant="light">
                    Stock Aging Report
                  </Button>
                  <Button fullWidth leftSection={<IconChartBar size={16} />} variant="light">
                    Consumption Analysis
                  </Button>
                </Stack>
              </Card>
            </SimpleGrid>
          </Paper>
        </Tabs.Panel>
      </Tabs>

      {/* Item Detail Modal */}
      <Modal
        opened={itemDetailOpened}
        onClose={closeItemDetail}
        title="Item Details"
        size="lg"
      >
        {selectedItem && (
          <ScrollArea h={500}>
            <Stack gap="md">
              <Group>
                <ThemeIcon 
                  color={getCategoryColor(selectedItem.category)} 
                  size="xl" 
                  variant="light"
                >
                  <IconPackage size={24} />
                </ThemeIcon>
                <div>
                  <Title order={3}>{selectedItem.itemName}</Title>
                  <Text c="dimmed">{selectedItem.itemCode}</Text>
                  <Badge color={getStatusColor(selectedItem.status)} variant="light" mt="xs">
                    {selectedItem.status.replace('_', ' ')}
                  </Badge>
                </div>
              </Group>

              <Divider />

              <SimpleGrid cols={2}>
                <div>
                  <Text size="sm" fw={500}>Category</Text>
                  <Text size="sm" c="dimmed">{selectedItem.category.replace('_', ' ')}</Text>
                </div>
                <div>
                  <Text size="sm" fw={500}>Unit</Text>
                  <Text size="sm" c="dimmed">{selectedItem.unit}</Text>
                </div>
                <div>
                  <Text size="sm" fw={500}>Current Stock</Text>
                  <Text size="sm" fw={600}>{selectedItem.currentStock}</Text>
                </div>
                <div>
                  <Text size="sm" fw={500}>Unit Price</Text>
                  <Text size="sm" fw={600}>{formatCurrency(selectedItem.unitPrice)}</Text>
                </div>
                <div>
                  <Text size="sm" fw={500}>Minimum Stock</Text>
                  <Text size="sm" c="orange">{selectedItem.minimumStock}</Text>
                </div>
                <div>
                  <Text size="sm" fw={500}>Maximum Stock</Text>
                  <Text size="sm" c="green">{selectedItem.maximumStock}</Text>
                </div>
              </SimpleGrid>

              {selectedItem.expiryDate && (
                <div>
                  <Text size="sm" fw={500} mb="sm">Expiry Information</Text>
                  <Alert 
                    color={new Date(selectedItem.expiryDate) < new Date() ? 'red' : 'yellow'} 
                    variant="light"
                  >
                    Expires: {new Date(selectedItem.expiryDate).toLocaleDateString()}
                  </Alert>
                </div>
              )}

              <div>
                <Text size="sm" fw={500} mb="sm">Description</Text>
                <Text size="sm">{selectedItem.description}</Text>
              </div>

              <Group justify="flex-end">
                <Button variant="light" onClick={closeItemDetail}>
                  Close
                </Button>
                <Button>
                  Edit Item
                </Button>
              </Group>
            </Stack>
          </ScrollArea>
        )}
      </Modal>

      {/* Add Item Modal */}
      <Modal
        opened={addItemOpened}
        onClose={closeAddItem}
        title="Add New Item"
        size="lg"
      >
        <Stack gap="md">
          <SimpleGrid cols={2}>
            <TextInput
              label="Item Name"
              placeholder="Enter item name"
              required
            />
            <TextInput
              label="Item Code"
              placeholder="Enter item code"
              required
            />
          </SimpleGrid>
          
          <Select
            label="Category"
            placeholder="Select category"
            data={[
              { value: 'medication', label: 'Medication' },
              { value: 'medical_supplies', label: 'Medical Supplies' },
              { value: 'surgical_instruments', label: 'Surgical Instruments' },
              { value: 'laboratory', label: 'Laboratory' },
              { value: 'consumables', label: 'Consumables' }
            ]}
            required
          />
          
          <Textarea
            label="Description"
            placeholder="Enter item description"
            rows={3}
          />
          
          <SimpleGrid cols={3}>
            <NumberInput
              label="Unit Price"
              placeholder="Enter price"
              leftSection="₹"
              min={0}
              required
            />
            <NumberInput
              label="Minimum Stock"
              placeholder="Min stock level"
              min={0}
              required
            />
            <NumberInput
              label="Maximum Stock"
              placeholder="Max stock level"
              min={0}
              required
            />
          </SimpleGrid>
          
          <SimpleGrid cols={2}>
            <TextInput
              label="Unit"
              placeholder="e.g., pcs, mg, ml"
              required
            />
            <Select
              label="Supplier"
              placeholder="Select supplier"
              data={mockSuppliers.map(supplier => ({ 
                value: supplier.id, 
                label: supplier.companyName 
              }))}
            />
          </SimpleGrid>
          
          <DatePicker
            label="Expiry Date (Optional)"
            placeholder="Select expiry date"
          />
          
          <Group justify="flex-end">
            <Button variant="light" onClick={closeAddItem}>
              Cancel
            </Button>
            <Button onClick={() => {
              notifications.show({
                title: 'Success',
                message: 'Item added successfully',
                color: 'green',
              });
              closeAddItem();
            }}>
              Add Item
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Add Order Modal */}
      <Modal
        opened={addOrderOpened}
        onClose={closeAddOrder}
        title="Create Purchase Order"
        size="lg"
      >
        <Stack gap="md">
          <Select
            label="Supplier"
            placeholder="Select supplier"
            data={mockSuppliers.map(supplier => ({ 
              value: supplier.id, 
              label: supplier.companyName 
            }))}
            required
          />
          
          <DatePicker
            label="Expected Delivery Date"
            placeholder="Select delivery date"
            required
          />
          
          <Divider label="Order Items" labelPosition="center" />
          
          <SimpleGrid cols={3}>
            <Select
              label="Item"
              placeholder="Select item"
              data={mockInventoryItems.map(item => ({ 
                value: item.id, 
                label: item.itemName 
              }))}
              required
            />
            <NumberInput
              label="Quantity"
              placeholder="Enter quantity"
              min={1}
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
          
          <Button variant="light" leftSection={<IconPlus size={16} />}>
            Add More Items
          </Button>
          
          <Textarea
            label="Notes"
            placeholder="Additional notes..."
            rows={3}
          />
          
          <Group justify="flex-end">
            <Button variant="light" onClick={closeAddOrder}>
              Cancel
            </Button>
            <Button onClick={() => {
              notifications.show({
                title: 'Success',
                message: 'Purchase order created successfully',
                color: 'green',
              });
              closeAddOrder();
            }}>
              Create Order
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default InventoryManagement;