import React, { useState, useEffect } from 'react';
import { AppManifest, User } from '../types';
import { GoogleGenAI } from "@google/genai";

interface Props {
  user: User;
  apps: AppManifest[];
  onLaunch: (id: string) => void;
  isOpen: boolean;
}

const StartMenu: React.FC<Props> = ({ user, apps, onLaunch, isOpen }) => {
  const [weather, setWeather] = useState<string>("Updating weather...");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const fetchWeather = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: "Provide the current weather for the user's inferred region (e.g., 'Sunny, 24°C'). Keep it to 5 words max.",
          config: { tools: [{ googleSearch: {} }] }
        });
        setWeather(response.text || "Partly Cloudy, 21°C");
      } catch (e) {
        setWeather("Weather unavailable");
      }
    };

    fetchWeather();
  }, [isOpen]);

  if (!isOpen) return null;

  const stats = user.settings.usageStats || {};
  const mostUsed = Object.entries(stats)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 4)
    .map(([id]) => apps.find(a => a.id === id))
    .filter(Boolean) as AppManifest[];

  const filteredApps = apps
    .filter(a => a.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div 
      className="fixed bottom-16 left-4 w-[420px] max-h-[660px] bg-[#0c0c0c]/70 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col z-[10001] animate-in slide-in-from-bottom-12 duration-500 ease-out"
      style={{ boxShadow: `0 30px 60px -12px rgba(0,0,0,0.8), 0 0 20px -5px ${user.settings.accentColor}22` }}
    >
      {/* Dynamic Header */}
      <div className="p-10 pb-6 bg-gradient-to-br from-white/5 to-transparent">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-inner" style={{ backgroundColor: user.settings.accentColor }}>
                {user.username.charAt(0).toUpperCase()}
             </div>
             <div>
               <h2 className="text-xl font-black text-white tracking-tight leading-none">{user.username}</h2>
               <div className="flex items-center gap-2 text-[10px] text-white/30 font-bold uppercase tracking-widest mt-2">
                  <i className="fas fa-cloud-sun text-yellow-400/80"></i>
                  <span>{weather}</span>
               </div>
             </div>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white/20 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
          >
            <i className="fas fa-power-off text-sm"></i>
          </button>
        </div>

        {/* Integrated Search */}
        <div className="relative group">
          <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white transition-colors"></i>
          <input 
            autoFocus
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm text-white outline-none focus:border-white/20 transition-all placeholder:text-white/20"
            placeholder="Type to search Curium..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-10 scrollbar-hide">
        {/* Most Used Apps */}
        {mostUsed.length > 0 && !search && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
            <h3 className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-black mb-5 px-1">Pinned & Popular</h3>
            <div className="grid grid-cols-4 gap-4">
              {mostUsed.map(app => (
                <button 
                  key={app.id}
                  onClick={() => onLaunch(app.id)}
                  className="flex flex-col items-center gap-3 p-3 rounded-2xl hover:bg-white/5 active:scale-95 transition-all group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/60 group-hover:bg-white/10 group-hover:text-white transition-all shadow-xl">
                    <i className={`fas ${app.icon} text-xl`} style={{ color: user.settings.accentColor }}></i>
                  </div>
                  <span className="text-[10px] text-white/50 font-bold truncate w-full text-center group-hover:text-white">{app.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* All Applications */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h3 className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-black mb-5 px-1">
            {search ? 'Search Results' : 'System Library'}
          </h3>
          <div className="grid grid-cols-1 gap-1.5">
            {filteredApps.map(app => (
              <button 
                key={app.id}
                onClick={() => onLaunch(app.id)}
                className="w-full flex items-center gap-5 p-4 rounded-2xl hover:bg-white/5 active:scale-[0.98] transition-all group border border-transparent hover:border-white/5"
              >
                <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-white/30 group-hover:text-white transition-colors shadow-lg">
                  <i className={`fas ${app.icon} text-base`}></i>
                </div>
                <div className="text-left flex-1">
                  <div className="text-xs font-bold text-white/80 group-hover:text-white leading-tight">{app.name}</div>
                  <div className="text-[10px] text-white/20 font-medium mt-1">{app.description}</div>
                </div>
                <i className="fas fa-arrow-right text-[10px] text-white/0 group-hover:text-white/20 transition-all -translate-x-2 group-hover:translate-x-0"></i>
              </button>
            ))}
            {filteredApps.length === 0 && (
              <div className="text-center py-10 text-white/20 text-xs font-medium italic">No matches found in library</div>
            )}
          </div>
        </div>
      </div>

      {/* Persistent Footer */}
      <div className="p-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between px-10">
        <button 
          onClick={() => onLaunch('settings')}
          className="text-[11px] text-white/40 hover:text-white flex items-center gap-2.5 transition-colors font-bold tracking-tight"
        >
          <i className="fas fa-cog text-xs"></i>
          System Management
        </button>
        <div className="text-[10px] text-white/10 font-mono font-bold tracking-tighter">BUILD_2025_LTS</div>
      </div>
    </div>
  );
};

export default StartMenu;