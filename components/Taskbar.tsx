
import React, { useState, useEffect } from 'react';
import { AppManifest, WindowState, User } from '../types';
import { TASKBAR_HEIGHT } from '../constants';

interface Props {
  user: User;
  apps: AppManifest[];
  windows: WindowState[];
  activeId: string | null;
  onLaunch: (id: string) => void;
  onFocus: (id: string) => void;
  onStartToggle: (e?: React.MouseEvent) => void;
  isStartOpen: boolean;
  installPrompt: any;
}

const Taskbar: React.FC<Props> = ({ user, apps, windows, activeId, onLaunch, onFocus, onStartToggle, isStartOpen, installPrompt }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pinnedIds = user.settings.pinnedApps || [];
  const runningAppIds = Array.from(new Set(windows.map(w => w.appId)));
  const allTaskbarApps = Array.from(new Set([...pinnedIds, ...runningAppIds]));

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    console.log(`Installation ${outcome}`);
  };

  return (
    <div 
      className="fixed bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-[10002] transition-all duration-500 ease-out"
      style={{ height: TASKBAR_HEIGHT }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Centered Shelf */}
      <div className="flex items-center bg-black/40 backdrop-blur-3xl border border-white/10 rounded-full px-2 py-1.5 shadow-2xl h-full">
        <button 
          onClick={(e) => onStartToggle(e)}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/10 ${isStartOpen ? 'bg-white/20 scale-90' : ''}`}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg active:scale-75 transition-transform">
            <i className="fas fa-atom text-white text-sm"></i>
          </div>
        </button>

        <div className="w-px h-6 bg-white/10 mx-2"></div>

        <div className="flex items-center gap-1.5 px-1">
          {allTaskbarApps.map(appId => {
            const app = apps.find(a => a.id === appId);
            if (!app) return null;
            const isRunning = runningAppIds.includes(appId);
            const isActive = windows.find(w => w.appId === appId)?.id === activeId;
            
            return (
              <button 
                key={appId}
                onClick={() => isRunning ? onFocus(windows.find(w => w.appId === appId)!.id) : onLaunch(appId)}
                className={`relative group w-11 h-11 rounded-xl flex flex-col items-center justify-center transition-all hover:bg-white/10 active:scale-90`}
              >
                <i className={`fas ${app.icon} text-lg transition-all group-hover:scale-110`} style={{ color: isActive ? user.settings.accentColor : 'rgba(255,255,255,0.7)' }}></i>
                {isRunning && (
                  <div className={`absolute bottom-1 w-1 h-1 rounded-full transition-all ${isActive ? 'bg-white w-3' : 'bg-white/30'}`}></div>
                )}
                {/* Tooltip */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 whitespace-nowrap shadow-2xl">
                  {app.name}
                </div>
              </button>
            );
          })}
        </div>

        {installPrompt && (
          <>
            <div className="w-px h-6 bg-white/10 mx-2"></div>
            <button 
              onClick={handleInstall}
              className="w-11 h-11 rounded-full flex items-center justify-center text-blue-400 hover:bg-blue-400/10 transition-all group relative"
            >
              <i className="fas fa-download text-sm"></i>
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 whitespace-nowrap">
                Install CuriumOS
              </div>
            </button>
          </>
        )}
      </div>

      {/* System Tray Pill */}
      <div className="flex items-center bg-black/40 backdrop-blur-3xl border border-white/10 rounded-full px-4 h-full shadow-2xl gap-4 hover:bg-white/5 cursor-pointer transition-colors" onClick={() => onLaunch('settings')}>
         <div className="flex items-center gap-3 text-white/40 text-[10px]">
           <i className="fas fa-wifi"></i>
           <i className="fas fa-battery-full text-emerald-500"></i>
         </div>
         <div className="text-[11px] font-bold text-white/90 font-sans tracking-tight">
           {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
         </div>
      </div>
    </div>
  );
};

export default Taskbar;
