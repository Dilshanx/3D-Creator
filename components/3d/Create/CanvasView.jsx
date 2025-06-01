import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useMemo } from "react";
import * as THREE from "three";

// Enhanced fallback with loading animation
function CanvasFallback() {
  return (
    <group>
      {/* Main loading box with subtle animation */}
      <mesh rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color='#ff6b35' roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Ambient lighting for better visibility */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />

      {/* Optional: Add a subtle floating animation */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshBasicMaterial color='#2a2a2a' opacity={0.3} transparent />
      </mesh>
    </group>
  );
}

export default function CanvasView({
  shapes,
  loadedGltfObjects,
  selectedShapeId,
  mode,
  onShapeClick,
  onShapeUpdate,
  orbitControlsEnabled,
  cameraPreset,
  selectedShape,
  setSelectedShapeId,
  SceneComponent,
  CameraControllerComponent,
  isAnimating,
  onDropOnCanvas,
  animationClips,
  selectedAnimationClipIndex,
  animationPlaybackState,
  isAnimationLooping,
  animationPlaybackSpeed,
  animationTime,
  playAllAnimations,
  onR3FContextReady,
  refreshKey,
}) {
  // Optimized canvas click handler
  const handleCanvasMissedClick = useCallback(
    (event) => {
      // Enhanced click detection - ensure we're clicking empty space
      const isDirectCanvasClick = event.target === event.currentTarget;
      const hasSelection = selectedShapeId !== null;

      if (isDirectCanvasClick && hasSelection) {
        setSelectedShapeId(null);
      }
    },
    [selectedShapeId, setSelectedShapeId]
  );

  // Optimized drag handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy"; // Better UX feedback
  }, []);

  // Memoized canvas configuration for better performance
  const canvasConfig = useMemo(
    () => ({
      shadows: true,
      camera: {
        position: [7, 7, 7],
        fov: 50,
        near: 0.1,
        far: 1000,
      },
      gl: {
        antialias: true,
        alpha: true, // Better transparency support
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
        outputColorSpace: THREE.SRGBColorSpace,
        preserveDrawingBuffer: true,
        powerPreference: "high-performance", // Better performance on capable devices
        stencil: false, // Disable if not needed for performance
      },
    }),
    []
  );

  // Enhanced R3F context setup
  const handleCanvasCreated = useCallback(
    ({ scene, gl, camera }) => {
      // Optimize renderer settings
      gl.setClearColor(0x2d3748, 1); // Match bg-gray-700
      gl.physicallyCorrectLights = true;

      // Better shadow settings
      gl.shadowMap.enabled = true;
      gl.shadowMap.type = THREE.PCFSoftShadowMap;

      // Notify parent component
      if (onR3FContextReady) {
        onR3FContextReady(scene, gl, camera);
      }
    },
    [onR3FContextReady]
  );

  return (
    <div
      className='flex-grow bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 relative overflow-hidden rounded-lg shadow-inner'
      onDragOver={handleDragOver}
      onDrop={onDropOnCanvas}
      onClick={handleCanvasMissedClick}
      style={{
        // Add subtle texture/grain for more premium feel
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
        backgroundSize: "20px 20px",
      }}
    >
      {/* Loading indicator overlay */}
      <div className='absolute top-4 left-4 z-10 pointer-events-none'>
        <div
          className='bg-black bg-opacity-50 backdrop-blur-sm rounded-md px-3 py-1.5 text-white text-xs font-medium opacity-0 transition-opacity duration-300'
          id='canvas-status'
        >
          Loading 3D Scene...
        </div>
      </div>

      {/* Canvas with enhanced error boundary */}
      <Canvas
        {...canvasConfig}
        onCreated={handleCanvasCreated}
        onPointerMissed={() => {
          // Additional deselection logic for pointer events
          if (selectedShapeId) {
            setSelectedShapeId(null);
          }
        }}
        // Performance optimizations
        frameloop='demand' // Only render when needed
        dpr={[1, 2]} // Responsive pixel ratio
      >
        <Suspense fallback={<CanvasFallback />}>
          {/* Enhanced lighting setup */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={0.8}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />

          {/* Camera controller with enhanced settings */}
          <CameraControllerComponent
            enabled={orbitControlsEnabled}
            cameraPreset={cameraPreset}
          />

          {/* Main scene component with all props */}
          <SceneComponent
            shapes={shapes}
            loadedGltfObjects={loadedGltfObjects}
            selectedShapeId={selectedShapeId}
            mode={mode}
            onShapeClick={onShapeClick}
            onShapeUpdate={onShapeUpdate}
            isAnimating={isAnimating}
            animationClips={animationClips}
            selectedAnimationClipIndex={selectedAnimationClipIndex}
            animationPlaybackState={animationPlaybackState}
            isAnimationLooping={isAnimationLooping}
            animationPlaybackSpeed={animationPlaybackSpeed}
            animationTime={animationTime}
            playAllAnimations={playAllAnimations}
            selectedShape={selectedShape}
            refreshKey={refreshKey}
          />

          {/* Performance monitoring in development */}
          {process.env.NODE_ENV === "development" && (
            <group>
              {/* Add performance stats or debug helpers here if needed */}
            </group>
          )}
        </Suspense>
      </Canvas>

      {/* Corner indicators for better UX */}
      <div className='absolute bottom-4 right-4 pointer-events-none'>
        <div className='flex items-center space-x-2 bg-black- bg-opacity-30 backdrop-blur-sm rounded-md px-2 py-1'>
          {orbitControlsEnabled && (
            <div className='text-white text-xs opacity-70'>
              🖱️ Drag to orbit
            </div>
          )}
          {selectedShapeId && (
            <div className='text-blue-300 text-xs'>✨ Object selected</div>
          )}
        </div>
      </div>
    </div>
  );
}
