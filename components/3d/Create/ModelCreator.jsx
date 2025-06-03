import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  Suspense,
  // useLayoutEffect, // Not strictly needed in Model3DCreator.jsx directly
} from "react";
import * as THREE from "three";

// Import JSM modules directly from three/examples/jsm
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry as ThreeTextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { TextureLoader as ThreeTextureLoader } from "three/src/loaders/TextureLoader.js";

// UI Components
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { PanelLeft, PanelRight, X as CloseIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectPortal,
} from "@/components/ui/select";

// Local Application Components (ensure paths are correct)
import PropertiesPanel from "./PropertiesPanel";
import EditorSidebar from "./EditorSidebar";
import EditorToolbar from "./EditorToolbar";
import CanvasView from "./CanvasView";
import StatusBar from "./StatusBar";
import FallbackCreator from "./FallbackCreator";
import AnimationPlaybackBar from "./AnimationPlaybackBar";

// Scene Element Logic (ensure paths are correct)
import {
  MainScene,
  CameraController,
  createMeshFromShape, // This is crucial. Assuming it's well-defined in SceneElements.jsx
  exportToGLB as sceneExportToGLB, // Renamed to avoid conflict with local exportToGLB if any
} from "./SceneElements";
import { cn } from "@/lib/utils"; // Utility for class names

// --- Helper functions and constants ---
let R3FCanvasCheck;
try {
  const r3f = require("@react-three/fiber");
  R3FCanvasCheck = r3f.Canvas;
} catch (error) {
  console.warn(
    "Model3DCreator: @react-three/fiber not available, using fallback."
  );
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
    dracoLoader.setDecoderPath("/draco/gltf/"); // Ensure this path points to your draco decoder files in /public
    gltfLoaderInstance.setDRACOLoader(dracoLoader);
  }
  return gltfLoaderInstance;
};

const MAX_PLANE_DIMENSION = 5;
const DEFAULT_EXPORT_FONT_PATH = "/fonts/helvetiker_regular.typeface.json"; // Ensure this path is correct
let helvetikerFontForExport = null;
const exportFontLoaderInstance = new FontLoader();

if (typeof window !== "undefined" && !helvetikerFontForExport) {
  exportFontLoaderInstance.load(
    DEFAULT_EXPORT_FONT_PATH,
    (font) => {
      helvetikerFontForExport = font;
      // console.log("Model3DCreator: Default EXPORT font pre-loaded.");
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
  roughness: 0.5,
  metalness: 0.0,
  aoMapIntensity: 1.0,
  emissiveColor: "#000000",
  emissiveIntensity: 1.0,
  transmission: 0.0,
  ior: 1.5,
  thickness: 0.01,
  clearcoat: 0.0,
  clearcoatRoughness: 0.0,
  sheen: 0.0,
  sheenColor: "#ffffff",
  sheenRoughness: 0.0,
  specularIntensity: 1.0,
  specularColor: "#ffffff",
  shininess: 30,
};

const textureLoaderForGLB = new ThreeTextureLoader(); // For applyTextureToGLBNode

const applyTextureToGLBNode = (
  node,
  mapType,
  textureUrl,
  materialOverrideConfig,
  callback
) => {
  if (node.isMesh && node.material) {
    const materials = Array.isArray(node.material)
      ? node.material
      : [node.material];
    let appliedOverall = false;

    materials.forEach((originalMaterial, index) => {
      let targetMaterial = originalMaterial;
      let materialWasReplacedThisCall = false;

      if (!originalMaterial.userData) originalMaterial.userData = {};
      if (
        !originalMaterial.userData.originalMaterialInstance &&
        originalMaterial.isMaterial
      ) {
        if (!originalMaterial.userData.isOverride) {
          originalMaterial.userData.originalMaterialInstance =
            originalMaterial.clone();
          originalMaterial.userData.originalMaterialInstance.name =
            originalMaterial.name + "_original_stored";
        }
      }
      if (!originalMaterial.userData.originalName) {
        originalMaterial.userData.originalName =
          originalMaterial.name || `glb_material_${node.uuid}_${index}`;
      }

      if (materialOverrideConfig && materialOverrideConfig.type !== "model") {
        let newMaterialInstance;
        let MtlCtor;
        switch (materialOverrideConfig.type) {
          case "physical":
            MtlCtor = THREE.MeshPhysicalMaterial;
            break;
          case "toon":
            MtlCtor = THREE.MeshToonMaterial;
            break;
          case "basic":
            MtlCtor = THREE.MeshBasicMaterial;
            break;
          case "lambert":
            MtlCtor = THREE.MeshLambertMaterial;
            break;
          case "phong":
            MtlCtor = THREE.MeshPhongMaterial;
            break;
          case "wireframe":
            MtlCtor = THREE.MeshBasicMaterial;
            break;
          default:
            MtlCtor = THREE.MeshStandardMaterial;
            break;
        }

        if (
          targetMaterial instanceof MtlCtor &&
          targetMaterial.userData?.isOverride
        ) {
          newMaterialInstance = targetMaterial;
        } else {
          newMaterialInstance = new MtlCtor();
          materialWasReplacedThisCall = true;
        }

        newMaterialInstance.color.set(
          new THREE.Color(
            materialOverrideConfig.color || originalMaterial.color || "#cccccc"
          )
        );
        newMaterialInstance.side = THREE.DoubleSide;
        newMaterialInstance.name =
          `${originalMaterial.userData.originalName}_override_${materialOverrideConfig.type}`.substring(
            0,
            250
          );
        newMaterialInstance.userData.isOverride = true;
        newMaterialInstance.userData.originalName =
          originalMaterial.userData.originalName;

        if (
          materialOverrideConfig.type === "standard" ||
          materialOverrideConfig.type === "physical"
        ) {
          newMaterialInstance.roughness =
            materialOverrideConfig.roughness ?? 0.5;
          newMaterialInstance.metalness =
            materialOverrideConfig.metalness ?? 0.0;
        }
        if (materialOverrideConfig.type === "physical") {
          newMaterialInstance.transmission =
            materialOverrideConfig.transmission ?? 0.0;
          newMaterialInstance.ior = materialOverrideConfig.ior ?? 1.5;
          newMaterialInstance.thickness =
            materialOverrideConfig.thickness ?? 0.01;
          if (materialOverrideConfig.clearcoat !== undefined)
            newMaterialInstance.clearcoat = materialOverrideConfig.clearcoat;
          if (materialOverrideConfig.clearcoatRoughness !== undefined)
            newMaterialInstance.clearcoatRoughness =
              materialOverrideConfig.clearcoatRoughness;
        }
        if (materialOverrideConfig.type === "phong") {
          newMaterialInstance.shininess =
            materialOverrideConfig.shininess ?? 30;
        }
        if (materialOverrideConfig.type === "wireframe") {
          newMaterialInstance.wireframe = true;
        } else if (newMaterialInstance.hasOwnProperty("wireframe")) {
          newMaterialInstance.wireframe = false;
        }

        if (materialWasReplacedThisCall) {
          if (
            originalMaterial.isMaterial &&
            originalMaterial !== newMaterialInstance &&
            originalMaterial.userData.isOverride
          ) {
            originalMaterial.dispose();
          }
          if (Array.isArray(node.material)) {
            node.material[index] = newMaterialInstance;
          } else {
            node.material = newMaterialInstance;
          }
        }
        targetMaterial = newMaterialInstance;
        appliedOverall = true;
      } else if (
        materialOverrideConfig &&
        materialOverrideConfig.type === "model" &&
        targetMaterial.userData?.isOverride
      ) {
        let restoredMaterial = targetMaterial.userData.originalMaterialInstance;
        if (restoredMaterial && restoredMaterial.isMaterial) {
          if (restoredMaterial.uuid === targetMaterial.uuid) {
            restoredMaterial = restoredMaterial.clone();
          }
        } else {
          restoredMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(
              originalMaterial.userData.originalMaterialInstance?.color ||
                "#cccccc"
            ),
            name: originalMaterial.userData.originalName,
          });
        }
        restoredMaterial.userData.isOverride = false;

        if (targetMaterial.isMaterial) targetMaterial.dispose();

        if (Array.isArray(node.material)) {
          node.material[index] = restoredMaterial;
        } else {
          node.material = restoredMaterial;
        }
        targetMaterial = restoredMaterial;
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
        const loadAndApply = (texUrl, mapProperty) => {
          const isColorDataMap =
            mapProperty === "map" || mapProperty === "emissiveMap";
          if (texUrl) {
            if (
              targetMaterial[mapProperty] &&
              targetMaterial[mapProperty].isTexture
            ) {
              targetMaterial[mapProperty].dispose();
            }
            textureLoaderForGLB.load(
              texUrl,
              (texture) => {
                texture.colorSpace = isColorDataMap
                  ? THREE.SRGBColorSpace
                  : THREE.LinearSRGBColorSpace;
                texture.flipY = false;
                texture.needsUpdate = true;
                targetMaterial[mapProperty] = texture;

                if (
                  mapProperty === "map" &&
                  (targetMaterial.isMeshStandardMaterial ||
                    targetMaterial.isMeshPhysicalMaterial)
                ) {
                  targetMaterial.color.set(0xffffff);
                }
                if (
                  mapProperty === "aoMap" &&
                  (targetMaterial.isMeshStandardMaterial ||
                    targetMaterial.isMeshPhysicalMaterial) &&
                  node.geometry &&
                  !node.geometry.attributes.uv2 &&
                  node.geometry.attributes.uv
                ) {
                  node.geometry.setAttribute(
                    "uv2",
                    node.geometry.attributes.uv.clone()
                  );
                }
                if (
                  mapProperty === "emissiveMap" &&
                  (targetMaterial.isMeshStandardMaterial ||
                    targetMaterial.isMeshPhysicalMaterial)
                ) {
                  targetMaterial.emissive = new THREE.Color(
                    materialOverrideConfig?.emissiveColor || 0xffffff
                  );
                  targetMaterial.emissiveIntensity =
                    materialOverrideConfig?.emissiveIntensity ?? 1.0;
                }
                targetMaterial.needsUpdate = true;
                appliedOverall = true;
                if (callback) callback(true, mapProperty);
              },
              undefined,
              (err) => {
                console.error(
                  `Error loading ${mapProperty} for GLB:`,
                  texUrl,
                  err
                );
                if (callback) callback(false, mapProperty);
              }
            );
          } else {
            if (
              targetMaterial[mapProperty] &&
              targetMaterial[mapProperty].isTexture
            ) {
              targetMaterial[mapProperty].dispose();
            }
            targetMaterial[mapProperty] = null;
            if (
              mapProperty === "map" &&
              (targetMaterial.isMeshStandardMaterial ||
                targetMaterial.isMeshPhysicalMaterial)
            ) {
              targetMaterial.color.set(
                new THREE.Color(
                  materialOverrideConfig?.color ||
                    targetMaterial.userData.originalMaterialInstance?.color ||
                    "#cccccc"
                )
              );
            }
            if (
              mapProperty === "emissiveMap" &&
              (targetMaterial.isMeshStandardMaterial ||
                targetMaterial.isMeshPhysicalMaterial)
            ) {
              targetMaterial.emissive = new THREE.Color(
                materialOverrideConfig?.emissiveColor || 0x000000
              );
              targetMaterial.emissiveIntensity =
                materialOverrideConfig?.emissiveIntensity ?? 1.0;
            }
            targetMaterial.needsUpdate = true;
            appliedOverall = true;
            if (callback) callback(true, mapProperty);
          }
        };

        const validMapTypesForStandardPhysical = [
          "map",
          "normalMap",
          "roughnessMap",
          "metalnessMap",
          "aoMap",
          "emissiveMap",
        ];
        const validMapTypesForOther = ["map", "normalMap"];

        if (
          (targetMaterial.isMeshStandardMaterial ||
            targetMaterial.isMeshPhysicalMaterial) &&
          validMapTypesForStandardPhysical.includes(mapType)
        ) {
          loadAndApply(textureUrl, mapType);
        } else if (
          !(
            targetMaterial.isMeshStandardMaterial ||
            targetMaterial.isMeshPhysicalMaterial
          ) &&
          validMapTypesForOther.includes(mapType)
        ) {
          loadAndApply(textureUrl, mapType);
        } else if (materialWasReplacedThisCall && callback) {
          if (callback)
            callback(true, "material_override_only_no_texture_for_maptype");
        } else if (callback) {
          if (callback) callback(false, `map_type_${mapType}_not_supported`);
        }
      } else if (materialWasReplacedThisCall && callback) {
        callback(true, "material_override_only");
      } else if (callback && mapType) {
        callback(false, `texture_application_failed_for_${mapType}`);
      }
    });
    return appliedOverall;
  }
  if (mapType && callback)
    callback(false, `node_not_mesh_or_no_material_for_${mapType}`);
  return false;
};

export default function Model3DCreator() {
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
  const [animationTime, setAnimationTime] = useState(0); // Normalized 0-1 or absolute
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

  const toggleFullscreen = useCallback(async () => {
    if (!creatorWrapperRef.current) return;
    if (!document.fullscreenElement) {
      try {
        await creatorWrapperRef.current.requestFullscreen();
      } catch (err) {
        console.error("Fullscreen request failed:", err.message, err.name);
      }
    } else {
      if (document.exitFullscreen) {
        try {
          await document.exitFullscreen();
        } catch (err) {
          console.error("Exit fullscreen failed:", err.message, err.name);
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
        name:
          options.name ||
          geometryType.charAt(0).toUpperCase() + geometryType.slice(1),
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
        transmission: 0.0,
        ior: 1.5,
        thickness: 0.01,
        shininess: 30,
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
                  material: s.material || "standard",
                  color:
                    s.color ||
                    `#${Math.floor(Math.random() * 16777215)
                      .toString(16)
                      .padStart(6, "0")}`,
                  roughness: s.roughness !== undefined ? s.roughness : 0.5,
                  metalness: s.metalness !== undefined ? s.metalness : 0.0,
                  transmission:
                    s.transmission !== undefined ? s.transmission : 0.0,
                  ior: s.ior !== undefined ? s.ior : 1.5,
                  thickness: s.thickness !== undefined ? s.thickness : 0.01,
                  shininess: s.shininess !== undefined ? s.shininess : 30,
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
              );
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
        alert("Please select a valid image file (e.g., PNG, JPG).");
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
                  if (node.isMesh && node.material) {
                    if (
                      updates.hasOwnProperty("glbMaterialOverride") ||
                      updates.hasOwnProperty("textureProps")
                    ) {
                      applyTextureToGLBNode(
                        node,
                        null,
                        undefined,
                        newShape.glbMaterialOverride,
                        () => {}
                      );
                    }
                    if (
                      newShape.textureProps &&
                      (updates.hasOwnProperty("textureProps") ||
                        updates.hasOwnProperty("glbMaterialOverride"))
                    ) {
                      Object.keys(newShape.textureProps)
                        .filter((k) => k.endsWith("Url"))
                        .forEach((mapUrlKey) => {
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
          if (node.isMesh && node.material) {
            applyTextureToGLBNode(
              node,
              null,
              undefined,
              duplicatedShapeData.glbMaterialOverride,
              () => {}
            );
            if (duplicatedShapeData.textureProps) {
              Object.keys(duplicatedShapeData.textureProps)
                .filter((k) => k.endsWith("Url"))
                .forEach((mapUrlKey) => {
                  const mapType = mapUrlKey.replace("Url", "");
                  const url = duplicatedShapeData.textureProps[mapUrlKey];
                  applyTextureToGLBNode(
                    node,
                    mapType,
                    url,
                    duplicatedShapeData.glbMaterialOverride,
                    () => {}
                  );
                });
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
    (shapeId, event) => {
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
        updateShape(shapeIdToUpdate, newUpdates);
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
          updateShape(shapeIdToUpdate, newUpdates);
        } else {
          // console.warn(`TransformControls target "${objectName}" or prefix "${simplerObjectName}" not found in scene.`);
        }
      }
    },
    [shapes, updateShape, isBaking]
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
            if (node.isMesh && node.material) {
              applyTextureToGLBNode(
                node,
                null,
                undefined,
                shape.glbMaterialOverride,
                () => {}
              );
              if (shape.textureProps) {
                Object.keys(shape.textureProps)
                  .filter((k) => k.endsWith("Url"))
                  .forEach((mapUrlKey) => {
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
            if (node.isMesh && node.material) {
              applyTextureToGLBNode(
                node,
                null,
                undefined,
                shape.glbMaterialOverride,
                () => {}
              );
              if (shape.textureProps) {
                Object.keys(shape.textureProps)
                  .filter((k) => k.endsWith("Url"))
                  .forEach((mapUrlKey) => {
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
          material: s.material,
          color: s.color,
          roughness: s.roughness,
          metalness: s.metalness,
          transmission: s.transmission,
          ior: s.ior,
          thickness: s.thickness,
          shininess: s.shininess,
        };
        if (s.type === "text")
          return {
            ...baseShape,
            text: s.text,
            textSize: s.textSize,
            extrudeDepth: s.extrudeDepth,
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
        return baseShape;
      });
      const sceneData = {
        metadata: {
          version: "3.0.0-z-axis-fix",
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

      const textureLoaderForExport = new ThreeTextureLoader();
      const loadTextureAsync = (url, isColorData = false) =>
        new Promise((resolve) => {
          if (!url || typeof url !== "string" || url.trim() === "") {
            resolve(null);
            return;
          }
          textureLoaderForExport.load(
            url,
            (texture) => {
              texture.colorSpace = isColorData
                ? THREE.SRGBColorSpace
                : THREE.LinearSRGBColorSpace;
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
              shapeData.glbMaterialOverride ||
              (shapeData.textureProps &&
                Object.values(shapeData.textureProps).some(
                  (v) =>
                    v &&
                    typeof v === "string" /* && v.startsWith("data:image") */
                ))
            ) {
              // Removed data:image check for broader URL support
              await modelClone.traverse(async (node) => {
                if (node.isMesh && node.material) {
                  const originalMaterials = Array.isArray(node.material)
                    ? node.material
                    : [node.material];
                  const newMaterials = [];
                  for (let i = 0; i < originalMaterials.length; i++) {
                    const matInstance = originalMaterials[i];
                    let newMaterialInstance;
                    const overrideConf = shapeData.glbMaterialOverride;
                    if (overrideConf && overrideConf.type !== "model") {
                      const newMaterialProps = {
                        color: new THREE.Color(
                          overrideConf.color || matInstance.color || "#cccccc"
                        ),
                        side: THREE.DoubleSide,
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
                      let NewCtor;
                      switch (overrideConf.type) {
                        case "physical":
                          NewCtor = THREE.MeshPhysicalMaterial;
                          newMaterialProps.transmission =
                            overrideConf.transmission ?? 0.0;
                          newMaterialProps.ior = overrideConf.ior ?? 1.5;
                          newMaterialProps.thickness =
                            overrideConf.thickness ?? 0.01;
                          break;
                        case "toon":
                          NewCtor = THREE.MeshToonMaterial;
                          break;
                        case "basic":
                          NewCtor = THREE.MeshBasicMaterial;
                          break;
                        case "lambert":
                          NewCtor = THREE.MeshLambertMaterial;
                          break;
                        case "phong":
                          NewCtor = THREE.MeshPhongMaterial;
                          newMaterialProps.shininess =
                            overrideConf.shininess ?? 30;
                          break;
                        case "wireframe":
                          NewCtor = THREE.MeshBasicMaterial;
                          newMaterialProps.wireframe = true;
                          break;
                        default:
                          NewCtor = THREE.MeshStandardMaterial;
                      }
                      newMaterialInstance = new NewCtor(newMaterialProps);
                      newMaterialInstance.name =
                        (matInstance.name || `glb_mat_export_${i}`) +
                        `_override_${overrideConf.type}`;
                    } else {
                      newMaterialInstance = matInstance.clone();
                    }
                    if (shapeData.textureProps) {
                      if (shapeData.textureProps.mapUrl) {
                        newMaterialInstance.map = await loadTextureAsync(
                          shapeData.textureProps.mapUrl,
                          true
                        );
                        if (newMaterialInstance.map)
                          newMaterialInstance.color.set(0xffffff);
                      }
                      if (
                        shapeData.textureProps.normalMapUrl &&
                        newMaterialInstance.normalMap !== undefined
                      )
                        newMaterialInstance.normalMap = await loadTextureAsync(
                          shapeData.textureProps.normalMapUrl,
                          false
                        );
                      if (
                        shapeData.textureProps.roughnessMapUrl &&
                        newMaterialInstance.roughnessMap !== undefined
                      )
                        newMaterialInstance.roughnessMap =
                          await loadTextureAsync(
                            shapeData.textureProps.roughnessMapUrl,
                            false
                          );
                      if (
                        shapeData.textureProps.metalnessMapUrl &&
                        newMaterialInstance.metalnessMap !== undefined
                      )
                        newMaterialInstance.metalnessMap =
                          await loadTextureAsync(
                            shapeData.textureProps.metalnessMapUrl,
                            false
                          );
                      if (
                        shapeData.textureProps.aoMapUrl &&
                        newMaterialInstance.aoMap !== undefined
                      ) {
                        newMaterialInstance.aoMap = await loadTextureAsync(
                          shapeData.textureProps.aoMapUrl,
                          false
                        );
                        if (newMaterialInstance.aoMap) {
                          newMaterialInstance.aoMapIntensity =
                            shapeData.textureProps.aoMapIntensity ?? 1.0;
                          if (
                            node.geometry &&
                            !node.geometry.attributes.uv2 &&
                            node.geometry.attributes.uv
                          ) {
                            node.geometry.setAttribute(
                              "uv2",
                              node.geometry.attributes.uv.clone()
                            );
                          }
                        }
                      }
                      if (
                        shapeData.textureProps.emissiveMapUrl &&
                        newMaterialInstance.emissiveMap !== undefined
                      ) {
                        newMaterialInstance.emissiveMap =
                          await loadTextureAsync(
                            shapeData.textureProps.emissiveMapUrl,
                            true
                          );
                        if (newMaterialInstance.emissiveMap) {
                          newMaterialInstance.emissive = new THREE.Color(
                            shapeData.textureProps.emissiveColor || 0xffffff
                          );
                          newMaterialInstance.emissiveIntensity =
                            shapeData.textureProps.emissiveIntensity ?? 1.0;
                        }
                      }
                      if (
                        newMaterialInstance.hasOwnProperty("roughness") &&
                        !newMaterialInstance.roughnessMap &&
                        shapeData.textureProps.roughness !== undefined
                      )
                        newMaterialInstance.roughness =
                          shapeData.textureProps.roughness;
                      if (
                        newMaterialInstance.hasOwnProperty("metalness") &&
                        !newMaterialInstance.metalnessMap &&
                        shapeData.textureProps.metalness !== undefined
                      )
                        newMaterialInstance.metalness =
                          shapeData.textureProps.metalness;
                    }
                    newMaterialInstance.needsUpdate = true;
                    newMaterials.push(newMaterialInstance);
                  }
                  node.material =
                    newMaterials.length === 1 ? newMaterials[0] : newMaterials;
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
              console.error("Text export: Font load failed", e);
              return null;
            }
          }

          const tS = saneNumber(shapeData.textSize, 0.5);
          const tD = saneNumber(shapeData.extrudeDepth, 0.2);
          const textGeo = new ThreeTextGeometry(shapeData.text || "3D", {
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
            isFinite(actualZDepth)
          ) {
            zScaleFactor = expectedZDepth / actualZDepth;
          } else if (expectedZDepth === 0 && actualZDepth === 0) {
            zScaleFactor = 1.0;
          } else if (actualZDepth === 0 && expectedZDepth !== 0) {
            console.warn(
              "TextGeometry created with zero depth for export, scaling might be odd."
            );
          }
          if (
            Math.abs(zScaleFactor - 1.0) > 0.0001 &&
            isFinite(zScaleFactor) &&
            zScaleFactor > 0
          ) {
            textGeo.scale(1, 1, zScaleFactor);
          }

          textGeo.computeBoundingBox();
          const centerOffsetX =
            -0.5 * (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x);
          const centerOffsetY =
            -0.5 * (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y);
          textGeo.translate(centerOffsetX, centerOffsetY, 0);

          const materialProps = {
            color: new THREE.Color(shapeData.color || "#ffffff"),
            side: THREE.DoubleSide,
          };
          if (
            shapeData.material === "standard" ||
            shapeData.material === "physical"
          ) {
            materialProps.roughness = saneNumber(shapeData.roughness, 0.5);
            materialProps.metalness = saneNumber(shapeData.metalness, 0.0);
          }
          let material;
          switch (shapeData.material) {
            case "physical":
              material = new THREE.MeshPhysicalMaterial({
                ...materialProps,
                transmission: saneNumber(shapeData.transmission, 0.0),
                ior: saneNumber(shapeData.ior, 1.5),
                thickness: saneNumber(shapeData.thickness, 0.01),
              });
              break;
            default:
              material = new THREE.MeshStandardMaterial(materialProps);
          }
          const texProps =
            shapeData.textTextureProps ||
            shapeData.textureProps ||
            initialTextureProps;
          if (texProps.mapUrl) {
            material.map = await loadTextureAsync(texProps.mapUrl, true);
            if (material.map) material.color.set(0xffffff);
          }
          if (texProps.normalMapUrl && material.normalMap !== undefined)
            material.normalMap = await loadTextureAsync(
              texProps.normalMapUrl,
              false
            );
          mesh = new THREE.Mesh(textGeo, material);
        } else {
          // Assuming createMeshFromShape is defined elsewhere (e.g., SceneElements.jsx) and available in scope
          mesh = await createMeshFromShape(shapeData);
          if (
            mesh &&
            shapeData.textureProps &&
            shapeData.type !== "imagePlane"
          ) {
            const newMaterial = mesh.material.clone();
            const texProps = shapeData.textureProps;
            let colorSetByMap = false;
            if (texProps.mapUrl) {
              newMaterial.map = await loadTextureAsync(texProps.mapUrl, true);
              if (newMaterial.map) {
                newMaterial.color.set(0xffffff);
                colorSetByMap = true;
              }
            }
            if (texProps.normalMapUrl && newMaterial.normalMap !== undefined)
              newMaterial.normalMap = await loadTextureAsync(
                texProps.normalMapUrl,
                false
              );
            if (
              texProps.roughnessMapUrl &&
              newMaterial.roughnessMap !== undefined
            )
              newMaterial.roughnessMap = await loadTextureAsync(
                texProps.roughnessMapUrl,
                false
              );
            if (
              texProps.metalnessMapUrl &&
              newMaterial.metalnessMap !== undefined
            )
              newMaterial.metalnessMap = await loadTextureAsync(
                texProps.metalnessMapUrl,
                false
              );
            if (texProps.aoMapUrl && newMaterial.aoMap !== undefined) {
              newMaterial.aoMap = await loadTextureAsync(
                texProps.aoMapUrl,
                false
              );
              if (newMaterial.aoMap) {
                newMaterial.aoMapIntensity = texProps.aoMapIntensity ?? 1.0;
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
            if (
              texProps.emissiveMapUrl &&
              newMaterial.emissiveMap !== undefined
            ) {
              newMaterial.emissiveMap = await loadTextureAsync(
                texProps.emissiveMapUrl,
                true
              );
              if (newMaterial.emissiveMap) {
                newMaterial.emissive = new THREE.Color(
                  texProps.emissiveColor || 0xffffff
                );
                newMaterial.emissiveIntensity =
                  texProps.emissiveIntensity ?? 1.0;
              }
            }
            if (
              newMaterial.hasOwnProperty("roughness") &&
              !newMaterial.roughnessMap &&
              texProps.roughness !== undefined
            )
              newMaterial.roughness = texProps.roughness;
            if (
              newMaterial.hasOwnProperty("metalness") &&
              !newMaterial.metalnessMap &&
              texProps.metalness !== undefined
            )
              newMaterial.metalness = texProps.metalness;
            if (!colorSetByMap && shapeData.color)
              newMaterial.color.set(shapeData.color);

            if (mesh.material && typeof mesh.material.dispose === "function") {
              mesh.material.dispose(); // Dispose old if it exists and is disposable
            }
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
        }
      });

      if (meshes.length === 0) {
        alert("No shapes could be prepared for Static GLB export.");
        setIsBaking(false);
        return;
      }
      // Using sceneExportToGLB from SceneElements.jsx
      sceneExportToGLB(exportScene, `static-model-${Date.now()}.glb`);
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
      let allOriginalClipsFromGLBs = [];
      let processedShapeCount = 0;

      const textureLoaderForAnimExport = new ThreeTextureLoader();
      const loadTextureAsyncAnim = (url, isColorData = false) =>
        new Promise((resolve) => {
          if (!url) {
            resolve(null);
            return;
          }
          textureLoaderForAnimExport.load(
            url,
            (t) => {
              t.colorSpace = isColorData
                ? THREE.SRGBColorSpace
                : THREE.LinearSRGBColorSpace;
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
              shapeData.glbMaterialOverride ||
              (shapeData.textureProps &&
                Object.values(shapeData.textureProps).some(
                  (v) => v && typeof v === "string"
                ))
            ) {
              await targetObjectForAnimation.traverse(async (node) => {
                if (node.isMesh && node.material) {
                  const originalMaterials = Array.isArray(node.material)
                    ? node.material
                    : [node.material];
                  const newMaterials = [];
                  for (let i = 0; i < originalMaterials.length; i++) {
                    const matInstance = originalMaterials[i];
                    let newMaterialInstance;
                    const overrideConf = shapeData.glbMaterialOverride;
                    if (overrideConf && overrideConf.type !== "model") {
                      const newMaterialProps = {
                        color: new THREE.Color(
                          overrideConf.color || matInstance.color || "#cccccc"
                        ),
                        side: THREE.DoubleSide,
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
                      let NewCtor;
                      switch (overrideConf.type) {
                        case "physical":
                          NewCtor = THREE.MeshPhysicalMaterial;
                          newMaterialProps.transmission =
                            overrideConf.transmission ?? 0.0;
                          newMaterialProps.ior = overrideConf.ior ?? 1.5;
                          newMaterialProps.thickness =
                            overrideConf.thickness ?? 0.01;
                          break;
                        case "toon":
                          NewCtor = THREE.MeshToonMaterial;
                          break;
                        case "basic":
                          NewCtor = THREE.MeshBasicMaterial;
                          break;
                        case "lambert":
                          NewCtor = THREE.MeshLambertMaterial;
                          break;
                        case "phong":
                          NewCtor = THREE.MeshPhongMaterial;
                          newMaterialProps.shininess =
                            overrideConf.shininess ?? 30;
                          break;
                        case "wireframe":
                          NewCtor = THREE.MeshBasicMaterial;
                          newMaterialProps.wireframe = true;
                          break;
                        default:
                          NewCtor = THREE.MeshStandardMaterial;
                      }
                      newMaterialInstance = new NewCtor(newMaterialProps);
                      newMaterialInstance.name =
                        (matInstance.name || `glb_anim_mat_${i}`) +
                        `_override_${overrideConf.type}`;
                    } else {
                      newMaterialInstance = matInstance.clone();
                    }
                    if (shapeData.textureProps) {
                      if (shapeData.textureProps.mapUrl) {
                        newMaterialInstance.map = await loadTextureAsyncAnim(
                          shapeData.textureProps.mapUrl,
                          true
                        );
                        if (newMaterialInstance.map)
                          newMaterialInstance.color.set(0xffffff);
                      }
                      if (
                        shapeData.textureProps.normalMapUrl &&
                        newMaterialInstance.normalMap !== undefined
                      )
                        newMaterialInstance.normalMap =
                          await loadTextureAsyncAnim(
                            shapeData.textureProps.normalMapUrl,
                            false
                          );
                      if (
                        shapeData.textureProps.roughnessMapUrl &&
                        newMaterialInstance.roughnessMap !== undefined
                      )
                        newMaterialInstance.roughnessMap =
                          await loadTextureAsyncAnim(
                            shapeData.textureProps.roughnessMapUrl,
                            false
                          );
                      if (
                        shapeData.textureProps.metalnessMapUrl &&
                        newMaterialInstance.metalnessMap !== undefined
                      )
                        newMaterialInstance.metalnessMap =
                          await loadTextureAsyncAnim(
                            shapeData.textureProps.metalnessMapUrl,
                            false
                          );
                      if (
                        shapeData.textureProps.aoMapUrl &&
                        newMaterialInstance.aoMap !== undefined
                      ) {
                        newMaterialInstance.aoMap = await loadTextureAsyncAnim(
                          shapeData.textureProps.aoMapUrl,
                          false
                        );
                        if (newMaterialInstance.aoMap) {
                          newMaterialInstance.aoMapIntensity =
                            shapeData.textureProps.aoMapIntensity ?? 1.0;
                          if (
                            node.geometry &&
                            !node.geometry.attributes.uv2 &&
                            node.geometry.attributes.uv
                          )
                            node.geometry.setAttribute(
                              "uv2",
                              node.geometry.attributes.uv.clone()
                            );
                        }
                      }
                      if (
                        shapeData.textureProps.emissiveMapUrl &&
                        newMaterialInstance.emissiveMap !== undefined
                      ) {
                        newMaterialInstance.emissiveMap =
                          await loadTextureAsyncAnim(
                            shapeData.textureProps.emissiveMapUrl,
                            true
                          );
                        if (newMaterialInstance.emissiveMap) {
                          newMaterialInstance.emissive = new THREE.Color(
                            shapeData.textureProps.emissiveColor || 0xffffff
                          );
                          newMaterialInstance.emissiveIntensity =
                            shapeData.textureProps.emissiveIntensity ?? 1.0;
                        }
                      }
                      if (
                        newMaterialInstance.hasOwnProperty("roughness") &&
                        !newMaterialInstance.roughnessMap &&
                        shapeData.textureProps.roughness !== undefined
                      )
                        newMaterialInstance.roughness =
                          shapeData.textureProps.roughness;
                      if (
                        newMaterialInstance.hasOwnProperty("metalness") &&
                        !newMaterialInstance.metalnessMap &&
                        shapeData.textureProps.metalness !== undefined
                      )
                        newMaterialInstance.metalness =
                          shapeData.textureProps.metalness;
                    }
                    newMaterialInstance.needsUpdate = true;
                    newMaterials.push(newMaterialInstance);
                  }
                  node.material =
                    newMaterials.length === 1 ? newMaterials[0] : newMaterials;
                }
              });
            }
            if (
              gltfObjectData.animations &&
              gltfObjectData.animations.length > 0
            ) {
              allOriginalClipsFromGLBs = allOriginalClipsFromGLBs.concat(
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

          const tS = saneNumber(shapeData.textSize, 0.5);
          const tD = saneNumber(shapeData.extrudeDepth, 0.2);
          const textGeo = new ThreeTextGeometry(shapeData.text || "3D", {
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
            isFinite(actualZDepth)
          ) {
            zScaleFactor = expectedZDepth / actualZDepth;
          } else if (expectedZDepth === 0 && actualZDepth === 0) {
            zScaleFactor = 1.0;
          } else if (actualZDepth === 0 && expectedZDepth !== 0) {
            console.warn(
              "TextGeometry created with zero depth for export, scaling might be odd."
            );
          }
          if (
            Math.abs(zScaleFactor - 1.0) > 0.0001 &&
            isFinite(zScaleFactor) &&
            zScaleFactor > 0
          ) {
            textGeo.scale(1, 1, zScaleFactor);
          }

          textGeo.computeBoundingBox();
          const centerOffsetX =
            -0.5 * (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x);
          const centerOffsetY =
            -0.5 * (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y);
          textGeo.translate(centerOffsetX, centerOffsetY, 0);

          const materialProps = {
            color: new THREE.Color(shapeData.color || "#ffffff"),
            side: THREE.DoubleSide,
          };
          if (
            shapeData.material === "standard" ||
            shapeData.material === "physical"
          ) {
            materialProps.roughness = saneNumber(shapeData.roughness, 0.5);
            materialProps.metalness = saneNumber(shapeData.metalness, 0.0);
          }
          let material;
          switch (shapeData.material) {
            case "physical":
              material = new THREE.MeshPhysicalMaterial({
                ...materialProps,
                transmission: saneNumber(shapeData.transmission, 0.0),
                ior: saneNumber(shapeData.ior, 1.5),
                thickness: saneNumber(shapeData.thickness, 0.01),
              });
              break;
            default:
              material = new THREE.MeshStandardMaterial(materialProps);
          }
          const texProps =
            shapeData.textTextureProps ||
            shapeData.textureProps ||
            initialTextureProps;
          if (texProps.mapUrl) {
            material.map = await loadTextureAsyncAnim(texProps.mapUrl, true);
            if (material.map) material.color.set(0xffffff);
          }
          if (texProps.normalMapUrl && material.normalMap !== undefined)
            material.normalMap = await loadTextureAsyncAnim(
              texProps.normalMapUrl,
              false
            );
          targetObjectForAnimation = new THREE.Mesh(textGeo, material);
        } else {
          targetObjectForAnimation = await createMeshFromShape(shapeData);
          if (
            targetObjectForAnimation &&
            shapeData.textureProps &&
            shapeData.type !== "imagePlane"
          ) {
            const newMaterial = targetObjectForAnimation.material.clone();
            const texProps = shapeData.textureProps;
            let colorSetByMap = false;
            if (texProps.mapUrl) {
              newMaterial.map = await loadTextureAsyncAnim(
                texProps.mapUrl,
                true
              );
              if (newMaterial.map) {
                newMaterial.color.set(0xffffff);
                colorSetByMap = true;
              }
            }
            if (texProps.normalMapUrl && newMaterial.normalMap !== undefined)
              newMaterial.normalMap = await loadTextureAsyncAnim(
                texProps.normalMapUrl,
                false
              );
            if (
              texProps.roughnessMapUrl &&
              newMaterial.roughnessMap !== undefined
            )
              newMaterial.roughnessMap = await loadTextureAsyncAnim(
                texProps.roughnessMapUrl,
                false
              );
            if (
              texProps.metalnessMapUrl &&
              newMaterial.metalnessMap !== undefined
            )
              newMaterial.metalnessMap = await loadTextureAsyncAnim(
                texProps.metalnessMapUrl,
                false
              );
            if (texProps.aoMapUrl && newMaterial.aoMap !== undefined) {
              newMaterial.aoMap = await loadTextureAsyncAnim(
                texProps.aoMapUrl,
                false
              );
              if (newMaterial.aoMap) {
                newMaterial.aoMapIntensity = texProps.aoMapIntensity ?? 1.0;
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
            if (
              texProps.emissiveMapUrl &&
              newMaterial.emissiveMap !== undefined
            ) {
              newMaterial.emissiveMap = await loadTextureAsyncAnim(
                texProps.emissiveMapUrl,
                true
              );
              if (newMaterial.emissiveMap) {
                newMaterial.emissive = new THREE.Color(
                  texProps.emissiveColor || 0xffffff
                );
                newMaterial.emissiveIntensity =
                  texProps.emissiveIntensity ?? 1.0;
              }
            }
            if (
              newMaterial.hasOwnProperty("roughness") &&
              !newMaterial.roughnessMap &&
              texProps.roughness !== undefined
            )
              newMaterial.roughness = texProps.roughness;
            if (
              newMaterial.hasOwnProperty("metalness") &&
              !newMaterial.metalnessMap &&
              texProps.metalness !== undefined
            )
              newMaterial.metalness = texProps.metalness;
            if (!colorSetByMap && shapeData.color)
              newMaterial.color.set(shapeData.color);

            if (
              targetObjectForAnimation.material &&
              typeof targetObjectForAnimation.material.dispose === "function"
            ) {
              targetObjectForAnimation.material.dispose();
            }
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
        } else {
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
        }
        exportScene.add(targetObjectForAnimation);
        return { shapeData, targetObjectForAnimation };
      });

      const results = (await Promise.all(meshCreationPromises)).filter(
        (r) => r !== null
      );
      processedShapeCount = results.length;

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
          if (
            animParams.type === "orbit" &&
            (animParams.orbitRadius || 0) === 0
          )
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
        alert("No valid shapes could be prepared for animated export.");
        setIsBaking(false);
        return;
      }
      exportScene.animations = [...allBakedClips, ...allOriginalClipsFromGLBs];
      sceneExportToGLB(exportScene, `baked-animated-model-${Date.now()}.glb`);
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
          alert(`File type of "${file.name}" not recognized for drag & drop.`);
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
  const handleAnimationTimeChange = (newTimeArray) => {
    const newTime = newTimeArray[0];
    setAnimationTime(newTime);
    if (animationPlaybackState === "playing") {
      setAnimationPlaybackState("paused");
      requestAnimationFrame(() => setAnimationPlaybackState("playing"));
    } else if (animationPlaybackState === "stopped") {
      setAnimationPlaybackState("paused");
    }
  };
  const handleAnimationLoopToggle = (checked) => {
    setIsAnimationLooping(checked);
  };
  const handleAnimationSpeedChange = (speedArray) => {
    setAnimationPlaybackSpeed(parseFloat(speedArray[0]) || 1.0);
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
        const targetPropsKey =
          currentShape.type === "text" && isTextSpecific
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
      const targetPropsKey =
        currentShape.type === "text" && isTextSpecific
          ? "textTextureProps"
          : "textureProps";
      const oldPropValues = currentShape[targetPropsKey] || initialTextureProps;
      const oldUrl = oldPropValues[`${mapTypeStr}Url`];
      if (oldUrl && oldUrl.startsWith("blob:")) {
        URL.revokeObjectURL(oldUrl);
      }
      updatePayload[targetPropsKey] = {
        ...oldPropValues,
        [`${mapTypeStr}Url`]: null,
      };
      updateShapeAndSave(shapeId, updatePayload);
    },
    [shapes, updateShapeAndSave]
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && activeMobilePanel)
        setActiveMobilePanel(null);
    };
    window.addEventListener("resize", handleResize);
    if (activeMobilePanel) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "";
    };
  }, [activeMobilePanel]);

  useEffect(() => {
    if (selectedShape && selectedShape.type === "importedGLB") {
      const gltfData = loadedGltfObjects[selectedShape.id];
      if (gltfData && gltfData.animations && gltfData.animations.length > 0) {
        setAnimationClips(gltfData.animations);
        if (
          !playAllAnimations &&
          (selectedAnimationClipIndex < 0 ||
            selectedAnimationClipIndex >= gltfData.animations.length)
        ) {
          setSelectedAnimationClipIndex(0);
          setAnimationDuration(gltfData.animations[0]?.duration || 0);
        } else if (playAllAnimations) {
          setSelectedAnimationClipIndex(-1);
          const maxDuration = gltfData.animations.reduce(
            (max, clip) => Math.max(max, clip.duration || 0),
            0
          );
          setAnimationDuration(maxDuration);
        } else if (
          selectedAnimationClipIndex >= 0 &&
          selectedAnimationClipIndex < gltfData.animations.length
        ) {
          // Ensure index is valid before accessing
          setAnimationDuration(
            gltfData.animations[selectedAnimationClipIndex]?.duration || 0
          );
        } else {
          // Fallback if index became invalid somehow
          setSelectedAnimationClipIndex(
            gltfData.animations.length > 0 ? 0 : -1
          );
          setAnimationDuration(
            gltfData.animations.length > 0
              ? gltfData.animations[0]?.duration || 0
              : 0
          );
        }
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
    setAnimationTime(0); // Always reset time when relevant dependencies change
  }, [
    selectedShape,
    loadedGltfObjects,
    playAllAnimations,
    selectedAnimationClipIndex,
  ]);

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

        {Object.keys(initialTextureProps)
          .filter((k) => k.endsWith("Url"))
          .map((mapTypeKey) => {
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
        {Object.keys(initialTextureProps)
          .filter((k) => k.endsWith("Url"))
          .map((mapTypeKey) => {
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
            <div className='text-slate-100 text-xl p-6 bg-slate-800 rounded-lg shadow-2xl flex items-center ring-1 ring-purple-500/50'>
              <svg
                className='animate-spin h-6 w-6 text-purple-400 mr-3'
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
              Baking GLB... Please Wait
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

        <div
          className={cn(
            "flex flex-1 min-h-0 relative overflow-hidden md:p-4 md:pt-0"
          )}
        >
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
                  portalContainerRef={creatorWrapperRef}
                  isFullscreen={isFullscreen}
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
                portalContainerRef={creatorWrapperRef}
                isFullscreen={isFullscreen}
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
