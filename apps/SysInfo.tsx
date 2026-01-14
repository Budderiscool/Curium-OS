import React, { useState, useEffect } from 'react';

const SysInfo: React.FC = () => {
  const [cpu, setCpu] = useState(2);
  const [ram, setRam] = useState(4.2);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(prev => Math.max(1, Math.min(100, prev + (Math.random() - 0.5) * 5)));
      setRam(prev => Math.max(3, Math.min(16, prev + (Math.random() - 0.5) * 0.2)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const StatBox = ({ label, value, unit, icon, color }: any) => (
    <div className="bg-white/5 border border-white/5 p-6 rounded-[2.5rem] flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">{label}</span>
        <i className={`fas ${icon} text-lg`} style={{ color }}></i>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-black tracking-tighter">{value.toFixed(1)}</span>
        <span className="text-sm font-bold text-white/20 uppercase">{unit}</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mt-2">
        <div className="h-full transition-all duration-1000" style={{ width: `${(value / (label === 'Memory' ? 16 : 100)) * 100}%`, backgroundColor: color }}></div>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-[#0a0a0a] text-white p-10 overflow-y-auto">
      <div className="flex items-center gap-6 mb-12">
        <div className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center text-white text-4xl shadow-2xl shadow-indigo-600/20">
          <i className="fas fa-microchip"></i>
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tighter leading-none">Curium System</h1>
          <p className="text-white/30 text-xs font-bold uppercase tracking-widest mt-3">LTS Stable • Kernel v1.2.5</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <StatBox label="Processor Load" value={cpu} unit="%" icon="fa-bolt" color="#6366f1" />
        <StatBox label="Memory" value={ram} unit="GB" icon="fa-memory" color="#ec4899" />
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-white/20 px-4">Core Specifications</h3>
        <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] divide-y divide-white/5">
          {[
            { k: 'OS Edition', v: 'CuriumOS Professional' },
            { k: 'Version', v: '2025.01 Build 1A2F' },
            { k: 'Host Browser', v: navigator.userAgent.split(') ')[1]?.split(' ')[0] || 'Webkit' },
            { k: 'GPU Acceleration', v: 'WebGL 2.0 Enabled' },
            { k: 'VFS Layer', v: 'LocalStorage IDB Bridge' }
          ].map(spec => (
            <div key={spec.k} className="flex justify-between items-center p-5 px-8">
              <span className="text-xs text-white/40 font-bold">{spec.k}</span>
              <span className="text-xs text-white/80 font-mono font-bold">{spec.v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SysInfo;