// import { Suspense, useMemo, useRef, useEffect } from "react";
// import * as THREE from "three";
// import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

// // Conditional imports for R3F & Drei
// let useFrame, useThree, extend;
// let OrbitControls, TransformControls, Grid;

// import createLetterShape from "../../LetterShape/CreateLetterShape";
// import createNumberShape from "../../LetterShape/CreateNumberShape";
// import createSpecialCharShape from "../../LetterShape/CreateSpecialCharShape";

// // Import your popular shape creation functions
// import {
//   createHeartShape,
//   createStarShape,
//   createCrownShape,
//   createLightningShape,
//   createDiamondShape,
//   createShieldShape,
//   createArrowShape,
//   createLeafShape,
//   createSwordShape,
//   createButterflyShape,
// } from "../../LetterShape/PopulerShapes"; // Adjust path if necessary

// try {
//   const r3f = require("@react-three/fiber");
//   useFrame = r3f.useFrame;
//   useThree = r3f.useThree;
//   extend = r3f.extend;
// } catch (error) {
//   console.warn("@react-three/fiber not available for SceneElements:", error);
// }

// try {
//   const drei = require("@react-three/drei");
//   OrbitControls = drei.OrbitControls;
//   TransformControls = drei.TransformControls;
//   Grid = drei.Grid;
// } catch (error) {
//   console.warn("@react-three/drei not available for SceneElements:", error);
// }

// if (extend && THREE) {
//   extend({
//     BoxGeometry: THREE.BoxGeometry,
//     SphereGeometry: THREE.SphereGeometry,
//     CylinderGeometry: THREE.CylinderGeometry,
//     ConeGeometry: THREE.ConeGeometry,
//     TorusGeometry: THREE.TorusGeometry,
//     // Note: ExtrudeGeometry is part of THREE core, no need to extend
//   });
// }

// // Enhanced GLB Exporter utility (Exported)
// export function exportToGLB(scene, filename = "model.glb") {
//   if (!THREE) {
//     alert("THREE.js is not available for GLB export.");
//     return;
//   }
//   const exporter = new GLTFExporter();
//   const options = {
//     binary: true,
//     onlyVisible: true,
//     truncateDrawRange: true,
//     embedImages: true,
//     animations: [],
//     includeCustomExtensions: false,
//   };
//   exporter.parse(
//     scene,
//     (result) => {
//       const blob =
//         result instanceof ArrayBuffer
//           ? new Blob([result], { type: "application/octet-stream" })
//           : new Blob([JSON.stringify(result, null, 2)], {
//               type: "application/json",
//             });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download =
//         result instanceof ArrayBuffer
//           ? filename
//           : filename.replace(".glb", ".gltf");
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
//       alert(
//         `${
//           result instanceof ArrayBuffer ? "GLB" : "GLTF"
//         } file exported successfully!`
//       );
//     },
//     (error) => {
//       console.error("Export failed:", error);
//       alert("Export failed: " + error.message);
//     },
//     options
//   );
// }

// // Internal helper for text geometry, used by RealTextGeometry and createMeshFromShape
// const createTextGeometryForR3F = (text, size) => {
//   if (!THREE) return new THREE.BoxGeometry(0.1, 0.1, 0.1);

//   try {
//     const textLength = text.length;
//     const spacing = size * 0.8;
//     const depth = size * 0.3;
//     const charGeometries = [];
//     for (let i = 0; i < textLength; i++) {
//       const char = text[i];
//       if (char === " ") continue;
//       let characterShapes = [];
//       const xOffset = (i - textLength / 2 + 0.5) * spacing;
//       if (/[0-9]/.test(char))
//         characterShapes = [createNumberShape(char, size)].filter(Boolean);
//       else if (/[A-Za-z]/.test(char))
//         characterShapes = [createLetterShape(char, size)].filter(Boolean);
//       else {
//         const specialShapes = createSpecialCharShape(char, size);
//         if (specialShapes)
//           characterShapes = Array.isArray(specialShapes)
//             ? specialShapes
//             : [specialShapes];
//       }
//       const extrudeSettings = {
//         depth,
//         bevelEnabled: true,
//         bevelSegments: 3,
//         steps: 1,
//         bevelSize: size * 0.02,
//         bevelThickness: size * 0.01,
//       };
//       characterShapes.forEach((shape, shapeIndex) => {
//         try {
//           const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
//           geom.translate(xOffset, shapeIndex * size * 0.1, 0);
//           charGeometries.push(geom);
//         } catch (e) {
//           console.warn(`Failed to extrude char ${char}:`, e);
//           const fallback = new THREE.BoxGeometry(size * 0.5, size, depth);
//           fallback.translate(xOffset, 0, 0);
//           charGeometries.push(fallback);
//         }
//       });
//     }
//     if (charGeometries.length === 0)
//       return new THREE.BoxGeometry(0.1, 0.1, 0.1);
//     if (
//       THREE.BufferGeometryUtils &&
//       THREE.BufferGeometryUtils.mergeGeometries
//     ) {
//       try {
//         const merged = THREE.BufferGeometryUtils.mergeGeometries(
//           charGeometries,
//           false
//         );
//         charGeometries.forEach((g) => g.dispose());
//         return merged;
//       } catch (e) {
//         console.warn("Failed to merge text geometries:", e);
//         if (charGeometries.length > 0) {
//           charGeometries.slice(1).forEach((g) => g.dispose());
//           return charGeometries[0];
//         }
//         return new THREE.BoxGeometry(0.1, 0.1, 0.1);
//       }
//     }
//     if (charGeometries.length === 1) return charGeometries[0];
//     console.warn(
//       "BufferGeometryUtils.mergeGeometries not available or multiple unmerged shapes."
//     );
//     return charGeometries[0];
//   } catch (error) {
//     console.error("Failed to create text geometry:", error);
//     return new THREE.BoxGeometry(
//       text.length * size * 0.6 || 0.1,
//       size || 0.1,
//       size * 0.3 || 0.1
//     );
//   }
// };

// // Helper function to create mesh from shape data (Exported)
// // This is primarily for GLB export, not for direct R3F rendering
// export const createMeshFromShape = (shapeData) => {
//   if (!THREE) {
//     console.error("THREE.js is not available for mesh creation.");
//     return null;
//   }
//   try {
//     let geometry;
//     const extrudeDepth = shapeData.extrudeDepth || 0.2;
//     const shapeSize = shapeData.shapeSize || 1;

//     switch (shapeData.geometry) {
//       case "box":
//         geometry = new THREE.BoxGeometry(1, 1, 1);
//         break;
//       case "sphere":
//         geometry = new THREE.SphereGeometry(0.5, 32, 32);
//         break;
//       case "cylinder":
//         geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
//         break;
//       case "cone":
//         geometry = new THREE.ConeGeometry(0.5, 1, 32);
//         break;
//       case "torus":
//         geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);
//         break;
//       case "pyramid":
//         const vertices = new Float32Array([
//           -0.5, 0, -0.5, 0.5, 0, -0.5, 0.5, 0, 0.5, -0.5, 0, 0.5, 0, 1, 0,
//         ]);
//         const indices = [0, 1, 2, 0, 2, 3, 0, 4, 1, 1, 4, 2, 2, 4, 3, 3, 4, 0];
//         geometry = new THREE.BufferGeometry();
//         geometry.setIndex(indices);
//         geometry.setAttribute(
//           "position",
//           new THREE.Float32BufferAttribute(vertices, 3)
//         );
//         geometry.computeVertexNormals();
//         break;
//       case "text":
//         geometry = createTextGeometryForR3F(
//           shapeData.text || "3D",
//           shapeData.textSize || 0.5
//         );
//         break;
//       case "customExtruded":
//         let twoDShape;
//         switch (shapeData.shapeType?.toLowerCase()) {
//           case "heart":
//             twoDShape = createHeartShape(shapeSize);
//             break;
//           case "star":
//             twoDShape = createStarShape(5, shapeSize, shapeSize * 0.5);
//             break;
//           case "crown":
//             twoDShape = createCrownShape(shapeSize);
//             break;
//           case "lightning":
//             twoDShape = createLightningShape(shapeSize);
//             break;
//           case "diamond":
//             twoDShape = createDiamondShape(shapeSize);
//             break;
//           case "shield":
//             twoDShape = createShieldShape(shapeSize);
//             break;
//           case "arrow":
//             twoDShape = createArrowShape(shapeSize);
//             break;
//           case "leaf":
//             twoDShape = createLeafShape(shapeSize);
//             break;
//           case "sword":
//             twoDShape = createSwordShape(shapeSize);
//             break;
//           case "butterfly":
//             twoDShape = createButterflyShape(shapeSize);
//             break;
//           default:
//             console.warn(
//               "Unknown custom shape type for export:",
//               shapeData.shapeType
//             );
//             twoDShape = new THREE.Shape()
//               .moveTo(-0.5, -0.5)
//               .lineTo(0.5, -0.5)
//               .lineTo(0.5, 0.5)
//               .lineTo(-0.5, 0.5)
//               .closePath();
//         }
//         const extrudeSettings = {
//           depth: extrudeDepth,
//           bevelEnabled: true,
//           bevelSegments: 2,
//           steps: 1,
//           bevelSize: extrudeDepth * 0.05,
//           bevelThickness: extrudeDepth * 0.05,
//         };
//         geometry = new THREE.ExtrudeGeometry(twoDShape, extrudeSettings);
//         geometry.center();
//         break;
//       default:
//         geometry = new THREE.BoxGeometry(1, 1, 1);
//     }

//     let material;
//     const color = new THREE.Color(shapeData.color);
//     switch (shapeData.material) {
//       case "standard":
//         material = new THREE.MeshStandardMaterial({ color });
//         break;
//       case "basic":
//         material = new THREE.MeshBasicMaterial({ color });
//         break;
//       case "phong":
//         material = new THREE.MeshPhongMaterial({ color });
//         break;
//       case "wireframe":
//         material = new THREE.MeshBasicMaterial({ color, wireframe: true });
//         break;
//       case "glass":
//         material = new THREE.MeshPhysicalMaterial({
//           color,
//           transparent: true,
//           opacity: 0.7,
//           roughness: 0.1,
//           transmission: 0.9,
//           metalness: 0.1,
//         });
//         break;
//       case "metal":
//         material = new THREE.MeshStandardMaterial({
//           color,
//           metalness: 0.9,
//           roughness: 0.1,
//         });
//         break;
//       default:
//         material = new THREE.MeshStandardMaterial({ color });
//     }

//     const mesh = new THREE.Mesh(geometry, material);
//     mesh.position.set(...shapeData.position);
//     mesh.rotation.set(...shapeData.rotation);
//     mesh.scale.set(...shapeData.scale);
//     mesh.name = `shape_${shapeData.id}_${shapeData.geometry}_${
//       shapeData.shapeType || ""
//     }`;
//     return mesh;
//   } catch (error) {
//     console.error("Failed to create mesh for shape:", shapeData, error);
//     return null;
//   }
// };

// // R3F Geometry Component for Custom Extruded Shapes
// function ExtrudedCustomShapeGeometry({
//   shapeType,
//   shapeSize = 1,
//   extrudeDepth = 0.2,
// }) {
//   const geometry = useMemo(() => {
//     if (!THREE) return null;
//     let twoDShape;
//     const s = shapeSize;

//     switch (
//       shapeType?.toLowerCase() // Add optional chaining
//     ) {
//       case "heart":
//         twoDShape = createHeartShape(s);
//         break;
//       case "star":
//         twoDShape = createStarShape(5, s, s * 0.5);
//         break;
//       case "crown":
//         twoDShape = createCrownShape(s);
//         break;
//       case "lightning":
//         twoDShape = createLightningShape(s);
//         break;
//       case "diamond":
//         twoDShape = createDiamondShape(s);
//         break;
//       case "shield":
//         twoDShape = createShieldShape(s);
//         break;
//       case "arrow":
//         twoDShape = createArrowShape(s);
//         break;
//       case "leaf":
//         twoDShape = createLeafShape(s);
//         break;
//       case "sword":
//         twoDShape = createSwordShape(s);
//         break;
//       case "butterfly":
//         twoDShape = createButterflyShape(s);
//         break;
//       default:
//         console.warn("Unknown custom shape type for R3F geometry:", shapeType);
//         twoDShape = new THREE.Shape()
//           .moveTo(-s / 2, -s / 2)
//           .lineTo(s / 2, -s / 2)
//           .lineTo(s / 2, s / 2)
//           .lineTo(-s / 2, s / 2)
//           .closePath();
//     }

//     const extrudeSettings = {
//       depth: extrudeDepth,
//       bevelEnabled: true,
//       bevelSegments: 2,
//       steps: 1,
//       bevelSize: extrudeDepth * 0.05,
//       bevelThickness: extrudeDepth * 0.05,
//     };
//     const geom = new THREE.ExtrudeGeometry(twoDShape, extrudeSettings);
//     geom.center();
//     return geom;
//   }, [shapeType, shapeSize, extrudeDepth]);

//   if (!geometry) return null;
//   // Use `args` for ExtrudeGeometry if you were extending it, but since it's a direct primitive:
//   return <primitive object={geometry} attach='geometry' />;
// }

// // Custom Pyramid Geometry Component (Internal)
// function PyramidGeometry(props) {
//   const geometry = useRef();
//   useEffect(() => {
//     if (!THREE || !geometry.current) return;
//     const vertices = new Float32Array([
//       -0.5, 0, -0.5, 0.5, 0, -0.5, 0.5, 0, 0.5, -0.5, 0, 0.5, 0, 1, 0,
//     ]);
//     const indices = [0, 1, 2, 0, 2, 3, 0, 4, 1, 1, 4, 2, 2, 4, 3, 3, 4, 0];
//     geometry.current.setIndex(indices);
//     geometry.current.setAttribute(
//       "position",
//       new THREE.Float32BufferAttribute(vertices, 3)
//     );
//     geometry.current.computeVertexNormals();
//   }, []);
//   return <bufferGeometry ref={geometry} {...props} />;
// }

// // Complete 3D Text Component for R3F Scene (Internal)
// function RealTextGeometry({ text = "", size = 0.5 }) {
//   const geomRef = useRef();
//   useEffect(() => {
//     if (!THREE || !geomRef.current) return;
//     if (!text) {
//       const placeholder = new THREE.BoxGeometry(0.01, 0.01, 0.01);
//       geomRef.current.copy(placeholder);
//       placeholder.dispose();
//       return;
//     }
//     const newGeometry = createTextGeometryForR3F(text, size); // Use the R3F specific helper
//     if (newGeometry) {
//       geomRef.current.copy(newGeometry);
//       newGeometry.dispose();
//     } else {
//       const placeholder = new THREE.BoxGeometry(
//         size * 0.5 || 0.1,
//         size || 0.1,
//         size * 0.2 || 0.1
//       );
//       geomRef.current.copy(placeholder);
//       placeholder.dispose();
//     }
//   }, [text, size]);
//   return <bufferGeometry ref={geomRef} />;
// }

// // Shape Component (Internal)
// function Shape({
//   position,
//   rotation,
//   scale,
//   geometry: geometryType,
//   material,
//   color,
//   isSelected,
//   onClick,
//   id,
//   text,
//   textSize,
//   shapeType,
//   shapeSize = 1,
//   extrudeDepth = 0.2,
// }) {
//   const renderGeometry = useMemo(() => {
//     switch (geometryType) {
//       case "box":
//         return <boxGeometry args={[1, 1, 1]} />;
//       case "sphere":
//         return <sphereGeometry args={[0.5, 32, 32]} />;
//       case "cylinder":
//         return <cylinderGeometry args={[0.5, 0.5, 1, 32]} />;
//       case "cone":
//         return <coneGeometry args={[0.5, 1, 32]} />;
//       case "torus":
//         return <torusGeometry args={[0.5, 0.2, 16, 100]} />;
//       case "pyramid":
//         return <PyramidGeometry />;
//       case "text":
//         return (
//           <Suspense fallback={<boxGeometry args={[1, 0.2, 0.1]} />}>
//             <RealTextGeometry text={text || ""} size={textSize || 0.5} />
//           </Suspense>
//         );
//       case "customExtruded":
//         return (
//           <ExtrudedCustomShapeGeometry
//             shapeType={shapeType}
//             shapeSize={shapeSize}
//             extrudeDepth={extrudeDepth}
//           />
//         );
//       default:
//         console.warn("Unknown geometry type in Shape component:", geometryType);
//         return <boxGeometry args={[1, 1, 1]} />;
//     }
//   }, [geometryType, text, textSize, shapeType, shapeSize, extrudeDepth]);

//   const renderMaterial = useMemo(() => {
//     const materialProps = { color };
//     switch (material) {
//       case "standard":
//         return <meshStandardMaterial {...materialProps} />;
//       case "basic":
//         return <meshBasicMaterial {...materialProps} />;
//       case "phong":
//         return <meshPhongMaterial {...materialProps} />;
//       case "wireframe":
//         return <meshBasicMaterial {...materialProps} wireframe />;
//       case "glass":
//         return (
//           <meshPhysicalMaterial
//             {...materialProps}
//             transparent
//             opacity={0.7}
//             roughness={0.1}
//             transmission={0.9}
//             metalness={0.1}
//           />
//         );
//       case "metal":
//         return (
//           <meshStandardMaterial
//             {...materialProps}
//             metalness={0.9}
//             roughness={0.1}
//           />
//         );
//       default:
//         return <meshStandardMaterial {...materialProps} />;
//     }
//   }, [material, color]);

//   return (
//     <mesh
//       position={position}
//       rotation={rotation}
//       scale={scale}
//       onClick={(e) => {
//         e.stopPropagation();
//         onClick(id);
//       }}
//       castShadow
//       receiveShadow
//       name={`shape_${id}_${geometryType}_${shapeType || ""}`}
//     >
//       {renderGeometry}
//       {renderMaterial}
//       {isSelected && <meshBasicMaterial color='#00ff00' wireframe />}
//     </mesh>
//   );
// }

// // Scene Lights Component (Internal)
// function Lights() {
//   return (
//     <>
//       <ambientLight intensity={0.4} />
//       <directionalLight
//         position={[10, 10, 5]}
//         intensity={1.0}
//         castShadow
//         shadow-mapSize-width={2048}
//         shadow-mapSize-height={2048}
//         shadow-camera-far={50}
//         shadow-camera-left={-10}
//         shadow-camera-right={10}
//         shadow-camera-top={10}
//         shadow-camera-bottom={-10}
//       />
//       <pointLight position={[-5, 5, -5]} color='#4080ff' intensity={0.3} />
//       <pointLight position={[5, 5, 5]} color='#ff8040' intensity={0.3} />
//     </>
//   );
// }

// // Transform Controls Wrapper (Internal)
// function TransformControlsWrapper({
//   children,
//   mode,
//   enabled,
//   onObjectChange,
//   onDraggingChanged,
// }) {
//   const three = useThree();
//   if (!three) return children;
//   const { camera, gl } = three;
//   return enabled && TransformControls ? (
//     <TransformControls
//       camera={camera}
//       domElement={gl.domElement}
//       mode={mode}
//       onObjectChange={onObjectChange}
//       onDraggingChanged={onDraggingChanged}
//     >
//       {children}
//     </TransformControls>
//   ) : (
//     children
//   );
// }

// // Main Scene Component (Exported)
// export function MainScene({
//   shapes,
//   selectedShapeId,
//   mode,
//   onShapeClick,
//   onShapeUpdate,
//   orbitControlsEnabled,
//   sceneRef,
// }) {
//   const three = useThree();
//   if (!three) return null;
//   const { scene } = three;

//   useEffect(() => {
//     if (sceneRef) sceneRef.current = scene;
//   }, [scene, sceneRef]);
//   return (
//     <>
//       <Lights />
//       <mesh
//         rotation={[-Math.PI / 2, 0, 0]}
//         position={[0, -0.1, 0]}
//         receiveShadow
//       >
//         <planeGeometry args={[20, 20]} />
//         <meshStandardMaterial color='#f8fafc' />
//       </mesh>
//       {Grid ? (
//         <Grid
//           args={[20, 20]}
//           position={[0, 0, 0]}
//           cellColor='#e2e8f0'
//           sectionColor='#cbd5e1'
//         />
//       ) : (
//         <gridHelper args={[20, 20, "#cbd5e1", "#e2e8f0"]} />
//       )}
//       {shapes.map((shapeData) => {
//         const isSelected = shapeData.id === selectedShapeId;
//         return (
//           <TransformControlsWrapper
//             key={shapeData.id}
//             mode={mode}
//             enabled={isSelected}
//             onObjectChange={() => onShapeUpdate(shapeData.id)}
//             onDraggingChanged={() => {}}
//           >
//             <Shape
//               {...shapeData}
//               isSelected={isSelected}
//               onClick={onShapeClick}
//             />
//           </TransformControlsWrapper>
//         );
//       })}
//       {OrbitControls && (
//         <OrbitControls
//           enabled={orbitControlsEnabled}
//           enableDamping
//           dampingFactor={0.05}
//         />
//       )}
//     </>
//   );
// }

// // Camera Controls Component (Exported)
// export function CameraController({ preset }) {
//   const three = useThree();
//   if (!three) return null;
//   const { camera } = three;

//   const cameraPresets = useMemo(
//     () => ({
//       top: { position: [0, 10, 0], target: [0, 0, 0] },
//       front: { position: [0, 0, 10], target: [0, 0, 0] },
//       side: { position: [10, 0, 0], target: [0, 0, 0] },
//       isometric: { position: [5, 5, 5], target: [0, 0, 0] },
//     }),
//     []
//   );
//   useEffect(() => {
//     if (preset && cameraPresets[preset] && camera) {
//       camera.position.set(...cameraPresets[preset].position);
//       camera.lookAt(...cameraPresets[preset].target);
//     }
//   }, [preset, camera, cameraPresets]);
//   return null;
// }

// SceneElements.jsx
// SceneElements.jsx
import { Suspense, useMemo, useRef, useEffect, useState } from "react"; // Added useState
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { RGBELoader } from "three-stdlib"; // Using three-stdlib for up-to-date loaders

// Conditional imports for R3F & Drei
let useFrame, useLoader, useThree, extend;
let OrbitControls, TransformControls, Grid, Environment;

import createLetterShape from "../../LetterShape/CreateLetterShape";
import createNumberShape from "../../LetterShape/CreateNumberShape";
import createSpecialCharShape from "../../LetterShape/CreateSpecialCharShape";

import {
  createHeartShape,
  createStarShape,
  createCrownShape,
  createLightningShape,
  createDiamondShape,
  createShieldShape,
  createArrowShape,
  createLeafShape,
  createSwordShape,
  createButterflyShape,
} from "../../LetterShape/PopulerShapes"; // Adjust path if necessary

try {
  const r3f = require("@react-three/fiber");
  useFrame = r3f.useFrame;
  useLoader = r3f.useLoader;
  useThree = r3f.useThree;
  extend = r3f.extend;
} catch (error) {
  console.warn("@react-three/fiber not available for SceneElements:", error);
}

try {
  const drei = require("@react-three/drei");
  OrbitControls = drei.OrbitControls;
  TransformControls = drei.TransformControls;
  Grid = drei.Grid;
  Environment = drei.Environment; // For easy HDR loading in R3F
} catch (error) {
  console.warn("@react-three/drei not available for SceneElements:", error);
}

// GLB Exporter
export function exportToGLB(scene, filename = "model.glb") {
  if (!THREE) {
    alert("THREE.js is not available for GLB export.");
    return;
  }
  const exporter = new GLTFExporter();
  const options = {
    binary: true,
    onlyVisible: true,
    truncateDrawRange: true,
    embedImages: true,
    animations: scene.animations || [],
  };
  exporter.parse(
    scene,
    (result) => {
      const blob = new Blob([result], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      alert(`GLB file exported successfully as ${filename}!`);
    },
    (error) => {
      console.error("GLB Export failed:", error);
      alert("GLB Export failed: " + error.message);
    },
    options
  );
}

// Internal helper for text geometry
const createTextGeometryForR3F = (text, size) => {
  if (!THREE) return new THREE.BoxGeometry(0.1, 0.1, 0.1);
  try {
    const textLength = text.length;
    const spacing = size * 0.8;
    const depth = size * 0.3;
    const charGeometries = [];

    for (let i = 0; i < textLength; i++) {
      const char = text[i];
      if (char === " ") continue;

      let characterShapes = [];
      const xOffset = (i - textLength / 2 + 0.5) * spacing;

      if (/[0-9]/.test(char))
        characterShapes = [createNumberShape(char, size)].filter(Boolean);
      else if (/[A-Za-z]/.test(char))
        characterShapes = [createLetterShape(char, size)].filter(Boolean);
      else {
        const specialShapes = createSpecialCharShape(char, size);
        if (specialShapes)
          characterShapes = Array.isArray(specialShapes)
            ? specialShapes
            : [specialShapes];
      }

      const extrudeSettings = {
        depth,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: size * 0.03,
        bevelThickness: size * 0.02,
      };

      characterShapes.forEach((shape) => {
        try {
          const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
          geom.translate(xOffset, 0, -depth / 2);
          geom.computeBoundingBox();
          charGeometries.push(geom);
        } catch (e) {
          console.warn(`Failed to extrude char ${char}:`, e);
        }
      });
    }

    if (charGeometries.length === 0)
      return new THREE.BoxGeometry(0.1, 0.1, 0.1);

    if (
      THREE.BufferGeometryUtils &&
      THREE.BufferGeometryUtils.mergeGeometries
    ) {
      const merged = THREE.BufferGeometryUtils.mergeGeometries(
        charGeometries,
        false
      );
      if (merged) {
        merged.center();
        charGeometries.forEach((g) => g.dispose());
        return merged;
      }
    }
    if (charGeometries.length === 1) {
      charGeometries[0].center();
      return charGeometries[0];
    }
    console.warn("Text geometry merge failed or multiple unmerged parts.");
    const placeholder = new THREE.BoxGeometry(
      text.length * size * 0.6 || 0.1,
      size || 0.1,
      depth || 0.1
    );
    charGeometries.forEach((g) => g.dispose());
    return placeholder;
  } catch (error) {
    console.error("Failed to create text geometry:", error);
    return new THREE.BoxGeometry(
      text.length * size * 0.6 || 0.1,
      size || 0.1,
      size * 0.3 || 0.1
    );
  }
};

// Helper function to create THREE.Mesh for GLB export
export const createMeshFromShape = (shapeData) => {
  if (!THREE) {
    console.error("THREE.js is not available for mesh creation.");
    return null;
  }
  try {
    let geometry;
    const extrudeDepth = shapeData.extrudeDepth || 0.2;
    const shapeSize = shapeData.shapeSize || 1;

    switch (shapeData.geometry) {
      case "box":
        geometry = new THREE.BoxGeometry(1, 1, 1);
        break;
      case "sphere":
        geometry = new THREE.SphereGeometry(0.5, 32, 32);
        break;
      case "cylinder":
        geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
        break;
      case "cone":
        geometry = new THREE.ConeGeometry(0.5, 1, 32);
        break;
      case "torus":
        geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);
        break;
      case "pyramid":
        const vertices = new Float32Array([
          -0.5, 0, -0.5, 0.5, 0, -0.5, 0.5, 0, 0.5, -0.5, 0, 0.5, 0, 1, 0,
        ]);
        const indices = [0, 1, 2, 0, 2, 3, 0, 4, 1, 1, 4, 2, 2, 4, 3, 3, 4, 0];
        geometry = new THREE.BufferGeometry();
        geometry.setIndex(indices);
        geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(vertices, 3)
        );
        geometry.computeVertexNormals();
        geometry.translate(0, -0.5, 0);
        break;
      case "text":
        geometry = createTextGeometryForR3F(
          shapeData.text || "3D",
          shapeData.textSize || 0.5
        );
        break;
      case "customExtruded":
        let twoDShape;
        const s = shapeSize;
        switch (shapeData.shapeType?.toLowerCase()) {
          case "heart":
            twoDShape = createHeartShape(s);
            break;
          case "star":
            twoDShape = createStarShape(5, s, s * 0.4);
            break;
          case "crown":
            twoDShape = createCrownShape(s);
            break;
          case "lightning":
            twoDShape = createLightningShape(s);
            break;
          case "diamond":
            twoDShape = createDiamondShape(s);
            break;
          case "shield":
            twoDShape = createShieldShape(s);
            break;
          case "arrow":
            twoDShape = createArrowShape(s);
            break;
          case "leaf":
            twoDShape = createLeafShape(s);
            break;
          case "sword":
            twoDShape = createSwordShape(s);
            break;
          case "butterfly":
            twoDShape = createButterflyShape(s);
            break;
          default:
            console.warn(
              "Unknown custom shape type for export:",
              shapeData.shapeType
            );
            twoDShape = new THREE.Shape()
              .moveTo(-s / 2, -s / 2)
              .lineTo(s / 2, -s / 2)
              .lineTo(s / 2, s / 2)
              .lineTo(-s / 2, s / 2)
              .closePath();
        }
        const extrudeSettings = {
          depth: extrudeDepth,
          bevelEnabled: true,
          bevelSegments: 2,
          steps: 1,
          bevelSize: extrudeDepth * 0.05,
          bevelThickness: extrudeDepth * 0.05,
        };
        geometry = new THREE.ExtrudeGeometry(twoDShape, extrudeSettings);
        geometry.center();
        break;
      default:
        geometry = new THREE.BoxGeometry(1, 1, 1);
    }

    let material;
    const color = new THREE.Color(shapeData.color);
    const pbrProps = {
      color,
      roughness: shapeData.roughness !== undefined ? shapeData.roughness : 0.5,
      metalness: shapeData.metalness !== undefined ? shapeData.metalness : 0.0,
    };

    switch (shapeData.material) {
      case "standard":
        material = new THREE.MeshStandardMaterial(pbrProps);
        break;
      case "physical":
        material = new THREE.MeshPhysicalMaterial({
          ...pbrProps,
          transmission: shapeData.material === "glass" ? 0.9 : 0,
          ior: shapeData.material === "glass" ? 1.5 : 1.45,
          thickness: shapeData.material === "glass" ? 0.1 : 0,
        });
        break;
      case "toon":
        material = new THREE.MeshToonMaterial({ color });
        break;
      case "basic":
        material = new THREE.MeshBasicMaterial({ color });
        break;
      case "lambert":
        material = new THREE.MeshLambertMaterial({ color });
        break;
      case "phong":
        material = new THREE.MeshPhongMaterial({ color, shininess: 30 });
        break;
      case "wireframe":
        material = new THREE.MeshBasicMaterial({ color, wireframe: true });
        break;
      default:
        material = new THREE.MeshStandardMaterial(pbrProps);
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...shapeData.position);
    mesh.rotation.set(...shapeData.rotation);
    mesh.scale.set(...shapeData.scale);
    mesh.name = `shape_${shapeData.id}_${shapeData.geometry}_${
      shapeData.shapeType || ""
    }`;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  } catch (error) {
    console.error("Failed to create mesh for shape:", shapeData, error);
    return null;
  }
};

// R3F Geometry Component for Custom Extruded Shapes
function ExtrudedCustomShapeGeometry({
  shapeType,
  shapeSize = 1,
  extrudeDepth = 0.2,
}) {
  const geometry = useMemo(() => {
    if (!THREE) return null;
    let twoDShape;
    const s = shapeSize;
    switch (shapeType?.toLowerCase()) {
      case "heart":
        twoDShape = createHeartShape(s);
        break;
      case "star":
        twoDShape = createStarShape(5, s, s * 0.4);
        break;
      case "crown":
        twoDShape = createCrownShape(s);
        break;
      case "lightning":
        twoDShape = createLightningShape(s);
        break;
      case "diamond":
        twoDShape = createDiamondShape(s);
        break;
      case "shield":
        twoDShape = createShieldShape(s);
        break;
      case "arrow":
        twoDShape = createArrowShape(s);
        break;
      case "leaf":
        twoDShape = createLeafShape(s);
        break;
      case "sword":
        twoDShape = createSwordShape(s);
        break;
      case "butterfly":
        twoDShape = createButterflyShape(s);
        break;
      default:
        console.warn("R3F: Unknown custom shape type:", shapeType);
        twoDShape = new THREE.Shape()
          .moveTo(-s / 2, -s / 2)
          .lineTo(s / 2, -s / 2)
          .lineTo(s / 2, s / 2)
          .lineTo(-s / 2, s / 2)
          .closePath();
    }
    const extrudeSettings = {
      depth: extrudeDepth,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: extrudeDepth * 0.05,
      bevelThickness: extrudeDepth * 0.05,
    };
    const geom = new THREE.ExtrudeGeometry(twoDShape, extrudeSettings);
    geom.center();
    return geom;
  }, [shapeType, shapeSize, extrudeDepth]);

  if (!geometry) return <boxGeometry args={[0.1, 0.1, 0.1]} />;
  return <primitive object={geometry} attach='geometry' />;
}

// Custom Pyramid Geometry Component
function PyramidGeometryR3F(props) {
  const geometry = useMemo(() => {
    if (!THREE) return null;
    const geom = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      -0.5, 0, -0.5, 0.5, 0, -0.5, 0.5, 0, 0.5, -0.5, 0, 0.5, 0, 1, 0,
    ]);
    const indices = [0, 1, 2, 0, 2, 3, 0, 4, 1, 1, 4, 2, 2, 4, 3, 3, 4, 0];
    geom.setIndex(indices);
    geom.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    geom.computeVertexNormals();
    geom.translate(0, -0.5, 0);
    return geom;
  }, []);
  if (!geometry) return <boxGeometry args={[0.1, 0.1, 0.1]} />;
  return <primitive object={geometry} attach='geometry' {...props} />;
}

// 3D Text Component for R3F Scene
function RealTextGeometryR3F({ text = "", size = 0.5 }) {
  const geometry = useMemo(() => {
    if (!text.trim()) return new THREE.BoxGeometry(0.01, 0.01, 0.01);
    return createTextGeometryForR3F(text, size);
  }, [text, size]);

  if (!geometry) return <boxGeometry args={[0.1, 0.1, 0.1]} />;
  return <primitive object={geometry} attach='geometry' />;
}

// --- Adjusted Shape component to accept and set a ref ---
function Shape({
  id,
  position,
  rotation,
  scale,
  geometry: geometryType,
  material: materialType,
  color,
  roughness,
  metalness,
  isSelected,
  onClick,
  text,
  textSize,
  shapeType,
  shapeSize = 1,
  extrudeDepth = 0.2,
  objectRef, // New prop to pass the ref
}) {
  const renderGeometry = useMemo(() => {
    switch (geometryType) {
      case "box":
        return <boxGeometry args={[1, 1, 1]} />;
      case "sphere":
        return <sphereGeometry args={[0.5, 32, 32]} />;
      case "cylinder":
        return <cylinderGeometry args={[0.5, 0.5, 1, 32]} />;
      case "cone":
        return <coneGeometry args={[0.5, 1, 32]} />;
      case "torus":
        return <torusGeometry args={[0.5, 0.2, 16, 100]} />;
      case "pyramid":
        return <PyramidGeometryR3F />;
      case "text":
        return (
          <Suspense fallback={<boxGeometry args={[0.5, 0.1, 0.05]} />}>
            <RealTextGeometryR3F text={text || ""} size={textSize || 0.5} />
          </Suspense>
        );
      case "customExtruded":
        return (
          <ExtrudedCustomShapeGeometry
            shapeType={shapeType}
            shapeSize={shapeSize}
            extrudeDepth={extrudeDepth}
          />
        );
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  }, [geometryType, text, textSize, shapeType, shapeSize, extrudeDepth]);

  const renderMaterial = useMemo(() => {
    const pbrProps = { color, roughness, metalness };
    switch (materialType) {
      case "standard":
        return <meshStandardMaterial {...pbrProps} />;
      case "physical":
        return (
          <meshPhysicalMaterial
            {...pbrProps}
            transmission={materialType === "glass" ? 0.95 : 0}
            ior={1.5}
            thickness={0.1}
          />
        );
      case "toon":
        return <meshToonMaterial color={color} />;
      case "basic":
        return <meshBasicMaterial color={color} />;
      case "lambert":
        return <meshLambertMaterial color={color} />;
      case "phong":
        return <meshPhongMaterial color={color} shininess={30} />;
      case "wireframe":
        return <meshBasicMaterial color={color} wireframe />;
      default:
        return <meshStandardMaterial {...pbrProps} />;
    }
  }, [materialType, color, roughness, metalness]);

  return (
    <mesh
      ref={objectRef} // Assign the ref here
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        onClick(id);
      }}
      castShadow
      receiveShadow
      name={`shape_${id}_${geometryType}_${shapeType || ""}`}
    >
      {renderGeometry}
      {renderMaterial}
      {/* Selected state wireframe is removed, TransformControls provides visual feedback */}
    </mesh>
  );
}

// Scene Lights and Environment
function SceneLighting() {
  const lightRef = useRef();
  // You can add useHelper here for debugging lights if needed:
  // import { useHelper } from "@react-three/drei";
  // import { DirectionalLightHelper } from "three";
  // if (lightRef.current) useHelper(lightRef, DirectionalLightHelper, 1, 'red');

  return (
    <>
      {Environment && (
        <Environment files='/brown_photostudio_02_4k.hdr' background={false} /> // Ensure environment.hdr is in /public
      )}
      <ambientLight intensity={0.3} />
      <directionalLight
        ref={lightRef}
        position={[8, 15, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-bias={-0.0005}
      />
      <pointLight position={[-10, -5, -10]} color='#ffddaa' intensity={0.2} />
      <hemisphereLight
        skyColor='#d1e1ff'
        groundColor='#b97a20'
        intensity={0.1}
      />
    </>
  );
}

// --- MainScene Component Adjustment ---
export function MainScene({
  shapes,
  selectedShapeId,
  mode,
  onShapeClick,
  onShapeUpdate,
  orbitControlsEnabled,
  sceneRef,
}) {
  const { scene, gl, camera } = useThree();
  const [transformObject, setTransformObject] = useState(null);
  const selectedObjectRef = useRef();

  useEffect(() => {
    if (sceneRef) sceneRef.current = scene;
    if (!scene.background && !Environment) {
      // Only set if Environment doesn't set it
      scene.background = new THREE.Color("#2d343c");
    }
  }, [scene, sceneRef]); // Removed Environment from deps, it's a component

  useEffect(() => {
    if (selectedShapeId && selectedObjectRef.current) {
      setTransformObject(selectedObjectRef.current);
    } else {
      // If the ref is cleared (e.g. shape deleted) or no selection
      if (transformObject && selectedObjectRef.current !== transformObject) {
        selectedObjectRef.current = null; // Explicitly nullify if object changed
      }
      setTransformObject(null);
    }
  }, [selectedShapeId, shapes, transformObject]); // Added transformObject to deps for consistency on clear

  // Effect to nullify selectedObjectRef when selection is cleared
  // This helps ensure the ref is correctly managed if the previously selected
  // object is deleted while still being "ref-ed".
  useEffect(() => {
    if (!selectedShapeId) {
      selectedObjectRef.current = null;
    }
  }, [selectedShapeId]);

  return (
    <>
      <SceneLighting />
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color='#44475a' roughness={0.8} metalness={0.2} />
      </mesh>

      {Grid && (
        <Grid
          args={[100, 100]}
          position={[0, 0, 0]}
          cellSize={1}
          cellThickness={0.5}
          cellColor='#6272a4'
          sectionSize={5}
          sectionThickness={1}
          sectionColor='#bd93f9'
          fadeDistance={50}
          fadeStrength={1}
          infiniteGrid
        />
      )}

      {/* Render all shapes */}
      {shapes.map((shapeData) => (
        <Shape
          key={shapeData.id}
          {...shapeData}
          isSelected={shapeData.id === selectedShapeId} // Still pass isSelected for potential other uses
          onClick={onShapeClick}
          objectRef={
            shapeData.id === selectedShapeId ? selectedObjectRef : null
          }
        />
      ))}

      {/* Render TransformControls if an object is selected and ready */}
      {selectedShapeId && transformObject && TransformControls && (
        <TransformControls
          object={transformObject}
          mode={mode}
          onObjectChange={() => onShapeUpdate(selectedShapeId)}
          onDraggingChanged={(event) => {
            // Access OrbitControls via the `controls` object from useThree()
            // if OrbitControls has `makeDefault` prop
            const controls = scene.__r3f?.controls; // Safely access
            if (controls) {
              controls.enabled = !event.value;
            }
          }}
          size={0.75}
          // Explicitly pass camera and domElement for robustness
          camera={camera}
          domElement={gl.domElement}
        />
      )}

      {OrbitControls && (
        <OrbitControls
          enabled={orbitControlsEnabled}
          makeDefault // Important for R3F to manage controls state
          enableDamping
          dampingFactor={0.05}
          minDistance={1}
          maxDistance={50}
        />
      )}
    </>
  );
}

// Camera Controller
export function CameraController({ preset }) {
  const { camera } = useThree(); // Get controls directly if OrbitControls is makeDefault
  const controls = useThree((state) => state.controls);

  const cameraPresets = useMemo(
    () => ({
      top: { position: [0, 15, 0.1], target: [0, 0, 0] },
      front: { position: [0, 2, 15], target: [0, 1, 0] },
      side: { position: [15, 2, 0], target: [0, 1, 0] },
      isometric: { position: [10, 10, 10], target: [0, 0, 0] },
    }),
    []
  );

  useEffect(() => {
    if (preset && cameraPresets[preset] && camera) {
      const { position, target } = cameraPresets[preset];
      camera.position.set(...position);
      if (controls && typeof controls.target?.set === "function") {
        // Check if controls and target.set exist
        controls.target.set(...target);
        if (typeof controls.update === "function") controls.update();
      } else {
        camera.lookAt(new THREE.Vector3(...target)); // Use THREE.Vector3 for lookAt
      }
      camera.updateProjectionMatrix(); // Ensure camera updates
    }
  }, [preset, camera, controls, cameraPresets]);

  return null;
}
