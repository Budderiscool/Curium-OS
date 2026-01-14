
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const Maps: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState('');

  const searchPlaces = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResults([]);
    setExplanation('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Get user location for better results
      let latLng = { latitude: 37.7749, longitude: -122.4194 }; // Default SF
      
      try {
        const pos = await new Promise<GeolocationPosition>((res, rej) => 
          navigator.geolocation.getCurrentPosition(res, rej)
        );
        latLng = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      } catch (err) {
        console.warn("Location access denied, using defaults.");
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite-latest",
        contents: `Find and describe these places: ${query}`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: latLng
            }
          }
        },
      });

      setExplanation(response.text || '');
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const mapsResults = chunks.filter((c: any) => c.maps).map((c: any) => c.maps);
      setResults(mapsResults);
    } catch (error) {
      console.error(error);
      setExplanation("Failed to load map data. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-[#111] text-white flex flex-col overflow-hidden">
      {/* Search Header */}
      <div className="p-6 bg-black/40 border-b border-white/10">
        <form onSubmit={searchPlaces} className="flex gap-2">
          <div className="relative flex-1">
            <i className="fas fa-location-dot absolute left-4 top-1/2 -translate-y-1/2 text-red-500"></i>
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-indigo-500 transition-all"
              placeholder="Search for restaurants, parks, or cities..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
          >
            {loading ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-search"></i>}
            Search
          </button>
        </form>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4 opacity-50">
            <i className="fas fa-map-marked-alt text-6xl animate-pulse"></i>
            <p className="text-sm font-medium">Accessing Google Maps database...</p>
          </div>
        )}

        {explanation && (
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">AI Recommendations</h3>
            <p className="text-sm leading-relaxed text-white/80 whitespace-pre-wrap">{explanation}</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 px-1">Nearby Locations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((place, idx) => (
                <a 
                  key={idx}
                  href={place.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/5 border border-white/5 p-4 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all group block"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{place.title}</h4>
                    <i className="fas fa-external-link-alt text-[10px] opacity-0 group-hover:opacity-40 transition-opacity"></i>
                  </div>
                  <div className="text-[10px] text-white/40 mb-3 line-clamp-2">{place.uri}</div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">
                    <i className="fas fa-directions"></i>
                    Navigate with Google Maps
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {!loading && !explanation && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 opacity-20">
            <i className="fas fa-compass text-8xl mb-4"></i>
            <p className="text-sm font-medium">Enter a destination to start your journey</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Maps;
