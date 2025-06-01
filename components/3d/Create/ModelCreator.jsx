import React, { useState, useRef, useCallback, useEffect } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { TextureLoader } from "three"; // Keep this for GLB export logic

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";

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
  createMeshFromShape, // Used for export
  exportToGLB,
} from "./SceneElements";

let R3FCanvasCheck;
try {
  const r3f = require("@react-three/fiber");
  R3FCanvasCheck = r3f.Canvas;
} catch (error) {
  /* Handled by FallbackCreator */
}

let gltfLoaderInstance;
const getGltfLoader = () => {
  if (!gltfLoaderInstance) {
    gltfLoaderInstance = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(
      typeof window !== "undefined" ? "/draco/gltf/" : "draco/gltf/"
    );
    gltfLoaderInstance.setDRACOLoader(dracoLoader);
  }
  return gltfLoaderInstance;
};

const MAX_PLANE_DIMENSION = 5;
const DEFAULT_EXPORT_FONT_PATH = "/fonts/helvetiker_regular.typeface.json";
let helvetikerFontForExport = null;
const exportFontLoaderInstance = new FontLoader();

if (typeof window !== "undefined") {
  exportFontLoaderInstance.load(
    DEFAULT_EXPORT_FONT_PATH,
    (font) => {
      helvetikerFontForExport = font;
    },
    undefined,
    (err) =>
      console.error(
        "ModelCreator: Failed to pre-load default EXPORT font:",
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

export default function Model3DCreator() {
  const [shapes, setShapes] = useState([]);
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [mode, setMode] = useState("translate");
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [cameraPreset, setCameraPreset] = useState(null);

  const r3fSceneForRenderRef = useRef(null);
  const r3fGlRef = useRef(null);
  const r3fCameraForRenderRef = useRef(null);

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
  const [refreshKey, setRefreshKey] = useState(0);

  const selectedShape = shapes.find((shape) => shape.id === selectedShapeId);

  const jsonFileInputRef = useRef(null);
  const glbFileInputRef = useRef(null);
  const imageFileInputRef = useRef(null);
  const shapeTextureFileInputRefs = useRef({});
  const textTextureFileInputRefs = useRef({});

  const handleR3FContextReady = useCallback((scene, gl, camera) => {
    r3fSceneForRenderRef.current = scene;
    r3fGlRef.current = gl;
    r3fCameraForRenderRef.current = camera;
  }, []);

  const saveState = useCallback(
    (actionName = "action") => {
      if (isBaking) return;
      const stateToSave = shapes.map((shape) =>
        JSON.parse(JSON.stringify(shape))
      );
      setUndoStack((prev) => [...prev, stateToSave]);
      setRedoStack([]);
    },
    [shapes, isBaking]
  );

  const addShape = useCallback(
    (geometryType, options = {}) => {
      if (geometryType === "importedGLB" || geometryType === "imagePlane") {
        sonnerToast.error(`Use import for ${geometryType}`);
        return;
      }
      saveState(`add shape ${geometryType}`);
      const newId =
        Date.now().toString() + Math.random().toString(36).substr(2, 5);
      const defaultY =
        (options.shapeSize || 1) * (geometryType === "pyramid" ? 0 : 0.5);
      const newShapeBase = {
        id: newId,
        type: geometryType,
        name: geometryType.charAt(0).toUpperCase() + geometryType.slice(1),
        material: "standard",
        color: `#${Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")}`,
        position: [
          (Math.random() - 0.5) * 3,
          defaultY,
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
          text: options.text || "Text",
          textSize: options.textSize || 0.5,
          extrudeDepth: options.extrudeDepth || 0.2,
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
      sonnerToast.success(`${newShape.name} added.`);
    },
    [saveState]
  );

  const addImportedShape = useCallback(
    (gltfData, fileName) => {
      saveState(`import model ${fileName}`);
      const newShapeId =
        Date.now().toString() + Math.random().toString(36).substr(2, 5);
      const box = new THREE.Box3().setFromObject(gltfData.scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      let initialYPosition = -center.y + size.y / 2;
      if (Math.abs(center.y - size.y / 2) < 0.01 * size.y) {
        initialYPosition = 0;
      } else if (Math.abs(center.y) < 0.01 * size.y) {
        initialYPosition = size.y / 2;
      }

      const newShape = {
        id: newShapeId,
        type: "importedGLB",
        name: fileName.split(".").slice(0, -1).join(".") || "Imported Model",
        position: [0, initialYPosition, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        animation: { type: "none" },
        material: "standard", // Default override material type for UI
        color: "#FFFFFF",
        roughness: 0.5,
        metalness: 0.0,
        textureProps: { ...initialTextureProps },
      };
      setShapes((prev) => [...prev, newShape]);
      setLoadedGltfObjects((prev) => ({
        ...prev,
        [newShapeId]: {
          scene: gltfData.scene,
          animations: gltfData.animations?.map((clip) => clip.clone()) || [],
        },
      }));
      setSelectedShapeId(newShapeId);
      sonnerToast.success(`Model "${newShape.name}" imported.`);
    },
    [saveState]
  );

  const addImagePlane = useCallback(
    (imageDataUrl, originalWidth, originalHeight, fileName) => {
      saveState(`add image plane ${fileName}`);
      let planeWidth, planeHeight;
      const aspectRatio =
        originalWidth > 0 && originalHeight > 0
          ? originalWidth / originalHeight
          : 1;

      if (originalWidth >= originalHeight) {
        planeWidth = MAX_PLANE_DIMENSION;
        planeHeight = MAX_PLANE_DIMENSION / aspectRatio;
      } else {
        planeHeight = MAX_PLANE_DIMENSION;
        planeWidth = MAX_PLANE_DIMENSION * aspectRatio;
      }

      planeWidth = Math.max(0.01, planeWidth || MAX_PLANE_DIMENSION * 0.75);
      planeHeight = Math.max(0.01, planeHeight || MAX_PLANE_DIMENSION * 0.75);

      const newShapeId =
        Date.now().toString() + Math.random().toString(36).substr(2, 5);
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
        textureProps: { ...initialTextureProps },
      };
      setShapes((prev) => [...prev, newShape]);
      setSelectedShapeId(newShapeId);
      sonnerToast.success(`Image Plane "${newShape.name}" added.`);
    },
    [saveState]
  );

  const removeShape = useCallback(
    (shapeId) => {
      if (isBaking) return;
      const shapeToRemove = shapes.find((s) => s.id === shapeId);
      saveState(`remove shape ${shapeToRemove?.name || shapeId}`);
      setShapes((prev) => prev.filter((shape) => shape.id !== shapeId));
      if (shapeToRemove && shapeToRemove.type === "importedGLB") {
        setLoadedGltfObjects((prev) => {
          const updated = { ...prev };
          delete updated[shapeId];
          return updated;
        });
      }
      if (selectedShapeId === shapeId) setSelectedShapeId(null);
      sonnerToast.info(`Object "${shapeToRemove?.name || "Unknown"}" removed.`);
    },
    [selectedShapeId, saveState, isBaking, shapes]
  );

  const duplicateShape = useCallback(() => {
    if (!selectedShape || isBaking) return;
    saveState(`duplicate shape ${selectedShape.name}`);
    const newId =
      Date.now().toString() + Math.random().toString(36).substr(2, 5);
    const duplicatedShapeData = JSON.parse(JSON.stringify(selectedShape));
    duplicatedShapeData.id = newId;
    duplicatedShapeData.position[0] += 0.5;
    duplicatedShapeData.position[2] += 0.5;
    duplicatedShapeData.name = `${
      selectedShape.name || selectedShape.type
    } Copy`;

    if (
      selectedShape.type === "importedGLB" &&
      loadedGltfObjects[selectedShape.id]
    ) {
      const origGltf = loadedGltfObjects[selectedShape.id];
      setLoadedGltfObjects((prev) => ({
        ...prev,
        [newId]: {
          scene: origGltf.scene,
          animations: origGltf.animations?.map((c) => c.clone()) || [],
        },
      }));
    }
    setShapes((prev) => [...prev, duplicatedShapeData]);
    setSelectedShapeId(newId);
    sonnerToast.success(
      `Object "${selectedShape.name || "Unknown"}" duplicated.`
    );
  }, [selectedShape, saveState, isBaking, loadedGltfObjects]);

  const undo = useCallback(() => {
    if (isBaking || undoStack.length === 0) {
      sonnerToast.info(isBaking ? "Cannot undo." : "Nothing to undo.");
      return;
    }
    const currentCopy = shapes.map((s) => JSON.parse(JSON.stringify(s)));
    setRedoStack((prev) => [currentCopy, ...prev]);
    const stateToRestore = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setShapes(stateToRestore);
    setSelectedShapeId(null);
    setRefreshKey((k) => k + 1);
    sonnerToast.success("Undo successful.");
  }, [undoStack, shapes, isBaking]);

  const redo = useCallback(() => {
    if (isBaking || redoStack.length === 0) {
      sonnerToast.info(isBaking ? "Cannot redo." : "Nothing to redo.");
      return;
    }
    const currentCopy = shapes.map((s) => JSON.parse(JSON.stringify(s)));
    setUndoStack((prev) => [currentCopy, ...prev]);
    const stateToRestore = redoStack[0];
    setRedoStack((prev) => prev.slice(1));
    setShapes(stateToRestore);
    setSelectedShapeId(null);
    setRefreshKey((k) => k + 1);
    sonnerToast.success("Redo successful.");
  }, [redoStack, shapes, isBaking]);

  const toggleGlobalAnimation = useCallback(() => {
    if (isBaking) {
      sonnerToast.warning("Cannot change anim state.");
      return;
    }
    setIsAnimating((prev) => {
      sonnerToast.info(`Global anim ${!prev ? "resumed" : "paused"}.`);
      return !prev;
    });
  }, [isBaking]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        isBaking ||
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.isContentEditable
      )
        return;
      const key = e.key.toLowerCase();
      if (e.ctrlKey || e.metaKey) {
        if (key === "z") {
          e.preventDefault();
          undo();
        } else if (key === "y") {
          e.preventDefault();
          redo();
        } else if (key === "d" && selectedShapeId) {
          e.preventDefault();
          duplicateShape();
        }
      } else {
        switch (key) {
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
              e.preventDefault();
              removeShape(selectedShapeId);
            }
            break;
          case "p":
            e.preventDefault();
            toggleGlobalAnimation();
            break;
          default:
            break;
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

  const handleForceThreeJSRender = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
    if (selectedShape && selectedShape.type === "importedGLB") {
      const gltfData = loadedGltfObjects[selectedShape.id];
      if (gltfData && gltfData.animations && gltfData.animations.length > 0) {
        const newClips = gltfData.animations.map((clip) => clip.clone());
        setAnimationClips(newClips);
        const newSelectedIdx = playAllAnimations ? -1 : 0;
        setSelectedAnimationClipIndex(newSelectedIdx);
        let duration = 0;
        if (playAllAnimations)
          duration = newClips.reduce(
            (max, clip) => Math.max(max, clip.duration || 0),
            0
          );
        else if (newClips.length > 0) duration = newClips[0].duration || 0;
        setAnimationDuration(duration);
        setAnimationPlaybackState("stopped");
        setAnimationTime(0);
      } else {
        setAnimationClips([]);
        setSelectedAnimationClipIndex(-1);
        setAnimationDuration(0);
        setAnimationPlaybackState("stopped");
        setAnimationTime(0);
      }
    }
    sonnerToast.info("Scene, textures, and animations re-initialized.");
    saveState("Force scene re-initialization");
  }, [selectedShape, loadedGltfObjects, playAllAnimations, saveState]);

  const handleTakeScreenshot = useCallback(() => {
    const gl = r3fGlRef.current;
    const scene = r3fSceneForRenderRef.current;
    const camera = r3fCameraForRenderRef.current;
    if (!gl || !scene || !camera) {
      sonnerToast.error("Screenshot Failed", {
        description: "Renderer not ready.",
      });
      return;
    }
    const toastId = sonnerToast.loading("Taking Screenshot...");
    requestAnimationFrame(() => {
      gl.render(scene, camera);
      try {
        const canvas = gl.domElement;
        const link = document.createElement("a");
        let baseName = selectedShape
          ? selectedShape.name || selectedShape.type || "selected_object"
          : "creator_scene";
        baseName = baseName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
        link.download = `screenshot_${baseName}_${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        sonnerToast.success("Screenshot Saved!", {
          id: toastId,
          description: `${link.download} saved.`,
        });
      } catch (e) {
        sonnerToast.error("Screenshot Failed", {
          id: toastId,
          description: e.message || "Could not save.",
        });
        console.error("Screenshot error:", e);
      }
    });
  }, [selectedShape]);

  useEffect(() => {
    if (selectedShape && selectedShape.type === "importedGLB") {
      const gltfData = loadedGltfObjects[selectedShape.id];
      if (gltfData && gltfData.animations && gltfData.animations.length > 0) {
        const newClips = gltfData.animations.map((clip) => clip.clone());
        setAnimationClips(newClips);
        const currentSelectedIdx = playAllAnimations ? -1 : 0;
        setSelectedAnimationClipIndex(currentSelectedIdx);
        let newDuration = 0;
        if (playAllAnimations)
          newDuration = newClips.reduce(
            (max, clip) => Math.max(max, clip.duration || 0),
            0
          );
        else if (newClips.length > 0) newDuration = newClips[0].duration || 0;
        setAnimationDuration(newDuration);
        setAnimationPlaybackState("stopped");
        setAnimationTime(0);
      } else {
        setAnimationClips([]);
        setSelectedAnimationClipIndex(-1);
        setAnimationDuration(0);
        setAnimationPlaybackState("stopped");
        setAnimationTime(0);
      }
    } else {
      setAnimationClips([]);
      setSelectedAnimationClipIndex(-1);
      setAnimationDuration(0);
      setAnimationPlaybackState("stopped");
      setAnimationTime(0);
    }
  }, [selectedShape, loadedGltfObjects, playAllAnimations]);

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
      saveState(
        `update shape ${shapes.find((s) => s.id === shapeId)?.name || shapeId}`
      );
      updateShape(shapeId, updates);
    },
    [updateShape, saveState, isBaking, shapes]
  );

  const handleShapeClick = useCallback(
    (shapeId) => {
      if (isBaking) return;
      setSelectedShapeId((prev) => (prev === shapeId ? null : shapeId));
    },
    [isBaking]
  );

  const handleShapeUpdateFromTransformControls = useCallback(
    (shapeIdToUpdate, saveHistory = false) => {
      if (isBaking || !shapeIdToUpdate || !r3fSceneForRenderRef.current) return;
      const sData = shapes.find((s) => s.id === shapeIdToUpdate);
      if (!sData) return;

      const r3fInstance = r3fSceneForRenderRef.current.getObjectByProperty(
        "userData",
        { shapeId: shapeIdToUpdate }
      );

      if (r3fInstance) {
        const updates = {
          position: [
            r3fInstance.position.x,
            r3fInstance.position.y,
            r3fInstance.position.z,
          ],
          rotation: [
            r3fInstance.rotation.x,
            r3fInstance.rotation.y,
            r3fInstance.rotation.z,
          ],
          scale: [
            r3fInstance.scale.x,
            r3fInstance.scale.y,
            r3fInstance.scale.z,
          ],
        };
        if (saveHistory) {
          updateShapeAndSave(shapeIdToUpdate, updates);
        } else {
          updateShape(shapeIdToUpdate, updates);
        }
      } else {
        console.warn(
          `TransformControls target for shapeId "${shapeIdToUpdate}" not found by userData in R3F scene.`
        );
      }
    },
    [shapes, updateShape, updateShapeAndSave, isBaking]
  );

  const setCameraView = useCallback(
    (preset) => {
      if (isBaking) return;
      setCameraPreset(preset);
      setTimeout(() => setCameraPreset(null), 100);
      sonnerToast.info(`Camera view: ${preset}`);
    },
    [isBaking]
  );

  const exportJSON = useCallback(() => {
    if (isBaking || shapes.length === 0) {
      sonnerToast.info(isBaking ? "Cannot export." : "No shapes.");
      return;
    }
    try {
      const serializableShapes = shapes.map((s) => {
        const serial = {
          id: s.id,
          type: s.type,
          name: s.name || s.type,
          position: s.position,
          rotation: s.rotation,
          scale: s.scale,
          animation: s.animation
            ? {
                ...s.animation,
                orbitCenter: s.animation.orbitCenter || [0, 0, 0],
              }
            : { type: "none" },
          textureProps: s.textureProps
            ? { ...s.textureProps }
            : { ...initialTextureProps },
        };
        if (s.type === "text")
          Object.assign(serial, {
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
          });
        else if (s.type === "customExtruded")
          Object.assign(serial, {
            shapeType: s.shapeType,
            shapeSize: s.shapeSize,
            extrudeDepth: s.extrudeDepth,
            color: s.color,
            material: s.material,
            roughness: s.roughness,
            metalness: s.metalness,
          });
        else if (s.type === "importedGLB")
          Object.assign(serial, {
            originalFileName: s.name, // Store original name if available, or current name
            material: s.material, // Override material type
            color: s.color, // Override color
            roughness: s.roughness, // Override roughness
            metalness: s.metalness, // Override metalness
            // textureProps is already in base `serial`
          });
        else if (s.type === "imagePlane")
          Object.assign(serial, {
            imageDataUrl: s.imageDataUrl,
            originalWidth: s.originalWidth,
            originalHeight: s.originalHeight,
            planeWidth: s.planeWidth,
            planeHeight: s.planeHeight,
          });
        // Standard procedural shapes
        else
          Object.assign(serial, {
            color: s.color,
            material: s.material,
            roughness: s.roughness,
            metalness: s.metalness,
          });
        return serial;
      });
      const sceneData = {
        metadata: {
          version: "3.0-full-override",
          type: "PBR Scene",
          generator: "Creator",
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
      sonnerToast.success(`Exported ${shapes.length} shapes to JSON.`);
    } catch (e) {
      console.error("[EXPORT JSON] Failed:", e);
      sonnerToast.error("JSON Export Failed", { description: e.message });
    }
  }, [shapes, isAnimating, isBaking]);

  const exportStaticGLBFile = useCallback(async () => {
    if (isBaking || shapes.length === 0) {
      sonnerToast.info(isBaking ? "Cannot export." : "No shapes.");
      return;
    }
    const toastId = sonnerToast.loading("Exporting Static GLB...");
    setIsBaking(true);
    await new Promise((r) => setTimeout(r, 50));
    try {
      const exportScene = new THREE.Scene();
      exportScene.name = "StaticExportScene";
      const ambLight = new THREE.AmbientLight(0xffffff, 0.8);
      exportScene.add(ambLight);
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
      dirLight.position.set(8, 15, 10);
      dirLight.castShadow = true;
      exportScene.add(dirLight);
      let count = 0;
      const threeTexLoader = new TextureLoader();
      const loadTexForExport = (url) =>
        new Promise((resolve) => {
          if (!url) {
            resolve(null);
            return;
          }
          threeTexLoader.load(
            url,
            (tex) => {
              tex.flipY = false;
              tex.colorSpace = THREE.SRGBColorSpace;
              resolve(tex);
            },
            undefined,
            () => resolve(null)
          );
        });

      const meshPromises = shapes.map(async (sD) => {
        if (sD.type === "importedGLB") {
          const gltfAsset = loadedGltfObjects[sD.id];
          if (gltfAsset?.scene) {
            const clonedGltfScene = gltfAsset.scene.clone(true);
            const texP = sD.textureProps || initialTextureProps;

            // Material override logic for GLB during export
            const overrideMaterialType = sD.material || "standard";

            await Promise.all(
              clonedGltfScene.children.map(async (node) => {
                // Use map for async traversal
                if (node.isMesh) {
                  const originalMaterial = node.material;
                  let newMaterial;
                  switch (overrideMaterialType) {
                    case "physical":
                      newMaterial = new THREE.MeshPhysicalMaterial();
                      break;
                    case "toon":
                      newMaterial = new THREE.MeshToonMaterial();
                      break;
                    case "basic":
                      newMaterial = new THREE.MeshBasicMaterial();
                      break;
                    case "lambert":
                      newMaterial = new THREE.MeshLambertMaterial();
                      break;
                    case "phong":
                      newMaterial = new THREE.MeshPhongMaterial({
                        shininess: 30,
                      });
                      break;
                    case "wireframe":
                      newMaterial = new THREE.MeshBasicMaterial({
                        wireframe: true,
                      });
                      break;
                    default:
                      newMaterial = new THREE.MeshStandardMaterial();
                      break;
                  }
                  newMaterial.name =
                    (originalMaterial.name || "gltf_mat") + "_export_override";

                  if (newMaterial.isMeshStandardMaterial) {
                    newMaterial.roughness = saneNumber(sD.roughness, 0.5);
                    newMaterial.metalness = saneNumber(sD.metalness, 0.0);
                  }

                  if (texP.mapUrl && overrideMaterialType !== "wireframe")
                    newMaterial.color.set(0xffffff);
                  else if (sD.color && overrideMaterialType !== "wireframe")
                    newMaterial.color.set(sD.color);
                  else if (
                    originalMaterial.color &&
                    overrideMaterialType !== "wireframe"
                  )
                    newMaterial.color.copy(originalMaterial.color);
                  else if (overrideMaterialType !== "wireframe")
                    newMaterial.color.set(0xcccccc);
                  else
                    newMaterial.color.set(
                      sD.color || originalMaterial.color || 0xcccccc
                    );

                  if (overrideMaterialType !== "wireframe") {
                    if (texP.mapUrl && newMaterial.map !== undefined)
                      newMaterial.map = await loadTexForExport(texP.mapUrl);
                    else if (
                      originalMaterial.map &&
                      newMaterial.map !== undefined
                    )
                      newMaterial.map = originalMaterial.map;

                    if (
                      texP.normalMapUrl &&
                      newMaterial.normalMap !== undefined
                    )
                      newMaterial.normalMap = await loadTexForExport(
                        texP.normalMapUrl
                      );
                    else if (
                      originalMaterial.normalMap &&
                      newMaterial.normalMap !== undefined
                    )
                      newMaterial.normalMap = originalMaterial.normalMap;

                    if (newMaterial.isMeshStandardMaterial) {
                      if (texP.roughnessMapUrl)
                        newMaterial.roughnessMap = await loadTexForExport(
                          texP.roughnessMapUrl
                        );
                      else if (originalMaterial.roughnessMap)
                        newMaterial.roughnessMap =
                          originalMaterial.roughnessMap;
                      if (texP.metalnessMapUrl)
                        newMaterial.metalnessMap = await loadTexForExport(
                          texP.metalnessMapUrl
                        );
                      else if (originalMaterial.metalnessMap)
                        newMaterial.metalnessMap =
                          originalMaterial.metalnessMap;
                    }

                    if (texP.aoMapUrl && newMaterial.aoMap !== undefined) {
                      newMaterial.aoMap = await loadTexForExport(texP.aoMapUrl);
                      if (newMaterial.aoMap) newMaterial.aoMapIntensity = 1.0;
                      if (
                        node.geometry.attributes.uv &&
                        !node.geometry.attributes.uv2 &&
                        newMaterial.aoMap
                      ) {
                        node.geometry.setAttribute(
                          "uv2",
                          new THREE.BufferAttribute(
                            node.geometry.attributes.uv.array,
                            2
                          )
                        );
                      }
                    } else if (
                      originalMaterial.aoMap &&
                      newMaterial.aoMap !== undefined
                    ) {
                      newMaterial.aoMap = originalMaterial.aoMap;
                      newMaterial.aoMapIntensity =
                        originalMaterial.aoMapIntensity !== undefined
                          ? originalMaterial.aoMapIntensity
                          : 1.0;
                      if (
                        node.geometry.attributes.uv &&
                        !node.geometry.attributes.uv2 &&
                        newMaterial.aoMap
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
                      texP.emissiveMapUrl &&
                      newMaterial.emissiveMap !== undefined
                    ) {
                      newMaterial.emissiveMap = await loadTexForExport(
                        texP.emissiveMapUrl
                      );
                      if (newMaterial.emissiveMap)
                        newMaterial.emissive = new THREE.Color(0xffffff);
                    } else if (
                      originalMaterial.emissiveMap &&
                      newMaterial.emissiveMap !== undefined
                    ) {
                      newMaterial.emissiveMap = originalMaterial.emissiveMap;
                      if (originalMaterial.emissive)
                        newMaterial.emissive.copy(originalMaterial.emissive);
                    }
                  }
                  node.material = newMaterial; // Apply to the node in the cloned scene
                }
              })
            ); // End of traverse and map

            clonedGltfScene.position.fromArray(sD.position);
            clonedGltfScene.rotation.fromArray(sD.rotation);
            clonedGltfScene.scale.fromArray(sD.scale);
            clonedGltfScene.name = `s_${sD.id}_${sD.type}_${sD.name || ""}`;
            return clonedGltfScene;
          }
          return null;
        }
        let mesh;
        if (sD.type === "text") {
          let font = helvetikerFontForExport;
          if (!font)
            font = await new Promise((res, rej) =>
              exportFontLoaderInstance.load(
                DEFAULT_EXPORT_FONT_PATH,
                res,
                undefined,
                rej
              )
            );
          if (!helvetikerFontForExport) helvetikerFontForExport = font;
          const tS = saneNumber(sD.textSize, 0.5),
            tD = saneNumber(sD.extrudeDepth, 0.2);
          const geo = new TextGeometry(sD.text || "3D", {
            font,
            size: tS,
            height: tD,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: saneNumber(tS * 0.04, 0.015),
            bevelSize: saneNumber(tS * 0.04, 0.01),
            bevelOffset: 0,
            bevelSegments: 3,
          });
          geo.computeBoundingBox();
          geo.translate(
            -0.5 * (geo.boundingBox.max.x + geo.boundingBox.min.x),
            -0.5 * (geo.boundingBox.max.y + geo.boundingBox.min.y),
            -0.5 * (geo.boundingBox.max.z + geo.boundingBox.min.z)
          );

          const mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(sD.color || "#fff"),
            roughness: saneNumber(sD.roughness, 0.5),
            metalness: saneNumber(sD.metalness, 0),
          });
          const texP = sD.textTextureProps || initialTextureProps;
          if (texP.mapUrl) {
            mat.map = await loadTexForExport(texP.mapUrl);
            if (mat.map) mat.color.set(0xffffff);
          }
          if (texP.normalMapUrl)
            mat.normalMap = await loadTexForExport(texP.normalMapUrl);
          mesh = new THREE.Mesh(geo, mat);
        } else {
          mesh = await createMeshFromShape(sD);
        }

        if (mesh) {
          mesh.position.fromArray(sD.position);
          mesh.rotation.fromArray(sD.rotation);
          mesh.scale.fromArray(sD.scale);
          mesh.name = `s_${sD.id}_${sD.type}_${
            sD.name || sD.text?.substring(0, 10) || "Obj"
          }`;
          mesh.castShadow = sD.type !== "imagePlane";
          mesh.receiveShadow = true;
          return mesh;
        }
        return null;
      });

      const meshesAndScenes = await Promise.all(meshPromises);
      meshesAndScenes.forEach((item) => {
        if (item) {
          exportScene.add(item);
          count++;
        }
      });

      if (count === 0) {
        sonnerToast.error("No shapes for GLB.", { id: toastId });
        setIsBaking(false);
        return;
      }
      exportToGLB(exportScene, `static-model-${Date.now()}.glb`, sonnerToast);
    } catch (e) {
      console.error("[STATIC GLB EXPORT]", e);
      sonnerToast.error("Static GLB Export Failed", {
        id: toastId,
        description: e.message,
      });
    } finally {
      setIsBaking(false);
    }
  }, [shapes, loadedGltfObjects, isBaking]);

  const bakeAndExportAnimatedGLB = useCallback(async () => {
    sonnerToast.info(
      "Animated GLB export with full overrides is complex. Using current basic implementation."
    );
    if (isBaking || shapes.length === 0) {
      sonnerToast.info(isBaking ? "Cannot export." : "No shapes.");
      return;
    }
    const toastId = sonnerToast.loading("Exporting Animated GLB...");
    setIsBaking(true);
    await new Promise((r) => setTimeout(r, 50));
    try {
      const exportScene = new THREE.Scene();
      exportScene.name = "BakedAnimatedScene";
      const ambLight = new THREE.AmbientLight(0xffffff, 0.8);
      exportScene.add(ambLight);
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
      dirLight.position.set(8, 15, 10);
      dirLight.castShadow = true;
      exportScene.add(dirLight);

      let bakedClips = [],
        origClips = [],
        procCount = 0;

      const threeTexLoader = new TextureLoader();
      const loadTexForExport = (url) =>
        new Promise((resolve) => {
          if (!url) {
            resolve(null);
            return;
          }
          threeTexLoader.load(
            url,
            (tex) => {
              tex.flipY = false;
              tex.colorSpace = THREE.SRGBColorSpace;
              resolve(tex);
            },
            undefined,
            () => resolve(null)
          );
        });

      const meshPromises = shapes.map(async (sD) => {
        let targetObj;
        if (sD.type === "importedGLB") {
          const gltfAsset = loadedGltfObjects[sD.id];
          if (gltfAsset?.scene) {
            targetObj = gltfAsset.scene.clone(true);

            const texP = sD.textureProps || initialTextureProps;
            const overrideMaterialType = sD.material || "standard";

            await Promise.all(
              targetObj.children.map(async (node) => {
                if (node.isMesh) {
                  const originalMaterial = node.material;
                  let newMaterial;
                  switch (overrideMaterialType) {
                    case "physical":
                      newMaterial = new THREE.MeshPhysicalMaterial();
                      break;
                    default:
                      newMaterial = new THREE.MeshStandardMaterial();
                      break;
                  }
                  newMaterial.name =
                    (originalMaterial.name || "gltf_mat") +
                    "_anim_export_override";
                  if (newMaterial.isMeshStandardMaterial) {
                    newMaterial.roughness = saneNumber(sD.roughness, 0.5);
                    newMaterial.metalness = saneNumber(sD.metalness, 0.0);
                  }
                  if (texP.mapUrl) newMaterial.color.set(0xffffff);
                  else if (sD.color) newMaterial.color.set(sD.color);
                  else if (originalMaterial.color)
                    newMaterial.color.copy(originalMaterial.color);
                  else newMaterial.color.set(0xcccccc);

                  if (texP.mapUrl && newMaterial.map !== undefined)
                    newMaterial.map = await loadTexForExport(texP.mapUrl);
                  // Add other texture types as in static export if needed for animated version
                  node.material = newMaterial;
                }
              })
            );

            targetObj.position.fromArray(sD.position);
            targetObj.rotation.fromArray(sD.rotation);
            targetObj.scale.fromArray(sD.scale);
            targetObj.name = `s_${sD.id}_${sD.type}_${sD.name || ""}`;
            exportScene.add(targetObj);
            procCount++;
            if (gltfAsset.animations?.length)
              origClips.push(...gltfAsset.animations.map((c) => c.clone())); // Add original GLB animations
          } else return null;
        } else if (sD.type === "text") {
          let font = helvetikerFontForExport;
          if (!font)
            font = await new Promise((res, rej) =>
              exportFontLoaderInstance.load(
                DEFAULT_EXPORT_FONT_PATH,
                res,
                undefined,
                rej
              )
            );
          if (!helvetikerFontForExport) helvetikerFontForExport = font;
          const tS = saneNumber(sD.textSize, 0.5),
            tD = saneNumber(sD.extrudeDepth, 0.2);
          const geo = new TextGeometry(sD.text || "3D", {
            font,
            size: tS,
            height: tD,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: saneNumber(tS * 0.04, 0.015),
            bevelSize: saneNumber(tS * 0.04, 0.01),
            bevelOffset: 0,
            bevelSegments: 3,
          });
          geo.computeBoundingBox();
          geo.translate(
            -0.5 * (geo.boundingBox.max.x + geo.boundingBox.min.x),
            -0.5 * (geo.boundingBox.max.y + geo.boundingBox.min.y),
            -0.5 * (geo.boundingBox.max.z + geo.boundingBox.min.z)
          );

          const mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(sD.color || "#fff"),
            roughness: saneNumber(sD.roughness, 0.5),
            metalness: saneNumber(sD.metalness, 0),
          });
          const texP = sD.textTextureProps || initialTextureProps;
          if (texP.mapUrl) {
            mat.map = await loadTexForExport(texP.mapUrl);
            if (mat.map) mat.color.set(0xffffff);
          }
          if (texP.normalMapUrl)
            mat.normalMap = await loadTexForExport(texP.normalMapUrl);
          targetObj = new THREE.Mesh(geo, mat);
        } else {
          targetObj = await createMeshFromShape(sD);
        }

        if (!targetObj) return null;
        if (sD.type !== "importedGLB") {
          targetObj.position.fromArray(sD.position);
          targetObj.rotation.fromArray(sD.rotation);
          targetObj.scale.fromArray(sD.scale);
          targetObj.name = `s_${sD.id}_${sD.type}_${
            sD.name || sD.text?.substring(0, 10) || "Obj"
          }`;
          targetObj.castShadow = sD.type !== "imagePlane";
          targetObj.receiveShadow = true;
          exportScene.add(targetObj);
          procCount++;
        }
        return { shapeData: sD, targetObjectForAnimation: targetObj };
      });
      const results = await Promise.all(meshPromises);

      for (const res of results) {
        if (!res) continue;
        const { shapeData: sD, targetObjectForAnimation: targetObj } = res;
        if (
          sD.animation?.type !== "none" &&
          targetObj &&
          sD.type !== "importedGLB" // Only bake procedural animations
        ) {
          const animP = sD.animation;
          let bakeD = 5;
          const bakeF = 30;
          if (animP.type === "orbit" && (animP.speed || 1) * 0.2 !== 0)
            bakeD = Math.max(
              1,
              Math.min(30, Math.abs((Math.PI * 2) / ((animP.speed || 1) * 0.2)))
            );
          const totalF = Math.max(2, Math.floor(bakeD * bakeF));
          const timeS = bakeD / (totalF - 1);
          const times = [],
            poss = [],
            quats = [];
          const simO = new THREE.Object3D();
          simO.position.copy(targetObj.position);
          simO.quaternion.copy(targetObj.quaternion);
          let orbitA = Math.atan2(
            simO.position.z - (animP.orbitCenter?.[2] || 0),
            simO.position.x - (animP.orbitCenter?.[0] || 0)
          );

          for (let i = 0; i < totalF; i++) {
            const t = i * timeS;
            times.push(t);
            const effSF = (animP.speed || 1) * timeS;
            switch (animP.type) {
              case "rotate":
                const ax = animP.axis || "y",
                  R = new THREE.Quaternion(),
                  ang = effSF;
                if (ax === "x")
                  R.setFromAxisAngle(new THREE.Vector3(1, 0, 0), ang);
                else if (ax === "y")
                  R.setFromAxisAngle(new THREE.Vector3(0, 1, 0), ang);
                else R.setFromAxisAngle(new THREE.Vector3(0, 0, 1), ang);
                simO.quaternion.premultiply(R);
                break;
              case "orbit":
                orbitA += effSF * 0.2;
                const r = animP.orbitRadius || 5;
                const cX = animP.orbitCenter?.[0] || 0;
                const cY =
                  animP.orbitCenter?.[1] !== undefined
                    ? animP.orbitCenter[1]
                    : targetObj.position.y;
                const cZ = animP.orbitCenter?.[2] || 0;
                const p = animP.orbitPlane || "xz";
                if (p === "xz")
                  simO.position.set(
                    cX + Math.cos(orbitA) * r,
                    cY,
                    cZ + Math.sin(orbitA) * r
                  );
                else if (p === "xy")
                  simO.position.set(
                    cX + Math.cos(orbitA) * r,
                    cY + Math.sin(orbitA) * r,
                    cZ
                  );
                else if (p === "yz")
                  simO.position.set(
                    cX,
                    cY + Math.cos(orbitA) * r,
                    cZ + Math.sin(orbitA) * r
                  );
                break;
            }
            poss.push(simO.position.x, simO.position.y, simO.position.z);
            simO.quaternion.normalize();
            quats.push(
              simO.quaternion.x,
              simO.quaternion.y,
              simO.quaternion.z,
              simO.quaternion.w
            );
          }
          const pT = new THREE.VectorKeyframeTrack(
            `${targetObj.uuid}.position`, // Use UUID of the object in exportScene
            times,
            poss
          );
          const rT = new THREE.QuaternionKeyframeTrack(
            `${targetObj.uuid}.quaternion`, // Use UUID
            times,
            quats
          );
          const cl = new THREE.AnimationClip(
            `Anim_${sD.id}_${animP.type}`,
            totalF > 1 ? bakeD : 0,
            [pT, rT]
          );
          bakedClips.push(cl);
        }
      }

      if (procCount === 0 && shapes.length > 0) {
        sonnerToast.error("No shapes for anim GLB.", { id: toastId });
        setIsBaking(false);
        return;
      }
      exportScene.animations = [...bakedClips, ...origClips];
      exportToGLB(
        exportScene,
        `baked-animated-model-${Date.now()}.glb`,
        sonnerToast
      );
    } catch (e) {
      console.error("[ANIM GLB EXPORT]", e);
      sonnerToast.error("Anim GLB Export Failed", {
        id: toastId,
        description: e.message,
      });
    } finally {
      setIsBaking(false);
    }
  }, [shapes, loadedGltfObjects, isBaking]);

  const editorSidebarShapeOptions = [
    { name: "Cube", geometry: "box", icon: "🧊" },
    { name: "Sphere", geometry: "sphere", icon: "⚪" },
    { name: "Cylinder", geometry: "cylinder", icon: "🥫" },
    { name: "Cone", geometry: "cone", icon: "🔺" },
    { name: "Torus", geometry: "torus", icon: "🍩" },
    { name: "Pyramid", geometry: "pyramid", icon: "🔺" },
    { name: "3D Text", geometry: "text", icon: "📝" },
  ];

  const triggerJsonFileImport = useCallback(() => {
    if (isBaking) {
      sonnerToast.warning("Cannot import.");
      return;
    }
    if (jsonFileInputRef.current) jsonFileInputRef.current.click();
  }, [isBaking]);
  const handleJsonFileImport = useCallback(
    (event) => {
      if (isBaking) {
        sonnerToast.warning("Cannot import.");
        return;
      }
      const file = event.target.files[0];
      if (file) {
        const toastId = sonnerToast.loading(`Importing ${file.name}...`);
        const reader = new FileReader();
        reader.onload = (e_reader) => {
          try {
            const jsonData = JSON.parse(e_reader.target.result);
            if (jsonData?.shapes) {
              const newShapes = jsonData.shapes.map((s) => {
                const baseAnim = {
                  type: "none",
                  speed: 1,
                  axis: "y",
                  orbitCenter: [0, 0, 0],
                  orbitRadius: 5,
                  orbitPlane: "xz",
                };
                const loadedAnim = s.animation
                  ? {
                      ...baseAnim,
                      ...s.animation,
                      orbitCenter:
                        Array.isArray(s.animation.orbitCenter) &&
                        s.animation.orbitCenter.length === 3
                          ? s.animation.orbitCenter
                          : [0, 0, 0],
                    }
                  : baseAnim;
                const baseShape = {
                  id:
                    s.id ||
                    Date.now().toString() +
                      Math.random().toString(36).substr(2, 5),
                  type: s.type || "box",
                  name: s.name || s.type,
                  position: s.position || [0, 0, 0],
                  rotation: s.rotation || [0, 0, 0],
                  scale: s.scale || [1, 1, 1],
                  animation: loadedAnim,
                  textureProps: s.textureProps
                    ? { ...initialTextureProps, ...s.textureProps }
                    : { ...initialTextureProps },
                };
                if (s.type === "importedGLB")
                  return {
                    ...baseShape,
                    originalFileName: s.originalFileName || s.name,
                    material: s.material || "standard",
                    color: s.color || "#FFFFFF",
                    roughness: s.roughness !== undefined ? s.roughness : 0.5,
                    metalness: s.metalness !== undefined ? s.metalness : 0.0,
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
                if (s.type === "text")
                  return {
                    ...baseShape,
                    text: s.text || "Text",
                    textSize: s.textSize || 0.5,
                    extrudeDepth: s.extrudeDepth || 0.2,
                    color: s.color,
                    material: s.material,
                    roughness: s.roughness,
                    metalness: s.metalness,
                    textTextureProps: s.textTextureProps
                      ? { ...initialTextureProps, ...s.textTextureProps }
                      : { ...initialTextureProps },
                  };
                return {
                  ...baseShape,
                  color: s.color,
                  material: s.material,
                  roughness: s.roughness,
                  metalness: s.metalness,
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
              setRefreshKey((k) => k + 1);
              sonnerToast.success(
                `Scene loaded. GLBs need re-import if not path-based.`,
                { id: toastId }
              );
            } else sonnerToast.error("Invalid JSON.", { id: toastId });
          } catch (err) {
            console.error("JSON Parse Error:", err);
            sonnerToast.error("Error parsing JSON.", {
              id: toastId,
              description: err.message,
            });
          }
        };
        reader.readAsText(file);
        if (event.target) event.target.value = null;
      }
    },
    [isBaking]
  );

  const triggerGlbFileImport = useCallback(() => {
    if (isBaking) {
      sonnerToast.warning("Cannot import.");
      return;
    }
    if (glbFileInputRef.current) glbFileInputRef.current.click();
  }, [isBaking]);
  const handleGlbFileImport = useCallback(
    (event) => {
      if (isBaking) {
        sonnerToast.warning("Cannot import.");
        return;
      }
      const file = event.target.files[0];
      if (file) {
        const toastId = sonnerToast.loading(`Importing ${file.name}...`);
        const reader = new FileReader();
        reader.onload = (e_reader) => {
          try {
            getGltfLoader().parse(
              e_reader.target.result,
              "",
              (gltf) => {
                addImportedShape(gltf, file.name);
                sonnerToast.success(`Model imported.`, { id: toastId });
              },
              (err) => {
                console.error("GLB Parse Error:", err);
                sonnerToast.error("Error parsing GLB.", {
                  id: toastId,
                  description: err.message,
                });
              }
            );
          } catch (err) {
            console.error("GLB Process Error:", err);
            sonnerToast.error("Error processing GLB.", {
              id: toastId,
              description: err.message,
            });
          }
        };
        reader.readAsArrayBuffer(file);
        if (event.target) event.target.value = null;
      }
    },
    [isBaking, addImportedShape]
  );

  const triggerImageFileImport = useCallback(() => {
    if (isBaking) {
      sonnerToast.warning("Cannot import.");
      return;
    }
    if (imageFileInputRef.current) imageFileInputRef.current.click();
  }, [isBaking]);
  const processAndAddImageFile = useCallback(
    (file) => {
      if (!file.type.startsWith("image/")) {
        sonnerToast.error("Not an image file.");
        return;
      }
      const toastId = sonnerToast.loading(`Processing ${file.name}...`);
      const reader = new FileReader();
      reader.onload = (e_reader) => {
        const img = new Image();
        img.onload = () => {
          addImagePlane(
            e_reader.target.result,
            img.width,
            img.height,
            file.name
          );
          sonnerToast.success(`Image added.`, { id: toastId });
        };
        img.onerror = () => {
          sonnerToast.error("Could not load image.", { id: toastId });
        };
        img.src = e_reader.target.result;
      };
      reader.readAsDataURL(file);
    },
    [addImagePlane]
  );
  const handleImageFileImport = useCallback(
    (event) => {
      if (isBaking) {
        sonnerToast.warning("Cannot import.");
        return;
      }
      const file = event.target.files[0];
      if (file) processAndAddImageFile(file);
      if (event.target) event.target.value = null;
    },
    [isBaking, processAndAddImageFile]
  );

  const handleDropOnCanvas = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (isBaking) {
        sonnerToast.warning("Cannot import.");
        return;
      }
      if (event.dataTransfer.files?.length > 0) {
        const file = event.dataTransfer.files[0];
        if (file.name.match(/\.(glb|gltf)$/i))
          handleGlbFileImport({ target: { files: [file] } });
        else if (file.type.startsWith("image/")) processAndAddImageFile(file);
        else if (file.name.match(/\.(json)$/i))
          handleJsonFileImport({ target: { files: [file] } });
        else sonnerToast.error("Unsupported file type dropped.");
        event.dataTransfer.clearData();
      }
    },
    [
      isBaking,
      handleGlbFileImport,
      processAndAddImageFile,
      handleJsonFileImport,
    ]
  );

  const alignAllShapes = useCallback(
    (axis, reference = "average") => {
      if (isBaking || shapes.length < 2) {
        sonnerToast.info(isBaking ? "Cannot align." : "Need >1 shape.");
        return;
      }
      saveState(`align all ${axis} ${reference}`);
      let targetVal;
      if (reference === "average")
        targetVal =
          shapes.reduce(
            (acc, s) =>
              acc + s.position[axis === "x" ? 0 : axis === "y" ? 1 : 2],
            0
          ) / shapes.length;
      else targetVal = 0;
      setShapes((prev) =>
        prev.map((s) => {
          const newPos = [...s.position];
          newPos[axis === "x" ? 0 : axis === "y" ? 1 : 2] = targetVal;
          return { ...s, position: newPos };
        })
      );
      sonnerToast.success(`Shapes aligned on ${axis.toUpperCase()}-axis.`);
    },
    [shapes, saveState, isBaking]
  );

  const alignSelectedShapeToOrigin = useCallback(
    (axis) => {
      if (isBaking || !selectedShapeId) {
        sonnerToast.info(isBaking ? "Cannot align." : "No shape selected.");
        return;
      }
      saveState(`align selected to origin ${axis}`);
      setShapes((prev) =>
        prev.map((s) => {
          if (s.id === selectedShapeId) {
            const newPos = [...s.position];
            newPos[axis === "x" ? 0 : axis === "y" ? 1 : 2] = 0;
            if (axis === "y") {
              let yOff = 0;
              if (s.scale?.[1]) {
                if (s.type === "pyramid") yOff = 0;
                else if (s.type === "text")
                  yOff = (s.textSize || 0.5) * s.scale[1] * 0.5;
                else if (s.type === "imagePlane")
                  yOff = ((s.planeHeight || 1) * s.scale[1]) / 2;
                else if (s.type === "importedGLB") {
                  const gltfAsset = loadedGltfObjects[s.id];
                  if (gltfAsset?.scene) {
                    // Use the original scene for bounding box calculation
                    const box = new THREE.Box3().setFromObject(gltfAsset.scene);
                    const size = box.getSize(new THREE.Vector3());
                    const center = box.getCenter(new THREE.Vector3());
                    // Position so the GLB's calculated bottom rests at y=0
                    yOff = (-center.y + size.y / 2) * s.scale[1];
                  } else {
                    yOff = s.scale[1] * 0.5;
                  }
                } else yOff = s.scale[1] * 0.5;
              }
              newPos[1] = yOff;
            }
            return { ...s, position: newPos };
          }
          return s;
        })
      );
      sonnerToast.success(
        `Selected shape aligned to origin on ${axis.toUpperCase()}-axis.`
      );
    },
    [shapes, selectedShapeId, saveState, isBaking, loadedGltfObjects]
  );

  const handlePlayPauseAnimation = useCallback(() => {
    if (
      !selectedShape ||
      selectedShape.type !== "importedGLB" ||
      animationClips.length === 0
    ) {
      sonnerToast.info("No GLB anim.");
      return;
    }
    if (!playAllAnimations && selectedAnimationClipIndex < 0) {
      sonnerToast.info("No clip selected.");
      return;
    }
    setAnimationPlaybackState((p) => (p === "playing" ? "paused" : "playing"));
    sonnerToast.info(
      `Animation ${
        animationPlaybackState === "playing" ? "paused" : "resumed"
      }.`
    );
  }, [
    selectedShape,
    animationClips,
    playAllAnimations,
    selectedAnimationClipIndex,
    animationPlaybackState,
  ]);
  const handleStopAnimation = useCallback(() => {
    if (
      !selectedShape ||
      selectedShape.type !== "importedGLB" ||
      animationClips.length === 0
    ) {
      sonnerToast.info("No GLB anim.");
      return;
    }
    setAnimationPlaybackState("stopped");
    setAnimationTime(0);
    sonnerToast.info("Animation stopped.");
  }, [selectedShape, animationClips]);
  const handleAnimationClipChange = useCallback(
    (idxStr) => {
      const i = parseInt(idxStr, 10);
      if (i >= 0 && i < animationClips.length) {
        setSelectedAnimationClipIndex(i);
        setAnimationDuration(animationClips[i].duration || 0);
        setAnimationTime(0);
        sonnerToast.info(
          `Switched to: ${animationClips[i].name || `Anim #${i + 1}`}`
        );
      }
    },
    [animationClips]
  );
  const handleAnimationTimeChange = useCallback(
    (normTimeArray) => setAnimationTime(normTimeArray[0]), // Slider passes array
    []
  );
  const handleAnimationLoopToggle = useCallback((chk) => {
    setIsAnimationLooping(chk);
    sonnerToast.info(`Loop ${chk ? "on" : "off"}.`);
  }, []);
  const handleAnimationSpeedChange = useCallback((spdArray) => {
    // Slider passes array
    setAnimationPlaybackSpeed(parseFloat(spdArray[0]) || 1);
    sonnerToast.info(`Speed: ${(parseFloat(spdArray[0]) || 1).toFixed(1)}x`);
  }, []);
  const handlePlayAllAnimationsToggle = useCallback((chk) => {
    setPlayAllAnimations(chk);
    sonnerToast.info(chk ? "Playing all." : "Playing selected.");
  }, []);

  const handleTextureUpload = useCallback(
    (shapeId, mapType, event, isTextSpecific = false) => {
      const file = event.target.files[0];
      if (!file) return;
      const toastId = sonnerToast.loading(`Uploading ${mapType}...`);
      const reader = new FileReader();
      reader.onload = (e_reader) => {
        const newUrl = e_reader.target.result;
        setShapes((prev) =>
          prev.map((s) => {
            if (s.id === shapeId) {
              const key = isTextSpecific ? "textTextureProps" : "textureProps";
              const oldTextureProps = s[key] || { ...initialTextureProps };
              // Revoke old blob URL if it exists and is a blob URL
              const oldUrl = oldTextureProps[`${mapType}Url`];
              if (oldUrl && oldUrl.startsWith("blob:")) {
                URL.revokeObjectURL(oldUrl);
              }
              return {
                ...s,
                [key]: {
                  ...oldTextureProps,
                  [`${mapType}Url`]: newUrl,
                },
              };
            }
            return s;
          })
        );
        sonnerToast.success(`${mapType} texture applied.`, { id: toastId });
        setRefreshKey((k) => k + 1);
      };
      reader.onerror = () =>
        sonnerToast.error(`Failed to read ${mapType}.`, { id: toastId });
      reader.readAsDataURL(file);
      if (event.target) event.target.value = null;
    },
    []
  );

  const handleClearTexture = useCallback(
    (shapeId, mapType, isTextSpecific = false) => {
      setShapes((prev) =>
        prev.map((s) => {
          if (s.id === shapeId) {
            const key = isTextSpecific ? "textTextureProps" : "textureProps";
            const oldTextureProps = s[key] || { ...initialTextureProps };
            const oldUrl = oldTextureProps[`${mapType}Url`];
            if (oldUrl && oldUrl.startsWith("blob:")) {
              URL.revokeObjectURL(oldUrl);
            }
            return {
              ...s,
              [key]: {
                ...oldTextureProps,
                [`${mapType}Url`]: null,
              },
            };
          }
          return s;
        })
      );
      sonnerToast.info(`${mapType} texture cleared.`);
      setRefreshKey((k) => k + 1);
    },
    []
  );

  if (!R3FCanvasCheck) return <FallbackCreator />;

  return (
    <TooltipProvider>
      <SonnerToaster richColors position='top-right' />
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

        {Object.keys(initialTextureProps).map((keyWithUrl) => {
          const mapT = keyWithUrl.replace("Url", "");
          return (
            <input
              key={`s-tex-${mapT}`}
              type='file'
              accept='image/*'
              ref={(el) => (shapeTextureFileInputRefs.current[mapT] = el)}
              onChange={(e) =>
                selectedShapeId &&
                handleTextureUpload(selectedShapeId, mapT, e, false)
              }
              style={{ display: "none" }}
            />
          );
        })}
        {Object.keys(initialTextureProps)
          .filter((k) => k === "mapUrl" || k === "normalMapUrl") // Only Color and Normal for text face
          .map((keyWithUrl) => {
            const mapT = keyWithUrl.replace("Url", "");
            return (
              <input
                key={`t-tex-${mapT}`}
                type='file'
                accept='image/*'
                ref={(el) => (textTextureFileInputRefs.current[mapT] = el)}
                onChange={(e) =>
                  selectedShapeId &&
                  handleTextureUpload(selectedShapeId, mapT, e, true)
                }
                style={{ display: "none" }}
              />
            );
          })}

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
              Baking...
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
          forceThreeJSRender={handleForceThreeJSRender}
          takeScreenshot={handleTakeScreenshot}
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
            loadedGltfObjects={loadedGltfObjects}
            selectedShapeId={selectedShapeId}
            mode={mode}
            onShapeClick={handleShapeClick}
            onShapeUpdate={handleShapeUpdateFromTransformControls} // Updated to pass (id, saveHistory)
            orbitControlsEnabled={
              !isAnimating ||
              !selectedShape?.animation ||
              selectedShape.animation.type === "none" ||
              isBaking ||
              (selectedShape?.type === "importedGLB" &&
                animationPlaybackState === "playing")
            }
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
            onR3FContextReady={handleR3FContextReady}
            refreshKey={refreshKey}
          />
          <PropertiesPanel
            selectedShape={selectedShape}
            updateShape={updateShapeAndSave} // Passes updateShapeAndSave for direct saves
            removeShape={removeShape}
            duplicateShape={duplicateShape}
            addShape={addShape}
            handleClearTexture={handleClearTexture}
            shapeTextureFileInputRefs={shapeTextureFileInputRefs}
            textTextureFileInputRefs={textTextureFileInputRefs}
          />
        </div>
        {selectedShape?.type === "importedGLB" && animationClips.length > 0 && (
          <div className='p-4 border-t border-border/60 bg-background/70 backdrop-blur-sm'>
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
        <StatusBar shapesCount={shapes.length} selectedShape={selectedShape} />
      </div>
    </TooltipProvider>
  );
}
