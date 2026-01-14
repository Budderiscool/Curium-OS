
import React, { useState } from 'react';
import { kernel } from '../services/Kernel';
import { fs } from '../services/FileSystem';
import { User } from '../types';
import { ACCENT_COLORS } from '../constants';

interface Props {
  installPrompt?: any;
}

const Settings: React.FC<Props> = ({ installPrompt }) => {
  const user = kernel.getCurrentUser();
  const [activeTab, setActiveTab] = useState<'personal' | 'display' | 'time' | 'network' | 'sound' | 'account' | 'storage' | 'system' | 'about'>('personal');

  if (!user) return null;

  const updateSettings = (updates: Partial<User['settings']>) => {
    kernel.updateUser({ settings: { ...user.settings, ...updates } });
  };

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
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
            {/* ... personalization content ... */}
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

        {activeTab === 'about' && (
          <div className="flex flex-col items-center justify-center h-[500px] text-center space-y-12">
             <div className="w-28 h-28 rounded-[2.5rem] flex items-center justify-center shadow-2xl relative" style={{ backgroundColor: user.settings.accentColor }}>
               <i className="fas fa-atom text-6xl text-white"></i>
               <div className="absolute -inset-10 bg-white/5 blur-3xl -z-10 rounded-full animate-pulse"></div>
             </div>
             <div>
               <h2 className="text-6xl font-black tracking-tighter">CuriumOS</h2>
               <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.5em] mt-6">LTS Stable Release</p>
               
               {installPrompt && (
                 <button 
                  onClick={handleInstall}
                  className="mt-10 px-8 py-3 bg-white text-black font-black rounded-full text-[10px] uppercase tracking-[0.2em] hover:scale-110 transition-all shadow-xl"
                 >
                   Download App to Desktop
                 </button>
               )}
               
               <div className="text-[10px] text-white/10 font-mono mt-8 uppercase tracking-widest">© 2025 Curium Systems • Web Application OS v1.2.5</div>
             </div>
          </div>
        )}

        {/* Other tabs follow similar styling... */}
        {activeTab === 'system' && (
          <div className="space-y-10">
            <h2 className="text-3xl font-black tracking-tighter mb-2">System Recovery</h2>
            <button onClick={() => { if(confirm("Permanently wipe?")) kernel.reinstall(); }} className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all">Wipe Partition ID_0</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
