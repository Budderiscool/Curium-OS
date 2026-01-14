import React, { useState } from 'react';

const Browser: React.FC = () => {
  const [url, setUrl] = useState('https://www.google.com/search?q=CuriumOS');
  const [input, setInput] = useState(url);

  const navigate = (e: React.FormEvent) => {
    e.preventDefault();
    let target = input;
    if (!target.startsWith('http')) target = `https://www.google.com/search?q=${target}`;
    setUrl(target);
  };

  return (
    <div className="h-full flex flex-col bg-white text-gray-800">
      <div className="h-12 flex items-center gap-4 px-4 bg-gray-100 border-b border-gray-300">
        <div className="flex gap-2">
          <button className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors">
            <i className="fas fa-arrow-left text-sm"></i>
          </button>
          <button className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors">
            <i className="fas fa-rotate-right text-sm"></i>
          </button>
        </div>
        <form onSubmit={navigate} className="flex-1">
          <input 
            className="w-full bg-white border border-gray-300 rounded-full px-4 py-1 text-sm outline-none focus:border-blue-500 transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </form>
        <div className="flex gap-2">
          <i className="fas fa-ellipsis-vertical p-2 text-gray-400"></i>
        </div>
      </div>
      <div className="flex-1 bg-white relative">
        <iframe 
          src={url} 
          className="w-full h-full border-none"
          title="Browser Viewport"
        />
        {/* Mock overlay if iframe is blocked by X-Frame-Options */}
        {!url.includes('google.com') && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 pointer-events-none">
            <div className="text-center opacity-40">
              <i className="fas fa-globe text-6xl mb-4"></i>
              <p className="text-sm">Browsing to external resource...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browser;