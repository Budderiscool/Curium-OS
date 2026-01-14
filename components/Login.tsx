
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { fs } from '../services/FileSystem';

interface Props {
  user: User;
  onLogin: () => void;
}

const Login: React.FC<Props> = ({ user, onLogin }) => {
  const [password, setPassword] = useState('');
  const [time, setTime] = useState(new Date());
  const integrity = fs.getIntegrityReport();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  const hasIcons = integrity.hasIcons;
  const hasFonts = integrity.hasFonts;

  return (
    <div className={`h-screen w-screen bg-cover bg-center flex flex-col justify-between items-center py-20 bg-black animate-in fade-in duration-1000 relative ${!hasFonts ? 'system-fonts-missing' : ''}`}>
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
          
          <div className="flex flex-col items-center gap-6 mt-8">
            <p className="text-[10px] text-white/20 tracking-widest font-bold uppercase">Unlock Session</p>
            
            <button 
              type="button"
              className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all group"
            >
              {hasIcons ? (
                <i className="fas fa-mask text-indigo-400 group-hover:scale-110 transition-transform"></i>
              ) : (
                <div className="w-3 h-3 bg-white/10 rounded-sm"></div>
              )}
              Launch Stealth Mode
            </button>
          </div>
        </form>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4">
        <p className="text-[10px] tracking-[0.3em] text-white/20 uppercase font-black">Curium Operating System • LTS v1.2</p>
        <div className="flex gap-6 text-white/30">
           {hasIcons ? <i className="fas fa-wifi text-xs"></i> : <div className="w-3 h-3 bg-white/5"></div>}
           {hasIcons ? <i className="fas fa-battery-three-quarters text-xs"></i> : <div className="w-3 h-3 bg-white/5"></div>}
           {hasIcons ? (
             <i className="fas fa-power-off text-xs cursor-pointer hover:text-red-500" onClick={() => window.location.reload()}></i>
           ) : (
             <div className="w-3 h-3 bg-red-500/20 rounded-full" onClick={() => window.location.reload()}></div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Login;
