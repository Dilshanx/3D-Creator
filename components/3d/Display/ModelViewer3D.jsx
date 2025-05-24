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

import {
  Download,
  Play,
  Pause,
  RotateCcw,
  Camera,
  Settings as SettingsIcon,
  Shuffle,
  UploadCloud,
  XCircle,
} from "lucide-react";

// --- Helper to ensure numbers are valid ---
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
  if (materialType === "glass" || materialType === "crystal")
    return new THREE.MeshPhysicalMaterial(sharedProps);
  return new THREE.MeshStandardMaterial(sharedProps);
};

const create3DShape = (shapeId, currentSettings, size = 1) => {
  let shape;
  let materialType =
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
  if (currentSettings.materialType === "auto")
    materialType = config.autoMaterial;
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
      "Error centering geometry, likely due to NaN in shape path:",
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
    materialType
  );
  return new THREE.Mesh(geometry, material);
};

// --- UI Components ---
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
    <div className='grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50'>
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
const FileControls = ({
  onExportGLB,
  onExportOBJ,
  onTakeScreenshot,
  isExporting,
  exportProgress,
  onImportGLB,
}) => (
  <div className='bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/70 shadow-lg'>
    <h3 className='text-lg font-semibold text-white mb-3'>File & Export</h3>
    <div className='space-y-2'>
      <button
        onClick={onImportGLB}
        disabled={isExporting}
        className='w-full flex items-center justify-center gap-2 p-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-400'
      >
        <UploadCloud size={14} /> Import GLB/GLTF
      </button>
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
const ThreeDViewer = ({
  mountRef,
  isExporting,
  exportProgress,
  onDropFile,
}) => (
  <div className='lg:col-span-3 xl:col-span-3 order-first lg:order-last'>
    <div className='bg-slate-800/30 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-slate-700/50 shadow-2xl aspect-[4/3] sm:aspect-video lg:aspect-[16/9]'>
      <div
        className='relative w-full h-full'
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={onDropFile}
      >
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
        className='bg-slate-800 rounded-xl p-6 border-slate-700 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50'
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
            <XCircle size={24} />
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
              <option value='auto'>Auto Detect</option>
              <option value='metallic'>Metallic</option>
              <option value='glass'>Glass</option>
              <option value='crystal'>Crystal</option>
              <option value='ceramic'>Ceramic</option>
              <option value='organic'>Organic</option>
              <option value='plastic'>Plastic</option>
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
              <option value='low'>Low</option>
              <option value='medium'>Medium</option>
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
              <option value='modernGradient'>Modern Gradient</option>
              <option value='darkSpace'>Dark Space</option>
              <option value='softLight'>Soft Light</option>
              <option value='studioDark'>Studio Dark</option>
              <option value='studioLight'>Studio Light</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

let gltfLoaderInstance;
const getGltfLoader = () => {
  if (!gltfLoaderInstance) {
    gltfLoaderInstance = new GLTFLoader();
    // --- UNCOMMENT AND CONFIGURE DRACO IF NEEDED ---
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/gltf/");
    gltfLoaderInstance.setDRACOLoader(dracoLoader);
  }
  return gltfLoaderInstance;
};

const ModelViewer3D = () => {
  const [isMounted, setIsMounted] = useState(false);
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const composerRef = useRef(null);
  const ssaoPassRef = useRef(null); // Correctly declared here
  const meshRef = useRef(null);
  const animationIdRef = useRef(null);
  const lightsRef = useRef([]);
  const skyboxMeshRef = useRef(null);
  const envMapTextureRef = useRef(null);
  const glbFileInputRef = useRef(null);

  const [importedModel, setImportedModel] = useState(null);
  const [isImportedModelDisplayed, setIsImportedModelDisplayed] =
    useState(false);
  const [importedModelName, setImportedModelName] = useState("Imported Model");

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
  const animationPresetRef = useRef(animationPreset);

  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);
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
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1.5;
    controls.maxDistance = 25;
    controls.maxPolarAngle = Math.PI / 1.5;
    controls.target.set(0, 0.2, 0);
    controlsRef.current = controls;
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load("/brown_photostudio_02_4k.hdr", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      if (sceneRef.current) {
        sceneRef.current.environment = texture;
        envMapTextureRef.current = texture;
      }
    });
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

    const ssaoPassInstance = new SSAOPass(
      scene,
      camera,
      currentMount.clientWidth,
      currentMount.clientHeight
    );
    ssaoPassInstance.kernelRadius = 0.8;
    ssaoPassInstance.minDistance = 0.002;
    ssaoPassInstance.maxDistance = 0.05;
    composer.addPass(ssaoPassInstance);
    ssaoPassRef.current = ssaoPassInstance;

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
          (p) => p instanceof SSAOPass
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
        const curSettings = settings;
        const curPresetKey = animationPresetRef.current;
        const preset = animationPresets[curPresetKey];
        if (preset) {
          const effDelta = delta * curSettings.animationSpeed;
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
            curSettings.animationSpeed;
          animationState.current.floatY =
            Math.sin(floatTime * (preset.floatSpeed || 0.0001) * 100) *
            (preset.floatAmplitude || 0);
          meshRef.current.position.y = animationState.current.floatY;
        }
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
        composerRef.current.passes.forEach((p) => {
          if (p.dispose) p.dispose();
        });
        composerRef.current = null;
      }
      if (
        ssaoPassRef.current &&
        typeof ssaoPassRef.current.dispose === "function"
      )
        ssaoPassRef.current.dispose();
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
          try {
            currentMount.removeChild(rendererRef.current.domElement);
          } catch (e) {
            console.warn("Error removing renderer DOM:", e);
          }
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
      const gradGeom = new THREE.SphereGeometry(50, 32, 32);
      const gradMat = new THREE.ShaderMaterial({
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
      skyboxMeshRef.current = new THREE.Mesh(gradGeom, gradMat);
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
      )
        light.intensity = baseIntensities[index] * settings.lightIntensity;
    });
  }, [settings.lightIntensity, isMounted]);

  // Destructure settings relevant to procedural mesh creation
  const {
    extrudeDepth,
    quality,
    shapeColor,
    materialType: procMaterialType,
  } = settings;

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
      meshRef.current = null;
    }
    let newMesh;
    if (isImportedModelDisplayed && importedModel && importedModel.scene) {
      newMesh = importedModel.scene.clone(true);
      const box = new THREE.Box3().setFromObject(newMesh);
      const center = box.getCenter(new THREE.Vector3());
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
        newMesh.position.set(0, 0, 0);
      }
      newMesh.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    } else {
      const proceduralSettings = {
        extrudeDepth,
        quality,
        shapeColor,
        materialType: procMaterialType,
        // Pass other settings if create3DShape needs them directly
        animationSpeed: settings.animationSpeed,
        lightIntensity: settings.lightIntensity,
        background: settings.background,
      };
      newMesh = create3DShape(currentShape, proceduralSettings, 1.5);
      newMesh.castShadow = true;
      newMesh.receiveShadow = true;
    }
    newMesh.position.set(0, 0, 0);
    animationState.current.floatY = 0;
    animationState.current.targetRotation.set(0, 0, 0);
    newMesh.rotation.set(0, 0, 0);
    sceneRef.current.add(newMesh);
    meshRef.current = newMesh;
  }, [
    currentShape,
    extrudeDepth,
    quality,
    shapeColor,
    procMaterialType, // Use destructured values from settings
    isMounted,
    importedModel,
    isImportedModelDisplayed,
    settings.animationSpeed,
    settings.lightIntensity,
    settings.background, // Add if create3DShape directly uses these for geometry/material
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
  }, []); // Empty deps if it only modifies refs and calls methods on refs

  const handleToggleAnimation = useCallback(() => {
    setIsAnimating((prev) => {
      const newIsAnimating = !prev;
      if (newIsAnimating) {
        const preset = animationPresets[animationPresetRef.current];
        const floatAmplitude = preset?.floatAmplitude || 0.1;
        const floatSpeed = preset?.floatSpeed || 0.001;
        // Avoid division by zero if amplitude or speed is zero
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
      return newIsAnimating;
    });
  }, []); // animationPresetRef is stable

  const handleCategorySelect = useCallback(
    (categoryId) => {
      setIsImportedModelDisplayed(false);
      setCurrentCategory(categoryId);
      setCurrentShape(shapesByCategory[categoryId][0].id);
      handleResetAnimation();
    },
    [shapesByCategory, handleResetAnimation]
  );

  const handleShapeSelect = useCallback(
    (shapeId) => {
      setIsImportedModelDisplayed(false);
      setCurrentShape(shapeId);
      handleResetAnimation();
    },
    [handleResetAnimation]
  );

  useEffect(() => {
    if (isMounted) handleResetAnimation();
  }, [animationPreset, isMounted, handleResetAnimation]);

  const handleRandomize = useCallback(() => {
    setIsImportedModelDisplayed(false);
    const randCat = categories[Math.floor(Math.random() * categories.length)];
    const randShapeList = shapesByCategory[randCat.id];
    const randShape =
      randShapeList[Math.floor(Math.random() * randShapeList.length)];
    const randPresetKey =
      Object.keys(animationPresets)[
        Math.floor(Math.random() * Object.keys(animationPresets).length)
      ];
    const randColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
    const bgKeys = Object.keys(backgroundOptions);
    const randBgKey = bgKeys[Math.floor(Math.random() * bgKeys.length)];
    const matKeys = [
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
    // setAnimationPreset will trigger its own useEffect which calls handleResetAnimation
    setAnimationPreset(randPresetKey);

    setSettings((prev) => ({
      ...prev,
      materialType: randMat,
      shapeColor: randColor,
      background: randBgKey,
      extrudeDepth: saneNumber(Math.random() * (1.0 - 0.1) + 0.1, 0.4),
      lightIntensity: saneNumber(Math.random() * (2.0 - 0.5) + 0.5, 1.0),
    }));
  }, [categories, shapesByCategory, backgroundOptions]);

  const currentShapeRef = useRef(currentShape);
  useEffect(() => {
    currentShapeRef.current = currentShape;
  }, [currentShape]);
  const currentImportedModelNameRef = useRef(importedModelName);
  useEffect(() => {
    currentImportedModelNameRef.current = importedModelName;
  }, [importedModelName]);

  const handleExportGLB = useCallback(() => {
    if (!meshRef.current || isExporting) return;
    setIsExporting(true);
    setExportProgress(0);
    const exporter = new GLTFExporter();
    let progress = 0;
    const progInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 5 + 5);
      const curProg = Math.min(progress, 95);
      setExportProgress(curProg);
      if (curProg >= 95) clearInterval(progInterval);
    }, 80);
    setTimeout(() => {
      try {
        if (!(meshRef.current instanceof THREE.Object3D))
          throw new Error("Mesh not valid Object3D.");
        const exportOptions = { binary: true };
        if (
          isImportedModelDisplayed &&
          importedModel &&
          importedModel.animations &&
          importedModel.animations.length > 0
        ) {
          exportOptions.animations = importedModel.animations;
        }

        exporter.parse(
          meshRef.current,
          (gltf) => {
            clearInterval(progInterval);
            setExportProgress(98);
            if (!(gltf instanceof ArrayBuffer)) {
              setIsExporting(false);
              setExportProgress(0);
              console.error("Exported GLTF is not ArrayBuffer");
              return;
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
            setExportProgress(100);
            setTimeout(() => setIsExporting(false), 500);
          },
          (error) => {
            clearInterval(progInterval);
            console.error("GLTFExporter.parse error:", error);
            setIsExporting(false);
            setExportProgress(0);
          },
          exportOptions
        );
      } catch (e) {
        clearInterval(progInterval);
        console.error("Error GLTF export:", e);
        setIsExporting(false);
        setExportProgress(0);
      }
    }, 100);
  }, [isExporting, meshRef, isImportedModelDisplayed, importedModel]);

  const handleSimulatedExportOBJ = useCallback(() => {
    if (isExporting) return;
    setIsExporting(true);
    setExportProgress(0);
    let p = 0;
    const i = setInterval(() => {
      p += Math.floor(Math.random() * 15 + 10);
      setExportProgress(Math.min(p, 100));
      if (p >= 100) {
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
            "# OBJ file simulated\n# Replace with actual OBJ exporter output"
          );
        document.body.appendChild(l);
        l.click();
        document.body.removeChild(l);
        setTimeout(() => setIsExporting(false), 500);
      }
    }, 150);
  }, [isExporting, isImportedModelDisplayed]);

  const handleTakeScreenshot = useCallback(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    if (composerRef.current) composerRef.current.render();

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
  }, [isImportedModelDisplayed]);

  const processImportedGltf = useCallback(
    (gltf, fileName) => {
      const nameOnly =
        fileName.split(".").slice(0, -1).join(".") || "Imported Model";
      setImportedModelName(nameOnly);
      setImportedModel({
        scene: gltf.scene,
        animations: gltf.animations || [],
      });
      setIsImportedModelDisplayed(true);
      handleResetAnimation();
      alert(`${fileName} imported! It will replace the current shape.`);
    },
    [handleResetAnimation]
  );

  const handleGlbFileSelected = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (
        file &&
        (file.name.toLowerCase().endsWith(".glb") ||
          file.name.toLowerCase().endsWith(".gltf"))
      ) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const buffer = e.target.result;
            const loader = getGltfLoader();
            loader.parse(
              buffer,
              "",
              (gltf) => processImportedGltf(gltf, file.name),
              (error) => {
                console.error("GLB Parse Error:", error);
                alert(
                  `Error parsing ${file.name}: ${
                    error.message || String(error)
                  }`
                );
              }
            );
          } catch (error) {
            console.error("GLB Read Error:", error);
            alert("Error reading file.");
          }
        };
        reader.readAsArrayBuffer(file);
        if (glbFileInputRef.current) glbFileInputRef.current.value = null;
      } else if (file) alert("Please select a .glb or .gltf file.");
    },
    [processImportedGltf]
  );

  const triggerGlbImport = useCallback(() => {
    if (glbFileInputRef.current) glbFileInputRef.current.click();
  }, []);

  const handleFileDropOnViewer = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      const files = event.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (
          file &&
          (file.name.toLowerCase().endsWith(".glb") ||
            file.name.toLowerCase().endsWith(".gltf"))
        ) {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const buffer = e.target.result;
              const loader = getGltfLoader();
              loader.parse(
                buffer,
                "",
                (gltf) => processImportedGltf(gltf, file.name),
                (error) => {
                  console.error("Dropped GLB Parse Error:", error);
                  alert(
                    `Error parsing ${file.name}: ${
                      error.message || String(error)
                    }`
                  );
                }
              );
            } catch (err) {
              console.error("Dropped GLB Read Error:", err);
              alert("Error processing dropped file.");
            }
          };
          reader.readAsArrayBuffer(file);
        } else if (file) alert("Please drop a .glb or .gltf file.");
      }
    },
    [processImportedGltf]
  );

  if (!isMounted) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-900 text-white'>
        <p>Loading 3D Studio...</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-3 sm:p-4 md:p-6 text-white select-none'>
      <input
        type='file'
        accept='.glb,.gltf'
        ref={glbFileInputRef}
        onChange={handleGlbFileSelected}
        style={{ display: "none" }}
      />
      <div className='max-w-screen-xl mx-auto'>
        <header className='text-center mb-6 sm:mb-8'>
          <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent'>
            3D Shape Studio Pro
          </h1>
          <p className='text-slate-300 text-sm sm:text-base max-w-2xl mx-auto'>
            Explore, customize, and animate 3D shapes. Import your own GLB/GLTF
            models!
          </p>
        </header>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6'>
          <div className='lg:col-span-1 space-y-4 sm:space-y-5 order-last lg:order-first'>
            {!isImportedModelDisplayed && (
              <>
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
              </>
            )}
            {isImportedModelDisplayed && importedModel && (
              <div className='bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/70 shadow-lg text-center'>
                <h3 className='text-lg font-semibold text-white mb-2'>
                  Current Model
                </h3>
                <p
                  className='text-sm text-slate-300 truncate'
                  title={importedModelName}
                >
                  {importedModelName}
                </p>
                <button
                  onClick={() => {
                    setImportedModel(null);
                    setIsImportedModelDisplayed(false);
                    setImportedModelName("Imported Model");
                    const defaultCategoryId = categories[0].id;
                    const defaultShapes = shapesByCategory[defaultCategoryId];
                    setCurrentCategory(defaultCategoryId);
                    setCurrentShape(defaultShapes[0].id);
                    handleResetAnimation();
                  }}
                  className='mt-3 text-xs bg-red-500 hover:bg-red-600 text-white py-1.5 px-4 rounded-md flex items-center justify-center gap-1.5 w-full'
                >
                  <XCircle size={14} /> Clear Imported
                </button>
              </div>
            )}
            <AnimationControls
              isAnimating={isAnimating}
              onToggleAnimation={handleToggleAnimation}
              onResetAnimation={handleResetAnimation}
              animationPreset={animationPreset}
              onPresetChange={setAnimationPreset}
              onRandomize={handleRandomize}
            />
            <FileControls
              onExportGLB={handleExportGLB}
              onExportOBJ={handleSimulatedExportOBJ}
              onTakeScreenshot={handleTakeScreenshot}
              isExporting={isExporting}
              exportProgress={exportProgress}
              onImportGLB={triggerGlbImport}
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
            onDropFile={handleFileDropOnViewer}
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
            © {new Date().getFullYear()} 3D Shape Studio Pro. Interactive 3D
            Viewer.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ModelViewer3D;
