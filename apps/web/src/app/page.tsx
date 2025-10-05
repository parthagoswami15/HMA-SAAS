import Link from "next/link";

export default function Home() {
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
          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "white" }}>
            HMS SAAS
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link href="/login" style={{ 
              color: "white", 
              textDecoration: "none", 
              padding: "0.5rem 1rem",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "5px",
              transition: "all 0.3s ease"
            }}>Login</Link>
            <Link href="/signup" style={{ 
              color: "#667eea", 
              textDecoration: "none", 
              padding: "0.5rem 1rem",
              backgroundColor: "white",
              borderRadius: "5px",
              fontWeight: "500",
              transition: "all 0.3s ease"
            }}>Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        minHeight: "80vh",
        padding: "2rem",
        textAlign: "center",
        color: "white"
      }}>
        <h1 style={{ 
          fontSize: "3.5rem", 
          fontWeight: "bold", 
          marginBottom: "1rem",
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
        }}>
          Hospital Management System
        </h1>
        <p style={{ 
          fontSize: "1.2rem", 
          marginBottom: "2rem", 
          maxWidth: "600px",
          lineHeight: "1.6",
          opacity: "0.9"
        }}>
          Streamline your healthcare operations with our comprehensive Hospital Management System. 
          Manage patients, appointments, staff, and resources efficiently.
        </p>
        
        {/* Feature Cards */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "2rem",
          maxWidth: "900px",
          marginTop: "3rem"
        }}>
          <div style={{ 
            background: "rgba(255, 255, 255, 0.1)",
            padding: "2rem",
            borderRadius: "10px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}>
            <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", fontWeight: "600" }}>Patient Management</h3>
            <p style={{ opacity: "0.8", lineHeight: "1.5" }}>Complete patient records, medical history, and appointment scheduling</p>
          </div>
          
          <div style={{ 
            background: "rgba(255, 255, 255, 0.1)",
            padding: "2rem",
            borderRadius: "10px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}>
            <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", fontWeight: "600" }}>Staff Management</h3>
            <p style={{ opacity: "0.8", lineHeight: "1.5" }}>Manage doctors, nurses, and administrative staff efficiently</p>
          </div>
          
          <div style={{ 
            background: "rgba(255, 255, 255, 0.1)",
            padding: "2rem",
            borderRadius: "10px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}>
            <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", fontWeight: "600" }}>Analytics & Reports</h3>
            <p style={{ opacity: "0.8", lineHeight: "1.5" }}>Comprehensive reporting and analytics for better decision making</p>
          </div>
        </div>
        
        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: "1rem", marginTop: "3rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/signup" style={{ 
            background: "white",
            color: "#667eea",
            padding: "1rem 2rem",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "1.1rem",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
          }}>Get Started</Link>
          
          <Link href="/dashboard" style={{ 
            background: "transparent",
            color: "white",
            padding: "1rem 2rem",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "1.1rem",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            transition: "all 0.3s ease"
          }}>View Dashboard</Link>
        </div>
      </div>
      
      {/* Footer */}
      <footer style={{ 
        background: "rgba(0, 0, 0, 0.2)",
        padding: "2rem",
        textAlign: "center",
        color: "rgba(255, 255, 255, 0.7)",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)"
      }}>
        <p>&copy; 2024 HMS SAAS. All rights reserved.</p>
      </footer>
    </div>
  );
}
