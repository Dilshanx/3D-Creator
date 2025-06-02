import { useState, useRef, useCallback, useEffect } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { TextureLoader } from "three";

import { TooltipProvider } from "@/components/ui/tooltip";

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
    dracoLoader.setDecoderPath("/draco/gltf/");
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
      console.log(
        "Model3DCreator: Default EXPORT font (Helvetiker) pre-loaded."
      );
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
  const [animationTime, setAnimationTime] = useState(0);
  const [animationDuration, setAnimationDuration] = useState(0);
  const [isAnimationLooping, setIsAnimationLooping] = useState(true);
  const [animationPlaybackSpeed, setAnimationPlaybackSpeed] = useState(1.0);
  const [playAllAnimations, setPlayAllAnimations] = useState(false);

  const selectedShape = shapes.find((shape) => shape.id === selectedShapeId);

  const jsonFileInputRef = useRef(null);
  const glbFileInputRef = useRef(null);
  const imageFileInputRef = useRef(null);
  const shapeTextureFileInputRefs = useRef({});
  const textTextureFileInputRefs = useRef({});

  // ... (all other hooks and functions like useEffect, saveState, addShape, etc. remain the same) ...
  // (Copy paste all functions from the previous correct full listing here)
  useEffect(() => {
    if (selectedShape && selectedShape.type === "importedGLB") {
      const gltfData = loadedGltfObjects[selectedShape.id];
      if (gltfData && gltfData.animations) {
        setAnimationClips(gltfData.animations);
        if (gltfData.animations.length > 0) {
          setSelectedAnimationClipIndex(0);
          setAnimationDuration(gltfData.animations[0].duration || 0);
          setAnimationPlaybackState("stopped");
          setAnimationTime(0);
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
    } else {
      setAnimationClips([]);
      setSelectedAnimationClipIndex(-1);
      setAnimationDuration(0);
    }
  }, [selectedShape, loadedGltfObjects]);

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
    }));
    setUndoStack((prev) => [...prev, state]);
    setRedoStack([]);
  }, [shapes, isBaking]);

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
    };
    if (selectedShape.type === "text" && selectedShape.textTextureProps) {
      duplicatedShapeData.textTextureProps = {
        ...selectedShape.textTextureProps,
      };
    }
    if (
      selectedShape.type === "importedGLB" &&
      loadedGltfObjects[selectedShape.id]
    ) {
      const originalGltfObject = loadedGltfObjects[selectedShape.id];
      const clonedScene = originalGltfObject.scene.clone(true);
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
      updateShape(shapeId, updates);
    },
    [updateShape, saveState, isBaking]
  );

  const handleShapeClick = useCallback(
    (shapeId) => {
      if (isBaking) return;
      setSelectedShapeId(shapeId);
    },
    [isBaking]
  );

  const handleShapeUpdateFromTransformControls = useCallback(
    (shapeIdToUpdate) => {
      if (isBaking || !shapeIdToUpdate || !sceneRef.current) return;
      const currentShapeData = shapes.find((s) => s.id === shapeIdToUpdate);
      if (!currentShapeData) return;
      let objectNameSuffix =
        currentShapeData.name ||
        currentShapeData.shapeType ||
        (currentShapeData.type === "text"
          ? currentShapeData.text?.substring(0, 10) || "Text"
          : "");
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
        setShapes((prevShapes) =>
          prevShapes.map((s) =>
            s.id === shapeIdToUpdate ? { ...s, ...newUpdates } : s
          )
        );
        saveState();
      } else {
        console.warn(
          `[Model3DCreator] TransformControls target object "${objectName}" not found for update.`
        );
      }
    },
    [shapes, saveState, isBaking]
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
      })),
      ...prevRedo,
    ]);
    setUndoStack(prevStates);
    setShapes(stateToRestore);
    setSelectedShapeId(null);
  }, [undoStack, shapes, isBaking]);

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
      })),
      ...prevUndo,
    ]);
    setRedoStack(nextStates);
    setShapes(stateToRestore);
    setSelectedShapeId(null);
  }, [redoStack, shapes, isBaking]);

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
          return { ...baseShape, originalFileName: s.name };
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
          version: "2.7-textures-centered-scaled",
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
      const textureLoaderForExport = new TextureLoader();
      const loadTextureAsync = (url) =>
        new Promise((resolve, reject) => {
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
            modelClone.position.fromArray(shapeData.position);
            modelClone.rotation.fromArray(shapeData.rotation);
            modelClone.scale.fromArray(shapeData.scale);
            modelClone.name = `shape_${shapeData.id}_${shapeData.type}_${
              shapeData.name || ""
            }`;
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
              console.error("StaticExport: Font load failed", e);
              return null;
            }
          }
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
          } else if (expectedZDepth === 0 && actualZDepth === 0) {
            zScaleFactor = 1.0;
          } else if (actualZDepth === 0 && expectedZDepth !== 0) {
            console.warn(
              `TextGeo for "${shapeData.text}" created with zero Z depth, expected ${expectedZDepth}.`
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
          const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(shapeData.color || "#ffffff"),
            roughness: saneNumber(shapeData.roughness, 0.5),
            metalness: saneNumber(shapeData.metalness, 0.0),
          });
          const texProps = shapeData.textTextureProps || initialTextureProps;
          if (texProps.mapUrl) {
            material.map = await loadTextureAsync(texProps.mapUrl);
            material.color.set(0xffffff);
            material.map.colorSpace = THREE.SRGBColorSpace;
          }
          if (texProps.normalMapUrl)
            material.normalMap = await loadTextureAsync(texProps.normalMapUrl);
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
            if (texProps.mapUrl) {
              newMaterial.map = await loadTextureAsync(texProps.mapUrl);
              newMaterial.color.set(0xffffff);
              newMaterial.map.colorSpace = THREE.SRGBColorSpace;
            }
            if (texProps.normalMapUrl)
              newMaterial.normalMap = await loadTextureAsync(
                texProps.normalMapUrl
              );
            if (texProps.roughnessMapUrl)
              newMaterial.roughnessMap = await loadTextureAsync(
                texProps.roughnessMapUrl
              );
            if (texProps.metalnessMapUrl)
              newMaterial.metalnessMap = await loadTextureAsync(
                texProps.metalnessMapUrl
              );
            if (texProps.aoMapUrl) {
              newMaterial.aoMap = await loadTextureAsync(texProps.aoMapUrl);
              newMaterial.aoMapIntensity = 1;
              if (
                mesh.geometry.attributes.uv2 === undefined &&
                mesh.geometry.attributes.uv
              )
                mesh.geometry.setAttribute("uv2", mesh.geometry.attributes.uv);
            }
            if (texProps.emissiveMapUrl) {
              newMaterial.emissiveMap = await loadTextureAsync(
                texProps.emissiveMapUrl
              );
              newMaterial.emissive = new THREE.Color(0xffffff);
              newMaterial.emissiveMap.colorSpace = THREE.SRGBColorSpace;
            }
            if (!newMaterial.map && shapeData.color)
              newMaterial.color.set(shapeData.color);
            if (shapeData.roughness !== undefined)
              newMaterial.roughness = shapeData.roughness;
            if (shapeData.metalness !== undefined)
              newMaterial.metalness = shapeData.metalness;
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
      const meshes = await Promise.all(meshPromises);
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
      const textureLoaderForExport = new TextureLoader();
      const loadTextureAsync = (url) =>
        new Promise((resolve, reject) => {
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
            targetObjectForAnimation.position.fromArray(shapeData.position);
            targetObjectForAnimation.rotation.fromArray(shapeData.rotation);
            targetObjectForAnimation.scale.fromArray(shapeData.scale);
            targetObjectForAnimation.name = `shape_${shapeData.id}_${
              shapeData.type
            }_${shapeData.name || ""}`;
            exportScene.add(targetObjectForAnimation);
            processedShapeCount++;
            if (
              gltfObjectData.animations &&
              gltfObjectData.animations.length > 0
            )
              allOriginalClips = allOriginalClips.concat(
                gltfObjectData.animations.map((clip) => clip.clone())
              );
          } else {
            return null;
          }
        } else if (shapeData.type === "text") {
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
              console.error("AnimExport: Font load failed", e);
              return null;
            }
          }
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
          } else if (expectedZDepth === 0 && actualZDepth === 0) {
            zScaleFactor = 1.0;
          } else if (actualZDepth === 0 && expectedZDepth !== 0) {
            console.warn(
              `TextGeo (Anim) for "${shapeData.text}" created with zero Z depth, expected ${expectedZDepth}.`
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
          const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(shapeData.color || "#ffffff"),
            roughness: saneNumber(shapeData.roughness, 0.5),
            metalness: saneNumber(shapeData.metalness, 0.0),
          });
          const texProps = shapeData.textTextureProps || initialTextureProps;
          if (texProps.mapUrl) {
            material.map = await loadTextureAsync(texProps.mapUrl);
            material.color.set(0xffffff);
            material.map.colorSpace = THREE.SRGBColorSpace;
          }
          if (texProps.normalMapUrl)
            material.normalMap = await loadTextureAsync(texProps.normalMapUrl);
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
            if (texProps.mapUrl) {
              newMaterial.map = await loadTextureAsync(texProps.mapUrl);
              newMaterial.color.set(0xffffff);
              newMaterial.map.colorSpace = THREE.SRGBColorSpace;
            }
            if (texProps.normalMapUrl)
              newMaterial.normalMap = await loadTextureAsync(
                texProps.normalMapUrl
              );
            if (texProps.roughnessMapUrl)
              newMaterial.roughnessMap = await loadTextureAsync(
                texProps.roughnessMapUrl
              );
            if (texProps.metalnessMapUrl)
              newMaterial.metalnessMap = await loadTextureAsync(
                texProps.metalnessMapUrl
              );
            if (texProps.aoMapUrl) {
              newMaterial.aoMap = await loadTextureAsync(texProps.aoMapUrl);
              newMaterial.aoMapIntensity = 1;
              if (
                targetObjectForAnimation.geometry.attributes.uv2 ===
                  undefined &&
                targetObjectForAnimation.geometry.attributes.uv
              )
                targetObjectForAnimation.geometry.setAttribute(
                  "uv2",
                  targetObjectForAnimation.geometry.attributes.uv
                );
            }
            if (texProps.emissiveMapUrl) {
              newMaterial.emissiveMap = await loadTextureAsync(
                texProps.emissiveMapUrl
              );
              newMaterial.emissive = new THREE.Color(0xffffff);
              newMaterial.emissiveMap.colorSpace = THREE.SRGBColorSpace;
            }
            if (!newMaterial.map && shapeData.color)
              newMaterial.color.set(shapeData.color);
            if (shapeData.roughness !== undefined)
              newMaterial.roughness = shapeData.roughness;
            if (shapeData.metalness !== undefined)
              newMaterial.metalness = shapeData.metalness;
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
          }_${shapeData.name || shapeData.text?.substring(0, 10) || "Object"}`;
          targetObjectForAnimation.castShadow = shapeData.type !== "imagePlane";
          targetObjectForAnimation.receiveShadow = true;
          exportScene.add(targetObjectForAnimation);
          processedShapeCount++;
        }
        return { shapeData, targetObjectForAnimation };
      });

      const results = await Promise.all(meshCreationPromises);
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
          }
          const totalFrames = Math.max(2, Math.floor(bakeDur * bakeFps));
          const timeStep = bakeDur / (totalFrames - 1);
          const times = [];
          const positions = [];
          const quaternions = [];
          const simObj = new THREE.Object3D();
          simObj.position.copy(targetObjectForAnimation.position);
          simObj.quaternion.copy(targetObjectForAnimation.quaternion);
          let currentOrbitAngle = Math.random() * Math.PI * 2;
          for (let i = 0; i < totalFrames; i++) {
            const time = i * timeStep;
            times.push(time);
            const effSpeedFrame = (animParams.speed || 1) * timeStep;
            switch (animParams.type) {
              case "rotate":
                const axis = animParams.axis || "y";
                const R = new THREE.Quaternion();
                const angle = effSpeedFrame;
                if (axis === "x")
                  R.setFromAxisAngle(new THREE.Vector3(1, 0, 0), angle);
                else if (axis === "y")
                  R.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
                else R.setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);
                simObj.quaternion.premultiply(R);
                break;
              case "orbit":
                currentOrbitAngle += effSpeedFrame * 0.2;
                const r = animParams.orbitRadius || 5;
                const cX = animParams.orbitCenter?.[0] || 0;
                const cY =
                  animParams.orbitCenter?.[1] ||
                  targetObjectForAnimation.position.y;
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
        alert("No valid shapes processed for animated export.");
        setIsBaking(false);
        return;
      }
      exportScene.animations = [...allBakedClips, ...allOriginalClips];
      if (exportScene.animations.length > 0)
        console.log(
          `[BAKED GLB EXPORT] Added ${exportScene.animations.length} animation clips.`
        );
      exportToGLB(exportScene, `baked-animated-model-${Date.now()}.glb`);
    } catch (error) {
      console.error("[BAKED GLB EXPORT] Critical error:", error);
      alert("Animated GLB Export failed: " + error.message);
    } finally {
      setIsBaking(false);
    }
  }, [shapes, loadedGltfObjects, isBaking]);

  // ***** THIS IS THE CORRECTED PLACEMENT *****
  const editorSidebarShapeOptions = [
    { name: "Cube", geometry: "box", icon: "🧊" },
    { name: "Sphere", geometry: "sphere", icon: "⚪" },
    { name: "Cylinder", geometry: "cylinder", icon: "🥫" },
    { name: "Cone", geometry: "cone", icon: "🔺" },
    { name: "Torus", geometry: "torus", icon: "🍩" },
    { name: "Pyramid", geometry: "pyramid", icon: "🔺" },
    { name: "3D Text", geometry: "text", icon: "📝" },
  ];
  // ***** END CORRECTED PLACEMENT *****

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
          setIsAnimating((prev) => !prev);
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
    isAnimating,
  ]);

  const toggleGlobalAnimation = useCallback(() => {
    if (isBaking) return;
    setIsAnimating((prev) => !prev);
  }, [isBaking]);
  const triggerJsonFileImport = useCallback(() => {
    if (isBaking) {
      alert("Cannot import while baking.");
      return;
    }
    if (jsonFileInputRef.current) jsonFileInputRef.current.click();
  }, [isBaking]);

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
              );
              alert(
                `Scene loaded with ${newShapes.length} shapes. Imported GLB models (if any) require re-importing their files (for centering/scaling to apply if this logic wasn't present when JSON was saved).`
              );
            } else {
              alert(
                "Invalid JSON: 'shapes' array missing or incorrect format."
              );
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

  const triggerGlbFileImport = useCallback(() => {
    if (isBaking) {
      alert("Cannot import while baking.");
      return;
    }
    if (glbFileInputRef.current) glbFileInputRef.current.click();
  }, [isBaking]);

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
                  console.log(
                    `GLB auto-scaled. Original max size: ${currentMaxSize.toFixed(
                      2
                    )}, Scale factor: ${scaleFactor.toFixed(2)}`
                  );
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
                  console.log(
                    `GLB centered. Original center: ${center
                      .toArray()
                      .map((c) => c.toFixed(2))}`
                  );
                } else {
                  console.log("GLB already centered or close to origin.");
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

  const triggerImageFileImport = useCallback(() => {
    if (isBaking) {
      alert("Cannot import while baking.");
      return;
    }
    if (imageFileInputRef.current) imageFileInputRef.current.click();
  }, [isBaking]);

  const processAndAddImageFile = useCallback(
    (file) => {
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file (PNG, JPG, GIF, etc.).");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e_reader) => {
        const imageDataUrl = e_reader.target.result;
        const img = new Image();
        img.onload = () => {
          addImagePlane(imageDataUrl, img.width, img.height, file.name);
        };
        img.onerror = () => {
          alert("Could not load image to get dimensions.");
        };
        img.src = imageDataUrl;
      };
      reader.onerror = () => {
        alert("Error reading image file.");
      };
      reader.readAsDataURL(file);
    },
    [addImagePlane]
  );

  const handleImageFileImport = useCallback(
    (event) => {
      if (isBaking) {
        alert("Cannot import while baking.");
        return;
      }
      const file = event.target.files[0];
      if (file) {
        processAndAddImageFile(file);
      }
      if (event.target) event.target.value = null;
    },
    [isBaking, processAndAddImageFile]
  );

  const handleDropOnCanvas = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (isBaking) {
        alert("Cannot import files while baking.");
        return;
      }
      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        const file = event.dataTransfer.files[0];
        if (file.name.match(/\.(glb|gltf)$/i)) {
          const pseudoEvent = { target: { files: [file], value: null } };
          handleGlbFileImport(pseudoEvent);
        } else if (file.type.startsWith("image/")) {
          processAndAddImageFile(file);
        } else if (file.name.match(/\.(json)$/i)) {
          const pseudoEvent = { target: { files: [file], value: null } };
          handleJsonFileImport(pseudoEvent);
        } else {
          alert(
            "Unsupported file type dropped. Please drop GLB, GLTF, image, or JSON files."
          );
        }
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
      if (isBaking || shapes.length < 2) return;
      saveState();
      let targetValue;
      if (reference === "average") {
        const sum = shapes.reduce(
          (acc, s) => acc + s.position[axis === "x" ? 0 : axis === "y" ? 1 : 2],
          0
        );
        targetValue = sum / shapes.length;
      } else {
        targetValue = 0;
      }
      setShapes((prevShapes) =>
        prevShapes.map((s) => {
          const newPosition = [...s.position];
          newPosition[axis === "x" ? 0 : axis === "y" ? 1 : 2] = targetValue;
          return { ...s, position: newPosition };
        })
      );
    },
    [shapes, saveState, isBaking]
  );

  const alignSelectedShapeToOrigin = useCallback(
    (axis) => {
      if (isBaking || !selectedShapeId) return;
      saveState();
      setShapes((prevShapes) =>
        prevShapes.map((s) => {
          if (s.id === selectedShapeId) {
            const newPosition = [...s.position];
            newPosition[axis === "x" ? 0 : axis === "y" ? 1 : 2] = 0;
            if (axis === "y") {
              let yOffset = 0;
              if (s.scale && s.scale[1]) {
                if (s.type === "pyramid") yOffset = 0;
                else if (s.type === "text")
                  yOffset = (s.textSize || 0.5) * s.scale[1] * 0.5;
                else if (s.type === "imagePlane")
                  yOffset = ((s.planeHeight || 1) * s.scale[1]) / 2;
                else if (s.type === "importedGLB") {
                  yOffset = 0;
                } else yOffset = s.scale[1] * 0.5;
              }
              newPosition[1] = yOffset;
            }
            return { ...s, position: newPosition };
          }
          return s;
        })
      );
    },
    [shapes, selectedShapeId, saveState, isBaking]
  );

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
    }
  };
  const handleAnimationTimeChange = (normalizedTime) => {
    setAnimationTime(normalizedTime);
  };
  const handleAnimationLoopToggle = (checked) => {
    setIsAnimationLooping(checked);
  };
  const handleAnimationSpeedChange = (speed) => {
    setAnimationPlaybackSpeed(speed);
  };
  const handlePlayAllAnimationsToggle = (checked) => {
    setPlayAllAnimations(checked);
    if (checked) {
      const maxDuration = animationClips.reduce(
        (max, clip) => Math.max(max, clip.duration || 0),
        0
      );
      setAnimationDuration(maxDuration);
    } else if (
      animationClips.length > 0 &&
      selectedAnimationClipIndex >= 0 &&
      selectedAnimationClipIndex < animationClips.length
    ) {
      setAnimationDuration(
        animationClips[selectedAnimationClipIndex].duration || 0
      );
    } else if (animationClips.length > 0) {
      setSelectedAnimationClipIndex(0);
      setAnimationDuration(animationClips[0].duration || 0);
    } else {
      setAnimationDuration(0);
    }
  };

  const handleTextureUpload = useCallback(
    (shapeId, mapType, event, isTextSpecific = false) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e_reader) => {
          const newUrl = e_reader.target.result;
          setShapes((prevShapes) =>
            prevShapes.map((s) => {
              if (s.id === shapeId) {
                const targetPropsKey = isTextSpecific
                  ? "textTextureProps"
                  : "textureProps";
                const oldUrl = s[targetPropsKey]?.[`${mapType}Url`];
                if (oldUrl && oldUrl.startsWith("blob:")) {
                  URL.revokeObjectURL(oldUrl);
                }
                return {
                  ...s,
                  [targetPropsKey]: {
                    ...(s[targetPropsKey] || initialTextureProps),
                    [`${mapType}Url`]: newUrl,
                  },
                };
              }
              return s;
            })
          );
        };
        reader.readAsDataURL(file);
      }
      if (event.target) event.target.value = null;
    },
    []
  );

  const handleClearTexture = useCallback(
    (shapeId, mapType, isTextSpecific = false) => {
      setShapes((prevShapes) =>
        prevShapes.map((s) => {
          if (s.id === shapeId) {
            const targetPropsKey = isTextSpecific
              ? "textTextureProps"
              : "textureProps";
            const oldUrl = s[targetPropsKey]?.[`${mapType}Url`];
            if (oldUrl && oldUrl.startsWith("blob:")) {
              URL.revokeObjectURL(oldUrl);
            }
            return {
              ...s,
              [targetPropsKey]: {
                ...(s[targetPropsKey] || initialTextureProps),
                [`${mapType}Url`]: null,
              },
            };
          }
          return s;
        })
      );
    },
    []
  );

  if (!R3FCanvasCheck) return <FallbackCreator />;

  return (
    <TooltipProvider>
      <div
        className={`flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-foreground ${
          isBaking ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {/* File Inputs */}
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
        {Object.keys(initialTextureProps).map((mapType) => (
          <input
            key={`shape-tex-input-${mapType}`}
            type='file'
            accept='image/*'
            ref={(el) => (shapeTextureFileInputRefs.current[mapType] = el)}
            onChange={(e) =>
              selectedShapeId &&
              handleTextureUpload(
                selectedShapeId,
                mapType.replace("Url", ""),
                e,
                false
              )
            }
            style={{ display: "none" }}
          />
        ))}
        {Object.keys(initialTextureProps).map(
          (mapType) =>
            (mapType === "mapUrl" || mapType === "normalMapUrl") && (
              <input
                key={`text-tex-input-${mapType}`}
                type='file'
                accept='image/*'
                ref={(el) => (textTextureFileInputRefs.current[mapType] = el)}
                onChange={(e) =>
                  selectedShapeId &&
                  handleTextureUpload(
                    selectedShapeId,
                    mapType.replace("Url", ""),
                    e,
                    true
                  )
                }
                style={{ display: "none" }}
              />
            )
        )}

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
              Baking Animations... Please Wait
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
            onShapeUpdate={handleShapeUpdateFromTransformControls}
            orbitControlsEnabled={
              !isAnimating ||
              !selectedShape?.animation ||
              selectedShape.animation.type === "none" ||
              isBaking ||
              (selectedShape?.type === "importedGLB" &&
                animationPlaybackState === "playing")
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
          />
        </div>
        {selectedShape &&
          selectedShape.type === "importedGLB" &&
          animationClips.length > 0 && (
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
