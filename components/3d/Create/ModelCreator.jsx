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
// import { useState, useRef, useCallback, useEffect } from "react";
// import * as THREE from "three";

// import { TooltipProvider } from "@/components/ui/tooltip";

// import PropertiesPanel from "./PropertiesPanel";
// import EditorSidebar from "./EditorSidebar";
// import EditorToolbar from "./EditorToolbar";
// import CanvasView from "./CanvasView";
// import StatusBar from "./StatusBar";
// import FallbackCreator from "./FallbackCreator";

// import {
//   MainScene,
//   CameraController,
//   createMeshFromShape,
//   exportToGLB,
// } from "./SceneElements"; // Ensure SceneElements is in the same directory or update path

// // Conditional import for R3F Canvas (only for the initial check for FallbackCreator)
// let R3FCanvasCheck;
// try {
//   const r3f = require("@react-three/fiber");
//   R3FCanvasCheck = r3f.Canvas;
// } catch (error) {
//   // Error handled by FallbackCreator
// }

// export default function Model3DCreator() {
//   if (!R3FCanvasCheck) return <FallbackCreator />;

//   const [shapes, setShapes] = useState([]);
//   const [selectedShapeId, setSelectedShapeId] = useState(null);
//   const [mode, setMode] = useState("translate");
//   const [undoStack, setUndoStack] = useState([]);
//   const [redoStack, setRedoStack] = useState([]);
//   const [cameraPreset, setCameraPreset] = useState(null);
//   const sceneRef = useRef(null); // This ref will hold the THREE.Scene instance from R3F

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
//         material: "standard", // Default to PBR standard material
//         color: `#${Math.floor(Math.random() * 16777215)
//           .toString(16)
//           .padStart(6, "0")}`,
//         position: [
//           (Math.random() - 0.5) * 3,
//           (options.shapeSize || 1) * 0.5,
//           (Math.random() - 0.5) * 3,
//         ],
//         rotation: [0, 0, 0],
//         scale: [1, 1, 1],
//         roughness: 0.5, // Default PBR property
//         metalness: 0.0, // Default PBR property
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
//         newShapeBase.position[1] =
//           (specificProps.shapeSize / 2) * newShapeBase.scale[1];
//       }

//       const newShape = { ...newShapeBase, ...specificProps };

//       saveState(); // Save state *before* adding the new shape
//       setShapes((prev) => [...prev, newShape]);
//       setSelectedShapeId(newShape.id);
//     },
//     [saveState] // Removed 'shapes' from dependencies as saveState already includes it
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
//         selectedShape.position[2] + 0.5, // Offset a bit more
//       ],
//     };
//     saveState();
//     setShapes((prev) => [...prev, duplicated]);
//     setSelectedShapeId(duplicated.id);
//   }, [selectedShape, saveState]);

//   const updateShape = useCallback((shapeId, updates) => {
//     // Note: This function itself doesn't call saveState.
//     // The caller (e.g., updateShapeAndSave) is responsible for that.
//     setShapes((prev) =>
//       prev.map((shape) =>
//         shape.id === shapeId ? { ...shape, ...updates } : shape
//       )
//     );
//   }, []);

//   const updateShapeAndSave = useCallback(
//     (shapeId, updates) => {
//       saveState(); // Save current state before applying updates
//       updateShape(shapeId, updates);
//     },
//     [updateShape, saveState]
//   );

//   const handleShapeClick = useCallback((shapeId) => {
//     setSelectedShapeId(shapeId);
//   }, []);

//   const handleShapeUpdateFromTransformControls = useCallback(
//     (shapeId) => {
//       if (sceneRef.current && selectedShapeId) {
//         const currentSelectedShape = shapes.find(
//           (s) => s.id === selectedShapeId
//         ); // Use selectedShapeId for consistency
//         if (!currentSelectedShape || shapeId !== selectedShapeId) return;

//         // Construct the precise name used in SceneElements.jsx
//         const objectName = `shape_${currentSelectedShape.id}_${
//           currentSelectedShape.geometry
//         }_${currentSelectedShape.shapeType || ""}`;

//         const threeObject = sceneRef.current.getObjectByName(objectName);

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
//           // Here, we directly update the shape based on TransformControls.
//           // And then we save this new state.
//           saveState(); // Save state before this specific update
//           setShapes((prevShapes) =>
//             prevShapes.map((s) =>
//               s.id === shapeId ? { ...s, ...newUpdates } : s
//             )
//           );
//         } else {
//           console.warn(
//             `Could not find THREE object named "${objectName}" to update from TransformControls.`
//           );
//         }
//       }
//     },
//     [selectedShapeId, shapes, saveState] // sceneRef is stable
//   );

//   const setCameraView = useCallback((preset) => {
//     setCameraPreset(preset);
//     setTimeout(() => setCameraPreset(null), 100); // Auto-clear preset
//   }, []);

//   const undo = useCallback(() => {
//     if (undoStack.length === 0) return;
//     const prevStates = [...undoStack];
//     const stateToRestore = prevStates.pop();

//     // Current state becomes the new redo state
//     setRedoStack((prevRedo) => [
//       shapes.map((s) => ({ ...s })), // Deep copy current shapes for redo
//       ...prevRedo,
//     ]);
//     setUndoStack(prevStates);
//     setShapes(stateToRestore);
//     setSelectedShapeId(null);
//   }, [undoStack, shapes]); // Added 'shapes' for redoStack

//   const redo = useCallback(() => {
//     if (redoStack.length === 0) return;
//     const nextStates = [...redoStack];
//     const stateToRestore = nextStates.shift();

//     // Current state becomes the new undo state
//     setUndoStack((prevUndo) => [
//       shapes.map((s) => ({ ...s })), // Deep copy current shapes for undo
//       ...prevUndo,
//     ]);
//     setRedoStack(nextStates);
//     setShapes(stateToRestore);
//     setSelectedShapeId(null);
//   }, [redoStack, shapes]); // Added 'shapes' for undoStack

//   const exportGLBFile = useCallback(() => {
//     if (!sceneRef.current || shapes.length === 0) {
//       alert(shapes.length === 0 ? "No shapes to export." : "Scene not ready.");
//       return;
//     }
//     try {
//       // Create a new scene for export to avoid exporting helper objects like grids etc.
//       const exportScene = new THREE.Scene();

//       // Add lights to the export scene (similar to render scene lights)
//       const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Match scene's ambient
//       exportScene.add(ambientLight);
//       const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // Match scene's directional
//       directionalLight.position.set(10, 10, 5);
//       // GLTFExporter does not export shadow properties of lights directly.
//       // Shadows are baked or handled by the rendering engine importing the GLB.
//       exportScene.add(directionalLight);

//       let exportedCount = 0;
//       shapes.forEach((shape) => {
//         // createMeshFromShape now includes PBR properties (roughness, metalness)
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
//       exportToGLB(exportScene, `pbr-model-${Date.now()}.glb`);
//     } catch (error) {
//       console.error("GLB Export failed:", error);
//       alert("GLB Export failed: " + error.message);
//     }
//   }, [shapes]); // sceneRef is stable

//   const exportJSON = useCallback(() => {
//     if (shapes.length === 0) {
//       alert("No shapes to export.");
//       return;
//     }
//     try {
//       const sceneData = {
//         metadata: {
//           version: "2.1", // Updated version
//           type: "PBR Model Creator Export",
//           generator: "React Three Fiber",
//           created: new Date().toISOString(),
//         },
//         shapes: shapes.map((s) => ({
//           id: s.id,
//           geometry: s.geometry,
//           material: s.material,
//           color: s.color,
//           position: s.position,
//           rotation: s.rotation,
//           scale: s.scale,
//           text: s.text,
//           textSize: s.textSize,
//           shapeType: s.shapeType,
//           shapeSize: s.shapeSize,
//           extrudeDepth: s.extrudeDepth,
//           roughness: s.roughness, // Added PBR property
//           metalness: s.metalness, // Added PBR property
//         })),
//         scene: {
//           // Note: Canvas background is a CSS gradient, R3F scene bg is HDR/color
//           canvasBackground: "linear-gradient(135deg, #1e1e2f 0%, #3c3c58 100%)",
//           environment: "environment.hdr", // Indication of HDR usage
//           totalShapes: shapes.length,
//         },
//       };
//       const blob = new Blob([JSON.stringify(sceneData, null, 2)], {
//         type: "application/json",
//       });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `pbr-model-scene-${Date.now()}.json`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
//       alert(`Exported ${shapes.length} shapes to JSON!`);
//     } catch (error) {
//       console.error("JSON Export failed:", error);
//       alert("JSON Export failed: " + error.message);
//     }
//   }, [shapes]);

//   const editorSidebarShapeOptions = [
//     { name: "Cube", geometry: "box", icon: "🧊" },
//     { name: "Sphere", geometry: "sphere", icon: "⚪" },
//     { name: "Cylinder", geometry: "cylinder", icon: "🥫" },
//     { name: "Cone", geometry: "cone", icon: "🔺" },
//     { name: "Torus", geometry: "torus", icon: "🍩" },
//     { name: "Pyramid", geometry: "pyramid", icon: "🔺" },
//     { name: "3D Text", geometry: "text", icon: "📝" },
//   ];

//   // Keyboard shortcuts for transform modes
//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       if (
//         event.target.tagName === "INPUT" ||
//         event.target.tagName === "TEXTAREA"
//       ) {
//         return; // Don't interfere with text input
//       }
//       switch (event.key.toLowerCase()) {
//         case "w":
//           setMode("translate");
//           break;
//         case "e":
//           setMode("rotate");
//           break;
//         case "r":
//           setMode("scale");
//           break;
//         case "q": // Example: Could be used for toggling orbit controls or another mode
//           // setOrbitControlsEnabled(prev => !prev);
//           break;
//         case "delete":
//         case "backspace":
//           if (selectedShapeId) {
//             removeShape(selectedShapeId);
//           }
//           break;
//         case "control": // For Ctrl+Z, Ctrl+Y, handled by OS/Browser for input, manual for app
//           break;
//         default:
//           break;
//       }
//       // Undo/Redo
//       if (event.ctrlKey || event.metaKey) {
//         if (event.key.toLowerCase() === "z") {
//           undo();
//         } else if (event.key.toLowerCase() === "y") {
//           redo();
//         }
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [selectedShapeId, removeShape, undo, redo]);

//   return (
//     <TooltipProvider>
//       <div className='flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-foreground'>
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
//             orbitControlsEnabled={true} // Assuming always enabled when a shape is not being transformed
//             sceneRef={sceneRef}
//             cameraPreset={cameraPreset}
//             selectedShape={selectedShape}
//             setSelectedShapeId={setSelectedShapeId}
//             SceneComponent={MainScene}
//             CameraControllerComponent={CameraController}
//           />

//           <PropertiesPanel
//             selectedShape={selectedShape}
//             updateShape={updateShapeAndSave} // Use the wrapper that saves state
//             removeShape={removeShape}
//             duplicateShape={duplicateShape}
//             addShape={addShape} // Pass addShape for "Add Shape" buttons in empty state
//           />
//         </div>

//         <StatusBar shapesCount={shapes.length} selectedShape={selectedShape} />
//       </div>
//     </TooltipProvider>
//   );
// }

// Model3DCreator.jsx
// import { useState, useRef, useCallback, useEffect } from "react";
// import * as THREE from "three";

// import { TooltipProvider } from "@/components/ui/tooltip";

// import PropertiesPanel from "./PropertiesPanel";
// import EditorSidebar from "./EditorSidebar";
// import EditorToolbar from "./EditorToolbar";
// import CanvasView from "./CanvasView";
// import StatusBar from "./StatusBar";
// import FallbackCreator from "./FallbackCreator";

// import {
//   MainScene,
//   CameraController,
//   createMeshFromShape,
//   exportToGLB,
// } from "./SceneElements"; // Ensure SceneElements is in the same directory or update path

// let R3FCanvasCheck;
// try {
//   const r3f = require("@react-three/fiber");
//   R3FCanvasCheck = r3f.Canvas;
// } catch (error) {
//   // Error handled by FallbackCreator
// }

// export default function Model3DCreator() {
//   if (!R3FCanvasCheck) return <FallbackCreator />;

//   const [shapes, setShapes] = useState([]);
//   const [selectedShapeId, setSelectedShapeId] = useState(null);
//   const [mode, setMode] = useState("translate");
//   const [undoStack, setUndoStack] = useState([]);
//   const [redoStack, setRedoStack] = useState([]);
//   const [cameraPreset, setCameraPreset] = useState(null);
//   const sceneRef = useRef(null);
//   const [isAnimating, setIsAnimating] = useState(true); // Global animation state

//   const selectedShape = shapes.find((shape) => shape.id === selectedShapeId);

//   const saveState = useCallback(() => {
//     const state = shapes.map((shape) => ({
//       ...shape,
//       position: [...shape.position],
//       rotation: [...shape.rotation],
//       scale: [...shape.scale],
//       animation: shape.animation
//         ? {
//             ...shape.animation,
//             orbitCenter: [...(shape.animation.orbitCenter || [0, 0, 0])],
//           }
//         : undefined,
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
//           (options.shapeSize || 1) * 0.5,
//           (Math.random() - 0.5) * 3,
//         ],
//         rotation: [0, 0, 0],
//         scale: [1, 1, 1],
//         roughness: 0.5,
//         metalness: 0.0,
//         animation: {
//           // Default animation properties
//           type: "none", // 'none', 'rotate', 'orbit'
//           speed: 1,
//           axis: "y", // 'x', 'y', 'z' for rotation
//           orbitCenter: [0, 0, 0], // For orbit type
//           orbitRadius: 5, // For orbit type
//           orbitPlane: "xz", // 'xy', 'xz', 'yz' for orbit plane
//         },
//       };

//       let specificProps = {};
//       if (geometryType === "text") {
//         specificProps = { text: "Text", textSize: 0.5 };
//       } else if (geometryType === "customExtruded") {
//         specificProps = {
//           shapeType: options.shapeType || "heart",
//           shapeSize: options.shapeSize || 1,
//           extrudeDepth: options.extrudeDepth || 0.2,
//         };
//         newShapeBase.position[1] =
//           (specificProps.shapeSize / 2) * newShapeBase.scale[1];
//       }

//       const newShape = { ...newShapeBase, ...specificProps };
//       saveState(); // Save state *before* adding the new shape
//       setShapes((prev) => [...prev, newShape]);
//       setSelectedShapeId(newShape.id);
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
//         selectedShape.position[2] + 0.5,
//       ],
//       animation: selectedShape.animation
//         ? {
//             // Deep copy animation object
//             ...selectedShape.animation,
//             orbitCenter: selectedShape.animation.orbitCenter
//               ? [...selectedShape.animation.orbitCenter]
//               : [0, 0, 0],
//           }
//         : undefined,
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

//   const updateShapeAndSave = useCallback(
//     (shapeId, updates) => {
//       saveState();
//       updateShape(shapeId, updates);
//     },
//     [updateShape, saveState]
//   );

//   const handleShapeClick = useCallback((shapeId) => {
//     setSelectedShapeId(shapeId);
//   }, []);

//   const handleShapeUpdateFromTransformControls = useCallback(
//     (shapeId) => {
//       if (sceneRef.current && selectedShapeId) {
//         const currentSelectedShape = shapes.find(
//           (s) => s.id === selectedShapeId
//         );
//         if (!currentSelectedShape || shapeId !== selectedShapeId) return;

//         const objectName = `shape_${currentSelectedShape.id}_${
//           currentSelectedShape.geometry
//         }_${currentSelectedShape.shapeType || ""}`;
//         const threeObject = sceneRef.current.getObjectByName(objectName);

//         if (threeObject) {
//           saveState(); // Save state before this specific update
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
//         } else {
//           console.warn(
//             `Could not find THREE object named "${objectName}" to update from TransformControls.`
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
//     setRedoStack((prevRedo) => [
//       shapes.map((s) => ({
//         ...s,
//         animation: s.animation
//           ? {
//               ...s.animation,
//               orbitCenter: [...(s.animation.orbitCenter || [0, 0, 0])],
//             }
//           : undefined,
//       })),
//       ...prevRedo,
//     ]);
//     setUndoStack(prevStates);
//     setShapes(stateToRestore);
//     setSelectedShapeId(null);
//   }, [undoStack, shapes]);

//   const redo = useCallback(() => {
//     if (redoStack.length === 0) return;
//     const nextStates = [...redoStack];
//     const stateToRestore = nextStates.shift();
//     setUndoStack((prevUndo) => [
//       shapes.map((s) => ({
//         ...s,
//         animation: s.animation
//           ? {
//               ...s.animation,
//               orbitCenter: [...(s.animation.orbitCenter || [0, 0, 0])],
//             }
//           : undefined,
//       })),
//       ...prevUndo,
//     ]);
//     setRedoStack(nextStates);
//     setShapes(stateToRestore);
//     setSelectedShapeId(null);
//   }, [redoStack, shapes]);

//   const exportGLBFile = useCallback(() => {
//     /* ... (no change needed for animation) ... */
//   }, [shapes]);

//   const exportJSON = useCallback(() => {
//     if (shapes.length === 0) {
//       alert("No shapes to export.");
//       return;
//     }
//     try {
//       const sceneData = {
//         metadata: {
//           version: "2.2", // Updated version for animation
//           type: "PBR Model Creator Export with Animation",
//           generator: "React Three Fiber",
//           created: new Date().toISOString(),
//         },
//         shapes: shapes.map((s) => ({
//           id: s.id,
//           geometry: s.geometry,
//           material: s.material,
//           color: s.color,
//           position: s.position,
//           rotation: s.rotation,
//           scale: s.scale,
//           text: s.text,
//           textSize: s.textSize,
//           shapeType: s.shapeType,
//           shapeSize: s.shapeSize,
//           extrudeDepth: s.extrudeDepth,
//           roughness: s.roughness,
//           metalness: s.metalness,
//           animation: s.animation
//             ? {
//                 ...s.animation,
//                 orbitCenter: s.animation.orbitCenter
//                   ? [...s.animation.orbitCenter]
//                   : [0, 0, 0],
//               }
//             : undefined, // Export animation state
//         })),
//         scene: {
//           canvasBackground: "linear-gradient(135deg, #1e1e2f 0%, #3c3c58 100%)",
//           environment: "environment.hdr",
//           totalShapes: shapes.length,
//         },
//       };
//       const blob = new Blob([JSON.stringify(sceneData, null, 2)], {
//         type: "application/json",
//       });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `pbr-model-scene-animated-${Date.now()}.json`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
//       alert(`Exported ${shapes.length} shapes to JSON!`);
//     } catch (error) {
//       console.error("JSON Export failed:", error);
//       alert("JSON Export failed: " + error.message);
//     }
//   }, [shapes]);

//   const editorSidebarShapeOptions = [
//     { name: "Cube", geometry: "box", icon: "🧊" },
//     { name: "Sphere", geometry: "sphere", icon: "⚪" },
//     { name: "Cylinder", geometry: "cylinder", icon: "🥫" },
//     { name: "Cone", geometry: "cone", icon: "🔺" },
//     { name: "Torus", geometry: "torus", icon: "🍩" },
//     { name: "Pyramid", geometry: "pyramid", icon: "🔺" },
//     { name: "3D Text", geometry: "text", icon: "📝" },
//   ];

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       if (
//         event.target.tagName === "INPUT" ||
//         event.target.tagName === "TEXTAREA"
//       )
//         return;
//       switch (event.key.toLowerCase()) {
//         case "w":
//           setMode("translate");
//           break;
//         case "e":
//           setMode("rotate");
//           break;
//         case "r":
//           setMode("scale");
//           break;
//         case "delete":
//         case "backspace":
//           if (selectedShapeId) removeShape(selectedShapeId);
//           break;
//         case "p":
//           setIsAnimating((prev) => !prev);
//           break; // 'P' to play/pause
//         default:
//           break;
//       }
//       if (event.ctrlKey || event.metaKey) {
//         if (event.key.toLowerCase() === "z") undo();
//         else if (event.key.toLowerCase() === "y") redo();
//         else if (event.key.toLowerCase() === "d" && selectedShapeId) {
//           event.preventDefault();
//           duplicateShape();
//         } // Ctrl+D
//       }
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [selectedShapeId, removeShape, undo, redo, duplicateShape]);

//   const toggleGlobalAnimation = useCallback(() => {
//     setIsAnimating((prev) => !prev);
//   }, []);

//   return (
//     <TooltipProvider>
//       <div className='flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-foreground'>
//         <EditorToolbar
//           undo={undo}
//           redo={redo}
//           undoStackLength={undoStack.length}
//           redoStackLength={redoStack.length}
//           exportJSON={exportJSON}
//           exportGLBFile={exportGLBFile}
//           isAnimating={isAnimating}
//           toggleGlobalAnimation={toggleGlobalAnimation}
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
//             orbitControlsEnabled={
//               !isAnimating ||
//               !selectedShape?.animation ||
//               selectedShape.animation.type === "none"
//             } // Disable orbit if globally animating and selected shape has animation
//             sceneRef={sceneRef}
//             cameraPreset={cameraPreset}
//             selectedShape={selectedShape}
//             setSelectedShapeId={setSelectedShapeId}
//             SceneComponent={MainScene}
//             CameraControllerComponent={CameraController}
//             isAnimating={isAnimating}
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
// import { useState, useRef, useCallback, useEffect } from "react";
// import * as THREE from "three";

// import { TooltipProvider } from "@/components/ui/tooltip";

// import PropertiesPanel from "./PropertiesPanel";
// import EditorSidebar from "./EditorSidebar";
// import EditorToolbar from "./EditorToolbar";
// import CanvasView from "./CanvasView";
// import StatusBar from "./StatusBar";
// import FallbackCreator from "./FallbackCreator";

// import {
//   MainScene,
//   CameraController,
//   createMeshFromShape, // For export logic
//   exportToGLB, // For export logic
// } from "./SceneElements";

// let R3FCanvasCheck;
// try {
//   const r3f = require("@react-three/fiber");
//   R3FCanvasCheck = r3f.Canvas;
// } catch (error) {
//   // Error handled by FallbackCreator
// }

// export default function Model3DCreator() {
//   if (!R3FCanvasCheck) return <FallbackCreator />;

//   const [shapes, setShapes] = useState([]);
//   const [selectedShapeId, setSelectedShapeId] = useState(null);
//   const [mode, setMode] = useState("translate");
//   const [undoStack, setUndoStack] = useState([]);
//   const [redoStack, setRedoStack] = useState([]);
//   const [cameraPreset, setCameraPreset] = useState(null);
//   const sceneRef = useRef(null);
//   const [isAnimating, setIsAnimating] = useState(true);

//   const selectedShape = shapes.find((shape) => shape.id === selectedShapeId);

//   const saveState = useCallback(() => {
//     const state = shapes.map((shape) => ({
//       ...shape,
//       position: [...shape.position],
//       rotation: [...shape.rotation],
//       scale: [...shape.scale],
//       animation: shape.animation
//         ? {
//             ...shape.animation,
//             orbitCenter: [...(shape.animation.orbitCenter || [0, 0, 0])],
//           }
//         : undefined,
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
//           (options.shapeSize || 1) * 0.5,
//           (Math.random() - 0.5) * 3,
//         ],
//         rotation: [0, 0, 0],
//         scale: [1, 1, 1],
//         roughness: 0.5,
//         metalness: 0.0,
//         animation: {
//           type: "none",
//           speed: 1,
//           axis: "y",
//           orbitCenter: [0, 0, 0],
//           orbitRadius: 5,
//           orbitPlane: "xz",
//         },
//       };
//       let specificProps = {};
//       if (geometryType === "text") {
//         specificProps = { text: "Text", textSize: 0.5 };
//       } else if (geometryType === "customExtruded") {
//         specificProps = {
//           shapeType: options.shapeType || "heart",
//           shapeSize: options.shapeSize || 1,
//           extrudeDepth: options.extrudeDepth || 0.2,
//         };
//         newShapeBase.position[1] =
//           (specificProps.shapeSize / 2) * newShapeBase.scale[1];
//       }
//       const newShape = { ...newShapeBase, ...specificProps };
//       saveState();
//       setShapes((prev) => [...prev, newShape]);
//       setSelectedShapeId(newShape.id);
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
//         selectedShape.position[2] + 0.5,
//       ],
//       animation: selectedShape.animation
//         ? {
//             ...selectedShape.animation,
//             orbitCenter: selectedShape.animation.orbitCenter
//               ? [...selectedShape.animation.orbitCenter]
//               : [0, 0, 0],
//           }
//         : undefined,
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

//   const updateShapeAndSave = useCallback(
//     (shapeId, updates) => {
//       saveState();
//       updateShape(shapeId, updates);
//     },
//     [updateShape, saveState]
//   );

//   const handleShapeClick = useCallback((shapeId) => {
//     setSelectedShapeId(shapeId);
//   }, []);

//   const handleShapeUpdateFromTransformControls = useCallback(
//     (shapeId) => {
//       // This is called by TransformControls onObjectChange via MainScene
//       if (sceneRef.current && selectedShapeId && shapeId === selectedShapeId) {
//         const currentSelectedShape = shapes.find(
//           (s) => s.id === selectedShapeId
//         );
//         if (!currentSelectedShape) return;

//         const objectName = `shape_${currentSelectedShape.id}_${
//           currentSelectedShape.geometry
//         }_${currentSelectedShape.shapeType || ""}`;
//         const threeObject = sceneRef.current.getObjectByName(objectName);

//         if (threeObject) {
//           saveState(); // Save current state BEFORE applying transform control updates
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
//           // Update the React state. This will flow down and re-render the Shape component.
//           // The Shape's useEffect for position/rotation/scale will update its internal initialPosition/Rotation refs.
//           setShapes((prevShapes) =>
//             prevShapes.map((s) =>
//               s.id === shapeId ? { ...s, ...newUpdates } : s
//             )
//           );
//         } else {
//           console.warn(
//             `[Model3DCreator] Could not find THREE object named "${objectName}" to update from TransformControls.`
//           );
//         }
//       }
//     },
//     [selectedShapeId, shapes, saveState] // sceneRef is stable
//   );

//   const setCameraView = useCallback((preset) => {
//     setCameraPreset(preset);
//     setTimeout(() => setCameraPreset(null), 100);
//   }, []);

//   const undo = useCallback(() => {
//     if (undoStack.length === 0) return;
//     const prevStates = [...undoStack];
//     const stateToRestore = prevStates.pop();
//     setRedoStack((prevRedo) => [
//       shapes.map((s) => ({
//         ...s,
//         animation: s.animation
//           ? {
//               ...s.animation,
//               orbitCenter: [...(s.animation.orbitCenter || [0, 0, 0])],
//             }
//           : undefined,
//       })),
//       ...prevRedo,
//     ]);
//     setUndoStack(prevStates);
//     setShapes(stateToRestore);
//     setSelectedShapeId(null);
//   }, [undoStack, shapes]);

//   const redo = useCallback(() => {
//     if (redoStack.length === 0) return;
//     const nextStates = [...redoStack];
//     const stateToRestore = nextStates.shift();
//     setUndoStack((prevUndo) => [
//       shapes.map((s) => ({
//         ...s,
//         animation: s.animation
//           ? {
//               ...s.animation,
//               orbitCenter: [...(s.animation.orbitCenter || [0, 0, 0])],
//             }
//           : undefined,
//       })),
//       ...prevUndo,
//     ]);
//     setRedoStack(nextStates);
//     setShapes(stateToRestore);
//     setSelectedShapeId(null);
//   }, [redoStack, shapes]);

//   const exportJSON = useCallback(() => {
//     if (shapes.length === 0) {
//       alert("No shapes to export.");
//       return;
//     }
//     try {
//       const sceneData = {
//         metadata: {
//           version: "2.2",
//           type: "PBR Model Creator Export with Animation",
//           generator: "React Three Fiber",
//           created: new Date().toISOString(),
//         },
//         shapes: shapes.map((s) => ({
//           id: s.id,
//           geometry: s.geometry,
//           material: s.material,
//           color: s.color,
//           position: s.position,
//           rotation: s.rotation,
//           scale: s.scale,
//           text: s.text,
//           textSize: s.textSize,
//           shapeType: s.shapeType,
//           shapeSize: s.shapeSize,
//           extrudeDepth: s.extrudeDepth,
//           roughness: s.roughness,
//           metalness: s.metalness,
//           animation: s.animation
//             ? {
//                 ...s.animation,
//                 orbitCenter: s.animation.orbitCenter
//                   ? [...s.animation.orbitCenter]
//                   : [0, 0, 0],
//               }
//             : undefined,
//         })),
//         scene: {
//           canvasBackground: "linear-gradient(135deg, #1e1e2f 0%, #3c3c58 100%)",
//           environment: "environment.hdr",
//           totalShapes: shapes.length,
//         },
//       };
//       const blob = new Blob([JSON.stringify(sceneData, null, 2)], {
//         type: "application/json",
//       });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `pbr-model-scene-animated-${Date.now()}.json`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
//       alert(`Exported ${shapes.length} shapes to JSON!`);
//     } catch (error) {
//       console.error("JSON Export failed:", error);
//       alert("JSON Export failed: " + error.message);
//     }
//   }, [shapes]);

//   // --- Updated exportGLBFile with debugging ---
//   const exportGLBFile = useCallback(() => {
//     console.log(
//       "[GLB EXPORT] Initiated. Number of shapes in state:",
//       shapes.length
//     );
//     if (shapes.length === 0) {
//       alert("No shapes to export.");
//       console.log("[GLB EXPORT] Aborted: No shapes.");
//       return;
//     }
//     proceedWithGLBExport();
//   }, [shapes]);

//   const proceedWithGLBExport = () => {
//     console.log("[GLB EXPORT] Proceeding with export logic...");
//     try {
//       const exportScene = new THREE.Scene();
//       exportScene.name = "ExportedCreatorScene";

//       const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
//       exportScene.add(ambientLight);
//       const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
//       directionalLight.position.set(10, 15, 10);
//       exportScene.add(directionalLight);
//       console.log("[GLB EXPORT] Added lights to export scene.");

//       let exportedCount = 0;
//       shapes.forEach((shape) => {
//         console.log(
//           `[GLB EXPORT] Processing shape ID ${shape.id} for export. Data:`,
//           JSON.parse(JSON.stringify(shape))
//         );
//         // createMeshFromShape uses shapeData from React state.
//         // This shapeData should reflect the base pose (after TransformControls or initial placement).
//         // Animation transformations applied in useFrame are on the live THREE.Object3D,
//         // not directly modifying the React 'shapes' state continuously.
//         const mesh = createMeshFromShape(shape);
//         if (mesh) {
//           exportScene.add(mesh);
//           exportedCount++;
//           console.log(
//             `[GLB EXPORT] Successfully created and added mesh ${mesh.name} (Source ID: ${shape.id}) to exportScene.`
//           );
//         } else {
//           console.warn(
//             `[GLB EXPORT] Failed to create mesh for shape ID ${shape.id}. It will not be included in the GLB.`
//           );
//         }
//       });

//       console.log(
//         `[GLB EXPORT] Total meshes prepared for export: ${exportedCount} out of ${shapes.length} shapes in state.`
//       );

//       if (exportedCount === 0 && shapes.length > 0) {
//         alert(
//           "No valid shapes could be prepared for GLB export. Check the developer console for errors from 'createMeshFromShape' (in SceneElements.jsx)."
//         );
//         console.error(
//           "[GLB EXPORT] Aborted: No valid meshes were created for export, although shapes exist in state."
//         );
//         return;
//       }
//       if (exportedCount === 0 && shapes.length === 0) {
//         // Should be caught by the initial check
//         alert("No shapes in the scene to export.");
//         console.log(
//           "[GLB EXPORT] Aborted: No shapes to export (confirmed again)."
//         );
//         return;
//       }

//       console.log(
//         "[GLB EXPORT] Handing scene over to THREE.GLTFExporter. Export Scene object:",
//         exportScene
//       );
//       // The exportToGLB function is imported from SceneElements.jsx
//       exportToGLB(exportScene, `pbr-model-animated-${Date.now()}.glb`);
//     } catch (error) {
//       console.error(
//         "[GLB EXPORT] Critical error during GLB export setup phase:",
//         error
//       );
//       alert(
//         "GLB Export failed due to an unexpected error during setup: " +
//           error.message +
//           ". Check console."
//       );
//     }
//   };
//   // --- End of updated exportGLBFile ---

//   const editorSidebarShapeOptions = [
//     { name: "Cube", geometry: "box", icon: "🧊" },
//     { name: "Sphere", geometry: "sphere", icon: "⚪" },
//     { name: "Cylinder", geometry: "cylinder", icon: "🥫" },
//     { name: "Cone", geometry: "cone", icon: "🔺" },
//     { name: "Torus", geometry: "torus", icon: "🍩" },
//     { name: "Pyramid", geometry: "pyramid", icon: "🔺" },
//     { name: "3D Text", geometry: "text", icon: "📝" },
//   ];

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       if (
//         event.target.tagName === "INPUT" ||
//         event.target.tagName === "TEXTAREA" ||
//         event.target.isContentEditable
//       )
//         return;
//       switch (event.key.toLowerCase()) {
//         case "w":
//           setMode("translate");
//           break;
//         case "e":
//           setMode("rotate");
//           break;
//         case "r":
//           setMode("scale");
//           break;
//         case "delete":
//         case "backspace":
//           if (selectedShapeId) {
//             event.preventDefault();
//             removeShape(selectedShapeId);
//           }
//           break;
//         case "p":
//           event.preventDefault();
//           setIsAnimating((prev) => !prev);
//           break;
//         default:
//           break;
//       }
//       if (event.ctrlKey || event.metaKey) {
//         if (event.key.toLowerCase() === "z") {
//           event.preventDefault();
//           undo();
//         } else if (event.key.toLowerCase() === "y") {
//           event.preventDefault();
//           redo();
//         } else if (event.key.toLowerCase() === "d" && selectedShapeId) {
//           event.preventDefault();
//           duplicateShape();
//         }
//       }
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [selectedShapeId, removeShape, undo, redo, duplicateShape, mode]); // Added mode to deps for transform tool shortcuts

//   const toggleGlobalAnimation = useCallback(() => {
//     setIsAnimating((prev) => !prev);
//   }, []);

//   return (
//     <TooltipProvider>
//       <div className='flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-foreground'>
//         <EditorToolbar
//           undo={undo}
//           redo={redo}
//           undoStackLength={undoStack.length}
//           redoStackLength={redoStack.length}
//           exportJSON={exportJSON}
//           exportGLBFile={exportGLBFile}
//           isAnimating={isAnimating}
//           toggleGlobalAnimation={toggleGlobalAnimation}
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
//             orbitControlsEnabled={
//               !isAnimating ||
//               !selectedShape?.animation ||
//               selectedShape.animation.type === "none"
//             }
//             sceneRef={sceneRef}
//             cameraPreset={cameraPreset}
//             selectedShape={selectedShape}
//             setSelectedShapeId={setSelectedShapeId}
//             SceneComponent={MainScene}
//             CameraControllerComponent={CameraController}
//             isAnimating={isAnimating}
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
// Model3DCreator.jsx
// Model3DCreator.jsx
// Model3DCreator.jsx
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
} from "./SceneElements";

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
  const sceneRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isBaking, setIsBaking] = useState(false);

  const selectedShape = shapes.find((shape) => shape.id === selectedShapeId);

  const saveState = useCallback(() => {
    if (isBaking) return;
    const state = shapes.map((shape) => ({
      ...shape,
      position: [...shape.position],
      rotation: [...shape.rotation],
      scale: [...shape.scale],
      animation: shape.animation
        ? {
            ...shape.animation,
            orbitCenter: [...(shape.animation.orbitCenter || [0, 0, 0])],
          }
        : undefined,
    }));
    setUndoStack((prev) => [...prev, state]);
    setRedoStack([]);
  }, [shapes, isBaking]);

  const addShape = useCallback(
    (geometryType, options = {}) => {
      const newShapeBase = {
        id: Date.now().toString(),
        geometry: geometryType,
        material: "standard",
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
        roughness: 0.5,
        metalness: 0.0,
        animation: {
          type: "none",
          speed: 1,
          axis: "y",
          orbitCenter: [0, 0, 0],
          orbitRadius: 5,
          orbitPlane: "xz",
        },
      };
      let specificProps = {};
      if (geometryType === "text") {
        specificProps = { text: "Text", textSize: 0.5 };
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
      saveState();
      setShapes((prev) => [...prev, newShape]);
      setSelectedShapeId(newShape.id);
    },
    [saveState]
  );

  const removeShape = useCallback(
    (shapeId) => {
      if (isBaking) return;
      saveState();
      setShapes((prev) => prev.filter((shape) => shape.id !== shapeId));
      if (selectedShapeId === shapeId) setSelectedShapeId(null);
    },
    [selectedShapeId, saveState, isBaking]
  );

  const duplicateShape = useCallback(() => {
    if (!selectedShape || isBaking) return;
    const duplicated = {
      ...selectedShape,
      id: Date.now().toString(),
      position: [
        selectedShape.position[0] + 0.5,
        selectedShape.position[1],
        selectedShape.position[2] + 0.5,
      ],
      animation: selectedShape.animation
        ? {
            ...selectedShape.animation,
            orbitCenter: selectedShape.animation.orbitCenter
              ? [...selectedShape.animation.orbitCenter]
              : [0, 0, 0],
          }
        : undefined,
    };
    saveState();
    setShapes((prev) => [...prev, duplicated]);
    setSelectedShapeId(duplicated.id);
  }, [selectedShape, saveState, isBaking]);

  const updateShape = useCallback(
    (shapeId, updates) => {
      if (isBaking) return;
      setShapes((prev) =>
        prev.map((shape) =>
          shape.id === shapeId ? { ...shape, ...updates } : shape
        )
      );
    },
    [isBaking]
  );

  const updateShapeAndSave = useCallback(
    (shapeId, updates) => {
      if (isBaking) return;
      saveState();
      updateShape(shapeId, updates);
    },
    [updateShape, saveState, isBaking]
  );

  const handleShapeClick = useCallback(
    (shapeId, event) => {
      // Added event for multi-select check
      if (isBaking) return;

      // Example for Shift-Click for multi-select (can be expanded)
      // For now, this click logic is for single selection
      // To implement multi-select, setSelectedShapeId would change to setSelectedShapeIds
      // and logic here would check event.shiftKey to add/remove from an array.
      // For this fix, we keep single selection logic for setSelectedShapeId.
      if (selectedShapeId === shapeId) {
        // setSelectedShapeId(null); // Option to deselect if clicking the same shape
      } else {
        setSelectedShapeId(shapeId);
      }
    },
    [isBaking, selectedShapeId]
  ); // Added selectedShapeId

  const handleShapeUpdateFromTransformControls = useCallback(
    (shapeId) => {
      if (isBaking) return;
      if (sceneRef.current && selectedShapeId && shapeId === selectedShapeId) {
        const currentSelectedShape = shapes.find(
          (s) => s.id === selectedShapeId
        );
        if (!currentSelectedShape) return;
        const objectName = `shape_${currentSelectedShape.id}_${
          currentSelectedShape.geometry
        }_${currentSelectedShape.shapeType || ""}`;
        const threeObject = sceneRef.current.getObjectByName(objectName);
        if (threeObject) {
          saveState();
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
          setShapes((prevShapes) =>
            prevShapes.map((s) =>
              s.id === shapeId ? { ...s, ...newUpdates } : s
            )
          );
        } else {
          console.warn(
            `[Model3DCreator] Could not find THREE object named "${objectName}" to update from TransformControls.`
          );
        }
      }
    },
    [selectedShapeId, shapes, saveState, isBaking]
  );

  const setCameraView = useCallback(
    (preset) => {
      if (isBaking) return;
      setCameraPreset(preset);
      setTimeout(() => setCameraPreset(null), 100);
    },
    [isBaking]
  );

  const undo = useCallback(() => {
    if (undoStack.length === 0 || isBaking) return;
    const prevStates = [...undoStack];
    const stateToRestore = prevStates.pop();
    setRedoStack((prevRedo) => [
      shapes.map((s) => ({
        ...s,
        animation: s.animation
          ? {
              ...s.animation,
              orbitCenter: [...(s.animation.orbitCenter || [0, 0, 0])],
            }
          : undefined,
      })),
      ...prevRedo,
    ]);
    setUndoStack(prevStates);
    setShapes(stateToRestore);
    setSelectedShapeId(null);
  }, [undoStack, shapes, isBaking]);

  const redo = useCallback(() => {
    if (redoStack.length === 0 || isBaking) return;
    const nextStates = [...redoStack];
    const stateToRestore = nextStates.shift();
    setUndoStack((prevUndo) => [
      shapes.map((s) => ({
        ...s,
        animation: s.animation
          ? {
              ...s.animation,
              orbitCenter: [...(s.animation.orbitCenter || [0, 0, 0])],
            }
          : undefined,
      })),
      ...prevUndo,
    ]);
    setRedoStack(nextStates);
    setShapes(stateToRestore);
    setSelectedShapeId(null);
  }, [redoStack, shapes, isBaking]);

  const exportJSON = useCallback(() => {
    if (isBaking) {
      alert("Cannot export while baking is in progress.");
      return;
    }
    if (shapes.length === 0) {
      alert("No shapes to export as JSON.");
      console.log("[EXPORT JSON] Aborted: No shapes.");
      return;
    }
    console.log(
      "[EXPORT JSON] Initiated. Exporting current shapes state:",
      shapes
    );
    try {
      const serializableShapes = shapes.map((s) => ({
        id: s.id,
        geometry: s.geometry,
        material: s.material,
        color: s.color || "#ffffff",
        position:
          Array.isArray(s.position) && s.position.length === 3
            ? s.position
            : [0, 0, 0],
        rotation:
          Array.isArray(s.rotation) && s.rotation.length === 3
            ? s.rotation
            : [0, 0, 0],
        scale:
          Array.isArray(s.scale) && s.scale.length === 3 ? s.scale : [1, 1, 1],
        text: s.text || (s.geometry === "text" ? "Text" : undefined),
        textSize:
          s.textSize !== undefined
            ? s.textSize
            : s.geometry === "text"
            ? 0.5
            : undefined,
        shapeType:
          s.shapeType ||
          (s.geometry === "customExtruded" ? "heart" : undefined),
        shapeSize:
          s.shapeSize !== undefined
            ? s.shapeSize
            : s.geometry === "customExtruded"
            ? 1
            : undefined,
        extrudeDepth:
          s.extrudeDepth !== undefined
            ? s.extrudeDepth
            : s.geometry === "customExtruded"
            ? 0.2
            : undefined,
        roughness: s.roughness !== undefined ? s.roughness : 0.5,
        metalness: s.metalness !== undefined ? s.metalness : 0.0,
        animation: s.animation
          ? {
              type: s.animation.type || "none",
              speed: s.animation.speed !== undefined ? s.animation.speed : 1,
              axis: s.animation.axis || "y",
              orbitCenter:
                Array.isArray(s.animation.orbitCenter) &&
                s.animation.orbitCenter.length === 3
                  ? s.animation.orbitCenter
                  : [0, 0, 0],
              orbitRadius:
                s.animation.orbitRadius !== undefined
                  ? s.animation.orbitRadius
                  : 5,
              orbitPlane: s.animation.orbitPlane || "xz",
            }
          : {
              type: "none",
              speed: 1,
              axis: "y",
              orbitCenter: [0, 0, 0],
              orbitRadius: 5,
              orbitPlane: "xz",
            },
      }));
      const sceneData = {
        metadata: {
          version: "2.3",
          type: "PBR Model Creator Scene",
          generator: "React Three Fiber Application",
          created: new Date().toISOString(),
        },
        shapes: serializableShapes,
        sceneSettings: { isAnimatingGlobal: isAnimating },
      };
      const jsonString = JSON.stringify(sceneData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `creator-scene-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      console.log(
        "[EXPORT JSON] Successfully created and triggered download for JSON file."
      );
      alert(`Exported ${shapes.length} shapes to JSON successfully!`);
    } catch (error) {
      console.error("[EXPORT JSON] Failed:", error);
      alert("Failed to export scene as JSON: " + error.message);
    }
  }, [shapes, isAnimating, isBaking]);

  const exportStaticGLBFile = useCallback(() => {
    if (isBaking) {
      alert("Cannot export while baking is in progress.");
      return;
    }
    console.log(
      "[STATIC GLB EXPORT] Initiated. Number of shapes in state:",
      shapes.length
    );
    if (shapes.length === 0) {
      alert("No shapes to export as Static GLB.");
      console.log("[STATIC GLB EXPORT] Aborted: No shapes.");
      return;
    }
    try {
      const exportScene = new THREE.Scene();
      exportScene.name = "StaticExportScene";
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      exportScene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
      directionalLight.position.set(5, 10, 7.5);
      exportScene.add(directionalLight);
      console.log("[STATIC GLB EXPORT] Added lights to export scene.");
      let successfullyCreatedMeshCount = 0;
      shapes.forEach((shapeData) => {
        console.log(
          `[STATIC GLB EXPORT] Processing shape ID ${shapeData.id} for static export. Data:`,
          JSON.parse(JSON.stringify(shapeData))
        );
        const mesh = createMeshFromShape(shapeData);
        if (mesh) {
          exportScene.add(mesh);
          successfullyCreatedMeshCount++;
          console.log(
            `[STATIC GLB EXPORT] Added mesh ${mesh.name} (Source ID: ${shapeData.id}) to exportScene.`
          );
        } else {
          console.warn(
            `[STATIC GLB EXPORT] Failed to create mesh for shape ID ${shapeData.id}. It will not be included in the GLB.`
          );
        }
      });
      console.log(
        `[STATIC GLB EXPORT] Total meshes prepared for export: ${successfullyCreatedMeshCount} out of ${shapes.length} shapes in state.`
      );
      if (successfullyCreatedMeshCount === 0 && shapes.length > 0) {
        alert(
          "No valid shapes could be prepared for Static GLB export. Check console."
        );
        console.error("[STATIC GLB EXPORT] Aborted: No valid meshes created.");
        return;
      }
      if (successfullyCreatedMeshCount === 0 && shapes.length === 0) {
        alert("No shapes to export.");
        return;
      }
      console.log(
        "[STATIC GLB EXPORT] Handing scene over to THREE.GLTFExporter. Export Scene object:",
        exportScene
      );
      exportToGLB(exportScene, `static-model-${Date.now()}.glb`);
    } catch (error) {
      console.error(
        "[STATIC GLB EXPORT] Critical error during export setup:",
        error
      );
      alert("Static GLB Export failed: " + error.message);
    }
  }, [shapes, isBaking]);

  const bakeAndExportAnimatedGLB = useCallback(async () => {
    console.log("[BAKED GLB EXPORT] Initiated.");
    if (shapes.length === 0) {
      alert("No shapes to animate and export.");
      return;
    }
    if (isBaking) {
      alert("Baking process already in progress.");
      return;
    }
    setIsBaking(true);
    await new Promise((resolve) => setTimeout(resolve, 50));
    try {
      const exportScene = new THREE.Scene();
      exportScene.name = "BakedAnimatedScene";
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      exportScene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
      directionalLight.position.set(10, 15, 10);
      exportScene.add(directionalLight);
      const allAnimationClips = [];
      let processedShapeCount = 0;
      for (const shapeData of shapes) {
        console.log(`[BAKED GLB EXPORT] Processing shape ID ${shapeData.id}`);
        const staticMesh = createMeshFromShape(shapeData);
        if (!staticMesh) {
          console.warn(
            `[BAKED GLB EXPORT] Could not create temp mesh for baking shape ID ${shapeData.id}`
          );
          continue;
        }
        if (shapeData.animation && shapeData.animation.type !== "none") {
          const animationParams = shapeData.animation;
          let bakeDuration = 5;
          if (
            animationParams.type === "orbit" &&
            (animationParams.speed || 1) * 0.2 !== 0
          ) {
            bakeDuration = Math.abs(
              (Math.PI * 2) / ((animationParams.speed || 1) * 0.2)
            );
            bakeDuration = Math.max(1, bakeDuration);
          }
          const bakeFps = 30;
          const totalFrames = Math.max(2, Math.floor(bakeDuration * bakeFps));
          const timeStep = bakeDuration / (totalFrames - 1);
          console.log(
            `[BAKED GLB EXPORT] Baking shape ${shapeData.id}: ${
              animationParams.type
            }, Duration: ${bakeDuration.toFixed(2)}s, Frames: ${totalFrames}`
          );
          const times = [];
          const positions = [];
          const quaternions = [];
          const bakingMesh = new THREE.Mesh(); // Temporary mesh for transform simulation
          bakingMesh.position.fromArray(shapeData.position);
          // Convert initial Euler rotation from shapeData to quaternion for bakingMesh
          const initialEuler = new THREE.Euler().fromArray(shapeData.rotation);
          bakingMesh.quaternion.setFromEuler(initialEuler);

          let currentOrbitAngle = Math.random() * Math.PI * 2; // Consistent with live animation start
          for (let i = 0; i < totalFrames; i++) {
            const time = i * timeStep;
            times.push(time);
            const effectiveSpeedForFrame =
              (animationParams.speed || 1) * timeStep;
            switch (animationParams.type) {
              case "rotate":
                const axis = animationParams.axis || "y";
                const R = new THREE.Quaternion();
                const angle = effectiveSpeedForFrame;
                if (axis === "x")
                  R.setFromAxisAngle(new THREE.Vector3(1, 0, 0), angle);
                else if (axis === "y")
                  R.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
                else if (axis === "z")
                  R.setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);
                bakingMesh.quaternion.premultiply(R);
                break; // Apply rotation to current quaternion
              case "orbit":
                currentOrbitAngle += effectiveSpeedForFrame * 0.2;
                const r = animationParams.orbitRadius || 5;
                const cX = animationParams.orbitCenter?.[0] || 0;
                const cY = animationParams.orbitCenter?.[1] || 0;
                const cZ = animationParams.orbitCenter?.[2] || 0;
                const p = animationParams.orbitPlane || "xz";
                if (p === "xz")
                  bakingMesh.position.set(
                    cX + Math.cos(currentOrbitAngle) * r,
                    cY,
                    cZ + Math.sin(currentOrbitAngle) * r
                  );
                else if (p === "xy")
                  bakingMesh.position.set(
                    cX + Math.cos(currentOrbitAngle) * r,
                    cY + Math.sin(currentOrbitAngle) * r,
                    cZ
                  );
                else if (p === "yz")
                  bakingMesh.position.set(
                    cX,
                    cY + Math.cos(currentOrbitAngle) * r,
                    cZ + Math.sin(currentOrbitAngle) * r
                  );
                break;
            }
            positions.push(
              bakingMesh.position.x,
              bakingMesh.position.y,
              bakingMesh.position.z
            );
            bakingMesh.quaternion.normalize(); // Normalize after multiplication
            quaternions.push(
              bakingMesh.quaternion.x,
              bakingMesh.quaternion.y,
              bakingMesh.quaternion.z,
              bakingMesh.quaternion.w
            );
          }
          const targetNodeName = staticMesh.uuid; // Tracks target the mesh by its UUID
          const posTrack = new THREE.VectorKeyframeTrack(
            `${targetNodeName}.position`,
            times,
            positions
          );
          const rotTrack = new THREE.QuaternionKeyframeTrack(
            `${targetNodeName}.quaternion`,
            times,
            quaternions
          );
          const clip = new THREE.AnimationClip(
            `Anim_${shapeData.id}_${animationParams.type.replace(/\s+/g, "_")}`,
            totalFrames > 1 ? bakeDuration : 0,
            [posTrack, rotTrack]
          );
          allAnimationClips.push(clip);
        }
        exportScene.add(staticMesh);
        processedShapeCount++;
      }
      if (processedShapeCount === 0 && shapes.length > 0) {
        alert("No valid shapes processed for animated GLB.");
        setIsBaking(false);
        return;
      }
      if (allAnimationClips.length > 0) {
        exportScene.animations = allAnimationClips;
        console.log(
          `[BAKED GLB EXPORT] Added ${allAnimationClips.length} animation clips to export scene.`
        );
      } else {
        console.log(
          "[BAKED GLB EXPORT] No animations were baked (all shapes static or 'none' animation)."
        );
      }
      console.log(
        "[BAKED GLB EXPORT] Exporting scene with animations:",
        exportScene
      );
      exportToGLB(exportScene, `baked-animated-model-${Date.now()}.glb`);
    } catch (error) {
      console.error("[BAKED GLB EXPORT] Critical error during baking:", error);
      alert("Animated GLB Export failed: " + error.message);
    } finally {
      setIsBaking(false);
      console.log("[BAKED GLB EXPORT] Baking process finished.");
    }
  }, [shapes, isBaking]);

  const alignAllShapes = useCallback(
    (axis, reference = "average") => {
      if (isBaking) {
        alert("Cannot perform actions while baking.");
        return;
      }
      if (shapes.length < 1) {
        alert("No shapes to align.");
        return;
      }
      if (shapes.length < 2 && reference === "average") {
        alert("Need at least two shapes to align to an average position.");
        return;
      }
      saveState();
      let targetValue;
      const axisIndex = axis === "x" ? 0 : axis === "y" ? 1 : 2;
      if (reference === "average") {
        const sum = shapes.reduce(
          (acc, shape) => acc + (shape.position[axisIndex] || 0),
          0
        );
        targetValue = sum / shapes.length;
      } else {
        console.warn(
          "Unsupported alignment reference for 'Align All':",
          reference
        );
        alert("Unsupported alignment reference.");
        return;
      }
      const updatedShapes = shapes.map((shape) => {
        const newPosition = [...shape.position];
        newPosition[axisIndex] = targetValue;
        return { ...shape, position: newPosition };
      });
      setShapes(updatedShapes);
      console.log(
        `All shapes aligned on ${axis.toUpperCase()}-axis to average: ${targetValue.toFixed(
          2
        )}`
      );
      alert(`All shapes aligned on ${axis.toUpperCase()}-axis to average.`);
    },
    [shapes, saveState, isBaking, setShapes]
  );

  const alignSelectedShapeToOrigin = useCallback(
    (axis) => {
      if (isBaking) {
        alert("Cannot perform actions while baking.");
        return;
      }
      if (!selectedShapeId) {
        alert("No shape selected to align.");
        return;
      }
      const shapeIndex = shapes.findIndex((s) => s.id === selectedShapeId);
      if (shapeIndex === -1) {
        console.error("Selected shape not found for alignment.");
        return;
      }
      saveState();
      const axisIndex = axis === "x" ? 0 : axis === "y" ? 1 : 2;
      const updatedShapes = shapes.map((shape, index) => {
        if (index === shapeIndex) {
          const newPosition = [...shape.position];
          newPosition[axisIndex] = 0;
          return { ...shape, position: newPosition };
        }
        return shape;
      });
      setShapes(updatedShapes);
      console.log(
        `Selected shape ${selectedShapeId} aligned on ${axis.toUpperCase()}-axis to origin.`
      );
      alert(`Selected shape aligned on ${axis.toUpperCase()}-axis to origin.`);
    },
    [shapes, selectedShapeId, saveState, isBaking, setShapes]
  );

  const editorSidebarShapeOptions = [
    { name: "Cube", geometry: "box", icon: "🧊" },
    { name: "Sphere", geometry: "sphere", icon: "⚪" },
    { name: "Cylinder", geometry: "cylinder", icon: "🥫" },
    { name: "Cone", geometry: "cone", icon: "🔺" },
    { name: "Torus", geometry: "torus", icon: "🍩" },
    { name: "Pyramid", geometry: "pyramid", icon: "🔺" },
    { name: "3D Text", geometry: "text", icon: "📝" },
  ];

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        isBaking ||
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA" ||
        event.target.isContentEditable
      )
        return;
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
        case "delete":
        case "backspace":
          if (selectedShapeId) {
            event.preventDefault();
            removeShape(selectedShapeId);
          }
          break;
        case "p":
          event.preventDefault();
          setIsAnimating((prev) => !prev);
          break;
        default:
          break;
      }
      if (event.ctrlKey || event.metaKey) {
        if (event.key.toLowerCase() === "z") {
          event.preventDefault();
          undo();
        } else if (event.key.toLowerCase() === "y") {
          event.preventDefault();
          redo();
        } else if (event.key.toLowerCase() === "d" && selectedShapeId) {
          event.preventDefault();
          duplicateShape();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedShapeId,
    removeShape,
    undo,
    redo,
    duplicateShape,
    mode,
    isBaking,
    isAnimating,
  ]);

  const toggleGlobalAnimation = useCallback(() => {
    if (isBaking) return;
    setIsAnimating((prev) => !prev);
  }, [isBaking]);

  const jsonFileInputRef = useRef(null);
  const triggerJsonFileImport = () => {
    if (jsonFileInputRef.current && !isBaking) jsonFileInputRef.current.click();
  };
  const handleJsonFileImport = (event) => {
    if (isBaking) {
      alert("Cannot import while baking.");
      return;
    }
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          if (jsonData && Array.isArray(jsonData.shapes)) {
            // Assuming full sceneData structure
            // Perform a deep copy and ensure defaults for any missing animation properties
            const newShapes = jsonData.shapes.map((s) => ({
              ...s,
              id: s.id || Date.now().toString() + Math.random(),
              position:
                Array.isArray(s.position) && s.position.length === 3
                  ? s.position
                  : [0, 0, 0],
              rotation:
                Array.isArray(s.rotation) && s.rotation.length === 3
                  ? s.rotation
                  : [0, 0, 0],
              scale:
                Array.isArray(s.scale) && s.scale.length === 3
                  ? s.scale
                  : [1, 1, 1],
              animation: {
                type: "none",
                speed: 1,
                axis: "y",
                orbitCenter: [0, 0, 0],
                orbitRadius: 5,
                orbitPlane: "xz",
                ...(s.animation || {}),
                orbitCenter:
                  Array.isArray(s.animation?.orbitCenter) &&
                  s.animation.orbitCenter.length === 3
                    ? s.animation.orbitCenter
                    : [0, 0, 0],
              },
              color:
                s.color ||
                `#${Math.floor(Math.random() * 16777215)
                  .toString(16)
                  .padStart(6, "0")}`,
              material: s.material || "standard",
              roughness: s.roughness !== undefined ? s.roughness : 0.5,
              metalness: s.metalness !== undefined ? s.metalness : 0.0,
            }));
            setShapes(newShapes);
            setSelectedShapeId(null);
            setUndoStack([]);
            setRedoStack([]);
            setIsAnimating(
              jsonData.sceneSettings?.isAnimatingGlobal !== undefined
                ? jsonData.sceneSettings.isAnimatingGlobal
                : true
            );
            console.log("Scene data loaded successfully from JSON.", newShapes);
            alert(`Scene loaded with ${newShapes.length} shapes.`);
          } else {
            alert("Invalid JSON: 'shapes' array missing or incorrect format.");
          }
        } catch (error) {
          console.error("Error parsing imported JSON:", error);
          alert("Error parsing JSON file.");
        }
      };
      reader.readAsText(file);
      event.target.value = null;
    }
  };

  return (
    <TooltipProvider>
      <div
        className={`flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-foreground ${
          isBaking ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <input
          type='file'
          accept='.json'
          ref={jsonFileInputRef}
          onChange={handleJsonFileImport}
          style={{ display: "none" }}
        />
        {isBaking && (
          <div className='absolute inset-0 bg-black/70 flex items-center justify-center z-50'>
            <div className='text-white text-2xl p-8 bg-slate-700 rounded-lg shadow-xl flex items-center'>
              <svg
                className='animate-spin h-8 w-8 text-white mr-3'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
              Baking Animations... Please Wait
            </div>
          </div>
        )}
        <EditorToolbar
          undo={undo}
          redo={redo}
          undoStackLength={undoStack.length}
          redoStackLength={redoStack.length}
          exportJSON={exportJSON}
          exportStaticGLBFile={exportStaticGLBFile}
          bakeAndExportAnimatedGLB={bakeAndExportAnimatedGLB}
          triggerJsonFileImport={triggerJsonFileImport}
          alignAllShapes={alignAllShapes}
          alignSelectedShapeToOrigin={alignSelectedShapeToOrigin}
          selectedShapeId={selectedShapeId}
          shapesCount={shapes.length} // Pass shapesCount
          isAnimating={isAnimating}
          toggleGlobalAnimation={toggleGlobalAnimation}
          isBaking={isBaking}
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
            orbitControlsEnabled={
              !isAnimating ||
              !selectedShape?.animation ||
              selectedShape.animation.type === "none" ||
              isBaking
            }
            sceneRef={sceneRef}
            cameraPreset={cameraPreset}
            selectedShape={selectedShape}
            setSelectedShapeId={setSelectedShapeId}
            SceneComponent={MainScene}
            CameraControllerComponent={CameraController}
            isAnimating={isAnimating}
          />
          <PropertiesPanel
            selectedShape={selectedShape}
            updateShape={updateShapeAndSave}
            removeShape={removeShape}
            duplicateShape={duplicateShape}
            addShape={addShape}
          />
        </div>
        <StatusBar shapesCount={shapes.length} selectedShape={selectedShape} />
      </div>
    </TooltipProvider>
  );
}
