import React, { useRef, useEffect, useState, useCallback } from "react";
import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";
import { Loader2, XCircle } from "lucide-react"; // Ensure XCircle is imported if used directly here

import { Button } from "@/components/ui/button"; // Assuming shadcn ui path
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { TDSLoader } from "three/examples/jsm/loaders/TDSLoader.js";
import * as THREE from "three";

import { ThreeDCanvas } from "./three-d-viewer/ThreeDCanvas";
import { CategorySelector } from "./controls/CategorySelector";
import { ShapeSelector } from "./controls/ShapeSelector";
import { AnimationControls } from "./controls/AnimationControls";
import { FileTextureControls } from "./controls/FileTextureControls";
import { SettingsButton } from "./controls/SettingsButton";
import { SettingsDialog } from "./dialogs/SettingsDialog";
import { ExportingDialog } from "./dialogs/ExportingDialog";

import {
  CATEGORIES_DATA,
  SHAPES_BY_CATEGORY_DATA,
  BACKGROUND_OPTIONS_DATA,
  ANIMATION_PRESETS_DATA, // Make sure this is exported from constants.js
  saneNumber,
} from "./lib/constants";
import { createAdvancedMaterial } from "./lib/three-helpers"; // Assuming this is in three-helpers

let gltfLoaderInstance;
const getGltfLoader = () => {
  if (!gltfLoaderInstance) {
    gltfLoaderInstance = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    // IMPORTANT: Ensure this path is correct relative to your `public` folder
    dracoLoader.setDecoderPath("/draco/gltf/");
    gltfLoaderInstance.setDRACOLoader(dracoLoader);
  }
  return gltfLoaderInstance;
};

const ModelViewer3D = () => {
  const [isMounted, setIsMounted] = useState(false);
  const modelFileInputRef = useRef(null);
  const imageFileInputRef = useRef(null);
  const canvasApiRef = useRef(null);

  const [importedModel, setImportedModel] = useState(null);
  const [isImportedModelDisplayed, setIsImportedModelDisplayed] =
    useState(false);
  const [importedModelName, setImportedModelName] = useState("Imported Model");
  const [appliedTexture, setAppliedTexture] = useState(null);
  const textureLoaderRef = useRef(new THREE.TextureLoader());

  // --- Corrected Initialization ---
  const [currentCategory, setCurrentCategory] = useState(CATEGORIES_DATA[0].id);
  const [currentShape, setCurrentShape] = useState(
    SHAPES_BY_CATEGORY_DATA[CATEGORIES_DATA[0].id][0].id
  );

  // --- Local constants for convenience, derived from module-level constants ---
  const categories = CATEGORIES_DATA;
  const shapesByCategory = SHAPES_BY_CATEGORY_DATA;
  const backgroundOptions = BACKGROUND_OPTIONS_DATA;
  const animationPresets = ANIMATION_PRESETS_DATA; // For passing to AnimationControls if it expects the full list

  const [isAnimating, setIsAnimating] = useState(true);
  const [currentAnimationPreset, setCurrentAnimationPreset] =
    useState("gentle"); // State for selected preset value

  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const [settings, setSettings] = useState({
    materialType: "auto",
    shapeColor: "#a78bfa",
    animationSpeed: 1.0,
    extrudeDepth: 0.4,
    quality: "medium",
    background: "studioDark",
    sceneAmbientLightIntensity: 0.25,
    sceneKeyLightIntensity: 0.7,
    sceneEnvMapIntensity: 1.0,
  });
  const currentSettingsRef = useRef(settings);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    currentSettingsRef.current = settings;
  }, [settings]);

  const handleResetAnimation = useCallback(() => {
    if (canvasApiRef.current) {
      canvasApiRef.current.resetControls();
    }
    // setCurrentAnimationPreset("gentle"); // Optionally reset preset selection
    sonnerToast.info("Animation Reset", {
      description: "Model position and rotation restored.",
    });
  }, []);

  const handleToggleAnimation = useCallback(() => {
    setIsAnimating((prev) => {
      sonnerToast.info(`Animation ${!prev ? "Resumed" : "Paused"}`);
      return !prev;
    });
  }, []);

  const handleCategorySelect = useCallback(
    (categoryId) => {
      setIsImportedModelDisplayed(false);
      setImportedModel(null);
      setAppliedTexture(null);
      setCurrentCategory(categoryId);
      setCurrentShape(SHAPES_BY_CATEGORY_DATA[categoryId][0].id);
      handleResetAnimation();
    },
    [handleResetAnimation]
  ); // SHAPES_BY_CATEGORY_DATA is stable

  const handleShapeSelect = useCallback(
    (shapeId) => {
      setIsImportedModelDisplayed(false);
      setImportedModel(null);
      setAppliedTexture(null);
      setCurrentShape(shapeId);
      handleResetAnimation();
    },
    [handleResetAnimation]
  );

  useEffect(() => {
    if (isMounted) handleResetAnimation();
  }, [currentAnimationPreset, isMounted, handleResetAnimation]);

  const handleRandomize = useCallback(() => {
    setIsImportedModelDisplayed(false);
    setImportedModel(null);
    setAppliedTexture(null);
    const randCat =
      CATEGORIES_DATA[Math.floor(Math.random() * CATEGORIES_DATA.length)];
    const randShapeList = SHAPES_BY_CATEGORY_DATA[randCat.id];
    const randShape =
      randShapeList[Math.floor(Math.random() * randShapeList.length)];
    const randPresetKey = Object.keys(ANIMATION_PRESETS_DATA)[
      Math.floor(Math.random() * Object.keys(ANIMATION_PRESETS_DATA).length)
    ];
    const randColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`;
    const bgKeys = Object.keys(BACKGROUND_OPTIONS_DATA);
    const randBgKey = bgKeys[Math.floor(Math.random() * bgKeys.length)];
    const matKeys = [
      "auto",
      "metallic",
      "glass",
      "crystal",
      "ceramic",
      "organic",
      "plastic",
      "neon",
    ];
    const randMat = matKeys[Math.floor(Math.random() * matKeys.length)];

    setCurrentCategory(randCat.id);
    setCurrentShape(randShape.id);
    setCurrentAnimationPreset(randPresetKey);
    setSettings((prev) => ({
      ...prev,
      materialType: randMat,
      shapeColor: randColor,
      background: randBgKey,
      extrudeDepth: saneNumber(Math.random() * (1.0 - 0.1) + 0.1, 0.4),
      animationSpeed: saneNumber(Math.random() * (2.0 - 0.5) + 0.5, 1.0),
      sceneAmbientLightIntensity: saneNumber(
        Math.random() * (1.0 - 0.1) + 0.1,
        0.25
      ),
      sceneKeyLightIntensity: saneNumber(
        Math.random() * (1.5 - 0.3) + 0.3,
        0.7
      ),
      sceneEnvMapIntensity: saneNumber(Math.random() * (2.0 - 0.5) + 0.5, 1.0),
    }));
    sonnerToast.success("Scene Randomized!", {
      description: "Enjoy the new look.",
    });
  }, [handleResetAnimation]); // Dependencies are stable module-level constants

  const currentShapeRef = useRef(currentShape);
  useEffect(() => {
    currentShapeRef.current = currentShape;
  }, [currentShape]);
  const currentImportedModelNameRef = useRef(importedModelName);
  useEffect(() => {
    currentImportedModelNameRef.current = importedModelName;
  }, [importedModelName]);

  const handleExportGLB = useCallback(() => {
    if (
      !canvasApiRef.current ||
      !canvasApiRef.current.getCurrentMesh() ||
      isExporting
    ) {
      sonnerToast.error("Export Error", {
        description: "Cannot export model at this time.",
      });
      return;
    }
    const meshToExport = canvasApiRef.current.getCurrentMesh();
    setIsExporting(true);
    setExportProgress(0);
    const exportToastId = sonnerToast.loading("Exporting GLB...", {
      description: "Preparing model...",
    });
    const exporter = new GLTFExporter();
    let progress = 0;
    const progInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 10 + 5);
      const curProg = Math.min(progress, 95);
      setExportProgress(curProg);
      sonnerToast.loading("Exporting GLB...", {
        id: exportToastId,
        description: `Processing... ${curProg}%`,
      });
      if (curProg >= 95) clearInterval(progInterval);
    }, 150);

    setTimeout(() => {
      try {
        if (!(meshToExport instanceof THREE.Object3D))
          throw new Error("Model not valid for export.");
        const exportOptions = { binary: true };
        if (isImportedModelDisplayed && importedModel?.animations?.length > 0)
          exportOptions.animations = importedModel.animations;

        exporter.parse(
          meshToExport,
          (gltf) => {
            clearInterval(progInterval);
            setExportProgress(100);
            sonnerToast.success("GLB Export Ready", {
              id: exportToastId,
              description: "Download starting.",
            });
            if (!(gltf instanceof ArrayBuffer))
              throw new Error("Exported GLTF not ArrayBuffer.");
            const blob = new Blob([gltf], { type: "application/octet-stream" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            const fileNameToExport = isImportedModelDisplayed
              ? currentImportedModelNameRef.current || "imported-model"
              : currentShapeRef.current || "model";
            link.download = `shape-${fileNameToExport}.glb`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            setTimeout(() => {
              setIsExporting(false);
              setExportProgress(0);
            }, 500);
          },
          (error) => {
            clearInterval(progInterval);
            console.error("GLTFExporter.parse error:", error);
            sonnerToast.error("GLB Export Failed", {
              id: exportToastId,
              description: error.message || "GLTF parsing error.",
            });
            setIsExporting(false);
            setExportProgress(0);
          },
          exportOptions
        );
      } catch (e) {
        clearInterval(progInterval);
        console.error("GLTF export setup error:", e);
        sonnerToast.error("GLB Export Failed", {
          id: exportToastId,
          description: e.message || "Unexpected error.",
        });
        setIsExporting(false);
        setExportProgress(0);
      }
    }, 100);
  }, [isExporting, isImportedModelDisplayed, importedModel]);

  const handleSimulatedExportOBJ = useCallback(() => {
    if (isExporting) return;
    setIsExporting(true);
    setExportProgress(0);
    const exportToastId = sonnerToast.loading("Exporting OBJ (Simulated)...", {
      description: "Processing...",
    });
    let p = 0;
    const i = setInterval(() => {
      p += Math.floor(Math.random() * 15 + 10);
      const currentProgress = Math.min(p, 100);
      setExportProgress(currentProgress);
      sonnerToast.loading("Exporting OBJ (Simulated)...", {
        id: exportToastId,
        description: `Processing... ${currentProgress}%`,
      });
      if (currentProgress >= 100) {
        clearInterval(i);
        const l = document.createElement("a");
        l.download = `shape-${
          isImportedModelDisplayed
            ? currentImportedModelNameRef.current
            : currentShapeRef.current || "model"
        }.obj`;
        l.href =
          "data:text/plain;charset=utf-8," +
          encodeURIComponent(
            "# OBJ file simulated\n# Actual OBJ Exporter Needed"
          );
        document.body.appendChild(l);
        l.click();
        document.body.removeChild(l);
        sonnerToast.success("OBJ Export (Simulated) Ready", {
          id: exportToastId,
          description: "Simulated OBJ downloaded.",
        });
        setTimeout(() => {
          setIsExporting(false);
          setExportProgress(0);
        }, 500);
      }
    }, 150);
  }, [isExporting, isImportedModelDisplayed]);

  const handleTakeScreenshot = useCallback(() => {
    if (
      !canvasApiRef.current ||
      !canvasApiRef.current.getRenderer() ||
      isExporting
    ) {
      sonnerToast.error("Screenshot Failed", {
        description: "Renderer not ready or busy.",
      });
      return;
    }
    const screenshotToastId = sonnerToast.loading("Taking Screenshot...", {
      description: "Capturing image...",
    });
    const renderer = canvasApiRef.current.getRenderer();
    const scene = canvasApiRef.current.getScene();
    const camera = canvasApiRef.current.getCamera();
    const composer = canvasApiRef.current.getComposer();

    if (composer) composer.render();
    else if (renderer && scene && camera) renderer.render(scene, camera);
    else {
      sonnerToast.error("Screenshot Failed", {
        id: screenshotToastId,
        description: "Essential components missing.",
      });
      return;
    }

    setTimeout(() => {
      try {
        const canvas = renderer.domElement;
        const link = document.createElement("a");
        link.download = `screenshot-${
          isImportedModelDisplayed
            ? currentImportedModelNameRef.current
            : currentShapeRef.current || "view"
        }.png`;
        link.href = canvas.toDataURL("image/png");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        sonnerToast.success("Screenshot Saved!", {
          id: screenshotToastId,
          description: `${link.download} saved.`,
        });
      } catch (e) {
        console.error("Screenshot error:", e);
        sonnerToast.error("Screenshot Failed", {
          id: screenshotToastId,
          description: e.message || "Could not save.",
        });
      }
    }, 100);
  }, [isImportedModelDisplayed, isExporting]);

  const processAndSetImportedModel = useCallback(
    (scene, animations, fileName) => {
      const nameOnly =
        fileName.split(".").slice(0, -1).join(".") || "Imported Model";
      setImportedModelName(nameOnly);
      setImportedModel({ scene, animations: animations || [] });
      setIsImportedModelDisplayed(true);
      setAppliedTexture(null);
      handleResetAnimation();
      // The success toast is now here, ensures it's shown after all processing
      sonnerToast.success("Model Imported Successfully!", {
        description: `${fileName} is now displayed.`,
      });
    },
    [handleResetAnimation]
  );

  const processImportedGltf = useCallback(
    (gltf, fileName) => {
      processAndSetImportedModel(gltf.scene, gltf.animations, fileName);
    },
    [processAndSetImportedModel]
  );

  const handleFiles = useCallback(
    async (files) => {
      if (!files || files.length === 0) return;
      const importToastId = sonnerToast.loading("Processing File(s)...");
      let objFile = null,
        mtlFile = null,
        fbxFile = null,
        tdsFile = null,
        otherModelFile = null;

      for (const file of files) {
        const lowerName = file.name.toLowerCase();
        if (lowerName.endsWith(".obj")) objFile = file;
        else if (lowerName.endsWith(".mtl")) mtlFile = file;
        else if (lowerName.endsWith(".fbx")) fbxFile = file;
        else if (lowerName.endsWith(".3ds")) tdsFile = file;
        else if (
          lowerName.endsWith(".glb") ||
          lowerName.endsWith(".gltf") ||
          lowerName.endsWith(".stl")
        ) {
          if (!otherModelFile) otherModelFile = file;
        }
      }

      try {
        if (objFile) {
          sonnerToast.info("Processing OBJ model...", {
            id: importToastId,
            description: `Loading ${objFile.name}${
              mtlFile ? " with " + mtlFile.name : ""
            }`,
          });
          const objLoader = new OBJLoader();
          const mtlLoader = new MTLLoader();
          let materialsCreator = null;
          if (
            mtlFile &&
            objFile.name.slice(0, -4) === mtlFile.name.slice(0, -4)
          ) {
            const mtlText = await mtlFile.text();
            mtlLoader.setResourcePath("");
            materialsCreator = mtlLoader.parse(mtlText, "");
            materialsCreator.preload();
          }
          const objText = await objFile.text();
          if (materialsCreator) objLoader.setMaterials(materialsCreator);
          const object = objLoader.parse(objText);
          object.traverse((child) => {
            if (child.isMesh) {
              if (child.material) {
                if (Array.isArray(child.material))
                  child.material.forEach(
                    (mat) => (mat.side = THREE.DoubleSide)
                  );
                else child.material.side = THREE.DoubleSide;
              } else if (!materialsCreator) {
                child.material = createAdvancedMaterial(
                  currentSettingsRef.current.shapeColor,
                  "ceramic"
                );
                child.material.side = THREE.DoubleSide;
              }
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          processAndSetImportedModel(object, [], objFile.name);
          // sonnerToast.dismiss(importToastId); // Dismissed by processAndSetImportedModel
        } else if (fbxFile) {
          sonnerToast.info("Processing FBX model...", {
            id: importToastId,
            description: `Loading ${fbxFile.name}. This may take a moment...`,
          });
          const buffer = await fbxFile.arrayBuffer();
          const loader = new FBXLoader();
          const object = loader.parse(buffer, "");
          object.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              if (child.material) {
                if (Array.isArray(child.material))
                  child.material.forEach(
                    (mat) => (mat.side = THREE.DoubleSide)
                  );
                else child.material.side = THREE.DoubleSide;
              }
            }
          });
          processAndSetImportedModel(
            object,
            object.animations || [],
            fbxFile.name
          );
          // sonnerToast.dismiss(importToastId);
        } else if (tdsFile) {
          sonnerToast.info("Processing 3DS model...", {
            id: importToastId,
            description: `Loading ${tdsFile.name}`,
          });
          const buffer = await tdsFile.arrayBuffer();
          const loader = new TDSLoader();
          const object = loader.parse(buffer, "");
          object.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              if (child.material) {
                if (Array.isArray(child.material))
                  child.material.forEach(
                    (mat) => (mat.side = THREE.DoubleSide)
                  );
                else child.material.side = THREE.DoubleSide;
              } else {
                child.material = createAdvancedMaterial(
                  currentSettingsRef.current.shapeColor,
                  "plastic"
                );
                child.material.side = THREE.DoubleSide;
              }
            }
          });
          processAndSetImportedModel(object, [], tdsFile.name);
          // sonnerToast.dismiss(importToastId);
        } else if (otherModelFile) {
          sonnerToast.info("Processing model...", {
            id: importToastId,
            description: `Loading ${otherModelFile.name}`,
          });
          const lowerName = otherModelFile.name.toLowerCase();
          const buffer = await otherModelFile.arrayBuffer();
          if (lowerName.endsWith(".glb") || lowerName.endsWith(".gltf")) {
            const loader = getGltfLoader();
            loader.parse(
              buffer,
              "",
              (gltf) => {
                processImportedGltf(
                  gltf,
                  otherModelFile.name
                ); /* sonnerToast.dismiss(importToastId); */
              },
              (error) => {
                console.error("GLB/GLTF Parse Error:", error);
                sonnerToast.error("GLB/GLTF Parse Failed", {
                  id: importToastId,
                  description: `${otherModelFile.name}: ${
                    error.message || "Unknown"
                  }`,
                });
              }
            );
          } else if (lowerName.endsWith(".stl")) {
            const loader = new STLLoader();
            const geometry = loader.parse(buffer);
            if (!geometry.isBufferGeometry)
              throw new Error("Invalid STL geometry.");
            const material = createAdvancedMaterial(
              currentSettingsRef.current.shapeColor,
              "plastic"
            );
            const modelScene = new THREE.Mesh(geometry, material);
            processAndSetImportedModel(modelScene, [], otherModelFile.name);
            // sonnerToast.dismiss(importToastId);
          } else {
            sonnerToast.error("Unsupported File", {
              id: importToastId,
              description: "An unexpected file type was processed.",
            });
          }
        } else {
          sonnerToast.warning("No Supported File", {
            id: importToastId,
            description: "Please select GLB, GLTF, STL, OBJ, FBX or 3DS.",
          });
        }
      } catch (error) {
        console.error("File Handling General Error:", error);
        sonnerToast.error("File Processing Failed", {
          id: importToastId,
          description: error.message || "Could not read or process file.",
        });
      }
      if (modelFileInputRef.current) modelFileInputRef.current.value = null;
    },
    [processImportedGltf, processAndSetImportedModel]
  );

  const triggerModelImport = useCallback(() => {
    if (modelFileInputRef.current) modelFileInputRef.current.click();
  }, []);

  const applyTextureToModel = useCallback((texture) => {
    if (!canvasApiRef.current || !canvasApiRef.current.getCurrentMesh()) {
      sonnerToast.error("Cannot Apply Texture", {
        description: "No model loaded.",
      });
      return;
    }
    let textureApplied = false;
    const currentMesh = canvasApiRef.current.getCurrentMesh();
    currentMesh.traverse((child) => {
      if (child.isMesh && child.material) {
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];
        materials.forEach((material) => {
          if (
            material.isMeshStandardMaterial ||
            material.isMeshPhysicalMaterial ||
            material.isMeshPhongMaterial ||
            material.isMeshBasicMaterial
          ) {
            if (material.map && material.map !== texture)
              material.map.dispose();
            material.map = texture;
            material.needsUpdate = true;
            textureApplied = true;
          }
        });
      }
    });
    if (textureApplied) {
      setAppliedTexture(texture);
      sonnerToast.success("Texture Applied");
    } else {
      sonnerToast.warning("Texture Not Applied", {
        description: "No suitable materials found.",
      });
    }
  }, []);

  const handleImageFileSelected = useCallback(
    (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        sonnerToast.error("Invalid File Type", {
          description: "Please select an image.",
        });
        return;
      }
      const imageToastId = sonnerToast.loading("Loading Image...", {
        description: `Processing ${file.name}`,
      });
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const dataURL = e.target.result;
          textureLoaderRef.current.load(
            dataURL,
            (texture) => {
              texture.colorSpace = THREE.SRGBColorSpace;
              applyTextureToModel(texture);
              sonnerToast.dismiss(imageToastId);
            },
            undefined,
            (error) => {
              sonnerToast.error("Texture Load Failed", {
                id: imageToastId,
                description: error.message || "Could not load image.",
              });
            }
          );
        } catch (error) {
          sonnerToast.error("Image Read Failed", {
            id: imageToastId,
            description: error.message || "Could not read image.",
          });
        }
      };
      reader.onerror = () => {
        sonnerToast.error("File Read Error", {
          id: imageToastId,
          description: "Failed to read image.",
        });
      };
      reader.readAsDataURL(file);
      if (event.target) event.target.value = null;
    },
    [applyTextureToModel]
  );

  const triggerImageImport = useCallback(() => {
    if (imageFileInputRef.current) imageFileInputRef.current.click();
  }, []);

  const handleRemoveAppliedTexture = useCallback(() => {
    if (
      !canvasApiRef.current ||
      !canvasApiRef.current.getCurrentMesh() ||
      !appliedTexture
    ) {
      sonnerToast.info("No Custom Texture", {
        description: "No texture to remove.",
      });
      return;
    }
    let textureRemoved = false;
    const currentMesh = canvasApiRef.current.getCurrentMesh();
    currentMesh.traverse((child) => {
      if (child.isMesh && child.material) {
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];
        materials.forEach((material) => {
          if (material.map === appliedTexture) {
            material.map.dispose();
            material.map = null;
            material.needsUpdate = true;
            textureRemoved = true;
          }
        });
      }
    });
    if (textureRemoved) {
      setAppliedTexture(null);
      sonnerToast.success("Texture Removed");
    }
  }, [appliedTexture]);

  const handleFileDropOnViewer = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        handleFiles(Array.from(event.dataTransfer.files));
      }
    },
    [handleFiles]
  );

  if (!isMounted) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-4'>
        <Loader2 className='h-12 w-12 animate-spin text-purple-400 mb-4' />
        <p className='text-lg font-medium'>Initializing 3D Studio...</p>
        <p className='text-sm text-slate-400'>
          Getting things ready, please wait.
        </p>
      </div>
    );
  }

  return (
    <>
      <SonnerToaster richColors position='top-right' />
      <div className='min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 p-3 sm:p-4 md:p-6 text-slate-100 select-none'>
        <input
          type='file'
          accept='.glb,.gltf,.stl,.obj,.mtl,.fbx,.3ds'
          multiple
          ref={modelFileInputRef}
          onChange={(e) => handleFiles(Array.from(e.target.files))}
          style={{ display: "none" }}
        />
        <input
          type='file'
          id='image-texture-input'
          accept='image/*'
          ref={imageFileInputRef}
          onChange={handleImageFileSelected}
          style={{ display: "none" }}
        />

        <div className='max-w-screen-2xl mx-auto'>
          <header className='text-center mb-8 sm:mb-10'>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-3 sm:mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent'>
              3D Shape Studio Pro
            </h1>
            <p className='text-slate-400 text-base sm:text-lg max-w-3xl mx-auto'>
              Craft, view, and animate 3D masterpieces. Import GLB, GLTF, STL,
              OBJ, FBX or 3DS models.
            </p>
          </header>

          <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6'>
            <div className='lg:col-span-3 space-y-4 sm:space-y-5 order-last lg:order-first'>
              {!isImportedModelDisplayed && (
                <>
                  <CategorySelector
                    categories={categories}
                    currentCategory={currentCategory}
                    onCategorySelect={handleCategorySelect}
                  />
                  <ShapeSelector
                    shapes={shapesByCategory[currentCategory]}
                    currentShape={currentShape}
                    onShapeSelect={handleShapeSelect}
                  />
                </>
              )}
              {isImportedModelDisplayed && importedModel && (
                <Card className='bg-slate-800/70 border-slate-700 shadow-xl text-center'>
                  <CardHeader>
                    <CardTitle className='text-slate-100'>
                      Current Model
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p
                      className='text-sm text-slate-300 truncate font-medium'
                      title={importedModelName}
                    >
                      {importedModelName}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant='destructive'
                      size='sm'
                      className='w-full'
                      onClick={() => {
                        setImportedModel(null);
                        setIsImportedModelDisplayed(false);
                        setImportedModelName("Imported Model");
                        setAppliedTexture(null);
                        const defaultCategoryId = categories[0].id;
                        setCurrentCategory(defaultCategoryId);
                        setCurrentShape(
                          shapesByCategory[defaultCategoryId][0].id
                        );
                        handleResetAnimation();
                        sonnerToast.info("Imported Model Cleared");
                      }}
                    >
                      {" "}
                      <XCircle size={16} className='mr-2' /> Clear Imported{" "}
                    </Button>
                  </CardFooter>
                </Card>
              )}
              <AnimationControls
                isAnimating={isAnimating}
                onToggleAnimation={handleToggleAnimation}
                onResetAnimation={handleResetAnimation}
                animationPreset={currentAnimationPreset} // Use currentAnimationPreset state
                onPresetChange={setCurrentAnimationPreset} // Use state setter
                onRandomize={handleRandomize}
                animationPresetsList={animationPresets} // Pass the list of presets
              />
              <FileTextureControls
                isExporting={isExporting}
                exportProgress={exportProgress}
                appliedTexture={appliedTexture}
                onTriggerModelImport={triggerModelImport}
                onTriggerImageImport={triggerImageImport}
                onRemoveAppliedTexture={handleRemoveAppliedTexture}
                onExportGLB={handleExportGLB}
                onExportOBJ={handleSimulatedExportOBJ}
                onTakeScreenshot={handleTakeScreenshot}
              />
              <SettingsButton onClick={() => setShowSettingsDialog(true)} />
            </div>

            <div className='lg:col-span-9 order-first lg:order-last'>
              <Card className='bg-slate-800/50 border-slate-700/80 shadow-2xl aspect-[4/3] sm:aspect-video lg:aspect-[16/10] overflow-hidden'>
                <CardContent className='p-0 w-full h-full relative'>
                  <ThreeDCanvas
                    ref={canvasApiRef}
                    isMounted={isMounted}
                    settings={settings}
                    currentShape={currentShape}
                    importedModel={importedModel}
                    isImportedModelDisplayed={isImportedModelDisplayed}
                    appliedTexture={appliedTexture}
                    isAnimating={isAnimating}
                    animationPreset={currentAnimationPreset} // Pass selected preset value
                    onDropFile={handleFileDropOnViewer}
                  />
                  {isExporting && (
                    <ExportingDialog exportProgress={exportProgress} />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <SettingsDialog
            show={showSettingsDialog}
            onClose={() => setShowSettingsDialog(false)}
            settings={settings}
            onSettingsChange={setSettings}
          />

          <footer className='text-center mt-10 sm:mt-16 py-6 border-t border-slate-700/50'>
            <p className='text-slate-400 text-sm'>
              © {new Date().getFullYear()} 3D Shape Studio Pro. All rights
              reserved.
            </p>
            <p className='text-xs text-slate-500 mt-1'>
              An interactive 3D modeling and visualization tool.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default ModelViewer3D;
