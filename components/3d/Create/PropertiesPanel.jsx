import React, { useCallback, useEffect } from "react"; // Added React import
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  ImageUp,
  Trash2,
  Palette,
  LayersIcon as LayersIconLucide,
  Type as TypeIcon,
  CopyIcon,
  CrosshairIcon,
  RotateCcwIcon,
  ScaleIcon, // Added for quick actions
} from "lucide-react";
import * as THREE from "three";

// Assuming initialTextureProps is defined in ModelCreator and its structure is known
// For context here, if needed:
// const initialTextureProps = {
//   mapUrl: null, normalMapUrl: null, roughnessMapUrl: null,
//   metalnessMapUrl: null, aoMapUrl: null, emissiveMapUrl: null,
// };

export default function PropertiesPanel({
  selectedShape,
  updateShape, // This is updateShapeAndSave from ModelCreator
  removeShape,
  duplicateShape,
  addShape,
  handleClearTexture, // Passed from ModelCreator
  shapeTextureFileInputRefs, // Passed from ModelCreator
  textTextureFileInputRefs, // Passed from ModelCreator
}) {
  useEffect(() => {
    // console.log("PropertiesPanel: selectedShape updated", selectedShape);
  }, [selectedShape]);

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
  const isCustomMesh = currentShapeType === "customMesh"; // Assuming this type might exist

  // For GLB, these will be the override values from selectedShape
  // For CustomMesh, they come from materialProps
  // For others, directly from selectedShape
  const currentMaterialType = isCustomMesh
    ? selectedShape?.materialProps?.type
    : selectedShape?.material;
  const currentColor = isCustomMesh
    ? selectedShape?.materialProps?.color
    : selectedShape?.color;
  const currentRoughness = isCustomMesh
    ? selectedShape?.materialProps?.roughness
    : selectedShape?.roughness;
  const currentMetalness = isCustomMesh
    ? selectedShape?.materialProps?.metalness
    : selectedShape?.metalness;

  const isPBRMaterial = ["standard", "physical"].includes(currentMaterialType);

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
      const numericValue = isNaN(value)
        ? property === "scale"
          ? 0.01
          : 0
        : value;
      const newTransform = [...selectedShape[property]];
      newTransform[index] =
        property === "rotation"
          ? THREE.MathUtils.degToRad(numericValue)
          : Math.max(property === "scale" ? 0.01 : -Infinity, numericValue);
      updateShape(selectedShape.id, { [property]: newTransform });
    },
    [selectedShape, updateShape]
  );

  const handleGenericUpdate = useCallback(
    (property, value) => {
      if (!selectedShape) return;
      if (
        isCustomMesh &&
        (property === "color" ||
          property === "roughness" ||
          property === "metalness" ||
          property === "material")
      ) {
        const newMaterialProps = {
          ...(selectedShape.materialProps || {}),
          [property === "material" ? "type" : property]: value,
        };
        updateShape(selectedShape.id, { materialProps: newMaterialProps });
      } else {
        // This handles updates for standard shapes AND importedGLB overrides
        updateShape(selectedShape.id, { [property]: value });
      }
    },
    [selectedShape, updateShape, isCustomMesh]
  );

  const handleAnimationUpdate = useCallback(
    (property, value) => {
      /* ... as before ... */ if (!selectedShape) return;
      const currentAnim = selectedShape.animation || {
        type: "none",
        speed: 1,
        axis: "y",
        orbitCenter: [0, 0, 0],
        orbitRadius: 5,
        orbitPlane: "xz",
      };
      updateShape(selectedShape.id, {
        animation: { ...currentAnim, [property]: value },
      });
    },
    [selectedShape, updateShape]
  );
  const handleOrbitCenterUpdate = useCallback(
    (index, valueStr) => {
      /* ... as before ... */ if (!selectedShape?.animation) return;
      const val = parseFloat(valueStr);
      if (isNaN(val)) return;
      const newOC = [...(selectedShape.animation.orbitCenter || [0, 0, 0])];
      newOC[index] = val;
      handleAnimationUpdate("orbitCenter", newOC);
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
          if (selectedShape.scale?.[1]) {
            if (selectedShape.type === "pyramid") yO = 0;
            else if (selectedShape.type === "text")
              yO =
                (selectedShape.textSize || 0.5) * selectedShape.scale[1] * 0.5;
            else if (selectedShape.type === "imagePlane")
              yO =
                ((selectedShape.planeHeight || 1) * selectedShape.scale[1]) / 2;
            else if (
              selectedShape.type === "importedGLB" ||
              selectedShape.type === "customMesh"
            )
              yO = 0; // Assume origin handled by model or at base
            else yO = selectedShape.scale[1] * 0.5;
          }
          updateShape(selectedShape.id, { position: [0, yO, 0] });
        },
        randomColor: () => {
          if (isImagePlane) {
            alert("Cannot apply random color to an image plane.");
            return;
          }
          const nC = `#${Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")}`;
          if (isCustomMesh) handleGenericUpdate("color", nC);
          else updateShape(selectedShape.id, { color: nC }); // Works for standard & GLB override
        },
      };
      actions[action]?.();
    },
    [
      selectedShape,
      updateShape,
      isImagePlane,
      isCustomMesh,
      handleGenericUpdate,
    ]
  );

  const textureSlots = [
    { id: "map", name: "Color/Albedo" },
    { id: "normalMap", name: "Normal" },
    { id: "roughnessMap", name: "Roughness" },
    { id: "metalnessMap", name: "Metalness" },
    { id: "aoMap", name: "Ambient Occlusion" },
    { id: "emissiveMap", name: "Emissive" },
  ];
  const textSpecificTextureSlots = [
    { id: "map", name: "Face Color" },
    { id: "normalMap", name: "Face Normal" },
  ];

  const handleTriggerTextureUpload = useCallback(
    (mapType, isTextSpecific = false) => {
      if (!selectedShape) return;
      // For importedGLB, isTextSpecific is false, uses shapeTextureFileInputRefs
      const refs = isTextSpecific
        ? textTextureFileInputRefs
        : shapeTextureFileInputRefs;
      if (refs.current && refs.current[mapType]) {
        refs.current[mapType].click();
      } else {
        console.warn(
          `PropertiesPanel: File input ref for mapType "${mapType}" (text: ${isTextSpecific}) not found.`
        );
      }
    },
    [selectedShape, shapeTextureFileInputRefs, textTextureFileInputRefs]
  );

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className='w-80 p-4 bg-card/70 backdrop-blur-md border-l border-border/60 overflow-y-auto shadow-2xl scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800'
    >
      <AnimatePresence mode='wait'>
        {selectedShape ? (
          <motion.div
            key={selectedShape.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className='space-y-4'
          >
            {/* Header: Name, ID, Duplicate, Delete */}
            <div className='flex justify-between items-center mb-2'>
              <div className='min-w-0'>
                <h3
                  className='text-lg font-semibold truncate'
                  title={selectedShape.name || currentShapeType}
                >
                  {selectedShape.name || currentShapeType}
                </h3>
                <p className='text-xs text-muted-foreground'>
                  ID: ...{selectedShape.id.slice(-6)}
                </p>
              </div>
              <div className='flex space-x-1'>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={duplicateShape}
                      variant='ghost'
                      size='icon'
                      className='w-7 h-7'
                    >
                      <CopyIcon size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Duplicate (Ctrl+D)</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => removeShape(selectedShape.id)}
                      variant='ghost'
                      size='icon'
                      className='w-7 h-7 text-destructive hover:text-destructive hover:bg-destructive/10'
                    >
                      <Trash2 size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete (Del/Backspace)</TooltipContent>
                </Tooltip>
              </div>
            </div>
            <Separator />

            {/* Text Settings */}
            {isText && (
              <Card className='bg-background/50'>
                <CardHeader className='pb-2 pt-3 px-3'>
                  <CardTitle className='text-sm font-medium flex items-center'>
                    <TypeIcon size={14} className='mr-1.5 text-blue-400' />
                    Text Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3 px-3 pb-3'>
                  <div>
                    <Label htmlFor='text-content' className='text-xs'>
                      Content
                    </Label>
                    <Input
                      id='text-content'
                      value={selectedShape.text || ""}
                      onChange={(e) =>
                        handleGenericUpdate("text", e.target.value)
                      }
                      placeholder='Enter text...'
                      className='mt-1 h-8 text-xs'
                    />
                  </div>
                  <div>
                    <Label className='text-xs'>
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
                      className='mt-1.5'
                    />
                  </div>
                  <div>
                    <Label className='text-xs'>
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
                      className='mt-1.5'
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Custom Extruded Settings */}
            {isCustomExtruded && (
              <Card className='bg-background/50'>
                <CardHeader className='pb-2 pt-3 px-3'>
                  <CardTitle className='text-sm font-medium flex items-center'>
                    {popularShapeIcons[
                      selectedShape.shapeType?.toLowerCase()
                    ] || "💖"}{" "}
                    Custom Shape
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3 px-3 pb-3'>
                  <div>
                    <Label className='text-xs'>
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
                      className='mt-1.5'
                    />
                  </div>
                  <div>
                    <Label className='text-xs'>
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
                      className='mt-1.5'
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Transform Card */}
            <Card className='bg-background/50'>
              <CardHeader className='pb-2 pt-3 px-3'>
                <CardTitle className='text-sm font-medium flex items-center'>
                  <LayersIconLucide
                    size={14}
                    className='mr-1.5 text-green-400'
                  />
                  Transform
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3 px-3 pb-3'>
                {["position", "rotation", "scale"].map((prop) => (
                  <div key={prop} className='space-y-1.5'>
                    <h4 className='font-medium text-xs capitalize'>{prop}</h4>
                    {["X", "Y", "Z"].map((axis, index) => (
                      <div
                        key={axis}
                        className='grid grid-cols-6 items-center gap-2'
                      >
                        <Label
                          htmlFor={`${prop}-${axis}`}
                          className='text-xs col-span-1'
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
                          className='col-span-2 h-7 text-xs'
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
                          className='col-span-3'
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Appearance Card (for standard shapes, text, custom, AND GLB overrides) */}
            {!isImagePlane && (
              <Card className='bg-background/50'>
                <CardHeader className='pb-2 pt-3 px-3'>
                  <CardTitle className='text-sm font-medium flex items-center'>
                    <Palette size={14} className='mr-1.5 text-purple-400' />
                    {isImportedGLB ? "Override Appearance" : "Appearance"}
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3 px-3 pb-3'>
                  <div>
                    <Label className='text-xs'>Material</Label>
                    <Select
                      value={currentMaterialType || "standard"}
                      onValueChange={(v) => handleGenericUpdate("material", v)}
                    >
                      <SelectTrigger className='mt-1 h-8 text-xs'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {materialOptions.map((m) => (
                          <SelectItem
                            key={m.type}
                            value={m.type}
                            className='text-xs'
                          >
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className='text-xs'>Color</Label>
                    <div className='flex items-center space-x-2 mt-1'>
                      <Input
                        type='color'
                        value={
                          currentColor ||
                          (isImportedGLB
                            ? selectedShape?.color || "#ffffff"
                            : "#ffffff")
                        }
                        onChange={(e) =>
                          handleGenericUpdate("color", e.target.value)
                        }
                        className='p-0.5 h-8 w-10 rounded-md border cursor-pointer'
                      />
                      <Input
                        value={
                          currentColor ||
                          (isImportedGLB
                            ? selectedShape?.color || "#ffffff"
                            : "#ffffff")
                        }
                        onChange={(e) =>
                          handleGenericUpdate("color", e.target.value)
                        }
                        className='flex-1 h-8 text-xs'
                      />
                    </div>
                  </div>
                  {isPBRMaterial && (
                    <>
                      {" "}
                      <Separator className='my-2' />{" "}
                      <div>
                        <Label className='text-xs'>
                          Roughness:{" "}
                          {Number(
                            currentRoughness ||
                              (isImportedGLB
                                ? selectedShape?.roughness !== undefined
                                  ? selectedShape.roughness
                                  : 0.5
                                : 0.5)
                          ).toFixed(2)}
                        </Label>
                        <Slider
                          value={[
                            currentRoughness ||
                              (isImportedGLB
                                ? selectedShape?.roughness !== undefined
                                  ? selectedShape.roughness
                                  : 0.5
                                : 0.5),
                          ]}
                          onValueChange={([v]) =>
                            handleGenericUpdate("roughness", v)
                          }
                          max={1}
                          min={0}
                          step={0.01}
                          className='mt-1.5'
                        />
                      </div>
                      <div>
                        <Label className='text-xs'>
                          Metalness:{" "}
                          {Number(
                            currentMetalness ||
                              (isImportedGLB
                                ? selectedShape?.metalness !== undefined
                                  ? selectedShape.metalness
                                  : 0.0
                                : 0.0)
                          ).toFixed(2)}
                        </Label>
                        <Slider
                          value={[
                            currentMetalness ||
                              (isImportedGLB
                                ? selectedShape?.metalness !== undefined
                                  ? selectedShape.metalness
                                  : 0.0
                                : 0.0),
                          ]}
                          onValueChange={([v]) =>
                            handleGenericUpdate("metalness", v)
                          }
                          max={1}
                          min={0}
                          step={0.01}
                          className='mt-1.5'
                        />
                      </div>{" "}
                    </>
                  )}
                  <Separator className='my-2' />
                  <h4 className='text-xs font-semibold text-purple-300 flex items-center'>
                    <ImageUp size={12} className='mr-1' />
                    {isImportedGLB ? "Override Textures" : "Shape Textures"}
                  </h4>
                  <div className='grid grid-cols-2 gap-2'>
                    {textureSlots.map((slot) => {
                      // For GLB, textureProps on selectedShape store overrides.
                      // For others, it's direct.
                      const texProps = selectedShape.textureProps || {}; // Ensure textureProps exists
                      const currentUrl = texProps[`${slot.id}Url`];
                      return (
                        <div
                          key={`shape-tex-prop-${slot.id}`}
                          className='space-y-1'
                        >
                          <Label
                            htmlFor={`shape-tex-upload-${slot.id}`}
                            className='text-xs'
                          >
                            {slot.name}
                          </Label>{" "}
                          {currentUrl && (
                            <div className='relative group w-full aspect-square bg-muted rounded overflow-hidden mb-0.5'>
                              <img
                                src={currentUrl}
                                alt={`${slot.name} preview`}
                                className='w-full h-full object-cover'
                              />
                              <Button
                                variant='destructive'
                                size='icon'
                                className='absolute top-0.5 right-0.5 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity'
                                onClick={() =>
                                  handleClearTexture(
                                    selectedShape.id,
                                    slot.id,
                                    false
                                  )
                                }
                                title={`Clear ${slot.name}`}
                              >
                                <Trash2 size={10} />
                              </Button>
                            </div>
                          )}
                          <Button
                            variant='outline'
                            size='xs'
                            className='w-full text-xs'
                            onClick={() =>
                              handleTriggerTextureUpload(slot.id, false)
                            }
                          >
                            <ImageUp size={12} className='mr-1' />
                            {currentUrl ? "Change" : "Upload"}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                  {isText && (
                    <>
                      {" "}
                      <Separator className='my-2' />{" "}
                      <h4 className='text-xs font-semibold text-purple-300 flex items-center'>
                        <TypeIcon size={12} className='mr-1' />
                        Text Face Textures
                      </h4>{" "}
                      <div className='grid grid-cols-2 gap-2'>
                        {" "}
                        {textSpecificTextureSlots.map((slot) => {
                          const currentUrl =
                            selectedShape.textTextureProps?.[`${slot.id}Url`];
                          return (
                            <div
                              key={`text-tex-prop-${slot.id}`}
                              className='space-y-1'
                            >
                              <Label
                                htmlFor={`text-tex-upload-${slot.id}`}
                                className='text-xs'
                              >
                                {slot.name}
                              </Label>{" "}
                              {currentUrl && (
                                <div className='relative group w-full aspect-square bg-muted rounded overflow-hidden mb-0.5'>
                                  <img
                                    src={currentUrl}
                                    alt={`${slot.name} preview`}
                                    className='w-full h-full object-cover'
                                  />
                                  <Button
                                    variant='destructive'
                                    size='icon'
                                    className='absolute top-0.5 right-0.5 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity'
                                    onClick={() =>
                                      handleClearTexture(
                                        selectedShape.id,
                                        slot.id,
                                        true
                                      )
                                    }
                                    title={`Clear ${slot.name}`}
                                  >
                                    <Trash2 size={10} />
                                  </Button>
                                </div>
                              )}
                              <Button
                                variant='outline'
                                size='xs'
                                className='w-full text-xs'
                                onClick={() =>
                                  handleTriggerTextureUpload(slot.id, true)
                                }
                              >
                                <ImageUp size={12} className='mr-1' />
                                {currentUrl ? "Change" : "Upload"}
                              </Button>
                            </div>
                          );
                        })}{" "}
                      </div>{" "}
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Special card only for ImagePlane's inherent texture */}
            {isImagePlane && (
              <Card className='bg-background/50'>
                <CardHeader className='pb-2 pt-3 px-3'>
                  <CardTitle className='text-sm font-medium flex items-center'>
                    <Palette size={14} className='mr-1.5 text-purple-400' />
                    Appearance
                  </CardTitle>
                </CardHeader>
                <CardContent className='px-3 pb-3'>
                  <p className='text-xs text-muted-foreground'>
                    Image texture is part of this plane.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Animation Card */}
            <Card className='bg-background/50'>
              <CardHeader className='pb-2 pt-3 px-3'>
                <CardTitle className='text-sm font-medium'>
                  Animation (Object)
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3 px-3 pb-3'>
                <div>
                  <Label className='text-xs'>Type</Label>
                  <Select
                    value={animation.type}
                    onValueChange={(v) => handleAnimationUpdate("type", v)}
                  >
                    <SelectTrigger className='mt-1 h-8 text-xs'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["none", "rotate", "orbit"].map((t) => (
                        <SelectItem
                          key={t}
                          value={t}
                          className='text-xs capitalize'
                        >
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>{" "}
                {animation.type !== "none" && (
                  <>
                    {" "}
                    <div>
                      <Label className='text-xs'>
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
                        className='mt-1.5'
                      />
                    </div>{" "}
                    {animation.type === "rotate" && (
                      <div>
                        <Label className='text-xs'>Rotation Axis</Label>
                        <Select
                          value={animation.axis}
                          onValueChange={(v) =>
                            handleAnimationUpdate("axis", v)
                          }
                        >
                          <SelectTrigger className='mt-1 h-8 text-xs'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {["x", "y", "z"].map((ax) => (
                              <SelectItem
                                key={ax}
                                value={ax}
                                className='text-xs uppercase'
                              >
                                {ax}-Axis
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}{" "}
                    {animation.type === "orbit" && (
                      <>
                        {" "}
                        <div>
                          <Label className='text-xs'>
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
                            className='mt-1.5'
                          />
                        </div>
                        <div>
                          <Label className='text-xs'>Orbit Plane</Label>
                          <Select
                            value={animation.orbitPlane || "xz"}
                            onValueChange={(v) =>
                              handleAnimationUpdate("orbitPlane", v)
                            }
                          >
                            <SelectTrigger className='mt-1 h-8 text-xs'>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {["xy", "xz", "yz"].map((p) => (
                                <SelectItem
                                  key={p}
                                  value={p}
                                  className='text-xs uppercase'
                                >
                                  {p} Plane
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className='space-y-1'>
                          <Label className='text-xs'>Orbit Center</Label>
                          <div className='grid grid-cols-3 gap-2 items-center'>
                            {["X", "Y", "Z"].map((axName, idx) => (
                              <div key={axName}>
                                <Label
                                  htmlFor={`orbit-c-${axName}`}
                                  className='text-xs'
                                >
                                  {axName}
                                </Label>
                                <Input
                                  id={`orbit-c-${axName}`}
                                  type='number'
                                  value={(
                                    animation.orbitCenter[idx] || 0
                                  ).toString()}
                                  onChange={(e) =>
                                    handleOrbitCenterUpdate(idx, e.target.value)
                                  }
                                  className='h-7 text-xs mt-0.5'
                                  step='0.1'
                                />
                              </div>
                            ))}
                          </div>
                        </div>{" "}
                      </>
                    )}{" "}
                  </>
                )}{" "}
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className='bg-background/50'>
              <CardHeader className='pb-2 pt-3 px-3'>
                <CardTitle className='text-sm font-medium'>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className='px-3 pb-3'>
                <div className='grid grid-cols-2 gap-2'>
                  <Button
                    onClick={() => handleQuickAction("resetScale")}
                    variant='outline'
                    size='xs'
                    className='text-xs'
                  >
                    <ScaleIcon size={12} className='mr-1' />
                    Reset Scale
                  </Button>
                  <Button
                    onClick={() => handleQuickAction("resetRotation")}
                    variant='outline'
                    size='xs'
                    className='text-xs'
                  >
                    <RotateCcwIcon size={12} className='mr-1' />
                    Reset Rotation
                  </Button>
                  <Button
                    onClick={() => handleQuickAction("centerObject")}
                    variant='outline'
                    size='xs'
                    className='text-xs'
                  >
                    <CrosshairIcon size={12} className='mr-1' />
                    Center Object
                  </Button>{" "}
                  {!isImagePlane && (
                    <Button
                      onClick={() => handleQuickAction("randomColor")}
                      variant='outline'
                      size='xs'
                      className='text-xs'
                    >
                      <Palette size={12} className='mr-1' />
                      Random Color
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          /* Empty State for Properties Panel */ <motion.div
            key='empty-properties'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className='flex flex-col items-center justify-center h-full text-center'
          >
            <div className='text-5xl mb-4 text-muted-foreground'>🤷</div>
            <h3 className='text-lg font-medium mb-1'>No Object Selected</h3>
            <p className='text-sm text-muted-foreground mb-4'>
              Click an object in the scene or add a new one.
            </p>
            <Button
              onClick={() => addShape("box")}
              size='sm'
              className='w-full max-w-[180px]'
            >
              🧊 Add Cube
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
