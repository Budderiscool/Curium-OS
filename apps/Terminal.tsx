
import React, { useState, useRef, useEffect } from 'react';
import { fs } from '../services/FileSystem';
import { FileType } from '../types';
import { kernel } from '../services/Kernel';

interface Props {
  launchApp?: (id: string) => void;
}

const Terminal: React.FC<Props> = ({ launchApp }) => {
  const [history, setHistory] = useState<string[]>(['CuriumOS Terminal [Version 1.2.5]', '(c) 2025 Curium Systems. All rights reserved.', '', 'Type "help" to see available commands.']);
  const [input, setInput] = useState('');
  const [currentDir, setCurrentDir] = useState('/');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);

  const startTime = useRef(Date.now());

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [history]);

  const execute = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setCmdHistory(prev => [trimmed, ...prev]);
    setHistoryPointer(-1);

    const parts = trimmed.split(' ');
    const action = parts[0].toLowerCase();
    const args = parts.slice(1);

    setHistory(prev => [...prev, `[user@curium ${currentDir}]$ ${trimmed}`]);

    switch (action) {
      case 'help':
        setHistory(prev => [...prev, 'Available commands:', 'ls, cd, pwd, mkdir, touch, rm, cat, open, neofetch, clear, reboot, reset-system, history, man, sysctl, battery, theme, uptime']);
        break;
      case 'man':
        if (!args[0]) setHistory(prev => [...prev, 'What manual page do you want? Try: man theme, man sysctl']);
        else if (args[0] === 'theme') setHistory(prev => [...prev, 'THEME(1) - Manual Page', 'NAME: theme - Modify system UI accent color.', 'USAGE: theme [hex_color]', 'EXAMPLE: theme #ec4899']);
        else if (args[0] === 'sysctl') setHistory(prev => [...prev, 'SYSCTL(1) - Manual Page', 'NAME: sysctl - View system configuration and status.', 'USAGE: sysctl [-a]']);
        else setHistory(prev => [...prev, `No manual entry for ${args[0]}`]);
        break;
      case 'pwd':
        setHistory(prev => [...prev, currentDir]);
        break;
      case 'history':
        setHistory(prev => [...prev, ...cmdHistory.slice().reverse().map((c, i) => `${i + 1}  ${c}`)]);
        break;
      case 'uptime':
        const uptimeSeconds = Math.floor((Date.now() - startTime.current) / 1000);
        setHistory(prev => [...prev, `CuriumOS up ${Math.floor(uptimeSeconds / 60)} minutes, ${uptimeSeconds % 60} seconds.`]);
        break;
      case 'sysctl':
        setHistory(prev => [...prev, 
          'kernel.name = CuriumOS',
          'kernel.version = 1.2.5-node-stable',
          'vm.swappiness = 60',
          'fs.vfs_type = IndexedDB_LocalStorage_Bridge',
          'mem.total = 16384 MB',
          `cpu.usage = ${(Math.random() * 5).toFixed(2)}%`,
          `net.status = ONLINE`,
          `user.current = ${kernel.getCurrentUser()?.username || 'Guest'}`
        ]);
        break;
      case 'battery':
        setHistory(prev => [...prev, '--- Power Management Unit Telemetry ---', 'Status: Discharging', 'Capacity: 100%', 'Voltage: 3.8V', 'Temperature: 31.2°C', 'Health: 99% (Excellent)']);
        break;
      case 'theme':
        if (!args[0]) setHistory(prev => [...prev, 'Usage: theme [hex_color] (e.g., theme #ec4899)']);
        else {
          kernel.updateUser({ settings: { ...kernel.getCurrentUser()!.settings, accentColor: args[0] } });
          setHistory(prev => [...prev, `System accent color updated to ${args[0]}`]);
        }
        break;
      case 'neofetch':
        setHistory(prev => [...prev, 
          '      .---.      OS: CuriumOS LTS Pro',
          '     /     \\     Host: Webkit V8 Runtime',
          '    | () () |    Kernel: 1.2.5-node-stable',
          '     \\  ^  /     Shell: curium-sh v1.0.4',
          '      \'---\'      WM: CuriumWindowManager',
          '                 Colors: Pro-Dark-Indig'
        ]);
        break;
      case 'ls':
        const files = fs.getFilesInDirectory(currentDir);
        if (files.length === 0) setHistory(prev => [...prev, '(empty)']);
        else setHistory(prev => [...prev, ...files.map(f => `${f.type === FileType.DIRECTORY ? 'DIR' : f.type === FileType.APP ? 'APP' : 'FIL'}  ${f.name}`)]);
        break;
      case 'cd':
        if (!args[0] || args[0] === '/') {
          setCurrentDir('/');
        } else if (args[0] === '..') {
          const parts = currentDir.split('/').filter(Boolean);
          parts.pop();
          setCurrentDir('/' + parts.join('/'));
        } else {
          const target = currentDir === '/' ? `/${args[0]}` : `${currentDir}/${args[0]}`;
          const file = fs.getFile(target);
          if (file?.type === FileType.DIRECTORY) setCurrentDir(target);
          else setHistory(prev => [...prev, `cd: no such directory: ${args[0]}`]);
        }
        break;
      case 'mkdir':
        if (!args[0]) setHistory(prev => [...prev, 'usage: mkdir <directory>']);
        else {
          const path = currentDir === '/' ? `/${args[0]}` : `${currentDir}/${args[0]}`;
          fs.writeFile(path, '', FileType.DIRECTORY);
          setHistory(prev => [...prev, `Created directory ${args[0]}`]);
        }
        break;
      case 'touch':
        if (!args[0]) setHistory(prev => [...prev, 'usage: touch <filename>']);
        else {
          const path = currentDir === '/' ? `/${args[0]}` : `${currentDir}/${args[0]}`;
          fs.writeFile(path, '');
          setHistory(prev => [...prev, `Created file ${args[0]}`]);
        }
        break;
      case 'rm':
        if (!args[0]) setHistory(prev => [...prev, 'Usage: rm [path]']);
        else {
          const path = args[0].startsWith('/') ? args[0] : (currentDir === '/' ? `/${args[0]}` : `${currentDir}/${args[0]}`);
          fs.deleteFile(path);
          setHistory(prev => [...prev, `Deleted ${args[0]}`]);
        }
        break;
      case 'cat':
        if (!args[0]) {
          setHistory(prev => [...prev, 'Usage: cat [path]']);
          break;
        }
        const path = args[0].startsWith('/') ? args[0] : (currentDir === '/' ? `/${args[0]}` : `${currentDir}/${args[0]}`);
        const file = fs.getFile(path);
        if (file) setHistory(prev => [...prev, file.content || '(empty)']);
        else setHistory(prev => [...prev, 'cat: file not found.']);
        break;
      case 'open':
        if (launchApp && args[0]) launchApp(args[0]);
        else setHistory(prev => [...prev, 'Usage: open [app_id]']);
        break;
      case 'clear':
        setHistory([]);
        break;
      case 'reboot':
        window.location.reload();
        break;
      case 'reset-system':
        fs.reset();
        setHistory(prev => [...prev, 'Recovery successful. System restored.']);
        break;
      default:
        setHistory(prev => [...prev, `curium-sh: command not found: ${action}`]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      execute(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyPointer < cmdHistory.length - 1) {
        const next = historyPointer + 1;
        setHistoryPointer(next);
        setInput(cmdHistory[next]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyPointer > 0) {
        const next = historyPointer - 1;
        setHistoryPointer(next);
        setInput(cmdHistory[next]);
      } else {
        setHistoryPointer(-1);
        setInput('');
      }
    }
  };

  return (
    <div className="h-full bg-black flex flex-col font-mono text-[13px] p-6 overflow-hidden text-emerald-500/90 selection:bg-emerald-500/20 selection:text-white">
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1 scrollbar-hide">
        {history.map((line, i) => {
          if (!line) return <div key={i} className="h-4"></div>;
          const isError = line.includes('ERROR') || line.includes('not found') || line.includes('Usage:');
          const isCommand = line.startsWith('[user@curium');
          return (
            <div key={i} className={`whitespace-pre-wrap leading-relaxed ${isError ? 'text-red-400' : isCommand ? 'text-indigo-400 font-bold' : ''}`}>
              {line}
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 text-indigo-400 mt-6 border-t border-white/5 pt-4">
        <span className="shrink-0 font-bold opacity-80">[{currentDir}]#</span>
        <input 
          autoFocus 
          className="bg-transparent outline-none text-white flex-1 caret-emerald-500" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
};

export default Terminal;
