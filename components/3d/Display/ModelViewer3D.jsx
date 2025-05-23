// import React, { useRef, useEffect, useState, useCallback } from "react";
// import * as THREE from "three";
// import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
// import {
//   Download,
//   Play,
//   Pause,
//   RotateCcw,
//   Camera,
//   Settings as SettingsIcon,
//   Shuffle,
// } from "lucide-react";

// // --- Shape Creation Functions (Keep your existing functions) ---
// // Animals
// const createCatShape = (size = 1) => {
//   const shape = new THREE.Shape();
//   shape.moveTo(0, size * 0.8);
//   shape.bezierCurveTo(
//     -size * 0.6,
//     size * 0.8,
//     -size * 0.8,
//     size * 0.4,
//     -size * 0.8,
//     0
//   );
//   shape.bezierCurveTo(
//     -size * 0.8,
//     -size * 0.6,
//     -size * 0.4,
//     -size * 0.8,
//     0,
//     -size * 0.8
//   );
//   shape.bezierCurveTo(
//     size * 0.4,
//     -size * 0.8,
//     size * 0.8,
//     -size * 0.6,
//     size * 0.8,
//     0
//   );
//   shape.bezierCurveTo(
//     size * 0.8,
//     size * 0.4,
//     size * 0.6,
//     size * 0.8,
//     0,
//     size * 0.8
//   );
//   const ear1 = new THREE.Path();
//   ear1.moveTo(-size * 0.4, size * 0.6);
//   ear1.lineTo(-size * 0.7, size * 1.2);
//   ear1.lineTo(-size * 0.1, size * 0.9);
//   ear1.closePath();
//   const ear2 = new THREE.Path();
//   ear2.moveTo(size * 0.4, size * 0.6);
//   ear2.lineTo(size * 0.7, size * 1.2);
//   ear2.lineTo(size * 0.1, size * 0.9);
//   ear2.closePath();
//   shape.holes.push(ear1);
//   shape.holes.push(ear2);
//   return shape;
// };
// const createBirdShape = (size = 1) => {
//   const shape = new THREE.Shape();
//   shape.moveTo(0, size * 0.6);
//   shape.bezierCurveTo(
//     -size * 0.8,
//     size * 0.4,
//     -size * 0.9,
//     -size * 0.2,
//     -size * 0.6,
//     -size * 0.6
//   );
//   shape.bezierCurveTo(
//     -size * 0.3,
//     -size * 0.8,
//     size * 0.3,
//     -size * 0.8,
//     size * 0.6,
//     -size * 0.6
//   );
//   shape.bezierCurveTo(
//     size * 0.9,
//     -size * 0.2,
//     size * 0.8,
//     size * 0.4,
//     0,
//     size * 0.6
//   );
//   const wing = new THREE.Path();
//   wing.moveTo(-size * 0.3, size * 0.2);
//   wing.bezierCurveTo(
//     -size * 0.7,
//     size * 0.3,
//     -size * 0.8,
//     0,
//     -size * 0.5,
//     -size * 0.3
//   );
//   wing.bezierCurveTo(
//     -size * 0.2,
//     -size * 0.1,
//     -size * 0.1,
//     size * 0.1,
//     -size * 0.3,
//     size * 0.2
//   );
//   shape.holes.push(wing);
//   return shape;
// };
// const createFishShape = (size = 1) => {
//   const shape = new THREE.Shape();
//   shape.moveTo(-size * 0.8, 0);
//   shape.bezierCurveTo(
//     -size * 0.6,
//     size * 0.4,
//     -size * 0.2,
//     size * 0.5,
//     size * 0.2,
//     size * 0.3
//   );
//   shape.bezierCurveTo(size * 0.6, size * 0.2, size * 0.8, 0, size * 0.8, 0);
//   shape.bezierCurveTo(
//     size * 0.6,
//     -size * 0.2,
//     size * 0.2,
//     -size * 0.3,
//     -size * 0.2,
//     -size * 0.5
//   );
//   shape.bezierCurveTo(-size * 0.6, -size * 0.4, -size * 0.8, 0, -size * 0.8, 0);
//   shape.moveTo(size * 0.8, 0);
//   shape.lineTo(size * 1.2, size * 0.3);
//   shape.lineTo(size * 1.0, 0);
//   shape.lineTo(size * 1.2, -size * 0.3);
//   shape.lineTo(size * 0.8, 0);
//   return shape;
// };
// // Sports
// const createSoccerBallShape = (size = 1) => {
//   const shape = new THREE.Shape();
//   const radius = size * 0.8;
//   for (let i = 0; i < 6; i++) {
//     const angle = (i / 6) * Math.PI * 2;
//     const x = Math.cos(angle) * radius;
//     const y = Math.sin(angle) * radius;
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.closePath();
//   const innerHex = new THREE.Path();
//   const innerRadius = size * 0.4;
//   for (let i = 0; i < 6; i++) {
//     const angle = (i / 6) * Math.PI * 2;
//     const x = Math.cos(angle) * innerRadius;
//     const y = Math.sin(angle) * innerRadius;
//     if (i === 0) innerHex.moveTo(x, y);
//     else innerHex.lineTo(x, y);
//   }
//   innerHex.closePath();
//   shape.holes.push(innerHex);
//   return shape;
// };
// const createTennisRacketShape = (size = 1) => {
//   const shape = new THREE.Shape();
//   const a = size * 0.6;
//   const b = size * 0.4;
//   for (let i = 0; i <= 32; i++) {
//     const angle = (i / 32) * Math.PI * 2;
//     const x = Math.cos(angle) * a;
//     const y = Math.sin(angle) * b + size * 0.3;
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.lineTo(size * 0.1, -size * 0.8);
//   shape.lineTo(-size * 0.1, -size * 0.8);
//   shape.closePath();
//   return shape;
// };
// const createBasketballShape = (size = 1) => {
//   const shape = new THREE.Shape();
//   const radius = size * 0.8;
//   for (let i = 0; i <= 32; i++) {
//     const angle = (i / 32) * Math.PI * 2;
//     const x = Math.cos(angle) * radius;
//     const y = Math.sin(angle) * radius;
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.closePath();
//   return shape;
// };
// // People & Characters
// const createPersonShape = (size = 1) => {
//   const shape = new THREE.Shape();
//   const headRadius = size * 0.2;
//   for (let i = 0; i <= 16; i++) {
//     const angle = (i / 16) * Math.PI * 2;
//     const x = Math.cos(angle) * headRadius;
//     const y = Math.sin(angle) * headRadius + size * 0.6;
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.lineTo(-size * 0.3, size * 0.2);
//   shape.lineTo(-size * 0.4, -size * 0.4);
//   shape.lineTo(-size * 0.2, -size * 0.8);
//   shape.lineTo(size * 0.2, -size * 0.8);
//   shape.lineTo(size * 0.4, -size * 0.4);
//   shape.lineTo(size * 0.3, size * 0.2);
//   shape.closePath();
//   return shape;
// };
// const createRobotShape = (size = 1) => {
//   const shape = new THREE.Shape();
//   shape.moveTo(-size * 0.4, size * 0.8);
//   shape.lineTo(size * 0.4, size * 0.8);
//   shape.lineTo(size * 0.4, size * 0.4);
//   shape.lineTo(-size * 0.4, size * 0.4);
//   shape.closePath();
//   shape.moveTo(-size * 0.5, size * 0.4);
//   shape.lineTo(size * 0.5, size * 0.4);
//   shape.lineTo(size * 0.5, -size * 0.4);
//   shape.lineTo(-size * 0.5, -size * 0.4);
//   shape.closePath();
//   shape.moveTo(-size * 0.3, -size * 0.4);
//   shape.lineTo(-size * 0.1, -size * 0.4);
//   shape.lineTo(-size * 0.1, -size * 0.8);
//   shape.lineTo(-size * 0.3, -size * 0.8);
//   shape.closePath();
//   shape.moveTo(size * 0.1, -size * 0.4);
//   shape.lineTo(size * 0.3, -size * 0.4);
//   shape.lineTo(size * 0.3, -size * 0.8);
//   shape.lineTo(size * 0.1, -size * 0.8);
//   shape.closePath();
//   return shape;
// };
// // Objects & Popular Items
// const createPhoneShape = (size = 1) => {
//   const shape = new THREE.Shape();
//   const width = size * 0.5;
//   const height = size * 1.0;
//   const radius = size * 0.1;
//   shape.moveTo(-width + radius, height);
//   shape.lineTo(width - radius, height);
//   shape.quadraticCurveTo(width, height, width, height - radius);
//   shape.lineTo(width, -height + radius);
//   shape.quadraticCurveTo(width, -height, width - radius, -height);
//   shape.lineTo(-width + radius, -height);
//   shape.quadraticCurveTo(-width, -height, -width, -height + radius);
//   shape.lineTo(-width, height - radius);
//   shape.quadraticCurveTo(-width, height, -width + radius, height);
//   shape.closePath();
//   const screen = new THREE.Path();
//   const screenWidth = width * 0.8;
//   const screenHeight = height * 0.8;
//   const screenRadius = radius * 0.5;
//   screen.moveTo(-screenWidth + screenRadius, screenHeight);
//   screen.lineTo(screenWidth - screenRadius, screenHeight);
//   screen.quadraticCurveTo(
//     screenWidth,
//     screenHeight,
//     screenWidth,
//     screenHeight - screenRadius
//   );
//   screen.lineTo(screenWidth, -screenHeight + screenRadius);
//   screen.quadraticCurveTo(
//     screenWidth,
//     -screenHeight,
//     screenWidth - screenRadius,
//     -screenHeight
//   );
//   screen.lineTo(-screenWidth + screenRadius, -screenHeight);
//   screen.quadraticCurveTo(
//     -screenWidth,
//     -screenHeight,
//     -screenWidth,
//     -screenHeight + screenRadius
//   );
//   screen.lineTo(-screenWidth, screenHeight - screenRadius);
//   screen.quadraticCurveTo(
//     -screenWidth,
//     screenHeight,
//     -screenWidth + screenRadius,
//     screenHeight
//   );
//   screen.closePath();
//   shape.holes.push(screen);
//   return shape;
// };
// const createLightningShape = (size = 1) => {
//   const shape = new THREE.Shape();
//   shape.moveTo(-size * 0.2, size * 0.8);
//   shape.lineTo(size * 0.3, size * 0.2);
//   shape.lineTo(size * 0.1, size * 0.2);
//   shape.lineTo(size * 0.4, -size * 0.8);
//   shape.lineTo(-size * 0.1, -size * 0.2);
//   shape.lineTo(size * 0.1, -size * 0.2);
//   shape.lineTo(-size * 0.4, size * 0.8); // Corrected typo from shape.lineTo(-size * 0.4, size * 0.8);
//   shape.closePath();
//   return shape;
// };
// const createMusicNoteShape = (size = 1) => {
//   const shape = new THREE.Shape();
//   const noteRadius = size * 0.15;
//   for (let i = 0; i <= 16; i++) {
//     const angle = (i / 16) * Math.PI * 2;
//     const x = Math.cos(angle) * noteRadius - size * 0.2;
//     const y = Math.sin(angle) * noteRadius - size * 0.4;
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.lineTo(-size * 0.05, size * 0.6);
//   shape.lineTo(size * 0.05, size * 0.6);
//   shape.lineTo(size * 0.05, -size * 0.25);
//   shape.closePath(); // Close the main note stem and head part

//   // Create the flag part as a separate sub-path if needed, or ensure it's connected
//   // The original was creating two closed paths. For a single shape, it might be better to make it continuous or a compound shape
//   // For simplicity here, keeping original structure which results in a filled shape based on winding rules
//   const flagPath = new THREE.Path(); // Use Path if it's a hole or add to shape directly
//   flagPath.moveTo(size * 0.05, size * 0.6);
//   flagPath.bezierCurveTo(
//     size * 0.4,
//     size * 0.5,
//     size * 0.3,
//     size * 0.2,
//     size * 0.05,
//     size * 0.3
//   );
//   flagPath.closePath();
//   // If this is meant to be a hole, add to shape.holes. If part of the main outline, it should be part of the main shape's path.
//   // Assuming it's part of the main filled area by how it was written (shape.moveTo, then shape.bezierCurveTo)
//   // For correct ExtrudeGeometry, it's best if shapes are simple and non-self-intersecting.
//   // Let's connect it to the main shape properly for a single fill.
//   // Or, make it a hole if that was the intent. Given the previous closePath, this looks like it might be a second fill.
//   // Re-interpreting the second part as an extension rather than a separate path:
//   shape.moveTo(size * 0.05, size * 0.6); // Re-ensure starting point if it's a new contour
//   shape.bezierCurveTo(
//     size * 0.4,
//     size * 0.5,
//     size * 0.3,
//     size * 0.2,
//     size * 0.05,
//     size * 0.3
//   );
//   shape.closePath(); // This will close the flag to size * 0.05, size * 0.6.

//   return shape;
// };

// // --- Animation Presets (Keep your existing presets) ---
// const animationPresets = {
//   gentle: {
//     rotationSpeed: [0.002, 0.004, 0.001],
//     floatAmplitude: 0.03,
//     floatSpeed: 0.0003,
//   },
//   energetic: {
//     rotationSpeed: [0.008, 0.012, 0.004],
//     floatAmplitude: 0.08,
//     floatSpeed: 0.001,
//   },
//   dramatic: {
//     rotationSpeed: [0.01, 0.005, 0.015],
//     floatAmplitude: 0.12,
//     floatSpeed: 0.0008,
//   },
//   bounce: {
//     rotationSpeed: [0.003, 0.006, 0.002],
//     floatAmplitude: 0.15,
//     floatSpeed: 0.002,
//   },
//   spin: {
//     rotationSpeed: [0.02, 0.02, 0.02],
//     floatAmplitude: 0.02,
//     floatSpeed: 0.0005,
//   },
// };

// // --- Enhanced Material Creation (Keep your existing function) ---
// const createAdvancedMaterial = (baseColor, materialType = "standard") => {
//   const color = new THREE.Color(baseColor);
//   const materialPresets = {
//     metallic: { metalness: 0.9, roughness: 0.1, envMapIntensity: 1.2 },
//     glass: {
//       metalness: 0.0,
//       roughness: 0.0,
//       transmission: 0.9,
//       thickness: 0.5, // Required for MeshPhysicalMaterial transmission
//       transparent: true,
//       opacity: 0.8, // This will interact with transmission
//     },
//     ceramic: { metalness: 0.1, roughness: 0.6, envMapIntensity: 0.8 },
//     organic: { metalness: 0.0, roughness: 0.8, envMapIntensity: 0.5 },
//     plastic: { metalness: 0.0, roughness: 0.3, envMapIntensity: 0.7 },
//     neon: {
//       metalness: 0.0,
//       roughness: 0.1,
//       emissive: color.clone().multiplyScalar(0.8), // Adjusted emissive
//       emissiveIntensity: 1.0,
//     },
//   };
//   const preset = materialPresets[materialType] || materialPresets.ceramic; // Default to ceramic if type unknown
//   const sharedProps = { color, ...preset, side: THREE.DoubleSide };

//   if (materialType === "glass") {
//     return new THREE.MeshPhysicalMaterial(sharedProps);
//   }
//   return new THREE.MeshStandardMaterial(sharedProps);
// };

// // --- 3D Shape Creation (Keep your existing function) ---
// const create3DShape = (shapeId, settings, size = 1) => {
//   let shape;
//   let materialType =
//     settings.materialType === "auto" ? "ceramic" : settings.materialType;

//   const shapeConfigs = {
//     cat: { creator: createCatShape, autoMaterial: "organic" },
//     bird: { creator: createBirdShape, autoMaterial: "organic" },
//     fish: { creator: createFishShape, autoMaterial: "metallic" },
//     soccer: { creator: createSoccerBallShape, autoMaterial: "plastic" },
//     tennis: { creator: createTennisRacketShape, autoMaterial: "plastic" },
//     basketball: { creator: createBasketballShape, autoMaterial: "plastic" },
//     person: { creator: createPersonShape, autoMaterial: "organic" },
//     robot: { creator: createRobotShape, autoMaterial: "metallic" },
//     phone: { creator: createPhoneShape, autoMaterial: "glass" },
//     lightning: { creator: createLightningShape, autoMaterial: "neon" },
//     music: { creator: createMusicNoteShape, autoMaterial: "metallic" },
//   };

//   const config = shapeConfigs[shapeId] || shapeConfigs.cat; // Default to cat
//   shape = config.creator(size);
//   if (settings.materialType === "auto") {
//     materialType = config.autoMaterial;
//   }

//   const extrudeSettings = {
//     depth: settings.extrudeDepth,
//     bevelEnabled: true,
//     bevelSegments:
//       settings.quality === "high" ? 8 : settings.quality === "medium" ? 4 : 2,
//     steps:
//       settings.quality === "high" ? 4 : settings.quality === "medium" ? 2 : 1,
//     bevelSize: 0.05 * (size / 1.5), // Scale bevel with size
//     bevelThickness: 0.03 * (size / 1.5), // Scale bevel with size
//     // This affects the smoothness of curves in the 2D shape when extruded
//     curveSegments:
//       settings.quality === "high" ? 32 : settings.quality === "medium" ? 16 : 8,
//   };
//   const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
//   geometry.computeVertexNormals(); // Important for lighting
//   geometry.center(); // Center the geometry for easier positioning and rotation

//   const material = createAdvancedMaterial(settings.shapeColor, materialType);
//   return new THREE.Mesh(geometry, material);
// };

// // --- UI Components (Keep your existing components) ---
// const CategorySelector = ({
//   categories,
//   currentCategory,
//   onCategorySelect,
// }) => (
//   <div className='bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/70 shadow-lg'>
//     <h3 className='text-lg font-semibold text-white mb-3'>Categories</h3>
//     <div className='grid grid-cols-2 gap-2'>
//       {categories.map((category) => (
//         <button
//           key={category.id}
//           onClick={() => onCategorySelect(category.id)}
//           className={`flex flex-col items-center justify-center text-center gap-1 p-3 rounded-lg transition-all text-xs sm:text-sm h-20 sm:h-24 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
//             currentCategory === category.id
//               ? "bg-purple-600 text-white shadow-xl scale-105"
//               : "bg-slate-700/70 text-slate-300 hover:bg-slate-600/80 hover:shadow-md"
//           }`}
//         >
//           <span className='text-2xl sm:text-3xl'>{category.icon}</span>
//           <span className='font-medium mt-1'>{category.name}</span>
//         </button>
//       ))}
//     </div>
//   </div>
// );
// const ShapeSelector = ({ shapes, currentShape, onShapeSelect }) => (
//   <div className='bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/70 shadow-lg'>
//     <h3 className='text-lg font-semibold text-white mb-3'>Shapes</h3>
//     <div className='grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1'>
//       {shapes.map((shape) => (
//         <button
//           key={shape.id}
//           onClick={() => onShapeSelect(shape.id)}
//           className={`flex items-center justify-start gap-2 p-3 rounded-lg transition-all text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
//             currentShape === shape.id
//               ? "bg-purple-500 text-white shadow-lg"
//               : "bg-slate-700/70 text-slate-300 hover:bg-slate-600/80"
//           }`}
//         >
//           <span className='text-xl'>{shape.icon}</span>
//           <span className='font-medium'>{shape.name}</span>
//         </button>
//       ))}
//     </div>
//   </div>
// );
// const AnimationControls = ({
//   isAnimating,
//   onToggleAnimation,
//   onResetAnimation,
//   animationPreset,
//   onPresetChange,
//   onRandomize,
// }) => (
//   <div className='bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/70 shadow-lg'>
//     <h3 className='text-lg font-semibold text-white mb-3'>Animation</h3>
//     <div className='space-y-3'>
//       <button
//         onClick={onToggleAnimation}
//         className={`w-full flex items-center justify-center gap-2 p-2.5 rounded-lg transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 ${
//           isAnimating
//             ? "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400"
//             : "bg-green-500 hover:bg-green-600 text-white focus:ring-green-400"
//         }`}
//       >
//         {isAnimating ? <Pause size={16} /> : <Play size={16} />}
//         {isAnimating ? "Pause" : "Play"}
//       </button>
//       <select
//         value={animationPreset}
//         onChange={(e) => onPresetChange(e.target.value)}
//         className='w-full p-2.5 bg-slate-700 text-white rounded-lg border border-slate-600 text-sm focus:ring-purple-500 focus:border-purple-500'
//       >
//         {Object.keys(animationPresets).map((presetKey) => (
//           <option key={presetKey} value={presetKey} className='capitalize'>
//             {presetKey.charAt(0).toUpperCase() + presetKey.slice(1)}
//           </option>
//         ))}
//       </select>
//       <div className='grid grid-cols-2 gap-2'>
//         <button
//           onClick={onResetAnimation}
//           className='flex items-center justify-center gap-1 p-2.5 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-400'
//         >
//           <RotateCcw size={14} /> Reset
//         </button>
//         <button
//           onClick={onRandomize}
//           className='flex items-center justify-center gap-1 p-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-400'
//         >
//           <Shuffle size={14} /> Random
//         </button>
//       </div>
//     </div>
//   </div>
// );
// const ExportControls = ({
//   onExportGLB,
//   onExportOBJ,
//   onTakeScreenshot,
//   isExporting,
//   exportProgress,
// }) => (
//   <div className='bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/70 shadow-lg'>
//     <h3 className='text-lg font-semibold text-white mb-3'>Export</h3>
//     <div className='space-y-2'>
//       <button
//         onClick={onExportGLB}
//         disabled={isExporting}
//         className='w-full flex items-center justify-center gap-2 p-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600/70 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-400'
//       >
//         <Download size={14} />
//         {isExporting && exportProgress > 0 && exportProgress <= 100 // Check if progress is for GLB, assuming only one export at a time
//           ? `GLB... ${Math.round(exportProgress)}%`
//           : "Export GLB"}
//       </button>
//       <button
//         onClick={onExportOBJ}
//         disabled={isExporting}
//         className='w-full flex items-center justify-center gap-2 p-2.5 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600/70 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-teal-400'
//       >
//         <Download size={14} />
//         {isExporting && exportProgress > 0 && exportProgress <= 100 // Check if progress is for OBJ
//           ? `OBJ... ${Math.round(exportProgress)}%` // Simple check, assumes only one export at a time
//           : "Export OBJ"}
//       </button>
//       <button
//         onClick={onTakeScreenshot}
//         disabled={isExporting}
//         className='w-full flex items-center justify-center gap-2 p-2.5 bg-purple-500 hover:bg-purple-600 disabled:bg-slate-600/70 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-purple-400'
//       >
//         <Camera size={14} /> Screenshot
//       </button>
//     </div>
//   </div>
// );
// const ThreeDViewer = ({ mountRef, isExporting, exportProgress }) => (
//   <div className='lg:col-span-3 xl:col-span-3 order-first lg:order-last'>
//     <div className='bg-slate-800/30 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-slate-700/50 shadow-2xl aspect-[4/3]'>
//       <div className='relative w-full h-full'>
//         <div
//           ref={mountRef}
//           className='w-full h-full rounded-lg overflow-hidden'
//         />
//         {isExporting && (
//           <div className='absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-lg z-10'>
//             <div className='bg-slate-100 p-6 sm:p-8 rounded-xl shadow-2xl text-center'>
//               <div className='text-xl sm:text-2xl font-bold text-slate-800 mb-4'>
//                 Exporting Model
//               </div>
//               <div className='text-lg text-slate-700 mb-2'>
//                 {Math.round(exportProgress)}%
//               </div>
//               <div className='w-48 sm:w-56 h-3 bg-slate-300 rounded-full overflow-hidden'>
//                 <div
//                   className='h-full bg-blue-500 transition-width duration-300'
//                   style={{ width: `${Math.round(exportProgress)}%` }}
//                 />
//               </div>
//               <p className='text-xs text-slate-500 mt-3'>Please wait...</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   </div>
// );
// const SettingsPanel = ({ settings, onSettingsChange, show, onClose }) => {
//   if (!show) return null;
//   const handleInputChange = (e) => {
//     const { name, value, type } = e.target;
//     onSettingsChange((prev) => ({
//       ...prev,
//       [name]: type === "range" ? parseFloat(value) : value,
//     }));
//   };
//   return (
//     <div
//       className='fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50'
//       onClick={onClose}
//     >
//       <div
//         className='bg-slate-800 rounded-xl p-6 border-slate-700 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl'
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className='flex justify-between items-center mb-6'>
//           <h3 className='text-xl sm:text-2xl font-semibold text-white'>
//             Viewer Settings
//           </h3>
//           <button
//             onClick={onClose}
//             className='text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700'
//           >
//             <svg
//               xmlns='http://www.w3.org/2000/svg'
//               width='24'
//               height='24'
//               viewBox='0 0 24 24'
//               fill='none'
//               stroke='currentColor'
//               strokeWidth='2'
//               strokeLinecap='round'
//               strokeLinejoin='round'
//             >
//               <line x1='18' y1='6' x2='6' y2='18'></line>
//               <line x1='6' y1='6' x2='18' y2='18'></line>
//             </svg>
//           </button>
//         </div>
//         <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4'>
//           <div>
//             <label
//               htmlFor='materialType'
//               className='block text-sm font-medium text-slate-300 mb-1'
//             >
//               Material
//             </label>
//             <select
//               id='materialType'
//               name='materialType'
//               value={settings.materialType}
//               onChange={handleInputChange}
//               className='w-full p-2.5 bg-slate-700 text-white rounded-lg border border-slate-600 focus:ring-1 focus:ring-purple-500 focus:border-purple-500'
//             >
//               <option value='auto'>Auto Detect</option>
//               <option value='metallic'>Metallic</option>
//               <option value='glass'>Glass</option>
//               <option value='ceramic'>Ceramic</option>
//               <option value='organic'>Organic</option>
//               <option value='plastic'>Plastic</option>
//               <option value='neon'>Neon</option>
//             </select>
//           </div>
//           <div>
//             <label
//               htmlFor='shapeColor'
//               className='block text-sm font-medium text-slate-300 mb-1'
//             >
//               Color
//             </label>
//             <input
//               id='shapeColor'
//               name='shapeColor'
//               type='color'
//               value={settings.shapeColor}
//               onChange={handleInputChange}
//               className='w-full h-10 p-1 bg-slate-700 rounded-lg border border-slate-600 cursor-pointer'
//             />
//           </div>
//           <div>
//             <label
//               htmlFor='animationSpeed'
//               className='block text-sm font-medium text-slate-300 mb-1'
//             >
//               Anim. Speed: {settings.animationSpeed.toFixed(1)}x
//             </label>
//             <input
//               id='animationSpeed'
//               name='animationSpeed'
//               type='range'
//               min='0.1'
//               max='3'
//               step='0.1'
//               value={settings.animationSpeed}
//               onChange={handleInputChange}
//               className='w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-500'
//             />
//           </div>
//           <div>
//             <label
//               htmlFor='lightIntensity'
//               className='block text-sm font-medium text-slate-300 mb-1'
//             >
//               Light: {settings.lightIntensity.toFixed(1)}x
//             </label>
//             <input
//               id='lightIntensity'
//               name='lightIntensity'
//               type='range'
//               min='0.1'
//               max='2.5'
//               step='0.1'
//               value={settings.lightIntensity}
//               onChange={handleInputChange}
//               className='w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-500'
//             />
//           </div>
//           <div>
//             <label
//               htmlFor='extrudeDepth'
//               className='block text-sm font-medium text-slate-300 mb-1'
//             >
//               Depth: {settings.extrudeDepth.toFixed(2)}
//             </label>
//             <input
//               id='extrudeDepth'
//               name='extrudeDepth'
//               type='range'
//               min='0.05'
//               max='1.5'
//               step='0.05'
//               value={settings.extrudeDepth}
//               onChange={handleInputChange}
//               className='w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-500'
//             />
//           </div>
//           <div>
//             <label
//               htmlFor='quality'
//               className='block text-sm font-medium text-slate-300 mb-1'
//             >
//               Quality
//             </label>
//             <select
//               id='quality'
//               name='quality'
//               value={settings.quality}
//               onChange={handleInputChange}
//               className='w-full p-2.5 bg-slate-700 text-white rounded-lg border border-slate-600 focus:ring-1 focus:ring-purple-500 focus:border-purple-500'
//             >
//               <option value='low'>Low</option>
//               <option value='medium'>Medium</option>
//               <option value='high'>High</option>
//             </select>
//           </div>
//           <div className='sm:col-span-2'>
//             <label
//               htmlFor='background'
//               className='block text-sm font-medium text-slate-300 mb-1'
//             >
//               Background
//             </label>
//             <select
//               id='background'
//               name='background'
//               value={settings.background}
//               onChange={handleInputChange}
//               className='w-full p-2.5 bg-slate-700 text-white rounded-lg border border-slate-600 focus:ring-1 focus:ring-purple-500 focus:border-purple-500'
//             >
//               <option value='modernGradient'>Modern Gradient</option>
//               <option value='darkSpace'>Dark Space</option>
//               <option value='softLight'>Soft Light</option>
//               <option value='studioDark'>Studio Dark</option>
//               <option value='studioLight'>Studio Light</option>
//             </select>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- Main Component ---
// const ModelViewer3D = () => {
//   const mountRef = useRef(null);
//   const sceneRef = useRef(null);
//   const rendererRef = useRef(null);
//   const cameraRef = useRef(null);
//   const meshRef = useRef(null);
//   const animationIdRef = useRef(null);
//   const lightsRef = useRef([]);
//   const skyboxMeshRef = useRef(null);

//   const categories = [
//     { id: "animals", name: "Animals", icon: "🐱" },
//     { id: "sports", name: "Sports", icon: "⚽" },
//     { id: "people", name: "People", icon: "👤" },
//     { id: "objects", name: "Objects", icon: "📱" },
//   ];
//   const shapesByCategory = {
//     animals: [
//       { id: "cat", name: "Cat", icon: "🐱" },
//       { id: "bird", name: "Bird", icon: "🐦" },
//       { id: "fish", name: "Fish", icon: "🐟" },
//     ],
//     sports: [
//       { id: "soccer", name: "Soccer", icon: "⚽" },
//       { id: "tennis", name: "Tennis", icon: "🎾" },
//       { id: "basketball", name: "Basketball", icon: "🏀" },
//     ],
//     people: [
//       { id: "person", name: "Person", icon: "👤" },
//       { id: "robot", name: "Robot", icon: "🤖" },
//     ],
//     objects: [
//       { id: "phone", name: "Phone", icon: "📱" },
//       { id: "lightning", name: "Lightning", icon: "⚡" },
//       { id: "music", name: "Music Note", icon: "🎵" },
//     ],
//   };

//   const backgroundOptions = {
//     modernGradient: "Modern Gradient",
//     darkSpace: "Dark Space",
//     softLight: "Soft Light",
//     studioDark: "Studio Dark",
//     studioLight: "Studio Light",
//   };

//   const [currentCategory, setCurrentCategory] = useState(categories[0].id);
//   const [currentShape, setCurrentShape] = useState(
//     shapesByCategory[categories[0].id][0].id
//   );
//   const [isAnimating, setIsAnimating] = useState(true);
//   const [animationPreset, setAnimationPreset] = useState("gentle");
//   const [showSettings, setShowSettings] = useState(false);
//   const [isExporting, setIsExporting] = useState(false);
//   const [exportProgress, setExportProgress] = useState(0);
//   const [settings, setSettings] = useState({
//     materialType: "auto",
//     shapeColor: "#a78bfa",
//     animationSpeed: 1.0,
//     lightIntensity: 1.2,
//     extrudeDepth: 0.4,
//     quality: "medium",
//     background: "modernGradient",
//   });

//   const animationState = useRef({
//     rotation: new THREE.Euler(),
//     targetRotation: new THREE.Euler(),
//     floatY: 0,
//     startTime: Date.now(),
//   });

//   useEffect(() => {
//     if (!mountRef.current) return;
//     const currentMount = mountRef.current;

//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(
//       50,
//       currentMount.clientWidth / currentMount.clientHeight,
//       0.1,
//       1000
//     );
//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

//     renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.shadowMap.enabled = true;
//     renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//     renderer.outputColorSpace = THREE.SRGBColorSpace;
//     renderer.toneMapping = THREE.ACESFilmicToneMapping;
//     renderer.toneMappingExposure = 1.0;

//     currentMount.appendChild(renderer.domElement);

//     camera.position.set(0, 0.5, 6);
//     camera.lookAt(0, 0, 0);

//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
//     scene.add(ambientLight);

//     const keyLight = new THREE.DirectionalLight(0xffffff, 0.7);
//     keyLight.position.set(8, 10, 8);
//     keyLight.castShadow = true;
//     keyLight.shadow.mapSize.width = 2048;
//     keyLight.shadow.mapSize.height = 2048;
//     keyLight.shadow.camera.near = 0.5;
//     keyLight.shadow.camera.far = 50;
//     keyLight.shadow.bias = -0.0005;
//     scene.add(keyLight);

//     const fillLight = new THREE.DirectionalLight(0xaaccff, 0.3);
//     fillLight.position.set(-8, 5, -5);
//     scene.add(fillLight);

//     lightsRef.current = [ambientLight, keyLight, fillLight];
//     sceneRef.current = scene;
//     rendererRef.current = renderer;
//     cameraRef.current = camera;

//     const handleResize = () => {
//       if (!currentMount || !cameraRef.current || !rendererRef.current) return;
//       const width = currentMount.clientWidth;
//       const height = currentMount.clientHeight;
//       cameraRef.current.aspect = width / height;
//       cameraRef.current.updateProjectionMatrix();
//       rendererRef.current.setSize(width, height);
//     };
//     window.addEventListener("resize", handleResize);
//     handleResize();

//     let mouse = new THREE.Vector2();
//     const targetCameraPos = new THREE.Vector3().copy(camera.position);

//     const onMouseMove = (event) => {
//       if (!currentMount) return;
//       const rect = currentMount.getBoundingClientRect();
//       mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
//       mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
//       targetCameraPos.x = mouse.x * 0.5;
//       targetCameraPos.y = camera.position.y + mouse.y * 0.3;
//     };
//     currentMount.addEventListener("mousemove", onMouseMove);

//     const clock = new THREE.Clock();
//     const animate = () => {
//       if (!sceneRef.current || !rendererRef.current || !cameraRef.current)
//         return;
//       animationIdRef.current = requestAnimationFrame(animate); // Request next frame first
//       const delta = clock.getDelta();

//       cameraRef.current.position.lerp(targetCameraPos, 0.05);
//       cameraRef.current.lookAt(0, animationState.current.floatY * 0.3, 0);

//       if (meshRef.current && isAnimating) {
//         const preset = animationPresets[animationPreset];
//         const time =
//           (Date.now() - animationState.current.startTime) *
//           0.001 *
//           settings.animationSpeed;

//         animationState.current.targetRotation.x +=
//           preset.rotationSpeed[0] * settings.animationSpeed * delta * 60;
//         animationState.current.targetRotation.y +=
//           preset.rotationSpeed[1] * settings.animationSpeed * delta * 60;
//         animationState.current.targetRotation.z +=
//           preset.rotationSpeed[2] * settings.animationSpeed * delta * 60;

//         meshRef.current.rotation.x = THREE.MathUtils.lerp(
//           meshRef.current.rotation.x,
//           animationState.current.targetRotation.x,
//           0.1
//         );
//         meshRef.current.rotation.y = THREE.MathUtils.lerp(
//           meshRef.current.rotation.y,
//           animationState.current.targetRotation.y,
//           0.1
//         );
//         meshRef.current.rotation.z = THREE.MathUtils.lerp(
//           meshRef.current.rotation.z,
//           animationState.current.targetRotation.z,
//           0.1
//         );

//         animationState.current.floatY =
//           Math.sin(time * preset.floatSpeed * 100) * preset.floatAmplitude;
//         meshRef.current.position.y = animationState.current.floatY;
//       }
//       rendererRef.current.render(sceneRef.current, cameraRef.current);
//     };
//     animate();

//     return () => {
//       window.removeEventListener("resize", handleResize);
//       if (currentMount)
//         currentMount.removeEventListener("mousemove", onMouseMove);
//       if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
//       if (rendererRef.current) {
//         if (currentMount && rendererRef.current.domElement) {
//           currentMount.removeChild(rendererRef.current.domElement);
//         }
//         rendererRef.current.dispose();
//       }
//       if (sceneRef.current) {
//         sceneRef.current.traverse((obj) => {
//           if (obj.geometry) obj.geometry.dispose();
//           if (obj.material) {
//             if (Array.isArray(obj.material))
//               obj.material.forEach((m) => m.dispose());
//             else obj.material.dispose();
//           }
//         });
//       }
//       if (skyboxMeshRef.current) {
//         skyboxMeshRef.current.geometry?.dispose();
//         skyboxMeshRef.current.material?.dispose();
//       }
//       sceneRef.current = null;
//       rendererRef.current = null;
//       cameraRef.current = null;
//       meshRef.current = null;
//       lightsRef.current = [];
//       skyboxMeshRef.current = null;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     if (!sceneRef.current || !rendererRef.current) return;

//     if (skyboxMeshRef.current) {
//       sceneRef.current.remove(skyboxMeshRef.current);
//       skyboxMeshRef.current.geometry?.dispose();
//       skyboxMeshRef.current.material?.dispose();
//       skyboxMeshRef.current = null;
//     }
//     sceneRef.current.background = null;
//     sceneRef.current.fog = null;
//     rendererRef.current.toneMappingExposure = 1.0; // Reset exposure

//     let topC,
//       bottomC,
//       fogC,
//       fogNear = 8,
//       fogFar = 30;

//     switch (settings.background) {
//       case "modernGradient":
//         topC = new THREE.Color(0x3a7ca5);
//         bottomC = new THREE.Color(0x1e3b49);
//         fogC = new THREE.Color(0x2c5d72);
//         break;
//       case "darkSpace":
//         sceneRef.current.background = new THREE.Color(0x05050a);
//         fogC = new THREE.Color(0x101520);
//         fogNear = 10;
//         fogFar = 35;
//         break;
//       case "softLight":
//         sceneRef.current.background = new THREE.Color(0xdde8f0);
//         fogC = new THREE.Color(0xb8c5d1);
//         fogNear = 7;
//         fogFar = 28;
//         if (rendererRef.current) rendererRef.current.toneMappingExposure = 0.9;
//         break;
//       case "studioDark":
//         sceneRef.current.background = new THREE.Color(0x111115);
//         fogC = new THREE.Color(0x181820);
//         fogNear = 12;
//         fogFar = 40;
//         break;
//       case "studioLight":
//         sceneRef.current.background = new THREE.Color(0xe0e0e0);
//         fogC = new THREE.Color(0xc0c0c0);
//         fogNear = 10;
//         fogFar = 35;
//         if (rendererRef.current) rendererRef.current.toneMappingExposure = 0.85;
//         break;
//       default:
//         topC = new THREE.Color(0x3a7ca5);
//         bottomC = new THREE.Color(0x1e3b49);
//         fogC = new THREE.Color(0x2c5d72);
//     }

//     if (settings.background === "modernGradient" && topC && bottomC) {
//       const gradientGeometry = new THREE.SphereGeometry(50, 32, 32);
//       const gradientMaterial = new THREE.ShaderMaterial({
//         uniforms: {
//           topColor: { value: topC },
//           bottomColor: { value: bottomC },
//           offset: { value: 33 },
//           exponent: { value: 0.7 },
//         },
//         vertexShader: `varying vec3 vWorldPosition; void main() { vec4 worldPosition = modelMatrix * vec4(position, 1.0); vWorldPosition = worldPosition.xyz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
//         fragmentShader: `uniform vec3 topColor; uniform vec3 bottomColor; uniform float offset; uniform float exponent; varying vec3 vWorldPosition; void main() { float h = normalize(vWorldPosition + offset).y; gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0); }`,
//         side: THREE.BackSide,
//       });
//       skyboxMeshRef.current = new THREE.Mesh(
//         gradientGeometry,
//         gradientMaterial
//       );
//       sceneRef.current.add(skyboxMeshRef.current);
//     }

//     if (fogC) {
//       sceneRef.current.fog = new THREE.Fog(fogC, fogNear, fogFar);
//     }
//   }, [settings.background]);

//   useEffect(() => {
//     const baseIntensities = [0.3, 0.7, 0.3];
//     lightsRef.current.forEach((light, index) => {
//       if (
//         light &&
//         light.intensity !== undefined &&
//         baseIntensities[index] !== undefined
//       ) {
//         light.intensity = baseIntensities[index] * settings.lightIntensity;
//       }
//     });
//   }, [settings.lightIntensity]);

//   useEffect(() => {
//     if (!sceneRef.current) return;
//     if (meshRef.current) {
//       sceneRef.current.remove(meshRef.current);
//       meshRef.current.geometry?.dispose();
//       meshRef.current.material?.dispose();
//     }
//     const mesh = create3DShape(currentShape, settings, 1.5);
//     mesh.castShadow = true;
//     mesh.receiveShadow = true;
//     mesh.position.set(0, 0, 0); // Initial position, animation might override Y
//     animationState.current.floatY = 0; // Reset floatY for new shape
//     if (meshRef.current) meshRef.current.position.y = 0; // Ensure old mesh doesn't affect new

//     sceneRef.current.add(mesh);
//     meshRef.current = mesh;
//   }, [currentShape, settings]);

//   const handleCategorySelect = useCallback(
//     (categoryId) => {
//       setCurrentCategory(categoryId);
//       setCurrentShape(shapesByCategory[categoryId][0].id);
//     },
//     [shapesByCategory]
//   );

//   const handleShapeSelect = useCallback((shapeId) => {
//     setCurrentShape(shapeId);
//   }, []);

//   const handleToggleAnimation = useCallback(() => {
//     setIsAnimating((prev) => !prev);
//   }, []);

//   const handleResetAnimation = useCallback(() => {
//     animationState.current.rotation.set(0, 0, 0);
//     animationState.current.targetRotation.set(0, 0, 0);
//     animationState.current.floatY = 0;
//     animationState.current.startTime = Date.now();
//     if (meshRef.current) {
//       meshRef.current.rotation.set(0, 0, 0);
//       meshRef.current.position.y = 0;
//     }
//   }, []);

//   const handleRandomize = useCallback(() => {
//     const randomCategory =
//       categories[Math.floor(Math.random() * categories.length)];
//     const randomShapeList = shapesByCategory[randomCategory.id];
//     const randomShape =
//       randomShapeList[Math.floor(Math.random() * randomShapeList.length)];
//     const randomPresetKey =
//       Object.keys(animationPresets)[
//         Math.floor(Math.random() * Object.keys(animationPresets).length)
//       ];
//     const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
//     const bgKeys = Object.keys(backgroundOptions);
//     const randomBgKey = bgKeys[Math.floor(Math.random() * bgKeys.length)];

//     setCurrentCategory(randomCategory.id);
//     setCurrentShape(randomShape.id);
//     setAnimationPreset(randomPresetKey);
//     setSettings((prev) => ({
//       ...prev,
//       shapeColor: randomColor,
//       background: randomBgKey,
//     }));
//     handleResetAnimation();
//   }, [categories, shapesByCategory, backgroundOptions, handleResetAnimation]);

//   const handleExportGLB = useCallback(() => {
//     if (!meshRef.current) {
//       console.error("No mesh available for export.");
//       return;
//     }
//     if (isExporting) return;

//     setIsExporting(true);
//     setExportProgress(0);

//     const exporter = new GLTFExporter();
//     const options = { binary: true };

//     let progress = 0;
//     const progressInterval = setInterval(() => {
//       progress += Math.floor(Math.random() * 5 + 5);
//       if (progress >= 95) {
//         clearInterval(progressInterval);
//         setExportProgress(95);
//       } else {
//         setExportProgress(progress);
//       }
//     }, 80);

//     setTimeout(() => {
//       try {
//         exporter.parse(
//           meshRef.current,
//           (gltf) => {
//             clearInterval(progressInterval);
//             setExportProgress(98);

//             if (!(gltf instanceof ArrayBuffer)) {
//               console.error(
//                 "GLTFExporter.parse did not return ArrayBuffer for GLB."
//               );
//               setIsExporting(false);
//               setExportProgress(0);
//               return;
//             }

//             const blob = new Blob([gltf], { type: "application/octet-stream" });
//             const link = document.createElement("a");
//             link.href = URL.createObjectURL(blob);
//             link.download = `shape-${currentShape}.glb`;
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             URL.revokeObjectURL(link.href);

//             setExportProgress(100);
//             setTimeout(() => setIsExporting(false), 300);
//           },
//           (error) => {
//             clearInterval(progressInterval);
//             console.error("GLTFExporter.parse error:", error);
//             setIsExporting(false);
//             setExportProgress(0);
//           },
//           options
//         );
//       } catch (e) {
//         clearInterval(progressInterval);
//         console.error("Error setting up GLTF export:", e);
//         setIsExporting(false);
//         setExportProgress(0);
//       }
//     }, 50);
//   }, [currentShape, isExporting]);

//   const handleSimulatedExportOBJ = useCallback(() => {
//     if (isExporting) return;

//     setIsExporting(true);
//     setExportProgress(0);

//     let progress = 0;
//     const interval = setInterval(() => {
//       progress += Math.floor(Math.random() * 15 + 10);
//       if (progress >= 100) {
//         clearInterval(interval);
//         setExportProgress(100);

//         const link = document.createElement("a");
//         link.download = `shape-${currentShape}.obj`;
//         link.href =
//           "data:text/plain;charset=utf-8," +
//           encodeURIComponent(
//             "# OBJ file simulated\n# Replace with actual OBJ exporter output"
//           );
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);

//         setTimeout(() => setIsExporting(false), 300);
//       } else {
//         setExportProgress(progress);
//       }
//     }, 150);
//   }, [currentShape, isExporting]);

//   const handleTakeScreenshot = useCallback(() => {
//     if (!rendererRef.current) return;
//     const canvas = rendererRef.current.domElement;
//     const link = document.createElement("a");
//     link.download = `screenshot-${currentShape}.png`;
//     link.href = canvas.toDataURL();
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   }, [currentShape]);

//   return (
//     <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-3 sm:p-4 md:p-6 text-white select-none'>
//       <div className='max-w-screen-xl mx-auto'>
//         <header className='text-center mb-6 sm:mb-8'>
//           <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent'>
//             3D Shape <span className=''>Studio</span>
//           </h1>
//           <p className='text-slate-300 text-sm sm:text-base max-w-2xl mx-auto'>
//             Explore, customize, and animate a diverse collection of 3D shapes.
//           </p>
//         </header>
//         <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6'>
//           <div className='lg:col-span-1 space-y-4 sm:space-y-5 order-last lg:order-first'>
//             <CategorySelector
//               categories={categories}
//               currentCategory={currentCategory}
//               onCategorySelect={handleCategorySelect}
//             />
//             <ShapeSelector
//               shapes={shapesByCategory[currentCategory]}
//               currentShape={currentShape}
//               onShapeSelect={handleShapeSelect}
//             />
//             <AnimationControls
//               isAnimating={isAnimating}
//               onToggleAnimation={handleToggleAnimation}
//               onResetAnimation={handleResetAnimation}
//               animationPreset={animationPreset}
//               onPresetChange={setAnimationPreset}
//               onRandomize={handleRandomize}
//             />
//             <ExportControls
//               onExportGLB={handleExportGLB}
//               onExportOBJ={handleSimulatedExportOBJ}
//               onTakeScreenshot={handleTakeScreenshot}
//               isExporting={isExporting}
//               exportProgress={exportProgress} // Pass raw progress
//             />
//             <button
//               onClick={() => setShowSettings(true)}
//               className='w-full flex items-center justify-center gap-2 p-3 bg-slate-700 hover:bg-slate-600/90 text-white rounded-lg transition-all text-sm font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500'
//             >
//               <SettingsIcon size={16} />
//               Viewer Settings
//             </button>
//           </div>

//           <ThreeDViewer
//             mountRef={mountRef}
//             isExporting={isExporting}
//             exportProgress={exportProgress} // Pass raw progress
//           />
//         </div>
//         <SettingsPanel
//           settings={settings}
//           onSettingsChange={setSettings}
//           show={showSettings}
//           onClose={() => setShowSettings(false)}
//         />
//         <footer className='text-center mt-10 sm:mt-12 text-slate-400 text-xs sm:text-sm'>
//           <p>
//             © {new Date().getFullYear()} 3D Shape Studio. All rights reserved.
//           </p>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default ModelViewer3D;

import React, { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js"; // Ensure this is the correct path
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

import {
  Download,
  Play,
  Pause,
  RotateCcw,
  Camera,
  Settings as SettingsIcon,
  Shuffle,
} from "lucide-react";

// --- Shape Creation Functions (Keep your existing functions) ---
const createCatShape = (size = 1) => {
  const shape = new THREE.Shape();
  shape.moveTo(0, size * 0.8);
  shape.bezierCurveTo(
    -size * 0.6,
    size * 0.8,
    -size * 0.8,
    size * 0.4,
    -size * 0.8,
    0
  );
  shape.bezierCurveTo(
    -size * 0.8,
    -size * 0.6,
    -size * 0.4,
    -size * 0.8,
    0,
    -size * 0.8
  );
  shape.bezierCurveTo(
    size * 0.4,
    -size * 0.8,
    size * 0.8,
    -size * 0.6,
    size * 0.8,
    0
  );
  shape.bezierCurveTo(
    size * 0.8,
    size * 0.4,
    size * 0.6,
    size * 0.8,
    0,
    size * 0.8
  );
  const ear1 = new THREE.Path();
  ear1.moveTo(-size * 0.4, size * 0.6);
  ear1.lineTo(-size * 0.7, size * 1.2);
  ear1.lineTo(-size * 0.1, size * 0.9);
  ear1.closePath();
  const ear2 = new THREE.Path();
  ear2.moveTo(size * 0.4, size * 0.6);
  ear2.lineTo(size * 0.7, size * 1.2);
  ear2.lineTo(size * 0.1, size * 0.9);
  ear2.closePath();
  shape.holes.push(ear1);
  shape.holes.push(ear2);
  return shape;
};
const createBirdShape = (size = 1) => {
  const shape = new THREE.Shape();
  shape.moveTo(0, size * 0.6);
  shape.bezierCurveTo(
    -size * 0.8,
    size * 0.4,
    -size * 0.9,
    -size * 0.2,
    -size * 0.6,
    -size * 0.6
  );
  shape.bezierCurveTo(
    -size * 0.3,
    -size * 0.8,
    size * 0.3,
    -size * 0.8,
    size * 0.6,
    -size * 0.6
  );
  shape.bezierCurveTo(
    size * 0.9,
    -size * 0.2,
    size * 0.8,
    size * 0.4,
    0,
    size * 0.6
  );
  const wing = new THREE.Path();
  wing.moveTo(-size * 0.3, size * 0.2);
  wing.bezierCurveTo(
    -size * 0.7,
    size * 0.3,
    -size * 0.8,
    0,
    -size * 0.5,
    -size * 0.3
  );
  wing.bezierCurveTo(
    -size * 0.2,
    -size * 0.1,
    -size * 0.1,
    size * 0.1,
    -size * 0.3,
    size * 0.2
  );
  shape.holes.push(wing);
  return shape;
};
const createFishShape = (size = 1) => {
  const shape = new THREE.Shape();
  shape.moveTo(-size * 0.8, 0);
  shape.bezierCurveTo(
    -size * 0.6,
    size * 0.4,
    -size * 0.2,
    size * 0.5,
    size * 0.2,
    size * 0.3
  );
  shape.bezierCurveTo(size * 0.6, size * 0.2, size * 0.8, 0, size * 0.8, 0);
  shape.bezierCurveTo(
    size * 0.6,
    -size * 0.2,
    size * 0.2,
    -size * 0.3,
    -size * 0.2,
    -size * 0.5
  );
  shape.bezierCurveTo(-size * 0.6, -size * 0.4, -size * 0.8, 0, -size * 0.8, 0);
  shape.moveTo(size * 0.8, 0);
  shape.lineTo(size * 1.2, size * 0.3);
  shape.lineTo(size * 1.0, 0);
  shape.lineTo(size * 1.2, -size * 0.3);
  shape.lineTo(size * 0.8, 0);
  return shape;
};
const createSoccerBallShape = (size = 1) => {
  const shape = new THREE.Shape();
  const radius = size * 0.8;
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  const innerHex = new THREE.Path();
  const innerRadius = size * 0.4;
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const x = Math.cos(angle) * innerRadius;
    const y = Math.sin(angle) * innerRadius;
    if (i === 0) innerHex.moveTo(x, y);
    else innerHex.lineTo(x, y);
  }
  innerHex.closePath();
  shape.holes.push(innerHex);
  return shape;
};
const createTennisRacketShape = (size = 1) => {
  const shape = new THREE.Shape();
  const a = size * 0.6;
  const b = size * 0.4;
  for (let i = 0; i <= 32; i++) {
    const angle = (i / 32) * Math.PI * 2;
    const x = Math.cos(angle) * a;
    const y = Math.sin(angle) * b + size * 0.3;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.lineTo(size * 0.1, -size * 0.8);
  shape.lineTo(-size * 0.1, -size * 0.8);
  shape.closePath();
  return shape;
};
const createBasketballShape = (size = 1) => {
  const shape = new THREE.Shape();
  const radius = size * 0.8;
  for (let i = 0; i <= 32; i++) {
    const angle = (i / 32) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
};
const createPersonShape = (size = 1) => {
  const shape = new THREE.Shape();
  const headRadius = size * 0.2;
  for (let i = 0; i <= 16; i++) {
    const angle = (i / 16) * Math.PI * 2;
    const x = Math.cos(angle) * headRadius;
    const y = Math.sin(angle) * headRadius + size * 0.6;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.lineTo(-size * 0.3, size * 0.2);
  shape.lineTo(-size * 0.4, -size * 0.4);
  shape.lineTo(-size * 0.2, -size * 0.8);
  shape.lineTo(size * 0.2, -size * 0.8);
  shape.lineTo(size * 0.4, -size * 0.4);
  shape.lineTo(size * 0.3, size * 0.2);
  shape.closePath();
  return shape;
};
const createRobotShape = (size = 1) => {
  const shape = new THREE.Shape();
  shape.moveTo(-size * 0.4, size * 0.8);
  shape.lineTo(size * 0.4, size * 0.8);
  shape.lineTo(size * 0.4, size * 0.4);
  shape.lineTo(-size * 0.4, size * 0.4);
  shape.closePath();
  shape.moveTo(-size * 0.5, size * 0.4);
  shape.lineTo(size * 0.5, size * 0.4);
  shape.lineTo(size * 0.5, -size * 0.4);
  shape.lineTo(-size * 0.5, -size * 0.4);
  shape.closePath();
  shape.moveTo(-size * 0.3, -size * 0.4);
  shape.lineTo(-size * 0.1, -size * 0.4);
  shape.lineTo(-size * 0.1, -size * 0.8);
  shape.lineTo(-size * 0.3, -size * 0.8);
  shape.closePath();
  shape.moveTo(size * 0.1, -size * 0.4);
  shape.lineTo(size * 0.3, -size * 0.4);
  shape.lineTo(size * 0.3, -size * 0.8);
  shape.lineTo(size * 0.1, -size * 0.8);
  shape.closePath();
  return shape;
};
const createPhoneShape = (size = 1) => {
  const shape = new THREE.Shape();
  const width = size * 0.5;
  const height = size * 1.0;
  const radius = size * 0.1;
  shape.moveTo(-width + radius, height);
  shape.lineTo(width - radius, height);
  shape.quadraticCurveTo(width, height, width, height - radius);
  shape.lineTo(width, -height + radius);
  shape.quadraticCurveTo(width, -height, width - radius, -height);
  shape.lineTo(-width + radius, -height);
  shape.quadraticCurveTo(-width, -height, -width, -height + radius);
  shape.lineTo(-width, height - radius);
  shape.quadraticCurveTo(-width, height, -width + radius, height);
  shape.closePath();
  const screen = new THREE.Path();
  const screenWidth = width * 0.8;
  const screenHeight = height * 0.8;
  const screenRadius = radius * 0.5;
  screen.moveTo(-screenWidth + screenRadius, screenHeight);
  screen.lineTo(screenWidth - screenRadius, screenHeight);
  screen.quadraticCurveTo(
    screenWidth,
    screenHeight,
    screenWidth,
    screenHeight - screenRadius
  );
  screen.lineTo(screenWidth, -screenHeight + screenRadius);
  screen.quadraticCurveTo(
    screenWidth,
    -screenHeight,
    screenWidth - screenRadius,
    -screenHeight
  );
  screen.lineTo(-screenWidth + screenRadius, -screenHeight);
  screen.quadraticCurveTo(
    -screenWidth,
    -screenHeight,
    -screenWidth,
    -screenHeight + screenRadius
  );
  screen.lineTo(-screenWidth, screenHeight - screenRadius);
  screen.quadraticCurveTo(
    -screenWidth,
    screenHeight,
    -screenWidth + screenRadius,
    screenHeight
  );
  screen.closePath();
  shape.holes.push(screen);
  return shape;
};
const createLightningShape = (size = 1) => {
  const shape = new THREE.Shape();
  shape.moveTo(-size * 0.2, size * 0.8);
  shape.lineTo(size * 0.3, size * 0.2);
  shape.lineTo(size * 0.1, size * 0.2);
  shape.lineTo(size * 0.4, -size * 0.8);
  shape.lineTo(-size * 0.1, -size * 0.2);
  shape.lineTo(size * 0.1, -size * 0.2);
  shape.lineTo(-size * 0.4, size * 0.8);
  shape.closePath();
  return shape;
};
const createMusicNoteShape = (size = 1) => {
  const shape = new THREE.Shape();
  const noteRadius = size * 0.15;
  for (let i = 0; i <= 16; i++) {
    const angle = (i / 16) * Math.PI * 2;
    const x = Math.cos(angle) * noteRadius - size * 0.2;
    const y = Math.sin(angle) * noteRadius - size * 0.4;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.lineTo(-size * 0.05, size * 0.6);
  shape.lineTo(size * 0.05, size * 0.6);
  shape.lineTo(size * 0.05, -size * 0.25);
  shape.closePath();
  shape.moveTo(size * 0.05, size * 0.6);
  shape.bezierCurveTo(
    size * 0.4,
    size * 0.5,
    size * 0.3,
    size * 0.2,
    size * 0.05,
    size * 0.3
  );
  shape.closePath();
  return shape;
};

const animationPresets = {
  gentle: {
    rotationSpeed: [0.002, 0.004, 0.001],
    floatAmplitude: 0.03,
    floatSpeed: 0.0003,
  },
  energetic: {
    rotationSpeed: [0.008, 0.012, 0.004],
    floatAmplitude: 0.08,
    floatSpeed: 0.001,
  },
  dramatic: {
    rotationSpeed: [0.01, 0.005, 0.015],
    floatAmplitude: 0.12,
    floatSpeed: 0.0008,
  },
  bounce: {
    rotationSpeed: [0.003, 0.006, 0.002],
    floatAmplitude: 0.15,
    floatSpeed: 0.002,
  },
  spin: {
    rotationSpeed: [0.02, 0.02, 0.02],
    floatAmplitude: 0.02,
    floatSpeed: 0.0005,
  },
};

const createAdvancedMaterial = (baseColor, materialType = "standard") => {
  const color = new THREE.Color(baseColor);
  const materialPresets = {
    metallic: { metalness: 0.9, roughness: 0.1, envMapIntensity: 1.5 },
    glass: {
      metalness: 0.0,
      roughness: 0.0,
      transmission: 0.95,
      thickness: 0.7,
      transparent: true,
      opacity: 0.85,
      envMapIntensity: 2.0,
      ior: 1.52,
    },
    crystal: {
      metalness: 0.0,
      roughness: 0.01,
      transmission: 0.98,
      thickness: 0.6,
      transparent: true,
      opacity: 0.9,
      envMapIntensity: 2.5,
      ior: 1.7,
    },
    ceramic: { metalness: 0.1, roughness: 0.6, envMapIntensity: 0.8 },
    organic: { metalness: 0.0, roughness: 0.8, envMapIntensity: 0.5 },
    plastic: { metalness: 0.0, roughness: 0.3, envMapIntensity: 0.7 },
    neon: {
      metalness: 0.0,
      roughness: 0.1,
      emissive: color.clone().multiplyScalar(0.8),
      emissiveIntensity: 1.0,
      envMapIntensity: 0.2,
    },
  };
  const preset = materialPresets[materialType] || materialPresets.ceramic;
  const sharedProps = { color, ...preset, side: THREE.DoubleSide };
  if (materialType === "glass" || materialType === "crystal") {
    return new THREE.MeshPhysicalMaterial(sharedProps);
  }
  return new THREE.MeshStandardMaterial(sharedProps);
};

const create3DShape = (shapeId, settings, size = 1) => {
  let shape;
  let materialType =
    settings.materialType === "auto" ? "ceramic" : settings.materialType;
  const shapeConfigs = {
    cat: { creator: createCatShape, autoMaterial: "organic" },
    bird: { creator: createBirdShape, autoMaterial: "organic" },
    fish: { creator: createFishShape, autoMaterial: "metallic" },
    soccer: { creator: createSoccerBallShape, autoMaterial: "plastic" },
    tennis: { creator: createTennisRacketShape, autoMaterial: "plastic" },
    basketball: { creator: createBasketballShape, autoMaterial: "plastic" },
    person: { creator: createPersonShape, autoMaterial: "organic" },
    robot: { creator: createRobotShape, autoMaterial: "metallic" },
    phone: { creator: createPhoneShape, autoMaterial: "glass" },
    lightning: { creator: createLightningShape, autoMaterial: "neon" },
    music: { creator: createMusicNoteShape, autoMaterial: "metallic" },
  };
  const config = shapeConfigs[shapeId] || shapeConfigs.cat;
  shape = config.creator(size);
  if (settings.materialType === "auto") {
    materialType = config.autoMaterial;
  }
  const extrudeSettings = {
    depth: settings.extrudeDepth,
    bevelEnabled: true,
    bevelSegments:
      settings.quality === "high" ? 10 : settings.quality === "medium" ? 6 : 3,
    steps:
      settings.quality === "high" ? 5 : settings.quality === "medium" ? 3 : 1,
    bevelSize: 0.035 * (size / 1.5),
    bevelThickness: 0.025 * (size / 1.5),
    curveSegments:
      settings.quality === "high"
        ? 48
        : settings.quality === "medium"
        ? 24
        : 12,
  };
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geometry.computeVertexNormals();
  geometry.center();
  const material = createAdvancedMaterial(settings.shapeColor, materialType);
  return new THREE.Mesh(geometry, material);
};

const CategorySelector = ({
  categories,
  currentCategory,
  onCategorySelect,
}) => (
  <div className='bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/70 shadow-lg'>
    <h3 className='text-lg font-semibold text-white mb-3'>Categories</h3>
    <div className='grid grid-cols-2 gap-2'>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategorySelect(category.id)}
          className={`flex flex-col items-center justify-center text-center gap-1 p-3 rounded-lg transition-all text-xs sm:text-sm h-20 sm:h-24 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            currentCategory === category.id
              ? "bg-purple-600 text-white shadow-xl scale-105"
              : "bg-slate-700/70 text-slate-300 hover:bg-slate-600/80 hover:shadow-md"
          }`}
        >
          <span className='text-2xl sm:text-3xl'>{category.icon}</span>
          <span className='font-medium mt-1'>{category.name}</span>
        </button>
      ))}
    </div>
  </div>
);
const ShapeSelector = ({ shapes, currentShape, onShapeSelect }) => (
  <div className='bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/70 shadow-lg'>
    <h3 className='text-lg font-semibold text-white mb-3'>Shapes</h3>
    <div className='grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1'>
      {shapes.map((shape) => (
        <button
          key={shape.id}
          onClick={() => onShapeSelect(shape.id)}
          className={`flex items-center justify-start gap-2 p-3 rounded-lg transition-all text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            currentShape === shape.id
              ? "bg-purple-500 text-white shadow-lg"
              : "bg-slate-700/70 text-slate-300 hover:bg-slate-600/80"
          }`}
        >
          <span className='text-xl'>{shape.icon}</span>
          <span className='font-medium'>{shape.name}</span>
        </button>
      ))}
    </div>
  </div>
);
const AnimationControls = ({
  isAnimating,
  onToggleAnimation,
  onResetAnimation,
  animationPreset,
  onPresetChange,
  onRandomize,
}) => (
  <div className='bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/70 shadow-lg'>
    <h3 className='text-lg font-semibold text-white mb-3'>Animation</h3>
    <div className='space-y-3'>
      <button
        onClick={onToggleAnimation}
        className={`w-full flex items-center justify-center gap-2 p-2.5 rounded-lg transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 ${
          isAnimating
            ? "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400"
            : "bg-green-500 hover:bg-green-600 text-white focus:ring-green-400"
        }`}
      >
        {isAnimating ? <Pause size={16} /> : <Play size={16} />}
        {isAnimating ? "Pause" : "Play"}
      </button>
      <select
        value={animationPreset}
        onChange={(e) => onPresetChange(e.target.value)}
        className='w-full p-2.5 bg-slate-700 text-white rounded-lg border border-slate-600 text-sm focus:ring-purple-500 focus:border-purple-500'
      >
        {Object.keys(animationPresets).map((presetKey) => (
          <option key={presetKey} value={presetKey} className='capitalize'>
            {presetKey.charAt(0).toUpperCase() + presetKey.slice(1)}
          </option>
        ))}
      </select>
      <div className='grid grid-cols-2 gap-2'>
        <button
          onClick={onResetAnimation}
          className='flex items-center justify-center gap-1 p-2.5 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-400'
        >
          <RotateCcw size={14} /> Reset
        </button>
        <button
          onClick={onRandomize}
          className='flex items-center justify-center gap-1 p-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-400'
        >
          <Shuffle size={14} /> Random
        </button>
      </div>
    </div>
  </div>
);
const ExportControls = ({
  onExportGLB,
  onExportOBJ,
  onTakeScreenshot,
  isExporting,
  exportProgress,
}) => (
  <div className='bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/70 shadow-lg'>
    <h3 className='text-lg font-semibold text-white mb-3'>Export</h3>
    <div className='space-y-2'>
      <button
        onClick={onExportGLB}
        disabled={isExporting}
        className='w-full flex items-center justify-center gap-2 p-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600/70 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-400'
      >
        <Download size={14} />
        {isExporting && exportProgress > 0 && exportProgress <= 100
          ? `GLB... ${Math.round(exportProgress)}%`
          : "Export GLB"}
      </button>
      <button
        onClick={onExportOBJ}
        disabled={isExporting}
        className='w-full flex items-center justify-center gap-2 p-2.5 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600/70 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-teal-400'
      >
        <Download size={14} />
        {isExporting && exportProgress > 0 && exportProgress <= 100
          ? `OBJ... ${Math.round(exportProgress)}%`
          : "Export OBJ"}
      </button>
      <button
        onClick={onTakeScreenshot}
        disabled={isExporting}
        className='w-full flex items-center justify-center gap-2 p-2.5 bg-purple-500 hover:bg-purple-600 disabled:bg-slate-600/70 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-purple-400'
      >
        <Camera size={14} /> Screenshot
      </button>
    </div>
  </div>
);
const ThreeDViewer = ({ mountRef, isExporting, exportProgress }) => (
  <div className='lg:col-span-3 xl:col-span-3 order-first lg:order-last'>
    <div className='bg-slate-800/30 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-slate-700/50 shadow-2xl aspect-[4/3]'>
      <div className='relative w-full h-full'>
        <div
          ref={mountRef}
          className='w-full h-full rounded-lg overflow-hidden'
        />
        {isExporting && (
          <div className='absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-lg z-10'>
            <div className='bg-slate-100 p-6 sm:p-8 rounded-xl shadow-2xl text-center'>
              <div className='text-xl sm:text-2xl font-bold text-slate-800 mb-4'>
                Exporting Model
              </div>
              <div className='text-lg text-slate-700 mb-2'>
                {Math.round(exportProgress)}%
              </div>
              <div className='w-48 sm:w-56 h-3 bg-slate-300 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-blue-500 transition-width duration-300'
                  style={{ width: `${Math.round(exportProgress)}%` }}
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
const SettingsPanel = ({ settings, onSettingsChange, show, onClose }) => {
  if (!show) return null;
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    onSettingsChange((prev) => ({
      ...prev,
      [name]: type === "range" ? parseFloat(value) : value,
    }));
  };
  return (
    <div
      className='fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50'
      onClick={onClose}
    >
      <div
        className='bg-slate-800 rounded-xl p-6 border-slate-700 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex justify-between items-center mb-6'>
          <h3 className='text-xl sm:text-2xl font-semibold text-white'>
            Viewer Settings
          </h3>
          <button
            onClick={onClose}
            className='text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700'
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
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4'>
          <div>
            <label
              htmlFor='materialType'
              className='block text-sm font-medium text-slate-300 mb-1'
            >
              Material
            </label>
            <select
              id='materialType'
              name='materialType'
              value={settings.materialType}
              onChange={handleInputChange}
              className='w-full p-2.5 bg-slate-700 text-white rounded-lg border border-slate-600 focus:ring-1 focus:ring-purple-500 focus:border-purple-500'
            >
              <option value='auto'>Auto Detect</option>{" "}
              <option value='metallic'>Metallic</option>{" "}
              <option value='glass'>Glass</option>{" "}
              <option value='crystal'>Crystal</option>
              <option value='ceramic'>Ceramic</option>{" "}
              <option value='organic'>Organic</option>{" "}
              <option value='plastic'>Plastic</option>{" "}
              <option value='neon'>Neon</option>
            </select>
          </div>
          <div>
            <label
              htmlFor='shapeColor'
              className='block text-sm font-medium text-slate-300 mb-1'
            >
              Color
            </label>
            <input
              id='shapeColor'
              name='shapeColor'
              type='color'
              value={settings.shapeColor}
              onChange={handleInputChange}
              className='w-full h-10 p-1 bg-slate-700 rounded-lg border border-slate-600 cursor-pointer'
            />
          </div>
          <div>
            <label
              htmlFor='animationSpeed'
              className='block text-sm font-medium text-slate-300 mb-1'
            >
              Anim. Speed: {settings.animationSpeed.toFixed(1)}x
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
              Light: {settings.lightIntensity.toFixed(1)}x
            </label>
            <input
              id='lightIntensity'
              name='lightIntensity'
              type='range'
              min='0.1'
              max='2.5'
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
              Depth: {settings.extrudeDepth.toFixed(2)}
            </label>
            <input
              id='extrudeDepth'
              name='extrudeDepth'
              type='range'
              min='0.05'
              max='1.5'
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
              <option value='low'>Low</option>{" "}
              <option value='medium'>Medium</option>{" "}
              <option value='high'>High</option>
            </select>
          </div>
          <div className='sm:col-span-2'>
            <label
              htmlFor='background'
              className='block text-sm font-medium text-slate-300 mb-1'
            >
              Background
            </label>
            <select
              id='background'
              name='background'
              value={settings.background}
              onChange={handleInputChange}
              className='w-full p-2.5 bg-slate-700 text-white rounded-lg border border-slate-600 focus:ring-1 focus:ring-purple-500 focus:border-purple-500'
            >
              <option value='modernGradient'>Modern Gradient</option>{" "}
              <option value='darkSpace'>Dark Space</option>{" "}
              <option value='softLight'>Soft Light</option>
              <option value='studioDark'>Studio Dark</option>{" "}
              <option value='studioLight'>Studio Light</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
const ModelViewer3D = () => {
  const [isMounted, setIsMounted] = useState(false);
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const composerRef = useRef(null);
  const ssaoPassRef = useRef(null);
  const meshRef = useRef(null);
  const animationIdRef = useRef(null);
  const lightsRef = useRef([]);
  const skyboxMeshRef = useRef(null);
  const envMapTextureRef = useRef(null);

  const categories = [
    { id: "animals", name: "Animals", icon: "🐱" },
    { id: "sports", name: "Sports", icon: "⚽" },
    { id: "people", name: "People", icon: "👤" },
    { id: "objects", name: "Objects", icon: "📱" },
  ];
  const shapesByCategory = {
    animals: [
      { id: "cat", name: "Cat", icon: "🐱" },
      { id: "bird", name: "Bird", icon: "🐦" },
      { id: "fish", name: "Fish", icon: "🐟" },
    ],
    sports: [
      { id: "soccer", name: "Soccer", icon: "⚽" },
      { id: "tennis", name: "Tennis", icon: "🎾" },
      { id: "basketball", name: "Basketball", icon: "🏀" },
    ],
    people: [
      { id: "person", name: "Person", icon: "👤" },
      { id: "robot", name: "Robot", icon: "🤖" },
    ],
    objects: [
      { id: "phone", name: "Phone", icon: "📱" },
      { id: "lightning", name: "Lightning", icon: "⚡" },
      { id: "music", name: "Music Note", icon: "🎵" },
    ],
  };
  const backgroundOptions = {
    modernGradient: "Modern Gradient",
    darkSpace: "Dark Space",
    softLight: "Soft Light",
    studioDark: "Studio Dark",
    studioLight: "Studio Light",
  };

  const [currentCategory, setCurrentCategory] = useState(categories[0].id);
  const [currentShape, setCurrentShape] = useState(
    shapesByCategory[categories[0].id][0].id
  );
  const [isAnimating, setIsAnimating] = useState(true);
  const [animationPreset, setAnimationPreset] = useState("gentle");
  const [showSettings, setShowSettings] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [settings, setSettings] = useState({
    materialType: "auto",
    shapeColor: "#a78bfa",
    animationSpeed: 1.0,
    lightIntensity: 1.0,
    extrudeDepth: 0.4,
    quality: "medium",
    background: "studioDark",
  });
  const animationState = useRef({
    rotation: new THREE.Euler(),
    targetRotation: new THREE.Euler(),
    floatY: 0,
    startTime: Date.now(),
  });

  const isAnimatingRef = useRef(isAnimating);
  const settingsRef = useRef(settings);
  const animationPresetRef = useRef(animationPreset);

  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);
  useEffect(() => {
    animationPresetRef.current = animationPreset;
  }, [animationPreset]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !mountRef.current) return;
    const currentMount = mountRef.current;
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(
      50,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.set(0, 0.5, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    currentMount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1.5;
    controls.maxDistance = 25;
    controls.maxPolarAngle = Math.PI / 1.5;
    controls.target.set(0, 0.2, 0);
    controlsRef.current = controls;

    const rgbeLoader = new RGBELoader();
    rgbeLoader.load(
      "/brown_photostudio_02_4k.hdr",
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        if (sceneRef.current) {
          sceneRef.current.environment = texture;
          envMapTextureRef.current = texture;
        }
        console.log("Environment map loaded.");
      },
      undefined,
      (error) => {
        console.error("Error loading HDR environment map:", error);
      }
    );

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.6);
    keyLight.position.set(8, 10, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 50;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xaaccff, 0.3);
    fillLight.position.set(-8, 5, -5);
    scene.add(fillLight);
    lightsRef.current = [ambientLight, keyLight, fillLight];

    const composer = new EffectComposer(renderer);
    composerRef.current = composer;
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    const ssaoPass = new SSAOPass(
      scene,
      camera,
      currentMount.clientWidth,
      currentMount.clientHeight
    );
    ssaoPass.kernelRadius = 0.8;
    ssaoPass.minDistance = 0.002;
    ssaoPass.maxDistance = 0.05;
    composer.addPass(ssaoPass);
    ssaoPassRef.current = ssaoPass;
    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    const handleResize = () => {
      if (!currentMount || !camera || !renderer) return;
      const width = currentMount.clientWidth;
      const height = currentMount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      if (composerRef.current) {
        composerRef.current.setSize(width, height);
        const sPass = composerRef.current.passes.find(
          (pass) => pass instanceof SSAOPass
        );
        if (sPass) sPass.setSize(width, height);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    const clock = new THREE.Clock();
    const animate = () => {
      if (!sceneRef.current || !rendererRef.current || !cameraRef.current) {
        if (animationIdRef.current)
          cancelAnimationFrame(animationIdRef.current);
        return;
      }
      animationIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (controlsRef.current) controlsRef.current.update();

      if (meshRef.current && isAnimatingRef.current) {
        const currentSettings = settingsRef.current;
        const currentPresetKey = animationPresetRef.current;
        const preset = animationPresets[currentPresetKey];
        const effectiveDelta = delta * currentSettings.animationSpeed;

        animationState.current.targetRotation.x +=
          preset.rotationSpeed[0] * 60 * effectiveDelta;
        animationState.current.targetRotation.y +=
          preset.rotationSpeed[1] * 60 * effectiveDelta;
        animationState.current.targetRotation.z +=
          preset.rotationSpeed[2] * 60 * effectiveDelta;

        meshRef.current.rotation.x = THREE.MathUtils.lerp(
          meshRef.current.rotation.x,
          animationState.current.targetRotation.x,
          0.1
        );
        meshRef.current.rotation.y = THREE.MathUtils.lerp(
          meshRef.current.rotation.y,
          animationState.current.targetRotation.y,
          0.1
        );
        meshRef.current.rotation.z = THREE.MathUtils.lerp(
          meshRef.current.rotation.z,
          animationState.current.targetRotation.z,
          0.1
        );

        const floatTime =
          (Date.now() - animationState.current.startTime) *
          0.001 *
          currentSettings.animationSpeed;
        animationState.current.floatY =
          Math.sin(floatTime * preset.floatSpeed * 100) * preset.floatAmplitude;
        meshRef.current.position.y = animationState.current.floatY;
      }
      if (composerRef.current) composerRef.current.render(delta);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      if (controlsRef.current) {
        controlsRef.current.dispose();
        controlsRef.current = null;
      }
      if (envMapTextureRef.current) {
        envMapTextureRef.current.dispose();
        envMapTextureRef.current = null;
      }
      if (skyboxMeshRef.current) {
        sceneRef.current?.remove(skyboxMeshRef.current);
        skyboxMeshRef.current.geometry?.dispose();
        skyboxMeshRef.current.material?.dispose();
        skyboxMeshRef.current = null;
      }
      if (meshRef.current) {
        sceneRef.current?.remove(meshRef.current);
        meshRef.current.geometry?.dispose();
        if (meshRef.current.material) {
          if (Array.isArray(meshRef.current.material))
            meshRef.current.material.forEach((m) => m.dispose());
          else meshRef.current.material.dispose();
        }
        meshRef.current = null;
      }
      if (composerRef.current) {
        composerRef.current.passes.forEach((pass) => {
          if (pass.dispose) pass.dispose();
        });
        composerRef.current = null;
      }
      ssaoPassRef.current = null;
      if (sceneRef.current) {
        sceneRef.current.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material))
              obj.material.forEach((m) => m.dispose());
            else if (obj.material.dispose) obj.material.dispose();
          }
        });
        sceneRef.current = null;
      }
      if (rendererRef.current) {
        if (currentMount && rendererRef.current.domElement) {
          currentMount.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
      cameraRef.current = null;
      lightsRef.current = [];
    };
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted || !sceneRef.current || !rendererRef.current) return;
    if (skyboxMeshRef.current) {
      sceneRef.current.remove(skyboxMeshRef.current);
      skyboxMeshRef.current.geometry?.dispose();
      skyboxMeshRef.current.material?.dispose();
      skyboxMeshRef.current = null;
    }
    sceneRef.current.background = null;
    sceneRef.current.fog = null;
    rendererRef.current.toneMappingExposure = 1.0;
    let topC,
      bottomC,
      fogC,
      fogNear = 8,
      fogFar = 30;
    switch (settings.background) {
      case "modernGradient":
        topC = new THREE.Color(0x3a7ca5);
        bottomC = new THREE.Color(0x1e3b49);
        fogC = new THREE.Color(0x2c5d72);
        break;
      case "darkSpace":
        sceneRef.current.background = new THREE.Color(0x05050a);
        fogC = new THREE.Color(0x101520);
        fogNear = 10;
        fogFar = 35;
        break;
      case "softLight":
        sceneRef.current.background = new THREE.Color(0xdde8f0);
        fogC = new THREE.Color(0xb8c5d1);
        fogNear = 7;
        fogFar = 28;
        if (rendererRef.current) rendererRef.current.toneMappingExposure = 0.9;
        break;
      case "studioDark":
        sceneRef.current.background = new THREE.Color(0x111115);
        fogC = new THREE.Color(0x181820);
        fogNear = 12;
        fogFar = 40;
        break;
      case "studioLight":
        sceneRef.current.background = new THREE.Color(0xe0e0e0);
        fogC = new THREE.Color(0xc0c0c0);
        fogNear = 10;
        fogFar = 35;
        if (rendererRef.current) rendererRef.current.toneMappingExposure = 0.85;
        break;
      default:
        topC = new THREE.Color(0x3a7ca5);
        bottomC = new THREE.Color(0x1e3b49);
        fogC = new THREE.Color(0x2c5d72);
    }
    if (settings.background === "modernGradient" && topC && bottomC) {
      const gradientGeometry = new THREE.SphereGeometry(50, 32, 32);
      const gradientMaterial = new THREE.ShaderMaterial({
        uniforms: {
          topColor: { value: topC },
          bottomColor: { value: bottomC },
          offset: { value: 33 },
          exponent: { value: 0.7 },
        },
        vertexShader: `varying vec3 vWorldPosition; void main() { vec4 worldPosition = modelMatrix * vec4(position, 1.0); vWorldPosition = worldPosition.xyz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `uniform vec3 topColor; uniform vec3 bottomColor; uniform float offset; uniform float exponent; varying vec3 vWorldPosition; void main() { float h = normalize(vWorldPosition + offset).y; gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0); }`,
        side: THREE.BackSide,
      });
      skyboxMeshRef.current = new THREE.Mesh(
        gradientGeometry,
        gradientMaterial
      );
      sceneRef.current.add(skyboxMeshRef.current);
    }
    if (fogC) sceneRef.current.fog = new THREE.Fog(fogC, fogNear, fogFar);
  }, [settings.background, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    const baseIntensities = [0.2, 0.6, 0.25];
    lightsRef.current.forEach((light, index) => {
      if (
        light &&
        light.intensity !== undefined &&
        baseIntensities[index] !== undefined
      ) {
        light.intensity = baseIntensities[index] * settings.lightIntensity;
      }
    });
  }, [settings.lightIntensity, isMounted]);

  useEffect(() => {
    if (!isMounted || !sceneRef.current) return;
    if (meshRef.current) {
      sceneRef.current.remove(meshRef.current);
      meshRef.current.geometry?.dispose();
      if (meshRef.current.material) {
        if (Array.isArray(meshRef.current.material))
          meshRef.current.material.forEach((m) => m.dispose());
        else meshRef.current.material.dispose();
      }
    }
    const mesh = create3DShape(currentShape, settings, 1.5);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.set(0, 0, 0);
    animationState.current.floatY = 0;
    animationState.current.targetRotation.set(
      mesh.rotation.x,
      mesh.rotation.y,
      mesh.rotation.z
    );
    sceneRef.current.add(mesh);
    meshRef.current = mesh;
  }, [currentShape, settings, isMounted]);

  const handleCategorySelect = useCallback(
    (categoryId) => {
      setCurrentCategory(categoryId);
      setCurrentShape(shapesByCategory[categoryId][0].id);
    },
    [shapesByCategory]
  );
  const handleShapeSelect = useCallback((shapeId) => {
    setCurrentShape(shapeId);
  }, []);

  const handleToggleAnimation = useCallback(() => {
    setIsAnimating((prevIsAnimating) => {
      const newIsAnimating = !prevIsAnimating;
      if (newIsAnimating) {
        animationState.current.startTime = Date.now();
      }
      return newIsAnimating;
    });
  }, []);

  const handleResetAnimation = useCallback(() => {
    animationState.current.rotation.set(0, 0, 0);
    animationState.current.targetRotation.set(0, 0, 0);
    animationState.current.floatY = 0;
    animationState.current.startTime = Date.now();
    if (meshRef.current) {
      meshRef.current.rotation.set(0, 0, 0);
      meshRef.current.position.y = 0;
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0.2, 0);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      handleResetAnimation();
    }
  }, [animationPreset, isMounted, handleResetAnimation]);

  const handleRandomize = useCallback(() => {
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    const randomShapeList = shapesByCategory[randomCategory.id];
    const randomShape =
      randomShapeList[Math.floor(Math.random() * randomShapeList.length)];
    const randomPresetKey =
      Object.keys(animationPresets)[
        Math.floor(Math.random() * Object.keys(animationPresets).length)
      ];
    const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
    const bgKeys = Object.keys(backgroundOptions);
    const randomBgKey = bgKeys[Math.floor(Math.random() * bgKeys.length)];
    const materialKeys = [
      "metallic",
      "glass",
      "crystal",
      "ceramic",
      "organic",
      "plastic",
      "neon",
    ];
    const randomMaterial =
      materialKeys[Math.floor(Math.random() * materialKeys.length)];
    setCurrentCategory(randomCategory.id);
    setCurrentShape(randomShape.id);
    setAnimationPreset(randomPresetKey); // This will trigger the useEffect above to reset animation
    setSettings((prev) => ({
      ...prev,
      materialType: randomMaterial,
      shapeColor: randomColor,
      background: randomBgKey,
      extrudeDepth: Math.random() * (1.0 - 0.1) + 0.1,
      lightIntensity: Math.random() * (2.0 - 0.5) + 0.5,
    }));
  }, [categories, shapesByCategory, backgroundOptions]); // handleResetAnimation removed as it's called by preset change

  const handleExportGLB = useCallback(() => {
    if (!meshRef.current || isExporting) {
      console.error("Cannot export: No mesh available or already exporting.");
      return;
    }
    setIsExporting(true);
    setExportProgress(0);

    const exporter = new GLTFExporter();
    const options = { binary: true };

    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 5 + 5); // Simulate progress
      const currentProgress = Math.min(progress, 95); // Cap at 95 until export finishes
      setExportProgress(currentProgress);
      if (currentProgress >= 95) {
        clearInterval(progressInterval);
      }
    }, 80);

    // Introduce a small delay to allow UI to update before heavy task
    setTimeout(() => {
      try {
        // Ensure meshRef.current is a valid Object3D
        if (!(meshRef.current instanceof THREE.Object3D)) {
          throw new Error("Mesh to export is not a valid Three.js Object3D.");
        }
        exporter.parse(
          meshRef.current,
          (gltf) => {
            clearInterval(progressInterval);
            setExportProgress(98); // Indicate parsing is nearly complete

            if (!(gltf instanceof ArrayBuffer)) {
              console.error(
                "GLTFExporter.parse did not return ArrayBuffer for GLB."
              );
              setIsExporting(false);
              setExportProgress(0);
              return;
            }

            const blob = new Blob([gltf], { type: "application/octet-stream" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `shape-${currentShapeRef.current || "model"}.glb`; // Use a ref for currentShape if it might change
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);

            setExportProgress(100);
            setTimeout(() => setIsExporting(false), 500);
          },
          (error) => {
            clearInterval(progressInterval);
            console.error("GLTFExporter.parse error:", error);
            setIsExporting(false);
            setExportProgress(0);
          },
          options
        );
      } catch (e) {
        clearInterval(progressInterval);
        console.error("Error setting up GLTF export:", e);
        setIsExporting(false);
        setExportProgress(0);
      }
    }, 100);
  }, [isExporting, meshRef, settingsRef]); // Dependencies updated: meshRef, settingsRef ensure we use the latest

  // Ref to hold currentShape for export handlers, as their useCallback might capture stale state
  const currentShapeRef = useRef(currentShape);
  useEffect(() => {
    currentShapeRef.current = currentShape;
  }, [currentShape]);

  const handleSimulatedExportOBJ = useCallback(() => {
    if (isExporting) return;
    setIsExporting(true);
    setExportProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15 + 10);
      setExportProgress(Math.min(progress, 100));
      if (progress >= 100) {
        clearInterval(interval);
        const link = document.createElement("a");
        link.download = `shape-${currentShapeRef.current || "model"}.obj`;
        link.href =
          "data:text/plain;charset=utf-8," +
          encodeURIComponent(
            "# OBJ file simulated\n# Replace with actual OBJ exporter output"
          );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => setIsExporting(false), 500);
      }
    }, 150);
  }, [isExporting]);

  const handleTakeScreenshot = useCallback(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
    // Ensure the scene is rendered before taking screenshot
    if (composerRef.current) {
      composerRef.current.render(); // Render with composer if it exists
    } else if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current); // Fallback direct render
    } else {
      console.error(
        "Cannot take screenshot: Renderer, scene, or camera not ready."
      );
      return;
    }

    const canvas = rendererRef.current.domElement;
    const link = document.createElement("a");
    link.download = `screenshot-${currentShapeRef.current || "view"}.png`;
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []); // Dependencies are refs, which are stable

  if (!isMounted) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-3 sm:p-4 md:p-6 text-white select-none'>
        <div className='max-w-screen-xl mx-auto'>
          <header className='text-center mb-6 sm:mb-8'>
            <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent'>
              3D Shape Studio Pro
            </h1>
            <p className='text-slate-300 text-sm sm:text-base max-w-2xl mx-auto'>
              Loading interactive 3D experience...
            </p>
          </header>
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6'>
            <div className='lg:col-span-1 space-y-4 sm:space-y-5 order-last lg:order-first'>
              <div className='bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/70 shadow-lg h-40 animate-pulse'></div>
              <div className='bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/70 shadow-lg h-40 animate-pulse'></div>
              <div className='bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/70 shadow-lg h-40 animate-pulse'></div>
            </div>
            <div className='lg:col-span-3 xl:col-span-3 order-first lg:order-last'>
              <div className='bg-slate-800/30 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-slate-700/50 shadow-2xl aspect-[4/3]'>
                <div className='relative w-full h-full flex items-center justify-center text-slate-400'>
                  <p>Initializing 3D Viewer...</p>
                </div>
              </div>
            </div>
          </div>
          <footer className='text-center mt-10 sm:mt-12 text-slate-400 text-xs sm:text-sm'>
            <p>
              © {new Date().getFullYear()} 3D Shape Studio Pro. Initializing...
            </p>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-3 sm:p-4 md:p-6 text-white select-none'>
      <div className='max-w-screen-xl mx-auto'>
        <header className='text-center mb-6 sm:mb-8'>
          <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent'>
            3D Shape Studio Pro
          </h1>
          <p className='text-slate-300 text-sm sm:text-base max-w-2xl mx-auto'>
            Explore, customize, and animate 3D shapes with PBR materials,
            OrbitControls, and SSAO.
          </p>
        </header>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6'>
          <div className='lg:col-span-1 space-y-4 sm:space-y-5 order-last lg:order-first'>
            <CategorySelector
              categories={categories}
              currentCategory={currentCategory}
              onCategorySelect={handleCategorySelect}
            />
            <ShapeSelector
              shapes={shapesByCategory[currentCategory]}
              currentShape={currentShape}
              onShapeSelect={handleShapeSelect}
            />
            <AnimationControls
              isAnimating={isAnimating}
              onToggleAnimation={handleToggleAnimation}
              onResetAnimation={handleResetAnimation}
              animationPreset={animationPreset}
              onPresetChange={setAnimationPreset}
              onRandomize={handleRandomize}
            />
            <ExportControls
              onExportGLB={handleExportGLB}
              onExportOBJ={handleSimulatedExportOBJ}
              onTakeScreenshot={handleTakeScreenshot}
              isExporting={isExporting}
              exportProgress={exportProgress}
            />
            <button
              onClick={() => setShowSettings(true)}
              className='w-full flex items-center justify-center gap-2 p-3 bg-slate-700 hover:bg-slate-600/90 text-white rounded-lg transition-all text-sm font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500'
            >
              <SettingsIcon size={16} /> Viewer Settings
            </button>
          </div>
          <ThreeDViewer
            mountRef={mountRef}
            isExporting={isExporting}
            exportProgress={exportProgress}
          />
        </div>
        <SettingsPanel
          settings={settings}
          onSettingsChange={setSettings}
          show={showSettings}
          onClose={() => setShowSettings(false)}
        />
        <footer className='text-center mt-10 sm:mt-12 text-slate-400 text-xs sm:text-sm'>
          <p>
            © {new Date().getFullYear()} 3D Shape Studio Pro. Environment map,
            OrbitControls, and SSAO enhance realism.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ModelViewer3D;
