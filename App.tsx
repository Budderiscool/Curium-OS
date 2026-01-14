
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

  useEffect(() => {
    // Check initial integrity
    const integrity = fs.getIntegrityReport();
    if (!integrity.hasKernel) {
      setStatus(OSStatus.FAILURE);
    }
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
        return user ? <Desktop user={user} /> : <FailureScreen />;
      default:
        return <FailureScreen />;
    }
  };

  return (
    <div className="h-screen w-screen bg-black overflow-hidden relative">
      <div className="scanline"></div>
      {renderContent()}
    </div>
  );
};

export default App;
