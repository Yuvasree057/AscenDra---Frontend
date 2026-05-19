import { API_BASE_URL } from '../../config';
import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { 
  ArrowLeft, Globe, MapPin, GraduationCap, Link, MessageSquare
} from 'lucide-react';
import './Profile.css';

export default function PublicProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/profile/public/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("Failed to fetch public profile", err);
      }
      setIsLoading(false);
    };

    fetchPublicProfile();
  }, [id]);

  if (isLoading) return <div className="flex-center" style={{ height: '100vh', background: 'var(--bg-navy)' }}><div className="pulsing-circle"></div></div>;

  if (!profile) return (
    <div className="flex-center" style={{ height: '100vh', flexDirection: 'column', gap: '16px' }}>
      <h2 className="h2">Profile Not Found</h2>
      <p className="p-medium text-muted">This profile is either private or doesn't exist.</p>
      <RouterLink to="/" className="btn-primary">Go Home</RouterLink>
    </div>
  );

  const parts = profile.name ? profile.name.split(' ') : ['User'];
  const initials = parts[0] ? parts[0][0].toUpperCase() : 'U';

  return (
    <div className="profile-container">
      <div className="container" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
        
        <header className="profile-header glass-panel flex-between" style={{ padding: '40px', marginBottom: '24px' }}>
          <div className="profile-info flex-center" style={{ gap: '24px', justifyContent: 'flex-start' }}>
            <div className="profile-avatar" style={{ position: 'relative', overflow: 'hidden' }}>
              {profile.profile_picture ? (
                <img src={profile.profile_picture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span className="h1 text-white">{initials}</span>
              )}
            </div>
            <div>
              <h1 className="h2" style={{ marginBottom: '4px' }}>{profile.name}</h1>
              
              {profile.location && (
                <div className="p-medium flex-center text-muted" style={{ justifyContent: 'flex-start', gap: '8px' }}>
                  <MapPin size={16} /> {profile.location}
                </div>
              )}
              
              <div className="social-links flex-center" style={{ justifyContent: 'flex-start', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
                {profile.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="social-icon"><Globe size={16} style={{marginRight:'4px'}}/> LinkedIn</a>}
                {profile.github_url && <a href={profile.github_url} target="_blank" rel="noreferrer" className="social-icon"><Globe size={16} style={{marginRight:'4px'}}/> GitHub</a>}
                {profile.resume_url && <a href={profile.resume_url} target="_blank" rel="noreferrer" className="social-icon" style={{color: 'var(--accent-purple)'}}><Link size={16} style={{marginRight:'4px'}}/> View Resume</a>}
              </div>
            </div>
          </div>
          <div className="profile-actions flex-center" style={{ gap: '12px' }}>
            <RouterLink to={`/messages?to=${id}`} className="btn-primary flex-center" style={{ gap: '8px' }}>
              <MessageSquare size={16} /> Connect & Message
            </RouterLink>
          </div>
        </header>

        <div className="profile-grid">
          <div className="profile-main">
            {profile.bio && (
              <section className="glass-panel section-card" style={{ marginBottom: '24px' }}>
                <h3 className="h3" style={{ marginBottom: '16px' }}>About Me</h3>
                <p className="p-medium">{profile.bio}</p>
              </section>
            )}

            {profile.education && (
              <section className="glass-panel section-card" style={{ marginBottom: '24px' }}>
                <h3 className="h3" style={{ marginBottom: '24px' }}>Education</h3>
                <div className="education-item flex-center" style={{ justifyContent: 'flex-start', gap: '16px' }}>
                  <div className="icon-box"><GraduationCap size={24} color="var(--accent-blue)" /></div>
                  <div style={{ flex: 1 }}>
                    <h4 className="font-medium text-white">{profile.education}</h4>
                  </div>
                </div>
              </section>
            )}
          </div>

          <div className="profile-sidebar">
            <section className="glass-panel section-card" style={{ marginBottom: '24px' }}>
              <h3 className="h3" style={{ marginBottom: '16px' }}>Skills</h3>
              <div className="skills-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {profile.skills?.length > 0 ? profile.skills.map((skill, idx) => (
                  <span key={idx} className="skill-chip" style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-purple)' }}>{skill}</span>
                )) : <span className="p-small text-muted">No skills listed</span>}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
