
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WindowState, AppManifest, User, FileType, OSStatus } from '../types';
import { fs } from '../services/FileSystem';
import { kernel } from '../services/Kernel';
import Window from './Window';
import Taskbar from './Taskbar';
import ContextMenu from './ContextMenu';
import StartMenu from './StartMenu';
import Terminal from '../apps/Terminal';
import Settings from '../apps/Settings';
import Explorer from '../apps/Explorer';
import Editor from '../apps/Editor';
import TaskManager from '../apps/TaskManager';
import Store from '../apps/Store';
import Maps from '../apps/Maps';
import AIChat from '../apps/AIChat';
import Calculator from '../apps/Calculator';
import MediaPlayer from '../apps/MediaPlayer';
import Weather from '../apps/Weather';
import Clock from '../apps/Clock';
import Notes from '../apps/Notes';
import Gallery from '../apps/Gallery';
import SysInfo from '../apps/SysInfo';
import Browser from '../apps/Browser';
import FailureScreen from './FailureScreen';
import { APP_Z_START } from '../constants';

const BUILT_IN_APPS: AppManifest[] = [
  { id: 'terminal', name: 'Terminal', description: 'System command line', icon: 'fa-terminal', component: Terminal },
  { id: 'explorer', name: 'Files', description: 'File browser', icon: 'fa-folder', component: Explorer },
  { id: 'settings', name: 'Settings', description: 'System customization', icon: 'fa-cog', component: Settings },
  { id: 'browser', name: 'Chrome', description: 'Web browser', icon: 'fa-globe', component: Browser },
  { id: 'editor', name: 'Text Editor', description: 'Write and save notes', icon: 'fa-file-lines', component: Editor },
  { id: 'taskmgr', name: 'Task Manager', description: 'System performance', icon: 'fa-chart-line', component: TaskManager },
  { id: 'store', name: 'App Store', description: 'Install system applications', icon: 'fa-shopping-bag', component: Store },
  { id: 'maps', name: 'Maps', description: 'Explore and navigate', icon: 'fa-map-marked-alt', component: Maps },
  { id: 'ai', name: 'AI Assistant', description: 'Curium Intelligence', icon: 'fa-robot', component: AIChat },
  { id: 'calc', name: 'Calculator', description: 'Math utilities', icon: 'fa-calculator', component: Calculator },
  { id: 'media', name: 'Media Player', description: 'Music and visualizer', icon: 'fa-compact-disc', component: MediaPlayer },
  { id: 'weather', name: 'Weather', description: 'Local forecast', icon: 'fa-cloud-sun', component: Weather },
  { id: 'clock', name: 'Clock', description: 'Time utilities', icon: 'fa-clock', component: Clock },
  { id: 'notes', name: 'Notes+', description: 'Advanced document manager', icon: 'fa-sticky-note', component: Notes },
  { id: 'gallery', name: 'Gallery', description: 'Photo & media viewer', icon: 'fa-images', component: Gallery },
  { id: 'sysinfo', name: 'System Info', description: 'Diagnostics & hardware', icon: 'fa-info-circle', component: SysInfo },
];

const SYSTEM_APP_IDS = ['terminal', 'explorer', 'settings', 'taskmgr', 'sysinfo', 'store'];

const Desktop: React.FC<{ user: User, installPrompt: any, corruptionLevel: number }> = ({ user: initialUser, installPrompt, corruptionLevel }) => {
  const [user, setUser] = useState<User>(initialUser);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [menu, setMenu] = useState<{ x: number, y: number } | null>(null);
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [desktopFiles, setDesktopFiles] = useState(fs.getFilesInDirectory('/home/user/desktop'));
  const [integrity, setIntegrity] = useState(fs.getIntegrityReport());
  const [isFrozen, setIsFrozen] = useState(false);
  const [isCrashed, setIsCrashed] = useState(false);
  
  const [selectedPaths, setSelectedPaths] = useState<string[]>([]);
  const desktopRef = useRef<HTMLDivElement>(null);

  const refreshUser = useCallback(() => {
    const updated = kernel.getCurrentUser();
    if (updated) setUser(updated);
  }, []);

  const updateSystemState = useCallback(() => {
    const currentIntegrity = fs.getIntegrityReport();
    setIntegrity(currentIntegrity);
    setDesktopFiles(fs.getFilesInDirectory('/home/user/desktop'));
  }, []);

  useEffect(() => {
    const handleUIKill = () => {
      setIsFrozen(true);
      setTimeout(() => setIsCrashed(true), 3000);
    };

    window.addEventListener('curium_fs_changed', updateSystemState);
    window.addEventListener('curium_user_updated', refreshUser);
    window.addEventListener('curium_ui_kill', handleUIKill);
    
    return () => {
      window.removeEventListener('curium_fs_changed', updateSystemState);
      window.removeEventListener('curium_user_updated', refreshUser);
      window.removeEventListener('curium_ui_kill', handleUIKill);
    };
  }, [updateSystemState, refreshUser]);

  const launchApp = (appId: string) => {
    if (isFrozen) return;
    
    // Check App Manager integrity
    if (!integrity.hasAppManager) {
      alert("FATAL: App Manager service (/sys/bin/app_manager.srv) is missing.");
      return;
    }

    // Check specific app dependencies
    const appIntegrity = fs.checkAppIntegrity(appId);
    if (!appIntegrity.hasIcons || !appIntegrity.hasFonts || !appIntegrity.hasImages) {
      alert(`FATAL: Application '${appId}' is corrupted. Missing critical resources in /sys/apps/${appId}`);
      return;
    }

    const app = BUILT_IN_APPS.find(a => a.id === appId);
    if (!app) return;

    kernel.trackAppUsage(appId);
    setIsStartOpen(false);

    const existing = windows.find(w => w.appId === appId);
    if (existing) {
      focusWindow(existing.id);
      return;
    }

    const newWindow: WindowState = {
      id: Math.random().toString(36).substr(2, 9),
      appId: app.id,
      title: app.name,
      icon: app.icon,
      isMaximized: false,
      isMinimized: false,
      zIndex: windows.length + APP_Z_START,
      x: 100 + (windows.length * 40),
      y: 100 + (windows.length * 40),
      width: 900,
      height: 600
    };
    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(newWindow.id);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const focusWindow = (id: string) => {
    setWindows(prev => {
      const maxZ = Math.max(...prev.map(win => win.zIndex), APP_Z_START);
      return prev.map(w => ({
        ...w,
        zIndex: w.id === id ? maxZ + 1 : w.zIndex,
        isMinimized: w.id === id ? false : w.isMinimized
      }));
    });
    setActiveWindowId(id);
    setIsStartOpen(false);
  };

  if (isCrashed) {
    return <FailureScreen error="UI_HANDLER_TERMINATED" />;
  }

  const desktopStyle: React.CSSProperties = {
    backgroundImage: integrity.hasImages ? `url(${user.settings.wallpaper})` : 'none',
    backgroundColor: integrity.hasImages ? 'transparent' : '#ffffff',
  };

  return (
    <div 
      className={`relative h-screen w-screen overflow-hidden bg-cover bg-center select-none transition-all duration-1000 ${!integrity.hasFonts ? 'system-fonts-missing' : ''} ${isFrozen ? 'cursor-wait pointer-events-none' : ''}`}
      style={desktopStyle}
      onMouseDown={() => { setMenu(null); setIsStartOpen(false); }}
      onContextMenu={(e) => { e.preventDefault(); if (integrity.hasUI && integrity.hasMenu) setMenu({ x: e.clientX, y: e.clientY }); }}
    >
      <div className={`absolute inset-0 bg-black/30 pointer-events-none ${!integrity.hasImages ? 'bg-transparent' : ''}`}></div>

      {integrity.hasUI && (
        <div className="relative z-10 p-10 grid grid-flow-col grid-rows-[repeat(auto-fill,120px)] gap-x-6 gap-y-10 w-fit h-full">
          {desktopFiles.map(file => {
            const app = file.type === FileType.APP ? BUILT_IN_APPS.find(a => a.id === file.content) : null;
            if (!app && file.type !== FileType.DIRECTORY) return null;
            
            const isSystemApp = app && SYSTEM_APP_IDS.includes(app.id);
            const shouldShowIcon = !isSystemApp || (isSystemApp && integrity.hasIcons);

            return (
              <div 
                key={file.path} 
                className="desktop-icon w-24 h-28 flex flex-col items-center justify-center group rounded-2xl transition-all hover:bg-white/10"
                onDoubleClick={() => file.type === FileType.DIRECTORY ? launchApp('explorer') : launchApp(app?.id || '')}
              >
                <div className="w-16 h-16 flex items-center justify-center rounded-[1.25rem] bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl group-hover:scale-110 transition-transform overflow-hidden">
                  {shouldShowIcon ? (
                    <i className={`fas ${file.type === FileType.DIRECTORY ? 'fa-folder' : app?.icon} text-white text-2xl`}></i>
                  ) : (
                    <div className="w-8 h-8 bg-white/5 border border-dashed border-white/10 rounded-md"></div>
                  )}
                </div>
                <span className="text-white text-[10px] mt-3.5 text-center font-black uppercase tracking-widest px-2 truncate w-full">
                  {file.name}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {windows.map(win => {
        const appInfo = BUILT_IN_APPS.find(a => a.id === win.appId);
        const AppComp = appInfo?.component;
        const isSystemWin = SYSTEM_APP_IDS.includes(win.appId);

        return (
          <Window 
            key={win.id} 
            state={win} 
            isActive={activeWindowId === win.id}
            corruptionLevel={corruptionLevel}
            isFrozen={isFrozen || !integrity.hasUI || !integrity.hasWindowHandler}
            integrity={integrity}
            isSystemApp={isSystemWin}
            accentColor={user.settings.accentColor}
            glassOpacity={user.settings.glassOpacity}
            onClose={() => closeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            onUpdate={(newState) => setWindows(prev => prev.map(w => w.id === win.id ? newState : w))}
          >
            <div className="window-content h-full w-full">
              {AppComp && <AppComp runningWindows={windows} launchApp={launchApp} integrity={integrity} initialPath={win.appId === 'explorer' ? '/home/user/desktop' : undefined} />}
            </div>
          </Window>
        );
      })}

      {!isFrozen && integrity.hasUI && (
        <StartMenu user={user} apps={BUILT_IN_APPS} systemAppIds={SYSTEM_APP_IDS} onLaunch={launchApp} isOpen={isStartOpen} integrity={integrity} />
      )}

      {integrity.hasUI && (
        <Taskbar 
          user={user} apps={BUILT_IN_APPS} windows={windows} activeId={activeWindowId} 
          systemAppIds={SYSTEM_APP_IDS} integrity={integrity}
          onLaunch={launchApp} onFocus={focusWindow} onMinimizeAll={() => setWindows(prev => prev.map(w => ({ ...w, isMinimized: true })))}
          onStartToggle={() => setIsStartOpen(!isStartOpen)} isStartOpen={isStartOpen} installPrompt={installPrompt}
        />
      )}
    </div>
  );
};

export default Desktop;
