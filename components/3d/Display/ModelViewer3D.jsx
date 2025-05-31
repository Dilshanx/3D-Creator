import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  Suspense,
  useLayoutEffect,
} from "react";
import * as THREE from "three";

import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Text3D,
  Center,
  OrbitControls as DreiOrbitControls,
  Environment,
  useTexture,
  Grid,
  Loader as DreiLoader,
  useProgress,
  Text,
  Plane,
  MeshReflectorMaterial,
} from "@react-three/drei";
import { EffectComposer, N8AO, Bloom } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";

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
  Type,
  Palette,
  LayersIcon,
  SunMedium,
  Zap,
  Sparkles,
  Grid as GridIcon,
  Disc3,
  Square,
  Orbit,
  SlidersHorizontal,
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
import { ScrollArea } from "@/components/ui/scroll-area";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const saneNumber = (value, defaultValue = 0) => {
  const num = Number(value);
  return isNaN(num) || !isFinite(num) ? defaultValue : num;
};

// --- SHAPE CREATION FUNCTIONS (UNCHANGED) ---
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
const createLightningBoltShape = (size = 1) => {
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
const CATEGORIES_DATA = [
  { id: "animals", name: "Animals", icon: "🐱" },
  { id: "sports", name: "Sports", icon: "⚽" },
  { id: "people", name: "People", icon: "👤" },
  { id: "objects", name: "Objects", icon: "📱" },
];
const SHAPES_BY_CATEGORY_DATA = {
  animals: [
    { id: "cat", name: "Cat", icon: "🐱", autoMaterial: "organic" },
    { id: "bird", name: "Bird", icon: "🐦", autoMaterial: "organic" },
    { id: "fish", name: "Fish", icon: "🐟", autoMaterial: "metallic" },
  ],
  sports: [
    { id: "soccer", name: "Soccer", icon: "⚽", autoMaterial: "plastic" },
    { id: "tennis", name: "Tennis", icon: "🎾", autoMaterial: "plastic" },
    {
      id: "basketball",
      name: "Basketball",
      icon: "🏀",
      autoMaterial: "plastic",
    },
  ],
  people: [
    { id: "person", name: "Person", icon: "👤", autoMaterial: "organic" },
    { id: "robot", name: "Robot", icon: "🤖", autoMaterial: "metallic" },
  ],
  objects: [
    { id: "phone", name: "Phone", icon: "📱", autoMaterial: "glass" },
    { id: "lightning", name: "Lightning", icon: "⚡", autoMaterial: "neon" },
    { id: "music", name: "Music Note", icon: "🎵", autoMaterial: "metallic" },
  ],
};
const BACKGROUND_OPTIONS_DATA = {
  modernGradient: "Modern Gradient",
  darkSpace: "Dark Space",
  softLight: "Soft Light",
  studioDark: "Studio Dark",
  studioLight: "Studio Light",
  solidColor: "Solid Color",
  customImage: "Custom Image",
};
const GROUND_PLANE_OPTIONS_DATA = {
  none: "None",
  grid: "Grid",
  reflectiveFloor: "Reflective Floor",
};

const initialSettings = {
  materialType: "auto",
  shapeColor: "#a78bfa",
  animationSpeed: 1.0,
  extrudeDepth: 0.4,
  quality: "medium",
  background: "studioDark",
  solidBackgroundColor: "#333333",
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
    envMapIntensity: 1.0,
  },
  textFontUrl: "/fonts/helvetiker_regular.typeface.json",
  textColor: "#E0E0E0",
  textSize: 0.5,
  textDepth: 0.05,
  textMaterialType: "ceramic",
  textCustomMaterialProperties: {
    roughness: 0.6,
    metalness: 0.3,
    mapUrl: null,
    normalMapUrl: null,
    envMapIntensity: 1.0,
  },
  n8ao: {
    enabled: true,
    aoRadius: 0.5,
    intensity: 1.5,
    distanceFalloff: 1.0,
    screenSpaceRadius: true,
    quality: "medium",
    halfRes: false,
    color: "#000000",
  },
  bloom: {
    enabled: false,
    intensity: 1,
    luminanceThreshold: 0.8,
    luminanceSmoothing: 0.025,
    kernelSize: KernelSize.LARGE,
  },
  autoRotate: false,
  autoRotateSpeed: 0.5,
  groundPlaneType: "grid",
};

let helvetikerFontForExport = null;
const DEFAULT_FONT_PATH = "/fonts/helvetiker_regular.typeface.json";
if (typeof window !== "undefined") {
  const clientPreloaderFontLoader = new FontLoader();
  clientPreloaderFontLoader.load(
    DEFAULT_FONT_PATH,
    (font) => {
      helvetikerFontForExport = font;
      console.log("Default font pre-loaded.");
    },
    undefined,
    (err) => console.error("Failed to pre-load default font:", err)
  );
}

function createR3FMaterialProps(
  baseColor,
  materialType = "standard",
  customProps = {},
  envMap
) {
  const colorInput = new THREE.Color(baseColor);
  let presetKey = materialType;
  if (materialType === "auto") {
    presetKey = "ceramic";
  }
  let preset = baseMaterialPresets[presetKey] || baseMaterialPresets.ceramic;
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
  finalProps.envMapIntensity =
    customProps.envMapIntensity !== null &&
    customProps.envMapIntensity !== undefined
      ? customProps.envMapIntensity
      : preset.envMapIntensity ?? 1.0;
  let materialEffectiveBaseColor = colorInput;
  if (
    customProps.mapUrl &&
    typeof customProps.mapUrl === "string" &&
    customProps.mapUrl.trim() !== ""
  ) {
    materialEffectiveBaseColor = new THREE.Color(0xffffff);
  }
  if (finalProps.useEmissive) {
    const hasEmissiveMap =
      customProps.emissiveMapUrl &&
      typeof customProps.emissiveMapUrl === "string" &&
      customProps.emissiveMapUrl.trim() !== "";
    finalProps.emissive = new THREE.Color(
      hasEmissiveMap ? 0xffffff : colorInput
    );
    if (!hasEmissiveMap && finalProps.emissive) {
      finalProps.emissive.multiplyScalar(0.8);
    }
  }
  const materialConstructor =
    presetKey === "glass" || presetKey === "crystal"
      ? THREE.MeshPhysicalMaterial
      : THREE.MeshStandardMaterial;
  const sharedArgs = {
    color: materialEffectiveBaseColor,
    metalness: finalProps.metalness,
    roughness: finalProps.roughness,
    envMap: envMap,
    envMapIntensity: finalProps.envMapIntensity,
    side: THREE.DoubleSide,
    ...((presetKey === "glass" || presetKey === "crystal") && {
      transmission: finalProps.transmission,
      thickness: finalProps.thickness,
      ior: finalProps.ior,
      transparent: true,
      opacity: finalProps.opacity ?? 0.85,
    }),
    ...(finalProps.useEmissive && {
      emissive: finalProps.emissive,
      emissiveIntensity: finalProps.emissiveIntensity,
    }),
  };
  const textureUrls = {};
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
    if (
      customProps[urlKey] &&
      typeof customProps[urlKey] === "string" &&
      customProps[urlKey].trim() !== ""
    ) {
      textureUrls[urlKey] = customProps[urlKey];
    }
  });
  return {
    constructor: materialConstructor,
    args: sharedArgs,
    textureUrls: textureUrls,
  };
}

const TextureLoaderInternal = ({ urls, onLoaded }) => {
  const loadedTextures = useTexture(urls);
  useEffect(() => {
    onLoaded(loadedTextures);
  }, [loadedTextures, onLoaded]);
  return null;
};
const AppliedMaterial = React.memo(
  ({
    materialProps = {
      constructor: THREE.MeshStandardMaterial,
      args: { color: "gray" },
    },
    textureUrls = {},
  }) => {
    const validUrlsToLoad = useMemo(
      () =>
        Object.fromEntries(
          Object.entries(textureUrls).filter(
            ([, value]) =>
              value && typeof value === "string" && value.trim() !== ""
          )
        ),
      [textureUrls]
    );
    const hasValidUrls = Object.keys(validUrlsToLoad).length > 0;

    const [internallyLoadedTextures, setInternallyLoadedTextures] =
      useState(null);
    const [effectiveUrls, setEffectiveUrls] = useState(null);

    const handleTexturesLoaded = useCallback((loaded) => {
      setInternallyLoadedTextures(loaded);
    }, []);

    useEffect(() => {
      const timerId = setTimeout(() => {
        if (hasValidUrls) {
          setEffectiveUrls(validUrlsToLoad);
        } else {
          setEffectiveUrls(null);
        }
      }, 0);

      return () => clearTimeout(timerId);
    }, [validUrlsToLoad, hasValidUrls]);

    useEffect(() => {
      if (effectiveUrls === null) {
        setInternallyLoadedTextures(null);
      }
    }, [effectiveUrls]);

    const texturesToApplyToMaterial = useMemo(() => {
      const newTextures = {};
      if (
        effectiveUrls &&
        Object.keys(effectiveUrls).length > 0 &&
        internallyLoadedTextures
      ) {
        Object.keys(effectiveUrls).forEach((originalUrlKey) => {
          const textureObject = internallyLoadedTextures[originalUrlKey];
          if (textureObject?.isTexture) {
            newTextures[originalUrlKey.replace("Url", "")] = textureObject;
          }
        });
      }
      return newTextures;
    }, [effectiveUrls, internallyLoadedTextures]);

    useEffect(() => {
      if (texturesToApplyToMaterial.map?.isTexture) {
        texturesToApplyToMaterial.map.colorSpace = THREE.SRGBColorSpace;
      }
      if (texturesToApplyToMaterial.emissiveMap?.isTexture) {
        texturesToApplyToMaterial.emissiveMap.colorSpace = THREE.SRGBColorSpace;
      }
      Object.values(texturesToApplyToMaterial).forEach((tex) => {
        if (tex?.isTexture) {
          tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
          tex.needsUpdate = true;
        }
      });
    }, [texturesToApplyToMaterial]);

    const safeMaterialArgs = materialProps?.args || {
      color: new THREE.Color("magenta"),
    };
    const MaterialConstructor =
      materialProps?.constructor || THREE.MeshStandardMaterial;
    const allArgsForMaterialComponent = {
      ...safeMaterialArgs,
      ...texturesToApplyToMaterial,
    };

    return (
      <>
        {effectiveUrls && Object.keys(effectiveUrls).length > 0 && (
          <Suspense fallback={null}>
            {" "}
            <TextureLoaderInternal
              key={JSON.stringify(effectiveUrls)}
              urls={effectiveUrls}
              onLoaded={handleTexturesLoaded}
            />{" "}
          </Suspense>
        )}
        {MaterialConstructor === THREE.MeshPhysicalMaterial ? (
          <meshPhysicalMaterial {...allArgsForMaterialComponent} />
        ) : (
          <meshStandardMaterial {...allArgsForMaterialComponent} />
        )}
      </>
    );
  }
);
AppliedMaterial.displayName = "AppliedMaterial";

const ProceduralShape = React.memo(
  React.forwardRef(
    (
      {
        shapeId,
        settings,
        size,
        animationPresetKey,
        isAnimating,
        isAutoRotating,
        autoRotateSpeed,
      },
      ref
    ) => {
      const { scene } = useThree();
      const internalMeshRef = useRef();
      React.useImperativeHandle(ref, () => internalMeshRef.current);
      const geometry = useMemo(() => {
        const shapeConfigs = {
          cat: { creator: createCatShape },
          bird: { creator: createBirdShape },
          fish: { creator: createFishShape },
          soccer: { creator: createSoccerBallShape },
          tennis: { creator: createTennisRacketShape },
          basketball: { creator: createBasketballShape },
          person: { creator: createPersonShape },
          robot: { creator: createRobotShape },
          phone: { creator: createPhoneShape },
          lightning: { creator: createLightningBoltShape },
          music: { creator: createMusicNoteShape },
        };
        let config = shapeConfigs[shapeId] || shapeConfigs.cat;
        const shapeSizeVal = saneNumber(size, 1.5);
        const proceduralShape = config.creator(shapeSizeVal);
        const extrudeSettings = {
          depth: saneNumber(settings.extrudeDepth, 0.4),
          bevelEnabled: true,
          bevelSegments:
            settings.quality === "high"
              ? 10
              : settings.quality === "medium"
              ? 6
              : 3,
          steps:
            settings.quality === "high"
              ? 5
              : settings.quality === "medium"
              ? 3
              : 1,
          bevelSize: saneNumber(0.035 * (shapeSizeVal / 1.5), 0.02),
          bevelThickness: saneNumber(0.025 * (shapeSizeVal / 1.5), 0.015),
          curveSegments:
            settings.quality === "high"
              ? 48
              : settings.quality === "medium"
              ? 24
              : 12,
        };
        const geom = new THREE.ExtrudeGeometry(
          proceduralShape,
          extrudeSettings
        );
        geom.computeVertexNormals();
        geom.center();
        return geom;
      }, [shapeId, settings.extrudeDepth, settings.quality, size]);
      const { materialDef, textureUrlsToLoad } = useMemo(() => {
        let autoMaterialType = "ceramic";
        const shapeData = Object.values(SHAPES_BY_CATEGORY_DATA)
          .flat()
          .find((s) => s.id === shapeId);
        if (shapeData?.autoMaterial) {
          autoMaterialType = shapeData.autoMaterial;
        }
        const materialTypeForPreset =
          settings.materialType === "auto"
            ? autoMaterialType
            : settings.materialType;
        const propsFromCreator = createR3FMaterialProps(
          settings.shapeColor,
          materialTypeForPreset,
          settings.customMaterialProperties,
          scene.environment
        );
        return {
          materialDef: {
            constructor: propsFromCreator.constructor,
            args: propsFromCreator.args,
          },
          textureUrlsToLoad: propsFromCreator.textureUrls,
        };
      }, [
        settings.shapeColor,
        settings.materialType,
        settings.customMaterialProperties,
        shapeId,
        scene.environment,
      ]);
      const animationState = useRef({
        rotation: new THREE.Euler(),
        targetRotation: new THREE.Euler(),
        floatY: 0,
        startTime: Date.now(),
      });
      useFrame((_, delta) => {
        if (internalMeshRef.current) {
          if (isAnimating && !isAutoRotating) {
            const animSettings = settings;
            const preset = animationPresets[animationPresetKey];
            if (preset) {
              const effDelta = delta * animSettings.animationSpeed;
              animationState.current.targetRotation.x +=
                (preset.rotationSpeed?.[0] || 0) * 60 * effDelta;
              animationState.current.targetRotation.y +=
                (preset.rotationSpeed?.[1] || 0) * 60 * effDelta;
              animationState.current.targetRotation.z +=
                (preset.rotationSpeed?.[2] || 0) * 60 * effDelta;
              internalMeshRef.current.rotation.x = THREE.MathUtils.lerp(
                internalMeshRef.current.rotation.x,
                animationState.current.targetRotation.x,
                0.1
              );
              internalMeshRef.current.rotation.y = THREE.MathUtils.lerp(
                internalMeshRef.current.rotation.y,
                animationState.current.targetRotation.y,
                0.1
              );
              internalMeshRef.current.rotation.z = THREE.MathUtils.lerp(
                internalMeshRef.current.rotation.z,
                animationState.current.targetRotation.z,
                0.1
              );
              const floatTime =
                (Date.now() - animationState.current.startTime) *
                0.001 *
                animSettings.animationSpeed;
              animationState.current.floatY =
                Math.sin(floatTime * (preset.floatSpeed || 0) * 100) *
                (preset.floatAmplitude || 0);
              internalMeshRef.current.position.y =
                animationState.current.floatY;
            }
          }
          if (isAutoRotating) {
            internalMeshRef.current.rotation.y += delta * autoRotateSpeed * 0.5;
          }
        }
      });
      return (
        <Center ref={internalMeshRef} castShadow receiveShadow>
          <mesh geometry={geometry} castShadow receiveShadow>
            <Suspense
              fallback={<meshStandardMaterial color='gray' wireframe />}
            >
              <AppliedMaterial
                materialProps={materialDef}
                textureUrls={textureUrlsToLoad}
              />
            </Suspense>
          </mesh>
        </Center>
      );
    }
  )
);
ProceduralShape.displayName = "ProceduralShape";

const ImportedModel = React.memo(
  React.forwardRef(
    (
      {
        modelUrl,
        fileType,
        mtlUrl,
        settings,
        onModelLoad,
        isAnimating,
        animationPresetKey,
        activeActionRef,
        mixerRef,
        selectedAnimationClipIndex,
        animationPlaybackState,
        isAnimationLooping,
        animationPlaybackSpeed,
        animationTime,
        forceMaterialResetKey,
        isAutoRotating,
        autoRotateSpeed,
        playAllAnimations,
      },
      ref
    ) => {
      const internalGroupRef = useRef();
      const { scene: r3fScene } = useThree();
      React.useImperativeHandle(ref, () => internalGroupRef.current);
      const [manualGltfScene, setManualGltfScene] = useState(null);
      const [manualGltfAnimations, setManualGltfAnimations] = useState([]);
      const [manualFbxScene, setManualFbxScene] = useState(null);
      const [manualFbxAnimations, setManualFbxAnimations] = useState([]);
      const [manualObjScene, setManualObjScene] = useState(null);
      const [manualStlGeometry, setManualStlGeometry] = useState(null);
      const [modelInitiallyProcessed, setModelInitiallyProcessed] =
        useState(false);
      const lastProcessedModelID = useRef(null);
      const dracoPath = "/draco/gltf/";
      const modelAnimationState = useRef({ startTime: Date.now() });
      const textureUrlsToLoadFromSettings = useMemo(() => {
        const customProps = settings.customMaterialProperties || {};
        const urls = {};
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
          if (
            customProps[urlKey] &&
            typeof customProps[urlKey] === "string" &&
            customProps[urlKey].trim() !== ""
          ) {
            urls[urlKey] = customProps[urlKey];
          }
        });
        return urls;
      }, [settings.customMaterialProperties]);
      const r3fManagedTextures = useTexture(textureUrlsToLoadFromSettings);
      useEffect(() => {
        let targetObject = null;
        let currentModelID = modelUrl;
        if ((fileType === "glb" || fileType === "gltf") && manualGltfScene)
          targetObject = manualGltfScene;
        else if (fileType === "fbx" && manualFbxScene)
          targetObject = manualFbxScene;
        else if (fileType === "obj" && manualObjScene)
          targetObject = manualObjScene;
        else if (
          fileType === "stl" &&
          manualStlGeometry &&
          internalGroupRef.current?.children[0]?.geometry === manualStlGeometry
        )
          targetObject = internalGroupRef.current;
        if (
          targetObject &&
          (currentModelID !== lastProcessedModelID.current ||
            !modelInitiallyProcessed)
        ) {
          let boxSource = targetObject;
          if (fileType === "stl" && targetObject.children[0]?.isMesh)
            boxSource = targetObject.children[0];
          let box = new THREE.Box3().setFromObject(boxSource);
          if (box.isEmpty()) {
            boxSource.traverse((child) => {
              if (child.isMesh) {
                const childBox = new THREE.Box3().setFromObject(child);
                if (!childBox.isEmpty()) {
                  if (box.isEmpty()) box.copy(childBox);
                  else box.expandByObject(child);
                }
              }
            });
            if (box.isEmpty()) {
              targetObject.scale.setScalar(1);
              targetObject.position.set(0, 0, 0);
            }
          }
          if (!box.isEmpty()) {
            const sizeVec = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(
              saneNumber(sizeVec.x, 1),
              saneNumber(sizeVec.y, 1),
              saneNumber(sizeVec.z, 1)
            );
            const scaleFactor = maxDim > 0 ? 3 / maxDim : 1;
            targetObject.scale.setScalar(saneNumber(scaleFactor, 1));
            const scaledBox = new THREE.Box3().setFromObject(targetObject);
            const center = scaledBox.getCenter(new THREE.Vector3());
            if (!isNaN(center.x)) targetObject.position.sub(center);
            else targetObject.position.set(0, 0, 0);
          }
          lastProcessedModelID.current = currentModelID;
          setModelInitiallyProcessed(true);
        } else if (!targetObject) {
          setModelInitiallyProcessed(false);
          lastProcessedModelID.current = null;
        }
      }, [
        manualGltfScene,
        manualFbxScene,
        manualObjScene,
        manualStlGeometry,
        fileType,
        modelUrl,
        modelInitiallyProcessed,
      ]);
      const applyMaterialsOnly = useCallback(
        (objectToTraverse, animations, availableTextures) => {
          if (!objectToTraverse) {
            onModelLoad(null, animations || []);
            return;
          }
          const customMaterialProps = settings.customMaterialProperties || {};
          const anyCustomTexMap =
            Object.keys(textureUrlsToLoadFromSettings).length > 0;
          const userSelectedSpecificMaterialType =
            settings.materialType !== "auto";
          const shouldApplyOurMaterial =
            fileType === "stl" ||
            (fileType === "obj" && !mtlUrl) ||
            anyCustomTexMap ||
            ((fileType === "gltf" ||
              fileType === "glb" ||
              fileType === "fbx" ||
              (fileType === "obj" && mtlUrl)) &&
              userSelectedSpecificMaterialType);
          if (shouldApplyOurMaterial) {
            let materialTypeForLogic = settings.materialType;
            if (
              settings.materialType === "auto" &&
              (anyCustomTexMap ||
                fileType === "stl" ||
                (fileType === "obj" && !mtlUrl))
            )
              materialTypeForLogic = "ceramic";
            else if (settings.materialType === "auto")
              materialTypeForLogic = "ceramic";
            const { constructor: MatCtor, args: baseMatArgs } =
              createR3FMaterialProps(
                settings.shapeColor,
                materialTypeForLogic,
                customMaterialProps,
                r3fScene.environment
              );
            const meshesToProcess = [];
            if (objectToTraverse.isMesh) meshesToProcess.push(objectToTraverse);
            else
              objectToTraverse.traverse((child) => {
                if (child.isMesh) meshesToProcess.push(child);
              });
            meshesToProcess.forEach((mesh) => {
              mesh.castShadow = true;
              mesh.receiveShadow = true;
              const newMaterial = new MatCtor(baseMatArgs);
              for (const mapName of [
                "map",
                "normalMap",
                "roughnessMap",
                "metalnessMap",
                "aoMap",
                "emissiveMap",
              ]) {
                const urlKey = `${mapName}Url`;
                if (
                  availableTextures[urlKey] &&
                  availableTextures[urlKey].isTexture
                ) {
                  let tex = availableTextures[urlKey];
                  if (mapName === "map" || mapName === "emissiveMap")
                    tex.colorSpace = THREE.SRGBColorSpace;
                  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
                  newMaterial[mapName] = tex;
                }
              }
              if (mesh.material?.dispose && mesh.material !== newMaterial)
                mesh.material.dispose();
              mesh.material = newMaterial;
              newMaterial.needsUpdate = true;
            });
          } else if (fileType !== "stl") {
            objectToTraverse.traverse((child) => {
              if (child.isMesh && child.material) {
                const materials = Array.isArray(child.material)
                  ? child.material
                  : [child.material];
                materials.forEach((mat) => {
                  mat.side = THREE.DoubleSide;
                  if (!mat.envMap && r3fScene.environment)
                    mat.envMap = r3fScene.environment;
                  const envIS = customMaterialProps.envMapIntensity;
                  mat.envMapIntensity =
                    envIS !== null && envIS !== undefined
                      ? envIS
                      : mat.envMapIntensity ?? 1.0;
                  mat.needsUpdate = true;
                });
              }
            });
          }
          onModelLoad(objectToTraverse, animations || []);
        },
        [
          r3fScene.environment,
          settings.shapeColor,
          settings.materialType,
          settings.customMaterialProperties,
          textureUrlsToLoadFromSettings,
          onModelLoad,
          fileType,
          mtlUrl,
        ]
      );
      useEffect(() => {
        setManualGltfScene(null);
        setManualGltfAnimations([]);
        if ((fileType === "glb" || fileType === "gltf") && modelUrl) {
          const l = new GLTFLoader();
          const d = new DRACOLoader();
          d.setDecoderPath(dracoPath);
          l.setDRACOLoader(d);
          l.load(
            modelUrl,
            (g) => {
              setManualGltfScene(g.scene);
              setManualGltfAnimations(g.animations || []);
            },
            undefined,
            (e) => {
              console.error("GLTF Load Error:", e);
              sonnerToast.error("GLTF Load Error");
              onModelLoad(null, []);
            }
          );
          return () => d.dispose();
        }
      }, [fileType, modelUrl, dracoPath, onModelLoad]);
      useEffect(() => {
        setManualFbxScene(null);
        setManualFbxAnimations([]);
        if (fileType === "fbx" && modelUrl) {
          const l = new FBXLoader();
          l.load(
            modelUrl,
            (f) => {
              setManualFbxScene(f);
              setManualFbxAnimations(f.animations || []);
            },
            undefined,
            (e) => {
              console.error("FBX Load Error:", e);
              sonnerToast.error("FBX Load Error");
              onModelLoad(null, []);
            }
          );
        }
      }, [fileType, modelUrl, onModelLoad]);
      useEffect(() => {
        setManualObjScene(null);
        if (fileType === "obj" && modelUrl) {
          const oL = new OBJLoader();
          if (mtlUrl) {
            const mL = new MTLLoader();
            mL.setResourcePath(
              mtlUrl.substring(0, mtlUrl.lastIndexOf("/") + 1)
            );
            mL.load(
              mtlUrl,
              (m) => {
                m.preload();
                oL.setMaterials(m);
                oL.load(
                  modelUrl,
                  (o) => setManualObjScene(o),
                  undefined,
                  (e) => {
                    console.error("OBJ w/ MTL Error:", e);
                    sonnerToast.error("OBJ Load Error");
                    onModelLoad(null, []);
                  }
                );
              },
              undefined,
              () => {
                sonnerToast.warn(
                  "MTL Load Failed. Loading OBJ without materials."
                );
                oL.load(
                  modelUrl,
                  (o) => setManualObjScene(o),
                  undefined,
                  (e) => {
                    console.error("OBJ Error (after MTL fail):", e);
                    sonnerToast.error("OBJ Load Error");
                    onModelLoad(null, []);
                  }
                );
              }
            );
          } else {
            oL.load(
              modelUrl,
              (o) => setManualObjScene(o),
              undefined,
              (e) => {
                console.error("OBJ Error:", e);
                sonnerToast.error("OBJ Load Error");
                onModelLoad(null, []);
              }
            );
          }
        }
      }, [fileType, modelUrl, mtlUrl, onModelLoad]);
      useEffect(() => {
        setManualStlGeometry(null);
        if (fileType === "stl" && modelUrl) {
          const l = new STLLoader();
          l.load(
            modelUrl,
            (g) => setManualStlGeometry(g),
            undefined,
            (e) => {
              console.error("STL Error:", e);
              sonnerToast.error("STL Load Error");
              onModelLoad(null, []);
            }
          );
        }
      }, [fileType, modelUrl, onModelLoad]);
      useLayoutEffect(() => {
        let modelRootObject = null;
        let animations = [];
        if ((fileType === "glb" || fileType === "gltf") && manualGltfScene) {
          modelRootObject = manualGltfScene;
          animations = manualGltfAnimations;
        } else if (fileType === "fbx" && manualFbxScene) {
          modelRootObject = manualFbxScene;
          animations = manualFbxAnimations;
        } else if (fileType === "obj" && manualObjScene) {
          modelRootObject = manualObjScene;
        } else if (
          fileType === "stl" &&
          manualStlGeometry &&
          internalGroupRef.current
        ) {
          modelRootObject = internalGroupRef.current;
        }
        if (modelRootObject && modelInitiallyProcessed && r3fManagedTextures) {
          applyMaterialsOnly(modelRootObject, animations, r3fManagedTextures);
        } else if (!modelRootObject && modelUrl) {
          if (
            !manualGltfScene &&
            !manualFbxScene &&
            !manualObjScene &&
            !manualStlGeometry
          ) {
            onModelLoad(null, []);
          }
        } else if (!modelUrl) {
          onModelLoad(null, []);
        }
      }, [
        modelUrl,
        modelInitiallyProcessed,
        manualGltfScene,
        manualFbxScene,
        manualObjScene,
        manualStlGeometry,
        fileType,
        manualGltfAnimations,
        manualFbxAnimations,
        r3fManagedTextures,
        applyMaterialsOnly,
        forceMaterialResetKey,
        onModelLoad,
      ]);
      useEffect(() => {
        const modelRoot = internalGroupRef.current;
        let clips = [];
        if (modelUrl) {
          if (fileType === "glb" || fileType === "gltf")
            clips = manualGltfAnimations || [];
          else if (fileType === "fbx") clips = manualFbxAnimations || [];
        }
        if (mixerRef.current) {
          mixerRef.current.stopAllAction();
        }
        activeActionRef.current = null;
        mixerRef.current = null;
        if (modelRoot && clips.length > 0) {
          mixerRef.current = new THREE.AnimationMixer(modelRoot);
          if (playAllAnimations) {
            clips.forEach((clip) => {
              const action = mixerRef.current.clipAction(clip);
              action.setLoop(
                isAnimationLooping ? THREE.LoopRepeat : THREE.LoopOnce,
                Infinity
              );
              action.timeScale = animationPlaybackSpeed;
              action.time =
                clip.duration > 0 ? animationTime * clip.duration : 0;
              if (animationPlaybackState === "playing") action.play();
              else if (animationPlaybackState === "paused") {
                action.play();
                action.paused = true;
                if (mixerRef.current && action.time === 0)
                  mixerRef.current.update(0);
              } else {
                action.stop();
                if (mixerRef.current) mixerRef.current.update(0);
              }
            });
          } else {
            if (
              selectedAnimationClipIndex >= 0 &&
              selectedAnimationClipIndex < clips.length
            ) {
              const clip = clips[selectedAnimationClipIndex];
              const action = mixerRef.current.clipAction(clip);
              action.setLoop(
                isAnimationLooping ? THREE.LoopRepeat : THREE.LoopOnce,
                Infinity
              );
              action.timeScale = animationPlaybackSpeed;
              action.time =
                clip.duration > 0 ? animationTime * clip.duration : 0;
              if (animationPlaybackState === "playing") action.play();
              else if (animationPlaybackState === "paused") {
                action.play();
                action.paused = true;
                if (mixerRef.current && action.time === 0)
                  mixerRef.current.update(0);
              } else {
                action.stop();
                if (mixerRef.current) mixerRef.current.update(0);
              }
              activeActionRef.current = action;
            }
          }
        }
        return () => {
          if (mixerRef.current) {
            mixerRef.current.stopAllAction();
          }
        };
      }, [
        modelUrl,
        fileType,
        manualGltfAnimations,
        manualFbxAnimations,
        playAllAnimations,
        selectedAnimationClipIndex,
        animationPlaybackState,
        isAnimationLooping,
        animationPlaybackSpeed,
        animationTime,
      ]);
      useFrame((_, delta) => {
        const n = internalGroupRef.current;
        if (!n) return;
        if (mixerRef.current && animationPlaybackState !== "stopped") {
          mixerRef.current.update(
            delta *
              (animationPlaybackState === "playing"
                ? animationPlaybackSpeed
                : 0)
          );
        } else if (
          isAnimating &&
          !isAutoRotating &&
          !(mixerRef.current && animationPlaybackState !== "stopped")
        ) {
          const p = animationPresets[animationPresetKey];
          if (p) {
            const t =
              (Date.now() - modelAnimationState.current.startTime) *
              0.001 *
              settings.animationSpeed;
            n.position.y =
              Math.sin(t * (p.floatSpeed || 0) * 100) * (p.floatAmplitude || 0);
          }
        }
        if (isAutoRotating) {
          n.rotation.y += delta * autoRotateSpeed * 0.5;
        }
      });
      if (fileType === "stl") {
        if (manualStlGeometry)
          return (
            <group ref={internalGroupRef}>
              <mesh geometry={manualStlGeometry} castShadow receiveShadow />
            </group>
          );
        return (
          <group ref={internalGroupRef}>
            <Center>
              <Text color='white' fontSize={0.2}>
                Loading STL...
              </Text>
            </Center>
          </group>
        );
      }
      let objectToRender = null;
      if ((fileType === "glb" || fileType === "gltf") && manualGltfScene)
        objectToRender = manualGltfScene;
      else if (fileType === "fbx" && manualFbxScene)
        objectToRender = manualFbxScene;
      else if (fileType === "obj" && manualObjScene)
        objectToRender = manualObjScene;
      if (objectToRender && modelInitiallyProcessed)
        return (
          <primitive
            object={objectToRender}
            ref={internalGroupRef}
            castShadow
            receiveShadow
          />
        );
      return (
        <group ref={internalGroupRef}>
          <Center>
            <Text color='white' fontSize={0.2}>
              Loading ({fileType ? fileType.toUpperCase() : "..."})...
            </Text>
          </Center>
        </group>
      );
    }
  )
);
ImportedModel.displayName = "ImportedModel";

const TextOverlay = React.memo(
  ({
    text,
    fontUrl,
    size,
    depth,
    isVisible,
    textYOffset,
    materialProps,
    textureUrls,
  }) => {
    if (!isVisible || !text || !fontUrl) return null;

    const appliedMaterialKey = useMemo(() => {
      return JSON.stringify({ args: materialProps?.args, urls: textureUrls });
    }, [materialProps?.args, textureUrls]);

    return (
      <group position={[0, textYOffset, 0]}>
        <Center>
          <Text3D
            font={fontUrl}
            size={saneNumber(size, 0.5)}
            height={saneNumber(depth, 0.05)}
            curveSegments={12}
            bevelEnabled
            bevelThickness={saneNumber(0.02 * (size / 0.5), 0.01)}
            bevelSize={saneNumber(0.01 * (size / 0.5), 0.005)}
            castShadow
            receiveShadow
          >
            {text}
            <Suspense
              fallback={<meshStandardMaterial color='gray' wireframe />}
            >
              <AppliedMaterial
                key={appliedMaterialKey}
                materialProps={materialProps}
                textureUrls={textureUrls}
              />
            </Suspense>
          </Text3D>
        </Center>
      </group>
    );
  }
);
TextOverlay.displayName = "TextOverlay";

const SceneContentInternal = React.memo(
  ({
    settings,
    currentShape,
    animationPresetKey,
    isAnimating,
    importedModelUrl,
    importedFileType,
    importedMtlUrl,
    onModelLoad,
    isImportedModelDisplayed,
    current3DText,
    isTextVisible,
    customBgImageUrl,
    onMeshReady,
    onSceneRefForExport,
    activeActionRef,
    mixerRef,
    selectedAnimationClipIndex,
    animationPlaybackState,
    isAnimationLooping,
    animationPlaybackSpeed,
    animationTime,
    forceMaterialResetKey,
    sceneRefreshTrigger,
    playAllAnimations,
    forwardedOrbitControlsRef,
    textMaterialDef,
    textTextureUrlsToLoad,
  }) => {
    const { scene, gl, camera, controls: controlsFromUseThree } = useThree();
    const internalMeshRef = useRef();

    useEffect(() => {
      if (onSceneRefForExport && controlsFromUseThree) {
        onSceneRefForExport(scene, gl, camera || controlsFromUseThree?.object);
      }
    }, [scene, gl, camera, controlsFromUseThree, onSceneRefForExport]);
    useEffect(() => {
      if (settings.background === "customImage" && customBgImageUrl) {
        if (scene.background) scene.background = null;
        if (scene.fog) scene.fog = null;
      } else if (settings.background === "solidColor") {
        scene.background = new THREE.Color(settings.solidBackgroundColor);
        if (scene.fog) scene.fog = null;
      } else {
        if (scene.background) scene.background = null;
        let fC = new THREE.Color(0x101012);
        let fN = 12,
          fF = 40;
        switch (settings.background) {
          case "modernGradient":
            fC = new THREE.Color(0x2c5d72);
            break;
          case "darkSpace":
            fC = new THREE.Color(0x050508);
            fN = 10;
            fF = 35;
            break;
          case "softLight":
            fC = new THREE.Color(0xd0d8e0);
            fN = 7;
            fF = 28;
            break;
          case "studioLight":
            fC = new THREE.Color(0xe4e4e7);
            fN = 10;
            fF = 35;
            break;
          default:
            fC = new THREE.Color(0x18181b);
        }
        if (scene.fog) {
          scene.fog.color.set(fC);
          scene.fog.near = fN;
          scene.fog.far = fF;
        } else {
          scene.fog = new THREE.Fog(fC, fN, fF);
        }
      }
    }, [
      settings.background,
      settings.solidBackgroundColor,
      customBgImageUrl,
      scene,
    ]);
    useLayoutEffect(() => {
      if (onMeshReady) {
        onMeshReady(internalMeshRef.current || null);
      }
    }, [
      onMeshReady,
      isImportedModelDisplayed ? importedModelUrl : currentShape,
      internalMeshRef.current,
    ]);
    const [textYOffset, setTextYOffset] = useState(1.0);
    const textYOffsetMeshKey = isImportedModelDisplayed
      ? importedModelUrl
      : currentShape;
    useEffect(() => {
      const m = internalMeshRef.current;
      if (m) {
        requestAnimationFrame(() => {
          let objectForBbox = m;
          if (m.isGroup && m.children.length > 0) {
            const primaryChild = m.children.find(
              (ch) => ch.isMesh || ch.isGroup || ch.isScene
            );
            if (primaryChild) objectForBbox = primaryChild;
          }
          const b = new THREE.Box3().setFromObject(objectForBbox);
          if (!b.isEmpty()) {
            const h = b.max.y - b.min.y;
            const cY = b.getCenter(new THREE.Vector3()).y;
            setTextYOffset(
              cY + h / 2 + saneNumber(settings.textSize, 0.5) * 0.5 + 0.3
            );
          } else {
            setTextYOffset(
              1.5 + saneNumber(settings.textSize, 0.5) * 0.5 + 0.3
            );
          }
        });
      } else {
        setTextYOffset(1.5 + saneNumber(settings.textSize, 0.5) * 0.5 + 0.3);
      }
    }, [
      settings.textSize,
      textYOffsetMeshKey,
      current3DText,
      isTextVisible,
      internalMeshRef.current,
    ]);

    const [isUserInteractingOrbit, setIsUserInteractingOrbit] = useState(false);
    const autoRotatePauseTimeoutRef = useRef(null);
    const handleOrbitStart = useCallback(() => {
      setIsUserInteractingOrbit(true);
      if (autoRotatePauseTimeoutRef.current)
        clearTimeout(autoRotatePauseTimeoutRef.current);
    }, []);
    const handleOrbitEnd = useCallback(() => {
      if (autoRotatePauseTimeoutRef.current)
        clearTimeout(autoRotatePauseTimeoutRef.current);
      autoRotatePauseTimeoutRef.current = setTimeout(() => {
        setIsUserInteractingOrbit(false);
      }, 1500);
    }, []);
    useEffect(
      () => () => {
        if (autoRotatePauseTimeoutRef.current)
          clearTimeout(autoRotatePauseTimeoutRef.current);
      },
      []
    );
    const effectiveAutoRotate = settings.autoRotate && !isUserInteractingOrbit;

    const proceduralShapeKey = useMemo(
      () =>
        `procedural-${currentShape}-${sceneRefreshTrigger}-${JSON.stringify(
          settings.customMaterialProperties
        )}-${JSON.stringify(settings.shapeColor)}`,
      [
        currentShape,
        sceneRefreshTrigger,
        settings.customMaterialProperties,
        settings.shapeColor,
      ]
    );

    const importedModelKey = useMemo(
      () =>
        `imported-${importedModelUrl}-${importedFileType}-${sceneRefreshTrigger}-${forceMaterialResetKey}-${JSON.stringify(
          settings.customMaterialProperties
        )}`,
      [
        importedModelUrl,
        importedFileType,
        sceneRefreshTrigger,
        forceMaterialResetKey,
        settings.customMaterialProperties,
      ]
    );

    const textOverlayKey = useMemo(
      () =>
        `text-${current3DText}-${isTextVisible}-${sceneRefreshTrigger}-${JSON.stringify(
          textMaterialDef?.args
        )}-${JSON.stringify(textTextureUrlsToLoad)}`,
      [
        current3DText,
        isTextVisible,
        sceneRefreshTrigger,
        textMaterialDef?.args,
        textTextureUrlsToLoad,
      ]
    );

    return (
      <>
        <ambientLight
          intensity={
            settings.ambientLight.enabled
              ? saneNumber(settings.ambientLight.intensity, 0.25)
              : 0
          }
          color={settings.ambientLight.color}
        />
        <directionalLight
          position={[5, 8, 5]}
          intensity={
            settings.keyLight.enabled
              ? saneNumber(settings.keyLight.intensity, 0.7)
              : 0
          }
          color={settings.keyLight.color}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={50}
          shadow-bias={-0.0005}
        />
        <directionalLight
          position={[-5, 3, -3]}
          intensity={
            settings.fillLight.enabled
              ? saneNumber(settings.fillLight.intensity, 0.4)
              : 0
          }
          color={settings.fillLight.color}
        />
        <Suspense fallback={null}>
          {settings.background === "customImage" && customBgImageUrl ? (
            <Environment background files={customBgImageUrl} />
          ) : settings.background !== "solidColor" &&
            settings.background !== "modernGradient" &&
            settings.background !== "darkSpace" ? (
            <Environment
              files='/brown_photostudio_02_4k.hdr'
              background={
                settings.background === "studioLight" ||
                settings.background === "softLight"
              }
              environmentIntensity={
                settings.background === "studioLight" ||
                settings.background === "softLight"
                  ? 1
                  : 0.7
              }
            />
          ) : null}
          {(settings.background === "modernGradient" ||
            settings.background === "darkSpace") && (
            <Environment
              files='/brown_photostudio_02_4k.hdr'
              background={false}
              environmentIntensity={0.5}
            />
          )}
        </Suspense>
        {settings.groundPlaneType === "grid" && (
          <Grid
            infiniteGrid
            cellSize={0.5}
            cellThickness={0.5}
            sectionSize={2.5}
            sectionThickness={1}
            sectionColor={new THREE.Color(0x6f6f6f)}
            cellColor={new THREE.Color(0x444444)}
            fadeDistance={50}
            position={[0, -0.01, 0]}
          />
        )}
        {settings.groundPlaneType === "reflectiveFloor" && (
          <Plane
            args={[100, 100]}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.02, 0]}
            receiveShadow
          >
            <MeshReflectorMaterial
              blur={[300, 100]}
              resolution={1024}
              mixBlur={1}
              mixStrength={1.2}
              roughness={1}
              depthScale={1.1}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.4}
              color='#444444'
              metalness={0.6}
              mirror={0.6}
            />
          </Plane>
        )}
        {!isImportedModelDisplayed ? (
          <Suspense fallback={null}>
            <ProceduralShape
              key={proceduralShapeKey}
              ref={internalMeshRef}
              shapeId={currentShape}
              settings={settings}
              size={1.5}
              animationPresetKey={animationPresetKey}
              isAnimating={isAnimating}
              isAutoRotating={effectiveAutoRotate}
              autoRotateSpeed={settings.autoRotateSpeed}
            />
          </Suspense>
        ) : importedModelUrl ? (
          <Suspense fallback={<meshStandardMaterial color='pink' wireframe />}>
            <ImportedModel
              key={importedModelKey}
              ref={internalMeshRef}
              modelUrl={importedModelUrl}
              fileType={importedFileType}
              mtlUrl={importedMtlUrl}
              settings={settings}
              onModelLoad={onModelLoad}
              isAnimating={isAnimating}
              animationPresetKey={animationPresetKey}
              activeActionRef={activeActionRef}
              mixerRef={mixerRef}
              selectedAnimationClipIndex={selectedAnimationClipIndex}
              animationPlaybackState={animationPlaybackState}
              isAnimationLooping={isAnimationLooping}
              animationPlaybackSpeed={animationPlaybackSpeed}
              animationTime={animationTime}
              forceMaterialResetKey={forceMaterialResetKey}
              isAutoRotating={effectiveAutoRotate}
              autoRotateSpeed={settings.autoRotateSpeed}
              playAllAnimations={playAllAnimations}
            />
          </Suspense>
        ) : null}
        <TextOverlay
          key={textOverlayKey}
          text={current3DText}
          fontUrl={settings.textFontUrl}
          size={settings.textSize}
          depth={settings.textDepth}
          isVisible={isTextVisible}
          textYOffset={textYOffset}
          materialProps={textMaterialDef}
          textureUrls={textTextureUrlsToLoad}
        />
        <DreiOrbitControls
          ref={forwardedOrbitControlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.7}
          zoomSpeed={0.8}
          panSpeed={0.7}
          screenSpacePanning={false}
          minDistance={0.5}
          maxDistance={30}
          minPolarAngle={0.05}
          maxPolarAngle={Math.PI - 0.05}
          target={[0, 0.1, 0]}
          onStart={handleOrbitStart}
          onEnd={handleOrbitEnd}
        />
        {(settings.n8ao?.enabled || settings.bloom?.enabled) && (
          <EffectComposer enableNormalPass>
            {settings.n8ao?.enabled && (
              <N8AO
                aoRadius={saneNumber(settings.n8ao.aoRadius, 0.5)}
                intensity={saneNumber(settings.n8ao.intensity, 1.5)}
                distanceFalloff={saneNumber(settings.n8ao.distanceFalloff, 1.0)}
                screenSpaceRadius={settings.n8ao.screenSpaceRadius ?? true}
                quality={settings.n8ao.quality}
                halfRes={settings.n8ao.halfRes}
                color={new THREE.Color(settings.n8ao.color)}
              />
            )}
            {settings.bloom?.enabled && (
              <Bloom
                intensity={saneNumber(settings.bloom.intensity, 1.0)}
                luminanceThreshold={saneNumber(
                  settings.bloom.luminanceThreshold,
                  0.8
                )}
                luminanceSmoothing={saneNumber(
                  settings.bloom.luminanceSmoothing,
                  0.025
                )}
                kernelSize={settings.bloom.kernelSize}
              />
            )}
          </EffectComposer>
        )}
      </>
    );
  }
);
SceneContentInternal.displayName = "SceneContentInternal";

// AnimationPlaybackBar component
const AnimationPlaybackBar = ({
  animationClips,
  selectedAnimationClipIndex,
  onAnimationClipChange,
  animationPlaybackState,
  onPlayPauseAnimation,
  onStopAnimation,
  isAnimationLooping,
  onAnimationLoopToggle,
  animationTime,
  onAnimationTimeChange,
  animationDuration,
  animationPlaybackSpeed,
  onAnimationSpeedChange,
  playAllAnimations,
  onPlayAllAnimationsToggle,
}) => {
  if (!animationClips || animationClips.length === 0) {
    return null;
  }

  const handleTimeSliderChange = (valueArray) => {
    if (onAnimationTimeChange) onAnimationTimeChange(valueArray);
  };

  const handleSpeedSliderChange = (valueArray) => {
    if (onAnimationSpeedChange) onAnimationSpeedChange(valueArray);
  };

  return (
    <Card className='mt-4 bg-slate-800/70 border-slate-700 shadow-xl'>
      <CardHeader className='pb-3 pt-4 px-4'>
        <CardTitle className='text-base text-slate-100 flex items-center'>
          <Disc3 size={18} className='mr-2 text-purple-400' />
          Animation Controls
        </CardTitle>
      </CardHeader>
      <CardContent className='px-4 pb-4 space-y-3'>
        {animationClips.length > 1 && !playAllAnimations && (
          <div className='space-y-1.5'>
            <Label
              htmlFor='animationClipSelect'
              className='text-xs text-slate-300'
            >
              Animation Clip
            </Label>
            <Select
              value={selectedAnimationClipIndex.toString()}
              onValueChange={onAnimationClipChange}
              disabled={playAllAnimations}
            >
              <SelectTrigger
                id='animationClipSelect'
                className='w-full bg-slate-700 border-slate-600 text-slate-100 text-xs focus:ring-purple-500'
              >
                <SelectValue placeholder='Select clip' />
              </SelectTrigger>
              <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
                {animationClips.map((clip, index) => (
                  <SelectItem
                    key={index}
                    value={index.toString()}
                    className='text-xs focus:bg-purple-600 focus:text-white'
                  >
                    {clip.name || `Animation #${index + 1}`} (
                    {(clip.duration || 0).toFixed(2)}s)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            size='icon'
            onClick={onPlayPauseAnimation}
            className='h-8 w-8 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
            title={animationPlaybackState === "playing" ? "Pause" : "Play"}
          >
            {animationPlaybackState === "playing" ? (
              <Pause size={14} />
            ) : (
              <Play size={14} />
            )}
          </Button>
          <Button
            variant='outline'
            size='icon'
            onClick={onStopAnimation}
            className='h-8 w-8 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
            title='Stop'
          >
            <StopCircle size={14} />
          </Button>
          <div className='flex-grow space-y-1'>
            <Slider
              min={0}
              max={1}
              step={0.001}
              value={[animationTime]}
              onValueChange={handleTimeSliderChange}
              disabled={
                animationPlaybackState === "stopped" || animationDuration === 0
              }
              className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-3'
              title={`Time: ${(animationTime * animationDuration).toFixed(
                2
              )}s / ${animationDuration.toFixed(2)}s`}
            />
            <div className='text-xs text-slate-400 text-right'>
              {(animationTime * animationDuration).toFixed(2)}s /{" "}
              {animationDuration > 0 ? animationDuration.toFixed(2) : "N/A"}s
            </div>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-x-4 gap-y-3 items-center pt-1'>
          <div className='space-y-1.5'>
            <div className='flex justify-between items-center'>
              <Label
                htmlFor='animationSpeedSlider'
                className='text-xs text-slate-300'
              >
                Speed
              </Label>
              <span className='text-xs text-slate-400'>
                {animationPlaybackSpeed.toFixed(1)}x
              </span>
            </div>
            <Slider
              id='animationSpeedSlider'
              min={0.1}
              max={2.0}
              step={0.1}
              value={[animationPlaybackSpeed]}
              onValueChange={handleSpeedSliderChange}
              className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-3'
            />
          </div>

          <div className='flex items-center space-x-2 justify-self-end'>
            <Switch
              id='animationLoopToggle'
              checked={isAnimationLooping}
              onCheckedChange={onAnimationLoopToggle}
              className='data-[state=checked]:bg-purple-600'
            />
            <Label
              htmlFor='animationLoopToggle'
              className='text-xs text-slate-300'
            >
              Loop
            </Label>
          </div>

          {animationClips.length > 1 && (
            <div className='flex items-center space-x-2 col-span-2 justify-center'>
              <Switch
                id='playAllAnimationsToggle'
                checked={playAllAnimations}
                onCheckedChange={onPlayAllAnimationsToggle}
                className='data-[state=checked]:bg-purple-600'
              />
              <Label
                htmlFor='playAllAnimationsToggle'
                className='text-xs text-slate-300'
              >
                Play All Clips Simultaneously
              </Label>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ModelViewer3D = () => {
  const [isMounted, setIsMounted] = useState(false);
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
  const [isAnimating, setIsAnimating] = useState(true);
  const [animationPreset, setAnimationPreset] = useState("gentle");
  const [settings, setSettings] = useState(
    JSON.parse(JSON.stringify(initialSettings))
  );
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [customBgImageUrl, setCustomBgImageUrl] = useState(null);
  const [textInput, setTextInput] = useState("Hello 3D");
  const [current3DText, setCurrent3DText] = useState("");
  const [isTextVisible, setIsTextVisible] = useState(false);

  const meshToExportOrScreenshotRef = useRef(null);
  const r3fSceneForExportRef = useRef(null);
  const r3fGLContextRef = useRef(null);
  const r3fCameraForExportRef = useRef(null);

  const orbitControlsRef = useRef(null);

  const [meshRefUpdateCounter, setMeshRefUpdateCounter] = useState(0);
  const [isContentExportable, setIsContentExportable] = useState(false);

  const [sceneRefreshTrigger, setSceneRefreshTrigger] = useState(0);
  const [forceMaterialResetKey, setForceMaterialResetKey] = useState(0);

  const animationClipsRef = useRef([]);
  const activeActionRef = useRef(null);
  const mixerRef = useRef(null);
  const [selectedAnimationClipIndex, setSelectedAnimationClipIndex] =
    useState(-1);
  const [animationPlaybackState, setAnimationPlaybackState] =
    useState("stopped");
  const [animationTime, setAnimationTime] = useState(0);
  const [animationDuration, setAnimationDuration] = useState(0);
  const [isAnimationLooping, setIsAnimationLooping] = useState(true);
  const [animationPlaybackSpeed, setAnimationPlaybackSpeed] = useState(1.0);
  const [playAllAnimations, setPlayAllAnimations] = useState(false);

  const historyStackRef = useRef([]);
  const historyPointerRef = useRef(-1);
  const isUndoingRedoingRef = useRef(false);
  const MAX_HISTORY = 50;

  const isImportedModelDisplayedRef = useRef(isImportedModelDisplayed);
  useEffect(() => {
    isImportedModelDisplayedRef.current = isImportedModelDisplayed;
  }, [isImportedModelDisplayed]);

  const { textMaterialDef, textTextureUrlsToLoad } = useMemo(() => {
    const sceneForEnv = r3fSceneForExportRef.current;
    const propsFromCreator = createR3FMaterialProps(
      settings.textColor,
      settings.textMaterialType,
      settings.textCustomMaterialProperties,
      sceneForEnv?.environment
    );
    return {
      textMaterialDef: {
        constructor: propsFromCreator.constructor,
        args: propsFromCreator.args,
      },
      textTextureUrlsToLoad: propsFromCreator.textureUrls,
    };
  }, [
    settings.textColor,
    settings.textMaterialType,
    settings.textCustomMaterialProperties,
  ]);

  const captureAppState = useCallback(
    () =>
      JSON.parse(
        JSON.stringify({
          settings,
          currentCategory,
          currentShape,
          animationPreset,
          isAnimating,
          importedModelName,
          isImportedModelDisplayed,
          importedModelUrl: importedModel?.url,
          importedModelType: importedModel?.type,
          importedModelMtlUrl: importedModel?.mtlUrl,
          selectedAnimationClipIndex,
          animationPlaybackState,
          animationTime,
          isAnimationLooping,
          animationPlaybackSpeed,
          playAllAnimations,
          customBgImageUrl,
          current3DText,
          isTextVisible,
          forceMaterialResetKey,
          sceneRefreshTrigger,
        })
      ),
    [
      settings,
      currentCategory,
      currentShape,
      animationPreset,
      isAnimating,
      importedModelName,
      isImportedModelDisplayed,
      importedModel,
      selectedAnimationClipIndex,
      animationPlaybackState,
      animationTime,
      isAnimationLooping,
      animationPlaybackSpeed,
      playAllAnimations,
      customBgImageUrl,
      current3DText,
      isTextVisible,
      forceMaterialResetKey,
      sceneRefreshTrigger,
    ]
  );
  const applyState = useCallback(
    (stateToApply) => {
      isUndoingRedoingRef.current = true;
      setSettings((prevSettings) => ({
        ...initialSettings,
        ...prevSettings,
        ...stateToApply.settings,
      }));
      setCurrentCategory(stateToApply.currentCategory);
      setCurrentShape(stateToApply.currentShape);
      setAnimationPreset(stateToApply.animationPreset);
      setIsAnimating(stateToApply.isAnimating);
      setImportedModelName(stateToApply.importedModelName);
      if (
        stateToApply.importedModelUrl &&
        (stateToApply.importedModelUrl !== importedModel?.url ||
          stateToApply.importedModelType !== importedModel?.type ||
          stateToApply.importedModelMtlUrl !== importedModel?.mtlUrl)
      ) {
        setImportedModel({
          url: stateToApply.importedModelUrl,
          type: stateToApply.importedModelType,
          mtlUrl: stateToApply.importedModelMtlUrl,
        });
      } else if (!stateToApply.importedModelUrl && importedModel) {
        setImportedModel(null);
      }
      setIsImportedModelDisplayed(stateToApply.isImportedModelDisplayed);
      setSelectedAnimationClipIndex(stateToApply.selectedAnimationClipIndex);
      setAnimationPlaybackState(stateToApply.animationPlaybackState);
      setAnimationTime(stateToApply.animationTime);
      setIsAnimationLooping(stateToApply.isAnimationLooping);
      setAnimationPlaybackSpeed(stateToApply.animationPlaybackSpeed);
      setPlayAllAnimations(stateToApply.playAllAnimations);
      setCustomBgImageUrl(stateToApply.customBgImageUrl);
      setCurrent3DText(stateToApply.current3DText);
      setIsTextVisible(stateToApply.isTextVisible);
      setTextInput(stateToApply.current3DText || "Hello 3D");
      if (stateToApply.forceMaterialResetKey !== undefined)
        setForceMaterialResetKey(stateToApply.forceMaterialResetKey);
      if (stateToApply.sceneRefreshTrigger !== undefined)
        setSceneRefreshTrigger(stateToApply.sceneRefreshTrigger);

      requestAnimationFrame(() => {
        isUndoingRedoingRef.current = false;
      });
    },
    [importedModel]
  );
  const pushHistory = useCallback(
    (actionName = "action") => {
      if (isUndoingRedoingRef.current) return;
      const currentState = captureAppState();
      const previousState = historyStackRef.current[historyPointerRef.current];
      if (
        previousState &&
        JSON.stringify(currentState) === JSON.stringify(previousState)
      )
        return;
      const stack = historyStackRef.current.slice(
        0,
        historyPointerRef.current + 1
      );
      stack.push(currentState);
      if (stack.length > MAX_HISTORY) stack.shift();
      historyStackRef.current = stack;
      historyPointerRef.current = stack.length - 1;
    },
    [captureAppState]
  );
  const handleUndo = useCallback(() => {
    if (historyPointerRef.current > 0) {
      historyPointerRef.current--;
      applyState(historyStackRef.current[historyPointerRef.current]);
      sonnerToast.info("Undo Applied");
    } else {
      sonnerToast.warning("Nothing more to undo.");
    }
  }, [applyState]);
  const handleRedo = useCallback(() => {
    if (historyPointerRef.current < historyStackRef.current.length - 1) {
      historyPointerRef.current++;
      applyState(historyStackRef.current[historyPointerRef.current]);
      sonnerToast.info("Redo Applied");
    } else {
      sonnerToast.warning("Nothing more to redo.");
    }
  }, [applyState]);
  useEffect(() => {
    setIsMounted(true);
    const t = setTimeout(() => {
      pushHistory("initial load");
    }, 500);
    return () => clearTimeout(t);
  }, []);

  const debouncedPushHistoryRef = useRef(null);
  useEffect(() => {
    if (!isMounted || isUndoingRedoingRef.current) return;
    if (debouncedPushHistoryRef.current)
      clearTimeout(debouncedPushHistoryRef.current);
    debouncedPushHistoryRef.current = setTimeout(() => {
      if (isMounted && !isUndoingRedoingRef.current)
        pushHistory("state changed");
    }, 750);
    return () => {
      if (debouncedPushHistoryRef.current)
        clearTimeout(debouncedPushHistoryRef.current);
    };
  }, [captureAppState, isMounted]);

  const toggleFullscreen = useCallback(async () => {
    if (!viewerCardRef.current) return;
    if (!document.fullscreenElement) {
      try {
        await viewerCardRef.current.requestFullscreen();
      } catch (err) {
        sonnerToast.error("Fullscreen Failed", { description: err.message });
      }
    } else if (document.exitFullscreen) {
      try {
        await document.exitFullscreen();
      } catch (err) {
        sonnerToast.error("Exit Fullscreen Failed", {
          description: err.message,
        });
      }
    }
  }, []);
  useEffect(() => {
    const fsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", fsChange);
    document.addEventListener("webkitfullscreenchange", fsChange);
    document.addEventListener("mozfullscreenchange", fsChange);
    document.addEventListener("MSFullscreenChange", fsChange);
    return () => {
      document.removeEventListener("fullscreenchange", fsChange);
      document.removeEventListener("webkitfullscreenchange", fsChange);
      document.removeEventListener("mozfullscreenchange", fsChange);
      document.removeEventListener("MSFullscreenChange", fsChange);
    };
  }, []);
  const handleMeshReadyForParent = useCallback((meshFromChild) => {
    meshToExportOrScreenshotRef.current = meshFromChild;
    setMeshRefUpdateCounter((c) => c + 1);
  }, []);

  const handleModelLoadedForScene = useCallback((loadedObject, loadedAnims) => {
    animationClipsRef.current = loadedAnims || [];
    if (loadedObject && animationClipsRef.current.length > 0) {
      setSelectedAnimationClipIndex(0);
      setAnimationDuration(animationClipsRef.current[0]?.duration || 0);
      setAnimationPlaybackState("playing");
      setAnimationTime(0);
    } else {
      setSelectedAnimationClipIndex(-1);
      setAnimationDuration(0);
      setAnimationPlaybackState("stopped");
      setAnimationTime(0);
    }
    meshToExportOrScreenshotRef.current = loadedObject;
    setMeshRefUpdateCounter((c) => c + 1);
  }, []);
  useEffect(() => {
    let hasActualMeshContent = false;
    if (meshToExportOrScreenshotRef.current) {
      const currentReferencedObject = meshToExportOrScreenshotRef.current;
      if (currentReferencedObject.isMesh && currentReferencedObject.geometry) {
        hasActualMeshContent = true;
      } else if (
        currentReferencedObject.isGroup ||
        currentReferencedObject.isScene
      ) {
        currentReferencedObject.traverse((child) => {
          if (hasActualMeshContent) return;
          if (child.isMesh && child.geometry) {
            hasActualMeshContent = true;
          }
        });
      }
    }
    const textReady = isTextVisible && current3DText.trim() !== "";
    setIsContentExportable(hasActualMeshContent || textReady);
  }, [meshRefUpdateCounter, isTextVisible, current3DText]);

  const handleSceneRefForExportCallback = useCallback((scene, gl, camera) => {
    r3fSceneForExportRef.current = scene;
    r3fGLContextRef.current = gl;
    r3fCameraForExportRef.current = camera;
  }, []);
  const handleResetOrbitControlsView = useCallback(() => {
    if (orbitControlsRef.current?.reset) {
      orbitControlsRef.current.reset();
      sonnerToast.info("View Reset");
      pushHistory("reset view");
    } else {
      sonnerToast.warning("OrbitControls not available.");
    }
  }, [pushHistory]);
  const handleToggleGlobalAnimation = useCallback(() => {
    setIsAnimating((p) => {
      sonnerToast.info(`Float Animation ${!p ? "Resumed" : "Paused"}`);
      return !p;
    });
    pushHistory("toggle float animation");
  }, [pushHistory]);
  const handleSettingsChange = (key, value, subKey = null) => {
    setSettings((s) => {
      const nS = { ...s };
      if (subKey) {
        nS[key] = { ...(s[key] || {}), [subKey]: value };
      } else {
        nS[key] = value;
      }
      return nS;
    });
  };
  const resetCustomMaterialProperties = (forText = false) => {
    const targetPropsKey = forText
      ? "textCustomMaterialProperties"
      : "customMaterialProperties";
    const materialTypeKey = forText ? "textMaterialType" : "materialType";
    const shapeIdForAuto = forText ? null : currentShapeRef.current;
    let activeMatTypeForPreset;
    if (settings[materialTypeKey] === "auto") {
      if (forText) {
        activeMatTypeForPreset = "ceramic";
      } else if (isImportedModelDisplayedRef.current) {
        // If imported and 'auto', assume a base like ceramic if textures are applied,
        // otherwise, it implies using the model's own materials.
        // The preset is mainly for when *our* material logic takes over.
        const anyCustomTex = Object.keys(settings.customMaterialProperties)
          .filter((k) => k.endsWith("Url") && k !== "envMapIntensityUrl")
          .some(
            (key) =>
              typeof settings.customMaterialProperties[key] === "string" &&
              settings.customMaterialProperties[key].trim() !== ""
          );
        activeMatTypeForPreset = anyCustomTex
          ? "ceramic"
          : settings[materialTypeKey]; // if auto and no custom tex, stick to auto's logic
      } else {
        const shapeData = Object.values(SHAPES_BY_CATEGORY_DATA)
          .flat()
          .find((s) => s.id === shapeIdForAuto);
        activeMatTypeForPreset = shapeData?.autoMaterial || "ceramic";
      }
    } else {
      activeMatTypeForPreset = settings[materialTypeKey];
    }

    // If activeMatTypeForPreset is still 'auto' (e.g. imported model with no override/textures),
    // then pick a sensible default for resetting the custom props UI.
    const effectivePresetKey =
      activeMatTypeForPreset === "auto" && isImportedModelDisplayedRef.current
        ? "ceramic"
        : activeMatTypeForPreset;

    const presetDefaults =
      baseMaterialPresets[effectivePresetKey] || baseMaterialPresets.ceramic;
    const resetTextures = {};
    [
      "mapUrl",
      "normalMapUrl",
      "roughnessMapUrl",
      "metalnessMapUrl",
      "aoMapUrl",
      "emissiveMapUrl",
    ].forEach((k) => (resetTextures[k] = null));
    setSettings((s) => ({
      ...s,
      [targetPropsKey]: {
        ...resetTextures,
        roughness: presetDefaults.roughness ?? null,
        metalness: presetDefaults.metalness ?? null,
        ior: presetDefaults.ior ?? null,
        transmission: presetDefaults.transmission ?? null,
        thickness: presetDefaults.thickness ?? null,
        emissiveIntensity: presetDefaults.emissiveIntensity ?? null,
        envMapIntensity: presetDefaults.envMapIntensity ?? 1.0,
      },
    }));
    sonnerToast.info(
      `${
        forText ? "Text" : "Model/Shape"
      } material properties reset to '${effectivePresetKey}' defaults.`
    );
    pushHistory(`reset ${forText ? "text" : "model"} material props`);
    if (!forText) {
      setForceMaterialResetKey((k) => k + 1);
    }
  };
  const handleCategorySelect = useCallback(
    (id) => {
      setIsImportedModelDisplayed(false);
      setImportedModel(null);
      setCurrentCategory(id);
      setCurrentShape(SHAPES_BY_CATEGORY_DATA[id][0].id);
      animationClipsRef.current = [];
      setSelectedAnimationClipIndex(-1);
      setAnimationPlaybackState("stopped");
      meshToExportOrScreenshotRef.current = null;
      setMeshRefUpdateCounter((c) => c + 1);
      pushHistory("select category");
    },
    [pushHistory]
  );
  const handleShapeSelect = useCallback(
    (id) => {
      setIsImportedModelDisplayed(false);
      setImportedModel(null);
      setCurrentShape(id);
      animationClipsRef.current = [];
      setSelectedAnimationClipIndex(-1);
      setAnimationPlaybackState("stopped");
      meshToExportOrScreenshotRef.current = null;
      setMeshRefUpdateCounter((c) => c + 1);
      pushHistory("select shape");
    },
    [pushHistory]
  );
  const handleRandomize = useCallback(() => {
    isUndoingRedoingRef.current = true;
    setIsImportedModelDisplayed(false);
    setImportedModel(null);
    setCustomBgImageUrl(null);
    const rCat =
      CATEGORIES_DATA[Math.floor(Math.random() * CATEGORIES_DATA.length)];
    const rSL = SHAPES_BY_CATEGORY_DATA[rCat.id];
    const rS = rSL[Math.floor(Math.random() * rSL.length)];
    const rPK =
      Object.keys(animationPresets)[
        Math.floor(Math.random() * Object.keys(animationPresets).length)
      ];
    const rCol = `hsl(${Math.floor(Math.random() * 360)},70%,70%)`;
    const bgK = Object.keys(BACKGROUND_OPTIONS_DATA).filter(
      (k) => k !== "customImage"
    );
    const rBgK = bgK[Math.floor(Math.random() * bgK.length)];
    const mK = [
      "auto",
      "metallic",
      "glass",
      "crystal",
      "ceramic",
      "organic",
      "plastic",
      "neon",
    ];
    const rMat = mK[Math.floor(Math.random() * mK.length)];
    setCurrentCategory(rCat.id);
    setCurrentShape(rS.id);
    setAnimationPreset(rPK);
    const nKL = {
      enabled: true,
      intensity: saneNumber(Math.random() * (1.5 - 0.3) + 0.3, 0.7),
      color: `hsl(${Math.floor(Math.random() * 360)},70%,85%)`,
    };
    const nFL = {
      enabled: true,
      intensity: saneNumber(Math.random() * (1.0 - 0.2) + 0.2, 0.4),
      color: `hsl(${Math.floor(Math.random() * 360)},60%,75%)`,
    };
    const nAL = {
      enabled: true,
      intensity: saneNumber(Math.random() * (0.5 - 0.1) + 0.1, 0.25),
      color: `hsl(${Math.floor(Math.random() * 360)},50%,70%)`,
    };
    const rTxt = ["Hello!", "3D Fun", "Awesome", "Shapes", "Text"][
      Math.floor(Math.random() * 5)
    ];
    const rTxtCol = `hsl(${Math.floor(Math.random() * 360)},80%,75%)`;
    setCurrent3DText(rTxt);
    setTextInput(rTxt);
    setIsTextVisible(Math.random() > 0.5);
    setPlayAllAnimations(false);
    setSettings((p) => ({
      ...initialSettings,
      materialType: rMat,
      shapeColor: rCol,
      background: rBgK,
      extrudeDepth: saneNumber(Math.random() * (1.0 - 0.1) + 0.1, 0.4),
      animationSpeed: saneNumber(Math.random() * (2.0 - 0.5) + 0.5, 1.0),
      keyLight: nKL,
      fillLight: nFL,
      ambientLight: nAL,
      customMaterialProperties: JSON.parse(
        JSON.stringify(initialSettings.customMaterialProperties)
      ),
      textCustomMaterialProperties: JSON.parse(
        JSON.stringify(initialSettings.textCustomMaterialProperties)
      ),
      textColor: rTxtCol,
      textSize: saneNumber(Math.random() * (0.8 - 0.3) + 0.3, 0.5),
      textDepth: saneNumber(Math.random() * (0.2 - 0.02) + 0.02, 0.05),
      autoRotate: Math.random() > 0.7,
      autoRotateSpeed: saneNumber(Math.random() * 1.5 + 0.2, 0.5),
      groundPlaneType: ["none", "grid", "reflectiveFloor"][
        Math.floor(Math.random() * 3)
      ],
      n8ao: {
        ...initialSettings.n8ao,
        enabled: Math.random() > 0.5,
        intensity: saneNumber(Math.random() * 2 + 0.5, 1.5),
        aoRadius: saneNumber(Math.random() * 0.8 + 0.1, 0.5),
      },
      bloom: {
        ...initialSettings.bloom,
        enabled: Math.random() > 0.3,
        intensity: saneNumber(Math.random() * 2, 1),
      },
    }));
    animationClipsRef.current = [];
    setSelectedAnimationClipIndex(-1);
    setAnimationPlaybackState("stopped");
    setAnimationTime(0);
    setAnimationDuration(0);
    meshToExportOrScreenshotRef.current = null;
    sonnerToast.success("Scene Randomized!");
    requestAnimationFrame(() => {
      isUndoingRedoingRef.current = false;
      pushHistory("randomize scene");
      setMeshRefUpdateCounter((c) => c + 1);
    });
  }, [pushHistory]);

  const handleResetImportedAppearance = useCallback(() => {
    if (!isImportedModelDisplayedRef.current || !importedModel) return;
    setSettings((s) => ({
      ...s,
      materialType: "auto",
      customMaterialProperties: {
        ...initialSettings.customMaterialProperties,
        envMapIntensity:
          s.customMaterialProperties.envMapIntensity ??
          initialSettings.customMaterialProperties.envMapIntensity,
      },
    }));
    setForceMaterialResetKey((p) => p + 1);
    sonnerToast.info("Imported model appearance reset.");
    pushHistory("reset imported appearance");
  }, [importedModel, pushHistory]);

  const currentShapeRef = useRef(currentShape);
  useEffect(() => {
    currentShapeRef.current = currentShape;
  }, [currentShape]);

  const currentImportedModelNameRef = useRef(importedModelName);
  useEffect(() => {
    currentImportedModelNameRef.current = importedModelName;
  }, [importedModelName]);

  const handleTakeScreenshot = useCallback(() => {
    if (
      !r3fGLContextRef.current ||
      !r3fSceneForExportRef.current ||
      !r3fCameraForExportRef.current
    ) {
      sonnerToast.error("Screenshot Failed", {
        description: "Renderer, scene, or camera not ready.",
      });
      return;
    }
    const gl = r3fGLContextRef.current;
    const scene = r3fSceneForExportRef.current;
    const camera = r3fCameraForExportRef.current;
    const id = sonnerToast.loading("Taking Screenshot...", {
      description: "Capturing...",
    });
    requestAnimationFrame(() => {
      gl.render(scene, camera);
      try {
        const canvas = gl.domElement;
        const link = document.createElement("a");
        const bN = isImportedModelDisplayedRef.current
          ? (currentImportedModelNameRef.current || "view")
              .replace(/[^a-z0-9]/gi, "_")
              .toLowerCase()
          : currentShapeRef.current || "view";
        const tSuf = isTextVisible && current3DText ? "-with-text" : "";
        link.download = `screenshot_shape_studio_${bN}${tSuf}.png`;
        link.href = canvas.toDataURL("image/png");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        sonnerToast.success("Screenshot Saved!", {
          id: id,
          description: `${link.download} saved.`,
        });
      } catch (e) {
        sonnerToast.error("Screenshot Failed", {
          id: id,
          description: e.message || "Could not save.",
        });
      }
    });
  }, [current3DText, isTextVisible]);

  const handleForceThreeJSRender = useCallback(() => {
    if (
      r3fGLContextRef.current &&
      r3fSceneForExportRef.current &&
      r3fCameraForExportRef.current
    ) {
      const gl = r3fGLContextRef.current;
      const scene = r3fSceneForExportRef.current;
      const camera = r3fCameraForExportRef.current;

      requestAnimationFrame(() => {
        gl.render(scene, camera);
        sonnerToast.info("Scene view forcibly re-rendered.");
      });
      pushHistory("force scene render");
    } else {
      sonnerToast.warning("Cannot force render: R3F context not ready.");
      console.warn("Could not perform forced render: R3F context not ready.");
    }
  }, [pushHistory]);

  const handleExportGLB = useCallback(async () => {
    if (isExporting) return;
    if (!isContentExportable) {
      sonnerToast.warning("Nothing to export.");
      return;
    }
    setIsExporting(true);
    setExportProgress(0);
    const toastId = sonnerToast.loading("Exporting GLB...");
    const sceneToExport = new THREE.Scene();
    let hasContent = false;

    const textureLoaderForExport = new THREE.TextureLoader();
    const loadTextureAsync = (url) => {
      return new Promise((resolve, reject) => {
        if (!url || typeof url !== "string" || url.trim() === "") {
          resolve(null);
          return;
        }
        textureLoaderForExport.load(
          url,
          (texture) => {
            // Success
            texture.flipY = false; // GLTF standard for textures
            texture.needsUpdate = true;
            resolve(texture);
          },
          undefined, // Progress
          (err) => {
            // Error
            console.error(`Failed to load texture for export: ${url}`, err);
            resolve(null);
          }
        );
      });
    };

    const mainMeshTexturePromises = [];

    if (meshToExportOrScreenshotRef.current) {
      const mainMeshClone = meshToExportOrScreenshotRef.current.clone(true);
      const customProps = settings.customMaterialProperties;
      const textureMapTypes = [
        "map",
        "normalMap",
        "roughnessMap",
        "metalnessMap",
        "aoMap",
        "emissiveMap",
      ];

      // Determine if we need to apply custom materials/textures to the main mesh
      // This happens if it's an imported model (where we allow override) OR
      // if it's a procedural shape and a specific material type (not 'auto') is chosen,
      // OR if any custom texture URLs are present for the main object.
      const needsCustomMaterialProcessing =
        isImportedModelDisplayedRef.current || // Always process imported models for potential overrides
        (!isImportedModelDisplayedRef.current &&
          settings.materialType !== "auto") || // Procedural shape with non-auto material
        Object.values(customProps).some(
          (v) =>
            typeof v === "string" &&
            v.endsWith("Url") &&
            customProps[v.replace("Url", "")]
        );

      if (needsCustomMaterialProcessing) {
        mainMeshClone.traverse((child) => {
          if (child.isMesh && child.material) {
            const materials = Array.isArray(child.material)
              ? child.material
              : [child.material];

            const newMaterials = materials.map((originalMat) => {
              // Re-create material based on current settings to ensure correct base properties
              let autoMaterialTypeForShape = "ceramic"; // Default for procedural if auto
              if (!isImportedModelDisplayedRef.current) {
                const shapeData = Object.values(SHAPES_BY_CATEGORY_DATA)
                  .flat()
                  .find((s) => s.id === currentShapeRef.current);
                if (shapeData?.autoMaterial) {
                  autoMaterialTypeForShape = shapeData.autoMaterial;
                }
              }

              const materialTypeForPreset =
                settings.materialType === "auto"
                  ? isImportedModelDisplayedRef.current
                    ? "ceramic"
                    : autoMaterialTypeForShape // Default to ceramic for imported 'auto' or shape's auto
                  : settings.materialType;

              const { constructor: MatCtor, args: baseMatArgs } =
                createR3FMaterialProps(
                  settings.shapeColor,
                  materialTypeForPreset,
                  customProps,
                  null // No envMap for this temp material definition, GLTFExporter handles env
                );

              const newMaterial = new MatCtor(baseMatArgs);
              newMaterial.name = originalMat.name; // Preserve name

              // Asynchronously load and assign textures
              textureMapTypes.forEach((mapType) => {
                const urlKey = `${mapType}Url`;
                if (
                  customProps[urlKey] &&
                  typeof customProps[urlKey] === "string" &&
                  customProps[urlKey].trim() !== ""
                ) {
                  const promise = loadTextureAsync(customProps[urlKey]).then(
                    (texture) => {
                      if (texture) {
                        texture.colorSpace =
                          mapType === "map" || mapType === "emissiveMap"
                            ? THREE.SRGBColorSpace
                            : THREE.NoColorSpace;
                        newMaterial[mapType] = texture;
                        if (mapType === "map") newMaterial.color.set(0xffffff);
                        newMaterial.needsUpdate = true;
                      }
                    }
                  );
                  mainMeshTexturePromises.push(promise);
                }
              });
              return newMaterial;
            });
            child.material =
              newMaterials.length === 1 ? newMaterials[0] : newMaterials;
          }
        });
      }
      sceneToExport.add(mainMeshClone);
      hasContent = true;
    }

    const textTexturePromises = [];

    if (isTextVisible && current3DText && settings.textFontUrl) {
      let fontToUse = helvetikerFontForExport;
      if (!fontToUse || settings.textFontUrl !== DEFAULT_FONT_PATH) {
        try {
          setExportProgress((prev) => Math.max(prev, 10));
          fontToUse = await new FontLoader().loadAsync(settings.textFontUrl);
          if (
            settings.textFontUrl === DEFAULT_FONT_PATH &&
            !helvetikerFontForExport
          ) {
            helvetikerFontForExport = fontToUse;
          }
        } catch (e) {
          /* ... error handling ... */
          console.error("Font load failed for export:", e);
          sonnerToast.error("Font load failed for export", { id: toastId });
          setIsExporting(false);
          return;
        }
      }

      if (fontToUse) {
        setExportProgress((prev) => Math.max(prev, 20));
        const tS = saneNumber(settings.textSize, 0.5);
        const tD = saneNumber(settings.textDepth, 0.05);
        const bev = true;
        const tG = new TextGeometry(current3DText, {
          /* ... geometry params ... */ font: fontToUse,
          size: tS,
          height: tD,
          curveSegments: 12,
          bevelEnabled: bev,
          bevelThickness: bev ? saneNumber(0.02 * (tS / 0.5), 0.01) : 0,
          bevelSize: bev ? saneNumber(0.01 * (tS / 0.5), 0.005) : 0,
        });
        tG.computeBoundingBox();
        const actualZDepth = tG.boundingBox.max.z - tG.boundingBox.min.z;
        const expectedZDepth = tD;
        let zScaleFactor = 1.0;
        if (
          actualZDepth !== 0 &&
          !isNaN(actualZDepth) &&
          isFinite(actualZDepth)
        ) {
          zScaleFactor = expectedZDepth / actualZDepth;
        } else if (expectedZDepth === 0 && actualZDepth === 0) {
          zScaleFactor = 1.0;
        } else if (actualZDepth === 0 && expectedZDepth !== 0) {
          console.warn("TextGeometry created with zero depth.");
        }
        if (
          Math.abs(zScaleFactor - 1.0) > 0.0001 &&
          isFinite(zScaleFactor) &&
          zScaleFactor > 0
        ) {
          tG.scale(1, 1, zScaleFactor);
        }
        tG.computeBoundingBox();
        const centerOffsetX =
          -0.5 * (tG.boundingBox.max.x + tG.boundingBox.min.x);
        const centerOffsetY =
          -0.5 * (tG.boundingBox.max.y + tG.boundingBox.min.y);
        tG.translate(centerOffsetX, centerOffsetY, 0);

        const textMaterialForExport = new textMaterialDef.constructor(
          textMaterialDef.args
        );

        const textTextureMapTypes = ["map", "normalMap"];
        textTextureMapTypes.forEach((mapType) => {
          const urlKey = `${mapType}Url`;
          if (textTextureUrlsToLoad[urlKey]) {
            const promise = loadTextureAsync(
              textTextureUrlsToLoad[urlKey]
            ).then((texture) => {
              if (texture) {
                texture.colorSpace =
                  mapType === "map" ? THREE.SRGBColorSpace : THREE.NoColorSpace;
                textMaterialForExport[mapType] = texture;
                if (mapType === "map")
                  textMaterialForExport.color.set(0xffffff);
                textMaterialForExport.needsUpdate = true;
              }
            });
            textTexturePromises.push(promise);
          }
        });

        const textMesh = new THREE.Mesh(tG, textMaterialForExport);
        let textExportYOffset = 0;
        if (meshToExportOrScreenshotRef.current) {
          const meshBox = new THREE.Box3().setFromObject(
            meshToExportOrScreenshotRef.current
          );
          if (!meshBox.isEmpty()) {
            const meshHeight = meshBox.max.y - meshBox.min.y;
            const meshCenterY = meshBox.getCenter(new THREE.Vector3()).y;
            textExportYOffset =
              meshCenterY +
              meshHeight / 2 +
              saneNumber(settings.textSize, 0.5) * 0.5 +
              0.3;
          } else {
            textExportYOffset =
              1.5 + saneNumber(settings.textSize, 0.5) * 0.5 + 0.3;
          }
        } else {
          textExportYOffset = saneNumber(settings.textSize, 0.5) * 0.5 + 0.3;
        }
        textMesh.position.y = textExportYOffset;

        sceneToExport.add(textMesh);
        hasContent = true;
      }
    }

    if (!hasContent) {
      sonnerToast.warning("Nothing to export.", { id: toastId });
      setIsExporting(false);
      return;
    }

    try {
      // Wait for all texture loading promises to settle
      await Promise.all([...mainMeshTexturePromises, ...textTexturePromises]);
      setExportProgress((prev) => Math.max(prev, 30));

      const exporter = new GLTFExporter();
      const exportOptions = {
        binary: true,
        embedImages: true,
        animations:
          isImportedModelDisplayedRef.current &&
          importedModel &&
          animationClipsRef.current.length > 0
            ? animationClipsRef.current
            : [],
      };

      exporter.parse(
        sceneToExport,
        (gltf) => {
          const blob = new Blob([gltf], { type: "application/octet-stream" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          const baseName = isImportedModelDisplayedRef.current
            ? (currentImportedModelNameRef.current || "imported_model")
                .replace(/[^a-z0-9]/gi, "_")
                .toLowerCase()
            : currentShapeRef.current || "procedural_shape";
          const textSuffix = isTextVisible && current3DText ? "_with_text" : "";
          link.download = `shape_studio_${baseName}${textSuffix}.glb`;
          link.click();
          URL.revokeObjectURL(link.href);
          setExportProgress(100);
          sonnerToast.success("GLB Exported Successfully!", { id: toastId });
          setIsExporting(false);
        },
        (error) => {
          console.error("GLTFExporter error:", error);
          let errorMsg = "Unknown exporter error";
          if (error && error.message) errorMsg = error.message;
          else if (typeof error === "string") errorMsg = error;
          else if (error.toString) errorMsg = error.toString();

          sonnerToast.error("GLB Export Failed", {
            id: toastId,
            description: errorMsg,
          });
          setIsExporting(false);
        },
        exportOptions
      );
    } catch (e) {
      console.error("Export process error:", e);
      sonnerToast.error("Export Error", {
        id: toastId,
        description: e.message || "An unexpected error occurred.",
      });
      setIsExporting(false);
    }
  }, [
    isExporting,
    isContentExportable,
    settings,
    textMaterialDef,
    textTextureUrlsToLoad,
    importedModel,
    current3DText,
    isTextVisible,
    // Removed pushHistory as it's not directly used here now
  ]);

  const handleSimulatedExportOBJ = useCallback(() => {
    if (isExporting) return;
    if (!isContentExportable) {
      sonnerToast.warning("Nothing to export.");
      return;
    }
    setIsExporting(true);
    setExportProgress(0);
    const id = sonnerToast.loading("Exporting OBJ (Simulated)...", {
      description: "Processing...",
    });
    let p = 0;
    const i = setInterval(() => {
      p += Math.floor(Math.random() * 15 + 10);
      const cP = Math.min(p, 100);
      setExportProgress(cP);
      sonnerToast.loading("Exporting OBJ (Simulated)...", {
        id: id,
        description: `Processing... ${cP}%`,
      });
      if (cP >= 100) {
        clearInterval(i);
        const l = document.createElement("a");
        const bN = isImportedModelDisplayedRef.current
          ? (currentImportedModelNameRef.current || "imported_model")
              .replace(/[^a-z0-9]/gi, "_")
              .toLowerCase()
          : currentShapeRef.current || "procedural_shape";
        const tSuf = isTextVisible && current3DText ? "-with-text" : "";
        l.download = `shape_studio_${bN}${tSuf}.obj`;
        l.href =
          "data:text/plain;charset=utf-8," +
          encodeURIComponent(
            "# OBJ file simulated\n# Actual OBJ Exporter needed for full geometry and materials.\n# This is a placeholder file."
          );
        document.body.appendChild(l);
        l.click();
        document.body.removeChild(l);
        sonnerToast.success("OBJ Export (Simulated) Ready", {
          id: id,
          description: "Simulated OBJ file downloaded.",
        });
        setTimeout(() => {
          setIsExporting(false);
          setExportProgress(0);
        }, 500);
      }
    }, 150);
  }, [isExporting, isContentExportable, current3DText, isTextVisible]);

  const processAndSetImportedModel = useCallback(
    (fileUrl, fileType, mtlFileUrl = null, originalFileName) => {
      const nameOnly =
        originalFileName.split(".").slice(0, -1).join(".") || "Imported Model";
      setImportedModelName(nameOnly);
      setImportedModel({ url: fileUrl, type: fileType, mtlUrl: mtlFileUrl });
      setIsImportedModelDisplayed(true);
      animationClipsRef.current = [];
      setSelectedAnimationClipIndex(-1);
      setAnimationPlaybackState("stopped");
      setAnimationTime(0);
      setAnimationDuration(0);
      setPlayAllAnimations(false);
      if (mixerRef.current) mixerRef.current.stopAllAction();
      setSettings((s) => ({
        ...s,
        materialType: "auto", // Reset to auto for imported model
        customMaterialProperties: {
          // Reset custom props for the new model
          ...initialSettings.customMaterialProperties,
          envMapIntensity:
            s.customMaterialProperties.envMapIntensity ??
            initialSettings.customMaterialProperties.envMapIntensity,
        },
      }));
      setForceMaterialResetKey((prev) => prev + 1);
      meshToExportOrScreenshotRef.current = null;
      setMeshRefUpdateCounter((c) => c + 1);
      pushHistory("import model");
    },
    [pushHistory]
  );

  const handleFiles = useCallback(
    async (files) => {
      if (!files || files.length === 0) return;
      const id = sonnerToast.loading("Processing File(s)...", {
        duration: Infinity,
      });
      let mFile = null,
        mtlFile = null,
        mFileType = "";
      const mExts = [".glb", ".gltf", ".fbx", ".stl", ".obj"];
      for (const ext of mExts) {
        mFile = Array.from(files).find((f) =>
          f.name.toLowerCase().endsWith(ext)
        );
        if (mFile) {
          mFileType = ext.substring(1);
          break;
        }
      }
      if (mFileType === "obj")
        mtlFile = Array.from(files).find((f) =>
          f.name.toLowerCase().endsWith(".mtl")
        );
      if (mFile) {
        if (importedModel?.url?.startsWith("blob:"))
          URL.revokeObjectURL(importedModel.url);
        if (importedModel?.mtlUrl?.startsWith("blob:"))
          URL.revokeObjectURL(importedModel.mtlUrl);
        let mUrl = URL.createObjectURL(mFile);
        const mtlUrl = mtlFile ? URL.createObjectURL(mtlFile) : null;
        processAndSetImportedModel(mUrl, mFileType, mtlUrl, mFile.name);
        sonnerToast.success("Model Ready", {
          id: id,
          description: `${mFile.name} prepared.`,
        });
      } else {
        sonnerToast.error("No Compatible Model File", {
          id: id,
          description: "Select GLB, GLTF, FBX, STL, or OBJ.",
        });
      }
      if (fileInputRef.current) fileInputRef.current.value = null;
    },
    [processAndSetImportedModel, importedModel]
  );
  const triggerImport = useCallback(() => {
    if (fileInputRef.current) fileInputRef.current.click();
  }, []);
  const handleFileDropOnViewer = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (event.dataTransfer.files?.length > 0)
        handleFiles(Array.from(event.dataTransfer.files));
    },
    [handleFiles]
  );
  const handlePlayPauseAnimation = () => {
    if (animationClipsRef.current.length === 0) {
      sonnerToast.warning("No animations loaded.");
      return;
    }
    if (!playAllAnimations && selectedAnimationClipIndex < 0) {
      sonnerToast.warning("No animation clip selected.");
      return;
    }
    setAnimationPlaybackState((p) => {
      const newState = p === "playing" ? "paused" : "playing";
      pushHistory(`animation ${newState}`);
      return newState;
    });
  };
  const handleStopAnimation = () => {
    if (animationClipsRef.current.length === 0) {
      sonnerToast.warning("No animations to stop.");
      return;
    }
    if (
      !playAllAnimations &&
      selectedAnimationClipIndex < 0 &&
      animationPlaybackState === "stopped"
    ) {
      return;
    }
    setAnimationPlaybackState("stopped");
    setAnimationTime(0);
    pushHistory("animation stopped");
  };
  const handleAnimationClipChange = (indexStr) => {
    const i = parseInt(indexStr, 10);
    if (i >= 0 && i < animationClipsRef.current.length) {
      setSelectedAnimationClipIndex(i);
      setAnimationDuration(animationClipsRef.current[i].duration);
      setAnimationTime(0);
      sonnerToast.info(
        `Switched to Animation: ${
          animationClipsRef.current[i].name || `Clip ${i + 1}`
        }`
      );
      pushHistory("change animation clip");
    } else {
      setSelectedAnimationClipIndex(-1);
      setAnimationDuration(0);
    }
  };
  const handleAnimationTimeChange = (valueArray) => {
    setAnimationTime(valueArray[0]);
  };
  const handleAnimationLoopToggle = (checked) => {
    setIsAnimationLooping(checked);
    pushHistory(`animation loop ${checked ? "on" : "off"}`);
  };
  const handleAnimationSpeedChange = (valueArray) => {
    setAnimationPlaybackSpeed(valueArray[0]);
  };
  const handlePlayAllAnimationsToggle = (checked) => {
    setPlayAllAnimations(checked);
    pushHistory(`play all animations ${checked ? "on" : "off"}`);
  };
  const handleCustomBgImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (customBgImageUrl?.startsWith("blob:"))
        URL.revokeObjectURL(customBgImageUrl);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomBgImageUrl(e.target.result);
        handleSettingsChange("background", "customImage");
        sonnerToast.success("Custom background image set.");
        pushHistory("set custom background");
      };
      reader.onerror = () => sonnerToast.error("File Read Error");
      reader.readAsDataURL(file);
    }
    if (event.target) event.target.value = null;
  };
  const handleClearCustomBgImage = () => {
    if (customBgImageUrl?.startsWith("blob:"))
      URL.revokeObjectURL(customBgImageUrl);
    setCustomBgImageUrl(null);
    if (settings.background === "customImage") {
      handleSettingsChange("background", "studioDark");
    }
    sonnerToast.info("Custom background cleared.");
    pushHistory("clear custom background");
  };
  const handleTextureUpload = (targetProperty, mapType, event) => {
    const file = event.target.files[0];
    if (file) {
      const urlKey = `${mapType}Url`;
      const oldUrl = settings[targetProperty]?.[urlKey];
      if (oldUrl?.startsWith("blob:")) URL.revokeObjectURL(oldUrl);
      const reader = new FileReader();
      reader.onload = (e) => {
        handleSettingsChange(targetProperty, e.target.result, urlKey);
        sonnerToast.success(
          `${mapType.replace("Map", "")} texture set for ${
            targetProperty === "textCustomMaterialProperties"
              ? "text"
              : "model/shape"
          }.`
        );
        if (targetProperty === "customMaterialProperties")
          setForceMaterialResetKey((k) => k + 1);
        pushHistory(
          `set ${mapType} for ${
            targetProperty === "textCustomMaterialProperties" ? "text" : "model"
          }`
        );
      };
      reader.onerror = () => sonnerToast.error("File Read Error");
      reader.readAsDataURL(file);
    }
    if (event.target) event.target.value = null;
  };
  const handleClearTexture = (targetProperty, mapType) => {
    const urlKey = `${mapType}Url`;
    const oldUrl = settings[targetProperty]?.[urlKey];
    if (oldUrl?.startsWith("blob:")) URL.revokeObjectURL(oldUrl);
    handleSettingsChange(targetProperty, null, urlKey);
    sonnerToast.info(
      `${mapType.replace("Map", "")} texture cleared for ${
        targetProperty === "textCustomMaterialProperties"
          ? "text"
          : "model/shape"
      }.`
    );
    if (targetProperty === "customMaterialProperties")
      setForceMaterialResetKey((k) => k + 1);
    pushHistory(
      `clear ${mapType} for ${
        targetProperty === "textCustomMaterialProperties" ? "text" : "model"
      }`
    );
  };
  const handleSet3DText = () => {
    const trimmed = textInput.trim();
    setCurrent3DText(trimmed);
    setIsTextVisible(trimmed !== "");
    sonnerToast.info(
      trimmed !== "" ? `3D Text Updated: "${trimmed}"` : "3D Text Cleared"
    );
    pushHistory(trimmed !== "" ? "set 3d text" : "clear 3d text");
  };
  const { active: isLoadingModel, progress: modelLoadProgress } = useProgress();

  if (!isMounted) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-4'>
        <Loader2 className='h-12 w-12 animate-spin text-purple-400 mb-4' />
        <p className='text-lg font-medium'>Initializing 3D Studio...</p>
      </div>
    );
  }
  let canvasBgColor = "transparent";
  if (settings.background === "solidColor")
    canvasBgColor = settings.solidBackgroundColor;
  else if (settings.background !== "customImage" || !customBgImageUrl) {
    if (settings.background === "darkSpace") canvasBgColor = "#0a0a10";
    else if (settings.background === "studioDark") canvasBgColor = "#18181b";
    else if (settings.background === "softLight") canvasBgColor = "#e0e8f0";
    else if (settings.background === "studioLight") canvasBgColor = "#f4f4f5";
    else if (settings.background === "modernGradient")
      canvasBgColor = "#1e3b49";
  }
  const canvasKey = `canvas-gl-alpha-${(
    canvasBgColor === "transparent"
  ).toString()}`;
  const canUndo = historyPointerRef.current > 0;
  const canRedo =
    historyPointerRef.current < historyStackRef.current.length - 1;
  let currentActiveModelMaterialType = settings.materialType;
  if (settings.materialType === "auto") {
    if (isImportedModelDisplayed) {
      const anyCustomTex = Object.keys(settings.customMaterialProperties)
        .filter((k) => k.endsWith("Url") && k !== "envMapIntensityUrl")
        .some(
          (key) =>
            typeof settings.customMaterialProperties[key] === "string" &&
            settings.customMaterialProperties[key].trim() !== ""
        );
      // If 'auto' and imported, and has custom textures, it implies we're overriding, so 'ceramic' is a sensible base.
      // If 'auto' and imported and NO custom textures, it truly means use model's own, so 'auto' is correct.
      currentActiveModelMaterialType = anyCustomTex ? "ceramic" : "auto";
    } else {
      const shapeData = Object.values(SHAPES_BY_CATEGORY_DATA)
        .flat()
        .find((s) => s.id === currentShape);
      currentActiveModelMaterialType = shapeData?.autoMaterial || "ceramic";
    }
  }

  const modelTextureSlots = [
    { id: "map", name: "Color/Albedo" },
    { id: "normalMap", name: "Normal" },
    { id: "roughnessMap", name: "Roughness" },
    { id: "metalnessMap", name: "Metalness" },
    { id: "aoMap", name: "Ambient Occlusion" },
    { id: "emissiveMap", name: "Emissive" },
  ];
  const textTextureSlots = [
    { id: "map", name: "Color/Albedo Map" },
    { id: "normalMap", name: "Normal Map" },
  ];

  return (
    <TooltipProvider>
      <>
        <SonnerToaster richColors position='top-right' />
        <div className='min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 p-3 sm:p-4 md:p-6 text-slate-100 select-none'>
          <input
            type='file'
            accept='.glb,.gltf,.stl,.obj,.mtl,.fbx'
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
                Craft, view, and animate 3D masterpieces. Import GLB, GLTF, STL,
                OBJ, FBX models. Drag & drop supported.
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
                          {CATEGORIES_DATA.map((category) => (
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
                              </span>
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
                        <ScrollArea className='h-48'>
                          <div className='grid grid-cols-2 gap-2 pr-1'>
                            {SHAPES_BY_CATEGORY_DATA[currentCategory].map(
                              (shape) => (
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
                                  <span className='text-xl'>{shape.icon}</span>
                                  {shape.name}
                                </Button>
                              )
                            )}
                          </div>
                        </ScrollArea>
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
                        {importedModelName} (.{importedModel.type})
                      </p>
                    </CardContent>
                    <CardFooter className='flex flex-col space-y-2'>
                      <Button
                        variant='destructive'
                        size='sm'
                        className='w-full'
                        onClick={() => {
                          if (
                            importedModel?.url?.startsWith("blob:") ||
                            importedModel?.url?.startsWith("data:")
                          ) {
                            if (importedModel?.url?.startsWith("blob:"))
                              URL.revokeObjectURL(importedModel.url);
                          }
                          if (importedModel?.mtlUrl?.startsWith("blob:"))
                            URL.revokeObjectURL(importedModel.mtlUrl);
                          setImportedModel(null);
                          setIsImportedModelDisplayed(false);
                          setImportedModelName("Imported Model");
                          const dCID = CATEGORIES_DATA[0].id;
                          setCurrentCategory(dCID);
                          setCurrentShape(SHAPES_BY_CATEGORY_DATA[dCID][0].id);
                          animationClipsRef.current = [];
                          setSelectedAnimationClipIndex(-1);
                          setAnimationPlaybackState("stopped");
                          setAnimationTime(0);
                          setAnimationDuration(0);
                          setPlayAllAnimations(false);
                          if (mixerRef.current)
                            mixerRef.current.stopAllAction();
                          meshToExportOrScreenshotRef.current = null;
                          setMeshRefUpdateCounter((c) => c + 1);
                          sonnerToast.info("Imported Model Cleared");
                          pushHistory("clear imported model");
                        }}
                      >
                        <XCircle size={16} className='mr-2' /> Clear Imported
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        className='w-full border-orange-500 text-orange-400 hover:bg-orange-500/20 hover:text-orange-300'
                        onClick={handleResetImportedAppearance}
                      >
                        <RotateCcw size={16} className='mr-2' /> Reset
                        Appearance
                      </Button>
                    </CardFooter>
                  </Card>
                )}
                <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
                  <CardHeader>
                    <CardTitle className='text-slate-100'>
                      3D Text Overlay
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    <Input
                      type='text'
                      placeholder='Enter text for 3D display'
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      className='bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'
                    />
                    <Button
                      onClick={handleSet3DText}
                      className='w-full bg-teal-600 hover:bg-teal-700'
                    >
                      <Type size={16} className='mr-2' />
                      Set/Update 3D Text
                    </Button>
                    <div className='flex items-center space-x-2 pt-1'>
                      <Switch
                        id='text-visibility-switch'
                        checked={isTextVisible}
                        onCheckedChange={(checked) => {
                          if (checked && current3DText.trim() === "") {
                            setIsTextVisible(false);
                          } else {
                            setIsTextVisible(checked);
                            pushHistory(
                              checked ? "show 3d text" : "hide 3d text"
                            );
                          }
                        }}
                        disabled={current3DText.trim() === ""}
                      />
                      <Label
                        htmlFor='text-visibility-switch'
                        className={cn(
                          "text-sm text-slate-300",
                          current3DText.trim() === "" &&
                            "text-slate-500 cursor-not-allowed"
                        )}
                      >
                        Show 3D Text{" "}
                        {current3DText.trim() === "" && "(No text set)"}
                      </Label>
                    </div>
                  </CardContent>
                </Card>
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
                      title={
                        isImportedModelDisplayed &&
                        animationClipsRef.current.length > 0 &&
                        animationPlaybackState !== "stopped"
                          ? "Float animation paused while model animation is active"
                          : isAnimating
                          ? "Pause procedural float animation"
                          : "Play procedural float animation"
                      }
                      disabled={
                        isImportedModelDisplayed &&
                        animationClipsRef.current.length > 0 &&
                        animationPlaybackState !== "stopped"
                      }
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
                      onValueChange={(value) => {
                        setAnimationPreset(value);
                        pushHistory("change animation preset");
                      }}
                      disabled={
                        isImportedModelDisplayed &&
                        animationClipsRef.current.length > 0 &&
                        animationPlaybackState !== "stopped"
                      }
                    >
                      <SelectTrigger className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'>
                        <SelectValue placeholder='Select float style' />
                      </SelectTrigger>
                      <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
                        {Object.keys(animationPresets).map((pK) => (
                          <SelectItem
                            key={pK}
                            value={pK}
                            className='capitalize focus:bg-purple-600 focus:text-white'
                          >
                            {pK.charAt(0).toUpperCase() + pK.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className='grid grid-cols-2 gap-3'>
                      <Button
                        variant='outline'
                        onClick={handleResetOrbitControlsView}
                        className='border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
                      >
                        <RotateCcw size={14} className='mr-2' />
                        Reset View
                      </Button>
                      <Button
                        variant='default'
                        onClick={handleRandomize}
                        className='bg-indigo-600 hover:bg-indigo-700'
                      >
                        <Shuffle size={14} className='mr-2' />
                        Randomize
                      </Button>
                    </div>
                    <div className='grid grid-cols-2 gap-3 pt-2'>
                      <Button
                        variant='outline'
                        onClick={handleUndo}
                        disabled={!canUndo}
                        className='border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 disabled:opacity-50'
                      >
                        <Undo size={14} className='mr-2' />
                        Undo
                      </Button>
                      <Button
                        variant='outline'
                        onClick={handleRedo}
                        disabled={!canRedo}
                        className='border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 disabled:opacity-50'
                      >
                        <Redo size={14} className='mr-2' />
                        Redo
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
                      <UploadCloud size={16} className='mr-2' />
                      Import Model
                    </Button>
                    <Button
                      onClick={handleExportGLB}
                      disabled={isExporting || !isContentExportable}
                      className='w-full bg-blue-600 hover:bg-blue-700'
                    >
                      {isExporting && exportProgress > 0 && exportProgress < 100
                        ? `GLB... ${Math.round(exportProgress)}%`
                        : "Export GLB"}
                    </Button>
                    <Button
                      onClick={handleSimulatedExportOBJ}
                      disabled={isExporting || !isContentExportable}
                      className='w-full bg-teal-600 hover:bg-teal-700'
                    >
                      {isExporting && exportProgress > 0 && exportProgress < 100
                        ? `OBJ... ${Math.round(exportProgress)}%`
                        : "Export OBJ (Sim.)"}
                    </Button>
                    <Button
                      onClick={handleTakeScreenshot}
                      disabled={isExporting}
                      className='w-full bg-purple-600 hover:bg-purple-700'
                    >
                      <Camera size={16} className='mr-2' />
                      Screenshot
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
                          onClick={handleForceThreeJSRender}
                          className='bg-slate-800/60 hover:bg-slate-700/90 text-slate-300 hover:text-amber-400 rounded-full p-2 shadow-md'
                          title='Force Re-render Scene View'
                        >
                          <Zap size={20} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Force Re-render Scene View</p>
                      </TooltipContent>
                    </Tooltip>
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
                        onCloseAutoFocus={(e) => e.preventDefault()}
                      >
                        <SheetHeader className='p-4 border-b border-slate-700'>
                          <SheetTitle className='text-xl text-slate-100'>
                            Viewer & Model Settings
                          </SheetTitle>
                          <SheetDescription className='text-slate-400 text-xs'>
                            Fine-tune appearance, lighting, and effects.
                          </SheetDescription>
                        </SheetHeader>
                        <ScrollArea className='h-[calc(100vh-128px)]'>
                          {" "}
                          <div className='space-y-6 p-4'>
                            <section className='space-y-4'>
                              <h3 className='text-sm text-slate-300 font-semibold uppercase tracking-wider border-b border-slate-700 pb-1 mb-3 flex items-center'>
                                <Palette
                                  size={16}
                                  className='mr-2 text-purple-400'
                                />
                                {isImportedModelDisplayed
                                  ? `Material for ${importedModelName}`
                                  : "Procedural Shape Material"}
                              </h3>
                              <div className='space-y-1.5'>
                                <Label
                                  htmlFor='materialTypePanelSheet'
                                  className='text-sm text-slate-300'
                                >
                                  Base Material
                                </Label>
                                <Select
                                  value={settings.materialType}
                                  onValueChange={(value) => {
                                    const oldType = settings.materialType;
                                    handleSettingsChange("materialType", value);
                                    if (value !== oldType) {
                                      resetCustomMaterialProperties(false);
                                    }
                                    pushHistory("change material type");
                                  }}
                                >
                                  <SelectTrigger
                                    id='materialTypePanelSheet'
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
                                {settings.materialType === "auto" &&
                                  isImportedModelDisplayed && (
                                    <p className='text-xs text-slate-400 italic mt-1'>
                                      "Auto" uses the model's embedded
                                      materials. Select another type to
                                      override, or apply textures below.
                                    </p>
                                  )}
                              </div>
                              <div className='space-y-1.5'>
                                <Label
                                  htmlFor='shapeColorPanelSheet'
                                  className='text-sm text-slate-300'
                                >
                                  Base Color (If no Color Texture)
                                </Label>
                                <Input
                                  id='shapeColorPanelSheet'
                                  type='color'
                                  value={settings.shapeColor}
                                  onChange={(e) => {
                                    handleSettingsChange(
                                      "shapeColor",
                                      e.target.value
                                    );
                                  }}
                                  className='w-full p-1 h-9 bg-slate-700 border-slate-600 cursor-pointer focus-visible:ring-purple-500'
                                />
                              </div>
                              {!(
                                settings.materialType === "auto" &&
                                isImportedModelDisplayed &&
                                !Object.keys(settings.customMaterialProperties)
                                  .filter(
                                    (k) =>
                                      k.endsWith("Url") &&
                                      k !== "envMapIntensityUrl"
                                  )
                                  .some(
                                    (key) =>
                                      typeof settings.customMaterialProperties[
                                        key
                                      ] === "string" &&
                                      settings.customMaterialProperties[
                                        key
                                      ].trim() !== ""
                                  )
                              ) && (
                                <div className='p-3 border border-slate-600 rounded-md space-y-3 bg-slate-700/30'>
                                  <div className='flex justify-between items-center'>
                                    <h4 className='text-xs font-semibold text-purple-300'>
                                      Fine-tune Material '
                                      {currentActiveModelMaterialType === "auto"
                                        ? isImportedModelDisplayed
                                          ? "Model Default (Override Active)"
                                          : "Shape Default"
                                        : currentActiveModelMaterialType}
                                      '
                                    </h4>
                                    <Button
                                      variant='ghost'
                                      size='xs'
                                      onClick={() =>
                                        resetCustomMaterialProperties(false)
                                      }
                                      className='text-slate-400 hover:text-purple-300 h-7 px-2'
                                    >
                                      Reset to Preset
                                    </Button>
                                  </div>
                                  {currentActiveModelMaterialType !== "glass" &&
                                    currentActiveModelMaterialType !==
                                      "crystal" && (
                                      <div className='space-y-1.5'>
                                        <div className='flex justify-between items-center'>
                                          <Label
                                            htmlFor='customRoughnessPanelSheet'
                                            className='text-xs text-slate-300'
                                          >
                                            Roughness
                                          </Label>
                                          <span className='text-xs text-slate-400'>
                                            {(
                                              settings.customMaterialProperties
                                                .roughness ??
                                              baseMaterialPresets[
                                                currentActiveModelMaterialType ===
                                                "auto"
                                                  ? "ceramic"
                                                  : currentActiveModelMaterialType // Use a default if 'auto' for slider
                                              ]?.roughness ??
                                              0.5
                                            ).toFixed(2)}
                                          </span>
                                        </div>
                                        <Slider
                                          id='customRoughnessPanelSheet'
                                          min={0}
                                          max={1}
                                          step={0.01}
                                          value={[
                                            settings.customMaterialProperties
                                              .roughness ??
                                              baseMaterialPresets[
                                                currentActiveModelMaterialType ===
                                                "auto"
                                                  ? "ceramic"
                                                  : currentActiveModelMaterialType
                                              ]?.roughness ??
                                              0.5,
                                          ]}
                                          onValueChange={([val]) =>
                                            handleSettingsChange(
                                              "customMaterialProperties",
                                              val,
                                              "roughness"
                                            )
                                          }
                                          className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
                                        />
                                      </div>
                                    )}
                                  {(currentActiveModelMaterialType ===
                                    "metallic" ||
                                    currentActiveModelMaterialType ===
                                      "ceramic" ||
                                    currentActiveModelMaterialType ===
                                      "plastic" ||
                                    currentActiveModelMaterialType ===
                                      "organic") && (
                                    <div className='space-y-1.5'>
                                      <div className='flex justify-between items-center'>
                                        <Label
                                          htmlFor='customMetalnessPanelSheet'
                                          className='text-xs text-slate-300'
                                        >
                                          Metalness
                                        </Label>
                                        <span className='text-xs text-slate-400'>
                                          {(
                                            settings.customMaterialProperties
                                              .metalness ??
                                            baseMaterialPresets[
                                              currentActiveModelMaterialType ===
                                              "auto"
                                                ? "ceramic"
                                                : currentActiveModelMaterialType
                                            ]?.metalness ??
                                            0.0
                                          ).toFixed(2)}
                                        </span>
                                      </div>
                                      <Slider
                                        id='customMetalnessPanelSheet'
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        value={[
                                          settings.customMaterialProperties
                                            .metalness ??
                                            baseMaterialPresets[
                                              currentActiveModelMaterialType ===
                                              "auto"
                                                ? "ceramic"
                                                : currentActiveModelMaterialType
                                            ]?.metalness ??
                                            0.0,
                                        ]}
                                        onValueChange={([val]) =>
                                          handleSettingsChange(
                                            "customMaterialProperties",
                                            val,
                                            "metalness"
                                          )
                                        }
                                        className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
                                      />
                                    </div>
                                  )}
                                  {(currentActiveModelMaterialType ===
                                    "glass" ||
                                    currentActiveModelMaterialType ===
                                      "crystal") && (
                                    <>
                                      <div className='space-y-1.5'>
                                        <div className='flex justify-between items-center'>
                                          <Label
                                            htmlFor='customIorPanelSheet'
                                            className='text-xs text-slate-300'
                                          >
                                            IOR
                                          </Label>
                                          <span className='text-xs text-slate-400'>
                                            {(
                                              settings.customMaterialProperties
                                                .ior ??
                                              baseMaterialPresets[
                                                currentActiveModelMaterialType
                                              ]?.ior ??
                                              1.5
                                            ).toFixed(2)}
                                          </span>
                                        </div>
                                        <Slider
                                          id='customIorPanelSheet'
                                          min={1}
                                          max={2.33}
                                          step={0.01}
                                          value={[
                                            settings.customMaterialProperties
                                              .ior ??
                                              baseMaterialPresets[
                                                currentActiveModelMaterialType
                                              ]?.ior ??
                                              1.5,
                                          ]}
                                          onValueChange={([val]) =>
                                            handleSettingsChange(
                                              "customMaterialProperties",
                                              val,
                                              "ior"
                                            )
                                          }
                                          className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
                                        />
                                      </div>
                                      <div className='space-y-1.5'>
                                        <div className='flex justify-between items-center'>
                                          <Label
                                            htmlFor='customTransmissionPanelSheet'
                                            className='text-xs text-slate-300'
                                          >
                                            Transmission
                                          </Label>
                                          <span className='text-xs text-slate-400'>
                                            {(
                                              settings.customMaterialProperties
                                                .transmission ??
                                              baseMaterialPresets[
                                                currentActiveModelMaterialType
                                              ]?.transmission ??
                                              0.95
                                            ).toFixed(2)}
                                          </span>
                                        </div>
                                        <Slider
                                          id='customTransmissionPanelSheet'
                                          min={0}
                                          max={1}
                                          step={0.01}
                                          value={[
                                            settings.customMaterialProperties
                                              .transmission ??
                                              baseMaterialPresets[
                                                currentActiveModelMaterialType
                                              ]?.transmission ??
                                              0.95,
                                          ]}
                                          onValueChange={([val]) =>
                                            handleSettingsChange(
                                              "customMaterialProperties",
                                              val,
                                              "transmission"
                                            )
                                          }
                                          className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
                                        />
                                      </div>
                                      <div className='space-y-1.5'>
                                        <div className='flex justify-between items-center'>
                                          <Label
                                            htmlFor='customThicknessPanelSheet'
                                            className='text-xs text-slate-300'
                                          >
                                            Thickness
                                          </Label>
                                          <span className='text-xs text-slate-400'>
                                            {(
                                              settings.customMaterialProperties
                                                .thickness ??
                                              baseMaterialPresets[
                                                currentActiveModelMaterialType
                                              ]?.thickness ??
                                              0.5
                                            ).toFixed(2)}
                                          </span>
                                        </div>
                                        <Slider
                                          id='customThicknessPanelSheet'
                                          min={0}
                                          max={2}
                                          step={0.01}
                                          value={[
                                            settings.customMaterialProperties
                                              .thickness ??
                                              baseMaterialPresets[
                                                currentActiveModelMaterialType
                                              ]?.thickness ??
                                              0.5,
                                          ]}
                                          onValueChange={([val]) =>
                                            handleSettingsChange(
                                              "customMaterialProperties",
                                              val,
                                              "thickness"
                                            )
                                          }
                                          className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
                                        />
                                      </div>
                                    </>
                                  )}
                                  {baseMaterialPresets[
                                    currentActiveModelMaterialType === "auto"
                                      ? "ceramic"
                                      : currentActiveModelMaterialType
                                  ]?.useEmissive && (
                                    <div className='space-y-1.5'>
                                      <div className='flex justify-between items-center'>
                                        <Label
                                          htmlFor='customEmissiveIntensityPanelSheet'
                                          className='text-xs text-slate-300'
                                        >
                                          Emissive Intensity
                                        </Label>
                                        <span className='text-xs text-slate-400'>
                                          {(
                                            settings.customMaterialProperties
                                              .emissiveIntensity ??
                                            baseMaterialPresets[
                                              currentActiveModelMaterialType ===
                                              "auto"
                                                ? "ceramic"
                                                : currentActiveModelMaterialType
                                            ]?.emissiveIntensity ??
                                            1.0
                                          ).toFixed(2)}
                                        </span>
                                      </div>
                                      <Slider
                                        id='customEmissiveIntensityPanelSheet'
                                        min={0}
                                        max={5}
                                        step={0.1}
                                        value={[
                                          settings.customMaterialProperties
                                            .emissiveIntensity ??
                                            baseMaterialPresets[
                                              currentActiveModelMaterialType ===
                                              "auto"
                                                ? "ceramic"
                                                : currentActiveModelMaterialType
                                            ]?.emissiveIntensity ??
                                            1.0,
                                        ]}
                                        onValueChange={([val]) =>
                                          handleSettingsChange(
                                            "customMaterialProperties",
                                            val,
                                            "emissiveIntensity"
                                          )
                                        }
                                        className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
                                      />
                                    </div>
                                  )}
                                  <div className='space-y-1.5'>
                                    <div className='flex justify-between items-center'>
                                      <Label
                                        htmlFor='customEnvMapIntensitySheet'
                                        className='text-xs text-slate-300'
                                      >
                                        EnvMap Intensity
                                      </Label>
                                      <span className='text-xs text-slate-400'>
                                        {(
                                          settings.customMaterialProperties
                                            .envMapIntensity ??
                                          baseMaterialPresets[
                                            currentActiveModelMaterialType ===
                                            "auto"
                                              ? "ceramic"
                                              : currentActiveModelMaterialType
                                          ]?.envMapIntensity ??
                                          1.0
                                        ).toFixed(2)}
                                      </span>
                                    </div>
                                    <Slider
                                      id='customEnvMapIntensitySheet'
                                      min={0}
                                      max={3}
                                      step={0.05}
                                      value={[
                                        settings.customMaterialProperties
                                          .envMapIntensity ??
                                          baseMaterialPresets[
                                            currentActiveModelMaterialType ===
                                            "auto"
                                              ? "ceramic"
                                              : currentActiveModelMaterialType
                                          ]?.envMapIntensity ??
                                          1.0,
                                      ]}
                                      onValueChange={([val]) =>
                                        handleSettingsChange(
                                          "customMaterialProperties",
                                          val,
                                          "envMapIntensity"
                                        )
                                      }
                                      className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
                                    />
                                  </div>
                                  <Separator className='my-2 bg-slate-500/50' />
                                  <h5 className='text-xs font-medium text-purple-300 pt-1 flex items-center'>
                                    <ImageUp size={14} className='mr-1.5' />
                                    Model/Shape Textures
                                  </h5>
                                  <div className='grid grid-cols-2 gap-x-3 gap-y-4'>
                                    {modelTextureSlots.map((slot) => {
                                      const urlKey = `${slot.id}Url`;
                                      const currentTextureUrl =
                                        settings.customMaterialProperties[
                                          urlKey
                                        ];
                                      return (
                                        <div
                                          key={slot.id}
                                          className='space-y-1'
                                        >
                                          <Label
                                            htmlFor={`texture-${slot.id}-sheet`}
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
                                                onClick={() =>
                                                  handleClearTexture(
                                                    "customMaterialProperties",
                                                    slot.id
                                                  )
                                                }
                                                title={`Clear ${slot.name} Texture`}
                                              >
                                                <Trash2 size={12} />
                                              </Button>
                                            </div>
                                          )}
                                          <Input
                                            id={`texture-${slot.id}-sheet`}
                                            type='file'
                                            accept='image/*'
                                            ref={(el) =>
                                              (textureFileInputRefs.current[
                                                slot.id
                                              ] = el)
                                            }
                                            onChange={(e) =>
                                              handleTextureUpload(
                                                "customMaterialProperties",
                                                slot.id,
                                                e
                                              )
                                            }
                                            className={cn(
                                              "w-full text-xs file:mr-1.5 file:py-1 file:px-1.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer",
                                              "bg-slate-700 border-slate-600 text-slate-100",
                                              currentTextureUrl ? "mt-1" : ""
                                            )}
                                          />
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                              {!isImportedModelDisplayed && (
                                <>
                                  <Separator className='my-3 bg-slate-600' />
                                  <h3 className='text-sm text-slate-300 font-semibold uppercase tracking-wider border-b border-slate-700 pb-1 mb-3 flex items-center'>
                                    <LayersIcon
                                      size={16}
                                      className='mr-2 text-purple-400'
                                    />
                                    Procedural Shape Geometry
                                  </h3>
                                  <div className='space-y-1.5'>
                                    <div className='flex justify-between items-center'>
                                      <Label
                                        htmlFor='extrudeDepthPanelSheet'
                                        className='text-sm text-slate-300'
                                      >
                                        Depth
                                      </Label>
                                      <span className='text-xs text-slate-400'>
                                        {settings.extrudeDepth.toFixed(2)}
                                      </span>
                                    </div>
                                    <Slider
                                      id='extrudeDepthPanelSheet'
                                      min={0.05}
                                      max={1.5}
                                      step={0.05}
                                      value={[settings.extrudeDepth]}
                                      onValueChange={([value]) =>
                                        handleSettingsChange(
                                          "extrudeDepth",
                                          value
                                        )
                                      }
                                      className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
                                    />
                                  </div>
                                  <div className='space-y-1.5'>
                                    <Label
                                      htmlFor='qualityPanelSheet'
                                      className='text-sm text-slate-300'
                                    >
                                      Quality
                                    </Label>
                                    <Select
                                      value={settings.quality}
                                      onValueChange={(value) => {
                                        handleSettingsChange("quality", value);
                                        pushHistory("change quality");
                                      }}
                                    >
                                      <SelectTrigger
                                        id='qualityPanelSheet'
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
                            </section>

                            <Separator className='my-3 bg-slate-600' />
                            <section className='space-y-4'>
                              <h3 className='text-sm text-slate-300 font-semibold uppercase tracking-wider border-b border-slate-700 pb-1 mb-3 flex items-center'>
                                <Type
                                  size={16}
                                  className='mr-2 text-teal-400'
                                />
                                3D Text Settings
                              </h3>
                              <div className='p-3 border border-slate-600 rounded-md space-y-3 bg-slate-700/30'>
                                <div className='flex justify-between items-center'>
                                  <h4 className='text-xs font-semibold text-teal-300'>
                                    Geometry
                                  </h4>
                                </div>
                                <div className='space-y-1.5'>
                                  <Label
                                    htmlFor='textColorPanelSheet'
                                    className='text-sm text-slate-300'
                                  >
                                    Text Base Color (If no Texture)
                                  </Label>
                                  <Input
                                    id='textColorPanelSheet'
                                    type='color'
                                    value={settings.textColor}
                                    onChange={(e) =>
                                      handleSettingsChange(
                                        "textColor",
                                        e.target.value
                                      )
                                    }
                                    className='w-full p-1 h-9 bg-slate-700 border-slate-600 cursor-pointer'
                                  />
                                </div>
                                <div className='space-y-1.5'>
                                  <div className='flex justify-between items-center'>
                                    <Label
                                      htmlFor='textSizePanelSheet'
                                      className='text-sm text-slate-300'
                                    >
                                      Text Size
                                    </Label>
                                    <span className='text-xs text-slate-400'>
                                      {settings.textSize.toFixed(2)}
                                    </span>
                                  </div>
                                  <Slider
                                    id='textSizePanelSheet'
                                    min={0.1}
                                    max={2.0}
                                    step={0.05}
                                    value={[settings.textSize]}
                                    onValueChange={([v]) =>
                                      handleSettingsChange("textSize", v)
                                    }
                                    className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
                                  />
                                </div>
                                <div className='space-y-1.5'>
                                  <div className='flex justify-between items-center'>
                                    <Label
                                      htmlFor='textDepthPanelSheet'
                                      className='text-sm text-slate-300'
                                    >
                                      Text Depth
                                    </Label>
                                    <span className='text-xs text-slate-400'>
                                      {settings.textDepth.toFixed(3)}
                                    </span>
                                  </div>
                                  <Slider
                                    id='textDepthPanelSheet'
                                    min={0.005}
                                    max={0.5}
                                    step={0.005}
                                    value={[settings.textDepth]}
                                    onValueChange={([v]) =>
                                      handleSettingsChange("textDepth", v)
                                    }
                                    className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
                                  />
                                </div>
                                <div className='space-y-1.5'>
                                  <Label
                                    htmlFor='textFontPanelSheet'
                                    className='text-sm text-slate-300'
                                  >
                                    Font URL (JSON Typeface)
                                  </Label>
                                  <Input
                                    id='textFontPanelSheet'
                                    type='text'
                                    value={settings.textFontUrl}
                                    onChange={(e) => {
                                      handleSettingsChange(
                                        "textFontUrl",
                                        e.target.value
                                      );
                                      pushHistory("change text font url");
                                    }}
                                    placeholder='/fonts/helvetiker_regular.typeface.json'
                                    className='w-full bg-slate-700 border-slate-600 text-slate-100 text-xs'
                                  />
                                  <p className='text-xs text-slate-400'>
                                    Default: Helvetiker. Place custom fonts in
                                    `public/fonts/`.
                                  </p>
                                </div>
                              </div>
                              <div className='p-3 border border-slate-600 rounded-md space-y-3 bg-slate-700/30 mt-4'>
                                <div className='flex justify-between items-center'>
                                  <h4 className='text-xs font-semibold text-teal-300'>
                                    Material
                                  </h4>
                                  <Button
                                    variant='ghost'
                                    size='xs'
                                    onClick={() =>
                                      resetCustomMaterialProperties(true)
                                    }
                                    className='text-slate-400 hover:text-teal-300 h-7 px-2'
                                  >
                                    Reset to Preset
                                  </Button>
                                </div>
                                <div className='space-y-1.5'>
                                  <Label
                                    htmlFor='textMaterialTypePanelSheet'
                                    className='text-xs text-slate-300'
                                  >
                                    Base Material
                                  </Label>
                                  <Select
                                    value={settings.textMaterialType}
                                    onValueChange={(value) => {
                                      handleSettingsChange(
                                        "textMaterialType",
                                        value
                                      );
                                      resetCustomMaterialProperties(true);
                                    }}
                                  >
                                    <SelectTrigger
                                      id='textMaterialTypePanelSheet'
                                      className='w-full bg-slate-700 border-slate-600 text-slate-100 text-xs focus:ring-teal-500'
                                    >
                                      <SelectValue placeholder='Select material type' />
                                    </SelectTrigger>
                                    <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
                                      {[
                                        "ceramic",
                                        "metallic",
                                        "plastic",
                                        "neon",
                                      ].map((type) => (
                                        <SelectItem
                                          key={type}
                                          value={type}
                                          className='capitalize focus:bg-teal-600 focus:text-white'
                                        >
                                          {type}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                {settings.textMaterialType !== "neon" && (
                                  <>
                                    <div className='space-y-1.5'>
                                      <div className='flex justify-between items-center'>
                                        <Label
                                          htmlFor='textRoughnessSlider'
                                          className='text-xs text-slate-300'
                                        >
                                          Roughness
                                        </Label>
                                        <span className='text-xs text-slate-400'>
                                          {(
                                            settings
                                              .textCustomMaterialProperties
                                              .roughness ??
                                            baseMaterialPresets[
                                              settings.textMaterialType
                                            ]?.roughness ??
                                            0.5
                                          ).toFixed(2)}
                                        </span>
                                      </div>
                                      <Slider
                                        id='textRoughnessSlider'
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        value={[
                                          settings.textCustomMaterialProperties
                                            .roughness ??
                                            baseMaterialPresets[
                                              settings.textMaterialType
                                            ]?.roughness ??
                                            0.5,
                                        ]}
                                        onValueChange={([val]) =>
                                          handleSettingsChange(
                                            "textCustomMaterialProperties",
                                            val,
                                            "roughness"
                                          )
                                        }
                                        className='[&>span:first-child]:h-1 [&>span>span]:bg-teal-500 [&>span>span]:h-2 [&>span>span]:w-4'
                                      />
                                    </div>
                                    <div className='space-y-1.5'>
                                      <div className='flex justify-between items-center'>
                                        <Label
                                          htmlFor='textMetalnessSlider'
                                          className='text-xs text-slate-300'
                                        >
                                          Metalness
                                        </Label>
                                        <span className='text-xs text-slate-400'>
                                          {(
                                            settings
                                              .textCustomMaterialProperties
                                              .metalness ??
                                            baseMaterialPresets[
                                              settings.textMaterialType
                                            ]?.metalness ??
                                            0.0
                                          ).toFixed(2)}
                                        </span>
                                      </div>
                                      <Slider
                                        id='textMetalnessSlider'
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        value={[
                                          settings.textCustomMaterialProperties
                                            .metalness ??
                                            baseMaterialPresets[
                                              settings.textMaterialType
                                            ]?.metalness ??
                                            0.0,
                                        ]}
                                        onValueChange={([val]) =>
                                          handleSettingsChange(
                                            "textCustomMaterialProperties",
                                            val,
                                            "metalness"
                                          )
                                        }
                                        className='[&>span:first-child]:h-1 [&>span>span]:bg-teal-500 [&>span>span]:h-2 [&>span>span]:w-4'
                                      />
                                    </div>
                                  </>
                                )}
                                {settings.textMaterialType === "neon" && (
                                  <div className='space-y-1.5'>
                                    <div className='flex justify-between items-center'>
                                      <Label
                                        htmlFor='textEmissiveIntensitySlider'
                                        className='text-xs text-slate-300'
                                      >
                                        Emissive Intensity
                                      </Label>
                                      <span className='text-xs text-slate-400'>
                                        {(
                                          settings.textCustomMaterialProperties
                                            .emissiveIntensity ??
                                          baseMaterialPresets.neon
                                            .emissiveIntensity
                                        ).toFixed(2)}
                                      </span>
                                    </div>
                                    <Slider
                                      id='textEmissiveIntensitySlider'
                                      min={0}
                                      max={5}
                                      step={0.1}
                                      value={[
                                        settings.textCustomMaterialProperties
                                          .emissiveIntensity ??
                                          baseMaterialPresets.neon
                                            .emissiveIntensity,
                                      ]}
                                      onValueChange={([val]) =>
                                        handleSettingsChange(
                                          "textCustomMaterialProperties",
                                          val,
                                          "emissiveIntensity"
                                        )
                                      }
                                      className='[&>span:first-child]:h-1 [&>span>span]:bg-teal-500 [&>span>span]:h-2 [&>span>span]:w-4'
                                    />
                                  </div>
                                )}
                                <Separator className='my-2 bg-slate-600/50' />
                                <h5 className='text-xs font-medium text-teal-300 pt-1 flex items-center'>
                                  <ImageUp size={14} className='mr-1.5' />{" "}
                                  Textures
                                </h5>
                                <div className='grid grid-cols-1 gap-y-4'>
                                  {textTextureSlots.map((slot) => {
                                    const urlKey = `${slot.id}Url`;
                                    const currentTextureUrl =
                                      settings.textCustomMaterialProperties[
                                        urlKey
                                      ];
                                    return (
                                      <div
                                        key={`text-${slot.id}`}
                                        className='space-y-1'
                                      >
                                        <Label
                                          htmlFor={`text-texture-${slot.id}-sheet`}
                                          className='text-xs text-slate-300'
                                        >
                                          {slot.name}
                                        </Label>
                                        {currentTextureUrl && (
                                          <div className='relative group w-full aspect-video bg-slate-600/50 rounded overflow-hidden mb-1'>
                                            <img
                                              src={currentTextureUrl}
                                              alt={`${slot.name} preview for text`}
                                              className='w-full h-full object-contain'
                                            />
                                            <Button
                                              variant='destructive'
                                              size='icon'
                                              className='absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100'
                                              onClick={() =>
                                                handleClearTexture(
                                                  "textCustomMaterialProperties",
                                                  slot.id
                                                )
                                              }
                                              title={`Clear Text ${slot.name}`}
                                            >
                                              <Trash2 size={12} />
                                            </Button>
                                          </div>
                                        )}
                                        <Input
                                          id={`text-texture-${slot.id}-sheet`}
                                          type='file'
                                          accept='image/*'
                                          onChange={(e) =>
                                            handleTextureUpload(
                                              "textCustomMaterialProperties",
                                              slot.id,
                                              e
                                            )
                                          }
                                          className={cn(
                                            "w-full text-xs file:mr-1.5 file:py-1 file:px-1.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-teal-600 file:text-white hover:file:bg-teal-700 cursor-pointer",
                                            "bg-slate-700 border-slate-600 text-slate-100",
                                            currentTextureUrl ? "mt-1" : ""
                                          )}
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </section>

                            <Separator className='my-3 bg-slate-600' />
                            <section className='space-y-4'>
                              <h3 className='text-sm text-slate-300 font-semibold uppercase tracking-wider border-b border-slate-700 pb-1 mb-3 flex items-center'>
                                <Sparkles
                                  size={16}
                                  className='mr-2 text-amber-400'
                                />
                                Display & Ground
                              </h3>
                              <div className='space-y-1.5'>
                                <div className='flex justify-between items-center'>
                                  <Label
                                    htmlFor='animationSpeedPanelSheet'
                                    className='text-sm text-slate-300'
                                  >
                                    Float Anim. Speed
                                  </Label>
                                  <span className='text-xs text-slate-400'>
                                    {settings.animationSpeed.toFixed(1)}x
                                  </span>
                                </div>
                                <Slider
                                  id='animationSpeedPanelSheet'
                                  min={0.1}
                                  max={3}
                                  step={0.1}
                                  value={[settings.animationSpeed]}
                                  onValueChange={([value]) =>
                                    handleSettingsChange(
                                      "animationSpeed",
                                      value
                                    )
                                  }
                                  className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
                                  disabled={
                                    isImportedModelDisplayed &&
                                    animationClipsRef.current.length > 0 &&
                                    animationPlaybackState !== "stopped"
                                  }
                                />
                              </div>
                              <div className='flex items-center justify-between'>
                                <Label
                                  htmlFor='autoRotateSwitchPanel'
                                  className='text-sm text-slate-300 flex items-center'
                                >
                                  <Orbit size={14} className='mr-1.5' />
                                  Auto-Rotate Model
                                </Label>
                                <Switch
                                  id='autoRotateSwitchPanel'
                                  checked={settings.autoRotate}
                                  onCheckedChange={(val) => {
                                    handleSettingsChange("autoRotate", val);
                                    pushHistory(
                                      `auto-rotate ${val ? "on" : "off"}`
                                    );
                                  }}
                                />
                              </div>
                              {settings.autoRotate && (
                                <div className='space-y-1.5 pl-2'>
                                  <div className='flex justify-between items-center'>
                                    <Label
                                      htmlFor='autoRotateSpeedSheetPanel'
                                      className='text-xs text-slate-300'
                                    >
                                      Rotation Speed
                                    </Label>
                                    <span className='text-xs text-slate-400'>
                                      {settings.autoRotateSpeed.toFixed(1)}
                                    </span>
                                  </div>
                                  <Slider
                                    id='autoRotateSpeedSheetPanel'
                                    min={0.1}
                                    max={2}
                                    step={0.1}
                                    value={[settings.autoRotateSpeed]}
                                    onValueChange={([v]) =>
                                      handleSettingsChange("autoRotateSpeed", v)
                                    }
                                    className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
                                  />
                                </div>
                              )}
                              <div className='space-y-1.5'>
                                <Label
                                  htmlFor='groundPlaneSheetPanel'
                                  className='text-sm text-slate-300'
                                >
                                  Ground Plane
                                </Label>
                                <Select
                                  value={settings.groundPlaneType}
                                  onValueChange={(v) => {
                                    handleSettingsChange("groundPlaneType", v);
                                    pushHistory("change ground plane");
                                  }}
                                >
                                  <SelectTrigger
                                    id='groundPlaneSheetPanel'
                                    className='w-full bg-slate-700'
                                  >
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className='bg-slate-700'>
                                    {Object.entries(
                                      GROUND_PLANE_OPTIONS_DATA
                                    ).map(([k, n]) => (
                                      <SelectItem key={k} value={k}>
                                        {n}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className='space-y-1.5'>
                                <Label
                                  htmlFor='backgroundPanelSheetPanel'
                                  className='text-sm text-slate-300'
                                >
                                  Background / Environment
                                </Label>
                                <Select
                                  value={settings.background}
                                  onValueChange={(value) => {
                                    handleSettingsChange("background", value);
                                    pushHistory("change background");
                                  }}
                                >
                                  <SelectTrigger
                                    id='backgroundPanelSheetPanel'
                                    className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'
                                  >
                                    <SelectValue placeholder='Select background' />
                                  </SelectTrigger>
                                  <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
                                    {Object.entries(
                                      BACKGROUND_OPTIONS_DATA
                                    ).map(([key, name]) => (
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
                                {settings.background === "solidColor" && (
                                  <div className='mt-2 space-y-1.5 p-3 border border-slate-600 rounded-md bg-slate-700/30'>
                                    <Label
                                      htmlFor='solidBgColorSheetPanel'
                                      className='text-sm'
                                    >
                                      Background Color
                                    </Label>
                                    <Input
                                      id='solidBgColorSheetPanel'
                                      type='color'
                                      value={settings.solidBackgroundColor}
                                      onChange={(e) =>
                                        handleSettingsChange(
                                          "solidBackgroundColor",
                                          e.target.value
                                        )
                                      }
                                      className='w-full h-9 p-1 bg-slate-700'
                                    />
                                  </div>
                                )}
                                {settings.background === "customImage" && (
                                  <div className='mt-2 space-y-1.5 p-3 border border-slate-600 rounded-md bg-slate-700/30'>
                                    <Label
                                      htmlFor='customBgImagePanelSheetPanel'
                                      className='text-sm text-slate-300'
                                    >
                                      Upload BG (HDR, JPG, PNG)
                                    </Label>
                                    <Input
                                      id='customBgImagePanelSheetPanel'
                                      type='file'
                                      accept='image/*,.hdr'
                                      onChange={handleCustomBgImageUpload}
                                      className='w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer bg-slate-700 border-slate-600 text-slate-100'
                                    />
                                    {customBgImageUrl && (
                                      <Button
                                        variant='ghost'
                                        size='xs'
                                        onClick={handleClearCustomBgImage}
                                        className='text-red-400 hover:text-red-300 hover:bg-transparent mt-1 w-full justify-start px-1'
                                      >
                                        <Trash2 size={12} className='mr-1' />
                                        Clear Custom Background
                                      </Button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </section>
                            <Separator className='my-3 bg-slate-600' />
                            <section className='space-y-4'>
                              <h3 className='text-sm text-slate-300 font-semibold uppercase tracking-wider border-b border-slate-700 pb-1 mb-3 flex items-center'>
                                <SunMedium
                                  size={16}
                                  className='mr-2 text-yellow-400'
                                />
                                Lighting
                              </h3>
                              {["keyLight", "fillLight", "ambientLight"].map(
                                (lightKey) => {
                                  const lightName =
                                    lightKey
                                      .replace("Light", "")
                                      .charAt(0)
                                      .toUpperCase() +
                                    lightKey.replace("Light", "").slice(1);
                                  return (
                                    <div
                                      key={lightKey}
                                      className='p-3 border border-slate-600 rounded-md space-y-2 text-xs bg-slate-700/30'
                                    >
                                      <div className='flex items-center justify-between'>
                                        <Label
                                          htmlFor={`${lightKey}EnablePanelSheet`}
                                          className='text-slate-200 text-sm'
                                        >
                                          {lightName} Light
                                        </Label>
                                        <Switch
                                          id={`${lightKey}EnablePanelSheet`}
                                          checked={settings[lightKey].enabled}
                                          onCheckedChange={(checked) => {
                                            handleSettingsChange(
                                              lightKey,
                                              checked,
                                              "enabled"
                                            );
                                            pushHistory(
                                              `${lightName} light ${
                                                checked ? "on" : "off"
                                              }`
                                            );
                                          }}
                                        />
                                      </div>
                                      {settings[lightKey].enabled && (
                                        <>
                                          <div className='flex justify-between items-center'>
                                            <Label
                                              htmlFor={`${lightKey}IntensityPanelSheet`}
                                              className='text-slate-300'
                                            >
                                              Intensity
                                            </Label>
                                            <span className='text-xs text-slate-400'>
                                              {settings[
                                                lightKey
                                              ].intensity.toFixed(2)}
                                            </span>
                                          </div>
                                          <Slider
                                            id={`${lightKey}IntensityPanelSheet`}
                                            min={0}
                                            max={2}
                                            step={0.05}
                                            value={[
                                              settings[lightKey].intensity,
                                            ]}
                                            onValueChange={([val]) =>
                                              handleSettingsChange(
                                                lightKey,
                                                val,
                                                "intensity"
                                              )
                                            }
                                            className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
                                          />
                                          <Label
                                            htmlFor={`${lightKey}ColorPanelSheet`}
                                            className='text-slate-300'
                                          >
                                            Color
                                          </Label>
                                          <Input
                                            id={`${lightKey}ColorPanelSheet`}
                                            type='color'
                                            value={settings[lightKey].color}
                                            onChange={(e) =>
                                              handleSettingsChange(
                                                lightKey,
                                                e.target.value,
                                                "color"
                                              )
                                            }
                                            className='w-full h-7 p-0.5 bg-slate-600 border-slate-500 cursor-pointer'
                                          />
                                        </>
                                      )}
                                    </div>
                                  );
                                }
                              )}
                            </section>
                            <Separator className='my-3 bg-slate-600' />
                            <section className='space-y-4'>
                              <h3 className='text-sm text-slate-300 font-semibold uppercase tracking-wider border-b border-slate-700 pb-1 mb-3 flex items-center'>
                                <Sparkles
                                  size={16}
                                  className='mr-2 text-sky-400'
                                />
                                Post-Processing
                              </h3>
                              <div className='p-3 border border-slate-600 rounded-md space-y-3 bg-slate-700/30'>
                                <div className='flex items-center justify-between'>
                                  <Label
                                    htmlFor='n8aoEnableSheetPanel'
                                    className='text-sm text-slate-200'
                                  >
                                    N8AO (Ambient Occlusion)
                                  </Label>
                                  <Switch
                                    id='n8aoEnableSheetPanel'
                                    checked={settings.n8ao.enabled}
                                    onCheckedChange={(checked) => {
                                      handleSettingsChange(
                                        "n8ao",
                                        checked,
                                        "enabled"
                                      );
                                      pushHistory(
                                        `N8AO ${checked ? "on" : "off"}`
                                      );
                                    }}
                                  />
                                </div>
                                {settings.n8ao.enabled && (
                                  <>
                                    <div className='space-y-1.5'>
                                      <div className='flex justify-between items-center'>
                                        <Label
                                          htmlFor='n8aoIntensitySheetPanel'
                                          className='text-xs text-slate-300'
                                        >
                                          Intensity
                                        </Label>
                                        <span className='text-xs text-slate-400'>
                                          {settings.n8ao.intensity.toFixed(2)}
                                        </span>
                                      </div>
                                      <Slider
                                        id='n8aoIntensitySheetPanel'
                                        min={0.1}
                                        max={5}
                                        step={0.1}
                                        value={[settings.n8ao.intensity]}
                                        onValueChange={([v]) =>
                                          handleSettingsChange(
                                            "n8ao",
                                            v,
                                            "intensity"
                                          )
                                        }
                                        className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
                                      />
                                    </div>
                                    <div className='space-y-1.5'>
                                      <div className='flex justify-between items-center'>
                                        <Label
                                          htmlFor='n8aoRadiusSheetPanel'
                                          className='text-xs text-slate-300'
                                        >
                                          Radius
                                        </Label>
                                        <span className='text-xs text-slate-400'>
                                          {settings.n8ao.aoRadius.toFixed(2)}
                                        </span>
                                      </div>
                                      <Slider
                                        id='n8aoRadiusSheetPanel'
                                        min={0.01}
                                        max={2}
                                        step={0.01}
                                        value={[settings.n8ao.aoRadius]}
                                        onValueChange={([v]) =>
                                          handleSettingsChange(
                                            "n8ao",
                                            v,
                                            "aoRadius"
                                          )
                                        }
                                        className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
                                      />
                                    </div>
                                  </>
                                )}
                              </div>
                              <div className='p-3 border border-slate-600 rounded-md space-y-3 bg-slate-700/30 mt-4'>
                                <div className='flex items-center justify-between'>
                                  <Label
                                    htmlFor='bloomEnableSheetPanel'
                                    className='text-sm text-slate-200'
                                  >
                                    Bloom
                                  </Label>
                                  <Switch
                                    id='bloomEnableSheetPanel'
                                    checked={settings.bloom.enabled}
                                    onCheckedChange={(checked) => {
                                      handleSettingsChange(
                                        "bloom",
                                        checked,
                                        "enabled"
                                      );
                                      pushHistory(
                                        `Bloom ${checked ? "on" : "off"}`
                                      );
                                    }}
                                  />
                                </div>
                                {settings.bloom.enabled && (
                                  <>
                                    <div className='space-y-1.5'>
                                      <div className='flex justify-between items-center'>
                                        <Label
                                          htmlFor='bloomIntensitySheetPanel'
                                          className='text-xs text-slate-300'
                                        >
                                          Intensity
                                        </Label>
                                        <span className='text-xs text-slate-400'>
                                          {settings.bloom.intensity.toFixed(2)}
                                        </span>
                                      </div>
                                      <Slider
                                        id='bloomIntensitySheetPanel'
                                        min={0.1}
                                        max={3}
                                        step={0.1}
                                        value={[settings.bloom.intensity]}
                                        onValueChange={([v]) =>
                                          handleSettingsChange(
                                            "bloom",
                                            v,
                                            "intensity"
                                          )
                                        }
                                        className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
                                      />
                                    </div>
                                    <div className='space-y-1.5'>
                                      <div className='flex justify-between items-center'>
                                        <Label
                                          htmlFor='bloomThresholdSheetPanel'
                                          className='text-xs text-slate-300'
                                        >
                                          Luminance Threshold
                                        </Label>
                                        <span className='text-xs text-slate-400'>
                                          {settings.bloom.luminanceThreshold.toFixed(
                                            2
                                          )}
                                        </span>
                                      </div>
                                      <Slider
                                        id='bloomThresholdSheetPanel'
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        value={[
                                          settings.bloom.luminanceThreshold,
                                        ]}
                                        onValueChange={([v]) =>
                                          handleSettingsChange(
                                            "bloom",
                                            v,
                                            "luminanceThreshold"
                                          )
                                        }
                                        className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
                                      />
                                    </div>
                                  </>
                                )}
                              </div>
                            </section>
                          </div>
                        </ScrollArea>
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
                      <Canvas
                        shadows
                        camera={{
                          position: [0, 1.5, 7],
                          fov: 45,
                          near: 0.1,
                          far: 1000,
                        }}
                        gl={{
                          antialias: true,
                          alpha: canvasBgColor === "transparent",
                          preserveDrawingBuffer: true,
                          outputColorSpace: THREE.SRGBColorSpace,
                          toneMapping: THREE.ACESFilmicToneMapping,
                        }}
                        style={{ background: canvasBgColor }}
                        onCreated={({ gl, scene: canvasScene, camera }) => {
                          gl.toneMappingExposure = 1.0;
                          r3fSceneForExportRef.current = canvasScene;
                          r3fCameraForExportRef.current = camera;
                          if (camera && !canvasScene.camera)
                            canvasScene.camera = camera;
                          r3fGLContextRef.current = gl;
                        }}
                        key={canvasKey}
                      >
                        <Suspense fallback={null}>
                          <SceneContentInternal
                            settings={settings}
                            currentShape={currentShape}
                            animationPresetKey={animationPreset}
                            isAnimating={isAnimating}
                            importedModelUrl={importedModel?.url}
                            importedFileType={importedModel?.type}
                            importedMtlUrl={importedModel?.mtlUrl}
                            onModelLoad={handleModelLoadedForScene}
                            isImportedModelDisplayed={isImportedModelDisplayed}
                            current3DText={current3DText}
                            isTextVisible={isTextVisible}
                            customBgImageUrl={customBgImageUrl}
                            onMeshReady={handleMeshReadyForParent}
                            onSceneRefForExport={
                              handleSceneRefForExportCallback
                            }
                            activeActionRef={activeActionRef}
                            mixerRef={mixerRef}
                            selectedAnimationClipIndex={
                              selectedAnimationClipIndex
                            }
                            animationPlaybackState={animationPlaybackState}
                            isAnimationLooping={isAnimationLooping}
                            animationPlaybackSpeed={animationPlaybackSpeed}
                            animationTime={animationTime}
                            forceMaterialResetKey={forceMaterialResetKey}
                            sceneRefreshTrigger={sceneRefreshTrigger}
                            playAllAnimations={playAllAnimations}
                            forwardedOrbitControlsRef={orbitControlsRef}
                            textMaterialDef={textMaterialDef}
                            textTextureUrlsToLoad={textTextureUrlsToLoad}
                          />
                        </Suspense>
                      </Canvas>
                      {isLoadingModel && !isExporting && (
                        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800/80 p-4 rounded-lg text-center shadow-xl backdrop-blur-sm z-10'>
                          <Loader2 className='h-8 w-8 animate-spin text-purple-400 mx-auto mb-2' />
                          <p className='text-sm'>
                            Loading Model... {Math.round(modelLoadProgress)}%
                          </p>
                        </div>
                      )}
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
                {isImportedModelDisplayed &&
                  animationClipsRef.current.length > 0 && (
                    <AnimationPlaybackBar
                      animationClips={animationClipsRef.current}
                      selectedAnimationClipIndex={selectedAnimationClipIndex}
                      onAnimationClipChange={handleAnimationClipChange}
                      animationPlaybackState={animationPlaybackState}
                      onPlayPauseAnimation={handlePlayPauseAnimation}
                      onStopAnimation={handleStopAnimation}
                      isAnimationLooping={isAnimationLooping}
                      onAnimationLoopToggle={handleAnimationLoopToggle}
                      animationTime={animationTime}
                      onAnimationTimeChange={handleAnimationTimeChange}
                      animationDuration={animationDuration}
                      animationPlaybackSpeed={animationPlaybackSpeed}
                      onAnimationSpeedChange={handleAnimationSpeedChange}
                      playAllAnimations={playAllAnimations}
                      onPlayAllAnimationsToggle={handlePlayAllAnimationsToggle}
                    />
                  )}
              </div>
            </div>
            <footer className='text-center mt-10 sm:mt-16 py-6 border-t border-slate-700/50'>
              <p className='text-slate-400 text-sm'>
                © {new Date().getFullYear()} 3D Shape Studio Pro.
              </p>
              <p className='text-xs text-slate-500 mt-1'>
                Interactive 3D modeling and visualization.
              </p>
            </footer>
          </div>
        </div>
      </>
    </TooltipProvider>
  );
};
export default ModelViewer3D;
