
import React from 'react';
import { kernel } from '../services/Kernel';
import { fs } from '../services/FileSystem';

interface Props {
  error?: string;
}

const FailureScreen: React.FC<Props> = ({ error = "CRITICAL_PROCESS_DIED" }) => {
  const integrity = fs.getIntegrityReport();
  const hasIcons = integrity.hasIcons;
  const hasFonts = integrity.hasFonts;

  return (
    <div className={`h-screen w-screen bg-[#0078d7] text-white flex flex-col items-center justify-center p-12 text-center select-none cursor-none ${!hasFonts ? 'system-fonts-missing' : ''}`}>
      <div className="max-w-3xl space-y-10 animate-in fade-in duration-700">
        <div className="text-[120px] leading-none font-light mb-8 select-none">
          :(
        </div>
        
        <div className="space-y-6">
          <h1 className="text-3xl font-light leading-snug">
            Your device ran into a problem and needs to restart. We're just collecting some error info, and then we'll restart for you.
          </h1>
          
          <div className="flex flex-col items-center gap-2 opacity-80">
            <span className="text-lg">0% complete</span>
          </div>
        </div>

        <div className="flex items-start gap-8 pt-12 text-left justify-center">
          {hasIcons ? (
            <div className="w-32 h-32 bg-white p-2 shrink-0">
               {/* Fake QR Code */}
               <div className="w-full h-full bg-black flex flex-wrap">
                  {[...Array(64)].map((_, i) => (
                    <div key={i} className={`w-[12.5%] h-[12.5%] ${Math.random() > 0.5 ? 'bg-white' : 'bg-black'}`}></div>
                  ))}
               </div>
            </div>
          ) : (
            <div className="w-32 h-32 border-4 border-dashed border-white/20 shrink-0"></div>
          )}
          
          <div className="space-y-4 pt-2">
            <p className="text-sm font-medium">
              For more information about this issue and possible fixes, visit https://curium.os/stopcode
            </p>
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold opacity-60">If you call a support person, give them this info:</p>
              <p className="text-sm font-bold">Stop code: {error}</p>
            </div>
          </div>
        </div>

        <div className="pt-16 flex flex-col items-center gap-4">
          <button 
            className="px-10 py-4 bg-white text-[#0078d7] font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors rounded-sm"
            onClick={() => window.location.reload()}
          >
            Reboot System
          </button>
          <button 
            className="px-10 py-4 border border-white/40 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors rounded-sm"
            onClick={() => kernel.reinstall()}
          >
            Factory Reset (Repair)
          </button>
        </div>
      </div>

      {/* Background static/noise effect */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
};

export default FailureScreen;
