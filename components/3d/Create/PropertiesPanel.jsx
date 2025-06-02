import React, { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  // CardDescription, // Available if needed
  // CardFooter,      // Available if needed
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  // TooltipProvider should be at a higher level, e.g., Model3DCreator
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
// ForceRefreshButton was moved to EditorToolbar

const initialTextureProps = {
  mapUrl: null,
  normalMapUrl: null,
  roughnessMapUrl: null,
  metalnessMapUrl: null,
  aoMapUrl: null,
  emissiveMapUrl: null,
  // You can add default values for other PBR props here if needed
  // emissiveIntensity: 1.0,
  // aoMapIntensity: 1.0,
  // transmission: 0.0,
  // ior: 1.5,
  // thickness: 0.01,
};

const allTextureSlots = [
  { id: "map", name: "Base Color (Albedo)" },
  { id: "normalMap", name: "Normal Map" },
  { id: "roughnessMap", name: "Roughness Map" },
  { id: "metalnessMap", name: "Metalness Map" },
  { id: "aoMap", name: "AO Map" },
  { id: "emissiveMap", name: "Emissive Map" },
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
  // forceRefreshCanvas, // Prop removed as button moved to EditorToolbar
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
  const materialOptions = [
    { name: "Standard (PBR)", type: "standard" },
    { name: "Physical (PBR)", type: "physical" },
    { name: "Toon", type: "toon" },
    { name: "Basic (Non-PBR)", type: "basic" },
    { name: "Lambert (Non-PBR)", type: "lambert" },
    { name: "Phong (Non-PBR)", type: "phong" },
    { name: "Wireframe", type: "wireframe" },
  ];

  const currentShapeType = selectedShape?.type;
  const isCustomExtruded = currentShapeType === "customExtruded";
  const isImportedGLB = currentShapeType === "importedGLB";
  const isText = currentShapeType === "text";
  const isImagePlane = currentShapeType === "imagePlane";

  const glbMaterialOverride = selectedShape?.glbMaterialOverride || null;
  const showPBRForGLBOverride =
    glbMaterialOverride &&
    ["standard", "physical"].includes(glbMaterialOverride.type);
  const showPBRPropertiesForPrimitives =
    !isImportedGLB &&
    !isImagePlane &&
    selectedShape &&
    ["standard", "physical"].includes(selectedShape.material);

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
            newOverrideSettings.roughness = currentOverride.roughness ?? 0.5;
            newOverrideSettings.metalness = currentOverride.metalness ?? 0.0;
          } else {
            delete newOverrideSettings.roughness;
            delete newOverrideSettings.metalness;
          }
          if (value === "physical") {
            newOverrideSettings.transmission =
              currentOverride.transmission ?? 0.0;
            newOverrideSettings.ior = currentOverride.ior ?? 1.5;
            newOverrideSettings.thickness = currentOverride.thickness ?? 0.01;
          } else {
            delete newOverrideSettings.transmission;
            delete newOverrideSettings.ior;
            delete newOverrideSettings.thickness;
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
  let currentTextureValues = { ...initialTextureProps }; // Ensure it's a copy
  let fileInputRefsToUse = shapeTextureFileInputRefs;
  let texturePropsKeyForShape = "textureProps"; // Default

  if (selectedShape) {
    // Only process if a shape is selected
    if (isText) {
      activeTextureSlots = [
        { id: "map", name: "Color/Albedo Map" },
        { id: "normalMap", name: "Normal Map" },
      ];
      currentTextureValues = {
        ...initialTextureProps,
        ...(selectedShape.textTextureProps || {}),
      };
      fileInputRefsToUse = textTextureFileInputRefs;
      texturePropsKeyForShape = "textTextureProps";
    } else if (isImportedGLB) {
      activeTextureSlots = allTextureSlots;
      currentTextureValues = {
        ...initialTextureProps,
        ...(selectedShape.textureProps || {}),
      };
      fileInputRefsToUse = shapeTextureFileInputRefs;
      texturePropsKeyForShape = "textureProps";
    } else if (!isImagePlane) {
      activeTextureSlots = allTextureSlots;
      currentTextureValues = {
        ...initialTextureProps,
        ...(selectedShape.textureProps || {}),
      };
      fileInputRefsToUse = shapeTextureFileInputRefs;
      texturePropsKeyForShape = "textureProps";
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

  const cardClass = "bg-slate-800/70 border border-slate-700 shadow-lg";
  const inputClass =
    "bg-slate-700 border-slate-600 text-slate-100 text-xs h-8 focus:ring-1 focus:ring-purple-500 focus:border-purple-500";
  const labelClass = "text-xs text-slate-300 mb-1 block";
  const selectTriggerClass = cn(inputClass, "py-0");

  return (
    <motion.div
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
      className='w-72 p-4 bg-slate-900/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none border-l border-slate-700/50 md:border-none overflow-y-auto shadow-xl md:shadow-none text-slate-100 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800'
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
                {" "}
                <h3 className='text-md font-semibold text-slate-100'>
                  Object Properties
                </h3>{" "}
                <p className='text-xs text-slate-400'>
                  {" "}
                  {selectedShape.name ||
                    (isText ? "3D Text" : currentShapeType)}{" "}
                </p>{" "}
              </div>
              <div className='flex items-center space-x-1'>
                <Tooltip>
                  {" "}
                  <TooltipTrigger asChild>
                    <Button
                      onClick={duplicateShape}
                      variant='ghost'
                      size='icon'
                      className='w-7 h-7 text-slate-400 hover:text-purple-300 hover:bg-slate-700/50'
                    >
                      {" "}
                      <LayersIconLucide size={14} />{" "}
                    </Button>
                  </TooltipTrigger>{" "}
                  <TooltipContent
                    side='bottom'
                    className='bg-slate-800 text-slate-200 border-slate-700'
                  >
                    <p>Duplicate (Ctrl+D)</p>
                  </TooltipContent>{" "}
                </Tooltip>
                <Tooltip>
                  {" "}
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => removeShape(selectedShape.id)}
                      variant='ghost'
                      size='icon'
                      className='w-7 h-7 text-red-500 hover:text-red-400 hover:bg-red-500/20'
                    >
                      {" "}
                      <Trash2 size={14} />{" "}
                    </Button>
                  </TooltipTrigger>{" "}
                  <TooltipContent
                    side='bottom'
                    className='bg-slate-800 text-slate-200 border-slate-700'
                  >
                    <p>Delete (Del/Backspace)</p>
                  </TooltipContent>{" "}
                </Tooltip>
              </div>
            </div>
            <Separator className='bg-slate-700' />
            <Card className={cardClass}>
              {" "}
              <CardContent className='p-3'>
                {" "}
                <Label htmlFor='object-name' className={labelClass}>
                  Name
                </Label>{" "}
                <Input
                  id='object-name'
                  value={selectedShape.name || ""}
                  onChange={(e) => handleGenericUpdate("name", e.target.value)}
                  placeholder='Object Name'
                  className={inputClass}
                />{" "}
              </CardContent>{" "}
            </Card>

            {isText && (
              <Card className={cardClass}>
                {" "}
                <CardHeader className='p-3'>
                  <CardTitle className='text-sm text-slate-200'>
                    Text Settings
                  </CardTitle>
                </CardHeader>{" "}
                <CardContent className='space-y-3 p-3'>
                  {" "}
                  <div>
                    {" "}
                    <Label htmlFor='text-content' className={labelClass}>
                      Content
                    </Label>{" "}
                    <Input
                      id='text-content'
                      value={selectedShape.text || ""}
                      onChange={(e) =>
                        handleGenericUpdate("text", e.target.value)
                      }
                      placeholder='Enter text...'
                      className={inputClass}
                    />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <Label className={labelClass}>
                      Size: {selectedShape.textSize?.toFixed(2) || 0.5}
                    </Label>{" "}
                    <Slider
                      value={[selectedShape.textSize || 0.5]}
                      onValueChange={([v]) =>
                        handleGenericUpdate("textSize", v)
                      }
                      max={2}
                      min={0.1}
                      step={0.05}
                    />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <Label className={labelClass}>
                      Thickness: {selectedShape.extrudeDepth?.toFixed(2) || 0.2}
                    </Label>{" "}
                    <Slider
                      value={[selectedShape.extrudeDepth || 0.2]}
                      onValueChange={([v]) =>
                        handleGenericUpdate("extrudeDepth", v)
                      }
                      max={1}
                      min={0.01}
                      step={0.01}
                    />{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>
            )}
            {isCustomExtruded && (
              <Card className={cardClass}>
                {" "}
                <CardHeader className='p-3'>
                  <CardTitle className='text-sm text-slate-200'>
                    Custom Shape Settings
                  </CardTitle>
                </CardHeader>{" "}
                <CardContent className='space-y-3 p-3'>
                  {" "}
                  <div>
                    {" "}
                    <Label className={labelClass}>
                      Size: {selectedShape.shapeSize?.toFixed(2) || 1.0}
                    </Label>{" "}
                    <Slider
                      value={[selectedShape.shapeSize || 1]}
                      onValueChange={([v]) =>
                        handleGenericUpdate("shapeSize", v)
                      }
                      max={5}
                      min={0.1}
                      step={0.05}
                    />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <Label className={labelClass}>
                      Depth: {selectedShape.extrudeDepth?.toFixed(2) || 0.2}
                    </Label>{" "}
                    <Slider
                      value={[selectedShape.extrudeDepth || 0.2]}
                      onValueChange={([v]) =>
                        handleGenericUpdate("extrudeDepth", v)
                      }
                      max={2}
                      min={0.01}
                      step={0.01}
                    />{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>
            )}

            <Card className={cardClass}>
              {" "}
              <CardHeader className='p-3'>
                <CardTitle className='text-sm text-slate-200'>
                  Transform
                </CardTitle>
              </CardHeader>{" "}
              <CardContent className='space-y-3 p-3'>
                {" "}
                {["position", "rotation", "scale"].map((prop) => (
                  <div key={prop} className='space-y-1.5'>
                    {" "}
                    <h4 className='font-medium text-xs text-slate-300 capitalize'>
                      {prop}
                    </h4>{" "}
                    {["X", "Y", "Z"].map((axis, index) => (
                      <div
                        key={axis}
                        className='grid grid-cols-6 items-center gap-2'
                      >
                        {" "}
                        <Label
                          htmlFor={`${prop}-${axis}`}
                          className='text-xs text-slate-400 col-span-1'
                        >
                          {axis}
                        </Label>{" "}
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
                        />{" "}
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
                          className='col-span-3'
                        />{" "}
                      </div>
                    ))}{" "}
                  </div>
                ))}{" "}
              </CardContent>{" "}
            </Card>

            {!isImagePlane && (
              <Card className={cardClass}>
                {" "}
                <CardHeader className='p-3'>
                  <CardTitle className='text-sm text-slate-200 flex items-center'>
                    <Palette size={14} className='mr-1.5 text-purple-400' />{" "}
                    Appearance
                  </CardTitle>
                </CardHeader>{" "}
                <CardContent className='space-y-3 p-3'>
                  {" "}
                  {isImportedGLB ? (
                    <>
                      {" "}
                      <p className='text-xs text-slate-400'>
                        Override model's materials. Changes apply to all meshes.
                      </p>{" "}
                      <div>
                        {" "}
                        <Label className={labelClass}>
                          Override Material
                        </Label>{" "}
                        <Select
                          value={glbMaterialOverride?.type || "model"}
                          onValueChange={(newType) =>
                            handleGLBMaterialOverrideUpdate("type", newType)
                          }
                        >
                          {" "}
                          <SelectTrigger className={selectTriggerClass}>
                            <SelectValue />
                          </SelectTrigger>{" "}
                          <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
                            <SelectItem
                              value='model'
                              className='focus:bg-purple-600/30'
                            >
                              Model's Own Materials
                            </SelectItem>{" "}
                            {materialOptions.map((m) => (
                              <SelectItem
                                key={m.type}
                                value={m.type}
                                className='focus:bg-purple-600/30'
                              >
                                {m.name}
                              </SelectItem>
                            ))}{" "}
                          </SelectContent>{" "}
                        </Select>{" "}
                      </div>{" "}
                      {glbMaterialOverride &&
                        glbMaterialOverride.type !== "model" && (
                          <>
                            {" "}
                            <Separator className='my-2 bg-slate-700' />{" "}
                            <div>
                              {" "}
                              <Label className={labelClass}>
                                Override Color
                              </Label>{" "}
                              <div className='flex items-center space-x-2'>
                                {" "}
                                <Input
                                  type='color'
                                  value={glbMaterialOverride.color || "#cccccc"}
                                  onChange={(e) =>
                                    handleGLBMaterialOverrideUpdate(
                                      "color",
                                      e.target.value
                                    )
                                  }
                                  className='p-0.5 h-8 w-10 rounded border-slate-600 cursor-pointer'
                                />{" "}
                                <Input
                                  value={glbMaterialOverride.color || "#cccccc"}
                                  onChange={(e) =>
                                    handleGLBMaterialOverrideUpdate(
                                      "color",
                                      e.target.value
                                    )
                                  }
                                  className={cn(inputClass, "flex-1")}
                                />{" "}
                              </div>{" "}
                            </div>{" "}
                            {showPBRForGLBOverride && (
                              <>
                                {" "}
                                <div>
                                  {" "}
                                  <Label className={labelClass}>
                                    Roughness:{" "}
                                    {Number(
                                      glbMaterialOverride.roughness ?? 0.5
                                    ).toFixed(2)}
                                  </Label>{" "}
                                  <Slider
                                    value={[
                                      glbMaterialOverride.roughness ?? 0.5,
                                    ]}
                                    onValueChange={([v]) =>
                                      handleGLBMaterialOverrideUpdate(
                                        "roughness",
                                        v
                                      )
                                    }
                                    max={1}
                                    min={0}
                                    step={0.01}
                                  />{" "}
                                </div>{" "}
                                <div>
                                  {" "}
                                  <Label className={labelClass}>
                                    Metalness:{" "}
                                    {Number(
                                      glbMaterialOverride.metalness ?? 0.0
                                    ).toFixed(2)}
                                  </Label>{" "}
                                  <Slider
                                    value={[
                                      glbMaterialOverride.metalness ?? 0.0,
                                    ]}
                                    onValueChange={([v]) =>
                                      handleGLBMaterialOverrideUpdate(
                                        "metalness",
                                        v
                                      )
                                    }
                                    max={1}
                                    min={0}
                                    step={0.01}
                                  />{" "}
                                </div>{" "}
                              </>
                            )}{" "}
                          </>
                        )}{" "}
                    </>
                  ) : (
                    <>
                      {" "}
                      <div>
                        {" "}
                        <Label className={labelClass}>Material</Label>{" "}
                        <Select
                          value={selectedShape.material || "standard"}
                          onValueChange={(v) =>
                            handleGenericUpdate("material", v)
                          }
                        >
                          {" "}
                          <SelectTrigger className={selectTriggerClass}>
                            <SelectValue />
                          </SelectTrigger>{" "}
                          <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
                            {materialOptions.map((m) => (
                              <SelectItem
                                key={m.type}
                                value={m.type}
                                className='focus:bg-purple-600/30'
                              >
                                {m.name}
                              </SelectItem>
                            ))}
                          </SelectContent>{" "}
                        </Select>{" "}
                      </div>{" "}
                      <div>
                        {" "}
                        <Label className={labelClass}>Color</Label>{" "}
                        <div className='flex items-center space-x-2'>
                          {" "}
                          <Input
                            type='color'
                            value={selectedShape.color || "#ffffff"}
                            onChange={(e) =>
                              handleGenericUpdate("color", e.target.value)
                            }
                            className='p-0.5 h-8 w-10 rounded border-slate-600 cursor-pointer'
                          />{" "}
                          <Input
                            value={selectedShape.color || "#ffffff"}
                            onChange={(e) =>
                              handleGenericUpdate("color", e.target.value)
                            }
                            className={cn(inputClass, "flex-1")}
                          />{" "}
                        </div>{" "}
                      </div>{" "}
                      {showPBRPropertiesForPrimitives && (
                        <>
                          {" "}
                          <Separator className='my-2 bg-slate-700' />{" "}
                          <div>
                            {" "}
                            <Label className={labelClass}>
                              Roughness:{" "}
                              {Number(selectedShape.roughness || 0.5).toFixed(
                                2
                              )}
                            </Label>{" "}
                            <Slider
                              value={[selectedShape.roughness || 0.5]}
                              onValueChange={([v]) =>
                                handleGenericUpdate("roughness", v)
                              }
                              max={1}
                              min={0}
                              step={0.01}
                            />{" "}
                          </div>{" "}
                          <div>
                            {" "}
                            <Label className={labelClass}>
                              Metalness:{" "}
                              {Number(selectedShape.metalness || 0.0).toFixed(
                                2
                              )}
                            </Label>{" "}
                            <Slider
                              value={[selectedShape.metalness || 0.0]}
                              onValueChange={([v]) =>
                                handleGenericUpdate("metalness", v)
                              }
                              max={1}
                              min={0}
                              step={0.01}
                            />{" "}
                          </div>{" "}
                        </>
                      )}{" "}
                    </>
                  )}{" "}
                  <Separator className='my-3 bg-slate-700' />{" "}
                  <h4 className='text-xs font-semibold text-purple-300 flex items-center'>
                    <ImageUp size={12} className='mr-1' /> Textures
                  </h4>{" "}
                  <div className='grid grid-cols-2 gap-2.5'>
                    {" "}
                    {activeTextureSlots.map((slot) => {
                      const currentUrl = currentTextureValues[`${slot.id}Url`];
                      const fileInputRef = fileInputRefsToUse.current[slot.id];
                      return (
                        <div
                          key={`${texturePropsKeyForShape}-${slot.id}`}
                          className='space-y-1'
                        >
                          {" "}
                          <Label
                            htmlFor={`tex-upload-${slot.id}`}
                            className='text-xs text-slate-400'
                          >
                            {slot.name}
                          </Label>{" "}
                          {currentUrl && (
                            <div className='relative group w-full aspect-square bg-slate-700/50 rounded overflow-hidden mb-0.5'>
                              {" "}
                              <img
                                src={currentUrl}
                                alt={`${slot.name} preview`}
                                className='w-full h-full object-cover'
                              />{" "}
                              <Button
                                variant='destructive'
                                size='icon'
                                className='absolute top-0.5 right-0.5 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity p-0.5'
                                onClick={() =>
                                  handleClearTexture(
                                    selectedShape.id,
                                    slot.id,
                                    isText
                                  )
                                }
                                title={`Clear ${slot.name}`}
                              >
                                <Trash2 size={10} />
                              </Button>{" "}
                            </div>
                          )}{" "}
                          <div className='flex items-center space-x-1'>
                            {" "}
                            <Button
                              variant='outline'
                              size='xs'
                              className={cn(
                                "w-full text-xs py-1 px-1.5 h-auto",
                                inputClass,
                                "hover:bg-slate-600/50"
                              )}
                              onClick={() => fileInputRef?.click()}
                            >
                              <ImageUp size={10} className='mr-1' />{" "}
                              {currentUrl ? "Change" : "Upload"}
                            </Button>{" "}
                            {currentUrl && (
                              <Button
                                variant='ghost'
                                size='iconXs'
                                onClick={() =>
                                  handleClearTexture(
                                    selectedShape.id,
                                    slot.id,
                                    isText
                                  )
                                }
                                title={`Clear ${slot.name}`}
                                className='p-0.5 h-auto text-slate-400 hover:text-red-400'
                              >
                                <X size={10} />
                              </Button>
                            )}{" "}
                          </div>{" "}
                        </div>
                      );
                    })}{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>
            )}

            <Card className={cardClass}>
              {" "}
              <CardHeader className='p-3'>
                <CardTitle className='text-sm text-slate-200'>
                  Animation
                </CardTitle>
              </CardHeader>{" "}
              <CardContent className='space-y-3 p-3'>
                {" "}
                <div>
                  <Label className={labelClass}>Type</Label>
                  <Select
                    value={animation.type}
                    onValueChange={(v) => handleAnimationUpdate("type", v)}
                  >
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
                      <SelectItem
                        value='none'
                        className='focus:bg-purple-600/30'
                      >
                        None
                      </SelectItem>
                      <SelectItem
                        value='rotate'
                        className='focus:bg-purple-600/30'
                      >
                        Rotate
                      </SelectItem>
                      <SelectItem
                        value='orbit'
                        className='focus:bg-purple-600/30'
                      >
                        Orbit
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>{" "}
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
                      />
                    </div>{" "}
                    {animation.type === "rotate" && (
                      <div>
                        <Label className={labelClass}>Rotation Axis</Label>
                        <Select
                          value={animation.axis}
                          onValueChange={(v) =>
                            handleAnimationUpdate("axis", v)
                          }
                        >
                          <SelectTrigger className={selectTriggerClass}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
                            <SelectItem
                              value='x'
                              className='focus:bg-purple-600/30'
                            >
                              X
                            </SelectItem>
                            <SelectItem
                              value='y'
                              className='focus:bg-purple-600/30'
                            >
                              Y
                            </SelectItem>
                            <SelectItem
                              value='z'
                              className='focus:bg-purple-600/30'
                            >
                              Z
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}{" "}
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
                          />
                        </div>{" "}
                        <div>
                          <Label className={labelClass}>Orbit Plane</Label>
                          <Select
                            value={animation.orbitPlane || "xz"}
                            onValueChange={(v) =>
                              handleAnimationUpdate("orbitPlane", v)
                            }
                          >
                            <SelectTrigger className={selectTriggerClass}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className='bg-slate-700 border-slate-600 text-slate-100'>
                              <SelectItem
                                value='xy'
                                className='focus:bg-purple-600/30'
                              >
                                XY
                              </SelectItem>
                              <SelectItem
                                value='xz'
                                className='focus:bg-purple-600/30'
                              >
                                XZ
                              </SelectItem>
                              <SelectItem
                                value='yz'
                                className='focus:bg-purple-600/30'
                              >
                                YZ
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>{" "}
                        <div className='space-y-1'>
                          <Label className={labelClass}>Orbit Center</Label>
                          <div className='grid grid-cols-3 gap-2 items-center'>
                            {["X", "Y", "Z"].map((axisName, index) => (
                              <div key={axisName}>
                                <Label
                                  htmlFor={`orbit-center-${axisName}`}
                                  className='text-xs text-slate-400'
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
                    )}{" "}
                  </>
                )}{" "}
              </CardContent>{" "}
            </Card>

            <Card className={cardClass}>
              {" "}
              <CardHeader className='p-3'>
                <CardTitle className='text-sm text-slate-200'>
                  Quick Actions
                </CardTitle>
              </CardHeader>{" "}
              <CardContent className='p-3'>
                {" "}
                <div className='grid grid-cols-2 gap-2'>
                  {" "}
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
                          "hover:bg-slate-600/50"
                        )}
                      >
                        {" "}
                        {actionKey
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}{" "}
                      </Button>
                    ))}{" "}
                </div>{" "}
              </CardContent>{" "}
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
              className='text-slate-700 mb-6'
              strokeWidth={1.5}
            />
            <h3 className='text-lg font-semibold text-slate-300 mb-1'>
              No Object Selected
            </h3>
            <p className='text-xs text-slate-500 mb-6 leading-relaxed px-4'>
              {" "}
              Click an object in the scene to see its properties, or add a new
              one from the sidebar.{" "}
            </p>
            <div className='space-y-2 w-full max-w-[200px]'>
              {" "}
              <Button
                onClick={() => addShape("box")}
                className='w-full bg-purple-600 hover:bg-purple-700 text-white'
              >
                {" "}
                <PlusCircle size={14} className='mr-2' /> Add Cube{" "}
              </Button>{" "}
              <Button
                onClick={() => addShape("text")}
                variant='outline'
                className={cn(
                  "border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100",
                  "w-full"
                )}
              >
                {" "}
                <TypeIcon size={14} className='mr-2' /> Add 3D Text{" "}
              </Button>{" "}
            </div>
            {/* ForceRefreshButton was removed from here and moved to EditorToolbar */}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
