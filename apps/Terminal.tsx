import React, { useState, useRef, useEffect } from 'react';
import { fs } from '../services/FileSystem';
import { FileType } from '../types';

interface Props {
  launchApp?: (id: string) => void;
}

const Terminal: React.FC<Props> = ({ launchApp }) => {
  const [history, setHistory] = useState<string[]>(['Welcome to Curium Terminal v1.2', 'Type "help" for a list of commands.']);
  const [input, setInput] = useState('');
  const [currentDir, setCurrentDir] = useState('/');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);

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
        setHistory(prev => [...prev, 'Available commands:', 'ls, cd [dir], mkdir [name], touch [name], rm [path], cat [path], open [app], neofetch, clear, reboot, reset-system']);
        break;
      case 'neofetch':
        setHistory(prev => [...prev, 
          '      .---.      OS: CuriumOS LTS',
          '     /     \\     Host: Webkit Runtime',
          '    | () () |    Kernel: 1.2.5-node',
          '     \\  ^  /     Shell: curium-sh v1.0',
          '      \'---\'      WM: CuriumWindowManager',
          '                 Accent: Indigo'
        ]);
        break;
      case 'ls':
        const files = fs.getFilesInDirectory(currentDir);
        if (files.length === 0) setHistory(prev => [...prev, '(empty)']);
        else setHistory(prev => [...prev, ...files.map(f => `${f.type === FileType.DIRECTORY ? 'DIR' : 'FIL'}  ${f.name}`)]);
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
    <div className="h-full bg-black flex flex-col font-mono text-[13px] p-4 overflow-hidden text-emerald-500">
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1 scrollbar-hide">
        {history.map((line, i) => (
          <div key={i} className={`whitespace-pre-wrap ${line.includes('ERROR') || line.includes('not found') ? 'text-red-400' : ''}`}>
            {line}
          </div>
        ))}
      </div>
      <div className="flex gap-2 text-indigo-400 mt-4 border-t border-white/5 pt-2">
        <span className="shrink-0">[{currentDir}]#</span>
        <input 
          autoFocus 
          className="bg-transparent outline-none text-white flex-1 caret-white" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export default Terminal;