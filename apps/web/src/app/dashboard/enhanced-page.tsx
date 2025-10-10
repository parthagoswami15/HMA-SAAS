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
      color: "#3b82f6",
      active: true
    },
    {
      title: "Appointments",
      description: "Schedule and manage appointments",
      icon: "📅",
      href: "/dashboard/appointments", 
      stats: `${stats.todaysAppointments} Today`,
      color: "#10b981",
      active: true
    },
    {
      title: "OPD Management",
      description: "Outpatient consultations and records",
      icon: "🩺",
      href: "/dashboard/opd",
      stats: "Quick Access",
      color: "#8b5cf6",
      active: true
    },
    {
      title: "IPD Management", 
      description: "Inpatient care and bed management",
      icon: "🏥",
      href: "/dashboard/ipd",
      stats: "87% Occupancy",
      color: "#ef4444",
      active: true
    },
    {
      title: "Emergency",
      description: "Emergency cases and triage management",
      icon: "🚑",
      href: "/dashboard/emergency",
      stats: "Active",
      color: "#dc2626",
      active: true
    },
    {
      title: "Laboratory",
      description: "Lab tests and reports management",
      icon: "🧪",
      href: "/dashboard/laboratory", 
      stats: "24 Pending",
      color: "#06b6d4",
      active: true
    },
    {
      title: "Radiology",
      description: "X-Ray, CT, MRI and imaging services",
      icon: "🔬",
      href: "/dashboard/radiology",
      stats: "Active",
      color: "#0891b2",
      active: true
    },
    {
      title: "Pathology",
      description: "Pathology tests and reports",
      icon: "🦠",
      href: "/dashboard/pathology",
      stats: "Active",
      color: "#0e7490",
      active: true
    },
    {
      title: "Pharmacy",
      description: "Medicine inventory and dispensing",
      icon: "💊",
      href: "/dashboard/pharmacy",
      stats: "In Stock",
      color: "#84cc16",
      active: true
    },
    {
      title: "Pharmacy Management",
      description: "Advanced pharmacy inventory control",
      icon: "💉",
      href: "/dashboard/pharmacy-management",
      stats: "Active",
      color: "#65a30d",
      active: true
    },
    {
      title: "Surgery",
      description: "Operation theater and surgery scheduling",
      icon: "⚕️",
      href: "/dashboard/surgery",
      stats: "Active",
      color: "#be123c",
      active: true
    },
    {
      title: "Billing & Invoices",
      description: "Generate bills and track payments",
      icon: "💰",
      href: "/dashboard/billing",
      stats: `${stats.pendingBills} Pending`,
      color: "#f59e0b",
      active: true
    },
    {
      title: "Finance",
      description: "Financial reports and revenue tracking",
      icon: "💵",
      href: "/dashboard/finance",
      stats: "Active",
      color: "#d97706",
      active: true
    },
    {
      title: "Insurance",
      description: "Insurance claims and coverage",
      icon: "🛡️",
      href: "/dashboard/insurance",
      stats: "Active",
      color: "#0284c7",
      active: true
    },
    {
      title: "Staff Management",
      description: "Manage doctors, nurses, and staff",
      icon: "👨‍⚕️",
      href: "/dashboard/staff",
      stats: `${stats.activeDoctors} Active`,
      color: "#ec4899",
      active: true
    },
    {
      title: "HR Management",
      description: "Human resources and attendance",
      icon: "📋",
      href: "/dashboard/hr",
      stats: "Active",
      color: "#db2777",
      active: true
    },
    {
      title: "EMR",
      description: "Electronic Medical Records system",
      icon: "📄",
      href: "/dashboard/emr",
      stats: "Active",
      color: "#7c3aed",
      active: true
    },
    {
      title: "Inventory",
      description: "Medical supplies and equipment tracking",
      icon: "📦",
      href: "/dashboard/inventory",
      stats: "Active",
      color: "#2563eb",
      active: true
    },
    {
      title: "Telemedicine",
      description: "Virtual consultations and video calls",
      icon: "💻",
      href: "/dashboard/telemedicine",
      stats: "Active",
      color: "#059669",
      active: true
    },
    {
      title: "Patient Portal",
      description: "Patient self-service and access",
      icon: "🔐",
      href: "/dashboard/patient-portal",
      stats: "Active",
      color: "#0d9488",
      active: true
    },
    {
      title: "Communications",
      description: "Messages, notifications, and alerts",
      icon: "📱",
      href: "/dashboard/communications",
      stats: "Active",
      color: "#8b5cf6",
      active: true
    },
    {
      title: "Reports & Analytics",
      description: "Hospital performance and insights",
      icon: "📊",
      href: "/dashboard/reports",
      stats: "View Insights",
      color: "#6366f1",
      active: true
    },
    {
      title: "Quality Management",
      description: "Quality metrics and incident tracking",
      icon: "✅",
      href: "/dashboard/quality",
      stats: "Active",
      color: "#10b981",
      active: true
    },
    {
      title: "Research",
      description: "Clinical trials and research projects",
      icon: "🔍",
      href: "/dashboard/research",
      stats: "Active",
      color: "#6366f1",
      active: true
    },
    {
      title: "Integration",
      description: "Third-party integrations and APIs",
      icon: "🔗",
      href: "/dashboard/integration",
      stats: "Active",
      color: "#64748b",
      active: true
    },
    {
      title: "AI Assistant",
      description: "AI-powered insights and assistance",
      icon: "🤖",
      href: "/dashboard/ai-assistant",
      stats: "Coming Soon",
      color: "#8b5cf6",
      active: false
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ color: "#1f2937", fontSize: "1.5rem", fontWeight: "600", margin: 0 }}>
              HMS Modules ({modules.filter(m => m.active).length}/{modules.length} Active)
            </h2>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }}></div>
                <span style={{ fontSize: "0.9rem", color: "#6b7280" }}>Active</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginLeft: "1rem" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#9ca3af" }}></div>
                <span style={{ fontSize: "0.9rem", color: "#6b7280" }}>Coming Soon</span>
              </div>
            </div>
          </div>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "1rem" 
          }}>
            {modules.map((module, index) => (
              <Link 
                key={index}
                href={module.active ? module.href : "#"}
                style={{ textDecoration: "none", pointerEvents: module.active ? "auto" : "none" }}
              >
                <div style={{
                  background: module.active ? "white" : "#f9fafb",
                  padding: "1.5rem",
                  borderRadius: "10px",
                  boxShadow: module.active ? "0 1px 3px rgba(0, 0, 0, 0.1)" : "0 1px 2px rgba(0, 0, 0, 0.05)",
                  border: module.active ? "1px solid #f1f5f9" : "1px solid #e5e7eb",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: module.active ? "pointer" : "not-allowed",
                  opacity: module.active ? 1 : 0.6,
                  position: "relative"
                }}
                onMouseEnter={(e) => {
                  if (module.active) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (module.active) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
                  }
                }}
                >
                  {/* Active Indicator Badge */}
                  <div style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: module.active ? "#10b981" : "#9ca3af"
                  }}></div>
                  
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
                        color: module.active ? "#1f2937" : "#6b7280", 
                        fontSize: "1.1rem", 
                        fontWeight: "600", 
                        margin: "0 0 0.5rem 0",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
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
                        color: module.active ? module.color : "#9ca3af", 
                        fontSize: "0.85rem", 
                        fontWeight: "500",
                        background: module.active ? `${module.color}10` : "#f3f4f6",
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