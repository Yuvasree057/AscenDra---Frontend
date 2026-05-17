import { API_BASE_URL } from '../../config';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle, Upload, Sparkles, Code, PenTool, TrendingUp, HeartPulse } from 'lucide-react';
import './Onboarding.css';

const EDUCATION_LEVELS = ['High School', 'Undergraduate', 'Graduate', 'Bootcamp', 'Self-Taught', 'Professional'];
const INTEREST_CATEGORIES = [
  { name: 'Software Development', icon: <Code size={20} /> },
  { name: 'Design & UX', icon: <PenTool size={20} /> },
  { name: 'Data & Analytics', icon: <TrendingUp size={20} /> },
  { name: 'Healthcare Tech', icon: <HeartPulse size={20} /> },
];

import { useAppContext } from '../../context/AppContext';
import SkillSelector from '../../components/SkillSelector';

export default function Onboarding() {
  const navigate = useNavigate();
  const { token, fetchProfile } = useAppContext();
  const [step, setStep] = useState(1);
  const [education, setEducation] = useState('');
  const [interests, setInterests] = useState([]);
  const [skills, setSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState(['Python', 'React', 'SQL', 'Machine Learning', 'Java']);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // Fetch dynamic skills from backend
    fetch(`${API_BASE_URL}/api/skills`)
      .then(res => res.json())
      .then(data => {
        if (data.skills) setAvailableSkills(data.skills);
      })
      .catch(err => console.error("Error fetching skills:", err));
  }, []);

  const handleNext = async () => {
    if (step === 4) {
      setStep(5);
      setIsAnalyzing(true);
      try {
        const payload = {
          education: education || 'Self-Taught',
          interests: interests.length > 0 ? interests : ['Software Development'],
          skills: skills.length > 0 ? skills : ['Python']
        };
        
        // Save user profile data for Profile page
        localStorage.setItem('ascendra_user_profile', JSON.stringify(payload));
        
        const response = await fetch(`${API_BASE_URL}/api/profile`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (data.status === 'success') {
          await fetchProfile(); // Update context with new profile
          setTimeout(() => navigate('/dashboard'), 1500); // Auto-redirect after a short delay
        }
      } catch (err) {
        console.error("Error analyzing profile:", err);
      }
      setIsAnalyzing(false);
    } else if (step < 5) {
      setStep(step + 1);
    } else {
      navigate('/dashboard');
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleSelection = (item, list, setList) => {
    if (list.includes(item)) setList(list.filter(i => i !== item));
    else setList([...list, item]);
  };

  return (
    <div className="onboarding-container flex-center">
      <div className="onboarding-card glass-panel animate-fade-in">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(step / 5) * 100}%` }}></div>
        </div>

        {/* STEP 1: Education */}
        {step === 1 && (
          <div className="step-content">
            <h2 className="h2 text-center">What is your education level?</h2>
            <p className="p-medium text-center" style={{ marginBottom: '32px' }}>This helps us tailor your career roadmap.</p>
            <div className="grid-options">
              {EDUCATION_LEVELS.map(level => (
                <button 
                  key={level} 
                  className={`option-btn ${education === level ? 'selected' : ''}`}
                  onClick={() => setEducation(level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Interests */}
        {step === 2 && (
          <div className="step-content">
            <h2 className="h2 text-center">What are your interests?</h2>
            <p className="p-medium text-center" style={{ marginBottom: '32px' }}>Select areas you want to explore.</p>
            <div className="grid-options cards">
              {INTEREST_CATEGORIES.map(category => (
                <div 
                  key={category.name} 
                  className={`interest-card glass-panel ${interests.includes(category.name) ? 'selected' : ''}`}
                  onClick={() => toggleSelection(category.name, interests, setInterests)}
                >
                  {category.icon}
                  <span style={{ marginTop: '12px', fontWeight: 500 }}>{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Skills */}
        {step === 3 && (
          <div className="step-content">
            <h2 className="h2 text-center">Select Your Existing Skills</h2>
            <p className="p-medium text-center" style={{ marginBottom: '32px' }}>We'll map careers to what you already know.</p>
            
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
               <SkillSelector selectedSkills={skills} onChange={setSkills} />
            </div>
          </div>
        )}

        {/* STEP 4: Resume Upload */}
        {step === 4 && (
          <div className="step-content text-center">
            <h2 className="h2">Upload Resume (Optional)</h2>
            <p className="p-medium" style={{ marginBottom: '32px' }}>Let AI instantly parse your experience and projects.</p>
            
            <div className="upload-area glass-panel">
              <Upload size={48} color="var(--accent-purple)" style={{ marginBottom: '16px' }} />
              <h3 className="h3">Drag & drop your resume here</h3>
              <p className="p-small" style={{ margin: '8px 0 24px 0' }}>PDF, DOCX up to 5MB</p>
              <button className="btn-secondary">Browse Files</button>
            </div>
          </div>
        )}

        {/* STEP 5: Generating Analysis */}
        {step === 5 && (
          <div className="step-content text-center flex-center" style={{ flexDirection: 'column', minHeight: '300px' }}>
            {isAnalyzing ? (
              <>
                <div className="pulsing-circle flex-center">
                  <Sparkles size={40} color="white" />
                </div>
                <h2 className="h2" style={{ marginTop: '32px', marginBottom: '8px' }}>Analyzing Your Profile</h2>
                <p className="p-medium">AI is discovering your best career paths...</p>
              </>
            ) : (
              <>
                <div className="flex-center" style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', marginBottom: '24px' }}>
                  <CheckCircle size={48} />
                </div>
                <h2 className="h2" style={{ marginBottom: '8px' }}>Analysis Complete!</h2>
                <p className="p-medium">Your personalized career roadmap is ready.</p>
              </>
            )}
          </div>
        )}

        {/* Navigation */}
        {step < 5 && (
          <div className="onboarding-nav flex-between">
            <button className="btn-secondary" onClick={handlePrev} style={{ visibility: step === 1 ? 'hidden' : 'visible' }}>
              <ArrowLeft size={18} /> Back
            </button>
            <button className="btn-primary" onClick={handleNext}>
              {step === 4 ? 'Complete' : 'Next'} <ArrowRight size={18} />
            </button>
          </div>
        )}
        {step === 5 && !isAnalyzing && (
          <button className="btn-primary w-100" onClick={() => navigate('/dashboard')} style={{ marginTop: '40px', width: '100%' }}>
            Go to Dashboard <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
