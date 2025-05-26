// import React, { useRef, useEffect, useState, useCallback } from "react";
// import * as THREE from "three";
// import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
// import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
// import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
// import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";
// import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

// import {
//   Download,
//   Play,
//   Pause,
//   RotateCcw,
//   Camera,
//   Settings as SettingsIcon,
//   Shuffle,
//   UploadCloud,
//   XCircle,
// } from "lucide-react";

// // --- Helper to ensure numbers are valid ---
// const saneNumber = (value, defaultValue = 0) => {
//   const num = Number(value);
//   return isNaN(num) || !isFinite(num) ? defaultValue : num;
// };

// // --- Shape Creation Functions ---
// const createCatShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(0), saneNumber(s * 0.8));
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.6),
//     saneNumber(s * 0.8),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(0)
//   );
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.8),
//     saneNumber(-s * 0.6),
//     saneNumber(-s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(0),
//     saneNumber(-s * 0.8)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.8),
//     saneNumber(-s * 0.6),
//     saneNumber(s * 0.8),
//     saneNumber(0)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(s * 0.6),
//     saneNumber(s * 0.8),
//     saneNumber(0),
//     saneNumber(s * 0.8)
//   );
//   const ear1 = new THREE.Path();
//   ear1.moveTo(saneNumber(-s * 0.4), saneNumber(s * 0.6));
//   ear1.lineTo(saneNumber(-s * 0.7), saneNumber(s * 1.2));
//   ear1.lineTo(saneNumber(-s * 0.1), saneNumber(s * 0.9));
//   ear1.closePath();
//   const ear2 = new THREE.Path();
//   ear2.moveTo(saneNumber(s * 0.4), saneNumber(s * 0.6));
//   ear2.lineTo(saneNumber(s * 0.7), saneNumber(s * 1.2));
//   ear2.lineTo(saneNumber(s * 0.1), saneNumber(s * 0.9));
//   ear2.closePath();
//   shape.holes.push(ear1);
//   shape.holes.push(ear2);
//   return shape;
// };
// const createBirdShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(0), saneNumber(s * 0.6));
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.9),
//     saneNumber(-s * 0.2),
//     saneNumber(-s * 0.6),
//     saneNumber(-s * 0.6)
//   );
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.3),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.3),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.6),
//     saneNumber(-s * 0.6)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.9),
//     saneNumber(-s * 0.2),
//     saneNumber(s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(0),
//     saneNumber(s * 0.6)
//   );
//   const wing = new THREE.Path();
//   wing.moveTo(saneNumber(-s * 0.3), saneNumber(s * 0.2));
//   wing.bezierCurveTo(
//     saneNumber(-s * 0.7),
//     saneNumber(s * 0.3),
//     saneNumber(-s * 0.8),
//     saneNumber(0),
//     saneNumber(-s * 0.5),
//     saneNumber(-s * 0.3)
//   );
//   wing.bezierCurveTo(
//     saneNumber(-s * 0.2),
//     saneNumber(-s * 0.1),
//     saneNumber(-s * 0.1),
//     saneNumber(s * 0.1),
//     saneNumber(-s * 0.3),
//     saneNumber(s * 0.2)
//   );
//   shape.holes.push(wing);
//   return shape;
// };
// const createFishShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(-s * 0.8), saneNumber(0));
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.6),
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.2),
//     saneNumber(s * 0.5),
//     saneNumber(s * 0.2),
//     saneNumber(s * 0.3)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.6),
//     saneNumber(s * 0.2),
//     saneNumber(s * 0.8),
//     saneNumber(0),
//     saneNumber(s * 0.8),
//     saneNumber(0)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.6),
//     saneNumber(-s * 0.2),
//     saneNumber(s * 0.2),
//     saneNumber(-s * 0.3),
//     saneNumber(-s * 0.2),
//     saneNumber(-s * 0.5)
//   );
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.6),
//     saneNumber(-s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(0),
//     saneNumber(-s * 0.8),
//     saneNumber(0)
//   );
//   shape.moveTo(saneNumber(s * 0.8), saneNumber(0));
//   shape.lineTo(saneNumber(s * 1.2), saneNumber(s * 0.3));
//   shape.lineTo(saneNumber(s * 1.0), saneNumber(0));
//   shape.lineTo(saneNumber(s * 1.2), saneNumber(-s * 0.3));
//   shape.lineTo(saneNumber(s * 0.8), saneNumber(0));
//   return shape;
// };
// const createSoccerBallShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const r = s * 0.8;
//   for (let i = 0; i < 6; i++) {
//     const a = (i / 6) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * r);
//     const y = saneNumber(Math.sin(a) * r);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.closePath();
//   const ih = new THREE.Path();
//   const ir = s * 0.4;
//   for (let i = 0; i < 6; i++) {
//     const a = (i / 6) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * ir);
//     const y = saneNumber(Math.sin(a) * ir);
//     if (i === 0) ih.moveTo(x, y);
//     else ih.lineTo(x, y);
//   }
//   ih.closePath();
//   shape.holes.push(ih);
//   return shape;
// };
// const createTennisRacketShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const a = s * 0.6;
//   const b = s * 0.4;
//   for (let i = 0; i <= 32; i++) {
//     const ang = (i / 32) * Math.PI * 2;
//     const x = saneNumber(Math.cos(ang) * a);
//     const y = saneNumber(Math.sin(ang) * b + s * 0.3);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.lineTo(saneNumber(s * 0.1), saneNumber(-s * 0.8));
//   shape.lineTo(saneNumber(-s * 0.1), saneNumber(-s * 0.8));
//   shape.closePath();
//   return shape;
// };
// const createBasketballShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const r = s * 0.8;
//   for (let i = 0; i <= 32; i++) {
//     const a = (i / 32) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * r);
//     const y = saneNumber(Math.sin(a) * r);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.closePath();
//   return shape;
// };
// const createPersonShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const hr = s * 0.2;
//   for (let i = 0; i <= 16; i++) {
//     const a = (i / 16) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * hr);
//     const y = saneNumber(Math.sin(a) * hr + s * 0.6);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.lineTo(saneNumber(-s * 0.3), saneNumber(s * 0.2));
//   shape.lineTo(saneNumber(-s * 0.4), saneNumber(-s * 0.4));
//   shape.lineTo(saneNumber(-s * 0.2), saneNumber(-s * 0.8));
//   shape.lineTo(saneNumber(s * 0.2), saneNumber(-s * 0.8));
//   shape.lineTo(saneNumber(s * 0.4), saneNumber(-s * 0.4));
//   shape.lineTo(saneNumber(s * 0.3), saneNumber(s * 0.2));
//   shape.closePath();
//   return shape;
// };
// const createRobotShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(-sval * 0.4), saneNumber(sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.4), saneNumber(sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.4), saneNumber(sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.4), saneNumber(sval * 0.4));
//   shape.closePath();
//   shape.moveTo(saneNumber(-sval * 0.5), saneNumber(sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.5), saneNumber(sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.5), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.5), saneNumber(-sval * 0.4));
//   shape.closePath();
//   shape.moveTo(saneNumber(-sval * 0.3), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.1), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.1), saneNumber(-sval * 0.8));
//   shape.lineTo(saneNumber(-sval * 0.3), saneNumber(-sval * 0.8));
//   shape.closePath();
//   shape.moveTo(saneNumber(sval * 0.1), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.3), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.3), saneNumber(-sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.1), saneNumber(-sval * 0.8));
//   shape.closePath();
//   return shape;
// };
// const createPhoneShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const w = sval * 0.5;
//   const h = sval * 1.0;
//   const r = sval * 0.1;
//   shape.moveTo(saneNumber(-w + r), saneNumber(h));
//   shape.lineTo(saneNumber(w - r), saneNumber(h));
//   shape.quadraticCurveTo(
//     saneNumber(w),
//     saneNumber(h),
//     saneNumber(w),
//     saneNumber(h - r)
//   );
//   shape.lineTo(saneNumber(w), saneNumber(-h + r));
//   shape.quadraticCurveTo(
//     saneNumber(w),
//     saneNumber(-h),
//     saneNumber(w - r),
//     saneNumber(-h)
//   );
//   shape.lineTo(saneNumber(-w + r), saneNumber(-h));
//   shape.quadraticCurveTo(
//     saneNumber(-w),
//     saneNumber(-h),
//     saneNumber(-w),
//     saneNumber(-h + r)
//   );
//   shape.lineTo(saneNumber(-w), saneNumber(h - r));
//   shape.quadraticCurveTo(
//     saneNumber(-w),
//     saneNumber(h),
//     saneNumber(-w + r),
//     saneNumber(h)
//   );
//   shape.closePath();
//   const screen = new THREE.Path();
//   const sw = w * 0.8;
//   const sh = h * 0.8;
//   const sr = r * 0.5;
//   screen.moveTo(saneNumber(-sw + sr), saneNumber(sh));
//   screen.lineTo(saneNumber(sw - sr), saneNumber(sh));
//   screen.quadraticCurveTo(
//     saneNumber(sw),
//     saneNumber(sh),
//     saneNumber(sw),
//     saneNumber(sh - sr)
//   );
//   screen.lineTo(saneNumber(sw), saneNumber(-sh + sr));
//   screen.quadraticCurveTo(
//     saneNumber(sw),
//     saneNumber(-sh),
//     saneNumber(sw - sr),
//     saneNumber(-sh)
//   );
//   screen.lineTo(saneNumber(-sw + sr), saneNumber(-sh));
//   screen.quadraticCurveTo(
//     saneNumber(-sw),
//     saneNumber(-sh),
//     saneNumber(-sw),
//     saneNumber(-sh + sr)
//   );
//   screen.lineTo(saneNumber(-sw), saneNumber(sh - sr));
//   screen.quadraticCurveTo(
//     saneNumber(-sw),
//     saneNumber(sh),
//     saneNumber(-sw + sr),
//     saneNumber(sh)
//   );
//   screen.closePath();
//   shape.holes.push(screen);
//   return shape;
// };
// const createLightningShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(-sval * 0.2), saneNumber(sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.3), saneNumber(sval * 0.2));
//   shape.lineTo(saneNumber(sval * 0.1), saneNumber(sval * 0.2));
//   shape.lineTo(saneNumber(sval * 0.4), saneNumber(-sval * 0.8));
//   shape.lineTo(saneNumber(-sval * 0.1), saneNumber(-sval * 0.2));
//   shape.lineTo(saneNumber(sval * 0.1), saneNumber(-sval * 0.2));
//   shape.lineTo(saneNumber(-sval * 0.4), saneNumber(sval * 0.8));
//   shape.closePath();
//   return shape;
// };
// const createMusicNoteShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const nr = sval * 0.15;
//   for (let i = 0; i <= 16; i++) {
//     const a = (i / 16) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * nr - sval * 0.2);
//     const y = saneNumber(Math.sin(a) * nr - sval * 0.4);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.lineTo(saneNumber(-sval * 0.05), saneNumber(sval * 0.6));
//   shape.lineTo(saneNumber(sval * 0.05), saneNumber(sval * 0.6));
//   shape.lineTo(saneNumber(sval * 0.05), saneNumber(-sval * 0.25));
//   shape.closePath();
//   shape.moveTo(saneNumber(sval * 0.05), saneNumber(sval * 0.6));
//   shape.bezierCurveTo(
//     saneNumber(sval * 0.4),
//     saneNumber(sval * 0.5),
//     saneNumber(sval * 0.3),
//     saneNumber(sval * 0.2),
//     saneNumber(sval * 0.05),
//     saneNumber(sval * 0.3)
//   );
//   shape.closePath();
//   return shape;
// };

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

// const createAdvancedMaterial = (baseColor, materialType = "standard") => {
//   const color = new THREE.Color(baseColor);
//   const materialPresets = {
//     metallic: { metalness: 0.9, roughness: 0.1, envMapIntensity: 1.5 },
//     glass: {
//       metalness: 0.0,
//       roughness: 0.0,
//       transmission: 0.95,
//       thickness: 0.7,
//       transparent: true,
//       opacity: 0.85,
//       envMapIntensity: 2.0,
//       ior: 1.52,
//     },
//     crystal: {
//       metalness: 0.0,
//       roughness: 0.01,
//       transmission: 0.98,
//       thickness: 0.6,
//       transparent: true,
//       opacity: 0.9,
//       envMapIntensity: 2.5,
//       ior: 1.7,
//     },
//     ceramic: { metalness: 0.1, roughness: 0.6, envMapIntensity: 0.8 },
//     organic: { metalness: 0.0, roughness: 0.8, envMapIntensity: 0.5 },
//     plastic: { metalness: 0.0, roughness: 0.3, envMapIntensity: 0.7 },
//     neon: {
//       metalness: 0.0,
//       roughness: 0.1,
//       emissive: color.clone().multiplyScalar(0.8),
//       emissiveIntensity: 1.0,
//       envMapIntensity: 0.2,
//     },
//   };
//   const preset = materialPresets[materialType] || materialPresets.ceramic;
//   const sharedProps = { color, ...preset, side: THREE.DoubleSide };
//   if (materialType === "glass" || materialType === "crystal")
//     return new THREE.MeshPhysicalMaterial(sharedProps);
//   return new THREE.MeshStandardMaterial(sharedProps);
// };

// const create3DShape = (shapeId, currentSettings, size = 1) => {
//   let shape;
//   let materialType =
//     currentSettings.materialType === "auto"
//       ? "ceramic"
//       : currentSettings.materialType;
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
//   const config = shapeConfigs[shapeId] || shapeConfigs.cat;
//   const shapeSize = saneNumber(size, 1.5);
//   shape = config.creator(shapeSize);
//   if (currentSettings.materialType === "auto")
//     materialType = config.autoMaterial;
//   const extrudeSettings = {
//     depth: saneNumber(currentSettings.extrudeDepth, 0.4),
//     bevelEnabled: true,
//     bevelSegments:
//       currentSettings.quality === "high"
//         ? 10
//         : currentSettings.quality === "medium"
//         ? 6
//         : 3,
//     steps:
//       currentSettings.quality === "high"
//         ? 5
//         : currentSettings.quality === "medium"
//         ? 3
//         : 1,
//     bevelSize: saneNumber(0.035 * (shapeSize / 1.5), 0.02),
//     bevelThickness: saneNumber(0.025 * (shapeSize / 1.5), 0.015),
//     curveSegments:
//       currentSettings.quality === "high"
//         ? 48
//         : currentSettings.quality === "medium"
//         ? 24
//         : 12,
//   };
//   const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
//   geometry.computeVertexNormals();
//   try {
//     geometry.center();
//   } catch (e) {
//     console.error(
//       "Error centering geometry, likely due to NaN in shape path:",
//       e,
//       shapeId,
//       currentSettings,
//       shape
//     );
//     return new THREE.Mesh(
//       new THREE.BoxGeometry(1, 1, 1),
//       new THREE.MeshStandardMaterial({ color: 0xff0000 })
//     );
//   }
//   const material = createAdvancedMaterial(
//     currentSettings.shapeColor,
//     materialType
//   );
//   return new THREE.Mesh(geometry, material);
// };

// // --- UI Components ---
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
//     <div className='grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50'>
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
// const FileControls = ({
//   onExportGLB,
//   onExportOBJ,
//   onTakeScreenshot,
//   isExporting,
//   exportProgress,
//   onImportGLB,
// }) => (
//   <div className='bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/70 shadow-lg'>
//     <h3 className='text-lg font-semibold text-white mb-3'>File & Export</h3>
//     <div className='space-y-2'>
//       <button
//         onClick={onImportGLB}
//         disabled={isExporting}
//         className='w-full flex items-center justify-center gap-2 p-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-400'
//       >
//         <UploadCloud size={14} /> Import GLB/GLTF
//       </button>
//       <button
//         onClick={onExportGLB}
//         disabled={isExporting}
//         className='w-full flex items-center justify-center gap-2 p-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600/70 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-400'
//       >
//         <Download size={14} />
//         {isExporting && exportProgress > 0 && exportProgress <= 100
//           ? `GLB... ${Math.round(exportProgress)}%`
//           : "Export GLB"}
//       </button>
//       <button
//         onClick={onExportOBJ}
//         disabled={isExporting}
//         className='w-full flex items-center justify-center gap-2 p-2.5 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600/70 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-teal-400'
//       >
//         <Download size={14} />
//         {isExporting && exportProgress > 0 && exportProgress <= 100
//           ? `OBJ... ${Math.round(exportProgress)}%`
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
// const ThreeDViewer = ({
//   mountRef,
//   isExporting,
//   exportProgress,
//   onDropFile,
// }) => (
//   <div className='lg:col-span-3 xl:col-span-3 order-first lg:order-last'>
//     <div className='bg-slate-800/30 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-slate-700/50 shadow-2xl aspect-[4/3] sm:aspect-video lg:aspect-[16/9]'>
//       <div
//         className='relative w-full h-full'
//         onDragOver={(e) => {
//           e.preventDefault();
//           e.stopPropagation();
//         }}
//         onDrop={onDropFile}
//       >
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
//         className='bg-slate-800 rounded-xl p-6 border-slate-700 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50'
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
//             <XCircle size={24} />
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
//               <option value='crystal'>Crystal</option>
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

// let gltfLoaderInstance;
// const getGltfLoader = () => {
//   if (!gltfLoaderInstance) {
//     gltfLoaderInstance = new GLTFLoader();
//     // --- UNCOMMENT AND CONFIGURE DRACO IF NEEDED ---
//     const dracoLoader = new DRACOLoader();
//     dracoLoader.setDecoderPath("/draco/gltf/");
//     gltfLoaderInstance.setDRACOLoader(dracoLoader);
//   }
//   return gltfLoaderInstance;
// };

// const ModelViewer3D = () => {
//   const [isMounted, setIsMounted] = useState(false);
//   const mountRef = useRef(null);
//   const sceneRef = useRef(null);
//   const rendererRef = useRef(null);
//   const cameraRef = useRef(null);
//   const controlsRef = useRef(null);
//   const composerRef = useRef(null);
//   const ssaoPassRef = useRef(null); // Correctly declared here
//   const meshRef = useRef(null);
//   const animationIdRef = useRef(null);
//   const lightsRef = useRef([]);
//   const skyboxMeshRef = useRef(null);
//   const envMapTextureRef = useRef(null);
//   const glbFileInputRef = useRef(null);

//   const [importedModel, setImportedModel] = useState(null);
//   const [isImportedModelDisplayed, setIsImportedModelDisplayed] =
//     useState(false);
//   const [importedModelName, setImportedModelName] = useState("Imported Model");

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
//     lightIntensity: 1.0,
//     extrudeDepth: 0.4,
//     quality: "medium",
//     background: "studioDark",
//   });
//   const animationState = useRef({
//     rotation: new THREE.Euler(),
//     targetRotation: new THREE.Euler(),
//     floatY: 0,
//     startTime: Date.now(),
//   });

//   const isAnimatingRef = useRef(isAnimating);
//   const animationPresetRef = useRef(animationPreset);

//   useEffect(() => {
//     isAnimatingRef.current = isAnimating;
//   }, [isAnimating]);
//   useEffect(() => {
//     animationPresetRef.current = animationPreset;
//   }, [animationPreset]);
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   useEffect(() => {
//     if (!isMounted || !mountRef.current) return;
//     const currentMount = mountRef.current;
//     const scene = new THREE.Scene();
//     sceneRef.current = scene;
//     const camera = new THREE.PerspectiveCamera(
//       50,
//       currentMount.clientWidth / currentMount.clientHeight,
//       0.1,
//       1000
//     );
//     cameraRef.current = camera;
//     camera.position.set(0, 0.5, 6);
//     const renderer = new THREE.WebGLRenderer({
//       antialias: true,
//       alpha: true,
//       preserveDrawingBuffer: true,
//     });
//     rendererRef.current = renderer;
//     renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.shadowMap.enabled = true;
//     renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//     renderer.outputColorSpace = THREE.SRGBColorSpace;
//     renderer.toneMapping = THREE.ACESFilmicToneMapping;
//     renderer.toneMappingExposure = 1.0;
//     currentMount.appendChild(renderer.domElement);
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;
//     controls.dampingFactor = 0.05;
//     controls.screenSpacePanning = false;
//     controls.minDistance = 1.5;
//     controls.maxDistance = 25;
//     controls.maxPolarAngle = Math.PI / 1.5;
//     controls.target.set(0, 0.2, 0);
//     controlsRef.current = controls;
//     const rgbeLoader = new RGBELoader();
//     rgbeLoader.load("/brown_photostudio_02_4k.hdr", (texture) => {
//       texture.mapping = THREE.EquirectangularReflectionMapping;
//       if (sceneRef.current) {
//         sceneRef.current.environment = texture;
//         envMapTextureRef.current = texture;
//       }
//     });
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
//     scene.add(ambientLight);
//     const keyLight = new THREE.DirectionalLight(0xffffff, 0.6);
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

//     const composer = new EffectComposer(renderer);
//     composerRef.current = composer;
//     const renderPass = new RenderPass(scene, camera);
//     composer.addPass(renderPass);

//     const ssaoPassInstance = new SSAOPass(
//       scene,
//       camera,
//       currentMount.clientWidth,
//       currentMount.clientHeight
//     );
//     ssaoPassInstance.kernelRadius = 0.8;
//     ssaoPassInstance.minDistance = 0.002;
//     ssaoPassInstance.maxDistance = 0.05;
//     composer.addPass(ssaoPassInstance);
//     ssaoPassRef.current = ssaoPassInstance;

//     const outputPass = new OutputPass();
//     composer.addPass(outputPass);

//     const handleResize = () => {
//       if (!currentMount || !camera || !renderer) return;
//       const width = currentMount.clientWidth;
//       const height = currentMount.clientHeight;
//       camera.aspect = width / height;
//       camera.updateProjectionMatrix();
//       renderer.setSize(width, height);
//       if (composerRef.current) {
//         composerRef.current.setSize(width, height);
//         const sPass = composerRef.current.passes.find(
//           (p) => p instanceof SSAOPass
//         );
//         if (sPass) sPass.setSize(width, height);
//       }
//     };
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     const clock = new THREE.Clock();
//     const animate = () => {
//       if (!sceneRef.current || !rendererRef.current || !cameraRef.current) {
//         if (animationIdRef.current)
//           cancelAnimationFrame(animationIdRef.current);
//         return;
//       }
//       animationIdRef.current = requestAnimationFrame(animate);
//       const delta = clock.getDelta();
//       if (controlsRef.current) controlsRef.current.update();
//       if (meshRef.current && isAnimatingRef.current) {
//         const curSettings = settings;
//         const curPresetKey = animationPresetRef.current;
//         const preset = animationPresets[curPresetKey];
//         if (preset) {
//           const effDelta = delta * curSettings.animationSpeed;
//           animationState.current.targetRotation.x +=
//             preset.rotationSpeed[0] * 60 * effDelta;
//           animationState.current.targetRotation.y +=
//             preset.rotationSpeed[1] * 60 * effDelta;
//           animationState.current.targetRotation.z +=
//             preset.rotationSpeed[2] * 60 * effDelta;
//           meshRef.current.rotation.x = THREE.MathUtils.lerp(
//             meshRef.current.rotation.x,
//             animationState.current.targetRotation.x,
//             0.1
//           );
//           meshRef.current.rotation.y = THREE.MathUtils.lerp(
//             meshRef.current.rotation.y,
//             animationState.current.targetRotation.y,
//             0.1
//           );
//           meshRef.current.rotation.z = THREE.MathUtils.lerp(
//             meshRef.current.rotation.z,
//             animationState.current.targetRotation.z,
//             0.1
//           );
//           const floatTime =
//             (Date.now() - animationState.current.startTime) *
//             0.001 *
//             curSettings.animationSpeed;
//           animationState.current.floatY =
//             Math.sin(floatTime * (preset.floatSpeed || 0.0001) * 100) *
//             (preset.floatAmplitude || 0);
//           meshRef.current.position.y = animationState.current.floatY;
//         }
//       }
//       if (composerRef.current) composerRef.current.render(delta);
//     };
//     animate();
//     return () => {
//       window.removeEventListener("resize", handleResize);
//       if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
//       if (controlsRef.current) {
//         controlsRef.current.dispose();
//         controlsRef.current = null;
//       }
//       if (envMapTextureRef.current) {
//         envMapTextureRef.current.dispose();
//         envMapTextureRef.current = null;
//       }
//       if (skyboxMeshRef.current) {
//         sceneRef.current?.remove(skyboxMeshRef.current);
//         skyboxMeshRef.current.geometry?.dispose();
//         skyboxMeshRef.current.material?.dispose();
//         skyboxMeshRef.current = null;
//       }
//       if (meshRef.current) {
//         sceneRef.current?.remove(meshRef.current);
//         meshRef.current.geometry?.dispose();
//         if (meshRef.current.material) {
//           if (Array.isArray(meshRef.current.material))
//             meshRef.current.material.forEach((m) => m.dispose());
//           else meshRef.current.material.dispose();
//         }
//         meshRef.current = null;
//       }
//       if (composerRef.current) {
//         composerRef.current.passes.forEach((p) => {
//           if (p.dispose) p.dispose();
//         });
//         composerRef.current = null;
//       }
//       if (
//         ssaoPassRef.current &&
//         typeof ssaoPassRef.current.dispose === "function"
//       )
//         ssaoPassRef.current.dispose();
//       ssaoPassRef.current = null;
//       if (sceneRef.current) {
//         sceneRef.current.traverse((obj) => {
//           if (obj.geometry) obj.geometry.dispose();
//           if (obj.material) {
//             if (Array.isArray(obj.material))
//               obj.material.forEach((m) => m.dispose());
//             else if (obj.material.dispose) obj.material.dispose();
//           }
//         });
//         sceneRef.current = null;
//       }
//       if (rendererRef.current) {
//         if (currentMount && rendererRef.current.domElement) {
//           try {
//             currentMount.removeChild(rendererRef.current.domElement);
//           } catch (e) {
//             console.warn("Error removing renderer DOM:", e);
//           }
//         }
//         rendererRef.current.dispose();
//         rendererRef.current = null;
//       }
//       cameraRef.current = null;
//       lightsRef.current = [];
//     };
//   }, [isMounted]);

//   useEffect(() => {
//     if (!isMounted || !sceneRef.current || !rendererRef.current) return;
//     if (skyboxMeshRef.current) {
//       sceneRef.current.remove(skyboxMeshRef.current);
//       skyboxMeshRef.current.geometry?.dispose();
//       skyboxMeshRef.current.material?.dispose();
//       skyboxMeshRef.current = null;
//     }
//     sceneRef.current.background = null;
//     sceneRef.current.fog = null;
//     rendererRef.current.toneMappingExposure = 1.0;
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
//       const gradGeom = new THREE.SphereGeometry(50, 32, 32);
//       const gradMat = new THREE.ShaderMaterial({
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
//       skyboxMeshRef.current = new THREE.Mesh(gradGeom, gradMat);
//       sceneRef.current.add(skyboxMeshRef.current);
//     }
//     if (fogC) sceneRef.current.fog = new THREE.Fog(fogC, fogNear, fogFar);
//   }, [settings.background, isMounted]);

//   useEffect(() => {
//     if (!isMounted) return;
//     const baseIntensities = [0.2, 0.6, 0.25];
//     lightsRef.current.forEach((light, index) => {
//       if (
//         light &&
//         light.intensity !== undefined &&
//         baseIntensities[index] !== undefined
//       )
//         light.intensity = baseIntensities[index] * settings.lightIntensity;
//     });
//   }, [settings.lightIntensity, isMounted]);

//   // Destructure settings relevant to procedural mesh creation
//   const {
//     extrudeDepth,
//     quality,
//     shapeColor,
//     materialType: procMaterialType,
//   } = settings;

//   useEffect(() => {
//     if (!isMounted || !sceneRef.current) return;
//     if (meshRef.current) {
//       sceneRef.current.remove(meshRef.current);
//       meshRef.current.geometry?.dispose();
//       if (meshRef.current.material) {
//         if (Array.isArray(meshRef.current.material))
//           meshRef.current.material.forEach((m) => m.dispose());
//         else meshRef.current.material.dispose();
//       }
//       meshRef.current = null;
//     }
//     let newMesh;
//     if (isImportedModelDisplayed && importedModel && importedModel.scene) {
//       newMesh = importedModel.scene.clone(true);
//       const box = new THREE.Box3().setFromObject(newMesh);
//       const center = box.getCenter(new THREE.Vector3());
//       const sizeVec = box.getSize(new THREE.Vector3());
//       const maxDim = Math.max(
//         saneNumber(sizeVec.x, 1),
//         saneNumber(sizeVec.y, 1),
//         saneNumber(sizeVec.z, 1)
//       );
//       const desiredDisplaySize = 3;
//       const scaleFactor = maxDim > 0 ? desiredDisplaySize / maxDim : 1;
//       newMesh.scale.set(
//         saneNumber(scaleFactor, 1),
//         saneNumber(scaleFactor, 1),
//         saneNumber(scaleFactor, 1)
//       );
//       const scaledBox = new THREE.Box3().setFromObject(newMesh);
//       const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
//       if (
//         !isNaN(scaledCenter.x) &&
//         !isNaN(scaledCenter.y) &&
//         !isNaN(scaledCenter.z)
//       ) {
//         newMesh.position.sub(scaledCenter);
//       } else {
//         newMesh.position.set(0, 0, 0);
//       }
//       newMesh.traverse((child) => {
//         if (child.isMesh) {
//           child.castShadow = true;
//           child.receiveShadow = true;
//         }
//       });
//     } else {
//       const proceduralSettings = {
//         extrudeDepth,
//         quality,
//         shapeColor,
//         materialType: procMaterialType,
//         // Pass other settings if create3DShape needs them directly
//         animationSpeed: settings.animationSpeed,
//         lightIntensity: settings.lightIntensity,
//         background: settings.background,
//       };
//       newMesh = create3DShape(currentShape, proceduralSettings, 1.5);
//       newMesh.castShadow = true;
//       newMesh.receiveShadow = true;
//     }
//     newMesh.position.set(0, 0, 0);
//     animationState.current.floatY = 0;
//     animationState.current.targetRotation.set(0, 0, 0);
//     newMesh.rotation.set(0, 0, 0);
//     sceneRef.current.add(newMesh);
//     meshRef.current = newMesh;
//   }, [
//     currentShape,
//     extrudeDepth,
//     quality,
//     shapeColor,
//     procMaterialType, // Use destructured values from settings
//     isMounted,
//     importedModel,
//     isImportedModelDisplayed,
//     settings.animationSpeed,
//     settings.lightIntensity,
//     settings.background, // Add if create3DShape directly uses these for geometry/material
//   ]);

//   const handleResetAnimation = useCallback(() => {
//     animationState.current.targetRotation.set(0, 0, 0);
//     animationState.current.floatY = 0;
//     animationState.current.startTime = Date.now();
//     if (meshRef.current) {
//       meshRef.current.rotation.set(0, 0, 0);
//       meshRef.current.position.y = 0;
//     }
//     if (controlsRef.current) {
//       controlsRef.current.reset();
//       controlsRef.current.target.set(0, 0.2, 0);
//     }
//   }, []); // Empty deps if it only modifies refs and calls methods on refs

//   const handleToggleAnimation = useCallback(() => {
//     setIsAnimating((prev) => {
//       const newIsAnimating = !prev;
//       if (newIsAnimating) {
//         const preset = animationPresets[animationPresetRef.current];
//         const floatAmplitude = preset?.floatAmplitude || 0.1;
//         const floatSpeed = preset?.floatSpeed || 0.001;
//         // Avoid division by zero if amplitude or speed is zero
//         const timeDivisor = floatAmplitude * (floatSpeed * 100);
//         const timeOffset =
//           timeDivisor !== 0
//             ? (animationState.current.floatY / timeDivisor) * 1000
//             : 0;
//         animationState.current.startTime =
//           Date.now() - (isFinite(timeOffset) ? timeOffset : 0);
//       } else {
//         if (meshRef.current)
//           animationState.current.targetRotation.copy(meshRef.current.rotation);
//       }
//       return newIsAnimating;
//     });
//   }, []); // animationPresetRef is stable

//   const handleCategorySelect = useCallback(
//     (categoryId) => {
//       setIsImportedModelDisplayed(false);
//       setCurrentCategory(categoryId);
//       setCurrentShape(shapesByCategory[categoryId][0].id);
//       handleResetAnimation();
//     },
//     [shapesByCategory, handleResetAnimation]
//   );

//   const handleShapeSelect = useCallback(
//     (shapeId) => {
//       setIsImportedModelDisplayed(false);
//       setCurrentShape(shapeId);
//       handleResetAnimation();
//     },
//     [handleResetAnimation]
//   );

//   useEffect(() => {
//     if (isMounted) handleResetAnimation();
//   }, [animationPreset, isMounted, handleResetAnimation]);

//   const handleRandomize = useCallback(() => {
//     setIsImportedModelDisplayed(false);
//     const randCat = categories[Math.floor(Math.random() * categories.length)];
//     const randShapeList = shapesByCategory[randCat.id];
//     const randShape =
//       randShapeList[Math.floor(Math.random() * randShapeList.length)];
//     const randPresetKey =
//       Object.keys(animationPresets)[
//         Math.floor(Math.random() * Object.keys(animationPresets).length)
//       ];
//     const randColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
//     const bgKeys = Object.keys(backgroundOptions);
//     const randBgKey = bgKeys[Math.floor(Math.random() * bgKeys.length)];
//     const matKeys = [
//       "metallic",
//       "glass",
//       "crystal",
//       "ceramic",
//       "organic",
//       "plastic",
//       "neon",
//     ];
//     const randMat = matKeys[Math.floor(Math.random() * matKeys.length)];

//     setCurrentCategory(randCat.id);
//     setCurrentShape(randShape.id);
//     // setAnimationPreset will trigger its own useEffect which calls handleResetAnimation
//     setAnimationPreset(randPresetKey);

//     setSettings((prev) => ({
//       ...prev,
//       materialType: randMat,
//       shapeColor: randColor,
//       background: randBgKey,
//       extrudeDepth: saneNumber(Math.random() * (1.0 - 0.1) + 0.1, 0.4),
//       lightIntensity: saneNumber(Math.random() * (2.0 - 0.5) + 0.5, 1.0),
//     }));
//   }, [categories, shapesByCategory, backgroundOptions]);

//   const currentShapeRef = useRef(currentShape);
//   useEffect(() => {
//     currentShapeRef.current = currentShape;
//   }, [currentShape]);
//   const currentImportedModelNameRef = useRef(importedModelName);
//   useEffect(() => {
//     currentImportedModelNameRef.current = importedModelName;
//   }, [importedModelName]);

//   const handleExportGLB = useCallback(() => {
//     if (!meshRef.current || isExporting) return;
//     setIsExporting(true);
//     setExportProgress(0);
//     const exporter = new GLTFExporter();
//     let progress = 0;
//     const progInterval = setInterval(() => {
//       progress += Math.floor(Math.random() * 5 + 5);
//       const curProg = Math.min(progress, 95);
//       setExportProgress(curProg);
//       if (curProg >= 95) clearInterval(progInterval);
//     }, 80);
//     setTimeout(() => {
//       try {
//         if (!(meshRef.current instanceof THREE.Object3D))
//           throw new Error("Mesh not valid Object3D.");
//         const exportOptions = { binary: true };
//         if (
//           isImportedModelDisplayed &&
//           importedModel &&
//           importedModel.animations &&
//           importedModel.animations.length > 0
//         ) {
//           exportOptions.animations = importedModel.animations;
//         }

//         exporter.parse(
//           meshRef.current,
//           (gltf) => {
//             clearInterval(progInterval);
//             setExportProgress(98);
//             if (!(gltf instanceof ArrayBuffer)) {
//               setIsExporting(false);
//               setExportProgress(0);
//               console.error("Exported GLTF is not ArrayBuffer");
//               return;
//             }
//             const blob = new Blob([gltf], { type: "application/octet-stream" });
//             const link = document.createElement("a");
//             link.href = URL.createObjectURL(blob);
//             const fileNameToExport = isImportedModelDisplayed
//               ? currentImportedModelNameRef.current || "imported-model"
//               : currentShapeRef.current || "model";
//             link.download = `shape-${fileNameToExport}.glb`;
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             URL.revokeObjectURL(link.href);
//             setExportProgress(100);
//             setTimeout(() => setIsExporting(false), 500);
//           },
//           (error) => {
//             clearInterval(progInterval);
//             console.error("GLTFExporter.parse error:", error);
//             setIsExporting(false);
//             setExportProgress(0);
//           },
//           exportOptions
//         );
//       } catch (e) {
//         clearInterval(progInterval);
//         console.error("Error GLTF export:", e);
//         setIsExporting(false);
//         setExportProgress(0);
//       }
//     }, 100);
//   }, [isExporting, meshRef, isImportedModelDisplayed, importedModel]);

//   const handleSimulatedExportOBJ = useCallback(() => {
//     if (isExporting) return;
//     setIsExporting(true);
//     setExportProgress(0);
//     let p = 0;
//     const i = setInterval(() => {
//       p += Math.floor(Math.random() * 15 + 10);
//       setExportProgress(Math.min(p, 100));
//       if (p >= 100) {
//         clearInterval(i);
//         const l = document.createElement("a");
//         l.download = `shape-${
//           isImportedModelDisplayed
//             ? currentImportedModelNameRef.current
//             : currentShapeRef.current || "model"
//         }.obj`;
//         l.href =
//           "data:text/plain;charset=utf-8," +
//           encodeURIComponent(
//             "# OBJ file simulated\n# Replace with actual OBJ exporter output"
//           );
//         document.body.appendChild(l);
//         l.click();
//         document.body.removeChild(l);
//         setTimeout(() => setIsExporting(false), 500);
//       }
//     }, 150);
//   }, [isExporting, isImportedModelDisplayed]);

//   const handleTakeScreenshot = useCallback(() => {
//     if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
//     rendererRef.current.render(sceneRef.current, cameraRef.current);
//     if (composerRef.current) composerRef.current.render();

//     const canvas = rendererRef.current.domElement;
//     const link = document.createElement("a");
//     link.download = `screenshot-${
//       isImportedModelDisplayed
//         ? currentImportedModelNameRef.current
//         : currentShapeRef.current || "view"
//     }.png`;
//     link.href = canvas.toDataURL("image/png");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   }, [isImportedModelDisplayed]);

//   const processImportedGltf = useCallback(
//     (gltf, fileName) => {
//       const nameOnly =
//         fileName.split(".").slice(0, -1).join(".") || "Imported Model";
//       setImportedModelName(nameOnly);
//       setImportedModel({
//         scene: gltf.scene,
//         animations: gltf.animations || [],
//       });
//       setIsImportedModelDisplayed(true);
//       handleResetAnimation();
//       alert(`${fileName} imported! It will replace the current shape.`);
//     },
//     [handleResetAnimation]
//   );

//   const handleGlbFileSelected = useCallback(
//     (event) => {
//       const file = event.target.files[0];
//       if (
//         file &&
//         (file.name.toLowerCase().endsWith(".glb") ||
//           file.name.toLowerCase().endsWith(".gltf"))
//       ) {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           try {
//             const buffer = e.target.result;
//             const loader = getGltfLoader();
//             loader.parse(
//               buffer,
//               "",
//               (gltf) => processImportedGltf(gltf, file.name),
//               (error) => {
//                 console.error("GLB Parse Error:", error);
//                 alert(
//                   `Error parsing ${file.name}: ${
//                     error.message || String(error)
//                   }`
//                 );
//               }
//             );
//           } catch (error) {
//             console.error("GLB Read Error:", error);
//             alert("Error reading file.");
//           }
//         };
//         reader.readAsArrayBuffer(file);
//         if (glbFileInputRef.current) glbFileInputRef.current.value = null;
//       } else if (file) alert("Please select a .glb or .gltf file.");
//     },
//     [processImportedGltf]
//   );

//   const triggerGlbImport = useCallback(() => {
//     if (glbFileInputRef.current) glbFileInputRef.current.click();
//   }, []);

//   const handleFileDropOnViewer = useCallback(
//     (event) => {
//       event.preventDefault();
//       event.stopPropagation();
//       const files = event.dataTransfer.files;
//       if (files && files.length > 0) {
//         const file = files[0];
//         if (
//           file &&
//           (file.name.toLowerCase().endsWith(".glb") ||
//             file.name.toLowerCase().endsWith(".gltf"))
//         ) {
//           const reader = new FileReader();
//           reader.onload = (e) => {
//             try {
//               const buffer = e.target.result;
//               const loader = getGltfLoader();
//               loader.parse(
//                 buffer,
//                 "",
//                 (gltf) => processImportedGltf(gltf, file.name),
//                 (error) => {
//                   console.error("Dropped GLB Parse Error:", error);
//                   alert(
//                     `Error parsing ${file.name}: ${
//                       error.message || String(error)
//                     }`
//                   );
//                 }
//               );
//             } catch (err) {
//               console.error("Dropped GLB Read Error:", err);
//               alert("Error processing dropped file.");
//             }
//           };
//           reader.readAsArrayBuffer(file);
//         } else if (file) alert("Please drop a .glb or .gltf file.");
//       }
//     },
//     [processImportedGltf]
//   );

//   if (!isMounted) {
//     return (
//       <div className='min-h-screen flex items-center justify-center bg-slate-900 text-white'>
//         <p>Loading 3D Studio...</p>
//       </div>
//     );
//   }

//   return (
//     <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-3 sm:p-4 md:p-6 text-white select-none'>
//       <input
//         type='file'
//         accept='.glb,.gltf'
//         ref={glbFileInputRef}
//         onChange={handleGlbFileSelected}
//         style={{ display: "none" }}
//       />
//       <div className='max-w-screen-xl mx-auto'>
//         <header className='text-center mb-6 sm:mb-8'>
//           <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent'>
//             3D Shape Studio Pro
//           </h1>
//           <p className='text-slate-300 text-sm sm:text-base max-w-2xl mx-auto'>
//             Explore, customize, and animate 3D shapes. Import your own GLB/GLTF
//             models!
//           </p>
//         </header>
//         <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6'>
//           <div className='lg:col-span-1 space-y-4 sm:space-y-5 order-last lg:order-first'>
//             {!isImportedModelDisplayed && (
//               <>
//                 <CategorySelector
//                   categories={categories}
//                   currentCategory={currentCategory}
//                   onCategorySelect={handleCategorySelect}
//                 />
//                 <ShapeSelector
//                   shapes={shapesByCategory[currentCategory]}
//                   currentShape={currentShape}
//                   onShapeSelect={handleShapeSelect}
//                 />
//               </>
//             )}
//             {isImportedModelDisplayed && importedModel && (
//               <div className='bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/70 shadow-lg text-center'>
//                 <h3 className='text-lg font-semibold text-white mb-2'>
//                   Current Model
//                 </h3>
//                 <p
//                   className='text-sm text-slate-300 truncate'
//                   title={importedModelName}
//                 >
//                   {importedModelName}
//                 </p>
//                 <button
//                   onClick={() => {
//                     setImportedModel(null);
//                     setIsImportedModelDisplayed(false);
//                     setImportedModelName("Imported Model");
//                     const defaultCategoryId = categories[0].id;
//                     const defaultShapes = shapesByCategory[defaultCategoryId];
//                     setCurrentCategory(defaultCategoryId);
//                     setCurrentShape(defaultShapes[0].id);
//                     handleResetAnimation();
//                   }}
//                   className='mt-3 text-xs bg-red-500 hover:bg-red-600 text-white py-1.5 px-4 rounded-md flex items-center justify-center gap-1.5 w-full'
//                 >
//                   <XCircle size={14} /> Clear Imported
//                 </button>
//               </div>
//             )}
//             <AnimationControls
//               isAnimating={isAnimating}
//               onToggleAnimation={handleToggleAnimation}
//               onResetAnimation={handleResetAnimation}
//               animationPreset={animationPreset}
//               onPresetChange={setAnimationPreset}
//               onRandomize={handleRandomize}
//             />
//             <FileControls
//               onExportGLB={handleExportGLB}
//               onExportOBJ={handleSimulatedExportOBJ}
//               onTakeScreenshot={handleTakeScreenshot}
//               isExporting={isExporting}
//               exportProgress={exportProgress}
//               onImportGLB={triggerGlbImport}
//             />
//             <button
//               onClick={() => setShowSettings(true)}
//               className='w-full flex items-center justify-center gap-2 p-3 bg-slate-700 hover:bg-slate-600/90 text-white rounded-lg transition-all text-sm font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500'
//             >
//               <SettingsIcon size={16} /> Viewer Settings
//             </button>
//           </div>
//           <ThreeDViewer
//             mountRef={mountRef}
//             isExporting={isExporting}
//             exportProgress={exportProgress}
//             onDropFile={handleFileDropOnViewer}
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
//             © {new Date().getFullYear()} 3D Shape Studio Pro. Interactive 3D
//             Viewer.
//           </p>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default ModelViewer3D;

//phase one complete//

// import React, { useRef, useEffect, useState, useCallback } from "react";
// import * as THREE from "three";
// import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
// import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
// import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
// import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";
// import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
// // --- Phase 1 Imports ---
// import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
// // --- End Phase 1 Imports ---

// import {
//   Download,
//   Play,
//   Pause,
//   RotateCcw,
//   Camera,
//   Settings as SettingsIcon,
//   Shuffle,
//   UploadCloud,
//   XCircle,
// } from "lucide-react";

// // --- Helper to ensure numbers are valid ---
// const saneNumber = (value, defaultValue = 0) => {
//   const num = Number(value);
//   return isNaN(num) || !isFinite(num) ? defaultValue : num;
// };

// // --- Shape Creation Functions ---
// // ... (createCatShape, createBirdShape, etc. - no changes here)
// const createCatShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(0), saneNumber(s * 0.8));
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.6),
//     saneNumber(s * 0.8),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(0)
//   );
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.8),
//     saneNumber(-s * 0.6),
//     saneNumber(-s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(0),
//     saneNumber(-s * 0.8)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.8),
//     saneNumber(-s * 0.6),
//     saneNumber(s * 0.8),
//     saneNumber(0)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(s * 0.6),
//     saneNumber(s * 0.8),
//     saneNumber(0),
//     saneNumber(s * 0.8)
//   );
//   const ear1 = new THREE.Path();
//   ear1.moveTo(saneNumber(-s * 0.4), saneNumber(s * 0.6));
//   ear1.lineTo(saneNumber(-s * 0.7), saneNumber(s * 1.2));
//   ear1.lineTo(saneNumber(-s * 0.1), saneNumber(s * 0.9));
//   ear1.closePath();
//   const ear2 = new THREE.Path();
//   ear2.moveTo(saneNumber(s * 0.4), saneNumber(s * 0.6));
//   ear2.lineTo(saneNumber(s * 0.7), saneNumber(s * 1.2));
//   ear2.lineTo(saneNumber(s * 0.1), saneNumber(s * 0.9));
//   ear2.closePath();
//   shape.holes.push(ear1);
//   shape.holes.push(ear2);
//   return shape;
// };
// const createBirdShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(0), saneNumber(s * 0.6));
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.9),
//     saneNumber(-s * 0.2),
//     saneNumber(-s * 0.6),
//     saneNumber(-s * 0.6)
//   );
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.3),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.3),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.6),
//     saneNumber(-s * 0.6)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.9),
//     saneNumber(-s * 0.2),
//     saneNumber(s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(0),
//     saneNumber(s * 0.6)
//   );
//   const wing = new THREE.Path();
//   wing.moveTo(saneNumber(-s * 0.3), saneNumber(s * 0.2));
//   wing.bezierCurveTo(
//     saneNumber(-s * 0.7),
//     saneNumber(s * 0.3),
//     saneNumber(-s * 0.8),
//     saneNumber(0),
//     saneNumber(-s * 0.5),
//     saneNumber(-s * 0.3)
//   );
//   wing.bezierCurveTo(
//     saneNumber(-s * 0.2),
//     saneNumber(-s * 0.1),
//     saneNumber(-s * 0.1),
//     saneNumber(s * 0.1),
//     saneNumber(-s * 0.3),
//     saneNumber(s * 0.2)
//   );
//   shape.holes.push(wing);
//   return shape;
// };
// const createFishShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(-s * 0.8), saneNumber(0));
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.6),
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.2),
//     saneNumber(s * 0.5),
//     saneNumber(s * 0.2),
//     saneNumber(s * 0.3)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.6),
//     saneNumber(s * 0.2),
//     saneNumber(s * 0.8),
//     saneNumber(0),
//     saneNumber(s * 0.8),
//     saneNumber(0)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.6),
//     saneNumber(-s * 0.2),
//     saneNumber(s * 0.2),
//     saneNumber(-s * 0.3),
//     saneNumber(-s * 0.2),
//     saneNumber(-s * 0.5)
//   );
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.6),
//     saneNumber(-s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(0),
//     saneNumber(-s * 0.8),
//     saneNumber(0)
//   );
//   shape.moveTo(saneNumber(s * 0.8), saneNumber(0));
//   shape.lineTo(saneNumber(s * 1.2), saneNumber(s * 0.3));
//   shape.lineTo(saneNumber(s * 1.0), saneNumber(0));
//   shape.lineTo(saneNumber(s * 1.2), saneNumber(-s * 0.3));
//   shape.lineTo(saneNumber(s * 0.8), saneNumber(0));
//   return shape;
// };
// const createSoccerBallShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const r = s * 0.8;
//   for (let i = 0; i < 6; i++) {
//     const a = (i / 6) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * r);
//     const y = saneNumber(Math.sin(a) * r);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.closePath();
//   const ih = new THREE.Path();
//   const ir = s * 0.4;
//   for (let i = 0; i < 6; i++) {
//     const a = (i / 6) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * ir);
//     const y = saneNumber(Math.sin(a) * ir);
//     if (i === 0) ih.moveTo(x, y);
//     else ih.lineTo(x, y);
//   }
//   ih.closePath();
//   shape.holes.push(ih);
//   return shape;
// };
// const createTennisRacketShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const a = s * 0.6;
//   const b = s * 0.4;
//   for (let i = 0; i <= 32; i++) {
//     const ang = (i / 32) * Math.PI * 2;
//     const x = saneNumber(Math.cos(ang) * a);
//     const y = saneNumber(Math.sin(ang) * b + s * 0.3);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.lineTo(saneNumber(s * 0.1), saneNumber(-s * 0.8));
//   shape.lineTo(saneNumber(-s * 0.1), saneNumber(-s * 0.8));
//   shape.closePath();
//   return shape;
// };
// const createBasketballShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const r = s * 0.8;
//   for (let i = 0; i <= 32; i++) {
//     const a = (i / 32) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * r);
//     const y = saneNumber(Math.sin(a) * r);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.closePath();
//   return shape;
// };
// const createPersonShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const hr = s * 0.2;
//   for (let i = 0; i <= 16; i++) {
//     const a = (i / 16) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * hr);
//     const y = saneNumber(Math.sin(a) * hr + s * 0.6);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.lineTo(saneNumber(-s * 0.3), saneNumber(s * 0.2));
//   shape.lineTo(saneNumber(-s * 0.4), saneNumber(-s * 0.4));
//   shape.lineTo(saneNumber(-s * 0.2), saneNumber(-s * 0.8));
//   shape.lineTo(saneNumber(s * 0.2), saneNumber(-s * 0.8));
//   shape.lineTo(saneNumber(s * 0.4), saneNumber(-s * 0.4));
//   shape.lineTo(saneNumber(s * 0.3), saneNumber(s * 0.2));
//   shape.closePath();
//   return shape;
// };
// const createRobotShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(-sval * 0.4), saneNumber(sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.4), saneNumber(sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.4), saneNumber(sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.4), saneNumber(sval * 0.4));
//   shape.closePath();
//   shape.moveTo(saneNumber(-sval * 0.5), saneNumber(sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.5), saneNumber(sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.5), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.5), saneNumber(-sval * 0.4));
//   shape.closePath();
//   shape.moveTo(saneNumber(-sval * 0.3), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.1), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.1), saneNumber(-sval * 0.8));
//   shape.lineTo(saneNumber(-sval * 0.3), saneNumber(-sval * 0.8));
//   shape.closePath();
//   shape.moveTo(saneNumber(sval * 0.1), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.3), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.3), saneNumber(-sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.1), saneNumber(-sval * 0.8));
//   shape.closePath();
//   return shape;
// };
// const createPhoneShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const w = sval * 0.5;
//   const h = sval * 1.0;
//   const r = sval * 0.1;
//   shape.moveTo(saneNumber(-w + r), saneNumber(h));
//   shape.lineTo(saneNumber(w - r), saneNumber(h));
//   shape.quadraticCurveTo(
//     saneNumber(w),
//     saneNumber(h),
//     saneNumber(w),
//     saneNumber(h - r)
//   );
//   shape.lineTo(saneNumber(w), saneNumber(-h + r));
//   shape.quadraticCurveTo(
//     saneNumber(w),
//     saneNumber(-h),
//     saneNumber(w - r),
//     saneNumber(-h)
//   );
//   shape.lineTo(saneNumber(-w + r), saneNumber(-h));
//   shape.quadraticCurveTo(
//     saneNumber(-w),
//     saneNumber(-h),
//     saneNumber(-w),
//     saneNumber(-h + r)
//   );
//   shape.lineTo(saneNumber(-w), saneNumber(h - r));
//   shape.quadraticCurveTo(
//     saneNumber(-w),
//     saneNumber(h),
//     saneNumber(-w + r),
//     saneNumber(h)
//   );
//   shape.closePath();
//   const screen = new THREE.Path();
//   const sw = w * 0.8;
//   const sh = h * 0.8;
//   const sr = r * 0.5;
//   screen.moveTo(saneNumber(-sw + sr), saneNumber(sh));
//   screen.lineTo(saneNumber(sw - sr), saneNumber(sh));
//   screen.quadraticCurveTo(
//     saneNumber(sw),
//     saneNumber(sh),
//     saneNumber(sw),
//     saneNumber(sh - sr)
//   );
//   screen.lineTo(saneNumber(sw), saneNumber(-sh + sr));
//   screen.quadraticCurveTo(
//     saneNumber(sw),
//     saneNumber(-sh),
//     saneNumber(sw - sr),
//     saneNumber(-sh)
//   );
//   screen.lineTo(saneNumber(-sw + sr), saneNumber(-sh));
//   screen.quadraticCurveTo(
//     saneNumber(-sw),
//     saneNumber(-sh),
//     saneNumber(-sw),
//     saneNumber(-sh + sr)
//   );
//   screen.lineTo(saneNumber(-sw), saneNumber(sh - sr));
//   screen.quadraticCurveTo(
//     saneNumber(-sw),
//     saneNumber(sh),
//     saneNumber(-sw + sr),
//     saneNumber(sh)
//   );
//   screen.closePath();
//   shape.holes.push(screen);
//   return shape;
// };
// const createLightningShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(-sval * 0.2), saneNumber(sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.3), saneNumber(sval * 0.2));
//   shape.lineTo(saneNumber(sval * 0.1), saneNumber(sval * 0.2));
//   shape.lineTo(saneNumber(sval * 0.4), saneNumber(-sval * 0.8));
//   shape.lineTo(saneNumber(-sval * 0.1), saneNumber(-sval * 0.2));
//   shape.lineTo(saneNumber(sval * 0.1), saneNumber(-sval * 0.2));
//   shape.lineTo(saneNumber(-sval * 0.4), saneNumber(sval * 0.8));
//   shape.closePath();
//   return shape;
// };
// const createMusicNoteShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const nr = sval * 0.15;
//   for (let i = 0; i <= 16; i++) {
//     const a = (i / 16) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * nr - sval * 0.2);
//     const y = saneNumber(Math.sin(a) * nr - sval * 0.4);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.lineTo(saneNumber(-sval * 0.05), saneNumber(sval * 0.6));
//   shape.lineTo(saneNumber(sval * 0.05), saneNumber(sval * 0.6));
//   shape.lineTo(saneNumber(sval * 0.05), saneNumber(-sval * 0.25));
//   shape.closePath();
//   shape.moveTo(saneNumber(sval * 0.05), saneNumber(sval * 0.6));
//   shape.bezierCurveTo(
//     saneNumber(sval * 0.4),
//     saneNumber(sval * 0.5),
//     saneNumber(sval * 0.3),
//     saneNumber(sval * 0.2),
//     saneNumber(sval * 0.05),
//     saneNumber(sval * 0.3)
//   );
//   shape.closePath();
//   return shape;
// };

// const animationPresets = {
//   // ... (no changes here)
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

// const createAdvancedMaterial = (baseColor, materialType = "standard") => {
//   // ... (no changes here)
//   const color = new THREE.Color(baseColor);
//   const materialPresets = {
//     metallic: { metalness: 0.9, roughness: 0.1, envMapIntensity: 1.5 },
//     glass: {
//       metalness: 0.0,
//       roughness: 0.0,
//       transmission: 0.95,
//       thickness: 0.7,
//       transparent: true,
//       opacity: 0.85,
//       envMapIntensity: 2.0,
//       ior: 1.52,
//     },
//     crystal: {
//       metalness: 0.0,
//       roughness: 0.01,
//       transmission: 0.98,
//       thickness: 0.6,
//       transparent: true,
//       opacity: 0.9,
//       envMapIntensity: 2.5,
//       ior: 1.7,
//     },
//     ceramic: { metalness: 0.1, roughness: 0.6, envMapIntensity: 0.8 },
//     organic: { metalness: 0.0, roughness: 0.8, envMapIntensity: 0.5 },
//     plastic: { metalness: 0.0, roughness: 0.3, envMapIntensity: 0.7 },
//     neon: {
//       metalness: 0.0,
//       roughness: 0.1,
//       emissive: color.clone().multiplyScalar(0.8),
//       emissiveIntensity: 1.0,
//       envMapIntensity: 0.2,
//     },
//   };
//   const preset = materialPresets[materialType] || materialPresets.ceramic;
//   const sharedProps = { color, ...preset, side: THREE.DoubleSide };
//   if (materialType === "glass" || materialType === "crystal")
//     return new THREE.MeshPhysicalMaterial(sharedProps);
//   return new THREE.MeshStandardMaterial(sharedProps);
// };

// const create3DShape = (shapeId, currentSettings, size = 1) => {
//   // ... (no changes here)
//   let shape;
//   let materialType =
//     currentSettings.materialType === "auto"
//       ? "ceramic"
//       : currentSettings.materialType;
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
//   const config = shapeConfigs[shapeId] || shapeConfigs.cat;
//   const shapeSize = saneNumber(size, 1.5);
//   shape = config.creator(shapeSize);
//   if (currentSettings.materialType === "auto")
//     materialType = config.autoMaterial;
//   const extrudeSettings = {
//     depth: saneNumber(currentSettings.extrudeDepth, 0.4),
//     bevelEnabled: true,
//     bevelSegments:
//       currentSettings.quality === "high"
//         ? 10
//         : currentSettings.quality === "medium"
//         ? 6
//         : 3,
//     steps:
//       currentSettings.quality === "high"
//         ? 5
//         : currentSettings.quality === "medium"
//         ? 3
//         : 1,
//     bevelSize: saneNumber(0.035 * (shapeSize / 1.5), 0.02),
//     bevelThickness: saneNumber(0.025 * (shapeSize / 1.5), 0.015),
//     curveSegments:
//       currentSettings.quality === "high"
//         ? 48
//         : currentSettings.quality === "medium"
//         ? 24
//         : 12,
//   };
//   const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
//   geometry.computeVertexNormals();
//   try {
//     geometry.center();
//   } catch (e) {
//     console.error(
//       "Error centering geometry, likely due to NaN in shape path:",
//       e,
//       shapeId,
//       currentSettings,
//       shape
//     );
//     return new THREE.Mesh(
//       new THREE.BoxGeometry(1, 1, 1),
//       new THREE.MeshStandardMaterial({ color: 0xff0000 })
//     );
//   }
//   const material = createAdvancedMaterial(
//     currentSettings.shapeColor,
//     materialType
//   );
//   return new THREE.Mesh(geometry, material);
// };

// // --- UI Components ---
// // ... (CategorySelector, ShapeSelector, AnimationControls, FileControls, ThreeDViewer, SettingsPanel - no changes here)
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
//     <div className='grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50'>
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
// const FileControls = ({
//   onExportGLB,
//   onExportOBJ,
//   onTakeScreenshot,
//   isExporting,
//   exportProgress,
//   onImportGLB,
// }) => (
//   <div className='bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/70 shadow-lg'>
//     <h3 className='text-lg font-semibold text-white mb-3'>File & Export</h3>
//     <div className='space-y-2'>
//       <button
//         onClick={onImportGLB}
//         disabled={isExporting}
//         className='w-full flex items-center justify-center gap-2 p-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-400'
//       >
//         <UploadCloud size={14} /> Import Model
//       </button>
//       <button
//         onClick={onExportGLB}
//         disabled={isExporting}
//         className='w-full flex items-center justify-center gap-2 p-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600/70 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-400'
//       >
//         <Download size={14} />
//         {isExporting && exportProgress > 0 && exportProgress <= 100
//           ? `GLB... ${Math.round(exportProgress)}%`
//           : "Export GLB"}
//       </button>
//       <button
//         onClick={onExportOBJ}
//         disabled={isExporting}
//         className='w-full flex items-center justify-center gap-2 p-2.5 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600/70 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-teal-400'
//       >
//         <Download size={14} />
//         {isExporting && exportProgress > 0 && exportProgress <= 100
//           ? `OBJ... ${Math.round(exportProgress)}%`
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
// const ThreeDViewer = ({
//   mountRef,
//   isExporting,
//   exportProgress,
//   onDropFile,
// }) => (
//   <div className='lg:col-span-3 xl:col-span-3 order-first lg:order-last'>
//     <div className='bg-slate-800/30 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-slate-700/50 shadow-2xl aspect-[4/3] sm:aspect-video lg:aspect-[16/9]'>
//       <div
//         className='relative w-full h-full'
//         onDragOver={(e) => {
//           e.preventDefault();
//           e.stopPropagation();
//         }}
//         onDrop={onDropFile}
//       >
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
//         className='bg-slate-800 rounded-xl p-6 border-slate-700 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50'
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
//             <XCircle size={24} />
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
//               <option value='crystal'>Crystal</option>
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

// let gltfLoaderInstance;
// const getGltfLoader = () => {
//   // ... (no changes here)
//   if (!gltfLoaderInstance) {
//     gltfLoaderInstance = new GLTFLoader();
//     const dracoLoader = new DRACOLoader();
//     dracoLoader.setDecoderPath("/draco/gltf/");
//     gltfLoaderInstance.setDRACOLoader(dracoLoader);
//   }
//   return gltfLoaderInstance;
// };

// const ModelViewer3D = () => {
//   const [isMounted, setIsMounted] = useState(false);
//   const mountRef = useRef(null);
//   const sceneRef = useRef(null);
//   const rendererRef = useRef(null);
//   const cameraRef = useRef(null);
//   const controlsRef = useRef(null);
//   const composerRef = useRef(null);
//   const ssaoPassRef = useRef(null);
//   const meshRef = useRef(null);
//   const animationIdRef = useRef(null);
//   const lightsRef = useRef([]);
//   const skyboxMeshRef = useRef(null);
//   const envMapTextureRef = useRef(null);
//   const glbFileInputRef = useRef(null);

//   const [importedModel, setImportedModel] = useState(null);
//   const [isImportedModelDisplayed, setIsImportedModelDisplayed] =
//     useState(false);
//   const [importedModelName, setImportedModelName] = useState("Imported Model");

//   const categories = [
//     // ... (no changes here)
//     { id: "animals", name: "Animals", icon: "🐱" },
//     { id: "sports", name: "Sports", icon: "⚽" },
//     { id: "people", name: "People", icon: "👤" },
//     { id: "objects", name: "Objects", icon: "📱" },
//   ];
//   const shapesByCategory = {
//     // ... (no changes here)
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
//     // ... (no changes here)
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
//     lightIntensity: 1.0,
//     extrudeDepth: 0.4,
//     quality: "medium",
//     background: "studioDark",
//   });

//   // --- Phase 1: Ref for current settings ---
//   const currentSettingsRef = useRef(settings);
//   useEffect(() => {
//     currentSettingsRef.current = settings;
//   }, [settings]);
//   // --- End Phase 1 ---

//   const animationState = useRef({
//     // ... (no changes here)
//     rotation: new THREE.Euler(),
//     targetRotation: new THREE.Euler(),
//     floatY: 0,
//     startTime: Date.now(),
//   });

//   const isAnimatingRef = useRef(isAnimating); // ... (no changes here)
//   const animationPresetRef = useRef(animationPreset); // ... (no changes here)

//   useEffect(() => {
//     // ... (no changes here)
//     isAnimatingRef.current = isAnimating;
//   }, [isAnimating]);
//   useEffect(() => {
//     // ... (no changes here)
//     animationPresetRef.current = animationPreset;
//   }, [animationPreset]);
//   useEffect(() => {
//     // ... (no changes here)
//     setIsMounted(true);
//   }, []);

//   useEffect(() => {
//     // ... (Three.js setup - no fundamental changes here, only cleanup might be adjusted if needed)
//     if (!isMounted || !mountRef.current) return;
//     const currentMount = mountRef.current;
//     const scene = new THREE.Scene();
//     sceneRef.current = scene;
//     const camera = new THREE.PerspectiveCamera(
//       50,
//       currentMount.clientWidth / currentMount.clientHeight,
//       0.1,
//       1000
//     );
//     cameraRef.current = camera;
//     camera.position.set(0, 0.5, 6);
//     const renderer = new THREE.WebGLRenderer({
//       antialias: true,
//       alpha: true,
//       preserveDrawingBuffer: true,
//     });
//     rendererRef.current = renderer;
//     renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.shadowMap.enabled = true;
//     renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//     renderer.outputColorSpace = THREE.SRGBColorSpace;
//     renderer.toneMapping = THREE.ACESFilmicToneMapping;
//     renderer.toneMappingExposure = 1.0;
//     currentMount.appendChild(renderer.domElement);
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;
//     controls.dampingFactor = 0.05;
//     controls.screenSpacePanning = false;
//     controls.minDistance = 1.5;
//     controls.maxDistance = 25;
//     controls.maxPolarAngle = Math.PI / 1.5;
//     controls.target.set(0, 0.2, 0);
//     controlsRef.current = controls;
//     const rgbeLoader = new RGBELoader();
//     rgbeLoader.load("/brown_photostudio_02_4k.hdr", (texture) => {
//       texture.mapping = THREE.EquirectangularReflectionMapping;
//       if (sceneRef.current) {
//         sceneRef.current.environment = texture;
//         envMapTextureRef.current = texture;
//       }
//     });
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
//     scene.add(ambientLight);
//     const keyLight = new THREE.DirectionalLight(0xffffff, 0.6);
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

//     const composer = new EffectComposer(renderer);
//     composerRef.current = composer;
//     const renderPass = new RenderPass(scene, camera);
//     composer.addPass(renderPass);

//     const ssaoPassInstance = new SSAOPass(
//       scene,
//       camera,
//       currentMount.clientWidth,
//       currentMount.clientHeight
//     );
//     ssaoPassInstance.kernelRadius = 0.8;
//     ssaoPassInstance.minDistance = 0.002;
//     ssaoPassInstance.maxDistance = 0.05;
//     composer.addPass(ssaoPassInstance);
//     ssaoPassRef.current = ssaoPassInstance;

//     const outputPass = new OutputPass();
//     composer.addPass(outputPass);

//     const handleResize = () => {
//       if (!currentMount || !camera || !renderer) return;
//       const width = currentMount.clientWidth;
//       const height = currentMount.clientHeight;
//       camera.aspect = width / height;
//       camera.updateProjectionMatrix();
//       renderer.setSize(width, height);
//       if (composerRef.current) {
//         composerRef.current.setSize(width, height);
//         const sPass = composerRef.current.passes.find(
//           (p) => p instanceof SSAOPass
//         );
//         if (sPass) sPass.setSize(width, height);
//       }
//     };
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     const clock = new THREE.Clock();
//     const animate = () => {
//       if (!sceneRef.current || !rendererRef.current || !cameraRef.current) {
//         if (animationIdRef.current)
//           cancelAnimationFrame(animationIdRef.current);
//         return;
//       }
//       animationIdRef.current = requestAnimationFrame(animate);
//       const delta = clock.getDelta();
//       if (controlsRef.current) controlsRef.current.update();
//       if (meshRef.current && isAnimatingRef.current) {
//         const curSettings = settings; // Use settings from state for animation speed
//         const curPresetKey = animationPresetRef.current;
//         const preset = animationPresets[curPresetKey];
//         if (preset) {
//           const effDelta = delta * curSettings.animationSpeed;
//           animationState.current.targetRotation.x +=
//             preset.rotationSpeed[0] * 60 * effDelta;
//           animationState.current.targetRotation.y +=
//             preset.rotationSpeed[1] * 60 * effDelta;
//           animationState.current.targetRotation.z +=
//             preset.rotationSpeed[2] * 60 * effDelta;
//           meshRef.current.rotation.x = THREE.MathUtils.lerp(
//             meshRef.current.rotation.x,
//             animationState.current.targetRotation.x,
//             0.1
//           );
//           meshRef.current.rotation.y = THREE.MathUtils.lerp(
//             meshRef.current.rotation.y,
//             animationState.current.targetRotation.y,
//             0.1
//           );
//           meshRef.current.rotation.z = THREE.MathUtils.lerp(
//             meshRef.current.rotation.z,
//             animationState.current.targetRotation.z,
//             0.1
//           );
//           const floatTime =
//             (Date.now() - animationState.current.startTime) *
//             0.001 *
//             curSettings.animationSpeed;
//           animationState.current.floatY =
//             Math.sin(floatTime * (preset.floatSpeed || 0.0001) * 100) *
//             (preset.floatAmplitude || 0);
//           meshRef.current.position.y = animationState.current.floatY;
//         }
//       }
//       if (composerRef.current) composerRef.current.render(delta);
//     };
//     animate();
//     return () => {
//       window.removeEventListener("resize", handleResize);
//       if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
//       if (controlsRef.current) {
//         controlsRef.current.dispose();
//         controlsRef.current = null;
//       }
//       if (envMapTextureRef.current) {
//         envMapTextureRef.current.dispose();
//         envMapTextureRef.current = null;
//       }
//       if (skyboxMeshRef.current) {
//         sceneRef.current?.remove(skyboxMeshRef.current);
//         skyboxMeshRef.current.geometry?.dispose();
//         skyboxMeshRef.current.material?.dispose();
//         skyboxMeshRef.current = null;
//       }
//       if (meshRef.current) {
//         sceneRef.current?.remove(meshRef.current);
//         meshRef.current.geometry?.dispose();
//         if (meshRef.current.material) {
//           if (Array.isArray(meshRef.current.material))
//             meshRef.current.material.forEach((m) => m.dispose());
//           else meshRef.current.material.dispose();
//         }
//         meshRef.current = null;
//       }
//       if (composerRef.current) {
//         composerRef.current.passes.forEach((p) => {
//           if (p.dispose) p.dispose();
//         });
//         composerRef.current = null;
//       }
//       if (
//         ssaoPassRef.current &&
//         typeof ssaoPassRef.current.dispose === "function"
//       )
//         ssaoPassRef.current.dispose();
//       ssaoPassRef.current = null;
//       if (sceneRef.current) {
//         sceneRef.current.traverse((obj) => {
//           if (obj.geometry) obj.geometry.dispose();
//           if (obj.material) {
//             if (Array.isArray(obj.material))
//               obj.material.forEach((m) => m.dispose());
//             else if (obj.material.dispose) obj.material.dispose();
//           }
//         });
//         sceneRef.current = null;
//       }
//       if (rendererRef.current) {
//         if (currentMount && rendererRef.current.domElement) {
//           try {
//             currentMount.removeChild(rendererRef.current.domElement);
//           } catch (e) {
//             console.warn("Error removing renderer DOM:", e);
//           }
//         }
//         rendererRef.current.dispose();
//         rendererRef.current = null;
//       }
//       cameraRef.current = null;
//       lightsRef.current = [];
//     };
//   }, [isMounted]); // Removed settings from dep array for animate callback

//   useEffect(() => {
//     // Background setup (no changes here)
//     if (!isMounted || !sceneRef.current || !rendererRef.current) return;
//     if (skyboxMeshRef.current) {
//       sceneRef.current.remove(skyboxMeshRef.current);
//       skyboxMeshRef.current.geometry?.dispose();
//       skyboxMeshRef.current.material?.dispose();
//       skyboxMeshRef.current = null;
//     }
//     sceneRef.current.background = null;
//     sceneRef.current.fog = null;
//     rendererRef.current.toneMappingExposure = 1.0;
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
//       const gradGeom = new THREE.SphereGeometry(50, 32, 32);
//       const gradMat = new THREE.ShaderMaterial({
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
//       skyboxMeshRef.current = new THREE.Mesh(gradGeom, gradMat);
//       sceneRef.current.add(skyboxMeshRef.current);
//     }
//     if (fogC) sceneRef.current.fog = new THREE.Fog(fogC, fogNear, fogFar);
//   }, [settings.background, isMounted]);

//   useEffect(() => {
//     // Light intensity (no changes here)
//     if (!isMounted) return;
//     const baseIntensities = [0.2, 0.6, 0.25];
//     lightsRef.current.forEach((light, index) => {
//       if (
//         light &&
//         light.intensity !== undefined &&
//         baseIntensities[index] !== undefined
//       )
//         light.intensity = baseIntensities[index] * settings.lightIntensity;
//     });
//   }, [settings.lightIntensity, isMounted]);

//   const {
//     // Procedural mesh settings (no changes here)
//     extrudeDepth,
//     quality,
//     shapeColor,
//     materialType: procMaterialType,
//   } = settings;

//   useEffect(() => {
//     // Mesh creation/update logic (no changes here, just ensure importedModel flow is robust)
//     if (!isMounted || !sceneRef.current) return;
//     if (meshRef.current) {
//       sceneRef.current.remove(meshRef.current);
//       meshRef.current.geometry?.dispose();
//       if (meshRef.current.material) {
//         if (Array.isArray(meshRef.current.material))
//           meshRef.current.material.forEach((m) => m.dispose());
//         else meshRef.current.material.dispose();
//       }
//       meshRef.current = null;
//     }
//     let newMesh;
//     if (isImportedModelDisplayed && importedModel && importedModel.scene) {
//       newMesh = importedModel.scene.clone(true); // Clone to avoid modifying the original stored model
//       const box = new THREE.Box3().setFromObject(newMesh);
//       const center = box.getCenter(new THREE.Vector3());
//       const sizeVec = box.getSize(new THREE.Vector3());
//       const maxDim = Math.max(
//         saneNumber(sizeVec.x, 1),
//         saneNumber(sizeVec.y, 1),
//         saneNumber(sizeVec.z, 1)
//       );
//       const desiredDisplaySize = 3; // Adjust as needed
//       const scaleFactor = maxDim > 0 ? desiredDisplaySize / maxDim : 1;
//       newMesh.scale.set(
//         saneNumber(scaleFactor, 1),
//         saneNumber(scaleFactor, 1),
//         saneNumber(scaleFactor, 1)
//       );
//       // Recalculate center after scaling
//       const scaledBox = new THREE.Box3().setFromObject(newMesh);
//       const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
//       if (
//         !isNaN(scaledCenter.x) &&
//         !isNaN(scaledCenter.y) &&
//         !isNaN(scaledCenter.z)
//       ) {
//         newMesh.position.sub(scaledCenter);
//       } else {
//         console.warn(
//           "Imported model center calculation resulted in NaN, defaulting position to origin."
//         );
//         newMesh.position.set(0, 0, 0);
//       }
//       newMesh.traverse((child) => {
//         if (child.isMesh) {
//           child.castShadow = true;
//           child.receiveShadow = true;
//         }
//       });
//     } else {
//       const proceduralSettings = {
//         extrudeDepth,
//         quality,
//         shapeColor,
//         materialType: procMaterialType,
//         animationSpeed: settings.animationSpeed, // Pass only what create3DShape actually uses
//         lightIntensity: settings.lightIntensity,
//         background: settings.background,
//       };
//       newMesh = create3DShape(currentShape, proceduralSettings, 1.5);
//       newMesh.castShadow = true;
//       newMesh.receiveShadow = true;
//     }
//     newMesh.position.y = 0; // Ensure y starts at 0 before float animation
//     animationState.current.floatY = 0;
//     animationState.current.targetRotation.set(0, 0, 0);
//     newMesh.rotation.set(0, 0, 0);
//     sceneRef.current.add(newMesh);
//     meshRef.current = newMesh;
//   }, [
//     currentShape,
//     extrudeDepth,
//     quality,
//     shapeColor,
//     procMaterialType,
//     isMounted,
//     importedModel,
//     isImportedModelDisplayed,
//     settings.animationSpeed, // Ensure these are only dependencies if they affect geometry/material
//     settings.lightIntensity,
//     settings.background,
//   ]);

//   const handleResetAnimation = useCallback(() => {
//     // ... (no changes here)
//     animationState.current.targetRotation.set(0, 0, 0);
//     animationState.current.floatY = 0;
//     animationState.current.startTime = Date.now();
//     if (meshRef.current) {
//       meshRef.current.rotation.set(0, 0, 0);
//       meshRef.current.position.y = 0;
//     }
//     if (controlsRef.current) {
//       controlsRef.current.reset();
//       controlsRef.current.target.set(0, 0.2, 0);
//     }
//   }, []);

//   const handleToggleAnimation = useCallback(() => {
//     // ... (no changes here)
//     setIsAnimating((prev) => {
//       const newIsAnimating = !prev;
//       if (newIsAnimating) {
//         const preset = animationPresets[animationPresetRef.current];
//         const floatAmplitude = preset?.floatAmplitude || 0.1;
//         const floatSpeed = preset?.floatSpeed || 0.001;
//         const timeDivisor = floatAmplitude * (floatSpeed * 100);
//         const timeOffset =
//           timeDivisor !== 0
//             ? (animationState.current.floatY / timeDivisor) * 1000
//             : 0;
//         animationState.current.startTime =
//           Date.now() - (isFinite(timeOffset) ? timeOffset : 0);
//       } else {
//         if (meshRef.current)
//           animationState.current.targetRotation.copy(meshRef.current.rotation);
//       }
//       return newIsAnimating;
//     });
//   }, []);

//   const handleCategorySelect = useCallback(
//     // ... (no changes here)
//     (categoryId) => {
//       setIsImportedModelDisplayed(false);
//       setCurrentCategory(categoryId);
//       setCurrentShape(shapesByCategory[categoryId][0].id);
//       handleResetAnimation();
//     },
//     [shapesByCategory, handleResetAnimation]
//   );

//   const handleShapeSelect = useCallback(
//     // ... (no changes here)
//     (shapeId) => {
//       setIsImportedModelDisplayed(false);
//       setCurrentShape(shapeId);
//       handleResetAnimation();
//     },
//     [handleResetAnimation]
//   );

//   useEffect(() => {
//     // ... (no changes here)
//     if (isMounted) handleResetAnimation();
//   }, [animationPreset, isMounted, handleResetAnimation]);

//   const handleRandomize = useCallback(() => {
//     // ... (no changes here)
//     setIsImportedModelDisplayed(false);
//     const randCat = categories[Math.floor(Math.random() * categories.length)];
//     const randShapeList = shapesByCategory[randCat.id];
//     const randShape =
//       randShapeList[Math.floor(Math.random() * randShapeList.length)];
//     const randPresetKey =
//       Object.keys(animationPresets)[
//         Math.floor(Math.random() * Object.keys(animationPresets).length)
//       ];
//     const randColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
//     const bgKeys = Object.keys(backgroundOptions);
//     const randBgKey = bgKeys[Math.floor(Math.random() * bgKeys.length)];
//     const matKeys = [
//       "metallic",
//       "glass",
//       "crystal",
//       "ceramic",
//       "organic",
//       "plastic",
//       "neon",
//     ];
//     const randMat = matKeys[Math.floor(Math.random() * matKeys.length)];

//     setCurrentCategory(randCat.id);
//     setCurrentShape(randShape.id);
//     setAnimationPreset(randPresetKey);

//     setSettings((prev) => ({
//       ...prev,
//       materialType: randMat,
//       shapeColor: randColor,
//       background: randBgKey,
//       extrudeDepth: saneNumber(Math.random() * (1.0 - 0.1) + 0.1, 0.4),
//       lightIntensity: saneNumber(Math.random() * (2.0 - 0.5) + 0.5, 1.0),
//     }));
//   }, [categories, shapesByCategory, backgroundOptions]);

//   const currentShapeRef = useRef(currentShape); // ... (no changes here)
//   useEffect(() => {
//     // ... (no changes here)
//     currentShapeRef.current = currentShape;
//   }, [currentShape]);
//   const currentImportedModelNameRef = useRef(importedModelName); // ... (no changes here)
//   useEffect(() => {
//     // ... (no changes here)
//     currentImportedModelNameRef.current = importedModelName;
//   }, [importedModelName]);

//   const handleExportGLB = useCallback(() => {
//     // ... (no changes here)
//     if (!meshRef.current || isExporting) return;
//     setIsExporting(true);
//     setExportProgress(0);
//     const exporter = new GLTFExporter();
//     let progress = 0;
//     const progInterval = setInterval(() => {
//       progress += Math.floor(Math.random() * 5 + 5);
//       const curProg = Math.min(progress, 95);
//       setExportProgress(curProg);
//       if (curProg >= 95) clearInterval(progInterval);
//     }, 80);
//     setTimeout(() => {
//       try {
//         if (!(meshRef.current instanceof THREE.Object3D))
//           throw new Error("Mesh not valid Object3D.");
//         const exportOptions = { binary: true };
//         if (
//           isImportedModelDisplayed &&
//           importedModel &&
//           importedModel.animations &&
//           importedModel.animations.length > 0
//         ) {
//           exportOptions.animations = importedModel.animations;
//         }

//         exporter.parse(
//           meshRef.current,
//           (gltf) => {
//             clearInterval(progInterval);
//             setExportProgress(98);
//             if (!(gltf instanceof ArrayBuffer)) {
//               setIsExporting(false);
//               setExportProgress(0);
//               console.error("Exported GLTF is not ArrayBuffer");
//               return;
//             }
//             const blob = new Blob([gltf], { type: "application/octet-stream" });
//             const link = document.createElement("a");
//             link.href = URL.createObjectURL(blob);
//             const fileNameToExport = isImportedModelDisplayed
//               ? currentImportedModelNameRef.current || "imported-model"
//               : currentShapeRef.current || "model";
//             link.download = `shape-${fileNameToExport}.glb`;
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             URL.revokeObjectURL(link.href);
//             setExportProgress(100);
//             setTimeout(() => setIsExporting(false), 500);
//           },
//           (error) => {
//             clearInterval(progInterval);
//             console.error("GLTFExporter.parse error:", error);
//             setIsExporting(false);
//             setExportProgress(0);
//           },
//           exportOptions
//         );
//       } catch (e) {
//         clearInterval(progInterval);
//         console.error("Error GLTF export:", e);
//         setIsExporting(false);
//         setExportProgress(0);
//       }
//     }, 100);
//   }, [isExporting, meshRef, isImportedModelDisplayed, importedModel]);

//   const handleSimulatedExportOBJ = useCallback(() => {
//     // ... (no changes here)
//     if (isExporting) return;
//     setIsExporting(true);
//     setExportProgress(0);
//     let p = 0;
//     const i = setInterval(() => {
//       p += Math.floor(Math.random() * 15 + 10);
//       setExportProgress(Math.min(p, 100));
//       if (p >= 100) {
//         clearInterval(i);
//         const l = document.createElement("a");
//         l.download = `shape-${
//           isImportedModelDisplayed
//             ? currentImportedModelNameRef.current
//             : currentShapeRef.current || "model"
//         }.obj`;
//         l.href =
//           "data:text/plain;charset=utf-8," +
//           encodeURIComponent(
//             "# OBJ file simulated\n# Replace with actual OBJ exporter output"
//           );
//         document.body.appendChild(l);
//         l.click();
//         document.body.removeChild(l);
//         setTimeout(() => setIsExporting(false), 500);
//       }
//     }, 150);
//   }, [isExporting, isImportedModelDisplayed]);

//   const handleTakeScreenshot = useCallback(() => {
//     // ... (no changes here)
//     if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
//     rendererRef.current.render(sceneRef.current, cameraRef.current);
//     if (composerRef.current) composerRef.current.render();

//     const canvas = rendererRef.current.domElement;
//     const link = document.createElement("a");
//     link.download = `screenshot-${
//       isImportedModelDisplayed
//         ? currentImportedModelNameRef.current
//         : currentShapeRef.current || "view"
//     }.png`;
//     link.href = canvas.toDataURL("image/png");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   }, [isImportedModelDisplayed]);

//   // --- Phase 1: New helper function to process and set the imported model ---
//   const processAndSetImportedModel = useCallback(
//     (scene, animations, fileName) => {
//       const nameOnly =
//         fileName.split(".").slice(0, -1).join(".") || "Imported Model";
//       setImportedModelName(nameOnly);
//       setImportedModel({ scene, animations: animations || [] });
//       setIsImportedModelDisplayed(true);
//       handleResetAnimation();
//       alert(
//         `${fileName} imported successfully! It will replace the current shape.`
//       );
//     },
//     [handleResetAnimation] // handleResetAnimation is stable
//   );
//   // --- End Phase 1 ---

//   // --- Phase 1: Modified GLB/GLTF processing (now uses processAndSetImportedModel) ---
//   // This function is only for GLTF and is called by the GLTFLoader's async callback
//   const processImportedGltf = useCallback(
//     (gltf, fileName) => {
//       processAndSetImportedModel(gltf.scene, gltf.animations, fileName);
//     },
//     [processAndSetImportedModel] // Depends on the new stable helper
//   );
//   // --- End Phase 1 ---

//   // --- Phase 1: Modified file selection handler ---
//   const handleFileSelected = useCallback(
//     (file) => {
//       if (
//         file &&
//         (file.name.toLowerCase().endsWith(".glb") ||
//           file.name.toLowerCase().endsWith(".gltf") ||
//           file.name.toLowerCase().endsWith(".stl") ||
//           file.name.toLowerCase().endsWith(".obj"))
//       ) {
//         const reader = new FileReader();
//         const lowerFileName = file.name.toLowerCase();

//         reader.onload = (readEvent) => {
//           try {
//             const fileContent = readEvent.target.result;
//             let modelScene = null;
//             let modelAnimations = [];

//             if (
//               lowerFileName.endsWith(".glb") ||
//               lowerFileName.endsWith(".gltf")
//             ) {
//               const loader = getGltfLoader();
//               loader.parse(
//                 fileContent,
//                 "",
//                 (gltf) => {
//                   processImportedGltf(gltf, file.name);
//                 },
//                 (error) => {
//                   console.error("GLB/GLTF Parse Error:", error);
//                   alert(
//                     `Error parsing ${file.name}: ${
//                       error.message || String(error)
//                     }`
//                   );
//                 }
//               );
//               return;
//             } else if (lowerFileName.endsWith(".stl")) {
//               const loader = new STLLoader();
//               const geometry = loader.parse(fileContent);
//               if (!geometry.isBufferGeometry) {
//                 throw new Error("Failed to parse STL: Invalid geometry.");
//               }
//               // STL has no color info, so applying a default is necessary
//               const material = createAdvancedMaterial(
//                 currentSettingsRef.current.shapeColor,
//                 "plastic"
//               ); // Changed to 'plastic' for a common STL use case
//               const mesh = new THREE.Mesh(geometry, material);
//               modelScene = mesh;
//             } else if (lowerFileName.endsWith(".obj")) {
//               const loader = new OBJLoader();
//               const object = loader.parse(fileContent);

//               // --- MODIFIED OBJ MATERIAL HANDLING ---
//               object.traverse((child) => {
//                 if (child.isMesh) {
//                   // If the loader provided a material, let's try to use it.
//                   // We might still want to apply our defaults if the material is too basic or non-existent.
//                   if (child.material) {
//                     // If it's an array of materials (multi-material object)
//                     if (Array.isArray(child.material)) {
//                       child.material.forEach((mat, index) => {
//                         if (
//                           !mat ||
//                           mat.name === "" ||
//                           (mat.isMeshBasicMaterial &&
//                             mat.color.equals(new THREE.Color(0xffffff)))
//                         ) {
//                           // If a specific material in the array is basic/default, replace it
//                           child.material[index] = createAdvancedMaterial(
//                             currentSettingsRef.current.shapeColor,
//                             "ceramic"
//                           );
//                         } else {
//                           // Otherwise, ensure double side for visibility, common for OBJ
//                           mat.side = THREE.DoubleSide;
//                         }
//                       });
//                     } else {
//                       // Single material
//                       if (
//                         !child.material ||
//                         child.material.name === "" ||
//                         (child.material.isMeshBasicMaterial &&
//                           child.material.color.equals(
//                             new THREE.Color(0xffffff)
//                           ))
//                       ) {
//                         // If the material is very basic (e.g. default white MeshBasicMaterial), replace it
//                         child.material = createAdvancedMaterial(
//                           currentSettingsRef.current.shapeColor,
//                           "ceramic"
//                         );
//                       } else {
//                         // Otherwise, ensure double side for visibility
//                         child.material.side = THREE.DoubleSide;
//                       }
//                     }
//                   } else {
//                     // No material at all, apply our default
//                     child.material = createAdvancedMaterial(
//                       currentSettingsRef.current.shapeColor,
//                       "ceramic"
//                     );
//                   }
//                   // Ensure cast/receive shadow for all imported meshes
//                   child.castShadow = true;
//                   child.receiveShadow = true;
//                 }
//               });
//               // --- END MODIFIED OBJ MATERIAL HANDLING ---
//               modelScene = object;
//             }

//             if (modelScene) {
//               processAndSetImportedModel(
//                 modelScene,
//                 modelAnimations,
//                 file.name
//               );
//             }
//           } catch (error) {
//             console.error("Model Load/Parse Error:", error, file.name);
//             alert(
//               `Error processing ${file.name}: ${error.message || String(error)}`
//             );
//           }
//         };
//         reader.onerror = (error) => {
//           console.error("FileReader Error:", error);
//           alert("Error reading file.");
//         };

//         if (lowerFileName.endsWith(".obj")) {
//           reader.readAsText(file);
//         } else {
//           reader.readAsArrayBuffer(file);
//         }

//         if (glbFileInputRef.current) glbFileInputRef.current.value = null;
//       } else if (file) {
//         alert("Unsupported file type. Please select GLB, GLTF, STL, or OBJ.");
//       }
//     },
//     [processImportedGltf, processAndSetImportedModel]
//   );
//   // --- End Phase 1 ---

//   const triggerGlbImport = useCallback(() => {
//     if (glbFileInputRef.current) glbFileInputRef.current.click();
//   }, []);

//   // --- Phase 1: Modified file drop handler ---
//   const handleFileDropOnViewer = useCallback(
//     (event) => {
//       event.preventDefault();
//       event.stopPropagation();
//       const files = event.dataTransfer.files;
//       if (files && files.length > 0) {
//         const file = files[0];
//         // Use the same unified handleFileSelected logic
//         handleFileSelected(file);
//       }
//     },
//     [handleFileSelected] // Now depends on the unified handler
//   );
//   // --- End Phase 1 ---

//   if (!isMounted) {
//     // ... (no changes here)
//     return (
//       <div className='min-h-screen flex items-center justify-center bg-slate-900 text-white'>
//         <p>Loading 3D Studio...</p>
//       </div>
//     );
//   }

//   return (
//     <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-3 sm:p-4 md:p-6 text-white select-none'>
//       <input
//         type='file'
//         // --- Phase 1: Update accepted file types ---
//         accept='.glb,.gltf,.stl,.obj'
//         // --- End Phase 1 ---
//         ref={glbFileInputRef}
//         onChange={(e) => handleFileSelected(e.target.files[0])} // Use unified handler
//         style={{ display: "none" }}
//       />
//       <div className='max-w-screen-xl mx-auto'>
//         <header className='text-center mb-6 sm:mb-8'>
//           <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent'>
//             3D Shape Studio Pro
//           </h1>
//           <p className='text-slate-300 text-sm sm:text-base max-w-2xl mx-auto'>
//             Explore, customize, and animate 3D shapes. Import your own GLB/GLTF,
//             STL, or OBJ models!
//           </p>
//         </header>
//         <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6'>
//           <div className='lg:col-span-1 space-y-4 sm:space-y-5 order-last lg:order-first'>
//             {/* ... (UI for category/shape selectors - no changes, but they are hidden if importedModelDisplayed) ... */}
//             {!isImportedModelDisplayed && (
//               <>
//                 <CategorySelector
//                   categories={categories}
//                   currentCategory={currentCategory}
//                   onCategorySelect={handleCategorySelect}
//                 />
//                 <ShapeSelector
//                   shapes={shapesByCategory[currentCategory]}
//                   currentShape={currentShape}
//                   onShapeSelect={handleShapeSelect}
//                 />
//               </>
//             )}
//             {isImportedModelDisplayed && importedModel && (
//               <div className='bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/70 shadow-lg text-center'>
//                 <h3 className='text-lg font-semibold text-white mb-2'>
//                   Current Model
//                 </h3>
//                 <p
//                   className='text-sm text-slate-300 truncate'
//                   title={importedModelName}
//                 >
//                   {importedModelName}
//                 </p>
//                 <button
//                   onClick={() => {
//                     setImportedModel(null);
//                     setIsImportedModelDisplayed(false);
//                     setImportedModelName("Imported Model");
//                     const defaultCategoryId = categories[0].id;
//                     const defaultShapes = shapesByCategory[defaultCategoryId];
//                     setCurrentCategory(defaultCategoryId);
//                     setCurrentShape(defaultShapes[0].id);
//                     handleResetAnimation();
//                   }}
//                   className='mt-3 text-xs bg-red-500 hover:bg-red-600 text-white py-1.5 px-4 rounded-md flex items-center justify-center gap-1.5 w-full'
//                 >
//                   <XCircle size={14} /> Clear Imported
//                 </button>
//               </div>
//             )}
//             <AnimationControls
//               isAnimating={isAnimating}
//               onToggleAnimation={handleToggleAnimation}
//               onResetAnimation={handleResetAnimation}
//               animationPreset={animationPreset}
//               onPresetChange={setAnimationPreset}
//               onRandomize={handleRandomize}
//             />
//             <FileControls
//               onExportGLB={handleExportGLB}
//               onExportOBJ={handleSimulatedExportOBJ}
//               onTakeScreenshot={handleTakeScreenshot}
//               isExporting={isExporting}
//               exportProgress={exportProgress}
//               onImportGLB={triggerGlbImport} // Button text changed to "Import Model"
//             />
//             <button
//               onClick={() => setShowSettings(true)}
//               className='w-full flex items-center justify-center gap-2 p-3 bg-slate-700 hover:bg-slate-600/90 text-white rounded-lg transition-all text-sm font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500'
//             >
//               <SettingsIcon size={16} /> Viewer Settings
//             </button>
//           </div>
//           <ThreeDViewer
//             mountRef={mountRef}
//             isExporting={isExporting}
//             exportProgress={exportProgress}
//             onDropFile={handleFileDropOnViewer}
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
//             © {new Date().getFullYear()} 3D Shape Studio Pro. Interactive 3D
//             Viewer.
//           </p>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default ModelViewer3D;

// phase two try //

// import React, { useRef, useEffect, useState, useCallback } from "react";
// import * as THREE from "three";
// import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
// import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
// import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
// import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";
// import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
// import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
// // --- Phase 2 Import ---
// import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
// // --- End Phase 2 Import ---

// import {
//   Download,
//   Play,
//   Pause,
//   RotateCcw,
//   Camera,
//   Settings as SettingsIcon,
//   Shuffle,
//   UploadCloud,
//   XCircle,
// } from "lucide-react";

// // ... (saneNumber, Shape Creation Functions, animationPresets, createAdvancedMaterial, create3DShape - no changes) ...
// const saneNumber = (value, defaultValue = 0) => {
//   const num = Number(value);
//   return isNaN(num) || !isFinite(num) ? defaultValue : num;
// };

// // --- Shape Creation Functions ---
// const createCatShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(0), saneNumber(s * 0.8));
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.6),
//     saneNumber(s * 0.8),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(0)
//   );
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.8),
//     saneNumber(-s * 0.6),
//     saneNumber(-s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(0),
//     saneNumber(-s * 0.8)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.8),
//     saneNumber(-s * 0.6),
//     saneNumber(s * 0.8),
//     saneNumber(0)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(s * 0.6),
//     saneNumber(s * 0.8),
//     saneNumber(0),
//     saneNumber(s * 0.8)
//   );
//   const ear1 = new THREE.Path();
//   ear1.moveTo(saneNumber(-s * 0.4), saneNumber(s * 0.6));
//   ear1.lineTo(saneNumber(-s * 0.7), saneNumber(s * 1.2));
//   ear1.lineTo(saneNumber(-s * 0.1), saneNumber(s * 0.9));
//   ear1.closePath();
//   const ear2 = new THREE.Path();
//   ear2.moveTo(saneNumber(s * 0.4), saneNumber(s * 0.6));
//   ear2.lineTo(saneNumber(s * 0.7), saneNumber(s * 1.2));
//   ear2.lineTo(saneNumber(s * 0.1), saneNumber(s * 0.9));
//   ear2.closePath();
//   shape.holes.push(ear1);
//   shape.holes.push(ear2);
//   return shape;
// };
// const createBirdShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(0), saneNumber(s * 0.6));
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.9),
//     saneNumber(-s * 0.2),
//     saneNumber(-s * 0.6),
//     saneNumber(-s * 0.6)
//   );
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.3),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.3),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.6),
//     saneNumber(-s * 0.6)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.9),
//     saneNumber(-s * 0.2),
//     saneNumber(s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(0),
//     saneNumber(s * 0.6)
//   );
//   const wing = new THREE.Path();
//   wing.moveTo(saneNumber(-s * 0.3), saneNumber(s * 0.2));
//   wing.bezierCurveTo(
//     saneNumber(-s * 0.7),
//     saneNumber(s * 0.3),
//     saneNumber(-s * 0.8),
//     saneNumber(0),
//     saneNumber(-s * 0.5),
//     saneNumber(-s * 0.3)
//   );
//   wing.bezierCurveTo(
//     saneNumber(-s * 0.2),
//     saneNumber(-s * 0.1),
//     saneNumber(-s * 0.1),
//     saneNumber(s * 0.1),
//     saneNumber(-s * 0.3),
//     saneNumber(s * 0.2)
//   );
//   shape.holes.push(wing);
//   return shape;
// };
// const createFishShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(-s * 0.8), saneNumber(0));
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.6),
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.2),
//     saneNumber(s * 0.5),
//     saneNumber(s * 0.2),
//     saneNumber(s * 0.3)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.6),
//     saneNumber(s * 0.2),
//     saneNumber(s * 0.8),
//     saneNumber(0),
//     saneNumber(s * 0.8),
//     saneNumber(0)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.6),
//     saneNumber(-s * 0.2),
//     saneNumber(s * 0.2),
//     saneNumber(-s * 0.3),
//     saneNumber(-s * 0.2),
//     saneNumber(-s * 0.5)
//   );
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.6),
//     saneNumber(-s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(0),
//     saneNumber(-s * 0.8),
//     saneNumber(0)
//   );
//   shape.moveTo(saneNumber(s * 0.8), saneNumber(0));
//   shape.lineTo(saneNumber(s * 1.2), saneNumber(s * 0.3));
//   shape.lineTo(saneNumber(s * 1.0), saneNumber(0));
//   shape.lineTo(saneNumber(s * 1.2), saneNumber(-s * 0.3));
//   shape.lineTo(saneNumber(s * 0.8), saneNumber(0));
//   return shape;
// };
// const createSoccerBallShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const r = s * 0.8;
//   for (let i = 0; i < 6; i++) {
//     const a = (i / 6) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * r);
//     const y = saneNumber(Math.sin(a) * r);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.closePath();
//   const ih = new THREE.Path();
//   const ir = s * 0.4;
//   for (let i = 0; i < 6; i++) {
//     const a = (i / 6) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * ir);
//     const y = saneNumber(Math.sin(a) * ir);
//     if (i === 0) ih.moveTo(x, y);
//     else ih.lineTo(x, y);
//   }
//   ih.closePath();
//   shape.holes.push(ih);
//   return shape;
// };
// const createTennisRacketShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const a = s * 0.6;
//   const b = s * 0.4;
//   for (let i = 0; i <= 32; i++) {
//     const ang = (i / 32) * Math.PI * 2;
//     const x = saneNumber(Math.cos(ang) * a);
//     const y = saneNumber(Math.sin(ang) * b + s * 0.3);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.lineTo(saneNumber(s * 0.1), saneNumber(-s * 0.8));
//   shape.lineTo(saneNumber(-s * 0.1), saneNumber(-s * 0.8));
//   shape.closePath();
//   return shape;
// };
// const createBasketballShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const r = s * 0.8;
//   for (let i = 0; i <= 32; i++) {
//     const a = (i / 32) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * r);
//     const y = saneNumber(Math.sin(a) * r);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.closePath();
//   return shape;
// };
// const createPersonShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const hr = s * 0.2;
//   for (let i = 0; i <= 16; i++) {
//     const a = (i / 16) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * hr);
//     const y = saneNumber(Math.sin(a) * hr + s * 0.6);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.lineTo(saneNumber(-s * 0.3), saneNumber(s * 0.2));
//   shape.lineTo(saneNumber(-s * 0.4), saneNumber(-s * 0.4));
//   shape.lineTo(saneNumber(-s * 0.2), saneNumber(-s * 0.8));
//   shape.lineTo(saneNumber(s * 0.2), saneNumber(-s * 0.8));
//   shape.lineTo(saneNumber(s * 0.4), saneNumber(-s * 0.4));
//   shape.lineTo(saneNumber(s * 0.3), saneNumber(s * 0.2));
//   shape.closePath();
//   return shape;
// };
// const createRobotShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(-sval * 0.4), saneNumber(sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.4), saneNumber(sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.4), saneNumber(sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.4), saneNumber(sval * 0.4));
//   shape.closePath();
//   shape.moveTo(saneNumber(-sval * 0.5), saneNumber(sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.5), saneNumber(sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.5), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.5), saneNumber(-sval * 0.4));
//   shape.closePath();
//   shape.moveTo(saneNumber(-sval * 0.3), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.1), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.1), saneNumber(-sval * 0.8));
//   shape.lineTo(saneNumber(-sval * 0.3), saneNumber(-sval * 0.8));
//   shape.closePath();
//   shape.moveTo(saneNumber(sval * 0.1), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.3), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.3), saneNumber(-sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.1), saneNumber(-sval * 0.8));
//   shape.closePath();
//   return shape;
// };
// const createPhoneShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const w = sval * 0.5;
//   const h = sval * 1.0;
//   const r = sval * 0.1;
//   shape.moveTo(saneNumber(-w + r), saneNumber(h));
//   shape.lineTo(saneNumber(w - r), saneNumber(h));
//   shape.quadraticCurveTo(
//     saneNumber(w),
//     saneNumber(h),
//     saneNumber(w),
//     saneNumber(h - r)
//   );
//   shape.lineTo(saneNumber(w), saneNumber(-h + r));
//   shape.quadraticCurveTo(
//     saneNumber(w),
//     saneNumber(-h),
//     saneNumber(w - r),
//     saneNumber(-h)
//   );
//   shape.lineTo(saneNumber(-w + r), saneNumber(-h));
//   shape.quadraticCurveTo(
//     saneNumber(-w),
//     saneNumber(-h),
//     saneNumber(-w),
//     saneNumber(-h + r)
//   );
//   shape.lineTo(saneNumber(-w), saneNumber(h - r));
//   shape.quadraticCurveTo(
//     saneNumber(-w),
//     saneNumber(h),
//     saneNumber(-w + r),
//     saneNumber(h)
//   );
//   shape.closePath();
//   const screen = new THREE.Path();
//   const sw = w * 0.8;
//   const sh = h * 0.8;
//   const sr = r * 0.5;
//   screen.moveTo(saneNumber(-sw + sr), saneNumber(sh));
//   screen.lineTo(saneNumber(sw - sr), saneNumber(sh));
//   screen.quadraticCurveTo(
//     saneNumber(sw),
//     saneNumber(sh),
//     saneNumber(sw),
//     saneNumber(sh - sr)
//   );
//   screen.lineTo(saneNumber(sw), saneNumber(-sh + sr));
//   screen.quadraticCurveTo(
//     saneNumber(sw),
//     saneNumber(-sh),
//     saneNumber(sw - sr),
//     saneNumber(-sh)
//   );
//   screen.lineTo(saneNumber(-sw + sr), saneNumber(-sh));
//   screen.quadraticCurveTo(
//     saneNumber(-sw),
//     saneNumber(-sh),
//     saneNumber(-sw),
//     saneNumber(-sh + sr)
//   );
//   screen.lineTo(saneNumber(-sw), saneNumber(sh - sr));
//   screen.quadraticCurveTo(
//     saneNumber(-sw),
//     saneNumber(sh),
//     saneNumber(-sw + sr),
//     saneNumber(sh)
//   );
//   screen.closePath();
//   shape.holes.push(screen);
//   return shape;
// };
// const createLightningShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(-sval * 0.2), saneNumber(sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.3), saneNumber(sval * 0.2));
//   shape.lineTo(saneNumber(sval * 0.1), saneNumber(sval * 0.2));
//   shape.lineTo(saneNumber(sval * 0.4), saneNumber(-sval * 0.8));
//   shape.lineTo(saneNumber(-sval * 0.1), saneNumber(-sval * 0.2));
//   shape.lineTo(saneNumber(sval * 0.1), saneNumber(-sval * 0.2));
//   shape.lineTo(saneNumber(-sval * 0.4), saneNumber(sval * 0.8));
//   shape.closePath();
//   return shape;
// };
// const createMusicNoteShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const nr = sval * 0.15;
//   for (let i = 0; i <= 16; i++) {
//     const a = (i / 16) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * nr - sval * 0.2);
//     const y = saneNumber(Math.sin(a) * nr - sval * 0.4);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.lineTo(saneNumber(-sval * 0.05), saneNumber(sval * 0.6));
//   shape.lineTo(saneNumber(sval * 0.05), saneNumber(sval * 0.6));
//   shape.lineTo(saneNumber(sval * 0.05), saneNumber(-sval * 0.25));
//   shape.closePath();
//   shape.moveTo(saneNumber(sval * 0.05), saneNumber(sval * 0.6));
//   shape.bezierCurveTo(
//     saneNumber(sval * 0.4),
//     saneNumber(sval * 0.5),
//     saneNumber(sval * 0.3),
//     saneNumber(sval * 0.2),
//     saneNumber(sval * 0.05),
//     saneNumber(sval * 0.3)
//   );
//   shape.closePath();
//   return shape;
// };

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

// const createAdvancedMaterial = (baseColor, materialType = "standard") => {
//   const color = new THREE.Color(baseColor);
//   const materialPresets = {
//     metallic: { metalness: 0.9, roughness: 0.1, envMapIntensity: 1.5 },
//     glass: {
//       metalness: 0.0,
//       roughness: 0.0,
//       transmission: 0.95,
//       thickness: 0.7,
//       transparent: true,
//       opacity: 0.85,
//       envMapIntensity: 2.0,
//       ior: 1.52,
//     },
//     crystal: {
//       metalness: 0.0,
//       roughness: 0.01,
//       transmission: 0.98,
//       thickness: 0.6,
//       transparent: true,
//       opacity: 0.9,
//       envMapIntensity: 2.5,
//       ior: 1.7,
//     },
//     ceramic: { metalness: 0.1, roughness: 0.6, envMapIntensity: 0.8 },
//     organic: { metalness: 0.0, roughness: 0.8, envMapIntensity: 0.5 },
//     plastic: { metalness: 0.0, roughness: 0.3, envMapIntensity: 0.7 },
//     neon: {
//       metalness: 0.0,
//       roughness: 0.1,
//       emissive: color.clone().multiplyScalar(0.8),
//       emissiveIntensity: 1.0,
//       envMapIntensity: 0.2,
//     },
//   };
//   const preset = materialPresets[materialType] || materialPresets.ceramic;
//   const sharedProps = { color, ...preset, side: THREE.DoubleSide };
//   if (materialType === "glass" || materialType === "crystal")
//     return new THREE.MeshPhysicalMaterial(sharedProps);
//   return new THREE.MeshStandardMaterial(sharedProps);
// };

// const create3DShape = (shapeId, currentSettings, size = 1) => {
//   let shape;
//   let materialType =
//     currentSettings.materialType === "auto"
//       ? "ceramic"
//       : currentSettings.materialType;
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
//   const config = shapeConfigs[shapeId] || shapeConfigs.cat;
//   const shapeSize = saneNumber(size, 1.5);
//   shape = config.creator(shapeSize);
//   if (currentSettings.materialType === "auto")
//     materialType = config.autoMaterial;
//   const extrudeSettings = {
//     depth: saneNumber(currentSettings.extrudeDepth, 0.4),
//     bevelEnabled: true,
//     bevelSegments:
//       currentSettings.quality === "high"
//         ? 10
//         : currentSettings.quality === "medium"
//         ? 6
//         : 3,
//     steps:
//       currentSettings.quality === "high"
//         ? 5
//         : currentSettings.quality === "medium"
//         ? 3
//         : 1,
//     bevelSize: saneNumber(0.035 * (shapeSize / 1.5), 0.02),
//     bevelThickness: saneNumber(0.025 * (shapeSize / 1.5), 0.015),
//     curveSegments:
//       currentSettings.quality === "high"
//         ? 48
//         : currentSettings.quality === "medium"
//         ? 24
//         : 12,
//   };
//   const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
//   geometry.computeVertexNormals();
//   try {
//     geometry.center();
//   } catch (e) {
//     console.error(
//       "Error centering geometry, likely due to NaN in shape path:",
//       e,
//       shapeId,
//       currentSettings,
//       shape
//     );
//     return new THREE.Mesh(
//       new THREE.BoxGeometry(1, 1, 1),
//       new THREE.MeshStandardMaterial({ color: 0xff0000 })
//     );
//   }
//   const material = createAdvancedMaterial(
//     currentSettings.shapeColor,
//     materialType
//   );
//   return new THREE.Mesh(geometry, material);
// };

// // ... (UI Components: CategorySelector, ShapeSelector, AnimationControls, FileControls, ThreeDViewer, SettingsPanel - no changes)
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
//     <div className='grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50'>
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
// const FileControls = ({
//   onExportGLB,
//   onExportOBJ,
//   onTakeScreenshot,
//   isExporting,
//   exportProgress,
//   onImportGLB,
// }) => (
//   <div className='bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/70 shadow-lg'>
//     <h3 className='text-lg font-semibold text-white mb-3'>File & Export</h3>
//     <div className='space-y-2'>
//       <button
//         onClick={onImportGLB}
//         disabled={isExporting}
//         className='w-full flex items-center justify-center gap-2 p-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-400'
//       >
//         <UploadCloud size={14} /> Import Model
//       </button>
//       <button
//         onClick={onExportGLB}
//         disabled={isExporting}
//         className='w-full flex items-center justify-center gap-2 p-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600/70 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-400'
//       >
//         <Download size={14} />
//         {isExporting && exportProgress > 0 && exportProgress <= 100
//           ? `GLB... ${Math.round(exportProgress)}%`
//           : "Export GLB"}
//       </button>
//       <button
//         onClick={onExportOBJ}
//         disabled={isExporting}
//         className='w-full flex items-center justify-center gap-2 p-2.5 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600/70 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-teal-400'
//       >
//         <Download size={14} />
//         {isExporting && exportProgress > 0 && exportProgress <= 100
//           ? `OBJ... ${Math.round(exportProgress)}%`
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
// const ThreeDViewer = ({
//   mountRef,
//   isExporting,
//   exportProgress,
//   onDropFile,
// }) => (
//   <div className='lg:col-span-3 xl:col-span-3 order-first lg:order-last'>
//     <div className='bg-slate-800/30 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-slate-700/50 shadow-2xl aspect-[4/3] sm:aspect-video lg:aspect-[16/9]'>
//       <div
//         className='relative w-full h-full'
//         onDragOver={(e) => {
//           e.preventDefault();
//           e.stopPropagation();
//         }}
//         onDrop={onDropFile}
//       >
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
//         className='bg-slate-800 rounded-xl p-6 border-slate-700 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50'
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
//             <XCircle size={24} />
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
//               <option value='crystal'>Crystal</option>
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

// let gltfLoaderInstance;
// const getGltfLoader = () => {
//   // ... (no changes)
//   if (!gltfLoaderInstance) {
//     gltfLoaderInstance = new GLTFLoader();
//     const dracoLoader = new DRACOLoader();
//     dracoLoader.setDecoderPath("/draco/gltf/");
//     gltfLoaderInstance.setDRACOLoader(dracoLoader);
//   }
//   return gltfLoaderInstance;
// };

// const ModelViewer3D = () => {
//   // ... (state variables, refs - no changes to their declaration)
//   const [isMounted, setIsMounted] = useState(false);
//   const mountRef = useRef(null);
//   const sceneRef = useRef(null);
//   const rendererRef = useRef(null);
//   const cameraRef = useRef(null);
//   const controlsRef = useRef(null);
//   const composerRef = useRef(null);
//   const ssaoPassRef = useRef(null);
//   const meshRef = useRef(null);
//   const animationIdRef = useRef(null);
//   const lightsRef = useRef([]);
//   const skyboxMeshRef = useRef(null);
//   const envMapTextureRef = useRef(null);
//   const fileInputRef = useRef(null); // Renamed for clarity, will handle multiple files

//   const [importedModel, setImportedModel] = useState(null);
//   const [isImportedModelDisplayed, setIsImportedModelDisplayed] =
//     useState(false);
//   const [importedModelName, setImportedModelName] = useState("Imported Model");

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
//     lightIntensity: 1.0,
//     extrudeDepth: 0.4,
//     quality: "medium",
//     background: "studioDark",
//   });

//   const currentSettingsRef = useRef(settings);
//   useEffect(() => {
//     currentSettingsRef.current = settings;
//   }, [settings]);

//   const animationState = useRef({
//     rotation: new THREE.Euler(),
//     targetRotation: new THREE.Euler(),
//     floatY: 0,
//     startTime: Date.now(),
//   });

//   const isAnimatingRef = useRef(isAnimating);
//   const animationPresetRef = useRef(animationPreset);

//   useEffect(() => {
//     isAnimatingRef.current = isAnimating;
//   }, [isAnimating]);
//   useEffect(() => {
//     animationPresetRef.current = animationPreset;
//   }, [animationPreset]);
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   // ... (useEffect for Three.js setup - no fundamental changes)
//   useEffect(() => {
//     if (!isMounted || !mountRef.current) return;
//     const currentMount = mountRef.current;
//     const scene = new THREE.Scene();
//     sceneRef.current = scene;
//     const camera = new THREE.PerspectiveCamera(
//       50,
//       currentMount.clientWidth / currentMount.clientHeight,
//       0.1,
//       1000
//     );
//     cameraRef.current = camera;
//     camera.position.set(0, 0.5, 6);
//     const renderer = new THREE.WebGLRenderer({
//       antialias: true,
//       alpha: true,
//       preserveDrawingBuffer: true,
//     });
//     rendererRef.current = renderer;
//     renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.shadowMap.enabled = true;
//     renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//     renderer.outputColorSpace = THREE.SRGBColorSpace;
//     renderer.toneMapping = THREE.ACESFilmicToneMapping;
//     renderer.toneMappingExposure = 1.0;
//     currentMount.appendChild(renderer.domElement);
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;
//     controls.dampingFactor = 0.05;
//     controls.screenSpacePanning = false;
//     controls.minDistance = 1.5;
//     controls.maxDistance = 25;
//     controls.maxPolarAngle = Math.PI / 1.5;
//     controls.target.set(0, 0.2, 0);
//     controlsRef.current = controls;
//     const rgbeLoader = new RGBELoader();
//     rgbeLoader.load("/brown_photostudio_02_4k.hdr", (texture) => {
//       texture.mapping = THREE.EquirectangularReflectionMapping;
//       if (sceneRef.current) {
//         sceneRef.current.environment = texture;
//         envMapTextureRef.current = texture;
//       }
//     });
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
//     scene.add(ambientLight);
//     const keyLight = new THREE.DirectionalLight(0xffffff, 0.6);
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

//     const composer = new EffectComposer(renderer);
//     composerRef.current = composer;
//     const renderPass = new RenderPass(scene, camera);
//     composer.addPass(renderPass);

//     const ssaoPassInstance = new SSAOPass(
//       scene,
//       camera,
//       currentMount.clientWidth,
//       currentMount.clientHeight
//     );
//     ssaoPassInstance.kernelRadius = 0.8;
//     ssaoPassInstance.minDistance = 0.002;
//     ssaoPassInstance.maxDistance = 0.05;
//     composer.addPass(ssaoPassInstance);
//     ssaoPassRef.current = ssaoPassInstance;

//     const outputPass = new OutputPass();
//     composer.addPass(outputPass);

//     const handleResize = () => {
//       if (!currentMount || !camera || !renderer) return;
//       const width = currentMount.clientWidth;
//       const height = currentMount.clientHeight;
//       camera.aspect = width / height;
//       camera.updateProjectionMatrix();
//       renderer.setSize(width, height);
//       if (composerRef.current) {
//         composerRef.current.setSize(width, height);
//         const sPass = composerRef.current.passes.find(
//           (p) => p instanceof SSAOPass
//         );
//         if (sPass) sPass.setSize(width, height);
//       }
//     };
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     const clock = new THREE.Clock();
//     const animate = () => {
//       if (!sceneRef.current || !rendererRef.current || !cameraRef.current) {
//         if (animationIdRef.current)
//           cancelAnimationFrame(animationIdRef.current);
//         return;
//       }
//       animationIdRef.current = requestAnimationFrame(animate);
//       const delta = clock.getDelta();
//       if (controlsRef.current) controlsRef.current.update();
//       if (meshRef.current && isAnimatingRef.current) {
//         const curSettings = settings;
//         const curPresetKey = animationPresetRef.current;
//         const preset = animationPresets[curPresetKey];
//         if (preset) {
//           const effDelta = delta * curSettings.animationSpeed;
//           animationState.current.targetRotation.x +=
//             preset.rotationSpeed[0] * 60 * effDelta;
//           animationState.current.targetRotation.y +=
//             preset.rotationSpeed[1] * 60 * effDelta;
//           animationState.current.targetRotation.z +=
//             preset.rotationSpeed[2] * 60 * effDelta;
//           meshRef.current.rotation.x = THREE.MathUtils.lerp(
//             meshRef.current.rotation.x,
//             animationState.current.targetRotation.x,
//             0.1
//           );
//           meshRef.current.rotation.y = THREE.MathUtils.lerp(
//             meshRef.current.rotation.y,
//             animationState.current.targetRotation.y,
//             0.1
//           );
//           meshRef.current.rotation.z = THREE.MathUtils.lerp(
//             meshRef.current.rotation.z,
//             animationState.current.targetRotation.z,
//             0.1
//           );
//           const floatTime =
//             (Date.now() - animationState.current.startTime) *
//             0.001 *
//             curSettings.animationSpeed;
//           animationState.current.floatY =
//             Math.sin(floatTime * (preset.floatSpeed || 0.0001) * 100) *
//             (preset.floatAmplitude || 0);
//           meshRef.current.position.y = animationState.current.floatY;
//         }
//       }
//       if (composerRef.current) composerRef.current.render(delta);
//     };
//     animate();
//     return () => {
//       window.removeEventListener("resize", handleResize);
//       if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
//       if (controlsRef.current) {
//         controlsRef.current.dispose();
//         controlsRef.current = null;
//       }
//       if (envMapTextureRef.current) {
//         envMapTextureRef.current.dispose();
//         envMapTextureRef.current = null;
//       }
//       if (skyboxMeshRef.current) {
//         sceneRef.current?.remove(skyboxMeshRef.current);
//         skyboxMeshRef.current.geometry?.dispose();
//         skyboxMeshRef.current.material?.dispose();
//         skyboxMeshRef.current = null;
//       }
//       if (meshRef.current) {
//         sceneRef.current?.remove(meshRef.current);
//         meshRef.current.geometry?.dispose();
//         if (meshRef.current.material) {
//           if (Array.isArray(meshRef.current.material))
//             meshRef.current.material.forEach((m) => m.dispose());
//           else meshRef.current.material.dispose();
//         }
//         meshRef.current = null;
//       }
//       if (composerRef.current) {
//         composerRef.current.passes.forEach((p) => {
//           if (p.dispose) p.dispose();
//         });
//         composerRef.current = null;
//       }
//       if (
//         ssaoPassRef.current &&
//         typeof ssaoPassRef.current.dispose === "function"
//       )
//         ssaoPassRef.current.dispose();
//       ssaoPassRef.current = null;
//       if (sceneRef.current) {
//         sceneRef.current.traverse((obj) => {
//           if (obj.geometry) obj.geometry.dispose();
//           if (obj.material) {
//             if (Array.isArray(obj.material))
//               obj.material.forEach((m) => m.dispose());
//             else if (obj.material.dispose) obj.material.dispose();
//           }
//         });
//         sceneRef.current = null;
//       }
//       if (rendererRef.current) {
//         if (currentMount && rendererRef.current.domElement) {
//           try {
//             currentMount.removeChild(rendererRef.current.domElement);
//           } catch (e) {
//             console.warn("Error removing renderer DOM:", e);
//           }
//         }
//         rendererRef.current.dispose();
//         rendererRef.current = null;
//       }
//       cameraRef.current = null;
//       lightsRef.current = [];
//     };
//   }, [isMounted]);

//   // ... (useEffect for background, light intensity - no changes)
//   useEffect(() => {
//     if (!isMounted || !sceneRef.current || !rendererRef.current) return;
//     if (skyboxMeshRef.current) {
//       sceneRef.current.remove(skyboxMeshRef.current);
//       skyboxMeshRef.current.geometry?.dispose();
//       skyboxMeshRef.current.material?.dispose();
//       skyboxMeshRef.current = null;
//     }
//     sceneRef.current.background = null;
//     sceneRef.current.fog = null;
//     rendererRef.current.toneMappingExposure = 1.0;
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
//       const gradGeom = new THREE.SphereGeometry(50, 32, 32);
//       const gradMat = new THREE.ShaderMaterial({
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
//       skyboxMeshRef.current = new THREE.Mesh(gradGeom, gradMat);
//       sceneRef.current.add(skyboxMeshRef.current);
//     }
//     if (fogC) sceneRef.current.fog = new THREE.Fog(fogC, fogNear, fogFar);
//   }, [settings.background, isMounted]);

//   useEffect(() => {
//     if (!isMounted) return;
//     const baseIntensities = [0.2, 0.6, 0.25];
//     lightsRef.current.forEach((light, index) => {
//       if (
//         light &&
//         light.intensity !== undefined &&
//         baseIntensities[index] !== undefined
//       )
//         light.intensity = baseIntensities[index] * settings.lightIntensity;
//     });
//   }, [settings.lightIntensity, isMounted]);

//   const {
//     // ... (useEffect for mesh creation - no fundamental changes)
//     extrudeDepth,
//     quality,
//     shapeColor,
//     materialType: procMaterialType,
//   } = settings;

//   useEffect(() => {
//     if (!isMounted || !sceneRef.current) return;
//     if (meshRef.current) {
//       sceneRef.current.remove(meshRef.current);
//       meshRef.current.geometry?.dispose();
//       if (meshRef.current.material) {
//         if (Array.isArray(meshRef.current.material))
//           meshRef.current.material.forEach((m) => m.dispose());
//         else meshRef.current.material.dispose();
//       }
//       meshRef.current = null;
//     }
//     let newMesh;
//     if (isImportedModelDisplayed && importedModel && importedModel.scene) {
//       newMesh = importedModel.scene.clone(true);
//       const box = new THREE.Box3().setFromObject(newMesh);
//       const center = box.getCenter(new THREE.Vector3());
//       const sizeVec = box.getSize(new THREE.Vector3());
//       const maxDim = Math.max(
//         saneNumber(sizeVec.x, 1),
//         saneNumber(sizeVec.y, 1),
//         saneNumber(sizeVec.z, 1)
//       );
//       const desiredDisplaySize = 3;
//       const scaleFactor = maxDim > 0 ? desiredDisplaySize / maxDim : 1;
//       newMesh.scale.set(
//         saneNumber(scaleFactor, 1),
//         saneNumber(scaleFactor, 1),
//         saneNumber(scaleFactor, 1)
//       );

//       const scaledBox = new THREE.Box3().setFromObject(newMesh);
//       const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
//       if (
//         !isNaN(scaledCenter.x) &&
//         !isNaN(scaledCenter.y) &&
//         !isNaN(scaledCenter.z)
//       ) {
//         newMesh.position.sub(scaledCenter);
//       } else {
//         console.warn(
//           "Imported model center calculation resulted in NaN, defaulting position to origin."
//         );
//         newMesh.position.set(0, 0, 0);
//       }
//       newMesh.traverse((child) => {
//         if (child.isMesh) {
//           child.castShadow = true;
//           child.receiveShadow = true;
//         }
//       });
//     } else {
//       const proceduralSettings = {
//         extrudeDepth,
//         quality,
//         shapeColor,
//         materialType: procMaterialType,
//         animationSpeed: settings.animationSpeed,
//         lightIntensity: settings.lightIntensity,
//         background: settings.background,
//       };
//       newMesh = create3DShape(currentShape, proceduralSettings, 1.5);
//       newMesh.castShadow = true;
//       newMesh.receiveShadow = true;
//     }
//     newMesh.position.y = 0;
//     animationState.current.floatY = 0;
//     animationState.current.targetRotation.set(0, 0, 0);
//     newMesh.rotation.set(0, 0, 0);
//     sceneRef.current.add(newMesh);
//     meshRef.current = newMesh;
//   }, [
//     currentShape,
//     extrudeDepth,
//     quality,
//     shapeColor,
//     procMaterialType,
//     isMounted,
//     importedModel,
//     isImportedModelDisplayed,
//     settings.animationSpeed,
//     settings.lightIntensity,
//     settings.background,
//   ]);

//   // ... (Callbacks: handleResetAnimation, handleToggleAnimation, handleCategorySelect, handleShapeSelect, handleRandomize - no changes)
//   const handleResetAnimation = useCallback(() => {
//     animationState.current.targetRotation.set(0, 0, 0);
//     animationState.current.floatY = 0;
//     animationState.current.startTime = Date.now();
//     if (meshRef.current) {
//       meshRef.current.rotation.set(0, 0, 0);
//       meshRef.current.position.y = 0;
//     }
//     if (controlsRef.current) {
//       controlsRef.current.reset();
//       controlsRef.current.target.set(0, 0.2, 0);
//     }
//   }, []);

//   const handleToggleAnimation = useCallback(() => {
//     setIsAnimating((prev) => {
//       const newIsAnimating = !prev;
//       if (newIsAnimating) {
//         const preset = animationPresets[animationPresetRef.current];
//         const floatAmplitude = preset?.floatAmplitude || 0.1;
//         const floatSpeed = preset?.floatSpeed || 0.001;
//         const timeDivisor = floatAmplitude * (floatSpeed * 100);
//         const timeOffset =
//           timeDivisor !== 0
//             ? (animationState.current.floatY / timeDivisor) * 1000
//             : 0;
//         animationState.current.startTime =
//           Date.now() - (isFinite(timeOffset) ? timeOffset : 0);
//       } else {
//         if (meshRef.current)
//           animationState.current.targetRotation.copy(meshRef.current.rotation);
//       }
//       return newIsAnimating;
//     });
//   }, []);

//   const handleCategorySelect = useCallback(
//     (categoryId) => {
//       setIsImportedModelDisplayed(false);
//       setCurrentCategory(categoryId);
//       setCurrentShape(shapesByCategory[categoryId][0].id);
//       handleResetAnimation();
//     },
//     [shapesByCategory, handleResetAnimation]
//   );

//   const handleShapeSelect = useCallback(
//     (shapeId) => {
//       setIsImportedModelDisplayed(false);
//       setCurrentShape(shapeId);
//       handleResetAnimation();
//     },
//     [handleResetAnimation]
//   );

//   useEffect(() => {
//     if (isMounted) handleResetAnimation();
//   }, [animationPreset, isMounted, handleResetAnimation]);

//   const handleRandomize = useCallback(() => {
//     setIsImportedModelDisplayed(false);
//     const randCat = categories[Math.floor(Math.random() * categories.length)];
//     const randShapeList = shapesByCategory[randCat.id];
//     const randShape =
//       randShapeList[Math.floor(Math.random() * randShapeList.length)];
//     const randPresetKey =
//       Object.keys(animationPresets)[
//         Math.floor(Math.random() * Object.keys(animationPresets).length)
//       ];
//     const randColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
//     const bgKeys = Object.keys(backgroundOptions);
//     const randBgKey = bgKeys[Math.floor(Math.random() * bgKeys.length)];
//     const matKeys = [
//       "metallic",
//       "glass",
//       "crystal",
//       "ceramic",
//       "organic",
//       "plastic",
//       "neon",
//     ];
//     const randMat = matKeys[Math.floor(Math.random() * matKeys.length)];

//     setCurrentCategory(randCat.id);
//     setCurrentShape(randShape.id);
//     setAnimationPreset(randPresetKey);

//     setSettings((prev) => ({
//       ...prev,
//       materialType: randMat,
//       shapeColor: randColor,
//       background: randBgKey,
//       extrudeDepth: saneNumber(Math.random() * (1.0 - 0.1) + 0.1, 0.4),
//       lightIntensity: saneNumber(Math.random() * (2.0 - 0.5) + 0.5, 1.0),
//     }));
//   }, [categories, shapesByCategory, backgroundOptions]);

//   // ... (Refs: currentShapeRef, currentImportedModelNameRef - no changes)
//   const currentShapeRef = useRef(currentShape);
//   useEffect(() => {
//     currentShapeRef.current = currentShape;
//   }, [currentShape]);
//   const currentImportedModelNameRef = useRef(importedModelName);
//   useEffect(() => {
//     currentImportedModelNameRef.current = importedModelName;
//   }, [importedModelName]);

//   // ... (Export/Screenshot Callbacks: handleExportGLB, handleSimulatedExportOBJ, handleTakeScreenshot - no changes)
//   const handleExportGLB = useCallback(() => {
//     if (!meshRef.current || isExporting) return;
//     setIsExporting(true);
//     setExportProgress(0);
//     const exporter = new GLTFExporter();
//     let progress = 0;
//     const progInterval = setInterval(() => {
//       progress += Math.floor(Math.random() * 5 + 5);
//       const curProg = Math.min(progress, 95);
//       setExportProgress(curProg);
//       if (curProg >= 95) clearInterval(progInterval);
//     }, 80);
//     setTimeout(() => {
//       try {
//         if (!(meshRef.current instanceof THREE.Object3D))
//           throw new Error("Mesh not valid Object3D.");
//         const exportOptions = { binary: true };
//         if (
//           isImportedModelDisplayed &&
//           importedModel &&
//           importedModel.animations &&
//           importedModel.animations.length > 0
//         ) {
//           exportOptions.animations = importedModel.animations;
//         }

//         exporter.parse(
//           meshRef.current,
//           (gltf) => {
//             clearInterval(progInterval);
//             setExportProgress(98);
//             if (!(gltf instanceof ArrayBuffer)) {
//               setIsExporting(false);
//               setExportProgress(0);
//               console.error("Exported GLTF is not ArrayBuffer");
//               return;
//             }
//             const blob = new Blob([gltf], { type: "application/octet-stream" });
//             const link = document.createElement("a");
//             link.href = URL.createObjectURL(blob);
//             const fileNameToExport = isImportedModelDisplayed
//               ? currentImportedModelNameRef.current || "imported-model"
//               : currentShapeRef.current || "model";
//             link.download = `shape-${fileNameToExport}.glb`;
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             URL.revokeObjectURL(link.href);
//             setExportProgress(100);
//             setTimeout(() => setIsExporting(false), 500);
//           },
//           (error) => {
//             clearInterval(progInterval);
//             console.error("GLTFExporter.parse error:", error);
//             setIsExporting(false);
//             setExportProgress(0);
//           },
//           exportOptions
//         );
//       } catch (e) {
//         clearInterval(progInterval);
//         console.error("Error GLTF export:", e);
//         setIsExporting(false);
//         setExportProgress(0);
//       }
//     }, 100);
//   }, [isExporting, meshRef, isImportedModelDisplayed, importedModel]);

//   const handleSimulatedExportOBJ = useCallback(() => {
//     if (isExporting) return;
//     setIsExporting(true);
//     setExportProgress(0);
//     let p = 0;
//     const i = setInterval(() => {
//       p += Math.floor(Math.random() * 15 + 10);
//       setExportProgress(Math.min(p, 100));
//       if (p >= 100) {
//         clearInterval(i);
//         const l = document.createElement("a");
//         l.download = `shape-${
//           isImportedModelDisplayed
//             ? currentImportedModelNameRef.current
//             : currentShapeRef.current || "model"
//         }.obj`;
//         l.href =
//           "data:text/plain;charset=utf-8," +
//           encodeURIComponent(
//             "# OBJ file simulated\n# Replace with actual OBJ exporter output"
//           );
//         document.body.appendChild(l);
//         l.click();
//         document.body.removeChild(l);
//         setTimeout(() => setIsExporting(false), 500);
//       }
//     }, 150);
//   }, [isExporting, isImportedModelDisplayed]);

//   const handleTakeScreenshot = useCallback(() => {
//     if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
//     rendererRef.current.render(sceneRef.current, cameraRef.current);
//     if (composerRef.current) composerRef.current.render();

//     const canvas = rendererRef.current.domElement;
//     const link = document.createElement("a");
//     link.download = `screenshot-${
//       isImportedModelDisplayed
//         ? currentImportedModelNameRef.current
//         : currentShapeRef.current || "view"
//     }.png`;
//     link.href = canvas.toDataURL("image/png");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   }, [isImportedModelDisplayed]);

//   const processAndSetImportedModel = useCallback(
//     (scene, animations, fileName) => {
//       const nameOnly =
//         fileName.split(".").slice(0, -1).join(".") || "Imported Model";
//       setImportedModelName(nameOnly);
//       setImportedModel({ scene, animations: animations || [] });
//       setIsImportedModelDisplayed(true);
//       handleResetAnimation();
//       alert(
//         `${fileName} imported successfully! It will replace the current shape.`
//       );
//     },
//     [handleResetAnimation]
//   );

//   const processImportedGltf = useCallback(
//     (gltf, fileName) => {
//       processAndSetImportedModel(gltf.scene, gltf.animations, fileName);
//     },
//     [processAndSetImportedModel]
//   );

//   // --- Phase 2: Heavily Modified File Selection/Drop Handler ---
//   const handleFiles = useCallback(
//     async (files) => {
//       if (!files || files.length === 0) return;

//       let objFile = null;
//       let mtlFile = null;
//       let otherModelFile = null; // For GLB, GLTF, STL

//       // Identify file types
//       for (const file of files) {
//         const lowerName = file.name.toLowerCase();
//         if (lowerName.endsWith(".obj")) {
//           objFile = file;
//         } else if (lowerName.endsWith(".mtl")) {
//           mtlFile = file;
//         } else if (
//           lowerName.endsWith(".glb") ||
//           lowerName.endsWith(".gltf") ||
//           lowerName.endsWith(".stl")
//         ) {
//           if (!otherModelFile) otherModelFile = file; // Take the first one
//         }
//       }

//       if (objFile) {
//         // --- OBJ + Optional MTL Loading ---
//         try {
//           const objLoader = new OBJLoader();
//           const mtlLoader = new MTLLoader();
//           let materialsCreator = null;

//           // Attempt to load MTL if present
//           if (
//             mtlFile &&
//             objFile.name.slice(0, -4) === mtlFile.name.slice(0, -4)
//           ) {
//             // Basic check: names match without extension
//             const mtlText = await mtlFile.text();
//             // Set a resource path (might be empty or a placeholder if not easily determinable for local files)
//             // This path is used by MTLLoader to find textures relative to the MTL file.
//             // For local files, textures usually need to be in the same selection or handled differently.
//             mtlLoader.setResourcePath(""); // Or a base URL if loading from server
//             materialsCreator = mtlLoader.parse(mtlText, "");
//             materialsCreator.preload(); // Important for textures
//           }

//           const objText = await objFile.text();
//           if (materialsCreator) {
//             objLoader.setMaterials(materialsCreator);
//           }

//           const object = objLoader.parse(objText);
//           // Ensure double side for all materials loaded via OBJ/MTL for better visibility
//           object.traverse((child) => {
//             if (child.isMesh) {
//               if (child.material) {
//                 if (Array.isArray(child.material)) {
//                   child.material.forEach(
//                     (mat) => (mat.side = THREE.DoubleSide)
//                   );
//                 } else {
//                   child.material.side = THREE.DoubleSide;
//                 }
//               } else if (!materialsCreator) {
//                 // Only apply default if no MTL and no material from OBJ
//                 child.material = createAdvancedMaterial(
//                   currentSettingsRef.current.shapeColor,
//                   "ceramic"
//                 );
//                 child.material.side = THREE.DoubleSide;
//               }
//               child.castShadow = true;
//               child.receiveShadow = true;
//             }
//           });

//           processAndSetImportedModel(object, [], objFile.name);
//         } catch (error) {
//           console.error("OBJ/MTL Load/Parse Error:", error, objFile.name);
//           alert(
//             `Error processing ${objFile.name}: ${
//               error.message || String(error)
//             }`
//           );
//         }
//       } else if (otherModelFile) {
//         // --- GLB, GLTF, STL Loading (single file) ---
//         const lowerName = otherModelFile.name.toLowerCase();
//         try {
//           const buffer = await otherModelFile.arrayBuffer();
//           let modelScene = null;

//           if (lowerName.endsWith(".glb") || lowerName.endsWith(".gltf")) {
//             const loader = getGltfLoader();
//             // GLTFLoader's parse is async in a different way (returns promise via its callbacks)
//             loader.parse(
//               buffer,
//               "",
//               (gltf) => {
//                 processImportedGltf(gltf, otherModelFile.name);
//               },
//               (error) => {
//                 console.error("GLB/GLTF Parse Error:", error);
//                 alert(
//                   `Error parsing ${otherModelFile.name}: ${
//                     error.message || String(error)
//                   }`
//                 );
//               }
//             );
//             return; // GLTF is async, return early
//           } else if (lowerName.endsWith(".stl")) {
//             const loader = new STLLoader();
//             const geometry = loader.parse(buffer);
//             if (!geometry.isBufferGeometry)
//               throw new Error("Failed to parse STL.");
//             const material = createAdvancedMaterial(
//               currentSettingsRef.current.shapeColor,
//               "plastic"
//             );
//             modelScene = new THREE.Mesh(geometry, material);
//           }

//           if (modelScene) {
//             processAndSetImportedModel(modelScene, [], otherModelFile.name);
//           }
//         } catch (error) {
//           console.error("Model Load/Parse Error:", error, otherModelFile.name);
//           alert(
//             `Error processing ${otherModelFile.name}: ${
//               error.message || String(error)
//             }`
//           );
//         }
//       } else {
//         alert("Unsupported file type(s) or no primary model file found.");
//       }

//       if (fileInputRef.current) fileInputRef.current.value = null; // Reset file input
//     },
//     [processImportedGltf, processAndSetImportedModel]
//   );
//   // --- End Phase 2 ---

//   const triggerImport = useCallback(() => {
//     // Renamed from triggerGlbImport
//     if (fileInputRef.current) fileInputRef.current.click();
//   }, []);

//   const handleFileDropOnViewer = useCallback(
//     (event) => {
//       event.preventDefault();
//       event.stopPropagation();
//       if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
//         handleFiles(Array.from(event.dataTransfer.files)); // Pass FileList as array
//       }
//     },
//     [handleFiles]
//   );

//   if (!isMounted) {
//     return (
//       <div className='min-h-screen flex items-center justify-center bg-slate-900 text-white'>
//         <p>Loading 3D Studio...</p>
//       </div>
//     );
//   }

//   return (
//     <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-3 sm:p-4 md:p-6 text-white select-none'>
//       <input
//         type='file'
//         // --- Phase 2: Update accepted file types & allow multiple ---
//         accept='.glb,.gltf,.stl,.obj,.mtl' // Add .mtl
//         multiple // Allow selecting multiple files (OBJ + MTL)
//         // --- End Phase 2 ---
//         ref={fileInputRef} // Use renamed ref
//         onChange={(e) => handleFiles(Array.from(e.target.files))} // Pass FileList as array
//         style={{ display: "none" }}
//       />
//       <div className='max-w-screen-xl mx-auto'>
//         <header className='text-center mb-6 sm:mb-8'>
//           <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent'>
//             3D Shape Studio Pro
//           </h1>
//           <p className='text-slate-300 text-sm sm:text-base max-w-2xl mx-auto'>
//             Explore, customize, and animate 3D shapes. Import GLB/GLTF, STL, or
//             OBJ (with MTL) models!
//           </p>
//         </header>
//         <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6'>
//           <div className='lg:col-span-1 space-y-4 sm:space-y-5 order-last lg:order-first'>
//             {!isImportedModelDisplayed && (
//               <>
//                 <CategorySelector
//                   categories={categories}
//                   currentCategory={currentCategory}
//                   onCategorySelect={handleCategorySelect}
//                 />
//                 <ShapeSelector
//                   shapes={shapesByCategory[currentCategory]}
//                   currentShape={currentShape}
//                   onShapeSelect={handleShapeSelect}
//                 />
//               </>
//             )}
//             {isImportedModelDisplayed && importedModel && (
//               <div className='bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/70 shadow-lg text-center'>
//                 <h3 className='text-lg font-semibold text-white mb-2'>
//                   Current Model
//                 </h3>
//                 <p
//                   className='text-sm text-slate-300 truncate'
//                   title={importedModelName}
//                 >
//                   {importedModelName}
//                 </p>
//                 <button
//                   onClick={() => {
//                     setImportedModel(null);
//                     setIsImportedModelDisplayed(false);
//                     setImportedModelName("Imported Model");
//                     const defaultCategoryId = categories[0].id;
//                     const defaultShapes = shapesByCategory[defaultCategoryId];
//                     setCurrentCategory(defaultCategoryId);
//                     setCurrentShape(defaultShapes[0].id);
//                     handleResetAnimation();
//                   }}
//                   className='mt-3 text-xs bg-red-500 hover:bg-red-600 text-white py-1.5 px-4 rounded-md flex items-center justify-center gap-1.5 w-full'
//                 >
//                   <XCircle size={14} /> Clear Imported
//                 </button>
//               </div>
//             )}
//             <AnimationControls
//               isAnimating={isAnimating}
//               onToggleAnimation={handleToggleAnimation}
//               onResetAnimation={handleResetAnimation}
//               animationPreset={animationPreset}
//               onPresetChange={setAnimationPreset}
//               onRandomize={handleRandomize}
//             />
//             <FileControls
//               onExportGLB={handleExportGLB}
//               onExportOBJ={handleSimulatedExportOBJ}
//               onTakeScreenshot={handleTakeScreenshot}
//               isExporting={isExporting}
//               exportProgress={exportProgress}
//               onImportGLB={triggerImport} // Use renamed trigger
//             />
//             <button
//               onClick={() => setShowSettings(true)}
//               className='w-full flex items-center justify-center gap-2 p-3 bg-slate-700 hover:bg-slate-600/90 text-white rounded-lg transition-all text-sm font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500'
//             >
//               <SettingsIcon size={16} /> Viewer Settings
//             </button>
//           </div>
//           <ThreeDViewer
//             mountRef={mountRef}
//             isExporting={isExporting}
//             exportProgress={exportProgress}
//             onDropFile={handleFileDropOnViewer}
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
//             © {new Date().getFullYear()} 3D Shape Studio Pro. Interactive 3D
//             Viewer.
//           </p>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default ModelViewer3D;

//try new with shadcn

// import React, { useRef, useEffect, useState, useCallback } from "react";
// import * as THREE from "three";
// import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
// import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
// import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
// import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";
// import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
// import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
// import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";

// import {
//   Download,
//   Play,
//   Pause,
//   RotateCcw,
//   Camera,
//   Settings as SettingsIcon,
//   Shuffle,
//   UploadCloud,
//   XCircle,
//   Loader2,
// } from "lucide-react";

// // Shadcn/ui component imports
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Slider } from "@/components/ui/slider";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogClose,
// } from "@/components/ui/dialog";
// import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";
// import { Progress } from "@/components/ui/progress";

// // cn utility
// import { clsx } from "clsx";
// import { twMerge } from "tailwind-merge";

// export function cn(...inputs) {
//   return twMerge(clsx(inputs));
// }

// const saneNumber = (value, defaultValue = 0) => {
//   const num = Number(value);
//   return isNaN(num) || !isFinite(num) ? defaultValue : num;
// };

// // --- Shape Creation Functions ---
// const createCatShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(0), saneNumber(s * 0.8));
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.6),
//     saneNumber(s * 0.8),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(0)
//   );
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.8),
//     saneNumber(-s * 0.6),
//     saneNumber(-s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(0),
//     saneNumber(-s * 0.8)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.8),
//     saneNumber(-s * 0.6),
//     saneNumber(s * 0.8),
//     saneNumber(0)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(s * 0.6),
//     saneNumber(s * 0.8),
//     saneNumber(0),
//     saneNumber(s * 0.8)
//   );
//   const ear1 = new THREE.Path();
//   ear1.moveTo(saneNumber(-s * 0.4), saneNumber(s * 0.6));
//   ear1.lineTo(saneNumber(-s * 0.7), saneNumber(s * 1.2));
//   ear1.lineTo(saneNumber(-s * 0.1), saneNumber(s * 0.9));
//   ear1.closePath();
//   const ear2 = new THREE.Path();
//   ear2.moveTo(saneNumber(s * 0.4), saneNumber(s * 0.6));
//   ear2.lineTo(saneNumber(s * 0.7), saneNumber(s * 1.2));
//   ear2.lineTo(saneNumber(s * 0.1), saneNumber(s * 0.9));
//   ear2.closePath();
//   shape.holes.push(ear1);
//   shape.holes.push(ear2);
//   return shape;
// };
// const createBirdShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(0), saneNumber(s * 0.6));
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.9),
//     saneNumber(-s * 0.2),
//     saneNumber(-s * 0.6),
//     saneNumber(-s * 0.6)
//   );
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.3),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.3),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.6),
//     saneNumber(-s * 0.6)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.9),
//     saneNumber(-s * 0.2),
//     saneNumber(s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(0),
//     saneNumber(s * 0.6)
//   );
//   const wing = new THREE.Path();
//   wing.moveTo(saneNumber(-s * 0.3), saneNumber(s * 0.2));
//   wing.bezierCurveTo(
//     saneNumber(-s * 0.7),
//     saneNumber(s * 0.3),
//     saneNumber(-s * 0.8),
//     saneNumber(0),
//     saneNumber(-s * 0.5),
//     saneNumber(-s * 0.3)
//   );
//   wing.bezierCurveTo(
//     saneNumber(-s * 0.2),
//     saneNumber(-s * 0.1),
//     saneNumber(-s * 0.1),
//     saneNumber(s * 0.1),
//     saneNumber(-s * 0.3),
//     saneNumber(s * 0.2)
//   );
//   shape.holes.push(wing);
//   return shape;
// };
// const createFishShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(-s * 0.8), saneNumber(0));
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.6),
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.2),
//     saneNumber(s * 0.5),
//     saneNumber(s * 0.2),
//     saneNumber(s * 0.3)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.6),
//     saneNumber(s * 0.2),
//     saneNumber(s * 0.8),
//     saneNumber(0),
//     saneNumber(s * 0.8),
//     saneNumber(0)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.6),
//     saneNumber(-s * 0.2),
//     saneNumber(s * 0.2),
//     saneNumber(-s * 0.3),
//     saneNumber(-s * 0.2),
//     saneNumber(-s * 0.5)
//   );
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.6),
//     saneNumber(-s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(0),
//     saneNumber(-s * 0.8),
//     saneNumber(0)
//   );
//   shape.moveTo(saneNumber(s * 0.8), saneNumber(0));
//   shape.lineTo(saneNumber(s * 1.2), saneNumber(s * 0.3));
//   shape.lineTo(saneNumber(s * 1.0), saneNumber(0));
//   shape.lineTo(saneNumber(s * 1.2), saneNumber(-s * 0.3));
//   shape.lineTo(saneNumber(s * 0.8), saneNumber(0));
//   return shape;
// };
// const createSoccerBallShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const r = s * 0.8;
//   for (let i = 0; i < 6; i++) {
//     const a = (i / 6) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * r);
//     const y = saneNumber(Math.sin(a) * r);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.closePath();
//   const ih = new THREE.Path();
//   const ir = s * 0.4;
//   for (let i = 0; i < 6; i++) {
//     const a = (i / 6) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * ir);
//     const y = saneNumber(Math.sin(a) * ir);
//     if (i === 0) ih.moveTo(x, y);
//     else ih.lineTo(x, y);
//   }
//   ih.closePath();
//   shape.holes.push(ih);
//   return shape;
// };
// const createTennisRacketShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const a = s * 0.6;
//   const b = s * 0.4;
//   for (let i = 0; i <= 32; i++) {
//     const ang = (i / 32) * Math.PI * 2;
//     const x = saneNumber(Math.cos(ang) * a);
//     const y = saneNumber(Math.sin(ang) * b + s * 0.3);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.lineTo(saneNumber(s * 0.1), saneNumber(-s * 0.8));
//   shape.lineTo(saneNumber(-s * 0.1), saneNumber(-s * 0.8));
//   shape.closePath();
//   return shape;
// };
// const createBasketballShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const r = s * 0.8;
//   for (let i = 0; i <= 32; i++) {
//     const a = (i / 32) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * r);
//     const y = saneNumber(Math.sin(a) * r);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.closePath();
//   return shape;
// };
// const createPersonShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const hr = s * 0.2;
//   for (let i = 0; i <= 16; i++) {
//     const a = (i / 16) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * hr);
//     const y = saneNumber(Math.sin(a) * hr + s * 0.6);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.lineTo(saneNumber(-s * 0.3), saneNumber(s * 0.2));
//   shape.lineTo(saneNumber(-s * 0.4), saneNumber(-s * 0.4));
//   shape.lineTo(saneNumber(-s * 0.2), saneNumber(-s * 0.8));
//   shape.lineTo(saneNumber(s * 0.2), saneNumber(-s * 0.8));
//   shape.lineTo(saneNumber(s * 0.4), saneNumber(-s * 0.4));
//   shape.lineTo(saneNumber(s * 0.3), saneNumber(s * 0.2));
//   shape.closePath();
//   return shape;
// };
// const createRobotShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(-sval * 0.4), saneNumber(sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.4), saneNumber(sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.4), saneNumber(sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.4), saneNumber(sval * 0.4));
//   shape.closePath();
//   shape.moveTo(saneNumber(-sval * 0.5), saneNumber(sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.5), saneNumber(sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.5), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.5), saneNumber(-sval * 0.4));
//   shape.closePath();
//   shape.moveTo(saneNumber(-sval * 0.3), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.1), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.1), saneNumber(-sval * 0.8));
//   shape.lineTo(saneNumber(-sval * 0.3), saneNumber(-sval * 0.8));
//   shape.closePath();
//   shape.moveTo(saneNumber(sval * 0.1), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.3), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.3), saneNumber(-sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.1), saneNumber(-sval * 0.8));
//   shape.closePath();
//   return shape;
// };
// const createPhoneShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const w = sval * 0.5;
//   const h = sval * 1.0;
//   const r = sval * 0.1;
//   shape.moveTo(saneNumber(-w + r), saneNumber(h));
//   shape.lineTo(saneNumber(w - r), saneNumber(h));
//   shape.quadraticCurveTo(
//     saneNumber(w),
//     saneNumber(h),
//     saneNumber(w),
//     saneNumber(h - r)
//   );
//   shape.lineTo(saneNumber(w), saneNumber(-h + r));
//   shape.quadraticCurveTo(
//     saneNumber(w),
//     saneNumber(-h),
//     saneNumber(w - r),
//     saneNumber(-h)
//   );
//   shape.lineTo(saneNumber(-w + r), saneNumber(-h));
//   shape.quadraticCurveTo(
//     saneNumber(-w),
//     saneNumber(-h),
//     saneNumber(-w),
//     saneNumber(-h + r)
//   );
//   shape.lineTo(saneNumber(-w), saneNumber(h - r));
//   shape.quadraticCurveTo(
//     saneNumber(-w),
//     saneNumber(h),
//     saneNumber(-w + r),
//     saneNumber(h)
//   );
//   shape.closePath();
//   const screen = new THREE.Path();
//   const sw = w * 0.8;
//   const sh = h * 0.8;
//   const sr = r * 0.5;
//   screen.moveTo(saneNumber(-sw + sr), saneNumber(sh));
//   screen.lineTo(saneNumber(sw - sr), saneNumber(sh));
//   screen.quadraticCurveTo(
//     saneNumber(sw),
//     saneNumber(sh),
//     saneNumber(sw),
//     saneNumber(sh - sr)
//   );
//   screen.lineTo(saneNumber(sw), saneNumber(-sh + sr));
//   screen.quadraticCurveTo(
//     saneNumber(sw),
//     saneNumber(-sh),
//     saneNumber(sw - sr),
//     saneNumber(-sh)
//   );
//   screen.lineTo(saneNumber(-sw + sr), saneNumber(-sh));
//   screen.quadraticCurveTo(
//     saneNumber(-sw),
//     saneNumber(-sh),
//     saneNumber(-sw),
//     saneNumber(-sh + sr)
//   );
//   screen.lineTo(saneNumber(-sw), saneNumber(sh - sr));
//   screen.quadraticCurveTo(
//     saneNumber(-sw),
//     saneNumber(sh),
//     saneNumber(-sw + sr),
//     saneNumber(sh)
//   );
//   screen.closePath();
//   shape.holes.push(screen);
//   return shape;
// };
// const createLightningShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(-sval * 0.2), saneNumber(sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.3), saneNumber(sval * 0.2));
//   shape.lineTo(saneNumber(sval * 0.1), saneNumber(sval * 0.2));
//   shape.lineTo(saneNumber(sval * 0.4), saneNumber(-sval * 0.8));
//   shape.lineTo(saneNumber(-sval * 0.1), saneNumber(-sval * 0.2));
//   shape.lineTo(saneNumber(sval * 0.1), saneNumber(-sval * 0.2));
//   shape.lineTo(saneNumber(-sval * 0.4), saneNumber(sval * 0.8));
//   shape.closePath();
//   return shape;
// };
// const createMusicNoteShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const nr = sval * 0.15;
//   for (let i = 0; i <= 16; i++) {
//     const a = (i / 16) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * nr - sval * 0.2);
//     const y = saneNumber(Math.sin(a) * nr - sval * 0.4);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.lineTo(saneNumber(-sval * 0.05), saneNumber(sval * 0.6));
//   shape.lineTo(saneNumber(sval * 0.05), saneNumber(sval * 0.6));
//   shape.lineTo(saneNumber(sval * 0.05), saneNumber(-sval * 0.25));
//   shape.closePath();
//   shape.moveTo(saneNumber(sval * 0.05), saneNumber(sval * 0.6));
//   shape.bezierCurveTo(
//     saneNumber(sval * 0.4),
//     saneNumber(sval * 0.5),
//     saneNumber(sval * 0.3),
//     saneNumber(sval * 0.2),
//     saneNumber(sval * 0.05),
//     saneNumber(sval * 0.3)
//   );
//   shape.closePath();
//   return shape;
// };

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
// const createAdvancedMaterial = (baseColor, materialType = "standard") => {
//   const color = new THREE.Color(baseColor);
//   const materialPresets = {
//     metallic: { metalness: 0.9, roughness: 0.1, envMapIntensity: 1.5 },
//     glass: {
//       metalness: 0.0,
//       roughness: 0.0,
//       transmission: 0.95,
//       thickness: 0.7,
//       transparent: true,
//       opacity: 0.85,
//       envMapIntensity: 2.0,
//       ior: 1.52,
//     },
//     crystal: {
//       metalness: 0.0,
//       roughness: 0.01,
//       transmission: 0.98,
//       thickness: 0.6,
//       transparent: true,
//       opacity: 0.9,
//       envMapIntensity: 2.5,
//       ior: 1.7,
//     },
//     ceramic: { metalness: 0.1, roughness: 0.6, envMapIntensity: 0.8 },
//     organic: { metalness: 0.0, roughness: 0.8, envMapIntensity: 0.5 },
//     plastic: { metalness: 0.0, roughness: 0.3, envMapIntensity: 0.7 },
//     neon: {
//       metalness: 0.0,
//       roughness: 0.1,
//       emissive: color.clone().multiplyScalar(0.8),
//       emissiveIntensity: 1.0,
//       envMapIntensity: 0.2,
//     },
//   };
//   const preset = materialPresets[materialType] || materialPresets.ceramic;
//   const sharedProps = { color, ...preset, side: THREE.DoubleSide };
//   if (materialType === "glass" || materialType === "crystal")
//     return new THREE.MeshPhysicalMaterial(sharedProps);
//   return new THREE.MeshStandardMaterial(sharedProps);
// };
// const create3DShape = (shapeId, currentSettings, size = 1) => {
//   let shape;
//   let materialType =
//     currentSettings.materialType === "auto"
//       ? "ceramic"
//       : currentSettings.materialType;
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
//   const config = shapeConfigs[shapeId] || shapeConfigs.cat;
//   const shapeSize = saneNumber(size, 1.5);
//   shape = config.creator(shapeSize);
//   if (currentSettings.materialType === "auto")
//     materialType = config.autoMaterial;
//   const extrudeSettings = {
//     depth: saneNumber(currentSettings.extrudeDepth, 0.4),
//     bevelEnabled: true,
//     bevelSegments:
//       currentSettings.quality === "high"
//         ? 10
//         : currentSettings.quality === "medium"
//         ? 6
//         : 3,
//     steps:
//       currentSettings.quality === "high"
//         ? 5
//         : currentSettings.quality === "medium"
//         ? 3
//         : 1,
//     bevelSize: saneNumber(0.035 * (shapeSize / 1.5), 0.02),
//     bevelThickness: saneNumber(0.025 * (shapeSize / 1.5), 0.015),
//     curveSegments:
//       currentSettings.quality === "high"
//         ? 48
//         : currentSettings.quality === "medium"
//         ? 24
//         : 12,
//   };
//   const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
//   geometry.computeVertexNormals();
//   try {
//     geometry.center();
//   } catch (e) {
//     console.error(
//       "Error centering geometry:",
//       e,
//       shapeId,
//       currentSettings,
//       shape
//     );
//     return new THREE.Mesh(
//       new THREE.BoxGeometry(1, 1, 1),
//       new THREE.MeshStandardMaterial({ color: 0xff0000 })
//     );
//   }
//   const material = createAdvancedMaterial(
//     currentSettings.shapeColor,
//     materialType
//   );
//   return new THREE.Mesh(geometry, material);
// };

// // --- Module-level data definitions ---
// const CATEGORIES_DATA = [
//   { id: "animals", name: "Animals", icon: "🐱" },
//   { id: "sports", name: "Sports", icon: "⚽" },
//   { id: "people", name: "People", icon: "👤" },
//   { id: "objects", name: "Objects", icon: "📱" },
// ];
// const SHAPES_BY_CATEGORY_DATA = {
//   animals: [
//     { id: "cat", name: "Cat", icon: "🐱" },
//     { id: "bird", name: "Bird", icon: "🐦" },
//     { id: "fish", name: "Fish", icon: "🐟" },
//   ],
//   sports: [
//     { id: "soccer", name: "Soccer", icon: "⚽" },
//     { id: "tennis", name: "Tennis", icon: "🎾" },
//     { id: "basketball", name: "Basketball", icon: "🏀" },
//   ],
//   people: [
//     { id: "person", name: "Person", icon: "👤" },
//     { id: "robot", name: "Robot", icon: "🤖" },
//   ],
//   objects: [
//     { id: "phone", name: "Phone", icon: "📱" },
//     { id: "lightning", name: "Lightning", icon: "⚡" },
//     { id: "music", name: "Music Note", icon: "🎵" },
//   ],
// };
// const BACKGROUND_OPTIONS_DATA = {
//   modernGradient: "Modern Gradient",
//   darkSpace: "Dark Space",
//   softLight: "Soft Light",
//   studioDark: "Studio Dark",
//   studioLight: "Studio Light",
// };

// let gltfLoaderInstance;
// const getGltfLoader = () => {
//   if (!gltfLoaderInstance) {
//     gltfLoaderInstance = new GLTFLoader();
//     const dracoLoader = new DRACOLoader();
//     dracoLoader.setDecoderPath("/draco/gltf/"); // Ensure this path is correct in your public folder
//     gltfLoaderInstance.setDRACOLoader(dracoLoader);
//   }
//   return gltfLoaderInstance;
// };

// const ModelViewer3D = () => {
//   const [isMounted, setIsMounted] = useState(false);
//   const mountRef = useRef(null);
//   const sceneRef = useRef(null);
//   const rendererRef = useRef(null);
//   const cameraRef = useRef(null);
//   const controlsRef = useRef(null);
//   const composerRef = useRef(null);
//   const ssaoPassRef = useRef(null);
//   const meshRef = useRef(null);
//   const animationIdRef = useRef(null);
//   const lightsRef = useRef([]);
//   const skyboxMeshRef = useRef(null);
//   const envMapTextureRef = useRef(null);
//   const fileInputRef = useRef(null);

//   const [importedModel, setImportedModel] = useState(null);
//   const [isImportedModelDisplayed, setIsImportedModelDisplayed] =
//     useState(false);
//   const [importedModelName, setImportedModelName] = useState("Imported Model");

//   // Use module-level constants for initialization
//   const [currentCategory, setCurrentCategory] = useState(CATEGORIES_DATA[0].id);
//   const [currentShape, setCurrentShape] = useState(
//     SHAPES_BY_CATEGORY_DATA[CATEGORIES_DATA[0].id][0].id
//   );

//   // Local constants for convenience
//   const categories = CATEGORIES_DATA;
//   const shapesByCategory = SHAPES_BY_CATEGORY_DATA;
//   const backgroundOptions = BACKGROUND_OPTIONS_DATA;

//   const [isAnimating, setIsAnimating] = useState(true);
//   const [animationPreset, setAnimationPreset] = useState("gentle");
//   const [showSettingsDialog, setShowSettingsDialog] = useState(false);
//   const [isExporting, setIsExporting] = useState(false);
//   const [exportProgress, setExportProgress] = useState(0);
//   const [settings, setSettings] = useState({
//     materialType: "auto",
//     shapeColor: "#a78bfa",
//     animationSpeed: 1.0,
//     lightIntensity: 1.0,
//     extrudeDepth: 0.4,
//     quality: "medium",
//     background: "studioDark",
//   });

//   const currentSettingsRef = useRef(settings);
//   useEffect(() => {
//     currentSettingsRef.current = settings;
//   }, [settings]);

//   const animationState = useRef({
//     rotation: new THREE.Euler(),
//     targetRotation: new THREE.Euler(),
//     floatY: 0,
//     startTime: Date.now(),
//   });
//   const isAnimatingRef = useRef(isAnimating);
//   const animationPresetRef = useRef(animationPreset);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);
//   useEffect(() => {
//     isAnimatingRef.current = isAnimating;
//   }, [isAnimating]);
//   useEffect(() => {
//     animationPresetRef.current = animationPreset;
//   }, [animationPreset]);

//   useEffect(() => {
//     if (!isMounted || !mountRef.current) return;
//     const currentMount = mountRef.current;
//     const scene = new THREE.Scene();
//     sceneRef.current = scene;
//     const camera = new THREE.PerspectiveCamera(
//       50,
//       currentMount.clientWidth / currentMount.clientHeight,
//       0.1,
//       1000
//     );
//     cameraRef.current = camera;
//     camera.position.set(0, 0.5, 6);
//     const renderer = new THREE.WebGLRenderer({
//       antialias: true,
//       alpha: true,
//       preserveDrawingBuffer: true,
//     });
//     rendererRef.current = renderer;
//     renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.shadowMap.enabled = true;
//     renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//     renderer.outputColorSpace = THREE.SRGBColorSpace;
//     renderer.toneMapping = THREE.ACESFilmicToneMapping;
//     renderer.toneMappingExposure = 1.0;
//     currentMount.appendChild(renderer.domElement);

//     const controls = new OrbitControls(camera, renderer.domElement);
//     controlsRef.current = controls;
//     controls.enableDamping = true;
//     controls.dampingFactor = 0.05;
//     controls.screenSpacePanning = false;
//     controls.minDistance = 1;
//     controls.maxDistance = 30;
//     controls.maxPolarAngle = Math.PI / 1.6;
//     controls.target.set(0, 0.2, 0);

//     const rgbeLoader = new RGBELoader();
//     rgbeLoader.load(
//       "/brown_photostudio_02_4k.hdr",
//       (texture) => {
//         texture.mapping = THREE.EquirectangularReflectionMapping;
//         if (sceneRef.current) {
//           sceneRef.current.environment = texture;
//           envMapTextureRef.current = texture;
//         }
//       },
//       undefined,
//       (error) => {
//         console.error("Error loading HDR:", error);
//         sonnerToast.error("HDR Load Failed", {
//           description: "Studio lighting map failed.",
//         });
//       }
//     );

//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
//     scene.add(ambientLight);
//     const keyLight = new THREE.DirectionalLight(0xffffff, 0.7);
//     keyLight.position.set(5, 8, 5);
//     keyLight.castShadow = true;
//     keyLight.shadow.mapSize.width = 2048;
//     keyLight.shadow.mapSize.height = 2048;
//     keyLight.shadow.camera.near = 0.5;
//     keyLight.shadow.camera.far = 50;
//     keyLight.shadow.bias = -0.0005;
//     scene.add(keyLight);
//     const fillLight = new THREE.DirectionalLight(0xa0c0ff, 0.4);
//     fillLight.position.set(-5, 3, -3);
//     scene.add(fillLight);
//     lightsRef.current = [ambientLight, keyLight, fillLight];

//     const composer = new EffectComposer(renderer);
//     composerRef.current = composer;
//     const renderPass = new RenderPass(scene, camera);
//     composer.addPass(renderPass);
//     const ssaoPassInstance = new SSAOPass(
//       scene,
//       camera,
//       currentMount.clientWidth,
//       currentMount.clientHeight
//     );
//     ssaoPassInstance.kernelRadius = 0.6;
//     ssaoPassInstance.minDistance = 0.001;
//     ssaoPassInstance.maxDistance = 0.03;
//     composer.addPass(ssaoPassInstance);
//     ssaoPassRef.current = ssaoPassInstance;
//     const outputPass = new OutputPass();
//     composer.addPass(outputPass);

//     const handleResize = () => {
//       if (!currentMount || !cameraRef.current || !rendererRef.current) return;
//       const width = currentMount.clientWidth;
//       const height = currentMount.clientHeight;
//       cameraRef.current.aspect = width / height;
//       cameraRef.current.updateProjectionMatrix();
//       rendererRef.current.setSize(width, height);
//       if (composerRef.current) {
//         composerRef.current.setSize(width, height);
//         const sPass = composerRef.current.passes.find(
//           (p) => p instanceof SSAOPass
//         );
//         if (sPass) sPass.setSize(width, height);
//       }
//     };
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     const clock = new THREE.Clock();
//     const animate = () => {
//       animationIdRef.current = requestAnimationFrame(animate);
//       if (
//         !sceneRef.current ||
//         !rendererRef.current ||
//         !cameraRef.current ||
//         !isMounted
//       ) {
//         if (animationIdRef.current)
//           cancelAnimationFrame(animationIdRef.current);
//         return;
//       }
//       const delta = clock.getDelta();
//       if (controlsRef.current) controlsRef.current.update();
//       if (meshRef.current && isAnimatingRef.current) {
//         const animSettings = currentSettingsRef.current;
//         const presetKey = animationPresetRef.current;
//         const preset = animationPresets[presetKey];
//         if (preset) {
//           const effDelta = delta * animSettings.animationSpeed;
//           animationState.current.targetRotation.x +=
//             preset.rotationSpeed[0] * 60 * effDelta;
//           animationState.current.targetRotation.y +=
//             preset.rotationSpeed[1] * 60 * effDelta;
//           animationState.current.targetRotation.z +=
//             preset.rotationSpeed[2] * 60 * effDelta;
//           meshRef.current.rotation.x = THREE.MathUtils.lerp(
//             meshRef.current.rotation.x,
//             animationState.current.targetRotation.x,
//             0.1
//           );
//           meshRef.current.rotation.y = THREE.MathUtils.lerp(
//             meshRef.current.rotation.y,
//             animationState.current.targetRotation.y,
//             0.1
//           );
//           meshRef.current.rotation.z = THREE.MathUtils.lerp(
//             meshRef.current.rotation.z,
//             animationState.current.targetRotation.z,
//             0.1
//           );
//           const floatTime =
//             (Date.now() - animationState.current.startTime) *
//             0.001 *
//             animSettings.animationSpeed;
//           animationState.current.floatY =
//             Math.sin(floatTime * (preset.floatSpeed || 0.0001) * 100) *
//             (preset.floatAmplitude || 0);
//           meshRef.current.position.y = animationState.current.floatY;
//         }
//       }
//       if (composerRef.current) composerRef.current.render(delta);
//       else if (rendererRef.current)
//         rendererRef.current.render(sceneRef.current, cameraRef.current);
//     };
//     animate();
//     return () => {
//       window.removeEventListener("resize", handleResize);
//       if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
//       controlsRef.current?.dispose();
//       envMapTextureRef.current?.dispose();
//       if (skyboxMeshRef.current) {
//         sceneRef.current?.remove(skyboxMeshRef.current);
//         skyboxMeshRef.current.geometry?.dispose();
//         skyboxMeshRef.current.material?.dispose();
//       }
//       if (meshRef.current) {
//         sceneRef.current?.remove(meshRef.current);
//         meshRef.current.traverse((obj) => {
//           if (obj.geometry) obj.geometry.dispose();
//           if (obj.material) {
//             if (Array.isArray(obj.material))
//               obj.material.forEach((m) => m.dispose());
//             else obj.material.dispose();
//           }
//         });
//       }
//       composerRef.current?.passes.forEach((pass) => pass.dispose?.());
//       ssaoPassRef.current?.dispose?.();
//       sceneRef.current?.traverse((obj) => {
//         if (obj.isLight && obj.shadow && obj.shadow.map)
//           obj.shadow.map.dispose();
//         if (obj.geometry) obj.geometry.dispose();
//         if (obj.material) {
//           const materials = Array.isArray(obj.material)
//             ? obj.material
//             : [obj.material];
//           materials.forEach((mat) => {
//             Object.values(mat).forEach((val) => {
//               if (val instanceof THREE.Texture) val.dispose();
//             });
//             mat.dispose();
//           });
//         }
//       });
//       if (rendererRef.current) {
//         rendererRef.current.dispose();
//         if (mountRef.current && rendererRef.current.domElement) {
//           try {
//             mountRef.current.removeChild(rendererRef.current.domElement);
//           } catch (e) {}
//         }
//       }
//       sceneRef.current = null;
//       cameraRef.current = null;
//       rendererRef.current = null;
//       controlsRef.current = null;
//       composerRef.current = null;
//       ssaoPassRef.current = null;
//       meshRef.current = null;
//       envMapTextureRef.current = null;
//       skyboxMeshRef.current = null;
//       lightsRef.current = [];
//     };
//   }, [isMounted]);

//   useEffect(() => {
//     if (!isMounted || !sceneRef.current || !rendererRef.current) return;
//     if (skyboxMeshRef.current) {
//       sceneRef.current.remove(skyboxMeshRef.current);
//       skyboxMeshRef.current.geometry?.dispose();
//       skyboxMeshRef.current.material?.dispose();
//       skyboxMeshRef.current = null;
//     }
//     sceneRef.current.background = null;
//     sceneRef.current.fog = null;
//     rendererRef.current.toneMappingExposure = 1.0;
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
//         sceneRef.current.background = new THREE.Color(0x0a0a10);
//         fogC = new THREE.Color(0x050508);
//         fogNear = 10;
//         fogFar = 35;
//         break;
//       case "softLight":
//         sceneRef.current.background = new THREE.Color(0xe0e8f0);
//         fogC = new THREE.Color(0xd0d8e0);
//         fogNear = 7;
//         fogFar = 28;
//         if (rendererRef.current) rendererRef.current.toneMappingExposure = 0.9;
//         break;
//       case "studioDark":
//         sceneRef.current.background = new THREE.Color(0x18181b);
//         fogC = new THREE.Color(0x101012);
//         fogNear = 12;
//         fogFar = 40;
//         break;
//       case "studioLight":
//         sceneRef.current.background = new THREE.Color(0xf4f4f5);
//         fogC = new THREE.Color(0xe4e4e7);
//         fogNear = 10;
//         fogFar = 35;
//         if (rendererRef.current) rendererRef.current.toneMappingExposure = 0.85;
//         break;
//       default:
//         sceneRef.current.background = new THREE.Color(0x18181b);
//         fogC = new THREE.Color(0x101012);
//     }
//     if (settings.background === "modernGradient" && topC && bottomC) {
//       const gradGeom = new THREE.SphereGeometry(50, 32, 32);
//       const gradMat = new THREE.ShaderMaterial({
//         uniforms: {
//           topColor: { value: topC },
//           bottomColor: { value: bottomC },
//           offset: { value: 33 },
//           exponent: { value: 0.6 },
//         },
//         vertexShader: `varying vec3 vWorldPosition; void main() { vec4 worldPosition = modelMatrix * vec4(position, 1.0); vWorldPosition = worldPosition.xyz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
//         fragmentShader: `uniform vec3 topColor; uniform vec3 bottomColor; uniform float offset; uniform float exponent; varying vec3 vWorldPosition; void main() { float h = normalize(vWorldPosition + offset).y; gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0); }`,
//         side: THREE.BackSide,
//       });
//       skyboxMeshRef.current = new THREE.Mesh(gradGeom, gradMat);
//       sceneRef.current.add(skyboxMeshRef.current);
//     }
//     if (fogC) sceneRef.current.fog = new THREE.Fog(fogC, fogNear, fogFar);
//   }, [settings.background, isMounted]);

//   useEffect(() => {
//     if (!isMounted || !lightsRef.current || lightsRef.current.length < 3)
//       return;
//     const baseIntensities = [0.25, 0.7, 0.4];
//     lightsRef.current.forEach((light, index) => {
//       if (
//         light &&
//         light.intensity !== undefined &&
//         baseIntensities[index] !== undefined
//       ) {
//         light.intensity = baseIntensities[index] * settings.lightIntensity;
//       }
//     });
//   }, [settings.lightIntensity, isMounted]);

//   const {
//     extrudeDepth,
//     quality,
//     shapeColor,
//     materialType: procMaterialType,
//   } = settings;
//   useEffect(() => {
//     if (!isMounted || !sceneRef.current) return;
//     if (meshRef.current) {
//       sceneRef.current.remove(meshRef.current);
//       meshRef.current.traverse((obj) => {
//         if (obj.geometry) obj.geometry.dispose();
//         if (obj.material) {
//           if (Array.isArray(obj.material))
//             obj.material.forEach((m) => m.dispose());
//           else obj.material.dispose();
//         }
//       });
//       meshRef.current = null;
//     }
//     let newMesh;
//     if (isImportedModelDisplayed && importedModel && importedModel.scene) {
//       newMesh = importedModel.scene.clone(true);
//       const box = new THREE.Box3().setFromObject(newMesh);
//       const sizeVec = box.getSize(new THREE.Vector3());
//       const maxDim = Math.max(
//         saneNumber(sizeVec.x, 1),
//         saneNumber(sizeVec.y, 1),
//         saneNumber(sizeVec.z, 1)
//       );
//       const desiredDisplaySize = 3;
//       const scaleFactor = maxDim > 0 ? desiredDisplaySize / maxDim : 1;
//       newMesh.scale.set(
//         saneNumber(scaleFactor, 1),
//         saneNumber(scaleFactor, 1),
//         saneNumber(scaleFactor, 1)
//       );
//       const scaledBox = new THREE.Box3().setFromObject(newMesh);
//       const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
//       if (
//         !isNaN(scaledCenter.x) &&
//         !isNaN(scaledCenter.y) &&
//         !isNaN(scaledCenter.z)
//       ) {
//         newMesh.position.sub(scaledCenter);
//       } else {
//         console.warn("Imported model center NaN");
//         sonnerToast.warning("Centering Issue");
//         newMesh.position.set(0, 0, 0);
//       }
//       newMesh.traverse((child) => {
//         if (child.isMesh) {
//           child.castShadow = true;
//           child.receiveShadow = true;
//           if (child.material) {
//             if (Array.isArray(child.material)) {
//               child.material.forEach((m) => (m.side = THREE.DoubleSide));
//             } else {
//               child.material.side = THREE.DoubleSide;
//             }
//           }
//         }
//       });
//     } else {
//       const proceduralSettings = {
//         extrudeDepth,
//         quality,
//         shapeColor,
//         materialType: procMaterialType,
//       };
//       newMesh = create3DShape(currentShape, proceduralSettings, 1.5);
//       newMesh.castShadow = true;
//       newMesh.receiveShadow = true;
//     }
//     newMesh.position.y = 0;
//     animationState.current.floatY = 0;
//     animationState.current.targetRotation.set(0, 0, 0);
//     newMesh.rotation.set(0, 0, 0);
//     sceneRef.current.add(newMesh);
//     meshRef.current = newMesh;
//   }, [
//     currentShape,
//     extrudeDepth,
//     quality,
//     shapeColor,
//     procMaterialType,
//     isMounted,
//     importedModel,
//     isImportedModelDisplayed,
//   ]);

//   const handleResetAnimation = useCallback(() => {
//     animationState.current.targetRotation.set(0, 0, 0);
//     animationState.current.floatY = 0;
//     animationState.current.startTime = Date.now();
//     if (meshRef.current) {
//       meshRef.current.rotation.set(0, 0, 0);
//       meshRef.current.position.y = 0;
//     }
//     if (controlsRef.current) {
//       controlsRef.current.reset();
//       controlsRef.current.target.set(0, 0.2, 0);
//     }
//     sonnerToast.info("Animation Reset", {
//       description: "Model position and rotation restored.",
//     });
//   }, []);

//   const handleToggleAnimation = useCallback(() => {
//     setIsAnimating((prev) => {
//       const newIsAnimating = !prev;
//       if (newIsAnimating) {
//         const preset = animationPresets[animationPresetRef.current];
//         const floatAmplitude = preset?.floatAmplitude || 0.1;
//         const floatSpeed = preset?.floatSpeed || 0.001;
//         const timeDivisor = floatAmplitude * (floatSpeed * 100);
//         const timeOffset =
//           timeDivisor !== 0
//             ? (animationState.current.floatY / timeDivisor) * 1000
//             : 0;
//         animationState.current.startTime =
//           Date.now() - (isFinite(timeOffset) ? timeOffset : 0);
//       } else {
//         if (meshRef.current)
//           animationState.current.targetRotation.copy(meshRef.current.rotation);
//       }
//       sonnerToast.info(`Animation ${newIsAnimating ? "Resumed" : "Paused"}`);
//       return newIsAnimating;
//     });
//   }, []);

//   const handleCategorySelect = useCallback(
//     (categoryId) => {
//       setIsImportedModelDisplayed(false);
//       setCurrentCategory(categoryId);
//       setCurrentShape(shapesByCategory[categoryId][0].id);
//       handleResetAnimation();
//     },
//     [shapesByCategory, handleResetAnimation]
//   ); // shapesByCategory is stable due to module-level const

//   const handleShapeSelect = useCallback(
//     (shapeId) => {
//       setIsImportedModelDisplayed(false);
//       setCurrentShape(shapeId);
//       handleResetAnimation();
//     },
//     [handleResetAnimation]
//   );

//   useEffect(() => {
//     if (isMounted) handleResetAnimation();
//   }, [animationPreset, isMounted, handleResetAnimation]);

//   const handleRandomize = useCallback(() => {
//     setIsImportedModelDisplayed(false);
//     const randCat = categories[Math.floor(Math.random() * categories.length)];
//     const randShapeList = shapesByCategory[randCat.id];
//     const randShape =
//       randShapeList[Math.floor(Math.random() * randShapeList.length)];
//     const randPresetKey =
//       Object.keys(animationPresets)[
//         Math.floor(Math.random() * Object.keys(animationPresets).length)
//       ];
//     const randColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`;
//     const bgKeys = Object.keys(backgroundOptions);
//     const randBgKey = bgKeys[Math.floor(Math.random() * bgKeys.length)];
//     const matKeys = [
//       "auto",
//       "metallic",
//       "glass",
//       "crystal",
//       "ceramic",
//       "organic",
//       "plastic",
//       "neon",
//     ];
//     const randMat = matKeys[Math.floor(Math.random() * matKeys.length)];
//     setCurrentCategory(randCat.id);
//     setCurrentShape(randShape.id);
//     setAnimationPreset(randPresetKey);
//     setSettings((prev) => ({
//       ...prev,
//       materialType: randMat,
//       shapeColor: randColor,
//       background: randBgKey,
//       extrudeDepth: saneNumber(Math.random() * (1.0 - 0.1) + 0.1, 0.4),
//       lightIntensity: saneNumber(Math.random() * (1.8 - 0.6) + 0.6, 1.0),
//       animationSpeed: saneNumber(Math.random() * (2.0 - 0.5) + 0.5, 1.0),
//     }));
//     sonnerToast.success("Scene Randomized!", {
//       description: "Enjoy the new look.",
//     });
//   }, [categories, shapesByCategory, backgroundOptions, handleResetAnimation]); // Stable deps

//   const currentShapeRef = useRef(currentShape);
//   useEffect(() => {
//     currentShapeRef.current = currentShape;
//   }, [currentShape]);
//   const currentImportedModelNameRef = useRef(importedModelName);
//   useEffect(() => {
//     currentImportedModelNameRef.current = importedModelName;
//   }, [importedModelName]);

//   const handleExportGLB = useCallback(() => {
//     if (!meshRef.current || isExporting) return;
//     setIsExporting(true);
//     setExportProgress(0);
//     const exportToastId = sonnerToast.loading("Exporting GLB...", {
//       description: "Preparing model...",
//     });
//     const exporter = new GLTFExporter();
//     let progress = 0;
//     const progInterval = setInterval(() => {
//       progress += Math.floor(Math.random() * 10 + 5);
//       const curProg = Math.min(progress, 95);
//       setExportProgress(curProg);
//       sonnerToast.loading("Exporting GLB...", {
//         id: exportToastId,
//         description: `Processing... ${curProg}%`,
//       });
//       if (curProg >= 95) clearInterval(progInterval);
//     }, 150);
//     setTimeout(() => {
//       try {
//         if (!(meshRef.current instanceof THREE.Object3D))
//           throw new Error("Model not valid for export.");
//         const exportOptions = { binary: true };
//         if (isImportedModelDisplayed && importedModel?.animations?.length > 0)
//           exportOptions.animations = importedModel.animations;
//         exporter.parse(
//           meshRef.current,
//           (gltf) => {
//             clearInterval(progInterval);
//             setExportProgress(100);
//             sonnerToast.success("GLB Export Ready", {
//               id: exportToastId,
//               description: "Download starting.",
//             });
//             if (!(gltf instanceof ArrayBuffer))
//               throw new Error("Exported GLTF not ArrayBuffer.");
//             const blob = new Blob([gltf], { type: "application/octet-stream" });
//             const link = document.createElement("a");
//             link.href = URL.createObjectURL(blob);
//             const fileNameToExport = isImportedModelDisplayed
//               ? currentImportedModelNameRef.current || "imported-model"
//               : currentShapeRef.current || "model";
//             link.download = `shape-${fileNameToExport}.glb`;
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             URL.revokeObjectURL(link.href);
//             setTimeout(() => {
//               setIsExporting(false);
//               setExportProgress(0);
//             }, 500);
//           },
//           (error) => {
//             clearInterval(progInterval);
//             console.error("GLTFExporter.parse error:", error);
//             sonnerToast.error("GLB Export Failed", {
//               id: exportToastId,
//               description: error.message || "GLTF parsing error.",
//             });
//             setIsExporting(false);
//             setExportProgress(0);
//           },
//           exportOptions
//         );
//       } catch (e) {
//         clearInterval(progInterval);
//         console.error("GLTF export setup error:", e);
//         sonnerToast.error("GLB Export Failed", {
//           id: exportToastId,
//           description: e.message || "Unexpected error.",
//         });
//         setIsExporting(false);
//         setExportProgress(0);
//       }
//     }, 100);
//   }, [isExporting, meshRef, isImportedModelDisplayed, importedModel]);

//   const handleSimulatedExportOBJ = useCallback(() => {
//     if (isExporting) return;
//     setIsExporting(true);
//     setExportProgress(0);
//     const exportToastId = sonnerToast.loading("Exporting OBJ (Simulated)...", {
//       description: "Processing...",
//     });
//     let p = 0;
//     const i = setInterval(() => {
//       p += Math.floor(Math.random() * 15 + 10);
//       const currentProgress = Math.min(p, 100);
//       setExportProgress(currentProgress);
//       sonnerToast.loading("Exporting OBJ (Simulated)...", {
//         id: exportToastId,
//         description: `Processing... ${currentProgress}%`,
//       });
//       if (currentProgress >= 100) {
//         clearInterval(i);
//         const l = document.createElement("a");
//         l.download = `shape-${
//           isImportedModelDisplayed
//             ? currentImportedModelNameRef.current
//             : currentShapeRef.current || "model"
//         }.obj`;
//         l.href =
//           "data:text/plain;charset=utf-8," +
//           encodeURIComponent(
//             "# OBJ file simulated\n# Actual OBJ Exporter Needed"
//           );
//         document.body.appendChild(l);
//         l.click();
//         document.body.removeChild(l);
//         sonnerToast.success("OBJ Export (Simulated) Ready", {
//           id: exportToastId,
//           description: "Simulated OBJ downloaded.",
//         });
//         setTimeout(() => {
//           setIsExporting(false);
//           setExportProgress(0);
//         }, 500);
//       }
//     }, 150);
//   }, [isExporting, isImportedModelDisplayed]);

//   const handleTakeScreenshot = useCallback(() => {
//     if (!rendererRef.current || !sceneRef.current || !cameraRef.current) {
//       sonnerToast.error("Screenshot Failed", {
//         description: "Renderer not ready.",
//       });
//       return;
//     }
//     const screenshotToastId = sonnerToast.loading("Taking Screenshot...", {
//       description: "Capturing image...",
//     });
//     if (composerRef.current) composerRef.current.render();
//     else rendererRef.current.render(sceneRef.current, cameraRef.current);
//     setTimeout(() => {
//       try {
//         const canvas = rendererRef.current.domElement;
//         const link = document.createElement("a");
//         link.download = `screenshot-${
//           isImportedModelDisplayed
//             ? currentImportedModelNameRef.current
//             : currentShapeRef.current || "view"
//         }.png`;
//         link.href = canvas.toDataURL("image/png");
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         sonnerToast.success("Screenshot Saved!", {
//           id: screenshotToastId,
//           description: `${link.download} saved.`,
//         });
//       } catch (e) {
//         console.error("Screenshot error:", e);
//         sonnerToast.error("Screenshot Failed", {
//           id: screenshotToastId,
//           description: e.message || "Could not save.",
//         });
//       }
//     }, 100);
//   }, [isImportedModelDisplayed]);

//   const processAndSetImportedModel = useCallback(
//     (scene, animations, fileName) => {
//       const nameOnly =
//         fileName.split(".").slice(0, -1).join(".") || "Imported Model";
//       setImportedModelName(nameOnly);
//       setImportedModel({ scene, animations: animations || [] });
//       setIsImportedModelDisplayed(true);
//       handleResetAnimation();
//       sonnerToast.success("Model Imported", {
//         description: `${fileName} loaded.`,
//       });
//     },
//     [handleResetAnimation]
//   );

//   const processImportedGltf = useCallback(
//     (gltf, fileName) => {
//       processAndSetImportedModel(gltf.scene, gltf.animations, fileName);
//     },
//     [processAndSetImportedModel]
//   );

//   const handleFiles = useCallback(
//     async (files) => {
//       if (!files || files.length === 0) return;
//       const importToastId = sonnerToast.loading("Processing File(s)...");
//       let objFile = null,
//         mtlFile = null,
//         otherModelFile = null;
//       for (const file of files) {
//         const lowerName = file.name.toLowerCase();
//         if (lowerName.endsWith(".obj")) objFile = file;
//         else if (lowerName.endsWith(".mtl")) mtlFile = file;
//         else if (
//           lowerName.endsWith(".glb") ||
//           lowerName.endsWith(".gltf") ||
//           lowerName.endsWith(".stl")
//         ) {
//           if (!otherModelFile) otherModelFile = file;
//         }
//       }

//       if (objFile) {
//         sonnerToast.info("Processing OBJ model...", {
//           id: importToastId,
//           description: `Loading ${objFile.name}${
//             mtlFile ? " with " + mtlFile.name : ""
//           }`,
//         });
//         try {
//           const objLoader = new OBJLoader();
//           const mtlLoader = new MTLLoader();
//           let materialsCreator = null;
//           if (
//             mtlFile &&
//             objFile.name.slice(0, -4) === mtlFile.name.slice(0, -4)
//           ) {
//             const mtlText = await mtlFile.text();
//             mtlLoader.setResourcePath("");
//             materialsCreator = mtlLoader.parse(mtlText, "");
//             materialsCreator.preload();
//           }
//           const objText = await objFile.text();
//           if (materialsCreator) objLoader.setMaterials(materialsCreator);
//           const object = objLoader.parse(objText);
//           object.traverse((child) => {
//             if (child.isMesh) {
//               if (child.material) {
//                 if (Array.isArray(child.material))
//                   child.material.forEach(
//                     (mat) => (mat.side = THREE.DoubleSide)
//                   );
//                 else child.material.side = THREE.DoubleSide;
//               } else if (!materialsCreator) {
//                 child.material = createAdvancedMaterial(
//                   currentSettingsRef.current.shapeColor,
//                   "ceramic"
//                 );
//                 child.material.side = THREE.DoubleSide;
//               }
//               child.castShadow = true;
//               child.receiveShadow = true;
//             }
//           });
//           processAndSetImportedModel(object, [], objFile.name);
//           sonnerToast.dismiss(importToastId);
//         } catch (error) {
//           console.error("OBJ/MTL Error:", error);
//           sonnerToast.error("OBJ/MTL Load Failed", {
//             id: importToastId,
//             description: `${objFile.name}: ${error.message || "Unknown"}`,
//           });
//         }
//       } else if (otherModelFile) {
//         sonnerToast.info("Processing model...", {
//           id: importToastId,
//           description: `Loading ${otherModelFile.name}`,
//         });
//         const lowerName = otherModelFile.name.toLowerCase();
//         try {
//           const buffer = await otherModelFile.arrayBuffer();
//           if (lowerName.endsWith(".glb") || lowerName.endsWith(".gltf")) {
//             const loader = getGltfLoader();
//             loader.parse(
//               buffer,
//               "",
//               (gltf) => {
//                 processImportedGltf(gltf, otherModelFile.name);
//                 sonnerToast.dismiss(importToastId);
//               },
//               (error) => {
//                 console.error("GLB/GLTF Parse Error:", error);
//                 sonnerToast.error("GLB/GLTF Parse Failed", {
//                   id: importToastId,
//                   description: `${otherModelFile.name}: ${
//                     error.message || "Unknown"
//                   }`,
//                 });
//               }
//             );
//             return;
//           } else if (lowerName.endsWith(".stl")) {
//             const loader = new STLLoader();
//             const geometry = loader.parse(buffer);
//             if (!geometry.isBufferGeometry)
//               throw new Error("Invalid STL geometry.");
//             const material = createAdvancedMaterial(
//               currentSettingsRef.current.shapeColor,
//               "plastic"
//             );
//             const modelScene = new THREE.Mesh(geometry, material);
//             processAndSetImportedModel(modelScene, [], otherModelFile.name);
//             sonnerToast.dismiss(importToastId);
//           }
//         } catch (error) {
//           console.error("Model Load Error:", error);
//           sonnerToast.error("Model Load Failed", {
//             id: importToastId,
//             description: `${otherModelFile.name}: ${
//               error.message || "Unknown"
//             }`,
//           });
//         }
//       } else {
//         sonnerToast.warning("No Supported File", {
//           id: importToastId,
//           description: "Please select GLB, GLTF, STL, or OBJ.",
//         });
//       }
//       if (fileInputRef.current) fileInputRef.current.value = null;
//     },
//     [processImportedGltf, processAndSetImportedModel]
//   ); // Dependencies are stable

//   const triggerImport = useCallback(() => {
//     if (fileInputRef.current) fileInputRef.current.click();
//   }, []);
//   const handleFileDropOnViewer = useCallback(
//     (event) => {
//       event.preventDefault();
//       event.stopPropagation();
//       if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
//         handleFiles(Array.from(event.dataTransfer.files));
//       }
//     },
//     [handleFiles]
//   );

//   if (!isMounted) {
//     return (
//       <div className='min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-4'>
//         <Loader2 className='h-12 w-12 animate-spin text-purple-400 mb-4' />
//         <p className='text-lg font-medium'>Initializing 3D Studio...</p>
//         <p className='text-sm text-slate-400'>
//           Getting things ready, please wait.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <SonnerToaster richColors position='top-right' />
//       <div className='min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 p-3 sm:p-4 md:p-6 text-slate-100 select-none'>
//         <input
//           type='file'
//           accept='.glb,.gltf,.stl,.obj,.mtl'
//           multiple
//           ref={fileInputRef}
//           onChange={(e) => handleFiles(Array.from(e.target.files))}
//           style={{ display: "none" }}
//         />
//         <div className='max-w-screen-2xl mx-auto'>
//           <header className='text-center mb-8 sm:mb-10'>
//             <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-3 sm:mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent'>
//               3D Shape Studio Pro
//             </h1>
//             <p className='text-slate-400 text-base sm:text-lg max-w-3xl mx-auto'>
//               Craft, view, and animate 3D masterpieces. Import GLB, GLTF, STL,
//               or OBJ (with MTL) models.
//             </p>
//           </header>
//           <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6'>
//             <div className='lg:col-span-3 space-y-4 sm:space-y-5 order-last lg:order-first'>
//               {!isImportedModelDisplayed && (
//                 <>
//                   <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
//                     <CardHeader>
//                       <CardTitle className='text-slate-100'>
//                         Categories
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className='grid grid-cols-2 gap-3'>
//                         {categories.map((category) => (
//                           <Button
//                             key={category.id}
//                             variant={
//                               currentCategory === category.id
//                                 ? "default"
//                                 : "outline"
//                             }
//                             className={cn(
//                               "h-auto py-3 flex flex-col items-center justify-center gap-1.5 text-xs sm:text-sm transition-all",
//                               currentCategory === category.id
//                                 ? "bg-purple-600 hover:bg-purple-700 text-white ring-2 ring-purple-400"
//                                 : "text-slate-300 border-slate-600 hover:bg-slate-700/50"
//                             )}
//                             onClick={() => handleCategorySelect(category.id)}
//                           >
//                             <span className='text-2xl sm:text-3xl'>
//                               {category.icon}
//                             </span>{" "}
//                             <span>{category.name}</span>
//                           </Button>
//                         ))}
//                       </div>
//                     </CardContent>
//                   </Card>
//                   <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
//                     <CardHeader>
//                       <CardTitle className='text-slate-100'>Shapes</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className='grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50'>
//                         {shapesByCategory[currentCategory].map((shape) => (
//                           <Button
//                             key={shape.id}
//                             variant={
//                               currentShape === shape.id ? "secondary" : "ghost"
//                             }
//                             className={cn(
//                               "justify-start gap-2",
//                               currentShape === shape.id
//                                 ? "bg-purple-500 text-white hover:bg-purple-600"
//                                 : "text-slate-300 hover:bg-slate-700/50"
//                             )}
//                             onClick={() => handleShapeSelect(shape.id)}
//                           >
//                             <span className='text-xl'>{shape.icon}</span>{" "}
//                             {shape.name}
//                           </Button>
//                         ))}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </>
//               )}
//               {isImportedModelDisplayed && importedModel && (
//                 <Card className='bg-slate-800/70 border-slate-700 shadow-xl text-center'>
//                   <CardHeader>
//                     <CardTitle className='text-slate-100'>
//                       Current Model
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <p
//                       className='text-sm text-slate-300 truncate font-medium'
//                       title={importedModelName}
//                     >
//                       {importedModelName}
//                     </p>
//                   </CardContent>
//                   <CardFooter>
//                     <Button
//                       variant='destructive'
//                       size='sm'
//                       className='w-full'
//                       onClick={() => {
//                         setImportedModel(null);
//                         setIsImportedModelDisplayed(false);
//                         setImportedModelName("Imported Model");
//                         const defaultCategoryId = categories[0].id;
//                         setCurrentCategory(defaultCategoryId);
//                         setCurrentShape(
//                           shapesByCategory[defaultCategoryId][0].id
//                         );
//                         handleResetAnimation();
//                         sonnerToast.info("Imported Model Cleared", {
//                           description: "Procedural shapes active.",
//                         });
//                       }}
//                     >
//                       {" "}
//                       <XCircle size={16} className='mr-2' /> Clear Imported{" "}
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               )}
//               <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
//                 <CardHeader>
//                   <CardTitle className='text-slate-100'>Animation</CardTitle>
//                 </CardHeader>
//                 <CardContent className='space-y-4'>
//                   <Button
//                     onClick={handleToggleAnimation}
//                     variant={isAnimating ? "destructive" : "default"}
//                     className='w-full bg-green-600 hover:bg-green-700 data-[state=destructive]:bg-red-600 data-[state=destructive]:hover:bg-red-700'
//                     data-state={isAnimating ? "destructive" : "default"}
//                   >
//                     {isAnimating ? (
//                       <Pause size={16} className='mr-2' />
//                     ) : (
//                       <Play size={16} className='mr-2' />
//                     )}{" "}
//                     {isAnimating ? "Pause" : "Play"}
//                   </Button>
//                   <Select
//                     value={animationPreset}
//                     onValueChange={setAnimationPreset}
//                   >
//                     <SelectTrigger className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'>
//                       <SelectValue placeholder='Select animation' />
//                     </SelectTrigger>
//                     <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
//                       {Object.keys(animationPresets).map((presetKey) => (
//                         <SelectItem
//                           key={presetKey}
//                           value={presetKey}
//                           className='capitalize focus:bg-purple-600 focus:text-white'
//                         >
//                           {presetKey.charAt(0).toUpperCase() +
//                             presetKey.slice(1)}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <div className='grid grid-cols-2 gap-3'>
//                     <Button
//                       variant='outline'
//                       onClick={handleResetAnimation}
//                       className='border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
//                     >
//                       <RotateCcw size={14} className='mr-2' /> Reset
//                     </Button>
//                     <Button
//                       variant='default'
//                       onClick={handleRandomize}
//                       className='bg-indigo-600 hover:bg-indigo-700'
//                     >
//                       <Shuffle size={14} className='mr-2' /> Random
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//               <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
//                 <CardHeader>
//                   <CardTitle className='text-slate-100'>
//                     File & Export
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className='space-y-3'>
//                   <Button
//                     onClick={triggerImport}
//                     disabled={isExporting}
//                     className='w-full bg-green-600 hover:bg-green-700'
//                   >
//                     <UploadCloud size={16} className='mr-2' /> Import Model
//                   </Button>
//                   <Button
//                     onClick={handleExportGLB}
//                     disabled={isExporting}
//                     className='w-full bg-blue-600 hover:bg-blue-700'
//                   >
//                     <Download size={16} className='mr-2' />{" "}
//                     {isExporting && exportProgress > 0 && exportProgress <= 100
//                       ? `GLB... ${Math.round(exportProgress)}%`
//                       : "Export GLB"}
//                   </Button>
//                   <Button
//                     onClick={handleSimulatedExportOBJ}
//                     disabled={isExporting}
//                     className='w-full bg-teal-600 hover:bg-teal-700'
//                   >
//                     <Download size={16} className='mr-2' />{" "}
//                     {isExporting && exportProgress > 0 && exportProgress <= 100
//                       ? `OBJ... ${Math.round(exportProgress)}%`
//                       : "Export OBJ (Sim.)"}
//                   </Button>
//                   <Button
//                     onClick={handleTakeScreenshot}
//                     disabled={isExporting}
//                     className='w-full bg-purple-600 hover:bg-purple-700'
//                   >
//                     <Camera size={16} className='mr-2' /> Screenshot
//                   </Button>
//                 </CardContent>
//               </Card>
//               <Button
//                 variant='outline'
//                 className='w-full border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 py-3'
//                 onClick={() => setShowSettingsDialog(true)}
//               >
//                 <SettingsIcon size={16} className='mr-2' /> Viewer Settings
//               </Button>
//             </div>
//             <div className='lg:col-span-9 order-first lg:order-last'>
//               <Card className='bg-slate-800/50 border-slate-700/80 shadow-2xl aspect-[4/3] sm:aspect-video lg:aspect-[16/10] overflow-hidden'>
//                 <CardContent className='p-0 w-full h-full relative'>
//                   <div
//                     className='relative w-full h-full'
//                     onDragOver={(e) => {
//                       e.preventDefault();
//                       e.stopPropagation();
//                     }}
//                     onDrop={handleFileDropOnViewer}
//                   >
//                     <div
//                       ref={mountRef}
//                       className='w-full h-full rounded-lg overflow-hidden'
//                     />
//                     {isExporting && (
//                       <div className='absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-lg z-10 backdrop-blur-sm'>
//                         <Card className='bg-slate-100 text-slate-800 p-6 sm:p-8 shadow-2xl text-center w-72'>
//                           <CardHeader className='p-0 mb-4'>
//                             <CardTitle className='text-xl sm:text-2xl'>
//                               Exporting Model
//                             </CardTitle>
//                           </CardHeader>
//                           <CardContent className='p-0 space-y-3'>
//                             <div className='text-lg font-semibold'>
//                               {Math.round(exportProgress)}%
//                             </div>
//                             <Progress
//                               value={exportProgress}
//                               className='w-full h-2.5'
//                             />
//                             <p className='text-xs text-slate-500'>
//                               Please wait, this may take a moment...
//                             </p>
//                           </CardContent>
//                         </Card>
//                       </div>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//           <Dialog
//             open={showSettingsDialog}
//             onOpenChange={setShowSettingsDialog}
//           >
//             <DialogContent className='bg-slate-800 border-slate-700 text-slate-100 sm:max-w-[525px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50'>
//               <DialogHeader>
//                 <DialogTitle className='text-2xl'>Viewer Settings</DialogTitle>
//                 <DialogDescription className='text-slate-400'>
//                   Customize appearance and behavior.
//                 </DialogDescription>
//               </DialogHeader>
//               <div className='grid gap-6 py-4'>
//                 <div className='grid grid-cols-4 items-center gap-4'>
//                   <Label
//                     htmlFor='materialType'
//                     className='text-right col-span-1 text-slate-300'
//                   >
//                     Material
//                   </Label>
//                   <Select
//                     value={settings.materialType}
//                     onValueChange={(value) =>
//                       setSettings((s) => ({ ...s, materialType: value }))
//                     }
//                   >
//                     <SelectTrigger
//                       id='materialType'
//                       className='col-span-3 bg-slate-700 border-slate-600 focus:ring-purple-500'
//                     >
//                       <SelectValue placeholder='Select material' />
//                     </SelectTrigger>
//                     <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
//                       {[
//                         "auto",
//                         "metallic",
//                         "glass",
//                         "crystal",
//                         "ceramic",
//                         "organic",
//                         "plastic",
//                         "neon",
//                       ].map((type) => (
//                         <SelectItem
//                           key={type}
//                           value={type}
//                           className='capitalize focus:bg-purple-600 focus:text-white'
//                         >
//                           {type}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className='grid grid-cols-4 items-center gap-4'>
//                   <Label
//                     htmlFor='shapeColor'
//                     className='text-right col-span-1 text-slate-300'
//                   >
//                     Color
//                   </Label>
//                   <Input
//                     id='shapeColor'
//                     type='color'
//                     value={settings.shapeColor}
//                     onChange={(e) =>
//                       setSettings((s) => ({ ...s, shapeColor: e.target.value }))
//                     }
//                     className='col-span-3 p-1 h-10 bg-slate-700 border-slate-600 cursor-pointer focus-visible:ring-purple-500'
//                   />
//                 </div>
//                 <div className='grid grid-cols-4 items-center gap-4'>
//                   <Label
//                     htmlFor='animationSpeed'
//                     className='text-right col-span-1 text-slate-300'
//                   >
//                     Anim. Speed
//                   </Label>
//                   <Slider
//                     id='animationSpeed'
//                     min={0.1}
//                     max={3}
//                     step={0.1}
//                     value={[settings.animationSpeed]}
//                     onValueChange={([value]) =>
//                       setSettings((s) => ({ ...s, animationSpeed: value }))
//                     }
//                     className='col-span-3 [&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//                   />
//                   <span className='col-start-2 col-span-3 text-xs text-slate-400 -mt-2'>
//                     {settings.animationSpeed.toFixed(1)}x
//                   </span>
//                 </div>
//                 <div className='grid grid-cols-4 items-center gap-4'>
//                   <Label
//                     htmlFor='lightIntensity'
//                     className='text-right col-span-1 text-slate-300'
//                   >
//                     Light
//                   </Label>
//                   <Slider
//                     id='lightIntensity'
//                     min={0.1}
//                     max={2.5}
//                     step={0.1}
//                     value={[settings.lightIntensity]}
//                     onValueChange={([value]) =>
//                       setSettings((s) => ({ ...s, lightIntensity: value }))
//                     }
//                     className='col-span-3 [&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//                   />
//                   <span className='col-start-2 col-span-3 text-xs text-slate-400 -mt-2'>
//                     {settings.lightIntensity.toFixed(1)}x
//                   </span>
//                 </div>
//                 <div className='grid grid-cols-4 items-center gap-4'>
//                   <Label
//                     htmlFor='extrudeDepth'
//                     className='text-right col-span-1 text-slate-300'
//                   >
//                     Depth (Shapes)
//                   </Label>
//                   <Slider
//                     id='extrudeDepth'
//                     min={0.05}
//                     max={1.5}
//                     step={0.05}
//                     value={[settings.extrudeDepth]}
//                     onValueChange={([value]) =>
//                       setSettings((s) => ({ ...s, extrudeDepth: value }))
//                     }
//                     className='col-span-3 [&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//                   />
//                   <span className='col-start-2 col-span-3 text-xs text-slate-400 -mt-2'>
//                     {settings.extrudeDepth.toFixed(2)}
//                   </span>
//                 </div>
//                 <div className='grid grid-cols-4 items-center gap-4'>
//                   <Label
//                     htmlFor='quality'
//                     className='text-right col-span-1 text-slate-300'
//                   >
//                     Quality (Shapes)
//                   </Label>
//                   <Select
//                     value={settings.quality}
//                     onValueChange={(value) =>
//                       setSettings((s) => ({ ...s, quality: value }))
//                     }
//                   >
//                     <SelectTrigger
//                       id='quality'
//                       className='col-span-3 bg-slate-700 border-slate-600 focus:ring-purple-500'
//                     >
//                       <SelectValue placeholder='Select quality' />
//                     </SelectTrigger>
//                     <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
//                       {["low", "medium", "high"].map((q) => (
//                         <SelectItem
//                           key={q}
//                           value={q}
//                           className='capitalize focus:bg-purple-600 focus:text-white'
//                         >
//                           {q}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className='grid grid-cols-4 items-center gap-4'>
//                   <Label
//                     htmlFor='background'
//                     className='text-right col-span-1 text-slate-300'
//                   >
//                     Background
//                   </Label>
//                   <Select
//                     value={settings.background}
//                     onValueChange={(value) =>
//                       setSettings((s) => ({ ...s, background: value }))
//                     }
//                   >
//                     <SelectTrigger
//                       id='background'
//                       className='col-span-3 bg-slate-700 border-slate-600 focus:ring-purple-500'
//                     >
//                       <SelectValue placeholder='Select background' />
//                     </SelectTrigger>
//                     <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
//                       {Object.entries(backgroundOptions).map(([key, name]) => (
//                         <SelectItem
//                           key={key}
//                           value={key}
//                           className='focus:bg-purple-600 focus:text-white'
//                         >
//                           {name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//               <DialogFooter>
//                 <DialogClose asChild>
//                   <Button
//                     type='button'
//                     variant='outline'
//                     className='border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
//                   >
//                     Close
//                   </Button>
//                 </DialogClose>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//           <footer className='text-center mt-10 sm:mt-16 py-6 border-t border-slate-700/50'>
//             <p className='text-slate-400 text-sm'>
//               © {new Date().getFullYear()} 3D Shape Studio Pro. All rights
//               reserved.
//             </p>
//             <p className='text-xs text-slate-500 mt-1'>
//               An interactive 3D modeling and visualization tool.
//             </p>
//           </footer>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ModelViewer3D;

//above code with shadcn working fine lets try pshase 3

// import React, { useRef, useEffect, useState, useCallback } from "react";
// import * as THREE from "three";
// import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
// import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
// import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
// import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";
// import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
// import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
// import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
// // --- Phase 3 Imports ---
// import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
// import { TDSLoader } from "three/examples/jsm/loaders/TDSLoader.js";
// // --- End Phase 3 Imports ---

// import {
//   Download,
//   Play,
//   Pause,
//   RotateCcw,
//   Camera,
//   Settings as SettingsIcon,
//   Shuffle,
//   UploadCloud,
//   XCircle,
//   Loader2,
// } from "lucide-react";

// // Shadcn/ui component imports
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Slider } from "@/components/ui/slider";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogClose,
// } from "@/components/ui/dialog";
// import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";
// import { Progress } from "@/components/ui/progress";

// // cn utility
// import { clsx } from "clsx";
// import { twMerge } from "tailwind-merge";

// export function cn(...inputs) {
//   return twMerge(clsx(inputs));
// }

// const saneNumber = (value, defaultValue = 0) => {
//   const num = Number(value);
//   return isNaN(num) || !isFinite(num) ? defaultValue : num;
// };

// // --- Shape Creation Functions ---
// const createCatShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(0), saneNumber(s * 0.8));
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.6),
//     saneNumber(s * 0.8),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(0)
//   );
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.8),
//     saneNumber(-s * 0.6),
//     saneNumber(-s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(0),
//     saneNumber(-s * 0.8)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.8),
//     saneNumber(-s * 0.6),
//     saneNumber(s * 0.8),
//     saneNumber(0)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(s * 0.6),
//     saneNumber(s * 0.8),
//     saneNumber(0),
//     saneNumber(s * 0.8)
//   );
//   const ear1 = new THREE.Path();
//   ear1.moveTo(saneNumber(-s * 0.4), saneNumber(s * 0.6));
//   ear1.lineTo(saneNumber(-s * 0.7), saneNumber(s * 1.2));
//   ear1.lineTo(saneNumber(-s * 0.1), saneNumber(s * 0.9));
//   ear1.closePath();
//   const ear2 = new THREE.Path();
//   ear2.moveTo(saneNumber(s * 0.4), saneNumber(s * 0.6));
//   ear2.lineTo(saneNumber(s * 0.7), saneNumber(s * 1.2));
//   ear2.lineTo(saneNumber(s * 0.1), saneNumber(s * 0.9));
//   ear2.closePath();
//   shape.holes.push(ear1);
//   shape.holes.push(ear2);
//   return shape;
// };
// const createBirdShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(0), saneNumber(s * 0.6));
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.9),
//     saneNumber(-s * 0.2),
//     saneNumber(-s * 0.6),
//     saneNumber(-s * 0.6)
//   );
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.3),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.3),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.6),
//     saneNumber(-s * 0.6)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.9),
//     saneNumber(-s * 0.2),
//     saneNumber(s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(0),
//     saneNumber(s * 0.6)
//   );
//   const wing = new THREE.Path();
//   wing.moveTo(saneNumber(-s * 0.3), saneNumber(s * 0.2));
//   wing.bezierCurveTo(
//     saneNumber(-s * 0.7),
//     saneNumber(s * 0.3),
//     saneNumber(-s * 0.8),
//     saneNumber(0),
//     saneNumber(-s * 0.5),
//     saneNumber(-s * 0.3)
//   );
//   wing.bezierCurveTo(
//     saneNumber(-s * 0.2),
//     saneNumber(-s * 0.1),
//     saneNumber(-s * 0.1),
//     saneNumber(s * 0.1),
//     saneNumber(-s * 0.3),
//     saneNumber(s * 0.2)
//   );
//   shape.holes.push(wing);
//   return shape;
// };
// const createFishShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(-s * 0.8), saneNumber(0));
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.6),
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.2),
//     saneNumber(s * 0.5),
//     saneNumber(s * 0.2),
//     saneNumber(s * 0.3)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.6),
//     saneNumber(s * 0.2),
//     saneNumber(s * 0.8),
//     saneNumber(0),
//     saneNumber(s * 0.8),
//     saneNumber(0)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.6),
//     saneNumber(-s * 0.2),
//     saneNumber(s * 0.2),
//     saneNumber(-s * 0.3),
//     saneNumber(-s * 0.2),
//     saneNumber(-s * 0.5)
//   );
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.6),
//     saneNumber(-s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(0),
//     saneNumber(-s * 0.8),
//     saneNumber(0)
//   );
//   shape.moveTo(saneNumber(s * 0.8), saneNumber(0));
//   shape.lineTo(saneNumber(s * 1.2), saneNumber(s * 0.3));
//   shape.lineTo(saneNumber(s * 1.0), saneNumber(0));
//   shape.lineTo(saneNumber(s * 1.2), saneNumber(-s * 0.3));
//   shape.lineTo(saneNumber(s * 0.8), saneNumber(0));
//   return shape;
// };
// const createSoccerBallShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const r = s * 0.8;
//   for (let i = 0; i < 6; i++) {
//     const a = (i / 6) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * r);
//     const y = saneNumber(Math.sin(a) * r);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.closePath();
//   const ih = new THREE.Path();
//   const ir = s * 0.4;
//   for (let i = 0; i < 6; i++) {
//     const a = (i / 6) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * ir);
//     const y = saneNumber(Math.sin(a) * ir);
//     if (i === 0) ih.moveTo(x, y);
//     else ih.lineTo(x, y);
//   }
//   ih.closePath();
//   shape.holes.push(ih);
//   return shape;
// };
// const createTennisRacketShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const a = s * 0.6;
//   const b = s * 0.4;
//   for (let i = 0; i <= 32; i++) {
//     const ang = (i / 32) * Math.PI * 2;
//     const x = saneNumber(Math.cos(ang) * a);
//     const y = saneNumber(Math.sin(ang) * b + s * 0.3);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.lineTo(saneNumber(s * 0.1), saneNumber(-s * 0.8));
//   shape.lineTo(saneNumber(-s * 0.1), saneNumber(-s * 0.8));
//   shape.closePath();
//   return shape;
// };
// const createBasketballShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const r = s * 0.8;
//   for (let i = 0; i <= 32; i++) {
//     const a = (i / 32) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * r);
//     const y = saneNumber(Math.sin(a) * r);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.closePath();
//   return shape;
// };
// const createPersonShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const hr = s * 0.2;
//   for (let i = 0; i <= 16; i++) {
//     const a = (i / 16) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * hr);
//     const y = saneNumber(Math.sin(a) * hr + s * 0.6);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.lineTo(saneNumber(-s * 0.3), saneNumber(s * 0.2));
//   shape.lineTo(saneNumber(-s * 0.4), saneNumber(-s * 0.4));
//   shape.lineTo(saneNumber(-s * 0.2), saneNumber(-s * 0.8));
//   shape.lineTo(saneNumber(s * 0.2), saneNumber(-s * 0.8));
//   shape.lineTo(saneNumber(s * 0.4), saneNumber(-s * 0.4));
//   shape.lineTo(saneNumber(s * 0.3), saneNumber(s * 0.2));
//   shape.closePath();
//   return shape;
// };
// const createRobotShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(-sval * 0.4), saneNumber(sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.4), saneNumber(sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.4), saneNumber(sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.4), saneNumber(sval * 0.4));
//   shape.closePath();
//   shape.moveTo(saneNumber(-sval * 0.5), saneNumber(sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.5), saneNumber(sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.5), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.5), saneNumber(-sval * 0.4));
//   shape.closePath();
//   shape.moveTo(saneNumber(-sval * 0.3), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.1), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.1), saneNumber(-sval * 0.8));
//   shape.lineTo(saneNumber(-sval * 0.3), saneNumber(-sval * 0.8));
//   shape.closePath();
//   shape.moveTo(saneNumber(sval * 0.1), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.3), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.3), saneNumber(-sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.1), saneNumber(-sval * 0.8));
//   shape.closePath();
//   return shape;
// };
// const createPhoneShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const w = sval * 0.5;
//   const h = sval * 1.0;
//   const r = sval * 0.1;
//   shape.moveTo(saneNumber(-w + r), saneNumber(h));
//   shape.lineTo(saneNumber(w - r), saneNumber(h));
//   shape.quadraticCurveTo(
//     saneNumber(w),
//     saneNumber(h),
//     saneNumber(w),
//     saneNumber(h - r)
//   );
//   shape.lineTo(saneNumber(w), saneNumber(-h + r));
//   shape.quadraticCurveTo(
//     saneNumber(w),
//     saneNumber(-h),
//     saneNumber(w - r),
//     saneNumber(-h)
//   );
//   shape.lineTo(saneNumber(-w + r), saneNumber(-h));
//   shape.quadraticCurveTo(
//     saneNumber(-w),
//     saneNumber(-h),
//     saneNumber(-w),
//     saneNumber(-h + r)
//   );
//   shape.lineTo(saneNumber(-w), saneNumber(h - r));
//   shape.quadraticCurveTo(
//     saneNumber(-w),
//     saneNumber(h),
//     saneNumber(-w + r),
//     saneNumber(h)
//   );
//   shape.closePath();
//   const screen = new THREE.Path();
//   const sw = w * 0.8;
//   const sh = h * 0.8;
//   const sr = r * 0.5;
//   screen.moveTo(saneNumber(-sw + sr), saneNumber(sh));
//   screen.lineTo(saneNumber(sw - sr), saneNumber(sh));
//   screen.quadraticCurveTo(
//     saneNumber(sw),
//     saneNumber(sh),
//     saneNumber(sw),
//     saneNumber(sh - sr)
//   );
//   screen.lineTo(saneNumber(sw), saneNumber(-sh + sr));
//   screen.quadraticCurveTo(
//     saneNumber(sw),
//     saneNumber(-sh),
//     saneNumber(sw - sr),
//     saneNumber(-sh)
//   );
//   screen.lineTo(saneNumber(-sw + sr), saneNumber(-sh));
//   screen.quadraticCurveTo(
//     saneNumber(-sw),
//     saneNumber(-sh),
//     saneNumber(-sw),
//     saneNumber(-sh + sr)
//   );
//   screen.lineTo(saneNumber(-sw), saneNumber(sh - sr));
//   screen.quadraticCurveTo(
//     saneNumber(-sw),
//     saneNumber(sh),
//     saneNumber(-sw + sr),
//     saneNumber(sh)
//   );
//   screen.closePath();
//   shape.holes.push(screen);
//   return shape;
// };
// const createLightningShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(-sval * 0.2), saneNumber(sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.3), saneNumber(sval * 0.2));
//   shape.lineTo(saneNumber(sval * 0.1), saneNumber(sval * 0.2));
//   shape.lineTo(saneNumber(sval * 0.4), saneNumber(-sval * 0.8));
//   shape.lineTo(saneNumber(-sval * 0.1), saneNumber(-sval * 0.2));
//   shape.lineTo(saneNumber(sval * 0.1), saneNumber(-sval * 0.2));
//   shape.lineTo(saneNumber(-sval * 0.4), saneNumber(sval * 0.8));
//   shape.closePath();
//   return shape;
// };
// const createMusicNoteShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const nr = sval * 0.15;
//   for (let i = 0; i <= 16; i++) {
//     const a = (i / 16) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * nr - sval * 0.2);
//     const y = saneNumber(Math.sin(a) * nr - sval * 0.4);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.lineTo(saneNumber(-sval * 0.05), saneNumber(sval * 0.6));
//   shape.lineTo(saneNumber(sval * 0.05), saneNumber(sval * 0.6));
//   shape.lineTo(saneNumber(sval * 0.05), saneNumber(-sval * 0.25));
//   shape.closePath();
//   shape.moveTo(saneNumber(sval * 0.05), saneNumber(sval * 0.6));
//   shape.bezierCurveTo(
//     saneNumber(sval * 0.4),
//     saneNumber(sval * 0.5),
//     saneNumber(sval * 0.3),
//     saneNumber(sval * 0.2),
//     saneNumber(sval * 0.05),
//     saneNumber(sval * 0.3)
//   );
//   shape.closePath();
//   return shape;
// };

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
// const createAdvancedMaterial = (baseColor, materialType = "standard") => {
//   const color = new THREE.Color(baseColor);
//   const materialPresets = {
//     metallic: { metalness: 0.9, roughness: 0.1, envMapIntensity: 1.5 },
//     glass: {
//       metalness: 0.0,
//       roughness: 0.0,
//       transmission: 0.95,
//       thickness: 0.7,
//       transparent: true,
//       opacity: 0.85,
//       envMapIntensity: 2.0,
//       ior: 1.52,
//     },
//     crystal: {
//       metalness: 0.0,
//       roughness: 0.01,
//       transmission: 0.98,
//       thickness: 0.6,
//       transparent: true,
//       opacity: 0.9,
//       envMapIntensity: 2.5,
//       ior: 1.7,
//     },
//     ceramic: { metalness: 0.1, roughness: 0.6, envMapIntensity: 0.8 },
//     organic: { metalness: 0.0, roughness: 0.8, envMapIntensity: 0.5 },
//     plastic: { metalness: 0.0, roughness: 0.3, envMapIntensity: 0.7 },
//     neon: {
//       metalness: 0.0,
//       roughness: 0.1,
//       emissive: color.clone().multiplyScalar(0.8),
//       emissiveIntensity: 1.0,
//       envMapIntensity: 0.2,
//     },
//   };
//   const preset = materialPresets[materialType] || materialPresets.ceramic;
//   const sharedProps = { color, ...preset, side: THREE.DoubleSide };
//   if (materialType === "glass" || materialType === "crystal")
//     return new THREE.MeshPhysicalMaterial(sharedProps);
//   return new THREE.MeshStandardMaterial(sharedProps);
// };
// const create3DShape = (shapeId, currentSettings, size = 1) => {
//   let shape;
//   let materialType =
//     currentSettings.materialType === "auto"
//       ? "ceramic"
//       : currentSettings.materialType;
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
//   const config = shapeConfigs[shapeId] || shapeConfigs.cat;
//   const shapeSize = saneNumber(size, 1.5);
//   shape = config.creator(shapeSize);
//   if (currentSettings.materialType === "auto")
//     materialType = config.autoMaterial;
//   const extrudeSettings = {
//     depth: saneNumber(currentSettings.extrudeDepth, 0.4),
//     bevelEnabled: true,
//     bevelSegments:
//       currentSettings.quality === "high"
//         ? 10
//         : currentSettings.quality === "medium"
//         ? 6
//         : 3,
//     steps:
//       currentSettings.quality === "high"
//         ? 5
//         : currentSettings.quality === "medium"
//         ? 3
//         : 1,
//     bevelSize: saneNumber(0.035 * (shapeSize / 1.5), 0.02),
//     bevelThickness: saneNumber(0.025 * (shapeSize / 1.5), 0.015),
//     curveSegments:
//       currentSettings.quality === "high"
//         ? 48
//         : currentSettings.quality === "medium"
//         ? 24
//         : 12,
//   };
//   const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
//   geometry.computeVertexNormals();
//   try {
//     geometry.center();
//   } catch (e) {
//     console.error(
//       "Error centering geometry:",
//       e,
//       shapeId,
//       currentSettings,
//       shape
//     );
//     return new THREE.Mesh(
//       new THREE.BoxGeometry(1, 1, 1),
//       new THREE.MeshStandardMaterial({ color: 0xff0000 })
//     );
//   }
//   const material = createAdvancedMaterial(
//     currentSettings.shapeColor,
//     materialType
//   );
//   return new THREE.Mesh(geometry, material);
// };

// const CATEGORIES_DATA = [
//   { id: "animals", name: "Animals", icon: "🐱" },
//   { id: "sports", name: "Sports", icon: "⚽" },
//   { id: "people", name: "People", icon: "👤" },
//   { id: "objects", name: "Objects", icon: "📱" },
// ];
// const SHAPES_BY_CATEGORY_DATA = {
//   animals: [
//     { id: "cat", name: "Cat", icon: "🐱" },
//     { id: "bird", name: "Bird", icon: "🐦" },
//     { id: "fish", name: "Fish", icon: "🐟" },
//   ],
//   sports: [
//     { id: "soccer", name: "Soccer", icon: "⚽" },
//     { id: "tennis", name: "Tennis", icon: "🎾" },
//     { id: "basketball", name: "Basketball", icon: "🏀" },
//   ],
//   people: [
//     { id: "person", name: "Person", icon: "👤" },
//     { id: "robot", name: "Robot", icon: "🤖" },
//   ],
//   objects: [
//     { id: "phone", name: "Phone", icon: "📱" },
//     { id: "lightning", name: "Lightning", icon: "⚡" },
//     { id: "music", name: "Music Note", icon: "🎵" },
//   ],
// };
// const BACKGROUND_OPTIONS_DATA = {
//   modernGradient: "Modern Gradient",
//   darkSpace: "Dark Space",
//   softLight: "Soft Light",
//   studioDark: "Studio Dark",
//   studioLight: "Studio Light",
// };

// let gltfLoaderInstance;
// const getGltfLoader = () => {
//   if (!gltfLoaderInstance) {
//     gltfLoaderInstance = new GLTFLoader();
//     const dracoLoader = new DRACOLoader();
//     dracoLoader.setDecoderPath("/draco/gltf/");
//     gltfLoaderInstance.setDRACOLoader(dracoLoader);
//   }
//   return gltfLoaderInstance;
// };

// const ModelViewer3D = () => {
//   const [isMounted, setIsMounted] = useState(false);
//   const mountRef = useRef(null);
//   const sceneRef = useRef(null);
//   const rendererRef = useRef(null);
//   const cameraRef = useRef(null);
//   const controlsRef = useRef(null);
//   const composerRef = useRef(null);
//   const ssaoPassRef = useRef(null);
//   const meshRef = useRef(null);
//   const animationIdRef = useRef(null);
//   const lightsRef = useRef([]);
//   const skyboxMeshRef = useRef(null);
//   const envMapTextureRef = useRef(null);
//   const fileInputRef = useRef(null);

//   const [importedModel, setImportedModel] = useState(null);
//   const [isImportedModelDisplayed, setIsImportedModelDisplayed] =
//     useState(false);
//   const [importedModelName, setImportedModelName] = useState("Imported Model");

//   const [currentCategory, setCurrentCategory] = useState(CATEGORIES_DATA[0].id);
//   const [currentShape, setCurrentShape] = useState(
//     SHAPES_BY_CATEGORY_DATA[CATEGORIES_DATA[0].id][0].id
//   );

//   const categories = CATEGORIES_DATA;
//   const shapesByCategory = SHAPES_BY_CATEGORY_DATA;
//   const backgroundOptions = BACKGROUND_OPTIONS_DATA;

//   const [isAnimating, setIsAnimating] = useState(true);
//   const [animationPreset, setAnimationPreset] = useState("gentle");
//   const [showSettingsDialog, setShowSettingsDialog] = useState(false);
//   const [isExporting, setIsExporting] = useState(false);
//   const [exportProgress, setExportProgress] = useState(0);
//   const [settings, setSettings] = useState({
//     materialType: "auto",
//     shapeColor: "#a78bfa",
//     animationSpeed: 1.0,
//     lightIntensity: 1.0,
//     extrudeDepth: 0.4,
//     quality: "medium",
//     background: "studioDark",
//   });

//   const currentSettingsRef = useRef(settings);
//   useEffect(() => {
//     currentSettingsRef.current = settings;
//   }, [settings]);

//   const animationState = useRef({
//     rotation: new THREE.Euler(),
//     targetRotation: new THREE.Euler(),
//     floatY: 0,
//     startTime: Date.now(),
//   });
//   const isAnimatingRef = useRef(isAnimating);
//   const animationPresetRef = useRef(animationPreset);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);
//   useEffect(() => {
//     isAnimatingRef.current = isAnimating;
//   }, [isAnimating]);
//   useEffect(() => {
//     animationPresetRef.current = animationPreset;
//   }, [animationPreset]);

//   useEffect(() => {
//     if (!isMounted || !mountRef.current) return;
//     const currentMount = mountRef.current;
//     const scene = new THREE.Scene();
//     sceneRef.current = scene;
//     const camera = new THREE.PerspectiveCamera(
//       50,
//       currentMount.clientWidth / currentMount.clientHeight,
//       0.1,
//       1000
//     );
//     cameraRef.current = camera;
//     camera.position.set(0, 0.5, 6);
//     const renderer = new THREE.WebGLRenderer({
//       antialias: true,
//       alpha: true,
//       preserveDrawingBuffer: true,
//     });
//     rendererRef.current = renderer;
//     renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.shadowMap.enabled = true;
//     renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//     renderer.outputColorSpace = THREE.SRGBColorSpace;
//     renderer.toneMapping = THREE.ACESFilmicToneMapping;
//     renderer.toneMappingExposure = 1.0;
//     currentMount.appendChild(renderer.domElement);

//     const controls = new OrbitControls(camera, renderer.domElement);
//     controlsRef.current = controls;
//     controls.enableDamping = true;
//     controls.dampingFactor = 0.05;
//     controls.screenSpacePanning = false;
//     controls.minDistance = 1;
//     controls.maxDistance = 30;
//     controls.maxPolarAngle = Math.PI / 1.6;
//     controls.target.set(0, 0.2, 0);

//     const rgbeLoader = new RGBELoader();
//     rgbeLoader.load(
//       "/brown_photostudio_02_4k.hdr",
//       (texture) => {
//         texture.mapping = THREE.EquirectangularReflectionMapping;
//         if (sceneRef.current) {
//           sceneRef.current.environment = texture;
//           envMapTextureRef.current = texture;
//         }
//       },
//       undefined,
//       (error) => {
//         console.error("Error loading HDR:", error);
//         sonnerToast.error("HDR Load Failed", {
//           description: "Studio lighting map failed.",
//         });
//       }
//     );

//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
//     scene.add(ambientLight);
//     const keyLight = new THREE.DirectionalLight(0xffffff, 0.7);
//     keyLight.position.set(5, 8, 5);
//     keyLight.castShadow = true;
//     keyLight.shadow.mapSize.width = 2048;
//     keyLight.shadow.mapSize.height = 2048;
//     keyLight.shadow.camera.near = 0.5;
//     keyLight.shadow.camera.far = 50;
//     keyLight.shadow.bias = -0.0005;
//     scene.add(keyLight);
//     const fillLight = new THREE.DirectionalLight(0xa0c0ff, 0.4);
//     fillLight.position.set(-5, 3, -3);
//     scene.add(fillLight);
//     lightsRef.current = [ambientLight, keyLight, fillLight];

//     const composer = new EffectComposer(renderer);
//     composerRef.current = composer;
//     const renderPass = new RenderPass(scene, camera);
//     composer.addPass(renderPass);
//     const ssaoPassInstance = new SSAOPass(
//       scene,
//       camera,
//       currentMount.clientWidth,
//       currentMount.clientHeight
//     );
//     ssaoPassInstance.kernelRadius = 0.6;
//     ssaoPassInstance.minDistance = 0.001;
//     ssaoPassInstance.maxDistance = 0.03;
//     composer.addPass(ssaoPassInstance);
//     ssaoPassRef.current = ssaoPassInstance;
//     const outputPass = new OutputPass();
//     composer.addPass(outputPass);

//     const handleResize = () => {
//       if (!currentMount || !cameraRef.current || !rendererRef.current) return;
//       const width = currentMount.clientWidth;
//       const height = currentMount.clientHeight;
//       cameraRef.current.aspect = width / height;
//       cameraRef.current.updateProjectionMatrix();
//       rendererRef.current.setSize(width, height);
//       if (composerRef.current) {
//         composerRef.current.setSize(width, height);
//         const sPass = composerRef.current.passes.find(
//           (p) => p instanceof SSAOPass
//         );
//         if (sPass) sPass.setSize(width, height);
//       }
//     };
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     const clock = new THREE.Clock();
//     const animate = () => {
//       animationIdRef.current = requestAnimationFrame(animate);
//       if (
//         !sceneRef.current ||
//         !rendererRef.current ||
//         !cameraRef.current ||
//         !isMounted
//       ) {
//         if (animationIdRef.current)
//           cancelAnimationFrame(animationIdRef.current);
//         return;
//       }
//       const delta = clock.getDelta();
//       if (controlsRef.current) controlsRef.current.update();
//       if (meshRef.current && isAnimatingRef.current) {
//         const animSettings = currentSettingsRef.current;
//         const presetKey = animationPresetRef.current;
//         const preset = animationPresets[presetKey];
//         if (preset) {
//           const effDelta = delta * animSettings.animationSpeed;
//           animationState.current.targetRotation.x +=
//             preset.rotationSpeed[0] * 60 * effDelta;
//           animationState.current.targetRotation.y +=
//             preset.rotationSpeed[1] * 60 * effDelta;
//           animationState.current.targetRotation.z +=
//             preset.rotationSpeed[2] * 60 * effDelta;
//           meshRef.current.rotation.x = THREE.MathUtils.lerp(
//             meshRef.current.rotation.x,
//             animationState.current.targetRotation.x,
//             0.1
//           );
//           meshRef.current.rotation.y = THREE.MathUtils.lerp(
//             meshRef.current.rotation.y,
//             animationState.current.targetRotation.y,
//             0.1
//           );
//           meshRef.current.rotation.z = THREE.MathUtils.lerp(
//             meshRef.current.rotation.z,
//             animationState.current.targetRotation.z,
//             0.1
//           );
//           const floatTime =
//             (Date.now() - animationState.current.startTime) *
//             0.001 *
//             animSettings.animationSpeed;
//           animationState.current.floatY =
//             Math.sin(floatTime * (preset.floatSpeed || 0.0001) * 100) *
//             (preset.floatAmplitude || 0);
//           meshRef.current.position.y = animationState.current.floatY;
//         }
//       }
//       if (composerRef.current) composerRef.current.render(delta);
//       else if (rendererRef.current)
//         rendererRef.current.render(sceneRef.current, cameraRef.current);
//     };
//     animate();
//     return () => {
//       window.removeEventListener("resize", handleResize);
//       if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
//       controlsRef.current?.dispose();
//       envMapTextureRef.current?.dispose();
//       if (skyboxMeshRef.current) {
//         sceneRef.current?.remove(skyboxMeshRef.current);
//         skyboxMeshRef.current.geometry?.dispose();
//         skyboxMeshRef.current.material?.dispose();
//       }
//       if (meshRef.current) {
//         sceneRef.current?.remove(meshRef.current);
//         meshRef.current.traverse((obj) => {
//           if (obj.geometry) obj.geometry.dispose();
//           if (obj.material) {
//             if (Array.isArray(obj.material))
//               obj.material.forEach((m) => m.dispose());
//             else obj.material.dispose();
//           }
//         });
//       }
//       composerRef.current?.passes.forEach((pass) => pass.dispose?.());
//       ssaoPassRef.current?.dispose?.();
//       sceneRef.current?.traverse((obj) => {
//         if (obj.isLight && obj.shadow && obj.shadow.map)
//           obj.shadow.map.dispose();
//         if (obj.geometry) obj.geometry.dispose();
//         if (obj.material) {
//           const materials = Array.isArray(obj.material)
//             ? obj.material
//             : [obj.material];
//           materials.forEach((mat) => {
//             Object.values(mat).forEach((val) => {
//               if (val instanceof THREE.Texture) val.dispose();
//             });
//             mat.dispose();
//           });
//         }
//       });
//       if (rendererRef.current) {
//         rendererRef.current.dispose();
//         if (mountRef.current && rendererRef.current.domElement) {
//           try {
//             mountRef.current.removeChild(rendererRef.current.domElement);
//           } catch (e) {}
//         }
//       }
//       sceneRef.current = null;
//       cameraRef.current = null;
//       rendererRef.current = null;
//       controlsRef.current = null;
//       composerRef.current = null;
//       ssaoPassRef.current = null;
//       meshRef.current = null;
//       envMapTextureRef.current = null;
//       skyboxMeshRef.current = null;
//       lightsRef.current = [];
//     };
//   }, [isMounted]);

//   useEffect(() => {
//     if (!isMounted || !sceneRef.current || !rendererRef.current) return;
//     if (skyboxMeshRef.current) {
//       sceneRef.current.remove(skyboxMeshRef.current);
//       skyboxMeshRef.current.geometry?.dispose();
//       skyboxMeshRef.current.material?.dispose();
//       skyboxMeshRef.current = null;
//     }
//     sceneRef.current.background = null;
//     sceneRef.current.fog = null;
//     rendererRef.current.toneMappingExposure = 1.0;
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
//         sceneRef.current.background = new THREE.Color(0x0a0a10);
//         fogC = new THREE.Color(0x050508);
//         fogNear = 10;
//         fogFar = 35;
//         break;
//       case "softLight":
//         sceneRef.current.background = new THREE.Color(0xe0e8f0);
//         fogC = new THREE.Color(0xd0d8e0);
//         fogNear = 7;
//         fogFar = 28;
//         if (rendererRef.current) rendererRef.current.toneMappingExposure = 0.9;
//         break;
//       case "studioDark":
//         sceneRef.current.background = new THREE.Color(0x18181b);
//         fogC = new THREE.Color(0x101012);
//         fogNear = 12;
//         fogFar = 40;
//         break;
//       case "studioLight":
//         sceneRef.current.background = new THREE.Color(0xf4f4f5);
//         fogC = new THREE.Color(0xe4e4e7);
//         fogNear = 10;
//         fogFar = 35;
//         if (rendererRef.current) rendererRef.current.toneMappingExposure = 0.85;
//         break;
//       default:
//         sceneRef.current.background = new THREE.Color(0x18181b);
//         fogC = new THREE.Color(0x101012);
//     }
//     if (settings.background === "modernGradient" && topC && bottomC) {
//       const gradGeom = new THREE.SphereGeometry(50, 32, 32);
//       const gradMat = new THREE.ShaderMaterial({
//         uniforms: {
//           topColor: { value: topC },
//           bottomColor: { value: bottomC },
//           offset: { value: 33 },
//           exponent: { value: 0.6 },
//         },
//         vertexShader: `varying vec3 vWorldPosition; void main() { vec4 worldPosition = modelMatrix * vec4(position, 1.0); vWorldPosition = worldPosition.xyz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
//         fragmentShader: `uniform vec3 topColor; uniform vec3 bottomColor; uniform float offset; uniform float exponent; varying vec3 vWorldPosition; void main() { float h = normalize(vWorldPosition + offset).y; gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0); }`,
//         side: THREE.BackSide,
//       });
//       skyboxMeshRef.current = new THREE.Mesh(gradGeom, gradMat);
//       sceneRef.current.add(skyboxMeshRef.current);
//     }
//     if (fogC) sceneRef.current.fog = new THREE.Fog(fogC, fogNear, fogFar);
//   }, [settings.background, isMounted]);

//   useEffect(() => {
//     if (!isMounted || !lightsRef.current || lightsRef.current.length < 3)
//       return;
//     const baseIntensities = [0.25, 0.7, 0.4];
//     lightsRef.current.forEach((light, index) => {
//       if (
//         light &&
//         light.intensity !== undefined &&
//         baseIntensities[index] !== undefined
//       ) {
//         light.intensity = baseIntensities[index] * settings.lightIntensity;
//       }
//     });
//   }, [settings.lightIntensity, isMounted]);

//   const {
//     extrudeDepth,
//     quality,
//     shapeColor,
//     materialType: procMaterialType,
//   } = settings;
//   useEffect(() => {
//     if (!isMounted || !sceneRef.current) return;
//     if (meshRef.current) {
//       sceneRef.current.remove(meshRef.current);
//       meshRef.current.traverse((obj) => {
//         if (obj.geometry) obj.geometry.dispose();
//         if (obj.material) {
//           if (Array.isArray(obj.material))
//             obj.material.forEach((m) => m.dispose());
//           else obj.material.dispose();
//         }
//       });
//       meshRef.current = null;
//     }
//     let newMesh;
//     if (isImportedModelDisplayed && importedModel && importedModel.scene) {
//       newMesh = importedModel.scene.clone(true);
//       const box = new THREE.Box3().setFromObject(newMesh);
//       const sizeVec = box.getSize(new THREE.Vector3());
//       const maxDim = Math.max(
//         saneNumber(sizeVec.x, 1),
//         saneNumber(sizeVec.y, 1),
//         saneNumber(sizeVec.z, 1)
//       );
//       const desiredDisplaySize = 3;
//       const scaleFactor = maxDim > 0 ? desiredDisplaySize / maxDim : 1;
//       newMesh.scale.set(
//         saneNumber(scaleFactor, 1),
//         saneNumber(scaleFactor, 1),
//         saneNumber(scaleFactor, 1)
//       );
//       const scaledBox = new THREE.Box3().setFromObject(newMesh);
//       const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
//       if (
//         !isNaN(scaledCenter.x) &&
//         !isNaN(scaledCenter.y) &&
//         !isNaN(scaledCenter.z)
//       ) {
//         newMesh.position.sub(scaledCenter);
//       } else {
//         console.warn("Imported model center NaN");
//         sonnerToast.warning("Centering Issue");
//         newMesh.position.set(0, 0, 0);
//       }
//       newMesh.traverse((child) => {
//         if (child.isMesh) {
//           child.castShadow = true;
//           child.receiveShadow = true;
//           if (child.material) {
//             if (Array.isArray(child.material)) {
//               child.material.forEach((m) => (m.side = THREE.DoubleSide));
//             } else {
//               child.material.side = THREE.DoubleSide;
//             }
//           }
//         }
//       });
//     } else {
//       const proceduralSettings = {
//         extrudeDepth,
//         quality,
//         shapeColor,
//         materialType: procMaterialType,
//       };
//       newMesh = create3DShape(currentShape, proceduralSettings, 1.5);
//       newMesh.castShadow = true;
//       newMesh.receiveShadow = true;
//     }
//     newMesh.position.y = 0;
//     animationState.current.floatY = 0;
//     animationState.current.targetRotation.set(0, 0, 0);
//     newMesh.rotation.set(0, 0, 0);
//     sceneRef.current.add(newMesh);
//     meshRef.current = newMesh;
//   }, [
//     currentShape,
//     extrudeDepth,
//     quality,
//     shapeColor,
//     procMaterialType,
//     isMounted,
//     importedModel,
//     isImportedModelDisplayed,
//   ]);

//   const handleResetAnimation = useCallback(() => {
//     animationState.current.targetRotation.set(0, 0, 0);
//     animationState.current.floatY = 0;
//     animationState.current.startTime = Date.now();
//     if (meshRef.current) {
//       meshRef.current.rotation.set(0, 0, 0);
//       meshRef.current.position.y = 0;
//     }
//     if (controlsRef.current) {
//       controlsRef.current.reset();
//       controlsRef.current.target.set(0, 0.2, 0);
//     }
//     sonnerToast.info("Animation Reset", {
//       description: "Model position and rotation restored.",
//     });
//   }, []);

//   const handleToggleAnimation = useCallback(() => {
//     setIsAnimating((prev) => {
//       const newIsAnimating = !prev;
//       if (newIsAnimating) {
//         const preset = animationPresets[animationPresetRef.current];
//         const floatAmplitude = preset?.floatAmplitude || 0.1;
//         const floatSpeed = preset?.floatSpeed || 0.001;
//         const timeDivisor = floatAmplitude * (floatSpeed * 100);
//         const timeOffset =
//           timeDivisor !== 0
//             ? (animationState.current.floatY / timeDivisor) * 1000
//             : 0;
//         animationState.current.startTime =
//           Date.now() - (isFinite(timeOffset) ? timeOffset : 0);
//       } else {
//         if (meshRef.current)
//           animationState.current.targetRotation.copy(meshRef.current.rotation);
//       }
//       sonnerToast.info(`Animation ${newIsAnimating ? "Resumed" : "Paused"}`);
//       return newIsAnimating;
//     });
//   }, []);

//   const handleCategorySelect = useCallback(
//     (categoryId) => {
//       setIsImportedModelDisplayed(false);
//       setCurrentCategory(categoryId);
//       setCurrentShape(shapesByCategory[categoryId][0].id);
//       handleResetAnimation();
//     },
//     [shapesByCategory, handleResetAnimation]
//   );

//   const handleShapeSelect = useCallback(
//     (shapeId) => {
//       setIsImportedModelDisplayed(false);
//       setCurrentShape(shapeId);
//       handleResetAnimation();
//     },
//     [handleResetAnimation]
//   );

//   useEffect(() => {
//     if (isMounted) handleResetAnimation();
//   }, [animationPreset, isMounted, handleResetAnimation]);

//   const handleRandomize = useCallback(() => {
//     setIsImportedModelDisplayed(false);
//     const randCat = categories[Math.floor(Math.random() * categories.length)];
//     const randShapeList = shapesByCategory[randCat.id];
//     const randShape =
//       randShapeList[Math.floor(Math.random() * randShapeList.length)];
//     const randPresetKey =
//       Object.keys(animationPresets)[
//         Math.floor(Math.random() * Object.keys(animationPresets).length)
//       ];
//     const randColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`;
//     const bgKeys = Object.keys(backgroundOptions);
//     const randBgKey = bgKeys[Math.floor(Math.random() * bgKeys.length)];
//     const matKeys = [
//       "auto",
//       "metallic",
//       "glass",
//       "crystal",
//       "ceramic",
//       "organic",
//       "plastic",
//       "neon",
//     ];
//     const randMat = matKeys[Math.floor(Math.random() * matKeys.length)];
//     setCurrentCategory(randCat.id);
//     setCurrentShape(randShape.id);
//     setAnimationPreset(randPresetKey);
//     setSettings((prev) => ({
//       ...prev,
//       materialType: randMat,
//       shapeColor: randColor,
//       background: randBgKey,
//       extrudeDepth: saneNumber(Math.random() * (1.0 - 0.1) + 0.1, 0.4),
//       lightIntensity: saneNumber(Math.random() * (1.8 - 0.6) + 0.6, 1.0),
//       animationSpeed: saneNumber(Math.random() * (2.0 - 0.5) + 0.5, 1.0),
//     }));
//     sonnerToast.success("Scene Randomized!", {
//       description: "Enjoy the new look.",
//     });
//   }, [categories, shapesByCategory, backgroundOptions, handleResetAnimation]);

//   const currentShapeRef = useRef(currentShape);
//   useEffect(() => {
//     currentShapeRef.current = currentShape;
//   }, [currentShape]);
//   const currentImportedModelNameRef = useRef(importedModelName);
//   useEffect(() => {
//     currentImportedModelNameRef.current = importedModelName;
//   }, [importedModelName]);

//   const handleExportGLB = useCallback(() => {
//     if (!meshRef.current || isExporting) return;
//     setIsExporting(true);
//     setExportProgress(0);
//     const exportToastId = sonnerToast.loading("Exporting GLB...", {
//       description: "Preparing model...",
//     });
//     const exporter = new GLTFExporter();
//     let progress = 0;
//     const progInterval = setInterval(() => {
//       progress += Math.floor(Math.random() * 10 + 5);
//       const curProg = Math.min(progress, 95);
//       setExportProgress(curProg);
//       sonnerToast.loading("Exporting GLB...", {
//         id: exportToastId,
//         description: `Processing... ${curProg}%`,
//       });
//       if (curProg >= 95) clearInterval(progInterval);
//     }, 150);
//     setTimeout(() => {
//       try {
//         if (!(meshRef.current instanceof THREE.Object3D))
//           throw new Error("Model not valid for export.");
//         const exportOptions = { binary: true };
//         if (isImportedModelDisplayed && importedModel?.animations?.length > 0)
//           exportOptions.animations = importedModel.animations;
//         exporter.parse(
//           meshRef.current,
//           (gltf) => {
//             clearInterval(progInterval);
//             setExportProgress(100);
//             sonnerToast.success("GLB Export Ready", {
//               id: exportToastId,
//               description: "Download starting.",
//             });
//             if (!(gltf instanceof ArrayBuffer))
//               throw new Error("Exported GLTF not ArrayBuffer.");
//             const blob = new Blob([gltf], { type: "application/octet-stream" });
//             const link = document.createElement("a");
//             link.href = URL.createObjectURL(blob);
//             const fileNameToExport = isImportedModelDisplayed
//               ? currentImportedModelNameRef.current || "imported-model"
//               : currentShapeRef.current || "model";
//             link.download = `shape-${fileNameToExport}.glb`;
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             URL.revokeObjectURL(link.href);
//             setTimeout(() => {
//               setIsExporting(false);
//               setExportProgress(0);
//             }, 500);
//           },
//           (error) => {
//             clearInterval(progInterval);
//             console.error("GLTFExporter.parse error:", error);
//             sonnerToast.error("GLB Export Failed", {
//               id: exportToastId,
//               description: error.message || "GLTF parsing error.",
//             });
//             setIsExporting(false);
//             setExportProgress(0);
//           },
//           exportOptions
//         );
//       } catch (e) {
//         clearInterval(progInterval);
//         console.error("GLTF export setup error:", e);
//         sonnerToast.error("GLB Export Failed", {
//           id: exportToastId,
//           description: e.message || "Unexpected error.",
//         });
//         setIsExporting(false);
//         setExportProgress(0);
//       }
//     }, 100);
//   }, [isExporting, meshRef, isImportedModelDisplayed, importedModel]);

//   const handleSimulatedExportOBJ = useCallback(() => {
//     if (isExporting) return;
//     setIsExporting(true);
//     setExportProgress(0);
//     const exportToastId = sonnerToast.loading("Exporting OBJ (Simulated)...", {
//       description: "Processing...",
//     });
//     let p = 0;
//     const i = setInterval(() => {
//       p += Math.floor(Math.random() * 15 + 10);
//       const currentProgress = Math.min(p, 100);
//       setExportProgress(currentProgress);
//       sonnerToast.loading("Exporting OBJ (Simulated)...", {
//         id: exportToastId,
//         description: `Processing... ${currentProgress}%`,
//       });
//       if (currentProgress >= 100) {
//         clearInterval(i);
//         const l = document.createElement("a");
//         l.download = `shape-${
//           isImportedModelDisplayed
//             ? currentImportedModelNameRef.current
//             : currentShapeRef.current || "model"
//         }.obj`;
//         l.href =
//           "data:text/plain;charset=utf-8," +
//           encodeURIComponent(
//             "# OBJ file simulated\n# Actual OBJ Exporter Needed"
//           );
//         document.body.appendChild(l);
//         l.click();
//         document.body.removeChild(l);
//         sonnerToast.success("OBJ Export (Simulated) Ready", {
//           id: exportToastId,
//           description: "Simulated OBJ downloaded.",
//         });
//         setTimeout(() => {
//           setIsExporting(false);
//           setExportProgress(0);
//         }, 500);
//       }
//     }, 150);
//   }, [isExporting, isImportedModelDisplayed]);

//   const handleTakeScreenshot = useCallback(() => {
//     if (!rendererRef.current || !sceneRef.current || !cameraRef.current) {
//       sonnerToast.error("Screenshot Failed", {
//         description: "Renderer not ready.",
//       });
//       return;
//     }
//     const screenshotToastId = sonnerToast.loading("Taking Screenshot...", {
//       description: "Capturing image...",
//     });
//     if (composerRef.current) composerRef.current.render();
//     else rendererRef.current.render(sceneRef.current, cameraRef.current);
//     setTimeout(() => {
//       try {
//         const canvas = rendererRef.current.domElement;
//         const link = document.createElement("a");
//         link.download = `screenshot-${
//           isImportedModelDisplayed
//             ? currentImportedModelNameRef.current
//             : currentShapeRef.current || "view"
//         }.png`;
//         link.href = canvas.toDataURL("image/png");
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         sonnerToast.success("Screenshot Saved!", {
//           id: screenshotToastId,
//           description: `${link.download} saved.`,
//         });
//       } catch (e) {
//         console.error("Screenshot error:", e);
//         sonnerToast.error("Screenshot Failed", {
//           id: screenshotToastId,
//           description: e.message || "Could not save.",
//         });
//       }
//     }, 100);
//   }, [isImportedModelDisplayed]);

//   const processAndSetImportedModel = useCallback(
//     (scene, animations, fileName) => {
//       const nameOnly =
//         fileName.split(".").slice(0, -1).join(".") || "Imported Model";
//       setImportedModelName(nameOnly);
//       setImportedModel({ scene, animations: animations || [] });
//       setIsImportedModelDisplayed(true);
//       handleResetAnimation();
//       // Success toast is handled by the caller of this function after import completes or in handleFiles
//     },
//     [handleResetAnimation]
//   );

//   const processImportedGltf = useCallback(
//     (gltf, fileName) => {
//       processAndSetImportedModel(gltf.scene, gltf.animations, fileName);
//     },
//     [processAndSetImportedModel]
//   );

//   const handleFiles = useCallback(
//     async (files) => {
//       if (!files || files.length === 0) return;
//       const importToastId = sonnerToast.loading("Processing File(s)...");

//       let objFile = null,
//         mtlFile = null,
//         fbxFile = null,
//         tdsFile = null,
//         otherModelFile = null;

//       for (const file of files) {
//         const lowerName = file.name.toLowerCase();
//         if (lowerName.endsWith(".obj")) objFile = file;
//         else if (lowerName.endsWith(".mtl")) mtlFile = file;
//         else if (lowerName.endsWith(".fbx")) fbxFile = file;
//         else if (lowerName.endsWith(".3ds")) tdsFile = file;
//         else if (
//           lowerName.endsWith(".glb") ||
//           lowerName.endsWith(".gltf") ||
//           lowerName.endsWith(".stl")
//         ) {
//           if (!otherModelFile) otherModelFile = file;
//         }
//       }

//       if (objFile) {
//         sonnerToast.info("Processing OBJ model...", {
//           id: importToastId,
//           description: `Loading ${objFile.name}${
//             mtlFile ? " with " + mtlFile.name : ""
//           }`,
//         });
//         try {
//           const objLoader = new OBJLoader();
//           const mtlLoader = new MTLLoader();
//           let materialsCreator = null;
//           if (
//             mtlFile &&
//             objFile.name.slice(0, -4) === mtlFile.name.slice(0, -4)
//           ) {
//             const mtlText = await mtlFile.text();
//             mtlLoader.setResourcePath("");
//             materialsCreator = mtlLoader.parse(mtlText, "");
//             materialsCreator.preload();
//           }
//           const objText = await objFile.text();
//           if (materialsCreator) objLoader.setMaterials(materialsCreator);
//           const object = objLoader.parse(objText);
//           object.traverse((child) => {
//             if (child.isMesh) {
//               if (child.material) {
//                 if (Array.isArray(child.material))
//                   child.material.forEach(
//                     (mat) => (mat.side = THREE.DoubleSide)
//                   );
//                 else child.material.side = THREE.DoubleSide;
//               } else if (!materialsCreator) {
//                 child.material = createAdvancedMaterial(
//                   currentSettingsRef.current.shapeColor,
//                   "ceramic"
//                 );
//                 child.material.side = THREE.DoubleSide;
//               }
//               child.castShadow = true;
//               child.receiveShadow = true;
//             }
//           });
//           processAndSetImportedModel(object, [], objFile.name); // Success toast inside this
//           sonnerToast.dismiss(importToastId); // Only dismiss if processAndSetImportedModel doesn't handle it
//         } catch (error) {
//           console.error("OBJ/MTL Error:", error);
//           sonnerToast.error("OBJ/MTL Load Failed", {
//             id: importToastId,
//             description: `${objFile.name}: ${error.message || "Unknown"}`,
//           });
//         }
//       } else if (fbxFile) {
//         sonnerToast.info("Processing FBX model...", {
//           id: importToastId,
//           description: `Loading ${fbxFile.name}. This may take a moment...`,
//         });
//         try {
//           const buffer = await fbxFile.arrayBuffer();
//           const loader = new FBXLoader();
//           const object = loader.parse(buffer, "");
//           object.traverse((child) => {
//             if (child.isMesh) {
//               child.castShadow = true;
//               child.receiveShadow = true;
//               if (child.material) {
//                 if (Array.isArray(child.material))
//                   child.material.forEach(
//                     (mat) => (mat.side = THREE.DoubleSide)
//                   );
//                 else child.material.side = THREE.DoubleSide;
//               }
//             }
//           });
//           processAndSetImportedModel(
//             object,
//             object.animations || [],
//             fbxFile.name
//           );
//           sonnerToast.dismiss(importToastId);
//         } catch (error) {
//           console.error("FBX Error:", error);
//           sonnerToast.error("FBX Load Failed", {
//             id: importToastId,
//             description: `${fbxFile.name}: ${
//               error.message || "Unknown FBX error"
//             }`,
//           });
//         }
//       } else if (tdsFile) {
//         sonnerToast.info("Processing 3DS model...", {
//           id: importToastId,
//           description: `Loading ${tdsFile.name}`,
//         });
//         try {
//           const buffer = await tdsFile.arrayBuffer();
//           const loader = new TDSLoader();
//           // loader.setResourcePath(''); // If textures are referenced
//           const object = loader.parse(buffer, "");
//           object.traverse((child) => {
//             if (child.isMesh) {
//               child.castShadow = true;
//               child.receiveShadow = true;
//               if (child.material) {
//                 if (Array.isArray(child.material))
//                   child.material.forEach(
//                     (mat) => (mat.side = THREE.DoubleSide)
//                   );
//                 else child.material.side = THREE.DoubleSide;
//               } else {
//                 child.material = createAdvancedMaterial(
//                   currentSettingsRef.current.shapeColor,
//                   "plastic"
//                 );
//                 child.material.side = THREE.DoubleSide;
//               }
//             }
//           });
//           processAndSetImportedModel(object, [], tdsFile.name);
//           sonnerToast.dismiss(importToastId);
//         } catch (error) {
//           console.error("3DS Error:", error);
//           sonnerToast.error("3DS Load Failed", {
//             id: importToastId,
//             description: `${tdsFile.name}: ${
//               error.message || "Unknown 3DS error"
//             }`,
//           });
//         }
//       } else if (otherModelFile) {
//         sonnerToast.info("Processing model...", {
//           id: importToastId,
//           description: `Loading ${otherModelFile.name}`,
//         });
//         const lowerName = otherModelFile.name.toLowerCase();
//         try {
//           const buffer = await otherModelFile.arrayBuffer();
//           if (lowerName.endsWith(".glb") || lowerName.endsWith(".gltf")) {
//             const loader = getGltfLoader();
//             loader.parse(
//               buffer,
//               "",
//               (gltf) => {
//                 processImportedGltf(gltf, otherModelFile.name);
//                 sonnerToast.dismiss(importToastId);
//               }, // Success toast inside processImportedGltf via processAndSet
//               (error) => {
//                 console.error("GLB/GLTF Parse Error:", error);
//                 sonnerToast.error("GLB/GLTF Parse Failed", {
//                   id: importToastId,
//                   description: `${otherModelFile.name}: ${
//                     error.message || "Unknown"
//                   }`,
//                 });
//               }
//             );
//             return; // GLTF is async
//           } else if (lowerName.endsWith(".stl")) {
//             const loader = new STLLoader();
//             const geometry = loader.parse(buffer);
//             if (!geometry.isBufferGeometry)
//               throw new Error("Invalid STL geometry.");
//             const material = createAdvancedMaterial(
//               currentSettingsRef.current.shapeColor,
//               "plastic"
//             );
//             const modelScene = new THREE.Mesh(geometry, material);
//             processAndSetImportedModel(modelScene, [], otherModelFile.name); // Success toast inside this
//             sonnerToast.dismiss(importToastId); // Only dismiss if processAndSetImportedModel doesn't handle it
//           }
//         } catch (error) {
//           console.error("Model Load Error:", error);
//           sonnerToast.error("Model Load Failed", {
//             id: importToastId,
//             description: `${otherModelFile.name}: ${
//               error.message || "Unknown"
//             }`,
//           });
//         }
//       } else {
//         sonnerToast.warning("No Supported File", {
//           id: importToastId,
//           description: "Please select GLB, GLTF, STL, OBJ, FBX or 3DS.",
//         });
//       }
//       if (fileInputRef.current) fileInputRef.current.value = null;
//     },
//     [processImportedGltf, processAndSetImportedModel]
//   );

//   const triggerImport = useCallback(() => {
//     if (fileInputRef.current) fileInputRef.current.click();
//   }, []);
//   const handleFileDropOnViewer = useCallback(
//     (event) => {
//       event.preventDefault();
//       event.stopPropagation();
//       if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
//         handleFiles(Array.from(event.dataTransfer.files));
//       }
//     },
//     [handleFiles]
//   );

//   if (!isMounted) {
//     return (
//       <div className='min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-4'>
//         <Loader2 className='h-12 w-12 animate-spin text-purple-400 mb-4' />
//         <p className='text-lg font-medium'>Initializing 3D Studio...</p>
//         <p className='text-sm text-slate-400'>
//           Getting things ready, please wait.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <SonnerToaster richColors position='top-right' />
//       <div className='min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 p-3 sm:p-4 md:p-6 text-slate-100 select-none'>
//         <input
//           type='file'
//           accept='.glb,.gltf,.stl,.obj,.mtl,.fbx,.3ds'
//           multiple
//           ref={fileInputRef}
//           onChange={(e) => handleFiles(Array.from(e.target.files))}
//           style={{ display: "none" }}
//         />
//         <div className='max-w-screen-2xl mx-auto'>
//           <header className='text-center mb-8 sm:mb-10'>
//             <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-3 sm:mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent'>
//               3D Shape Studio Pro
//             </h1>
//             <p className='text-slate-400 text-base sm:text-lg max-w-3xl mx-auto'>
//               Craft, view, and animate 3D masterpieces. Import GLB, GLTF, STL,
//               OBJ, FBX or 3DS models.
//             </p>
//           </header>
//           <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6'>
//             <div className='lg:col-span-3 space-y-4 sm:space-y-5 order-last lg:order-first'>
//               {!isImportedModelDisplayed && (
//                 <>
//                   <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
//                     <CardHeader>
//                       <CardTitle className='text-slate-100'>
//                         Categories
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className='grid grid-cols-2 gap-3'>
//                         {categories.map((category) => (
//                           <Button
//                             key={category.id}
//                             variant={
//                               currentCategory === category.id
//                                 ? "default"
//                                 : "outline"
//                             }
//                             className={cn(
//                               "h-auto py-3 flex flex-col items-center justify-center gap-1.5 text-xs sm:text-sm transition-all",
//                               currentCategory === category.id
//                                 ? "bg-purple-600 hover:bg-purple-700 text-white ring-2 ring-purple-400"
//                                 : "text-slate-300 border-slate-600 hover:bg-slate-700/50"
//                             )}
//                             onClick={() => handleCategorySelect(category.id)}
//                           >
//                             <span className='text-2xl sm:text-3xl'>
//                               {category.icon}
//                             </span>{" "}
//                             <span>{category.name}</span>
//                           </Button>
//                         ))}
//                       </div>
//                     </CardContent>
//                   </Card>
//                   <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
//                     <CardHeader>
//                       <CardTitle className='text-slate-100'>Shapes</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className='grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50'>
//                         {shapesByCategory[currentCategory].map((shape) => (
//                           <Button
//                             key={shape.id}
//                             variant={
//                               currentShape === shape.id ? "secondary" : "ghost"
//                             }
//                             className={cn(
//                               "justify-start gap-2",
//                               currentShape === shape.id
//                                 ? "bg-purple-500 text-white hover:bg-purple-600"
//                                 : "text-slate-300 hover:bg-slate-700/50"
//                             )}
//                             onClick={() => handleShapeSelect(shape.id)}
//                           >
//                             <span className='text-xl'>{shape.icon}</span>{" "}
//                             {shape.name}
//                           </Button>
//                         ))}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </>
//               )}
//               {isImportedModelDisplayed && importedModel && (
//                 <Card className='bg-slate-800/70 border-slate-700 shadow-xl text-center'>
//                   <CardHeader>
//                     <CardTitle className='text-slate-100'>
//                       Current Model
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <p
//                       className='text-sm text-slate-300 truncate font-medium'
//                       title={importedModelName}
//                     >
//                       {importedModelName}
//                     </p>
//                   </CardContent>
//                   <CardFooter>
//                     <Button
//                       variant='destructive'
//                       size='sm'
//                       className='w-full'
//                       onClick={() => {
//                         setImportedModel(null);
//                         setIsImportedModelDisplayed(false);
//                         setImportedModelName("Imported Model");
//                         const defaultCategoryId = categories[0].id;
//                         setCurrentCategory(defaultCategoryId);
//                         setCurrentShape(
//                           shapesByCategory[defaultCategoryId][0].id
//                         );
//                         handleResetAnimation();
//                         sonnerToast.info("Imported Model Cleared", {
//                           description: "Procedural shapes active.",
//                         });
//                       }}
//                     >
//                       {" "}
//                       <XCircle size={16} className='mr-2' /> Clear Imported{" "}
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               )}
//               <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
//                 <CardHeader>
//                   <CardTitle className='text-slate-100'>Animation</CardTitle>
//                 </CardHeader>
//                 <CardContent className='space-y-4'>
//                   <Button
//                     onClick={handleToggleAnimation}
//                     variant={isAnimating ? "destructive" : "default"}
//                     className='w-full bg-green-600 hover:bg-green-700 data-[state=destructive]:bg-red-600 data-[state=destructive]:hover:bg-red-700'
//                     data-state={isAnimating ? "destructive" : "default"}
//                   >
//                     {isAnimating ? (
//                       <Pause size={16} className='mr-2' />
//                     ) : (
//                       <Play size={16} className='mr-2' />
//                     )}{" "}
//                     {isAnimating ? "Pause" : "Play"}
//                   </Button>
//                   <Select
//                     value={animationPreset}
//                     onValueChange={setAnimationPreset}
//                   >
//                     <SelectTrigger className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'>
//                       <SelectValue placeholder='Select animation' />
//                     </SelectTrigger>
//                     <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
//                       {Object.keys(animationPresets).map((presetKey) => (
//                         <SelectItem
//                           key={presetKey}
//                           value={presetKey}
//                           className='capitalize focus:bg-purple-600 focus:text-white'
//                         >
//                           {presetKey.charAt(0).toUpperCase() +
//                             presetKey.slice(1)}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <div className='grid grid-cols-2 gap-3'>
//                     <Button
//                       variant='outline'
//                       onClick={handleResetAnimation}
//                       className='border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
//                     >
//                       <RotateCcw size={14} className='mr-2' /> Reset
//                     </Button>
//                     <Button
//                       variant='default'
//                       onClick={handleRandomize}
//                       className='bg-indigo-600 hover:bg-indigo-700'
//                     >
//                       <Shuffle size={14} className='mr-2' /> Random
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//               <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
//                 <CardHeader>
//                   <CardTitle className='text-slate-100'>
//                     File & Export
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className='space-y-3'>
//                   <Button
//                     onClick={triggerImport}
//                     disabled={isExporting}
//                     className='w-full bg-green-600 hover:bg-green-700'
//                   >
//                     <UploadCloud size={16} className='mr-2' /> Import Model
//                   </Button>
//                   <Button
//                     onClick={handleExportGLB}
//                     disabled={isExporting}
//                     className='w-full bg-blue-600 hover:bg-blue-700'
//                   >
//                     <Download size={16} className='mr-2' />{" "}
//                     {isExporting && exportProgress > 0 && exportProgress <= 100
//                       ? `GLB... ${Math.round(exportProgress)}%`
//                       : "Export GLB"}
//                   </Button>
//                   <Button
//                     onClick={handleSimulatedExportOBJ}
//                     disabled={isExporting}
//                     className='w-full bg-teal-600 hover:bg-teal-700'
//                   >
//                     <Download size={16} className='mr-2' />{" "}
//                     {isExporting && exportProgress > 0 && exportProgress <= 100
//                       ? `OBJ... ${Math.round(exportProgress)}%`
//                       : "Export OBJ (Sim.)"}
//                   </Button>
//                   <Button
//                     onClick={handleTakeScreenshot}
//                     disabled={isExporting}
//                     className='w-full bg-purple-600 hover:bg-purple-700'
//                   >
//                     <Camera size={16} className='mr-2' /> Screenshot
//                   </Button>
//                 </CardContent>
//               </Card>
//               <Button
//                 variant='outline'
//                 className='w-full border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 py-3'
//                 onClick={() => setShowSettingsDialog(true)}
//               >
//                 <SettingsIcon size={16} className='mr-2' /> Viewer Settings
//               </Button>
//             </div>
//             <div className='lg:col-span-9 order-first lg:order-last'>
//               <Card className='bg-slate-800/50 border-slate-700/80 shadow-2xl aspect-[4/3] sm:aspect-video lg:aspect-[16/10] overflow-hidden'>
//                 <CardContent className='p-0 w-full h-full relative'>
//                   <div
//                     className='relative w-full h-full'
//                     onDragOver={(e) => {
//                       e.preventDefault();
//                       e.stopPropagation();
//                     }}
//                     onDrop={handleFileDropOnViewer}
//                   >
//                     <div
//                       ref={mountRef}
//                       className='w-full h-full rounded-lg overflow-hidden'
//                     />
//                     {isExporting && (
//                       <div className='absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-lg z-10 backdrop-blur-sm'>
//                         <Card className='bg-slate-100 text-slate-800 p-6 sm:p-8 shadow-2xl text-center w-72'>
//                           <CardHeader className='p-0 mb-4'>
//                             <CardTitle className='text-xl sm:text-2xl'>
//                               Exporting Model
//                             </CardTitle>
//                           </CardHeader>
//                           <CardContent className='p-0 space-y-3'>
//                             <div className='text-lg font-semibold'>
//                               {Math.round(exportProgress)}%
//                             </div>
//                             <Progress
//                               value={exportProgress}
//                               className='w-full h-2.5'
//                             />
//                             <p className='text-xs text-slate-500'>
//                               Please wait, this may take a moment...
//                             </p>
//                           </CardContent>
//                         </Card>
//                       </div>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//           <Dialog
//             open={showSettingsDialog}
//             onOpenChange={setShowSettingsDialog}
//           >
//             <DialogContent className='bg-slate-800 border-slate-700 text-slate-100 sm:max-w-[525px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50'>
//               <DialogHeader>
//                 <DialogTitle className='text-2xl'>Viewer Settings</DialogTitle>
//                 <DialogDescription className='text-slate-400'>
//                   Customize appearance and behavior.
//                 </DialogDescription>
//               </DialogHeader>
//               <div className='grid gap-6 py-4'>
//                 <div className='grid grid-cols-4 items-center gap-4'>
//                   <Label
//                     htmlFor='materialType'
//                     className='text-right col-span-1 text-slate-300'
//                   >
//                     Material
//                   </Label>
//                   <Select
//                     value={settings.materialType}
//                     onValueChange={(value) =>
//                       setSettings((s) => ({ ...s, materialType: value }))
//                     }
//                   >
//                     <SelectTrigger
//                       id='materialType'
//                       className='col-span-3 bg-slate-700 border-slate-600 focus:ring-purple-500'
//                     >
//                       <SelectValue placeholder='Select material' />
//                     </SelectTrigger>
//                     <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
//                       {[
//                         "auto",
//                         "metallic",
//                         "glass",
//                         "crystal",
//                         "ceramic",
//                         "organic",
//                         "plastic",
//                         "neon",
//                       ].map((type) => (
//                         <SelectItem
//                           key={type}
//                           value={type}
//                           className='capitalize focus:bg-purple-600 focus:text-white'
//                         >
//                           {type}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className='grid grid-cols-4 items-center gap-4'>
//                   <Label
//                     htmlFor='shapeColor'
//                     className='text-right col-span-1 text-slate-300'
//                   >
//                     Color
//                   </Label>
//                   <Input
//                     id='shapeColor'
//                     type='color'
//                     value={settings.shapeColor}
//                     onChange={(e) =>
//                       setSettings((s) => ({ ...s, shapeColor: e.target.value }))
//                     }
//                     className='col-span-3 p-1 h-10 bg-slate-700 border-slate-600 cursor-pointer focus-visible:ring-purple-500'
//                   />
//                 </div>
//                 <div className='grid grid-cols-4 items-center gap-4'>
//                   <Label
//                     htmlFor='animationSpeed'
//                     className='text-right col-span-1 text-slate-300'
//                   >
//                     Anim. Speed
//                   </Label>
//                   <Slider
//                     id='animationSpeed'
//                     min={0.1}
//                     max={3}
//                     step={0.1}
//                     value={[settings.animationSpeed]}
//                     onValueChange={([value]) =>
//                       setSettings((s) => ({ ...s, animationSpeed: value }))
//                     }
//                     className='col-span-3 [&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//                   />
//                   <span className='col-start-2 col-span-3 text-xs text-slate-400 -mt-2'>
//                     {settings.animationSpeed.toFixed(1)}x
//                   </span>
//                 </div>
//                 <div className='grid grid-cols-4 items-center gap-4'>
//                   <Label
//                     htmlFor='lightIntensity'
//                     className='text-right col-span-1 text-slate-300'
//                   >
//                     Light
//                   </Label>
//                   <Slider
//                     id='lightIntensity'
//                     min={0.1}
//                     max={2.5}
//                     step={0.1}
//                     value={[settings.lightIntensity]}
//                     onValueChange={([value]) =>
//                       setSettings((s) => ({ ...s, lightIntensity: value }))
//                     }
//                     className='col-span-3 [&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//                   />
//                   <span className='col-start-2 col-span-3 text-xs text-slate-400 -mt-2'>
//                     {settings.lightIntensity.toFixed(1)}x
//                   </span>
//                 </div>
//                 <div className='grid grid-cols-4 items-center gap-4'>
//                   <Label
//                     htmlFor='extrudeDepth'
//                     className='text-right col-span-1 text-slate-300'
//                   >
//                     Depth (Shapes)
//                   </Label>
//                   <Slider
//                     id='extrudeDepth'
//                     min={0.05}
//                     max={1.5}
//                     step={0.05}
//                     value={[settings.extrudeDepth]}
//                     onValueChange={([value]) =>
//                       setSettings((s) => ({ ...s, extrudeDepth: value }))
//                     }
//                     className='col-span-3 [&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//                   />
//                   <span className='col-start-2 col-span-3 text-xs text-slate-400 -mt-2'>
//                     {settings.extrudeDepth.toFixed(2)}
//                   </span>
//                 </div>
//                 <div className='grid grid-cols-4 items-center gap-4'>
//                   <Label
//                     htmlFor='quality'
//                     className='text-right col-span-1 text-slate-300'
//                   >
//                     Quality (Shapes)
//                   </Label>
//                   <Select
//                     value={settings.quality}
//                     onValueChange={(value) =>
//                       setSettings((s) => ({ ...s, quality: value }))
//                     }
//                   >
//                     <SelectTrigger
//                       id='quality'
//                       className='col-span-3 bg-slate-700 border-slate-600 focus:ring-purple-500'
//                     >
//                       <SelectValue placeholder='Select quality' />
//                     </SelectTrigger>
//                     <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
//                       {["low", "medium", "high"].map((q) => (
//                         <SelectItem
//                           key={q}
//                           value={q}
//                           className='capitalize focus:bg-purple-600 focus:text-white'
//                         >
//                           {q}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className='grid grid-cols-4 items-center gap-4'>
//                   <Label
//                     htmlFor='background'
//                     className='text-right col-span-1 text-slate-300'
//                   >
//                     Background
//                   </Label>
//                   <Select
//                     value={settings.background}
//                     onValueChange={(value) =>
//                       setSettings((s) => ({ ...s, background: value }))
//                     }
//                   >
//                     <SelectTrigger
//                       id='background'
//                       className='col-span-3 bg-slate-700 border-slate-600 focus:ring-purple-500'
//                     >
//                       <SelectValue placeholder='Select background' />
//                     </SelectTrigger>
//                     <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
//                       {Object.entries(backgroundOptions).map(([key, name]) => (
//                         <SelectItem
//                           key={key}
//                           value={key}
//                           className='focus:bg-purple-600 focus:text-white'
//                         >
//                           {name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//               <DialogFooter>
//                 <DialogClose asChild>
//                   <Button
//                     type='button'
//                     variant='outline'
//                     className='border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
//                   >
//                     Close
//                   </Button>
//                 </DialogClose>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//           <footer className='text-center mt-10 sm:mt-16 py-6 border-t border-slate-700/50'>
//             <p className='text-slate-400 text-sm'>
//               © {new Date().getFullYear()} 3D Shape Studio Pro. All rights
//               reserved.
//             </p>
//             <p className='text-xs text-slate-500 mt-1'>
//               An interactive 3D modeling and visualization tool.
//             </p>
//           </footer>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ModelViewer3D;

//place 3 completd lets try add side bar

// import React, { useRef, useEffect, useState, useCallback } from "react";
// import * as THREE from "three";
// import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
// import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
// import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
// import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";
// import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
// import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
// import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
// // --- Phase 3 Imports ---
// import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
// import { TDSLoader } from "three/examples/jsm/loaders/TDSLoader.js";
// // --- End Phase 3 Imports ---

// import {
//   Download,
//   Play,
//   Pause,
//   RotateCcw,
//   Camera,
//   Shuffle,
//   UploadCloud,
//   XCircle,
//   Loader2,
// } from "lucide-react";

// // Shadcn/ui component imports
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Slider } from "@/components/ui/slider";
// import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";
// import { Progress } from "@/components/ui/progress";

// // cn utility
// import { clsx } from "clsx";
// import { twMerge } from "tailwind-merge";

// export function cn(...inputs) {
//   return twMerge(clsx(inputs));
// }

// const saneNumber = (value, defaultValue = 0) => {
//   const num = Number(value);
//   return isNaN(num) || !isFinite(num) ? defaultValue : num;
// };

// // --- Shape Creation Functions ---
// const createCatShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(0), saneNumber(s * 0.8));
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.6),
//     saneNumber(s * 0.8),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(0)
//   );
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.8),
//     saneNumber(-s * 0.6),
//     saneNumber(-s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(0),
//     saneNumber(-s * 0.8)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.8),
//     saneNumber(-s * 0.6),
//     saneNumber(s * 0.8),
//     saneNumber(0)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(s * 0.6),
//     saneNumber(s * 0.8),
//     saneNumber(0),
//     saneNumber(s * 0.8)
//   );
//   const ear1 = new THREE.Path();
//   ear1.moveTo(saneNumber(-s * 0.4), saneNumber(s * 0.6));
//   ear1.lineTo(saneNumber(-s * 0.7), saneNumber(s * 1.2));
//   ear1.lineTo(saneNumber(-s * 0.1), saneNumber(s * 0.9));
//   ear1.closePath();
//   const ear2 = new THREE.Path();
//   ear2.moveTo(saneNumber(s * 0.4), saneNumber(s * 0.6));
//   ear2.lineTo(saneNumber(s * 0.7), saneNumber(s * 1.2));
//   ear2.lineTo(saneNumber(s * 0.1), saneNumber(s * 0.9));
//   ear2.closePath();
//   shape.holes.push(ear1);
//   shape.holes.push(ear2);
//   return shape;
// };
// const createBirdShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(0), saneNumber(s * 0.6));
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.9),
//     saneNumber(-s * 0.2),
//     saneNumber(-s * 0.6),
//     saneNumber(-s * 0.6)
//   );
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.3),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.3),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.6),
//     saneNumber(-s * 0.6)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.9),
//     saneNumber(-s * 0.2),
//     saneNumber(s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(0),
//     saneNumber(s * 0.6)
//   );
//   const wing = new THREE.Path();
//   wing.moveTo(saneNumber(-s * 0.3), saneNumber(s * 0.2));
//   wing.bezierCurveTo(
//     saneNumber(-s * 0.7),
//     saneNumber(s * 0.3),
//     saneNumber(-s * 0.8),
//     saneNumber(0),
//     saneNumber(-s * 0.5),
//     saneNumber(-s * 0.3)
//   );
//   wing.bezierCurveTo(
//     saneNumber(-s * 0.2),
//     saneNumber(-s * 0.1),
//     saneNumber(-s * 0.1),
//     saneNumber(s * 0.1),
//     saneNumber(-s * 0.3),
//     saneNumber(s * 0.2)
//   );
//   shape.holes.push(wing);
//   return shape;
// };
// const createFishShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(-s * 0.8), saneNumber(0));
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.6),
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.2),
//     saneNumber(s * 0.5),
//     saneNumber(s * 0.2),
//     saneNumber(s * 0.3)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.6),
//     saneNumber(s * 0.2),
//     saneNumber(s * 0.8),
//     saneNumber(0),
//     saneNumber(s * 0.8),
//     saneNumber(0)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.6),
//     saneNumber(-s * 0.2),
//     saneNumber(s * 0.2),
//     saneNumber(-s * 0.3),
//     saneNumber(-s * 0.2),
//     saneNumber(-s * 0.5)
//   );
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.6),
//     saneNumber(-s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(0),
//     saneNumber(-s * 0.8),
//     saneNumber(0)
//   );
//   shape.moveTo(saneNumber(s * 0.8), saneNumber(0));
//   shape.lineTo(saneNumber(s * 1.2), saneNumber(s * 0.3));
//   shape.lineTo(saneNumber(s * 1.0), saneNumber(0));
//   shape.lineTo(saneNumber(s * 1.2), saneNumber(-s * 0.3));
//   shape.lineTo(saneNumber(s * 0.8), saneNumber(0));
//   return shape;
// };
// const createSoccerBallShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const r = s * 0.8;
//   for (let i = 0; i < 6; i++) {
//     const a = (i / 6) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * r);
//     const y = saneNumber(Math.sin(a) * r);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.closePath();
//   const ih = new THREE.Path();
//   const ir = s * 0.4;
//   for (let i = 0; i < 6; i++) {
//     const a = (i / 6) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * ir);
//     const y = saneNumber(Math.sin(a) * ir);
//     if (i === 0) ih.moveTo(x, y);
//     else ih.lineTo(x, y);
//   }
//   ih.closePath();
//   shape.holes.push(ih);
//   return shape;
// };
// const createTennisRacketShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const a = s * 0.6;
//   const b = s * 0.4;
//   for (let i = 0; i <= 32; i++) {
//     const ang = (i / 32) * Math.PI * 2;
//     const x = saneNumber(Math.cos(ang) * a);
//     const y = saneNumber(Math.sin(ang) * b + s * 0.3);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.lineTo(saneNumber(s * 0.1), saneNumber(-s * 0.8));
//   shape.lineTo(saneNumber(-s * 0.1), saneNumber(-s * 0.8));
//   shape.closePath();
//   return shape;
// };
// const createBasketballShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const r = s * 0.8;
//   for (let i = 0; i <= 32; i++) {
//     const a = (i / 32) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * r);
//     const y = saneNumber(Math.sin(a) * r);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.closePath();
//   return shape;
// };
// const createPersonShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const hr = s * 0.2;
//   for (let i = 0; i <= 16; i++) {
//     const a = (i / 16) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * hr);
//     const y = saneNumber(Math.sin(a) * hr + s * 0.6);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.lineTo(saneNumber(-s * 0.3), saneNumber(s * 0.2));
//   shape.lineTo(saneNumber(-s * 0.4), saneNumber(-s * 0.4));
//   shape.lineTo(saneNumber(-s * 0.2), saneNumber(-s * 0.8));
//   shape.lineTo(saneNumber(s * 0.2), saneNumber(-s * 0.8));
//   shape.lineTo(saneNumber(s * 0.4), saneNumber(-s * 0.4));
//   shape.lineTo(saneNumber(s * 0.3), saneNumber(s * 0.2));
//   shape.closePath();
//   return shape;
// };
// const createRobotShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(-sval * 0.4), saneNumber(sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.4), saneNumber(sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.4), saneNumber(sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.4), saneNumber(sval * 0.4));
//   shape.closePath();
//   shape.moveTo(saneNumber(-sval * 0.5), saneNumber(sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.5), saneNumber(sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.5), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.5), saneNumber(-sval * 0.4));
//   shape.closePath();
//   shape.moveTo(saneNumber(-sval * 0.3), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.1), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.1), saneNumber(-sval * 0.8));
//   shape.lineTo(saneNumber(-sval * 0.3), saneNumber(-sval * 0.8));
//   shape.closePath();
//   shape.moveTo(saneNumber(sval * 0.1), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.3), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.3), saneNumber(-sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.1), saneNumber(-sval * 0.8));
//   shape.closePath();
//   return shape;
// };
// const createPhoneShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const w = sval * 0.5;
//   const h = sval * 1.0;
//   const r = sval * 0.1;
//   shape.moveTo(saneNumber(-w + r), saneNumber(h));
//   shape.lineTo(saneNumber(w - r), saneNumber(h));
//   shape.quadraticCurveTo(
//     saneNumber(w),
//     saneNumber(h),
//     saneNumber(w),
//     saneNumber(h - r)
//   );
//   shape.lineTo(saneNumber(w), saneNumber(-h + r));
//   shape.quadraticCurveTo(
//     saneNumber(w),
//     saneNumber(-h),
//     saneNumber(w - r),
//     saneNumber(-h)
//   );
//   shape.lineTo(saneNumber(-w + r), saneNumber(-h));
//   shape.quadraticCurveTo(
//     saneNumber(-w),
//     saneNumber(-h),
//     saneNumber(-w),
//     saneNumber(-h + r)
//   );
//   shape.lineTo(saneNumber(-w), saneNumber(h - r));
//   shape.quadraticCurveTo(
//     saneNumber(-w),
//     saneNumber(h),
//     saneNumber(-w + r),
//     saneNumber(h)
//   );
//   shape.closePath();
//   const screen = new THREE.Path();
//   const sw = w * 0.8;
//   const sh = h * 0.8;
//   const sr = r * 0.5;
//   screen.moveTo(saneNumber(-sw + sr), saneNumber(sh));
//   screen.lineTo(saneNumber(sw - sr), saneNumber(sh));
//   screen.quadraticCurveTo(
//     saneNumber(sw),
//     saneNumber(sh),
//     saneNumber(sw),
//     saneNumber(sh - sr)
//   );
//   screen.lineTo(saneNumber(sw), saneNumber(-sh + sr));
//   screen.quadraticCurveTo(
//     saneNumber(sw),
//     saneNumber(-sh),
//     saneNumber(sw - sr),
//     saneNumber(-sh)
//   );
//   screen.lineTo(saneNumber(-sw + sr), saneNumber(-sh));
//   screen.quadraticCurveTo(
//     saneNumber(-sw),
//     saneNumber(-sh),
//     saneNumber(-sw),
//     saneNumber(-sh + sr)
//   );
//   screen.lineTo(saneNumber(-sw), saneNumber(sh - sr));
//   screen.quadraticCurveTo(
//     saneNumber(-sw),
//     saneNumber(sh),
//     saneNumber(-sw + sr),
//     saneNumber(sh)
//   );
//   screen.closePath();
//   shape.holes.push(screen);
//   return shape;
// };
// const createLightningShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(-sval * 0.2), saneNumber(sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.3), saneNumber(sval * 0.2));
//   shape.lineTo(saneNumber(sval * 0.1), saneNumber(sval * 0.2));
//   shape.lineTo(saneNumber(sval * 0.4), saneNumber(-sval * 0.8));
//   shape.lineTo(saneNumber(-sval * 0.1), saneNumber(-sval * 0.2));
//   shape.lineTo(saneNumber(sval * 0.1), saneNumber(-sval * 0.2));
//   shape.lineTo(saneNumber(-sval * 0.4), saneNumber(sval * 0.8));
//   shape.closePath();
//   return shape;
// };
// const createMusicNoteShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const nr = sval * 0.15;
//   for (let i = 0; i <= 16; i++) {
//     const a = (i / 16) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * nr - sval * 0.2);
//     const y = saneNumber(Math.sin(a) * nr - sval * 0.4);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.lineTo(saneNumber(-sval * 0.05), saneNumber(sval * 0.6));
//   shape.lineTo(saneNumber(sval * 0.05), saneNumber(sval * 0.6));
//   shape.lineTo(saneNumber(sval * 0.05), saneNumber(-sval * 0.25));
//   shape.closePath();
//   shape.moveTo(saneNumber(sval * 0.05), saneNumber(sval * 0.6));
//   shape.bezierCurveTo(
//     saneNumber(sval * 0.4),
//     saneNumber(sval * 0.5),
//     saneNumber(sval * 0.3),
//     saneNumber(sval * 0.2),
//     saneNumber(sval * 0.05),
//     saneNumber(sval * 0.3)
//   );
//   shape.closePath();
//   return shape;
// };

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
// const createAdvancedMaterial = (baseColor, materialType = "standard") => {
//   const color = new THREE.Color(baseColor);
//   const materialPresets = {
//     metallic: { metalness: 0.9, roughness: 0.1, envMapIntensity: 1.5 },
//     glass: {
//       metalness: 0.0,
//       roughness: 0.0,
//       transmission: 0.95,
//       thickness: 0.7,
//       transparent: true,
//       opacity: 0.85,
//       envMapIntensity: 2.0,
//       ior: 1.52,
//     },
//     crystal: {
//       metalness: 0.0,
//       roughness: 0.01,
//       transmission: 0.98,
//       thickness: 0.6,
//       transparent: true,
//       opacity: 0.9,
//       envMapIntensity: 2.5,
//       ior: 1.7,
//     },
//     ceramic: { metalness: 0.1, roughness: 0.6, envMapIntensity: 0.8 },
//     organic: { metalness: 0.0, roughness: 0.8, envMapIntensity: 0.5 },
//     plastic: { metalness: 0.0, roughness: 0.3, envMapIntensity: 0.7 },
//     neon: {
//       metalness: 0.0,
//       roughness: 0.1,
//       emissive: color.clone().multiplyScalar(0.8),
//       emissiveIntensity: 1.0,
//       envMapIntensity: 0.2,
//     },
//   };
//   const preset = materialPresets[materialType] || materialPresets.ceramic;
//   const sharedProps = { color, ...preset, side: THREE.DoubleSide };
//   if (materialType === "glass" || materialType === "crystal")
//     return new THREE.MeshPhysicalMaterial(sharedProps);
//   return new THREE.MeshStandardMaterial(sharedProps);
// };
// const create3DShape = (shapeId, currentSettings, size = 1) => {
//   let shape;
//   let materialType =
//     currentSettings.materialType === "auto"
//       ? "ceramic"
//       : currentSettings.materialType;
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
//   const config = shapeConfigs[shapeId] || shapeConfigs.cat;
//   const shapeSize = saneNumber(size, 1.5);
//   shape = config.creator(shapeSize);
//   if (currentSettings.materialType === "auto")
//     materialType = config.autoMaterial;
//   const extrudeSettings = {
//     depth: saneNumber(currentSettings.extrudeDepth, 0.4),
//     bevelEnabled: true,
//     bevelSegments:
//       currentSettings.quality === "high"
//         ? 10
//         : currentSettings.quality === "medium"
//         ? 6
//         : 3,
//     steps:
//       currentSettings.quality === "high"
//         ? 5
//         : currentSettings.quality === "medium"
//         ? 3
//         : 1,
//     bevelSize: saneNumber(0.035 * (shapeSize / 1.5), 0.02),
//     bevelThickness: saneNumber(0.025 * (shapeSize / 1.5), 0.015),
//     curveSegments:
//       currentSettings.quality === "high"
//         ? 48
//         : currentSettings.quality === "medium"
//         ? 24
//         : 12,
//   };
//   const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
//   geometry.computeVertexNormals();
//   try {
//     geometry.center();
//   } catch (e) {
//     console.error(
//       "Error centering geometry:",
//       e,
//       shapeId,
//       currentSettings,
//       shape
//     );
//     return new THREE.Mesh(
//       new THREE.BoxGeometry(1, 1, 1),
//       new THREE.MeshStandardMaterial({ color: 0xff0000 })
//     );
//   }
//   const material = createAdvancedMaterial(
//     currentSettings.shapeColor,
//     materialType
//   );
//   return new THREE.Mesh(geometry, material);
// };

// const CATEGORIES_DATA = [
//   { id: "animals", name: "Animals", icon: "🐱" },
//   { id: "sports", name: "Sports", icon: "⚽" },
//   { id: "people", name: "People", icon: "👤" },
//   { id: "objects", name: "Objects", icon: "📱" },
// ];
// const SHAPES_BY_CATEGORY_DATA = {
//   animals: [
//     { id: "cat", name: "Cat", icon: "🐱" },
//     { id: "bird", name: "Bird", icon: "🐦" },
//     { id: "fish", name: "Fish", icon: "🐟" },
//   ],
//   sports: [
//     { id: "soccer", name: "Soccer", icon: "⚽" },
//     { id: "tennis", name: "Tennis", icon: "🎾" },
//     { id: "basketball", name: "Basketball", icon: "🏀" },
//   ],
//   people: [
//     { id: "person", name: "Person", icon: "👤" },
//     { id: "robot", name: "Robot", icon: "🤖" },
//   ],
//   objects: [
//     { id: "phone", name: "Phone", icon: "📱" },
//     { id: "lightning", name: "Lightning", icon: "⚡" },
//     { id: "music", name: "Music Note", icon: "🎵" },
//   ],
// };
// const BACKGROUND_OPTIONS_DATA = {
//   modernGradient: "Modern Gradient",
//   darkSpace: "Dark Space",
//   softLight: "Soft Light",
//   studioDark: "Studio Dark",
//   studioLight: "Studio Light",
// };

// let gltfLoaderInstance;
// const getGltfLoader = () => {
//   if (!gltfLoaderInstance) {
//     gltfLoaderInstance = new GLTFLoader();
//     const dracoLoader = new DRACOLoader();
//     dracoLoader.setDecoderPath("/draco/gltf/");
//     gltfLoaderInstance.setDRACOLoader(dracoLoader);
//   }
//   return gltfLoaderInstance;
// };

// const ModelViewer3D = () => {
//   const [isMounted, setIsMounted] = useState(false);
//   const mountRef = useRef(null);
//   const sceneRef = useRef(null);
//   const rendererRef = useRef(null);
//   const cameraRef = useRef(null);
//   const controlsRef = useRef(null);
//   const composerRef = useRef(null);
//   const ssaoPassRef = useRef(null);
//   const meshRef = useRef(null);
//   const animationIdRef = useRef(null);
//   const lightsRef = useRef([]);
//   const skyboxMeshRef = useRef(null);
//   const envMapTextureRef = useRef(null);
//   const fileInputRef = useRef(null);

//   const [importedModel, setImportedModel] = useState(null);
//   const [isImportedModelDisplayed, setIsImportedModelDisplayed] =
//     useState(false);
//   const [importedModelName, setImportedModelName] = useState("Imported Model");

//   const [currentCategory, setCurrentCategory] = useState(CATEGORIES_DATA[0].id);
//   const [currentShape, setCurrentShape] = useState(
//     SHAPES_BY_CATEGORY_DATA[CATEGORIES_DATA[0].id][0].id
//   );

//   const categories = CATEGORIES_DATA;
//   const shapesByCategory = SHAPES_BY_CATEGORY_DATA;
//   const backgroundOptions = BACKGROUND_OPTIONS_DATA;

//   const [isAnimating, setIsAnimating] = useState(true);
//   const [animationPreset, setAnimationPreset] = useState("gentle");
//   const [isExporting, setIsExporting] = useState(false);
//   const [exportProgress, setExportProgress] = useState(0);
//   const [settings, setSettings] = useState({
//     materialType: "auto",
//     shapeColor: "#a78bfa",
//     animationSpeed: 1.0,
//     lightIntensity: 1.0,
//     extrudeDepth: 0.4,
//     quality: "medium",
//     background: "studioDark",
//   });

//   const currentSettingsRef = useRef(settings);
//   useEffect(() => {
//     currentSettingsRef.current = settings;
//   }, [settings]);

//   const animationState = useRef({
//     rotation: new THREE.Euler(),
//     targetRotation: new THREE.Euler(),
//     floatY: 0,
//     startTime: Date.now(),
//   });
//   const isAnimatingRef = useRef(isAnimating);
//   const animationPresetRef = useRef(animationPreset);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);
//   useEffect(() => {
//     isAnimatingRef.current = isAnimating;
//   }, [isAnimating]);
//   useEffect(() => {
//     animationPresetRef.current = animationPreset;
//   }, [animationPreset]);

//   useEffect(() => {
//     if (!isMounted || !mountRef.current) return;
//     const currentMount = mountRef.current;
//     const scene = new THREE.Scene();
//     sceneRef.current = scene;
//     const camera = new THREE.PerspectiveCamera(
//       50,
//       currentMount.clientWidth / currentMount.clientHeight,
//       0.1,
//       1000
//     );
//     cameraRef.current = camera;
//     camera.position.set(0, 0.5, 6);
//     const renderer = new THREE.WebGLRenderer({
//       antialias: true,
//       alpha: true,
//       preserveDrawingBuffer: true,
//     });
//     rendererRef.current = renderer;
//     renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.shadowMap.enabled = true;
//     renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//     renderer.outputColorSpace = THREE.SRGBColorSpace;
//     renderer.toneMapping = THREE.ACESFilmicToneMapping;
//     renderer.toneMappingExposure = 1.0;
//     currentMount.appendChild(renderer.domElement);

//     const controls = new OrbitControls(camera, renderer.domElement);
//     controlsRef.current = controls;
//     controls.enableDamping = true;
//     controls.dampingFactor = 0.05;
//     controls.screenSpacePanning = false;
//     controls.minDistance = 1;
//     controls.maxDistance = 30;
//     controls.maxPolarAngle = Math.PI / 1.6;
//     controls.target.set(0, 0.2, 0);

//     const rgbeLoader = new RGBELoader();
//     rgbeLoader.load(
//       "/brown_photostudio_02_4k.hdr",
//       (texture) => {
//         texture.mapping = THREE.EquirectangularReflectionMapping;
//         if (sceneRef.current) {
//           sceneRef.current.environment = texture;
//           envMapTextureRef.current = texture;
//         }
//       },
//       undefined,
//       (error) => {
//         console.error("Error loading HDR:", error);
//         sonnerToast.error("HDR Load Failed", {
//           description: "Studio lighting map failed.",
//         });
//       }
//     );

//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
//     scene.add(ambientLight);
//     const keyLight = new THREE.DirectionalLight(0xffffff, 0.7);
//     keyLight.position.set(5, 8, 5);
//     keyLight.castShadow = true;
//     keyLight.shadow.mapSize.width = 2048;
//     keyLight.shadow.mapSize.height = 2048;
//     keyLight.shadow.camera.near = 0.5;
//     keyLight.shadow.camera.far = 50;
//     keyLight.shadow.bias = -0.0005;
//     scene.add(keyLight);
//     const fillLight = new THREE.DirectionalLight(0xa0c0ff, 0.4);
//     fillLight.position.set(-5, 3, -3);
//     scene.add(fillLight);
//     lightsRef.current = [ambientLight, keyLight, fillLight];

//     const composer = new EffectComposer(renderer);
//     composerRef.current = composer;
//     const renderPass = new RenderPass(scene, camera);
//     composer.addPass(renderPass);
//     const ssaoPassInstance = new SSAOPass(
//       scene,
//       camera,
//       currentMount.clientWidth,
//       currentMount.clientHeight
//     );
//     ssaoPassInstance.kernelRadius = 0.6;
//     ssaoPassInstance.minDistance = 0.001;
//     ssaoPassInstance.maxDistance = 0.03;
//     composer.addPass(ssaoPassInstance);
//     ssaoPassRef.current = ssaoPassInstance;
//     const outputPass = new OutputPass();
//     composer.addPass(outputPass);

//     const handleResize = () => {
//       if (!currentMount || !cameraRef.current || !rendererRef.current) return;
//       const width = currentMount.clientWidth;
//       const height = currentMount.clientHeight;
//       cameraRef.current.aspect = width / height;
//       cameraRef.current.updateProjectionMatrix();
//       rendererRef.current.setSize(width, height);
//       if (composerRef.current) {
//         composerRef.current.setSize(width, height);
//         const sPass = composerRef.current.passes.find(
//           (p) => p instanceof SSAOPass
//         );
//         if (sPass) sPass.setSize(width, height);
//       }
//     };
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     const clock = new THREE.Clock();
//     const animate = () => {
//       animationIdRef.current = requestAnimationFrame(animate);
//       if (
//         !sceneRef.current ||
//         !rendererRef.current ||
//         !cameraRef.current ||
//         !isMounted
//       ) {
//         if (animationIdRef.current)
//           cancelAnimationFrame(animationIdRef.current);
//         return;
//       }
//       const delta = clock.getDelta();
//       if (controlsRef.current) controlsRef.current.update();
//       if (meshRef.current && isAnimatingRef.current) {
//         const animSettings = currentSettingsRef.current;
//         const presetKey = animationPresetRef.current;
//         const preset = animationPresets[presetKey];
//         if (preset) {
//           const effDelta = delta * animSettings.animationSpeed;
//           animationState.current.targetRotation.x +=
//             preset.rotationSpeed[0] * 60 * effDelta;
//           animationState.current.targetRotation.y +=
//             preset.rotationSpeed[1] * 60 * effDelta;
//           animationState.current.targetRotation.z +=
//             preset.rotationSpeed[2] * 60 * effDelta;
//           meshRef.current.rotation.x = THREE.MathUtils.lerp(
//             meshRef.current.rotation.x,
//             animationState.current.targetRotation.x,
//             0.1
//           );
//           meshRef.current.rotation.y = THREE.MathUtils.lerp(
//             meshRef.current.rotation.y,
//             animationState.current.targetRotation.y,
//             0.1
//           );
//           meshRef.current.rotation.z = THREE.MathUtils.lerp(
//             meshRef.current.rotation.z,
//             animationState.current.targetRotation.z,
//             0.1
//           );
//           const floatTime =
//             (Date.now() - animationState.current.startTime) *
//             0.001 *
//             animSettings.animationSpeed;
//           animationState.current.floatY =
//             Math.sin(floatTime * (preset.floatSpeed || 0.0001) * 100) *
//             (preset.floatAmplitude || 0);
//           meshRef.current.position.y = animationState.current.floatY;
//         }
//       }
//       if (composerRef.current) composerRef.current.render(delta);
//       else if (rendererRef.current)
//         rendererRef.current.render(sceneRef.current, cameraRef.current);
//     };
//     animate();
//     return () => {
//       window.removeEventListener("resize", handleResize);
//       if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
//       controlsRef.current?.dispose();
//       envMapTextureRef.current?.dispose();
//       if (skyboxMeshRef.current) {
//         sceneRef.current?.remove(skyboxMeshRef.current);
//         skyboxMeshRef.current.geometry?.dispose();
//         skyboxMeshRef.current.material?.dispose();
//       }
//       if (meshRef.current) {
//         sceneRef.current?.remove(meshRef.current);
//         meshRef.current.traverse((obj) => {
//           if (obj.geometry) obj.geometry.dispose();
//           if (obj.material) {
//             if (Array.isArray(obj.material))
//               obj.material.forEach((m) => m.dispose());
//             else obj.material.dispose();
//           }
//         });
//       }
//       composerRef.current?.passes.forEach((pass) => pass.dispose?.());
//       ssaoPassRef.current?.dispose?.();
//       sceneRef.current?.traverse((obj) => {
//         if (obj.isLight && obj.shadow && obj.shadow.map)
//           obj.shadow.map.dispose();
//         if (obj.geometry) obj.geometry.dispose();
//         if (obj.material) {
//           const materials = Array.isArray(obj.material)
//             ? obj.material
//             : [obj.material];
//           materials.forEach((mat) => {
//             Object.values(mat).forEach((val) => {
//               if (val instanceof THREE.Texture) val.dispose();
//             });
//             mat.dispose();
//           });
//         }
//       });
//       if (rendererRef.current) {
//         rendererRef.current.dispose();
//         if (mountRef.current && rendererRef.current.domElement) {
//           try {
//             mountRef.current.removeChild(rendererRef.current.domElement);
//           } catch (e) {}
//         }
//       }
//       sceneRef.current = null;
//       cameraRef.current = null;
//       rendererRef.current = null;
//       controlsRef.current = null;
//       composerRef.current = null;
//       ssaoPassRef.current = null;
//       meshRef.current = null;
//       envMapTextureRef.current = null;
//       skyboxMeshRef.current = null;
//       lightsRef.current = [];
//     };
//   }, [isMounted]);

//   useEffect(() => {
//     if (!isMounted || !sceneRef.current || !rendererRef.current) return;
//     if (skyboxMeshRef.current) {
//       sceneRef.current.remove(skyboxMeshRef.current);
//       skyboxMeshRef.current.geometry?.dispose();
//       skyboxMeshRef.current.material?.dispose();
//       skyboxMeshRef.current = null;
//     }
//     sceneRef.current.background = null;
//     sceneRef.current.fog = null;
//     rendererRef.current.toneMappingExposure = 1.0;
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
//         sceneRef.current.background = new THREE.Color(0x0a0a10);
//         fogC = new THREE.Color(0x050508);
//         fogNear = 10;
//         fogFar = 35;
//         break;
//       case "softLight":
//         sceneRef.current.background = new THREE.Color(0xe0e8f0);
//         fogC = new THREE.Color(0xd0d8e0);
//         fogNear = 7;
//         fogFar = 28;
//         if (rendererRef.current) rendererRef.current.toneMappingExposure = 0.9;
//         break;
//       case "studioDark":
//         sceneRef.current.background = new THREE.Color(0x18181b);
//         fogC = new THREE.Color(0x101012);
//         fogNear = 12;
//         fogFar = 40;
//         break;
//       case "studioLight":
//         sceneRef.current.background = new THREE.Color(0xf4f4f5);
//         fogC = new THREE.Color(0xe4e4e7);
//         fogNear = 10;
//         fogFar = 35;
//         if (rendererRef.current) rendererRef.current.toneMappingExposure = 0.85;
//         break;
//       default:
//         sceneRef.current.background = new THREE.Color(0x18181b);
//         fogC = new THREE.Color(0x101012);
//     }
//     if (settings.background === "modernGradient" && topC && bottomC) {
//       const gradGeom = new THREE.SphereGeometry(50, 32, 32);
//       const gradMat = new THREE.ShaderMaterial({
//         uniforms: {
//           topColor: { value: topC },
//           bottomColor: { value: bottomC },
//           offset: { value: 33 },
//           exponent: { value: 0.6 },
//         },
//         vertexShader: `varying vec3 vWorldPosition; void main() { vec4 worldPosition = modelMatrix * vec4(position, 1.0); vWorldPosition = worldPosition.xyz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
//         fragmentShader: `uniform vec3 topColor; uniform vec3 bottomColor; uniform float offset; uniform float exponent; varying vec3 vWorldPosition; void main() { float h = normalize(vWorldPosition + offset).y; gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0); }`,
//         side: THREE.BackSide,
//       });
//       skyboxMeshRef.current = new THREE.Mesh(gradGeom, gradMat);
//       sceneRef.current.add(skyboxMeshRef.current);
//     }
//     if (fogC) sceneRef.current.fog = new THREE.Fog(fogC, fogNear, fogFar);
//   }, [settings.background, isMounted]);

//   useEffect(() => {
//     if (!isMounted || !lightsRef.current || lightsRef.current.length < 3)
//       return;
//     const baseIntensities = [0.25, 0.7, 0.4];
//     lightsRef.current.forEach((light, index) => {
//       if (
//         light &&
//         light.intensity !== undefined &&
//         baseIntensities[index] !== undefined
//       ) {
//         light.intensity = baseIntensities[index] * settings.lightIntensity;
//       }
//     });
//   }, [settings.lightIntensity, isMounted]);

//   const {
//     extrudeDepth,
//     quality,
//     shapeColor,
//     materialType: procMaterialType,
//   } = settings;
//   useEffect(() => {
//     if (!isMounted || !sceneRef.current) return;
//     if (meshRef.current) {
//       sceneRef.current.remove(meshRef.current);
//       meshRef.current.traverse((obj) => {
//         if (obj.geometry) obj.geometry.dispose();
//         if (obj.material) {
//           if (Array.isArray(obj.material))
//             obj.material.forEach((m) => m.dispose());
//           else obj.material.dispose();
//         }
//       });
//       meshRef.current = null;
//     }
//     let newMesh;
//     if (isImportedModelDisplayed && importedModel && importedModel.scene) {
//       newMesh = importedModel.scene.clone(true);
//       const box = new THREE.Box3().setFromObject(newMesh);
//       const sizeVec = box.getSize(new THREE.Vector3());
//       const maxDim = Math.max(
//         saneNumber(sizeVec.x, 1),
//         saneNumber(sizeVec.y, 1),
//         saneNumber(sizeVec.z, 1)
//       );
//       const desiredDisplaySize = 3;
//       const scaleFactor = maxDim > 0 ? desiredDisplaySize / maxDim : 1;
//       newMesh.scale.set(
//         saneNumber(scaleFactor, 1),
//         saneNumber(scaleFactor, 1),
//         saneNumber(scaleFactor, 1)
//       );
//       const scaledBox = new THREE.Box3().setFromObject(newMesh);
//       const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
//       if (
//         !isNaN(scaledCenter.x) &&
//         !isNaN(scaledCenter.y) &&
//         !isNaN(scaledCenter.z)
//       ) {
//         newMesh.position.sub(scaledCenter);
//       } else {
//         console.warn("Imported model center NaN");
//         sonnerToast.warning("Centering Issue");
//         newMesh.position.set(0, 0, 0);
//       }
//       newMesh.traverse((child) => {
//         if (child.isMesh) {
//           child.castShadow = true;
//           child.receiveShadow = true;
//           if (child.material) {
//             if (Array.isArray(child.material)) {
//               child.material.forEach((m) => (m.side = THREE.DoubleSide));
//             } else {
//               child.material.side = THREE.DoubleSide;
//             }
//           }
//         }
//       });
//     } else {
//       const proceduralSettings = {
//         extrudeDepth,
//         quality,
//         shapeColor,
//         materialType: procMaterialType,
//       };
//       newMesh = create3DShape(currentShape, proceduralSettings, 1.5);
//       newMesh.castShadow = true;
//       newMesh.receiveShadow = true;
//     }
//     newMesh.position.y = 0;
//     animationState.current.floatY = 0;
//     animationState.current.targetRotation.set(0, 0, 0);
//     newMesh.rotation.set(0, 0, 0);
//     sceneRef.current.add(newMesh);
//     meshRef.current = newMesh;
//   }, [
//     currentShape,
//     extrudeDepth,
//     quality,
//     shapeColor,
//     procMaterialType,
//     isMounted,
//     importedModel,
//     isImportedModelDisplayed,
//   ]);

//   const handleResetAnimation = useCallback(() => {
//     animationState.current.targetRotation.set(0, 0, 0);
//     animationState.current.floatY = 0;
//     animationState.current.startTime = Date.now();
//     if (meshRef.current) {
//       meshRef.current.rotation.set(0, 0, 0);
//       meshRef.current.position.y = 0;
//     }
//     if (controlsRef.current) {
//       controlsRef.current.reset();
//       controlsRef.current.target.set(0, 0.2, 0);
//     }
//     sonnerToast.info("Animation Reset", {
//       description: "Model position and rotation restored.",
//     });
//   }, []);

//   const handleToggleAnimation = useCallback(() => {
//     setIsAnimating((prev) => {
//       const newIsAnimating = !prev;
//       if (newIsAnimating) {
//         const preset = animationPresets[animationPresetRef.current];
//         const floatAmplitude = preset?.floatAmplitude || 0.1;
//         const floatSpeed = preset?.floatSpeed || 0.001;
//         const timeDivisor = floatAmplitude * (floatSpeed * 100);
//         const timeOffset =
//           timeDivisor !== 0
//             ? (animationState.current.floatY / timeDivisor) * 1000
//             : 0;
//         animationState.current.startTime =
//           Date.now() - (isFinite(timeOffset) ? timeOffset : 0);
//       } else {
//         if (meshRef.current)
//           animationState.current.targetRotation.copy(meshRef.current.rotation);
//       }
//       sonnerToast.info(`Animation ${newIsAnimating ? "Resumed" : "Paused"}`);
//       return newIsAnimating;
//     });
//   }, []);

//   const handleCategorySelect = useCallback(
//     (categoryId) => {
//       setIsImportedModelDisplayed(false);
//       setCurrentCategory(categoryId);
//       setCurrentShape(shapesByCategory[categoryId][0].id);
//       handleResetAnimation();
//     },
//     [shapesByCategory, handleResetAnimation]
//   );

//   const handleShapeSelect = useCallback(
//     (shapeId) => {
//       setIsImportedModelDisplayed(false);
//       setCurrentShape(shapeId);
//       handleResetAnimation();
//     },
//     [handleResetAnimation]
//   );

//   useEffect(() => {
//     if (isMounted) handleResetAnimation();
//   }, [animationPreset, isMounted, handleResetAnimation]);

//   const handleRandomize = useCallback(() => {
//     setIsImportedModelDisplayed(false);
//     const randCat = categories[Math.floor(Math.random() * categories.length)];
//     const randShapeList = shapesByCategory[randCat.id];
//     const randShape =
//       randShapeList[Math.floor(Math.random() * randShapeList.length)];
//     const randPresetKey =
//       Object.keys(animationPresets)[
//         Math.floor(Math.random() * Object.keys(animationPresets).length)
//       ];
//     const randColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`;
//     const bgKeys = Object.keys(backgroundOptions);
//     const randBgKey = bgKeys[Math.floor(Math.random() * bgKeys.length)];
//     const matKeys = [
//       "auto",
//       "metallic",
//       "glass",
//       "crystal",
//       "ceramic",
//       "organic",
//       "plastic",
//       "neon",
//     ];
//     const randMat = matKeys[Math.floor(Math.random() * matKeys.length)];
//     setCurrentCategory(randCat.id);
//     setCurrentShape(randShape.id);
//     setAnimationPreset(randPresetKey);
//     setSettings((prev) => ({
//       ...prev,
//       materialType: randMat,
//       shapeColor: randColor,
//       background: randBgKey,
//       extrudeDepth: saneNumber(Math.random() * (1.0 - 0.1) + 0.1, 0.4),
//       lightIntensity: saneNumber(Math.random() * (1.8 - 0.6) + 0.6, 1.0),
//       animationSpeed: saneNumber(Math.random() * (2.0 - 0.5) + 0.5, 1.0),
//     }));
//     sonnerToast.success("Scene Randomized!", {
//       description: "Enjoy the new look.",
//     });
//   }, [categories, shapesByCategory, backgroundOptions, handleResetAnimation]);

//   const currentShapeRef = useRef(currentShape);
//   useEffect(() => {
//     currentShapeRef.current = currentShape;
//   }, [currentShape]);
//   const currentImportedModelNameRef = useRef(importedModelName);
//   useEffect(() => {
//     currentImportedModelNameRef.current = importedModelName;
//   }, [importedModelName]);

//   const handleExportGLB = useCallback(() => {
//     if (!meshRef.current || isExporting) return;
//     setIsExporting(true);
//     setExportProgress(0);
//     const exportToastId = sonnerToast.loading("Exporting GLB...", {
//       description: "Preparing model...",
//     });
//     const exporter = new GLTFExporter();
//     let progress = 0;
//     const progInterval = setInterval(() => {
//       progress += Math.floor(Math.random() * 10 + 5);
//       const curProg = Math.min(progress, 95);
//       setExportProgress(curProg);
//       sonnerToast.loading("Exporting GLB...", {
//         id: exportToastId,
//         description: `Processing... ${curProg}%`,
//       });
//       if (curProg >= 95) clearInterval(progInterval);
//     }, 150);
//     setTimeout(() => {
//       try {
//         if (!(meshRef.current instanceof THREE.Object3D))
//           throw new Error("Model not valid for export.");
//         const exportOptions = { binary: true };
//         if (isImportedModelDisplayed && importedModel?.animations?.length > 0)
//           exportOptions.animations = importedModel.animations;
//         exporter.parse(
//           meshRef.current,
//           (gltf) => {
//             clearInterval(progInterval);
//             setExportProgress(100);
//             sonnerToast.success("GLB Export Ready", {
//               id: exportToastId,
//               description: "Download starting.",
//             });
//             if (!(gltf instanceof ArrayBuffer))
//               throw new Error("Exported GLTF not ArrayBuffer.");
//             const blob = new Blob([gltf], { type: "application/octet-stream" });
//             const link = document.createElement("a");
//             link.href = URL.createObjectURL(blob);
//             const fileNameToExport = isImportedModelDisplayed
//               ? currentImportedModelNameRef.current || "imported-model"
//               : currentShapeRef.current || "model";
//             link.download = `shape-${fileNameToExport}.glb`;
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             URL.revokeObjectURL(link.href);
//             setTimeout(() => {
//               setIsExporting(false);
//               setExportProgress(0);
//             }, 500);
//           },
//           (error) => {
//             clearInterval(progInterval);
//             console.error("GLTFExporter.parse error:", error);
//             sonnerToast.error("GLB Export Failed", {
//               id: exportToastId,
//               description: error.message || "GLTF parsing error.",
//             });
//             setIsExporting(false);
//             setExportProgress(0);
//           },
//           exportOptions
//         );
//       } catch (e) {
//         clearInterval(progInterval);
//         console.error("GLTF export setup error:", e);
//         sonnerToast.error("GLB Export Failed", {
//           id: exportToastId,
//           description: e.message || "Unexpected error.",
//         });
//         setIsExporting(false);
//         setExportProgress(0);
//       }
//     }, 100);
//   }, [isExporting, meshRef, isImportedModelDisplayed, importedModel]);

//   const handleSimulatedExportOBJ = useCallback(() => {
//     if (isExporting) return;
//     setIsExporting(true);
//     setExportProgress(0);
//     const exportToastId = sonnerToast.loading("Exporting OBJ (Simulated)...", {
//       description: "Processing...",
//     });
//     let p = 0;
//     const i = setInterval(() => {
//       p += Math.floor(Math.random() * 15 + 10);
//       const currentProgress = Math.min(p, 100);
//       setExportProgress(currentProgress);
//       sonnerToast.loading("Exporting OBJ (Simulated)...", {
//         id: exportToastId,
//         description: `Processing... ${currentProgress}%`,
//       });
//       if (currentProgress >= 100) {
//         clearInterval(i);
//         const l = document.createElement("a");
//         l.download = `shape-${
//           isImportedModelDisplayed
//             ? currentImportedModelNameRef.current
//             : currentShapeRef.current || "model"
//         }.obj`;
//         l.href =
//           "data:text/plain;charset=utf-8," +
//           encodeURIComponent(
//             "# OBJ file simulated\n# Actual OBJ Exporter Needed"
//           );
//         document.body.appendChild(l);
//         l.click();
//         document.body.removeChild(l);
//         sonnerToast.success("OBJ Export (Simulated) Ready", {
//           id: exportToastId,
//           description: "Simulated OBJ downloaded.",
//         });
//         setTimeout(() => {
//           setIsExporting(false);
//           setExportProgress(0);
//         }, 500);
//       }
//     }, 150);
//   }, [isExporting, isImportedModelDisplayed]);

//   const handleTakeScreenshot = useCallback(() => {
//     if (!rendererRef.current || !sceneRef.current || !cameraRef.current) {
//       sonnerToast.error("Screenshot Failed", {
//         description: "Renderer not ready.",
//       });
//       return;
//     }
//     const screenshotToastId = sonnerToast.loading("Taking Screenshot...", {
//       description: "Capturing image...",
//     });
//     if (composerRef.current) composerRef.current.render();
//     else rendererRef.current.render(sceneRef.current, cameraRef.current);
//     setTimeout(() => {
//       try {
//         const canvas = rendererRef.current.domElement;
//         const link = document.createElement("a");
//         link.download = `screenshot-${
//           isImportedModelDisplayed
//             ? currentImportedModelNameRef.current
//             : currentShapeRef.current || "view"
//         }.png`;
//         link.href = canvas.toDataURL("image/png");
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         sonnerToast.success("Screenshot Saved!", {
//           id: screenshotToastId,
//           description: `${link.download} saved.`,
//         });
//       } catch (e) {
//         console.error("Screenshot error:", e);
//         sonnerToast.error("Screenshot Failed", {
//           id: screenshotToastId,
//           description: e.message || "Could not save.",
//         });
//       }
//     }, 100);
//   }, [isImportedModelDisplayed]);

//   const processAndSetImportedModel = useCallback(
//     (scene, animations, fileName) => {
//       const nameOnly =
//         fileName.split(".").slice(0, -1).join(".") || "Imported Model";
//       setImportedModelName(nameOnly);
//       setImportedModel({ scene, animations: animations || [] });
//       setIsImportedModelDisplayed(true);
//       handleResetAnimation();
//       // Success toast is handled by the caller of this function after import completes or in handleFiles
//     },
//     [handleResetAnimation]
//   );

//   const processImportedGltf = useCallback(
//     (gltf, fileName) => {
//       processAndSetImportedModel(gltf.scene, gltf.animations, fileName);
//     },
//     [processAndSetImportedModel]
//   );

//   const handleFiles = useCallback(
//     async (files) => {
//       if (!files || files.length === 0) return;
//       const importToastId = sonnerToast.loading("Processing File(s)...");

//       let objFile = null,
//         mtlFile = null,
//         fbxFile = null,
//         tdsFile = null,
//         otherModelFile = null;

//       for (const file of files) {
//         const lowerName = file.name.toLowerCase();
//         if (lowerName.endsWith(".obj")) objFile = file;
//         else if (lowerName.endsWith(".mtl")) mtlFile = file;
//         else if (lowerName.endsWith(".fbx")) fbxFile = file;
//         else if (lowerName.endsWith(".3ds")) tdsFile = file;
//         else if (
//           lowerName.endsWith(".glb") ||
//           lowerName.endsWith(".gltf") ||
//           lowerName.endsWith(".stl")
//         ) {
//           if (!otherModelFile) otherModelFile = file;
//         }
//       }

//       if (objFile) {
//         sonnerToast.info("Processing OBJ model...", {
//           id: importToastId,
//           description: `Loading ${objFile.name}${
//             mtlFile ? " with " + mtlFile.name : ""
//           }`,
//         });
//         try {
//           const objLoader = new OBJLoader();
//           const mtlLoader = new MTLLoader();
//           let materialsCreator = null;
//           if (
//             mtlFile &&
//             objFile.name.slice(0, -4) === mtlFile.name.slice(0, -4)
//           ) {
//             const mtlText = await mtlFile.text();
//             mtlLoader.setResourcePath("");
//             materialsCreator = mtlLoader.parse(mtlText, "");
//             materialsCreator.preload();
//           }
//           const objText = await objFile.text();
//           if (materialsCreator) objLoader.setMaterials(materialsCreator);
//           const object = objLoader.parse(objText);
//           object.traverse((child) => {
//             if (child.isMesh) {
//               if (child.material) {
//                 if (Array.isArray(child.material))
//                   child.material.forEach(
//                     (mat) => (mat.side = THREE.DoubleSide)
//                   );
//                 else child.material.side = THREE.DoubleSide;
//               } else if (!materialsCreator) {
//                 child.material = createAdvancedMaterial(
//                   currentSettingsRef.current.shapeColor,
//                   "ceramic"
//                 );
//                 child.material.side = THREE.DoubleSide;
//               }
//               child.castShadow = true;
//               child.receiveShadow = true;
//             }
//           });
//           processAndSetImportedModel(object, [], objFile.name);
//           sonnerToast.success("OBJ Model Loaded", {
//             id: importToastId,
//             description: `${objFile.name} displayed.`,
//           });
//         } catch (error) {
//           console.error("OBJ/MTL Error:", error);
//           sonnerToast.error("OBJ/MTL Load Failed", {
//             id: importToastId,
//             description: `${objFile.name}: ${error.message || "Unknown"}`,
//           });
//         }
//       } else if (fbxFile) {
//         sonnerToast.info("Processing FBX model...", {
//           id: importToastId,
//           description: `Loading ${fbxFile.name}. This may take a moment...`,
//         });
//         try {
//           const buffer = await fbxFile.arrayBuffer();
//           const loader = new FBXLoader();
//           const object = loader.parse(buffer, "");
//           object.traverse((child) => {
//             if (child.isMesh) {
//               child.castShadow = true;
//               child.receiveShadow = true;
//               if (child.material) {
//                 if (Array.isArray(child.material))
//                   child.material.forEach(
//                     (mat) => (mat.side = THREE.DoubleSide)
//                   );
//                 else child.material.side = THREE.DoubleSide;
//               }
//             }
//           });
//           processAndSetImportedModel(
//             object,
//             object.animations || [],
//             fbxFile.name
//           );
//           sonnerToast.success("FBX Model Loaded", {
//             id: importToastId,
//             description: `${fbxFile.name} displayed.`,
//           });
//         } catch (error) {
//           console.error("FBX Error:", error);
//           sonnerToast.error("FBX Load Failed", {
//             id: importToastId,
//             description: `${fbxFile.name}: ${
//               error.message || "Unknown FBX error"
//             }`,
//           });
//         }
//       } else if (tdsFile) {
//         sonnerToast.info("Processing 3DS model...", {
//           id: importToastId,
//           description: `Loading ${tdsFile.name}`,
//         });
//         try {
//           const buffer = await tdsFile.arrayBuffer();
//           const loader = new TDSLoader();
//           const object = loader.parse(buffer, "");
//           object.traverse((child) => {
//             if (child.isMesh) {
//               child.castShadow = true;
//               child.receiveShadow = true;
//               if (child.material) {
//                 if (Array.isArray(child.material))
//                   child.material.forEach(
//                     (mat) => (mat.side = THREE.DoubleSide)
//                   );
//                 else child.material.side = THREE.DoubleSide;
//               } else {
//                 child.material = createAdvancedMaterial(
//                   currentSettingsRef.current.shapeColor,
//                   "plastic"
//                 );
//                 child.material.side = THREE.DoubleSide;
//               }
//             }
//           });
//           processAndSetImportedModel(object, [], tdsFile.name);
//           sonnerToast.success("3DS Model Loaded", {
//             id: importToastId,
//             description: `${tdsFile.name} displayed.`,
//           });
//         } catch (error) {
//           console.error("3DS Error:", error);
//           sonnerToast.error("3DS Load Failed", {
//             id: importToastId,
//             description: `${tdsFile.name}: ${
//               error.message || "Unknown 3DS error"
//             }`,
//           });
//         }
//       } else if (otherModelFile) {
//         sonnerToast.info("Processing model...", {
//           id: importToastId,
//           description: `Loading ${otherModelFile.name}`,
//         });
//         const lowerName = otherModelFile.name.toLowerCase();
//         try {
//           const buffer = await otherModelFile.arrayBuffer();
//           if (lowerName.endsWith(".glb") || lowerName.endsWith(".gltf")) {
//             const loader = getGltfLoader();
//             loader.parse(
//               buffer,
//               "",
//               (gltf) => {
//                 processImportedGltf(gltf, otherModelFile.name);
//                 sonnerToast.success("GLTF/GLB Model Loaded", {
//                   id: importToastId,
//                   description: `${otherModelFile.name} displayed.`,
//                 });
//               },
//               (error) => {
//                 console.error("GLB/GLTF Parse Error:", error);
//                 sonnerToast.error("GLB/GLTF Parse Failed", {
//                   id: importToastId,
//                   description: `${otherModelFile.name}: ${
//                     error.message || "Unknown"
//                   }`,
//                 });
//               }
//             );
//             return; // GLTF is async
//           } else if (lowerName.endsWith(".stl")) {
//             const loader = new STLLoader();
//             const geometry = loader.parse(buffer);
//             if (!geometry.isBufferGeometry)
//               throw new Error("Invalid STL geometry.");
//             const material = createAdvancedMaterial(
//               currentSettingsRef.current.shapeColor,
//               "plastic"
//             );
//             const modelScene = new THREE.Mesh(geometry, material);
//             processAndSetImportedModel(modelScene, [], otherModelFile.name);
//             sonnerToast.success("STL Model Loaded", {
//               id: importToastId,
//               description: `${otherModelFile.name} displayed.`,
//             });
//           }
//         } catch (error) {
//           console.error("Model Load Error:", error);
//           sonnerToast.error("Model Load Failed", {
//             id: importToastId,
//             description: `${otherModelFile.name}: ${
//               error.message || "Unknown"
//             }`,
//           });
//         }
//       } else {
//         sonnerToast.warning("No Supported File", {
//           id: importToastId,
//           description: "Please select GLB, GLTF, STL, OBJ, FBX or 3DS.",
//         });
//       }
//       if (fileInputRef.current) fileInputRef.current.value = null;
//     },
//     [processImportedGltf, processAndSetImportedModel]
//   );

//   const triggerImport = useCallback(() => {
//     if (fileInputRef.current) fileInputRef.current.click();
//   }, []);
//   const handleFileDropOnViewer = useCallback(
//     (event) => {
//       event.preventDefault();
//       event.stopPropagation();
//       if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
//         handleFiles(Array.from(event.dataTransfer.files));
//       }
//     },
//     [handleFiles]
//   );

//   if (!isMounted) {
//     return (
//       <div className='min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-4'>
//         <Loader2 className='h-12 w-12 animate-spin text-purple-400 mb-4' />
//         <p className='text-lg font-medium'>Initializing 3D Studio...</p>
//         <p className='text-sm text-slate-400'>
//           Getting things ready, please wait.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <SonnerToaster richColors position='top-right' />
//       <div className='min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 p-3 sm:p-4 md:p-6 text-slate-100 select-none'>
//         <input
//           type='file'
//           accept='.glb,.gltf,.stl,.obj,.mtl,.fbx,.3ds'
//           multiple
//           ref={fileInputRef}
//           onChange={(e) => handleFiles(Array.from(e.target.files))}
//           style={{ display: "none" }}
//         />
//         <div className='max-w-screen-2xl mx-auto'>
//           <header className='text-center mb-8 sm:mb-10'>
//             <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-3 sm:mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent'>
//               3D Shape Studio Pro
//             </h1>
//             <p className='text-slate-400 text-base sm:text-lg max-w-3xl mx-auto'>
//               Craft, view, and animate 3D masterpieces. Import GLB, GLTF, STL,
//               OBJ, FBX or 3DS models.
//             </p>
//           </header>
//           <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6'>
//             <div className='lg:col-span-3 space-y-4 sm:space-y-5 order-last lg:order-first'>
//               {!isImportedModelDisplayed && (
//                 <>
//                   <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
//                     <CardHeader>
//                       <CardTitle className='text-slate-100'>
//                         Categories
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className='grid grid-cols-2 gap-3'>
//                         {categories.map((category) => (
//                           <Button
//                             key={category.id}
//                             variant={
//                               currentCategory === category.id
//                                 ? "default"
//                                 : "outline"
//                             }
//                             className={cn(
//                               "h-auto py-3 flex flex-col items-center justify-center gap-1.5 text-xs sm:text-sm transition-all",
//                               currentCategory === category.id
//                                 ? "bg-purple-600 hover:bg-purple-700 text-white ring-2 ring-purple-400"
//                                 : "text-slate-300 border-slate-600 hover:bg-slate-700/50"
//                             )}
//                             onClick={() => handleCategorySelect(category.id)}
//                           >
//                             <span className='text-2xl sm:text-3xl'>
//                               {category.icon}
//                             </span>{" "}
//                             <span>{category.name}</span>
//                           </Button>
//                         ))}
//                       </div>
//                     </CardContent>
//                   </Card>
//                   <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
//                     <CardHeader>
//                       <CardTitle className='text-slate-100'>Shapes</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className='grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50'>
//                         {shapesByCategory[currentCategory].map((shape) => (
//                           <Button
//                             key={shape.id}
//                             variant={
//                               currentShape === shape.id ? "secondary" : "ghost"
//                             }
//                             className={cn(
//                               "justify-start gap-2",
//                               currentShape === shape.id
//                                 ? "bg-purple-500 text-white hover:bg-purple-600"
//                                 : "text-slate-300 hover:bg-slate-700/50"
//                             )}
//                             onClick={() => handleShapeSelect(shape.id)}
//                           >
//                             <span className='text-xl'>{shape.icon}</span>{" "}
//                             {shape.name}
//                           </Button>
//                         ))}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </>
//               )}
//               {isImportedModelDisplayed && importedModel && (
//                 <Card className='bg-slate-800/70 border-slate-700 shadow-xl text-center'>
//                   <CardHeader>
//                     <CardTitle className='text-slate-100'>
//                       Current Model
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <p
//                       className='text-sm text-slate-300 truncate font-medium'
//                       title={importedModelName}
//                     >
//                       {importedModelName}
//                     </p>
//                   </CardContent>
//                   <CardFooter>
//                     <Button
//                       variant='destructive'
//                       size='sm'
//                       className='w-full'
//                       onClick={() => {
//                         setImportedModel(null);
//                         setIsImportedModelDisplayed(false);
//                         setImportedModelName("Imported Model");
//                         const defaultCategoryId = categories[0].id;
//                         setCurrentCategory(defaultCategoryId);
//                         setCurrentShape(
//                           shapesByCategory[defaultCategoryId][0].id
//                         );
//                         handleResetAnimation();
//                         sonnerToast.info("Imported Model Cleared", {
//                           description: "Procedural shapes active.",
//                         });
//                       }}
//                     >
//                       {" "}
//                       <XCircle size={16} className='mr-2' /> Clear Imported{" "}
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               )}
//               <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
//                 <CardHeader>
//                   <CardTitle className='text-slate-100'>Animation</CardTitle>
//                 </CardHeader>
//                 <CardContent className='space-y-4'>
//                   <Button
//                     onClick={handleToggleAnimation}
//                     variant={isAnimating ? "destructive" : "default"}
//                     className='w-full bg-green-600 hover:bg-green-700 data-[state=destructive]:bg-red-600 data-[state=destructive]:hover:bg-red-700'
//                     data-state={isAnimating ? "destructive" : "default"}
//                   >
//                     {isAnimating ? (
//                       <Pause size={16} className='mr-2' />
//                     ) : (
//                       <Play size={16} className='mr-2' />
//                     )}{" "}
//                     {isAnimating ? "Pause" : "Play"}
//                   </Button>
//                   <Select
//                     value={animationPreset}
//                     onValueChange={setAnimationPreset}
//                   >
//                     <SelectTrigger className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'>
//                       <SelectValue placeholder='Select animation' />
//                     </SelectTrigger>
//                     <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
//                       {Object.keys(animationPresets).map((presetKey) => (
//                         <SelectItem
//                           key={presetKey}
//                           value={presetKey}
//                           className='capitalize focus:bg-purple-600 focus:text-white'
//                         >
//                           {presetKey.charAt(0).toUpperCase() +
//                             presetKey.slice(1)}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <div className='grid grid-cols-2 gap-3'>
//                     <Button
//                       variant='outline'
//                       onClick={handleResetAnimation}
//                       className='border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
//                     >
//                       <RotateCcw size={14} className='mr-2' /> Reset
//                     </Button>
//                     <Button
//                       variant='default'
//                       onClick={handleRandomize}
//                       className='bg-indigo-600 hover:bg-indigo-700'
//                     >
//                       <Shuffle size={14} className='mr-2' /> Random
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Viewer Settings Card - MOVED HERE */}
//               <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
//                 <CardHeader>
//                   <CardTitle className='text-slate-100'>
//                     Viewer Settings
//                   </CardTitle>
//                   <CardDescription className='text-slate-400 text-xs pt-1'>
//                     Customize appearance and behavior.
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className='space-y-4 pt-4'>
//                   <div className='space-y-1.5'>
//                     <Label
//                       htmlFor='materialType'
//                       className='text-sm text-slate-300'
//                     >
//                       Material (Shapes)
//                     </Label>
//                     <Select
//                       value={settings.materialType}
//                       onValueChange={(value) =>
//                         setSettings((s) => ({ ...s, materialType: value }))
//                       }
//                     >
//                       <SelectTrigger
//                         id='materialType'
//                         className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'
//                       >
//                         <SelectValue placeholder='Select material' />
//                       </SelectTrigger>
//                       <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
//                         {[
//                           "auto",
//                           "metallic",
//                           "glass",
//                           "crystal",
//                           "ceramic",
//                           "organic",
//                           "plastic",
//                           "neon",
//                         ].map((type) => (
//                           <SelectItem
//                             key={type}
//                             value={type}
//                             className='capitalize focus:bg-purple-600 focus:text-white'
//                           >
//                             {type}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className='space-y-1.5'>
//                     <Label
//                       htmlFor='shapeColor'
//                       className='text-sm text-slate-300'
//                     >
//                       Color (Shapes)
//                     </Label>
//                     <Input
//                       id='shapeColor'
//                       type='color'
//                       value={settings.shapeColor}
//                       onChange={(e) =>
//                         setSettings((s) => ({
//                           ...s,
//                           shapeColor: e.target.value,
//                         }))
//                       }
//                       className='w-full p-1 h-9 bg-slate-700 border-slate-600 cursor-pointer focus-visible:ring-purple-500'
//                     />
//                   </div>

//                   <div className='space-y-1.5'>
//                     <div className='flex justify-between items-center'>
//                       <Label
//                         htmlFor='animationSpeed'
//                         className='text-sm text-slate-300'
//                       >
//                         Animation Speed
//                       </Label>
//                       <span className='text-xs text-slate-400'>
//                         {settings.animationSpeed.toFixed(1)}x
//                       </span>
//                     </div>
//                     <Slider
//                       id='animationSpeed'
//                       min={0.1}
//                       max={3}
//                       step={0.1}
//                       value={[settings.animationSpeed]}
//                       onValueChange={([value]) =>
//                         setSettings((s) => ({ ...s, animationSpeed: value }))
//                       }
//                       className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//                     />
//                   </div>

//                   <div className='space-y-1.5'>
//                     <div className='flex justify-between items-center'>
//                       <Label
//                         htmlFor='lightIntensity'
//                         className='text-sm text-slate-300'
//                       >
//                         Light Intensity
//                       </Label>
//                       <span className='text-xs text-slate-400'>
//                         {settings.lightIntensity.toFixed(1)}x
//                       </span>
//                     </div>
//                     <Slider
//                       id='lightIntensity'
//                       min={0.1}
//                       max={2.5}
//                       step={0.1}
//                       value={[settings.lightIntensity]}
//                       onValueChange={([value]) =>
//                         setSettings((s) => ({ ...s, lightIntensity: value }))
//                       }
//                       className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//                     />
//                   </div>

//                   <div className='space-y-1.5'>
//                     <div className='flex justify-between items-center'>
//                       <Label
//                         htmlFor='extrudeDepth'
//                         className='text-sm text-slate-300'
//                       >
//                         Depth (Shapes)
//                       </Label>
//                       <span className='text-xs text-slate-400'>
//                         {settings.extrudeDepth.toFixed(2)}
//                       </span>
//                     </div>
//                     <Slider
//                       id='extrudeDepth'
//                       min={0.05}
//                       max={1.5}
//                       step={0.05}
//                       value={[settings.extrudeDepth]}
//                       onValueChange={([value]) =>
//                         setSettings((s) => ({ ...s, extrudeDepth: value }))
//                       }
//                       className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//                     />
//                   </div>

//                   <div className='space-y-1.5'>
//                     <Label htmlFor='quality' className='text-sm text-slate-300'>
//                       Quality (Shapes)
//                     </Label>
//                     <Select
//                       value={settings.quality}
//                       onValueChange={(value) =>
//                         setSettings((s) => ({ ...s, quality: value }))
//                       }
//                     >
//                       <SelectTrigger
//                         id='quality'
//                         className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'
//                       >
//                         <SelectValue placeholder='Select quality' />
//                       </SelectTrigger>
//                       <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
//                         {["low", "medium", "high"].map((q) => (
//                           <SelectItem
//                             key={q}
//                             value={q}
//                             className='capitalize focus:bg-purple-600 focus:text-white'
//                           >
//                             {q}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className='space-y-1.5'>
//                     <Label
//                       htmlFor='background'
//                       className='text-sm text-slate-300'
//                     >
//                       Background
//                     </Label>
//                     <Select
//                       value={settings.background}
//                       onValueChange={(value) =>
//                         setSettings((s) => ({ ...s, background: value }))
//                       }
//                     >
//                       <SelectTrigger
//                         id='background'
//                         className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'
//                       >
//                         <SelectValue placeholder='Select background' />
//                       </SelectTrigger>
//                       <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
//                         {Object.entries(backgroundOptions).map(
//                           ([key, name]) => (
//                             <SelectItem
//                               key={key}
//                               value={key}
//                               className='focus:bg-purple-600 focus:text-white'
//                             >
//                               {name}
//                             </SelectItem>
//                           )
//                         )}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
//                 <CardHeader>
//                   <CardTitle className='text-slate-100'>
//                     File & Export
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className='space-y-3'>
//                   <Button
//                     onClick={triggerImport}
//                     disabled={isExporting}
//                     className='w-full bg-green-600 hover:bg-green-700'
//                   >
//                     <UploadCloud size={16} className='mr-2' /> Import Model
//                   </Button>
//                   <Button
//                     onClick={handleExportGLB}
//                     disabled={isExporting}
//                     className='w-full bg-blue-600 hover:bg-blue-700'
//                   >
//                     <Download size={16} className='mr-2' />{" "}
//                     {isExporting && exportProgress > 0 && exportProgress <= 100
//                       ? `GLB... ${Math.round(exportProgress)}%`
//                       : "Export GLB"}
//                   </Button>
//                   <Button
//                     onClick={handleSimulatedExportOBJ}
//                     disabled={isExporting}
//                     className='w-full bg-teal-600 hover:bg-teal-700'
//                   >
//                     <Download size={16} className='mr-2' />{" "}
//                     {isExporting && exportProgress > 0 && exportProgress <= 100
//                       ? `OBJ... ${Math.round(exportProgress)}%`
//                       : "Export OBJ (Sim.)"}
//                   </Button>
//                   <Button
//                     onClick={handleTakeScreenshot}
//                     disabled={isExporting}
//                     className='w-full bg-purple-600 hover:bg-purple-700'
//                   >
//                     <Camera size={16} className='mr-2' /> Screenshot
//                   </Button>
//                 </CardContent>
//               </Card>
//             </div>
//             <div className='lg:col-span-9 order-first lg:order-last'>
//               <Card className='bg-slate-800/50 border-slate-700/80 shadow-2xl aspect-[4/3] sm:aspect-video lg:aspect-[16/10] overflow-hidden'>
//                 <CardContent className='p-0 w-full h-full relative'>
//                   <div
//                     className='relative w-full h-full'
//                     onDragOver={(e) => {
//                       e.preventDefault();
//                       e.stopPropagation();
//                     }}
//                     onDrop={handleFileDropOnViewer}
//                   >
//                     <div
//                       ref={mountRef}
//                       className='w-full h-full rounded-lg overflow-hidden'
//                     />
//                     {isExporting && (
//                       <div className='absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-lg z-10 backdrop-blur-sm'>
//                         <Card className='bg-slate-100 text-slate-800 p-6 sm:p-8 shadow-2xl text-center w-72'>
//                           <CardHeader className='p-0 mb-4'>
//                             <CardTitle className='text-xl sm:text-2xl'>
//                               Exporting Model
//                             </CardTitle>
//                           </CardHeader>
//                           <CardContent className='p-0 space-y-3'>
//                             <div className='text-lg font-semibold'>
//                               {Math.round(exportProgress)}%
//                             </div>
//                             <Progress
//                               value={exportProgress}
//                               className='w-full h-2.5'
//                             />
//                             <p className='text-xs text-slate-500'>
//                               Please wait, this may take a moment...
//                             </p>
//                           </CardContent>
//                         </Card>
//                       </div>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>

//           <footer className='text-center mt-10 sm:mt-16 py-6 border-t border-slate-700/50'>
//             <p className='text-slate-400 text-sm'>
//               © {new Date().getFullYear()} 3D Shape Studio Pro. All rights
//               reserved.
//             </p>
//             <p className='text-xs text-slate-500 mt-1'>
//               An interactive 3D modeling and visualization tool.
//             </p>
//           </footer>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ModelViewer3D;

// lets try new faetures add to the curreny system

// import React, { useRef, useEffect, useState, useCallback } from "react";
// import * as THREE from "three";
// import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
// import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
// import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
// import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";
// import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
// import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
// import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
// import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
// import { TDSLoader } from "three/examples/jsm/loaders/TDSLoader.js";

// import {
//   Download,
//   Play,
//   Pause,
//   RotateCcw,
//   Camera,
//   Shuffle,
//   UploadCloud,
//   XCircle,
//   Loader2,
//   Undo,
//   Redo,
//   StopCircle,
//   Repeat,
//   Settings2, // Icon for the new settings panel trigger
//   PanelRightOpen,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Slider } from "@/components/ui/slider";
// import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";
// import { Progress } from "@/components/ui/progress";
// import { Switch } from "@/components/ui/switch";
// import { Separator } from "@/components/ui/separator";
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
//   SheetFooter,
//   SheetClose,
// } from "@/components/ui/sheet"; // For the settings panel

// import { clsx } from "clsx";
// import { twMerge } from "tailwind-merge";

// export function cn(...inputs) {
//   return twMerge(clsx(inputs));
// }

// const saneNumber = (value, defaultValue = 0) => {
//   const num = Number(value);
//   return isNaN(num) || !isFinite(num) ? defaultValue : num;
// };

// // --- Shape Creation Functions (unchanged) ---
// const createCatShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(0), saneNumber(s * 0.8));
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.6),
//     saneNumber(s * 0.8),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(0)
//   );
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.8),
//     saneNumber(-s * 0.6),
//     saneNumber(-s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(0),
//     saneNumber(-s * 0.8)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.8),
//     saneNumber(-s * 0.6),
//     saneNumber(s * 0.8),
//     saneNumber(0)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(s * 0.6),
//     saneNumber(s * 0.8),
//     saneNumber(0),
//     saneNumber(s * 0.8)
//   );
//   const ear1 = new THREE.Path();
//   ear1.moveTo(saneNumber(-s * 0.4), saneNumber(s * 0.6));
//   ear1.lineTo(saneNumber(-s * 0.7), saneNumber(s * 1.2));
//   ear1.lineTo(saneNumber(-s * 0.1), saneNumber(s * 0.9));
//   ear1.closePath();
//   const ear2 = new THREE.Path();
//   ear2.moveTo(saneNumber(s * 0.4), saneNumber(s * 0.6));
//   ear2.lineTo(saneNumber(s * 0.7), saneNumber(s * 1.2));
//   ear2.lineTo(saneNumber(s * 0.1), saneNumber(s * 0.9));
//   ear2.closePath();
//   shape.holes.push(ear1);
//   shape.holes.push(ear2);
//   return shape;
// };
// const createBirdShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(0), saneNumber(s * 0.6));
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.9),
//     saneNumber(-s * 0.2),
//     saneNumber(-s * 0.6),
//     saneNumber(-s * 0.6)
//   );
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.3),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.3),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.6),
//     saneNumber(-s * 0.6)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.9),
//     saneNumber(-s * 0.2),
//     saneNumber(s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(0),
//     saneNumber(s * 0.6)
//   );
//   const wing = new THREE.Path();
//   wing.moveTo(saneNumber(-s * 0.3), saneNumber(s * 0.2));
//   wing.bezierCurveTo(
//     saneNumber(-s * 0.7),
//     saneNumber(s * 0.3),
//     saneNumber(-s * 0.8),
//     saneNumber(0),
//     saneNumber(-s * 0.5),
//     saneNumber(-s * 0.3)
//   );
//   wing.bezierCurveTo(
//     saneNumber(-s * 0.2),
//     saneNumber(-s * 0.1),
//     saneNumber(-s * 0.1),
//     saneNumber(s * 0.1),
//     saneNumber(-s * 0.3),
//     saneNumber(s * 0.2)
//   );
//   shape.holes.push(wing);
//   return shape;
// };
// const createFishShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(-s * 0.8), saneNumber(0));
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.6),
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.2),
//     saneNumber(s * 0.5),
//     saneNumber(s * 0.2),
//     saneNumber(s * 0.3)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.6),
//     saneNumber(s * 0.2),
//     saneNumber(s * 0.8),
//     saneNumber(0),
//     saneNumber(s * 0.8),
//     saneNumber(0)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.6),
//     saneNumber(-s * 0.2),
//     saneNumber(s * 0.2),
//     saneNumber(-s * 0.3),
//     saneNumber(-s * 0.2),
//     saneNumber(-s * 0.5)
//   );
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.6),
//     saneNumber(-s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(0),
//     saneNumber(-s * 0.8),
//     saneNumber(0)
//   );
//   shape.moveTo(saneNumber(s * 0.8), saneNumber(0));
//   shape.lineTo(saneNumber(s * 1.2), saneNumber(s * 0.3));
//   shape.lineTo(saneNumber(s * 1.0), saneNumber(0));
//   shape.lineTo(saneNumber(s * 1.2), saneNumber(-s * 0.3));
//   shape.lineTo(saneNumber(s * 0.8), saneNumber(0));
//   return shape;
// };
// const createSoccerBallShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const r = s * 0.8;
//   for (let i = 0; i < 6; i++) {
//     const a = (i / 6) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * r);
//     const y = saneNumber(Math.sin(a) * r);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.closePath();
//   const ih = new THREE.Path();
//   const ir = s * 0.4;
//   for (let i = 0; i < 6; i++) {
//     const a = (i / 6) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * ir);
//     const y = saneNumber(Math.sin(a) * ir);
//     if (i === 0) ih.moveTo(x, y);
//     else ih.lineTo(x, y);
//   }
//   ih.closePath();
//   shape.holes.push(ih);
//   return shape;
// };
// const createTennisRacketShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const a = s * 0.6;
//   const b = s * 0.4;
//   for (let i = 0; i <= 32; i++) {
//     const ang = (i / 32) * Math.PI * 2;
//     const x = saneNumber(Math.cos(ang) * a);
//     const y = saneNumber(Math.sin(ang) * b + s * 0.3);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.lineTo(saneNumber(s * 0.1), saneNumber(-s * 0.8));
//   shape.lineTo(saneNumber(-s * 0.1), saneNumber(-s * 0.8));
//   shape.closePath();
//   return shape;
// };
// const createBasketballShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const r = s * 0.8;
//   for (let i = 0; i <= 32; i++) {
//     const a = (i / 32) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * r);
//     const y = saneNumber(Math.sin(a) * r);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.closePath();
//   return shape;
// };
// const createPersonShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const hr = s * 0.2;
//   for (let i = 0; i <= 16; i++) {
//     const a = (i / 16) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * hr);
//     const y = saneNumber(Math.sin(a) * hr + s * 0.6);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.lineTo(saneNumber(-s * 0.3), saneNumber(s * 0.2));
//   shape.lineTo(saneNumber(-s * 0.4), saneNumber(-s * 0.4));
//   shape.lineTo(saneNumber(-s * 0.2), saneNumber(-s * 0.8));
//   shape.lineTo(saneNumber(s * 0.2), saneNumber(-s * 0.8));
//   shape.lineTo(saneNumber(s * 0.4), saneNumber(-s * 0.4));
//   shape.lineTo(saneNumber(s * 0.3), saneNumber(s * 0.2));
//   shape.closePath();
//   return shape;
// };
// const createRobotShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(-sval * 0.4), saneNumber(sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.4), saneNumber(sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.4), saneNumber(sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.4), saneNumber(sval * 0.4));
//   shape.closePath();
//   shape.moveTo(saneNumber(-sval * 0.5), saneNumber(sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.5), saneNumber(sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.5), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.5), saneNumber(-sval * 0.4));
//   shape.closePath();
//   shape.moveTo(saneNumber(-sval * 0.3), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.1), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.1), saneNumber(-sval * 0.8));
//   shape.lineTo(saneNumber(-sval * 0.3), saneNumber(-sval * 0.8));
//   shape.closePath();
//   shape.moveTo(saneNumber(sval * 0.1), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.3), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.3), saneNumber(-sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.1), saneNumber(-sval * 0.8));
//   shape.closePath();
//   return shape;
// };
// const createPhoneShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const w = sval * 0.5;
//   const h = sval * 1.0;
//   const r = sval * 0.1;
//   shape.moveTo(saneNumber(-w + r), saneNumber(h));
//   shape.lineTo(saneNumber(w - r), saneNumber(h));
//   shape.quadraticCurveTo(
//     saneNumber(w),
//     saneNumber(h),
//     saneNumber(w),
//     saneNumber(h - r)
//   );
//   shape.lineTo(saneNumber(w), saneNumber(-h + r));
//   shape.quadraticCurveTo(
//     saneNumber(w),
//     saneNumber(-h),
//     saneNumber(w - r),
//     saneNumber(-h)
//   );
//   shape.lineTo(saneNumber(-w + r), saneNumber(-h));
//   shape.quadraticCurveTo(
//     saneNumber(-w),
//     saneNumber(-h),
//     saneNumber(-w),
//     saneNumber(-h + r)
//   );
//   shape.lineTo(saneNumber(-w), saneNumber(h - r));
//   shape.quadraticCurveTo(
//     saneNumber(-w),
//     saneNumber(h),
//     saneNumber(-w + r),
//     saneNumber(h)
//   );
//   shape.closePath();
//   const screen = new THREE.Path();
//   const sw = w * 0.8;
//   const sh = h * 0.8;
//   const sr = r * 0.5;
//   screen.moveTo(saneNumber(-sw + sr), saneNumber(sh));
//   screen.lineTo(saneNumber(sw - sr), saneNumber(sh));
//   screen.quadraticCurveTo(
//     saneNumber(sw),
//     saneNumber(sh),
//     saneNumber(sw),
//     saneNumber(sh - sr)
//   );
//   screen.lineTo(saneNumber(sw), saneNumber(-sh + sr));
//   screen.quadraticCurveTo(
//     saneNumber(sw),
//     saneNumber(-sh),
//     saneNumber(sw - sr),
//     saneNumber(-sh)
//   );
//   screen.lineTo(saneNumber(-sw + sr), saneNumber(-sh));
//   screen.quadraticCurveTo(
//     saneNumber(-sw),
//     saneNumber(-sh),
//     saneNumber(-sw),
//     saneNumber(-sh + sr)
//   );
//   screen.lineTo(saneNumber(-sw), saneNumber(sh - sr));
//   screen.quadraticCurveTo(
//     saneNumber(-sw),
//     saneNumber(sh),
//     saneNumber(-sw + sr),
//     saneNumber(sh)
//   );
//   screen.closePath();
//   shape.holes.push(screen);
//   return shape;
// };
// const createLightningShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(-sval * 0.2), saneNumber(sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.3), saneNumber(sval * 0.2));
//   shape.lineTo(saneNumber(sval * 0.1), saneNumber(sval * 0.2));
//   shape.lineTo(saneNumber(sval * 0.4), saneNumber(-sval * 0.8));
//   shape.lineTo(saneNumber(-sval * 0.1), saneNumber(-sval * 0.2));
//   shape.lineTo(saneNumber(sval * 0.1), saneNumber(-sval * 0.2));
//   shape.lineTo(saneNumber(-sval * 0.4), saneNumber(sval * 0.8));
//   shape.closePath();
//   return shape;
// };
// const createMusicNoteShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const nr = sval * 0.15;
//   for (let i = 0; i <= 16; i++) {
//     const a = (i / 16) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * nr - sval * 0.2);
//     const y = saneNumber(Math.sin(a) * nr - sval * 0.4);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.lineTo(saneNumber(-sval * 0.05), saneNumber(sval * 0.6));
//   shape.lineTo(saneNumber(sval * 0.05), saneNumber(sval * 0.6));
//   shape.lineTo(saneNumber(sval * 0.05), saneNumber(-sval * 0.25));
//   shape.closePath();
//   shape.moveTo(saneNumber(sval * 0.05), saneNumber(sval * 0.6));
//   shape.bezierCurveTo(
//     saneNumber(sval * 0.4),
//     saneNumber(sval * 0.5),
//     saneNumber(sval * 0.3),
//     saneNumber(sval * 0.2),
//     saneNumber(sval * 0.05),
//     saneNumber(sval * 0.3)
//   );
//   shape.closePath();
//   return shape;
// };

// // --- Material and Shape Data (unchanged) ---
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
// const baseMaterialPresets = {
//   metallic: { metalness: 0.9, roughness: 0.1, envMapIntensity: 1.5 },
//   glass: {
//     metalness: 0.0,
//     roughness: 0.0,
//     transmission: 0.95,
//     thickness: 0.7,
//     transparent: true,
//     opacity: 0.85,
//     envMapIntensity: 2.0,
//     ior: 1.52,
//   },
//   crystal: {
//     metalness: 0.0,
//     roughness: 0.01,
//     transmission: 0.98,
//     thickness: 0.6,
//     transparent: true,
//     opacity: 0.9,
//     envMapIntensity: 2.5,
//     ior: 1.7,
//   },
//   ceramic: { metalness: 0.1, roughness: 0.6, envMapIntensity: 0.8 },
//   organic: { metalness: 0.0, roughness: 0.8, envMapIntensity: 0.5 },
//   plastic: { metalness: 0.0, roughness: 0.3, envMapIntensity: 0.7 },
//   neon: {
//     metalness: 0.0,
//     roughness: 0.1,
//     emissiveIntensity: 1.0,
//     envMapIntensity: 0.2,
//     useEmissive: true,
//   },
// };
// const createAdvancedMaterial = (
//   baseColor,
//   materialType = "standard",
//   customProps = {}
// ) => {
//   const color = new THREE.Color(baseColor);
//   let preset = baseMaterialPresets[materialType] || baseMaterialPresets.ceramic;
//   const finalProps = { ...preset };
//   if (customProps.roughness !== null && customProps.roughness !== undefined)
//     finalProps.roughness = customProps.roughness;
//   if (customProps.metalness !== null && customProps.metalness !== undefined)
//     finalProps.metalness = customProps.metalness;
//   if (customProps.ior !== null && customProps.ior !== undefined)
//     finalProps.ior = customProps.ior;
//   if (
//     customProps.transmission !== null &&
//     customProps.transmission !== undefined
//   )
//     finalProps.transmission = customProps.transmission;
//   if (customProps.thickness !== null && customProps.thickness !== undefined)
//     finalProps.thickness = customProps.thickness;
//   if (
//     customProps.emissiveIntensity !== null &&
//     customProps.emissiveIntensity !== undefined
//   )
//     finalProps.emissiveIntensity = customProps.emissiveIntensity;
//   if (finalProps.useEmissive) {
//     finalProps.emissive = color.clone().multiplyScalar(0.8);
//   }
//   const sharedProps = { color, ...finalProps, side: THREE.DoubleSide };
//   if (materialType === "glass" || materialType === "crystal") {
//     return new THREE.MeshPhysicalMaterial(sharedProps);
//   }
//   return new THREE.MeshStandardMaterial(sharedProps);
// };
// const create3DShape = (shapeId, currentSettings, size = 1) => {
//   let shape;
//   let materialTypeForPreset =
//     currentSettings.materialType === "auto"
//       ? "ceramic"
//       : currentSettings.materialType;
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
//   const config = shapeConfigs[shapeId] || shapeConfigs.cat;
//   const shapeSize = saneNumber(size, 1.5);
//   shape = config.creator(shapeSize);
//   if (currentSettings.materialType === "auto") {
//     materialTypeForPreset = config.autoMaterial;
//   }
//   const extrudeSettings = {
//     depth: saneNumber(currentSettings.extrudeDepth, 0.4),
//     bevelEnabled: true,
//     bevelSegments:
//       currentSettings.quality === "high"
//         ? 10
//         : currentSettings.quality === "medium"
//         ? 6
//         : 3,
//     steps:
//       currentSettings.quality === "high"
//         ? 5
//         : currentSettings.quality === "medium"
//         ? 3
//         : 1,
//     bevelSize: saneNumber(0.035 * (shapeSize / 1.5), 0.02),
//     bevelThickness: saneNumber(0.025 * (shapeSize / 1.5), 0.015),
//     curveSegments:
//       currentSettings.quality === "high"
//         ? 48
//         : currentSettings.quality === "medium"
//         ? 24
//         : 12,
//   };
//   const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
//   geometry.computeVertexNormals();
//   try {
//     geometry.center();
//   } catch (e) {
//     console.error(
//       "Error centering geometry:",
//       e,
//       shapeId,
//       currentSettings,
//       shape
//     );
//     return new THREE.Mesh(
//       new THREE.BoxGeometry(1, 1, 1),
//       new THREE.MeshStandardMaterial({ color: 0xff0000 })
//     );
//   }
//   const material = createAdvancedMaterial(
//     currentSettings.shapeColor,
//     materialTypeForPreset,
//     currentSettings.customMaterialProperties
//   );
//   return new THREE.Mesh(geometry, material);
// };
// const CATEGORIES_DATA = [
//   { id: "animals", name: "Animals", icon: "🐱" },
//   { id: "sports", name: "Sports", icon: "⚽" },
//   { id: "people", name: "People", icon: "👤" },
//   { id: "objects", name: "Objects", icon: "📱" },
// ];
// const SHAPES_BY_CATEGORY_DATA = {
//   animals: [
//     { id: "cat", name: "Cat", icon: "🐱" },
//     { id: "bird", name: "Bird", icon: "🐦" },
//     { id: "fish", name: "Fish", icon: "🐟" },
//   ],
//   sports: [
//     { id: "soccer", name: "Soccer", icon: "⚽" },
//     { id: "tennis", name: "Tennis", icon: "🎾" },
//     { id: "basketball", name: "Basketball", icon: "🏀" },
//   ],
//   people: [
//     { id: "person", name: "Person", icon: "👤" },
//     { id: "robot", name: "Robot", icon: "🤖" },
//   ],
//   objects: [
//     { id: "phone", name: "Phone", icon: "📱" },
//     { id: "lightning", name: "Lightning", icon: "⚡" },
//     { id: "music", name: "Music Note", icon: "🎵" },
//   ],
// };
// const BACKGROUND_OPTIONS_DATA = {
//   modernGradient: "Modern Gradient",
//   darkSpace: "Dark Space",
//   softLight: "Soft Light",
//   studioDark: "Studio Dark",
//   studioLight: "Studio Light",
// };
// let gltfLoaderInstance;
// const getGltfLoader = () => {
//   if (!gltfLoaderInstance) {
//     gltfLoaderInstance = new GLTFLoader();
//     const dracoLoader = new DRACOLoader();
//     dracoLoader.setDecoderPath("/draco/gltf/");
//     gltfLoaderInstance.setDRACOLoader(dracoLoader);
//   }
//   return gltfLoaderInstance;
// };

// const initialSettings = {
//   materialType: "auto",
//   shapeColor: "#a78bfa",
//   animationSpeed: 1.0,
//   extrudeDepth: 0.4,
//   quality: "medium",
//   background: "studioDark",
//   keyLight: { enabled: true, intensity: 0.7, color: "#ffffff" },
//   fillLight: { enabled: true, intensity: 0.4, color: "#a0c0ff" },
//   ambientLight: { enabled: true, intensity: 0.25, color: "#ffffff" },
//   customMaterialProperties: {
//     roughness: null,
//     metalness: null,
//     ior: null,
//     transmission: null,
//     thickness: null,
//     emissiveIntensity: null,
//   },
// };

// const ModelViewer3D = () => {
//   const [isMounted, setIsMounted] = useState(false);
//   const mountRef = useRef(null);
//   const sceneRef = useRef(null);
//   const rendererRef = useRef(null);
//   const cameraRef = useRef(null);
//   const controlsRef = useRef(null);
//   const composerRef = useRef(null);
//   const ssaoPassRef = useRef(null);
//   const meshRef = useRef(null);
//   const animationIdRef = useRef(null);
//   const lightsRef = useRef({ key: null, fill: null, ambient: null });
//   const skyboxMeshRef = useRef(null);
//   const envMapTextureRef = useRef(null);
//   const fileInputRef = useRef(null);

//   const [importedModel, setImportedModel] = useState(null);
//   const [isImportedModelDisplayed, setIsImportedModelDisplayed] =
//     useState(false);
//   const [importedModelName, setImportedModelName] = useState("Imported Model");

//   const [currentCategory, setCurrentCategory] = useState(CATEGORIES_DATA[0].id);
//   const [currentShape, setCurrentShape] = useState(
//     SHAPES_BY_CATEGORY_DATA[CATEGORIES_DATA[0].id][0].id
//   );

//   const categories = CATEGORIES_DATA;
//   const shapesByCategory = SHAPES_BY_CATEGORY_DATA;
//   const backgroundOptions = BACKGROUND_OPTIONS_DATA;

//   const [isAnimating, setIsAnimating] = useState(true);
//   const [animationPreset, setAnimationPreset] = useState("gentle");

//   const [settings, setSettings] = useState(
//     JSON.parse(JSON.stringify(initialSettings))
//   );
//   const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false); // For the right settings panel

//   const [isExporting, setIsExporting] = useState(false);
//   const [exportProgress, setExportProgress] = useState(0);

//   const currentSettingsRef = useRef(settings);
//   useEffect(() => {
//     currentSettingsRef.current = settings;
//   }, [settings]);
//   const isAnimatingRef = useRef(isAnimating);
//   useEffect(() => {
//     isAnimatingRef.current = isAnimating;
//   }, [isAnimating]);
//   const animationPresetRef = useRef(animationPreset);
//   useEffect(() => {
//     animationPresetRef.current = animationPreset;
//   }, [animationPreset]);
//   const animationState = useRef({
//     rotation: new THREE.Euler(),
//     targetRotation: new THREE.Euler(),
//     floatY: 0,
//     startTime: Date.now(),
//   });

//   const mixerRef = useRef(null);
//   const animationClipsRef = useRef([]);
//   const activeActionRef = useRef(null);
//   const [selectedAnimationClipIndex, setSelectedAnimationClipIndex] =
//     useState(-1);
//   const [animationPlaybackState, setAnimationPlaybackState] =
//     useState("stopped");
//   const [animationTime, setAnimationTime] = useState(0);
//   const [animationDuration, setAnimationDuration] = useState(0);
//   const [isAnimationLooping, setIsAnimationLooping] = useState(true);
//   const [animationPlaybackSpeed, setAnimationPlaybackSpeed] = useState(1.0);

//   const historyStackRef = useRef([]);
//   const historyPointerRef = useRef(-1);
//   const isUndoingRedoingRef = useRef(false);
//   const MAX_HISTORY = 50;
//   const captureAppState = useCallback(() => {
//     return JSON.parse(
//       JSON.stringify({
//         settings: currentSettingsRef.current,
//         currentCategory,
//         currentShape,
//         animationPreset: animationPresetRef.current,
//         isAnimating: isAnimatingRef.current,
//         importedModelName,
//         isImportedModelDisplayed,
//         selectedAnimationClipIndex,
//         animationPlaybackState,
//         animationTime,
//         isAnimationLooping,
//         animationPlaybackSpeed,
//       })
//     );
//   }, [
//     currentCategory,
//     currentShape,
//     importedModelName,
//     isImportedModelDisplayed,
//     selectedAnimationClipIndex,
//     animationPlaybackState,
//     animationTime,
//     isAnimationLooping,
//     animationPlaybackSpeed,
//   ]);
//   const pushHistory = useCallback(
//     (actionName = "action") => {
//       if (isUndoingRedoingRef.current) return;
//       const currentState = captureAppState();
//       const previousState = historyStackRef.current[historyPointerRef.current];
//       if (
//         previousState &&
//         JSON.stringify(currentState) === JSON.stringify(previousState)
//       ) {
//         return;
//       }
//       const stack = historyStackRef.current.slice(
//         0,
//         historyPointerRef.current + 1
//       );
//       stack.push(currentState);
//       if (stack.length > MAX_HISTORY) {
//         stack.shift();
//       }
//       historyStackRef.current = stack;
//       historyPointerRef.current = stack.length - 1;
//     },
//     [captureAppState]
//   );
//   const applyState = useCallback((stateToApply) => {
//     isUndoingRedoingRef.current = true;
//     setSettings(stateToApply.settings);
//     setCurrentCategory(stateToApply.currentCategory);
//     setCurrentShape(stateToApply.currentShape);
//     setAnimationPreset(stateToApply.animationPreset);
//     setIsAnimating(stateToApply.isAnimating);
//     setImportedModelName(stateToApply.importedModelName);
//     setIsImportedModelDisplayed(stateToApply.isImportedModelDisplayed);
//     setSelectedAnimationClipIndex(stateToApply.selectedAnimationClipIndex);
//     setAnimationPlaybackState(stateToApply.animationPlaybackState);
//     setAnimationTime(stateToApply.animationTime);
//     setIsAnimationLooping(stateToApply.isAnimationLooping);
//     setAnimationPlaybackSpeed(stateToApply.animationPlaybackSpeed);
//     if (activeActionRef.current) {
//       if (stateToApply.animationPlaybackState === "playing") {
//         activeActionRef.current.paused = false;
//         if (!activeActionRef.current.isRunning())
//           activeActionRef.current.play();
//         activeActionRef.current.time =
//           stateToApply.animationTime *
//           activeActionRef.current.getClip().duration;
//       } else if (stateToApply.animationPlaybackState === "paused") {
//         activeActionRef.current.paused = true;
//         activeActionRef.current.time =
//           stateToApply.animationTime *
//           activeActionRef.current.getClip().duration;
//       } else {
//         activeActionRef.current.stop();
//       }
//     }
//     requestAnimationFrame(() => {
//       isUndoingRedoingRef.current = false;
//     });
//   }, []);
//   const handleUndo = useCallback(() => {
//     if (historyPointerRef.current > 0) {
//       historyPointerRef.current--;
//       applyState(historyStackRef.current[historyPointerRef.current]);
//       sonnerToast.info("Undo", { description: "Reverted to previous state." });
//     } else {
//       sonnerToast.warning("Undo", { description: "Nothing more to undo." });
//     }
//   }, [applyState]);
//   const handleRedo = useCallback(() => {
//     if (historyPointerRef.current < historyStackRef.current.length - 1) {
//       historyPointerRef.current++;
//       applyState(historyStackRef.current[historyPointerRef.current]);
//       sonnerToast.info("Redo", { description: "Reverted to next state." });
//     } else {
//       sonnerToast.warning("Redo", { description: "Nothing more to redo." });
//     }
//   }, [applyState]);
//   useEffect(() => {
//     if (isMounted) {
//       pushHistory("initial load");
//     } // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isMounted]);
//   const debouncedPushHistoryRef = useRef(null);
//   useEffect(() => {
//     if (debouncedPushHistoryRef.current) {
//       clearTimeout(debouncedPushHistoryRef.current);
//     }
//     debouncedPushHistoryRef.current = setTimeout(() => {
//       if (isMounted && !isUndoingRedoingRef.current)
//         pushHistory("settings changed");
//     }, 500);
//     return () => {
//       if (debouncedPushHistoryRef.current) {
//         clearTimeout(debouncedPushHistoryRef.current);
//       }
//     };
//   }, [settings, pushHistory, isMounted]);
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   // --- Main Three.js Setup & Loop (largely unchanged, condensed for brevity) ---
//   useEffect(() => {
//     if (!isMounted || !mountRef.current) return;
//     const currentMount = mountRef.current;
//     const scene = new THREE.Scene();
//     sceneRef.current = scene;
//     const camera = new THREE.PerspectiveCamera(
//       50,
//       currentMount.clientWidth / currentMount.clientHeight,
//       0.1,
//       1000
//     );
//     cameraRef.current = camera;
//     camera.position.set(0, 0.5, 6);
//     const renderer = new THREE.WebGLRenderer({
//       antialias: true,
//       alpha: true,
//       preserveDrawingBuffer: true,
//     });
//     rendererRef.current = renderer;
//     renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.shadowMap.enabled = true;
//     renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//     renderer.outputColorSpace = THREE.SRGBColorSpace;
//     renderer.toneMapping = THREE.ACESFilmicToneMapping;
//     renderer.toneMappingExposure = 1.0;
//     currentMount.appendChild(renderer.domElement);
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controlsRef.current = controls;
//     controls.enableDamping = true;
//     controls.dampingFactor = 0.05;
//     controls.screenSpacePanning = false;
//     controls.minDistance = 1;
//     controls.maxDistance = 30;
//     controls.maxPolarAngle = Math.PI / 1.6;
//     controls.target.set(0, 0.2, 0);
//     const rgbeLoader = new RGBELoader();
//     rgbeLoader.load(
//       "/brown_photostudio_02_4k.hdr",
//       (texture) => {
//         texture.mapping = THREE.EquirectangularReflectionMapping;
//         if (sceneRef.current) {
//           sceneRef.current.environment = texture;
//           envMapTextureRef.current = texture;
//         }
//       },
//       undefined,
//       (error) => {
//         console.error("Error loading HDR:", error);
//         sonnerToast.error("HDR Load Failed", {
//           description: "Studio lighting map failed.",
//         });
//       }
//     );
//     const ambientLight = new THREE.AmbientLight(
//       0xffffff,
//       initialSettings.ambientLight.intensity
//     );
//     scene.add(ambientLight);
//     const keyLight = new THREE.DirectionalLight(
//       0xffffff,
//       initialSettings.keyLight.intensity
//     );
//     keyLight.position.set(5, 8, 5);
//     keyLight.castShadow = true;
//     keyLight.shadow.mapSize.width = 2048;
//     keyLight.shadow.mapSize.height = 2048;
//     keyLight.shadow.camera.near = 0.5;
//     keyLight.shadow.camera.far = 50;
//     keyLight.shadow.bias = -0.0005;
//     scene.add(keyLight);
//     const fillLight = new THREE.DirectionalLight(
//       0xa0c0ff,
//       initialSettings.fillLight.intensity
//     );
//     fillLight.position.set(-5, 3, -3);
//     scene.add(fillLight);
//     lightsRef.current = {
//       ambient: ambientLight,
//       key: keyLight,
//       fill: fillLight,
//     };
//     const composer = new EffectComposer(renderer);
//     composerRef.current = composer;
//     const renderPass = new RenderPass(scene, camera);
//     composer.addPass(renderPass);
//     const ssaoPassInstance = new SSAOPass(
//       scene,
//       camera,
//       currentMount.clientWidth,
//       currentMount.clientHeight
//     );
//     ssaoPassInstance.kernelRadius = 0.6;
//     ssaoPassInstance.minDistance = 0.001;
//     ssaoPassInstance.maxDistance = 0.03;
//     composer.addPass(ssaoPassInstance);
//     ssaoPassRef.current = ssaoPassInstance;
//     const outputPass = new OutputPass();
//     composer.addPass(outputPass);
//     const handleResize = () => {
//       if (!currentMount || !cameraRef.current || !rendererRef.current) return;
//       const width = currentMount.clientWidth;
//       const height = currentMount.clientHeight;
//       cameraRef.current.aspect = width / height;
//       cameraRef.current.updateProjectionMatrix();
//       rendererRef.current.setSize(width, height);
//       if (composerRef.current) {
//         composerRef.current.setSize(width, height);
//         const sPass = composerRef.current.passes.find(
//           (p) => p instanceof SSAOPass
//         );
//         if (sPass) sPass.setSize(width, height);
//       }
//     };
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     const clock = new THREE.Clock();
//     const animate = () => {
//       animationIdRef.current = requestAnimationFrame(animate);
//       if (
//         !sceneRef.current ||
//         !rendererRef.current ||
//         !cameraRef.current ||
//         !isMounted
//       ) {
//         if (animationIdRef.current)
//           cancelAnimationFrame(animationIdRef.current);
//         return;
//       }
//       const delta = clock.getDelta();
//       if (controlsRef.current) controlsRef.current.update();
//       if (meshRef.current && isAnimatingRef.current) {
//         const animSettings = currentSettingsRef.current;
//         const presetKey = animationPresetRef.current;
//         const preset = animationPresets[presetKey];
//         if (preset) {
//           const effDelta = delta * animSettings.animationSpeed;
//           animationState.current.targetRotation.x +=
//             preset.rotationSpeed[0] * 60 * effDelta;
//           animationState.current.targetRotation.y +=
//             preset.rotationSpeed[1] * 60 * effDelta;
//           animationState.current.targetRotation.z +=
//             preset.rotationSpeed[2] * 60 * effDelta;
//           meshRef.current.rotation.x = THREE.MathUtils.lerp(
//             meshRef.current.rotation.x,
//             animationState.current.targetRotation.x,
//             0.1
//           );
//           meshRef.current.rotation.y = THREE.MathUtils.lerp(
//             meshRef.current.rotation.y,
//             animationState.current.targetRotation.y,
//             0.1
//           );
//           meshRef.current.rotation.z = THREE.MathUtils.lerp(
//             meshRef.current.rotation.z,
//             animationState.current.targetRotation.z,
//             0.1
//           );
//           const floatTime =
//             (Date.now() - animationState.current.startTime) *
//             0.001 *
//             animSettings.animationSpeed;
//           animationState.current.floatY =
//             Math.sin(floatTime * (preset.floatSpeed || 0.0001) * 100) *
//             (preset.floatAmplitude || 0);
//           meshRef.current.position.y = animationState.current.floatY;
//         }
//       }
//       if (mixerRef.current && animationPlaybackState === "playing") {
//         mixerRef.current.update(delta * animationPlaybackSpeed);
//         if (activeActionRef.current) {
//           const clipDuration = activeActionRef.current.getClip().duration;
//           const currentTime = activeActionRef.current.time;
//           setAnimationTime(clipDuration > 0 ? currentTime / clipDuration : 0);
//           if (!isAnimationLooping && currentTime >= clipDuration) {
//             setAnimationPlaybackState("stopped");
//             activeActionRef.current.stop();
//             setAnimationTime(1);
//           }
//         }
//       }
//       if (composerRef.current) composerRef.current.render(delta);
//       else if (rendererRef.current)
//         rendererRef.current.render(sceneRef.current, cameraRef.current);
//     };
//     animate();
//     return () => {
//       window.removeEventListener("resize", handleResize);
//       if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
//       controlsRef.current?.dispose();
//       envMapTextureRef.current?.dispose();
//       if (skyboxMeshRef.current) {
//         sceneRef.current?.remove(skyboxMeshRef.current);
//         skyboxMeshRef.current.geometry?.dispose();
//         skyboxMeshRef.current.material?.dispose();
//       }
//       if (meshRef.current) {
//         sceneRef.current?.remove(meshRef.current);
//         meshRef.current.traverse((obj) => {
//           if (obj.geometry) obj.geometry.dispose();
//           if (obj.material) {
//             if (Array.isArray(obj.material))
//               obj.material.forEach((m) => m.dispose());
//             else obj.material.dispose();
//           }
//         });
//       }
//       mixerRef.current = null;
//       activeActionRef.current = null;
//       animationClipsRef.current = [];
//       composerRef.current?.passes.forEach((pass) => pass.dispose?.());
//       ssaoPassRef.current?.dispose?.();
//       sceneRef.current?.traverse((obj) => {
//         if (obj.isLight && obj.shadow && obj.shadow.map)
//           obj.shadow.map.dispose();
//         if (obj.geometry) obj.geometry.dispose();
//         if (obj.material) {
//           const materials = Array.isArray(obj.material)
//             ? obj.material
//             : [obj.material];
//           materials.forEach((mat) => {
//             Object.values(mat).forEach((val) => {
//               if (val instanceof THREE.Texture) val.dispose();
//             });
//             mat.dispose();
//           });
//         }
//       });
//       if (rendererRef.current) {
//         rendererRef.current.dispose();
//         if (mountRef.current && rendererRef.current.domElement) {
//           try {
//             mountRef.current.removeChild(rendererRef.current.domElement);
//           } catch (e) {}
//         }
//       }
//       sceneRef.current = null;
//       cameraRef.current = null;
//       rendererRef.current = null;
//       controlsRef.current = null;
//       composerRef.current = null;
//       ssaoPassRef.current = null;
//       meshRef.current = null;
//       envMapTextureRef.current = null;
//       skyboxMeshRef.current = null;
//       lightsRef.current = { ambient: null, key: null, fill: null };
//     };
//   }, [
//     isMounted,
//     animationPlaybackSpeed,
//     animationPlaybackState,
//     isAnimationLooping,
//   ]);

//   // Update lights based on settings
//   useEffect(() => {
//     if (!isMounted || !lightsRef.current) return;
//     const { keyLight, fillLight, ambientLight } = settings;
//     if (lightsRef.current.key) {
//       lightsRef.current.key.intensity = keyLight.enabled
//         ? keyLight.intensity
//         : 0;
//       lightsRef.current.key.color.set(keyLight.color);
//     }
//     if (lightsRef.current.fill) {
//       lightsRef.current.fill.intensity = fillLight.enabled
//         ? fillLight.intensity
//         : 0;
//       lightsRef.current.fill.color.set(fillLight.color);
//     }
//     if (lightsRef.current.ambient) {
//       lightsRef.current.ambient.intensity = ambientLight.enabled
//         ? ambientLight.intensity
//         : 0;
//       lightsRef.current.ambient.color.set(ambientLight.color);
//     }
//   }, [settings.keyLight, settings.fillLight, settings.ambientLight, isMounted]);
//   // Update background
//   useEffect(() => {
//     if (!isMounted || !sceneRef.current || !rendererRef.current) return;
//     if (skyboxMeshRef.current) {
//       sceneRef.current.remove(skyboxMeshRef.current);
//       skyboxMeshRef.current.geometry?.dispose();
//       skyboxMeshRef.current.material?.dispose();
//       skyboxMeshRef.current = null;
//     }
//     sceneRef.current.background = null;
//     sceneRef.current.fog = null;
//     rendererRef.current.toneMappingExposure = 1.0;
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
//         sceneRef.current.background = new THREE.Color(0x0a0a10);
//         fogC = new THREE.Color(0x050508);
//         fogNear = 10;
//         fogFar = 35;
//         break;
//       case "softLight":
//         sceneRef.current.background = new THREE.Color(0xe0e8f0);
//         fogC = new THREE.Color(0xd0d8e0);
//         fogNear = 7;
//         fogFar = 28;
//         if (rendererRef.current) rendererRef.current.toneMappingExposure = 0.9;
//         break;
//       case "studioDark":
//         sceneRef.current.background = new THREE.Color(0x18181b);
//         fogC = new THREE.Color(0x101012);
//         fogNear = 12;
//         fogFar = 40;
//         break;
//       case "studioLight":
//         sceneRef.current.background = new THREE.Color(0xf4f4f5);
//         fogC = new THREE.Color(0xe4e4e7);
//         fogNear = 10;
//         fogFar = 35;
//         if (rendererRef.current) rendererRef.current.toneMappingExposure = 0.85;
//         break;
//       default:
//         sceneRef.current.background = new THREE.Color(0x18181b);
//         fogC = new THREE.Color(0x101012);
//     }
//     if (settings.background === "modernGradient" && topC && bottomC) {
//       const gradGeom = new THREE.SphereGeometry(50, 32, 32);
//       const gradMat = new THREE.ShaderMaterial({
//         uniforms: {
//           topColor: { value: topC },
//           bottomColor: { value: bottomC },
//           offset: { value: 33 },
//           exponent: { value: 0.6 },
//         },
//         vertexShader: `varying vec3 vWorldPosition; void main() { vec4 worldPosition = modelMatrix * vec4(position, 1.0); vWorldPosition = worldPosition.xyz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
//         fragmentShader: `uniform vec3 topColor; uniform vec3 bottomColor; uniform float offset; uniform float exponent; varying vec3 vWorldPosition; void main() { float h = normalize(vWorldPosition + offset).y; gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0); }`,
//         side: THREE.BackSide,
//       });
//       skyboxMeshRef.current = new THREE.Mesh(gradGeom, gradMat);
//       sceneRef.current.add(skyboxMeshRef.current);
//     }
//     if (fogC) sceneRef.current.fog = new THREE.Fog(fogC, fogNear, fogFar);
//   }, [settings.background, isMounted]);
//   // Update 3D Mesh
//   const {
//     extrudeDepth,
//     quality,
//     shapeColor,
//     materialType,
//     customMaterialProperties,
//   } = settings;
//   useEffect(() => {
//     if (!isMounted || !sceneRef.current) return;
//     if (meshRef.current) {
//       sceneRef.current.remove(meshRef.current);
//       meshRef.current.traverse((obj) => {
//         if (obj.geometry) obj.geometry.dispose();
//         if (obj.material) {
//           if (Array.isArray(obj.material))
//             obj.material.forEach((m) => m.dispose());
//           else obj.material.dispose();
//         }
//       });
//       meshRef.current = null;
//     }
//     if (mixerRef.current) {
//       mixerRef.current.stopAllAction();
//       mixerRef.current = null;
//     }
//     activeActionRef.current = null;
//     animationClipsRef.current = [];
//     let newMesh;
//     if (isImportedModelDisplayed && importedModel && importedModel.scene) {
//       newMesh = importedModel.scene.clone(true);
//       const box = new THREE.Box3().setFromObject(newMesh);
//       const sizeVec = box.getSize(new THREE.Vector3());
//       const maxDim = Math.max(
//         saneNumber(sizeVec.x, 1),
//         saneNumber(sizeVec.y, 1),
//         saneNumber(sizeVec.z, 1)
//       );
//       const desiredDisplaySize = 3;
//       const scaleFactor = maxDim > 0 ? desiredDisplaySize / maxDim : 1;
//       newMesh.scale.set(
//         saneNumber(scaleFactor, 1),
//         saneNumber(scaleFactor, 1),
//         saneNumber(scaleFactor, 1)
//       );
//       const scaledBox = new THREE.Box3().setFromObject(newMesh);
//       const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
//       if (
//         !isNaN(scaledCenter.x) &&
//         !isNaN(scaledCenter.y) &&
//         !isNaN(scaledCenter.z)
//       ) {
//         newMesh.position.sub(scaledCenter);
//       } else {
//         console.warn("Imported model center NaN");
//         sonnerToast.warning("Centering Issue");
//         newMesh.position.set(0, 0, 0);
//       }
//       newMesh.traverse((child) => {
//         if (child.isMesh) {
//           child.castShadow = true;
//           child.receiveShadow = true;
//           if (child.material) {
//             if (Array.isArray(child.material)) {
//               child.material.forEach((m) => (m.side = THREE.DoubleSide));
//             } else {
//               child.material.side = THREE.DoubleSide;
//             }
//           }
//         }
//       });
//       if (importedModel.animations && importedModel.animations.length > 0) {
//         mixerRef.current = new THREE.AnimationMixer(newMesh);
//         animationClipsRef.current = importedModel.animations;
//         if (
//           selectedAnimationClipIndex >= 0 &&
//           selectedAnimationClipIndex < animationClipsRef.current.length
//         ) {
//           const clip = animationClipsRef.current[selectedAnimationClipIndex];
//           activeActionRef.current = mixerRef.current.clipAction(clip);
//           setAnimationDuration(clip.duration);
//           if (animationPlaybackState === "playing")
//             activeActionRef.current.play();
//           activeActionRef.current.setLoop(
//             isAnimationLooping ? THREE.LoopRepeat : THREE.LoopOnce,
//             Infinity
//           );
//           activeActionRef.current.timeScale = animationPlaybackSpeed;
//           if (activeActionRef.current)
//             activeActionRef.current.time = animationTime * clip.duration;
//         } else {
//           setSelectedAnimationClipIndex(-1);
//           setAnimationPlaybackState("stopped");
//         }
//       } else {
//         setSelectedAnimationClipIndex(-1);
//         setAnimationPlaybackState("stopped");
//       }
//     } else {
//       const proceduralSettings = {
//         extrudeDepth,
//         quality,
//         shapeColor,
//         materialType,
//         customMaterialProperties,
//       };
//       newMesh = create3DShape(currentShape, proceduralSettings, 1.5);
//       newMesh.castShadow = true;
//       newMesh.receiveShadow = true;
//       setSelectedAnimationClipIndex(-1);
//       setAnimationPlaybackState("stopped");
//     }
//     newMesh.position.y = 0;
//     animationState.current.floatY = 0;
//     animationState.current.targetRotation.set(0, 0, 0);
//     newMesh.rotation.set(0, 0, 0);
//     sceneRef.current.add(newMesh);
//     meshRef.current = newMesh;
//   }, [
//     currentShape,
//     extrudeDepth,
//     quality,
//     shapeColor,
//     materialType,
//     customMaterialProperties,
//     isMounted,
//     importedModel,
//     isImportedModelDisplayed,
//     selectedAnimationClipIndex,
//     animationPlaybackState,
//     isAnimationLooping,
//     animationPlaybackSpeed,
//     animationTime,
//   ]);

//   // --- UI Callbacks (largely unchanged, condensed) ---
//   const handleResetAnimation = useCallback(() => {
//     animationState.current.targetRotation.set(0, 0, 0);
//     animationState.current.floatY = 0;
//     animationState.current.startTime = Date.now();
//     if (meshRef.current) {
//       meshRef.current.rotation.set(0, 0, 0);
//       meshRef.current.position.y = 0;
//     }
//     if (controlsRef.current) {
//       controlsRef.current.reset();
//       controlsRef.current.target.set(0, 0.2, 0);
//     }
//     sonnerToast.info("View Reset", {
//       description: "Model position and rotation restored.",
//     });
//     pushHistory("reset animation");
//   }, [pushHistory]);
//   const handleToggleGlobalAnimation = useCallback(() => {
//     setIsAnimating((prev) => {
//       const newIsAnimating = !prev;
//       if (newIsAnimating) {
//         const preset = animationPresets[animationPresetRef.current];
//         const floatAmplitude = preset?.floatAmplitude || 0.1;
//         const floatSpeed = preset?.floatSpeed || 0.001;
//         const timeDivisor = floatAmplitude * (floatSpeed * 100);
//         const timeOffset =
//           timeDivisor !== 0
//             ? (animationState.current.floatY / timeDivisor) * 1000
//             : 0;
//         animationState.current.startTime =
//           Date.now() - (isFinite(timeOffset) ? timeOffset : 0);
//       } else {
//         if (meshRef.current)
//           animationState.current.targetRotation.copy(meshRef.current.rotation);
//       }
//       sonnerToast.info(
//         `Floating Animation ${newIsAnimating ? "Resumed" : "Paused"}`
//       );
//       pushHistory(newIsAnimating ? "resume global anim" : "pause global anim");
//       return newIsAnimating;
//     });
//   }, [pushHistory]);
//   const handleCustomMaterialPropChange = (propName, value) => {
//     setSettings((s) => ({
//       ...s,
//       customMaterialProperties: {
//         ...s.customMaterialProperties,
//         [propName]: saneNumber(
//           value,
//           baseMaterialPresets[s.materialType]?.[propName] ?? 0
//         ),
//       },
//     }));
//   };
//   const resetCustomMaterialProperties = () => {
//     const currentPresetKey = settings.materialType;
//     if (
//       currentPresetKey &&
//       currentPresetKey !== "auto" &&
//       baseMaterialPresets[currentPresetKey]
//     ) {
//       const presetDefaults = baseMaterialPresets[currentPresetKey];
//       setSettings((s) => ({
//         ...s,
//         customMaterialProperties: {
//           roughness: presetDefaults.roughness ?? null,
//           metalness: presetDefaults.metalness ?? null,
//           ior: presetDefaults.ior ?? null,
//           transmission: presetDefaults.transmission ?? null,
//           thickness: presetDefaults.thickness ?? null,
//           emissiveIntensity: presetDefaults.emissiveIntensity ?? null,
//         },
//       }));
//       sonnerToast.info("Material Properties Reset", {
//         description: `Values reset to ${currentPresetKey} defaults.`,
//       });
//       pushHistory("reset custom material props");
//     }
//   };
//   const handleCategorySelect = useCallback(
//     (categoryId) => {
//       setIsImportedModelDisplayed(false);
//       setCurrentCategory(categoryId);
//       setCurrentShape(shapesByCategory[categoryId][0].id);
//       handleResetAnimation();
//       pushHistory("category select");
//     },
//     [shapesByCategory, handleResetAnimation, pushHistory]
//   );
//   const handleShapeSelect = useCallback(
//     (shapeId) => {
//       setIsImportedModelDisplayed(false);
//       setCurrentShape(shapeId);
//       handleResetAnimation();
//       pushHistory("shape select");
//     },
//     [handleResetAnimation, pushHistory]
//   );
//   useEffect(() => {
//     if (isMounted && !isUndoingRedoingRef.current) {
//       handleResetAnimation();
//       pushHistory("animation preset change");
//     } // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [animationPreset, isMounted]);
//   const handleRandomize = useCallback(() => {
//     setIsImportedModelDisplayed(false);
//     const randCat = categories[Math.floor(Math.random() * categories.length)];
//     const randShapeList = shapesByCategory[randCat.id];
//     const randShape =
//       randShapeList[Math.floor(Math.random() * randShapeList.length)];
//     const randPresetKey =
//       Object.keys(animationPresets)[
//         Math.floor(Math.random() * Object.keys(animationPresets).length)
//       ];
//     const randColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`;
//     const bgKeys = Object.keys(backgroundOptions);
//     const randBgKey = bgKeys[Math.floor(Math.random() * bgKeys.length)];
//     const matKeys = [
//       "auto",
//       "metallic",
//       "glass",
//       "crystal",
//       "ceramic",
//       "organic",
//       "plastic",
//       "neon",
//     ];
//     const randMat = matKeys[Math.floor(Math.random() * matKeys.length)];
//     setCurrentCategory(randCat.id);
//     setCurrentShape(randShape.id);
//     setAnimationPreset(randPresetKey);
//     const newKeyLight = {
//       enabled: true,
//       intensity: saneNumber(Math.random() * (1.5 - 0.3) + 0.3, 0.7),
//       color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 85%)`,
//     };
//     const newFillLight = {
//       enabled: true,
//       intensity: saneNumber(Math.random() * (1.0 - 0.2) + 0.2, 0.4),
//       color: `hsl(${Math.floor(Math.random() * 360)}, 60%, 75%)`,
//     };
//     const newAmbientLight = {
//       enabled: true,
//       intensity: saneNumber(Math.random() * (0.5 - 0.1) + 0.1, 0.25),
//       color: `hsl(${Math.floor(Math.random() * 360)}, 50%, 70%)`,
//     };
//     setSettings((prev) => ({
//       ...prev,
//       materialType: randMat,
//       shapeColor: randColor,
//       background: randBgKey,
//       extrudeDepth: saneNumber(Math.random() * (1.0 - 0.1) + 0.1, 0.4),
//       animationSpeed: saneNumber(Math.random() * (2.0 - 0.5) + 0.5, 1.0),
//       keyLight: newKeyLight,
//       fillLight: newFillLight,
//       ambientLight: newAmbientLight,
//       customMaterialProperties: JSON.parse(
//         JSON.stringify(initialSettings.customMaterialProperties)
//       ),
//     }));
//     sonnerToast.success("Scene Randomized!", {
//       description: "Enjoy the new look.",
//     });
//     pushHistory("randomize");
//   }, [categories, shapesByCategory, backgroundOptions, pushHistory]);
//   const currentShapeRef = useRef(currentShape);
//   useEffect(() => {
//     currentShapeRef.current = currentShape;
//   }, [currentShape]);
//   const currentImportedModelNameRef = useRef(importedModelName);
//   useEffect(() => {
//     currentImportedModelNameRef.current = importedModelName;
//   }, [importedModelName]);
//   const handleExportGLB = useCallback(() => {
//     if (!meshRef.current || isExporting) return;
//     setIsExporting(true);
//     setExportProgress(0);
//     const exportToastId = sonnerToast.loading("Exporting GLB...", {
//       description: "Preparing model...",
//     });
//     const exporter = new GLTFExporter();
//     let progress = 0;
//     const progInterval = setInterval(() => {
//       progress += Math.floor(Math.random() * 10 + 5);
//       const curProg = Math.min(progress, 95);
//       setExportProgress(curProg);
//       sonnerToast.loading("Exporting GLB...", {
//         id: exportToastId,
//         description: `Processing... ${curProg}%`,
//       });
//       if (curProg >= 95) clearInterval(progInterval);
//     }, 150);
//     setTimeout(() => {
//       try {
//         if (!(meshRef.current instanceof THREE.Object3D))
//           throw new Error("Model not valid for export.");
//         const exportOptions = { binary: true };
//         if (isImportedModelDisplayed && importedModel?.animations?.length > 0)
//           exportOptions.animations = importedModel.animations;
//         exporter.parse(
//           meshRef.current,
//           (gltf) => {
//             clearInterval(progInterval);
//             setExportProgress(100);
//             sonnerToast.success("GLB Export Ready", {
//               id: exportToastId,
//               description: "Download starting.",
//             });
//             if (!(gltf instanceof ArrayBuffer))
//               throw new Error("Exported GLTF not ArrayBuffer.");
//             const blob = new Blob([gltf], { type: "application/octet-stream" });
//             const link = document.createElement("a");
//             link.href = URL.createObjectURL(blob);
//             const fileNameToExport = isImportedModelDisplayed
//               ? currentImportedModelNameRef.current || "imported-model"
//               : currentShapeRef.current || "model";
//             link.download = `shape-${fileNameToExport}.glb`;
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             URL.revokeObjectURL(link.href);
//             setTimeout(() => {
//               setIsExporting(false);
//               setExportProgress(0);
//             }, 500);
//           },
//           (error) => {
//             clearInterval(progInterval);
//             console.error("GLTFExporter.parse error:", error);
//             sonnerToast.error("GLB Export Failed", {
//               id: exportToastId,
//               description: error.message || "GLTF parsing error.",
//             });
//             setIsExporting(false);
//             setExportProgress(0);
//           },
//           exportOptions
//         );
//       } catch (e) {
//         clearInterval(progInterval);
//         console.error("GLTF export setup error:", e);
//         sonnerToast.error("GLB Export Failed", {
//           id: exportToastId,
//           description: e.message || "Unexpected error.",
//         });
//         setIsExporting(false);
//         setExportProgress(0);
//       }
//     }, 100);
//   }, [isExporting, isImportedModelDisplayed, importedModel]);
//   const handleSimulatedExportOBJ = useCallback(() => {
//     if (isExporting) return;
//     setIsExporting(true);
//     setExportProgress(0);
//     const exportToastId = sonnerToast.loading("Exporting OBJ (Simulated)...", {
//       description: "Processing...",
//     });
//     let p = 0;
//     const i = setInterval(() => {
//       p += Math.floor(Math.random() * 15 + 10);
//       const currentProgress = Math.min(p, 100);
//       setExportProgress(currentProgress);
//       sonnerToast.loading("Exporting OBJ (Simulated)...", {
//         id: exportToastId,
//         description: `Processing... ${currentProgress}%`,
//       });
//       if (currentProgress >= 100) {
//         clearInterval(i);
//         const l = document.createElement("a");
//         l.download = `shape-${
//           isImportedModelDisplayed
//             ? currentImportedModelNameRef.current
//             : currentShapeRef.current || "model"
//         }.obj`;
//         l.href =
//           "data:text/plain;charset=utf-8," +
//           encodeURIComponent(
//             "# OBJ file simulated\n# Actual OBJ Exporter Needed"
//           );
//         document.body.appendChild(l);
//         l.click();
//         document.body.removeChild(l);
//         sonnerToast.success("OBJ Export (Simulated) Ready", {
//           id: exportToastId,
//           description: "Simulated OBJ downloaded.",
//         });
//         setTimeout(() => {
//           setIsExporting(false);
//           setExportProgress(0);
//         }, 500);
//       }
//     }, 150);
//   }, [isExporting, isImportedModelDisplayed]);
//   const handleTakeScreenshot = useCallback(() => {
//     if (!rendererRef.current || !sceneRef.current || !cameraRef.current) {
//       sonnerToast.error("Screenshot Failed", {
//         description: "Renderer not ready.",
//       });
//       return;
//     }
//     const screenshotToastId = sonnerToast.loading("Taking Screenshot...", {
//       description: "Capturing image...",
//     });
//     if (composerRef.current) composerRef.current.render();
//     else rendererRef.current.render(sceneRef.current, cameraRef.current);
//     setTimeout(() => {
//       try {
//         const canvas = rendererRef.current.domElement;
//         const link = document.createElement("a");
//         link.download = `screenshot-${
//           isImportedModelDisplayed
//             ? currentImportedModelNameRef.current
//             : currentShapeRef.current || "view"
//         }.png`;
//         link.href = canvas.toDataURL("image/png");
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         sonnerToast.success("Screenshot Saved!", {
//           id: screenshotToastId,
//           description: `${link.download} saved.`,
//         });
//       } catch (e) {
//         console.error("Screenshot error:", e);
//         sonnerToast.error("Screenshot Failed", {
//           id: screenshotToastId,
//           description: e.message || "Could not save.",
//         });
//       }
//     }, 100);
//   }, [isImportedModelDisplayed]);
//   const processAndSetImportedModel = useCallback(
//     (scene, animations, fileName) => {
//       const nameOnly =
//         fileName.split(".").slice(0, -1).join(".") || "Imported Model";
//       setImportedModelName(nameOnly);
//       setImportedModel({ scene, animations: animations || [] });
//       setIsImportedModelDisplayed(true);
//       handleResetAnimation();
//     },
//     [handleResetAnimation]
//   );
//   const processImportedGltf = useCallback(
//     (gltf, fileName) => {
//       processAndSetImportedModel(gltf.scene, gltf.animations, fileName);
//     },
//     [processAndSetImportedModel]
//   );
//   const handleFiles = useCallback(
//     async (files) => {
//       if (!files || files.length === 0) return;
//       const importToastId = sonnerToast.loading("Processing File(s)...");
//       let objFile = null,
//         mtlFile = null,
//         fbxFile = null,
//         tdsFile = null,
//         otherModelFile = null;
//       for (const file of files) {
//         const lowerName = file.name.toLowerCase();
//         if (lowerName.endsWith(".obj")) objFile = file;
//         else if (lowerName.endsWith(".mtl")) mtlFile = file;
//         else if (lowerName.endsWith(".fbx")) fbxFile = file;
//         else if (lowerName.endsWith(".3ds")) tdsFile = file;
//         else if (
//           lowerName.endsWith(".glb") ||
//           lowerName.endsWith(".gltf") ||
//           lowerName.endsWith(".stl")
//         ) {
//           if (!otherModelFile) otherModelFile = file;
//         }
//       }
//       const modelLoadedSuccessfully = (modelName, format) => {
//         sonnerToast.success(`${format} Model Loaded`, {
//           id: importToastId,
//           description: `${modelName} displayed.`,
//         });
//         pushHistory(`import ${format}`);
//       };
//       const modelLoadFailed = (modelName, format, errorMsg) => {
//         sonnerToast.error(`${format} Load Failed`, {
//           id: importToastId,
//           description: `${modelName}: ${errorMsg || "Unknown"}`,
//         });
//       };
//       if (objFile) {
//         sonnerToast.info("Processing OBJ model...", {
//           id: importToastId,
//           description: `Loading ${objFile.name}${
//             mtlFile ? " with " + mtlFile.name : ""
//           }`,
//         });
//         try {
//           const objLoader = new OBJLoader();
//           const mtlLoader = new MTLLoader();
//           let materialsCreator = null;
//           if (
//             mtlFile &&
//             objFile.name.slice(0, -4) === mtlFile.name.slice(0, -4)
//           ) {
//             const mtlText = await mtlFile.text();
//             mtlLoader.setResourcePath("");
//             materialsCreator = mtlLoader.parse(mtlText, "");
//             materialsCreator.preload();
//           }
//           const objText = await objFile.text();
//           if (materialsCreator) objLoader.setMaterials(materialsCreator);
//           const object = objLoader.parse(objText);
//           object.traverse((child) => {
//             if (child.isMesh) {
//               if (child.material) {
//                 if (Array.isArray(child.material))
//                   child.material.forEach(
//                     (mat) => (mat.side = THREE.DoubleSide)
//                   );
//                 else child.material.side = THREE.DoubleSide;
//               } else if (!materialsCreator) {
//                 child.material = createAdvancedMaterial(
//                   currentSettingsRef.current.shapeColor,
//                   "ceramic",
//                   {}
//                 );
//                 child.material.side = THREE.DoubleSide;
//               }
//               child.castShadow = true;
//               child.receiveShadow = true;
//             }
//           });
//           processAndSetImportedModel(object, [], objFile.name);
//           modelLoadedSuccessfully(objFile.name, "OBJ");
//         } catch (error) {
//           console.error("OBJ/MTL Error:", error);
//           modelLoadFailed(objFile.name, "OBJ/MTL", error.message);
//         }
//       } else if (fbxFile) {
//         sonnerToast.info("Processing FBX model...", {
//           id: importToastId,
//           description: `Loading ${fbxFile.name}. This may take a moment...`,
//         });
//         try {
//           const buffer = await fbxFile.arrayBuffer();
//           const loader = new FBXLoader();
//           const object = loader.parse(buffer, "");
//           object.traverse((child) => {
//             if (child.isMesh) {
//               child.castShadow = true;
//               child.receiveShadow = true;
//               if (child.material) {
//                 if (Array.isArray(child.material))
//                   child.material.forEach(
//                     (mat) => (mat.side = THREE.DoubleSide)
//                   );
//                 else child.material.side = THREE.DoubleSide;
//               }
//             }
//           });
//           processAndSetImportedModel(
//             object,
//             object.animations || [],
//             fbxFile.name
//           );
//           modelLoadedSuccessfully(fbxFile.name, "FBX");
//         } catch (error) {
//           console.error("FBX Error:", error);
//           modelLoadFailed(fbxFile.name, "FBX", error.message);
//         }
//       } else if (tdsFile) {
//         sonnerToast.info("Processing 3DS model...", {
//           id: importToastId,
//           description: `Loading ${tdsFile.name}`,
//         });
//         try {
//           const buffer = await tdsFile.arrayBuffer();
//           const loader = new TDSLoader();
//           const object = loader.parse(buffer, "");
//           object.traverse((child) => {
//             if (child.isMesh) {
//               child.castShadow = true;
//               child.receiveShadow = true;
//               if (child.material) {
//                 if (Array.isArray(child.material))
//                   child.material.forEach(
//                     (mat) => (mat.side = THREE.DoubleSide)
//                   );
//                 else child.material.side = THREE.DoubleSide;
//               } else {
//                 child.material = createAdvancedMaterial(
//                   currentSettingsRef.current.shapeColor,
//                   "plastic",
//                   {}
//                 );
//                 child.material.side = THREE.DoubleSide;
//               }
//             }
//           });
//           processAndSetImportedModel(object, [], tdsFile.name);
//           modelLoadedSuccessfully(tdsFile.name, "3DS");
//         } catch (error) {
//           console.error("3DS Error:", error);
//           modelLoadFailed(tdsFile.name, "3DS", error.message);
//         }
//       } else if (otherModelFile) {
//         sonnerToast.info("Processing model...", {
//           id: importToastId,
//           description: `Loading ${otherModelFile.name}`,
//         });
//         const lowerName = otherModelFile.name.toLowerCase();
//         try {
//           const buffer = await otherModelFile.arrayBuffer();
//           if (lowerName.endsWith(".glb") || lowerName.endsWith(".gltf")) {
//             const loader = getGltfLoader();
//             loader.parse(
//               buffer,
//               "",
//               (gltf) => {
//                 processImportedGltf(gltf, otherModelFile.name);
//                 modelLoadedSuccessfully(otherModelFile.name, "GLTF/GLB");
//               },
//               (error) => {
//                 console.error("GLB/GLTF Parse Error:", error);
//                 modelLoadFailed(otherModelFile.name, "GLTF/GLB", error.message);
//               }
//             );
//             return;
//           } else if (lowerName.endsWith(".stl")) {
//             const loader = new STLLoader();
//             const geometry = loader.parse(buffer);
//             if (!geometry.isBufferGeometry)
//               throw new Error("Invalid STL geometry.");
//             const material = createAdvancedMaterial(
//               currentSettingsRef.current.shapeColor,
//               "plastic",
//               {}
//             );
//             const modelScene = new THREE.Mesh(geometry, material);
//             processAndSetImportedModel(modelScene, [], otherModelFile.name);
//             modelLoadedSuccessfully(otherModelFile.name, "STL");
//           }
//         } catch (error) {
//           console.error("Model Load Error:", error);
//           modelLoadFailed(otherModelFile.name, "Model", error.message);
//         }
//       } else {
//         sonnerToast.warning("No Supported File", {
//           id: importToastId,
//           description: "Please select GLB, GLTF, STL, OBJ, FBX or 3DS.",
//         });
//       }
//       if (fileInputRef.current) fileInputRef.current.value = null;
//     },
//     [processImportedGltf, processAndSetImportedModel, pushHistory]
//   );
//   const triggerImport = useCallback(() => {
//     if (fileInputRef.current) fileInputRef.current.click();
//   }, []);
//   const handleFileDropOnViewer = useCallback(
//     (event) => {
//       event.preventDefault();
//       event.stopPropagation();
//       if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
//         handleFiles(Array.from(event.dataTransfer.files));
//       }
//     },
//     [handleFiles]
//   );
//   const handlePlayPauseAnimation = () => {
//     if (!activeActionRef.current) return;
//     if (animationPlaybackState === "playing") {
//       activeActionRef.current.paused = true;
//       setAnimationPlaybackState("paused");
//     } else {
//       activeActionRef.current.paused = false;
//       if (!activeActionRef.current.isRunning()) activeActionRef.current.play();
//       setAnimationPlaybackState("playing");
//     }
//     pushHistory("play/pause imported anim");
//   };
//   const handleStopAnimation = () => {
//     if (!activeActionRef.current) return;
//     activeActionRef.current.stop();
//     setAnimationPlaybackState("stopped");
//     setAnimationTime(0);
//     pushHistory("stop imported anim");
//   };
//   const handleAnimationClipChange = (indexStr) => {
//     const index = parseInt(indexStr, 10);
//     if (
//       mixerRef.current &&
//       index >= 0 &&
//       index < animationClipsRef.current.length
//     ) {
//       if (activeActionRef.current) activeActionRef.current.stop();
//       const clip = animationClipsRef.current[index];
//       activeActionRef.current = mixerRef.current.clipAction(clip);
//       activeActionRef.current.setLoop(
//         isAnimationLooping ? THREE.LoopRepeat : THREE.LoopOnce,
//         Infinity
//       );
//       activeActionRef.current.timeScale = animationPlaybackSpeed;
//       activeActionRef.current.play();
//       setSelectedAnimationClipIndex(index);
//       setAnimationPlaybackState("playing");
//       setAnimationDuration(clip.duration);
//       setAnimationTime(0);
//       pushHistory("change animation clip");
//     }
//   };
//   const handleAnimationTimeChange = (value) => {
//     if (activeActionRef.current && animationDuration > 0) {
//       const newTime = value * animationDuration;
//       activeActionRef.current.time = newTime;
//       if (mixerRef.current) mixerRef.current.update(0);
//       setAnimationTime(value);
//     }
//   };
//   const handleAnimationLoopToggle = (checked) => {
//     setIsAnimationLooping(checked);
//     if (activeActionRef.current) {
//       activeActionRef.current.setLoop(
//         checked ? THREE.LoopRepeat : THREE.LoopOnce,
//         Infinity
//       );
//     }
//     pushHistory("toggle animation loop");
//   };
//   const handleAnimationSpeedChange = (value) => {
//     setAnimationPlaybackSpeed(value);
//     if (activeActionRef.current) {
//       activeActionRef.current.timeScale = value;
//     }
//   };

//   if (!isMounted) {
//     return (
//       <div className='min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-4'>
//         {" "}
//         <Loader2 className='h-12 w-12 animate-spin text-purple-400 mb-4' />{" "}
//         <p className='text-lg font-medium'>Initializing 3D Studio...</p>{" "}
//         <p className='text-sm text-slate-400'>
//           Getting things ready, please wait.
//         </p>{" "}
//       </div>
//     );
//   }
//   const canUndo = historyPointerRef.current > 0;
//   const canRedo =
//     historyPointerRef.current < historyStackRef.current.length - 1;
//   const proceduralMaterialType =
//     settings.materialType === "auto"
//       ? SHAPES_BY_CATEGORY_DATA[currentCategory]?.find(
//           (s) => s.id === currentShape
//         )?.autoMaterial || "ceramic"
//       : settings.materialType;

//   // Helper to render the settings content, used in the Sheet
//   const renderSettingsContent = () => (
//     <div className='space-y-4 py-4 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50 pr-3'>
//       {!isImportedModelDisplayed && (
//         <>
//           <p className='text-sm text-slate-300 font-semibold uppercase tracking-wider'>
//             Procedural Shape Material
//           </p>
//           <div className='space-y-1.5'>
//             <Label
//               htmlFor='materialTypePanel'
//               className='text-sm text-slate-300'
//             >
//               Base Material
//             </Label>
//             <Select
//               value={settings.materialType}
//               onValueChange={(value) => {
//                 setSettings((s) => ({ ...s, materialType: value }));
//                 resetCustomMaterialProperties();
//               }}
//             >
//               <SelectTrigger
//                 id='materialTypePanel'
//                 className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'
//               >
//                 <SelectValue placeholder='Select material' />
//               </SelectTrigger>
//               <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
//                 {[
//                   "auto",
//                   "metallic",
//                   "glass",
//                   "crystal",
//                   "ceramic",
//                   "organic",
//                   "plastic",
//                   "neon",
//                 ].map((type) => (
//                   <SelectItem
//                     key={type}
//                     value={type}
//                     className='capitalize focus:bg-purple-600 focus:text-white'
//                   >
//                     {type}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <div className='space-y-1.5'>
//             <Label htmlFor='shapeColorPanel' className='text-sm text-slate-300'>
//               Base Color
//             </Label>
//             <Input
//               id='shapeColorPanel'
//               type='color'
//               value={settings.shapeColor}
//               onChange={(e) =>
//                 setSettings((s) => ({ ...s, shapeColor: e.target.value }))
//               }
//               className='w-full p-1 h-9 bg-slate-700 border-slate-600 cursor-pointer focus-visible:ring-purple-500'
//             />
//           </div>
//           {settings.materialType !== "auto" && (
//             <div className='p-3 border border-slate-600 rounded-md space-y-3 bg-slate-700/30'>
//               <div className='flex justify-between items-center'>
//                 <h4 className='text-xs font-semibold text-purple-300'>
//                   Fine-tune '{settings.materialType}'
//                 </h4>
//                 <Button
//                   variant='ghost'
//                   size='xs'
//                   onClick={resetCustomMaterialProperties}
//                   className='text-slate-400 hover:text-purple-300 h-7 px-2'
//                 >
//                   Reset
//                 </Button>
//               </div>
//               {(proceduralMaterialType === "metallic" ||
//                 proceduralMaterialType === "glass" ||
//                 proceduralMaterialType === "crystal" ||
//                 proceduralMaterialType === "ceramic" ||
//                 proceduralMaterialType === "organic" ||
//                 proceduralMaterialType === "plastic" ||
//                 proceduralMaterialType === "neon") && (
//                 <div className='space-y-1.5'>
//                   <div className='flex justify-between items-center'>
//                     <Label
//                       htmlFor='customRoughnessPanel'
//                       className='text-xs text-slate-300'
//                     >
//                       Roughness
//                     </Label>
//                     <span className='text-xs text-slate-400'>
//                       {(
//                         settings.customMaterialProperties.roughness ??
//                         baseMaterialPresets[proceduralMaterialType]
//                           ?.roughness ??
//                         0
//                       ).toFixed(2)}
//                     </span>
//                   </div>
//                   <Slider
//                     id='customRoughnessPanel'
//                     min={0}
//                     max={1}
//                     step={0.01}
//                     value={[
//                       settings.customMaterialProperties.roughness ??
//                         baseMaterialPresets[proceduralMaterialType]
//                           ?.roughness ??
//                         0,
//                     ]}
//                     onValueChange={([val]) =>
//                       handleCustomMaterialPropChange("roughness", val)
//                     }
//                     className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//                   />
//                 </div>
//               )}
//               {(proceduralMaterialType === "metallic" ||
//                 proceduralMaterialType === "ceramic" ||
//                 proceduralMaterialType === "plastic") && (
//                 <div className='space-y-1.5'>
//                   <div className='flex justify-between items-center'>
//                     <Label
//                       htmlFor='customMetalnessPanel'
//                       className='text-xs text-slate-300'
//                     >
//                       Metalness
//                     </Label>
//                     <span className='text-xs text-slate-400'>
//                       {(
//                         settings.customMaterialProperties.metalness ??
//                         baseMaterialPresets[proceduralMaterialType]
//                           ?.metalness ??
//                         0
//                       ).toFixed(2)}
//                     </span>
//                   </div>
//                   <Slider
//                     id='customMetalnessPanel'
//                     min={0}
//                     max={1}
//                     step={0.01}
//                     value={[
//                       settings.customMaterialProperties.metalness ??
//                         baseMaterialPresets[proceduralMaterialType]
//                           ?.metalness ??
//                         0,
//                     ]}
//                     onValueChange={([val]) =>
//                       handleCustomMaterialPropChange("metalness", val)
//                     }
//                     className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//                   />
//                 </div>
//               )}
//               {(proceduralMaterialType === "glass" ||
//                 proceduralMaterialType === "crystal") && (
//                 <>
//                   <div className='space-y-1.5'>
//                     <div className='flex justify-between items-center'>
//                       <Label
//                         htmlFor='customIorPanel'
//                         className='text-xs text-slate-300'
//                       >
//                         IOR
//                       </Label>
//                       <span className='text-xs text-slate-400'>
//                         {(
//                           settings.customMaterialProperties.ior ??
//                           baseMaterialPresets[proceduralMaterialType]?.ior ??
//                           1.5
//                         ).toFixed(2)}
//                       </span>
//                     </div>
//                     <Slider
//                       id='customIorPanel'
//                       min={1}
//                       max={2.33}
//                       step={0.01}
//                       value={[
//                         settings.customMaterialProperties.ior ??
//                           baseMaterialPresets[proceduralMaterialType]?.ior ??
//                           1.5,
//                       ]}
//                       onValueChange={([val]) =>
//                         handleCustomMaterialPropChange("ior", val)
//                       }
//                       className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//                     />
//                   </div>
//                   <div className='space-y-1.5'>
//                     <div className='flex justify-between items-center'>
//                       <Label
//                         htmlFor='customTransmissionPanel'
//                         className='text-xs text-slate-300'
//                       >
//                         Transmission
//                       </Label>
//                       <span className='text-xs text-slate-400'>
//                         {(
//                           settings.customMaterialProperties.transmission ??
//                           baseMaterialPresets[proceduralMaterialType]
//                             ?.transmission ??
//                           0
//                         ).toFixed(2)}
//                       </span>
//                     </div>
//                     <Slider
//                       id='customTransmissionPanel'
//                       min={0}
//                       max={1}
//                       step={0.01}
//                       value={[
//                         settings.customMaterialProperties.transmission ??
//                           baseMaterialPresets[proceduralMaterialType]
//                             ?.transmission ??
//                           0,
//                       ]}
//                       onValueChange={([val]) =>
//                         handleCustomMaterialPropChange("transmission", val)
//                       }
//                       className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//                     />
//                   </div>
//                   <div className='space-y-1.5'>
//                     <div className='flex justify-between items-center'>
//                       <Label
//                         htmlFor='customThicknessPanel'
//                         className='text-xs text-slate-300'
//                       >
//                         Thickness
//                       </Label>
//                       <span className='text-xs text-slate-400'>
//                         {(
//                           settings.customMaterialProperties.thickness ??
//                           baseMaterialPresets[proceduralMaterialType]
//                             ?.thickness ??
//                           0
//                         ).toFixed(2)}
//                       </span>
//                     </div>
//                     <Slider
//                       id='customThicknessPanel'
//                       min={0}
//                       max={2}
//                       step={0.01}
//                       value={[
//                         settings.customMaterialProperties.thickness ??
//                           baseMaterialPresets[proceduralMaterialType]
//                             ?.thickness ??
//                           0,
//                       ]}
//                       onValueChange={([val]) =>
//                         handleCustomMaterialPropChange("thickness", val)
//                       }
//                       className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//                     />
//                   </div>
//                 </>
//               )}
//               {proceduralMaterialType === "neon" && (
//                 <div className='space-y-1.5'>
//                   <div className='flex justify-between items-center'>
//                     <Label
//                       htmlFor='customEmissiveIntensityPanel'
//                       className='text-xs text-slate-300'
//                     >
//                       Emissive Intensity
//                     </Label>
//                     <span className='text-xs text-slate-400'>
//                       {(
//                         settings.customMaterialProperties.emissiveIntensity ??
//                         baseMaterialPresets.neon?.emissiveIntensity ??
//                         1.0
//                       ).toFixed(2)}
//                     </span>
//                   </div>
//                   <Slider
//                     id='customEmissiveIntensityPanel'
//                     min={0}
//                     max={5}
//                     step={0.1}
//                     value={[
//                       settings.customMaterialProperties.emissiveIntensity ??
//                         baseMaterialPresets.neon?.emissiveIntensity ??
//                         1.0,
//                     ]}
//                     onValueChange={([val]) =>
//                       handleCustomMaterialPropChange("emissiveIntensity", val)
//                     }
//                     className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//                   />
//                 </div>
//               )}
//             </div>
//           )}
//           <Separator className='my-3 bg-slate-600' />
//           <p className='text-sm text-slate-300 font-semibold uppercase tracking-wider'>
//             Procedural Shape Geometry
//           </p>
//           <div className='space-y-1.5'>
//             <div className='flex justify-between items-center'>
//               <Label
//                 htmlFor='extrudeDepthPanel'
//                 className='text-sm text-slate-300'
//               >
//                 Depth
//               </Label>
//               <span className='text-xs text-slate-400'>
//                 {settings.extrudeDepth.toFixed(2)}
//               </span>
//             </div>
//             <Slider
//               id='extrudeDepthPanel'
//               min={0.05}
//               max={1.5}
//               step={0.05}
//               value={[settings.extrudeDepth]}
//               onValueChange={([value]) =>
//                 setSettings((s) => ({ ...s, extrudeDepth: value }))
//               }
//               className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//             />
//           </div>
//           <div className='space-y-1.5'>
//             <Label htmlFor='qualityPanel' className='text-sm text-slate-300'>
//               Quality
//             </Label>
//             <Select
//               value={settings.quality}
//               onValueChange={(value) =>
//                 setSettings((s) => ({ ...s, quality: value }))
//               }
//             >
//               <SelectTrigger
//                 id='qualityPanel'
//                 className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'
//               >
//                 <SelectValue placeholder='Select quality' />
//               </SelectTrigger>
//               <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
//                 {["low", "medium", "high"].map((q) => (
//                   <SelectItem
//                     key={q}
//                     value={q}
//                     className='capitalize focus:bg-purple-600 focus:text-white'
//                   >
//                     {q}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </>
//       )}

//       <Separator className='my-3 bg-slate-600' />
//       <p className='text-sm text-slate-300 font-semibold uppercase tracking-wider'>
//         General Display
//       </p>
//       <div className='space-y-1.5'>
//         <div className='flex justify-between items-center'>
//           <Label
//             htmlFor='animationSpeedPanel'
//             className='text-sm text-slate-300'
//           >
//             Float Anim. Speed
//           </Label>
//           <span className='text-xs text-slate-400'>
//             {settings.animationSpeed.toFixed(1)}x
//           </span>
//         </div>
//         <Slider
//           id='animationSpeedPanel'
//           min={0.1}
//           max={3}
//           step={0.1}
//           value={[settings.animationSpeed]}
//           onValueChange={([value]) =>
//             setSettings((s) => ({ ...s, animationSpeed: value }))
//           }
//           className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//         />
//       </div>

//       <div className='pt-2 space-y-3'>
//         <p className='text-sm text-slate-300 font-semibold uppercase tracking-wider'>
//           Lighting
//         </p>
//         {["keyLight", "fillLight", "ambientLight"].map((lightKey) => {
//           const lightName =
//             lightKey.replace("Light", "").charAt(0).toUpperCase() +
//             lightKey.replace("Light", "").slice(1);
//           return (
//             <div
//               key={lightKey}
//               className='p-3 border border-slate-600 rounded-md space-y-2 text-xs bg-slate-700/30'
//             >
//               <div className='flex items-center justify-between'>
//                 <Label
//                   htmlFor={`${lightKey}EnablePanel`}
//                   className='text-slate-200 text-sm'
//                 >
//                   {lightName} Light
//                 </Label>
//                 <Switch
//                   id={`${lightKey}EnablePanel`}
//                   checked={settings[lightKey].enabled}
//                   onCheckedChange={(checked) =>
//                     setSettings((s) => ({
//                       ...s,
//                       [lightKey]: { ...s[lightKey], enabled: checked },
//                     }))
//                   }
//                 />
//               </div>
//               {settings[lightKey].enabled && (
//                 <>
//                   <div className='flex justify-between items-center'>
//                     <Label
//                       htmlFor={`${lightKey}IntensityPanel`}
//                       className='text-slate-300'
//                     >
//                       Intensity
//                     </Label>
//                     <span className='text-slate-400'>
//                       {settings[lightKey].intensity.toFixed(2)}
//                     </span>
//                   </div>
//                   <Slider
//                     id={`${lightKey}IntensityPanel`}
//                     min={0}
//                     max={2}
//                     step={0.05}
//                     value={[settings[lightKey].intensity]}
//                     onValueChange={([val]) =>
//                       setSettings((s) => ({
//                         ...s,
//                         [lightKey]: { ...s[lightKey], intensity: val },
//                       }))
//                     }
//                     className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//                   />
//                   <Label
//                     htmlFor={`${lightKey}ColorPanel`}
//                     className='text-slate-300'
//                   >
//                     Color
//                   </Label>
//                   <Input
//                     id={`${lightKey}ColorPanel`}
//                     type='color'
//                     value={settings[lightKey].color}
//                     onChange={(e) =>
//                       setSettings((s) => ({
//                         ...s,
//                         [lightKey]: { ...s[lightKey], color: e.target.value },
//                       }))
//                     }
//                     className='w-full h-7 p-0.5 bg-slate-600 border-slate-500 cursor-pointer'
//                   />
//                 </>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       <div className='space-y-1.5'>
//         <Label htmlFor='backgroundPanel' className='text-sm text-slate-300'>
//           Background
//         </Label>
//         <Select
//           value={settings.background}
//           onValueChange={(value) =>
//             setSettings((s) => ({ ...s, background: value }))
//           }
//         >
//           <SelectTrigger
//             id='backgroundPanel'
//             className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'
//           >
//             <SelectValue placeholder='Select background' />
//           </SelectTrigger>
//           <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
//             {Object.entries(backgroundOptions).map(([key, name]) => (
//               <SelectItem
//                 key={key}
//                 value={key}
//                 className='focus:bg-purple-600 focus:text-white'
//               >
//                 {name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       {isImportedModelDisplayed && animationClipsRef.current.length > 0 && (
//         <>
//           <Separator className='my-3 bg-slate-600' />
//           <p className='text-sm text-slate-300 font-semibold uppercase tracking-wider'>
//             Animation Playback
//           </p>
//           <div className='space-y-4 p-3 border border-slate-600 rounded-md bg-slate-700/30'>
//             <Select
//               value={selectedAnimationClipIndex.toString()}
//               onValueChange={handleAnimationClipChange}
//               disabled={animationClipsRef.current.length === 0}
//             >
//               <SelectTrigger className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'>
//                 <SelectValue placeholder='Select animation clip' />
//               </SelectTrigger>
//               <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
//                 {animationClipsRef.current.map((clip, index) => (
//                   <SelectItem
//                     key={index}
//                     value={index.toString()}
//                     className='focus:bg-purple-600 focus:text-white'
//                   >
//                     {clip.name || `Animation ${index + 1}`}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <div className='grid grid-cols-3 gap-2'>
//               <Button
//                 onClick={handlePlayPauseAnimation}
//                 disabled={selectedAnimationClipIndex < 0}
//                 className={cn(
//                   "bg-green-600 hover:bg-green-700",
//                   animationPlaybackState === "playing" &&
//                     "bg-yellow-500 hover:bg-yellow-600"
//                 )}
//               >
//                 {animationPlaybackState === "playing" ? (
//                   <Pause size={16} />
//                 ) : (
//                   <Play size={16} />
//                 )}
//               </Button>
//               <Button
//                 onClick={handleStopAnimation}
//                 disabled={
//                   selectedAnimationClipIndex < 0 ||
//                   animationPlaybackState === "stopped"
//                 }
//                 className='bg-red-600 hover:bg-red-700'
//               >
//                 <StopCircle size={16} />
//               </Button>
//               <Button
//                 variant={isAnimationLooping ? "secondary" : "outline"}
//                 onClick={() => handleAnimationLoopToggle(!isAnimationLooping)}
//                 disabled={selectedAnimationClipIndex < 0}
//                 className={cn(
//                   isAnimationLooping
//                     ? "bg-purple-500 hover:bg-purple-600 text-white"
//                     : "border-slate-600 text-slate-300 hover:bg-slate-700/50"
//                 )}
//               >
//                 <Repeat size={16} />
//               </Button>
//             </div>
//             <div className='space-y-1.5'>
//               <Label htmlFor='animTimePanel' className='text-sm text-slate-300'>
//                 Time: {(animationTime * animationDuration).toFixed(2)}s /{" "}
//                 {animationDuration.toFixed(2)}s
//               </Label>
//               <Slider
//                 id='animTimePanel'
//                 min={0}
//                 max={1}
//                 step={0.001}
//                 value={[animationTime]}
//                 onValueChange={([val]) => handleAnimationTimeChange(val)}
//                 disabled={
//                   selectedAnimationClipIndex < 0 || animationDuration === 0
//                 }
//                 className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//               />
//             </div>
//             <div className='space-y-1.5'>
//               <Label
//                 htmlFor='animSpeedPanel'
//                 className='text-sm text-slate-300'
//               >
//                 Speed: {animationPlaybackSpeed.toFixed(1)}x
//               </Label>
//               <Slider
//                 id='animSpeedPanel'
//                 min={0.1}
//                 max={3}
//                 step={0.1}
//                 value={[animationPlaybackSpeed]}
//                 onValueChange={([val]) => handleAnimationSpeedChange(val)}
//                 disabled={selectedAnimationClipIndex < 0}
//                 className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//               />
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );

//   return (
//     <>
//       <SonnerToaster richColors position='top-right' />
//       <div className='min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 p-3 sm:p-4 md:p-6 text-slate-100 select-none'>
//         <input
//           type='file'
//           accept='.glb,.gltf,.stl,.obj,.mtl,.fbx,.3ds'
//           multiple
//           ref={fileInputRef}
//           onChange={(e) => handleFiles(Array.from(e.target.files))}
//           style={{ display: "none" }}
//         />
//         <div className='max-w-screen-2xl mx-auto'>
//           <header className='text-center mb-8 sm:mb-10'>
//             <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-3 sm:mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent'>
//               3D Shape Studio Pro
//             </h1>
//             <p className='text-slate-400 text-base sm:text-lg max-w-3xl mx-auto'>
//               Craft, view, and animate 3D masterpieces. Import GLB, GLTF, STL,
//               OBJ, FBX or 3DS models.
//             </p>
//           </header>
//           <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6'>
//             {/* --- Main Left Sidebar --- */}
//             <div className='lg:col-span-3 space-y-4 sm:space-y-5 order-last lg:order-first'>
//               {!isImportedModelDisplayed && (
//                 <>
//                   <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
//                     <CardHeader>
//                       <CardTitle className='text-slate-100'>
//                         Categories
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className='grid grid-cols-2 gap-3'>
//                         {categories.map((category) => (
//                           <Button
//                             key={category.id}
//                             variant={
//                               currentCategory === category.id
//                                 ? "default"
//                                 : "outline"
//                             }
//                             className={cn(
//                               "h-auto py-3 flex flex-col items-center justify-center gap-1.5 text-xs sm:text-sm transition-all",
//                               currentCategory === category.id
//                                 ? "bg-purple-600 hover:bg-purple-700 text-white ring-2 ring-purple-400"
//                                 : "text-slate-300 border-slate-600 hover:bg-slate-700/50"
//                             )}
//                             onClick={() => handleCategorySelect(category.id)}
//                           >
//                             <span className='text-2xl sm:text-3xl'>
//                               {category.icon}
//                             </span>{" "}
//                             <span>{category.name}</span>
//                           </Button>
//                         ))}
//                       </div>
//                     </CardContent>
//                   </Card>
//                   <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
//                     <CardHeader>
//                       <CardTitle className='text-slate-100'>Shapes</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className='grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50'>
//                         {shapesByCategory[currentCategory].map((shape) => (
//                           <Button
//                             key={shape.id}
//                             variant={
//                               currentShape === shape.id ? "secondary" : "ghost"
//                             }
//                             className={cn(
//                               "justify-start gap-2",
//                               currentShape === shape.id
//                                 ? "bg-purple-500 text-white hover:bg-purple-600"
//                                 : "text-slate-300 hover:bg-slate-700/50"
//                             )}
//                             onClick={() => handleShapeSelect(shape.id)}
//                           >
//                             <span className='text-xl'>{shape.icon}</span>{" "}
//                             {shape.name}
//                           </Button>
//                         ))}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </>
//               )}
//               {isImportedModelDisplayed && importedModel && (
//                 <Card className='bg-slate-800/70 border-slate-700 shadow-xl text-center'>
//                   <CardHeader>
//                     <CardTitle className='text-slate-100'>
//                       Current Model
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <p
//                       className='text-sm text-slate-300 truncate font-medium'
//                       title={importedModelName}
//                     >
//                       {importedModelName}
//                     </p>
//                   </CardContent>
//                   <CardFooter>
//                     <Button
//                       variant='destructive'
//                       size='sm'
//                       className='w-full'
//                       onClick={() => {
//                         setImportedModel(null);
//                         setIsImportedModelDisplayed(false);
//                         setImportedModelName("Imported Model");
//                         const defaultCategoryId = categories[0].id;
//                         setCurrentCategory(defaultCategoryId);
//                         setCurrentShape(
//                           shapesByCategory[defaultCategoryId][0].id
//                         );
//                         handleResetAnimation();
//                         sonnerToast.info("Imported Model Cleared", {
//                           description: "Procedural shapes active.",
//                         });
//                         pushHistory("clear imported model");
//                       }}
//                     >
//                       {" "}
//                       <XCircle size={16} className='mr-2' /> Clear Imported{" "}
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               )}

//               <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
//                 <CardHeader>
//                   <CardTitle className='text-slate-100'>
//                     Global Animation & View
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className='space-y-4'>
//                   <Button
//                     onClick={handleToggleGlobalAnimation}
//                     variant={isAnimating ? "destructive" : "default"}
//                     className='w-full bg-green-600 hover:bg-green-700 data-[state=destructive]:bg-red-600 data-[state=destructive]:hover:bg-red-700'
//                     data-state={isAnimating ? "destructive" : "default"}
//                   >
//                     {isAnimating ? (
//                       <Pause size={16} className='mr-2' />
//                     ) : (
//                       <Play size={16} className='mr-2' />
//                     )}{" "}
//                     {isAnimating ? "Pause Float" : "Play Float"}
//                   </Button>
//                   <Select
//                     value={animationPreset}
//                     onValueChange={(val) => {
//                       setAnimationPreset(val);
//                     }}
//                   >
//                     <SelectTrigger className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'>
//                       <SelectValue placeholder='Select float style' />
//                     </SelectTrigger>
//                     <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
//                       {Object.keys(animationPresets).map((presetKey) => (
//                         <SelectItem
//                           key={presetKey}
//                           value={presetKey}
//                           className='capitalize focus:bg-purple-600 focus:text-white'
//                         >
//                           {presetKey.charAt(0).toUpperCase() +
//                             presetKey.slice(1)}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <div className='grid grid-cols-2 gap-3'>
//                     <Button
//                       variant='outline'
//                       onClick={handleResetAnimation}
//                       className='border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
//                     >
//                       {" "}
//                       <RotateCcw size={14} className='mr-2' /> Reset View{" "}
//                     </Button>
//                     <Button
//                       variant='default'
//                       onClick={handleRandomize}
//                       className='bg-indigo-600 hover:bg-indigo-700'
//                     >
//                       {" "}
//                       <Shuffle size={14} className='mr-2' /> Randomize{" "}
//                     </Button>
//                   </div>
//                   <div className='grid grid-cols-2 gap-3 pt-2'>
//                     <Button
//                       variant='outline'
//                       onClick={handleUndo}
//                       disabled={!canUndo}
//                       className='border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 disabled:opacity-50'
//                     >
//                       {" "}
//                       <Undo size={14} className='mr-2' /> Undo{" "}
//                     </Button>
//                     <Button
//                       variant='outline'
//                       onClick={handleRedo}
//                       disabled={!canRedo}
//                       className='border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 disabled:opacity-50'
//                     >
//                       {" "}
//                       <Redo size={14} className='mr-2' /> Redo{" "}
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
//                 <CardHeader>
//                   <CardTitle className='text-slate-100'>
//                     File & Export
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className='space-y-3'>
//                   <Button
//                     onClick={triggerImport}
//                     disabled={isExporting}
//                     className='w-full bg-green-600 hover:bg-green-700'
//                   >
//                     <UploadCloud size={16} className='mr-2' /> Import Model
//                   </Button>
//                   <Button
//                     onClick={handleExportGLB}
//                     disabled={isExporting}
//                     className='w-full bg-blue-600 hover:bg-blue-700'
//                   >
//                     {" "}
//                     <Download size={16} className='mr-2' />{" "}
//                     {isExporting && exportProgress > 0 && exportProgress <= 100
//                       ? `GLB... ${Math.round(exportProgress)}%`
//                       : "Export GLB"}{" "}
//                   </Button>
//                   <Button
//                     onClick={handleSimulatedExportOBJ}
//                     disabled={isExporting}
//                     className='w-full bg-teal-600 hover:bg-teal-700'
//                   >
//                     {" "}
//                     <Download size={16} className='mr-2' />{" "}
//                     {isExporting && exportProgress > 0 && exportProgress <= 100
//                       ? `OBJ... ${Math.round(exportProgress)}%`
//                       : "Export OBJ (Sim.)"}{" "}
//                   </Button>
//                   <Button
//                     onClick={handleTakeScreenshot}
//                     disabled={isExporting}
//                     className='w-full bg-purple-600 hover:bg-purple-700'
//                   >
//                     <Camera size={16} className='mr-2' /> Screenshot
//                   </Button>
//                 </CardContent>
//               </Card>

//               {/* Button to open the Settings Panel */}
//               <Sheet
//                 open={isSettingsPanelOpen}
//                 onOpenChange={setIsSettingsPanelOpen}
//               >
//                 <SheetTrigger asChild>
//                   <Button
//                     variant='outline'
//                     className='w-full border-purple-600 text-purple-300 hover:bg-purple-700/20 hover:text-purple-200 py-3 ring-1 ring-purple-500/70'
//                   >
//                     <Settings2 size={16} className='mr-2' /> Detailed Settings
//                   </Button>
//                 </SheetTrigger>
//                 <SheetContent className='bg-slate-800/95 border-slate-700 text-slate-100 p-0 w-full sm:max-w-sm md:max-w-md backdrop-blur-sm'>
//                   <SheetHeader className='p-4 border-b border-slate-700'>
//                     <SheetTitle className='text-xl text-slate-100'>
//                       Viewer & Model Settings
//                     </SheetTitle>
//                     <SheetDescription className='text-slate-400 text-xs'>
//                       Fine-tune the appearance, lighting, and animation
//                       playback.
//                     </SheetDescription>
//                   </SheetHeader>
//                   {renderSettingsContent()}
//                   <SheetFooter className='p-4 border-t border-slate-700'>
//                     <SheetClose asChild>
//                       <Button
//                         type='button'
//                         variant='outline'
//                         className='w-full border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
//                       >
//                         Close Panel
//                       </Button>
//                     </SheetClose>
//                   </SheetFooter>
//                 </SheetContent>
//               </Sheet>
//             </div>

//             {/* --- Main 3D Viewer Area --- */}
//             <div className='lg:col-span-9 order-first lg:order-last'>
//               <Card className='bg-slate-800/50 border-slate-700/80 shadow-2xl aspect-[4/3] sm:aspect-video lg:aspect-[16/10] overflow-hidden'>
//                 <CardContent className='p-0 w-full h-full relative'>
//                   <div
//                     className='relative w-full h-full'
//                     onDragOver={(e) => {
//                       e.preventDefault();
//                       e.stopPropagation();
//                     }}
//                     onDrop={handleFileDropOnViewer}
//                   >
//                     <div
//                       ref={mountRef}
//                       className='w-full h-full rounded-lg overflow-hidden'
//                     />
//                     {isExporting && (
//                       <div className='absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-lg z-10 backdrop-blur-sm'>
//                         <Card className='bg-slate-100 text-slate-800 p-6 sm:p-8 shadow-2xl text-center w-72'>
//                           <CardHeader className='p-0 mb-4'>
//                             <CardTitle className='text-xl sm:text-2xl'>
//                               Exporting Model
//                             </CardTitle>
//                           </CardHeader>
//                           <CardContent className='p-0 space-y-3'>
//                             {" "}
//                             <div className='text-lg font-semibold'>
//                               {Math.round(exportProgress)}%
//                             </div>{" "}
//                             <Progress
//                               value={exportProgress}
//                               className='w-full h-2.5'
//                             />{" "}
//                             <p className='text-xs text-slate-500'>
//                               Please wait, this may take a moment...
//                             </p>{" "}
//                           </CardContent>
//                         </Card>
//                       </div>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//           <footer className='text-center mt-10 sm:mt-16 py-6 border-t border-slate-700/50'>
//             <p className='text-slate-400 text-sm'>
//               © {new Date().getFullYear()} 3D Shape Studio Pro. All rights
//               reserved.
//             </p>
//             <p className='text-xs text-slate-500 mt-1'>
//               An interactive 3D modeling and visualization tool.
//             </p>
//           </footer>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ModelViewer3D;

// lets try image add as background

// import React, { useRef, useEffect, useState, useCallback } from "react";
// import * as THREE from "three";

// import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
// import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
// import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
// import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";
// import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
// import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
// import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
// import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
// import { TDSLoader } from "three/examples/jsm/loaders/TDSLoader.js";

// import {
//   Download,
//   Play,
//   Pause,
//   RotateCcw,
//   Camera,
//   Shuffle,
//   UploadCloud,
//   XCircle,
//   Loader2,
//   Undo,
//   Redo,
//   StopCircle,
//   Repeat,
//   Settings2,
//   // PanelRightOpen, // No longer needed directly for this button
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Slider } from "@/components/ui/slider";
// import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";
// import { Progress } from "@/components/ui/progress";
// import { Switch } from "@/components/ui/switch";
// import { Separator } from "@/components/ui/separator";
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
//   SheetFooter,
//   SheetClose,
// } from "@/components/ui/sheet";

// import { clsx } from "clsx";
// import { twMerge } from "tailwind-merge";

// export function cn(...inputs) {
//   return twMerge(clsx(inputs));
// }

// const saneNumber = (value, defaultValue = 0) => {
//   const num = Number(value);
//   return isNaN(num) || !isFinite(num) ? defaultValue : num;
// };

// // --- Shape Creation Functions (unchanged) ---
// const createCatShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(0), saneNumber(s * 0.8));
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.6),
//     saneNumber(s * 0.8),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(0)
//   );
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.8),
//     saneNumber(-s * 0.6),
//     saneNumber(-s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(0),
//     saneNumber(-s * 0.8)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.8),
//     saneNumber(-s * 0.6),
//     saneNumber(s * 0.8),
//     saneNumber(0)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(s * 0.6),
//     saneNumber(s * 0.8),
//     saneNumber(0),
//     saneNumber(s * 0.8)
//   );
//   const ear1 = new THREE.Path();
//   ear1.moveTo(saneNumber(-s * 0.4), saneNumber(s * 0.6));
//   ear1.lineTo(saneNumber(-s * 0.7), saneNumber(s * 1.2));
//   ear1.lineTo(saneNumber(-s * 0.1), saneNumber(s * 0.9));
//   ear1.closePath();
//   const ear2 = new THREE.Path();
//   ear2.moveTo(saneNumber(s * 0.4), saneNumber(s * 0.6));
//   ear2.lineTo(saneNumber(s * 0.7), saneNumber(s * 1.2));
//   ear2.lineTo(saneNumber(s * 0.1), saneNumber(s * 0.9));
//   ear2.closePath();
//   shape.holes.push(ear1);
//   shape.holes.push(ear2);
//   return shape;
// };
// const createBirdShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(0), saneNumber(s * 0.6));
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.9),
//     saneNumber(-s * 0.2),
//     saneNumber(-s * 0.6),
//     saneNumber(-s * 0.6)
//   );
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.3),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.3),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.6),
//     saneNumber(-s * 0.6)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.9),
//     saneNumber(-s * 0.2),
//     saneNumber(s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(0),
//     saneNumber(s * 0.6)
//   );
//   const wing = new THREE.Path();
//   wing.moveTo(saneNumber(-s * 0.3), saneNumber(s * 0.2));
//   wing.bezierCurveTo(
//     saneNumber(-s * 0.7),
//     saneNumber(s * 0.3),
//     saneNumber(-s * 0.8),
//     saneNumber(0),
//     saneNumber(-s * 0.5),
//     saneNumber(-s * 0.3)
//   );
//   wing.bezierCurveTo(
//     saneNumber(-s * 0.2),
//     saneNumber(-s * 0.1),
//     saneNumber(-s * 0.1),
//     saneNumber(s * 0.1),
//     saneNumber(-s * 0.3),
//     saneNumber(s * 0.2)
//   );
//   shape.holes.push(wing);
//   return shape;
// };
// const createFishShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(-s * 0.8), saneNumber(0));
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.6),
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.2),
//     saneNumber(s * 0.5),
//     saneNumber(s * 0.2),
//     saneNumber(s * 0.3)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.6),
//     saneNumber(s * 0.2),
//     saneNumber(s * 0.8),
//     saneNumber(0),
//     saneNumber(s * 0.8),
//     saneNumber(0)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.6),
//     saneNumber(-s * 0.2),
//     saneNumber(s * 0.2),
//     saneNumber(-s * 0.3),
//     saneNumber(-s * 0.2),
//     saneNumber(-s * 0.5)
//   );
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.6),
//     saneNumber(-s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(0),
//     saneNumber(-s * 0.8),
//     saneNumber(0)
//   );
//   shape.moveTo(saneNumber(s * 0.8), saneNumber(0));
//   shape.lineTo(saneNumber(s * 1.2), saneNumber(s * 0.3));
//   shape.lineTo(saneNumber(s * 1.0), saneNumber(0));
//   shape.lineTo(saneNumber(s * 1.2), saneNumber(-s * 0.3));
//   shape.lineTo(saneNumber(s * 0.8), saneNumber(0));
//   return shape;
// };
// const createSoccerBallShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const r = s * 0.8;
//   for (let i = 0; i < 6; i++) {
//     const a = (i / 6) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * r);
//     const y = saneNumber(Math.sin(a) * r);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.closePath();
//   const ih = new THREE.Path();
//   const ir = s * 0.4;
//   for (let i = 0; i < 6; i++) {
//     const a = (i / 6) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * ir);
//     const y = saneNumber(Math.sin(a) * ir);
//     if (i === 0) ih.moveTo(x, y);
//     else ih.lineTo(x, y);
//   }
//   ih.closePath();
//   shape.holes.push(ih);
//   return shape;
// };
// const createTennisRacketShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const a = s * 0.6;
//   const b = s * 0.4;
//   for (let i = 0; i <= 32; i++) {
//     const ang = (i / 32) * Math.PI * 2;
//     const x = saneNumber(Math.cos(ang) * a);
//     const y = saneNumber(Math.sin(ang) * b + s * 0.3);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.lineTo(saneNumber(s * 0.1), saneNumber(-s * 0.8));
//   shape.lineTo(saneNumber(-s * 0.1), saneNumber(-s * 0.8));
//   shape.closePath();
//   return shape;
// };
// const createBasketballShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const r = s * 0.8;
//   for (let i = 0; i <= 32; i++) {
//     const a = (i / 32) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * r);
//     const y = saneNumber(Math.sin(a) * r);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.closePath();
//   return shape;
// };
// const createPersonShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const hr = s * 0.2;
//   for (let i = 0; i <= 16; i++) {
//     const a = (i / 16) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * hr);
//     const y = saneNumber(Math.sin(a) * hr + s * 0.6);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.lineTo(saneNumber(-s * 0.3), saneNumber(s * 0.2));
//   shape.lineTo(saneNumber(-s * 0.4), saneNumber(-s * 0.4));
//   shape.lineTo(saneNumber(-s * 0.2), saneNumber(-s * 0.8));
//   shape.lineTo(saneNumber(s * 0.2), saneNumber(-s * 0.8));
//   shape.lineTo(saneNumber(s * 0.4), saneNumber(-s * 0.4));
//   shape.lineTo(saneNumber(s * 0.3), saneNumber(s * 0.2));
//   shape.closePath();
//   return shape;
// };
// const createRobotShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(-sval * 0.4), saneNumber(sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.4), saneNumber(sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.4), saneNumber(sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.4), saneNumber(sval * 0.4));
//   shape.closePath();
//   shape.moveTo(saneNumber(-sval * 0.5), saneNumber(sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.5), saneNumber(sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.5), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.5), saneNumber(-sval * 0.4));
//   shape.closePath();
//   shape.moveTo(saneNumber(-sval * 0.3), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.1), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.1), saneNumber(-sval * 0.8));
//   shape.lineTo(saneNumber(-sval * 0.3), saneNumber(-sval * 0.8));
//   shape.closePath();
//   shape.moveTo(saneNumber(sval * 0.1), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.3), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.3), saneNumber(-sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.1), saneNumber(-sval * 0.8));
//   shape.closePath();
//   return shape;
// };
// const createPhoneShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const w = sval * 0.5;
//   const h = sval * 1.0;
//   const r = sval * 0.1;
//   shape.moveTo(saneNumber(-w + r), saneNumber(h));
//   shape.lineTo(saneNumber(w - r), saneNumber(h));
//   shape.quadraticCurveTo(
//     saneNumber(w),
//     saneNumber(h),
//     saneNumber(w),
//     saneNumber(h - r)
//   );
//   shape.lineTo(saneNumber(w), saneNumber(-h + r));
//   shape.quadraticCurveTo(
//     saneNumber(w),
//     saneNumber(-h),
//     saneNumber(w - r),
//     saneNumber(-h)
//   );
//   shape.lineTo(saneNumber(-w + r), saneNumber(-h));
//   shape.quadraticCurveTo(
//     saneNumber(-w),
//     saneNumber(-h),
//     saneNumber(-w),
//     saneNumber(-h + r)
//   );
//   shape.lineTo(saneNumber(-w), saneNumber(h - r));
//   shape.quadraticCurveTo(
//     saneNumber(-w),
//     saneNumber(h),
//     saneNumber(-w + r),
//     saneNumber(h)
//   );
//   shape.closePath();
//   const screen = new THREE.Path();
//   const sw = w * 0.8;
//   const sh = h * 0.8;
//   const sr = r * 0.5;
//   screen.moveTo(saneNumber(-sw + sr), saneNumber(sh));
//   screen.lineTo(saneNumber(sw - sr), saneNumber(sh));
//   screen.quadraticCurveTo(
//     saneNumber(sw),
//     saneNumber(sh),
//     saneNumber(sw),
//     saneNumber(sh - sr)
//   );
//   screen.lineTo(saneNumber(sw), saneNumber(-sh + sr));
//   screen.quadraticCurveTo(
//     saneNumber(sw),
//     saneNumber(-sh),
//     saneNumber(sw - sr),
//     saneNumber(-sh)
//   );
//   screen.lineTo(saneNumber(-sw + sr), saneNumber(-sh));
//   screen.quadraticCurveTo(
//     saneNumber(-sw),
//     saneNumber(-sh),
//     saneNumber(-sw),
//     saneNumber(-sh + sr)
//   );
//   screen.lineTo(saneNumber(-sw), saneNumber(sh - sr));
//   screen.quadraticCurveTo(
//     saneNumber(-sw),
//     saneNumber(sh),
//     saneNumber(-sw + sr),
//     saneNumber(sh)
//   );
//   screen.closePath();
//   shape.holes.push(screen);
//   return shape;
// };
// const createLightningShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(-sval * 0.2), saneNumber(sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.3), saneNumber(sval * 0.2));
//   shape.lineTo(saneNumber(sval * 0.1), saneNumber(sval * 0.2));
//   shape.lineTo(saneNumber(sval * 0.4), saneNumber(-sval * 0.8));
//   shape.lineTo(saneNumber(-sval * 0.1), saneNumber(-sval * 0.2));
//   shape.lineTo(saneNumber(sval * 0.1), saneNumber(-sval * 0.2));
//   shape.lineTo(saneNumber(-sval * 0.4), saneNumber(sval * 0.8));
//   shape.closePath();
//   return shape;
// };
// const createMusicNoteShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const nr = sval * 0.15;
//   for (let i = 0; i <= 16; i++) {
//     const a = (i / 16) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * nr - sval * 0.2);
//     const y = saneNumber(Math.sin(a) * nr - sval * 0.4);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.lineTo(saneNumber(-sval * 0.05), saneNumber(sval * 0.6));
//   shape.lineTo(saneNumber(sval * 0.05), saneNumber(sval * 0.6));
//   shape.lineTo(saneNumber(sval * 0.05), saneNumber(-sval * 0.25));
//   shape.closePath();
//   shape.moveTo(saneNumber(sval * 0.05), saneNumber(sval * 0.6));
//   shape.bezierCurveTo(
//     saneNumber(sval * 0.4),
//     saneNumber(sval * 0.5),
//     saneNumber(sval * 0.3),
//     saneNumber(sval * 0.2),
//     saneNumber(sval * 0.05),
//     saneNumber(sval * 0.3)
//   );
//   shape.closePath();
//   return shape;
// };

// // --- Material and Shape Data (unchanged for brevity, assumed same as provided) ---
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
// const baseMaterialPresets = {
//   metallic: { metalness: 0.9, roughness: 0.1, envMapIntensity: 1.5 },
//   glass: {
//     metalness: 0.0,
//     roughness: 0.0,
//     transmission: 0.95,
//     thickness: 0.7,
//     transparent: true,
//     opacity: 0.85,
//     envMapIntensity: 2.0,
//     ior: 1.52,
//   },
//   crystal: {
//     metalness: 0.0,
//     roughness: 0.01,
//     transmission: 0.98,
//     thickness: 0.6,
//     transparent: true,
//     opacity: 0.9,
//     envMapIntensity: 2.5,
//     ior: 1.7,
//   },
//   ceramic: { metalness: 0.1, roughness: 0.6, envMapIntensity: 0.8 },
//   organic: { metalness: 0.0, roughness: 0.8, envMapIntensity: 0.5 },
//   plastic: { metalness: 0.0, roughness: 0.3, envMapIntensity: 0.7 },
//   neon: {
//     metalness: 0.0,
//     roughness: 0.1,
//     emissiveIntensity: 1.0,
//     envMapIntensity: 0.2,
//     useEmissive: true,
//   },
// };
// const createAdvancedMaterial = (
//   baseColor,
//   materialType = "standard",
//   customProps = {}
// ) => {
//   const color = new THREE.Color(baseColor);
//   let preset = baseMaterialPresets[materialType] || baseMaterialPresets.ceramic;
//   const finalProps = { ...preset };
//   if (customProps.roughness !== null && customProps.roughness !== undefined)
//     finalProps.roughness = customProps.roughness;
//   if (customProps.metalness !== null && customProps.metalness !== undefined)
//     finalProps.metalness = customProps.metalness;
//   if (customProps.ior !== null && customProps.ior !== undefined)
//     finalProps.ior = customProps.ior;
//   if (
//     customProps.transmission !== null &&
//     customProps.transmission !== undefined
//   )
//     finalProps.transmission = customProps.transmission;
//   if (customProps.thickness !== null && customProps.thickness !== undefined)
//     finalProps.thickness = customProps.thickness;
//   if (
//     customProps.emissiveIntensity !== null &&
//     customProps.emissiveIntensity !== undefined
//   )
//     finalProps.emissiveIntensity = customProps.emissiveIntensity;
//   if (finalProps.useEmissive) {
//     finalProps.emissive = color.clone().multiplyScalar(0.8);
//   }
//   const sharedProps = { color, ...finalProps, side: THREE.DoubleSide };
//   if (materialType === "glass" || materialType === "crystal") {
//     return new THREE.MeshPhysicalMaterial(sharedProps);
//   }
//   return new THREE.MeshStandardMaterial(sharedProps);
// };
// const create3DShape = (shapeId, currentSettings, size = 1) => {
//   let shape;
//   let materialTypeForPreset =
//     currentSettings.materialType === "auto"
//       ? "ceramic"
//       : currentSettings.materialType;
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
//   const config = shapeConfigs[shapeId] || shapeConfigs.cat;
//   const shapeSize = saneNumber(size, 1.5);
//   shape = config.creator(shapeSize);
//   if (currentSettings.materialType === "auto") {
//     materialTypeForPreset = config.autoMaterial;
//   }
//   const extrudeSettings = {
//     depth: saneNumber(currentSettings.extrudeDepth, 0.4),
//     bevelEnabled: true,
//     bevelSegments:
//       currentSettings.quality === "high"
//         ? 10
//         : currentSettings.quality === "medium"
//         ? 6
//         : 3,
//     steps:
//       currentSettings.quality === "high"
//         ? 5
//         : currentSettings.quality === "medium"
//         ? 3
//         : 1,
//     bevelSize: saneNumber(0.035 * (shapeSize / 1.5), 0.02),
//     bevelThickness: saneNumber(0.025 * (shapeSize / 1.5), 0.015),
//     curveSegments:
//       currentSettings.quality === "high"
//         ? 48
//         : currentSettings.quality === "medium"
//         ? 24
//         : 12,
//   };
//   const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
//   geometry.computeVertexNormals();
//   try {
//     geometry.center();
//   } catch (e) {
//     console.error(
//       "Error centering geometry:",
//       e,
//       shapeId,
//       currentSettings,
//       shape
//     );
//     return new THREE.Mesh(
//       new THREE.BoxGeometry(1, 1, 1),
//       new THREE.MeshStandardMaterial({ color: 0xff0000 })
//     );
//   }
//   const material = createAdvancedMaterial(
//     currentSettings.shapeColor,
//     materialTypeForPreset,
//     currentSettings.customMaterialProperties
//   );
//   return new THREE.Mesh(geometry, material);
// };

// const CATEGORIES_DATA = [
//   { id: "animals", name: "Animals", icon: "🐱" },
//   { id: "sports", name: "Sports", icon: "⚽" },
//   { id: "people", name: "People", icon: "👤" },
//   { id: "objects", name: "Objects", icon: "📱" },
// ];
// const SHAPES_BY_CATEGORY_DATA = {
//   animals: [
//     { id: "cat", name: "Cat", icon: "🐱" },
//     { id: "bird", name: "Bird", icon: "🐦" },
//     { id: "fish", name: "Fish", icon: "🐟" },
//   ],
//   sports: [
//     { id: "soccer", name: "Soccer", icon: "⚽" },
//     { id: "tennis", name: "Tennis", icon: "🎾" },
//     { id: "basketball", name: "Basketball", icon: "🏀" },
//   ],
//   people: [
//     { id: "person", name: "Person", icon: "👤" },
//     { id: "robot", name: "Robot", icon: "🤖" },
//   ],
//   objects: [
//     { id: "phone", name: "Phone", icon: "📱" },
//     { id: "lightning", name: "Lightning", icon: "⚡" },
//     { id: "music", name: "Music Note", icon: "🎵" },
//   ],
// };

// const BACKGROUND_OPTIONS_DATA = {
//   modernGradient: "Modern Gradient",
//   darkSpace: "Dark Space",
//   softLight: "Soft Light",
//   studioDark: "Studio Dark",
//   studioLight: "Studio Light",
//   customImage: "Custom Image", // Added
// };

// let gltfLoaderInstance;
// const getGltfLoader = () => {
//   if (!gltfLoaderInstance) {
//     gltfLoaderInstance = new GLTFLoader();
//     const dracoLoader = new DRACOLoader();
//     dracoLoader.setDecoderPath("/draco/gltf/");
//     gltfLoaderInstance.setDRACOLoader(dracoLoader);
//   }
//   return gltfLoaderInstance;
// };

// const initialSettings = {
//   materialType: "auto",
//   shapeColor: "#a78bfa",
//   animationSpeed: 1.0,
//   extrudeDepth: 0.4,
//   quality: "medium",
//   background: "studioDark",
//   keyLight: { enabled: true, intensity: 0.7, color: "#ffffff" },
//   fillLight: { enabled: true, intensity: 0.4, color: "#a0c0ff" },
//   ambientLight: { enabled: true, intensity: 0.25, color: "#ffffff" },
//   customMaterialProperties: {
//     roughness: null,
//     metalness: null,
//     ior: null,
//     transmission: null,
//     thickness: null,
//     emissiveIntensity: null,
//   },
// };

// const ModelViewer3D = () => {
//   const [isMounted, setIsMounted] = useState(false);
//   const mountRef = useRef(null);
//   const sceneRef = useRef(null);
//   const rendererRef = useRef(null);
//   const cameraRef = useRef(null);
//   const controlsRef = useRef(null);
//   const composerRef = useRef(null);
//   const ssaoPassRef = useRef(null);
//   const meshRef = useRef(null);
//   const animationIdRef = useRef(null);
//   const lightsRef = useRef({ key: null, fill: null, ambient: null });
//   const skyboxMeshRef = useRef(null);
//   const envMapTextureRef = useRef(null);
//   const fileInputRef = useRef(null);

//   const [importedModel, setImportedModel] = useState(null);
//   const [isImportedModelDisplayed, setIsImportedModelDisplayed] =
//     useState(false);
//   const [importedModelName, setImportedModelName] = useState("Imported Model");

//   const [currentCategory, setCurrentCategory] = useState(CATEGORIES_DATA[0].id);
//   const [currentShape, setCurrentShape] = useState(
//     SHAPES_BY_CATEGORY_DATA[CATEGORIES_DATA[0].id][0].id
//   );

//   const categories = CATEGORIES_DATA;
//   const shapesByCategory = SHAPES_BY_CATEGORY_DATA;
//   const backgroundOptions = BACKGROUND_OPTIONS_DATA;

//   const [isAnimating, setIsAnimating] = useState(true);
//   const [animationPreset, setAnimationPreset] = useState("gentle");

//   const [settings, setSettings] = useState(
//     JSON.parse(JSON.stringify(initialSettings))
//   );
//   const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);

//   const [isExporting, setIsExporting] = useState(false);
//   const [exportProgress, setExportProgress] = useState(0);

//   // New state for custom background image
//   const [customBgImageUrl, setCustomBgImageUrl] = useState(null);
//   const backgroundTextureRef = useRef(null);

//   const currentSettingsRef = useRef(settings);
//   useEffect(() => {
//     currentSettingsRef.current = settings;
//   }, [settings]);
//   const isAnimatingRef = useRef(isAnimating);
//   useEffect(() => {
//     isAnimatingRef.current = isAnimating;
//   }, [isAnimating]);
//   const animationPresetRef = useRef(animationPreset);
//   useEffect(() => {
//     animationPresetRef.current = animationPreset;
//   }, [animationPreset]);
//   const animationState = useRef({
//     rotation: new THREE.Euler(),
//     targetRotation: new THREE.Euler(),
//     floatY: 0,
//     startTime: Date.now(),
//   });

//   const mixerRef = useRef(null);
//   const animationClipsRef = useRef([]);
//   const activeActionRef = useRef(null);
//   const [selectedAnimationClipIndex, setSelectedAnimationClipIndex] =
//     useState(-1);
//   const [animationPlaybackState, setAnimationPlaybackState] =
//     useState("stopped");
//   const [animationTime, setAnimationTime] = useState(0);
//   const [animationDuration, setAnimationDuration] = useState(0);
//   const [isAnimationLooping, setIsAnimationLooping] = useState(true);
//   const [animationPlaybackSpeed, setAnimationPlaybackSpeed] = useState(1.0);

//   const historyStackRef = useRef([]);
//   const historyPointerRef = useRef(-1);
//   const isUndoingRedoingRef = useRef(false);
//   const MAX_HISTORY = 50;

//   const captureAppState = useCallback(() => {
//     return JSON.parse(
//       JSON.stringify({
//         settings: currentSettingsRef.current,
//         currentCategory,
//         currentShape,
//         animationPreset: animationPresetRef.current,
//         isAnimating: isAnimatingRef.current,
//         importedModelName,
//         isImportedModelDisplayed,
//         selectedAnimationClipIndex,
//         animationPlaybackState,
//         animationTime,
//         isAnimationLooping,
//         animationPlaybackSpeed,
//         customBgImageUrl, // Added for undo/redo
//       })
//     );
//   }, [
//     currentCategory,
//     currentShape,
//     importedModelName,
//     isImportedModelDisplayed,
//     selectedAnimationClipIndex,
//     animationPlaybackState,
//     animationTime,
//     isAnimationLooping,
//     animationPlaybackSpeed,
//     customBgImageUrl, // Added for undo/redo
//   ]);

//   const applyState = useCallback((stateToApply) => {
//     isUndoingRedoingRef.current = true;
//     setSettings(stateToApply.settings);
//     setCurrentCategory(stateToApply.currentCategory);
//     setCurrentShape(stateToApply.currentShape);
//     setAnimationPreset(stateToApply.animationPreset);
//     setIsAnimating(stateToApply.isAnimating);
//     setImportedModelName(stateToApply.importedModelName);
//     setIsImportedModelDisplayed(stateToApply.isImportedModelDisplayed);
//     setSelectedAnimationClipIndex(stateToApply.selectedAnimationClipIndex);
//     setAnimationPlaybackState(stateToApply.animationPlaybackState);
//     setAnimationTime(stateToApply.animationTime);
//     setIsAnimationLooping(stateToApply.isAnimationLooping);
//     setAnimationPlaybackSpeed(stateToApply.animationPlaybackSpeed);
//     setCustomBgImageUrl(stateToApply.customBgImageUrl); // Added for undo/redo

//     if (activeActionRef.current) {
//       if (stateToApply.animationPlaybackState === "playing") {
//         activeActionRef.current.paused = false;
//         if (!activeActionRef.current.isRunning())
//           activeActionRef.current.play();
//         activeActionRef.current.time =
//           stateToApply.animationTime *
//           activeActionRef.current.getClip().duration;
//       } else if (stateToApply.animationPlaybackState === "paused") {
//         activeActionRef.current.paused = true;
//         activeActionRef.current.time =
//           stateToApply.animationTime *
//           activeActionRef.current.getClip().duration;
//       } else {
//         activeActionRef.current.stop();
//       }
//     }
//     requestAnimationFrame(() => {
//       isUndoingRedoingRef.current = false;
//     });
//   }, []);

//   const pushHistory = useCallback(
//     (actionName = "action") => {
//       if (isUndoingRedoingRef.current) return;
//       const currentState = captureAppState();
//       const previousState = historyStackRef.current[historyPointerRef.current];
//       if (
//         previousState &&
//         JSON.stringify(currentState) === JSON.stringify(previousState)
//       ) {
//         return;
//       }
//       const stack = historyStackRef.current.slice(
//         0,
//         historyPointerRef.current + 1
//       );
//       stack.push(currentState);
//       if (stack.length > MAX_HISTORY) {
//         stack.shift();
//       }
//       historyStackRef.current = stack;
//       historyPointerRef.current = stack.length - 1;
//     },
//     [captureAppState]
//   );

//   const handleUndo = useCallback(() => {
//     if (historyPointerRef.current > 0) {
//       historyPointerRef.current--;
//       applyState(historyStackRef.current[historyPointerRef.current]);
//       sonnerToast.info("Undo", { description: "Reverted to previous state." });
//     } else {
//       sonnerToast.warning("Undo", { description: "Nothing more to undo." });
//     }
//   }, [applyState]);

//   const handleRedo = useCallback(() => {
//     if (historyPointerRef.current < historyStackRef.current.length - 1) {
//       historyPointerRef.current++;
//       applyState(historyStackRef.current[historyPointerRef.current]);
//       sonnerToast.info("Redo", { description: "Reverted to next state." });
//     } else {
//       sonnerToast.warning("Redo", { description: "Nothing more to redo." });
//     }
//   }, [applyState]);

//   useEffect(() => {
//     if (isMounted) {
//       pushHistory("initial load");
//     }
//   }, [isMounted, pushHistory]); // Removed eslint-disable-next-line for pushHistory

//   const debouncedPushHistoryRef = useRef(null);
//   useEffect(() => {
//     if (debouncedPushHistoryRef.current) {
//       clearTimeout(debouncedPushHistoryRef.current);
//     }
//     debouncedPushHistoryRef.current = setTimeout(() => {
//       if (isMounted && !isUndoingRedoingRef.current)
//         pushHistory("settings changed");
//     }, 500);
//     return () => {
//       if (debouncedPushHistoryRef.current) {
//         clearTimeout(debouncedPushHistoryRef.current);
//       }
//     };
//   }, [settings, customBgImageUrl, pushHistory, isMounted]); // Added customBgImageUrl

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   // --- Main Three.js Setup & Loop ---
//   useEffect(() => {
//     if (!isMounted || !mountRef.current) return;
//     const currentMount = mountRef.current;
//     const scene = new THREE.Scene();
//     sceneRef.current = scene;
//     const camera = new THREE.PerspectiveCamera(
//       50,
//       currentMount.clientWidth / currentMount.clientHeight,
//       0.1,
//       1000
//     );
//     cameraRef.current = camera;
//     camera.position.set(0, 0.5, 6);
//     const renderer = new THREE.WebGLRenderer({
//       antialias: true,
//       alpha: true,
//       preserveDrawingBuffer: true,
//     });
//     rendererRef.current = renderer;
//     renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.shadowMap.enabled = true;
//     renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//     renderer.outputColorSpace = THREE.SRGBColorSpace;
//     renderer.toneMapping = THREE.ACESFilmicToneMapping;
//     renderer.toneMappingExposure = 1.0;
//     currentMount.appendChild(renderer.domElement);
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controlsRef.current = controls;
//     controls.enableDamping = true;
//     controls.dampingFactor = 0.05;
//     controls.screenSpacePanning = false;
//     controls.minDistance = 1;
//     controls.maxDistance = 30;
//     controls.maxPolarAngle = Math.PI / 1.6;
//     controls.target.set(0, 0.2, 0);

//     const rgbeLoader = new RGBELoader();
//     rgbeLoader.load(
//       "/brown_photostudio_02_4k.hdr",
//       (texture) => {
//         texture.mapping = THREE.EquirectangularReflectionMapping;
//         if (sceneRef.current) {
//           sceneRef.current.environment = texture;
//           envMapTextureRef.current = texture;
//         }
//       },
//       undefined,
//       (error) => {
//         console.error("Error loading HDR:", error);
//         sonnerToast.error("HDR Load Failed", {
//           description: "Studio lighting map failed.",
//         });
//       }
//     );

//     const ambientLight = new THREE.AmbientLight(
//       0xffffff,
//       initialSettings.ambientLight.intensity
//     );
//     scene.add(ambientLight);
//     const keyLight = new THREE.DirectionalLight(
//       0xffffff,
//       initialSettings.keyLight.intensity
//     );
//     keyLight.position.set(5, 8, 5);
//     keyLight.castShadow = true;
//     keyLight.shadow.mapSize.width = 2048;
//     keyLight.shadow.mapSize.height = 2048;
//     keyLight.shadow.camera.near = 0.5;
//     keyLight.shadow.camera.far = 50;
//     keyLight.shadow.bias = -0.0005;
//     scene.add(keyLight);
//     const fillLight = new THREE.DirectionalLight(
//       0xa0c0ff,
//       initialSettings.fillLight.intensity
//     );
//     fillLight.position.set(-5, 3, -3);
//     scene.add(fillLight);
//     lightsRef.current = {
//       ambient: ambientLight,
//       key: keyLight,
//       fill: fillLight,
//     };

//     const composer = new EffectComposer(renderer);
//     composerRef.current = composer;
//     const renderPass = new RenderPass(scene, camera);
//     composer.addPass(renderPass);
//     const ssaoPassInstance = new SSAOPass(
//       scene,
//       camera,
//       currentMount.clientWidth,
//       currentMount.clientHeight
//     );
//     ssaoPassInstance.kernelRadius = 0.6;
//     ssaoPassInstance.minDistance = 0.001;
//     ssaoPassInstance.maxDistance = 0.03;
//     composer.addPass(ssaoPassInstance);
//     ssaoPassRef.current = ssaoPassInstance;
//     const outputPass = new OutputPass();
//     composer.addPass(outputPass);

//     const handleResize = () => {
//       if (!currentMount || !cameraRef.current || !rendererRef.current) return;
//       const width = currentMount.clientWidth;
//       const height = currentMount.clientHeight;
//       cameraRef.current.aspect = width / height;
//       cameraRef.current.updateProjectionMatrix();
//       rendererRef.current.setSize(width, height);
//       if (composerRef.current) {
//         composerRef.current.setSize(width, height);
//         const sPass = composerRef.current.passes.find(
//           (p) => p instanceof SSAOPass
//         );
//         if (sPass) sPass.setSize(width, height);
//       }
//     };
//     window.addEventListener("resize", handleResize);
//     handleResize();

//     const clock = new THREE.Clock();
//     const animate = () => {
//       animationIdRef.current = requestAnimationFrame(animate);
//       if (
//         !sceneRef.current ||
//         !rendererRef.current ||
//         !cameraRef.current ||
//         !isMounted
//       ) {
//         if (animationIdRef.current)
//           cancelAnimationFrame(animationIdRef.current);
//         return;
//       }
//       const delta = clock.getDelta();
//       if (controlsRef.current) controlsRef.current.update();

//       if (meshRef.current && isAnimatingRef.current) {
//         // ... (animation logic remains the same)
//         const animSettings = currentSettingsRef.current;
//         const presetKey = animationPresetRef.current;
//         const preset = animationPresets[presetKey];
//         if (preset) {
//           const effDelta = delta * animSettings.animationSpeed;
//           animationState.current.targetRotation.x +=
//             preset.rotationSpeed[0] * 60 * effDelta;
//           animationState.current.targetRotation.y +=
//             preset.rotationSpeed[1] * 60 * effDelta;
//           animationState.current.targetRotation.z +=
//             preset.rotationSpeed[2] * 60 * effDelta;
//           meshRef.current.rotation.x = THREE.MathUtils.lerp(
//             meshRef.current.rotation.x,
//             animationState.current.targetRotation.x,
//             0.1
//           );
//           meshRef.current.rotation.y = THREE.MathUtils.lerp(
//             meshRef.current.rotation.y,
//             animationState.current.targetRotation.y,
//             0.1
//           );
//           meshRef.current.rotation.z = THREE.MathUtils.lerp(
//             meshRef.current.rotation.z,
//             animationState.current.targetRotation.z,
//             0.1
//           );
//           const floatTime =
//             (Date.now() - animationState.current.startTime) *
//             0.001 *
//             animSettings.animationSpeed;
//           animationState.current.floatY =
//             Math.sin(floatTime * (preset.floatSpeed || 0.0001) * 100) *
//             (preset.floatAmplitude || 0);
//           meshRef.current.position.y = animationState.current.floatY;
//         }
//       }

//       if (mixerRef.current && animationPlaybackState === "playing") {
//         mixerRef.current.update(delta * animationPlaybackSpeed);
//         if (activeActionRef.current) {
//           const clipDuration = activeActionRef.current.getClip().duration;
//           const currentTime = activeActionRef.current.time;
//           setAnimationTime(clipDuration > 0 ? currentTime / clipDuration : 0);
//           if (!isAnimationLooping && currentTime >= clipDuration) {
//             setAnimationPlaybackState("stopped");
//             activeActionRef.current.stop();
//             setAnimationTime(1);
//           }
//         }
//       }

//       if (composerRef.current) composerRef.current.render(delta);
//       else if (rendererRef.current)
//         rendererRef.current.render(sceneRef.current, cameraRef.current);
//     };
//     animate();

//     return () => {
//       window.removeEventListener("resize", handleResize);
//       if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
//       controlsRef.current?.dispose();
//       envMapTextureRef.current?.dispose();
//       if (skyboxMeshRef.current) {
//         sceneRef.current?.remove(skyboxMeshRef.current);
//         skyboxMeshRef.current.geometry?.dispose();
//         skyboxMeshRef.current.material?.dispose();
//       }
//       if (backgroundTextureRef.current) {
//         backgroundTextureRef.current.dispose();
//         backgroundTextureRef.current = null;
//       }
//       if (meshRef.current) {
//         // ... (mesh cleanup)
//         sceneRef.current?.remove(meshRef.current);
//         meshRef.current.traverse((obj) => {
//           if (obj.geometry) obj.geometry.dispose();
//           if (obj.material) {
//             if (Array.isArray(obj.material))
//               obj.material.forEach((m) => m.dispose());
//             else obj.material.dispose();
//           }
//         });
//       }
//       mixerRef.current = null;
//       activeActionRef.current = null;
//       animationClipsRef.current = [];
//       composerRef.current?.passes.forEach((pass) => pass.dispose?.());
//       ssaoPassRef.current?.dispose?.();
//       sceneRef.current?.traverse((obj) => {
//         // ... (scene object cleanup)
//         if (obj.isLight && obj.shadow && obj.shadow.map)
//           obj.shadow.map.dispose();
//         if (obj.geometry) obj.geometry.dispose();
//         if (obj.material) {
//           const materials = Array.isArray(obj.material)
//             ? obj.material
//             : [obj.material];
//           materials.forEach((mat) => {
//             Object.values(mat).forEach((val) => {
//               if (val instanceof THREE.Texture) val.dispose();
//             });
//             mat.dispose();
//           });
//         }
//       });
//       if (rendererRef.current) {
//         rendererRef.current.dispose();
//         if (mountRef.current && rendererRef.current.domElement) {
//           try {
//             mountRef.current.removeChild(rendererRef.current.domElement);
//           } catch (e) {}
//         }
//       }
//       sceneRef.current = null;
//       cameraRef.current = null;
//       rendererRef.current = null;
//       controlsRef.current = null;
//       composerRef.current = null;
//       ssaoPassRef.current = null;
//       meshRef.current = null;
//       envMapTextureRef.current = null;
//       skyboxMeshRef.current = null;
//       lightsRef.current = { ambient: null, key: null, fill: null };
//     };
//   }, [
//     isMounted,
//     animationPlaybackSpeed,
//     animationPlaybackState,
//     isAnimationLooping,
//   ]);

//   // Update lights based on settings
//   useEffect(() => {
//     if (!isMounted || !lightsRef.current) return;
//     const { keyLight, fillLight, ambientLight } = settings;
//     if (lightsRef.current.key) {
//       lightsRef.current.key.intensity = keyLight.enabled
//         ? keyLight.intensity
//         : 0;
//       lightsRef.current.key.color.set(keyLight.color);
//     }
//     if (lightsRef.current.fill) {
//       lightsRef.current.fill.intensity = fillLight.enabled
//         ? fillLight.intensity
//         : 0;
//       lightsRef.current.fill.color.set(fillLight.color);
//     }
//     if (lightsRef.current.ambient) {
//       lightsRef.current.ambient.intensity = ambientLight.enabled
//         ? ambientLight.intensity
//         : 0;
//       lightsRef.current.ambient.color.set(ambientLight.color);
//     }
//   }, [settings.keyLight, settings.fillLight, settings.ambientLight, isMounted]);

//   // Update background
//   useEffect(() => {
//     if (!isMounted || !sceneRef.current || !rendererRef.current) return;

//     // Clear previous background settings
//     if (skyboxMeshRef.current) {
//       sceneRef.current.remove(skyboxMeshRef.current);
//       skyboxMeshRef.current.geometry?.dispose();
//       skyboxMeshRef.current.material?.dispose();
//       skyboxMeshRef.current = null;
//     }
//     if (backgroundTextureRef.current) {
//       backgroundTextureRef.current.dispose();
//       backgroundTextureRef.current = null;
//     }
//     sceneRef.current.background = null;
//     sceneRef.current.fog = null;
//     rendererRef.current.toneMappingExposure = 1.0;

//     let topC,
//       bottomC,
//       fogC,
//       fogNear = 8,
//       fogFar = 30;

//     if (settings.background === "customImage" && customBgImageUrl) {
//       const textureLoader = new THREE.TextureLoader();
//       textureLoader.load(
//         customBgImageUrl,
//         (texture) => {
//           if (!sceneRef.current || !rendererRef.current) return; // Component might have unmounted
//           texture.colorSpace = THREE.SRGBColorSpace;
//           sceneRef.current.background = texture;
//           backgroundTextureRef.current = texture; // Store for disposal
//           rendererRef.current.toneMappingExposure = 1.0;
//         },
//         undefined,
//         (err) => {
//           console.error("Error loading custom background image:", err);
//           sonnerToast.error("Failed to load custom background.");
//           if (sceneRef.current)
//             sceneRef.current.background = new THREE.Color(0x18181b); // Fallback
//         }
//       );
//     } else {
//       switch (settings.background) {
//         case "modernGradient":
//           topC = new THREE.Color(0x3a7ca5);
//           bottomC = new THREE.Color(0x1e3b49);
//           fogC = new THREE.Color(0x2c5d72);
//           break;
//         case "darkSpace":
//           sceneRef.current.background = new THREE.Color(0x0a0a10);
//           fogC = new THREE.Color(0x050508);
//           fogNear = 10;
//           fogFar = 35;
//           break;
//         case "softLight":
//           sceneRef.current.background = new THREE.Color(0xe0e8f0);
//           fogC = new THREE.Color(0xd0d8e0);
//           fogNear = 7;
//           fogFar = 28;
//           if (rendererRef.current)
//             rendererRef.current.toneMappingExposure = 0.9;
//           break;
//         case "studioDark":
//           sceneRef.current.background = new THREE.Color(0x18181b);
//           fogC = new THREE.Color(0x101012);
//           fogNear = 12;
//           fogFar = 40;
//           break;
//         case "studioLight":
//           sceneRef.current.background = new THREE.Color(0xf4f4f5);
//           fogC = new THREE.Color(0xe4e4e7);
//           fogNear = 10;
//           fogFar = 35;
//           if (rendererRef.current)
//             rendererRef.current.toneMappingExposure = 0.85;
//           break;
//         default:
//           sceneRef.current.background = new THREE.Color(0x18181b);
//           fogC = new THREE.Color(0x101012);
//       }

//       if (settings.background === "modernGradient" && topC && bottomC) {
//         const gradGeom = new THREE.SphereGeometry(50, 32, 32);
//         const gradMat = new THREE.ShaderMaterial({
//           uniforms: {
//             topColor: { value: topC },
//             bottomColor: { value: bottomC },
//             offset: { value: 33 },
//             exponent: { value: 0.6 },
//           },
//           vertexShader: `varying vec3 vWorldPosition; void main() { vec4 worldPosition = modelMatrix * vec4(position, 1.0); vWorldPosition = worldPosition.xyz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
//           fragmentShader: `uniform vec3 topColor; uniform vec3 bottomColor; uniform float offset; uniform float exponent; varying vec3 vWorldPosition; void main() { float h = normalize(vWorldPosition + offset).y; gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0); }`,
//           side: THREE.BackSide,
//         });
//         skyboxMeshRef.current = new THREE.Mesh(gradGeom, gradMat);
//         sceneRef.current.add(skyboxMeshRef.current);
//       }
//       if (fogC) sceneRef.current.fog = new THREE.Fog(fogC, fogNear, fogFar);
//     }
//   }, [settings.background, customBgImageUrl, isMounted]);

//   // Update 3D Mesh (condensed, no changes to core logic)
//   const {
//     extrudeDepth,
//     quality,
//     shapeColor,
//     materialType,
//     customMaterialProperties,
//   } = settings;
//   useEffect(() => {
//     if (!isMounted || !sceneRef.current) return;
//     // ... (mesh creation/update logic remains the same)
//     if (meshRef.current) {
//       sceneRef.current.remove(meshRef.current);
//       meshRef.current.traverse((obj) => {
//         if (obj.geometry) obj.geometry.dispose();
//         if (obj.material) {
//           if (Array.isArray(obj.material))
//             obj.material.forEach((m) => m.dispose());
//           else obj.material.dispose();
//         }
//       });
//       meshRef.current = null;
//     }
//     if (mixerRef.current) {
//       mixerRef.current.stopAllAction();
//       mixerRef.current = null;
//     }
//     activeActionRef.current = null;
//     animationClipsRef.current = [];
//     let newMesh;
//     if (isImportedModelDisplayed && importedModel && importedModel.scene) {
//       newMesh = importedModel.scene.clone(true);
//       const box = new THREE.Box3().setFromObject(newMesh);
//       const sizeVec = box.getSize(new THREE.Vector3());
//       const maxDim = Math.max(
//         saneNumber(sizeVec.x, 1),
//         saneNumber(sizeVec.y, 1),
//         saneNumber(sizeVec.z, 1)
//       );
//       const desiredDisplaySize = 3;
//       const scaleFactor = maxDim > 0 ? desiredDisplaySize / maxDim : 1;
//       newMesh.scale.set(
//         saneNumber(scaleFactor, 1),
//         saneNumber(scaleFactor, 1),
//         saneNumber(scaleFactor, 1)
//       );
//       const scaledBox = new THREE.Box3().setFromObject(newMesh);
//       const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
//       if (
//         !isNaN(scaledCenter.x) &&
//         !isNaN(scaledCenter.y) &&
//         !isNaN(scaledCenter.z)
//       ) {
//         newMesh.position.sub(scaledCenter);
//       } else {
//         console.warn("Imported model center NaN");
//         sonnerToast.warning("Centering Issue");
//         newMesh.position.set(0, 0, 0);
//       }
//       newMesh.traverse((child) => {
//         if (child.isMesh) {
//           child.castShadow = true;
//           child.receiveShadow = true;
//           if (child.material) {
//             if (Array.isArray(child.material)) {
//               child.material.forEach((m) => (m.side = THREE.DoubleSide));
//             } else {
//               child.material.side = THREE.DoubleSide;
//             }
//           }
//         }
//       });
//       if (importedModel.animations && importedModel.animations.length > 0) {
//         mixerRef.current = new THREE.AnimationMixer(newMesh);
//         animationClipsRef.current = importedModel.animations;
//         if (
//           selectedAnimationClipIndex >= 0 &&
//           selectedAnimationClipIndex < animationClipsRef.current.length
//         ) {
//           const clip = animationClipsRef.current[selectedAnimationClipIndex];
//           activeActionRef.current = mixerRef.current.clipAction(clip);
//           setAnimationDuration(clip.duration);
//           if (animationPlaybackState === "playing")
//             activeActionRef.current.play();
//           activeActionRef.current.setLoop(
//             isAnimationLooping ? THREE.LoopRepeat : THREE.LoopOnce,
//             Infinity
//           );
//           activeActionRef.current.timeScale = animationPlaybackSpeed;
//           if (activeActionRef.current)
//             activeActionRef.current.time = animationTime * clip.duration;
//         } else {
//           setSelectedAnimationClipIndex(-1);
//           setAnimationPlaybackState("stopped");
//         }
//       } else {
//         setSelectedAnimationClipIndex(-1);
//         setAnimationPlaybackState("stopped");
//       }
//     } else {
//       const proceduralSettings = {
//         extrudeDepth,
//         quality,
//         shapeColor,
//         materialType,
//         customMaterialProperties,
//       };
//       newMesh = create3DShape(currentShape, proceduralSettings, 1.5);
//       newMesh.castShadow = true;
//       newMesh.receiveShadow = true;
//       setSelectedAnimationClipIndex(-1);
//       setAnimationPlaybackState("stopped");
//     }
//     newMesh.position.y = 0;
//     animationState.current.floatY = 0;
//     animationState.current.targetRotation.set(0, 0, 0);
//     newMesh.rotation.set(0, 0, 0);
//     sceneRef.current.add(newMesh);
//     meshRef.current = newMesh;
//   }, [
//     currentShape,
//     extrudeDepth,
//     quality,
//     shapeColor,
//     materialType,
//     customMaterialProperties,
//     isMounted,
//     importedModel,
//     isImportedModelDisplayed,
//     selectedAnimationClipIndex,
//     animationPlaybackState,
//     isAnimationLooping,
//     animationPlaybackSpeed,
//     animationTime,
//   ]);

//   // --- UI Callbacks ---
//   const handleResetAnimation = useCallback(() => {
//     animationState.current.targetRotation.set(0, 0, 0);
//     animationState.current.floatY = 0;
//     animationState.current.startTime = Date.now();
//     if (meshRef.current) {
//       meshRef.current.rotation.set(0, 0, 0);
//       meshRef.current.position.y = 0;
//     }
//     if (controlsRef.current) {
//       controlsRef.current.reset();
//       controlsRef.current.target.set(0, 0.2, 0);
//     }
//     sonnerToast.info("View Reset", {
//       description: "Model position and rotation restored.",
//     });
//     pushHistory("reset animation");
//   }, [pushHistory]);

//   const handleToggleGlobalAnimation = useCallback(() => {
//     setIsAnimating((prev) => {
//       const newIsAnimating = !prev;
//       if (newIsAnimating) {
//         const preset = animationPresets[animationPresetRef.current];
//         const floatAmplitude = preset?.floatAmplitude || 0.1;
//         const floatSpeed = preset?.floatSpeed || 0.001;
//         const timeDivisor = floatAmplitude * (floatSpeed * 100);
//         const timeOffset =
//           timeDivisor !== 0
//             ? (animationState.current.floatY / timeDivisor) * 1000
//             : 0;
//         animationState.current.startTime =
//           Date.now() - (isFinite(timeOffset) ? timeOffset : 0);
//       } else {
//         if (meshRef.current)
//           animationState.current.targetRotation.copy(meshRef.current.rotation);
//       }
//       sonnerToast.info(
//         `Floating Animation ${newIsAnimating ? "Resumed" : "Paused"}`
//       );
//       pushHistory(newIsAnimating ? "resume global anim" : "pause global anim");
//       return newIsAnimating;
//     });
//   }, [pushHistory]);

//   const handleCustomMaterialPropChange = (propName, value) => {
//     setSettings((s) => ({
//       ...s,
//       customMaterialProperties: {
//         ...s.customMaterialProperties,
//         [propName]: saneNumber(
//           value,
//           baseMaterialPresets[s.materialType]?.[propName] ?? 0
//         ),
//       },
//     }));
//   };
//   const resetCustomMaterialProperties = () => {
//     const currentPresetKey = settings.materialType;
//     if (
//       currentPresetKey &&
//       currentPresetKey !== "auto" &&
//       baseMaterialPresets[currentPresetKey]
//     ) {
//       const presetDefaults = baseMaterialPresets[currentPresetKey];
//       setSettings((s) => ({
//         ...s,
//         customMaterialProperties: {
//           roughness: presetDefaults.roughness ?? null,
//           metalness: presetDefaults.metalness ?? null,
//           ior: presetDefaults.ior ?? null,
//           transmission: presetDefaults.transmission ?? null,
//           thickness: presetDefaults.thickness ?? null,
//           emissiveIntensity: presetDefaults.emissiveIntensity ?? null,
//         },
//       }));
//       sonnerToast.info("Material Properties Reset", {
//         description: `Values reset to ${currentPresetKey} defaults.`,
//       });
//       pushHistory("reset custom material props");
//     }
//   };

//   const handleCategorySelect = useCallback(
//     (categoryId) => {
//       setIsImportedModelDisplayed(false);
//       setCurrentCategory(categoryId);
//       setCurrentShape(shapesByCategory[categoryId][0].id);
//       handleResetAnimation();
//       pushHistory("category select");
//     },
//     [shapesByCategory, handleResetAnimation, pushHistory]
//   );

//   const handleShapeSelect = useCallback(
//     (shapeId) => {
//       setIsImportedModelDisplayed(false);
//       setCurrentShape(shapeId);
//       handleResetAnimation();
//       pushHistory("shape select");
//     },
//     [handleResetAnimation, pushHistory]
//   );

//   useEffect(() => {
//     if (isMounted && !isUndoingRedoingRef.current) {
//       handleResetAnimation();
//       pushHistory("animation preset change");
//     }
//   }, [animationPreset, isMounted, handleResetAnimation, pushHistory]); // Removed eslint-disable for handleResetAnimation, pushHistory

//   const handleRandomize = useCallback(() => {
//     setIsImportedModelDisplayed(false);
//     setCustomBgImageUrl(null); // Reset custom background on randomize
//     const randCat = categories[Math.floor(Math.random() * categories.length)];
//     const randShapeList = shapesByCategory[randCat.id];
//     const randShape =
//       randShapeList[Math.floor(Math.random() * randShapeList.length)];
//     const randPresetKey =
//       Object.keys(animationPresets)[
//         Math.floor(Math.random() * Object.keys(animationPresets).length)
//       ];
//     const randColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`;
//     const bgKeys = Object.keys(backgroundOptions).filter(
//       (key) => key !== "customImage"
//     ); // Exclude customImage from random
//     const randBgKey = bgKeys[Math.floor(Math.random() * bgKeys.length)];
//     const matKeys = [
//       "auto",
//       "metallic",
//       "glass",
//       "crystal",
//       "ceramic",
//       "organic",
//       "plastic",
//       "neon",
//     ];
//     const randMat = matKeys[Math.floor(Math.random() * matKeys.length)];
//     setCurrentCategory(randCat.id);
//     setCurrentShape(randShape.id);
//     setAnimationPreset(randPresetKey);
//     const newKeyLight = {
//       enabled: true,
//       intensity: saneNumber(Math.random() * (1.5 - 0.3) + 0.3, 0.7),
//       color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 85%)`,
//     };
//     const newFillLight = {
//       enabled: true,
//       intensity: saneNumber(Math.random() * (1.0 - 0.2) + 0.2, 0.4),
//       color: `hsl(${Math.floor(Math.random() * 360)}, 60%, 75%)`,
//     };
//     const newAmbientLight = {
//       enabled: true,
//       intensity: saneNumber(Math.random() * (0.5 - 0.1) + 0.1, 0.25),
//       color: `hsl(${Math.floor(Math.random() * 360)}, 50%, 70%)`,
//     };
//     setSettings((prev) => ({
//       ...prev,
//       materialType: randMat,
//       shapeColor: randColor,
//       background: randBgKey,
//       extrudeDepth: saneNumber(Math.random() * (1.0 - 0.1) + 0.1, 0.4),
//       animationSpeed: saneNumber(Math.random() * (2.0 - 0.5) + 0.5, 1.0),
//       keyLight: newKeyLight,
//       fillLight: newFillLight,
//       ambientLight: newAmbientLight,
//       customMaterialProperties: JSON.parse(
//         JSON.stringify(initialSettings.customMaterialProperties)
//       ),
//     }));
//     sonnerToast.success("Scene Randomized!", {
//       description: "Enjoy the new look.",
//     });
//     pushHistory("randomize");
//   }, [categories, shapesByCategory, backgroundOptions, pushHistory]);

//   const currentShapeRef = useRef(currentShape);
//   useEffect(() => {
//     currentShapeRef.current = currentShape;
//   }, [currentShape]);
//   const currentImportedModelNameRef = useRef(importedModelName);
//   useEffect(() => {
//     currentImportedModelNameRef.current = importedModelName;
//   }, [importedModelName]);

//   const handleExportGLB = useCallback(() => {
//     // ... (export GLB logic unchanged)
//     if (!meshRef.current || isExporting) return;
//     setIsExporting(true);
//     setExportProgress(0);
//     const exportToastId = sonnerToast.loading("Exporting GLB...", {
//       description: "Preparing model...",
//     });
//     const exporter = new GLTFExporter();
//     let progress = 0;
//     const progInterval = setInterval(() => {
//       progress += Math.floor(Math.random() * 10 + 5);
//       const curProg = Math.min(progress, 95);
//       setExportProgress(curProg);
//       sonnerToast.loading("Exporting GLB...", {
//         id: exportToastId,
//         description: `Processing... ${curProg}%`,
//       });
//       if (curProg >= 95) clearInterval(progInterval);
//     }, 150);
//     setTimeout(() => {
//       try {
//         if (!(meshRef.current instanceof THREE.Object3D))
//           throw new Error("Model not valid for export.");
//         const exportOptions = { binary: true };
//         if (isImportedModelDisplayed && importedModel?.animations?.length > 0)
//           exportOptions.animations = importedModel.animations;
//         exporter.parse(
//           meshRef.current,
//           (gltf) => {
//             clearInterval(progInterval);
//             setExportProgress(100);
//             sonnerToast.success("GLB Export Ready", {
//               id: exportToastId,
//               description: "Download starting.",
//             });
//             if (!(gltf instanceof ArrayBuffer))
//               throw new Error("Exported GLTF not ArrayBuffer.");
//             const blob = new Blob([gltf], { type: "application/octet-stream" });
//             const link = document.createElement("a");
//             link.href = URL.createObjectURL(blob);
//             const fileNameToExport = isImportedModelDisplayed
//               ? currentImportedModelNameRef.current || "imported-model"
//               : currentShapeRef.current || "model";
//             link.download = `shape-${fileNameToExport}.glb`;
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             URL.revokeObjectURL(link.href);
//             setTimeout(() => {
//               setIsExporting(false);
//               setExportProgress(0);
//             }, 500);
//           },
//           (error) => {
//             clearInterval(progInterval);
//             console.error("GLTFExporter.parse error:", error);
//             sonnerToast.error("GLB Export Failed", {
//               id: exportToastId,
//               description: error.message || "GLTF parsing error.",
//             });
//             setIsExporting(false);
//             setExportProgress(0);
//           },
//           exportOptions
//         );
//       } catch (e) {
//         clearInterval(progInterval);
//         console.error("GLTF export setup error:", e);
//         sonnerToast.error("GLB Export Failed", {
//           id: exportToastId,
//           description: e.message || "Unexpected error.",
//         });
//         setIsExporting(false);
//         setExportProgress(0);
//       }
//     }, 100);
//   }, [isExporting, isImportedModelDisplayed, importedModel]);

//   const handleSimulatedExportOBJ = useCallback(() => {
//     // ... (simulated export OBJ logic unchanged)
//     if (isExporting) return;
//     setIsExporting(true);
//     setExportProgress(0);
//     const exportToastId = sonnerToast.loading("Exporting OBJ (Simulated)...", {
//       description: "Processing...",
//     });
//     let p = 0;
//     const i = setInterval(() => {
//       p += Math.floor(Math.random() * 15 + 10);
//       const currentProgress = Math.min(p, 100);
//       setExportProgress(currentProgress);
//       sonnerToast.loading("Exporting OBJ (Simulated)...", {
//         id: exportToastId,
//         description: `Processing... ${currentProgress}%`,
//       });
//       if (currentProgress >= 100) {
//         clearInterval(i);
//         const l = document.createElement("a");
//         l.download = `shape-${
//           isImportedModelDisplayed
//             ? currentImportedModelNameRef.current
//             : currentShapeRef.current || "model"
//         }.obj`;
//         l.href =
//           "data:text/plain;charset=utf-8," +
//           encodeURIComponent(
//             "# OBJ file simulated\n# Actual OBJ Exporter Needed"
//           );
//         document.body.appendChild(l);
//         l.click();
//         document.body.removeChild(l);
//         sonnerToast.success("OBJ Export (Simulated) Ready", {
//           id: exportToastId,
//           description: "Simulated OBJ downloaded.",
//         });
//         setTimeout(() => {
//           setIsExporting(false);
//           setExportProgress(0);
//         }, 500);
//       }
//     }, 150);
//   }, [isExporting, isImportedModelDisplayed]);

//   const handleTakeScreenshot = useCallback(() => {
//     // ... (screenshot logic unchanged)
//     if (!rendererRef.current || !sceneRef.current || !cameraRef.current) {
//       sonnerToast.error("Screenshot Failed", {
//         description: "Renderer not ready.",
//       });
//       return;
//     }
//     const screenshotToastId = sonnerToast.loading("Taking Screenshot...", {
//       description: "Capturing image...",
//     });
//     if (composerRef.current) composerRef.current.render();
//     else rendererRef.current.render(sceneRef.current, cameraRef.current);
//     setTimeout(() => {
//       try {
//         const canvas = rendererRef.current.domElement;
//         const link = document.createElement("a");
//         link.download = `screenshot-${
//           isImportedModelDisplayed
//             ? currentImportedModelNameRef.current
//             : currentShapeRef.current || "view"
//         }.png`;
//         link.href = canvas.toDataURL("image/png");
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         sonnerToast.success("Screenshot Saved!", {
//           id: screenshotToastId,
//           description: `${link.download} saved.`,
//         });
//       } catch (e) {
//         console.error("Screenshot error:", e);
//         sonnerToast.error("Screenshot Failed", {
//           id: screenshotToastId,
//           description: e.message || "Could not save.",
//         });
//       }
//     }, 100);
//   }, [isImportedModelDisplayed]);

//   const processAndSetImportedModel = useCallback(
//     (scene, animations, fileName) => {
//       const nameOnly =
//         fileName.split(".").slice(0, -1).join(".") || "Imported Model";
//       setImportedModelName(nameOnly);
//       setImportedModel({ scene, animations: animations || [] });
//       setIsImportedModelDisplayed(true);
//       handleResetAnimation();
//     },
//     [handleResetAnimation]
//   );

//   const processImportedGltf = useCallback(
//     (gltf, fileName) => {
//       processAndSetImportedModel(gltf.scene, gltf.animations, fileName);
//     },
//     [processAndSetImportedModel]
//   );

//   const handleFiles = useCallback(
//     async (files) => {
//       // ... (file handling logic mostly unchanged)
//       if (!files || files.length === 0) return;
//       const importToastId = sonnerToast.loading("Processing File(s)...");
//       let objFile = null,
//         mtlFile = null,
//         fbxFile = null,
//         tdsFile = null,
//         otherModelFile = null;
//       for (const file of files) {
//         const lowerName = file.name.toLowerCase();
//         if (lowerName.endsWith(".obj")) objFile = file;
//         else if (lowerName.endsWith(".mtl")) mtlFile = file;
//         else if (lowerName.endsWith(".fbx")) fbxFile = file;
//         else if (lowerName.endsWith(".3ds")) tdsFile = file;
//         else if (
//           lowerName.endsWith(".glb") ||
//           lowerName.endsWith(".gltf") ||
//           lowerName.endsWith(".stl")
//         ) {
//           if (!otherModelFile) otherModelFile = file;
//         }
//       }
//       const modelLoadedSuccessfully = (modelName, format) => {
//         sonnerToast.success(`${format} Model Loaded`, {
//           id: importToastId,
//           description: `${modelName} displayed.`,
//         });
//         pushHistory(`import ${format}`);
//       };
//       const modelLoadFailed = (modelName, format, errorMsg) => {
//         sonnerToast.error(`${format} Load Failed`, {
//           id: importToastId,
//           description: `${modelName}: ${errorMsg || "Unknown"}`,
//         });
//       };
//       if (objFile) {
//         sonnerToast.info("Processing OBJ model...", {
//           id: importToastId,
//           description: `Loading ${objFile.name}${
//             mtlFile ? " with " + mtlFile.name : ""
//           }`,
//         });
//         try {
//           const objLoader = new OBJLoader();
//           const mtlLoader = new MTLLoader();
//           let materialsCreator = null;
//           if (
//             mtlFile &&
//             objFile.name.slice(0, -4) === mtlFile.name.slice(0, -4)
//           ) {
//             const mtlText = await mtlFile.text();
//             mtlLoader.setResourcePath("");
//             materialsCreator = mtlLoader.parse(mtlText, "");
//             materialsCreator.preload();
//           }
//           const objText = await objFile.text();
//           if (materialsCreator) objLoader.setMaterials(materialsCreator);
//           const object = objLoader.parse(objText);
//           object.traverse((child) => {
//             if (child.isMesh) {
//               if (child.material) {
//                 if (Array.isArray(child.material))
//                   child.material.forEach(
//                     (mat) => (mat.side = THREE.DoubleSide)
//                   );
//                 else child.material.side = THREE.DoubleSide;
//               } else if (!materialsCreator) {
//                 child.material = createAdvancedMaterial(
//                   currentSettingsRef.current.shapeColor,
//                   "ceramic",
//                   {}
//                 );
//                 child.material.side = THREE.DoubleSide;
//               }
//               child.castShadow = true;
//               child.receiveShadow = true;
//             }
//           });
//           processAndSetImportedModel(object, [], objFile.name);
//           modelLoadedSuccessfully(objFile.name, "OBJ");
//         } catch (error) {
//           console.error("OBJ/MTL Error:", error);
//           modelLoadFailed(objFile.name, "OBJ/MTL", error.message);
//         }
//       } else if (fbxFile) {
//         sonnerToast.info("Processing FBX model...", {
//           id: importToastId,
//           description: `Loading ${fbxFile.name}. This may take a moment...`,
//         });
//         try {
//           const buffer = await fbxFile.arrayBuffer();
//           const loader = new FBXLoader();
//           const object = loader.parse(buffer, "");
//           object.traverse((child) => {
//             if (child.isMesh) {
//               child.castShadow = true;
//               child.receiveShadow = true;
//               if (child.material) {
//                 if (Array.isArray(child.material))
//                   child.material.forEach(
//                     (mat) => (mat.side = THREE.DoubleSide)
//                   );
//                 else child.material.side = THREE.DoubleSide;
//               }
//             }
//           });
//           processAndSetImportedModel(
//             object,
//             object.animations || [],
//             fbxFile.name
//           );
//           modelLoadedSuccessfully(fbxFile.name, "FBX");
//         } catch (error) {
//           console.error("FBX Error:", error);
//           modelLoadFailed(fbxFile.name, "FBX", error.message);
//         }
//       } else if (tdsFile) {
//         sonnerToast.info("Processing 3DS model...", {
//           id: importToastId,
//           description: `Loading ${tdsFile.name}`,
//         });
//         try {
//           const buffer = await tdsFile.arrayBuffer();
//           const loader = new TDSLoader();
//           const object = loader.parse(buffer, "");
//           object.traverse((child) => {
//             if (child.isMesh) {
//               child.castShadow = true;
//               child.receiveShadow = true;
//               if (child.material) {
//                 if (Array.isArray(child.material))
//                   child.material.forEach(
//                     (mat) => (mat.side = THREE.DoubleSide)
//                   );
//                 else child.material.side = THREE.DoubleSide;
//               } else {
//                 child.material = createAdvancedMaterial(
//                   currentSettingsRef.current.shapeColor,
//                   "plastic",
//                   {}
//                 );
//                 child.material.side = THREE.DoubleSide;
//               }
//             }
//           });
//           processAndSetImportedModel(object, [], tdsFile.name);
//           modelLoadedSuccessfully(tdsFile.name, "3DS");
//         } catch (error) {
//           console.error("3DS Error:", error);
//           modelLoadFailed(tdsFile.name, "3DS", error.message);
//         }
//       } else if (otherModelFile) {
//         sonnerToast.info("Processing model...", {
//           id: importToastId,
//           description: `Loading ${otherModelFile.name}`,
//         });
//         const lowerName = otherModelFile.name.toLowerCase();
//         try {
//           const buffer = await otherModelFile.arrayBuffer();
//           if (lowerName.endsWith(".glb") || lowerName.endsWith(".gltf")) {
//             const loader = getGltfLoader();
//             loader.parse(
//               buffer,
//               "",
//               (gltf) => {
//                 processImportedGltf(gltf, otherModelFile.name);
//                 modelLoadedSuccessfully(otherModelFile.name, "GLTF/GLB");
//               },
//               (error) => {
//                 console.error("GLB/GLTF Parse Error:", error);
//                 modelLoadFailed(otherModelFile.name, "GLTF/GLB", error.message);
//               }
//             );
//             return;
//           } else if (lowerName.endsWith(".stl")) {
//             const loader = new STLLoader();
//             const geometry = loader.parse(buffer);
//             if (!geometry.isBufferGeometry)
//               throw new Error("Invalid STL geometry.");
//             const material = createAdvancedMaterial(
//               currentSettingsRef.current.shapeColor,
//               "plastic",
//               {}
//             );
//             const modelScene = new THREE.Mesh(geometry, material);
//             processAndSetImportedModel(modelScene, [], otherModelFile.name);
//             modelLoadedSuccessfully(otherModelFile.name, "STL");
//           }
//         } catch (error) {
//           console.error("Model Load Error:", error);
//           modelLoadFailed(otherModelFile.name, "Model", error.message);
//         }
//       } else {
//         sonnerToast.warning("No Supported File", {
//           id: importToastId,
//           description: "Please select GLB, GLTF, STL, OBJ, FBX or 3DS.",
//         });
//       }
//       if (fileInputRef.current) fileInputRef.current.value = null;
//     },
//     [processImportedGltf, processAndSetImportedModel, pushHistory]
//   );

//   const triggerImport = useCallback(() => {
//     if (fileInputRef.current) fileInputRef.current.click();
//   }, []);

//   const handleFileDropOnViewer = useCallback(
//     (event) => {
//       event.preventDefault();
//       event.stopPropagation();
//       if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
//         handleFiles(Array.from(event.dataTransfer.files));
//       }
//     },
//     [handleFiles]
//   );

//   // Animation Playback Controls (unchanged)
//   const handlePlayPauseAnimation = () => {
//     /* ... */ pushHistory("play/pause imported anim");
//   };
//   const handleStopAnimation = () => {
//     /* ... */ pushHistory("stop imported anim");
//   };
//   const handleAnimationClipChange = (indexStr) => {
//     /* ... */ pushHistory("change animation clip");
//   };
//   const handleAnimationTimeChange = (value) => {
//     /* ... */
//   };
//   const handleAnimationLoopToggle = (checked) => {
//     /* ... */ pushHistory("toggle animation loop");
//   };
//   const handleAnimationSpeedChange = (value) => {
//     /* ... */
//   };

//   // Callbacks for custom background image
//   const handleCustomBgImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setCustomBgImageUrl(e.target.result);
//         sonnerToast.success("Background image set.");
//         // History pushed by useEffect on customBgImageUrl change
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleClearCustomBgImage = () => {
//     setCustomBgImageUrl(null);
//     // Effect hook will handle removing texture from scene
//     sonnerToast.info("Custom background image cleared.");
//     // History pushed by useEffect on customBgImageUrl change
//   };

//   if (!isMounted) {
//     return (
//       <div className='min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-4'>
//         <Loader2 className='h-12 w-12 animate-spin text-purple-400 mb-4' />
//         <p className='text-lg font-medium'>Initializing 3D Studio...</p>
//         <p className='text-sm text-slate-400'>
//           Getting things ready, please wait.
//         </p>
//       </div>
//     );
//   }

//   const canUndo = historyPointerRef.current > 0;
//   const canRedo =
//     historyPointerRef.current < historyStackRef.current.length - 1;
//   const proceduralMaterialType =
//     settings.materialType === "auto"
//       ? SHAPES_BY_CATEGORY_DATA[currentCategory]?.find(
//           (s) => s.id === currentShape
//         )?.autoMaterial || "ceramic"
//       : settings.materialType;

//   const renderSettingsContent = () => (
//     <div className='space-y-4 py-4 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50 pr-3 pl-4'>
//       {/* ... (Procedural Shape Material and Geometry sections remain the same) ... */}
//       {!isImportedModelDisplayed && (
//         <>
//           <p className='text-sm text-slate-300 font-semibold uppercase tracking-wider'>
//             Procedural Shape Material
//           </p>
//           {/* ... Material Type, Shape Color, Fine-tune material properties ... */}
//           <div className='space-y-1.5'>
//             <Label
//               htmlFor='materialTypePanel'
//               className='text-sm text-slate-300'
//             >
//               Base Material
//             </Label>
//             <Select
//               value={settings.materialType}
//               onValueChange={(value) => {
//                 setSettings((s) => ({ ...s, materialType: value }));
//                 resetCustomMaterialProperties();
//               }}
//             >
//               <SelectTrigger
//                 id='materialTypePanel'
//                 className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'
//               >
//                 <SelectValue placeholder='Select material' />
//               </SelectTrigger>
//               <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
//                 {[
//                   "auto",
//                   "metallic",
//                   "glass",
//                   "crystal",
//                   "ceramic",
//                   "organic",
//                   "plastic",
//                   "neon",
//                 ].map((type) => (
//                   <SelectItem
//                     key={type}
//                     value={type}
//                     className='capitalize focus:bg-purple-600 focus:text-white'
//                   >
//                     {type}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <div className='space-y-1.5'>
//             <Label htmlFor='shapeColorPanel' className='text-sm text-slate-300'>
//               Base Color
//             </Label>
//             <Input
//               id='shapeColorPanel'
//               type='color'
//               value={settings.shapeColor}
//               onChange={(e) =>
//                 setSettings((s) => ({ ...s, shapeColor: e.target.value }))
//               }
//               className='w-full p-1 h-9 bg-slate-700 border-slate-600 cursor-pointer focus-visible:ring-purple-500'
//             />
//           </div>
//           {settings.materialType !== "auto" && (
//             <div className='p-3 border border-slate-600 rounded-md space-y-3 bg-slate-700/30'>
//               <div className='flex justify-between items-center'>
//                 <h4 className='text-xs font-semibold text-purple-300'>
//                   Fine-tune '{settings.materialType}'
//                 </h4>
//                 <Button
//                   variant='ghost'
//                   size='xs'
//                   onClick={resetCustomMaterialProperties}
//                   className='text-slate-400 hover:text-purple-300 h-7 px-2'
//                 >
//                   Reset
//                 </Button>
//               </div>
//               {(proceduralMaterialType === "metallic" ||
//                 proceduralMaterialType === "glass" ||
//                 proceduralMaterialType === "crystal" ||
//                 proceduralMaterialType === "ceramic" ||
//                 proceduralMaterialType === "organic" ||
//                 proceduralMaterialType === "plastic" ||
//                 proceduralMaterialType === "neon") && (
//                 <div className='space-y-1.5'>
//                   <div className='flex justify-between items-center'>
//                     <Label
//                       htmlFor='customRoughnessPanel'
//                       className='text-xs text-slate-300'
//                     >
//                       Roughness
//                     </Label>
//                     <span className='text-xs text-slate-400'>
//                       {(
//                         settings.customMaterialProperties.roughness ??
//                         baseMaterialPresets[proceduralMaterialType]
//                           ?.roughness ??
//                         0
//                       ).toFixed(2)}
//                     </span>
//                   </div>
//                   <Slider
//                     id='customRoughnessPanel'
//                     min={0}
//                     max={1}
//                     step={0.01}
//                     value={[
//                       settings.customMaterialProperties.roughness ??
//                         baseMaterialPresets[proceduralMaterialType]
//                           ?.roughness ??
//                         0,
//                     ]}
//                     onValueChange={([val]) =>
//                       handleCustomMaterialPropChange("roughness", val)
//                     }
//                     className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//                   />
//                 </div>
//               )}
//               {(proceduralMaterialType === "metallic" ||
//                 proceduralMaterialType === "ceramic" ||
//                 proceduralMaterialType === "plastic") && (
//                 <div className='space-y-1.5'>
//                   <div className='flex justify-between items-center'>
//                     <Label
//                       htmlFor='customMetalnessPanel'
//                       className='text-xs text-slate-300'
//                     >
//                       Metalness
//                     </Label>
//                     <span className='text-xs text-slate-400'>
//                       {(
//                         settings.customMaterialProperties.metalness ??
//                         baseMaterialPresets[proceduralMaterialType]
//                           ?.metalness ??
//                         0
//                       ).toFixed(2)}
//                     </span>
//                   </div>
//                   <Slider
//                     id='customMetalnessPanel'
//                     min={0}
//                     max={1}
//                     step={0.01}
//                     value={[
//                       settings.customMaterialProperties.metalness ??
//                         baseMaterialPresets[proceduralMaterialType]
//                           ?.metalness ??
//                         0,
//                     ]}
//                     onValueChange={([val]) =>
//                       handleCustomMaterialPropChange("metalness", val)
//                     }
//                     className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//                   />
//                 </div>
//               )}
//               {(proceduralMaterialType === "glass" ||
//                 proceduralMaterialType === "crystal") && (
//                 <>
//                   <div className='space-y-1.5'>
//                     <div className='flex justify-between items-center'>
//                       <Label
//                         htmlFor='customIorPanel'
//                         className='text-xs text-slate-300'
//                       >
//                         IOR
//                       </Label>
//                       <span className='text-xs text-slate-400'>
//                         {(
//                           settings.customMaterialProperties.ior ??
//                           baseMaterialPresets[proceduralMaterialType]?.ior ??
//                           1.5
//                         ).toFixed(2)}
//                       </span>
//                     </div>
//                     <Slider
//                       id='customIorPanel'
//                       min={1}
//                       max={2.33}
//                       step={0.01}
//                       value={[
//                         settings.customMaterialProperties.ior ??
//                           baseMaterialPresets[proceduralMaterialType]?.ior ??
//                           1.5,
//                       ]}
//                       onValueChange={([val]) =>
//                         handleCustomMaterialPropChange("ior", val)
//                       }
//                       className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//                     />
//                   </div>
//                   <div className='space-y-1.5'>
//                     <div className='flex justify-between items-center'>
//                       <Label
//                         htmlFor='customTransmissionPanel'
//                         className='text-xs text-slate-300'
//                       >
//                         Transmission
//                       </Label>
//                       <span className='text-xs text-slate-400'>
//                         {(
//                           settings.customMaterialProperties.transmission ??
//                           baseMaterialPresets[proceduralMaterialType]
//                             ?.transmission ??
//                           0
//                         ).toFixed(2)}
//                       </span>
//                     </div>
//                     <Slider
//                       id='customTransmissionPanel'
//                       min={0}
//                       max={1}
//                       step={0.01}
//                       value={[
//                         settings.customMaterialProperties.transmission ??
//                           baseMaterialPresets[proceduralMaterialType]
//                             ?.transmission ??
//                           0,
//                       ]}
//                       onValueChange={([val]) =>
//                         handleCustomMaterialPropChange("transmission", val)
//                       }
//                       className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//                     />
//                   </div>
//                   <div className='space-y-1.5'>
//                     <div className='flex justify-between items-center'>
//                       <Label
//                         htmlFor='customThicknessPanel'
//                         className='text-xs text-slate-300'
//                       >
//                         Thickness
//                       </Label>
//                       <span className='text-xs text-slate-400'>
//                         {(
//                           settings.customMaterialProperties.thickness ??
//                           baseMaterialPresets[proceduralMaterialType]
//                             ?.thickness ??
//                           0
//                         ).toFixed(2)}
//                       </span>
//                     </div>
//                     <Slider
//                       id='customThicknessPanel'
//                       min={0}
//                       max={2}
//                       step={0.01}
//                       value={[
//                         settings.customMaterialProperties.thickness ??
//                           baseMaterialPresets[proceduralMaterialType]
//                             ?.thickness ??
//                           0,
//                       ]}
//                       onValueChange={([val]) =>
//                         handleCustomMaterialPropChange("thickness", val)
//                       }
//                       className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//                     />
//                   </div>
//                 </>
//               )}
//               {proceduralMaterialType === "neon" && (
//                 <div className='space-y-1.5'>
//                   <div className='flex justify-between items-center'>
//                     <Label
//                       htmlFor='customEmissiveIntensityPanel'
//                       className='text-xs text-slate-300'
//                     >
//                       Emissive Intensity
//                     </Label>
//                     <span className='text-xs text-slate-400'>
//                       {(
//                         settings.customMaterialProperties.emissiveIntensity ??
//                         baseMaterialPresets.neon?.emissiveIntensity ??
//                         1.0
//                       ).toFixed(2)}
//                     </span>
//                   </div>
//                   <Slider
//                     id='customEmissiveIntensityPanel'
//                     min={0}
//                     max={5}
//                     step={0.1}
//                     value={[
//                       settings.customMaterialProperties.emissiveIntensity ??
//                         baseMaterialPresets.neon?.emissiveIntensity ??
//                         1.0,
//                     ]}
//                     onValueChange={([val]) =>
//                       handleCustomMaterialPropChange("emissiveIntensity", val)
//                     }
//                     className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//                   />
//                 </div>
//               )}
//             </div>
//           )}
//           <Separator className='my-3 bg-slate-600' />
//           <p className='text-sm text-slate-300 font-semibold uppercase tracking-wider'>
//             Procedural Shape Geometry
//           </p>
//           {/* ... Depth, Quality ... */}
//           <div className='space-y-1.5'>
//             <div className='flex justify-between items-center'>
//               <Label
//                 htmlFor='extrudeDepthPanel'
//                 className='text-sm text-slate-300'
//               >
//                 Depth
//               </Label>
//               <span className='text-xs text-slate-400'>
//                 {settings.extrudeDepth.toFixed(2)}
//               </span>
//             </div>
//             <Slider
//               id='extrudeDepthPanel'
//               min={0.05}
//               max={1.5}
//               step={0.05}
//               value={[settings.extrudeDepth]}
//               onValueChange={([value]) =>
//                 setSettings((s) => ({ ...s, extrudeDepth: value }))
//               }
//               className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//             />
//           </div>
//           <div className='space-y-1.5'>
//             <Label htmlFor='qualityPanel' className='text-sm text-slate-300'>
//               Quality
//             </Label>
//             <Select
//               value={settings.quality}
//               onValueChange={(value) =>
//                 setSettings((s) => ({ ...s, quality: value }))
//               }
//             >
//               <SelectTrigger
//                 id='qualityPanel'
//                 className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'
//               >
//                 <SelectValue placeholder='Select quality' />
//               </SelectTrigger>
//               <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
//                 {["low", "medium", "high"].map((q) => (
//                   <SelectItem
//                     key={q}
//                     value={q}
//                     className='capitalize focus:bg-purple-600 focus:text-white'
//                   >
//                     {q}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </>
//       )}

//       <Separator className='my-3 bg-slate-600' />
//       <p className='text-sm text-slate-300 font-semibold uppercase tracking-wider'>
//         General Display
//       </p>
//       {/* ... Float Anim. Speed ... */}
//       <div className='space-y-1.5'>
//         <div className='flex justify-between items-center'>
//           <Label
//             htmlFor='animationSpeedPanel'
//             className='text-sm text-slate-300'
//           >
//             Float Anim. Speed
//           </Label>
//           <span className='text-xs text-slate-400'>
//             {settings.animationSpeed.toFixed(1)}x
//           </span>
//         </div>
//         <Slider
//           id='animationSpeedPanel'
//           min={0.1}
//           max={3}
//           step={0.1}
//           value={[settings.animationSpeed]}
//           onValueChange={([value]) =>
//             setSettings((s) => ({ ...s, animationSpeed: value }))
//           }
//           className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//         />
//       </div>

//       <div className='space-y-1.5'>
//         <Label htmlFor='backgroundPanel' className='text-sm text-slate-300'>
//           Background
//         </Label>
//         <Select
//           value={settings.background}
//           onValueChange={(value) =>
//             setSettings((s) => ({ ...s, background: value }))
//           }
//         >
//           <SelectTrigger
//             id='backgroundPanel'
//             className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'
//           >
//             <SelectValue placeholder='Select background' />
//           </SelectTrigger>
//           <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
//             {Object.entries(backgroundOptions).map(([key, name]) => (
//               <SelectItem
//                 key={key}
//                 value={key}
//                 className='focus:bg-purple-600 focus:text-white'
//               >
//                 {name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         {settings.background === "customImage" && (
//           <div className='mt-2 space-y-1.5 p-3 border border-slate-600 rounded-md bg-slate-700/30'>
//             <Label
//               htmlFor='customBgImagePanel'
//               className='text-sm text-slate-300'
//             >
//               Upload Background Image
//             </Label>
//             <Input
//               id='customBgImagePanel'
//               type='file'
//               accept='image/png, image/jpeg, image/webp'
//               onChange={handleCustomBgImageUpload}
//               className='w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer'
//             />
//             {customBgImageUrl && (
//               <Button
//                 variant='ghost'
//                 size='xs'
//                 onClick={handleClearCustomBgImage}
//                 className='text-red-400 hover:text-red-300 hover:bg-transparent mt-1 w-full'
//               >
//                 Clear Custom Image
//               </Button>
//             )}
//           </div>
//         )}
//       </div>

//       <Separator className='my-3 bg-slate-600' />
//       <p className='text-sm text-slate-300 font-semibold uppercase tracking-wider'>
//         Lighting
//       </p>
//       {/* ... Lighting section (Key, Fill, Ambient) ... */}
//       {["keyLight", "fillLight", "ambientLight"].map((lightKey) => {
//         const lightName =
//           lightKey.replace("Light", "").charAt(0).toUpperCase() +
//           lightKey.replace("Light", "").slice(1);
//         return (
//           <div
//             key={lightKey}
//             className='p-3 border border-slate-600 rounded-md space-y-2 text-xs bg-slate-700/30'
//           >
//             <div className='flex items-center justify-between'>
//               <Label
//                 htmlFor={`${lightKey}EnablePanel`}
//                 className='text-slate-200 text-sm'
//               >
//                 {lightName} Light
//               </Label>
//               <Switch
//                 id={`${lightKey}EnablePanel`}
//                 checked={settings[lightKey].enabled}
//                 onCheckedChange={(checked) =>
//                   setSettings((s) => ({
//                     ...s,
//                     [lightKey]: { ...s[lightKey], enabled: checked },
//                   }))
//                 }
//               />
//             </div>
//             {settings[lightKey].enabled && (
//               <>
//                 <div className='flex justify-between items-center'>
//                   <Label
//                     htmlFor={`${lightKey}IntensityPanel`}
//                     className='text-slate-300'
//                   >
//                     Intensity
//                   </Label>
//                   <span className='text-slate-400'>
//                     {settings[lightKey].intensity.toFixed(2)}
//                   </span>
//                 </div>
//                 <Slider
//                   id={`${lightKey}IntensityPanel`}
//                   min={0}
//                   max={2}
//                   step={0.05}
//                   value={[settings[lightKey].intensity]}
//                   onValueChange={([val]) =>
//                     setSettings((s) => ({
//                       ...s,
//                       [lightKey]: { ...s[lightKey], intensity: val },
//                     }))
//                   }
//                   className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//                 />
//                 <Label
//                   htmlFor={`${lightKey}ColorPanel`}
//                   className='text-slate-300'
//                 >
//                   Color
//                 </Label>
//                 <Input
//                   id={`${lightKey}ColorPanel`}
//                   type='color'
//                   value={settings[lightKey].color}
//                   onChange={(e) =>
//                     setSettings((s) => ({
//                       ...s,
//                       [lightKey]: { ...s[lightKey], color: e.target.value },
//                     }))
//                   }
//                   className='w-full h-7 p-0.5 bg-slate-600 border-slate-500 cursor-pointer'
//                 />
//               </>
//             )}
//           </div>
//         );
//       })}

//       {isImportedModelDisplayed && animationClipsRef.current.length > 0 && (
//         <>
//           <Separator className='my-3 bg-slate-600' />
//           <p className='text-sm text-slate-300 font-semibold uppercase tracking-wider'>
//             Animation Playback
//           </p>
//           {/* ... Animation Playback controls ... */}
//           <div className='space-y-4 p-3 border border-slate-600 rounded-md bg-slate-700/30'>
//             <Select
//               value={selectedAnimationClipIndex.toString()}
//               onValueChange={handleAnimationClipChange}
//               disabled={animationClipsRef.current.length === 0}
//             >
//               <SelectTrigger className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'>
//                 <SelectValue placeholder='Select animation clip' />
//               </SelectTrigger>
//               <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
//                 {animationClipsRef.current.map((clip, index) => (
//                   <SelectItem
//                     key={index}
//                     value={index.toString()}
//                     className='focus:bg-purple-600 focus:text-white'
//                   >
//                     {clip.name || `Animation ${index + 1}`}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <div className='grid grid-cols-3 gap-2'>
//               <Button
//                 onClick={handlePlayPauseAnimation}
//                 disabled={selectedAnimationClipIndex < 0}
//                 className={cn(
//                   "bg-green-600 hover:bg-green-700",
//                   animationPlaybackState === "playing" &&
//                     "bg-yellow-500 hover:bg-yellow-600"
//                 )}
//               >
//                 {animationPlaybackState === "playing" ? (
//                   <Pause size={16} />
//                 ) : (
//                   <Play size={16} />
//                 )}
//               </Button>
//               <Button
//                 onClick={handleStopAnimation}
//                 disabled={
//                   selectedAnimationClipIndex < 0 ||
//                   animationPlaybackState === "stopped"
//                 }
//                 className='bg-red-600 hover:bg-red-700'
//               >
//                 <StopCircle size={16} />
//               </Button>
//               <Button
//                 variant={isAnimationLooping ? "secondary" : "outline"}
//                 onClick={() => handleAnimationLoopToggle(!isAnimationLooping)}
//                 disabled={selectedAnimationClipIndex < 0}
//                 className={cn(
//                   isAnimationLooping
//                     ? "bg-purple-500 hover:bg-purple-600 text-white"
//                     : "border-slate-600 text-slate-300 hover:bg-slate-700/50"
//                 )}
//               >
//                 <Repeat size={16} />
//               </Button>
//             </div>
//             <div className='space-y-1.5'>
//               <Label htmlFor='animTimePanel' className='text-sm text-slate-300'>
//                 Time: {(animationTime * animationDuration).toFixed(2)}s /{" "}
//                 {animationDuration.toFixed(2)}s
//               </Label>
//               <Slider
//                 id='animTimePanel'
//                 min={0}
//                 max={1}
//                 step={0.001}
//                 value={[animationTime]}
//                 onValueChange={([val]) => handleAnimationTimeChange(val)}
//                 disabled={
//                   selectedAnimationClipIndex < 0 || animationDuration === 0
//                 }
//                 className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//               />
//             </div>
//             <div className='space-y-1.5'>
//               <Label
//                 htmlFor='animSpeedPanel'
//                 className='text-sm text-slate-300'
//               >
//                 Speed: {animationPlaybackSpeed.toFixed(1)}x
//               </Label>
//               <Slider
//                 id='animSpeedPanel'
//                 min={0.1}
//                 max={3}
//                 step={0.1}
//                 value={[animationPlaybackSpeed]}
//                 onValueChange={([val]) => handleAnimationSpeedChange(val)}
//                 disabled={selectedAnimationClipIndex < 0}
//                 className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//               />
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );

//   return (
//     <>
//       <SonnerToaster richColors position='top-right' />
//       <div className='min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 p-3 sm:p-4 md:p-6 text-slate-100 select-none'>
//         <input
//           type='file'
//           accept='.glb,.gltf,.stl,.obj,.mtl,.fbx,.3ds'
//           multiple
//           ref={fileInputRef}
//           onChange={(e) => handleFiles(Array.from(e.target.files))}
//           style={{ display: "none" }}
//         />
//         <div className='max-w-screen-2xl mx-auto'>
//           <header className='text-center mb-8 sm:mb-10'>
//             <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-3 sm:mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent'>
//               3D Shape Studio Pro
//             </h1>
//             <p className='text-slate-400 text-base sm:text-lg max-w-3xl mx-auto'>
//               Craft, view, and animate 3D masterpieces. Import GLB, GLTF, STL,
//               OBJ, FBX or 3DS models. Drag & drop supported.
//             </p>
//           </header>
//           <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6'>
//             {/* --- Main Left Sidebar --- */}
//             <div className='lg:col-span-3 space-y-4 sm:space-y-5 order-last lg:order-first'>
//               {/* ... (Category, Shape, Imported Model, Global Animation, File & Export cards) ... */}
//               {/* The "Detailed Settings" button is removed from here */}
//               {!isImportedModelDisplayed && (
//                 <>
//                   <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
//                     <CardHeader>
//                       <CardTitle className='text-slate-100'>
//                         Categories
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className='grid grid-cols-2 gap-3'>
//                         {categories.map((category) => (
//                           <Button
//                             key={category.id}
//                             variant={
//                               currentCategory === category.id
//                                 ? "default"
//                                 : "outline"
//                             }
//                             className={cn(
//                               "h-auto py-3 flex flex-col items-center justify-center gap-1.5 text-xs sm:text-sm transition-all",
//                               currentCategory === category.id
//                                 ? "bg-purple-600 hover:bg-purple-700 text-white ring-2 ring-purple-400"
//                                 : "text-slate-300 border-slate-600 hover:bg-slate-700/50"
//                             )}
//                             onClick={() => handleCategorySelect(category.id)}
//                           >
//                             <span className='text-2xl sm:text-3xl'>
//                               {category.icon}
//                             </span>{" "}
//                             <span>{category.name}</span>
//                           </Button>
//                         ))}
//                       </div>
//                     </CardContent>
//                   </Card>
//                   <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
//                     <CardHeader>
//                       <CardTitle className='text-slate-100'>Shapes</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className='grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50'>
//                         {shapesByCategory[currentCategory].map((shape) => (
//                           <Button
//                             key={shape.id}
//                             variant={
//                               currentShape === shape.id ? "secondary" : "ghost"
//                             }
//                             className={cn(
//                               "justify-start gap-2",
//                               currentShape === shape.id
//                                 ? "bg-purple-500 text-white hover:bg-purple-600"
//                                 : "text-slate-300 hover:bg-slate-700/50"
//                             )}
//                             onClick={() => handleShapeSelect(shape.id)}
//                           >
//                             <span className='text-xl'>{shape.icon}</span>{" "}
//                             {shape.name}
//                           </Button>
//                         ))}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </>
//               )}
//               {isImportedModelDisplayed && importedModel && (
//                 <Card className='bg-slate-800/70 border-slate-700 shadow-xl text-center'>
//                   <CardHeader>
//                     <CardTitle className='text-slate-100'>
//                       Current Model
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <p
//                       className='text-sm text-slate-300 truncate font-medium'
//                       title={importedModelName}
//                     >
//                       {importedModelName}
//                     </p>
//                   </CardContent>
//                   <CardFooter>
//                     <Button
//                       variant='destructive'
//                       size='sm'
//                       className='w-full'
//                       onClick={() => {
//                         setImportedModel(null);
//                         setIsImportedModelDisplayed(false);
//                         setImportedModelName("Imported Model");
//                         const defaultCategoryId = categories[0].id;
//                         setCurrentCategory(defaultCategoryId);
//                         setCurrentShape(
//                           shapesByCategory[defaultCategoryId][0].id
//                         );
//                         handleResetAnimation();
//                         sonnerToast.info("Imported Model Cleared", {
//                           description: "Procedural shapes active.",
//                         });
//                         pushHistory("clear imported model");
//                       }}
//                     >
//                       {" "}
//                       <XCircle size={16} className='mr-2' /> Clear Imported{" "}
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               )}

//               <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
//                 <CardHeader>
//                   <CardTitle className='text-slate-100'>
//                     Global Animation & View
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className='space-y-4'>
//                   <Button
//                     onClick={handleToggleGlobalAnimation}
//                     variant={isAnimating ? "destructive" : "default"}
//                     className='w-full bg-green-600 hover:bg-green-700 data-[state=destructive]:bg-red-600 data-[state=destructive]:hover:bg-red-700'
//                     data-state={isAnimating ? "destructive" : "default"}
//                   >
//                     {isAnimating ? (
//                       <Pause size={16} className='mr-2' />
//                     ) : (
//                       <Play size={16} className='mr-2' />
//                     )}{" "}
//                     {isAnimating ? "Pause Float" : "Play Float"}
//                   </Button>
//                   <Select
//                     value={animationPreset}
//                     onValueChange={(val) => {
//                       setAnimationPreset(val);
//                     }}
//                   >
//                     <SelectTrigger className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'>
//                       <SelectValue placeholder='Select float style' />
//                     </SelectTrigger>
//                     <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
//                       {Object.keys(animationPresets).map((presetKey) => (
//                         <SelectItem
//                           key={presetKey}
//                           value={presetKey}
//                           className='capitalize focus:bg-purple-600 focus:text-white'
//                         >
//                           {presetKey.charAt(0).toUpperCase() +
//                             presetKey.slice(1)}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <div className='grid grid-cols-2 gap-3'>
//                     <Button
//                       variant='outline'
//                       onClick={handleResetAnimation}
//                       className='border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
//                     >
//                       {" "}
//                       <RotateCcw size={14} className='mr-2' /> Reset View{" "}
//                     </Button>
//                     <Button
//                       variant='default'
//                       onClick={handleRandomize}
//                       className='bg-indigo-600 hover:bg-indigo-700'
//                     >
//                       {" "}
//                       <Shuffle size={14} className='mr-2' /> Randomize{" "}
//                     </Button>
//                   </div>
//                   <div className='grid grid-cols-2 gap-3 pt-2'>
//                     <Button
//                       variant='outline'
//                       onClick={handleUndo}
//                       disabled={!canUndo}
//                       className='border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 disabled:opacity-50'
//                     >
//                       {" "}
//                       <Undo size={14} className='mr-2' /> Undo{" "}
//                     </Button>
//                     <Button
//                       variant='outline'
//                       onClick={handleRedo}
//                       disabled={!canRedo}
//                       className='border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 disabled:opacity-50'
//                     >
//                       {" "}
//                       <Redo size={14} className='mr-2' /> Redo{" "}
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
//                 <CardHeader>
//                   <CardTitle className='text-slate-100'>
//                     File & Export
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className='space-y-3'>
//                   <Button
//                     onClick={triggerImport}
//                     disabled={isExporting}
//                     className='w-full bg-green-600 hover:bg-green-700'
//                   >
//                     <UploadCloud size={16} className='mr-2' /> Import Model
//                   </Button>
//                   <Button
//                     onClick={handleExportGLB}
//                     disabled={isExporting}
//                     className='w-full bg-blue-600 hover:bg-blue-700'
//                   >
//                     {" "}
//                     <Download size={16} className='mr-2' />{" "}
//                     {isExporting && exportProgress > 0 && exportProgress <= 100
//                       ? `GLB... ${Math.round(exportProgress)}%`
//                       : "Export GLB"}{" "}
//                   </Button>
//                   <Button
//                     onClick={handleSimulatedExportOBJ}
//                     disabled={isExporting}
//                     className='w-full bg-teal-600 hover:bg-teal-700'
//                   >
//                     {" "}
//                     <Download size={16} className='mr-2' />{" "}
//                     {isExporting && exportProgress > 0 && exportProgress <= 100
//                       ? `OBJ... ${Math.round(exportProgress)}%`
//                       : "Export OBJ (Sim.)"}{" "}
//                   </Button>
//                   <Button
//                     onClick={handleTakeScreenshot}
//                     disabled={isExporting}
//                     className='w-full bg-purple-600 hover:bg-purple-700'
//                   >
//                     <Camera size={16} className='mr-2' /> Screenshot
//                   </Button>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* --- Main 3D Viewer Area --- */}
//             <div className='lg:col-span-9 order-first lg:order-last'>
//               <Card className='bg-slate-800/50 border-slate-700/80 shadow-2xl aspect-[4/3] sm:aspect-video lg:aspect-[16/10] overflow-hidden relative'>
//                 {/* Settings Button overlayed */}
//                 <div className='absolute top-2 right-2 sm:top-3 sm:right-3 z-20'>
//                   <Sheet
//                     open={isSettingsPanelOpen}
//                     onOpenChange={setIsSettingsPanelOpen}
//                   >
//                     <SheetTrigger asChild>
//                       <Button
//                         variant='ghost'
//                         size='icon'
//                         className='bg-slate-800/60 hover:bg-slate-700/90 text-slate-300 hover:text-purple-300 rounded-full p-2 shadow-md'
//                         title='Open Detailed Settings'
//                       >
//                         <Settings2 size={20} />
//                       </Button>
//                     </SheetTrigger>
//                     <SheetContent
//                       side='right'
//                       className='bg-slate-800/95 border-l border-slate-700 text-slate-100 p-0 w-full sm:max-w-sm md:max-w-md backdrop-blur-sm'
//                     >
//                       <SheetHeader className='p-4 border-b border-slate-700'>
//                         <SheetTitle className='text-xl text-slate-100'>
//                           Viewer & Model Settings
//                         </SheetTitle>
//                         <SheetDescription className='text-slate-400 text-xs'>
//                           Fine-tune the appearance, lighting, and animation
//                           playback.
//                         </SheetDescription>
//                       </SheetHeader>
//                       {renderSettingsContent()}
//                       <SheetFooter className='p-4 border-t border-slate-700 bg-slate-800/95'>
//                         <SheetClose asChild>
//                           <Button
//                             type='button'
//                             variant='outline'
//                             className='w-full border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
//                           >
//                             Close Panel
//                           </Button>
//                         </SheetClose>
//                       </SheetFooter>
//                     </SheetContent>
//                   </Sheet>
//                 </div>

//                 <CardContent className='p-0 w-full h-full relative'>
//                   <div
//                     className='relative w-full h-full'
//                     onDragOver={(e) => {
//                       e.preventDefault();
//                       e.stopPropagation();
//                     }}
//                     onDrop={handleFileDropOnViewer}
//                   >
//                     <div
//                       ref={mountRef}
//                       className='w-full h-full rounded-lg overflow-hidden'
//                     />
//                     {isExporting && (
//                       <div className='absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-lg z-10 backdrop-blur-sm'>
//                         <Card className='bg-slate-100 text-slate-800 p-6 sm:p-8 shadow-2xl text-center w-72'>
//                           <CardHeader className='p-0 mb-4'>
//                             <CardTitle className='text-xl sm:text-2xl'>
//                               Exporting Model
//                             </CardTitle>
//                           </CardHeader>
//                           <CardContent className='p-0 space-y-3'>
//                             <div className='text-lg font-semibold'>
//                               {Math.round(exportProgress)}%
//                             </div>
//                             <Progress
//                               value={exportProgress}
//                               className='w-full h-2.5'
//                             />
//                             <p className='text-xs text-slate-500'>
//                               Please wait, this may take a moment...
//                             </p>
//                           </CardContent>
//                         </Card>
//                       </div>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//           <footer className='text-center mt-10 sm:mt-16 py-6 border-t border-slate-700/50'>
//             <p className='text-slate-400 text-sm'>
//               © {new Date().getFullYear()} 3D Shape Studio Pro. All rights
//               reserved.
//             </p>
//             <p className='text-xs text-slate-500 mt-1'>
//               An interactive 3D modeling and visualization tool.
//             </p>
//           </footer>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ModelViewer3D;

// image bckground is woeking fine now try to add full screen mode

// import React, { useRef, useEffect, useState, useCallback } from "react";
// import * as THREE from "three";
// import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
// import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
// import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
// import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";
// import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
// import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
// import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
// import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
// import { TDSLoader } from "three/examples/jsm/loaders/TDSLoader.js";

// import {
//   Download,
//   Play,
//   Pause,
//   RotateCcw,
//   Camera,
//   Shuffle,
//   UploadCloud,
//   XCircle,
//   Loader2,
//   Undo,
//   Redo,
//   StopCircle,
//   Repeat,
//   Settings2,
//   Maximize,
//   Minimize,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Slider } from "@/components/ui/slider";
// import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";
// import { Progress } from "@/components/ui/progress";
// import { Switch } from "@/components/ui/switch";
// import { Separator } from "@/components/ui/separator";
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
//   SheetFooter,
//   SheetClose,
// } from "@/components/ui/sheet";

// import { clsx } from "clsx";
// import { twMerge } from "tailwind-merge";

// export function cn(...inputs) {
//   return twMerge(clsx(inputs));
// }

// const saneNumber = (value, defaultValue = 0) => {
//   const num = Number(value);
//   return isNaN(num) || !isFinite(num) ? defaultValue : num;
// };

// // --- Shape Creation Functions ---
// const createCatShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(0), saneNumber(s * 0.8));
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.6),
//     saneNumber(s * 0.8),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(0)
//   );
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.8),
//     saneNumber(-s * 0.6),
//     saneNumber(-s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(0),
//     saneNumber(-s * 0.8)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.8),
//     saneNumber(-s * 0.6),
//     saneNumber(s * 0.8),
//     saneNumber(0)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(s * 0.6),
//     saneNumber(s * 0.8),
//     saneNumber(0),
//     saneNumber(s * 0.8)
//   );
//   const ear1 = new THREE.Path();
//   ear1.moveTo(saneNumber(-s * 0.4), saneNumber(s * 0.6));
//   ear1.lineTo(saneNumber(-s * 0.7), saneNumber(s * 1.2));
//   ear1.lineTo(saneNumber(-s * 0.1), saneNumber(s * 0.9));
//   ear1.closePath();
//   const ear2 = new THREE.Path();
//   ear2.moveTo(saneNumber(s * 0.4), saneNumber(s * 0.6));
//   ear2.lineTo(saneNumber(s * 0.7), saneNumber(s * 1.2));
//   ear2.lineTo(saneNumber(s * 0.1), saneNumber(s * 0.9));
//   ear2.closePath();
//   shape.holes.push(ear1);
//   shape.holes.push(ear2);
//   return shape;
// };
// const createBirdShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(0), saneNumber(s * 0.6));
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.9),
//     saneNumber(-s * 0.2),
//     saneNumber(-s * 0.6),
//     saneNumber(-s * 0.6)
//   );
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.3),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.3),
//     saneNumber(-s * 0.8),
//     saneNumber(s * 0.6),
//     saneNumber(-s * 0.6)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.9),
//     saneNumber(-s * 0.2),
//     saneNumber(s * 0.8),
//     saneNumber(s * 0.4),
//     saneNumber(0),
//     saneNumber(s * 0.6)
//   );
//   const wing = new THREE.Path();
//   wing.moveTo(saneNumber(-s * 0.3), saneNumber(s * 0.2));
//   wing.bezierCurveTo(
//     saneNumber(-s * 0.7),
//     saneNumber(s * 0.3),
//     saneNumber(-s * 0.8),
//     saneNumber(0),
//     saneNumber(-s * 0.5),
//     saneNumber(-s * 0.3)
//   );
//   wing.bezierCurveTo(
//     saneNumber(-s * 0.2),
//     saneNumber(-s * 0.1),
//     saneNumber(-s * 0.1),
//     saneNumber(s * 0.1),
//     saneNumber(-s * 0.3),
//     saneNumber(s * 0.2)
//   );
//   shape.holes.push(wing);
//   return shape;
// };
// const createFishShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(-s * 0.8), saneNumber(0));
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.6),
//     saneNumber(s * 0.4),
//     saneNumber(-s * 0.2),
//     saneNumber(s * 0.5),
//     saneNumber(s * 0.2),
//     saneNumber(s * 0.3)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.6),
//     saneNumber(s * 0.2),
//     saneNumber(s * 0.8),
//     saneNumber(0),
//     saneNumber(s * 0.8),
//     saneNumber(0)
//   );
//   shape.bezierCurveTo(
//     saneNumber(s * 0.6),
//     saneNumber(-s * 0.2),
//     saneNumber(s * 0.2),
//     saneNumber(-s * 0.3),
//     saneNumber(-s * 0.2),
//     saneNumber(-s * 0.5)
//   );
//   shape.bezierCurveTo(
//     saneNumber(-s * 0.6),
//     saneNumber(-s * 0.4),
//     saneNumber(-s * 0.8),
//     saneNumber(0),
//     saneNumber(-s * 0.8),
//     saneNumber(0)
//   );
//   shape.moveTo(saneNumber(s * 0.8), saneNumber(0));
//   shape.lineTo(saneNumber(s * 1.2), saneNumber(s * 0.3));
//   shape.lineTo(saneNumber(s * 1.0), saneNumber(0));
//   shape.lineTo(saneNumber(s * 1.2), saneNumber(-s * 0.3));
//   shape.lineTo(saneNumber(s * 0.8), saneNumber(0));
//   return shape;
// };
// const createSoccerBallShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const r = s * 0.8;
//   for (let i = 0; i < 6; i++) {
//     const a = (i / 6) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * r);
//     const y = saneNumber(Math.sin(a) * r);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.closePath();
//   const ih = new THREE.Path();
//   const ir = s * 0.4;
//   for (let i = 0; i < 6; i++) {
//     const a = (i / 6) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * ir);
//     const y = saneNumber(Math.sin(a) * ir);
//     if (i === 0) ih.moveTo(x, y);
//     else ih.lineTo(x, y);
//   }
//   ih.closePath();
//   shape.holes.push(ih);
//   return shape;
// };
// const createTennisRacketShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const a = s * 0.6;
//   const b = s * 0.4;
//   for (let i = 0; i <= 32; i++) {
//     const ang = (i / 32) * Math.PI * 2;
//     const x = saneNumber(Math.cos(ang) * a);
//     const y = saneNumber(Math.sin(ang) * b + s * 0.3);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.lineTo(saneNumber(s * 0.1), saneNumber(-s * 0.8));
//   shape.lineTo(saneNumber(-s * 0.1), saneNumber(-s * 0.8));
//   shape.closePath();
//   return shape;
// };
// const createBasketballShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const r = s * 0.8;
//   for (let i = 0; i <= 32; i++) {
//     const a = (i / 32) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * r);
//     const y = saneNumber(Math.sin(a) * r);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.closePath();
//   return shape;
// };
// const createPersonShape = (size = 1) => {
//   const s = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const hr = s * 0.2;
//   for (let i = 0; i <= 16; i++) {
//     const a = (i / 16) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * hr);
//     const y = saneNumber(Math.sin(a) * hr + s * 0.6);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.lineTo(saneNumber(-s * 0.3), saneNumber(s * 0.2));
//   shape.lineTo(saneNumber(-s * 0.4), saneNumber(-s * 0.4));
//   shape.lineTo(saneNumber(-s * 0.2), saneNumber(-s * 0.8));
//   shape.lineTo(saneNumber(s * 0.2), saneNumber(-s * 0.8));
//   shape.lineTo(saneNumber(s * 0.4), saneNumber(-s * 0.4));
//   shape.lineTo(saneNumber(s * 0.3), saneNumber(s * 0.2));
//   shape.closePath();
//   return shape;
// };
// const createRobotShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(-sval * 0.4), saneNumber(sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.4), saneNumber(sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.4), saneNumber(sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.4), saneNumber(sval * 0.4));
//   shape.closePath();
//   shape.moveTo(saneNumber(-sval * 0.5), saneNumber(sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.5), saneNumber(sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.5), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.5), saneNumber(-sval * 0.4));
//   shape.closePath();
//   shape.moveTo(saneNumber(-sval * 0.3), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.1), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(-sval * 0.1), saneNumber(-sval * 0.8));
//   shape.lineTo(saneNumber(-sval * 0.3), saneNumber(-sval * 0.8));
//   shape.closePath();
//   shape.moveTo(saneNumber(sval * 0.1), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.3), saneNumber(-sval * 0.4));
//   shape.lineTo(saneNumber(sval * 0.3), saneNumber(-sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.1), saneNumber(-sval * 0.8));
//   shape.closePath();
//   return shape;
// };
// const createPhoneShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const w = sval * 0.5;
//   const h = sval * 1.0;
//   const r = sval * 0.1;
//   shape.moveTo(saneNumber(-w + r), saneNumber(h));
//   shape.lineTo(saneNumber(w - r), saneNumber(h));
//   shape.quadraticCurveTo(
//     saneNumber(w),
//     saneNumber(h),
//     saneNumber(w),
//     saneNumber(h - r)
//   );
//   shape.lineTo(saneNumber(w), saneNumber(-h + r));
//   shape.quadraticCurveTo(
//     saneNumber(w),
//     saneNumber(-h),
//     saneNumber(w - r),
//     saneNumber(-h)
//   );
//   shape.lineTo(saneNumber(-w + r), saneNumber(-h));
//   shape.quadraticCurveTo(
//     saneNumber(-w),
//     saneNumber(-h),
//     saneNumber(-w),
//     saneNumber(-h + r)
//   );
//   shape.lineTo(saneNumber(-w), saneNumber(h - r));
//   shape.quadraticCurveTo(
//     saneNumber(-w),
//     saneNumber(h),
//     saneNumber(-w + r),
//     saneNumber(h)
//   );
//   shape.closePath();
//   const screen = new THREE.Path();
//   const sw = w * 0.8;
//   const sh = h * 0.8;
//   const sr = r * 0.5;
//   screen.moveTo(saneNumber(-sw + sr), saneNumber(sh));
//   screen.lineTo(saneNumber(sw - sr), saneNumber(sh));
//   screen.quadraticCurveTo(
//     saneNumber(sw),
//     saneNumber(sh),
//     saneNumber(sw),
//     saneNumber(sh - sr)
//   );
//   screen.lineTo(saneNumber(sw), saneNumber(-sh + sr));
//   screen.quadraticCurveTo(
//     saneNumber(sw),
//     saneNumber(-sh),
//     saneNumber(sw - sr),
//     saneNumber(-sh)
//   );
//   screen.lineTo(saneNumber(-sw + sr), saneNumber(-sh));
//   screen.quadraticCurveTo(
//     saneNumber(-sw),
//     saneNumber(-sh),
//     saneNumber(-sw),
//     saneNumber(-sh + sr)
//   );
//   screen.lineTo(saneNumber(-sw), saneNumber(sh - sr));
//   screen.quadraticCurveTo(
//     saneNumber(-sw),
//     saneNumber(sh),
//     saneNumber(-sw + sr),
//     saneNumber(sh)
//   );
//   screen.closePath();
//   shape.holes.push(screen);
//   return shape;
// };
// const createLightningShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   shape.moveTo(saneNumber(-sval * 0.2), saneNumber(sval * 0.8));
//   shape.lineTo(saneNumber(sval * 0.3), saneNumber(sval * 0.2));
//   shape.lineTo(saneNumber(sval * 0.1), saneNumber(sval * 0.2));
//   shape.lineTo(saneNumber(sval * 0.4), saneNumber(-sval * 0.8));
//   shape.lineTo(saneNumber(-sval * 0.1), saneNumber(-sval * 0.2));
//   shape.lineTo(saneNumber(sval * 0.1), saneNumber(-sval * 0.2));
//   shape.lineTo(saneNumber(-sval * 0.4), saneNumber(sval * 0.8));
//   shape.closePath();
//   return shape;
// };
// const createMusicNoteShape = (size = 1) => {
//   const sval = saneNumber(size, 1);
//   const shape = new THREE.Shape();
//   const nr = sval * 0.15;
//   for (let i = 0; i <= 16; i++) {
//     const a = (i / 16) * Math.PI * 2;
//     const x = saneNumber(Math.cos(a) * nr - sval * 0.2);
//     const y = saneNumber(Math.sin(a) * nr - sval * 0.4);
//     if (i === 0) shape.moveTo(x, y);
//     else shape.lineTo(x, y);
//   }
//   shape.lineTo(saneNumber(-sval * 0.05), saneNumber(sval * 0.6));
//   shape.lineTo(saneNumber(sval * 0.05), saneNumber(sval * 0.6));
//   shape.lineTo(saneNumber(sval * 0.05), saneNumber(-sval * 0.25));
//   shape.closePath();
//   shape.moveTo(saneNumber(sval * 0.05), saneNumber(sval * 0.6));
//   shape.bezierCurveTo(
//     saneNumber(sval * 0.4),
//     saneNumber(sval * 0.5),
//     saneNumber(sval * 0.3),
//     saneNumber(sval * 0.2),
//     saneNumber(sval * 0.05),
//     saneNumber(sval * 0.3)
//   );
//   shape.closePath();
//   return shape;
// };

// // --- Material and Shape Data ---
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
// const baseMaterialPresets = {
//   metallic: { metalness: 0.9, roughness: 0.1, envMapIntensity: 1.5 },
//   glass: {
//     metalness: 0.0,
//     roughness: 0.0,
//     transmission: 0.95,
//     thickness: 0.7,
//     transparent: true,
//     opacity: 0.85,
//     envMapIntensity: 2.0,
//     ior: 1.52,
//   },
//   crystal: {
//     metalness: 0.0,
//     roughness: 0.01,
//     transmission: 0.98,
//     thickness: 0.6,
//     transparent: true,
//     opacity: 0.9,
//     envMapIntensity: 2.5,
//     ior: 1.7,
//   },
//   ceramic: { metalness: 0.1, roughness: 0.6, envMapIntensity: 0.8 },
//   organic: { metalness: 0.0, roughness: 0.8, envMapIntensity: 0.5 },
//   plastic: { metalness: 0.0, roughness: 0.3, envMapIntensity: 0.7 },
//   neon: {
//     metalness: 0.0,
//     roughness: 0.1,
//     emissiveIntensity: 1.0,
//     envMapIntensity: 0.2,
//     useEmissive: true,
//   },
// };
// const createAdvancedMaterial = (
//   baseColor,
//   materialType = "standard",
//   customProps = {}
// ) => {
//   const color = new THREE.Color(baseColor);
//   let preset = baseMaterialPresets[materialType] || baseMaterialPresets.ceramic;
//   const finalProps = { ...preset };
//   if (customProps.roughness !== null && customProps.roughness !== undefined)
//     finalProps.roughness = customProps.roughness;
//   if (customProps.metalness !== null && customProps.metalness !== undefined)
//     finalProps.metalness = customProps.metalness;
//   if (customProps.ior !== null && customProps.ior !== undefined)
//     finalProps.ior = customProps.ior;
//   if (
//     customProps.transmission !== null &&
//     customProps.transmission !== undefined
//   )
//     finalProps.transmission = customProps.transmission;
//   if (customProps.thickness !== null && customProps.thickness !== undefined)
//     finalProps.thickness = customProps.thickness;
//   if (
//     customProps.emissiveIntensity !== null &&
//     customProps.emissiveIntensity !== undefined
//   )
//     finalProps.emissiveIntensity = customProps.emissiveIntensity;
//   if (finalProps.useEmissive) {
//     finalProps.emissive = color.clone().multiplyScalar(0.8);
//   }
//   const sharedProps = { color, ...finalProps, side: THREE.DoubleSide };
//   if (materialType === "glass" || materialType === "crystal") {
//     return new THREE.MeshPhysicalMaterial(sharedProps);
//   }
//   return new THREE.MeshStandardMaterial(sharedProps);
// };
// const create3DShape = (shapeId, currentSettings, size = 1) => {
//   let shape;
//   let materialTypeForPreset =
//     currentSettings.materialType === "auto"
//       ? "ceramic"
//       : currentSettings.materialType;
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
//   const config = shapeConfigs[shapeId] || shapeConfigs.cat;
//   const shapeSize = saneNumber(size, 1.5);
//   shape = config.creator(shapeSize);
//   if (currentSettings.materialType === "auto") {
//     materialTypeForPreset = config.autoMaterial;
//   }
//   const extrudeSettings = {
//     depth: saneNumber(currentSettings.extrudeDepth, 0.4),
//     bevelEnabled: true,
//     bevelSegments:
//       currentSettings.quality === "high"
//         ? 10
//         : currentSettings.quality === "medium"
//         ? 6
//         : 3,
//     steps:
//       currentSettings.quality === "high"
//         ? 5
//         : currentSettings.quality === "medium"
//         ? 3
//         : 1,
//     bevelSize: saneNumber(0.035 * (shapeSize / 1.5), 0.02),
//     bevelThickness: saneNumber(0.025 * (shapeSize / 1.5), 0.015),
//     curveSegments:
//       currentSettings.quality === "high"
//         ? 48
//         : currentSettings.quality === "medium"
//         ? 24
//         : 12,
//   };
//   const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
//   geometry.computeVertexNormals();
//   try {
//     geometry.center();
//   } catch (e) {
//     console.error(
//       "Error centering geometry:",
//       e,
//       shapeId,
//       currentSettings,
//       shape
//     );
//     return new THREE.Mesh(
//       new THREE.BoxGeometry(1, 1, 1),
//       new THREE.MeshStandardMaterial({ color: 0xff0000 })
//     );
//   }
//   const material = createAdvancedMaterial(
//     currentSettings.shapeColor,
//     materialTypeForPreset,
//     currentSettings.customMaterialProperties
//   );
//   return new THREE.Mesh(geometry, material);
// };

// const CATEGORIES_DATA = [
//   { id: "animals", name: "Animals", icon: "🐱" },
//   { id: "sports", name: "Sports", icon: "⚽" },
//   { id: "people", name: "People", icon: "👤" },
//   { id: "objects", name: "Objects", icon: "📱" },
// ];
// const SHAPES_BY_CATEGORY_DATA = {
//   animals: [
//     { id: "cat", name: "Cat", icon: "🐱" },
//     { id: "bird", name: "Bird", icon: "🐦" },
//     { id: "fish", name: "Fish", icon: "🐟" },
//   ],
//   sports: [
//     { id: "soccer", name: "Soccer", icon: "⚽" },
//     { id: "tennis", name: "Tennis", icon: "🎾" },
//     { id: "basketball", name: "Basketball", icon: "🏀" },
//   ],
//   people: [
//     { id: "person", name: "Person", icon: "👤" },
//     { id: "robot", name: "Robot", icon: "🤖" },
//   ],
//   objects: [
//     { id: "phone", name: "Phone", icon: "📱" },
//     { id: "lightning", name: "Lightning", icon: "⚡" },
//     { id: "music", name: "Music Note", icon: "🎵" },
//   ],
// };
// const BACKGROUND_OPTIONS_DATA = {
//   modernGradient: "Modern Gradient",
//   darkSpace: "Dark Space",
//   softLight: "Soft Light",
//   studioDark: "Studio Dark",
//   studioLight: "Studio Light",
//   customImage: "Custom Image",
// };

// let gltfLoaderInstance;
// const getGltfLoader = () => {
//   if (!gltfLoaderInstance) {
//     gltfLoaderInstance = new GLTFLoader();
//     const dracoLoader = new DRACOLoader();
//     dracoLoader.setDecoderPath("/draco/gltf/");
//     gltfLoaderInstance.setDRACOLoader(dracoLoader);
//   }
//   return gltfLoaderInstance;
// };

// const initialSettings = {
//   materialType: "auto",
//   shapeColor: "#a78bfa",
//   animationSpeed: 1.0,
//   extrudeDepth: 0.4,
//   quality: "medium",
//   background: "studioDark",
//   keyLight: { enabled: true, intensity: 0.7, color: "#ffffff" },
//   fillLight: { enabled: true, intensity: 0.4, color: "#a0c0ff" },
//   ambientLight: { enabled: true, intensity: 0.25, color: "#ffffff" },
//   customMaterialProperties: {
//     roughness: null,
//     metalness: null,
//     ior: null,
//     transmission: null,
//     thickness: null,
//     emissiveIntensity: null,
//   },
// };

// const ModelViewer3D = () => {
//   const [isMounted, setIsMounted] = useState(false);
//   const mountRef = useRef(null);
//   const sceneRef = useRef(null);
//   const rendererRef = useRef(null);
//   const cameraRef = useRef(null);
//   const controlsRef = useRef(null);
//   const composerRef = useRef(null);
//   const ssaoPassRef = useRef(null);
//   const meshRef = useRef(null);
//   const animationIdRef = useRef(null);
//   const lightsRef = useRef({ key: null, fill: null, ambient: null });
//   const skyboxMeshRef = useRef(null);
//   const envMapTextureRef = useRef(null);
//   const fileInputRef = useRef(null);

//   const viewerCardRef = useRef(null);
//   const [isFullscreen, setIsFullscreen] = useState(false);

//   const [importedModel, setImportedModel] = useState(null);
//   const [isImportedModelDisplayed, setIsImportedModelDisplayed] =
//     useState(false);
//   const [importedModelName, setImportedModelName] = useState("Imported Model");

//   const [currentCategory, setCurrentCategory] = useState(CATEGORIES_DATA[0].id);
//   const [currentShape, setCurrentShape] = useState(
//     SHAPES_BY_CATEGORY_DATA[CATEGORIES_DATA[0].id][0].id
//   );

//   const categories = CATEGORIES_DATA;
//   const shapesByCategory = SHAPES_BY_CATEGORY_DATA;
//   const backgroundOptions = BACKGROUND_OPTIONS_DATA;

//   const [isAnimating, setIsAnimating] = useState(true);
//   const [animationPreset, setAnimationPreset] = useState("gentle");

//   const [settings, setSettings] = useState(
//     JSON.parse(JSON.stringify(initialSettings))
//   );
//   const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);

//   const [isExporting, setIsExporting] = useState(false);
//   const [exportProgress, setExportProgress] = useState(0);

//   const [customBgImageUrl, setCustomBgImageUrl] = useState(null);
//   const backgroundTextureRef = useRef(null);

//   const currentSettingsRef = useRef(settings);
//   useEffect(() => {
//     currentSettingsRef.current = settings;
//   }, [settings]);
//   const isAnimatingRef = useRef(isAnimating);
//   useEffect(() => {
//     isAnimatingRef.current = isAnimating;
//   }, [isAnimating]);
//   const animationPresetRef = useRef(animationPreset);
//   useEffect(() => {
//     animationPresetRef.current = animationPreset;
//   }, [animationPreset]);
//   const animationState = useRef({
//     rotation: new THREE.Euler(),
//     targetRotation: new THREE.Euler(),
//     floatY: 0,
//     startTime: Date.now(),
//   });

//   const mixerRef = useRef(null);
//   const animationClipsRef = useRef([]);
//   const activeActionRef = useRef(null);
//   const [selectedAnimationClipIndex, setSelectedAnimationClipIndex] =
//     useState(-1);
//   const [animationPlaybackState, setAnimationPlaybackState] =
//     useState("stopped");
//   const [animationTime, setAnimationTime] = useState(0);
//   const [animationDuration, setAnimationDuration] = useState(0);
//   const [isAnimationLooping, setIsAnimationLooping] = useState(true);
//   const [animationPlaybackSpeed, setAnimationPlaybackSpeed] = useState(1.0);

//   const historyStackRef = useRef([]);
//   const historyPointerRef = useRef(-1);
//   const isUndoingRedoingRef = useRef(false);
//   const MAX_HISTORY = 50;

//   const captureAppState = useCallback(() => {
//     return JSON.parse(
//       JSON.stringify({
//         settings: currentSettingsRef.current,
//         currentCategory,
//         currentShape,
//         animationPreset: animationPresetRef.current,
//         isAnimating: isAnimatingRef.current,
//         importedModelName,
//         isImportedModelDisplayed,
//         selectedAnimationClipIndex,
//         animationPlaybackState,
//         animationTime,
//         isAnimationLooping,
//         animationPlaybackSpeed,
//         customBgImageUrl,
//       })
//     );
//   }, [
//     currentCategory,
//     currentShape,
//     importedModelName,
//     isImportedModelDisplayed,
//     selectedAnimationClipIndex,
//     animationPlaybackState,
//     animationTime,
//     isAnimationLooping,
//     animationPlaybackSpeed,
//     customBgImageUrl,
//   ]);

//   const applyState = useCallback((stateToApply) => {
//     isUndoingRedoingRef.current = true;
//     setSettings(stateToApply.settings);
//     setCurrentCategory(stateToApply.currentCategory);
//     setCurrentShape(stateToApply.currentShape);
//     setAnimationPreset(stateToApply.animationPreset);
//     setIsAnimating(stateToApply.isAnimating);
//     setImportedModelName(stateToApply.importedModelName);
//     setIsImportedModelDisplayed(stateToApply.isImportedModelDisplayed);
//     setSelectedAnimationClipIndex(stateToApply.selectedAnimationClipIndex);
//     setAnimationPlaybackState(stateToApply.animationPlaybackState);
//     setAnimationTime(stateToApply.animationTime);
//     setIsAnimationLooping(stateToApply.isAnimationLooping);
//     setAnimationPlaybackSpeed(stateToApply.animationPlaybackSpeed);
//     setCustomBgImageUrl(stateToApply.customBgImageUrl);

//     if (activeActionRef.current) {
//       if (stateToApply.animationPlaybackState === "playing") {
//         activeActionRef.current.paused = false;
//         if (!activeActionRef.current.isRunning())
//           activeActionRef.current.play();
//         activeActionRef.current.time =
//           stateToApply.animationTime *
//           activeActionRef.current.getClip().duration;
//       } else if (stateToApply.animationPlaybackState === "paused") {
//         activeActionRef.current.paused = true;
//         activeActionRef.current.time =
//           stateToApply.animationTime *
//           activeActionRef.current.getClip().duration;
//       } else {
//         activeActionRef.current.stop();
//       }
//     }
//     requestAnimationFrame(() => {
//       isUndoingRedoingRef.current = false;
//     });
//   }, []);

//   const pushHistory = useCallback(
//     (actionName = "action") => {
//       if (isUndoingRedoingRef.current) return;
//       const currentState = captureAppState();
//       const previousState = historyStackRef.current[historyPointerRef.current];
//       if (
//         previousState &&
//         JSON.stringify(currentState) === JSON.stringify(previousState)
//       ) {
//         return;
//       }
//       const stack = historyStackRef.current.slice(
//         0,
//         historyPointerRef.current + 1
//       );
//       stack.push(currentState);
//       if (stack.length > MAX_HISTORY) {
//         stack.shift();
//       }
//       historyStackRef.current = stack;
//       historyPointerRef.current = stack.length - 1;
//     },
//     [captureAppState]
//   );

//   const handleUndo = useCallback(() => {
//     if (historyPointerRef.current > 0) {
//       historyPointerRef.current--;
//       applyState(historyStackRef.current[historyPointerRef.current]);
//       sonnerToast.info("Undo", { description: "Reverted to previous state." });
//     } else {
//       sonnerToast.warning("Undo", { description: "Nothing more to undo." });
//     }
//   }, [applyState]);

//   const handleRedo = useCallback(() => {
//     if (historyPointerRef.current < historyStackRef.current.length - 1) {
//       historyPointerRef.current++;
//       applyState(historyStackRef.current[historyPointerRef.current]);
//       sonnerToast.info("Redo", { description: "Reverted to next state." });
//     } else {
//       sonnerToast.warning("Redo", { description: "Nothing more to redo." });
//     }
//   }, [applyState]);

//   useEffect(() => {
//     if (isMounted) {
//       pushHistory("initial load");
//     }
//   }, [isMounted, pushHistory]);

//   const debouncedPushHistoryRef = useRef(null);
//   useEffect(() => {
//     if (debouncedPushHistoryRef.current) {
//       clearTimeout(debouncedPushHistoryRef.current);
//     }
//     debouncedPushHistoryRef.current = setTimeout(() => {
//       if (isMounted && !isUndoingRedoingRef.current)
//         pushHistory("settings changed");
//     }, 500);
//     return () => {
//       if (debouncedPushHistoryRef.current) {
//         clearTimeout(debouncedPushHistoryRef.current);
//       }
//     };
//   }, [settings, customBgImageUrl, pushHistory, isMounted]);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   const toggleFullscreen = useCallback(async () => {
//     if (!viewerCardRef.current) return;

//     if (!document.fullscreenElement) {
//       try {
//         await viewerCardRef.current.requestFullscreen();
//       } catch (err) {
//         console.error(
//           `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
//         );
//         sonnerToast.error("Fullscreen Failed", {
//           description: "Could not enter full-screen mode.",
//         });
//       }
//     } else {
//       if (document.exitFullscreen) {
//         try {
//           await document.exitFullscreen();
//         } catch (err) {
//           console.error(
//             `Error attempting to exit full-screen mode: ${err.message} (${err.name})`
//           );
//           sonnerToast.error("Exit Fullscreen Failed", {
//             description: "Could not exit full-screen mode.",
//           });
//         }
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const handleFullscreenChange = () => {
//       setIsFullscreen(!!document.fullscreenElement);
//       // Trigger resize for Three.js canvas when fullscreen changes
//       setTimeout(() => {
//         if (mountRef.current && cameraRef.current && rendererRef.current) {
//           const width = mountRef.current.clientWidth;
//           const height = mountRef.current.clientHeight;
//           cameraRef.current.aspect = width / height;
//           cameraRef.current.updateProjectionMatrix();
//           rendererRef.current.setSize(width, height);
//           if (composerRef.current) {
//             composerRef.current.setSize(width, height);
//             const sPass = composerRef.current.passes.find(
//               (p) => p instanceof SSAOPass
//             );
//             if (sPass) sPass.setSize(width, height);
//           }
//         }
//       }, 100); // Small delay to allow DOM to settle
//     };

//     document.addEventListener("fullscreenchange", handleFullscreenChange);
//     document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
//     document.addEventListener("mozfullscreenchange", handleFullscreenChange);
//     document.addEventListener("MSFullscreenChange", handleFullscreenChange);

//     return () => {
//       document.removeEventListener("fullscreenchange", handleFullscreenChange);
//       document.removeEventListener(
//         "webkitfullscreenchange",
//         handleFullscreenChange
//       );
//       document.removeEventListener(
//         "mozfullscreenchange",
//         handleFullscreenChange
//       );
//       document.removeEventListener(
//         "MSFullscreenChange",
//         handleFullscreenChange
//       );
//     };
//   }, []);

//   useEffect(() => {
//     if (!isMounted || !mountRef.current) return;
//     const currentMount = mountRef.current;
//     const scene = new THREE.Scene();
//     sceneRef.current = scene;
//     const camera = new THREE.PerspectiveCamera(
//       50,
//       currentMount.clientWidth / currentMount.clientHeight,
//       0.1,
//       1000
//     );
//     cameraRef.current = camera;
//     camera.position.set(0, 0.5, 6);
//     const renderer = new THREE.WebGLRenderer({
//       antialias: true,
//       alpha: true,
//       preserveDrawingBuffer: true,
//     });
//     rendererRef.current = renderer;
//     renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.shadowMap.enabled = true;
//     renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//     renderer.outputColorSpace = THREE.SRGBColorSpace;
//     renderer.toneMapping = THREE.ACESFilmicToneMapping;
//     renderer.toneMappingExposure = 1.0;
//     currentMount.appendChild(renderer.domElement);
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controlsRef.current = controls;
//     controls.enableDamping = true;
//     controls.dampingFactor = 0.05;
//     controls.screenSpacePanning = false;
//     controls.minDistance = 1;
//     controls.maxDistance = 30;
//     controls.maxPolarAngle = Math.PI / 1.6;
//     controls.target.set(0, 0.2, 0);

//     const rgbeLoader = new RGBELoader();
//     rgbeLoader.load(
//       "/brown_photostudio_02_4k.hdr",
//       (texture) => {
//         texture.mapping = THREE.EquirectangularReflectionMapping;
//         if (sceneRef.current) {
//           sceneRef.current.environment = texture;
//           envMapTextureRef.current = texture;
//         }
//       },
//       undefined,
//       (error) => {
//         console.error("Error loading HDR:", error);
//         sonnerToast.error("HDR Load Failed", {
//           description: "Studio lighting map failed.",
//         });
//       }
//     );

//     const ambientLight = new THREE.AmbientLight(
//       0xffffff,
//       initialSettings.ambientLight.intensity
//     );
//     scene.add(ambientLight);
//     const keyLight = new THREE.DirectionalLight(
//       0xffffff,
//       initialSettings.keyLight.intensity
//     );
//     keyLight.position.set(5, 8, 5);
//     keyLight.castShadow = true;
//     keyLight.shadow.mapSize.width = 2048;
//     keyLight.shadow.mapSize.height = 2048;
//     keyLight.shadow.camera.near = 0.5;
//     keyLight.shadow.camera.far = 50;
//     keyLight.shadow.bias = -0.0005;
//     scene.add(keyLight);
//     const fillLight = new THREE.DirectionalLight(
//       0xa0c0ff,
//       initialSettings.fillLight.intensity
//     );
//     fillLight.position.set(-5, 3, -3);
//     scene.add(fillLight);
//     lightsRef.current = {
//       ambient: ambientLight,
//       key: keyLight,
//       fill: fillLight,
//     };

//     const composer = new EffectComposer(renderer);
//     composerRef.current = composer;
//     const renderPass = new RenderPass(scene, camera);
//     composer.addPass(renderPass);
//     const ssaoPassInstance = new SSAOPass(
//       scene,
//       camera,
//       currentMount.clientWidth,
//       currentMount.clientHeight
//     );
//     ssaoPassInstance.kernelRadius = 0.6;
//     ssaoPassInstance.minDistance = 0.001;
//     ssaoPassInstance.maxDistance = 0.03;
//     composer.addPass(ssaoPassInstance);
//     ssaoPassRef.current = ssaoPassInstance;
//     const outputPass = new OutputPass();
//     composer.addPass(outputPass);

//     const handleResize = () => {
//       if (!currentMount || !cameraRef.current || !rendererRef.current) return;
//       const width = currentMount.clientWidth;
//       const height = currentMount.clientHeight;
//       cameraRef.current.aspect = width / height;
//       cameraRef.current.updateProjectionMatrix();
//       rendererRef.current.setSize(width, height);
//       if (composerRef.current) {
//         composerRef.current.setSize(width, height);
//         const sPass = composerRef.current.passes.find(
//           (p) => p instanceof SSAOPass
//         );
//         if (sPass) sPass.setSize(width, height);
//       }
//     };
//     window.addEventListener("resize", handleResize);
//     handleResize(); // Initial call

//     const clock = new THREE.Clock();
//     const animate = () => {
//       animationIdRef.current = requestAnimationFrame(animate);
//       if (
//         !sceneRef.current ||
//         !rendererRef.current ||
//         !cameraRef.current ||
//         !isMounted
//       ) {
//         if (animationIdRef.current)
//           cancelAnimationFrame(animationIdRef.current);
//         return;
//       }
//       const delta = clock.getDelta();
//       if (controlsRef.current) controlsRef.current.update();

//       if (meshRef.current && isAnimatingRef.current) {
//         const animSettings = currentSettingsRef.current;
//         const presetKey = animationPresetRef.current;
//         const preset = animationPresets[presetKey];
//         if (preset) {
//           const effDelta = delta * animSettings.animationSpeed;
//           animationState.current.targetRotation.x +=
//             preset.rotationSpeed[0] * 60 * effDelta;
//           animationState.current.targetRotation.y +=
//             preset.rotationSpeed[1] * 60 * effDelta;
//           animationState.current.targetRotation.z +=
//             preset.rotationSpeed[2] * 60 * effDelta;
//           meshRef.current.rotation.x = THREE.MathUtils.lerp(
//             meshRef.current.rotation.x,
//             animationState.current.targetRotation.x,
//             0.1
//           );
//           meshRef.current.rotation.y = THREE.MathUtils.lerp(
//             meshRef.current.rotation.y,
//             animationState.current.targetRotation.y,
//             0.1
//           );
//           meshRef.current.rotation.z = THREE.MathUtils.lerp(
//             meshRef.current.rotation.z,
//             animationState.current.targetRotation.z,
//             0.1
//           );
//           const floatTime =
//             (Date.now() - animationState.current.startTime) *
//             0.001 *
//             animSettings.animationSpeed;
//           animationState.current.floatY =
//             Math.sin(floatTime * (preset.floatSpeed || 0.0001) * 100) *
//             (preset.floatAmplitude || 0);
//           meshRef.current.position.y = animationState.current.floatY;
//         }
//       }

//       if (mixerRef.current && animationPlaybackState === "playing") {
//         mixerRef.current.update(delta * animationPlaybackSpeed);
//         if (activeActionRef.current) {
//           const clipDuration = activeActionRef.current.getClip().duration;
//           const currentTime = activeActionRef.current.time;
//           setAnimationTime(clipDuration > 0 ? currentTime / clipDuration : 0);
//           if (!isAnimationLooping && currentTime >= clipDuration) {
//             setAnimationPlaybackState("stopped");
//             activeActionRef.current.stop();
//             setAnimationTime(1);
//           }
//         }
//       }

//       if (composerRef.current) composerRef.current.render(delta);
//       else if (rendererRef.current)
//         rendererRef.current.render(sceneRef.current, cameraRef.current);
//     };
//     animate();

//     return () => {
//       window.removeEventListener("resize", handleResize);
//       if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
//       controlsRef.current?.dispose();
//       envMapTextureRef.current?.dispose();
//       if (skyboxMeshRef.current) {
//         sceneRef.current?.remove(skyboxMeshRef.current);
//         skyboxMeshRef.current.geometry?.dispose();
//         skyboxMeshRef.current.material?.dispose();
//       }
//       if (backgroundTextureRef.current) {
//         backgroundTextureRef.current.dispose();
//         backgroundTextureRef.current = null;
//       }
//       if (meshRef.current) {
//         sceneRef.current?.remove(meshRef.current);
//         meshRef.current.traverse((obj) => {
//           if (obj.geometry) obj.geometry.dispose();
//           if (obj.material) {
//             if (Array.isArray(obj.material))
//               obj.material.forEach((m) => m.dispose());
//             else obj.material.dispose();
//           }
//         });
//       }
//       mixerRef.current = null;
//       activeActionRef.current = null;
//       animationClipsRef.current = [];
//       composerRef.current?.passes.forEach((pass) => pass.dispose?.());
//       ssaoPassRef.current?.dispose?.();
//       sceneRef.current?.traverse((obj) => {
//         if (obj.isLight && obj.shadow && obj.shadow.map)
//           obj.shadow.map.dispose();
//         if (obj.geometry) obj.geometry.dispose();
//         if (obj.material) {
//           const materials = Array.isArray(obj.material)
//             ? obj.material
//             : [obj.material];
//           materials.forEach((mat) => {
//             Object.values(mat).forEach((val) => {
//               if (val instanceof THREE.Texture) val.dispose();
//             });
//             mat.dispose();
//           });
//         }
//       });
//       if (rendererRef.current) {
//         rendererRef.current.dispose();
//         if (mountRef.current && rendererRef.current.domElement) {
//           try {
//             mountRef.current.removeChild(rendererRef.current.domElement);
//           } catch (e) {}
//         }
//       }
//       sceneRef.current = null;
//       cameraRef.current = null;
//       rendererRef.current = null;
//       controlsRef.current = null;
//       composerRef.current = null;
//       ssaoPassRef.current = null;
//       meshRef.current = null;
//       envMapTextureRef.current = null;
//       skyboxMeshRef.current = null;
//       lightsRef.current = { ambient: null, key: null, fill: null };
//     };
//   }, [
//     isMounted,
//     animationPlaybackSpeed,
//     animationPlaybackState,
//     isAnimationLooping,
//   ]);

//   useEffect(() => {
//     if (!isMounted || !lightsRef.current) return;
//     const { keyLight, fillLight, ambientLight } = settings;
//     if (lightsRef.current.key) {
//       lightsRef.current.key.intensity = keyLight.enabled
//         ? keyLight.intensity
//         : 0;
//       lightsRef.current.key.color.set(keyLight.color);
//     }
//     if (lightsRef.current.fill) {
//       lightsRef.current.fill.intensity = fillLight.enabled
//         ? fillLight.intensity
//         : 0;
//       lightsRef.current.fill.color.set(fillLight.color);
//     }
//     if (lightsRef.current.ambient) {
//       lightsRef.current.ambient.intensity = ambientLight.enabled
//         ? ambientLight.intensity
//         : 0;
//       lightsRef.current.ambient.color.set(ambientLight.color);
//     }
//   }, [settings.keyLight, settings.fillLight, settings.ambientLight, isMounted]);

//   useEffect(() => {
//     if (!isMounted || !sceneRef.current || !rendererRef.current) return;

//     if (skyboxMeshRef.current) {
//       sceneRef.current.remove(skyboxMeshRef.current);
//       skyboxMeshRef.current.geometry?.dispose();
//       skyboxMeshRef.current.material?.dispose();
//       skyboxMeshRef.current = null;
//     }
//     if (backgroundTextureRef.current) {
//       backgroundTextureRef.current.dispose();
//       backgroundTextureRef.current = null;
//     }
//     sceneRef.current.background = null;
//     sceneRef.current.fog = null;
//     rendererRef.current.toneMappingExposure = 1.0;

//     let topC,
//       bottomC,
//       fogC,
//       fogNear = 8,
//       fogFar = 30;

//     if (settings.background === "customImage" && customBgImageUrl) {
//       const textureLoader = new THREE.TextureLoader();
//       textureLoader.load(
//         customBgImageUrl,
//         (texture) => {
//           if (!sceneRef.current || !rendererRef.current) return;
//           texture.colorSpace = THREE.SRGBColorSpace;
//           sceneRef.current.background = texture;
//           backgroundTextureRef.current = texture;
//           rendererRef.current.toneMappingExposure = 1.0;
//         },
//         undefined,
//         (err) => {
//           console.error("Error loading custom background image:", err);
//           sonnerToast.error("Failed to load custom background.");
//           if (sceneRef.current)
//             sceneRef.current.background = new THREE.Color(0x18181b);
//         }
//       );
//     } else {
//       switch (settings.background) {
//         case "modernGradient":
//           topC = new THREE.Color(0x3a7ca5);
//           bottomC = new THREE.Color(0x1e3b49);
//           fogC = new THREE.Color(0x2c5d72);
//           break;
//         case "darkSpace":
//           sceneRef.current.background = new THREE.Color(0x0a0a10);
//           fogC = new THREE.Color(0x050508);
//           fogNear = 10;
//           fogFar = 35;
//           break;
//         case "softLight":
//           sceneRef.current.background = new THREE.Color(0xe0e8f0);
//           fogC = new THREE.Color(0xd0d8e0);
//           fogNear = 7;
//           fogFar = 28;
//           if (rendererRef.current)
//             rendererRef.current.toneMappingExposure = 0.9;
//           break;
//         case "studioDark":
//           sceneRef.current.background = new THREE.Color(0x18181b);
//           fogC = new THREE.Color(0x101012);
//           fogNear = 12;
//           fogFar = 40;
//           break;
//         case "studioLight":
//           sceneRef.current.background = new THREE.Color(0xf4f4f5);
//           fogC = new THREE.Color(0xe4e4e7);
//           fogNear = 10;
//           fogFar = 35;
//           if (rendererRef.current)
//             rendererRef.current.toneMappingExposure = 0.85;
//           break;
//         default:
//           sceneRef.current.background = new THREE.Color(0x18181b);
//           fogC = new THREE.Color(0x101012);
//       }

//       if (settings.background === "modernGradient" && topC && bottomC) {
//         const gradGeom = new THREE.SphereGeometry(50, 32, 32);
//         const gradMat = new THREE.ShaderMaterial({
//           uniforms: {
//             topColor: { value: topC },
//             bottomColor: { value: bottomC },
//             offset: { value: 33 },
//             exponent: { value: 0.6 },
//           },
//           vertexShader: `varying vec3 vWorldPosition; void main() { vec4 worldPosition = modelMatrix * vec4(position, 1.0); vWorldPosition = worldPosition.xyz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
//           fragmentShader: `uniform vec3 topColor; uniform vec3 bottomColor; uniform float offset; uniform float exponent; varying vec3 vWorldPosition; void main() { float h = normalize(vWorldPosition + offset).y; gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0); }`,
//           side: THREE.BackSide,
//         });
//         skyboxMeshRef.current = new THREE.Mesh(gradGeom, gradMat);
//         sceneRef.current.add(skyboxMeshRef.current);
//       }
//       if (fogC) sceneRef.current.fog = new THREE.Fog(fogC, fogNear, fogFar);
//     }
//   }, [settings.background, customBgImageUrl, isMounted]);

//   const {
//     extrudeDepth: currentExtrudeDepth, // Renamed to avoid conflict
//     quality: currentQuality,
//     shapeColor: currentShapeColor,
//     materialType: currentMaterialType,
//     customMaterialProperties: currentCustomMaterialProperties,
//   } = settings;
//   useEffect(() => {
//     if (!isMounted || !sceneRef.current) return;
//     if (meshRef.current) {
//       sceneRef.current.remove(meshRef.current);
//       meshRef.current.traverse((obj) => {
//         if (obj.geometry) obj.geometry.dispose();
//         if (obj.material) {
//           if (Array.isArray(obj.material))
//             obj.material.forEach((m) => m.dispose());
//           else obj.material.dispose();
//         }
//       });
//       meshRef.current = null;
//     }
//     if (mixerRef.current) {
//       mixerRef.current.stopAllAction();
//       mixerRef.current = null;
//     }
//     activeActionRef.current = null;
//     animationClipsRef.current = [];
//     let newMesh;
//     if (isImportedModelDisplayed && importedModel && importedModel.scene) {
//       newMesh = importedModel.scene.clone(true);
//       const box = new THREE.Box3().setFromObject(newMesh);
//       const sizeVec = box.getSize(new THREE.Vector3());
//       const maxDim = Math.max(
//         saneNumber(sizeVec.x, 1),
//         saneNumber(sizeVec.y, 1),
//         saneNumber(sizeVec.z, 1)
//       );
//       const desiredDisplaySize = 3;
//       const scaleFactor = maxDim > 0 ? desiredDisplaySize / maxDim : 1;
//       newMesh.scale.set(
//         saneNumber(scaleFactor, 1),
//         saneNumber(scaleFactor, 1),
//         saneNumber(scaleFactor, 1)
//       );
//       const scaledBox = new THREE.Box3().setFromObject(newMesh);
//       const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
//       if (
//         !isNaN(scaledCenter.x) &&
//         !isNaN(scaledCenter.y) &&
//         !isNaN(scaledCenter.z)
//       ) {
//         newMesh.position.sub(scaledCenter);
//       } else {
//         console.warn("Imported model center NaN");
//         sonnerToast.warning("Centering Issue");
//         newMesh.position.set(0, 0, 0);
//       }
//       newMesh.traverse((child) => {
//         if (child.isMesh) {
//           child.castShadow = true;
//           child.receiveShadow = true;
//           if (child.material) {
//             if (Array.isArray(child.material)) {
//               child.material.forEach((m) => (m.side = THREE.DoubleSide));
//             } else {
//               child.material.side = THREE.DoubleSide;
//             }
//           }
//         }
//       });
//       if (importedModel.animations && importedModel.animations.length > 0) {
//         mixerRef.current = new THREE.AnimationMixer(newMesh);
//         animationClipsRef.current = importedModel.animations;
//         if (
//           selectedAnimationClipIndex >= 0 &&
//           selectedAnimationClipIndex < animationClipsRef.current.length
//         ) {
//           const clip = animationClipsRef.current[selectedAnimationClipIndex];
//           activeActionRef.current = mixerRef.current.clipAction(clip);
//           setAnimationDuration(clip.duration);
//           if (animationPlaybackState === "playing")
//             activeActionRef.current.play();
//           activeActionRef.current.setLoop(
//             isAnimationLooping ? THREE.LoopRepeat : THREE.LoopOnce,
//             Infinity
//           );
//           activeActionRef.current.timeScale = animationPlaybackSpeed;
//           if (activeActionRef.current)
//             activeActionRef.current.time = animationTime * clip.duration;
//         } else {
//           setSelectedAnimationClipIndex(-1);
//           setAnimationPlaybackState("stopped");
//         }
//       } else {
//         setSelectedAnimationClipIndex(-1);
//         setAnimationPlaybackState("stopped");
//       }
//     } else {
//       const proceduralSettings = {
//         extrudeDepth: currentExtrudeDepth,
//         quality: currentQuality,
//         shapeColor: currentShapeColor,
//         materialType: currentMaterialType,
//         customMaterialProperties: currentCustomMaterialProperties,
//       };
//       newMesh = create3DShape(currentShape, proceduralSettings, 1.5);
//       newMesh.castShadow = true;
//       newMesh.receiveShadow = true;
//       setSelectedAnimationClipIndex(-1);
//       setAnimationPlaybackState("stopped");
//     }
//     newMesh.position.y = 0;
//     animationState.current.floatY = 0;
//     animationState.current.targetRotation.set(0, 0, 0);
//     newMesh.rotation.set(0, 0, 0);
//     sceneRef.current.add(newMesh);
//     meshRef.current = newMesh;
//   }, [
//     currentShape,
//     currentExtrudeDepth,
//     currentQuality,
//     currentShapeColor,
//     currentMaterialType,
//     currentCustomMaterialProperties,
//     isMounted,
//     importedModel,
//     isImportedModelDisplayed,
//     selectedAnimationClipIndex,
//     animationPlaybackState,
//     isAnimationLooping,
//     animationPlaybackSpeed,
//     animationTime,
//   ]);

//   const handleResetAnimation = useCallback(() => {
//     animationState.current.targetRotation.set(0, 0, 0);
//     animationState.current.floatY = 0;
//     animationState.current.startTime = Date.now();
//     if (meshRef.current) {
//       meshRef.current.rotation.set(0, 0, 0);
//       meshRef.current.position.y = 0;
//     }
//     if (controlsRef.current) {
//       controlsRef.current.reset();
//       controlsRef.current.target.set(0, 0.2, 0);
//     }
//     sonnerToast.info("View Reset", {
//       description: "Model position and rotation restored.",
//     });
//     pushHistory("reset animation");
//   }, [pushHistory]);

//   const handleToggleGlobalAnimation = useCallback(() => {
//     setIsAnimating((prev) => {
//       const newIsAnimating = !prev;
//       if (newIsAnimating) {
//         const preset = animationPresets[animationPresetRef.current];
//         const floatAmplitude = preset?.floatAmplitude || 0.1;
//         const floatSpeed = preset?.floatSpeed || 0.001;
//         const timeDivisor = floatAmplitude * (floatSpeed * 100);
//         const timeOffset =
//           timeDivisor !== 0
//             ? (animationState.current.floatY / timeDivisor) * 1000
//             : 0;
//         animationState.current.startTime =
//           Date.now() - (isFinite(timeOffset) ? timeOffset : 0);
//       } else {
//         if (meshRef.current)
//           animationState.current.targetRotation.copy(meshRef.current.rotation);
//       }
//       sonnerToast.info(
//         `Floating Animation ${newIsAnimating ? "Resumed" : "Paused"}`
//       );
//       pushHistory(newIsAnimating ? "resume global anim" : "pause global anim");
//       return newIsAnimating;
//     });
//   }, [pushHistory]);

//   const handleCustomMaterialPropChange = (propName, value) => {
//     setSettings((s) => ({
//       ...s,
//       customMaterialProperties: {
//         ...s.customMaterialProperties,
//         [propName]: saneNumber(
//           value,
//           baseMaterialPresets[s.materialType]?.[propName] ?? 0
//         ),
//       },
//     }));
//   };
//   const resetCustomMaterialProperties = () => {
//     const currentPresetKey = settings.materialType;
//     if (
//       currentPresetKey &&
//       currentPresetKey !== "auto" &&
//       baseMaterialPresets[currentPresetKey]
//     ) {
//       const presetDefaults = baseMaterialPresets[currentPresetKey];
//       setSettings((s) => ({
//         ...s,
//         customMaterialProperties: {
//           roughness: presetDefaults.roughness ?? null,
//           metalness: presetDefaults.metalness ?? null,
//           ior: presetDefaults.ior ?? null,
//           transmission: presetDefaults.transmission ?? null,
//           thickness: presetDefaults.thickness ?? null,
//           emissiveIntensity: presetDefaults.emissiveIntensity ?? null,
//         },
//       }));
//       sonnerToast.info("Material Properties Reset", {
//         description: `Values reset to ${currentPresetKey} defaults.`,
//       });
//       pushHistory("reset custom material props");
//     }
//   };

//   const handleCategorySelect = useCallback(
//     (categoryId) => {
//       setIsImportedModelDisplayed(false);
//       setCurrentCategory(categoryId);
//       setCurrentShape(shapesByCategory[categoryId][0].id);
//       handleResetAnimation();
//       pushHistory("category select");
//     },
//     [shapesByCategory, handleResetAnimation, pushHistory]
//   );

//   const handleShapeSelect = useCallback(
//     (shapeId) => {
//       setIsImportedModelDisplayed(false);
//       setCurrentShape(shapeId);
//       handleResetAnimation();
//       pushHistory("shape select");
//     },
//     [handleResetAnimation, pushHistory]
//   );

//   useEffect(() => {
//     if (isMounted && !isUndoingRedoingRef.current) {
//       handleResetAnimation();
//       pushHistory("animation preset change");
//     }
//   }, [animationPreset, isMounted, handleResetAnimation, pushHistory]);

//   const handleRandomize = useCallback(() => {
//     setIsImportedModelDisplayed(false);
//     setCustomBgImageUrl(null);
//     const randCat = categories[Math.floor(Math.random() * categories.length)];
//     const randShapeList = shapesByCategory[randCat.id];
//     const randShape =
//       randShapeList[Math.floor(Math.random() * randShapeList.length)];
//     const randPresetKey =
//       Object.keys(animationPresets)[
//         Math.floor(Math.random() * Object.keys(animationPresets).length)
//       ];
//     const randColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`;
//     const bgKeys = Object.keys(backgroundOptions).filter(
//       (key) => key !== "customImage"
//     );
//     const randBgKey = bgKeys[Math.floor(Math.random() * bgKeys.length)];
//     const matKeys = [
//       "auto",
//       "metallic",
//       "glass",
//       "crystal",
//       "ceramic",
//       "organic",
//       "plastic",
//       "neon",
//     ];
//     const randMat = matKeys[Math.floor(Math.random() * matKeys.length)];
//     setCurrentCategory(randCat.id);
//     setCurrentShape(randShape.id);
//     setAnimationPreset(randPresetKey);
//     const newKeyLight = {
//       enabled: true,
//       intensity: saneNumber(Math.random() * (1.5 - 0.3) + 0.3, 0.7),
//       color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 85%)`,
//     };
//     const newFillLight = {
//       enabled: true,
//       intensity: saneNumber(Math.random() * (1.0 - 0.2) + 0.2, 0.4),
//       color: `hsl(${Math.floor(Math.random() * 360)}, 60%, 75%)`,
//     };
//     const newAmbientLight = {
//       enabled: true,
//       intensity: saneNumber(Math.random() * (0.5 - 0.1) + 0.1, 0.25),
//       color: `hsl(${Math.floor(Math.random() * 360)}, 50%, 70%)`,
//     };
//     setSettings((prev) => ({
//       ...prev,
//       materialType: randMat,
//       shapeColor: randColor,
//       background: randBgKey,
//       extrudeDepth: saneNumber(Math.random() * (1.0 - 0.1) + 0.1, 0.4),
//       animationSpeed: saneNumber(Math.random() * (2.0 - 0.5) + 0.5, 1.0),
//       keyLight: newKeyLight,
//       fillLight: newFillLight,
//       ambientLight: newAmbientLight,
//       customMaterialProperties: JSON.parse(
//         JSON.stringify(initialSettings.customMaterialProperties)
//       ),
//     }));
//     sonnerToast.success("Scene Randomized!", {
//       description: "Enjoy the new look.",
//     });
//     pushHistory("randomize");
//   }, [categories, shapesByCategory, backgroundOptions, pushHistory]);

//   const currentShapeRef = useRef(currentShape);
//   useEffect(() => {
//     currentShapeRef.current = currentShape;
//   }, [currentShape]);
//   const currentImportedModelNameRef = useRef(importedModelName);
//   useEffect(() => {
//     currentImportedModelNameRef.current = importedModelName;
//   }, [importedModelName]);

//   const handleExportGLB = useCallback(() => {
//     if (!meshRef.current || isExporting) return;
//     setIsExporting(true);
//     setExportProgress(0);
//     const exportToastId = sonnerToast.loading("Exporting GLB...", {
//       description: "Preparing model...",
//     });
//     const exporter = new GLTFExporter();
//     let progress = 0;
//     const progInterval = setInterval(() => {
//       progress += Math.floor(Math.random() * 10 + 5);
//       const curProg = Math.min(progress, 95);
//       setExportProgress(curProg);
//       sonnerToast.loading("Exporting GLB...", {
//         id: exportToastId,
//         description: `Processing... ${curProg}%`,
//       });
//       if (curProg >= 95) clearInterval(progInterval);
//     }, 150);
//     setTimeout(() => {
//       try {
//         if (!(meshRef.current instanceof THREE.Object3D))
//           throw new Error("Model not valid for export.");
//         const exportOptions = { binary: true };
//         if (isImportedModelDisplayed && importedModel?.animations?.length > 0)
//           exportOptions.animations = importedModel.animations;
//         exporter.parse(
//           meshRef.current,
//           (gltf) => {
//             clearInterval(progInterval);
//             setExportProgress(100);
//             sonnerToast.success("GLB Export Ready", {
//               id: exportToastId,
//               description: "Download starting.",
//             });
//             if (!(gltf instanceof ArrayBuffer))
//               throw new Error("Exported GLTF not ArrayBuffer.");
//             const blob = new Blob([gltf], { type: "application/octet-stream" });
//             const link = document.createElement("a");
//             link.href = URL.createObjectURL(blob);
//             const fileNameToExport = isImportedModelDisplayed
//               ? currentImportedModelNameRef.current || "imported-model"
//               : currentShapeRef.current || "model";
//             link.download = `shape-${fileNameToExport}.glb`;
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             URL.revokeObjectURL(link.href);
//             setTimeout(() => {
//               setIsExporting(false);
//               setExportProgress(0);
//             }, 500);
//           },
//           (error) => {
//             clearInterval(progInterval);
//             console.error("GLTFExporter.parse error:", error);
//             sonnerToast.error("GLB Export Failed", {
//               id: exportToastId,
//               description: error.message || "GLTF parsing error.",
//             });
//             setIsExporting(false);
//             setExportProgress(0);
//           },
//           exportOptions
//         );
//       } catch (e) {
//         clearInterval(progInterval);
//         console.error("GLTF export setup error:", e);
//         sonnerToast.error("GLB Export Failed", {
//           id: exportToastId,
//           description: e.message || "Unexpected error.",
//         });
//         setIsExporting(false);
//         setExportProgress(0);
//       }
//     }, 100);
//   }, [isExporting, isImportedModelDisplayed, importedModel]);

//   const handleSimulatedExportOBJ = useCallback(() => {
//     if (isExporting) return;
//     setIsExporting(true);
//     setExportProgress(0);
//     const exportToastId = sonnerToast.loading("Exporting OBJ (Simulated)...", {
//       description: "Processing...",
//     });
//     let p = 0;
//     const i = setInterval(() => {
//       p += Math.floor(Math.random() * 15 + 10);
//       const currentProgress = Math.min(p, 100);
//       setExportProgress(currentProgress);
//       sonnerToast.loading("Exporting OBJ (Simulated)...", {
//         id: exportToastId,
//         description: `Processing... ${currentProgress}%`,
//       });
//       if (currentProgress >= 100) {
//         clearInterval(i);
//         const l = document.createElement("a");
//         l.download = `shape-${
//           isImportedModelDisplayed
//             ? currentImportedModelNameRef.current
//             : currentShapeRef.current || "model"
//         }.obj`;
//         l.href =
//           "data:text/plain;charset=utf-8," +
//           encodeURIComponent(
//             "# OBJ file simulated\n# Actual OBJ Exporter Needed"
//           );
//         document.body.appendChild(l);
//         l.click();
//         document.body.removeChild(l);
//         sonnerToast.success("OBJ Export (Simulated) Ready", {
//           id: exportToastId,
//           description: "Simulated OBJ downloaded.",
//         });
//         setTimeout(() => {
//           setIsExporting(false);
//           setExportProgress(0);
//         }, 500);
//       }
//     }, 150);
//   }, [isExporting, isImportedModelDisplayed]);

//   const handleTakeScreenshot = useCallback(() => {
//     if (!rendererRef.current || !sceneRef.current || !cameraRef.current) {
//       sonnerToast.error("Screenshot Failed", {
//         description: "Renderer not ready.",
//       });
//       return;
//     }
//     const screenshotToastId = sonnerToast.loading("Taking Screenshot...", {
//       description: "Capturing image...",
//     });
//     if (composerRef.current) composerRef.current.render();
//     else rendererRef.current.render(sceneRef.current, cameraRef.current);
//     setTimeout(() => {
//       try {
//         const canvas = rendererRef.current.domElement;
//         const link = document.createElement("a");
//         link.download = `screenshot-${
//           isImportedModelDisplayed
//             ? currentImportedModelNameRef.current
//             : currentShapeRef.current || "view"
//         }.png`;
//         link.href = canvas.toDataURL("image/png");
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         sonnerToast.success("Screenshot Saved!", {
//           id: screenshotToastId,
//           description: `${link.download} saved.`,
//         });
//       } catch (e) {
//         console.error("Screenshot error:", e);
//         sonnerToast.error("Screenshot Failed", {
//           id: screenshotToastId,
//           description: e.message || "Could not save.",
//         });
//       }
//     }, 100);
//   }, [isImportedModelDisplayed]);

//   const processAndSetImportedModel = useCallback(
//     (scene, animations, fileName) => {
//       const nameOnly =
//         fileName.split(".").slice(0, -1).join(".") || "Imported Model";
//       setImportedModelName(nameOnly);
//       setImportedModel({ scene, animations: animations || [] });
//       setIsImportedModelDisplayed(true);
//       handleResetAnimation();
//     },
//     [handleResetAnimation]
//   );

//   const processImportedGltf = useCallback(
//     (gltf, fileName) => {
//       processAndSetImportedModel(gltf.scene, gltf.animations, fileName);
//     },
//     [processAndSetImportedModel]
//   );

//   const handleFiles = useCallback(
//     async (files) => {
//       if (!files || files.length === 0) return;
//       const importToastId = sonnerToast.loading("Processing File(s)...");
//       let objFile = null,
//         mtlFile = null,
//         fbxFile = null,
//         tdsFile = null,
//         otherModelFile = null;
//       for (const file of files) {
//         const lowerName = file.name.toLowerCase();
//         if (lowerName.endsWith(".obj")) objFile = file;
//         else if (lowerName.endsWith(".mtl")) mtlFile = file;
//         else if (lowerName.endsWith(".fbx")) fbxFile = file;
//         else if (lowerName.endsWith(".3ds")) tdsFile = file;
//         else if (
//           lowerName.endsWith(".glb") ||
//           lowerName.endsWith(".gltf") ||
//           lowerName.endsWith(".stl")
//         ) {
//           if (!otherModelFile) otherModelFile = file;
//         }
//       }
//       const modelLoadedSuccessfully = (modelName, format) => {
//         sonnerToast.success(`${format} Model Loaded`, {
//           id: importToastId,
//           description: `${modelName} displayed.`,
//         });
//         pushHistory(`import ${format}`);
//       };
//       const modelLoadFailed = (modelName, format, errorMsg) => {
//         sonnerToast.error(`${format} Load Failed`, {
//           id: importToastId,
//           description: `${modelName}: ${errorMsg || "Unknown"}`,
//         });
//       };
//       if (objFile) {
//         sonnerToast.info("Processing OBJ model...", {
//           id: importToastId,
//           description: `Loading ${objFile.name}${
//             mtlFile ? " with " + mtlFile.name : ""
//           }`,
//         });
//         try {
//           const objLoader = new OBJLoader();
//           const mtlLoader = new MTLLoader();
//           let materialsCreator = null;
//           if (
//             mtlFile &&
//             objFile.name.slice(0, -4) === mtlFile.name.slice(0, -4)
//           ) {
//             const mtlText = await mtlFile.text();
//             mtlLoader.setResourcePath("");
//             materialsCreator = mtlLoader.parse(mtlText, "");
//             materialsCreator.preload();
//           }
//           const objText = await objFile.text();
//           if (materialsCreator) objLoader.setMaterials(materialsCreator);
//           const object = objLoader.parse(objText);
//           object.traverse((child) => {
//             if (child.isMesh) {
//               if (child.material) {
//                 if (Array.isArray(child.material))
//                   child.material.forEach(
//                     (mat) => (mat.side = THREE.DoubleSide)
//                   );
//                 else child.material.side = THREE.DoubleSide;
//               } else if (!materialsCreator) {
//                 child.material = createAdvancedMaterial(
//                   currentSettingsRef.current.shapeColor,
//                   "ceramic",
//                   {}
//                 );
//                 child.material.side = THREE.DoubleSide;
//               }
//               child.castShadow = true;
//               child.receiveShadow = true;
//             }
//           });
//           processAndSetImportedModel(object, [], objFile.name);
//           modelLoadedSuccessfully(objFile.name, "OBJ");
//         } catch (error) {
//           console.error("OBJ/MTL Error:", error);
//           modelLoadFailed(objFile.name, "OBJ/MTL", error.message);
//         }
//       } else if (fbxFile) {
//         sonnerToast.info("Processing FBX model...", {
//           id: importToastId,
//           description: `Loading ${fbxFile.name}. This may take a moment...`,
//         });
//         try {
//           const buffer = await fbxFile.arrayBuffer();
//           const loader = new FBXLoader();
//           const object = loader.parse(buffer, "");
//           object.traverse((child) => {
//             if (child.isMesh) {
//               child.castShadow = true;
//               child.receiveShadow = true;
//               if (child.material) {
//                 if (Array.isArray(child.material))
//                   child.material.forEach(
//                     (mat) => (mat.side = THREE.DoubleSide)
//                   );
//                 else child.material.side = THREE.DoubleSide;
//               }
//             }
//           });
//           processAndSetImportedModel(
//             object,
//             object.animations || [],
//             fbxFile.name
//           );
//           modelLoadedSuccessfully(fbxFile.name, "FBX");
//         } catch (error) {
//           console.error("FBX Error:", error);
//           modelLoadFailed(fbxFile.name, "FBX", error.message);
//         }
//       } else if (tdsFile) {
//         sonnerToast.info("Processing 3DS model...", {
//           id: importToastId,
//           description: `Loading ${tdsFile.name}`,
//         });
//         try {
//           const buffer = await tdsFile.arrayBuffer();
//           const loader = new TDSLoader();
//           const object = loader.parse(buffer, "");
//           object.traverse((child) => {
//             if (child.isMesh) {
//               child.castShadow = true;
//               child.receiveShadow = true;
//               if (child.material) {
//                 if (Array.isArray(child.material))
//                   child.material.forEach(
//                     (mat) => (mat.side = THREE.DoubleSide)
//                   );
//                 else child.material.side = THREE.DoubleSide;
//               } else {
//                 child.material = createAdvancedMaterial(
//                   currentSettingsRef.current.shapeColor,
//                   "plastic",
//                   {}
//                 );
//                 child.material.side = THREE.DoubleSide;
//               }
//             }
//           });
//           processAndSetImportedModel(object, [], tdsFile.name);
//           modelLoadedSuccessfully(tdsFile.name, "3DS");
//         } catch (error) {
//           console.error("3DS Error:", error);
//           modelLoadFailed(tdsFile.name, "3DS", error.message);
//         }
//       } else if (otherModelFile) {
//         sonnerToast.info("Processing model...", {
//           id: importToastId,
//           description: `Loading ${otherModelFile.name}`,
//         });
//         const lowerName = otherModelFile.name.toLowerCase();
//         try {
//           const buffer = await otherModelFile.arrayBuffer();
//           if (lowerName.endsWith(".glb") || lowerName.endsWith(".gltf")) {
//             const loader = getGltfLoader();
//             loader.parse(
//               buffer,
//               "",
//               (gltf) => {
//                 processImportedGltf(gltf, otherModelFile.name);
//                 modelLoadedSuccessfully(otherModelFile.name, "GLTF/GLB");
//               },
//               (error) => {
//                 console.error("GLB/GLTF Parse Error:", error);
//                 modelLoadFailed(otherModelFile.name, "GLTF/GLB", error.message);
//               }
//             );
//             return;
//           } else if (lowerName.endsWith(".stl")) {
//             const loader = new STLLoader();
//             const geometry = loader.parse(buffer);
//             if (!geometry.isBufferGeometry)
//               throw new Error("Invalid STL geometry.");
//             const material = createAdvancedMaterial(
//               currentSettingsRef.current.shapeColor,
//               "plastic",
//               {}
//             );
//             const modelScene = new THREE.Mesh(geometry, material);
//             processAndSetImportedModel(modelScene, [], otherModelFile.name);
//             modelLoadedSuccessfully(otherModelFile.name, "STL");
//           }
//         } catch (error) {
//           console.error("Model Load Error:", error);
//           modelLoadFailed(otherModelFile.name, "Model", error.message);
//         }
//       } else {
//         sonnerToast.warning("No Supported File", {
//           id: importToastId,
//           description: "Please select GLB, GLTF, STL, OBJ, FBX or 3DS.",
//         });
//       }
//       if (fileInputRef.current) fileInputRef.current.value = null;
//     },
//     [processImportedGltf, processAndSetImportedModel, pushHistory]
//   );

//   const triggerImport = useCallback(() => {
//     if (fileInputRef.current) fileInputRef.current.click();
//   }, []);

//   const handleFileDropOnViewer = useCallback(
//     (event) => {
//       event.preventDefault();
//       event.stopPropagation();
//       if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
//         handleFiles(Array.from(event.dataTransfer.files));
//       }
//     },
//     [handleFiles]
//   );

//   const handlePlayPauseAnimation = () => {
//     if (!activeActionRef.current) return;
//     if (animationPlaybackState === "playing") {
//       activeActionRef.current.paused = true;
//       setAnimationPlaybackState("paused");
//     } else {
//       activeActionRef.current.paused = false;
//       if (!activeActionRef.current.isRunning()) activeActionRef.current.play();
//       setAnimationPlaybackState("playing");
//     }
//     pushHistory("play/pause imported anim");
//   };
//   const handleStopAnimation = () => {
//     if (!activeActionRef.current) return;
//     activeActionRef.current.stop();
//     setAnimationPlaybackState("stopped");
//     setAnimationTime(0);
//     pushHistory("stop imported anim");
//   };
//   const handleAnimationClipChange = (indexStr) => {
//     const index = parseInt(indexStr, 10);
//     if (
//       mixerRef.current &&
//       index >= 0 &&
//       index < animationClipsRef.current.length
//     ) {
//       if (activeActionRef.current) activeActionRef.current.stop();
//       const clip = animationClipsRef.current[index];
//       activeActionRef.current = mixerRef.current.clipAction(clip);
//       activeActionRef.current.setLoop(
//         isAnimationLooping ? THREE.LoopRepeat : THREE.LoopOnce,
//         Infinity
//       );
//       activeActionRef.current.timeScale = animationPlaybackSpeed;
//       activeActionRef.current.play();
//       setSelectedAnimationClipIndex(index);
//       setAnimationPlaybackState("playing");
//       setAnimationDuration(clip.duration);
//       setAnimationTime(0);
//       pushHistory("change animation clip");
//     }
//   };
//   const handleAnimationTimeChange = (value) => {
//     if (activeActionRef.current && animationDuration > 0) {
//       const newTime = value[0] * animationDuration;
//       activeActionRef.current.time = newTime;
//       if (mixerRef.current) mixerRef.current.update(0);
//       setAnimationTime(value[0]);
//     }
//   };
//   const handleAnimationLoopToggle = (checked) => {
//     setIsAnimationLooping(checked);
//     if (activeActionRef.current) {
//       activeActionRef.current.setLoop(
//         checked ? THREE.LoopRepeat : THREE.LoopOnce,
//         Infinity
//       );
//     }
//     pushHistory("toggle animation loop");
//   };
//   const handleAnimationSpeedChange = (value) => {
//     setAnimationPlaybackSpeed(value[0]);
//     if (activeActionRef.current) {
//       activeActionRef.current.timeScale = value[0];
//     }
//   };

//   const handleCustomBgImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setCustomBgImageUrl(e.target.result);
//         sonnerToast.success("Background image set.");
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleClearCustomBgImage = () => {
//     setCustomBgImageUrl(null);
//     sonnerToast.info("Custom background image cleared.");
//   };

//   if (!isMounted) {
//     return (
//       <div className='min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-4'>
//         <Loader2 className='h-12 w-12 animate-spin text-purple-400 mb-4' />
//         <p className='text-lg font-medium'>Initializing 3D Studio...</p>
//         <p className='text-sm text-slate-400'>
//           Getting things ready, please wait.
//         </p>
//       </div>
//     );
//   }

//   const canUndo = historyPointerRef.current > 0;
//   const canRedo =
//     historyPointerRef.current < historyStackRef.current.length - 1;
//   const proceduralMaterialType =
//     settings.materialType === "auto"
//       ? SHAPES_BY_CATEGORY_DATA[currentCategory]?.find(
//           (s) => s.id === currentShape
//         )?.autoMaterial || "ceramic"
//       : settings.materialType;

//   const renderSettingsContent = () => (
//     <div className='space-y-4 py-4 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50 pr-3 pl-4'>
//       {!isImportedModelDisplayed && (
//         <>
//           <p className='text-sm text-slate-300 font-semibold uppercase tracking-wider'>
//             Procedural Shape Material
//           </p>
//           <div className='space-y-1.5'>
//             <Label
//               htmlFor='materialTypePanel'
//               className='text-sm text-slate-300'
//             >
//               Base Material
//             </Label>
//             <Select
//               value={settings.materialType}
//               onValueChange={(value) => {
//                 setSettings((s) => ({ ...s, materialType: value }));
//                 resetCustomMaterialProperties();
//               }}
//             >
//               <SelectTrigger
//                 id='materialTypePanel'
//                 className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'
//               >
//                 <SelectValue placeholder='Select material' />
//               </SelectTrigger>
//               <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
//                 {[
//                   "auto",
//                   "metallic",
//                   "glass",
//                   "crystal",
//                   "ceramic",
//                   "organic",
//                   "plastic",
//                   "neon",
//                 ].map((type) => (
//                   <SelectItem
//                     key={type}
//                     value={type}
//                     className='capitalize focus:bg-purple-600 focus:text-white'
//                   >
//                     {type}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <div className='space-y-1.5'>
//             <Label htmlFor='shapeColorPanel' className='text-sm text-slate-300'>
//               Base Color
//             </Label>
//             <Input
//               id='shapeColorPanel'
//               type='color'
//               value={settings.shapeColor}
//               onChange={(e) =>
//                 setSettings((s) => ({ ...s, shapeColor: e.target.value }))
//               }
//               className='w-full p-1 h-9 bg-slate-700 border-slate-600 cursor-pointer focus-visible:ring-purple-500'
//             />
//           </div>
//           {settings.materialType !== "auto" && (
//             <div className='p-3 border border-slate-600 rounded-md space-y-3 bg-slate-700/30'>
//               <div className='flex justify-between items-center'>
//                 <h4 className='text-xs font-semibold text-purple-300'>
//                   Fine-tune '{settings.materialType}'
//                 </h4>
//                 <Button
//                   variant='ghost'
//                   size='xs'
//                   onClick={resetCustomMaterialProperties}
//                   className='text-slate-400 hover:text-purple-300 h-7 px-2'
//                 >
//                   Reset
//                 </Button>
//               </div>
//               {(proceduralMaterialType === "metallic" ||
//                 proceduralMaterialType === "glass" ||
//                 proceduralMaterialType === "crystal" ||
//                 proceduralMaterialType === "ceramic" ||
//                 proceduralMaterialType === "organic" ||
//                 proceduralMaterialType === "plastic" ||
//                 proceduralMaterialType === "neon") && (
//                 <div className='space-y-1.5'>
//                   <div className='flex justify-between items-center'>
//                     <Label
//                       htmlFor='customRoughnessPanel'
//                       className='text-xs text-slate-300'
//                     >
//                       Roughness
//                     </Label>
//                     <span className='text-xs text-slate-400'>
//                       {(
//                         settings.customMaterialProperties.roughness ??
//                         baseMaterialPresets[proceduralMaterialType]
//                           ?.roughness ??
//                         0
//                       ).toFixed(2)}
//                     </span>
//                   </div>
//                   <Slider
//                     id='customRoughnessPanel'
//                     min={0}
//                     max={1}
//                     step={0.01}
//                     value={[
//                       settings.customMaterialProperties.roughness ??
//                         baseMaterialPresets[proceduralMaterialType]
//                           ?.roughness ??
//                         0,
//                     ]}
//                     onValueChange={([val]) =>
//                       handleCustomMaterialPropChange("roughness", val)
//                     }
//                     className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//                   />
//                 </div>
//               )}
//               {(proceduralMaterialType === "metallic" ||
//                 proceduralMaterialType === "ceramic" ||
//                 proceduralMaterialType === "plastic") && (
//                 <div className='space-y-1.5'>
//                   <div className='flex justify-between items-center'>
//                     <Label
//                       htmlFor='customMetalnessPanel'
//                       className='text-xs text-slate-300'
//                     >
//                       Metalness
//                     </Label>
//                     <span className='text-xs text-slate-400'>
//                       {(
//                         settings.customMaterialProperties.metalness ??
//                         baseMaterialPresets[proceduralMaterialType]
//                           ?.metalness ??
//                         0
//                       ).toFixed(2)}
//                     </span>
//                   </div>
//                   <Slider
//                     id='customMetalnessPanel'
//                     min={0}
//                     max={1}
//                     step={0.01}
//                     value={[
//                       settings.customMaterialProperties.metalness ??
//                         baseMaterialPresets[proceduralMaterialType]
//                           ?.metalness ??
//                         0,
//                     ]}
//                     onValueChange={([val]) =>
//                       handleCustomMaterialPropChange("metalness", val)
//                     }
//                     className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//                   />
//                 </div>
//               )}
//               {(proceduralMaterialType === "glass" ||
//                 proceduralMaterialType === "crystal") && (
//                 <>
//                   <div className='space-y-1.5'>
//                     <div className='flex justify-between items-center'>
//                       <Label
//                         htmlFor='customIorPanel'
//                         className='text-xs text-slate-300'
//                       >
//                         IOR
//                       </Label>
//                       <span className='text-xs text-slate-400'>
//                         {(
//                           settings.customMaterialProperties.ior ??
//                           baseMaterialPresets[proceduralMaterialType]?.ior ??
//                           1.5
//                         ).toFixed(2)}
//                       </span>
//                     </div>
//                     <Slider
//                       id='customIorPanel'
//                       min={1}
//                       max={2.33}
//                       step={0.01}
//                       value={[
//                         settings.customMaterialProperties.ior ??
//                           baseMaterialPresets[proceduralMaterialType]?.ior ??
//                           1.5,
//                       ]}
//                       onValueChange={([val]) =>
//                         handleCustomMaterialPropChange("ior", val)
//                       }
//                       className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//                     />
//                   </div>
//                   <div className='space-y-1.5'>
//                     <div className='flex justify-between items-center'>
//                       <Label
//                         htmlFor='customTransmissionPanel'
//                         className='text-xs text-slate-300'
//                       >
//                         Transmission
//                       </Label>
//                       <span className='text-xs text-slate-400'>
//                         {(
//                           settings.customMaterialProperties.transmission ??
//                           baseMaterialPresets[proceduralMaterialType]
//                             ?.transmission ??
//                           0
//                         ).toFixed(2)}
//                       </span>
//                     </div>
//                     <Slider
//                       id='customTransmissionPanel'
//                       min={0}
//                       max={1}
//                       step={0.01}
//                       value={[
//                         settings.customMaterialProperties.transmission ??
//                           baseMaterialPresets[proceduralMaterialType]
//                             ?.transmission ??
//                           0,
//                       ]}
//                       onValueChange={([val]) =>
//                         handleCustomMaterialPropChange("transmission", val)
//                       }
//                       className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//                     />
//                   </div>
//                   <div className='space-y-1.5'>
//                     <div className='flex justify-between items-center'>
//                       <Label
//                         htmlFor='customThicknessPanel'
//                         className='text-xs text-slate-300'
//                       >
//                         Thickness
//                       </Label>
//                       <span className='text-xs text-slate-400'>
//                         {(
//                           settings.customMaterialProperties.thickness ??
//                           baseMaterialPresets[proceduralMaterialType]
//                             ?.thickness ??
//                           0
//                         ).toFixed(2)}
//                       </span>
//                     </div>
//                     <Slider
//                       id='customThicknessPanel'
//                       min={0}
//                       max={2}
//                       step={0.01}
//                       value={[
//                         settings.customMaterialProperties.thickness ??
//                           baseMaterialPresets[proceduralMaterialType]
//                             ?.thickness ??
//                           0,
//                       ]}
//                       onValueChange={([val]) =>
//                         handleCustomMaterialPropChange("thickness", val)
//                       }
//                       className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//                     />
//                   </div>
//                 </>
//               )}
//               {proceduralMaterialType === "neon" && (
//                 <div className='space-y-1.5'>
//                   <div className='flex justify-between items-center'>
//                     <Label
//                       htmlFor='customEmissiveIntensityPanel'
//                       className='text-xs text-slate-300'
//                     >
//                       Emissive Intensity
//                     </Label>
//                     <span className='text-xs text-slate-400'>
//                       {(
//                         settings.customMaterialProperties.emissiveIntensity ??
//                         baseMaterialPresets.neon?.emissiveIntensity ??
//                         1.0
//                       ).toFixed(2)}
//                     </span>
//                   </div>
//                   <Slider
//                     id='customEmissiveIntensityPanel'
//                     min={0}
//                     max={5}
//                     step={0.1}
//                     value={[
//                       settings.customMaterialProperties.emissiveIntensity ??
//                         baseMaterialPresets.neon?.emissiveIntensity ??
//                         1.0,
//                     ]}
//                     onValueChange={([val]) =>
//                       handleCustomMaterialPropChange("emissiveIntensity", val)
//                     }
//                     className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//                   />
//                 </div>
//               )}
//             </div>
//           )}
//           <Separator className='my-3 bg-slate-600' />
//           <p className='text-sm text-slate-300 font-semibold uppercase tracking-wider'>
//             Procedural Shape Geometry
//           </p>
//           <div className='space-y-1.5'>
//             <div className='flex justify-between items-center'>
//               <Label
//                 htmlFor='extrudeDepthPanel'
//                 className='text-sm text-slate-300'
//               >
//                 Depth
//               </Label>
//               <span className='text-xs text-slate-400'>
//                 {settings.extrudeDepth.toFixed(2)}
//               </span>
//             </div>
//             <Slider
//               id='extrudeDepthPanel'
//               min={0.05}
//               max={1.5}
//               step={0.05}
//               value={[settings.extrudeDepth]}
//               onValueChange={([value]) =>
//                 setSettings((s) => ({ ...s, extrudeDepth: value }))
//               }
//               className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//             />
//           </div>
//           <div className='space-y-1.5'>
//             <Label htmlFor='qualityPanel' className='text-sm text-slate-300'>
//               Quality
//             </Label>
//             <Select
//               value={settings.quality}
//               onValueChange={(value) =>
//                 setSettings((s) => ({ ...s, quality: value }))
//               }
//             >
//               <SelectTrigger
//                 id='qualityPanel'
//                 className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'
//               >
//                 <SelectValue placeholder='Select quality' />
//               </SelectTrigger>
//               <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
//                 {["low", "medium", "high"].map((q) => (
//                   <SelectItem
//                     key={q}
//                     value={q}
//                     className='capitalize focus:bg-purple-600 focus:text-white'
//                   >
//                     {q}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </>
//       )}

//       <Separator className='my-3 bg-slate-600' />
//       <p className='text-sm text-slate-300 font-semibold uppercase tracking-wider'>
//         General Display
//       </p>
//       <div className='space-y-1.5'>
//         <div className='flex justify-between items-center'>
//           <Label
//             htmlFor='animationSpeedPanel'
//             className='text-sm text-slate-300'
//           >
//             Float Anim. Speed
//           </Label>
//           <span className='text-xs text-slate-400'>
//             {settings.animationSpeed.toFixed(1)}x
//           </span>
//         </div>
//         <Slider
//           id='animationSpeedPanel'
//           min={0.1}
//           max={3}
//           step={0.1}
//           value={[settings.animationSpeed]}
//           onValueChange={([value]) =>
//             setSettings((s) => ({ ...s, animationSpeed: value }))
//           }
//           className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//         />
//       </div>

//       <div className='space-y-1.5'>
//         <Label htmlFor='backgroundPanel' className='text-sm text-slate-300'>
//           Background
//         </Label>
//         <Select
//           value={settings.background}
//           onValueChange={(value) =>
//             setSettings((s) => ({ ...s, background: value }))
//           }
//         >
//           <SelectTrigger
//             id='backgroundPanel'
//             className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'
//           >
//             <SelectValue placeholder='Select background' />
//           </SelectTrigger>
//           <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
//             {Object.entries(backgroundOptions).map(([key, name]) => (
//               <SelectItem
//                 key={key}
//                 value={key}
//                 className='focus:bg-purple-600 focus:text-white'
//               >
//                 {name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         {settings.background === "customImage" && (
//           <div className='mt-2 space-y-1.5 p-3 border border-slate-600 rounded-md bg-slate-700/30'>
//             <Label
//               htmlFor='customBgImagePanel'
//               className='text-sm text-slate-300'
//             >
//               Upload Background Image
//             </Label>
//             <Input
//               id='customBgImagePanel'
//               type='file'
//               accept='image/png, image/jpeg, image/webp'
//               onChange={handleCustomBgImageUpload}
//               className='w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer'
//             />
//             {customBgImageUrl && (
//               <Button
//                 variant='ghost'
//                 size='xs'
//                 onClick={handleClearCustomBgImage}
//                 className='text-red-400 hover:text-red-300 hover:bg-transparent mt-1 w-full'
//               >
//                 Clear Custom Image
//               </Button>
//             )}
//           </div>
//         )}
//       </div>

//       <Separator className='my-3 bg-slate-600' />
//       <p className='text-sm text-slate-300 font-semibold uppercase tracking-wider'>
//         Lighting
//       </p>
//       {["keyLight", "fillLight", "ambientLight"].map((lightKey) => {
//         const lightName =
//           lightKey.replace("Light", "").charAt(0).toUpperCase() +
//           lightKey.replace("Light", "").slice(1);
//         return (
//           <div
//             key={lightKey}
//             className='p-3 border border-slate-600 rounded-md space-y-2 text-xs bg-slate-700/30'
//           >
//             <div className='flex items-center justify-between'>
//               <Label
//                 htmlFor={`${lightKey}EnablePanel`}
//                 className='text-slate-200 text-sm'
//               >
//                 {lightName} Light
//               </Label>
//               <Switch
//                 id={`${lightKey}EnablePanel`}
//                 checked={settings[lightKey].enabled}
//                 onCheckedChange={(checked) =>
//                   setSettings((s) => ({
//                     ...s,
//                     [lightKey]: { ...s[lightKey], enabled: checked },
//                   }))
//                 }
//               />
//             </div>
//             {settings[lightKey].enabled && (
//               <>
//                 <div className='flex justify-between items-center'>
//                   <Label
//                     htmlFor={`${lightKey}IntensityPanel`}
//                     className='text-slate-300'
//                   >
//                     Intensity
//                   </Label>
//                   <span className='text-slate-400'>
//                     {settings[lightKey].intensity.toFixed(2)}
//                   </span>
//                 </div>
//                 <Slider
//                   id={`${lightKey}IntensityPanel`}
//                   min={0}
//                   max={2}
//                   step={0.05}
//                   value={[settings[lightKey].intensity]}
//                   onValueChange={([val]) =>
//                     setSettings((s) => ({
//                       ...s,
//                       [lightKey]: { ...s[lightKey], intensity: val },
//                     }))
//                   }
//                   className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//                 />
//                 <Label
//                   htmlFor={`${lightKey}ColorPanel`}
//                   className='text-slate-300'
//                 >
//                   Color
//                 </Label>
//                 <Input
//                   id={`${lightKey}ColorPanel`}
//                   type='color'
//                   value={settings[lightKey].color}
//                   onChange={(e) =>
//                     setSettings((s) => ({
//                       ...s,
//                       [lightKey]: { ...s[lightKey], color: e.target.value },
//                     }))
//                   }
//                   className='w-full h-7 p-0.5 bg-slate-600 border-slate-500 cursor-pointer'
//                 />
//               </>
//             )}
//           </div>
//         );
//       })}

//       {isImportedModelDisplayed && animationClipsRef.current.length > 0 && (
//         <>
//           <Separator className='my-3 bg-slate-600' />
//           <p className='text-sm text-slate-300 font-semibold uppercase tracking-wider'>
//             Animation Playback
//           </p>
//           <div className='space-y-4 p-3 border border-slate-600 rounded-md bg-slate-700/30'>
//             <Select
//               value={selectedAnimationClipIndex.toString()}
//               onValueChange={handleAnimationClipChange}
//               disabled={animationClipsRef.current.length === 0}
//             >
//               <SelectTrigger className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'>
//                 <SelectValue placeholder='Select animation clip' />
//               </SelectTrigger>
//               <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
//                 {animationClipsRef.current.map((clip, index) => (
//                   <SelectItem
//                     key={index}
//                     value={index.toString()}
//                     className='focus:bg-purple-600 focus:text-white'
//                   >
//                     {clip.name || `Animation ${index + 1}`}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <div className='grid grid-cols-3 gap-2'>
//               <Button
//                 onClick={handlePlayPauseAnimation}
//                 disabled={selectedAnimationClipIndex < 0}
//                 className={cn(
//                   "bg-green-600 hover:bg-green-700",
//                   animationPlaybackState === "playing" &&
//                     "bg-yellow-500 hover:bg-yellow-600"
//                 )}
//               >
//                 {animationPlaybackState === "playing" ? (
//                   <Pause size={16} />
//                 ) : (
//                   <Play size={16} />
//                 )}
//               </Button>
//               <Button
//                 onClick={handleStopAnimation}
//                 disabled={
//                   selectedAnimationClipIndex < 0 ||
//                   animationPlaybackState === "stopped"
//                 }
//                 className='bg-red-600 hover:bg-red-700'
//               >
//                 <StopCircle size={16} />
//               </Button>
//               <Button
//                 variant={isAnimationLooping ? "secondary" : "outline"}
//                 onClick={() => handleAnimationLoopToggle(!isAnimationLooping)}
//                 disabled={selectedAnimationClipIndex < 0}
//                 className={cn(
//                   isAnimationLooping
//                     ? "bg-purple-500 hover:bg-purple-600 text-white"
//                     : "border-slate-600 text-slate-300 hover:bg-slate-700/50"
//                 )}
//               >
//                 <Repeat size={16} />
//               </Button>
//             </div>
//             <div className='space-y-1.5'>
//               <Label htmlFor='animTimePanel' className='text-sm text-slate-300'>
//                 Time: {(animationTime * animationDuration).toFixed(2)}s /{" "}
//                 {animationDuration.toFixed(2)}s
//               </Label>
//               <Slider
//                 id='animTimePanel'
//                 min={0}
//                 max={1}
//                 step={0.001}
//                 value={[animationTime]}
//                 onValueChange={(val) => handleAnimationTimeChange(val)}
//                 disabled={
//                   selectedAnimationClipIndex < 0 || animationDuration === 0
//                 }
//                 className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//               />
//             </div>
//             <div className='space-y-1.5'>
//               <Label
//                 htmlFor='animSpeedPanelSlider' // Changed ID to avoid conflict
//                 className='text-sm text-slate-300'
//               >
//                 Speed: {animationPlaybackSpeed.toFixed(1)}x
//               </Label>
//               <Slider
//                 id='animSpeedPanelSlider' // Changed ID to avoid conflict
//                 min={0.1}
//                 max={3}
//                 step={0.1}
//                 value={[animationPlaybackSpeed]}
//                 onValueChange={(val) => handleAnimationSpeedChange(val)}
//                 disabled={selectedAnimationClipIndex < 0}
//                 className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
//               />
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );

//   return (
//     <>
//       <SonnerToaster richColors position='top-right' />
//       <div className='min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 p-3 sm:p-4 md:p-6 text-slate-100 select-none'>
//         <input
//           type='file'
//           accept='.glb,.gltf,.stl,.obj,.mtl,.fbx,.3ds'
//           multiple
//           ref={fileInputRef}
//           onChange={(e) => handleFiles(Array.from(e.target.files))}
//           style={{ display: "none" }}
//         />
//         <div className='max-w-screen-2xl mx-auto'>
//           <header className='text-center mb-8 sm:mb-10'>
//             <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-3 sm:mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent'>
//               3D Shape Studio Pro
//             </h1>
//             <p className='text-slate-400 text-base sm:text-lg max-w-3xl mx-auto'>
//               Craft, view, and animate 3D masterpieces. Import GLB, GLTF, STL,
//               OBJ, FBX or 3DS models. Drag & drop supported.
//             </p>
//           </header>
//           <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6'>
//             <div className='lg:col-span-3 space-y-4 sm:space-y-5 order-last lg:order-first'>
//               {!isImportedModelDisplayed && (
//                 <>
//                   <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
//                     <CardHeader>
//                       <CardTitle className='text-slate-100'>
//                         Categories
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className='grid grid-cols-2 gap-3'>
//                         {categories.map((category) => (
//                           <Button
//                             key={category.id}
//                             variant={
//                               currentCategory === category.id
//                                 ? "default"
//                                 : "outline"
//                             }
//                             className={cn(
//                               "h-auto py-3 flex flex-col items-center justify-center gap-1.5 text-xs sm:text-sm transition-all",
//                               currentCategory === category.id
//                                 ? "bg-purple-600 hover:bg-purple-700 text-white ring-2 ring-purple-400"
//                                 : "text-slate-300 border-slate-600 hover:bg-slate-700/50"
//                             )}
//                             onClick={() => handleCategorySelect(category.id)}
//                           >
//                             <span className='text-2xl sm:text-3xl'>
//                               {category.icon}
//                             </span>{" "}
//                             <span>{category.name}</span>
//                           </Button>
//                         ))}
//                       </div>
//                     </CardContent>
//                   </Card>
//                   <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
//                     <CardHeader>
//                       <CardTitle className='text-slate-100'>Shapes</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className='grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50'>
//                         {shapesByCategory[currentCategory].map((shape) => (
//                           <Button
//                             key={shape.id}
//                             variant={
//                               currentShape === shape.id ? "secondary" : "ghost"
//                             }
//                             className={cn(
//                               "justify-start gap-2",
//                               currentShape === shape.id
//                                 ? "bg-purple-500 text-white hover:bg-purple-600"
//                                 : "text-slate-300 hover:bg-slate-700/50"
//                             )}
//                             onClick={() => handleShapeSelect(shape.id)}
//                           >
//                             <span className='text-xl'>{shape.icon}</span>{" "}
//                             {shape.name}
//                           </Button>
//                         ))}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </>
//               )}
//               {isImportedModelDisplayed && importedModel && (
//                 <Card className='bg-slate-800/70 border-slate-700 shadow-xl text-center'>
//                   <CardHeader>
//                     <CardTitle className='text-slate-100'>
//                       Current Model
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <p
//                       className='text-sm text-slate-300 truncate font-medium'
//                       title={importedModelName}
//                     >
//                       {importedModelName}
//                     </p>
//                   </CardContent>
//                   <CardFooter>
//                     <Button
//                       variant='destructive'
//                       size='sm'
//                       className='w-full'
//                       onClick={() => {
//                         setImportedModel(null);
//                         setIsImportedModelDisplayed(false);
//                         setImportedModelName("Imported Model");
//                         const defaultCategoryId = categories[0].id;
//                         setCurrentCategory(defaultCategoryId);
//                         setCurrentShape(
//                           shapesByCategory[defaultCategoryId][0].id
//                         );
//                         handleResetAnimation();
//                         sonnerToast.info("Imported Model Cleared", {
//                           description: "Procedural shapes active.",
//                         });
//                         pushHistory("clear imported model");
//                       }}
//                     >
//                       <XCircle size={16} className='mr-2' /> Clear Imported
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               )}

//               <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
//                 <CardHeader>
//                   <CardTitle className='text-slate-100'>
//                     Global Animation & View
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className='space-y-4'>
//                   <Button
//                     onClick={handleToggleGlobalAnimation}
//                     variant={isAnimating ? "destructive" : "default"}
//                     className='w-full bg-green-600 hover:bg-green-700 data-[state=destructive]:bg-red-600 data-[state=destructive]:hover:bg-red-700'
//                     data-state={isAnimating ? "destructive" : "default"}
//                   >
//                     {isAnimating ? (
//                       <Pause size={16} className='mr-2' />
//                     ) : (
//                       <Play size={16} className='mr-2' />
//                     )}
//                     {isAnimating ? "Pause Float" : "Play Float"}
//                   </Button>
//                   <Select
//                     value={animationPreset}
//                     onValueChange={(val) => {
//                       setAnimationPreset(val);
//                     }}
//                   >
//                     <SelectTrigger className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'>
//                       <SelectValue placeholder='Select float style' />
//                     </SelectTrigger>
//                     <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
//                       {Object.keys(animationPresets).map((presetKey) => (
//                         <SelectItem
//                           key={presetKey}
//                           value={presetKey}
//                           className='capitalize focus:bg-purple-600 focus:text-white'
//                         >
//                           {presetKey.charAt(0).toUpperCase() +
//                             presetKey.slice(1)}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <div className='grid grid-cols-2 gap-3'>
//                     <Button
//                       variant='outline'
//                       onClick={handleResetAnimation}
//                       className='border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
//                     >
//                       <RotateCcw size={14} className='mr-2' /> Reset View
//                     </Button>
//                     <Button
//                       variant='default'
//                       onClick={handleRandomize}
//                       className='bg-indigo-600 hover:bg-indigo-700'
//                     >
//                       <Shuffle size={14} className='mr-2' /> Randomize
//                     </Button>
//                   </div>
//                   <div className='grid grid-cols-2 gap-3 pt-2'>
//                     <Button
//                       variant='outline'
//                       onClick={handleUndo}
//                       disabled={!canUndo}
//                       className='border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 disabled:opacity-50'
//                     >
//                       <Undo size={14} className='mr-2' /> Undo
//                     </Button>
//                     <Button
//                       variant='outline'
//                       onClick={handleRedo}
//                       disabled={!canRedo}
//                       className='border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 disabled:opacity-50'
//                     >
//                       <Redo size={14} className='mr-2' /> Redo
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
//                 <CardHeader>
//                   <CardTitle className='text-slate-100'>
//                     File & Export
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className='space-y-3'>
//                   <Button
//                     onClick={triggerImport}
//                     disabled={isExporting}
//                     className='w-full bg-green-600 hover:bg-green-700'
//                   >
//                     <UploadCloud size={16} className='mr-2' /> Import Model
//                   </Button>
//                   <Button
//                     onClick={handleExportGLB}
//                     disabled={isExporting}
//                     className='w-full bg-blue-600 hover:bg-blue-700'
//                   >
//                     <Download size={16} className='mr-2' />
//                     {isExporting && exportProgress > 0 && exportProgress <= 100
//                       ? `GLB... ${Math.round(exportProgress)}%`
//                       : "Export GLB"}
//                   </Button>
//                   <Button
//                     onClick={handleSimulatedExportOBJ}
//                     disabled={isExporting}
//                     className='w-full bg-teal-600 hover:bg-teal-700'
//                   >
//                     <Download size={16} className='mr-2' />
//                     {isExporting && exportProgress > 0 && exportProgress <= 100
//                       ? `OBJ... ${Math.round(exportProgress)}%`
//                       : "Export OBJ (Sim.)"}
//                   </Button>
//                   <Button
//                     onClick={handleTakeScreenshot}
//                     disabled={isExporting}
//                     className='w-full bg-purple-600 hover:bg-purple-700'
//                   >
//                     <Camera size={16} className='mr-2' /> Screenshot
//                   </Button>
//                 </CardContent>
//               </Card>
//             </div>

//             <div className='lg:col-span-9 order-first lg:order-last'>
//               <Card
//                 ref={viewerCardRef}
//                 className='bg-slate-800/50 border-slate-700/80 shadow-2xl aspect-[4/3] sm:aspect-video lg:aspect-[16/10] overflow-hidden relative'
//               >
//                 <div className='absolute top-2 right-2 sm:top-3 sm:right-3 z-20 flex items-center space-x-2'>
//                   <Button
//                     variant='ghost'
//                     size='icon'
//                     className='bg-slate-800/60 hover:bg-slate-700/90 text-slate-300 hover:text-purple-300 rounded-full p-2 shadow-md'
//                     title={
//                       isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"
//                     }
//                     onClick={toggleFullscreen}
//                   >
//                     {isFullscreen ? (
//                       <Minimize size={20} />
//                     ) : (
//                       <Maximize size={20} />
//                     )}
//                   </Button>
//                   <Sheet
//                     open={isSettingsPanelOpen}
//                     onOpenChange={setIsSettingsPanelOpen}
//                   >
//                     <SheetTrigger asChild>
//                       <Button
//                         variant='ghost'
//                         size='icon'
//                         className='bg-slate-800/60 hover:bg-slate-700/90 text-slate-300 hover:text-purple-300 rounded-full p-2 shadow-md'
//                         title='Open Detailed Settings'
//                       >
//                         <Settings2 size={20} />
//                       </Button>
//                     </SheetTrigger>
//                     <SheetContent
//                       side='right'
//                       className='bg-slate-800/95 border-l border-slate-700 text-slate-100 p-0 w-full sm:max-w-sm md:max-w-md backdrop-blur-sm'
//                     >
//                       <SheetHeader className='p-4 border-b border-slate-700'>
//                         <SheetTitle className='text-xl text-slate-100'>
//                           Viewer & Model Settings
//                         </SheetTitle>
//                         <SheetDescription className='text-slate-400 text-xs'>
//                           Fine-tune the appearance, lighting, and animation
//                           playback.
//                         </SheetDescription>
//                       </SheetHeader>
//                       {renderSettingsContent()}
//                       <SheetFooter className='p-4 border-t border-slate-700 bg-slate-800/95'>
//                         <SheetClose asChild>
//                           <Button
//                             type='button'
//                             variant='outline'
//                             className='w-full border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
//                           >
//                             Close Panel
//                           </Button>
//                         </SheetClose>
//                       </SheetFooter>
//                     </SheetContent>
//                   </Sheet>
//                 </div>

//                 <CardContent className='p-0 w-full h-full relative'>
//                   <div
//                     className='relative w-full h-full'
//                     onDragOver={(e) => {
//                       e.preventDefault();
//                       e.stopPropagation();
//                     }}
//                     onDrop={handleFileDropOnViewer}
//                   >
//                     <div
//                       ref={mountRef}
//                       className='w-full h-full rounded-lg overflow-hidden'
//                     />
//                     {isExporting && (
//                       <div className='absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-lg z-10 backdrop-blur-sm'>
//                         <Card className='bg-slate-100 text-slate-800 p-6 sm:p-8 shadow-2xl text-center w-72'>
//                           <CardHeader className='p-0 mb-4'>
//                             <CardTitle className='text-xl sm:text-2xl'>
//                               Exporting Model
//                             </CardTitle>
//                           </CardHeader>
//                           <CardContent className='p-0 space-y-3'>
//                             <div className='text-lg font-semibold'>
//                               {Math.round(exportProgress)}%
//                             </div>
//                             <Progress
//                               value={exportProgress}
//                               className='w-full h-2.5'
//                             />
//                             <p className='text-xs text-slate-500'>
//                               Please wait, this may take a moment...
//                             </p>
//                           </CardContent>
//                         </Card>
//                       </div>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//           <footer className='text-center mt-10 sm:mt-16 py-6 border-t border-slate-700/50'>
//             <p className='text-slate-400 text-sm'>
//               © {new Date().getFullYear()} 3D Shape Studio Pro. All rights
//               reserved.
//             </p>
//             <p className='text-xs text-slate-500 mt-1'>
//               An interactive 3D modeling and visualization tool.
//             </p>
//           </footer>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ModelViewer3D;

// image insertion test above code is full funtional
import React, { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { TDSLoader } from "three/examples/jsm/loaders/TDSLoader.js";

import {
  Download,
  Play,
  Pause,
  RotateCcw,
  Camera,
  Shuffle,
  UploadCloud,
  XCircle,
  Loader2,
  Undo,
  Redo,
  StopCircle,
  Repeat,
  Settings2,
  Maximize,
  Minimize,
  ImageUp,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const saneNumber = (value, defaultValue = 0) => {
  const num = Number(value);
  return isNaN(num) || !isFinite(num) ? defaultValue : num;
};

// --- Shape Creation Functions ---
const createCatShape = (size = 1) => {
  const s = saneNumber(size, 1);
  const shape = new THREE.Shape();
  shape.moveTo(saneNumber(0), saneNumber(s * 0.8));
  shape.bezierCurveTo(
    saneNumber(-s * 0.6),
    saneNumber(s * 0.8),
    saneNumber(-s * 0.8),
    saneNumber(s * 0.4),
    saneNumber(-s * 0.8),
    saneNumber(0)
  );
  shape.bezierCurveTo(
    saneNumber(-s * 0.8),
    saneNumber(-s * 0.6),
    saneNumber(-s * 0.4),
    saneNumber(-s * 0.8),
    saneNumber(0),
    saneNumber(-s * 0.8)
  );
  shape.bezierCurveTo(
    saneNumber(s * 0.4),
    saneNumber(-s * 0.8),
    saneNumber(s * 0.8),
    saneNumber(-s * 0.6),
    saneNumber(s * 0.8),
    saneNumber(0)
  );
  shape.bezierCurveTo(
    saneNumber(s * 0.8),
    saneNumber(s * 0.4),
    saneNumber(s * 0.6),
    saneNumber(s * 0.8),
    saneNumber(0),
    saneNumber(s * 0.8)
  );
  const ear1 = new THREE.Path();
  ear1.moveTo(saneNumber(-s * 0.4), saneNumber(s * 0.6));
  ear1.lineTo(saneNumber(-s * 0.7), saneNumber(s * 1.2));
  ear1.lineTo(saneNumber(-s * 0.1), saneNumber(s * 0.9));
  ear1.closePath();
  const ear2 = new THREE.Path();
  ear2.moveTo(saneNumber(s * 0.4), saneNumber(s * 0.6));
  ear2.lineTo(saneNumber(s * 0.7), saneNumber(s * 1.2));
  ear2.lineTo(saneNumber(s * 0.1), saneNumber(s * 0.9));
  ear2.closePath();
  shape.holes.push(ear1);
  shape.holes.push(ear2);
  return shape;
};
const createBirdShape = (size = 1) => {
  const s = saneNumber(size, 1);
  const shape = new THREE.Shape();
  shape.moveTo(saneNumber(0), saneNumber(s * 0.6));
  shape.bezierCurveTo(
    saneNumber(-s * 0.8),
    saneNumber(s * 0.4),
    saneNumber(-s * 0.9),
    saneNumber(-s * 0.2),
    saneNumber(-s * 0.6),
    saneNumber(-s * 0.6)
  );
  shape.bezierCurveTo(
    saneNumber(-s * 0.3),
    saneNumber(-s * 0.8),
    saneNumber(s * 0.3),
    saneNumber(-s * 0.8),
    saneNumber(s * 0.6),
    saneNumber(-s * 0.6)
  );
  shape.bezierCurveTo(
    saneNumber(s * 0.9),
    saneNumber(-s * 0.2),
    saneNumber(s * 0.8),
    saneNumber(s * 0.4),
    saneNumber(0),
    saneNumber(s * 0.6)
  );
  const wing = new THREE.Path();
  wing.moveTo(saneNumber(-s * 0.3), saneNumber(s * 0.2));
  wing.bezierCurveTo(
    saneNumber(-s * 0.7),
    saneNumber(s * 0.3),
    saneNumber(-s * 0.8),
    saneNumber(0),
    saneNumber(-s * 0.5),
    saneNumber(-s * 0.3)
  );
  wing.bezierCurveTo(
    saneNumber(-s * 0.2),
    saneNumber(-s * 0.1),
    saneNumber(-s * 0.1),
    saneNumber(s * 0.1),
    saneNumber(-s * 0.3),
    saneNumber(s * 0.2)
  );
  shape.holes.push(wing);
  return shape;
};
const createFishShape = (size = 1) => {
  const s = saneNumber(size, 1);
  const shape = new THREE.Shape();
  shape.moveTo(saneNumber(-s * 0.8), saneNumber(0));
  shape.bezierCurveTo(
    saneNumber(-s * 0.6),
    saneNumber(s * 0.4),
    saneNumber(-s * 0.2),
    saneNumber(s * 0.5),
    saneNumber(s * 0.2),
    saneNumber(s * 0.3)
  );
  shape.bezierCurveTo(
    saneNumber(s * 0.6),
    saneNumber(s * 0.2),
    saneNumber(s * 0.8),
    saneNumber(0),
    saneNumber(s * 0.8),
    saneNumber(0)
  );
  shape.bezierCurveTo(
    saneNumber(s * 0.6),
    saneNumber(-s * 0.2),
    saneNumber(s * 0.2),
    saneNumber(-s * 0.3),
    saneNumber(-s * 0.2),
    saneNumber(-s * 0.5)
  );
  shape.bezierCurveTo(
    saneNumber(-s * 0.6),
    saneNumber(-s * 0.4),
    saneNumber(-s * 0.8),
    saneNumber(0),
    saneNumber(-s * 0.8),
    saneNumber(0)
  );
  shape.moveTo(saneNumber(s * 0.8), saneNumber(0));
  shape.lineTo(saneNumber(s * 1.2), saneNumber(s * 0.3));
  shape.lineTo(saneNumber(s * 1.0), saneNumber(0));
  shape.lineTo(saneNumber(s * 1.2), saneNumber(-s * 0.3));
  shape.lineTo(saneNumber(s * 0.8), saneNumber(0));
  return shape;
};
const createSoccerBallShape = (size = 1) => {
  const s = saneNumber(size, 1);
  const shape = new THREE.Shape();
  const r = s * 0.8;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const x = saneNumber(Math.cos(a) * r);
    const y = saneNumber(Math.sin(a) * r);
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  const ih = new THREE.Path();
  const ir = s * 0.4;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const x = saneNumber(Math.cos(a) * ir);
    const y = saneNumber(Math.sin(a) * ir);
    if (i === 0) ih.moveTo(x, y);
    else ih.lineTo(x, y);
  }
  ih.closePath();
  shape.holes.push(ih);
  return shape;
};
const createTennisRacketShape = (size = 1) => {
  const s = saneNumber(size, 1);
  const shape = new THREE.Shape();
  const a = s * 0.6;
  const b = s * 0.4;
  for (let i = 0; i <= 32; i++) {
    const ang = (i / 32) * Math.PI * 2;
    const x = saneNumber(Math.cos(ang) * a);
    const y = saneNumber(Math.sin(ang) * b + s * 0.3);
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.lineTo(saneNumber(s * 0.1), saneNumber(-s * 0.8));
  shape.lineTo(saneNumber(-s * 0.1), saneNumber(-s * 0.8));
  shape.closePath();
  return shape;
};
const createBasketballShape = (size = 1) => {
  const s = saneNumber(size, 1);
  const shape = new THREE.Shape();
  const r = s * 0.8;
  for (let i = 0; i <= 32; i++) {
    const a = (i / 32) * Math.PI * 2;
    const x = saneNumber(Math.cos(a) * r);
    const y = saneNumber(Math.sin(a) * r);
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
};
const createPersonShape = (size = 1) => {
  const s = saneNumber(size, 1);
  const shape = new THREE.Shape();
  const hr = s * 0.2;
  for (let i = 0; i <= 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const x = saneNumber(Math.cos(a) * hr);
    const y = saneNumber(Math.sin(a) * hr + s * 0.6);
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.lineTo(saneNumber(-s * 0.3), saneNumber(s * 0.2));
  shape.lineTo(saneNumber(-s * 0.4), saneNumber(-s * 0.4));
  shape.lineTo(saneNumber(-s * 0.2), saneNumber(-s * 0.8));
  shape.lineTo(saneNumber(s * 0.2), saneNumber(-s * 0.8));
  shape.lineTo(saneNumber(s * 0.4), saneNumber(-s * 0.4));
  shape.lineTo(saneNumber(s * 0.3), saneNumber(s * 0.2));
  shape.closePath();
  return shape;
};
const createRobotShape = (size = 1) => {
  const sval = saneNumber(size, 1);
  const shape = new THREE.Shape();
  shape.moveTo(saneNumber(-sval * 0.4), saneNumber(sval * 0.8));
  shape.lineTo(saneNumber(sval * 0.4), saneNumber(sval * 0.8));
  shape.lineTo(saneNumber(sval * 0.4), saneNumber(sval * 0.4));
  shape.lineTo(saneNumber(-sval * 0.4), saneNumber(sval * 0.4));
  shape.closePath();
  shape.moveTo(saneNumber(-sval * 0.5), saneNumber(sval * 0.4));
  shape.lineTo(saneNumber(sval * 0.5), saneNumber(sval * 0.4));
  shape.lineTo(saneNumber(sval * 0.5), saneNumber(-sval * 0.4));
  shape.lineTo(saneNumber(-sval * 0.5), saneNumber(-sval * 0.4));
  shape.closePath();
  shape.moveTo(saneNumber(-sval * 0.3), saneNumber(-sval * 0.4));
  shape.lineTo(saneNumber(-sval * 0.1), saneNumber(-sval * 0.4));
  shape.lineTo(saneNumber(-sval * 0.1), saneNumber(-sval * 0.8));
  shape.lineTo(saneNumber(-sval * 0.3), saneNumber(-sval * 0.8));
  shape.closePath();
  shape.moveTo(saneNumber(sval * 0.1), saneNumber(-sval * 0.4));
  shape.lineTo(saneNumber(sval * 0.3), saneNumber(-sval * 0.4));
  shape.lineTo(saneNumber(sval * 0.3), saneNumber(-sval * 0.8));
  shape.lineTo(saneNumber(sval * 0.1), saneNumber(-sval * 0.8));
  shape.closePath();
  return shape;
};
const createPhoneShape = (size = 1) => {
  const sval = saneNumber(size, 1);
  const shape = new THREE.Shape();
  const w = sval * 0.5;
  const h = sval * 1.0;
  const r = sval * 0.1;
  shape.moveTo(saneNumber(-w + r), saneNumber(h));
  shape.lineTo(saneNumber(w - r), saneNumber(h));
  shape.quadraticCurveTo(
    saneNumber(w),
    saneNumber(h),
    saneNumber(w),
    saneNumber(h - r)
  );
  shape.lineTo(saneNumber(w), saneNumber(-h + r));
  shape.quadraticCurveTo(
    saneNumber(w),
    saneNumber(-h),
    saneNumber(w - r),
    saneNumber(-h)
  );
  shape.lineTo(saneNumber(-w + r), saneNumber(-h));
  shape.quadraticCurveTo(
    saneNumber(-w),
    saneNumber(-h),
    saneNumber(-w),
    saneNumber(-h + r)
  );
  shape.lineTo(saneNumber(-w), saneNumber(h - r));
  shape.quadraticCurveTo(
    saneNumber(-w),
    saneNumber(h),
    saneNumber(-w + r),
    saneNumber(h)
  );
  shape.closePath();
  const screen = new THREE.Path();
  const sw = w * 0.8;
  const sh = h * 0.8;
  const sr = r * 0.5;
  screen.moveTo(saneNumber(-sw + sr), saneNumber(sh));
  screen.lineTo(saneNumber(sw - sr), saneNumber(sh));
  screen.quadraticCurveTo(
    saneNumber(sw),
    saneNumber(sh),
    saneNumber(sw),
    saneNumber(sh - sr)
  );
  screen.lineTo(saneNumber(sw), saneNumber(-sh + sr));
  screen.quadraticCurveTo(
    saneNumber(sw),
    saneNumber(-sh),
    saneNumber(sw - sr),
    saneNumber(-sh)
  );
  screen.lineTo(saneNumber(-sw + sr), saneNumber(-sh));
  screen.quadraticCurveTo(
    saneNumber(-sw),
    saneNumber(-sh),
    saneNumber(-sw),
    saneNumber(-sh + sr)
  );
  screen.lineTo(saneNumber(-sw), saneNumber(sh - sr));
  screen.quadraticCurveTo(
    saneNumber(-sw),
    saneNumber(sh),
    saneNumber(-sw + sr),
    saneNumber(sh)
  );
  screen.closePath();
  shape.holes.push(screen);
  return shape;
};
const createLightningShape = (size = 1) => {
  const sval = saneNumber(size, 1);
  const shape = new THREE.Shape();
  shape.moveTo(saneNumber(-sval * 0.2), saneNumber(sval * 0.8));
  shape.lineTo(saneNumber(sval * 0.3), saneNumber(sval * 0.2));
  shape.lineTo(saneNumber(sval * 0.1), saneNumber(sval * 0.2));
  shape.lineTo(saneNumber(sval * 0.4), saneNumber(-sval * 0.8));
  shape.lineTo(saneNumber(-sval * 0.1), saneNumber(-sval * 0.2));
  shape.lineTo(saneNumber(sval * 0.1), saneNumber(-sval * 0.2));
  shape.lineTo(saneNumber(-sval * 0.4), saneNumber(sval * 0.8));
  shape.closePath();
  return shape;
};
const createMusicNoteShape = (size = 1) => {
  const sval = saneNumber(size, 1);
  const shape = new THREE.Shape();
  const nr = sval * 0.15;
  for (let i = 0; i <= 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const x = saneNumber(Math.cos(a) * nr - sval * 0.2);
    const y = saneNumber(Math.sin(a) * nr - sval * 0.4);
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.lineTo(saneNumber(-sval * 0.05), saneNumber(sval * 0.6));
  shape.lineTo(saneNumber(sval * 0.05), saneNumber(sval * 0.6));
  shape.lineTo(saneNumber(sval * 0.05), saneNumber(-sval * 0.25));
  shape.closePath();
  shape.moveTo(saneNumber(sval * 0.05), saneNumber(sval * 0.6));
  shape.bezierCurveTo(
    saneNumber(sval * 0.4),
    saneNumber(sval * 0.5),
    saneNumber(sval * 0.3),
    saneNumber(sval * 0.2),
    saneNumber(sval * 0.05),
    saneNumber(sval * 0.3)
  );
  shape.closePath();
  return shape;
};

// --- Material and Shape Data ---
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
const baseMaterialPresets = {
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
    emissiveIntensity: 1.0,
    envMapIntensity: 0.2,
    useEmissive: true,
  },
};

const textureLoader = new THREE.TextureLoader();

const createAdvancedMaterial = (
  baseColor,
  materialType = "standard",
  customProps = {}
) => {
  const color = new THREE.Color(baseColor);
  let preset = baseMaterialPresets[materialType] || baseMaterialPresets.ceramic;
  const finalProps = { ...preset };

  if (customProps.roughness !== null && customProps.roughness !== undefined)
    finalProps.roughness = customProps.roughness;
  if (customProps.metalness !== null && customProps.metalness !== undefined)
    finalProps.metalness = customProps.metalness;
  if (customProps.ior !== null && customProps.ior !== undefined)
    finalProps.ior = customProps.ior;
  if (
    customProps.transmission !== null &&
    customProps.transmission !== undefined
  )
    finalProps.transmission = customProps.transmission;
  if (customProps.thickness !== null && customProps.thickness !== undefined)
    finalProps.thickness = customProps.thickness;
  if (
    customProps.emissiveIntensity !== null &&
    customProps.emissiveIntensity !== undefined
  )
    finalProps.emissiveIntensity = customProps.emissiveIntensity;

  if (finalProps.useEmissive) {
    finalProps.emissive = color.clone().multiplyScalar(0.8);
  }

  const sharedProps = { color, ...finalProps, side: THREE.DoubleSide };

  const textureMapTypes = [
    "map",
    "normalMap",
    "roughnessMap",
    "metalnessMap",
    "aoMap",
    "emissiveMap",
  ];
  textureMapTypes.forEach((mapType) => {
    const urlKey = `${mapType}Url`;
    if (customProps[urlKey]) {
      try {
        const texture = textureLoader.load(customProps[urlKey]);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        if (mapType === "map" || mapType === "emissiveMap") {
          texture.colorSpace = THREE.SRGBColorSpace;
        }
        sharedProps[mapType] = texture;
        if (mapType === "normalMap") {
          sharedProps.normalScale = new THREE.Vector2(1, 1);
        }
      } catch (error) {
        console.error(
          `Error loading texture for ${mapType} from URL ${customProps[urlKey]}:`,
          error
        );
        sonnerToast.error(`Texture Load Error`, {
          description: `Failed to load ${mapType}.`,
        });
      }
    }
  });

  if (materialType === "glass" || materialType === "crystal") {
    return new THREE.MeshPhysicalMaterial(sharedProps);
  }
  return new THREE.MeshStandardMaterial(sharedProps);
};

const create3DShape = (shapeId, currentSettings, size = 1) => {
  let shape;
  let materialTypeForPreset =
    currentSettings.materialType === "auto"
      ? "ceramic"
      : currentSettings.materialType;
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
  const shapeSize = saneNumber(size, 1.5);
  shape = config.creator(shapeSize);
  if (currentSettings.materialType === "auto") {
    materialTypeForPreset = config.autoMaterial;
  }
  const extrudeSettings = {
    depth: saneNumber(currentSettings.extrudeDepth, 0.4),
    bevelEnabled: true,
    bevelSegments:
      currentSettings.quality === "high"
        ? 10
        : currentSettings.quality === "medium"
        ? 6
        : 3,
    steps:
      currentSettings.quality === "high"
        ? 5
        : currentSettings.quality === "medium"
        ? 3
        : 1,
    bevelSize: saneNumber(0.035 * (shapeSize / 1.5), 0.02),
    bevelThickness: saneNumber(0.025 * (shapeSize / 1.5), 0.015),
    curveSegments:
      currentSettings.quality === "high"
        ? 48
        : currentSettings.quality === "medium"
        ? 24
        : 12,
  };
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geometry.computeVertexNormals();
  try {
    geometry.center();
  } catch (e) {
    console.error(
      "Error centering geometry:",
      e,
      shapeId,
      currentSettings,
      shape
    );
    return new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );
  }
  const material = createAdvancedMaterial(
    currentSettings.shapeColor,
    materialTypeForPreset,
    currentSettings.customMaterialProperties
  );
  return new THREE.Mesh(geometry, material);
};

const CATEGORIES_DATA = [
  { id: "animals", name: "Animals", icon: "🐱" },
  { id: "sports", name: "Sports", icon: "⚽" },
  { id: "people", name: "People", icon: "👤" },
  { id: "objects", name: "Objects", icon: "📱" },
];
const SHAPES_BY_CATEGORY_DATA = {
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
const BACKGROUND_OPTIONS_DATA = {
  modernGradient: "Modern Gradient",
  darkSpace: "Dark Space",
  softLight: "Soft Light",
  studioDark: "Studio Dark",
  studioLight: "Studio Light",
  customImage: "Custom Image",
};

let gltfLoaderInstance;
const getGltfLoader = () => {
  if (!gltfLoaderInstance) {
    gltfLoaderInstance = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/gltf/");
    gltfLoaderInstance.setDRACOLoader(dracoLoader);
  }
  return gltfLoaderInstance;
};

const initialSettings = {
  materialType: "auto",
  shapeColor: "#a78bfa",
  animationSpeed: 1.0,
  extrudeDepth: 0.4,
  quality: "medium",
  background: "studioDark",
  keyLight: { enabled: true, intensity: 0.7, color: "#ffffff" },
  fillLight: { enabled: true, intensity: 0.4, color: "#a0c0ff" },
  ambientLight: { enabled: true, intensity: 0.25, color: "#ffffff" },
  customMaterialProperties: {
    roughness: null,
    metalness: null,
    ior: null,
    transmission: null,
    thickness: null,
    emissiveIntensity: null,
    mapUrl: null,
    normalMapUrl: null,
    roughnessMapUrl: null,
    metalnessMapUrl: null,
    aoMapUrl: null,
    emissiveMapUrl: null,
  },
};

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
  const lightsRef = useRef({ key: null, fill: null, ambient: null });
  const skyboxMeshRef = useRef(null);
  const envMapTextureRef = useRef(null);
  const fileInputRef = useRef(null);
  const textureFileInputRefs = useRef({});

  const viewerCardRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [importedModel, setImportedModel] = useState(null);
  const [isImportedModelDisplayed, setIsImportedModelDisplayed] =
    useState(false);
  const [importedModelName, setImportedModelName] = useState("Imported Model");

  const [currentCategory, setCurrentCategory] = useState(CATEGORIES_DATA[0].id);
  const [currentShape, setCurrentShape] = useState(
    SHAPES_BY_CATEGORY_DATA[CATEGORIES_DATA[0].id][0].id
  );

  const categories = CATEGORIES_DATA;
  const shapesByCategory = SHAPES_BY_CATEGORY_DATA;
  const backgroundOptions = BACKGROUND_OPTIONS_DATA;

  const [isAnimating, setIsAnimating] = useState(true);
  const [animationPreset, setAnimationPreset] = useState("gentle");

  const [settings, setSettings] = useState(
    JSON.parse(JSON.stringify(initialSettings))
  );
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const [customBgImageUrl, setCustomBgImageUrl] = useState(null);
  const backgroundTextureRef = useRef(null);
  const textureObjectsRef = useRef({});

  const currentSettingsRef = useRef(settings);
  useEffect(() => {
    currentSettingsRef.current = settings;
  }, [settings]);
  const isAnimatingRef = useRef(isAnimating);
  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);
  const animationPresetRef = useRef(animationPreset);
  useEffect(() => {
    animationPresetRef.current = animationPreset;
  }, [animationPreset]);
  const animationState = useRef({
    rotation: new THREE.Euler(),
    targetRotation: new THREE.Euler(),
    floatY: 0,
    startTime: Date.now(),
  });

  const mixerRef = useRef(null);
  const animationClipsRef = useRef([]);
  const activeActionRef = useRef(null);
  const [selectedAnimationClipIndex, setSelectedAnimationClipIndex] =
    useState(-1);
  const [animationPlaybackState, setAnimationPlaybackState] =
    useState("stopped");
  const [animationTime, setAnimationTime] = useState(0);
  const [animationDuration, setAnimationDuration] = useState(0);
  const [isAnimationLooping, setIsAnimationLooping] = useState(true);
  const [animationPlaybackSpeed, setAnimationPlaybackSpeed] = useState(1.0);

  const historyStackRef = useRef([]);
  const historyPointerRef = useRef(-1);
  const isUndoingRedoingRef = useRef(false);
  const MAX_HISTORY = 50;

  const captureAppState = useCallback(() => {
    return JSON.parse(
      JSON.stringify({
        settings: currentSettingsRef.current,
        currentCategory,
        currentShape,
        animationPreset: animationPresetRef.current,
        isAnimating: isAnimatingRef.current,
        importedModelName,
        isImportedModelDisplayed,
        selectedAnimationClipIndex,
        animationPlaybackState,
        animationTime,
        isAnimationLooping,
        animationPlaybackSpeed,
        customBgImageUrl,
      })
    );
  }, [
    currentCategory,
    currentShape,
    importedModelName,
    isImportedModelDisplayed,
    selectedAnimationClipIndex,
    animationPlaybackState,
    animationTime,
    isAnimationLooping,
    animationPlaybackSpeed,
    customBgImageUrl,
  ]);

  const applyState = useCallback((stateToApply) => {
    isUndoingRedoingRef.current = true;
    setSettings(stateToApply.settings);
    setCurrentCategory(stateToApply.currentCategory);
    setCurrentShape(stateToApply.currentShape);
    setAnimationPreset(stateToApply.animationPreset);
    setIsAnimating(stateToApply.isAnimating);
    setImportedModelName(stateToApply.importedModelName);
    setIsImportedModelDisplayed(stateToApply.isImportedModelDisplayed);
    setSelectedAnimationClipIndex(stateToApply.selectedAnimationClipIndex);
    setAnimationPlaybackState(stateToApply.animationPlaybackState);
    setAnimationTime(stateToApply.animationTime);
    setIsAnimationLooping(stateToApply.isAnimationLooping);
    setAnimationPlaybackSpeed(stateToApply.animationPlaybackSpeed);
    setCustomBgImageUrl(stateToApply.customBgImageUrl);

    if (activeActionRef.current) {
      if (stateToApply.animationPlaybackState === "playing") {
        activeActionRef.current.paused = false;
        if (!activeActionRef.current.isRunning())
          activeActionRef.current.play();
        activeActionRef.current.time =
          stateToApply.animationTime *
          activeActionRef.current.getClip().duration;
      } else if (stateToApply.animationPlaybackState === "paused") {
        activeActionRef.current.paused = true;
        activeActionRef.current.time =
          stateToApply.animationTime *
          activeActionRef.current.getClip().duration;
      } else {
        activeActionRef.current.stop();
      }
    }
    Object.values(textureObjectsRef.current).forEach((texture) => {
      if (texture && texture.dispose) texture.dispose();
    });
    textureObjectsRef.current = {};

    requestAnimationFrame(() => {
      isUndoingRedoingRef.current = false;
    });
  }, []);

  const pushHistory = useCallback(
    (actionName = "action") => {
      if (isUndoingRedoingRef.current) return;
      const currentState = captureAppState();
      const previousState = historyStackRef.current[historyPointerRef.current];
      if (
        previousState &&
        JSON.stringify(currentState) === JSON.stringify(previousState)
      ) {
        return;
      }
      const stack = historyStackRef.current.slice(
        0,
        historyPointerRef.current + 1
      );
      stack.push(currentState);
      if (stack.length > MAX_HISTORY) {
        stack.shift();
      }
      historyStackRef.current = stack;
      historyPointerRef.current = stack.length - 1;
    },
    [captureAppState]
  );

  const handleUndo = useCallback(() => {
    if (historyPointerRef.current > 0) {
      historyPointerRef.current--;
      applyState(historyStackRef.current[historyPointerRef.current]);
      sonnerToast.info("Undo", { description: "Reverted to previous state." });
    } else {
      sonnerToast.warning("Undo", { description: "Nothing more to undo." });
    }
  }, [applyState]);

  const handleRedo = useCallback(() => {
    if (historyPointerRef.current < historyStackRef.current.length - 1) {
      historyPointerRef.current++;
      applyState(historyStackRef.current[historyPointerRef.current]);
      sonnerToast.info("Redo", { description: "Reverted to next state." });
    } else {
      sonnerToast.warning("Redo", { description: "Nothing more to redo." });
    }
  }, [applyState]);

  useEffect(() => {
    if (isMounted) {
      pushHistory("initial load");
    }
  }, [isMounted, pushHistory]);

  const debouncedPushHistoryRef = useRef(null);
  useEffect(() => {
    if (debouncedPushHistoryRef.current) {
      clearTimeout(debouncedPushHistoryRef.current);
    }
    debouncedPushHistoryRef.current = setTimeout(() => {
      if (isMounted && !isUndoingRedoingRef.current)
        pushHistory("settings changed");
    }, 500);
    return () => {
      if (debouncedPushHistoryRef.current) {
        clearTimeout(debouncedPushHistoryRef.current);
      }
    };
  }, [settings, customBgImageUrl, pushHistory, isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!viewerCardRef.current) return;
    if (!document.fullscreenElement) {
      try {
        await viewerCardRef.current.requestFullscreen();
      } catch (err) {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
        sonnerToast.error("Fullscreen Failed", {
          description: "Could not enter full-screen mode.",
        });
      }
    } else {
      if (document.exitFullscreen) {
        try {
          await document.exitFullscreen();
        } catch (err) {
          console.error(
            `Error attempting to exit full-screen mode: ${err.message} (${err.name})`
          );
          sonnerToast.error("Exit Fullscreen Failed", {
            description: "Could not exit full-screen mode.",
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      setTimeout(() => {
        if (mountRef.current && cameraRef.current && rendererRef.current) {
          const width = mountRef.current.clientWidth;
          const height = mountRef.current.clientHeight;
          cameraRef.current.aspect = width / height;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(width, height);
          if (composerRef.current) {
            composerRef.current.setSize(width, height);
            const sPass = composerRef.current.passes.find(
              (p) => p instanceof SSAOPass
            );
            if (sPass) sPass.setSize(width, height);
          }
        }
      }, 100);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
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
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
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
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 30;
    controls.maxPolarAngle = Math.PI / 1.6;
    controls.target.set(0, 0.2, 0);
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load(
      "/brown_photostudio_02_4k.hdr",
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        if (sceneRef.current) {
          sceneRef.current.environment = texture;
          envMapTextureRef.current = texture;
        }
      },
      undefined,
      (error) => {
        console.error("Error loading HDR:", error);
        sonnerToast.error("HDR Load Failed", {
          description: "Studio lighting map failed.",
        });
      }
    );
    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      initialSettings.ambientLight.intensity
    );
    scene.add(ambientLight);
    const keyLight = new THREE.DirectionalLight(
      0xffffff,
      initialSettings.keyLight.intensity
    );
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 50;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(
      0xa0c0ff,
      initialSettings.fillLight.intensity
    );
    fillLight.position.set(-5, 3, -3);
    scene.add(fillLight);
    lightsRef.current = {
      ambient: ambientLight,
      key: keyLight,
      fill: fillLight,
    };
    const composer = new EffectComposer(renderer);
    composerRef.current = composer;
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    const ssaoPassInstance = new SSAOPass(
      scene,
      camera,
      currentMount.clientWidth,
      currentMount.clientHeight
    );
    ssaoPassInstance.kernelRadius = 0.6;
    ssaoPassInstance.minDistance = 0.001;
    ssaoPassInstance.maxDistance = 0.03;
    composer.addPass(ssaoPassInstance);
    ssaoPassRef.current = ssaoPassInstance;
    const outputPass = new OutputPass();
    composer.addPass(outputPass);
    const handleResize = () => {
      if (!currentMount || !cameraRef.current || !rendererRef.current) return;
      const width = currentMount.clientWidth;
      const height = currentMount.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
      if (composerRef.current) {
        composerRef.current.setSize(width, height);
        const sPass = composerRef.current.passes.find(
          (p) => p instanceof SSAOPass
        );
        if (sPass) sPass.setSize(width, height);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    const clock = new THREE.Clock();
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      if (
        !sceneRef.current ||
        !rendererRef.current ||
        !cameraRef.current ||
        !isMounted
      ) {
        if (animationIdRef.current)
          cancelAnimationFrame(animationIdRef.current);
        return;
      }
      const delta = clock.getDelta();
      if (controlsRef.current) controlsRef.current.update();
      if (meshRef.current && isAnimatingRef.current) {
        const animSettings = currentSettingsRef.current;
        const presetKey = animationPresetRef.current;
        const preset = animationPresets[presetKey];
        if (preset) {
          const effDelta = delta * animSettings.animationSpeed;
          animationState.current.targetRotation.x +=
            preset.rotationSpeed[0] * 60 * effDelta;
          animationState.current.targetRotation.y +=
            preset.rotationSpeed[1] * 60 * effDelta;
          animationState.current.targetRotation.z +=
            preset.rotationSpeed[2] * 60 * effDelta;
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
            animSettings.animationSpeed;
          animationState.current.floatY =
            Math.sin(floatTime * (preset.floatSpeed || 0.0001) * 100) *
            (preset.floatAmplitude || 0);
          meshRef.current.position.y = animationState.current.floatY;
        }
      }
      if (mixerRef.current && animationPlaybackState === "playing") {
        mixerRef.current.update(delta * animationPlaybackSpeed);
        if (activeActionRef.current) {
          const clipDuration = activeActionRef.current.getClip().duration;
          const currentTime = activeActionRef.current.time;
          setAnimationTime(clipDuration > 0 ? currentTime / clipDuration : 0);
          if (!isAnimationLooping && currentTime >= clipDuration) {
            setAnimationPlaybackState("stopped");
            activeActionRef.current.stop();
            setAnimationTime(1);
          }
        }
      }
      if (composerRef.current) composerRef.current.render(delta);
      else if (rendererRef.current)
        rendererRef.current.render(sceneRef.current, cameraRef.current);
    };
    animate();
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      controlsRef.current?.dispose();
      envMapTextureRef.current?.dispose();
      if (skyboxMeshRef.current) {
        sceneRef.current?.remove(skyboxMeshRef.current);
        skyboxMeshRef.current.geometry?.dispose();
        skyboxMeshRef.current.material?.dispose();
      }
      if (backgroundTextureRef.current) {
        backgroundTextureRef.current.dispose();
        backgroundTextureRef.current = null;
      }
      Object.values(textureObjectsRef.current).forEach((texture) => {
        if (texture && texture.dispose) texture.dispose();
      });
      textureObjectsRef.current = {};
      if (meshRef.current) {
        sceneRef.current?.remove(meshRef.current);
        meshRef.current.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            const materials = Array.isArray(obj.material)
              ? obj.material
              : [obj.material];
            materials.forEach((mat) => {
              Object.keys(mat).forEach((key) => {
                if (
                  mat[key] instanceof THREE.Texture &&
                  mat[key] !== sceneRef.current?.environment
                ) {
                  mat[key].dispose();
                }
              });
              mat.dispose();
            });
          }
        });
      }
      mixerRef.current = null;
      activeActionRef.current = null;
      animationClipsRef.current = [];
      composerRef.current?.passes.forEach((pass) => pass.dispose?.());
      ssaoPassRef.current?.dispose?.();
      sceneRef.current?.traverse((obj) => {
        if (obj.isLight && obj.shadow && obj.shadow.map)
          obj.shadow.map.dispose();
        // Geometry and material disposal handled with meshRef
      });
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (mountRef.current && rendererRef.current.domElement) {
          try {
            mountRef.current.removeChild(rendererRef.current.domElement);
          } catch (e) {}
        }
      }
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      controlsRef.current = null;
      composerRef.current = null;
      ssaoPassRef.current = null;
      meshRef.current = null;
      envMapTextureRef.current = null;
      skyboxMeshRef.current = null;
      lightsRef.current = { ambient: null, key: null, fill: null };
    };
  }, [
    isMounted,
    animationPlaybackSpeed,
    animationPlaybackState,
    isAnimationLooping,
  ]);

  useEffect(() => {
    if (!isMounted || !lightsRef.current) return;
    const { keyLight, fillLight, ambientLight } = settings;
    if (lightsRef.current.key) {
      lightsRef.current.key.intensity = keyLight.enabled
        ? keyLight.intensity
        : 0;
      lightsRef.current.key.color.set(keyLight.color);
    }
    if (lightsRef.current.fill) {
      lightsRef.current.fill.intensity = fillLight.enabled
        ? fillLight.intensity
        : 0;
      lightsRef.current.fill.color.set(fillLight.color);
    }
    if (lightsRef.current.ambient) {
      lightsRef.current.ambient.intensity = ambientLight.enabled
        ? ambientLight.intensity
        : 0;
      lightsRef.current.ambient.color.set(ambientLight.color);
    }
  }, [settings.keyLight, settings.fillLight, settings.ambientLight, isMounted]);

  useEffect(() => {
    if (!isMounted || !sceneRef.current || !rendererRef.current) return;
    if (skyboxMeshRef.current) {
      sceneRef.current.remove(skyboxMeshRef.current);
      skyboxMeshRef.current.geometry?.dispose();
      skyboxMeshRef.current.material?.dispose();
      skyboxMeshRef.current = null;
    }
    if (backgroundTextureRef.current) {
      backgroundTextureRef.current.dispose();
      backgroundTextureRef.current = null;
    }
    sceneRef.current.background = null;
    sceneRef.current.fog = null;
    rendererRef.current.toneMappingExposure = 1.0;
    let topC,
      bottomC,
      fogC,
      fogNear = 8,
      fogFar = 30;

    if (settings.background === "customImage" && customBgImageUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(
        customBgImageUrl,
        (texture) => {
          if (!sceneRef.current || !rendererRef.current) return;
          texture.colorSpace = THREE.SRGBColorSpace;
          sceneRef.current.background = texture;
          backgroundTextureRef.current = texture;
          rendererRef.current.toneMappingExposure = 1.0;
        },
        undefined,
        (err) => {
          console.error("Error loading custom background image:", err);
          sonnerToast.error("Failed to load custom background.");
          if (sceneRef.current)
            sceneRef.current.background = new THREE.Color(0x18181b);
        }
      );
    } else {
      switch (settings.background) {
        case "modernGradient":
          topC = new THREE.Color(0x3a7ca5);
          bottomC = new THREE.Color(0x1e3b49);
          fogC = new THREE.Color(0x2c5d72);
          break;
        case "darkSpace":
          sceneRef.current.background = new THREE.Color(0x0a0a10);
          fogC = new THREE.Color(0x050508);
          fogNear = 10;
          fogFar = 35;
          break;
        case "softLight":
          sceneRef.current.background = new THREE.Color(0xe0e8f0);
          fogC = new THREE.Color(0xd0d8e0);
          fogNear = 7;
          fogFar = 28;
          if (rendererRef.current)
            rendererRef.current.toneMappingExposure = 0.9;
          break;
        case "studioDark":
          sceneRef.current.background = new THREE.Color(0x18181b);
          fogC = new THREE.Color(0x101012);
          fogNear = 12;
          fogFar = 40;
          break;
        case "studioLight":
          sceneRef.current.background = new THREE.Color(0xf4f4f5);
          fogC = new THREE.Color(0xe4e4e7);
          fogNear = 10;
          fogFar = 35;
          if (rendererRef.current)
            rendererRef.current.toneMappingExposure = 0.85;
          break;
        default:
          sceneRef.current.background = new THREE.Color(0x18181b);
          fogC = new THREE.Color(0x101012);
      }
      if (settings.background === "modernGradient" && topC && bottomC) {
        const gradGeom = new THREE.SphereGeometry(50, 32, 32);
        const gradMat = new THREE.ShaderMaterial({
          uniforms: {
            topColor: { value: topC },
            bottomColor: { value: bottomC },
            offset: { value: 33 },
            exponent: { value: 0.6 },
          },
          vertexShader: `varying vec3 vWorldPosition; void main() { vec4 worldPosition = modelMatrix * vec4(position, 1.0); vWorldPosition = worldPosition.xyz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
          fragmentShader: `uniform vec3 topColor; uniform vec3 bottomColor; uniform float offset; uniform float exponent; varying vec3 vWorldPosition; void main() { float h = normalize(vWorldPosition + offset).y; gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0); }`,
          side: THREE.BackSide,
        });
        skyboxMeshRef.current = new THREE.Mesh(gradGeom, gradMat);
        sceneRef.current.add(skyboxMeshRef.current);
      }
      if (fogC) sceneRef.current.fog = new THREE.Fog(fogC, fogNear, fogFar);
    }
  }, [settings.background, customBgImageUrl, isMounted]);

  const {
    extrudeDepth: currentExtrudeDepth,
    quality: currentQuality,
    shapeColor: currentShapeColor,
    materialType: currentMaterialType,
    customMaterialProperties: currentCustomMaterialProperties,
  } = settings;

  useEffect(() => {
    if (!isMounted || !sceneRef.current) return;
    if (meshRef.current && meshRef.current.material) {
      const materials = Array.isArray(meshRef.current.material)
        ? meshRef.current.material
        : [meshRef.current.material];
      materials.forEach((mat) => {
        Object.keys(mat).forEach((key) => {
          if (
            mat[key] instanceof THREE.Texture &&
            mat[key] !== sceneRef.current?.environment
          ) {
            mat[key].dispose();
          }
        });
        mat.dispose();
      });
    }
    // Clear specific texture objects that might be loaded by createAdvancedMaterial
    Object.values(textureObjectsRef.current).forEach((texture) => {
      if (texture && texture.dispose) texture.dispose();
    });
    textureObjectsRef.current = {};

    if (meshRef.current) {
      sceneRef.current.remove(meshRef.current);
      meshRef.current.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
      });
      meshRef.current = null;
    }
    if (mixerRef.current) {
      mixerRef.current.stopAllAction();
      mixerRef.current = null;
    }
    activeActionRef.current = null;
    animationClipsRef.current = [];
    let newMesh;

    if (isImportedModelDisplayed && importedModel && importedModel.scene) {
      newMesh = importedModel.scene.clone(true);
      const box = new THREE.Box3().setFromObject(newMesh);
      const sizeVec = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(
        saneNumber(sizeVec.x, 1),
        saneNumber(sizeVec.y, 1),
        saneNumber(sizeVec.z, 1)
      );
      const desiredDisplaySize = 3;
      const scaleFactor = maxDim > 0 ? desiredDisplaySize / maxDim : 1;
      newMesh.scale.set(
        saneNumber(scaleFactor, 1),
        saneNumber(scaleFactor, 1),
        saneNumber(scaleFactor, 1)
      );
      const scaledBox = new THREE.Box3().setFromObject(newMesh);
      const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
      if (
        !isNaN(scaledCenter.x) &&
        !isNaN(scaledCenter.y) &&
        !isNaN(scaledCenter.z)
      ) {
        newMesh.position.sub(scaledCenter);
      } else {
        console.warn("Imported model center NaN");
        sonnerToast.warning("Centering Issue");
        newMesh.position.set(0, 0, 0);
      }
      newMesh.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            const materials = Array.isArray(child.material)
              ? child.material
              : [child.material];
            materials.forEach((mat) => {
              mat.side = THREE.DoubleSide;
              const textureMapTypes = [
                "map",
                "normalMap",
                "roughnessMap",
                "metalnessMap",
                "aoMap",
                "emissiveMap",
              ];
              textureMapTypes.forEach((mapType) => {
                const urlKey = `${mapType}Url`;
                if (currentCustomMaterialProperties[urlKey]) {
                  const existingTexture = Object.values(
                    textureObjectsRef.current
                  ).find(
                    (t) =>
                      t &&
                      t.userData &&
                      t.userData.url === currentCustomMaterialProperties[urlKey]
                  );
                  if (existingTexture) {
                    mat[mapType] = existingTexture;
                  } else {
                    const texture = textureLoader.load(
                      currentCustomMaterialProperties[urlKey],
                      (loadedTexture) => {
                        loadedTexture.wrapS = THREE.RepeatWrapping;
                        loadedTexture.wrapT = THREE.RepeatWrapping;
                        loadedTexture.userData = {
                          url: currentCustomMaterialProperties[urlKey],
                        }; // Store URL for comparison
                        if (mapType === "map" || mapType === "emissiveMap") {
                          loadedTexture.colorSpace = THREE.SRGBColorSpace;
                        }
                        mat[mapType] = loadedTexture;
                        if (mapType === "normalMap")
                          mat.normalScale = new THREE.Vector2(1, 1);
                        mat.needsUpdate = true;
                        if (
                          textureObjectsRef.current[urlKey] &&
                          textureObjectsRef.current[urlKey].dispose
                        )
                          textureObjectsRef.current[urlKey].dispose();
                        textureObjectsRef.current[urlKey] = loadedTexture;
                      }
                    );
                  }
                } else {
                  if (mat[mapType] && mat[mapType].dispose)
                    mat[mapType].dispose();
                  mat[mapType] = null;
                  if (
                    textureObjectsRef.current[urlKey] &&
                    textureObjectsRef.current[urlKey].dispose
                  ) {
                    textureObjectsRef.current[urlKey].dispose();
                    delete textureObjectsRef.current[urlKey];
                  }
                }
              });
              mat.needsUpdate = true;
            });
          }
        }
      });
      if (importedModel.animations && importedModel.animations.length > 0) {
        mixerRef.current = new THREE.AnimationMixer(newMesh);
        animationClipsRef.current = importedModel.animations;
        if (
          selectedAnimationClipIndex >= 0 &&
          selectedAnimationClipIndex < animationClipsRef.current.length
        ) {
          const clip = animationClipsRef.current[selectedAnimationClipIndex];
          activeActionRef.current = mixerRef.current.clipAction(clip);
          setAnimationDuration(clip.duration);
          if (animationPlaybackState === "playing")
            activeActionRef.current.play();
          activeActionRef.current.setLoop(
            isAnimationLooping ? THREE.LoopRepeat : THREE.LoopOnce,
            Infinity
          );
          activeActionRef.current.timeScale = animationPlaybackSpeed;
          if (activeActionRef.current)
            activeActionRef.current.time = animationTime * clip.duration;
        } else {
          setSelectedAnimationClipIndex(-1);
          setAnimationPlaybackState("stopped");
        }
      } else {
        setSelectedAnimationClipIndex(-1);
        setAnimationPlaybackState("stopped");
      }
    } else {
      const proceduralSettings = {
        extrudeDepth: currentExtrudeDepth,
        quality: currentQuality,
        shapeColor: currentShapeColor,
        materialType: currentMaterialType,
        customMaterialProperties: currentCustomMaterialProperties,
      };
      newMesh = create3DShape(currentShape, proceduralSettings, 1.5);
      newMesh.castShadow = true;
      newMesh.receiveShadow = true;
      setSelectedAnimationClipIndex(-1);
      setAnimationPlaybackState("stopped");
    }
    newMesh.position.y = 0;
    animationState.current.floatY = 0;
    animationState.current.targetRotation.set(0, 0, 0);
    newMesh.rotation.set(0, 0, 0);
    sceneRef.current.add(newMesh);
    meshRef.current = newMesh;
  }, [
    currentShape,
    currentExtrudeDepth,
    currentQuality,
    currentShapeColor,
    currentMaterialType,
    currentCustomMaterialProperties,
    isMounted,
    importedModel,
    isImportedModelDisplayed,
    selectedAnimationClipIndex,
    animationPlaybackState,
    isAnimationLooping,
    animationPlaybackSpeed,
    animationTime,
  ]);

  const handleResetAnimation = useCallback(() => {
    animationState.current.targetRotation.set(0, 0, 0);
    animationState.current.floatY = 0;
    animationState.current.startTime = Date.now();
    if (meshRef.current) {
      meshRef.current.rotation.set(0, 0, 0);
      meshRef.current.position.y = 0;
    }
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.target.set(0, 0.2, 0);
    }
    sonnerToast.info("View Reset", {
      description: "Model position and rotation restored.",
    });
    pushHistory("reset animation");
  }, [pushHistory]);

  const handleToggleGlobalAnimation = useCallback(() => {
    setIsAnimating((prev) => {
      const newIsAnimating = !prev;
      if (newIsAnimating) {
        const preset = animationPresets[animationPresetRef.current];
        const floatAmplitude = preset?.floatAmplitude || 0.1;
        const floatSpeed = preset?.floatSpeed || 0.001;
        const timeDivisor = floatAmplitude * (floatSpeed * 100);
        const timeOffset =
          timeDivisor !== 0
            ? (animationState.current.floatY / timeDivisor) * 1000
            : 0;
        animationState.current.startTime =
          Date.now() - (isFinite(timeOffset) ? timeOffset : 0);
      } else {
        if (meshRef.current)
          animationState.current.targetRotation.copy(meshRef.current.rotation);
      }
      sonnerToast.info(
        `Floating Animation ${newIsAnimating ? "Resumed" : "Paused"}`
      );
      pushHistory(newIsAnimating ? "resume global anim" : "pause global anim");
      return newIsAnimating;
    });
  }, [pushHistory]);

  const handleCustomMaterialPropChange = (propName, value) => {
    setSettings((s) => ({
      ...s,
      customMaterialProperties: {
        ...s.customMaterialProperties,
        [propName]: saneNumber(
          value,
          baseMaterialPresets[s.materialType]?.[propName] ?? 0
        ),
      },
    }));
  };
  const resetCustomMaterialProperties = () => {
    const currentPresetKey = settings.materialType;
    if (
      currentPresetKey &&
      currentPresetKey !== "auto" &&
      baseMaterialPresets[currentPresetKey]
    ) {
      const presetDefaults = baseMaterialPresets[currentPresetKey];
      const textureUrlKeys = [
        "mapUrl",
        "normalMapUrl",
        "roughnessMapUrl",
        "metalnessMapUrl",
        "aoMapUrl",
        "emissiveMapUrl",
      ];
      const resetTextureUrls = {};
      textureUrlKeys.forEach((key) => (resetTextureUrls[key] = null));

      setSettings((s) => ({
        ...s,
        customMaterialProperties: {
          roughness: presetDefaults.roughness ?? null,
          metalness: presetDefaults.metalness ?? null,
          ior: presetDefaults.ior ?? null,
          transmission: presetDefaults.transmission ?? null,
          thickness: presetDefaults.thickness ?? null,
          emissiveIntensity: presetDefaults.emissiveIntensity ?? null,
          ...resetTextureUrls,
        },
      }));
      sonnerToast.info("Material Properties Reset", {
        description: `Values reset to ${currentPresetKey} defaults.`,
      });
      pushHistory("reset custom material props");
    }
  };

  const handleCategorySelect = useCallback(
    (categoryId) => {
      setIsImportedModelDisplayed(false);
      setCurrentCategory(categoryId);
      setCurrentShape(shapesByCategory[categoryId][0].id);
      handleResetAnimation();
      pushHistory("category select");
    },
    [shapesByCategory, handleResetAnimation, pushHistory]
  );

  const handleShapeSelect = useCallback(
    (shapeId) => {
      setIsImportedModelDisplayed(false);
      setCurrentShape(shapeId);
      handleResetAnimation();
      pushHistory("shape select");
    },
    [handleResetAnimation, pushHistory]
  );

  useEffect(() => {
    if (isMounted && !isUndoingRedoingRef.current) {
      handleResetAnimation();
      pushHistory("animation preset change");
    }
  }, [animationPreset, isMounted, handleResetAnimation, pushHistory]);

  const handleRandomize = useCallback(() => {
    setIsImportedModelDisplayed(false);
    setCustomBgImageUrl(null);
    const randCat = categories[Math.floor(Math.random() * categories.length)];
    const randShapeList = shapesByCategory[randCat.id];
    const randShape =
      randShapeList[Math.floor(Math.random() * randShapeList.length)];
    const randPresetKey =
      Object.keys(animationPresets)[
        Math.floor(Math.random() * Object.keys(animationPresets).length)
      ];
    const randColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`;
    const bgKeys = Object.keys(backgroundOptions).filter(
      (key) => key !== "customImage"
    );
    const randBgKey = bgKeys[Math.floor(Math.random() * bgKeys.length)];
    const matKeys = [
      "auto",
      "metallic",
      "glass",
      "crystal",
      "ceramic",
      "organic",
      "plastic",
      "neon",
    ];
    const randMat = matKeys[Math.floor(Math.random() * matKeys.length)];
    setCurrentCategory(randCat.id);
    setCurrentShape(randShape.id);
    setAnimationPreset(randPresetKey);
    const newKeyLight = {
      enabled: true,
      intensity: saneNumber(Math.random() * (1.5 - 0.3) + 0.3, 0.7),
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 85%)`,
    };
    const newFillLight = {
      enabled: true,
      intensity: saneNumber(Math.random() * (1.0 - 0.2) + 0.2, 0.4),
      color: `hsl(${Math.floor(Math.random() * 360)}, 60%, 75%)`,
    };
    const newAmbientLight = {
      enabled: true,
      intensity: saneNumber(Math.random() * (0.5 - 0.1) + 0.1, 0.25),
      color: `hsl(${Math.floor(Math.random() * 360)}, 50%, 70%)`,
    };
    setSettings((prev) => ({
      ...prev,
      materialType: randMat,
      shapeColor: randColor,
      background: randBgKey,
      extrudeDepth: saneNumber(Math.random() * (1.0 - 0.1) + 0.1, 0.4),
      animationSpeed: saneNumber(Math.random() * (2.0 - 0.5) + 0.5, 1.0),
      keyLight: newKeyLight,
      fillLight: newFillLight,
      ambientLight: newAmbientLight,
      customMaterialProperties: JSON.parse(
        JSON.stringify(initialSettings.customMaterialProperties)
      ),
    }));
    sonnerToast.success("Scene Randomized!", {
      description: "Enjoy the new look.",
    });
    pushHistory("randomize");
  }, [categories, shapesByCategory, backgroundOptions, pushHistory]);

  const currentShapeRef = useRef(currentShape);
  useEffect(() => {
    currentShapeRef.current = currentShape;
  }, [currentShape]);
  const currentImportedModelNameRef = useRef(importedModelName);
  useEffect(() => {
    currentImportedModelNameRef.current = importedModelName;
  }, [importedModelName]);

  const handleExportGLB = useCallback(async () => {
    // Make it async
    if (!meshRef.current || isExporting) return;
    setIsExporting(true);
    setExportProgress(0);
    const exportToastId = sonnerToast.loading("Exporting GLB...", {
      description: "Preparing model...",
    });

    // Progress simulation
    let progress = 0;
    const progInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 10 + 5);
      const curProg = Math.min(progress, 90); // Stop before 100 to allow for final parse
      setExportProgress(curProg);
      sonnerToast.loading("Exporting GLB...", {
        id: exportToastId,
        description: `Processing... ${curProg}%`,
      });
      if (curProg >= 90) clearInterval(progInterval);
    }, 150);

    try {
      if (!(meshRef.current instanceof THREE.Object3D)) {
        throw new Error("Model not valid for export.");
      }

      const exportOptions = { binary: true, embedImages: true };
      if (isImportedModelDisplayed && importedModel?.animations?.length > 0) {
        exportOptions.animations = importedModel.animations;
      }

      const meshToExport = meshRef.current.clone(true); // Deep clone
      const textureLoadPromises = [];

      meshToExport.traverse((child) => {
        if (child.isMesh && child.material) {
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];
          materials.forEach((originalMat) => {
            const newMat = originalMat.clone(); // Clone the material
            const textureMapTypes = [
              "map",
              "normalMap",
              "roughnessMap",
              "metalnessMap",
              "aoMap",
              "emissiveMap",
            ];

            textureMapTypes.forEach((mapType) => {
              const urlKey = `${mapType}Url`;
              const textureUrl = settings.customMaterialProperties[urlKey];

              if (textureUrl) {
                const promise = new Promise((resolve, reject) => {
                  textureLoader.load(
                    textureUrl,
                    (loadedTexture) => {
                      loadedTexture.wrapS = THREE.RepeatWrapping;
                      loadedTexture.wrapT = THREE.RepeatWrapping;
                      if (mapType === "map" || mapType === "emissiveMap") {
                        loadedTexture.colorSpace = THREE.SRGBColorSpace;
                      }
                      newMat[mapType] = loadedTexture;
                      if (mapType === "normalMap" && newMat.normalScale) {
                        newMat.normalScale.set(1, 1);
                      }
                      resolve();
                    },
                    undefined, // onProgress callback (optional)
                    (error) => {
                      console.error(
                        `Failed to load texture for export: ${mapType} from ${textureUrl}`,
                        error
                      );
                      // Optionally, resolve even on error to not block export, or reject to fail export
                      resolve(); // Resolve anyway, texture will be missing from export for this slot
                      // reject(new Error(`Failed to load texture: ${mapType}`));
                    }
                  );
                });
                textureLoadPromises.push(promise);
              } else {
                newMat[mapType] = null; // Ensure slot is null if no URL
              }
            });
            child.material = newMat; // Assign the new material (with potentially async textures)
          });
        }
      });

      // Wait for all textures to load
      if (textureLoadPromises.length > 0) {
        sonnerToast.info("Loading textures for export...", {
          id: exportToastId,
          description: "Please wait...",
        });
        await Promise.all(textureLoadPromises);
      }

      // Ensure materials are updated after textures are assigned
      meshToExport.traverse((child) => {
        if (child.isMesh && child.material) {
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];
          materials.forEach((mat) => (mat.needsUpdate = true));
        }
      });

      sonnerToast.info("Finalizing export...", {
        id: exportToastId,
        description: "Almost there...",
      });
      setExportProgress(95);

      const exporter = new GLTFExporter();
      exporter.parse(
        meshToExport,
        (gltf) => {
          clearInterval(progInterval);
          setExportProgress(100);
          sonnerToast.success("GLB Export Ready", {
            id: exportToastId,
            description: "Download starting.",
          });
          if (!(gltf instanceof ArrayBuffer)) {
            throw new Error("Exported GLTF not ArrayBuffer.");
          }
          const blob = new Blob([gltf], { type: "application/octet-stream" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          const fileNameToExport = isImportedModelDisplayed
            ? currentImportedModelNameRef.current || "imported-model"
            : currentShapeRef.current || "model";
          link.download = `shape-${fileNameToExport}.glb`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
          setTimeout(() => {
            setIsExporting(false);
            setExportProgress(0);
          }, 500);
        },
        (error) => {
          // This is the exporter's error callback
          clearInterval(progInterval);
          console.error("GLTFExporter.parse error:", error);
          sonnerToast.error("GLB Export Failed", {
            id: exportToastId,
            description: error.message || "GLTF parsing error.",
          });
          setIsExporting(false);
          setExportProgress(0);
        },
        exportOptions
      );
    } catch (e) {
      clearInterval(progInterval);
      console.error("GLB export setup error:", e);
      sonnerToast.error("GLB Export Failed", {
        id: exportToastId,
        description: e.message || "Unexpected error during export preparation.",
      });
      setIsExporting(false);
      setExportProgress(0);
    }
  }, [
    isExporting,
    isImportedModelDisplayed,
    importedModel,
    settings.customMaterialProperties,
    currentShapeRef,
    currentImportedModelNameRef,
  ]);

  const handleSimulatedExportOBJ = useCallback(() => {
    if (isExporting) return;
    setIsExporting(true);
    setExportProgress(0);
    const exportToastId = sonnerToast.loading("Exporting OBJ (Simulated)...", {
      description: "Processing...",
    });
    let p = 0;
    const i = setInterval(() => {
      p += Math.floor(Math.random() * 15 + 10);
      const currentProgress = Math.min(p, 100);
      setExportProgress(currentProgress);
      sonnerToast.loading("Exporting OBJ (Simulated)...", {
        id: exportToastId,
        description: `Processing... ${currentProgress}%`,
      });
      if (currentProgress >= 100) {
        clearInterval(i);
        const l = document.createElement("a");
        l.download = `shape-${
          isImportedModelDisplayed
            ? currentImportedModelNameRef.current
            : currentShapeRef.current || "model"
        }.obj`;
        l.href =
          "data:text/plain;charset=utf-8," +
          encodeURIComponent(
            "# OBJ file simulated\n# Actual OBJ Exporter Needed"
          );
        document.body.appendChild(l);
        l.click();
        document.body.removeChild(l);
        sonnerToast.success("OBJ Export (Simulated) Ready", {
          id: exportToastId,
          description: "Simulated OBJ downloaded.",
        });
        setTimeout(() => {
          setIsExporting(false);
          setExportProgress(0);
        }, 500);
      }
    }, 150);
  }, [isExporting, isImportedModelDisplayed]);

  const handleTakeScreenshot = useCallback(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) {
      sonnerToast.error("Screenshot Failed", {
        description: "Renderer not ready.",
      });
      return;
    }
    const screenshotToastId = sonnerToast.loading("Taking Screenshot...", {
      description: "Capturing image...",
    });
    if (composerRef.current) composerRef.current.render();
    else rendererRef.current.render(sceneRef.current, cameraRef.current);
    setTimeout(() => {
      try {
        const canvas = rendererRef.current.domElement;
        const link = document.createElement("a");
        link.download = `screenshot-${
          isImportedModelDisplayed
            ? currentImportedModelNameRef.current
            : currentShapeRef.current || "view"
        }.png`;
        link.href = canvas.toDataURL("image/png");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        sonnerToast.success("Screenshot Saved!", {
          id: screenshotToastId,
          description: `${link.download} saved.`,
        });
      } catch (e) {
        console.error("Screenshot error:", e);
        sonnerToast.error("Screenshot Failed", {
          id: screenshotToastId,
          description: e.message || "Could not save.",
        });
      }
    }, 100);
  }, [isImportedModelDisplayed]);

  const processAndSetImportedModel = useCallback(
    (scene, animations, fileName) => {
      const nameOnly =
        fileName.split(".").slice(0, -1).join(".") || "Imported Model";
      setImportedModelName(nameOnly);
      setImportedModel({ scene, animations: animations || [] });
      setIsImportedModelDisplayed(true);
      handleResetAnimation();
    },
    [handleResetAnimation]
  );

  const processImportedGltf = useCallback(
    (gltf, fileName) => {
      processAndSetImportedModel(gltf.scene, gltf.animations, fileName);
    },
    [processAndSetImportedModel]
  );

  const handleFiles = useCallback(
    async (files) => {
      if (!files || files.length === 0) return;
      const importToastId = sonnerToast.loading("Processing File(s)...", {
        duration: Infinity,
      }); // Keep toast until dismissed
      let objFile = null,
        mtlFile = null,
        fbxFile = null,
        tdsFile = null,
        otherModelFile = null;
      for (const file of files) {
        const lowerName = file.name.toLowerCase();
        if (lowerName.endsWith(".obj")) objFile = file;
        else if (lowerName.endsWith(".mtl")) mtlFile = file;
        else if (lowerName.endsWith(".fbx")) fbxFile = file;
        else if (lowerName.endsWith(".3ds")) tdsFile = file;
        else if (
          lowerName.endsWith(".glb") ||
          lowerName.endsWith(".gltf") ||
          lowerName.endsWith(".stl")
        ) {
          if (!otherModelFile) otherModelFile = file;
        }
      }

      const modelLoadedSuccessfully = (modelName, format) => {
        sonnerToast.success(`${format} Model Loaded`, {
          id: importToastId,
          description: `${modelName} displayed.`,
        });
        pushHistory(`import ${format}`);
      };
      const modelLoadFailed = (
        modelName,
        format,
        errorMsg,
        isUserError = false
      ) => {
        if (isUserError) {
          sonnerToast.warning(`${format} Load Info`, {
            id: importToastId,
            description: `${modelName}: ${
              errorMsg || "Unsupported or malformed file."
            }`,
          });
        } else {
          sonnerToast.error(`${format} Load Failed`, {
            id: importToastId,
            description: `${modelName}: ${
              errorMsg || "Unknown error during processing."
            }`,
          });
        }
      };

      try {
        // Outer try for file reading issues
        if (objFile) {
          // ... OBJ/MTL loading logic (remains the same)
          sonnerToast.info("Processing OBJ model...", {
            id: importToastId,
            description: `Loading ${objFile.name}${
              mtlFile ? " with " + mtlFile.name : ""
            }`,
          });
          try {
            const objLoader = new OBJLoader();
            const mtlLoader = new MTLLoader();
            let materialsCreator = null;
            if (
              mtlFile &&
              objFile.name.slice(0, -4) === mtlFile.name.slice(0, -4)
            ) {
              const mtlText = await mtlFile.text();
              mtlLoader.setResourcePath("");
              materialsCreator = mtlLoader.parse(mtlText, "");
              materialsCreator.preload();
            }
            const objText = await objFile.text();
            if (materialsCreator) objLoader.setMaterials(materialsCreator);
            const object = objLoader.parse(objText);
            object.traverse((child) => {
              if (child.isMesh) {
                if (child.material) {
                  if (Array.isArray(child.material))
                    child.material.forEach(
                      (mat) => (mat.side = THREE.DoubleSide)
                    );
                  else child.material.side = THREE.DoubleSide;
                } else if (!materialsCreator) {
                  child.material = createAdvancedMaterial(
                    currentSettingsRef.current.shapeColor,
                    "ceramic",
                    {}
                  );
                  child.material.side = THREE.DoubleSide;
                }
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });
            processAndSetImportedModel(object, [], objFile.name);
            modelLoadedSuccessfully(objFile.name, "OBJ");
          } catch (error) {
            console.error("OBJ/MTL Error:", error);
            modelLoadFailed(objFile.name, "OBJ/MTL", error.message);
          }
        } else if (fbxFile) {
          // ... FBX loading logic (remains the same)
          sonnerToast.info("Processing FBX model...", {
            id: importToastId,
            description: `Loading ${fbxFile.name}. This may take a moment...`,
          });
          try {
            const buffer = await fbxFile.arrayBuffer();
            const loader = new FBXLoader();
            const object = loader.parse(buffer, "");
            object.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material) {
                  if (Array.isArray(child.material))
                    child.material.forEach(
                      (mat) => (mat.side = THREE.DoubleSide)
                    );
                  else child.material.side = THREE.DoubleSide;
                }
              }
            });
            processAndSetImportedModel(
              object,
              object.animations || [],
              fbxFile.name
            );
            modelLoadedSuccessfully(fbxFile.name, "FBX");
          } catch (error) {
            console.error("FBX Error:", error);
            modelLoadFailed(fbxFile.name, "FBX", error.message);
          }
        } else if (tdsFile) {
          // ... 3DS loading logic (remains the same)
          sonnerToast.info("Processing 3DS model...", {
            id: importToastId,
            description: `Loading ${tdsFile.name}`,
          });
          try {
            const buffer = await tdsFile.arrayBuffer();
            const loader = new TDSLoader();
            const object = loader.parse(buffer, "");
            object.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material) {
                  if (Array.isArray(child.material))
                    child.material.forEach(
                      (mat) => (mat.side = THREE.DoubleSide)
                    );
                  else child.material.side = THREE.DoubleSide;
                } else {
                  child.material = createAdvancedMaterial(
                    currentSettingsRef.current.shapeColor,
                    "plastic",
                    {}
                  );
                  child.material.side = THREE.DoubleSide;
                }
              }
            });
            processAndSetImportedModel(object, [], tdsFile.name);
            modelLoadedSuccessfully(tdsFile.name, "3DS");
          } catch (error) {
            console.error("3DS Error:", error);
            modelLoadFailed(tdsFile.name, "3DS", error.message);
          }
        } else if (otherModelFile) {
          sonnerToast.info("Processing model...", {
            id: importToastId,
            description: `Loading ${otherModelFile.name}`,
          });
          const lowerName = otherModelFile.name.toLowerCase();
          const buffer = await otherModelFile.arrayBuffer();

          if (lowerName.endsWith(".glb") || lowerName.endsWith(".gltf")) {
            if (!(buffer instanceof ArrayBuffer) || buffer.byteLength < 12) {
              console.error(
                "Invalid or too small buffer for GLTF/GLB:",
                otherModelFile.name,
                buffer
              );
              modelLoadFailed(
                otherModelFile.name,
                "GLTF/GLB",
                "File is not a valid GLTF/GLB or is corrupted.",
                true
              );
            } else {
              try {
                const loader = getGltfLoader();
                loader.parse(
                  buffer,
                  "",
                  (gltf) => {
                    processImportedGltf(gltf, otherModelFile.name);
                    modelLoadedSuccessfully(otherModelFile.name, "GLTF/GLB");
                  },
                  (error) => {
                    console.error(
                      "GLB/GLTF Parse Error (async):",
                      error,
                      otherModelFile.name
                    );
                    modelLoadFailed(
                      otherModelFile.name,
                      "GLTF/GLB",
                      error.message || "Error during GLTF parsing."
                    );
                  }
                );
              } catch (parseError) {
                console.error(
                  "GLB/GLTF Synchronous Parse Error:",
                  parseError,
                  otherModelFile.name
                );
                modelLoadFailed(
                  otherModelFile.name,
                  "GLTF/GLB",
                  parseError.message ||
                    "Failed to parse GLTF. File might be corrupted.",
                  true
                );
              }
            }
          } else if (lowerName.endsWith(".stl")) {
            if (!(buffer instanceof ArrayBuffer) || buffer.byteLength === 0) {
              // Basic check, STLLoader does more.
              console.error(
                "Invalid or empty buffer for STL:",
                otherModelFile.name,
                buffer
              );
              modelLoadFailed(
                otherModelFile.name,
                "STL",
                "File is not a valid STL or is empty.",
                true
              );
            } else {
              try {
                const loader = new STLLoader();
                const geometry = loader.parse(buffer);
                if (
                  !geometry.isBufferGeometry ||
                  geometry.attributes.position.count === 0
                ) {
                  throw new Error("Invalid or empty STL geometry.");
                }
                const material = createAdvancedMaterial(
                  currentSettingsRef.current.shapeColor,
                  "plastic",
                  {}
                );
                const modelScene = new THREE.Mesh(geometry, material);
                processAndSetImportedModel(modelScene, [], otherModelFile.name);
                modelLoadedSuccessfully(otherModelFile.name, "STL");
              } catch (stlParseError) {
                console.error(
                  "STL Parse Error:",
                  stlParseError,
                  otherModelFile.name
                );
                modelLoadFailed(
                  otherModelFile.name,
                  "STL",
                  stlParseError.message || "Failed to parse STL file.",
                  true
                );
              }
            }
          } else {
            // This case should ideally not be reached if file filtering is correct
            modelLoadFailed(
              otherModelFile.name,
              "File",
              "Unsupported file type.",
              true
            );
          }
        } else {
          sonnerToast.dismiss(importToastId); // Dismiss loading if no file was processed
          // No specific file type was identified by earlier checks
        }
      } catch (fileReadError) {
        // Error from file.arrayBuffer() itself
        console.error(
          "Error reading file buffer:",
          fileReadError,
          (objFile || fbxFile || tdsFile || otherModelFile)?.name
        );
        modelLoadFailed(
          (objFile || fbxFile || tdsFile || otherModelFile)?.name ||
            "Selected file",
          "File Read",
          fileReadError.message || "Could not read the file.",
          true
        );
      }

      if (fileInputRef.current) fileInputRef.current.value = null;
    },
    [processImportedGltf, processAndSetImportedModel, pushHistory]
  );

  const triggerImport = useCallback(() => {
    if (fileInputRef.current) fileInputRef.current.click();
  }, []);

  const handleFileDropOnViewer = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        handleFiles(Array.from(event.dataTransfer.files));
      }
    },
    [handleFiles]
  );

  const handlePlayPauseAnimation = () => {
    if (!activeActionRef.current) return;
    if (animationPlaybackState === "playing") {
      activeActionRef.current.paused = true;
      setAnimationPlaybackState("paused");
    } else {
      activeActionRef.current.paused = false;
      if (!activeActionRef.current.isRunning()) activeActionRef.current.play();
      setAnimationPlaybackState("playing");
    }
    pushHistory("play/pause imported anim");
  };
  const handleStopAnimation = () => {
    if (!activeActionRef.current) return;
    activeActionRef.current.stop();
    setAnimationPlaybackState("stopped");
    setAnimationTime(0);
    pushHistory("stop imported anim");
  };
  const handleAnimationClipChange = (indexStr) => {
    const index = parseInt(indexStr, 10);
    if (
      mixerRef.current &&
      index >= 0 &&
      index < animationClipsRef.current.length
    ) {
      if (activeActionRef.current) activeActionRef.current.stop();
      const clip = animationClipsRef.current[index];
      activeActionRef.current = mixerRef.current.clipAction(clip);
      activeActionRef.current.setLoop(
        isAnimationLooping ? THREE.LoopRepeat : THREE.LoopOnce,
        Infinity
      );
      activeActionRef.current.timeScale = animationPlaybackSpeed;
      activeActionRef.current.play();
      setSelectedAnimationClipIndex(index);
      setAnimationPlaybackState("playing");
      setAnimationDuration(clip.duration);
      setAnimationTime(0);
      pushHistory("change animation clip");
    }
  };
  const handleAnimationTimeChange = (value) => {
    if (activeActionRef.current && animationDuration > 0) {
      const newTime = value[0] * animationDuration;
      activeActionRef.current.time = newTime;
      if (mixerRef.current) mixerRef.current.update(0);
      setAnimationTime(value[0]);
    }
  };
  const handleAnimationLoopToggle = (checked) => {
    setIsAnimationLooping(checked);
    if (activeActionRef.current) {
      activeActionRef.current.setLoop(
        checked ? THREE.LoopRepeat : THREE.LoopOnce,
        Infinity
      );
    }
    pushHistory("toggle animation loop");
  };
  const handleAnimationSpeedChange = (value) => {
    setAnimationPlaybackSpeed(value[0]);
    if (activeActionRef.current) {
      activeActionRef.current.timeScale = value[0];
    }
  };

  const handleCustomBgImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomBgImageUrl(e.target.result);
        sonnerToast.success("Background image set.");
      };
      reader.readAsDataURL(file);
    }
  };
  const handleClearCustomBgImage = () => {
    setCustomBgImageUrl(null);
    sonnerToast.info("Custom background image cleared.");
  };

  const handleTextureUpload = (mapType, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const urlKey = `${mapType}Url`;
        setSettings((s) => ({
          ...s,
          customMaterialProperties: {
            ...s.customMaterialProperties,
            [urlKey]: e.target.result,
          },
        }));
        sonnerToast.success(`${mapType.replace("Map", "")} texture set.`);
        if (textureFileInputRefs.current[mapType]) {
          textureFileInputRefs.current[mapType].value = null;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearTexture = (mapType) => {
    const urlKey = `${mapType}Url`;
    setSettings((s) => ({
      ...s,
      customMaterialProperties: {
        ...s.customMaterialProperties,
        [urlKey]: null,
      },
    }));
    if (
      textureObjectsRef.current[urlKey] &&
      textureObjectsRef.current[urlKey].dispose
    ) {
      textureObjectsRef.current[urlKey].dispose();
      delete textureObjectsRef.current[urlKey];
    }
    sonnerToast.info(`${mapType.replace("Map", "")} texture cleared.`);
  };

  if (!isMounted) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-4'>
        <Loader2 className='h-12 w-12 animate-spin text-purple-400 mb-4' />
        <p className='text-lg font-medium'>Initializing 3D Studio...</p>
        <p className='text-sm text-slate-400'>
          Getting things ready, please wait.
        </p>
      </div>
    );
  }

  const canUndo = historyPointerRef.current > 0;
  const canRedo =
    historyPointerRef.current < historyStackRef.current.length - 1;
  const proceduralMaterialType =
    settings.materialType === "auto"
      ? SHAPES_BY_CATEGORY_DATA[currentCategory]?.find(
          (s) => s.id === currentShape
        )?.autoMaterial || "ceramic"
      : settings.materialType;

  const textureSlots = [
    { id: "map", name: "Color/Albedo" },
    { id: "normalMap", name: "Normal" },
    { id: "roughnessMap", name: "Roughness" },
    { id: "metalnessMap", name: "Metalness" },
    { id: "aoMap", name: "Ambient Occlusion" },
    { id: "emissiveMap", name: "Emissive" },
  ];

  const renderSettingsContent = () => (
    <div className='space-y-4 py-4 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50 pr-3 pl-4'>
      {!isImportedModelDisplayed && (
        <>
          <p className='text-sm text-slate-300 font-semibold uppercase tracking-wider'>
            Procedural Shape Material
          </p>
          <div className='space-y-1.5'>
            <Label
              htmlFor='materialTypePanel'
              className='text-sm text-slate-300'
            >
              Base Material
            </Label>
            <Select
              value={settings.materialType}
              onValueChange={(value) => {
                setSettings((s) => ({ ...s, materialType: value }));
                resetCustomMaterialProperties();
              }}
            >
              <SelectTrigger
                id='materialTypePanel'
                className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'
              >
                <SelectValue placeholder='Select material' />
              </SelectTrigger>
              <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
                {[
                  "auto",
                  "metallic",
                  "glass",
                  "crystal",
                  "ceramic",
                  "organic",
                  "plastic",
                  "neon",
                ].map((type) => (
                  <SelectItem
                    key={type}
                    value={type}
                    className='capitalize focus:bg-purple-600 focus:text-white'
                  >
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='shapeColorPanel' className='text-sm text-slate-300'>
              Base Color
            </Label>
            <Input
              id='shapeColorPanel'
              type='color'
              value={settings.shapeColor}
              onChange={(e) =>
                setSettings((s) => ({ ...s, shapeColor: e.target.value }))
              }
              className='w-full p-1 h-9 bg-slate-700 border-slate-600 cursor-pointer focus-visible:ring-purple-500'
            />
          </div>

          {settings.materialType !== "auto" && (
            <div className='p-3 border border-slate-600 rounded-md space-y-3 bg-slate-700/30'>
              <div className='flex justify-between items-center'>
                <h4 className='text-xs font-semibold text-purple-300'>
                  Fine-tune '{settings.materialType}'
                </h4>
                <Button
                  variant='ghost'
                  size='xs'
                  onClick={resetCustomMaterialProperties}
                  className='text-slate-400 hover:text-purple-300 h-7 px-2'
                >
                  Reset
                </Button>
              </div>
              {(proceduralMaterialType === "metallic" ||
                proceduralMaterialType === "glass" ||
                proceduralMaterialType === "crystal" ||
                proceduralMaterialType === "ceramic" ||
                proceduralMaterialType === "organic" ||
                proceduralMaterialType === "plastic" ||
                proceduralMaterialType === "neon") && (
                <div className='space-y-1.5'>
                  <div className='flex justify-between items-center'>
                    <Label
                      htmlFor='customRoughnessPanel'
                      className='text-xs text-slate-300'
                    >
                      Roughness
                    </Label>
                    <span className='text-xs text-slate-400'>
                      {(
                        settings.customMaterialProperties.roughness ??
                        baseMaterialPresets[proceduralMaterialType]
                          ?.roughness ??
                        0
                      ).toFixed(2)}
                    </span>
                  </div>
                  <Slider
                    id='customRoughnessPanel'
                    min={0}
                    max={1}
                    step={0.01}
                    value={[
                      settings.customMaterialProperties.roughness ??
                        baseMaterialPresets[proceduralMaterialType]
                          ?.roughness ??
                        0,
                    ]}
                    onValueChange={([val]) =>
                      handleCustomMaterialPropChange("roughness", val)
                    }
                    className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
                  />
                </div>
              )}
              {(proceduralMaterialType === "metallic" ||
                proceduralMaterialType === "ceramic" ||
                proceduralMaterialType === "plastic") && (
                <div className='space-y-1.5'>
                  <div className='flex justify-between items-center'>
                    <Label
                      htmlFor='customMetalnessPanel'
                      className='text-xs text-slate-300'
                    >
                      Metalness
                    </Label>
                    <span className='text-xs text-slate-400'>
                      {(
                        settings.customMaterialProperties.metalness ??
                        baseMaterialPresets[proceduralMaterialType]
                          ?.metalness ??
                        0
                      ).toFixed(2)}
                    </span>
                  </div>
                  <Slider
                    id='customMetalnessPanel'
                    min={0}
                    max={1}
                    step={0.01}
                    value={[
                      settings.customMaterialProperties.metalness ??
                        baseMaterialPresets[proceduralMaterialType]
                          ?.metalness ??
                        0,
                    ]}
                    onValueChange={([val]) =>
                      handleCustomMaterialPropChange("metalness", val)
                    }
                    className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
                  />
                </div>
              )}
              {(proceduralMaterialType === "glass" ||
                proceduralMaterialType === "crystal") && (
                <>
                  <div className='space-y-1.5'>
                    <div className='flex justify-between items-center'>
                      <Label
                        htmlFor='customIorPanel'
                        className='text-xs text-slate-300'
                      >
                        IOR
                      </Label>
                      <span className='text-xs text-slate-400'>
                        {(
                          settings.customMaterialProperties.ior ??
                          baseMaterialPresets[proceduralMaterialType]?.ior ??
                          1.5
                        ).toFixed(2)}
                      </span>
                    </div>
                    <Slider
                      id='customIorPanel'
                      min={1}
                      max={2.33}
                      step={0.01}
                      value={[
                        settings.customMaterialProperties.ior ??
                          baseMaterialPresets[proceduralMaterialType]?.ior ??
                          1.5,
                      ]}
                      onValueChange={([val]) =>
                        handleCustomMaterialPropChange("ior", val)
                      }
                      className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
                    />
                  </div>
                  <div className='space-y-1.5'>
                    <div className='flex justify-between items-center'>
                      <Label
                        htmlFor='customTransmissionPanel'
                        className='text-xs text-slate-300'
                      >
                        Transmission
                      </Label>
                      <span className='text-xs text-slate-400'>
                        {(
                          settings.customMaterialProperties.transmission ??
                          baseMaterialPresets[proceduralMaterialType]
                            ?.transmission ??
                          0
                        ).toFixed(2)}
                      </span>
                    </div>
                    <Slider
                      id='customTransmissionPanel'
                      min={0}
                      max={1}
                      step={0.01}
                      value={[
                        settings.customMaterialProperties.transmission ??
                          baseMaterialPresets[proceduralMaterialType]
                            ?.transmission ??
                          0,
                      ]}
                      onValueChange={([val]) =>
                        handleCustomMaterialPropChange("transmission", val)
                      }
                      className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
                    />
                  </div>
                  <div className='space-y-1.5'>
                    <div className='flex justify-between items-center'>
                      <Label
                        htmlFor='customThicknessPanel'
                        className='text-xs text-slate-300'
                      >
                        Thickness
                      </Label>
                      <span className='text-xs text-slate-400'>
                        {(
                          settings.customMaterialProperties.thickness ??
                          baseMaterialPresets[proceduralMaterialType]
                            ?.thickness ??
                          0
                        ).toFixed(2)}
                      </span>
                    </div>
                    <Slider
                      id='customThicknessPanel'
                      min={0}
                      max={2}
                      step={0.01}
                      value={[
                        settings.customMaterialProperties.thickness ??
                          baseMaterialPresets[proceduralMaterialType]
                            ?.thickness ??
                          0,
                      ]}
                      onValueChange={([val]) =>
                        handleCustomMaterialPropChange("thickness", val)
                      }
                      className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
                    />
                  </div>
                </>
              )}
              {proceduralMaterialType === "neon" && (
                <div className='space-y-1.5'>
                  <div className='flex justify-between items-center'>
                    <Label
                      htmlFor='customEmissiveIntensityPanel'
                      className='text-xs text-slate-300'
                    >
                      Emissive Intensity
                    </Label>
                    <span className='text-xs text-slate-400'>
                      {(
                        settings.customMaterialProperties.emissiveIntensity ??
                        baseMaterialPresets.neon?.emissiveIntensity ??
                        1.0
                      ).toFixed(2)}
                    </span>
                  </div>
                  <Slider
                    id='customEmissiveIntensityPanel'
                    min={0}
                    max={5}
                    step={0.1}
                    value={[
                      settings.customMaterialProperties.emissiveIntensity ??
                        baseMaterialPresets.neon?.emissiveIntensity ??
                        1.0,
                    ]}
                    onValueChange={([val]) =>
                      handleCustomMaterialPropChange("emissiveIntensity", val)
                    }
                    className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
                  />
                </div>
              )}
              <Separator className='my-2 bg-slate-500/50' />
              <h5 className='text-xs font-medium text-purple-300 pt-1'>
                Textures
              </h5>
              <div className='grid grid-cols-2 gap-x-3 gap-y-4'>
                {textureSlots.map((slot) => {
                  if (
                    (slot.id === "emissiveMap" &&
                      proceduralMaterialType !== "neon" &&
                      !baseMaterialPresets[proceduralMaterialType]
                        ?.useEmissive) ||
                    ((slot.id === "metalnessMap" ||
                      slot.id === "roughnessMap") &&
                      (proceduralMaterialType === "glass" ||
                        proceduralMaterialType === "crystal")) ||
                    (slot.id === "aoMap" &&
                      (proceduralMaterialType === "glass" ||
                        proceduralMaterialType === "crystal" ||
                        proceduralMaterialType === "neon"))
                  ) {
                    return null;
                  }
                  const urlKey = `${slot.id}Url`;
                  const currentTextureUrl =
                    settings.customMaterialProperties[urlKey];
                  return (
                    <div key={slot.id} className='space-y-1'>
                      <Label
                        htmlFor={`texture-${slot.id}`}
                        className='text-xs text-slate-300'
                      >
                        {slot.name}
                      </Label>
                      {currentTextureUrl && (
                        <div className='relative group w-full aspect-square bg-slate-600/50 rounded overflow-hidden mb-1'>
                          <img
                            src={currentTextureUrl}
                            alt={`${slot.name} preview`}
                            className='w-full h-full object-cover'
                          />
                          <Button
                            variant='destructive'
                            size='icon'
                            className='absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity'
                            onClick={() => handleClearTexture(slot.id)}
                            title={`Clear ${slot.name} Texture`}
                          >
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      )}
                      <Input
                        id={`texture-${slot.id}`}
                        type='file'
                        accept='image/png, image/jpeg, image/webp'
                        ref={(el) =>
                          (textureFileInputRefs.current[slot.id] = el)
                        }
                        onChange={(e) => handleTextureUpload(slot.id, e)}
                        className={cn(
                          "w-full text-xs file:mr-1.5 file:py-1 file:px-1.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer",
                          currentTextureUrl ? "mt-1" : ""
                        )}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <Separator className='my-3 bg-slate-600' />
          <p className='text-sm text-slate-300 font-semibold uppercase tracking-wider'>
            Procedural Shape Geometry
          </p>
          <div className='space-y-1.5'>
            <div className='flex justify-between items-center'>
              <Label
                htmlFor='extrudeDepthPanel'
                className='text-sm text-slate-300'
              >
                Depth
              </Label>
              <span className='text-xs text-slate-400'>
                {settings.extrudeDepth.toFixed(2)}
              </span>
            </div>
            <Slider
              id='extrudeDepthPanel'
              min={0.05}
              max={1.5}
              step={0.05}
              value={[settings.extrudeDepth]}
              onValueChange={([value]) =>
                setSettings((s) => ({ ...s, extrudeDepth: value }))
              }
              className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
            />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='qualityPanel' className='text-sm text-slate-300'>
              Quality
            </Label>
            <Select
              value={settings.quality}
              onValueChange={(value) =>
                setSettings((s) => ({ ...s, quality: value }))
              }
            >
              <SelectTrigger
                id='qualityPanel'
                className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'
              >
                <SelectValue placeholder='Select quality' />
              </SelectTrigger>
              <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
                {["low", "medium", "high"].map((q) => (
                  <SelectItem
                    key={q}
                    value={q}
                    className='capitalize focus:bg-purple-600 focus:text-white'
                  >
                    {q}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      <Separator className='my-3 bg-slate-600' />
      <p className='text-sm text-slate-300 font-semibold uppercase tracking-wider'>
        General Display
      </p>
      <div className='space-y-1.5'>
        <div className='flex justify-between items-center'>
          <Label
            htmlFor='animationSpeedPanel'
            className='text-sm text-slate-300'
          >
            Float Anim. Speed
          </Label>
          <span className='text-xs text-slate-400'>
            {settings.animationSpeed.toFixed(1)}x
          </span>
        </div>
        <Slider
          id='animationSpeedPanel'
          min={0.1}
          max={3}
          step={0.1}
          value={[settings.animationSpeed]}
          onValueChange={([value]) =>
            setSettings((s) => ({ ...s, animationSpeed: value }))
          }
          className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
        />
      </div>
      <div className='space-y-1.5'>
        <Label htmlFor='backgroundPanel' className='text-sm text-slate-300'>
          Background
        </Label>
        <Select
          value={settings.background}
          onValueChange={(value) =>
            setSettings((s) => ({ ...s, background: value }))
          }
        >
          <SelectTrigger
            id='backgroundPanel'
            className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'
          >
            <SelectValue placeholder='Select background' />
          </SelectTrigger>
          <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
            {Object.entries(backgroundOptions).map(([key, name]) => (
              <SelectItem
                key={key}
                value={key}
                className='focus:bg-purple-600 focus:text-white'
              >
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {settings.background === "customImage" && (
          <div className='mt-2 space-y-1.5 p-3 border border-slate-600 rounded-md bg-slate-700/30'>
            <Label
              htmlFor='customBgImagePanel'
              className='text-sm text-slate-300'
            >
              Upload Background Image
            </Label>
            <Input
              id='customBgImagePanel'
              type='file'
              accept='image/png, image/jpeg, image/webp'
              onChange={handleCustomBgImageUpload}
              className='w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer'
            />
            {customBgImageUrl && (
              <Button
                variant='ghost'
                size='xs'
                onClick={handleClearCustomBgImage}
                className='text-red-400 hover:text-red-300 hover:bg-transparent mt-1 w-full'
              >
                Clear Custom Image
              </Button>
            )}
          </div>
        )}
      </div>
      <Separator className='my-3 bg-slate-600' />
      <p className='text-sm text-slate-300 font-semibold uppercase tracking-wider'>
        Lighting
      </p>
      {["keyLight", "fillLight", "ambientLight"].map((lightKey) => {
        const lightName =
          lightKey.replace("Light", "").charAt(0).toUpperCase() +
          lightKey.replace("Light", "").slice(1);
        return (
          <div
            key={lightKey}
            className='p-3 border border-slate-600 rounded-md space-y-2 text-xs bg-slate-700/30'
          >
            <div className='flex items-center justify-between'>
              <Label
                htmlFor={`${lightKey}EnablePanel`}
                className='text-slate-200 text-sm'
              >
                {lightName} Light
              </Label>
              <Switch
                id={`${lightKey}EnablePanel`}
                checked={settings[lightKey].enabled}
                onCheckedChange={(checked) =>
                  setSettings((s) => ({
                    ...s,
                    [lightKey]: { ...s[lightKey], enabled: checked },
                  }))
                }
              />
            </div>
            {settings[lightKey].enabled && (
              <>
                <div className='flex justify-between items-center'>
                  <Label
                    htmlFor={`${lightKey}IntensityPanel`}
                    className='text-slate-300'
                  >
                    Intensity
                  </Label>
                  <span className='text-slate-400'>
                    {settings[lightKey].intensity.toFixed(2)}
                  </span>
                </div>
                <Slider
                  id={`${lightKey}IntensityPanel`}
                  min={0}
                  max={2}
                  step={0.05}
                  value={[settings[lightKey].intensity]}
                  onValueChange={([val]) =>
                    setSettings((s) => ({
                      ...s,
                      [lightKey]: { ...s[lightKey], intensity: val },
                    }))
                  }
                  className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
                />
                <Label
                  htmlFor={`${lightKey}ColorPanel`}
                  className='text-slate-300'
                >
                  Color
                </Label>
                <Input
                  id={`${lightKey}ColorPanel`}
                  type='color'
                  value={settings[lightKey].color}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      [lightKey]: { ...s[lightKey], color: e.target.value },
                    }))
                  }
                  className='w-full h-7 p-0.5 bg-slate-600 border-slate-500 cursor-pointer'
                />
              </>
            )}
          </div>
        );
      })}
      {isImportedModelDisplayed && animationClipsRef.current.length > 0 && (
        <>
          <Separator className='my-3 bg-slate-600' />
          <p className='text-sm text-slate-300 font-semibold uppercase tracking-wider'>
            Animation Playback
          </p>
          <div className='space-y-4 p-3 border border-slate-600 rounded-md bg-slate-700/30'>
            <Select
              value={selectedAnimationClipIndex.toString()}
              onValueChange={handleAnimationClipChange}
              disabled={animationClipsRef.current.length === 0}
            >
              <SelectTrigger className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'>
                <SelectValue placeholder='Select animation clip' />
              </SelectTrigger>
              <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
                {animationClipsRef.current.map((clip, index) => (
                  <SelectItem
                    key={index}
                    value={index.toString()}
                    className='focus:bg-purple-600 focus:text-white'
                  >
                    {clip.name || `Animation ${index + 1}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className='grid grid-cols-3 gap-2'>
              <Button
                onClick={handlePlayPauseAnimation}
                disabled={selectedAnimationClipIndex < 0}
                className={cn(
                  "bg-green-600 hover:bg-green-700",
                  animationPlaybackState === "playing" &&
                    "bg-yellow-500 hover:bg-yellow-600"
                )}
              >
                {animationPlaybackState === "playing" ? (
                  <Pause size={16} />
                ) : (
                  <Play size={16} />
                )}
              </Button>
              <Button
                onClick={handleStopAnimation}
                disabled={
                  selectedAnimationClipIndex < 0 ||
                  animationPlaybackState === "stopped"
                }
                className='bg-red-600 hover:bg-red-700'
              >
                <StopCircle size={16} />
              </Button>
              <Button
                variant={isAnimationLooping ? "secondary" : "outline"}
                onClick={() => handleAnimationLoopToggle(!isAnimationLooping)}
                disabled={selectedAnimationClipIndex < 0}
                className={cn(
                  isAnimationLooping
                    ? "bg-purple-500 hover:bg-purple-600 text-white"
                    : "border-slate-600 text-slate-300 hover:bg-slate-700/50"
                )}
              >
                <Repeat size={16} />
              </Button>
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='animTimePanel' className='text-sm text-slate-300'>
                Time: {(animationTime * animationDuration).toFixed(2)}s /{" "}
                {animationDuration.toFixed(2)}s
              </Label>
              <Slider
                id='animTimePanel'
                min={0}
                max={1}
                step={0.001}
                value={[animationTime]}
                onValueChange={(val) => handleAnimationTimeChange(val)}
                disabled={
                  selectedAnimationClipIndex < 0 || animationDuration === 0
                }
                className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
              />
            </div>
            <div className='space-y-1.5'>
              <Label
                htmlFor='animSpeedPanelSlider'
                className='text-sm text-slate-300'
              >
                Speed: {animationPlaybackSpeed.toFixed(1)}x
              </Label>
              <Slider
                id='animSpeedPanelSlider'
                min={0.1}
                max={3}
                step={0.1}
                value={[animationPlaybackSpeed]}
                onValueChange={(val) => handleAnimationSpeedChange(val)}
                disabled={selectedAnimationClipIndex < 0}
                className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
              />
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <TooltipProvider>
      <>
        <SonnerToaster richColors position='top-right' />
        <div className='min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 p-3 sm:p-4 md:p-6 text-slate-100 select-none'>
          <input
            type='file'
            accept='.glb,.gltf,.stl,.obj,.mtl,.fbx,.3ds'
            multiple
            ref={fileInputRef}
            onChange={(e) => handleFiles(Array.from(e.target.files))}
            style={{ display: "none" }}
          />
          <div className='max-w-screen-2xl mx-auto'>
            <header className='text-center mb-8 sm:mb-10'>
              <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-3 sm:mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent'>
                3D Shape Studio Pro
              </h1>
              <p className='text-slate-400 text-base sm:text-lg max-w-3xl mx-auto'>
                Craft, view, and animate 3D masterpieces. Import GLB, GLTF,
                STL,OBJ, FBX or 3DS models. Drag & drop supported.
              </p>
            </header>
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6'>
              <div className='lg:col-span-3 space-y-4 sm:space-y-5 order-last lg:order-first'>
                {!isImportedModelDisplayed && (
                  <>
                    <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
                      <CardHeader>
                        <CardTitle className='text-slate-100'>
                          Categories
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className='grid grid-cols-2 gap-3'>
                          {categories.map((category) => (
                            <Button
                              key={category.id}
                              variant={
                                currentCategory === category.id
                                  ? "default"
                                  : "outline"
                              }
                              className={cn(
                                "h-auto py-3 flex flex-col items-center justify-center gap-1.5 text-xs sm:text-sm transition-all",
                                currentCategory === category.id
                                  ? "bg-purple-600 hover:bg-purple-700 text-white ring-2 ring-purple-400"
                                  : "text-slate-300 border-slate-600 hover:bg-slate-700/50"
                              )}
                              onClick={() => handleCategorySelect(category.id)}
                            >
                              <span className='text-2xl sm:text-3xl'>
                                {category.icon}
                              </span>{" "}
                              <span>{category.name}</span>
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
                      <CardHeader>
                        <CardTitle className='text-slate-100'>Shapes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className='grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50'>
                          {shapesByCategory[currentCategory].map((shape) => (
                            <Button
                              key={shape.id}
                              variant={
                                currentShape === shape.id
                                  ? "secondary"
                                  : "ghost"
                              }
                              className={cn(
                                "justify-start gap-2",
                                currentShape === shape.id
                                  ? "bg-purple-500 text-white hover:bg-purple-600"
                                  : "text-slate-300 hover:bg-slate-700/50"
                              )}
                              onClick={() => handleShapeSelect(shape.id)}
                            >
                              <span className='text-xl'>{shape.icon}</span>{" "}
                              {shape.name}
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
                {isImportedModelDisplayed && importedModel && (
                  <Card className='bg-slate-800/70 border-slate-700 shadow-xl text-center'>
                    <CardHeader>
                      <CardTitle className='text-slate-100'>
                        Current Model
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p
                        className='text-sm text-slate-300 truncate font-medium'
                        title={importedModelName}
                      >
                        {importedModelName}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant='destructive'
                        size='sm'
                        className='w-full'
                        onClick={() => {
                          setImportedModel(null);
                          setIsImportedModelDisplayed(false);
                          setImportedModelName("Imported Model");
                          const defaultCategoryId = categories[0].id;
                          setCurrentCategory(defaultCategoryId);
                          setCurrentShape(
                            shapesByCategory[defaultCategoryId][0].id
                          );
                          handleResetAnimation();
                          sonnerToast.info("Imported Model Cleared", {
                            description: "Procedural shapes active.",
                          });
                          pushHistory("clear imported model");
                        }}
                      >
                        <XCircle size={16} className='mr-2' /> Clear Imported
                      </Button>
                    </CardFooter>
                  </Card>
                )}
                <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
                  <CardHeader>
                    <CardTitle className='text-slate-100'>
                      Global Animation & View
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <Button
                      onClick={handleToggleGlobalAnimation}
                      variant={isAnimating ? "destructive" : "default"}
                      className='w-full bg-green-600 hover:bg-green-700 data-[state=destructive]:bg-red-600 data-[state=destructive]:hover:bg-red-700'
                      data-state={isAnimating ? "destructive" : "default"}
                    >
                      {isAnimating ? (
                        <Pause size={16} className='mr-2' />
                      ) : (
                        <Play size={16} className='mr-2' />
                      )}
                      {isAnimating ? "Pause Float" : "Play Float"}
                    </Button>
                    <Select
                      value={animationPreset}
                      onValueChange={(val) => {
                        setAnimationPreset(val);
                      }}
                    >
                      <SelectTrigger className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'>
                        <SelectValue placeholder='Select float style' />
                      </SelectTrigger>
                      <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
                        {Object.keys(animationPresets).map((presetKey) => (
                          <SelectItem
                            key={presetKey}
                            value={presetKey}
                            className='capitalize focus:bg-purple-600 focus:text-white'
                          >
                            {presetKey.charAt(0).toUpperCase() +
                              presetKey.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className='grid grid-cols-2 gap-3'>
                      <Button
                        variant='outline'
                        onClick={handleResetAnimation}
                        className='border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
                      >
                        <RotateCcw size={14} className='mr-2' /> Reset View
                      </Button>
                      <Button
                        variant='default'
                        onClick={handleRandomize}
                        className='bg-indigo-600 hover:bg-indigo-700'
                      >
                        <Shuffle size={14} className='mr-2' /> Randomize
                      </Button>
                    </div>
                    <div className='grid grid-cols-2 gap-3 pt-2'>
                      <Button
                        variant='outline'
                        onClick={handleUndo}
                        disabled={!canUndo}
                        className='border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 disabled:opacity-50'
                      >
                        <Undo size={14} className='mr-2' /> Undo
                      </Button>
                      <Button
                        variant='outline'
                        onClick={handleRedo}
                        disabled={!canRedo}
                        className='border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 disabled:opacity-50'
                      >
                        <Redo size={14} className='mr-2' /> Redo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
                  <CardHeader>
                    <CardTitle className='text-slate-100'>
                      File & Export
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    <Button
                      onClick={triggerImport}
                      disabled={isExporting}
                      className='w-full bg-green-600 hover:bg-green-700'
                    >
                      <UploadCloud size={16} className='mr-2' /> Import Model
                    </Button>
                    <Button
                      onClick={handleExportGLB}
                      disabled={isExporting}
                      className='w-full bg-blue-600 hover:bg-blue-700'
                    >
                      <Download size={16} className='mr-2' />
                      {isExporting &&
                      exportProgress > 0 &&
                      exportProgress <= 100
                        ? `GLB... ${Math.round(exportProgress)}%`
                        : "Export GLB"}
                    </Button>
                    <Button
                      onClick={handleSimulatedExportOBJ}
                      disabled={isExporting}
                      className='w-full bg-teal-600 hover:bg-teal-700'
                    >
                      <Download size={16} className='mr-2' />
                      {isExporting &&
                      exportProgress > 0 &&
                      exportProgress <= 100
                        ? `OBJ... ${Math.round(exportProgress)}%`
                        : "Export OBJ (Sim.)"}
                    </Button>
                    <Button
                      onClick={handleTakeScreenshot}
                      disabled={isExporting}
                      className='w-full bg-purple-600 hover:bg-purple-700'
                    >
                      <Camera size={16} className='mr-2' /> Screenshot
                    </Button>
                  </CardContent>
                </Card>
              </div>
              <div className='lg:col-span-9 order-first lg:order-last'>
                <Card
                  ref={viewerCardRef}
                  className='bg-slate-800/50 border-slate-700/80 shadow-2xl aspect-[4/3] sm:aspect-video lg:aspect-[16/10] overflow-hidden relative'
                >
                  <div className='absolute top-2 right-2 sm:top-3 sm:right-3 z-20 flex items-center space-x-2'>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='bg-slate-800/60 hover:bg-slate-700/90 text-slate-300 hover:text-purple-300 rounded-full p-2 shadow-md'
                          onClick={toggleFullscreen}
                        >
                          {isFullscreen ? (
                            <Minimize size={20} />
                          ) : (
                            <Maximize size={20} />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {isFullscreen
                            ? "Exit Fullscreen"
                            : "Enter Fullscreen"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                    <Sheet
                      open={isSettingsPanelOpen}
                      onOpenChange={setIsSettingsPanelOpen}
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SheetTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='bg-slate-800/60 hover:bg-slate-700/90 text-slate-300 hover:text-purple-300 rounded-full p-2 shadow-md'
                            >
                              <Settings2 size={20} />
                            </Button>
                          </SheetTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Open Detailed Settings</p>
                        </TooltipContent>
                      </Tooltip>
                      <SheetContent
                        side='right'
                        className='bg-slate-800/95 border-l border-slate-700 text-slate-100 p-0 w-full sm:max-w-sm md:max-w-md backdrop-blur-sm'
                      >
                        <SheetHeader className='p-4 border-b border-slate-700'>
                          <SheetTitle className='text-xl text-slate-100'>
                            Viewer & Model Settings
                          </SheetTitle>
                          <SheetDescription className='text-slate-400 text-xs'>
                            Fine-tune the appearance, lighting, and animation
                            playback.
                          </SheetDescription>
                        </SheetHeader>
                        {renderSettingsContent()}
                        <SheetFooter className='p-4 border-t border-slate-700 bg-slate-800/95'>
                          <SheetClose asChild>
                            <Button
                              type='button'
                              variant='outline'
                              className='w-full border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
                            >
                              Close Panel
                            </Button>
                          </SheetClose>
                        </SheetFooter>
                      </SheetContent>
                    </Sheet>
                  </div>
                  <CardContent className='p-0 w-full h-full relative'>
                    <div
                      className='relative w-full h-full'
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onDrop={handleFileDropOnViewer}
                    >
                      <div
                        ref={mountRef}
                        className='w-full h-full rounded-lg overflow-hidden'
                      />
                      {isExporting && (
                        <div className='absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-lg z-10 backdrop-blur-sm'>
                          <Card className='bg-slate-100 text-slate-800 p-6 sm:p-8 shadow-2xl text-center w-72'>
                            <CardHeader className='p-0 mb-4'>
                              <CardTitle className='text-xl sm:text-2xl'>
                                Exporting Model
                              </CardTitle>
                            </CardHeader>
                            <CardContent className='p-0 space-y-3'>
                              <div className='text-lg font-semibold'>
                                {Math.round(exportProgress)}%
                              </div>
                              <Progress
                                value={exportProgress}
                                className='w-full h-2.5'
                              />
                              <p className='text-xs text-slate-500'>
                                Please wait, this may take a moment...
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <footer className='text-center mt-10 sm:mt-16 py-6 border-t border-slate-700/50'>
              <p className='text-slate-400 text-sm'>
                © {new Date().getFullYear()} 3D Shape Studio Pro. All rights
                reserved.
              </p>
              <p className='text-xs text-slate-500 mt-1'>
                An interactive 3D modeling and visualization tool.
              </p>
            </footer>
          </div>
        </div>
      </>
    </TooltipProvider>
  );
};

export default ModelViewer3D;
