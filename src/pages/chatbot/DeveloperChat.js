import React, { useRef, useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { FaCode, FaPaperclip } from 'react-icons/fa';
import './DualChatbot.css';

const getInitialMessages = (projectInfo) => {
  if (projectInfo.projectId) {
    return [
      { from: 'bot', text: `Hello! I'm here to help you with your project "${projectInfo.projectName}". You can ask me questions about development, code review, or upload files for analysis.` },
    ];
  }
  return [
    { from: 'bot', text: 'Upload your code file or ask a developer question.' },
    { from: 'user', text: 'Can you review my code?' },
    { from: 'bot', text: 'Sure! Please upload your file.' },
  ];
};

const DeveloperChat = ({ projectInfo = {} }) => {
  const [messages, setMessages] = useState(getInitialMessages(projectInfo));
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem('chatHistory_web_designing_prototyping');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every(item => item.fullChat)) {
          return parsed;
        }
      } catch (e) {}
    }
    return [
      {
        id: 1,
        summary: getInitialMessages(projectInfo).find(m => m.from === 'user')?.text || '',
        fullChat: getInitialMessages(projectInfo),
      },
    ];
  });
  const [historyOpen, setHistoryOpen] = useState(true);
  const chatEndRef = useRef(null);
  const [sessionActive, setSessionActive] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('chatHistory_web_designing_prototyping', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const handleSend = (text = input) => {
    if (text.trim() === '') return;
    const newMessages = [...messages, { from: 'user', text }];
    setMessages(newMessages);
    setInput('');
    setSessionActive(true);
    setTimeout(() => {
      const botReply = { from: 'bot', text: "I'm just a demo bot!" };
      const updatedMessages = [...newMessages, botReply];
      setMessages(updatedMessages);
      if (!sessionActive) {
        // New session: create new history item
        setChatHistory(prev => [
          ...prev,
          {
            id: Date.now(),
            summary: text, // First user message as heading
            fullChat: updatedMessages,
          },
        ]);
      } else {
        // Update last history item's fullChat
        setChatHistory(prev =>
          prev.length === 0
            ? prev
            : prev.map((chat, idx) =>
                idx === prev.length - 1
                  ? { ...chat, fullChat: updatedMessages }
                  : chat
              )
        );
      }
    }, 800);
  };

  const handleNewChat = () => {
    setMessages(getInitialMessages(projectInfo));
    setSessionActive(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleHistoryClick = (chat) => {
    setMessages(chat.fullChat);
  };

  const handleHistoryDelete = (id) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== id));
  };

  const panelClass = 'web-chatbot-history-panel';
  const panelTitle = 'Web Chatbot History';

  return (
    <div className="chatbot-layout">
      {/* Main Chat Area */}
      <div className={`chatbot-container developer-chat-card${historyOpen ? ' with-history' : ' full-width'}`}> 
        <Card className="chatbot-card developer-chat-card">
          <Card.Header className="d-flex align-items-center">
            <FaCode className="me-2" /> <span>Web Designing Prototyping</span>
          </Card.Header>
          {projectInfo.projectId && (
            <div className="project-info-banner" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '12px 20px',
              fontSize: '14px',
              borderBottom: '1px solid #e9ecef'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>Project:</strong> {projectInfo.projectName || 'Unknown Project'}
                  {projectInfo.projectId && <span style={{ marginLeft: '10px', opacity: 0.8 }}>(ID: {projectInfo.projectId})</span>}
                </div>
                <button 
                  onClick={() => window.history.back()}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Back to Project
                </button>
              </div>
            </div>
          )}
          <Card.Body className="chat-history">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-bubble ${msg.from}`}>{msg.text}</div>
            ))}
            <div ref={chatEndRef} />
          </Card.Body>
          <Card.Footer>
            <div className="chatbot-input-area">
              <div className="input-wrapper">
                <button className="attach-btn">
                  <FaPaperclip />
                </button>
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button className="send-btn" onClick={() => handleSend()}>
                  Send
                </button>
              </div>
            </div>
          </Card.Footer>
        </Card>
      </div>
      {/* Chat History Sidebar */}
      <div className={`history-panel${historyOpen ? '' : ' closed'}`}> 
        <div className="panel-header">
          <h3>{panelTitle}</h3>
          <button
            className="history-toggle-btn"
            onClick={() => setHistoryOpen(false)}
            title="Close history panel"
            aria-label="Close history panel"
          >
            &rarr;
          </button>
        </div>
        <div className="history-list">
          {chatHistory.length === 0 ? (
            <p style={{ color: '#888', fontStyle: 'italic' }}>No previous chats</p>
          ) : (
            chatHistory.map((chat) => (
              <div
                key={chat.id}
                className={`history-item${messages === chat.fullChat ? ' selected' : ''}`}
                onClick={() => handleHistoryClick(chat)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <span className="history-summary">{chat.summary}</span>
                <button
                  className="history-delete-btn"
                  onClick={e => { e.stopPropagation(); handleHistoryDelete(chat.id); }}
                  title="Delete chat"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Show open button when panel is closed */}
      {!historyOpen && (
        <button
          className="history-toggle-btn open-panel-btn"
          onClick={() => setHistoryOpen(true)}
          title="Open history panel"
          aria-label="Open history panel"
        >
          &larr;
        </button>
      )}
    </div>
  );
};

export default DeveloperChat; 
