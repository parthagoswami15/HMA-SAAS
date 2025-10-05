import Link from "next/link";

export default function Signup() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{
        background: "rgba(255, 255, 255, 0.95)",
        padding: "3rem",
        borderRadius: "15px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        width: "100%",
        maxWidth: "500px",
        backdropFilter: "blur(10px)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" style={{ textDecoration: "none", color: "#667eea", fontSize: "1.5rem", fontWeight: "bold" }}>
            HMS SAAS
          </Link>
          <h2 style={{ marginTop: "1rem", fontSize: "1.8rem", fontWeight: "600", color: "#374151" }}>
            Create Account
          </h2>
          <p style={{ marginTop: "0.5rem", color: "#6B7280" }}>
            Get started with your hospital management system
          </p>
        </div>

        <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#374151" }}>
                First Name
              </label>
              <input
                type="text"
                placeholder="John"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box"
                }}
                required
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#374151" }}>
                Last Name
              </label>
              <input
                type="text"
                placeholder="Doe"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box"
                }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#374151" }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="john.doe@hospital.com"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box"
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#374151" }}>
              Hospital Name
            </label>
            <input
              type="text"
              placeholder="City General Hospital"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box"
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#374151" }}>
              Role
            </label>
            <select
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
                background: "white"
              }}
              required
            >
              <option value="">Select your role</option>
              <option value="admin">Hospital Administrator</option>
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="receptionist">Receptionist</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#374151" }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Create a strong password"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box"
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#374151" }}>
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box"
              }}
              required
            />
          </div>

          <div style={{ fontSize: "0.9rem" }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", color: "#374151" }}>
              <input type="checkbox" style={{ marginTop: "0.1rem" }} required />
              <span>
                I agree to the{" "}
                <Link href="/terms" style={{ color: "#667eea", textDecoration: "none" }}>
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" style={{ color: "#667eea", textDecoration: "none" }}>
                  Privacy Policy
                </Link>
              </span>
            </label>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              padding: "0.875rem",
              borderRadius: "8px",
              border: "none",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              marginTop: "1rem"
            }}
          >
            Create Account
          </button>
        </form>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <p style={{ color: "#6B7280" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#667eea", textDecoration: "none", fontWeight: "500" }}>
              Sign in
            </Link>
          </p>
        </div>

        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <Link href="/" style={{ color: "#9CA3AF", textDecoration: "none", fontSize: "0.9rem" }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}