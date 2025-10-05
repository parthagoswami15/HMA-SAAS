'use client';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import React, { useState } from 'react';

interface EmergencyAlert {
  id: string;
  alertId: string;
  type: 'CODE_BLUE' | 'CODE_RED' | 'CODE_GRAY' | 'MASS_CASUALTY' | 'SECURITY' | 'FIRE' | 'EVACUATION' | 'NATURAL_DISASTER';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  location: string;
  department: string;
  reportedBy: string;
  reportedAt: string;
  status: 'ACTIVE' | 'RESPONDING' | 'RESOLVED' | 'CANCELLED';
  responseTeam: string[];
  estimatedArrival?: string;
  resolvedAt?: string;
  notes: string;
  actionsTaken: string[];
  affectedAreas: string[];
  resourcesUsed: string[];
}

interface BedAvailability {
  id: string;
  wardName: string;
  location: string;
  bedNumber: string;
  bedType: 'ICU' | 'CCU' | 'EMERGENCY' | 'GENERAL' | 'PEDIATRIC' | 'MATERNITY' | 'ISOLATION';
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE' | 'CLEANING';
  patientId?: string;
  patientName?: string;
  admissionTime?: string;
  estimatedDischarge?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  equipmentAvailable: string[];
  lastCleaned: string;
  nurseAssigned?: string;
}

interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  department: string;
  phoneNumbers: {
    primary: string;
    mobile?: string;
    emergency?: string;
  };
  email: string;
  availability: '24/7' | 'BUSINESS_HOURS' | 'ON_CALL' | 'WEEKEND';
  specialties: string[];
  responseTime: number; // minutes
  isOnDuty: boolean;
  currentLocation?: string;
}

interface CriticalPatient {
  id: string;
  patientId: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  condition: string;
  severity: 'CRITICAL' | 'SERIOUS' | 'STABLE' | 'IMPROVING';
  location: string;
  bedNumber: string;
  attendingPhysician: string;
  nurseName: string;
  vitalSigns: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    respiratoryRate: number;
    oxygenSaturation: number;
  };
  lastUpdated: string;
  alerts: string[];
  medications: string[];
  procedures: string[];
  familyNotified: boolean;
}

interface TriageEntry {
  id: string;
  patientName: string;
  age: number;
  gender: 'M' | 'F';
  arrivalTime: string;
  chiefComplaint: string;
  triageLevel: 1 | 2 | 3 | 4 | 5; // ESI levels
  vitalSigns: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    painScore?: number;
  };
  triageNurse: string;
  status: 'WAITING' | 'IN_PROGRESS' | 'ADMITTED' | 'DISCHARGED';
  assignedBed?: string;
  estimatedWaitTime: number;
  notes: string;
}

const EmergencyPage = () => {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'alerts' | 'beds' | 'contacts' | 'patients' | 'triage'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [alertFilter, setAlertFilter] = useState('ALL');
  const [bedFilter, setBedFilter] = useState('ALL');
  const [selectedAlert, setSelectedAlert] = useState<EmergencyAlert | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<CriticalPatient | null>(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showNewAlertModal, setShowNewAlertModal] = useState(false);

  const mockAlerts: EmergencyAlert[] = [
    {
      id: '1',
      alertId: 'EA-2024-001',
      type: 'CODE_BLUE',
      severity: 'CRITICAL',
      title: 'Cardiac Arrest - Room 302',
      description: 'Patient in cardiac arrest, CPR in progress',
      location: 'Medical Ward Room 302',
      department: 'Internal Medicine',
      reportedBy: 'Nurse Sarah Wilson',
      reportedAt: '2024-12-05T14:35:00',
      status: 'RESPONDING',
      responseTeam: ['Dr. Emily Carter', 'Dr. Michael Rodriguez', 'Nurse Lisa Johnson', 'RT Mark Davis'],
      estimatedArrival: '2024-12-05T14:38:00',
      notes: 'CPR started immediately, crash cart deployed',
      actionsTaken: ['CPR initiated', 'Intubation performed', 'IV access established', 'Medications administered'],
      affectedAreas: ['Room 302', 'Medical Ward Corridor'],
      resourcesUsed: ['Crash Cart', 'Defibrillator', 'Advanced Airway Kit']
    },
    {
      id: '2',
      alertId: 'EA-2024-002',
      type: 'FIRE',
      severity: 'HIGH',
      title: 'Fire Alert - Kitchen Area',
      description: 'Smoke detected in hospital kitchen, automatic sprinklers activated',
      location: 'Hospital Kitchen - Basement Level',
      department: 'Facilities',
      reportedBy: 'Security Officer John Smith',
      reportedAt: '2024-12-05T13:20:00',
      status: 'RESOLVED',
      responseTeam: ['Fire Department', 'Security Team', 'Facilities Manager'],
      resolvedAt: '2024-12-05T13:45:00',
      notes: 'Small grease fire quickly extinguished, no injuries',
      actionsTaken: ['Fire extinguished', 'Area evacuated', 'Ventilation activated', 'Safety inspection completed'],
      affectedAreas: ['Kitchen', 'Basement Corridors'],
      resourcesUsed: ['Fire Extinguisher', 'Sprinkler System', 'Emergency Ventilation']
    },
    {
      id: '3',
      alertId: 'EA-2024-003',
      type: 'SECURITY',
      severity: 'MEDIUM',
      title: 'Aggressive Patient - Emergency Department',
      description: 'Patient displaying aggressive behavior towards staff',
      location: 'Emergency Department - Bay 4',
      department: 'Emergency Medicine',
      reportedBy: 'Dr. Amanda Foster',
      reportedAt: '2024-12-05T15:10:00',
      status: 'ACTIVE',
      responseTeam: ['Security Team', 'Psychiatric Consultant', 'Charge Nurse'],
      notes: 'Patient agitated, verbal threats made. De-escalation attempts ongoing',
      actionsTaken: ['Security called', 'Area cleared', 'De-escalation initiated'],
      affectedAreas: ['ED Bay 4', 'Adjacent patient areas'],
      resourcesUsed: ['Security Personnel', 'Psychiatric Consultation']
    }
  ];

  const mockBeds: BedAvailability[] = [
    {
      id: '1',
      wardName: 'ICU',
      location: 'Floor 3 - North Wing',
      bedNumber: 'ICU-301',
      bedType: 'ICU',
      status: 'OCCUPIED',
      patientId: 'P001',
      patientName: 'John Doe',
      admissionTime: '2024-12-03T08:30:00',
      priority: 'HIGH',
      equipmentAvailable: ['Ventilator', 'Cardiac Monitor', 'Infusion Pumps'],
      lastCleaned: '2024-12-05T06:00:00',
      nurseAssigned: 'RN Mary Johnson'
    },
    {
      id: '2',
      wardName: 'ICU',
      location: 'Floor 3 - North Wing',
      bedNumber: 'ICU-302',
      bedType: 'ICU',
      status: 'AVAILABLE',
      priority: 'HIGH',
      equipmentAvailable: ['Ventilator', 'Cardiac Monitor', 'Infusion Pumps', 'CRRT Machine'],
      lastCleaned: '2024-12-05T12:30:00',
      nurseAssigned: 'RN Jennifer Lee'
    },
    {
      id: '3',
      wardName: 'Emergency Department',
      location: 'Floor 1 - Emergency Wing',
      bedNumber: 'ED-101',
      bedType: 'EMERGENCY',
      status: 'RESERVED',
      priority: 'CRITICAL',
      equipmentAvailable: ['Cardiac Monitor', 'Defibrillator', 'Oxygen'],
      lastCleaned: '2024-12-05T14:00:00',
      nurseAssigned: 'RN Patricia Davis'
    },
    {
      id: '4',
      wardName: 'General Medicine',
      location: 'Floor 2 - East Wing',
      bedNumber: 'GM-201',
      bedType: 'GENERAL',
      status: 'AVAILABLE',
      priority: 'MEDIUM',
      equipmentAvailable: ['Basic Monitor', 'Oxygen Outlet'],
      lastCleaned: '2024-12-05T10:15:00'
    }
  ];

  const mockContacts: EmergencyContact[] = [
    {
      id: '1',
      name: 'Dr. Sarah Mitchell',
      role: 'Chief Medical Officer',
      department: 'Administration',
      phoneNumbers: {
        primary: '+1 (555) 123-4567',
        mobile: '+1 (555) 987-6543',
        emergency: '+1 (555) 911-1111'
      },
      email: 'sarah.mitchell@hospital.com',
      availability: '24/7',
      specialties: ['Emergency Medicine', 'Internal Medicine'],
      responseTime: 5,
      isOnDuty: true,
      currentLocation: 'Administrative Office'
    },
    {
      id: '2',
      name: 'Dr. Michael Rodriguez',
      role: 'Emergency Department Director',
      department: 'Emergency Medicine',
      phoneNumbers: {
        primary: '+1 (555) 234-5678',
        mobile: '+1 (555) 876-5432'
      },
      email: 'michael.rodriguez@hospital.com',
      availability: '24/7',
      specialties: ['Emergency Medicine', 'Trauma Surgery'],
      responseTime: 3,
      isOnDuty: true,
      currentLocation: 'Emergency Department'
    },
    {
      id: '3',
      name: 'Security Chief Johnson',
      role: 'Security Director',
      department: 'Security',
      phoneNumbers: {
        primary: '+1 (555) 345-6789',
        emergency: '+1 (555) 999-0000'
      },
      email: 'johnson.security@hospital.com',
      availability: '24/7',
      specialties: ['Security Response', 'Emergency Coordination'],
      responseTime: 2,
      isOnDuty: true,
      currentLocation: 'Security Office'
    }
  ];

  const mockCriticalPatients: CriticalPatient[] = [
    {
      id: '1',
      patientId: 'P001',
      name: 'John Doe',
      age: 68,
      gender: 'M',
      condition: 'Acute Myocardial Infarction',
      severity: 'CRITICAL',
      location: 'ICU',
      bedNumber: 'ICU-301',
      attendingPhysician: 'Dr. Emily Carter',
      nurseName: 'RN Mary Johnson',
      vitalSigns: {
        bloodPressure: '90/60',
        heartRate: 110,
        temperature: 98.6,
        respiratoryRate: 22,
        oxygenSaturation: 94
      },
      lastUpdated: '2024-12-05T15:30:00',
      alerts: ['Low Blood Pressure', 'Elevated Heart Rate'],
      medications: ['Aspirin', 'Metoprolol', 'Atorvastatin'],
      procedures: ['Cardiac Catheterization', 'Angioplasty'],
      familyNotified: true
    },
    {
      id: '2',
      patientId: 'P002',
      name: 'Maria Santos',
      age: 45,
      gender: 'F',
      condition: 'Severe Pneumonia',
      severity: 'SERIOUS',
      location: 'ICU',
      bedNumber: 'ICU-303',
      attendingPhysician: 'Dr. Robert Kumar',
      nurseName: 'RN Jennifer Lee',
      vitalSigns: {
        bloodPressure: '110/70',
        heartRate: 95,
        temperature: 101.2,
        respiratoryRate: 28,
        oxygenSaturation: 89
      },
      lastUpdated: '2024-12-05T15:25:00',
      alerts: ['High Fever', 'Low Oxygen Saturation'],
      medications: ['Ceftriaxone', 'Azithromycin', 'Albuterol'],
      procedures: ['Chest X-ray', 'Blood Culture', 'Arterial Blood Gas'],
      familyNotified: true
    }
  ];

  const mockTriageEntries: TriageEntry[] = [
    {
      id: '1',
      patientName: 'Jane Smith',
      age: 35,
      gender: 'F',
      arrivalTime: '2024-12-05T14:30:00',
      chiefComplaint: 'Chest pain and shortness of breath',
      triageLevel: 2,
      vitalSigns: {
        bloodPressure: '150/95',
        heartRate: 105,
        temperature: 98.8,
        respiratoryRate: 20,
        oxygenSaturation: 96,
        painScore: 8
      },
      triageNurse: 'RN Patricia Davis',
      status: 'WAITING',
      estimatedWaitTime: 15,
      notes: 'Possible cardiac event, EKG ordered'
    },
    {
      id: '2',
      patientName: 'Robert Wilson',
      age: 52,
      gender: 'M',
      arrivalTime: '2024-12-05T15:00:00',
      chiefComplaint: 'Severe abdominal pain',
      triageLevel: 3,
      vitalSigns: {
        bloodPressure: '130/80',
        heartRate: 88,
        temperature: 99.1,
        oxygenSaturation: 98,
        painScore: 7
      },
      triageNurse: 'RN Lisa Rodriguez',
      status: 'IN_PROGRESS',
      assignedBed: 'ED-103',
      estimatedWaitTime: 30,
      notes: 'Possible appendicitis, surgical consult requested'
    }
  ];

  const getAlertTypeColor = (type: string) => {
    const colors = {
      'CODE_BLUE': '#ef4444',
      'CODE_RED': '#dc2626',
      'CODE_GRAY': '#6b7280',
      'MASS_CASUALTY': '#7c2d12',
      'SECURITY': '#f59e0b',
      'FIRE': '#ea580c',
      'EVACUATION': '#8b5cf6',
      'NATURAL_DISASTER': '#059669'
    };
    return colors[type as keyof typeof colors] || '#6b7280';
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      'CRITICAL': '#ef4444',
      'HIGH': '#f59e0b',
      'MEDIUM': '#3b82f6',
      'LOW': '#10b981'
    };
    return colors[severity as keyof typeof colors] || '#6b7280';
  };

  const getBedStatusColor = (status: string) => {
    const colors = {
      'AVAILABLE': '#10b981',
      'OCCUPIED': '#f59e0b',
      'RESERVED': '#3b82f6',
      'MAINTENANCE': '#ef4444',
      'CLEANING': '#6b7280'
    };
    return colors[status as keyof typeof colors] || '#6b7280';
  };

  const getTriageLevelColor = (level: number) => {
    const colors = {
      1: '#dc2626', // Resuscitation - Red
      2: '#ea580c', // Emergent - Orange  
      3: '#facc15', // Urgent - Yellow
      4: '#22c55e', // Less Urgent - Green
      5: '#3b82f6'  // Non-urgent - Blue
    };
    return colors[level as keyof typeof colors] || '#6b7280';
  };

  const AlertModal = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
            Emergency Alert Details
          </h2>
          <button
            onClick={() => setShowAlertModal(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ×
          </button>
        </div>

        {selectedAlert && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Alert Header */}
            <div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                  {selectedAlert.title}
                </h3>
                <span style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'white',
                  backgroundColor: getAlertTypeColor(selectedAlert.type)
                }}>
                  {selectedAlert.type.replace('_', ' ')}
                </span>
                <span style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'white',
                  backgroundColor: getSeverityColor(selectedAlert.severity)
                }}>
                  {selectedAlert.severity}
                </span>
              </div>
              <p style={{ color: '#6b7280', fontSize: '1rem', margin: 0 }}>
                {selectedAlert.description}
              </p>
            </div>

            {/* Location & Details */}
            <div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                Location & Details
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                <div><span style={{ fontWeight: '600' }}>Location:</span> {selectedAlert.location}</div>
                <div><span style={{ fontWeight: '600' }}>Department:</span> {selectedAlert.department}</div>
                <div><span style={{ fontWeight: '600' }}>Reported By:</span> {selectedAlert.reportedBy}</div>
                <div><span style={{ fontWeight: '600' }}>Time:</span> {new Date(selectedAlert.reportedAt).toLocaleString()}</div>
                <div><span style={{ fontWeight: '600' }}>Alert ID:</span> {selectedAlert.alertId}</div>
                <div>
                  <span style={{ fontWeight: '600' }}>Status:</span>
                  <span style={{
                    marginLeft: '0.5rem',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: 'white',
                    backgroundColor: selectedAlert.status === 'RESOLVED' ? '#10b981' : 
                                   selectedAlert.status === 'RESPONDING' ? '#f59e0b' : '#ef4444'
                  }}>
                    {selectedAlert.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Response Team */}
            <div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                Response Team
              </h4>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {selectedAlert.responseTeam.map((member, index) => (
                  <div key={index} style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>{member}</span>
                    <span style={{ fontSize: '0.75rem', color: '#10b981' }}>✓ Responding</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions Taken */}
            <div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                Actions Taken
              </h4>
              <div style={{ display: 'grid', gap: '0.25rem' }}>
                {selectedAlert.actionsTaken.map((action, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#10b981' }}>✓</span>
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources Used */}
            <div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                Resources Used
              </h4>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {selectedAlert.resourcesUsed.map((resource, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#e0f2fe',
                      color: '#0e7490',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}
                  >
                    {resource}
                  </span>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                Notes
              </h4>
              <p style={{
                padding: '1rem',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                margin: 0,
                lineHeight: '1.6'
              }}>
                {selectedAlert.notes}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
              {selectedAlert.status === 'ACTIVE' && (
                <Button variant="primary">
                  🚨 Update Status
                </Button>
              )}
              <Button variant="outline">
                📋 Add Notes
              </Button>
              <Button variant="secondary" onClick={() => setShowAlertModal(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Layout>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem' 
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
              Emergency Management
            </h1>
            <p style={{ color: '#6b7280', fontSize: '1rem' }}>
              Monitor emergency alerts, bed availability, and critical patient status
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="primary" onClick={() => setShowNewAlertModal(true)}>
              🚨 New Alert
            </Button>
            <Button variant="outline">
              📊 Reports
            </Button>
          </div>
        </div>

        {/* Emergency Status Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <Card style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '2rem', color: '#ef4444', marginBottom: '0.5rem' }}>🚨</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}>
                {mockAlerts.filter(a => a.status === 'ACTIVE').length}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#dc2626' }}>Active Alerts</div>
            </div>
          </Card>
          <Card>
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '2rem', color: '#10b981', marginBottom: '0.5rem' }}>🛏️</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                {mockBeds.filter(b => b.status === 'AVAILABLE').length}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Available Beds</div>
            </div>
          </Card>
          <Card>
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '2rem', color: '#f59e0b', marginBottom: '0.5rem' }}>👥</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                {mockCriticalPatients.filter(p => p.severity === 'CRITICAL').length}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Critical Patients</div>
            </div>
          </Card>
          <Card>
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '2rem', color: '#3b82f6', marginBottom: '0.5rem' }}>📞</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                {mockContacts.filter(c => c.isOnDuty).length}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>On-Duty Staff</div>
            </div>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
            {[
              { key: 'dashboard', label: '🏥 Dashboard', desc: 'Overview' },
              { key: 'alerts', label: '🚨 Active Alerts', desc: 'Emergency Alerts' },
              { key: 'beds', label: '🛏️ Bed Status', desc: 'Availability' },
              { key: 'contacts', label: '📞 Contacts', desc: 'Emergency Staff' },
              { key: 'patients', label: '👥 Critical Patients', desc: 'Monitoring' },
              { key: 'triage', label: '⚡ Triage', desc: 'ED Queue' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setCurrentTab(tab.key as string)}
                style={{
                  padding: '1rem 1.5rem',
                  border: 'none',
                  background: 'none',
                  fontSize: '1rem',
                  fontWeight: '500',
                  color: currentTab === tab.key ? '#667eea' : '#6b7280',
                  borderBottom: currentTab === tab.key ? '2px solid #667eea' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div>{tab.label}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                  {tab.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Tab */}
        {currentTab === 'dashboard' && (
          <div style={{ display: 'grid', gap: '2rem' }}>
            {/* Recent Alerts */}
            <Card>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                Recent Emergency Alerts
              </h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {mockAlerts.slice(0, 3).map(alert => (
                  <div key={alert.id} style={{
                    padding: '1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: 'white',
                          backgroundColor: getAlertTypeColor(alert.type)
                        }}>
                          {alert.type.replace('_', ' ')}
                        </span>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: 'white',
                          backgroundColor: getSeverityColor(alert.severity)
                        }}>
                          {alert.severity}
                        </span>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {alert.location}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                        {alert.title}
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                        Reported {new Date(alert.reportedAt).toLocaleString()}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Critical Patients Summary */}
            <Card>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                Critical Patients
              </h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {mockCriticalPatients.map(patient => (
                  <div key={patient.id} style={{
                    padding: '1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                        {patient.name} ({patient.bedNumber})
                      </h4>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: 'white',
                        backgroundColor: patient.severity === 'CRITICAL' ? '#ef4444' : '#f59e0b'
                      }}>
                        {patient.severity}
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      <div>BP: {patient.vitalSigns.bloodPressure}</div>
                      <div>HR: {patient.vitalSigns.heartRate}</div>
                      <div>Temp: {patient.vitalSigns.temperature}°F</div>
                      <div>SpO2: {patient.vitalSigns.oxygenSaturation}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Alerts Tab */}
        {currentTab === 'alerts' && (
          <>
            {/* Alert Filters */}
            <Card style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '250px' }}>
                  <Input
                    placeholder="Search alerts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select
                  value={alertFilter}
                  onChange={(e) => setAlertFilter(e.target.value)}
                  style={{
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    minWidth: '150px'
                  }}
                >
                  <option value="ALL">All Alerts</option>
                  <option value="ACTIVE">Active</option>
                  <option value="RESPONDING">Responding</option>
                  <option value="RESOLVED">Resolved</option>
                </select>

                <Button variant="outline">
                  🔄 Refresh
                </Button>
              </div>
            </Card>

            {/* Alerts List */}
            <div style={{ display: 'grid', gap: '1rem' }}>
              {mockAlerts.map(alert => (
                <Card key={alert.id} style={{
                  cursor: 'pointer',
                  border: alert.severity === 'CRITICAL' ? '2px solid #ef4444' : '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: 'white',
                          backgroundColor: getAlertTypeColor(alert.type)
                        }}>
                          {alert.type.replace('_', ' ')}
                        </span>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: 'white',
                          backgroundColor: getSeverityColor(alert.severity)
                        }}>
                          {alert.severity}
                        </span>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: 'white',
                          backgroundColor: alert.status === 'RESOLVED' ? '#10b981' : 
                                         alert.status === 'RESPONDING' ? '#f59e0b' : '#ef4444'
                        }}>
                          {alert.status}
                        </span>
                      </div>
                      
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                        {alert.title}
                      </h3>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                        {alert.description}
                      </p>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                        <div><span style={{ fontWeight: '600' }}>Location:</span> {alert.location}</div>
                        <div><span style={{ fontWeight: '600' }}>Reported:</span> {new Date(alert.reportedAt).toLocaleString()}</div>
                        <div><span style={{ fontWeight: '600' }}>By:</span> {alert.reportedBy}</div>
                        <div><span style={{ fontWeight: '600' }}>Response Team:</span> {alert.responseTeam.length} members</div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedAlert(alert);
                          setShowAlertModal(true);
                        }}
                      >
                        View Details
                      </Button>
                      {alert.status === 'ACTIVE' && (
                        <Button size="sm" variant="primary">
                          🚨 Respond
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Bed Status Tab */}
        {currentTab === 'beds' && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {mockBeds.map(bed => (
              <Card key={bed.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                        {bed.bedNumber} - {bed.wardName}
                      </h3>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: 'white',
                        backgroundColor: getBedStatusColor(bed.status)
                      }}>
                        {bed.status}
                      </span>
                      <span style={{
                        padding: '0.125rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.625rem',
                        fontWeight: '600',
                        color: bed.priority === 'HIGH' ? '#dc2626' : bed.priority === 'MEDIUM' ? '#f59e0b' : '#10b981',
                        backgroundColor: bed.priority === 'HIGH' ? '#fef2f2' : bed.priority === 'MEDIUM' ? '#fef3c7' : '#f0fdf4'
                      }}>
                        {bed.priority} PRIORITY
                      </span>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      <div><span style={{ fontWeight: '600' }}>Location:</span> {bed.location}</div>
                      <div><span style={{ fontWeight: '600' }}>Type:</span> {bed.bedType}</div>
                      {bed.patientName && (
                        <div><span style={{ fontWeight: '600' }}>Patient:</span> {bed.patientName}</div>
                      )}
                      {bed.nurseAssigned && (
                        <div><span style={{ fontWeight: '600' }}>Nurse:</span> {bed.nurseAssigned}</div>
                      )}
                      <div><span style={{ fontWeight: '600' }}>Last Cleaned:</span> {new Date(bed.lastCleaned).toLocaleString()}</div>
                    </div>
                    
                    <div>
                      <span style={{ fontWeight: '600', fontSize: '0.875rem', color: '#6b7280' }}>Equipment:</span>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                        {bed.equipmentAvailable.map((equipment, index) => (
                          <span
                            key={index}
                            style={{
                              padding: '0.125rem 0.5rem',
                              backgroundColor: '#e0f2fe',
                              color: '#0e7490',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: '500'
                            }}
                          >
                            {equipment}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ marginLeft: '1rem' }}>
                    <Button size="sm" variant="outline">
                      📋 Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Other tabs placeholder */}
        {['contacts', 'patients', 'triage'].includes(currentTab) && (
          <Card>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                {currentTab === 'contacts' && '📞'}
                {currentTab === 'patients' && '👥'}
                {currentTab === 'triage' && '⚡'}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                {currentTab === 'contacts' && 'Emergency Contacts Directory'}
                {currentTab === 'patients' && 'Critical Patient Monitoring'}
                {currentTab === 'triage' && 'Emergency Department Triage'}
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                {currentTab === 'contacts' && 'Access emergency contact information for key personnel and response teams.'}
                {currentTab === 'patients' && 'Monitor critical patients with real-time vital signs and alerts.'}
                {currentTab === 'triage' && 'Manage emergency department triage queue and patient prioritization.'}
              </p>
              <Button variant="primary">
                {currentTab === 'contacts' && '📞 View Contacts'}
                {currentTab === 'patients' && '👥 Monitor Patients'}
                {currentTab === 'triage' && '⚡ Manage Triage'}
              </Button>
            </div>
          </Card>
        )}

        {/* Alert Modal */}
        {showAlertModal && <AlertModal />}
      </div>
    </Layout>
  );
};

export default EmergencyPage;