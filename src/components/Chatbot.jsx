import { API_BASE_URL } from '../config';
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, ChevronDown, RefreshCw } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './Chatbot.css';

const QUICK_ACTIONS = [
  "Analyze My Skills",
  "Suggest Careers",
  "Build Roadmap",
  "Find Internships",
  "Improve Resume",
  "Interview Preparation"
];

// Simple markdown formatter to handle bold text and code blocks
const formatMessage = (text) => {
  if (!text) return null;
  
  // Very basic markdown parsing
  let formattedText = text
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; overflow-x: auto; font-family: monospace; font-size: 0.8rem; margin: 8px 0;"><code>$1</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code style="background: rgba(0,0,0,0.2); padding: 2px 4px; border-radius: 4px; font-family: monospace; font-size: 0.8rem;">$1</code>')
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Newlines
    .replace(/\n/g, '<br />');
    
  return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
};

const StreamedMessage = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let i = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 15);
    
    return () => clearInterval(interval);
  }, [text]);

  return formatMessage(displayedText);
};

export default function Chatbot() {
  const { token, profile } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-milliena-chat', handleOpenChat);
    return () => window.removeEventListener('open-milliena-chat', handleOpenChat);
  }, []);
  
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('milliena_chat_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [{
      role: 'milliena',
      text: "Hi, I'm Milliena ✨\nYour AI career mentor and learning companion.\nI can help you with careers, skills, internships, projects, learning roadmaps, productivity, and much more."
    }];
  });
  
  const messagesEndRef = useRef(null);

  // Auto-save messages
  useEffect(() => {
    localStorage.setItem('milliena_chat_history', JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async (textOverride = null) => {
    const textToSend = textOverride || inputValue.trim();
    if (!textToSend) return;

    // Add user message
    const newMessages = [...messages, { role: 'user', text: textToSend }];
    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: textToSend, history: newMessages })
      });
      
      const data = await res.json();
      
      // Simulate slight delay for realism
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { 
          role: 'milliena', 
          text: data.response || "I'm having trouble processing that right now.", 
          suggestion_cards: data.suggestion_cards || [],
          isNew: true 
        }]);
      }, 600);

    } catch (err) {
      console.error("Chat error:", err);
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'milliena', text: "Sorry, my server connection was lost. Please try again." }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    const defaultMsg = [{
      role: 'milliena',
      text: "Chat cleared. What else would you like to explore?"
    }];
    setMessages(defaultMsg);
    localStorage.setItem('milliena_chat_history', JSON.stringify(defaultMsg));
  };

  // Only render if logged in
  if (!token) return null;

  return (
    <div className="chatbot-wrapper">
      {isOpen && (
        <div className="chatbot-window">
          <header className="chatbot-header">
            <div className="flex-center" style={{ gap: '12px' }}>
              <div className="milliena-avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(139, 92, 246, 0.5)', boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)' }}>
                <img src="/milliena.png" alt="Milliena" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h3 className="h4 text-white" style={{ fontSize: '1rem', margin: 0 }}>Milliena ✨</h3>
                <p className="p-small" style={{ margin: 0, color: '#10B981', fontSize: '0.7rem' }}>Online • AI Career Mentor</p>
              </div>
            </div>
            <div className="flex-center" style={{ gap: '12px' }}>
              <button onClick={clearChat} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} title="Clear Chat">
                <RefreshCw size={16} />
              </button>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <ChevronDown size={24} />
              </button>
            </div>
          </header>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div className={`chat-bubble ${msg.role}`}>
                  {msg.role === 'milliena' && msg.isNew ? (
                    <StreamedMessage text={msg.text} onComplete={() => {
                       // Remove isNew flag so it doesn't stream again on re-render
                       setMessages(prev => prev.map((m, i) => i === idx ? { ...m, isNew: false } : m));
                    }} />
                  ) : (
                    formatMessage(msg.text)
                  )}
                </div>
                {msg.suggestion_cards && msg.suggestion_cards.length > 0 && !msg.isNew && (
                  <div className="suggestion-cards" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px', marginLeft: msg.role === 'milliena' ? '4px' : '0' }}>
                    {msg.suggestion_cards.map(card => (
                      <button 
                        key={card} 
                        className="action-chip" 
                        style={{ padding: '6px 10px', fontSize: '0.7rem', background: 'rgba(139, 92, 246, 0.1)' }}
                        onClick={() => handleSend(card)}
                        disabled={isTyping}
                      >
                        {card}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="chat-bubble milliena flex-center" style={{ width: 'fit-content' }}>
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="quick-actions">
            {QUICK_ACTIONS.map(action => (
              <button 
                key={action} 
                className="action-chip"
                onClick={() => handleSend(action)}
                disabled={isTyping}
              >
                {action}
              </button>
            ))}
          </div>

          <div className="chatbot-input-area">
            <input 
              type="text" 
              className="chatbot-input" 
              placeholder="Ask Milliena anything..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
            />
            <button className="chatbot-send-btn" onClick={() => handleSend()} disabled={!inputValue.trim() || isTyping}>
              <Send size={18} style={{ transform: 'translateX(-1px)' }}/>
            </button>
          </div>
        </div>
      )}

      {!isOpen && (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)} style={{ padding: 0, overflow: 'hidden' }}>
          <img src="/milliena.png" alt="Milliena" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
        </button>
      )}
    </div>
  );
}
