import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

const Weather: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: "Provide a detailed weather report for San Francisco today. Include temperature, condition, humidity, and a 3-day outlook in JSON format.",
          config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json"
          }
        });
        const parsed = JSON.parse(response.text || '{}');
        setData(parsed);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="h-full bg-indigo-950 flex flex-col items-center justify-center text-white p-10 animate-pulse">
        <i className="fas fa-cloud-sun text-6xl mb-4"></i>
        <p className="text-sm font-bold tracking-widest uppercase">Syncing Atmospheric Data...</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-b from-blue-600 to-indigo-900 text-white p-8 flex flex-col overflow-y-auto">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">San Francisco</h1>
          <p className="text-white/60 text-sm font-medium">Clear Skies • High: 72°F Low: 54°F</p>
        </div>
        <div className="text-right">
          <div className="text-6xl font-black tracking-tighter">68°</div>
          <div className="text-xs uppercase tracking-widest font-bold opacity-40">Feels like 66°</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10">
          <div className="text-[10px] uppercase font-bold opacity-40 mb-2">Humidity</div>
          <div className="text-xl font-bold">42%</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10">
          <div className="text-[10px] uppercase font-bold opacity-40 mb-2">UV Index</div>
          <div className="text-xl font-bold">Low</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10">
          <div className="text-[10px] uppercase font-bold opacity-40 mb-2">Visibility</div>
          <div className="text-xl font-bold">10 mi</div>
        </div>
      </div>

      <div>
        <h3 className="text-xs uppercase font-black tracking-[0.2em] opacity-40 mb-6">3-Day Outlook</h3>
        <div className="space-y-3">
          {['Tomorrow', 'Wednesday', 'Thursday'].map((day, i) => (
            <div key={day} className="flex items-center justify-between bg-black/20 p-5 rounded-2xl border border-white/5">
              <span className="font-bold text-sm">{day}</span>
              <div className="flex items-center gap-4">
                <i className={`fas ${i === 0 ? 'fa-sun text-yellow-400' : 'fa-cloud text-gray-300'} text-lg`}></i>
                <span className="text-sm font-mono w-16 text-right">74° / 58°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Weather;