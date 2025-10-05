'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser] = useState({
    name: 'Dr. John Smith',
    role: 'DOCTOR',
    email: 'john.smith@hospital.com',
    avatar: '/avatar-placeholder.jpg'
  });

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: '📊',
      roles: ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST']
    },
    {
      title: 'Patients',
      href: '/patients',
      icon: '👥',
      roles: ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST']
    },
    {
      title: 'Appointments',
      href: '/appointments',
      icon: '📅',
      roles: ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST']
    },
    {
      title: 'Medical Records',
      href: '/medical-records',
      icon: '📋',
      roles: ['ADMIN', 'DOCTOR', 'NURSE']
    },
    {
      title: 'Prescriptions',
      href: '/prescriptions',
      icon: '💊',
      roles: ['ADMIN', 'DOCTOR', 'PHARMACIST']
    },
    {
      title: 'Lab Tests',
      href: '/lab-tests',
      icon: '🧪',
      roles: ['ADMIN', 'DOCTOR', 'LAB_TECHNICIAN']
    },
    {
      title: 'Radiology',
      href: '/radiology',
      icon: '🩻',
      roles: ['ADMIN', 'DOCTOR', 'RADIOLOGIST']
    },
    {
      title: 'Telemedicine',
      href: '/telemedicine',
      icon: '💻',
      roles: ['ADMIN', 'DOCTOR']
    },
    {
      title: 'Billing',
      href: '/billing',
      icon: '💰',
      roles: ['ADMIN', 'ACCOUNTANT', 'RECEPTIONIST']
    },
    {
      title: 'Staff',
      href: '/staff',
      icon: '👨‍⚕️',
      roles: ['ADMIN', 'HOSPITAL_ADMIN']
    },
    {
      title: 'Reports',
      href: '/reports',
      icon: '📈',
      roles: ['ADMIN', 'HOSPITAL_ADMIN', 'DOCTOR']
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: '⚙️',
      roles: ['ADMIN', 'HOSPITAL_ADMIN']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(currentUser.role)
  );

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '280px' : '80px',
        transition: 'width 0.3s ease',
        background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        position: 'fixed',
        height: '100vh',
        zIndex: 1000,
        overflowY: 'auto'
      }}>
        {/* Logo */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center'
        }}>
          <Link href="/dashboard" style={{ 
            color: 'white', 
            textDecoration: 'none',
            fontSize: sidebarOpen ? '1.5rem' : '1rem',
            fontWeight: 'bold'
          }}>
            {sidebarOpen ? 'HMS SAAS' : 'HMS'}
          </Link>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: 'absolute',
            right: '-12px',
            top: '100px',
            background: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 1001
          }}
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>

        {/* Navigation */}
        <nav style={{ padding: '1rem 0' }}>
          {filteredMenuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.875rem 1.5rem',
                color: isActive(item.href) ? 'white' : 'rgba(255,255,255,0.8)',
                textDecoration: 'none',
                background: isActive(item.href) ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderRight: isActive(item.href) ? '4px solid white' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ fontSize: '1.2rem', marginRight: sidebarOpen ? '0.75rem' : '0' }}>
                {item.icon}
              </span>
              {sidebarOpen && (
                <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>
                  {item.title}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        {sidebarOpen && (
          <div style={{
            position: 'absolute',
            bottom: '0',
            width: '100%',
            padding: '1rem',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '0.75rem',
                fontSize: '1.2rem'
              }}>
                👨‍⚕️
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                  {currentUser.role.replace('_', ' ')}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{
        marginLeft: sidebarOpen ? '280px' : '80px',
        transition: 'margin-left 0.3s ease',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}>
        {/* Header */}
        <header style={{
          background: 'white',
          padding: '1rem 2rem',
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '600', 
                color: '#1f2937',
                margin: 0
              }}>
                Hospital Management System
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                padding: '0.5rem',
                borderRadius: '8px',
                background: '#f3f4f6',
                cursor: 'pointer'
              }}>
                🔔
              </div>
              <Link href="/profile" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#1f2937',
                textDecoration: 'none'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.9rem'
                }}>
                  👨‍⚕️
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                  {currentUser.name}
                </span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ 
          flex: 1, 
          padding: '2rem',
          overflow: 'auto'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;