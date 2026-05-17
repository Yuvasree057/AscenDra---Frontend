import { API_BASE_URL } from '../../config';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, Lock, ArrowRight } from 'lucide-react';
import './Auth.css';

import { useAppContext } from '../../context/AppContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAppContext();
  const [method, setMethod] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [recoverySent, setRecoverySent] = useState(false);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Login failed');
      
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container flex-center">
      <Link to="/" className="back-link">← Back to home</Link>
      <div className="auth-card glass-panel animate-fade-in">
        <div className="auth-header text-center">
          <h2 className="h2" style={{ marginBottom: '8px' }}>Welcome Back</h2>
          <p className="p-medium">Sign in to continue your journey</p>
        </div>

        <div className="auth-toggle flex-center">
          <button 
            className={`toggle-btn ${method === 'email' ? 'active' : ''}`}
            onClick={() => setMethod('email')}
          >
            <Mail size={16} /> Email
          </button>
          <button 
            className={`toggle-btn ${method === 'mobile' ? 'active' : ''}`}
            onClick={() => setMethod('mobile')}
          >
            <Phone size={16} /> Mobile
          </button>
        </div>

          {isForgotPassword ? (
            <div className="auth-form" style={{ marginTop: '24px' }}>
              {!recoverySent ? (
                <>
                  <p className="p-medium" style={{ marginBottom: '16px', textAlign: 'center' }}>Enter your email address to receive a password reset link.</p>
                  <div className="form-group">
                    <label className="label">Email Address</label>
                    <div className="input-wrapper">
                      <Mail className="input-icon" size={20} />
                      <input type="email" className="input-field with-icon" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                  </div>
                  <button onClick={() => { setIsLoading(true); setTimeout(() => { setIsLoading(false); setRecoverySent(true); }, 1500); }} disabled={isLoading || !email} className="btn-primary w-100" style={{ marginTop: '24px', width: '100%' }}>
                    {isLoading ? 'Sending...' : 'Send Recovery Link'}
                  </button>
                  <button onClick={() => setIsForgotPassword(false)} className="btn-secondary w-100" style={{ marginTop: '12px', width: '100%', border: 'none', background: 'transparent' }}>Cancel</button>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ color: '#10B981', marginBottom: '16px' }}>
                    <Mail size={48} style={{ margin: '0 auto' }} />
                  </div>
                  <h3 className="h3">Recovery Email Sent!</h3>
                  <p className="p-medium text-muted" style={{ margin: '12px 0 24px 0' }}>Check your inbox (and spam folder) for a link to reset your password.</p>
                  <button onClick={() => { setIsForgotPassword(false); setRecoverySent(false); }} className="btn-primary w-100" style={{ width: '100%' }}>Back to Login</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <form onSubmit={handleLogin} className="auth-form">
                {error && <div style={{ color: '#EF4444', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}
                
                {method === 'email' ? (
                  <div className="form-group">
                    <label className="label">Email Address</label>
                    <div className="input-wrapper">
                      <Mail className="input-icon" size={20} />
                      <input type="email" className="input-field with-icon" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                  </div>
                ) : (
                  <div className="form-group">
                    <label className="label">Mobile Number</label>
                    <div className="input-wrapper">
                      <Phone className="input-icon" size={20} />
                      <input type="tel" className="input-field with-icon" placeholder="+1 (555) 000-0000" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <div className="flex-between" style={{ marginBottom: '8px' }}>
                    <label className="label" style={{ margin: 0 }}>Password</label>
                    <span onClick={() => setIsForgotPassword(true)} className="p-small text-gradient" style={{ cursor: 'pointer' }}>Forgot password?</span>
                  </div>
                  <div className="input-wrapper">
                    <Lock className="input-icon" size={20} />
                    <input type="password" className="input-field with-icon" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                </div>

                <button type="submit" disabled={isLoading} className="btn-primary w-100" style={{ marginTop: '24px', width: '100%', opacity: isLoading ? 0.7 : 1 }}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                  {!isLoading && <ArrowRight size={20} />}
                </button>
              </form>

              <p className="auth-footer text-center p-small" style={{ marginTop: '24px' }}>
                Don't have an account? <Link to="/register" className="text-gradient" style={{ fontWeight: 600 }}>Create one</Link>
              </p>
            </>
          )}
        </div>
      </div>
  );
}


