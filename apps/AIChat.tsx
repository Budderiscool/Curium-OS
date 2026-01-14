import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...messages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })), { role: 'user', parts: [{ text: userMsg }] }],
        config: {
          systemInstruction: "You are the CuriumOS Intelligence System. You are helpful, sleek, and technical. You assist users with their virtual OS tasks and general knowledge."
        }
      });
      
      setMessages(prev => [...prev, { role: 'assistant', text: response.text || "I couldn't process that request." }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Error: System link interrupted. Please check your API configuration." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-[#050505] flex flex-col text-white font-sans overflow-hidden">
      <div className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
        <span className="text-xs font-bold uppercase tracking-widest text-white/60">Curium AI Engine</span>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-20">
            <i className="fas fa-robot text-6xl"></i>
            <p className="text-sm">How can I assist you today?</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white/90'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/10 p-4 rounded-2xl flex gap-1">
              <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-black/40 border-t border-white/10">
        <div className="relative flex items-center">
          <input 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-6 pr-14 text-sm outline-none focus:border-indigo-500 transition-all"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="absolute right-3 p-2 text-indigo-400 hover:text-white transition-colors"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;