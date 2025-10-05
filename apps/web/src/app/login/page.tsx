import Link from "next/link";

export default function Login() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        background: "rgba(255, 255, 255, 0.95)",
        padding: "3rem",
        borderRadius: "15px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        width: "100%",
        maxWidth: "400px",
        backdropFilter: "blur(10px)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" style={{ textDecoration: "none", color: "#667eea", fontSize: "1.5rem", fontWeight: "bold" }}>
            HMS SAAS
          </Link>
          <h2 style={{ marginTop: "1rem", fontSize: "1.8rem", fontWeight: "600", color: "#374151" }}>
            Sign In
          </h2>
          <p style={{ marginTop: "0.5rem", color: "#6B7280" }}>
            Access your hospital management dashboard
          </p>
        </div>

        <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#374151" }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
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
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
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

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.9rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#374151" }}>
              <input type="checkbox" />
              Remember me
            </label>
            <Link href="/forgot-password" style={{ color: "#667eea", textDecoration: "none" }}>
              Forgot password?
            </Link>
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
            Sign In
          </button>
        </form>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <p style={{ color: "#6B7280" }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" style={{ color: "#667eea", textDecoration: "none", fontWeight: "500" }}>
              Sign up
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