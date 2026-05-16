import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Briefcase, Lock, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Internships() {
  const { profile } = useAppContext();
  
  if (!profile) return <div className="flex-center" style={{ height: '100vh', background: 'var(--bg-navy)' }}><div className="pulsing-circle"></div></div>;

  const internships = profile.analysis_data?.internships || [];
  const isPremium = false; // Guard behind premium

  return (
    <div className="container" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
      <Link to="/dashboard" className="back-link" style={{ display: 'inline-flex', marginBottom: '24px' }}>
        <ArrowLeft size={18} style={{ marginRight: '8px' }} /> Back to Dashboard
      </Link>
      
      <header className="glass-panel flex-between" style={{ padding: '40px', marginBottom: '24px' }}>
        <div>
          <h1 className="h2 flex-center" style={{ gap: '12px', justifyContent: 'flex-start' }}><Briefcase color="var(--accent-blue)"/> Recommended Internships</h1>
          <p className="p-medium" style={{ marginTop: '8px' }}>Internships matching your current skill level and education.</p>
        </div>
        {!isPremium && <span className="badge flex-center" style={{ gap: '6px', background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' }}><Lock size={14}/> Premium Feature</span>}
      </header>

      {!isPremium ? (
        <div className="glass-panel text-center" style={{ padding: '60px 20px' }}>
          <Lock size={48} color="var(--text-muted)" style={{ margin: '0 auto 24px' }} />
          <h2 className="h2" style={{ marginBottom: '16px' }}>Unlock Internship Matching</h2>
          <p className="p-medium text-muted" style={{ maxWidth: '500px', margin: '0 auto 32px' }}>
            Upgrade to Premium to access hand-picked internship opportunities that perfectly align with your current skills and career roadmap.
          </p>
          <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}>
            <Sparkles size={18}/> Upgrade Now
          </button>
        </div>
      ) : (
        <div className="grid">
          {internships.length > 0 ? internships.map((intern, idx) => (
            <div key={idx} className="glass-panel section-card" style={{ padding: '24px' }}>
              <div className="flex-between" style={{ marginBottom: '16px' }}>
                <h3 className="h3">{intern.role} Intern</h3>
                <span className="badge badge-match">{intern.match_percentage}% Match</span>
              </div>
              <p className="p-medium" style={{ color: 'var(--accent-purple)', marginBottom: '16px' }}>Actual live offers in Premium 🔒</p>
              <div className="skills-container" style={{ marginBottom: '24px' }}>
                {intern.required_skills?.slice(0,3).map(skill => (
                  <span key={skill} className="skill-chip">{skill}</span>
                ))}
              </div>
              <button className="btn-secondary w-100" style={{ width: '100%' }}>Apply Now</button>
            </div>
          )) : (
             <p className="p-medium text-muted">No internships found for your exact profile. Update your skills to discover more.</p>
          )}
        </div>
      )}
    </div>
  );
}
