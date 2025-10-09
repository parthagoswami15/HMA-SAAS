'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EnhancedDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todaysAppointments: 0,
    pendingBills: 0,
    activeDoctors: 0
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (!storedToken || !storedUser) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(storedUser));
    
    // Mock stats - in real app, fetch from API
    setStats({
      totalPatients: 2847,
      todaysAppointments: 45,
      pendingBills: 12,
      activeDoctors: 15
    });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          background: "rgba(255, 255, 255, 0.95)",
          padding: "3rem",
          borderRadius: "15px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
          textAlign: "center"
        }}>
          <div>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  const modules = [
    {
      title: "Patient Management",
      description: "Register, manage, and view patient information",
      icon: "👥",
      href: "/dashboard/patients",
      stats: `${stats.totalPatients} Patients`,
      color: "#3b82f6"
    },
    {
      title: "Appointments",
      description: "Schedule and manage appointments",
      icon: "📅",
      href: "/dashboard/appointments", 
      stats: `${stats.todaysAppointments} Today`,
      color: "#10b981"
    },
    {
      title: "Billing & Invoices",
      description: "Generate bills and track payments",
      icon: "💰",
      href: "/dashboard/billing",
      stats: `${stats.pendingBills} Pending`,
      color: "#f59e0b"
    },
    {
      title: "OPD Management",
      description: "Outpatient consultations and records",
      icon: "🩺",
      href: "/dashboard/opd",
      stats: "Quick Access",
      color: "#8b5cf6"
    },
    {
      title: "IPD Management", 
      description: "Inpatient care and bed management",
      icon: "🏥",
      href: "/dashboard/ipd",
      stats: "87% Occupancy",
      color: "#ef4444"
    },
    {
      title: "Laboratory",
      description: "Lab tests and reports management",
      icon: "🧪",
      href: "/dashboard/laboratory", 
      stats: "24 Pending",
      color: "#06b6d4"
    },
    {
      title: "Pharmacy",
      description: "Medicine inventory and dispensing",
      icon: "💊",
      href: "/dashboard/pharmacy",
      stats: "In Stock",
      color: "#84cc16"
    },
    {
      title: "Staff Management",
      description: "Manage doctors, nurses, and staff",
      icon: "👨‍⚕️",
      href: "/dashboard/staff",
      stats: `${stats.activeDoctors} Active`,
      color: "#ec4899"
    },
    {
      title: "Reports & Analytics",
      description: "Hospital performance and insights",
      icon: "📊",
      href: "/dashboard/reports",
      stats: "View Insights",
      color: "#6366f1"
    }
  ];

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
          <Link href="/" style={{ textDecoration: "none", color: "#667eea", fontSize: "1.5rem", fontWeight: "bold" }}>
            HMS SAAS
          </Link>
          <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>Hospital Management Dashboard</span>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: "600", color: "#374151" }}>
              {user.firstName} {user.lastName}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
              {user.role} • {user.tenant?.name}
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: "#ef4444",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "none",
              fontSize: "0.9rem",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: "2rem" }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ color: "#1f2937", fontSize: "2rem", fontWeight: "700", marginBottom: "0.5rem" }}>
            Welcome back, {user.firstName}! 👋
          </h1>
          <p style={{ color: "#6b7280", fontSize: "1.1rem" }}>
            Here's what's happening at {user.tenant?.name} today
          </p>
        </div>

        {/* Quick Stats */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
          gap: "1rem", 
          marginBottom: "2rem" 
        }}>
          {[
            { label: "Total Patients", value: stats.totalPatients, color: "#3b82f6", icon: "👥" },
            { label: "Today's Appointments", value: stats.todaysAppointments, color: "#10b981", icon: "📅" },
            { label: "Pending Bills", value: stats.pendingBills, color: "#f59e0b", icon: "💰" },
            { label: "Active Doctors", value: stats.activeDoctors, color: "#8b5cf6", icon: "👨‍⚕️" }
          ].map((stat, index) => (
            <div key={index} style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "10px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              border: "1px solid #f1f5f9"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ color: "#6b7280", fontSize: "0.9rem", margin: "0 0 0.5rem 0" }}>{stat.label}</p>
                  <p style={{ color: "#1f2937", fontSize: "1.8rem", fontWeight: "700", margin: 0 }}>{stat.value}</p>
                </div>
                <div style={{ 
                  fontSize: "2rem", 
                  color: stat.color,
                  background: `${stat.color}10`,
                  padding: "0.5rem",
                  borderRadius: "8px"
                }}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* HMS Modules */}
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "#1f2937", fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem" }}>
            HMS Modules
          </h2>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "1rem" 
          }}>
            {modules.map((module, index) => (
              <Link 
                key={index}
                href={module.href}
                style={{ textDecoration: "none" }}
              >
                <div style={{
                  background: "white",
                  padding: "1.5rem",
                  borderRadius: "10px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #f1f5f9",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer",
                  ":hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
                  }
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
                }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                    <div style={{ 
                      fontSize: "2rem", 
                      background: `${module.color}15`,
                      padding: "0.75rem",
                      borderRadius: "8px"
                    }}>
                      {module.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        color: "#1f2937", 
                        fontSize: "1.1rem", 
                        fontWeight: "600", 
                        margin: "0 0 0.5rem 0" 
                      }}>
                        {module.title}
                      </h3>
                      <p style={{ 
                        color: "#6b7280", 
                        fontSize: "0.9rem", 
                        margin: "0 0 1rem 0",
                        lineHeight: "1.4"
                      }}>
                        {module.description}
                      </p>
                      <div style={{ 
                        color: module.color, 
                        fontSize: "0.85rem", 
                        fontWeight: "500",
                        background: `${module.color}10`,
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        display: "inline-block"
                      }}>
                        {module.stats}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          textAlign: "center", 
          padding: "2rem", 
          color: "#6b7280", 
          fontSize: "0.9rem",
          borderTop: "1px solid #f1f5f9"
        }}>
          <p>HMS SAAS - Complete Hospital Management System</p>
          <p>Built with ❤️ for modern healthcare facilities</p>
        </div>
      </div>
    </div>
  );
}