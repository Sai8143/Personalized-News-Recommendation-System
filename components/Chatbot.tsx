
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, Loader2, Info, ExternalLink } from 'lucide-react';
import { NewsArticle } from '../types';
import { chatbotResponse } from '../services/geminiService';

interface Message {
  id: string;
  text: string;
  sender: 'ai' | 'user';
  timestamp: number;
}

interface ChatbotProps {
  activeContext?: NewsArticle | null;
  onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ activeContext, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm SmartNews AI. Ask me anything about India or global news. I'll keep it simple and short!",
      sender: 'ai',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const response = await chatbotResponse(input, activeContext || undefined);

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response,
      sender: 'ai',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, aiMessage]);
    setLoading(false);
  };

  // Function to render text and detect links
  const renderMessageText = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return (
      <div className="space-y-2">
        <p>
          {parts.map((part, i) => {
            if (part.match(urlRegex)) {
              return null; // Handle links separately below for button rendering
            }
            return <span key={i}>{part}</span>;
          })}
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {parts.filter(part => part.match(urlRegex)).map((url, i) => (
            <a 
              key={i} 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors shadow-sm"
            >
              <ExternalLink className="w-3 h-3" />
              Source Link
            </a>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 w-96 max-h-[600px] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm">SmartNews AI Assistant</h3>
            <p className="text-[10px] text-slate-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Fast & Simple
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Context Banner */}
      {activeContext && (
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5" />
          <div>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">Current Context</p>
            <p className="text-xs text-slate-700 line-clamp-1 italic">"{activeContext.title}"</p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 min-h-[300px]"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
              msg.sender === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-tl-none'
            }`}>
              {msg.sender === 'user' ? msg.text : renderMessageText(msg.text)}
              <p className={`text-[9px] mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything..."
            className="flex-1 px-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
