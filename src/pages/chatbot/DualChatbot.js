import React from 'react';
import { useLocation } from 'react-router-dom';
import DeveloperChat from './DeveloperChat';
import './DualChatbot.css';

const DualChatbot = () => {
  const location = useLocation();
  const projectInfo = location.state || {};

  return (
    <div className="dual-chatbot-container">
      <div className="chatbot-content">
        <DeveloperChat projectInfo={projectInfo} />
      </div>
    </div>
  );
};

export default DualChatbot; 
