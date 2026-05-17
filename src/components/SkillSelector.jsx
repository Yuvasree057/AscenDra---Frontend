import { API_BASE_URL } from '../config';
import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

export default function SkillSelector({ selectedSkills, onChange }) {
  const [availableSkills, setAvailableSkills] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [smartSuggestions, setSmartSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/skills`)
      .then(res => res.json())
      .then(data => {
        if (data.skills) setAvailableSkills(data.skills);
      })
      .catch(err => console.error("Error fetching skills:", err));
  }, []);

  useEffect(() => {
    if (selectedSkills.length > 0) {
      fetch(`${API_BASE_URL}/api/suggest-skills?skills=${selectedSkills.join(',')}`)
        .then(res => res.json())
        .then(data => {
          if (data.suggestions) setSmartSuggestions(data.suggestions);
        })
        .catch(err => console.error("Error fetching suggestions:", err));
    } else {
      setSmartSuggestions([]);
    }
  }, [selectedSkills]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    
    if (val.trim()) {
      const filtered = availableSkills.filter(skill => 
        skill.toLowerCase().includes(val.toLowerCase()) && 
        !selectedSkills.includes(skill)
      );
      setSuggestions(filtered.slice(0, 10)); // Top 10 matches
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const addSkill = (skill) => {
    if (!selectedSkills.includes(skill)) {
      onChange([...selectedSkills, skill]);
    }
    setInputValue('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  const removeSkill = (skillToRemove) => {
    onChange(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      // If there are suggestions, pick the first one, else add the typed one
      if (suggestions.length > 0) {
        addSkill(suggestions[0]);
      } else {
        // Allow custom skills to be added if not found in dataset
        addSkill(inputValue.trim().title());
      }
    }
  };

  // Helper to title case custom skills
  String.prototype.title = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };

  return (
    <div className="skill-selector" ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <div className="input-wrapper" style={{ position: 'relative', marginBottom: '12px' }}>
        <Search className="input-icon" size={18} style={{ color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          className="input-field with-icon" 
          placeholder="Search and add skills (e.g. Python, SQL)..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => { if(inputValue) setShowDropdown(true); }}
        />
      </div>

      {showDropdown && (
        <div 
          className="glass-panel" 
          style={{ 
            position: 'absolute', 
            top: '45px', 
            left: 0, 
            right: 0, 
            zIndex: 100, 
            maxHeight: '200px', 
            overflowY: 'auto',
            padding: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
          }}
        >
          {suggestions.length > 0 ? (
            suggestions.map(skill => (
              <div 
                key={skill} 
                onClick={() => addSkill(skill)}
                style={{
                  padding: '10px 12px',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  transition: 'background 0.2s',
                  color: 'var(--text-white)',
                  fontSize: '14px'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {skill}
              </div>
            ))
          ) : (
            <div style={{ padding: '10px 12px', color: 'var(--text-muted)', fontSize: '14px' }}>
              No matching skills found in dataset. Press Enter to add custom skill.
            </div>
          )}
        </div>
      )}

      <div className="skills-container" style={{ justifyContent: 'flex-start', marginTop: '12px' }}>
        {selectedSkills.map(skill => (
          <span key={skill} className="skill-chip selected flex-center" style={{ gap: '6px', paddingRight: '8px' }}>
            {skill} 
            <X 
              size={14} 
              style={{cursor: 'pointer', opacity: 0.7}} 
              onClick={() => removeSkill(skill)}
              onMouseOver={e => e.currentTarget.style.opacity = 1}
              onMouseOut={e => e.currentTarget.style.opacity = 0.7}
            />
          </span>
        ))}
      </div>

      {smartSuggestions.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <p className="p-small text-muted" style={{ marginBottom: '8px' }}>Suggested based on your profile:</p>
          <div className="skills-container" style={{ justifyContent: 'flex-start' }}>
            {smartSuggestions.filter(s => !selectedSkills.includes(s)).map(skill => (
              <span 
                key={skill} 
                className="skill-chip" 
                style={{ cursor: 'pointer', border: '1px dashed rgba(255,255,255,0.3)' }}
                onClick={() => addSkill(skill)}
              >
                + {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
