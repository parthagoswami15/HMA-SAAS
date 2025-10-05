'use client';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import React, { useState } from 'react';

interface ImagingOrder {
  id: string;
  orderId: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'M' | 'F';
  examType: string;
  bodyPart: string;
  urgency: 'STAT' | 'URGENT' | 'ROUTINE';
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'REPORTED' | 'CANCELLED';
  orderDate: string;
  scheduledDate: string;
  completedDate?: string;
  orderingPhysician: string;
  department: string;
  notes: string;
  contrast: boolean;
  preparation: string;
  estimatedDuration: number;
  technician?: string;
  radiologist?: string;
  reportStatus: 'PENDING' | 'DRAFT' | 'FINAL' | 'AMENDED';
  facility: string;
}

interface RadiologyReport {
  id: string;
  orderId: string;
  patientName: string;
  examType: string;
  examDate: string;
  radiologist: string;
  status: 'DRAFT' | 'FINAL' | 'AMENDED';
  findings: string;
  impression: string;
  recommendations: string;
  reportDate: string;
  criticalFindings: boolean;
  comparison: string;
  technique: string;
  images: number;
}

const RadiologyPage = () => {
  const [currentTab, setCurrentTab] = useState<'orders' | 'worklist' | 'reports' | 'schedule' | 'equipment'>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<ImagingOrder | null>(null);
  const [selectedReport, setSelectedReport] = useState<RadiologyReport | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const mockOrders: ImagingOrder[] = [
    {
      id: '1',
      orderId: 'RAD-2024-001',
      patientId: 'P001',
      patientName: 'John Smith',
      patientAge: 45,
      patientGender: 'M',
      examType: 'Chest CT with Contrast',
      bodyPart: 'Chest',
      urgency: 'URGENT',
      status: 'SCHEDULED',
      orderDate: '2024-12-05',
      scheduledDate: '2024-12-06T10:00:00',
      orderingPhysician: 'Dr. Emily Johnson',
      department: 'Emergency Department',
      notes: 'Suspected pulmonary embolism, patient has chest pain and shortness of breath',
      contrast: true,
      preparation: 'NPO 4 hours prior to exam',
      estimatedDuration: 30,
      reportStatus: 'PENDING',
      facility: 'Main Campus'
    },
    {
      id: '2',
      orderId: 'RAD-2024-002',
      patientId: 'P002',
      patientName: 'Sarah Wilson',
      patientAge: 32,
      patientGender: 'F',
      examType: 'Abdominal Ultrasound',
      bodyPart: 'Abdomen',
      urgency: 'ROUTINE',
      status: 'COMPLETED',
      orderDate: '2024-12-04',
      scheduledDate: '2024-12-05T14:30:00',
      completedDate: '2024-12-05T14:45:00',
      orderingPhysician: 'Dr. Michael Chen',
      department: 'Obstetrics & Gynecology',
      notes: 'First trimester pregnancy confirmation',
      contrast: false,
      preparation: 'Full bladder required',
      estimatedDuration: 15,
      technician: 'Lisa Rodriguez, RT',
      radiologist: 'Dr. James Park',
      reportStatus: 'FINAL',
      facility: 'Women\'s Center'
    },
    {
      id: '3',
      orderId: 'RAD-2024-003',
      patientId: 'P003',
      patientName: 'Robert Davis',
      patientAge: 67,
      patientGender: 'M',
      examType: 'Lumbar Spine MRI',
      bodyPart: 'Spine',
      urgency: 'ROUTINE',
      status: 'IN_PROGRESS',
      orderDate: '2024-12-03',
      scheduledDate: '2024-12-05T16:00:00',
      orderingPhysician: 'Dr. Susan Martinez',
      department: 'Orthopedics',
      notes: 'Chronic lower back pain, rule out disc herniation',
      contrast: false,
      preparation: 'Remove all metal objects',
      estimatedDuration: 45,
      technician: 'Mark Johnson, RT',
      reportStatus: 'PENDING',
      facility: 'Orthopedic Center'
    },
    {
      id: '4',
      orderId: 'RAD-2024-004',
      patientId: 'P004',
      patientName: 'Maria Garcia',
      patientAge: 28,
      patientGender: 'F',
      examType: 'Chest X-Ray',
      bodyPart: 'Chest',
      urgency: 'STAT',
      status: 'REPORTED',
      orderDate: '2024-12-05',
      scheduledDate: '2024-12-05T08:00:00',
      completedDate: '2024-12-05T08:15:00',
      orderingPhysician: 'Dr. David Thompson',
      department: 'Emergency Department',
      notes: 'Motor vehicle accident, trauma evaluation',
      contrast: false,
      preparation: 'None',
      estimatedDuration: 10,
      technician: 'Angela Wright, RT',
      radiologist: 'Dr. Jennifer Kim',
      reportStatus: 'FINAL',
      facility: 'Emergency Department'
    }
  ];

  const mockReports: RadiologyReport[] = [
    {
      id: '1',
      orderId: 'RAD-2024-002',
      patientName: 'Sarah Wilson',
      examType: 'Abdominal Ultrasound',
      examDate: '2024-12-05T14:30:00',
      radiologist: 'Dr. James Park',
      status: 'FINAL',
      findings: 'Single intrauterine gestational sac identified measuring 15mm in greatest dimension, corresponding to approximately 7 weeks gestational age. Yolk sac and fetal pole with cardiac activity visualized. No free fluid in pelvis.',
      impression: '1. Single viable intrauterine pregnancy at approximately 7 weeks gestational age.\n2. Normal appearing uterus and adnexa.',
      recommendations: 'Routine prenatal care. Follow-up obstetric ultrasound at 18-20 weeks for anatomic survey.',
      reportDate: '2024-12-05T15:30:00',
      criticalFindings: false,
      comparison: 'No prior imaging available for comparison',
      technique: 'Transabdominal and transvaginal ultrasound performed',
      images: 12
    },
    {
      id: '2',
      orderId: 'RAD-2024-004',
      patientName: 'Maria Garcia',
      examType: 'Chest X-Ray',
      examDate: '2024-12-05T08:00:00',
      radiologist: 'Dr. Jennifer Kim',
      status: 'FINAL',
      findings: 'The heart size is normal. The mediastinal and hilar contours are within normal limits. The lungs are clear without focal consolidation, effusion, or pneumothorax. The costophrenic angles are sharp. No acute bony abnormalities are identified.',
      impression: 'Normal chest radiograph. No acute cardiopulmonary abnormalities.',
      recommendations: 'No further imaging required at this time unless clinically indicated.',
      reportDate: '2024-12-05T08:30:00',
      criticalFindings: false,
      comparison: 'No prior chest imaging available',
      technique: 'Single frontal chest radiograph',
      images: 1
    }
  ];

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.examType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    const matchesUrgency = urgencyFilter === 'ALL' || order.urgency === urgencyFilter;
    
    return matchesSearch && matchesStatus && matchesUrgency;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      'SCHEDULED': '#3b82f6',
      'IN_PROGRESS': '#f59e0b', 
      'COMPLETED': '#10b981',
      'REPORTED': '#06b6d4',
      'CANCELLED': '#ef4444'
    };
    return colors[status as keyof typeof colors] || '#6b7280';
  };

  const getUrgencyColor = (urgency: string) => {
    const colors = {
      'STAT': '#ef4444',
      'URGENT': '#f59e0b',
      'ROUTINE': '#10b981'
    };
    return colors[urgency as keyof typeof colors] || '#6b7280';
  };

  const OrderModal = () => (
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
            Imaging Order Details
          </h2>
          <button
            onClick={() => setShowOrderModal(false)}
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

        {selectedOrder && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Patient Information */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                Patient Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <span style={{ fontWeight: '600' }}>Name:</span> {selectedOrder.patientName}
                </div>
                <div>
                  <span style={{ fontWeight: '600' }}>Age:</span> {selectedOrder.patientAge}
                </div>
                <div>
                  <span style={{ fontWeight: '600' }}>Gender:</span> {selectedOrder.patientGender === 'M' ? 'Male' : 'Female'}
                </div>
                <div>
                  <span style={{ fontWeight: '600' }}>Patient ID:</span> {selectedOrder.patientId}
                </div>
              </div>
            </div>

            {/* Exam Information */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                Examination Details
              </h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <div><span style={{ fontWeight: '600' }}>Exam Type:</span> {selectedOrder.examType}</div>
                <div><span style={{ fontWeight: '600' }}>Body Part:</span> {selectedOrder.bodyPart}</div>
                <div><span style={{ fontWeight: '600' }}>Contrast:</span> {selectedOrder.contrast ? 'Yes' : 'No'}</div>
                <div><span style={{ fontWeight: '600' }}>Duration:</span> {selectedOrder.estimatedDuration} minutes</div>
                <div><span style={{ fontWeight: '600' }}>Preparation:</span> {selectedOrder.preparation}</div>
              </div>
            </div>

            {/* Order Information */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                Order Information
              </h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <div><span style={{ fontWeight: '600' }}>Order ID:</span> {selectedOrder.orderId}</div>
                <div><span style={{ fontWeight: '600' }}>Ordering Physician:</span> {selectedOrder.orderingPhysician}</div>
                <div><span style={{ fontWeight: '600' }}>Department:</span> {selectedOrder.department}</div>
                <div><span style={{ fontWeight: '600' }}>Order Date:</span> {new Date(selectedOrder.orderDate).toLocaleDateString()}</div>
                <div><span style={{ fontWeight: '600' }}>Scheduled Date:</span> {new Date(selectedOrder.scheduledDate).toLocaleString()}</div>
                <div><span style={{ fontWeight: '600' }}>Facility:</span> {selectedOrder.facility}</div>
              </div>
            </div>

            {/* Status and Assignment */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                Status & Assignment
              </h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <div>
                  <span style={{ fontWeight: '600' }}>Status:</span>
                  <span style={{
                    marginLeft: '0.5rem',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'white',
                    backgroundColor: getStatusColor(selectedOrder.status)
                  }}>
                    {selectedOrder.status.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <span style={{ fontWeight: '600' }}>Urgency:</span>
                  <span style={{
                    marginLeft: '0.5rem',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'white',
                    backgroundColor: getUrgencyColor(selectedOrder.urgency)
                  }}>
                    {selectedOrder.urgency}
                  </span>
                </div>
                {selectedOrder.technician && (
                  <div><span style={{ fontWeight: '600' }}>Technician:</span> {selectedOrder.technician}</div>
                )}
                {selectedOrder.radiologist && (
                  <div><span style={{ fontWeight: '600' }}>Radiologist:</span> {selectedOrder.radiologist}</div>
                )}
              </div>
            </div>

            {/* Clinical Notes */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                Clinical Notes
              </h3>
              <p style={{
                padding: '1rem',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                {selectedOrder.notes}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
              {selectedOrder.status === 'SCHEDULED' && (
                <Button variant="primary">Start Exam</Button>
              )}
              {selectedOrder.status === 'COMPLETED' && selectedOrder.reportStatus === 'PENDING' && (
                <Button variant="primary">Create Report</Button>
              )}
              <Button variant="outline">Edit Order</Button>
              <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const ReportModal = () => (
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
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
            Radiology Report
          </h2>
          <button
            onClick={() => setShowReportModal(false)}
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

        {selectedReport && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Report Header */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div><span style={{ fontWeight: '600' }}>Patient:</span> {selectedReport.patientName}</div>
              <div><span style={{ fontWeight: '600' }}>Exam:</span> {selectedReport.examType}</div>
              <div><span style={{ fontWeight: '600' }}>Exam Date:</span> {new Date(selectedReport.examDate).toLocaleDateString()}</div>
              <div><span style={{ fontWeight: '600' }}>Radiologist:</span> {selectedReport.radiologist}</div>
              <div><span style={{ fontWeight: '600' }}>Report Date:</span> {new Date(selectedReport.reportDate).toLocaleDateString()}</div>
              <div>
                <span style={{ fontWeight: '600' }}>Status:</span>
                <span style={{
                  marginLeft: '0.5rem',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'white',
                  backgroundColor: selectedReport.status === 'FINAL' ? '#10b981' : '#f59e0b'
                }}>
                  {selectedReport.status}
                </span>
              </div>
            </div>

            {/* Technique and Comparison */}
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                Technique
              </h3>
              <p style={{ color: '#374151' }}>{selectedReport.technique}</p>
            </div>

            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                Comparison
              </h3>
              <p style={{ color: '#374151' }}>{selectedReport.comparison}</p>
            </div>

            {/* Findings */}
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                Findings
              </h3>
              <p style={{
                padding: '1rem',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                color: '#374151',
                lineHeight: '1.6'
              }}>
                {selectedReport.findings}
              </p>
            </div>

            {/* Impression */}
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                Impression
              </h3>
              <p style={{
                padding: '1rem',
                backgroundColor: '#fef3c7',
                borderRadius: '8px',
                border: '1px solid #f59e0b',
                color: '#92400e',
                lineHeight: '1.6',
                whiteSpace: 'pre-line'
              }}>
                {selectedReport.impression}
              </p>
            </div>

            {/* Recommendations */}
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                Recommendations
              </h3>
              <p style={{
                padding: '1rem',
                backgroundColor: '#f0fdf4',
                borderRadius: '8px',
                border: '1px solid #bbf7d0',
                color: '#166534',
                lineHeight: '1.6'
              }}>
                {selectedReport.recommendations}
              </p>
            </div>

            {selectedReport.criticalFindings && (
              <div style={{
                padding: '1rem',
                backgroundColor: '#fef2f2',
                borderRadius: '8px',
                border: '1px solid #fecaca'
              }}>
                <h4 style={{ color: '#dc2626', fontWeight: '600', marginBottom: '0.5rem' }}>
                  ⚠️ Critical Findings Alert
                </h4>
                <p style={{ color: '#dc2626' }}>
                  This report contains critical findings that require immediate attention.
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
              <Button variant="primary">📄 Print Report</Button>
              <Button variant="outline">📧 Send to Physician</Button>
              <Button variant="secondary" onClick={() => setShowReportModal(false)}>
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
              Radiology & Imaging
            </h1>
            <p style={{ color: '#6b7280', fontSize: '1rem' }}>
              Manage imaging orders, reports, and radiology workflow
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="primary">
              ➕ New Order
            </Button>
            <Button variant="outline">
              📊 Statistics
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
            {[
              { key: 'orders', label: '📋 Orders', desc: 'All Orders' },
              { key: 'worklist', label: '⚡ Worklist', desc: 'Today\'s Schedule' },
              { key: 'reports', label: '📄 Reports', desc: 'Radiology Reports' },
              { key: 'schedule', label: '📅 Schedule', desc: 'Equipment Calendar' },
              { key: 'equipment', label: '🏥 Equipment', desc: 'Machine Status' }
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

        {/* Orders Tab */}
        {currentTab === 'orders' && (
          <>
            {/* Search and Filters */}
            <Card style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '250px' }}>
                  <Input
                    placeholder="Search by patient name, order ID, or exam type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    minWidth: '150px'
                  }}
                >
                  <option value="ALL">All Status</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="REPORTED">Reported</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>

                <select
                  value={urgencyFilter}
                  onChange={(e) => setUrgencyFilter(e.target.value)}
                  style={{
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    minWidth: '150px'
                  }}
                >
                  <option value="ALL">All Urgency</option>
                  <option value="STAT">STAT</option>
                  <option value="URGENT">Urgent</option>
                  <option value="ROUTINE">Routine</option>
                </select>

                <Button variant="outline">
                  🔄 Refresh
                </Button>
              </div>
            </Card>

            {/* Orders List */}
            <div style={{ display: 'grid', gap: '1rem' }}>
              {filteredOrders.map(order => (
                <Card key={order.id} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                          {order.patientName}
                        </h3>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: 'white',
                          backgroundColor: getUrgencyColor(order.urgency)
                        }}>
                          {order.urgency}
                        </span>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: 'white',
                          backgroundColor: getStatusColor(order.status)
                        }}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <div style={{ color: '#6b7280' }}>
                          <span style={{ fontWeight: '600' }}>Order ID:</span> {order.orderId}
                        </div>
                        <div style={{ color: '#6b7280' }}>
                          <span style={{ fontWeight: '600' }}>Exam:</span> {order.examType}
                        </div>
                        <div style={{ color: '#6b7280' }}>
                          <span style={{ fontWeight: '600' }}>Scheduled:</span> {new Date(order.scheduledDate).toLocaleString()}
                        </div>
                        <div style={{ color: '#6b7280' }}>
                          <span style={{ fontWeight: '600' }}>Physician:</span> {order.orderingPhysician}
                        </div>
                      </div>
                      
                      <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                        {order.notes}
                      </p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                      >
                        View Details
                      </Button>
                      {order.status === 'REPORTED' && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => {
                            const report = mockReports.find(r => r.orderId === order.orderId);
                            if (report) {
                              setSelectedReport(report);
                              setShowReportModal(true);
                            }
                          }}
                        >
                          View Report
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Worklist Tab */}
        {currentTab === 'worklist' && (
          <Card>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                Today&apos;s Imaging Worklist
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                View and manage today&apos;s scheduled imaging exams by technician and equipment. This interface provides a streamlined workflow for radiology staff.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Button variant="primary">
                  📋 View Worklist
                </Button>
                <Button variant="outline">
                  ⏰ Schedule Management
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Reports Tab */}
        {currentTab === 'reports' && (
          <>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {mockReports.map(report => (
                <Card key={report.id} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                          {report.patientName}
                        </h3>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: 'white',
                          backgroundColor: report.status === 'FINAL' ? '#10b981' : '#f59e0b'
                        }}>
                          {report.status}
                        </span>
                        {report.criticalFindings && (
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: 'white',
                            backgroundColor: '#ef4444'
                          }}>
                            CRITICAL
                          </span>
                        )}
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <div style={{ color: '#6b7280' }}>
                          <span style={{ fontWeight: '600' }}>Exam:</span> {report.examType}
                        </div>
                        <div style={{ color: '#6b7280' }}>
                          <span style={{ fontWeight: '600' }}>Exam Date:</span> {new Date(report.examDate).toLocaleDateString()}
                        </div>
                        <div style={{ color: '#6b7280' }}>
                          <span style={{ fontWeight: '600' }}>Radiologist:</span> {report.radiologist}
                        </div>
                        <div style={{ color: '#6b7280' }}>
                          <span style={{ fontWeight: '600' }}>Images:</span> {report.images}
                        </div>
                      </div>
                      
                      <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                        {report.impression.substring(0, 150)}...
                      </p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => {
                          setSelectedReport(report);
                          setShowReportModal(true);
                        }}
                      >
                        View Report
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Schedule Tab */}
        {currentTab === 'schedule' && (
          <Card>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                Equipment Schedule & Calendar
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                View and manage equipment schedules, maintenance windows, and availability. Coordinate imaging appointments across multiple modalities.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Button variant="primary">
                  📅 View Calendar
                </Button>
                <Button variant="outline">
                  🔧 Maintenance Schedule
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Equipment Tab */}
        {currentTab === 'equipment' && (
          <Card>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏥</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                Imaging Equipment Status
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                Monitor imaging equipment status, utilization, maintenance schedules, and quality control metrics for optimal department operations.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Button variant="primary">
                  🏥 Equipment Dashboard
                </Button>
                <Button variant="outline">
                  🔧 Maintenance Logs
                </Button>
                <Button variant="secondary">
                  📊 Utilization Reports
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Modals */}
        {showOrderModal && <OrderModal />}
        {showReportModal && <ReportModal />}
      </div>
    </Layout>
  );
};

export default RadiologyPage;