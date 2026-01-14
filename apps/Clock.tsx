import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'world' | 'stopwatch'>('world');
  const [swTime, setSwTime] = useState(0);
  const [swRunning, setSwRunning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval: any;
    if (swRunning) {
      interval = setInterval(() => setSwTime(prev => prev + 10), 10);
    }
    return () => clearInterval(interval);
  }, [swRunning]);

  const formatSw = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const mil = Math.floor((ms % 1000) / 10);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${mil.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full bg-black flex flex-col text-white">
      <div className="flex border-b border-white/5">
        <button onClick={() => setActiveTab('world')} className={`flex-1 py-4 text-[10px] uppercase font-bold tracking-widest transition-all ${activeTab === 'world' ? 'text-white border-b-2 border-indigo-500' : 'text-white/30'}`}>World Clock</button>
        <button onClick={() => setActiveTab('stopwatch')} className={`flex-1 py-4 text-[10px] uppercase font-bold tracking-widest transition-all ${activeTab === 'stopwatch' ? 'text-white border-b-2 border-indigo-500' : 'text-white/30'}`}>Stopwatch</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-10">
        {activeTab === 'world' ? (
          <div className="space-y-12 w-full max-w-xs">
            <div className="text-center">
              <div className="text-6xl font-black tracking-tighter mb-2">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
              <div className="text-xs uppercase tracking-widest text-indigo-400 font-bold">Local Time (GMT-8)</div>
            </div>
            <div className="space-y-4">
              {[
                { city: 'London', offset: 8 },
                { city: 'Tokyo', offset: 17 },
                { city: 'New York', offset: 3 }
              ].map(city => {
                const cityTime = new Date(time.getTime() + (city.offset * 3600000));
                return (
                  <div key={city.city} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                    <span className="text-sm font-bold">{city.city}</span>
                    <span className="text-xs font-mono text-white/40">{cityTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-10">
            <div className="text-7xl font-mono font-black tracking-tighter tabular-nums">{formatSw(swTime)}</div>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setSwRunning(!swRunning)}
                className={`w-20 h-20 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-2xl ${swRunning ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}
              >
                {swRunning ? 'STOP' : 'START'}
              </button>
              <button 
                onClick={() => { setSwTime(0); setSwRunning(false); }}
                className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-sm font-bold hover:bg-white/10 transition-all"
              >
                RESET
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clock;