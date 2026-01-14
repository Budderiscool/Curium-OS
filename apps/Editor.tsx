
import React, { useState } from 'react';
import { fs } from '../services/FileSystem';

const Editor: React.FC = () => {
  const [content, setContent] = useState('');
  const [filename, setFilename] = useState('untitled.txt');

  const save = () => {
    fs.writeFile(`/home/user/${filename}`, content);
    alert('File saved to /home/user/' + filename);
  };

  return (
    <div className="h-full flex flex-col bg-[#111]">
      <div className="bg-[#222] px-4 py-2 flex items-center justify-between">
        <input 
          className="bg-transparent border-none outline-none text-xs text-white" 
          value={filename} 
          onChange={(e) => setFilename(e.target.value)}
        />
        <button onClick={save} className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-[10px] font-bold text-white transition-colors">
          SAVE
        </button>
      </div>
      <textarea 
        className="flex-1 bg-black text-green-500 font-mono text-sm p-4 outline-none resize-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing..."
      />
    </div>
  );
};

export default Editor;
