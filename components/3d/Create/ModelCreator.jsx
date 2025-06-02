import React, { useState, useRef, useCallback, useEffect } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextureLoader as ThreeTextureLoader } from "three/src/loaders/TextureLoader.js";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { PanelLeft, PanelRight, X as CloseIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectPortal, // Ensure SelectPortal is imported if needed for older Shadcn/Radix versions
} from "@/components/ui/select";

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

// --- Helper functions and constants ---
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
    dracoLoader.setDecoderPath("/draco/gltf/"); // Ensure this path is correct in your /public folder
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
  // Add other PBR/Physical material props here that can be controlled via textureProps UI
  // These are values, not URLs, but are often grouped with texture settings
  roughness: 0.5, // Default value if no map
  metalness: 0.0, // Default value if no map
  aoMapIntensity: 1.0,
  emissiveColor: "#000000", // Default emissive color
  emissiveIntensity: 1.0,
  // Physical material specific
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
  shininess: 30, // For Phong
};

const textureLoaderForGLB = new ThreeTextureLoader();

const applyTextureToGLBNode = (
  node,
  mapType, // e.g., "map", "normalMap", or null if only changing material type
  textureUrl, // URL for the texture, or undefined if only changing material type
  materialOverrideConfig, // { type: "standard" | "physical" | "model" ..., color, roughness, etc. }
  callback // Optional callback
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
        // Store the original material instance only once, if not already an override
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

      // Phase 1: Handle Material Override
      if (materialOverrideConfig && materialOverrideConfig.type !== "model") {
        // Check if current material is already the correct override type; if so, update it. Otherwise, replace.
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
          newMaterialInstance = targetMaterial; // Update existing override
        } else {
          newMaterialInstance = new MtlCtor(); // Create new override
          materialWasReplacedThisCall = true;
        }

        // Common properties
        newMaterialInstance.color.set(
          new THREE.Color(
            materialOverrideConfig.color || originalMaterial.color || "#cccccc"
          )
        );
        newMaterialInstance.side = THREE.DoubleSide; // Default for creator
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
          // Add other physical props from materialOverrideConfig
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
          newMaterialInstance.wireframe = false; // Ensure not wireframe unless specified
        }

        if (materialWasReplacedThisCall) {
          if (
            originalMaterial.isMaterial &&
            originalMaterial !== newMaterialInstance &&
            originalMaterial.userData.isOverride
          ) {
            originalMaterial.dispose(); // Dispose old override
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
        // Revert to original or a new default if original is lost
        let restoredMaterial = targetMaterial.userData.originalMaterialInstance;
        if (restoredMaterial && restoredMaterial.isMaterial) {
          // Ensure the restored material is not the override itself
          if (restoredMaterial.uuid === targetMaterial.uuid) {
            restoredMaterial = restoredMaterial.clone(); // clone if it's the same, something went wrong
          }
        } else {
          // Fallback: create a new default standard material
          restoredMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(
              originalMaterial.userData.originalMaterialInstance?.color ||
                "#cccccc"
            ),
            name: originalMaterial.userData.originalName,
          });
        }
        restoredMaterial.userData.isOverride = false; // No longer an override

        if (targetMaterial.isMaterial) targetMaterial.dispose(); // Dispose current override

        if (Array.isArray(node.material)) {
          node.material[index] = restoredMaterial;
        } else {
          node.material = restoredMaterial;
        }
        targetMaterial = restoredMaterial;
        materialWasReplacedThisCall = true;
        appliedOverall = true;
      }

      // Phase 2: Apply Texture if mapType and textureUrl are provided
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
          // Determine if it's a color map (needs SRGB) or data map (needs Linear)
          const isColorDataMap =
            mapProperty === "map" || mapProperty === "emissiveMap";

          if (texUrl) {
            // Dispose previous texture if it exists
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
                texture.flipY = false; // Standard for GLTF
                texture.needsUpdate = true;

                targetMaterial[mapProperty] = texture;

                if (
                  mapProperty === "map" &&
                  (targetMaterial.isMeshStandardMaterial ||
                    targetMaterial.isMeshPhysicalMaterial)
                ) {
                  targetMaterial.color.set(0xffffff); // Standard PBR practice
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
                  ); // Needed for aoMap
                }
                if (
                  mapProperty === "emissiveMap" &&
                  (targetMaterial.isMeshStandardMaterial ||
                    targetMaterial.isMeshPhysicalMaterial)
                ) {
                  targetMaterial.emissive = new THREE.Color(
                    materialOverrideConfig?.emissiveColor || 0xffffff
                  ); // Use config or default to white
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
            // No texUrl, so clear the map
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
              // Revert to override color or original color
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
              ); // Default to black if map removed
              targetMaterial.emissiveIntensity =
                materialOverrideConfig?.emissiveIntensity ?? 1.0;
            }
            targetMaterial.needsUpdate = true;
            appliedOverall = true; // Still an operation
            if (callback) callback(true, mapProperty); // Successful removal
          }
        };

        // Apply specific maps
        const validMapTypesForStandardPhysical = [
          "map",
          "normalMap",
          "roughnessMap",
          "metalnessMap",
          "aoMap",
          "emissiveMap",
        ];
        const validMapTypesForOther = ["map", "normalMap"]; // Toon, Basic, Lambert, Phong generally support map, some normalMap

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
          // Only material was changed, no specific texture for this mapType on this material type
          if (callback)
            callback(true, "material_override_only_no_texture_for_maptype");
        } else if (callback) {
          if (callback) callback(false, `map_type_${mapType}_not_supported`);
        }
      } else if (materialWasReplacedThisCall && callback) {
        // Material changed, but no texture operation in this specific call
        callback(true, "material_override_only");
      } else if (callback && mapType) {
        // mapType provided, but conditions not met for texture application
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
  const [mode, setMode] = useState("translate"); // translate, rotate, scale
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [cameraPreset, setCameraPreset] = useState(null); // 'top', 'front', 'side', 'isometric'
  const sceneRef = useRef(null); // Ref to the THREE.Scene object from R3F
  const [isAnimating, setIsAnimating] = useState(true); // Global animation toggle for procedural shapes
  const [isBaking, setIsBaking] = useState(false); // For GLB export loading state

  const [loadedGltfObjects, setLoadedGltfObjects] = useState({}); // { [shapeId]: { scene, animations } }

  // Animation playback state for GLBs
  const [animationClips, setAnimationClips] = useState([]); // Array of AnimationClip from selected GLB
  const [selectedAnimationClipIndex, setSelectedAnimationClipIndex] =
    useState(-1); // Index for current clip
  const [animationPlaybackState, setAnimationPlaybackState] =
    useState("stopped"); // 'playing', 'paused', 'stopped'
  const [animationTime, setAnimationTime] = useState(0); // Current time of the animation (absolute)
  const [animationDuration, setAnimationDuration] = useState(0); // Duration of the current/selected clip
  const [isAnimationLooping, setIsAnimationLooping] = useState(true);
  const [animationPlaybackSpeed, setAnimationPlaybackSpeed] = useState(1.0);
  const [playAllAnimations, setPlayAllAnimations] = useState(false); // Play all clips of a GLB simultaneously

  const [forceCanvasRefreshKey, setForceCanvasRefreshKey] = useState(0);

  const selectedShape = shapes.find((shape) => shape.id === selectedShapeId);

  const jsonFileInputRef = useRef(null);
  const glbFileInputRef = useRef(null);
  const imageFileInputRef = useRef(null);

  // Refs for texture file inputs (one per map type)
  const shapeTextureFileInputRefs = useRef({}); // For general shapes
  const textTextureFileInputRefs = useRef({}); // For Text3D specific textures

  const creatorWrapperRef = useRef(null); // Ref for the main container for fullscreen
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeMobilePanel, setActiveMobilePanel] = useState(null); // 'left', 'right', or null

  const toggleFullscreen = useCallback(async () => {
    if (!creatorWrapperRef.current) return;
    if (!document.fullscreenElement) {
      try {
        await creatorWrapperRef.current.requestFullscreen();
        // setIsFullscreen(true) will be handled by the event listener
      } catch (err) {
        console.error("Fullscreen request failed:", err.message, err.name);
        // alert(`Error entering fullscreen: ${err.message}. Try browser's F11 key.`);
      }
    } else {
      if (document.exitFullscreen) {
        try {
          await document.exitFullscreen();
          // setIsFullscreen(false) will be handled by the event listener
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
    if (isBaking) return; // Prevent state saving during baking
    const state = shapes.map((shape) => ({
      ...shape,
      position: [...shape.position], // Deep copy arrays
      rotation: [...shape.rotation],
      scale: [...shape.scale],
      animation: shape.animation
        ? {
            ...shape.animation,
            orbitCenter: [...(shape.animation.orbitCenter || [0, 0, 0])],
          }
        : undefined,
      // Deep copy textureProps and glbMaterialOverride
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
    setRedoStack([]); // Clear redo stack on new action
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
        animation: { type: "none" }, // Placeholder for procedural animation, GLB uses its own clips
        glbMaterialOverride: null, // { type: 'model', color: '#ffffff', roughness: 0.5, metalness: 0.0, ... }
        textureProps: { ...initialTextureProps }, // For applying external textures
      };
      setShapes((prev) => [...prev, newShape]);
      setLoadedGltfObjects((prev) => ({
        ...prev,
        [newShapeId]: {
          scene: gltfData.scene, // This is the THREE.Group/Scene
          animations: gltfData.animations || [], // Array of THREE.AnimationClip
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
        position: [0, planeHeight / 2, 0], // Center pivot at bottom for typical placement
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        imageDataUrl, // Base64 or blob URL
        originalWidth,
        originalHeight,
        planeWidth,
        planeHeight,
        animation: { type: "none" }, // Standard animation block
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
        material: "standard", // Default material type
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
        // PBR properties (used by standard/physical materials)
        roughness: 0.5,
        metalness: 0.0,
        // Physical material properties (used by physical material)
        transmission: 0.0,
        ior: 1.5,
        thickness: 0.01,
        // Phong shininess
        shininess: 30,
        animation: {
          type: "none",
          speed: 1,
          axis: "y",
          orbitCenter: [0, 0, 0],
          orbitRadius: 5,
          orbitPlane: "xz",
        },
        textureProps: { ...initialTextureProps }, // For standard textures
      };

      let specificProps = {};
      if (geometryType === "text") {
        specificProps = {
          text: "Text",
          textSize: 0.5,
          extrudeDepth: 0.2, // Corresponds to "height" in Text3D
          name: "3D Text",
          textTextureProps: { ...initialTextureProps }, // Separate textures for text if needed
        };
        // Adjust initial Y position based on text size and scale
        newShapeBase.position[1] =
          (specificProps.textSize || 0.5) * 0.5 * newShapeBase.scale[1];
      } else if (geometryType === "customExtruded") {
        const shapeTypeName = options.shapeType
          ? options.shapeType.charAt(0).toUpperCase() +
            options.shapeType.slice(1)
          : "Custom";
        specificProps = {
          shapeType: options.shapeType || "heart", // Default custom shape
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
              "", // path, not needed for ArrayBuffer
              (gltf) => {
                const originalScene = gltf.scene;
                // Center and scale the model
                const box = new THREE.Box3().setFromObject(originalScene);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());

                let sceneToUse = originalScene;
                let scaleFactor = 1;
                const targetMaxSize = 3.0; // Target max dimension for auto-scaling
                const currentMaxSize = Math.max(size.x, size.y, size.z);

                if (currentMaxSize > targetMaxSize && currentMaxSize > 0) {
                  scaleFactor = targetMaxSize / currentMaxSize;
                } else if (currentMaxSize === 0) {
                  console.warn(
                    "Imported GLB has zero size. Scale not adjusted."
                  );
                } // else, if smaller or equal, use original scaleFactor = 1

                // If model is not centered, wrap it in a group and offset the original scene
                if (center.lengthSq() > 0.0001) {
                  // Check if center is significantly off [0,0,0]
                  const centeringGroup = new THREE.Group();
                  centeringGroup.name = originalScene.name
                    ? originalScene.name + "_centeringWrapper"
                    : "gltf_centeringWrapper";
                  centeringGroup.add(originalScene);
                  originalScene.position.sub(center); // Offset the model inside the wrapper
                  sceneToUse = centeringGroup; // Use the wrapper as the main scene object
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
      if (event.target) event.target.value = null; // Reset file input
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
                  // Ensure all relevant material properties are loaded
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
              setLoadedGltfObjects({}); // Clear previously loaded GLB objects
              setIsAnimating(
                jsonData.sceneSettings?.isAnimatingGlobal !== undefined
                  ? jsonData.sceneSettings.isAnimatingGlobal
                  : true
              );
              // alert(`Scene loaded with ${newShapes.length} shapes. GLBs require re-importing files if not embedded or paths changed.`);
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
        // File selected but not an image
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
            // Basic cleanup of GLTF scene from memory
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

  // Updates shape properties without saving to undo stack (e.g., during transform control drag)
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
      saveState(); // Save current state before updating

      setShapes((prevShapes) =>
        prevShapes.map((s) => {
          if (s.id === shapeId) {
            const newShape = { ...s, ...updates };

            // If it's an imported GLB and material/texture properties are changing,
            // we need to traverse its scene and apply changes directly.
            if (
              newShape.type === "importedGLB" &&
              (updates.hasOwnProperty("glbMaterialOverride") ||
                updates.hasOwnProperty("textureProps"))
            ) {
              const gltfObjectData = loadedGltfObjects[shapeId];
              if (gltfObjectData && gltfObjectData.scene) {
                gltfObjectData.scene.traverse((node) => {
                  if (node.isMesh && node.material) {
                    // Phase 1: Apply material override if it's part of the updates or if textures are changing
                    if (
                      updates.hasOwnProperty("glbMaterialOverride") ||
                      updates.hasOwnProperty("textureProps")
                    ) {
                      applyTextureToGLBNode(
                        node,
                        null, // No specific texture map type, just material change
                        undefined,
                        newShape.glbMaterialOverride, // The latest material override config
                        (success, mapProperty) => {
                          /* console.log(`GLB Material override applied: ${success} for ${mapProperty}`); */
                        }
                      );
                    }

                    // Phase 2: Apply all textureProps if they are part of the updates OR if the material override changed
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
                            newShape.glbMaterialOverride, // Pass current override config for context
                            (success, appliedMapType) => {
                              /* console.log(`GLB Texture ${appliedMapType} applied: ${success}`); */
                            }
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

    // Deep copy relevant properties, especially nested objects/arrays
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
      const clonedScene = originalGltfObject.scene.clone(true); // Deep clone the THREE.Object3D

      // Re-apply material override and textures to the cloned scene
      if (
        duplicatedShapeData.glbMaterialOverride ||
        (duplicatedShapeData.textureProps &&
          Object.values(duplicatedShapeData.textureProps).some((v) => v))
      ) {
        clonedScene.traverse((node) => {
          if (node.isMesh && node.material) {
            // Check node.material
            // Apply material override first
            applyTextureToGLBNode(
              node,
              null,
              undefined,
              duplicatedShapeData.glbMaterialOverride,
              () => {}
            );
            // Then apply textures
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
        // md breakpoint
        setActiveMobilePanel("right");
      }
    },
    [isBaking, activeMobilePanel]
  );

  // Callback from TransformControls or direct manipulation
  const handleShapeUpdateFromTransformControls = useCallback(
    (shapeIdToUpdate) => {
      if (isBaking || !shapeIdToUpdate || !sceneRef.current) return;

      const currentShapeData = shapes.find((s) => s.id === shapeIdToUpdate);
      if (!currentShapeData) return;

      // Construct the expected name based on shapeData
      // This needs to match the 'name' prop given to the <Shape> component's top-level mesh/group
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
        // Use updateShape for real-time feedback without creating excessive undo states.
        // Save to undo stack happens on drag end or other explicit actions.
        updateShape(shapeIdToUpdate, newUpdates); // Changed from updateShapeAndSave for performance
      } else {
        // Fallback if precise name match fails (e.g. due to suffix truncation or issues)
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
          console.warn(
            `TransformControls target "${objectName}" or prefix "${simplerObjectName}" not found in scene.`
          );
        }
      }
    },
    [shapes, updateShape, isBaking]
  ); // updateShape instead of updateShapeAndSave

  const setCameraView = useCallback(
    (preset) => {
      if (isBaking) return;
      setCameraPreset(preset);
      // Reset preset after a short delay to allow multiple clicks on the same preset button
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
        // Current state before undoing
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

    // After restoring state, re-apply GLB materials/textures if necessary
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
              // Apply material override first
              applyTextureToGLBNode(
                node,
                null,
                undefined,
                shape.glbMaterialOverride,
                () => {}
              );
              // Then apply textures
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
    setSelectedShapeId(null); // Deselect shape on undo/redo
  }, [undoStack, shapes, isBaking, loadedGltfObjects]);

  const redo = useCallback(() => {
    if (redoStack.length === 0 || isBaking) return;
    const nextStates = [...redoStack];
    const stateToRestore = nextStates.shift();

    setUndoStack((prevUndo) => [
      shapes.map((s) => ({
        // Current state before redoing
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

    // After restoring state, re-apply GLB materials/textures
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
        // Base properties common to all shapes
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
          // Include all material related properties for non-GLB, non-ImagePlane shapes
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
        // GLB specific
        else if (s.type === "imagePlane")
          return {
            ...baseShape,
            imageDataUrl: s.imageDataUrl,
            originalWidth: s.originalWidth,
            originalHeight: s.originalHeight,
            planeWidth: s.planeWidth,
            planeHeight: s.planeHeight,
          }; // ImagePlane specific

        return baseShape; // For box, sphere, etc.
      });

      const sceneData = {
        metadata: {
          version: "2.9.2-robust-materials-fix",
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
      // alert(`Exported ${shapes.length} shapes to JSON successfully!`);
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
      await new Promise((resolve) => setTimeout(resolve, 50)); // Short delay for UI update

      const exportScene = new THREE.Scene();
      exportScene.name = "StaticExportScene";
      // Add some basic lighting to the export scene
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      exportScene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
      directionalLight.position.set(8, 15, 10);
      directionalLight.castShadow = true;
      exportScene.add(directionalLight);

      let successfullyAddedCount = 0;
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
              texture.flipY = false; // GLTF standard
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

            // Apply material override and textures if present
            if (
              shapeData.glbMaterialOverride ||
              (shapeData.textureProps &&
                Object.values(shapeData.textureProps).some(
                  (v) =>
                    v && typeof v === "string" && v.startsWith("data:image")
                ))
            ) {
              await modelClone.traverse(async (node) => {
                if (node.isMesh && node.material) {
                  const originalMaterials = Array.isArray(node.material)
                    ? node.material
                    : [node.material];
                  const newMaterials = [];

                  for (let i = 0; i < originalMaterials.length; i++) {
                    constmatInstance = originalMaterials[i];
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
                          // Add other physical props from overrideConf
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
                      newMaterialInstance = matInstance.clone(); // Clone original or existing material if no override type or type is 'model'
                    }

                    // Apply textures from shapeData.textureProps
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
                      // Apply non-map PBR props if no map is present for them
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

        // Procedural shapes (Text, Box, Sphere, etc.)
        let mesh;
        if (shapeData.type === "text") {
          // Special handling for Text
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
              console.error("Text export: Font load failed", e);
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
          // Manual centering for TextGeometry
          textGeo.computeBoundingBox();
          const centerOffsetX =
            -0.5 * (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x);
          const centerOffsetY =
            -0.5 * (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y);
          const centerOffsetZ =
            -0.5 * (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z);
          textGeo.translate(centerOffsetX, centerOffsetY, centerOffsetZ);

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
            // Add other cases as in createMeshFromShape
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
          // ... add other texture types for text if supported by its material ...
          mesh = new THREE.Mesh(textGeo, material);
        } else {
          // Other procedural shapes or image planes
          mesh = await createMeshFromShape(shapeData); // This creates mesh with basic material
          if (
            mesh &&
            shapeData.textureProps &&
            shapeData.type !== "imagePlane"
          ) {
            // Re-apply textures with correct color spaces if createMeshFromShape doesn't handle them all
            const newMaterial = mesh.material.clone(); // Clone to avoid modifying shared material
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
            // Apply non-map PBR props if no map is present for them
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
              newMaterial.color.set(shapeData.color); // Restore base color if no map

            mesh.material.dispose(); // Dispose old material from createMeshFromShape
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
      // alert(`Exported ${successfullyAddedCount} shapes to Static GLB successfully!`);
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
        let targetObjectForAnimation; // This will be the THREE.Object3D added to exportScene

        if (shapeData.type === "importedGLB") {
          const gltfObjectData = loadedGltfObjects[shapeData.id];
          if (gltfObjectData && gltfObjectData.scene) {
            targetObjectForAnimation = gltfObjectData.scene.clone(true);
            // Apply material override and textures to the cloned GLB scene
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
                        // Add other cases from applyTextureToGLBNode
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

                    // Apply textures
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
            // Add original animations from the GLB
            if (
              gltfObjectData.animations &&
              gltfObjectData.animations.length > 0
            ) {
              allOriginalClipsFromGLBs = allOriginalClipsFromGLBs.concat(
                gltfObjectData.animations.map((clip) => clip.clone())
              );
            }
          } else {
            return null; /* GLB data missing */
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
          textGeo.translate(
            -0.5 * (textGeo.boundingBox.max.x + textGeo.boundingBox.min.x),
            -0.5 * (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y),
            -0.5 * (textGeo.boundingBox.max.z + textGeo.boundingBox.min.z)
          );

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
          // Other procedural shapes
          targetObjectForAnimation = await createMeshFromShape(shapeData); // Uses basic material
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
            targetObjectForAnimation.material.dispose();
            targetObjectForAnimation.material = newMaterial;
          }
        }

        if (!targetObjectForAnimation && shapeData.type !== "importedGLB")
          return null; // Failed to create mesh for procedural

        if (shapeData.type !== "importedGLB") {
          // For procedural, set transform and add to scene
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
          // For GLB, already cloned, just set root transform from shapeData
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
        exportScene.add(targetObjectForAnimation); // Add to export scene
        processedShapeCount++;
        return { shapeData, targetObjectForAnimation }; // Return data for animation baking
      });

      const results = (await Promise.all(meshCreationPromises)).filter(
        (r) => r !== null
      );

      for (const result of results) {
        if (!result) continue;
        const { shapeData, targetObjectForAnimation } = result;

        // Bake procedural animations (not for GLBs, they use their own clips)
        if (
          shapeData.animation &&
          shapeData.animation.type !== "none" &&
          targetObjectForAnimation &&
          shapeData.type !== "importedGLB"
        ) {
          const animParams = shapeData.animation;
          let bakeDur = 5;
          const bakeFps = 30; // Default duration and FPS
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

          const simObj = new THREE.Object3D(); // Simulation object
          simObj.position.copy(targetObjectForAnimation.position); // Start from initial position
          simObj.quaternion.copy(targetObjectForAnimation.quaternion); // Start from initial rotation

          let currentOrbitAngle = Math.atan2(
            simObj.position.z - (animParams.orbitCenter?.[2] || 0),
            simObj.position.x - (animParams.orbitCenter?.[0] || 0)
          );
          if (
            animParams.type === "orbit" &&
            (animParams.orbitRadius || 0) === 0
          )
            currentOrbitAngle = 0; // Avoid NaN if radius is 0

          for (let i = 0; i < totalFrames; i++) {
            const time = i * timeStep;
            times.push(time);
            const effSpeedThisFrame = (animParams.speed || 1) * timeStep; // Speed for this frame step

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
                simObj.quaternion.premultiply(R); // Apply rotation relative to current
                break;
              case "orbit":
                currentOrbitAngle += effSpeedThisFrame * 0.2;
                const r = animParams.orbitRadius || 5;
                const cX = animParams.orbitCenter?.[0] || 0;
                const cY =
                  animParams.orbitCenter?.[1] !== undefined
                    ? animParams.orbitCenter[1]
                    : simObj.position.y; // Keep original Y if not specified for orbit center
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
          // Create KeyframeTracks
          // IMPORTANT: GLTF Exporter needs tracks to target node UUIDs, not names.
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
        // No shapes were processed but some exist
        alert("No valid shapes could be prepared for animated export.");
        setIsBaking(false);
        return;
      }

      exportScene.animations = [...allBakedClips, ...allOriginalClipsFromGLBs]; // Combine baked and original GLB clips
      exportToGLB(exportScene, `baked-animated-model-${Date.now()}.glb`);
      // alert(`Exported ${processedShapeCount} shapes with ${exportScene.animations.length} animation clips to GLB!`);
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
      // Could add other methods like 'min', 'max'
      setShapes(newShapes);
      // alert(`${shapes.length} shapes aligned along ${axis.toUpperCase()}-axis (${method}).`);
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
      updateShapeAndSave(selectedShapeId, { position: newPosition }); // Use save version for explicit action
      // alert(`Selected shape aligned to origin on ${axis.toUpperCase()}-axis.`);
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
        const file = files[0]; // Process first file only for simplicity
        const syntheticEvent = { target: { files: [file], value: null } }; // Mock event for handlers
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
    { name: "Pyramid", geometry: "pyramid", icon: "🔺" }, // Uses custom geometry component
    { name: "3D Text", geometry: "text", icon: "📝" },
  ];

  const toggleGlobalAnimation = useCallback(() => {
    if (isBaking) return;
    setIsAnimating((prev) => !prev);
  }, [isBaking]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ignore keydowns if an input field is focused or contentEditable
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
          break; // Toggle global animation
        default:
          break;
      }
      // Ctrl/Cmd shortcuts
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

  // GLB Animation Playback Handlers
  const handlePlayPauseAnimation = () => {
    if (
      !selectedShape ||
      selectedShape.type !== "importedGLB" ||
      animationClips.length === 0
    )
      return;
    if (!playAllAnimations && selectedAnimationClipIndex < 0) return; // No clip selected for single play
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
    setAnimationTime(0); // Reset time on stop
  };
  const handleAnimationClipChange = (indexStr) => {
    const index = parseInt(indexStr, 10);
    if (index >= 0 && index < animationClips.length) {
      setSelectedAnimationClipIndex(index);
      setAnimationDuration(animationClips[index].duration || 0);
      setAnimationTime(0); // Reset time when clip changes
      // setAnimationPlaybackState("stopped"); // Optionally stop animation on clip change
    } else if (index === -1 && playAllAnimations) {
      // Special value for "All Clips Playing" if using SelectItem for it
      setSelectedAnimationClipIndex(-1); // Ensure it's set for playAllAnimations mode
      const maxDuration = animationClips.reduce(
        (max, clip) => Math.max(max, clip.duration || 0),
        0
      );
      setAnimationDuration(maxDuration);
      setAnimationTime(0);
    }
  };
  const handleAnimationTimeChange = (newTime) => {
    // newTime is absolute time
    setAnimationTime(newTime);
    if (animationPlaybackState === "playing") {
      // If playing, briefly pause then play to reflect scrub
      setAnimationPlaybackState("paused");
      requestAnimationFrame(() => setAnimationPlaybackState("playing"));
    } else if (animationPlaybackState === "stopped") {
      // If stopped, scrubbing should move to paused state to show the frame
      setAnimationPlaybackState("paused");
    }
    // If already paused, just updating animationTime will be handled by the effect
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
      setSelectedAnimationClipIndex(-1); // Indicate all clips mode
      const maxDuration = animationClips.reduce(
        (max, clip) => Math.max(max, clip.duration || 0),
        0
      );
      setAnimationDuration(maxDuration);
    } else {
      // Switched off playAll
      if (animationClips.length > 0) {
        // Default to first clip if current selection is invalid for single play
        if (
          selectedAnimationClipIndex < 0 ||
          selectedAnimationClipIndex >= animationClips.length
        ) {
          setSelectedAnimationClipIndex(0);
          setAnimationDuration(animationClips[0].duration || 0);
        } else {
          // Keep current valid clip
          setAnimationDuration(
            animationClips[selectedAnimationClipIndex].duration || 0
          );
        }
      } else {
        setAnimationDuration(0);
      }
    }
    setAnimationTime(0); // Reset time on mode change
  };

  // Texture Upload/Clear Handlers
  const handleTextureUpload = useCallback(
    (shapeId, mapTypeStr, event, isTextSpecific = false) => {
      const file = event.target.files[0];
      if (!file) return;
      const currentShape = shapes.find((s) => s.id === shapeId);
      if (!currentShape) return;

      const reader = new FileReader();
      reader.onload = (e_reader) => {
        const newTextureUrl = e_reader.target.result; // This will be a data URL
        let updatePayload = {};

        const targetPropsKey =
          currentShape.type === "text" && isTextSpecific
            ? "textTextureProps"
            : "textureProps";
        const oldPropValues =
          currentShape[targetPropsKey] || initialTextureProps;
        const oldUrl = oldPropValues[`${mapTypeStr}Url`];
        if (oldUrl && oldUrl.startsWith("blob:")) {
          // Revoke old blob URL if it exists
          URL.revokeObjectURL(oldUrl);
        }
        updatePayload[targetPropsKey] = {
          ...oldPropValues,
          [`${mapTypeStr}Url`]: newTextureUrl,
        };

        updateShapeAndSave(shapeId, updatePayload);
      };
      reader.readAsDataURL(file);
      if (event.target) event.target.value = null; // Reset file input
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
        // Revoke old blob URL
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

  // Effect to manage body overflow for mobile panel
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && activeMobilePanel)
        setActiveMobilePanel(null);
    }; // md breakpoint
    window.addEventListener("resize", handleResize);
    if (activeMobilePanel) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "";
    };
  }, [activeMobilePanel]);

  // Effect to update animation clips when selected GLB changes
  useEffect(() => {
    if (selectedShape && selectedShape.type === "importedGLB") {
      const gltfData = loadedGltfObjects[selectedShape.id];
      if (gltfData && gltfData.animations && gltfData.animations.length > 0) {
        setAnimationClips(gltfData.animations);
        // If current selection is invalid or -1 (for playAll) and playAll is false, default to first clip
        if (
          !playAllAnimations &&
          (selectedAnimationClipIndex < 0 ||
            selectedAnimationClipIndex >= gltfData.animations.length)
        ) {
          setSelectedAnimationClipIndex(0);
          setAnimationDuration(gltfData.animations[0]?.duration || 0);
        } else if (playAllAnimations) {
          setSelectedAnimationClipIndex(-1); // Ensure -1 for playAll
          const maxDuration = gltfData.animations.reduce(
            (max, clip) => Math.max(max, clip.duration || 0),
            0
          );
          setAnimationDuration(maxDuration);
        } else {
          // Valid clip selected, update its duration
          setAnimationDuration(
            gltfData.animations[selectedAnimationClipIndex]?.duration || 0
          );
        }
      } else {
        // No animations or no GLTF data
        setAnimationClips([]);
        setSelectedAnimationClipIndex(-1);
        setAnimationDuration(0);
      }
    } else {
      // Not a GLB or no shape selected
      setAnimationClips([]);
      setSelectedAnimationClipIndex(-1);
      setAnimationDuration(0);
    }
    // Reset animation time when clips/shape change
    setAnimationTime(0);
    // setAnimationPlaybackState("stopped"); // Optionally stop on shape change
  }, [selectedShape, loadedGltfObjects, playAllAnimations]); // playAllAnimations is a dependency

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
          "flex flex-col h-[100svh] overflow-hidden", // Changed to 100svh for better mobile viewport height
          "bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 text-slate-100 select-none",
          isBaking ? "opacity-50 pointer-events-none" : ""
        )}
      >
        {/* Hidden file inputs */}
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

        {/* Hidden texture file inputs (one per map type) */}
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
            // Example: only allow map and normalMap for text for now
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
                // GLB animation props for MainScene
                animationClips={animationClips} // Pass all clips for potential use
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
                  // Fullscreen props for Select inside AnimationPlaybackBar
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
                updateShape={updateShapeAndSave} // Use save version for explicit property changes
                removeShape={removeShape}
                duplicateShape={duplicateShape}
                addShape={addShape} // To add shapes from panel potentially
                handleTextureUpload={handleTextureUpload}
                handleClearTexture={handleClearTexture}
                shapeTextureFileInputRefs={shapeTextureFileInputRefs}
                textTextureFileInputRefs={textTextureFileInputRefs}
                forceRefreshCanvas={handleForceCanvasRefresh}
                // Fullscreen props for Selects inside PropertiesPanel
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
