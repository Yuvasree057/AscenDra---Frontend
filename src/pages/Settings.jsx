import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Shield, Sliders, CreditCard, Save } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Settings() {
  const { user, profile } = useAppContext();
  const [activeTab, setActiveTab] = useState('account');
  
  if (!profile) return <div className="flex-center" style={{ height: '100vh', background: 'var(--bg-navy)' }}><div className="pulsing-circle"></div></div>;

  return (
    <div className="container" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
      <Link to="/dashboard" className="back-link" style={{ display: 'inline-flex', marginBottom: '24px' }}>
        <ArrowLeft size={18} style={{ marginRight: '8px' }} /> Back to Dashboard
      </Link>
      
      <header className="glass-panel" style={{ padding: '40px', marginBottom: '24px' }}>
        <h1 className="h2" style={{ marginBottom: '8px' }}>Settings</h1>
        <p className="p-medium">Manage your account, preferences, and security.</p>
      </header>

      <div className="grid" style={{ gridTemplateColumns: '250px 1fr', gap: '24px', alignItems: 'start' }}>
        <div className="glass-panel" style={{ padding: '16px' }}>
           <button 
              className={`nav-item w-100 text-left ${activeTab === 'account' ? 'text-white' : 'text-muted'}`} 
              style={{ background: activeTab === 'account' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', cursor: 'pointer', padding: '12px 16px', borderRadius: '8px' }}
              onClick={() => setActiveTab('account')}
           >
              <User size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} /> Account
           </button>
           <button 
              className={`nav-item w-100 text-left ${activeTab === 'preferences' ? 'text-white' : 'text-muted'}`} 
              style={{ background: activeTab === 'preferences' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', cursor: 'pointer', padding: '12px 16px', borderRadius: '8px', marginTop: '4px' }}
              onClick={() => setActiveTab('preferences')}
           >
              <Sliders size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} /> Preferences
           </button>
           <button 
              className={`nav-item w-100 text-left ${activeTab === 'security' ? 'text-white' : 'text-muted'}`} 
              style={{ background: activeTab === 'security' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', cursor: 'pointer', padding: '12px 16px', borderRadius: '8px', marginTop: '4px' }}
              onClick={() => setActiveTab('security')}
           >
              <Shield size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} /> Security
           </button>
           <button 
              className={`nav-item w-100 text-left ${activeTab === 'premium' ? 'text-white' : 'text-muted'}`} 
              style={{ background: activeTab === 'premium' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', cursor: 'pointer', padding: '12px 16px', borderRadius: '8px', marginTop: '4px' }}
              onClick={() => setActiveTab('premium')}
           >
              <CreditCard size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} /> Premium
           </button>
        </div>

        <div className="glass-panel" style={{ padding: '32px' }}>
           {activeTab === 'account' && (
             <div>
                <h3 className="h3" style={{ marginBottom: '24px' }}>Account Settings</h3>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                   <label className="label">Full Name</label>
                   <input type="text" className="input-field" defaultValue={profile.name || user?.name || ''} />
                </div>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                   <label className="label">Email Address</label>
                   <input type="email" className="input-field" defaultValue={user?.email || ''} readOnly style={{ opacity: 0.7 }} />
                   <p className="p-small text-muted" style={{ marginTop: '4px' }}>Contact support to change your email.</p>
                </div>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                   <label className="label">Mobile Number</label>
                   <input type="tel" className="input-field" placeholder="+1 (555) 000-0000" />
                </div>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                   <label className="label">Profile Visibility</label>
                   <select className="input-field" style={{ backgroundColor: 'var(--bg-dark)' }}>
                      <option>Public - Visible to recruiters</option>
                      <option>Private - Only me</option>
                   </select>
                </div>
                <button className="btn-primary flex-center" style={{ gap: '8px' }}><Save size={16} /> Save Changes</button>
             </div>
           )}

           {activeTab === 'preferences' && (
             <div>
                <h3 className="h3" style={{ marginBottom: '24px' }}>System Preferences</h3>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                   <label className="label">Theme</label>
                   <select className="input-field" style={{ backgroundColor: 'var(--bg-dark)' }}>
                      <option>Dark (Default)</option>
                      <option>Light</option>
                      <option>System Default</option>
                   </select>
                </div>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                   <label className="label">Career Preferences</label>
                   <select className="input-field" style={{ backgroundColor: 'var(--bg-dark)' }}>
                      <option>Actively looking for roles</option>
                      <option>Open to offers</option>
                      <option>Not looking</option>
                   </select>
                </div>
                <div className="form-group" style={{ marginBottom: '24px' }}>
                   <label className="label">Notifications</label>
                   <div className="flex-center" style={{ justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '8px' }}>
                      <span>New Internship Matches</span>
                      <input type="checkbox" defaultChecked />
                   </div>
                   <div className="flex-center" style={{ justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                      <span>Weekly Roadmap Progress</span>
                      <input type="checkbox" defaultChecked />
                   </div>
                </div>
                <button className="btn-primary flex-center" style={{ gap: '8px' }}><Save size={16} /> Save Preferences</button>
             </div>
           )}

           {activeTab === 'security' && (
             <div>
                <h3 className="h3" style={{ marginBottom: '24px' }}>Security Settings</h3>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                   <label className="label">Current Password</label>
                   <input type="password" className="input-field" placeholder="••••••••" />
                </div>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                   <label className="label">New Password</label>
                   <input type="password" className="input-field" placeholder="••••••••" />
                </div>
                <button className="btn-primary flex-center" style={{ gap: '8px', marginBottom: '32px' }}><Save size={16} /> Update Password</button>

                <hr style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginBottom: '32px' }}/>
                <h4 className="font-medium text-white" style={{ marginBottom: '16px' }}>Device Sessions</h4>
                <div className="flex-between" style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '16px' }}>
                   <div>
                      <p className="font-medium text-white">Windows PC • Chrome</p>
                      <p className="p-small text-muted">Current session • Active now</p>
                   </div>
                </div>
                <button className="btn-secondary" style={{ color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}>Logout All Devices</button>
             </div>
           )}

           {activeTab === 'premium' && (
             <div className="text-center">
                <div className="flex-center" style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.2)', margin: '0 auto 24px' }}>
                   <CreditCard size={32} color="#F59E0B" />
                </div>
                <h3 className="h3" style={{ marginBottom: '8px' }}>Ascendra Free</h3>
                <p className="p-medium text-muted" style={{ marginBottom: '32px' }}>You are currently on the free tier.</p>

                <div style={{ background: 'var(--bg-navy)', padding: '32px', borderRadius: '12px', textAlign: 'left', marginBottom: '32px' }}>
                   <h4 className="font-medium text-white" style={{ marginBottom: '16px' }}>Premium Features:</h4>
                   <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                         <span style={{ color: '#10B981' }}>✓</span> Unlimited Internship Matching
                      </li>
                      <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                         <span style={{ color: '#10B981' }}>✓</span> Deep Learning Custom Roadmaps
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                         <span style={{ color: '#10B981' }}>✓</span> AI Resume Optimization
                      </li>
                   </ul>
                </div>

                <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', width: '100%', maxWidth: '300px' }}>
                   Upgrade to Premium
                </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
