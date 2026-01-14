import React, { useState, useEffect } from 'react';
import { fs } from '../services/FileSystem';
import { VFile, FileType } from '../types';

interface Props {
  initialPath?: string;
  onLaunchApp?: (id: string) => void;
}

const Explorer: React.FC<Props> = ({ initialPath = '/home/user', onLaunchApp }) => {
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
    if (confirm(`Are you sure you want to delete ${path}?`)) {
      fs.deleteFile(path);
    }
  };

  return (
    <div className="h-full bg-[#0d0d0d] p-4 text-white flex flex-col">
      <div className="flex items-center gap-4 border-b border-white/10 pb-4 mb-4">
        <button 
          onClick={handleBack}
          className={`text-gray-400 hover:text-white transition-colors ${currentPath === '/' ? 'opacity-20 cursor-not-allowed' : ''}`}
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <div className="bg-white/5 px-4 py-1.5 rounded-lg text-xs flex-1 border border-white/10 font-mono overflow-hidden truncate">
          {currentPath}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {files.length === 0 && (
            <div className="col-span-full py-20 text-center opacity-20 italic text-sm">
              This folder is empty
            </div>
          )}
          {files.map(file => (
            <div 
              key={file.path} 
              onDoubleClick={() => handleOpen(file)}
              className="flex flex-col items-center group p-3 hover:bg-white/5 rounded-2xl cursor-default relative transition-all active:scale-95"
            >
              <div className={`w-14 h-14 flex items-center justify-center text-3xl mb-2 transition-transform group-hover:scale-110 ${
                file.type === FileType.DIRECTORY ? 'text-indigo-400' : 
                file.type === FileType.APP ? 'text-emerald-400' :
                file.type === FileType.SYSTEM ? 'text-red-400' : 'text-blue-400'
              }`}>
                <i className={`fas ${
                  file.type === FileType.DIRECTORY ? 'fa-folder' : 
                  file.type === FileType.APP ? 'fa-rocket' : 'fa-file'
                }`}></i>
              </div>
              <span className="text-[10px] font-bold text-center truncate w-full px-1">{file.name}</span>
              
              {!file.isCritical && (
                <button 
                  className="absolute top-1 right-1 p-2 opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-500 transition-all"
                  onClick={(e) => handleDelete(e, file.path)}
                >
                  <i className="fas fa-times text-[10px]"></i>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explorer;