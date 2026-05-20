import { API_BASE_URL } from '../../config';
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Search, ArrowLeft, Globe, User, MessageSquare } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function Network() {
  const { token } = useAppContext();
  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProfiles(search);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const fetchProfiles = async (query = '') => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/profile/explore?search=${query}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfiles(data.profiles);
      }
    } catch (err) {
      console.error("Failed to fetch network profiles", err);
    }
    setIsLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProfiles(search);
  };

  return (
    <div className="profile-container">
      <div className="container" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
        <RouterLink to="/dashboard" className="back-link" style={{ position: 'relative', top: 0, left: 0, display: 'inline-flex', marginBottom: '24px' }}>
          <ArrowLeft size={18} style={{ marginRight: '8px' }} /> Back to Dashboard
        </RouterLink>
        
        <header className="glass-panel" style={{ padding: '40px', marginBottom: '24px', textAlign: 'center' }}>
          <h1 className="h1 text-gradient" style={{ marginBottom: '16px' }}>Network & Explore</h1>
          <p className="p-large text-muted" style={{ maxWidth: '600px', margin: '0 auto', marginBottom: '24px' }}>
            Discover peers, connect with future colleagues, and build your professional circle.
          </p>

          <form onSubmit={handleSearch} className="search-bar-container mx-auto" style={{ maxWidth: '500px', position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search by name or keywords..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ 
                paddingLeft: '48px', 
                paddingRight: '120px', 
                width: '100%', 
                height: '56px', 
                borderRadius: '28px',
                background: '#ffffff',
                border: '2px solid #F59E0B',
                color: '#1a1a2e',
                boxShadow: '0 4px 20px rgba(245, 158, 11, 0.15)'
              }}
            />
            <button type="submit" className="btn-primary" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', padding: '8px 20px', borderRadius: '20px', background: 'var(--accent-purple)', fontWeight: 'bold' }}>
              Search
            </button>
          </form>
        </header>

        {isLoading ? (
          <div className="flex-center" style={{ padding: '60px' }}><div className="pulsing-circle"></div></div>
        ) : (
          <div className="dashboard-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '800px', margin: '0 auto' }}>
            {profiles.length > 0 ? (
              profiles.map(p => (
                <div key={p.id} className="glass-panel stat-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    <div className="avatar-wrapper" style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--bg-navy)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {p.profile_picture ? (
                        <img src={p.profile_picture} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span className="h2 text-white">{p.name ? p.name[0].toUpperCase() : 'U'}</span>
                      )}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <h3 className="h3" style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {p.name}
                        {p.top_match && <span className="badge" style={{ background: 'rgba(139,92,246,0.1)', color: 'var(--accent-purple)', fontSize: '11px', padding: '2px 8px' }}>{p.top_match}</span>}
                      </h3>
                      
                      <div style={{ display: 'flex', gap: '16px', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                        {p.location && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>📍 {p.location}</span>}
                        {p.education && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>🎓 {p.education}</span>}
                      </div>

                      {p.bio && !p.bio.toLowerCase().includes('software dev') && p.bio !== 'Career Explorer' ? (
                        <p className="p-medium text-muted" style={{ marginBottom: '12px', lineHeight: 1.4 }}>{p.bio}</p>
                      ) : (
                        <p className="p-medium text-muted" style={{ marginBottom: '12px', fontStyle: 'italic', opacity: 0.6 }}>{p.name.split(' ')[0]} hasn't filled out their bio yet.</p>
                      )}
                      
                      {p.skills && p.skills.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {p.skills.map((s, idx) => (
                            <span key={idx} className="badge" style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-purple)', fontSize: '12px', padding: '4px 10px' }}>{s}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '140px' }}>
                      <RouterLink to={`/u/${p.id}`} className="btn-secondary flex-center" style={{ width: '100%', padding: '10px', borderRadius: '12px', transition: 'all 0.3s ease', transform: 'scale(1)', ':hover': { transform: 'scale(1.05)' } }}>
                        <User size={16} style={{ marginRight: '6px' }} /> View Profile
                      </RouterLink>
                      <RouterLink to={`/messages?to=${p.id}`} className="btn-primary flex-center" style={{ width: '100%', padding: '10px', borderRadius: '12px', background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', boxShadow: '0 4px 15px rgba(139,92,246,0.3)', transition: 'all 0.3s ease' }}>
                        <MessageSquare size={16} style={{ marginRight: '6px' }} /> Connect
                      </RouterLink>
                    </div>
                  </div>

                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <Globe size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                <h3 className="h3 text-white">No Profiles Found</h3>
                <p className="p-medium text-muted">Try adjusting your search terms.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
