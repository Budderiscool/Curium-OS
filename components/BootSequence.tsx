
import React, { useState, useEffect } from 'react';
import { OSStatus } from '../types';

interface Props {
  onComplete: (status: OSStatus) => void;
  integrity: { hasKernel: boolean; hasShell: boolean };
}

const BootSequence: React.FC<Props> = ({ onComplete, integrity }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const messages = [
      "CURIUM BIOS v4.0.2...",
      "Memory Check: 16384MB OK",
      "Detecting Virtual Storage... Found IDB_0",
      "Mounting File System...",
      integrity.hasKernel ? "Kernel found at /sys/boot/kernel.sys" : "ERROR: KERNEL NOT FOUND",
      "Checking UI Subsystems...",
      integrity.hasShell ? "Shell binary verified." : "WARNING: SHELL CORRUPTED",
      "Initializing CuriumOS kernel...",
      "Loading user environment...",
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < messages.length) {
        const nextMsg = messages[i];
        if (nextMsg !== undefined) {
          setLogs(prev => [...prev, nextMsg]);
        }
        setProgress(((i + 1) / messages.length) * 100);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          if (!integrity.hasKernel) {
            onComplete(OSStatus.FAILURE);
          } else {
            const user = localStorage.getItem('curium_user');
            onComplete(user ? OSStatus.LOGIN : OSStatus.OOBE);
          }
        }, 1000);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [onComplete, integrity.hasKernel, integrity.hasShell]);

  return (
    <div className="bg-black text-green-500 font-mono p-8 h-screen w-screen overflow-hidden flex flex-col justify-between crt">
      <div className="space-y-1">
        {logs.map((log, idx) => (
          <div key={idx} className={log && (log.includes('ERROR') || log.includes('WARNING')) ? 'text-red-500 font-bold' : ''}>
            {`> ${log}`}
          </div>
        ))}
        <div className="animate-pulse">_</div>
      </div>
      <div className="w-full h-1 bg-gray-900 mt-4 overflow-hidden">
        <div 
          className="h-full bg-green-500 transition-all duration-300" 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
};

export default BootSequence;
