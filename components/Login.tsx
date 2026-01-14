
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface Props {
  user: User;
  onLogin: () => void;
}

const Login: React.FC<Props> = ({ user, onLogin }) => {
  const [password, setPassword] = useState('');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  const handleCloak = () => {
    const win = window.open('about:blank', '_blank');
    if (!win) {
      alert("Popup blocked! Please allow popups to launch Stealth Mode.");
      return;
    }

    const doc = win.document;
    const iframe = doc.createElement('iframe');
    const style = iframe.style;

    doc.title = "Google"; // Common decoy title
    const link = doc.createElement('link');
    link.rel = 'icon';
    link.href = 'https://www.google.com/favicon.ico';
    doc.head.appendChild(link);

    iframe.src = window.location.href;
    style.position = 'fixed';
    style.top = '0';
    style.left = '0';
    style.bottom = '0';
    style.right = '0';
    style.width = '100%';
    style.height = '100%';
    style.border = 'none';
    style.margin = '0';
    style.padding = '0';
    style.overflow = 'hidden';
    style.zIndex = '999999';

    doc.body.style.margin = '0';
    doc.body.style.padding = '0';
    doc.body.appendChild(iframe);
    
    // Optional: close the current tab to "disappear"
    // window.close(); // Most browsers block self-closing unless opened by script
  };

  return (
    <div className="h-screen w-screen bg-cover bg-center flex flex-col justify-between items-center py-20 bg-black animate-in fade-in duration-1000 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80"></div>
      
      <div className="relative text-center space-y-2 mt-12">
        <h1 className="text-8xl font-thin text-white/90">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </h1>
        <p className="text-xl text-white/60 font-light">
          {time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-sm">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 shadow-[0_0_50px_rgba(99,102,241,0.3)]">
          <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center text-3xl font-bold text-white uppercase">
            {user.username.charAt(0)}
          </div>
        </div>
        
        <form onSubmit={handleLogin} className="w-full space-y-4 px-6">
          <h2 className="text-2xl text-white font-semibold text-center">{user.username}</h2>
          <div className="relative group">
            <input 
              autoFocus
              type="password"
              placeholder="Enter Credentials"
              className="w-full bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-4 rounded-2xl text-white text-center outline-none focus:border-indigo-500 transition-all placeholder:text-white/20 focus:bg-white/20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
          </div>
          <button className="hidden" type="submit">Sign In</button>
          
          <div className="flex flex-col items-center gap-6 mt-8">
            <p className="text-[10px] text-white/20 tracking-widest font-bold uppercase">Unlock Session</p>
            
            {/* Cloaker / Clicker Button */}
            <button 
              type="button"
              onClick={handleCloak}
              className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all group"
            >
              <i className="fas fa-mask text-indigo-400 group-hover:scale-110 transition-transform"></i>
              Launch Stealth Mode
            </button>
          </div>
        </form>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4">
        <p className="text-[10px] tracking-[0.3em] text-white/20 uppercase font-black">Curium Operating System • LTS v1.2</p>
        <div className="flex gap-6 text-white/30">
           <i className="fas fa-wifi text-xs hover:text-white transition-colors cursor-help"></i>
           <i className="fas fa-battery-three-quarters text-xs hover:text-emerald-400 transition-colors cursor-help"></i>
           <i className="fas fa-power-off text-xs cursor-pointer hover:text-red-500 transition-all active:scale-90" onClick={() => window.location.reload()}></i>
        </div>
      </div>
    </div>
  );
};

export default Login;
