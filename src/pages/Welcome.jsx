import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Target, Compass } from 'lucide-react';
import './Welcome.css'; // Optional if we want specific styles, or we can use inline/global

export default function Welcome() {
  return (
    <div className="welcome-container">
      <div className="navbar flex-between container">
        <div className="logo text-gradient" style={{ fontSize: '40px', fontWeight: '900', letterSpacing: '1px', fontFamily: '"Inter", "SF Pro Display", sans-serif' }}>AscenDra</div>
        <div className="nav-links">
          <Link to="/login" className="nav-link p-medium" style={{ marginRight: '24px' }}>Sign In</Link>
          <Link to="/register" className="btn-primary">
            Get Started
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <main className="hero container flex-center">
        <div className="hero-content animate-fade-in text-center">
          <div className="badge-wrapper" style={{ marginBottom: '24px' }}>
            <span className="badge glass-panel text-gradient flex-center" style={{ display: 'inline-flex', padding: '8px 16px', fontSize: '14px', gap: '8px' }}>
              <Sparkles size={16} color="var(--accent-purple)"/> AI-Powered Career Operating System
            </span>
          </div>
          <h1 className="h1" style={{ marginBottom: '24px' }}>
            Discover Your True <br />
            <span className="text-gradient">Career Potential</span>
          </h1>
          <p className="p-large" style={{ maxWidth: '600px', margin: '0 auto 40px auto' }}>
            Stop guessing your next career move. AscenDra analyzes your skills, detects hidden opportunities, and generates a personalized growth roadmap.
          </p>
          
          <div className="hero-actions flex-center" style={{ gap: '16px' }}>
            <Link to="/register" className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.125rem' }}>
              Start Your Journey
              <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="btn-secondary" style={{ padding: '16px 32px', fontSize: '1.125rem' }}>
              View Demo
            </Link>
          </div>

          <div className="features-grid" style={{ display: 'flex', gap: '24px', marginTop: '80px', justifyContent: 'center' }}>
            <div className="feature-card glass-panel" style={{ padding: '32px', textAlign: 'left', flex: 1, maxWidth: '300px' }}>
              <Compass size={32} color="var(--accent-blue)" style={{ marginBottom: '16px' }} />
              <h3 className="h3" style={{ marginBottom: '12px', fontSize: '1.25rem' }}>Skill-Based Matching</h3>
              <p className="p-medium">Find careers that fit what you already know, not just job titles.</p>
            </div>
            <div className="feature-card glass-panel" style={{ padding: '32px', textAlign: 'left', flex: 1, maxWidth: '300px' }}>
              <Target size={32} color="var(--accent-purple)" style={{ marginBottom: '16px' }} />
              <h3 className="h3" style={{ marginBottom: '12px', fontSize: '1.25rem' }}>Smart Roadmaps</h3>
              <p className="p-medium">AI-generated study schedules to bridge your skill gaps fast.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
