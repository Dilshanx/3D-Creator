// src/components/Enhanced3DShapes/ui/SettingsPanel.js
import React from "react";

const SettingsPanel = ({ settings, onSettingsChange, show, onClose }) => {
  if (!show) return null;

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    onSettingsChange((prevSettings) => ({
      ...prevSettings,
      [name]: type === "range" ? parseFloat(value) : value,
    }));
  };

  const handleColorChange = (e) => {
    onSettingsChange((prevSettings) => ({
      ...prevSettings,
      shapeColor: e.target.value,
    }));
  };

  return (
    <div
      className='fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out'
      onClick={onClose} // Close on overlay click
    >
      <div
        className='bg-slate-800 rounded-xl p-6 border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl'
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside panel
      >
        <div className='flex justify-between items-center mb-6'>
          <h3 className='text-xl sm:text-2xl font-semibold text-white'>
            Advanced Settings
          </h3>
          <button
            onClick={onClose}
            className='text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700 transition-colors'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <line x1='18' y1='6' x2='6' y2='18'></line>
              <line x1='6' y1='6' x2='18' y2='18'></line>
            </svg>
          </button>
        </div>
        <div className='grid md:grid-cols-2 gap-x-6 gap-y-4'>
          <div>
            <label
              htmlFor='materialType'
              className='block text-sm font-medium text-slate-300 mb-1'
            >
              Material Type
            </label>
            <select
              id='materialType'
              name='materialType'
              value={settings.materialType}
              onChange={handleInputChange}
              className='w-full p-2.5 bg-slate-700 text-white rounded-lg border border-slate-600 focus:ring-1 focus:ring-purple-500 focus:border-purple-500'
            >
              <option value='auto'>Auto Detect</option>
              <option value='metallic'>Metallic</option>
              <option value='glass'>Glass</option>
              <option value='ceramic'>Ceramic</option>
              <option value='organic'>Organic</option>
              <option value='crystal'>Crystal</option>
            </select>
          </div>
          <div>
            <label
              htmlFor='shapeColor'
              className='block text-sm font-medium text-slate-300 mb-1'
            >
              Shape Color
            </label>
            <input
              id='shapeColor'
              name='shapeColor'
              type='color'
              value={settings.shapeColor}
              onChange={handleColorChange} // Use specific handler for color
              className='w-full h-10 p-1 bg-slate-700 rounded-lg border border-slate-600 cursor-pointer'
            />
          </div>
          <div className='md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4'>
            <div>
              <label
                htmlFor='animationSpeed'
                className='block text-sm font-medium text-slate-300 mb-1'
              >
                Animation Speed: {settings.animationSpeed.toFixed(1)}x
              </label>
              <input
                id='animationSpeed'
                name='animationSpeed'
                type='range'
                min='0.1'
                max='3'
                step='0.1'
                value={settings.animationSpeed}
                onChange={handleInputChange}
                className='w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-500'
              />
            </div>
            <div>
              <label
                htmlFor='lightIntensity'
                className='block text-sm font-medium text-slate-300 mb-1'
              >
                Light Intensity: {settings.lightIntensity.toFixed(1)}x
              </label>
              <input
                id='lightIntensity'
                name='lightIntensity'
                type='range'
                min='0.1'
                max='2'
                step='0.1'
                value={settings.lightIntensity}
                onChange={handleInputChange}
                className='w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-500'
              />
            </div>
            <div>
              <label
                htmlFor='extrudeDepth'
                className='block text-sm font-medium text-slate-300 mb-1'
              >
                Extrude Depth: {settings.extrudeDepth.toFixed(2)}
              </label>
              <input
                id='extrudeDepth'
                name='extrudeDepth'
                type='range'
                min='0.05'
                max='1'
                step='0.05'
                value={settings.extrudeDepth}
                onChange={handleInputChange}
                className='w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-500'
              />
            </div>
            <div>
              <label
                htmlFor='quality'
                className='block text-sm font-medium text-slate-300 mb-1'
              >
                Quality
              </label>
              <select
                id='quality'
                name='quality'
                value={settings.quality}
                onChange={handleInputChange}
                className='w-full p-2.5 bg-slate-700 text-white rounded-lg border border-slate-600 focus:ring-1 focus:ring-purple-500 focus:border-purple-500'
              >
                <option value='low'>Low</option>
                <option value='medium'>Medium</option>
                <option value='high'>High</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
