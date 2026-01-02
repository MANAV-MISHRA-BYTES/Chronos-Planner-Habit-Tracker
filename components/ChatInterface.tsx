
import React, { useState, useRef, useEffect } from 'react';
import { getAIAdvice } from '../services/geminiService';
import { Task, ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  tasks: Task[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ tasks }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '### Welcome to your Strategic Command Center\n\nI am your **AI Productivity Coach**. I have analyzed your schedule and I am ready to help you optimize your flow. \n\nHow can I assist you in mastering your time today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    const aiResponse = await getAIAdvice(userMsg, tasks);
    setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[700px] bg-white border border-slate-100 rounded-[40px] shadow-2xl shadow-slate-200/50 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 rotate-6">
            <i className="fas fa-brain text-xl"></i>
          </div>
          <div>
            <h3 className="font-black text-slate-800 text-lg tracking-tight">AI Strategist</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Neural Link Active</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setMessages([{ role: 'model', text: 'Context reset. How can we re-strategize?' }])}
          className="w-10 h-10 rounded-xl hover:bg-white hover:shadow-md text-slate-400 hover:text-blue-600 transition-all"
        >
          <i className="fas fa-redo"></i>
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#fafbfc]/30">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] p-6 rounded-[30px] shadow-sm ${
              msg.role === 'user' 
                ? 'bg-slate-900 text-white rounded-br-none shadow-slate-200' 
                : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none shadow-slate-100'
            }`}>
              <div className={`prose-custom ${msg.role === 'user' ? 'text-white' : 'text-slate-700'}`}>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="bg-white border border-slate-100 p-6 rounded-[30px] rounded-bl-none shadow-sm flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Strategizing</span>
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t border-slate-50">
        <div className="relative flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe your productivity bottleneck..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-[24px] px-8 py-5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="absolute right-2 w-12 h-12 bg-blue-600 text-white rounded-[18px] flex items-center justify-center hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/40 disabled:opacity-50 active:scale-90"
          >
            <i className="fas fa-arrow-up"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
