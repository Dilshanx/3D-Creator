// import { Suspense, useMemo, useRef, useEffect, useState } from "react";
// import * as THREE from "three";
// import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
// import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
// import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
// import { TextureLoader } from "three"; // For useTexture fallback if needed, and export

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
// } from "../../LetterShape/PopularShapes"; // Adjust path if necessary

// let useFrame, useLoader, useThree, extend;
// let OrbitControls, TransformControls, Grid, Environment, Text3D, useTexture;

// try {
//   const r3f = require("@react-three/fiber");
//   useFrame = r3f.useFrame;
//   useLoader = r3f.useLoader; // Fiber's useLoader
//   useThree = r3f.useThree;
//   extend = r3f.extend;
// } catch (error) {
//   console.warn("@react-three/fiber not available for SceneElements:", error);
// }

// try {
//   const trei = require("@react-three/drei");
//   OrbitControls = trei.OrbitControls;
//   TransformControls = trei.TransformControls;
//   Grid = trei.Grid;
//   Environment = trei.Environment;
//   Text3D = trei.Text3D;
//   useTexture = trei.useTexture; // Drei's useTexture
// } catch (error) {
//   console.warn("@react-three/drei not available for SceneElements:", error);
// }

// const FONT_PATH_R3F = "/fonts/helvetiker_regular.typeface.json";
// let helvetikerFontForR3F = null;
// const r3fFontLoader = new FontLoader();
// if (typeof window !== "undefined") {
//   r3fFontLoader.load(
//     FONT_PATH_R3F,
//     (font) => {
//       helvetikerFontForR3F = font;
//       console.log("SceneElements: Helvetiker font loaded for R3F/createMesh.");
//     },
//     undefined,
//     (err) =>
//       console.error(
//         "SceneElements: Failed to load Helvetiker for R3F/createMesh:",
//         err
//       )
//   );
// }

// export function exportToGLB(scene, filename = "model.glb") {
//   if (!THREE || !GLTFExporter) {
//     alert("THREE.js or GLTFExporter is not available for GLB export.");
//     console.error("THREE.js or GLTFExporter not available.");
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
//   try {
//     exporter.parse(
//       scene,
//       (result) => {
//         if (!(result instanceof ArrayBuffer)) {
//           console.error(
//             "GLTFExporter.parse() result is not an ArrayBuffer:",
//             result
//           );
//           alert("GLB Export failed: Invalid export result.");
//           return;
//         }
//         const blob = new Blob([result], { type: "application/octet-stream" });
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement("a");
//         link.href = url;
//         link.download = filename;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(url);
//         alert(`GLB file exported successfully as ${filename}!`);
//       },
//       (error) => {
//         console.error("GLB Export parse failed:", error);
//         alert(
//           "GLB Export failed during parsing: " +
//             (error?.message || String(error))
//         );
//       },
//       options
//     );
//   } catch (error) {
//     console.error("GLB Export setup failed:", error);
//     alert("GLB Export setup failed: " + (error?.message || String(error)));
//   }
// }

// const saneNumber = (value, defaultValue = 0) => {
//   const num = Number(value);
//   return isNaN(num) || !isFinite(num) ? defaultValue : num;
// };

// export const createMeshFromShape = async (
//   shapeData
//   // texturePropsForExport and textTexturePropsForExport are not explicitly used here anymore
//   // as the main export functions in Model3DCreator handle applying those.
//   // This function now focuses on creating the base mesh, especially for imagePlanes correctly.
// ) => {
//   if (!THREE) {
//     console.error("THREE.js is not available.");
//     return null;
//   }
//   try {
//     let geometry;
//     const shapeTypeProp = shapeData.type || shapeData.geometry;
//     const textHeightForGeometry = saneNumber(shapeData.extrudeDepth, 0.2);
//     const shapeSize = saneNumber(shapeData.shapeSize, 1);
//     const textSizeForGeometry = saneNumber(shapeData.textSize, 0.5);

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
//         const pG = new THREE.BufferGeometry();
//         const pV = new Float32Array([
//           -0.5, 0, -0.5, 0.5, 0, -0.5, 0.5, 0, 0.5, -0.5, 0, 0.5, 0, 1, 0,
//         ]);
//         const pI = [0, 1, 2, 0, 2, 3, 0, 4, 1, 1, 4, 2, 2, 4, 3, 3, 4, 0];
//         pG.setIndex(pI);
//         pG.setAttribute("position", new THREE.Float32BufferAttribute(pV, 3));
//         pG.computeVertexNormals();
//         pG.translate(0, -0.5, 0);
//         geometry = pG;
//         break;
//       case "text":
//         let fontToUse = helvetikerFontForR3F;
//         if (!fontToUse && typeof window !== "undefined") {
//           try {
//             fontToUse = await new Promise((resolve, reject) =>
//               r3fFontLoader.load(FONT_PATH_R3F, resolve, undefined, reject)
//             );
//             if (!helvetikerFontForR3F) helvetikerFontForR3F = fontToUse;
//           } catch (e) {
//             console.error(
//               "Fallback font load failed in createMeshFromShape (text):",
//               e
//             );
//             geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
//             break;
//           }
//         } else if (!fontToUse) {
//           geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
//           break;
//         }
//         geometry = new TextGeometry(shapeData.text || "3D", {
//           font: fontToUse,
//           size: textSizeForGeometry,
//           height: textHeightForGeometry,
//           curveSegments: 12,
//           bevelEnabled: true,
//           bevelThickness: saneNumber(textSizeForGeometry * 0.04, 0.02),
//           bevelSize: saneNumber(textSizeForGeometry * 0.04, 0.02),
//           bevelOffset: 0,
//           bevelSegments: 3,
//         });
//         geometry.center();
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
//         if (!(twoDShape instanceof THREE.Shape)) {
//           twoDShape = new THREE.Shape()
//             .moveTo(-0.5, -0.5)
//             .lineTo(0.5, -0.5)
//             .lineTo(0.5, 0.5)
//             .lineTo(-0.5, 0.5)
//             .closePath();
//         }
//         const extrudeSettings = {
//           depth: textHeightForGeometry,
//           bevelEnabled: true,
//           bevelSegments: 2,
//           steps: 1,
//           bevelSize: textHeightForGeometry * 0.05,
//           bevelThickness: textHeightForGeometry * 0.05,
//         };
//         geometry = new THREE.ExtrudeGeometry(twoDShape, extrudeSettings);
//         geometry.center();
//         break;
//       case "imagePlane":
//         geometry = new THREE.PlaneGeometry(
//           shapeData.planeWidth || 1,
//           shapeData.planeHeight || 1
//         );
//         break;
//       case "importedGLB":
//         return null; // GLBs are handled differently, not created by this func
//       default:
//         geometry = new THREE.BoxGeometry(1, 1, 1);
//     }

//     let material;
//     if (shapeTypeProp === "imagePlane") {
//       if (!shapeData.imageDataUrl) {
//         material = new THREE.MeshBasicMaterial({
//           color: 0xcccccc,
//           side: THREE.DoubleSide,
//           transparent: true,
//         });
//       } else {
//         const textureLoader = new TextureLoader(); // Use THREE's TextureLoader for export context
//         try {
//           const texture = await new Promise((resolve, reject) => {
//             textureLoader.load(
//               shapeData.imageDataUrl,
//               (tex) => {
//                 tex.colorSpace = THREE.SRGBColorSpace;
//                 tex.flipY = false; // CRITICAL for GLTF export consistency
//                 tex.needsUpdate = true;
//                 resolve(tex);
//               },
//               undefined,
//               (err) => {
//                 console.error(
//                   `Export: Error loading imagePlane texture: ${shapeData.imageDataUrl}`,
//                   err
//                 );
//                 reject(err);
//               }
//             );
//           });
//           material = new THREE.MeshBasicMaterial({
//             map: texture,
//             side: THREE.DoubleSide,
//             transparent: true,
//           });
//         } catch (error) {
//           console.error(
//             "Error creating imagePlane material for export:",
//             error
//           );
//           material = new THREE.MeshBasicMaterial({
//             color: 0xff0000,
//             side: THREE.DoubleSide,
//             transparent: true,
//           }); // Error placeholder
//         }
//       }
//     } else {
//       // For other primitive shapes (text, box, etc.)
//       const color = new THREE.Color(shapeData.color || "#ffffff");
//       const pbrProps = {
//         color,
//         roughness:
//           shapeData.roughness !== undefined ? shapeData.roughness : 0.5,
//         metalness:
//           shapeData.metalness !== undefined ? shapeData.metalness : 0.0,
//       };
//       switch (shapeData.material) {
//         case "standard":
//           material = new THREE.MeshStandardMaterial(pbrProps);
//           break;
//         case "physical":
//           material = new THREE.MeshPhysicalMaterial(pbrProps);
//           break;
//         default:
//           material = new THREE.MeshStandardMaterial(pbrProps);
//       }
//     }

//     const mesh = new THREE.Mesh(geometry, material);
//     mesh.name = `shape_export_${shapeData.id}_${shapeTypeProp}`; // Naming for export debugging
//     mesh.castShadow = shapeTypeProp !== "imagePlane";
//     mesh.receiveShadow = true;
//     return mesh;
//   } catch (error) {
//     console.error(
//       "Critical error in createMeshFromShape (for export context):",
//       shapeData,
//       error
//     );
//     return null;
//   }
// };

// function LoadedTexturesMaterial({
//   materialType,
//   color,
//   roughness,
//   metalness,
//   textureProps = {},
// }) {
//   const validTextureUrls = useMemo(() => {
//     const urls = {};
//     if (textureProps && typeof textureProps === "object") {
//       for (const key in textureProps) {
//         if (
//           key.endsWith("Url") &&
//           textureProps[key] &&
//           typeof textureProps[key] === "string" &&
//           textureProps[key].trim() !== ""
//         ) {
//           urls[key] = textureProps[key];
//         }
//       }
//     }
//     return urls;
//   }, [textureProps]);

//   const textures = useTexture ? useTexture(validTextureUrls) : {}; // Handles empty object {}

//   const material = useMemo(() => {
//     const hasMapTexture = textures && textures.mapUrl;
//     const matColor = hasMapTexture
//       ? new THREE.Color(0xffffff)
//       : new THREE.Color(color || "#ffffff");

//     const pbrBase = {
//       color: matColor,
//       roughness: saneNumber(roughness, 0.5),
//       metalness: saneNumber(metalness, 0.0),
//       map: (textures && textures.mapUrl) || null,
//       normalMap: (textures && textures.normalMapUrl) || null,
//       roughnessMap: (textures && textures.roughnessMapUrl) || null,
//       metalnessMap: (textures && textures.metalnessMapUrl) || null,
//       aoMap: (textures && textures.aoMapUrl) || null,
//       emissiveMap: (textures && textures.emissiveMapUrl) || null,
//     };

//     if (pbrBase.map) pbrBase.map.colorSpace = THREE.SRGBColorSpace;
//     if (pbrBase.emissiveMap) {
//       pbrBase.emissiveMap.colorSpace = THREE.SRGBColorSpace;
//       pbrBase.emissive = new THREE.Color(0xffffff);
//       pbrBase.emissiveIntensity = 1.0;
//     }
//     // Ensure aoMap has uv2 if geometry provides uv
//     // This should ideally be handled by checking if geometry has uv2, not just uv.
//     // And geometry should be passed or accessed here if aoMap is to set uv2.
//     // For now, we assume uv2 is handled if aoMap is present and geometry has it.

//     switch (materialType) {
//       case "standard":
//         return (
//           <meshStandardMaterial
//             {...pbrBase}
//             aoMapIntensity={pbrBase.aoMap ? 1 : 0}
//           />
//         );
//       case "physical":
//         return (
//           <meshPhysicalMaterial
//             {...pbrBase}
//             transmission={0}
//             ior={1.5}
//             thickness={0.1}
//             aoMapIntensity={pbrBase.aoMap ? 1 : 0}
//           />
//         );
//       case "toon":
//         return (
//           <meshToonMaterial
//             color={matColor}
//             map={(textures && textures.mapUrl) || null}
//           />
//         );
//       case "basic":
//         return (
//           <meshBasicMaterial
//             color={matColor}
//             map={(textures && textures.mapUrl) || null}
//             wireframe={false}
//           />
//         );
//       case "lambert":
//         return (
//           <meshLambertMaterial
//             color={matColor}
//             map={(textures && textures.mapUrl) || null}
//           />
//         );
//       case "phong":
//         return (
//           <meshPhongMaterial
//             color={matColor}
//             map={(textures && textures.mapUrl) || null}
//             shininess={30}
//           />
//         );
//       case "wireframe":
//         return <meshBasicMaterial color={matColor} wireframe />;
//       default:
//         return (
//           <meshStandardMaterial
//             {...pbrBase}
//             aoMapIntensity={pbrBase.aoMap ? 1 : 0}
//           />
//         );
//     }
//   }, [materialType, color, roughness, metalness, textures]);

//   return material;
// }

// function PyramidGeometryR3F(props) {
//   const geometry = useMemo(() => {
//     /* ... as before ... */ return new THREE.BoxGeometry(0.1, 0.1, 0.1);
//   }, []);
//   if (!geometry) return <boxGeometry args={[0.1, 0.1, 0.1]} />;
//   return <primitive object={geometry} attach='geometry' {...props} />;
// }

// function ExtrudedCustomShapeGeometry({
//   shapeType,
//   shapeSize = 1,
//   extrudeDepth = 0.2,
// }) {
//   const geometry = useMemo(() => {
//     /* ... as before ... */ return new THREE.BoxGeometry(
//       shapeSize,
//       shapeSize,
//       extrudeDepth
//     );
//   }, [shapeType, shapeSize, extrudeDepth]);
//   if (!geometry) return <boxGeometry args={[0.1, 0.1, 0.1]} />;
//   return <primitive object={geometry} attach='geometry' />;
// }

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
//   gltfModelScene, // This is the THREE.Scene object from the loaded GLTF
//   imageDataUrl,
//   planeWidth,
//   planeHeight,
//   textureProps,
//   textTextureProps,
// }) {
//   const localMeshRef = useRef(null); // For primitives and Text3D
//   const groupRef = useRef(null); // For GLB wrapper and ImagePlane wrapper if needed for consistency
//   const orbitAngleRef = useRef(Math.random() * Math.PI * 2);

//   const livePosition = useRef(new THREE.Vector3().fromArray(position));
//   const liveRotation = useRef(new THREE.Euler().fromArray(rotation));
//   const liveScale = useRef(new THREE.Vector3().fromArray(scale));

//   useEffect(() => {
//     livePosition.current.fromArray(position);
//   }, [position]);
//   useEffect(() => {
//     liveRotation.current.fromArray(rotation);
//   }, [rotation]);
//   useEffect(() => {
//     liveScale.current.fromArray(scale);
//   }, [scale]);

//   useEffect(() => {
//     // The ref passed to TransformControls should be the one that gets transformed
//     if (objectRef) {
//       objectRef.current =
//         type === "importedGLB" || type === "imagePlane"
//           ? groupRef.current
//           : localMeshRef.current;
//     }
//     return () => {
//       if (
//         objectRef &&
//         objectRef.current ===
//           (type === "importedGLB" || type === "imagePlane"
//             ? groupRef.current
//             : localMeshRef.current)
//       ) {
//         objectRef.current = null;
//       }
//     };
//   }, [objectRef, type]);

//   useFrame((state, delta) => {
//     const targetRef =
//       type === "importedGLB" || type === "imagePlane"
//         ? groupRef.current
//         : localMeshRef.current;
//     if (!targetRef) return;

//     if (
//       type !== "importedGLB" &&
//       isAnimating &&
//       !isTransformDragging &&
//       animation &&
//       animation.type !== "none"
//     ) {
//       const effectiveSpeed = (animation.speed || 1) * delta;
//       let currentP = livePosition.current.clone();
//       let currentR = liveRotation.current.clone();

//       switch (animation.type) {
//         case "rotate":
//           if (animation.axis === "x") currentR.x += effectiveSpeed;
//           else if (animation.axis === "y") currentR.y += effectiveSpeed;
//           else if (animation.axis === "z") currentR.z += effectiveSpeed;
//           liveRotation.current.copy(currentR);
//           break;
//         case "orbit":
//           orbitAngleRef.current += effectiveSpeed * 0.2;
//           const radius = animation.orbitRadius || 5;
//           const cX = animation.orbitCenter?.[0] || 0;
//           const cY =
//             animation.orbitCenter?.[1] !== undefined
//               ? animation.orbitCenter[1]
//               : livePosition.current.y;
//           const cZ = animation.orbitCenter?.[2] || 0;
//           const plane = animation.orbitPlane || "xz";
//           if (plane === "xz")
//             currentP.set(
//               cX + Math.cos(orbitAngleRef.current) * radius,
//               cY,
//               cZ + Math.sin(orbitAngleRef.current) * radius
//             );
//           else if (plane === "xy")
//             currentP.set(
//               cX + Math.cos(orbitAngleRef.current) * radius,
//               cY + Math.sin(orbitAngleRef.current) * radius,
//               cZ
//             );
//           else if (plane === "yz")
//             currentP.set(
//               cX,
//               cY + Math.cos(orbitAngleRef.current) * radius,
//               cZ + Math.sin(orbitAngleRef.current) * radius
//             );
//           livePosition.current.copy(currentP);
//           break;
//       }
//       targetRef.position.copy(livePosition.current);
//       targetRef.rotation.copy(liveRotation.current);
//     } else {
//       // Apply direct prop values if not programmatically animating or if it's a GLB
//       targetRef.position.copy(livePosition.current);
//       targetRef.rotation.copy(liveRotation.current);
//     }
//     targetRef.scale.copy(liveScale.current);
//   });

//   useEffect(() => {
//     if (animation?.type !== "orbit")
//       orbitAngleRef.current = Math.random() * Math.PI * 2;
//   }, [animation?.type]);

//   const imagePlaneDisplayTexture =
//     useTexture && type === "imagePlane" && imageDataUrl
//       ? useTexture(imageDataUrl)
//       : null;

//   useEffect(() => {
//     if (imagePlaneDisplayTexture && type === "imagePlane") {
//       imagePlaneDisplayTexture.colorSpace = THREE.SRGBColorSpace;
//       // imagePlaneDisplayTexture.flipY = false; // useTexture default is usually correct for display
//       imagePlaneDisplayTexture.needsUpdate = true;
//     }
//   }, [imagePlaneDisplayTexture, type]);

//   const objectName = `shape_${id}_${type}_${
//     name ||
//     shapeType ||
//     (type === "text" ? text?.substring(0, 10) || "Text" : "")
//   }`;
//   const currentTextureProps = type === "text" ? textTextureProps : textureProps;

//   if (type === "text") {
//     if (!Text3D || !useTexture)
//       return (
//         <mesh name={`${objectName}_text_fallback`}>
//           <boxGeometry args={[0.1, 0.1, 0.1]} />
//           <meshBasicMaterial color='red' wireframe />
//         </mesh>
//       );
//     return (
//       <Suspense
//         fallback={
//           <mesh name={`${objectName}_loading_text`}>
//             <boxGeometry args={[0.2, 0.2, 0.2]} />
//             <meshBasicMaterial color='gray' wireframe />
//           </mesh>
//         }
//       >
//         <Text3D
//           ref={localMeshRef}
//           font={FONT_PATH_R3F}
//           size={saneNumber(textSize, 0.5)}
//           height={saneNumber(extrudeDepth, 0.1)}
//           curveSegments={12}
//           bevelEnabled
//           bevelThickness={saneNumber(textSize * 0.04, 0.02)}
//           bevelSize={saneNumber(textSize * 0.04, 0.02)}
//           bevelOffset={0}
//           bevelSegments={3}
//           name={objectName}
//           castShadow
//           receiveShadow
//           onClick={(e) => {
//             e.stopPropagation();
//             onClick(id, e);
//           }}
//           onPointerOver={(e) => e.stopPropagation()}
//           onPointerOut={(e) => e.stopPropagation()}
//         >
//           {text || "Text"}
//           <LoadedTexturesMaterial
//             materialType={materialType}
//             color={color}
//             roughness={roughness}
//             metalness={metalness}
//             textureProps={currentTextureProps}
//           />
//         </Text3D>
//       </Suspense>
//     );
//   } else if (type === "importedGLB") {
//     if (!gltfModelScene) return null;
//     // The GLTF model's scene (gltfModelScene) is a THREE.Group/Scene itself.
//     // We apply transformations (position, rotation, scale from shapeData) to a wrapper group.
//     return (
//       <group
//         ref={groupRef}
//         name={objectName} // This group is what TransformControls will target
//         onClick={(e) => {
//           e.stopPropagation();
//           onClick(id, e);
//         }}
//         onPointerOver={(e) => e.stopPropagation()}
//         onPointerOut={(e) => e.stopPropagation()}
//       >
//         <primitive object={gltfModelScene} />
//       </group>
//     );
//   } else if (type === "imagePlane") {
//     // Wrap image plane in a group for consistent transform control targeting with GLBs
//     return (
//       <group
//         ref={groupRef}
//         name={objectName}
//         onClick={(e) => {
//           e.stopPropagation();
//           onClick(id, e);
//         }}
//         onPointerOver={(e) => e.stopPropagation()}
//         onPointerOut={(e) => e.stopPropagation()}
//       >
//         <mesh castShadow={false} receiveShadow>
//           <planeGeometry args={[planeWidth || 1, planeHeight || 1]} />
//           {imagePlaneDisplayTexture ? (
//             <meshBasicMaterial
//               map={imagePlaneDisplayTexture}
//               side={THREE.DoubleSide}
//               transparent={true}
//             />
//           ) : (
//             <meshBasicMaterial
//               color={0xcccccc}
//               wireframe
//               side={THREE.DoubleSide}
//             />
//           )}
//         </mesh>
//       </group>
//     );
//   } else {
//     // For other primitive shapes
//     const proceduralGeometry = useMemo(() => {
//       switch (type) {
//         case "box":
//           return <boxGeometry args={[1, 1, 1]} />;
//         case "sphere":
//           return <sphereGeometry args={[0.5, 32, 32]} />;
//         case "cylinder":
//           return <cylinderGeometry args={[0.5, 0.5, 1, 32]} />;
//         case "cone":
//           return <coneGeometry args={[0.5, 1, 32]} />;
//         case "torus":
//           return <torusGeometry args={[0.5, 0.2, 16, 100]} />;
//         case "pyramid":
//           return <PyramidGeometryR3F />;
//         case "customExtruded":
//           return (
//             <ExtrudedCustomShapeGeometry
//               shapeType={shapeType}
//               shapeSize={shapeSize}
//               extrudeDepth={extrudeDepth}
//             />
//           );
//         default:
//           return <boxGeometry args={[0.1, 0.1, 0.1]} />;
//       }
//     }, [type, shapeType, shapeSize, extrudeDepth]);

//     if (!useTexture)
//       return (
//         <mesh
//           ref={localMeshRef}
//           name={objectName}
//           castShadow
//           receiveShadow
//           onClick={(e) => {
//             e.stopPropagation();
//             onClick(id, e);
//           }}
//         >
//           {proceduralGeometry}
//           <meshStandardMaterial
//             color={color}
//             roughness={roughness}
//             metalness={metalness}
//           />
//         </mesh>
//       );
//     return (
//       <mesh
//         ref={localMeshRef}
//         name={objectName}
//         castShadow
//         receiveShadow
//         onClick={(e) => {
//           e.stopPropagation();
//           onClick(id, e);
//         }}
//         onPointerOver={(e) => e.stopPropagation()}
//         onPointerOut={(e) => e.stopPropagation()}
//       >
//         {proceduralGeometry}
//         <Suspense fallback={<meshStandardMaterial color='gray' wireframe />}>
//           <LoadedTexturesMaterial
//             materialType={materialType}
//             color={color}
//             roughness={roughness}
//             metalness={metalness}
//             textureProps={currentTextureProps}
//           />
//         </Suspense>
//       </mesh>
//     );
//   }
// }

// function SceneLighting() {
//   const lightRef = useRef();
//   const hdrPath = "/brown_photostudio_02_4k.hdr"; // Ensure this file is in your public folder
//   return (
//     <>
//       {Environment && typeof Environment !== "string" && hdrPath ? (
//         <Suspense fallback={null}>
//           <Environment files={hdrPath} background={false} blur={0.5} />
//         </Suspense>
//       ) : (
//         <directionalLight intensity={0.5} position={[5, 5, 5]} /> // Fallback if HDR fails or Environment not available
//       )}
//       <ambientLight intensity={0.7} />
//       <directionalLight
//         ref={lightRef}
//         position={[8, 15, 10]}
//         intensity={1.8}
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
//       <pointLight position={[-10, -10, -10]} color={0xffeedd} intensity={0.6} />
//       <hemisphereLight
//         skyColor={0xe6f0ff}
//         groundColor={0xb0b0b0}
//         intensity={0.4}
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
//   selectedAnimationClipIndex,
//   animationPlaybackState,
//   isAnimationLooping,
//   animationPlaybackSpeed,
//   animationTime,
//   playAllAnimations,
// }) {
//   const { scene, gl, camera } = useThree();
//   const [transformObject, setTransformObject] = useState(null);
//   const selectedObjectInternalRef = useRef(null); // This ref is populated by the <Shape> component
//   const [isTransformDragging, setIsTransformDragging] = useState(false);

//   const activeMixers = useRef(new Map());
//   const activeActions = useRef(new Map()); // Stores actions: shapeId_clipIndex -> action

//   useEffect(() => {
//     if (sceneRef) sceneRef.current = scene;
//   }, [scene, sceneRef]);

//   // Update TransformControls target when selectedShapeId or its actual mesh changes
//   useEffect(() => {
//     if (selectedShapeId && selectedObjectInternalRef.current) {
//       // Check if the current internal ref matches the selected shape's expected name structure
//       const shapeData = shapes.find((s) => s.id === selectedShapeId);
//       if (
//         shapeData &&
//         selectedObjectInternalRef.current.name.startsWith(
//           `shape_${selectedShapeId}_${shapeData.type}`
//         )
//       ) {
//         if (transformObject !== selectedObjectInternalRef.current) {
//           setTransformObject(selectedObjectInternalRef.current);
//         }
//       } else if (transformObject !== null) {
//         // Mismatch or stale ref
//         setTransformObject(null);
//       }
//     } else {
//       if (transformObject !== null) setTransformObject(null);
//     }
//   }, [
//     selectedShapeId,
//     shapes,
//     selectedObjectInternalRef.current,
//     transformObject,
//   ]);

//   // GLB Animation Handling
//   useEffect(() => {
//     const currentSelectedShape = shapes.find((s) => s.id === selectedShapeId);

//     // Stop and clear mixers/actions for shapes that are no longer selected or not GLB
//     activeMixers.current.forEach((mixer, id) => {
//       if (
//         id !== selectedShapeId ||
//         (currentSelectedShape && currentSelectedShape.type !== "importedGLB")
//       ) {
//         mixer.stopAllAction();
//         activeMixers.current.delete(id);
//         activeActions.current.forEach((_, key) => {
//           if (key.startsWith(id)) activeActions.current.delete(key);
//         });
//       }
//     });

//     if (
//       currentSelectedShape &&
//       currentSelectedShape.type === "importedGLB" &&
//       loadedGltfObjects[currentSelectedShape.id]
//     ) {
//       const gltfData = loadedGltfObjects[currentSelectedShape.id];
//       if (
//         gltfData &&
//         gltfData.animations &&
//         gltfData.animations.length > 0 &&
//         gltfData.scene
//       ) {
//         let mixer = activeMixers.current.get(currentSelectedShape.id);
//         const animatedRoot = gltfData.scene; // Animations are typically on the root of the GLTF scene

//         if (!mixer || mixer.getRoot() !== animatedRoot) {
//           mixer = new THREE.AnimationMixer(animatedRoot);
//           activeMixers.current.set(currentSelectedShape.id, mixer);
//         }

//         // Stop previous actions for this GLB before setting up new ones
//         mixer.stopAllAction();
//         activeActions.current.forEach((_, key) => {
//           if (key.startsWith(currentSelectedShape.id))
//             activeActions.current.delete(key);
//         });

//         const setupAction = (clip, clipIndex) => {
//           const action = mixer.clipAction(clip, animatedRoot); // Ensure root is passed if clip is not directly on root
//           action.setLoop(
//             isAnimationLooping ? THREE.LoopRepeat : THREE.LoopOnce,
//             Infinity
//           );
//           action.timeScale = animationPlaybackSpeed;
//           const startTime = animationTime * (clip.duration || 0);
//           action.time = startTime;

//           if (animationPlaybackState === "playing") {
//             action.play();
//             action.paused = false;
//           } else if (animationPlaybackState === "paused") {
//             action.play();
//             action.paused = true;
//             if (startTime === 0) mixer.update(0);
//           } else {
//             action.stop();
//             if (startTime === 0) mixer.update(0);
//           } // Stopped state

//           const actionKey = `${currentSelectedShape.id}_${
//             playAllAnimations
//               ? `all_${clipIndex}`
//               : `clip_${selectedAnimationClipIndex}`
//           }`;
//           activeActions.current.set(actionKey, action);
//         };

//         if (playAllAnimations) {
//           gltfData.animations.forEach(setupAction);
//         } else if (
//           selectedAnimationClipIndex >= 0 &&
//           selectedAnimationClipIndex < gltfData.animations.length
//         ) {
//           const clip = gltfData.animations[selectedAnimationClipIndex];
//           setupAction(clip, selectedAnimationClipIndex);
//         }
//       }
//     }
//   }, [
//     selectedShapeId,
//     shapes,
//     loadedGltfObjects,
//     selectedAnimationClipIndex,
//     animationPlaybackState,
//     isAnimationLooping,
//     animationPlaybackSpeed,
//     animationTime,
//     playAllAnimations,
//   ]);

//   useFrame((state, delta) => {
//     activeMixers.current.forEach((mixer, shapeId) => {
//       // Only update mixer for the currently selected and playing GLB
//       if (shapeId === selectedShapeId && animationPlaybackState === "playing") {
//         mixer.update(delta); // Delta is already scaled by animationPlaybackSpeed in action.timeScale
//       }
//     });
//   });

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
//         const gltfObjectData = loadedGltfObjects[shapeData.id];
//         return (
//           <Shape
//             key={shapeData.id}
//             {...shapeData} // Includes position, rotation, scale etc.
//             gltfModelScene={gltfObjectData?.scene} // Pass the scene for GLBs
//             // clips are part of gltfObjectData, not directly used by <Shape> for GLB animation playback here
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
//             textureProps={shapeData.textureProps}
//             textTextureProps={shapeData.textTextureProps}
//           />
//         );
//       })}

//       {selectedShapeId &&
//         transformObject &&
//         mode &&
//         TransformControls &&
//         typeof TransformControls !== "string" && (
//           <TransformControls
//             object={transformObject}
//             mode={mode}
//             onObjectChange={() => {
//               if (selectedShapeId && transformObject)
//                 onShapeUpdate(selectedShapeId);
//             }}
//             onDraggingChanged={(event) => {
//               const dragging = event.value;
//               setIsTransformDragging(dragging);
//               const orbitCtrl = scene.__r3f?.controls;
//               if (orbitCtrl)
//                 orbitCtrl.enabled = !dragging && orbitControlsEnabled;
//             }}
//             size={0.75}
//             space={mode === "scale" ? "local" : "world"}
//             camera={camera}
//             domElement={gl.domElement}
//           />
//         )}
//       {OrbitControls && typeof OrbitControls !== "string" && (
//         <OrbitControls
//           enabled={orbitControlsEnabled && !isTransformDragging}
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

import React, { Suspense, useMemo, useRef, useEffect, useState } from "react"; // Added React import
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { TextureLoader as ThreeTextureLoader } from "three"; // Renamed to avoid conflict if useTexture exists

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
} from "../../LetterShape/PopularShapes"; // Adjust path if necessary

let useFrame, useLoader, useThree, extend;
let OrbitControls, TransformControls, Grid, Environment, Text3D, useTexture;

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
  const trei = require("@react-three/drei");
  OrbitControls = trei.OrbitControls;
  TransformControls = trei.TransformControls;
  Grid = trei.Grid;
  Environment = trei.Environment;
  Text3D = trei.Text3D;
  useTexture = trei.useTexture;
} catch (error) {
  console.warn("@react-three/drei not available for SceneElements:", error);
}

const FONT_PATH_R3F = "/fonts/helvetiker_regular.typeface.json"; // Ensure this is in public/fonts
let helvetikerFontForR3F = null;
const r3fFontLoader = new FontLoader();

if (typeof window !== "undefined" && !helvetikerFontForR3F) {
  // Check if already loaded
  r3fFontLoader.load(
    FONT_PATH_R3F,
    (font) => {
      helvetikerFontForR3F = font;
      console.log("SceneElements: Helvetiker font loaded for R3F/createMesh.");
    },
    undefined,
    (err) =>
      console.error(
        "SceneElements: Failed to load Helvetiker for R3F/createMesh:",
        err
      )
  );
}

export function exportToGLB(scene, filename = "model.glb") {
  if (!THREE || !GLTFExporter) {
    alert("THREE.js or GLTFExporter is not available for GLB export.");
    console.error("THREE.js or GLTFExporter not available.");
    return;
  }
  const exporter = new GLTFExporter();
  const options = {
    binary: true,
    onlyVisible: true,
    truncateDrawRange: true,
    embedImages: true, // Try to embed images
    animations: scene.animations || [],
  };
  try {
    exporter.parse(
      scene,
      (result) => {
        if (!(result instanceof ArrayBuffer)) {
          console.error(
            "GLTFExporter.parse() result is not an ArrayBuffer:",
            result
          );
          alert("GLB Export failed: Invalid export result.");
          return;
        }
        const blob = new Blob([result], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        // alert(`GLB file exported successfully as ${filename}!`); // Alert is in Model3DCreator
      },
      (error) => {
        console.error("GLB Export parse failed:", error);
        alert(
          "GLB Export failed during parsing: " +
            (error?.message || String(error))
        );
      },
      options
    );
  } catch (error) {
    console.error("GLB Export setup failed:", error);
    alert("GLB Export setup failed: " + (error?.message || String(error)));
  }
}

const saneNumber = (value, defaultValue = 0) => {
  const num = Number(value);
  return isNaN(num) || !isFinite(num) ? defaultValue : num;
};

// This function is primarily for EXPORT context now. Display uses R3F components.
export const createMeshFromShape = async (shapeData) => {
  if (!THREE) {
    console.error("THREE.js is not available.");
    return null;
  }
  try {
    let geometry;
    const shapeTypeProp = shapeData.type || shapeData.geometry; // Ensure consistent prop access
    const textHeightForGeometry = saneNumber(shapeData.extrudeDepth, 0.2);
    const shapeSize = saneNumber(shapeData.shapeSize, 1);
    const textSizeForGeometry = saneNumber(shapeData.textSize, 0.5);

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
        const pG = new THREE.BufferGeometry();
        const pV = new Float32Array([
          -0.5, 0, -0.5, 0.5, 0, -0.5, 0.5, 0, 0.5, -0.5, 0, 0.5, 0, 1, 0,
        ]);
        const pI = [0, 1, 2, 0, 2, 3, 0, 4, 1, 1, 4, 2, 2, 4, 3, 3, 4, 0];
        pG.setIndex(pI);
        pG.setAttribute("position", new THREE.Float32BufferAttribute(pV, 3));
        pG.computeVertexNormals();
        pG.translate(0, -0.5, 0); // Center base at y=0
        geometry = pG;
        break;
      case "text":
        // Font loading for export is handled by Model3DCreator's export functions
        // This assumes helvetikerFontForR3F (or a similar one for export) is loaded by the caller
        let fontToUseForExport = helvetikerFontForR3F; // Or a specific export font if different
        if (!fontToUseForExport && typeof window !== "undefined") {
          try {
            fontToUseForExport = await new Promise((resolve, reject) =>
              r3fFontLoader.load(FONT_PATH_R3F, resolve, undefined, reject)
            );
            if (!helvetikerFontForR3F)
              helvetikerFontForR3F = fontToUseForExport; // Cache if not already
          } catch (e) {
            console.error(
              "Fallback font load in createMeshFromShape (text) failed:",
              e
            );
            geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
            break;
          }
        } else if (!fontToUseForExport) {
          geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
          break; // Fallback if font still not loaded
        }
        geometry = new TextGeometry(shapeData.text || "3D", {
          font: fontToUseForExport,
          size: textSizeForGeometry,
          height: textHeightForGeometry,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: saneNumber(textSizeForGeometry * 0.04, 0.02),
          bevelSize: saneNumber(textSizeForGeometry * 0.04, 0.02),
          bevelOffset: 0,
          bevelSegments: 3,
        });
        geometry.center();
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
        if (!(twoDShape instanceof THREE.Shape)) {
          // Fallback if shape creation failed
          twoDShape = new THREE.Shape()
            .moveTo(-0.5, -0.5)
            .lineTo(0.5, -0.5)
            .lineTo(0.5, 0.5)
            .lineTo(-0.5, 0.5)
            .closePath();
        }
        const extrudeSettings = {
          depth: textHeightForGeometry,
          bevelEnabled: true,
          bevelSegments: 2,
          steps: 1,
          bevelSize: textHeightForGeometry * 0.05,
          bevelThickness: textHeightForGeometry * 0.05,
        };
        geometry = new THREE.ExtrudeGeometry(twoDShape, extrudeSettings);
        geometry.center();
        break;
      case "imagePlane":
        geometry = new THREE.PlaneGeometry(
          shapeData.planeWidth || 1,
          shapeData.planeHeight || 1
        );
        break;
      case "importedGLB":
        return null; // GLBs are handled differently, not created by this func
      default:
        geometry = new THREE.BoxGeometry(1, 1, 1); // Fallback for unknown types
    }

    let material;
    if (shapeTypeProp === "imagePlane") {
      if (!shapeData.imageDataUrl) {
        material = new THREE.MeshBasicMaterial({
          color: 0xcccccc,
          side: THREE.DoubleSide,
          transparent: true,
        });
      } else {
        const textureLoader = new ThreeTextureLoader(); // Use THREE's loader for export
        try {
          const texture = await new Promise((resolve, reject) => {
            textureLoader.load(
              shapeData.imageDataUrl,
              (tex) => {
                tex.colorSpace = THREE.SRGBColorSpace;
                tex.flipY = false;
                tex.needsUpdate = true;
                resolve(tex);
              },
              undefined,
              (err) => {
                console.error(
                  `Export: Error loading imagePlane texture: ${shapeData.imageDataUrl}`,
                  err
                );
                reject(err);
              }
            );
          });
          material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true,
          });
        } catch (error) {
          console.error(
            "Error creating imagePlane material for export:",
            error
          );
          material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            side: THREE.DoubleSide,
            transparent: true,
          }); // Error placeholder
        }
      }
    } else {
      // For other primitives (text, box, etc.)
      const color = new THREE.Color(shapeData.color || "#ffffff");
      const pbrProps = {
        color,
        roughness:
          shapeData.roughness !== undefined ? shapeData.roughness : 0.5,
        metalness:
          shapeData.metalness !== undefined ? shapeData.metalness : 0.0,
      };
      switch (
        shapeData.material // Use shapeData.material for type
      ) {
        case "standard":
          material = new THREE.MeshStandardMaterial(pbrProps);
          break;
        case "physical":
          material = new THREE.MeshPhysicalMaterial(pbrProps);
          break;
        // Add other material types if supported (Toon, Lambert, Phong, Basic, Wireframe)
        default:
          material = new THREE.MeshStandardMaterial(pbrProps);
      }
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = `shape_export_${shapeData.id}_${shapeTypeProp}`;
    mesh.castShadow = shapeTypeProp !== "imagePlane";
    mesh.receiveShadow = true;
    return mesh;
  } catch (error) {
    console.error(
      "Critical error in createMeshFromShape (for export context):",
      shapeData,
      error
    );
    return null;
  }
};

// R3F component for dynamic material with textures
function LoadedTexturesMaterial({
  materialType,
  color,
  roughness,
  metalness,
  textureProps = {},
}) {
  const validTextureUrls = useMemo(() => {
    const urls = {};
    if (textureProps && typeof textureProps === "object") {
      for (const key in textureProps) {
        if (
          key.endsWith("Url") &&
          textureProps[key] &&
          typeof textureProps[key] === "string" &&
          textureProps[key].trim() !== ""
        ) {
          urls[key.replace("Url", "")] = textureProps[key]; // Use map, normalMap, etc. as keys for useTexture
        }
      }
    }
    return urls;
  }, [textureProps]);

  // useTexture hook from @react-three/drei
  const textures = useTexture ? useTexture(validTextureUrls) : {};

  const materialProps = useMemo(() => {
    const hasMapTexture = textures && textures.map; // Check for 'map' not 'mapUrl'
    const matColor = hasMapTexture
      ? new THREE.Color(0xffffff)
      : new THREE.Color(color || "#ffffff");

    const pbrBase = {
      color: matColor,
      roughness: saneNumber(roughness, 0.5),
      metalness: saneNumber(metalness, 0.0),
      map: textures?.map || null,
      normalMap: textures?.normalMap || null,
      roughnessMap: textures?.roughnessMap || null,
      metalnessMap: textures?.metalnessMap || null,
      aoMap: textures?.aoMap || null,
      emissiveMap: textures?.emissiveMap || null,
    };

    if (pbrBase.map) pbrBase.map.colorSpace = THREE.SRGBColorSpace;
    if (pbrBase.emissiveMap) {
      pbrBase.emissiveMap.colorSpace = THREE.SRGBColorSpace;
      pbrBase.emissive = new THREE.Color(0xffffff); // Standard practice
      pbrBase.emissiveIntensity = 1.0;
    }
    // Non-color maps (normal, roughness, metalness, ao) should be LinearSRGBColorSpace
    // useTexture usually handles this, but good to be aware. If loading manually, set it.
    if (pbrBase.normalMap)
      pbrBase.normalMap.colorSpace = THREE.LinearSRGBColorSpace;
    if (pbrBase.roughnessMap)
      pbrBase.roughnessMap.colorSpace = THREE.LinearSRGBColorSpace;
    if (pbrBase.metalnessMap)
      pbrBase.metalnessMap.colorSpace = THREE.LinearSRGBColorSpace;
    if (pbrBase.aoMap) pbrBase.aoMap.colorSpace = THREE.LinearSRGBColorSpace;

    // For aoMap, geometry needs uv2 attribute. This is often added when aoMap is present.
    // R3F handles this if geometry component (like <boxGeometry>) has uv2 attribute.
    // If using <primitive object={geometry} />, ensure geometry has uv2 if aoMap is used.
    const aoMapIntensity = pbrBase.aoMap ? 1.0 : 0;

    switch (materialType) {
      case "standard":
        return (
          <meshStandardMaterial {...pbrBase} aoMapIntensity={aoMapIntensity} />
        );
      case "physical":
        return (
          <meshPhysicalMaterial
            {...pbrBase}
            transmission={0}
            ior={1.5}
            thickness={0.01}
            aoMapIntensity={aoMapIntensity}
          />
        );
      case "toon":
        return <meshToonMaterial color={matColor} map={pbrBase.map} />;
      case "basic":
        return (
          <meshBasicMaterial
            color={matColor}
            map={pbrBase.map}
            wireframe={false}
          />
        );
      case "lambert":
        return <meshLambertMaterial color={matColor} map={pbrBase.map} />;
      case "phong":
        return (
          <meshPhongMaterial
            color={matColor}
            map={pbrBase.map}
            shininess={30}
          />
        );
      case "wireframe":
        return <meshBasicMaterial color={matColor} wireframe />;
      default:
        return (
          <meshStandardMaterial {...pbrBase} aoMapIntensity={aoMapIntensity} />
        );
    }
  }, [materialType, color, roughness, metalness, textures]);

  return materialProps;
}

function PyramidGeometryR3F(props) {
  const geometry = useMemo(() => {
    const pG = new THREE.BufferGeometry();
    const pV = new Float32Array([
      -0.5, 0, -0.5, 0.5, 0, -0.5, 0.5, 0, 0.5, -0.5, 0, 0.5, 0, 1, 0,
    ]);
    const pI = [0, 1, 2, 0, 2, 3, 0, 4, 1, 1, 4, 2, 2, 4, 3, 3, 4, 0];
    pG.setIndex(pI);
    pG.setAttribute("position", new THREE.Float32BufferAttribute(pV, 3));
    pG.computeVertexNormals();
    pG.translate(0, -0.5, 0); // Center base at y=0 for easier positioning
    return pG;
  }, []);
  return <primitive object={geometry} attach='geometry' {...props} />;
}

function ExtrudedCustomShapeGeometry({
  shapeType,
  shapeSize = 1,
  extrudeDepth = 0.2,
}) {
  const geometry = useMemo(() => {
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
    if (!(twoDShape instanceof THREE.Shape)) {
      twoDShape = new THREE.Shape()
        .moveTo(-0.5, -0.5)
        .lineTo(0.5, -0.5)
        .lineTo(0.5, 0.5)
        .lineTo(-0.5, 0.5)
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
  return <primitive object={geometry} attach='geometry' />;
}

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
  extrudeDepth, // Text props
  shapeType,
  shapeSize, // CustomExtruded props
  objectRef,
  animation,
  isAnimating,
  isTransformDragging,
  gltfModelScene, // THREE.Scene object from loaded GLTF
  imageDataUrl,
  planeWidth,
  planeHeight, // ImagePlane props
  textureProps,
  textTextureProps, // General texture props
}) {
  const localMeshRef = useRef(null);
  const groupRef = useRef(null); // For GLB wrapper and ImagePlane wrapper
  const orbitAngleRef = useRef(Math.random() * Math.PI * 2);

  // Refs for live transform values to avoid re-triggering effects on every frame for non-animated props
  const livePosition = useRef(new THREE.Vector3().fromArray(position));
  const liveRotation = useRef(new THREE.Euler().fromArray(rotation));
  const liveScale = useRef(new THREE.Vector3().fromArray(scale));

  useEffect(() => {
    livePosition.current.fromArray(position);
  }, [position]);
  useEffect(() => {
    liveRotation.current.fromArray(rotation);
  }, [rotation]);
  useEffect(() => {
    liveScale.current.fromArray(scale);
  }, [scale]);

  useEffect(() => {
    if (objectRef) {
      // Assign the correct ref to TransformControls target
      objectRef.current =
        type === "importedGLB" || type === "imagePlane"
          ? groupRef.current
          : localMeshRef.current;
    }
    return () => {
      // Cleanup: clear objectRef if it was pointing to this shape's mesh/group
      if (
        objectRef &&
        objectRef.current ===
          (type === "importedGLB" || type === "imagePlane"
            ? groupRef.current
            : localMeshRef.current)
      ) {
        objectRef.current = null;
      }
    };
  }, [objectRef, type]); // Rerun if objectRef or type changes

  useFrame((state, delta) => {
    const targetRef =
      type === "importedGLB" || type === "imagePlane"
        ? groupRef.current
        : localMeshRef.current;
    if (!targetRef) return;

    // Apply procedural animations if active and not a GLB (GLB anims handled by MainScene's AnimationMixer)
    if (
      type !== "importedGLB" &&
      isAnimating &&
      !isTransformDragging &&
      animation &&
      animation.type !== "none"
    ) {
      const effectiveSpeed = (animation.speed || 1) * delta;
      let currentP = livePosition.current.clone(); // Work with clones for calculations
      let currentR = liveRotation.current.clone();

      switch (animation.type) {
        case "rotate":
          if (animation.axis === "x") currentR.x += effectiveSpeed;
          else if (animation.axis === "y") currentR.y += effectiveSpeed;
          else if (animation.axis === "z") currentR.z += effectiveSpeed;
          liveRotation.current.copy(currentR); // Update live ref
          break;
        case "orbit":
          orbitAngleRef.current += effectiveSpeed * 0.2;
          const radius = animation.orbitRadius || 5;
          const cX = animation.orbitCenter?.[0] || 0;
          const cY =
            animation.orbitCenter?.[1] !== undefined
              ? animation.orbitCenter[1]
              : livePosition.current.y; // Keep current Y if not specified
          const cZ = animation.orbitCenter?.[2] || 0;
          const plane = animation.orbitPlane || "xz";
          if (plane === "xz")
            currentP.set(
              cX + Math.cos(orbitAngleRef.current) * radius,
              cY,
              cZ + Math.sin(orbitAngleRef.current) * radius
            );
          else if (plane === "xy")
            currentP.set(
              cX + Math.cos(orbitAngleRef.current) * radius,
              cY + Math.sin(orbitAngleRef.current) * radius,
              cZ
            );
          else if (plane === "yz")
            currentP.set(
              cX,
              cY + Math.cos(orbitAngleRef.current) * radius,
              cZ + Math.sin(orbitAngleRef.current) * radius
            );
          livePosition.current.copy(currentP); // Update live ref
          break;
      }
      targetRef.position.copy(livePosition.current);
      targetRef.rotation.copy(liveRotation.current);
    } else {
      // If not procedurally animating or is a GLB, just apply the live transform values
      targetRef.position.copy(livePosition.current);
      targetRef.rotation.copy(liveRotation.current);
    }
    targetRef.scale.copy(liveScale.current); // Scale is always applied from live ref
  });

  // Reset orbit angle if animation type changes (e.g. from orbit to none)
  useEffect(() => {
    if (animation?.type !== "orbit")
      orbitAngleRef.current = Math.random() * Math.PI * 2;
  }, [animation?.type]);

  const imagePlaneDisplayTexture =
    useTexture && type === "imagePlane" && imageDataUrl
      ? useTexture(imageDataUrl)
      : null;
  useEffect(() => {
    if (imagePlaneDisplayTexture && type === "imagePlane") {
      imagePlaneDisplayTexture.colorSpace = THREE.SRGBColorSpace;
      // useTexture defaults: flipY=true. For GLTF consistency, false is often better if textures are prepared for that.
      // However, for direct display of user-uploaded images, true (default) is usually correct.
      // imagePlaneDisplayTexture.flipY = false;
      imagePlaneDisplayTexture.needsUpdate = true;
    }
  }, [imagePlaneDisplayTexture, type]);

  const objectName = `shape_${id}_${type}_${
    name ||
    shapeType ||
    (type === "text" ? text?.substring(0, 10) || "Text" : "Object")
  }`;
  const currentMaterialProps =
    type === "text"
      ? {
          materialType,
          color,
          roughness,
          metalness,
          textureProps: textTextureProps,
        }
      : {
          materialType,
          color,
          roughness,
          metalness,
          textureProps: textureProps,
        };

  if (type === "text") {
    if (!Text3D || !useTexture)
      return (
        <mesh name={`${objectName}_text_fallback`}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial color='red' wireframe />
        </mesh>
      );
    return (
      <Suspense
        fallback={
          <mesh name={`${objectName}_loading_text`}>
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshBasicMaterial color='gray' wireframe />
          </mesh>
        }
      >
        <Text3D
          ref={localMeshRef}
          font={FONT_PATH_R3F} // Must be in public/fonts
          size={saneNumber(textSize, 0.5)}
          height={saneNumber(extrudeDepth, 0.1)} // Renamed from depth to extrudeDepth for consistency
          curveSegments={12}
          bevelEnabled
          bevelThickness={saneNumber(textSize * 0.04, 0.02)}
          bevelSize={saneNumber(textSize * 0.04, 0.02)}
          bevelOffset={0}
          bevelSegments={3}
          name={objectName}
          castShadow
          receiveShadow
          onClick={(e) => {
            e.stopPropagation();
            onClick(id, e);
          }}
          onPointerOver={(e) => e.stopPropagation()}
          onPointerOut={(e) => e.stopPropagation()}
        >
          {text || "Text"}
          <LoadedTexturesMaterial {...currentMaterialProps} />
        </Text3D>
      </Suspense>
    );
  } else if (type === "importedGLB") {
    if (!gltfModelScene) return null;
    return (
      <group
        ref={groupRef}
        name={objectName}
        onClick={(e) => {
          e.stopPropagation();
          onClick(id, e);
        }}
        onPointerOver={(e) => e.stopPropagation()}
        onPointerOut={(e) => e.stopPropagation()}
      >
        <primitive object={gltfModelScene} castShadow receiveShadow />
      </group>
    );
  } else if (type === "imagePlane") {
    return (
      <group
        ref={groupRef}
        name={objectName}
        onClick={(e) => {
          e.stopPropagation();
          onClick(id, e);
        }}
        onPointerOver={(e) => e.stopPropagation()}
        onPointerOut={(e) => e.stopPropagation()}
      >
        <mesh castShadow={false} receiveShadow>
          {" "}
          {/* Image planes typically don't cast shadows */}
          <planeGeometry args={[planeWidth || 1, planeHeight || 1]} />
          {imagePlaneDisplayTexture ? (
            <meshBasicMaterial
              map={imagePlaneDisplayTexture}
              side={THREE.DoubleSide}
              transparent={true}
            />
          ) : (
            <meshBasicMaterial
              color={0xcccccc}
              wireframe
              side={THREE.DoubleSide}
            />
          )}
        </mesh>
      </group>
    );
  } else {
    // Primitives
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
        case "customExtruded":
          return (
            <ExtrudedCustomShapeGeometry
              shapeType={shapeType}
              shapeSize={shapeSize}
              extrudeDepth={extrudeDepth}
            />
          );
        default:
          return <boxGeometry args={[0.1, 0.1, 0.1]} />; // Fallback
      }
    }, [type, shapeType, shapeSize, extrudeDepth]);

    return (
      <mesh
        ref={localMeshRef}
        name={objectName}
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onClick(id, e);
        }}
        onPointerOver={(e) => e.stopPropagation()}
        onPointerOut={(e) => e.stopPropagation()}
      >
        {proceduralGeometry}
        <Suspense fallback={<meshStandardMaterial color='gray' wireframe />}>
          <LoadedTexturesMaterial {...currentMaterialProps} />
        </Suspense>
      </mesh>
    );
  }
}

function SceneLighting() {
  const lightRef = useRef();
  const hdrPath = "/brown_photostudio_02_4k.hdr"; // Ensure this file is in your public folder

  return (
    <>
      {Environment && typeof Environment !== "string" && hdrPath ? (
        <Suspense fallback={null}>
          <Environment files={hdrPath} background={false} blur={0.5} />
        </Suspense>
      ) : (
        <directionalLight intensity={0.5} position={[5, 5, 5]} /> // Simple fallback
      )}
      <ambientLight intensity={0.7} />
      <directionalLight
        ref={lightRef}
        position={[8, 15, 10]}
        intensity={1.8} // Increased intensity
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
      <pointLight position={[-10, -10, -10]} color={0xffeedd} intensity={0.6} />
      <hemisphereLight
        skyColor={0xe6f0ff}
        groundColor={0xb0b0b0}
        intensity={0.4}
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
  loadedGltfObjects, // Map of shapeId -> { scene, animations }
  // GLB animation props
  animationClips, // This comes from Model3DCreator, specific to selected GLB
  selectedAnimationClipIndex,
  animationPlaybackState,
  isAnimationLooping,
  animationPlaybackSpeed,
  animationTime,
  playAllAnimations,
}) {
  const { scene, gl, camera } = useThree();
  const [transformObject, setTransformObject] = useState(null);
  const selectedObjectInternalRef = useRef(null); // Populated by the <Shape> component
  const [isTransformDragging, setIsTransformDragging] = useState(false);

  const activeMixers = useRef(new Map()); // shapeId -> AnimationMixer
  const activeActions = useRef(new Map()); // actionKey (shapeId_clipIndex or shapeId_all_clipIndex) -> AnimationAction

  useEffect(() => {
    if (sceneRef) sceneRef.current = scene;
  }, [scene, sceneRef]);

  // Update TransformControls target
  useEffect(() => {
    if (selectedShapeId && selectedObjectInternalRef.current) {
      const shapeData = shapes.find((s) => s.id === selectedShapeId);
      if (
        shapeData &&
        selectedObjectInternalRef.current.name.startsWith(
          `shape_${selectedShapeId}_${shapeData.type}`
        )
      ) {
        if (transformObject !== selectedObjectInternalRef.current) {
          setTransformObject(selectedObjectInternalRef.current);
        }
      } else if (transformObject !== null) {
        // Mismatch or stale ref
        setTransformObject(null);
      }
    } else {
      if (transformObject !== null) setTransformObject(null);
    }
  }, [
    selectedShapeId,
    shapes,
    selectedObjectInternalRef.current,
    transformObject,
  ]);

  // GLB Animation Playback Logic
  useEffect(() => {
    const currentSelectedShape = shapes.find((s) => s.id === selectedShapeId);

    // Stop and clear mixers/actions for shapes that are no longer selected or not GLB
    activeMixers.current.forEach((mixer, id) => {
      if (
        id !== selectedShapeId ||
        (currentSelectedShape && currentSelectedShape.type !== "importedGLB")
      ) {
        mixer.stopAllAction();
        activeMixers.current.delete(id);
        // Clear actions associated with this mixer
        const keysToDelete = [];
        activeActions.current.forEach((_, key) => {
          if (key.startsWith(id)) keysToDelete.push(key);
        });
        keysToDelete.forEach((key) => activeActions.current.delete(key));
      }
    });

    if (
      currentSelectedShape &&
      currentSelectedShape.type === "importedGLB" &&
      loadedGltfObjects[currentSelectedShape.id]
    ) {
      const gltfData = loadedGltfObjects[currentSelectedShape.id];
      if (
        gltfData &&
        gltfData.animations &&
        gltfData.animations.length > 0 &&
        gltfData.scene
      ) {
        let mixer = activeMixers.current.get(currentSelectedShape.id);
        const animatedRoot = gltfData.scene; // The object that has the animations mixed in

        if (!mixer || mixer.getRoot() !== animatedRoot) {
          mixer = new THREE.AnimationMixer(animatedRoot);
          activeMixers.current.set(currentSelectedShape.id, mixer);
        }

        // Stop all previous actions for this GLB before setting up new ones
        mixer.stopAllAction();
        const keysToDeleteForCurrentShape = [];
        activeActions.current.forEach((_, key) => {
          if (key.startsWith(currentSelectedShape.id))
            keysToDeleteForCurrentShape.push(key);
        });
        keysToDeleteForCurrentShape.forEach((key) =>
          activeActions.current.delete(key)
        );

        const setupAction = (clip, clipIndexForActionKey) => {
          const action = mixer.clipAction(clip, animatedRoot); // Pass root explicitly
          action.setLoop(
            isAnimationLooping ? THREE.LoopRepeat : THREE.LoopOnce,
            Infinity
          );
          action.timeScale = animationPlaybackSpeed;

          // Calculate start time based on normalized animationTime (0 to 1)
          const startTime = animationTime * (clip.duration || 0); // animationTime is normalized 0-1
          action.time = startTime;

          if (animationPlaybackState === "playing") {
            action.play();
            action.paused = false;
          } else if (animationPlaybackState === "paused") {
            action.play(); // Start it, then pause
            action.paused = true;
            if (startTime === 0) mixer.update(0); // Ensure first frame is shown if paused at start
          } else {
            // 'stopped'
            action.stop();
            if (startTime === 0) mixer.update(0); // Ensure reset to first frame
          }
          const actionKey = `${currentSelectedShape.id}_${
            playAllAnimations
              ? `all_${clipIndexForActionKey}`
              : `clip_${selectedAnimationClipIndex}`
          }`;
          activeActions.current.set(actionKey, action);
        };

        if (playAllAnimations) {
          gltfData.animations.forEach((clip, index) =>
            setupAction(clip, index)
          );
        } else if (
          selectedAnimationClipIndex >= 0 &&
          selectedAnimationClipIndex < gltfData.animations.length
        ) {
          const clip = gltfData.animations[selectedAnimationClipIndex];
          setupAction(clip, selectedAnimationClipIndex);
        }
      }
    }
  }, [
    selectedShapeId,
    shapes,
    loadedGltfObjects,
    selectedAnimationClipIndex,
    animationPlaybackState,
    isAnimationLooping,
    animationPlaybackSpeed,
    animationTime,
    playAllAnimations,
  ]);

  useFrame((state, delta) => {
    activeMixers.current.forEach((mixer, shapeId) => {
      // Only update mixer for the currently selected and playing GLB
      if (shapeId === selectedShapeId && animationPlaybackState === "playing") {
        mixer.update(delta); // delta is time since last frame
      }
    });
  });

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
        const gltfObjectData = loadedGltfObjects[shapeData.id];
        return (
          <Shape
            key={shapeData.id}
            {...shapeData}
            gltfModelScene={gltfObjectData?.scene}
            animation={shapeData.animation} // Procedural animation config
            isAnimating={isAnimating} // Global animation toggle for procedural
            onClick={onShapeClick}
            objectRef={
              shapeData.id === selectedShapeId
                ? selectedObjectInternalRef
                : null
            }
            isTransformDragging={
              shapeData.id === selectedShapeId && isTransformDragging
            }
            textureProps={shapeData.textureProps} // For primitives and GLB override
            textTextureProps={shapeData.textTextureProps} // For text shapes
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
              if (selectedShapeId && transformObject)
                onShapeUpdate(selectedShapeId);
            }}
            onDraggingChanged={(event) => {
              const dragging = event.value;
              setIsTransformDragging(dragging);
              // Access controls via scene.__r3f.controls if OrbitControls is default
              const orbitCtrl = scene.__r3f?.controls;
              if (orbitCtrl)
                orbitCtrl.enabled = !dragging && orbitControlsEnabled;
            }}
            size={0.75}
            space={mode === "scale" ? "local" : "world"}
            camera={camera}
            domElement={gl.domElement}
          />
        )}
      {OrbitControls && typeof OrbitControls !== "string" && (
        <OrbitControls
          enabled={orbitControlsEnabled && !isTransformDragging}
          makeDefault // Sets this as the default controls
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
  const { camera } = useThree();
  const controls = useThree((state) => state.controls); // Access default controls

  const cameraPresets = useMemo(
    () => ({
      top: { position: [0, 15, 0.01], target: [0, 0, 0] }, // Small Z offset for top view
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
        // If OrbitControls are active
        controls.target.set(...target);
        controls.update(); // Important for OrbitControls
      } else {
        // Fallback if no OrbitControls or not using target
        camera.lookAt(new THREE.Vector3(...target));
      }
      camera.updateProjectionMatrix();
    }
  }, [preset, camera, controls, cameraPresets]);
  return null;
}
