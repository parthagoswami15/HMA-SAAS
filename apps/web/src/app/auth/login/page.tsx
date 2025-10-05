'use client';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import React, { useState } from 'react';

interface LoginForm {
  email: string;
  password: string;
  hospitalId?: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  hospitalId?: string;
  general?: string;
}

const LoginPage = () => {
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
    hospitalId: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    // Hospital ID validation (optional but validated if provided)
    if (formData.hospitalId && formData.hospitalId.length < 3) {
      newErrors.hospitalId = 'Hospital ID must be at least 3 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock authentication logic
      if (formData.email === 'demo@hospital.com' && formData.password === 'demo123') {
        // Success - redirect to dashboard
        localStorage.setItem('authToken', 'mock-jwt-token');
        localStorage.setItem('userEmail', formData.email);
        if (formData.rememberMe) {
          localStorage.setItem('rememberLogin', 'true');
        }
        window.location.href = '/dashboard';
      } else {
        setErrors({ general: 'Invalid email or password. Try demo@hospital.com / demo123' });
      }
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'rememberMe' ? e.target.checked : e.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleForgotPassword = async (email: string) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate forgot password API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Password reset instructions sent to ${email}`);
      setShowForgotPassword(false);
    } catch (error) {
      setErrors({ general: 'Failed to send reset instructions. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <Card style={{ 
          width: '100%', 
          maxWidth: '400px',
          padding: '2rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '1rem' 
            }}>🔒</div>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              marginBottom: '0.5rem' 
            }}>
              Reset Password
            </h1>
            <p style={{ color: '#6b7280' }}>
              Enter your email to receive reset instructions
            </p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            handleForgotPassword(formData.email);
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <Input
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={errors.email}
                icon="📧"
                required
              />
            </div>

            {errors.general && (
              <div style={{
                padding: '0.75rem',
                backgroundColor: '#fee2e2',
                borderRadius: '8px',
                marginBottom: '1rem',
                border: '1px solid #fecaca'
              }}>
                <p style={{ margin: 0, color: '#dc2626', fontSize: '0.875rem' }}>
                  {errors.general}
                </p>
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              style={{ marginBottom: '1rem' }}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Instructions'}
            </Button>

            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#667eea',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '0.875rem'
                }}
              >
                ← Back to Login
              </button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <Card style={{ 
        width: '100%', 
        maxWidth: '450px',
        padding: '2rem'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            fontSize: '3rem', 
            marginBottom: '1rem' 
          }}>🏥</div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '0.5rem' 
          }}>
            HMS Login
          </h1>
          <p style={{ color: '#6b7280' }}>
            Hospital Management System
          </p>
        </div>

        {/* Demo Credentials Info */}
        <div style={{
          padding: '1rem',
          backgroundColor: '#f0f9ff',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          border: '1px solid #bae6fd'
        }}>
          <p style={{ margin: '0 0 0.5rem 0', color: '#0369a1', fontSize: '0.875rem', fontWeight: '600' }}>
            🔍 Demo Credentials:
          </p>
          <p style={{ margin: '0', color: '#0369a1', fontSize: '0.875rem' }}>
            Email: <strong>demo@hospital.com</strong><br />
            Password: <strong>demo123</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <Input
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={errors.email}
              icon="📧"
              required
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange('password')}
              error={errors.password}
              icon="🔒"
              required
            />
          </div>

          {/* Hospital ID Field (Optional) */}
          <div style={{ marginBottom: '1.5rem' }}>
            <Input
              type="text"
              label="Hospital ID (Optional)"
              placeholder="Enter hospital identifier"
              value={formData.hospitalId}
              onChange={handleInputChange('hospitalId')}
              error={errors.hospitalId}
              icon="🏥"
            />
            <p style={{ 
              margin: '0.25rem 0 0 0', 
              fontSize: '0.75rem', 
              color: '#6b7280' 
            }}>
              Leave blank for single-tenant installations
            </p>
          </div>

          {/* Remember Me */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: '1.5rem' 
          }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              fontSize: '0.875rem',
              color: '#374151'
            }}>
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleInputChange('rememberMe')}
                style={{ marginRight: '0.5rem' }}
              />
              Remember me
            </label>

            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#667eea',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '0.875rem'
              }}
            >
              Forgot Password?
            </button>
          </div>

          {/* General Error */}
          {errors.general && (
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#fee2e2',
              borderRadius: '8px',
              marginBottom: '1rem',
              border: '1px solid #fecaca'
            }}>
              <p style={{ margin: 0, color: '#dc2626', fontSize: '0.875rem' }}>
                {errors.general}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            style={{ marginBottom: '1rem' }}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>

          {/* Footer Links */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ 
              margin: '0 0 1rem 0', 
              fontSize: '0.875rem', 
              color: '#6b7280' 
            }}>
              Don't have an account?{' '}
              <a 
                href="/auth/register" 
                style={{ 
                  color: '#667eea', 
                  textDecoration: 'underline' 
                }}
              >
                Contact Administrator
              </a>
            </p>
            
            <div style={{ 
              borderTop: '1px solid #e5e7eb', 
              paddingTop: '1rem',
              marginTop: '1rem'
            }}>
              <p style={{ 
                margin: 0, 
                fontSize: '0.75rem', 
                color: '#9ca3af' 
              }}>
                © 2024 Hospital Management System. All rights reserved.
              </p>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;