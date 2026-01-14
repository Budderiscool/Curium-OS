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
      "CURIUM BIOS v4.0.2-LTS (RELEASE: 2025-05)",
      "CPU: Virtualization Layer 0x1A2 [4 Cores Detected]",
      "Memory Check: 16384MB DDR5 OK (ECC Enabled)",
      "ACPI: Core System Tables loaded at 0x00000000fd42",
      "VIRT_DISK: IDB_0 (Indexed Database Storage) found",
      "Partition mapping: IDB_0p1 [BOOT], IDB_0p2 [SYSTEM], IDB_0p3 [USER]",
      "Mounting File System... [ext4-virt]",
      integrity.hasKernel ? "[  OK  ] Kernel found: /sys/boot/kernel.sys (v1.2.5-node)" : "[FAILED] FATAL: KERNEL IMAGE NOT FOUND AT /sys/boot/kernel.sys",
      "Kernel: Command line: console=tty0 root=/dev/idb_0p2 rw systemd.unit=multi-user.target",
      "Initializing Curium Interrupt Controller...",
      "PCI: Enumerating buses...",
      "PCI: 00:01.0 - VirtIO Display Adapter v2.1",
      "PCI: 00:02.0 - VirtIO Input (HID Bridge)",
      "PCI: 00:03.0 - VirtIO Network Controller (eth0)",
      "[  OK  ] Driver Loaded: DISPLAY_ACCEL_X64.DRV",
      "[  OK  ] Driver Loaded: INPUT_HID_REACTIVE.DRV",
      "Loading UI Subsystems...",
      integrity.hasShell ? "[  OK  ] Shell binary /sys/bin/shell.exe verified (SHA-256: e3b0c442...)" : "[ WARN ] Shell binary corrupted or missing. Falling back to recovery console.",
      "Starting System Daemons...",
      "[  OK  ] Started D-Bus System Message Bus",
      "[  OK  ] Started Curium Virtual File System Manager",
      "[  OK  ] Started System UI Server (Compositor: CuriumWM)",
      "[  OK  ] Started User Login Manager",
      "Network: eth0 initialized [IPv4: 10.0.0.15/24]",
      "Security: V-TPM 2.0 State Verified",
      "Boot Sequence Finalizing...",
      "Entering runlevel 5 (Multi-User GUI Mode)...",
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
    }, 200); // Slightly faster for density

    return () => clearInterval(interval);
  }, [onComplete, integrity.hasKernel, integrity.hasShell]);

  return (
    <div className="bg-black text-green-500 font-mono p-8 h-screen w-screen overflow-hidden flex flex-col justify-between crt">
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
              <span>{log}</span>
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