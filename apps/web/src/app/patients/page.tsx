'use client';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useState, useEffect } from 'react';

interface Patient {
  id: string;
  medicalRecordNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodType: string;
  address: string;
  city: string;
  state: string;
  isActive: boolean;
  lastVisit: string;
  upcomingAppointment?: string;
  status: 'active' | 'inactive' | 'critical' | 'follow_up';
}

const PatientsPage = () => {
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: '1',
      medicalRecordNumber: 'MR001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '+91-9876543210',
      dateOfBirth: '1985-06-15',
      gender: 'MALE',
      bloodType: 'O_POSITIVE',
      address: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      isActive: true,
      lastVisit: '2024-12-01',
      upcomingAppointment: '2024-12-10',
      status: 'active'
    },
    {
      id: '2',
      medicalRecordNumber: 'MR002',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+91-9876543211',
      dateOfBirth: '1990-03-22',
      gender: 'FEMALE',
      bloodType: 'A_POSITIVE',
      address: '456 Oak Avenue',
      city: 'Delhi',
      state: 'Delhi',
      isActive: true,
      lastVisit: '2024-11-28',
      status: 'follow_up'
    },
    {
      id: '3',
      medicalRecordNumber: 'MR003',
      firstName: 'Mike',
      lastName: 'Wilson',
      email: 'mike.wilson@email.com',
      phone: '+91-9876543212',
      dateOfBirth: '1978-11-08',
      gender: 'MALE',
      bloodType: 'B_NEGATIVE',
      address: '789 Pine Street',
      city: 'Bangalore',
      state: 'Karnataka',
      isActive: true,
      lastVisit: '2024-12-03',
      status: 'critical'
    },
    {
      id: '4',
      medicalRecordNumber: 'MR004',
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@email.com',
      phone: '+91-9876543213',
      dateOfBirth: '1995-09-14',
      gender: 'FEMALE',
      bloodType: 'AB_POSITIVE',
      address: '321 Elm Street',
      city: 'Chennai',
      state: 'Tamil Nadu',
      isActive: false,
      lastVisit: '2024-10-15',
      status: 'inactive'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterGender, setFilterGender] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredPatients = patients
    .filter(patient => {
      const matchesSearch = 
        patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.medicalRecordNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm);
      
      const matchesStatus = filterStatus === 'all' || patient.status === filterStatus;
      const matchesGender = filterGender === 'all' || patient.gender === filterGender;
      
      return matchesSearch && matchesStatus && matchesGender;
    })
    .sort((a, b) => {
      let valueA, valueB;
      switch (sortBy) {
        case 'name':
          valueA = `${a.firstName} ${a.lastName}`.toLowerCase();
          valueB = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        case 'mrn':
          valueA = a.medicalRecordNumber;
          valueB = b.medicalRecordNumber;
          break;
        case 'lastVisit':
          valueA = new Date(a.lastVisit).getTime();
          valueB = new Date(b.lastVisit).getTime();
          break;
        case 'age':
          valueA = new Date().getFullYear() - new Date(a.dateOfBirth).getFullYear();
          valueB = new Date().getFullYear() - new Date(b.dateOfBirth).getFullYear();
          break;
        default:
          valueA = a.firstName;
          valueB = b.firstName;
      }
      
      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'critical': return '#ef4444';
      case 'follow_up': return '#f59e0b';
      case 'inactive': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'critical': return 'Critical';
      case 'follow_up': return 'Follow-up';
      case 'inactive': return 'Inactive';
      default: return 'Unknown';
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const PatientCard = ({ patient }: { patient: Patient }) => (
    <Card variant="elevated" style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 style={{ 
              margin: '0 1rem 0 0', 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#1f2937' 
            }}>
              {patient.firstName} {patient.lastName}
            </h3>
            <span style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '600',
              backgroundColor: `${getStatusColor(patient.status)}15`,
              color: getStatusColor(patient.status)
            }}>
              {getStatusText(patient.status)}
            </span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#6b7280' }}>
                <strong>MRN:</strong> {patient.medicalRecordNumber}
              </p>
              <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#6b7280' }}>
                <strong>Age:</strong> {calculateAge(patient.dateOfBirth)} years
              </p>
              <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#6b7280' }}>
                <strong>Gender:</strong> {patient.gender.toLowerCase().replace('_', ' ')}
              </p>
            </div>
            
            <div>
              <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#6b7280' }}>
                <strong>Phone:</strong> {patient.phone}
              </p>
              <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#6b7280' }}>
                <strong>Blood Type:</strong> {patient.bloodType.replace('_', ' ')}
              </p>
              <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#6b7280' }}>
                <strong>Last Visit:</strong> {new Date(patient.lastVisit).toLocaleDateString()}
              </p>
            </div>
            
            <div>
              <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#6b7280' }}>
                <strong>Location:</strong> {patient.city}, {patient.state}
              </p>
              {patient.upcomingAppointment && (
                <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#10b981' }}>
                  <strong>Next Appointment:</strong> {new Date(patient.upcomingAppointment).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
          <Button size="sm" variant="outline" onClick={() => window.location.href = `/patients/${patient.id}`}>
            View
          </Button>
          <Button size="sm" variant="primary" onClick={() => window.location.href = `/patients/${patient.id}/edit`}>
            Edit
          </Button>
          <Button size="sm" variant="secondary" onClick={() => window.location.href = `/appointments/new?patientId=${patient.id}`}>
            Schedule
          </Button>
        </div>
      </div>
    </Card>
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
              Patient Management
            </h1>
            <p style={{ color: '#6b7280', fontSize: '1rem' }}>
              Manage patient records, appointments, and medical history
            </p>
          </div>
          <Button onClick={() => window.location.href = '/patients/new'}>
            + Add New Patient
          </Button>
        </div>

        {/* Filters and Search */}
        <Card style={{ marginBottom: '2rem' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem',
            alignItems: 'end'
          }}>
            <Input
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon="🔍"
              label="Search"
            />
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: '#374151' 
              }}>
                Status Filter
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: 'white',
                  color: '#374151'
                }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="critical">Critical</option>
                <option value="follow_up">Follow-up</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: '#374151' 
              }}>
                Gender Filter
              </label>
              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: 'white',
                  color: '#374151'
                }}
              >
                <option value="all">All Genders</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: '#374151' 
              }}>
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: 'white',
                  color: '#374151'
                }}
              >
                <option value="name">Name</option>
                <option value="mrn">MRN</option>
                <option value="age">Age</option>
                <option value="lastVisit">Last Visit</option>
              </select>
            </div>
            
            <div>
              <Button 
                variant="secondary" 
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                style={{ width: '100%' }}
              >
                {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <Card variant="bordered">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
                {patients.length}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Patients</div>
            </div>
          </Card>
          
          <Card variant="bordered">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
                {patients.filter(p => p.status === 'active').length}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Active</div>
            </div>
          </Card>
          
          <Card variant="bordered">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444' }}>
                {patients.filter(p => p.status === 'critical').length}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Critical</div>
            </div>
          </Card>
          
          <Card variant="bordered">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
                {patients.filter(p => p.status === 'follow_up').length}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Follow-up</div>
            </div>
          </Card>
        </div>

        {/* Patient List */}
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '1rem' 
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>
              Patients ({filteredPatients.length})
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button variant="secondary" size="sm">
                Export
              </Button>
              <Button variant="secondary" size="sm">
                Print
              </Button>
            </div>
          </div>
          
          {filteredPatients.length > 0 ? (
            filteredPatients.map(patient => (
              <PatientCard key={patient.id} patient={patient} />
            ))
          ) : (
            <Card>
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                  No patients found
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                  No patients match your current search criteria.
                </p>
                <Button onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                  setFilterGender('all');
                }}>
                  Clear Filters
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PatientsPage;