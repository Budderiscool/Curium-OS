import React, { useState, useEffect } from 'react';
import { fs } from '../services/FileSystem';
import { FileType } from '../types';

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [activeNote, setActiveNote] = useState<any>(null);
  const [content, setContent] = useState('');

  const loadNotes = () => {
    const files = fs.getFilesInDirectory('/home/user/documents');
    setNotes(files.filter(f => f.name.endsWith('.txt')));
  };

  useEffect(() => {
    loadNotes();
    if (!fs.exists('/home/user/documents')) {
      fs.writeFile('/home/user/documents', '', FileType.DIRECTORY);
    }
  }, []);

  const saveNote = () => {
    if (!activeNote) {
      const name = prompt("Note name:", "new_note.txt");
      if (!name) return;
      const path = `/home/user/documents/${name.endsWith('.txt') ? name : name + '.txt'}`;
      fs.writeFile(path, content);
    } else {
      fs.writeFile(activeNote.path, content);
    }
    loadNotes();
    alert("Note saved.");
  };

  const deleteNote = (path: string) => {
    if (confirm("Delete this note?")) {
      fs.deleteFile(path);
      if (activeNote?.path === path) {
        setActiveNote(null);
        setContent('');
      }
      loadNotes();
    }
  };

  return (
    <div className="h-full bg-[#080808] text-white flex overflow-hidden">
      <div className="w-64 border-r border-white/5 bg-black/40 flex flex-col">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/30">My Notes</span>
          <button onClick={() => { setActiveNote(null); setContent(''); }} className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all">
            <i className="fas fa-plus text-xs"></i>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {notes.map(note => (
            <div 
              key={note.path}
              onClick={() => { setActiveNote(note); setContent(note.content || ''); }}
              className={`group p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between ${activeNote?.path === note.path ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <i className="fas fa-file-alt text-indigo-400/60 text-xs"></i>
                <span className="text-xs font-medium truncate">{note.name}</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); deleteNote(note.path); }} className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-500 p-1">
                <i className="fas fa-trash text-[10px]"></i>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-black">
        <div className="p-4 bg-white/5 flex items-center justify-between">
          <input 
            className="bg-transparent border-none outline-none font-bold text-sm text-white/80 w-1/2"
            value={activeNote ? activeNote.name : "New Note"}
            readOnly={!!activeNote}
          />
          <button onClick={saveNote} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-[10px] font-black tracking-widest transition-all">
            SAVE NOTE
          </button>
        </div>
        <textarea 
          className="flex-1 bg-transparent p-10 outline-none resize-none text-white/70 font-mono leading-relaxed"
          placeholder="Start typing your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Notes;