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

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Helper function to add emojis to bot responses based on content
  const enhanceWithEmojis = (text) => {
    // Detect message type and add appropriate emojis
    if (text.toLowerCase().includes('sorry') || text.toLowerCase().includes('error')) {
      return `⚠️ ${text}`;
    } else if (text.toLowerCase().includes('thank')) {
      return `🙏 ${text}`;
    } else if (text.toLowerCase().includes('product') || text.toLowerCase().includes('service')) {
      return `🛍️ ${text}`;
    } else if (text.toLowerCase().includes('price') || text.toLowerCase().includes('cost')) {
      return `💰 ${text}`;
    } else if (text.toLowerCase().includes('help') || text.toLowerCase().includes('assist')) {
      return `🤝 ${text}`;
    } else if (text.toLowerCase().includes('would you like to learn more')) {
      return `${text} 📚`;
    } else {
      // Default elegant decorator
      return `✨ ${text}`;
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = input;
    setInput('');
    
    // Add user message to chat
    const updatedMessages = [...messages, { text: userMessage, sender: 'user' }];
    setMessages(updatedMessages);
    setIsLoading(true);
    
    try {
      // Format chat history for the API
      const chatHistory = updatedMessages.map(msg => ({
        text: msg.text,
        sender: msg.sender === 'bot' ? 'model' : 'user'
      }));
      
      // Send chat history for context
      const response = await axios.post(`${server}/bot/chat`, { 
        message: userMessage,
        chatHistory: chatHistory
      });
      
      // Add styled bot response
      setMessages(prev => [...prev, { 
        text: enhanceWithEmojis(response.data.reply), 
        sender: 'bot' 
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        text: '⚠️ I apologize for the inconvenience. Our systems are experiencing a temporary issue. Please try again in a moment.',
        sender: 'bot' 
      }]);
    }
    
    setIsLoading(false);
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
            <h3>✨ Product Assistant ✨</h3>
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