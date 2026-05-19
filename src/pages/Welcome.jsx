import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Target, Compass, Flame, BarChart2, MessageSquare, Zap } from 'lucide-react';
import './Welcome.css'; 

export default function Welcome() {
  return (
    <div className="welcome-container">
      <div className="navbar flex-between container">
        <div className="logo text-gradient" style={{ fontSize: '40px', fontWeight: '900', letterSpacing: '1px', fontFamily: '"Inter", "SF Pro Display", sans-serif' }}>AscenDra</div>
        <div className="nav-links">
          <Link to="/login" className="nav-link p-medium" style={{ marginRight: '24px' }}>Sign In</Link>
          <Link to="/register" className="btn-primary">
            Join the Vibe
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <main className="hero container flex-center">
        <div className="hero-content animate-fade-in text-center">
          <div className="badge-wrapper" style={{ marginBottom: '24px' }}>
            <span className="badge glass-panel text-gradient flex-center interactive-hover" style={{ display: 'inline-flex', padding: '8px 16px', fontSize: '14px', gap: '8px', cursor: 'pointer' }}>
              <Sparkles size={16} color="var(--accent-purple)"/> AI Vibe Check for Your Career 🧠✨
            </span>
          </div>
          <h1 className="h1" style={{ marginBottom: '24px' }}>
            Level Up Your <br />
            <span className="text-gradient">Career Stats</span>
          </h1>
          <p className="p-large" style={{ maxWidth: '650px', margin: '0 auto 40px auto' }}>
            No cap, your career needs a strategy. AscenDra decodes your skills, tracks your daily grind, and builds a personalized roadmap to help you secure the bag in any field of study. 🚀
          </p>
          
          <div className="hero-actions flex-center" style={{ gap: '16px' }}>
            <Link to="/register" className="btn-primary glow-effect" style={{ padding: '16px 32px', fontSize: '1.125rem' }}>
              Start Your Journey
              <Zap size={20} />
            </Link>
            <Link to="/login" className="btn-secondary" style={{ padding: '16px 32px', fontSize: '1.125rem' }}>
              View Demo
            </Link>
          </div>

          {/* Interactive Metric Captions */}
          <div className="metrics-showcase flex-center" style={{ marginTop: '40px', gap: '16px', flexWrap: 'wrap' }}>
            <div className="metric-pill glass-panel flex-center">
              <Flame size={16} color="#ef4444" />
              <span>7-Day Learning Streak 🔥</span>
            </div>
            <div className="metric-pill glass-panel flex-center">
              <BarChart2 size={16} color="#3b82f6" />
              <span>Top 5% in Python 🐍</span>
            </div>
            <div className="metric-pill glass-panel flex-center">
              <MessageSquare size={16} color="#10b981" />
              <span>Networked with 12 Peers 💬</span>
            </div>
          </div>

          <div className="features-grid" style={{ display: 'flex', gap: '24px', marginTop: '80px', justifyContent: 'center' }}>
            <div className="feature-card glass-panel interactive-card" style={{ padding: '32px', textAlign: 'left', flex: 1, maxWidth: '300px' }}>
              <Compass size={32} color="var(--accent-blue)" style={{ marginBottom: '16px' }} />
              <h3 className="h3" style={{ marginBottom: '12px', fontSize: '1.25rem' }}>Stat-Based Matching</h3>
              <p className="p-medium">Stop applying blind. See how your current skills match up with real-world roles.</p>
            </div>
            <div className="feature-card glass-panel interactive-card" style={{ padding: '32px', textAlign: 'left', flex: 1, maxWidth: '300px' }}>
              <Target size={32} color="var(--accent-purple)" style={{ marginBottom: '16px' }} />
              <h3 className="h3" style={{ marginBottom: '12px', fontSize: '1.25rem' }}>Skill Trees & Quests</h3>
              <p className="p-medium">Unlock new nodes in your career tree. AI-generated quests to level up fast.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
