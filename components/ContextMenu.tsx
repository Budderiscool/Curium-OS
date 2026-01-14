
import React, { useLayoutEffect, useRef, useState } from 'react';

interface MenuItem {
  label: string;
  action: () => void;
  icon?: string;
}

interface Props {
  x: number;
  y: number;
  items: MenuItem[];
}

const ContextMenu: React.FC<Props> = ({ x, y, items }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: x, top: y });

  useLayoutEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      let nextX = x;
      let nextY = y;

      // Check right edge
      if (x + rect.width > window.innerWidth) {
        nextX = window.innerWidth - rect.width - 10;
      }
      // Check bottom edge
      if (y + rect.height > window.innerHeight) {
        nextY = window.innerHeight - rect.height - 10;
      }
      
      // Secondary check for top/left just in case
      nextX = Math.max(10, nextX);
      nextY = Math.max(10, nextY);

      setPos({ left: nextX, top: nextY });
    }
  }, [x, y, items.length]);

  return (
    <div 
      ref={menuRef}
      className="fixed bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl py-1 w-48 z-[10000] animate-in fade-in zoom-in-95 duration-100"
      style={{ left: pos.left, top: pos.top }}
      onClick={(e) => e.stopPropagation()}
    >
      {items.map((item, idx) => (
        <button 
          key={idx}
          className="w-full text-left px-4 py-2 hover:bg-indigo-600 text-white text-xs flex items-center gap-3 transition-colors"
          onClick={item.action}
        >
          {item.icon && <i className={`fas ${item.icon} w-4`}></i>}
          {item.label}
        </button>
      ))}
      <div className="h-px bg-white/10 my-1"></div>
      <button 
        className="w-full text-left px-4 py-2 hover:bg-white/10 text-white/50 text-xs flex items-center gap-3"
        disabled
      >
        Properties
      </button>
    </div>
  );
};

export default ContextMenu;
