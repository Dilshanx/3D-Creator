import React, { useState, useRef, useCallback, useEffect } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { PanelLeft, PanelRight, X as CloseIcon } from "lucide-react";

import PropertiesPanel from "./PropertiesPanel";
import EditorSidebar from "./EditorSidebar";
import EditorToolbar from "./EditorToolbar";
import CanvasView from "./CanvasView";
import StatusBar from "./StatusBar";
import FallbackCreator from "./FallbackCreator";
import AnimationPlaybackBar from "./AnimationPlaybackBar";

import {
  MainScene,
  CameraController,
  createMeshFromShape,
  exportToGLB,
} from "./SceneElements";
import { cn } from "@/lib/utils";

// --- Helper functions and constants (identical to your last provided version) ---
let R3FCanvasCheck;
try {
  const r3f = require("@react-three/fiber");
  R3FCanvasCheck = r3f.Canvas;
} catch (error) {
  /* Handled */
}
let gltfLoaderInstance;
const getGltfLoader = () => {
  if (!gltfLoaderInstance) {
    const { GLTFLoader } = require("three/examples/jsm/loaders/GLTFLoader.js");
    const {
      DRACOLoader,
    } = require("three/examples/jsm/loaders/DRACOLoader.js");
    gltfLoaderInstance = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/gltf/");
    gltfLoaderInstance.setDRACOLoader(dracoLoader);
  }
  return gltfLoaderInstance;
};
const MAX_PLANE_DIMENSION = 5;
const DEFAULT_EXPORT_FONT_PATH = "/fonts/helvetiker_regular.typeface.json";
let helvetikerFontForExport = null;
const exportFontLoaderInstance = new FontLoader();
if (typeof window !== "undefined" && !helvetikerFontForExport) {
  exportFontLoaderInstance.load(
    DEFAULT_EXPORT_FONT_PATH,
    (font) => {
      helvetikerFontForExport = font;
    },
    undefined,
    (err) =>
      console.error(
        "Model3DCreator: Failed to pre-load default EXPORT font:",
        err
      )
  );
}
const saneNumber = (value, defaultValue = 0) => {
  const num = Number(value);
  return isNaN(num) || !isFinite(num) ? defaultValue : num;
};
const initialTextureProps = {
  mapUrl: null,
  normalMapUrl: null,
  roughnessMapUrl: null,
  metalnessMapUrl: null,
  aoMapUrl: null,
  emissiveMapUrl: null,
};
const textureLoaderForGLB = new THREE.TextureLoader();
const applyTextureToGLBNode = (
  node,
  mapType,
  textureUrl,
  materialOverrideConfig,
  callback
) => {
  /* ... UNCHANGED from your last full version ... */ if (
    node.isMesh &&
    node.material
  ) {
    const materials = Array.isArray(node.material)
      ? node.material
      : [node.material];
    let appliedOverall = false;
    materials.forEach((originalMaterial, index) => {
      let targetMaterial = originalMaterial;
      let materialWasReplacedThisCall = false;
      if (!originalMaterial.userData) originalMaterial.userData = {};
      if (!originalMaterial.userData.originalName) {
        originalMaterial.userData.originalName =
          originalMaterial.name || `glb_material_${node.uuid}_${index}`;
      }
      if (materialOverrideConfig && materialOverrideConfig.type !== "model") {
        const newMaterialProps = {
          color: new THREE.Color(materialOverrideConfig.color || "#cccccc"),
        };
        if (
          materialOverrideConfig.type === "standard" ||
          materialOverrideConfig.type === "physical"
        ) {
          newMaterialProps.roughness = materialOverrideConfig.roughness ?? 0.5;
          newMaterialProps.metalness = materialOverrideConfig.metalness ?? 0.0;
        }
        if (materialOverrideConfig.type === "physical") {
          newMaterialProps.transmission =
            materialOverrideConfig.transmission ?? 0.0;
          newMaterialProps.ior = materialOverrideConfig.ior ?? 1.5;
          newMaterialProps.thickness = materialOverrideConfig.thickness ?? 0.01;
        }
        let NewMaterialConstructor;
        switch (materialOverrideConfig.type) {
          case "physical":
            NewMaterialConstructor = THREE.MeshPhysicalMaterial;
            break;
          case "toon":
            NewMaterialConstructor = THREE.MeshToonMaterial;
            break;
          case "basic":
            NewMaterialConstructor = THREE.MeshBasicMaterial;
            break;
          case "lambert":
            NewMaterialConstructor = THREE.MeshLambertMaterial;
            break;
          case "phong":
            NewMaterialConstructor = THREE.MeshPhongMaterial;
            break;
          case "wireframe":
            NewMaterialConstructor = THREE.MeshBasicMaterial;
            newMaterialProps.wireframe = true;
            break;
          default:
            NewMaterialConstructor = THREE.MeshStandardMaterial;
        }
        const newMaterialInstance = new NewMaterialConstructor(
          newMaterialProps
        );
        newMaterialInstance.name =
          `${originalMaterial.userData.originalName}_override_${materialOverrideConfig.type}`.substring(
            0,
            250
          );
        newMaterialInstance.userData.isOverride = true;
        newMaterialInstance.userData.originalName =
          originalMaterial.userData.originalName;
        if (
          originalMaterial.isMaterial &&
          originalMaterial !== newMaterialInstance
        ) {
          if (
            originalMaterial.userData.isOverride ||
            originalMaterial.name.includes("_override")
          ) {
            originalMaterial.dispose();
          }
        }
        if (Array.isArray(node.material)) {
          node.material[index] = newMaterialInstance;
        } else {
          node.material = newMaterialInstance;
        }
        targetMaterial = newMaterialInstance;
        materialWasReplacedThisCall = true;
        appliedOverall = true;
      } else if (
        materialOverrideConfig &&
        materialOverrideConfig.type === "model" &&
        targetMaterial.userData?.isOverride
      ) {
        const defaultProps = {
          color: new THREE.Color(targetMaterial.color || "#cccccc"),
          name: targetMaterial.userData.originalName,
        };
        const defaultMaterial = new THREE.MeshStandardMaterial(defaultProps);
        if (targetMaterial.isMaterial) targetMaterial.dispose();
        if (Array.isArray(node.material)) {
          node.material[index] = defaultMaterial;
        } else {
          node.material = defaultMaterial;
        }
        targetMaterial = defaultMaterial;
        materialWasReplacedThisCall = true;
        appliedOverall = true;
      }
      if (
        mapType &&
        targetMaterial &&
        (targetMaterial.isMeshStandardMaterial ||
          targetMaterial.isMeshPhysicalMaterial ||
          targetMaterial.isMeshToonMaterial ||
          targetMaterial.isMeshBasicMaterial ||
          targetMaterial.isMeshLambertMaterial ||
          targetMaterial.isMeshPhongMaterial)
      ) {
        const loadAndApply = (texUrl, mapProperty, isColorMap = false) => {
          if (texUrl) {
            textureLoaderForGLB.load(
              texUrl,
              (texture) => {
                texture.colorSpace = isColorMap
                  ? THREE.SRGBColorSpace
                  : THREE.LinearSRGBColorSpace;
                texture.flipY = false;
                texture.needsUpdate = true;
                if (
                  targetMaterial[mapProperty] &&
                  targetMaterial[mapProperty].isTexture
                )
                  targetMaterial[mapProperty].dispose();
                targetMaterial[mapProperty] = texture;
                if (
                  isColorMap &&
                  (targetMaterial.isMeshStandardMaterial ||
                    targetMaterial.isMeshPhysicalMaterial)
                ) {
                  targetMaterial.color.set(0xffffff);
                }
                targetMaterial.needsUpdate = true;
                appliedOverall = true;
                if (callback) callback(true, mapProperty);
              },
              undefined,
              (err) => {
                console.error(`Error loading ${mapProperty} for GLB:`, err);
                if (callback) callback(false, mapProperty);
              }
            );
          } else {
            if (
              targetMaterial[mapProperty] &&
              targetMaterial[mapProperty].isTexture
            )
              targetMaterial[mapProperty].dispose();
            targetMaterial[mapProperty] = null;
            if (
              isColorMap &&
              (targetMaterial.isMeshStandardMaterial ||
                targetMaterial.isMeshPhysicalMaterial)
            ) {
              targetMaterial.color.set(
                new THREE.Color(
                  materialOverrideConfig?.color ||
                    (targetMaterial.userData?.isOverride
                      ? "#cccccc"
                      : originalMaterial?.color?.getHex()) ||
                    0xcccccc
                )
              );
            }
            targetMaterial.needsUpdate = true;
            appliedOverall = true;
            if (callback) callback(true, mapProperty);
          }
        };
        switch (mapType) {
          case "map":
            loadAndApply(textureUrl, "map", true);
            break;
          case "normalMap":
            loadAndApply(textureUrl, "normalMap");
            break;
          case "roughnessMap":
            if (
              targetMaterial.isMeshStandardMaterial ||
              targetMaterial.isMeshPhysicalMaterial
            )
              loadAndApply(textureUrl, "roughnessMap");
            break;
          case "metalnessMap":
            if (
              targetMaterial.isMeshStandardMaterial ||
              targetMaterial.isMeshPhysicalMaterial
            )
              loadAndApply(textureUrl, "metalnessMap");
            break;
          case "aoMap":
            if (
              targetMaterial.isMeshStandardMaterial ||
              targetMaterial.isMeshPhysicalMaterial
            ) {
              loadAndApply(textureUrl, "aoMap");
              if (textureUrl && targetMaterial.aoMap)
                targetMaterial.aoMapIntensity = 1.0;
              else if (!textureUrl)
                targetMaterial.aoMapIntensity =
                  materialOverrideConfig?.aoMapIntensity ??
                  (originalMaterial.isMeshStandardMaterial ||
                  originalMaterial.isMeshPhysicalMaterial
                    ? originalMaterial.aoMapIntensity
                    : 0.0);
            }
            break;
          case "emissiveMap":
            loadAndApply(textureUrl, "emissiveMap", true);
            if (
              textureUrl &&
              targetMaterial.emissiveMap &&
              (targetMaterial.isMeshStandardMaterial ||
                targetMaterial.isMeshPhysicalMaterial)
            ) {
              targetMaterial.emissive.set(0xffffff);
              targetMaterial.emissiveIntensity =
                materialOverrideConfig?.emissiveIntensity ??
                (originalMaterial.isMeshStandardMaterial ||
                originalMaterial.isMeshPhysicalMaterial
                  ? originalMaterial.emissiveIntensity
                  : 1.0);
            }
            break;
          default:
            if (materialWasReplacedThisCall && callback) {
              callback(true, "material_override_only");
            } else if (callback) {
              callback(false, mapType);
            }
            return;
        }
      } else if (materialWasReplacedThisCall && callback) {
        callback(true, "material_override_only");
      } else if (callback && mapType) {
        callback(false, mapType);
      }
    });
    return appliedOverall;
  }
  if (mapType && callback) callback(false, mapType);
  return false;
};

export default function Model3DCreator() {
  // ... (All state declarations - UNCHANGED from your previous complete version)
  const [shapes, setShapes] = useState([]);
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [mode, setMode] = useState("translate");
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [cameraPreset, setCameraPreset] = useState(null);
  const sceneRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isBaking, setIsBaking] = useState(false);
  const [loadedGltfObjects, setLoadedGltfObjects] = useState({});
  const [animationClips, setAnimationClips] = useState([]);
  const [selectedAnimationClipIndex, setSelectedAnimationClipIndex] =
    useState(-1);
  const [animationPlaybackState, setAnimationPlaybackState] =
    useState("stopped");
  const [animationTime, setAnimationTime] = useState(0);
  const [animationDuration, setAnimationDuration] = useState(0);
  const [isAnimationLooping, setIsAnimationLooping] = useState(true);
  const [animationPlaybackSpeed, setAnimationPlaybackSpeed] = useState(1.0);
  const [playAllAnimations, setPlayAllAnimations] = useState(false);
  const [forceCanvasRefreshKey, setForceCanvasRefreshKey] = useState(0);
  const selectedShape = shapes.find((shape) => shape.id === selectedShapeId);
  const jsonFileInputRef = useRef(null);
  const glbFileInputRef = useRef(null);
  const imageFileInputRef = useRef(null);
  const shapeTextureFileInputRefs = useRef({});
  const textTextureFileInputRefs = useRef({});
  const creatorWrapperRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeMobilePanel, setActiveMobilePanel] = useState(null);

  // ... (All callback functions like toggleFullscreen, saveState, addShape, etc. - UNCHANGED from your previous complete version)
  const toggleFullscreen = useCallback(async () => {
    if (!creatorWrapperRef.current) return;
    if (!document.fullscreenElement) {
      try {
        await creatorWrapperRef.current.requestFullscreen();
      } catch (err) {
        console.error(
          "Fullscreen request failed:",
          err
        ); /* alert("Fullscreen not available or denied."); */
      }
    } else {
      if (document.exitFullscreen) {
        try {
          await document.exitFullscreen();
        } catch (err) {
          console.error("Exit fullscreen failed:", err);
        }
      }
    }
  }, []);
  useEffect(() => {
    const fsChangeHandler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", fsChangeHandler);
    return () =>
      document.removeEventListener("fullscreenchange", fsChangeHandler);
  }, []);
  const toggleMobilePanel = useCallback((panel) => {
    setActiveMobilePanel((current) => (current === panel ? null : panel));
  }, []);
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
      textureProps: shape.textureProps
        ? { ...shape.textureProps }
        : { ...initialTextureProps },
      textTextureProps: shape.textTextureProps
        ? { ...shape.textTextureProps }
        : { ...initialTextureProps },
      glbMaterialOverride: shape.glbMaterialOverride
        ? { ...shape.glbMaterialOverride }
        : null,
    }));
    setUndoStack((prev) => [...prev, state]);
    setRedoStack([]);
  }, [shapes, isBaking]);
  const addImportedShape = useCallback(
    (gltfData, fileName, initialScaleFactor = 1) => {
      saveState();
      const newShapeId = Date.now().toString();
      const newShape = {
        id: newShapeId,
        type: "importedGLB",
        name: fileName.split(".").slice(0, -1).join(".") || "Imported Model",
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [initialScaleFactor, initialScaleFactor, initialScaleFactor],
        animation: { type: "none" },
        glbMaterialOverride: null,
        textureProps: { ...initialTextureProps },
      };
      setShapes((prev) => [...prev, newShape]);
      setLoadedGltfObjects((prev) => ({
        ...prev,
        [newShapeId]: {
          scene: gltfData.scene,
          animations: gltfData.animations || [],
        },
      }));
      setSelectedShapeId(newShapeId);
    },
    [saveState]
  );
  const addImagePlane = useCallback(
    (imageDataUrl, originalWidth, originalHeight, fileName) => {
      saveState();
      let planeWidth, planeHeight;
      if (originalWidth > originalHeight) {
        planeWidth = MAX_PLANE_DIMENSION;
        planeHeight =
          MAX_PLANE_DIMENSION * (originalHeight / originalWidth) ||
          MAX_PLANE_DIMENSION * 0.75;
      } else {
        planeHeight = MAX_PLANE_DIMENSION;
        planeWidth =
          MAX_PLANE_DIMENSION * (originalWidth / originalHeight) ||
          MAX_PLANE_DIMENSION * 0.75;
      }
      const newShapeId = Date.now().toString();
      const newShape = {
        id: newShapeId,
        type: "imagePlane",
        name: fileName.split(".").slice(0, -1).join(".") || "Image Plane",
        position: [0, planeHeight / 2, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        imageDataUrl,
        originalWidth,
        originalHeight,
        planeWidth,
        planeHeight,
        animation: { type: "none" },
      };
      setShapes((prev) => [...prev, newShape]);
      setSelectedShapeId(newShape.id);
    },
    [saveState]
  );
  const addShape = useCallback(
    (geometryType, options = {}) => {
      if (geometryType === "importedGLB" || geometryType === "imagePlane") {
        console.error(`Use trigger import functions for ${geometryType}`);
        return;
      }
      saveState();
      const newShapeBase = {
        id: Date.now().toString(),
        type: geometryType,
        name: geometryType.charAt(0).toUpperCase() + geometryType.slice(1),
        material: "standard",
        color: `#${Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")}`,
        position: [
          (Math.random() - 0.5) * 3,
          (options.shapeSize || 1) * (geometryType === "pyramid" ? 0 : 0.5),
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
        textureProps: { ...initialTextureProps },
      };
      let specificProps = {};
      if (geometryType === "text") {
        specificProps = {
          text: "Text",
          textSize: 0.5,
          extrudeDepth: 0.2,
          name: "3D Text",
          textTextureProps: { ...initialTextureProps },
        };
        newShapeBase.position[1] =
          (specificProps.textSize || 0.5) * 0.5 * newShapeBase.scale[1];
      } else if (geometryType === "customExtruded") {
        const shapeTypeName = options.shapeType
          ? options.shapeType.charAt(0).toUpperCase() +
            options.shapeType.slice(1)
          : "Custom";
        specificProps = {
          shapeType: options.shapeType || "heart",
          shapeSize: options.shapeSize || 1,
          extrudeDepth: options.extrudeDepth || 0.2,
          name: shapeTypeName,
        };
        newShapeBase.position[1] =
          (specificProps.shapeSize / 2) * newShapeBase.scale[1];
      }
      const newShape = { ...newShapeBase, ...specificProps };
      setShapes((prev) => [...prev, newShape]);
      setSelectedShapeId(newShape.id);
    },
    [saveState]
  );
  const handleGlbFileImport = useCallback(
    (event) => {
      if (isBaking) {
        alert("Cannot import while baking.");
        return;
      }
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e_reader) => {
          try {
            const loader = getGltfLoader();
            loader.parse(
              e_reader.target.result,
              "",
              (gltf) => {
                const originalScene = gltf.scene;
                const box = new THREE.Box3().setFromObject(originalScene);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                let sceneToUse = originalScene;
                let scaleFactor = 1;
                const targetMaxSize = 3.0;
                const currentMaxSize = Math.max(size.x, size.y, size.z);
                if (currentMaxSize > targetMaxSize && currentMaxSize > 0) {
                  scaleFactor = targetMaxSize / currentMaxSize;
                } else if (currentMaxSize === 0) {
                  console.warn(
                    "Imported GLB has zero size. Scale not adjusted."
                  );
                }
                if (center.lengthSq() > 0.0001) {
                  const centeringGroup = new THREE.Group();
                  centeringGroup.name = originalScene.name
                    ? originalScene.name + "_centeringWrapper"
                    : "gltf_centeringWrapper";
                  centeringGroup.add(originalScene);
                  originalScene.position.sub(center);
                  sceneToUse = centeringGroup;
                }
                const processedGltf = { ...gltf, scene: sceneToUse };
                addImportedShape(processedGltf, file.name, scaleFactor);
              },
              (error) => {
                console.error("Error parsing GLB/GLTF file:", error);
                alert("Error parsing GLB/GLTF file: " + error.message);
              }
            );
          } catch (error) {
            console.error("Error processing GLB/GLTF file:", error);
            alert("Error processing GLB/GLTF file: " + error.message);
          }
        };
        reader.onerror = (e) => {
          console.error("Error reading GLB/GLTF file:", e);
          alert("Error reading GLB/GLTF file.");
        };
        reader.readAsArrayBuffer(file);
      }
      if (event.target) event.target.value = null;
    },
    [isBaking, addImportedShape]
  );
  const handleJsonFileImport = useCallback(
    (event) => {
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
              const newShapes = jsonData.shapes.map((s) => {
                const baseAnimation = {
                  type: "none",
                  speed: 1,
                  axis: "y",
                  orbitCenter: [0, 0, 0],
                  orbitRadius: 5,
                  orbitPlane: "xz",
                };
                const loadedAnimation = s.animation
                  ? {
                      ...baseAnimation,
                      ...s.animation,
                      orbitCenter:
                        Array.isArray(s.animation.orbitCenter) &&
                        s.animation.orbitCenter.length === 3
                          ? s.animation.orbitCenter
                          : [0, 0, 0],
                    }
                  : baseAnimation;
                const baseShape = {
                  id: s.id || Date.now().toString() + Math.random(),
                  type: s.type || "box",
                  name:
                    s.name ||
                    (s.type || "box").charAt(0).toUpperCase() +
                      (s.type || "box").slice(1),
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
                  animation: loadedAnimation,
                  textureProps: s.textureProps
                    ? { ...initialTextureProps, ...s.textureProps }
                    : { ...initialTextureProps },
                };
                if (s.type === "importedGLB")
                  return {
                    ...baseShape,
                    originalFileName: s.originalFileName || s.name,
                    glbMaterialOverride: s.glbMaterialOverride || null,
                  };
                if (s.type === "imagePlane")
                  return {
                    ...baseShape,
                    imageDataUrl: s.imageDataUrl,
                    originalWidth: s.originalWidth,
                    originalHeight: s.originalHeight,
                    planeWidth: s.planeWidth,
                    planeHeight: s.planeHeight,
                  };
                return {
                  ...baseShape,
                  color:
                    s.color ||
                    `#${Math.floor(Math.random() * 16777215)
                      .toString(16)
                      .padStart(6, "0")}`,
                  material: s.material || "standard",
                  roughness: s.roughness !== undefined ? s.roughness : 0.5,
                  metalness: s.metalness !== undefined ? s.metalness : 0.0,
                  ...(s.type === "text" && {
                    text: s.text || "Text",
                    textSize: s.textSize || 0.5,
                    extrudeDepth: s.extrudeDepth || 0.2,
                    textTextureProps: s.textTextureProps
                      ? { ...initialTextureProps, ...s.textTextureProps }
                      : { ...initialTextureProps },
                  }),
                  ...(s.type === "customExtruded" && {
                    shapeType: s.shapeType || "heart",
                    shapeSize: s.shapeSize || 1,
                    extrudeDepth: s.extrudeDepth || 0.2,
                  }),
                };
              });
              setShapes(newShapes);
              setSelectedShapeId(null);
              setUndoStack([]);
              setRedoStack([]);
              setLoadedGltfObjects({});
              setIsAnimating(
                jsonData.sceneSettings?.isAnimatingGlobal !== undefined
                  ? jsonData.sceneSettings.isAnimatingGlobal
                  : true
              ); /* alert(`Scene loaded with ${newShapes.length} shapes. GLBs require re-importing files.`); */
            } else {
              alert("Invalid JSON: 'shapes' array missing.");
            }
          } catch (error) {
            console.error("Error parsing imported JSON:", error);
            alert("Error parsing JSON file: " + error.message);
          }
        };
        reader.readAsText(file);
        if (event.target) event.target.value = null;
      }
    },
    [isBaking]
  );
  const handleImageFileImport = useCallback(
    (event) => {
      if (isBaking) {
        alert("Cannot import while baking.");
        if (event.target) event.target.value = null;
        return;
      }
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e_reader) => {
          const img = new Image();
          img.onload = () => {
            addImagePlane(
              e_reader.target.result,
              img.naturalWidth,
              img.naturalHeight,
              file.name
            );
          };
          img.onerror = () => {
            alert("Failed to load image data.");
          };
          img.src = e_reader.target.result;
        };
        reader.onerror = (e) => {
          console.error("Error reading image file:", e);
          alert("Error reading image file.");
        };
        reader.readAsDataURL(file);
      } else if (file) {
        alert("Please select a valid image file.");
      }
      if (event.target) event.target.value = null;
    },
    [isBaking, addImagePlane]
  );
  const removeShape = useCallback(
    (shapeId) => {
      if (isBaking) return;
      saveState();
      const shapeToRemove = shapes.find((s) => s.id === shapeId);
      setShapes((prev) => prev.filter((shape) => shape.id !== shapeId));
      if (shapeToRemove && shapeToRemove.type === "importedGLB") {
        setLoadedGltfObjects((prev) => {
          const updated = { ...prev };
          const gltfObjectData = updated[shapeId];
          if (gltfObjectData && gltfObjectData.scene) {
            gltfObjectData.scene.traverse((child) => {
              if (child.isMesh) {
                child.geometry?.dispose();
                if (child.material) {
                  if (Array.isArray(child.material))
                    child.material.forEach((mat) => {
                      mat.map?.dispose();
                      mat.dispose();
                    });
                  else {
                    child.material.map?.dispose();
                    child.material.dispose();
                  }
                }
              }
            });
          }
          delete updated[shapeId];
          return updated;
        });
      }
      if (selectedShapeId === shapeId) setSelectedShapeId(null);
    },
    [selectedShapeId, saveState, isBaking, shapes]
  );
  const updateShape = useCallback(
    (shapeId, updates) => {
      if (isBaking) return;
      setShapes((prev) =>
        prev.map((s) => (s.id === shapeId ? { ...s, ...updates } : s))
      );
    },
    [isBaking]
  );
  const updateShapeAndSave = useCallback(
    (shapeId, updates) => {
      if (isBaking) return;
      saveState();
      setShapes((prevShapes) =>
        prevShapes.map((s) => {
          if (s.id === shapeId) {
            const newShape = { ...s, ...updates };
            if (
              newShape.type === "importedGLB" &&
              (updates.hasOwnProperty("glbMaterialOverride") ||
                updates.hasOwnProperty("textureProps"))
            ) {
              const gltfObjectData = loadedGltfObjects[shapeId];
              if (gltfObjectData && gltfObjectData.scene) {
                gltfObjectData.scene.traverse((node) => {
                  if (updates.hasOwnProperty("glbMaterialOverride")) {
                    applyTextureToGLBNode(
                      node,
                      null,
                      undefined,
                      newShape.glbMaterialOverride,
                      () => {}
                    );
                  }
                  if (
                    updates.hasOwnProperty("textureProps") &&
                    newShape.textureProps
                  ) {
                    Object.keys(newShape.textureProps).forEach((mapUrlKey) => {
                      const mapType = mapUrlKey.replace("Url", "");
                      const url = newShape.textureProps[mapUrlKey];
                      applyTextureToGLBNode(
                        node,
                        mapType,
                        url,
                        newShape.glbMaterialOverride,
                        () => {}
                      );
                    });
                  } else if (
                    updates.hasOwnProperty("glbMaterialOverride") &&
                    newShape.textureProps
                  ) {
                    Object.keys(newShape.textureProps).forEach((mapUrlKey) => {
                      const mapType = mapUrlKey.replace("Url", "");
                      const url = newShape.textureProps[mapUrlKey];
                      applyTextureToGLBNode(
                        node,
                        mapType,
                        url,
                        newShape.glbMaterialOverride,
                        () => {}
                      );
                    });
                  }
                });
              }
            }
            return newShape;
          }
          return s;
        })
      );
    },
    [saveState, isBaking, loadedGltfObjects]
  );
  const duplicateShape = useCallback(() => {
    if (!selectedShape || isBaking) return;
    saveState();
    const newId = Date.now().toString();
    let duplicatedShapeData = {
      ...selectedShape,
      id: newId,
      position: [
        selectedShape.position[0] + 0.5,
        selectedShape.position[1],
        selectedShape.position[2] + 0.5,
      ],
      name: `${selectedShape.name || selectedShape.type} Copy`,
      animation: selectedShape.animation
        ? {
            ...selectedShape.animation,
            orbitCenter: [
              ...(selectedShape.animation.orbitCenter || [0, 0, 0]),
            ],
          }
        : { type: "none" },
      textureProps: selectedShape.textureProps
        ? { ...selectedShape.textureProps }
        : { ...initialTextureProps },
      textTextureProps: selectedShape.textTextureProps
        ? { ...selectedShape.textTextureProps }
        : { ...initialTextureProps },
      glbMaterialOverride: selectedShape.glbMaterialOverride
        ? { ...selectedShape.glbMaterialOverride }
        : null,
    };
    if (
      selectedShape.type === "importedGLB" &&
      loadedGltfObjects[selectedShape.id]
    ) {
      const originalGltfObject = loadedGltfObjects[selectedShape.id];
      const clonedScene = originalGltfObject.scene.clone(true);
      if (
        duplicatedShapeData.glbMaterialOverride ||
        (duplicatedShapeData.textureProps &&
          Object.values(duplicatedShapeData.textureProps).some((v) => v))
      ) {
        clonedScene.traverse((node) => {
          if (node.isMesh) {
            if (duplicatedShapeData.glbMaterialOverride) {
              applyTextureToGLBNode(
                node,
                null,
                undefined,
                duplicatedShapeData.glbMaterialOverride,
                () => {}
              );
            }
            if (duplicatedShapeData.textureProps) {
              Object.keys(duplicatedShapeData.textureProps).forEach(
                (mapUrlKey) => {
                  const mapType = mapUrlKey.replace("Url", "");
                  const url = duplicatedShapeData.textureProps[mapUrlKey];
                  applyTextureToGLBNode(
                    node,
                    mapType,
                    url,
                    duplicatedShapeData.glbMaterialOverride,
                    () => {}
                  );
                }
              );
            }
          }
        });
      }
      setLoadedGltfObjects((prev) => ({
        ...prev,
        [newId]: {
          scene: clonedScene,
          animations:
            originalGltfObject.animations?.map((clip) => clip.clone()) || [],
        },
      }));
    }
    setShapes((prev) => [...prev, duplicatedShapeData]);
    setSelectedShapeId(newId);
  }, [selectedShape, saveState, isBaking, loadedGltfObjects]);
  const handleShapeClick = useCallback(
    (shapeId) => {
      if (isBaking) return;
      setSelectedShapeId(shapeId);
      if (window.innerWidth < 768 && activeMobilePanel !== "right") {
        setActiveMobilePanel("right");
      }
    },
    [isBaking, activeMobilePanel]
  );
  const handleShapeUpdateFromTransformControls = useCallback(
    (shapeIdToUpdate) => {
      if (isBaking || !shapeIdToUpdate || !sceneRef.current) return;
      const currentShapeData = shapes.find((s) => s.id === shapeIdToUpdate);
      if (!currentShapeData) return;
      let objectNameSuffix =
        currentShapeData.name ||
        (currentShapeData.type === "text"
          ? currentShapeData.text?.substring(0, 10) || "Text"
          : currentShapeData.shapeType || currentShapeData.type);
      const objectName = `shape_${currentShapeData.id}_${currentShapeData.type}_${objectNameSuffix}`;
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
        updateShapeAndSave(shapeIdToUpdate, newUpdates);
      } else {
        const simplerObjectName = `shape_${currentShapeData.id}`;
        const fallbackObject = sceneRef.current.getObjectByProperty(
          "name",
          (name) => name && name.startsWith(simplerObjectName)
        );
        if (fallbackObject) {
          const newUpdates = {
            position: [
              fallbackObject.position.x,
              fallbackObject.position.y,
              fallbackObject.position.z,
            ],
            rotation: [
              fallbackObject.rotation.x,
              fallbackObject.rotation.y,
              fallbackObject.rotation.z,
            ],
            scale: [
              fallbackObject.scale.x,
              fallbackObject.scale.y,
              fallbackObject.scale.z,
            ],
          };
          updateShapeAndSave(shapeIdToUpdate, newUpdates);
        } else {
          console.error(
            `TransformControls target "${objectName}" or "${simplerObjectName}" not found.`
          );
        }
      }
    },
    [shapes, updateShapeAndSave, isBaking]
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
        position: [...s.position],
        rotation: [...s.rotation],
        scale: [...s.scale],
        animation: s.animation
          ? {
              ...s.animation,
              orbitCenter: [...(s.animation.orbitCenter || [0, 0, 0])],
            }
          : undefined,
        textureProps: s.textureProps
          ? { ...s.textureProps }
          : { ...initialTextureProps },
        textTextureProps: s.textTextureProps
          ? { ...s.textTextureProps }
          : { ...initialTextureProps },
        glbMaterialOverride: s.glbMaterialOverride
          ? { ...s.glbMaterialOverride }
          : null,
      })),
      ...prevRedo,
    ]);
    setUndoStack(prevStates);
    setShapes(stateToRestore);
    stateToRestore.forEach((shape) => {
      if (
        shape.type === "importedGLB" &&
        (shape.glbMaterialOverride ||
          (shape.textureProps &&
            Object.values(shape.textureProps).some((v) => v)))
      ) {
        const gltfObjectData = loadedGltfObjects[shape.id];
        if (gltfObjectData && gltfObjectData.scene) {
          gltfObjectData.scene.traverse((node) => {
            if (node.isMesh) {
              if (shape.glbMaterialOverride) {
                applyTextureToGLBNode(
                  node,
                  null,
                  undefined,
                  shape.glbMaterialOverride,
                  () => {}
                );
              }
              if (shape.textureProps) {
                Object.keys(shape.textureProps).forEach((mapUrlKey) => {
                  const mapType = mapUrlKey.replace("Url", "");
                  const url = shape.textureProps[mapUrlKey];
                  applyTextureToGLBNode(
                    node,
                    mapType,
                    url,
                    shape.glbMaterialOverride,
                    () => {}
                  );
                });
              }
            }
          });
        }
      }
    });
    setSelectedShapeId(null);
  }, [undoStack, shapes, isBaking, loadedGltfObjects]);
  const redo = useCallback(() => {
    if (redoStack.length === 0 || isBaking) return;
    const nextStates = [...redoStack];
    const stateToRestore = nextStates.shift();
    setUndoStack((prevUndo) => [
      shapes.map((s) => ({
        ...s,
        position: [...s.position],
        rotation: [...s.rotation],
        scale: [...s.scale],
        animation: s.animation
          ? {
              ...s.animation,
              orbitCenter: [...(s.animation.orbitCenter || [0, 0, 0])],
            }
          : undefined,
        textureProps: s.textureProps
          ? { ...s.textureProps }
          : { ...initialTextureProps },
        textTextureProps: s.textTextureProps
          ? { ...s.textTextureProps }
          : { ...initialTextureProps },
        glbMaterialOverride: s.glbMaterialOverride
          ? { ...s.glbMaterialOverride }
          : null,
      })),
      ...prevUndo,
    ]);
    setRedoStack(nextStates);
    setShapes(stateToRestore);
    stateToRestore.forEach((shape) => {
      if (
        shape.type === "importedGLB" &&
        (shape.glbMaterialOverride ||
          (shape.textureProps &&
            Object.values(shape.textureProps).some((v) => v)))
      ) {
        const gltfObjectData = loadedGltfObjects[shape.id];
        if (gltfObjectData && gltfObjectData.scene) {
          gltfObjectData.scene.traverse((node) => {
            if (node.isMesh) {
              if (shape.glbMaterialOverride) {
                applyTextureToGLBNode(
                  node,
                  null,
                  undefined,
                  shape.glbMaterialOverride,
                  () => {}
                );
              }
              if (shape.textureProps) {
                Object.keys(shape.textureProps).forEach((mapUrlKey) => {
                  const mapType = mapUrlKey.replace("Url", "");
                  const url = shape.textureProps[mapUrlKey];
                  applyTextureToGLBNode(
                    node,
                    mapType,
                    url,
                    shape.glbMaterialOverride,
                    () => {}
                  );
                });
              }
            }
          });
        }
      }
    });
    setSelectedShapeId(null);
  }, [redoStack, shapes, isBaking, loadedGltfObjects]);
  const exportJSON = useCallback(() => {
    if (isBaking) {
      alert("Cannot export while baking.");
      return;
    }
    if (shapes.length === 0) {
      alert("No shapes to export.");
      return;
    }
    try {
      const serializableShapes = shapes.map((s) => {
        const baseShape = {
          id: s.id,
          type: s.type,
          name: s.name || s.type,
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
          animation: s.animation
            ? {
                ...s.animation,
                orbitCenter:
                  Array.isArray(s.animation.orbitCenter) &&
                  s.animation.orbitCenter.length === 3
                    ? s.animation.orbitCenter
                    : [0, 0, 0],
              }
            : { type: "none" },
          textureProps: s.textureProps
            ? { ...s.textureProps }
            : { ...initialTextureProps },
        };
        if (s.type === "text")
          return {
            ...baseShape,
            text: s.text,
            textSize: s.textSize,
            extrudeDepth: s.extrudeDepth,
            color: s.color,
            material: s.material,
            roughness: s.roughness,
            metalness: s.metalness,
            textTextureProps: s.textTextureProps
              ? { ...s.textTextureProps }
              : { ...initialTextureProps },
          };
        else if (s.type === "customExtruded")
          return {
            ...baseShape,
            shapeType: s.shapeType,
            shapeSize: s.shapeSize,
            extrudeDepth: s.extrudeDepth,
            color: s.color,
            material: s.material,
            roughness: s.roughness,
            metalness: s.metalness,
          };
        else if (s.type === "importedGLB")
          return {
            ...baseShape,
            originalFileName: s.name,
            glbMaterialOverride: s.glbMaterialOverride
              ? { ...s.glbMaterialOverride }
              : null,
          };
        else if (s.type === "imagePlane")
          return {
            ...baseShape,
            imageDataUrl: s.imageDataUrl,
            originalWidth: s.originalWidth,
            originalHeight: s.originalHeight,
            planeWidth: s.planeWidth,
            planeHeight: s.planeHeight,
          };
        return {
          ...baseShape,
          color: s.color,
          material: s.material,
          roughness: s.roughness,
          metalness: s.metalness,
        };
      });
      const sceneData = {
        metadata: {
          version: "2.9.1-glb-material-texture-fix",
          type: "PBR Model Creator Scene",
          generator: "Creator Pro",
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
      alert(`Exported ${shapes.length} shapes to JSON successfully!`);
    } catch (error) {
      console.error("[EXPORT JSON] Failed:", error);
      alert("Failed to export scene as JSON: " + error.message);
    }
  }, [shapes, isAnimating, isBaking]);
  const exportStaticGLBFile = useCallback(async () => {
    if (isBaking) {
      alert("Cannot export while baking.");
      return;
    }
    if (shapes.length === 0) {
      alert("No shapes to export.");
      return;
    }
    try {
      setIsBaking(true);
      await new Promise((resolve) => setTimeout(resolve, 50));
      const exportScene = new THREE.Scene();
      exportScene.name = "StaticExportScene";
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      exportScene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
      directionalLight.position.set(8, 15, 10);
      directionalLight.castShadow = true;
      exportScene.add(directionalLight);
      let successfullyAddedCount = 0;
      const textureLoaderForExport = new THREE.TextureLoader();
      const loadTextureAsync = (url) =>
        new Promise((resolve) => {
          if (!url || typeof url !== "string" || url.trim() === "") {
            resolve(null);
            return;
          }
          textureLoaderForExport.load(
            url,
            (texture) => {
              texture.flipY = false;
              texture.needsUpdate = true;
              resolve(texture);
            },
            undefined,
            (err) => {
              console.error(`Export: Failed to load texture: ${url}`, err);
              resolve(null);
            }
          );
        });
      const meshPromises = shapes.map(async (shapeData) => {
        if (shapeData.type === "importedGLB") {
          const gltfObjectData = loadedGltfObjects[shapeData.id];
          if (gltfObjectData && gltfObjectData.scene) {
            const modelClone = gltfObjectData.scene.clone(true);
            if (
              shapeData.glbMaterialOverride &&
              shapeData.glbMaterialOverride.type !== "model"
            ) {
              await modelClone.traverse(async (node) => {
                if (node.isMesh && node.material) {
                  const originalMaterials = Array.isArray(node.material)
                    ? node.material
                    : [node.material];
                  const newMaterials = [];
                  for (let i = 0; i < originalMaterials.length; i++) {
                    const overrideConf = shapeData.glbMaterialOverride;
                    const newMaterialProps = {
                      color: new THREE.Color(overrideConf.color || "#cccccc"),
                    };
                    if (
                      overrideConf.type === "standard" ||
                      overrideConf.type === "physical"
                    ) {
                      newMaterialProps.roughness =
                        overrideConf.roughness ?? 0.5;
                      newMaterialProps.metalness =
                        overrideConf.metalness ?? 0.0;
                    }
                    if (overrideConf.type === "physical") {
                      newMaterialProps.transmission =
                        overrideConf.transmission ?? 0.0;
                      newMaterialProps.ior = overrideConf.ior ?? 1.5;
                      newMaterialProps.thickness =
                        overrideConf.thickness ?? 0.01;
                    }
                    let NewCtor;
                    switch (overrideConf.type) {
                      case "physical":
                        NewCtor = THREE.MeshPhysicalMaterial;
                        break;
                      default:
                        NewCtor = THREE.MeshStandardMaterial;
                    }
                    const newMaterialInstance = new NewCtor(newMaterialProps);
                    newMaterialInstance.name =
                      (originalMaterials[i].name ||
                        `glb_material_export_${i}`) + "_override";
                    if (shapeData.textureProps) {
                      for (const mapUrlKey of Object.keys(
                        shapeData.textureProps
                      )) {
                        const mapType = mapUrlKey.replace("Url", "");
                        const url = shapeData.textureProps[mapUrlKey];
                        if (
                          url &&
                          newMaterialInstance.hasOwnProperty(mapType)
                        ) {
                          const texture = await loadTextureAsync(url);
                          if (texture) {
                            if (
                              newMaterialInstance[mapType] &&
                              newMaterialInstance[mapType].isTexture
                            )
                              newMaterialInstance[mapType].dispose();
                            newMaterialInstance[mapType] = texture;
                            if (
                              mapType === "map" &&
                              (newMaterialInstance.isMeshStandardMaterial ||
                                newMaterialInstance.isMeshPhysicalMaterial)
                            )
                              newMaterialInstance.color.set(0xffffff);
                            if (mapType === "map" || mapType === "emissiveMap")
                              texture.colorSpace = THREE.SRGBColorSpace;
                            else
                              texture.colorSpace = THREE.LinearSRGBColorSpace;
                          }
                        }
                      }
                    }
                    newMaterialInstance.needsUpdate = true;
                    newMaterials.push(newMaterialInstance);
                  }
                  node.material =
                    newMaterials.length === 1 ? newMaterials[0] : newMaterials;
                }
              });
            } else if (shapeData.textureProps) {
              await modelClone.traverse(async (node) => {
                if (node.isMesh && node.material) {
                  const materialsToUpdate = Array.isArray(node.material)
                    ? node.material
                    : [node.material];
                  for (const mat of materialsToUpdate) {
                    let colorSetByMap = false;
                    for (const mapUrlKey of Object.keys(
                      shapeData.textureProps
                    )) {
                      const mapType = mapUrlKey.replace("Url", "");
                      const url = shapeData.textureProps[mapUrlKey];
                      if (url && mat.hasOwnProperty(mapType)) {
                        const texture = await loadTextureAsync(url);
                        if (texture) {
                          if (mat[mapType] && mat[mapType].isTexture)
                            mat[mapType].dispose();
                          mat[mapType] = texture;
                          if (
                            mapType === "map" &&
                            (mat.isMeshStandardMaterial ||
                              mat.isMeshPhysicalMaterial)
                          ) {
                            mat.color.set(0xffffff);
                            colorSetByMap = true;
                          }
                          if (mapType === "map" || mapType === "emissiveMap")
                            texture.colorSpace = THREE.SRGBColorSpace;
                          else texture.colorSpace = THREE.LinearSRGBColorSpace;
                        }
                      } else if (!url && mat.hasOwnProperty(mapType)) {
                        if (mat[mapType] && mat[mapType].isTexture)
                          mat[mapType].dispose();
                        mat[mapType] = null;
                        if (
                          mapType === "map" &&
                          (mat.isMeshStandardMaterial ||
                            mat.isMeshPhysicalMaterial) &&
                          !colorSetByMap
                        ) {
                          mat.color.set(
                            new THREE.Color(
                              shapeData.glbMaterialOverride?.color ||
                                mat.userData.originalColorHex ||
                                0xcccccc
                            )
                          );
                        }
                      }
                    }
                    mat.needsUpdate = true;
                  }
                }
              });
            }
            modelClone.position.fromArray(shapeData.position);
            modelClone.rotation.fromArray(shapeData.rotation);
            modelClone.scale.fromArray(shapeData.scale);
            modelClone.name = `shape_${shapeData.id}_${shapeData.type}_${
              shapeData.name || "ImportedGLB"
            }`;
            modelClone.traverse((obj) => {
              if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;
              }
            });
            return modelClone;
          }
          return null;
        }
        let mesh;
        if (shapeData.type === "text") {
          let fontToUse = helvetikerFontForExport;
          if (!fontToUse) {
            try {
              fontToUse = await new Promise((resolve, reject) => {
                exportFontLoaderInstance.load(
                  DEFAULT_EXPORT_FONT_PATH,
                  resolve,
                  undefined,
                  reject
                );
              });
              if (!helvetikerFontForExport) helvetikerFontForExport = fontToUse;
            } catch (e) {
              return null;
            }
          }
          const {
            TextGeometry,
          } = require("three/examples/jsm/geometries/TextGeometry.js");
          const tS = saneNumber(shapeData.textSize, 0.5);
          const tD = saneNumber(shapeData.extrudeDepth, 0.2);
          const textGeo = new TextGeometry(shapeData.text || "3D", {
            font: fontToUse,
            size: tS,
            height: tD,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: saneNumber(tS * 0.04, 0.015),
            bevelSize: saneNumber(tS * 0.04, 0.01),
            bevelOffset: 0,
            bevelSegments: 3,
          });
          textGeo.computeBoundingBox();
          const actualZDepth =
            textGeo.boundingBox.max.z - textGeo.boundingBox.min.z;
          const expectedZDepth = tD;
          let zScaleFactor = 1.0;
          if (
            actualZDepth !== 0 &&
            !isNaN(actualZDepth) &&
            isFinite(actualZDepth) &&
            expectedZDepth !== 0
          ) {
            zScaleFactor = expectedZDepth / actualZDepth;
          } else if (expectedZDepth === 0 && actualZDepth === 0)
            zScaleFactor = 1.0;
          if (
            Math.abs(zScaleFactor - 1.0) > 0.0001 &&
            isFinite(zScaleFactor) &&
            zScaleFactor > 0
          )
            textGeo.scale(1, 1, zScaleFactor);
          textGeo.computeBoundingBox();
          const centerOffsetX =
            -0.5 * (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x);
          const centerOffsetY =
            -0.5 * (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y);
          let centerOffsetZ =
            -0.5 * (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z);
          if (tD === 0) centerOffsetZ = 0;
          textGeo.translate(centerOffsetX, centerOffsetY, centerOffsetZ);
          const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(shapeData.color || "#ffffff"),
            roughness: saneNumber(shapeData.roughness, 0.5),
            metalness: saneNumber(shapeData.metalness, 0.0),
          });
          const texProps = shapeData.textTextureProps || initialTextureProps;
          if (texProps.mapUrl) {
            material.map = await loadTextureAsync(texProps.mapUrl);
            if (material.map) {
              material.color.set(0xffffff);
              material.map.colorSpace = THREE.SRGBColorSpace;
            }
          }
          if (texProps.normalMapUrl) {
            material.normalMap = await loadTextureAsync(texProps.normalMapUrl);
            if (material.normalMap)
              material.normalMap.colorSpace = THREE.LinearSRGBColorSpace;
          }
          mesh = new THREE.Mesh(textGeo, material);
        } else {
          mesh = await createMeshFromShape(shapeData);
          if (
            mesh &&
            shapeData.textureProps &&
            shapeData.type !== "imagePlane"
          ) {
            const texProps = shapeData.textureProps;
            const newMaterial = mesh.material.clone();
            let colorSetByMap = false;
            if (texProps.mapUrl) {
              newMaterial.map = await loadTextureAsync(texProps.mapUrl);
              if (newMaterial.map) {
                newMaterial.color.set(0xffffff);
                newMaterial.map.colorSpace = THREE.SRGBColorSpace;
                colorSetByMap = true;
              }
            }
            if (texProps.normalMapUrl) {
              newMaterial.normalMap = await loadTextureAsync(
                texProps.normalMapUrl
              );
              if (newMaterial.normalMap)
                newMaterial.normalMap.colorSpace = THREE.LinearSRGBColorSpace;
            }
            if (
              texProps.roughnessMapUrl &&
              (newMaterial.isMeshStandardMaterial ||
                newMaterial.isMeshPhysicalMaterial)
            ) {
              newMaterial.roughnessMap = await loadTextureAsync(
                texProps.roughnessMapUrl
              );
              if (newMaterial.roughnessMap)
                newMaterial.roughnessMap.colorSpace =
                  THREE.LinearSRGBColorSpace;
            }
            if (
              texProps.metalnessMapUrl &&
              (newMaterial.isMeshStandardMaterial ||
                newMaterial.isMeshPhysicalMaterial)
            ) {
              newMaterial.metalnessMap = await loadTextureAsync(
                texProps.metalnessMapUrl
              );
              if (newMaterial.metalnessMap)
                newMaterial.metalnessMap.colorSpace =
                  THREE.LinearSRGBColorSpace;
            }
            if (
              texProps.aoMapUrl &&
              (newMaterial.isMeshStandardMaterial ||
                newMaterial.isMeshPhysicalMaterial)
            ) {
              newMaterial.aoMap = await loadTextureAsync(texProps.aoMapUrl);
              if (newMaterial.aoMap) {
                newMaterial.aoMapIntensity = 1.0;
                newMaterial.aoMap.colorSpace = THREE.LinearSRGBColorSpace;
                if (
                  mesh.geometry.attributes.uv2 === undefined &&
                  mesh.geometry.attributes.uv
                ) {
                  mesh.geometry.setAttribute(
                    "uv2",
                    mesh.geometry.attributes.uv.clone()
                  );
                }
              }
            }
            if (texProps.emissiveMapUrl) {
              newMaterial.emissiveMap = await loadTextureAsync(
                texProps.emissiveMapUrl
              );
              if (newMaterial.emissiveMap) {
                newMaterial.emissive = new THREE.Color(0xffffff);
                newMaterial.emissiveIntensity = 1.0;
                newMaterial.emissiveMap.colorSpace = THREE.SRGBColorSpace;
              }
            }
            if (!colorSetByMap && shapeData.color)
              newMaterial.color.set(shapeData.color);
            if (shapeData.roughness !== undefined && !newMaterial.roughnessMap)
              newMaterial.roughness = shapeData.roughness;
            if (shapeData.metalness !== undefined && !newMaterial.metalnessMap)
              newMaterial.metalness = shapeData.metalness;
            mesh.material.dispose();
            mesh.material = newMaterial;
          }
        }
        if (mesh) {
          mesh.position.fromArray(shapeData.position);
          mesh.rotation.fromArray(shapeData.rotation);
          mesh.scale.fromArray(shapeData.scale);
          mesh.name = `shape_${shapeData.id}_${shapeData.type}_${
            shapeData.name || shapeData.text?.substring(0, 10) || "Object"
          }`;
          mesh.castShadow = shapeData.type !== "imagePlane";
          mesh.receiveShadow = true;
          return mesh;
        }
        return null;
      });
      const meshes = (await Promise.all(meshPromises)).filter(
        (m) => m !== null
      );
      meshes.forEach((mesh) => {
        if (mesh) {
          exportScene.add(mesh);
          successfullyAddedCount++;
        }
      });
      if (successfullyAddedCount === 0) {
        alert("No shapes could be prepared for Static GLB export.");
        setIsBaking(false);
        return;
      }
      exportToGLB(exportScene, `static-model-${Date.now()}.glb`);
      alert(
        `Exported ${successfullyAddedCount} shapes to Static GLB successfully!`
      );
    } catch (error) {
      console.error("[STATIC GLB EXPORT] Critical error:", error);
      alert("Static GLB Export failed: " + error.message);
    } finally {
      setIsBaking(false);
    }
  }, [shapes, loadedGltfObjects, isBaking]);
  const bakeAndExportAnimatedGLB = useCallback(async () => {
    if (shapes.length === 0) {
      alert("No shapes to export for animation.");
      return;
    }
    if (isBaking) {
      alert("Cannot export while already baking.");
      return;
    }
    setIsBaking(true);
    await new Promise((resolve) => setTimeout(resolve, 50));
    try {
      const exportScene = new THREE.Scene();
      exportScene.name = "BakedAnimatedScene";
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      exportScene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
      directionalLight.position.set(8, 15, 10);
      directionalLight.castShadow = true;
      exportScene.add(directionalLight);
      const allBakedClips = [];
      let allOriginalClips = [];
      let processedShapeCount = 0;
      const textureLoaderForExport = new THREE.TextureLoader();
      const loadTextureAsync = (url) =>
        new Promise((resolve) => {
          if (!url) {
            resolve(null);
            return;
          }
          textureLoaderForExport.load(
            url,
            (t) => {
              t.flipY = false;
              t.needsUpdate = true;
              resolve(t);
            },
            undefined,
            (e) => {
              console.error(`ExportAnim: Texture load fail: ${url}`, e);
              resolve(null);
            }
          );
        });
      const meshCreationPromises = shapes.map(async (shapeData) => {
        let targetObjectForAnimation;
        if (shapeData.type === "importedGLB") {
          const gltfObjectData = loadedGltfObjects[shapeData.id];
          if (gltfObjectData && gltfObjectData.scene) {
            targetObjectForAnimation = gltfObjectData.scene.clone(true);
            if (
              shapeData.glbMaterialOverride &&
              shapeData.glbMaterialOverride.type !== "model"
            ) {
              await targetObjectForAnimation.traverse(async (node) => {
                if (node.isMesh && node.material) {
                  const originalMaterials = Array.isArray(node.material)
                    ? node.material
                    : [node.material];
                  const newMaterials = [];
                  for (let i = 0; i < originalMaterials.length; i++) {
                    const overrideConf = shapeData.glbMaterialOverride;
                    const newMaterialProps = {
                      color: new THREE.Color(overrideConf.color || "#cccccc"),
                    };
                    if (
                      overrideConf.type === "standard" ||
                      overrideConf.type === "physical"
                    ) {
                      newMaterialProps.roughness =
                        overrideConf.roughness ?? 0.5;
                      newMaterialProps.metalness =
                        overrideConf.metalness ?? 0.0;
                    }
                    if (overrideConf.type === "physical") {
                      newMaterialProps.transmission =
                        overrideConf.transmission ?? 0.0;
                      newMaterialProps.ior = overrideConf.ior ?? 1.5;
                      newMaterialProps.thickness =
                        overrideConf.thickness ?? 0.01;
                    }
                    let NewCtor;
                    switch (overrideConf.type) {
                      default:
                        NewCtor = THREE.MeshStandardMaterial;
                    }
                    const newMaterialInstance = new NewCtor(newMaterialProps);
                    newMaterialInstance.name =
                      (originalMaterials[i].name || `glb_anim_mat_${i}`) +
                      "_override";
                    if (shapeData.textureProps) {
                      for (const mapUrlKey of Object.keys(
                        shapeData.textureProps
                      )) {
                        const mapType = mapUrlKey.replace("Url", "");
                        const url = shapeData.textureProps[mapUrlKey];
                        if (
                          url &&
                          newMaterialInstance.hasOwnProperty(mapType)
                        ) {
                          const texture = await loadTextureAsync(url);
                          if (texture) {
                            if (newMaterialInstance[mapType]?.isTexture)
                              newMaterialInstance[mapType].dispose();
                            newMaterialInstance[mapType] = texture;
                            if (mapType === "map")
                              newMaterialInstance.color.set(0xffffff);
                            if (mapType === "map" || mapType === "emissiveMap")
                              texture.colorSpace = THREE.SRGBColorSpace;
                            else
                              texture.colorSpace = THREE.LinearSRGBColorSpace;
                          }
                        }
                      }
                    }
                    newMaterialInstance.needsUpdate = true;
                    newMaterials.push(newMaterialInstance);
                  }
                  node.material =
                    newMaterials.length === 1 ? newMaterials[0] : newMaterials;
                }
              });
            } else if (shapeData.textureProps) {
              await targetObjectForAnimation.traverse(async (node) => {
                if (node.isMesh && node.material) {
                  const materialsToUpdate = Array.isArray(node.material)
                    ? node.material
                    : [node.material];
                  for (const mat of materialsToUpdate) {
                    let colorSetByMap = false;
                    for (const mapUrlKey of Object.keys(
                      shapeData.textureProps
                    )) {
                      const mapType = mapUrlKey.replace("Url", "");
                      const url = shapeData.textureProps[mapUrlKey];
                      if (url && mat.hasOwnProperty(mapType)) {
                        const texture = await loadTextureAsync(url);
                        if (texture) {
                          if (mat[mapType]?.isTexture) mat[mapType].dispose();
                          mat[mapType] = texture;
                          if (mapType === "map") {
                            mat.color.set(0xffffff);
                            colorSetByMap = true;
                          }
                          if (mapType === "map" || mapType === "emissiveMap")
                            texture.colorSpace = THREE.SRGBColorSpace;
                          else texture.colorSpace = THREE.LinearSRGBColorSpace;
                        }
                      } else if (!url && mat.hasOwnProperty(mapType)) {
                        if (mat[mapType]?.isTexture) mat[mapType].dispose();
                        mat[mapType] = null;
                        if (mapType === "map" && !colorSetByMap)
                          mat.color.set(
                            new THREE.Color(
                              shapeData.glbMaterialOverride?.color ||
                                mat.userData.originalColorHex ||
                                0xcccccc
                            )
                          );
                      }
                    }
                    mat.needsUpdate = true;
                  }
                }
              });
            }
            targetObjectForAnimation.position.fromArray(shapeData.position);
            targetObjectForAnimation.rotation.fromArray(shapeData.rotation);
            targetObjectForAnimation.scale.fromArray(shapeData.scale);
            targetObjectForAnimation.name = `shape_${shapeData.id}_${
              shapeData.type
            }_${shapeData.name || "ImportedGLBAnim"}`;
            targetObjectForAnimation.traverse((obj) => {
              if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;
              }
            });
            exportScene.add(targetObjectForAnimation);
            processedShapeCount++;
            if (
              gltfObjectData.animations &&
              gltfObjectData.animations.length > 0
            ) {
              allOriginalClips = allOriginalClips.concat(
                gltfObjectData.animations.map((clip) => clip.clone())
              );
            }
          } else {
            return null;
          }
        } else if (shapeData.type === "text") {
          let fontToUse = helvetikerFontForExport;
          if (!fontToUse) {
            try {
              fontToUse = await new Promise((resolve, reject) =>
                exportFontLoaderInstance.load(
                  DEFAULT_EXPORT_FONT_PATH,
                  resolve,
                  undefined,
                  reject
                )
              );
              if (!helvetikerFontForExport) helvetikerFontForExport = fontToUse;
            } catch (e) {
              return null;
            }
          }
          const {
            TextGeometry,
          } = require("three/examples/jsm/geometries/TextGeometry.js");
          const tS = saneNumber(shapeData.textSize, 0.5);
          const tD = saneNumber(shapeData.extrudeDepth, 0.2);
          const textGeo = new TextGeometry(shapeData.text || "3D", {
            font: fontToUse,
            size: tS,
            height: tD,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: saneNumber(tS * 0.04, 0.015),
            bevelSize: saneNumber(tS * 0.04, 0.01),
            bevelOffset: 0,
            bevelSegments: 3,
          });
          textGeo.computeBoundingBox();
          const actualZDepth =
            textGeo.boundingBox.max.z - textGeo.boundingBox.min.z;
          const expectedZDepth = tD;
          let zScaleFactor = 1.0;
          if (
            actualZDepth !== 0 &&
            !isNaN(actualZDepth) &&
            isFinite(actualZDepth) &&
            expectedZDepth !== 0
          )
            zScaleFactor = expectedZDepth / actualZDepth;
          else if (expectedZDepth === 0 && actualZDepth === 0)
            zScaleFactor = 1.0;
          if (
            Math.abs(zScaleFactor - 1.0) > 0.0001 &&
            isFinite(zScaleFactor) &&
            zScaleFactor > 0
          )
            textGeo.scale(1, 1, zScaleFactor);
          textGeo.computeBoundingBox();
          const centerOffsetX =
            -0.5 * (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x);
          const centerOffsetY =
            -0.5 * (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y);
          let centerOffsetZ =
            -0.5 * (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z);
          if (tD === 0) centerOffsetZ = 0;
          textGeo.translate(centerOffsetX, centerOffsetY, centerOffsetZ);
          const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(shapeData.color || "#ffffff"),
            roughness: saneNumber(shapeData.roughness, 0.5),
            metalness: saneNumber(shapeData.metalness, 0.0),
          });
          const texProps = shapeData.textTextureProps || initialTextureProps;
          if (texProps.mapUrl) {
            material.map = await loadTextureAsync(texProps.mapUrl);
            if (material.map) {
              material.color.set(0xffffff);
              material.map.colorSpace = THREE.SRGBColorSpace;
            }
          }
          if (texProps.normalMapUrl) {
            material.normalMap = await loadTextureAsync(texProps.normalMapUrl);
            if (material.normalMap)
              material.normalMap.colorSpace = THREE.LinearSRGBColorSpace;
          }
          targetObjectForAnimation = new THREE.Mesh(textGeo, material);
        } else {
          targetObjectForAnimation = await createMeshFromShape(shapeData);
          if (
            targetObjectForAnimation &&
            shapeData.textureProps &&
            shapeData.type !== "imagePlane"
          ) {
            const texProps = shapeData.textureProps;
            const newMaterial = targetObjectForAnimation.material.clone();
            let colorSetByMap = false;
            if (texProps.mapUrl) {
              newMaterial.map = await loadTextureAsync(texProps.mapUrl);
              if (newMaterial.map) {
                newMaterial.color.set(0xffffff);
                newMaterial.map.colorSpace = THREE.SRGBColorSpace;
                colorSetByMap = true;
              }
            }
            if (texProps.normalMapUrl) {
              newMaterial.normalMap = await loadTextureAsync(
                texProps.normalMapUrl
              );
              if (newMaterial.normalMap)
                newMaterial.normalMap.colorSpace = THREE.LinearSRGBColorSpace;
            }
            if (
              texProps.roughnessMapUrl &&
              (newMaterial.isMeshStandardMaterial ||
                newMaterial.isMeshPhysicalMaterial)
            ) {
              newMaterial.roughnessMap = await loadTextureAsync(
                texProps.roughnessMapUrl
              );
              if (newMaterial.roughnessMap)
                newMaterial.roughnessMap.colorSpace =
                  THREE.LinearSRGBColorSpace;
            }
            if (
              texProps.metalnessMapUrl &&
              (newMaterial.isMeshStandardMaterial ||
                newMaterial.isMeshPhysicalMaterial)
            ) {
              newMaterial.metalnessMap = await loadTextureAsync(
                texProps.metalnessMapUrl
              );
              if (newMaterial.metalnessMap)
                newMaterial.metalnessMap.colorSpace =
                  THREE.LinearSRGBColorSpace;
            }
            if (
              texProps.aoMapUrl &&
              (newMaterial.isMeshStandardMaterial ||
                newMaterial.isMeshPhysicalMaterial)
            ) {
              newMaterial.aoMap = await loadTextureAsync(texProps.aoMapUrl);
              if (newMaterial.aoMap) {
                newMaterial.aoMapIntensity = 1;
                newMaterial.aoMap.colorSpace = THREE.LinearSRGBColorSpace;
                if (
                  targetObjectForAnimation.geometry.attributes.uv2 ===
                    undefined &&
                  targetObjectForAnimation.geometry.attributes.uv
                )
                  targetObjectForAnimation.geometry.setAttribute(
                    "uv2",
                    targetObjectForAnimation.geometry.attributes.uv.clone()
                  );
              }
            }
            if (texProps.emissiveMapUrl) {
              newMaterial.emissiveMap = await loadTextureAsync(
                texProps.emissiveMapUrl
              );
              if (newMaterial.emissiveMap) {
                newMaterial.emissive = new THREE.Color(0xffffff);
                newMaterial.emissiveIntensity = 1.0;
                newMaterial.emissiveMap.colorSpace = THREE.SRGBColorSpace;
              }
            }
            if (!colorSetByMap && shapeData.color)
              newMaterial.color.set(shapeData.color);
            if (shapeData.roughness !== undefined && !newMaterial.roughnessMap)
              newMaterial.roughness = shapeData.roughness;
            if (shapeData.metalness !== undefined && !newMaterial.metalnessMap)
              newMaterial.metalness = shapeData.metalness;
            targetObjectForAnimation.material.dispose();
            targetObjectForAnimation.material = newMaterial;
          }
        }
        if (!targetObjectForAnimation && shapeData.type !== "importedGLB")
          return null;
        if (shapeData.type !== "importedGLB") {
          targetObjectForAnimation.position.fromArray(shapeData.position);
          targetObjectForAnimation.rotation.fromArray(shapeData.rotation);
          targetObjectForAnimation.scale.fromArray(shapeData.scale);
          targetObjectForAnimation.name = `shape_${shapeData.id}_${
            shapeData.type
          }_${
            shapeData.name || shapeData.text?.substring(0, 10) || "ObjectAnim"
          }`;
          targetObjectForAnimation.castShadow = shapeData.type !== "imagePlane";
          targetObjectForAnimation.receiveShadow = true;
          exportScene.add(targetObjectForAnimation);
          processedShapeCount++;
        }
        return { shapeData, targetObjectForAnimation };
      });
      const results = (await Promise.all(meshCreationPromises)).filter(
        (r) => r !== null
      );
      for (const result of results) {
        if (!result) continue;
        const { shapeData, targetObjectForAnimation } = result;
        if (
          shapeData.animation &&
          shapeData.animation.type !== "none" &&
          targetObjectForAnimation &&
          shapeData.type !== "importedGLB"
        ) {
          const animParams = shapeData.animation;
          let bakeDur = 5;
          const bakeFps = 30;
          if (
            animParams.type === "orbit" &&
            (animParams.speed || 1) * 0.2 !== 0
          ) {
            bakeDur = Math.abs((Math.PI * 2) / ((animParams.speed || 1) * 0.2));
            bakeDur = Math.max(1, Math.min(30, bakeDur));
          } else if (
            animParams.type === "rotate" &&
            (animParams.speed || 1) !== 0
          ) {
            bakeDur = Math.abs((Math.PI * 2) / (animParams.speed || 1));
            bakeDur = Math.max(1, Math.min(10, bakeDur));
          }
          const totalFrames = Math.max(2, Math.floor(bakeDur * bakeFps));
          const timeStep = bakeDur / (totalFrames - 1);
          const times = [];
          const positions = [];
          const quaternions = [];
          const simObj = new THREE.Object3D();
          simObj.position.copy(targetObjectForAnimation.position);
          simObj.quaternion.copy(targetObjectForAnimation.quaternion);
          let currentOrbitAngle = Math.atan2(
            simObj.position.z - (animParams.orbitCenter?.[2] || 0),
            simObj.position.x - (animParams.orbitCenter?.[0] || 0)
          );
          if (animParams.type === "orbit" && animParams.orbitRadius === 0)
            currentOrbitAngle = 0;
          for (let i = 0; i < totalFrames; i++) {
            const time = i * timeStep;
            times.push(time);
            const effSpeedThisFrame = (animParams.speed || 1) * timeStep;
            switch (animParams.type) {
              case "rotate":
                const axisVec = new THREE.Vector3();
                if (animParams.axis === "x") axisVec.set(1, 0, 0);
                else if (animParams.axis === "y") axisVec.set(0, 1, 0);
                else axisVec.set(0, 0, 1);
                const R = new THREE.Quaternion().setFromAxisAngle(
                  axisVec,
                  effSpeedThisFrame
                );
                simObj.quaternion.premultiply(R);
                break;
              case "orbit":
                currentOrbitAngle += effSpeedThisFrame * 0.2;
                const r = animParams.orbitRadius || 5;
                const cX = animParams.orbitCenter?.[0] || 0;
                const cY =
                  animParams.orbitCenter?.[1] !== undefined
                    ? animParams.orbitCenter[1]
                    : simObj.position.y;
                const cZ = animParams.orbitCenter?.[2] || 0;
                const p = animParams.orbitPlane || "xz";
                if (p === "xz")
                  simObj.position.set(
                    cX + Math.cos(currentOrbitAngle) * r,
                    cY,
                    cZ + Math.sin(currentOrbitAngle) * r
                  );
                else if (p === "xy")
                  simObj.position.set(
                    cX + Math.cos(currentOrbitAngle) * r,
                    cY + Math.sin(currentOrbitAngle) * r,
                    cZ
                  );
                else if (p === "yz")
                  simObj.position.set(
                    cX,
                    cY + Math.cos(currentOrbitAngle) * r,
                    cZ + Math.sin(currentOrbitAngle) * r
                  );
                break;
            }
            positions.push(
              simObj.position.x,
              simObj.position.y,
              simObj.position.z
            );
            simObj.quaternion.normalize();
            quaternions.push(
              simObj.quaternion.x,
              simObj.quaternion.y,
              simObj.quaternion.z,
              simObj.quaternion.w
            );
          }
          const posTrack = new THREE.VectorKeyframeTrack(
            `${targetObjectForAnimation.uuid}.position`,
            times,
            positions
          );
          const rotTrack = new THREE.QuaternionKeyframeTrack(
            `${targetObjectForAnimation.uuid}.quaternion`,
            times,
            quaternions
          );
          const clip = new THREE.AnimationClip(
            `Anim_${shapeData.id}_${animParams.type}`,
            totalFrames > 1 ? bakeDur : 0,
            [posTrack, rotTrack]
          );
          allBakedClips.push(clip);
        }
      }
      if (processedShapeCount === 0 && shapes.length > 0) {
        alert("No valid shapes for animated export.");
        setIsBaking(false);
        return;
      }
      exportScene.animations = [...allBakedClips, ...allOriginalClips];
      exportToGLB(exportScene, `baked-animated-model-${Date.now()}.glb`);
      alert(
        `Exported ${processedShapeCount} shapes with ${exportScene.animations.length} clips to GLB!`
      );
    } catch (error) {
      console.error("[BAKED GLB EXPORT] Critical error:", error);
      alert("Animated GLB Export failed: " + error.message);
    } finally {
      setIsBaking(false);
    }
  }, [shapes, loadedGltfObjects, isBaking]);
  const triggerJsonFileImport = useCallback(() => {
    if (jsonFileInputRef.current) jsonFileInputRef.current.click();
  }, []);
  const triggerGlbFileImport = useCallback(() => {
    if (glbFileInputRef.current) glbFileInputRef.current.click();
  }, []);
  const triggerImageFileImport = useCallback(() => {
    if (imageFileInputRef.current) imageFileInputRef.current.click();
  }, []);
  const alignAllShapes = useCallback(
    (axis, method = "average") => {
      if (isBaking || shapes.length < 2) return;
      saveState();
      let newShapes = [...shapes];
      if (method === "average") {
        const sum = shapes.reduce(
          (acc, s) => acc + s.position[{ x: 0, y: 1, z: 2 }[axis]],
          0
        );
        const avg = sum / shapes.length;
        newShapes = shapes.map((s) => ({
          ...s,
          position: s.position.map((p, i) =>
            i === { x: 0, y: 1, z: 2 }[axis] ? avg : p
          ),
        }));
      }
      setShapes(newShapes);
      alert(
        `${
          shapes.length
        } shapes aligned along ${axis.toUpperCase()}-axis (${method}).`
      );
    },
    [shapes, saveState, isBaking]
  );
  const alignSelectedShapeToOrigin = useCallback(
    (axis) => {
      if (!selectedShapeId || isBaking) return;
      const currentShape = shapes.find((s) => s.id === selectedShapeId);
      if (!currentShape) return;
      const newPosition = [...currentShape.position];
      newPosition[{ x: 0, y: 1, z: 2 }[axis]] = 0;
      updateShapeAndSave(selectedShapeId, { position: newPosition });
      alert(`Selected shape aligned to origin on ${axis.toUpperCase()}-axis.`);
    },
    [selectedShapeId, shapes, updateShapeAndSave, isBaking]
  );
  const handleDropOnCanvas = useCallback(
    async (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (isBaking) {
        alert("Cannot process drop while baking.");
        return;
      }
      const files = event.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        const syntheticEvent = { target: { files: [file], value: null } };
        if (
          file.name.toLowerCase().endsWith(".glb") ||
          file.name.toLowerCase().endsWith(".gltf")
        ) {
          handleGlbFileImport(syntheticEvent);
        } else if (file.type.startsWith("image/")) {
          handleImageFileImport(syntheticEvent);
        } else if (file.name.toLowerCase().endsWith(".json")) {
          handleJsonFileImport(syntheticEvent);
        } else {
          alert(`File type of "${file.name}" not recognized.`);
        }
      }
    },
    [isBaking, handleGlbFileImport, handleImageFileImport, handleJsonFileImport]
  );
  const handleForceCanvasRefresh = useCallback(() => {
    setForceCanvasRefreshKey((prevKey) => prevKey + 1);
  }, []);
  const editorSidebarShapeOptions = [
    { name: "Cube", geometry: "box", icon: "🧊" },
    { name: "Sphere", geometry: "sphere", icon: "⚪" },
    { name: "Cylinder", geometry: "cylinder", icon: "🥫" },
    { name: "Cone", geometry: "cone", icon: "🔺" },
    { name: "Torus", geometry: "torus", icon: "🍩" },
    { name: "Pyramid", geometry: "pyramid", icon: "🔺" },
    { name: "3D Text", geometry: "text", icon: "📝" },
  ];
  const toggleGlobalAnimation = useCallback(() => {
    if (isBaking) return;
    setIsAnimating((prev) => !prev);
  }, [isBaking]);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA" ||
        event.target.isContentEditable ||
        isBaking
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
          toggleGlobalAnimation();
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
    isBaking,
    toggleGlobalAnimation,
  ]);
  const handlePlayPauseAnimation = () => {
    if (
      !selectedShape ||
      selectedShape.type !== "importedGLB" ||
      animationClips.length === 0
    )
      return;
    if (!playAllAnimations && selectedAnimationClipIndex < 0) return;
    setAnimationPlaybackState((prev) =>
      prev === "playing" ? "paused" : "playing"
    );
  };
  const handleStopAnimation = () => {
    if (
      !selectedShape ||
      selectedShape.type !== "importedGLB" ||
      animationClips.length === 0
    )
      return;
    setAnimationPlaybackState("stopped");
    setAnimationTime(0);
  };
  const handleAnimationClipChange = (indexStr) => {
    const index = parseInt(indexStr, 10);
    if (index >= 0 && index < animationClips.length) {
      setSelectedAnimationClipIndex(index);
      setAnimationDuration(animationClips[index].duration || 0);
      setAnimationTime(0);
    } else if (index === -1 && playAllAnimations) {
      setSelectedAnimationClipIndex(-1);
      const maxDuration = animationClips.reduce(
        (max, clip) => Math.max(max, clip.duration || 0),
        0
      );
      setAnimationDuration(maxDuration);
      setAnimationTime(0);
    }
  };
  const handleAnimationTimeChange = (newTime) => {
    setAnimationTime(newTime);
  };
  const handleAnimationLoopToggle = (checked) => {
    setIsAnimationLooping(checked);
  };
  const handleAnimationSpeedChange = (speed) => {
    setAnimationPlaybackSpeed(parseFloat(speed) || 1.0);
  };
  const handlePlayAllAnimationsToggle = (checked) => {
    setPlayAllAnimations(checked);
    if (checked) {
      setSelectedAnimationClipIndex(-1);
      const maxDuration = animationClips.reduce(
        (max, clip) => Math.max(max, clip.duration || 0),
        0
      );
      setAnimationDuration(maxDuration);
    } else {
      if (animationClips.length > 0) {
        if (
          selectedAnimationClipIndex < 0 ||
          selectedAnimationClipIndex >= animationClips.length
        ) {
          setSelectedAnimationClipIndex(0);
          setAnimationDuration(animationClips[0].duration || 0);
        } else {
          setAnimationDuration(
            animationClips[selectedAnimationClipIndex].duration || 0
          );
        }
      } else {
        setAnimationDuration(0);
      }
    }
    setAnimationTime(0);
  };
  const handleTextureUpload = useCallback(
    (shapeId, mapTypeStr, event, isTextSpecific = false) => {
      const file = event.target.files[0];
      if (!file) return;
      const currentShape = shapes.find((s) => s.id === shapeId);
      if (!currentShape) return;
      const reader = new FileReader();
      reader.onload = (e_reader) => {
        const newTextureUrl = e_reader.target.result;
        let updatePayload = {};
        if (currentShape.type === "importedGLB") {
          const oldUrl = currentShape.textureProps?.[`${mapTypeStr}Url`];
          if (oldUrl && oldUrl.startsWith("blob:")) {
            URL.revokeObjectURL(oldUrl);
          }
          updatePayload.textureProps = {
            ...(currentShape.textureProps || initialTextureProps),
            [`${mapTypeStr}Url`]: newTextureUrl,
          };
        } else {
          const targetPropsKey = isTextSpecific
            ? "textTextureProps"
            : "textureProps";
          const oldPropValues =
            currentShape[targetPropsKey] || initialTextureProps;
          const oldUrl = oldPropValues[`${mapTypeStr}Url`];
          if (oldUrl && oldUrl.startsWith("blob:")) {
            URL.revokeObjectURL(oldUrl);
          }
          updatePayload[targetPropsKey] = {
            ...oldPropValues,
            [`${mapTypeStr}Url`]: newTextureUrl,
          };
        }
        updateShapeAndSave(shapeId, updatePayload);
      };
      reader.readAsDataURL(file);
      if (event.target) event.target.value = null;
    },
    [shapes, updateShapeAndSave]
  );
  const handleClearTexture = useCallback(
    (shapeId, mapTypeStr, isTextSpecific = false) => {
      const currentShape = shapes.find((s) => s.id === shapeId);
      if (!currentShape) return;
      let updatePayload = {};
      if (currentShape.type === "importedGLB") {
        const oldUrl = currentShape.textureProps?.[`${mapTypeStr}Url`];
        if (oldUrl && oldUrl.startsWith("blob:")) {
          URL.revokeObjectURL(oldUrl);
        }
        updatePayload.textureProps = {
          ...(currentShape.textureProps || initialTextureProps),
          [`${mapTypeStr}Url`]: null,
        };
      } else {
        const targetPropsKey = isTextSpecific
          ? "textTextureProps"
          : "textureProps";
        const oldPropValues =
          currentShape[targetPropsKey] || initialTextureProps;
        const oldUrl = oldPropValues[`${mapTypeStr}Url`];
        if (oldUrl && oldUrl.startsWith("blob:")) {
          URL.revokeObjectURL(oldUrl);
        }
        updatePayload[targetPropsKey] = {
          ...oldPropValues,
          [`${mapTypeStr}Url`]: null,
        };
      }
      updateShapeAndSave(shapeId, updatePayload);
    },
    [shapes, updateShapeAndSave]
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && activeMobilePanel) {
        setActiveMobilePanel(null);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeMobilePanel]);
  useEffect(() => {
    if (activeMobilePanel) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeMobilePanel]);
  useEffect(() => {
    if (selectedShape && selectedShape.type === "importedGLB") {
      const gltfData = loadedGltfObjects[selectedShape.id];
      if (gltfData && gltfData.animations && gltfData.animations.length > 0) {
        setAnimationClips(gltfData.animations);
        if (
          selectedAnimationClipIndex === -1 ||
          selectedAnimationClipIndex >= gltfData.animations.length
        ) {
          setSelectedAnimationClipIndex(0);
        }
        setAnimationDuration(
          gltfData.animations[
            selectedAnimationClipIndex >= 0 ? selectedAnimationClipIndex : 0
          ]?.duration || 0
        );
      } else {
        setAnimationClips([]);
        setSelectedAnimationClipIndex(-1);
        setAnimationDuration(0);
      }
    } else {
      setAnimationClips([]);
      setSelectedAnimationClipIndex(-1);
      setAnimationDuration(0);
    }
  }, [selectedShape, loadedGltfObjects, selectedAnimationClipIndex]);
  const showAnimationBar =
    selectedShape &&
    selectedShape.type === "importedGLB" &&
    animationClips &&
    animationClips.length > 0;

  if (!R3FCanvasCheck) return <FallbackCreator />;

  return (
    <TooltipProvider>
      <div
        ref={creatorWrapperRef}
        className={cn(
          "flex flex-col h-[100svh] overflow-hidden",
          "bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 text-slate-100 select-none",
          isBaking ? "opacity-50 pointer-events-none" : ""
        )}
      >
        <input
          type='file'
          accept='.json'
          ref={jsonFileInputRef}
          onChange={handleJsonFileImport}
          style={{ display: "none" }}
        />
        <input
          type='file'
          accept='.glb,.gltf'
          ref={glbFileInputRef}
          onChange={handleGlbFileImport}
          style={{ display: "none" }}
        />
        <input
          type='file'
          accept='image/*'
          ref={imageFileInputRef}
          onChange={handleImageFileImport}
          style={{ display: "none" }}
        />
        {Object.keys(initialTextureProps).map((mapTypeKey) => {
          const mapType = mapTypeKey.replace("Url", "");
          return (
            <input
              key={`shape-tex-input-${mapType}`}
              type='file'
              accept='image/*'
              ref={(el) => (shapeTextureFileInputRefs.current[mapType] = el)}
              onChange={(e) =>
                selectedShapeId &&
                handleTextureUpload(selectedShapeId, mapType, e, false)
              }
              style={{ display: "none" }}
            />
          );
        })}
        {Object.keys(initialTextureProps).map((mapTypeKey) => {
          const mapType = mapTypeKey.replace("Url", "");
          return (
            (mapType === "map" || mapType === "normalMap") && (
              <input
                key={`text-tex-input-${mapType}`}
                type='file'
                accept='image/*'
                ref={(el) => (textTextureFileInputRefs.current[mapType] = el)}
                onChange={(e) =>
                  selectedShapeId &&
                  handleTextureUpload(selectedShapeId, mapType, e, true)
                }
                style={{ display: "none" }}
              />
            )
          );
        })}

        {isBaking && (
          <div className='fixed inset-0 bg-black/80 flex items-center justify-center z-[100] backdrop-blur-sm'>
            {" "}
            <div className='text-slate-100 text-xl p-6 bg-slate-800 rounded-lg shadow-2xl flex items-center ring-1 ring-purple-500/50'>
              {" "}
              <svg
                className='animate-spin h-6 w-6 text-purple-400 mr-3'
                viewBox='0 0 24 24'
              >
                {" "}
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>{" "}
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>{" "}
              </svg>{" "}
              Baking GLB... Please Wait{" "}
            </div>{" "}
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
          triggerGlbFileImport={triggerGlbFileImport}
          triggerImageFileImport={triggerImageFileImport}
          alignAllShapes={alignAllShapes}
          alignSelectedShapeToOrigin={alignSelectedShapeToOrigin}
          selectedShapeId={selectedShapeId}
          shapesCount={shapes.length}
          isAnimating={isAnimating}
          toggleGlobalAnimation={toggleGlobalAnimation}
          isBaking={isBaking}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
          toggleLeftSidebar={() => toggleMobilePanel("left")}
          toggleRightSidebar={() => toggleMobilePanel("right")}
          isLeftSidebarOpen={activeMobilePanel === "left"}
          isRightSidebarOpen={activeMobilePanel === "right"}
          forceRefreshCanvas={handleForceCanvasRefresh}
        />

        {/* Main layout area - This div will take all space between toolbar and statusbar */}
        <div
          className={cn(
            "flex flex-1 min-h-0 relative overflow-hidden md:p-4 md:pt-0"
          )}
        >
          {/* Left Sidebar */}
          <aside
            className={cn(
              "transition-transform duration-300 ease-in-out fixed md:static inset-y-0 left-0 z-40 transform md:translate-x-0 w-72 shrink-0 md:mr-4",
              activeMobilePanel === "left"
                ? "translate-x-0 shadow-2xl"
                : "-translate-x-full"
            )}
          >
            <div className='h-full w-full bg-slate-900/95 md:bg-transparent md:border-r md:border-slate-700/30 backdrop-blur-md md:backdrop-blur-none overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800'>
              <EditorSidebar
                mode={mode}
                setMode={setMode}
                addShape={addShape}
                setCameraView={setCameraView}
                shapeOptions={editorSidebarShapeOptions}
              />
            </div>
            <Button
              variant='ghost'
              size='icon'
              className={cn(
                "absolute top-2 right-2 md:hidden text-slate-400 hover:text-slate-100 hover:bg-slate-700/50",
                activeMobilePanel === "left" ? "block" : "hidden"
              )}
              onClick={() => setActiveMobilePanel(null)}
              aria-label='Close left panel'
            >
              <CloseIcon size={20} />
            </Button>
          </aside>

          {/* Center Content Column (Canvas + Animation Bar) */}
          <div
            className={cn(
              "flex-1 flex flex-col min-w-0 min-h-0",
              "transition-all duration-300 ease-in-out",
              activeMobilePanel === "left" && "ml-72 md:ml-0",
              activeMobilePanel === "right" && "mr-72 md:mr-0"
            )}
          >
            <div className='flex-1 relative min-h-0 md:rounded-lg overflow-hidden bg-slate-800/10 md:bg-transparent'>
              <CanvasView
                key={forceCanvasRefreshKey}
                shapes={shapes}
                loadedGltfObjects={loadedGltfObjects}
                selectedShapeId={selectedShapeId}
                mode={mode}
                onShapeClick={handleShapeClick}
                onShapeUpdate={handleShapeUpdateFromTransformControls}
                orbitControlsEnabled={
                  !isBaking &&
                  (!isAnimating ||
                    !selectedShape?.animation ||
                    selectedShape.animation.type === "none" ||
                    (selectedShape?.type === "importedGLB" &&
                      animationPlaybackState !== "playing"))
                }
                sceneRef={sceneRef}
                cameraPreset={cameraPreset}
                selectedShape={selectedShape}
                setSelectedShapeId={setSelectedShapeId}
                SceneComponent={MainScene}
                CameraControllerComponent={CameraController}
                isAnimating={isAnimating}
                onDropOnCanvas={handleDropOnCanvas}
                animationClips={animationClips}
                selectedAnimationClipIndex={selectedAnimationClipIndex}
                animationPlaybackState={animationPlaybackState}
                isAnimationLooping={isAnimationLooping}
                animationPlaybackSpeed={animationPlaybackSpeed}
                animationTime={animationTime}
                playAllAnimations={playAllAnimations}
              />
            </div>
            {showAnimationBar && (
              <div className='shrink-0 md:mt-4 md:rounded-lg overflow-hidden md:shadow-xl'>
                <AnimationPlaybackBar
                  animationClips={animationClips}
                  selectedAnimationClipIndex={selectedAnimationClipIndex}
                  onAnimationClipChange={handleAnimationClipChange}
                  animationPlaybackState={animationPlaybackState}
                  onPlayPauseAnimation={handlePlayPauseAnimation}
                  onStopAnimation={handleStopAnimation}
                  isAnimationLooping={isAnimationLooping}
                  onAnimationLoopToggle={handleAnimationLoopToggle}
                  animationTime={animationTime}
                  onAnimationTimeChange={handleAnimationTimeChange}
                  animationDuration={animationDuration}
                  animationPlaybackSpeed={animationPlaybackSpeed}
                  onAnimationSpeedChange={handleAnimationSpeedChange}
                  playAllAnimations={playAllAnimations}
                  onPlayAllAnimationsToggle={handlePlayAllAnimationsToggle}
                />
              </div>
            )}
          </div>

          <aside
            className={cn(
              "transition-transform duration-300 ease-in-out fixed md:static inset-y-0 right-0 z-40 transform md:translate-x-0 w-72 shrink-0 md:ml-4",
              activeMobilePanel === "right"
                ? "translate-x-0 shadow-2xl"
                : "translate-x-full"
            )}
          >
            <div className='h-full w-full bg-slate-900/95 md:bg-transparent md:border-l md:border-slate-700/30 backdrop-blur-md md:backdrop-blur-none overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800'>
              <PropertiesPanel
                selectedShape={selectedShape}
                updateShape={updateShapeAndSave}
                removeShape={removeShape}
                duplicateShape={duplicateShape}
                addShape={addShape}
                handleTextureUpload={handleTextureUpload}
                handleClearTexture={handleClearTexture}
                shapeTextureFileInputRefs={shapeTextureFileInputRefs}
                textTextureFileInputRefs={textTextureFileInputRefs}
                forceRefreshCanvas={handleForceCanvasRefresh}
              />
            </div>
            <Button
              variant='ghost'
              size='icon'
              className={cn(
                "absolute top-2 left-3 md:hidden text-slate-400 hover:text-slate-100 hover:bg-slate-700/50",
                activeMobilePanel === "right" ? "block" : "hidden"
              )}
              onClick={() => setActiveMobilePanel(null)}
              aria-label='Close right panel'
            >
              <CloseIcon size={20} />
            </Button>
          </aside>
        </div>
        <StatusBar shapesCount={shapes.length} selectedShape={selectedShape} />
      </div>
    </TooltipProvider>
  );
}
