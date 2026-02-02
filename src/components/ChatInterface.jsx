import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './ChatInterface.css';

const API_BASE_URL = 'http://localhost:5000/api';

// Quick suggestions to guide users
const QUICK_SUGGESTIONS = [
  "How many calories in rice?",
  "Is paneer healthy?",
  "Tips for weight loss",
  "High protein foods"
];

function ChatInterface() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! 👋 I\'m your nutrition assistant. Ask me anything about food, calories, or healthy eating!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('nourishai_token');
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-4) // Send last 4 messages for context
        })
      });

      const data = await response.json();
      
      if (data.success && data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Sorry, I couldn\'t process that. Try asking about nutrition! 🥗' 
        }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Connection error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Chat Toggle Button */}
      <button 
        className={`chat-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <Bot size={20} />
            <span>Nutrition Assistant</span>
            <button className="chat-close" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role}`}>
                <div className="message-icon">
                  {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className="message-content">{msg.content}</div>
              </div>
            ))}
            
            {isLoading && (
              <div className="chat-message assistant">
                <div className="message-icon"><Bot size={16} /></div>
                <div className="message-content typing">
                  <Loader size={16} className="spin" /> Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions - only show if few messages */}
          {messages.length < 3 && (
            <div className="chat-suggestions">
              {QUICK_SUGGESTIONS.map((suggestion, idx) => (
                <button
                  key={idx}
                  className="suggestion-chip"
                  onClick={() => sendMessage(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <div className="chat-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about nutrition..."
              disabled={isLoading}
            />
            <button 
              onClick={() => sendMessage()} 
              disabled={!input.trim() || isLoading}
              className="send-btn"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatInterface;
