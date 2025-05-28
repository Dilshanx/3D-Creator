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

// --- Constants ---
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
};

let helvetikerFontForExport = null;
const DEFAULT_FONT_PATH = "/fonts/helvetiker_regular.typeface.json";

if (typeof window !== "undefined") {
  const clientPreloaderFontLoader = new FontLoader();
  clientPreloaderFontLoader.load(
    DEFAULT_FONT_PATH,
    (font) => {
      helvetikerFontForExport = font;
      console.log("Default font for GLB export pre-loaded on client.");
    },
    undefined,
    (err) => {
      console.error(
        "Failed to pre-load default font for GLB export on client:",
        err
      );
    }
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
            {" "}
            <TextureLoaderInternal
              key={JSON.stringify(validUrls)}
              urls={validUrls}
              onLoaded={handleTexturesLoaded}
            />{" "}
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
      useFrame((state, delta) => {
        if (internalMeshRef.current && isAnimating) {
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
            internalMeshRef.current.position.y = animationState.current.floatY;
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

      const dracoPath = "/draco/gltf/";
      const animationState = useRef({ startTime: Date.now() });

      const processLoadedObject = useCallback(
        (object, animations) => {
          console.log(
            "[ImportedModel processLoadedObject] Starting for:",
            object?.name,
            "Type:",
            fileType,
            "Settings Material:",
            settings.materialType
          );
          const targetObject = object || internalGroupRef.current;
          if (!targetObject) {
            console.warn(
              "[ImportedModel processLoadedObject] targetObject is null, cannot process."
            );
            onModelLoad(null, animations || []);
            return;
          }

          // --- Centering and Scaling ---
          let box = new THREE.Box3().setFromObject(targetObject);
          if (box.isEmpty()) {
            targetObject.traverse((child) => {
              if (child.isMesh) {
                const childBox = new THREE.Box3().setFromObject(child);
                if (!childBox.isEmpty()) {
                  if (box.isEmpty()) box.copy(childBox);
                  else box.expandByObject(child); // expand box if multiple meshes
                }
              }
            });
            if (box.isEmpty()) {
              console.warn(
                "[ImportedModel processLoadedObject] Bounding box completely empty even after traverse. Defaulting scale/pos."
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
            const scaleFactor = maxDim > 0 ? 3 / maxDim : 1; // Target size 3 units
            targetObject.scale.setScalar(saneNumber(scaleFactor, 1));

            const scaledBox = new THREE.Box3().setFromObject(targetObject); // Recompute box after scaling
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
          // --- End Centering and Scaling ---

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

          console.log(
            `[ImportedModel processLoadedObject] FileType: ${fileType}, MTL: ${!!mtlUrl}, AnyCustomTexMap: ${!!anyCustomTexMap}, UserSelectedSpecificMatType: ${userSelectedSpecificMaterialType}, ApplyOurMat: ${applyOurMaterial}`
          );

          if (applyOurMaterial) {
            console.log(
              `[ImportedModel] Applying/Overriding materials for ${fileType} with settings:`,
              settings.materialType,
              settings.shapeColor
            );

            let materialTypeForLogic = settings.materialType;
            if (settings.materialType === "auto") {
              materialTypeForLogic = "ceramic";
            }

            const {
              constructor: MatCtor,
              args: baseMatArgs,
              textureUrls: texUrlsFromSettings,
            } = createR3FMaterialProps(
              settings.shapeColor,
              materialTypeForLogic,
              customMaterialProps, // Pass the whole customMaterialProperties
              r3fScene.environment
            );
            const textureLoader = new THREE.TextureLoader();
            const loadedTexturesCache = {};
            const meshesToProcess = [];

            if (targetObject.isMesh) {
              meshesToProcess.push(targetObject);
            } else {
              targetObject.traverse((child) => {
                if (child.isMesh) meshesToProcess.push(child);
              });
            }

            if (meshesToProcess.length === 0) {
              console.warn(
                "[ImportedModel processLoadedObject] No meshes found in target object to apply material:",
                targetObject
              );
            }

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
                const url = texUrlsFromSettings[`${mapName}Url`]; // Corrected: use texUrlsFromSettings
                if (url) {
                  try {
                    let tex = loadedTexturesCache[url];
                    if (!tex) {
                      tex = loadedTexturesCache[url] =
                        await textureLoader.loadAsync(url);
                    }
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

              if (
                mesh.material &&
                typeof mesh.material.dispose === "function"
              ) {
                if (mesh.material !== newMaterial) {
                  // Avoid disposing the same material if somehow re-assigned
                  mesh.material.dispose();
                }
              }
              mesh.material = newMaterial;
              newMaterial.needsUpdate = true;
            });
          } else {
            console.log(
              `[ImportedModel] Using original materials for ${fileType}, applying envMap and side.`
            );
            targetObject.traverse((child) => {
              if (child.isMesh && child.material) {
                const materials = Array.isArray(child.material)
                  ? child.material
                  : [child.material];
                materials.forEach((mat) => {
                  mat.side = THREE.DoubleSide;
                  if (!mat.envMap && r3fScene.environment)
                    mat.envMap = r3fScene.environment;
                  const envIS = customMaterialProps.envMapIntensity; // Use customMaterialProps here
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
          settings.customMaterialProperties, // Now this is a direct dependency
          onModelLoad,
          fileType,
          mtlUrl,
        ]
      );

      // --- Manual Loader useEffects (GLTF, FBX, OBJ, STL - unchanged) ---
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
                sonnerToast.warn("MTL Load Failed");
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

      // Effect to call processLoadedObject when model or relevant settings change
      useEffect(() => {
        let objectForProcessing = null;
        let animationsForProcessing = [];
        if ((fileType === "glb" || fileType === "gltf") && manualGltfScene) {
          objectForProcessing = manualGltfScene;
          animationsForProcessing = manualGltfAnimations;
        } else if (fileType === "fbx" && manualFbxScene) {
          objectForProcessing = manualFbxScene;
          animationsForProcessing = manualFbxAnimations;
        } else if (fileType === "obj" && manualObjScene) {
          objectForProcessing = manualObjScene;
          animationsForProcessing = [];
        } else if (
          fileType === "stl" &&
          manualStlGeometry &&
          internalGroupRef.current
        ) {
          objectForProcessing = internalGroupRef.current;
          animationsForProcessing = [];
        }

        if (objectForProcessing) {
          processLoadedObject(objectForProcessing, animationsForProcessing);
        }
      }, [
        manualGltfScene,
        manualFbxScene,
        manualObjScene,
        manualStlGeometry,
        processLoadedObject,
        fileType,
        manualGltfAnimations,
        manualFbxAnimations,
      ]); // processLoadedObject will change if settings it depends on change

      // --- Animation useFrame and useEffect for mixer setup (unchanged) ---
      useFrame((_, delta) => {
        if (mixerRef.current && animationPlaybackState === "playing") {
          mixerRef.current.update(delta * animationPlaybackSpeed);
        } else if (
          internalGroupRef.current &&
          isAnimating &&
          !mixerRef.current
        ) {
          const preset = animationPresets[animationPresetKey];
          if (preset) {
            const time =
              (Date.now() - animationState.current.startTime) *
              0.001 *
              settings.animationSpeed;
            internalGroupRef.current.position.y =
              Math.sin(time * (preset.floatSpeed || 0) * 100) *
              (preset.floatAmplitude || 0);
          }
        }
      });
      useEffect(() => {
        const modelRoot = internalGroupRef.current;
        let clips = [];
        if (fileType === "glb" || fileType === "gltf")
          clips = manualGltfAnimations || [];
        else if (fileType === "fbx") clips = manualFbxAnimations || [];
        if (mixerRef.current) mixerRef.current.stopAllAction();
        if (activeActionRef.current) activeActionRef.current.stop();
        if (modelRoot && clips.length > 0) {
          mixerRef.current = new THREE.AnimationMixer(modelRoot);
          if (
            selectedAnimationClipIndex >= 0 &&
            selectedAnimationClipIndex < clips.length
          ) {
            const clip = clips[selectedAnimationClipIndex];
            activeActionRef.current = mixerRef.current.clipAction(clip);
            activeActionRef.current.setLoop(
              isAnimationLooping ? THREE.LoopRepeat : THREE.LoopOnce,
              Infinity
            );
            activeActionRef.current.timeScale = animationPlaybackSpeed;
            activeActionRef.current.time =
              clip.duration > 0 ? animationTime * clip.duration : 0;
            if (animationPlaybackState === "playing")
              activeActionRef.current.play();
            else if (animationPlaybackState === "paused") {
              activeActionRef.current.play();
              activeActionRef.current.paused = true;
              if (mixerRef.current) mixerRef.current.update(0);
            } else activeActionRef.current.stop();
          } else {
            activeActionRef.current = null;
          }
        } else {
          mixerRef.current = null;
          activeActionRef.current = null;
        }
        return () => {
          if (mixerRef.current) mixerRef.current.stopAllAction();
        };
      }, [
        fileType,
        manualGltfScene,
        manualFbxScene,
        manualGltfAnimations,
        manualFbxAnimations,
        selectedAnimationClipIndex,
        animationPlaybackState,
        isAnimationLooping,
        animationPlaybackSpeed,
        animationTime,
        mixerRef,
        activeActionRef,
      ]);

      // --- Render Logic ---
      if (fileType === "stl") {
        if (manualStlGeometry) {
          // Placeholder material here; processLoadedObject will apply the correct one.
          return (
            <group ref={internalGroupRef}>
              <mesh geometry={manualStlGeometry} castShadow receiveShadow>
                <meshStandardMaterial color='#CCCCCC' attach='material' />
              </mesh>
            </group>
          );
        }
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

      if (objectToRender)
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
              Loading ({fileType})...
            </Text>
          </Center>
        </group>
      );
    }
  )
);
ImportedModel.displayName = "ImportedModel";

// --- TextOverlay component (unchanged) ---
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
          side: THREE.FrontSide,
        }),
      [color, materialProps, scene.environment]
    );
    if (!isVisible || !text || !fontUrl) return null;
    return (
      <group position={[0, textYOffset, 0]}>
        {" "}
        <Center>
          {" "}
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
            {" "}
            {text}{" "}
          </Text3D>{" "}
        </Center>{" "}
      </group>
    );
  }
);
TextOverlay.displayName = "TextOverlay";

// --- SceneContentInternal component (unchanged) ---
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
  }) => {
    const { scene, gl, controls } = useThree();
    useEffect(() => {
      if (onSceneRefForExport) onSceneRefForExport(scene, gl, controls);
    }, [scene, gl, controls, onSceneRefForExport]);
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
        } else scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);
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
            } else
              setTextYOffset(
                1.5 + saneNumber(settings.textSize, 0.5) * 0.5 + 0.3
              );
          } else
            setTextYOffset(
              1.5 + saneNumber(settings.textSize, 0.5) * 0.5 + 0.3
            );
        });
      } else
        setTextYOffset(1.5 + saneNumber(settings.textSize, 0.5) * 0.5 + 0.3);
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
        {" "}
        <ambientLight
          intensity={
            settings.ambientLight.enabled
              ? saneNumber(settings.ambientLight.intensity, 0.25)
              : 0
          }
          color={settings.ambientLight.color}
        />{" "}
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
        />{" "}
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
          rotateSpeed={0.7}
          zoomSpeed={0.8}
          panSpeed={0.7}
          screenSpacePanning={false}
          minDistance={1}
          maxDistance={30}
          maxPolarAngle={Math.PI / 1.65}
          minPolarAngle={Math.PI / 4}
          target={[0, 0.3, 0]}
        />{" "}
        {(settings.n8ao?.enabled || settings.bloom?.enabled) && (
          <EffectComposer enableNormalPass>
            {" "}
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
            )}{" "}
          </EffectComposer>
        )}{" "}
      </>
    );
  }
);
SceneContentInternal.displayName = "SceneContentInternal";

// --- ModelViewer3D (Main Component - largely unchanged from previous full code, JSX for settings panel sliders for N8AO/Bloom can be added if desired) ---
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
  const orbitControlsRef = useRef(null);

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
      customBgImageUrl,
      current3DText,
      isTextVisible,
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
      console.log("History:", actionName, historyPointerRef.current);
    },
    [captureAppState]
  );
  const handleUndo = useCallback(() => {
    if (historyPointerRef.current > 0) {
      historyPointerRef.current--;
      applyState(historyStackRef.current[historyPointerRef.current]);
      sonnerToast.info("Undo");
    } else sonnerToast.warning("Nothing more to undo.");
  }, [applyState]);
  const handleRedo = useCallback(() => {
    if (historyPointerRef.current < historyStackRef.current.length - 1) {
      historyPointerRef.current++;
      applyState(historyStackRef.current[historyPointerRef.current]);
      sonnerToast.info("Redo");
    } else sonnerToast.warning("Nothing more to redo.");
  }, [applyState]);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    if (isMounted) {
      const t = setTimeout(() => pushHistory("initial load"), 200);
      return () => clearTimeout(t);
    }
  }, [isMounted, pushHistory]);
  const debouncedPushHistoryRef = useRef(null);
  useEffect(() => {
    if (!isMounted) return;
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
  }, [captureAppState, pushHistory, isMounted]);

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

  const handleMeshReadyForParent = useCallback((mesh) => {
    meshToExportOrScreenshotRef.current = mesh;
  }, []);
  const handleSceneRefForExportCallback = useCallback((scene, gl, controls) => {
    r3fSceneForExportRef.current = scene;
    r3fGLContextRef.current = gl;
    orbitControlsRef.current = controls;
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
      setAnimationPlaybackState("stopped");
      setAnimationTime(0);
    }
  }, []);

  const handleResetOrbitControlsView = useCallback(() => {
    if (orbitControlsRef.current?.reset) {
      orbitControlsRef.current.reset();
      sonnerToast.info("View Reset");
    } else sonnerToast.warning("OrbitControls not available.");
    pushHistory("reset view");
  }, [pushHistory]);
  const handleToggleGlobalAnimation = useCallback(
    () =>
      setIsAnimating((p) => {
        sonnerToast.info(`Float Animation ${!p ? "Resumed" : "Paused"}`);
        return !p;
      }),
    []
  );
  const handleSettingsChange = (key, value, subKey = null) =>
    setSettings((s) => {
      const n = { ...s };
      if (subKey) n[key] = { ...s[key], [subKey]: value };
      else n[key] = value;
      return n;
    });
  const resetCustomMaterialProperties = () => {
    const cpk = settings.materialType;
    if (cpk && cpk !== "auto" && baseMaterialPresets[cpk]) {
      const pd = baseMaterialPresets[cpk];
      const rtu = {};
      [
        "mapUrl",
        "normalMapUrl",
        "roughnessMapUrl",
        "metalnessMapUrl",
        "aoMapUrl",
        "emissiveMapUrl",
      ].forEach((k) => (rtu[k] = null));
      setSettings((s) => ({
        ...s,
        customMaterialProperties: {
          roughness: pd.roughness ?? null,
          metalness: pd.metalness ?? null,
          ior: pd.ior ?? null,
          transmission: pd.transmission ?? null,
          thickness: pd.thickness ?? null,
          emissiveIntensity: pd.emissiveIntensity ?? null,
          envMapIntensity: pd.envMapIntensity ?? 1.0,
          ...rtu,
        },
      }));
      sonnerToast.info("Material Props Reset");
    }
  };
  const handleCategorySelect = useCallback(
    (id) => {
      setIsImportedModelDisplayed(false);
      setImportedModel(null);
      setCurrentCategory(id);
      setCurrentShape(SHAPES_BY_CATEGORY_DATA[id][0].id);
      pushHistory("category select");
    },
    [pushHistory]
  );
  const handleShapeSelect = useCallback(
    (id) => {
      setIsImportedModelDisplayed(false);
      setImportedModel(null);
      setCurrentShape(id);
      pushHistory("shape select");
    },
    [pushHistory]
  );
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
    pushHistory("randomize scene");
  }, [pushHistory]);

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
    let hasContent = false;
    if (meshToExportOrScreenshotRef.current) {
      const clone = meshToExportOrScreenshotRef.current.clone(true);
      sceneToExport.add(clone);
      hasContent = true;
    }
    if (isTextVisible && current3DText && settings.textFontUrl) {
      let font = helvetikerFontForExport;
      if (!font || settings.textFontUrl !== DEFAULT_FONT_PATH) {
        try {
          font = await new FontLoader().loadAsync(settings.textFontUrl);
          if (settings.textFontUrl === DEFAULT_FONT_PATH)
            helvetikerFontForExport = font;
        } catch (e) {
          sonnerToast.error("Font load failed for export");
          setIsExporting(false);
          return;
        }
      }
      if (font) {
        const geom = new TextGeometry(current3DText, {
          font,
          size: saneNumber(settings.textSize, 0.5),
          height: saneNumber(settings.textDepth, 0.05),
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: saneNumber(0.02 * (settings.textSize / 0.5), 0.01),
          bevelSize: saneNumber(0.01 * (settings.textSize / 0.5), 0.005),
        });
        geom.center();
        const { constructor: MC, args: ma } = createR3FMaterialProps(
          settings.textColor,
          "ceramic",
          {},
          r3fSceneForExportRef.current?.environment
        );
        const tm = new MC(ma);
        const tMesh = new THREE.Mesh(geom, tm);
        let yOff = 0;
        if (meshToExportOrScreenshotRef.current) {
          const box = new THREE.Box3().setFromObject(
            meshToExportOrScreenshotRef.current
          );
          if (!box.isEmpty()) {
            yOff =
              box.getCenter(new THREE.Vector3()).y +
              (box.max.y - box.min.y) / 2 +
              saneNumber(settings.textSize, 0.5) / 2 +
              0.3;
          } else yOff = saneNumber(settings.textSize, 0.5) / 2 + 0.3;
        } else yOff = saneNumber(settings.textSize, 0.5) / 2;
        tMesh.position.y = yOff;
        sceneToExport.add(tMesh);
        hasContent = true;
      } else {
        setIsExporting(false);
        return;
      }
    }
    if (!hasContent) {
      sonnerToast.warning("Nothing to export");
      return;
    }
    setIsExporting(true);
    setExportProgress(0);
    const toastId = sonnerToast.loading("Exporting GLB...");
    try {
      await new Promise((r) => setTimeout(r, 200));
      setExportProgress(50);
      const exporter = new GLTFExporter();
      exporter.parse(
        sceneToExport,
        (gltf) => {
          const blob = new Blob([gltf], { type: "application/octet-stream" });
          const l = document.createElement("a");
          l.href = URL.createObjectURL(blob);
          l.download = `shape-${
            isImportedModelDisplayed
              ? (currentImportedModelNameRef.current || "imported")
                  .replace(/[^a-z0-9]/gi, "_")
                  .toLowerCase()
              : currentShapeRef.current || "model"
          }${isTextVisible && current3DText ? "-with-text" : ""}.glb`;
          l.click();
          URL.revokeObjectURL(l.href);
          setExportProgress(100);
          sonnerToast.success("GLB Exported", { id: toastId });
          setIsExporting(false);
        },
        (err) => {
          console.error(err);
          sonnerToast.error("GLB Export Failed", { id: toastId });
          setIsExporting(false);
        },
        {
          binary: true,
          embedImages: true,
          animations:
            isImportedModelDisplayed &&
            importedModel &&
            animationClipsRef.current.length > 0
              ? animationClipsRef.current
              : [],
        }
      );
    } catch (e) {
      sonnerToast.error("Export Error", { id: toastId });
      setIsExporting(false);
    }
  }, [isExporting, isTextVisible, current3DText, settings, importedModel]);
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
      if (activeActionRef.current) activeActionRef.current = null;
      pushHistory(`import ${fileType}`);
    },
    [pushHistory]
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
        if (importedModel?.url?.startsWith("blob:"))
          URL.revokeObjectURL(importedModel.url);
        if (importedModel?.mtlUrl?.startsWith("blob:"))
          URL.revokeObjectURL(importedModel.mtlUrl);
        if (modelFileType === "glb" || modelFileType === "gltf") {
          try {
            const reader = new FileReader();
            modelUrlToUse = await new Promise((resolve, reject) => {
              reader.onload = (event) => resolve(event.target.result);
              reader.onerror = reject;
              reader.readAsDataURL(modelFile);
            });
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
            sonnerToast.error("File Processing Error", {
              id: importToastId,
              description: `Failed to convert ${modelFileType.toUpperCase()} to Data URL.`,
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
          description: `${modelFile.name} prepared.`,
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
      if (event.dataTransfer.files?.length > 0)
        handleFiles(Array.from(event.dataTransfer.files));
    },
    [handleFiles]
  );

  const handlePlayPauseAnimation = () => {
    if (
      !activeActionRef.current ||
      animationClipsRef.current.length === 0 ||
      selectedAnimationClipIndex < 0
    ) {
      sonnerToast.warning("No Animation Selected");
      return;
    }
    setAnimationPlaybackState((prev) =>
      prev === "playing" ? "paused" : "playing"
    );
    pushHistory("toggle anim play/pause");
  };
  const handleStopAnimation = () => {
    if (
      !activeActionRef.current ||
      animationClipsRef.current.length === 0 ||
      selectedAnimationClipIndex < 0
    ) {
      sonnerToast.warning("No Animation Selected");
      return;
    }
    setAnimationPlaybackState("stopped");
    setAnimationTime(0);
    pushHistory("stop anim");
  };
  const handleAnimationClipChange = (indexStr) => {
    const index = parseInt(indexStr, 10);
    if (index >= 0 && index < animationClipsRef.current.length) {
      setSelectedAnimationClipIndex(index);
      setAnimationDuration(animationClipsRef.current[index].duration);
      setAnimationTime(0);
      setAnimationPlaybackState("stopped");
      sonnerToast.info(
        `Animation: ${
          animationClipsRef.current[index].name || `Clip ${index + 1}`
        }`
      );
    } else {
      setSelectedAnimationClipIndex(-1);
      setAnimationDuration(0);
      setAnimationPlaybackState("stopped");
    }
    pushHistory("change anim clip");
  };
  const handleAnimationTimeChange = (value) => {
    setAnimationTime(value[0]);
  };
  const handleAnimationLoopToggle = (checked) => {
    setIsAnimationLooping(checked);
    pushHistory("toggle anim loop");
  };
  const handleAnimationSpeedChange = (value) => {
    setAnimationPlaybackSpeed(value[0]);
    pushHistory("change anim speed");
  };

  const handleCustomBgImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomBgImageUrl(e.target.result);
        setSettings((s) => ({ ...s, background: "customImage" }));
        sonnerToast.success("Custom background set.");
        pushHistory("set custom bg");
      };
      reader.onerror = () => sonnerToast.error("File Read Error");
      reader.readAsDataURL(file);
    }
    if (event.target) event.target.value = null;
  };
  const handleClearCustomBgImage = () => {
    setCustomBgImageUrl(null);
    if (settings.background === "customImage")
      handleSettingsChange("background", "studioDark");
    sonnerToast.info("Custom background cleared.");
    pushHistory("clear custom bg");
  };
  const handleTextureUpload = (mapType, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSettings((s) => ({
          ...s,
          customMaterialProperties: {
            ...s.customMaterialProperties,
            [`${mapType}Url`]: e.target.result,
          },
        }));
        sonnerToast.success(`${mapType.replace("Map", "")} texture set.`);
        pushHistory(`set ${mapType}`);
      };
      reader.onerror = () => sonnerToast.error("File Read Error");
      reader.readAsDataURL(file);
    }
    if (event.target) event.target.value = null;
  };
  const handleClearTexture = (mapType) => {
    setSettings((s) => ({
      ...s,
      customMaterialProperties: {
        ...s.customMaterialProperties,
        [`${mapType}Url`]: null,
      },
    }));
    sonnerToast.info(`${mapType.replace("Map", "")} texture cleared.`);
    pushHistory(`clear ${mapType}`);
  };
  const handleSet3DText = () => {
    const trimmed = textInput.trim();
    setCurrent3DText(trimmed);
    setIsTextVisible(trimmed !== "");
    sonnerToast.info(
      trimmed !== "" ? `3D Text Updated: "${trimmed}"` : "3D Text Cleared"
    );
    pushHistory("set 3d text");
  };

  const { active: isLoadingModel, progress: modelLoadProgress } = useProgress();

  if (!isMounted) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-4'>
        {" "}
        <Loader2 className='h-12 w-12 animate-spin text-purple-400 mb-4' />{" "}
        <p className='text-lg font-medium'>Initializing 3D Studio...</p>{" "}
      </div>
    );
  }
  let canvasBgColor = "transparent";
  if (settings.background !== "customImage" || !customBgImageUrl) {
    if (settings.background === "darkSpace") canvasBgColor = "#0a0a10";
    else if (settings.background === "studioDark") canvasBgColor = "#18181b";
    else if (settings.background === "softLight") canvasBgColor = "#e0e8f0";
    else if (settings.background === "studioLight") canvasBgColor = "#f4f4f5";
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
                    {" "}
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
                              {" "}
                              <span className='text-2xl sm:text-3xl'>
                                {category.icon}
                              </span>{" "}
                              <span>{category.name}</span>{" "}
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
                                  {" "}
                                  <span className='text-xl'>
                                    {shape.icon}
                                  </span>{" "}
                                  {shape.name}{" "}
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
                          if (importedModel?.url?.startsWith("blob:"))
                            URL.revokeObjectURL(importedModel.url);
                          if (importedModel?.mtlUrl?.startsWith("blob:"))
                            URL.revokeObjectURL(importedModel.mtlUrl);
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
                          if (mixerRef.current) {
                            mixerRef.current.stopAllAction();
                            mixerRef.current = null;
                          }
                          if (activeActionRef.current)
                            activeActionRef.current = null;
                          sonnerToast.info("Imported Model Cleared");
                          pushHistory("clear imported model");
                        }}
                      >
                        {" "}
                        <XCircle size={16} className='mr-2' /> Clear Imported{" "}
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
                        onCheckedChange={setIsTextVisible}
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
                    {" "}
                    <Button
                      onClick={handleToggleGlobalAnimation}
                      variant={isAnimating ? "destructive" : "default"}
                      className='w-full bg-green-600 hover:bg-green-700 data-[state=destructive]:bg-red-600 data-[state=destructive]:hover:bg-red-700'
                      data-state={isAnimating ? "destructive" : "default"}
                    >
                      {" "}
                      {isAnimating ? (
                        <Pause size={16} className='mr-2' />
                      ) : (
                        <Play size={16} className='mr-2' />
                      )}{" "}
                      {isAnimating ? "Pause Float" : "Play Float"}{" "}
                    </Button>{" "}
                    <Select
                      value={animationPreset}
                      onValueChange={setAnimationPreset}
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
                    </Select>{" "}
                    <div className='grid grid-cols-2 gap-3'>
                      {" "}
                      <Button
                        variant='outline'
                        onClick={handleResetOrbitControlsView}
                        className='border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
                      >
                        <RotateCcw size={14} className='mr-2' />
                        Reset View
                      </Button>{" "}
                      <Button
                        variant='default'
                        onClick={handleRandomize}
                        className='bg-indigo-600 hover:bg-indigo-700'
                      >
                        <Shuffle size={14} className='mr-2' />
                        Randomize
                      </Button>{" "}
                    </div>{" "}
                    <div className='grid grid-cols-2 gap-3 pt-2'>
                      {" "}
                      <Button
                        variant='outline'
                        onClick={handleUndo}
                        disabled={!canUndo}
                        className='border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 disabled:opacity-50'
                      >
                        <Undo size={14} className='mr-2' />
                        Undo
                      </Button>{" "}
                      <Button
                        variant='outline'
                        onClick={handleRedo}
                        disabled={!canRedo}
                        className='border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 disabled:opacity-50'
                      >
                        <Redo size={14} className='mr-2' />
                        Redo
                      </Button>{" "}
                    </div>{" "}
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
                            <section className='space-y-4'>
                              <h3 className='text-sm text-slate-300 font-semibold uppercase tracking-wider border-b border-slate-700 pb-1 mb-3 flex items-center'>
                                <Palette
                                  size={16}
                                  className='mr-2 text-purple-400'
                                />
                                {(isImportedModelDisplayed &&
                                  (importedModel?.type === "stl" ||
                                    (importedModel?.type === "obj" &&
                                      !importedModel?.mtlUrl &&
                                      !Object.values(
                                        settings.customMaterialProperties
                                      ).some(
                                        (v) =>
                                          typeof v === "string" &&
                                          v.trim() !== "" &&
                                          v !==
                                            initialSettings
                                              .customMaterialProperties
                                              .envMapIntensity
                                      )))) ||
                                !isImportedModelDisplayed
                                  ? isImportedModelDisplayed
                                    ? `Material for ${importedModelName}`
                                    : "Procedural Shape Material"
                                  : `Override Material for ${importedModelName}`}
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
                                    handleSettingsChange("materialType", value);
                                    if (value !== settings.materialType) {
                                      resetCustomMaterialProperties();
                                    }
                                  }}
                                >
                                  {" "}
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
                              {(settings.materialType !== "auto" ||
                                (isImportedModelDisplayed &&
                                  Object.values(
                                    settings.customMaterialProperties
                                  ).some(
                                    (v) =>
                                      typeof v === "string" &&
                                      v.trim() !== "" &&
                                      v !==
                                        initialSettings.customMaterialProperties
                                          .envMapIntensity
                                  ))) && ( // Show fine-tune if not auto OR if any custom prop is set (excluding envMapIntensity for this condition)
                                <div className='p-3 border border-slate-600 rounded-md space-y-3 bg-slate-700/30'>
                                  <div className='flex justify-between items-center'>
                                    <h4 className='text-xs font-semibold text-purple-300'>
                                      Fine-tune '
                                      {proceduralMaterialTypeForPanel}'
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
                                  {proceduralMaterialTypeForPanel !== "glass" &&
                                    proceduralMaterialTypeForPanel !==
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
                                      "plastic" ||
                                    proceduralMaterialTypeForPanel ===
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
                                              settings.customMaterialProperties
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
                                              settings.customMaterialProperties
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
                                              settings.customMaterialProperties
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
                                  {baseMaterialPresets[
                                    proceduralMaterialTypeForPanel
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
                                              proceduralMaterialTypeForPanel
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
                                              proceduralMaterialTypeForPanel
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
                                            proceduralMaterialTypeForPanel
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
                                            proceduralMaterialTypeForPanel
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
                                  {" "}
                                  <Separator className='my-3 bg-slate-600' />{" "}
                                  <h3 className='text-sm text-slate-300 font-semibold uppercase tracking-wider border-b border-slate-700 pb-1 mb-3 flex items-center'>
                                    <LayersIcon
                                      size={16}
                                      className='mr-2 text-purple-400'
                                    />
                                    Procedural Shape Geometry
                                  </h3>{" "}
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
                                  </div>{" "}
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
                                      {" "}
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
                                    Font URL (JSON)
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
                                    placeholder='/fonts/font.json'
                                    className='w-full bg-slate-700 border-slate-600 text-slate-100 text-xs'
                                  />
                                  <p className='text-xs text-slate-400'>
                                    Place font in `public` folder.
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
                                Display
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
                                  Background / Env
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
                                      Upload BG (JPG,PNG,WEBP)
                                    </Label>
                                    <Input
                                      id='customBgImagePanelSheet'
                                      type='file'
                                      accept='image/jpeg,image/png,image/webp'
                                      onChange={handleCustomBgImageUpload}
                                      className='w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer bg-slate-700 border-slate-600 text-slate-100'
                                    />
                                    <Button
                                      variant='ghost'
                                      size='xs'
                                      onClick={handleClearCustomBgImage}
                                      className='text-red-400 hover:text-red-300 hover:bg-transparent mt-1 w-full justify-start px-1'
                                    >
                                      <Trash2 size={12} className='mr-1' />
                                      Clear Image
                                    </Button>
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
                                    N8AO
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
                                  <>{/* N8AO Full Controls Here */}</>
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
                                  <>{/* Bloom Full Controls Here */}</>
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
                                          onValueChange={
                                            handleAnimationTimeChange
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
                                          onValueChange={
                                            handleAnimationSpeedChange
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
                        onCreated={({ gl, scene: cs, controls: ctrl }) => {
                          gl.toneMappingExposure = 1.0;
                          if (r3fSceneForExportRef)
                            r3fSceneForExportRef.current = cs;
                          if (orbitControlsRef) orbitControlsRef.current = ctrl;
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
