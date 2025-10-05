'use client';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useState, useEffect } from 'react';

interface DashboardStats {
  totalPatients: number;
  todaysAppointments: number;
  activeStaff: number;
  totalRevenue: number;
  emergencyCases: number;
  pendingLabOrders: number;
  occupiedBeds: number;
  totalBeds: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 1247,
    todaysAppointments: 42,
    activeStaff: 78,
    totalRevenue: 284750,
    emergencyCases: 6,
    pendingLabOrders: 23,
    occupiedBeds: 156,
    totalBeds: 200
  });

  const [recentActivities] = useState([
    { id: 1, type: 'appointment', patient: 'John Doe', doctor: 'Dr. Smith', time: '10:30 AM', status: 'completed' },
    { id: 2, type: 'admission', patient: 'Sarah Johnson', room: '204', time: '09:15 AM', status: 'active' },
    { id: 3, type: 'lab_result', patient: 'Mike Wilson', test: 'Blood Test', time: '08:45 AM', status: 'ready' },
    { id: 4, type: 'prescription', patient: 'Emily Davis', doctor: 'Dr. Chen', time: '08:20 AM', status: 'dispensed' },
    { id: 5, type: 'emergency', patient: 'Robert Brown', severity: 'High', time: '07:55 AM', status: 'treating' }
  ]);

  const [quickActions] = useState([
    { title: 'New Patient Registration', icon: '👥', href: '/patients/new', color: '#10b981' },
    { title: 'Schedule Appointment', icon: '📅', href: '/appointments/new', color: '#3b82f6' },
    { title: 'Lab Order', icon: '🧪', href: '/lab-tests/new', color: '#8b5cf6' },
    { title: 'Emergency Alert', icon: '🚨', href: '/emergency', color: '#ef4444' },
    { title: 'View Reports', icon: '📊', href: '/reports', color: '#f59e0b' },
    { title: 'Staff Management', icon: '👨‍⚕️', href: '/staff', color: '#06b6d4' }
  ]);

  const StatCard = ({ title, value, icon, color, trend, subtitle }: any) => (
    <Card variant="elevated" style={{ border: `3px solid ${color}15` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
            {title}
          </p>
          <p style={{ margin: '0 0 0.25rem 0', fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
            {value}
          </p>
          {subtitle && (
            <p style={{ margin: '0', fontSize: '0.75rem', color: '#9ca3af' }}>
              {subtitle}
            </p>
          )}
          {trend && (
            <p style={{ 
              margin: '0.5rem 0 0 0', 
              fontSize: '0.75rem', 
              color: trend.type === 'up' ? '#10b981' : '#ef4444',
              fontWeight: '500'
            }}>
              {trend.type === 'up' ? '↗' : '↘'} {trend.value}
            </p>
          )}
        </div>
        <div style={{
          backgroundColor: `${color}15`,
          borderRadius: '12px',
          padding: '0.75rem',
          fontSize: '1.5rem'
        }}>
          {icon}
        </div>
      </div>
    </Card>
  );

  return (
    <Layout>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
            Dashboard Overview
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>
            Welcome back! Here's what's happening at your hospital today.
          </p>
        </div>

        {/* Key Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <StatCard
            title="Total Patients"
            value={stats.totalPatients.toLocaleString()}
            icon="👥"
            color="#3b82f6"
            trend={{ type: 'up', value: '+12% this month' }}
          />
          <StatCard
            title="Today's Appointments"
            value={stats.todaysAppointments}
            icon="📅"
            color="#10b981"
            subtitle="8 completed, 34 remaining"
          />
          <StatCard
            title="Active Staff"
            value={stats.activeStaff}
            icon="👨‍⚕️"
            color="#8b5cf6"
            subtitle="On duty today"
          />
          <StatCard
            title="Monthly Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            icon="💰"
            color="#f59e0b"
            trend={{ type: 'up', value: '+8.2%' }}
          />
        </div>

        {/* Secondary Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <StatCard
            title="Emergency Cases"
            value={stats.emergencyCases}
            icon="🚨"
            color="#ef4444"
            subtitle="Active now"
          />
          <StatCard
            title="Pending Lab Orders"
            value={stats.pendingLabOrders}
            icon="🧪"
            color="#06b6d4"
            subtitle="Awaiting results"
          />
          <StatCard
            title="Bed Occupancy"
            value={`${Math.round((stats.occupiedBeds / stats.totalBeds) * 100)}%`}
            icon="🏥"
            color="#8b5cf6"
            subtitle={`${stats.occupiedBeds}/${stats.totalBeds} beds`}
          />
        </div>

        {/* Quick Actions & Recent Activities */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          {/* Quick Actions */}
          <Card title="Quick Actions" variant="elevated">
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '1rem'
            }}>
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    background: `${action.color}08`,
                    border: `1px solid ${action.color}20`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 4px 12px ${action.color}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onClick={() => window.location.href = action.href}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                    {action.icon}
                  </div>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: '#374151'
                  }}>
                    {action.title}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activities */}
          <Card title="Recent Activities" variant="elevated">
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {recentActivities.map((activity) => (
                <div 
                  key={activity.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 0',
                    borderBottom: '1px solid #f1f5f9'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                      {activity.patient}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {activity.type === 'appointment' && `Appointment with ${activity.doctor}`}
                      {activity.type === 'admission' && `Admitted to Room ${activity.room}`}
                      {activity.type === 'lab_result' && `${activity.test} completed`}
                      {activity.type === 'prescription' && `Prescription by ${activity.doctor}`}
                      {activity.type === 'emergency' && `Emergency case - ${activity.severity} priority`}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                      {activity.time}
                    </div>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      backgroundColor: 
                        activity.status === 'completed' ? '#dcfce7' :
                        activity.status === 'active' ? '#dbeafe' :
                        activity.status === 'ready' ? '#fef3c7' :
                        activity.status === 'dispensed' ? '#e0e7ff' :
                        '#fecaca',
                      color:
                        activity.status === 'completed' ? '#166534' :
                        activity.status === 'active' ? '#1e40af' :
                        activity.status === 'ready' ? '#92400e' :
                        activity.status === 'dispensed' ? '#3730a3' :
                        '#991b1b'
                    }}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Performance Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          {/* Patient Flow Chart */}
          <Card title="Patient Flow (Last 7 Days)" variant="elevated">
            <div style={{ height: '200px', display: 'flex', alignItems: 'end', justifyContent: 'space-around', padding: '1rem 0' }}>
              {[45, 52, 38, 61, 47, 55, 42].map((value, index) => (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '30px',
                    height: `${(value / 70) * 150}px`,
                    backgroundColor: '#667eea',
                    borderRadius: '4px 4px 0 0',
                    marginBottom: '0.5rem'
                  }} />
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Department Utilization */}
          <Card title="Department Utilization" variant="elevated">
            <div style={{ space: '1rem' }}>
              {[
                { name: 'Cardiology', utilization: 85, color: '#ef4444' },
                { name: 'Orthopedics', utilization: 72, color: '#10b981' },
                { name: 'Neurology', utilization: 68, color: '#3b82f6' },
                { name: 'Pediatrics', utilization: 91, color: '#f59e0b' },
                { name: 'Emergency', utilization: 94, color: '#8b5cf6' }
              ].map((dept, index) => (
                <div key={index} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      {dept.name}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {dept.utilization}%
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${dept.utilization}%`,
                      height: '100%',
                      backgroundColor: dept.color,
                      borderRadius: '3px'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Alerts and Notifications */}
        <Card title="Alerts & Notifications" variant="elevated" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            <div style={{
              padding: '1rem',
              borderRadius: '8px',
              backgroundColor: '#fef3c7',
              border: '1px solid #fbbf24'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>⚠️</span>
                <span style={{ fontWeight: '600', color: '#92400e' }}>Equipment Maintenance</span>
              </div>
              <p style={{ margin: '0', fontSize: '0.875rem', color: '#78350f' }}>
                MRI Machine #2 scheduled for maintenance tomorrow at 2:00 PM
              </p>
            </div>

            <div style={{
              padding: '1rem',
              borderRadius: '8px',
              backgroundColor: '#fee2e2',
              border: '1px solid #f87171'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>🏥</span>
                <span style={{ fontWeight: '600', color: '#991b1b' }}>Bed Capacity Alert</span>
              </div>
              <p style={{ margin: '0', fontSize: '0.875rem', color: '#7f1d1d' }}>
                ICU at 92% capacity. Consider patient transfers if needed.
              </p>
            </div>

            <div style={{
              padding: '1rem',
              borderRadius: '8px',
              backgroundColor: '#d1fae5',
              border: '1px solid #34d399'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>✅</span>
                <span style={{ fontWeight: '600', color: '#065f46' }}>System Update</span>
              </div>
              <p style={{ margin: '0', fontSize: '0.875rem', color: '#047857' }}>
                All systems updated successfully. New features available in Reports module.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;