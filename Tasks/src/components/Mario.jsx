// App.jsx
import React, { useState } from "react";
import marioImg from "../assets/mario.png";
import { motion } from "framer-motion";

const Mario = () => {
  const totalSteps = 7;
  const [currentStep, setCurrentStep] = useState(6); // simulate progress (0 to 6)

  return (
    <div className="min-h-screen bg-blue-200 flex flex-col items-center justify-end relative overflow-hidden">

      {/* Days Left Heading */}
      <div className="absolute top-5 text-yellow-400 text-2xl md:text-4xl font-bold font-[Press Start 2P] 
                  bg-red-600 px-4 py-2 rounded shadow-md border-4 border-yellow-300 animate-bounce">
        4 Days Left
      </div>

      {/* Clouds */}
      <div className="absolute top-10 left-10 animate-pulse text-white text-4xl font-bold">☁️</div>
      <div className="absolute top-20 right-20 animate-pulse text-white text-4xl font-bold">☁️</div>

      {/* Ground Path */}
      <div className="w-full max-w-5xl grid grid-cols-7 gap-2 px-4 pb-16">
        {[...Array(totalSteps)].map((_, i) => (
          <div
            key={i}
            className="h-24 bg-green-700 border-b-8 border-green-900 relative shadow-lg rounded"
          >
            {/* Mario jump animation on current step */}
            {i === currentStep && (
              <motion.img
                src={marioImg}
                alt="Mario"
                initial={{ y: -10 }}
                animate={{ y: [-10, -20, -10] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-12 drop-shadow-xl"
              />
            )}

            {/* Flag on last tile */}
            {i === totalSteps - 1 && (
              <div className="absolute -top-16 right-2 flex flex-col items-center">
                <div className="w-5 h-6 bg-red-500 clip-flag" /> {/* Flag */}
                <div className="w-1 h-16 bg-gray-900" /> {/* Flag pole */}
              </div>
            )}

            {/* Victory message on last step */}
            {currentStep === totalSteps - 1 && i === totalSteps - 1 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}

              >

              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Bushes / Ground */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-green-800 border-t-8 border-green-900">
        <div className="absolute left-10 bottom-8 w-16 h-16 bg-green-600 rounded-full shadow-md" />
        <div className="absolute left-20 bottom-8 w-20 h-20 bg-green-500 rounded-full shadow-md" />
        <div className="absolute left-32 bottom-8 w-12 h-12 bg-green-700 rounded-full shadow-md" />
      </div>
    </div>
  );
};

export default Mario;
