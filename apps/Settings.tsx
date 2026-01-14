import React, { useState, useEffect } from 'react';
import { kernel } from '../services/Kernel';
import { fs } from '../services/FileSystem';
import { User } from '../types';
import { ACCENT_COLORS, WALLPAPERS } from '../constants';

interface Props {
  installPrompt?: any;
}

const Settings: React.FC<Props> = ({ installPrompt }) => {
  const user = kernel.getCurrentUser();
  const [activeTab, setActiveTab] = useState<'personal' | 'display' | 'time' | 'account' | 'storage' | 'system' | 'about'>('personal');
  const [fsSize, setFsSize] = useState(0);

  useEffect(() => {
    const raw = localStorage.getItem('curium_fs') || '';
    setFsSize(new Blob([raw]).size);
  }, []);

  if (!user) return null;

  const updateSettings = (updates: Partial<User['settings']>) => {
    kernel.updateUser({ settings: { ...user.settings, ...updates } });
  };

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
  };

  const NavButton = ({ id, icon, label }: { id: any, icon: string, label: string }) => (
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
          <NavButton id="account" icon="fa-user-circle" label="Account" />
          <NavButton id="storage" icon="fa-hdd" label="Storage" />
          <NavButton id="system" icon="fa-microchip" label="Recovery" />
          <NavButton id="about" icon="fa-info-circle" label="About" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-12">
        {activeTab === 'personal' && (
          <div className="space-y-12 max-w-4xl animate-in fade-in slide-in-from-right-4">
            <div>
              <h2 className="text-4xl font-black tracking-tighter mb-4">Personalization</h2>
              <p className="text-sm text-white/40 font-medium">Customize your digital environment.</p>
            </div>

            <section className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-white/30 flex items-center gap-4">
                Accent Color <div className="flex-1 h-px bg-white/5"></div>
              </h3>
              <div className="flex flex-wrap gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-[2rem]">
                {ACCENT_COLORS.map(color => (
                  <button key={color} onClick={() => updateSettings({ accentColor: color })} className={`w-12 h-12 rounded-full border-4 transition-all hover:scale-110 active:scale-90 ${user.settings.accentColor === color ? 'border-white scale-110 shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 'border-transparent'}`} style={{ backgroundColor: color }} />
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-white/30 flex items-center gap-4">
                Wallpapers <div className="flex-1 h-px bg-white/5"></div>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-[2rem]">
                {WALLPAPERS.map(url => (
                  <button 
                    key={url} 
                    onClick={() => updateSettings({ wallpaper: url })}
                    className={`aspect-video rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${user.settings.wallpaper === url ? 'border-indigo-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={url} className="w-full h-full object-cover" alt="Wallpaper Option" />
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'display' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-3xl font-black tracking-tighter">Display & Glass</h2>
            <div className="space-y-8 max-w-xl">
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-black tracking-widest text-white/30 block">Glass Opacity ({Math.round(user.settings.glassOpacity * 100)}%)</label>
                <input 
                  type="range" min="0.1" max="1" step="0.05"
                  value={user.settings.glassOpacity}
                  onChange={(e) => updateSettings({ glassOpacity: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold">High Contrast</div>
                  <div className="text-[10px] text-white/30 mt-1 uppercase">Improves accessibility</div>
                </div>
                <input 
                  type="checkbox"
                  checked={user.accessibility.highContrast}
                  onChange={(e) => kernel.updateUser({ accessibility: { ...user.accessibility, highContrast: e.target.checked } })}
                  className="w-6 h-6 rounded-lg accent-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-3xl font-black tracking-tighter">Account Profile</h2>
            <div className="max-w-md p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-indigo-500 mx-auto flex items-center justify-center text-4xl font-black shadow-2xl">
                {user.username.charAt(0)}
              </div>
              <div className="space-y-2">
                <input 
                  className="bg-transparent border-b border-white/10 text-2xl font-black text-center w-full focus:border-indigo-500 outline-none transition-colors"
                  value={user.username}
                  onChange={(e) => kernel.updateUser({ username: e.target.value })}
                />
                <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">Local Administrator</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'storage' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-3xl font-black tracking-tighter">Storage Manager</h2>
            <div className="max-w-md space-y-6">
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-sm font-bold">VFS Usage</span>
                  <span className="text-xs text-white/40 font-mono">{(fsSize / 1024).toFixed(2)} KB / 5 MB</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: `${(fsSize / (5 * 1024 * 1024)) * 100}%` }}></div>
                </div>
                <p className="text-[10px] text-white/20 mt-6 leading-relaxed">Storage is currently handled by browser LocalStorage. Clearing site data will result in permanent loss of all user files.</p>
              </div>
              <button 
                onClick={() => fs.reset()}
                className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Defragment & Purge Caches
              </button>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-12 py-20">
             <div className="w-28 h-28 rounded-[2.5rem] flex items-center justify-center shadow-2xl relative" style={{ backgroundColor: user.settings.accentColor }}>
               <i className="fas fa-atom text-6xl text-white"></i>
               <div className="absolute -inset-10 bg-white/5 blur-3xl -z-10 rounded-full animate-pulse"></div>
             </div>
             <div>
               <h2 className="text-6xl font-black tracking-tighter">CuriumOS</h2>
               <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.5em] mt-6">LTS Stable Release • build 12.0.4</p>
               <div className="text-[10px] text-white/10 font-mono mt-8 uppercase tracking-widest max-w-sm mx-auto">This project is an advanced system simulation built for next-generation edge environments.</div>
             </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-3xl font-black tracking-tighter mb-2 text-red-500">System Recovery</h2>
            <p className="text-sm text-white/40 max-w-xl">Resetting CuriumOS will restore all system binaries and remove user data. This action is irreversible.</p>
            <button onClick={() => { if(confirm("Permanently wipe partition ID_0?")) kernel.reinstall(); }} className="w-full max-w-md py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all">FACTORY RESET CURIUM</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;