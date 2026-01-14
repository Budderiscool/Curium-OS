
import React, { useState } from 'react';
import { User, OSStatus } from '../types';
import { kernel } from '../services/Kernel';
import { DEFAULT_WALLPAPER, ACCENT_COLORS } from '../constants';

interface Props {
  onComplete: () => void;
}

const OOBE: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<Partial<User>>({
    username: '',
    theme: 'dark',
    accessibility: { textScaling: 1, highContrast: false, reducedMotion: false }
  });

  const next = () => {
    if (step === 3) {
      if (!userData.username) return alert('Username required');
      
      // Fix: Added missing 'settings' property to satisfy the User interface requirement
      const finalUser: User = {
        username: userData.username,
        passwordHash: '', // In a real system, we'd hash the password here
        theme: (userData.theme as 'dark' | 'light') || 'dark',
        settings: {
          accentColor: ACCENT_COLORS[0],
          wallpaper: DEFAULT_WALLPAPER,
          glassOpacity: 0.8,
          pinnedApps: ['terminal', 'explorer', 'settings'],
          usageStats: {}
        },
        accessibility: userData.accessibility || { textScaling: 1, highContrast: false, reducedMotion: false }
      };

      kernel.login(finalUser);
      onComplete();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#050505] overflow-hidden crt">
      <div className="absolute top-8 right-8">
        <button onClick={() => {
          // Fix: Added missing 'settings' property to the fallback DevUser object
          kernel.login({ 
            username: 'DevUser', 
            theme: 'dark', 
            settings: {
              accentColor: ACCENT_COLORS[0],
              wallpaper: DEFAULT_WALLPAPER,
              glassOpacity: 0.8,
              pinnedApps: ['terminal', 'explorer', 'settings'],
              usageStats: {}
            },
            accessibility: { textScaling: 1, highContrast: false, reducedMotion: false }, 
            passwordHash: '' 
          });
          onComplete();
        }} className="text-xs text-white/30 hover:text-white underline">Skip Setup</button>
      </div>

      <div className="w-full max-w-lg p-12 bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 blur-[80px]"></div>
        
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Welcome to Curium</h1>
            <p className="text-gray-400 text-sm">Select your system language to get started with the CuriumOS experience.</p>
            <select className="w-full bg-white/5 border border-white/20 p-4 rounded-xl text-white outline-none focus:border-indigo-500 transition-colors">
              <option>English (United States)</option>
              <option>Deutsch</option>
              <option>日本語</option>
            </select>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold">Accessibility</h1>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <span className="text-sm">High Contrast Mode</span>
                <input 
                  type="checkbox" 
                  checked={userData.accessibility?.highContrast} 
                  onChange={(e) => setUserData({...userData, accessibility: {...userData.accessibility!, highContrast: e.target.checked}})}
                  className="w-5 h-5 rounded accent-indigo-500" 
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <span className="text-sm">Reduced Motion</span>
                <input 
                  type="checkbox" 
                  checked={userData.accessibility?.reducedMotion} 
                  onChange={(e) => setUserData({...userData, accessibility: {...userData.accessibility!, reducedMotion: e.target.checked}})}
                  className="w-5 h-5 rounded accent-indigo-500" 
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold">Who is using Curium?</h1>
            <div className="space-y-4">
              <input 
                placeholder="Username"
                className="w-full bg-white/5 border border-white/20 p-4 rounded-xl text-white outline-none focus:border-indigo-500 transition-colors"
                value={userData.username}
                onChange={(e) => setUserData({...userData, username: e.target.value})}
              />
              <input 
                type="password"
                placeholder="Password (Optional)"
                className="w-full bg-white/5 border border-white/20 p-4 rounded-xl text-white outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        )}

        <div className="mt-12 flex justify-between items-center">
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`w-2 h-2 rounded-full transition-all ${step === i ? 'bg-indigo-500 w-6' : 'bg-white/10'}`}></div>
            ))}
          </div>
          <button 
            onClick={next}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
          >
            {step === 3 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OOBE;
