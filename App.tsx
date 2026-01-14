
import React, { useState, useEffect } from 'react';
import { OSStatus, User } from './types';
import { kernel } from './services/Kernel';
import { fs } from './services/FileSystem';
import BootSequence from './components/BootSequence';
import OOBE from './components/OOBE';
import Login from './components/Login';
import Desktop from './components/Desktop';
import FailureScreen from './components/FailureScreen';

const App: React.FC = () => {
  const [status, setStatus] = useState<OSStatus>(OSStatus.BOOTING);
  const [user, setUser] = useState<User | null>(kernel.getCurrentUser());
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [corruptionLevel, setCorruptionLevel] = useState(0);

  useEffect(() => {
    const integrity = fs.getIntegrityReport();
    if (!integrity.hasKernel) {
      setStatus(OSStatus.FAILURE);
    }

    const handleInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    const handleInstability = () => {
      // Increase corruption incrementally
      setCorruptionLevel(prev => {
        const next = Math.min(prev + 0.15, 1.0);
        if (next >= 1.0) {
          setTimeout(() => setStatus(OSStatus.FAILURE), 5000);
        }
        return next;
      });
    };

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    window.addEventListener('curium_system_failure', handleInstability);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      window.removeEventListener('curium_system_failure', handleInstability);
    };
  }, []);

  const handleBootComplete = (nextStatus: OSStatus) => {
    setStatus(nextStatus);
    setUser(kernel.getCurrentUser());
  };

  const handleOOBEComplete = () => {
    setUser(kernel.getCurrentUser());
    setStatus(OSStatus.LOGIN);
  };

  const renderContent = () => {
    switch (status) {
      case OSStatus.BOOTING:
        return <BootSequence onComplete={handleBootComplete} integrity={fs.getIntegrityReport()} />;
      case OSStatus.FAILURE:
        return <FailureScreen />;
      case OSStatus.OOBE:
        return <OOBE onComplete={handleOOBEComplete} />;
      case OSStatus.LOGIN:
        return user ? (
          <Login user={user} onLogin={() => setStatus(OSStatus.DESKTOP)} />
        ) : (
          <OOBE onComplete={handleOOBEComplete} />
        );
      case OSStatus.DESKTOP:
        return user ? <Desktop user={user} installPrompt={installPrompt} corruptionLevel={corruptionLevel} /> : <FailureScreen />;
      default:
        return <FailureScreen />;
    }
  };

  return (
    <div className="h-screen w-screen bg-black overflow-hidden relative">
      {renderContent()}
    </div>
  );
};

export default App;
