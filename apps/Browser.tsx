import React, { useState, useRef, useEffect } from 'react';

const Browser: React.FC = () => {
  const [url, setUrl] = useState('https://www.wikipedia.org');
  const [input, setInput] = useState(url);
  const [proxyMode, setProxyMode] = useState(false);
  const [history, setHistory] = useState<string[]>(['https://www.wikipedia.org']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const getEffectiveUrl = (target: string) => {
    if (!target.startsWith('http')) {
      return `https://www.google.com/search?q=${encodeURIComponent(target)}&igu=1`;
    }
    // If proxy mode is on, wrap the URL. Note: igu=1 is a Google-specific param to allow iframes.
    if (proxyMode) {
      return `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`;
    }
    return target;
  };

  const navigate = (newUrl: string, addToHistory = true) => {
    let target = newUrl;
    if (!target.includes('.') && !target.startsWith('http')) {
      target = `https://www.google.com/search?q=${encodeURIComponent(target)}&igu=1`;
    } else if (!target.startsWith('http')) {
      target = `https://${target}`;
    }

    setUrl(target);
    setInput(target);
    
    if (addToHistory) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(target);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      navigate(prev, false);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      navigate(next, false);
    }
  };

  const refresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = getEffectiveUrl(url);
    }
  };

  const toggleProxy = () => {
    setProxyMode(!proxyMode);
  };

  // Re-navigate when proxy mode changes to refresh the iframe with/without proxy
  useEffect(() => {
    refresh();
  }, [proxyMode]);

  return (
    <div className="h-full flex flex-col bg-[#f1f3f4] text-gray-800 font-sans select-text">
      {/* Tab Bar */}
      <div className="h-10 flex items-end px-2 gap-1 bg-[#dee1e6] border-b border-gray-300">
        <div className="flex items-center bg-white h-8 px-4 rounded-t-lg text-[11px] font-medium min-w-[120px] max-w-[200px] border-x border-t border-gray-300 shadow-sm relative group">
          <i className="fas fa-globe mr-2 text-blue-500"></i>
          <span className="truncate flex-1">{url.replace('https://', '')}</span>
          <i className="fas fa-times ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"></i>
        </div>
        <button className="w-7 h-7 mb-1 flex items-center justify-center rounded-full hover:bg-gray-300 transition-colors text-gray-600">
          <i className="fas fa-plus text-[10px]"></i>
        </button>
      </div>

      {/* Navigation Controls */}
      <div className="h-12 flex items-center gap-3 px-3 bg-white border-b border-gray-200">
        <div className="flex gap-1">
          <button 
            disabled={historyIndex === 0}
            onClick={handleBack}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600 disabled:opacity-30"
          >
            <i className="fas fa-arrow-left text-sm"></i>
          </button>
          <button 
            disabled={historyIndex >= history.length - 1}
            onClick={handleForward}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600 disabled:opacity-30"
          >
            <i className="fas fa-arrow-right text-sm"></i>
          </button>
          <button 
            onClick={refresh}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600"
          >
            <i className="fas fa-rotate-right text-sm"></i>
          </button>
        </div>

        <form 
          onSubmit={(e) => { e.preventDefault(); navigate(input); }} 
          className="flex-1 flex items-center bg-[#f1f3f4] border border-transparent focus-within:bg-white focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 rounded-full px-4 h-8 transition-all"
        >
          <i className={`fas ${url.startsWith('https') ? 'fa-lock text-emerald-500' : 'fa-circle-info text-gray-400'} text-[10px] mr-3`}></i>
          <input 
            className="w-full bg-transparent border-none outline-none text-xs text-gray-700"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
          />
        </form>

        <div className="flex gap-1">
          <button 
            onClick={toggleProxy}
            title={proxyMode ? "Compatibility Mode Active (Proxy)" : "Enable Compatibility Mode"}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${proxyMode ? 'bg-amber-100 text-amber-600' : 'hover:bg-gray-100 text-gray-400'}`}
          >
            <i className={`fas ${proxyMode ? 'fa-shield-halved' : 'fa-shield'} text-sm`}></i>
          </button>
          <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600">
            <i className="fas fa-ellipsis-vertical text-sm"></i>
          </button>
        </div>
      </div>

      {/* Bookmarks Bar */}
      <div className="h-8 flex items-center px-4 gap-4 bg-white border-b border-gray-200 overflow-x-auto scrollbar-hide">
        {[
          { name: 'Google', url: 'https://www.google.com/search?q=&igu=1', icon: 'fa-google text-blue-500' },
          { name: 'Wikipedia', url: 'https://www.wikipedia.org', icon: 'fa-book text-gray-600' },
          { name: 'GitHub', url: 'https://github.com', icon: 'fa-github text-black' },
          { name: 'Reddit', url: 'https://www.reddit.com', icon: 'fa-reddit text-orange-500' },
          { name: 'News', url: 'https://news.ycombinator.com', icon: 'fa-hacker-news text-orange-600' }
        ].map(bm => (
          <button 
            key={bm.name}
            onClick={() => navigate(bm.url)}
            className="flex items-center gap-1.5 hover:bg-gray-100 px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap transition-colors"
          >
            <i className={`fab ${bm.icon}`}></i>
            <span>{bm.name}</span>
          </button>
        ))}
      </div>

      {/* Main Viewport */}
      <div className="flex-1 bg-white relative">
        <iframe 
          ref={iframeRef}
          src={getEffectiveUrl(url)} 
          className="w-full h-full border-none"
          title="Browser Viewport"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
        
        {/* Connection Interrupted / Blocked Hint */}
        <div className="absolute bottom-4 right-4 max-w-xs bg-white border border-gray-200 rounded-xl shadow-2xl p-4 animate-in slide-in-from-bottom-4 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
          <div className="flex items-start gap-3">
            <i className="fas fa-circle-info text-blue-500 mt-1"></i>
            <div>
              <p className="text-[11px] font-bold">Having trouble loading a site?</p>
              <p className="text-[10px] text-gray-500 mt-1">Some websites block being embedded. Try toggling the <b>Shield icon</b> in the top right to use Compatibility Mode.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-white border-t border-gray-200 px-3 flex items-center justify-between text-[10px] text-gray-400">
        <div className="flex items-center gap-2 truncate max-w-[50%]">
          {url.startsWith('https') && <i className="fas fa-lock text-[8px] text-emerald-500"></i>}
          <span>{url}</span>
        </div>
        <div className="flex gap-3">
          {proxyMode && <span className="text-amber-600 font-bold uppercase tracking-tighter italic">Compatibility Mode Active</span>}
          <span>UTF-8</span>
          <i className="fas fa-signal"></i>
        </div>
      </div>
    </div>
  );
};

export default Browser;