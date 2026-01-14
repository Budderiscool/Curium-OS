
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
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-1">
          <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center text-3xl font-bold text-white uppercase">
            {user.username.charAt(0)}
          </div>
        </div>
        
        <form onSubmit={handleLogin} className="w-full space-y-4">
          <h2 className="text-2xl text-white font-semibold text-center">{user.username}</h2>
          <input 
            autoFocus
            type="password"
            placeholder="Password"
            className="w-full bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-4 rounded-2xl text-white text-center outline-none focus:border-indigo-500 transition-all placeholder:text-white/30"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="hidden" type="submit">Sign In</button>
          <p className="text-[10px] text-white/20 text-center">Press Enter to Login</p>
        </form>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-2">
        <p className="text-[10px] tracking-widest text-white/30 uppercase">Powered by the creators of CeriumOS</p>
        <div className="flex gap-4 text-white/40">
           <i className="fas fa-wifi text-xs"></i>
           <i className="fas fa-battery-three-quarters text-xs"></i>
           <i className="fas fa-power-off text-xs cursor-pointer hover:text-white transition-colors" onClick={() => window.location.reload()}></i>
        </div>
      </div>
    </div>
  );
};

export default Login;
