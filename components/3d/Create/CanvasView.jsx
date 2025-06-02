// import React, { Suspense } from "react";
// import ErrorBoundary from "./ErrorBoundary";

// let Canvas;
// try {
//   const r3f = require("@react-three/fiber");
//   Canvas = r3f.Canvas;
// } catch (e) {
//   // Fallback handled in Model3DCreator
// }

// const CanvasView = ({
//   shapes,
//   loadedGltfObjects,
//   selectedShapeId,
//   mode,
//   onShapeClick,
//   onShapeUpdate,
//   orbitControlsEnabled,
//   sceneRef,
//   cameraPreset,
//   selectedShape,
//   setSelectedShapeId,
//   SceneComponent,
//   CameraControllerComponent,
//   isAnimating,
//   onDropOnCanvas,
//   animationClips,
//   selectedAnimationClipIndex,
//   animationPlaybackState,
//   isAnimationLooping,
//   animationPlaybackSpeed,
//   animationTime,
//   playAllAnimations,
// }) => {
//   if (!Canvas) {
//     return (
//       <div className='flex-grow bg-slate-700 flex items-center justify-center text-red-400 p-4'>
//         Error: @react-three/fiber Canvas component is not available.
//       </div>
//     );
//   }

//   const handleCanvasClick = (event) => {
//     if (event.target === event.currentTarget) {
//       setSelectedShapeId(null);
//     }
//   };

//   return (
//     <div
//       className='flex-grow bg-gradient-to-br from-slate-700 via-slate-800 to-gray-800 relative'
//       onDrop={onDropOnCanvas}
//       onDragOver={(e) => e.preventDefault()}
//       onClick={handleCanvasClick}
//     >
//       <ErrorBoundary
//         fallback={
//           <div className='h-full w-full flex items-center justify-center bg-red-100 text-red-700 p-4'>
//             {" "}
//             3D Canvas Error! Check console.{" "}
//           </div>
//         }
//       >
//         <Canvas
//           shadows
//           camera={{ position: [5, 5, 10], fov: 50, near: 0.1, far: 1000 }}
//           gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
//         >
//           <Suspense
//             fallback={
//               <mesh>
//                 {" "}
//                 <boxGeometry args={[1, 1, 1]} />{" "}
//                 <meshStandardMaterial color='orange' wireframe />{" "}
//               </mesh>
//             }
//           >
//             <SceneComponent
//               shapes={shapes}
//               loadedGltfObjects={loadedGltfObjects}
//               selectedShapeId={selectedShapeId}
//               mode={mode}
//               onShapeClick={onShapeClick}
//               onShapeUpdate={onShapeUpdate}
//               orbitControlsEnabled={orbitControlsEnabled}
//               sceneRef={sceneRef}
//               isAnimating={isAnimating}
//               animationClips={animationClips} // Pass through
//               selectedAnimationClipIndex={selectedAnimationClipIndex}
//               animationPlaybackState={animationPlaybackState}
//               isAnimationLooping={isAnimationLooping}
//               animationPlaybackSpeed={animationPlaybackSpeed}
//               animationTime={animationTime}
//               playAllAnimations={playAllAnimations}
//             />
//             <CameraControllerComponent preset={cameraPreset} />
//           </Suspense>
//         </Canvas>
//       </ErrorBoundary>
//     </div>
//   );
// };

// export default CanvasView;

import React, { Suspense } from "react"; // Added React import
import ErrorBoundary from "./ErrorBoundary";

let Canvas;
try {
  const r3f = require("@react-three/fiber");
  Canvas = r3f.Canvas;
} catch (e) {
  // Fallback handled elsewhere
}

// Props from Model3DCreator
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
  selectedShape, // Though not directly used, it's part of the context
  setSelectedShapeId, // For deselecting
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
}) => {
  if (!Canvas) {
    return (
      <div className='flex-grow bg-slate-700 flex items-center justify-center text-red-400 p-4'>
        Error: @react-three/fiber Canvas component is not available.
      </div>
    );
  }

  const handleCanvasClick = (event) => {
    // Deselect if clicking on the canvas background (not on a shape/control)
    if (event.target === event.currentTarget) {
      setSelectedShapeId(null);
    }
  };

  return (
    <div
      className='flex-grow bg-gradient-to-br from-slate-700 via-slate-800 to-gray-800 relative cursor-grab active:cursor-grabbing'
      onDrop={onDropOnCanvas}
      onDragOver={(e) => e.preventDefault()} // Necessary for onDrop to work
      onClick={handleCanvasClick} // Handles deselection
    >
      <ErrorBoundary
        fallback={
          <div className='h-full w-full flex items-center justify-center bg-red-100 text-red-700 p-4'>
            3D Canvas Error! Check console.
          </div>
        }
      >
        <Canvas
          shadows
          camera={{ position: [5, 5, 10], fov: 50, near: 0.1, far: 1000 }}
          gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }} // preserveDrawingBuffer for screenshots if needed later
          // onPointerMissed={() => setSelectedShapeId(null)} // Alternative for deselection, but div click is more general
        >
          <Suspense
            fallback={
              // Basic fallback for Suspense during component/asset loading
              <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color='orange' wireframe />
              </mesh>
            }
          >
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
              // Pass GLB animation props through to MainScene
              animationClips={animationClips}
              selectedAnimationClipIndex={selectedAnimationClipIndex}
              animationPlaybackState={animationPlaybackState}
              isAnimationLooping={isAnimationLooping}
              animationPlaybackSpeed={animationPlaybackSpeed}
              animationTime={animationTime}
              playAllAnimations={playAllAnimations}
            />
            <CameraControllerComponent preset={cameraPreset} />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
};

export default CanvasView;
