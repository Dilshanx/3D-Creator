import React, { Suspense, useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";
// Import JSM modules directly
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
// TextureLoader is often available on THREE namespace, but direct import is safer:
import { TextureLoader } from "three/src/loaders/TextureLoader.js";

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
    const textureLoaderInstance = new THREE.TextureLoader(); // Local instance for this function

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
          material = new THREE.MeshPhysicalMaterial(pbrProps);
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
          urls[key] = textureProps[key];
        }
      }
    }
    return urls;
  }, [textureProps]);
  const textures = useTexture ? useTexture(validTextureUrls) : {};

  const materialProps = useMemo(() => {
    const hasMapTexture = textures && textures.mapUrl;
    const matColor = hasMapTexture ? 0xffffff : color || "#ffffff";

    const baseProps = {
      color: new THREE.Color(matColor),
      side: THREE.DoubleSide,
    };

    if (textures?.mapUrl) baseProps.map = textures.mapUrl;
    if (textures?.normalMapUrl) baseProps.normalMap = textures.normalMapUrl;

    if (materialType === "standard" || materialType === "physical") {
      baseProps.roughness = saneNumber(roughness, 0.5);
      baseProps.metalness = saneNumber(metalness, 0.0);
      if (textures?.roughnessMapUrl)
        baseProps.roughnessMap = textures.roughnessMapUrl;
      if (textures?.metalnessMapUrl)
        baseProps.metalnessMap = textures.metalnessMapUrl;
      if (textures?.aoMapUrl) {
        baseProps.aoMap = textures.aoMapUrl;
        baseProps.aoMapIntensity =
          textureProps.aoMapIntensity !== undefined
            ? saneNumber(textureProps.aoMapIntensity, 1.0)
            : 1.0;
      }
      if (textures?.emissiveMapUrl) {
        baseProps.emissiveMap = textures.emissiveMapUrl;
        baseProps.emissive = new THREE.Color(0xffffff);
        baseProps.emissiveIntensity =
          textureProps.emissiveIntensity !== undefined
            ? saneNumber(textureProps.emissiveIntensity, 1.0)
            : 1.0;
      } else if (textureProps.emissiveColor) {
        // Allow setting emissive color even without a map
        baseProps.emissive = new THREE.Color(textureProps.emissiveColor);
        baseProps.emissiveIntensity =
          textureProps.emissiveIntensity !== undefined
            ? saneNumber(textureProps.emissiveIntensity, 1.0)
            : 1.0;
      }
    }

    if (materialType === "physical") {
      baseProps.transmission = saneNumber(textureProps.transmission, 0.0);
      baseProps.ior = saneNumber(textureProps.ior, 1.5);
      baseProps.thickness = saneNumber(textureProps.thickness, 0.01);
    }

    if (baseProps.map) baseProps.map.colorSpace = THREE.SRGBColorSpace;
    if (baseProps.emissiveMap)
      baseProps.emissiveMap.colorSpace = THREE.SRGBColorSpace;

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
          map={materialProps.map}
          side={THREE.DoubleSide}
        />
      );
    case "basic":
      return (
        <meshBasicMaterial
          color={materialProps.color}
          map={materialProps.map}
          wireframe={false}
          side={THREE.DoubleSide}
        />
      );
    case "lambert":
      return (
        <meshLambertMaterial
          color={materialProps.color}
          map={materialProps.map}
          side={THREE.DoubleSide}
        />
      );
    case "phong":
      return (
        <meshPhongMaterial
          color={materialProps.color}
          map={materialProps.map}
          shininess={30}
          side={THREE.DoubleSide}
        />
      );
    case "wireframe":
      return (
        <meshBasicMaterial
          color={materialProps.color}
          wireframe
          side={THREE.DoubleSide}
        />
      );
    default:
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
  textureProps,
  textTextureProps,
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
      type !== "importedGLB" &&
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
      ? useTexture(imageDataUrl)
      : null;
  useEffect(() => {
    if (imagePlaneDisplayTexture && type === "imagePlane") {
      imagePlaneDisplayTexture.colorSpace = THREE.SRGBColorSpace;
      imagePlaneDisplayTexture.needsUpdate = true;
    }
  }, [imagePlaneDisplayTexture, type]);
  const objectName = `shape_${id}_${type}_${
    name ||
    shapeType ||
    (type === "text" ? text?.substring(0, 10) || "Text" : "")
  }`;
  const currentTextureProps = type === "text" ? textTextureProps : textureProps;

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
          height={saneNumber(extrudeDepth, 0.1)}
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
            roughness={roughness}
            metalness={metalness}
            textureProps={currentTextureProps}
          />
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
          return <boxGeometry args={[0.1, 0.1, 0.1]} />;
      }
    }, [type, shapeType, shapeSize, extrudeDepth]);
    if (!useTexture)
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
          <meshStandardMaterial
            color={color}
            roughness={roughness}
            metalness={metalness}
          />
        </mesh>
      );
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
            roughness={roughness}
            metalness={metalness}
            textureProps={currentTextureProps}
          />
        </Suspense>
      </mesh>
    );
  }
}

function SceneLighting() {
  const lightRef = useRef();
  const hdrPath = "/brown_photostudio_02_4k.hdr";
  return (
    <>
      <Suspense fallback={null}>
        {Environment && typeof Environment !== "string" && hdrPath ? (
          <Environment files={hdrPath} background={false} blur={0.5} />
        ) : (
          <directionalLight intensity={0.5} position={[5, 5, 5]} />
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
  loadedGltfObjects,
  selectedAnimationClipIndex,
  animationPlaybackState,
  isAnimationLooping,
  animationPlaybackSpeed,
  animationTime,
  playAllAnimations,
}) {
  const { scene, gl, camera } = useThree();
  const [transformObject, setTransformObject] = useState(null);
  const selectedObjectInternalRef = useRef(null);
  const [isTransformDragging, setIsTransformDragging] = useState(false);
  const activeMixers = useRef(new Map());
  const activeActions = useRef(new Map());
  useEffect(() => {
    if (sceneRef) sceneRef.current = scene;
  }, [scene, sceneRef]);
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
          const startTime = animationTime * (clip.duration || 0);
          action.time = startTime;
          if (animationPlaybackState === "playing") {
            action.play();
            action.paused = false;
          } else if (animationPlaybackState === "paused") {
            action.play();
            action.paused = true;
            if (startTime === 0) mixer.update(0);
          } else {
            action.stop();
            if (startTime === 0) mixer.update(0);
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
  ]);
  useFrame((state, delta) => {
    activeMixers.current.forEach((mixer, shapeId) => {
      if (shapeId === selectedShapeId && animationPlaybackState === "playing") {
        mixer.update(delta);
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
        <shadowMaterial opacity={0.25} color={0x000000} />
      </mesh>
      {Grid && typeof Grid !== "string" && (
        <Grid
          args={[100, 100]}
          position={[0, 0, 0]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor={new THREE.Color(0x444444)} // Updated
          sectionSize={2.5}
          sectionThickness={1}
          sectionColor={new THREE.Color(0x6f6f6f)} // Updated
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
            textureProps={shapeData.textureProps}
            textTextureProps={shapeData.textTextureProps}
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
