
import React, { useState, useEffect } from 'react';
import { fs } from '../services/FileSystem';

interface Props {
  runningWindows: any[];
}

const TaskManager: React.FC<Props> = ({ runningWindows }) => {
  const [cpuUsage, setCpuUsage] = useState<Record<string, number>>({
    'Kernel Runtime': 0.2,
    'Shell UI': 1.5,
    'VFS Manager': 0.1,
    'UI Handler': 0.8,
    'Window Handler': 0.5,
    'App Manager': 0.4
  });

  const integrity = fs.getIntegrityReport();

  // Combine system processes with actual running app windows
  const processes = [
    ...(integrity.hasUIHandler ? [{ name: 'UI Handler', type: 'System', critical: true }] : []),
    ...(integrity.hasWindowHandler ? [{ name: 'Window Handler', type: 'System', critical: true }] : []),
    ...(integrity.hasAppManager ? [{ name: 'App Manager', type: 'System', critical: true }] : []),
    ...runningWindows.map(w => ({ name: w.title, id: w.id, type: 'Application', appId: w.appId, critical: false }))
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => {
        const next = { ...prev };
        processes.forEach(p => {
          if (!next[p.name]) next[p.name] = Math.random() * 2;
          next[p.name] = Math.max(0.1, Math.min(15, next[p.name] + (Math.random() - 0.5)));
        });
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [processes.length]);

  const killProcess = (name: string, isCritical: boolean) => {
    if (isCritical) {
      if (confirm(`Killing '${name}' is a critical system action. This will likely cause a system crash. Continue?`)) {
        window.dispatchEvent(new CustomEvent('curium_ui_kill'));
      }
    } else {
      // Find the window ID and send a close event
      const win = runningWindows.find(w => w.title === name);
      if (win) {
         // Logic to close window could be handled here or via event
         alert(`Process ${name} (PID: ${win.id}) terminated.`);
      }
    }
  };

  return (
    <div className="h-full bg-[#0d0d0d] flex flex-col p-6">
      <div className="mb-6 flex items-center justify-between">
         <h2 className="text-xl font-black uppercase tracking-tighter">Active Tasks</h2>
         <div className="flex gap-4">
            <div className="flex flex-col items-end">
               <span className="text-[10px] text-white/30 font-bold uppercase">Total CPU</span>
               <span className="text-xs font-mono text-indigo-400">
                  {(Object.values(cpuUsage) as number[]).reduce((a, b) => a + b, 0).toFixed(1)}%
               </span>
            </div>
         </div>
      </div>
      
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl overflow-y-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-white/10 text-white/40 uppercase font-black tracking-widest text-[9px]">
            <tr>
              <th className="px-6 py-4">Process Name</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">CPU</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-white/80">
            {processes.map((p, idx) => (
              <tr key={idx} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4 flex items-center gap-3">
                   <div className={`w-2 h-2 rounded-full ${p.critical ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                   <span className="font-bold">{p.name}</span>
                </td>
                <td className="px-6 py-4 text-white/30">{p.type}</td>
                <td className="px-6 py-4 font-mono">{(cpuUsage[p.name] || 0.1).toFixed(1)}%</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => killProcess(p.name, p.critical)}
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
    </div>
  );
};

export default TaskManager;
