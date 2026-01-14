
import React from 'react';

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
  return (
    <div 
      className="fixed bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl py-1 w-48 z-[10000]"
      style={{ left: x, top: y }}
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
