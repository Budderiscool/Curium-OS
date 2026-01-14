
import React, { useState, useEffect, useCallback } from 'react';
import { WindowState, AppManifest, User, FileType } from '../types';
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

const Desktop: React.FC<{ user: User, installPrompt: any }> = ({ user, installPrompt }) => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [menu, setMenu] = useState<{ x: number, y: number } | null>(null);
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [desktopFiles, setDesktopFiles] = useState(fs.getFilesInDirectory('/home/user/desktop'));
  const [integrity, setIntegrity] = useState(fs.getIntegrityReport());

  const updateSystemState = useCallback(() => {
    setIntegrity(fs.getIntegrityReport());
    setDesktopFiles(fs.getFilesInDirectory('/home/user/desktop'));
  }, []);

  useEffect(() => {
    window.addEventListener('curium_fs_changed', updateSystemState);
    return () => window.removeEventListener('curium_fs_changed', updateSystemState);
  }, [updateSystemState]);

  const launchApp = (appId: string) => {
    const app = BUILT_IN_APPS.find(a => a.id === appId);
    if (!app) return;

    if (!integrity.hasShell && appId !== 'terminal') {
      alert("CRITICAL ERROR: UI Shell component missing. Run terminal repair.");
      return;
    }

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
      width: appId === 'ai' ? 500 : appId === 'calc' ? 350 : 900,
      height: appId === 'ai' ? 700 : appId === 'calc' ? 500 : 600
    };
    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(newWindow.id);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const focusWindow = (id: string) => {
    setWindows(prev => prev.map(w => ({
      ...w,
      zIndex: w.id === id ? Math.max(...prev.map(win => win.zIndex), APP_Z_START) + 1 : w.zIndex,
      isMinimized: w.id === id ? false : w.isMinimized
    })));
    setActiveWindowId(id);
    setIsStartOpen(false);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenu({ x: e.clientX, y: e.clientY });
  };

  const launchFolder = (path: string) => {
    const appId = 'explorer';
    const existing = windows.find(w => w.appId === appId);
    if (existing) {
      focusWindow(existing.id);
    } else {
      const app = BUILT_IN_APPS.find(a => a.id === appId)!;
      const newWindow: WindowState = {
        id: Math.random().toString(36).substr(2, 9),
        appId: app.id,
        title: `Explorer - ${path}`,
        icon: app.icon,
        isMaximized: false,
        isMinimized: false,
        zIndex: windows.length + APP_Z_START,
        x: 150,
        y: 150,
        width: 800,
        height: 500
      };
      setWindows(prev => [...prev, newWindow]);
      setActiveWindowId(newWindow.id);
    }
  };

  return (
    <div 
      className={`relative h-screen w-screen overflow-hidden bg-cover bg-center select-none transition-all duration-1000 ease-in-out`}
      style={{ 
        backgroundImage: `url(${user.settings.wallpaper})`,
        filter: user.accessibility.highContrast ? 'contrast(1.5) grayscale(0.5)' : 'none'
      }}
      onContextMenu={handleContextMenu}
      onClick={() => { setMenu(null); setIsStartOpen(false); }}
    >
      <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>

      {/* Desktop Icons Container */}
      <div className="relative z-10 p-10 grid grid-flow-col grid-rows-[repeat(auto-fill,120px)] gap-x-6 gap-y-10 w-fit h-full">
        {/* ... existing desktop icons ... */}
        {desktopFiles.map(file => {
          if (file.type !== FileType.APP) return null;
          const app = BUILT_IN_APPS.find(a => a.id === file.content);
          if (!app) return null;
          return (
            <div 
              key={file.path} 
              className="w-24 h-28 flex flex-col items-center justify-center group cursor-pointer hover:bg-white/10 rounded-2xl transition-all active:scale-95"
              onDoubleClick={() => launchApp(app.id)}
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-[1.25rem] bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl group-hover:scale-110 transition-transform">
                <i className={`fas ${app.icon} text-white text-2xl drop-shadow-lg`} style={{ color: user.settings.accentColor }}></i>
              </div>
              <span className="text-white text-[10px] mt-3.5 text-center drop-shadow-md font-black uppercase tracking-widest px-2 truncate w-full">
                {app.name}
              </span>
            </div>
          );
        })}
      </div>

      {windows.map(win => {
        const appInfo = BUILT_IN_APPS.find(a => a.id === win.appId);
        const AppComp = appInfo?.component;
        return (
          <Window 
            key={win.id} 
            state={win} 
            isActive={activeWindowId === win.id}
            accentColor={user.settings.accentColor}
            glassOpacity={user.settings.glassOpacity}
            onClose={() => closeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            onUpdate={(newState) => setWindows(prev => prev.map(w => w.id === win.id ? newState : w))}
          >
            {AppComp && <AppComp installPrompt={installPrompt} launchApp={launchApp} initialPath={win.appId === 'explorer' ? '/home/user/desktop' : undefined} />}
          </Window>
        );
      })}

      <StartMenu 
        user={user} 
        apps={BUILT_IN_APPS} 
        onLaunch={launchApp} 
        isOpen={isStartOpen} 
      />

      <Taskbar 
        user={user}
        apps={BUILT_IN_APPS} 
        windows={windows} 
        activeId={activeWindowId} 
        onLaunch={launchApp}
        onFocus={focusWindow}
        onStartToggle={(e) => {
          e?.stopPropagation();
          setIsStartOpen(!isStartOpen);
        }}
        isStartOpen={isStartOpen}
        installPrompt={installPrompt}
      />

      {menu && (
        <ContextMenu 
          x={menu.x} 
          y={menu.y} 
          items={[
            { label: 'Refresh System', icon: 'fa-sync', action: () => window.location.reload() },
            { label: 'Launch Terminal', icon: 'fa-terminal', action: () => launchApp('terminal') },
            { label: 'Personalization', icon: 'fa-palette', action: () => launchApp('settings') },
            { label: 'Clean Desktop', icon: 'fa-broom', action: () => updateSystemState() },
          ]} 
        />
      )}
    </div>
  );
};

export default Desktop;
