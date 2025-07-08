import React from 'react'
import Cubes from '../../Cubes/Cubes/Cubes'
const Test = () => {
  return (
    <div className='h-screen bg-[#0f0f1c]'>
    <div className="w-full max-w-[600px] mx-auto h-[600px] relative">
    <Cubes
  gridSize={8}
  cubeSize={40}
  cellGap={2}
  maxAngle={60}
  radius={4}
  borderStyle="2px dashed #5227FF"
  faceColor="#1a1a2e"
  rippleColor="#ff6b6b"
  rippleSpeed={1.5}
  autoAnimate={true}
  rippleOnClick={true}
/>
    </div>
  </div>
  )
}

export default Test
