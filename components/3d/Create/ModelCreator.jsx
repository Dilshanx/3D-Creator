
import { useState, useRef, useCallback, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

import { TooltipProvider } from "@/components/ui/tooltip";

import PropertiesPanel from "./PropertiesPanel";
import EditorSidebar from "./EditorSidebar";
import EditorToolbar from "./EditorToolbar";
import CanvasView from "./CanvasView";
import StatusBar from "./StatusBar";
import FallbackCreator from "./FallbackCreator";

import {
  MainScene,
  CameraController,
  createMeshFromShape, // Used for procedural shape export
  exportToGLB, // Generic GLB exporter
} from "./SceneElements";

let R3FCanvasCheck;
try {
  const r3f = require("@react-three/fiber");
  R3FCanvasCheck = r3f.Canvas;
} catch (error) {
  // Error handled by FallbackCreator
}

let gltfLoaderInstance;
const getGltfLoader = () => {
  if (!gltfLoaderInstance) {
    gltfLoaderInstance = new GLTFLoader();
    // Optional Draco setup:
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/gltf/");
    gltfLoaderInstance.setDRACOLoader(dracoLoader);
  }
  return gltfLoaderInstance;
};

export default function Model3DCreator() {
  if (!R3FCanvasCheck) return <FallbackCreator />;

  const [shapes, setShapes] = useState([]);
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [mode, setMode] = useState("translate"); // "translate", "rotate", "scale"
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [cameraPreset, setCameraPreset] = useState(null);
  const sceneRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isBaking, setIsBaking] = useState(false);
  const [loadedGltfObjects, setLoadedGltfObjects] = useState({});

  const selectedShape = shapes.find((shape) => shape.id === selectedShapeId);
  const pendingSaveAfterDrag = useRef(false); // For deferring saveState

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
    }));
    setUndoStack((prev) => [...prev, state]);
    setRedoStack([]);
  }, [shapes, isBaking]);

  const addShape = useCallback(
    (geometryType, options = {}) => {
      if (geometryType === "importedGLB") {
        console.error("Use triggerGlbFileImport for GLB models.");
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
      };
      let specificProps = {};
      if (geometryType === "text") {
        specificProps = { text: "Text", textSize: 0.5, name: "3D Text" };
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
    (gltfData, fileName) => {
      saveState();
      const newShapeId = Date.now().toString();
      const newShape = {
        id: newShapeId,
        type: "importedGLB",
        name: fileName.split(".").slice(0, -1).join(".") || "Imported Model",
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        animation: {
          type: "none",
          speed: 1,
          axis: "y",
          orbitCenter: [0, 0, 0],
          orbitRadius: 5,
          orbitPlane: "xz",
        },
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
                  if (Array.isArray(child.material)) {
                    child.material.forEach((mat) => {
                      mat.map?.dispose();
                      mat.dispose();
                    });
                  } else {
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
    [selectedShapeId, saveState, isBaking, shapes, loadedGltfObjects]
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
        : {
            type: "none",
            speed: 1,
            axis: "y",
            orbitCenter: [0, 0, 0],
            orbitRadius: 5,
            orbitPlane: "xz",
          },
    };
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
          animations: originalGltfObject.animations || [],
        },
      }));
    }
    setShapes((prev) => [...prev, duplicatedShapeData]);
    setSelectedShapeId(newId);
  }, [selectedShape, saveState, isBaking, loadedGltfObjects]);

  const updateShape = useCallback(
    (shapeId, updates) => {
      // Only updates React state, no saveState
      if (isBaking) return;
      setShapes((prev) =>
        prev.map((shape) =>
          shape.id === shapeId ? { ...shape, ...updates } : shape
        )
      );
    },
    [isBaking]
  );

  const updateShapeAndSave = useCallback(
    (shapeId, updates) => {
      // For discrete changes from PropertiesPanel
      if (isBaking) return;
      saveState();
      updateShape(shapeId, updates);
    },
    [updateShape, saveState, isBaking]
  );

  const handleShapeClick = useCallback(
    (shapeId, event) => {
      if (isBaking) return;
      setSelectedShapeId(shapeId);
    },
    [isBaking]
  );

  const handleShapeUpdateFromTransformControls = useCallback(
    (shapeIdToUpdate, isDraggingCurrently) => {
      if (isBaking || !shapeIdToUpdate || !sceneRef.current) return;
      const currentShapeData = shapes.find((s) => s.id === shapeIdToUpdate);
      if (!currentShapeData) return;

      const objectName = `shape_${currentShapeData.id}_${
        currentShapeData.type
      }_${currentShapeData.name || currentShapeData.shapeType || ""}`;
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
        // Update React state immediately for UI responsiveness (e.g., PropertiesPanel)
        setShapes((prevShapes) =>
          prevShapes.map((s) =>
            s.id === shapeIdToUpdate ? { ...s, ...newUpdates } : s
          )
        );

        if (!isDraggingCurrently) {
          // If drag finished or it's a discrete change
          if (pendingSaveAfterDrag.current) {
            saveState();
            pendingSaveAfterDrag.current = false;
          } else {
            // Could be a click-transform without drag (e.g. snapping), or programmatic.
            saveState(); // Save immediately if not part of a drag sequence.
          }
        } else {
          // isDraggingCurrently is true
          pendingSaveAfterDrag.current = true; // Mark that a save is needed when dragging stops.
        }
      } else {
        console.warn(
          `[Model3DCreator] TransformControls target object "${objectName}" not found.`
        );
      }
    },
    [shapes, saveState, isBaking, pendingSaveAfterDrag]
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
      })),
      ...prevUndo,
    ]);
    setRedoStack(nextStates);
    setShapes(stateToRestore);
    setSelectedShapeId(null);
  }, [redoStack, shapes, isBaking]);

  const exportJSON = useCallback(() => {
    // ... (Full exportJSON from previous, assumed correct for serializing metadata) ...
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
            : {
                type: "none",
                speed: 1,
                axis: "y",
                orbitCenter: [0, 0, 0],
                orbitRadius: 5,
                orbitPlane: "xz",
              },
        };
        if (s.type === "text")
          return {
            ...baseShape,
            text: s.text,
            textSize: s.textSize,
            color: s.color,
            material: s.material,
            roughness: s.roughness,
            metalness: s.metalness,
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
          version: "2.5.1-glb",
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

  const exportCommonGLBSetup = (exportScene) => {
    // ... (Full exportCommonGLBSetup from previous) ...
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    exportScene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(8, 15, 10);
    directionalLight.castShadow = true;
    exportScene.add(directionalLight);
  };

  const exportStaticGLBFile = useCallback(() => {
    // ... (Full exportStaticGLBFile from previous, using createMeshFromShape and loadedGltfObjects) ...
    if (isBaking) {
      alert("Cannot export while baking.");
      return;
    }
    if (shapes.length === 0) {
      alert("No shapes to export.");
      return;
    }
    try {
      const exportScene = new THREE.Scene();
      exportScene.name = "StaticExportScene";
      exportCommonGLBSetup(exportScene);
      let successfullyAddedCount = 0;
      shapes.forEach((shapeData) => {
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
            exportScene.add(modelClone);
            successfullyAddedCount++;
          }
        } else {
          const mesh = createMeshFromShape(shapeData);
          if (mesh) {
            exportScene.add(mesh);
            successfullyAddedCount++;
          }
        }
      });
      if (successfullyAddedCount === 0) {
        alert("No shapes could be prepared for Static GLB export.");
        return;
      }
      exportToGLB(exportScene, `static-model-${Date.now()}.glb`);
    } catch (error) {
      console.error("[STATIC GLB EXPORT] Critical error:", error);
      alert("Static GLB Export failed: " + error.message);
    }
  }, [shapes, loadedGltfObjects, isBaking]);

  const bakeAndExportAnimatedGLB = useCallback(async () => {
    // ... (Full bakeAndExportAnimatedGLB from previous, using createMeshFromShape for procedurals,
    // cloning loadedGltfObjects for imported, and baking procedural animations) ...
    if (shapes.length === 0) {
      alert("No shapes to animate and export.");
      return;
    }
    if (isBaking) {
      alert("Baking process already in progress.");
      return;
    }
    setIsBaking(true);
    await new Promise((resolve) => setTimeout(resolve, 50));
    try {
      const exportScene = new THREE.Scene();
      exportScene.name = "BakedAnimatedScene";
      exportCommonGLBSetup(exportScene);
      const allBakedClips = [];
      let allOriginalClips = [];
      let processedShapeCount = 0;
      for (const shapeData of shapes) {
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
            continue;
          }
        } else {
          targetObjectForAnimation = createMeshFromShape(shapeData);
          if (!targetObjectForAnimation) {
            continue;
          }
          exportScene.add(targetObjectForAnimation);
          processedShapeCount++;
        }
        if (
          shapeData.animation &&
          shapeData.animation.type !== "none" &&
          targetObjectForAnimation
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
        alert("No valid shapes processed.");
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

  const alignAllShapes = useCallback(
    /* ... (code from previous) ... */ (axis, reference = "average") => {
      if (isBaking) {
        alert("Cannot perform actions while baking.");
        return;
      }
      if (shapes.length < 1) {
        alert("No shapes to align.");
        return;
      }
      saveState();
      let targetValue;
      const axisIndex = axis === "x" ? 0 : axis === "y" ? 1 : 2;
      if (reference === "average") {
        const sum = shapes.reduce(
          (acc, shape) => acc + (shape.position[axisIndex] || 0),
          0
        );
        targetValue = sum / shapes.length;
      } else {
        alert("Unsupported alignment reference.");
        return;
      }
      const updatedShapes = shapes.map((shape) => {
        const newPosition = [...shape.position];
        newPosition[axisIndex] = targetValue;
        return { ...shape, position: newPosition };
      });
      setShapes(updatedShapes);
      alert(`All shapes aligned on ${axis.toUpperCase()}-axis to average.`);
    },
    [shapes, saveState, isBaking]
  );

  const alignSelectedShapeToOrigin = useCallback(
    /* ... (code from previous) ... */ (axis) => {
      if (isBaking) {
        alert("Cannot perform actions while baking.");
        return;
      }
      if (!selectedShapeId) {
        alert("No shape selected to align.");
        return;
      }
      const shapeIndex = shapes.findIndex((s) => s.id === selectedShapeId);
      if (shapeIndex === -1) {
        return;
      }
      saveState();
      const axisIndex = axis === "x" ? 0 : axis === "y" ? 1 : 2;
      const updatedShapes = shapes.map((shape, index) => {
        if (index === shapeIndex) {
          const newPosition = [...shape.position];
          newPosition[axisIndex] = 0;
          return { ...shape, position: newPosition };
        }
        return shape;
      });
      setShapes(updatedShapes);
      alert(`Selected shape aligned on ${axis.toUpperCase()}-axis to origin.`);
    },
    [shapes, selectedShapeId, saveState, isBaking]
  );

  const editorSidebarShapeOptions = [
    { name: "Cube", geometry: "box", icon: "🧊" },
    { name: "Sphere", geometry: "sphere", icon: "⚪" },
    { name: "Cylinder", geometry: "cylinder", icon: "🥫" },
    { name: "Cone", geometry: "cone", icon: "🔺" },
    { name: "Torus", geometry: "torus", icon: "🍩" },
    { name: "Pyramid", geometry: "pyramid", icon: "🔺" },
    { name: "3D Text", geometry: "text", icon: "📝" },
  ];

  useEffect(() => {
    // Keydown handlers
    const handleKeyDown = (event) => {
      if (
        isBaking ||
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA" ||
        event.target.isContentEditable
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
    mode,
    isBaking,
    isAnimating,
  ]);

  const toggleGlobalAnimation = useCallback(() => {
    if (isBaking) return;
    setIsAnimating((prev) => !prev);
  }, [isBaking]);

  const jsonFileInputRef = useRef(null);
  const triggerJsonFileImport = () => {
    if (jsonFileInputRef.current && !isBaking) {
      jsonFileInputRef.current.value = null;
      jsonFileInputRef.current.click();
    }
  };
  const handleJsonFileImport = (event) => {
    // ... (Full handleJsonFileImport from previous, ensuring defaults and handling importedGLB metadata) ...
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
              };
              if (s.type === "importedGLB")
                return {
                  ...baseShape,
                  originalFileName: s.originalFileName || s.name,
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
              `Scene loaded with ${newShapes.length} shapes. Imported GLB models (if any) need re-import.`
            );
          } else {
            alert("Invalid JSON: 'shapes' array missing or incorrect format.");
          }
        } catch (error) {
          console.error("Error parsing imported JSON:", error);
          alert("Error parsing JSON file: " + error.message);
        }
      };
      reader.readAsText(file);
      event.target.value = null;
    }
  };

  const glbFileInputRef = useRef(null);
  const triggerGlbFileImport = () => {
    if (glbFileInputRef.current && !isBaking) {
      glbFileInputRef.current.value = null;
      glbFileInputRef.current.click();
    }
  };
  const handleGlbFileImport = (event) => {
    // ... (Full handleGlbFileImport from previous, using getGltfLoader and addImportedShape) ...
    if (isBaking) {
      alert("Cannot import while baking.");
      return;
    }
    const file = event.target.files[0];
    if (
      file &&
      (file.name.toLowerCase().endsWith(".glb") ||
        file.name.toLowerCase().endsWith(".gltf"))
    ) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const buffer = e.target.result;
          const loader = getGltfLoader();
          loader.parse(
            buffer,
            "",
            (gltf) => {
              addImportedShape(gltf, file.name);
              alert(`${file.name} imported successfully!`);
            },
            (error) => {
              console.error("Error parsing GLB/GLTF:", error);
              alert(
                `Error parsing ${file.name}: ${error.message || String(error)}`
              );
            }
          );
        } catch (error) {
          console.error("Error reading GLB/GLTF file:", error);
          alert("Error reading file.");
        }
      };
      reader.readAsArrayBuffer(file);
      event.target.value = null;
    } else if (file) {
      alert("Please select a .glb or .gltf file.");
    }
  };

  const handleDropOnCanvas = useCallback(
    (event) => {
      // ... (Full handleDropOnCanvas from previous) ...
      event.preventDefault();
      event.stopPropagation();
      if (isBaking) {
        alert("Cannot import while baking.");
        return;
      }
      const files = event.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (
          file &&
          (file.name.toLowerCase().endsWith(".glb") ||
            file.name.toLowerCase().endsWith(".gltf"))
        ) {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const buffer = e.target.result;
              const loader = getGltfLoader();
              loader.parse(
                buffer,
                "",
                (gltf) => {
                  addImportedShape(gltf, file.name);
                  alert(`${file.name} imported via drag & drop!`);
                },
                (error) => {
                  console.error("Error parsing dropped GLB/GLTF:", error);
                  alert(
                    `Error parsing ${file.name}: ${
                      error.message || "Unknown error"
                    }`
                  );
                }
              );
            } catch (err) {
              console.error("Error processing dropped file:", err);
              alert("Error processing dropped file.");
            }
          };
          reader.readAsArrayBuffer(file);
        } else if (file) {
          alert("Please drop a .glb or .gltf file.");
        }
      }
    },
    [isBaking, addImportedShape]
  );

  return (
    <TooltipProvider>
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

        {isBaking && (
          <div className='absolute inset-0 bg-black/70 flex items-center justify-center z-50'>
            <div className='text-white text-2xl p-8 bg-slate-700 rounded-lg shadow-xl flex items-center'>
              <svg
                className='animate-spin h-8 w-8 text-white mr-3'
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
              </svg>
              Baking Animations...
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
              isBaking
            }
            sceneRef={sceneRef}
            cameraPreset={cameraPreset}
            selectedShape={selectedShape}
            setSelectedShapeId={setSelectedShapeId}
            SceneComponent={MainScene}
            CameraControllerComponent={CameraController}
            isAnimating={isAnimating}
            onDropOnCanvas={handleDropOnCanvas}
          />
          <PropertiesPanel
            selectedShape={selectedShape}
            updateShape={updateShapeAndSave}
            removeShape={removeShape}
            duplicateShape={duplicateShape}
            addShape={addShape}
          />
        </div>
        <StatusBar shapesCount={shapes.length} selectedShape={selectedShape} />
      </div>
    </TooltipProvider>
  );
}
