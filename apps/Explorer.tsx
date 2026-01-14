import React, { useState, useEffect } from 'react';
import { fs } from '../services/FileSystem';
import { VFile, FileType } from '../types';
import { kernel } from '../services/Kernel';

interface Props {
  initialPath?: string;
  onLaunchApp?: (id: string) => void;
}

const Explorer: React.FC<Props> = ({ initialPath = '/', onLaunchApp }) => {
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [files, setFiles] = useState<VFile[]>([]);
  const [history, setHistory] = useState<string[]>([initialPath]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const user = kernel.getCurrentUser();

  const sidebarLinks = [
    { label: 'Root (/)', path: '/', icon: 'fa-hard-drive' },
    { label: 'Desktop', path: '/home/user/desktop', icon: 'fa-desktop' },
    { label: 'Documents', path: '/home/user/documents', icon: 'fa-file-lines' },
    { label: 'System', path: '/sys', icon: 'fa-microchip' },
    { label: 'Configuration', path: '/etc', icon: 'fa-gears' },
  ];

  useEffect(() => {
    const updateFiles = () => {
      setFiles(fs.getFilesInDirectory(currentPath));
    };
    updateFiles();
    window.addEventListener('curium_fs_changed', updateFiles);
    return () => window.removeEventListener('curium_fs_changed', updateFiles);
  }, [currentPath]);

  const navigateTo = (path: string, addToHistory = true) => {
    setCurrentPath(path);
    if (addToHistory) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(path);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(history[historyIndex - 1]);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPath(history[historyIndex + 1]);
    }
  };

  const handleParent = () => {
    if (currentPath === '/') return;
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    navigateTo('/' + parts.join('/'));
  };

  const handleOpen = (file: VFile) => {
    if (file.type === FileType.DIRECTORY) {
      navigateTo(file.path);
    } else if (file.type === FileType.APP && onLaunchApp && file.content) {
      onLaunchApp(file.content);
    } else if (file.type === FileType.FILE || file.type === FileType.SYSTEM) {
      // Logic for opening in Editor could go here
      if (onLaunchApp) onLaunchApp('editor');
    }
  };

  const handleDelete = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    const file = fs.getFile(path);
    if (file?.isCritical) {
      if (!confirm("WARNING: This is a critical system file. Deleting it will cause permanent system instability. Proceed?")) {
        return;
      }
    } else {
      if (!confirm(`Are you sure you want to delete ${path}?`)) return;
    }
    fs.deleteFile(path);
  };

  const breadcrumbs = currentPath.split('/').filter(Boolean);
  const accentColor = user?.settings.accentColor || '#6366f1';

  return (
    <div className="h-full bg-[#0d0d0d] text-white flex select-none overflow-hidden">
      {/* Sidebar */}
      <div className="w-56 border-r border-white/5 bg-black/40 p-4 flex flex-col gap-6 shrink-0">
        <div className="px-3">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-4">Quick Access</h3>
          <div className="space-y-1">
            {sidebarLinks.map(link => (
              <button
                key={link.path}
                onClick={() => navigateTo(link.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all ${
                  currentPath === link.path ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/5 hover:text-white'
                }`}
                style={currentPath === link.path ? { borderLeft: `3px solid ${accentColor}` } : {}}
              >
                <i className={`fas ${link.icon} w-4 text-[10px]`}></i>
                <span className="truncate">{link.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="px-3 mt-auto">
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
             <div className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-2">Storage Usage</div>
             <div className="h-1 bg-white/5 rounded-full overflow-hidden">
               <div className="h-full bg-emerald-500 w-[12%] shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
             </div>
             <div className="text-[8px] mt-2 text-white/10 font-mono">5.0 MB Capacity</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navigation Toolbar */}
        <div className="flex items-center gap-3 p-4 bg-white/5 border-b border-white/10 backdrop-blur-xl">
          <div className="flex gap-1">
            <button 
              onClick={handleBack}
              disabled={historyIndex === 0}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/10 disabled:opacity-20"
            >
              <i className="fas fa-arrow-left text-[10px]"></i>
            </button>
            <button 
              onClick={handleForward}
              disabled={historyIndex >= history.length - 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/10 disabled:opacity-20"
            >
              <i className="fas fa-arrow-right text-[10px]"></i>
            </button>
            <button 
              onClick={handleParent}
              disabled={currentPath === '/'}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/10 disabled:opacity-20"
            >
              <i className="fas fa-arrow-up text-[10px]"></i>
            </button>
          </div>
          
          <div className="flex-1 flex items-center bg-black/60 border border-white/10 rounded-xl px-4 h-9 text-[10px] font-mono gap-3 overflow-hidden">
            <i className="fas fa-hdd text-white/20"></i>
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide whitespace-nowrap">
              <span className="text-white/40 cursor-pointer hover:text-white" onClick={() => navigateTo('/')}>root</span>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  <i className="fas fa-chevron-right text-[8px] opacity-10"></i>
                  <span className="hover:text-indigo-400 cursor-pointer text-white/80" onClick={() => navigateTo('/' + breadcrumbs.slice(0, idx + 1).join('/'))}>
                    {crumb}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="relative group">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-white/20 text-[10px]"></i>
            <input 
              placeholder="Search..."
              className="w-48 bg-white/5 border border-white/10 rounded-xl h-9 pl-9 pr-4 text-[10px] outline-none focus:border-white/20 transition-all"
            />
          </div>
        </div>
        
        {/* File Grid */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-x-4 gap-y-8">
            {files.length === 0 && (
              <div className="col-span-full py-32 text-center flex flex-col items-center gap-6 opacity-20">
                <i className="fas fa-folder-open text-7xl"></i>
                <div className="space-y-1">
                   <p className="text-sm font-bold uppercase tracking-widest">No Items Found</p>
                   <p className="text-[10px]">This directory is currently empty.</p>
                </div>
              </div>
            )}
            
            {files.map(file => (
              <div 
                key={file.path} 
                onDoubleClick={() => handleOpen(file)}
                className="flex flex-col items-center group p-3 rounded-2xl cursor-default relative transition-all active:scale-95 hover:bg-white/[0.04] border border-transparent hover:border-white/5"
              >
                <div className={`w-16 h-16 flex items-center justify-center text-3xl mb-3 transition-transform group-hover:scale-105 relative ${
                  file.type === FileType.DIRECTORY ? 'text-indigo-400/80' : 
                  file.type === FileType.APP ? 'text-emerald-400/80' :
                  file.isCritical ? 'text-red-500/80' : 'text-blue-400/80'
                }`}>
                  <i className={`fas ${
                    file.type === FileType.DIRECTORY ? 'fa-folder' : 
                    file.type === FileType.APP ? 'fa-rocket' : 
                    file.type === FileType.SYSTEM ? 'fa-shield-halved' : 'fa-file-lines'
                  } drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]`}></i>
                  {file.isCritical && (
                    <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-black"></div>
                  )}
                </div>
                <div className="w-full text-center space-y-0.5">
                  <div className="text-[10px] font-bold truncate w-full px-2 text-white/90">
                    {file.name}
                  </div>
                  <div className="text-[8px] opacity-20 font-black uppercase tracking-widest">{file.type}</div>
                </div>
                
                <button 
                  className="absolute top-1 right-1 w-7 h-7 opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-500 transition-all rounded-lg flex items-center justify-center"
                  onClick={(e) => handleDelete(e, file.path)}
                >
                  <i className="fas fa-trash text-[8px]"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-3 bg-black/60 border-t border-white/10 flex items-center justify-between text-[8px] font-black uppercase tracking-[0.2em] text-white/20 px-6 backdrop-blur-xl">
          <div className="flex gap-6">
            <span>{files.length} Object(s)</span>
            <span>{currentPath}</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></div>
              File System Ready
            </span>
            <span>VFS_PRO_X64</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explorer;