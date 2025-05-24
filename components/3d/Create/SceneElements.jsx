// import { Suspense, useMemo, useRef, useEffect, useState } from "react";
// import * as THREE from "three";
// import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

// // Shape creation utilities (ensure paths are correct)
// import createLetterShape from "../../LetterShape/CreateLetterShape";
// import createNumberShape from "../../LetterShape/CreateNumberShape";
// import createSpecialCharShape from "../../LetterShape/CreateSpecialCharShape";
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
// } from "../../LetterShape/PopularShapes";

// let useFrame, useLoader, useThree, extend;
// let OrbitControls, TransformControls, Grid, Environment;

// try {
//   const r3f = require("@react-three/fiber");
//   useFrame = r3f.useFrame;
//   useLoader = r3f.useLoader;
//   useThree = r3f.useThree;
//   extend = r3f.extend;
// } catch (error) {
//   console.warn("@react-three/fiber not available:", error);
// }

// try {
//   const drei = require("@react-three/drei");
//   OrbitControls = drei.OrbitControls;
//   TransformControls = drei.TransformControls;
//   Grid = drei.Grid;
//   Environment = drei.Environment;
// } catch (error) {
//   console.warn("@react-three/drei not available:", error);
// }

// export function exportToGLB(scene, filename = "model.glb") {
//   // ... (no changes here, assumed correct from previous)
//   if (!THREE || !GLTFExporter) {
//     alert("THREE.js or GLTFExporter is not available for GLB export.");
//     return;
//   }
//   const exporter = new GLTFExporter();
//   const options = {
//     binary: true,
//     onlyVisible: true,
//     truncateDrawRange: true,
//     embedImages: true,
//     animations: scene.animations || [],
//   };
//   exporter.parse(
//     scene,
//     (result) => {
//       const blob = new Blob([result], { type: "application/octet-stream" });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = filename;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
//       alert(`GLB file exported successfully as ${filename}!`);
//     },
//     (error) => {
//       console.error("GLB Export failed:", error);
//       alert("GLB Export failed: " + (error.message || String(error)));
//     },
//     options
//   );
// }

// const createTextGeometryForR3F = (text, size) => {
//   // ... (no changes here, assumed correct from previous)
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
//         bevelSegments: 2,
//         steps: 1,
//         bevelSize: size * 0.03,
//         bevelThickness: size * 0.02,
//       };
//       characterShapes.forEach((shape) => {
//         try {
//           const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
//           geom.translate(xOffset, 0, -depth / 2);
//           charGeometries.push(geom);
//         } catch (e) {
//           console.warn(`Failed to extrude char ${char}:`, e);
//         }
//       });
//     }

//     if (charGeometries.length === 0)
//       return new THREE.BoxGeometry(0.1, 0.1, 0.1);
//     if (
//       THREE.BufferGeometryUtils &&
//       THREE.BufferGeometryUtils.mergeGeometries
//     ) {
//       const merged = THREE.BufferGeometryUtils.mergeGeometries(
//         charGeometries,
//         false
//       );
//       if (merged) {
//         merged.center();
//         charGeometries.forEach((g) => g.dispose());
//         return merged;
//       }
//     }
//     if (charGeometries.length === 1) {
//       charGeometries[0].center();
//       return charGeometries[0];
//     }

//     console.warn(
//       "Text geometry merge failed or multiple unmerged parts. Using placeholder."
//     );
//     const placeholder = new THREE.BoxGeometry(
//       text.length * size * 0.6 || 0.1,
//       size || 0.1,
//       depth || 0.1
//     );
//     charGeometries.forEach((g) => g.dispose());
//     return placeholder;
//   } catch (error) {
//     console.error("Failed to create text geometry:", error);
//     return new THREE.BoxGeometry(
//       text.length * size * 0.6 || 0.1,
//       size || 0.1,
//       size * 0.3 || 0.1
//     );
//   }
// };

// export const createMeshFromShape = (shapeData) => {
//   // ... (no changes here, assumed correct from previous)
//   if (!THREE) {
//     console.error("THREE.js is not available.");
//     return null;
//   }
//   try {
//     let geometry;
//     const shapeTypeProp = shapeData.type || shapeData.geometry;
//     const extrudeDepth = shapeData.extrudeDepth || 0.2;
//     const shapeSize = shapeData.shapeSize || 1;

//     switch (shapeTypeProp) {
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
//         geometry.translate(0, -0.5, 0);
//         break;
//       case "text":
//         geometry = createTextGeometryForR3F(
//           shapeData.text || "3D",
//           shapeData.textSize || 0.5
//         );
//         break;
//       case "customExtruded":
//         let twoDShape;
//         const s = shapeSize;
//         switch (shapeData.shapeType?.toLowerCase()) {
//           case "heart":
//             twoDShape = createHeartShape(s);
//             break;
//           case "star":
//             twoDShape = createStarShape(5, s, s * 0.4);
//             break;
//           case "crown":
//             twoDShape = createCrownShape(s);
//             break;
//           case "lightning":
//             twoDShape = createLightningShape(s);
//             break;
//           case "diamond":
//             twoDShape = createDiamondShape(s);
//             break;
//           case "shield":
//             twoDShape = createShieldShape(s);
//             break;
//           case "arrow":
//             twoDShape = createArrowShape(s);
//             break;
//           case "leaf":
//             twoDShape = createLeafShape(s);
//             break;
//           case "sword":
//             twoDShape = createSwordShape(s);
//             break;
//           case "butterfly":
//             twoDShape = createButterflyShape(s);
//             break;
//           default:
//             twoDShape = new THREE.Shape()
//               .moveTo(-s / 2, -s / 2)
//               .lineTo(s / 2, -s / 2)
//               .lineTo(s / 2, s / 2)
//               .lineTo(-s / 2, s / 2)
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
//       case "importedGLB":
//         console.warn(
//           "createMeshFromShape called for 'importedGLB'. This should be skipped or handled by cloning."
//         );
//         return null;
//       default:
//         geometry = new THREE.BoxGeometry(1, 1, 1);
//     }

//     let material;
//     const color = new THREE.Color(shapeData.color || "#ffffff");
//     const pbrProps = {
//       color,
//       roughness: shapeData.roughness !== undefined ? shapeData.roughness : 0.5,
//       metalness: shapeData.metalness !== undefined ? shapeData.metalness : 0.0,
//     };
//     switch (shapeData.material) {
//       case "standard":
//         material = new THREE.MeshStandardMaterial(pbrProps);
//         break;
//       case "physical":
//         material = new THREE.MeshPhysicalMaterial(pbrProps);
//         break;
//       case "toon":
//         material = new THREE.MeshToonMaterial({ color });
//         break;
//       case "basic":
//         material = new THREE.MeshBasicMaterial({ color });
//         break;
//       case "lambert":
//         material = new THREE.MeshLambertMaterial({ color });
//         break;
//       case "phong":
//         material = new THREE.MeshPhongMaterial({ color, shininess: 30 });
//         break;
//       case "wireframe":
//         material = new THREE.MeshBasicMaterial({ color, wireframe: true });
//         break;
//       default:
//         material = new THREE.MeshStandardMaterial(pbrProps);
//     }

//     const mesh = new THREE.Mesh(geometry, material);
//     mesh.position.fromArray(shapeData.position);
//     mesh.rotation.fromArray(shapeData.rotation);
//     mesh.scale.fromArray(shapeData.scale);
//     mesh.name = `shape_${shapeData.id}_${shapeTypeProp}_${
//       shapeData.name || shapeData.shapeType || ""
//     }`;
//     mesh.castShadow = true;
//     mesh.receiveShadow = true;
//     return mesh;
//   } catch (error) {
//     console.error("Failed to create mesh for shape:", shapeData, error);
//     return null;
//   }
// };

// function ExtrudedCustomShapeGeometry({
//   shapeType,
//   shapeSize = 1,
//   extrudeDepth = 0.2,
// }) {
//   // ... (no changes here, assumed correct from previous)
//   const geometry = useMemo(() => {
//     if (!THREE) return null;
//     let twoDShape;
//     const s = shapeSize;
//     switch (shapeType?.toLowerCase()) {
//       case "heart":
//         twoDShape = createHeartShape(s);
//         break;
//       case "star":
//         twoDShape = createStarShape(5, s, s * 0.4);
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

//   if (!geometry) return <boxGeometry args={[0.1, 0.1, 0.1]} />;
//   return <primitive object={geometry} attach='geometry' />;
// }

// function PyramidGeometryR3F(props) {
//   // ... (no changes here, assumed correct from previous)
//   const geometry = useMemo(() => {
//     if (!THREE) return null;
//     const geom = new THREE.BufferGeometry();
//     const vertices = new Float32Array([
//       -0.5, 0, -0.5, 0.5, 0, -0.5, 0.5, 0, 0.5, -0.5, 0, 0.5, 0, 1, 0,
//     ]);
//     const indices = [0, 1, 2, 0, 2, 3, 0, 4, 1, 1, 4, 2, 2, 4, 3, 3, 4, 0];
//     geom.setIndex(indices);
//     geom.setAttribute(
//       "position",
//       new THREE.Float32BufferAttribute(vertices, 3)
//     );
//     geom.computeVertexNormals();
//     geom.translate(0, -0.5, 0);
//     return geom;
//   }, []);
//   if (!geometry) return <boxGeometry args={[0.1, 0.1, 0.1]} />;
//   return <primitive object={geometry} attach='geometry' {...props} />;
// }

// function RealTextGeometryR3F({ text = "", size = 0.5 }) {
//   // ... (no changes here, assumed correct from previous)
//   const geometry = useMemo(() => {
//     if (!text.trim()) return new THREE.BoxGeometry(0.01, 0.01, 0.01);
//     return createTextGeometryForR3F(text, size);
//   }, [text, size]);

//   if (!geometry) return <boxGeometry args={[0.1, 0.1, 0.1]} />;
//   return <primitive object={geometry} attach='geometry' />;
// }

// // Helper THREE.Vector3 instances for rotation axis in Shape component
// const xAxis = new THREE.Vector3(1, 0, 0);
// const yAxis = new THREE.Vector3(0, 1, 0);
// const zAxis = new THREE.Vector3(0, 0, 1);

// function Shape({
//   id,
//   position,
//   rotation,
//   scale,
//   type,
//   material: materialType,
//   color,
//   roughness,
//   metalness,
//   name,
//   onClick,
//   text,
//   textSize,
//   shapeType,
//   shapeSize = 1,
//   extrudeDepth = 0.2,
//   objectRef,
//   animation,
//   isAnimating,
//   isTransformDragging,
//   gltfModelScene,
// }) {
//   const localMeshRef = useRef(null);
//   const orbitAngleRef = useRef(Math.random() * Math.PI * 2);

//   const livePosition = useRef(new THREE.Vector3().fromArray(position));
//   const liveRotation = useRef(new THREE.Euler().fromArray(rotation));
//   const liveScale = useRef(new THREE.Vector3().fromArray(scale));

//   useEffect(() => {
//     if (objectRef) objectRef.current = localMeshRef.current;
//     return () => {
//       if (objectRef && objectRef.current === localMeshRef.current)
//         objectRef.current = null;
//     };
//   }, [objectRef, localMeshRef]);

//   useEffect(() => {
//     livePosition.current.fromArray(position);
//   }, [position]);
//   useEffect(() => {
//     liveRotation.current.fromArray(rotation);
//   }, [rotation]);
//   useEffect(() => {
//     liveScale.current.fromArray(scale);
//   }, [scale]);

//   useFrame((state, delta) => {
//     if (!localMeshRef.current) return;

//     localMeshRef.current.scale.copy(liveScale.current);

//     if (
//       !isAnimating ||
//       isTransformDragging ||
//       !animation ||
//       animation.type === "none"
//     ) {
//       localMeshRef.current.position.copy(livePosition.current);
//       localMeshRef.current.rotation.copy(liveRotation.current);
//       return;
//     }

//     const effectiveSpeed = (animation.speed || 1) * delta;
//     switch (animation.type) {
//       case "rotate":
//         let rotationAxis;
//         if (animation.axis === "x") rotationAxis = xAxis;
//         else if (animation.axis === "z") rotationAxis = zAxis;
//         else rotationAxis = yAxis; // Default to Y axis

//         // Rotate on the object's local axis
//         localMeshRef.current.rotateOnAxis(rotationAxis, effectiveSpeed);

//         // Update liveRotation (Euler) to reflect the new orientation
//         liveRotation.current.copy(localMeshRef.current.rotation);
//         break;
//       case "orbit":
//         orbitAngleRef.current += effectiveSpeed * 0.2;
//         const radius = animation.orbitRadius || 5;
//         const cX = animation.orbitCenter?.[0] || 0;
//         const cY = animation.orbitCenter?.[1] || livePosition.current.y;
//         const cZ = animation.orbitCenter?.[2] || 0;
//         const plane = animation.orbitPlane || "xz";

//         if (plane === "xz")
//           localMeshRef.current.position.set(
//             cX + Math.cos(orbitAngleRef.current) * radius,
//             cY,
//             cZ + Math.sin(orbitAngleRef.current) * radius
//           );
//         else if (plane === "xy")
//           localMeshRef.current.position.set(
//             cX + Math.cos(orbitAngleRef.current) * radius,
//             cY + Math.sin(orbitAngleRef.current) * radius,
//             cZ
//           );
//         else if (plane === "yz")
//           localMeshRef.current.position.set(
//             cX,
//             cY + Math.cos(orbitAngleRef.current) * radius,
//             cZ + Math.sin(orbitAngleRef.current) * radius
//           );

//         livePosition.current.copy(localMeshRef.current.position);
//         break;
//       default:
//         localMeshRef.current.position.copy(livePosition.current);
//         localMeshRef.current.rotation.copy(liveRotation.current);
//         break;
//     }
//   });

//   useEffect(() => {
//     if (localMeshRef.current && !isTransformDragging) {
//       localMeshRef.current.position.fromArray(position);
//       localMeshRef.current.rotation.fromArray(rotation);
//       localMeshRef.current.scale.fromArray(scale);

//       livePosition.current.fromArray(position);
//       liveRotation.current.fromArray(rotation);
//       liveScale.current.fromArray(scale);
//     }
//   }, [position, rotation, scale, isTransformDragging]);

//   const proceduralGeometry = useMemo(() => {
//     // ... (no changes here)
//     switch (type) {
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
//         return <PyramidGeometryR3F />;
//       case "text":
//         return (
//           <Suspense fallback={null}>
//             <RealTextGeometryR3F text={text || ""} size={textSize || 0.5} />
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
//         return null;
//     }
//   }, [type, text, textSize, shapeType, shapeSize, extrudeDepth]);

//   const proceduralMaterial = useMemo(() => {
//     // ... (no changes here)
//     if (type === "importedGLB") return null;
//     const pbrProps = { color, roughness, metalness };
//     switch (materialType) {
//       case "standard":
//         return <meshStandardMaterial {...pbrProps} />;
//       case "physical":
//         return (
//           <meshPhysicalMaterial
//             {...pbrProps}
//             transmission={0}
//             ior={1.5}
//             thickness={0.1}
//           />
//         );
//       case "toon":
//         return <meshToonMaterial color={color} />;
//       case "basic":
//         return <meshBasicMaterial color={color} />;
//       case "lambert":
//         return <meshLambertMaterial color={color} />;
//       case "phong":
//         return <meshPhongMaterial color={color} shininess={30} />;
//       case "wireframe":
//         return <meshBasicMaterial color={color} wireframe />;
//       default:
//         return <meshStandardMaterial {...pbrProps} />;
//     }
//   }, [type, materialType, color, roughness, metalness]);

//   const objectName = `shape_${id}_${type}_${name || shapeType || ""}`;

//   if (type === "importedGLB") {
//     if (!gltfModelScene) return null;
//     return (
//       <primitive
//         ref={localMeshRef}
//         object={gltfModelScene}
//         onClick={(e) => {
//           e.stopPropagation();
//           onClick(id, e);
//         }}
//         name={objectName}
//         onPointerOver={(e) => e.stopPropagation()}
//         onPointerOut={(e) => e.stopPropagation()}
//       />
//     );
//   } else {
//     return (
//       <mesh
//         ref={localMeshRef}
//         onClick={(e) => {
//           e.stopPropagation();
//           onClick(id, e);
//         }}
//         castShadow
//         receiveShadow
//         name={objectName}
//         onPointerOver={(e) => e.stopPropagation()}
//         onPointerOut={(e) => e.stopPropagation()}
//       >
//         {proceduralGeometry}
//         {proceduralMaterial}
//       </mesh>
//     );
//   }
// }

// function SceneLighting() {
//   // ... (no changes here, assumed correct from previous)
//   const lightRef = useRef();
//   const hdrPath = "/brown_photostudio_02_4k.hdr";

//   return (
//     <>
//       {Environment && typeof Environment !== "string" ? (
//         <Suspense fallback={null}>
//           <Environment files={hdrPath} background={false} blur={0.5} />
//         </Suspense>
//       ) : (
//         <directionalLight intensity={0.2} position={[0, 0, 0]} />
//       )}
//       <ambientLight intensity={0.6} />
//       <directionalLight
//         ref={lightRef}
//         position={[8, 15, 10]}
//         intensity={1.5}
//         castShadow
//         shadow-mapSize-width={2048}
//         shadow-mapSize-height={2048}
//         shadow-camera-far={50}
//         shadow-camera-left={-15}
//         shadow-camera-right={15}
//         shadow-camera-top={15}
//         shadow-camera-bottom={-15}
//         shadow-bias={-0.0005}
//       />
//       <pointLight position={[-10, -10, -10]} color='#ffeedd' intensity={0.5} />
//       <hemisphereLight
//         skyColor='#e6e6ff'
//         groundColor='#b0b0b0'
//         intensity={0.3}
//       />
//     </>
//   );
// }

// export function MainScene({
//   shapes,
//   selectedShapeId,
//   mode,
//   onShapeClick,
//   onShapeUpdate,
//   orbitControlsEnabled,
//   sceneRef,
//   isAnimating,
//   loadedGltfObjects,
// }) {
//   const { scene, gl, camera } = useThree();
//   const [transformObject, setTransformObject] = useState(null);

//   // This ref is passed to the selected Shape component.
//   // The Shape component's useEffect will assign its localMeshRef.current to this.
//   const selectedObjectInternalRef = useRef(null);
//   const [isTransformDragging, setIsTransformDragging] = useState(false);

//   useEffect(() => {
//     if (sceneRef) sceneRef.current = scene;
//   }, [scene, sceneRef]);

//   // CRITICAL: Update the object for TransformControls when selectedShapeId changes
//   // OR when the selectedObjectInternalRef.current (the actual THREE object) gets populated/changed.
//   useEffect(() => {
//     if (selectedShapeId && selectedObjectInternalRef.current) {
//       // console.log("MainScene: Setting transformObject to:", selectedObjectInternalRef.current?.name);
//       setTransformObject(selectedObjectInternalRef.current);
//     } else {
//       // console.log("MainScene: Clearing transformObject");
//       setTransformObject(null);
//     }
//     // The dependency on selectedObjectInternalRef.current is a bit tricky because refs don't trigger re-renders.
//     // However, the selection change (selectedShapeId) OR the re-render of shapes list when a shape is selected
//     // (which causes the `objectRef` prop to be passed to the correct `Shape` instance)
//     // should make this effect run at the right times.
//   }, [selectedShapeId, shapes]); // Adding `shapes` here ensures if the list re-renders, we re-evaluate

//   // Ensure transformObject is cleared if selectedShapeId becomes null or invalid
//   useEffect(() => {
//     if (!selectedShapeId) {
//       // console.log("MainScene: selectedShapeId is null, clearing transformObject and ref");
//       setTransformObject(null);
//       if (selectedObjectInternalRef.current)
//         selectedObjectInternalRef.current = null;
//     } else {
//       // If selectedShapeId is valid, but selectedObjectInternalRef is not yet set for it,
//       // the previous useEffect (dependent on shapes) should handle setting transformObject
//       // once the ref is populated by the Shape component.
//       const shapeExists = shapes.some((s) => s.id === selectedShapeId);
//       if (!shapeExists && selectedShapeId) {
//         // Selected ID points to a non-existent shape
//         // console.log("MainScene: selectedShapeId points to non-existent shape, clearing.");
//         setTransformObject(null);
//         if (selectedObjectInternalRef.current)
//           selectedObjectInternalRef.current = null;
//       }
//     }
//   }, [selectedShapeId, shapes]);

//   return (
//     <>
//       <SceneLighting />
//       <mesh
//         rotation={[-Math.PI / 2, 0, 0]}
//         position={[0, -0.01, 0]}
//         receiveShadow
//         name='ground_plane'
//       >
//         <planeGeometry args={[100, 100]} />
//         <shadowMaterial opacity={0.3} />
//       </mesh>

//       {Grid && typeof Grid !== "string" && (
//         <Grid
//           args={[100, 100]}
//           position={[0, 0, 0]}
//           cellSize={1}
//           cellThickness={0.6}
//           cellColor={new THREE.Color("#6f6f6f")}
//           sectionSize={5}
//           sectionThickness={1}
//           sectionColor={new THREE.Color("#9d4b4b")}
//           fadeDistance={60}
//           fadeStrength={1}
//           infiniteGrid
//           followCamera={false}
//         />
//       )}

//       {shapes.map((shapeData) => {
//         const gltfSceneForShape =
//           shapeData.type === "importedGLB"
//             ? loadedGltfObjects[shapeData.id]?.scene
//             : null;

//         if (shapeData.type === "importedGLB" && !gltfSceneForShape) {
//           return null;
//         }

//         return (
//           <Shape
//             key={shapeData.id}
//             {...shapeData}
//             gltfModelScene={gltfSceneForShape}
//             animation={shapeData.animation}
//             isAnimating={isAnimating}
//             onClick={onShapeClick}
//             objectRef={
//               shapeData.id === selectedShapeId
//                 ? selectedObjectInternalRef
//                 : null
//             }
//             isTransformDragging={
//               shapeData.id === selectedShapeId && isTransformDragging
//             }
//           />
//         );
//       })}

//       {/* Conditional rendering for TransformControls */}
//       {selectedShapeId &&
//         transformObject &&
//         mode &&
//         TransformControls &&
//         typeof TransformControls !== "string" && (
//           <TransformControls
//             object={transformObject}
//             mode={mode} // Ensure this is "rotate" when you want to rotate
//             // onObjectChange is important for updating state after transform.
//             // It fires when the transform is committed (e.g., mouse up after drag).
//             onObjectChange={() => {
//               if (selectedShapeId && transformObject) {
//                 // console.log("TransformControls: onObjectChange triggered for", transformObject.name);
//                 onShapeUpdate(selectedShapeId); // This calls saveState in Model3DCreator
//               }
//             }}
//             // onDraggingChanged is for managing OrbitControls and isTransformDragging state.
//             onDraggingChanged={(event) => {
//               const dragging = event.value;
//               // console.log("TransformControls: onDraggingChanged - dragging:", dragging);
//               setIsTransformDragging(dragging);
//               const orbitCtrl = scene.__r3f?.controls;
//               if (orbitCtrl) {
//                 orbitCtrl.enabled = !dragging && orbitControlsEnabled;
//               }
//               // If you want to save state ONLY when dragging stops:
//               // if (!dragging && selectedShapeId && transformObject) {
//               //    onShapeUpdate(selectedShapeId);
//               // }
//             }}
//             size={0.75}
//             space={mode === "translate" ? "world" : "local"} // "local" is crucial for rotation
//             camera={camera}
//             domElement={gl.domElement}
//             // Make sure TransformControls itself doesn't block pointer events for its gizmos
//             // This is usually handled internally by Drei's component.
//           />
//         )}

//       {OrbitControls && typeof OrbitControls !== "string" && (
//         <OrbitControls
//           enabled={orbitControlsEnabled && !isTransformDragging} // Disable while transform dragging
//           makeDefault
//           enableDamping
//           dampingFactor={0.05}
//           minDistance={1}
//           maxDistance={100}
//           zoomSpeed={0.7}
//           panSpeed={0.7}
//         />
//       )}
//     </>
//   );
// }

// export function CameraController({ preset }) {
//   // ... (no changes here, assumed correct from previous)
//   const { camera } = useThree();
//   const controls = useThree((state) => state.controls);

//   const cameraPresets = useMemo(
//     () => ({
//       top: { position: [0, 15, 0.01], target: [0, 0, 0] },
//       front: { position: [0, 2, 15], target: [0, 1, 0] },
//       side: { position: [15, 2, 0], target: [0, 1, 0] },
//       isometric: { position: [10, 10, 10], target: [0, 0, 0] },
//     }),
//     []
//   );

//   useEffect(() => {
//     if (preset && cameraPresets[preset] && camera) {
//       const { position, target } = cameraPresets[preset];
//       camera.position.set(...position);
//       if (controls && controls.target) {
//         controls.target.set(...target);
//         controls.update();
//       } else {
//         camera.lookAt(new THREE.Vector3(...target));
//       }
//       camera.updateProjectionMatrix();
//     }
//   }, [preset, camera, controls, cameraPresets]);

//   return null;
// }

import { Suspense, useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

// Shape creation utilities
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
} from "../../LetterShape/PopularShapes"; // Ensure paths are correct

let useFrame, useLoader, useThree, extend;
let OrbitControls, TransformControls, Grid, Environment;

try {
  const r3f = require("@react-three/fiber");
  useFrame = r3f.useFrame;
  useLoader = r3f.useLoader; // Needed for imagePlane texture
  useThree = r3f.useThree;
  extend = r3f.extend;
} catch (error) {
  console.warn("@react-three/fiber not available:", error);
}

try {
  const drei = require("@react-three/drei");
  OrbitControls = drei.OrbitControls;
  TransformControls = drei.TransformControls;
  Grid = drei.Grid;
  Environment = drei.Environment;
} catch (error) {
  console.warn("@react-three/drei not available:", error);
}

export function exportToGLB(scene, filename = "model.glb") {
  if (!THREE || !GLTFExporter) {
    alert("THREE.js or GLTFExporter is not available for GLB export.");
    return;
  }
  const exporter = new GLTFExporter();
  const options = {
    binary: true,
    onlyVisible: true,
    truncateDrawRange: true,
    embedImages: true, // Crucial for image planes
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
      alert("GLB Export failed: " + (error.message || String(error)));
    },
    options
  );
}

const createTextGeometryForR3F = (text, size) => {
  // ... (no changes from your provided code)
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

    console.warn(
      "Text geometry merge failed or multiple unmerged parts. Using placeholder."
    );
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

// Updated createMeshFromShape to handle imagePlane and be async for texture loading
export const createMeshFromShape = async (shapeData) => {
  if (!THREE) {
    console.error("THREE.js is not available.");
    return null;
  }
  try {
    let geometry;
    const shapeTypeProp = shapeData.type || shapeData.geometry;
    const extrudeDepth = shapeData.extrudeDepth || 0.2;
    const shapeSize = shapeData.shapeSize || 1;

    switch (shapeTypeProp) {
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
        const pyramidGeom = new THREE.BufferGeometry();
        const pyramidVertices = new Float32Array([
          -0.5, 0, -0.5, 0.5, 0, -0.5, 0.5, 0, 0.5, -0.5, 0, 0.5, 0, 1, 0,
        ]);
        const pyramidIndices = [
          0, 1, 2, 0, 2, 3, 0, 4, 1, 1, 4, 2, 2, 4, 3, 3, 4, 0,
        ];
        pyramidGeom.setIndex(pyramidIndices);
        pyramidGeom.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(pyramidVertices, 3)
        );
        pyramidGeom.computeVertexNormals();
        pyramidGeom.translate(0, -0.5, 0);
        geometry = pyramidGeom;
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
      case "imagePlane":
        geometry = new THREE.PlaneGeometry(
          shapeData.planeWidth || 1,
          shapeData.planeHeight || 1
        );
        break; // Material handled below
      case "importedGLB":
        console.warn(
          "createMeshFromShape called for 'importedGLB'. This should be skipped or handled by cloning."
        );
        return null;
      default:
        geometry = new THREE.BoxGeometry(1, 1, 1);
    }

    let material;
    if (shapeTypeProp === "imagePlane") {
      if (!shapeData.imageDataUrl) {
        console.warn("ImagePlane has no imageDataUrl for export.");
        material = new THREE.MeshBasicMaterial({
          color: 0xcccccc,
          side: THREE.DoubleSide,
        });
      } else {
        const textureLoader = new THREE.TextureLoader();
        // TextureLoader.load with data URL is effectively synchronous for the main part
        // but to be absolutely safe for exporter, ensure it's loaded.
        // For GLTFExporter, having texture.image set is often enough.
        const texture = await new Promise((resolve, reject) => {
          textureLoader.load(
            shapeData.imageDataUrl,
            resolve,
            undefined,
            reject
          );
        });
        texture.colorSpace = THREE.SRGBColorSpace; // Ensure correct color space
        material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true,
        });
      }
    } else {
      const color = new THREE.Color(shapeData.color || "#ffffff");
      const pbrProps = {
        color,
        roughness:
          shapeData.roughness !== undefined ? shapeData.roughness : 0.5,
        metalness:
          shapeData.metalness !== undefined ? shapeData.metalness : 0.0,
      };
      switch (shapeData.material) {
        case "standard":
          material = new THREE.MeshStandardMaterial(pbrProps);
          break;
        case "physical":
          material = new THREE.MeshPhysicalMaterial(pbrProps);
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
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.fromArray(shapeData.position);
    mesh.rotation.fromArray(shapeData.rotation);
    mesh.scale.fromArray(shapeData.scale);
    mesh.name = `shape_${shapeData.id}_${shapeTypeProp}_${
      shapeData.name || shapeData.shapeType || ""
    }`;
    mesh.castShadow = shapeTypeProp !== "imagePlane"; // Image planes usually don't cast shadows by default
    mesh.receiveShadow = true;
    return mesh;
  } catch (error) {
    console.error("Failed to create mesh for shape:", shapeData, error);
    return null;
  }
};

function ExtrudedCustomShapeGeometry({
  shapeType,
  shapeSize = 1,
  extrudeDepth = 0.2,
}) {
  // ... (no changes from your provided code)
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

function PyramidGeometryR3F(props) {
  // ... (no changes from your provided code)
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

function RealTextGeometryR3F({ text = "", size = 0.5 }) {
  // ... (no changes from your provided code)
  const geometry = useMemo(() => {
    if (!text.trim()) return new THREE.BoxGeometry(0.01, 0.01, 0.01);
    return createTextGeometryForR3F(text, size);
  }, [text, size]);

  if (!geometry) return <boxGeometry args={[0.1, 0.1, 0.1]} />;
  return <primitive object={geometry} attach='geometry' />;
}

const xAxis = new THREE.Vector3(1, 0, 0);
const yAxis = new THREE.Vector3(0, 1, 0);
const zAxis = new THREE.Vector3(0, 0, 1);

// Shape component updated for imagePlane
function Shape({
  id,
  position,
  rotation,
  scale,
  type,
  material: materialType,
  color,
  roughness,
  metalness,
  name,
  onClick,
  text,
  textSize,
  shapeType,
  shapeSize = 1,
  extrudeDepth = 0.2,
  objectRef,
  animation,
  isAnimating,
  isTransformDragging,
  gltfModelScene,
  // ImagePlane specific props
  imageDataUrl,
  planeWidth,
  planeHeight,
}) {
  const localMeshRef = useRef(null);
  const orbitAngleRef = useRef(Math.random() * Math.PI * 2);

  const livePosition = useRef(new THREE.Vector3().fromArray(position));
  const liveRotation = useRef(new THREE.Euler().fromArray(rotation));
  const liveScale = useRef(new THREE.Vector3().fromArray(scale));

  useEffect(() => {
    if (objectRef) objectRef.current = localMeshRef.current;
    return () => {
      if (objectRef && objectRef.current === localMeshRef.current)
        objectRef.current = null;
    };
  }, [objectRef, localMeshRef]);

  useEffect(() => {
    livePosition.current.fromArray(position);
  }, [position]);
  useEffect(() => {
    liveRotation.current.fromArray(rotation);
  }, [rotation]);
  useEffect(() => {
    liveScale.current.fromArray(scale);
  }, [scale]);

  useFrame((state, delta) => {
    if (!localMeshRef.current) return;
    localMeshRef.current.scale.copy(liveScale.current);

    if (
      !isAnimating ||
      isTransformDragging ||
      !animation ||
      animation.type === "none"
    ) {
      localMeshRef.current.position.copy(livePosition.current);
      localMeshRef.current.rotation.copy(liveRotation.current);
      return;
    }

    const effectiveSpeed = (animation.speed || 1) * delta;
    switch (animation.type) {
      case "rotate":
        let rotationAxis = yAxis;
        if (animation.axis === "x") rotationAxis = xAxis;
        else if (animation.axis === "z") rotationAxis = zAxis;
        localMeshRef.current.rotateOnAxis(rotationAxis, effectiveSpeed);
        liveRotation.current.copy(localMeshRef.current.rotation);
        break;
      case "orbit":
        orbitAngleRef.current += effectiveSpeed * 0.2;
        const radius = animation.orbitRadius || 5;
        const cX = animation.orbitCenter?.[0] || 0;
        const cY = animation.orbitCenter?.[1] || livePosition.current.y;
        const cZ = animation.orbitCenter?.[2] || 0;
        const plane = animation.orbitPlane || "xz";
        if (plane === "xz")
          localMeshRef.current.position.set(
            cX + Math.cos(orbitAngleRef.current) * radius,
            cY,
            cZ + Math.sin(orbitAngleRef.current) * radius
          );
        else if (plane === "xy")
          localMeshRef.current.position.set(
            cX + Math.cos(orbitAngleRef.current) * radius,
            cY + Math.sin(orbitAngleRef.current) * radius,
            cZ
          );
        else if (plane === "yz")
          localMeshRef.current.position.set(
            cX,
            cY + Math.cos(orbitAngleRef.current) * radius,
            cZ + Math.sin(orbitAngleRef.current) * radius
          );
        livePosition.current.copy(localMeshRef.current.position);
        break;
      default:
        localMeshRef.current.position.copy(livePosition.current);
        localMeshRef.current.rotation.copy(liveRotation.current);
        break;
    }
  });

  useEffect(() => {
    if (localMeshRef.current && !isTransformDragging) {
      localMeshRef.current.position.fromArray(position);
      localMeshRef.current.rotation.fromArray(rotation);
      localMeshRef.current.scale.fromArray(scale);
      livePosition.current.fromArray(position);
      liveRotation.current.fromArray(rotation);
      liveScale.current.fromArray(scale);
    }
  }, [position, rotation, scale, isTransformDragging]);

  // Texture for imagePlane, loaded via useLoader
  const texture = useMemo(() => {
    if (type === "imagePlane" && imageDataUrl && useLoader) {
      return useLoader(THREE.TextureLoader, imageDataUrl);
    }
    return null;
  }, [type, imageDataUrl]);

  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace; // Crucial for correct color display
      texture.needsUpdate = true;
    }
  }, [texture]);

  const proceduralGeometry = useMemo(() => {
    switch (type) {
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
          <Suspense fallback={null}>
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
      case "imagePlane":
        return <planeGeometry args={[planeWidth || 1, planeHeight || 1]} />;
      default:
        return null;
    }
  }, [
    type,
    text,
    textSize,
    shapeType,
    shapeSize,
    extrudeDepth,
    planeWidth,
    planeHeight,
  ]);

  const proceduralMaterial = useMemo(() => {
    if (type === "importedGLB") return null;
    if (type === "imagePlane") {
      if (texture)
        return (
          <meshBasicMaterial
            map={texture}
            side={THREE.DoubleSide}
            transparent={true}
          />
        );
      return <meshBasicMaterial color={0xcccccc} side={THREE.DoubleSide} />; // Fallback if no texture
    }
    const pbrProps = { color, roughness, metalness };
    switch (materialType) {
      case "standard":
        return <meshStandardMaterial {...pbrProps} />;
      case "physical":
        return (
          <meshPhysicalMaterial
            {...pbrProps}
            transmission={0}
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
  }, [type, materialType, color, roughness, metalness, texture]);

  const objectName = `shape_${id}_${type}_${name || shapeType || ""}`;

  if (type === "importedGLB") {
    if (!gltfModelScene) return null;
    return (
      <primitive
        ref={localMeshRef}
        object={gltfModelScene}
        onClick={(e) => {
          e.stopPropagation();
          onClick(id, e);
        }}
        name={objectName}
        onPointerOver={(e) => e.stopPropagation()}
        onPointerOut={(e) => e.stopPropagation()}
      />
    );
  } else {
    return (
      <mesh
        ref={localMeshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick(id, e);
        }}
        castShadow={type !== "imagePlane"} // Image planes typically don't cast shadows
        receiveShadow
        name={objectName}
        onPointerOver={(e) => e.stopPropagation()}
        onPointerOut={(e) => e.stopPropagation()}
      >
        {proceduralGeometry}
        {proceduralMaterial}
      </mesh>
    );
  }
}

function SceneLighting() {
  // ... (no changes from your provided code)
  const lightRef = useRef();
  const hdrPath = "/brown_photostudio_02_4k.hdr"; // Make sure this path is correct or remove if not used

  return (
    <>
      {Environment && typeof Environment !== "string" ? (
        <Suspense fallback={null}>
          <Environment files={hdrPath} background={false} blur={0.5} />
        </Suspense>
      ) : (
        <directionalLight intensity={0.2} position={[0, 0, 0]} /> // Fallback if Drei/Environment not available
      )}
      <ambientLight intensity={0.6} />
      <directionalLight
        ref={lightRef}
        position={[8, 15, 10]}
        intensity={1.5}
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
      <pointLight position={[-10, -10, -10]} color='#ffeedd' intensity={0.5} />
      <hemisphereLight
        skyColor='#e6e6ff'
        groundColor='#b0b0b0'
        intensity={0.3}
      />
    </>
  );
}

export function MainScene({
  shapes,
  selectedShapeId,
  mode,
  onShapeClick,
  onShapeUpdate,
  orbitControlsEnabled,
  sceneRef,
  isAnimating,
  loadedGltfObjects,
}) {
  const { scene, gl, camera } = useThree();
  const [transformObject, setTransformObject] = useState(null);
  const selectedObjectInternalRef = useRef(null);
  const [isTransformDragging, setIsTransformDragging] = useState(false);

  useEffect(() => {
    if (sceneRef) sceneRef.current = scene;
  }, [scene, sceneRef]);

  useEffect(() => {
    if (selectedShapeId) {
      const currentSelectedShape = shapes.find((s) => s.id === selectedShapeId);
      if (
        currentSelectedShape &&
        selectedObjectInternalRef.current &&
        selectedObjectInternalRef.current.name.startsWith(
          `shape_${selectedShapeId}`
        )
      ) {
        setTransformObject(selectedObjectInternalRef.current);
      } else if (!currentSelectedShape) {
        // Selected shape was deleted
        setTransformObject(null);
        selectedObjectInternalRef.current = null;
      }
      // If currentSelectedShape exists but ref is not yet set or stale,
      // it will be updated when the Shape component passes its ref.
    } else {
      setTransformObject(null);
      selectedObjectInternalRef.current = null;
    }
  }, [selectedShapeId, shapes]); // Re-run if selectedShapeId or the shapes list changes

  // This effect ensures that if the selectedObjectInternalRef gets updated by a Shape component,
  // we correctly set it for TransformControls if that shape is the currently selected one.
  useEffect(() => {
    if (
      selectedShapeId &&
      selectedObjectInternalRef.current &&
      selectedObjectInternalRef.current.name.startsWith(
        `shape_${selectedShapeId}`
      )
    ) {
      if (transformObject !== selectedObjectInternalRef.current) {
        setTransformObject(selectedObjectInternalRef.current);
      }
    }
  }, [selectedShapeId, selectedObjectInternalRef.current]); // Rerun if ref itself changes

  return (
    <>
      <SceneLighting />
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
        name='ground_plane'
      >
        <planeGeometry args={[100, 100]} />
        <shadowMaterial opacity={0.3} />
      </mesh>

      {Grid && typeof Grid !== "string" && (
        <Grid
          args={[100, 100]}
          position={[0, 0, 0]}
          cellSize={1}
          cellThickness={0.6}
          cellColor={new THREE.Color("#6f6f6f")}
          sectionSize={5}
          sectionThickness={1}
          sectionColor={new THREE.Color("#9d4b4b")}
          fadeDistance={60}
          fadeStrength={1}
          infiniteGrid
          followCamera={false}
        />
      )}

      {shapes.map((shapeData) => {
        const gltfSceneForShape =
          shapeData.type === "importedGLB"
            ? loadedGltfObjects[shapeData.id]?.scene
            : null;
        if (shapeData.type === "importedGLB" && !gltfSceneForShape) return null;

        // Pass all shapeData, including imagePlane specific props
        return (
          <Shape
            key={shapeData.id}
            {...shapeData}
            gltfModelScene={gltfSceneForShape}
            animation={shapeData.animation}
            isAnimating={isAnimating}
            onClick={onShapeClick}
            objectRef={
              shapeData.id === selectedShapeId
                ? selectedObjectInternalRef
                : null
            }
            isTransformDragging={
              shapeData.id === selectedShapeId && isTransformDragging
            }
          />
        );
      })}

      {selectedShapeId &&
        transformObject &&
        mode &&
        TransformControls &&
        typeof TransformControls !== "string" && (
          <TransformControls
            object={transformObject}
            mode={mode}
            onObjectChange={() => {
              if (selectedShapeId && transformObject) {
                onShapeUpdate(selectedShapeId);
              }
            }}
            onDraggingChanged={(event) => {
              const dragging = event.value;
              setIsTransformDragging(dragging);
              const orbitCtrl = scene.__r3f?.controls;
              if (orbitCtrl)
                orbitCtrl.enabled = !dragging && orbitControlsEnabled;
            }}
            size={0.75}
            space={mode === "translate" ? "world" : "local"}
            camera={camera}
            domElement={gl.domElement}
          />
        )}

      {OrbitControls && typeof OrbitControls !== "string" && (
        <OrbitControls
          enabled={orbitControlsEnabled && !isTransformDragging}
          makeDefault
          enableDamping
          dampingFactor={0.05}
          minDistance={1}
          maxDistance={100}
          zoomSpeed={0.7}
          panSpeed={0.7}
        />
      )}
    </>
  );
}

export function CameraController({ preset }) {
  // ... (no changes from your provided code)
  const { camera } = useThree();
  const controls = useThree((state) => state.controls);

  const cameraPresets = useMemo(
    () => ({
      top: { position: [0, 15, 0.01], target: [0, 0, 0] },
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
      if (controls && controls.target) {
        controls.target.set(...target);
        controls.update();
      } else {
        camera.lookAt(new THREE.Vector3(...target));
      }
      camera.updateProjectionMatrix();
    }
  }, [preset, camera, controls, cameraPresets]);

  return null;
}
