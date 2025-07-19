import React from 'react';
import Cubes from '../../Cubes/Cubes/Cubes';
const MainDashboard = () => {
  const token=localStorage.getItem('authToken')
  if(token==null){
    return <div>Login first</div>
  }
  return (

    <main className="p-10 space-y-6 bg-[#0f1117]">
      <div className="h-screen bg-[#0f0f1c]">
  <div className=" relative right-[10vw] w-full max-w-[600px] mx-auto h-[600px]">
    <Cubes
      gridSize={12}
      cubeSize={60}
      cellGap={10}
      maxAngle={60}
      radius={8}
      borderStyle="2px dashed #0ea5e9" // cyan-500
      faceColor="#1e293b"              // slate-800
      rippleColor="#67e8f9"            // cyan-300
      rippleSpeed={1.5}
      autoAnimate={true}
      rippleOnClick={true}
    />

    {/* Heading */}
    <div className="absolute left-[18vw] top-[10vh] text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 drop-shadow-[0_0_25px_rgba(34,211,238,0.4)]">
      Consistify
    </div>

    {/* Subheading */}
    <div className="absolute left-[18vw] top-[24vh] text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-blue-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
      Managing Your Workspace Perfectly
    </div>
  </div>
</div>

    </main>
  );
};

export default MainDashboard;