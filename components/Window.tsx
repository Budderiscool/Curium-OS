
import React, { useState, useRef, useEffect } from 'react';
import { WindowState } from '../types';

interface Props {
  state: WindowState;
  isActive: boolean;
  accentColor: string;
  glassOpacity: number;
  onClose: () => void;
  onFocus: () => void;
  onUpdate: (state: WindowState) => void;
  children: React.ReactNode;
}

const Window: React.FC<Props> = ({ state, isActive, accentColor, glassOpacity, onClose, onFocus, onUpdate, children }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ width: 0, height: 0, x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    onFocus();
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - state.x, y: e.clientY - state.y };
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFocus();
    setIsResizing(true);
    resizeStart.current = { 
      width: state.width, 
      height: state.height, 
      x: e.clientX, 
      y: e.clientY 
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        let nextX = e.clientX - dragStart.current.x;
        let nextY = e.clientY - dragStart.current.y;

        // Clamp to screen bounds
        nextX = Math.max(0, Math.min(nextX, window.innerWidth - state.width));
        nextY = Math.max(0, Math.min(nextY, window.innerHeight - 60)); // Keep title bar visible above taskbar area

        onUpdate({
          ...state,
          x: nextX,
          y: nextY
        });
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.current.x;
        const deltaY = e.clientY - resizeStart.current.y;
        
        let nextWidth = Math.max(300, resizeStart.current.width + deltaX);
        let nextHeight = Math.max(200, resizeStart.current.height + deltaY);

        // Prevent resizing off-screen
        nextWidth = Math.min(nextWidth, window.innerWidth - state.x);
        nextHeight = Math.min(nextHeight, window.innerHeight - state.y - 40);

        onUpdate({
          ...state,
          width: nextWidth,
          height: nextHeight
        });
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, state, onUpdate]);

  if (state.isMinimized) return null;

  return (
    <div 
      className={`absolute flex flex-col border rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ease-out ${isActive ? 'shadow-indigo-500/10' : 'shadow-black/50'}`}
      style={{
        left: state.x,
        top: state.y,
        width: state.width,
        height: state.height,
        zIndex: state.zIndex,
        backgroundColor: `rgba(15, 15, 15, ${glassOpacity})`,
        backdropFilter: `blur(${glassOpacity * 40}px)`,
        borderColor: isActive ? `${accentColor}55` : 'rgba(255,255,255,0.08)'
      }}
      onClick={onFocus}
    >
      {/* Window Title Bar */}
      <div 
        className={`h-12 flex items-center justify-between px-5 cursor-default select-none border-b border-white/5 transition-colors ${isActive ? 'bg-white/5' : 'bg-transparent'}`}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-3">
          <i className={`fas ${state.icon} text-sm`} style={{ color: isActive ? accentColor : 'rgba(255,255,255,0.3)' }}></i>
          <span className={`text-[11px] font-black uppercase tracking-widest truncate max-w-[200px] ${isActive ? 'text-white' : 'text-white/40'}`}>
            {state.title}
          </span>
        </div>
        <div className="window-controls flex items-center gap-4">
          <button 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all"
            onClick={(e) => { e.stopPropagation(); onUpdate({ ...state, isMinimized: true }); }}
          >
            <i className="fas fa-minus text-[10px]"></i>
          </button>
          <button 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400/40 hover:text-red-400 hover:bg-red-400/10 transition-all"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
          >
            <i className="fas fa-times text-[10px]"></i>
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-auto bg-transparent relative">
        {children}
      </div>

      {/* Resize Handle */}
      <div 
        className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize flex items-end justify-end p-1 group z-[10010]"
        onMouseDown={handleResizeStart}
      >
        <div className="w-1.5 h-1.5 bg-white/20 rounded-full group-hover:bg-white/50 transition-colors"></div>
      </div>
    </div>
  );
};

export default Window;
