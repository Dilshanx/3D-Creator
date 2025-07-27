import React, { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  ImageUp,
  Trash2,
  Palette,
  LayersIcon as LayersIconLucide,
  Type as TypeIcon,
  X,
  Package,
  ImageIcon as ImageIconLucide,
  Square,
  PlusCircle,
} from "lucide-react";
import * as THREE from "three";

const initialTexturePropsValues = {
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

const allTextureSlots = [
  { id: "map", name: "Base Color (Albedo)" },
  { id: "normalMap", name: "Normal Map" },
  { id: "roughnessMap", name: "Roughness Map" },
  { id: "metalnessMap", name: "Metalness Map" },
  { id: "aoMap", name: "AO Map" },
  { id: "emissiveMap", name: "Emissive Map" },
];

const materialOptionsList = [
  { name: "Standard (PBR)", type: "standard" },
  { name: "Physical (PBR)", type: "physical" },
  { name: "Toon", type: "toon" },
  { name: "Basic (Non-PBR)", type: "basic" },
  { name: "Lambert (Non-PBR)", type: "lambert" },
  { name: "Phong (Non-PBR)", type: "phong" },
  { name: "Wireframe", type: "wireframe" },
];

const glbMaterialOptionsWithModel = [
  { name: "Model's Own Materials", type: "model" },
  ...materialOptionsList,
];

const animationTypeOptions = [
  { name: "None", value: "none" },
  { name: "Rotate", value: "rotate" },
  { name: "Orbit", value: "orbit" },
];

const animationAxisOptions = [
  { name: "X Axis", value: "x" },
  { name: "Y Axis", value: "y" },
  { name: "Z Axis", value: "z" },
];

const animationPlaneOptions = [
  { name: "XY Plane", value: "xy" },
  { name: "XZ Plane", value: "xz" },
  { name: "YZ Plane", value: "yz" },
];

export default function PropertiesPanel({
  selectedShape,
  updateShape,
  removeShape,
  duplicateShape,
  addShape,
  handleTextureUpload,
  handleClearTexture,
  shapeTextureFileInputRefs,
  textTextureFileInputRefs,
  portalContainerRef,
  isFullscreen,
}) {
  const shapeDisplayOptions = [
    { name: "Cube", type: "box", icon: "🧊" },
    { name: "Sphere", type: "sphere", icon: "⚪" },
    { name: "Cylinder", type: "cylinder", icon: "🥫" },
    { name: "Cone", type: "cone", icon: "🔺" },
    { name: "Torus", type: "torus", icon: "🍩" },
    { name: "Pyramid", type: "pyramid", icon: "🔺" },
    { name: "3D Text", type: "text", icon: <TypeIcon size={18} /> },
    {
      name: "Image Plane",
      type: "imagePlane",
      icon: <ImageIconLucide size={18} />,
    },
    {
      name: "Imported Model",
      type: "importedGLB",
      icon: <Package size={18} />,
    },
  ];
  const popularShapeIcons = {
    heart: "❤️",
    star: "⭐",
    crown: "👑",
    lightning: "⚡️",
    diamond: "💎",
    shield: "🛡️",
    arrow: "➡️",
    leaf: "🍃",
    sword: "⚔️",
    butterfly: "🦋",
  };

  const currentShapeType = selectedShape?.type;
  const isCustomExtruded = currentShapeType === "customExtruded";
  const isImportedGLB = currentShapeType === "importedGLB";
  const isText = currentShapeType === "text";
  const isImagePlane = currentShapeType === "imagePlane";

  const glbMaterialOverride = selectedShape?.glbMaterialOverride || null;

  const showPBRForGLBOverride =
    glbMaterialOverride &&
    ["standard", "physical"].includes(glbMaterialOverride.type);

  const currentMaterialForPrimitives = selectedShape?.material;
  const showPBRPropertiesForPrimitives =
    !isImportedGLB &&
    !isImagePlane &&
    selectedShape &&
    ["standard", "physical"].includes(currentMaterialForPrimitives);
  const showPhongPropertiesForPrimitives =
    !isImportedGLB &&
    !isImagePlane &&
    selectedShape &&
    currentMaterialForPrimitives === "phong";
  const showPhysicalPropertiesForPrimitives =
    !isImportedGLB &&
    !isImagePlane &&
    selectedShape &&
    currentMaterialForPrimitives === "physical";

  const showPhysicalForGLBOverride =
    glbMaterialOverride && glbMaterialOverride.type === "physical";

  const animation = selectedShape?.animation
    ? {
        type: selectedShape.animation.type || "none",
        speed:
          selectedShape.animation.speed !== undefined
            ? selectedShape.animation.speed
            : 1,
        axis: selectedShape.animation.axis || "y",
        orbitCenter: selectedShape.animation.orbitCenter || [0, 0, 0],
        orbitRadius:
          selectedShape.animation.orbitRadius !== undefined
            ? selectedShape.animation.orbitRadius
            : 5,
        orbitPlane: selectedShape.animation.orbitPlane || "xz",
      }
    : {
        type: "none",
        speed: 1,
        axis: "y",
        orbitCenter: [0, 0, 0],
        orbitRadius: 5,
        orbitPlane: "xz",
      };

  const handleTransformUpdate = useCallback(
    (property, index, valueStr) => {
      if (!selectedShape) return;
      const value = parseFloat(valueStr);
      if (isNaN(value) && property !== "rotation") return;
      const newTransform = [...selectedShape[property]];
      newTransform[index] =
        property === "rotation"
          ? THREE.MathUtils.degToRad(value || 0)
          : Math.max(property === "scale" ? 0.01 : -Infinity, value);
      updateShape(selectedShape.id, { [property]: newTransform });
    },
    [selectedShape, updateShape]
  );

  const handleGenericUpdate = useCallback(
    (property, value) => {
      if (!selectedShape) return;
      updateShape(selectedShape.id, { [property]: value });
    },
    [selectedShape, updateShape]
  );

  const handleTexturePropUpdate = useCallback(
    (propName, value) => {
      if (!selectedShape) return;
      const targetPropsKey = isText ? "textTextureProps" : "textureProps";
      const newTextureProps = {
        ...(selectedShape[targetPropsKey] || initialTexturePropsValues),
        [propName]: value,
      };
      updateShape(selectedShape.id, { [targetPropsKey]: newTextureProps });
    },
    [selectedShape, updateShape, isText]
  );

  const handleGLBMaterialOverrideUpdate = useCallback(
    (property, value) => {
      if (!selectedShape || !isImportedGLB) return;
      const currentOverride = selectedShape.glbMaterialOverride || {};
      let newOverrideSettings = { ...currentOverride, [property]: value };

      if (property === "type") {
        if (value === "model") {
          newOverrideSettings = null;
        } else {
          newOverrideSettings.color =
            currentOverride.color || selectedShape.color || "#cccccc";

          if (value === "standard" || value === "physical") {
            newOverrideSettings.roughness =
              currentOverride.roughness ?? initialTexturePropsValues.roughness;
            newOverrideSettings.metalness =
              currentOverride.metalness ?? initialTexturePropsValues.metalness;
          } else {
            delete newOverrideSettings.roughness;
            delete newOverrideSettings.metalness;
          }

          if (value === "physical") {
            newOverrideSettings.transmission =
              currentOverride.transmission ??
              initialTexturePropsValues.transmission;
            newOverrideSettings.ior =
              currentOverride.ior ?? initialTexturePropsValues.ior;
            newOverrideSettings.thickness =
              currentOverride.thickness ?? initialTexturePropsValues.thickness;
            newOverrideSettings.clearcoat =
              currentOverride.clearcoat ?? initialTexturePropsValues.clearcoat;
            newOverrideSettings.clearcoatRoughness =
              currentOverride.clearcoatRoughness ??
              initialTexturePropsValues.clearcoatRoughness;
          } else {
            delete newOverrideSettings.transmission;
            delete newOverrideSettings.ior;
            delete newOverrideSettings.thickness;
            delete newOverrideSettings.clearcoat;
            delete newOverrideSettings.clearcoatRoughness;
          }

          if (value === "phong") {
            newOverrideSettings.shininess =
              currentOverride.shininess ?? initialTexturePropsValues.shininess;
          } else {
            delete newOverrideSettings.shininess;
          }
        }
      }
      updateShape(selectedShape.id, {
        glbMaterialOverride: newOverrideSettings,
      });
    },
    [selectedShape, updateShape, isImportedGLB]
  );

  const handleAnimationUpdate = useCallback(
    (property, value) => {
      if (!selectedShape) return;
      const currentAnimationData = selectedShape.animation || {
        type: "none",
        speed: 1,
        axis: "y",
        orbitCenter: [0, 0, 0],
        orbitRadius: 5,
        orbitPlane: "xz",
      };
      updateShape(selectedShape.id, {
        animation: { ...currentAnimationData, [property]: value },
      });
    },
    [selectedShape, updateShape]
  );

  const handleOrbitCenterUpdate = useCallback(
    (index, valueStr) => {
      if (!selectedShape || !selectedShape.animation) return;
      const value = parseFloat(valueStr);
      if (isNaN(value)) return;
      const newOrbitCenter = [
        ...(selectedShape.animation.orbitCenter || [0, 0, 0]),
      ];
      newOrbitCenter[index] = value;
      handleAnimationUpdate("orbitCenter", newOrbitCenter);
    },
    [selectedShape, handleAnimationUpdate]
  );

  const handleQuickAction = useCallback(
    (action) => {
      if (!selectedShape) return;
      const actions = {
        resetScale: () => updateShape(selectedShape.id, { scale: [1, 1, 1] }),
        resetRotation: () =>
          updateShape(selectedShape.id, { rotation: [0, 0, 0] }),
        centerObject: () => {
          let yO = 0;
          if (selectedShape.scale && selectedShape.scale[1]) {
            if (selectedShape.type === "pyramid") yO = 0;
            else if (selectedShape.type === "text")
              yO =
                (selectedShape.textSize || 0.5) * selectedShape.scale[1] * 0.5;
            else if (selectedShape.type === "imagePlane")
              yO =
                ((selectedShape.planeHeight || 1) * selectedShape.scale[1]) / 2;
            else if (selectedShape.type === "importedGLB") yO = 0;
            else yO = selectedShape.scale[1] * 0.5;
          }
          updateShape(selectedShape.id, { position: [0, yO, 0] });
        },
        randomColor: () => {
          if (isImagePlane) {
            alert("Cannot apply random color to image planes.");
            return;
          }
          const nC = `#${Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")}`;
          if (isImportedGLB) {
            handleGLBMaterialOverrideUpdate("color", nC);
            if (
              !selectedShape.glbMaterialOverride ||
              selectedShape.glbMaterialOverride.type === "model"
            ) {
              handleGLBMaterialOverrideUpdate("type", "standard");
            }
          } else {
            updateShape(selectedShape.id, { color: nC });
          }
        },
      };
      actions[action]?.();
    },
    [
      selectedShape,
      updateShape,
      isImportedGLB,
      isImagePlane,
      handleGLBMaterialOverrideUpdate,
    ]
  );

  let activeTextureSlots = [];
  let currentTextureValues = { ...initialTexturePropsValues };
  let fileInputRefsToUse = shapeTextureFileInputRefs;
  let texturePropsKeyForShape = "textureProps";

  if (selectedShape) {
    if (isText) {
      activeTextureSlots = [
        { id: "map", name: "Color/Albedo Map" },
        { id: "normalMap", name: "Normal Map" },
      ];
      currentTextureValues = {
        ...initialTexturePropsValues,
        ...(selectedShape.textTextureProps || {}),
      };
      fileInputRefsToUse = textTextureFileInputRefs;
      texturePropsKeyForShape = "textTextureProps";
    } else if (isImportedGLB) {
      activeTextureSlots = allTextureSlots;
      currentTextureValues = {
        ...initialTexturePropsValues,
        ...(selectedShape.textureProps || {}),
      };
    } else if (!isImagePlane) {
      activeTextureSlots = allTextureSlots;
      currentTextureValues = {
        ...initialTexturePropsValues,
        ...(selectedShape.textureProps || {}),
      };
    }
  }

  const getShapeIcon = () => {
    if (!selectedShape) return <Square size={24} className='text-slate-500' />;
    const iconData = shapeDisplayOptions.find(
      (s) => s.type === currentShapeType
    );
    if (iconData)
      return typeof iconData.icon === "string" ? (
        <span className='text-2xl'>{iconData.icon}</span>
      ) : (
        React.cloneElement(iconData.icon, { className: "text-purple-400" })
      );
    if (isCustomExtruded)
      return (
        <span className='text-2xl'>
          {popularShapeIcons[selectedShape.shapeType?.toLowerCase()] || "💖"}
        </span>
      );
    return <Square size={24} className='text-purple-400' />;
  };

  // UPDATED: Theme-aware styling classes
  const cardClass =
    "bg-white dark:bg-slate-800/70 border border-gray-200 dark:border-slate-700 shadow-lg rounded-lg";
  const inputClass =
    "bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-800 dark:text-slate-100 text-xs h-8 rounded-md focus:ring-1 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-blue-500 dark:focus:border-purple-500";
  const labelClass =
    "text-xs font-medium text-gray-600 dark:text-slate-300 mb-1.5 block";
  const sliderClass =
    "[&>span:first-child]:bg-blue-600 dark:[&>span:first-child]:bg-purple-600 [&>span:last-child]:bg-gray-200 dark:[&>span:last-child]:bg-slate-700";

  const pbrRoughness = isImportedGLB
    ? glbMaterialOverride?.roughness ?? currentTextureValues.roughness
    : selectedShape?.textureProps?.roughness ??
      selectedShape?.roughness ??
      initialTexturePropsValues.roughness;
  const pbrMetalness = isImportedGLB
    ? glbMaterialOverride?.metalness ?? currentTextureValues.metalness
    : selectedShape?.textureProps?.metalness ??
      selectedShape?.metalness ??
      initialTexturePropsValues.metalness;
  const physicalTransmission = isImportedGLB
    ? glbMaterialOverride?.transmission ?? currentTextureValues.transmission
    : selectedShape?.textureProps?.transmission ??
      selectedShape?.transmission ??
      initialTexturePropsValues.transmission;
  const physicalIor = isImportedGLB
    ? glbMaterialOverride?.ior ?? currentTextureValues.ior
    : selectedShape?.textureProps?.ior ??
      selectedShape?.ior ??
      initialTexturePropsValues.ior;
  const physicalThickness = isImportedGLB
    ? glbMaterialOverride?.thickness ?? currentTextureValues.thickness
    : selectedShape?.textureProps?.thickness ??
      selectedShape?.thickness ??
      initialTexturePropsValues.thickness;
  const physicalClearcoat = isImportedGLB
    ? glbMaterialOverride?.clearcoat ?? currentTextureValues.clearcoat
    : selectedShape?.textureProps?.clearcoat ??
      selectedShape?.clearcoat ??
      initialTexturePropsValues.clearcoat;
  const physicalClearcoatRoughness = isImportedGLB
    ? glbMaterialOverride?.clearcoatRoughness ??
      currentTextureValues.clearcoatRoughness
    : selectedShape?.textureProps?.clearcoatRoughness ??
      selectedShape?.clearcoatRoughness ??
      initialTexturePropsValues.clearcoatRoughness;
  const phongShininess = isImportedGLB
    ? glbMaterialOverride?.shininess ?? currentTextureValues.shininess
    : selectedShape?.textureProps?.shininess ??
      selectedShape?.shininess ??
      initialTexturePropsValues.shininess;

  return (
    <motion.div
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
      // UPDATED: Theme-aware background and scrollbar
      className='w-72 p-4 bg-gray-50/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none border-l border-gray-200/50 md:border-none overflow-y-auto shadow-xl md:shadow-none text-gray-900 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 z-[5]
                 dark:bg-slate-900/80 dark:border-slate-700/50 dark:text-slate-100 dark:scrollbar-thumb-slate-700 dark:scrollbar-track-slate-800'
    >
      <AnimatePresence mode='wait'>
        {selectedShape ? (
          <motion.div
            key={selectedShape.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className='space-y-5'
          >
            <div className='flex justify-between items-center'>
              <div>
                <h3 className='text-md font-semibold text-gray-900 dark:text-slate-100'>
                  Object Properties
                </h3>
                <p className='text-xs text-gray-500 dark:text-slate-400'>
                  {selectedShape.name ||
                    (isText ? "3D Text" : currentShapeType)}
                </p>
              </div>
              <div className='flex items-center space-x-1'>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={duplicateShape}
                      variant='ghost'
                      size='icon'
                      // UPDATED: Theme-aware hover styles
                      className='w-7 h-7 text-gray-500 hover:text-blue-600 hover:bg-gray-100/50
                                 dark:text-slate-400 dark:hover:text-purple-300 dark:hover:bg-slate-700/50'
                    >
                      <LayersIconLucide size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side='bottom'
                    // UPDATED: Theme-aware tooltip
                    className='bg-white text-gray-800 border-gray-200
                               dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
                  >
                    <p>Duplicate (Ctrl+D)</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => removeShape(selectedShape.id)}
                      variant='ghost'
                      size='icon'
                      className='w-7 h-7 text-red-500 hover:text-red-400 hover:bg-red-500/20'
                    >
                      <Trash2 size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side='bottom'
                    // UPDATED: Theme-aware tooltip
                    className='bg-white text-gray-800 border-gray-200
                               dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
                  >
                    <p>Delete (Del/Backspace)</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <Separator className='bg-gray-200 dark:bg-slate-700' />

            <Card className={cardClass}>
              <CardContent className='p-3'>
                <Label htmlFor='object-name' className={labelClass}>
                  Name
                </Label>
                <Input
                  id='object-name'
                  value={selectedShape.name || ""}
                  onChange={(e) => handleGenericUpdate("name", e.target.value)}
                  placeholder='Object Name'
                  className={inputClass}
                />
              </CardContent>
            </Card>

            {isText && (
              <Card className={cardClass}>
                <CardHeader className='p-3'>
                  <CardTitle className='text-sm font-semibold text-gray-900 dark:text-slate-200'>
                    Text Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4 p-3'>
                  <div>
                    <Label htmlFor='text-content' className={labelClass}>
                      Content
                    </Label>
                    <Input
                      id='text-content'
                      value={selectedShape.text || ""}
                      onChange={(e) =>
                        handleGenericUpdate("text", e.target.value)
                      }
                      placeholder='Enter text...'
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <Label className={labelClass}>
                      Size: {selectedShape.textSize?.toFixed(2) || 0.5}
                    </Label>
                    <Slider
                      value={[selectedShape.textSize || 0.5]}
                      onValueChange={([v]) =>
                        handleGenericUpdate("textSize", v)
                      }
                      max={2}
                      min={0.1}
                      step={0.05}
                      className={sliderClass}
                    />
                  </div>
                  <div>
                    <Label className={labelClass}>
                      Thickness: {selectedShape.extrudeDepth?.toFixed(2) || 0.2}
                    </Label>
                    <Slider
                      value={[selectedShape.extrudeDepth || 0.2]}
                      onValueChange={([v]) =>
                        handleGenericUpdate("extrudeDepth", v)
                      }
                      max={1}
                      min={0.01}
                      step={0.01}
                      className={sliderClass}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            {isCustomExtruded && (
              <Card className={cardClass}>
                <CardHeader className='p-3'>
                  <CardTitle className='text-sm font-semibold text-gray-900 dark:text-slate-200'>
                    Custom Shape Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4 p-3'>
                  <div>
                    <Label className={labelClass}>
                      Size: {selectedShape.shapeSize?.toFixed(2) || 1.0}
                    </Label>
                    <Slider
                      value={[selectedShape.shapeSize || 1]}
                      onValueChange={([v]) =>
                        handleGenericUpdate("shapeSize", v)
                      }
                      max={5}
                      min={0.1}
                      step={0.05}
                      className={sliderClass}
                    />
                  </div>
                  <div>
                    <Label className={labelClass}>
                      Depth: {selectedShape.extrudeDepth?.toFixed(2) || 0.2}
                    </Label>
                    <Slider
                      value={[selectedShape.extrudeDepth || 0.2]}
                      onValueChange={([v]) =>
                        handleGenericUpdate("extrudeDepth", v)
                      }
                      max={2}
                      min={0.01}
                      step={0.01}
                      className={sliderClass}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className={cardClass}>
              <CardHeader className='p-3'>
                <CardTitle className='text-sm font-semibold text-gray-900 dark:text-slate-200'>
                  Transform
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4 p-3'>
                {["position", "rotation", "scale"].map((prop) => (
                  <div key={prop} className='space-y-2'>
                    <h4 className='font-medium text-xs text-gray-700 dark:text-slate-300 capitalize'>
                      {prop}
                    </h4>
                    {["X", "Y", "Z"].map((axis, index) => (
                      <div
                        key={axis}
                        className='grid grid-cols-6 items-center gap-2'
                      >
                        <Label
                          htmlFor={`${prop}-${axis}`}
                          className='text-xs text-gray-500 dark:text-slate-400 col-span-1'
                        >
                          {axis}
                        </Label>
                        <Input
                          id={`${prop}-${axis}`}
                          type='number'
                          value={
                            prop === "rotation"
                              ? THREE.MathUtils.radToDeg(
                                  selectedShape[prop][index] || 0
                                ).toFixed(0)
                              : (selectedShape[prop][index] || 0).toFixed(2)
                          }
                          onChange={(e) =>
                            handleTransformUpdate(prop, index, e.target.value)
                          }
                          step={prop === "rotation" ? 5 : 0.1}
                          className={cn(inputClass, "col-span-2")}
                        />
                        <Slider
                          value={[
                            prop === "rotation"
                              ? THREE.MathUtils.radToDeg(
                                  selectedShape[prop][index] || 0
                                )
                              : selectedShape[prop][index] || 0,
                          ]}
                          onValueChange={([v]) =>
                            handleTransformUpdate(prop, index, v.toString())
                          }
                          min={
                            prop === "rotation"
                              ? -360
                              : prop === "scale"
                              ? 0.01
                              : -15
                          }
                          max={
                            prop === "rotation"
                              ? 360
                              : prop === "scale"
                              ? 10
                              : 15
                          }
                          step={
                            prop === "rotation"
                              ? 1
                              : prop === "scale"
                              ? 0.01
                              : 0.1
                          }
                          className={cn("col-span-3", sliderClass)}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>

            {!isImagePlane && (
              <Card className={cardClass}>
                <CardHeader className='p-3'>
                  <CardTitle className='text-sm font-semibold text-gray-900 dark:text-slate-200 flex items-center'>
                    <Palette
                      size={14}
                      className='mr-1.5 text-blue-600 dark:text-purple-400'
                    />{" "}
                    Appearance
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4 p-3'>
                  {isImportedGLB ? (
                    <>
                      <p className='text-xs text-gray-500 dark:text-slate-400'>
                        Override model's materials. Changes apply to all meshes.
                      </p>
                      <div>
                        <Label className={labelClass}>Override Material</Label>
                        <div className='flex flex-col space-y-1.5 mt-1'>
                          {glbMaterialOptionsWithModel.map((opt) => {
                            const isActive =
                              (glbMaterialOverride?.type || "model") ===
                              opt.type;
                            return (
                              <Button
                                key={opt.type}
                                variant='outline'
                                className={cn(
                                  inputClass,
                                  "px-2.5 w-full justify-start text-left",
                                  isActive
                                    ? "bg-blue-600 dark:bg-purple-600 hover:bg-blue-700 dark:hover:bg-purple-700 text-white !border-blue-500 dark:!border-purple-500"
                                    : "hover:bg-gray-200 dark:hover:bg-slate-600"
                                )}
                                onClick={() =>
                                  handleGLBMaterialOverrideUpdate(
                                    "type",
                                    opt.type
                                  )
                                }
                              >
                                {opt.name}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                      {glbMaterialOverride &&
                        glbMaterialOverride.type !== "model" && (
                          <>
                            <Separator className='my-2 bg-gray-200 dark:bg-slate-700' />
                            <div>
                              <Label className={labelClass}>
                                Override Color
                              </Label>
                              <div className='flex items-center space-x-2'>
                                <Input
                                  type='color'
                                  value={glbMaterialOverride.color || "#cccccc"}
                                  onChange={(e) =>
                                    handleGLBMaterialOverrideUpdate(
                                      "color",
                                      e.target.value
                                    )
                                  }
                                  className='p-0.5 h-8 w-10 rounded border-gray-300 dark:border-slate-600 cursor-pointer'
                                />
                                <Input
                                  value={glbMaterialOverride.color || "#cccccc"}
                                  onChange={(e) =>
                                    handleGLBMaterialOverrideUpdate(
                                      "color",
                                      e.target.value
                                    )
                                  }
                                  className={cn(inputClass, "flex-1")}
                                />
                              </div>
                            </div>
                            {showPBRForGLBOverride && (
                              <>
                                <div>
                                  <Label className={labelClass}>
                                    Roughness: {Number(pbrRoughness).toFixed(2)}
                                  </Label>
                                  <Slider
                                    value={[pbrRoughness]}
                                    onValueChange={([v]) =>
                                      handleGLBMaterialOverrideUpdate(
                                        "roughness",
                                        v
                                      )
                                    }
                                    max={1}
                                    min={0}
                                    step={0.01}
                                    className={sliderClass}
                                  />
                                </div>
                                <div>
                                  <Label className={labelClass}>
                                    Metalness: {Number(pbrMetalness).toFixed(2)}
                                  </Label>
                                  <Slider
                                    value={[pbrMetalness]}
                                    onValueChange={([v]) =>
                                      handleGLBMaterialOverrideUpdate(
                                        "metalness",
                                        v
                                      )
                                    }
                                    max={1}
                                    min={0}
                                    step={0.01}
                                    className={sliderClass}
                                  />
                                </div>
                              </>
                            )}
                            {showPhysicalForGLBOverride && (
                              <>
                                <div>
                                  <Label className={labelClass}>
                                    Transmission:{" "}
                                    {Number(physicalTransmission).toFixed(2)}
                                  </Label>
                                  <Slider
                                    value={[physicalTransmission]}
                                    onValueChange={([v]) =>
                                      handleGLBMaterialOverrideUpdate(
                                        "transmission",
                                        v
                                      )
                                    }
                                    max={1}
                                    min={0}
                                    step={0.01}
                                    className={sliderClass}
                                  />
                                </div>
                                <div>
                                  <Label className={labelClass}>
                                    IOR: {Number(physicalIor).toFixed(2)}
                                  </Label>
                                  <Slider
                                    value={[physicalIor]}
                                    onValueChange={([v]) =>
                                      handleGLBMaterialOverrideUpdate("ior", v)
                                    }
                                    max={2.33}
                                    min={1}
                                    step={0.01}
                                    className={sliderClass}
                                  />
                                </div>
                                <div>
                                  <Label className={labelClass}>
                                    Thickness:{" "}
                                    {Number(physicalThickness).toFixed(3)}
                                  </Label>
                                  <Slider
                                    value={[physicalThickness]}
                                    onValueChange={([v]) =>
                                      handleGLBMaterialOverrideUpdate(
                                        "thickness",
                                        v
                                      )
                                    }
                                    max={1}
                                    min={0}
                                    step={0.001}
                                    className={sliderClass}
                                  />
                                </div>
                                <div>
                                  <Label className={labelClass}>
                                    Clearcoat:{" "}
                                    {Number(physicalClearcoat).toFixed(2)}
                                  </Label>
                                  <Slider
                                    value={[physicalClearcoat]}
                                    onValueChange={([v]) =>
                                      handleGLBMaterialOverrideUpdate(
                                        "clearcoat",
                                        v
                                      )
                                    }
                                    max={1}
                                    min={0}
                                    step={0.01}
                                    className={sliderClass}
                                  />
                                </div>
                                <div>
                                  <Label className={labelClass}>
                                    Clearcoat Roughness:{" "}
                                    {Number(physicalClearcoatRoughness).toFixed(
                                      2
                                    )}
                                  </Label>
                                  <Slider
                                    value={[physicalClearcoatRoughness]}
                                    onValueChange={([v]) =>
                                      handleGLBMaterialOverrideUpdate(
                                        "clearcoatRoughness",
                                        v
                                      )
                                    }
                                    max={1}
                                    min={0}
                                    step={0.01}
                                    className={sliderClass}
                                  />
                                </div>
                              </>
                            )}
                            {glbMaterialOverride.type === "phong" && (
                              <div>
                                <Label className={labelClass}>
                                  Shininess: {Number(phongShininess).toFixed(0)}
                                </Label>
                                <Slider
                                  value={[phongShininess]}
                                  onValueChange={([v]) =>
                                    handleGLBMaterialOverrideUpdate(
                                      "shininess",
                                      v
                                    )
                                  }
                                  max={100}
                                  min={0}
                                  step={1}
                                  className={sliderClass}
                                />
                              </div>
                            )}
                          </>
                        )}
                    </>
                  ) : (
                    <>
                      <div>
                        <Label className={labelClass}>Material</Label>
                        <div className='flex flex-col space-y-1.5 mt-1'>
                          {materialOptionsList.map((opt) => {
                            const isActive =
                              (selectedShape.material || "standard") ===
                              opt.type;
                            return (
                              <Button
                                key={opt.type}
                                variant='outline'
                                className={cn(
                                  inputClass,
                                  "px-2.5 w-full justify-start text-left",
                                  isActive
                                    ? "bg-blue-600 dark:bg-purple-600 hover:bg-blue-700 dark:hover:bg-purple-700 text-white !border-blue-500 dark:!border-purple-500"
                                    : "hover:bg-gray-200 dark:hover:bg-slate-600"
                                )}
                                onClick={() =>
                                  handleGenericUpdate("material", opt.type)
                                }
                              >
                                {opt.name}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <Label className={labelClass}>Color</Label>
                        <div className='flex items-center space-x-2'>
                          <Input
                            type='color'
                            value={selectedShape.color || "#ffffff"}
                            onChange={(e) =>
                              handleGenericUpdate("color", e.target.value)
                            }
                            className='p-0.5 h-8 w-10 rounded border-gray-300 dark:border-slate-600 cursor-pointer'
                          />
                          <Input
                            value={selectedShape.color || "#ffffff"}
                            onChange={(e) =>
                              handleGenericUpdate("color", e.target.value)
                            }
                            className={cn(inputClass, "flex-1")}
                          />
                        </div>
                      </div>
                      {showPBRPropertiesForPrimitives && (
                        <>
                          <Separator className='my-2 bg-gray-200 dark:bg-slate-700' />
                          <div>
                            <Label className={labelClass}>
                              Roughness: {Number(pbrRoughness).toFixed(2)}
                            </Label>
                            <Slider
                              value={[pbrRoughness]}
                              onValueChange={([v]) =>
                                handleTexturePropUpdate("roughness", v)
                              }
                              max={1}
                              min={0}
                              step={0.01}
                              className={sliderClass}
                            />
                          </div>
                          <div>
                            <Label className={labelClass}>
                              Metalness: {Number(pbrMetalness).toFixed(2)}
                            </Label>
                            <Slider
                              value={[pbrMetalness]}
                              onValueChange={([v]) =>
                                handleTexturePropUpdate("metalness", v)
                              }
                              max={1}
                              min={0}
                              step={0.01}
                              className={sliderClass}
                            />
                          </div>
                        </>
                      )}
                      {showPhysicalPropertiesForPrimitives && (
                        <>
                          <Separator className='my-2 bg-gray-200 dark:bg-slate-700' />
                          <div>
                            <Label className={labelClass}>
                              Transmission:{" "}
                              {Number(physicalTransmission).toFixed(2)}
                            </Label>
                            <Slider
                              value={[physicalTransmission]}
                              onValueChange={([v]) =>
                                handleTexturePropUpdate("transmission", v)
                              }
                              max={1}
                              min={0}
                              step={0.01}
                              className={sliderClass}
                            />
                          </div>
                          <div>
                            <Label className={labelClass}>
                              IOR: {Number(physicalIor).toFixed(2)}
                            </Label>
                            <Slider
                              value={[physicalIor]}
                              onValueChange={([v]) =>
                                handleTexturePropUpdate("ior", v)
                              }
                              max={2.33}
                              min={1}
                              step={0.01}
                              className={sliderClass}
                            />
                          </div>
                          <div>
                            <Label className={labelClass}>
                              Thickness: {Number(physicalThickness).toFixed(3)}
                            </Label>
                            <Slider
                              value={[physicalThickness]}
                              onValueChange={([v]) =>
                                handleTexturePropUpdate("thickness", v)
                              }
                              max={1}
                              min={0}
                              step={0.001}
                              className={sliderClass}
                            />
                          </div>
                          <div>
                            <Label className={labelClass}>
                              Clearcoat: {Number(physicalClearcoat).toFixed(2)}
                            </Label>
                            <Slider
                              value={[physicalClearcoat]}
                              onValueChange={([v]) =>
                                handleTexturePropUpdate("clearcoat", v)
                              }
                              max={1}
                              min={0}
                              step={0.01}
                              className={sliderClass}
                            />
                          </div>
                          <div>
                            <Label className={labelClass}>
                              Clearcoat Roughness:{" "}
                              {Number(physicalClearcoatRoughness).toFixed(2)}
                            </Label>
                            <Slider
                              value={[physicalClearcoatRoughness]}
                              onValueChange={([v]) =>
                                handleTexturePropUpdate("clearcoatRoughness", v)
                              }
                              max={1}
                              min={0}
                              step={0.01}
                              className={sliderClass}
                            />
                          </div>
                        </>
                      )}
                      {showPhongPropertiesForPrimitives && (
                        <>
                          <Separator className='my-2 bg-gray-200 dark:bg-slate-700' />
                          <div>
                            <Label className={labelClass}>
                              Shininess: {Number(phongShininess).toFixed(0)}
                            </Label>
                            <Slider
                              value={[phongShininess]}
                              onValueChange={([v]) =>
                                handleTexturePropUpdate("shininess", v)
                              }
                              max={100}
                              min={0}
                              step={1}
                              className={sliderClass}
                            />
                          </div>
                        </>
                      )}
                    </>
                  )}
                  <Separator className='my-3 bg-gray-200 dark:bg-slate-700' />
                  <h4 className='text-xs font-semibold text-blue-600 dark:text-purple-300 flex items-center'>
                    <ImageUp size={12} className='mr-1.5' /> Textures
                  </h4>
                  <div className='grid grid-cols-2 gap-2.5'>
                    {activeTextureSlots.map((slot) => {
                      const currentUrl = currentTextureValues[`${slot.id}Url`];
                      const fileInputRef = fileInputRefsToUse.current[slot.id];
                      return (
                        <div
                          key={`${texturePropsKeyForShape}-${slot.id}`}
                          className='space-y-1'
                        >
                          <Label
                            htmlFor={`tex-upload-${slot.id}`}
                            className='text-xs text-gray-500 dark:text-slate-400'
                          >
                            {slot.name}
                          </Label>
                          {currentUrl && (
                            <div className='relative group w-full aspect-square bg-gray-200/50 dark:bg-slate-700/50 rounded overflow-hidden mb-0.5'>
                              <img
                                src={currentUrl}
                                alt={`${slot.name} preview`}
                                className='w-full h-full object-cover'
                              />
                              <Button
                                variant='destructive'
                                size='icon'
                                className='absolute top-0.5 right-0.5 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity p-0.5'
                                onClick={() =>
                                  handleClearTexture(
                                    selectedShape.id,
                                    slot.id,
                                    isText &&
                                      texturePropsKeyForShape ===
                                        "textTextureProps"
                                  )
                                }
                                title={`Clear ${slot.name}`}
                              >
                                <Trash2 size={10} />
                              </Button>
                            </div>
                          )}
                          <div className='flex items-center space-x-1'>
                            <Button
                              variant='outline'
                              size='xs'
                              className={cn(
                                "w-full text-xs py-1 px-1.5 h-auto",
                                inputClass,
                                "hover:bg-gray-200/50 dark:hover:bg-slate-600/50"
                              )}
                              onClick={() => fileInputRef?.click()}
                            >
                              <ImageUp size={10} className='mr-1' />{" "}
                              {currentUrl ? "Change" : "Upload"}
                            </Button>
                            {currentUrl && (
                              <Button
                                variant='ghost'
                                size='iconXs'
                                onClick={() =>
                                  handleClearTexture(
                                    selectedShape.id,
                                    slot.id,
                                    isText &&
                                      texturePropsKeyForShape ===
                                        "textTextureProps"
                                  )
                                }
                                title={`Clear ${slot.name}`}
                                className='p-0.5 h-auto text-gray-500 hover:text-red-400 dark:text-slate-400'
                              >
                                <X size={10} />
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className={cardClass}>
              <CardHeader className='p-3'>
                <CardTitle className='text-sm font-semibold text-gray-900 dark:text-slate-200'>
                  Animation
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4 p-3'>
                <div>
                  <Label className={labelClass}>Type</Label>
                  <div className='flex space-x-1.5 mt-1'>
                    {animationTypeOptions.map((opt) => {
                      const isActive = animation.type === opt.value;
                      return (
                        <Button
                          key={opt.value}
                          variant='outline'
                          className={cn(
                            inputClass,
                            "px-2.5 flex-1 text-center",
                            isActive
                              ? "bg-blue-600 dark:bg-purple-600 hover:bg-blue-700 dark:hover:bg-purple-700 text-white !border-blue-500 dark:!border-purple-500"
                              : "hover:bg-gray-200 dark:hover:bg-slate-600"
                          )}
                          onClick={() =>
                            handleAnimationUpdate("type", opt.value)
                          }
                        >
                          {opt.name}
                        </Button>
                      );
                    })}
                  </div>
                </div>
                {animation.type !== "none" && (
                  <>
                    <div>
                      <Label className={labelClass}>
                        Speed: {Number(animation.speed).toFixed(2)}
                      </Label>
                      <Slider
                        value={[animation.speed]}
                        onValueChange={([v]) =>
                          handleAnimationUpdate("speed", v)
                        }
                        min={0.05}
                        max={5}
                        step={0.05}
                        className={sliderClass}
                      />
                    </div>
                    {animation.type === "rotate" && (
                      <div>
                        <Label className={labelClass}>Rotation Axis</Label>
                        <div className='flex space-x-1.5 mt-1'>
                          {animationAxisOptions.map((opt) => {
                            const isActive = animation.axis === opt.value;
                            return (
                              <Button
                                key={opt.value}
                                variant='outline'
                                className={cn(
                                  inputClass,
                                  "px-2.5 flex-1 text-center",
                                  isActive
                                    ? "bg-blue-600 dark:bg-purple-600 hover:bg-blue-700 dark:hover:bg-purple-700 text-white !border-blue-500 dark:!border-purple-500"
                                    : "hover:bg-gray-200 dark:hover:bg-slate-600"
                                )}
                                onClick={() =>
                                  handleAnimationUpdate("axis", opt.value)
                                }
                              >
                                {opt.name}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {animation.type === "orbit" && (
                      <>
                        <div>
                          <Label className={labelClass}>
                            Orbit Radius:{" "}
                            {Number(animation.orbitRadius).toFixed(2)}
                          </Label>
                          <Slider
                            value={[animation.orbitRadius]}
                            onValueChange={([v]) =>
                              handleAnimationUpdate("orbitRadius", v)
                            }
                            min={0.1}
                            max={20}
                            step={0.1}
                            className={sliderClass}
                          />
                        </div>
                        <div>
                          <Label className={labelClass}>Orbit Plane</Label>
                          <div className='flex space-x-1.5 mt-1'>
                            {animationPlaneOptions.map((opt) => {
                              const isActive =
                                (animation.orbitPlane || "xz") === opt.value;
                              return (
                                <Button
                                  key={opt.value}
                                  variant='outline'
                                  className={cn(
                                    inputClass,
                                    "px-2.5 flex-1 text-center",
                                    isActive
                                      ? "bg-blue-600 dark:bg-purple-600 hover:bg-blue-700 dark:hover:bg-purple-700 text-white !border-blue-500 dark:!border-purple-500"
                                      : "hover:bg-gray-200 dark:hover:bg-slate-600"
                                  )}
                                  onClick={() =>
                                    handleAnimationUpdate(
                                      "orbitPlane",
                                      opt.value
                                    )
                                  }
                                >
                                  {opt.name}
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                        <div className='space-y-1'>
                          <Label className={labelClass}>Orbit Center</Label>
                          <div className='grid grid-cols-3 gap-2 items-center'>
                            {["X", "Y", "Z"].map((axisName, index) => (
                              <div key={axisName}>
                                <Label
                                  htmlFor={`orbit-center-${axisName}`}
                                  className='text-xs text-gray-500 dark:text-slate-400'
                                >
                                  {axisName}
                                </Label>
                                <Input
                                  id={`orbit-center-${axisName}`}
                                  type='number'
                                  value={(
                                    animation.orbitCenter[index] || 0
                                  ).toString()}
                                  onChange={(e) =>
                                    handleOrbitCenterUpdate(
                                      index,
                                      e.target.value
                                    )
                                  }
                                  className={cn(inputClass, "mt-0.5")}
                                  step='0.1'
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            <Card className={cardClass}>
              <CardHeader className='p-3'>
                <CardTitle className='text-sm font-semibold text-gray-900 dark:text-slate-200'>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className='p-3'>
                <div className='grid grid-cols-2 gap-2'>
                  {[
                    "resetScale",
                    "resetRotation",
                    "centerObject",
                    !isImagePlane && "randomColor",
                  ]
                    .filter(Boolean)
                    .map((actionKey) => (
                      <Button
                        key={actionKey}
                        onClick={() => handleQuickAction(actionKey)}
                        variant='outline'
                        size='sm'
                        className={cn(
                          inputClass,
                          "py-1.5 h-auto justify-center",
                          "hover:bg-gray-200/50 dark:hover:bg-slate-600/50"
                        )}
                      >
                        {actionKey
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </Button>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key='empty-properties'
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className='flex flex-col items-center justify-center h-full text-center py-10'
          >
            <Square
              size={48}
              className='text-gray-400 dark:text-slate-700 mb-6'
              strokeWidth={1.5}
            />
            <h3 className='text-lg font-semibold text-gray-800 dark:text-slate-300 mb-1'>
              No Object Selected
            </h3>
            <p className='text-xs text-gray-500 dark:text-slate-500 mb-6 leading-relaxed px-4'>
              Click an object in the scene to see its properties, or add a new
              one from the sidebar.
            </p>
            <div className='space-y-2 w-full max-w-[200px]'>
              <Button
                onClick={() => addShape("box")}
                className='w-full bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white'
              >
                <PlusCircle size={14} className='mr-2' /> Add Cube
              </Button>
              <Button
                onClick={() => addShape("text")}
                variant='outline'
                className={cn(
                  "border-gray-300 text-gray-700 hover:bg-gray-100/50 hover:text-gray-900",
                  "dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700/50 dark:hover:text-slate-100",
                  "w-full"
                )}
              >
                <TypeIcon size={14} className='mr-2' /> Add 3D Text
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// // import React, { useCallback } from "react";
// // import { motion, AnimatePresence } from "framer-motion";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Slider } from "@/components/ui/slider";
// // import {
// //   Tooltip,
// //   TooltipContent,
// //   TooltipTrigger,
// // } from "@/components/ui/tooltip";
// // import { Separator } from "@/components/ui/separator";
// // import { cn } from "@/lib/utils";
// // import {
// //   ImageUp,
// //   Trash2,
// //   Palette,
// //   LayersIcon as LayersIconLucide,
// //   Type as TypeIcon,
// //   X,
// //   Package,
// //   ImageIcon as ImageIconLucide,
// //   Square,
// //   PlusCircle,
// // } from "lucide-react";
// // import * as THREE from "three";

// // const initialTexturePropsValues = {
// //   mapUrl: null,
// //   normalMapUrl: null,
// //   roughnessMapUrl: null,
// //   metalnessMapUrl: null,
// //   aoMapUrl: null,
// //   emissiveMapUrl: null,
// //   roughness: 0.5,
// //   metalness: 0.0,
// //   aoMapIntensity: 1.0,
// //   emissiveColor: "#000000",
// //   emissiveIntensity: 1.0,
// //   transmission: 0.0,
// //   ior: 1.5,
// //   thickness: 0.01,
// //   clearcoat: 0.0,
// //   clearcoatRoughness: 0.0,
// //   sheen: 0.0,
// //   sheenColor: "#ffffff",
// //   sheenRoughness: 0.0,
// //   specularIntensity: 1.0,
// //   specularColor: "#ffffff",
// //   shininess: 30,
// // };

// // const allTextureSlots = [
// //   { id: "map", name: "Base Color (Albedo)" },
// //   { id: "normalMap", name: "Normal Map" },
// //   { id: "roughnessMap", name: "Roughness Map" },
// //   { id: "metalnessMap", name: "Metalness Map" },
// //   { id: "aoMap", name: "AO Map" },
// //   { id: "emissiveMap", name: "Emissive Map" },
// // ];

// // const materialOptionsList = [
// //   { name: "Standard (PBR)", type: "standard" },
// //   { name: "Physical (PBR)", type: "physical" },
// //   { name: "Toon", type: "toon" },
// //   { name: "Basic (Non-PBR)", type: "basic" },
// //   { name: "Lambert (Non-PBR)", type: "lambert" },
// //   { name: "Phong (Non-PBR)", type: "phong" },
// //   { name: "Wireframe", type: "wireframe" },
// // ];

// // const glbMaterialOptionsWithModel = [
// //   { name: "Model's Own Materials", type: "model" },
// //   ...materialOptionsList,
// // ];

// // const animationTypeOptions = [
// //   { name: "None", value: "none" },
// //   { name: "Rotate", value: "rotate" },
// //   { name: "Orbit", value: "orbit" },
// // ];

// // const animationAxisOptions = [
// //   { name: "X Axis", value: "x" },
// //   { name: "Y Axis", value: "y" },
// //   { name: "Z Axis", value: "z" },
// // ];

// // const animationPlaneOptions = [
// //   { name: "XY Plane", value: "xy" },
// //   { name: "XZ Plane", value: "xz" },
// //   { name: "YZ Plane", value: "yz" },
// // ];

// // export default function PropertiesPanel({
// //   selectedShape,
// //   updateShape,
// //   removeShape,
// //   duplicateShape,
// //   addShape,
// //   handleTextureUpload,
// //   handleClearTexture,
// //   shapeTextureFileInputRefs,
// //   textTextureFileInputRefs,
// //   portalContainerRef,
// //   isFullscreen,
// // }) {
// //   const shapeDisplayOptions = [
// //     { name: "Cube", type: "box", icon: "🧊" },
// //     { name: "Sphere", type: "sphere", icon: "⚪" },
// //     { name: "Cylinder", type: "cylinder", icon: "🥫" },
// //     { name: "Cone", type: "cone", icon: "🔺" },
// //     { name: "Torus", type: "torus", icon: "🍩" },
// //     { name: "Pyramid", type: "pyramid", icon: "🔺" },
// //     { name: "3D Text", type: "text", icon: <TypeIcon size={18} /> },
// //     {
// //       name: "Image Plane",
// //       type: "imagePlane",
// //       icon: <ImageIconLucide size={18} />,
// //     },
// //     {
// //       name: "Imported Model",
// //       type: "importedGLB",
// //       icon: <Package size={18} />,
// //     },
// //   ];
// //   const popularShapeIcons = {
// //     heart: "❤️",
// //     star: "⭐",
// //     crown: "👑",
// //     lightning: "⚡️",
// //     diamond: "💎",
// //     shield: "🛡️",
// //     arrow: "➡️",
// //     leaf: "🍃",
// //     sword: "⚔️",
// //     butterfly: "🦋",
// //   };

// //   const currentShapeType = selectedShape?.type;
// //   const isCustomExtruded = currentShapeType === "customExtruded";
// //   const isImportedGLB = currentShapeType === "importedGLB";
// //   const isText = currentShapeType === "text";
// //   const isImagePlane = currentShapeType === "imagePlane";

// //   const glbMaterialOverride = selectedShape?.glbMaterialOverride || null;

// //   const showPBRForGLBOverride =
// //     glbMaterialOverride &&
// //     ["standard", "physical"].includes(glbMaterialOverride.type);

// //   const currentMaterialForPrimitives = selectedShape?.material;
// //   const showPBRPropertiesForPrimitives =
// //     !isImportedGLB &&
// //     !isImagePlane &&
// //     selectedShape &&
// //     ["standard", "physical"].includes(currentMaterialForPrimitives);
// //   const showPhongPropertiesForPrimitives =
// //     !isImportedGLB &&
// //     !isImagePlane &&
// //     selectedShape &&
// //     currentMaterialForPrimitives === "phong";
// //   const showPhysicalPropertiesForPrimitives =
// //     !isImportedGLB &&
// //     !isImagePlane &&
// //     selectedShape &&
// //     currentMaterialForPrimitives === "physical";

// //   const showPhysicalForGLBOverride =
// //     glbMaterialOverride && glbMaterialOverride.type === "physical";

// //   const animation = selectedShape?.animation
// //     ? {
// //         type: selectedShape.animation.type || "none",
// //         speed:
// //           selectedShape.animation.speed !== undefined
// //             ? selectedShape.animation.speed
// //             : 1,
// //         axis: selectedShape.animation.axis || "y",
// //         orbitCenter: selectedShape.animation.orbitCenter || [0, 0, 0],
// //         orbitRadius:
// //           selectedShape.animation.orbitRadius !== undefined
// //             ? selectedShape.animation.orbitRadius
// //             : 5,
// //         orbitPlane: selectedShape.animation.orbitPlane || "xz",
// //       }
// //     : {
// //         type: "none",
// //         speed: 1,
// //         axis: "y",
// //         orbitCenter: [0, 0, 0],
// //         orbitRadius: 5,
// //         orbitPlane: "xz",
// //       };

// //   const handleTransformUpdate = useCallback(
// //     (property, index, valueStr) => {
// //       if (!selectedShape) return;
// //       const value = parseFloat(valueStr);
// //       if (isNaN(value) && property !== "rotation") return;
// //       const newTransform = [...selectedShape[property]];
// //       newTransform[index] =
// //         property === "rotation"
// //           ? THREE.MathUtils.degToRad(value || 0)
// //           : Math.max(property === "scale" ? 0.01 : -Infinity, value);
// //       updateShape(selectedShape.id, { [property]: newTransform });
// //     },
// //     [selectedShape, updateShape]
// //   );

// //   const handleGenericUpdate = useCallback(
// //     (property, value) => {
// //       if (!selectedShape) return;
// //       updateShape(selectedShape.id, { [property]: value });
// //     },
// //     [selectedShape, updateShape]
// //   );

// //   const handleTexturePropUpdate = useCallback(
// //     (propName, value) => {
// //       if (!selectedShape) return;
// //       const targetPropsKey = isText ? "textTextureProps" : "textureProps";
// //       const newTextureProps = {
// //         ...(selectedShape[targetPropsKey] || initialTexturePropsValues),
// //         [propName]: value,
// //       };
// //       updateShape(selectedShape.id, { [targetPropsKey]: newTextureProps });
// //     },
// //     [selectedShape, updateShape, isText]
// //   );

// //   const handleGLBMaterialOverrideUpdate = useCallback(
// //     (property, value) => {
// //       if (!selectedShape || !isImportedGLB) return;
// //       const currentOverride = selectedShape.glbMaterialOverride || {};
// //       let newOverrideSettings = { ...currentOverride, [property]: value };

// //       if (property === "type") {
// //         if (value === "model") {
// //           newOverrideSettings = null;
// //         } else {
// //           newOverrideSettings.color =
// //             currentOverride.color || selectedShape.color || "#cccccc";

// //           if (value === "standard" || value === "physical") {
// //             newOverrideSettings.roughness =
// //               currentOverride.roughness ?? initialTexturePropsValues.roughness;
// //             newOverrideSettings.metalness =
// //               currentOverride.metalness ?? initialTexturePropsValues.metalness;
// //           } else {
// //             delete newOverrideSettings.roughness;
// //             delete newOverrideSettings.metalness;
// //           }

// //           if (value === "physical") {
// //             newOverrideSettings.transmission =
// //               currentOverride.transmission ??
// //               initialTexturePropsValues.transmission;
// //             newOverrideSettings.ior =
// //               currentOverride.ior ?? initialTexturePropsValues.ior;
// //             newOverrideSettings.thickness =
// //               currentOverride.thickness ?? initialTexturePropsValues.thickness;
// //             newOverrideSettings.clearcoat =
// //               currentOverride.clearcoat ?? initialTexturePropsValues.clearcoat;
// //             newOverrideSettings.clearcoatRoughness =
// //               currentOverride.clearcoatRoughness ??
// //               initialTexturePropsValues.clearcoatRoughness;
// //           } else {
// //             delete newOverrideSettings.transmission;
// //             delete newOverrideSettings.ior;
// //             delete newOverrideSettings.thickness;
// //             delete newOverrideSettings.clearcoat;
// //             delete newOverrideSettings.clearcoatRoughness;
// //           }

// //           if (value === "phong") {
// //             newOverrideSettings.shininess =
// //               currentOverride.shininess ?? initialTexturePropsValues.shininess;
// //           } else {
// //             delete newOverrideSettings.shininess;
// //           }
// //         }
// //       }
// //       updateShape(selectedShape.id, {
// //         glbMaterialOverride: newOverrideSettings,
// //       });
// //     },
// //     [selectedShape, updateShape, isImportedGLB]
// //   );

// //   const handleAnimationUpdate = useCallback(
// //     (property, value) => {
// //       if (!selectedShape) return;
// //       const currentAnimationData = selectedShape.animation || {
// //         type: "none",
// //         speed: 1,
// //         axis: "y",
// //         orbitCenter: [0, 0, 0],
// //         orbitRadius: 5,
// //         orbitPlane: "xz",
// //       };
// //       updateShape(selectedShape.id, {
// //         animation: { ...currentAnimationData, [property]: value },
// //       });
// //     },
// //     [selectedShape, updateShape]
// //   );

// //   const handleOrbitCenterUpdate = useCallback(
// //     (index, valueStr) => {
// //       if (!selectedShape || !selectedShape.animation) return;
// //       const value = parseFloat(valueStr);
// //       if (isNaN(value)) return;
// //       const newOrbitCenter = [
// //         ...(selectedShape.animation.orbitCenter || [0, 0, 0]),
// //       ];
// //       newOrbitCenter[index] = value;
// //       handleAnimationUpdate("orbitCenter", newOrbitCenter);
// //     },
// //     [selectedShape, handleAnimationUpdate]
// //   );

// //   const handleQuickAction = useCallback(
// //     (action) => {
// //       if (!selectedShape) return;
// //       const actions = {
// //         resetScale: () => updateShape(selectedShape.id, { scale: [1, 1, 1] }),
// //         resetRotation: () =>
// //           updateShape(selectedShape.id, { rotation: [0, 0, 0] }),
// //         centerObject: () => {
// //           let yO = 0;
// //           if (selectedShape.scale && selectedShape.scale[1]) {
// //             if (selectedShape.type === "pyramid") yO = 0;
// //             else if (selectedShape.type === "text")
// //               yO =
// //                 (selectedShape.textSize || 0.5) * selectedShape.scale[1] * 0.5;
// //             else if (selectedShape.type === "imagePlane")
// //               yO =
// //                 ((selectedShape.planeHeight || 1) * selectedShape.scale[1]) / 2;
// //             else if (selectedShape.type === "importedGLB") yO = 0;
// //             else yO = selectedShape.scale[1] * 0.5;
// //           }
// //           updateShape(selectedShape.id, { position: [0, yO, 0] });
// //         },
// //         randomColor: () => {
// //           if (isImagePlane) {
// //             alert("Cannot apply random color to image planes.");
// //             return;
// //           }
// //           const nC = `#${Math.floor(Math.random() * 16777215)
// //             .toString(16)
// //             .padStart(6, "0")}`;
// //           if (isImportedGLB) {
// //             handleGLBMaterialOverrideUpdate("color", nC);
// //             if (
// //               !selectedShape.glbMaterialOverride ||
// //               selectedShape.glbMaterialOverride.type === "model"
// //             ) {
// //               handleGLBMaterialOverrideUpdate("type", "standard");
// //             }
// //           } else {
// //             updateShape(selectedShape.id, { color: nC });
// //           }
// //         },
// //       };
// //       actions[action]?.();
// //     },
// //     [
// //       selectedShape,
// //       updateShape,
// //       isImportedGLB,
// //       isImagePlane,
// //       handleGLBMaterialOverrideUpdate,
// //     ]
// //   );

// //   let activeTextureSlots = [];
// //   let currentTextureValues = { ...initialTexturePropsValues };
// //   let fileInputRefsToUse = shapeTextureFileInputRefs;
// //   let texturePropsKeyForShape = "textureProps";

// //   if (selectedShape) {
// //     if (isText) {
// //       activeTextureSlots = [
// //         { id: "map", name: "Color/Albedo Map" },
// //         { id: "normalMap", name: "Normal Map" },
// //       ];
// //       currentTextureValues = {
// //         ...initialTexturePropsValues,
// //         ...(selectedShape.textTextureProps || {}),
// //       };
// //       fileInputRefsToUse = textTextureFileInputRefs;
// //       texturePropsKeyForShape = "textTextureProps";
// //     } else if (isImportedGLB) {
// //       activeTextureSlots = allTextureSlots;
// //       currentTextureValues = {
// //         ...initialTexturePropsValues,
// //         ...(selectedShape.textureProps || {}),
// //       };
// //     } else if (!isImagePlane) {
// //       activeTextureSlots = allTextureSlots;
// //       currentTextureValues = {
// //         ...initialTexturePropsValues,
// //         ...(selectedShape.textureProps || {}),
// //       };
// //     }
// //   }

// //   const getShapeIcon = () => {
// //     if (!selectedShape) return <Square size={24} className='text-slate-500' />;
// //     const iconData = shapeDisplayOptions.find(
// //       (s) => s.type === currentShapeType
// //     );
// //     if (iconData)
// //       return typeof iconData.icon === "string" ? (
// //         <span className='text-2xl'>{iconData.icon}</span>
// //       ) : (
// //         React.cloneElement(iconData.icon, { className: "text-purple-400" })
// //       );
// //     if (isCustomExtruded)
// //       return (
// //         <span className='text-2xl'>
// //           {popularShapeIcons[selectedShape.shapeType?.toLowerCase()] || "💖"}
// //         </span>
// //       );
// //     return <Square size={24} className='text-purple-400' />;
// //   };

// //   const cardClass =
// //     "bg-white dark:bg-slate-800/70 border border-gray-200 dark:border-slate-700 shadow-lg rounded-lg";
// //   const inputClass =
// //     "bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-800 dark:text-slate-100 text-xs h-8 rounded-md focus:ring-1 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-blue-500 dark:focus:border-purple-500";
// //   const labelClass =
// //     "text-xs font-medium text-gray-600 dark:text-slate-300 mb-1.5 block";
// //   const sliderClass =
// //     "[&>span:first-child]:bg-blue-600 dark:[&>span:first-child]:bg-purple-600 [&>span:last-child]:bg-gray-200 dark:[&>span:last-child]:bg-slate-700";

// //   const pbrRoughness = isImportedGLB
// //     ? glbMaterialOverride?.roughness ?? currentTextureValues.roughness
// //     : selectedShape?.textureProps?.roughness ??
// //       selectedShape?.roughness ??
// //       initialTexturePropsValues.roughness;
// //   const pbrMetalness = isImportedGLB
// //     ? glbMaterialOverride?.metalness ?? currentTextureValues.metalness
// //     : selectedShape?.textureProps?.metalness ??
// //       selectedShape?.metalness ??
// //       initialTexturePropsValues.metalness;
// //   const physicalTransmission = isImportedGLB
// //     ? glbMaterialOverride?.transmission ?? currentTextureValues.transmission
// //     : selectedShape?.textureProps?.transmission ??
// //       selectedShape?.transmission ??
// //       initialTexturePropsValues.transmission;
// //   const physicalIor = isImportedGLB
// //     ? glbMaterialOverride?.ior ?? currentTextureValues.ior
// //     : selectedShape?.textureProps?.ior ??
// //       selectedShape?.ior ??
// //       initialTexturePropsValues.ior;
// //   const physicalThickness = isImportedGLB
// //     ? glbMaterialOverride?.thickness ?? currentTextureValues.thickness
// //     : selectedShape?.textureProps?.thickness ??
// //       selectedShape?.thickness ??
// //       initialTexturePropsValues.thickness;
// //   const physicalClearcoat = isImportedGLB
// //     ? glbMaterialOverride?.clearcoat ?? currentTextureValues.clearcoat
// //     : selectedShape?.textureProps?.clearcoat ??
// //       selectedShape?.clearcoat ??
// //       initialTexturePropsValues.clearcoat;
// //   const physicalClearcoatRoughness = isImportedGLB
// //     ? glbMaterialOverride?.clearcoatRoughness ??
// //       currentTextureValues.clearcoatRoughness
// //     : selectedShape?.textureProps?.clearcoatRoughness ??
// //       selectedShape?.clearcoatRoughness ??
// //       initialTexturePropsValues.clearcoatRoughness;
// //   const phongShininess = isImportedGLB
// //     ? glbMaterialOverride?.shininess ?? currentTextureValues.shininess
// //     : selectedShape?.textureProps?.shininess ??
// //       selectedShape?.shininess ??
// //       initialTexturePropsValues.shininess;

// //   return (
// //     <motion.div
// //       initial={{ x: 30, opacity: 0 }}
// //       animate={{ x: 0, opacity: 1 }}
// //       transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
// //       // FIXED: Proper z-index stacking and responsive positioning
// //       className={cn(
// //         "w-72 p-4 overflow-y-auto shadow-xl text-gray-900 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200",
// //         "dark:text-slate-100 dark:scrollbar-thumb-slate-700 dark:scrollbar-track-slate-800",
// //         "bg-gray-50/95 backdrop-blur-md border-l border-gray-200/60",
// //         "dark:bg-slate-900/95 dark:border-slate-700/60",
// //         // Mobile: Fixed position overlay with proper z-index
// //         "fixed top-0 right-0 bottom-0 z-[60] md:relative md:z-auto",
// //         // Desktop: Normal flow positioning
// //         "md:bg-transparent md:backdrop-blur-none md:border-gray-200/50 md:shadow-none",
// //         // Ensure it's above canvas but below modals
// //         "transform-gpu will-change-transform"
// //       )}
// //     >
// //       <AnimatePresence mode='wait'>
// //         {selectedShape ? (
// //           <motion.div
// //             key={selectedShape.id}
// //             initial={{ opacity: 0, y: 15 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             exit={{ opacity: 0, y: -15 }}
// //             className='space-y-5'
// //           >
// //             <div className='flex justify-between items-center'>
// //               <div>
// //                 <h3 className='text-md font-semibold text-gray-900 dark:text-slate-100'>
// //                   Object Properties
// //                 </h3>
// //                 <p className='text-xs text-gray-500 dark:text-slate-400'>
// //                   {selectedShape.name ||
// //                     (isText ? "3D Text" : currentShapeType)}
// //                 </p>
// //               </div>
// //               <div className='flex items-center space-x-1'>
// //                 <Tooltip>
// //                   <TooltipTrigger asChild>
// //                     <Button
// //                       onClick={duplicateShape}
// //                       variant='ghost'
// //                       size='icon'
// //                       className='w-7 h-7 text-gray-500 hover:text-blue-600 hover:bg-gray-100/50
// //                                  dark:text-slate-400 dark:hover:text-purple-300 dark:hover:bg-slate-700/50'
// //                     >
// //                       <LayersIconLucide size={14} />
// //                     </Button>
// //                   </TooltipTrigger>
// //                   <TooltipContent
// //                     side='bottom'
// //                     className='bg-white text-gray-800 border-gray-200
// //                                dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
// //                   >
// //                     <p>Duplicate (Ctrl+D)</p>
// //                   </TooltipContent>
// //                 </Tooltip>
// //                 <Tooltip>
// //                   <TooltipTrigger asChild>
// //                     <Button
// //                       onClick={() => removeShape(selectedShape.id)}
// //                       variant='ghost'
// //                       size='icon'
// //                       className='w-7 h-7 text-red-500 hover:text-red-400 hover:bg-red-500/20'
// //                     >
// //                       <Trash2 size={14} />
// //                     </Button>
// //                   </TooltipTrigger>
// //                   <TooltipContent
// //                     side='bottom'
// //                     className='bg-white text-gray-800 border-gray-200
// //                                dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
// //                   >
// //                     <p>Delete (Del/Backspace)</p>
// //                   </TooltipContent>
// //                 </Tooltip>
// //               </div>
// //             </div>
// //             <Separator className='bg-gray-200 dark:bg-slate-700' />

// //             <Card className={cardClass}>
// //               <CardContent className='p-3'>
// //                 <Label htmlFor='object-name' className={labelClass}>
// //                   Name
// //                 </Label>
// //                 <Input
// //                   id='object-name'
// //                   value={selectedShape.name || ""}
// //                   onChange={(e) => handleGenericUpdate("name", e.target.value)}
// //                   placeholder='Object Name'
// //                   className={inputClass}
// //                 />
// //               </CardContent>
// //             </Card>

// //             {isText && (
// //               <Card className={cardClass}>
// //                 <CardHeader className='p-3'>
// //                   <CardTitle className='text-sm font-semibold text-gray-900 dark:text-slate-200'>
// //                     Text Settings
// //                   </CardTitle>
// //                 </CardHeader>
// //                 <CardContent className='space-y-4 p-3'>
// //                   <div>
// //                     <Label htmlFor='text-content' className={labelClass}>
// //                       Content
// //                     </Label>
// //                     <Input
// //                       id='text-content'
// //                       value={selectedShape.text || ""}
// //                       onChange={(e) =>
// //                         handleGenericUpdate("text", e.target.value)
// //                       }
// //                       placeholder='Enter text...'
// //                       className={inputClass}
// //                     />
// //                   </div>
// //                   <div>
// //                     <Label className={labelClass}>
// //                       Size: {selectedShape.textSize?.toFixed(2) || 0.5}
// //                     </Label>
// //                     <Slider
// //                       value={[selectedShape.textSize || 0.5]}
// //                       onValueChange={([v]) =>
// //                         handleGenericUpdate("textSize", v)
// //                       }
// //                       max={2}
// //                       min={0.1}
// //                       step={0.05}
// //                       className={sliderClass}
// //                     />
// //                   </div>
// //                   <div>
// //                     <Label className={labelClass}>
// //                       Thickness: {selectedShape.extrudeDepth?.toFixed(2) || 0.2}
// //                     </Label>
// //                     <Slider
// //                       value={[selectedShape.extrudeDepth || 0.2]}
// //                       onValueChange={([v]) =>
// //                         handleGenericUpdate("extrudeDepth", v)
// //                       }
// //                       max={1}
// //                       min={0.01}
// //                       step={0.01}
// //                       className={sliderClass}
// //                     />
// //                   </div>
// //                 </CardContent>
// //               </Card>
// //             )}
// //             {isCustomExtruded && (
// //               <Card className={cardClass}>
// //                 <CardHeader className='p-3'>
// //                   <CardTitle className='text-sm font-semibold text-gray-900 dark:text-slate-200'>
// //                     Custom Shape Settings
// //                   </CardTitle>
// //                 </CardHeader>
// //                 <CardContent className='space-y-4 p-3'>
// //                   <div>
// //                     <Label className={labelClass}>
// //                       Size: {selectedShape.shapeSize?.toFixed(2) || 1.0}
// //                     </Label>
// //                     <Slider
// //                       value={[selectedShape.shapeSize || 1]}
// //                       onValueChange={([v]) =>
// //                         handleGenericUpdate("shapeSize", v)
// //                       }
// //                       max={5}
// //                       min={0.1}
// //                       step={0.05}
// //                       className={sliderClass}
// //                     />
// //                   </div>
// //                   <div>
// //                     <Label className={labelClass}>
// //                       Depth: {selectedShape.extrudeDepth?.toFixed(2) || 0.2}
// //                     </Label>
// //                     <Slider
// //                       value={[selectedShape.extrudeDepth || 0.2]}
// //                       onValueChange={([v]) =>
// //                         handleGenericUpdate("extrudeDepth", v)
// //                       }
// //                       max={2}
// //                       min={0.01}
// //                       step={0.01}
// //                       className={sliderClass}
// //                     />
// //                   </div>
// //                 </CardContent>
// //               </Card>
// //             )}

// //             <Card className={cardClass}>
// //               <CardHeader className='p-3'>
// //                 <CardTitle className='text-sm font-semibold text-gray-900 dark:text-slate-200'>
// //                   Transform
// //                 </CardTitle>
// //               </CardHeader>
// //               <CardContent className='space-y-4 p-3'>
// //                 {["position", "rotation", "scale"].map((prop) => (
// //                   <div key={prop} className='space-y-2'>
// //                     <h4 className='font-medium text-xs text-gray-700 dark:text-slate-300 capitalize'>
// //                       {prop}
// //                     </h4>
// //                     {["X", "Y", "Z"].map((axis, index) => (
// //                       <div
// //                         key={axis}
// //                         className='grid grid-cols-6 items-center gap-2'
// //                       >
// //                         <Label
// //                           htmlFor={`${prop}-${axis}`}
// //                           className='text-xs text-gray-500 dark:text-slate-400 col-span-1'
// //                         >
// //                           {axis}
// //                         </Label>
// //                         <Input
// //                           id={`${prop}-${axis}`}
// //                           type='number'
// //                           value={
// //                             prop === "rotation"
// //                               ? THREE.MathUtils.radToDeg(
// //                                   selectedShape[prop][index] || 0
// //                                 ).toFixed(0)
// //                               : (selectedShape[prop][index] || 0).toFixed(2)
// //                           }
// //                           onChange={(e) =>
// //                             handleTransformUpdate(prop, index, e.target.value)
// //                           }
// //                           step={prop === "rotation" ? 5 : 0.1}
// //                           className={cn(inputClass, "col-span-2")}
// //                         />
// //                         <Slider
// //                           value={[
// //                             prop === "rotation"
// //                               ? THREE.MathUtils.radToDeg(
// //                                   selectedShape[prop][index] || 0
// //                                 )
// //                               : selectedShape[prop][index] || 0,
// //                           ]}
// //                           onValueChange={([v]) =>
// //                             handleTransformUpdate(prop, index, v.toString())
// //                           }
// //                           min={
// //                             prop === "rotation"
// //                               ? -360
// //                               : prop === "scale"
// //                               ? 0.01
// //                               : -15
// //                           }
// //                           max={
// //                             prop === "rotation"
// //                               ? 360
// //                               : prop === "scale"
// //                               ? 10
// //                               : 15
// //                           }
// //                           step={
// //                             prop === "rotation"
// //                               ? 1
// //                               : prop === "scale"
// //                               ? 0.01
// //                               : 0.1
// //                           }
// //                           className={cn("col-span-3", sliderClass)}
// //                         />
// //                       </div>
// //                     ))}
// //                   </div>
// //                 ))}
// //               </CardContent>
// //             </Card>

// //             {!isImagePlane && (
// //               <Card className={cardClass}>
// //                 <CardHeader className='p-3'>
// //                   <CardTitle className='text-sm font-semibold text-gray-900 dark:text-slate-200 flex items-center'>
// //                     <Palette
// //                       size={14}
// //                       className='mr-1.5 text-blue-600 dark:text-purple-400'
// //                     />{" "}
// //                     Appearance
// //                   </CardTitle>
// //                 </CardHeader>
// //                 <CardContent className='space-y-4 p-3'>
// //                   {isImportedGLB ? (
// //                     <>
// //                       <p className='text-xs text-gray-500 dark:text-slate-400'>
// //                         Override model's materials. Changes apply to all meshes.
// //                       </p>
// //                       <div>
// //                         <Label className={labelClass}>Override Material</Label>
// //                         <div className='flex flex-col space-y-1.5 mt-1'>
// //                           {glbMaterialOptionsWithModel.map((opt) => {
// //                             const isActive =
// //                               (glbMaterialOverride?.type || "model") ===
// //                               opt.type;
// //                             return (
// //                               <Button
// //                                 key={opt.type}
// //                                 variant='outline'
// //                                 className={cn(
// //                                   inputClass,
// //                                   "px-2.5 w-full justify-start text-left",
// //                                   isActive
// //                                     ? "bg-blue-600 dark:bg-purple-600 hover:bg-blue-700 dark:hover:bg-purple-700 text-white !border-blue-500 dark:!border-purple-500"
// //                                     : "hover:bg-gray-200 dark:hover:bg-slate-600"
// //                                 )}
// //                                 onClick={() =>
// //                                   handleGLBMaterialOverrideUpdate(
// //                                     "type",
// //                                     opt.type
// //                                   )
// //                                 }
// //                               >
// //                                 {opt.name}
// //                               </Button>
// //                             );
// //                           })}
// //                         </div>
// //                       </div>
// //                       {glbMaterialOverride &&
// //                         glbMaterialOverride.type !== "model" && (
// //                           <>
// //                             <Separator className='my-2 bg-gray-200 dark:bg-slate-700' />
// //                             <div>
// //                               <Label className={labelClass}>
// //                                 Override Color
// //                               </Label>
// //                               <div className='flex items-center space-x-2'>
// //                                 <Input
// //                                   type='color'
// //                                   value={glbMaterialOverride.color || "#cccccc"}
// //                                   onChange={(e) =>
// //                                     handleGLBMaterialOverrideUpdate(
// //                                       "color",
// //                                       e.target.value
// //                                     )
// //                                   }
// //                                   className='p-0.5 h-8 w-10 rounded border-gray-300 dark:border-slate-600 cursor-pointer'
// //                                 />
// //                                 <Input
// //                                   value={glbMaterialOverride.color || "#cccccc"}
// //                                   onChange={(e) =>
// //                                     handleGLBMaterialOverrideUpdate(
// //                                       "color",
// //                                       e.target.value
// //                                     )
// //                                   }
// //                                   className={cn(inputClass, "flex-1")}
// //                                 />
// //                               </div>
// //                             </div>
// //                             {showPBRForGLBOverride && (
// //                               <>
// //                                 <div>
// //                                   <Label className={labelClass}>
// //                                     Roughness: {Number(pbrRoughness).toFixed(2)}
// //                                   </Label>
// //                                   <Slider
// //                                     value={[pbrRoughness]}
// //                                     onValueChange={([v]) =>
// //                                       handleGLBMaterialOverrideUpdate(
// //                                         "roughness",
// //                                         v
// //                                       )
// //                                     }
// //                                     max={1}
// //                                     min={0}
// //                                     step={0.01}
// //                                     className={sliderClass}
// //                                   />
// //                                 </div>
// //                                 <div>
// //                                   <Label className={labelClass}>
// //                                     Metalness: {Number(pbrMetalness).toFixed(2)}
// //                                   </Label>
// //                                   <Slider
// //                                     value={[pbrMetalness]}
// //                                     onValueChange={([v]) =>
// //                                       handleGLBMaterialOverrideUpdate(
// //                                         "metalness",
// //                                         v
// //                                       )
// //                                     }
// //                                     max={1}
// //                                     min={0}
// //                                     step={0.01}
// //                                     className={sliderClass}
// //                                   />
// //                                 </div>
// //                               </>
// //                             )}
// //                             {showPhysicalForGLBOverride && (
// //                               <>
// //                                 <div>
// //                                   <Label className={labelClass}>
// //                                     Transmission:{" "}
// //                                     {Number(physicalTransmission).toFixed(2)}
// //                                   </Label>
// //                                   <Slider
// //                                     value={[physicalTransmission]}
// //                                     onValueChange={([v]) =>
// //                                       handleGLBMaterialOverrideUpdate(
// //                                         "transmission",
// //                                         v
// //                                       )
// //                                     }
// //                                     max={1}
// //                                     min={0}
// //                                     step={0.01}
// //                                     className={sliderClass}
// //                                   />
// //                                 </div>
// //                                 <div>
// //                                   <Label className={labelClass}>
// //                                     IOR: {Number(physicalIor).toFixed(2)}
// //                                   </Label>
// //                                   <Slider
// //                                     value={[physicalIor]}
// //                                     onValueChange={([v]) =>
// //                                       handleGLBMaterialOverrideUpdate("ior", v)
// //                                     }
// //                                     max={2.33}
// //                                     min={1}
// //                                     step={0.01}
// //                                     className={sliderClass}
// //                                   />
// //                                 </div>
// //                                 <div>
// //                                   <Label className={labelClass}>
// //                                     Thickness:{" "}
// //                                     {Number(physicalThickness).toFixed(3)}
// //                                   </Label>
// //                                   <Slider
// //                                     value={[physicalThickness]}
// //                                     onValueChange={([v]) =>
// //                                       handleGLBMaterialOverrideUpdate(
// //                                         "thickness",
// //                                         v
// //                                       )
// //                                     }
// //                                     max={1}
// //                                     min={0}
// //                                     step={0.001}
// //                                     className={sliderClass}
// //                                   />
// //                                 </div>
// //                                 <div>
// //                                   <Label className={labelClass}>
// //                                     Clearcoat:{" "}
// //                                     {Number(physicalClearcoat).toFixed(2)}
// //                                   </Label>
// //                                   <Slider
// //                                     value={[physicalClearcoat]}
// //                                     onValueChange={([v]) =>
// //                                       handleGLBMaterialOverrideUpdate(
// //                                         "clearcoat",
// //                                         v
// //                                       )
// //                                     }
// //                                     max={1}
// //                                     min={0}
// //                                     step={0.01}
// //                                     className={sliderClass}
// //                                   />
// //                                 </div>
// //                                 <div>
// //                                   <Label className={labelClass}>
// //                                     Clearcoat Roughness:{" "}
// //                                     {Number(physicalClearcoatRoughness).toFixed(
// //                                       2
// //                                     )}
// //                                   </Label>
// //                                   <Slider
// //                                     value={[physicalClearcoatRoughness]}
// //                                     onValueChange={([v]) =>
// //                                       handleGLBMaterialOverrideUpdate(
// //                                         "clearcoatRoughness",
// //                                         v
// //                                       )
// //                                     }
// //                                     max={1}
// //                                     min={0}
// //                                     step={0.01}
// //                                     className={sliderClass}
// //                                   />
// //                                 </div>
// //                               </>
// //                             )}
// //                             {glbMaterialOverride.type === "phong" && (
// //                               <div>
// //                                 <Label className={labelClass}>
// //                                   Shininess: {Number(phongShininess).toFixed(0)}
// //                                 </Label>
// //                                 <Slider
// //                                   value={[phongShininess]}
// //                                   onValueChange={([v]) =>
// //                                     handleGLBMaterialOverrideUpdate(
// //                                       "shininess",
// //                                       v
// //                                     )
// //                                   }
// //                                   max={100}
// //                                   min={0}
// //                                   step={1}
// //                                   className={sliderClass}
// //                                 />
// //                               </div>
// //                             )}
// //                           </>
// //                         )}
// //                     </>
// //                   ) : (
// //                     <>
// //                       <div>
// //                         <Label className={labelClass}>Material</Label>
// //                         <div className='flex flex-col space-y-1.5 mt-1'>
// //                           {materialOptionsList.map((opt) => {
// //                             const isActive =
// //                               (selectedShape.material || "standard") ===
// //                               opt.type;
// //                             return (
// //                               <Button
// //                                 key={opt.type}
// //                                 variant='outline'
// //                                 className={cn(
// //                                   inputClass,
// //                                   "px-2.5 w-full justify-start text-left",
// //                                   isActive
// //                                     ? "bg-blue-600 dark:bg-purple-600 hover:bg-blue-700 dark:hover:bg-purple-700 text-white !border-blue-500 dark:!border-purple-500"
// //                                     : "hover:bg-gray-200 dark:hover:bg-slate-600"
// //                                 )}
// //                                 onClick={() =>
// //                                   handleGenericUpdate("material", opt.type)
// //                                 }
// //                               >
// //                                 {opt.name}
// //                               </Button>
// //                             );
// //                           })}
// //                         </div>
// //                       </div>
// //                       <div>
// //                         <Label className={labelClass}>Color</Label>
// //                         <div className='flex items-center space-x-2'>
// //                           <Input
// //                             type='color'
// //                             value={selectedShape.color || "#ffffff"}
// //                             onChange={(e) =>
// //                               handleGenericUpdate("color", e.target.value)
// //                             }
// //                             className='p-0.5 h-8 w-10 rounded border-gray-300 dark:border-slate-600 cursor-pointer'
// //                           />
// //                           <Input
// //                             value={selectedShape.color || "#ffffff"}
// //                             onChange={(e) =>
// //                               handleGenericUpdate("color", e.target.value)
// //                             }
// //                             className={cn(inputClass, "flex-1")}
// //                           />
// //                         </div>
// //                       </div>
// //                       {showPBRPropertiesForPrimitives && (
// //                         <>
// //                           <Separator className='my-2 bg-gray-200 dark:bg-slate-700' />
// //                           <div>
// //                             <Label className={labelClass}>
// //                               Roughness: {Number(pbrRoughness).toFixed(2)}
// //                             </Label>
// //                             <Slider
// //                               value={[pbrRoughness]}
// //                               onValueChange={([v]) =>
// //                                 handleTexturePropUpdate("roughness", v)
// //                               }
// //                               max={1}
// //                               min={0}
// //                               step={0.01}
// //                               className={sliderClass}
// //                             />
// //                           </div>
// //                           <div>
// //                             <Label className={labelClass}>
// //                               Metalness: {Number(pbrMetalness).toFixed(2)}
// //                             </Label>
// //                             <Slider
// //                               value={[pbrMetalness]}
// //                               onValueChange={([v]) =>
// //                                 handleTexturePropUpdate("metalness", v)
// //                               }
// //                               max={1}
// //                               min={0}
// //                               step={0.01}
// //                               className={sliderClass}
// //                             />
// //                           </div>
// //                         </>
// //                       )}
// //                       {showPhysicalPropertiesForPrimitives && (
// //                         <>
// //                           <Separator className='my-2 bg-gray-200 dark:bg-slate-700' />
// //                           <div>
// //                             <Label className={labelClass}>
// //                               Transmission:{" "}
// //                               {Number(physicalTransmission).toFixed(2)}
// //                             </Label>
// //                             <Slider
// //                               value={[physicalTransmission]}
// //                               onValueChange={([v]) =>
// //                                 handleTexturePropUpdate("transmission", v)
// //                               }
// //                               max={1}
// //                               min={0}
// //                               step={0.01}
// //                               className={sliderClass}
// //                             />
// //                           </div>
// //                           <div>
// //                             <Label className={labelClass}>
// //                               IOR: {Number(physicalIor).toFixed(2)}
// //                             </Label>
// //                             <Slider
// //                               value={[physicalIor]}
// //                               onValueChange={([v]) =>
// //                                 handleTexturePropUpdate("ior", v)
// //                               }
// //                               max={2.33}
// //                               min={1}
// //                               step={0.01}
// //                               className={sliderClass}
// //                             />
// //                           </div>
// //                           <div>
// //                             <Label className={labelClass}>
// //                               Thickness: {Number(physicalThickness).toFixed(3)}
// //                             </Label>
// //                             <Slider
// //                               value={[physicalThickness]}
// //                               onValueChange={([v]) =>
// //                                 handleTexturePropUpdate("thickness", v)
// //                               }
// //                               max={1}
// //                               min={0}
// //                               step={0.001}
// //                               className={sliderClass}
// //                             />
// //                           </div>
// //                           <div>
// //                             <Label className={labelClass}>
// //                               Clearcoat: {Number(physicalClearcoat).toFixed(2)}
// //                             </Label>
// //                             <Slider
// //                               value={[physicalClearcoat]}
// //                               onValueChange={([v]) =>
// //                                 handleTexturePropUpdate("clearcoat", v)
// //                               }
// //                               max={1}
// //                               min={0}
// //                               step={0.01}
// //                               className={sliderClass}
// //                             />
// //                           </div>
// //                           <div>
// //                             <Label className={labelClass}>
// //                               Clearcoat Roughness:{" "}
// //                               {Number(physicalClearcoatRoughness).toFixed(2)}
// //                             </Label>
// //                             <Slider
// //                               value={[physicalClearcoatRoughness]}
// //                               onValueChange={([v]) =>
// //                                 handleTexturePropUpdate("clearcoatRoughness", v)
// //                               }
// //                               max={1}
// //                               min={0}
// //                               step={0.01}
// //                               className={sliderClass}
// //                             />
// //                           </div>
// //                         </>
// //                       )}
// //                       {showPhongPropertiesForPrimitives && (
// //                         <>
// //                           <Separator className='my-2 bg-gray-200 dark:bg-slate-700' />
// //                           <div>
// //                             <Label className={labelClass}>
// //                               Shininess: {Number(phongShininess).toFixed(0)}
// //                             </Label>
// //                             <Slider
// //                               value={[phongShininess]}
// //                               onValueChange={([v]) =>
// //                                 handleTexturePropUpdate("shininess", v)
// //                               }
// //                               max={100}
// //                               min={0}
// //                               step={1}
// //                               className={sliderClass}
// //                             />
// //                           </div>
// //                         </>
// //                       )}
// //                     </>
// //                   )}
// //                   <Separator className='my-3 bg-gray-200 dark:bg-slate-700' />
// //                   <h4 className='text-xs font-semibold text-blue-600 dark:text-purple-300 flex items-center'>
// //                     <ImageUp size={12} className='mr-1.5' /> Textures
// //                   </h4>
// //                   <div className='grid grid-cols-2 gap-2.5'>
// //                     {activeTextureSlots.map((slot) => {
// //                       const currentUrl = currentTextureValues[`${slot.id}Url`];
// //                       const fileInputRef = fileInputRefsToUse.current[slot.id];
// //                       return (
// //                         <div
// //                           key={`${texturePropsKeyForShape}-${slot.id}`}
// //                           className='space-y-1'
// //                         >
// //                           <Label
// //                             htmlFor={`tex-upload-${slot.id}`}
// //                             className='text-xs text-gray-500 dark:text-slate-400'
// //                           >
// //                             {slot.name}
// //                           </Label>
// //                           {currentUrl && (
// //                             <div className='relative group w-full aspect-square bg-gray-200/50 dark:bg-slate-700/50 rounded overflow-hidden mb-0.5'>
// //                               <img
// //                                 src={currentUrl}
// //                                 alt={`${slot.name} preview`}
// //                                 className='w-full h-full object-cover'
// //                               />
// //                               <Button
// //                                 variant='destructive'
// //                                 size='icon'
// //                                 className='absolute top-0.5 right-0.5 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity p-0.5'
// //                                 onClick={() =>
// //                                   handleClearTexture(
// //                                     selectedShape.id,
// //                                     slot.id,
// //                                     isText &&
// //                                       texturePropsKeyForShape ===
// //                                         "textTextureProps"
// //                                   )
// //                                 }
// //                                 title={`Clear ${slot.name}`}
// //                               >
// //                                 <Trash2 size={10} />
// //                               </Button>
// //                             </div>
// //                           )}
// //                           <div className='flex items-center space-x-1'>
// //                             <Button
// //                               variant='outline'
// //                               size='xs'
// //                               className={cn(
// //                                 "w-full text-xs py-1 px-1.5 h-auto",
// //                                 inputClass,
// //                                 "hover:bg-gray-200/50 dark:hover:bg-slate-600/50"
// //                               )}
// //                               onClick={() => fileInputRef?.click()}
// //                             >
// //                               <ImageUp size={10} className='mr-1' />{" "}
// //                               {currentUrl ? "Change" : "Upload"}
// //                             </Button>
// //                             {currentUrl && (
// //                               <Button
// //                                 variant='ghost'
// //                                 size='iconXs'
// //                                 onClick={() =>
// //                                   handleClearTexture(
// //                                     selectedShape.id,
// //                                     slot.id,
// //                                     isText &&
// //                                       texturePropsKeyForShape ===
// //                                         "textTextureProps"
// //                                   )
// //                                 }
// //                                 title={`Clear ${slot.name}`}
// //                                 className='p-0.5 h-auto text-gray-500 hover:text-red-400 dark:text-slate-400'
// //                               >
// //                                 <X size={10} />
// //                               </Button>
// //                             )}
// //                           </div>
// //                         </div>
// //                       );
// //                     })}
// //                   </div>
// //                 </CardContent>
// //               </Card>
// //             )}

// //             <Card className={cardClass}>
// //               <CardHeader className='p-3'>
// //                 <CardTitle className='text-sm font-semibold text-gray-900 dark:text-slate-200'>
// //                   Animation
// //                 </CardTitle>
// //               </CardHeader>
// //               <CardContent className='space-y-4 p-3'>
// //                 <div>
// //                   <Label className={labelClass}>Type</Label>
// //                   <div className='flex space-x-1.5 mt-1'>
// //                     {animationTypeOptions.map((opt) => {
// //                       const isActive = animation.type === opt.value;
// //                       return (
// //                         <Button
// //                           key={opt.value}
// //                           variant='outline'
// //                           className={cn(
// //                             inputClass,
// //                             "px-2.5 flex-1 text-center",
// //                             isActive
// //                               ? "bg-blue-600 dark:bg-purple-600 hover:bg-blue-700 dark:hover:bg-purple-700 text-white !border-blue-500 dark:!border-purple-500"
// //                               : "hover:bg-gray-200 dark:hover:bg-slate-600"
// //                           )}
// //                           onClick={() =>
// //                             handleAnimationUpdate("type", opt.value)
// //                           }
// //                         >
// //                           {opt.name}
// //                         </Button>
// //                       );
// //                     })}
// //                   </div>
// //                 </div>
// //                 {animation.type !== "none" && (
// //                   <>
// //                     <div>
// //                       <Label className={labelClass}>
// //                         Speed: {Number(animation.speed).toFixed(2)}
// //                       </Label>
// //                       <Slider
// //                         value={[animation.speed]}
// //                         onValueChange={([v]) =>
// //                           handleAnimationUpdate("speed", v)
// //                         }
// //                         min={0.05}
// //                         max={5}
// //                         step={0.05}
// //                         className={sliderClass}
// //                       />
// //                     </div>
// //                     {animation.type === "rotate" && (
// //                       <div>
// //                         <Label className={labelClass}>Rotation Axis</Label>
// //                         <div className='flex space-x-1.5 mt-1'>
// //                           {animationAxisOptions.map((opt) => {
// //                             const isActive = animation.axis === opt.value;
// //                             return (
// //                               <Button
// //                                 key={opt.value}
// //                                 variant='outline'
// //                                 className={cn(
// //                                   inputClass,
// //                                   "px-2.5 flex-1 text-center",
// //                                   isActive
// //                                     ? "bg-blue-600 dark:bg-purple-600 hover:bg-blue-700 dark:hover:bg-purple-700 text-white !border-blue-500 dark:!border-purple-500"
// //                                     : "hover:bg-gray-200 dark:hover:bg-slate-600"
// //                                 )}
// //                                 onClick={() =>
// //                                   handleAnimationUpdate("axis", opt.value)
// //                                 }
// //                               >
// //                                 {opt.name}
// //                               </Button>
// //                             );
// //                           })}
// //                         </div>
// //                       </div>
// //                     )}
// //                     {animation.type === "orbit" && (
// //                       <>
// //                         <div>
// //                           <Label className={labelClass}>
// //                             Orbit Radius:{" "}
// //                             {Number(animation.orbitRadius).toFixed(2)}
// //                           </Label>
// //                           <Slider
// //                             value={[animation.orbitRadius]}
// //                             onValueChange={([v]) =>
// //                               handleAnimationUpdate("orbitRadius", v)
// //                             }
// //                             min={0.1}
// //                             max={20}
// //                             step={0.1}
// //                             className={sliderClass}
// //                           />
// //                         </div>
// //                         <div>
// //                           <Label className={labelClass}>Orbit Plane</Label>
// //                           <div className='flex space-x-1.5 mt-1'>
// //                             {animationPlaneOptions.map((opt) => {
// //                               const isActive =
// //                                 (animation.orbitPlane || "xz") === opt.value;
// //                               return (
// //                                 <Button
// //                                   key={opt.value}
// //                                   variant='outline'
// //                                   className={cn(
// //                                     inputClass,
// //                                     "px-2.5 flex-1 text-center",
// //                                     isActive
// //                                       ? "bg-blue-600 dark:bg-purple-600 hover:bg-blue-700 dark:hover:bg-purple-700 text-white !border-blue-500 dark:!border-purple-500"
// //                                       : "hover:bg-gray-200 dark:hover:bg-slate-600"
// //                                   )}
// //                                   onClick={() =>
// //                                     handleAnimationUpdate(
// //                                       "orbitPlane",
// //                                       opt.value
// //                                     )
// //                                   }
// //                                 >
// //                                   {opt.name}
// //                                 </Button>
// //                               );
// //                             })}
// //                           </div>
// //                         </div>
// //                         <div className='space-y-1'>
// //                           <Label className={labelClass}>Orbit Center</Label>
// //                           <div className='grid grid-cols-3 gap-2 items-center'>
// //                             {["X", "Y", "Z"].map((axisName, index) => (
// //                               <div key={axisName}>
// //                                 <Label
// //                                   htmlFor={`orbit-center-${axisName}`}
// //                                   className='text-xs text-gray-500 dark:text-slate-400'
// //                                 >
// //                                   {axisName}
// //                                 </Label>
// //                                 <Input
// //                                   id={`orbit-center-${axisName}`}
// //                                   type='number'
// //                                   value={(
// //                                     animation.orbitCenter[index] || 0
// //                                   ).toString()}
// //                                   onChange={(e) =>
// //                                     handleOrbitCenterUpdate(
// //                                       index,
// //                                       e.target.value
// //                                     )
// //                                   }
// //                                   className={cn(inputClass, "mt-0.5")}
// //                                   step='0.1'
// //                                 />
// //                               </div>
// //                             ))}
// //                           </div>
// //                         </div>
// //                       </>
// //                     )}
// //                   </>
// //                 )}
// //               </CardContent>
// //             </Card>

// //             <Card className={cardClass}>
// //               <CardHeader className='p-3'>
// //                 <CardTitle className='text-sm font-semibold text-gray-900 dark:text-slate-200'>
// //                   Quick Actions
// //                 </CardTitle>
// //               </CardHeader>
// //               <CardContent className='p-3'>
// //                 <div className='grid grid-cols-2 gap-2'>
// //                   {[
// //                     "resetScale",
// //                     "resetRotation",
// //                     "centerObject",
// //                     !isImagePlane && "randomColor",
// //                   ]
// //                     .filter(Boolean)
// //                     .map((actionKey) => (
// //                       <Button
// //                         key={actionKey}
// //                         onClick={() => handleQuickAction(actionKey)}
// //                         variant='outline'
// //                         size='sm'
// //                         className={cn(
// //                           inputClass,
// //                           "py-1.5 h-auto justify-center",
// //                           "hover:bg-gray-200/50 dark:hover:bg-slate-600/50"
// //                         )}
// //                       >
// //                         {actionKey
// //                           .replace(/([A-Z])/g, " $1")
// //                           .replace(/^./, (str) => str.toUpperCase())}
// //                       </Button>
// //                     ))}
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </motion.div>
// //         ) : (
// //           <motion.div
// //             key='empty-properties'
// //             initial={{ opacity: 0, y: 15 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             exit={{ opacity: 0, y: -15 }}
// //             className='flex flex-col items-center justify-center h-full text-center py-10'
// //           >
// //             <Square
// //               size={48}
// //               className='text-gray-400 dark:text-slate-700 mb-6'
// //               strokeWidth={1.5}
// //             />
// //             <h3 className='text-lg font-semibold text-gray-800 dark:text-slate-300 mb-1'>
// //               No Object Selected
// //             </h3>
// //             <p className='text-xs text-gray-500 dark:text-slate-500 mb-6 leading-relaxed px-4'>
// //               Click an object in the scene to see its properties, or add a new
// //               one from the sidebar.
// //             </p>
// //             <div className='space-y-2 w-full max-w-[200px]'>
// //               <Button
// //                 onClick={() => addShape("box")}
// //                 className='w-full bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white'
// //               >
// //                 <PlusCircle size={14} className='mr-2' /> Add Cube
// //               </Button>
// //               <Button
// //                 onClick={() => addShape("text")}
// //                 variant='outline'
// //                 className={cn(
// //                   "border-gray-300 text-gray-700 hover:bg-gray-100/50 hover:text-gray-900",
// //                   "dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700/50 dark:hover:text-slate-100",
// //                   "w-full"
// //                 )}
// //               >
// //                 <TypeIcon size={14} className='mr-2' /> Add 3D Text
// //               </Button>
// //             </div>
// //           </motion.div>
// //         )}
// //       </AnimatePresence>
// //     </motion.div>
// //   );
// // }

// import React, { useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Slider } from "@/components/ui/slider";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { Separator } from "@/components/ui/separator";
// import { cn } from "@/lib/utils";
// import {
//   ImageUp,
//   Trash2,
//   Palette,
//   LayersIcon as LayersIconLucide,
//   Type as TypeIcon,
//   X,
//   Package,
//   ImageIcon as ImageIconLucide,
//   Square,
//   PlusCircle,
// } from "lucide-react";
// import * as THREE from "three";

// const initialTexturePropsValues = {
//   mapUrl: null,
//   normalMapUrl: null,
//   roughnessMapUrl: null,
//   metalnessMapUrl: null,
//   aoMapUrl: null,
//   emissiveMapUrl: null,
//   roughness: 0.5,
//   metalness: 0.0,
//   aoMapIntensity: 1.0,
//   emissiveColor: "#000000",
//   emissiveIntensity: 1.0,
//   transmission: 0.0,
//   ior: 1.5,
//   thickness: 0.01,
//   clearcoat: 0.0,
//   clearcoatRoughness: 0.0,
//   sheen: 0.0,
//   sheenColor: "#ffffff",
//   sheenRoughness: 0.0,
//   specularIntensity: 1.0,
//   specularColor: "#ffffff",
//   shininess: 30,
// };

// const allTextureSlots = [
//   { id: "map", name: "Base Color (Albedo)" },
//   { id: "normalMap", name: "Normal Map" },
//   { id: "roughnessMap", name: "Roughness Map" },
//   { id: "metalnessMap", name: "Metalness Map" },
//   { id: "aoMap", name: "AO Map" },
//   { id: "emissiveMap", name: "Emissive Map" },
// ];

// const materialOptionsList = [
//   { name: "Standard (PBR)", type: "standard" },
//   { name: "Physical (PBR)", type: "physical" },
//   { name: "Toon", type: "toon" },
//   { name: "Basic (Non-PBR)", type: "basic" },
//   { name: "Lambert (Non-PBR)", type: "lambert" },
//   { name: "Phong (Non-PBR)", type: "phong" },
//   { name: "Wireframe", type: "wireframe" },
// ];

// const glbMaterialOptionsWithModel = [
//   { name: "Model's Own Materials", type: "model" },
//   ...materialOptionsList,
// ];

// const animationTypeOptions = [
//   { name: "None", value: "none" },
//   { name: "Rotate", value: "rotate" },
//   { name: "Orbit", value: "orbit" },
// ];

// const animationAxisOptions = [
//   { name: "X Axis", value: "x" },
//   { name: "Y Axis", value: "y" },
//   { name: "Z Axis", value: "z" },
// ];

// const animationPlaneOptions = [
//   { name: "XY Plane", value: "xy" },
//   { name: "XZ Plane", value: "xz" },
//   { name: "YZ Plane", value: "yz" },
// ];

// export default function PropertiesPanel({
//   selectedShape,
//   updateShape,
//   removeShape,
//   duplicateShape,
//   addShape,
//   handleTextureUpload,
//   handleClearTexture,
//   shapeTextureFileInputRefs,
//   textTextureFileInputRefs,
//   portalContainerRef,
//   isFullscreen,
// }) {
//   const shapeDisplayOptions = [
//     { name: "Cube", type: "box", icon: "🧊" },
//     { name: "Sphere", type: "sphere", icon: "⚪" },
//     { name: "Cylinder", type: "cylinder", icon: "🥫" },
//     { name: "Cone", type: "cone", icon: "🔺" },
//     { name: "Torus", type: "torus", icon: "🍩" },
//     { name: "Pyramid", type: "pyramid", icon: "🔺" },
//     { name: "3D Text", type: "text", icon: <TypeIcon size={18} /> },
//     {
//       name: "Image Plane",
//       type: "imagePlane",
//       icon: <ImageIconLucide size={18} />,
//     },
//     {
//       name: "Imported Model",
//       type: "importedGLB",
//       icon: <Package size={18} />,
//     },
//   ];

//   const popularShapeIcons = {
//     heart: "❤️",
//     star: "⭐",
//     crown: "👑",
//     lightning: "⚡️",
//     diamond: "💎",
//     shield: "🛡️",
//     arrow: "➡️",
//     leaf: "🍃",
//     sword: "⚔️",
//     butterfly: "🦋",
//   };

//   const currentShapeType = selectedShape?.type;
//   const isCustomExtruded = currentShapeType === "customExtruded";
//   const isImportedGLB = currentShapeType === "importedGLB";
//   const isText = currentShapeType === "text";
//   const isImagePlane = currentShapeType === "imagePlane";

//   const glbMaterialOverride = selectedShape?.glbMaterialOverride || null;

//   const showPBRForGLBOverride =
//     glbMaterialOverride &&
//     ["standard", "physical"].includes(glbMaterialOverride.type);

//   const currentMaterialForPrimitives = selectedShape?.material;
//   const showPBRPropertiesForPrimitives =
//     !isImportedGLB &&
//     !isImagePlane &&
//     selectedShape &&
//     ["standard", "physical"].includes(currentMaterialForPrimitives);
//   const showPhongPropertiesForPrimitives =
//     !isImportedGLB &&
//     !isImagePlane &&
//     selectedShape &&
//     currentMaterialForPrimitives === "phong";
//   const showPhysicalPropertiesForPrimitives =
//     !isImportedGLB &&
//     !isImagePlane &&
//     selectedShape &&
//     currentMaterialForPrimitives === "physical";

//   const showPhysicalForGLBOverride =
//     glbMaterialOverride && glbMaterialOverride.type === "physical";

//   const animation = selectedShape?.animation
//     ? {
//         type: selectedShape.animation.type || "none",
//         speed:
//           selectedShape.animation.speed !== undefined
//             ? selectedShape.animation.speed
//             : 1,
//         axis: selectedShape.animation.axis || "y",
//         orbitCenter: selectedShape.animation.orbitCenter || [0, 0, 0],
//         orbitRadius:
//           selectedShape.animation.orbitRadius !== undefined
//             ? selectedShape.animation.orbitRadius
//             : 5,
//         orbitPlane: selectedShape.animation.orbitPlane || "xz",
//       }
//     : {
//         type: "none",
//         speed: 1,
//         axis: "y",
//         orbitCenter: [0, 0, 0],
//         orbitRadius: 5,
//         orbitPlane: "xz",
//       };

//   const handleTransformUpdate = useCallback(
//     (property, index, valueStr) => {
//       if (!selectedShape) return;
//       const value = parseFloat(valueStr);
//       if (isNaN(value) && property !== "rotation") return;
//       const newTransform = [...selectedShape[property]];
//       newTransform[index] =
//         property === "rotation"
//           ? THREE.MathUtils.degToRad(value || 0)
//           : Math.max(property === "scale" ? 0.01 : -Infinity, value);
//       updateShape(selectedShape.id, { [property]: newTransform });
//     },
//     [selectedShape, updateShape]
//   );

//   const handleGenericUpdate = useCallback(
//     (property, value) => {
//       if (!selectedShape) return;
//       updateShape(selectedShape.id, { [property]: value });
//     },
//     [selectedShape, updateShape]
//   );

//   const handleTexturePropUpdate = useCallback(
//     (propName, value) => {
//       if (!selectedShape) return;
//       const targetPropsKey = isText ? "textTextureProps" : "textureProps";
//       const newTextureProps = {
//         ...(selectedShape[targetPropsKey] || initialTexturePropsValues),
//         [propName]: value,
//       };
//       updateShape(selectedShape.id, { [targetPropsKey]: newTextureProps });
//     },
//     [selectedShape, updateShape, isText]
//   );

//   const handleGLBMaterialOverrideUpdate = useCallback(
//     (property, value) => {
//       if (!selectedShape || !isImportedGLB) return;
//       const currentOverride = selectedShape.glbMaterialOverride || {};
//       let newOverrideSettings = { ...currentOverride, [property]: value };

//       if (property === "type") {
//         if (value === "model") {
//           newOverrideSettings = null;
//         } else {
//           newOverrideSettings.color =
//             currentOverride.color || selectedShape.color || "#cccccc";

//           if (value === "standard" || value === "physical") {
//             newOverrideSettings.roughness =
//               currentOverride.roughness ?? initialTexturePropsValues.roughness;
//             newOverrideSettings.metalness =
//               currentOverride.metalness ?? initialTexturePropsValues.metalness;
//           } else {
//             delete newOverrideSettings.roughness;
//             delete newOverrideSettings.metalness;
//           }

//           if (value === "physical") {
//             newOverrideSettings.transmission =
//               currentOverride.transmission ??
//               initialTexturePropsValues.transmission;
//             newOverrideSettings.ior =
//               currentOverride.ior ?? initialTexturePropsValues.ior;
//             newOverrideSettings.thickness =
//               currentOverride.thickness ?? initialTexturePropsValues.thickness;
//             newOverrideSettings.clearcoat =
//               currentOverride.clearcoat ?? initialTexturePropsValues.clearcoat;
//             newOverrideSettings.clearcoatRoughness =
//               currentOverride.clearcoatRoughness ??
//               initialTexturePropsValues.clearcoatRoughness;
//           } else {
//             delete newOverrideSettings.transmission;
//             delete newOverrideSettings.ior;
//             delete newOverrideSettings.thickness;
//             delete newOverrideSettings.clearcoat;
//             delete newOverrideSettings.clearcoatRoughness;
//           }

//           if (value === "phong") {
//             newOverrideSettings.shininess =
//               currentOverride.shininess ?? initialTexturePropsValues.shininess;
//           } else {
//             delete newOverrideSettings.shininess;
//           }
//         }
//       }
//       updateShape(selectedShape.id, {
//         glbMaterialOverride: newOverrideSettings,
//       });
//     },
//     [selectedShape, updateShape, isImportedGLB]
//   );

//   const handleAnimationUpdate = useCallback(
//     (property, value) => {
//       if (!selectedShape) return;
//       const currentAnimationData = selectedShape.animation || {
//         type: "none",
//         speed: 1,
//         axis: "y",
//         orbitCenter: [0, 0, 0],
//         orbitRadius: 5,
//         orbitPlane: "xz",
//       };
//       updateShape(selectedShape.id, {
//         animation: { ...currentAnimationData, [property]: value },
//       });
//     },
//     [selectedShape, updateShape]
//   );

//   const handleOrbitCenterUpdate = useCallback(
//     (index, valueStr) => {
//       if (!selectedShape || !selectedShape.animation) return;
//       const value = parseFloat(valueStr);
//       if (isNaN(value)) return;
//       const newOrbitCenter = [
//         ...(selectedShape.animation.orbitCenter || [0, 0, 0]),
//       ];
//       newOrbitCenter[index] = value;
//       handleAnimationUpdate("orbitCenter", newOrbitCenter);
//     },
//     [selectedShape, handleAnimationUpdate]
//   );

//   const handleQuickAction = useCallback(
//     (action) => {
//       if (!selectedShape) return;
//       const actions = {
//         resetScale: () => updateShape(selectedShape.id, { scale: [1, 1, 1] }),
//         resetRotation: () =>
//           updateShape(selectedShape.id, { rotation: [0, 0, 0] }),
//         centerObject: () => {
//           let yO = 0;
//           if (selectedShape.scale && selectedShape.scale[1]) {
//             if (selectedShape.type === "pyramid") yO = 0;
//             else if (selectedShape.type === "text")
//               yO =
//                 (selectedShape.textSize || 0.5) * selectedShape.scale[1] * 0.5;
//             else if (selectedShape.type === "imagePlane")
//               yO =
//                 ((selectedShape.planeHeight || 1) * selectedShape.scale[1]) / 2;
//             else if (selectedShape.type === "importedGLB") yO = 0;
//             else yO = selectedShape.scale[1] * 0.5;
//           }
//           updateShape(selectedShape.id, { position: [0, yO, 0] });
//         },
//         randomColor: () => {
//           if (isImagePlane) {
//             alert("Cannot apply random color to image planes.");
//             return;
//           }
//           const nC = `#${Math.floor(Math.random() * 16777215)
//             .toString(16)
//             .padStart(6, "0")}`;
//           if (isImportedGLB) {
//             handleGLBMaterialOverrideUpdate("color", nC);
//             if (
//               !selectedShape.glbMaterialOverride ||
//               selectedShape.glbMaterialOverride.type === "model"
//             ) {
//               handleGLBMaterialOverrideUpdate("type", "standard");
//             }
//           } else {
//             updateShape(selectedShape.id, { color: nC });
//           }
//         },
//       };
//       actions[action]?.();
//     },
//     [
//       selectedShape,
//       updateShape,
//       isImportedGLB,
//       isImagePlane,
//       handleGLBMaterialOverrideUpdate,
//     ]
//   );

//   let activeTextureSlots = [];
//   let currentTextureValues = { ...initialTexturePropsValues };
//   let fileInputRefsToUse = shapeTextureFileInputRefs;
//   let texturePropsKeyForShape = "textureProps";

//   if (selectedShape) {
//     if (isText) {
//       activeTextureSlots = [
//         { id: "map", name: "Color/Albedo Map" },
//         { id: "normalMap", name: "Normal Map" },
//       ];
//       currentTextureValues = {
//         ...initialTexturePropsValues,
//         ...(selectedShape.textTextureProps || {}),
//       };
//       fileInputRefsToUse = textTextureFileInputRefs;
//       texturePropsKeyForShape = "textTextureProps";
//     } else if (isImportedGLB) {
//       activeTextureSlots = allTextureSlots;
//       currentTextureValues = {
//         ...initialTexturePropsValues,
//         ...(selectedShape.textureProps || {}),
//       };
//     } else if (!isImagePlane) {
//       activeTextureSlots = allTextureSlots;
//       currentTextureValues = {
//         ...initialTexturePropsValues,
//         ...(selectedShape.textureProps || {}),
//       };
//     }
//   }

//   const getShapeIcon = () => {
//     if (!selectedShape) return <Square size={24} className='text-slate-500' />;
//     const iconData = shapeDisplayOptions.find(
//       (s) => s.type === currentShapeType
//     );
//     if (iconData)
//       return typeof iconData.icon === "string" ? (
//         <span className='text-2xl'>{iconData.icon}</span>
//       ) : (
//         React.cloneElement(iconData.icon, { className: "text-purple-400" })
//       );
//     if (isCustomExtruded)
//       return (
//         <span className='text-2xl'>
//           {popularShapeIcons[selectedShape.shapeType?.toLowerCase()] || "💖"}
//         </span>
//       );
//     return <Square size={24} className='text-purple-400' />;
//   };

//   // UPDATED: Theme-aware styling classes
//   const cardClass =
//     "bg-white dark:bg-slate-800/70 border border-gray-200 dark:border-slate-700 shadow-lg rounded-lg";
//   const inputClass =
//     "bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-800 dark:text-slate-100 text-xs h-8 rounded-md focus:ring-1 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-blue-500 dark:focus:border-purple-500";
//   const labelClass =
//     "text-xs font-medium text-gray-600 dark:text-slate-300 mb-1.5 block";
//   const sliderClass =
//     "[&>span:first-child]:bg-blue-600 dark:[&>span:first-child]:bg-purple-600 [&>span:last-child]:bg-gray-200 dark:[&>span:last-child]:bg-slate-700";

//   const pbrRoughness = isImportedGLB
//     ? glbMaterialOverride?.roughness ?? currentTextureValues.roughness
//     : selectedShape?.textureProps?.roughness ??
//       selectedShape?.roughness ??
//       initialTexturePropsValues.roughness;
//   const pbrMetalness = isImportedGLB
//     ? glbMaterialOverride?.metalness ?? currentTextureValues.metalness
//     : selectedShape?.textureProps?.metalness ??
//       selectedShape?.metalness ??
//       initialTexturePropsValues.metalness;
//   const physicalTransmission = isImportedGLB
//     ? glbMaterialOverride?.transmission ?? currentTextureValues.transmission
//     : selectedShape?.textureProps?.transmission ??
//       selectedShape?.transmission ??
//       initialTexturePropsValues.transmission;
//   const physicalIor = isImportedGLB
//     ? glbMaterialOverride?.ior ?? currentTextureValues.ior
//     : selectedShape?.textureProps?.ior ??
//       selectedShape?.ior ??
//       initialTexturePropsValues.ior;
//   const physicalThickness = isImportedGLB
//     ? glbMaterialOverride?.thickness ?? currentTextureValues.thickness
//     : selectedShape?.textureProps?.thickness ??
//       selectedShape?.thickness ??
//       initialTexturePropsValues.thickness;
//   const physicalClearcoat = isImportedGLB
//     ? glbMaterialOverride?.clearcoat ?? currentTextureValues.clearcoat
//     : selectedShape?.textureProps?.clearcoat ??
//       selectedShape?.clearcoat ??
//       initialTexturePropsValues.clearcoat;
//   const physicalClearcoatRoughness = isImportedGLB
//     ? glbMaterialOverride?.clearcoatRoughness ??
//       currentTextureValues.clearcoatRoughness
//     : selectedShape?.textureProps?.clearcoatRoughness ??
//       selectedShape?.clearcoatRoughness ??
//       initialTexturePropsValues.clearcoatRoughness;
//   const phongShininess = isImportedGLB
//     ? glbMaterialOverride?.shininess ?? currentTextureValues.shininess
//     : selectedShape?.textureProps?.shininess ??
//       selectedShape?.shininess ??
//       initialTexturePropsValues.shininess;

//   return (
//     <motion.div
//       initial={{ x: 30, opacity: 0 }}
//       animate={{ x: 0, opacity: 1 }}
//       transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
//       // FIXED: Proper z-index stacking and responsive positioning
//       className={cn(
//         "w-72 p-4 overflow-y-auto shadow-xl text-gray-900 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200",
//         "dark:text-slate-100 dark:scrollbar-thumb-slate-700 dark:scrollbar-track-slate-800",
//         "bg-gray-50/95 backdrop-blur-md border-l border-gray-200/60",
//         "dark:bg-slate-900/95 dark:border-slate-700/60",
//         // Mobile: Fixed position overlay with proper z-index
//         "fixed top-0 right-0 bottom-0 z-[60] md:relative md:z-auto",
//         // Desktop: Normal flow positioning
//         "md:bg-transparent md:backdrop-blur-none md:border-gray-200/50 md:shadow-none",
//         // Ensure it's above canvas but below modals
//         "transform-gpu will-change-transform"
//       )}
//     >
//       <AnimatePresence mode='wait'>
//         {selectedShape ? (
//           <motion.div
//             key={selectedShape.id}
//             initial={{ opacity: 0, y: 15 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -15 }}
//             className='space-y-5'
//           >
//             <div className='flex justify-between items-center'>
//               <div>
//                 <h3 className='text-md font-semibold text-gray-900 dark:text-slate-100'>
//                   Object Properties
//                 </h3>
//                 <p className='text-xs text-gray-500 dark:text-slate-400'>
//                   {selectedShape.name ||
//                     (isText ? "3D Text" : currentShapeType)}
//                 </p>
//               </div>
//               <div className='flex items-center space-x-1'>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       onClick={duplicateShape}
//                       variant='ghost'
//                       size='icon'
//                       // UPDATED: Theme-aware hover styles
//                       className='w-7 h-7 text-gray-500 hover:text-blue-600 hover:bg-gray-100/50
//                                  dark:text-slate-400 dark:hover:text-purple-300 dark:hover:bg-slate-700/50'
//                     >
//                       <LayersIconLucide size={14} />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent
//                     side='bottom'
//                     // UPDATED: Theme-aware tooltip
//                     className='bg-white text-gray-800 border-gray-200
//                                dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
//                   >
//                     <p>Duplicate (Ctrl+D)</p>
//                   </TooltipContent>
//                 </Tooltip>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       onClick={() => removeShape(selectedShape.id)}
//                       variant='ghost'
//                       size='icon'
//                       className='w-7 h-7 text-red-500 hover:text-red-400 hover:bg-red-500/20'
//                     >
//                       <Trash2 size={14} />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent
//                     side='bottom'
//                     // UPDATED: Theme-aware tooltip
//                     className='bg-white text-gray-800 border-gray-200
//                                dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
//                   >
//                     <p>Delete (Del/Backspace)</p>
//                   </TooltipContent>
//                 </Tooltip>
//               </div>
//             </div>
//             <Separator className='bg-gray-200 dark:bg-slate-700' />

//             <Card className={cardClass}>
//               <CardContent className='p-3'>
//                 <Label htmlFor='object-name' className={labelClass}>
//                   Name
//                 </Label>
//                 <Input
//                   id='object-name'
//                   value={selectedShape.name || ""}
//                   onChange={(e) => handleGenericUpdate("name", e.target.value)}
//                   placeholder='Object Name'
//                   className={inputClass}
//                 />
//               </CardContent>
//             </Card>

//             {isText && (
//               <Card className={cardClass}>
//                 <CardHeader className='p-3'>
//                   <CardTitle className='text-sm font-semibold text-gray-900 dark:text-slate-200'>
//                     Text Settings
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className='space-y-4 p-3'>
//                   <div>
//                     <Label htmlFor='text-content' className={labelClass}>
//                       Content
//                     </Label>
//                     <Input
//                       id='text-content'
//                       value={selectedShape.text || ""}
//                       onChange={(e) =>
//                         handleGenericUpdate("text", e.target.value)
//                       }
//                       placeholder='Enter text...'
//                       className={inputClass}
//                     />
//                   </div>
//                   <div>
//                     <Label className={labelClass}>
//                       Size: {selectedShape.textSize?.toFixed(2) || 0.5}
//                     </Label>
//                     <Slider
//                       value={[selectedShape.textSize || 0.5]}
//                       onValueChange={([v]) =>
//                         handleGenericUpdate("textSize", v)
//                       }
//                       max={2}
//                       min={0.1}
//                       step={0.05}
//                       className={sliderClass}
//                     />
//                   </div>
//                   <div>
//                     <Label className={labelClass}>
//                       Thickness: {selectedShape.extrudeDepth?.toFixed(2) || 0.2}
//                     </Label>
//                     <Slider
//                       value={[selectedShape.extrudeDepth || 0.2]}
//                       onValueChange={([v]) =>
//                         handleGenericUpdate("extrudeDepth", v)
//                       }
//                       max={1}
//                       min={0.01}
//                       step={0.01}
//                       className={sliderClass}
//                     />
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//             {isCustomExtruded && (
//               <Card className={cardClass}>
//                 <CardHeader className='p-3'>
//                   <CardTitle className='text-sm font-semibold text-gray-900 dark:text-slate-200'>
//                     Custom Shape Settings
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className='space-y-4 p-3'>
//                   <div>
//                     <Label className={labelClass}>
//                       Size: {selectedShape.shapeSize?.toFixed(2) || 1.0}
//                     </Label>
//                     <Slider
//                       value={[selectedShape.shapeSize || 1]}
//                       onValueChange={([v]) =>
//                         handleGenericUpdate("shapeSize", v)
//                       }
//                       max={5}
//                       min={0.1}
//                       step={0.05}
//                       className={sliderClass}
//                     />
//                   </div>
//                   <div>
//                     <Label className={labelClass}>
//                       Depth: {selectedShape.extrudeDepth?.toFixed(2) || 0.2}
//                     </Label>
//                     <Slider
//                       value={[selectedShape.extrudeDepth || 0.2]}
//                       onValueChange={([v]) =>
//                         handleGenericUpdate("extrudeDepth", v)
//                       }
//                       max={2}
//                       min={0.01}
//                       step={0.01}
//                       className={sliderClass}
//                     />
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             <Card className={cardClass}>
//               <CardHeader className='p-3'>
//                 <CardTitle className='text-sm font-semibold text-gray-900 dark:text-slate-200'>
//                   Transform
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className='space-y-4 p-3'>
//                 {["position", "rotation", "scale"].map((prop) => (
//                   <div key={prop} className='space-y-2'>
//                     <h4 className='font-medium text-xs text-gray-700 dark:text-slate-300 capitalize'>
//                       {prop}
//                     </h4>
//                     {["X", "Y", "Z"].map((axis, index) => (
//                       <div
//                         key={axis}
//                         className='grid grid-cols-6 items-center gap-2'
//                       >
//                         <Label
//                           htmlFor={`${prop}-${axis}`}
//                           className='text-xs text-gray-500 dark:text-slate-400 col-span-1'
//                         >
//                           {axis}
//                         </Label>
//                         <Input
//                           id={`${prop}-${axis}`}
//                           type='number'
//                           value={
//                             prop === "rotation"
//                               ? THREE.MathUtils.radToDeg(
//                                   selectedShape[prop][index] || 0
//                                 ).toFixed(0)
//                               : (selectedShape[prop][index] || 0).toFixed(2)
//                           }
//                           onChange={(e) =>
//                             handleTransformUpdate(prop, index, e.target.value)
//                           }
//                           step={prop === "rotation" ? 5 : 0.1}
//                           className={cn(inputClass, "col-span-2")}
//                         />
//                         <Slider
//                           value={[
//                             prop === "rotation"
//                               ? THREE.MathUtils.radToDeg(
//                                   selectedShape[prop][index] || 0
//                                 )
//                               : selectedShape[prop][index] || 0,
//                           ]}
//                           onValueChange={([v]) =>
//                             handleTransformUpdate(prop, index, v.toString())
//                           }
//                           min={
//                             prop === "rotation"
//                               ? -360
//                               : prop === "scale"
//                               ? 0.01
//                               : -15
//                           }
//                           max={
//                             prop === "rotation"
//                               ? 360
//                               : prop === "scale"
//                               ? 10
//                               : 15
//                           }
//                           step={
//                             prop === "rotation"
//                               ? 1
//                               : prop === "scale"
//                               ? 0.01
//                               : 0.1
//                           }
//                           className={cn("col-span-3", sliderClass)}
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>

//             {!isImagePlane && (
//               <Card className={cardClass}>
//                 <CardHeader className='p-3'>
//                   <CardTitle className='text-sm font-semibold text-gray-900 dark:text-slate-200 flex items-center'>
//                     <Palette
//                       size={14}
//                       className='mr-1.5 text-blue-600 dark:text-purple-400'
//                     />{" "}
//                     Appearance
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className='space-y-4 p-3'>
//                   {isImportedGLB ? (
//                     <>
//                       <p className='text-xs text-gray-500 dark:text-slate-400'>
//                         Override model's materials. Changes apply to all meshes.
//                       </p>
//                       <div>
//                         <Label className={labelClass}>Override Material</Label>
//                         <div className='flex flex-col space-y-1.5 mt-1'>
//                           {glbMaterialOptionsWithModel.map((opt) => {
//                             const isActive =
//                               (glbMaterialOverride?.type || "model") ===
//                               opt.type;
//                             return (
//                               <Button
//                                 key={opt.type}
//                                 variant='outline'
//                                 className={cn(
//                                   inputClass,
//                                   "px-2.5 w-full justify-start text-left",
//                                   isActive
//                                     ? "bg-blue-600 dark:bg-purple-600 hover:bg-blue-700 dark:hover:bg-purple-700 text-white !border-blue-500 dark:!border-purple-500"
//                                     : "hover:bg-gray-200 dark:hover:bg-slate-600"
//                                 )}
//                                 onClick={() =>
//                                   handleGLBMaterialOverrideUpdate(
//                                     "type",
//                                     opt.type
//                                   )
//                                 }
//                               >
//                                 {opt.name}
//                               </Button>
//                             );
//                           })}
//                         </div>
//                       </div>
//                       {glbMaterialOverride &&
//                         glbMaterialOverride.type !== "model" && (
//                           <>
//                             <Separator className='my-2 bg-gray-200 dark:bg-slate-700' />
//                             <div>
//                               <Label className={labelClass}>
//                                 Override Color
//                               </Label>
//                               <div className='flex items-center space-x-2'>
//                                 <Input
//                                   type='color'
//                                   value={glbMaterialOverride.color || "#cccccc"}
//                                   onChange={(e) =>
//                                     handleGLBMaterialOverrideUpdate(
//                                       "color",
//                                       e.target.value
//                                     )
//                                   }
//                                   className='p-0.5 h-8 w-10 rounded border-gray-300 dark:border-slate-600 cursor-pointer'
//                                 />
//                                 <Input
//                                   value={glbMaterialOverride.color || "#cccccc"}
//                                   onChange={(e) =>
//                                     handleGLBMaterialOverrideUpdate(
//                                       "color",
//                                       e.target.value
//                                     )
//                                   }
//                                   className={cn(inputClass, "flex-1")}
//                                 />
//                               </div>
//                             </div>
//                             {showPBRForGLBOverride && (
//                               <>
//                                 <div>
//                                   <Label className={labelClass}>
//                                     Roughness: {Number(pbrRoughness).toFixed(2)}
//                                   </Label>
//                                   <Slider
//                                     value={[pbrRoughness]}
//                                     onValueChange={([v]) =>
//                                       handleGLBMaterialOverrideUpdate(
//                                         "roughness",
//                                         v
//                                       )
//                                     }
//                                     max={1}
//                                     min={0}
//                                     step={0.01}
//                                     className={sliderClass}
//                                   />
//                                 </div>
//                                 <div>
//                                   <Label className={labelClass}>
//                                     Metalness: {Number(pbrMetalness).toFixed(2)}
//                                   </Label>
//                                   <Slider
//                                     value={[pbrMetalness]}
//                                     onValueChange={([v]) =>
//                                       handleGLBMaterialOverrideUpdate(
//                                         "metalness",
//                                         v
//                                       )
//                                     }
//                                     max={1}
//                                     min={0}
//                                     step={0.01}
//                                     className={sliderClass}
//                                   />
//                                 </div>
//                               </>
//                             )}
//                             {showPhysicalForGLBOverride && (
//                               <>
//                                 <div>
//                                   <Label className={labelClass}>
//                                     Transmission:{" "}
//                                     {Number(physicalTransmission).toFixed(2)}
//                                   </Label>
//                                   <Slider
//                                     value={[physicalTransmission]}
//                                     onValueChange={([v]) =>
//                                       handleGLBMaterialOverrideUpdate(
//                                         "transmission",
//                                         v
//                                       )
//                                     }
//                                     max={1}
//                                     min={0}
//                                     step={0.01}
//                                     className={sliderClass}
//                                   />
//                                 </div>
//                                 <div>
//                                   <Label className={labelClass}>
//                                     IOR: {Number(physicalIor).toFixed(2)}
//                                   </Label>
//                                   <Slider
//                                     value={[physicalIor]}
//                                     onValueChange={([v]) =>
//                                       handleGLBMaterialOverrideUpdate("ior", v)
//                                     }
//                                     max={2.33}
//                                     min={1}
//                                     step={0.01}
//                                     className={sliderClass}
//                                   />
//                                 </div>
//                                 <div>
//                                   <Label className={labelClass}>
//                                     Thickness:{" "}
//                                     {Number(physicalThickness).toFixed(3)}
//                                   </Label>
//                                   <Slider
//                                     value={[physicalThickness]}
//                                     onValueChange={([v]) =>
//                                       handleGLBMaterialOverrideUpdate(
//                                         "thickness",
//                                         v
//                                       )
//                                     }
//                                     max={1}
//                                     min={0}
//                                     step={0.001}
//                                     className={sliderClass}
//                                   />
//                                 </div>
//                                 <div>
//                                   <Label className={labelClass}>
//                                     Clearcoat:{" "}
//                                     {Number(physicalClearcoat).toFixed(2)}
//                                   </Label>
//                                   <Slider
//                                     value={[physicalClearcoat]}
//                                     onValueChange={([v]) =>
//                                       handleGLBMaterialOverrideUpdate(
//                                         "clearcoat",
//                                         v
//                                       )
//                                     }
//                                     max={1}
//                                     min={0}
//                                     step={0.01}
//                                     className={sliderClass}
//                                   />
//                                 </div>
//                                 <div>
//                                   <Label className={labelClass}>
//                                     Clearcoat Roughness:{" "}
//                                     {Number(physicalClearcoatRoughness).toFixed(
//                                       2
//                                     )}
//                                   </Label>
//                                   <Slider
//                                     value={[physicalClearcoatRoughness]}
//                                     onValueChange={([v]) =>
//                                       handleGLBMaterialOverrideUpdate(
//                                         "clearcoatRoughness",
//                                         v
//                                       )
//                                     }
//                                     max={1}
//                                     min={0}
//                                     step={0.01}
//                                     className={sliderClass}
//                                   />
//                                 </div>
//                               </>
//                             )}
//                             {glbMaterialOverride.type === "phong" && (
//                               <div>
//                                 <Label className={labelClass}>
//                                   Shininess: {Number(phongShininess).toFixed(0)}
//                                 </Label>
//                                 <Slider
//                                   value={[phongShininess]}
//                                   onValueChange={([v]) =>
//                                     handleGLBMaterialOverrideUpdate(
//                                       "shininess",
//                                       v
//                                     )
//                                   }
//                                   max={100}
//                                   min={0}
//                                   step={1}
//                                   className={sliderClass}
//                                 />
//                               </div>
//                             )}
//                           </>
//                         )}
//                     </>
//                   ) : (
//                     <>
//                       <div>
//                         <Label className={labelClass}>Material</Label>
//                         <div className='flex flex-col space-y-1.5 mt-1'>
//                           {materialOptionsList.map((opt) => {
//                             const isActive =
//                               (selectedShape.material || "standard") ===
//                               opt.type;
//                             return (
//                               <Button
//                                 key={opt.type}
//                                 variant='outline'
//                                 className={cn(
//                                   inputClass,
//                                   "px-2.5 w-full justify-start text-left",
//                                   isActive
//                                     ? "bg-blue-600 dark:bg-purple-600 hover:bg-blue-700 dark:hover:bg-purple-700 text-white !border-blue-500 dark:!border-purple-500"
//                                     : "hover:bg-gray-200 dark:hover:bg-slate-600"
//                                 )}
//                                 onClick={() =>
//                                   handleGenericUpdate("material", opt.type)
//                                 }
//                               >
//                                 {opt.name}
//                               </Button>
//                             );
//                           })}
//                         </div>
//                       </div>
//                       <div>
//                         <Label className={labelClass}>Color</Label>
//                         <div className='flex items-center space-x-2'>
//                           <Input
//                             type='color'
//                             value={selectedShape.color || "#ffffff"}
//                             onChange={(e) =>
//                               handleGenericUpdate("color", e.target.value)
//                             }
//                             className='p-0.5 h-8 w-10 rounded border-gray-300 dark:border-slate-600 cursor-pointer'
//                           />
//                           <Input
//                             value={selectedShape.color || "#ffffff"}
//                             onChange={(e) =>
//                               handleGenericUpdate("color", e.target.value)
//                             }
//                             className={cn(inputClass, "flex-1")}
//                           />
//                         </div>
//                       </div>
//                       {showPBRPropertiesForPrimitives && (
//                         <>
//                           <Separator className='my-2 bg-gray-200 dark:bg-slate-700' />
//                           <div>
//                             <Label className={labelClass}>
//                               Roughness: {Number(pbrRoughness).toFixed(2)}
//                             </Label>
//                             <Slider
//                               value={[pbrRoughness]}
//                               onValueChange={([v]) =>
//                                 handleTexturePropUpdate("roughness", v)
//                               }
//                               max={1}
//                               min={0}
//                               step={0.01}
//                               className={sliderClass}
//                             />
//                           </div>
//                           <div>
//                             <Label className={labelClass}>
//                               Metalness: {Number(pbrMetalness).toFixed(2)}
//                             </Label>
//                             <Slider
//                               value={[pbrMetalness]}
//                               onValueChange={([v]) =>
//                                 handleTexturePropUpdate("metalness", v)
//                               }
//                               max={1}
//                               min={0}
//                               step={0.01}
//                               className={sliderClass}
//                             />
//                           </div>
//                         </>
//                       )}
//                       {showPhysicalPropertiesForPrimitives && (
//                         <>
//                           <Separator className='my-2 bg-gray-200 dark:bg-slate-700' />
//                           <div>
//                             <Label className={labelClass}>
//                               Transmission:{" "}
//                               {Number(physicalTransmission).toFixed(2)}
//                             </Label>
//                             <Slider
//                               value={[physicalTransmission]}
//                               onValueChange={([v]) =>
//                                 handleTexturePropUpdate("transmission", v)
//                               }
//                               max={1}
//                               min={0}
//                               step={0.01}
//                               className={sliderClass}
//                             />
//                           </div>
//                           <div>
//                             <Label className={labelClass}>
//                               IOR: {Number(physicalIor).toFixed(2)}
//                             </Label>
//                             <Slider
//                               value={[physicalIor]}
//                               onValueChange={([v]) =>
//                                 handleTexturePropUpdate("ior", v)
//                               }
//                               max={2.33}
//                               min={1}
//                               step={0.01}
//                               className={sliderClass}
//                             />
//                           </div>
//                           <div>
//                             <Label className={labelClass}>
//                               Thickness: {Number(physicalThickness).toFixed(3)}
//                             </Label>
//                             <Slider
//                               value={[physicalThickness]}
//                               onValueChange={([v]) =>
//                                 handleTexturePropUpdate("thickness", v)
//                               }
//                               max={1}
//                               min={0}
//                               step={0.001}
//                               className={sliderClass}
//                             />
//                           </div>
//                           <div>
//                             <Label className={labelClass}>
//                               Clearcoat: {Number(physicalClearcoat).toFixed(2)}
//                             </Label>
//                             <Slider
//                               value={[physicalClearcoat]}
//                               onValueChange={([v]) =>
//                                 handleTexturePropUpdate("clearcoat", v)
//                               }
//                               max={1}
//                               min={0}
//                               step={0.01}
//                               className={sliderClass}
//                             />
//                           </div>
//                           <div>
//                             <Label className={labelClass}>
//                               Clearcoat Roughness:{" "}
//                               {Number(physicalClearcoatRoughness).toFixed(2)}
//                             </Label>
//                             <Slider
//                               value={[physicalClearcoatRoughness]}
//                               onValueChange={([v]) =>
//                                 handleTexturePropUpdate("clearcoatRoughness", v)
//                               }
//                               max={1}
//                               min={0}
//                               step={0.01}
//                               className={sliderClass}
//                             />
//                           </div>
//                         </>
//                       )}
//                       {showPhongPropertiesForPrimitives && (
//                         <>
//                           <Separator className='my-2 bg-gray-200 dark:bg-slate-700' />
//                           <div>
//                             <Label className={labelClass}>
//                               Shininess: {Number(phongShininess).toFixed(0)}
//                             </Label>
//                             <Slider
//                               value={[phongShininess]}
//                               onValueChange={([v]) =>
//                                 handleTexturePropUpdate("shininess", v)
//                               }
//                               max={100}
//                               min={0}
//                               step={1}
//                               className={sliderClass}
//                             />
//                           </div>
//                         </>
//                       )}
//                     </>
//                   )}
//                   <Separator className='my-3 bg-gray-200 dark:bg-slate-700' />
//                   <h4 className='text-xs font-semibold text-blue-600 dark:text-purple-300 flex items-center'>
//                     <ImageUp size={12} className='mr-1.5' /> Textures
//                   </h4>
//                   <div className='grid grid-cols-2 gap-2.5'>
//                     {activeTextureSlots.map((slot) => {
//                       const currentUrl = currentTextureValues[`${slot.id}Url`];
//                       const fileInputRef = fileInputRefsToUse.current[slot.id];
//                       return (
//                         <div
//                           key={`${texturePropsKeyForShape}-${slot.id}`}
//                           className='space-y-1'
//                         >
//                           <Label
//                             htmlFor={`tex-upload-${slot.id}`}
//                             className='text-xs text-gray-500 dark:text-slate-400'
//                           >
//                             {slot.name}
//                           </Label>
//                           {currentUrl && (
//                             <div className='relative group w-full aspect-square bg-gray-200/50 dark:bg-slate-700/50 rounded overflow-hidden mb-0.5'>
//                               <img
//                                 src={currentUrl}
//                                 alt={`${slot.name} preview`}
//                                 className='w-full h-full object-cover'
//                               />
//                               <Button
//                                 variant='destructive'
//                                 size='icon'
//                                 className='absolute top-0.5 right-0.5 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity p-0.5'
//                                 onClick={() =>
//                                   handleClearTexture(
//                                     selectedShape.id,
//                                     slot.id,
//                                     isText &&
//                                       texturePropsKeyForShape ===
//                                         "textTextureProps"
//                                   )
//                                 }
//                                 title={`Clear ${slot.name}`}
//                               >
//                                 <Trash2 size={10} />
//                               </Button>
//                             </div>
//                           )}
//                           <div className='flex items-center space-x-1'>
//                             <Button
//                               variant='outline'
//                               size='xs'
//                               className={cn(
//                                 "w-full text-xs py-1 px-1.5 h-auto",
//                                 inputClass,
//                                 "hover:bg-gray-200/50 dark:hover:bg-slate-600/50"
//                               )}
//                               onClick={() => fileInputRef?.click()}
//                             >
//                               <ImageUp size={10} className='mr-1' />{" "}
//                               {currentUrl ? "Change" : "Upload"}
//                             </Button>
//                             {currentUrl && (
//                               <Button
//                                 variant='ghost'
//                                 size='iconXs'
//                                 onClick={() =>
//                                   handleClearTexture(
//                                     selectedShape.id,
//                                     slot.id,
//                                     isText &&
//                                       texturePropsKeyForShape ===
//                                         "textTextureProps"
//                                   )
//                                 }
//                                 title={`Clear ${slot.name}`}
//                                 className='p-0.5 h-auto text-gray-500 hover:text-red-400 dark:text-slate-400'
//                               >
//                                 <X size={10} />
//                               </Button>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             <Card className={cardClass}>
//               <CardHeader className='p-3'>
//                 <CardTitle className='text-sm font-semibold text-gray-900 dark:text-slate-200'>
//                   Animation
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className='space-y-4 p-3'>
//                 <div>
//                   <Label className={labelClass}>Type</Label>
//                   <div className='flex space-x-1.5 mt-1'>
//                     {animationTypeOptions.map((opt) => {
//                       const isActive = animation.type === opt.value;
//                       return (
//                         <Button
//                           key={opt.value}
//                           variant='outline'
//                           className={cn(
//                             inputClass,
//                             "px-2.5 flex-1 text-center",
//                             isActive
//                               ? "bg-blue-600 dark:bg-purple-600 hover:bg-blue-700 dark:hover:bg-purple-700 text-white !border-blue-500 dark:!border-purple-500"
//                               : "hover:bg-gray-200 dark:hover:bg-slate-600"
//                           )}
//                           onClick={() =>
//                             handleAnimationUpdate("type", opt.value)
//                           }
//                         >
//                           {opt.name}
//                         </Button>
//                       );
//                     })}
//                   </div>
//                 </div>
//                 {animation.type !== "none" && (
//                   <>
//                     <div>
//                       <Label className={labelClass}>
//                         Speed: {Number(animation.speed).toFixed(2)}
//                       </Label>
//                       <Slider
//                         value={[animation.speed]}
//                         onValueChange={([v]) =>
//                           handleAnimationUpdate("speed", v)
//                         }
//                         min={0.05}
//                         max={5}
//                         step={0.05}
//                         className={sliderClass}
//                       />
//                     </div>
//                     {animation.type === "rotate" && (
//                       <div>
//                         <Label className={labelClass}>Rotation Axis</Label>
//                         <div className='flex space-x-1.5 mt-1'>
//                           {animationAxisOptions.map((opt) => {
//                             const isActive = animation.axis === opt.value;
//                             return (
//                               <Button
//                                 key={opt.value}
//                                 variant='outline'
//                                 className={cn(
//                                   inputClass,
//                                   "px-2.5 flex-1 text-center",
//                                   isActive
//                                     ? "bg-blue-600 dark:bg-purple-600 hover:bg-blue-700 dark:hover:bg-purple-700 text-white !border-blue-500 dark:!border-purple-500"
//                                     : "hover:bg-gray-200 dark:hover:bg-slate-600"
//                                 )}
//                                 onClick={() =>
//                                   handleAnimationUpdate("axis", opt.value)
//                                 }
//                               >
//                                 {opt.name}
//                               </Button>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     )}
//                     {animation.type === "orbit" && (
//                       <>
//                         <div>
//                           <Label className={labelClass}>
//                             Orbit Radius:{" "}
//                             {Number(animation.orbitRadius).toFixed(2)}
//                           </Label>
//                           <Slider
//                             value={[animation.orbitRadius]}
//                             onValueChange={([v]) =>
//                               handleAnimationUpdate("orbitRadius", v)
//                             }
//                             min={0.1}
//                             max={20}
//                             step={0.1}
//                             className={sliderClass}
//                           />
//                         </div>
//                         <div>
//                           <Label className={labelClass}>Orbit Plane</Label>
//                           <div className='flex space-x-1.5 mt-1'>
//                             {animationPlaneOptions.map((opt) => {
//                               const isActive =
//                                 (animation.orbitPlane || "xz") === opt.value;
//                               return (
//                                 <Button
//                                   key={opt.value}
//                                   variant='outline'
//                                   className={cn(
//                                     inputClass,
//                                     "px-2.5 flex-1 text-center",
//                                     isActive
//                                       ? "bg-blue-600 dark:bg-purple-600 hover:bg-blue-700 dark:hover:bg-purple-700 text-white !border-blue-500 dark:!border-purple-500"
//                                       : "hover:bg-gray-200 dark:hover:bg-slate-600"
//                                   )}
//                                   onClick={() =>
//                                     handleAnimationUpdate(
//                                       "orbitPlane",
//                                       opt.value
//                                     )
//                                   }
//                                 >
//                                   {opt.name}
//                                 </Button>
//                               );
//                             })}
//                           </div>
//                         </div>
//                         <div className='space-y-1'>
//                           <Label className={labelClass}>Orbit Center</Label>
//                           <div className='grid grid-cols-3 gap-2 items-center'>
//                             {["X", "Y", "Z"].map((axisName, index) => (
//                               <div key={axisName}>
//                                 <Label
//                                   htmlFor={`orbit-center-${axisName}`}
//                                   className='text-xs text-gray-500 dark:text-slate-400'
//                                 >
//                                   {axisName}
//                                 </Label>
//                                 <Input
//                                   id={`orbit-center-${axisName}`}
//                                   type='number'
//                                   value={(
//                                     animation.orbitCenter[index] || 0
//                                   ).toString()}
//                                   onChange={(e) =>
//                                     handleOrbitCenterUpdate(
//                                       index,
//                                       e.target.value
//                                     )
//                                   }
//                                   className={cn(inputClass, "mt-0.5")}
//                                   step='0.1'
//                                 />
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </>
//                     )}
//                   </>
//                 )}
//               </CardContent>
//             </Card>

//             <Card className={cardClass}>
//               <CardHeader className='p-3'>
//                 <CardTitle className='text-sm font-semibold text-gray-900 dark:text-slate-200'>
//                   Quick Actions
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className='p-3'>
//                 <div className='grid grid-cols-2 gap-2'>
//                   {[
//                     "resetScale",
//                     "resetRotation",
//                     "centerObject",
//                     !isImagePlane && "randomColor",
//                   ]
//                     .filter(Boolean)
//                     .map((actionKey) => (
//                       <Button
//                         key={actionKey}
//                         onClick={() => handleQuickAction(actionKey)}
//                         variant='outline'
//                         size='sm'
//                         className={cn(
//                           inputClass,
//                           "py-1.5 h-auto justify-center",
//                           "hover:bg-gray-200/50 dark:hover:bg-slate-600/50"
//                         )}
//                       >
//                         {actionKey
//                           .replace(/([A-Z])/g, " $1")
//                           .replace(/^./, (str) => str.toUpperCase())}
//                       </Button>
//                     ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ) : (
//           <motion.div
//             key='empty-properties'
//             initial={{ opacity: 0, y: 15 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -15 }}
//             className='flex flex-col items-center justify-center h-full text-center py-10'
//           >
//             <Square
//               size={48}
//               className='text-gray-400 dark:text-slate-700 mb-6'
//               strokeWidth={1.5}
//             />
//             <h3 className='text-lg font-semibold text-gray-800 dark:text-slate-300 mb-1'>
//               No Object Selected
//             </h3>
//             <p className='text-xs text-gray-500 dark:text-slate-500 mb-6 leading-relaxed px-4'>
//               Click an object in the scene to see its properties, or add a new
//               one from the sidebar.
//             </p>
//             <div className='space-y-2 w-full max-w-[200px]'>
//               <Button
//                 onClick={() => addShape("box")}
//                 className='w-full bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white'
//               >
//                 <PlusCircle size={14} className='mr-2' /> Add Cube
//               </Button>
//               <Button
//                 onClick={() => addShape("text")}
//                 variant='outline'
//                 className={cn(
//                   "border-gray-300 text-gray-700 hover:bg-gray-100/50 hover:text-gray-900",
//                   "dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700/50 dark:hover:text-slate-100",
//                   "w-full"
//                 )}
//               >
//                 <TypeIcon size={14} className='mr-2' /> Add 3D Text
//               </Button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// }

// import React, { useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Slider } from "@/components/ui/slider";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { Separator } from "@/components/ui/separator";
// import { cn } from "@/lib/utils";
// import {
//   ImageUp,
//   Trash2,
//   Palette,
//   LayersIcon as LayersIconLucide,
//   Type as TypeIcon,
//   X,
//   Package,
//   ImageIcon as ImageIconLucide,
//   Square,
//   PlusCircle,
// } from "lucide-react";
// import * as THREE from "three";

// const initialTexturePropsValues = {
//   mapUrl: null,
//   normalMapUrl: null,
//   roughnessMapUrl: null,
//   metalnessMapUrl: null,
//   aoMapUrl: null,
//   emissiveMapUrl: null,
//   roughness: 0.5,
//   metalness: 0.0,
//   aoMapIntensity: 1.0,
//   emissiveColor: "#000000",
//   emissiveIntensity: 1.0,
//   transmission: 0.0,
//   ior: 1.5,
//   thickness: 0.01,
//   clearcoat: 0.0,
//   clearcoatRoughness: 0.0,
//   sheen: 0.0,
//   sheenColor: "#ffffff",
//   sheenRoughness: 0.0,
//   specularIntensity: 1.0,
//   specularColor: "#ffffff",
//   shininess: 30,
// };

// const allTextureSlots = [
//   { id: "map", name: "Base Color (Albedo)" },
//   { id: "normalMap", name: "Normal Map" },
//   { id: "roughnessMap", name: "Roughness Map" },
//   { id: "metalnessMap", name: "Metalness Map" },
//   { id: "aoMap", name: "AO Map" },
//   { id: "emissiveMap", name: "Emissive Map" },
// ];

// const materialOptionsList = [
//   { name: "Standard (PBR)", type: "standard" },
//   { name: "Physical (PBR)", type: "physical" },
//   { name: "Toon", type: "toon" },
//   { name: "Basic (Non-PBR)", type: "basic" },
//   { name: "Lambert (Non-PBR)", type: "lambert" },
//   { name: "Phong (Non-PBR)", type: "phong" },
//   { name: "Wireframe", type: "wireframe" },
// ];

// const glbMaterialOptionsWithModel = [
//   { name: "Model's Own Materials", type: "model" },
//   ...materialOptionsList,
// ];

// const animationTypeOptions = [
//   { name: "None", value: "none" },
//   { name: "Rotate", value: "rotate" },
//   { name: "Orbit", value: "orbit" },
// ];

// const animationAxisOptions = [
//   { name: "X Axis", value: "x" },
//   { name: "Y Axis", value: "y" },
//   { name: "Z Axis", value: "z" },
// ];

// const animationPlaneOptions = [
//   { name: "XY Plane", value: "xy" },
//   { name: "XZ Plane", value: "xz" },
//   { name: "YZ Plane", value: "yz" },
// ];

// export default function PropertiesPanel({
//   selectedShape,
//   updateShape,
//   removeShape,
//   duplicateShape,
//   addShape,
//   handleTextureUpload,
//   handleClearTexture,
//   shapeTextureFileInputRefs,
//   textTextureFileInputRefs,
//   portalContainerRef,
//   isFullscreen,
// }) {
//   const shapeDisplayOptions = [
//     { name: "Cube", type: "box", icon: "🧊" },
//     { name: "Sphere", type: "sphere", icon: "⚪" },
//     { name: "Cylinder", type: "cylinder", icon: "🥫" },
//     { name: "Cone", type: "cone", icon: "🔺" },
//     { name: "Torus", type: "torus", icon: "🍩" },
//     { name: "Pyramid", type: "pyramid", icon: "🔺" },
//     { name: "3D Text", type: "text", icon: <TypeIcon size={18} /> },
//     {
//       name: "Image Plane",
//       type: "imagePlane",
//       icon: <ImageIconLucide size={18} />,
//     },
//     {
//       name: "Imported Model",
//       type: "importedGLB",
//       icon: <Package size={18} />,
//     },
//   ];

//   const popularShapeIcons = {
//     heart: "❤️",
//     star: "⭐",
//     crown: "👑",
//     lightning: "⚡️",
//     diamond: "💎",
//     shield: "🛡️",
//     arrow: "➡️",
//     leaf: "🍃",
//     sword: "⚔️",
//     butterfly: "🦋",
//   };

//   const currentShapeType = selectedShape?.type;
//   const isCustomExtruded = currentShapeType === "customExtruded";
//   const isImportedGLB = currentShapeType === "importedGLB";
//   const isText = currentShapeType === "text";
//   const isImagePlane = currentShapeType === "imagePlane";

//   const glbMaterialOverride = selectedShape?.glbMaterialOverride || null;

//   const showPBRForGLBOverride =
//     glbMaterialOverride &&
//     ["standard", "physical"].includes(glbMaterialOverride.type);

//   const currentMaterialForPrimitives = selectedShape?.material;
//   const showPBRPropertiesForPrimitives =
//     !isImportedGLB &&
//     !isImagePlane &&
//     selectedShape &&
//     ["standard", "physical"].includes(currentMaterialForPrimitives);
//   const showPhongPropertiesForPrimitives =
//     !isImportedGLB &&
//     !isImagePlane &&
//     selectedShape &&
//     currentMaterialForPrimitives === "phong";
//   const showPhysicalPropertiesForPrimitives =
//     !isImportedGLB &&
//     !isImagePlane &&
//     selectedShape &&
//     currentMaterialForPrimitives === "physical";

//   const showPhysicalForGLBOverride =
//     glbMaterialOverride && glbMaterialOverride.type === "physical";

//   const animation = selectedShape?.animation
//     ? {
//         type: selectedShape.animation.type || "none",
//         speed:
//           selectedShape.animation.speed !== undefined
//             ? selectedShape.animation.speed
//             : 1,
//         axis: selectedShape.animation.axis || "y",
//         orbitCenter: selectedShape.animation.orbitCenter || [0, 0, 0],
//         orbitRadius:
//           selectedShape.animation.orbitRadius !== undefined
//             ? selectedShape.animation.orbitRadius
//             : 5,
//         orbitPlane: selectedShape.animation.orbitPlane || "xz",
//       }
//     : {
//         type: "none",
//         speed: 1,
//         axis: "y",
//         orbitCenter: [0, 0, 0],
//         orbitRadius: 5,
//         orbitPlane: "xz",
//       };

//   const handleTransformUpdate = useCallback(
//     (property, index, valueStr) => {
//       if (!selectedShape) return;
//       const value = parseFloat(valueStr);
//       if (isNaN(value) && property !== "rotation") return;
//       const newTransform = [...selectedShape[property]];
//       newTransform[index] =
//         property === "rotation"
//           ? THREE.MathUtils.degToRad(value || 0)
//           : Math.max(property === "scale" ? 0.01 : -Infinity, value);
//       updateShape(selectedShape.id, { [property]: newTransform });
//     },
//     [selectedShape, updateShape]
//   );

//   const handleGenericUpdate = useCallback(
//     (property, value) => {
//       if (!selectedShape) return;
//       updateShape(selectedShape.id, { [property]: value });
//     },
//     [selectedShape, updateShape]
//   );

//   const handleTexturePropUpdate = useCallback(
//     (propName, value) => {
//       if (!selectedShape) return;
//       const targetPropsKey = isText ? "textTextureProps" : "textureProps";
//       const newTextureProps = {
//         ...(selectedShape[targetPropsKey] || initialTexturePropsValues),
//         [propName]: value,
//       };
//       updateShape(selectedShape.id, { [targetPropsKey]: newTextureProps });
//     },
//     [selectedShape, updateShape, isText]
//   );

//   const handleGLBMaterialOverrideUpdate = useCallback(
//     (property, value) => {
//       if (!selectedShape || !isImportedGLB) return;
//       const currentOverride = selectedShape.glbMaterialOverride || {};
//       let newOverrideSettings = { ...currentOverride, [property]: value };

//       if (property === "type") {
//         if (value === "model") {
//           newOverrideSettings = null;
//         } else {
//           newOverrideSettings.color =
//             currentOverride.color || selectedShape.color || "#cccccc";

//           if (value === "standard" || value === "physical") {
//             newOverrideSettings.roughness =
//               currentOverride.roughness ?? initialTexturePropsValues.roughness;
//             newOverrideSettings.metalness =
//               currentOverride.metalness ?? initialTexturePropsValues.metalness;
//           } else {
//             delete newOverrideSettings.roughness;
//             delete newOverrideSettings.metalness;
//           }

//           if (value === "physical") {
//             newOverrideSettings.transmission =
//               currentOverride.transmission ??
//               initialTexturePropsValues.transmission;
//             newOverrideSettings.ior =
//               currentOverride.ior ?? initialTexturePropsValues.ior;
//             newOverrideSettings.thickness =
//               currentOverride.thickness ?? initialTexturePropsValues.thickness;
//             newOverrideSettings.clearcoat =
//               currentOverride.clearcoat ?? initialTexturePropsValues.clearcoat;
//             newOverrideSettings.clearcoatRoughness =
//               currentOverride.clearcoatRoughness ??
//               initialTexturePropsValues.clearcoatRoughness;
//           } else {
//             delete newOverrideSettings.transmission;
//             delete newOverrideSettings.ior;
//             delete newOverrideSettings.thickness;
//             delete newOverrideSettings.clearcoat;
//             delete newOverrideSettings.clearcoatRoughness;
//           }

//           if (value === "phong") {
//             newOverrideSettings.shininess =
//               currentOverride.shininess ?? initialTexturePropsValues.shininess;
//           } else {
//             delete newOverrideSettings.shininess;
//           }
//         }
//       }
//       updateShape(selectedShape.id, {
//         glbMaterialOverride: newOverrideSettings,
//       });
//     },
//     [selectedShape, updateShape, isImportedGLB]
//   );

//   const handleAnimationUpdate = useCallback(
//     (property, value) => {
//       if (!selectedShape) return;
//       const currentAnimationData = selectedShape.animation || {
//         type: "none",
//         speed: 1,
//         axis: "y",
//         orbitCenter: [0, 0, 0],
//         orbitRadius: 5,
//         orbitPlane: "xz",
//       };
//       updateShape(selectedShape.id, {
//         animation: { ...currentAnimationData, [property]: value },
//       });
//     },
//     [selectedShape, updateShape]
//   );

//   const handleOrbitCenterUpdate = useCallback(
//     (index, valueStr) => {
//       if (!selectedShape || !selectedShape.animation) return;
//       const value = parseFloat(valueStr);
//       if (isNaN(value)) return;
//       const newOrbitCenter = [
//         ...(selectedShape.animation.orbitCenter || [0, 0, 0]),
//       ];
//       newOrbitCenter[index] = value;
//       handleAnimationUpdate("orbitCenter", newOrbitCenter);
//     },
//     [selectedShape, handleAnimationUpdate]
//   );

//   const handleQuickAction = useCallback(
//     (action) => {
//       if (!selectedShape) return;
//       const actions = {
//         resetScale: () => updateShape(selectedShape.id, { scale: [1, 1, 1] }),
//         resetRotation: () =>
//           updateShape(selectedShape.id, { rotation: [0, 0, 0] }),
//         centerObject: () => {
//           let yO = 0;
//           if (selectedShape.scale && selectedShape.scale[1]) {
//             if (selectedShape.type === "pyramid") yO = 0;
//             else if (selectedShape.type === "text")
//               yO =
//                 (selectedShape.textSize || 0.5) * selectedShape.scale[1] * 0.5;
//             else if (selectedShape.type === "imagePlane")
//               yO =
//                 ((selectedShape.planeHeight || 1) * selectedShape.scale[1]) / 2;
//             else if (selectedShape.type === "importedGLB") yO = 0;
//             else yO = selectedShape.scale[1] * 0.5;
//           }
//           updateShape(selectedShape.id, { position: [0, yO, 0] });
//         },
//         randomColor: () => {
//           if (isImagePlane) {
//             alert("Cannot apply random color to image planes.");
//             return;
//           }
//           const nC = `#${Math.floor(Math.random() * 16777215)
//             .toString(16)
//             .padStart(6, "0")}`;
//           if (isImportedGLB) {
//             handleGLBMaterialOverrideUpdate("color", nC);
//             if (
//               !selectedShape.glbMaterialOverride ||
//               selectedShape.glbMaterialOverride.type === "model"
//             ) {
//               handleGLBMaterialOverrideUpdate("type", "standard");
//             }
//           } else {
//             updateShape(selectedShape.id, { color: nC });
//           }
//         },
//       };
//       actions[action]?.();
//     },
//     [
//       selectedShape,
//       updateShape,
//       isImportedGLB,
//       isImagePlane,
//       handleGLBMaterialOverrideUpdate,
//     ]
//   );

//   let activeTextureSlots = [];
//   let currentTextureValues = { ...initialTexturePropsValues };
//   let fileInputRefsToUse = shapeTextureFileInputRefs;
//   let texturePropsKeyForShape = "textureProps";

//   if (selectedShape) {
//     if (isText) {
//       activeTextureSlots = [
//         { id: "map", name: "Color/Albedo Map" },
//         { id: "normalMap", name: "Normal Map" },
//       ];
//       currentTextureValues = {
//         ...initialTexturePropsValues,
//         ...(selectedShape.textTextureProps || {}),
//       };
//       fileInputRefsToUse = textTextureFileInputRefs;
//       texturePropsKeyForShape = "textTextureProps";
//     } else if (isImportedGLB) {
//       activeTextureSlots = allTextureSlots;
//       currentTextureValues = {
//         ...initialTexturePropsValues,
//         ...(selectedShape.textureProps || {}),
//       };
//     } else if (!isImagePlane) {
//       activeTextureSlots = allTextureSlots;
//       currentTextureValues = {
//         ...initialTexturePropsValues,
//         ...(selectedShape.textureProps || {}),
//       };
//     }
//   }

//   const getShapeIcon = () => {
//     if (!selectedShape) return <Square size={24} className='text-slate-500' />;
//     const iconData = shapeDisplayOptions.find(
//       (s) => s.type === currentShapeType
//     );
//     if (iconData)
//       return typeof iconData.icon === "string" ? (
//         <span className='text-2xl'>{iconData.icon}</span>
//       ) : (
//         React.cloneElement(iconData.icon, { className: "text-purple-400" })
//       );
//     if (isCustomExtruded)
//       return (
//         <span className='text-2xl'>
//           {popularShapeIcons[selectedShape.shapeType?.toLowerCase()] || "💖"}
//         </span>
//       );
//     return <Square size={24} className='text-purple-400' />;
//   };

//   // Theme-aware styling classes
//   const cardClass =
//     "bg-white dark:bg-slate-800/70 border border-gray-200 dark:border-slate-700 shadow-lg rounded-lg";
//   const inputClass =
//     "bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-800 dark:text-slate-100 text-xs h-8 rounded-md focus:ring-1 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-blue-500 dark:focus:border-purple-500";
//   const labelClass =
//     "text-xs font-medium text-gray-600 dark:text-slate-300 mb-1.5 block";
//   const sliderClass =
//     "[&>span:first-child]:bg-blue-600 dark:[&>span:first-child]:bg-purple-600 [&>span:last-child]:bg-gray-200 dark:[&>span:last-child]:bg-slate-700";

//   const pbrRoughness = isImportedGLB
//     ? glbMaterialOverride?.roughness ?? currentTextureValues.roughness
//     : selectedShape?.textureProps?.roughness ??
//       selectedShape?.roughness ??
//       initialTexturePropsValues.roughness;
//   const pbrMetalness = isImportedGLB
//     ? glbMaterialOverride?.metalness ?? currentTextureValues.metalness
//     : selectedShape?.textureProps?.metalness ??
//       selectedShape?.metalness ??
//       initialTexturePropsValues.metalness;
//   const physicalTransmission = isImportedGLB
//     ? glbMaterialOverride?.transmission ?? currentTextureValues.transmission
//     : selectedShape?.textureProps?.transmission ??
//       selectedShape?.transmission ??
//       initialTexturePropsValues.transmission;
//   const physicalIor = isImportedGLB
//     ? glbMaterialOverride?.ior ?? currentTextureValues.ior
//     : selectedShape?.textureProps?.ior ??
//       selectedShape?.ior ??
//       initialTexturePropsValues.ior;
//   const physicalThickness = isImportedGLB
//     ? glbMaterialOverride?.thickness ?? currentTextureValues.thickness
//     : selectedShape?.textureProps?.thickness ??
//       selectedShape?.thickness ??
//       initialTexturePropsValues.thickness;
//   const physicalClearcoat = isImportedGLB
//     ? glbMaterialOverride?.clearcoat ?? currentTextureValues.clearcoat
//     : selectedShape?.textureProps?.clearcoat ??
//       selectedShape?.clearcoat ??
//       initialTexturePropsValues.clearcoat;
//   const physicalClearcoatRoughness = isImportedGLB
//     ? glbMaterialOverride?.clearcoatRoughness ??
//       currentTextureValues.clearcoatRoughness
//     : selectedShape?.textureProps?.clearcoatRoughness ??
//       selectedShape?.clearcoatRoughness ??
//       initialTexturePropsValues.clearcoatRoughness;
//   const phongShininess = isImportedGLB
//     ? glbMaterialOverride?.shininess ?? currentTextureValues.shininess
//     : selectedShape?.textureProps?.shininess ??
//       selectedShape?.shininess ??
//       initialTexturePropsValues.shininess;

//   return (
//     <motion.div
//       initial={{ x: 30, opacity: 0 }}
//       animate={{ x: 0, opacity: 1 }}
//       transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
//       // FIXED: Proper z-index stacking and responsive positioning with mobile spacing
//       className={cn(
//         "w-72 overflow-y-auto shadow-xl text-gray-900 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200",
//         "dark:text-slate-100 dark:scrollbar-thumb-slate-700 dark:scrollbar-track-slate-800",
//         "bg-gray-50/95 backdrop-blur-md border-l border-gray-200/60",
//         "dark:bg-slate-900/95 dark:border-slate-700/60",
//         // Mobile: Fixed position overlay with proper z-index and top spacing
//         "fixed top-0 right-0 bottom-0 z-[60] pt-16 px-4 pb-4",
//         // Desktop: Normal flow positioning with regular padding
//         "md:relative md:z-auto md:p-4 md:pt-4",
//         // Desktop: Normal flow positioning
//         "md:bg-transparent md:backdrop-blur-none md:border-gray-200/50 md:shadow-none",
//         // Ensure it's above canvas but below modals
//         "transform-gpu will-change-transform"
//       )}
//     >
//       <AnimatePresence mode='wait'>
//         {selectedShape ? (
//           <motion.div
//             key={selectedShape.id}
//             initial={{ opacity: 0, y: 15 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -15 }}
//             className='space-y-5'
//           >
//             <div className='flex justify-between items-center'>
//               <div>
//                 <h3 className='text-md font-semibold text-gray-900 dark:text-slate-100'>
//                   Object Properties
//                 </h3>
//                 <p className='text-xs text-gray-500 dark:text-slate-400'>
//                   {selectedShape.name ||
//                     (isText ? "3D Text" : currentShapeType)}
//                 </p>
//               </div>
//               <div className='flex items-center space-x-1'>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       onClick={duplicateShape}
//                       variant='ghost'
//                       size='icon'
//                       className='w-7 h-7 text-gray-500 hover:text-blue-600 hover:bg-gray-100/50
//                                  dark:text-slate-400 dark:hover:text-purple-300 dark:hover:bg-slate-700/50'
//                     >
//                       <LayersIconLucide size={14} />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent
//                     side='bottom'
//                     className='bg-white text-gray-800 border-gray-200
//                                dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
//                   >
//                     <p>Duplicate (Ctrl+D)</p>
//                   </TooltipContent>
//                 </Tooltip>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       onClick={() => removeShape(selectedShape.id)}
//                       variant='ghost'
//                       size='icon'
//                       className='w-7 h-7 text-red-500 hover:text-red-400 hover:bg-red-500/20'
//                     >
//                       <Trash2 size={14} />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent
//                     side='bottom'
//                     className='bg-white text-gray-800 border-gray-200
//                                dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
//                   >
//                     <p>Delete (Del/Backspace)</p>
//                   </TooltipContent>
//                 </Tooltip>
//               </div>
//             </div>
//             <Separator className='bg-gray-200 dark:bg-slate-700' />

//             <Card className={cardClass}>
//               <CardContent className='p-3'>
//                 <Label htmlFor='object-name' className={labelClass}>
//                   Name
//                 </Label>
//                 <Input
//                   id='object-name'
//                   value={selectedShape.name || ""}
//                   onChange={(e) => handleGenericUpdate("name", e.target.value)}
//                   placeholder='Object Name'
//                   className={inputClass}
//                 />
//               </CardContent>
//             </Card>

//             {isText && (
//               <Card className={cardClass}>
//                 <CardHeader className='p-3'>
//                   <CardTitle className='text-sm font-semibold text-gray-900 dark:text-slate-200'>
//                     Text Settings
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className='space-y-4 p-3'>
//                   <div>
//                     <Label htmlFor='text-content' className={labelClass}>
//                       Content
//                     </Label>
//                     <Input
//                       id='text-content'
//                       value={selectedShape.text || ""}
//                       onChange={(e) =>
//                         handleGenericUpdate("text", e.target.value)
//                       }
//                       placeholder='Enter text...'
//                       className={inputClass}
//                     />
//                   </div>
//                   <div>
//                     <Label className={labelClass}>
//                       Size: {selectedShape.textSize?.toFixed(2) || 0.5}
//                     </Label>
//                     <Slider
//                       value={[selectedShape.textSize || 0.5]}
//                       onValueChange={([v]) =>
//                         handleGenericUpdate("textSize", v)
//                       }
//                       max={2}
//                       min={0.1}
//                       step={0.05}
//                       className={sliderClass}
//                     />
//                   </div>
//                   <div>
//                     <Label className={labelClass}>
//                       Thickness: {selectedShape.extrudeDepth?.toFixed(2) || 0.2}
//                     </Label>
//                     <Slider
//                       value={[selectedShape.extrudeDepth || 0.2]}
//                       onValueChange={([v]) =>
//                         handleGenericUpdate("extrudeDepth", v)
//                       }
//                       max={1}
//                       min={0.01}
//                       step={0.01}
//                       className={sliderClass}
//                     />
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//             {isCustomExtruded && (
//               <Card className={cardClass}>
//                 <CardHeader className='p-3'>
//                   <CardTitle className='text-sm font-semibold text-gray-900 dark:text-slate-200'>
//                     Custom Shape Settings
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className='space-y-4 p-3'>
//                   <div>
//                     <Label className={labelClass}>
//                       Size: {selectedShape.shapeSize?.toFixed(2) || 1.0}
//                     </Label>
//                     <Slider
//                       value={[selectedShape.shapeSize || 1]}
//                       onValueChange={([v]) =>
//                         handleGenericUpdate("shapeSize", v)
//                       }
//                       max={5}
//                       min={0.1}
//                       step={0.05}
//                       className={sliderClass}
//                     />
//                   </div>
//                   <div>
//                     <Label className={labelClass}>
//                       Depth: {selectedShape.extrudeDepth?.toFixed(2) || 0.2}
//                     </Label>
//                     <Slider
//                       value={[selectedShape.extrudeDepth || 0.2]}
//                       onValueChange={([v]) =>
//                         handleGenericUpdate("extrudeDepth", v)
//                       }
//                       max={2}
//                       min={0.01}
//                       step={0.01}
//                       className={sliderClass}
//                     />
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             <Card className={cardClass}>
//               <CardHeader className='p-3'>
//                 <CardTitle className='text-sm font-semibold text-gray-900 dark:text-slate-200'>
//                   Transform
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className='space-y-4 p-3'>
//                 {["position", "rotation", "scale"].map((prop) => (
//                   <div key={prop} className='space-y-2'>
//                     <h4 className='font-medium text-xs text-gray-700 dark:text-slate-300 capitalize'>
//                       {prop}
//                     </h4>
//                     {["X", "Y", "Z"].map((axis, index) => (
//                       <div
//                         key={axis}
//                         className='grid grid-cols-6 items-center gap-2'
//                       >
//                         <Label
//                           htmlFor={`${prop}-${axis}`}
//                           className='text-xs text-gray-500 dark:text-slate-400 col-span-1'
//                         >
//                           {axis}
//                         </Label>
//                         <Input
//                           id={`${prop}-${axis}`}
//                           type='number'
//                           value={
//                             prop === "rotation"
//                               ? THREE.MathUtils.radToDeg(
//                                   selectedShape[prop][index] || 0
//                                 ).toFixed(0)
//                               : (selectedShape[prop][index] || 0).toFixed(2)
//                           }
//                           onChange={(e) =>
//                             handleTransformUpdate(prop, index, e.target.value)
//                           }
//                           step={prop === "rotation" ? 5 : 0.1}
//                           className={cn(inputClass, "col-span-2")}
//                         />
//                         <Slider
//                           value={[
//                             prop === "rotation"
//                               ? THREE.MathUtils.radToDeg(
//                                   selectedShape[prop][index] || 0
//                                 )
//                               : selectedShape[prop][index] || 0,
//                           ]}
//                           onValueChange={([v]) =>
//                             handleTransformUpdate(prop, index, v.toString())
//                           }
//                           min={
//                             prop === "rotation"
//                               ? -360
//                               : prop === "scale"
//                               ? 0.01
//                               : -15
//                           }
//                           max={
//                             prop === "rotation"
//                               ? 360
//                               : prop === "scale"
//                               ? 10
//                               : 15
//                           }
//                           step={
//                             prop === "rotation"
//                               ? 1
//                               : prop === "scale"
//                               ? 0.01
//                               : 0.1
//                           }
//                           className={cn("col-span-3", sliderClass)}
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>

//             {!isImagePlane && (
//               <Card className={cardClass}>
//                 <CardHeader className='p-3'>
//                   <CardTitle className='text-sm font-semibold text-gray-900 dark:text-slate-200 flex items-center'>
//                     <Palette
//                       size={14}
//                       className='mr-1.5 text-blue-600 dark:text-purple-400'
//                     />{" "}
//                     Appearance
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className='space-y-4 p-3'>
//                   {isImportedGLB ? (
//                     <>
//                       <p className='text-xs text-gray-500 dark:text-slate-400'>
//                         Override model's materials. Changes apply to all meshes.
//                       </p>
//                       <div>
//                         <Label className={labelClass}>Override Material</Label>
//                         <div className='flex flex-col space-y-1.5 mt-1'>
//                           {glbMaterialOptionsWithModel.map((opt) => {
//                             const isActive =
//                               (glbMaterialOverride?.type || "model") ===
//                               opt.type;
//                             return (
//                               <Button
//                                 key={opt.type}
//                                 variant='outline'
//                                 className={cn(
//                                   inputClass,
//                                   "px-2.5 w-full justify-start text-left",
//                                   isActive
//                                     ? "bg-blue-600 dark:bg-purple-600 hover:bg-blue-700 dark:hover:bg-purple-700 text-white !border-blue-500 dark:!border-purple-500"
//                                     : "hover:bg-gray-200 dark:hover:bg-slate-600"
//                                 )}
//                                 onClick={() =>
//                                   handleGLBMaterialOverrideUpdate(
//                                     "type",
//                                     opt.type
//                                   )
//                                 }
//                               >
//                                 {opt.name}
//                               </Button>
//                             );
//                           })}
//                         </div>
//                       </div>
//                       {glbMaterialOverride &&
//                         glbMaterialOverride.type !== "model" && (
//                           <>
//                             <Separator className='my-2 bg-gray-200 dark:bg-slate-700' />
//                             <div>
//                               <Label className={labelClass}>
//                                 Override Color
//                               </Label>
//                               <div className='flex items-center space-x-2'>
//                                 <Input
//                                   type='color'
//                                   value={glbMaterialOverride.color || "#cccccc"}
//                                   onChange={(e) =>
//                                     handleGLBMaterialOverrideUpdate(
//                                       "color",
//                                       e.target.value
//                                     )
//                                   }
//                                   className='p-0.5 h-8 w-10 rounded border-gray-300 dark:border-slate-600 cursor-pointer'
//                                 />
//                                 <Input
//                                   value={glbMaterialOverride.color || "#cccccc"}
//                                   onChange={(e) =>
//                                     handleGLBMaterialOverrideUpdate(
//                                       "color",
//                                       e.target.value
//                                     )
//                                   }
//                                   className={cn(inputClass, "flex-1")}
//                                 />
//                               </div>
//                             </div>
//                             {showPBRForGLBOverride && (
//                               <>
//                                 <div>
//                                   <Label className={labelClass}>
//                                     Roughness: {Number(pbrRoughness).toFixed(2)}
//                                   </Label>
//                                   <Slider
//                                     value={[pbrRoughness]}
//                                     onValueChange={([v]) =>
//                                       handleGLBMaterialOverrideUpdate(
//                                         "roughness",
//                                         v
//                                       )
//                                     }
//                                     max={1}
//                                     min={0}
//                                     step={0.01}
//                                     className={sliderClass}
//                                   />
//                                 </div>
//                                 <div>
//                                   <Label className={labelClass}>
//                                     Metalness: {Number(pbrMetalness).toFixed(2)}
//                                   </Label>
//                                   <Slider
//                                     value={[pbrMetalness]}
//                                     onValueChange={([v]) =>
//                                       handleGLBMaterialOverrideUpdate(
//                                         "metalness",
//                                         v
//                                       )
//                                     }
//                                     max={1}
//                                     min={0}
//                                     step={0.01}
//                                     className={sliderClass}
//                                   />
//                                 </div>
//                               </>
//                             )}
//                             {showPhysicalForGLBOverride && (
//                               <>
//                                 <div>
//                                   <Label className={labelClass}>
//                                     Transmission:{" "}
//                                     {Number(physicalTransmission).toFixed(2)}
//                                   </Label>
//                                   <Slider
//                                     value={[physicalTransmission]}
//                                     onValueChange={([v]) =>
//                                       handleGLBMaterialOverrideUpdate(
//                                         "transmission",
//                                         v
//                                       )
//                                     }
//                                     max={1}
//                                     min={0}
//                                     step={0.01}
//                                     className={sliderClass}
//                                   />
//                                 </div>
//                                 <div>
//                                   <Label className={labelClass}>
//                                     IOR: {Number(physicalIor).toFixed(2)}
//                                   </Label>
//                                   <Slider
//                                     value={[physicalIor]}
//                                     onValueChange={([v]) =>
//                                       handleGLBMaterialOverrideUpdate("ior", v)
//                                     }
//                                     max={2.33}
//                                     min={1}
//                                     step={0.01}
//                                     className={sliderClass}
//                                   />
//                                 </div>
//                                 <div>
//                                   <Label className={labelClass}>
//                                     Thickness:{" "}
//                                     {Number(physicalThickness).toFixed(3)}
//                                   </Label>
//                                   <Slider
//                                     value={[physicalThickness]}
//                                     onValueChange={([v]) =>
//                                       handleGLBMaterialOverrideUpdate(
//                                         "thickness",
//                                         v
//                                       )
//                                     }
//                                     max={1}
//                                     min={0}
//                                     step={0.001}
//                                     className={sliderClass}
//                                   />
//                                 </div>
//                                 <div>
//                                   <Label className={labelClass}>
//                                     Clearcoat:{" "}
//                                     {Number(physicalClearcoat).toFixed(2)}
//                                   </Label>
//                                   <Slider
//                                     value={[physicalClearcoat]}
//                                     onValueChange={([v]) =>
//                                       handleGLBMaterialOverrideUpdate(
//                                         "clearcoat",
//                                         v
//                                       )
//                                     }
//                                     max={1}
//                                     min={0}
//                                     step={0.01}
//                                     className={sliderClass}
//                                   />
//                                 </div>
//                                 <div>
//                                   <Label className={labelClass}>
//                                     Clearcoat Roughness:{" "}
//                                     {Number(physicalClearcoatRoughness).toFixed(
//                                       2
//                                     )}
//                                   </Label>
//                                   <Slider
//                                     value={[physicalClearcoatRoughness]}
//                                     onValueChange={([v]) =>
//                                       handleGLBMaterialOverrideUpdate(
//                                         "clearcoatRoughness",
//                                         v
//                                       )
//                                     }
//                                     max={1}
//                                     min={0}
//                                     step={0.01}
//                                     className={sliderClass}
//                                   />
//                                 </div>
//                               </>
//                             )}
//                             {glbMaterialOverride.type === "phong" && (
//                               <div>
//                                 <Label className={labelClass}>
//                                   Shininess: {Number(phongShininess).toFixed(0)}
//                                 </Label>
//                                 <Slider
//                                   value={[phongShininess]}
//                                   onValueChange={([v]) =>
//                                     handleGLBMaterialOverrideUpdate(
//                                       "shininess",
//                                       v
//                                     )
//                                   }
//                                   max={100}
//                                   min={0}
//                                   step={1}
//                                   className={sliderClass}
//                                 />
//                               </div>
//                             )}
//                           </>
//                         )}
//                     </>
//                   ) : (
//                     <>
//                       <div>
//                         <Label className={labelClass}>Material</Label>
//                         <div className='flex flex-col space-y-1.5 mt-1'>
//                           {materialOptionsList.map((opt) => {
//                             const isActive =
//                               (selectedShape.material || "standard") ===
//                               opt.type;
//                             return (
//                               <Button
//                                 key={opt.type}
//                                 variant='outline'
//                                 className={cn(
//                                   inputClass,
//                                   "px-2.5 w-full justify-start text-left",
//                                   isActive
//                                     ? "bg-blue-600 dark:bg-purple-600 hover:bg-blue-700 dark:hover:bg-purple-700 text-white !border-blue-500 dark:!border-purple-500"
//                                     : "hover:bg-gray-200 dark:hover:bg-slate-600"
//                                 )}
//                                 onClick={() =>
//                                   handleGenericUpdate("material", opt.type)
//                                 }
//                               >
//                                 {opt.name}
//                               </Button>
//                             );
//                           })}
//                         </div>
//                       </div>
//                       <div>
//                         <Label className={labelClass}>Color</Label>
//                         <div className='flex items-center space-x-2'>
//                           <Input
//                             type='color'
//                             value={selectedShape.color || "#ffffff"}
//                             onChange={(e) =>
//                               handleGenericUpdate("color", e.target.value)
//                             }
//                             className='p-0.5 h-8 w-10 rounded border-gray-300 dark:border-slate-600 cursor-pointer'
//                           />
//                           <Input
//                             value={selectedShape.color || "#ffffff"}
//                             onChange={(e) =>
//                               handleGenericUpdate("color", e.target.value)
//                             }
//                             className={cn(inputClass, "flex-1")}
//                           />
//                         </div>
//                       </div>
//                       {showPBRPropertiesForPrimitives && (
//                         <>
//                           <Separator className='my-2 bg-gray-200 dark:bg-slate-700' />
//                           <div>
//                             <Label className={labelClass}>
//                               Roughness: {Number(pbrRoughness).toFixed(2)}
//                             </Label>
//                             <Slider
//                               value={[pbrRoughness]}
//                               onValueChange={([v]) =>
//                                 handleTexturePropUpdate("roughness", v)
//                               }
//                               max={1}
//                               min={0}
//                               step={0.01}
//                               className={sliderClass}
//                             />
//                           </div>
//                           <div>
//                             <Label className={labelClass}>
//                               Metalness: {Number(pbrMetalness).toFixed(2)}
//                             </Label>
//                             <Slider
//                               value={[pbrMetalness]}
//                               onValueChange={([v]) =>
//                                 handleTexturePropUpdate("metalness", v)
//                               }
//                               max={1}
//                               min={0}
//                               step={0.01}
//                               className={sliderClass}
//                             />
//                           </div>
//                         </>
//                       )}
//                       {showPhysicalPropertiesForPrimitives && (
//                         <>
//                           <Separator className='my-2 bg-gray-200 dark:bg-slate-700' />
//                           <div>
//                             <Label className={labelClass}>
//                               Transmission:{" "}
//                               {Number(physicalTransmission).toFixed(2)}
//                             </Label>
//                             <Slider
//                               value={[physicalTransmission]}
//                               onValueChange={([v]) =>
//                                 handleTexturePropUpdate("transmission", v)
//                               }
//                               max={1}
//                               min={0}
//                               step={0.01}
//                               className={sliderClass}
//                             />
//                           </div>
//                           <div>
//                             <Label className={labelClass}>
//                               IOR: {Number(physicalIor).toFixed(2)}
//                             </Label>
//                             <Slider
//                               value={[physicalIor]}
//                               onValueChange={([v]) =>
//                                 handleTexturePropUpdate("ior", v)
//                               }
//                               max={2.33}
//                               min={1}
//                               step={0.01}
//                               className={sliderClass}
//                             />
//                           </div>
//                           <div>
//                             <Label className={labelClass}>
//                               Thickness: {Number(physicalThickness).toFixed(3)}
//                             </Label>
//                             <Slider
//                               value={[physicalThickness]}
//                               onValueChange={([v]) =>
//                                 handleTexturePropUpdate("thickness", v)
//                               }
//                               max={1}
//                               min={0}
//                               step={0.001}
//                               className={sliderClass}
//                             />
//                           </div>
//                           <div>
//                             <Label className={labelClass}>
//                               Clearcoat: {Number(physicalClearcoat).toFixed(2)}
//                             </Label>
//                             <Slider
//                               value={[physicalClearcoat]}
//                               onValueChange={([v]) =>
//                                 handleTexturePropUpdate("clearcoat", v)
//                               }
//                               max={1}
//                               min={0}
//                               step={0.01}
//                               className={sliderClass}
//                             />
//                           </div>
//                           <div>
//                             <Label className={labelClass}>
//                               Clearcoat Roughness:{" "}
//                               {Number(physicalClearcoatRoughness).toFixed(2)}
//                             </Label>
//                             <Slider
//                               value={[physicalClearcoatRoughness]}
//                               onValueChange={([v]) =>
//                                 handleTexturePropUpdate("clearcoatRoughness", v)
//                               }
//                               max={1}
//                               min={0}
//                               step={0.01}
//                               className={sliderClass}
//                             />
//                           </div>
//                         </>
//                       )}
//                       {showPhongPropertiesForPrimitives && (
//                         <>
//                           <Separator className='my-2 bg-gray-200 dark:bg-slate-700' />
//                           <div>
//                             <Label className={labelClass}>
//                               Shininess: {Number(phongShininess).toFixed(0)}
//                             </Label>
//                             <Slider
//                               value={[phongShininess]}
//                               onValueChange={([v]) =>
//                                 handleTexturePropUpdate("shininess", v)
//                               }
//                               max={100}
//                               min={0}
//                               step={1}
//                               className={sliderClass}
//                             />
//                           </div>
//                         </>
//                       )}
//                     </>
//                   )}
//                   <Separator className='my-3 bg-gray-200 dark:bg-slate-700' />
//                   <h4 className='text-xs font-semibold text-blue-600 dark:text-purple-300 flex items-center'>
//                     <ImageUp size={12} className='mr-1.5' /> Textures
//                   </h4>
//                   <div className='grid grid-cols-2 gap-2.5'>
//                     {activeTextureSlots.map((slot) => {
//                       const currentUrl = currentTextureValues[`${slot.id}Url`];
//                       const fileInputRef = fileInputRefsToUse.current[slot.id];
//                       return (
//                         <div
//                           key={`${texturePropsKeyForShape}-${slot.id}`}
//                           className='space-y-1'
//                         >
//                           <Label
//                             htmlFor={`tex-upload-${slot.id}`}
//                             className='text-xs text-gray-500 dark:text-slate-400'
//                           >
//                             {slot.name}
//                           </Label>
//                           {currentUrl && (
//                             <div className='relative group w-full aspect-square bg-gray-200/50 dark:bg-slate-700/50 rounded overflow-hidden mb-0.5'>
//                               <img
//                                 src={currentUrl}
//                                 alt={`${slot.name} preview`}
//                                 className='w-full h-full object-cover'
//                               />
//                               <Button
//                                 variant='destructive'
//                                 size='icon'
//                                 className='absolute top-0.5 right-0.5 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity p-0.5'
//                                 onClick={() =>
//                                   handleClearTexture(
//                                     selectedShape.id,
//                                     slot.id,
//                                     isText &&
//                                       texturePropsKeyForShape ===
//                                         "textTextureProps"
//                                   )
//                                 }
//                                 title={`Clear ${slot.name}`}
//                               >
//                                 <Trash2 size={10} />
//                               </Button>
//                             </div>
//                           )}
//                           <div className='flex items-center space-x-1'>
//                             <Button
//                               variant='outline'
//                               size='xs'
//                               className={cn(
//                                 "w-full text-xs py-1 px-1.5 h-auto",
//                                 inputClass,
//                                 "hover:bg-gray-200/50 dark:hover:bg-slate-600/50"
//                               )}
//                               onClick={() => fileInputRef?.click()}
//                             >
//                               <ImageUp size={10} className='mr-1' />{" "}
//                               {currentUrl ? "Change" : "Upload"}
//                             </Button>
//                             {currentUrl && (
//                               <Button
//                                 variant='ghost'
//                                 size='iconXs'
//                                 onClick={() =>
//                                   handleClearTexture(
//                                     selectedShape.id,
//                                     slot.id,
//                                     isText &&
//                                       texturePropsKeyForShape ===
//                                         "textTextureProps"
//                                   )
//                                 }
//                                 title={`Clear ${slot.name}`}
//                                 className='p-0.5 h-auto text-gray-500 hover:text-red-400 dark:text-slate-400'
//                               >
//                                 <X size={10} />
//                               </Button>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             <Card className={cardClass}>
//               <CardHeader className='p-3'>
//                 <CardTitle className='text-sm font-semibold text-gray-900 dark:text-slate-200'>
//                   Animation
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className='space-y-4 p-3'>
//                 <div>
//                   <Label className={labelClass}>Type</Label>
//                   <div className='flex space-x-1.5 mt-1'>
//                     {animationTypeOptions.map((opt) => {
//                       const isActive = animation.type === opt.value;
//                       return (
//                         <Button
//                           key={opt.value}
//                           variant='outline'
//                           className={cn(
//                             inputClass,
//                             "px-2.5 flex-1 text-center",
//                             isActive
//                               ? "bg-blue-600 dark:bg-purple-600 hover:bg-blue-700 dark:hover:bg-purple-700 text-white !border-blue-500 dark:!border-purple-500"
//                               : "hover:bg-gray-200 dark:hover:bg-slate-600"
//                           )}
//                           onClick={() =>
//                             handleAnimationUpdate("type", opt.value)
//                           }
//                         >
//                           {opt.name}
//                         </Button>
//                       );
//                     })}
//                   </div>
//                 </div>
//                 {animation.type !== "none" && (
//                   <>
//                     <div>
//                       <Label className={labelClass}>
//                         Speed: {Number(animation.speed).toFixed(2)}
//                       </Label>
//                       <Slider
//                         value={[animation.speed]}
//                         onValueChange={([v]) =>
//                           handleAnimationUpdate("speed", v)
//                         }
//                         min={0.05}
//                         max={5}
//                         step={0.05}
//                         className={sliderClass}
//                       />
//                     </div>
//                     {animation.type === "rotate" && (
//                       <div>
//                         <Label className={labelClass}>Rotation Axis</Label>
//                         <div className='flex space-x-1.5 mt-1'>
//                           {animationAxisOptions.map((opt) => {
//                             const isActive = animation.axis === opt.value;
//                             return (
//                               <Button
//                                 key={opt.value}
//                                 variant='outline'
//                                 className={cn(
//                                   inputClass,
//                                   "px-2.5 flex-1 text-center",
//                                   isActive
//                                     ? "bg-blue-600 dark:bg-purple-600 hover:bg-blue-700 dark:hover:bg-purple-700 text-white !border-blue-500 dark:!border-purple-500"
//                                     : "hover:bg-gray-200 dark:hover:bg-slate-600"
//                                 )}
//                                 onClick={() =>
//                                   handleAnimationUpdate("axis", opt.value)
//                                 }
//                               >
//                                 {opt.name}
//                               </Button>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     )}
//                     {animation.type === "orbit" && (
//                       <>
//                         <div>
//                           <Label className={labelClass}>
//                             Orbit Radius:{" "}
//                             {Number(animation.orbitRadius).toFixed(2)}
//                           </Label>
//                           <Slider
//                             value={[animation.orbitRadius]}
//                             onValueChange={([v]) =>
//                               handleAnimationUpdate("orbitRadius", v)
//                             }
//                             min={0.1}
//                             max={20}
//                             step={0.1}
//                             className={sliderClass}
//                           />
//                         </div>
//                         <div>
//                           <Label className={labelClass}>Orbit Plane</Label>
//                           <div className='flex space-x-1.5 mt-1'>
//                             {animationPlaneOptions.map((opt) => {
//                               const isActive =
//                                 (animation.orbitPlane || "xz") === opt.value;
//                               return (
//                                 <Button
//                                   key={opt.value}
//                                   variant='outline'
//                                   className={cn(
//                                     inputClass,
//                                     "px-2.5 flex-1 text-center",
//                                     isActive
//                                       ? "bg-blue-600 dark:bg-purple-600 hover:bg-blue-700 dark:hover:bg-purple-700 text-white !border-blue-500 dark:!border-purple-500"
//                                       : "hover:bg-gray-200 dark:hover:bg-slate-600"
//                                   )}
//                                   onClick={() =>
//                                     handleAnimationUpdate(
//                                       "orbitPlane",
//                                       opt.value
//                                     )
//                                   }
//                                 >
//                                   {opt.name}
//                                 </Button>
//                               );
//                             })}
//                           </div>
//                         </div>
//                         <div className='space-y-1'>
//                           <Label className={labelClass}>Orbit Center</Label>
//                           <div className='grid grid-cols-3 gap-2 items-center'>
//                             {["X", "Y", "Z"].map((axisName, index) => (
//                               <div key={axisName}>
//                                 <Label
//                                   htmlFor={`orbit-center-${axisName}`}
//                                   className='text-xs text-gray-500 dark:text-slate-400'
//                                 >
//                                   {axisName}
//                                 </Label>
//                                 <Input
//                                   id={`orbit-center-${axisName}`}
//                                   type='number'
//                                   value={(
//                                     animation.orbitCenter[index] || 0
//                                   ).toString()}
//                                   onChange={(e) =>
//                                     handleOrbitCenterUpdate(
//                                       index,
//                                       e.target.value
//                                     )
//                                   }
//                                   className={cn(inputClass, "mt-0.5")}
//                                   step='0.1'
//                                 />
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </>
//                     )}
//                   </>
//                 )}
//               </CardContent>
//             </Card>

//             <Card className={cardClass}>
//               <CardHeader className='p-3'>
//                 <CardTitle className='text-sm font-semibold text-gray-900 dark:text-slate-200'>
//                   Quick Actions
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className='p-3'>
//                 <div className='grid grid-cols-2 gap-2'>
//                   {[
//                     "resetScale",
//                     "resetRotation",
//                     "centerObject",
//                     !isImagePlane && "randomColor",
//                   ]
//                     .filter(Boolean)
//                     .map((actionKey) => (
//                       <Button
//                         key={actionKey}
//                         onClick={() => handleQuickAction(actionKey)}
//                         variant='outline'
//                         size='sm'
//                         className={cn(
//                           inputClass,
//                           "py-1.5 h-auto justify-center",
//                           "hover:bg-gray-200/50 dark:hover:bg-slate-600/50"
//                         )}
//                       >
//                         {actionKey
//                           .replace(/([A-Z])/g, " $1")
//                           .replace(/^./, (str) => str.toUpperCase())}
//                       </Button>
//                     ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ) : (
//           <motion.div
//             key='empty-properties'
//             initial={{ opacity: 0, y: 15 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -15 }}
//             className='flex flex-col items-center justify-center h-full text-center py-10'
//           >
//             <Square
//               size={48}
//               className='text-gray-400 dark:text-slate-700 mb-6'
//               strokeWidth={1.5}
//             />
//             <h3 className='text-lg font-semibold text-gray-800 dark:text-slate-300 mb-1'>
//               No Object Selected
//             </h3>
//             <p className='text-xs text-gray-500 dark:text-slate-500 mb-6 leading-relaxed px-4'>
//               Click an object in the scene to see its properties, or add a new
//               one from the sidebar.
//             </p>
//             <div className='space-y-2 w-full max-w-[200px]'>
//               <Button
//                 onClick={() => addShape("box")}
//                 className='w-full bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white'
//               >
//                 <PlusCircle size={14} className='mr-2' /> Add Cube
//               </Button>
//               <Button
//                 onClick={() => addShape("text")}
//                 variant='outline'
//                 className={cn(
//                   "border-gray-300 text-gray-700 hover:bg-gray-100/50 hover:text-gray-900",
//                   "dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700/50 dark:hover:text-slate-100",
//                   "w-full"
//                 )}
//               >
//                 <TypeIcon size={14} className='mr-2' /> Add 3D Text
//               </Button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// }
