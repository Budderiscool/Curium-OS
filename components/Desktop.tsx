import React, { useState, useEffect, useCallback, useRef } from 'react';
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

const Desktop: React.FC<{ user: User, installPrompt: any, corruptionLevel: number }> = ({ user: initialUser, installPrompt, corruptionLevel }) => {
  const [user, setUser] = useState<User>(initialUser);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [menu, setMenu] = useState<{ x: number, y: number } | null>(null);
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [desktopFiles, setDesktopFiles] = useState(fs.getFilesInDirectory('/home/user/desktop'));
  const [integrity, setIntegrity] = useState(fs.getIntegrityReport());
  const [isFrozen, setIsFrozen] = useState(false);
  const [showQuitDialog, setShowQuitDialog] = useState(false);
  
  const [selection, setSelection] = useState<{ startX: number, startY: number, endX: number, endY: number } | null>(null);
  const [selectedPaths, setSelectedPaths] = useState<string[]>([]);
  const desktopRef = useRef<HTMLDivElement>(null);

  const refreshUser = useCallback(() => {
    const updated = kernel.getCurrentUser();
    if (updated) setUser(updated);
  }, []);

  const updateSystemState = useCallback(() => {
    const currentIntegrity = fs.getIntegrityReport();
    setIntegrity(currentIntegrity);
    
    let files = fs.getFilesInDirectory('/home/user/desktop');
    if (corruptionLevel > 0.6) {
      files = files.filter(() => Math.random() > (corruptionLevel - 0.5));
    }
    setDesktopFiles(files);
  }, [corruptionLevel]);

  useEffect(() => {
    const handleUIKill = () => {
      setIsFrozen(true);
      setTimeout(() => setShowQuitDialog(true), 3000);
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
    if (corruptionLevel > 0.4 && Math.random() < (corruptionLevel - 0.3)) return;

    const app = BUILT_IN_APPS.find(a => a.id === appId);
    if (!app) return;
    if (!integrity.hasShell && appId !== 'terminal') return;

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
    if (isFrozen) return;
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const focusWindow = (id: string) => {
    if (isFrozen) return;
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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isFrozen) return;
    if ((e.target as HTMLElement).closest('.window') || (e.target as HTMLElement).closest('.desktop-icon') || (e.target as HTMLElement).closest('.taskbar')) return;
    setMenu(null);
    setIsStartOpen(false);
    setSelectedPaths([]);
    setSelection({
      startX: e.clientX,
      startY: e.clientY,
      endX: e.clientX,
      endY: e.clientY
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isFrozen) return;
    if (selection) {
      setSelection(prev => prev ? { ...prev, endX: e.clientX, endY: e.clientY } : null);
    }
  };

  const handleMouseUp = () => {
    if (isFrozen) return;
    if (selection) {
      const rect = {
        left: Math.min(selection.startX, selection.endX),
        top: Math.min(selection.startY, selection.endY),
        right: Math.max(selection.startX, selection.endX),
        bottom: Math.max(selection.startY, selection.endY)
      };

      const items = document.querySelectorAll('.desktop-icon');
      const selected: string[] = [];
      items.forEach((item: any) => {
        const itemRect = item.getBoundingClientRect();
        if (itemRect.left < rect.right && itemRect.right > rect.left && itemRect.top < rect.bottom && itemRect.bottom > rect.top) {
          selected.push(item.getAttribute('data-path') || '');
        }
      });
      setSelectedPaths(selected);
      setSelection(null);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (isFrozen) {
       e.preventDefault();
       return;
    }
    if ((e.target as HTMLElement).closest('.window-content')) return;
    e.preventDefault();
    if (!integrity.hasMenu) return;
    setMenu({ x: e.clientX, y: e.clientY });
  };

  return (
    <div 
      ref={desktopRef}
      className={`relative h-screen w-screen overflow-hidden bg-cover bg-center select-none transition-all duration-1000 ease-in-out ${!integrity.hasFonts ? 'curium-fonts-missing' : ''} ${isFrozen ? 'cursor-wait pointer-events-none' : ''}`}
      style={{ 
        backgroundImage: `url(${user.settings.wallpaper})`,
        filter: user.accessibility.highContrast ? 'contrast(1.5) grayscale(0.5)' : 'none',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onContextMenu={handleContextMenu}
    >
      <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>

      {selection && (
        <div 
          className="absolute border border-white/40 bg-white/10 backdrop-blur-[2px] z-[10005] pointer-events-none rounded-sm"
          style={{
            left: Math.min(selection.startX, selection.endX),
            top: Math.min(selection.startY, selection.endY),
            width: Math.abs(selection.endX - selection.startX),
            height: Math.abs(selection.endY - selection.startY)
          }}
        />
      )}

      {/* Desktop Icons */}
      <div className="relative z-10 p-10 grid grid-flow-col grid-rows-[repeat(auto-fill,120px)] gap-x-6 gap-y-10 w-fit h-full">
        {desktopFiles.map(file => {
          const app = file.type === FileType.APP ? BUILT_IN_APPS.find(a => a.id === file.content) : null;
          const isDir = file.type === FileType.DIRECTORY;
          if (!app && !isDir) return null;
          
          const icon = isDir ? 'fa-folder' : (app?.icon || 'fa-file');
          const name = isDir ? file.name : (app?.name || file.name);
          const color = isDir ? '#818cf8' : user.settings.accentColor;
          const isSelected = selectedPaths.includes(file.path);

          return (
            <div 
              key={file.path} 
              data-path={file.path}
              className={`desktop-icon w-24 h-28 flex flex-col items-center justify-center group rounded-2xl transition-all ${isSelected ? 'bg-white/20' : 'hover:bg-white/10'}`}
              onDoubleClick={() => isDir ? launchApp('explorer') : launchApp(app?.id || '')}
              onClick={(e) => { e.stopPropagation(); setSelectedPaths([file.path]); }}
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-[1.25rem] bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl group-hover:scale-110 transition-transform overflow-hidden">
                {integrity.hasIcons ? (
                   <i className={`fas ${icon} text-white text-2xl drop-shadow-lg`} style={{ color }}></i>
                ) : (
                   <div className="w-8 h-8 bg-white/10 border border-dashed border-white/20 rounded-md"></div>
                )}
              </div>
              <span className={`text-white text-[10px] mt-3.5 text-center drop-shadow-md font-black uppercase tracking-widest px-2 truncate w-full ${!integrity.hasFonts ? 'text-transparent bg-white/10 rounded' : ''}`}>
                {integrity.hasFonts ? name : '####'}
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
            corruptionLevel={corruptionLevel}
            isFrozen={isFrozen}
            integrity={integrity}
            accentColor={user.settings.accentColor}
            glassOpacity={user.settings.glassOpacity}
            onClose={() => closeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            onUpdate={(newState) => !isFrozen && setWindows(prev => prev.map(w => w.id === win.id ? newState : w))}
          >
            <div className={`window-content h-full w-full ${!integrity.hasFonts ? 'text-transparent' : ''}`}>
              {AppComp && <AppComp installPrompt={installPrompt} launchApp={launchApp} integrity={integrity} initialPath={win.appId === 'explorer' ? '/home/user/desktop' : undefined} />}
            </div>
          </Window>
        );
      })}

      {!isFrozen && (
        <StartMenu user={user} apps={BUILT_IN_APPS} onLaunch={launchApp} isOpen={isStartOpen} integrity={integrity} />
      )}

      <Taskbar 
        user={user} apps={BUILT_IN_APPS} windows={windows} activeId={activeWindowId} 
        onLaunch={launchApp} onFocus={focusWindow} onMinimizeAll={() => !isFrozen && setWindows(prev => prev.map(w => ({ ...w, isMinimized: true })))}
        onStartToggle={(e) => !isFrozen && setIsStartOpen(!isStartOpen)} isStartOpen={isStartOpen} installPrompt={installPrompt} integrity={integrity}
      />

      {menu && integrity.hasMenu && !isFrozen && (
        <ContextMenu x={menu.x} y={menu.y} items={corruptionLevel > 0.7 ? [{ label: 'CRITICAL_ERROR', icon: 'fa-triangle-exclamation', action: () => {} }] : [{ label: 'Refresh', icon: 'fa-sync', action: () => window.location.reload() }]} integrity={integrity} />
      )}

      {/* System Quit Dialog */}
      {showQuitDialog && (
        <div className="fixed inset-0 z-[12000] bg-black/80 backdrop-blur-md flex items-center justify-center pointer-events-auto">
          <div className="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-[2.5rem] p-12 text-center shadow-2xl animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
               <i className="fas fa-triangle-exclamation text-4xl"></i>
            </div>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Curium OS Unexpectedly Quit</h2>
            <p className="text-white/40 text-sm mb-12">The system component 'UI Handler' has stopped responding. All unsaved data may be lost.</p>
            <div className="flex flex-col gap-4">
               <button 
                 onClick={() => window.location.reload()}
                 className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-gray-200 transition-all"
               >
                 Reboot System
               </button>
               <button 
                 onClick={() => kernel.reinstall()}
                 className="w-full py-4 border border-white/10 text-white/40 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
               >
                 Factory Reset
               </button>
            </div>
          </div>
        </div>
      )}

      {!integrity.hasFonts && !isFrozen && (
        <div className="fixed inset-0 z-[11000] bg-black/90 flex flex-col items-center justify-center p-12 text-center font-mono">
           <i className="fas fa-font text-6xl text-red-500 mb-8 animate-pulse"></i>
           <h1 className="text-3xl font-black text-white mb-4">CRITICAL SYSTEM ERROR</h1>
           <p className="text-white/40 text-sm max-w-lg mb-12">The system font rasterizer module has been removed. UI rendering cannot proceed.</p>
           <button onClick={() => kernel.reinstall()} className="px-8 py-4 bg-white text-black font-black uppercase rounded-xl">Emergency Recovery</button>
        </div>
      )}
    </div>
  );
};

export default Desktop;