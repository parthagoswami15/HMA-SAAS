import Link from "next/link";

export default function Demo() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
      {/* Navigation */}
      <nav style={{ 
        padding: "1rem 2rem", 
        background: "rgba(255, 255, 255, 0.1)", 
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1200px", margin: "0 auto" }}>
          <Link href="/" style={{ fontSize: "1.5rem", fontWeight: "bold", color: "white", textDecoration: "none" }}>
            HMS SAAS
          </Link>
          <Link href="/" style={{ 
            color: "white", 
            textDecoration: "none", 
            padding: "0.5rem 1rem",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "5px"
          }}>← Back to Home</Link>
        </div>
      </nav>

      {/* Demo Content */}
      <div style={{ padding: "3rem 2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ 
            fontSize: "3rem", 
            fontWeight: "bold", 
            marginBottom: "1rem", 
            color: "white",
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
          }}>
            HMS SAAS Demo
          </h1>
          <p style={{ 
            fontSize: "1.2rem", 
            color: "rgba(255, 255, 255, 0.9)",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            Explore the powerful features of our Hospital Management System
          </p>
        </div>

        {/* Demo Features Grid */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "2rem",
          marginBottom: "3rem"
        }}>
          {/* Dashboard Demo */}
          <div style={{ 
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "15px",
            padding: "2rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
          }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#374151" }}>Dashboard Overview</h3>
            <div style={{ 
              background: "#f8fafc",
              padding: "1.5rem",
              borderRadius: "8px",
              border: "1px solid #e2e8f0"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div>
                  <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#667eea" }}>1,234</div>
                  <div style={{ color: "#64748b" }}>Total Patients</div>
                </div>
                <div>
                  <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#10b981" }}>56</div>
                  <div style={{ color: "#64748b" }}>Active Staff</div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#f59e0b" }}>89</div>
                  <div style={{ color: "#64748b" }}>Today's Appointments</div>
                </div>
                <div>
                  <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#ef4444" }}>12</div>
                  <div style={{ color: "#64748b" }}>Emergency Cases</div>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Management Demo */}
          <div style={{ 
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "15px",
            padding: "2rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
          }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#374151" }}>Patient Management</h3>
            <div style={{ space: "1rem" }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                padding: "1rem",
                background: "#f8fafc",
                borderRadius: "8px",
                marginBottom: "0.5rem",
                border: "1px solid #e2e8f0"
              }}>
                <div>
                  <div style={{ fontWeight: "500", color: "#374151" }}>John Smith</div>
                  <div style={{ fontSize: "0.9rem", color: "#64748b" }}>ID: P001 • Age: 45</div>
                </div>
                <div style={{ 
                  padding: "0.25rem 0.75rem",
                  background: "#dcfce7",
                  color: "#166534",
                  borderRadius: "20px",
                  fontSize: "0.8rem",
                  fontWeight: "500"
                }}>
                  Active
                </div>
              </div>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                padding: "1rem",
                background: "#f8fafc",
                borderRadius: "8px",
                marginBottom: "0.5rem",
                border: "1px solid #e2e8f0"
              }}>
                <div>
                  <div style={{ fontWeight: "500", color: "#374151" }}>Sarah Johnson</div>
                  <div style={{ fontSize: "0.9rem", color: "#64748b" }}>ID: P002 • Age: 32</div>
                </div>
                <div style={{ 
                  padding: "0.25rem 0.75rem",
                  background: "#fef3c7",
                  color: "#92400e",
                  borderRadius: "20px",
                  fontSize: "0.8rem",
                  fontWeight: "500"
                }}>
                  Pending
                </div>
              </div>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                padding: "1rem",
                background: "#f8fafc",
                borderRadius: "8px",
                border: "1px solid #e2e8f0"
              }}>
                <div>
                  <div style={{ fontWeight: "500", color: "#374151" }}>Mike Davis</div>
                  <div style={{ fontSize: "0.9rem", color: "#64748b" }}>ID: P003 • Age: 28</div>
                </div>
                <div style={{ 
                  padding: "0.25rem 0.75rem",
                  background: "#fee2e2",
                  color: "#991b1b",
                  borderRadius: "20px",
                  fontSize: "0.8rem",
                  fontWeight: "500"
                }}>
                  Critical
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Scheduling Demo */}
          <div style={{ 
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "15px",
            padding: "2rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
          }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#374151" }}>Appointment Scheduling</h3>
            <div style={{ 
              background: "#f8fafc",
              padding: "1.5rem",
              borderRadius: "8px",
              border: "1px solid #e2e8f0"
            }}>
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontWeight: "600", color: "#374151", marginBottom: "0.5rem" }}>Today's Schedule</div>
                <div style={{ fontSize: "0.9rem", color: "#64748b" }}>December 5, 2024</div>
              </div>
              <div style={{ space: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ color: "#374151" }}>09:00 AM - Dr. Williams</span>
                  <span style={{ fontSize: "0.9rem", color: "#64748b" }}>Cardiology</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ color: "#374151" }}>10:30 AM - Dr. Chen</span>
                  <span style={{ fontSize: "0.9rem", color: "#64748b" }}>Pediatrics</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ color: "#374151" }}>02:15 PM - Dr. Rodriguez</span>
                  <span style={{ fontSize: "0.9rem", color: "#64748b" }}>Orthopedics</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#374151" }}>04:00 PM - Dr. Kumar</span>
                  <span style={{ fontSize: "0.9rem", color: "#64748b" }}>Neurology</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reports & Analytics Demo */}
          <div style={{ 
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "15px",
            padding: "2rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
          }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#374151" }}>Reports & Analytics</h3>
            <div style={{ 
              background: "#f8fafc",
              padding: "1.5rem",
              borderRadius: "8px",
              border: "1px solid #e2e8f0"
            }}>
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ color: "#374151" }}>Patient Satisfaction</span>
                  <span style={{ fontWeight: "600", color: "#10b981" }}>94%</span>
                </div>
                <div style={{ 
                  width: "100%", 
                  height: "6px", 
                  background: "#e2e8f0", 
                  borderRadius: "3px",
                  overflow: "hidden"
                }}>
                  <div style={{ 
                    width: "94%", 
                    height: "100%", 
                    background: "#10b981",
                    borderRadius: "3px"
                  }}></div>
                </div>
              </div>
              
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ color: "#374151" }}>Bed Occupancy</span>
                  <span style={{ fontWeight: "600", color: "#f59e0b" }}>78%</span>
                </div>
                <div style={{ 
                  width: "100%", 
                  height: "6px", 
                  background: "#e2e8f0", 
                  borderRadius: "3px",
                  overflow: "hidden"
                }}>
                  <div style={{ 
                    width: "78%", 
                    height: "100%", 
                    background: "#f59e0b",
                    borderRadius: "3px"
                  }}></div>
                </div>
              </div>
              
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ color: "#374151" }}>Staff Utilization</span>
                  <span style={{ fontWeight: "600", color: "#667eea" }}>85%</span>
                </div>
                <div style={{ 
                  width: "100%", 
                  height: "6px", 
                  background: "#e2e8f0", 
                  borderRadius: "3px",
                  overflow: "hidden"
                }}>
                  <div style={{ 
                    width: "85%", 
                    height: "100%", 
                    background: "#667eea",
                    borderRadius: "3px"
                  }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div style={{ 
          textAlign: "center", 
          background: "rgba(255, 255, 255, 0.1)",
          padding: "3rem",
          borderRadius: "15px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)"
        }}>
          <h2 style={{ 
            fontSize: "2rem", 
            fontWeight: "bold", 
            marginBottom: "1rem", 
            color: "white" 
          }}>
            Ready to Get Started?
          </h2>
          <p style={{ 
            fontSize: "1.1rem", 
            marginBottom: "2rem", 
            color: "rgba(255, 255, 255, 0.9)",
            maxWidth: "500px",
            margin: "0 auto 2rem auto"
          }}>
            Join thousands of healthcare professionals who trust HMS SAAS for their hospital management needs.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/signup" style={{ 
              background: "white",
              color: "#667eea",
              padding: "1rem 2rem",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "1.1rem",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
            }}>Start Free Trial</Link>
            
            <Link href="/login" style={{ 
              background: "transparent",
              color: "white",
              padding: "1rem 2rem",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "1.1rem",
              border: "2px solid rgba(255, 255, 255, 0.3)"
            }}>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}