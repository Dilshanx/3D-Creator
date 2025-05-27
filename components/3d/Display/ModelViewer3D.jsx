import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  Suspense,
} from "react";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

// IMPORTANT: Import GLTFLoader and DRACOLoader directly from three/examples
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
// Keep other loaders for useLoader hook
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js"; // Keep for useFBX
import { TDSLoader } from "three/examples/jsm/loaders/TDSLoader.js";

import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import {
  Text3D,
  Center,
  OrbitControls as DreiOrbitControls,
  Environment,
  useGLTF, // Still used if we revert, or for other potential uses
  useFBX, // Keep for FBX
  useTexture,
  Stats,
  Grid,
  Loader as DreiLoader,
  useProgress,
  Text,
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
  Eye,
  EyeOff,
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
  customImage: "Custom Image",
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
  textFontUrl: "/fonts/helvetiker_regular.typeface.json",
  textColor: "#E0E0E0",
  textSize: 0.5,
  textDepth: 0.05,
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
};

let helvetikerFontForExport = null;
const globalFontLoaderForExport = new FontLoader();
const FONT_PATH_FOR_EXPORT = "/fonts/helvetiker_regular.typeface.json";
globalFontLoaderForExport.load(
  FONT_PATH_FOR_EXPORT,
  (font) => {
    helvetikerFontForExport = font;
    console.log("Font for GLB export loaded.");
  },
  undefined,
  (err) => {
    console.error("Failed to load font for GLB export:", err);
  }
);

function createR3FMaterialProps(
  baseColor,
  materialType = "standard",
  customProps = {},
  envMap
) {
  const colorInput = new THREE.Color(baseColor);
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

  let materialEffectiveBaseColor = colorInput;
  if (
    customProps.mapUrl &&
    typeof customProps.mapUrl === "string" &&
    customProps.mapUrl.trim() !== ""
  ) {
    materialEffectiveBaseColor = new THREE.Color(0xffffff);
    console.log(
      "[createR3FMaterialProps] mapUrl found, setting materialEffectiveBaseColor to white. mapUrl:",
      customProps.mapUrl
    );
  } else {
    console.log(
      "[createR3FMaterialProps] No mapUrl, using baseColor for materialEffectiveBaseColor:",
      baseColor
    );
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
    materialType === "glass" || materialType === "crystal"
      ? THREE.MeshPhysicalMaterial
      : THREE.MeshStandardMaterial;
  const sharedArgs = {
    color: materialEffectiveBaseColor,
    metalness: finalProps.metalness,
    roughness: finalProps.roughness,
    envMap: envMap,
    envMapIntensity: finalProps.envMapIntensity,
    side: THREE.DoubleSide,
    ...((materialType === "glass" || materialType === "crystal") && {
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
  console.log("[TextureLoaderInternal] Initializing with urls:", urls);
  const loadedTextures = useTexture(urls);
  useEffect(() => {
    console.log(
      "[TextureLoaderInternal] Loaded textures (resolved):",
      loadedTextures
    );
    onLoaded(loadedTextures);
  }, [loadedTextures, onLoaded]);
  return null;
};
TextureLoaderInternal.displayName = "TextureLoaderInternal";

const AppliedMaterial = React.memo(
  ({
    materialProps = {
      constructor: THREE.MeshStandardMaterial,
      args: { color: "gray" },
      textureUrls: {},
    },
    textureUrls = {},
  }) => {
    console.log(
      "[AppliedMaterial FULL] Rendering. Props:",
      {
        constructorName: materialProps?.constructor?.name,
        args: JSON.stringify(materialProps?.args),
      },
      "textureUrls:",
      textureUrls
    );

    const validUrls = useMemo(() => {
      const filtered = Object.fromEntries(
        Object.entries(textureUrls).filter(
          ([_key, value]) =>
            value && typeof value === "string" && value.trim() !== ""
        )
      );
      console.log("[AppliedMaterial FULL] Calculated validUrls:", filtered);
      return filtered;
    }, [textureUrls]);

    const hasValidUrls = Object.keys(validUrls).length > 0;
    const [internallyLoadedTextures, setInternallyLoadedTextures] =
      useState(null);

    const handleTexturesLoaded = useCallback((loaded) => {
      console.log(
        "[AppliedMaterial FULL handleTexturesLoaded] Received from internal loader:",
        loaded
      );
      setInternallyLoadedTextures(loaded);
    }, []);

    useEffect(() => {
      console.log(
        "[AppliedMaterial FULL] State 'internallyLoadedTextures' updated:",
        internallyLoadedTextures
      );
    }, [internallyLoadedTextures]);

    const texturesToApply = useMemo(() => {
      const newTextures = {};
      if (hasValidUrls && internallyLoadedTextures) {
        Object.keys(validUrls).forEach((originalUrlKey) => {
          const textureObject = internallyLoadedTextures[originalUrlKey];
          if (textureObject && textureObject.isTexture) {
            newTextures[originalUrlKey.replace("Url", "")] = textureObject;
          } else {
            console.warn(
              `[AppliedMaterial FULL textures.useMemo] Texture for ${originalUrlKey} not a THREE.Texture. Received:`,
              textureObject
            );
          }
        });
      }
      console.log(
        "[AppliedMaterial FULL textures.useMemo] Derived 'texturesToApply':",
        newTextures
      );
      return newTextures;
    }, [validUrls, internallyLoadedTextures, hasValidUrls]);

    useEffect(() => {
      console.log(
        "[AppliedMaterial FULL configureEffect] Configuring texturesToApply:",
        texturesToApply
      );
      if (texturesToApply.map && texturesToApply.map.isTexture) {
        texturesToApply.map.colorSpace = THREE.SRGBColorSpace;
        console.log(
          "[AppliedMaterial FULL configureEffect] textures.map found. Image:",
          texturesToApply.map.image
        );
        if (texturesToApply.map.image) {
          console.log(
            `[AppliedMaterial FULL configureEffect] Map image dimensions: ${texturesToApply.map.image.width}x${texturesToApply.map.image.height}`
          );
        }
      }
      if (
        texturesToApply.emissiveMap &&
        texturesToApply.emissiveMap.isTexture
      ) {
        texturesToApply.emissiveMap.colorSpace = THREE.SRGBColorSpace;
        console.log(
          "[AppliedMaterial FULL configureEffect] textures.emissiveMap found."
        );
      }
      Object.values(texturesToApply).forEach((tex) => {
        if (tex && tex.isTexture) {
          tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        }
      });
    }, [texturesToApply]);

    const safeMaterialArgs = materialProps?.args || {
      color: new THREE.Color("magenta"),
    };
    const MaterialConstructor =
      materialProps?.constructor || THREE.MeshStandardMaterial;
    const allArgs = { ...safeMaterialArgs, ...texturesToApply };

    console.log(
      "[AppliedMaterial FULL] Final 'allArgs' for material component:",
      JSON.stringify({
        ...allArgs,
        color: allArgs.color?.getHexString
          ? allArgs.color.getHexString()
          : allArgs.color,
        map: allArgs.map ? "Texture Present" : "No Map",
        envMap: allArgs.envMap ? "EnvMap Present" : "No EnvMap",
      })
    );

    return (
      <>
        {hasValidUrls && (
          <Suspense fallback={null}>
            <TextureLoaderInternal
              key={JSON.stringify(validUrls)}
              urls={validUrls}
              onLoaded={handleTexturesLoaded}
            />
          </Suspense>
        )}
        {MaterialConstructor === THREE.MeshPhysicalMaterial ? (
          <meshPhysicalMaterial {...allArgs} />
        ) : (
          <meshStandardMaterial {...allArgs} />
        )}
      </>
    );
  }
);
AppliedMaterial.displayName = "AppliedMaterial (Full)";

const ProceduralShape = React.memo(
  React.forwardRef(
    ({ shapeId, settings, size, animationPresetKey, isAnimating }, ref) => {
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
        let config = shapeConfigs[shapeId];
        if (!config || typeof config.creator !== "function") {
          console.warn(
            `[ProceduralShape] Invalid or missing shapeId: "${shapeId}". Defaulting to "cat".`
          );
          config = shapeConfigs.cat;
        }
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
        console.log(
          `[ProceduralShape ${shapeId || "defaulting"}] Geometry UVs:`,
          geom.attributes.uv
        );
        return geom;
      }, [shapeId, settings.extrudeDepth, settings.quality, size]);

      const { materialDef, textureUrlsToLoad } = useMemo(() => {
        let autoMaterialType = "ceramic";
        for (const catId in SHAPES_BY_CATEGORY_DATA) {
          const foundShape = SHAPES_BY_CATEGORY_DATA[catId].find(
            (s) => s.id === shapeId
          );
          if (foundShape && foundShape.autoMaterial) {
            autoMaterialType = foundShape.autoMaterial;
            break;
          }
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
      useFrame((state, delta) => {
        if (internalMeshRef.current && isAnimating) {
          const animSettings = settings;
          const preset = animationPresets[animationPresetKey];
          if (preset) {
            const effDelta = delta * animSettings.animationSpeed;
            animationState.current.targetRotation.x +=
              preset.rotationSpeed[0] * 60 * effDelta;
            animationState.current.targetRotation.y +=
              preset.rotationSpeed[1] * 60 * effDelta;
            animationState.current.targetRotation.z +=
              preset.rotationSpeed[2] * 60 * effDelta;
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
              Math.sin(floatTime * (preset.floatSpeed || 0.0001) * 100) *
              (preset.floatAmplitude || 0);
            internalMeshRef.current.position.y = animationState.current.floatY;
          }
        }
      });

      console.log(
        `[ProceduralShape ${
          shapeId || "defaulting"
        }] Rendering. Received settings.customMaterialProperties.mapUrl:`,
        settings.customMaterialProperties.mapUrl
      );
      console.log(
        `[ProceduralShape ${
          shapeId || "defaulting"
        }] Derived textureUrlsToLoad (passed to AppliedMaterial):`,
        textureUrlsToLoad
      );
      console.log(
        `[ProceduralShape ${
          shapeId || "defaulting"
        }] Derived materialDef (passed to AppliedMaterial):`,
        materialDef
      );

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

// MODIFIED ImportedModel to use manual GLTFLoader for GLB/GLTF
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
        animationClipsRef,
        activeActionRef,
        mixerRef: externalMixerRef,
        selectedAnimationClipIndex,
        animationPlaybackState,
        isAnimationLooping,
        animationPlaybackSpeed,
        animationTime,
      },
      ref
    ) => {
      console.log("[ImportedModel] PROPS RECEIVED:", {
        modelUrl: modelUrl?.substring(0, 100),
        fileType,
        mtlUrl,
      });
      const internalGroupRef = useRef();
      const { scene: r3fScene } = useThree();
      React.useImperativeHandle(ref, () => internalGroupRef.current);

      const [manualLoadedScene, setManualLoadedScene] = useState(null);
      const [manualLoadedAnimations, setManualLoadedAnimations] = useState([]);
      const dracoPath = "/draco/gltf/";

      const processLoadedObject = useCallback(
        (object, animations) => {
          console.log(
            "[ImportedModel processLoadedObject] Starting processing for object:",
            object?.name,
            "Filetype:",
            fileType
          );
          const targetObject = object || internalGroupRef.current; // Prioritize passed object

          if (!targetObject) {
            console.error(
              "[ImportedModel processLoadedObject] targetObject is null or undefined. Cannot process."
            );
            onModelLoad(null, animations);
            return;
          }

          // Ensure targetObject is added to the scene graph if it's the root for Box3 computation
          // This is usually handled if `object` is the scene from GLTFLoader.
          // If targetObject is internalGroupRef.current, it should already be in the scene.
          let box = new THREE.Box3().setFromObject(targetObject);
          if (box.isEmpty()) {
            console.warn(
              "[ImportedModel processLoadedObject] Initial Bounding box is empty for targetObject:",
              targetObject.name
            );
            let foundMeshGeometry = false;
            targetObject.traverse((child) => {
              if (child.isMesh && !foundMeshGeometry) {
                const childBox = new THREE.Box3().setFromObject(child);
                if (!childBox.isEmpty()) {
                  box.copy(childBox);
                  foundMeshGeometry = true;
                  console.log(
                    "[ImportedModel processLoadedObject] Using bounding box of child mesh:",
                    child.name
                  );
                }
              }
            });
            if (box.isEmpty()) {
              console.warn(
                "[ImportedModel processLoadedObject] Bounding box still empty after checking children. Applying default scale/pos."
              );
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
            const desiredDisplaySize = 3;
            const scaleFactor = maxDim > 0 ? desiredDisplaySize / maxDim : 1;
            targetObject.scale.setScalar(saneNumber(scaleFactor, 1));
            const scaledBox = new THREE.Box3().setFromObject(targetObject);
            const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
            if (
              !isNaN(scaledCenter.x) &&
              !isNaN(scaledCenter.y) &&
              !isNaN(scaledCenter.z)
            ) {
              targetObject.position.sub(scaledCenter);
            } else {
              console.warn(
                "[ImportedModel processLoadedObject] Scaled center is NaN. Setting position to 0,0,0."
              );
              targetObject.position.set(0, 0, 0);
            }
          }

          const anyCustomTextureUrlSpecified =
            settings.customMaterialProperties.mapUrl ||
            settings.customMaterialProperties.normalMapUrl ||
            settings.customMaterialProperties.roughnessMapUrl ||
            settings.customMaterialProperties.metalnessMapUrl ||
            settings.customMaterialProperties.aoMapUrl ||
            settings.customMaterialProperties.emissiveMapUrl;
          const shouldOverrideMaterials =
            (fileType === "gltf" ||
              fileType === "glb" ||
              fileType === "fbx" ||
              (fileType === "obj" && mtlUrl)) &&
            anyCustomTextureUrlSpecified;

          console.log(
            `[ImportedModel processLoadedObject] FileType: ${fileType}, MTL: ${!!mtlUrl}, AnyCustomTexture: ${!!anyCustomTextureUrlSpecified}, ShouldOverride: ${shouldOverrideMaterials}`
          );

          if (shouldOverrideMaterials) {
            console.log(
              `[ImportedModel] Overriding ALL materials for ${fileType} due to custom texture settings.`
            );
            const materialTypeForOverride =
              settings.materialType !== "auto"
                ? settings.materialType
                : "ceramic";
            const {
              constructor: MatConstructor,
              args: baseMaterialArgs,
              textureUrls: textureUrlsFromSettings,
            } = createR3FMaterialProps(
              settings.shapeColor,
              materialTypeForOverride,
              settings.customMaterialProperties,
              r3fScene.environment
            );
            const textureLoader = new THREE.TextureLoader();
            targetObject.traverse(async (child) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                console.log(
                  `[ImportedModel] Applying new (override) material to mesh: ${
                    child.name || "Unnamed Mesh"
                  }`
                );
                const newMaterial = new MatConstructor(baseMaterialArgs);
                const applyTexture = async (
                  mapName,
                  url,
                  colorSpace = null
                ) => {
                  if (url) {
                    try {
                      console.log(
                        `[ImportedModel] Loading texture for override: ${mapName} from ${url.substring(
                          0,
                          100
                        )}...`
                      );
                      const tex = await textureLoader.loadAsync(url);
                      console.log(
                        `[ImportedModel] Texture LOADED for override: ${mapName}`
                      );
                      if (colorSpace) tex.colorSpace = colorSpace;
                      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
                      newMaterial[mapName] = tex;
                      newMaterial.needsUpdate = true;
                    } catch (e) {
                      console.error(
                        `Error loading ${mapName} for override: ${url}`,
                        e
                      );
                    }
                  }
                };
                await applyTexture(
                  "map",
                  textureUrlsFromSettings.mapUrl,
                  THREE.SRGBColorSpace
                );
                await applyTexture(
                  "normalMap",
                  textureUrlsFromSettings.normalMapUrl
                );
                await applyTexture(
                  "roughnessMap",
                  textureUrlsFromSettings.roughnessMapUrl
                );
                await applyTexture(
                  "metalnessMap",
                  textureUrlsFromSettings.metalnessMapUrl
                );
                await applyTexture("aoMap", textureUrlsFromSettings.aoMapUrl);
                await applyTexture(
                  "emissiveMap",
                  textureUrlsFromSettings.emissiveMapUrl,
                  THREE.SRGBColorSpace
                );
                if (
                  child.material &&
                  typeof child.material.dispose === "function"
                )
                  child.material.dispose();
                child.material = newMaterial;
              }
            });
          } else if (fileType !== "stl" && !(fileType === "obj" && !mtlUrl)) {
            targetObject.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material) {
                  const materials = Array.isArray(child.material)
                    ? child.material
                    : [child.material];
                  materials.forEach((mat) => {
                    mat.side = THREE.DoubleSide;
                    if (!mat.envMap && r3fScene.environment)
                      mat.envMap = r3fScene.environment;
                    mat.envMapIntensity =
                      settings.customMaterialProperties.envMapIntensity ??
                      mat.envMapIntensity ??
                      1.0;
                    mat.needsUpdate = true;
                  });
                }
              }
            });
          }
          onModelLoad(targetObject, animations);
        },
        [
          r3fScene.environment,
          settings.shapeColor,
          settings.materialType,
          settings.customMaterialProperties,
          onModelLoad,
          fileType,
          mtlUrl,
          internalGroupRef,
        ] // internalGroupRef added
      );

      // Manual GLTFLoader effect
      useEffect(() => {
        if ((fileType === "glb" || fileType === "gltf") && modelUrl) {
          console.log(
            `[ImportedModel Manual GLTFLoader] Attempting to load ${fileType.toUpperCase()}: ${modelUrl.substring(
              0,
              100
            )}...`
          );
          const loader = new GLTFLoader();
          const dracoLoaderInstance = new DRACOLoader();
          dracoLoaderInstance.setDecoderPath(dracoPath);
          loader.setDRACOLoader(dracoLoaderInstance);

          loader.load(
            modelUrl,
            (gltf) => {
              console.log(
                "[ImportedModel Manual GLTFLoader] Load successful:",
                gltf
              );
              setManualLoadedScene(gltf.scene);
              setManualLoadedAnimations(gltf.animations || []);
              // processLoadedObject is now called in the effect below that watches manualLoadedScene
            },
            undefined,
            (error) => {
              console.error(
                "[ImportedModel Manual GLTFLoader] Load error:",
                error
              );
              if (
                error.message &&
                error.message.includes("KHR_materials_pbrSpecularGlossiness")
              ) {
                sonnerToast.error("GLB Load Error", {
                  description:
                    "Model uses an older material type (SpecularGlossiness). Try re-exporting with MetallicRoughness.",
                });
              } else if (
                error.message &&
                error.message.includes("DRACOLoader")
              ) {
                sonnerToast.error("GLB Load Error", {
                  description:
                    "Draco decompression failed. Ensure Draco decoder files are in public/draco/gltf/.",
                });
              } else {
                sonnerToast.error("GLB Load Error", {
                  description: `Failed to load the ${fileType.toUpperCase()} model. Check console for details.`,
                });
              }
              setManualLoadedScene(null);
              setManualLoadedAnimations([]);
            }
          );
          return () => {
            dracoLoaderInstance.dispose();
          };
        } else {
          setManualLoadedScene(null);
          setManualLoadedAnimations([]); // Clear if not glb/gltf
        }
      }, [fileType, modelUrl, dracoPath]);

      const fbxResult = useMemo(() => {
        if (fileType === "fbx") {
          console.log(
            `[ImportedModel] Attempting to load FBX: ${modelUrl?.substring(
              0,
              100
            )}...`
          );
          try {
            return useFBX(modelUrl);
          } catch (e) {
            console.error("[ImportedModel] Error in useFBX memo:", e);
            return null;
          }
        }
        return null;
      }, [fileType, modelUrl]);
      const stlGeometry = useMemo(() => {
        if (fileType === "stl") {
          console.log(
            `[ImportedModel] Attempting to load STL: ${modelUrl?.substring(
              0,
              100
            )}...`
          );
          try {
            return useLoader(STLLoader, modelUrl);
          } catch (e) {
            console.error(
              "[ImportedModel] Error in useLoader<STLLoader> memo:",
              e
            );
            return null;
          }
        }
        return null;
      }, [fileType, modelUrl]);
      const objResult = useMemo(() => {
        if (fileType === "obj") {
          console.log(
            `[ImportedModel] Attempting to load OBJ: ${modelUrl?.substring(
              0,
              100
            )}... MTL: ${mtlUrl}`
          );
          try {
            const materials = mtlUrl
              ? useLoader(MTLLoader, mtlUrl, (loader) => {
                  if (mtlUrl)
                    loader.setResourcePath(
                      mtlUrl.substring(0, mtlUrl.lastIndexOf("/") + 1)
                    );
                })
              : null;
            return useLoader(OBJLoader, modelUrl, (loader) => {
              if (materials) {
                materials.preload();
                loader.setMaterials(materials);
              }
            });
          } catch (e) {
            console.error(
              "[ImportedModel] Error in useLoader<OBJLoader> memo:",
              e
            );
            return null;
          }
        }
        return null;
      }, [fileType, modelUrl, mtlUrl]);

      console.log(
        "[ImportedModel] manualLoadedScene (before processEffect):",
        manualLoadedScene ? "Exists" : "null"
      );
      console.log(
        "[ImportedModel] fbxResult (before processEffect):",
        fbxResult ? "Exists" : "null"
      );
      console.log(
        "[ImportedModel] stlGeometry (before processEffect):",
        stlGeometry ? "Exists" : "null"
      );
      console.log(
        "[ImportedModel] objResult (before processEffect):",
        objResult ? "Exists" : "null"
      );

      useEffect(() => {
        console.log(
          "[ImportedModel processEffect] Running. ManualGLTFScene:",
          manualLoadedScene ? "Exists" : "null",
          "FBX:",
          fbxResult ? "Exists" : "null",
          "STL:",
          stlGeometry ? "Exists" : "null",
          "OBJ:",
          objResult ? "Exists" : "null"
        );
        let objectForProcessing = null;
        let animationsForProcessing = [];

        if (fileType === "glb" || fileType === "gltf") {
          if (manualLoadedScene) {
            objectForProcessing = manualLoadedScene;
            animationsForProcessing = manualLoadedAnimations;
            console.log(
              "[ImportedModel processEffect] Using Manual GLTF/GLB result."
            );
          }
        } else if (fbxResult && fileType === "fbx") {
          objectForProcessing = fbxResult;
          animationsForProcessing = fbxResult.animations || [];
          console.log("[ImportedModel processEffect] Using FBX result.");
        } else if (objResult && fileType === "obj" && mtlUrl) {
          // OBJ with MTL
          objectForProcessing = objResult;
          console.log("[ImportedModel processEffect] Using OBJ+MTL result.");
        } else if (
          stlGeometry &&
          fileType === "stl" &&
          internalGroupRef.current
        ) {
          // STL
          objectForProcessing = internalGroupRef.current; // Process the group for STL
          console.log(
            "[ImportedModel processEffect] Using STL result (processing group)."
          );
        } else if (
          objResult &&
          fileType === "obj" &&
          !mtlUrl &&
          internalGroupRef.current
        ) {
          // OBJ without MTL
          objectForProcessing = internalGroupRef.current; // Process the group for OBJ-no-MTL
          console.log(
            "[ImportedModel processEffect] Using OBJ-no-MTL result (processing group)."
          );
        }

        console.log(
          "[ImportedModel processEffect] determined objectForProcessing:",
          objectForProcessing ? objectForProcessing.name || "Unnamed" : "None"
        );
        console.log(
          "[ImportedModel processEffect] internalGroupRef.current for processing:",
          internalGroupRef.current
        );

        if (objectForProcessing) {
          // Check internalGroupRef.current as well for STL/OBJ-no-MTL case if target is group
          console.log(
            `[ImportedModel processEffect] Calling processLoadedObject for ${fileType}.`
          );
          processLoadedObject(objectForProcessing, animationsForProcessing);
        } else {
          console.log(
            "[ImportedModel processEffect] No loaded object or ref ready for processLoadedObject in this cycle."
          );
        }
      }, [
        manualLoadedScene,
        manualLoadedAnimations,
        fbxResult,
        stlGeometry,
        objResult,
        processLoadedObject,
        fileType,
        mtlUrl,
      ]);

      const animationState = useRef({ startTime: Date.now() });
      useFrame((state, delta) => {
        if (
          internalGroupRef.current &&
          isAnimating &&
          (!animationClipsRef.current || animationClipsRef.current.length === 0)
        ) {
          const animSettings = settings;
          const preset = animationPresets[animationPresetKey];
          if (preset) {
            const floatTime =
              (Date.now() - animationState.current.startTime) *
              0.001 *
              animSettings.animationSpeed;
            internalGroupRef.current.position.y =
              Math.sin(floatTime * (preset.floatSpeed || 0.0001) * 100) *
              (preset.floatAmplitude || 0);
          }
        }
        if (externalMixerRef.current && animationPlaybackState === "playing") {
          externalMixerRef.current.update(delta * animationPlaybackSpeed);
        }
      });
      useEffect(() => {
        const currentGroup = internalGroupRef.current;
        const clipsToUse =
          fileType === "glb" || fileType === "gltf"
            ? manualLoadedAnimations
            : animationClipsRef.current || [];

        if (currentGroup && clipsToUse.length > 0) {
          console.log(
            "[ImportedModel AnimationEffect] Setting up mixer for target:",
            currentGroup,
            "with clips:",
            clipsToUse.length
          );
          externalMixerRef.current = new THREE.AnimationMixer(currentGroup);
          if (
            selectedAnimationClipIndex >= 0 &&
            selectedAnimationClipIndex < clipsToUse.length
          ) {
            const clip = clipsToUse[selectedAnimationClipIndex];
            activeActionRef.current = externalMixerRef.current.clipAction(clip);
            if (animationPlaybackState === "playing")
              activeActionRef.current.play();
            activeActionRef.current.setLoop(
              isAnimationLooping ? THREE.LoopRepeat : THREE.LoopOnce,
              Infinity
            );
            activeActionRef.current.timeScale = animationPlaybackSpeed;
            activeActionRef.current.time = animationTime * clip.duration;
          }
        }
        return () => {
          if (externalMixerRef.current) {
            console.log("[ImportedModel AnimationEffect] Cleaning up mixer.");
            externalMixerRef.current.stopAllAction();
            externalMixerRef.current = null;
            activeActionRef.current = null;
          }
        };
      }, [
        manualLoadedScene,
        fbxResult,
        objResult,
        selectedAnimationClipIndex,
        animationPlaybackState,
        isAnimationLooping,
        animationPlaybackSpeed,
        animationTime,
        manualLoadedAnimations,
      ]); // Added manualLoadedAnimations

      console.log(
        `[ImportedModel Render] Top. FileType: ${fileType}, STL: ${!!stlGeometry}, OBJ: ${!!objResult}, MTL: ${!!mtlUrl}, ManualGLTF: ${!!manualLoadedScene}`
      );
      if (fileType === "stl" || (fileType === "obj" && !mtlUrl)) {
        console.log(
          `[ImportedModel Render] Path for STL or OBJ-no-MTL. FileType: ${fileType}`
        );
        let geometryToUse = null;
        if (fileType === "stl") {
          geometryToUse = stlGeometry;
        } else if (fileType === "obj" && !mtlUrl && objResult) {
          if (objResult.isGroup) {
            const firstMesh = objResult.children.find((c) => c.isMesh);
            geometryToUse = firstMesh?.geometry;
            if (!geometryToUse)
              console.warn(
                "[ImportedModel Render] OBJ group without MTL: No mesh with geometry found."
              );
          } else if (objResult.isMesh) {
            geometryToUse = objResult.geometry;
          } else if (objResult.isBufferGeometry) {
            geometryToUse = objResult;
          }
        }
        console.log(
          `[ImportedModel Render] Geometry for STL/OBJ-no-MTL: ${
            geometryToUse ? "Found" : "Not Found"
          }`
        );

        if (geometryToUse) {
          const {
            constructor: MatConstructor,
            args: materialArgs,
            textureUrls: textureUrlsFromSettings,
          } = createR3FMaterialProps(
            settings.shapeColor,
            settings.materialType !== "auto"
              ? settings.materialType
              : "ceramic",
            settings.customMaterialProperties,
            r3fScene.environment
          );

          if (fileType === "obj" && !mtlUrl && objResult?.isGroup) {
            console.warn(
              "[ImportedModel Render] Rendering grouped OBJ without MTL. Materials are overridden in processLoadedObject. Rendering as primitive."
            );
            return <primitive object={objResult} ref={internalGroupRef} />; // Pass the whole group
          }

          console.log(
            "[ImportedModel Render] Rendering STL/single-OBJ-no-MTL with AppliedMaterial."
          );
          return (
            <group ref={internalGroupRef}>
              <mesh geometry={geometryToUse} castShadow receiveShadow>
                <AppliedMaterial
                  materialProps={{
                    constructor: MatConstructor,
                    args: materialArgs,
                  }}
                  textureUrls={textureUrlsFromSettings}
                />
              </mesh>
            </group>
          );
        }
        console.log(
          `[ImportedModel Render] Fallback for STL/OBJ-no-MTL: Error getting geometry.`
        );
        return (
          <group ref={internalGroupRef}>
            <Center>
              <Text
                color='orange'
                fontSize={0.2}
                anchorX='center'
                anchorY='middle'
                material-depthWrite={false}
              >
                Error: Could not get geometry for {fileType}
              </Text>
            </Center>
          </group>
        );
      }

      let objectToRender = null;
      if (fileType === "glb" || fileType === "gltf") {
        objectToRender = manualLoadedScene; // Use state from manual loader
      } else if (fbxResult) {
        objectToRender = fbxResult;
      } else if (objResult) {
        // This covers OBJ with MTL
        objectToRender = objResult;
      }

      console.log(
        `[ImportedModel Render] Path for GLTF/FBX/OBJ+MTL. objectToRender: ${
          objectToRender ? objectToRender.name || "Unnamed" : "None"
        }`
      );

      if (objectToRender) {
        console.log(
          "[ImportedModel Render] Rendering <primitive> with object:",
          objectToRender.name || "Unnamed"
        );
        return (
          <primitive
            object={objectToRender}
            ref={internalGroupRef}
            castShadow
            receiveShadow
          />
        );
      }

      console.log(
        "[ImportedModel Render] Reaching final fallback (Loading model...)."
      );
      return (
        <group ref={internalGroupRef}>
          <Center>
            <Text
              color='white'
              fontSize={0.2}
              anchorX='center'
              anchorY='middle'
              material-depthWrite={false}
            >
              Loading model...
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
    color,
    size,
    depth,
    isVisible,
    textYOffset,
    materialProps,
  }) => {
    const { scene } = useThree();
    const textMaterial = useMemo(() => {
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        metalness: saneNumber(materialProps?.metalness, 0.3),
        roughness: saneNumber(materialProps?.roughness, 0.5),
        envMap: scene.environment,
        envMapIntensity: saneNumber(materialProps?.envMapIntensity, 1.0),
        side: THREE.FrontSide,
      });
    }, [color, materialProps, scene.environment]);
    if (!isVisible || !text || !fontUrl) return null;
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
            material={textMaterial}
            castShadow
            receiveShadow
          >
            {text}
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
    animationClipsRef,
    activeActionRef,
    mixerRef,
    selectedAnimationClipIndex,
    animationPlaybackState,
    isAnimationLooping,
    animationPlaybackSpeed,
    animationTime,
  }) => {
    const { scene, gl } = useThree();
    useEffect(() => {
      if (onSceneRefForExport) onSceneRefForExport(scene, gl);
    }, [scene, gl, onSceneRefForExport]);
    useEffect(() => {
      if (settings.background === "customImage" && customBgImageUrl) {
        if (scene.fog) scene.fog = null;
      } else {
        let fogColor = new THREE.Color(0x101012);
        let fogNear = 12;
        let fogFar = 40;
        switch (settings.background) {
          case "modernGradient":
            fogColor = new THREE.Color(0x2c5d72);
            break;
          case "darkSpace":
            fogColor = new THREE.Color(0x050508);
            fogNear = 10;
            fogFar = 35;
            break;
          case "softLight":
            fogColor = new THREE.Color(0xd0d8e0);
            fogNear = 7;
            fogFar = 28;
            break;
          case "studioLight":
            fogColor = new THREE.Color(0xe4e4e7);
            fogNear = 10;
            fogFar = 35;
            break;
          default:
            fogColor = new THREE.Color(0x18181b);
        }
        if (scene.fog) {
          scene.fog.color.set(fogColor);
          scene.fog.near = fogNear;
          scene.fog.far = fogFar;
        } else {
          scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);
        }
      }
    }, [settings.background, customBgImageUrl, scene]);
    const internalMeshRef = useRef();
    useEffect(() => {
      onMeshReady(internalMeshRef.current || null);
    }, [
      internalMeshRef.current,
      onMeshReady,
      isImportedModelDisplayed,
      currentShape,
      importedModelUrl,
    ]);
    const [textYOffset, setTextYOffset] = useState(1.0);
    useEffect(() => {
      const meshToMeasure = internalMeshRef.current;
      if (meshToMeasure) {
        requestAnimationFrame(() => {
          if (meshToMeasure.parent) {
            const box = new THREE.Box3().setFromObject(meshToMeasure);
            if (!box.isEmpty()) {
              const modelHeight = box.max.y - box.min.y;
              const modelCenterY = box.getCenter(new THREE.Vector3()).y;
              setTextYOffset(
                modelCenterY +
                  modelHeight / 2 +
                  saneNumber(settings.textSize, 0.5) * 0.5 +
                  0.3
              );
            } else {
              setTextYOffset(
                1.5 + saneNumber(settings.textSize, 0.5) * 0.5 + 0.3
              );
            }
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
      internalMeshRef.current,
      settings.textSize,
      isImportedModelDisplayed,
      currentShape,
      importedModelUrl,
      current3DText,
      isTextVisible,
    ]);
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
        />{" "}
        <Suspense fallback={null}>
          {" "}
          {settings.background === "customImage" && customBgImageUrl ? (
            <Environment background files={customBgImageUrl} />
          ) : settings.background !== "modernGradient" &&
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
          ) : null}{" "}
          {(settings.background === "modernGradient" ||
            settings.background === "darkSpace") && (
            <Environment
              files='/brown_photostudio_02_4k.hdr'
              background={false}
              environmentIntensity={0.5}
            />
          )}{" "}
        </Suspense>{" "}
        <Grid
          infiniteGrid
          cellSize={0.5}
          cellThickness={0.5}
          sectionSize={2.5}
          sectionThickness={1}
          sectionColor={new THREE.Color(0x6f6f6f)}
          cellColor={new THREE.Color(0x444444)}
          fadeDistance={50}
        />{" "}
        {!isImportedModelDisplayed ? (
          <Suspense fallback={null}>
            <ProceduralShape
              ref={internalMeshRef}
              shapeId={currentShape}
              settings={settings}
              size={1.5}
              animationPresetKey={animationPresetKey}
              isAnimating={isAnimating}
            />
          </Suspense>
        ) : importedModelUrl ? (
          <Suspense fallback={null}>
            <ImportedModel
              ref={internalMeshRef}
              modelUrl={importedModelUrl}
              fileType={importedFileType}
              mtlUrl={importedMtlUrl}
              settings={settings}
              onModelLoad={onModelLoad}
              isAnimating={isAnimating}
              animationPresetKey={animationPresetKey}
              animationClipsRef={animationClipsRef}
              activeActionRef={activeActionRef}
              mixerRef={mixerRef}
              selectedAnimationClipIndex={selectedAnimationClipIndex}
              animationPlaybackState={animationPlaybackState}
              isAnimationLooping={isAnimationLooping}
              animationPlaybackSpeed={animationPlaybackSpeed}
              animationTime={animationTime}
            />
          </Suspense>
        ) : null}{" "}
        <TextOverlay
          text={current3DText}
          fontUrl={settings.textFontUrl}
          color={settings.textColor}
          size={settings.textSize}
          depth={settings.textDepth}
          isVisible={isTextVisible}
          textYOffset={textYOffset}
          materialProps={{ metalness: 0.4, roughness: 0.6 }}
        />{" "}
        <DreiOrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          screenSpacePanning={false}
          minDistance={1}
          maxDistance={30}
          maxPolarAngle={Math.PI / 1.6}
          target={[0, 0.2, 0]}
        />{" "}
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
            )}{" "}
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
        customBgImageUrl,
        current3DText,
        isTextVisible,
      })
    );
  }, [
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
    customBgImageUrl,
    current3DText,
    isTextVisible,
  ]);
  const applyState = useCallback(
    (stateToApply) => {
      isUndoingRedoingRef.current = true;
      setSettings(stateToApply.settings);
      setCurrentCategory(stateToApply.currentCategory);
      setCurrentShape(stateToApply.currentShape);
      setAnimationPreset(stateToApply.animationPreset);
      setIsAnimating(stateToApply.isAnimating);
      setImportedModelName(stateToApply.importedModelName);
      if (
        stateToApply.importedModelUrl &&
        stateToApply.importedModelUrl !== importedModel?.url
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
      setCustomBgImageUrl(stateToApply.customBgImageUrl);
      setCurrent3DText(stateToApply.current3DText);
      setIsTextVisible(stateToApply.isTextVisible);
      setTextInput(stateToApply.current3DText);
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
      console.log("History pushed:", actionName, historyPointerRef.current);
    },
    [captureAppState]
  );
  const handleUndo = useCallback(() => {
    if (historyPointerRef.current > 0) {
      historyPointerRef.current--;
      applyState(historyStackRef.current[historyPointerRef.current]);
      sonnerToast.info("Undo");
    } else {
      sonnerToast.warning("Nothing more to undo.");
    }
  }, [applyState]);
  const handleRedo = useCallback(() => {
    if (historyPointerRef.current < historyStackRef.current.length - 1) {
      historyPointerRef.current++;
      applyState(historyStackRef.current[historyPointerRef.current]);
      sonnerToast.info("Redo");
    } else {
      sonnerToast.warning("Nothing more to redo.");
    }
  }, [applyState]);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    if (isMounted) {
      const timeoutId = setTimeout(() => {
        pushHistory("initial load");
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isMounted, pushHistory]);
  const debouncedPushHistoryRef = useRef(null);
  useEffect(() => {
    if (!isMounted) return;
    if (debouncedPushHistoryRef.current)
      clearTimeout(debouncedPushHistoryRef.current);
    debouncedPushHistoryRef.current = setTimeout(() => {
      if (isMounted && !isUndoingRedoingRef.current)
        pushHistory("settings/state changed");
    }, 750);
    return () => {
      if (debouncedPushHistoryRef.current)
        clearTimeout(debouncedPushHistoryRef.current);
    };
  }, [
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
    customBgImageUrl,
    current3DText,
    isTextVisible,
    pushHistory,
    isMounted,
  ]);
  const toggleFullscreen = useCallback(async () => {
    if (!viewerCardRef.current) return;
    if (!document.fullscreenElement) {
      try {
        await viewerCardRef.current.requestFullscreen();
      } catch (err) {
        sonnerToast.error("Fullscreen Failed", { description: err.message });
      }
    } else {
      if (document.exitFullscreen) {
        try {
          await document.exitFullscreen();
        } catch (err) {
          sonnerToast.error("Exit Fullscreen Failed", {
            description: err.message,
          });
        }
      }
    }
  }, []);
  useEffect(() => {
    const handleFullscreenChange = () =>
      setIsFullscreen(!!document.fullscreenElement);
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
  const handleMeshReadyForParent = useCallback((mesh) => {
    meshToExportOrScreenshotRef.current = mesh;
  }, []);
  const handleSceneRefForExportCallback = useCallback((scene, gl) => {
    r3fSceneForExportRef.current = scene;
    r3fGLContextRef.current = gl;
  }, []);
  const handleModelLoadedForScene = useCallback((loadedObject, loadedAnims) => {
    animationClipsRef.current = loadedAnims || [];
    if (loadedObject && animationClipsRef.current.length > 0) {
      setSelectedAnimationClipIndex(0);
      setAnimationDuration(animationClipsRef.current[0].duration);
      setAnimationPlaybackState("stopped");
      setAnimationTime(0);
    } else {
      setSelectedAnimationClipIndex(-1);
      setAnimationDuration(0);
    }
  }, []);
  const handleResetAnimation = useCallback(() => {
    if (activeActionRef.current) {
      activeActionRef.current.reset();
      if (animationPlaybackState !== "playing") activeActionRef.current.stop();
      else activeActionRef.current.play();
      setAnimationTime(0);
    }
    sonnerToast.info("View Reset (OrbitControls)");
    if (activeActionRef.current) pushHistory("reset imported animation");
  }, [pushHistory, animationPlaybackState]);
  const handleToggleGlobalAnimation = useCallback(() => {
    setIsAnimating((prev) => {
      const nextState = !prev;
      sonnerToast.info(
        `Floating Animation ${nextState ? "Resumed" : "Paused"}`
      );
      return nextState;
    });
  }, []);
  const handleSettingsChange = (key, value, subKey = null) => {
    setSettings((s) => {
      const newSettings = { ...s };
      if (subKey) {
        newSettings[key] = { ...s[key], [subKey]: value };
      } else {
        newSettings[key] = value;
      }
      return newSettings;
    });
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
          roughness:
            presetDefaults.roughness ??
            initialSettings.customMaterialProperties.roughness,
          metalness:
            presetDefaults.metalness ??
            initialSettings.customMaterialProperties.metalness,
          ior:
            presetDefaults.ior ?? initialSettings.customMaterialProperties.ior,
          transmission:
            presetDefaults.transmission ??
            initialSettings.customMaterialProperties.transmission,
          thickness:
            presetDefaults.thickness ??
            initialSettings.customMaterialProperties.thickness,
          emissiveIntensity:
            presetDefaults.emissiveIntensity ??
            initialSettings.customMaterialProperties.emissiveIntensity,
          ...resetTextureUrls,
        },
      }));
      sonnerToast.info("Material Properties Reset to Preset Defaults");
    }
  };
  const handleCategorySelect = useCallback((categoryId) => {
    setIsImportedModelDisplayed(false);
    setImportedModel(null);
    setCurrentCategory(categoryId);
    setCurrentShape(SHAPES_BY_CATEGORY_DATA[categoryId][0].id);
  }, []);
  const handleShapeSelect = useCallback((shapeId) => {
    setIsImportedModelDisplayed(false);
    setImportedModel(null);
    setCurrentShape(shapeId);
  }, []);
  const handleRandomize = useCallback(() => {
    setIsImportedModelDisplayed(false);
    setImportedModel(null);
    setCustomBgImageUrl(null);
    const randCat =
      CATEGORIES_DATA[Math.floor(Math.random() * CATEGORIES_DATA.length)];
    const randShapeList = SHAPES_BY_CATEGORY_DATA[randCat.id];
    const randShape =
      randShapeList[Math.floor(Math.random() * randShapeList.length)];
    const randPresetKey =
      Object.keys(animationPresets)[
        Math.floor(Math.random() * Object.keys(animationPresets).length)
      ];
    const randColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`;
    const bgKeys = Object.keys(BACKGROUND_OPTIONS_DATA).filter(
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
    const randomText = ["Hello!", "3D Fun", "Awesome", "Shapes", "Text"][
      Math.floor(Math.random() * 5)
    ];
    const randomTextColor = `hsl(${Math.floor(Math.random() * 360)}, 80%, 75%)`;
    setCurrent3DText(randomText);
    setTextInput(randomText);
    setIsTextVisible(Math.random() > 0.5);
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
      textColor: randomTextColor,
      textSize: saneNumber(Math.random() * (0.8 - 0.3) + 0.3, 0.5),
      textDepth: saneNumber(Math.random() * (0.2 - 0.02) + 0.02, 0.05),
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
    sonnerToast.success("Scene Randomized!");
  }, []);
  const currentShapeRef = useRef(currentShape);
  useEffect(() => {
    currentShapeRef.current = currentShape;
  }, [currentShape]);
  const currentImportedModelNameRef = useRef(importedModelName);
  useEffect(() => {
    currentImportedModelNameRef.current = importedModelName;
  }, [importedModelName]);
  const handleExportGLB = useCallback(async () => {
    if (isExporting) return;
    const sceneToExport = new THREE.Scene();
    let hasContentToExport = false;
    if (meshToExportOrScreenshotRef.current) {
      const modelClone = meshToExportOrScreenshotRef.current.clone(true);
      sceneToExport.add(modelClone);
      hasContentToExport = true;
    }
    if (isTextVisible && current3DText && settings.textFontUrl) {
      if (!helvetikerFontForExport) {
        try {
          helvetikerFontForExport = await new Promise((resolve, reject) =>
            globalFontLoaderForExport.load(
              FONT_PATH_FOR_EXPORT,
              resolve,
              undefined,
              reject
            )
          );
        } catch (e) {
          sonnerToast.error("Text Export Failed", {
            description: "Font for text geometry failed to load.",
          });
        }
      }
      if (helvetikerFontForExport) {
        const textGeom = new TextGeometry(current3DText, {
          font: helvetikerFontForExport,
          size: saneNumber(settings.textSize, 0.5),
          height: saneNumber(settings.textDepth, 0.05),
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: saneNumber(0.02 * (settings.textSize / 0.5), 0.01),
          bevelSize: saneNumber(0.01 * (settings.textSize / 0.5), 0.005),
        });
        textGeom.center();
        const { constructor: MatConstructor, args } = createR3FMaterialProps(
          settings.textColor,
          "ceramic",
          {},
          r3fSceneForExportRef.current?.environment
        );
        const textMeshMaterial = new MatConstructor(args);
        const textMesh = new THREE.Mesh(textGeom, textMeshMaterial);
        let textExportYOffset = 0;
        if (meshToExportOrScreenshotRef.current) {
          const mainModelBox = new THREE.Box3().setFromObject(
            meshToExportOrScreenshotRef.current
          );
          if (!mainModelBox.isEmpty()) {
            const modelHeight = mainModelBox.max.y - mainModelBox.min.y;
            const modelCenterY = mainModelBox.getCenter(new THREE.Vector3()).y;
            textExportYOffset =
              modelCenterY +
              modelHeight / 2 +
              saneNumber(settings.textSize, 0.5) / 2 +
              0.3;
          } else {
            textExportYOffset = saneNumber(settings.textSize, 0.5) / 2 + 0.3;
          }
        } else {
          textExportYOffset = saneNumber(settings.textSize, 0.5) / 2;
        }
        textMesh.position.y = textExportYOffset;
        sceneToExport.add(textMesh);
        hasContentToExport = true;
      }
    }
    if (!hasContentToExport) {
      sonnerToast.warning("Export Failed", {
        description: "Nothing visible to export.",
      });
      return;
    }
    setIsExporting(true);
    setExportProgress(0);
    const exportToastId = sonnerToast.loading("Exporting GLB...", {
      description: "Preparing model...",
    });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setExportProgress(50);
      sonnerToast.info("Finalizing export...", {
        id: exportToastId,
        description: "Almost there...",
      });
      const exporter = new GLTFExporter();
      const exportOptions = {
        binary: true,
        embedImages: true,
        animations:
          isImportedModelDisplayed &&
          importedModel &&
          animationClipsRef.current.length > 0
            ? animationClipsRef.current
            : [],
      };
      exporter.parse(
        sceneToExport,
        (gltf) => {
          if (!(gltf instanceof ArrayBuffer)) {
            throw new Error("Exported GLTF is not an ArrayBuffer.");
          }
          const blob = new Blob([gltf], { type: "application/octet-stream" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          const baseName = isImportedModelDisplayed
            ? (currentImportedModelNameRef.current || "imported-model")
                .replace(/[^a-z0-9]/gi, "_")
                .toLowerCase()
            : currentShapeRef.current || "model";
          const textSuffix = isTextVisible && current3DText ? "-with-text" : "";
          link.download = `shape-${baseName}${textSuffix}.glb`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
          setExportProgress(100);
          sonnerToast.success("GLB Export Ready", {
            id: exportToastId,
            description: "Download started.",
          });
          setTimeout(() => {
            setIsExporting(false);
            setExportProgress(0);
          }, 500);
        },
        (error) => {
          console.error("GLTFExporter error:", error);
          sonnerToast.error("GLB Export Failed", {
            id: exportToastId,
            description: error?.message || "GLTF parsing error.",
          });
          setIsExporting(false);
          setExportProgress(0);
        },
        exportOptions
      );
    } catch (e) {
      console.error("Export GLB general error:", e);
      setIsExporting(false);
      setExportProgress(0);
      sonnerToast.error("GLB Export Failed", {
        id: exportToastId,
        description: e.message || "Unexpected error during export preparation.",
      });
    }
  }, [
    isExporting,
    isTextVisible,
    current3DText,
    settings.textFontUrl,
    settings.textSize,
    settings.textDepth,
    settings.textColor,
    isImportedModelDisplayed,
    importedModel,
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
        const baseName = isImportedModelDisplayed
          ? (currentImportedModelNameRef.current || "imported")
              .replace(/[^a-z0-9]/gi, "_")
              .toLowerCase()
          : currentShapeRef.current || "model";
        const textSuffix = isTextVisible && current3DText ? "-with-text" : "";
        l.download = `shape-${baseName}${textSuffix}.obj`;
        l.href =
          "data:text/plain;charset=utf-8," +
          encodeURIComponent(
            "# OBJ file simulated\n# Actual OBJ Exporter needed for full geometry"
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
  }, [isExporting, isImportedModelDisplayed, isTextVisible, current3DText]);
  const handleTakeScreenshot = useCallback(() => {
    if (!r3fGLContextRef.current) {
      sonnerToast.error("Screenshot Failed", {
        description: "Renderer not ready.",
      });
      return;
    }
    const gl = r3fGLContextRef.current;
    const screenshotToastId = sonnerToast.loading("Taking Screenshot...", {
      description: "Capturing image...",
    });
    requestAnimationFrame(() => {
      try {
        const canvas = gl.domElement;
        const link = document.createElement("a");
        const baseName = isImportedModelDisplayed
          ? (currentImportedModelNameRef.current || "view")
              .replace(/[^a-z0-9]/gi, "_")
              .toLowerCase()
          : currentShapeRef.current || "view";
        const textSuffix = isTextVisible && current3DText ? "-with-text" : "";
        link.download = `screenshot-${baseName}${textSuffix}.png`;
        link.href = canvas.toDataURL("image/png");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        sonnerToast.success("Screenshot Saved!", {
          id: screenshotToastId,
          description: `${link.download} saved.`,
        });
      } catch (e) {
        sonnerToast.error("Screenshot Failed", {
          id: screenshotToastId,
          description: e.message || "Could not save.",
        });
      }
    });
  }, [isImportedModelDisplayed, current3DText, isTextVisible]);
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
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        mixerRef.current = null;
      }
      activeActionRef.current = null;
    },
    []
  );

  const handleFiles = useCallback(
    async (files) => {
      if (!files || files.length === 0) return;
      const importToastId = sonnerToast.loading("Processing File(s)...", {
        duration: Infinity,
      });
      let modelFile = null;
      let mtlFile = null;
      let modelFileType = "";

      const modelFileExtensions = [".glb", ".gltf", ".fbx", ".stl", ".obj"];
      for (const ext of modelFileExtensions) {
        modelFile = Array.from(files).find((f) =>
          f.name.toLowerCase().endsWith(ext)
        );
        if (modelFile) {
          modelFileType = ext.substring(1);
          break;
        }
      }
      if (!modelFile) {
        modelFile = Array.from(files).find((f) =>
          f.name.toLowerCase().endsWith(".3ds")
        );
        if (modelFile) modelFileType = "3ds";
      }
      if (modelFileType === "obj") {
        mtlFile = Array.from(files).find((f) =>
          f.name.toLowerCase().endsWith(".mtl")
        );
      }

      if (modelFile) {
        let modelUrlToUse;
        const mtlUrlToUse = mtlFile ? URL.createObjectURL(mtlFile) : null;

        if (importedModel?.url && importedModel.url.startsWith("blob:"))
          URL.revokeObjectURL(importedModel.url);
        if (importedModel?.mtlUrl && importedModel.mtlUrl.startsWith("blob:"))
          URL.revokeObjectURL(importedModel.mtlUrl);

        if (modelFileType === "glb") {
          console.log(
            `[handleFiles] Converting GLB to Data URL with model/gltf-binary type...`
          );
          try {
            const reader = new FileReader();
            modelUrlToUse = await new Promise((resolve, reject) => {
              reader.onload = (event) => resolve(event.target.result);
              reader.onerror = (error) => {
                console.error("Error reading GLB file for Data URL:", error);
                reject(error);
              };
              reader.readAsDataURL(modelFile);
            });
            if (modelUrlToUse.startsWith("data:application/octet-stream")) {
              modelUrlToUse = modelUrlToUse.replace(
                "data:application/octet-stream",
                "data:model/gltf-binary"
              );
              console.log(
                `[handleFiles] Corrected MIME type to model/gltf-binary for GLB Data URL.`
              );
            }
            console.log(
              `[handleFiles] GLB Data URL created (length: ${
                modelUrlToUse.length
              }, type: ${modelUrlToUse.substring(0, 50)})`
            );
          } catch (error) {
            sonnerToast.error("File Processing Error", {
              id: importToastId,
              description: `Failed to convert GLB to Data URL.`,
            });
            if (fileInputRef.current) fileInputRef.current.value = null;
            return;
          }
        } else if (modelFileType === "gltf") {
          console.log(
            `[handleFiles] Converting GLTF to Data URL (text based)...`
          );
          try {
            const reader = new FileReader();
            modelUrlToUse = await new Promise((resolve, reject) => {
              reader.onload = (event) => resolve(event.target.result);
              reader.onerror = (error) => {
                console.error("Error reading GLTF file for Data URL:", error);
                reject(error);
              };
              reader.readAsDataURL(modelFile);
            });
            console.log(
              `[handleFiles] GLTF Data URL created (length: ${
                modelUrlToUse.length
              }, type: ${modelUrlToUse.substring(0, 50)})`
            );
          } catch (error) {
            sonnerToast.error("File Processing Error", {
              id: importToastId,
              description: `Failed to convert GLTF to Data URL.`,
            });
            if (fileInputRef.current) fileInputRef.current.value = null;
            return;
          }
        } else {
          modelUrlToUse = URL.createObjectURL(modelFile);
        }

        processAndSetImportedModel(
          modelUrlToUse,
          modelFileType,
          mtlUrlToUse,
          modelFile.name
        );
        sonnerToast.success("Model Ready", {
          id: importToastId,
          description: `${modelFile.name} prepared for display.`,
        });
      } else {
        sonnerToast.error("No Compatible Model", {
          id: importToastId,
          description: "Please select a supported file type.",
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
  };
  const handleStopAnimation = () => {
    if (!activeActionRef.current) return;
    activeActionRef.current.reset().stop();
    setAnimationPlaybackState("stopped");
    setAnimationTime(0);
  };
  const handleAnimationClipChange = (indexStr) => {
    const index = parseInt(indexStr, 10);
    if (
      mixerRef.current &&
      index >= 0 &&
      index < animationClipsRef.current.length
    ) {
      if (activeActionRef.current) {
        activeActionRef.current.stop();
      }
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
    }
  };
  const handleAnimationTimeChange = (value) => {
    const normalizedTime = value[0];
    if (activeActionRef.current && animationDuration > 0) {
      const newTimeInSeconds = normalizedTime * animationDuration;
      activeActionRef.current.time = newTimeInSeconds;
      if (
        animationPlaybackState === "paused" ||
        animationPlaybackState === "stopped"
      ) {
        if (mixerRef.current) mixerRef.current.update(0);
      }
      setAnimationTime(normalizedTime);
    }
  };
  const handleAnimationLoopToggle = (checked) => {
    setIsAnimationLooping(checked);
    if (activeActionRef.current)
      activeActionRef.current.setLoop(
        checked ? THREE.LoopRepeat : THREE.LoopOnce,
        Infinity
      );
  };
  const handleAnimationSpeedChange = (value) => {
    const speed = value[0];
    setAnimationPlaybackSpeed(speed);
    if (activeActionRef.current) activeActionRef.current.timeScale = speed;
  };

  const handleCustomBgImageUpload = (event) => {
    const file = event.target.files[0];
    const fileInput = event.target;
    if (file) {
      const fileNameLower = file.name.toLowerCase();
      const fileType = file.type;
      if (
        fileNameLower.endsWith(".hdr") ||
        fileNameLower.endsWith(".exr") ||
        fileType === "application/octet-stream" ||
        fileType === "image/vnd.radiance" ||
        fileType === "image/x-exr"
      ) {
        sonnerToast.error("HDR/EXR Not Supported for Background", {
          description:
            "Please use JPG, PNG, or WEBP for this background image slot. HDRs are processed differently for environment lighting.",
        });
        if (fileInput) fileInput.value = null;
        return;
      }
      const acceptedLdrTypes = ["image/jpeg", "image/png", "image/webp"];
      if (
        !acceptedLdrTypes.includes(fileType) &&
        !fileNameLower.endsWith(".jpg") &&
        !fileNameLower.endsWith(".jpeg") &&
        !fileNameLower.endsWith(".png") &&
        !fileNameLower.endsWith(".webp")
      ) {
        sonnerToast.error("Unsupported File Type", {
          description:
            "Please upload a JPG, PNG, or WEBP image for the background.",
        });
        if (fileInput) fileInput.value = null;
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomBgImageUrl(e.target.result);
        setSettings((s) => ({ ...s, background: "customImage" }));
        sonnerToast.success("Custom background image set.");
      };
      reader.onerror = () => {
        sonnerToast.error("File Reading Error", {
          description: "Could not read the selected file.",
        });
        if (fileInput) fileInput.value = null;
      };
      reader.readAsDataURL(file);
    } else {
      if (fileInput) fileInput.value = null;
    }
  };
  const handleClearCustomBgImage = () => {
    setCustomBgImageUrl(null);
    sonnerToast.info("Custom background image cleared.");
  };

  const handleTextureUpload = (mapType, event) => {
    const file = event.target.files[0];
    const fileInput = event.target;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const urlKey = `${mapType}Url`;
        const newTextureUrl = e.target.result;
        console.log(
          `[handleTextureUpload FULL] Setting ${urlKey} to Data URL (length: ${newTextureUrl.length})`
        );
        setSettings((s) => ({
          ...s,
          customMaterialProperties: {
            ...s.customMaterialProperties,
            [urlKey]: newTextureUrl,
          },
        }));
        sonnerToast.success(`${mapType.replace("Map", "")} texture set.`);
        if (fileInput) fileInput.value = null;
      };
      reader.onerror = () => {
        sonnerToast.error("File Reading Error for Texture", {
          description: "Could not read the selected texture file.",
        });
        if (fileInput) fileInput.value = null;
      };
      reader.readAsDataURL(file);
    } else {
      if (fileInput) fileInput.value = null;
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
    sonnerToast.info(`${mapType.replace("Map", "")} texture cleared.`);
  };
  const handleSet3DText = () => {
    const trimmedText = textInput.trim();
    setCurrent3DText(trimmedText);
    if (trimmedText !== "") {
      setIsTextVisible(true);
      sonnerToast.info("3D Text Updated", {
        description: `Displaying: "${trimmedText}"`,
      });
    } else {
      setIsTextVisible(false);
      sonnerToast.info("3D Text Cleared");
    }
  };

  const { active: isLoadingModel, progress: modelLoadProgress } = useProgress();

  console.log(
    "[ModelViewer3D] About to render SceneContentInternal. animationPreset state:",
    animationPreset
  );
  console.log(
    "[ModelViewer3D] Rendering. Current settings.customMaterialProperties.mapUrl:",
    settings.customMaterialProperties.mapUrl
  );

  if (!isMounted) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-4'>
        <Loader2 className='h-12 w-12 animate-spin text-purple-400 mb-4' />
        <p className='text-lg font-medium'>Initializing 3D Studio...</p>
      </div>
    );
  }
  let canvasBgColor = "transparent";
  if (settings.background !== "customImage") {
    if (settings.background === "darkSpace") canvasBgColor = "#0a0a10";
    else if (settings.background === "studioDark") canvasBgColor = "#18181b";
    else if (settings.background === "softLight" && !customBgImageUrl)
      canvasBgColor = "#e0e8f0";
    else if (settings.background === "studioLight" && !customBgImageUrl)
      canvasBgColor = "#f4f4f5";
    else if (settings.background === "modernGradient")
      canvasBgColor = "#1e3b49";
  }
  const canUndo = historyPointerRef.current > 0;
  const canRedo =
    historyPointerRef.current < historyStackRef.current.length - 1;
  const proceduralMaterialTypeForPanel =
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
                Craft, view, and animate 3D masterpieces. Import GLB,
                GLTF,STL,OBJ, FBX or 3DS models. Drag & drop supported.
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
                        {importedModelName}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant='destructive'
                        size='sm'
                        className='w-full'
                        onClick={() => {
                          if (
                            importedModel?.url &&
                            importedModel.url.startsWith("blob:")
                          ) {
                            URL.revokeObjectURL(importedModel.url);
                          }
                          if (
                            importedModel?.mtlUrl &&
                            importedModel.mtlUrl.startsWith("blob:")
                          ) {
                            URL.revokeObjectURL(importedModel.mtlUrl);
                          }
                          setImportedModel(null);
                          setIsImportedModelDisplayed(false);
                          setImportedModelName("Imported Model");
                          const defaultCategoryId = CATEGORIES_DATA[0].id;
                          setCurrentCategory(defaultCategoryId);
                          setCurrentShape(
                            SHAPES_BY_CATEGORY_DATA[defaultCategoryId][0].id
                          );
                          animationClipsRef.current = [];
                          setSelectedAnimationClipIndex(-1);
                          setAnimationPlaybackState("stopped");
                          setAnimationTime(0);
                          setAnimationDuration(0);
                          sonnerToast.info("Imported Model Cleared");
                        }}
                      >
                        <XCircle size={16} className='mr-2' />
                        Clear Imported
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
                      Set 3D Text
                    </Button>
                    <div className='flex items-center space-x-2 pt-1'>
                      <Switch
                        id='text-visibility-switch'
                        checked={isTextVisible}
                        onCheckedChange={(checked) => {
                          setIsTextVisible(checked);
                        }}
                      />
                      <Label
                        htmlFor='text-visibility-switch'
                        className='text-sm text-slate-300'
                      >
                        Show 3D Text
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
                        <ScrollArea className='h-[calc(100vh-128px)]'>
                          <div className='space-y-6 p-4'>
                            {(isImportedModelDisplayed &&
                              (importedModel?.type === "stl" ||
                                (importedModel?.type === "obj" &&
                                  !importedModel?.mtlUrl))) ||
                            !isImportedModelDisplayed ? (
                              <section className='space-y-4'>
                                <h3 className='text-sm text-slate-300 font-semibold uppercase tracking-wider border-b border-slate-700 pb-1 mb-3 flex items-center'>
                                  <Palette
                                    size={16}
                                    className='mr-2 text-purple-400'
                                  />
                                  {isImportedModelDisplayed &&
                                  (importedModel?.type === "stl" ||
                                    (importedModel?.type === "obj" &&
                                      !importedModel?.mtlUrl))
                                    ? `Material for ${importedModelName} (${importedModel?.type})`
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
                                      handleSettingsChange(
                                        "materialType",
                                        value
                                      );
                                      if (value !== settings.materialType) {
                                        resetCustomMaterialProperties();
                                      }
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
                                </div>
                                <div className='space-y-1.5'>
                                  <Label
                                    htmlFor='shapeColorPanelSheet'
                                    className='text-sm text-slate-300'
                                  >
                                    Base Color (Used if no Color Texture)
                                  </Label>
                                  <Input
                                    id='shapeColorPanelSheet'
                                    type='color'
                                    value={settings.shapeColor}
                                    onChange={(e) =>
                                      handleSettingsChange(
                                        "shapeColor",
                                        e.target.value
                                      )
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
                                        Reset to Preset
                                      </Button>
                                    </div>
                                    {(proceduralMaterialTypeForPanel ===
                                      "metallic" ||
                                      proceduralMaterialTypeForPanel ===
                                        "glass" ||
                                      proceduralMaterialTypeForPanel ===
                                        "crystal" ||
                                      proceduralMaterialTypeForPanel ===
                                        "ceramic" ||
                                      proceduralMaterialTypeForPanel ===
                                        "organic" ||
                                      proceduralMaterialTypeForPanel ===
                                        "plastic" ||
                                      proceduralMaterialTypeForPanel ===
                                        "neon") && (
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
                                                proceduralMaterialTypeForPanel
                                              ]?.roughness ??
                                              0
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
                                                proceduralMaterialTypeForPanel
                                              ]?.roughness ??
                                              0,
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
                                    {(proceduralMaterialTypeForPanel ===
                                      "metallic" ||
                                      proceduralMaterialTypeForPanel ===
                                        "ceramic" ||
                                      proceduralMaterialTypeForPanel ===
                                        "plastic") && (
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
                                                proceduralMaterialTypeForPanel
                                              ]?.metalness ??
                                              0
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
                                                proceduralMaterialTypeForPanel
                                              ]?.metalness ??
                                              0,
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
                                    {(proceduralMaterialTypeForPanel ===
                                      "glass" ||
                                      proceduralMaterialTypeForPanel ===
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
                                                settings
                                                  .customMaterialProperties
                                                  .ior ??
                                                baseMaterialPresets[
                                                  proceduralMaterialTypeForPanel
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
                                                  proceduralMaterialTypeForPanel
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
                                                settings
                                                  .customMaterialProperties
                                                  .transmission ??
                                                baseMaterialPresets[
                                                  proceduralMaterialTypeForPanel
                                                ]?.transmission ??
                                                0
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
                                                  proceduralMaterialTypeForPanel
                                                ]?.transmission ??
                                                0,
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
                                                settings
                                                  .customMaterialProperties
                                                  .thickness ??
                                                baseMaterialPresets[
                                                  proceduralMaterialTypeForPanel
                                                ]?.thickness ??
                                                0
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
                                                  proceduralMaterialTypeForPanel
                                                ]?.thickness ??
                                                0,
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
                                    {proceduralMaterialTypeForPanel ===
                                      "neon" && (
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
                                              baseMaterialPresets.neon
                                                ?.emissiveIntensity ??
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
                                              baseMaterialPresets.neon
                                                ?.emissiveIntensity ??
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
                                    <Separator className='my-2 bg-slate-500/50' />
                                    <h5 className='text-xs font-medium text-purple-300 pt-1 flex items-center'>
                                      <ImageUp size={14} className='mr-1.5' />
                                      Textures (For Model)
                                    </h5>
                                    <div className='grid grid-cols-2 gap-x-3 gap-y-4'>
                                      {textureSlots.map((slot) => {
                                        if (
                                          (slot.id === "emissiveMap" &&
                                            proceduralMaterialTypeForPanel !==
                                              "neon" &&
                                            !baseMaterialPresets[
                                              proceduralMaterialTypeForPanel
                                            ]?.useEmissive) ||
                                          ((slot.id === "metalnessMap" ||
                                            slot.id === "roughnessMap") &&
                                            (proceduralMaterialTypeForPanel ===
                                              "glass" ||
                                              proceduralMaterialTypeForPanel ===
                                                "crystal")) ||
                                          (slot.id === "aoMap" &&
                                            (proceduralMaterialTypeForPanel ===
                                              "glass" ||
                                              proceduralMaterialTypeForPanel ===
                                                "crystal" ||
                                              proceduralMaterialTypeForPanel ===
                                                "neon"))
                                        )
                                          return null;
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
                                                    handleClearTexture(slot.id)
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
                                              accept='image/png, image/jpeg, image/webp, .hdr'
                                              ref={(el) =>
                                                (textureFileInputRefs.current[
                                                  slot.id
                                                ] = el)
                                              }
                                              onChange={(e) =>
                                                handleTextureUpload(slot.id, e)
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
                                        onValueChange={(value) =>
                                          handleSettingsChange("quality", value)
                                        }
                                      >
                                        <SelectTrigger
                                          id='qualityPanelSheet'
                                          className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'
                                        >
                                          <SelectValue placeholder='Select quality' />
                                        </SelectTrigger>
                                        <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
                                          {["low", "medium", "high"].map(
                                            (q) => (
                                              <SelectItem
                                                key={q}
                                                value={q}
                                                className='capitalize focus:bg-purple-600 focus:text-white'
                                              >
                                                {q}
                                              </SelectItem>
                                            )
                                          )}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </>
                                )}
                              </section>
                            ) : (
                              <section className='space-y-4'>
                                <h3 className='text-sm text-slate-300 font-semibold uppercase tracking-wider border-b border-slate-700 pb-1 mb-3 flex items-center'>
                                  <Palette
                                    size={16}
                                    className='mr-2 text-purple-400'
                                  />
                                  Override Material for {importedModelName} (
                                  {importedModel?.type})
                                </h3>
                                <p className='text-xs text-slate-400'>
                                  Upload textures below to override all
                                  materials on the current imported model. Base
                                  color and other material properties from the
                                  "Base Material" section will also be applied.
                                </p>
                                <div className='space-y-1.5'>
                                  <Label
                                    htmlFor='overrideMaterialTypePanelSheet'
                                    className='text-sm text-slate-300'
                                  >
                                    Override Base Material Type
                                  </Label>
                                  <Select
                                    value={settings.materialType}
                                    onValueChange={(value) => {
                                      handleSettingsChange(
                                        "materialType",
                                        value
                                      );
                                    }}
                                  >
                                    <SelectTrigger
                                      id='overrideMaterialTypePanelSheet'
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
                                  <Label
                                    htmlFor='overrideShapeColorPanelSheet'
                                    className='text-sm text-slate-300'
                                  >
                                    Override Base Color (if no Color Texture)
                                  </Label>
                                  <Input
                                    id='overrideShapeColorPanelSheet'
                                    type='color'
                                    value={settings.shapeColor}
                                    onChange={(e) =>
                                      handleSettingsChange(
                                        "shapeColor",
                                        e.target.value
                                      )
                                    }
                                    className='w-full p-1 h-9 bg-slate-700 border-slate-600 cursor-pointer focus-visible:ring-purple-500'
                                  />
                                </div>
                                <div className='p-3 border border-slate-600 rounded-md space-y-3 bg-slate-700/30'>
                                  <h5 className='text-xs font-medium text-purple-300 pt-1 flex items-center'>
                                    <ImageUp size={14} className='mr-1.5' />
                                    Override Textures (Applied to All Model
                                    Parts)
                                  </h5>
                                  <div className='grid grid-cols-2 gap-x-3 gap-y-4'>
                                    {textureSlots.map((slot) => {
                                      const urlKey = `${slot.id}Url`;
                                      const currentTextureUrl =
                                        settings.customMaterialProperties[
                                          urlKey
                                        ];
                                      return (
                                        <div
                                          key={`override-${slot.id}`}
                                          className='space-y-1'
                                        >
                                          <Label
                                            htmlFor={`texture-override-${slot.id}-sheet`}
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
                                                  handleClearTexture(slot.id)
                                                }
                                                title={`Clear ${slot.name} Texture`}
                                              >
                                                <Trash2 size={12} />
                                              </Button>
                                            </div>
                                          )}
                                          <Input
                                            id={`texture-override-${slot.id}-sheet`}
                                            type='file'
                                            accept='image/png, image/jpeg, image/webp, .hdr'
                                            ref={(el) =>
                                              (textureFileInputRefs.current[
                                                slot.id
                                              ] = el)
                                            }
                                            onChange={(e) =>
                                              handleTextureUpload(slot.id, e)
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
                              </section>
                            )}
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
                                <div className='space-y-1.5'>
                                  <Label
                                    htmlFor='textColorPanelSheet'
                                    className='text-sm text-slate-300'
                                  >
                                    Text Color
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
                                      Text Depth (Extrusion)
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
                                    onChange={(e) =>
                                      handleSettingsChange(
                                        "textFontUrl",
                                        e.target.value
                                      )
                                    }
                                    placeholder='/fonts/your_font.json'
                                    className='w-full bg-slate-700 border-slate-600 text-slate-100 text-xs'
                                  />
                                  <p className='text-xs text-slate-400'>
                                    Place font in `public` folder. Example:
                                    `/fonts/helvetiker_regular.typeface.json`
                                  </p>
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
                                General Display
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
                                />
                              </div>
                              <div className='space-y-1.5'>
                                <Label
                                  htmlFor='backgroundPanelSheet'
                                  className='text-sm text-slate-300'
                                >
                                  Background / Environment
                                </Label>
                                <Select
                                  value={settings.background}
                                  onValueChange={(value) =>
                                    handleSettingsChange("background", value)
                                  }
                                >
                                  <SelectTrigger
                                    id='backgroundPanelSheet'
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
                                {settings.background === "customImage" && (
                                  <div className='mt-2 space-y-1.5 p-3 border border-slate-600 rounded-md bg-slate-700/30'>
                                    <Label
                                      htmlFor='customBgImagePanelSheet'
                                      className='text-sm text-slate-300'
                                    >
                                      Upload Background Image (JPG, PNG, WEBP)
                                    </Label>
                                    <Input
                                      id='customBgImagePanelSheet'
                                      type='file'
                                      accept='image/jpeg,image/png,image/webp'
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
                                        Clear Custom Image
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
                                          onCheckedChange={(checked) =>
                                            handleSettingsChange(
                                              lightKey,
                                              checked,
                                              "enabled"
                                            )
                                          }
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
                                    htmlFor='n8aoEnableSheet'
                                    className='text-sm text-slate-200'
                                  >
                                    N8AO (Ambient Occlusion)
                                  </Label>
                                  <Switch
                                    id='n8aoEnableSheet'
                                    checked={settings.n8ao.enabled}
                                    onCheckedChange={(checked) =>
                                      handleSettingsChange(
                                        "n8ao",
                                        checked,
                                        "enabled"
                                      )
                                    }
                                  />
                                </div>
                                {settings.n8ao.enabled && (
                                  <>
                                    <div className='space-y-1.5'>
                                      <div className='flex justify-between items-center'>
                                        <Label
                                          htmlFor='n8aoIntensitySheet'
                                          className='text-xs text-slate-300'
                                        >
                                          Intensity
                                        </Label>
                                        <span className='text-xs text-slate-400'>
                                          {settings.n8ao.intensity.toFixed(1)}
                                        </span>
                                      </div>
                                      <Slider
                                        id='n8aoIntensitySheet'
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
                                          htmlFor='n8aoRadiusSheet'
                                          className='text-xs text-slate-300'
                                        >
                                          AO Radius
                                        </Label>
                                        <span className='text-xs text-slate-400'>
                                          {settings.n8ao.aoRadius.toFixed(2)}
                                        </span>
                                      </div>
                                      <Slider
                                        id='n8aoRadiusSheet'
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
                                    <div className='flex items-center justify-between'>
                                      <Label
                                        htmlFor='n8aoSsrSheet'
                                        className='text-sm text-slate-300'
                                      >
                                        Screen Space Radius
                                      </Label>
                                      <Switch
                                        id='n8aoSsrSheet'
                                        checked={
                                          settings.n8ao.screenSpaceRadius
                                        }
                                        onCheckedChange={(checked) =>
                                          handleSettingsChange(
                                            "n8ao",
                                            checked,
                                            "screenSpaceRadius"
                                          )
                                        }
                                      />
                                    </div>
                                    <div className='space-y-1.5'>
                                      <Label
                                        htmlFor='n8aoQualitySheet'
                                        className='text-xs text-slate-300'
                                      >
                                        Quality
                                      </Label>
                                      <Select
                                        value={settings.n8ao.quality}
                                        onValueChange={(val) =>
                                          handleSettingsChange(
                                            "n8ao",
                                            val,
                                            "quality"
                                          )
                                        }
                                      >
                                        <SelectTrigger
                                          id='n8aoQualitySheet'
                                          className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'
                                        >
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
                                          {[
                                            "low",
                                            "medium",
                                            "high",
                                            "ultra",
                                          ].map((q) => (
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
                                    <div className='flex items-center justify-between'>
                                      <Label
                                        htmlFor='n8aoHalfResSheet'
                                        className='text-sm text-slate-300'
                                      >
                                        Half Resolution
                                      </Label>
                                      <Switch
                                        id='n8aoHalfResSheet'
                                        checked={settings.n8ao.halfRes}
                                        onCheckedChange={(checked) =>
                                          handleSettingsChange(
                                            "n8ao",
                                            checked,
                                            "halfRes"
                                          )
                                        }
                                      />
                                    </div>
                                    <div className='space-y-1.5'>
                                      <Label
                                        htmlFor='n8aoColorSheet'
                                        className='text-xs text-slate-300'
                                      >
                                        Occlusion Color
                                      </Label>
                                      <Input
                                        id='n8aoColorSheet'
                                        type='color'
                                        value={settings.n8ao.color}
                                        onChange={(e) =>
                                          handleSettingsChange(
                                            "n8ao",
                                            e.target.value,
                                            "color"
                                          )
                                        }
                                        className='w-full h-7 p-0.5 bg-slate-600 border-slate-500 cursor-pointer'
                                      />
                                    </div>
                                  </>
                                )}
                              </div>
                              <div className='p-3 border border-slate-600 rounded-md space-y-3 bg-slate-700/30 mt-4'>
                                <div className='flex items-center justify-between'>
                                  <Label
                                    htmlFor='bloomEnableSheet'
                                    className='text-sm text-slate-200'
                                  >
                                    Bloom
                                  </Label>
                                  <Switch
                                    id='bloomEnableSheet'
                                    checked={settings.bloom.enabled}
                                    onCheckedChange={(checked) =>
                                      handleSettingsChange(
                                        "bloom",
                                        checked,
                                        "enabled"
                                      )
                                    }
                                  />
                                </div>
                                {settings.bloom.enabled && (
                                  <>
                                    <div className='space-y-1.5'>
                                      <div className='flex justify-between items-center'>
                                        <Label
                                          htmlFor='bloomIntensitySheet'
                                          className='text-xs text-slate-300'
                                        >
                                          Intensity
                                        </Label>
                                        <span className='text-xs text-slate-400'>
                                          {settings.bloom.intensity.toFixed(2)}
                                        </span>
                                      </div>
                                      <Slider
                                        id='bloomIntensitySheet'
                                        min={0}
                                        max={3}
                                        step={0.05}
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
                                          htmlFor='bloomLuminanceThresholdSheet'
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
                                        id='bloomLuminanceThresholdSheet'
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
                                    <div className='space-y-1.5'>
                                      <div className='flex justify-between items-center'>
                                        <Label
                                          htmlFor='bloomLuminanceSmoothingSheet'
                                          className='text-xs text-slate-300'
                                        >
                                          Luminance Smoothing
                                        </Label>
                                        <span className='text-xs text-slate-400'>
                                          {settings.bloom.luminanceSmoothing.toFixed(
                                            3
                                          )}
                                        </span>
                                      </div>
                                      <Slider
                                        id='bloomLuminanceSmoothingSheet'
                                        min={0}
                                        max={0.5}
                                        step={0.001}
                                        value={[
                                          settings.bloom.luminanceSmoothing,
                                        ]}
                                        onValueChange={([v]) =>
                                          handleSettingsChange(
                                            "bloom",
                                            v,
                                            "luminanceSmoothing"
                                          )
                                        }
                                        className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
                                      />
                                    </div>
                                    <div className='space-y-1.5'>
                                      <Label
                                        htmlFor='bloomKernelSheet'
                                        className='text-xs text-slate-300'
                                      >
                                        Kernel Size
                                      </Label>
                                      <Select
                                        value={settings.bloom.kernelSize?.toString()}
                                        onValueChange={(val) =>
                                          handleSettingsChange(
                                            "bloom",
                                            parseInt(val),
                                            "kernelSize"
                                          )
                                        }
                                      >
                                        <SelectTrigger
                                          id='bloomKernelSheet'
                                          className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'
                                        >
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
                                          <SelectItem
                                            value={KernelSize.VERY_SMALL.toString()}
                                          >
                                            Very Small
                                          </SelectItem>
                                          <SelectItem
                                            value={KernelSize.SMALL.toString()}
                                          >
                                            Small
                                          </SelectItem>
                                          <SelectItem
                                            value={KernelSize.MEDIUM.toString()}
                                          >
                                            Medium
                                          </SelectItem>
                                          <SelectItem
                                            value={KernelSize.LARGE.toString()}
                                          >
                                            Large
                                          </SelectItem>
                                          <SelectItem
                                            value={KernelSize.VERY_LARGE.toString()}
                                          >
                                            Very Large
                                          </SelectItem>
                                          <SelectItem
                                            value={KernelSize.HUGE.toString()}
                                          >
                                            Huge
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </>
                                )}
                              </div>
                            </section>
                            {isImportedModelDisplayed &&
                              animationClipsRef.current.length > 0 && (
                                <>
                                  <Separator className='my-3 bg-slate-600' />
                                  <section className='space-y-4'>
                                    <h3 className='text-sm text-slate-300 font-semibold uppercase tracking-wider border-b border-slate-700 pb-1 mb-3 flex items-center'>
                                      <Zap
                                        size={16}
                                        className='mr-2 text-orange-400'
                                      />
                                      Animation Playback
                                    </h3>
                                    <div className='space-y-4 p-3 border border-slate-600 rounded-md bg-slate-700/30'>
                                      <Select
                                        value={selectedAnimationClipIndex.toString()}
                                        onValueChange={
                                          handleAnimationClipChange
                                        }
                                        disabled={
                                          animationClipsRef.current.length === 0
                                        }
                                      >
                                        <SelectTrigger className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500'>
                                          <SelectValue placeholder='Select animation clip' />
                                        </SelectTrigger>
                                        <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
                                          {animationClipsRef.current.map(
                                            (clip, index) => (
                                              <SelectItem
                                                key={index}
                                                value={index.toString()}
                                                className='focus:bg-purple-600 focus:text-white'
                                              >
                                                {clip.name ||
                                                  `Animation ${index + 1}`}
                                              </SelectItem>
                                            )
                                          )}
                                        </SelectContent>
                                      </Select>
                                      <div className='grid grid-cols-3 gap-2'>
                                        <Button
                                          onClick={handlePlayPauseAnimation}
                                          disabled={
                                            selectedAnimationClipIndex < 0
                                          }
                                          className={cn(
                                            "bg-green-600 hover:bg-green-700",
                                            animationPlaybackState ===
                                              "playing" &&
                                              "bg-yellow-500 hover:bg-yellow-600"
                                          )}
                                        >
                                          {animationPlaybackState ===
                                          "playing" ? (
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
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant={
                                                isAnimationLooping
                                                  ? "secondary"
                                                  : "outline"
                                              }
                                              onClick={() =>
                                                handleAnimationLoopToggle(
                                                  !isAnimationLooping
                                                )
                                              }
                                              disabled={
                                                selectedAnimationClipIndex < 0
                                              }
                                              className={cn(
                                                isAnimationLooping
                                                  ? "bg-purple-500 hover:bg-purple-600 text-white"
                                                  : "border-slate-600 text-slate-300 hover:bg-slate-700/50"
                                              )}
                                            >
                                              <Repeat size={16} />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent side='bottom'>
                                            <p>
                                              {isAnimationLooping
                                                ? "Disable Loop"
                                                : "Enable Loop"}
                                            </p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </div>
                                      <div className='space-y-1.5'>
                                        <Label
                                          htmlFor='animTimePanelSheet'
                                          className='text-sm text-slate-300'
                                        >
                                          Time:{" "}
                                          {(
                                            animationTime * animationDuration
                                          ).toFixed(2)}
                                          s / {animationDuration.toFixed(2)}s
                                        </Label>
                                        <Slider
                                          id='animTimePanelSheet'
                                          min={0}
                                          max={1}
                                          step={0.001}
                                          value={[animationTime]}
                                          onValueChange={(valArray) =>
                                            handleAnimationTimeChange(valArray)
                                          }
                                          disabled={
                                            selectedAnimationClipIndex < 0 ||
                                            animationDuration === 0
                                          }
                                          className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
                                        />
                                      </div>
                                      <div className='space-y-1.5'>
                                        <Label
                                          htmlFor='animSpeedPanelSliderSheet'
                                          className='text-sm text-slate-300'
                                        >
                                          Speed:{" "}
                                          {animationPlaybackSpeed.toFixed(1)}x
                                        </Label>
                                        <Slider
                                          id='animSpeedPanelSliderSheet'
                                          min={0.1}
                                          max={3}
                                          step={0.1}
                                          value={[animationPlaybackSpeed]}
                                          onValueChange={(valArray) =>
                                            handleAnimationSpeedChange(valArray)
                                          }
                                          disabled={
                                            selectedAnimationClipIndex < 0
                                          }
                                          className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4'
                                        />
                                      </div>
                                    </div>
                                  </section>
                                </>
                              )}
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
                          position: [0, 0.5, 6],
                          fov: 50,
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
                        onCreated={({ gl }) => {
                          gl.toneMappingExposure = 1.0;
                        }}
                        key={
                          isFullscreen.toString() +
                          settings.background +
                          customBgImageUrl
                        }
                      >
                        <Suspense
                          fallback={
                            <DreiLoader
                              containerStyles={{
                                background: "rgba(20,20,30,0.8)",
                                borderRadius: "8px",
                              }}
                              dataStyles={{ color: "#f0f0f0" }}
                            />
                          }
                        >
                          <SceneContentInternal
                            settings={settings}
                            currentShape={currentShape}
                            animationPresetKey={animationPreset}
                            isAnimating={isAnimating}
                            importedModelUrl={importedModel?.url}
                            importedFileType={importedModel?.type}
                            importedMtlUrl={
                              importedModel?.type === "obj"
                                ? importedModel?.mtlUrl
                                : null
                            }
                            /* Corrected mtlUrl passing */ onModelLoad={
                              handleModelLoadedForScene
                            }
                            isImportedModelDisplayed={isImportedModelDisplayed}
                            current3DText={current3DText}
                            isTextVisible={isTextVisible}
                            customBgImageUrl={customBgImageUrl}
                            onMeshReady={handleMeshReadyForParent}
                            onSceneRefForExport={
                              handleSceneRefForExportCallback
                            }
                            animationClipsRef={animationClipsRef}
                            activeActionRef={activeActionRef}
                            mixerRef={mixerRef}
                            selectedAnimationClipIndex={
                              selectedAnimationClipIndex
                            }
                            animationPlaybackState={animationPlaybackState}
                            isAnimationLooping={isAnimationLooping}
                            animationPlaybackSpeed={animationPlaybackSpeed}
                            animationTime={animationTime}
                          />
                        </Suspense>
                      </Canvas>
                      {isLoadingModel && !isExporting && (
                        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800/80 p-4 rounded-lg text-center shadow-xl backdrop-blur-sm z-10'>
                          <Loader2 className='h-8 w-8 animate-spin text-purple-400 mx-auto mb-2' />
                          <p className='text-sm'>
                            Loading... {Math.round(modelLoadProgress)}%
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
                                Please wait...
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
