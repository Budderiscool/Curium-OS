import React, { useState, useEffect } from 'react';
import { fs } from '../services/FileSystem';
import { FileType } from '../types';

const APPS_TO_REINSTALL = [
  { id: 'terminal', name: 'Terminal', icon: 'fa-terminal', type: 'Utility' },
  { id: 'explorer', name: 'Files', icon: 'fa-folder', type: 'Utility' },
  { id: 'settings', name: 'Settings', icon: 'fa-cog', type: 'Utility' },
  { id: 'editor', name: 'Text Editor', icon: 'fa-file-lines', type: 'Office' },
  { id: 'store', name: 'App Store', icon: 'fa-shopping-bag', type: 'Utility' },
  { id: 'maps', name: 'Maps', icon: 'fa-map-marked-alt', type: 'Service' },
  { id: 'ai', name: 'AI Assistant', icon: 'fa-robot', type: 'Intelligence' },
  { id: 'calc', name: 'Calculator', icon: 'fa-calculator', type: 'Utility' },
  { id: 'media', name: 'Media Player', icon: 'fa-compact-disc', type: 'Entertainment' },
  { id: 'weather', name: 'Weather', icon: 'fa-cloud-sun', type: 'Service' },
  { id: 'clock', name: 'Clock', icon: 'fa-clock', type: 'Utility' },
];

const Store: React.FC = () => {
  const [installedApps, setInstalledApps] = useState<string[]>([]);

  useEffect(() => {
    const update = () => {
      const desktopFiles = fs.getFilesInDirectory('/home/user/desktop');
      setInstalledApps(desktopFiles.filter(f => f.type === FileType.APP).map(f => f.content || ''));
    };
    update();
    window.addEventListener('curium_fs_changed', update);
    return () => window.removeEventListener('curium_fs_changed', update);
  }, []);

  const reinstall = (id: string, name: string) => {
    const path = `/home/user/desktop/${id}.app`;
    fs.writeFile(path, id, FileType.APP);
    // Explicitly dispatch to ensure immediate UI update across the OS
    window.dispatchEvent(new CustomEvent('curium_fs_changed'));
  };

  return (
    <div className="h-full bg-[#0d0d0d] p-8 text-white overflow-y-auto">
      <h1 className="text-3xl font-black mb-2 tracking-tighter">App Store</h1>
      <p className="text-xs text-white/40 mb-10 font-bold uppercase tracking-widest">Provision and manage Curium system capabilities.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {APPS_TO_REINSTALL.map(app => {
          const isInstalled = installedApps.includes(app.id);
          return (
            <div key={app.id} className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex flex-col gap-6 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-black/40 flex items-center justify-center text-indigo-400 shadow-inner">
                  <i className={`fas ${app.icon} text-2xl`}></i>
                </div>
                <div>
                  <div className="text-sm font-black leading-tight mb-1">{app.name}</div>
                  <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{app.type}</div>
                </div>
              </div>
              
              <button 
                onClick={() => !isInstalled && reinstall(app.id, app.name)}
                disabled={isInstalled}
                className={`w-full py-3.5 rounded-2xl text-[10px] font-black tracking-widest transition-all shadow-xl ${
                  isInstalled 
                  ? 'bg-white/5 text-white/20 cursor-default border border-white/5' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                }`}
              >
                {isInstalled ? 'INSTALLED' : 'PROVISION'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Store;