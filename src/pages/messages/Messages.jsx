import { API_BASE_URL } from '../../config';
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link as RouterLink } from 'react-router-dom';
import { Send, ArrowLeft, User, MessageSquare } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import './Messages.css';

export default function Messages() {
  const { token, user } = useAppContext();
  const [searchParams] = useSearchParams();
  const initialToId = searchParams.get('to');

  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat.id);
    }
  }, [activeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/messages/conversations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations);
        
        // Handle "Connect & Message" URL parameter
        if (initialToId) {
          const existingConvo = data.conversations.find(c => c.id == initialToId);
          if (existingConvo) {
            setActiveChat(existingConvo);
          } else {
            // Need to fetch this new user's profile to start a chat
            fetchNewUserChat(initialToId);
          }
        } else if (data.conversations.length > 0) {
          setActiveChat(data.conversations[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch conversations", err);
    }
    setIsLoadingChats(false);
  };

  const fetchNewUserChat = async (userId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/profile/public/${userId}`);
      if (res.ok) {
        const data = await res.json();
        const newChatUser = {
          id: data.id,
          name: data.name,
          profile_picture: data.profile_picture,
          last_message: 'New connection'
        };
        setConversations(prev => [newChatUser, ...prev]);
        setActiveChat(newChatUser);
      }
    } catch (err) {
      console.error("Failed to load new user", err);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/messages/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    const textToSend = inputText;
    setInputText('');

    // Optimistic UI update
    const optimisticMsg = {
      id: Date.now(),
      sender_id: parseInt(user.id),
      content: textToSend,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, optimisticMsg]);

    try {
      const res = await fetch(`${API_BASE_URL}/api/messages/${activeChat.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: textToSend })
      });
      if (!res.ok) {
        // Handle failure if needed
        console.error("Failed to send message");
      } else {
        // Refresh conversations to update the last_message snippet
        fetchConversations();
      }
    } catch (err) {
      console.error("Send error", err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <div className="container" style={{ padding: '24px 24px 0 24px', paddingTop: '80px' }}>
        <RouterLink to="/dashboard" className="back-link" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)' }}>
          <ArrowLeft size={18} style={{ marginRight: '8px' }} /> Back to Dashboard
        </RouterLink>
      </div>
      
      <div className="messages-layout glass-panel">
        
        {/* Sidebar */}
        <aside className="conversations-sidebar">
          <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <h2 className="h2 flex-center" style={{ justifyContent: 'flex-start', gap: '8px' }}>
              <MessageSquare size={24} color="var(--accent-purple)" /> Messages
            </h2>
          </div>
          
          <div className="conversations-list">
            {isLoadingChats ? (
              <div className="flex-center" style={{ padding: '40px' }}><div className="pulsing-circle"></div></div>
            ) : (
              <>
                {/* Milliena Quick Access */}
                <div 
                  className="conversation-item"
                  onClick={() => window.dispatchEvent(new Event('open-milliena-chat'))}
                  style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.1)', marginBottom: '16px' }}
                >
                  <div className="avatar-wrapper" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="h3 text-white">✨</span>
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <h4 className="font-medium text-white">Milliena AI</h4>
                    <p className="p-small" style={{ color: '#F59E0B' }}>Chat with your AI Mentor</p>
                  </div>
                </div>

                {conversations.length === 0 ? (
                  <p className="p-medium text-muted" style={{ textAlign: 'center', marginTop: '20px' }}>No peer conversations yet.</p>
                ) : (
                  conversations.map(c => (
                    <div 
                      key={c.id} 
                      className={`conversation-item ${activeChat?.id === c.id ? 'active' : ''}`}
                      onClick={() => setActiveChat(c)}
                    >
                  <div className="avatar-wrapper" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-navy)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {c.profile_picture ? (
                      <img src={c.profile_picture} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span className="h3 text-white">{c.name ? c.name[0].toUpperCase() : 'U'}</span>
                    )}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <h4 className="font-medium text-white" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</h4>
                    <p className="p-small text-muted" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '4px' }}>
                      {c.last_message}
                    </p>
                  </div>
                </div>
              ))
            )}
              </>
            )}
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="chat-area">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <header className="chat-header">
                <div className="avatar-wrapper" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-navy)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {activeChat.profile_picture ? (
                    <img src={activeChat.profile_picture} alt={activeChat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span className="font-medium text-white">{activeChat.name ? activeChat.name[0].toUpperCase() : 'U'}</span>
                  )}
                </div>
                <div>
                  <h3 className="h3">{activeChat.name}</h3>
                  <RouterLink to={`/u/${activeChat.id}`} className="p-small" style={{ color: 'var(--accent-blue)' }}>View Public Profile</RouterLink>
                </div>
              </header>

              {/* Chat Messages */}
              <div className="chat-messages">
                {messages.length === 0 ? (
                  <div className="flex-center" style={{ height: '100%', flexDirection: 'column', color: 'var(--text-muted)' }}>
                    <p className="p-medium">Start the conversation with {activeChat.name}</p>
                    <p className="p-small">Say hi and share your goals! ✨</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isSentByMe = msg.sender_id == user.id;
                    return (
                      <div key={msg.id || idx} className={`message-bubble ${isSentByMe ? 'sent' : 'received'}`}>
                        {msg.content}
                        <span className="message-time">{formatTime(msg.timestamp)}</span>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <form className="chat-input-container" onSubmit={sendMessage}>
                <input 
                  type="text" 
                  className="chat-input" 
                  placeholder={`Message ${activeChat.name}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button type="submit" className="send-button" disabled={!inputText.trim()}>
                  <Send size={20} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-center" style={{ height: '100%', flexDirection: 'column', color: 'var(--text-muted)', background: 'rgba(10, 15, 30, 0.2)' }}>
              <MessageSquare size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
              <h2 className="h2 text-white">Your Network</h2>
              <p className="p-medium text-muted" style={{ maxWidth: '300px', textAlign: 'center', marginTop: '8px' }}>Select a conversation from the left or connect with new peers.</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
