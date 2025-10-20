'use client';

import { useState } from 'react';
import {
  Card,
  Title,
  Text,
  Stack,
  Group,
  Button,
  Badge,
  Progress,
  Table,
  Tabs,
  Alert,
} from '@mantine/core';
import {
  IconCreditCard,
  IconReceipt,
  IconTrendingUp,
  IconAlertCircle,
  IconCheck,
  IconDownload,
} from '@tabler/icons-react';

export default function SubscriptionManagementPage() {
  const [currentPlan] = useState({
    name: 'PROFESSIONAL',
    price: 299,
    billingCycle: 'monthly',
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    status: 'ACTIVE',
    autoRenew: true,
  });

  const [usage] = useState({
    users: { current: 78, limit: 100 },
    patients: { current: 4250, limit: 10000 },
    storage: { current: 45, limit: 100 }, // GB
    appointments: { current: 1250, limit: 5000 },
  });

  const [invoices] = useState([
    {
      id: 'INV-2024-003',
      date: '2024-03-01',
      amount: 299,
      status: 'PAID',
      description: 'Professional Plan - March 2024',
    },
    {
      id: 'INV-2024-002',
      date: '2024-02-01',
      amount: 299,
      status: 'PAID',
      description: 'Professional Plan - February 2024',
    },
    {
      id: 'INV-2024-001',
      date: '2024-01-01',
      amount: 299,
      status: 'PAID',
      description: 'Professional Plan - January 2024',
    },
  ]);

  const plans = [
    {
      name: 'FREE',
      price: 0,
      features: [
        '30 days trial',
        'Up to 5 users',
        '100 patients',
        'Basic features',
        'Email support',
      ],
      limits: {
        users: 5,
        patients: 100,
        storage: 5,
      },
    },
    {
      name: 'BASIC',
      price: 99,
      popular: false,
      features: [
        'Up to 20 users',
        '1,000 patients',
        'Core HMS features',
        'Email & Chat support',
        '10 GB storage',
      ],
      limits: {
        users: 20,
        patients: 1000,
        storage: 10,
      },
    },
    {
      name: 'PROFESSIONAL',
      price: 299,
      popular: true,
      features: [
        'Up to 100 users',
        '10,000 patients',
        'All advanced features',
        'Priority support',
        '100 GB storage',
        'Custom branding',
        'API access',
      ],
      limits: {
        users: 100,
        patients: 10000,
        storage: 100,
      },
    },
    {
      name: 'ENTERPRISE',
      price: null,
      popular: false,
      features: [
        'Unlimited users',
        'Unlimited patients',
        'All features',
        '24/7 Dedicated support',
        'Unlimited storage',
        'Custom integrations',
        'SLA guarantee',
        'On-premise option',
      ],
      limits: {
        users: Infinity,
        patients: Infinity,
        storage: Infinity,
      },
    },
  ];

  const daysUntilRenewal = Math.ceil(
    (new Date(currentPlan.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Stack gap="xl">
      {/* Header */}
      <div>
        <Title order={2} mb="xs">
          Subscription & Billing
        </Title>
        <Text c="dimmed">Manage your subscription plan and billing information</Text>
      </div>

      {/* Current Plan Overview */}
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Group justify="space-between" mb="xl">
          <div>
            <Group gap="sm" mb="xs">
              <Title order={3}>{currentPlan.name} Plan</Title>
              <Badge
                size="lg"
                color={currentPlan.status === 'ACTIVE' ? 'green' : 'orange'}
                variant="light"
              >
                {currentPlan.status}
              </Badge>
            </Group>
            <Text c="dimmed">
              ${currentPlan.price}/{currentPlan.billingCycle} • Renews on{' '}
              {new Date(currentPlan.endDate).toLocaleDateString()}
            </Text>
          </div>
          <Button
            size="lg"
            variant="light"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }}
          >
            Upgrade Plan
          </Button>
        </Group>

        {daysUntilRenewal < 30 && (
          <Alert icon={<IconAlertCircle size={16} />} title="Renewal Notice" color="blue" mb="xl">
            Your subscription will auto-renew in {daysUntilRenewal} days
          </Alert>
        )}

        {/* Usage Stats */}
        <Title order={4} mb="md">
          Usage & Limits
        </Title>
        <Stack gap="md">
          <div>
            <Group justify="space-between" mb="xs">
              <Text size="sm" fw={500}>
                Users
              </Text>
              <Text size="sm" c="dimmed">
                {usage.users.current} / {usage.users.limit}
              </Text>
            </Group>
            <Progress
              value={(usage.users.current / usage.users.limit) * 100}
              color={usage.users.current / usage.users.limit > 0.8 ? 'orange' : 'blue'}
            />
          </div>

          <div>
            <Group justify="space-between" mb="xs">
              <Text size="sm" fw={500}>
                Patients
              </Text>
              <Text size="sm" c="dimmed">
                {usage.patients.current.toLocaleString()} / {usage.patients.limit.toLocaleString()}
              </Text>
            </Group>
            <Progress
              value={(usage.patients.current / usage.patients.limit) * 100}
              color={usage.patients.current / usage.patients.limit > 0.8 ? 'orange' : 'green'}
            />
          </div>

          <div>
            <Group justify="space-between" mb="xs">
              <Text size="sm" fw={500}>
                Storage
              </Text>
              <Text size="sm" c="dimmed">
                {usage.storage.current} GB / {usage.storage.limit} GB
              </Text>
            </Group>
            <Progress
              value={(usage.storage.current / usage.storage.limit) * 100}
              color={usage.storage.current / usage.storage.limit > 0.8 ? 'orange' : 'violet'}
            />
          </div>

          <div>
            <Group justify="space-between" mb="xs">
              <Text size="sm" fw={500}>
                Appointments (This Month)
              </Text>
              <Text size="sm" c="dimmed">
                {usage.appointments.current.toLocaleString()} /{' '}
                {usage.appointments.limit.toLocaleString()}
              </Text>
            </Group>
            <Progress
              value={(usage.appointments.current / usage.appointments.limit) * 100}
              color="cyan"
            />
          </div>
        </Stack>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="plans">
        <Tabs.List>
          <Tabs.Tab value="plans" leftSection={<IconTrendingUp size={16} />}>
            Available Plans
          </Tabs.Tab>
          <Tabs.Tab value="billing" leftSection={<IconCreditCard size={16} />}>
            Billing History
          </Tabs.Tab>
          <Tabs.Tab value="payment" leftSection={<IconReceipt size={16} />}>
            Payment Method
          </Tabs.Tab>
        </Tabs.List>

        {/* Available Plans */}
        <Tabs.Panel value="plans" pt="xl">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {plans.map((plan) => (
              <Card
                key={plan.name}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{
                  border: plan.name === currentPlan.name ? '2px solid #667eea' : undefined,
                  position: 'relative',
                }}
              >
                {plan.popular && (
                  <Badge
                    color="violet"
                    variant="filled"
                    style={{ position: 'absolute', top: '1rem', right: '1rem' }}
                  >
                    POPULAR
                  </Badge>
                )}

                <Stack gap="md">
                  <div>
                    <Title order={4} mb="xs">
                      {plan.name}
                    </Title>
                    <Group gap="xs" align="baseline">
                      <Title order={2}>{plan.price === null ? 'Custom' : `$${plan.price}`}</Title>
                      {plan.price !== null && (
                        <Text c="dimmed" size="sm">
                          /month
                        </Text>
                      )}
                    </Group>
                  </div>

                  <Stack gap="xs">
                    {plan.features.map((feature, idx) => (
                      <Group key={idx} gap="xs">
                        <IconCheck size={16} color="#10b981" />
                        <Text size="sm">{feature}</Text>
                      </Group>
                    ))}
                  </Stack>

                  {plan.name === currentPlan.name ? (
                    <Button variant="light" color="gray" disabled fullWidth>
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant={plan.popular ? 'filled' : 'light'}
                      style={
                        plan.popular
                          ? {
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            }
                          : undefined
                      }
                    >
                      {plan.price === null ? 'Contact Sales' : 'Upgrade'}
                    </Button>
                  )}
                </Stack>
              </Card>
            ))}
          </div>
        </Tabs.Panel>

        {/* Billing History */}
        <Tabs.Panel value="billing" pt="xl">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">
              Invoice History
            </Title>
            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Invoice</Table.Th>
                  <Table.Th>Date</Table.Th>
                  <Table.Th>Description</Table.Th>
                  <Table.Th>Amount</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Action</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {invoices.map((invoice) => (
                  <Table.Tr key={invoice.id}>
                    <Table.Td>
                      <Text fw={600} size="sm">
                        {invoice.id}
                      </Text>
                    </Table.Td>
                    <Table.Td>{new Date(invoice.date).toLocaleDateString()}</Table.Td>
                    <Table.Td>{invoice.description}</Table.Td>
                    <Table.Td>
                      <Text fw={600}>${invoice.amount}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={invoice.status === 'PAID' ? 'green' : 'orange'} variant="light">
                        {invoice.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Button size="xs" variant="subtle" leftSection={<IconDownload size={14} />}>
                        Download
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </Tabs.Panel>

        {/* Payment Method */}
        <Tabs.Panel value="payment" pt="xl">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">
              Payment Method
            </Title>
            <Alert icon={<IconCreditCard size={16} />} title="Payment Integration" color="blue">
              <Text size="sm" mb="md">
                Payment method management will be integrated with Stripe. This allows you to:
              </Text>
              <Stack gap="xs">
                <Group gap="xs">
                  <IconCheck size={16} />
                  <Text size="sm">Add/update credit cards</Text>
                </Group>
                <Group gap="xs">
                  <IconCheck size={16} />
                  <Text size="sm">Set up automatic billing</Text>
                </Group>
                <Group gap="xs">
                  <IconCheck size={16} />
                  <Text size="sm">Manage billing address</Text>
                </Group>
              </Stack>
            </Alert>

            <Button mt="md" variant="light">
              Update Payment Method (Coming Soon)
            </Button>
          </Card>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
