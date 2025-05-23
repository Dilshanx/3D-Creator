// // src/components/Enhanced3DShapes/Enhanced3DShapes.js
// import React, { useRef, useEffect, useState, useCallback } from "react";
// import * as THREE from "three";

// import { Settings as SettingsIcon } from "lucide-react";

// // UI Components
// import ShapeSelector from "./ui/ShapeSelector";
// import AnimationControls from "./ui/AnimationControls";
// import ExportControls from "./ui/ExportControls";
// import ThreeDViewer from "./ui/ThreeDViewer";
// import SettingsPanel from "./ui/SettingsPanel";
// import Instructions from "./ui/Instructions";

// // Utils
// import { shapes as shapesDataArray } from "./utils/shapesData";
// import { createFull3DShape } from "./utils/shapeCreation";
// import {
//   exportToGLB,
//   exportToOBJ,
//   takeScreenshot as takeScreenshotUtil,
// } from "./utils/exportHelpers";

// const Enhanced3DShapes = () => {
//   const mountRef = useRef(null);
//   const sceneRef = useRef(null);
//   const rendererRef = useRef(null);
//   const cameraRef = useRef(null);
//   const frameRef = useRef(null);
//   const currentMeshRef = useRef(null);
//   const lightsRef = useRef({});
//   const skyboxRef = useRef(null); // For gradient background cleanup
//   const isAnimatingRef = useRef(true); // Ref for animation loop

//   const [currentShape, setCurrentShape] = useState("heart");
//   const [isAnimating, setIsAnimatingState] = useState(true); // State for UI
//   const [isExporting, setIsExporting] = useState(false);
//   const [exportProgress, setExportProgress] = useState(0);
//   const [showSettings, setShowSettings] = useState(false);
//   const [settings, setSettings] = useState({
//     materialType: "auto",
//     animationSpeed: 1,
//     lightIntensity: 1,
//     extrudeDepth: 0.3,
//     quality: "high",
//     shapeColor: "#ff6b9d",
//   });

//   // Sync isAnimating state with ref for the animation loop
//   useEffect(() => {
//     isAnimatingRef.current = isAnimating;
//   }, [isAnimating]);

//   const handleToggleAnimation = () => {
//     setIsAnimatingState((prev) => !prev);
//   };

//   const handleExportGLB = useCallback(async () => {
//     setIsExporting(true);
//     const glbBuffer = await exportToGLB(
//       currentMeshRef.current,
//       currentShape,
//       setExportProgress
//     );
//     if (glbBuffer) {
//       const blob = new Blob([glbBuffer], { type: "model/gltf-binary" });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `${currentShape}_3d_model.glb`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
//     }
//     setTimeout(() => {
//       setIsExporting(false);
//       setExportProgress(0);
//     }, 500);
//   }, [currentShape]);

//   const handleExportOBJ = useCallback(() => {
//     const objContent = exportToOBJ(currentMeshRef.current, currentShape);
//     if (objContent) {
//       const blob = new Blob([objContent], { type: "text/plain" });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `${currentShape}_3d_model.obj`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
//     }
//   }, [currentShape]);

//   const handleTakeScreenshot = useCallback(() => {
//     const screenshotData = takeScreenshotUtil(
//       rendererRef.current,
//       currentShape
//     );
//     if (screenshotData) {
//       const link = document.createElement("a");
//       link.download = screenshotData.filename;
//       link.href = screenshotData.dataURL;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   }, [currentShape]);

//   // Main Three.js setup effect
//   useEffect(() => {
//     if (!mountRef.current) return;

//     const currentMount = mountRef.current;
//     const scene = new THREE.Scene();

//     // --- MODERN GRADIENT BACKGROUND ---
//     const gradientGeometry = new THREE.SphereGeometry(50, 32, 32);
//     const gradientMaterial = new THREE.ShaderMaterial({
//       uniforms: {
//         topColor: { value: new THREE.Color(0x3a7ca5) }, // Soft sky blue
//         bottomColor: { value: new THREE.Color(0x1e3b49) }, // Deeper, desaturated blue/teal
//         offset: { value: 33 }, // Adjust for horizon position
//         exponent: { value: 0.7 }, // Controls gradient steepness
//       },
//       vertexShader: `
//         varying vec3 vWorldPosition;
//         void main() {
//           vec4 worldPosition = modelMatrix * vec4(position, 1.0);
//           vWorldPosition = worldPosition.xyz;
//           gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//         }
//       `,
//       fragmentShader: `
//         uniform vec3 topColor;
//         uniform vec3 bottomColor;
//         uniform float offset;
//         uniform float exponent;
//         varying vec3 vWorldPosition;
//         void main() {
//           float h = normalize(vWorldPosition + offset).y;
//           gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
//         }
//       `,
//       side: THREE.BackSide,
//     });

//     const skybox = new THREE.Mesh(gradientGeometry, gradientMaterial);
//     scene.add(skybox);
//     skyboxRef.current = skybox; // Store ref for cleanup

//     // Fog to complement the gradient
//     scene.fog = new THREE.Fog(0x2c5d72, 8, 30); // A mid-tone from the gradient
//     // --- END MODERN GRADIENT BACKGROUND ---

//     sceneRef.current = scene;

//     const camera = new THREE.PerspectiveCamera(
//       60,
//       currentMount.clientWidth / currentMount.clientHeight,
//       0.1,
//       1000
//     );
//     camera.position.set(0, 0, 4);
//     cameraRef.current = camera;

//     const renderer = new THREE.WebGLRenderer({
//       antialias: true,
//       preserveDrawingBuffer: true,
//       alpha: true, // Kept true in case you want to overlay on CSS later
//     });
//     renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.shadowMap.enabled = true;
//     renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//     renderer.toneMapping = THREE.ACESFilmicToneMapping;
//     renderer.toneMappingExposure = 1.0; // Adjust if needed for new background
//     rendererRef.current = renderer;
//     currentMount.appendChild(renderer.domElement);

//     // Lights
//     const ambientLight = new THREE.AmbientLight(
//       0xffffff, // White ambient light
//       0.5 * settings.lightIntensity // Slightly increased base intensity for potentially darker bg
//     );
//     scene.add(ambientLight);
//     const directionalLight = new THREE.DirectionalLight(
//       0xffffff, // White directional light
//       0.9 * settings.lightIntensity // Slightly increased base intensity
//     );
//     directionalLight.position.set(5, 8, 5);
//     directionalLight.castShadow = true;
//     directionalLight.shadow.mapSize.width = 2048;
//     directionalLight.shadow.mapSize.height = 2048;
//     directionalLight.shadow.camera.near = 0.5;
//     directionalLight.shadow.camera.far = 50;
//     directionalLight.shadow.bias = -0.0005;
//     scene.add(directionalLight);

//     const rimLight = new THREE.DirectionalLight(
//       0xa0c0ff, // Cool blueish rim light for contrast
//       0.4 * settings.lightIntensity // Slightly increased base intensity
//     );
//     rimLight.position.set(-6, 3, -7); // Adjusted position for better rim effect
//     scene.add(rimLight);

//     lightsRef.current = {
//       ambient: ambientLight,
//       directional: directionalLight,
//       rim: rimLight,
//     };

//     // Animation loop
//     const animate = () => {
//       frameRef.current = requestAnimationFrame(animate);
//       if (rendererRef.current && sceneRef.current && cameraRef.current) {
//         if (isAnimatingRef.current && currentMeshRef.current) {
//           currentMeshRef.current.rotation.x += 0.003 * settings.animationSpeed;
//           currentMeshRef.current.rotation.y += 0.007 * settings.animationSpeed;
//           const time = Date.now() * 0.0005 * settings.animationSpeed;
//           currentMeshRef.current.position.y = Math.sin(time) * 0.05;
//         }
//         rendererRef.current.render(sceneRef.current, cameraRef.current);
//       }
//     };
//     animate();

//     const handleResize = () => {
//       if (currentMount && cameraRef.current && rendererRef.current) {
//         cameraRef.current.aspect =
//           currentMount.clientWidth / currentMount.clientHeight;
//         cameraRef.current.updateProjectionMatrix();
//         rendererRef.current.setSize(
//           currentMount.clientWidth,
//           currentMount.clientHeight
//         );
//       }
//     };
//     window.addEventListener("resize", handleResize);

//     // Cleanup
//     return () => {
//       if (frameRef.current) cancelAnimationFrame(frameRef.current);
//       window.removeEventListener("resize", handleResize);

//       if (rendererRef.current) {
//         if (currentMount && rendererRef.current.domElement) {
//           currentMount.removeChild(rendererRef.current.domElement);
//         }
//         rendererRef.current.dispose();
//       }

//       if (sceneRef.current) {
//         // Specific cleanup for skybox
//         if (skyboxRef.current) {
//           if (skyboxRef.current.geometry) skyboxRef.current.geometry.dispose();
//           if (skyboxRef.current.material) skyboxRef.current.material.dispose();
//           sceneRef.current.remove(skyboxRef.current); // Remove from scene
//         }
//         // General scene traversal for other objects
//         sceneRef.current.traverse((object) => {
//           if (object !== skyboxRef.current) {
//             // Avoid double-disposing skybox parts
//             if (object.geometry) object.geometry.dispose();
//             if (object.material) {
//               if (Array.isArray(object.material)) {
//                 object.material.forEach((material) => material.dispose());
//               } else {
//                 object.material.dispose();
//               }
//             }
//           }
//         });
//       }

//       sceneRef.current = null;
//       rendererRef.current = null;
//       cameraRef.current = null;
//       currentMeshRef.current = null;
//       skyboxRef.current = null;
//       lightsRef.current = {};
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Effect for updating shape/material
//   useEffect(() => {
//     if (sceneRef.current) {
//       if (currentMeshRef.current) {
//         sceneRef.current.remove(currentMeshRef.current);
//         currentMeshRef.current.geometry.dispose();
//         if (Array.isArray(currentMeshRef.current.material)) {
//           currentMeshRef.current.material.forEach((m) => m.dispose());
//         } else {
//           currentMeshRef.current.material.dispose();
//         }
//       }
//       const newMesh = createFull3DShape(currentShape, settings, 1.5);
//       newMesh.castShadow = true;
//       newMesh.receiveShadow = true;
//       sceneRef.current.add(newMesh);
//       currentMeshRef.current = newMesh;
//     }
//   }, [currentShape, settings]);

//   // Effect for updating light intensity
//   useEffect(() => {
//     if (lightsRef.current.ambient && settings.lightIntensity !== undefined) {
//       lightsRef.current.ambient.intensity = 0.5 * settings.lightIntensity;
//       lightsRef.current.directional.intensity = 0.9 * settings.lightIntensity;
//       lightsRef.current.rim.intensity = 0.4 * settings.lightIntensity;
//     }
//   }, [settings.lightIntensity]);

//   const resetAnimation = () => {
//     if (currentMeshRef.current) {
//       currentMeshRef.current.rotation.set(0, 0, 0);
//       currentMeshRef.current.position.set(0, 0, 0);
//     }
//   };

//   return (
//     <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-3 sm:p-4 md:p-6 text-white select-none'>
//       <div className='max-w-7xl mx-auto'>
//         <header className='text-center mb-6 sm:mb-8'>
//           <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent'>
//             3D Shapes Studio Pro
//           </h1>
//           <p className='text-slate-300 text-sm sm:text-lg max-w-3xl mx-auto'>
//             Craft, customize, animate, and export intricate 3D shapes with
//             advanced controls.
//           </p>
//         </header>

//         <div className='grid lg:grid-cols-4 gap-4 sm:gap-6'>
//           <div className='lg:col-span-1 space-y-4 sm:space-y-6'>
//             <ShapeSelector
//               shapes={shapesDataArray}
//               currentShape={currentShape}
//               onShapeSelect={setCurrentShape}
//             />
//             <AnimationControls
//               isAnimating={isAnimating}
//               onToggleAnimation={handleToggleAnimation}
//               onResetAnimation={resetAnimation}
//             />
//             <ExportControls
//               onExportGLB={handleExportGLB}
//               onExportOBJ={handleExportOBJ}
//               onTakeScreenshot={handleTakeScreenshot}
//               isExporting={isExporting}
//               exportProgress={exportProgress}
//             />
//             <button
//               onClick={() => setShowSettings(true)}
//               className='w-full flex items-center justify-center gap-2 p-3 bg-slate-700 hover:bg-slate-600/80 text-white rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105'
//             >
//               <SettingsIcon size={20} />
//               <span className='font-medium'>Advanced Settings</span>
//             </button>
//           </div>
//           <ThreeDViewer
//             mountRef={mountRef}
//             isExporting={isExporting}
//             exportProgress={exportProgress}
//           />
//         </div>

//         <SettingsPanel
//           settings={settings}
//           onSettingsChange={setSettings}
//           show={showSettings}
//           onClose={() => setShowSettings(false)}
//         />
//         <Instructions />

//         <footer className='text-center mt-10 sm:mt-12 text-slate-400 text-xs sm:text-sm'>
//           <p>
//             © {new Date().getFullYear()} 3D Shapes Studio Pro. All rights
//             reserved.
//           </p>
//           <p>Powered by React & Three.js</p>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default Enhanced3DShapes;

import React, { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

import {
  Settings as SettingsIcon,
  Play,
  Pause,
  RotateCcw,
  Download,
  Camera,
  Shuffle,
  Loader2,
  Palette,
  Zap,
  Box,
  Sparkles,
  Heart,
  Star,
  Diamond,
  Flower2,
  Crown,
  Infinity,
  Spiral,
} from "lucide-react";

// shadcn/ui components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Original UI Components
import ShapeSelector from "./ui/ShapeSelector";
import AnimationControlsUI from "./ui/AnimationControls";
import ExportControls from "./ui/ExportControls";
import ThreeDViewer from "./ui/ThreeDViewer";
import SettingsPanel from "./ui/SettingsPanel";
import Instructions from "./ui/Instructions";

// Utils
import { shapes as shapesDataArray } from "./utils/shapesData";
import { createFull3DShape } from "./utils/shapeCreation";
import {
  exportToGLB,
  exportToOBJ,
  takeScreenshot as takeScreenshotUtil,
} from "./utils/exportHelpers";

// Enhanced Animation Presets with better descriptions and icons
const animationPresets = {
  gentle: {
    name: "Gentle Flow",
    description: "Smooth, relaxing movement",
    rotationSpeed: [0.002, 0.004, 0.001],
    floatAmplitude: 0.03,
    floatSpeed: 0.0003,
    icon: <Sparkles className='w-4 h-4' />,
  },
  energetic: {
    name: "Energetic Pulse",
    description: "Dynamic, lively animation",
    rotationSpeed: [0.008, 0.012, 0.004],
    floatAmplitude: 0.08,
    floatSpeed: 0.001,
    icon: <Zap className='w-4 h-4' />,
  },
  dramatic: {
    name: "Dramatic Sweep",
    description: "Bold, cinematic motion",
    rotationSpeed: [0.01, 0.005, 0.015],
    floatAmplitude: 0.12,
    floatSpeed: 0.0008,
    icon: <Box className='w-4 h-4' />,
  },
  bounce: {
    name: "Bounce Effect",
    description: "Playful bouncing motion",
    rotationSpeed: [0.003, 0.006, 0.002],
    floatAmplitude: 0.15,
    floatSpeed: 0.002,
    icon: <Play className='w-4 h-4' />,
  },
  spin: {
    name: "Rapid Spin",
    description: "Fast spinning rotation",
    rotationSpeed: [0.02, 0.02, 0.02],
    floatAmplitude: 0.02,
    floatSpeed: 0.0005,
    icon: <RotateCcw className='w-4 h-4' />,
  },
};

// Enhanced Shape Selector Component using shadcn
const EnhancedShapeSelector = ({ shapes, currentShape, onShapeSelect }) => {
  const getShapeIcon = (shapeId) => {
    const iconMap = {
      heart: <Heart className='w-5 h-5' />,
      star: <Star className='w-5 h-5' />,
      diamond: <Diamond className='w-5 h-5' />,
      flower: <Flower2 className='w-5 h-5' />,
      crown: <Crown className='w-5 h-5' />,
      infinity: <Infinity className='w-5 h-5' />,
      spiral: <Spiral className='w-5 h-5' />,
    };
    return iconMap[shapeId] || <Box className='w-5 h-5' />;
  };

  return (
    <Card className='bg-slate-800/50 border-slate-700 backdrop-blur-sm'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-lg font-semibold text-white flex items-center gap-2'>
          <Palette className='w-5 h-5 text-purple-400' />
          Shape Gallery
        </CardTitle>
        <CardDescription className='text-slate-400'>
          Choose your 3D masterpiece
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-2'>
        {shapes.map((shape) => (
          <Button
            key={shape.id}
            variant={currentShape === shape.id ? "default" : "ghost"}
            className={`w-full justify-start gap-3 h-12 ${
              currentShape === shape.id
                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                : "hover:bg-slate-700/50 text-slate-300"
            }`}
            onClick={() => onShapeSelect(shape.id)}
          >
            {getShapeIcon(shape.id)}
            <div className='text-left'>
              <div className='font-medium'>{shape.name}</div>
              {shape.category && (
                <div className='text-xs opacity-70'>{shape.category}</div>
              )}
            </div>
            {currentShape === shape.id && (
              <Badge variant='secondary' className='ml-auto bg-white/20'>
                Active
              </Badge>
            )}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

// Enhanced Animation Controls using shadcn
const EnhancedAnimationControls = ({
  isAnimating,
  onToggleAnimation,
  onResetAnimation,
  animationPreset,
  onAnimationPresetChange,
}) => {
  return (
    <Card className='bg-slate-800/50 border-slate-700 backdrop-blur-sm'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-lg font-semibold text-white flex items-center gap-2'>
          <Play className='w-5 h-5 text-purple-400' />
          Animation Studio
        </CardTitle>
        <CardDescription className='text-slate-400'>
          Control motion and dynamics
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex gap-2'>
          <Button
            onClick={onToggleAnimation}
            variant={isAnimating ? "destructive" : "default"}
            className='flex-1'
            size='sm'
          >
            {isAnimating ? (
              <>
                <Pause className='w-4 h-4 mr-2' />
                Pause
              </>
            ) : (
              <>
                <Play className='w-4 h-4 mr-2' />
                Play
              </>
            )}
          </Button>
          <Button
            onClick={onResetAnimation}
            variant='outline'
            size='sm'
            className='border-slate-600 text-slate-300 hover:bg-slate-700'
          >
            <RotateCcw className='w-4 h-4' />
          </Button>
        </div>

        <div className='space-y-2'>
          <Label className='text-sm font-medium text-slate-300'>
            Animation Style
          </Label>
          <Select
            value={animationPreset}
            onValueChange={onAnimationPresetChange}
          >
            <SelectTrigger className='bg-slate-700 border-slate-600 text-white'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className='bg-slate-800 border-slate-700'>
              {Object.entries(animationPresets).map(([key, preset]) => (
                <SelectItem
                  key={key}
                  value={key}
                  className='text-white hover:bg-slate-700'
                >
                  <div className='flex items-center gap-2'>
                    {preset.icon}
                    <div>
                      <div className='font-medium'>{preset.name}</div>
                      <div className='text-xs text-slate-400'>
                        {preset.description}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced Export Controls using shadcn
const EnhancedExportControls = ({
  onExportGLB,
  onExportOBJ,
  onTakeScreenshot,
  isExporting,
  exportProgress,
}) => {
  return (
    <Card className='bg-slate-800/50 border-slate-700 backdrop-blur-sm'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-lg font-semibold text-white flex items-center gap-2'>
          <Download className='w-5 h-5 text-purple-400' />
          Export Studio
        </CardTitle>
        <CardDescription className='text-slate-400'>
          Save and share your creation
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        {isExporting && (
          <div className='space-y-2'>
            <div className='flex items-center gap-2 text-sm text-slate-300'>
              <Loader2 className='w-4 h-4 animate-spin' />
              Exporting... {exportProgress}%
            </div>
            <Progress value={exportProgress} className='bg-slate-700' />
          </div>
        )}

        <div className='grid grid-cols-1 gap-2'>
          <Button
            onClick={onExportGLB}
            disabled={isExporting}
            variant='outline'
            className='border-slate-600 text-slate-300 hover:bg-slate-700'
            size='sm'
          >
            <Download className='w-4 h-4 mr-2' />
            Export GLB
          </Button>
          <Button
            onClick={onExportOBJ}
            disabled={isExporting}
            variant='outline'
            className='border-slate-600 text-slate-300 hover:bg-slate-700'
            size='sm'
          >
            <Download className='w-4 h-4 mr-2' />
            Export OBJ
          </Button>
          <Button
            onClick={onTakeScreenshot}
            disabled={isExporting}
            variant='outline'
            className='border-slate-600 text-slate-300 hover:bg-slate-700'
            size='sm'
          >
            <Camera className='w-4 h-4 mr-2' />
            Screenshot
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced Settings Dialog using shadcn
const EnhancedSettingsPanel = ({
  settings,
  onSettingsChange,
  show,
  onClose,
}) => {
  const updateSetting = (key, value) => {
    onSettingsChange((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className='bg-slate-800 border-slate-700 text-white max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold'>
            Advanced Settings
          </DialogTitle>
          <DialogDescription className='text-slate-400'>
            Fine-tune your 3D shape parameters
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue='material' className='w-full'>
          <TabsList className='grid w-full grid-cols-3 bg-slate-700'>
            <TabsTrigger value='material'>Material</TabsTrigger>
            <TabsTrigger value='animation'>Animation</TabsTrigger>
            <TabsTrigger value='rendering'>Rendering</TabsTrigger>
          </TabsList>

          <TabsContent value='material' className='space-y-6 mt-6'>
            <div className='space-y-3'>
              <Label className='text-sm font-medium'>Material Type</Label>
              <Select
                value={settings.materialType}
                onValueChange={(value) => updateSetting("materialType", value)}
              >
                <SelectTrigger className='bg-slate-700 border-slate-600'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='bg-slate-800 border-slate-700'>
                  <SelectItem value='auto'>Auto</SelectItem>
                  <SelectItem value='metallic'>Metallic</SelectItem>
                  <SelectItem value='glass'>Glass</SelectItem>
                  <SelectItem value='crystal'>Crystal</SelectItem>
                  <SelectItem value='ceramic'>Ceramic</SelectItem>
                  <SelectItem value='organic'>Organic</SelectItem>
                  <SelectItem value='plastic'>Plastic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-3'>
              <Label className='text-sm font-medium'>Shape Color</Label>
              <input
                type='color'
                value={settings.shapeColor}
                onChange={(e) => updateSetting("shapeColor", e.target.value)}
                className='w-full h-10 rounded-md border border-slate-600 bg-slate-700'
              />
            </div>

            <div className='space-y-3'>
              <Label className='text-sm font-medium'>
                Extrude Depth: {settings.extrudeDepth}
              </Label>
              <Slider
                value={[settings.extrudeDepth]}
                onValueChange={([value]) =>
                  updateSetting("extrudeDepth", value)
                }
                max={1}
                min={0.1}
                step={0.1}
                className='w-full'
              />
            </div>
          </TabsContent>

          <TabsContent value='animation' className='space-y-6 mt-6'>
            <div className='space-y-3'>
              <Label className='text-sm font-medium'>
                Animation Speed: {settings.animationSpeed}x
              </Label>
              <Slider
                value={[settings.animationSpeed]}
                onValueChange={([value]) =>
                  updateSetting("animationSpeed", value)
                }
                max={3}
                min={0.1}
                step={0.1}
                className='w-full'
              />
            </div>
          </TabsContent>

          <TabsContent value='rendering' className='space-y-6 mt-6'>
            <div className='space-y-3'>
              <Label className='text-sm font-medium'>
                Light Intensity: {settings.lightIntensity}
              </Label>
              <Slider
                value={[settings.lightIntensity]}
                onValueChange={([value]) =>
                  updateSetting("lightIntensity", value)
                }
                max={2}
                min={0.1}
                step={0.1}
                className='w-full'
              />
            </div>

            <div className='space-y-3'>
              <Label className='text-sm font-medium'>Quality</Label>
              <Select
                value={settings.quality}
                onValueChange={(value) => updateSetting("quality", value)}
              >
                <SelectTrigger className='bg-slate-700 border-slate-600'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='bg-slate-800 border-slate-700'>
                  <SelectItem value='low'>Low</SelectItem>
                  <SelectItem value='medium'>Medium</SelectItem>
                  <SelectItem value='high'>High</SelectItem>
                  <SelectItem value='ultra'>Ultra</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

const Enhanced3DShapes = () => {
  const [isMounted, setIsMounted] = useState(false);
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const composerRef = useRef(null);
  const animationIdRef = useRef(null);
  const currentMeshRef = useRef(null);
  const lightsRef = useRef({});
  const skyboxGradRef = useRef(null);
  const envMapTextureRef = useRef(null);

  const [currentShapeId, setCurrentShapeId] = useState(
    shapesDataArray[0]?.id || "heart"
  );
  const [isAnimatingState, setIsAnimatingState] = useState(true);
  const [animationPreset, setAnimationPreset] = useState("gentle");
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const [settings, setSettings] = useState({
    materialType: "auto",
    animationSpeed: 1.0,
    lightIntensity: 1.0,
    extrudeDepth: 0.3,
    quality: "high",
    shapeColor: "#ff6b9d",
  });

  const isAnimatingLoopRef = useRef(isAnimatingState);
  const settingsLoopRef = useRef(settings);
  const animationPresetLoopRef = useRef(animationPreset);
  const currentShapeIdRef = useRef(currentShapeId);

  const animationState = useRef({
    startTime: Date.now(),
    accumulatedPauseTime: 0,
    lastPauseTime: 0,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    isAnimatingLoopRef.current = isAnimatingState;
  }, [isAnimatingState]);
  useEffect(() => {
    settingsLoopRef.current = settings;
  }, [settings]);
  useEffect(() => {
    animationPresetLoopRef.current = animationPreset;
  }, [animationPreset]);
  useEffect(() => {
    currentShapeIdRef.current = currentShapeId;
  }, [currentShapeId]);

  useEffect(() => {
    if (!isMounted || !mountRef.current) return;
    const currentMount = mountRef.current;
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const gradientGeometry = new THREE.SphereGeometry(50, 32, 32);
    const gradientMaterial = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(0x3a7ca5) },
        bottomColor: { value: new THREE.Color(0x1e3b49) },
        offset: { value: 33 },
        exponent: { value: 0.7 },
      },
      vertexShader: `varying vec3 vWorldPosition; void main() { vec4 worldPosition = modelMatrix * vec4(position, 1.0); vWorldPosition = worldPosition.xyz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `uniform vec3 topColor; uniform vec3 bottomColor; uniform float offset; uniform float exponent; varying vec3 vWorldPosition; void main() { float h = normalize(vWorldPosition + offset).y; gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0); }`,
      side: THREE.BackSide,
    });
    const skybox = new THREE.Mesh(gradientGeometry, gradientMaterial);
    scene.add(skybox);
    skyboxGradRef.current = skybox;
    scene.fog = new THREE.Fog(0x2c5d72, 8, 30);

    const camera = new THREE.PerspectiveCamera(
      60,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0.5, 4);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
      alpha: true,
    });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    rendererRef.current = renderer;
    currentMount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1;
    controls.maxDistance = 15;
    controls.target.set(0, 0.2, 0);
    controlsRef.current = controls;

    const rgbeLoader = new RGBELoader();
    rgbeLoader.load(
      "/brown_photostudio_02_4k.hdr",
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        if (sceneRef.current) sceneRef.current.environment = texture;
        envMapTextureRef.current = texture;
      },
      undefined,
      (error) => console.error("HDR Load Error:", error)
    );

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.7);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xa0c0ff, 0.4);
    rimLight.position.set(-6, 3, -7);
    scene.add(rimLight);
    lightsRef.current = { ambient: ambientLight, key: keyLight, rim: rimLight };

    const composer = new EffectComposer(renderer);
    composerRef.current = composer;
    composer.addPass(new RenderPass(scene, camera));
    const ssaoPass = new SSAOPass(
      scene,
      camera,
      currentMount.clientWidth,
      currentMount.clientHeight
    );
    ssaoPass.kernelRadius = 0.6;
    ssaoPass.minDistance = 0.001;
    ssaoPass.maxDistance = 0.05;
    composer.addPass(ssaoPass);
    composer.addPass(new OutputPass());

    const clock = new THREE.Clock();
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (controlsRef.current) controlsRef.current.update();
      if (isAnimatingLoopRef.current && currentMeshRef.current) {
        const localSettings = settingsLoopRef.current;
        const preset = animationPresets[animationPresetLoopRef.current];
        const speed = localSettings.animationSpeed;
        currentMeshRef.current.rotation.x +=
          preset.rotationSpeed[0] * 60 * delta * speed;
        currentMeshRef.current.rotation.y +=
          preset.rotationSpeed[1] * 60 * delta * speed;
        currentMeshRef.current.rotation.z +=
          preset.rotationSpeed[2] * 60 * delta * speed;
        const currentTime = Date.now();
        const elapsedTimeSinceStart =
          (currentTime -
            animationState.current.startTime -
            (animationState.current.accumulatedPauseTime || 0)) *
          0.001;
        const floatTime = elapsedTimeSinceStart * speed;
        currentMeshRef.current.position.y =
          Math.sin(floatTime * preset.floatSpeed * 100) * preset.floatAmplitude;
      }
      if (composerRef.current) composerRef.current.render(delta);
      else if (rendererRef.current) rendererRef.current.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (currentMount && cameraRef.current && rendererRef.current) {
        const w = currentMount.clientWidth;
        const h = currentMount.clientHeight;
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
        if (composerRef.current) composerRef.current.setSize(w, h);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener("resize", handleResize);
      controlsRef.current?.dispose();
      envMapTextureRef.current?.dispose();
      if (skyboxGradRef.current) {
        skyboxGradRef.current.geometry?.dispose();
        skyboxGradRef.current.material?.dispose();
        sceneRef.current?.remove(skyboxGradRef.current);
      }
      if (currentMeshRef.current) {
        currentMeshRef.current.geometry?.dispose();
        if (Array.isArray(currentMeshRef.current.material)) {
          currentMeshRef.current.material.forEach((m) => m.dispose());
        } else {
          currentMeshRef.current.material?.dispose();
        }
        sceneRef.current?.remove(currentMeshRef.current);
      }
      composerRef.current?.passes.forEach((pass) => pass.dispose?.());
      if (
        rendererRef.current &&
        currentMount &&
        rendererRef.current.domElement
      ) {
        currentMount.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      } else if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      sceneRef.current?.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material))
            obj.material.forEach((m) => m.dispose());
          else obj.material.dispose?.();
        }
      });
      sceneRef.current = null;
      rendererRef.current = null;
      cameraRef.current = null;
      controlsRef.current = null;
      composerRef.current = null;
      currentMeshRef.current = null;
      skyboxGradRef.current = null;
      envMapTextureRef.current = null;
      lightsRef.current = {};
    };
  }, [isMounted]);

  // Effect for updating shape
  useEffect(() => {
    if (!isMounted || !sceneRef.current || !settingsLoopRef.current) return;
    if (currentMeshRef.current) {
      sceneRef.current.remove(currentMeshRef.current);
      currentMeshRef.current.geometry?.dispose();
      if (Array.isArray(currentMeshRef.current.material)) {
        currentMeshRef.current.material.forEach((m) => m.dispose());
      } else {
        currentMeshRef.current.material?.dispose();
      }
    }
    const newMesh = createFull3DShape(
      currentShapeId,
      settingsLoopRef.current,
      1.5
    );
    sceneRef.current.add(newMesh);
    currentMeshRef.current = newMesh;
    animationState.current.startTime = Date.now();
    animationState.current.accumulatedPauseTime = 0;
    if (currentMeshRef.current) currentMeshRef.current.position.y = 0;
  }, [currentShapeId, isMounted]);

  // Effect for settings changes that might require material/geometry update
  useEffect(() => {
    if (
      !isMounted ||
      !currentMeshRef.current ||
      !sceneRef.current ||
      !settingsLoopRef.current
    )
      return;
    const currentSettings = settingsLoopRef.current;
    const mesh = currentMeshRef.current;

    const newMaterialType =
      currentSettings.materialType === "auto"
        ? shapesDataArray.find((s) => s.id === currentShapeIdRef.current)
            ?.autoMaterial || "ceramic"
        : currentSettings.materialType;

    let materialChanged = false;
    if (
      mesh.material.userData?.type !== newMaterialType ||
      mesh.material.color.getHexString() !==
        currentSettings.shapeColor.substring(1)
    ) {
      materialChanged = true;
    }

    if (materialChanged) {
      const tempMeshForMaterial = createFull3DShape(
        currentShapeIdRef.current,
        currentSettings,
        1.5
      );
      mesh.material.dispose();
      mesh.material = tempMeshForMaterial.material.clone();
      mesh.material.needsUpdate = true;
      tempMeshForMaterial.geometry.dispose();
    }
  }, [settings, isMounted]);

  useEffect(() => {
    if (!isMounted || !lightsRef.current.ambient) return;
    const intensity = settingsLoopRef.current.lightIntensity;
    lightsRef.current.ambient.intensity = 0.3 * intensity;
    if (lightsRef.current.key)
      lightsRef.current.key.intensity = 0.7 * intensity; // Add checks
    if (lightsRef.current.rim)
      lightsRef.current.rim.intensity = 0.4 * intensity;
  }, [settings.lightIntensity, isMounted]);

  const handleToggleAnimation = useCallback(() => {
    setIsAnimatingState((prevIsAnimating) => {
      const newIsAnimating = !prevIsAnimating;
      if (newIsAnimating) {
        // Resuming
        const pauseDuration =
          Date.now() - (animationState.current.lastPauseTime || Date.now());
        animationState.current.accumulatedPauseTime =
          (animationState.current.accumulatedPauseTime || 0) + pauseDuration;
        // No, this is wrong. StartTime needs to be effectively shifted.
        // When resuming, we want to continue from where it left off.
        // The floatTime calculation already subtracts accumulatedPauseTime.
        // We just need to ensure lastPauseTime is set correctly when pausing.
      } else {
        // Pausing
        animationState.current.lastPauseTime = Date.now();
      }
      return newIsAnimating;
    });
  }, []);

  const handleResetAnimation = useCallback(() => {
    if (currentMeshRef.current) {
      currentMeshRef.current.rotation.set(0, 0, 0);
      currentMeshRef.current.position.set(0, 0, 0);
    }
    animationState.current.startTime = Date.now();
    animationState.current.accumulatedPauseTime = 0;
    animationState.current.lastPauseTime = 0;
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.target.set(0, 0.2, 0);
    }
  }, []);

  useEffect(() => {
    if (isMounted) handleResetAnimation();
  }, [animationPreset, isMounted, handleResetAnimation]);

  const handleRandomize = useCallback(() => {
    /* ... (keep your randomize logic as before) ... */
    const randomShape =
      shapesDataArray[Math.floor(Math.random() * shapesDataArray.length)];
    const randomPresetKey =
      Object.keys(animationPresets)[
        Math.floor(Math.random() * Object.keys(animationPresets).length)
      ];
    const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
    const materialKeys = [
      "metallic",
      "glass",
      "crystal",
      "ceramic",
      "organic",
      "plastic",
    ];
    const randomMaterial =
      materialKeys[Math.floor(Math.random() * materialKeys.length)];

    setCurrentShapeId(randomShape.id);
    setAnimationPreset(randomPresetKey);
    setSettings((prev) => ({
      ...prev,
      materialType: randomMaterial,
      shapeColor: randomColor,
      extrudeDepth: parseFloat((Math.random() * (0.8 - 0.1) + 0.1).toFixed(2)),
      lightIntensity: parseFloat(
        (Math.random() * (1.5 - 0.5) + 0.5).toFixed(1)
      ),
      animationSpeed: parseFloat(
        (Math.random() * (2.0 - 0.5) + 0.5).toFixed(1)
      ),
    }));
  }, []);

  const handleExportGLBCallback = useCallback(async () => {
    if (!currentMeshRef.current || isExporting) {
      console.warn("Export GLB: Not ready.");
      return;
    }
    setIsExporting(true);
    setExportProgress(0);
    try {
      const result = await exportToGLB(
        currentMeshRef.current,
        currentShapeIdRef.current,
        setExportProgress
      );
      if (result && result.glbBuffer) {
        const blob = new Blob([result.glbBuffer], {
          type: "model/gltf-binary",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = result.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else if (!result) {
        console.error("GLB Export failed, result was null.");
      }
    } catch (error) {
      console.error("Error during GLB export process:", error);
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 500);
    }
  }, [isExporting]);

  const handleExportOBJCallback = useCallback(() => {
    if (!currentMeshRef.current || isExporting) {
      console.warn("Export OBJ: Not ready.");
      return;
    }
    setIsExporting(true);
    const result = exportToOBJ(
      currentMeshRef.current,
      currentShapeIdRef.current
    );
    if (result && result.objContent) {
      const blob = new Blob([result.objContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (!result) {
      console.error("OBJ Export failed, result was null.");
    }
    setIsExporting(false);
  }, [isExporting]);

  const handleTakeScreenshotCallback = useCallback(() => {
    if (!rendererRef.current) return;
    if (composerRef.current) composerRef.current.render();
    else if (sceneRef.current && cameraRef.current)
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    else {
      console.warn("Cannot take screenshot, rendering components not ready.");
      return;
    }
    const result = takeScreenshotUtil(
      rendererRef.current,
      currentShapeIdRef.current
    );
    if (result && result.dataURL) {
      const link = document.createElement("a");
      link.download = result.filename;
      link.href = result.dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (!result) {
      console.error("Screenshot failed, result was null.");
    }
  }, []);

  if (!isMounted) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-3 sm:p-4 md:p-6 text-white select-none'>
        <div className='max-w-7xl mx-auto text-center py-20'>
          <h1 className='text-4xl font-bold text-purple-400 mb-4'>
            Loading 3D Shapes Studio Pro...
          </h1>
          <p className='text-slate-300'>Initializing creative space...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-3 sm:p-4 md:p-6 text-white select-none'>
      <div className='max-w-7xl mx-auto'>
        <header className='text-center mb-6 sm:mb-8'>
          <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent'>
            3D Shapes Studio Pro
          </h1>
          <p className='text-slate-300 text-sm sm:text-lg max-w-3xl mx-auto'>
            Craft, customize, animate, and export intricate 3D shapes with
            advanced controls.
          </p>
        </header>
        <div className='grid lg:grid-cols-4 gap-4 sm:gap-6'>
          <div className='lg:col-span-1 space-y-4 sm:space-y-6'>
            <ShapeSelector
              shapes={shapesDataArray}
              currentShape={currentShapeId}
              onShapeSelect={setCurrentShapeId}
            />
            <AnimationControlsUI
              isAnimating={isAnimatingState}
              onToggleAnimation={handleToggleAnimation}
              onResetAnimation={handleResetAnimation}
            />
            <ExportControls
              onExportGLB={handleExportGLBCallback}
              onExportOBJ={handleExportOBJCallback}
              onTakeScreenshot={handleTakeScreenshotCallback}
              isExporting={isExporting}
              exportProgress={Math.round(exportProgress)}
            />
            <button
              onClick={() => setShowSettings(true)}
              className='w-full flex items-center justify-center gap-2 p-3 bg-slate-700 hover:bg-slate-600/80 text-white rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105'
            >
              <SettingsIcon size={20} />{" "}
              <span className='font-medium'>Advanced Settings</span>
            </button>
          </div>
          <ThreeDViewer
            mountRef={mountRef}
            isExporting={isExporting}
            exportProgress={Math.round(exportProgress)}
          />
        </div>
        <SettingsPanel
          settings={settings}
          onSettingsChange={setSettings}
          show={showSettings}
          onClose={() => setShowSettings(false)}
        />
        <Instructions />
        <footer className='text-center mt-10 sm:mt-12 text-slate-400 text-xs sm:text-sm'>
          <p>
            © {new Date().getFullYear()} 3D Shapes Studio Pro. All rights
            reserved.
          </p>
          <p>Powered by React & Three.js</p>
        </footer>
      </div>
    </div>
  );
};

export default Enhanced3DShapes;
