import React, { useState } from 'react';
import { kernel } from '../services/Kernel';
import { fs } from '../services/FileSystem';
import { User } from '../types';
import { ACCENT_COLORS } from '../constants';

const Settings: React.FC = () => {
  const user = kernel.getCurrentUser();
  const [activeTab, setActiveTab] = useState<'personal' | 'display' | 'time' | 'network' | 'sound' | 'account' | 'storage' | 'system' | 'about'>('personal');
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
      <div className="w-64 border-r border-white/5 bg-black/20 p-6 flex flex-col">
        <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black px-3 mb-6">Settings</h3>
        
        <div className="flex-1 space-y-1 overflow-y-auto pr-2 scrollbar-hide">
          <NavButton id="personal" icon="fa-palette" label="Personalization" />
          <NavButton id="display" icon="fa-desktop" label="Display" />
          <NavButton id="time" icon="fa-clock" label="Time & Language" />
          <NavButton id="network" icon="fa-wifi" label="Networking" />
          <NavButton id="sound" icon="fa-volume-high" label="Sound" />
          <div className="h-px bg-white/5 my-4 mx-3"></div>
          <NavButton id="account" icon="fa-user-circle" label="User Account" />
          <NavButton id="storage" icon="fa-hdd" label="Storage Management" />
          <NavButton id="system" icon="fa-microchip" label="System Recovery" />
          <NavButton id="about" icon="fa-info-circle" label="About OS" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-12 max-w-5xl mx-auto">
        {activeTab === 'personal' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4">
            <div>
              <h2 className="text-4xl font-black tracking-tighter mb-4">Personalization</h2>
              <p className="text-sm text-white/40 font-medium">Style your digital environment to match your workflow.</p>
            </div>
            
            <section className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-white/30 flex items-center gap-4">
                Desktop Canvas <div className="flex-1 h-px bg-white/5"></div>
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="relative group aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
                  <img src={user.settings.wallpaper} alt="Current" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                    <button onClick={() => { const url = prompt("Enter Image URL:", user.settings.wallpaper); if (url) updateSettings({ wallpaper: url }); }} className="px-8 py-3 bg-white text-black font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:scale-110 active:scale-95 transition-all">Change Source</button>
                  </div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] flex flex-col justify-center">
                  <p className="text-xs text-white/40 leading-relaxed italic">"A clean desktop is the foundation of a focused mind."</p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-white/30 flex items-center gap-4">
                Interface Accents <div className="flex-1 h-px bg-white/5"></div>
              </h3>
              <div className="flex flex-wrap gap-4 p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                {ACCENT_COLORS.map(color => (
                  <button key={color} onClick={() => updateSettings({ accentColor: color })} className={`w-14 h-14 rounded-full border-[6px] transition-all hover:scale-110 active:scale-90 ${user.settings.accentColor === color ? 'border-white scale-110 shadow-[0_0_30px_rgba(255,255,255,0.2)]' : 'border-transparent'}`} style={{ backgroundColor: color }} />
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4">
             <div>
              <h2 className="text-4xl font-black tracking-tighter mb-4">User Account</h2>
              <p className="text-sm text-white/40 font-medium">Manage your local profile and identity.</p>
            </div>
            
            <div className="flex items-center gap-10 bg-white/[0.02] border border-white/5 p-10 rounded-[3rem]">
               <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center text-5xl font-black shadow-2xl">
                 {user.username.charAt(0).toUpperCase()}
               </div>
               <div className="flex-1 space-y-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-white/20">Display Name</label>
                   <div className="flex gap-4">
                     <input className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-indigo-500 transition-all" value={user.username} readOnly />
                     <button onClick={() => { const n = prompt("New username:"); if(n) kernel.updateUser({username: n}); }} className="px-6 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black tracking-widest transition-all">RENAME</button>
                   </div>
                 </div>
                 <div className="flex gap-4">
                   <div className="px-5 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase">Local Administrator</div>
                   <div className="px-5 py-2 rounded-xl bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase">Standard Shell</div>
                 </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'storage' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4">
            <div>
              <h2 className="text-4xl font-black tracking-tighter mb-4">Storage</h2>
              <p className="text-sm text-white/40 font-medium">Analyze and manage virtual file systems.</p>
            </div>

            <div className="space-y-8">
              <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[3rem] space-y-8">
                <div className="flex justify-between items-end">
                   <div>
                     <h4 className="text-xl font-black tracking-tight">Main Partition (VFS)</h4>
                     <p className="text-xs text-white/30 mt-1 font-medium">Browser LocalStorage Bridge</p>
                   </div>
                   <span className="text-sm font-mono font-bold text-white/60">{fs.getFiles().length} Objects</span>
                </div>
                <div className="h-4 bg-white/5 rounded-full overflow-hidden flex">
                  <div className="h-full bg-indigo-600" style={{ width: '15%' }}></div>
                  <div className="h-full bg-emerald-600" style={{ width: '10%' }}></div>
                  <div className="h-full bg-red-600" style={{ width: '5%' }}></div>
                </div>
                <div className="flex flex-wrap gap-8">
                  <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-indigo-600"></div><span className="text-[10px] font-bold uppercase text-white/40 tracking-widest">Applications</span></div>
                  <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-emerald-600"></div><span className="text-[10px] font-bold uppercase text-white/40 tracking-widest">User Documents</span></div>
                  <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-red-600"></div><span className="text-[10px] font-bold uppercase text-white/40 tracking-widest">System Files</span></div>
                </div>
              </div>

              <button 
                onClick={() => { if(confirm("Clear VFS Cache?")) { localStorage.clear(); window.location.reload(); }}}
                className="w-full py-6 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all border border-red-500/20"
              >
                Flush System Storage
              </button>
            </div>
          </div>
        )}

        {/* ... Other existing tabs (System, About) can remain as they are or be styled similarly ... */}
        {activeTab === 'system' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
            <div>
              <h2 className="text-3xl font-black tracking-tighter mb-2">System Recovery</h2>
              <p className="text-sm text-white/40 font-medium">Deep system repair and factory initialization.</p>
            </div>
            <section className="bg-red-500/5 border border-red-500/10 rounded-[2.5rem] p-10 space-y-8">
              <h3 className="text-xl font-black text-red-500 tracking-tight">Erase All Content</h3>
              <p className="text-xs text-white/40 leading-relaxed font-medium">Warning: This operation will permanently wipe all user data, configuration, and virtual disk contents. System will restart immediately.</p>
              <button onClick={() => { if(confirm("Permanently wipe?")) kernel.reinstall(); }} className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all">Wipe Partition ID_0</button>
            </section>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="flex flex-col items-center justify-center h-[500px] text-center space-y-12">
             <div className="w-28 h-28 rounded-[2.5rem] flex items-center justify-center shadow-2xl relative" style={{ backgroundColor: user.settings.accentColor }}>
               <i className="fas fa-atom text-6xl text-white"></i>
               <div className="absolute -inset-10 bg-white/5 blur-3xl -z-10 rounded-full animate-pulse"></div>
             </div>
             <div>
               <h2 className="text-6xl font-black tracking-tighter">CuriumOS</h2>
               <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.5em] mt-6">LTS Stable Release</p>
               <div className="text-[10px] text-white/10 font-mono mt-8 uppercase tracking-widest">© 2025 Curium Systems • Web Application OS v1.2.5</div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;