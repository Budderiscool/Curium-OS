
import React from 'react';
import { kernel } from '../services/Kernel';

const FailureScreen: React.FC = () => {
  return (
    <div className="h-screen w-screen bg-[#0000aa] text-white font-mono p-16 space-y-12 crt">
      <div className="text-8xl">:(</div>
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-3xl font-bold uppercase">CuriumOS failed to boot.</h1>
        <p className="text-xl">Your PC ran into a problem and needs to restart. We're just collecting some error info, and then we'll restart for you.</p>
        <p className="text-sm opacity-60">CRITICAL_SYSTEM_FILE_MISSING (KERNEL.SYS)</p>
      </div>

      <div className="pt-12 space-y-4">
        <p className="text-lg">What would you like to do?</p>
        <div className="flex flex-col gap-4 w-64">
          <button 
            className="px-6 py-3 bg-white text-[#0000aa] font-bold hover:bg-gray-200 transition-colors"
            onClick={() => window.location.reload()}
          >
            RETRY BOOT
          </button>
          <button 
            className="px-6 py-3 border-2 border-white hover:bg-white/10 transition-colors font-bold"
            onClick={() => kernel.reinstall()}
          >
            REPAIR SYSTEM (FACTORY RESET)
          </button>
        </div>
      </div>
    </div>
  );
};

export default FailureScreen;
