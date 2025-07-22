import React from "react";

const LoadingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f1117] text-white font-[Poppins] space-y-6">
      {/* Logo or App Name */}
      <h1 className="text-4xl font-bold text-cyan-400 animate-pulse">Consistify</h1>

      {/* Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin"></div>
      </div>

      {/* Optional Text */}
      <p className="text-gray-400">Loading, please wait...</p>
    </div>
  );
};

export default LoadingPage;