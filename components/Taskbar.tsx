
import React, { useState, useEffect } from 'react';
import { AppManifest, WindowState, User } from '../types';
import { TASKBAR_HEIGHT } from '../constants';
import { kernel } from '../services/Kernel';

interface Props {
  user: User;
  apps: AppManifest[];
  windows: WindowState[];
  activeId: string | null;
  onLaunch: (id: string) => void;
  onFocus: (id: string) => void;
  onStartToggle: (e?: React.MouseEvent) => void;
  isStartOpen: boolean;
}

const Taskbar: React.FC<Props> = ({ user, apps, windows, activeId, onLaunch, onFocus, onStartToggle, isStartOpen }) => {
  const [time, setTime] = useState(new Date());
  const [battery, setBattery] = useState<{level: number, charging: boolean} | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    const updateBattery = (batt: any) => {
      setBattery({ level: Math.round(batt.level * 100), charging: batt.charging });
    };

    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((batt: any) => {
        updateBattery(batt);
        batt.addEventListener('levelchange', () => updateBattery(batt));
        batt.addEventListener('chargingchange', () => updateBattery(batt));
      }).catch(() => {
        // Fallback or silent fail if getBattery fails
        setBattery({ level: 100, charging: true });
      });
    } else {
      setBattery({ level: 100, charging: true });
    }

    return () => clearInterval(timer);
  }, []);

  const pinnedIds = user.settings.pinnedApps || [];
  const runningAppIds = Array.from(new Set(windows.map(w => w.appId)));
  const allTaskbarApps = Array.from(new Set([...pinnedIds, ...runningAppIds]));

  const togglePin = (appId: string) => {
    const isPinned = pinnedIds.includes(appId);
    const newPinned = isPinned 
      ? pinnedIds.filter(id => id !== appId)
      : [...pinnedIds, appId];
    kernel.updateUser({ settings: { ...user.settings, pinnedApps: newPinned } });
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-3xl border-t border-white/10 flex items-center px-4 z-[10002] justify-between shadow-2xl"
      style={{ height: TASKBAR_HEIGHT }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-2 h-full">
        {/* Start Button */}
        <button 
          onClick={(e) => onStartToggle(e)}
          className={`w-12 h-10 rounded-xl flex items-center justify-center transition-all ${isStartOpen ? 'bg-white/20 scale-95' : 'hover:bg-white/10'}`}
          style={{ boxShadow: isStartOpen ? `0 0 15px ${user.settings.accentColor}44` : 'none' }}
        >
          <div className="grid grid-cols-2 gap-0.5 pointer-events-none">
             <div className={`w-2.5 h-2.5 rounded-sm`} style={{ backgroundColor: user.settings.accentColor }}></div>
             <div className="w-2.5 h-2.5 rounded-sm bg-white/40"></div>
             <div className="w-2.5 h-2.5 rounded-sm bg-white/20"></div>
             <div className="w-2.5 h-2.5 rounded-sm bg-white/60"></div>
          </div>
        </button>

        <div className="w-px h-6 bg-white/10 mx-2"></div>

        {/* Taskbar Icons */}
        <div className="flex items-center gap-1.5 h-full py-1">
          {allTaskbarApps.map(id => {
            const app = apps.find(a => a.id === id);
            if (!app) return null;
            const isRunning = runningAppIds.includes(id);
            const isActive = windows.find(w => w.appId === id)?.id === activeId;

            return (
              <button
                key={id}
                onClick={() => {
                  if (isRunning) {
                    const win = windows.find(w => w.appId === id);
                    if (win) onFocus(win.id);
                  } else {
                    onLaunch(id);
                  }
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  togglePin(id);
                }}
                title={`${app.name}${pinnedIds.includes(id) ? ' (Pinned)' : ''}`}
                className={`group relative w-11 h-11 rounded-xl flex items-center justify-center transition-all ${isActive ? 'bg-white/15' : 'hover:bg-white/10'}`}
              >
                <i 
                  className={`fas ${app.icon} text-xl transition-transform group-active:scale-90 ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white'}`}
                  style={{ color: isActive ? user.settings.accentColor : undefined }}
                ></i>
                {isRunning && (
                  <div 
                    className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1 rounded-full transition-all ${isActive ? 'w-4' : 'w-1 bg-white/30'}`}
                    style={{ backgroundColor: isActive ? user.settings.accentColor : undefined }}
                  ></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4 h-full px-2">
        {/* System Info Tray */}
        <div className="flex items-center gap-4 text-white/60 text-xs font-medium">
          {battery && (
            <div className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
              <span className="text-[10px] opacity-60 font-mono">{battery.level}%</span>
              <div className="relative">
                 <i className={`fas ${battery.level > 20 ? 'fa-battery-full' : 'fa-battery-quarter text-red-500'} text-sm`}></i>
                 {battery.charging && <i className="fas fa-bolt absolute -right-1 -top-1 text-[8px] text-yellow-400"></i>}
              </div>
            </div>
          )}
          
          <div className="flex flex-col items-end leading-none py-1 group cursor-default">
            <span className="text-[11px] text-white/90 font-bold">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="text-[9px] opacity-40 mt-1">{time.toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Taskbar;
