'use client';

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getModulesForRole, getRoleDisplayName, getRoleBadgeColor, type UserRole, type DashboardModule } from '@/lib/rbac';

export default function EnhancedDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
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

    const userData = JSON.parse(storedUser);
    setUser(userData);
    
    // Stats will be fetched from API - showing zeros until implemented
    setStats({
      totalPatients: 0,
      todaysAppointments: 0,
      pendingBills: 0,
      activeDoctors: 0
    });
    
    // TODO: Fetch real stats from API
    // fetchDashboardStats().then(data => setStats(data));
  }, [router]);

  // Get modules accessible to this user's role (RBAC filtering)
  const accessibleModules = useMemo(() => {
    if (!user?.role) return [];
    const filtered = getModulesForRole(user.role as UserRole);
    console.log(`[Dashboard] Modules for ${user.role}:`, filtered.length, 'modules');
    return filtered;
  }, [user]);

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

  const modules = accessibleModules;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      minHeight: '100%',
      borderRadius: '16px',
      padding: '0',
      backgroundAttachment: 'fixed'
    }}>
      {/* Welcome Section */}
      <div style={{
        background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
        color: 'white',
        padding: '3rem 2rem',
        borderRadius: '16px 16px 0 0',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '200px',
          height: '200px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          filter: 'blur(50px)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-10%',
          width: '150px',
          height: '150px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50%',
          filter: 'blur(30px)'
        }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '800',
              margin: 0,
              background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Welcome back, {user.firstName}! 👋
            </h1>
            <span style={{
              background: getRoleBadgeColor(user.role as UserRole),
              color: 'white',
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}>
              {getRoleDisplayName(user.role as UserRole)}
            </span>
          </div>
          <p style={{
            fontSize: '1rem',
            opacity: 0.9,
            margin: 0
          }}>
            Here's what's happening at {user.tenant?.name} today • {modules.length} modules available
          </p>
        </div>
      </div>

      {/* Quick Stats - Role-based */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1.5rem",
        marginBottom: "3rem",
        padding: '0 2rem'
      }}>
        {(user.role === 'PATIENT' ? [
          { label: "My Appointments", value: stats.todaysAppointments, color: "#4ecdc4", icon: "📅", bg: "rgba(78, 205, 196, 0.1)" },
          { label: "Pending Bills", value: stats.pendingBills, color: "#45b7d1", icon: "💰", bg: "rgba(69, 183, 209, 0.1)" },
          { label: "Medical Records", value: 0, color: "#ff6b6b", icon: "📋", bg: "rgba(255, 107, 107, 0.1)" },
          { label: "Prescriptions", value: 0, color: "#96ceb4", icon: "💊", bg: "rgba(150, 206, 180, 0.1)" }
        ] : [
          { label: "Total Patients", value: stats.totalPatients, color: "#ff6b6b", icon: "👥", bg: "rgba(255, 107, 107, 0.1)" },
          { label: "Today's Appointments", value: stats.todaysAppointments, color: "#4ecdc4", icon: "📅", bg: "rgba(78, 205, 196, 0.1)" },
          { label: "Pending Bills", value: stats.pendingBills, color: "#45b7d1", icon: "💰", bg: "rgba(69, 183, 209, 0.1)" },
          { label: "Active Doctors", value: stats.activeDoctors, color: "#96ceb4", icon: "👨‍⚕️", bg: "rgba(150, 206, 180, 0.1)" }
        ]).map((stat, index) => (
          <div key={index} style={{
            background: 'rgba(255,255,255,0.95)',
            padding: "1.5rem",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
          }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{
                  color: "#64748b",
                  fontSize: "0.85rem",
                  margin: "0 0 0.5rem 0",
                  fontWeight: "500"
                }}>{stat.label}</p>
                <p style={{
                  color: stat.color,
                  fontSize: "2rem",
                  fontWeight: "800",
                  margin: 0,
                  background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}dd 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>{stat.value}</p>
              </div>
              <div style={{
                fontSize: "2.5rem",
                background: stat.bg,
                padding: "0.75rem",
                borderRadius: "12px",
                boxShadow: `0 4px 20px ${stat.color}33`
              }}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* HMS Modules - Only for Staff/Admin, not Patients */}
      {user.role !== 'PATIENT' && (
      <div style={{
        marginBottom: "3rem",
        padding: '0 2rem'
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem"
        }}>
          <h2 style={{
            color: "#1e293b",
            fontSize: "1.5rem",
            fontWeight: "700",
            margin: 0,
            background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #45b7d1 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            HMS Modules ({modules.filter(m => m.active).length}/{modules.length} Active)
          </h2>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: 'rgba(78, 205, 196, 0.1)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: '1px solid rgba(78, 205, 196, 0.2)'
            }}>
              <div style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#4ecdc4"
              }} />
              <span style={{ fontSize: "0.9rem", color: "#059669", fontWeight: "500" }}>Active</span>
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: 'rgba(156, 163, 175, 0.1)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: '1px solid rgba(156, 163, 175, 0.2)'
            }}>
              <div style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#9ca3af"
              }} />
              <span style={{ fontSize: "0.9rem", color: "#6b7280", fontWeight: "500" }}>Coming Soon</span>
            </div>
          </div>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "2rem"
        }}>
          {modules.map((module, index) => (
            <Link
              key={index}
              href={module.active ? module.href : "#"}
              style={{ textDecoration: "none", pointerEvents: module.active ? "auto" : "none" }}
            >
              <div style={{
                background: module.active ? 'rgba(255,255,255,0.95)' : 'rgba(249, 250, 251, 0.9)',
                padding: "1.5rem",
                borderRadius: "16px",
                boxShadow: module.active ? "0 8px 32px rgba(0,0,0,0.1)" : "0 4px 16px rgba(0,0,0,0.05)",
                border: module.active ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(229, 231, 235, 0.8)",
                transition: "all 0.3s ease",
                cursor: module.active ? "pointer" : "not-allowed",
                opacity: module.active ? 1 : 0.6,
                position: "relative",
                backdropFilter: 'blur(10px)',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (module.active) {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.15)";
                }
              }}
              onMouseLeave={(e) => {
                if (module.active) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)";
                }
              }}
              >
                {/* Active Indicator Badge */}
                <div style={{
                  position: "absolute",
                  top: "1.5rem",
                  right: "1.5rem",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: module.active ? "#4ecdc4" : "#9ca3af",
                  border: '2px solid white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }} />

                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  width: '4px',
                  height: '100%',
                  background: module.active ? `linear-gradient(135deg, ${module.color} 0%, ${module.color}dd 100%)` : '#e5e7eb',
                  borderRadius: '2px'
                }} />

                <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem", marginLeft: '1rem' }}>
                  <div style={{
                    fontSize: "2.5rem",
                    background: module.active ? `${module.color}15` : '#f3f4f6',
                    padding: "0.75rem",
                    borderRadius: "12px",
                    transition: 'all 0.3s ease',
                    boxShadow: module.active ? `0 4px 20px ${module.color}25` : '0 2px 8px rgba(0,0,0,0.05)'
                  }}>
                    {module.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      color: module.active ? "#1f2937" : "#6b7280",
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      margin: "0 0 0.75rem 0",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}>
                      {module.title}
                    </h3>
                    <p style={{
                      color: "#6b7280",
                      fontSize: "0.9rem",
                      margin: "0 0 1.5rem 0",
                      lineHeight: "1.5"
                    }}>
                      {module.description}
                    </p>
                    <div style={{
                      color: module.active ? module.color : "#9ca3af",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      background: module.active ? `${module.color}15` : "#f3f4f6",
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      display: "inline-block",
                      border: module.active ? `1px solid ${module.color}25` : '1px solid #e5e7eb'
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
      )}

      {/* Patient Quick Actions - Only for Patients */}
      {user.role === 'PATIENT' && (
        <div style={{
          marginBottom: "3rem",
          padding: '0 2rem'
        }}>
          <h2 style={{
            color: "#1e293b",
            fontSize: "1.5rem",
            fontWeight: "700",
            marginBottom: "2rem",
            background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #45b7d1 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Quick Actions
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem"
          }}>
            {[
              { title: "My Health Records", desc: "View your complete medical history", href: "/dashboard/my-records", icon: "📋", color: "#ff6b6b" },
              { title: "My Appointments", desc: "Manage your upcoming appointments", href: "/dashboard/my-appointments", icon: "📅", color: "#4ecdc4" },
              { title: "My Bills", desc: "View and pay your medical bills", href: "/dashboard/my-bills", icon: "💰", color: "#45b7d1" },
              { title: "Book Appointment", desc: "Schedule a new appointment", href: "/dashboard/appointments", icon: "🗓️", color: "#96ceb4" },
            ].map((action, index) => (
              <Link key={index} href={action.href} style={{ textDecoration: "none" }}>
                <div style={{
                  background: 'rgba(255,255,255,0.95)',
                  padding: "1.5rem",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  backdropFilter: 'blur(10px)',
                  minHeight: '140px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)";
                }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                    <div style={{
                      fontSize: "2rem",
                      background: `${action.color}15`,
                      padding: "0.75rem",
                      borderRadius: "12px",
                      boxShadow: `0 4px 20px ${action.color}25`
                    }}>
                      {action.icon}
                    </div>
                    <h3 style={{
                      color: "#1f2937",
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      margin: 0
                    }}>
                      {action.title}
                    </h3>
                  </div>
                  <p style={{
                    color: "#6b7280",
                    fontSize: "0.9rem",
                    margin: 0,
                    lineHeight: "1.5"
                  }}>
                    {action.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        textAlign: "center",
        padding: "2rem 2rem",
        color: "#64748b",
        fontSize: "0.9rem",
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        margin: '0 2rem',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}>
        <p style={{ margin: 0, fontWeight: '500' }}>🏥 HMS SAAS - Complete Hospital Management System</p>
        <p style={{ margin: '0.5rem 0 0 0', opacity: 0.8 }}>Built with ❤️ for modern healthcare facilities</p>
      </div>
    </div>
  );
}