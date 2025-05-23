// src/components/Enhanced3DShapes/ui/ExportControls.js
import React from "react";
import { Download, Camera } from "lucide-react";

const ExportControls = ({
  onExportGLB,
  onExportOBJ,
  onTakeScreenshot,
  isExporting,
  exportProgress,
}) => (
  <div className='bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700'>
    <h3 className='text-lg sm:text-xl font-semibold text-white mb-4'>Export</h3>
    <div className='space-y-3'>
      <button
        onClick={onExportGLB}
        disabled={isExporting}
        className='w-full flex items-center justify-center gap-2 p-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600/70 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105'
      >
        <Download size={20} />
        <span className='font-medium'>
          {isExporting && exportProgress > 0
            ? `GLB... ${exportProgress}%`
            : "Export GLB"}
        </span>
      </button>
      <button
        onClick={onExportOBJ}
        disabled={isExporting} // Disable all export buttons during export
        className='w-full flex items-center justify-center gap-2 p-3 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-600/70 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105'
      >
        <Download size={20} />
        <span className='font-medium'>Export OBJ</span>
      </button>
      <button
        onClick={onTakeScreenshot}
        disabled={isExporting}
        className='w-full flex items-center justify-center gap-2 p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600/70 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105'
      >
        <Camera size={20} />
        <span className='font-medium'>Screenshot</span>
      </button>
    </div>
  </div>
);

export default ExportControls;
