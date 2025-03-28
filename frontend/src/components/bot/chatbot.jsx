import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './style.css';
import { server } from "../../server";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "✨ Welcome! How may I assist you today? ✨", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const enhanceWithEmojis = (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('sorry') || lowerText.includes('error')) {
      return `⚠️ ${text}`;
    } else if (lowerText.includes('thank')) {
      return `🙏 ${text}`;
    } else if (lowerText.includes('product') || lowerText.includes('service')) {
      return `🛍️ ${text}`;
    } else if (lowerText.includes('price') || lowerText.includes('cost')) {
      return `💰 ${text}`;
    } else if (lowerText.includes('help') || lowerText.includes('assist')) {
      return `🤝 ${text}`;
    } else if (lowerText.includes('learn more')) {
      return `${text} 📚`;
    } else if (lowerText.includes('hello') || lowerText.includes('hi')) {
      return `👋 ${text}`;
    } else {
      return `✨ ${text}`;
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = input;
    setInput('');
    
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setIsLoading(true);

    try {
      const chatHistory = messages.map(msg => ({
        text: msg.text,
        sender: msg.sender === 'bot' ? 'model' : 'user'
      }));
      
      const response = await axios.post(`${server}/bot/chat`, { 
        message: userMessage,
        chatHistory: chatHistory
      });

      // Simulating typing delay before showing bot response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: enhanceWithEmojis(response.data.reply), 
          sender: 'bot' 
        }]);
        setIsLoading(false);
      }, 1000); // 1 second delay for realism
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        text: '⚠️ Oops! There was an issue. Please try again later.',
        sender: 'bot' 
      }]);
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-widget">
      {/* Chat toggle button */}
      <button 
        className="chatbot-toggle" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '💬'}
      </button>
      
      {/* Chatbot container */}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <h3>✨ My Assistant ✨</h3>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="message bot loading">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="chatbot-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <button 
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
