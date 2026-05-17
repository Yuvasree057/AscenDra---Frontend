import { API_BASE_URL } from '../../config';
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  ArrowLeft, Edit2, Link, Share2, Globe, MapPin, 
  GraduationCap, Book, Award, Briefcase, Plus, Check, X, CheckCircle
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import SkillSelector from '../../components/SkillSelector';
import './Profile.css';

export default function Profile() {
  const { profile, user, token, fetchProfile } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    location: '',
    bio: '',
    education: '',
    linkedin: '',
    github: '',
    skills: [],
    interests: [],
    profile_picture: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.name || user?.name || '',
        location: profile.location || '',
        bio: profile.bio || '',
        education: profile.education || '',
        linkedin: profile.linkedin || '',
        github: profile.github || '',
        skills: profile.analysis_data?.skills || [],
        interests: profile.analysis_data?.interests || [],
        profile_picture: profile.profile_picture || ''
      });
    }
  }, [profile, user]);

  if (!profile) return <div className="flex-center" style={{ height: '100vh', background: 'var(--bg-navy)' }}><div className="pulsing-circle"></div></div>;

  const parts = formData.full_name.split(' ');
  const initials = parts.length > 1 ? parts[0][0] + parts[1][0] : (parts[0] ? parts[0].substring(0, 2).toUpperCase() : 'U');

  const handleSave = async (overrideData = null) => {
    setIsSaving(true);
    const dataToSave = overrideData || formData;
    try {
      const payload = {
        full_name: dataToSave.full_name,
        location: dataToSave.location,
        bio: dataToSave.bio,
        education: dataToSave.education,
        linkedin_url: dataToSave.linkedin_url || dataToSave.linkedin,
        github_url: dataToSave.github_url || dataToSave.github,
        skills: dataToSave.skills,
        interests: dataToSave.interests,
        profile_picture: dataToSave.profile_picture
      };
      
      const res = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await fetchProfile();
        if (!dataToSave) setIsEditing(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save profile", err);
    }
    setIsSaving(false);
  };

  const handleSkillChange = async (newSkills) => {
    setFormData({...formData, skills: newSkills});
    await handleSave({...formData, skills: newSkills});
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({...formData, profile_picture: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-container">
      <div className="container" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
        <RouterLink to="/dashboard" className="back-link" style={{ position: 'relative', top: 0, left: 0, display: 'inline-flex', marginBottom: '24px' }}>
          <ArrowLeft size={18} style={{ marginRight: '8px' }} /> Back to Dashboard
        </RouterLink>
        
        {saveSuccess && (
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', padding: '12px 24px', borderRadius: '8px', marginBottom: '24px', textAlign: 'center', border: '1px solid #10B981' }}>
            Profile saved successfully!
          </div>
        )}

        <header className="profile-header glass-panel flex-between" style={{ padding: '40px', marginBottom: '24px' }}>
          <div className="profile-info flex-center" style={{ gap: '24px', justifyContent: 'flex-start' }}>
            <div className="profile-avatar" style={{ position: 'relative', overflow: 'hidden' }}>
              {formData.profile_picture ? (
                <img src={formData.profile_picture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span className="h1 text-white">{initials}</span>
              )}
              {isEditing && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => document.getElementById('profile-pic-upload').click()}>
                  <span style={{ fontSize: '12px', color: 'white' }}>Change</span>
                  <input id="profile-pic-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                </div>
              )}
            </div>
            <div>
              {isEditing ? (
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.full_name} 
                  onChange={e => setFormData({...formData, full_name: e.target.value})}
                  placeholder="Full Name"
                  style={{ marginBottom: '8px', width: '250px' }}
                />
              ) : (
                <h1 className="h2" style={{ marginBottom: '4px' }}>{formData.full_name || 'Add your name'}</h1>
              )}
              
              <div className="p-medium flex-center" style={{ justifyContent: 'flex-start', gap: '8px' }}>
                <MapPin size={16} /> 
                {isEditing ? (
                  <input 
                    type="text" 
                    className="input-field" 
                    value={formData.location} 
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    placeholder="City, Country"
                    style={{ padding: '4px 8px', fontSize: '14px', width: '200px' }}
                  />
                ) : (
                  formData.location || 'Location not set'
                )}
              </div>
              
              <div className="social-links flex-center" style={{ justifyContent: 'flex-start', gap: '16px', marginTop: '16px' }}>
                {isEditing ? (
                  <>
                    <input type="text" className="input-field" placeholder="LinkedIn URL" value={formData.linkedin_url || formData.linkedin} onChange={e => setFormData({...formData, linkedin_url: e.target.value})} style={{ padding: '4px 8px', fontSize: '12px', width: '150px' }}/>
                    <input type="text" className="input-field" placeholder="GitHub URL" value={formData.github_url || formData.github} onChange={e => setFormData({...formData, github_url: e.target.value})} style={{ padding: '4px 8px', fontSize: '12px', width: '150px' }}/>
                  </>
                ) : (
                  <>
                    {(formData.linkedin_url || formData.linkedin) && <a href={formData.linkedin_url || formData.linkedin} target="_blank" rel="noreferrer" className="social-icon"><Link size={20} /> LinkedIn</a>}
                    {(formData.github_url || formData.github) && <a href={formData.github_url || formData.github} target="_blank" rel="noreferrer" className="social-icon"><Globe size={20} /> GitHub</a>}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="profile-actions flex-center" style={{ gap: '12px' }}>
            {saveSuccess && (
              <span className="p-small text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle size={14} color="#10B981" /> Profile updated successfully
              </span>
            )}
            {isEditing ? (
              <div className="flex-center" style={{ gap: '12px' }}>
                <button className="btn-secondary" onClick={() => setIsEditing(false)}><X size={16} style={{marginRight: '8px'}}/> Cancel</button>
                <button className="btn-primary" onClick={() => handleSave(formData)} disabled={isSaving}>
                  {isSaving ? 'Saving...' : <><Check size={16} style={{marginRight: '8px'}}/> Save Changes</>}
                </button>
              </div>
            ) : (
              <button className="btn-secondary" onClick={() => setIsEditing(true)}><Edit2 size={16} style={{marginRight: '8px'}}/> Edit Profile</button>
            )}
          </div>
        </header>

        <div className="profile-grid">
          <div className="profile-main">
            <section className="glass-panel section-card" style={{ marginBottom: '24px' }}>
              <div className="flex-between" style={{ marginBottom: '16px' }}>
                <h3 className="h3">About Me</h3>
              </div>
              {isEditing ? (
                <textarea 
                  className="input-field" 
                  rows="4" 
                  value={formData.bio} 
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                  placeholder="Tell us about your career goals and background..."
                  style={{ width: '100%', resize: 'vertical' }}
                />
              ) : (
                <p className="p-medium">
                  {formData.bio || "Add a bio to let AI better understand your career trajectory."}
                </p>
              )}
            </section>

            <section className="glass-panel section-card" style={{ marginBottom: '24px' }}>
              <div className="flex-between" style={{ marginBottom: '24px' }}>
                <h3 className="h3">Education</h3>
              </div>
              <div className="education-item flex-center" style={{ justifyContent: 'flex-start', gap: '16px' }}>
                <div className="icon-box"><GraduationCap size={24} color="var(--accent-blue)" /></div>
                <div style={{ flex: 1 }}>
                  {isEditing ? (
                    <input 
                      type="text" 
                      className="input-field" 
                      value={formData.education} 
                      onChange={e => setFormData({...formData, education: e.target.value})}
                      placeholder="e.g. B.S. Computer Science"
                      style={{ width: '100%', marginBottom: '8px' }}
                    />
                  ) : (
                    <>
                      <h4 className="font-medium text-white">{formData.education || "No education added"}</h4>
                      <p className="p-small">Self-Reported Background</p>
                    </>
                  )}
                </div>
              </div>
            </section>
          </div>

          <div className="profile-sidebar">
            <section className="glass-panel section-card" style={{ marginBottom: '24px' }}>
              <div className="flex-between" style={{ marginBottom: '16px' }}>
                <h3 className="h3">Skills</h3>
              </div>
              <SkillSelector 
                selectedSkills={formData.skills} 
                onChange={handleSkillChange} 
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
