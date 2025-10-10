'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function Login() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      // Store the access token
      if (result.accessToken) {
        localStorage.setItem('accessToken', result.accessToken);
        localStorage.setItem('user', JSON.stringify(result.user));
      }

      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof Error) {
        if (err.message.includes('fetch')) {
          setError('Unable to connect to server. Please check your internet connection and try again.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Show loading state during hydration
  if (!isClient) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          background: "rgba(255, 255, 255, 0.95)",
          padding: "3rem",
          borderRadius: "15px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          width: "100%",
          maxWidth: "400px",
          backdropFilter: "blur(10px)",
          textAlign: "center"
        }}>
          <div>Loading...</div>
        </div>
      </div>
    );
  }
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

        {error && (
          <div style={{
            background: "#fee2e2",
            color: "#dc2626",
            padding: "0.75rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            fontSize: "0.9rem"
          }}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={{
            background: "#dcfce7",
            color: "#16a34a",
            padding: "0.75rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            fontSize: "0.9rem"
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#374151" }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
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
              name="password"
              value={formData.password}
              onChange={handleInputChange}
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
              <input 
                type="checkbox" 
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
              />
              Remember me
            </label>
            <Link href="/forgot-password" style={{ color: "#667eea", textDecoration: "none" }}>
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              background: isLoading ? "#9CA3AF" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              padding: "0.875rem",
              borderRadius: "8px",
              border: "none",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              marginTop: "1rem",
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? "Signing In..." : "Sign In"}
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
            ΓåÉ Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
