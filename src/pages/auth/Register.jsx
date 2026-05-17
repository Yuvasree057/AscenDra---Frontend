import { API_BASE_URL } from '../../config';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, Lock, User, ArrowRight } from 'lucide-react';
import './Auth.css';

import { useAppContext } from '../../context/AppContext';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAppContext();
  const [method, setMethod] = useState('email'); // 'email' or 'mobile'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email, password, method })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Registration failed');
      
      login(data.token, data.user);
      navigate('/onboarding');
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        setError(`Network Error: Could not connect to ${API_BASE_URL}`);
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container flex-center">
      <Link to="/" className="back-link">← Back to home</Link>
      <div className="auth-card glass-panel animate-fade-in">
        <div className="auth-header text-center">
          <h2 className="h2" style={{ marginBottom: '8px' }}>Create Account</h2>
          <p className="p-medium">Start your career journey with AscenDra</p>
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

        <form onSubmit={handleRegister} className="auth-form">
          {error && <div style={{ color: '#EF4444', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

          <div className="form-group">
            <label className="label">Full Name</label>
            <div className="input-wrapper">
              <User className="input-icon" size={20} />
              <input 
                type="text" 
                className="input-field with-icon" 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>
          </div>

          {method === 'email' ? (
            <div className="form-group">
              <label className="label">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input 
                  type="email" 
                  className="input-field with-icon" 
                  placeholder="john@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>
          ) : (
            <div className="form-group">
              <label className="label">Mobile Number</label>
              <div className="input-wrapper">
                <Phone className="input-icon" size={20} />
                <input 
                  type="tel" 
                  className="input-field with-icon" 
                  placeholder="+1 (555) 000-0000" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="label">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input 
                type="password" 
                className="input-field with-icon" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary w-100" style={{ marginTop: '24px', width: '100%', opacity: isLoading ? 0.7 : 1 }}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
            {!isLoading && <ArrowRight size={20} />}
          </button>
        </form>

        <p className="auth-footer text-center p-small" style={{ marginTop: '24px' }}>
          Already have an account? <Link to="/login" className="text-gradient" style={{ fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
