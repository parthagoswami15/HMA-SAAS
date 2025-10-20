'use client';

import { useState } from 'react';
import {
  Card,
  Title,
  Text,
  Stack,
  Group,
  Button,
  TextInput,
  Select,
  Tabs,
  Switch,
  ColorInput,
  FileInput,
  NumberInput,
  Badge,
} from '@mantine/core';
import {
  IconBuilding,
  IconPalette,
  IconUsers,
  IconBell,
  IconShield,
  IconUpload,
  IconDeviceFloppy,
} from '@tabler/icons-react';

export default function HospitalSettingsPage() {
  const [settings, setSettings] = useState({
    // General Info
    name: 'City General Hospital',
    slug: 'city-general',
    type: 'HOSPITAL',
    email: 'admin@citygeneral.com',
    phone: '+1 (555) 123-4567',
    website: 'https://www.citygeneral.com',

    // Address
    addressLine1: '123 Main Street',
    addressLine2: 'Suite 100',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'United States',

    // Branding
    logoUrl: '',
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',

    // Configuration
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    currency: 'USD',
    language: 'en',

    // Features
    appointmentsEnabled: true,
    laboratoryEnabled: true,
    pharmacyEnabled: true,
    billingEnabled: true,
    inventoryEnabled: true,
    reportingEnabled: true,

    // Limits
    maxUsers: 100,
    maxPatients: 10000,
    maxAppointments: 500,
    storageGB: 100,

    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    billingAlerts: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    console.log('Saving settings:', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Stack gap="xl">
      {/* Header */}
      <Group justify="space-between">
        <div>
          <Title order={2} mb="xs">
            Hospital Settings
          </Title>
          <Text c="dimmed">Manage your hospital configuration and preferences</Text>
        </div>
        <Button
          leftSection={<IconDeviceFloppy size={16} />}
          onClick={handleSave}
          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </Group>

      {/* Settings Tabs */}
      <Tabs defaultValue="general">
        <Tabs.List>
          <Tabs.Tab value="general" leftSection={<IconBuilding size={16} />}>
            General
          </Tabs.Tab>
          <Tabs.Tab value="branding" leftSection={<IconPalette size={16} />}>
            Branding
          </Tabs.Tab>
          <Tabs.Tab value="features" leftSection={<IconUsers size={16} />}>
            Features & Limits
          </Tabs.Tab>
          <Tabs.Tab value="notifications" leftSection={<IconBell size={16} />}>
            Notifications
          </Tabs.Tab>
          <Tabs.Tab value="security" leftSection={<IconShield size={16} />}>
            Security
          </Tabs.Tab>
        </Tabs.List>

        {/* General Settings */}
        <Tabs.Panel value="general" pt="xl">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">
              Basic Information
            </Title>
            <Stack gap="md">
              <TextInput
                label="Hospital Name"
                placeholder="Enter hospital name"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                required
              />

              <Group grow>
                <TextInput
                  label="Slug"
                  placeholder="hospital-slug"
                  value={settings.slug}
                  onChange={(e) => setSettings({ ...settings, slug: e.target.value })}
                  description="Used in URLs (e.g., citygeneral.hmssaas.com)"
                  required
                />
                <Select
                  label="Facility Type"
                  value={settings.type}
                  onChange={(value) => setSettings({ ...settings, type: value || '' })}
                  data={[
                    { value: 'HOSPITAL', label: 'Hospital' },
                    { value: 'CLINIC', label: 'Clinic' },
                    { value: 'DIAGNOSTIC_CENTER', label: 'Diagnostic Center' },
                  ]}
                />
              </Group>

              <Group grow>
                <TextInput
                  label="Email"
                  type="email"
                  placeholder="contact@hospital.com"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  required
                />
                <TextInput
                  label="Phone"
                  placeholder="+1 (555) 123-4567"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  required
                />
              </Group>

              <TextInput
                label="Website"
                placeholder="https://www.hospital.com"
                value={settings.website}
                onChange={(e) => setSettings({ ...settings, website: e.target.value })}
              />
            </Stack>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder mt="xl">
            <Title order={4} mb="md">
              Address
            </Title>
            <Stack gap="md">
              <TextInput
                label="Address Line 1"
                placeholder="Street address"
                value={settings.addressLine1}
                onChange={(e) => setSettings({ ...settings, addressLine1: e.target.value })}
              />
              <TextInput
                label="Address Line 2"
                placeholder="Apartment, suite, etc."
                value={settings.addressLine2}
                onChange={(e) => setSettings({ ...settings, addressLine2: e.target.value })}
              />
              <Group grow>
                <TextInput
                  label="City"
                  value={settings.city}
                  onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                />
                <TextInput
                  label="State/Province"
                  value={settings.state}
                  onChange={(e) => setSettings({ ...settings, state: e.target.value })}
                />
              </Group>
              <Group grow>
                <TextInput
                  label="Postal Code"
                  value={settings.postalCode}
                  onChange={(e) => setSettings({ ...settings, postalCode: e.target.value })}
                />
                <TextInput
                  label="Country"
                  value={settings.country}
                  onChange={(e) => setSettings({ ...settings, country: e.target.value })}
                />
              </Group>
            </Stack>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder mt="xl">
            <Title order={4} mb="md">
              Regional Settings
            </Title>
            <Stack gap="md">
              <Group grow>
                <Select
                  label="Timezone"
                  value={settings.timezone}
                  onChange={(value) => setSettings({ ...settings, timezone: value || '' })}
                  data={[
                    { value: 'America/New_York', label: 'Eastern Time (ET)' },
                    { value: 'America/Chicago', label: 'Central Time (CT)' },
                    { value: 'America/Denver', label: 'Mountain Time (MT)' },
                    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
                  ]}
                />
                <Select
                  label="Currency"
                  value={settings.currency}
                  onChange={(value) => setSettings({ ...settings, currency: value || '' })}
                  data={[
                    { value: 'USD', label: 'US Dollar ($)' },
                    { value: 'EUR', label: 'Euro (€)' },
                    { value: 'GBP', label: 'British Pound (£)' },
                    { value: 'INR', label: 'Indian Rupee (₹)' },
                  ]}
                />
              </Group>
              <Group grow>
                <Select
                  label="Date Format"
                  value={settings.dateFormat}
                  onChange={(value) => setSettings({ ...settings, dateFormat: value || '' })}
                  data={[
                    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                  ]}
                />
                <Select
                  label="Time Format"
                  value={settings.timeFormat}
                  onChange={(value) => setSettings({ ...settings, timeFormat: value || '' })}
                  data={[
                    { value: '12h', label: '12 Hour (AM/PM)' },
                    { value: '24h', label: '24 Hour' },
                  ]}
                />
              </Group>
            </Stack>
          </Card>
        </Tabs.Panel>

        {/* Branding */}
        <Tabs.Panel value="branding" pt="xl">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">
              Visual Identity
            </Title>
            <Stack gap="md">
              <FileInput
                label="Hospital Logo"
                placeholder="Upload logo"
                leftSection={<IconUpload size={16} />}
                description="Recommended: 200x200px, PNG or JPG"
              />

              <Group grow>
                <ColorInput
                  label="Primary Color"
                  value={settings.primaryColor}
                  onChange={(value) => setSettings({ ...settings, primaryColor: value })}
                  format="hex"
                />
                <ColorInput
                  label="Secondary Color"
                  value={settings.secondaryColor}
                  onChange={(value) => setSettings({ ...settings, secondaryColor: value })}
                  format="hex"
                />
              </Group>

              <Text size="sm" c="dimmed" mt="md">
                Preview your brand colors:
              </Text>
              <Group>
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    background: settings.primaryColor,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 600,
                  }}
                >
                  Primary
                </div>
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    background: settings.secondaryColor,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 600,
                  }}
                >
                  Secondary
                </div>
              </Group>
            </Stack>
          </Card>
        </Tabs.Panel>

        {/* Features & Limits */}
        <Tabs.Panel value="features" pt="xl">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">
              Enabled Features
            </Title>
            <Stack gap="md">
              <Switch
                label="Appointments Module"
                description="Enable online appointment booking and scheduling"
                checked={settings.appointmentsEnabled}
                onChange={(e) =>
                  setSettings({ ...settings, appointmentsEnabled: e.currentTarget.checked })
                }
              />
              <Switch
                label="Laboratory Module"
                description="Lab tests, results, and management"
                checked={settings.laboratoryEnabled}
                onChange={(e) =>
                  setSettings({ ...settings, laboratoryEnabled: e.currentTarget.checked })
                }
              />
              <Switch
                label="Pharmacy Module"
                description="Medicine inventory and dispensing"
                checked={settings.pharmacyEnabled}
                onChange={(e) =>
                  setSettings({ ...settings, pharmacyEnabled: e.currentTarget.checked })
                }
              />
              <Switch
                label="Billing Module"
                description="Invoicing, payments, and financial tracking"
                checked={settings.billingEnabled}
                onChange={(e) =>
                  setSettings({ ...settings, billingEnabled: e.currentTarget.checked })
                }
              />
              <Switch
                label="Inventory Module"
                description="Medical supplies and equipment management"
                checked={settings.inventoryEnabled}
                onChange={(e) =>
                  setSettings({ ...settings, inventoryEnabled: e.currentTarget.checked })
                }
              />
              <Switch
                label="Reporting & Analytics"
                description="Advanced reports and data visualization"
                checked={settings.reportingEnabled}
                onChange={(e) =>
                  setSettings({ ...settings, reportingEnabled: e.currentTarget.checked })
                }
              />
            </Stack>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder mt="xl">
            <Group justify="space-between" mb="md">
              <Title order={4}>Usage Limits</Title>
              <Badge size="lg" color="violet">
                PROFESSIONAL PLAN
              </Badge>
            </Group>
            <Stack gap="md">
              <div>
                <Text size="sm" fw={500} mb="xs">
                  Maximum Users
                </Text>
                <NumberInput
                  value={settings.maxUsers}
                  onChange={(value) => setSettings({ ...settings, maxUsers: value as number })}
                  min={1}
                  max={1000}
                  disabled
                  description="Upgrade plan to increase limit"
                />
              </div>
              <div>
                <Text size="sm" fw={500} mb="xs">
                  Maximum Patients
                </Text>
                <NumberInput
                  value={settings.maxPatients}
                  onChange={(value) => setSettings({ ...settings, maxPatients: value as number })}
                  min={100}
                  max={100000}
                  disabled
                  description="Upgrade plan to increase limit"
                />
              </div>
              <div>
                <Text size="sm" fw={500} mb="xs">
                  Storage (GB)
                </Text>
                <NumberInput
                  value={settings.storageGB}
                  onChange={(value) => setSettings({ ...settings, storageGB: value as number })}
                  min={10}
                  max={1000}
                  disabled
                  description="Upgrade plan to increase limit"
                />
              </div>
            </Stack>
          </Card>
        </Tabs.Panel>

        {/* Notifications */}
        <Tabs.Panel value="notifications" pt="xl">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">
              Notification Preferences
            </Title>
            <Stack gap="md">
              <Switch
                label="Email Notifications"
                description="Receive notifications via email"
                checked={settings.emailNotifications}
                onChange={(e) =>
                  setSettings({ ...settings, emailNotifications: e.currentTarget.checked })
                }
              />
              <Switch
                label="SMS Notifications"
                description="Receive notifications via SMS"
                checked={settings.smsNotifications}
                onChange={(e) =>
                  setSettings({ ...settings, smsNotifications: e.currentTarget.checked })
                }
              />
              <Switch
                label="Appointment Reminders"
                description="Send automatic appointment reminders to patients"
                checked={settings.appointmentReminders}
                onChange={(e) =>
                  setSettings({ ...settings, appointmentReminders: e.currentTarget.checked })
                }
              />
              <Switch
                label="Billing Alerts"
                description="Get notified about pending payments and invoices"
                checked={settings.billingAlerts}
                onChange={(e) =>
                  setSettings({ ...settings, billingAlerts: e.currentTarget.checked })
                }
              />
            </Stack>
          </Card>
        </Tabs.Panel>

        {/* Security */}
        <Tabs.Panel value="security" pt="xl">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">
              Security Settings
            </Title>
            <Stack gap="md">
              <Text size="sm" c="dimmed">
                Contact your system administrator to modify security settings
              </Text>
              <Button variant="light" color="red" disabled>
                Two-Factor Authentication (Coming Soon)
              </Button>
              <Button variant="light" disabled>
                Session Timeout Settings (Coming Soon)
              </Button>
              <Button variant="light" disabled>
                IP Whitelist (Coming Soon)
              </Button>
            </Stack>
          </Card>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
