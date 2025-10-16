'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Text,
  Group,
  Badge,
  SimpleGrid,
  Stack,
  Button,
  Card,
  Progress,
  Avatar,
  Modal,
  Title,
  Divider,
  Alert
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconUsers,
  IconDownload,
  IconPhone,
  IconMail,
  IconCalendar,
  IconHeart,
  IconAlertCircle,
  IconShield,
  IconUserPlus,
  IconSearch,
  IconChartBar,
  IconFileExport,
  IconUser
} from '@tabler/icons-react';
import Layout from '../../../components/shared/Layout';
import DataTable from '../../../components/shared/DataTable';
import PatientForm from '../../../components/patients/PatientForm';
import PatientDetails from '../../../components/patients/PatientDetails';
import MedicalHistoryManager from '../../../components/patients/MedicalHistoryManager';
import DocumentManager from '../../../components/patients/DocumentManager';
import PatientSearch from '../../../components/patients/PatientSearch';
import PatientAnalytics from '../../../components/patients/PatientAnalytics';
import PatientExportReport from '../../../components/patients/PatientExportReport';
import PatientPortalAccess from '../../../components/patients/PatientPortalAccess';
import { useAppStore } from '../../../stores/appStore';
import { User, UserRole, TableColumn, FilterOption, Status } from '../../../types/common';
import { Patient, PatientStats, PatientListItem, CreatePatientDto, UpdatePatientDto, PatientSearchParams, InsuranceInfo } from '../../../types/patient';
import { mockPatients, mockPatientStats, mockPatientVisits, mockPatientDocuments, mockMedicalHistory, mockPatientAppointments } from '../../../lib/mockData/patients';
import { formatDate, formatPhoneNumber } from '../../../lib/utils';
import { notifications } from '@mantine/notifications';

// Mock user
const mockUser: User = {
  id: '1',
  username: 'sjohnson',
  email: 'sarah.johnson@hospital.com',
  firstName: 'Sarah',
  lastName: 'Johnson',
  role: UserRole.DOCTOR,
  permissions: [],
  isActive: true,
  tenantInfo: {
    tenantId: 'T001',
    tenantName: 'Main Hospital',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function PatientManagement() {
  const { user, setUser } = useAppStore();
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [patientStats] = useState<PatientStats>(mockPatientStats);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading] = useState(false);
  const [, setSearchQuery] = useState('');
  const [, setFilters] = useState<Record<string, unknown>>({});
  const [opened, { open, close }] = useDisclosure(false);
  const [viewModalOpened, { open: openView, close: closeView }] = useDisclosure(false);
  const [historyModalOpened, { open: openHistory, close: closeHistory }] = useDisclosure(false);
  const [documentsModalOpened, { open: openDocuments, close: closeDocuments }] = useDisclosure(false);
  const [searchModalOpened, { open: openSearch, close: closeSearch }] = useDisclosure(false);
  const [analyticsModalOpened, { open: openAnalytics, close: closeAnalytics }] = useDisclosure(false);
  const [exportModalOpened, { open: openExport, close: closeExport }] = useDisclosure(false);
  const [portalModalOpened, { open: openPortal, close: closePortal }] = useDisclosure(false);

  useEffect(() => {
    if (!user) {
      setUser(mockUser);
    }
  }, [user, setUser]);

  // Convert patients to list items for table
  const patientListItems: PatientListItem[] = patients.map(patient => ({
    id: patient.id,
    patientId: patient.patientId,
    fullName: `${patient.firstName} ${patient.lastName}`,
    age: patient.age,
    gender: patient.gender,
    phoneNumber: patient.contactInfo.phone,
    lastVisitDate: patient.lastVisitDate,
    totalVisits: patient.totalVisits,
    status: patient.status,
    hasInsurance: !!patient.insuranceInfo?.isActive,
    emergencyFlag: patient.chronicDiseases.length > 0
  }));

  // Table columns configuration
  const columns: TableColumn[] = [
    {
      key: 'patientId',
      title: 'Patient ID',
      sortable: true,
      width: '120px',
      render: (value) => (
        <Text fw={500} c="blue">
          {value as string}
        </Text>
      )
    },
    {
      key: 'fullName',
      title: 'Patient Name',
      sortable: true,
      render: (value, record) => (
        <Group gap="sm">
          <Avatar size="sm" name={value as string} color="blue" />
          <div>
            <Text fw={500}>{value as string}</Text>
            <Text size="xs" c="dimmed">
              {record.age as string} years • {record.gender as string}
            </Text>
          </div>
        </Group>
      )
    },
    {
      key: 'phoneNumber',
      title: 'Contact',
      render: (value) => (
        <div>
          <Group gap="xs">
            <IconPhone size="1rem" />
            <Text size="sm">{formatPhoneNumber(value as string)}</Text>
          </Group>
        </div>
      )
    },
    {
      key: 'lastVisitDate',
      title: 'Last Visit',
      sortable: true,
      render: (value) => value ? formatDate(value as string | Date) : 'Never'
    },
    {
      key: 'totalVisits',
      title: 'Visits',
      sortable: true,
      width: '80px',
      render: (value) => (
        <Badge variant="light" color="blue">
          {value as string}
        </Badge>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => (
        <Badge 
          color={value === 'active' ? 'green' : 'red'}
          variant="light"
        >
          {value as string}
        </Badge>
      )
    },
    {
      key: 'hasInsurance',
      title: 'Insurance',
      render: (value, record) => (
        <Group gap="xs">
          {value ? (
            <Badge color="green" variant="light" leftSection={<IconShield size="0.8rem" />}>
              Insured
            </Badge>
          ) : (
            <Badge color="gray" variant="light">
              Self Pay
            </Badge>
          )}
          {record.emergencyFlag && (
            <IconAlertCircle size="1rem" color="red" />
          )}
        </Group>
      )
    }
  ];

  // Filter options
  const filterOptions: FilterOption[] = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    },
    {
      key: 'gender',
      label: 'Gender',
      type: 'select',
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      key: 'hasInsurance',
      label: 'Insurance',
      type: 'select',
      options: [
        { value: 'true', label: 'Insured' },
        { value: 'false', label: 'Self Pay' }
      ]
    }
  ];

  // Handle patient actions
  const handleViewPatient = (patient: PatientListItem) => {
    const fullPatient = patients.find(p => p.id === patient.id);
    if (fullPatient) {
      setSelectedPatient(fullPatient);
      openView();
    }
  };

  const handleEditPatient = (patient: PatientListItem) => {
    const fullPatient = patients.find(p => p.id === patient.id);
    if (fullPatient) {
      setSelectedPatient(fullPatient);
      open();
    }
  };

  const handleDeletePatient = (patient: PatientListItem) => {
    // Show confirmation
    if (window.confirm(`Are you sure you want to delete patient ${patient.fullName} (${patient.patientId})?`)) {
      setPatients(prev => prev.filter(p => p.id !== patient.id));
      notifications.show({
        title: 'Success',
        message: `Patient ${patient.fullName} deleted successfully!`,
        color: 'green'
      });
    }
  };

  // Patient CRUD operations
  const handleCreatePatient = async (data: CreatePatientDto) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Calculate age from date of birth
      const today = new Date();
      const birthDate = new Date(data.dateOfBirth);
      const age = today.getFullYear() - birthDate.getFullYear() - 
        (today.getMonth() < birthDate.getMonth() || 
         (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()) ? 1 : 0);
      
      // Generate patient ID
      const patientId = `P${String(patients.length + 1).padStart(6, '0')}`;
      
      // Create new patient object
      const newPatient: Patient = {
        id: `patient-${Date.now()}`,
        patientId: patientId,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        age: age,
        gender: data.gender,
        bloodGroup: data.bloodGroup,
        maritalStatus: data.maritalStatus,
        contactInfo: data.contactInfo,
        address: data.address,
        aadhaarNumber: data.aadhaarNumber,
        otherIdNumber: data.otherIdNumber,
        otherIdType: data.otherIdType,
        allergies: data.allergies || [],
        chronicDiseases: data.chronicDiseases || [],
        currentMedications: data.currentMedications || [],
        insuranceInfo: data.insuranceInfo ? {
          ...data.insuranceInfo,
          insuranceType: data.insuranceInfo.insuranceType || 'self_pay',
          insuranceProvider: data.insuranceInfo.insuranceProvider || '',
          policyNumber: data.insuranceInfo.policyNumber || '',
          policyHolderName: data.insuranceInfo.policyHolderName || '',
          relationshipToPatient: data.insuranceInfo.relationshipToPatient || '',
          validFrom: new Date(),
          validTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          coverageAmount: data.insuranceInfo.coverageAmount || 0,
          isActive: data.insuranceInfo.isActive || false
        } as InsuranceInfo : undefined,
        status: 'active' as Status,
        registrationDate: new Date(),
        totalVisits: 0,
        occupation: data.occupation,
        religion: data.religion,
        language: data.language,
        notes: data.notes,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: user?.id || 'system',
        updatedBy: user?.id || 'system'
      };
      
      // Add to patients list
      setPatients(prev => [newPatient, ...prev]);
      
      notifications.show({
        title: 'Success',
        message: `Patient ${data.firstName} ${data.lastName} (${patientId}) registered successfully!`,
        color: 'green'
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to create patient. Please try again.',
        color: 'red'
      });
      throw error;
    }
  };

  const handleUpdatePatient = async (data: UpdatePatientDto) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update patient in list
      setPatients(prev => prev.map(p => {
        if (p.id === data.id) {
          // Calculate age from date of birth
          const today = new Date();
          const birthDate = new Date(data.dateOfBirth!);
          const age = today.getFullYear() - birthDate.getFullYear() - 
            (today.getMonth() < birthDate.getMonth() || 
             (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()) ? 1 : 0);
          
          return {
            ...p,
            firstName: data.firstName || p.firstName,
            lastName: data.lastName || p.lastName,
            dateOfBirth: data.dateOfBirth || p.dateOfBirth,
            age: data.dateOfBirth ? age : p.age,
            gender: data.gender || p.gender,
            bloodGroup: data.bloodGroup !== undefined ? data.bloodGroup : p.bloodGroup,
            maritalStatus: data.maritalStatus !== undefined ? data.maritalStatus : p.maritalStatus,
            contactInfo: data.contactInfo || p.contactInfo,
            address: data.address || p.address,
            aadhaarNumber: data.aadhaarNumber !== undefined ? data.aadhaarNumber : p.aadhaarNumber,
            otherIdNumber: data.otherIdNumber !== undefined ? data.otherIdNumber : p.otherIdNumber,
            otherIdType: data.otherIdType !== undefined ? data.otherIdType : p.otherIdType,
            allergies: data.allergies !== undefined ? data.allergies : p.allergies,
            chronicDiseases: data.chronicDiseases !== undefined ? data.chronicDiseases : p.chronicDiseases,
            currentMedications: data.currentMedications !== undefined ? data.currentMedications : p.currentMedications,
            insuranceInfo: data.insuranceInfo ? {
              ...p.insuranceInfo,
              ...data.insuranceInfo,
              validFrom: p.insuranceInfo?.validFrom || new Date(),
              validTo: p.insuranceInfo?.validTo || new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            } as InsuranceInfo : p.insuranceInfo,
            occupation: data.occupation !== undefined ? data.occupation : p.occupation,
            religion: data.religion !== undefined ? data.religion : p.religion,
            language: data.language !== undefined ? data.language : p.language,
            notes: data.notes !== undefined ? data.notes : p.notes,
            updatedAt: new Date(),
            updatedBy: user?.id || 'system'
          };
        }
        return p;
      }));
      
      notifications.show({
        title: 'Success',
        message: `Patient ${data.firstName} ${data.lastName} updated successfully!`,
        color: 'green'
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update patient. Please try again.',
        color: 'red'
      });
      throw error;
    }
  };

  // Medical history operations
  const handleSaveMedicalHistory = async (history: any) => {
    console.log('Saving medical history:', history);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleUpdateMedicalHistory = async (id: string, history: any) => {
    console.log('Updating medical history:', id, history);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleDeleteMedicalHistory = async (id: string) => {
    console.log('Deleting medical history:', id);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  // Document operations
  const handleUploadDocument = async (document: any, file: File) => {
    console.log('Uploading document:', document, file);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleUpdateDocument = async (id: string, document: any) => {
    console.log('Updating document:', id, document);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleDeleteDocument = async (id: string) => {
    console.log('Deleting document:', id);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleDownloadDocument = async (document: any) => {
    console.log('Downloading document:', document);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleViewDocument = async (document: any) => {
    console.log('Viewing document:', document);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  // Search operations
  const handleSearch = (criteria: PatientSearchParams) => {
    console.log('Searching patients:', criteria);
    // In real implementation, filter patients based on criteria
  };

  const handleSaveSearch = (name: string, criteria: PatientSearchParams) => {
    console.log('Saving search:', name, criteria);
  };

  // Export operations
  const handleExportPatients = async (options: any) => {
    console.log('Exporting patients:', options);
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleGenerateReport = async (reportType: string, patientIds?: string[]) => {
    console.log('Generating report:', reportType, patientIds);
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      reportType: reportType as 'demographics' | 'visit_summary' | 'medical_summary' | 'insurance_summary',
      patientId: 'all',
      generatedAt: new Date(),
      generatedBy: 'current_user',
      data: {},
      format: 'pdf' as const
    };
  };

  // Portal operations
  const handleEnablePortalAccess = async (patientId: string, preferences: any) => {
    console.log('Enabling portal access:', patientId, preferences);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleDisablePortalAccess = async (patientId: string) => {
    console.log('Disabling portal access:', patientId);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleUpdatePortalPreferences = async (patientId: string, preferences: any) => {
    console.log('Updating portal preferences:', patientId, preferences);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleResetPortalPassword = async (patientId: string) => {
    console.log('Resetting portal password:', patientId);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleSendPortalCredentials = async (patientId: string, method: 'email' | 'sms') => {
    console.log('Sending portal credentials:', patientId, method);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  // Additional handlers
  const handleScheduleAppointment = (patientId: string) => {
    console.log('Schedule appointment for patient:', patientId);
    // Would navigate to appointment scheduling
  };

  const handleOpenHistory = (patient: PatientListItem) => {
    const fullPatient = patients.find(p => p.id === patient.id);
    if (fullPatient) {
      setSelectedPatient(fullPatient);
      openHistory();
    }
  };

  const handleOpenDocuments = (patient: PatientListItem) => {
    const fullPatient = patients.find(p => p.id === patient.id);
    if (fullPatient) {
      setSelectedPatient(fullPatient);
      openDocuments();
    }
  };

  const handleOpenPortal = (patient: PatientListItem) => {
    const fullPatient = patients.find(p => p.id === patient.id);
    if (fullPatient) {
      setSelectedPatient(fullPatient);
      openPortal();
    }
  };

  const handleNewPatient = () => {
    setSelectedPatient(null);
    open();
  };

  const handleCloseForm = () => {
    setSelectedPatient(null);
    close();
  };

  // Wrapper function for PatientDetails onEdit prop
  const handleEditFromDetails = (patient: Patient) => {
    // Convert Patient to PatientListItem format for the existing handler
    const patientListItem: PatientListItem = {
      id: patient.id,
      patientId: patient.patientId,
      fullName: `${patient.firstName} ${patient.lastName}`,
      age: patient.age,
      gender: patient.gender,
      phoneNumber: patient.contactInfo.phone,
      lastVisitDate: patient.lastVisitDate,
      totalVisits: patient.totalVisits,
      status: patient.status,
      hasInsurance: !!patient.insuranceInfo?.isActive,
      emergencyFlag: patient.chronicDiseases.length > 0
    };
    handleEditPatient(patientListItem);
  };

  // Statistics cards
  const StatCard = ({ title, value, icon, color, subtitle }: { title: string; value: string; icon: React.ReactNode; color: string; subtitle?: string }) => (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <div style={{ color: `var(--mantine-color-${color}-6)` }}>
          {icon}
        </div>
      </Group>
      
      <Text size="xl" fw={700} mb="xs">
        {value}
      </Text>
      
      <Text size="sm" c="dimmed" mb="sm">
        {title}
      </Text>
      
      {subtitle && (
        <Text size="xs" c="dimmed">
          {subtitle}
        </Text>
      )}
    </Card>
  );

  return (
    <Container fluid>
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Title order={2}>Patient Management</Title>
            <Text c="dimmed">
              Manage patient registration, medical records, and healthcare information
            </Text>
          </div>
          <Group>
            <Button
              variant="outline"
              leftSection={<IconSearch size="1rem" />}
              onClick={openSearch}
            >
              Advanced Search
            </Button>
            <Button
              variant="outline"
              leftSection={<IconChartBar size="1rem" />}
              onClick={openAnalytics}
            >
              Analytics
            </Button>
            <Button
              variant="outline"
              leftSection={<IconFileExport size="1rem" />}
              onClick={openExport}
            >
              Export
            </Button>
            <Button
              leftSection={<IconUserPlus size="1rem" />}
              onClick={handleNewPatient}
            >
              New Patient
            </Button>
          </Group>
        </Group>

        {/* Statistics Cards */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
          <StatCard
            title="Total Patients"
            value={patientStats.totalPatients.toLocaleString()}
            icon={<IconUsers size="2rem" />}
            color="blue"
            subtitle={`+${patientStats.newPatientsThisMonth} this month`}
          />
          <StatCard
            title="New Today"
            value={patientStats.newPatientsToday.toString()}
            icon={<IconUserPlus size="2rem" />}
            color="green"
            subtitle="New registrations today"
          />
          <StatCard
            title="Active Patients"
            value={patientStats.activePatients.toLocaleString()}
            icon={<IconHeart size="2rem" />}
            color="red"
            subtitle="Currently under care"
          />
          <StatCard
            title="Average Age"
            value={`${patientStats.averageAge} years`}
            icon={<IconCalendar size="2rem" />}
            color="purple"
            subtitle="Patient demographics"
          />
        </SimpleGrid>

        {/* Patient List Table */}
        <DataTable
          data={patientListItems}
          columns={columns}
          loading={loading}
          searchable={true}
          filterable={true}
          sortable={true}
          filters={filterOptions}
          onSearch={(query) => setSearchQuery(query)}
          onFilter={(filters) => setFilters(filters)}
          pagination={{
            page: 1,
            limit: 10,
            total: patientListItems.length,
            onPageChange: (page) => console.log('Page:', page),
            onLimitChange: (limit) => console.log('Limit:', limit)
          }}
          actions={{
            view: handleViewPatient,
            edit: handleEditPatient,
            delete: handleDeletePatient,
            custom: [
              {
                label: 'Documents',
                icon: <IconFileExport size="1rem" />,
                action: (patient: PatientListItem) => handleOpenDocuments(patient)
              },
              {
                label: 'Portal',
                icon: <IconUser size="1rem" />,
                action: (patient: PatientListItem) => handleOpenPortal(patient)
              }
            ]
          }}
          emptyMessage="No patients found"
        />

        {/* Enhanced Patient Details Modal */}
        <PatientDetails
          opened={viewModalOpened}
          onClose={closeView}
          patient={selectedPatient}
          visits={mockPatientVisits.filter(v => v.patientId === selectedPatient?.patientId)}
          documents={mockPatientDocuments.filter(d => d.patientId === selectedPatient?.patientId)}
          medicalHistory={mockMedicalHistory.filter(h => h.patientId === selectedPatient?.patientId)}
          appointments={mockPatientAppointments.filter(a => a.patientId === selectedPatient?.patientId)}
          onEdit={handleEditFromDetails}
          onScheduleAppointment={handleScheduleAppointment}
        />

        {/* Enhanced Patient Form Modal */}
        <PatientForm
          opened={opened}
          onClose={handleCloseForm}
          patient={selectedPatient}
          onSubmit={selectedPatient ? handleUpdatePatient : handleCreatePatient}
        />

        {/* Medical History Manager */}
        {selectedPatient && (
          <MedicalHistoryManager
            opened={historyModalOpened}
            onClose={closeHistory}
            patientId={selectedPatient.patientId}
            patientName={`${selectedPatient.firstName} ${selectedPatient.lastName}`}
            medicalHistory={mockMedicalHistory.filter(h => h.patientId === selectedPatient.patientId)}
            onSave={handleSaveMedicalHistory}
            onUpdate={handleUpdateMedicalHistory}
            onDelete={handleDeleteMedicalHistory}
          />
        )}

        {/* Document Manager */}
        {selectedPatient && (
          <DocumentManager
            opened={documentsModalOpened}
            onClose={closeDocuments}
            patientId={selectedPatient.patientId}
            patientName={`${selectedPatient.firstName} ${selectedPatient.lastName}`}
            documents={mockPatientDocuments.filter(d => d.patientId === selectedPatient.patientId)}
            onUpload={handleUploadDocument}
            onUpdate={handleUpdateDocument}
            onDelete={handleDeleteDocument}
            onDownload={handleDownloadDocument}
            onView={handleViewDocument}
          />
        )}

        {/* Patient Search */}
        <PatientSearch
          opened={searchModalOpened}
          onClose={closeSearch}
          onSearch={handleSearch}
          onSaveSearch={handleSaveSearch}
          currentCriteria={{}}
        />

        {/* Export & Reporting */}
        <PatientExportReport
          opened={exportModalOpened}
          onClose={closeExport}
          onExport={handleExportPatients}
          onGenerateReport={handleGenerateReport}
          patientCount={patients.length}
        />

        {/* Patient Portal Access */}
        {selectedPatient && (
          <PatientPortalAccess
            opened={portalModalOpened}
            onClose={closePortal}
            patient={selectedPatient}
            onEnableAccess={handleEnablePortalAccess}
            onDisableAccess={handleDisablePortalAccess}
            onUpdatePreferences={handleUpdatePortalPreferences}
            onResetPassword={handleResetPortalPassword}
            onSendCredentials={handleSendPortalCredentials}
          />
        )}
      </Stack>
    </Container>
  );
}
