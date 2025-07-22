import React from 'react';
import SplashCursor from '../../../SplashCursor/SplashCursor';
import Sidebar from '../../../components/Sidebar';

const MainDashboard: React.FC = () => {
  return (
    <div className="relative min-h-screen flex bg-[#0f1117] overflow-hidden text-white font-sans">
      {/* Glowing animated background */}
      <div className="absolute inset-0 z-0 bg-gradient-radial from-cyan-400/10 via-blue-500/5 to-transparent animate-pulse blur-3xl" />

      {/* Sidebar */}
      <div className="relative z-20">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 p-10 flex flex-col justify-center items-center space-y-10">
        {/* Splash Cursor Animation */}
        <SplashCursor />

        {/* Content */}
        <div className="relative text-center space-y-6">
          <h1 className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 drop-shadow-[0_0_30px_rgba(34,211,238,0.6)] animate-fadeInUp">
            Consistify
          </h1>
          <p className="text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-blue-300 drop-shadow-[0_0_20px_rgba(34,211,238,0.4)] animate-fadeIn delay-200">
            Managing Your Workspace Perfectly
          </p>
        </div>
      </main>
    </div>
  );
};

export default MainDashboard;