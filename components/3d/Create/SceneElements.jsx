import React, {
  Suspense,
  useMemo,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { TextureLoader as ThreeTextureLoader } from "three";

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
} from "../../LetterShape/PopularShapes"; // Adjust path as needed

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
  useFrame = () => {};
  useLoader = (loader, path) => {
    console.warn(`useLoader called for ${path} but R3F not available.`);
    if (loader === ThreeTextureLoader && typeof path === "string") {
      const texture = new THREE.Texture();
      const img = new Image();
      img.onload = () => {
        texture.image = img;
        texture.needsUpdate = true;
      };
      img.onerror = () =>
        console.error(`Fallback TextureLoader failed for ${path}`);
      img.src = path;
      return texture;
    }
    return null;
  };
  useThree = () => ({
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(),
    gl: { domElement: null },
    controls: null,
    get: () => ({}),
  });
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
  OrbitControls = ({ children }) => <>{children}</>;
  TransformControls = () => null;
  Grid = () => null;
  Environment = () => null;
  Text3D = ({ children }) => (
    <mesh>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshBasicMaterial color='purple' wireframe />
      {children}
    </mesh>
  );
  useTexture = () => ({});
}

const FONT_PATH_R3F = "/fonts/helvetiker_regular.typeface.json";
let helvetikerFontForR3F_Export = null;
const r3fFontLoaderForExport = new FontLoader();
const globalTextureLoader = new ThreeTextureLoader(); // Re-usable instance

if (
  typeof window !== "undefined" &&
  !helvetikerFontForR3F_Export &&
  FontLoader
) {
  r3fFontLoaderForExport.load(
    FONT_PATH_R3F,
    (font) => {
      helvetikerFontForR3F_Export = font;
    },
    undefined,
    (err) =>
      console.error(
        "SceneElements: Failed to load Helvetiker for createMeshFromShape (EXPORT):",
        err
      )
  );
}

export function exportToGLB(scene, filename = "model.glb", toastHandler) {
  if (!THREE || !GLTFExporter) {
    const msg = "THREE.js or GLTFExporter is not available for GLB export.";
    console.error(msg);
    if (toastHandler && toastHandler.error)
      toastHandler.error("GLB Export Failed", { description: msg });
    else alert(msg);
    return;
  }
  const exporter = new GLTFExporter();
  const options = {
    binary: true,
    onlyVisible: false,
    truncateDrawRange: true,
    embedImages: true,
    animations: scene.animations || [],
  };
  try {
    exporter.parse(
      scene,
      (result) => {
        if (!(result instanceof ArrayBuffer)) {
          const errMsg = "GLB Export failed: Invalid export result.";
          console.error(
            "GLTFExporter.parse() result is not an ArrayBuffer:",
            result
          );
          if (toastHandler && toastHandler.error)
            toastHandler.error("GLB Export Failed", { description: errMsg });
          else alert(errMsg);
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
        const successMsg = `GLB file exported successfully as ${filename}!`;
        if (toastHandler && toastHandler.success)
          toastHandler.success("GLB Exported", { description: successMsg });
        else alert(successMsg);
      },
      (error) => {
        const errMsg =
          "GLB Export failed during parsing: " +
          (error?.message || String(error));
        console.error("GLB Export parse failed:", error);
        if (toastHandler && toastHandler.error)
          toastHandler.error("GLB Export Failed", { description: errMsg });
        else alert(errMsg);
      },
      options
    );
  } catch (error) {
    const errMsg =
      "GLB Export setup failed: " + (error?.message || String(error));
    console.error("GLB Export setup failed:", error);
    if (toastHandler && toastHandler.error)
      toastHandler.error("GLB Export Failed", { description: errMsg });
    else alert(errMsg);
  }
}

const saneNumber = (value, defaultValue = 0) => {
  const num = Number(value);
  return isNaN(num) || !isFinite(num) ? defaultValue : num;
};

export const createMeshFromShape = async (shapeData) => {
  if (!THREE) {
    console.error("THREE.js is not available for createMeshFromShape.");
    return null;
  }
  if (!FontLoader || !TextGeometry || !ThreeTextureLoader) {
    console.error("Required THREE add-ons not loaded for createMeshFromShape.");
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
        geometry = new THREE.SphereGeometry(0.5, 32, 16);
        break;
      case "cylinder":
        geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
        break;
      case "cone":
        geometry = new THREE.ConeGeometry(0.5, 1, 32);
        break;
      case "torus":
        geometry = new THREE.TorusGeometry(0.4, 0.1, 16, 100);
        break;
      case "pyramid":
        const pG = new THREE.ConeGeometry(0.7071, 1, 4);
        pG.translate(0, 0.5, 0);
        geometry = pG;
        break;
      case "text":
        let fontToUse = helvetikerFontForR3F_Export;
        if (!fontToUse && typeof window !== "undefined") {
          try {
            fontToUse = await new Promise((resolve, reject) =>
              r3fFontLoaderForExport.load(
                FONT_PATH_R3F,
                resolve,
                undefined,
                reject
              )
            );
            if (!helvetikerFontForR3F_Export)
              helvetikerFontForR3F_Export = fontToUse;
          } catch (e) {
            console.error(
              "Export Font load failed in createMeshFromShape (text):",
              e
            );
            geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
            break;
          }
        } else if (!fontToUse) {
          geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
          break;
        }
        geometry = new TextGeometry(shapeData.text || "3D", {
          font: fontToUse,
          size: textSizeForGeometry,
          height: textHeightForGeometry,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: saneNumber(textSizeForGeometry * 0.04, 0.015),
          bevelSize: saneNumber(textSizeForGeometry * 0.04, 0.015),
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
        if (!(twoDShape instanceof THREE.Shape))
          twoDShape = new THREE.Shape()
            .moveTo(-0.5, -0.5)
            .lineTo(0.5, -0.5)
            .lineTo(0.5, 0.5)
            .lineTo(-0.5, 0.5)
            .closePath();
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
        return null;
      default:
        geometry = new THREE.BoxGeometry(1, 1, 1);
    }
    let material;
    // const textureLoaderForExport = new ThreeTextureLoader(); // Use globalTextureLoader
    const loadTexAsync = (url) =>
      new Promise((resolve) => {
        if (!url) {
          resolve(null);
          return;
        }
        globalTextureLoader.load(
          // Use global instance
          url,
          (tex) => {
            tex.flipY = false; // Consistent with useTexture and GLTF
            tex.colorSpace = THREE.SRGBColorSpace;
            resolve(tex);
          },
          undefined,
          () => resolve(null)
        );
      });

    if (shapeTypeProp === "imagePlane") {
      material = new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        transparent: true,
      });
      if (shapeData.imageDataUrl) {
        const texture = await loadTexAsync(shapeData.imageDataUrl);
        if (texture) material.map = texture;
        else material.color.set(0xcc0000);
      } else material.color.set(0xcccccc);
    } else {
      const pbrProps = {
        color: new THREE.Color(shapeData.color || "#fff"),
        roughness: saneNumber(shapeData.roughness, 0.5),
        metalness: saneNumber(shapeData.metalness, 0.0),
      };
      material = new THREE.MeshStandardMaterial(pbrProps);
      const texSource =
        shapeTypeProp === "text"
          ? shapeData.textTextureProps
          : shapeData.textureProps;
      if (texSource) {
        if (texSource.mapUrl) {
          material.map = await loadTexAsync(texSource.mapUrl);
          if (material.map) material.color.set(0xffffff);
        }
        if (texSource.normalMapUrl)
          material.normalMap = await loadTexAsync(texSource.normalMapUrl);
        if (texSource.roughnessMapUrl)
          material.roughnessMap = await loadTexAsync(texSource.roughnessMapUrl);
        if (texSource.metalnessMapUrl)
          material.metalnessMap = await loadTexAsync(texSource.metalnessMapUrl);
        if (texSource.aoMapUrl) {
          material.aoMap = await loadTexAsync(texSource.aoMapUrl);
          if (material.aoMap) material.aoMapIntensity = 1.0;
          if (
            geometry &&
            geometry.attributes.uv &&
            !geometry.attributes.uv2 &&
            material.aoMap // Check if aoMap was successfully loaded
          )
            geometry.setAttribute(
              "uv2",
              new THREE.BufferAttribute(geometry.attributes.uv.array, 2)
            );
        }
        if (texSource.emissiveMapUrl) {
          material.emissiveMap = await loadTexAsync(texSource.emissiveMapUrl);
          if (material.emissiveMap) {
            material.emissive = new THREE.Color(0xffffff);
            material.emissiveIntensity = 1.0; // Ensure intensity is set if map is present
          }
        }
      }
    }
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = `shape_export_${shapeData.id}_${shapeTypeProp}`;
    mesh.castShadow = shapeTypeProp !== "imagePlane";
    mesh.receiveShadow = true;
    return mesh;
  } catch (error) {
    console.error("Error in createMeshFromShape (export):", shapeData, error);
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
  if (!useTexture)
    return (
      <meshStandardMaterial
        color={color || "#ffffff"}
        roughness={saneNumber(roughness, 0.5)}
        metalness={saneNumber(metalness, 0.0)}
      />
    );
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
          urls[key.substring(0, key.length - 3)] = textureProps[key];
        }
      }
    }
    return urls;
  }, [textureProps]);

  // useTexture's onLoad callback for setting flipY
  const loadedTextures = useTexture(validTextureUrls, (texturesInput) => {
    const texturesArray = Array.isArray(texturesInput)
      ? texturesInput
      : [texturesInput];
    texturesArray.forEach((textures) => {
      if (textures && typeof textures === "object") {
        // Can be a single texture or an object of textures
        Object.values(textures).forEach((tex) => {
          if (tex && tex.isTexture) {
            tex.flipY = false;
          }
        });
      } else if (textures && textures.isTexture) {
        // Single texture case
        textures.flipY = false;
      }
    });
  });

  const materialProps = useMemo(() => {
    const props = {
      color: new THREE.Color(
        (loadedTextures.map ? 0xffffff : color) || "#ffffff"
      ),
      roughness: saneNumber(roughness, 0.5),
      metalness: saneNumber(metalness, 0.0),
      side: THREE.DoubleSide, // Usually good for general purpose, adjust if needed
    };
    if (loadedTextures.map) {
      props.map = loadedTextures.map;
      props.map.colorSpace = THREE.SRGBColorSpace;
    }
    if (loadedTextures.normalMap) props.normalMap = loadedTextures.normalMap;
    if (loadedTextures.roughnessMap)
      props.roughnessMap = loadedTextures.roughnessMap;
    if (loadedTextures.metalnessMap)
      props.metalnessMap = loadedTextures.metalnessMap;
    if (loadedTextures.aoMap) {
      props.aoMap = loadedTextures.aoMap;
      props.aoMapIntensity = 1.0;
      // UV2 for aoMap is typically handled by the geometry itself when aoMap is applied.
      // If Text3D or other geometries need explicit UV2 for aoMap, it's more complex.
      // For <mesh> with custom geometry, ensure geometry has 'uv2' attribute.
    }
    if (loadedTextures.emissiveMap) {
      props.emissiveMap = loadedTextures.emissiveMap;
      props.emissiveMap.colorSpace = THREE.SRGBColorSpace;
      props.emissive = new THREE.Color(0xffffff);
      props.emissiveIntensity = 1.0;
    }
    return props;
  }, [color, roughness, metalness, loadedTextures]);

  switch (materialType) {
    case "standard":
      return <meshStandardMaterial {...materialProps} />;
    case "physical":
      return (
        <meshPhysicalMaterial
          {...materialProps}
          transmission={0}
          ior={1.5}
          thickness={0.1}
        />
      );
    case "toon":
      return (
        <meshToonMaterial color={materialProps.color} map={materialProps.map} />
      );
    case "basic":
      return (
        <meshBasicMaterial
          color={materialProps.color}
          map={materialProps.map}
          wireframe={false}
        />
      );
    case "lambert":
      return (
        <meshLambertMaterial
          color={materialProps.color}
          map={materialProps.map}
        />
      );
    case "phong":
      return (
        <meshPhongMaterial
          color={materialProps.color}
          map={materialProps.map}
          shininess={30}
        />
      );
    case "wireframe":
      return (
        <meshBasicMaterial color={materialProps.color || "#ffffff"} wireframe />
      );
    default:
      return <meshStandardMaterial {...materialProps} />;
  }
}

function PyramidGeometryR3F(props) {
  const geometry = useMemo(() => {
    if (!THREE) return null;
    const geom = new THREE.ConeGeometry(0.7071, 1, 4);
    geom.translate(0, 0.5, 0);
    return geom;
  }, []);
  if (!geometry)
    return (
      <primitive
        object={new THREE.BoxGeometry(0.1, 0.1, 0.1)}
        attach='geometry'
        {...props}
      />
    );
  return <primitive object={geometry} attach='geometry' {...props} />;
}

function ExtrudedCustomShapeGeometry({
  shapeType,
  shapeSize = 1,
  extrudeDepth = 0.2,
  ...props
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
        twoDShape = new THREE.Shape()
          .moveTo(-s / 2, -s / 2)
          .lineTo(s / 2, -s / 2)
          .lineTo(s / 2, s / 2)
          .lineTo(-s / 2, s / 2)
          .closePath();
    }
    if (!(twoDShape instanceof THREE.Shape))
      twoDShape = new THREE.Shape()
        .moveTo(-0.5, -0.5)
        .lineTo(0.5, -0.5)
        .lineTo(0.5, 0.5)
        .lineTo(-0.5, 0.5)
        .closePath();
    const extrudeSettings = {
      depth: extrudeDepth,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: extrudeDepth * 0.05,
      bevelThickness: extrudeDepth * 0.05,
    };
    try {
      const geom = new THREE.ExtrudeGeometry(twoDShape, extrudeSettings);
      geom.center();
      // For aoMap to work with ExtrudeGeometry, it needs uv2.
      // Create uv2 from uv if it doesn't exist.
      if (geom.attributes.uv && !geom.attributes.uv2) {
        geom.setAttribute(
          "uv2",
          new THREE.BufferAttribute(geom.attributes.uv.array, 2)
        );
      }
      return geom;
    } catch (e) {
      console.error("Error creating R3F extruded geometry:", e);
      return new THREE.BoxGeometry(s, s, extrudeDepth);
    }
  }, [shapeType, shapeSize, extrudeDepth]);

  if (!geometry)
    return (
      <primitive
        object={new THREE.BoxGeometry(0.1, 0.1, 0.1)}
        attach='geometry'
        {...props}
      />
    );
  return <primitive object={geometry} attach='geometry' {...props} />;
}

function ImagePlaneWithTexture({
  localMeshRefPassed,
  imageDataUrl,
  planeWidth,
  planeHeight,
  objectNameConstructed,
  onClick,
}) {
  if (!useLoader || !ThreeTextureLoader) {
    return (
      <mesh
        ref={localMeshRefPassed}
        name={`${objectNameConstructed}_fallback_no_loader`}
      >
        <planeGeometry args={[planeWidth || 1, planeHeight || 1]} />
        <meshBasicMaterial color={0xff0000} wireframe />
      </mesh>
    );
  }
  const texture = useLoader(ThreeTextureLoader, imageDataUrl);
  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.flipY = false; // Consistent with other texture loading
    }
  }, [texture]);

  return (
    <mesh
      ref={localMeshRefPassed}
      name={objectNameConstructed}
      castShadow={false}
      receiveShadow
      onClick={onClick}
      onPointerOver={(e) => e.stopPropagation()}
      onPointerOut={(e) => e.stopPropagation()}
    >
      <planeGeometry args={[planeWidth || 1, planeHeight || 1]} />
      <meshStandardMaterial
        map={texture}
        side={THREE.DoubleSide}
        transparent={true}
      />
    </mesh>
  );
}

function Shape({
  id,
  position, // Array [x, y, z]
  rotation, // Array [x, y, z] Euler angles
  scale, // Array [x, y, z]
  type,
  material: materialType, // Renamed from 'material' to avoid conflict with JSX material prop
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
  isTransformDragging, // This prop is crucial
  gltfModelScene,
  imageDataUrl,
  planeWidth,
  planeHeight,
  textureProps,
  textTextureProps,
  onObjectReady,
}) {
  const localMeshRef = useRef(null);
  const orbitAngleRef = useRef(Math.random() * Math.PI * 2);

  // Refs for live transform values, updated from props via useEffect
  const livePosition = useRef(new THREE.Vector3().fromArray(position));
  const liveRotationEuler = useRef(new THREE.Euler().fromArray(rotation));
  const liveScale = useRef(new THREE.Vector3().fromArray(scale));

  // For slerping rotation
  const currentQuaternion = useMemo(() => new THREE.Quaternion(), []);
  const targetQuaternion = useMemo(() => new THREE.Quaternion(), []);

  const [internalProcessedScene, setInternalProcessedScene] = useState(null);
  const [sceneVersion, setSceneVersion] = useState(0);

  useEffect(() => {
    livePosition.current.fromArray(position);
  }, [position]);

  useEffect(() => {
    liveRotationEuler.current.fromArray(rotation);
  }, [rotation]);

  useEffect(() => {
    liveScale.current.fromArray(scale);
  }, [scale]);

  useEffect(() => {
    const currentMesh = localMeshRef.current;
    if (objectRef) {
      objectRef.current = currentMesh;
      if (currentMesh && onObjectReady) {
        // Give R3F a cycle or two to fully integrate the object
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (localMeshRef.current && localMeshRef.current.parent) {
              // Check if in scene graph
              onObjectReady(id, localMeshRef.current);
            } else if (!localMeshRef.current) {
              onObjectReady(id, null); // Object might have been unmounted
            }
          });
        });
      } else if (!currentMesh && onObjectReady) {
        onObjectReady(id, null);
      }
    }
    return () => {
      if (objectRef && objectRef.current === currentMesh) {
        objectRef.current = null;
        if (onObjectReady) onObjectReady(id, null);
      }
    };
  }, [objectRef, id, onObjectReady]); // localMeshRef.current changes trigger this

  useEffect(() => {
    if (type === "importedGLB" && gltfModelScene) {
      const freshClone = gltfModelScene.clone(true);
      setInternalProcessedScene(freshClone);
      setSceneVersion((v) => v + 1); // Trigger re-render of primitive
    } else if (type === "importedGLB") {
      setInternalProcessedScene(null);
    }
  }, [gltfModelScene, type]);

  useEffect(() => {
    if (!internalProcessedScene || type !== "importedGLB") return;

    const textureLoadPromises = [];

    internalProcessedScene.traverse((node) => {
      if (node.isMesh) {
        const originalMaterials = Array.isArray(node.material)
          ? node.material
          : [node.material];
        const newAppliedMaterials = [];

        for (const originalMat of originalMaterials) {
          if (!originalMat) continue; // Skip if material is undefined

          const overrideMaterialType = materialType || "standard"; // Use prop 'materialType'
          let newMatInstance;

          switch (overrideMaterialType) {
            case "physical":
              newMatInstance = new THREE.MeshPhysicalMaterial();
              break;
            case "toon":
              newMatInstance = new THREE.MeshToonMaterial();
              break;
            case "basic":
              newMatInstance = new THREE.MeshBasicMaterial();
              break;
            case "lambert":
              newMatInstance = new THREE.MeshLambertMaterial();
              break;
            case "phong":
              newMatInstance = new THREE.MeshPhongMaterial({ shininess: 30 });
              break;
            case "wireframe":
              newMatInstance = new THREE.MeshBasicMaterial({ wireframe: true });
              break;
            case "standard":
            default:
              newMatInstance = new THREE.MeshStandardMaterial();
              break;
          }
          newMatInstance.name = (originalMat.name || "gltf_mat") + "_override";

          if (
            newMatInstance.isMeshStandardMaterial ||
            newMatInstance.isMeshPhysicalMaterial
          ) {
            newMatInstance.roughness = saneNumber(roughness, 0.5);
            newMatInstance.metalness = saneNumber(metalness, 0.0);
          }

          if (textureProps?.mapUrl && overrideMaterialType !== "wireframe") {
            newMatInstance.color.set(0xffffff);
          } else if (color && overrideMaterialType !== "wireframe") {
            newMatInstance.color.set(color);
          } else if (
            originalMat.color &&
            overrideMaterialType !== "wireframe"
          ) {
            newMatInstance.color.copy(originalMat.color);
          } else if (overrideMaterialType !== "wireframe") {
            newMatInstance.color.set(0xcccccc);
          } else {
            // wireframe
            newMatInstance.color.set(
              color ||
                (originalMat.color?.getHexString
                  ? `#${originalMat.color.getHexString()}`
                  : null) ||
                0xcccccc
            );
          }

          const loadAndApply = (url, mapTypeStr) => {
            if (url && typeof newMatInstance[mapTypeStr] !== "undefined") {
              textureLoadPromises.push(
                new Promise((resolveLoad) => {
                  globalTextureLoader.load(
                    url,
                    (tex) => {
                      tex.flipY = false;
                      if (
                        mapTypeStr === "map" ||
                        mapTypeStr === "emissiveMap"
                      ) {
                        tex.colorSpace = THREE.SRGBColorSpace;
                      }
                      newMatInstance[mapTypeStr] = tex;
                      newMatInstance.needsUpdate = true;
                      resolveLoad();
                    },
                    undefined,
                    () => {
                      console.warn(
                        `Failed to load ${mapTypeStr} texture: ${url}`
                      );
                      resolveLoad();
                    }
                  );
                })
              );
            } else if (
              originalMat[mapTypeStr] &&
              typeof newMatInstance[mapTypeStr] !== "undefined" &&
              mapTypeStr !== "map"
            ) {
              // Only copy non-map original textures if no override URL is provided for that specific map type
              if (!textureProps?.[`${mapTypeStr}Url`]) {
                newMatInstance[mapTypeStr] = originalMat[mapTypeStr];
              }
            }
          };

          if (overrideMaterialType !== "wireframe") {
            loadAndApply(textureProps?.mapUrl, "map");
            loadAndApply(textureProps?.normalMapUrl, "normalMap");
            if (
              newMatInstance.isMeshStandardMaterial ||
              newMatInstance.isMeshPhysicalMaterial
            ) {
              loadAndApply(textureProps?.roughnessMapUrl, "roughnessMap");
              loadAndApply(textureProps?.metalnessMapUrl, "metalnessMap");
            }

            if (
              textureProps?.aoMapUrl &&
              typeof newMatInstance.aoMap !== "undefined"
            ) {
              textureLoadPromises.push(
                new Promise((resolveLoad) => {
                  globalTextureLoader.load(
                    textureProps.aoMapUrl,
                    (tex) => {
                      tex.flipY = false;
                      newMatInstance.aoMap = tex;
                      if (newMatInstance.aoMap)
                        newMatInstance.aoMapIntensity = 1.0;
                      if (
                        node.geometry &&
                        node.geometry.attributes.uv &&
                        !node.geometry.attributes.uv2 &&
                        newMatInstance.aoMap
                      ) {
                        node.geometry.setAttribute(
                          "uv2",
                          new THREE.BufferAttribute(
                            node.geometry.attributes.uv.array,
                            2
                          )
                        );
                      }
                      newMatInstance.needsUpdate = true;
                      resolveLoad();
                    },
                    undefined,
                    () => {
                      console.warn(
                        `AO map load failed for URL: ${textureProps.aoMapUrl}`
                      );
                      resolveLoad();
                    }
                  );
                })
              );
            } else if (
              originalMat.aoMap &&
              typeof newMatInstance.aoMap !== "undefined" &&
              !textureProps?.aoMapUrl
            ) {
              newMatInstance.aoMap = originalMat.aoMap;
              newMatInstance.aoMapIntensity =
                originalMat.aoMapIntensity !== undefined
                  ? originalMat.aoMapIntensity
                  : 1.0;
              if (
                node.geometry &&
                node.geometry.attributes.uv &&
                !node.geometry.attributes.uv2 &&
                newMatInstance.aoMap
              ) {
                node.geometry.setAttribute(
                  "uv2",
                  new THREE.BufferAttribute(
                    node.geometry.attributes.uv.array,
                    2
                  )
                );
              }
            }

            if (
              textureProps?.emissiveMapUrl &&
              typeof newMatInstance.emissiveMap !== "undefined"
            ) {
              loadAndApply(textureProps?.emissiveMapUrl, "emissiveMap");
              if (newMatInstance.emissiveMap) {
                // Check if actually loaded
                newMatInstance.emissive = new THREE.Color(0xffffff);
                newMatInstance.emissiveIntensity = 1.0;
              }
            } else if (
              originalMat.emissiveMap &&
              typeof newMatInstance.emissiveMap !== "undefined" &&
              !textureProps?.emissiveMapUrl
            ) {
              newMatInstance.emissiveMap = originalMat.emissiveMap;
              newMatInstance.emissive = originalMat.emissive
                ? originalMat.emissive.clone()
                : new THREE.Color(0x000000);
              newMatInstance.emissiveIntensity =
                originalMat.emissiveIntensity !== undefined
                  ? originalMat.emissiveIntensity
                  : 1.0;
            }
          }

          newMatInstance.side =
            originalMat.side !== undefined ? originalMat.side : THREE.FrontSide;
          const originalIsTransparent =
            originalMat.transparent !== undefined
              ? originalMat.transparent
              : originalMat.opacity !== undefined && originalMat.opacity < 1.0;
          newMatInstance.transparent = originalIsTransparent;
          if (originalIsTransparent && originalMat.opacity !== undefined) {
            newMatInstance.opacity = originalMat.opacity;
          }
          newMatInstance.alphaTest = originalMat.alphaTest || 0.0;

          newAppliedMaterials.push(newMatInstance);
        }
        node.material =
          newAppliedMaterials.length === 1
            ? newAppliedMaterials[0]
            : newAppliedMaterials;
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

    if (textureLoadPromises.length > 0) {
      Promise.all(textureLoadPromises).then(() => {
        setSceneVersion((v) => v + 1);
      });
    } else {
      setSceneVersion((v) => v + 1); // Still trigger re-render if no async loads but material props changed
    }
  }, [
    internalProcessedScene,
    textureProps,
    color,
    roughness,
    metalness,
    materialType,
    type,
  ]);

  useFrame((state, delta) => {
    const mesh = localMeshRef.current;
    if (!mesh || !useFrame) return;

    // If TransformControls are dragging this object, they have direct control.
    // Props will update live* refs, and when dragging stops, lerping/animation resumes.
    if (isTransformDragging && type !== "importedGLB") {
      // GLB transform is handled by group, not this frame loop during drag
      // For non-GLB, TransformControls directly manipulates mesh.position/rotation/scale
      // We update live* refs from the mesh to keep them in sync for when dragging stops
      livePosition.current.copy(mesh.position);
      liveRotationEuler.current.copy(mesh.rotation);
      liveScale.current.copy(mesh.scale);
      return;
    }
    if (isTransformDragging && type === "importedGLB") {
      // For GLB, the group is transformed. We update its live* refs.
      // This might be redundant if props are the source of truth, but good for consistency.
      livePosition.current.copy(mesh.position); // mesh here is the group
      liveRotationEuler.current.copy(mesh.rotation);
      liveScale.current.copy(mesh.scale);
      return;
    }

    if (
      type !== "importedGLB" &&
      isAnimating &&
      !isTransformDragging && // Redundant due to above, but good for clarity
      animation &&
      animation.type !== "none"
    ) {
      const effectiveSpeed = (animation.speed || 1) * delta;
      switch (animation.type) {
        case "rotate":
          if (animation.axis === "x")
            liveRotationEuler.current.x += effectiveSpeed;
          else if (animation.axis === "y")
            liveRotationEuler.current.y += effectiveSpeed;
          else if (animation.axis === "z")
            liveRotationEuler.current.z += effectiveSpeed;
          mesh.rotation.copy(liveRotationEuler.current);
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
          const tempP = livePosition.current.clone(); // Use a temp Vector3
          if (plane === "xz")
            tempP.set(
              cX + Math.cos(orbitAngleRef.current) * radius,
              cY,
              cZ + Math.sin(orbitAngleRef.current) * radius
            );
          else if (plane === "xy")
            tempP.set(
              cX + Math.cos(orbitAngleRef.current) * radius,
              cY + Math.sin(orbitAngleRef.current) * radius,
              cZ
            );
          else if (plane === "yz")
            tempP.set(
              cX,
              cY + Math.cos(orbitAngleRef.current) * radius,
              cZ + Math.sin(orbitAngleRef.current) * radius
            );

          livePosition.current.copy(tempP); // Update live ref
          mesh.position.copy(livePosition.current); // Apply to mesh
          break;
      }
      // For animations, scale usually isn't part of 'rotate' or 'orbit' unless specified
      // If scale needs to animate, add logic here. Otherwise, it lerps/copies below.
      // mesh.scale.copy(liveScale.current); // Or lerp if smooth transition to animated scale is needed
    } else {
      // Not dragging, AND ( (not animatable OR not currently animating) OR is GLB )
      if (type !== "importedGLB") {
        mesh.position.lerp(livePosition.current, 0.15);
        currentQuaternion.copy(mesh.quaternion);
        targetQuaternion.setFromEuler(liveRotationEuler.current);
        mesh.quaternion.slerp(targetQuaternion, 0.15);
        mesh.scale.lerp(liveScale.current, 0.15);
      } else if (type === "importedGLB" && mesh) {
        // GLB (group) always copies from live* refs if not dragging
        mesh.position.copy(livePosition.current);
        mesh.rotation.copy(liveRotationEuler.current); // Assumes liveRotationEuler is correct from props
        mesh.scale.copy(liveScale.current);
      }
    }
  });

  useEffect(() => {
    if (animation?.type !== "orbit")
      orbitAngleRef.current = Math.random() * Math.PI * 2;
  }, [animation?.type]);

  const objectNameConstructed = `shape_${id}_${type}_${
    name ||
    shapeType ||
    (type === "text" ? text?.substring(0, 10) || "Text" : type)
  }`;
  const currentTexturePropsToUse =
    type === "text" ? textTextureProps : textureProps;

  const handleClick = useCallback(
    (e) => {
      try {
        e.stopPropagation();
        if (onClick) onClick(id, e);
      } catch (error) {
        console.warn("Error in shape click handler:", error);
      }
    },
    [id, onClick]
  );

  const handlePointerOver = useCallback((e) => e.stopPropagation(), []);
  const handlePointerOut = useCallback((e) => e.stopPropagation(), []);

  // Logic for Text3D aoMap (requires uv2 on TextGeometry)
  const textGeoRef = useRef();
  useEffect(() => {
    if (type === "text" && textGeoRef.current) {
      const geometry = textGeoRef.current.geometry;
      if (geometry && geometry.attributes.uv && !geometry.attributes.uv2) {
        if (
          currentTexturePropsToUse?.aoMapUrl ||
          (materialType === "standard" && currentTexturePropsToUse?.aoMapUrl)
        ) {
          // check if aoMap is actually used
          geometry.setAttribute(
            "uv2",
            new THREE.BufferAttribute(geometry.attributes.uv.array, 2)
          );
          geometry.attributes.uv2.needsUpdate = true;
        }
      }
    }
  }, [type, textGeoRef, currentTexturePropsToUse, materialType]);

  if (type === "text") {
    if (!Text3D || !useTexture || !FONT_PATH_R3F)
      return (
        <mesh
          ref={localMeshRef} // Fallback still needs ref for potential selection
          name={`${objectNameConstructed}_text_fallback`}
        >
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial color='red' wireframe />
        </mesh>
      );
    return (
      <Suspense
        fallback={
          <mesh
            ref={localMeshRef} // Fallback still needs ref
            name={`${objectNameConstructed}_loading_text`}
          >
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshBasicMaterial color='gray' wireframe />
          </mesh>
        }
      >
        <Text3D
          ref={(node) => {
            localMeshRef.current = node;
            textGeoRef.current = node; // For aoMap uv2
          }}
          font={FONT_PATH_R3F}
          size={saneNumber(textSize, 0.5)}
          height={saneNumber(extrudeDepth, 0.1)}
          curveSegments={12}
          bevelEnabled
          bevelThickness={saneNumber(textSize * 0.04, 0.015)}
          bevelSize={saneNumber(textSize * 0.04, 0.015)}
          bevelOffset={0}
          bevelSegments={3}
          name={objectNameConstructed}
          castShadow
          receiveShadow
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          {text || "Text"}
          <LoadedTexturesMaterial
            materialType={materialType}
            color={color}
            roughness={roughness}
            metalness={metalness}
            textureProps={currentTexturePropsToUse}
          />
        </Text3D>
      </Suspense>
    );
  } else if (type === "importedGLB") {
    const sceneToRender = internalProcessedScene;
    if (!sceneToRender) return null;
    return (
      <group
        ref={localMeshRef} // This ref points to the group
        name={objectNameConstructed}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <primitive object={sceneToRender} key={sceneVersion} />
      </group>
    );
  } else if (type === "imagePlane") {
    if (!imageDataUrl) {
      return (
        <mesh
          ref={localMeshRef}
          name={objectNameConstructed}
          castShadow={false}
          receiveShadow
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <planeGeometry args={[planeWidth || 1, planeHeight || 1]} />
          <meshBasicMaterial
            color={0xcccccc}
            wireframe
            side={THREE.DoubleSide}
          />
        </mesh>
      );
    }
    return (
      <Suspense
        fallback={
          <mesh
            ref={localMeshRef}
            name={`${objectNameConstructed}_loading_image`}
          >
            <planeGeometry args={[planeWidth || 1, planeHeight || 1]} />
            <meshBasicMaterial color='gray' wireframe side={THREE.DoubleSide} />
          </mesh>
        }
      >
        <ImagePlaneWithTexture
          localMeshRefPassed={localMeshRef}
          imageDataUrl={imageDataUrl}
          planeWidth={planeWidth}
          planeHeight={planeHeight}
          objectNameConstructed={objectNameConstructed}
          onClick={handleClick}
        />
      </Suspense>
    );
  } else {
    // Procedural geometries
    let proceduralGeometry;
    switch (type) {
      case "box":
        proceduralGeometry = <boxGeometry args={[1, 1, 1]} />;
        break;
      case "sphere":
        proceduralGeometry = <sphereGeometry args={[0.5, 32, 16]} />;
        break;
      case "cylinder":
        proceduralGeometry = <cylinderGeometry args={[0.5, 0.5, 1, 32]} />;
        break;
      case "cone":
        proceduralGeometry = <coneGeometry args={[0.5, 1, 32]} />;
        break;
      case "torus":
        proceduralGeometry = <torusGeometry args={[0.4, 0.1, 16, 100]} />;
        break;
      case "pyramid":
        proceduralGeometry = <PyramidGeometryR3F />;
        break;
      case "customExtruded":
        proceduralGeometry = (
          <ExtrudedCustomShapeGeometry
            shapeType={shapeType}
            shapeSize={shapeSize}
            extrudeDepth={extrudeDepth}
          />
        );
        break;
      default:
        proceduralGeometry = <boxGeometry args={[0.1, 0.1, 0.1]} />;
    }
    return (
      <mesh
        ref={localMeshRef}
        name={objectNameConstructed}
        castShadow
        receiveShadow
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {proceduralGeometry}
        {/* For procedural geometries, aoMap requires uv2 on the geometry itself.
            Box, Sphere, etc., have them by default. Custom ones need to ensure it. */}
        <Suspense fallback={<meshStandardMaterial color='gray' wireframe />}>
          <LoadedTexturesMaterial
            materialType={materialType}
            color={color}
            roughness={roughness}
            metalness={metalness}
            textureProps={currentTexturePropsToUse}
          />
        </Suspense>
      </mesh>
    );
  }
}
function SceneLighting() {
  const lightRef = useRef();
  const hdrPath = "/brown_photostudio_02_4k.hdr"; // Ensure this is in your public folder

  return (
    <>
      {Environment && typeof Environment !== "string" && hdrPath ? (
        <Suspense fallback={null}>
          <Environment files={hdrPath} background={false} blur={0.6} />
        </Suspense>
      ) : (
        <directionalLight intensity={1.5} position={[5, 5, 5]} />
      )}
      <ambientLight intensity={1.0} />
      <directionalLight
        ref={lightRef}
        position={[10, 15, 12]}
        intensity={2.0}
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
      <pointLight
        position={[-10, -10, -10]}
        color={0xffeedd}
        intensity={1.0}
        distance={80}
        decay={1.2}
      />
      <hemisphereLight
        skyColor={0xadd8e6}
        groundColor={0x808080}
        intensity={0.6}
      />
    </>
  );
}

export function MainScene({
  shapes,
  selectedShapeId,
  mode,
  onShapeClick,
  onShapeUpdate, // (shapeId, saveHistory)
  sceneRef,
  isAnimating,
  loadedGltfObjects,
  selectedAnimationClipIndex,
  animationPlaybackState,
  isAnimationLooping,
  animationPlaybackSpeed,
  animationTime,
  playAllAnimations,
  refreshKey,
  orbitControlsEnabled,
}) {
  const { scene: r3fScene, gl, camera } = useThree();
  const transformControlsRef = useRef(null);
  // selectedObjectInternalRef will be populated by the <Shape> component's objectRef prop
  const selectedObjectInternalRef = useRef(null);
  const [isTransformDragging, setIsTransformDragging] = useState(false);
  const [selectedObjectReady, setSelectedObjectReady] = useState(false); // Track when object is ready
  const activeMixers = useRef(new Map());

  useEffect(() => {
    if (sceneRef) sceneRef.current = r3fScene;
  }, [r3fScene, sceneRef]);

  // Helper function to check if object is properly in scene graph
  const isInSceneGraph = useCallback((object, scene) => {
    if (!object || !scene) return false;

    let current = object;
    while (current.parent) {
      current = current.parent;
      if (current === scene) return true;
    }
    return false;
  }, []);

  // More reliable approach - use useFrame to check and attach
  const [shouldShowControls, setShouldShowControls] = useState(false);

  useFrame(() => {
    const controls = transformControlsRef.current;
    const targetObject = selectedObjectInternalRef.current;

    if (!controls || !selectedShapeId || !targetObject) {
      setShouldShowControls(false);
      if (controls?.object) {
        try {
          controls.detach();
        } catch (e) {
          console.warn("Detach error in useFrame:", e);
        }
      }
      return;
    }

    // Check if object is properly in scene every frame
    const isValidInScene =
      targetObject.parent &&
      isInSceneGraph(targetObject, r3fScene) &&
      targetObject.isObject3D !== false;

    if (isValidInScene) {
      if (controls.object !== targetObject) {
        try {
          // Detach from previous object
          if (controls.object) {
            controls.detach();
          }

          // Attach to new object
          controls.attach(targetObject);
          controls.mode = mode;
          controls.space = mode === "scale" ? "local" : "world";
          setShouldShowControls(true);
        } catch (attachError) {
          console.warn("Failed to attach in useFrame:", attachError);
          setShouldShowControls(false);
        }
      } else {
        // Object already attached, just update mode
        controls.mode = mode;
        controls.space = mode === "scale" ? "local" : "world";
        setShouldShowControls(true);
      }
    } else {
      setShouldShowControls(false);
      if (controls.object) {
        try {
          controls.detach();
        } catch (e) {
          console.warn("Detach error for invalid object:", e);
        }
      }
    }
  });

  // Remove the complex effects that were causing timing issues
  // The useFrame approach above handles all the attachment logic

  // Animation mixer effect (keeping your existing logic but simplified)
  useEffect(() => {
    const currentSelectedShapeData = shapes.find(
      (s) => s.id === selectedShapeId
    );

    activeMixers.current.forEach((mixer, id) => {
      if (
        id !== selectedShapeId ||
        (currentSelectedShapeData &&
          currentSelectedShapeData.type !== "importedGLB")
      ) {
        mixer.stopAllAction();
        activeMixers.current.delete(id);
      }
    });

    if (
      currentSelectedShapeData?.type === "importedGLB" &&
      selectedObjectInternalRef.current
    ) {
      const gltfData = loadedGltfObjects[currentSelectedShapeData.id];
      const animatedRoot = selectedObjectInternalRef.current;

      if (animatedRoot && gltfData?.animations?.length > 0 && useFrame) {
        let mixer = activeMixers.current.get(currentSelectedShapeData.id);
        if (!mixer || mixer.getRoot() !== animatedRoot) {
          mixer = new THREE.AnimationMixer(animatedRoot);
          activeMixers.current.set(currentSelectedShapeData.id, mixer);
        }
        mixer.stopAllAction();

        const clipsToProcess = playAllAnimations
          ? gltfData.animations
          : selectedAnimationClipIndex >= 0 &&
            selectedAnimationClipIndex < gltfData.animations.length
          ? [gltfData.animations[selectedAnimationClipIndex]]
          : [];

        clipsToProcess.forEach((clip) => {
          if (!clip) return;
          const action = mixer.clipAction(clip);
          action.setLoop(
            isAnimationLooping ? THREE.LoopRepeat : THREE.LoopOnce,
            Infinity
          );
          action.clampWhenFinished = !isAnimationLooping;
          action.timeScale = animationPlaybackSpeed;
          const clipDuration = clip.duration || 0;
          action.time = animationTime * clipDuration;

          if (animationPlaybackState === "playing")
            action.play().paused = false;
          else if (animationPlaybackState === "paused") {
            if (clipDuration > 0) action.play().paused = true;
            else action.stop();
          } else action.stop();
        });

        if (animationPlaybackState === "stopped") mixer.setTime(0);
        else if (
          animationPlaybackState === "paused" &&
          clipsToProcess.length > 0 &&
          clipsToProcess[0]?.duration > 0
        ) {
          const targetTime = animationTime * (clipsToProcess[0].duration || 0);
          mixer.setTime(targetTime);
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
    refreshKey,
  ]);

  useFrame((state, delta) => {
    if (!useFrame) return;
    activeMixers.current.forEach((mixer, id) => {
      if (id === selectedShapeId && animationPlaybackState === "playing")
        mixer.update(delta);
    });
  });

  // Simplified object ready callback
  const handleObjectReady = useCallback(
    (shapeId, object) => {
      if (shapeId === selectedShapeId) {
        selectedObjectInternalRef.current = object;
      }
    },
    [selectedShapeId]
  );

  // Enhanced dragging change handler with better error handling
  const handleDraggingChanged = useCallback(
    (event) => {
      const dragging = event.value;
      setIsTransformDragging(dragging);

      try {
        // Handle orbit controls
        const orbitCtrl = r3fScene.__r3f?.controls;
        if (orbitCtrl) {
          orbitCtrl.enabled = !dragging && orbitControlsEnabled;
        }
      } catch (error) {
        console.warn("Error managing orbit controls:", error);
      }
    },
    [r3fScene, orbitControlsEnabled]
  );

  // Enhanced object change handler
  const handleObjectChange = useCallback(() => {
    try {
      if (selectedShapeId && transformControlsRef.current?.object) {
        onShapeUpdate(selectedShapeId, false);
      }
    } catch (error) {
      console.warn("Error in object change handler:", error);
    }
  }, [selectedShapeId, onShapeUpdate]);

  // Enhanced mouse up handler
  const handleMouseUp = useCallback(() => {
    try {
      if (selectedShapeId && isTransformDragging) {
        onShapeUpdate(selectedShapeId, true);
      }
    } catch (error) {
      console.warn("Error in mouse up handler:", error);
    }
  }, [selectedShapeId, isTransformDragging, onShapeUpdate]);

  return (
    <>
      <SceneLighting />
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
        name='ground_plane_mainscene'
      >
        <planeGeometry args={[100, 100]} />
        <shadowMaterial opacity={0.3} color={0x000000} />
      </mesh>
      {Grid && typeof Grid !== "string" && (
        <Grid
          args={[100, 100]}
          position={[0, 0.01, 0]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor={"#6f6f6f"}
          sectionSize={2.5}
          sectionThickness={1}
          sectionColor={"#9d4b4b"}
          fadeDistance={70}
          fadeStrength={1}
          infiniteGrid
          followCamera={false}
        />
      )}
      {shapes.map((shapeData) => (
        <Shape
          key={`${shapeData.id}-${refreshKey}`}
          {...shapeData}
          isAnimating={isAnimating}
          onClick={onShapeClick}
          objectRef={
            shapeData.id === selectedShapeId ? selectedObjectInternalRef : null
          }
          isTransformDragging={
            shapeData.id === selectedShapeId && isTransformDragging
          }
          gltfModelScene={loadedGltfObjects[shapeData.id]?.scene}
          onObjectReady={handleObjectReady} // New prop for object ready callback
        />
      ))}
      /* TransformControls with frame-based attachment management */
      {shouldShowControls &&
        TransformControls &&
        typeof TransformControls !== "string" && (
          <TransformControls
            ref={transformControlsRef}
            onObjectChange={handleObjectChange}
            onMouseUp={handleMouseUp}
            onDraggingChanged={handleDraggingChanged}
            size={0.75}
            camera={camera}
            domElement={gl.domElement}
          />
        )}
    </>
  );
}
export function CameraController({
  preset,
  orbitControlsEnabled,
  isTransformDragging,
}) {
  // Added isTransformDragging
  const { camera } = useThree();
  const controls = useThree((state) => state.controls);

  const cameraPresets = useMemo(
    () => ({
      top: { position: [0, 15, 0.01], target: [0, 0, 0] },
      front: { position: [0, 2, 15], target: [0, 1, 0] },
      side: { position: [15, 2, 0], target: [0, 1, 0] },
      isometric: { position: [10, 10, 10], target: [0, 0, 0] },
      default: { position: [7, 7, 7], target: [0, 1, 0] },
    }),
    []
  );

  useEffect(() => {
    if (controls) {
      const targetPreset =
        preset && cameraPresets[preset]
          ? cameraPresets[preset]
          : cameraPresets.default;
      camera.position.set(...targetPreset.position);
      controls.target.set(...targetPreset.target);
      controls.update();
    }
  }, [preset, camera, controls, cameraPresets]);

  if (!OrbitControls || typeof OrbitControls === "string") return null;

  // isTransformDragging prop is now the primary source for this check
  // const isR3FDragging = useThree((state) => state.get()?.isTransformDragging); // Fallback or additional check if needed

  return (
    <OrbitControls
      enabled={orbitControlsEnabled && !isTransformDragging} // Use the prop
      makeDefault
      enableDamping
      dampingFactor={0.1}
      minDistance={0.5}
      maxDistance={100}
      zoomSpeed={0.8}
      panSpeed={0.8}
      rotateSpeed={0.6}
      domElement={useThree((state) => state.gl.domElement)} // Explicitly pass domElement for OrbitControls
    />
  );
}
