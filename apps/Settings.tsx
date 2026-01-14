import React, { useState } from 'react';
import { kernel } from '../services/Kernel';
import { User } from '../types';
import { ACCENT_COLORS } from '../constants';

const Settings: React.FC = () => {
  const user = kernel.getCurrentUser();
  const [activeTab, setActiveTab] = useState<'personal' | 'display' | 'time' | 'network' | 'sound' | 'system' | 'about'>('personal');
  const [wifi, setWifi] = useState(true);
  const [volume, setVolume] = useState(80);

  if (!user) return null;

  const updateSettings = (updates: Partial<User['settings']>) => {
    kernel.updateUser({ settings: { ...user.settings, ...updates } });
  };

  const NavButton = ({ id, icon, label }: { id: typeof activeTab, icon: string, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full text-left px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-3 ${activeTab === id ? 'bg-white/10 text-white shadow-lg' : 'hover:bg-white/5 text-white/50'}`}
      style={activeTab === id ? { borderLeft: `3px solid ${user.settings.accentColor}` } : {}}
    >
      <i className={`fas ${icon} w-4`}></i> {label}
    </button>
  );

  return (
    <div className="h-full bg-[#0a0a0a] text-white flex overflow-hidden">
      <div className="w-60 border-r border-white/5 bg-black/20 p-6 space-y-1">
        <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black px-3 mb-6">Settings</h3>
        <NavButton id="personal" icon="fa-palette" label="Personalization" />
        <NavButton id="display" icon="fa-desktop" label="Display" />
        <NavButton id="time" icon="fa-clock" label="Time & Language" />
        <NavButton id="network" icon="fa-wifi" label="Networking" />
        <NavButton id="sound" icon="fa-volume-high" label="Sound" />
        <div className="h-px bg-white/5 my-4 mx-3"></div>
        <NavButton id="system" icon="fa-microchip" label="System Recovery" />
        <NavButton id="about" icon="fa-info-circle" label="About OS" />
      </div>

      <div className="flex-1 overflow-y-auto p-10 max-w-4xl mx-auto">
        {activeTab === 'personal' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
            <div>
              <h2 className="text-3xl font-black tracking-tighter mb-2">Personalization</h2>
              <p className="text-sm text-white/40 font-medium">Customize your workspace appearance.</p>
            </div>
            <section className="space-y-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-white/40">Desktop Background</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                  <img src={user.settings.wallpaper} alt="Current" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <button onClick={() => { const url = prompt("Enter URL:", user.settings.wallpaper); if (url) updateSettings({ wallpaper: url }); }} className="px-6 py-2.5 bg-white text-black font-black rounded-xl text-[10px] uppercase tracking-widest">Update Source</button>
                  </div>
                </div>
              </div>
            </section>
            <section className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-white/40">Accent Color</h3>
              <div className="flex flex-wrap gap-4 p-6 bg-white/5 rounded-3xl border border-white/5">
                {ACCENT_COLORS.map(color => (
                  <button key={color} onClick={() => updateSettings({ accentColor: color })} className={`w-12 h-12 rounded-full border-4 transition-all hover:scale-110 active:scale-95 ${user.settings.accentColor === color ? 'border-white scale-110 shadow-xl' : 'border-transparent'}`} style={{ backgroundColor: color }} />
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'display' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
            <div>
              <h2 className="text-3xl font-black tracking-tighter mb-2">Display</h2>
              <p className="text-sm text-white/40 font-medium">Manage resolution and scaling.</p>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-3xl p-8 space-y-8">
               <div className="flex items-center justify-between">
                 <div>
                   <div className="text-sm font-bold">Scaling (DPI)</div>
                   <div className="text-[11px] text-white/30 mt-1">Adjust text and interface size.</div>
                 </div>
                 <select className="bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none">
                   <option>100% (Default)</option>
                   <option>125%</option>
                   <option>150%</option>
                 </select>
               </div>
               <div className="flex items-center justify-between">
                 <div>
                   <div className="text-sm font-bold">Refresh Rate</div>
                   <div className="text-[11px] text-white/30 mt-1">Virtual monitor frequency.</div>
                 </div>
                 <span className="text-xs font-mono font-bold text-emerald-400">144Hz (Locked)</span>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'time' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
            <div>
              <h2 className="text-3xl font-black tracking-tighter mb-2">Time & Date</h2>
              <p className="text-sm text-white/40 font-medium">Synchronize system time.</p>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-3xl p-8 space-y-8">
               <div className="flex items-center justify-between">
                 <div>
                   <div className="text-sm font-bold">Sync Time Automatically</div>
                   <div className="text-[11px] text-white/30 mt-1">Use Curium NTP servers.</div>
                 </div>
                 <button className="w-12 h-6 bg-indigo-600 rounded-full relative"><div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full"></div></button>
               </div>
               <div className="flex items-center justify-between">
                 <div>
                   <div className="text-sm font-bold">Time Zone</div>
                   <div className="text-[11px] text-white/30 mt-1">Determine local time offsets.</div>
                 </div>
                 <span className="text-xs font-bold text-white/60">PST (UTC-08:00)</span>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'network' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
            <div>
              <h2 className="text-3xl font-black tracking-tighter mb-2">Networking</h2>
              <p className="text-sm text-white/40">Manage cloud connectivity.</p>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-3xl p-8 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold">Virtual Wi-Fi</div>
                <div className="text-[11px] text-white/30 mt-1">Connected to CURIUM_NET_2.4G</div>
              </div>
              <button onClick={() => setWifi(!wifi)} className={`w-14 h-7 rounded-full transition-all relative ${wifi ? 'bg-indigo-600 shadow-lg shadow-indigo-600/30' : 'bg-white/10'}`}>
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${wifi ? 'left-8' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'sound' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
            <div>
              <h2 className="text-3xl font-black tracking-tighter mb-2">Sound</h2>
              <p className="text-sm text-white/40">Volume and audio fidelity.</p>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-3xl p-8 space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-white/30">
                  <span>Master Volume</span>
                  <span>{volume}%</span>
                </div>
                <input type="range" value={volume} onChange={(e) => setVolume(parseInt(e.target.value))} className="w-full accent-indigo-500 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
            <div>
              <h2 className="text-3xl font-black tracking-tighter mb-2">System Recovery</h2>
              <p className="text-sm text-white/40 font-medium">Factory reset and deep repair.</p>
            </div>
            <section className="bg-red-500/5 border border-red-500/10 rounded-[2.5rem] p-10 space-y-8">
              <h3 className="text-xl font-black text-red-500 tracking-tight">Erase All Content</h3>
              <p className="text-xs text-white/40 leading-relaxed font-medium">This operation will wipe all user files in /home/user, reset settings, and re-provision kernel binaries. You will lose all locally stored data.</p>
              <button onClick={() => { if(confirm("This will permanently delete your data. Confirm Reset?")) kernel.reinstall(); }} className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-red-600/20 transition-all active:scale-95">Reset System Now</button>
            </section>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="flex flex-col items-center justify-center h-[500px] text-center space-y-10">
             <div className="w-28 h-28 rounded-[2.5rem] flex items-center justify-center shadow-2xl relative" style={{ backgroundColor: user.settings.accentColor }}>
               <i className="fas fa-atom text-6xl text-white"></i>
               <div className="absolute -inset-6 bg-white/5 blur-3xl -z-10 rounded-full animate-pulse"></div>
             </div>
             <div>
               <h2 className="text-5xl font-black tracking-tighter">CuriumOS</h2>
               <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.5em] mt-4">LTS Stable Release</p>
               <div className="text-[9px] text-white/20 font-mono mt-4 uppercase">© 2025 Curium Systems • Web Application OS v1.2.5</div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;