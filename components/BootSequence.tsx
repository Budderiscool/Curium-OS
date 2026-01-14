
import React, { useState, useEffect } from 'react';
import { OSStatus } from '../types';

interface Props {
  onComplete: (status: OSStatus) => void;
  integrity: any;
}

const BootSequence: React.FC<Props> = ({ onComplete, integrity }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const hasIcons = integrity.hasIcons;
  const hasFonts = integrity.hasFonts;

  useEffect(() => {
    const messages = [
      "CURIUM BIOS v4.0.2-LTS (RELEASE: 2025-05)",
      "CPU: Virtualization Layer 0x1A2 [4 Cores Detected]",
      "Memory Check: 16384MB DDR5 OK (ECC Enabled)",
      "ACPI: Core System Tables loaded at 0x00000000fd42",
      "VIRT_DISK: IDB_0 (Indexed Database Storage) found",
      "Partition mapping: IDB_0p1 [BOOT], IDB_0p2 [SYSTEM], IDB_0p3 [USER]",
      "Mounting File System... [ext4-virt]",
      integrity.hasKernel ? "[  OK  ] Kernel found: /sys/boot/kernel.sys" : "[FAILED] FATAL: KERNEL IMAGE NOT FOUND",
      "Initializing Curium Interrupt Controller...",
      "Loading UI Subsystems...",
      integrity.hasShell ? "[  OK  ] Shell binary verified" : "[ WARN ] Shell binary corrupted or missing.",
      integrity.hasWindowHandler ? "[  OK  ] Window Manager service started" : "[FAILED] window_handler.srv missing",
      integrity.hasAppManager ? "[  OK  ] App Manager service started" : "[FAILED] app_manager.srv missing",
      "[  OK  ] Started D-Bus System Message Bus",
      "[  OK  ] Started System UI Server",
      "Network: eth0 initialized [IPv4: 10.0.0.15/24]",
      "Boot Sequence Finalizing...",
      "Entering runlevel 5...",
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < messages.length) {
        setLogs(prev => [...prev, messages[i]]);
        setProgress(((i + 1) / messages.length) * 100);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          if (!integrity.hasKernel || !integrity.hasWindowHandler || !integrity.hasAppManager) {
            onComplete(OSStatus.FAILURE);
          } else {
            const user = localStorage.getItem('curium_user');
            onComplete(user ? OSStatus.LOGIN : OSStatus.OOBE);
          }
        }, 1000);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete, integrity]);

  return (
    <div className={`bg-black text-green-500 font-mono p-8 h-screen w-screen overflow-hidden flex flex-col justify-between crt ${!hasFonts ? 'system-fonts-missing' : ''}`}>
      <div className="space-y-0.5 overflow-hidden">
        {logs.map((log, idx) => {
          const isError = log.includes('FAILED') || log.includes('FATAL');
          const isWarn = log.includes('WARN');
          const isOk = log.includes('[  OK  ]');
          
          let textColor = 'text-green-500/80';
          if (isError) textColor = 'text-red-500 font-bold';
          if (isWarn) textColor = 'text-yellow-500';
          if (isOk) textColor = 'text-emerald-400';

          return (
            <div key={idx} className={`${textColor} text-[11px] flex gap-2`}>
              <span className="opacity-30">[{new Date().getTime().toString().slice(-6)}]</span>
              <span>
                {hasIcons && isOk && <i className="fas fa-check-circle mr-1 text-[8px]"></i>}
                {hasIcons && isError && <i className="fas fa-times-circle mr-1 text-[8px]"></i>}
                {log}
              </span>
            </div>
          );
        })}
        <div className="animate-pulse text-green-500">_</div>
      </div>
      <div className="w-full h-1 bg-gray-900 mt-4 overflow-hidden rounded-full">
        <div 
          className="h-full bg-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-all duration-300" 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
};

export default BootSequence;
