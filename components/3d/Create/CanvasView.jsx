// // CanvasView.jsx
// import { Suspense } from "react"; // Keep Suspense if RealTextGeometry or other components need it
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Card,
//   CardContent,
//   CardHeader, // Not used directly here, but good to keep if Card needs it
//   CardTitle, // Not used directly here
// } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";

// // Conditional imports for R3F components (Canvas specific)
// let R3FCanvas; // Renamed to avoid conflict with HTMLCanvasElement
// try {
//   const r3f = require("@react-three/fiber");
//   R3FCanvas = r3f.Canvas;
// } catch (error) {
//   console.warn(
//     "@react-three/fiber Canvas not available for CanvasView:",
//     error
//   );
// }
// // THREE might be needed if onCreated does specific THREE setup
// import * as THREE from "three";

// export default function CanvasView({
//   shapes,
//   selectedShapeId,
//   mode,
//   onShapeClick,
//   onShapeUpdate, // This is handleShapeUpdateFromTransformControls
//   orbitControlsEnabled,
//   sceneRef,
//   cameraPreset,
//   selectedShape, // For the top-left overlay
//   setSelectedShapeId, // For onPointerMissed
//   SceneComponent, // Pass the Scene component to render
//   CameraControllerComponent, // Pass the CameraController component
// }) {
//   if (!R3FCanvas) {
//     return (
//       <div className='flex-grow flex items-center justify-center bg-muted text-destructive-foreground p-4'>
//         React Three Fiber Canvas is not available. Please install
//         @react-three/fiber.
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ scale: 0.95, opacity: 0 }}
//       animate={{ scale: 1, opacity: 1 }}
//       transition={{ delay: 0.2 }}
//       className='flex-grow relative overflow-hidden'
//     >
//       <R3FCanvas
//         shadows
//         camera={{ position: [5, 5, 5], fov: 60 }}
//         gl={{ antialias: true }}
//         style={{
//           background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//         }}
//         onCreated={({ gl }) => {
//           if (THREE) {
//             // Ensure THREE is available
//             gl.shadowMap.enabled = true;
//             gl.shadowMap.type = THREE.PCFSoftShadowMap;
//           }
//         }}
//         onPointerMissed={() => setSelectedShapeId(null)}
//       >
//         <Suspense fallback={null}>
//           {" "}
//           {/* General suspense for scene content */}
//           <SceneComponent
//             shapes={shapes}
//             selectedShapeId={selectedShapeId}
//             mode={mode}
//             onShapeClick={onShapeClick}
//             onShapeUpdate={onShapeUpdate}
//             orbitControlsEnabled={orbitControlsEnabled}
//             sceneRef={sceneRef}
//           />
//           {cameraPreset && <CameraControllerComponent preset={cameraPreset} />}
//         </Suspense>
//       </R3FCanvas>

//       {/* Modern Info Overlays */}
//       <motion.div
//         initial={{ y: 20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ delay: 0.4 }}
//         className='absolute bottom-6 left-6 z-10' // Added z-index
//       >
//         <Card className='bg-black/20 backdrop-blur-md border-white/10'>
//           <CardContent className='p-4'>
//             <div className='flex items-center space-x-4 text-white/90'>
//               <div className='flex items-center space-x-2'>
//                 <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
//                 <span className='text-sm font-medium'>
//                   {shapes.length} Objects
//                 </span>
//               </div>
//               <Separator orientation='vertical' className='h-4 bg-white/20' />
//               <span className='text-sm'>
//                 Mode: {mode.charAt(0).toUpperCase() + mode.slice(1)}
//               </span>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>

//       <AnimatePresence>
//         {selectedShape && (
//           <motion.div
//             initial={{ y: -20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             exit={{ y: -20, opacity: 0 }}
//             className='absolute top-6 left-6 z-10' // Added z-index
//           >
//             <Card className='bg-blue-500/20 backdrop-blur-md border-blue-400/30'>
//               <CardContent className='p-4'>
//                 <div className='text-blue-100 text-sm font-medium'>
//                   Selected:{" "}
//                   {selectedShape.geometry === "text"
//                     ? `Text: "${selectedShape.text || "Empty"}"`
//                     : selectedShape.geometry.charAt(0).toUpperCase() +
//                       selectedShape.geometry.slice(1)}
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// }

// CanvasView.jsx
// import { Suspense } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import * as THREE from "three"; // Keep for onCreated and gl settings

// // Conditional imports for R3F components
// let R3FCanvas;
// try {
//   const r3f = require("@react-three/fiber");
//   R3FCanvas = r3f.Canvas;
// } catch (error) {
//   console.warn(
//     "@react-three/fiber Canvas not available for CanvasView:",
//     error
//   );
// }

// export default function CanvasView({
//   shapes,
//   selectedShapeId,
//   mode,
//   onShapeClick,
//   onShapeUpdate, // This is handleShapeUpdateFromTransformControls
//   orbitControlsEnabled,
//   sceneRef,
//   cameraPreset,
//   selectedShape,
//   setSelectedShapeId,
//   SceneComponent,
//   CameraControllerComponent,
// }) {
//   if (!R3FCanvas) {
//     return (
//       <div className='flex-grow flex items-center justify-center bg-muted text-destructive-foreground p-4'>
//         React Three Fiber Canvas is not available. Please install
//         @react-three/fiber.
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ scale: 0.95, opacity: 0 }}
//       animate={{ scale: 1, opacity: 1 }}
//       transition={{ delay: 0.2 }}
//       className='flex-grow relative overflow-hidden'
//     >
//       <R3FCanvas
//         shadows
//         camera={{ position: [5, 5, 5], fov: 60 }}
//         gl={{
//           antialias: true,
//           toneMapping: THREE.ACESFilmicToneMapping,
//           outputColorSpace: THREE.SRGBColorSpace, // Updated for modern THREE
//         }}
//         // The scene background (HDR or color) will be set in MainScene.
//         // This style is for the HTML canvas element itself if needed.
//         style={{
//           background: "linear-gradient(135deg, #1e1e2f 0%, #3c3c58 100%)", // Darker gradient
//         }}
//         onCreated={({ gl, scene }) => {
//           if (THREE) {
//             gl.shadowMap.enabled = true;
//             gl.shadowMap.type = THREE.PCFSoftShadowMap;
//             // Scene background/environment is handled by MainScene component for HDR
//           }
//         }}
//         onPointerMissed={() => setSelectedShapeId(null)}
//       >
//         <Suspense fallback={null}>
//           <SceneComponent
//             shapes={shapes}
//             selectedShapeId={selectedShapeId}
//             mode={mode}
//             onShapeClick={onShapeClick}
//             onShapeUpdate={onShapeUpdate}
//             orbitControlsEnabled={orbitControlsEnabled}
//             sceneRef={sceneRef}
//           />
//           {cameraPreset && <CameraControllerComponent preset={cameraPreset} />}
//         </Suspense>
//       </R3FCanvas>

//       {/* Modern Info Overlays */}
//       <motion.div
//         initial={{ y: 20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ delay: 0.4 }}
//         className='absolute bottom-6 left-6 z-10'
//       >
//         <Card className='bg-black/30 backdrop-blur-md border-white/10 shadow-xl'>
//           <CardContent className='p-4'>
//             <div className='flex items-center space-x-4 text-white/90'>
//               <div className='flex items-center space-x-2'>
//                 <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
//                 <span className='text-sm font-medium'>
//                   {shapes.length} Objects
//                 </span>
//               </div>
//               <Separator orientation='vertical' className='h-4 bg-white/20' />
//               <span className='text-sm'>
//                 Mode: {mode.charAt(0).toUpperCase() + mode.slice(1)}
//               </span>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>

//       <AnimatePresence>
//         {selectedShape && (
//           <motion.div
//             initial={{ y: -20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             exit={{ y: -20, opacity: 0 }}
//             className='absolute top-6 left-6 z-10'
//           >
//             <Card className='bg-blue-600/30 backdrop-blur-md border-blue-500/40 shadow-xl'>
//               <CardContent className='p-4'>
//                 <div className='text-blue-100 text-sm font-medium'>
//                   Selected:{" "}
//                   {selectedShape.geometry === "text"
//                     ? `Text: "${selectedShape.text || "Empty"}"`
//                     : selectedShape.geometry.charAt(0).toUpperCase() +
//                       selectedShape.geometry.slice(1)}
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// }

// CanvasView.jsx
import { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card"; // Removed unused CardHeader, CardTitle
import { Separator } from "@/components/ui/separator";
import * as THREE from "three";

let R3FCanvas;
try {
  const r3f = require("@react-three/fiber");
  R3FCanvas = r3f.Canvas;
} catch (error) {
  console.warn(
    "@react-three/fiber Canvas not available for CanvasView:",
    error
  );
}

export default function CanvasView({
  shapes,
  selectedShapeId,
  mode,
  onShapeClick,
  onShapeUpdate,
  orbitControlsEnabled, // This prop will now be controlled by Model3DCreator
  sceneRef,
  cameraPreset,
  selectedShape,
  setSelectedShapeId,
  SceneComponent,
  CameraControllerComponent,
  isAnimating, // New prop
}) {
  if (!R3FCanvas) {
    return (
      <div className='flex-grow flex items-center justify-center bg-muted text-destructive-foreground p-4'>
        React Three Fiber Canvas is not available. Please install
        @react-three/fiber.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className='flex-grow relative overflow-hidden'
    >
      <R3FCanvas
        shadows
        camera={{ position: [5, 5, 5], fov: 60 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        style={{
          background: "linear-gradient(135deg, #1e1e2f 0%, #3c3c58 100%)",
        }}
        onCreated={({ gl }) => {
          if (THREE) {
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }
        }}
        onPointerMissed={() => {
          // Only deselect if not in transform mode or if transform target is missed
          if (mode === "translate" || mode === "rotate" || mode === "scale") {
            // Let TransformControls handle deselection or specific interactions
          } else {
            setSelectedShapeId(null);
          }
        }}
      >
        <Suspense fallback={null}>
          <SceneComponent
            shapes={shapes}
            selectedShapeId={selectedShapeId}
            mode={mode}
            onShapeClick={onShapeClick}
            onShapeUpdate={onShapeUpdate}
            orbitControlsEnabled={orbitControlsEnabled} // Pass down controlled value
            sceneRef={sceneRef}
            isAnimating={isAnimating} // Pass down
          />
          {cameraPreset && <CameraControllerComponent preset={cameraPreset} />}
        </Suspense>
      </R3FCanvas>

      <motion.div /* ... Bottom left overlay ... */>{/* ... */}</motion.div>

      <AnimatePresence>
        {selectedShape && (
          <motion.div /* ... Top left overlay ... */>{/* ... */}</motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
