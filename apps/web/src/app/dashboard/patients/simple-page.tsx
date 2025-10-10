'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Patient {
  id: string;
  patientId?: string;
  medicalRecordNumber?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup?: string;
  bloodType?: string;
  phone: string;
  email?: string;
  address: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'DECEASED';
  isActive?: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface PatientFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodType: string;
  phone: string;
  email: string;
  aadharNumber: string;
  address: string;
}

import { patientsService, handleApiError } from '@/services';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function PatientsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState<PatientFormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'MALE',
    bloodType: '',
    phone: '',
    email: '',
    aadharNumber: '',
    address: ''
  });

  useEffect(() => {
    // Ensure this only runs on client side
    if (typeof window === 'undefined') return;
    
    // Check for both 'token' and 'accessToken' for compatibility
    const storedToken = localStorage.getItem('token') || localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    
    // Debug logging
    console.log('🔐 Auth Check:', {
      hasToken: !!storedToken,
      hasUser: !!storedUser,
      tokenLength: storedToken?.length || 0,
      tokenType: localStorage.getItem('token') ? 'token' : localStorage.getItem('accessToken') ? 'accessToken' : 'none'
    });

    // Check if user is logged in
    if (!storedToken) {
      console.warn('⚠️ No token found, redirecting to login');
      setError('Please login to access this page');
      setLoading(false);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      return;
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
    }
    
    // Fetch patients only if authenticated
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await patientsService.getPatients({ limit: 100 });
      
      // Handle different response structures
      const patientData = response.data?.patients || response.data || response || [];
      setPatients(Array.isArray(patientData) ? patientData : []);
    } catch (err: any) {
      const errorMessage = handleApiError(err);
      
      // If unauthorized, redirect to login
      if (err?.statusCode === 401 || errorMessage.toLowerCase().includes('unauthorized')) {
        setError('Session expired. Redirecting to login...');
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(errorMessage);
        console.error('Error fetching patients:', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Convert blood type from display format (A+, B+) to enum format (A_POSITIVE, B_POSITIVE)
      const bloodTypeMap: Record<string, string> = {
        'A+': 'A_POSITIVE',
        'A-': 'A_NEGATIVE',
        'B+': 'B_POSITIVE',
        'B-': 'B_NEGATIVE',
        'AB+': 'AB_POSITIVE',
        'AB-': 'AB_NEGATIVE',
        'O+': 'O_POSITIVE',
        'O-': 'O_NEGATIVE'
      };

      const dataToSend = {
        ...formData,
        bloodType: formData.bloodType ? bloodTypeMap[formData.bloodType] || formData.bloodType : undefined,
        dateOfBirth: formData.dateOfBirth || undefined
      };

      await patientsService.createPatient(dataToSend);
      await fetchPatients();
      setShowAddForm(false);
      resetForm();
      alert('Patient added successfully!');
    } catch (err: any) {
      const errorMessage = handleApiError(err);
      
      // If unauthorized, redirect to login
      if (err?.statusCode === 401 || errorMessage.toLowerCase().includes('unauthorized')) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        router.push('/login');
      } else {
        alert('Error adding patient: ' + errorMessage);
        console.error('Full error:', err);
      }
    }
  };

  const handleUpdatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingPatient) return;

    try {
      // Convert blood type from display format to enum format
      const bloodTypeMap: Record<string, string> = {
        'A+': 'A_POSITIVE',
        'A-': 'A_NEGATIVE',
        'B+': 'B_POSITIVE',
        'B-': 'B_NEGATIVE',
        'AB+': 'AB_POSITIVE',
        'AB-': 'AB_NEGATIVE',
        'O+': 'O_POSITIVE',
        'O-': 'O_NEGATIVE'
      };

      const dataToSend = {
        ...formData,
        bloodType: formData.bloodType ? bloodTypeMap[formData.bloodType] || formData.bloodType : undefined,
        dateOfBirth: formData.dateOfBirth || undefined
      };

      await patientsService.updatePatient(editingPatient.id, dataToSend);
      await fetchPatients();
      setEditingPatient(null);
      resetForm();
      alert('Patient updated successfully!');
    } catch (err) {
      const errorMessage = handleApiError(err);
      alert('Error updating patient: ' + errorMessage);
      console.error('Full error:', err);
    }
  };

  const handleDeletePatient = async (id: string) => {
    if (!confirm('Are you sure you want to delete this patient?')) return;

    try {
      await patientsService.deletePatient(id);
      await fetchPatients();
      alert('Patient deleted successfully!');
    } catch (err) {
      const errorMessage = handleApiError(err);
      alert('Error deleting patient: ' + errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'MALE',
      bloodType: '',
      phone: '',
      email: '',
      aadharNumber: '',
      address: ''
    });
  };

  const startEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData({
      firstName: patient.firstName,
      lastName: patient.lastName,
      dateOfBirth: patient.dateOfBirth.split('T')[0], // Convert to date input format
      gender: patient.gender,
      bloodType: patient.bloodGroup || patient.bloodType || '',
      phone: patient.phone,
      email: patient.email || '',
      aadharNumber: (patient as any).aadharNumber || '',
      address: patient.address
    });
    setShowAddForm(true);
  };

  const filteredPatients = patients.filter(patient => {
    const patientId = patient.medicalRecordNumber || patient.patientId || '';
    const matchesSearch = 
      patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm);
    
    const matchesGender = !selectedGender || patient.gender === selectedGender;
    const patientStatus = patient.status || (patient.isActive ? 'ACTIVE' : 'INACTIVE');
    const matchesStatus = !selectedStatus || patientStatus === selectedStatus;
    
    return matchesSearch && matchesGender && matchesStatus;
  });

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div>Loading patients...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* Header */}
      <div style={{
        background: "white",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/dashboard" style={{ textDecoration: "none", color: "#667eea", fontSize: "1.2rem" }}>
            ← Dashboard
          </Link>
          <h1 style={{ color: "#1f2937", fontSize: "1.5rem", margin: 0 }}>Patient Management</h1>
        </div>
        
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingPatient(null);
            resetForm();
          }}
          style={{
            background: "#10b981",
            color: "white",
            padding: "0.75rem 1.5rem",
            borderRadius: "6px",
            border: "none",
            fontSize: "0.9rem",
            cursor: "pointer"
          }}
        >
          ➕ Add Patient
        </button>
      </div>

      <div style={{ padding: "2rem" }}>
        {/* Error Banner */}
        {error && (
          <div style={{
            background: "#fef2f2",
            border: "1px solid #fca5a5",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1rem",
            color: "#991b1b",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <span style={{ fontSize: "1.2rem" }}>⚠️</span>
            <span>{error}</span>
          </div>
        )}
        
        {/* Stats Cards */}
        <div style={{
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "1rem", 
          marginBottom: "2rem" 
        }}>
          <div style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#3b82f6" }}>
              {patients.length}
            </div>
            <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>Total Patients</div>
          </div>

          <div style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#10b981" }}>
              {patients.filter(p => p.status === 'ACTIVE').length}
            </div>
            <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>Active Patients</div>
          </div>

          <div style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#f59e0b" }}>
              {patients.filter(p => p.gender === 'MALE').length}
            </div>
            <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>Male Patients</div>
          </div>

          <div style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#ec4899" }}>
              {patients.filter(p => p.gender === 'FEMALE').length}
            </div>
            <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>Female Patients</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          background: "white",
          padding: "1rem",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          marginBottom: "1rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          alignItems: "center"
        }}>
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: "1",
              minWidth: "200px",
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
              fontSize: "0.9rem"
            }}
          />
          
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
              fontSize: "0.9rem"
            }}
          >
            <option value="">All Genders</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
              fontSize: "0.9rem"
            }}
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="DECEASED">Deceased</option>
          </select>

          <button
            onClick={fetchPatients}
            style={{
              background: "#3b82f6",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              border: "none",
              fontSize: "0.9rem",
              cursor: "pointer"
            }}
          >
            🔄 Refresh
          </button>
        </div>

        {/* Patients Table */}
        <div style={{
          background: "white",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          overflow: "hidden"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#f9fafb" }}>
              <tr>
                <th style={{ padding: "1rem", textAlign: "left", borderBottom: "1px solid #e5e7eb", fontWeight: "600", color: "#374151" }}>
                  Patient ID
                </th>
                <th style={{ padding: "1rem", textAlign: "left", borderBottom: "1px solid #e5e7eb", fontWeight: "600", color: "#374151" }}>
                  Name
                </th>
                <th style={{ padding: "1rem", textAlign: "left", borderBottom: "1px solid #e5e7eb", fontWeight: "600", color: "#374151" }}>
                  Gender
                </th>
                <th style={{ padding: "1rem", textAlign: "left", borderBottom: "1px solid #e5e7eb", fontWeight: "600", color: "#374151" }}>
                  Phone
                </th>
                <th style={{ padding: "1rem", textAlign: "left", borderBottom: "1px solid #e5e7eb", fontWeight: "600", color: "#374151" }}>
                  Blood Group
                </th>
                <th style={{ padding: "1rem", textAlign: "left", borderBottom: "1px solid #e5e7eb", fontWeight: "600", color: "#374151" }}>
                  Status
                </th>
                <th style={{ padding: "1rem", textAlign: "left", borderBottom: "1px solid #e5e7eb", fontWeight: "600", color: "#374151" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient, index) => (
                <tr 
                  key={patient.id}
                  style={{ 
                    borderBottom: "1px solid #e5e7eb",
                    backgroundColor: index % 2 === 0 ? "#f9fafb" : "white"
                  }}
                >
                  <td style={{ padding: "1rem", color: "#374151", fontFamily: "monospace" }}>
                    {patient.medicalRecordNumber || patient.patientId || 'N/A'}
                  </td>
                  <td style={{ padding: "1rem", color: "#374151" }}>
                    {patient.firstName} {patient.lastName}
                  </td>
                  <td style={{ padding: "1rem", color: "#6b7280" }}>
                    {patient.gender}
                  </td>
                  <td style={{ padding: "1rem", color: "#6b7280" }}>
                    {patient.phone}
                  </td>
                  <td style={{ padding: "1rem", color: "#6b7280" }}>
                    {patient.bloodGroup || patient.bloodType || '-'}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{
                      padding: "0.25rem 0.75rem",
                      borderRadius: "12px",
                      fontSize: "0.75rem",
                      fontWeight: "500",
                      background: (patient.status === 'ACTIVE' || patient.isActive) ? '#dcfce7' : 
                                 patient.status === 'INACTIVE' ? '#f3f4f6' : '#fef2f2',
                      color: (patient.status === 'ACTIVE' || patient.isActive) ? '#166534' : 
                             patient.status === 'INACTIVE' ? '#374151' : '#991b1b'
                    }}>
                      {patient.status || (patient.isActive ? 'ACTIVE' : 'INACTIVE')}
                    </span>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => setViewingPatient(patient)}
                        style={{
                          background: "#3b82f6",
                          color: "white",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                          border: "none",
                          fontSize: "0.75rem",
                          cursor: "pointer"
                        }}
                      >
                        👁️ View
                      </button>
                      <button
                        onClick={() => startEdit(patient)}
                        style={{
                          background: "#f59e0b",
                          color: "white",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                          border: "none",
                          fontSize: "0.75rem",
                          cursor: "pointer"
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeletePatient(patient.id)}
                        style={{
                          background: "#ef4444",
                          color: "white",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                          border: "none",
                          fontSize: "0.75rem",
                          cursor: "pointer"
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredPatients.length === 0 && (
            <div style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>
              No patients found. {patients.length === 0 ? "Add your first patient!" : "Try adjusting your filters."}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Patient Modal */}
      {showAddForm && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "white",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
            maxWidth: "600px",
            width: "90%",
            maxHeight: "90vh",
            overflow: "auto"
          }}>
            <h2 style={{ marginBottom: "1rem", color: "#1f2937" }}>
              {editingPatient ? 'Edit Patient' : 'Add New Patient'}
            </h2>
            
            <form onSubmit={editingPatient ? handleUpdatePatient : handleAddPatient}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.9rem", fontWeight: "500" }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: "4px",
                      border: "1px solid #d1d5db",
                      fontSize: "0.9rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.9rem", fontWeight: "500" }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: "4px",
                      border: "1px solid #d1d5db",
                      fontSize: "0.9rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.9rem", fontWeight: "500" }}>
                    Date of Birth (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: "4px",
                      border: "1px solid #d1d5db",
                      fontSize: "0.9rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.9rem", fontWeight: "500" }}>
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value as 'MALE' | 'FEMALE' | 'OTHER'})}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: "4px",
                      border: "1px solid #d1d5db",
                      fontSize: "0.9rem",
                      boxSizing: "border-box"
                    }}
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.9rem", fontWeight: "500" }}>
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+91 98765 43210"
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: "4px",
                      border: "1px solid #d1d5db",
                      fontSize: "0.9rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.9rem", fontWeight: "500" }}>
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="patient@email.com"
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: "4px",
                      border: "1px solid #d1d5db",
                      fontSize: "0.9rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.9rem", fontWeight: "500" }}>
                    Aadhar Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.aadharNumber}
                    onChange={(e) => setFormData({...formData, aadharNumber: e.target.value})}
                    placeholder="1234 5678 9012"
                    maxLength={12}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: "4px",
                      border: "1px solid #d1d5db",
                      fontSize: "0.9rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.9rem", fontWeight: "500" }}>
                    Blood Group (Optional)
                  </label>
                  <select
                    value={formData.bloodType}
                    onChange={(e) => setFormData({...formData, bloodType: e.target.value})}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: "4px",
                      border: "1px solid #d1d5db",
                      fontSize: "0.9rem",
                      boxSizing: "border-box"
                    }}
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>


              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.9rem", fontWeight: "500" }}>
                  Address (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Full address with street, city, state, and pincode"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid #d1d5db",
                    fontSize: "0.9rem",
                    boxSizing: "border-box",
                    resize: "vertical"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingPatient(null);
                    resetForm();
                  }}
                  style={{
                    background: "#6b7280",
                    color: "white",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "4px",
                    border: "none",
                    fontSize: "0.9rem",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: "#10b981",
                    color: "white",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "4px",
                    border: "none",
                    fontSize: "0.9rem",
                    cursor: "pointer"
                  }}
                >
                  {editingPatient ? 'Update Patient' : 'Add Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Patient Modal */}
      {viewingPatient && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "white",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
            maxWidth: "600px",
            width: "90%",
            maxHeight: "90vh",
            overflow: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ margin: 0, color: "#1f2937" }}>Patient Details</h2>
              <button
                onClick={() => setViewingPatient(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#6b7280"
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.9rem" }}>
              <div><strong>Patient ID:</strong> {viewingPatient.patientId}</div>
              <div><strong>Name:</strong> {viewingPatient.firstName} {viewingPatient.lastName}</div>
              <div><strong>Gender:</strong> {viewingPatient.gender}</div>
              <div><strong>Date of Birth:</strong> {new Date(viewingPatient.dateOfBirth).toLocaleDateString()}</div>
              <div><strong>Phone:</strong> {viewingPatient.phone}</div>
              <div><strong>Email:</strong> {viewingPatient.email || 'Not provided'}</div>
              <div><strong>Blood Group:</strong> {viewingPatient.bloodGroup}</div>
              <div><strong>Status:</strong> <span style={{
                padding: "0.25rem 0.5rem",
                borderRadius: "12px",
                fontSize: "0.75rem",
                background: viewingPatient.status === 'ACTIVE' ? '#dcfce7' : '#f3f4f6',
                color: viewingPatient.status === 'ACTIVE' ? '#166534' : '#374151'
              }}>{viewingPatient.status}</span></div>
            </div>
            
            <div style={{ marginTop: "1rem" }}>
              <strong>Address:</strong>
              <p style={{ marginTop: "0.5rem", color: "#6b7280" }}>{viewingPatient.address}</p>
            </div>
            
            {(viewingPatient.emergencyContactName || viewingPatient.emergencyContactPhone) && (
              <div style={{ marginTop: "1rem" }}>
                <strong>Emergency Contact:</strong>
                <p style={{ marginTop: "0.5rem", color: "#6b7280" }}>
                  {viewingPatient.emergencyContactName} - {viewingPatient.emergencyContactPhone}
                </p>
              </div>
            )}
            
            <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setViewingPatient(null)}
                style={{
                  background: "#3b82f6",
                  color: "white",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "4px",
                  border: "none",
                  fontSize: "0.9rem",
                  cursor: "pointer"
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}