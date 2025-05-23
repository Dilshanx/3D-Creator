// src/components/Enhanced3DShapes/ui/ShapeSelector.js
import React from "react";

const ShapeSelector = ({ shapes, currentShape, onShapeSelect }) => (
  <div className='bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700'>
    <h3 className='text-lg sm:text-xl font-semibold text-white mb-4'>
      Select Shape
    </h3>
    <div className='grid grid-cols-1 gap-3'>
      {shapes.map((shape) => (
        <button
          key={shape.id}
          onClick={() => onShapeSelect(shape.id)}
          className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 ${
            currentShape === shape.id
              ? "bg-purple-600 text-white shadow-lg ring-2 ring-purple-400"
              : "bg-slate-700/60 text-slate-300 hover:bg-slate-600/70"
          }`}
        >
          <span className='text-xl'>{shape.icon}</span>
          <span className='font-medium text-sm sm:text-base'>{shape.name}</span>
        </button>
      ))}
    </div>
  </div>
);

export default ShapeSelector;
