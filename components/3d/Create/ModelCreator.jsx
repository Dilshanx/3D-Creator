// // Model3DCreator.jsx
// import {
//   useState,
//   useRef,
//   useCallback,
//   // Suspense removed as it's handled by SceneElements/CanvasView
//   // useMemo removed as cameraPresets moved to SceneElements
//   useEffect,
// } from "react";
// import * as THREE from "three"; // Keep for export scene setup

// import { TooltipProvider } from "@/components/ui/tooltip";

// // Import child components
// import PropertiesPanel from "./PropertiesPanel";
// import EditorSidebar from "./EditorSidebar";
// import EditorToolbar from "./EditorToolbar";
// import CanvasView from "./CanvasView";
// import StatusBar from "./StatusBar";
// import FallbackCreator from "./FallbackCreator";

// // Import R3F components and 3D utils from SceneElements
// import {
//   MainScene,
//   CameraController,
//   createMeshFromShape, // For export logic
//   exportToGLB, // For export logic
// } from "./SceneElements";

// // Conditional import for R3F Canvas (only for the initial check for FallbackCreator)
// let R3FCanvasCheck;
// try {
//   const r3f = require("@react-three/fiber");
//   R3FCanvasCheck = r3f.Canvas;
// } catch (error) {
//   // Error handled by FallbackCreator
// }

// // Main Application Component
// export default function Model3DCreator() {
//   if (!R3FCanvasCheck) return <FallbackCreator />;

//   const [shapes, setShapes] = useState([]);
//   const [selectedShapeId, setSelectedShapeId] = useState(null);
//   const [mode, setMode] = useState("translate");
//   const [undoStack, setUndoStack] = useState([]);
//   const [redoStack, setRedoStack] = useState([]);
//   const [cameraPreset, setCameraPreset] = useState(null);
//   const sceneRef = useRef(null);

//   const selectedShape = shapes.find((shape) => shape.id === selectedShapeId);

//   const saveState = useCallback(() => {
//     const state = shapes.map((shape) => ({
//       ...shape,
//       position: [...shape.position],
//       rotation: [...shape.rotation],
//       scale: [...shape.scale],
//     }));
//     setUndoStack((prev) => [...prev, state]);
//     setRedoStack([]);
//   }, [shapes]);

//   const addShape = useCallback(
//     (geometryType, options = {}) => {
//       const newShapeBase = {
//         id: Date.now().toString(),
//         geometry: geometryType,
//         material: "standard",
//         color: `#${Math.floor(Math.random() * 16777215)
//           .toString(16)
//           .padStart(6, "0")}`,
//         position: [
//           (Math.random() - 0.5) * 3,
//           (options.shapeSize || 1) * 0.5, // Attempt to place on ground based on size
//           (Math.random() - 0.5) * 3,
//         ],
//         rotation: [0, 0, 0],
//         scale: [1, 1, 1],
//       };

//       let specificProps = {};
//       if (geometryType === "text") {
//         specificProps = {
//           text: "Text",
//           textSize: 0.5,
//         };
//       } else if (geometryType === "customExtruded") {
//         specificProps = {
//           shapeType: options.shapeType || "heart",
//           shapeSize: options.shapeSize || 1,
//           extrudeDepth: options.extrudeDepth || 0.2,
//         };
//         // Adjust Y position for custom extruded shapes if centered
//         newShapeBase.position[1] =
//           (specificProps.shapeSize / 2) * newShapeBase.scale[1];
//       }

//       const newShape = { ...newShapeBase, ...specificProps };

//       setShapes((prev) => [...prev, newShape]);
//       setSelectedShapeId(newShape.id);
//       saveState();
//     },
//     [saveState]
//   );

//   const removeShape = useCallback(
//     (shapeId) => {
//       saveState();
//       setShapes((prev) => prev.filter((shape) => shape.id !== shapeId));
//       if (selectedShapeId === shapeId) setSelectedShapeId(null);
//     },
//     [selectedShapeId, saveState]
//   );

//   const duplicateShape = useCallback(() => {
//     if (!selectedShape) return;
//     const duplicated = {
//       ...selectedShape,
//       id: Date.now().toString(),
//       position: [
//         selectedShape.position[0] + 0.5,
//         selectedShape.position[1],
//         selectedShape.position[2],
//       ],
//     };
//     saveState();
//     setShapes((prev) => [...prev, duplicated]);
//     setSelectedShapeId(duplicated.id);
//   }, [selectedShape, saveState]);

//   const updateShape = useCallback((shapeId, updates) => {
//     setShapes((prev) =>
//       prev.map((shape) =>
//         shape.id === shapeId ? { ...shape, ...updates } : shape
//       )
//     );
//   }, []);

//   const handleShapeClick = useCallback((shapeId) => {
//     setSelectedShapeId(shapeId);
//   }, []);

//   const handleShapeUpdateFromTransformControls = useCallback(
//     (shapeId) => {
//       if (sceneRef.current && selectedShapeId) {
//         const currentSelectedShape = shapes.find(
//           (s) => s.id === selectedShapeId
//         );
//         if (!currentSelectedShape) return;

//         const threeObject = sceneRef.current.getObjectByName(
//           // Ensure name includes shapeType for custom shapes
//           `shape_${currentSelectedShape.id}_${currentSelectedShape.geometry}_${
//             currentSelectedShape.shapeType || ""
//           }`
//         );
//         if (threeObject) {
//           const newUpdates = {
//             position: [
//               threeObject.position.x,
//               threeObject.position.y,
//               threeObject.position.z,
//             ],
//             rotation: [
//               threeObject.rotation.x,
//               threeObject.rotation.y,
//               threeObject.rotation.z,
//             ],
//             scale: [
//               threeObject.scale.x,
//               threeObject.scale.y,
//               threeObject.scale.z,
//             ],
//           };
//           setShapes((prevShapes) =>
//             prevShapes.map((s) =>
//               s.id === shapeId ? { ...s, ...newUpdates } : s
//             )
//           );
//           saveState();
//         } else {
//           console.warn(
//             `Could not find THREE object for shape ID ${shapeId} to update from TransformControls.`
//           );
//         }
//       }
//     },
//     [selectedShapeId, shapes, saveState]
//   );

//   const setCameraView = useCallback((preset) => {
//     setCameraPreset(preset);
//     setTimeout(() => setCameraPreset(null), 100);
//   }, []);

//   const undo = useCallback(() => {
//     if (undoStack.length === 0) return;
//     const prevStates = [...undoStack];
//     const stateToRestore = prevStates.pop();
//     setUndoStack(prevStates);
//     setRedoStack((prev) => [shapes, ...prev]);
//     setShapes(stateToRestore);
//     setSelectedShapeId(null);
//   }, [undoStack, shapes]);

//   const redo = useCallback(() => {
//     if (redoStack.length === 0) return;
//     const nextStates = [...redoStack];
//     const stateToRestore = nextStates.shift();
//     setRedoStack(nextStates);
//     setUndoStack((prev) => [...prev, shapes]);
//     setShapes(stateToRestore);
//     setSelectedShapeId(null);
//   }, [redoStack, shapes]);

//   const exportGLBFile = useCallback(() => {
//     if (!sceneRef.current || shapes.length === 0) {
//       alert(shapes.length === 0 ? "No shapes to export." : "Scene not ready.");
//       return;
//     }
//     try {
//       const exportScene = new THREE.Scene();
//       const lights = [
//         new THREE.AmbientLight(0xffffff, 0.4),
//         new THREE.DirectionalLight(0xffffff, 1.0),
//       ];
//       lights[1].position.set(10, 10, 5);
//       lights[1].castShadow = true;
//       lights.forEach((l) => exportScene.add(l));
//       let exportedCount = 0;
//       shapes.forEach((shape) => {
//         const mesh = createMeshFromShape(shape);
//         if (mesh) {
//           exportScene.add(mesh);
//           exportedCount++;
//         }
//       });
//       if (exportedCount === 0) {
//         alert("No valid shapes to export.");
//         return;
//       }
//       exportToGLB(exportScene, `3d-model-${Date.now()}.glb`);
//     } catch (error) {
//       console.error("Export failed:", error);
//       alert("Export failed: " + error.message);
//     }
//   }, [shapes]);

//   const exportJSON = useCallback(() => {
//     if (shapes.length === 0) {
//       alert("No shapes to export.");
//       return;
//     }
//     try {
//       const sceneData = {
//         metadata: {
//           version: "1.0",
//           type: "3D Model Creator Export",
//           generator: "React Three Fiber",
//           created: new Date().toISOString(),
//         },
//         shapes: shapes.map((s) => ({
//           id: s.id,
//           geometry: s.geometry, // Ensure this is correct
//           material: s.material,
//           color: s.color,
//           position: s.position,
//           rotation: s.rotation,
//           scale: s.scale,
//           text: s.text,
//           textSize: s.textSize,
//           shapeType: s.shapeType, // Include for custom shapes
//           shapeSize: s.shapeSize,
//           extrudeDepth: s.extrudeDepth,
//         })),
//         scene: {
//           background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//           totalShapes: shapes.length,
//         },
//       };
//       const blob = new Blob([JSON.stringify(sceneData, null, 2)], {
//         type: "application/json",
//       });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `3d-model-${Date.now()}.json`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
//       alert(`Exported ${shapes.length} shapes to JSON!`);
//     } catch (error) {
//       console.error("Export failed:", error);
//       alert("Export failed.");
//     }
//   }, [shapes]);

//   const editorSidebarShapeOptions = [
//     // For the primitive shapes tab
//     { name: "Cube", geometry: "box", icon: "🧊" },
//     { name: "Sphere", geometry: "sphere", icon: "⚪" },
//     { name: "Cylinder", geometry: "cylinder", icon: "🥫" },
//     { name: "Cone", geometry: "cone", icon: "🔺" },
//     { name: "Torus", geometry: "torus", icon: "🍩" },
//     { name: "Pyramid", geometry: "pyramid", icon: "🔺" },
//     { name: "3D Text", geometry: "text", icon: "📝" },
//   ];

//   const updateShapeAndSave = useCallback(
//     (shapeId, updates) => {
//       updateShape(shapeId, updates);
//       saveState();
//     },
//     [updateShape, saveState]
//   );

//   return (
//     <TooltipProvider>
//       <div className='flex flex-col h-screen bg-gradient-to-br from-background via-muted/20 to-background'>
//         <EditorToolbar
//           undo={undo}
//           redo={redo}
//           undoStackLength={undoStack.length}
//           redoStackLength={redoStack.length}
//           exportJSON={exportJSON}
//           exportGLBFile={exportGLBFile}
//         />

//         <div className='flex flex-grow min-h-0'>
//           <EditorSidebar
//             mode={mode}
//             setMode={setMode}
//             addShape={addShape}
//             setCameraView={setCameraView}
//             shapeOptions={editorSidebarShapeOptions}
//           />

//           <CanvasView
//             shapes={shapes}
//             selectedShapeId={selectedShapeId}
//             mode={mode}
//             onShapeClick={handleShapeClick}
//             onShapeUpdate={handleShapeUpdateFromTransformControls}
//             orbitControlsEnabled={true}
//             sceneRef={sceneRef}
//             cameraPreset={cameraPreset}
//             selectedShape={selectedShape}
//             setSelectedShapeId={setSelectedShapeId}
//             SceneComponent={MainScene}
//             CameraControllerComponent={CameraController}
//           />

//           <PropertiesPanel
//             selectedShape={selectedShape}
//             updateShape={updateShapeAndSave}
//             removeShape={removeShape}
//             duplicateShape={duplicateShape}
//             addShape={addShape}
//           />
//         </div>

//         <StatusBar shapesCount={shapes.length} selectedShape={selectedShape} />
//       </div>
//     </TooltipProvider>
//   );
// }

// Model3DCreator.jsx
import { useState, useRef, useCallback, useEffect } from "react";
import * as THREE from "three";

import { TooltipProvider } from "@/components/ui/tooltip";

import PropertiesPanel from "./PropertiesPanel";
import EditorSidebar from "./EditorSidebar";
import EditorToolbar from "./EditorToolbar";
import CanvasView from "./CanvasView";
import StatusBar from "./StatusBar";
import FallbackCreator from "./FallbackCreator";

import {
  MainScene,
  CameraController,
  createMeshFromShape,
  exportToGLB,
} from "./SceneElements"; // Ensure SceneElements is in the same directory or update path

// Conditional import for R3F Canvas (only for the initial check for FallbackCreator)
let R3FCanvasCheck;
try {
  const r3f = require("@react-three/fiber");
  R3FCanvasCheck = r3f.Canvas;
} catch (error) {
  // Error handled by FallbackCreator
}

export default function Model3DCreator() {
  if (!R3FCanvasCheck) return <FallbackCreator />;

  const [shapes, setShapes] = useState([]);
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [mode, setMode] = useState("translate");
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [cameraPreset, setCameraPreset] = useState(null);
  const sceneRef = useRef(null); // This ref will hold the THREE.Scene instance from R3F

  const selectedShape = shapes.find((shape) => shape.id === selectedShapeId);

  const saveState = useCallback(() => {
    const state = shapes.map((shape) => ({
      ...shape,
      position: [...shape.position],
      rotation: [...shape.rotation],
      scale: [...shape.scale],
    }));
    setUndoStack((prev) => [...prev, state]);
    setRedoStack([]);
  }, [shapes]);

  const addShape = useCallback(
    (geometryType, options = {}) => {
      const newShapeBase = {
        id: Date.now().toString(),
        geometry: geometryType,
        material: "standard", // Default to PBR standard material
        color: `#${Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")}`,
        position: [
          (Math.random() - 0.5) * 3,
          (options.shapeSize || 1) * 0.5,
          (Math.random() - 0.5) * 3,
        ],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        roughness: 0.5, // Default PBR property
        metalness: 0.0, // Default PBR property
      };

      let specificProps = {};
      if (geometryType === "text") {
        specificProps = {
          text: "Text",
          textSize: 0.5,
        };
      } else if (geometryType === "customExtruded") {
        specificProps = {
          shapeType: options.shapeType || "heart",
          shapeSize: options.shapeSize || 1,
          extrudeDepth: options.extrudeDepth || 0.2,
        };
        newShapeBase.position[1] =
          (specificProps.shapeSize / 2) * newShapeBase.scale[1];
      }

      const newShape = { ...newShapeBase, ...specificProps };

      saveState(); // Save state *before* adding the new shape
      setShapes((prev) => [...prev, newShape]);
      setSelectedShapeId(newShape.id);
    },
    [saveState] // Removed 'shapes' from dependencies as saveState already includes it
  );

  const removeShape = useCallback(
    (shapeId) => {
      saveState();
      setShapes((prev) => prev.filter((shape) => shape.id !== shapeId));
      if (selectedShapeId === shapeId) setSelectedShapeId(null);
    },
    [selectedShapeId, saveState]
  );

  const duplicateShape = useCallback(() => {
    if (!selectedShape) return;
    const duplicated = {
      ...selectedShape,
      id: Date.now().toString(),
      position: [
        selectedShape.position[0] + 0.5,
        selectedShape.position[1],
        selectedShape.position[2] + 0.5, // Offset a bit more
      ],
    };
    saveState();
    setShapes((prev) => [...prev, duplicated]);
    setSelectedShapeId(duplicated.id);
  }, [selectedShape, saveState]);

  const updateShape = useCallback((shapeId, updates) => {
    // Note: This function itself doesn't call saveState.
    // The caller (e.g., updateShapeAndSave) is responsible for that.
    setShapes((prev) =>
      prev.map((shape) =>
        shape.id === shapeId ? { ...shape, ...updates } : shape
      )
    );
  }, []);

  const updateShapeAndSave = useCallback(
    (shapeId, updates) => {
      saveState(); // Save current state before applying updates
      updateShape(shapeId, updates);
    },
    [updateShape, saveState]
  );

  const handleShapeClick = useCallback((shapeId) => {
    setSelectedShapeId(shapeId);
  }, []);

  const handleShapeUpdateFromTransformControls = useCallback(
    (shapeId) => {
      if (sceneRef.current && selectedShapeId) {
        const currentSelectedShape = shapes.find(
          (s) => s.id === selectedShapeId
        ); // Use selectedShapeId for consistency
        if (!currentSelectedShape || shapeId !== selectedShapeId) return;

        // Construct the precise name used in SceneElements.jsx
        const objectName = `shape_${currentSelectedShape.id}_${
          currentSelectedShape.geometry
        }_${currentSelectedShape.shapeType || ""}`;

        const threeObject = sceneRef.current.getObjectByName(objectName);

        if (threeObject) {
          const newUpdates = {
            position: [
              threeObject.position.x,
              threeObject.position.y,
              threeObject.position.z,
            ],
            rotation: [
              threeObject.rotation.x,
              threeObject.rotation.y,
              threeObject.rotation.z,
            ],
            scale: [
              threeObject.scale.x,
              threeObject.scale.y,
              threeObject.scale.z,
            ],
          };
          // Here, we directly update the shape based on TransformControls.
          // And then we save this new state.
          saveState(); // Save state before this specific update
          setShapes((prevShapes) =>
            prevShapes.map((s) =>
              s.id === shapeId ? { ...s, ...newUpdates } : s
            )
          );
        } else {
          console.warn(
            `Could not find THREE object named "${objectName}" to update from TransformControls.`
          );
        }
      }
    },
    [selectedShapeId, shapes, saveState] // sceneRef is stable
  );

  const setCameraView = useCallback((preset) => {
    setCameraPreset(preset);
    setTimeout(() => setCameraPreset(null), 100); // Auto-clear preset
  }, []);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    const prevStates = [...undoStack];
    const stateToRestore = prevStates.pop();

    // Current state becomes the new redo state
    setRedoStack((prevRedo) => [
      shapes.map((s) => ({ ...s })), // Deep copy current shapes for redo
      ...prevRedo,
    ]);
    setUndoStack(prevStates);
    setShapes(stateToRestore);
    setSelectedShapeId(null);
  }, [undoStack, shapes]); // Added 'shapes' for redoStack

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const nextStates = [...redoStack];
    const stateToRestore = nextStates.shift();

    // Current state becomes the new undo state
    setUndoStack((prevUndo) => [
      shapes.map((s) => ({ ...s })), // Deep copy current shapes for undo
      ...prevUndo,
    ]);
    setRedoStack(nextStates);
    setShapes(stateToRestore);
    setSelectedShapeId(null);
  }, [redoStack, shapes]); // Added 'shapes' for undoStack

  const exportGLBFile = useCallback(() => {
    if (!sceneRef.current || shapes.length === 0) {
      alert(shapes.length === 0 ? "No shapes to export." : "Scene not ready.");
      return;
    }
    try {
      // Create a new scene for export to avoid exporting helper objects like grids etc.
      const exportScene = new THREE.Scene();

      // Add lights to the export scene (similar to render scene lights)
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Match scene's ambient
      exportScene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // Match scene's directional
      directionalLight.position.set(10, 10, 5);
      // GLTFExporter does not export shadow properties of lights directly.
      // Shadows are baked or handled by the rendering engine importing the GLB.
      exportScene.add(directionalLight);

      let exportedCount = 0;
      shapes.forEach((shape) => {
        // createMeshFromShape now includes PBR properties (roughness, metalness)
        const mesh = createMeshFromShape(shape);
        if (mesh) {
          exportScene.add(mesh);
          exportedCount++;
        }
      });

      if (exportedCount === 0) {
        alert("No valid shapes to export.");
        return;
      }
      exportToGLB(exportScene, `pbr-model-${Date.now()}.glb`);
    } catch (error) {
      console.error("GLB Export failed:", error);
      alert("GLB Export failed: " + error.message);
    }
  }, [shapes]); // sceneRef is stable

  const exportJSON = useCallback(() => {
    if (shapes.length === 0) {
      alert("No shapes to export.");
      return;
    }
    try {
      const sceneData = {
        metadata: {
          version: "2.1", // Updated version
          type: "PBR Model Creator Export",
          generator: "React Three Fiber",
          created: new Date().toISOString(),
        },
        shapes: shapes.map((s) => ({
          id: s.id,
          geometry: s.geometry,
          material: s.material,
          color: s.color,
          position: s.position,
          rotation: s.rotation,
          scale: s.scale,
          text: s.text,
          textSize: s.textSize,
          shapeType: s.shapeType,
          shapeSize: s.shapeSize,
          extrudeDepth: s.extrudeDepth,
          roughness: s.roughness, // Added PBR property
          metalness: s.metalness, // Added PBR property
        })),
        scene: {
          // Note: Canvas background is a CSS gradient, R3F scene bg is HDR/color
          canvasBackground: "linear-gradient(135deg, #1e1e2f 0%, #3c3c58 100%)",
          environment: "environment.hdr", // Indication of HDR usage
          totalShapes: shapes.length,
        },
      };
      const blob = new Blob([JSON.stringify(sceneData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `pbr-model-scene-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      alert(`Exported ${shapes.length} shapes to JSON!`);
    } catch (error) {
      console.error("JSON Export failed:", error);
      alert("JSON Export failed: " + error.message);
    }
  }, [shapes]);

  const editorSidebarShapeOptions = [
    { name: "Cube", geometry: "box", icon: "🧊" },
    { name: "Sphere", geometry: "sphere", icon: "⚪" },
    { name: "Cylinder", geometry: "cylinder", icon: "🥫" },
    { name: "Cone", geometry: "cone", icon: "🔺" },
    { name: "Torus", geometry: "torus", icon: "🍩" },
    { name: "Pyramid", geometry: "pyramid", icon: "🔺" },
    { name: "3D Text", geometry: "text", icon: "📝" },
  ];

  // Keyboard shortcuts for transform modes
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
      ) {
        return; // Don't interfere with text input
      }
      switch (event.key.toLowerCase()) {
        case "w":
          setMode("translate");
          break;
        case "e":
          setMode("rotate");
          break;
        case "r":
          setMode("scale");
          break;
        case "q": // Example: Could be used for toggling orbit controls or another mode
          // setOrbitControlsEnabled(prev => !prev);
          break;
        case "delete":
        case "backspace":
          if (selectedShapeId) {
            removeShape(selectedShapeId);
          }
          break;
        case "control": // For Ctrl+Z, Ctrl+Y, handled by OS/Browser for input, manual for app
          break;
        default:
          break;
      }
      // Undo/Redo
      if (event.ctrlKey || event.metaKey) {
        if (event.key.toLowerCase() === "z") {
          undo();
        } else if (event.key.toLowerCase() === "y") {
          redo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedShapeId, removeShape, undo, redo]);

  return (
    <TooltipProvider>
      <div className='flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-foreground'>
        <EditorToolbar
          undo={undo}
          redo={redo}
          undoStackLength={undoStack.length}
          redoStackLength={redoStack.length}
          exportJSON={exportJSON}
          exportGLBFile={exportGLBFile}
        />

        <div className='flex flex-grow min-h-0'>
          <EditorSidebar
            mode={mode}
            setMode={setMode}
            addShape={addShape}
            setCameraView={setCameraView}
            shapeOptions={editorSidebarShapeOptions}
          />

          <CanvasView
            shapes={shapes}
            selectedShapeId={selectedShapeId}
            mode={mode}
            onShapeClick={handleShapeClick}
            onShapeUpdate={handleShapeUpdateFromTransformControls}
            orbitControlsEnabled={true} // Assuming always enabled when a shape is not being transformed
            sceneRef={sceneRef}
            cameraPreset={cameraPreset}
            selectedShape={selectedShape}
            setSelectedShapeId={setSelectedShapeId}
            SceneComponent={MainScene}
            CameraControllerComponent={CameraController}
          />

          <PropertiesPanel
            selectedShape={selectedShape}
            updateShape={updateShapeAndSave} // Use the wrapper that saves state
            removeShape={removeShape}
            duplicateShape={duplicateShape}
            addShape={addShape} // Pass addShape for "Add Shape" buttons in empty state
          />
        </div>

        <StatusBar shapesCount={shapes.length} selectedShape={selectedShape} />
      </div>
    </TooltipProvider>
  );
}
