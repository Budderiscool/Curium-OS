import React, { useState } from 'react';

const IMAGES = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
  "https://images.unsplash.com/photo-1477346611705-65d1883cee1e",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  "https://images.unsplash.com/photo-1511497584788-876760111969",
  "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
];

const Gallery: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="h-full bg-black text-white p-8 overflow-y-auto">
      <h1 className="text-3xl font-black mb-8 tracking-tighter">System Gallery</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {IMAGES.map((url, i) => (
          <div 
            key={i} 
            onClick={() => setSelected(`${url}?auto=format&fit=crop&q=100&w=1920`)}
            className="aspect-square rounded-2xl overflow-hidden border border-white/5 cursor-pointer hover:scale-[1.03] hover:border-indigo-500/50 transition-all duration-300 shadow-2xl group"
          >
            <img src={`${url}?auto=format&fit=crop&q=80&w=400`} className="w-full h-full object-cover group-hover:brightness-110 transition-all" alt="Gallery" />
          </div>
        ))}
      </div>

      {selected && (
        <div 
          className="fixed inset-0 z-[20000] bg-black/95 backdrop-blur-3xl flex flex-col p-10 animate-in fade-in zoom-in duration-300"
          onClick={() => setSelected(null)}
        >
          <div className="flex justify-end mb-6">
            <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
          <div className="flex-1 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
            <img src={selected} className="w-full h-full object-contain" alt="Fullscreen" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;