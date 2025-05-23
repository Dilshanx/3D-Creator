// src/components/Enhanced3DShapes/ui/ThreeDViewer.js
import React from "react";

const ThreeDViewer = ({ mountRef, isExporting, exportProgress }) => (
  <div className='lg:col-span-3'>
    <div className='bg-slate-700/20 backdrop-blur-sm rounded-xl p-2 sm:p-4 border border-slate-600/50 shadow-2xl'>
      <div className='relative aspect-[4/3] sm:aspect-video lg:aspect-[4/3]'>
        {" "}
        {/* Maintain aspect ratio */}
        <div
          ref={mountRef}
          className='w-full h-full bg-transparent rounded-lg overflow-hidden'
          // style={{ height: "600px" }} // Height will be controlled by aspect ratio parent
        />
        {isExporting && (
          <div className='absolute inset-0 bg-black/75 flex flex-col items-center justify-center rounded-lg z-10'>
            <div className='bg-white p-6 sm:p-8 rounded-xl shadow-2xl text-center'>
              <div className='text-xl sm:text-2xl font-bold text-slate-800 mb-4'>
                Exporting Model
              </div>
              <div className='text-lg text-slate-700 mb-2'>
                {exportProgress}%
              </div>
              <div className='w-48 sm:w-56 h-3 bg-slate-200 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-blue-600 transition-width duration-300'
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
              <p className='text-xs text-slate-500 mt-3'>Please wait...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default ThreeDViewer;
