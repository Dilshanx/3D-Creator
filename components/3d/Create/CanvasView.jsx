
import { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Removed unused CardHeader, CardTitle from original if they were there
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"; // If used for overlays
import * as THREE from "three"; // Keep for R3FCanvas setup

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
  orbitControlsEnabled,
  sceneRef, // Ref to get the THREE.Scene instance back
  cameraPreset,
  selectedShape, // The full selected shape data object
  setSelectedShapeId, // To deselect on pointer miss
  SceneComponent, // MainScene
  CameraControllerComponent, // CameraController
  isAnimating,
  loadedGltfObjects, // New: map of { shapeId: { scene: THREE.Group } }
  onDropOnCanvas, // New: handler for drag-and-drop import
}) {
  if (!R3FCanvas) {
    return (
      <div className='flex-grow flex items-center justify-center bg-muted text-destructive-foreground p-4'>
        React Three Fiber Canvas is not available. Please install
        @react-three/fiber.
      </div>
    );
  }

  const handleDragOver = (event) => {
    event.preventDefault(); // Necessary to allow drop
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (onDropOnCanvas) {
      onDropOnCanvas(event);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className='flex-grow relative overflow-hidden bg-[#282a36]' // Changed background for R3FCanvas container
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <R3FCanvas
        shadows
        camera={{ position: [7, 7, 7], fov: 50, near: 0.1, far: 1000 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
          preserveDrawingBuffer: false, // Usually false for performance, true if you need to screenshot canvas
        }}
        // style={{ background: "linear-gradient(135deg, #1e1e2f 0%, #3c3c58 100%)" }} // Canvas itself is transparent if Environment is used
        onCreated={({ gl, scene }) => {
          if (THREE) {
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows
          }
          // Optional: set scene background color if Environment doesn't provide one or is partial
          // scene.background = new THREE.Color("#282a36");
        }}
        onPointerMissed={(event) => {
          // Only deselect if the click was directly on the canvas (not on a child mesh or gizmo)
          // and not currently in a transform mode where TransformControls might handle it.
          // `event.object` is undefined if an empty area is clicked.
          // `event.target` is the DOM element that triggered the event.
          // `event.currentTarget` is the R3FCanvas's DOM element.
          if (!event.object) {
            // Clicked on empty space
            // Check if a transform control gizmo was active; if so, let it handle
            // This is tricky without direct access to TransformControls state here.
            // A simpler approach: if mode is a transform mode, assume gizmo interaction unless explicitly missed.
            if (
              !(mode === "translate" || mode === "rotate" || mode === "scale")
            ) {
              setSelectedShapeId(null);
            } else if (event.target === event.currentTarget) {
              // Clicked on canvas itself while in transform mode
              setSelectedShapeId(null);
            }
          }
        }}
      >
        <Suspense fallback={null}>
          {" "}
          {/* Fallback for <Environment> or other Suspense-using components */}
          <SceneComponent // This is MainScene
            shapes={shapes}
            selectedShapeId={selectedShapeId}
            mode={mode}
            onShapeClick={onShapeClick}
            onShapeUpdate={onShapeUpdate}
            orbitControlsEnabled={orbitControlsEnabled}
            sceneRef={sceneRef} // Pass the ref to MainScene
            isAnimating={isAnimating}
            loadedGltfObjects={loadedGltfObjects} // Pass to MainScene
          />
          {cameraPreset && <CameraControllerComponent preset={cameraPreset} />}
        </Suspense>
      </R3FCanvas>

      {/* Optional: Overlays for UI elements on top of the canvas */}
      {/* Example: Selected Shape Info Overlay (Top Left) */}
      <AnimatePresence>
        {selectedShape && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='absolute top-4 left-4 bg-card/70 backdrop-blur-md p-3 rounded-lg shadow-lg text-xs'
          >
            <div className='font-semibold mb-1'>
              Selected: {selectedShape.name || selectedShape.type}
            </div>
            <div className='text-muted-foreground'>
              ID: {selectedShape.id.slice(-6)}
            </div>
            {/* Add more info if needed */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Example: Mode Info Overlay (Bottom Left) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='absolute bottom-4 left-4 bg-card/70 backdrop-blur-md px-3 py-2 rounded-full shadow-lg text-xs font-medium'
      >
        Mode: <span className='capitalize'>{mode}</span> ({" "}
        {mode === "translate" ? "W" : mode === "rotate" ? "E" : "R"} )
      </motion.div>
    </motion.div>
  );
}
