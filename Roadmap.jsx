import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Target, CheckCircle, Circle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Roadmap() {
  const { profile } = useAppContext();
  
  if (!profile) return <div className="flex-center" style={{ height: '100vh', background: 'var(--bg-navy)' }}><div className="pulsing-circle"></div></div>;

  const roadmap = profile.analysis_data?.roadmap || [];

  return (
    <div className="container" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
      <Link to="/dashboard" className="back-link" style={{ display: 'inline-flex', marginBottom: '24px' }}>
        <ArrowLeft size={18} style={{ marginRight: '8px' }} /> Back to Dashboard
      </Link>
      
      <header className="glass-panel flex-between" style={{ padding: '40px', marginBottom: '24px' }}>
        <div>
          <h1 className="h2 flex-center" style={{ gap: '12px', justifyContent: 'flex-start' }}><Target color="var(--accent-purple)"/> Your Learning Roadmap</h1>
          <p className="p-medium" style={{ marginTop: '8px' }}>Based on your skills and target career matches.</p>
        </div>
      </header>

      <div className="roadmap-sections" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {profile.analysis_data?.career_matches?.length > 0 ? (
          profile.analysis_data.career_matches.map((role, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '32px' }}>
              <div className="flex-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', marginBottom: '24px' }}>
                <h2 className="h2 text-gradient">{role.career_path} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>({role.match_percentage}% Match)</span></h2>
              </div>

              {Object.entries(role.categorized_skills || {}).map(([category, skills], i) => (
                <div key={i} style={{ marginBottom: '24px' }}>
                  <h4 className="p-small text-muted" style={{ textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Section {i+1}: {category}</h4>
                  <div className="skills-container">
                    {skills.map(skill => {
                      const hasSkill = (profile.analysis_data?.skills || []).map(s=>s.toLowerCase()).includes(skill.toLowerCase());
                      return (
                        <span key={skill} className={`skill-chip ${hasSkill ? 'has-skill' : ''}`} style={{ background: hasSkill ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)', border: hasSkill ? '1px solid #10B981' : '1px solid rgba(255,255,255,0.1)', textTransform: 'capitalize' }}>
                          {hasSkill && <CheckCircle size={12} style={{ marginRight: '4px', color: '#10B981' }}/>} {skill}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div style={{ marginBottom: '24px' }}>
                <h4 className="p-small" style={{ color: '#F43F5E', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Section {Object.keys(role.categorized_skills || {}).length + 1}: Missing Skills</h4>
                <div className="skills-container">
                  {role.missing_skills.length > 0 ? role.missing_skills.map(skill => (
                    <span key={skill} className="skill-chip" style={{ border: '1px solid #F43F5E', background: 'rgba(244, 63, 94, 0.1)', textTransform: 'capitalize' }}>{skill}</span>
                  )) : <span className="p-small text-muted">You have all the core skills!</span>}
                </div>
              </div>

              <div className="learning-path-ordered">
                <h4 className="p-small text-accent-blue" style={{ textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Section {Object.keys(role.categorized_skills || {}).length + 2}: Learning Path (Ordered)</h4>
                <div className="roadmap-timeline" style={{ marginLeft: '12px' }}>
                  {role.learning_path?.map((step, i) => (
                    <div key={i} className="flex-center" style={{ justifyContent: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                      <div className="step-number flex-center" style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent-blue)', color: '#000', fontSize: '12px', fontWeight: 'bold' }}>
                        {i+1}
                      </div>
                      <h4 className="p-medium text-white">{step}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-panel" style={{ padding: '40px' }}>
            <p className="p-medium text-muted">No roadmap generated yet. Please update your profile skills.</p>
          </div>
        )}
      </div>
    </div>
  );
}
