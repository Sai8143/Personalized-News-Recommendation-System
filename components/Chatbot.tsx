
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
      text: "SmartNews AI here. I give simple, fact-checked answers. Ask me anything about India or the world.",
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

  const renderMessageText = (text: string, sender: 'ai' | 'user') => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return (
      <div className="space-y-2">
        <p className={sender === 'user' ? 'text-black font-medium' : 'text-slate-800'}>
          {parts.map((part, i) => {
            if (part.match(urlRegex)) return null;
            return <span key={i}>{part}</span>;
          })}
        </p>
        {sender === 'ai' && (
          <div className="flex flex-wrap gap-2 pt-1">
            {parts.filter(part => part.match(urlRegex)).map((url, i) => (
              <a 
                key={i} 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm"
              >
                <ExternalLink className="w-3 h-3" />
                Source
              </a>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 w-[400px] h-[600px] flex flex-col bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 z-50 overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
      {/* Header */}
      <div className="p-5 bg-white border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">SmartNews Assistant</h3>
            <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Neural Network Live
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
          <X className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* Context Banner */}
      {activeContext && (
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
            <img src={activeContext.imageUrl} className="w-full h-full object-cover" alt="" />
          </div>
          <div className="flex-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Grounding in Article</p>
            <p className="text-xs text-slate-700 font-bold line-clamp-1">{activeContext.title}</p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fcfcfc]"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl text-sm shadow-sm ${
              msg.sender === 'user' 
                ? 'bg-indigo-50 text-black border border-indigo-100 rounded-tr-none' 
                : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
            }`}>
              {renderMessageText(msg.text, msg.sender)}
              <div className="mt-2 flex items-center justify-between">
                <p className="text-[9px] font-bold text-slate-300">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 p-4 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-3">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce delay-150"></span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Grounded Search...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-slate-50">
        <div className="relative group">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI anything..."
            className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent text-black font-bold placeholder:text-slate-300 rounded-2xl text-sm focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-30 disabled:grayscale transition-all shadow-lg shadow-indigo-100"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center text-[9px] text-slate-300 mt-3 font-bold uppercase tracking-widest">Powered by SmartNews Neural Engine</p>
      </div>
    </div>
  );
};

export default Chatbot;
