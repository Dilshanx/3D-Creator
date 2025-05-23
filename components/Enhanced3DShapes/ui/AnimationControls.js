// src/components/Enhanced3DShapes/ui/AnimationControls.js
import React from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

const AnimationControls = ({
  isAnimating,
  onToggleAnimation,
  onResetAnimation,
}) => (
  <div className='bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700'>
    <h3 className='text-lg sm:text-xl font-semibold text-white mb-4'>
      Animation
    </h3>
    <div className='space-y-3'>
      <button
        onClick={onToggleAnimation}
        className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 ${
          isAnimating
            ? "bg-red-600 hover:bg-red-500 text-white"
            : "bg-green-600 hover:bg-green-500 text-white"
        }`}
      >
        {isAnimating ? <Pause size={20} /> : <Play size={20} />}
        <span className='font-medium'>{isAnimating ? "Pause" : "Play"}</span>
      </button>
      <button
        onClick={onResetAnimation}
        className='w-full flex items-center justify-center gap-2 p-3 bg-slate-600 hover:bg-slate-500/80 text-white rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105'
      >
        <RotateCcw size={20} />
        <span className='font-medium'>Reset</span>
      </button>
    </div>
  </div>
);

export default AnimationControls;
