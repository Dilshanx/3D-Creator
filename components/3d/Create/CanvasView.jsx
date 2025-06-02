import React, { Suspense } from "react";
import ErrorBoundary from "./ErrorBoundary";
import * as THREE from "three"; // Needed for onCreated background setting

let Canvas;
try {
  const r3f = require("@react-three/fiber");
  Canvas = r3f.Canvas;
} catch (e) {
  // Fallback handled by parent or specific message
}

const CanvasView = ({
  shapes,
  loadedGltfObjects,
  selectedShapeId,
  mode,
  onShapeClick,
  onShapeUpdate,
  orbitControlsEnabled,
  sceneRef,
  cameraPreset,
  selectedShape,
  setSelectedShapeId, // This prop was missing from the destructuring in your version
  SceneComponent,
  CameraControllerComponent,
  isAnimating,
  onDropOnCanvas, // This prop comes from Model3DCreator
  animationClips,
  selectedAnimationClipIndex,
  animationPlaybackState,
  isAnimationLooping,
  animationPlaybackSpeed,
  animationTime,
  playAllAnimations,
}) => {
  if (!Canvas) {
    return (
      <div className='flex-grow h-full w-full bg-slate-900 flex flex-col items-center justify-center text-red-400 p-4 rounded-md border border-red-700/50'>
        <p className='text-lg font-semibold mb-2'>⚠️ Critical Error:</p>
        <p className='text-sm'>@react-three/fiber Canvas is not available.</p>
        <p className='text-xs mt-1'>
          Ensure it's installed and imported correctly.
        </p>
      </div>
    );
  }

  const handleCanvasClick = (event) => {
    if (event.target === event.currentTarget) {
      // Clicked on canvas background, not an object
      if (setSelectedShapeId) setSelectedShapeId(null);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // This is CRUCIAL for onDrop to fire
    event.stopPropagation();
    // Optional: Provide visual feedback for drag over
    // event.dataTransfer.dropEffect = 'copy';
  };

  return (
    // This div will be the direct child of the flex-1 min-h-0 container in Model3DCreator
    // h-full w-full ensures it tries to fill that container.
    <div
      className='h-full w-full flex-grow bg-slate-900/20 md:bg-transparent relative rounded-lg overflow-hidden shadow-inner'
      onDrop={onDropOnCanvas}
      onDragOver={handleDragOver}
      onClick={handleCanvasClick}
    >
      <ErrorBoundary
        fallback={
          <div className='h-full w-full flex flex-col items-center justify-center bg-slate-800 text-red-400 p-4 border border-red-600/50 rounded-md'>
            <p className='text-lg font-semibold mb-2'>⚠️ 3D Canvas Error!</p>
            <p className='text-sm'>Issue rendering the 3D scene.</p>
            <p className='text-xs mt-1'>Check console or try refreshing.</p>
          </div>
        }
      >
        <Canvas
          shadows
          camera={{ position: [5, 5, 10], fov: 50, near: 0.1, far: 1000 }}
          gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
          onCreated={({ scene }) => {
            if (!scene.background && !scene.environment) {
              scene.background = new THREE.Color("#181a1b"); // zinc-900 like, a very dark neutral
            }
          }}
        >
          <Suspense fallback={null}>
            {SceneComponent && (
              <SceneComponent
                shapes={shapes}
                loadedGltfObjects={loadedGltfObjects}
                selectedShapeId={selectedShapeId}
                mode={mode}
                onShapeClick={onShapeClick}
                onShapeUpdate={onShapeUpdate}
                orbitControlsEnabled={orbitControlsEnabled}
                sceneRef={sceneRef}
                isAnimating={isAnimating}
                animationClips={animationClips}
                selectedAnimationClipIndex={selectedAnimationClipIndex}
                animationPlaybackState={animationPlaybackState}
                isAnimationLooping={isAnimationLooping}
                animationPlaybackSpeed={animationPlaybackSpeed}
                animationTime={animationTime}
                playAllAnimations={playAllAnimations}
              />
            )}
            {CameraControllerComponent && (
              <CameraControllerComponent preset={cameraPreset} />
            )}
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
};

export default CanvasView;
