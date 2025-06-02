import React, { Suspense, useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";
// Import JSM modules directly
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
// TextureLoader is often available on THREE namespace, but direct import is safer:
import { TextureLoader as ThreeTextureLoader } from "three/src/loaders/TextureLoader.js"; // Renamed to avoid conflict if useTexture is also named TextureLoader

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

const FONT_PATH_R3F = "/fonts/helvetiker_regular.typeface.json"; // Ensure this path is correct in your public folder
let helvetikerFontForR3F = null;
const r3fFontLoaderInstance = new FontLoader(); // Use the imported FontLoader
if (typeof window !== "undefined" && !helvetikerFontForR3F) {
  r3fFontLoaderInstance.load(
    FONT_PATH_R3F,
    (font) => {
      helvetikerFontForR3F = font;
      // console.log("SceneElements: Helvetiker font loaded for R3F/createMesh.");
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
    embedImages: true,
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
        // alert(`GLB file exported successfully as ${filename}!`); // Consider using a less obtrusive notification
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

export const createMeshFromShape = async (shapeData) => {
  if (!THREE) {
    console.error("THREE.js is not available.");
    return null;
  }
  try {
    let geometry;
    const shapeTypeProp = shapeData.type || shapeData.geometry;
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
        let fontToUse = helvetikerFontForR3F; // Use the preloaded one for R3F context
        if (!fontToUse && typeof window !== "undefined") {
          // Fallback if not preloaded
          try {
            fontToUse = await new Promise(
              (resolve, reject) =>
                r3fFontLoaderInstance.load(
                  FONT_PATH_R3F,
                  resolve,
                  undefined,
                  reject
                ) // Use instance
            );
            if (!helvetikerFontForR3F) helvetikerFontForR3F = fontToUse;
          } catch (e) {
            console.error(
              "Fallback font load failed in createMeshFromShape (text):",
              e
            );
            geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1); // Fallback geometry
            break;
          }
        } else if (!fontToUse) {
          // If still no font (e.g., SSR or initial load fail)
          console.error("Font not available for text geometry creation.");
          geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1); // Fallback geometry
          break;
        }
        geometry = new TextGeometry(shapeData.text || "3D", {
          font: fontToUse,
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
        return null; // GLBs are handled differently
      default:
        geometry = new THREE.BoxGeometry(1, 1, 1);
    }

    let material;
    const textureLoaderInstance = new ThreeTextureLoader(); // Local instance for this function

    if (shapeTypeProp === "imagePlane") {
      if (!shapeData.imageDataUrl) {
        material = new THREE.MeshBasicMaterial({
          color: 0xcccccc,
          side: THREE.DoubleSide,
          transparent: true,
        });
      } else {
        try {
          const texture = await new Promise((resolve, reject) => {
            textureLoaderInstance.load(
              shapeData.imageDataUrl,
              (tex) => {
                tex.colorSpace = THREE.SRGBColorSpace;
                tex.flipY = false; // GLTF standard
                // tex.needsUpdate = true; // Loader handles this typically
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
          });
        }
      }
    } else {
      const color = new THREE.Color(shapeData.color || "#ffffff");
      const pbrProps = {
        color,
        roughness: saneNumber(shapeData.roughness, 0.5),
        metalness: saneNumber(shapeData.metalness, 0.0),
        side: THREE.DoubleSide,
      };
      switch (shapeData.material) {
        case "standard":
          material = new THREE.MeshStandardMaterial(pbrProps);
          break;
        case "physical":
          material = new THREE.MeshPhysicalMaterial({
            ...pbrProps,
            transmission: saneNumber(shapeData.transmission, 0.0),
            ior: saneNumber(shapeData.ior, 1.5),
            thickness: saneNumber(shapeData.thickness, 0.01),
            // Add other physical props if they are part of shapeData
          });
          break;
        case "toon":
          material = new THREE.MeshToonMaterial({
            color,
            side: THREE.DoubleSide,
          });
          break;
        case "basic":
          material = new THREE.MeshBasicMaterial({
            color,
            side: THREE.DoubleSide,
          });
          break;
        case "lambert":
          material = new THREE.MeshLambertMaterial({
            color,
            side: THREE.DoubleSide,
          });
          break;
        case "phong":
          material = new THREE.MeshPhongMaterial({
            color,
            shininess: 30,
            side: THREE.DoubleSide,
          });
          break;
        case "wireframe":
          material = new THREE.MeshBasicMaterial({
            color,
            wireframe: true,
            side: THREE.DoubleSide,
          });
          break;
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

function LoadedTexturesMaterial({
  materialType,
  color,
  roughness,
  metalness,
  textureProps = {}, // This should contain all props including transmission, ior, etc.
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
          // useTexture from Drei will assign these directly, e.g. textures.map, textures.normalMap
          // So we pass the key without "Url" for useTexture hook.
          urls[key.replace("Url", "")] = textureProps[key];
        }
      }
    }
    return urls;
  }, [textureProps]);

  // useTexture hook handles sRGB encoding for known color texture types automatically
  // For other maps, it generally assumes linear.
  const textures = useTexture ? useTexture(validTextureUrls) : {};

  const materialProps = useMemo(() => {
    const hasMapTexture = textures && textures.map; // Key is 'map', not 'mapUrl' after useTexture
    const matColor = hasMapTexture ? 0xffffff : color || "#ffffff";

    const baseProps = {
      color: new THREE.Color(matColor),
      side: THREE.DoubleSide,
    };

    if (textures?.map) {
      baseProps.map = textures.map;
      // useTexture typically sets SRGBColorSpace for .jpg, .png
    }
    if (textures?.normalMap) {
      baseProps.normalMap = textures.normalMap;
      // useTexture typically sets Linear for normal maps
    }

    if (materialType === "standard" || materialType === "physical") {
      baseProps.roughness = saneNumber(roughness, 0.5); // Roughness from main prop
      baseProps.metalness = saneNumber(metalness, 0.0); // Metalness from main prop

      if (textureProps.roughness !== undefined && !textures?.roughnessMap) {
        // Check dedicated roughness prop from textureProps
        baseProps.roughness = saneNumber(textureProps.roughness, 0.5);
      }
      if (textureProps.metalness !== undefined && !textures?.metalnessMap) {
        // Check dedicated metalness prop from textureProps
        baseProps.metalness = saneNumber(textureProps.metalness, 0.0);
      }

      if (textures?.roughnessMap) {
        baseProps.roughnessMap = textures.roughnessMap;
        // useTexture typically sets Linear for roughness maps
      }
      if (textures?.metalnessMap) {
        baseProps.metalnessMap = textures.metalnessMap;
        // useTexture typically sets Linear for metalness maps
      }
      if (textures?.aoMap) {
        baseProps.aoMap = textures.aoMap;
        baseProps.aoMapIntensity =
          textureProps.aoMapIntensity !== undefined
            ? saneNumber(textureProps.aoMapIntensity, 1.0)
            : 1.0;
        // useTexture typically sets Linear for ao maps
      }

      if (textures?.emissiveMap) {
        baseProps.emissiveMap = textures.emissiveMap;
        // useTexture typically sets SRGBColorSpace for emissive maps
        baseProps.emissive = new THREE.Color(
          textureProps.emissiveColor || 0xffffff
        ); // Use emissiveColor from textureProps if available
        baseProps.emissiveIntensity =
          textureProps.emissiveIntensity !== undefined
            ? saneNumber(textureProps.emissiveIntensity, 1.0)
            : 1.0;
      } else if (textureProps.emissiveColor) {
        baseProps.emissive = new THREE.Color(textureProps.emissiveColor);
        baseProps.emissiveIntensity =
          textureProps.emissiveIntensity !== undefined
            ? saneNumber(textureProps.emissiveIntensity, 1.0)
            : 1.0;
      }
    }

    if (materialType === "physical") {
      // Ensure these come from textureProps as they are specific physical material properties
      baseProps.transmission = saneNumber(textureProps.transmission, 0.0);
      baseProps.ior = saneNumber(textureProps.ior, 1.5);
      baseProps.thickness = saneNumber(textureProps.thickness, 0.01);
      // Add other physical material properties from textureProps if needed
      // e.g., clearcoat, sheen, specularIntensity/Color
      if (textureProps.clearcoat !== undefined)
        baseProps.clearcoat = saneNumber(textureProps.clearcoat, 0.0);
      if (textureProps.clearcoatRoughness !== undefined)
        baseProps.clearcoatRoughness = saneNumber(
          textureProps.clearcoatRoughness,
          0.0
        );
      if (textureProps.sheen !== undefined)
        baseProps.sheen = saneNumber(textureProps.sheen, 0.0);
      if (textureProps.sheenColor !== undefined)
        baseProps.sheenColor = new THREE.Color(textureProps.sheenColor);
      if (textureProps.sheenRoughness !== undefined)
        baseProps.sheenRoughness = saneNumber(textureProps.sheenRoughness, 0.0);
      if (textureProps.specularIntensity !== undefined)
        baseProps.specularIntensity = saneNumber(
          textureProps.specularIntensity,
          1.0
        );
      if (textureProps.specularColor !== undefined)
        baseProps.specularColor = new THREE.Color(textureProps.specularColor);
    }

    // After useTexture, textures are already THREE.Texture instances.
    // Their colorSpace should be correctly set by useTexture based on image type or explicit hints.
    // No need to set colorSpace again here unless useTexture is configured differently.

    return baseProps;
  }, [materialType, color, roughness, metalness, textures, textureProps]);

  switch (materialType) {
    case "standard":
      return <meshStandardMaterial {...materialProps} />;
    case "physical":
      return <meshPhysicalMaterial {...materialProps} />;
    case "toon":
      return (
        <meshToonMaterial
          color={materialProps.color}
          map={materialProps.map} // Toon can use map
          side={THREE.DoubleSide}
        />
      );
    case "basic":
      return (
        <meshBasicMaterial
          color={materialProps.color}
          map={materialProps.map} // Basic can use map
          wireframe={false} // Ensure wireframe is false unless 'wireframe' material type
          side={THREE.DoubleSide}
        />
      );
    case "lambert":
      return (
        <meshLambertMaterial
          color={materialProps.color}
          map={materialProps.map} // Lambert can use map
          side={THREE.DoubleSide}
        />
      );
    case "phong":
      return (
        <meshPhongMaterial
          color={materialProps.color}
          map={materialProps.map} // Phong can use map
          shininess={
            textureProps.shininess !== undefined
              ? saneNumber(textureProps.shininess, 30)
              : 30
          }
          side={THREE.DoubleSide}
        />
      );
    case "wireframe": // Special case for wireframe
      return (
        <meshBasicMaterial
          color={materialProps.color} // Usually uses the base color
          wireframe={true}
          side={THREE.DoubleSide}
        />
      );
    default: // Fallback to standard
      return <meshStandardMaterial {...materialProps} />;
  }
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
    pG.translate(0, -0.5, 0);
    return pG;
  }, []);
  if (!geometry) return <boxGeometry args={[0.1, 0.1, 0.1]} />;
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
    const geo = new THREE.ExtrudeGeometry(twoDShape, extrudeSettings);
    geo.center();
    return geo;
  }, [shapeType, shapeSize, extrudeDepth]);
  if (!geometry) return <boxGeometry args={[0.1, 0.1, 0.1]} />;
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
  shapeType,
  shapeSize = 1,
  extrudeDepth = 0.2,
  objectRef,
  animation,
  isAnimating,
  isTransformDragging,
  gltfModelScene,
  imageDataUrl,
  planeWidth,
  planeHeight,
  textureProps, // Generic texture properties
  textTextureProps, // Specific for Text3D if it needs different handling
  // Physical material props (could be part of textureProps too)
  transmission,
  ior,
  thickness,
}) {
  const localMeshRef = useRef(null);
  const groupRef = useRef(null);
  const orbitAngleRef = useRef(Math.random() * Math.PI * 2);
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
      objectRef.current =
        type === "importedGLB" || type === "imagePlane"
          ? groupRef.current
          : localMeshRef.current;
    }
    return () => {
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
  }, [objectRef, type]);
  useFrame((state, delta) => {
    const targetRef =
      type === "importedGLB" || type === "imagePlane"
        ? groupRef.current
        : localMeshRef.current;
    if (!targetRef) return;
    if (
      type !== "importedGLB" && // GLB animations are handled by AnimationMixer
      isAnimating &&
      !isTransformDragging &&
      animation &&
      animation.type !== "none"
    ) {
      const effectiveSpeed = (animation.speed || 1) * delta;
      let currentP = livePosition.current.clone();
      let currentR = liveRotation.current.clone();
      switch (animation.type) {
        case "rotate":
          if (animation.axis === "x") currentR.x += effectiveSpeed;
          else if (animation.axis === "y") currentR.y += effectiveSpeed;
          else if (animation.axis === "z") currentR.z += effectiveSpeed;
          liveRotation.current.copy(currentR);
          break;
        case "orbit":
          orbitAngleRef.current += effectiveSpeed * 0.2;
          const radius = animation.orbitRadius || 5;
          const cX = animation.orbitCenter?.[0] || 0;
          const cY =
            animation.orbitCenter?.[1] !== undefined
              ? animation.orbitCenter[1]
              : livePosition.current.y;
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
          livePosition.current.copy(currentP);
          break;
      }
      targetRef.position.copy(livePosition.current);
      targetRef.rotation.copy(liveRotation.current);
    } else {
      targetRef.position.copy(livePosition.current);
      targetRef.rotation.copy(liveRotation.current);
    }
    targetRef.scale.copy(liveScale.current);
  });
  useEffect(() => {
    if (animation?.type !== "orbit")
      orbitAngleRef.current = Math.random() * Math.PI * 2;
  }, [animation?.type]);
  const imagePlaneDisplayTexture =
    useTexture && type === "imagePlane" && imageDataUrl
      ? useTexture(imageDataUrl) // useTexture returns the texture directly
      : null;

  useEffect(() => {
    if (imagePlaneDisplayTexture && type === "imagePlane") {
      // useTexture typically sets sRGB for JPG/PNG by default
      // imagePlaneDisplayTexture.colorSpace = THREE.SRGBColorSpace; // Might be redundant if useTexture handles it
      imagePlaneDisplayTexture.flipY = false; // GLTF standard
      imagePlaneDisplayTexture.needsUpdate = true;
    }
  }, [imagePlaneDisplayTexture, type]);
  const objectName = `shape_${id}_${type}_${
    name ||
    shapeType ||
    (type === "text" ? text?.substring(0, 10) || "Text" : "")
  }`;

  // Consolidate texture props. If textTextureProps is defined and type is text, use it.
  // Otherwise, use generic textureProps.
  // Also pass down physical material props if they are separate.
  const currentMaterialAndTextureProps = useMemo(() => {
    const props =
      type === "text" && textTextureProps ? textTextureProps : textureProps;
    return {
      ...props, // This includes mapUrl, normalMapUrl, roughness, metalness, aoMapIntensity, etc.
      // Explicitly pass physical props if they are top-level on the shapeData
      // and not already inside textureProps (LoadedTexturesMaterial expects them in textureProps)
      transmission: props?.transmission ?? transmission,
      ior: props?.ior ?? ior,
      thickness: props?.thickness ?? thickness,
      // Add any other physical props here if they are separate on shapeData
    };
  }, [type, textureProps, textTextureProps, transmission, ior, thickness]);

  if (type === "text") {
    if (!Text3D || !useTexture || !FONT_PATH_R3F)
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
          font={FONT_PATH_R3F}
          size={saneNumber(textSize, 0.5)}
          height={saneNumber(extrudeDepth, 0.1)} // Renamed from 'depth' to 'height' for Text3D
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
          <LoadedTexturesMaterial
            materialType={materialType}
            color={color}
            roughness={roughness} // Pass base roughness
            metalness={metalness} // Pass base metalness
            textureProps={currentMaterialAndTextureProps} // Pass all texture-related props
          />
        </Text3D>
      </Suspense>
    );
  } else if (type === "importedGLB") {
    if (!gltfModelScene) return null;
    // For GLBs, material/texture changes are applied directly to the model's meshes
    // by applyTextureToGLBNode, so no <LoadedTexturesMaterial> here.
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
        <primitive object={gltfModelScene} />
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
    // Procedural shapes
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

    if (!useTexture) {
      // Fallback if useTexture is not available
      let fallbackMaterial;
      const fallbackColor = new THREE.Color(color || "#ffffff");
      switch (materialType) {
        case "physical":
          fallbackMaterial = (
            <meshPhysicalMaterial
              color={fallbackColor}
              roughness={roughness}
              metalness={metalness}
              transmission={transmission}
              ior={ior}
              thickness={thickness}
              side={THREE.DoubleSide}
            />
          );
          break;
        // Add other material types if needed for fallback
        default:
          fallbackMaterial = (
            <meshStandardMaterial
              color={fallbackColor}
              roughness={roughness}
              metalness={metalness}
              side={THREE.DoubleSide}
            />
          );
      }
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
        >
          {proceduralGeometry}
          {fallbackMaterial}
        </mesh>
      );
    }

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
          <LoadedTexturesMaterial
            materialType={materialType}
            color={color}
            roughness={roughness} // Pass base roughness
            metalness={metalness} // Pass base metalness
            textureProps={currentMaterialAndTextureProps} // Pass all texture-related props
          />
        </Suspense>
      </mesh>
    );
  }
}

function SceneLighting() {
  const lightRef = useRef();
  const hdrPath = "/brown_photostudio_02_4k.hdr"; // Make sure this path is correct in your /public folder
  return (
    <>
      <Suspense fallback={null}>
        {Environment && typeof Environment !== "string" && hdrPath ? (
          <Environment files={hdrPath} background={false} blur={0.5} />
        ) : (
          <directionalLight intensity={0.5} position={[5, 5, 5]} /> // Fallback if Environment or HDR path fails
        )}
      </Suspense>
      <ambientLight intensity={0.7} />
      <directionalLight
        ref={lightRef}
        position={[8, 15, 10]}
        intensity={1.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-bias={-0.0005} // Adjusted shadow bias
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

// export function MainScene({
//   shapes,
//   selectedShapeId,
//   mode,
//   onShapeClick,
//   onShapeUpdate,
//   orbitControlsEnabled,
//   sceneRef,
//   isAnimating, // Global animation state for procedural shapes
//   loadedGltfObjects,
//   // GLB specific animation props
//   selectedAnimationClipIndex,
//   animationPlaybackState,
//   isAnimationLooping,
//   animationPlaybackSpeed,
//   animationTime, // Current time, normalized 0-1 or absolute
//   playAllAnimations,
// }) {
//   const { scene, gl, camera } = useThree();
//   const [transformObject, setTransformObject] = useState(null);
//   const selectedObjectInternalRef = useRef(null); // Ref to the THREE.Object3D instance
//   const [isTransformDragging, setIsTransformDragging] = useState(false);

//   // Refs for GLB animation
//   const activeMixers = useRef(new Map());
//   const activeActions = useRef(new Map()); // Stores individual actions

//   useEffect(() => {
//     if (sceneRef) sceneRef.current = scene;
//   }, [scene, sceneRef]);

//   useEffect(() => {
//     if (selectedShapeId && selectedObjectInternalRef.current) {
//       const shapeData = shapes.find((s) => s.id === selectedShapeId);
//       // Check if the internal ref still points to the selected shape (name check as a heuristic)
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
//         // If internal ref doesn't match, or shapeData not found, clear transformObject
//         setTransformObject(null);
//       }
//     } else {
//       // No selectedShapeId or no internal ref, clear transformObject
//       if (transformObject !== null) setTransformObject(null);
//     }
//   }, [
//     selectedShapeId,
//     shapes,
//     selectedObjectInternalRef.current,
//     transformObject,
//   ]); // Dependency on selectedObjectInternalRef.current is tricky but necessary here

//   // Effect for handling GLB animations
//   useEffect(() => {
//     const currentSelectedShape = shapes.find((s) => s.id === selectedShapeId);

//     // Cleanup mixers for shapes that are no longer selected or not GLBs
//     activeMixers.current.forEach((mixer, id) => {
//       if (
//         id !== selectedShapeId ||
//         (currentSelectedShape && currentSelectedShape.type !== "importedGLB")
//       ) {
//         mixer.stopAllAction();
//         activeMixers.current.delete(id);
//         activeActions.current.forEach((_, key) => {
//           // Clean up actions map
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
//         const animatedRoot = gltfData.scene; // The object that AnimationMixer will operate on

//         if (!mixer || mixer.getRoot() !== animatedRoot) {
//           mixer = new THREE.AnimationMixer(animatedRoot);
//           activeMixers.current.set(currentSelectedShape.id, mixer);
//         }

//         // Stop and clear previous actions for this shape before setting up new ones
//         mixer.stopAllAction();
//         activeActions.current.forEach((_, key) => {
//           if (key.startsWith(currentSelectedShape.id))
//             activeActions.current.delete(key);
//         });

//         const setupAction = (clip, clipIndex) => {
//           const action = mixer.clipAction(clip, animatedRoot); // Ensure root is correct
//           action.setLoop(
//             isAnimationLooping ? THREE.LoopRepeat : THREE.LoopOnce,
//             Infinity
//           );
//           action.timeScale = animationPlaybackSpeed;

//           // animationTime for GLBs is usually the absolute time for the clip
//           // If animationTime is normalized (0-1), multiply by duration
//           // Assuming animationTime from props is absolute here
//           const startTime = animationTime; // Direct use if absolute time
//           // const startTime = animationTime * (clip.duration || 0); // If normalized
//           action.time = startTime;

//           if (animationPlaybackState === "playing") {
//             action.play();
//             action.paused = false;
//           } else if (animationPlaybackState === "paused") {
//             action.play(); // Action must be 'playing' to be paused at a specific frame
//             action.paused = true;
//             if (startTime === 0 && !action.isRunning()) mixer.update(0); // Update to show first frame if paused at start
//           } else {
//             // 'stopped'
//             action.stop();
//             if (startTime === 0 && !action.isRunning()) mixer.update(0); // Ensure reset to first frame
//           }
//           // Store the action for potential direct manipulation (e.g., scrubbing)
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
//     animationTime, // React to time changes for scrubbing
//     playAllAnimations,
//   ]);

//   useFrame((state, delta) => {
//     // Update active mixers
//     activeMixers.current.forEach((mixer, shapeId) => {
//       // Only update mixer for the currently selected GLB if its animation is playing
//       if (shapeId === selectedShapeId && animationPlaybackState === "playing") {
//         mixer.update(delta);
//       }
//     });
//   });

//   return (
//     <>
//       <SceneLighting />
//       {/* Ground Plane for Shadows */}
//       <mesh
//         rotation={[-Math.PI / 2, 0, 0]}
//         position={[0, -0.01, 0]} // Slightly below grid
//         receiveShadow
//         name='ground_plane'
//       >
//         <planeGeometry args={[100, 100]} />
//         <shadowMaterial opacity={0.25} color={0x000000} />
//       </mesh>

//       {/* Grid Helper */}
//       {Grid && typeof Grid !== "string" && (
//         <Grid
//           args={[100, 100]} // size of the grid
//           position={[0, 0, 0]} // position of the grid
//           cellSize={0.5}
//           cellThickness={0.5} // Make grid lines thinner
//           cellColor={new THREE.Color(0x444444)} // Darker grey for subtle lines
//           sectionSize={2.5} // Every 5 cells make a thicker line
//           sectionThickness={1} // Thicker lines for sections
//           sectionColor={new THREE.Color(0x6f6f6f)} // Slightly lighter grey for sections
//           fadeDistance={50} // Start fading at 50 units
//           fadeStrength={1} // Fully faded at distance
//           infiniteGrid
//           followCamera={false} // If true, grid moves with camera
//         />
//       )}

//       {/* Render all shapes */}
//       {shapes.map((shapeData) => {
//         const gltfObjectData = loadedGltfObjects[shapeData.id];
//         return (
//           <Shape
//             key={shapeData.id}
//             {...shapeData} // Spread all shape properties
//             gltfModelScene={gltfObjectData?.scene}
//             animation={shapeData.animation} // Procedural animation config
//             isAnimating={isAnimating && shapeData.type !== "importedGLB"} // Pass global animation state for procedural shapes
//             onClick={onShapeClick}
//             objectRef={
//               shapeData.id === selectedShapeId
//                 ? selectedObjectInternalRef
//                 : null
//             } // Pass ref only for the selected shape
//             isTransformDragging={
//               shapeData.id === selectedShapeId && isTransformDragging
//             } // Pass dragging state only for selected
//             textureProps={shapeData.textureProps}
//             textTextureProps={shapeData.textTextureProps}
//             // Pass physical material props if they are stored directly on shapeData
//             transmission={shapeData.transmission}
//             ior={shapeData.ior}
//             thickness={shapeData.thickness}
//           />
//         );
//       })}

//       {/* Transform Controls for selected shape */}
//       {selectedShapeId &&
//         transformObject &&
//         mode &&
//         TransformControls &&
//         typeof TransformControls !== "string" && (
//           <TransformControls
//             object={transformObject}
//             mode={mode}
//             onObjectChange={() => {
//               // This callback can be too frequent. Debounce or use onDraggingChanged.
//               // For now, let's assume onShapeUpdate handles debouncing or is efficient.
//               if (selectedShapeId && transformObject)
//                 onShapeUpdate(selectedShapeId); // Tell parent to update shape's state from THREE object
//             }}
//             onDraggingChanged={(event) => {
//               const dragging = event.value;
//               setIsTransformDragging(dragging);
//               // Disable orbit controls while transform dragging
//               const orbitCtrl = scene.__r3f?.controls; // Access orbit controls instance
//               if (orbitCtrl)
//                 orbitCtrl.enabled = !dragging && orbitControlsEnabled; // Re-enable based on prop
//             }}
//             size={0.75}
//             space={mode === "scale" ? "local" : "world"} // Scale usually local, others world
//             camera={camera}
//             domElement={gl.domElement} // Important for event handling
//           />
//         )}

//       {/* Orbit Controls */}
//       {OrbitControls && typeof OrbitControls !== "string" && (
//         <OrbitControls
//           enabled={orbitControlsEnabled && !isTransformDragging} // Controlled by prop and transform dragging state
//           makeDefault // Makes these the default controls
//           enableDamping
//           dampingFactor={0.05}
//           minDistance={0.5}
//           maxDistance={100} // Increased max distance
//           zoomSpeed={0.7}
//           panSpeed={0.7}
//         />
//       )}
//     </>
//   );
// }
// SceneElements.jsx

// ... other imports and code ...

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
  selectedAnimationClipIndex,
  animationPlaybackState,
  isAnimationLooping,
  animationPlaybackSpeed,
  animationTime,
  playAllAnimations,
}) {
  const { scene, gl, camera } = useThree(); // scene is from useThree
  const [transformObject, setTransformObject] = useState(null);
  const selectedObjectInternalRef = useRef(null);
  const [isTransformDragging, setIsTransformDragging] = useState(false);

  const activeMixers = useRef(new Map());
  const activeActions = useRef(new Map());

  useEffect(() => {
    if (sceneRef) sceneRef.current = scene;
  }, [scene, sceneRef]);

  // MODIFIED useEffect for setting transformObject
  useEffect(() => {
    if (selectedShapeId) {
      const shapeData = shapes.find((s) => s.id === selectedShapeId);
      if (shapeData && selectedObjectInternalRef.current) {
        // Check if the object is actually part of the current R3F scene graph
        let current = selectedObjectInternalRef.current;
        let isInScene = false;
        while (current.parent) {
          if (current.parent === scene) {
            isInScene = true;
            break;
          }
          current = current.parent;
        }

        // Also ensure the ref points to the currently selected shape's object
        const expectedNamePrefix = `shape_${selectedShapeId}_${shapeData.type}`;
        const isCorrectObject =
          selectedObjectInternalRef.current.name?.startsWith(
            expectedNamePrefix
          );

        if (isInScene && isCorrectObject) {
          if (transformObject !== selectedObjectInternalRef.current) {
            // console.log("MainScene: Setting transform object to:", selectedObjectInternalRef.current.name);
            setTransformObject(selectedObjectInternalRef.current);
          }
        } else if (transformObject !== null) {
          // console.log(`MainScene: Clearing transform object. In scene: ${isInScene}, Correct object: ${isCorrectObject}, Ref name: ${selectedObjectInternalRef.current?.name}`);
          setTransformObject(null);
        }
      } else if (transformObject !== null) {
        // console.log("MainScene: Clearing transform object because shapeData or internalRef is missing.");
        setTransformObject(null);
      }
    } else {
      // No selectedShapeId
      if (transformObject !== null) {
        // console.log("MainScene: Clearing transform object due to no selectedShapeId.");
        setTransformObject(null);
      }
    }
    // Dependencies:
    // - selectedShapeId: Triggers re-evaluation when selection changes.
    // - shapes: If the shape data itself changes for the selected ID.
    // - scene: If the R3F scene context changes (less common but good to include).
    // - transformObject: To allow re-evaluation if it was set to null externally.
    // We don't include selectedObjectInternalRef.current directly because its change
    // is a side effect of rendering, and including it can lead to loops or excessive runs.
    // The effect checks its current value when triggered by other dependencies.
  }, [selectedShapeId, shapes, scene, transformObject]);

  // Effect for handling GLB animations (ensure this doesn't interfere)
  useEffect(() => {
    const currentSelectedShape = shapes.find((s) => s.id === selectedShapeId);

    activeMixers.current.forEach((mixer, id) => {
      if (
        id !== selectedShapeId ||
        (currentSelectedShape && currentSelectedShape.type !== "importedGLB")
      ) {
        mixer.stopAllAction();
        activeMixers.current.delete(id);
        activeActions.current.forEach((_, key) => {
          if (key.startsWith(id)) activeActions.current.delete(key);
        });
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
        const animatedRoot = gltfData.scene;

        if (!mixer || mixer.getRoot() !== animatedRoot) {
          mixer = new THREE.AnimationMixer(animatedRoot);
          activeMixers.current.set(currentSelectedShape.id, mixer);
        }

        mixer.stopAllAction();
        activeActions.current.forEach((_, key) => {
          if (key.startsWith(currentSelectedShape.id))
            activeActions.current.delete(key);
        });

        const setupAction = (clip, clipIndex) => {
          const action = mixer.clipAction(clip, animatedRoot);
          action.setLoop(
            isAnimationLooping ? THREE.LoopRepeat : THREE.LoopOnce,
            Infinity
          );
          action.timeScale = animationPlaybackSpeed;

          // animationTime is normalized (0-1), convert to absolute for action.time
          const absoluteTime = animationTime * (clip.duration || 0);
          action.time = absoluteTime;

          if (animationPlaybackState === "playing") {
            action.play();
            action.paused = false;
          } else if (animationPlaybackState === "paused") {
            action.play();
            action.paused = true;
            if (absoluteTime === 0 && !action.isRunning()) mixer.setTime(0); // Use mixer.setTime to ensure frame 0
          } else {
            action.stop();
            if (absoluteTime === 0 && !action.isRunning()) mixer.setTime(0); // Reset to first frame
          }
          const actionKey = `${currentSelectedShape.id}_${
            playAllAnimations
              ? `all_${clipIndex}`
              : `clip_${selectedAnimationClipIndex}`
          }`;
          activeActions.current.set(actionKey, action);
        };

        if (playAllAnimations) {
          gltfData.animations.forEach(setupAction);
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
    // scene // Add scene as dependency for mixer context if needed, but usually not.
  ]);

  useFrame((state, delta) => {
    activeMixers.current.forEach((mixer, shapeId) => {
      if (shapeId === selectedShapeId && animationPlaybackState === "playing") {
        mixer.update(delta);
      }
      // If paused and scrubbing via animationTime, the useEffect above should handle mixer.setTime()
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
        <shadowMaterial opacity={0.25} color={0x000000} />
      </mesh>

      {Grid && typeof Grid !== "string" && (
        <Grid
          args={[100, 100]}
          position={[0, 0, 0]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor={new THREE.Color(0x444444)}
          sectionSize={2.5}
          sectionThickness={1}
          sectionColor={new THREE.Color(0x6f6f6f)}
          fadeDistance={50}
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
            animation={shapeData.animation}
            isAnimating={isAnimating && shapeData.type !== "importedGLB"}
            onClick={onShapeClick}
            objectRef={
              shapeData.id === selectedShapeId
                ? selectedObjectInternalRef // Pass the ref itself
                : null
            }
            isTransformDragging={
              shapeData.id === selectedShapeId && isTransformDragging
            }
            textureProps={shapeData.textureProps}
            textTextureProps={shapeData.textTextureProps}
            transmission={shapeData.transmission}
            ior={shapeData.ior}
            thickness={shapeData.thickness}
          />
        );
      })}

      {selectedShapeId &&
        transformObject && // CRITICAL: transformObject must be valid and in scene
        mode &&
        TransformControls &&
        typeof TransformControls !== "string" && (
          <TransformControls
            object={transformObject} // This is the prop that needs a valid scene object
            mode={mode}
            onObjectChange={() => {
              if (selectedShapeId && transformObject)
                // Check transformObject again
                onShapeUpdate(selectedShapeId);
            }}
            onDraggingChanged={(event) => {
              const dragging = event.value;
              setIsTransformDragging(dragging);
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
          makeDefault
          enableDamping
          dampingFactor={0.05}
          minDistance={0.5}
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
  const controls = useThree((state) => state.controls); // Access controls from R3F state

  // Define camera presets with positions and lookAt targets
  const cameraPresets = useMemo(
    () => ({
      top: { position: [0, 15, 0.01], target: [0, 0, 0] }, // 0.01 to avoid gimbal lock if looking straight down
      front: { position: [0, 2, 15], target: [0, 1, 0] }, // Slightly elevated target for better view
      side: { position: [15, 2, 0], target: [0, 1, 0] },
      isometric: { position: [10, 10, 10], target: [0, 0, 0] }, // Classic isometric
    }),
    []
  );

  useEffect(() => {
    if (preset && cameraPresets[preset] && camera) {
      const { position, target } = cameraPresets[preset];
      camera.position.set(...position);

      if (controls && controls.target) {
        // If OrbitControls are active, set their target
        controls.target.set(...target);
        controls.update(); // Required after changing target
      } else {
        // Fallback if controls are not available (shouldn't happen if makeDefault)
        camera.lookAt(new THREE.Vector3(...target));
      }
      camera.updateProjectionMatrix(); // Always update projection matrix after camera changes
    }
  }, [preset, camera, controls, cameraPresets]);

  return null; // This component doesn't render anything itself
}
