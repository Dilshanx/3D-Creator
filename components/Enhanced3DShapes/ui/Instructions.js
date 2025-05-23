// src/components/Enhanced3DShapes/ui/Instructions.js
import React from "react";

const Instructions = () => (
  <div className='mt-8 bg-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-slate-700/80'>
    <h3 className='text-lg sm:text-xl font-semibold text-white mb-4'>
      How to Use
    </h3>
    <div className='grid md:grid-cols-2 gap-x-6 gap-y-4 text-slate-300'>
      <div>
        <h4 className='font-medium text-purple-300 mb-2 text-base sm:text-lg'>
          Creating & Customizing
        </h4>
        <ul className='space-y-1.5 text-sm sm:text-base list-disc list-inside marker:text-purple-400'>
          <li>Select a base shape from the panel.</li>
          <li>
            Open "Advanced Settings" to fine-tune:
            <ul className='list-disc list-inside ml-4 mt-1 space-y-1 marker:text-purple-300'>
              <li>Material type (Metallic, Glass, etc.).</li>
              <li>Shape color using the color picker.</li>
              <li>Animation speed and light intensity.</li>
              <li>Extrude depth for thickness.</li>
              <li>Render quality (Low, Medium, High).</li>
            </ul>
          </li>
          <li>Control animation with Play/Pause/Reset.</li>
        </ul>
      </div>
      <div>
        <h4 className='font-medium text-purple-300 mb-2 text-base sm:text-lg'>
          Exporting Your Model
        </h4>
        <ul className='space-y-1.5 text-sm sm:text-base list-disc list-inside marker:text-purple-400'>
          <li>
            <b>Export GLB:</b> For modern 3D apps (e.g., Blender, game engines).
            Includes materials.
          </li>
          <li>
            <b>Export OBJ:</b> Widely compatible format, good for CAD. Simpler
            material support.
          </li>
          <li>
            <b>Screenshot:</b> Captures the current view as a PNG image.
          </li>
          <li>Export progress is shown during GLB generation.</li>
        </ul>
      </div>
    </div>
  </div>
);

export default Instructions;
