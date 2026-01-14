
import React, { useState, useEffect } from 'react';
import { fs } from '../services/FileSystem';
import { VFile, FileType } from '../types';

interface Props {
  initialPath?: string;
  onLaunchApp?: (id: string) => void;
}

const Explorer: React.FC<Props> = ({ initialPath = '/', onLaunchApp }) => {
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [files, setFiles] = useState<VFile[]>([]);

  useEffect(() => {
    const updateFiles = () => {
      setFiles(fs.getFilesInDirectory(currentPath));
    };
    updateFiles();
    window.addEventListener('curium_fs_changed', updateFiles);
    return () => window.removeEventListener('curium_fs_changed', updateFiles);
  }, [currentPath]);

  const handleBack = () => {
    if (currentPath === '/') return;
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    setCurrentPath('/' + parts.join('/'));
  };

  const handleOpen = (file: VFile) => {
    if (file.type === FileType.DIRECTORY) {
      setCurrentPath(file.path);
    } else if (file.type === FileType.APP && onLaunchApp && file.content) {
      onLaunchApp(file.content);
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

  return (
    <div className="h-full bg-[#0d0d0d] p-0 text-white flex flex-col select-none">
      {/* Navigation Toolbar */}
      <div className="flex items-center gap-3 p-4 bg-white/5 border-b border-white/10">
        <button 
          onClick={handleBack}
          disabled={currentPath === '/'}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${currentPath === '/' ? 'opacity-20 bg-white/5' : 'hover:bg-white/10 text-white'}`}
        >
          <i className="fas fa-arrow-left text-xs"></i>
        </button>
        
        <div className="flex-1 flex items-center bg-black/40 border border-white/10 rounded-xl px-4 py-1.5 text-[10px] font-mono gap-2 overflow-hidden">
          <i className="fas fa-hdd text-white/30"></i>
          <span className="text-white/40 cursor-pointer hover:text-white" onClick={() => setCurrentPath('/')}>root</span>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <i className="fas fa-chevron-right text-[8px] opacity-20"></i>
              <span className="hover:text-indigo-400 cursor-pointer" onClick={() => setCurrentPath('/' + breadcrumbs.slice(0, idx + 1).join('/'))}>
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* File Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {files.length === 0 && (
            <div className="col-span-full py-20 text-center flex flex-col items-center gap-4 opacity-20">
              <i className="fas fa-folder-open text-6xl"></i>
              <p className="text-sm font-medium italic">Empty Directory</p>
            </div>
          )}
          
          {files.map(file => (
            <div 
              key={file.path} 
              onDoubleClick={() => handleOpen(file)}
              className="flex flex-col items-center group p-4 hover:bg-white/5 rounded-2xl cursor-default relative transition-all active:scale-95"
            >
              <div className={`w-16 h-16 flex items-center justify-center text-4xl mb-3 transition-transform group-hover:scale-110 relative ${
                file.type === FileType.DIRECTORY ? 'text-indigo-400' : 
                file.type === FileType.APP ? 'text-emerald-400' :
                file.isCritical ? 'text-red-500' : 'text-blue-400'
              }`}>
                <i className={`fas ${
                  file.type === FileType.DIRECTORY ? 'fa-folder' : 
                  file.type === FileType.APP ? 'fa-rocket' : 
                  file.isCritical ? 'fa-shield-virus' : 'fa-file-lines'
                }`}></i>
                {file.isCritical && (
                  <div className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-full border-2 border-black animate-pulse"></div>
                )}
              </div>
              <span className="text-[10px] font-black text-center truncate w-full px-1 uppercase tracking-tighter opacity-80 group-hover:opacity-100">
                {file.name}
              </span>
              <span className="text-[8px] opacity-20 font-mono mt-1 group-hover:opacity-40">{file.type}</span>
              
              <button 
                className="absolute top-2 right-2 p-2 opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-500 transition-all rounded-lg hover:bg-white/5"
                onClick={(e) => handleDelete(e, file.path)}
              >
                <i className="fas fa-trash text-[10px]"></i>
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="p-3 bg-black/40 border-t border-white/5 flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-white/20 px-6">
        <span>{files.length} items in directory</span>
        <span className="flex items-center gap-4">
          <i className="fas fa-microchip"></i>
          VFS_STABLE_001
        </span>
      </div>
    </div>
  );
};

export default Explorer;
