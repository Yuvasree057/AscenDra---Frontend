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
    fetchProfiles();
  }, []);

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
              style={{ paddingLeft: '48px', paddingRight: '120px', width: '100%', height: '56px', borderRadius: '28px' }}
            />
            <button type="submit" className="btn-primary" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', padding: '8px 16px', borderRadius: '20px' }}>
              Search
            </button>
          </form>
        </header>

        {isLoading ? (
          <div className="flex-center" style={{ padding: '60px' }}><div className="pulsing-circle"></div></div>
        ) : (
          <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {profiles.length > 0 ? (
              profiles.map(p => (
                <div key={p.id} className="glass-panel stat-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                  <div className="flex-between" style={{ alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div className="avatar-wrapper" style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--bg-navy)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {p.profile_picture ? (
                        <img src={p.profile_picture} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span className="h2 text-white">{p.name ? p.name[0].toUpperCase() : 'U'}</span>
                      )}
                    </div>
                  </div>
                  <h3 className="h3" style={{ marginBottom: '4px' }}>{p.name}</h3>
                  <p className="p-small text-muted" style={{ marginBottom: '16px', flex: 1 }}>{p.bio}</p>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
                    {p.skills?.map((s, idx) => (
                      <span key={idx} className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>{s}</span>
                    ))}
                  </div>
                  
                  <div className="flex-between" style={{ gap: '12px' }}>
                    <RouterLink to={`/u/${p.id}`} className="btn-secondary flex-center" style={{ flex: 1, padding: '8px', fontSize: '14px' }}>
                      <User size={16} style={{ marginRight: '6px' }} /> View Profile
                    </RouterLink>
                    <RouterLink to={`/messages?to=${p.id}`} className="btn-primary flex-center" style={{ flex: 1, padding: '8px', fontSize: '14px' }}>
                      <MessageSquare size={16} style={{ marginRight: '6px' }} /> Connect
                    </RouterLink>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px' }}>
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
