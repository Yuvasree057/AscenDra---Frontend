import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, User, Target, BookOpen, Briefcase, 
  Settings, LogOut, Flame, Sparkles, ChevronRight, ArrowUpRight, Plus, CheckCircle, MessageSquare, Globe, MapPin
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import SkillGraph from '../../components/SkillGraph';
import './Dashboard.css';

export default function Dashboard() {
  const { profile, user, logout } = useAppContext();
  const navigate = useNavigate();

  const [streak, setStreak] = useState(profile?.streak_days || 0);
  const [hasLoggedToday, setHasLoggedToday] = useState(false);

  const handleLogLearning = () => {
    if (!hasLoggedToday) {
      setStreak(prev => prev + 1);
      setHasLoggedToday(true);
    }
  };

  // If data is loading or missing
  if (!profile) return <div className="flex-center" style={{ height: '100vh', background: 'var(--bg-navy)' }}><div className="pulsing-circle"></div></div>;

  const analysis = profile.analysis_data;
  const userName = user?.name || profile.name || 'User';
  const isNewUser = !analysis || !analysis.career_matches || analysis.career_matches.length === 0;

  const rawMatches = analysis?.career_matches || [];
  const totalWeight = rawMatches.reduce((acc, _, idx) => acc + Math.pow(0.4, idx), 0);
  const matches = rawMatches.map((match, idx) => ({
    ...match,
    match_percentage: Math.round((Math.pow(0.4, idx) / totalWeight) * 100)
  }));
  const topMatch = matches[0] || null;

  const actionText = analysis?.recommended_action || "Complete React Hooks Module";
  const internships = analysis?.internships || [
    { role: "Frontend Intern", company: "TechNova", remote_or_onsite: "Remote", stipend: "Paid", match_percentage: 88 },
    { role: "React Developer Intern", company: "DataSphere", remote_or_onsite: "On-site", stipend: "Paid", match_percentage: 85 }
  ];
  const roadmap = analysis?.roadmap || [
    { step: "JavaScript Fundamentals", status: "completed" },
    { step: "React Hooks Mastery", status: "active" },
    { step: "Advanced State Management", status: "pending" }
  ];

  // --- Dynamic Skill Gap Analysis Data ---
  const userSkills = profile?.skills || [];
  const targetSkills = topMatch?.missing_skills || [];
  const defaultSkills = ["Problem Solving", "Communication", "Logic", "Teamwork"];
  
  // Create a combined list of skills relevant to the target role
  let graphSkills = [...new Set([...userSkills, ...targetSkills])];
  if (graphSkills.length < 5) graphSkills = [...new Set([...graphSkills, ...defaultSkills])].slice(0, 6);
  else graphSkills = graphSkills.slice(0, 6); // Keep it max 6 for a good radar shape
  
  const calculateLevels = (skillName) => {
    let current = 40; // Base baseline
    let target = 85; // Target required for a role
    
    // If it's a known missing skill for this role, target is very high, current is low
    if (targetSkills.includes(skillName)) {
      target = 95;
      current = 30; 
    }
    
    // If user has it, current goes up
    if (userSkills.includes(skillName)) {
      current += 40;
    }

    // Add streak bonus points to current (1.5 point per day, max 20)
    current += Math.min(streak * 1.5, 20);
    
    // If they are currently learning it, boost current closer to target
    const isLearning = roadmap.some(r => r.step.toLowerCase().includes(skillName.toLowerCase()) && r.status === 'active');
    if (isLearning) {
      current += 15;
    }

    // Adjust target based on realistic bounds
    if (current > target && !targetSkills.includes(skillName)) target = Math.min(current + 5, 100); 

    return {
      current: Math.min(Math.round(current), 100),
      target: Math.min(Math.round(target), 100)
    };
  };

  const dynamicGraphData = graphSkills.map(skill => {
    const levels = calculateLevels(skill);
    return {
      subject: skill.length > 15 ? skill.substring(0, 13) + '..' : skill,
      Current: levels.current,
      Target: levels.target,
      fullMark: 100
    };
  });

  // Calculate overall gap
  const totalCurrent = dynamicGraphData.reduce((acc, val) => acc + val.Current, 0);
  const totalTarget = dynamicGraphData.reduce((acc, val) => acc + val.Target, 0);
  const gapPercentage = Math.round(((totalTarget - totalCurrent) / totalTarget) * 100);
  
  const biggestGapSkill = [...dynamicGraphData].sort((a, b) => (b.Target - b.Current) - (a.Target - a.Current))[0];
  
  const dynamicAICommentary = gapPercentage <= 10 
    ? `You are almost a perfect fit for ${topMatch?.career_path || 'your target role'}! 🎯` 
    : `Your biggest gap is in ${biggestGapSkill?.subject || 'core skills'}. Focus your learning there to reach ${topMatch?.career_path || 'the next level'}!`;
  // --------------------------------------------

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar glass-panel">
        <div className="sidebar-header" style={{ paddingBottom: '0', paddingTop: '16px' }}>
          <div className="text-gradient" style={{ fontSize: '36px', fontWeight: '900', letterSpacing: '1px', fontFamily: '"Inter", "SF Pro Display", sans-serif' }}>AscenDra</div>
        </div>
        
        <div className="sidebar-profile flex-center" style={{ padding: '24px 20px', flexDirection: 'column', gap: '12px' }}>
          <div className="avatar-wrapper" style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg-card)', border: '2px solid var(--accent-purple)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {profile?.profile_picture ? (
              <img src={profile.profile_picture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={32} color="var(--text-muted)" />
            )}
          </div>
          <div className="text-center">
            <h4 className="font-medium text-white">{userName}</h4>
            <p className="p-small text-muted flex-center" style={{ gap: '4px', marginTop: '4px' }}>
              <MapPin size={12} /> {profile?.location || 'Add location in Profile'}
            </p>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-item active">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/profile" className="nav-item">
            <User size={20} /> Profile
          </Link>
          <Link to="/network" className="nav-item">
            <Globe size={20} /> Network
          </Link>
          <Link to="/messages" className="nav-item">
            <MessageSquare size={20} /> Messages
          </Link>
          <button onClick={() => window.dispatchEvent(new Event('open-milliena-chat'))} className="nav-item" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', color: 'var(--accent-purple)' }}>
            <Sparkles size={20} /> Milliena AI
          </button>
          <Link to="/roadmap" className="nav-item">
            <Target size={20} /> Roadmap
          </Link>
          <Link to="/internships" className="nav-item">
            <Briefcase size={20} /> Internships
          </Link>
          <Link to="/learning" className="nav-item">
            <BookOpen size={20} /> Learning
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="streak-card glass-panel" style={{ padding: '16px', marginBottom: '16px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
            <div className="flex-between">
              <span className="p-small text-white font-medium">Growth Streak</span>
              <Flame size={18} color={hasLoggedToday ? "#F59E0B" : "var(--text-muted)"} style={{ filter: hasLoggedToday ? 'drop-shadow(0 0 8px rgba(245,158,11,0.6))' : 'none', transition: 'all 0.3s ease' }} />
            </div>
            <div className="h2" style={{ color: '#F59E0B', marginTop: '8px' }}>{streak} Days</div>
            <button 
              onClick={handleLogLearning} 
              disabled={hasLoggedToday}
              className={`btn-primary flex-center`} 
              style={{ width: '100%', marginTop: '12px', padding: '8px', fontSize: '12px', background: hasLoggedToday ? 'var(--bg-card)' : 'var(--accent-purple)', opacity: hasLoggedToday ? 0.7 : 1, cursor: hasLoggedToday ? 'default' : 'pointer' }}
            >
              {hasLoggedToday ? <><CheckCircle size={14} style={{ marginRight: '6px' }} /> Logged Today</> : <><Plus size={14} style={{ marginRight: '6px' }} /> Log Today's Learning</>}
            </button>
          </div>
          <Link to="/settings" className="nav-item">
            <Settings size={20} /> Settings
          </Link>
          <button onClick={logout} className="nav-item text-muted" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        <header className="dashboard-header flex-between">
          <div>
            <h1 className="h2">Welcome, {userName}!</h1>
            <p className="p-medium">Here's your career intelligence for today.</p>
          </div>
          <button className="btn-primary" onClick={() => navigate('/profile')}>
            <Sparkles size={18} /> Update Profile
          </button>
        </header>

        {analysis?.top_rationale && (
          <div className="glass-panel stat-card" style={{ padding: '24px', marginBottom: '24px', borderLeft: '4px solid var(--accent-blue)' }}>
            <h3 className="h3 flex-center" style={{ justifyContent: 'flex-start', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={20} color="var(--accent-blue)" /> AI Mentor Insight
            </h3>
            <p className="p-medium" style={{ color: 'var(--text-white)' }}>{analysis.top_rationale}</p>
          </div>
        )}

        <div className="dashboard-grid">
          {/* Top Section: Match Summary & Next Action & Skill Graph */}
          <section className="top-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            
            {/* Skill Graph Added Here */}
            <SkillGraph 
              data={dynamicGraphData}
              aiCommentary={dynamicAICommentary}
              targetRole={topMatch?.career_path || 'Target Role'}
            />
            <div className="glass-panel stat-card" style={{ padding: '24px', flex: 1, maxHeight: '300px', overflowY: 'auto' }}>
              <div className="flex-between" style={{ marginBottom: '16px' }}>
                <h3 className="h3">Top Career Matches</h3>
              </div>
              {matches.length > 0 ? matches.map((match, idx) => (
                <div key={idx} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: idx !== matches.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                  <div className="flex-between" style={{ marginBottom: '8px' }}>
                    <h4 className="font-medium text-white">{match.career_path}</h4>
                    <span className="badge badge-match">{match.match_percentage}% Match</span>
                  </div>
                  <p className="p-small" style={{ marginBottom: '8px' }}>{match.rationale}</p>
                  {match.missing_skills?.length > 0 && (
                    <div className="skills-container" style={{ gap: '6px', marginTop: '8px' }}>
                      <span className="p-small text-muted" style={{ marginRight: '4px' }}>Missing:</span>
                      {match.missing_skills.slice(0, 3).map(ms => <span key={ms} className="skill-chip" style={{ padding: '2px 8px', fontSize: '10px' }}>{ms}</span>)}
                    </div>
                  )}
                </div>
              )) : (
                <p className="p-small text-muted">Update your skills in your profile to get matches.</p>
              )}
            </div>

            <div className="glass-panel stat-card action-card" style={{ padding: '24px', flex: 1, borderLeft: '4px solid var(--accent-purple)' }}>
              <span className="p-small text-gradient font-medium" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recommended Action</span>
              <h3 className="h3" style={{ margin: '8px 0', fontSize: '1.2rem' }}>{actionText || "Update Profile"}</h3>
              <p className="p-small" style={{ marginBottom: '16px' }}>Bridging this gap increases your match rate for relevant roles.</p>
              <button className="btn-secondary" onClick={() => navigate('/learning')} style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
                Start Learning <ChevronRight size={16} />
              </button>
            </div>
          </section>

          {/* Middle Section: Progress & Internships */}
          <section className="middle-section">
            <div className="glass-panel section-card">
              <div className="flex-between" style={{ marginBottom: '24px' }}>
                <h3 className="h3">Learning Roadmap</h3>
                <Link to="/roadmap" className="p-small text-gradient flex-center">View Full <ArrowUpRight size={14}/></Link>
              </div>
              
              {roadmap.length > 0 ? roadmap.map((item, index) => (
                <div 
                  key={index} 
                  className={`roadmap-step ${item.status === 'active' ? 'active' : 'pending'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => alert(`💎 Premium Feature:\nUnlock the complete curriculum and expert mentorship for: "${item.step}" by upgrading to Ascendra Premium.`)}
                >
                  {item.status === 'active' ? <div className="step-indicator pulsing"></div> : <div className="step-indicator"></div>}
                  <div className="step-content">
                    <h4 className={`font-medium ${item.status === 'active' ? 'text-white' : 'text-muted'}`}>{item.step}</h4>
                    <p className="p-small" style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>Click to Learn ↗</p>
                  </div>
                </div>
              )) : (
                <div className="p-small text-muted">No roadmap available. Update your profile skills.</div>
              )}
            </div>

            <div className="glass-panel section-card">
              <div className="flex-between" style={{ marginBottom: '24px' }}>
                <h3 className="h3">Internship Matches</h3>
                <Link to="/internships" className="p-small text-gradient flex-center">View All <ArrowUpRight size={14}/></Link>
              </div>

              {internships.slice(0, 3).map((intern, idx) => (
                <div key={idx} className="internship-item flex-between" style={{ padding: '16px', background: 'var(--bg-navy)', borderRadius: '8px', marginBottom: '12px' }}>
                  <div>
                    <h4 className="font-medium text-white">{intern.role} Intern</h4>
                    <p className="p-small" style={{ color: 'var(--accent-purple)', marginTop: '4px' }}>Actual live offers in Premium 🔒</p>
                  </div>
                  <span className="badge badge-match">{intern.match_percentage}% Match</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

    </div>
  );
}

