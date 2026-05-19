import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Sparkles } from 'lucide-react';

export default function SkillGraph({ data, aiCommentary }) {
  // data format: [{ subject: 'Python', A: 85, fullMark: 100 }, ...]
  
  return (
    <div className="skill-graph-container glass-panel stat-card" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div className="flex-between" style={{ marginBottom: '16px' }}>
        <h3 className="h3">Your Skill Stats</h3>
        <span className="badge flex-center" style={{ gap: '6px', background: 'rgba(139, 92, 246, 0.2)', color: 'var(--accent-purple)' }}>
          <Sparkles size={14} /> AI Analysis
        </span>
      </div>
      
      <div style={{ width: '100%', height: '250px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ background: 'var(--bg-navy)', border: '1px solid var(--accent-purple)', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: 'var(--accent-blue)' }}
            />
            <Radar name="Skill Level" dataKey="A" stroke="var(--accent-purple)" fill="var(--accent-purple)" fillOpacity={0.5} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="ai-commentary" style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: '3px solid var(--accent-purple)' }}>
        <p className="p-small" style={{ fontStyle: 'italic', color: 'var(--text-white)' }}>
          "{aiCommentary || "Your stats are looking solid! Keep grinding to unlock new career nodes."}"
        </p>
      </div>
    </div>
  );
}
