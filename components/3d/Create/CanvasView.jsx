import React, { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import ErrorBoundary from "./ErrorBoundary"; // Adjust path if ErrorBoundary.jsx is elsewhere

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
  sceneRef,
  cameraPreset,
  selectedShape,
  setSelectedShapeId,
  SceneComponent, // MainScene
  CameraControllerComponent, // CameraController
  isAnimating,
  loadedGltfObjects,
  onDropOnCanvas,
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
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (onDropOnCanvas) {
      onDropOnCanvas(event);
    }
  };

  const errorFallbackUI = (
    <div className='flex-grow flex items-center justify-center bg-destructive/10 text-destructive p-4 border border-destructive rounded-md'>
      <div className='text-center'>
        <p className='font-semibold text-lg'>Error Loading 3D View</p>
        <p className='text-sm'>
          There was an issue loading some 3D assets. Please check the console
          for details.
        </p>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className='flex-grow relative overflow-hidden bg-[#282a36]'
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <ErrorBoundary fallback={errorFallbackUI}>
        <R3FCanvas
          shadows
          camera={{ position: [7, 7, 7], fov: 50, near: 0.1, far: 1000 }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            outputColorSpace: THREE.SRGBColorSpace,
            preserveDrawingBuffer: true,
          }}
          onCreated={({ gl }) => {
            // Removed scene from args as it's available via useThree
            if (THREE) {
              gl.shadowMap.enabled = true;
              gl.shadowMap.type = THREE.PCFSoftShadowMap;
            }
          }}
          onPointerMissed={(event) => {
            if (!event.object) {
              if (
                !(
                  mode === "translate" ||
                  mode === "rotate" ||
                  mode === "scale"
                ) ||
                event.target === event.currentTarget
              ) {
                setSelectedShapeId(null);
              }
            }
          }}
        >
          <Suspense fallback={null}>
            {" "}
            {/* Handles loading state for useLoader, Environment, etc. */}
            <SceneComponent
              shapes={shapes}
              selectedShapeId={selectedShapeId}
              mode={mode}
              onShapeClick={onShapeClick}
              onShapeUpdate={onShapeUpdate}
              orbitControlsEnabled={orbitControlsEnabled}
              sceneRef={sceneRef}
              isAnimating={isAnimating}
              loadedGltfObjects={loadedGltfObjects}
            />
            {cameraPreset && (
              <CameraControllerComponent preset={cameraPreset} />
            )}
          </Suspense>
        </R3FCanvas>
      </ErrorBoundary>

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
          </motion.div>
        )}
      </AnimatePresence>

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
