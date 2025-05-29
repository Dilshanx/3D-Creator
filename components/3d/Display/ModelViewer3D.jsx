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
  )
    materialEffectiveBaseColor = new THREE.Color(0xffffff);
  if (finalProps.useEmissive) {
    const hasEmissiveMap =
      customProps.emissiveMapUrl &&
      typeof customProps.emissiveMapUrl === "string" &&
      customProps.emissiveMapUrl.trim() !== "";
    finalProps.emissive = new THREE.Color(
      hasEmissiveMap ? 0xffffff : colorInput
    );
    if (!hasEmissiveMap && finalProps.emissive)
      finalProps.emissive.multiplyScalar(0.8);
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
    )
      textureUrls[urlKey] = customProps[urlKey];
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
TextureLoaderInternal.displayName = "TextureLoaderInternal";

const AppliedMaterial = React.memo(
  ({
    materialProps = {
      constructor: THREE.MeshStandardMaterial,
      args: { color: "gray" },
    },
    textureUrls = {},
  }) => {
    const validUrls = useMemo(
      () =>
        Object.fromEntries(
          Object.entries(textureUrls).filter(
            ([, value]) =>
              value && typeof value === "string" && value.trim() !== ""
          )
        ),
      [textureUrls]
    );
    const hasValidUrls = Object.keys(validUrls).length > 0;
    const [internallyLoadedTextures, setInternallyLoadedTextures] =
      useState(null);
    const handleTexturesLoaded = useCallback(
      (loaded) => setInternallyLoadedTextures(loaded),
      []
    );
    const texturesToApply = useMemo(() => {
      const newTextures = {};
      if (hasValidUrls && internallyLoadedTextures) {
        Object.keys(validUrls).forEach((originalUrlKey) => {
          const textureObject = internallyLoadedTextures[originalUrlKey];
          if (textureObject?.isTexture)
            newTextures[originalUrlKey.replace("Url", "")] = textureObject;
        });
      }
      return newTextures;
    }, [validUrls, internallyLoadedTextures, hasValidUrls]);
    useEffect(() => {
      if (texturesToApply.map?.isTexture)
        texturesToApply.map.colorSpace = THREE.SRGBColorSpace;
      if (texturesToApply.emissiveMap?.isTexture)
        texturesToApply.emissiveMap.colorSpace = THREE.SRGBColorSpace;
      Object.values(texturesToApply).forEach((tex) => {
        if (tex?.isTexture) {
          tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
          tex.needsUpdate = true;
        }
      });
    }, [texturesToApply]);
    const safeMaterialArgs = materialProps?.args || {
      color: new THREE.Color("magenta"),
    };
    const MaterialConstructor =
      materialProps?.constructor || THREE.MeshStandardMaterial;
    const allArgs = { ...safeMaterialArgs, ...texturesToApply };
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
        for (const catId in SHAPES_BY_CATEGORY_DATA) {
          const foundShape = SHAPES_BY_CATEGORY_DATA[catId].find(
            (s) => s.id === shapeId
          );
          if (foundShape?.autoMaterial) {
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
        activeActionRef, // For single animation mode
        mixerRef,
        selectedAnimationClipIndex,
        animationPlaybackState,
        isAnimationLooping,
        animationPlaybackSpeed,
        animationTime,
        forceMaterialResetKey,
        isAutoRotating,
        autoRotateSpeed,
        playAllAnimations, // New prop
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

      const dracoPath = "/draco/gltf/"; // Ensure this path is correct
      const modelAnimationState = useRef({ startTime: Date.now() });
      const allActiveActionsRef = useRef([]); // For "Play All" mode

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
          internalGroupRef.current
        ) {
          if (
            internalGroupRef.current.children[0]?.geometry === manualStlGeometry
          ) {
            targetObject = internalGroupRef.current;
          }
        }

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
                const cb = new THREE.Box3().setFromObject(child);
                if (!cb.isEmpty()) {
                  if (box.isEmpty()) box.copy(cb);
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
            const sVec = box.getSize(new THREE.Vector3());
            const mDim = Math.max(
              saneNumber(sVec.x, 1),
              saneNumber(sVec.y, 1),
              saneNumber(sVec.z, 1)
            );
            const sFac = mDim > 0 ? 3 / mDim : 1;
            targetObject.scale.setScalar(saneNumber(sFac, 1));
            const scBox = new THREE.Box3().setFromObject(targetObject);
            const scCtr = scBox.getCenter(new THREE.Vector3());
            if (!isNaN(scCtr.x)) targetObject.position.sub(scCtr);
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
        (object, animations) => {
          const targetObject = object || internalGroupRef.current;
          if (!targetObject) {
            onModelLoad(null, animations || []);
            return;
          }

          const customMaterialProps = settings.customMaterialProperties || {};
          const anyCustomTexMap = [
            "mapUrl",
            "normalMapUrl",
            "roughnessMapUrl",
            "metalnessMapUrl",
            "aoMapUrl",
            "emissiveMapUrl",
          ].some(
            (key) =>
              typeof customMaterialProps[key] === "string" &&
              customMaterialProps[key].trim() !== ""
          );
          const userSelectedSpecificMaterialType =
            settings.materialType !== "auto";

          const applyOurMaterial =
            fileType === "stl" ||
            (fileType === "obj" && !mtlUrl) ||
            anyCustomTexMap ||
            ((fileType === "gltf" ||
              fileType === "glb" ||
              fileType === "fbx" ||
              (fileType === "obj" && mtlUrl)) &&
              userSelectedSpecificMaterialType);

          if (applyOurMaterial) {
            let materialTypeForLogic = settings.materialType;
            if (settings.materialType === "auto")
              materialTypeForLogic = "ceramic";
            const {
              constructor: MatCtor,
              args: baseMatArgs,
              textureUrls: texUrlsFromSettings,
            } = createR3FMaterialProps(
              settings.shapeColor,
              materialTypeForLogic,
              customMaterialProps,
              r3fScene.environment
            );
            const textureLoader = new THREE.TextureLoader();
            const loadedTexturesCache = {};
            const meshesToProcess = [];
            if (targetObject.isMesh) meshesToProcess.push(targetObject);
            else
              targetObject.traverse((child) => {
                if (child.isMesh) meshesToProcess.push(child);
              });

            meshesToProcess.forEach(async (mesh) => {
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
                const url = texUrlsFromSettings[`${mapName}Url`];
                if (url) {
                  try {
                    let tex =
                      loadedTexturesCache[url] ||
                      (loadedTexturesCache[url] = await textureLoader.loadAsync(
                        url
                      ));
                    if (mapName === "map" || mapName === "emissiveMap")
                      tex.colorSpace = THREE.SRGBColorSpace;
                    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
                    tex.needsUpdate = true;
                    newMaterial[mapName] = tex;
                  } catch (e) {
                    console.error(`Error loading ${mapName} from ${url}`, e);
                  }
                }
              }
              if (mesh.material?.dispose && mesh.material !== newMaterial)
                mesh.material.dispose();
              mesh.material = newMaterial;
              newMaterial.needsUpdate = true;
            });
          } else if (fileType !== "stl") {
            targetObject.traverse((child) => {
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
          onModelLoad(targetObject, animations || []);
        },
        [
          r3fScene.environment,
          settings.shapeColor,
          settings.materialType,
          settings.customMaterialProperties,
          onModelLoad,
          fileType,
          mtlUrl,
        ]
      );

      useEffect(() => {
        setManualGltfScene(null);
        setManualGltfAnimations([]);
        if ((fileType === "glb" || fileType === "gltf") && modelUrl) {
          const loader = new GLTFLoader();
          const draco = new DRACOLoader();
          draco.setDecoderPath(dracoPath);
          loader.setDRACOLoader(draco);
          loader.load(
            modelUrl,
            (gltf) => {
              setManualGltfScene(gltf.scene);
              setManualGltfAnimations(gltf.animations || []);
            },
            undefined,
            (err) => {
              console.error("GLTF Load Error:", err);
              sonnerToast.error("GLTF Load Error");
            }
          );
          return () => draco.dispose();
        }
      }, [fileType, modelUrl, dracoPath]);

      useEffect(() => {
        setManualFbxScene(null);
        setManualFbxAnimations([]);
        if (fileType === "fbx" && modelUrl) {
          const loader = new FBXLoader();
          loader.load(
            modelUrl,
            (fbx) => {
              setManualFbxScene(fbx);
              setManualFbxAnimations(fbx.animations || []);
            },
            undefined,
            (err) => {
              console.error("FBX Load Error:", err);
              sonnerToast.error("FBX Load Error");
            }
          );
        }
      }, [fileType, modelUrl]);

      useEffect(() => {
        setManualObjScene(null);
        if (fileType === "obj" && modelUrl) {
          const objLoader = new OBJLoader();
          if (mtlUrl) {
            const mtlLoader = new MTLLoader();
            mtlLoader.setResourcePath(
              mtlUrl.substring(0, mtlUrl.lastIndexOf("/") + 1)
            );
            mtlLoader.load(
              mtlUrl,
              (materials) => {
                materials.preload();
                objLoader.setMaterials(materials);
                objLoader.load(
                  modelUrl,
                  (obj) => setManualObjScene(obj),
                  undefined,
                  (err) => {
                    console.error("OBJ w/ MTL Error:", err);
                    sonnerToast.error("OBJ Load Error");
                  }
                );
              },
              undefined,
              () => {
                sonnerToast.warn(
                  "MTL Load Failed, loading OBJ without materials."
                );
                objLoader.load(
                  modelUrl,
                  (obj) => setManualObjScene(obj),
                  undefined,
                  (err) => {
                    console.error("OBJ no MTL Error:", err);
                    sonnerToast.error("OBJ Load Error");
                  }
                );
              }
            );
          } else {
            objLoader.load(
              modelUrl,
              (obj) => setManualObjScene(obj),
              undefined,
              (err) => {
                console.error("OBJ no MTL Error:", err);
                sonnerToast.error("OBJ Load Error");
              }
            );
          }
        }
      }, [fileType, modelUrl, mtlUrl]);

      useEffect(() => {
        setManualStlGeometry(null);
        if (fileType === "stl" && modelUrl) {
          const loader = new STLLoader();
          loader.load(
            modelUrl,
            (geom) => setManualStlGeometry(geom),
            undefined,
            (err) => {
              console.error("STL Load Error:", err);
              sonnerToast.error("STL Load Error");
            }
          );
        }
      }, [fileType, modelUrl]);

      useEffect(() => {
        let targetObject = null;
        let animations = [];
        if ((fileType === "glb" || fileType === "gltf") && manualGltfScene) {
          targetObject = manualGltfScene;
          animations = manualGltfAnimations;
        } else if (fileType === "fbx" && manualFbxScene) {
          targetObject = manualFbxScene;
          animations = manualFbxAnimations;
        } else if (fileType === "obj" && manualObjScene) {
          targetObject = manualObjScene;
        } else if (
          fileType === "stl" &&
          manualStlGeometry &&
          internalGroupRef.current
        ) {
          targetObject = internalGroupRef.current;
        }
        if (targetObject && modelInitiallyProcessed)
          applyMaterialsOnly(targetObject, animations);
      }, [
        modelInitiallyProcessed,
        applyMaterialsOnly,
        manualGltfScene,
        manualFbxScene,
        manualObjScene,
        manualStlGeometry,
        fileType,
        manualGltfAnimations,
        manualFbxAnimations,
        forceMaterialResetKey,
      ]);

      // Central Animation Setup useEffect
      useEffect(() => {
        const modelRoot = internalGroupRef.current;
        let clips = [];
        if (modelUrl) {
          // Only proceed if modelUrl is present (implies a model is being loaded or is loaded)
          if (fileType === "glb" || fileType === "gltf")
            clips = manualGltfAnimations || [];
          else if (fileType === "fbx") clips = manualFbxAnimations || [];
        }

        // Always stop previous actions and clear refs
        if (mixerRef.current) {
          mixerRef.current.stopAllAction();
        }
        activeActionRef.current = null;
        allActiveActionsRef.current = [];

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

              if (animationPlaybackState === "playing") {
                action.play();
              } else if (animationPlaybackState === "paused") {
                action.play();
                action.paused = true;
                if (mixerRef.current && action.time === 0)
                  mixerRef.current.update(0);
              } else {
                // "stopped"
                action.stop();
                if (mixerRef.current) mixerRef.current.update(0); // Reset to base pose
              }
              allActiveActionsRef.current.push(action);
            });
          } else {
            // Single Animation Mode
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

              if (animationPlaybackState === "playing") {
                action.play();
              } else if (animationPlaybackState === "paused") {
                action.play();
                action.paused = true;
                if (mixerRef.current && action.time === 0)
                  mixerRef.current.update(0);
              } else {
                // "stopped"
                action.stop();
                if (mixerRef.current) mixerRef.current.update(0); // Reset to base pose
              }
              activeActionRef.current = action;
            }
          }
        } else {
          mixerRef.current = null;
        }

        return () => {
          if (mixerRef.current) {
            mixerRef.current.stopAllAction();
          }
        };
      }, [
        modelUrl, // Re-run when model identity changes
        fileType, // For safety, though modelUrl should cover new file loads
        manualGltfAnimations, // When animations become available for GLTF
        manualFbxAnimations, // When animations become available for FBX
        playAllAnimations,
        selectedAnimationClipIndex,
        animationPlaybackState,
        isAnimationLooping,
        animationPlaybackSpeed,
        animationTime,
        mixerRef, // Ref, but useful to include if external logic might modify it
        activeActionRef, // Ref
        // internalGroupRef.current is implicitly handled by modelUrl changing
      ]);

      useFrame((_, delta) => {
        const modelRootNode = internalGroupRef.current;
        if (!modelRootNode) return;

        if (mixerRef.current && animationPlaybackState !== "stopped") {
          mixerRef.current.update(
            delta *
              (animationPlaybackState === "playing"
                ? animationPlaybackSpeed
                : 0)
          );
        } else if (
          isAnimating &&
          !(mixerRef.current && animationPlaybackState !== "stopped") && // Don't apply float if mixer is active
          !isAutoRotating
        ) {
          const preset = animationPresets[animationPresetKey];
          if (preset) {
            const time =
              (Date.now() - modelAnimationState.current.startTime) *
              0.001 *
              settings.animationSpeed;
            modelRootNode.position.y =
              Math.sin(time * (preset.floatSpeed || 0) * 100) *
              (preset.floatAmplitude || 0);
          }
        }

        if (
          isAutoRotating &&
          !(
            mixerRef.current &&
            animationPlaybackState !== "stopped" &&
            !playAllAnimations &&
            activeActionRef.current?.isRunning()
          )
        ) {
          // Only auto-rotate if mixer is not actively playing a single animation
          // Or if playAllAnimations is true (auto-rotation can co-exist)
          if (
            playAllAnimations ||
            !(
              activeActionRef.current?.isRunning() &&
              animationPlaybackState === "playing"
            )
          ) {
            modelRootNode.rotation.y += delta * autoRotateSpeed * 0.5;
          }
        }
      });

      if (fileType === "stl") {
        if (manualStlGeometry)
          return (
            <group ref={internalGroupRef}>
              <mesh geometry={manualStlGeometry} castShadow receiveShadow>
                {/* Material will be applied by applyMaterialsOnly */}
              </mesh>
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
        // Ensure model is scaled/centered before rendering
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
              Loading ({fileType.toUpperCase()})...
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
    const textMaterial = useMemo(
      () =>
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(color),
          metalness: saneNumber(materialProps?.metalness, 0.3),
          roughness: saneNumber(materialProps?.roughness, 0.5),
          envMap: scene.environment,
          envMapIntensity: saneNumber(materialProps?.envMapIntensity, 1.0),
          side: THREE.FrontSide, // Text usually doesn't need DoubleSide
        }),
      [color, materialProps, scene.environment]
    );
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
    activeActionRef,
    mixerRef,
    selectedAnimationClipIndex,
    animationPlaybackState,
    isAnimationLooping,
    animationPlaybackSpeed,
    animationTime,
    forceMaterialResetKey,
    playAllAnimations, // New prop
  }) => {
    const { scene, gl, controls } = useThree();

    useEffect(() => {
      if (onSceneRefForExport && controls)
        onSceneRefForExport(scene, gl, controls);
    }, [scene, gl, controls, onSceneRefForExport]);

    useEffect(() => {
      if (settings.background === "customImage" && customBgImageUrl) {
        if (scene.background) scene.background = null; // Let Environment handle it
        if (scene.fog) scene.fog = null;
      } else if (settings.background === "solidColor") {
        scene.background = new THREE.Color(settings.solidBackgroundColor);
        if (scene.fog) scene.fog = null;
      } else {
        if (scene.background) scene.background = null; // Let Environment handle it or default
        let fogColor = new THREE.Color(0x101012);
        let fogNear = 12;
        let fogFar = 40;
        switch (settings.background) {
          case "modernGradient":
            fogColor = new THREE.Color(0x2c5d72); // Darker blue/teal
            break;
          case "darkSpace":
            fogColor = new THREE.Color(0x050508); // Very dark
            fogNear = 10;
            fogFar = 35;
            break;
          case "softLight":
            fogColor = new THREE.Color(0xd0d8e0); // Light grayish blue
            fogNear = 7;
            fogFar = 28;
            break;
          case "studioLight":
            fogColor = new THREE.Color(0xe4e4e7); // Brighter neutral
            fogNear = 10;
            fogFar = 35;
            break;
          default: // studioDark
            fogColor = new THREE.Color(0x18181b); // Dark gray
        }
        if (scene.fog) {
          scene.fog.color.set(fogColor);
          scene.fog.near = fogNear;
          scene.fog.far = fogFar;
        } else {
          scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);
        }
      }
    }, [
      settings.background,
      settings.solidBackgroundColor,
      customBgImageUrl,
      scene,
    ]);

    const internalMeshRef = useRef();
    useEffect(() => {
      onMeshReady(internalMeshRef.current || null);
    }, [
      // internalMeshRef.current, // This can cause loops if ref object itself changes
      isImportedModelDisplayed, // Key dependencies that indicate the mesh *content* has changed
      currentShape,
      importedModelUrl,
      onMeshReady,
    ]);

    const [textYOffset, setTextYOffset] = useState(1.0);
    useEffect(() => {
      const meshToMeasure = internalMeshRef.current;
      if (meshToMeasure) {
        // Wait for model to be fully processed and scaled
        requestAnimationFrame(() => {
          if (meshToMeasure.parent) {
            // Ensure it's part of the scene graph for accurate box calc
            const box = new THREE.Box3().setFromObject(meshToMeasure);
            if (!box.isEmpty()) {
              const modelHeight = box.max.y - box.min.y;
              const modelCenterY = box.getCenter(new THREE.Vector3()).y;
              setTextYOffset(
                modelCenterY +
                  modelHeight / 2 +
                  saneNumber(settings.textSize, 0.5) * 0.5 + // Half of text height approx
                  0.3 // Additional gap
              );
            } else {
              setTextYOffset(
                1.5 + saneNumber(settings.textSize, 0.5) * 0.5 + 0.3
              ); // Fallback if box is empty
            }
          } else {
            setTextYOffset(
              1.5 + saneNumber(settings.textSize, 0.5) * 0.5 + 0.3
            ); // Fallback if not in parent yet
          }
        });
      } else {
        setTextYOffset(1.5 + saneNumber(settings.textSize, 0.5) * 0.5 + 0.3); // Default if no mesh
      }
    }, [
      internalMeshRef.current, // Re-evaluate if the ref itself points to a new object
      settings.textSize,
      isImportedModelDisplayed,
      currentShape,
      importedModelUrl,
      current3DText, // Recalculate if text content changes (might affect bounding box logic implicitly)
      isTextVisible,
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
      }, 1500); // Resume auto-rotate after 1.5 seconds of inactivity
    }, []);

    useEffect(() => {
      return () => {
        if (autoRotatePauseTimeoutRef.current)
          clearTimeout(autoRotatePauseTimeoutRef.current);
      };
    }, []);

    const effectiveAutoRotate = settings.autoRotate && !isUserInteractingOrbit;

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
            // For studioDark, studioLight, softLight - use an HDR for reflections and optional background
            <Environment
              files='/brown_photostudio_02_4k.hdr' // A generic studio HDR
              background={
                settings.background === "studioLight" ||
                settings.background === "softLight"
              } // Only set as BG if it's a light studio
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
            // For gradient/dark space, still use HDR for reflections but not as background
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
            position={[0, -0.01, 0]} // Small offset to avoid z-fighting if model base is exactly at 0
          />
        )}
        {settings.groundPlaneType === "reflectiveFloor" && (
          <Plane
            args={[100, 100]}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.02, 0]} // Slightly lower for reflector
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
              mirror={0.6} // Adjust for desired reflectivity
            />
          </Plane>
        )}

        {!isImportedModelDisplayed ? (
          <Suspense fallback={null}>
            <ProceduralShape
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
              playAllAnimations={playAllAnimations} // Pass down
            />
          </Suspense>
        ) : null}

        <TextOverlay
          text={current3DText}
          fontUrl={settings.textFontUrl}
          color={settings.textColor}
          size={settings.textSize}
          depth={settings.textDepth}
          isVisible={isTextVisible}
          textYOffset={textYOffset}
          materialProps={{ metalness: 0.4, roughness: 0.6 }} // Example, can be configurable
        />

        <DreiOrbitControls
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
          target={[0, 0.1, 0]} // Adjust target if models are generally higher/lower
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
                kernelSize={settings.bloom.kernelSize} // This should be from postprocessing.KernelSize
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
  const textureFileInputRefs = useRef({}); // For individual texture slots
  const viewerCardRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [importedModel, setImportedModel] = useState(null); // { url, type, mtlUrl }
  const [isImportedModelDisplayed, setIsImportedModelDisplayed] =
    useState(false);
  const [importedModelName, setImportedModelName] = useState("Imported Model");

  const [currentCategory, setCurrentCategory] = useState(CATEGORIES_DATA[0].id);
  const [currentShape, setCurrentShape] = useState(
    SHAPES_BY_CATEGORY_DATA[CATEGORIES_DATA[0].id][0].id
  );

  const [isAnimating, setIsAnimating] = useState(true); // For procedural shape float
  const [animationPreset, setAnimationPreset] = useState("gentle"); // For procedural

  const [settings, setSettings] = useState(
    JSON.parse(JSON.stringify(initialSettings))
  );
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const [customBgImageUrl, setCustomBgImageUrl] = useState(null);

  const [textInput, setTextInput] = useState("Hello 3D");
  const [current3DText, setCurrent3DText] = useState(""); // Initially empty, set on button click
  const [isTextVisible, setIsTextVisible] = useState(false);

  // Refs for export and screenshots
  const meshToExportOrScreenshotRef = useRef(null);
  const r3fSceneForExportRef = useRef(null);
  const r3fGLContextRef = useRef(null);
  const orbitControlsRef = useRef(null); // Ref to DreiOrbitControls instance

  // Animation specific state for imported models
  const animationClipsRef = useRef([]);
  const activeActionRef = useRef(null); // For single animation
  const mixerRef = useRef(null);
  const [selectedAnimationClipIndex, setSelectedAnimationClipIndex] =
    useState(-1);
  const [animationPlaybackState, setAnimationPlaybackState] =
    useState("stopped"); // "playing", "paused", "stopped"
  const [animationTime, setAnimationTime] = useState(0); // Normalized 0-1
  const [animationDuration, setAnimationDuration] = useState(0); // Actual duration of selected clip
  const [isAnimationLooping, setIsAnimationLooping] = useState(true);
  const [animationPlaybackSpeed, setAnimationPlaybackSpeed] = useState(1.0);
  const [forceMaterialResetKey, setForceMaterialResetKey] = useState(0);
  const [playAllAnimations, setPlayAllAnimations] = useState(false); // New state for "Play All"

  // History Undo/Redo
  const historyStackRef = useRef([]);
  const historyPointerRef = useRef(-1);
  const isUndoingRedoingRef = useRef(false);
  const MAX_HISTORY = 50;

  const captureAppState = useCallback(
    () =>
      JSON.parse(
        JSON.stringify({
          settings,
          currentCategory,
          currentShape,
          animationPreset,
          isAnimating, // Procedural float animation state
          importedModelName,
          isImportedModelDisplayed,
          importedModelUrl: importedModel?.url,
          importedModelType: importedModel?.type,
          importedModelMtlUrl: importedModel?.mtlUrl,
          selectedAnimationClipIndex,
          animationPlaybackState, // Imported model animation state
          animationTime,
          isAnimationLooping,
          animationPlaybackSpeed,
          playAllAnimations, // NEW
          customBgImageUrl,
          current3DText,
          isTextVisible,
          forceMaterialResetKey,
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
      playAllAnimations, // NEW
      customBgImageUrl,
      current3DText,
      isTextVisible,
      forceMaterialResetKey,
    ]
  );

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
        (stateToApply.importedModelUrl !== importedModel?.url ||
          stateToApply.importedModelType !== importedModel?.type) // Check type too
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
      setPlayAllAnimations(stateToApply.playAllAnimations); // NEW

      setCustomBgImageUrl(stateToApply.customBgImageUrl);
      setCurrent3DText(stateToApply.current3DText);
      setIsTextVisible(stateToApply.isTextVisible);
      setTextInput(stateToApply.current3DText || "Hello 3D"); // Update input field

      if (stateToApply.forceMaterialResetKey !== undefined)
        setForceMaterialResetKey(stateToApply.forceMaterialResetKey);

      // Use requestAnimationFrame to ensure state updates propagate before clearing flag
      requestAnimationFrame(() => {
        isUndoingRedoingRef.current = false;
      });
    },
    [importedModel] // importedModel is a dependency if its structure affects how state is applied
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
        return; // No change

      const stack = historyStackRef.current.slice(
        0,
        historyPointerRef.current + 1
      );
      stack.push(currentState);
      if (stack.length > MAX_HISTORY) stack.shift(); // Keep history bounded
      historyStackRef.current = stack;
      historyPointerRef.current = stack.length - 1;
      // console.log(`History pushed: ${actionName}`, historyPointerRef.current + 1, '/', stack.length);
    },
    [captureAppState] // captureAppState itself is memoized
  );

  const handleUndo = useCallback(() => {
    if (historyPointerRef.current > 0) {
      historyPointerRef.current--;
      applyState(historyStackRef.current[historyPointerRef.current]);
      sonnerToast.info("Undo Applied");
    } else {
      sonnerToast.warning("Nothing more to undo.");
    }
  }, [applyState]); // applyState is memoized

  const handleRedo = useCallback(() => {
    if (historyPointerRef.current < historyStackRef.current.length - 1) {
      historyPointerRef.current++;
      applyState(historyStackRef.current[historyPointerRef.current]);
      sonnerToast.info("Redo Applied");
    } else {
      sonnerToast.warning("Nothing more to redo.");
    }
  }, [applyState]); // applyState is memoized

  useEffect(() => {
    setIsMounted(true);
    // Push initial state after a short delay to allow everything to settle
    const timer = setTimeout(() => {
      pushHistory("initial load");
    }, 500);
    return () => clearTimeout(timer);
  }, []); // Empty dependency array means this runs once on mount

  // Debounced history push for general state changes
  const debouncedPushHistoryRef = useRef(null);
  useEffect(() => {
    if (!isMounted || isUndoingRedoingRef.current) return; // Don't push history during mount or undo/redo

    if (debouncedPushHistoryRef.current) {
      clearTimeout(debouncedPushHistoryRef.current);
    }
    debouncedPushHistoryRef.current = setTimeout(() => {
      if (isMounted && !isUndoingRedoingRef.current) {
        // Double check mounted and not undoing
        pushHistory("state changed");
      }
    }, 750); // Debounce time

    return () => {
      if (debouncedPushHistoryRef.current) {
        clearTimeout(debouncedPushHistoryRef.current);
      }
    };
  }, [captureAppState, isMounted]); // Re-evaluate whenever captureAppState would produce a new value or mount status changes

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
    document.addEventListener("webkitfullscreenchange", fsChange); // Safari
    document.addEventListener("mozfullscreenchange", fsChange); // Firefox
    document.addEventListener("MSFullscreenChange", fsChange); // IE/Edge
    return () => {
      document.removeEventListener("fullscreenchange", fsChange);
      document.removeEventListener("webkitfullscreenchange", fsChange);
      document.removeEventListener("mozfullscreenchange", fsChange);
      document.removeEventListener("MSFullscreenChange", fsChange);
    };
  }, []);

  const handleMeshReadyForParent = useCallback((mesh) => {
    meshToExportOrScreenshotRef.current = mesh;
  }, []);

  const handleSceneRefForExportCallback = useCallback(
    (scene, gl, controlsInstance) => {
      r3fSceneForExportRef.current = scene;
      r3fGLContextRef.current = gl;
      // orbitControlsRef.current = controlsInstance; // This is passed from useThree, not needed here
    },
    []
  );

  const handleModelLoadedForScene = useCallback((loadedObject, loadedAnims) => {
    animationClipsRef.current = loadedAnims || [];
    if (loadedObject && animationClipsRef.current.length > 0) {
      setSelectedAnimationClipIndex(0); // Default to first animation
      setAnimationDuration(animationClipsRef.current[0].duration);
      setAnimationPlaybackState("playing"); // Auto-play first animation
      setAnimationTime(0);
    } else {
      setSelectedAnimationClipIndex(-1);
      setAnimationDuration(0);
      setAnimationPlaybackState("stopped");
      setAnimationTime(0);
    }
  }, []);

  const handleResetOrbitControlsView = useCallback(() => {
    if (orbitControlsRef.current?.reset) {
      // orbitControlsRef is now populated by Canvas onCreated
      orbitControlsRef.current.reset();
      sonnerToast.info("View Reset");
      pushHistory("reset view");
    } else {
      // Fallback if orbitControlsRef.current is not yet set or DreiOrbitControls doesn't expose reset
      // This is less common now with direct ref passing.
      // Attempt to get from r3f context if needed.
      // For now, assume orbitControlsRef.current is correctly populated.
      sonnerToast.warning("OrbitControls not available to reset.");
    }
  }, [pushHistory]); // orbitControlsRef.current might not be stable here if trying to use a ref from useThree

  const handleToggleGlobalAnimation = useCallback(() => {
    // This is for procedural shape float
    setIsAnimating((p) => {
      sonnerToast.info(`Float Animation ${!p ? "Resumed" : "Paused"}`);
      return !p;
    });
    // pushHistory is handled by the debounced effect
  }, []);

  const handleSettingsChange = (key, value, subKey = null) => {
    setSettings((s) => {
      const newSettings = { ...s };
      if (subKey) {
        newSettings[key] = { ...(s[key] || {}), [subKey]: value };
      } else {
        newSettings[key] = value;
      }
      return newSettings;
    });
    // pushHistory is handled by the debounced effect
  };
  const resetCustomMaterialProperties = () => {
    const activeMatType =
      settings.materialType === "auto"
        ? isImportedModelDisplayed
          ? "ceramic"
          : SHAPES_BY_CATEGORY_DATA[currentCategory]?.find(
              (s) => s.id === currentShape
            )?.autoMaterial || "ceramic"
        : settings.materialType;

    if (baseMaterialPresets[activeMatType]) {
      const presetDefaults = baseMaterialPresets[activeMatType];
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
        customMaterialProperties: {
          ...resetTextures, // Clear all texture URLs first
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
        `Material properties reset to '${activeMatType}' defaults.`
      );
    } else {
      sonnerToast.warn("Could not determine preset to reset to.");
    }
    // pushHistory is handled by the debounced effect
  };

  const handleCategorySelect = useCallback((id) => {
    setIsImportedModelDisplayed(false);
    setImportedModel(null); // Clear imported model details
    setCurrentCategory(id);
    setCurrentShape(SHAPES_BY_CATEGORY_DATA[id][0].id);
    // Reset animation states for imported models as we are switching away
    animationClipsRef.current = [];
    setSelectedAnimationClipIndex(-1);
    setAnimationPlaybackState("stopped");
    // pushHistory is handled by the debounced effect
  }, []);

  const handleShapeSelect = useCallback((id) => {
    setIsImportedModelDisplayed(false);
    setImportedModel(null);
    setCurrentShape(id);
    animationClipsRef.current = [];
    setSelectedAnimationClipIndex(-1);
    setAnimationPlaybackState("stopped");
    // pushHistory is handled by the debounced effect
  }, []);

  const handleRandomize = useCallback(() => {
    isUndoingRedoingRef.current = true; // Prevent pushHistory during multi-set

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
    setAnimationPreset(randPresetKey); // For procedural float

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
    setPlayAllAnimations(false); // Default to single animation for randomized state

    setSettings((prev) => ({
      ...prev,
      materialType: randMat,
      shapeColor: randColor,
      background: randBgKey,
      extrudeDepth: saneNumber(Math.random() * (1.0 - 0.1) + 0.1, 0.4),
      animationSpeed: saneNumber(Math.random() * (2.0 - 0.5) + 0.5, 1.0), // Procedural float speed
      keyLight: newKeyLight,
      fillLight: newFillLight,
      ambientLight: newAmbientLight,
      customMaterialProperties: JSON.parse(
        JSON.stringify(initialSettings.customMaterialProperties) // Reset custom props
      ),
      textColor: randomTextColor,
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

    // Reset imported model animation state
    animationClipsRef.current = [];
    setSelectedAnimationClipIndex(-1);
    setAnimationPlaybackState("stopped");
    setAnimationTime(0);
    setAnimationDuration(0);

    sonnerToast.success("Scene Randomized!");
    requestAnimationFrame(() => {
      isUndoingRedoingRef.current = false;
      pushHistory("randomize scene");
    });
  }, []);

  const handleResetImportedAppearance = useCallback(() => {
    if (!isImportedModelDisplayed || !importedModel) return;
    setSettings((s) => ({
      ...s,
      materialType: "auto", // This will trigger default behavior for imported models
      customMaterialProperties: {
        ...initialSettings.customMaterialProperties, // Reset all custom props
        envMapIntensity: s.customMaterialProperties.envMapIntensity, // Keep current envMapIntensity
      },
    }));
    setForceMaterialResetKey((prev) => prev + 1); // Trigger re-application of materials
    sonnerToast.info("Imported model appearance reset.");
    // pushHistory is handled by the debounced effect
  }, [isImportedModelDisplayed, importedModel]);

  const currentShapeRef = useRef(currentShape); // For export filename if procedural
  useEffect(() => {
    currentShapeRef.current = currentShape;
  }, [currentShape]);

  const currentImportedModelNameRef = useRef(importedModelName); // For export filename
  useEffect(() => {
    currentImportedModelNameRef.current = importedModelName;
  }, [importedModelName]);

  const handleExportGLB = useCallback(async () => {
    if (isExporting) return;
    if (!meshToExportOrScreenshotRef.current && !isTextVisible) {
      sonnerToast.warning("Nothing to export.");
      return;
    }

    setIsExporting(true);
    setExportProgress(0);
    const toastId = sonnerToast.loading("Exporting GLB...");

    const sceneToExport = new THREE.Scene();
    let hasContent = false;

    if (meshToExportOrScreenshotRef.current) {
      const clone = meshToExportOrScreenshotRef.current.clone(true); // Deep clone
      // Ensure materials on the clone are standard if they were custom Drei/R3F components
      clone.traverse((child) => {
        if (child.isMesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material = child.material.map((m) =>
              m.isMaterial
                ? m
                : new THREE.MeshStandardMaterial({ color: "gray" })
            );
          } else if (!child.material.isMaterial) {
            child.material = new THREE.MeshStandardMaterial({ color: "gray" });
          }
        }
      });
      sceneToExport.add(clone);
      hasContent = true;
    }

    if (isTextVisible && current3DText && settings.textFontUrl) {
      let fontToUse = helvetikerFontForExport; // Use preloaded default if possible
      if (!fontToUse || settings.textFontUrl !== DEFAULT_FONT_PATH) {
        try {
          fontToUse = await new FontLoader().loadAsync(settings.textFontUrl);
          if (
            settings.textFontUrl === DEFAULT_FONT_PATH &&
            !helvetikerFontForExport
          ) {
            helvetikerFontForExport = fontToUse; // Cache if it's the default loaded for the first time
          }
        } catch (e) {
          console.error("Font load failed for export:", e);
          sonnerToast.error("Font load failed for export", { id: toastId });
          setIsExporting(false);
          return;
        }
      }

      if (fontToUse) {
        const textGeom = new TextGeometry(current3DText, {
          font: fontToUse,
          size: saneNumber(settings.textSize, 0.5),
          height: saneNumber(settings.textDepth, 0.05),
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: saneNumber(0.02 * (settings.textSize / 0.5), 0.01),
          bevelSize: saneNumber(0.01 * (settings.textSize / 0.5), 0.005),
        });
        textGeom.center(); // Center the geometry

        const { constructor: MatCtor, args: matArgs } = createR3FMaterialProps(
          settings.textColor,
          "ceramic", // Use a basic material type for text export
          {},
          r3fSceneForExportRef.current?.environment // Use scene env map if available
        );
        const textMaterial = new MatCtor(matArgs);
        const textMesh = new THREE.Mesh(textGeom, textMaterial);

        // Calculate Y offset for text based on main model's bounding box
        let textExportYOffset = 0;
        if (meshToExportOrScreenshotRef.current) {
          const modelBox = new THREE.Box3().setFromObject(
            meshToExportOrScreenshotRef.current
          );
          if (!modelBox.isEmpty()) {
            const modelHeight = modelBox.max.y - modelBox.min.y;
            const modelCenterY = modelBox.getCenter(new THREE.Vector3()).y;
            textExportYOffset =
              modelCenterY +
              modelHeight / 2 +
              saneNumber(settings.textSize, 0.5) * 0.5 +
              0.3;
          } else {
            textExportYOffset =
              1.5 + saneNumber(settings.textSize, 0.5) * 0.5 + 0.3; // Fallback
          }
        } else {
          textExportYOffset = saneNumber(settings.textSize, 0.5) * 0.5 + 0.3; // Only text
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
      await new Promise((resolve) => setTimeout(resolve, 100)); // Brief pause for UI
      setExportProgress(30);

      const exporter = new GLTFExporter();
      const exportOptions = {
        binary: true, // GLB
        embedImages: true, // If any textures are embedded
        animations:
          isImportedModelDisplayed &&
          importedModel &&
          animationClipsRef.current.length > 0
            ? animationClipsRef.current // Export all animations of the imported model
            : [],
      };

      exporter.parse(
        sceneToExport,
        (gltf) => {
          const blob = new Blob([gltf], { type: "application/octet-stream" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          const baseName = isImportedModelDisplayed
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
          sonnerToast.error("GLB Export Failed", {
            id: toastId,
            description: error.message || "Unknown exporter error",
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
    isTextVisible,
    current3DText,
    settings.textColor,
    settings.textSize,
    settings.textDepth,
    settings.textFontUrl,
    isImportedModelDisplayed,
    importedModel, // For animations
    // meshToExportOrScreenshotRef.current, r3fSceneForExportRef.current - refs are tricky in deps
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
        const link = document.createElement("a");
        const baseName = isImportedModelDisplayed
          ? (currentImportedModelNameRef.current || "imported_model")
              .replace(/[^a-z0-9]/gi, "_")
              .toLowerCase()
          : currentShapeRef.current || "procedural_shape";
        const textSuffix = isTextVisible && current3DText ? "-with-text" : "";
        link.download = `shape_studio_${baseName}${textSuffix}.obj`;
        link.href =
          "data:text/plain;charset=utf-8," +
          encodeURIComponent(
            "# OBJ file simulated\n# Actual OBJ Exporter needed for full geometry and materials.\n# This is a placeholder file."
          );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        sonnerToast.success("OBJ Export (Simulated) Ready", {
          id: exportToastId,
          description: "Simulated OBJ file downloaded.",
        });
        setTimeout(() => {
          setIsExporting(false);
          setExportProgress(0);
        }, 500);
      }
    }, 150);
  }, [isExporting, isImportedModelDisplayed, current3DText, isTextVisible]);

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
    // Ensure canvas is rendered before capturing
    requestAnimationFrame(() => {
      gl.render(
        r3fSceneForExportRef.current,
        r3fSceneForExportRef.current.camera
      ); // Force a render
      try {
        const canvas = gl.domElement;
        const link = document.createElement("a");
        const baseName = isImportedModelDisplayed
          ? (currentImportedModelNameRef.current || "view")
              .replace(/[^a-z0-9]/gi, "_")
              .toLowerCase()
          : currentShapeRef.current || "view";
        const textSuffix = isTextVisible && current3DText ? "-with-text" : "";
        link.download = `screenshot_shape_studio_${baseName}${textSuffix}.png`;
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
          description: e.message || "Could not save image.",
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

      // Reset animation state for the new model
      animationClipsRef.current = [];
      setSelectedAnimationClipIndex(-1);
      setAnimationPlaybackState("stopped");
      setAnimationTime(0);
      setAnimationDuration(0);
      setPlayAllAnimations(false); // Default to single animation mode for new imports

      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        // mixerRef.current = null; // Let ImportedModel handle mixer creation
      }
      if (activeActionRef.current) {
        // activeActionRef.current = null; // Let ImportedModel handle action creation
      }
      setForceMaterialResetKey((prev) => prev + 1); // Trigger material re-evaluation
      // pushHistory is handled by the debounced effect
    },
    [] // No dependencies, this is a utility function
  );

  const handleFiles = useCallback(
    async (files) => {
      if (!files || files.length === 0) return;
      const importToastId = sonnerToast.loading("Processing File(s)...", {
        duration: Infinity, // Keep toast until success/error
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

      if (modelFileType === "obj") {
        mtlFile = Array.from(files).find((f) =>
          f.name.toLowerCase().endsWith(".mtl")
        );
      }

      if (modelFile) {
        // Revoke old blob URLs if they exist
        if (importedModel?.url?.startsWith("blob:"))
          URL.revokeObjectURL(importedModel.url);
        if (importedModel?.mtlUrl?.startsWith("blob:"))
          URL.revokeObjectURL(importedModel.mtlUrl);

        let modelUrlToUse;
        const mtlUrlToUse = mtlFile ? URL.createObjectURL(mtlFile) : null;

        // GLTF/GLB benefit from Data URLs if small enough, but object URLs are fine too.
        // For simplicity and consistency with other loaders that might not handle Data URLs for resources,
        // let's use Object URLs for all non-DataURL types.
        // Except GLB/GLTF for direct loader.load(dataUrl) which can be more self-contained.
        if (modelFileType === "glb" || modelFileType === "gltf") {
          try {
            const reader = new FileReader();
            modelUrlToUse = await new Promise((resolve, reject) => {
              reader.onload = (event) => resolve(event.target.result);
              reader.onerror = reject;
              reader.readAsDataURL(modelFile);
            });
            // Ensure correct MIME type for GLB data URLs
            if (
              modelFileType === "glb" &&
              modelUrlToUse.startsWith("data:application/octet-stream")
            ) {
              modelUrlToUse = modelUrlToUse.replace(
                "data:application/octet-stream",
                "data:model/gltf-binary"
              );
            }
          } catch (error) {
            console.error("File to Data URL conversion error:", error);
            sonnerToast.error("File Processing Error", {
              id: importToastId,
              description: `Failed to convert ${modelFileType.toUpperCase()} to Data URL. Try a different file or format.`,
            });
            if (fileInputRef.current) fileInputRef.current.value = null; // Reset file input
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
        sonnerToast.success("Model Ready for Display", {
          id: importToastId,
          description: `${modelFile.name} has been prepared.`,
        });
      } else {
        sonnerToast.error("No Compatible Model File Found", {
          id: importToastId,
          description: "Please select a GLB, GLTF, FBX, STL, or OBJ file.",
        });
      }
      if (fileInputRef.current) fileInputRef.current.value = null; // Reset file input
    },
    [processAndSetImportedModel, importedModel] // importedModel for revoking old URLs
  );

  const triggerImport = useCallback(() => {
    if (fileInputRef.current) fileInputRef.current.click();
  }, []);

  const handleFileDropOnViewer = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (event.dataTransfer.files?.length > 0) {
        handleFiles(Array.from(event.dataTransfer.files));
      }
    },
    [handleFiles]
  );

  const handlePlayPauseAnimation = () => {
    if (animationClipsRef.current.length === 0) {
      sonnerToast.warning("No animations loaded for this model.");
      return;
    }
    if (!playAllAnimations && selectedAnimationClipIndex < 0) {
      sonnerToast.warning("No animation clip selected to play/pause.");
      return;
    }

    setAnimationPlaybackState((prev) =>
      prev === "playing" ? "paused" : "playing"
    );
    // pushHistory is handled by the debounced effect
  };

  const handleStopAnimation = () => {
    if (animationClipsRef.current.length === 0) {
      sonnerToast.warning("No animations loaded to stop.");
      return;
    }
    if (
      !playAllAnimations &&
      selectedAnimationClipIndex < 0 &&
      animationPlaybackState === "stopped"
    ) {
      // Already stopped or nothing to stop for single mode
      return;
    }
    setAnimationPlaybackState("stopped");
    setAnimationTime(0); // Reset time to beginning
    // pushHistory is handled by the debounced effect
  };

  const handleAnimationClipChange = (indexStr) => {
    const index = parseInt(indexStr, 10);
    if (index >= 0 && index < animationClipsRef.current.length) {
      setSelectedAnimationClipIndex(index);
      setAnimationDuration(animationClipsRef.current[index].duration);
      // Optionally auto-play or keep current state. Let's keep current state.
      // If was stopped, stay stopped. If playing/paused, apply to new clip.
      setAnimationTime(0); // Reset time for new clip
      sonnerToast.info(
        `Switched to Animation: ${
          animationClipsRef.current[index].name || `Clip ${index + 1}`
        }`
      );
    } else {
      // This case should ideally not happen if UI is bound correctly
      setSelectedAnimationClipIndex(-1);
      setAnimationDuration(0);
    }
    // pushHistory is handled by the debounced effect
  };

  const handleAnimationTimeChange = (value) => {
    // value is [normalizedTime]
    setAnimationTime(value[0]);
    // No pushHistory here, too frequent. Changes are captured by global state push.
  };

  const handleAnimationLoopToggle = (checked) => {
    setIsAnimationLooping(checked);
    // pushHistory is handled by the debounced effect
  };

  const handleAnimationSpeedChange = (value) => {
    // value is [speed]
    setAnimationPlaybackSpeed(value[0]);
    // pushHistory is handled by the debounced effect
  };

  const handleCustomBgImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (customBgImageUrl?.startsWith("blob:"))
        URL.revokeObjectURL(customBgImageUrl); // Revoke old if exists
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomBgImageUrl(e.target.result); // This will be a data URL
        setSettings((s) => ({ ...s, background: "customImage" }));
        sonnerToast.success("Custom background image set.");
        // pushHistory is handled by the debounced effect
      };
      reader.onerror = () => sonnerToast.error("File Read Error");
      reader.readAsDataURL(file);
    }
    if (event.target) event.target.value = null; // Reset file input
  };

  const handleClearCustomBgImage = () => {
    if (customBgImageUrl?.startsWith("blob:"))
      URL.revokeObjectURL(customBgImageUrl);
    setCustomBgImageUrl(null);
    if (settings.background === "customImage") {
      handleSettingsChange("background", "studioDark"); // Revert to a default
    }
    sonnerToast.info("Custom background image cleared.");
    // pushHistory is handled by the debounced effect
  };

  const handleTextureUpload = (mapType, event) => {
    const file = event.target.files[0];
    if (file) {
      const urlKey = `${mapType}Url`;
      const oldUrl = settings.customMaterialProperties[urlKey];
      if (oldUrl?.startsWith("blob:")) URL.revokeObjectURL(oldUrl); // Revoke old if exists

      const reader = new FileReader();
      reader.onload = (e) => {
        setSettings((s) => ({
          ...s,
          customMaterialProperties: {
            ...s.customMaterialProperties,
            [urlKey]: e.target.result, // This will be a data URL
          },
        }));
        sonnerToast.success(`${mapType.replace("Map", "")} texture set.`);
        // pushHistory is handled by the debounced effect
      };
      reader.onerror = () => sonnerToast.error("File Read Error");
      reader.readAsDataURL(file);
    }
    if (event.target) event.target.value = null; // Reset file input
  };

  const handleClearTexture = (mapType) => {
    const urlKey = `${mapType}Url`;
    const oldUrl = settings.customMaterialProperties[urlKey];
    if (oldUrl?.startsWith("blob:")) URL.revokeObjectURL(oldUrl);

    setSettings((s) => ({
      ...s,
      customMaterialProperties: {
        ...s.customMaterialProperties,
        [urlKey]: null,
      },
    }));
    sonnerToast.info(`${mapType.replace("Map", "")} texture cleared.`);
    // pushHistory is handled by the debounced effect
  };

  const handleSet3DText = () => {
    const trimmed = textInput.trim();
    setCurrent3DText(trimmed);
    setIsTextVisible(trimmed !== ""); // Show if text is not empty
    sonnerToast.info(
      trimmed !== "" ? `3D Text Updated: "${trimmed}"` : "3D Text Cleared"
    );
    // pushHistory is handled by the debounced effect
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
  if (settings.background === "solidColor") {
    canvasBgColor = settings.solidBackgroundColor;
  } else if (settings.background !== "customImage" || !customBgImageUrl) {
    // For non-custom image backgrounds, derive a solid fallback for the canvas element itself
    // The Environment component will handle the visual background/skybox
    if (settings.background === "darkSpace") canvasBgColor = "#0a0a10";
    else if (settings.background === "studioDark") canvasBgColor = "#18181b";
    else if (settings.background === "softLight") canvasBgColor = "#e0e8f0";
    else if (settings.background === "studioLight") canvasBgColor = "#f4f4f5";
    else if (settings.background === "modernGradient")
      canvasBgColor = "#1e3b49"; // A base color for the gradient
  }
  const canvasKey = `canvas-gl-alpha-${(
    canvasBgColor === "transparent"
  ).toString()}`;
  const canUndo = historyPointerRef.current > 0;
  const canRedo =
    historyPointerRef.current < historyStackRef.current.length - 1;

  let currentActiveMaterialType = settings.materialType;
  if (settings.materialType === "auto") {
    if (isImportedModelDisplayed) {
      // For imported models, 'auto' usually means let the model's materials show,
      // unless user provides custom textures, then we might switch to a 'ceramic' base.
      const anyCustomTex = Object.keys(settings.customMaterialProperties)
        .filter((k) => k.endsWith("Url") && k !== "envMapIntensityUrl") // Exclude envMapIntensity
        .some(
          (key) =>
            typeof settings.customMaterialProperties[key] === "string" &&
            settings.customMaterialProperties[key].trim() !== ""
        );
      currentActiveMaterialType = anyCustomTex ? "ceramic" : "auto"; // If custom tex, provide a base, else 'auto' means model's own.
    } else {
      // For procedural shapes
      currentActiveMaterialType =
        SHAPES_BY_CATEGORY_DATA[currentCategory]?.find(
          (s) => s.id === currentShape
        )?.autoMaterial || "ceramic";
    }
  }

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
                          if (importedModel?.mtlUrl?.startsWith("blob:")) {
                            URL.revokeObjectURL(importedModel.mtlUrl);
                          }
                          setImportedModel(null);
                          setIsImportedModelDisplayed(false);
                          setImportedModelName("Imported Model");
                          const defaultCatId = CATEGORIES_DATA[0].id;
                          setCurrentCategory(defaultCatId);
                          setCurrentShape(
                            SHAPES_BY_CATEGORY_DATA[defaultCatId][0].id
                          );
                          animationClipsRef.current = [];
                          setSelectedAnimationClipIndex(-1);
                          setAnimationPlaybackState("stopped");
                          setAnimationTime(0);
                          setAnimationDuration(0);
                          setPlayAllAnimations(false);
                          if (mixerRef.current) {
                            mixerRef.current.stopAllAction();
                          }
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
                        checked={isTextVisible && current3DText !== ""}
                        onCheckedChange={(checked) =>
                          setIsTextVisible(checked && current3DText !== "")
                        }
                        disabled={current3DText === ""}
                      />
                      <Label
                        htmlFor='text-visibility-switch'
                        className={cn(
                          "text-sm text-slate-300",
                          current3DText === "" && "text-slate-500"
                        )}
                      >
                        Show 3D Text {current3DText === "" && "(No text set)"}
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
                    {/* NEW: Play All Animations Toggle - Placed First */}
                    {isImportedModelDisplayed &&
                      animationClipsRef.current.length > 1 && (
                        <div className='flex items-center justify-between pt-1'>
                          <Label
                            htmlFor='playAllAnimsGlobalSwitch'
                            className='text-sm text-slate-300 flex items-center'
                          >
                            <LayersIcon
                              size={14}
                              className='mr-1.5 text-orange-400'
                            />
                            Play All Model Animations
                          </Label>
                          <Switch
                            id='playAllAnimsGlobalSwitch'
                            checked={playAllAnimations}
                            onCheckedChange={(checked) => {
                              setPlayAllAnimations(checked);
                              pushHistory(
                                checked
                                  ? "enable play all animations"
                                  : "disable play all animations"
                              );
                            }}
                          />
                        </div>
                      )}
                    {/* END NEW */}

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
                      onValueChange={setAnimationPreset}
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
                      disabled={
                        isExporting ||
                        (!meshToExportOrScreenshotRef.current && !isTextVisible)
                      }
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
                      disabled={
                        isExporting ||
                        (!meshToExportOrScreenshotRef.current && !isTextVisible)
                      }
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
                        onCloseAutoFocus={(e) => e.preventDefault()}
                      >
                        <SheetHeader className='p-4 border-b border-slate-700'>
                          <SheetTitle className='text-xl text-slate-100'>
                            Viewer & Model Settings
                          </SheetTitle>
                          <SheetDescription className='text-slate-400 text-xs'>
                            Fine-tune appearance, lighting, and animations.
                          </SheetDescription>
                        </SheetHeader>
                        <ScrollArea className='h-[calc(100vh-128px)]'>
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
                                {settings.materialType === "auto" &&
                                  isImportedModelDisplayed && (
                                    <p className='text-xs text-slate-400 italic mt-1'>
                                      "Auto" uses the model's embedded
                                      materials. Select another type to
                                      override.
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
                                  onChange={(e) =>
                                    handleSettingsChange(
                                      "shapeColor",
                                      e.target.value
                                    )
                                  }
                                  className='w-full p-1 h-9 bg-slate-700 border-slate-600 cursor-pointer focus-visible:ring-purple-500'
                                />
                              </div>

                              {!(
                                settings.materialType === "auto" &&
                                isImportedModelDisplayed &&
                                !Object.values(
                                  settings.customMaterialProperties
                                )
                                  .filter(
                                    (v) =>
                                      typeof v === "string" &&
                                      v.includes("Url") &&
                                      v !== "envMapIntensityUrl"
                                  )
                                  .some((v) => v && v.trim() !== "")
                              ) && (
                                <div className='p-3 border border-slate-600 rounded-md space-y-3 bg-slate-700/30'>
                                  <div className='flex justify-between items-center'>
                                    <h4 className='text-xs font-semibold text-purple-300'>
                                      Fine-tune '{currentActiveMaterialType}'
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
                                  {currentActiveMaterialType !== "glass" &&
                                    currentActiveMaterialType !== "crystal" && (
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
                                                currentActiveMaterialType
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
                                                currentActiveMaterialType
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
                                  {(currentActiveMaterialType === "metallic" ||
                                    currentActiveMaterialType === "ceramic" ||
                                    currentActiveMaterialType === "plastic" ||
                                    currentActiveMaterialType ===
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
                                              currentActiveMaterialType
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
                                              currentActiveMaterialType
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
                                  {(currentActiveMaterialType === "glass" ||
                                    currentActiveMaterialType ===
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
                                                currentActiveMaterialType
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
                                                currentActiveMaterialType
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
                                                currentActiveMaterialType
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
                                                currentActiveMaterialType
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
                                              settings.customMaterialProperties
                                                .thickness ??
                                              baseMaterialPresets[
                                                currentActiveMaterialType
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
                                                currentActiveMaterialType
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
                                  {baseMaterialPresets[
                                    currentActiveMaterialType
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
                                              currentActiveMaterialType
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
                                              currentActiveMaterialType
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
                                            currentActiveMaterialType
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
                                            currentActiveMaterialType
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
                                    Textures
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
                                            accept='image/*'
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
                                    onChange={(e) =>
                                      handleSettingsChange(
                                        "textFontUrl",
                                        e.target.value
                                      )
                                    }
                                    placeholder='/fonts/helvetiker_regular.typeface.json'
                                    className='w-full bg-slate-700 border-slate-600 text-slate-100 text-xs'
                                  />
                                  <p className='text-xs text-slate-400'>
                                    Default: Helvetiker. Place custom fonts in
                                    `public/fonts/`.
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
                                  <Orbit size={14} className='mr-1.5' />{" "}
                                  Auto-Rotate Model
                                </Label>
                                <Switch
                                  id='autoRotateSwitchPanel'
                                  checked={settings.autoRotate}
                                  onCheckedChange={(val) =>
                                    handleSettingsChange("autoRotate", val)
                                  }
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
                                  onValueChange={(v) =>
                                    handleSettingsChange("groundPlaneType", v)
                                  }
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
                                  onValueChange={(value) =>
                                    handleSettingsChange("background", value)
                                  }
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
                                    htmlFor='n8aoEnableSheetPanel'
                                    className='text-sm text-slate-200'
                                  >
                                    N8AO (Ambient Occlusion)
                                  </Label>
                                  <Switch
                                    id='n8aoEnableSheetPanel'
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
                                          animationClipsRef.current.length ===
                                            0 || playAllAnimations
                                        }
                                      >
                                        <SelectTrigger className='w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500 disabled:opacity-50'>
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
                                            animationClipsRef.current.length ===
                                              0 ||
                                            (!playAllAnimations &&
                                              selectedAnimationClipIndex < 0)
                                          }
                                          className={cn(
                                            animationPlaybackState === "playing"
                                              ? "bg-yellow-500 hover:bg-yellow-600"
                                              : "bg-green-600 hover:bg-green-700",
                                            "disabled:bg-slate-500"
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
                                            animationClipsRef.current.length ===
                                              0 ||
                                            animationPlaybackState ===
                                              "stopped" ||
                                            (!playAllAnimations &&
                                              selectedAnimationClipIndex < 0)
                                          }
                                          className='bg-red-600 hover:bg-red-700 disabled:bg-slate-500'
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
                                                animationClipsRef.current
                                                  .length === 0 ||
                                                (!playAllAnimations &&
                                                  selectedAnimationClipIndex <
                                                    0)
                                              }
                                              className={cn(
                                                isAnimationLooping
                                                  ? "bg-purple-500 hover:bg-purple-600 text-white"
                                                  : "border-slate-600 text-slate-300 hover:bg-slate-700/50",
                                                "disabled:border-slate-600 disabled:text-slate-500 disabled:bg-transparent disabled:hover:bg-transparent"
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
                                          htmlFor='animTimePanelSheetPanel'
                                          className={cn(
                                            "text-sm text-slate-300",
                                            playAllAnimations &&
                                              animationClipsRef.current.length >
                                                0 &&
                                              "italic"
                                          )}
                                        >
                                          Time:{" "}
                                          {playAllAnimations &&
                                          animationClipsRef.current.length > 0
                                            ? `(Normalized Time: ${animationTime.toFixed(
                                                3
                                              )})`
                                            : selectedAnimationClipIndex >= 0 &&
                                              animationDuration > 0
                                            ? `${(
                                                animationTime *
                                                animationDuration
                                              ).toFixed(
                                                2
                                              )}s / ${animationDuration.toFixed(
                                                2
                                              )}s`
                                            : `(No clip selected or zero duration)`}
                                        </Label>
                                        <Slider
                                          id='animTimePanelSheetPanel'
                                          min={0}
                                          max={1}
                                          step={0.001}
                                          value={[animationTime]}
                                          onValueChange={
                                            handleAnimationTimeChange
                                          }
                                          disabled={
                                            animationClipsRef.current.length ===
                                              0 ||
                                            (!playAllAnimations &&
                                              (selectedAnimationClipIndex < 0 ||
                                                animationDuration === 0))
                                          }
                                          className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4 disabled:opacity-50'
                                        />
                                      </div>
                                      <div className='space-y-1.5'>
                                        <Label
                                          htmlFor='animSpeedPanelSliderSheetPanel'
                                          className='text-sm text-slate-300'
                                        >
                                          Speed:{" "}
                                          {animationPlaybackSpeed.toFixed(1)}x
                                        </Label>
                                        <Slider
                                          id='animSpeedPanelSliderSheetPanel'
                                          min={0.1}
                                          max={3}
                                          step={0.1}
                                          value={[animationPlaybackSpeed]}
                                          onValueChange={
                                            handleAnimationSpeedChange
                                          }
                                          disabled={
                                            animationClipsRef.current.length ===
                                              0 ||
                                            (!playAllAnimations &&
                                              selectedAnimationClipIndex < 0)
                                          }
                                          className='[&>span:first-child]:h-1 [&>span>span]:bg-purple-500 [&>span>span]:h-2 [&>span>span]:w-4 disabled:opacity-50'
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
                          position: [0, 1.5, 7],
                          fov: 45,
                          near: 0.1,
                          far: 1000,
                        }}
                        gl={{
                          antialias: true,
                          alpha: canvasBgColor === "transparent", // This remains correct
                          preserveDrawingBuffer: true,
                          outputColorSpace: THREE.SRGBColorSpace,
                          toneMapping: THREE.ACESFilmicToneMapping,
                        }}
                        style={{ background: canvasBgColor }} // This remains correct
                        onCreated={({
                          gl,
                          scene: canvasScene,
                          camera,
                          controls,
                        }) => {
                          gl.toneMappingExposure = 1.0;
                          r3fSceneForExportRef.current = canvasScene;
                          r3fGLContextRef.current = gl;
                          if (
                            controls &&
                            typeof controls.reset === "function"
                          ) {
                            orbitControlsRef.current = controls;
                          }
                        }}
                        key={canvasKey} // MODIFIED LINE
                      >
                        <Suspense
                          fallback={
                            <DreiLoader
                              containerStyles={{
                                background: "rgba(20,20,30,0.8)",
                              }}
                              dataStyles={{
                                color: "#f0f0f0",
                                fontSize: "14px",
                              }}
                              barStyles={{
                                height: "6px",
                                backgroundColor: "#a78bfa",
                              }}
                            />
                          }
                        >
                          <SceneContentInternal
                            // ... all other props remain the same
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
                            playAllAnimations={playAllAnimations}
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
