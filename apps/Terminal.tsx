
import React, { useState, useRef, useEffect } from 'react';
import { fs } from '../services/FileSystem';

interface Props {
  launchApp?: (id: string) => void;
}

const Terminal: React.FC<Props> = ({ launchApp }) => {
  const [history, setHistory] = useState<string[]>(['Welcome to Curium Terminal', 'Type "help" for a list of commands.']);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [history]);

  const execute = (cmd: string) => {
    const parts = cmd.trim().split(' ');
    const action = parts[0].toLowerCase();
    const args = parts.slice(1);

    setHistory(prev => [...prev, `user@curium:~$ ${cmd}`]);

    switch (action) {
      case 'help':
        setHistory(prev => [...prev, 'Available commands:', 'ls, rm [path], cat [path], open [app], reboot, reset-system, clear']);
        break;
      case 'ls':
        const files = fs.getFiles();
        setHistory(prev => [...prev, ...files.map(f => `${f.type === 'DIRECTORY' ? 'DIR' : 'FIL'} - ${f.path}`)]);
        break;
      case 'rm':
        if (!args[0]) {
          setHistory(prev => [...prev, 'Usage: rm [path]']);
        } else {
          fs.deleteFile(args[0]);
          setHistory(prev => [...prev, `Deleted ${args[0]}`]);
        }
        break;
      case 'cat':
        const file = fs.getFile(args[0]);
        if (file) setHistory(prev => [...prev, file.content || '(empty)']);
        else setHistory(prev => [...prev, 'File not found.']);
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
        setHistory(prev => [...prev, 'System files restored.']);
        break;
      default:
        setHistory(prev => [...prev, `Command not found: ${action}`]);
    }
  };

  return (
    <div className="h-full bg-black flex flex-col font-mono text-sm p-2 overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1">
        {history.map((line, i) => <div key={i} className="text-green-500 whitespace-pre-wrap">{line}</div>)}
      </div>
      <div className="flex gap-2 text-indigo-400 mt-2">
        <span>user@curium:~$</span>
        <input 
          autoFocus 
          className="bg-transparent outline-none text-green-500 flex-1" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              execute(input);
              setInput('');
            }
          }}
        />
      </div>
    </div>
  );
};

export default Terminal;
