import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Sparkles, Maximize2, X } from 'lucide-react';

export default function SkillGraph({ data, aiCommentary, targetRole }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const ChartContent = () => (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius={isExpanded ? "70%" : "80%"} data={data}>
        <PolarGrid stroke="rgba(255,255,255,0.1)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: isExpanded ? 14 : 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Tooltip 
          contentStyle={{ background: 'var(--bg-navy)', border: '1px solid var(--accent-purple)', borderRadius: '8px', color: '#fff' }}
          itemStyle={{ color: 'var(--accent-blue)' }}
        />
        <Legend verticalAlign={isExpanded ? "top" : "bottom"} height={36} iconType="circle" />
        <Radar name="Your Level" dataKey="Current" stroke="var(--accent-purple)" fill="var(--accent-purple)" fillOpacity={0.5} />
        <Radar name={`${targetRole} Required`} dataKey="Target" stroke="var(--accent-blue)" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
      </RadarChart>
    </ResponsiveContainer>
  );

  return (
    <>
      <div className="skill-graph-container glass-panel stat-card" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <div>
            <h3 className="h3">Skill Gap Analysis</h3>
            <p className="p-small text-muted" style={{ marginTop: '4px' }}>Target: {targetRole}</p>
          </div>
          <button onClick={() => setIsExpanded(true)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', gap: '6px' }}>
            <Maximize2 size={14} /> Expand
          </button>
        </div>
        
        <div style={{ width: '100%', height: '250px' }}>
          <ChartContent />
        </div>
        
        <div className="ai-commentary" style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: '3px solid var(--accent-purple)' }}>
          <p className="p-small" style={{ fontStyle: 'italic', color: 'var(--text-white)' }}>
            "{aiCommentary}"
          </p>
        </div>
      </div>

      {isExpanded && (
        <div className="modal-overlay flex-center" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(10, 15, 30, 0.9)', zIndex: 9999, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', height: '80vh', padding: '32px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <button onClick={() => setIsExpanded(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-white)' }}>
              <X size={24} />
            </button>
            <h2 className="h2" style={{ marginBottom: '8px' }}>Detailed Skill Gap Analysis</h2>
            <p className="p-large text-gradient" style={{ marginBottom: '24px' }}>Targeting: {targetRole}</p>
            
            <div style={{ flex: 1, width: '100%', minHeight: '0' }}>
              <ChartContent />
            </div>
            
            <div className="ai-commentary flex-between" style={{ marginTop: '24px', padding: '16px 24px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', borderLeft: '4px solid var(--accent-purple)' }}>
              <div>
                <span className="badge flex-center" style={{ display: 'inline-flex', gap: '6px', background: 'rgba(139, 92, 246, 0.2)', color: 'var(--accent-purple)', marginBottom: '8px' }}>
                  <Sparkles size={14} /> AI Analysis
                </span>
                <p className="p-medium" style={{ color: 'var(--text-white)' }}>
                  "{aiCommentary}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
