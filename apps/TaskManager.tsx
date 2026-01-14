import React, { useState, useEffect } from 'react';

const TaskManager: React.FC = () => {
  const [cpuUsage, setCpuUsage] = useState<Record<string, number>>({
    'Kernel Runtime': 0.2,
    'Shell UI': 1.5,
    'VFS Manager': 0.1,
    'UI Handler': 0.8
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(key => {
          next[key] = Math.max(0.1, Math.min(15, next[key] + (Math.random() - 0.5)));
        });
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const killProcess = (name: string) => {
    if (name === 'UI Handler') {
      if (confirm("Killing 'UI Handler' will cause graphical instability and UI freezing. Continue?")) {
        window.dispatchEvent(new CustomEvent('curium_ui_kill'));
      }
    } else {
      alert(`Cannot kill ${name}: Access Denied.`);
    }
  };

  return (
    <div className="h-full bg-[#0d0d0d] flex flex-col p-6">
      <div className="mb-6 flex items-center justify-between">
         <h2 className="text-xl font-black uppercase tracking-tighter">System Processes</h2>
         <div className="flex gap-4">
            <div className="flex flex-col items-end">
               <span className="text-[10px] text-white/30 font-bold uppercase">CPU Load</span>
               <span className="text-xs font-mono text-indigo-400">
                  {/* Fixed line 42: Added explicit type annotation to satisfy TypeScript's strict mode */}
                  {(Object.values(cpuUsage) as number[]).reduce((a: number, b: number) => a + b, 0).toFixed(1)}%
               </span>
            </div>
         </div>
      </div>
      
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-xs text-left">
          <thead className="bg-white/10 text-white/40 uppercase font-black tracking-widest text-[9px]">
            <tr>
              <th className="px-6 py-4">Process Name</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">CPU Usage</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-white/80">
            {/* Fixed line 66: Added type cast for Object.entries to ensure 'cpu' is recognized as a number */}
            {(Object.entries(cpuUsage) as [string, number][]).map(([name, cpu]) => (
              <tr key={name} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4 flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
                   <span className="font-bold">{name}</span>
                </td>
                <td className="px-6 py-4 text-emerald-400 font-medium">Running</td>
                <td className="px-6 py-4 font-mono">{cpu.toFixed(1)}%</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => killProcess(name)}
                    className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-red-500 hover:text-white transition-all"
                  >
                    Kill
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-auto p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
         <p className="text-[10px] text-white/20 italic">Note: Termination of core UI components may result in system state desynchronization.</p>
      </div>
    </div>
  );
};

export default TaskManager;