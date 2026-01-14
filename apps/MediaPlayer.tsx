import React, { useState } from 'react';

const MediaPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [track] = useState({ title: "Neon Horizon", artist: "Curium Audio Lab" });

  return (
    <div className="h-full bg-black flex flex-col items-center justify-center p-8 space-y-8">
      <div className="relative group w-64 h-64 rounded-3xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 animate-pulse"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <i className="fas fa-music text-6xl text-white/10"></i>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 flex items-end gap-[1px]">
          {[...Array(32)].map((_, i) => (
            <div 
              key={i} 
              className={`flex-1 bg-indigo-500 transition-all duration-300 ${isPlaying ? 'animate-bounce' : 'h-1 opacity-20'}`}
              style={{ 
                height: isPlaying ? `${Math.random() * 100}%` : '4px',
                animationDelay: `${i * 0.05}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-xl font-bold text-white">{track.title}</h2>
        <p className="text-xs text-white/40 uppercase tracking-widest mt-1">{track.artist}</p>
      </div>

      <div className="flex items-center gap-8">
        <button className="text-white/40 hover:text-white transition-colors"><i className="fas fa-backward-step text-xl"></i></button>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-white/10"
        >
          <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-xl pl-0.5`}></i>
        </button>
        <button className="text-white/40 hover:text-white transition-colors"><i className="fas fa-forward-step text-xl"></i></button>
      </div>

      <div className="w-full max-w-sm space-y-2">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div className={`h-full bg-white transition-all duration-1000 ${isPlaying ? 'w-[45%]' : 'w-0'}`}></div>
        </div>
        <div className="flex justify-between text-[10px] text-white/30 font-mono">
          <span>01:42</span>
          <span>03:55</span>
        </div>
      </div>
    </div>
  );
};

export default MediaPlayer;