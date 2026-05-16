import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Lock, Sparkles, PlayCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Learning() {
  const { profile } = useAppContext();
  
  if (!profile) return <div className="flex-center" style={{ height: '100vh', background: 'var(--bg-navy)' }}><div className="pulsing-circle"></div></div>;

  const matches = profile.analysis_data?.career_matches || [];
  const topMatch = matches[0];
  const isPremium = false; // Guard behind premium

  return (
    <div className="container" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
      <Link to="/dashboard" className="back-link" style={{ display: 'inline-flex', marginBottom: '24px' }}>
        <ArrowLeft size={18} style={{ marginRight: '8px' }} /> Back to Dashboard
      </Link>
      
      <header className="glass-panel flex-between" style={{ padding: '40px', marginBottom: '24px' }}>
        <div>
          <h1 className="h2 flex-center" style={{ gap: '12px', justifyContent: 'flex-start' }}><BookOpen color="var(--accent-purple)"/> Deep Learning Paths</h1>
          <p className="p-medium" style={{ marginTop: '8px' }}>Curated courses and resources to bridge your skill gaps.</p>
        </div>
        {!isPremium && <span className="badge flex-center" style={{ gap: '6px', background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' }}><Lock size={14}/> Premium Feature</span>}
      </header>

      {!isPremium ? (
        <div className="glass-panel text-center" style={{ padding: '60px 20px' }}>
          <Lock size={48} color="var(--text-muted)" style={{ margin: '0 auto 24px' }} />
          <h2 className="h2" style={{ marginBottom: '16px' }}>Unlock Deep Learning Plans</h2>
          <p className="p-medium text-muted" style={{ maxWidth: '500px', margin: '0 auto 32px' }}>
            Upgrade to Premium to access hand-picked courses from Coursera, Udemy, and edX mapped specifically to your missing skills for {topMatch?.career_path || "your target role"}.
          </p>
          <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}>
            <Sparkles size={18}/> Upgrade Now
          </button>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '40px' }}>
          {topMatch?.missing_skills?.length > 0 ? (
            <div>
               <h3 className="h3" style={{ marginBottom: '24px' }}>Recommended Courses for {topMatch.career_path}</h3>
               {topMatch.missing_skills.map((skill, idx) => (
                  <div key={idx} className="flex-between" style={{ background: 'var(--bg-navy)', padding: '24px', borderRadius: '12px', marginBottom: '16px' }}>
                     <div>
                        <h4 className="font-medium text-white" style={{ marginBottom: '8px' }}>Mastering {skill}</h4>
                        <p className="p-small text-muted">Recommended to improve your match score.</p>
                     </div>
                     <button className="btn-secondary flex-center" style={{ gap: '8px' }}><PlayCircle size={16}/> Start Course</button>
                  </div>
               ))}
            </div>
          ) : (
             <p className="p-medium text-muted">You have no missing skills for your top role! Keep building projects.</p>
          )}
        </div>
      )}
    </div>
  );
}
